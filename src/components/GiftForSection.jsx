import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import WrappitLogo from './WrappitLogo';

// The page's second section, right after the hero/marquee: a scroll-scrubbed
// growing logo with a static punchline underneath. This used to be the top
// of a much longer section (filter cards, a falling gift-card pile, CTAs) —
// all of that was deliberately cut for a drastically simplified page. Only
// this piece survives.

// Scroll-scrubbed logo: scale is a pure function of scrollYProgress (a
// motion value), read straight into motion.div's style — no React
// re-render per scroll pixel, no setState in a scroll handler. offset
// ["start end", "end start"] is what makes 0 land at "this block's top
// just entered the viewport from below" and 1 at "its bottom just left the
// viewport at the top," i.e. section-local progress, not window.scrollY.
// The line below it is a plain static caption — it doesn't scale with the
// logo, only the logo itself grows.
export default function GiftForSection() {
  const ref = useRef(null);
  const [reducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.5, 2.4]);

  return (
    <section
      ref={ref}
      aria-label="די! איך ידעת שזה בדיוק מה שרציתי"
      className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-cream px-4 sm:min-h-[70vh]"
    >
      <motion.div style={reducedMotion ? undefined : { scale }}>
        <WrappitLogo className="h-10 w-auto text-pink sm:h-14 lg:h-16" />
      </motion.div>
      <p className="relative text-xl font-bold text-ink sm:text-2xl">די! איך ידעת שזה בדיוק מה שרציתי??</p>
    </section>
  );
}
