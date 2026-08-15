import { Reveal } from "@/components/Reveal";
import { interests } from "@/lib/projects";

export function About() {
  return (
    <section id="about" className="border-b border-border py-28">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <div className="grid gap-12 sm:grid-cols-[1fr_1.4fr] sm:gap-16">
          <Reveal>
            <p className="section-num font-mono text-sm text-accent">01</p>
            <h2 className="mt-3 font-display text-3xl italic text-foreground">
              About
            </h2>
          </Reveal>

          <Reveal delay={100} className="space-y-6">
            <p className="text-lg leading-relaxed text-muted">
              I&apos;m a software engineering student at{" "}
              <span className="text-foreground">INSAT</span>, currently
              working as an{" "}
              <span className="text-foreground">AI engineer at Rém Data
              AI</span>, where I build systems that turn messy real-world
              data into something a model can reason about.
            </p>
            <p className="text-lg leading-relaxed text-muted">
              Outside of that: I chase good cinema, keep a running mental
              tier list of anime, and I&apos;m happiest writing code after
              midnight when the city goes quiet — preferably in winter, with
              a camera nearby.
            </p>

            <ul className="mt-8 flex flex-wrap gap-3">
              {interests.map((interest) => (
                <li
                  key={interest}
                  className="rounded-full border border-border-strong px-4 py-1.5 text-sm text-muted transition-colors hover:border-accent hover:text-accent-bright"
                >
                  {interest}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
