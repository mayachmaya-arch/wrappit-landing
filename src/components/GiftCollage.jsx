import PhotoFrame from './PhotoFrame';
import BridgeHeading from './BridgeHeading';

// Small sample of rotated "gift idea" cards as a decorative backdrop —
// a simplified stand-in for the ~35-card collage in the final Figma file.
// See README.md → "העלאת נכסים בעצמך".
const COLLAGE_CARDS = [
  { price: 120, title: 'רחצה לכלבים קטנים', subtitle: 'שמפו עדין וניחוח נעים', src: '/images/gallery-photo-1.jpg' },
  { price: 250, title: 'טיפול ספא מפנק', subtitle: 'עיסוי מרגיע ושמנים', src: '/images/gallery-photo-2.jpg' },
  { price: 190, title: 'עיצוב חגיגי', subtitle: 'תספורת ועיטורים', src: '/images/gallery-photo-3.jpg' },
  { price: 320, title: 'חבילת טיפוח VIP', subtitle: 'כל השירותים במחיר אחד', src: '/images/gallery-photo-1.jpg' },
  { price: 95, title: 'גזיזת ציפורניים', subtitle: 'זהירות מלאה ובטיחות', src: '/images/gallery-photo-2.jpg' },
  { price: 210, title: 'טיפול פרוות משי', subtitle: 'מרכך פרימיום וברק', src: '/images/gallery-photo-3.jpg' },
];

function CollageCard({ price, title, subtitle, src }) {
  return (
    <div className="flex w-[220px] shrink-0 flex-col overflow-hidden rounded-2xl bg-cloud shadow-lg">
      <div className="flex items-center justify-between p-3 text-right" dir="rtl">
        <span className="text-lg font-bold text-ink">₪{price}</span>
        <div className="flex flex-col items-end gap-0.5">
          <p className="text-sm font-bold text-ink">{title}</p>
          <p className="text-xs text-stone-500">{subtitle}</p>
        </div>
      </div>
      <PhotoFrame src={src} alt={title} className="aspect-[4/3] w-full" gradient="from-amber-100 via-rose-100 to-stone-200" rounded="rounded-none" />
    </div>
  );
}

function PhoneMockup() {
  return (
    <div className="mx-auto flex w-[260px] shrink-0 flex-col overflow-hidden rounded-[36px] border-4 border-stone-800 bg-white shadow-2xl sm:w-[280px]">
      <div className="mx-auto mt-3 h-1.5 w-16 rounded-full bg-stone-300" />
      <div className="flex items-center justify-between px-5 pt-4 text-xs text-stone-500">
        <span>13:54</span>
        <span className="font-logo text-lg text-pink">Wrappit</span>
      </div>

      <div className="mx-4 mt-6 aspect-square rounded-2xl bg-gradient-to-br from-amber-200 via-rose-100 to-stone-200" />

      <div className="flex flex-col gap-1 px-5 pt-5">
        <p className="text-sm text-stone-500">שיעור גיטרה — עודן אצטרובל</p>
        <p className="text-2xl font-black text-ink">₪1,600</p>
      </div>

      <div className="mx-5 mt-4 flex flex-col gap-3 rounded-2xl border border-stone-200 p-4">
        <p className="text-sm font-bold text-ink">ספרו לנו על מקבל/ת המתנה</p>
        <div className="flex gap-2 text-xs">
          <span className="rounded-full bg-pink px-3 py-1 font-semibold text-white">מכיר/ה אישית</span>
          <span className="rounded-full border border-stone-300 px-3 py-1 text-stone-500">לא מכיר/ה</span>
        </div>
        <div className="h-2 rounded-full bg-stone-200">
          <div className="h-2 w-2/3 rounded-full bg-pink" />
        </div>
      </div>

      <button type="button" className="mx-5 my-5 rounded-full bg-pink py-3 text-base font-semibold text-white">
        שלחו לי מתנה
      </button>
    </div>
  );
}

export default function GiftCollage() {
  return (
    <section id="solution" aria-label="הפתרון שלנו" className="relative overflow-hidden py-20 sm:py-28">
      <div className="relative flex items-center justify-center">
        <div
          className="pointer-events-none absolute inset-x-[-10%] top-1/2 flex -translate-y-1/2 -rotate-6 justify-center gap-6 opacity-70"
          aria-hidden="true"
        >
          {[...COLLAGE_CARDS, ...COLLAGE_CARDS].map((card, i) => (
            <CollageCard key={i} {...card} />
          ))}
        </div>
        <div className="relative z-10">
          <PhoneMockup />
        </div>
      </div>

      <div className="relative z-10 mt-20">
        <BridgeHeading tagline="ככה זה עובד" />
      </div>
    </section>
  );
}
