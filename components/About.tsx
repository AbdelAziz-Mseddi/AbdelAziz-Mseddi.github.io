import { Reveal } from "@/components/Reveal";
import { Glyph } from "@/components/eggs/Glyph";

export function About() {
  return (
    <section id="about" className="py-16">
      <div className="mx-auto max-w-3xl px-6 sm:px-10">
        <Reveal className="space-y-6">
          <p className="text-lg leading-relaxed text-muted">
            I&apos;m a software engineering student at{" "}
            <span className="text-foreground">INSAT</span>, currently working
            as an{" "}
            <span className="text-foreground">
              AI engineer at Rém Data &amp; AI
            </span>{" "}
            — intern to part-time to full-time in five months. I build
            systems that turn messy real-world data into something a model
            can reason about.
          </p>
          <p className="text-lg leading-relaxed text-muted">
            Outside class I was active with the{" "}
            <span className="text-foreground">
              Google Developer Group on Campus
            </span>{" "}
            and the{" "}
            <span className="text-foreground">ACM INSAT Student Chapter</span>
            , where I helped organize a Certified Nvidia workshop. My goal,
            stated plainly: become one of the greats. I&apos;m happiest
            writing code after midnight when the city goes quiet, preferably
            in winter, camera within reach.
            <Glyph id="about" className="ml-2 align-middle" />
          </p>
        </Reveal>
      </div>
    </section>
  );
}
