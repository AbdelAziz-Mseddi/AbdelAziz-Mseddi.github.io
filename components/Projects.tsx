import { Reveal } from "@/components/Reveal";
import { ProjectCard } from "@/components/ProjectCard";
import { projects } from "@/lib/projects";

export function Projects() {
  return (
    <section id="work" className="py-16">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <Reveal>
          <p className="mx-auto max-w-xl text-center text-muted">
            A mix of what pays the bills, what won at hackathons, and what I
            built for myself at 2am with a soundtrack on loop.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <Reveal key={project.slug} delay={(i % 3) * 80} className="h-full">
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
