import { useState } from "react";
import Logo from "../../public/logo.svg";
import { resetPassword } from "../lib/serverAuth.js";
import { navigate } from "../lib/nav.js";

// Parse ?token=... from the path route (/reset?token=abc). Falls back to the
// old hash form (#reset?token=abc) so links already sent by email still work.
function getToken() {
  const fromQuery = new URLSearchParams(window.location.search).get("token");
  if (fromQuery) return fromQuery;
  const hash = window.location.hash || "";
  const qs = hash.includes("?") ? hash.slice(hash.indexOf("?") + 1) : "";
  return new URLSearchParams(qs).get("token") || "";
}

const inputClass =
  "w-full rounded-xl border border-[#E7D9BB] bg-white px-4 py-3 text-base text-[#33242A] outline-none transition focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/30 sm:text-sm";

export default function ResetPassword() {
  const [token] = useState(getToken);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState("idle"); // idle | submitting | done | error
  const [message, setMessage] = useState("");

  const goHome = () => { navigate("/"); };
  const goLogin = () => { navigate("/register"); };

  const submit = async (e) => {
    e.preventDefault();
    if (!token) { setStatus("error"); setMessage("This reset link is missing its token. Please use the link from your email."); return; }
    if (password.length < 6) { setStatus("error"); setMessage("Password must be at least 6 characters."); return; }
    if (password !== confirm) { setStatus("error"); setMessage("Passwords do not match."); return; }

    setStatus("submitting"); setMessage("");
    const res = await resetPassword(token, password);
    if (res.ok) {
      setStatus("done");
      setMessage("Your password has been updated. You can now log in.");
    } else {
      setStatus("error");
      setMessage((res.errors && res.errors.join(" ")) || "Could not reset your password.");
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[linear-gradient(180deg,var(--cream),var(--sand))]">
      <header className="sticky top-0 z-30 border-b border-[#E7D9BB] bg-[rgba(251,245,233,0.92)] px-5 py-3 backdrop-blur lg:px-10">
        <div className="mx-auto flex max-w-[1180px] items-center">
          <button onClick={goHome} className="flex items-center gap-3">
            <img src={Logo} alt="LTSICON Chennai 2026" className="h-12 w-auto sm:h-14" />
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-md px-5 py-12">
        <div className="mb-6 text-center">
          <span className="inline-flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#8A6A12]">
            <span className="h-px w-6 bg-[#8A6A12]" /> Reset password
          </span>
          <h1 className="mt-2 font-serif text-3xl font-bold text-[#6E1A2B]">Choose a new password</h1>
        </div>

        {status === "done" ? (
          <div className="rounded-2xl border border-[#E7D9BB] bg-white p-8 text-center shadow-[0_18px_50px_-30px_rgba(110,26,43,0.5)]">
            <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-[#EAF6EC] text-[#1f7a3d]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7"><path d="M20 6 9 17l-5-5" /></svg>
            </div>
            <p className="text-[#33242A]">{message}</p>
            <button onClick={goLogin} className="mt-6 inline-flex items-center rounded-full bg-[#6E1A2B] px-7 py-3 text-sm font-semibold text-[#FBF1DD] transition hover:bg-[#4A1220]">Go to login</button>
          </div>
        ) : (
          <form onSubmit={submit} className="rounded-2xl border border-[#E7D9BB] bg-white p-6 shadow-[0_18px_50px_-30px_rgba(110,26,43,0.5)] sm:p-8">
            <label className="mb-4 block">
              <span className="mb-1.5 block text-sm font-semibold text-[#6E1A2B]">New password</span>
              <input type="password" required className={inputClass} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimum 6 characters" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-[#6E1A2B]">Confirm password</span>
              <input type="password" required className={inputClass} value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Re-enter new password" />
            </label>
            {message && <p className="mt-3 rounded-lg bg-[#FBEBEB] px-3 py-2 text-sm font-medium text-[#B3261E]">{message}</p>}
            <button type="submit" disabled={status === "submitting"} className="mt-6 flex w-full items-center justify-center rounded-full bg-[#6E1A2B] px-6 py-3.5 text-sm font-semibold text-[#FBF1DD] transition hover:-translate-y-0.5 hover:bg-[#4A1220] disabled:opacity-50">
              {status === "submitting" ? "Updating…" : "Update password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
