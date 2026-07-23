import PhotoFrame from './PhotoFrame';
import BridgeHeading from './BridgeHeading';

// Plain /public paths (not ES imports) — dropping a real photo in with the
// exact same filename replaces the placeholder automatically, no code change.
// See README.md → "העלאת נכסים בעצמך" for the full checklist.
const buyerPhoto = '/images/buyer-photo.jpg';

const BUYER_NOTES = [
  { text: 'שוברים את הראש', rotate: '-6deg', position: 'top-[4%] left-[4%]' },
  { text: 'מסתובבים בין מלא אתרים', rotate: '4deg', position: 'top-[28%] -left-[8%]' },
  { text: 'בזבוז של מלא זמן יקר', rotate: '-4deg', position: 'top-[6%] -right-[4%]' },
  { text: 'לא רוצה לקנות מתנה גנרית', rotate: '5deg', position: 'bottom-[8%] -right-[2%]' },
  { text: 'טוב יאללה, גיפט קארד', rotate: '0deg', position: 'bottom-[26%] left-[10%]' },
];

const BUSINESS_NOTES = [
  { text: 'לא לדעת שהמוצר שלך הוא מתנה מושלמת', rotate: '-5deg', position: 'top-[2%] -right-[4%]' },
  { text: 'להוציא מלא כסף על שיווק', rotate: '3deg', position: 'top-[42%] -left-[6%]' },
  { text: 'לפספס לקוחות', rotate: '-8deg', position: 'bottom-[20%] -right-[2%]' },
  { text: 'לפרסם בכל מקום ואף אחד לא רואה', rotate: '2deg', position: 'bottom-0 left-[6%]' },
];

// Business photos cascade like a fanned hand of cards rather than a grid —
// each item overlaps the previous one via negative margin-inline-start (so
// the fan follows RTL flow), rotates a bit further, and staggers vertically;
// the array order is also the visual stacking order (later entries on top).
const BUSINESS_PHOTOS = [
  {
    src: '/images/business-photo-1.jpg',
    alt: 'בעל עסק קטן מאחורי הדלפק',
    className: 'translate-y-6 rotate-[-8deg]',
  },
  {
    src: '/images/business-photo-2.jpg',
    alt: 'שוק ירקות אורגניים',
    className: '-ms-8 -translate-y-2 rotate-[-3deg] sm:-ms-10',
  },
  {
    src: '/images/business-photo-3.jpg',
    alt: 'בעלת עסק אופנה מסדרת מוצרים',
    className: '-ms-8 translate-y-5 rotate-[4deg] sm:-ms-10',
  },
  {
    src: '/images/business-photo-4.jpg',
    alt: 'סטודיו קרמיקה של בעלת עסק',
    className: '-ms-8 -translate-y-1 rotate-[9deg] sm:-ms-10',
  },
];

function StickyNote({ text, rotate, position }) {
  return (
    <p
      className={`absolute ${position} z-50 rounded-lg bg-cream px-4 py-2 text-base font-semibold whitespace-nowrap text-ink shadow-sm sm:text-lg`}
      style={{ transform: `rotate(${rotate})` }}
    >
      {text}
    </p>
  );
}

export default function ProblemSection() {
  return (
    <section id="problem" aria-label="הבעיה" className="mx-auto max-w-[1820px] px-4 py-24 sm:px-8 sm:py-32">
      <div className="grid gap-20 lg:grid-cols-2 lg:gap-12">
        <div className="flex flex-col items-center gap-10">
          <hgroup className="flex flex-col items-center gap-2 text-center">
            <p className="text-xl font-bold">מצד אחד</p>
            <h2 className="text-3xl sm:text-4xl">קוני מתנה</h2>
          </hgroup>
          <div className="relative w-full max-w-md px-6 py-10">
            <PhotoFrame
              src={buyerPhoto}
              alt="קונה מתנות מביטה בטלפון בתסכול, מוקפת באפשרויות מתנה אינסופיות"
              className="aspect-[3/4] w-full shadow-[20px_16px_20px_7px_rgba(0,0,0,0.1)]"
              gradient="from-rose-200 via-rose-100 to-amber-100"
            />
            {BUYER_NOTES.map((note) => (
              <StickyNote key={note.text} {...note} />
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-10">
          <hgroup className="flex flex-col items-center gap-2 text-center">
            <p className="text-xl font-bold">מצד שני</p>
            <h2 className="text-3xl sm:text-4xl">בעלי עסקים</h2>
          </hgroup>
          <div className="relative w-full max-w-md px-6 py-14">
            <div className="flex items-center justify-center">
              {BUSINESS_PHOTOS.map((photo, i) => (
                <PhotoFrame
                  key={photo.src}
                  src={photo.src}
                  alt={photo.alt}
                  gradient="from-amber-100 via-stone-100 to-stone-200"
                  className={`aspect-[3/4] w-[30%] shrink-0 shadow-[10px_10px_20px_rgba(0,0,0,0.12)] ${photo.className}`}
                  style={{ zIndex: (i + 1) * 10 }}
                />
              ))}
            </div>
            {BUSINESS_NOTES.map((note) => (
              <StickyNote key={note.text} {...note} />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-16">
        <BridgeHeading tagline="פתרון פשוט כל כך" />
      </div>
    </section>
  );
}
