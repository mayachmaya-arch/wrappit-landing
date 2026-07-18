const GIFT_IDEAS = [
  'שיעור גיטרה',
  'סיור צילום',
  'יצירת אמנות',
  'שיעור בישול',
  'סל ירקות אורגניים',
  'ספא',
  'סדנת קרמיקה',
  'כרטיסיית 10 ניקובי קפה',
  'תספורת',
];

function GiftIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-6 shrink-0 fill-cloud"
      aria-hidden="true"
      style={{ transform: 'rotate(-2.7deg)' }}
    >
      <path d="M20 7h-2.18a3 3 0 0 0 .18-1 3 3 0 0 0-5.5-1.65L12 5.1l-.5-.75A3 3 0 0 0 6 5a3 3 0 0 0 .18 2H4a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1ZM9 5a1 1 0 0 1 1.8-.6l.9 1.34L10.2 7H9a1 1 0 0 1 0-2Zm5.8-.6A1 1 0 0 1 15 4a1 1 0 0 1 1 1 1 1 0 0 1-1 1h-1.2ZM5 9h6v2H5Zm2 4h4v7H7Zm10 7h-4v-7h4Zm2-9h-6V9h6Z" />
    </svg>
  );
}

function MarqueeRow({ ariaHidden = false }) {
  return (
    <div className="flex shrink-0 items-center gap-8 px-4" aria-hidden={ariaHidden}>
      {GIFT_IDEAS.map((idea, i) => (
        <span key={i} className="flex shrink-0 items-center gap-8">
          <span className="text-2xl font-black whitespace-nowrap text-cloud sm:text-3xl">{idea}</span>
          <GiftIcon />
        </span>
      ))}
    </div>
  );
}

export default function Marquee() {
  return (
    <section aria-label="רעיונות למתנה" className="relative -my-8 overflow-hidden py-6 sm:-my-10 sm:py-10">
      <div className="-mx-[10%] w-[120%] -rotate-[2.7deg]">
        <div className="flex w-max animate-marquee items-center gap-8 bg-purple py-6 sm:py-10">
          <MarqueeRow />
          <MarqueeRow ariaHidden />
        </div>
      </div>
    </section>
  );
}
