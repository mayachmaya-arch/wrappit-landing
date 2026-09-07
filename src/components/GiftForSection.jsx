import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import PhotoFrame from './PhotoFrame';
import WrappitLogo from './WrappitLogo';
import useInView from '../hooks/useInView';

// New section, inserted between the hero and the existing Journey scenes —
// does not replace or reorder anything else. Four pieces, top to bottom:
// 1. GrowingLogo — logo scales up via scroll-scrubbed motion (section-local
//    scroll progress), with a static tagline underneath.
// 2. FilterCards — three accordion cards side by side (who's it for / what
//    else matters / budget), no `motion` involved — plain React state.
// 3. GiftRevealStack — 6 gift cards fall into a deliberately messy pile
//    (motion, whileInView, staggered spring), then two CTAs fade in once
//    the pile has finished landing.

// Same production app URL Hero.jsx/Header.jsx already point "buy a gift" at
// (gift-wish-unfold's swipe-based discovery screen) — duplicated here rather
// than imported, matching how those two files already each define their own
// copy of this constant.
const BUY_GIFT_URL = 'https://gift-wish-unfold.vercel.app/discover?source=landing';

// Real product photography hasn't been delivered yet (pending, one image per
// message from the user) — every card below points at a themed Lorem Picsum
// placeholder (seeded, so each stays stable across reloads) rather than a
// local /images/product-*.jpg path. Per instruction this stays true for ALL
// six products until all six real photos have arrived.
const GIFT_STACK_PRODUCTS = [
  {
    id: 'vegetables',
    name: 'ארגז ירקות טרי מהחקלאי',
    vendor: 'חקלאי הצפון',
    image: 'https://picsum.photos/seed/wrappit-vegetables/400/500',
    gradient: 'from-emerald-100 via-lime-50 to-amber-100',
  },
  {
    id: 'haircut',
    name: 'תספורת מקצועית',
    vendor: 'סלון תמר',
    image: 'https://picsum.photos/seed/wrappit-haircut/400/500',
    gradient: 'from-stone-200 via-rose-100 to-stone-100',
  },
  {
    id: 'guitar',
    name: 'שיעור גיטרה',
    vendor: 'סטודיו נגן',
    image: 'https://picsum.photos/seed/wrappit-guitar/400/500',
    gradient: 'from-amber-100 via-stone-100 to-rose-100',
  },
  {
    id: 'pottery',
    name: 'סדנת קרמיקה',
    vendor: 'סטודיו חומר',
    image: 'https://picsum.photos/seed/wrappit-pottery/400/500',
    gradient: 'from-stone-200 via-amber-100 to-rose-100',
  },
  {
    id: 'flowers',
    name: 'זר פרחים',
    vendor: 'עלה פרא',
    image: 'https://picsum.photos/seed/wrappit-flowers/400/500',
    gradient: 'from-rose-100 via-stone-100 to-emerald-100',
  },
  {
    id: 'massage',
    name: 'עיסוי מפנק',
    vendor: 'קליניק רוטס',
    image: 'https://picsum.photos/seed/wrappit-massage/400/500',
    gradient: 'from-stone-100 via-rose-100 to-amber-100',
  },
];

// Design-reference offsets (px, from the stack's own center) — a fixed,
// hand-picked "spilled on a table" arrangement rather than Math.random() on
// every render, so the pile looks the same intentional mess on every load
// instead of reshuffling. Matched 1:1 by index with GIFT_STACK_PRODUCTS.
const STACK_POSITIONS = [
  { x: -130, y: -50, rotate: -14 },
  { x: 60, y: -85, rotate: 9 },
  { x: -55, y: 20, rotate: 6 },
  { x: 140, y: 0, rotate: -8 },
  { x: -15, y: 95, rotate: 15 },
  { x: 95, y: 105, rotate: -5 },
];

const STACK_STAGGER_S = 0.13;
const STACK_FALL_S = 0.65;

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
// The tagline below it is a plain static caption — it doesn't scale with
// the logo, only the logo itself grows.
function GrowingLogo() {
  const ref = useRef(null);
  const [reducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.5, 2.4]);

  return (
    <div
      ref={ref}
      className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-cream px-4 sm:min-h-[70vh]"
    >
      <motion.div style={reducedMotion ? undefined : { scale }}>
        <WrappitLogo className="h-10 w-auto text-pink sm:h-14 lg:h-16" />
      </motion.div>
      <p className="relative text-xl font-bold text-ink sm:text-2xl">זה מה זה נחמד!</p>
    </div>
  );
}

// Shared chrome for all three filter cards — the same accordion look
// WhoIsItForCard already established (white card, chevron flips on open).
function AccordionCardShell({ title, isOpen, onToggle, children }) {
  return (
    <div className="relative z-10 flex w-full flex-col rounded-3xl border border-stone-200 bg-white p-6 shadow-xl sm:p-8">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 text-right"
      >
        <span className="text-2xl font-black text-ink sm:text-3xl">{title}</span>
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
          <div className="flex flex-col gap-4 pt-5">{children}</div>
        </div>
      </div>
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
    <div ref={ref}>
      <AccordionCardShell title="למי המתנה?" isOpen={isOpen} onToggle={() => setIsOpen((prev) => !prev)}>
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

        <hr className="border-stone-200" />

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
      </AccordionCardShell>
    </div>
  );
}

// role="switch" pill toggle. Thumb position uses rtl:/ltr: variants (not a
// plain translate-x) so "off" always rests at the reading-start edge and
// "on" slides to the opposite edge, regardless of the page's own RTL
// direction — same convention as the price-tag corner placement elsewhere
// on this page.
function ToggleSwitch({ checked, onChange, label }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm font-bold text-ink sm:text-base">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${checked ? 'bg-pink' : 'bg-stone-200'}`}
      >
        <span
          className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-transform duration-200 ltr:left-0.5 rtl:right-0.5 ${
            checked ? 'ltr:translate-x-5 rtl:-translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}

// One expandable checkbox row inside WhatElseMattersCard. Parent controls
// `isOpen`/`onToggle` so only one row can be open at a time (mutual
// exclusion lives in the parent's single `openRow` state, not here).
function CheckboxRow({ title, options, isOpen, onToggle, selected, onToggleOption }) {
  return (
    <div className="border-t border-stone-200 pt-3 first:border-t-0 first:pt-0">
      <button type="button" onClick={onToggle} className="flex w-full items-center justify-between gap-3 text-right">
        <span className="text-sm font-bold text-ink sm:text-base">{title}</span>
        <svg
          viewBox="0 0 20 20"
          className={`size-4 shrink-0 text-ink transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
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
          <div className="flex flex-col gap-2 pt-3">
            {options.map((option) => (
              <label key={option} className="flex items-center gap-2 text-sm text-ink sm:text-base">
                <input
                  type="checkbox"
                  checked={selected.has(option)}
                  onChange={() => onToggleOption(option)}
                  className="size-4 accent-pink"
                />
                {option}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const SUPPORT_OPTIONS = ['עסקים מהצפון', 'עסקים מהדרום', 'עסקים של מילואימניקים'];
const VALUE_OPTIONS = ['עבודת יד', 'אקולוגי', 'טבעוני', 'אורגני'];

function WhatElseMattersCard() {
  const [isOpen, setIsOpen] = useState(true);
  const [urgent, setUrgent] = useState(true);
  const [openRow, setOpenRow] = useState('support');
  const [selectedSupport, setSelectedSupport] = useState(() => new Set());
  const [selectedValues, setSelectedValues] = useState(() => new Set());

  function toggleInSet(setter) {
    return (option) => {
      setter((prev) => {
        const next = new Set(prev);
        if (next.has(option)) next.delete(option);
        else next.add(option);
        return next;
      });
    };
  }

  return (
    <AccordionCardShell title="מה עוד חשוב?" isOpen={isOpen} onToggle={() => setIsOpen((prev) => !prev)}>
      <ToggleSwitch checked={urgent} onChange={setUrgent} label="דחוף להיום/מחר" />

      <div className="flex flex-col">
        <CheckboxRow
          title="עסקים שחשוב לי לתמוך בהם"
          options={SUPPORT_OPTIONS}
          isOpen={openRow === 'support'}
          onToggle={() => setOpenRow((prev) => (prev === 'support' ? null : 'support'))}
          selected={selectedSupport}
          onToggleOption={toggleInSet(setSelectedSupport)}
        />
        <CheckboxRow
          title="ערכים ומאפיינים"
          options={VALUE_OPTIONS}
          isOpen={openRow === 'values'}
          onToggle={() => setOpenRow((prev) => (prev === 'values' ? null : 'values'))}
          selected={selectedValues}
          onToggleOption={toggleInSet(setSelectedValues)}
        />
      </div>
    </AccordionCardShell>
  );
}

const BUDGET_MIN = 50;
const BUDGET_MAX = 1000;
const BUDGET_DEFAULT = 300;
const BUDGET_STEP = 10;

function BudgetCard() {
  const [isOpen, setIsOpen] = useState(true);
  const [budget, setBudget] = useState(BUDGET_DEFAULT);

  return (
    <AccordionCardShell title="מה התקציב?" isOpen={isOpen} onToggle={() => setIsOpen((prev) => !prev)}>
      <div className="flex flex-col items-center gap-1 py-2">
        <span className="text-4xl font-black text-pink sm:text-5xl">₪{budget}</span>
        <p className="text-sm text-stone-500">תקציב כולל למתנה</p>
      </div>

      <input
        type="range"
        min={BUDGET_MIN}
        max={BUDGET_MAX}
        step={BUDGET_STEP}
        value={budget}
        onChange={(event) => setBudget(Number(event.target.value))}
        className="w-full accent-pink"
        aria-label="תקציב כולל למתנה"
      />
      <div className="flex justify-between text-xs text-stone-400">
        <span>₪{BUDGET_MIN}</span>
        <span>₪{BUDGET_MAX}</span>
      </div>
    </AccordionCardShell>
  );
}

function FilterCards() {
  return (
    <div className="relative bg-cream px-4 pb-16 sm:px-8">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <WhoIsItForCard />
        <WhatElseMattersCard />
        <BudgetCard />
      </div>
    </div>
  );
}

// One falling card in the pile. Reduced motion renders it already resting
// at its final position (no motion variants at all — the parent's
// animate/variants have nothing to propagate to, since this doesn't declare
// `variants`), matching this file's existing pattern of switching between a
// live/animated style and a fixed final one rather than skipping the
// element itself.
function GiftStackCard({ product, position, reducedMotion }) {
  const cardClassName =
    'absolute top-1/2 left-1/2 w-[120px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-2 shadow-[0_18px_36px_rgba(31,40,52,0.22)] sm:w-[150px]';

  if (reducedMotion) {
    return (
      <div className={cardClassName} style={{ transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px) rotate(${position.rotate}deg)` }}>
        <PhotoFrame src={product.image} alt={product.name} gradient={product.gradient} className="aspect-[4/5] w-full" rounded="rounded-lg" />
        <div className="pt-2 text-center">
          <p className="truncate text-xs font-bold text-ink sm:text-sm">{product.name}</p>
          <p className="truncate text-[10px] text-stone-500 sm:text-xs">{product.vendor}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className={cardClassName}
      variants={{
        hidden: { x: 0, y: -420, rotate: 0, opacity: 0 },
        visible: {
          x: position.x,
          y: position.y,
          rotate: position.rotate,
          opacity: 1,
          transition: { type: 'spring', stiffness: 140, damping: 16 },
        },
      }}
    >
      <PhotoFrame src={product.image} alt={product.name} gradient={product.gradient} className="aspect-[4/5] w-full" rounded="rounded-lg" />
      <div className="pt-2 text-center">
        <p className="truncate text-xs font-bold text-ink sm:text-sm">{product.name}</p>
        <p className="truncate text-[10px] text-stone-500 sm:text-xs">{product.vendor}</p>
      </div>
    </motion.div>
  );
}

// The "gift reveal" moment: 6 cards fall into a messy pile (staggered
// spring, motion + whileInView, once), filling close to the full viewport.
// Once the pile has had time to finish landing, the two CTAs fade in below
// it via a plain CSS opacity transition — timed with a setTimeout matched
// to the fall's own total duration, rather than relying on motion's
// onAnimationComplete propagation from children back up to the orchestrating
// parent, which is harder to reason about here.
function GiftRevealStack({ onExplainMore }) {
  const [ref, inView] = useInView({ threshold: 0.2 });
  const [reducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const [showCta, setShowCta] = useState(false);

  useEffect(() => {
    if (reducedMotion) {
      setShowCta(true);
      return undefined;
    }
    if (!inView) return undefined;
    const totalMs = (GIFT_STACK_PRODUCTS.length - 1) * STACK_STAGGER_S * 1000 + STACK_FALL_S * 1000;
    const id = setTimeout(() => setShowCta(true), totalMs);
    return () => clearTimeout(id);
  }, [inView, reducedMotion]);

  return (
    <div
      ref={ref}
      className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden bg-cream px-4 py-16 sm:min-h-screen"
    >
      <motion.div
        initial="hidden"
        animate={reducedMotion ? undefined : inView ? 'visible' : 'hidden'}
        variants={{ visible: { transition: { staggerChildren: STACK_STAGGER_S } } }}
        className="relative h-[340px] w-[340px] scale-[0.72] sm:scale-90 lg:scale-100"
      >
        {GIFT_STACK_PRODUCTS.map((product, index) => (
          <GiftStackCard key={product.id} product={product} position={STACK_POSITIONS[index]} reducedMotion={reducedMotion} />
        ))}
      </motion.div>

      <div
        className={`mt-10 flex flex-col items-center justify-center gap-3 transition-opacity duration-700 sm:flex-row sm:gap-4 ${
          showCta ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={!showCta}
      >
        <a
          href={BUY_GIFT_URL}
          className="flex h-14 w-full max-w-[320px] items-center justify-center rounded-full bg-pink px-6 text-lg font-semibold whitespace-nowrap text-white transition-opacity hover:opacity-90 sm:h-[60px] sm:w-auto sm:max-w-none"
        >
          וואו מגניב, אני רוצה לקנות מתנה
        </a>
        <button
          type="button"
          onClick={onExplainMore}
          className="flex h-14 w-full max-w-[320px] items-center justify-center rounded-full border border-ink px-6 text-lg font-semibold whitespace-nowrap text-ink transition-opacity hover:opacity-70 sm:h-[60px] sm:w-auto sm:max-w-none"
        >
          רגע, תסביר לי עוד
        </button>
      </div>
    </div>
  );
}

export default function GiftForSection() {
  const sectionRef = useRef(null);

  // "תסביר לי עוד" doesn't jump to a new page — it scrolls to whatever
  // section already follows this one in the page. There's no dedicated
  // "how it works" section yet (deliberately out of scope for this pass —
  // its content hasn't been decided), so this targets the DOM's actual next
  // sibling rather than a hardcoded anchor id, and will keep working
  // whenever that explanatory section does get built here.
  function scrollToNextSection() {
    sectionRef.current?.nextElementSibling?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <section ref={sectionRef} aria-label="למי המתנה">
      <GrowingLogo />
      <FilterCards />
      <GiftRevealStack onExplainMore={scrollToNextSection} />
    </section>
  );
}
