const dates = [
  { month: "Aug", day: "01", year: "2026", label: "Registration Opens" },
  { month: "Aug", day: "10", year: "2026", label: "Call for Abstracts" },
  { month: "Sep", day: "30", year: "2026", label: "Abstract Submission Deadline" },
  { month: "Oct", day: "30", year: "2026", label: "Early-Bird Registration Closes" },
  { month: "Dec", day: "10", year: "2026", label: "LTSI Consensus Meeting" },
  { month: "Dec", day: "11–13", year: "2026", label: "LTSICON Chennai 2026" },
];

export default function KeyDatesCalendar() {
  return (
    <section className="bg-[#F4ECD9] py-24 px-5 lg:px-10 xl:px-20 2xl:px-32">
      <div className="mx-auto">
        <div className="mx-auto mb-14 max-w-[740px] text-center">
          <span className="mb-4 inline-flex items-center justify-center gap-3 text-[0.76rem] font-semibold uppercase tracking-[0.2em] text-[#8A6A12]">
            <span className="h-px w-8 bg-[#8A6A12]" />
            Mark Your Calendar
          </span>
          <h2 className="font-serif text-4xl font-bold text-[#6E1A2B] sm:text-5xl">Key Dates</h2>
          <p className="mt-4 text-[#6E5C54]">
            Important deadlines for registration, abstract submission and the conference itself.{" "}
            {/* <em>All key dates are drafted estimates &mdash; confirm before publishing.</em> */}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {dates.map(({ month, day, year, label }) => (
            <div
              key={label}
              className="flex flex-col items-center rounded-2xl border border-[#EBDFC4] bg-white px-4 py-8 text-center shadow-[0_10px_30px_-18px_rgba(110,26,43,0.35)] transition hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_rgba(110,26,43,0.45)]"
            >
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-[#8A6A12]">{month}</div>
              <div className="mt-3 font-serif text-4xl font-bold leading-none text-[#6E1A2B]">{day}</div>
              <div className="mt-3 text-sm text-[#9A8B7A]">{year}</div>
              <h4 className="mt-4 font-semibold text-[#6E1A2B]">{label}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
