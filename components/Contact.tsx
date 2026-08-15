import { Reveal } from "@/components/Reveal";
import { community, certifications } from "@/lib/projects";

const socials = [
  { label: "GitHub", href: "https://github.com/AbdelAziz-Mseddi" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/abdelaziz-mseddi/" },
  // TODO: swap in real handles/links (Letterboxd, Instagram, etc.)
  { label: "Email", href: "mailto:abdelazizmseddi@gmail.com" },
];

export function Contact() {
  return (
    <section id="contact" className="py-28">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <Reveal>
          <h2 className="font-display text-balance text-5xl uppercase text-foreground sm:text-6xl">
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

          <p className="mt-16 max-w-lg text-xs leading-relaxed text-muted-dim">
            {community.map((c) => c.org).join(" · ")}
            {" — "}
            {certifications.map((c) => c.title).join(" · ")}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
