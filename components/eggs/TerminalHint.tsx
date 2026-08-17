"use client";

import { fireEgg } from "@/lib/eggs/eggBus";
import { useReducedMotion } from "@/lib/useReducedMotion";

export function TerminalHint() {
  const reducedMotion = useReducedMotion();

  return (
    <button
      type="button"
      onClick={() => fireEgg("terminal-open")}
      aria-label="Open command terminal"
      title="⌘K / Ctrl+K"
      className="hidden items-center gap-1 rounded-full border border-border-strong px-3 py-1.5 font-mono text-xs text-muted-dim transition-colors hover:border-accent hover:text-accent-bright sm:flex"
    >
      <span>⌘K</span>
      <span
        aria-hidden="true"
        style={reducedMotion ? undefined : { animation: "blink 1.1s step-end infinite" }}
      >
        _
      </span>
    </button>
  );
}
