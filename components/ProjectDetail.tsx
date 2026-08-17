"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Project } from "@/lib/content";
import { Glyph } from "@/components/eggs/Glyph";
import { useSingleTakeMode } from "@/lib/eggs/singleTake";
import { navigateWithTransition } from "@/lib/eggs/navigateWithTransition";
import { useReducedMotion } from "@/lib/useReducedMotion";

// Six of eighteen project pages carry a glyph — spread across tiers and
// lanes rather than clustered on the obvious featured ones. (grade-pipeline,
// docker-ci-labs, cp-cave used to hold three of these before those projects
// were removed from the site; relocated to drose, tutoring-manager, and
// devify to keep the hunt at exactly six findable glyphs.)
const GLYPH_PROJECT_IDS = new Set([
  "qrail",
  "cr3m3-brul33",
  "sockets-tp",
  "drose",
  "tutoring-manager",
  "devify",
]);

export function ProjectDetail({ project }: { project: Project }) {
  const hasGlyph = GLYPH_PROJECT_IDS.has(project.id);
  const router = useRouter();
  const singleTake = useSingleTakeMode();
  const reducedMotion = useReducedMotion();

  function onBackClick(e: React.MouseEvent) {
    if (!singleTake) return;
    e.preventDefault();
    navigateWithTransition(router, "/#work", reducedMotion);
  }

  return (
    <article className="mx-auto max-w-3xl px-6 pb-28 sm:px-10">
      <Link
        href="/#work"
        onClick={onBackClick}
        className="font-mono text-xs uppercase tracking-[0.2em] text-muted-dim transition-colors hover:text-accent-bright"
      >
        {"← back to work"}
      </Link>

      <div className="mt-8 flex items-start justify-between gap-4">
        <p
          className="section-num font-mono text-sm text-accent"
          style={
            singleTake
              ? ({ viewTransitionName: `take-num-${project.id}` } as React.CSSProperties)
              : undefined
          }
        >
          Session {project.session}
        </p>
        {project.result && (
          <p className="text-right text-xs text-accent-warm">{project.result}</p>
        )}
      </div>

      <h1
        className="mt-3 font-display text-balance text-5xl uppercase leading-none text-foreground sm:text-6xl"
        style={
          singleTake
            ? ({ viewTransitionName: `take-title-${project.id}` } as React.CSSProperties)
            : undefined
        }
      >
        {project.title}
        {hasGlyph && <Glyph id={project.id} className="ml-3 align-middle" />}
      </h1>
      {project.subtitle && (
        <p className="mt-2 text-lg text-accent-bright/80">{project.subtitle}</p>
      )}

      {project.context && (
        <p className="mt-6 text-sm text-muted-dim">{project.context}</p>
      )}

      <p className="mt-6 text-lg leading-relaxed text-muted">{project.blurb}</p>
      {project.detail && (
        <p className="mt-4 text-lg leading-relaxed text-muted">{project.detail}</p>
      )}

      {project.team && project.team.length > 0 && (
        <p className="mt-6 text-sm text-muted-dim">
          Team: {project.team.join(", ")}
        </p>
      )}

      {project.evidence && (
        <div className="mt-10 border-t border-border pt-8">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-dim">
            {"// what I shipped"}
          </p>
          <p className="mt-2 text-sm text-accent-warm">
            {project.evidence.commits} commits · +{project.evidence.additions}{" "}
            / -{project.evidence.deletions}
          </p>
          <ul className="mt-4 space-y-2">
            {project.evidence.highlights.map((h) => (
              <li
                key={h}
                className="flex gap-3 text-sm leading-relaxed text-muted"
              >
                <span aria-hidden="true" className="text-accent">
                  ·
                </span>
                {h}
              </li>
            ))}
          </ul>
        </div>
      )}

      <ul className="mt-8 flex flex-wrap gap-2">
        {project.stack.map((t) => (
          <li
            key={t}
            className="rounded-full border border-border-strong px-3 py-1 text-xs text-muted"
          >
            {t}
          </li>
        ))}
      </ul>

      {project.links.repo && (
        <a
          href={project.links.repo}
          target="_blank"
          rel="noreferrer"
          className="mt-10 inline-flex items-center gap-1 text-sm text-foreground opacity-70 transition-opacity hover:opacity-100"
        >
          View repository
          <span aria-hidden="true">→</span>
        </a>
      )}
    </article>
  );
}
