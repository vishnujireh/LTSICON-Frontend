import { useEffect, useState, useCallback } from "react";
import {
  getCurrentUser,
  login as authLogin,
  logout as authLogout,
  refreshUser,
  onAuthChange,
} from "../lib/serverAuth.js";
import {
  adminApi,
  exportRegistrationsCsv,
  exportAbstractsCsv,
  abstractFileUrl,
  downloadRegistrationInvoice,
} from "../lib/adminApi.js";

// ── Small UI helpers ──────────────────────────────────
// Date only (no time), e.g. "2026-09-22".
const fmtDate = (v) => (v ? String(v).replace("T", " ").slice(0, 10) : "—");
const money = (v, cur) =>
  v === null || v === undefined ? "—" : `${cur === "USD" ? "$" : "₹"}${Number(v).toLocaleString("en-IN")}`;

function Card({ label, value, sub }) {
  return (
    <div className="rounded-2xl border border-[#E7D9BB] bg-white p-5 shadow-[0_10px_30px_-22px_rgba(110,26,43,0.4)]">
      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#8A6A12]">{label}</p>
      <p className="mt-2 font-serif text-3xl font-bold text-[#6E1A2B]">{value}</p>
      {sub ? <p className="mt-1 text-xs text-[#6E5C54]">{sub}</p> : null}
    </div>
  );
}

function StatusPill({ status }) {
  const map = {
    paid: "bg-green-100 text-green-800",
    pending: "bg-amber-100 text-amber-800",
    failed: "bg-red-100 text-red-800",
    sent: "bg-green-100 text-green-800",
    skipped: "bg-slate-100 text-slate-700",
  };
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${map[status] || "bg-slate-100 text-slate-700"}`}>
      {status || "—"}
    </span>
  );
}

// Abstract review status: canonical key → label + badge colours.
const ABSTRACT_STATUS = {
  under_review: { label: "Under Review", cls: "bg-amber-100 text-amber-800" },
  accepted: { label: "Accepted", cls: "bg-green-100 text-green-800" },
  rejected: { label: "Rejected", cls: "bg-red-100 text-red-800" },
  duplicate: { label: "Duplicate", cls: "bg-orange-100 text-orange-800" },
};
const STATUS_OPTIONS = Object.entries(ABSTRACT_STATUS).map(([k, v]) => [k, v.label]);

function AbstractStatusBadge({ status }) {
  const s = ABSTRACT_STATUS[status] || ABSTRACT_STATUS.under_review;
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.cls}`}>
      {s.label}
    </span>
  );
}

// ── Login gate (reuses the site's real accounts) ──────
function LoginGate({ onLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    const res = await authLogin(email.trim().toLowerCase(), password);
    setBusy(false);
    if (res.ok) onLoggedIn();
    else setError((res.errors && res.errors[0]) || "Login failed.");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F4ECD9] px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl border border-[#E7D9BB] bg-white p-8 shadow-lg">
        <h1 className="font-serif text-2xl font-bold text-[#6E1A2B]">Admin Login</h1>
        <p className="mt-1 text-sm text-[#6E5C54]">LTSICON Chennai 2026 — dashboard</p>
        {error ? <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
        <label className="mt-5 block text-sm font-medium text-[#33242A]">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 w-full rounded-lg border border-[#E7D9BB] px-3 py-2 text-sm focus:border-[#6E1A2B] focus:outline-none"
        />
        <label className="mt-4 block text-sm font-medium text-[#33242A]">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1 w-full rounded-lg border border-[#E7D9BB] px-3 py-2 text-sm focus:border-[#6E1A2B] focus:outline-none"
        />
        <button
          type="submit"
          disabled={busy}
          className="mt-6 w-full rounded-full bg-[#6E1A2B] py-2.5 text-sm font-semibold text-[#FBF1DD] transition hover:bg-[#4A1220] disabled:opacity-60 cursor-pointer"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
        <a href="/" className="mt-4 block text-center text-xs text-[#6E5C54] underline  cursor-pointer">← Back to site</a>
      </form>
    </div>
  );
}

function Field({ label, value }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="border-b border-[#F0E7D3] py-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#8A6A12]">{label}</p>
      <p className="mt-0.5 whitespace-pre-wrap break-words text-sm text-[#33242A]">{String(value)}</p>
    </div>
  );
}

// ── Main dashboard ────────────────────────────────────
export default function AdminDashboard() {
  const [user, setUser] = useState(() => getCurrentUser());
  const [authChecked, setAuthChecked] = useState(false);
  const [forbidden, setForbidden] = useState(false);

  const [summary, setSummary] = useState(null);
  const [dupes, setDupes] = useState({ registrations: { emails: [] }, abstracts: { emails: [], titles: [] } });
  const [tab, setTab] = useState("registrations");

  // Validate the token against the server on mount.
  useEffect(() => {
    let alive = true;
    refreshUser().then((u) => {
      if (!alive) return;
      setUser(u || getCurrentUser());
      setAuthChecked(true);
    });
    return onAuthChange(() => setUser(getCurrentUser()));
  }, []);

  const loadTopline = useCallback(async () => {
    const [s, d] = await Promise.all([adminApi.summary(), adminApi.duplicates()]);
    if (s.status === 403 || d.status === 403) {
      setForbidden(true);
      return;
    }
    if (s.ok) setSummary(s);
    if (d.ok) setDupes({ registrations: d.registrations, abstracts: d.abstracts });
  }, []);

  useEffect(() => {
    if (user) loadTopline();
  }, [user, loadTopline]);

  if (!authChecked) {
    return <div className="flex min-h-screen items-center justify-center bg-[#F4ECD9] text-[#6E5C54]">Loading…</div>;
  }
  if (!user) return <LoginGate onLoggedIn={() => { setForbidden(false); setUser(getCurrentUser()); }} />;
  if (forbidden) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#F4ECD9] px-4 text-center">
        <h1 className="font-serif text-2xl font-bold text-[#6E1A2B]">Admin access required</h1>
        <p className="text-sm text-[#6E5C54]">The account <b>{user.email}</b> is not on the admin list.</p>
        <button
          onClick={() => { authLogout(); setUser(null); setForbidden(false); }}
          className="rounded-full bg-[#6E1A2B] px-5 py-2 text-sm font-semibold text-[#FBF1DD]  cursor-pointer"
        >
          Sign in with a different account
        </button>
        <a href="/" className="text-xs text-[#6E5C54] underline  cursor-pointer">← Back to site</a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4ECD9] pb-16">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-[#E7D9BB] bg-[#6E1A2B] px-4 py-3 text-[#FBF1DD] sm:px-5 sm:py-4 lg:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="font-serif text-base font-bold sm:text-lg">LTSICON 2026 — Admin</h1>
            <p className="truncate text-xs opacity-80">{user.email}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <a href="/" className="hidden text-xs underline opacity-90 hover:opacity-100 sm:inline cursor-pointer">View site</a>
            <button
              onClick={() => { authLogout(); setUser(null); }}
              className="rounded-full border border-[#FBF1DD]/40 px-3 py-1.5 text-xs font-semibold hover:bg-[#FBF1DD]/10 sm:px-4 cursor-pointer"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pt-6 sm:px-5 sm:pt-8 lg:px-10">
        {/* Tabs */}
        <div className="flex gap-2 border-b border-[#E7D9BB]">
          {[["registrations", "Registrations"], ["abstracts", "Abstracts"]].map(([k, label]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-semibold transition cursor-pointer ${
                tab === k ? "border-[#6E1A2B] text-[#6E1A2B]" : "border-transparent text-[#6E5C54] hover:text-[#6E1A2B]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "registrations" ? (
          <RegistrationsTab summary={summary} dupEmails={dupes.registrations.emails} />
        ) : (
          <AbstractsTab summary={summary} dupTitles={dupes.abstracts.titles} />
        )}
      </main>
    </div>
  );
}

// ── Registrations tab ─────────────────────────────────
function RegistrationsTab({ summary, dupEmails }) {
  const [filters, setFilters] = useState({ q: "", status: "", from: "", to: "", page: 1, pageSize: 10 });
  const [data, setData] = useState({ rows: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState(null);
  const [editing, setEditing] = useState(null);
  const [resendId, setResendId] = useState(null);
  const [toast, setToast] = useState(null); // { ok, text }

  const load = useCallback(async () => {
    setLoading(true);
    const res = await adminApi.registrations(filters);
    setLoading(false);
    if (res.ok) setData({ rows: res.rows, total: res.total });
  }, [filters]);

  useEffect(() => { load(); }, [load]);

  const openEdit = async (id) => {
    const res = await adminApi.registration(id);
    if (res.ok) setEditing(res.registration);
  };

  const resend = async (id) => {
    setResendId(id);
    const res = await adminApi.resendRegistration(id);
    setResendId(null);
    setToast(
      res.ok
        ? { ok: true, text: `Confirmation email re-sent to ${res.to}.` }
        : { ok: false, text: (res.errors && res.errors[0]) || `Could not send (status: ${res.emailStatus || "failed"}).` }
    );
    setTimeout(() => setToast(null), 5000);
  };

  const isDupe = (email) => dupEmails.includes(String(email || "").toLowerCase());
  const pages = Math.max(1, Math.ceil(data.total / filters.pageSize));

  const openDetail = async (id) => {
    const res = await adminApi.registration(id);
    if (res.ok) setDetail(res.registration);
  };

  // Registration detail opens as its own full page (not a slide-over).
  if (detail) {
    return <RegistrationDetail registration={detail} onBack={() => setDetail(null)} />;
  }
  // Edit opens as its own full page with the existing values.
  if (editing) {
    return (
      <RegistrationEdit
        registration={editing}
        onBack={() => setEditing(null)}
        onSaved={() => { setEditing(null); setToast({ ok: true, text: "Registration updated." }); setTimeout(() => setToast(null), 4000); load(); }}
      />
    );
  }

  return (
    <div className="mt-6">
      {/* Registration summary cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card label="Registrations" value={summary?.registrations.total ?? "—"}  />
        {/* sub={`${summary?.registrations.paid ?? 0} paid`} */}
        <Card label="Paid" value={summary?.registrations.paid ?? "—"} />
        <Card label="Pending" value={summary?.registrations.pending ?? "—"} />
        <Card
          label="Duplicate Emails"
          value={`${dupEmails.length}`}
          // sub="Duplicate emails"${summary?.registrations.failed ?? 0} ·
        />
      </div>

      {toast ? (
        <div className={`mb-4 rounded-xl px-4 py-3 text-sm font-medium ${toast.ok ? "bg-green-50 text-green-800" : "bg-red-50 text-red-700"}`}>
          {toast.text}
        </div>
      ) : null}

      <Toolbar
        filters={filters}
        setFilters={setFilters}
        statusOptions={[["", "All statuses"], ["paid", "Paid"], ["pending", "Pending"], ["failed", "Failed"]]}
        onExport={() => exportRegistrationsCsv(filters)}
        searchPlaceholder="Search name, email, phone, order no…"
      />

      <div className="mt-4 overflow-x-auto rounded-2xl border border-[#E7D9BB] bg-white">
        <table className="w-full min-w-[840px] text-left text-sm">
          <thead className="bg-[#F5F0E3] text-xs uppercase tracking-wide text-[#8A6A12]">
            <tr>
              {["Sl.No", "Order No", "Name", "Email", "Phone", "Payment", "Date", "Action"].map((h) => (
                <th key={h} className="px-4 py-3 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={10} className="px-4 py-8 text-center text-[#6E5C54]">Loading…</td></tr>
            ) : data.rows.length === 0 ? (
              <tr><td colSpan={10} className="px-4 py-8 text-center text-[#6E5C54]">No registrations found.</td></tr>
            ) : (
              data.rows.map((r, i) => (
                <tr key={r.id} className={`border-t border-[#F0E7D3] ${isDupe(r.email) ? "bg-amber-50" : ""}`}>
                  <td className="px-4 py-3 text-[#6E5C54]">{(filters.page - 1) * filters.pageSize + i + 1}</td>
                  <td className="px-4 py-3 font-mono text-xs">{r.order_no || r.reference || `#${r.id}`}</td>
                  <td className="px-4 py-3 font-medium text-[#33242A]">
                    {r.name}
                    {r.reg_type === "addon" ? <span className="ml-2 rounded bg-[#F3E7C6] px-1.5 py-0.5 text-[10px] font-semibold text-[#6E1A2B]">ADD-ON</span> : null}
                  </td>
                  <td className="px-4 py-3">
                    {r.email}
                    {isDupe(r.email) ? <span className="ml-2 rounded bg-amber-200 px-1.5 py-0.5 text-[10px] font-semibold text-amber-900">DUP</span> : null}
                  </td>
                  <td className="px-4 py-3">{r.phone || "—"}</td> 
                  <td className="px-4 py-3"><StatusPill status={r.payment_status} /></td>
                  <td className="px-4 py-3 text-xs text-[#6E5C54]">{fmtDate(r.created_at)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 whitespace-nowrap">
                      <button onClick={() => openDetail(r.id)} className="text-xs font-semibold text-[#6E1A2B] underline cursor-pointer">View</button>
                      <button onClick={() => openEdit(r.id)} className="text-xs font-semibold text-[#6E1A2B] underline cursor-pointer">Edit</button>
                      <button
                        onClick={() => resend(r.id)}
                        disabled={resendId === r.id}
                        className="text-xs font-semibold text-[#6E1A2B] underline disabled:opacity-50 cursor-pointer"
                      >
                        {resendId === r.id ? "Sending…" : "Resend"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pager page={filters.page} pages={pages} total={data.total} onPage={(p) => setFilters((f) => ({ ...f, page: p }))} />
    </div>
  );
}

// ── Registration detail — full page (back button on the right) ──
function RegistrationDetail({ registration: r, onBack }) {
  const cur = r.currency;
  return (
    <div className="mt-6">
      {/* Header: actions on the right */}
      <div className="mb-4 flex items-center justify-end gap-2">
        {r.payment_status === "paid" && (
          <button
            onClick={() => downloadRegistrationInvoice(r.id)}
            className="inline-flex items-center gap-1 rounded-full border border-[#6E1A2B] bg-white px-4 py-2 text-sm font-semibold text-[#6E1A2B] hover:bg-[#6E1A2B] hover:text-[#FBF1DD] cursor-pointer"
          >
            ↓ Invoice
          </button>
        )}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1 rounded-full border border-[#E7D9BB] bg-white px-4 py-2 text-sm font-semibold text-[#6E1A2B] hover:bg-[#F4ECD9] cursor-pointer"
        >
          ← Back
        </button>
      </div>

      <div className="rounded-2xl border border-[#E7D9BB] bg-white p-5 shadow-[0_10px_30px_-22px_rgba(110,26,43,0.4)] sm:p-7">
        <div className="flex flex-col items-start gap-3 border-b border-[#F0E7D3] pb-4">
          <span className="rounded-lg bg-[#6E1A2B] px-3 py-1 font-mono text-sm font-semibold text-[#FBF1DD]">
           {r.order_no || r.reference || `#${r.id}`}
          </span>
          <h2 className="font-serif text-xl font-bold text-[#6E1A2B] sm:text-2xl">{r.name} <StatusPill status={r.payment_status} /></h2>
        </div>
        <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
          <Field label="Name" value={r.name} />
          <Field label="Email" value={r.email} />
          <Field label="Phone" value={r.phone} />
          <Field label="Designation" value={r.designation} />
          <Field label="Institution" value={r.institution} />
          <Field label="Address" value={r.address} />
          <Field label="MCI Number" value={r.mci_number} />
          <Field label="MCI State" value={r.mci_state} />
          <Field label="Category" value={r.category} />
          <Field label="LTSI Member No" value={r.ltsi_member_no} />
          <Field label="Type" value={r.reg_type === "addon" ? "Add-on (workshops)" : "Full registration"} />
          <Field label="Parent Order" value={r.parent_ref} />
          <Field label="Phase" value={r.phase} />
          <Field label="Payment Status" value={r.payment_status} />
          {/* <Field label="Email Status" value={r.email_status} /> */}
          {/* <Field label="Razorpay Payment ID" value={r.razorpay_payment_id} />
          <Field label="Razorpay Order ID" value={r.razorpay_order_id} /> */}
          <Field label="Date" value={fmtDate(r.created_at)} />
        </div>

        <div className="mt-2">
          {r.workshops && r.workshops.length > 0 ? <Field label="Workshops" value={fmtJson(r.workshops)} /> : null}
          {/* <Field label="Workshops" value={fmtJson(r.workshops)} /> */}
           {r.guests && r.guests.length > 0 ? <Field label="Accompanying" value={fmtJson(r.guests)} /> : null}
          {/* <Field label="Accompanying" value={fmtJson(r.guests)} /> */}
        </div>

        {/* Payment breakdown */}
        {/* <div className="mt-4 rounded-xl border border-[#E7D9BB] bg-[#FBF7EC] p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#8A6A12]">Payment breakdown (all payments)</p>
          <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
            <Field label="Subtotal" value={money(r.subtotal, cur)} />
            <Field label={`GST (${r.gst_rate || 0}%)`} value={money(r.gst_amount, cur)} />
            <Field label="Total (incl. GST)" value={money(r.total_amount, cur)} />
          </div>
        </div> */}

        {/* Individual payments: the original + any merged workshop add-ons.
            Each row shows Price (pre-GST) + GST + Total; last row is the total. */}
        {(() => {
          const addons = addonPayments(r);
          const addonSub = addons.reduce((s, p) => s + Number(p.subtotal || 0), 0);
          const addonGst = addons.reduce((s, p) => s + Number(p.gst || 0), 0);
          const addonTot = addons.reduce((s, p) => s + Number(p.total || 0), 0);
          // Base (original) payment = combined figures minus the add-ons.
          const baseSub = Number(r.subtotal || 0) - addonSub;
          const baseGst = Number(r.gst_amount || 0) - addonGst;
          const baseTot = Number(r.total_amount || 0) - addonTot;
          return (
            <div className="mt-4 overflow-x-auto">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#8A6A12]">Payment breakdown (all payments)</p>
              <div className="overflow-hidden rounded-xl border border-[#E7D9BB]">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead className="bg-[#F5F0E3] text-xs uppercase tracking-wide text-[#8A6A12]">
                    <tr>
                      <th className="px-3 py-2 font-semibold">Date</th>
                      <th className="px-3 py-2 font-semibold">For</th>
                      <th className="px-3 py-2 font-semibold">Price</th>
                      <th className="px-3 py-2 font-semibold">GST (18%)</th>
                      <th className="px-3 py-2 font-semibold">Total</th>
                      <th className="px-3 py-2 font-semibold">Payment ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-[#F0E7D3]">
                      <td className="px-3 py-2 text-xs text-[#6E5C54]">{fmtDate(r.created_at)}</td>
                      <td className="px-3 py-2">Conference Registration</td>
                      <td className="px-3 py-2">{money(baseSub, cur)}</td>
                      <td className="px-3 py-2">{money(baseGst, cur)}</td>
                      <td className="px-3 py-2">{money(baseTot, cur)}</td>
                      <td className="px-3 py-2 font-mono text-xs">{r.razorpay_payment_id || "—"}</td>
                    </tr>
                    {addons.map((p, i) => (
                      <tr key={i} className="border-t border-[#F0E7D3] bg-[#FBF7EC]">
                        <td className="px-3 py-2 text-xs text-[#6E5C54]">{fmtDate(p.at)}</td>
                        <td className="px-3 py-2">
                          Add-on: {[
                            Array.isArray(p.workshops) && p.workshops.length ? p.workshops.join(", ") : null,
                            Array.isArray(p.guests) && p.guests.length ? `${p.guests.length} accompanying` : null,
                          ].filter(Boolean).join(" · ") || "item"}
                        </td>
                        <td className="px-3 py-2">{money(p.subtotal, cur)}</td>
                        <td className="px-3 py-2">{money(p.gst, cur)}</td>
                        <td className="px-3 py-2">{money(p.total, cur)}</td>
                        <td className="px-3 py-2 font-mono text-xs">{p.payment_id || "—"}</td>
                      </tr>
                    ))}
                    <tr className="border-t-2 border-[#C9A227]/50 bg-[#F5F0E3] font-semibold text-[#6E1A2B]">
                      <td className="px-3 py-2" colSpan={2}>Total</td>
                      <td className="px-3 py-2">{money(r.subtotal, cur)}</td>
                      <td className="px-3 py-2">{money(r.gst_amount, cur)}</td>
                      <td className="px-3 py-2">{money(r.total_amount, cur)}</td>
                      <td className="px-3 py-2" />
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}

// ── Registration edit — full page form (admin corrects details) ──
function RegistrationEdit({ registration, onBack, onSaved }) {
  const [form, setForm] = useState({
    name: registration.name || "",
    email: registration.email || "",
    phone: registration.phone || "",
    designation: registration.designation || "",
    institution: registration.institution || "",
    address: registration.address || "",
    mciNumber: registration.mci_number || "",
    mciState: registration.mci_state || "",
    category: registration.category || "",
    ltsiMemberNo: registration.ltsi_member_no || "",
  });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const CATEGORIES = ["", "LTSI Member", "Non-Member", "Fellow / PG Student", "Nurse / Coordinator", "International Delegate"];
  const inputCls = "w-full rounded-lg border border-[#E7D9BB] bg-white px-3 py-2 text-sm focus:border-[#6E1A2B] focus:outline-none";
  const labelCls = "mb-1 block text-xs font-semibold text-[#6E1A2B]";

  const save = async () => {
    setMsg(null);
    if (!form.name.trim() || !form.email.trim()) {
      setMsg({ ok: false, text: "Name and email are required." });
      return;
    }
    setBusy(true);
    const res = await adminApi.updateRegistration(registration.id, form);
    setBusy(false);
    if (res.ok) onSaved();
    else setMsg({ ok: false, text: (res.errors && res.errors[0]) || "Update failed." });
  };

  return (
    <div className="mt-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-lg bg-[#6E1A2B] px-3 py-1 font-mono text-sm font-semibold text-[#FBF1DD]">
            {registration.order_no || registration.reference || `#${registration.id}`}
          </span>
          <h2 className="font-serif text-xl font-bold text-[#6E1A2B] sm:text-2xl">Edit registration</h2>
        </div>
        <button onClick={onBack} className="ml-auto inline-flex items-center gap-1 rounded-full border border-[#E7D9BB] bg-white px-4 py-2 text-sm font-semibold text-[#6E1A2B] hover:bg-[#F4ECD9] cursor-pointer">
          ← Back
        </button>
      </div>

      <div className="rounded-2xl border border-[#E7D9BB] bg-white p-5 shadow-[0_10px_30px_-22px_rgba(110,26,43,0.4)] sm:p-7">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Name</label>
            <input value={form.name} onChange={set("name")} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Email</label>
            <input type="email" value={form.email} onChange={set("email")} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Phone</label>
            <input value={form.phone} onChange={set("phone")} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Designation</label>
            <input value={form.designation} onChange={set("designation")} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Institution</label>
            <input value={form.institution} onChange={set("institution")} className={inputCls} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Address</label>
            <textarea value={form.address} onChange={set("address")} rows={2} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>MCI Number</label>
            <input value={form.mciNumber} onChange={set("mciNumber")} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>MCI State</label>
            <input value={form.mciState} onChange={set("mciState")} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Category</label>
            <select value={form.category} onChange={set("category")} className={inputCls}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c || "— none —"}</option>)}
            </select>
          </div>
          {form.category === "LTSI Member" ? (
            <div>
              <label className={labelCls}>LTSI Member No</label>
              <input value={form.ltsiMemberNo} onChange={set("ltsiMemberNo")} className={inputCls} />
            </div>
          ) : null}
        </div>

        <p className="mt-4 text-xs text-[#6E5C54]">Payment amount, order number and Razorpay details are not editable here.</p>

        {msg ? <p className={`mt-3 text-sm font-medium ${msg.ok ? "text-green-700" : "text-red-700"}`}>{msg.text}</p> : null}

        <div className="mt-5 flex gap-3">
          <button onClick={save} disabled={busy} className="rounded-lg bg-[#6E1A2B] px-6 py-2.5 text-sm font-semibold text-[#FBF1DD] hover:bg-[#4A1220] disabled:opacity-60 cursor-pointer">
            {busy ? "Saving…" : "Update"}
          </button>
          <button onClick={onBack} className="rounded-lg border border-[#E7D9BB] px-6 py-2.5 text-sm font-semibold text-[#6E5C54] hover:bg-[#F4ECD9] cursor-pointer">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Abstracts tab — grouped by author (one row per person) ──
function AbstractsTab({ summary, dupTitles }) {
  const [filters, setFilters] = useState({ q: "", from: "", to: "", page: 1, pageSize: 10 });
  const [data, setData] = useState({ rows: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState(null); // { author, abstracts }

  const load = useCallback(async () => {
    setLoading(true);
    const res = await adminApi.abstractAuthors(filters);
    setLoading(false);
    if (res.ok) setData({ rows: res.rows, total: res.total });
  }, [filters]);

  useEffect(() => { load(); }, [load]);

  const pages = Math.max(1, Math.ceil(data.total / filters.pageSize));

  const openDetail = async (author) => {
    const res = await adminApi.abstractsByEmail(author.email);
    if (res.ok) setDetail({ author, abstracts: res.rows });
  };

  // Author detail opens as its own full page with an accordion of abstracts.
  if (detail) {
    return <AbstractAuthorDetail detail={detail} dupTitles={dupTitles} onBack={() => setDetail(null)} />;
  }

  return (
    <div className="mt-6">
      <Toolbar
        filters={filters}
        setFilters={setFilters}
        onExport={() => exportAbstractsCsv(filters)}
        searchPlaceholder="Search author, email, title, ABS no…"
      />

      <div className="mt-4 overflow-x-auto rounded-2xl border border-[#E7D9BB] bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-[#F5F0E3] text-xs uppercase tracking-wide text-[#8A6A12]">
            <tr>
              {["Sl.No", "Author", "Email", "Institution", "No. Abstracts", "Action"].map((h) => (
                <th key={h} className="px-4 py-3 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-[#6E5C54]">Loading…</td></tr>
            ) : data.rows.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-[#6E5C54]">No abstracts found.</td></tr>
            ) : (
              data.rows.map((r, i) => (
                <tr key={r.email} className="border-t border-[#F0E7D3]">
                  <td className="px-4 py-3 text-[#6E5C54]">{(filters.page - 1) * filters.pageSize + i + 1}</td>
                  <td className="px-4 py-3 font-medium text-[#33242A]">{r.first_name} {r.last_name}</td>
                  <td className="px-4 py-3">{r.email}</td>
                  <td className="px-4 py-3">{r.institution || "—"}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex min-w-[1.75rem] justify-center rounded-full bg-[#F3E7C6] px-2 py-0.5 text-xs font-semibold text-[#6E1A2B]">
                      {r.abstract_count}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => openDetail(r)} className="text-xs font-semibold text-[#6E1A2B] underline cursor-pointer">View</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pager page={filters.page} pages={pages} total={data.total} onPage={(p) => setFilters((f) => ({ ...f, page: p }))} />
    </div>
  );
}

// ── Author detail — full page; each abstract in a collapsible accordion ──
function AbstractAuthorDetail({ detail, dupTitles, onBack }) {
  const { author } = detail;
  // Local copy so status edits reflect immediately without a full reload.
  const [items, setItems] = useState(detail.abstracts);
  // First abstract expanded by default; opening another closes the previous.
  const [openId, setOpenId] = useState(detail.abstracts[0]?.id ?? null);
  const isDupTitle = (title) => dupTitles?.includes(String(title || "").trim().toLowerCase());

  const onSaved = (updated) =>
    setItems((list) =>
      list.map((it) =>
        it.id === updated.id
          ? { ...it, status: updated.status, status_reason: updated.status_reason, status_updated_at: updated.status_updated_at }
          : it
      )
    );

  return (
    <div className="mt-6">
      {/* Header: author info left, back button on the right */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-xl font-bold text-[#6E1A2B] sm:text-2xl">
            {author.first_name} {author.last_name}
          </h2>
          <p className="text-sm text-[#6E5C54]">{author.email} · {items.length} abstract{items.length === 1 ? "" : "s"}</p>
        </div>
        <button
          onClick={onBack}
          className="ml-auto inline-flex items-center gap-1 rounded-full border border-[#E7D9BB] bg-white px-4 py-2 text-sm font-semibold text-[#6E1A2B] hover:bg-[#F4ECD9] cursor-pointer"
        >
          ← Back
        </button>
      </div>

      <div className="space-y-3">
        {items.map((a) => {
          const open = openId === a.id;
          return (
            <div key={a.id} className="overflow-hidden rounded-xl border border-[#E7D9BB] bg-white">
              {/* Accordion header */}
              
              <button
                onClick={() => setOpenId(open ? null : a.id)}
                className={` w-full items-center gap-3 px-4 py-3 text-left cursor-pointer ${open ? "bg-[#FBF7EC]" : "hover:bg-[#FBF7EC]"}`}
              >
                <span className="rounded-md bg-[#6E1A2B] px-2 py-0.5 font-mono text-xs font-semibold text-[#FBF1DD]">
                  {a.abstract_no || `#${a.id}`}
                </span>
                <diiv className="flex items-center gap-3">
<span className="flex-1 font-medium text-[#33242A]">
                  {a.title}
                  {/* {isDupTitle(a.title) ? <span className="ml-2 rounded bg-amber-200 px-1.5 py-0.5 text-[10px] font-semibold text-amber-900">DUP TITLE</span> : null} */}
                </span>
                <AbstractStatusBadge status={a.status} />
                <span className="shrink-0 text-[#6E1A2B]">{open ? "-" : "+"}</span>
                </diiv>
                
              </button>

              {/* Accordion body */}
              {open ? (
                <div className="border-t border-[#F0E7D3] px-4 py-4 sm:px-5">
                  <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
                    <Field label="Mobile" value={a.mobile} />
                    <Field label="Institution" value={a.institution} />
                    <Field label="Co-authors" value={a.co_authors} />
                    <Field label="Membership/Reg ID" value={a.membership_id} />
                    <Field label="Presentation Type" value={a.presentation_type} />
                    <Field label="Track" value={a.track} />
                    <Field label="Keywords" value={a.keywords} />
                    <Field label="Submitted At" value={fmtDate(a.created_at)} />
                  </div>
                  <div className="mt-2">
                    <Field label="Abstract" value={a.abstract_body} />
                    <Field label="Declarations" value={fmtJson(a.declarations)} />
                  </div>
                  {a.file_path ? (
                    <div className="mt-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#8A6A12]">Attachment</p>
                      <a
                        href={abstractFileUrl(a.file_path)}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 inline-flex items-center gap-2 rounded-lg border border-[#6E1A2B] px-4 py-2 text-sm font-semibold text-[#6E1A2B] hover:bg-[#6E1A2B] hover:text-[#FBF1DD]"
                      >
                        ↓ {a.file_name || a.file_path}
                      </a>
                    </div>
                  ) : null}

                  <StatusEditor abstract={a} onSaved={onSaved} />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Status editor — select + (reason for Rejected/Duplicate) + submit ──
function StatusEditor({ abstract, onSaved }) {
  const [status, setStatus] = useState(abstract.status || "under_review");
  const [reason, setReason] = useState(abstract.status_reason || "");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null); // { ok, text }
  // Once saved, the reason textarea is hidden until the admin edits again.
  const [saved, setSaved] = useState(true);
  const needsReason = status === "rejected" || status === "duplicate";

  const submit = async () => {
    setMsg(null);
    if (needsReason && !reason.trim()) {
      setMsg({ ok: false, text: "Please enter a reason." });
      return;
    }
    setBusy(true);
    const res = await adminApi.updateAbstractStatus(abstract.id, { status, reason });
    setBusy(false);
    if (res.ok) {
      setMsg({ ok: true, text: "Status updated." });
      setSaved(true); // hide the textarea after a successful submit
      onSaved(res.abstract);
    } else {
      setMsg({ ok: false, text: (res.errors && res.errors[0]) || "Update failed." });
    }
  };

  const submitBtn = (
    <button
      onClick={submit}
      disabled={busy}
      className="w-full rounded-lg bg-[#6E1A2B] px-5 py-2 text-sm font-semibold text-[#FBF1DD] hover:bg-[#4A1220] disabled:opacity-60 sm:w-auto cursor-pointer"
    >
      {busy ? "Saving…" : "Submit"}
    </button>
  );
  // When a reason is being entered, the button belongs below the textarea.
  const showReasonBox = needsReason && !saved;

  return (
    <div className="mt-5 rounded-xl border border-[#E7D9BB] bg-[#FBF7EC] p-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#8A6A12]">Update review status</p>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setSaved(false); setMsg(null); }}
          className="w-full rounded-lg border border-[#E7D9BB] bg-white px-3 py-2 text-sm sm:w-auto"
        >
          {STATUS_OPTIONS.map(([v, label]) => <option key={v} value={v}>{label}</option>)}
        </select>
        {/* Button sits beside the dropdown only when no reason is being entered. */}
        {!showReasonBox ? submitBtn : null}
      </div>

      {/* Editable reason box — only while entering it (hidden after submit).
          The submit button moves below the textarea here. */}
      {showReasonBox ? (
        <div className="mt-3">
          <label className="mb-1 block text-xs font-semibold text-[#6E1A2B]">
            Reason {status === "rejected" ? "for rejection" : "for marking duplicate"} (required)
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            placeholder="Enter the reason the author will be informed about…"
            className="w-full rounded-lg border border-[#E7D9BB] bg-white px-3 py-2 text-sm focus:border-[#6E1A2B] focus:outline-none"
          />
          <div className="mt-3">{submitBtn}</div>
        </div>
      ) : null}

      {/* Saved reason — read-only, with an Edit link to reopen the textarea. */}
      {needsReason && saved && reason ? (
        <div className="mt-3 rounded-lg border border-[#E7D9BB] bg-white px-3 py-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-[#8A6A12]">Reason</span>
            <button onClick={() => setSaved(false)} className="text-xs font-semibold text-[#6E1A2B] underline cursor-pointer">Edit</button>
          </div>
          <p className="mt-1 whitespace-pre-wrap text-sm text-[#33242A]">{reason}</p>
        </div>
      ) : null}

      {msg ? (
        <p className={`mt-2 text-sm font-medium ${msg.ok ? "text-green-700" : "text-red-700"}`}>{msg.text}</p>
      ) : null}
    </div>
  );
}

// ── Shared toolbar + pager ────────────────────────────
function Toolbar({ filters, setFilters, statusOptions, onExport, searchPlaceholder }) {
  const [q, setQ] = useState(filters.q);
  useEffect(() => setQ(filters.q), [filters.q]);

  const apply = (patch) => setFilters((f) => ({ ...f, ...patch, page: 1 }));
  const reset = () => {
    setQ("");
    setFilters((f) => ({ ...f, q: "", status: "", from: "", to: "", page: 1 }));
  };
  const hasFilters = Boolean(filters.q || filters.status || filters.from || filters.to);

  // Search-as-you-type: apply the query after a short debounce so we don't hit
  // the API on every keystroke.
  useEffect(() => {
    const t = setTimeout(() => {
      setFilters((f) => (f.q === q ? f : { ...f, q, page: 1 }));
    }, 300);
    return () => clearTimeout(t);
  }, [q, setFilters]);

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[#E7D9BB] bg-white p-4 sm:flex-row sm:flex-wrap sm:items-end">
      <form
        onSubmit={(e) => { e.preventDefault(); apply({ q }); }}
        className="relative w-full sm:w-auto sm:flex-1 sm:min-w-[220px]"
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full rounded-lg border border-[#E7D9BB] py-2 pl-3 pr-9 text-sm focus:border-[#6E1A2B] focus:outline-none"
        />
        {q ? (
          <button
            type="button"
            onClick={() => setQ("")}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full text-[#6E5C54] hover:bg-[#F4ECD9] hover:text-[#6E1A2B]"
          >
            ✕
          </button>
        ) : null}
      </form>

      {statusOptions ? (
        <select
          value={filters.status}
          onChange={(e) => apply({ status: e.target.value })}
          className="w-full rounded-lg border border-[#E7D9BB] px-3 py-2 text-sm sm:w-auto"
        >
          {statusOptions.map(([v, label]) => <option key={v} value={v}>{label}</option>)}
        </select>
      ) : null}

      <div className="flex flex-wrap items-center gap-1 text-xs text-[#6E5C54]">
        <label>From</label>
        <input type="date" value={filters.from} onChange={(e) => apply({ from: e.target.value })} className="flex-1 rounded-lg border border-[#E7D9BB] px-2 py-1.5 text-sm sm:flex-none" />
        <label>To</label>
        <input type="date" value={filters.to} onChange={(e) => apply({ to: e.target.value })} className="flex-1 rounded-lg border border-[#E7D9BB] px-2 py-1.5 text-sm sm:flex-none" />
      </div>

      {/* <button
        onClick={reset}
        disabled={!hasFilters}
        className="w-full rounded-lg border border-[#E7D9BB] px-4 py-2 text-sm font-semibold text-[#6E5C54] hover:bg-[#F4ECD9] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto cursor-pointer"
      >
        ↺ Reset
      </button> */}

      <button onClick={onExport} className="w-full rounded-lg border border-[#6E1A2B] px-4 py-2 text-sm font-semibold text-[#6E1A2B] hover:bg-[#6E1A2B] hover:text-[#FBF1DD] sm:w-auto cursor-pointer">
        ↓ Export CSV
      </button>
    </div>
  );
}

function Pager({ page, pages, total, onPage }) {
  return (
    <div className="mt-4 flex items-center justify-between text-sm text-[#6E5C54]">
      <span>{total} record{total === 1 ? "" : "s"}</span>
      <div className="flex items-center gap-2">
        <button
          disabled={page <= 1}
          onClick={() => onPage(page - 1)}
          className="rounded-lg border border-[#E7D9BB] px-3 py-1.5 disabled:opacity-40 cursor-pointer"
        >
          ← Prev
        </button>
        <span>Page {page} of {pages}</span>
        <button
          disabled={page >= pages}
          onClick={() => onPage(page + 1)}
          className="rounded-lg border border-[#E7D9BB] px-3 py-1.5 disabled:opacity-40 cursor-pointer"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

// Pretty-print a JSON column (workshops / guests / declarations) for display.
// Parse the merged add-on payments list off a registration row (array or JSON).
function addonPayments(r) {
  const v = r && r.addon_payments;
  if (!v) return [];
  if (Array.isArray(v)) return v;
  try {
    const p = JSON.parse(v);
    return Array.isArray(p) ? p : [];
  } catch {
    return [];
  }
}

function fmtJson(v) {
  if (v === null || v === undefined || v === "") return "";
  let parsed = v;
  if (typeof v === "string") {
    try { parsed = JSON.parse(v); } catch { return v; }
  }
  if (Array.isArray(parsed)) {
    if (parsed.length === 0) return "—";
    return parsed
      .map((item) =>
        typeof item === "object" && item
          ? Object.values(item).filter(Boolean).join(" · ")
          : String(item)
      )
      .join("\n");
  }
  if (typeof parsed === "object") return JSON.stringify(parsed, null, 2);
  return String(parsed);
}
