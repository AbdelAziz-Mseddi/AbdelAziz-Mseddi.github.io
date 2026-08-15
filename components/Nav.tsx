"use client";

import { SoundtrackToggle } from "@/components/SoundtrackToggle";
import { ChargeLink } from "@/components/eggs/ChargeLink";
import { handleSmoothScroll } from "@/lib/smoothScroll";

const links = [
  { href: "#about", label: "About" },
  { href: "#work", label: "Work" },
  { href: "#off-duty", label: "Off Duty" },
  { href: "#gallery", label: "Frames" },
  { href: "#contact", label: "Contact" },
];

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/70 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-10">
        <ChargeLink
          href="#top"
          onClick={handleSmoothScroll}
          className="font-display text-2xl uppercase tracking-wide text-foreground transition-transform hover:-skew-x-6"
        >
          A. Mseddi
        </ChargeLink>
        <ul className="hidden gap-6 text-sm text-muted lg:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={handleSmoothScroll}
                className="transition-colors hover:text-accent-bright"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-3">
          <SoundtrackToggle />
          <a
            href="https://github.com/AbdelAziz-Mseddi"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-border-strong px-4 py-1.5 text-sm text-foreground transition-colors hover:border-accent hover:text-accent-bright"
          >
            GitHub
          </a>
        </div>
      </nav>
    </header>
  );
}
