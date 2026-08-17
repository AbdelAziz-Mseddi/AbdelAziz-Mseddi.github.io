import { Reveal } from "@/components/Reveal";
import { ProjectRow } from "@/components/ProjectRow";
import { LANE_COLOR, getAllProjects, getLanes } from "@/lib/content";

export function Projects() {
  const projects = getAllProjects();
  // Only legend the lanes something actually uses, so the key can never
  // list a discipline that appears nowhere in the index.
  const used = new Set(projects.flatMap((p) => p.lanes));
  const lanes = getLanes().filter((l) => used.has(l.id));

  return (
    <section id="work" className="py-16">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <Reveal>
          <p className="mx-auto max-w-xl text-center text-muted">
            Client work, hackathon builds, and side projects.
          </p>
        </Reveal>

        <Reveal delay={80}>
          <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5">
            {lanes.map((lane) => (
              <li
                key={lane.id}
                className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-dim"
              >
                <span
                  aria-hidden="true"
                  className="block h-[3px] w-[22px] rounded-sm"
                  style={{ background: LANE_COLOR[lane.id] }}
                />
                {lane.label}
              </li>
            ))}
          </ul>
        </Reveal>

        <div className="mt-12 border-t border-border">
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
