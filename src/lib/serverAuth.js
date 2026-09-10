// Real, server-backed authentication (accounts in MySQL, /api/auth/* endpoints).
// The login token + a cached user object are kept in localStorage so getCurrentUser()
// stays synchronous for the UI; every write notifies listeners.
//
// This is independent of the payment/registration APIs — it only talks to /api/auth.

const API_BASE = import.meta.env?.VITE_API_BASE || "";
const TOKEN_KEY = "ltsi_token";
const USER_KEY = "ltsi_user";
const EVENT = "ltsi:auth";

function read(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
function write(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {
    /* ignore */
  }
}
function remove(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

export function notifyAuthChange() {
  window.dispatchEvent(new CustomEvent(EVENT));
}
export function onAuthChange(cb) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY) || "";
  } catch {
    return "";
  }
};
export const getCurrentUser = () => read(USER_KEY);
// Kept for API-compatibility with the old localStorage auth (used by the gate).
export const getAccount = () => read(USER_KEY);

function setSession(token, user) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    /* ignore */
  }
  write(USER_KEY, user);
  notifyAuthChange();
}

async function request(path, body) {
  try {
    const res = await fetch(`${API_BASE}/api/auth${path}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body || {}),
    });
    const data = await res.json().catch(() => ({}));
    return res.ok ? { ok: true, ...data } : { ok: false, errors: data.errors || ["Request failed."] };
  } catch (err) {
    return { ok: false, offline: true, errors: [err?.message || "Network error."] };
  }
}

/** Create an account. On success, logs the user in. */
export async function register({ name, email, password }) {
  const res = await request("/register", { name, email, password });
  if (res.ok && res.token) setSession(res.token, res.user);
  return res;
}

/** Log in with email + password. */
export async function login(email, password) {
  const res = await request("/login", { email, password });
  if (res.ok && res.token) setSession(res.token, res.user);
  return res;
}

export function logout() {
  remove(TOKEN_KEY);
  remove(USER_KEY);
  notifyAuthChange();
}

/** Request a password-reset email. Always resolves ok (server never reveals existence). */
export function forgotPassword(email) {
  return request("/forgot-password", { email });
}

/** Set a new password using the token from the reset email link. */
export function resetPassword(token, password) {
  return request("/reset-password", { token, password });
}

/** Validate the stored token against the server; refreshes/clears the cached user. */
export async function refreshUser() {
  const token = getToken();
  if (!token) return null;
  try {
    const res = await fetch(`${API_BASE}/api/auth/me`, {
      headers: { authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      logout();
      return null;
    }
    const data = await res.json();
    write(USER_KEY, data.user);
    notifyAuthChange();
    return data.user;
  } catch {
    return getCurrentUser(); // offline — keep cached
  }
}
