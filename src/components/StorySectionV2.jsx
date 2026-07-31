import { useEffect, useRef, useState } from 'react';
import PhotoFrame from './PhotoFrame';
import BridgeHeading from './BridgeHeading';
import useInView from '../hooks/useInView';

// Duplicated from ProblemSection.jsx as the starting point for this rewrite
// (see PR notes) — ProblemSection.jsx itself is untouched. Same buyer photo;
// same four business photos, since no flowers/pottery/jewelry/bakery
// photography exists anywhere in this repo (checked public/images — still
// only buyer-photo + business-photo-1..4). The story concept (frustration →
// discovery → thriving businesses) is told through composition and motion
// instead, not through swapping in different subject matter.
const buyerPhoto = '/images/buyer-photo.jpg';

// Six failed-search UI cards forming a "messy cloud" around the buyer photo,
// not a tidy ring. depth:'back' cards sit at -z-10 — genuinely behind the
// photo (PhotoFrame is itself position:relative, so it participates in the
// same stacking context), not just visually layered — so the photo's own
// rounded edge crops them for real, matching "some partially cropped."
const SEARCH_CARDS = [
  {
    icon: '🔍',
    title: 'מתנה לאבא...',
    subtitle: 'יותר מדי תוצאות',
    rotate: '-7deg',
    size: 'lg',
    depth: 'front',
    position: 'top-[0%] right-[2%]',
  },
  {
    icon: '🔍',
    title: 'מתנה בעבודת יד',
    subtitle: 'שום דבר בקרבת מקום',
    rotate: '5deg',
    size: 'md',
    depth: 'back',
    position: 'top-[10%] -right-[3%]',
  },
  {
    icon: '📦',
    title: 'משלוח',
    subtitle: 'לא יגיע עד מחר',
    rotate: '-4deg',
    size: 'sm',
    depth: 'front',
    position: 'top-[40%] -left-[5%]',
  },
  {
    icon: '💳',
    title: 'כרטיס מתנה',
    subtitle: 'גנרי מדי',
    rotate: '6deg',
    size: 'md',
    depth: 'back',
    position: 'bottom-[32%] -right-[2%]',
  },
  {
    icon: '⭐',
    title: 'דירוג 3.8',
    subtitle: 'לא בטוחה...',
    rotate: '-8deg',
    size: 'sm',
    depth: 'front',
    position: 'bottom-[8%] right-[6%]',
  },
  {
    icon: '💸',
    title: 'מעל התקציב',
    subtitle: '',
    rotate: '4deg',
    size: 'sm',
    depth: 'back',
    position: 'bottom-[0%] left-[0%]',
  },
];

const CARD_SIZE_CLASSES = {
  sm: 'w-32 gap-0.5 p-2.5 text-[11px]',
  md: 'w-40 gap-1 p-3 text-xs',
  lg: 'w-48 gap-1 p-3.5 text-sm',
};

// Editorial collage, absolute-positioned rather than gridded so sizes,
// overlap and depth read as art-directed. business-photo-2 (vegetable
// market) is the large anchor photo; the other three are smaller, rotated,
// and overlap its corners at increasing z so the stack reads as a pile of
// discoveries rather than four tiles.
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

// A floating UI card, not a paper sticky note: white surface, generous
// radius, a soft diffuse shadow (vs. the tight "resting on paper" shadow
// used for ProblemSection's stickers). Two elements deep on purpose — the
// outer div owns the one-shot "arrives and settles" entrance (opacity/
// scale/rotate via the animate-card-enter keyframe, index.css), the inner
// div owns the *separate*, continuous animate-card-float loop. They have to
// be different elements: both animate `transform`, and a single element
// can't run a one-shot entrance and an infinite loop on the same property
// without one silently overriding the other once the entrance's
// fill-mode:both takes hold.
function SearchCard({ icon, title, subtitle, rotate, position, size, depth, index, inView, reducedMotion }) {
  const playEntrance = inView && !reducedMotion;
  return (
    <div
      className={`absolute ${position} ${depth === 'back' ? '-z-10' : 'z-20'} ${playEntrance ? 'animate-card-enter' : ''}`}
      style={{
        '--card-rotate': rotate,
        transform: `rotate(${rotate})`,
        opacity: reducedMotion || inView ? undefined : 0,
        animationDelay: playEntrance ? `${index * 130}ms` : undefined,
      }}
    >
      <div
        className={!reducedMotion ? 'animate-card-float' : ''}
        style={{
          animationDelay: `${(index % 3) * 900 + 500}ms`,
          animationDuration: `${5.5 + (index % 3) * 0.7}s`,
        }}
      >
        <div
          className={`${CARD_SIZE_CLASSES[size]} ${depth === 'back' ? 'opacity-85' : ''} flex flex-col rounded-2xl bg-cloud shadow-[0_14px_30px_rgba(31,40,52,0.16)] ring-1 ring-ink/[0.06]`}
        >
          <p className="font-semibold whitespace-nowrap text-ink">
            {icon} {title}
          </p>
          {subtitle && <p className="whitespace-nowrap text-ink/45">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}

// Same two-element split as SearchCard, same reason: the outer div owns the
// one-shot animate-collage-enter (opacity/scale/rotate), the inner div owns
// the continuous scroll-driven parallax translateY — a *value this
// component computes every frame from scroll position*, not a CSS
// animation, so it has to live on an element with no competing `transform`
// animation of its own or the parallax offset would be silently discarded
// once the entrance's fill-mode:both locks its own transform in.
function CollagePhoto({ src, alt, box, rotate, z, index, inView, reducedMotion, parallax }) {
  const playEntrance = inView && !reducedMotion;
  return (
    <div
      className={`absolute ${box} ${playEntrance ? 'animate-collage-enter' : ''}`}
      style={{
        zIndex: z,
        '--collage-rotate': rotate,
        transform: `rotate(${rotate})`,
        opacity: reducedMotion || inView ? undefined : 0,
        animationDelay: playEntrance ? `${350 + index * 150}ms` : undefined,
      }}
    >
      <div
        className="h-full w-full"
        style={
          reducedMotion
            ? undefined
            : { transform: `translateY(${parallax}px)`, transition: 'transform 120ms linear' }
        }
      >
        <PhotoFrame
          src={src}
          alt={alt}
          gradient="from-amber-100 via-stone-100 to-stone-200"
          className="h-full w-full shadow-[0_18px_36px_rgba(31,40,52,0.18)]"
        />
      </div>
    </div>
  );
}

export default function StorySectionV2() {
  // One shared IntersectionObserver (via useInView) drives every phase of
  // the story in sequence: the frustration cards stagger in first, the
  // transition line fades in as their tail overlaps it, then the discovery
  // collage staggers in last — animationDelay offsets below encode that
  // order, all keyed off this single inView flip so the section only tells
  // its story once, the moment it's actually seen.
  const [ref, inView] = useInView({ threshold: 0.15 });
  const [reducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  // Gentle scroll-linked parallax for the collage only (not a CSS
  // scroll-timeline — Safari/Firefox support for animation-timeline:view()
  // is still inconsistent, so a plain rAF-throttled scroll listener reaches
  // every browser). Range is deliberately small (±14px) per "gentle
  // parallax... no dramatic motion."
  const collageRef = useRef(null);
  const [parallax, setParallax] = useState(0);

  useEffect(() => {
    if (reducedMotion) return undefined;
    let raf = null;
    function measure() {
      raf = null;
      const node = collageRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const viewportMid = window.innerHeight / 2;
      const elementMid = rect.top + rect.height / 2;
      const distance = (viewportMid - elementMid) / viewportMid;
      setParallax(Math.max(-14, Math.min(14, distance * 14)));
    }
    function onScroll() {
      if (raf) return;
      raf = requestAnimationFrame(measure);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    measure();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reducedMotion]);

  const revealClassName = reducedMotion
    ? ''
    : `transition-all duration-700 ease-out ${inView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`;
  const playTransition = inView && !reducedMotion;

  return (
    <section
      id="story-v2"
      aria-label="הסיפור של Wrappit"
      className="mx-auto max-w-[1820px] px-4 py-24 sm:px-8 sm:py-32"
    >
      {/* flex-col (mobile): DOM order alone gives the requested vertical
          narrative — frustration, then transition, then discovery — top to
          bottom, no reordering needed. lg:grid-cols-[1fr_auto_1fr]: under
          dir="rtl" (set on the page root), grid column 1 renders on the
          *right*, so this same DOM order places frustration on the right
          and discovery on the left with zero order-* overrides either. */}
      <div
        ref={ref}
        className={`flex flex-col gap-16 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-8 xl:gap-14 ${revealClassName}`}
      >
        <div className="relative mx-auto w-full max-w-sm px-8 py-12 sm:max-w-md">
          <PhotoFrame
            src={buyerPhoto}
            alt="קונה מתנות מביטה בטלפון בתסכול, מוקפת באפשרויות מתנה אינסופיות"
            className="aspect-[3/4] w-full shadow-[0_20px_40px_rgba(31,40,52,0.18)]"
            gradient="from-rose-200 via-rose-100 to-amber-100"
          />
          {SEARCH_CARDS.map((card, index) => (
            <SearchCard
              key={card.title + card.subtitle}
              {...card}
              index={index}
              inView={inView}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>

        <div
          className={`mx-auto flex max-w-xs flex-col items-center gap-2 text-center ${playTransition ? 'animate-transition-enter' : ''}`}
          style={{
            opacity: reducedMotion || inView ? undefined : 0,
            animationDelay: playTransition ? '650ms' : undefined,
          }}
        >
          <p className="text-lg font-semibold text-ink/70">ואז גילית את</p>
          <p className="font-logo text-4xl leading-none text-pink sm:text-5xl">Wrappit</p>
          <p className="text-base text-ink/60">והכל נהיה פשוט</p>
        </div>

        <div ref={collageRef} className="relative mx-auto aspect-[4/5] w-full max-w-sm sm:max-w-md">
          {COLLAGE_PHOTOS.map((photo, index) => (
            <CollagePhoto
              key={photo.src}
              {...photo}
              index={index}
              inView={inView}
              reducedMotion={reducedMotion}
              parallax={parallax}
            />
          ))}
        </div>
      </div>

      <div className="mt-16">
        <BridgeHeading tagline="פתרון פשוט כל כך" />
      </div>
    </section>
  );
}
