import { Reveal } from "@/components/Reveal";
import { ProjectCardLinked } from "@/components/ProjectCardLinked";
import { getAllProjects } from "@/lib/content";

export function Projects() {
  const projects = getAllProjects();

  return (
    <section id="work" className="py-16">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <Reveal>
          <p className="mx-auto max-w-xl text-center text-muted">
            Client work, hackathon builds, and side projects.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <Reveal key={project.id} delay={(i % 3) * 80} className="h-full">
              <ProjectCardLinked project={project} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
