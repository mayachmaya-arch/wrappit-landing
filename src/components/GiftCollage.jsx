import { useEffect, useState } from 'react';
import PhotoFrame from './PhotoFrame';
import BridgeHeading from './BridgeHeading';

// Real photos only (no gradient placeholders) — the same five photos
// already vetted and placed for ProblemSection, reused here in different
// orders/rotations to build two collage arrangements that crossfade. See
// README.md → "העלאת נכסים בעצמך" if gallery-photo-*.jpg ever get real
// images of their own; those still are placeholders today and are
// deliberately left out of this section.
const REAL_PHOTOS = [
  '/images/buyer-photo.jpg',
  '/images/business-photo-1.jpg',
  '/images/business-photo-2.jpg',
  '/images/business-photo-3.jpg',
  '/images/business-photo-4.jpg',
];

const COLLAGE_SETS = [
  [REAL_PHOTOS[1], REAL_PHOTOS[2], REAL_PHOTOS[0], REAL_PHOTOS[3], REAL_PHOTOS[4], REAL_PHOTOS[2]],
  [REAL_PHOTOS[3], REAL_PHOTOS[0], REAL_PHOTOS[4], REAL_PHOTOS[1], REAL_PHOTOS[2], REAL_PHOTOS[0]],
];

const COLLAGE_CROSSFADE_MS = 7000;

const SEARCH_PHRASES = [
  'מתנה ליום הולדת לאמא',
  'משהו מקורי לחבר הכי טוב',
  'מתנת פרישה לקולגה יקרה',
  'מתנה רומנטית ליום נישואין',
];

const TYPE_MS = 55;
const DELETE_MS = 30;
const HOLD_MS = 1400;

function CollageTile({ src, className = '' }) {
  return (
    <PhotoFrame
      src={src}
      alt=""
      rounded="rounded-2xl"
      gradient="from-amber-100 via-rose-100 to-stone-200"
      className={`aspect-square w-[150px] shrink-0 shadow-lg sm:w-[190px] lg:w-[220px] ${className}`}
    />
  );
}

function CollageLayer({ photos, active }) {
  return (
    <div
      className={`absolute inset-0 flex items-center justify-center gap-4 transition-opacity duration-[1800ms] ease-in-out sm:gap-5 ${
        active ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden="true"
    >
      {photos.map((src, i) => (
        <CollageTile key={i} src={src} className={i % 2 === 1 ? 'translate-y-6 sm:translate-y-8' : '-translate-y-2'} />
      ))}
    </div>
  );
}

// Typewriter: types a phrase, holds it, deletes it, moves to the next —
// paused entirely under prefers-reduced-motion (lands on the first phrase,
// fully typed, with no blinking caret).
function useTypewriter(phrases) {
  const [text, setText] = useState('');
  const [reducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    if (reducedMotion) {
      setText(phrases[0]);
      return undefined;
    }

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
  }, [phrases, reducedMotion]);

  return { text, showCaret: !reducedMotion };
}

function PhoneMockup() {
  const { text, showCaret } = useTypewriter(SEARCH_PHRASES);

  return (
    <div className="mx-auto flex w-[300px] shrink-0 flex-col overflow-hidden rounded-[40px] border-[6px] border-stone-800 bg-white shadow-2xl sm:w-[340px] lg:w-[380px] lg:rounded-[48px] lg:border-8">
      <div className="mx-auto mt-3 h-1.5 w-16 rounded-full bg-stone-300" />
      <div className="flex items-center justify-between px-6 pt-4 text-xs text-stone-500 sm:text-sm">
        <span>13:54</span>
        <span className="font-logo text-lg text-pink sm:text-xl">Wrappit</span>
      </div>

      <div className="flex flex-col gap-2 px-6 pt-6">
        <p className="text-base font-bold text-ink sm:text-lg">מה תרצו למצוא?</p>
        <div className="flex min-h-[56px] items-center rounded-xl bg-stone-50 px-4 py-3 text-sm text-ink sm:text-base" dir="rtl">
          <span>{text}</span>
          {showCaret && (
            <span className="animate-caret me-0.5 inline-block h-4 w-[2px] bg-ink" aria-hidden="true" />
          )}
        </div>
      </div>

      <button
        type="button"
        className="mx-6 my-6 rounded-full bg-pink py-3 text-base font-semibold text-white sm:py-4 sm:text-lg"
      >
        מצאו לי מתנה
      </button>
    </div>
  );
}

export default function GiftCollage() {
  const [activeSet, setActiveSet] = useState(0);
  const [reducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    if (reducedMotion) return undefined;
    const id = setInterval(() => {
      setActiveSet((prev) => (prev + 1) % COLLAGE_SETS.length);
    }, COLLAGE_CROSSFADE_MS);
    return () => clearInterval(id);
  }, [reducedMotion]);

  return (
    <section id="solution" aria-label="הפתרון שלנו" className="relative overflow-hidden pt-4 pb-20 sm:pt-6 sm:pb-28">
      <div className="relative flex min-h-[520px] items-center justify-center py-10 sm:min-h-[600px]">
        <div className="pointer-events-none absolute inset-x-[-10%] top-1/2 h-[260px] -translate-y-1/2 -rotate-6 opacity-90 sm:h-[300px]">
          {COLLAGE_SETS.map((photos, i) => (
            <CollageLayer key={i} photos={photos} active={reducedMotion ? i === 0 : i === activeSet} />
          ))}
        </div>
        <div className="relative z-10">
          <PhoneMockup />
        </div>
      </div>

      <div className="relative z-10 mt-16">
        <BridgeHeading tagline="ככה זה עובד" />
      </div>
    </section>
  );
}
