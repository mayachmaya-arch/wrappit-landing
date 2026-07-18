const NAV_LINKS = [
  { label: 'ככה זה עובד, הכי פשוט בעולם!', href: '#how-it-works' },
  { label: 'הפתרון שלנו', href: '#solution' },
  { label: 'מה שקיים היום', href: '#problem' },
];

export default function Header() {
  return (
    <header className="relative z-20 flex w-full items-center justify-between gap-6 rounded-2xl px-4 py-4 drop-shadow-[0_6px_9px_rgba(0,0,0,0.05)] sm:px-8 sm:py-6">
      <a href="#top" className="shrink-0 font-logo text-3xl leading-none text-cloud sm:text-4xl lg:text-5xl">
        Wrappit
      </a>

      <nav
        aria-label="ניווט ראשי"
        className="hidden items-center gap-7 whitespace-nowrap text-base font-semibold text-cloud lg:flex"
      >
        {NAV_LINKS.map((link) => (
          <a key={link.href} href={link.href} className="transition-opacity hover:opacity-80">
            {link.label}
          </a>
        ))}
      </nav>

      <div className="flex shrink-0 items-center gap-3 sm:gap-5">
        <a
          href="#buy"
          className="hidden h-[60px] items-center justify-center rounded-full border border-cloud px-6 py-3 text-lg font-semibold whitespace-nowrap text-cloud transition-colors hover:bg-cloud/10 sm:flex"
        >
          לקניית מתנה
        </a>
        <a
          href="#sell"
          className="flex h-[60px] items-center justify-center rounded-full bg-pink px-6 py-3 text-lg font-semibold whitespace-nowrap text-white transition-opacity hover:opacity-90"
        >
          לפתיחת חנות
        </a>
      </div>
    </header>
  );
}
