import { useEffect, useState } from 'react';
import Logo from '../../public/logo.svg';
import itlogo from '../../public/logo-r.png';
import { openRegister } from './RegisterModal.jsx';
import { getCurrentUser, onAuthChange } from '../lib/auth.js';
import ProfileMenu from './ProfileMenu.jsx';

const links = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#organizer', label: 'Organizer' },
  { href: '#committee', label: 'Committee' },
  // { href: '#faculty', label: 'Faculty' },
  { href: '#program', label: 'Program' },
  { href: '#abstracts', label: 'Abstracts' },
  { href: '#venue', label: 'Venue' },
  { href: '#contact', label: 'Contact' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(() => getCurrentUser());

  useEffect(() => onAuthChange(() => setUser(getCurrentUser())), []);

  return (
    <header className="sticky top-0 z-50 border-b border-[#E7D9BB] bg-[rgba(251,245,233,0.92)] px-5 py-2 backdrop-blur lg:px-10 xl:px-20 2xl:px-32">
      <div className="mx-auto flex items-center justify-between">
        <a href="#home" className="flex items-center">
          <img src={itlogo} alt="LTSICON Chennai 2026" className="h-12 w-auto sm:h-16 lg:h-16" />
        </a>

        <nav className="hidden items-center gap-7 text-sm font-medium text-[#6E1A2B] md:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="relative pb-1 transition hover:text-[#8A6A12]">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a href="#abstracts" className="inline-flex items-center rounded-full border border-[#6E1A2B] px-3.5 py-2 text-sm font-semibold text-[#6E1A2B] transition hover:-translate-y-0.5 hover:bg-[#6E1A2B] hover:text-white">
            Abstract Submission
          </a>
          {user ? (
            <ProfileMenu user={user} />
          ) : (
            <button type="button" onClick={openRegister} className="inline-flex items-center rounded-full bg-[#6E1A2B] px-3.5 py-2 text-sm font-semibold text-[#FBF1DD] transition hover:-translate-y-0.5 hover:bg-[#4A1220]">
              Register Now
            </button>
          )}
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-lg border border-[#E7D9BB] text-[#6E1A2B] lg:hidden"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="h-5 w-5">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>}
          </svg>
        </button>
         <a href="#home" className="flex items-center">
          <img src={Logo} alt="LTSICON Chennai 2026" className="h-12 w-auto sm:h-16 lg:h-16" />
        </a>
      </div>

      {open && (
        <nav className="mt-4 flex flex-col gap-1 border-t border-[#E7D9BB] pt-4 lg:hidden">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-[#6E1A2B] transition hover:bg-[#F3E7C6]"
            >
              {link.label}
            </a>
          ))}
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <a
              href="#abstracts"
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center rounded-full border border-[#6E1A2B] px-4 py-2.5 text-sm font-semibold text-[#6E1A2B] transition hover:bg-[#6E1A2B] hover:text-white"
            >
              Abstract Submission
            </a>
            <button
              type="button"
              onClick={() => { setOpen(false); openRegister(); }}
              className="inline-flex items-center justify-center rounded-full bg-[#6E1A2B] px-4 py-2.5 text-sm font-semibold text-[#FBF1DD] transition hover:bg-[#4A1220]"
            >
              {user ? 'My Registration' : 'Register Now'}
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
