import { useEffect, useRef, useState } from 'react';

// Fires once when the element first crosses the given viewport threshold,
// then disconnects — used for one-shot scroll-entrance animations, not
// repeated enter/exit toggling. Reduced-motion callers should ignore the
// returned flag and render the "settled" state unconditionally instead of
// skipping this hook, since it's the animation that's optional, not the
// element itself.
export default function useInView({ threshold = 0.2, rootMargin = '0px' } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return [ref, inView];
}
