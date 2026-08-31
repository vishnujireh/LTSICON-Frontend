import { useEffect } from 'react';
import { openRegister } from './RegisterModal.jsx';

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
      className="relative overflow-hidden text-center text-[#33242A] py-24 2xl:px-32 xl:px-20 lg:px-10 px-5 pt-12"
      id="home"
      style={{
        background:
          'radial-gradient(900px 480px at 50% -8%, rgba(201, 162, 39, .30), rgba(201, 162, 39, 0) 70%), linear-gradient(180deg, var(--cream), var(--sand))',
      }}
    >
      <div className="mx-auto flex max-w-205 flex-col items-center">
         <p className="mb-6 text-lg text-[#4A1220]">
            <span className="font-serif">&#2997;&#2979;&#2965;&#3021;&#2965;&#2990;&#3021;</span> &middot; Vanakkam
          </p>
        <span className="mb-6 inline-flex rounded-full border border-[#C9A227] bg-[#F3E7C6] px-6 py-2.5 text-base font-semibold uppercase tracking-[0.04em] text-[#6E1A2B] sm:px-8 sm:py-3 sm:text-lg lg:text-xl">
          9th Annual Conference of the LTSI
        </span>
        <h1 className="mb-5 font-['Playfair_Display'] text-5xl font-bold leading-tight text-[#6E1A2B] sm:text-6xl lg:text-7xl">
          Pioneering {' '}
          <span className="bg-[linear-gradient(100deg,#C9A227,#B58A1E_48%,#7A1F2E)] bg-clip-text text-transparent">
            Liver Transplantation
          </span>
        </h1>
        <div className="mb-4 flex flex-wrap justify-center gap-4">
          {[
            ['Innovation', <><path d="M9 18h6" /><path d="M10 21h4" /><path d="M12 3a6 6 0 0 0-4 10c.6.6 1 1.6 1 2.5h6c0-.9.4-1.9 1-2.5A6 6 0 0 0 12 3z" /></>],
            ['Research', <><path d="M6 21h11" /><path d="M9 21l-1.2-3h6.4L13 21" /><path d="M8 7.5l3.2-6 2.2 1.2-3.2 6z" /><path d="M11.5 8.2a4.2 4.2 0 0 1 2.8 6.3" /><path d="M7.5 18a5.2 5.2 0 0 1 4.7-9.2" /></>],
            ['Technology', <><rect x="7" y="7" width="10" height="10" rx="1.5" /><path d="M10 3v3M14 3v3M10 18v3M14 18v3M3 10h3M3 14h3M18 10h3M18 14h3" /></>],
          ].map(([item, icon]) => (
            <div key={item} className="flex items-center gap-2 rounded-full border border-[#E7D9BB] bg-white/70 px-5 py-3 text-sm font-semibold uppercase tracking-[0.04em] text-[#6E1A2B]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-[#8A6A12]">{icon}</svg>
              {item}
            </div>
          ))}
        </div>
        {/* <p className="mb-4 text-lg font-semibold text-[#8A6A12]">
          Pioneering Liver Transplantation: Innovation, Research &amp; Technology
        </p> */}
        <p className="mx-auto mb-7 max-w-[600px] text-lg text-[#6E5C54]">
          LTSICON Chennai 2026 unites transplant surgeons, hepatologists, anaesthesiologists, radiologists, pathologists and coordinators in Chennai — India’s liver transplant capital — for four days of science, surgery and collaboration.
        </p>
        <div className="mb-8 flex w-full flex-col items-center gap-3 text-[#6E1A2B] sm:flex-row sm:flex-wrap sm:justify-center sm:gap-6">
          <div className="flex items-start gap-2.5 text-left font-bold text-lg">
            <span className="shrink-0 text-3xl leading-6 text-[#8A6A12]">📅</span>
            <span>10–13 December 2026</span>
          </div>
          <div className="flex items-start gap-2.5 text-left font-bold text-lg">
            <span className="shrink-0 text-3xl leading-6 text-[#8A6A12] ">📍</span>
            <span>Radisson Blu Resort Temple Bay, Mamallapuram</span>
          </div>
        </div>
        <div className="mb-8 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={openRegister} className="inline-flex items-center rounded-full bg-[#6E1A2B] px-7 py-3.5 text-sm font-semibold text-[#FBF1DD] transition hover:-translate-y-0.5 hover:bg-[#4A1220]">
            Register
          </button>
          <a href="#about" className="inline-flex items-center gap-1 text-sm font-semibold text-[#8A6A12] transition hover:text-[#6E1A2B]">
            Learn more <span aria-hidden="true">›</span>
          </a>
        </div>
        
        <div className="mt-10 flex flex-wrap justify-center gap-3" id="countdown" data-deadline="2026-12-10T09:00:00">
          {['days', 'hours', 'mins', 'secs'].map((unit) => (
            <div key={unit} className="min-w-[82px] rounded-[10px] border border-[#E7D9BB] bg-white px-3 py-4 shadow-sm">
              <div className="font-['Playfair_Display'] text-3xl font-bold text-[#6E1A2B]" data-cd={unit}>00</div>
              <div className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[#6E5C54]">
                {unit === 'days' ? 'Days' : unit === 'hours' ? 'Hours' : unit === 'mins' ? 'Minutes' : 'Seconds'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
