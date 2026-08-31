import scrbv from '../../public/speakersc-dc.png'
export default function Heritage() {
  return (
    <section className="relative overflow-hidden bg-[#6E1A2B] py-24 px-5 lg:px-10 xl:px-20 2xl:px-32">
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full text-[#C9A227]/25"
        viewBox="0 0 1200 400"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <g fill="none" stroke="currentColor" strokeWidth="1.4">
          <path d="M0 80 H220 V160 H420" /><path d="M1200 120 H980 V220 H760" />
          <path d="M120 400 V300 H300 V220" /><path d="M1080 400 V320 H900 V240" />
          <path d="M420 160 H520 V60 H700" />
        </g>
        <g fill="currentColor">
          <circle cx="220" cy="80" r="4" /><circle cx="420" cy="160" r="4" /><circle cx="980" cy="120" r="4" />
          <circle cx="760" cy="220" r="4" /><circle cx="300" cy="300" r="4" /><circle cx="520" cy="60" r="4" /><circle cx="900" cy="240" r="4" />
        </g>
      </svg>

      <div className="relative mx-auto grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <span className="flex items-center gap-3 text-[0.76rem] font-semibold uppercase tracking-[0.2em] text-[#E3C36A]">
            <span className="h-px w-8 bg-[#E3C36A]" />
            Heritage meets Technology
          </span>

          <p className="mt-6 text-lg text-white">
            <span className="font-serif text-[#E3C36A]">&#2997;&#2979;&#2965;&#3021;&#2965;&#2990;&#3021;</span>{" "}
            &middot; <span className="font-serif">Vanakkam, welcome to Tamil Nadu</span>
          </p>

          <h2 className="mt-4 font-serif text-4xl font-bold leading-[1.1] text-white sm:text-5xl lg:text-6xl">
            Ancient shores. Modern science.
          </h2>

          <p className="mt-5 max-w-xl text-[#F6E7C4]/80 leading-relaxed">
            From the rock-cut temples of Mamallapuram to cutting-edge transplant technology, LTSICON Chennai 2026 brings together the timeless heritage of the Coromandel coast and the future of liver care &mdash; pioneering innovation, research and technology by the Bay of Bengal.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-[#C9A227]/40 px-5 py-3 text-sm font-bold uppercase tracking-wide text-white">
              <svg className="h-5 w-5 text-[#E3C36A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6" /><path d="M10 21h4" /><path d="M12 3a6 6 0 0 0-4 10c.6.6 1 1.6 1 2.5h6c0-.9.4-1.9 1-2.5A6 6 0 0 0 12 3z" /></svg>
              Innovation
            </span>
            <span className="inline-flex items-center gap-2.5 rounded-full border border-[#C9A227]/40 px-5 py-3 text-sm font-bold uppercase tracking-wide text-white">
              <svg className="h-5 w-5 text-[#E3C36A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 21h11" /><path d="M9 21l-1.2-3h6.4L13 21" /><path d="M8 7.5l3.2-6 2.2 1.2-3.2 6z" /><path d="M11.5 8.2a4.2 4.2 0 0 1 2.8 6.3" /><path d="M7.5 18a5.2 5.2 0 0 1 4.7-9.2" /></svg>
              Research
            </span>
            <span className="inline-flex items-center gap-2.5 rounded-full border border-[#C9A227]/40 px-5 py-3 text-sm font-bold uppercase tracking-wide text-white">
              <svg className="h-5 w-5 text-[#E3C36A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="7" y="7" width="10" height="10" rx="1.5" /><path d="M10 3v3M14 3v3M10 18v3M14 18v3M3 10h3M3 14h3M18 10h3M18 14h3" /></svg>
              Technology
            </span>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          {/* Drop your photo at public/heritage-dancer-surgeon.jpg — a Bharatanatyam
              dancer and a surgeon together. Until it exists, the branded frame below shows. */}
          <div className="relative aspect-[4/3] w-full max-w-[460px] overflow-hidden rounded-2xl border border-[#C9A227]/40 bg-[linear-gradient(135deg,#4A1220,#8A2740)] shadow-[0_24px_50px_rgba(0,0,0,0.35)]">
            <span className="absolute inset-0 grid place-items-center px-6 text-center text-sm font-semibold text-[#E3C36A]/70">
              Heritage &amp; medicine — image coming soon
            </span>
            <img
              src={scrbv}
              alt="A Bharatanatyam dancer and a surgeon meeting — heritage meets modern medicine"
              loading="lazy"
              onError={(e) => { e.currentTarget.style.display = "none"; }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
