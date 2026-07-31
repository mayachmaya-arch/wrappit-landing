import { useState } from 'react';
import PhotoFrame from './PhotoFrame';
import BridgeHeading from './BridgeHeading';
import useInView from '../hooks/useInView';

// Same assets/text as the previous StorySectionV2 iteration and, before
// that, ProblemSection.jsx — still no flowers/pottery/jewelry/bakery/café
// photography anywhere in this repo (checked public/images again). This
// revision changes the SEQUENCE (buyer only → problems attach → layout
// shifts open → businesses reveal) and the label styling, reusing the same
// buyer photo, the same four business photos, and the same problem
// concepts from the prior iteration's search cards (condensed to one line
// each per the new spec) rather than introducing new subject matter.
const buyerPhoto = '/images/buyer-photo.jpg';

// Six anchors in a balanced ring around the photo's edges — two top
// corners, two mid-height edges, two bottom corners — deliberately leaving
// the upper-center clear (that's where the buyer's face sits in the
// photo). Each overlaps the photo edge slightly (small, not extreme,
// negative offsets) so it reads as physically attached rather than
// floating nearby, and rotation is held to the -4deg..4deg range asked
// for — tighter than ProblemSection's stickers or this component's
// previous search cards.
const PROBLEM_LABELS = [
  { text: '🔍 יותר מדי תוצאות', rotate: '-3deg', position: '-top-[3%] -right-[4%]' },
  { text: '🔍 שום דבר בקרבת מקום', rotate: '3deg', position: '-top-[2%] -left-[4%]' },
  { text: '📦 לא יגיע עד מחר', rotate: '-2deg', position: 'top-[42%] -right-[6%]' },
  { text: '💳 מתנה גנרית מדי', rotate: '4deg', position: 'top-[46%] -left-[6%]' },
  { text: '⭐ דירוג 3.8 בלבד', rotate: '-4deg', position: 'bottom-[2%] -right-[3%]' },
  { text: '💸 מעל התקציב', rotate: '2deg', position: 'bottom-[0%] -left-[2%]' },
];

// Unchanged from the previous iteration: an editorial collage (varied
// size/rotation/z, not a grid) built from the same four business photos.
const COLLAGE_PHOTOS = [
  {
    src: '/images/business-photo-2.jpg',
    alt: 'שוק ירקות אורגניים',
    box: 'right-0 top-0 h-[62%] w-[58%]',
    rotate: '-2deg',
    z: 10,
  },
  {
    src: '/images/business-photo-4.jpg',
    alt: 'סטודיו יוגה מסודר עם מזרנים וציוד',
    box: 'left-0 top-[2%] h-[46%] w-[42%]',
    rotate: '3deg',
    z: 20,
  },
  {
    src: '/images/business-photo-1.jpg',
    alt: 'עגלת קפה רחוב עם בעל עסק מגיש לקוחות',
    box: 'right-[8%] bottom-0 h-[42%] w-[42%]',
    rotate: '4deg',
    z: 30,
  },
  {
    src: '/images/business-photo-3.jpg',
    alt: 'מדריך רוכב אופניים בטבע, בעל עסק סיורי אופניים',
    box: 'left-0 bottom-[0%] h-[36%] w-[38%]',
    rotate: '-5deg',
    z: 25,
  },
];

// Stage-2 timing: labels start once the buyer photo has mostly settled in
// (Stage 1) and stagger on one at a time. Paper-label styling per the
// brief — soft pale yellow, small consistent radius/padding, a much
// lighter shadow than a UI card, and no continuous motion once attached
// (animate-label-attach is a one-shot "settle," nothing loops).
const LABEL_STAGGER_MS = 150;
const LABEL_START_MS = 350;

function ProblemLabel({ text, rotate, position, index, inView, reducedMotion }) {
  const play = inView && !reducedMotion;
  return (
    <p
      className={`absolute ${position} z-20 rounded-lg px-3 py-1.5 text-sm font-semibold whitespace-nowrap text-ink shadow-[0_2px_5px_rgba(31,40,52,0.14)] ${play ? 'animate-label-attach' : ''}`}
      style={{
        backgroundColor: '#FFF58A',
        '--label-rotate': rotate,
        transform: `rotate(${rotate})`,
        opacity: reducedMotion || inView ? undefined : 0,
        animationDelay: play ? `${LABEL_START_MS + index * LABEL_STAGGER_MS}ms` : undefined,
      }}
    >
      {text}
    </p>
  );
}

// Stage-4b timing: collage photos start staggering in only once the layout
// shift (Stage 3) is well underway, so the business side's photos arrive
// as the column actually has room for them rather than appearing early
// and getting clipped by the still-narrow track.
const COLLAGE_STAGGER_MS = 160;
const COLLAGE_START_MS = 2000;

function CollagePhoto({ src, alt, box, rotate, z, index, inView, reducedMotion }) {
  const play = inView && !reducedMotion;
  return (
    <div
      className={`absolute ${box} ${play ? 'animate-collage-enter' : ''}`}
      style={{
        zIndex: z,
        '--collage-rotate': rotate,
        transform: `rotate(${rotate})`,
        opacity: reducedMotion || inView ? undefined : 0,
        animationDelay: play ? `${COLLAGE_START_MS + index * COLLAGE_STAGGER_MS}ms` : undefined,
      }}
    >
      <PhotoFrame
        src={src}
        alt={alt}
        gradient="from-amber-100 via-stone-100 to-stone-200"
        className="h-full w-full shadow-[0_18px_36px_rgba(31,40,52,0.18)]"
      />
    </div>
  );
}

export default function StorySectionV2() {
  // The entire 4-stage sequence is keyed off this single inView flip, the
  // same pattern as every other scroll-entrance animation in this
  // codebase — no scroll-jacking, no setTimeout state machine: every
  // stage's start time is just a CSS animation-delay/transition-delay
  // computed against t=0 (the moment inView becomes true), so the browser
  // owns the timing and the user can keep scrolling through the section
  // at any point without anything fighting their scroll position.
  const [ref, inView] = useInView({ threshold: 0.15 });
  const [reducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  const play = inView && !reducedMotion;
  // Under reduced motion, per useInView's own contract, skip the animation
  // (not the content) — render the fully-settled two-sided layout
  // immediately regardless of scroll position, rather than withholding the
  // business side until some hidden trigger the user has opted out of ever
  // seeing play.
  const settled = reducedMotion || inView;

  return (
    <section
      id="story-v2"
      aria-label="הסיפור של Wrappit"
      className="mx-auto max-w-[1820px] px-4 py-24 sm:px-8 sm:py-32"
    >
      {/* Mobile (base): flex-col, so DOM order alone gives the requested
          vertical sequence (buyer heading → image/labels → business
          heading → collage) with no shift/collapse mechanics needed —
          the business block is simply further down the page until its own
          opacity/translate delay fires.
          Below lg: a single-column grid whose *second row* animates from
          0fr to 1fr — the well-known CSS "0fr/1fr" trick for animating an
          element's height without knowing its pixel height up front (the
          element's own min-height:auto would otherwise block a 0-height
          row; see the business wrapper's min-h-0 below). Without this the
          business block, though invisible, would still reserve its full
          layout height and leave a dead gap under the buyer photo during
          Stage 1-2 — this keeps that space genuinely collapsed instead.
          lg+: the same trick applied to *columns* instead of rows for
          Stage 3's "shift" — the second track animates 0fr to 1fr, so
          while it's 0fr the business column has zero width (genuinely not
          there, not just transparent), and the single 1fr buyer column
          spans the full section width on its own, which is what actually
          centers the buyer composition during Stage 1-2 (no
          transform-based fake-centering needed). As the second track
          grows, the grid reflows and the buyer column narrows/shifts
          right by itself. grid-template-rows is pinned to a single fixed
          row at lg+ since the reveal there is column-driven, not
          row-driven. */}
      <div
        ref={ref}
        className={`grid grid-cols-1 gap-16 transition-[grid-template-rows] duration-[800ms] delay-[1650ms] ease-out lg:items-center lg:gap-8 lg:transition-[grid-template-columns] lg:duration-[1000ms] lg:delay-[1650ms] lg:ease-out xl:gap-14 ${
          settled
            ? '[grid-template-rows:auto_1fr] lg:[grid-template-columns:1fr_1fr] lg:[grid-template-rows:1fr]'
            : '[grid-template-rows:auto_0fr] lg:[grid-template-columns:1fr_0fr] lg:[grid-template-rows:1fr]'
        }`}
      >
        {/* Stage 1 + 2: buyer heading/photo, then the six problem labels */}
        <div
          className={`flex flex-col items-center gap-8 ${play ? 'animate-buyer-enter' : ''}`}
          style={{ opacity: settled ? undefined : 0, animationDelay: play ? '0ms' : undefined }}
        >
          <hgroup className="flex flex-col items-center gap-2 text-center">
            <p className="text-xl font-bold text-pink">מצד אחד</p>
            <h2 className="text-3xl sm:text-4xl">קונה מתנה</h2>
          </hgroup>
          <div className="relative w-full max-w-sm px-8 py-10 sm:max-w-md">
            <PhotoFrame
              src={buyerPhoto}
              alt="קונה מתנות מביטה בטלפון בתסכול, מוקפת באפשרויות מתנה אינסופיות"
              className="aspect-[3/4] w-full shadow-[0_20px_40px_rgba(31,40,52,0.18)]"
              gradient="from-rose-200 via-rose-100 to-amber-100"
            />
            {PROBLEM_LABELS.map((label, index) => (
              <ProblemLabel
                key={label.text}
                {...label}
                index={index}
                inView={inView}
                reducedMotion={reducedMotion}
              />
            ))}
          </div>
        </div>

        {/* Stage 3 + 4: business side. overflow-hidden + min-h-0/lg:min-w-0
            on this outer element is what lets its grid track actually
            collapse to 0fr — a grid item's default min-height/min-width is
            auto, i.e. "at least my content's size," which would otherwise
            block the track from ever reaching 0 (below lg: the row; at
            lg+: the column). The inner content below keeps its own
            natural size/animations regardless of the outer track's
            current animated size. */}
        <div className="min-h-0 overflow-hidden lg:min-w-0">
          <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-8 sm:max-w-md">
            <hgroup
              className={`flex flex-col items-center gap-2 text-center ${play ? 'animate-transition-enter' : ''}`}
              style={{ opacity: settled ? undefined : 0, animationDelay: play ? '1700ms' : undefined }}
            >
              <p className="text-xl font-bold text-pink">מצד שני</p>
              <h2 className="text-3xl sm:text-4xl">בעלי עסקים</h2>
            </hgroup>
            <div className="relative aspect-[4/5] w-full">
              {COLLAGE_PHOTOS.map((photo, index) => (
                <CollagePhoto
                  key={photo.src}
                  {...photo}
                  index={index}
                  inView={inView}
                  reducedMotion={reducedMotion}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <BridgeHeading tagline="פתרון פשוט כל כך" />
      </div>
    </section>
  );
}
