import React from "react";
import KolamDivider from "./KolamDivider";
import islewater from "../../public/isle-water.jpg";
export default function Welcome() {
  return (
    <section className="bg-[#FBF3E7] py-24 px-5 lg:px-10 xl:px-20 2xl:px-32">
      
      <div className="mx-auto grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="grid h-[300px] place-items-center rounded-[18px] border border-[#D2D2D7] bg-[#F5F5F7] font-medium text-[#86868B] sm:h-[440px]">
          <img src={islewater} alt="Isle of Water" className="h-full w-full rounded-[18px] object-cover" />
        </div>

        <div>
          <span className="flex items-center gap-3 text-[0.76rem] font-semibold uppercase tracking-[0.2em] text-[#8A6A12]">
            <span className="h-px w-8 bg-[#8A6A12]" />
            Welcome Message
          </span>

          <p className="mt-6 text-lg text-[#4A1220]">
            <span className="font-serif">&#2997;&#2979;&#2965;&#3021;&#2965;&#2990;&#3021;</span> &middot; Vanakkam
          </p>

          <h2 className="mt-3 font-serif text-4xl font-bold leading-tight text-[#6E1A2B] sm:text-5xl">
            Greetings from LTSICON Chennai 2026
          </h2>

          <div className="mt-5 space-y-5 text-[#6E5C54] leading-relaxed text-justify">
            <p>It is our great privilege to welcome you to the 9th Annual Conference of the Liver Transplantation Society of India, hosted this year in the vibrant city of Chennai &mdash; a global centre of excellence for liver transplantation.</p>
            <p>This four-day congregation of transplant surgeons, hepatologists, anaesthesiologists, intensivists, interventional radiologists, pathologists nurses and transplant coordinators serves as a vital platform to foster collaboration, exchange groundbreaking ideas, and advance the science and practice of liver transplantation across the subcontinent.</p>
            <p>With an enriching scientific program, hands-on workshops, and thought-provoking discussions, we invite you to be part of this landmark event. Together, let us shape the future for liver care in India that is integrated, inclusive and forward-looking.</p>
          </div>

          <div className="mt-8">
            <b className="block font-serif text-lg font-bold text-[#6E1A2B]">Dr. Elankumaran K </b>
            <span className="text-[#6E5C54]">Organising Chairman, LTSICON Chennai 2026.</span>
          </div>
        </div>
      </div>
      <KolamDivider />
    </section>
  );
}
