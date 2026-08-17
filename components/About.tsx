import { Reveal } from "@/components/Reveal";

export function About() {
  return (
    <section id="about" className="py-16">
      <div className="mx-auto max-w-3xl px-6 sm:px-10">
        <Reveal className="space-y-6">
          <p className="text-lg leading-relaxed text-muted">
            I study software engineering at{" "}
            <span className="text-foreground">INSAT</span> and work as an{" "}
            <span className="text-foreground">
              AI engineer at Rém Data &amp; AI
            </span>
            , where I went from intern to full-time in five months.
          </p>
          <p className="text-lg leading-relaxed text-foreground">
            My goal, stated plainly: become one of the greats.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
