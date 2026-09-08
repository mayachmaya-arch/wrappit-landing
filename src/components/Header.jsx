import WrappitLogo from './WrappitLogo';

// Production app (gift-wish-unfold): existing routes, not new pages —
// /discover is the main swipe-based gift discovery screen, /business/onboarding
// is the existing seller onboarding / create-store flow (src/App.tsx routes).
const BUY_GIFT_URL = 'https://gift-wish-unfold.vercel.app/discover?source=landing';
const OPEN_STORE_URL = 'https://gift-wish-unfold.vercel.app/business/onboarding?source=landing';

export default function Header() {
  return (
    <header className="relative z-20 flex w-full items-center justify-between gap-6 rounded-2xl py-3 drop-shadow-[0_6px_9px_rgba(0,0,0,0.05)] sm:py-6">
      <a href="#top" className="shrink-0 text-cloud">
        <WrappitLogo className="h-8 w-auto sm:h-9 lg:h-11" />
      </a>

      {/* The middle nav row (page-section links) was removed along with the
          sections it pointed to — with the page cut down to hero + the
          logo/punchline moment + footer, there's nothing left to deep-link
          to, and the two CTAs below already cover both real destinations. */}
      <div className="flex shrink-0 items-center gap-3 sm:gap-5">
        <a
          href={BUY_GIFT_URL}
          className="hidden h-[60px] items-center justify-center rounded-full border border-cloud px-6 py-3 text-lg font-semibold whitespace-nowrap text-cloud transition-colors hover:bg-cloud/10 sm:flex"
        >
          לקניית מתנה
        </a>
        <a
          href={OPEN_STORE_URL}
          className="flex h-12 items-center justify-center rounded-full bg-pink px-6 py-0 text-lg font-semibold whitespace-nowrap text-white transition-opacity hover:opacity-90 sm:h-[60px] sm:py-3"
        >
          לפתיחת חנות
        </a>
      </div>
    </header>
  );
}
