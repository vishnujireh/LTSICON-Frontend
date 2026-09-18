import counsil1 from '../../public/counsil1.png';
import counsil2 from '../../public/counsil2.png';
import sanjeev from '../../public/sanjeev-counsil.png';
import counsil3 from '../../public/counsil3.png';
import counsil4 from '../../public/counsil4.png';
import counsil5 from '../../public/counsil5.png';
import counsil6 from '../../public/counsil6.png';
import counsil7 from '../../public/counsil7.png';
import counsil12 from '../../public/counsil12.png';
import counsil9 from '../../public/counsil9.png';
import counsil8 from '../../public/counsil8.png';
import counsil11 from '../../public/counsil11.png';
import counsil10 from '../../public/counsil10.png';
import dinesh from '../../public/dinesh-jothimani.png';
import gomathy from '../../public/gomathy-narasimhan.png';
import ilankumaran from '../../public/ilankumaran.png';
import karthik from '../../public/karthik-mathivanan.png';
import kulaseharan from '../../public/kulaseharan.png';
import manjunath from '../../public/manjunath.png';
import murugan from '../../public/murugan.png';
import muthukumarassamy from '../../public/muthukumarassamy.png';
import naresh from '../../public/naresh-shanmugam.png';
import nivas from '../../public/nivas-venkatachalapathi.png';
import selvakumar from '../../public/selvakumar.png';
import swaminathan from '../../public/swaminathan.png';
import thiagarajan from '../../public/thiagarajan-srinivasan.png';
import venkatesh from '../../public/venkatesh-bs.jpeg';
import vimalraj from '../../public/vimalraj-velayutham.png';
export default function Organizer() {
  const groups = [
    {
    members: [
      {
        name: 'Dr. Abhideep Chaudhary',
        role: 'President',
        image: counsil1,
      },
      {
        name: 'Dr. Neerav Goyal',
        role: 'President Elect',
        image: counsil2,
      },
      {
        name: 'Dr. Sanjeev saigal',
        role: 'Past President',
        image: sanjeev,
      },
      {
        name:'Dr. Charles Panackel',
        role:'Secretary',
        image: counsil3,
      },
      {
        name:'Dr. Ilankumaran Kaliamoorthy',
        role:'Treasurer',
        image: counsil4,
      },
      {
        name:'Dr. Rahul Saxena',
        role:'Joint Secretary',
        image:counsil5,
      },
      {
        name:'Dr. Pooja Bhangui',
        role:'Governing Council – Anesthesia',
        image:counsil6,
      },
      {
        name:'Dr. Naveen Ganjoo',
        role:'Governing Council – Adult Hepatology',
        image:counsil7,
      },
      {
        name:'Dr. Jagadeesh Menon',
        role:'Governing Council – Hepatology',
        image:counsil12,
      },
      {
        name:'Dr. Saurabh Singhal',
        role:'Governing Council – General',
        image:counsil9,
      },
      {
        name:'Dr. Sumana KR',
        role:'Governing Council – General',
        image:counsil8,
      },
      {
        name:'Dr. Gaurav Sood',
        role:'Governing Council – General',
        image:counsil11,
      },
      {
        name:'Dr. Punit Singla',
        role:'Governing Council – General',
        image:counsil10,
      },
    ],
  },
  
   
    
  ];

  return (
    <section className="bg-white px-6 py-24 sm:py-28" id="organizer">
      <div className="mx-auto max-w-[1140px]">
        <div className="mx-auto mb-14 max-w-[740px] text-center">
          <span className="mb-4 inline-flex items-center justify-center gap-2.5 text-[0.76rem] font-semibold uppercase tracking-[0.2em] text-[#8A6A12]">Organizer</span>
          <h2 className="font-serif text-3xl font-bold text-[#6E1A2B] sm:text-4xl">LTSI COUNCIL 2026</h2>
          <p className="mt-3 text-[#6E5C54]">The teams organising LTSICON Chennai 2026. </p>
        </div>
        <div className="flex flex-col gap-11">
  {groups.map((group, gi) => (
    <div key={gi} className="text-center">
      {group.title && (
        <h4 className="mb-3 inline-block border-b-2 border-[#B58A1E] pb-2 font-serif text-[1.15rem] text-[#6E1A2B]">
          {group.title}
        </h4>
      )}

      <div className="mt-4 flex flex-wrap justify-center gap-7 sm:gap-14">
        {group.members.map((member, mi) => (
          <div key={mi} className="max-w-[260px] text-center">
            <img
              src={member.image}
              alt={member.name}
              loading="lazy"
              className="mx-auto mb-4 h-36 w-36 rounded-full border-4 border-white object-cover shadow-sm"
            />

            <h4 className="text-base font-semibold text-[#6E1A2B]">
              {member.name}
            </h4>

            {member.role && (
              <div className="text-sm font-semibold text-[#8A6A12]">
                {member.role}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  ))}
</div>
      </div>
    </section>
  );
}
