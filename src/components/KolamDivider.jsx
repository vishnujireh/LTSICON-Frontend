export default function KolamDivider() {
  return (
    <div className="mt-10 px-5 lg:px-10 xl:px-20 2xl:px-32">
      <svg viewBox="0 0 720 26" preserveAspectRatio="xMidYMid meet" aria-hidden="true" className="mx-auto h-[26px] w-full max-w-[760px] text-[#C9A227]">
        <defs>
          <pattern id="kolam" width="48" height="26" patternUnits="userSpaceOnUse">
            <circle cx="24" cy="13" r="2.4" fill="currentColor" />
            <path d="M24 3 L34 13 L24 23 L14 13 Z" fill="none" stroke="currentColor" strokeWidth="1.4" />
            <circle cx="0" cy="13" r="1.6" fill="currentColor" />
            <circle cx="48" cy="13" r="1.6" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="720" height="26" fill="url(#kolam)" />
      </svg>
    </div>
  );
}
