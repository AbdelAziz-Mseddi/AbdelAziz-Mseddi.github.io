import type { Project } from "@/lib/projects";

const kindLabel: Record<Project["kind"], string> = {
  project: "Project",
  hackathon: "Hackathon",
  experience: "Experience",
};

export function ProjectCard({ project }: { project: Project }) {
  const className =
    "card-glow group relative flex h-full flex-col rounded-2xl border border-border bg-surface p-7 transition-colors hover:bg-surface-hover";

  const content = (
    <>
      <div className="flex items-start justify-between gap-4">
        <span className="text-xs uppercase tracking-[0.2em] text-accent">
          {kindLabel[project.kind]}
        </span>
        {project.meta && (
          <span className="text-xs text-muted-dim">{project.meta}</span>
        )}
      </div>

      <h3 className="mt-4 font-display text-2xl uppercase text-foreground">
        {project.title}
      </h3>
      <p className="mt-1 text-sm text-accent-bright/80">{project.tagline}</p>

      <p className="mt-4 flex-1 text-sm leading-relaxed text-muted">
        {project.description}
      </p>

      <ul className="mt-6 flex flex-wrap gap-2">
        {project.tech.map((t) => (
          <li
            key={t}
            className="rounded-full border border-border-strong px-3 py-1 text-xs text-muted"
          >
            {t}
          </li>
        ))}
      </ul>

      {project.href && (
        <span className="mt-6 inline-flex items-center gap-1 text-sm text-foreground opacity-70 transition-opacity group-hover:opacity-100">
          View repository
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
            →
          </span>
        </span>
      )}
    </>
  );

  if (project.href) {
    return (
      <a
        href={project.href}
        target="_blank"
        rel="noreferrer"
        className={className}
      >
        {content}
      </a>
    );
  }

  return <div className={className}>{content}</div>;
}
