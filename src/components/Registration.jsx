const rows = [
  ["LTSI Member", "₹12,000", "₹15,000", "₹18,000"],
  ["Non-Member", "₹15,000", "₹18,000", "₹22,000"],
  ["Fellow / PG Student", "₹7,000", "₹9,000", "₹12,000"],
  ["Nurse / Coordinator", "₹2,000", "₹8,000", "₹3,000"],
  ["International Delegate", "USD 250 (₹23,617)", "USD 300 (₹28,340)", "USD 350 (₹33,064)"],
  ["Accompanying Person", "₹8,000", "₹10,000", "₹12,000"],
];

const bullet =
  "relative pl-6 leading-relaxed text-[#6E5C54] before:absolute before:left-0 before:top-0 before:font-bold before:text-[#C9A227] before:content-['›']";

export default function Registration() {
  return (
    <section id="registration" className="bg-[#F4ECD9] py-24 px-5 lg:px-10 xl:px-20 2xl:px-32">
      <div className="mx-auto">
        <div className="mx-auto mb-14 max-w-[740px] text-center">
          <span className="mb-4 inline-flex items-center justify-center gap-3 text-[0.76rem] font-semibold uppercase tracking-[0.2em] text-[#8A6A12]">
            <span className="h-px w-8 bg-[#8A6A12]" />
            Registration
          </span>
          <h2 className="font-serif text-4xl font-bold text-[#6E1A2B] sm:text-5xl">Registration Tariff</h2>
          {/* <p className="mt-4 text-[#6E5C54]">Fees are indicative and in INR (inclusive of taxes). <em>To be replaced with the approved fee structure.</em></p> */}
        </div>

        <div className="overflow-x-auto rounded-2xl border border-[#E7D9BB] bg-white shadow-[0_14px_40px_-24px_rgba(110,26,43,0.35)]">
          <table className="w-full min-w-[720px] border-collapse bg-white">
            <thead>
              <tr>
                {["Category", "Early Bird (to 31 Oct)", "Standard (to 30 Nov)", "Spot"].map((h) => (
                  <th key={h} className="whitespace-nowrap border-b border-[#EDEDF0] bg-[#F5F5F7] px-6 py-4 text-left text-sm font-semibold text-[#1D1D1F]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="last:[&>td]:border-b-0">
                  {row.map((cell, j) => (
                    <td key={j} className="border-b border-[#EDEDF0] px-6 py-4 align-top text-sm text-[#6E5C54]">
                      {j === 0 ? <b className="font-semibold text-[#6E1A2B]">{cell}</b> : cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-14 grid gap-12 lg:grid-cols-2">
          <div>
            <h3 className="mb-4 font-serif text-2xl font-semibold text-[#6E1A2B]">Registration Includes</h3>
            <ul className="space-y-3">
              {["Access to all scientific sessions and exhibition", "Conference kit and delegate badge", "Lunch and refreshments on conference days", "Certificate of participation (with credit hours)"].map((t) => (
                <li key={t} className={bullet}>{t}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-serif text-2xl font-semibold text-[#6E1A2B]">Notes</h3>
            <ul className="space-y-3">
              {["Workshops may require separate registration subject to seat availability.", "LTSI membership can be obtained or renewed at the time of registration.", "Cancellation and refund policy as per the official terms and conditions."].map((t) => (
                <li key={t} className={bullet}>{t}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 text-center">
          <a href="#contact" className="inline-flex items-center rounded-full bg-[#6E1A2B] px-7 py-3 text-sm font-semibold text-[#FBF1DD] transition hover:-translate-y-0.5 hover:bg-[#4A1220]">Registration Enquiries</a>
        </div>
      </div>
    </section>
  );
}
