const FOOTER_LINKS = [
  { label: 'בית', href: '#top' },
  { label: 'אודות', href: '#about' },
  { label: 'צור קשר', href: '#contact' },
  { label: 'תנאי שימוש', href: '#terms' },
];

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" aria-hidden="true">
      <path
        d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H9v3h2v6h3v-6h3l1-3h-4V9c0-.6.4-1 1-1Z"
        fill="currentColor"
      />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" aria-hidden="true">
      <rect x="2.5" y="6" width="19" height="12" rx="4" stroke="currentColor" strokeWidth="1.8" />
      <path d="M10.5 9.5v5l4.5-2.5-4.5-2.5Z" fill="currentColor" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" aria-hidden="true">
      <path
        d="M21 5.5c-.7.3-1.5.6-2.3.7a4 4 0 0 0 1.7-2.2c-.8.5-1.6.8-2.6 1a4 4 0 0 0-6.8 3.6A11.3 11.3 0 0 1 3 4.2a4 4 0 0 0 1.2 5.3c-.6 0-1.2-.2-1.8-.5v.1a4 4 0 0 0 3.2 3.9c-.6.2-1.2.2-1.8.1a4 4 0 0 0 3.7 2.8A8 8 0 0 1 2 17.6a11.3 11.3 0 0 0 6.1 1.8c7.3 0 11.3-6 11.3-11.3v-.5c.8-.6 1.4-1.3 2-2.1Z"
        fill="currentColor"
      />
    </svg>
  );
}

const SOCIAL_LINKS = [
  { label: 'Instagram', href: '#', Icon: InstagramIcon },
  { label: 'Facebook', href: '#', Icon: FacebookIcon },
  { label: 'YouTube', href: '#', Icon: YoutubeIcon },
  { label: 'Twitter', href: '#', Icon: TwitterIcon },
];

export default function Footer() {
  return (
    <footer className="bg-ink px-4 py-16 text-cloud sm:px-8">
      <div className="mx-auto flex max-w-[1560px] flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
        <nav aria-label="ניווט פוטר" className="flex flex-wrap gap-6 text-sm font-medium text-cloud/80">
          {FOOTER_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="transition-opacity hover:opacity-80">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex flex-col items-start gap-1 sm:items-end">
          <p className="font-logo text-3xl leading-none text-cloud">Wrappit</p>
          <p className="text-sm text-cloud/70">הפעם תביאו משהו בול.</p>
        </div>
      </div>

      <hr className="mx-auto my-10 max-w-[1560px] border-cloud/15" />

      <div className="mx-auto flex max-w-[1560px] flex-col-reverse items-center gap-6 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-2">
          {SOCIAL_LINKS.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="flex size-10 items-center justify-center rounded-full text-cloud/80 transition-colors hover:bg-white/10 hover:text-cloud"
            >
              <Icon />
            </a>
          ))}
        </div>
        <p className="text-sm text-cloud/60">© 2025 Wrappit. כל הזכויות שמורות.</p>
      </div>
    </footer>
  );
}
