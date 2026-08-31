import React from 'react';
import Logo from '../../public/logo.svg';
import itlogo from '../../public/logo-r.png';
export default function Footer() {
  return (
    <footer className="bg-[#4A1220] py-24 px-5 lg:px-10 xl:px-20 2xl:px-32 text-[#F6E7C4]">
      <div className="mx-auto">
        <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr_1fr_1.2fr]">
          <div>
            <a href="#home" className="mb-2 inline-block items-center gap-3 bg-white p-3 rounded-xl">
              <img src={Logo} alt="LTSI 2024" className="h-10 w-auto sm:h-12" />
            </a>
            <p className="text-[#F6E7C4]/80">The 9th Annual Conference of the Liver Transplantation Society of India, dedicated to advancing transplant surgery, hepatology and multidisciplinary patient care.</p>
            <div className="mt-5 flex items-center gap-3">
              <span className="text-[0.72rem] uppercase tracking-[0.12em] text-[#F6E7C4]/60">Organised by</span>
              <img src={itlogo} alt="Liver Transplantation Society of India (LTSI)" className="h-18 rounded-lg bg-white p-2" />
            </div>
            <div className="mt-4 flex gap-3">
              <a href="#" aria-label="Facebook" className="grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-[#C9A227] hover:text-[#4A1220]">f</a>
              <a href="#" aria-label="Instagram" className="grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-[#C9A227] hover:text-[#4A1220]">●</a>
              <a href="#" aria-label="LinkedIn" className="grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-[#C9A227] hover:text-[#4A1220]">in</a>
              <a href="#" aria-label="X" className="grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-[#C9A227] hover:text-[#4A1220]">𝕏</a>
            </div>
          </div>
          <div>
            <h5 className="mb-4 font-semibold text-white">Quick Links</h5>
            <ul className="space-y-2 text-[#F6E7C4]/80">
              <li><a href="#about">About</a></li>
              <li><a href="#committee">Committee</a></li>
              <li><a href="#faculty">Faculty</a></li>
              <li><a href="#program">Program</a></li>
            </ul>
          </div>
          <div>
            <h5 className="mb-4 font-semibold text-white">Delegates</h5>
            <ul className="space-y-2 text-[#F6E7C4]/80">
              <li><a href="#registration">Registration</a></li>
              <li><a href="#abstracts">Abstracts</a></li>
              <li><a href="#accommodation">Accommodation</a></li>
              <li><a href="#travel">Travel</a></li>
            </ul>
          </div>
          <div>
            <h5 className="mb-4 font-semibold text-white">Contact</h5>
            <p className="text-[#F6E7C4]/80">Liver Diseases and Transplantation Institute,
Apollo Hospitals, No. 21, Greams Lane,
Off. Greams Road, Chennai - 600006.</p>
            <p className="mt-2 text-[#F6E7C4]/80">☎ +91 7358121066<br />✉ Ltsicon2026@gmail.com</p>
          </div>
        </div>
        <div className="mt-10 flex flex-wrap justify-between gap-3 border-t border-white/10 pt-6 text-sm text-[#F6E7C4]/70">
          <span>© 2026 Liver Transplantation Society of India. All rights reserved.</span>
          <span>LTSICON Chennai 2026</span>
        </div>
      </div>
    </footer>
  );
}
