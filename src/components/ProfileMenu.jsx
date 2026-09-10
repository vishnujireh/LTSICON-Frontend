import { useEffect, useRef, useState } from "react";
import { logout } from "../lib/serverAuth.js";

// Profile dropdown shown in the top bar when a delegate is logged in.
export default function ProfileMenu({ user, compact = false }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onDoc = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const initials = (user.name || user.email || "?")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const goRegister = () => {
    setOpen(false);
    if (window.location.hash !== "#register") window.location.hash = "#register";
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full border border-[#E7D9BB] bg-white/70 py-1 pl-1 pr-3 text-sm font-semibold text-[#6E1A2B] transition hover:bg-[#F3E7C6]"
      >
        <span className="grid h-8 w-8 place-items-center rounded-full bg-[#6E1A2B] text-xs font-bold text-[#FBF1DD]">{initials}</span>
        {!compact && <span className="max-w-[120px] truncate">{user.name || user.email}</span>}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="m6 9 6 6 6-6" /></svg>
      </button>

      {open && (
        <div role="menu" className="absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-2xl border border-[#E7D9BB] bg-white shadow-[0_20px_50px_-20px_rgba(74,18,32,0.45)]">
          <div className="border-b border-[#EDEDF0] px-4 py-3">
            <div className="truncate font-semibold text-[#1D1D1F]">{user.name || "Delegate"}</div>
            <div className="truncate text-xs text-[#6E5C54]">{user.email}</div>
          </div>
          <button role="menuitem" onClick={goRegister} className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-[#33242A] transition hover:bg-[#FBF5E9]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-[#8A6A12]"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M9 15h6" /></svg>
            My Registration
          </button>
          <button role="menuitem" onClick={() => { setOpen(false); logout(); }} className="flex w-full items-center gap-3 border-t border-[#EDEDF0] px-4 py-3 text-left text-sm font-medium text-[#6E1A2B] transition hover:bg-[#FBF5E9]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="m16 17 5-5-5-5" /><path d="M21 12H9" /></svg>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
