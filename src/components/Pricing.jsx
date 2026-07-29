// Same production app route as Header.jsx/Hero.jsx (gift-wish-unfold): every
// plan's CTA starts the same seller onboarding flow, regardless of plan.
const OPEN_STORE_URL = 'https://gift-wish-unfold.vercel.app/business/onboarding?source=landing';

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" className="size-5 shrink-0 text-emerald-600" fill="none" aria-hidden="true">
      <path d="M4 10.5l4 4 8-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const PLANS = [
  {
    id: 'premium',
    name: 'פרימיום',
    fee: 'עמלה 0%',
    price: '₪500 /לחודש',
    subtitle: 'לעסקים מובילים שרוצים שליטה מלאה',
    features: [
      'מוצרים ללא הגבלה',
      'מערכת אנליטיקה ודוחות מתקדמת',
      'התאמה אישית מלאה של עיצוב המותג',
      'עדיפות עליונה בתוצאות החיפוש',
      'מנהל חשבון אישי ייעודי',
      'אינטגרציה לניהול מלאי חיצוני',
    ],
    cta: 'התחל עכשיו בגרסת פרימיום',
    highlighted: false,
  },
  {
    id: 'pro',
    name: 'פרו',
    fee: 'עמלה 8%',
    price: '₪99 /לחודש',
    subtitle: 'מתאים לעסקים שרוצים לגדול ולבלוט',
    features: [
      'עד 100 מוצרים פעילים',
      'תמיכה מלאה בתמונות + וידאו',
      'אנליטיקה בסיסית על מכירות',
      'בוסט קידום בתוצאות החיפוש',
      'שירות לקוחות מועדף',
    ],
    cta: 'התחל עכשיו בגרסת פרו',
    highlighted: true,
  },
  {
    id: 'free',
    name: 'חינם',
    fee: 'עמלה 12%',
    price: '₪0 /לחודש',
    subtitle: 'ללא התחייבות, ניתן לשנות מסלול בכל עת',
    features: ['עד 10 מוצרים פעילים', 'תמונות בלבד (ללא וידאו)', 'חנות בסיסית במרקטפלייס', 'חשיפה מלאה בדיסקברי ובחיפוש'],
    cta: 'להרשמה חינם',
    highlighted: false,
  },
];

function PricingCard({ plan }) {
  return (
    <div
      className={`relative flex flex-1 flex-col rounded-3xl border p-8 ${
        plan.highlighted
          ? 'order-first border-2 border-pink bg-white shadow-xl sm:-translate-y-2 md:order-none'
          : 'border-stone-200 bg-white'
      }`}
    >
      {plan.highlighted && (
        <span className="absolute -top-3 right-8 rounded-full bg-pink px-3 py-1 text-xs font-semibold text-white">
          הכי משתלם
        </span>
      )}

      <div className="flex items-center justify-between">
        <span className="rounded-full bg-stone-100 px-3 py-1 text-sm font-semibold text-stone-600">{plan.fee}</span>
        <h3 className="text-2xl font-black">{plan.name}</h3>
      </div>

      <div className="mt-6 flex flex-col gap-2 text-right">
        <p className="text-4xl font-black">{plan.price}</p>
        <p className="text-sm text-stone-500">{plan.subtitle}</p>
      </div>

      <hr className="my-6 border-stone-200" />

      <ul className="flex flex-col gap-3 text-right">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-center justify-end gap-2 text-sm text-stone-700">
            {feature}
            <CheckIcon />
          </li>
        ))}
      </ul>

      <a
        href={OPEN_STORE_URL}
        className={`mt-8 rounded-full py-3 text-center text-base font-semibold transition-opacity hover:opacity-90 ${
          plan.highlighted ? 'bg-pink text-white' : 'border border-ink text-ink'
        }`}
      >
        {plan.cta}
      </a>
    </div>
  );
}

export default function Pricing() {
  return (
    <section id="pricing" aria-label="פרייסינג" className="mx-auto max-w-[1560px] px-4 py-16 sm:px-8 sm:py-20">
      <hgroup className="flex flex-col items-center gap-2 text-center">
        <p className="text-sm font-bold text-pink">הצטרפו כעסק מייסד</p>
        <h2 className="text-2xl font-black sm:text-3xl">מסלול שמתאים לעסק שלכם</h2>
        <p className="max-w-lg text-sm text-stone-500 sm:text-base">
          200 העסקים הראשונים מקבלים את מסלול הפרו (₪99/חודש) בחינם למשך חצי שנה — ללא התחייבות
        </p>
      </hgroup>

      <div className="mt-12 flex flex-col gap-8 pb-12 md:flex-row md:items-stretch">
        {PLANS.map((plan) => (
          <PricingCard key={plan.id} plan={plan} />
        ))}
      </div>
    </section>
  );
}
