"use client";

import { useState } from "react";

export type Tile = {
  value: string;
  label: string;
  caption?: string;
  accent?: boolean;
};

export type Segment = {
  key: string;
  label: string;
  color: string;
  pct: number;
  frac: number;
};

/** Static SVG donut. Each slice is an arc of one stroked circle, offset by the
 *  running total so the slices chain around the ring. */
function Donut({ segments, small }: { segments: Segment[]; small?: boolean }) {
  const r = 42;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg
      viewBox="0 0 120 120"
      className={`${small ? "h-16 w-16" : "h-24 w-24"} shrink-0 -rotate-90`}
    >
      <circle cx="60" cy="60" r={r} fill="none" stroke="var(--border)" strokeWidth="15" />
      {segments.map((s) => {
        const len = s.frac * c;
        const dash = `${len} ${c - len}`;
        const el = (
          <circle
            key={s.key}
            cx="60"
            cy="60"
            r={r}
            fill="none"
            stroke={s.color}
            strokeWidth="15"
            strokeDasharray={dash}
            strokeDashoffset={-offset}
          />
        );
        offset += len;
        return el;
      })}
    </svg>
  );
}

export function GithubActivityPanel({
  total,
  tiles,
  segments,
  includesPrivate,
}: {
  total: number;
  tiles: Tile[];
  segments: Segment[];
  includesPrivate: boolean;
}) {
  const [open, setOpen] = useState(false);

  const hasDonut = segments.length > 0;
  // The donut absorbs whatever cells are left over so the grid never shows an
  // empty tile: it fills the trailing gap of the last row, or takes a full row
  // of its own when the tiles already divide evenly. When only a single cell
  // is left it stacks the ring over the legend so it still fits.
  const rem = (4 - (tiles.length % 4)) % 4;
  const donutSpan = hasDonut ? (rem === 0 ? 4 : rem) : 0;
  const stacked = donutSpan === 1;
  const fillerCount = hasDonut ? 0 : rem;

  return (
    <div className="mt-8 border-t border-border pt-8">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="group flex w-full items-baseline justify-between gap-3 text-left"
      >
        <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1.5">
          <span className="font-display text-3xl uppercase text-foreground">
            <span className="text-accent-warm">{total.toLocaleString()}</span>{" "}
            contributions
          </span>
          <span
            className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] ${
              includesPrivate
                ? "border-accent-warm/40 text-accent-warm"
                : "border-border-strong text-muted-dim"
            }`}
          >
            {includesPrivate ? "public + private" : "public only"}
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-muted-dim transition-colors group-hover:text-accent-bright">
          {"// last 12 months"}
          <span
            aria-hidden="true"
            className="inline-block transition-transform duration-300"
            style={{ transform: open ? "rotate(90deg)" : "none" }}
          >
            ›
          </span>
        </span>
      </button>

      {open && (
        <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-4">
          {tiles.map((t) => (
            <div key={t.label} className="bg-background-alt p-5">
              <p
                className={`font-display text-2xl sm:text-3xl ${
                  t.accent ? "text-accent-warm" : "text-foreground"
                }`}
              >
                {t.value}
              </p>
              <p className="mt-1 text-xs uppercase tracking-wide text-muted-dim">
                {t.label}
              </p>
              {t.caption && (
                <p className="mt-0.5 font-mono text-[10px] text-muted-dim/80">
                  {t.caption}
                </p>
              )}
            </div>
          ))}

          {Array.from({ length: fillerCount }).map((_, i) => (
            <div key={`pad-${i}`} className="bg-background-alt" />
          ))}

          {hasDonut && (
            <div
              className={`flex bg-background-alt p-5 ${
                stacked ? "flex-col items-center gap-4" : "items-center gap-5"
              }`}
              style={{ gridColumn: `span ${donutSpan}` }}
            >
              <Donut segments={segments} small={stacked} />
              <div className={stacked ? "w-full" : "min-w-0 flex-1"}>
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-dim">
                  {"// where the work went"}
                </p>
                <ul className="mt-2 space-y-1.5">
                  {segments.map((s) => (
                    <li key={s.key} className="flex items-center gap-2 text-sm">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-sm"
                        style={{ background: s.color }}
                      />
                      <span className="truncate text-muted">{s.label}</span>
                      <span className="ml-auto font-mono text-xs tabular-nums text-foreground">
                        {s.pct}%
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
