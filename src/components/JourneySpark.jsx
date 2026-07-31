import { useState } from 'react';
import useInView from '../hooks/useInView';

// Opens the journey immediately below the hero/ticker, still inside the
// same emotional beat Hero already set up (the panic of not knowing what
// to buy) — full-bleed real photography instead of a card, continuing
// Hero's own visual mode (dark photo/video + overlaid cloud-colored type)
// rather than breaking to the light "card on cream" language used
// elsewhere on the page. Deliberately short — this scene's only job is to
// hold the pain for one more beat before Scene 2 turns it.
//
// Plain <img> here, not PhotoFrame: this is the one place on the page
// doing true full-bleed edge-to-edge cropping of a landscape photo across
// every viewport width, and object-position needs to stay biased toward
// the upper-center (where she actually is in frame) so a very tall mobile
// viewport doesn't crop her out of her own photo — PhotoFrame's shared
// <img> doesn't expose object-position, so forking to a raw <img> here
// avoided extending that API for a single caller.
export default function JourneySpark() {
  const [ref, inView] = useInView({ threshold: 0.3 });
  const [reducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const play = inView && !reducedMotion;
  const settled = reducedMotion || inView;

  return (
    <section
      ref={ref}
      aria-label="אין לך מושג מה לקנות"
      className="relative flex min-h-[62vh] items-end overflow-hidden bg-ink sm:min-h-[72vh] lg:min-h-[82vh]"
    >
      <img
        src="/images/buyer-photo.jpg"
        alt="קונה מתנות יושבת על הספה ומביטה בטלפון בתסכול"
        loading="lazy"
        className={`absolute inset-0 h-full w-full object-cover object-[50%_28%] ${play ? 'animate-ken-burns' : ''}`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/25 to-transparent" />

      <div className="site-container relative z-10 mx-auto flex w-full max-w-[1820px] flex-col gap-1 pb-14 sm:gap-2 sm:pb-20">
        <p
          className={`font-display text-[10vw] leading-[1.05] font-bold text-cloud sm:text-[6vw] lg:text-[60px] xl:text-[72px] ${settled ? '' : 'opacity-0'} ${play ? 'animate-scene-text-in' : ''}`}
          style={{ animationDelay: play ? '150ms' : undefined }}
        >
          אין לך מושג מה לקנות.
        </p>
        <p
          className={`text-xl font-semibold text-cloud/70 sm:text-2xl ${settled ? '' : 'opacity-0'} ${play ? 'animate-scene-text-in' : ''}`}
          style={{ animationDelay: play ? '550ms' : undefined }}
        >
          שוב.
        </p>
      </div>
    </section>
  );
}
