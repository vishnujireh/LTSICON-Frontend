import { useEffect, useState, useCallback } from "react";
import { reviewerApi, getReviewerToken, getReviewer, reviewerLogout } from "../lib/reviewerApi.js";

const STATUS_STYLE = {
  pending: "bg-amber-100 text-amber-800",
  completed: "bg-green-100 text-green-800",
  coi: "bg-orange-100 text-orange-800",
};
function StatusBadge({ status }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLE[status] || "bg-slate-100 text-slate-700"}`}>
      {status === "coi" ? "COI" : status}
    </span>
  );
}

export default function ReviewerPortal() {
  const [authed, setAuthed] = useState(() => !!getReviewerToken());
  const [openId, setOpenId] = useState(null); // abstract being reviewed

  if (!authed) return <ReviewerLogin onLoggedIn={() => setAuthed(true)} />;
  if (openId) return <ReviewScreen abstractId={openId} onBack={() => setOpenId(null)} onLoggedOut={() => setAuthed(false)} />;
  return <ReviewerDashboard onOpen={setOpenId} onLoggedOut={() => setAuthed(false)} />;
}

// ── Login (email → OTP) ────────────────────────────────
function ReviewerLogin({ onLoggedIn }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const sendOtp = async (e) => {
    e?.preventDefault();
    setErr(""); setMsg(""); setBusy(true);
    const res = await reviewerApi.requestOtp(email.trim().toLowerCase());
    setBusy(false);
    if (res.ok) { setMsg(res.message || "If this email is a registered reviewer, a code has been sent."); setStep(2); }
    else setErr((res.errors && res.errors[0]) || "Could not send code.");
  };

  const verify = async (e) => {
    e.preventDefault();
    setErr(""); setBusy(true);
    const res = await reviewerApi.verifyOtp(email.trim().toLowerCase(), otp.trim());
    setBusy(false);
    if (res.ok) onLoggedIn();
    else setErr((res.errors && res.errors[0]) || "Incorrect code.");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F4ECD9] px-4">
      <form onSubmit={step === 1 ? sendOtp : verify} className="w-full max-w-sm rounded-2xl border border-[#E7D9BB] bg-white p-8 shadow-lg">
        <h1 className="font-serif text-2xl font-bold text-[#6E1A2B]">Reviewer Login</h1>
        <p className="mt-1 text-sm text-[#6E5C54]">LTSICON Chennai 2026 — abstract review</p>
        {err ? <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{err}</p> : null}
        {msg ? <p className="mt-4 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{msg}</p> : null}

        {step === 1 ? (
          <>
            <label className="mt-5 block text-sm font-medium text-[#33242A]">Registered email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#E7D9BB] px-3 py-2 text-sm focus:border-[#6E1A2B] focus:outline-none" />
            <button type="submit" disabled={busy} className="mt-6 w-full rounded-full bg-[#6E1A2B] py-2.5 text-sm font-semibold text-[#FBF1DD] hover:bg-[#4A1220] disabled:opacity-60">
              {busy ? "Sending…" : "Send login code"}
            </button>
          </>
        ) : (
          <>
            <label className="mt-5 block text-sm font-medium text-[#33242A]">Enter the 6-digit code sent to {email}</label>
            <input inputMode="numeric" maxLength={6} required value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              className="mt-1 w-full rounded-lg border border-[#E7D9BB] px-3 py-2 text-center text-lg tracking-[6px] focus:border-[#6E1A2B] focus:outline-none" />
            <button type="submit" disabled={busy} className="mt-6 w-full rounded-full bg-[#6E1A2B] py-2.5 text-sm font-semibold text-[#FBF1DD] hover:bg-[#4A1220] disabled:opacity-60">
              {busy ? "Verifying…" : "Verify & sign in"}
            </button>
            <button type="button" onClick={() => { setStep(1); setOtp(""); setErr(""); }} className="mt-3 w-full text-xs text-[#6E5C54] underline">
              ← Use a different email
            </button>
          </>
        )}
        <a href="/" className="mt-4 block text-center text-xs text-[#6E5C54] underline">← Back to site</a>
      </form>
    </div>
  );
}

// ── Header shared by dashboard/review ──────────────────
function PortalHeader({ onLoggedOut }) {
  const reviewer = getReviewer();
  return (
    <header className="sticky top-0 z-30 border-b border-[#E7D9BB] bg-[#6E1A2B] px-4 py-3 text-[#FBF1DD] sm:px-6">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="font-serif text-base font-bold sm:text-lg">LTSICON 2026 — Reviewer</h1>
          <p className="truncate text-xs opacity-80">{reviewer?.name} · {reviewer?.email}</p>
        </div>
        <button onClick={() => { reviewerLogout(); onLoggedOut(); }} className="shrink-0 rounded-full border border-[#FBF1DD]/40 px-3 py-1.5 text-xs font-semibold hover:bg-[#FBF1DD]/10">
          Log out
        </button>
      </div>
    </header>
  );
}

function Card({ label, value }) {
  return (
    <div className="rounded-2xl border border-[#E7D9BB] bg-white p-4 text-center">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#8A6A12]">{label}</p>
      <p className="mt-1 font-serif text-3xl font-bold text-[#6E1A2B]">{value}</p>
    </div>
  );
}

// ── Dashboard + assigned list ──────────────────────────
function ReviewerDashboard({ onOpen, onLoggedOut }) {
  const [counts, setCounts] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [d, a] = await Promise.all([reviewerApi.dashboard(), reviewerApi.abstracts()]);
    if (d.ok) setCounts(d.counts);
    if (a.ok) setRows(a.rows);
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  return (
    <div className="min-h-screen bg-[#F4ECD9] pb-16">
      <PortalHeader onLoggedOut={onLoggedOut} />
      <main className="mx-auto max-w-5xl px-4 pt-6 sm:px-6">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Card label="Assigned" value={counts?.total ?? "—"} />
          <Card label="Pending" value={counts?.pending ?? "—"} />
          <Card label="Completed" value={counts?.completed ?? "—"} />
          <Card label="COI" value={counts?.coi ?? "—"} />
        </div>

        <h2 className="mt-8 mb-3 font-serif text-xl font-bold text-[#6E1A2B]">Assigned Abstracts</h2>
        <div className="overflow-x-auto rounded-2xl border border-[#E7D9BB] bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-[#F5F0E3] text-xs uppercase tracking-wide text-[#8A6A12]">
              <tr>
                {["Abstract", "Title", "Category", "Track", "Status", "Action"].map((h) => (
                  <th key={h} className="px-4 py-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-[#6E5C54]">Loading…</td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-[#6E5C54]">No abstracts assigned to you yet.</td></tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.id} className="border-t border-[#F0E7D3]">
                    <td className="px-4 py-3 font-mono text-xs">{r.abstract_no || `#${r.id}`}</td>
                    <td className="px-4 py-3 max-w-[280px]"><span className="line-clamp-2 font-medium text-[#33242A]">{r.title}</span></td>
                    <td className="px-4 py-3">{r.presentation_type || "—"}</td>
                    <td className="px-4 py-3">{r.track || "—"}</td>
                    <td className="px-4 py-3"><StatusBadge status={r.review_status} /></td>
                    <td className="px-4 py-3">
                      <button onClick={() => onOpen(r.id)} className="text-xs font-semibold text-[#6E1A2B] underline">
                        {r.review_status === "pending" ? "Review" : "View"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

// ── Read-only abstract + evaluation ────────────────────
function ReviewScreen({ abstractId, onBack, onLoggedOut }) {
  const [abstract, setAbstract] = useState(null);
  const [criteria, setCriteria] = useState([]);
  const [categories, setCategories] = useState([]);
  const [review, setReview] = useState(null);
  const [locked, setLocked] = useState(false);
  const [loading, setLoading] = useState(true);

  const [tab, setTab] = useState("evaluation");
  const [scores, setScores] = useState({});
  const [comments, setComments] = useState("");
  const [category, setCategory] = useState("");
  const [coiReason, setCoiReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [done, setDone] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const [a, rv] = await Promise.all([reviewerApi.abstract(abstractId), reviewerApi.review(abstractId)]);
    if (a.ok) setAbstract(a.abstract);
    if (rv.ok) {
      setCriteria(rv.criteria || []);
      setCategories(rv.categories || []);
      setReview(rv.review);
      setLocked(!!rv.locked);
      if (rv.review) {
        setComments(rv.review.comments || "");
        setCategory(rv.review.recommended_category || "");
        setCoiReason(rv.review.coi_reason || "");
        const s = {};
        (rv.review.scores || []).forEach((x) => { s[x.criterion_id] = x.score; });
        setScores(s);
        if (rv.review.status === "coi") setTab("coi");
      }
    }
    setLoading(false);
  }, [abstractId]);
  useEffect(() => { load(); }, [load]);

  const total = criteria.reduce((sum, c) => sum + (Number(scores[c.id]) || 0), 0);
  const maxTotal = criteria.reduce((sum, c) => sum + Number(c.max_score), 0);

  const submitEval = async () => {
    setErr("");
    for (const c of criteria) {
      const v = Number(scores[c.id]);
      if (scores[c.id] === undefined || scores[c.id] === "" || Number.isNaN(v) || v < 0 || v > c.max_score) {
        setErr(`Enter a valid score for "${c.name}" (0–${c.max_score}).`); return;
      }
    }
    if (!window.confirm("Submit this evaluation? It can't be changed afterwards.")) return;
    setBusy(true);
    const res = await reviewerApi.submitReview(abstractId, { scores, comments, recommended_category: category });
    setBusy(false);
    if (res.ok) { setDone(true); load(); } else setErr((res.errors && res.errors[0]) || "Could not submit.");
  };

  const submitCoi = async () => {
    setErr("");
    if (!coiReason.trim()) { setErr("Please enter a reason."); return; }
    if (!window.confirm("Decline this abstract for conflict of interest?")) return;
    setBusy(true);
    const res = await reviewerApi.submitReview(abstractId, { coi: true, coi_reason: coiReason });
    setBusy(false);
    if (res.ok) { setDone(true); load(); } else setErr((res.errors && res.errors[0]) || "Could not submit.");
  };

  return (
    <div className="min-h-screen bg-[#F4ECD9] pb-16">
      <PortalHeader onLoggedOut={onLoggedOut} />
      <main className="mx-auto max-w-5xl px-4 pt-6 sm:px-6">
        <button onClick={onBack} className="mb-4 inline-flex items-center gap-1 rounded-full border border-[#E7D9BB] bg-white px-4 py-2 text-sm font-semibold text-[#6E1A2B] hover:bg-[#F4ECD9]">← Back to my abstracts</button>

        {loading ? (
          <p className="text-[#6E5C54]">Loading…</p>
        ) : !abstract ? (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-red-700">This abstract is not available to you.</p>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
            {/* Read-only abstract */}
            <div className="rounded-2xl border border-[#E7D9BB] bg-white p-5">
              <div className="mb-3 flex items-center gap-2">
                <span className="rounded-md bg-[#6E1A2B] px-2 py-0.5 font-mono text-xs font-semibold text-[#FBF1DD]">{abstract.abstract_no || `#${abstract.id}`}</span>
                <StatusBadge status={review?.status || "pending"} />
              </div>
              <h2 className="font-serif text-lg font-bold text-[#6E1A2B]">{abstract.title}</h2>
              <dl className="mt-3 space-y-2 text-sm">
                <Row label="Presenter" value={`${abstract.first_name} ${abstract.last_name}`} />
                <Row label="Co-authors" value={abstract.co_authors} />
                <Row label="Affiliation" value={abstract.institution} />
                <Row label="Presentation Category" value={abstract.presentation_type} />
                <Row label="Track / Theme" value={abstract.track} />
                <Row label="Keywords" value={abstract.keywords} />
              </dl>
              {abstract.abstract_body ? (
                <div className="mt-3 border-t border-[#F0E7D3] pt-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#8A6A12]">Abstract</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-[#33242A]">{abstract.abstract_body}</p>
                </div>
              ) : null}
            </div>

            {/* Evaluation */}
            <div className="rounded-2xl border border-[#E7D9BB] bg-white p-5">
              {locked || done ? (
                <div className="text-center">
                  <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-[#EAF6EC] text-[#1f7a3d]">✓</div>
                  <h3 className="font-serif text-xl font-bold text-[#6E1A2B]">Review submitted</h3>
                  <p className="mt-2 text-sm text-[#6E5C54]">
                    {(review?.status || "completed") === "coi"
                      ? "You declined this abstract for conflict of interest."
                      : `Your score: ${review?.total_score ?? total} / ${maxTotal}`}
                  </p>
                  <p className="mt-1 text-xs text-[#6E5C54]">This review is final and cannot be changed.</p>
                </div>
              ) : (
                <>
                  <div className="mb-4 flex gap-2">
                    <button onClick={() => setTab("evaluation")} className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold ${tab === "evaluation" ? "bg-[#6E1A2B] text-[#FBF1DD]" : "border border-[#E7D9BB] text-[#6E1A2B]"}`}>Evaluation</button>
                    <button onClick={() => setTab("coi")} className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold ${tab === "coi" ? "bg-[#6E1A2B] text-[#FBF1DD]" : "border border-[#E7D9BB] text-[#6E1A2B]"}`}>Conflict of Interest</button>
                  </div>

                  {err ? <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{err}</p> : null}

                  {tab === "evaluation" ? (
                    <div className="space-y-3">
                      {criteria.map((c) => (
                        <div key={c.id}>
                          <label className="mb-1 block text-sm font-semibold text-[#6E1A2B]">{c.name} (0–{c.max_score})</label>
                          <input type="number" min={0} max={c.max_score} step={1} value={scores[c.id] ?? ""}
                            onChange={(e) => setScores((s) => ({ ...s, [c.id]: e.target.value }))}
                            className="w-full rounded-lg border border-[#E7D9BB] px-3 py-2 text-sm focus:border-[#6E1A2B] focus:outline-none"
                            placeholder={`Enter ${c.name}`} />
                        </div>
                      ))}
                      <p className="text-sm font-semibold text-[#6E1A2B]">Total: {total} / {maxTotal}</p>
                      {categories.length ? (
                        <div>
                          <label className="mb-1 block text-sm font-semibold text-[#6E1A2B]">Recommended Category</label>
                          <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-lg border border-[#E7D9BB] px-3 py-2 text-sm">
                            <option value="">— select —</option>
                            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                      ) : null}
                      <div>
                        <label className="mb-1 block text-sm font-semibold text-[#6E1A2B]">Comment</label>
                        <textarea rows={4} value={comments} onChange={(e) => setComments(e.target.value)} placeholder="Write your comment" className="w-full rounded-lg border border-[#E7D9BB] px-3 py-2 text-sm focus:border-[#6E1A2B] focus:outline-none" />
                      </div>
                      <button onClick={submitEval} disabled={busy} className="rounded-lg bg-[#1f7a3d] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#186131] disabled:opacity-60">
                        {busy ? "Submitting…" : "Submit"}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-[#6E1A2B]">Reason (Required)</label>
                      <textarea rows={6} value={coiReason} onChange={(e) => setCoiReason(e.target.value)} placeholder="Write your reason here…" className="w-full rounded-lg border border-[#E7D9BB] px-3 py-2 text-sm focus:border-[#6E1A2B] focus:outline-none" />
                      <button onClick={submitCoi} disabled={busy} className="rounded-lg bg-[#1f7a3d] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#186131] disabled:opacity-60">
                        {busy ? "Submitting…" : "Submit"}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function Row({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex gap-2">
      <dt className="w-36 shrink-0 text-xs font-semibold uppercase tracking-wide text-[#8A6A12]">{label}</dt>
      <dd className="text-[#33242A]">{value}</dd>
    </div>
  );
}
