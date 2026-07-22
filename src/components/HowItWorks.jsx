import PhotoFrame from './PhotoFrame';
import BridgeHeading from './BridgeHeading';

const STEPS = [
  {
    number: 1,
    title: 'מספרים על מקבל/ת המתנה',
    description: 'כמה מילים על האדם, התקציב והאירוע. זהו, השלב הקשה מאחוריכם. עכשיו תנוחו.',
    imageAlt: 'פתק עם תיאור אישי של מקבל המתנה',
    gradient: 'from-amber-100 via-stone-100 to-rose-100',
  },
  {
    number: 2,
    title: 'מנוע AI חכם מאתר מתנות רלוונטיות',
    description: 'תוך רגע תקבלו רעיונות מדויקים ושילובים מפתיעים. ואנחנו נדאג שתישארו בדיוק במסגרת התקציב.',
    imageAlt: 'הצעות מתנה מותאמות אישית שנבחרו על ידי בינה מלאכותית',
    gradient: 'from-emerald-100 via-stone-100 to-amber-100',
  },
  {
    number: 3,
    title: 'משלמים בקליק',
    description: 'לפני הקליק אפשר להתייעץ עם המוכר, אפשר לרכוש למספר אנשים או ממספר אנשים. הרבה דברים אפשר פה.',
    imageAlt: 'תשלום מהיר ופשוט באפליקציה',
    gradient: 'from-rose-100 via-stone-100 to-stone-200',
  },
  {
    number: 4,
    title: 'המתנה מגיעה ליעדה',
    description: 'המשימה הושלמה. עכשיו תסתכלו על השעון ותגלו שבקושי עברו 5 דקות.',
    imageAlt: 'מקבל/ת המתנה פותח/ת את המתנה בשמחה',
    gradient: 'from-stone-200 via-rose-100 to-amber-100',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" aria-label="ככה זה עובד" className="mx-auto max-w-[1200px] px-4 py-24 sm:px-8 sm:py-28">
      <div className="flex flex-col gap-20 sm:gap-24">
        {STEPS.map((step, i) => (
          <div
            key={step.number}
            className={`flex flex-col items-center gap-8 sm:gap-12 md:flex-row ${
              i % 2 === 0 ? 'md:flex-row-reverse' : ''
            }`}
          >
            <PhotoFrame
              alt={step.imageAlt}
              gradient={step.gradient}
              className="aspect-[4/3] w-full shadow-xl md:w-1/2"
            />
            <div className="flex w-full flex-col items-end gap-3 text-right md:w-1/2">
              <span className="text-3xl font-black text-emerald-600">{step.number}</span>
              <h3 className="text-xl font-bold sm:text-2xl">{step.title}</h3>
              <p className="text-base leading-relaxed text-stone-600 sm:text-lg">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20">
        <BridgeHeading tagline="המתנה הכי טובה לתת לעסק שלך" />
      </div>
    </section>
  );
}
