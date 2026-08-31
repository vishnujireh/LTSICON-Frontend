import { openRegister } from './RegisterModal.jsx';
import bluresort from '../../public/fre-deciplain.png';

export default function CtaTile() {
  return (
    <section className=" py-24 px-5 lg:px-10 xl:px-20 2xl:px-32">
      <div className="mx-auto">
        <div className="relative overflow-hidden rounded-[18px] bg-[#4A1220] px-8 py-12 pb-0 text-center text-[#F6E7C4] shadow-sm lg:px-12">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(650px_320px_at_12%_-10%,rgba(201,162,39,0.38),rgba(201,162,39,0)_60%)]" />
          <div className="relative">
          <div className="text-[0.82rem] font-bold uppercase tracking-[0.04em] text-[#C9A227]">10–13 December 2026 · Mamallapuram</div>
          <h2 className="mt-3 font-serif text-3xl font-bold text-white sm:text-4xl">Be part of LTSICON Chennai 2026.</h2>
          <p className="mx-auto mt-3 max-w-[560px] text-[1.05rem] text-[#F6E7C4]">Four days of learning, collaboration and innovation in liver transplantation.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm font-semibold text-[#C9A227]">
            <button type="button" onClick={openRegister} className="inline-flex items-center gap-1 transition hover:text-white">Register <span aria-hidden="true">›</span></button>
            <a href="#venue" className="inline-flex items-center gap-1 transition hover:text-white">Venue &amp; travel <span aria-hidden="true">›</span></a>
          </div>
          <div className="relative mt-10 grid h-[250px] max-w-2xl mx-auto place-items-center overflow-hidden rounded-t-[14px] border border-white/10 bg-white/[0.04] text-sm font-semibold text-white/90">
            <span>[ MAMALLAPURAM / RESORT IMAGE ]</span>
            <img
              src={bluresort}
              alt="Radisson Blu Resort Temple Bay beachfront"
              loading="lazy"
              onError={(e) => { e.currentTarget.style.display = "none"; }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}
