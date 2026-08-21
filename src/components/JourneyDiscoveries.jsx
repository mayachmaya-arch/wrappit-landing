import { useState } from 'react';
import PhotoFrame from './PhotoFrame';
import useInView from '../hooks/useInView';

// "וזה רק ההתחלה" — the montage continuing Scene 3's reveal, not a new
// idea of its own. Three of this repo's four real business photos (the
// fourth, the coffee cart, already carried Scene 3); each is presented
// full quality at its native ~2:3 ratio, same "poster" treatment as
// Scene 3, staggered on scroll rather than all at once.
const DISCOVERIES = [
  {
    src: '/images/business-photo-2.jpg',
    alt: 'שוק ירקות אורגניים',
    caption: 'ירקות טריים, ישר מהחקלאי.',
  },
  {
    src: '/images/business-photo-4.jpg',
    alt: 'סטודיו יוגה מסודר עם מזרנים וציוד',
    caption: 'שיעור יוגה בסטודיו שכונתי.',
  },
  {
    src: '/images/business-photo-3.jpg',
    alt: 'מדריך רוכב אופניים בטבע, בעל עסק סיורי אופניים',
    caption: 'יום שלם על גלגלים, בטבע.',
  },
];

function DiscoveryCard({ src, alt, caption, index, inView, reducedMotion }) {
  const play = inView && !reducedMotion;
  const settled = reducedMotion || inView;
  return (
    <div
      className={`flex w-full max-w-[240px] flex-col items-center gap-4 sm:max-w-[220px] ${settled ? '' : 'opacity-0'} ${play ? 'animate-scene-photo-in' : ''}`}
      style={{ animationDelay: play ? `${index * 160}ms` : undefined }}
    >
      <PhotoFrame
        src={src}
        alt={alt}
        className="aspect-[2/3] w-full shadow-[0_20px_44px_rgba(31,40,52,0.18)] transition-transform duration-300 hover:-translate-y-1"
        imgClassName={play ? 'animate-ken-burns' : ''}
        gradient="from-amber-100 via-stone-100 to-stone-200"
      />
      <p className="text-base font-semibold text-ink sm:text-lg">{caption}</p>
    </div>
  );
}

export default function JourneyDiscoveries() {
  const [ref, inView] = useInView({ threshold: 0.2 });
  const [reducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const play = inView && !reducedMotion;
  const settled = reducedMotion || inView;

  return (
    <section aria-label="עוד מתנות שלא הכרתם" className="bg-cream px-4 pt-2 pb-24 sm:px-8 sm:pb-32">
      <p
        className={`mb-10 text-center text-lg font-semibold text-ink/50 sm:text-xl ${settled ? '' : 'opacity-0'} ${play ? 'animate-scene-text-in' : ''}`}
      >
        וזה רק ההתחלה.
      </p>
      <div
        ref={ref}
        className="mx-auto flex max-w-4xl flex-col items-center gap-10 sm:flex-row sm:items-start sm:justify-center sm:gap-8"
      >
        {DISCOVERIES.map((item, index) => (
          <DiscoveryCard key={item.src} {...item} index={index} inView={inView} reducedMotion={reducedMotion} />
        ))}
      </div>
    </section>
  );
}
