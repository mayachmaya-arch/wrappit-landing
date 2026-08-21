import { useState } from 'react';
import BridgeHeading from './BridgeHeading';
import useInView from '../hooks/useInView';

// Closes the cinematic run with the same restrained device as Scene 2
// (BridgeHeading), handing off to Pricing — which is where the actual
// business-owner conversion action lives — rather than duplicating a CTA
// here and competing with it.
export default function JourneyBridge() {
  const [ref, inView] = useInView({ threshold: 0.4 });
  const [reducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const play = inView && !reducedMotion;
  const settled = reducedMotion || inView;

  return (
    <section ref={ref} aria-label="הכל במקום אחד" className="bg-cream px-4 pt-2 pb-16 sm:px-8 sm:pb-20">
      <div className={`${settled ? '' : 'opacity-0'} ${play ? 'animate-scene-text-in' : ''}`}>
        <BridgeHeading tagline="הכל, במקום אחד." />
      </div>
    </section>
  );
}
