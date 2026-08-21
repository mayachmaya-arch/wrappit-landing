import { useState } from 'react';
import PhotoFrame from './PhotoFrame';
import useInView from '../hooks/useInView';

// The first real wow, and the only capability this scene reveals: a coffee
// punch card as a gift. Two-part headline (question, then the one-word
// answer) instead of a single sentence — the beat between them is the
// joke. aspect-[2/3] matches business-photo-1.jpg's native 1024×1536
// ratio exactly, so the "poster" is shown at full quality with zero crop,
// not stretched or squeezed to fit an arbitrary frame.
export default function JourneyCoffeeReveal() {
  const [ref, inView] = useInView({ threshold: 0.25 });
  const [reducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const play = inView && !reducedMotion;
  const settled = reducedMotion || inView;

  return (
    <section
      id="discover"
      ref={ref}
      aria-label="גלו מתנות מפתיעות"
      className="overflow-hidden bg-cream px-4 pt-16 pb-24 sm:px-8 sm:pt-20 sm:pb-32"
    >
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-10 text-center">
        <div className="flex flex-col items-center gap-1">
          <p
            className={`font-display text-[9vw] leading-none font-bold text-ink/35 sm:text-[5vw] lg:text-[42px] ${settled ? '' : 'opacity-0'} ${play ? 'animate-scene-text-in' : ''}`}
          >
            כרטיסיית קפה?
          </p>
          <p
            className={`font-display text-[13vw] leading-none font-bold text-pink sm:text-[7vw] lg:text-[62px] ${settled ? '' : 'opacity-0'} ${play ? 'animate-scene-text-in' : ''}`}
            style={{ animationDelay: play ? '450ms' : undefined }}
          >
            מתנה.
          </p>
        </div>

        <div
          className={`w-full max-w-[300px] ${settled ? '' : 'opacity-0'} ${play ? 'animate-scene-photo-in' : ''}`}
          style={{ animationDelay: play ? '750ms' : undefined }}
        >
          <PhotoFrame
            src="/images/business-photo-1.jpg"
            alt="עגלת קפה רחוב עם בעל עסק מגיש לקוחות"
            className="aspect-[2/3] w-full shadow-[0_28px_60px_rgba(31,40,52,0.22)]"
            imgClassName={play ? 'animate-ken-burns' : ''}
            gradient="from-amber-100 via-stone-100 to-stone-200"
          />
        </div>
      </div>
    </section>
  );
}
