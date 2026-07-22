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

function MarqueeItem({ idea, ariaHidden = false }) {
  return (
    <span className="me-8 flex shrink-0 items-center gap-8" aria-hidden={ariaHidden}>
      <span className="text-2xl font-black whitespace-nowrap text-cloud sm:text-3xl">{idea}</span>
      <GiftIcon />
    </span>
  );
}

// Rendered twice back-to-back. Each item owns its own trailing spacing (`me-8`
// per item, no container `gap`) instead of a flex `gap` between items — a flex
// `gap` doesn't add space after the last child, so the seam between the two
// copies would be half a gap narrower than every other gap, and translateX(-50%)
// would land 16px short of the true repeat distance (a visible hitch once a
// loop). With every item's spacing identical including the seam, one copy's
// width is exactly half the track, so -50% is a perfect, jump-free loop point.
const LOOP_ITEMS = [...GIFT_IDEAS, ...GIFT_IDEAS];

export default function Marquee() {
  return (
    // The purple background lives here, on this stationary band — never on the
    // moving track. Previously bg-purple was on the animated element itself:
    // since that element's own width is finite (even duplicated), translating
    // it eventually slides its trailing edge past the viewport, exposing
    // whatever sits behind (no purple) before the loop resets — a real gap
    // during playback, not just at rest. A band that never moves, sized once
    // to 120vw, is always fully purple; only the content inside it slides.
    <div
      aria-label="רעיונות למתנה"
      className="absolute bottom-0 left-[-10vw] w-[120vw] -rotate-[2.7deg] overflow-hidden bg-purple py-6 sm:py-10 lg:py-16"
    >
      <div className="flex w-max animate-marquee items-center">
        {LOOP_ITEMS.map((idea, i) => (
          <MarqueeItem key={i} idea={idea} ariaHidden={i >= GIFT_IDEAS.length} />
        ))}
      </div>
    </div>
  );
}
