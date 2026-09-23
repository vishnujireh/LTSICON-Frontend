import BrandBar from './components/BrandBar.jsx';
import Header from './components/Header.jsx';
import Ribbon from './components/Ribbon.jsx';
import Hero from './components/Hero.jsx';
import MessageFromPresident from './components/MessageFromPresident.jsx';
import Stats from './components/Stats.jsx';
import FeatureTiles from './components/FeatureTiles.jsx';
import Welcome from './components/Welcome.jsx';
import KolamDivider from './components/KolamDivider.jsx';
import Heritage from './components/Heritage.jsx';
import KeyDatesCalendar from './components/KeyDatesCalendar.jsx';
import ProgramHighlights from './components/ProgramHighlights.jsx';
import DiscoverChennai from './components/DiscoverChennai.jsx';
import About from './components/About.jsx';
import Organizer from './components/Organizer.jsx';
import Committee from './components/Committee.jsx';
import Faculty from './components/Faculty.jsx';
import Program from './components/Program.jsx';
import Abstracts from './components/Abstracts.jsx';
import Registration from './components/Registration.jsx';
import Venue from './components/Venue.jsx';
import Contact from './components/Contact.jsx';
import CtaTile from './components/CtaTile.jsx';
import Footer from './components/Footer.jsx';
import RegisterPage from './components/RegisterPage.jsx';
import ResetPassword from './components/ResetPassword.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import { currentPath } from './lib/nav.js';
import { useEffect, useState } from 'react';

export default function App() {
  // Path-based routing (clean URLs: /register, /admin, /reset). In-page hash
  // anchors like #contact still work — they don't change the pathname.
  const [route, setRoute] = useState(() => currentPath().replace(/^\//, ''));

  useEffect(() => {
    const onNav = () => setRoute(currentPath().replace(/^\//, ''));
    window.addEventListener('popstate', onNav);
    return () => window.removeEventListener('popstate', onNav);
  }, []);

  if (route === 'register') {
    return <RegisterPage />;
  }

  // /admin — hidden, unlinked admin dashboard (real protection is server-side).
  if (route === 'admin') {
    return <AdminDashboard />;
  }

  // /reset?token=... — password reset landing from the email link.
  if (route === 'reset') {
    return <ResetPassword />;
  }

  return (
    <>
      <BrandBar />
      <Header />
      <Ribbon />
      <Hero />
      <MessageFromPresident />
      <Stats />
      <FeatureTiles />
      <Welcome />
      <Heritage />
      <KeyDatesCalendar />
      <ProgramHighlights />
      <DiscoverChennai />
      <About />
      <Organizer />
      <Committee />
      <Faculty />
      <Program />
      <Abstracts />
      <Registration />
      <Venue />
      <Contact />
      <CtaTile />
      <Footer />
    </>
  );
}
