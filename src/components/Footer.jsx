import WrappitLogo from './WrappitLogo';

// Only real, working destinations — no invented social links or pages that
// don't exist. With the page cut down to hero + the logo/punchline moment,
// the only real in-page anchor left is #top; the other two are the same
// production gift-wish-unfold URLs Header.jsx/Hero.jsx already link to (see
// README.md → "העלאת נכסים בעצמך" if a real Instagram/Facebook/etc. URL is
// ever supplied, at which point a socials row can come back).
const BUY_GIFT_URL = 'https://gift-wish-unfold.vercel.app/discover?source=landing';
const OPEN_STORE_URL = 'https://gift-wish-unfold.vercel.app/business/onboarding?source=landing';

const FOOTER_LINKS = [
  { label: 'בית', href: '#top' },
  { label: 'לקניית מתנה', href: BUY_GIFT_URL },
  { label: 'לפתיחת חנות', href: OPEN_STORE_URL },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink px-4 py-10 text-cloud sm:px-8">
      <div className="mx-auto flex max-w-[1560px] flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <WrappitLogo className="h-6 w-auto text-pink sm:h-7" />

        <nav aria-label="ניווט פוטר" className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-cloud/80">
          {FOOTER_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="transition-opacity hover:opacity-80">
              {link.label}
            </a>
          ))}
        </nav>

        <p className="text-sm text-cloud/60">© {year} Wrappit. כל הזכויות שמורות.</p>
      </div>
    </footer>
  );
}
