import Link from "next/link";
import type { Project } from "@/lib/content";

const kindLabel: Record<string, string> = {
  hackathon: "Hackathon",
  competition: "Competition",
  "self-directed": "Self-directed",
  project: "Project",
  coursework: "Coursework",
  personal: "Personal",
  design: "Design",
};

export function ProjectCardLinked({ project }: { project: Project }) {
  return (
    <Link
      href={`/work/${project.id}`}
      className="card-glow group relative flex h-full flex-col rounded-2xl border border-border bg-surface p-7 transition-colors hover:bg-surface-hover"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="text-xs uppercase tracking-[0.2em] text-accent">
          {kindLabel[project.kind] ?? project.kind}
        </span>
        {project.result && (
          <span className="max-w-[55%] text-right text-xs text-accent-warm">
            {project.result}
          </span>
        )}
      </div>

      <h3 className="mt-4 font-display text-2xl uppercase text-foreground">
        {project.title}
      </h3>
      {project.subtitle && (
        <p className="mt-1 text-sm text-accent-bright/80">{project.subtitle}</p>
      )}

      <p className="mt-4 flex-1 text-sm leading-relaxed text-muted">
        {project.blurb}
      </p>

      <ul className="mt-6 flex flex-wrap gap-2">
        {project.stack.slice(0, 4).map((t) => (
          <li
            key={t}
            className="rounded-full border border-border-strong px-3 py-1 text-xs text-muted"
          >
            {t}
          </li>
        ))}
      </ul>

      <span className="mt-6 inline-flex items-center gap-1 text-sm text-foreground opacity-70 transition-opacity group-hover:opacity-100">
        Read more
        <span
          aria-hidden="true"
          className="transition-transform group-hover:translate-x-1"
        >
          →
        </span>
      </span>
    </Link>
  );
}
