import WrappitLogo from './WrappitLogo';

// Only real, working in-page sections — no invented social links or pages
// that don't exist on this site (see README.md → "העלאת נכסים בעצמך" if a
// real Instagram/Facebook/etc. URL is ever supplied, at which point a
// socials row can come back).
const FOOTER_LINKS = [
  { label: 'בית', href: '#top' },
  { label: 'מה שקיים היום', href: '#problem' },
  { label: 'הפתרון שלנו', href: '#solution' },
  { label: 'ככה זה עובד', href: '#how-it-works' },
  { label: 'מחירים', href: '#pricing' },
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
