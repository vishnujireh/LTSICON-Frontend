import { useEffect, useMemo, useRef, useState } from "react";
import Logo from "../../public/logo.svg";
import intlTelInput from "intl-tel-input";
import "intl-tel-input/build/css/intlTelInput.css";
import { getDraft, saveDraft, clearDraft } from "../lib/auth.js";
import {
  getCurrentUser,
  login,
  onAuthChange,
  register as apiRegister,
  forgotPassword as apiForgotPassword,
} from "../lib/serverAuth.js";
import ProfileMenu from "./ProfileMenu.jsx";
import {
  createRegistration as apiCreateRegistration,
  confirmRegistration as apiConfirmRegistration,
  createPaymentOrder as apiCreatePaymentOrder,
  myRegistrationSummary as apiMyRegistrationSummary,
  markRegistrationFailed as apiMarkRegistrationFailed,
  loadRazorpay,
} from "../lib/api.js";
import { navigate } from "../lib/nav.js";

/* ---------------------------------- data ---------------------------------- */

const RATES = {
  "LTSI Member": { currency: "₹", early: 10000, standard: 12000, spot: 15000 },
  "Non-Member": { currency: "₹", early: 15000, standard: 18000, spot: 20000 },
  "Fellow / PG Student": { currency: "₹", early: 5000, standard: 7000, spot: 9000 },
  "Nurse / Coordinator": { currency: "₹", early: 2000, standard: 3000, spot: 3000 },
  // Charged in INR (USD 250/300/350 equivalent) so the INR-only gateway works.
  "International Delegate": { currency: "₹", early: 23617, standard: 28340, spot: 33064 },
};

const ACCOMPANYING = { currency: "₹", early: 8000, standard: 10000, spot: 12000 };

// Each workshop carries its own (provisional) fee.
const WS_CUR = "₹";
const WORKSHOPS = [
  { name: "Robotic Surgery Workshop", amount: 5000 },
  { name: "Advanced Liver Surgery (resection, vascular & biliary anastomosis)", amount: 4500 },
  { name: "Hands-on Microsurgery", amount: 4000 },
  { name: "Intra-operative Hemodynamic Monitoring", amount: 3000 },
  { name: "POCUS & Transplant Doppler", amount: 3500 },
  { name: "AI Essentials for Clinicians", amount: 2500 },
];

const MCI_STATES = [
  "Andhra Pradesh Medical Council", "Arunachal Pradesh Medical Council", "Assam Medical Council",
  "Bihar Medical Council", "Chhattisgarh Medical Council", "Delhi Medical Council",
  "Goa Medical Council", "Gujarat Medical Council", "Haryana Medical Council",
  "Himachal Pradesh Medical Council", "Jammu & Kashmir Medical Council", "Jharkhand Medical Council",
  "Karnataka Medical Council", "Kerala Medical Council", "Madhya Pradesh Medical Council",
  "Maharashtra Medical Council", "Manipur Medical Council", "Meghalaya Medical Council",
  "Mizoram Medical Council", "Nagaland Medical Council", "Odisha Council of Medical Registration",
  "Punjab Medical Council", "Rajasthan Medical Council", "Sikkim Medical Council",
  "Tamil Nadu Medical Council", "Telangana State Medical Council", "Tripura State Medical Council",
  "Uttar Pradesh Medical Council", "Uttarakhand Medical Council", "West Bengal Medical Council",
];

const STEPS = [
  { n: 1, label: "Your Details", sub: "Personal & account" },
  { n: 2, label: "Category", sub: "Type & fee" },
  { n: 3, label: "Workshops", sub: "Pre-conference" },
  { n: 4, label: "Accompanying", sub: "Guests" },
  { n: 5, label: "Summary", sub: "Review" },
  { n: 6, label: "Payment", sub: "Scan & submit proof" },
];

/* --------------------------------- helpers -------------------------------- */

function currentPhase(now = new Date()) {
  const early = new Date("2026-10-31T23:59:59");
  const standard = new Date("2026-11-30T23:59:59");
  if (now <= early) return { key: "early", label: "Early Bird" };
  if (now <= standard) return { key: "standard", label: "Standard" };
  return { key: "spot", label: "Spot" };
}
function money(currency, amount) {
  return `${currency}${amount.toLocaleString("en-IN")}`;
}

const inputClass =
  "w-full rounded-xl border border-[#E7D9BB] bg-white px-4 py-3 text-base text-[#33242A] outline-none transition focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/30 sm:text-sm";
const labelClass = "mb-1.5 block text-sm font-semibold text-[#6E1A2B]";

// Same input, but with a red border when the field has an error.
const errCls = (error) =>
  error
    ? "w-full rounded-xl border border-[#B3261E] bg-white px-4 py-3 text-base text-[#33242A] outline-none transition focus:ring-2 focus:ring-[#B3261E]/30 sm:text-sm"
    : inputClass;

/* -------------------------------- component ------------------------------- */

export default function RegisterPage() {
  const phase = useMemo(() => currentPhase(), []);
  const [user, setUser] = useState(() => getCurrentUser());
  const hasDraft = !!getDraft();
  const [forceLogin, setForceLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false); // "Create account" -> use Step 1 form

  const [step, setStep] = useState(1);
  const [regId] = useState(() => "LTSI26-" + Math.random().toString(36).slice(2, 8).toUpperCase());

  const [form, setForm] = useState({
    name: "", email: "", phone: "", dialCode: "91", iso2: "in",
    designation: "", institution: "", address: "", mciNumber: "", mciState: "", ltsiMemberNo: "", password: "",
  });
  const [category, setCategory] = useState("");
  const [workshops, setWorkshops] = useState([]);
  const [guests, setGuests] = useState([]);
  // Add-on flow: a returning, already-paid delegate buying only workshops later.
  const [addon, setAddon] = useState(false);
  const [addonInfo, setAddonInfo] = useState(null); // { registered, name, category, parentRef, purchasedWorkshops }
  const [paid, setPaid] = useState(false); // kept for compatibility with the previously shown success state
  const [submitted, setSubmitted] = useState(false); // final submission done -> show success
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({}); // per-field errors for Step 1

  // Step 6 payment (Razorpay).
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");
  const [orderNo, setOrderNo] = useState(""); // sequential LTSICON_#### assigned on success

  const restoredRef = useRef(false);

  // Editing a field clears its error immediately.
  const set = (k) => (e) => {
    const { value } = e.target;
    setForm((f) => ({ ...f, [k]: value }));
    setErrors((prev) => (prev[k] ? { ...prev, [k]: undefined } : prev));
  };

  const validateStep1 = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Full name is required.";
    if (!form.email.trim()) next.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) next.email = "Please enter a valid email address.";
    if (!form.designation.trim()) next.designation = "Designation is required.";
    if (!form.institution.trim()) next.institution = "Institution is required.";
    // Password is only needed when creating a new account (not for a logged-in user).
    if (!user) {
      if (!form.password) next.password = "Password is required.";
      else if (form.password.length < 6) next.password = "Password must be at least 6 characters.";
    }
    return next;
  };

  useEffect(() => onAuthChange(() => setUser(getCurrentUser())), []);

  // When a delegate is logged in, check if they already have a paid registration
  // (so we can offer a workshops-only add-on purchase).
  useEffect(() => {
    if (!user) { setAddonInfo(null); return; }
    let alive = true;
    apiMyRegistrationSummary().then((res) => {
      if (alive && res && res.ok) setAddonInfo(res);
    });
    return () => { alive = false; };
  }, [user]);

  const purchasedWorkshops = addonInfo?.purchasedWorkshops || [];
  // Category is locked once the delegate already has a paid conference registration.
  const categoryLocked = !!addonInfo?.registered;

  // Pre-fill Steps 1 & 2 with the returning delegate's existing details, so they
  // can review/update rather than retype. Runs once; won't clobber a draft.
  const prefilledRef = useRef(false);
  useEffect(() => {
    if (!addonInfo?.registered || prefilledRef.current) return;
    prefilledRef.current = true;
    if (form.name) return; // an in-progress draft was restored — leave it alone

    // Best-effort split of a stored "+91 9876543210" phone into code + number.
    let dialCode = "91";
    let phone = "";
    const raw = String(addonInfo.phone || "").trim();
    if (raw.startsWith("+")) {
      const sp = raw.indexOf(" ");
      if (sp > 0) { dialCode = raw.slice(1, sp); phone = raw.slice(sp + 1).replace(/\s+/g, ""); }
      else { phone = raw.slice(1); }
    } else {
      phone = raw.replace(/\s+/g, "");
    }

    setForm((f) => ({
      ...f,
      name: addonInfo.name || f.name,
      email: addonInfo.email || f.email,
      phone: phone || f.phone,
      dialCode: dialCode || f.dialCode,
      designation: addonInfo.designation || f.designation,
      institution: addonInfo.institution || f.institution,
      address: addonInfo.address || f.address,
      mciNumber: addonInfo.mciNumber || f.mciNumber,
      mciState: addonInfo.mciState || f.mciState,
      ltsiMemberNo: addonInfo.ltsiMemberNo || f.ltsiMemberNo,
    }));
    setCategory(addonInfo.category || "");
  }, [addonInfo, form.name]);

  // Enter the add-on flow: skip Details + Category, go straight to Workshops.
  const startAddon = () => {
    setAddon(true);
    setCategory("");
    setWorkshops([]);
    setGuests([]);
    setForm((f) => ({ ...f, name: addonInfo?.name || user?.name || f.name, email: user?.email || f.email }));
    restoredRef.current = true; // don't let the draft-restore effect clobber this
    setStep(3);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const cancelAddon = () => {
    setAddon(false);
    setWorkshops([]);
    setGuests([]);
    setStep(2);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  // Restore an in-progress registration once the user is logged in.
  useEffect(() => {
    if (user && !restoredRef.current) {
      const d = getDraft();
      if (d) {
        setForm((f) => ({ ...f, ...(d.form || {}) }));
        setCategory(d.category || "");
        setWorkshops(d.workshops || []);
        setGuests(d.guests || []);
        setStep(d.step && d.step >= 2 ? d.step : 2);
      }
      restoredRef.current = true;
    }
  }, [user]);

  // Persist the draft as the delegate progresses (not during an add-on purchase,
  // so the add-on selections don't overwrite their original registration draft).
  useEffect(() => {
    if (user && !addon) saveDraft({ step, form, category, workshops, guests });
  }, [user, addon, step, form, category, workshops, guests]);

  /* ------- pricing ------- */
  const catRate = category ? RATES[category] : null;
  const confAmount = catRate ? catRate[phase.key] : 0;
  const confCurrency = catRate ? catRate.currency : "₹";
  const guestUnit = ACCOMPANYING[phase.key];
  const validGuests = guests.filter((g) => g.name.trim());
  const guestTotal = validGuests.length * guestUnit;
  const workshopTotal = workshops.reduce((sum, name) => {
    const w = WORKSHOPS.find((x) => x.name === name);
    return sum + (w ? w.amount : 0);
  }, 0);

  const totalsByCurrency = useMemo(() => {
    const t = {};
    if (catRate) t[confCurrency] = (t[confCurrency] || 0) + confAmount;
    if (workshops.length) t[WS_CUR] = (t[WS_CUR] || 0) + workshopTotal;
    if (validGuests.length) t[ACCOMPANYING.currency] = (t[ACCOMPANYING.currency] || 0) + guestTotal;
    return t;
  }, [catRate, confCurrency, confAmount, workshops.length, workshopTotal, validGuests.length, guestTotal]);

  const totalLabel = Object.keys(totalsByCurrency).length
    ? Object.entries(totalsByCurrency).map(([c, a]) => money(c, a)).join(" + ")
    : "—";

  /* ------- GST (18%) ------- */
  const GST_RATE = 0.18;
  // All fees are in INR, so GST applies to the full subtotal.
  const subtotalAmount = Object.values(totalsByCurrency).reduce((s, a) => s + a, 0);
  const gstAmount = Math.round(subtotalAmount * GST_RATE * 100) / 100;
  const grandTotalWithGst = Math.round((subtotalAmount + gstAmount) * 100) / 100;
  const subtotalLabel = subtotalAmount ? money("₹", subtotalAmount) : "—";
  const gstLabel = money("₹", gstAmount);
  const grandTotalLabel = grandTotalWithGst ? money("₹", grandTotalWithGst) : "—";

  /* ------- nav ------- */
  const next = () => setStep((s) => Math.min(6, s + 1));
  // In add-on mode, steps 1 (details) and 2 (category) are skipped.
  const back = () => setStep((s) => Math.max(addon ? 3 : 1, s - 1));
  const goHome = () => { navigate("/"); };

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [step]);

  const createAndContinue = async () => {
    const found = validateStep1();
    if (Object.keys(found).length) {
      setErrors(found);
      const firstKey = ["name", "email", "designation", "institution", "password"].find((k) => found[k]);
      document.querySelector(`[data-field="${firstKey}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setErrors({});

    // Already logged in (e.g. a returning delegate updating details) — no need to
    // create an account; just continue to the next step.
    if (user) { restoredRef.current = true; next(); return; }

    // Create a real server-side account so the delegate can log in later / on any
    // device. This is best-effort: it never blocks the actual registration + payment.
    const res = await apiRegister({ name: form.name, email: form.email, password: form.password });
    if (!res.ok && /already exists/i.test((res.errors || []).join(" "))) {
      // Email already registered — ask them to log in instead of creating a new account.
      setForceLogin(true);
      setErrors({ email: "An account with this email already exists. Please log in to continue." });
      document.querySelector('[data-field="email"]')?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    restoredRef.current = true; // don't overwrite what we just entered
    next();
  };

  // Final submission — keep this single backend call for the actual registration + email send.
  const finishRegistration = () => {
    setPaid(true);

    // Full itemised breakdown so the confirmation email can show every amount.
    const breakdown = {
      currency: confCurrency,
      wsCurrency: WS_CUR,
      guestCurrency: ACCOMPANYING.currency,
      conferenceLabel: category,
      conferenceAmount: confAmount,
      workshops: workshops.map((name) => {
        const w = WORKSHOPS.find((x) => x.name === name);
        return { name, amount: w ? w.amount : 0 };
      }),
      workshopsTotal: workshopTotal,
      guestUnit,
      guestCount: validGuests.length,
      guestsTotal: guestTotal,
      subtotal: subtotalAmount,
      subtotalLabel,
      gstRate: 18,
      gstAmount,
      gstLabel,
      grandTotalLabel,
    };

    apiConfirmRegistration(regId, {
      name: form.name, email: form.email,
      phone: `+${form.dialCode} ${form.phone}`.trim(),
      designation: form.designation, institution: form.institution,
      address: form.address, mciNumber: form.mciNumber, mciState: form.mciState,
      category,
      ltsiMemberNo: form.ltsiMemberNo,
      workshops,
      guests: validGuests,
      currency: confCurrency,
      totalAmount: grandTotalWithGst,
      phase: phase.key,
      regType: addon ? "addon" : "full",
      parentRef: addon ? addonInfo?.parentRef : undefined,
      breakdown,
      paid: true,
    }).catch(() => {});
  };

  // Itemised breakdown so the confirmation email can show every amount.
  const buildBreakdown = () => ({
    currency: confCurrency,
    wsCurrency: WS_CUR,
    guestCurrency: ACCOMPANYING.currency,
    conferenceLabel: category,
    conferenceAmount: confAmount,
    workshops: workshops.map((name) => {
      const w = WORKSHOPS.find((x) => x.name === name);
      return { name, amount: w ? w.amount : 0 };
    }),
    workshopsTotal: workshopTotal,
    guestUnit,
    guestCount: validGuests.length,
    guestsTotal: guestTotal,
    // GST 18% on the subtotal; grand total is GST-inclusive (what's charged).
    subtotal: subtotalAmount,
    subtotalLabel,
    gstRate: 18,
    gstAmount,
    gstLabel,
    grandTotalLabel,
  });

  // After a verified Razorpay payment: submit the registration + payment ids,
  // send the confirmation email, and show the success screen. If the save fails,
  // surface the real reason instead of silently showing success.
  const submitConfirmed = async (rzp) => {
    const res = await apiConfirmRegistration(regId, {
      name: form.name, email: form.email,
      phone: `+${form.dialCode} ${form.phone}`.trim(),
      designation: form.designation, institution: form.institution,
      address: form.address, mciNumber: form.mciNumber, mciState: form.mciState,
      category,
      ltsiMemberNo: form.ltsiMemberNo,
      workshops,
      guests: validGuests,
      currency: confCurrency,
      totalAmount: grandTotalWithGst, // GST-inclusive amount actually charged
      phase: phase.key,
      regType: addon ? "addon" : "full",
      parentRef: addon ? addonInfo?.parentRef : undefined,
      breakdown: buildBreakdown(),
      razorpay_order_id: rzp.razorpay_order_id,
      razorpay_payment_id: rzp.razorpay_payment_id,
      razorpay_signature: rzp.razorpay_signature,
    });

    if (res && res.ok) {
      if (res.orderNo) setOrderNo(res.orderNo);
      setPaid(true);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Payment went through but the registration couldn't be saved — tell the user.
      // eslint-disable-next-line no-console
      console.error("Registration save failed after payment:", res);
      const reason = (res && res.errors && res.errors.join(" ")) || "server error";
      setPayError(
        `Payment succeeded (Payment ID: ${rzp.razorpay_payment_id}) but saving your ` +
        `registration failed: ${reason}. Please contact the organisers with this Payment ID.`
      );
    }
  };

  // Final step (Payment) — open Razorpay Checkout for the amount due.
  const payWithRazorpay = async () => {
    if (!addon && !category) return;
    setPayError("");

    // Charge the GST-inclusive grand total (INR).
    const amountInr = grandTotalWithGst || 0;
    if (amountInr <= 0) {
      setPayError("Online payment currently supports INR amounts only. Please contact the organisers.");
      return;
    }

    setPaying(true);
    try {
      const ready = await loadRazorpay();
      if (!ready) { setPayError("Couldn't load the payment gateway. Check your connection and retry."); return; }

      // Save a PENDING registration before payment so admins can follow up on
      // people who reach checkout but don't complete. Skipped for add-ons (those
      // merge into the existing registration on success). This also enforces the
      // one-conference-per-person rule: the server rejects a second full one.
      if (!addon) {
        const lead = await apiCreateRegistration({
          reference: regId,
          name: form.name, email: form.email,
          phone: `+${form.dialCode} ${form.phone}`.trim(),
          designation: form.designation, institution: form.institution,
          address: form.address, mciNumber: form.mciNumber, mciState: form.mciState,
          category, ltsiMemberNo: form.ltsiMemberNo,
          workshops, guests: validGuests, currency: confCurrency,
          totalAmount: grandTotalWithGst, phase: phase.key,
          regType: "full",
        });
        if (lead && lead.status === 409) {
          setPayError(
            (lead.errors && lead.errors[0]) ||
            "You already have a conference registration. Use “Add workshops” instead."
          );
          return; // stop — the finally block resets the paying state
        }
      }

      const order = await apiCreatePaymentOrder({ amount: amountInr, currency: "₹", reference: regId });
      if (!order.ok || !order.orderId) {
        setPayError((order.errors && order.errors.join(" ")) || "Couldn't start the payment. Please try again.");
        return;
      }

      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "LTSICON Chennai 2026",
        description: `Registration ${regId}`,
        order_id: order.orderId,
        prefill: {
          name: form.name,
          email: form.email,
          contact: `+${form.dialCode} ${form.phone}`.trim(),
        },
        theme: { color: "#6E1A2B" },
        handler: (resp) => submitConfirmed(resp),
        modal: { ondismiss: () => { setPaying(false); setPayError("Payment was cancelled. You can try again."); } },
      });
      rzp.on("payment.failed", (resp) => {
        setPaying(false);
        setPayError(resp?.error?.description || "Payment failed. Please try again.");
        // Record the failure so it shows under the admin "failed" filter for follow-up.
        // (Only for full registrations — add-ons have no separate row.)
        if (!addon) apiMarkRegistrationFailed(regId).catch(() => {});
      });
      rzp.open();
    } catch {
      setPayError("Something went wrong starting the payment. Please try again.");
    } finally {
      setPaying(false);
    }
  };

  /* ------- login gate for returning delegates ------- */
  const showLoginGate = !user && (hasDraft || forceLogin) && !showRegister;

  return (
    <div className="min-h-[100dvh] bg-[linear-gradient(180deg,var(--cream),var(--sand))]">
      <header className="sticky top-0 z-30 border-b border-[#E7D9BB] bg-[rgba(251,245,233,0.92)] px-5 py-3 backdrop-blur lg:px-10">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between">
          <button onClick={goHome} className="flex items-center gap-3">
            <img src={Logo} alt="LTSICON Chennai 2026" className="h-12 w-auto sm:h-14" />
          </button>
          <div className="flex items-center gap-3">
            {user ? (
              <ProfileMenu user={user} />
            ) : (
              <button onClick={goHome} className="inline-flex items-center gap-1.5 rounded-full border border-[#E7D9BB] px-4 py-2 text-sm font-semibold text-[#6E1A2B] transition hover:bg-[#F3E7C6]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M19 12H5" /><path d="m12 19-7-7 7-7" /></svg>
                Back to site
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1180px] px-5 py-8 lg:px-10 lg:py-12">
        {showLoginGate ? (
          <LoginGate
            onError={setError}
            error={error}
            onCreateAccount={() => { setForceLogin(false); setShowRegister(true); setStep(1); }}
          />
        ) : (
          <>
            <div className="mb-8">
              <span className="inline-flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#8A6A12]">
                <span className="h-px w-6 bg-[#8A6A12]" /> LTSICON Chennai 2026 · Registration
              </span>
              <h1 className="mt-2 font-serif text-3xl font-bold text-[#6E1A2B] sm:text-4xl">Registration</h1>
              <p className="mt-1.5 text-sm text-[#6E5C54]">
                Pricing phase: <b className="text-[#6E1A2B]">{phase.label}</b> · Reference: <b className="text-[#6E1A2B]">{addon ? (addonInfo?.parentRef || regId) : regId}</b>
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
              <Stepper step={step} onJump={(n) => n < step && (!addon || n >= 3) && setStep(n)} />

              <div className="rounded-2xl border border-[#E7D9BB] bg-white p-6 shadow-[0_18px_50px_-30px_rgba(110,26,43,0.5)] sm:p-8">
                {/* Returning paid delegate — offer a workshops-only add-on purchase. */}
                {!addon && !submitted && !paid && addonInfo?.registered && (
                  <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#C9A227]/50 bg-[#FBF5E9] p-4">
                    <div>
                      <p className="font-semibold text-[#6E1A2B]">You're already registered{addonInfo.category ? ` as ${addonInfo.category}` : ""}.</p>
                      <p className="text-sm text-[#6E5C54]">Need to add a workshop to your existing registration? You won't pay for the category again.</p>
                    </div>
                    <button type="button" onClick={startAddon} className="shrink-0 rounded-full bg-[#6E1A2B] px-5 py-2.5 text-sm font-semibold text-[#FBF1DD] transition hover:bg-[#4A1220]">
                      Add workshops
                    </button>
                  </div>
                )}

                {/* Active add-on mode indicator. */}
                {addon && !submitted && !paid && (
                  <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#C9A227]/50 bg-[#FBF5E9] p-4">
                    <p className="text-sm text-[#6E5C54]">
                      <b className="text-[#6E1A2B]">Add-on purchase</b> — adding workshops to registration <b className="text-[#6E1A2B]">{addonInfo?.parentRef || "—"}</b>. Category isn't charged again.
                    </p>
                    <button type="button" onClick={cancelAddon} className="shrink-0 text-sm font-semibold text-[#6E1A2B] underline">
                      Cancel add-on
                    </button>
                  </div>
                )}

                {submitted || paid ? (
                  <div className="py-6 text-center">
                    <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-[#EAF6EC] text-[#1f7a3d]">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8"><path d="M20 6 9 17l-5-5" /></svg>
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-[#6E1A2B]">Registration has been completed successfully.</h3>
                    {orderNo && (
                      <p className="mx-auto mt-3 max-w-md text-[#6E1A2B]">
                        Your reference number is <b className="font-serif text-lg">{orderNo}</b>
                      </p>
                    )}
                    <p className="mx-auto mt-2 max-w-md text-[#6E5C54]">Thank you, {form.name || "Delegate"}. A confirmation has been sent to {form.email || "your email"}.</p>
                    {/* <p className="mx-auto mt-2 max-w-md text-[#6E5C54]">Regarding the payment, our team will reach out to you shortly with the details.</p> */}
                    <button onClick={() => { clearDraft(); goHome(); }} className="mt-6 inline-flex items-center rounded-full bg-[#6E1A2B] px-7 py-3 text-sm font-semibold text-[#FBF1DD] transition hover:bg-[#4A1220]">Back to conference site</button>
                  </div>
                ) : (
                  <>
                    {step === 1 && (
                      <Section title="Step 1 · Your Details" desc={<>We create an account so you can leave and return later to complete payment. Fields marked <span className="text-[#B58A1E]">*</span> are required.</>}>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <Field label="Full name" required name="name" error={errors.name}>
                            <input className={errCls(errors.name)} value={form.name} onChange={set("name")} placeholder="Dr. Full Name" />
                          </Field>
                          <Field label="Email" required name="email" error={errors.email}>
                            <input type="email" className={errCls(errors.email)} value={form.email} onChange={set("email")} placeholder="name@institution.org" />
                          </Field>
                          <Field label="Phone number" full>
                            <PhoneInput form={form} setForm={setForm} />
                          </Field>
                          <Field label="Designation" required name="designation" error={errors.designation}>
                            <input className={errCls(errors.designation)} value={form.designation} onChange={set("designation")} placeholder="e.g. Consultant Surgeon" />
                          </Field>
                          <Field label="Institution" required name="institution" error={errors.institution}>
                            <input className={errCls(errors.institution)} value={form.institution} onChange={set("institution")} placeholder="Hospital / University" />
                          </Field>
                          <Field label="MCI / NMC number">
                            <input className={inputClass} value={form.mciNumber} onChange={set("mciNumber")} placeholder="Registration number" />
                          </Field>
                          <Field label="MCI state council" >
                            <select className={inputClass} value={form.mciState} onChange={set("mciState")}>
                              <option value="">Select state medical council</option>
                              {MCI_STATES.map((s) => <option key={s}>{s}</option>)}
                            </select>
                          </Field>
                          <Field label="Address" full>
                            <textarea className={`${inputClass} min-h-[90px]`} value={form.address} onChange={set("address")} placeholder="Correspondence address" />
                          </Field>
                          {!user && (
                            <Field label="Create a password" required full name="password" error={errors.password}>
                              <input type="password" className={errCls(errors.password)} value={form.password} onChange={set("password")} placeholder="Minimum 6 characters — used to log back in" />
                            </Field>
                          )}
                        </div>
                        <Step1Nav onCreate={createAndContinue} loggedIn={!!user} />
                      </Section>
                    )}

                    {step === 2 && (
                      <Section title="Step 2 · Category" desc={categoryLocked ? "Your category is set from your existing registration and can't be changed." : "Choose your category — the fee updates for the current phase."}>
                        {categoryLocked && (
                          <p className="mb-4 rounded-xl border border-[#C9A227]/50 bg-[#FBF5E9] px-4 py-3 text-sm text-[#6E5C54]">
                            🔒 You're already registered as <b className="text-[#6E1A2B]">{category || addonInfo?.category}</b>. Category can't be edited after payment.
                          </p>
                        )}
                        <div className="grid gap-3">
                          {Object.entries(RATES).map(([name, r]) => {
                            const selected = category === name;
                            // When locked, only show the delegate's own category.
                            if (categoryLocked && !selected) return null;
                            return (
                              <div key={name}>
                                <button type="button"
                                  disabled={categoryLocked}
                                  onClick={() => { if (!categoryLocked) setCategory(name); }}
                                  className={`flex w-full items-center justify-between gap-4 rounded-2xl border p-4 text-left transition ${selected ? "border-[#6E1A2B] bg-[#FBF5E9] ring-2 ring-[#C9A227]/30" : "border-[#E7D9BB] bg-white hover:border-[#C9A227]"} ${categoryLocked ? "cursor-not-allowed" : ""}`}>
                                  <span className="flex items-center gap-3">
                                    <span className={`grid h-5 w-5 place-items-center rounded-full border-2 ${selected ? "border-[#6E1A2B]" : "border-[#C9A227]"}`}>
                                      {selected && <span className="h-2.5 w-2.5 rounded-full bg-[#6E1A2B]" />}
                                    </span>
                                    <span className="font-semibold text-[#1D1D1F]">{name}</span>
                                  </span>
                                  <span className="text-right">
                                    <b className="block text-[#6E1A2B]">{money(r.currency, r[phase.key])}</b>
                                    <span className="text-[0.7rem] uppercase tracking-wide text-[#8A6A12]">{phase.label}</span>
                                  </span>
                                </button>
                                {/* LTSI membership number — only for the LTSI Member category. */}
                                {selected && name === "LTSI Member" && (
                                  <div className="mt-2 rounded-2xl border border-[#E7D9BB] bg-[#FBF5E9] p-4">
                                    <label className={labelClass} htmlFor="ltsi-member-no">
                                      LTSI Membership No <span className="text-[#B58A1E]">*</span>
                                    </label>
                                    <input
                                      id="ltsi-member-no"
                                      type="text"
                                      value={form.ltsiMemberNo}
                                      onChange={set("ltsiMemberNo")}
                                      readOnly={categoryLocked}
                                      placeholder="Enter your LTSI membership number"
                                      className={`${inputClass} ${categoryLocked ? "bg-[#F4ECD9] cursor-not-allowed" : ""}`}
                                    />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        {!categoryLocked && (
                          <p className="mt-4 text-sm text-[#6E5C54]">Includes all scientific sessions, conference kit, lunches and a certificate of participation.</p>
                        )}
                        <Nav onBack={back} onNext={next} nextDisabled={!category || (category === "LTSI Member" && !form.ltsiMemberNo.trim())} />
                      </Section>
                    )}

                    {step === 3 && (
                      <Section title="Step 3 · Pre-Conference Workshops" desc="Optional hands-on workshops on 10 December. Each carries its own fee.">
                        <div className="grid gap-3">
                          {WORKSHOPS.map((w) => {
                            const selected = workshops.includes(w.name);
                            const already = addon && purchasedWorkshops.includes(w.name);
                            return (
                              <button key={w.name} type="button"
                                disabled={already}
                                onClick={() => { if (already) return; setWorkshops((p) => p.includes(w.name) ? p.filter((x) => x !== w.name) : [...p, w.name]); }}
                                className={`flex items-center justify-between gap-4 rounded-2xl border p-4 text-left transition ${already ? "cursor-not-allowed border-[#E7D9BB] bg-[#F4ECD9] opacity-70" : selected ? "border-[#6E1A2B] bg-[#FBF5E9]" : "border-[#E7D9BB] bg-white hover:border-[#C9A227]"}`}>
                                <span className="flex items-center gap-3">
                                  <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border-2 ${selected && !already ? "border-[#6E1A2B] bg-[#6E1A2B]" : "border-[#C9A227]"}`}>
                                    {selected && !already && <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3"><path d="M20 6 9 17l-5-5" /></svg>}
                                  </span>
                                  <span className="font-medium text-[#1D1D1F]">
                                    {w.name}
                                    {already && <span className="ml-2 rounded bg-[#C9A227]/25 px-2 py-0.5 text-[0.7rem] font-semibold text-[#8A6A12]">Already purchased</span>}
                                  </span>
                                </span>
                                <span className="shrink-0 font-semibold text-[#6E1A2B]">{money(WS_CUR, w.amount)}</span>
                              </button>
                            );
                          })}
                        </div>
                        {workshops.length > 0 && (
                          <p className="mt-4 text-sm text-[#6E5C54]">Workshops subtotal: <b className="text-[#6E1A2B]">{money(WS_CUR, workshopTotal)}</b></p>
                        )}
                        <p className="mt-3 rounded-xl bg-[#F4ECD9] px-4 py-3 text-sm italic text-[#6E5C54]">Workshop dates are provisional and fees indicative; final schedule to be confirmed.</p>
                        <Nav onBack={back} onNext={next} nextLabel={workshops.length ? "Continue" : "Skip & continue"} />
                      </Section>
                    )}

                    {step === 4 && (
                      <Section title="Step 4 · Accompanying Persons" desc={`Add up to 4 guests. Each is charged ${money(ACCOMPANYING.currency, guestUnit)} (${phase.label}).`}>
                        {/* Existing accompanying persons already on the registration (add-on flow). */}
                        {addon && (addonInfo?.existingGuests || []).length > 0 && (
                          <div className="mb-4 rounded-2xl border border-[#E7D9BB] bg-[#F4ECD9] p-4">
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#8A6A12]">Already added</p>
                            <ul className="space-y-1">
                              {addonInfo.existingGuests.map((g, i) => (
                                <li key={i} className="text-sm text-[#33242A]">
                                  {g.name}{g.mobile ? ` · ${g.mobile}` : ""}
                                  <span className="ml-2 rounded bg-[#C9A227]/25 px-2 py-0.5 text-[0.7rem] font-semibold text-[#8A6A12]">Already added</span>
                                </li>
                              ))}
                            </ul>
                            <p className="mt-2 text-xs text-[#6E5C54]">Add any new accompanying persons below — you won't be charged again for the ones above.</p>
                          </div>
                        )}
                        <div className="space-y-3">
                          {guests.map((g, i) => (
                            <div key={i} className="grid gap-3 rounded-2xl border border-[#E7D9BB] bg-[#FBF5E9] p-4 sm:grid-cols-[1fr_1fr_auto]">
                              <input className={inputClass} value={g.name} onChange={(e) => setGuests((p) => p.map((x, idx) => idx === i ? { ...x, name: e.target.value } : x))} placeholder={`Guest ${i + 1} name`} />
                              <input className={inputClass} value={g.mobile} onChange={(e) => setGuests((p) => p.map((x, idx) => idx === i ? { ...x, mobile: e.target.value } : x))} placeholder="Mobile number" />
                              <button type="button" onClick={() => setGuests((p) => p.filter((_, idx) => idx !== i))} className="inline-flex items-center justify-center rounded-xl border border-[#E7D9BB] bg-white px-4 py-2 text-sm font-semibold text-[#6E1A2B] transition hover:bg-[#F3E7C6]">Remove</button>
                            </div>
                          ))}
                        </div>
                        {guests.length < 4 ? (
                          <button type="button" onClick={() => setGuests((p) => [...p, { name: "", mobile: "" }])} className="mt-4 inline-flex items-center gap-2 rounded-full border border-dashed border-[#C9A227] px-5 py-2.5 text-sm font-semibold text-[#8A6A12] transition hover:bg-[#F3E7C6]">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-4 w-4"><path d="M12 5v14M5 12h14" /></svg>
                            Add accompanying person
                          </button>
                        ) : (
                          <p className="mt-4 text-sm text-[#6E5C54]">Maximum of 4 accompanying persons reached.</p>
                        )}
                        {validGuests.length > 0 && (
                          <p className="mt-4 text-sm text-[#6E5C54]">Subtotal: <b className="text-[#6E1A2B]">{money(ACCOMPANYING.currency, guestTotal)}</b> ({validGuests.length} × {money(ACCOMPANYING.currency, guestUnit)})</p>
                        )}
                        <Nav onBack={back} onNext={next} nextLabel={validGuests.length ? "Continue" : "Skip & continue"} />
                      </Section>
                    )}

                    {step === 5 && (
                      <Section title="Step 5 · Summary" desc="Review your registration and submit.">
                        <div className="overflow-hidden rounded-2xl border border-[#E7D9BB]">
                          <SummaryRow label="Delegate" value={form.name || "—"} sub={form.email} />
                          <SummaryRow label="Conference registration" value={category || "Not selected"} amount={catRate ? money(confCurrency, confAmount) : "—"} />
                          <SummaryRow label="Workshops" value={workshops.length ? `${workshops.length} selected` : "None"} amount={workshops.length ? money(WS_CUR, workshopTotal) : "—"} sub={workshops.join(", ")} />
                          <SummaryRow label="Accompanying persons" value={validGuests.length ? `${validGuests.length} guest${validGuests.length > 1 ? "s" : ""}` : "None"} amount={validGuests.length ? money(ACCOMPANYING.currency, guestTotal) : "—"} sub={validGuests.map((g) => g.name).join(", ")} />

                          {/* Itemised breakdown of how the grand total is reached. */}
                          <div className="space-y-2 border-t border-[#E7D9BB] bg-[#FBF5E9] px-5 py-4">
                            {catRate && (
                              <TotalLine label={`Conference registration — ${category}`} value={money(confCurrency, confAmount)} />
                            )}
                            {workshops.length > 0 && (
                              <TotalLine label={`Workshops (${workshops.length} selected)`} value={money(WS_CUR, workshopTotal)} />
                            )}
                            {validGuests.length > 0 && (
                              <TotalLine
                                label={`Accompanying persons (${validGuests.length} × ${money(ACCOMPANYING.currency, guestUnit)})`}
                                value={money(ACCOMPANYING.currency, guestTotal)}
                              />
                            )}
                            {!catRate && !workshops.length && !validGuests.length && (
                              <p className="text-sm text-[#6E5C54]">Nothing selected yet.</p>
                            )}

                            {subtotalAmount > 0 && (
                              <div className="mt-2 space-y-2 border-t border-[#E7D9BB] pt-3">
                                <TotalLine label="Subtotal" value={subtotalLabel} />
                                <TotalLine label="GST (18%)" value={gstLabel} />
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between gap-4 bg-[#6E1A2B] px-5 py-4 text-white">
                            <div>
                              <span className="font-serif text-lg font-semibold">Grand Total</span>
                              <span className="mt-0.5 block text-[0.7rem] uppercase tracking-wide text-white/60">
                                {phase.label} phase · incl. 18% GST
                              </span>
                            </div>
                            <span className="text-right font-serif text-2xl font-bold text-[#E7C979]">{grandTotalLabel}</span>
                          </div>
                        </div>
                        {Object.keys(totalsByCurrency).length > 1 && (
                          <p className="mt-3 rounded-xl bg-[#F4ECD9] px-4 py-3 text-xs text-[#6E5C54]">
                            Your selections span more than one currency, so the grand total is shown as separate
                            amounts per currency rather than a single converted figure.
                          </p>
                        )}
                        <p className="mt-3 text-xs text-[#6E5C54]">Amounts shown for the {phase.label} phase.</p>
                        <Nav onBack={back} onNext={next} nextLabel="Continue to payment" nextDisabled={addon ? subtotalAmount <= 0 : !category} />
                      </Section>
                    )}

                    {step === 6 && (
                      <Section title="Step 6 · Payment" desc="Pay securely online with Razorpay to complete your registration.">
                        {/* amount due */}
                        <div className="mb-5 flex items-center justify-between rounded-2xl bg-[#F4ECD9] px-5 py-4">
                          <div>
                            <span className="font-semibold text-[#6E1A2B]">Amount to pay</span>
                            <span className="mt-0.5 block text-xs text-[#6E5C54]">{phase.label} phase · incl. 18% GST</span>
                          </div>
                          <span className="font-serif text-2xl font-bold text-[#6E1A2B]">{grandTotalLabel}</span>
                        </div>

                        {payError && (
                          <p className="mb-4 rounded-lg bg-[#FBEBEB] px-3 py-2 text-sm font-medium text-[#B3261E]">{payError}</p>
                        )}

                        {/* One conference per person: block a second full registration. */}
                        {!addon && addonInfo?.registered && (
                          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#C9A227]/50 bg-[#FBF5E9] p-4">
                            <p className="text-sm text-[#6E5C54]">
                              You already have a conference registration (<b className="text-[#6E1A2B]">{addonInfo.parentRef}</b>). Only one is allowed per person — you can add workshops instead.
                            </p>
                            <button type="button" onClick={startAddon} className="shrink-0 rounded-full bg-[#6E1A2B] px-5 py-2.5 text-sm font-semibold text-[#FBF1DD] hover:bg-[#4A1220]">
                              Add workshops
                            </button>
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={payWithRazorpay}
                          disabled={paying || (addon ? grandTotalWithGst <= 0 : (!category || !!addonInfo?.registered))}
                          className="flex w-full items-center justify-center gap-2 rounded-full bg-[#6E1A2B] px-6 py-3.5 text-sm font-semibold text-[#FBF1DD] transition hover:-translate-y-0.5 hover:bg-[#4A1220] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></svg>
                          {paying ? "Processing…" : `Pay ${grandTotalLabel} securely`}
                        </button>
                        <p className="mt-3 text-center text-xs text-[#6E5C54]">
                          Secured by Razorpay · UPI, cards &amp; net-banking supported.
                        </p>

                        <Nav onBack={back} hideNext />
                      </Section>
                    )}

                    {/* ---------------------------------------------------------------
                        Previous placeholder payment UI (card / UPI / net-banking) kept
                        for reference — do not delete. Superseded by the QR step above.
                    -----------------------------------------------------------------
                    {step === 6 && (
                      <Section title="Step 6 · Payment" desc="Secure checkout. Placeholder for the live payment gateway.">
                        (old gateway placeholder — see git history)
                      </Section>
                    )}
                    */}
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ------------------------------ phone (intl-tel-input) ---------------------- */

function PhoneInput({ form, setForm }) {
  const ref = useRef(null);
  const itiRef = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const iti = intlTelInput(ref.current, {
      initialCountry: form.iso2 || "in",
      separateDialCode: true,
      preferredCountries: ["in", "us", "gb", "ae", "sg"],
    });
    itiRef.current = iti;
    if (form.phone) ref.current.value = form.phone;

    const sync = () => {
      const data = iti.getSelectedCountryData();
      setForm((f) => ({ ...f, phone: ref.current.value, dialCode: data.dialCode || "91", iso2: data.iso2 || "in" }));
    };
    ref.current.addEventListener("input", sync);
    ref.current.addEventListener("countrychange", sync);
    return () => { try { iti.destroy(); } catch { /* noop */ } };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <input ref={ref} type="tel" className={`${inputClass} !pl-[92px]`} placeholder="XXXXX XXXXX" />;
}

/* ------------------------------ login gate -------------------------------- */

function LoginGate({ onError, error, onCreateAccount }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState("login"); // "login" | "forgot"
  const [notice, setNotice] = useState("");
  const [noticeOk, setNoticeOk] = useState(true); // true = success (green), false = error (red)

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    const res = await login(email, password);
    setBusy(false);
    onError(res.ok ? "" : (res.errors && res.errors.join(" ")) || "Login failed.");
  };

  const submitForgot = async (e) => {
    e.preventDefault();
    setBusy(true);
    const res = await apiForgotPassword(email);
    setBusy(false);
    if (res.ok) {
      setNoticeOk(true);
      setNotice(res.message || "A password-reset link has been sent to your email. Check your inbox.");
    } else {
      setNoticeOk(false);
      setNotice((res.errors && res.errors.join(" ")) || "This email is not registered.");
    }
  };

  return (
    <div className="mx-auto max-w-md py-6">
      <div className="mb-6 text-center">
        <span className="inline-flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#8A6A12]">
          <span className="h-px w-6 bg-[#8A6A12]" /> {mode === "forgot" ? "Reset password" : "Welcome back"}
        </span>
        <h1 className="mt-2 font-serif text-3xl font-bold text-[#6E1A2B]">
          {mode === "forgot" ? "Forgot your password?" : "Log in to continue"}
        </h1>
        <p className="mt-1.5 text-sm text-[#6E5C54]">
          {mode === "forgot"
            ? "Enter your email and we'll send you a link to set a new password."
            : "Log in to pick up your registration and complete payment."}
        </p>
      </div>

      {mode === "forgot" ? (
        <form onSubmit={submitForgot} className="rounded-2xl border border-[#E7D9BB] bg-white p-6 shadow-[0_18px_50px_-30px_rgba(110,26,43,0.5)] sm:p-8">
          <label className="block">
            <span className={labelClass}>Email</span>
            <input type="email" required className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@institution.org" />
          </label>
          {notice && (
            <p className={`mt-3 rounded-lg px-3 py-2 text-sm font-medium ${noticeOk ? "bg-[#EAF6EC] text-[#1f7a3d]" : "bg-[#FBEBEB] text-[#B3261E]"}`}>{notice}</p>
          )}
          <button type="submit" disabled={busy} className="mt-6 flex w-full items-center justify-center rounded-full bg-[#6E1A2B] px-6 py-3.5 text-sm font-semibold text-[#FBF1DD] transition hover:-translate-y-0.5 hover:bg-[#4A1220] disabled:opacity-50">
            {busy ? "Sending…" : "Send reset link"}
          </button>
          <p className="mt-4 rounded-lg bg-[#F4ECD9] px-3 py-2 text-center text-xs text-[#6E5C54]">
            No account yet?{" "}
            <button type="button" onClick={() => onCreateAccount && onCreateAccount()} className="font-semibold text-[#8A6A12] underline underline-offset-2 hover:text-[#6E1A2B]">Register Now</button>
            {" "}— a reset link is only sent if the email already has an account.
          </p>
          <button type="button" onClick={() => { setMode("login"); setNotice(""); }} className="mt-3 w-full text-center text-sm font-semibold text-[#8A6A12] hover:text-[#6E1A2B]">Back to login</button>
        </form>
      ) : (
        <form onSubmit={submit} className="rounded-2xl border border-[#E7D9BB] bg-white p-6 shadow-[0_18px_50px_-30px_rgba(110,26,43,0.5)] sm:p-8">
          <label className="mb-4 block">
            <span className={labelClass}>Email</span>
            <input type="email" required className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@institution.org" />
          </label>
          <label className="block">
            <span className={labelClass}>Password</span>
            <input type="password" required className={inputClass} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" />
          </label>
          {error && <p className="mt-3 rounded-lg bg-[#FBEBEB] px-3 py-2 text-sm font-medium text-[#B3261E]">{error}</p>}
          <button type="submit" disabled={busy} className="mt-6 flex w-full items-center justify-center rounded-full bg-[#6E1A2B] px-6 py-3.5 text-sm font-semibold text-[#FBF1DD] transition hover:-translate-y-0.5 hover:bg-[#4A1220] disabled:opacity-50">
            {busy ? "Logging in…" : "Log in & continue"}
          </button>
          <div className="mt-4 flex items-center justify-between text-sm font-semibold">
            {/* Create account uses the existing Step 1 registration form, not a separate page. */}
            <button type="button" onClick={() => onCreateAccount && onCreateAccount()} className="text-[#8A6A12] hover:text-[#6E1A2B]">Register Now</button>
            <button type="button" onClick={() => { setMode("forgot"); onError(""); }} className="text-[#8A6A12] hover:text-[#6E1A2B]">Forgot password?</button>
          </div>
        </form>
      )}
    </div>
  );
}

/* ------------------------------ sub-components ----------------------------- */

function Stepper({ step, onJump }) {
  return (
    <nav aria-label="Registration steps">
      <ol className="flex gap-2 overflow-x-auto pb-2 lg:hidden">
        {STEPS.map((s) => {
          const done = s.n < step, active = s.n === step;
          return (
            <li key={s.n}>
              <button onClick={() => onJump(s.n)} className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition ${active ? "bg-[#6E1A2B] text-white" : done ? "bg-[#C9A227] text-white" : "bg-[#F3E7C6] text-[#8A6A12]"}`}>
                {done ? "✓" : s.n}
              </button>
            </li>
          );
        })}
      </ol>

      <ol className="sticky top-24 hidden lg:block">
        {STEPS.map((s, i) => {
          const done = s.n < step, active = s.n === step;
          return (
            <li key={s.n} className="relative flex gap-4 pb-7 last:pb-0">
              {i < STEPS.length - 1 && <span className={`absolute left-[17px] top-9 h-full w-0.5 ${done ? "bg-[#C9A227]" : "bg-[#E7D9BB]"}`} />}
              <button onClick={() => onJump(s.n)} disabled={s.n >= step}
                className={`relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-bold transition ${active ? "bg-[#6E1A2B] text-white ring-4 ring-[#6E1A2B]/15" : done ? "bg-[#C9A227] text-white" : "bg-[#F3E7C6] text-[#8A6A12]"}`}>
                {done ? "✓" : s.n}
              </button>
              <div className="pt-1">
                <div className={`text-sm font-semibold ${active ? "text-[#6E1A2B]" : "text-[#33242A]"}`}>{s.label}</div>
                <div className="text-xs text-[#6E5C54]">{s.sub}</div>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function Section({ title, desc, children }) {
  return (
    <div>
      <h2 className="font-serif text-2xl font-bold text-[#6E1A2B]">{title}</h2>
      <p className="mt-1.5 mb-6 text-sm text-[#6E5C54]">{desc}</p>
      {children}
    </div>
  );
}

function Field({ label, required, full, children, error, name }) {
  return (
    <label data-field={name} className={`flex flex-col ${full ? "sm:col-span-2" : ""}`}>
      <span className={labelClass}>{label}{required && <span className="text-[#B58A1E]"> *</span>}</span>
      {children}
      {error && <span className="mt-1 text-xs font-medium text-[#B3261E]">{error}</span>}
    </label>
  );
}

function Step1Nav({ onCreate, loggedIn }) {
  // Always clickable — clicking with empty fields surfaces the inline errors
  // rather than leaving the delegate with a dead, greyed-out button.
  return (
    <div className="mt-8 flex items-center justify-end">
      <button type="button" onClick={onCreate}
        className="inline-flex items-center gap-1.5 cursor-pointer rounded-full bg-[#6E1A2B] px-7 py-3 text-sm font-semibold text-[#FBF1DD] transition hover:-translate-y-0.5 hover:bg-[#4A1220]">
        {loggedIn ? "Save & continue" : "Create account & continue"}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
      </button>
    </div>
  );
}

function Nav({ onBack, onNext, nextLabel = "Continue", nextDisabled, hideBack, hideNext }) {
  return (
    <div className="mt-8 flex items-center justify-between gap-3">
      {!hideBack ? (
        <button type="button" onClick={onBack} className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#E7D9BB] px-6 py-3 text-sm font-semibold text-[#6E1A2B] transition hover:bg-[#F3E7C6]">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M19 12H5" /><path d="m12 19-7-7 7-7" /></svg>
          Back
        </button>
      ) : <span />}
      {!hideNext && (
        <button type="button" onClick={onNext} disabled={nextDisabled}
          className="inline-flex items-center gap-1.5 rounded-full cursor-pointer bg-[#6E1A2B] px-7 py-3 text-sm font-semibold text-[#FBF1DD] transition hover:-translate-y-0.5 hover:bg-[#4A1220] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0">
          {nextLabel}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
        </button>
      )}
    </div>
  );
}

// One line of the grand-total breakdown.
function TotalLine({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-[#6E5C54]">{label}</span>
      <span className="shrink-0 font-semibold text-[#6E1A2B]">{value}</span>
    </div>
  );
}

function SummaryRow({ label, value, sub, amount }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[#EDEDF0] bg-white px-5 py-4 last:border-b-0">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wide text-[#8A6A12]">{label}</div>
        <div className="mt-0.5 font-medium text-[#1D1D1F]">{value}</div>
        {sub && <div className="mt-0.5 text-xs text-[#6E5C54]">{sub}</div>}
      </div>
      {amount !== undefined && <div className="shrink-0 font-semibold text-[#6E1A2B]">{amount}</div>}
    </div>
  );
}
