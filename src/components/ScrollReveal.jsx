import { useState } from 'react';
import useInView from '../hooks/useInView';

// Gentle one-shot fade/slide-in when a section first scrolls into view.
// Under prefers-reduced-motion, skips straight to the settled state — no
// transform, no transition — rather than animating in reduced form.
export default function ScrollReveal({ as: Tag = 'div', threshold = 0.15, className = '', children, ...rest }) {
  const [ref, inView] = useInView({ threshold });
  const [reducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  const motionClassName = reducedMotion
    ? ''
    : `transition-all duration-700 ease-out ${inView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`;

  return (
    <Tag ref={ref} className={`${className} ${motionClassName}`} {...rest}>
      {children}
    </Tag>
  );
}
