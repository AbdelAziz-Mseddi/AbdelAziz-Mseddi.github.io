import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { ARCHIVE } from "@/content/archive";

export const metadata: Metadata = {
  title: "Archive · Abdelaziz Mseddi",
  description:
    "Two years of course notes at INSAT, organized and handed down to the students coming up behind me: Maths-Physique-Informatique and Génie Logiciel.",
};

export default function ArchivePage() {
  return (
    <div className="flex flex-1 flex-col">
      <Nav />
      <main className="flex-1 pt-24">
        <section className="py-16">
          <div className="mx-auto max-w-3xl px-6 sm:px-10">
            <Reveal>
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-dim">
                {"// course archive"}
              </p>
              <h1 className="mt-4 font-display text-5xl uppercase leading-none text-foreground sm:text-6xl">
                Archive
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
                Two years of notes, organized and handed down to the students
                coming up behind me at INSAT. Free, and kept as I actually
                worked through the material.
              </p>
              <p className="mt-3 max-w-xl font-mono text-xs uppercase tracking-[0.14em] text-muted-dim">
                {"// mostly in French. programme names translated below"}
              </p>
            </Reveal>

            <div className="mt-14 border-t border-border">
              {ARCHIVE.map((entry, i) => (
                <Reveal key={entry.id} delay={Math.min(i, 4) * 80}>
                  <a
                    href={entry.href}
                    target="_blank"
                    rel="noreferrer"
                    className="archive-row group relative grid grid-cols-[1fr_auto] items-start gap-x-6 gap-y-2 border-b border-border py-9"
                  >
                    <span aria-hidden="true" className="work-rule" />

                    <span className="block">
                      <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                        {entry.year} · {entry.tier}
                      </span>
                      <span className="mt-2 block font-display text-3xl uppercase leading-[0.95] text-foreground sm:text-4xl">
                        {entry.title}
                      </span>
                      <span className="mt-1.5 block text-sm text-accent-bright/70">
                        {entry.translation}
                      </span>
                      <span className="mt-3 block max-w-[54ch] leading-relaxed text-muted">
                        {entry.blurb}
                      </span>
                    </span>

                    <span className="flex items-center gap-1.5 self-center whitespace-nowrap font-mono text-xs uppercase tracking-[0.14em] text-muted-dim transition-colors group-hover:text-accent-bright">
                      Open the drive
                      <span
                        aria-hidden="true"
                        className="transition-transform group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </span>
                  </a>
                </Reveal>
              ))}
            </div>

            <Reveal delay={200}>
              <p className="mt-10 font-mono text-xs leading-relaxed text-muted-dim">
                {"// take what helps, pass it on."}
              </p>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
