import kapaleeshwarar from "../../public/kapaleeshwarar.jpg";
import marinaBeach from "../../public/marina-beach.jpg";
import mahabalipuram from "../../public/mahabalipuram.jpg";
import fortStGeorge from "../../public/fortst-george.jpg";
import santhomchurch from "../../public/santhome-church.jpg";
import matrimandir from "../../public/matrimandir.jpg";
import kanchipuram from "../../public/kanchipuram.jpg"

export default function DiscoverChennai() {
  const places = [
  {
    title: "Kapaleeshwarar Temple",
    description:
      "A magnificent 7th-century Dravidian temple in Mylapore, with its towering gopuram and rich Tamil heritage.",
    gradient: "from-[#6E1A2B] to-[#4A1220]",
    image: kapaleeshwarar,
  },
  {
    title: "Marina Beach",
    description:
      "One of the world’s longest urban beaches, stretching along the Bay of Bengal — a Chennai icon at sunrise.",
    gradient: "from-[#D4A017] to-[#B58A1E]",
    image: marinaBeach,
  },
  {
    title: "Mahabalipuram",
    description:
      "A UNESCO World Heritage site of rock-cut shore temples and monuments, an hour south along the coast.",
    gradient: "from-[#1C6E6E] to-[#124A4A]",
    image: mahabalipuram,
  },
  
  {
    title: "Fort St. George",
    description:
      "India’s first English fortress and a living museum of the city’s colonial and maritime history.",
    gradient: "from-[#DB7B2A] to-[#B8541A]",
    image: fortStGeorge,
  },
  {
    title: "Santhome Church",
    description:"",
    gradient: "from-[#DB7B2A] to-[#B8541A]",
    image: santhomchurch,
  }, 
  {
    title:"Pondicherry Auroville Matrimandir",
    description:"",
      gradient: "from-[#DB7B2A] to-[#B8541A]",
    image: matrimandir,
  },
  {
    title:"Kanchipuram",
    description:"",
    image:kanchipuram,
  }
];
 
  return (
    <section className="bg-[#F4ECD9] py-24 px-5 lg:px-10 xl:px-20 2xl:px-32">
      <div className="mx-auto">
        <div className="mx-auto mb-14 max-w-[740px] text-center">
          <span className="mb-4 inline-flex items-center justify-center gap-3 text-[0.76rem] font-semibold uppercase tracking-[0.2em] text-[#8A6A12]">
            <span className="h-px w-8 bg-[#8A6A12]" />
            Host City
          </span>
          <h2 className="font-serif text-4xl font-bold text-[#6E1A2B] sm:text-5xl">Discover Chennai</h2>
          <p className="mt-3 text-[#6E5C54]">The cultural capital of South India — where ancient temples, Marina Beach, and a thriving medical ecosystem meet world-renowned cuisine and Carnatic tradition. <em>Detailed attractions appear under Venue &amp; Travel.</em></p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
         {places.map((item) => (
  <div
    key={item.title}
    className="overflow-hidden rounded-[16px] border border-[#E7D9BB] bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
  >
    <div className={`relative h-52 bg-gradient-to-br ${item.gradient}`}>
      <img
        src={item.image}
        alt={item.title}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>

    <div className="p-6">
      <h3 className="mb-2 font-serif text-xl font-semibold text-[#6E1A2B]">
        {item.title}
      </h3>
      <p className="text-[#6E5C54]">
        {item.description}
      </p>
    </div>
  </div>
))}
        </div>
      </div>
    </section>
  );
}
