const preview = [
  { name: "Prof. [Faculty Name]", role: "Transplant Surgery", org: "India" },
  { name: "Prof. [Faculty Name]", role: "Hepatology", org: "USA" },
  { name: "Dr. [Faculty Name]", role: "Interventional Radiology", org: "UK" },
  { name: "Prof. [Faculty Name]", role: "Anaesthesiology", org: "Italy" },
  { name: "Dr. [Faculty Name]", role: "Pediatric Hepatology", org: "Japan" },
];

export default function Faculty() {
  return (
    <section id="faculty" className="py-24 px-5 lg:px-10 xl:px-20 2xl:px-32">
      <div className="mx-auto">
        <div className="mx-auto mb-14 max-w-[740px] text-center">
          <span className="mb-4 inline-flex items-center justify-center gap-3 text-[0.76rem] font-semibold uppercase tracking-[0.2em] text-[#8A6A12]">
            <span className="h-px w-8 bg-[#8A6A12]" />
            Distinguished Faculty
          </span>
          <h2 className="font-serif text-4xl font-bold text-[#6E1A2B] sm:text-5xl">International &amp; National Faculty</h2>
          <p className="mt-4 text-[#6E5C54]">Leading minds and emerging voices from across India and around the world.</p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h3 className="mb-4 font-serif text-2xl font-semibold text-[#6E1A2B]">International Faculty</h3>
            <p className="text-[#6E5C54]">Global leaders in transplant surgery, hepatology and allied specialties &mdash; joining from the USA, UK, Italy, Canada, Japan, Singapore, the Netherlands and Brazil, among others.</p>
          </div>
          <div>
            <h3 className="mb-4 font-serif text-2xl font-semibold text-[#6E1A2B]">National Faculty</h3>
            <p className="text-[#6E5C54]">Eminent clinicians and surgeons leading liver transplantation across India, from Chennai, New Delhi, Mumbai, Bengaluru, Hyderabad, Kochi and Kolkata.</p>
          </div>
        </div>

        <div className="mt-14">
          <h3 className="mb-8 font-serif text-2xl font-semibold text-[#6E1A2B]">Confirmed Faculty Preview</h3>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
            {preview.map(({ name, role, org }, i) => (
              <div key={i} className="text-center">
                <img
                  src={`https://loremflickr.com/300/300/doctor,physician?lock=${41 + i}`}
                  alt={name}
                  loading="lazy"
                  className="mx-auto mb-4 h-[130px] w-[130px] rounded-full border-4 border-white object-cover shadow-sm"
                />
                <h4 className="text-base font-semibold text-[#6E1A2B]">{name}</h4>
                <div className="mt-1 text-sm font-semibold text-[#8A6A12]">{role}</div>
                <div className="text-sm text-[#6E5C54]">{org}</div>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-sm italic text-[#6E5C54]">Full faculty roster to be confirmed and published with photographs.</p>
        </div>
      </div>
    </section>
  );
}
