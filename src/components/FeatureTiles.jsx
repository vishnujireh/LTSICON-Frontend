
import nautica from '../../public/decplian-fg.png';
import nauticav from '../../public/workshopsk.png';
import internal from '../../public/speakersc.png'
export default function FeatureTiles() {
  return (
    <section className=" py-24 px-5 lg:px-10 xl:px-20 2xl:px-32">
      <div className="mx-auto">
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="flex min-h-[480px] flex-col items-center overflow-hidden rounded-[16px] border border-[#E7D9BB] bg-white px-8 pb-0 pt-12 text-center lg:col-span-2">
            <div className="mb-2 text-[0.82rem] font-bold uppercase tracking-[0.04em] text-[#8A6A12]">Scientific Programme</div>
            <h2 className="font-serif text-3xl font-bold text-[#6E1A2B]">Four days, every discipline.</h2>
            <p className="mx-auto mb-4 max-w-[460px] text-[1.05rem] text-[#6E5C54]">Plenaries, debate symposia, didactic sessions and hands-on workshops across Liver Transplant surgery, hepatology, anaesthesia, radiology and pediatrics.</p>
            <div className="flex flex-wrap justify-center gap-5 text-sm font-semibold text-[#8A6A12]">
              <a href="#program" className="inline-flex items-center gap-1 transition hover:text-[#6E1A2B]">Scientific programme <span aria-hidden="true">›</span></a>
              <a href="#abstracts" className="inline-flex items-center gap-1 transition hover:text-[#6E1A2B]">Submit an abstract <span aria-hidden="true">›</span></a>
            </div>
            <div className="relative mt-auto grid h-[220px] w-full max-w-[520px] place-items-center overflow-hidden rounded-t-[14px] bg-[linear-gradient(135deg,#6E1A2B,#8A2740)] text-sm font-semibold text-white">
              <span>[ PROGRAMME IMAGE1 ]</span>
              <img src={nautica} alt="Conference programme hall" loading="lazy" onError={(e) => { e.currentTarget.style.display = "none"; }} className="absolute inset-0 h-full w-full object-cover" />
            </div>
          </div>

          <div className="flex min-h-[480px] flex-col items-center overflow-hidden rounded-[16px] border border-[#E7D9BB] bg-[#F4ECD9] px-8 pb-0 pt-12 text-center">
            <div className="mb-2 text-[0.82rem] font-bold uppercase tracking-[0.04em] text-[#8A6A12]">Hands-on</div>
            <h3 className="font-serif text-2xl font-semibold text-[#6E1A2B]">Workshops &amp; skills labs.</h3>
            <p className="mx-auto mb-4 max-w-[460px] text-[1.05rem] text-[#6E5C54]">Robotic surgery, Microsurgery, Endo Hepatology, Interventional Radiology, POCUS, Pathology & Hemodynamic Monitoring and more.</p>
            <div className="flex flex-wrap justify-center gap-5 text-sm font-semibold text-[#8A6A12]"><a href="#program" className="inline-flex items-center gap-1 transition hover:text-[#6E1A2B]">Explore workshops <span aria-hidden="true">›</span></a></div>
            <div className="relative mt-auto grid h-[220px] w-full max-w-[520px] place-items-center overflow-hidden rounded-t-[14px] bg-[linear-gradient(135deg,#6E1A2B,#8A2740)] text-sm font-semibold text-white">
              <span>[ WORKSHOP IMAGE ]</span>
              <img src={nauticav} alt="Workshop hall setup" loading="lazy" onError={(e) => { e.currentTarget.style.display = "none"; }} className="absolute inset-0 h-full w-full object-cover" />
            </div>
          </div>

          <div className="flex min-h-[480px] flex-col items-center overflow-hidden rounded-[16px] border border-[#E7D9BB] bg-[#F4ECD9] px-8 pb-0 pt-12 text-center">
            <div className="mb-2 text-[0.82rem] font-bold uppercase tracking-[0.04em] text-[#8A6A12]">Faculty</div>
            <h3 className="font-serif text-2xl font-semibold text-[#6E1A2B]">International &amp; National Leaders.</h3>
            <p className="mx-auto mb-4 max-w-[460px] text-[1.05rem] text-[#6E5C54]">120+ speakers shaping the future of liver transplantation.</p>
            <div className="flex flex-wrap justify-center gap-5 text-sm font-semibold text-[#8A6A12]"><a href="#faculty" className="inline-flex items-center gap-1 transition hover:text-[#6E1A2B]">View faculty <span aria-hidden="true">›</span></a></div>
            <div className="relative mt-auto grid h-[220px] w-full max-w-[520px] place-items-center overflow-hidden rounded-t-[14px] bg-[linear-gradient(135deg,#6E1A2B,#8A2740)] text-sm font-semibold text-white">
              <span>[ FACULTY IMAGE ]</span>
              {/* Drop your photo at public/faculty-audience-liver.jpg — an audience
                  watching a liver scan on the auditorium screen. */}
              <img src={internal} alt="Audience watching a liver scan on the auditorium screen" loading="lazy" onError={(e) => { e.currentTarget.style.display = "none"; }} className="absolute inset-0 h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
