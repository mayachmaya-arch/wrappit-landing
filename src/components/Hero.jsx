import { useEffect, useState } from 'react';

const ROTATING_PHRASES = ['יום הולדת?', 'בר מצווה?', 'חתונת הזהב?', 'יום האהבה?', 'רוצה להגיד תודה?'];

const PHRASE_INTERVAL_MS = 2800;

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % ROTATING_PHRASES.length);
    }, PHRASE_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      id="top"
      aria-label="פתיח"
      className="relative flex min-h-[520px] flex-col items-start justify-end gap-10 pt-16 pb-16 sm:pt-24 sm:pb-20"
    >
      <div className="flex flex-col items-start text-cloud">
        <div
          className="relative h-[1.1em] w-full font-display text-[15vw] leading-none font-bold text-right sm:text-[8vw] lg:h-[110px] lg:text-[80px] xl:h-[146px] xl:text-[104px]"
          role="text"
        >
          {ROTATING_PHRASES.map((phrase, index) => (
            <span
              key={phrase}
              aria-hidden={index !== activeIndex}
              className="absolute inset-0 flex items-center justify-start transition-opacity duration-700 ease-in-out"
              style={{ opacity: index === activeIndex ? 1 : 0 }}
            >
              {phrase}
            </span>
          ))}
          <span className="sr-only">{ROTATING_PHRASES[activeIndex]}</span>
        </div>
        <p className="mt-2 text-right text-[8vw] font-light sm:text-[5vw] lg:text-[48px] xl:text-[60px]">
          הפעם תביאו משהו בול.
        </p>
      </div>

      <div className="flex w-full flex-col items-start gap-8">
        <p className="max-w-[1086px] text-right text-xl leading-normal text-cloud sm:text-2xl lg:text-[28px]">
          מרקטפלייס מתנות חכם שמקשר בין <span className="font-black">עסקים ישראלים</span> ל
          <span className="font-black">מחפשי מתנות עסוקים</span>
        </p>

        <div className="flex flex-wrap items-start gap-4">
          <a
            href="#founding-business"
            className="flex h-[60px] items-center justify-center rounded-full bg-pink px-6 py-3 text-lg font-semibold whitespace-nowrap text-white transition-opacity hover:opacity-90"
          >
            הצטרפו כעסק מייסד
          </a>
          <a
            href="#discover"
            className="flex items-center justify-center rounded-full px-6 py-3 text-lg font-semibold whitespace-nowrap text-cloud transition-opacity hover:opacity-80"
          >
            גלו את המתנה המושלמת
          </a>
        </div>
      </div>
    </section>
  );
}
