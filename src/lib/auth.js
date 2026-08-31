// Lightweight client-side auth + registration-draft persistence.
// No backend: an account and an in-progress registration are stored in
// localStorage so a delegate can leave after Step 1 and log back in later
// to finish payment.

const ACCOUNT_KEY = "ltsi_account";
const SESSION_KEY = "ltsi_session";
const DRAFT_KEY = "ltsi_draft";
const EVENT = "ltsi:auth";

function read(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore quota / privacy-mode errors */
  }
}
function remove(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    /* noop */
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

export function getAccount() {
  return read(ACCOUNT_KEY);
}

// Create (or overwrite) the account and start a session.
export function createAccount(account) {
  write(ACCOUNT_KEY, account);
  write(SESSION_KEY, { email: account.email, at: Date.now() });
  notifyAuthChange();
}

// Returns the logged-in user, or null.
export function getCurrentUser() {
  const session = read(SESSION_KEY);
  const account = getAccount();
  if (session && account && session.email === account.email) return account;
  return null;
}

export function login(email, password) {
  const account = getAccount();
  if (!account) return { ok: false, error: "No account found for this email. Please register first." };
  if (account.email.toLowerCase() !== String(email).trim().toLowerCase())
    return { ok: false, error: "No account found for this email." };
  if (account.password !== password) return { ok: false, error: "Incorrect password." };
  write(SESSION_KEY, { email: account.email, at: Date.now() });
  notifyAuthChange();
  return { ok: true, account };
}

export function logout() {
  remove(SESSION_KEY);
  notifyAuthChange();
}

export function saveDraft(draft) {
  write(DRAFT_KEY, draft);
}
export function getDraft() {
  return read(DRAFT_KEY);
}
export function clearDraft() {
  remove(DRAFT_KEY);
}
