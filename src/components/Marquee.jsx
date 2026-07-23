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

// Same outline ribbon/bow glyph as GiftRibbonIcon in Pricing.jsx (kept as a
// local copy — every icon in this project is a small component-local inline
// SVG, not a shared import, matching the existing convention — no new icon
// dependency added).
function RibbonIcon() {
  return (
    <svg
      viewBox="0 0 48 60"
      className="h-6 w-auto shrink-0 text-cloud"
      fill="none"
      aria-hidden="true"
      style={{ transform: 'rotate(-2.7deg)' }}
    >
      <path
        d="M24 60V22M24 22c-8-6-16-4-16-14 0-5 4-8 8-8s8 6 8 14M24 22c8-6 16-4 16-14 0-5-4-8-8-8s-8 6-8 14"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MarqueeItem({ idea, ariaHidden = false }) {
  return (
    <span className="me-8 flex shrink-0 items-center gap-8" aria-hidden={ariaHidden}>
      <span className="text-2xl font-black whitespace-nowrap text-cloud sm:text-3xl">{idea}</span>
      <RibbonIcon />
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
    // The purple background lives here, on this stationary band — never on
    // the moving track. Previously bg-purple was on the animated element
    // itself: since that element's own width is finite (even duplicated),
    // translating it eventually slides its trailing edge past the viewport,
    // exposing whatever sits behind (no purple) before the loop resets — a
    // real gap during playback, not just at rest. A band that never moves,
    // sized once to 120vw, is always fully purple; only the content inside
    // it slides.
    //
    // There is no separate light-background filler here anymore — the hero's
    // video/gradient layer (App.jsx) is itself clipped to stop short of the
    // hero's bottom edge, so wherever this band's rotation recedes from that
    // edge, the page's real cream background already shows through on its
    // own; nothing needs to be painted over it.
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
