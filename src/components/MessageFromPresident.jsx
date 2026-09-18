import president from "../../public/dr-president-abhi.png";

const NAME = "Dr. Abhideep Chaudhary";
const TITLE = "President Liver Transplantation Society of India (LTSI)";

const PARAGRAPHS = [
 "It gives me great pleasure to welcome you to the 9th Annual Conference of the Liver Transplantation Society of India (LTSICON 2026), themed “Pioneering Liver Transplantation: Innovation, Research and Technology”, which will be held from 10th–13th December 2026 at Hotel Radisson, Mamallapuram, Chennai.",
 "LTSICON 2026 will bring together liver transplant surgeons, hepatologists, anesthesiologists, pediatric hepatologists, interventional radiologists, transplant pathologists, and allied healthcare professionals from across India and around the world. The conference provides an excellent platform to share knowledge, discuss new developments, and explore solutions to the challenges facing liver transplantation today.",
 "The scientific program has been designed to encourage learning, collaboration, and exchange of ideas through expert lectures, panel discussions, debates, and interactive sessions. Attendees will also benefit from multiple hands-on workshops and clinical case discussions, providing valuable opportunities for practical learning and skill development.",
 "Mamallapuram, with its rich heritage, beautiful coastline, and vibrant culture, offers the perfect setting for both academic discussions and networking. We hope the conference will not only enhance knowledge but also help strengthen professional relationships and foster new collaborations.",
 "On behalf of the Organizing Committee and the Liver Transplantation Society of India, I warmly invite you to join us at LTSICON 2026 and contribute to making this meeting a memorable academic and professional success.",
 "We look forward to welcoming you to Mamallapuram in December 2026.",
 "Welcome to LTSICON 2026!"
];

const QUOTE =
  "Warm regards,";

export default function MessageFromPresident() {
  return (
    <section
      id="president-message"
      className="px-5 py-24 sm:py-28 lg:px-10 xl:px-20 2xl:px-32 bg-white"
    >
      <div className="mx-auto grid max-w-[1160px] items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        {/* ---------- Portrait ---------- */}
        <div className="relative mx-auto mb-14 w-full max-w-[420px] lg:mb-0">
          {/* decorative backdrop shapes */}
          <div className="absolute -right-5 -top-5 -z-10 hidden h-44 w-44 rounded-[36px] bg-[#EFE0CF]/70 sm:block" />
          <div className="absolute -bottom-8 -left-6 -z-10 hidden h-48 w-28 rounded-[36px] bg-[#F3E7C6]/60 sm:block" />

          {/* framed photo — drop the file at public/president.jpg */}
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[30px] border-[6px] border-white bg-[linear-gradient(135deg,#4A1220,#8A2740)] shadow-[0_36px_70px_-34px_rgba(74,18,32,0.55)]">
            <span className="absolute inset-0 grid place-items-center px-6 text-center text-sm font-semibold text-[#E3C36A]/70">
              {NAME}
            </span>
            <img
              src={president}
              alt={`${NAME} — ${TITLE}`}
              loading="lazy"
              onError={(e) => { e.currentTarget.style.display = "none"; }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>

          {/* overlapping info card */}
          <div className="absolute -bottom-6 left-2 flex items-center gap-3 rounded-2xl border border-[#E7D9BB] bg-white/95 px-4 py-3 shadow-[0_20px_45px_-20px_rgba(74,18,32,0.45)] backdrop-blur sm:-left-6">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-[#6E1A2B] text-[#6E1A2B]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
            </span>
            <div className="pr-1">
              <div className="text-sm font-bold text-[#6E1A2B]">{NAME}</div>
              <div className="text-xs leading-snug text-[#6E5C54]">{TITLE}</div>
            </div>
          </div>
        </div>

        {/* ---------- Message ---------- */}
        <div>
          <span className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[#8A6A12]">
            Message from the President
          </span>
         

          <p className="mt-6 font-serif text-lg font-semibold text-[#6E1A2B]">Dear Colleagues, Friends, and Distinguished Guests,</p>
          <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-[#6E5C54]">
            {PARAGRAPHS.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {/* highlighted quote callout */}
          <div className="mt-6 rounded-2xl border border-[#E7D9BB] bg-white/60 px-6 py-5">
            <p className="font-serif text-lg italic leading-relaxed text-[#6E1A2B]">"{QUOTE}"</p>
             <h2 className="mt-2 font-serif text-4xl font-bold text-[#6E1A2B] sm:text-5xl">{NAME}</h2>
          <p className="mt-2 text-sm font-bold text-[#6E1A2B] sm:text-base">{TITLE}</p>
          </div>

         
        </div>
      </div>
    </section>
  );
}
