"use client";

import { useKenzProgress } from "@/lib/eggs/kenz";

/**
 * Minimal stand-in for the `kenz` terminal command (terminal — egg #5 —
 * isn't built yet). Shows progress as dots, nothing else. Silent at 0
 * found so it doesn't hint that anything exists.
 */
export function KenzIndicator() {
  const { foundCount, total, allFound } = useKenzProgress();

  if (foundCount === 0) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-40 flex items-center gap-1.5 rounded-full border border-border-strong bg-background/80 px-3 py-1.5 backdrop-blur-sm"
      title={allFound ? "kenz: all found" : `kenz: ${foundCount}/${total}`}
    >
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={`h-1.5 w-1.5 rounded-full ${
            i < foundCount ? "bg-accent-warm" : "bg-border-strong"
          }`}
        />
      ))}
    </div>
  );
}
