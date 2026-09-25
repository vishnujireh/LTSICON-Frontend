// Read-only client for the admin dashboard (/api/admin/*).
// Every request carries the logged-in user's Bearer token; the server enforces
// the ADMIN_EMAILS allowlist. This module never writes any data.

import { getToken } from "./serverAuth.js";

const API_BASE = import.meta.env?.VITE_API_BASE || "";

function qs(params = {}) {
  const s = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && String(v).trim() !== "") s.set(k, v);
  });
  const str = s.toString();
  return str ? `?${str}` : "";
}

async function get(path, params) {
  const token = getToken();
  try {
    const res = await fetch(`${API_BASE}/api/admin${path}${qs(params)}`, {
      headers: { authorization: `Bearer ${token}` },
    });
    const data = await res.json().catch(() => ({}));
    if (res.status === 401) return { ok: false, status: 401, errors: ["Please log in."] };
    if (res.status === 403) return { ok: false, status: 403, errors: ["Admin access required."] };
    return res.ok ? { ok: true, ...data } : { ok: false, status: res.status, errors: data.errors || ["Request failed."] };
  } catch (err) {
    return { ok: false, offline: true, errors: [err?.message || "Network error."] };
  }
}

async function send(method, path, body) {
  const token = getToken();
  try {
    const res = await fetch(`${API_BASE}/api/admin${path}`, {
      method,
      headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify(body || {}),
    });
    const data = await res.json().catch(() => ({}));
    if (res.status === 401) return { ok: false, status: 401, errors: ["Please log in."] };
    if (res.status === 403) return { ok: false, status: 403, errors: ["Admin access required."] };
    return res.ok ? { ok: true, ...data } : { ok: false, status: res.status, errors: data.errors || ["Request failed."] };
  } catch (err) {
    return { ok: false, offline: true, errors: [err?.message || "Network error."] };
  }
}

export const adminApi = {
  summary: () => get("/summary"),
  duplicates: () => get("/duplicates"),
  registrations: (params) => get("/registrations", params),
  registration: (id) => get(`/registrations/${id}`),
  updateRegistration: (id, body) => send("PUT", `/registrations/${id}`, body),
  deleteRegistration: (id) => send("DELETE", `/registrations/${id}`, {}),
  resendRegistration: (id) => send("POST", `/registrations/${id}/resend`, {}),
  abstracts: (params) => get("/abstracts", params),
  abstractAuthors: (params) => get("/abstract-authors", params),
  abstract: (id) => get(`/abstracts/${id}`),
  abstractsByEmail: (email) => get(`/abstracts/by-email/${encodeURIComponent(email)}`),
  updateAbstractStatus: (id, body) => send("PUT", `/abstracts/${id}/status`, body),

  // Abstract review module
  reviewers: (params) => get("/reviewers", params),
  createReviewer: (body) => send("POST", "/reviewers", body),
  updateReviewer: (id, body) => send("PATCH", `/reviewers/${id}`, body),
  reviewerAssignments: (id) => get(`/reviewers/${id}/assignments`),
  reviewSummary: () => get("/review-summary"),
  abstractReviews: (abstractId) => get(`/abstracts/${abstractId}/reviews`),
  assignReviewers: (abstractId, reviewerIds) => send("POST", `/abstracts/${abstractId}/reviewers`, { reviewerIds }),
  reassignReviewer: (abstractId, reviewerId, toReviewerId) => send("PATCH", `/abstracts/${abstractId}/reviewers/${reviewerId}`, { toReviewerId }),
  removeReviewer: (abstractId, reviewerId) => send("DELETE", `/abstracts/${abstractId}/reviewers/${reviewerId}`, {}),
};

// Build an authed download for the CSV exports and the abstract file.
// We fetch as a blob (the endpoints need the Authorization header) and trigger
// a browser download without leaving the page.
async function downloadBlob(url, fallbackName) {
  const token = getToken();
  const res = await fetch(url, { headers: { authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error("Download failed.");
  const blob = await res.blob();
  const disp = res.headers.get("content-disposition") || "";
  const match = /filename="?([^"]+)"?/.exec(disp);
  const name = match ? match[1] : fallbackName;
  const href = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = href;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(href);
}

export function exportRegistrationsCsv(params) {
  return downloadBlob(`${API_BASE}/api/admin/registrations/export${qs(params)}`, "registrations.csv");
}
export function exportAbstractsCsv(params) {
  return downloadBlob(`${API_BASE}/api/admin/abstracts/export${qs(params)}`, "abstracts.csv");
}
// Download the registration (main) tax invoice PDF.
export function downloadRegistrationInvoice(id) {
  return downloadBlob(`${API_BASE}/api/admin/registrations/${id}/invoice`, `invoice-${id}.pdf`);
}
// Download the invoice for a specific payment (registration or an add-on).
export function downloadPaymentInvoice(id, paymentId) {
  return downloadBlob(`${API_BASE}/api/admin/registrations/${id}/invoice/${encodeURIComponent(paymentId)}`, `invoice-${paymentId}.pdf`);
}
// Abstract attachment (public download endpoint — no token needed).
export function abstractFileUrl(fileName) {
  return `${API_BASE}/api/abstracts/file/${encodeURIComponent(fileName)}`;
}
// Full review data export (CSV, one row per judge).
export function exportReviewsCsv() {
  return downloadBlob(`${API_BASE}/api/admin/review-export`, "abstract-reviews.csv");
}
