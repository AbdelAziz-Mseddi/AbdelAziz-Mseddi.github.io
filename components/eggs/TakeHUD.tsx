"use client";

import { useEffect, useRef, useState } from "react";
import { useSingleTakeMode, getTake } from "@/lib/eggs/singleTake";
import { useReducedMotion } from "@/lib/useReducedMotion";

const FPS = 24;

/** HH:MM:SS:FF at 24fps — film timecode, not video's 30. */
function timecode(ms: number) {
  const totalFrames = Math.floor((ms / 1000) * FPS);
  const f = totalFrames % FPS;
  const totalSeconds = Math.floor(totalFrames / FPS);
  const s = totalSeconds % 60;
  const m = Math.floor(totalSeconds / 60) % 60;
  const h = Math.floor(totalSeconds / 3600);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(h)}:${p(m)}:${p(s)}:${p(f)}`;
}

/**
 * The viewfinder for single-take mode. Without it the mode is invisible:
 * you turn it on and nothing tells you the camera is rolling.
 *
 * The clock deliberately survives navigation. Moving from the work index to
 * a project page and back does not reset it, because in single-take mode
 * that move is not a cut — it is the same shot continuing, and the running
 * timecode is the proof.
 */
export function TakeHUD() {
  const enabled = useSingleTakeMode();
  const reducedMotion = useReducedMotion();
  const [elapsed, setElapsed] = useState(0);
  const frame = useRef<number>(0);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    function tick() {
      if (cancelled) return;
      setElapsed(Date.now() - getTake().startedAt);
      frame.current = requestAnimationFrame(tick);
    }
    frame.current = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame.current);
    };
  }, [enabled]);

  if (!enabled) return null;

  const { takeNumber } = getTake();

  return (
    <div
      className="pointer-events-none fixed bottom-5 left-5 z-50 flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-dim"
      aria-hidden="true"
    >
      <span
        className="block h-[7px] w-[7px] rounded-full"
        style={{
          background: "#c2452f",
          boxShadow: "0 0 8px 1px #c2452f",
          animation: reducedMotion ? undefined : "rec-pulse 1.6s ease-in-out infinite",
        }}
      />
      <span style={{ color: "#c2452f" }}>rec</span>
      <span className="tabular-nums text-foreground/70">{timecode(elapsed)}</span>
      <span className="text-muted-dim/60">take {takeNumber}</span>
    </div>
  );
}
