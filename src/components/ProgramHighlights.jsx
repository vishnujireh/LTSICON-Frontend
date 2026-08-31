const cards = [
  {
    no: "01", title: "Robotic Liver Transplantation", tag: "Surgery",
    desc: "The future of minimally invasive donor and recipient surgery.",
    icon: <><path d="m18 2 4 4" /><path d="m17 7 3-3" /><path d="M19 9 8.7 19.3a2.4 2.4 0 0 1-1.7.7H4v-3a2.4 2.4 0 0 1 .7-1.7L15 5z" /><path d="m9 11 4 4" /><path d="M5 19l-3 3" /></>,
  },
  {
    no: "02", title: "ABO-Incompatible Transplant", tag: "Immunology",
    desc: "Desensitisation protocols, immunosuppression and long-term outcomes.",
    icon: <><path d="M9 3h6" /><path d="M10 3v6.5L5.2 18a2 2 0 0 0 1.8 3h10a2 2 0 0 0 1.8-3L14 9.5V3" /><path d="M7.5 15h9" /></>,
  },
  {
    no: "03", title: "Transplant Oncology & Immunotherapy", tag: "Oncology",
    desc: "Expanding criteria, downstaging strategies and renewed survival.",
    icon: <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" /></>,
  },
  {
    no: "04", title: "Translational Research", tag: "Research",
    desc: "Bridging laboratory discovery and clinical practice.",
    icon: <><path d="M6 18h12" /><path d="M9.5 21h8" /><path d="M9 8.5 12.5 5l2.4 2.4-3.5 3.5z" /><path d="M11.2 10.6 8 13.8a3.6 3.6 0 0 0 5.2 4.6" /></>,
  },
  {
    no: "05", title: "Pediatric Liver Transplant", tag: "Paediatrics",
    desc: "Large-for-size grafts, metabolic liver disease and long-term outcomes.",
    icon: <path d="M12 20s-7-4.5-9.2-9C1.3 8 2.6 4.8 5.8 4.5 8 4.3 9.5 5.7 12 8c2.5-2.3 4-3.7 6.2-3.5 3.2.3 4.5 3.5 3 6.5C19 15.5 12 20 12 20z" />,
  },
  {
    no: "06", title: "Perioperative & ICU Care", tag: "Critical Care",
    desc: "Haemodynamic monitoring, coagulation testing and the intensivist & anaesthesiologist’s role.",
    icon: <path d="M3 12h3l2.4 6L12 5l2 8h5" />,
  },
  {
    no: "07", title: "Innovation: Thoughts to Market", tag: "Innovation",
    desc: "From clinical need to validated product: devices, digital health, AI, regulatory pathways, funding and an innovation showcase.",
    icon: <><path d="M9 18h6" /><path d="M10 21h4" /><path d="M12 3a6 6 0 0 0-4 10c.6.6 1 1.6 1 2.5h6c0-.9.4-1.9 1-2.5A6 6 0 0 0 12 3z" /></>,
  },
  {
    no: "08", title: "Consensus Meeting", tag: "10 December",
    desc: "Expert working groups agreeing practical, evidence-based recommendations in ABOi liver transplantation.",
    icon: <><circle cx="9" cy="8" r="3" /><path d="M2.5 20c.8-3 3.4-4.6 6.5-4.6s5.7 1.6 6.5 4.6" /><circle cx="17.6" cy="8.6" r="2.2" /><path d="M17.6 13.2c2.3 0 4.2 1.2 4.9 3.3" /></>,
  },
  {
    no: "09", title: "Nurses & Coordinators", tag: "Allied Teams",
    desc: "Dedicated symposia for the teams at the heart of every successful transplant programs.",
    icon: <><path d="M6 3v5a4 4 0 0 0 8 0V3" /><path d="M6 3H4.5M14 3h1.5" /><path d="M10 16v1a4 4 0 0 0 8 0v-1" /><circle cx="18" cy="14" r="2" /></>,
  },
];

export default function ProgramHighlights() {
  return (
    <section className="py-24 px-5 lg:px-10 xl:px-20 2xl:px-32">
      <div className="mx-auto max-w-[1240px]">
        <div className="mx-auto mb-14 max-w-[740px] text-center">
          <span className="mb-4 inline-flex items-center justify-center gap-3 text-[0.76rem] font-semibold uppercase tracking-[0.2em] text-[#8A6A12]">
            <span className="h-px w-8 bg-[#8A6A12]" />
            Scientific Program
          </span>
          <h2 className="font-serif text-4xl font-bold text-[#6E1A2B] sm:text-5xl">Program Highlights</h2>
          <p className="mt-4 text-[#6E5C54]">Exploring the latest advancements, challenges and innovations in liver transplantation and hepatic care.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => (
            <article
              key={c.no}
              className="group relative flex h-full flex-col overflow-hidden rounded-[20px] border border-[#E7D9BB] bg-white p-6 shadow-[0_10px_28px_-16px_rgba(110,26,43,0.28)] transition duration-300 hover:-translate-y-1.5 hover:border-[#C9A227] hover:shadow-[0_24px_48px_-20px_rgba(110,26,43,0.35)]"
            >
              <span className="pointer-events-none absolute -right-3 -top-4 font-serif text-[6rem] font-bold leading-none text-[#F3E7C6] transition-colors duration-300 group-hover:text-[#EEDFAF]">
                {c.no}
              </span>
              <div className="relative z-10 mb-5 flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-gradient-to-br from-[#F3E7C6] to-[#E7C979] text-[#6E1A2B] shadow-inner">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{c.icon}</svg>
                </span>
                <span className="rounded-full bg-[#F4ECD9] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-[#8A6A12]">
                  {c.tag}
                </span>
              </div>
              <h3 className="relative z-10 font-serif text-xl font-semibold leading-snug text-[#6E1A2B]">{c.title}</h3>
              <p className="relative z-10 mt-2.5 text-sm leading-relaxed text-[#6E5C54]">{c.desc}</p>
              <span className="relative z-10 mt-auto pt-5">
                <span className="inline-block h-1 w-10 rounded-full bg-gradient-to-r from-[#C9A227] to-[#7A1F2E] transition-all duration-300 group-hover:w-16" />
              </span>
            </article>
          ))}
        </div>
 
      </div>
    </section>
  );
}
