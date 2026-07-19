import PhotoFrame from './PhotoFrame';

// Plain /public paths (not ES imports) — dropping a real photo in with the
// exact same filename replaces the placeholder automatically, no code change.
// See README.md → "העלאת נכסים בעצמך" for the full checklist.
const businessPhoto1 = '/images/business-photo-1.jpg';
const businessPhoto2 = '/images/business-photo-2.jpg';
const businessPhoto3 = '/images/business-photo-3.jpg';
const businessPhoto4 = '/images/business-photo-4.jpg';
const buyerPhoto = '/images/buyer-photo.jpg';

const BUYER_NOTES = [
  { text: 'שוברים את הראש', rotate: '-6deg', position: 'top-[6%] left-[8%]' },
  { text: 'מסתובבים בין מלא אתרים', rotate: '4deg', position: 'top-[30%] -left-[6%]' },
  { text: 'בזבוז של מלא זמן יקר', rotate: '-4deg', position: 'top-[8%] right-[2%]' },
  { text: 'לא רוצה לקנות מתנה גנרית', rotate: '5deg', position: 'bottom-[10%] right-[0%]' },
  { text: 'טוב יאללה, גיפט קארד', rotate: '0deg', position: 'bottom-[32%] left-[18%]' },
];

const BUSINESS_NOTES = [
  { text: 'לא לדעת שהמוצר שלך הוא מתנה מושלמת', rotate: '-5deg', position: 'top-[4%] right-[2%]' },
  { text: 'להוציא מלא כסף על שיווק', rotate: '3deg', position: 'top-[38%] left-[4%]' },
  { text: 'לפספס לקוחות', rotate: '-8deg', position: 'bottom-[24%] right-[6%]' },
  { text: 'לפרסם בכל מקום ואף אחד לא רואה', rotate: '2deg', position: 'bottom-[2%] left-[2%]' },
];

function StickyNote({ text, rotate, position }) {
  return (
    <p
      className={`absolute ${position} z-10 rounded-lg bg-cream px-4 py-2 text-base font-semibold whitespace-nowrap text-ink shadow-sm sm:text-lg`}
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
          <div className="relative grid w-full max-w-md grid-cols-2 gap-4 px-6 py-10">
            <PhotoFrame
              src={businessPhoto1}
              alt="בעל עסק קטן מאחורי הדלפק"
              className="aspect-[3/4] w-full -rotate-3 shadow-[10px_10px_16px_rgba(0,0,0,0.08)]"
              gradient="from-amber-100 via-stone-100 to-stone-200"
            />
            <PhotoFrame
              src={businessPhoto2}
              alt="בעלת עסק אופנה מסדרת מוצרים"
              className="mt-8 aspect-[3/4] w-full rotate-2 shadow-[10px_10px_16px_rgba(0,0,0,0.08)]"
              gradient="from-emerald-100 via-stone-100 to-stone-200"
            />
            <PhotoFrame
              src={businessPhoto3}
              alt="שוק ירקות אורגניים"
              className="aspect-[3/4] w-full rotate-1 shadow-[10px_10px_16px_rgba(0,0,0,0.08)]"
              gradient="from-lime-100 via-stone-100 to-amber-100"
            />
            <PhotoFrame
              src={businessPhoto4}
              alt="סטודיו קרמיקה של בעלת עסק"
              className="mt-4 aspect-[3/4] w-full -rotate-2 shadow-[10px_10px_16px_rgba(0,0,0,0.08)]"
              gradient="from-stone-200 via-stone-100 to-rose-100"
            />
            {BUSINESS_NOTES.map((note) => (
              <StickyNote key={note.text} {...note} />
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-16 flex max-w-sm flex-col items-center gap-4 text-center">
        <p className="font-logo text-4xl leading-none text-pink sm:text-5xl">Wrappit</p>
        <p className="text-xl font-bold sm:text-2xl">פתרון פשוט כל כך</p>
      </div>
    </section>
  );
}
