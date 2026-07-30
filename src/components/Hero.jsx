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
      // pb-20/lg:pb-24: the marquee band (Marquee.jsx) is now absolutely
      // positioned and mostly below the fold by design — it no longer
      // reserves flex space, so it doesn't push this content up on its
      // own. This bottom padding is what keeps a real ~53-55px gap
      // between the CTA and the band's own visible top edge (its
      // resting position is 27px/41px above the fold at mobile/desktop
      // sizes) rather than the two touching or overlapping.
      className="relative flex flex-1 flex-col items-start justify-end gap-5 pt-4 pb-6 sm:gap-7 sm:pt-6 lg:gap-[14px] lg:pt-0 lg:pb-[118px]"
    >
      <div className="flex flex-col items-start text-cloud">
        <div
          className="relative h-[1.1em] w-full font-display text-[15vw] leading-none font-bold text-right sm:text-[8vw] lg:h-[110px] lg:w-[820px] lg:text-[80px] xl:h-[146px] xl:w-[1050px] xl:text-[104px]"
          role="text"
        >
          {ROTATING_PHRASES.map((phrase, index) => (
            <span
              key={phrase}
              aria-hidden={index !== activeIndex}
              className="absolute inset-0 flex items-center justify-start whitespace-nowrap"
              style={{ opacity: index === activeIndex ? 1 : 0 }}
            >
              {phrase}
            </span>
          ))}
          <span className="sr-only">{ROTATING_PHRASES[activeIndex]}</span>
        </div>
        <p className="mt-2 text-right text-[8vw] font-light sm:text-[5vw] lg:mt-1 lg:text-[48px] xl:text-[60px]">
          הפעם תביאו משהו בול.
        </p>
      </div>

      <div className="flex w-full flex-col items-start gap-4 sm:gap-6 lg:gap-[24px]">
        <p className="max-w-[1086px] text-right text-xl leading-normal text-cloud sm:text-2xl lg:text-[28px]">
          מרקטפלייס מתנות חכם שמקשר בין <span className="font-black">עסקים ישראלים</span> ל
          <span className="font-black">מחפשי מתנות עסוקים</span>
        </p>

        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:gap-4">
          <a
            href={OPEN_STORE_URL}
            className="flex h-[60px] items-center justify-center rounded-full bg-pink px-6 py-3 text-lg font-semibold whitespace-nowrap text-white transition-opacity hover:opacity-90"
          >
            הצטרפו כעסק מייסד
          </a>
          <a
            href={BUY_GIFT_URL}
            className="flex items-center justify-center rounded-full px-6 py-3 text-lg font-semibold whitespace-nowrap text-cloud transition-opacity hover:opacity-80"
          >
            גלו את המתנה המושלמת
          </a>
        </div>
      </div>
    </section>
  );
}
