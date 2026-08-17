"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LANE_COLOR, getLaneLabel, type Project } from "@/lib/content";
import { useSingleTakeMode } from "@/lib/eggs/singleTake";
import { navigateWithTransition } from "@/lib/eggs/navigateWithTransition";
import { useReducedMotion } from "@/lib/useReducedMotion";

const kindLabel: Record<string, string> = {
  hackathon: "Hackathon",
  competition: "Competition",
  "self-directed": "Self-directed",
  project: "Project",
  coursework: "Coursework",
  personal: "Personal",
  design: "Design",
};

/** Rank is carried by type scale alone, so the index needs no cards, borders
 *  or surface fills to show what matters most. */
const TIER = {
  featured: {
    num: "text-[44px] sm:text-[64px]",
    title: "text-[34px] sm:text-[58px]",
    blurb: "text-[15px] max-w-[58ch]",
    row: "",
  },
  standard: {
    num: "text-[30px] sm:text-[40px]",
    title: "text-[26px] sm:text-[34px]",
    blurb: "text-sm max-w-[64ch]",
    row: "",
  },
  archive: {
    num: "text-[22px] sm:text-[26px]",
    title: "text-[20px] sm:text-[22px]",
    blurb: "text-[13px] max-w-[64ch]",
    row: "opacity-60 hover:opacity-100 transition-opacity",
  },
} as const;

function compact(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k` : `${n}`;
}

export function ProjectRow({ project }: { project: Project }) {
  const router = useRouter();
  const singleTake = useSingleTakeMode();
  const reducedMotion = useReducedMotion();
  const href = `/work/${project.id}`;
  const t = TIER[project.tier] ?? TIER.standard;
  const ev = project.evidence;

  function onClick(e: React.MouseEvent) {
    if (!singleTake) return;
    e.preventDefault();
    navigateWithTransition(router, href, reducedMotion);
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`work-row group relative grid grid-cols-[56px_1fr] items-start gap-x-5 gap-y-3 border-b border-border py-8 sm:grid-cols-[96px_1fr_210px] sm:gap-x-8 ${t.row}`}
    >
      {/* Hairline that draws across on hover, in place of a panel lighting up. */}
      <span aria-hidden="true" className="work-rule" />

      {/* Paired with the same names on the project page so the View
          Transition carries these two elements across the navigation instead
          of crossfading the whole document. That is the "single take": the
          camera stays on the subject through the move. */}
      <span
        aria-hidden="true"
        style={
          singleTake
            ? ({ viewTransitionName: `take-num-${project.id}` } as React.CSSProperties)
            : undefined
        }
        className={`font-display leading-[0.85] text-muted-dim transition-colors duration-300 group-hover:text-accent-warm ${t.num}`}
      >
        {project.session}
      </span>

      <span className="block">
        <span
          style={
            singleTake
              ? ({ viewTransitionName: `take-title-${project.id}` } as React.CSSProperties)
              : undefined
          }
          className={`block font-display uppercase leading-[0.92] ${t.title}`}
        >
          {project.title}
        </span>
        {project.subtitle && (
          <span className="mt-1.5 block text-sm text-accent-bright/75">
            {project.subtitle}
          </span>
        )}
        <span className={`mt-3 block leading-relaxed text-muted ${t.blurb}`}>
          {project.blurb}
        </span>
        {project.tier !== "archive" && (
          <span className="mt-3.5 block font-mono text-[11px] tracking-wide text-muted-dim">
            {project.stack.slice(0, 5).join(" / ")}
          </span>
        )}
      </span>

      <span className="col-start-2 flex flex-col items-start gap-2 pt-1 text-left sm:col-start-3 sm:items-end sm:text-right">
        {/* Ticks are decorative on their own; the legend above the list
            decodes the colours and the sr-only text names them outright. */}
        <span className="flex gap-1.5">
          <span className="sr-only">
            {project.lanes.map(getLaneLabel).join(", ")}
          </span>
          {project.lanes.map((lane) => (
            <span
              key={lane}
              aria-hidden="true"
              title={getLaneLabel(lane)}
              className="block h-[3px] w-[22px] rounded-sm opacity-55 transition-opacity duration-300 group-hover:opacity-100"
              style={{ background: LANE_COLOR[lane] ?? "var(--muted-dim)" }}
            />
          ))}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-dim">
          {kindLabel[project.kind] ?? project.kind} · {project.year}
        </span>
        {project.result && (
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent-warm">
            {project.result}
          </span>
        )}
        {ev && (
          <span className="font-mono text-[10px] text-muted-dim">
            {ev.commits} commits{" "}
            <span style={{ color: "#5fb8a8" }}>+{compact(ev.additions)}</span>{" "}
            <span style={{ color: "#c9784f" }}>−{compact(ev.deletions)}</span>
          </span>
        )}
      </span>
    </Link>
  );
}
