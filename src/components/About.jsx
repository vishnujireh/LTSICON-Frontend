export default function About() {
  return (
    <section id="about" className="px-6 py-24 sm:py-28">
      <div className="mx-auto max-w-[1140px]">
        <div className="mx-auto mb-14 max-w-[740px] text-center">
          <span className="mb-4 inline-flex items-center justify-center gap-2.5 text-[0.76rem] font-semibold uppercase tracking-[0.2em] text-[#8A6A12]">About the Conference</span>
          <h2 className="font-serif text-3xl font-bold text-[#6E1A2B] sm:text-4xl">The 9th Annual Conference of the LTSI</h2>
          <p className="mt-3 text-[#6E5C54]">LTSICON 2026 is the flagship annual congress of the Liver Transplantation Society of India, returning for its ninth edition in Chennai — widely regarded as the liver transplant capital of India. Across four days — a pre-conference Consensus Meeting on 10 December and the main conference from 11 to 13 December — it brings together the full multidisciplinary team behind every successful transplant: surgeons, hepatologists, anaesthesiologists, intensivists, interventional radiologists, pathologists, infectious-disease specialists, nurses and transplant coordinators.</p>
        </div>
        <p className="mx-auto mb-8 max-w-[820px] text-center text-[#6E5C54]">Theme: <b className="text-[#1D1D1F]">Pioneering Liver Transplantation: Innovation, Research and Technology.</b> The theme celebrates the convergence of surgical innovation, translational research and emerging technology — from new devices and digital tools to data, AI and the journey of taking ideas from concept to clinical practice and market. The programme spans the entire transplant pathway, from diagnosis and donor evaluation through surgery, perioperative care and long-term follow-up.</p>

        <div className="mt-14">
          <h3 className="mb-4 font-serif text-2xl font-semibold text-[#6E1A2B]">About the Liver Transplantation Society of India (LTSI)</h3>
          <p className="text-[#6E5C54]">The Liver Transplantation Society of India is the national professional body dedicated to advancing the science, practice and outcomes of liver transplantation in India. Through its annual conference, consensus initiatives, workshops and educational programmes, the Society fosters research, sets standards of care and nurtures the next generation of transplant professionals.</p>
          {/* <p className="mt-2 text-sm italic text-[#6E5C54]">To be confirmed with the official LTSI description.</p> */}
        </div>

        <div className="mt-14">
          <h3 className="mb-4 font-serif text-2xl font-semibold text-[#6E1A2B]">Why Chennai</h3>
          <p className="text-[#6E5C54]">Chennai pioneered deceased-donor and living-donor liver transplantation in India and remains home to some of the country’s highest-volume transplant programmes. Hosting LTSICON 2026 here places the conference at the geographic and clinical heart of Indian transplant medicine, while offering delegates a coastline rich in culture, cuisine and history.</p>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-2">
          <div>
            <h3 className="mb-4 font-serif text-2xl font-semibold text-[#6E1A2B]">Who Should Attend</h3>
            <ul className="space-y-3 text-[#6E5C54]">
              <li className="relative pl-6 before:absolute before:left-0 before:top-0 before:text-[#B58A1E] before:content-['›']">Liver transplant and hepatobiliary surgeons</li>
              <li className="relative pl-6 before:absolute before:left-0 before:top-0 before:text-[#B58A1E] before:content-['›']">Transplant hepatologists and gastroenterologists</li>
              <li className="relative pl-6 before:absolute before:left-0 before:top-0 before:text-[#B58A1E] before:content-['›']">Transplant anaesthesiologists and intensivists</li>
              <li className="relative pl-6 before:absolute before:left-0 before:top-0 before:text-[#B58A1E] before:content-['›']">Interventional and diagnostic radiologists</li>
              <li className="relative pl-6 before:absolute before:left-0 before:top-0 before:text-[#B58A1E] before:content-['›']">Transplant pathologists and infectious-disease specialists</li>
              <li className="relative pl-6 before:absolute before:left-0 before:top-0 before:text-[#B58A1E] before:content-['›']">Pediatric hepatologists and surgeons</li>
              <li className="relative pl-6 before:absolute before:left-0 before:top-0 before:text-[#B58A1E] before:content-['›']">Transplant coordinators, nurses and allied health professionals</li>
              <li className="relative pl-6 before:absolute before:left-0 before:top-0 before:text-[#B58A1E] before:content-['›']">Fellows, residents and postgraduate students in the field</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-serif text-2xl font-semibold text-[#6E1A2B]">What to Expect</h3>
            <p className="text-[#6E5C54]">Plenary lectures from international and national leaders, debate-style symposia, live and recorded surgical sessions, hands-on workshops and skills labs, dedicated tracks for fellows, nurses and coordinators, free-paper and poster presentations, and a consensus programme on ABOi liver transplantation - alongside a social and cultural programme showcasing the coast around Mamallapuram.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
