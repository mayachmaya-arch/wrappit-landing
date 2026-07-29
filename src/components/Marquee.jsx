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

// Exact supplied Ribbon.svg (src/assets/icons/Ribbon.svg), inlined so its
// color can follow the surrounding text via currentColor — the only edit
// versus the source file is that one attribute (fill="white" ->
// fill="currentColor"); the path `d` data is byte-identical to the supplied
// asset, untouched. Every icon in this project is a small component-local
// inline SVG rather than an imported file, so this follows the existing
// convention instead of introducing a new asset-loading pattern.
function RibbonIcon() {
  return (
    <svg
      viewBox="0 0 550 549"
      className="size-5 shrink-0 text-cloud"
      fill="none"
      aria-hidden="true"
      style={{ transform: 'rotate(-1.8deg)' }}
    >
      <path
        d="M273.478 0.0191586C287.458 -0.620896 285.196 14.9256 285.112 24.2771C285.029 32.1584 284.978 40.0406 284.974 47.9223C284.932 83.3368 285.075 118.751 285.389 154.164C285.385 164.609 284.966 175.113 284.962 185.556C284.957 191.23 284.652 197.95 285.51 203.491C289.712 196.819 292.658 187.909 296.763 180.595C319.583 139.918 353.824 81.4095 408.023 84.4146C447.274 86.5903 473.365 118.008 469.834 157.052C465.707 202.716 433.486 231.098 395.102 250.804C391.147 252.858 387.126 254.779 383.041 256.564C380.401 257.718 371.189 261.055 369.697 262.331L369.76 262.914C372.517 263.652 393.9 263.033 398.073 263.043L491.183 263.115L522.428 263.09C531.197 263.091 547.695 260.442 548.985 272.457C549.291 275.232 548.466 278.013 546.698 280.172C541.448 286.49 527.087 284.794 519.382 284.77L488.695 284.782L367.196 284.74L331.892 284.725C326.119 284.687 318.59 284.086 313.002 284.627C318.012 291.024 323.282 297.089 327.2 304.202C339.672 326.846 345.059 352.704 358.935 374.553C366.12 385.553 375.098 395.095 387.896 399.116C396.179 401.718 404.537 400.13 409.275 408.047C409.556 414.732 408.823 421.083 400.787 422.829C393.238 424.162 384.164 420.949 377.285 418.335C361.968 412.504 348.344 398.79 339.743 385.055C321.175 355.398 316.353 310.368 285.364 289.761L284.953 448.025L285.003 507.314C285.02 516.852 285.037 526.352 285.054 535.962C285.288 544.553 274.899 552.344 267.843 545.709C262.138 540.343 263.751 526.47 263.78 519.072C264.792 441.001 263.042 361.991 263.946 283.861C258.691 285.034 250.961 290.081 246.799 293.434C218.276 316.412 211.158 352.189 200.909 385.306C196.214 400.478 188.133 420.681 179.084 433.607C171.913 442.936 161.715 458.229 149.781 461.065C141.67 462.992 135.336 451.992 140.716 445.11C143.445 441.319 147.718 438.898 150.889 435.538C166.613 418.875 174.497 399.121 181.054 377.531C188.641 352.553 195.535 326.901 209.183 304.361C213.272 297.608 219.296 290.812 224.42 284.707C220.114 284.217 216.591 284.587 212.298 284.615C168.637 284.889 124.9 284.858 81.2439 284.833L36.2781 284.834C28.1606 284.847 19.6527 285.014 11.5469 284.639C8.45302 284.496 5.06375 283.541 2.82406 281.269C0.963946 279.352 -0.051993 276.77 0.00205094 274.1C0.0791369 268.398 4.47597 263.453 10.2809 263.248C16.7037 263.022 23.2024 263.122 29.6391 263.112L70.9659 263.096L136.785 263.096C151.647 263.083 168.035 262.882 182.802 263.429C175.755 259.585 165.619 256.534 157.619 252.965C108.363 230.987 64.7454 182.99 83.011 125.495C93.4566 92.6159 137.557 75.6423 169.338 88.6424C215.537 107.541 244.272 163.215 264.296 206.301L263.926 70.6057L263.942 32.9455C263.931 26.0327 263.807 19.0842 264.057 12.1789C264.303 5.40894 266.482 1.38765 273.478 0.0191586ZM336.53 248.57C367.686 240.488 395.4 231.014 419.749 208.787C427.566 201.652 432.548 197.302 438.136 187.984C460.328 150.998 447.399 101.712 397.21 106.425C369.949 111.935 350.162 135.083 335.428 157.315C319.483 181.584 306.382 207.605 296.386 234.866C294.396 240.211 291.216 248.315 289.947 253.789C306.554 252.795 320.057 252.418 336.53 248.57ZM224.054 250.279C232.465 251.647 249.957 254.121 258.49 253.737C257.214 246.915 252.407 234.207 249.429 227.499C231.033 186.063 194.632 102.02 139.412 106.445C109.609 110.813 95.8052 131.907 100.748 160.979C109.914 214.891 176.549 243.063 224.054 250.279Z"
        fill="currentColor"
      />
    </svg>
  );
}

function MarqueeItem({ idea, ariaHidden = false }) {
  return (
    <span className="me-6 flex shrink-0 items-center gap-5" aria-hidden={ariaHidden}>
      <span className="text-xl font-black whitespace-nowrap text-cloud sm:text-2xl">{idea}</span>
      <RibbonIcon />
    </span>
  );
}

// Rendered twice back-to-back. Each item owns its own trailing spacing (`me-6`
// per item, no container `gap`) instead of a flex `gap` between items — a flex
// `gap` doesn't add space after the last child, so the seam between the two
// copies would be narrower than every other gap, and the loop would land short
// of the true repeat distance (a visible hitch once a loop). With every item's
// spacing identical including the seam, one copy's width is exactly half the
// track, so translating by half its width is a perfect, jump-free loop point.
const LOOP_ITEMS = [...GIFT_IDEAS, ...GIFT_IDEAS];

export default function Marquee() {
  return (
    // Outer clip wrapper — this, not the band itself, is the flex child
    // hero-viewport reserves space for. It exists to crop the band's
    // rotation asymmetrically: the band is rotated -1.8deg around its own
    // center, and for a box this wide (~120% of viewport) that swings its
    // far corners vertically by about (width/2)*sin(1.8deg) ≈ 1.88vw —
    // upward on one side, downward on the other, in *addition* to the
    // band's own unrotated height. Left unclipped, that upward swing rises
    // into the hero copy above it (reproduced and measured with the
    // previous, steeper -2.7deg angle: ~41-54px of real overlap with the
    // CTA button at 1440-1920px).
    //
    // The downward half of that same swing is wanted (it's what makes the
    // purple band fully mask the hero's bottom edge — see App.jsx's video
    // clip comment), so the fix can't just clip both edges evenly. Instead
    // this wrapper's padding-bottom extends its own clip box (its
    // padding-box, which is what overflow:hidden clips to) further down
    // than its layout footprint, while an equal negative margin-bottom
    // cancels that extra padding back out of hero-viewport's flex-height
    // reservation — so Hero's content still lands exactly where it did
    // before (this doesn't push it up), while the band's top edge is now
    // clipped flush at the wrapper's natural top, and its bottom-side
    // bleed still renders freely within the extended padding-box.
    <div className="relative -mb-[4vw] w-[calc(100%+20vw)] shrink-0 self-center overflow-hidden pb-[4vw]">
      {/* The purple background lives here, on this stationary band — never
          on the moving track. Previously bg-purple was on the animated
          element itself: since that element's own width is finite (even
          duplicated), translating it eventually slides its trailing edge
          past the viewport, exposing whatever sits behind (no purple)
          before the loop resets — a real gap during playback, not just at
          rest. A band that never moves is always fully purple; only the
          content inside it slides.

          There is no separate light-background filler here — the hero's
          video/gradient layer (App.jsx) is itself clipped to stop short of
          the hero's bottom edge, so wherever this band's rotation recedes
          from that edge, the page's real cream background already shows
          through on its own; nothing needs to be painted over it. */}
      <div
        aria-label="רעיונות למתנה"
        className="w-full -rotate-[1.8deg] overflow-hidden bg-purple py-4 sm:py-7 lg:py-11"
      >
        <div className="flex w-max animate-marquee items-center">
          {LOOP_ITEMS.map((idea, i) => (
            <MarqueeItem key={i} idea={idea} ariaHidden={i >= GIFT_IDEAS.length} />
          ))}
        </div>
      </div>
    </div>
  );
}
