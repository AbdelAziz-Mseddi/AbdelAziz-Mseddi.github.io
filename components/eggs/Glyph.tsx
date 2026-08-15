"use client";

import { useState } from "react";
import { useKenzProgress } from "@/lib/eggs/kenz";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * One of six unmarked glyphs. Deliberately styled to read as a stray
 * decorative dot rather than a UI element — no hover affordance, no
 * cursor change, nothing that signposts it. Found state persists via
 * localStorage (lib/eggs/kenz.ts) and is per-glyph idempotent.
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
      aria-hidden="true"
      tabIndex={-1}
      className={`inline-block h-[3px] w-[3px] rounded-full bg-current opacity-40 transition-opacity hover:opacity-40 ${
        justFound ? "scale-150 opacity-90" : ""
      } ${className}`}
      style={{ transition: reducedMotion ? "none" : undefined }}
    />
  );
}
