import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import PhotoFrame from './PhotoFrame';
import WrappitLogo from './WrappitLogo';
import useInView from '../hooks/useInView';

// New section, inserted between the hero and the existing Journey scenes —
// does not replace or reorder anything else. The logo grows across its own
// scroll-scrubbed block (still `motion`/useScroll, section-local progress);
// the two product slots below it are deliberately NOT scroll-driven — each
// side auto-crossfades between its 3 products on a plain setInterval/CSS
// opacity transition, with the two sides running different interval lengths
// so they drift out of sync with each other instead of flipping in lockstep.

// Real product photography hasn't been delivered yet (pending, one image per
// message from the user) — every slot below points at a themed Lorem Picsum
// placeholder (seeded, so each stays stable across reloads) rather than a
// local /images/product-*.jpg path. Per instruction this stays true for ALL
// six products until all six real photos have arrived — swap `image` for a
// local path per item only once every product has a confirmed real photo,
// not one at a time as each arrives.
const RIGHT_PRODUCTS = [
  {
    id: 'vegetables',
    name: 'ארגז ירקות טרי מהחקלאי',
    vendor: 'חקלאי הצפון',
    price: 85,
    image: 'https://picsum.photos/seed/wrappit-vegetables/400/500',
    gradient: 'from-emerald-100 via-lime-50 to-amber-100',
  },
  {
    id: 'haircut',
    name: 'תספורת מקצועית',
    vendor: 'סלון תמר',
    price: 150,
    image: 'https://picsum.photos/seed/wrappit-haircut/400/500',
    gradient: 'from-stone-200 via-rose-100 to-stone-100',
  },
  {
    id: 'guitar',
    name: 'שיעור גיטרה',
    vendor: 'סטודיו נגן',
    price: 120,
    image: 'https://picsum.photos/seed/wrappit-guitar/400/500',
    gradient: 'from-amber-100 via-stone-100 to-rose-100',
  },
];

const LEFT_PRODUCTS = [
  {
    id: 'pottery',
    name: 'סדנת קרמיקה',
    vendor: 'סטודיו חומר',
    price: 220,
    image: 'https://picsum.photos/seed/wrappit-pottery/400/500',
    gradient: 'from-stone-200 via-amber-100 to-rose-100',
  },
  {
    id: 'flowers',
    name: 'זר פרחים',
    vendor: 'עלה פרא',
    price: 140,
    image: 'https://picsum.photos/seed/wrappit-flowers/400/500',
    gradient: 'from-rose-100 via-stone-100 to-emerald-100',
  },
  {
    id: 'massage',
    name: 'עיסוי מפנק',
    vendor: 'קליניק רוטס',
    price: 180,
    image: 'https://picsum.photos/seed/wrappit-massage/400/500',
    gradient: 'from-stone-100 via-rose-100 to-amber-100',
  },
];

// Different interval per side (not a shared timer split by index) is what
// makes the two sides visibly desynchronize over time instead of flipping
// together — "alive," per spec, rather than mechanical.
const RIGHT_INTERVAL_MS = 4200;
const LEFT_INTERVAL_MS = 4900;
const CROSSFADE_MS = 700;

const EXAMPLE_PHRASES = [
  'אחותי בת 35, אוהבת קרמיקה וצומחים וחוגגת יום הולדת.',
  'הבוס שלי, אוהב יין ואוכל טוב, פורש אחרי 20 שנה.',
  'החברה הכי טובה שלי, אוהבת קפה ותכשיטים, מתחתנת בקיץ.',
];

const TYPE_MS = 55;
const DELETE_MS = 30;
const HOLD_MS = 1400;

// Same typing→hold→deleting→next state machine as the site's earlier
// typewriter (GiftCollage.jsx, since removed) — proven pattern, just
// re-homed here. The one behavioral difference: this version only starts
// once the example box first scrolls into view (viewport-triggered, per
// spec), rather than on mount. After that first trigger it free-runs
// forever regardless of further scroll position — the spec explicitly
// calls resuming-from-where-it-left-off "not critical," so no
// pause/resume-on-visibility logic was added for it.
function useLoopingTypewriter(phrases, startTyping) {
  const [text, setText] = useState('');
  const [reducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const started = useRef(false);

  useEffect(() => {
    if (reducedMotion) {
      setText(phrases[0]);
      return undefined;
    }
    if (!startTyping || started.current) return undefined;
    started.current = true;

    let phraseIndex = 0;
    let charIndex = 0;
    let phase = 'typing';
    let timeoutId;

    function tick() {
      const phrase = phrases[phraseIndex];

      if (phase === 'typing') {
        charIndex += 1;
        setText(phrase.slice(0, charIndex));
        if (charIndex >= phrase.length) {
          phase = 'holding';
          timeoutId = setTimeout(tick, HOLD_MS);
          return;
        }
        timeoutId = setTimeout(tick, TYPE_MS);
        return;
      }

      if (phase === 'holding') {
        phase = 'deleting';
        timeoutId = setTimeout(tick, DELETE_MS);
        return;
      }

      // deleting
      charIndex -= 1;
      setText(phrase.slice(0, charIndex));
      if (charIndex <= 0) {
        phraseIndex = (phraseIndex + 1) % phrases.length;
        phase = 'typing';
        timeoutId = setTimeout(tick, TYPE_MS);
        return;
      }
      timeoutId = setTimeout(tick, DELETE_MS);
    }

    timeoutId = setTimeout(tick, TYPE_MS);
    return () => clearTimeout(timeoutId);
  }, [phrases, reducedMotion, startTyping]);

  return { text, showCaret: !reducedMotion };
}

// Scroll-scrubbed logo: scale is a pure function of scrollYProgress (a
// motion value), read straight into motion.div's style — no React
// re-render per scroll pixel, no setState in a scroll handler. offset
// ["start end", "end start"] is what makes 0 land at "this block's top
// just entered the viewport from below" and 1 at "its bottom just left the
// viewport at the top," i.e. section-local progress, not window.scrollY.
function GrowingLogo() {
  const ref = useRef(null);
  const [reducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.5, 2.4]);

  return (
    <div ref={ref} className="flex min-h-[60vh] items-center justify-center bg-cream px-4 sm:min-h-[70vh]">
      <motion.div style={reducedMotion ? undefined : { scale }}>
        <WrappitLogo className="h-10 w-auto text-pink sm:h-14 lg:h-16" />
      </motion.div>
    </div>
  );
}

// Plain setInterval index cycling — no scroll listener involved at all.
// Under reduced motion the index is simply never advanced, so the slot
// freezes on its first product instead of continuing to auto-play (the same
// "settle on a final state, don't just skip the animation" rule used
// everywhere else in this file).
function useAutoAdvance(count, intervalMs, reducedMotion) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reducedMotion || count <= 1) return undefined;
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % count);
    }, intervalMs);
    return () => clearInterval(id);
  }, [count, intervalMs, reducedMotion]);

  return index;
}

// All three products in a slot are mounted simultaneously as full-size
// absolutely-positioned layers; only `opacity` (a plain CSS transition, no
// motion/JS involved) toggles which one reads as "showing." Both the
// outgoing and incoming layer animate at once, so it's a real crossfade
// (no gap of full transparency in between) rather than a hide-then-show cut
// — the technique carried over from the site's earlier CollageLayer /
// ArrivalCrossfade components. The wrapper needs an explicit fixed size
// (h-*/w-* below) since every child is `absolute inset-0` and contributes
// nothing to normal flow.
function ProductLayer({ product, side, active }) {
  return (
    <div
      className="absolute inset-0 transition-opacity ease-in-out"
      style={{ opacity: active ? 1 : 0, transitionDuration: `${CROSSFADE_MS}ms` }}
      aria-hidden={!active}
    >
      <div className="relative h-full">
        <PhotoFrame
          src={product.image}
          alt={product.name}
          gradient={product.gradient}
          className="h-full w-full shadow-[0_16px_32px_rgba(31,40,52,0.16)]"
        />
        <span className="absolute top-2 rounded-full bg-cloud px-2.5 py-1 text-xs font-bold text-ink shadow-sm ltr:right-2 rtl:left-2">
          ₪{product.price}
        </span>
        <span
          className="absolute -bottom-4 flex flex-col items-center gap-0.5 rounded-md bg-cloud px-2 py-1 text-center shadow-sm ltr:-right-2 rtl:-left-2"
          style={{ transform: `rotate(${side === 'right' ? -4 : 4}deg)` }}
        >
          <span className="text-[11px] leading-none font-semibold whitespace-nowrap text-ink">{product.name}</span>
          <span className="text-[10px] leading-none whitespace-nowrap text-stone-500">{product.vendor}</span>
        </span>
      </div>
    </div>
  );
}

function ProductSlot({ products, side, intervalMs, reducedMotion }) {
  const activeIndex = useAutoAdvance(products.length, intervalMs, reducedMotion);

  return (
    <div className="relative mx-auto h-[220px] w-[150px] sm:h-[260px] sm:w-[170px]">
      {products.map((product, index) => (
        <ProductLayer key={product.id} product={product} side={side} active={index === activeIndex} />
      ))}
    </div>
  );
}

const RECIPIENT_OPTIONS = [
  { id: 'one', label: 'לאדם אחד' },
  { id: 'many', label: 'לכמה אנשים' },
];

function WhoIsItForCard() {
  const [ref, inView] = useInView({ threshold: 0.3 });
  const [isOpen, setIsOpen] = useState(true);
  const [recipient, setRecipient] = useState('one');
  const { text, showCaret } = useLoopingTypewriter(EXAMPLE_PHRASES, inView);

  return (
    <div
      ref={ref}
      className="relative z-10 mx-auto w-full max-w-md rounded-3xl border border-stone-200 bg-white p-6 shadow-xl sm:p-8"
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-3 text-right"
      >
        <span className="text-2xl font-black text-ink sm:text-3xl">למי המתנה?</span>
        <svg
          viewBox="0 0 20 20"
          className={`size-5 shrink-0 text-ink transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          aria-hidden="true"
        >
          <path d="M5 7.5l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-4 pt-5">
            <div className="flex flex-col gap-2 text-right">
              <p className="text-sm font-bold text-stone-500">למי קונים?</p>
              <div className="flex w-fit gap-1 rounded-full bg-stone-100 p-1">
                {RECIPIENT_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setRecipient(option.id)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                      recipient === option.id ? 'bg-white text-ink shadow-sm' : 'bg-transparent text-stone-500'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-right text-sm leading-relaxed text-stone-600 sm:text-base">
              ספרו לנו עליו או עליה — גיל, הקשר ביניכם, תחביבים ומה חוגגים.
            </p>

            <div
              className="flex min-h-[76px] items-center rounded-2xl bg-stone-50 px-4 py-3 text-right text-sm text-ink sm:text-base"
              dir="rtl"
            >
              <span>{text}</span>
              {showCaret && <span className="animate-caret me-0.5 inline-block h-4 w-[2px] bg-ink" aria-hidden="true" />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductSlots() {
  const [reducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  return (
    <div className="relative bg-cream px-4 py-16 sm:px-8">
      <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_auto_1fr] lg:gap-4">
        <div className="order-2 lg:order-1">
          <ProductSlot
            products={LEFT_PRODUCTS}
            side="left"
            intervalMs={LEFT_INTERVAL_MS}
            reducedMotion={reducedMotion}
          />
        </div>
        <div className="order-1 lg:order-2">
          <WhoIsItForCard />
        </div>
        <div className="order-3">
          <ProductSlot
            products={RIGHT_PRODUCTS}
            side="right"
            intervalMs={RIGHT_INTERVAL_MS}
            reducedMotion={reducedMotion}
          />
        </div>
      </div>
    </div>
  );
}

export default function GiftForSection() {
  return (
    <section aria-label="למי המתנה">
      <GrowingLogo />
      <ProductSlots />
    </section>
  );
}
