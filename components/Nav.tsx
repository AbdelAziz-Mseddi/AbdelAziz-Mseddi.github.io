const links = [
  { href: "#about", label: "About" },
  { href: "#work", label: "Work" },
  { href: "#gallery", label: "Frames" },
  { href: "#contact", label: "Contact" },
];

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/70 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-10">
        <a
          href="#top"
          className="font-display text-2xl uppercase tracking-wide text-foreground transition-transform hover:-skew-x-6"
        >
          A. Mseddi
        </a>
        <ul className="hidden gap-8 text-sm text-muted sm:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="transition-colors hover:text-accent-bright"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="https://github.com/AbdelAziz-Mseddi"
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-border-strong px-4 py-1.5 text-sm text-foreground transition-colors hover:border-accent hover:text-accent-bright"
        >
          GitHub
        </a>
      </nav>
    </header>
  );
}
