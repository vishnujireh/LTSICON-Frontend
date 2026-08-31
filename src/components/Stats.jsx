const stats = [
  { num: "1500+", label: "Delegates Expected" },
  { num: "120+", label: "Faculty & Speakers" },
  { num: "40+", label: "Scientific Sessions" },
  { num: "4", label: "Days of Learning" },
];

export default function Stats() {
  return (
    <section className="border-t border-b border-[#e7d9bb] bg-[#F4ECD9] py-20 px-5 lg:px-10 xl:px-20 2xl:px-32">
      <div className="mx-auto">
        <div className="grid grid-cols-2 gap-y-12 md:grid-cols-4 md:divide-x md:divide-[#e0d0ac]">
          {stats.map(({ num, label }) => (
            <div key={label} className="flex flex-col items-center text-center md:px-6">
              <div className="font-serif text-5xl font-bold leading-none text-[#C9A227] lg:text-6xl">
                {num}
              </div>
              <div className="mt-4 text-base font-medium tracking-wide text-[#6B4A2B] lg:text-lg">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
