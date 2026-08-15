import { Reveal } from "@/components/Reveal";

const socials = [
  { label: "GitHub", href: "https://github.com/AbdelAziz-Mseddi" },
  // TODO: swap in real handles/links (Letterboxd, Instagram, LinkedIn, etc.)
  { label: "Email", href: "mailto:abdelazizmseddi@gmail.com" },
];

export function Contact() {
  return (
    <section id="contact" className="py-28">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <Reveal>
          <p className="section-num font-mono text-sm text-accent">
            EP. 04
          </p>
          <h2 className="mt-3 font-display text-balance text-5xl uppercase text-foreground sm:text-6xl">
            Let&apos;s talk, preferably late.
          </h2>
          <p className="mt-6 max-w-lg text-lg text-muted">
            Open to interesting problems — AI systems, backend work, or just
            trading film recommendations.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target={s.href.startsWith("http") ? "_blank" : undefined}
                rel={s.href.startsWith("http") ? "noreferrer" : undefined}
                className="rounded-full border border-border-strong px-6 py-3 text-sm text-foreground transition-colors hover:border-accent hover:text-accent-bright"
              >
                {s.label}
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
