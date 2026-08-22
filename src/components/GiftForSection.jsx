import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import PhotoFrame from './PhotoFrame';
import WrappitLogo from './WrappitLogo';
import useInView from '../hooks/useInView';

// New section, inserted between the hero and the existing Journey scenes —
// does not replace or reorder anything else. Two independent scroll-scrubbed
// regions (own useScroll target each, per "based on scroll progress within
// the relevant section, not global scroll position"): the logo grows across
// its own block, then — separately — the two product-card stacks fan out
// across theirs, with the "who's the gift for?" card sitting statically
// between them the whole time.

const RIGHT_PRODUCTS = [
  { id: 'notebook', name: 'יומן עור', price: 45, gradient: 'from-rose-100 via-amber-100 to-stone-200' },
  { id: 'mug', name: 'כוס קפה', price: 35, gradient: 'from-amber-100 via-stone-100 to-rose-100' },
  { id: 'plant', name: 'עציץ קטן', price: 60, gradient: 'from-emerald-100 via-stone-100 to-amber-100' },
];

const LEFT_PRODUCTS = [
  { id: 'candle', name: 'נר ריח', price: 40, gradient: 'from-stone-200 via-rose-100 to-amber-100' },
  { id: 'soap', name: 'סבון בעבודת יד', price: 25, gradient: 'from-amber-100 via-rose-100 to-stone-200' },
  { id: 'tote', name: 'תיק בד', price: 55, gradient: 'from-stone-100 via-amber-100 to-rose-100' },
];

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

function ProductCard({ product, index, total, side, progress, reducedMotion }) {
  // Fan geometry: cards start nearly stacked (small rotation, ~0 offset)
  // and spread as progress goes 0→1. `spread` alternates sign by index so
  // the stack opens like a hand of cards rather than sliding as one block;
  // `direction` (+1 right stack / -1 left stack) is what sends the right
  // stack's cards rightward and the left stack's leftward — translateX is
  // a physical (not logical/RTL-relative) transform, so this sign is fixed
  // regardless of the page's own dir="rtl".
  const centered = index - (total - 1) / 2; // e.g. for 3 cards: -1, 0, 1
  const direction = side === 'right' ? 1 : -1;
  const finalX = direction * (60 + index * 70);
  const finalY = Math.abs(centered) * 18;
  const finalRotate = direction * (10 + centered * 10);
  // Hooks always run (rules of hooks) — only the *style actually applied*
  // below branches on reducedMotion, so a scroll-driven fan (continuous
  // motion tied to scroll position, exactly what prefers-reduced-motion is
  // meant to suppress) never plays; reduced-motion users see every card
  // already resting at its final fanned position instead.
  const x = useTransform(progress, [0, 1], [0, finalX]);
  const y = useTransform(progress, [0, 1], [0, finalY]);
  const rotate = useTransform(progress, [0, 1], [direction * 2, finalRotate]);

  return (
    <motion.div
      className="absolute top-1/2 left-1/2 w-[130px] -translate-x-1/2 -translate-y-1/2 sm:w-[150px]"
      style={
        reducedMotion
          ? { x: finalX, y: finalY, rotate: finalRotate, zIndex: total - index }
          : { x, y, rotate, zIndex: total - index }
      }
    >
      <div className="relative">
        <PhotoFrame
          src={`/images/product-${product.id}.jpg`}
          alt={product.name}
          gradient={product.gradient}
          className="aspect-[3/4] w-full shadow-[0_16px_32px_rgba(31,40,52,0.16)]"
        />
        <span className="absolute top-2 rounded-full bg-cloud px-2.5 py-1 text-xs font-bold text-ink shadow-sm ltr:right-2 rtl:left-2">
          ₪{product.price}
        </span>
        <span
          className="absolute -bottom-3 rounded-md bg-cloud px-2 py-1 text-[11px] font-semibold whitespace-nowrap text-ink shadow-sm ltr:-right-2 rtl:-left-2"
          style={{ transform: `rotate(${side === 'right' ? -6 : 6}deg)` }}
        >
          {product.name}
        </span>
      </div>
    </motion.div>
  );
}

function CardStack({ products, side, progress, reducedMotion }) {
  return (
    <div className="relative h-[220px] w-full sm:h-[260px]">
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          index={index}
          total={products.length}
          side={side}
          progress={progress}
          reducedMotion={reducedMotion}
        />
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

function FanningCards() {
  const ref = useRef(null);
  const [reducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  // The fan is centered on the card, so its own progress window is
  // narrower than the full section — mapping input [0.25, 0.75] onto
  // output [0, 1] means the spread happens across the *middle* of the
  // scroll transit (cards closed while the card is still arriving/leaving,
  // fully open while it's centered in view) rather than across the entire
  // section, which would leave the cards fully spread long before/after
  // the card itself is comfortably readable.
  const fanProgress = useTransform(scrollYProgress, [0.25, 0.75], [0, 1], { clamp: true });

  return (
    <div ref={ref} className="relative min-h-[130vh] bg-cream px-4 py-16 sm:px-8">
      <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_auto_1fr] lg:gap-4">
        <div className="order-2 lg:order-1">
          <CardStack products={LEFT_PRODUCTS} side="left" progress={fanProgress} reducedMotion={reducedMotion} />
        </div>
        <div className="order-1 lg:order-2">
          <WhoIsItForCard />
        </div>
        <div className="order-3">
          <CardStack products={RIGHT_PRODUCTS} side="right" progress={fanProgress} reducedMotion={reducedMotion} />
        </div>
      </div>
    </div>
  );
}

export default function GiftForSection() {
  return (
    <section aria-label="למי המתנה">
      <GrowingLogo />
      <FanningCards />
    </section>
  );
}
