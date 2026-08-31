export default function Contact() {
  return (
    <section className="bg-[#F4ECD9] px-6 py-24 sm:py-28" id="contact">
      <div className="mx-auto max-w-[1140px]">
        <div className="mx-auto mb-14 max-w-[740px] text-center">
          <span className="mb-4 inline-flex items-center justify-center gap-2.5 text-[0.76rem] font-semibold uppercase tracking-[0.2em] text-[#8A6A12]">Get in Touch</span>
          <h2 className="font-serif text-3xl font-bold text-[#6E1A2B] sm:text-4xl">Contact</h2>
          <p className="mt-3 text-[#6E5C54]">For registration, abstracts, sponsorship or general enquiries, reach the Organising Secretariat.</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[18px] border border-[#E7D9BB] bg-white p-8 shadow-sm">
            <h4 className="mb-4 font-serif text-xl font-semibold text-[#6E1A2B]"> Liver Diseases and Transplantation Institute</h4>
            <p className="text-[#6E5C54]">
Apollo Hospitals, No. 21, Greams Lane,
Off. Greams Road, Chennai - 600006.</p>
            <p className="mt-4 text-[#6E5C54]">☎ +91 7358121066</p>
            <p className="mt-4 text-[#6E5C54]">✉ Ltsicon2026@gmail.com </p>
            {/* ✉ abstracts@ltsicon2026.com */}
          </div>
          <div className="rounded-[18px] border border-[#E7D9BB] bg-white p-8 shadow-sm">
            <h4 className="mb-4 font-serif text-xl font-semibold text-[#6E1A2B]">Connect With Us</h4>
            <p className="text-[#6E5C54]">Follow LTSICON Chennai 2026 for programme updates, faculty announcements and deadline reminders.</p>
            <div className="mt-4 flex gap-3">
              <a href="#" aria-label="Facebook" className="grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-[#6E1A2B] text-white">f</a>
              <a href="#" aria-label="Instagram" className="grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-[#6E1A2B] text-white">●</a>
              <a href="#" aria-label="LinkedIn" className="grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-[#6E1A2B] text-white">in</a>
              <a href="#" aria-label="X" className="grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-[#6E1A2B] text-white">𝕏</a>
            </div>
            <p className="mt-4 text-sm italic text-[#6E5C54]">Social handles to be added.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
