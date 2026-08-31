// Thin client for the LTSICON backend.
//
// Design goal: NEVER break the existing UI. Every call is best-effort — if the
// backend is down or misconfigured, these resolve to { ok:false } instead of
// throwing, and the localStorage-based flow keeps working exactly as before.
//
// Set the API origin at build time with VITE_API_BASE (defaults to localhost).

const API_BASE = import.meta.env?.VITE_API_BASE || "";

async function request(path, { method = "POST", body, isForm = false } = {}) {
  try {
    const res = await fetch(`${API_BASE}/api${path}`, {
      method,
      headers: isForm ? undefined : { "content-type": "application/json" },
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

/**
 * Final-step payment confirmation for an existing reference.
 * If a `screenshot` (File) is provided it's sent as multipart/form-data with the
 * rest of the payload JSON-encoded in a `payload` field; otherwise plain JSON.
 */
export function confirmRegistration(reference, payload) {
  const { screenshot, ...rest } = payload || {};
  const path = `/registrations/${encodeURIComponent(reference)}`;
  if (screenshot) {
    const fd = new FormData();
    fd.append("payload", JSON.stringify(rest));
    fd.append("screenshot", screenshot);
    return request(path, { method: "PUT", body: fd, isForm: true });
  }
  return request(path, { method: "PUT", body: rest });
}
