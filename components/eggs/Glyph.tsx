"use client";

import { useState } from "react";
import { useKenzProgress } from "@/lib/eggs/kenz";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * One of six glyphs. Still unlabelled — nothing on the page says "collect
 * these" — but no longer invisible: it's a small amber mote that breathes
 * slowly, brightens and shows a cursor on hover, and gives a clear burst
 * when taken. The original 3px, no-affordance version was technically
 * "findable but not signposted" and practically impossible to notice.
 * Found state persists via localStorage (lib/eggs/kenz.ts), per-glyph
 * idempotent.
 */
export function Glyph({ id, className = "" }: { id: string; className?: string }) {
  const { found, markFound } = useKenzProgress();
  const reducedMotion = useReducedMotion();
  const [justFound, setJustFound] = useState(false);
  const alreadyFound = found.includes(id);

  if (alreadyFound && !justFound) return null;

  function handleClick() {
    markFound(id);
    setJustFound(true);
    window.setTimeout(() => setJustFound(false), reducedMotion ? 0 : 900);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="A glyph"
      title="?"
      className={`group/glyph relative inline-flex h-4 w-4 cursor-pointer items-center justify-center align-middle ${className}`}
    >
      {/* halo */}
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full transition-opacity duration-300 group-hover/glyph:opacity-100"
        style={{
          background:
            "radial-gradient(circle, var(--accent-warm) 0%, transparent 68%)",
          opacity: justFound ? 0.95 : 0.42,
          transform: justFound ? "scale(2.1)" : undefined,
          transition: reducedMotion ? "none" : "transform 400ms ease-out, opacity 300ms",
        }}
      />
      {/* core */}
      <span
        aria-hidden="true"
        className="relative rounded-full"
        style={{
          width: justFound ? 9 : 5,
          height: justFound ? 9 : 5,
          background: "var(--accent-warm)",
          boxShadow: "0 0 6px 1px var(--accent-warm)",
          animation:
            reducedMotion || justFound
              ? undefined
              : "glyph-breathe 2.6s ease-in-out infinite",
          transition: reducedMotion ? "none" : "width 300ms, height 300ms",
        }}
      />
    </button>
  );
}
