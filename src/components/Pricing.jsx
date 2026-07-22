function GiftRibbonIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 48 60" className={className} fill="none" aria-hidden="true">
      <path
        d="M24 60V22M24 22c-8-6-16-4-16-14 0-5 4-8 8-8s8 6 8 14M24 22c8-6 16-4 16-14 0-5-4-8-8-8s-8 6-8 14"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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
      className={`flex flex-1 flex-col rounded-3xl border p-8 ${
        plan.highlighted ? 'border-pink bg-white shadow-2xl sm:-translate-y-4' : 'border-stone-200 bg-white'
      }`}
    >
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

      <button
        type="button"
        className={`mt-8 rounded-full py-3 text-base font-semibold transition-opacity hover:opacity-90 ${
          plan.highlighted ? 'bg-pink text-white' : 'border border-ink text-ink'
        }`}
      >
        {plan.cta}
      </button>
    </div>
  );
}

export default function Pricing() {
  return (
    <section id="pricing" aria-label="פרייסינג" className="mx-auto max-w-[1560px] px-4 py-4 sm:px-8">
      <div className="flex items-center justify-between gap-6 rounded-3xl bg-ink px-8 py-10 text-cloud sm:px-16">
        <GiftRibbonIcon className="hidden h-24 w-auto shrink-0 text-emerald-400 sm:block" />
        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-2xl font-black sm:text-3xl">הצטרפו כעסק מייסד!</h2>
          <p className="text-sm text-cloud/80 sm:text-base">
            200 העסקים הראשונים מקבלים את תוכנית הפרו (₪99/חודש) בחינם למשך חצי שנה
          </p>
          <p className="text-xs text-cloud/60 sm:text-sm">מקומות מוגבלים • ללא התחייבות</p>
        </div>
        <GiftRibbonIcon className="hidden h-24 w-auto shrink-0 text-emerald-400 sm:block" />
      </div>

      <div className="mt-12 flex flex-col gap-8 pb-12 md:flex-row">
        {PLANS.map((plan) => (
          <PricingCard key={plan.id} plan={plan} />
        ))}
      </div>
    </section>
  );
}
