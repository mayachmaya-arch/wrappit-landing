import { useState } from 'react';
import PhotoFrame from './PhotoFrame';
import BridgeHeading from './BridgeHeading';
import useInView from '../hooks/useInView';

// Plain /public paths (not ES imports) — dropping a real photo in with the
// exact same filename replaces the placeholder automatically, no code change.
// See README.md → "העלאת נכסים בעצמך" for the full checklist.
const buyerPhoto = '/images/buyer-photo.jpg';

const BUYER_NOTES = [
  { text: 'שוברים את הראש', rotate: '-6deg', position: 'top-[4%] left-[4%]' },
  { text: 'מסתובבים בין מלא אתרים', rotate: '4deg', position: 'top-[28%] -left-[8%]' },
  { text: 'בזבוז של מלא זמן יקר', rotate: '-4deg', position: 'top-[6%] -right-[4%]' },
  { text: 'לא רוצה לקנות מתנה גנרית', rotate: '5deg', position: 'bottom-[8%] -right-[2%]' },
  { text: 'טוב יאללה, גיפט קארד', rotate: '0deg', position: 'bottom-[26%] left-[10%]' },
];

const BUSINESS_NOTES = [
  { text: 'לא לדעת שהמוצר שלך הוא מתנה מושלמת', rotate: '-5deg', position: 'top-[2%] -right-[4%]' },
  { text: 'להוציא מלא כסף על שיווק', rotate: '3deg', position: 'top-[42%] -left-[6%]' },
  { text: 'לפספס לקוחות', rotate: '-8deg', position: 'bottom-[20%] -right-[2%]' },
  { text: 'לפרסם בכל מקום ואף אחד לא רואה', rotate: '2deg', position: 'bottom-0 left-[6%]' },
];

// Four separate, upright, side-by-side strips (per the Figma reference) —
// no overlap, no rotation on the photos themselves (only the stickers
// rotate). They share one flex row with items-center, so the one taller
// strip (business-photo-2, aspect-[3/8.5] vs. the others' aspect-[3/7])
// naturally extends a bit above and below its neighbors on its own, without
// needing an explicit translate.
const BUSINESS_PHOTOS = [
  {
    src: '/images/business-photo-1.jpg',
    alt: 'עגלת קפה רחוב עם בעל עסק מגיש לקוחות',
    className: 'aspect-[3/7]',
  },
  {
    src: '/images/business-photo-2.jpg',
    alt: 'שוק ירקות אורגניים',
    className: 'aspect-[3/8.5]',
  },
  {
    src: '/images/business-photo-3.jpg',
    alt: 'מדריך רוכב אופניים בטבע, בעל עסק סיורי אופניים',
    className: 'aspect-[3/7]',
  },
  {
    src: '/images/business-photo-4.jpg',
    alt: 'סטודיו יוגה מסודר עם מזרנים וציוד',
    className: 'aspect-[3/7]',
  },
];

// Paper-label sticky notes: soft yellow (#FFF58A, from the Figma reference),
// small radius, minimal padding, a tight "resting on the photo" shadow
// rather than a floating UI-card shadow. --sticker-rotate feeds the
// animate-sticker-slap keyframe (index.css) so it can animate through a
// larger start rotation without hardcoding any note's own angle there;
// the inline transform is the reduced-motion / pre-animation fallback that
// keyframe's 100% state also lands on.
function StickyNote({ text, rotate, position, index, inView, reducedMotion }) {
  const playAnimation = inView && !reducedMotion;
  return (
    <p
      className={`absolute ${position} z-10 rounded px-3 py-1.5 text-base font-semibold whitespace-nowrap text-ink shadow-[0_3px_6px_rgba(0,0,0,0.18)] sm:text-lg ${playAnimation ? 'animate-sticker-slap' : ''}`}
      style={{
        backgroundColor: '#FFF58A',
        '--sticker-rotate': rotate,
        transform: `rotate(${rotate})`,
        opacity: reducedMotion || inView ? undefined : 0,
        animationDelay: playAnimation ? `${index * 120}ms` : undefined,
      }}
    >
      {text}
    </p>
  );
}

export default function ProblemSection() {
  // Not ScrollReveal here: stickers need the same inView flag the
  // images/heading fade-in uses (so the "slap" only starts once the photos
  // have scrolled into view), and ScrollReveal doesn't expose the boolean
  // it tracks internally — so its fade/slide behavior is reproduced inline
  // against a useInView call this component also hands to every StickyNote.
  const [ref, inView] = useInView({ threshold: 0.15 });
  const [reducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const revealClassName = reducedMotion
    ? ''
    : `transition-all duration-700 ease-out ${inView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`;

  return (
    <section id="problem" aria-label="הבעיה" className="mx-auto max-w-[1820px] px-4 py-24 sm:px-8 sm:py-32">
      <div ref={ref} className={`grid gap-20 lg:grid-cols-2 lg:gap-12 ${revealClassName}`}>
        <div className="flex flex-col items-center gap-10">
          <hgroup className="flex flex-col items-center gap-2 text-center">
            <p className="text-xl font-bold text-pink">מצד אחד</p>
            <h2 className="text-3xl sm:text-4xl">קוני מתנה</h2>
          </hgroup>
          <div className="relative w-full max-w-xl px-6 py-10">
            <PhotoFrame
              src={buyerPhoto}
              alt="קונה מתנות מביטה בטלפון בתסכול, מוקפת באפשרויות מתנה אינסופיות"
              className="aspect-[3/2] w-full shadow-[20px_16px_20px_7px_rgba(0,0,0,0.1)]"
              gradient="from-rose-200 via-rose-100 to-amber-100"
            />
            {BUYER_NOTES.map((note, index) => (
              <StickyNote key={note.text} {...note} index={index} inView={inView} reducedMotion={reducedMotion} />
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-10">
          <hgroup className="flex flex-col items-center gap-2 text-center">
            <p className="text-xl font-bold text-pink">מצד שני</p>
            <h2 className="text-3xl sm:text-4xl">בעלי עסקים</h2>
          </hgroup>
          <div className="relative w-full max-w-xl px-6 py-14">
            <div className="flex items-center gap-2 sm:gap-3">
              {BUSINESS_PHOTOS.map((photo) => (
                <PhotoFrame
                  key={photo.src}
                  src={photo.src}
                  alt={photo.alt}
                  gradient="from-amber-100 via-stone-100 to-stone-200"
                  className={`flex-1 shadow-[10px_10px_20px_rgba(0,0,0,0.12)] ${photo.className}`}
                />
              ))}
            </div>
            {BUSINESS_NOTES.map((note, index) => (
              <StickyNote key={note.text} {...note} index={index} inView={inView} reducedMotion={reducedMotion} />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-16">
        <BridgeHeading tagline="פתרון פשוט כל כך" />
      </div>
    </section>
  );
}
