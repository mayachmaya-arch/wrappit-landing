import { useEffect, useRef, useState } from 'react';

const ROTATING_PHRASES = ['יום הולדת?', 'בר מצווה?', 'חתונת הזהב?', 'יום האהבה?', 'רוצה להגיד תודה?'];

const PHRASE_INTERVAL_MS = 700;

// Same production app routes as Header.jsx (gift-wish-unfold): /discover is
// the swipe-based gift discovery screen, /business/onboarding is the seller
// onboarding flow.
const BUY_GIFT_URL = 'https://gift-wish-unfold.vercel.app/discover?source=landing';
const OPEN_STORE_URL = 'https://gift-wish-unfold.vercel.app/business/onboarding?source=landing';

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    function stop() {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    function start() {
      stop();
      if (reduceMotionQuery.matches || document.hidden) return;
      intervalRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % ROTATING_PHRASES.length);
      }, PHRASE_INTERVAL_MS);
    }

    // Reduced motion: land on and hold a stable first phrase, no cycling.
    if (reduceMotionQuery.matches) {
      setActiveIndex(0);
    } else {
      start();
    }

    document.addEventListener('visibilitychange', start);
    reduceMotionQuery.addEventListener('change', start);
    return () => {
      stop();
      document.removeEventListener('visibilitychange', start);
      reduceMotionQuery.removeEventListener('change', start);
    };
  }, []);

  return (
    <section
      id="top"
      aria-label="פתיח"
      // pb-10/sm:pb-6/lg:pb-[118px]: the marquee band (Marquee.jsx) is now
      // absolutely positioned and mostly below the fold by design — it no
      // longer reserves flex space, so it doesn't push this content up on
      // its own. This bottom padding is what keeps a real gap between the
      // CTA and the band's own visible top edge (its resting position is
      // above the fold at mobile/desktop sizes) rather than the two
      // touching or overlapping. pb-10 (vs. sm:pb-6/lg:pb-[118px]) is
      // deliberately larger on the smallest/base tier only, to shift the
      // whole text group slightly upward off the very bottom edge.
      className="relative flex flex-1 flex-col items-center justify-end gap-5 pt-4 pb-10 sm:items-start sm:gap-7 sm:pt-6 sm:pb-6 lg:gap-[14px] lg:pt-0 lg:pb-[118px]"
    >
      <div className="flex flex-col items-center text-cloud sm:items-start">
        <div
          // Base tier (<640px): text-[clamp(2.1rem,8vw,3.25rem)] fluid-scales
          // with the viewport but is hard-capped at 3.25rem (52px), tuned so
          // even the longest rotating phrase ("רוצה להגיד תודה?") stays
          // clear of calc(100vw-40px) — the available width once the
          // wrapper's 20px/side padding is subtracted — at every phone
          // width from 320px up (verified: widest margin at 320px is still
          // >20px of slack). whitespace-nowrap is dropped at this tier only
          // (sm:whitespace-nowrap restores it from 640px up) so a phrase
          // that somehow still doesn't fit wraps to a controlled second
          // line instead of clipping. h-[2.2em] (vs. the single-line
          // h-[1.1em] restored at sm:) reserves room for that worst-case
          // two-line layout up front, so the container's own height never
          // changes between phrases and the page never jumps.
          className="relative h-[2.2em] w-full font-display text-[clamp(2.1rem,8vw,3.25rem)] leading-none font-bold text-center sm:h-[1.1em] sm:w-full sm:text-[8vw] sm:text-right lg:h-[110px] lg:w-[820px] lg:text-[80px] xl:h-[146px] xl:w-[1050px] xl:text-[104px]"
          role="text"
        >
          {ROTATING_PHRASES.map((phrase, index) => (
            <span
              key={phrase}
              aria-hidden={index !== activeIndex}
              className="absolute inset-0 flex items-center justify-center whitespace-normal sm:justify-start sm:whitespace-nowrap"
              style={{ opacity: index === activeIndex ? 1 : 0 }}
            >
              {phrase}
            </span>
          ))}
          <span className="sr-only">{ROTATING_PHRASES[activeIndex]}</span>
        </div>
        <p className="mt-2 text-center text-[8vw] font-light sm:text-right sm:text-[5vw] lg:mt-1 lg:text-[48px] xl:text-[60px]">
          הפעם תביאו משהו בול.
        </p>
      </div>

      <div className="flex w-full flex-col items-center gap-4 sm:items-start sm:gap-6 lg:gap-[24px]">
        <p className="max-w-[340px] text-center text-base leading-relaxed text-balance text-cloud sm:max-w-[1086px] sm:text-right sm:text-2xl sm:leading-normal sm:text-wrap lg:text-[28px]">
          מרקטפלייס מתנות חכם שמקשר בין <span className="font-black">עסקים ישראלים</span> ל
          <span className="font-black">מחפשי מתנות עסוקים</span>
        </p>

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:gap-4">
          <a
            href={OPEN_STORE_URL}
            className="flex h-14 w-full max-w-[320px] items-center justify-center rounded-full bg-pink px-6 py-3 text-lg font-semibold whitespace-nowrap text-white transition-opacity hover:opacity-90 sm:h-[60px] sm:w-auto sm:max-w-none"
          >
            לפתיחת חנות
          </a>
          <a
            href={BUY_GIFT_URL}
            className="flex items-center justify-center rounded-full px-6 py-3 text-lg font-semibold whitespace-nowrap text-pink underline underline-offset-4 transition-opacity hover:opacity-80 sm:text-cloud sm:no-underline"
          >
            גלו את המתנה המושלמת
          </a>
        </div>
      </div>
    </section>
  );
}
