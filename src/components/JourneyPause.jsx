import { useState } from 'react';
import BridgeHeading from './BridgeHeading';
import useInView from '../hooks/useInView';

// The turn: no photo, no motion beyond a single calm fade — a deliberate
// breath between Scene 1's pain and Scene 3's first wow, the same way a
// film cuts to black for a beat before the reveal. Reuses BridgeHeading
// (the "Wrappit + tagline" device already used at the close of every other
// section on this page) rather than inventing a new brand-moment
// component, so this scene is visually the same family, just given more
// room to breathe.
export default function JourneyPause() {
  const [ref, inView] = useInView({ threshold: 0.4 });
  const [reducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const play = inView && !reducedMotion;
  const settled = reducedMotion || inView;

  return (
    <section
      ref={ref}
      aria-label="הכירו את Wrappit"
      className="bg-gradient-to-b from-cream to-[#fdf1ef] px-4 py-20 sm:px-8 sm:py-28"
    >
      <div
        className={`mx-auto flex flex-col items-center gap-6 text-center ${settled ? '' : 'opacity-0'} ${play ? 'animate-scene-text-in' : ''}`}
      >
        <p className="text-lg font-semibold text-ink/50 sm:text-xl">מה אם...</p>
        <BridgeHeading tagline="יש עולם שלם של מתנות שלא ידעת שקיים." />
      </div>
    </section>
  );
}
