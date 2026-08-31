import icong from "../../public/icobg.jpg";
import byair from "../../public/chennai-maa.jpg"
import chennairail from "../../public/chennai_central.jpg"
import byroad from "../../public/by_road.jpg"
import shoretemplae from "../../public/shore-temple.jpg"
import muttukadu from "../../public/muttukadu-backwater.jpg"
import museum from "../../public/dakshinachitra-museum.jpg"
import madrascoc from "../../public/madras-crocodile.jpg"
import covlong from  "../../public/covelong-beach.jpg"
import cholamandal from "../../public/cholamandal-village.jpg"
import tigerc from "../../public/tiger-caves.jpg"
import amprl from "../../public/alamparai-fort.jpg"
import surfing from "../../public/surfing.jpg"
import kayaking from "../../public/kayaking.jpg"
import boatbanna from "../../public/boatbnna.jpg"
import waterscooter from  "../../public/waterscooter.jpg"
import parasailing from "../../public/parasailing.jpg"
import scuba from "../../public/scuba-diving.jpg"
function OverlayCard({ title, img, pill, pillPos = "tl", desc, className = "", fill = false, featured = false, aspectClassName = "aspect-[4/3]" }) {
  return (
    <article
      className={`group relative isolate overflow-hidden rounded-[18px] bg-[#E8E8ED] shadow-[0_8px_20px_rgba(0,0,0,0.08)] transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_26px_50px_rgba(0,0,0,0.22)] ${
        fill ? "h-full" : aspectClassName
      } ${className}`}
    >
      <div className="absolute inset-0 z-0 flex items-center justify-center bg-gradient-to-br from-[#E8E8ED] to-[#EDEDF0] px-4 text-center text-sm font-medium text-[#86868B]">
        {title}
      </div>
      <img
        src={img}
        alt={title}
        loading="lazy"
        onError={(e) => { e.currentTarget.style.display = "none"; }}
        className="absolute inset-0 z-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.09]"
      />
      <span
        className={`absolute top-3.5 z-30 rounded-full bg-white/90 px-2.5 py-1 text-[0.72rem] font-bold text-[#C9A227] shadow-[0_4px_14px_rgba(0,0,0,0.18)] ${
          pillPos === "tr" ? "right-3.5" : "left-3.5"
        }`}
      >
        {pill}
      </span>
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 z-20 p-5 text-white">
        <h5 className={`font-serif leading-tight text-white drop-shadow ${featured ? "text-2xl sm:text-3xl" : "text-lg"}`}>{title}</h5>
        <p className="mt-2 text-sm leading-relaxed text-white/90 sm:mt-0 sm:max-h-0 sm:overflow-hidden sm:opacity-0 sm:transition-all sm:duration-500 sm:group-hover:mt-2 sm:group-hover:max-h-40 sm:group-hover:opacity-100">
          {desc}
        </p>
      </div>
    </article>
  );
}

const gettingHere = [
  { title: "By Air", img: byair, pill: "Chennai · MAA", desc: "Chennai International Airport (MAA), about 1 hour from the venue via the scenic East Coast Road." },
  { title: "By Rail", img: chennairail, pill: "Chennai Central", desc: "Chennai Central and Egmore are the principal stations, well connected across India." },
  { title: "By Road", img: byroad, pill: "On the ECR", desc: "Metro, app-based cabs and auto-rickshaws; the venue sits right on the East Coast Road." },
];

const ecr = [
  { title: "Shore Temple & Monuments", img: shoretemplae, pill: "At Mamallapuram", desc: "7th-century Shore Temple, Pancha Rathas, Arjuna’s Penance and Krishna’s Butterball — a UNESCO World Heritage ensemble.", className: "col-span-2 row-span-2", featured: true },
  { title: "Muttukadu Backwaters", img: muttukadu, pill: "~36 km", desc: "Lagoon and TTDC boathouse; the hub for boating and water sports." },
  { title: "DakshinaChitra Museum", img:museum , pill: "~25 km", desc: "Living-history museum of South Indian art, craft and heritage homes." },
  { title: "Madras Crocodile Bank", img: madrascoc, pill: "~40 km", desc: "One of the world’s largest reptile parks." },
  { title: "Covelong (Kovalam) Beach", img:covlong, pill: "~30 km", desc: "Fishing-village beach and South India’s surfing capital." },
  { title: "Cholamandal Artists’ Village", img: cholamandal, pill: "~30 km", desc: "India’s largest artists’ commune." },
  { title: "Tiger Cave", img: tigerc, pill: "~38 km", desc: "Rock-cut shrine framed by carved tiger heads." },
  { title: "Alamparai Fort", img: amprl, pill: "~70 km", desc: "17th-century fort ruins where a tidal creek meets the sea.", className: "col-span-2" },
];

const watersports = [
  { title: "Surfing", img: surfing, pill: "Covelong Point", desc: "Beginner-friendly breaks at Covelong (Kovalam) with board hire and lessons." },
  { title: "Windsurfing & Kayaking", img: kayaking, pill: "Muttukadu", desc: "Muttukadu backwaters (TTDC boathouse); also rowing and pedal boats." },
  { title: "Jet Ski & Banana Boat", img: boatbanna, pill: "Mahabalipuram", desc: "Ride the surf off Mahabalipuram beach." },
  { title: "Speed Boating & Water Scooters", img: waterscooter, pill: "Muttukadu", desc: "Fast rides across the calm Muttukadu lagoon." },
  { title: "Parasailing", img: parasailing, pill: "Mudaliarkuppam", desc: "Mudaliarkuppam (Odiyur lagoon) boathouse." },
  { title: "SUP & Snorkelling", img: scuba, pill: "Covelong", desc: "Stand-up paddle and snorkelling off the Covelong (Kovalam) shore (seasonal)." },
];

const bullet = "relative pl-6 leading-relaxed text-[#6E5C54] before:absolute before:left-0 before:top-0 before:font-bold before:text-[#C9A227] before:content-['›']";

export default function Venue() {
  return (
    <section id="venue" className="py-24 px-5 lg:px-10 xl:px-20 2xl:px-32">
      <div className="mx-auto">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative grid h-[300px] place-items-center overflow-hidden rounded-[18px] border border-[#D2D2D7] bg-[#F5F5F7] px-6 text-center font-medium text-[#86868B] sm:h-[440px]">
            <span>[ RADISSON BLU TEMPLE BAY / MAMALLAPURAM IMAGE ]</span>
            <img
              src={icong}
              alt="Radisson Blu Resort Temple Bay, Mamallapuram"
              loading="lazy"
              onError={(e) => { e.currentTarget.style.display = "none"; }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <div>
            <span className="mb-4 inline-flex items-center gap-3 text-[0.76rem] font-semibold uppercase tracking-[0.2em] text-[#8A6A12]">
              <span className="h-px w-8 bg-[#8A6A12]" />
              The Venue
            </span>
            <h2 className="font-serif text-4xl font-bold text-[#6E1A2B] sm:text-5xl">Radisson Blu Resort Temple Bay</h2>
            <p className="mt-4 text-[#6E5C54]">LTSICON 2026 will be hosted at the Radisson Blu Resort Temple Bay in Mamallapuram (Mahabalipuram) &mdash; a beachfront resort on the Bay of Bengal, set beside the UNESCO World Heritage Shore Temple. It pairs world-class conference facilities with the calm of the coast, just south of Chennai along the East Coast Road.</p>
            <ul className="mt-5 space-y-2.5">
              {["Beachfront resort on the Bay of Bengal", "Conference halls, workshop zones and an exhibition area", "Adjacent to the historic Mamallapuram monuments", "About 1 hour from Chennai International Airport via the scenic ECR"].map((t) => (
                <li key={t} className={bullet}>{t}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14" id="accommodation">
          <h3 className="mb-4 font-serif text-2xl font-semibold text-[#6E1A2B]">Accommodation</h3>
          <p className="text-[#6E5C54]">Curated partner hotels across luxury, premium and comfort tiers near the venue.</p>
          <p className="mt-3 text-sm italic text-[#6E5C54]">To be replaced with confirmed hotels, distances and negotiated rates.</p>
        </div>

        <div className="mt-14" id="travel">
          <h3 className="mb-5 font-serif text-2xl font-semibold text-[#6E1A2B]">Getting Here</h3>
          <div className="grid gap-4.5 sm:grid-cols-2 lg:grid-cols-3">
            {gettingHere.map((c) => <OverlayCard key={c.title} {...c} aspectClassName="aspect-[5/2.9]" />)}
          </div>
        </div>

        <div className="mt-14">
          <h3 className="mb-2 font-serif text-2xl font-semibold text-[#6E1A2B]">Explore the East Coast Road</h3>
          <p className="mb-5 text-sm italic text-[#6E5C54]">Distances are approximate.</p>
          <div className="grid auto-rows-55 grid-flow-dense grid-cols-2 gap-4.5 sm:auto-rows-47.5 lg:grid-cols-4">
            {ecr.map((c) => <OverlayCard key={c.title} {...c} pillPos="tr" fill />)}
          </div>
        </div>

        <div className="mt-14">
          <h3 className="mb-2 font-serif text-2xl font-semibold text-[#6E1A2B]">Water Sports on the ECR</h3>
          <p className="mb-5 text-sm italic text-[#6E5C54]">Confirm seasonal availability and safety guidance with operators.</p>
          <div className="grid gap-4.5 sm:grid-cols-2 lg:grid-cols-3">
            {watersports.map((c) => <OverlayCard key={c.title} {...c} aspectClassName="aspect-[5/2.9]" />)}
          </div>
        </div>

        <div className="mt-14 text-center">
          <a href="#registration" className="inline-flex items-center rounded-full bg-[#6E1A2B] px-7 py-3 text-sm font-semibold text-[#FBF1DD] transition hover:-translate-y-0.5 hover:bg-[#4A1220]">Venue &amp; Registration</a>
        </div>
      </div>
    </section>
  );
}
