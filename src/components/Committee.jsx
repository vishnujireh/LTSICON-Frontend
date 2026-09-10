import mohamed from '../../public/mohamed-rela.png';
import elankumaran from '../../public/elankumaran.png';
import joy from '../../public/joy-varghese.png';
import ilankumaran from '../../public/ilankumaran.png';
import selvakumar from '../../public/selvakumar.png';
import murugan from '../../public/murugan.png';
import gomathy from '../../public/gomathy-narasimhan.png';
import dinesh from '../../public/dinesh-jothimani.png';
import naresh from '../../public/naresh-shanmugam.png';
import nivas from '../../public/nivas-venkatachalapathi.png';
import muthukumarassamy from '../../public/muthukumarassamy.png';
import thiagarajan from '../../public/thiagarajan-srinivasan.png';
import karthik from '../../public/karthik-mathivanan.png';
import vimalraj from '../../public/vimalraj-velayutham.png';
import manjunath from '../../public/manjunath.png';
import kulaseharan from '../../public/kulaseharan.png';
import swaminathan from '../../public/swaminathan.png';
import venkatesh from '../../public/venkatesh-bs.jpeg';
export default function Committee() {
  const groups = [
    {
    members: [
      {
        name: 'Prof. Mohamed Rela',
        role: 'Organizing Patron',
        image: mohamed,
      },
      {
        name: 'Dr. Elankumaran K',
        role: 'Organizing Chairman',
        image: elankumaran,
      },
      {
        name: 'Dr Joy Varghese',
        role: 'Organizing Secretary',
        image: joy,
      },
    ],
  },
  
    {
      title: 'Organising Committee',
      members: [
        {
          name:'Dr. Ilankumaran K',
          image:ilankumaran
        },
        {
          name:'Dr. Selvakumar M',
          image:selvakumar
        },
        {
          name:'Dr. Murugan N',
          image:murugan
        },
        {
          name:'Dr. Gomathy Narasimhan',
          image:gomathy
        },
        {
          name:'Dr. Dinesh Jothimani',
          image:dinesh
        },
        {
          name:'Dr. Naresh Shanmugam',
          image:naresh
        },
        {
          name:'Dr. Nivas Venkatachalapathi',
          image:nivas
        },
        {
          name:'Dr. Muthukumarassamy',
          image:muthukumarassamy
        },
        {
          name:'Dr. Thiagarajan Srinivasan',
          image:thiagarajan
        },
        {
          name:'Dr. Swaminathan',
          image:swaminathan
        },
        {
          name:'Dr. Karthik Mathivanan',
          image:karthik
        },
        {
          name:'Dr. Vimalraj Velayutham',
          image:vimalraj
        },
        {
          name:'Dr. Manjunath B',
          image:manjunath
        },
        {
          name:'Dr. Kulaseharan V H',
          image:kulaseharan
        }, 
      ],
    },
    {
    title: 'Scientific Committee',
    members: [
      {
        name: 'Dr Venkatesh B S',
        // role: 'Organizing Patron',
        image: venkatesh,
      },
    ],
  },
  ];

  return (
    <section className="bg-[#F4ECD9] px-6 py-24 sm:py-28" id="committee">
      <div className="mx-auto max-w-[1140px]">
        <div className="mx-auto mb-14 max-w-[740px] text-center">
          <span className="mb-4 inline-flex items-center justify-center gap-2.5 text-[0.76rem] font-semibold uppercase tracking-[0.2em] text-[#8A6A12]">Governance</span>
          <h2 className="font-serif text-3xl font-bold text-[#6E1A2B] sm:text-4xl">Committee</h2>
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
