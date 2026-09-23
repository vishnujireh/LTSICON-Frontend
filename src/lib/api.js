// Thin client for the LTSICON backend.
//
// Design goal: NEVER break the existing UI. Every call is best-effort — if the
// backend is down or misconfigured, these resolve to { ok:false } instead of
// throwing, and the localStorage-based flow keeps working exactly as before.
//
// Set the API origin at build time with VITE_API_BASE (defaults to localhost).

const API_BASE = import.meta.env?.VITE_API_BASE || "";

// Read the login token (shared with serverAuth.js) for authed calls.
function authHeader() {
  try {
    const t = localStorage.getItem("ltsi_token");
    return t ? { authorization: `Bearer ${t}` } : {};
  } catch {
    return {};
  }
}

async function request(path, { method = "POST", body, isForm = false, auth = false } = {}) {
  try {
    const res = await fetch(`${API_BASE}/api${path}`, {
      method,
      headers: {
        ...(isForm ? {} : { "content-type": "application/json" }),
        ...(auth ? authHeader() : {}),
      },
      body: isForm ? body : body ? JSON.stringify(body) : undefined,
    });
    let data = null;
    try {
      data = await res.json();
    } catch {
      /* non-JSON response */
    }
    if (!res.ok) {
      return { ok: false, status: res.status, errors: data?.errors || ["Request failed."] };
    }
    return { ok: true, status: res.status, ...(data || {}) };
  } catch (err) {
    // Network error / backend offline — don't surface as a thrown exception.
    return { ok: false, offline: true, errors: [err?.message || "Network error."] };
  }
}

/**
 * Submit an abstract. Pass a plain object of fields; if `file` (a File) is
 * present it's sent as multipart/form-data, otherwise as JSON.
 */
export function submitAbstract(fields) {
  const { file, ...rest } = fields;
  if (file) {
    const fd = new FormData();
    Object.entries(rest).forEach(([k, v]) =>
      fd.append(k, Array.isArray(v) ? JSON.stringify(v) : v ?? "")
    );
    fd.append("file", file);
    return request("/abstracts", { body: fd, isForm: true });
  }
  return request("/abstracts", { body: rest });
}

/** Step 1 lead capture. */
export function createRegistration(payload) {
  return request("/registrations", { body: payload });
}

/** For the logged-in delegate: existing paid registration + purchased workshops. */
export function myRegistrationSummary() {
  return request("/registrations/my-summary", { method: "GET", auth: true });
}

/** Mark a pending registration as failed (called when a Razorpay payment fails). */
export function markRegistrationFailed(reference) {
  return request(`/registrations/${encodeURIComponent(reference)}/fail`, { method: "PUT" });
}

/** Create a Razorpay order for the given amount (major units, e.g. rupees). */
export function createPaymentOrder({ amount, currency, reference }) {
  return request("/payments/order", { body: { amount, currency, reference } });
}

/** Loads the Razorpay Checkout script once; resolves true when window.Razorpay is ready. */
export function loadRazorpay() {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

/**
 * Final-step payment confirmation for an existing reference (JSON).
 * Includes the verified Razorpay ids (order/payment/signature).
 */
export function confirmRegistration(reference, payload) {
  return request(`/registrations/${encodeURIComponent(reference)}`, {
    method: "PUT",
    body: payload || {},
  });
}
