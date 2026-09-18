import { useEffect } from 'react';
import { openRegister } from './RegisterModal.jsx';
// Premium hero backdrop — Radisson Blu Resort Temple Bay, Mamallapuram (the venue).
// Swap to '../../public/shore-temple.jpg' or '../../public/mahabalipuram.jpg' if preferred.
import heroBg from '../../public/shore-temple.jpg';

export default function Hero() {
  useEffect(() => {
    const el = document.getElementById('countdown');
    if (!el) return;
    const deadline = new Date(el.getAttribute('data-deadline')).getTime();
    const set = (k, v) => {
      const n = el.querySelector('[data-cd="' + k + '"]');
      if (n) n.textContent = String(v).padStart(2, '0');
    };
    const tick = () => {
      let diff = Math.max(0, deadline - Date.now());
      const days = Math.floor(diff / 86400000);
      diff -= days * 86400000;
      const hours = Math.floor(diff / 3600000);
      diff -= hours * 3600000;
      const mins = Math.floor(diff / 60000);
      diff -= mins * 60000;
      const secs = Math.floor(diff / 1000);
      set('days', days);
      set('hours', hours);
      set('mins', mins);
      set('secs', secs);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      className="relative isolate overflow-hidden text-center py-16 2xl:px-32 xl:px-20 lg:px-10 px-5 pt-10"
      id="home"
    >
      {/* premium hero image — Temple Bay, Mamallapuram */}
      <img
        src={heroBg}
        alt="Radisson Blu Resort Temple Bay, Mamallapuram — venue of LTSICON Chennai 2026"
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />
      {/* maroon overlay for readable text over the photo */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(58,14,24,0.68),rgba(58,14,24,0.90))]" />
      {/* subtle gold glow at top */}
     
      <div className="mx-auto flex max-w-205 flex-col items-center">
        <p className="mb-6 text-lg text-[#F6E7C4]">
          <span className="font-serif">&#2997;&#2979;&#2965;&#3021;&#2965;&#2990;&#3021;</span> &middot; Vanakkam
        </p>
        <span className="mb-6 inline-flex rounded-full border border-[#C9A227]/70 bg-white/10 px-6 py-2.5 text-base font-semibold uppercase tracking-[0.04em] text-[#E7C979] backdrop-blur sm:px-8 sm:py-3 sm:text-lg lg:text-xl">
          9th Annual Conference of the LTSI
        </span>
        <h1 className="mb-5 font-['Playfair_Display'] text-5xl font-bold leading-tight text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.35)] sm:text-6xl lg:text-7xl">
          Pioneering {' '}
          <span className="bg-[linear-gradient(100deg,#F0D585,#E7C979_48%,#C9A227)] bg-clip-text text-transparent">
            Liver Transplantation
          </span>
        </h1>
        <div className="mb-4 flex flex-wrap justify-center gap-4">
          {[
            ['Innovation', <><path d="M9 18h6" /><path d="M10 21h4" /><path d="M12 3a6 6 0 0 0-4 10c.6.6 1 1.6 1 2.5h6c0-.9.4-1.9 1-2.5A6 6 0 0 0 12 3z" /></>],
            ['Research', <><path d="M6 21h11" /><path d="M9 21l-1.2-3h6.4L13 21" /><path d="M8 7.5l3.2-6 2.2 1.2-3.2 6z" /><path d="M11.5 8.2a4.2 4.2 0 0 1 2.8 6.3" /><path d="M7.5 18a5.2 5.2 0 0 1 4.7-9.2" /></>],
            ['Technology', <><rect x="7" y="7" width="10" height="10" rx="1.5" /><path d="M10 3v3M14 3v3M10 18v3M14 18v3M3 10h3M3 14h3M18 10h3M18 14h3" /></>],
          ].map(([item, icon]) => (
            <div key={item} className="flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold uppercase tracking-[0.04em] text-white backdrop-blur">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-[#E7C979]">{icon}</svg>
              {item}
            </div>
          ))}
        </div>
        <p className="mx-auto mb-7 max-w-[600px] text-lg text-[#F6E7C4]/90">
          LTSICON Chennai 2026 unites transplant surgeons, hepatologists, anaesthesiologists, radiologists, pathologists and coordinators in One of India’s foremost centres of liver transplantation — for four days of science, surgery and collaboration.
        </p>
        <div className="mb-8 flex w-full flex-col items-center gap-3 text-[#FBF1DD] sm:flex-row sm:flex-wrap sm:justify-center sm:gap-6">
          <div className="flex items-start gap-2.5 text-left font-bold text-lg">
            <span className="shrink-0 text-3xl leading-6 text-[#E7C979]">📅</span>
            <span>10 December - Consensus Meeting & Pre-conference Workshops</span>
          </div>
          <div className="flex items-start gap-2.5 text-left font-bold text-lg">
            <span className="shrink-0 text-3xl leading-6 text-[#E7C979]">📅</span>
            <span>11–13 December - LTSICON 2026 Main Congress</span>
          </div>
          <div className="flex items-start gap-2.5 text-left font-bold text-lg">
            <span className="shrink-0 text-3xl leading-6 text-[#E7C979] ">📍</span>
            <span>Radisson Blu Resort Temple Bay, Mamallapuram</span>
          </div>
        </div>
        <div className="mb-8 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={openRegister} className="inline-flex items-center rounded-full bg-[#C9A227] px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-[#3A0E18] transition hover:-translate-y-0.5 hover:bg-[#E7C979]">
            Register
          </button>
          <a href="#about" className="inline-flex items-center gap-1 rounded-full border border-white/40 px-7 py-3.5 text-sm font-semibold text-[#FBF1DD] transition hover:bg-white/10">
            Learn more <span aria-hidden="true">›</span>
          </a>
        </div>

        <div className="mt-7 flex flex-wrap justify-center gap-3" id="countdown" data-deadline="2026-12-10T09:00:00">
          {['days', 'hours', 'mins', 'secs'].map((unit) => (
            <div key={unit} className="min-w-[82px] rounded-[10px] border border-white/20 bg-white/10 px-3 py-4 shadow-sm backdrop-blur">
              <div className="font-['Playfair_Display'] text-3xl font-bold text-white" data-cd={unit}>00</div>
              <div className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[#F6E7C4]/80">
                {unit === 'days' ? 'Days' : unit === 'hours' ? 'Hours' : unit === 'mins' ? 'Minutes' : 'Seconds'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
