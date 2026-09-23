import { useState } from "react";
import IntlPhone from "./IntlPhone.jsx";
import { submitAbstract } from "../lib/api.js";

const PRESENTATION_TYPES = ["Oral", "Mini-Oral", "E-Poster", "Surgical Video"];
const TRACKS = [
  "Transplant & HPB Surgery",
  "Hepatology",
  "Anaesthesia & Critical Care",
  "Interventional Radiology",
  "Pathology & Immunology",
  "Pediatric Liver Transplant",
  "Transplant Oncology",
  "Nursing & Coordination",
  "Translational/Basic Science",
];
const DECLARATIONS = [
  "Abstract is original, unpublished and not under review elsewhere.",
  "All listed authors have approved the submission.",
  "Presenting author will register if accepted.",
  "Consent to publication in conference materials.",
];

const categories = [
  {
    title: "Oral Presentation",
    blurb: "Podium presentation in the main scientific sessions.",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><circle cx="9" cy="8" r="3" /><path d="M2.5 20c.8-3 3.4-4.6 6.5-4.6s5.7 1.6 6.5 4.6" /><circle cx="17.6" cy="8.6" r="2.2" /><path d="M17.6 13.2c2.3 0 4.2 1.2 4.9 3.3" /></svg>,
    guidelines: [
      "8-minute podium presentation followed by 2 minutes of discussion.",
      "PowerPoint (16:9) to be uploaded at the speaker-ready desk at least 3 hours before the session.",
      "Selected for the main hall and considered for the Best Oral Paper award.",
      "Structured abstract required: Background, Methods, Results, Conclusion (max 250 words).",
    ],
  },
  {
    title: "Mini-Oral",
    blurb: "Short focused presentation with expert discussion.",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M3 12h3l2.4 6L12 5l2 8h5" /></svg>,
    guidelines: [
      "5-minute rapid-fire presentation with 1 minute of discussion.",
      "Maximum 6 slides; a single key figure or table is encouraged.",
      "Ideal for focused datasets, case series and work-in-progress.",
      "Grouped into moderated thematic sessions with a panel of experts.",
    ],
  },
  {
    title: "E-Poster",
    blurb: "Digital poster on the conference e-poster platform.",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M12 6.5C10.4 5 8 4.5 4 4.8V18c4-.3 6.4.2 8 1.7 1.6-1.5 4-2 8-1.7V4.8c-4-.3-6.4.2-8 1.7z" /><path d="M12 6.5v13" /></svg>,
    guidelines: [
      "Single portrait slide (1080×1920) uploaded as PDF to the e-poster platform.",
      "Displayed on digital kiosks throughout the venue for the full conference.",
      "Presenting author available at the kiosk during the scheduled poster walk.",
      "Considered for the Best E-Poster award; no live projection required.",
    ],
  },
  {
    title: "Surgical Video",
    blurb: "Edited operative video with expert commentary.",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><rect x="3" y="6" width="13" height="12" rx="2.2" /><path d="M16 10.2 21 7v10l-5-3.2z" /></svg>,
    guidelines: [
      "Edited operative video, maximum 6 minutes, MP4 (H.264), up to 500 MB.",
      "Narrated commentary highlighting technique, key steps and pitfalls.",
      "Patient identifiers must be fully anonymised in the footage.",
      "Shown in the dedicated Surgical Video Session with expert critique.",
    ],
  },
];

function PresentationCategories() {
  const [active, setActive] = useState(0);
  const cat = categories[active];
  return (
    <div>
      <h3 className="mb-4 font-serif text-2xl font-semibold text-[#6E1A2B]">Presentation Categories</h3>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Presentation categories">
        {categories.map((c, i) => (
          <button
            key={c.title}
            type="button"
            role="tab"
            aria-selected={active === i}
            onClick={() => setActive(i)}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
              active === i
                ? "border-[#6E1A2B] bg-[#6E1A2B] text-white shadow-sm"
                : "border-[#E7D9BB] bg-white text-[#6E1A2B] hover:border-[#C9A227] hover:bg-[#F3E7C6]"
            }`}
          >
            {c.title}
          </button>
        ))}
      </div>

      <div role="tabpanel" className="mt-5 rounded-2xl border border-[#E7D9BB] bg-white p-6 shadow-sm sm:p-7">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-[#F3E7C6] text-[#8A6A12]">{cat.icon}</div>
          <div>
            <b className="block text-lg text-[#1D1D1F]">{cat.title}</b>
            <span className="mt-1 block text-sm text-[#6E5C54]">{cat.blurb}</span>
          </div>
        </div>
        <div className="mt-5 border-t border-[#EDEDF0] pt-5">
          <span className="mb-3 block text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[#8A6A12]">Guidelines</span>
          <ul className="space-y-3">
            {cat.guidelines.map((g) => (
              <li key={g} className="relative pl-6 text-sm leading-relaxed text-[#6E5C54] before:absolute before:left-0 before:top-0 before:font-bold before:text-[#C9A227] before:content-['›']">{g}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// Marks a mandatory field — same gold asterisk used on the registration form.
const Req = () => <span className="text-[#B58A1E]"> *</span>;

const EMPTY_FORM = {
  firstName: "", lastName: "", email: "", mobile: "", institution: "",
  coAuthors: "", membershipId: "", presentationType: PRESENTATION_TYPES[0],
  track: TRACKS[0], title: "", abstractBody: "", keywords: "",
};

const REQUIRED_FIELDS = [
  ["firstName", "First name"], ["lastName", "Last name"], ["email", "Email"],
  ["mobile", "Mobile"], ["institution", "Institution / Affiliation"],
  ["presentationType", "Presentation type"], ["track", "Track / Theme"],
  ["title", "Abstract title"],
];

function SubmissionForm() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [declarations, setDeclarations] = useState(() => DECLARATIONS.map(() => false));
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({}); // { fieldName: "message" }

  // Editing a field clears its error straight away.
  const set = (k) => (e) => {
    const { value } = e.target;
    setForm((f) => ({ ...f, [k]: value }));
    setErrors((prev) => (prev[k] ? { ...prev, [k]: undefined } : prev));
  };

  const validate = () => {
    const next = {};
    for (const [k, label] of REQUIRED_FIELDS) {
      if (!String(form[k] ?? "").trim()) next[k] = `${label} is required.`;
    }
    if (form.email.trim() && !/^\S+@\S+\.\S+$/.test(form.email)) {
      next.email = "Please enter a valid email address.";
    }
    return next;
  };

  // Styling helpers — invalid fields get a red border.
  const inputCls = (k) =>
    `rounded-[12px] border bg-white px-4 py-3 text-base text-[#6E5C54] sm:text-sm ${
      errors[k] ? "border-[#B3261E] ring-1 ring-[#B3261E]/30" : "border-[#D2D2D7]"
    }`;
  const FieldError = ({ name }) =>
    errors[name] ? (
      <span className="mt-0.5 text-xs font-medium text-[#B3261E]">{errors[name]}</span>
    ) : null;

  const onSubmit = async (e) => {
    e.preventDefault();
    const found = validate();
    if (Object.keys(found).length) {
      setErrors(found);
      setStatus("error");
      setMessage("");
      // Bring the first problem field into view.
      const firstKey = REQUIRED_FIELDS.map(([k]) => k).find((k) => found[k]);
      document.querySelector(`[data-field="${firstKey}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setErrors({});
    setStatus("submitting");
    setMessage("");
    const accepted = DECLARATIONS.filter((_, i) => declarations[i]);
    const res = await submitAbstract({ ...form, declarations: accepted, file: file || undefined });

    if (res.ok) {
      setStatus("success");
      setMessage("Thank you — your abstract has been submitted. A confirmation email is on its way.");
      setForm(EMPTY_FORM);
      setDeclarations(DECLARATIONS.map(() => false));
      setFile(null);
    } else {
      setStatus("error");
      setMessage(
        res.offline
          ? "We couldn't reach the submission server. Please try again shortly or email abstracts@ltsicon2026.com."
          : (res.errors && res.errors.join(" ")) || "Submission failed. Please try again."
      );
    }
  };

  return (
    <form onSubmit={onSubmit} className="rounded-[18px] border border-[#D2D2D7] bg-[#F5F5F7] p-5 shadow-sm sm:p-8">
      <h4 className="font-serif text-lg font-semibold text-[#6E1A2B]">Presenting Author</h4>
      <p className="mb-6 mt-1 text-sm text-[#6E5C54]">
        Complete the form below to submit your abstract for review. Fields marked
        <Req /> are required.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        <label data-field="firstName" className="flex flex-col gap-2 text-sm font-semibold text-[#1D1D1F]">
          <span>First name<Req /></span>
          <input value={form.firstName} onChange={set("firstName")} type="text" placeholder="First name" className={inputCls("firstName")} />
          <FieldError name="firstName" />
        </label>
        <label data-field="lastName" className="flex flex-col gap-2 text-sm font-semibold text-[#1D1D1F]">
          <span>Last name<Req /></span>
          <input value={form.lastName} onChange={set("lastName")} type="text" placeholder="Last name" className={inputCls("lastName")} />
          <FieldError name="lastName" />
        </label>
        <label data-field="email" className="flex flex-col gap-2 text-sm font-semibold text-[#1D1D1F]">
          <span>Email<Req /></span>
          <input value={form.email} onChange={set("email")} type="email" placeholder="name@institution.org" className={inputCls("email")} />
          <FieldError name="email" />
        </label>
        <label data-field="mobile" className="flex flex-col gap-2 text-sm font-semibold text-[#1D1D1F] ">
          <span>Mobile<Req /></span>
          <IntlPhone
            onChange={({ number, dialCode }) => {
              setForm((f) => ({ ...f, mobile: number ? `+${dialCode} ${number}` : "" }));
              setErrors((prev) => (prev.mobile ? { ...prev, mobile: undefined } : prev));
            }}
            className={`w-full ${inputCls("mobile")}`}
          />
          <FieldError name="mobile" />
        </label>
        <label data-field="institution" className="md:col-span-2 flex flex-col gap-2 text-sm font-semibold text-[#1D1D1F]">
          <span>Institution / Affiliation<Req /></span>
          <input value={form.institution} onChange={set("institution")} type="text" placeholder="Institution / Affiliation" className={inputCls("institution")} />
          <FieldError name="institution" />
        </label>
        <label className="md:col-span-2 flex flex-col gap-2 text-sm font-semibold text-[#1D1D1F]">
          <span>Co-authors</span>
          <input value={form.coAuthors} onChange={set("coAuthors")} type="text" placeholder="Comma-separated list" className="rounded-[12px] border border-[#D2D2D7] bg-white px-4 py-3 text-base text-[#6E5C54] sm:text-sm" />
        </label>
        <label className="md:col-span-2 flex flex-col gap-2 text-sm font-semibold text-[#1D1D1F]">
          <span>LTSI membership / Registration ID</span>
          <input value={form.membershipId} onChange={set("membershipId")} type="text" placeholder="Membership or registration ID" className="rounded-[12px] border border-[#D2D2D7] bg-white px-4 py-3 text-base text-[#6E5C54] sm:text-sm" />
        </label>
      </div>

      <h4 className="mt-8 font-serif text-lg font-semibold text-[#6E1A2B]">Abstract Details</h4>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label data-field="presentationType" className="flex flex-col gap-2 text-sm font-semibold text-[#1D1D1F]">
          <span>Presentation type<Req /></span>
          <select value={form.presentationType} onChange={set("presentationType")} className={inputCls("presentationType")}>
            {PRESENTATION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <FieldError name="presentationType" />
        </label>
        <label data-field="track" className="flex flex-col gap-2 text-sm font-semibold text-[#1D1D1F]">
          <span>Track / Theme<Req /></span>
          <select value={form.track} onChange={set("track")} className={inputCls("track")}>
            {TRACKS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <FieldError name="track" />
        </label>
        <label data-field="title" className="md:col-span-2 flex flex-col gap-2 text-sm font-semibold text-[#1D1D1F]">
          <span>Abstract title<Req /></span>
          <input value={form.title} onChange={set("title")} type="text" placeholder="Abstract title" className={inputCls("title")} />
          <FieldError name="title" />
        </label>
        <label className="md:col-span-2 flex flex-col gap-2 text-sm font-semibold text-[#1D1D1F]">
          <span>Abstract body</span>
          <textarea value={form.abstractBody} onChange={set("abstractBody")} placeholder="Background, Methods, Results, Conclusion (max 250 words)" className="min-h-[140px] rounded-[12px] border border-[#D2D2D7] bg-white px-4 py-3 text-base text-[#6E5C54] sm:text-sm" />
        </label>
        <label className="flex flex-col gap-2 text-sm font-semibold text-[#1D1D1F]">
          <span>Keywords</span>
          <input value={form.keywords} onChange={set("keywords")} type="text" placeholder="Comma-separated keywords" className="rounded-[12px] border border-[#D2D2D7] bg-white px-4 py-3 text-base text-[#6E5C54] sm:text-sm" />
        </label>
        <label className="flex flex-col gap-2 text-sm font-semibold text-[#1D1D1F]">
          <span>Optional upload</span>
          <input onChange={(e) => setFile(e.target.files?.[0] || null)} type="file" className="rounded-[12px] border border-[#D2D2D7] bg-white px-4 py-1.5 text-base text-[#6E5C54] file:mr-3 file:rounded-md file:border-0 file:bg-[#6E1A2B] file:px-3 file:py-1.5 file:text-white sm:text-sm" />
        </label>
      </div>

      <h4 className="mt-8 font-serif text-lg font-semibold text-[#6E1A2B]">Declarations</h4>
      <div className="mt-4 space-y-3 text-sm text-[#6E5C54]">
        {DECLARATIONS.map((d, i) => (
          <label key={d} className="flex items-start gap-3">
            <input
              type="checkbox"
              className="mt-1"
              checked={declarations[i]}
              onChange={(e) => setDeclarations((p) => p.map((v, idx) => (idx === i ? e.target.checked : v)))}
            /> {d}
          </label>
        ))}
      </div>

      {message && (
        <p className={`mt-6 rounded-xl px-4 py-3 text-sm font-medium ${status === "success" ? "bg-[#EAF6EC] text-[#1f7a3d]" : "bg-[#FBEBEB] text-[#B3261E]"}`}>
          {message}
        </p>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex items-center cursor-pointer rounded-full bg-[#6E1A2B] px-6 py-3 text-sm font-semibold text-[#FBF1DD] transition hover:-translate-y-0.5 hover:bg-[#4A1220] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {status === "submitting" ? "Submitting…" : "Submit Abstract"}
        </button>
        {/* <a href="mailto:abstracts@ltsicon2026.com" className="text-sm font-semibold text-[#6E1A2B] underline-offset-2 hover:underline">Email Abstracts Team</a>
        <span className="text-sm text-[#6E5C54]">abstracts@ltsicon2026.com</span> */}
      </div>
    </form>
  );
}

export default function Abstracts() {
  return (
    <section id="abstracts" className="px-6 py-24 sm:py-28">
      <div className="mx-auto max-w-[1140px]">
        <div className="mx-auto mb-14 max-w-[740px] text-center">
          <span className="mb-4 inline-flex items-center justify-center gap-3 text-[0.76rem] font-semibold uppercase tracking-[0.2em] text-[#8A6A12]">
            <span className="h-px w-8 bg-[#8A6A12]" />
            Call for Abstracts
          </span>
          <h2 className="font-serif text-4xl font-bold text-[#6E1A2B] sm:text-5xl">Abstract Submission</h2>
          <p className="mt-4 text-[#6E5C54]">Submit original research across all transplant disciplines for the chance to present and be considered for awards and travel grants.</p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[22px] border border-white/10 bg-gradient-to-b from-[#26262A] to-[#1B1B1D] p-8 shadow-[0_24px_50px_rgba(0,0,0,0.25)]">
            <h3 className="mb-4 font-serif text-2xl font-semibold text-white">Key Dates</h3>
            <div className="text-sm">
              {[
                ["Submission Opens", "1 August 2026"],
                ["Submission Closes", "30 September 2026"],
                ["Acceptance Notified", "10 October 2026"],
                ["Word Limit", "250 words"],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-4 border-b border-white/10 py-4">
                  <span className="text-white/70">{label}</span>
                  <span className="font-semibold tracking-wide text-[#E7C979]">{value}</span>
                </div>
              ))}
            </div>
            <a href="#submission-form" className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-[#6E1A2B] px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#4A1220]">
              Submit Abstract
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M22 2 11 13" /><path d="M22 2 15 22l-4-9-9-4z" /></svg>
            </a>
          </div>
          <PresentationCategories />
        </div>
 
        <div id="submission-form" className="mt-14" style={{ scrollMarginTop: "126px" }}>
          <h3 className="mb-4 font-serif text-2xl font-semibold text-[#6E1A2B]">Submission Form</h3>
          <SubmissionForm />
        </div>
      </div>
    </section>
  );
}
