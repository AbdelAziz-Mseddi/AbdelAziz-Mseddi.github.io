import { Reveal } from "@/components/Reveal";
import { ProjectRow } from "@/components/ProjectRow";
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

        <div className="mt-14 border-t border-border">
          {projects.map((project, i) => (
            <Reveal key={project.id} delay={Math.min(i, 4) * 60}>
              <ProjectRow project={project} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
