import { Reveal } from "@/components/Reveal";
import { interests, community } from "@/lib/projects";

export function About() {
  return (
    <section id="about" className="border-b border-border py-28">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <div className="grid gap-12 sm:grid-cols-[1fr_1.4fr] sm:gap-16">
          <Reveal>
            <p className="section-num font-mono text-sm text-accent">
              EP. 01
            </p>
            <h2 className="mt-3 font-display text-4xl uppercase text-foreground">
              About
            </h2>
          </Reveal>

          <Reveal delay={100} className="space-y-6">
            <p className="text-lg leading-relaxed text-muted">
              I&apos;m a software engineering student at{" "}
              <span className="text-foreground">INSAT</span> (Génie
              Logiciel, year 2), currently working as an{" "}
              <span className="text-foreground">AI engineer at Rém Data
              &amp; AI</span> — intern to part-time to full-time in five
              months. I build systems that turn messy real-world data into
              something a model can reason about, with a growing sideline
              in IoT/hardware security.
            </p>
            <p className="text-lg leading-relaxed text-muted">
              Outside class I&apos;m active with the{" "}
              <span className="text-foreground">
                Google Developer Group on Campus
              </span>{" "}
              and the{" "}
              <span className="text-foreground">ACM INSAT Student Chapter</span>
              , where I helped organize a Certified Nvidia workshop. My
              goal, stated plainly: become one of the greats. I&apos;m
              happiest writing code after midnight when the city goes
              quiet, preferably in winter, camera within reach.
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

            <div className="mt-6 flex flex-wrap gap-2">
              {community.map((c) => (
                <span
                  key={c.org}
                  className="rounded-full border border-border px-3 py-1 text-xs text-muted-dim"
                >
                  {c.org}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
