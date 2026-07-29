import { useEffect, useState } from 'react';
import PhotoFrame from './PhotoFrame';
import BridgeHeading from './BridgeHeading';
import useInView from '../hooks/useInView';

const STEPS = [
  {
    number: 1,
    title: 'מספרים על מקבל/ת המתנה',
    description: 'כמה מילים על האדם, התקציב והאירוע. זהו, השלב הקשה מאחוריכם. עכשיו תנוחו.',
    image: '/images/buyer-photo.jpg',
    imageAlt: 'כותבים כמה מילים על מקבל/ת המתנה בטלפון',
    note: 'הבוס האהוב שלי אחרי 5 שנים, אוהב וויסקי ואופניים',
  },
  {
    number: 2,
    title: 'מנוע AI חכם מאתר מתנות רלוונטיות',
    description: 'תוך רגע תקבלו רעיונות מדויקים ושילובים מפתיעים. ואנחנו נדאג שתישארו בדיוק במסגרת התקציב.',
    image: '/images/business-photo-2.jpg',
    imageAlt: 'הצעות מתנה מותאמות אישית שנבחרו על ידי בינה מלאכותית',
    note: 'רעיונות מתאימים לתקציב שהוגדר',
  },
  {
    number: 3,
    title: 'מחליטים ומשלמים בקליק',
    description: 'לפני הקליק אפשר להתייעץ עם המוכר, אפשר לרכוש למספר אנשים או ממספר אנשים. הרבה דברים אפשר פה.',
    isPaymentCard: true,
    imageAlt: 'אישור תשלום מהיר ופשוט באפליקציה',
  },
  {
    number: 4,
    title: 'המתנה מגיעה ליעדה',
    description: 'המשימה הושלמה. עכשיו תסתכלו על השעון ותגלו שבקושי עברו 5 דקות. או שהוא מקבל או שהוא אוסף.',
    isCrossfadeGallery: true,
    imageAlt: 'מקבל/ת המתנה פותח/ת את המתנה בשמחה',
  },
];

// The same five real photos used elsewhere in the page (no unrelated stock
// or AI imagery) — reused here since no dedicated "receiving a gift" photo
// set exists in the project yet. See the end-of-task report for the exact
// missing-asset list this stands in for.
const ARRIVAL_PHOTOS = [
  '/images/buyer-photo.jpg',
  '/images/business-photo-3.jpg',
  '/images/business-photo-4.jpg',
];
const ARRIVAL_CROSSFADE_MS = 4000;

function PaymentConfirmationCard() {
  return (
    <div className="flex aspect-[4/3] w-full flex-col justify-between rounded-2xl border border-stone-200 bg-white p-6 shadow-xl sm:p-8">
      <div className="flex items-center justify-between">
        <span className="flex size-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <svg viewBox="0 0 20 20" className="size-5" fill="none" aria-hidden="true">
            <path d="M4 10.5l4 4 8-9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">התשלום אושר</span>
      </div>

      <div className="flex flex-col gap-1 text-right">
        <p className="text-sm text-stone-500">שיעור גיטרה — עודן אצטרובל</p>
        <p className="text-3xl font-black text-ink">₪1,600</p>
      </div>

      <div className="flex items-center justify-between rounded-xl bg-stone-50 px-4 py-3 text-sm text-stone-600">
        <span>Apple Pay</span>
        <span>נשלח למקבל/ת המתנה</span>
      </div>
    </div>
  );
}

function ArrivalCrossfade() {
  const [active, setActive] = useState(0);
  const [reducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    if (reducedMotion) return undefined;
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % ARRIVAL_PHOTOS.length);
    }, ARRIVAL_CROSSFADE_MS);
    return () => clearInterval(id);
  }, [reducedMotion]);

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-xl">
      {ARRIVAL_PHOTOS.map((src, i) => (
        <PhotoFrame
          key={src}
          src={src}
          alt={i === 0 ? 'מקבל/ת המתנה פותח/ת את המתנה בשמחה' : ''}
          rounded="rounded-none"
          gradient="from-stone-200 via-rose-100 to-amber-100"
          className={`absolute inset-0 h-full w-full transition-opacity duration-[1800ms] ease-in-out ${
            (reducedMotion ? 0 : active) === i ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
    </div>
  );
}

function DiagonalNote({ text }) {
  if (!text) return null;
  return (
    <p className="absolute -bottom-4 -right-4 max-w-[220px] -rotate-3 rounded-lg bg-cream px-4 py-2 text-sm font-semibold text-ink shadow-md">
      {text}
    </p>
  );
}

function StepBadge({ number, active, className = '' }) {
  return (
    <span
      className={`flex size-10 shrink-0 items-center justify-center rounded-full text-lg font-black transition-colors duration-500 ${
        active ? 'bg-purple text-cloud' : 'bg-stone-100 text-stone-400'
      } ${className}`}
    >
      {number}
    </span>
  );
}

function StepMedia({ step }) {
  return (
    <div className="relative">
      {step.isPaymentCard && <PaymentConfirmationCard />}
      {step.isCrossfadeGallery && <ArrivalCrossfade />}
      {!step.isPaymentCard && !step.isCrossfadeGallery && (
        <PhotoFrame src={step.image} alt={step.imageAlt} className="aspect-[4/3] w-full shadow-xl" />
      )}
      <DiagonalNote text={step.note} />
    </div>
  );
}

function StepRow({ step, index, onActive, reducedMotion }) {
  const [ref, inView] = useInView({ threshold: 0.4 });
  const imageFirst = index % 2 === 0;
  // Under reduced motion every step is shown active immediately — scroll
  // position shouldn't gate anything, per the "show all steps without
  // scroll animation" requirement.
  const active = reducedMotion || inView;

  useEffect(() => {
    if (inView) onActive(step.number);
  }, [inView, step.number, onActive]);

  return (
    <div
      ref={ref}
      className="relative grid grid-cols-1 items-center gap-5 md:grid-cols-[1fr_auto_1fr] md:gap-8"
    >
      <div className={`w-full ${imageFirst ? 'md:order-3' : 'md:order-1'}`}>
        <StepMedia step={step} />
      </div>

      {/* Spine marker: centered between the two columns at md+ only — the
          mobile badge lives inline with the text below instead, since there's
          no side-by-side layout to sit between. */}
      <div className="hidden md:order-2 md:flex md:justify-center">
        <StepBadge number={step.number} active={active} />
      </div>

      <div className={`flex w-full flex-col items-end gap-3 text-right ${imageFirst ? 'md:order-1' : 'md:order-3'}`}>
        <StepBadge number={step.number} active={active} className="md:hidden" />
        <h3 className="text-xl font-bold sm:text-2xl">{step.title}</h3>
        <p className="text-base leading-relaxed text-stone-600 sm:text-lg">{step.description}</p>
      </div>
    </div>
  );
}

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(1);
  const [reducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  const handleActive = (number) => {
    setActiveStep((prev) => Math.max(prev, number));
  };

  const fillPercent = reducedMotion ? 100 : ((activeStep - 1) / (STEPS.length - 1)) * 100;

  return (
    <section id="how-it-works" aria-label="ככה זה עובד" className="mx-auto max-w-[1200px] px-4 py-20 sm:px-8 sm:py-24">
      <div className="relative flex flex-col gap-14 sm:gap-16">
        {/* Connecting path: on mobile it's a rail down the content side (the
            fixed inset lines up with the inline badge's center, since the
            badge sits flush against this same padded edge); at md+ it
            recenters between the alternating image/text columns, aligning
            with the spine badge instead. The fill grows as each step
            scrolls into view — reduced motion renders it fully filled with
            no transition. */}
        <div
          className="pointer-events-none absolute top-2 bottom-2 right-5 w-0.5 bg-stone-200 md:right-1/2 md:mr-[-1px]"
          aria-hidden="true"
        >
          <div
            className="w-full bg-purple transition-[height] duration-700 ease-out"
            style={{ height: `${fillPercent}%` }}
          />
        </div>

        {STEPS.map((step, i) => (
          <StepRow key={step.number} step={step} index={i} onActive={handleActive} reducedMotion={reducedMotion} />
        ))}
      </div>

      <div className="mt-20">
        <BridgeHeading tagline="המתנה הכי טובה לתת לעסק שלך" />
      </div>
    </section>
  );
}
