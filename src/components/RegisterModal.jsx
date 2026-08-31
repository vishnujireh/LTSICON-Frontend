import { useEffect, useState } from "react";

export function openRegister() {
  // Navigate to the dedicated multi-step registration page.
  if (window.location.hash !== "#register") {
    window.location.hash = "#register";
  }
  window.scrollTo({ top: 0, behavior: "auto" });
}

const inputClass =
  "w-full rounded-xl border border-[#E7D9BB] bg-white px-4 py-3 text-base text-[#33242A] outline-none transition focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/30 sm:text-sm";
const labelClass = "mb-1.5 block text-sm font-semibold text-[#6E1A2B]";

export default function RegisterModal() {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const onOpen = () => {
      setSubmitted(false);
      setOpen(true);
    };
    window.addEventListener("ltsicon:register", onOpen);
    return () => window.removeEventListener("ltsicon:register", onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const close = () => setOpen(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="reg-title">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={close} />

      <div className="relative z-10 max-h-[calc(100dvh-2rem)] w-full max-w-md animate-[fadeIn_0.2s_ease-out] overflow-y-auto overscroll-contain rounded-2xl border border-[#E7D9BB] bg-[#FBF5E9] p-6 shadow-[0_30px_80px_-20px_rgba(74,18,32,0.55)] sm:p-8">
        <button
          type="button"
          aria-label="Close"
          onClick={close}
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full text-[#6E1A2B] transition hover:bg-[#F3E7C6]"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-5 w-5"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>

        {submitted ? (
          <div className="py-6 text-center">
            <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-[#F3E7C6] text-[#6E1A2B]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7"><path d="M20 6 9 17l-5-5" /></svg>
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#6E1A2B]">Thank you!</h3>
            <p className="mt-2 text-[#6E5C54]">Your registration interest has been noted. Our team will reach out with the next steps and payment details.</p>
            <button type="button" onClick={close} className="mt-6 inline-flex items-center rounded-full bg-[#6E1A2B] px-7 py-3 text-sm font-semibold text-[#FBF1DD] transition hover:-translate-y-0.5 hover:bg-[#4A1220]">Done</button>
          </div>
        ) : (
          <>
            <span className="inline-flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#8A6A12]">
              <span className="h-px w-6 bg-[#8A6A12]" />
              LTSICON Chennai 2026
            </span>
            <h3 id="reg-title" className="mt-2 font-serif text-2xl font-bold text-[#6E1A2B] sm:text-3xl">Register</h3>
            <p className="mt-1.5 text-sm text-[#6E5C54]">Reserve your place at the 9th Annual Conference of the LTSI. We’ll follow up with confirmation and payment details.</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="reg-name" className={labelClass}>Full name</label>
                <input id="reg-name" type="text" required placeholder="Dr. Full Name" className={inputClass} />
              </div>
              <div>
                <label htmlFor="reg-email" className={labelClass}>Email</label>
                <input id="reg-email" type="email" required placeholder="name@institution.org" className={inputClass} />
              </div>
              <div>
                <label htmlFor="reg-phone" className={labelClass}>Mobile</label>
                <input id="reg-phone" type="tel" required placeholder="+91 XXXXX XXXXX" className={inputClass} />
              </div>
              <div>
                <label htmlFor="reg-cat" className={labelClass}>Delegate category</label>
                <select id="reg-cat" required defaultValue="" className={inputClass}>
                  <option value="" disabled>Select a category</option>
                  <option>LTSI Member</option>
                  <option>Non-Member</option>
                  <option>Fellow / PG Student</option>
                  <option>Nurse / Coordinator</option>
                  <option>International Delegate</option>
                </select>
              </div>
              <button type="submit" className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-[#6E1A2B] px-6 py-3.5 text-sm font-semibold text-[#FBF1DD] transition hover:-translate-y-0.5 hover:bg-[#4A1220]">
                Submit Registration
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
