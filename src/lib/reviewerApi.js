// Reviewer portal API client. Reviewer session token is kept separate from the
// admin/delegate token so the two logins never collide.

const API_BASE = import.meta.env?.VITE_API_BASE || "";
const TOKEN_KEY = "ltsi_reviewer_token";
const REVIEWER_KEY = "ltsi_reviewer";

export const getReviewerToken = () => {
  try { return localStorage.getItem(TOKEN_KEY) || ""; } catch { return ""; }
};
export const getReviewer = () => {
  try { const r = localStorage.getItem(REVIEWER_KEY); return r ? JSON.parse(r) : null; } catch { return null; }
};
function setSession(token, reviewer) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(REVIEWER_KEY, JSON.stringify(reviewer));
  } catch { /* ignore */ }
}
export function reviewerLogout() {
  try { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(REVIEWER_KEY); } catch { /* ignore */ }
}

async function req(path, { method = "GET", body, auth = false } = {}) {
  try {
    const res = await fetch(`${API_BASE}/api/reviewer${path}`, {
      method,
      headers: {
        ...(body ? { "content-type": "application/json" } : {}),
        ...(auth ? { authorization: `Bearer ${getReviewerToken()}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    if (res.status === 401) { reviewerLogout(); return { ok: false, status: 401, errors: ["Please log in again."] }; }
    return res.ok ? { ok: true, ...data } : { ok: false, status: res.status, errors: data.errors || ["Request failed."] };
  } catch (err) {
    return { ok: false, offline: true, errors: [err?.message || "Network error."] };
  }
}

export const reviewerApi = {
  requestOtp: (email) => req("/auth/request-otp", { method: "POST", body: { email } }),
  async verifyOtp(email, otp) {
    const res = await req("/auth/verify-otp", { method: "POST", body: { email, otp } });
    if (res.ok && res.token) setSession(res.token, res.reviewer);
    return res;
  },
  dashboard: () => req("/dashboard", { auth: true }),
  abstracts: () => req("/abstracts", { auth: true }),
  abstract: (id) => req(`/abstracts/${id}`, { auth: true }),
  review: (id) => req(`/abstracts/${id}/review`, { auth: true }),
  submitReview: (id, body) => req(`/abstracts/${id}/review`, { method: "POST", body, auth: true }),
};
