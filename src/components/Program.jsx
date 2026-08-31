const schedule = [
  ["Day 0 — 10 Dec", "Consensus Meeting — working groups", "Consensus Meeting — plenary & recommendations", "Pre-conference workshops"],
  ["Day 1 — 11 Dec", "Inauguration & plenary lectures", "Innovation: Thoughts to Market; surgery & hepatology symposia", "Welcome reception"],
  ["Day 2 — 12 Dec", "Live / recorded surgery; transplant oncology", "Transplant Coordinators symposium; parallel tracks", "Conference banquet"],
  ["Day 3 — 13 Dec", "Translational research & technology", "Liver ICU Nurses symposium; free papers", "Valedictory & awards"],
];

const tracks = [
  ["Transplant & HPB Surgery", "Living/deceased-donor technique, robotic and ABO-incompatible transplantation, complex HPB."],
  ["Surgical Video Session", "Edited operative videos with expert commentary."],
  ["Adult Hepatology", "ACLF, recipient selection, MASLD, portal hypertension, post-transplant medical care."],
  ["Paediatric Hepatology", "Metabolic liver disease, biliary atresia, small-for-size grafts, long-term outcomes."],
  ["Transplant Anaesthesia", "Intra-operative management, coagulation and haemodynamics."],
  ["Intensivists & Critical Care", "ICU care, complication recognition, sepsis and graft dysfunction."],
  ["Transplant Pathology", "Rejection grading, recurrent disease, biomarkers."],
  ["Interventional Radiology", "Vascular/biliary interventions and graft Doppler."],
  ["Transplant ID Physicians", "Prophylaxis, opportunistic/MDR infections, antimicrobial stewardship."],
  ["Laboratory Medicine", "Immunology/HLA, virology, therapeutic drug monitoring."],
  ["Innovators", "The Thoughts-to-Market track for clinician-innovators, engineers, start-ups and industry."],
  ["Liver ICU Nurses & Coordinators", "Dedicated symposia — detailed below."],
];

const bullet =
  "relative pl-6 leading-relaxed text-[#6E5C54] before:absolute before:left-3 before:top-2 before:font-bold before:text-[#C9A227] before:content-['›']";

export default function Program() {
  return (
    <section id="program" className="bg-[#F4ECD9] py-24 px-5 lg:px-10 xl:px-20 2xl:px-32">
      <div className="mx-auto">
        <div className="mx-auto mb-14 max-w-[760px] text-center">
          <span className="mb-4 inline-flex items-center justify-center gap-3 text-[0.76rem] font-semibold uppercase tracking-[0.2em] text-[#8A6A12]">
            <span className="h-px w-8 bg-[#8A6A12]" />
            Scientific Program
          </span>
          <h2 className="font-serif text-4xl font-bold text-[#6E1A2B] sm:text-5xl">The Full Scientific Program</h2>
          <p className="mt-4 text-[#6E5C54]">Themed &ldquo;Pioneering Liver Transplantation: Innovation, Research and Technology,&rdquo; the programme opens with a full-day Consensus Meeting on 10 December, followed by three days of plenaries, symposia, live surgery, hands-on workshops and dedicated tracks.</p>
        </div>

        <div className="mt-14">
          <h3 className="mb-5 font-serif text-2xl font-semibold text-[#6E1A2B]">Program at a Glance</h3>
          <div className="overflow-x-auto rounded-2xl border border-[#E7D9BB] bg-white shadow-[0_14px_40px_-24px_rgba(110,26,43,0.35)]">
            <table className="w-full min-w-[720px] border-collapse bg-white">
              <thead>
                <tr>
                  {["Day", "Morning", "Afternoon", "Evening"].map((h) => (
                    <th key={h} className="whitespace-nowrap border-b border-[#EDEDF0] bg-[#F5F5F7] px-6 py-4 text-left text-sm font-semibold text-[#1D1D1F]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {schedule.map((row, i) => (
                  <tr key={i} className="last:[&>td]:border-b-0">
                    {row.map((cell, j) => (
                      <td key={j} className="border-b border-[#EDEDF0] px-6 py-4 align-top text-sm text-[#6E5C54]">
                        {j === 0 ? <b className="font-semibold text-[#1D1D1F]">{cell}</b> : cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm italic text-[#6E5C54]">To be replaced with the finalised schedule.</p>
        </div>

        <div className="mt-14">
          <h3 className="mb-4 font-serif text-2xl font-semibold text-[#6E1A2B]">Dedicated Specialty Sessions</h3>
          <p className="mb-5 text-[#6E5C54]">Parallel tracks tailored to every member of the transplant team:</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {tracks.map(([title, desc]) => (
              <div key={title} className="rounded-2xl border border-[#E7D9BB] bg-white px-5 py-5">
                <b className="mb-1.5 block text-[#6E1A2B]">{title}</b>
                <span className="text-sm leading-relaxed text-[#6E5C54]">{desc}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm italic text-[#6E5C54]">Specialty session details and chairs to be confirmed.</p>
        </div>

        <div className="mt-14">
          <h3 className="mb-4 font-serif text-2xl font-semibold text-[#6E1A2B]">Consensus Meeting (10 December)</h3>
          <p className="text-[#6E5C54]">LTSICON 2026 opens a day early with a dedicated Consensus Meeting. Expert working groups deliberate on contemporary controversies in liver transplantation and agree practical, evidence-based recommendations for Indian practice, with a published consensus statement.</p>
          <p className="mt-3 text-sm italic text-[#6E5C54]">Consensus topics, working-group chairs and format to be confirmed.</p>
        </div>

        <div className="mt-14">
          <h3 className="mb-4 font-serif text-2xl font-semibold text-[#6E1A2B]">Innovation: Thoughts to Market</h3>
          <p className="text-[#6E5C54]">Central to the theme, this track follows an idea from bedside to product &mdash; covering unmet clinical needs, research, devices, digital health and AI, prototyping, regulatory pathways and IP, funding and commercialisation, and an innovation showcase / pitch session for products and start-ups.</p>
          <p className="mt-3 text-sm italic text-[#6E5C54]">Innovation sessions, pitch format and partners to be confirmed.</p>
        </div>

        <div className="mt-14 grid items-stretch gap-6 lg:grid-cols-2">
          <div className="flex h-full flex-col rounded-2xl border border-[#E7D9BB] bg-white p-7 shadow-[0_14px_40px_-28px_rgba(110,26,43,0.4)]">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-[13px] bg-[#F3E7C6] text-[#6E1A2B]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M6 3v5a4 4 0 0 0 8 0V3" /><path d="M6 3H4.5M14 3h1.5" /><path d="M10 16v1a4 4 0 0 0 8 0v-1" /><circle cx="18" cy="14" r="2" /></svg>
              </span>
              <h3 className="font-serif text-2xl font-semibold text-[#6E1A2B]">Nurses &amp; Coordinators</h3>
            </div>
            <div className="flex flex-1 flex-col gap-4">
              <div className="flex flex-1 flex-col rounded-xl border border-[#EFE3C4] bg-[#FBF5E9] p-4">
                <b className="text-[#6E1A2B]">Liver ICU Nurses Symposium</b>
                <p className="mt-1.5 text-sm leading-relaxed text-[#6E5C54]">Post-operative and critical-care nursing, haemodynamics, early complication recognition, infection control and graft monitoring.</p>
              </div>
              <div className="flex flex-1 flex-col rounded-xl border border-[#EFE3C4] bg-[#FBF5E9] p-4">
                <b className="text-[#6E1A2B]">Transplant Coordinators Symposium</b>
                <p className="mt-1.5 text-sm leading-relaxed text-[#6E5C54]">Donor coordination, recipient work-up, allocation logistics, family counselling and documentation.</p>
              </div>
            </div>
            <p className="mt-4 text-sm italic text-[#6E5C54]">Dedicated tracks for allied transplant teams; agenda and faculty to be confirmed.</p>
          </div>
          <div className="flex h-full flex-col rounded-2xl border border-[#E7D9BB] bg-white p-7 shadow-[0_14px_40px_-28px_rgba(110,26,43,0.4)]">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-[13px] bg-[#F3E7C6] text-[#6E1A2B]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2-2 2.5-2.5z" /></svg>
              </span>
              <h3 className="font-serif text-2xl font-semibold text-[#6E1A2B]">Pre-Conference Workshops</h3>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {["Robotic Surgery Workshop", "Advanced Liver Surgery (resection, vascular & biliary anastomosis)", "Hands-on Microsurgery", "Intra-operative Hemodynamic Monitoring", "POCUS & Transplant Doppler", "AI Essentials for Clinicians"].map((w) => (
                <li key={w} className={`${bullet} rounded-lg bg-[#FBF5E9] px-3 py-2.5 text-sm`}>{w}</li>
              ))}
            </ul>
           </div>
        </div>

        <div className="mt-14 text-center">
          <h3 className="mb-4 font-serif text-2xl font-semibold text-[#6E1A2B]">Abstracts &amp; Presentations</h3>
          <p className="mx-auto max-w-[760px] text-[#6E5C54]">LTSICON 2026 invites original abstracts for oral, mini-oral, e-poster and surgical-video presentation across all transplant disciplines. Selected abstracts are considered for awards and travel grants.</p>
          <div className="mt-6">
            <a href="#abstracts" className="inline-flex items-center rounded-full bg-[#1D1D1F] px-7 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-black">Submit an Abstract</a>
          </div>
        </div>
      </div>
    </section>
  );
}
