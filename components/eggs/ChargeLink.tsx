"use client";

import { useRef, useState, type MouseEvent, type ReactNode } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

const CHARGE_MS = 1300;
const MAX_READOUT = 9001; // it's always over 9000, quietly

export function ChargeLink({
  href,
  onClick,
  className,
  children,
}: {
  href: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
  className?: string;
  children: ReactNode;
}) {
  const reducedMotion = useReducedMotion();
  const [charge, setCharge] = useState(0); // 0..1
  const [maxed, setMaxed] = useState(false);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const directionRef = useRef<1 | -1>(1);

  function step(timestamp: number) {
    if (startRef.current === null) startRef.current = timestamp;
    const elapsed = timestamp - startRef.current;
    const delta = (elapsed / CHARGE_MS) * directionRef.current;

    setCharge((prev) => {
      const next = Math.min(1, Math.max(0, prev + delta));
      if (next >= 1) setMaxed(true);
      if (next <= 0) setMaxed(false);
      return next;
    });

    startRef.current = timestamp;
    rafRef.current = requestAnimationFrame(step);
  }

  function beginCharge() {
    if (reducedMotion) return;
    directionRef.current = 1;
    startRef.current = null;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(step);
  }

  function releaseCharge() {
    if (reducedMotion) return;
    directionRef.current = -1;
    startRef.current = null;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(step);
    // once fully decayed the rAF loop naturally stops mattering, but clear
    // it after the decay window so it doesn't spin forever in the background
    window.setTimeout(() => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    }, CHARGE_MS + 100);
  }

  const readout = Math.round(charge * MAX_READOUT);

  return (
    <span className="relative inline-flex flex-col">
      <a
        href={href}
        onClick={onClick}
        onPointerDown={beginCharge}
        onPointerUp={releaseCharge}
        onPointerLeave={releaseCharge}
        onTouchEnd={releaseCharge}
        className={className}
        style={
          charge > 0
            ? {
                textShadow: `0 0 ${charge * 18}px var(--accent-warm)`,
              }
            : undefined
        }
      >
        {children}
      </a>
      {charge > 0.02 && (
        <span
          className="pointer-events-none absolute left-0 top-full mt-1 font-mono text-[10px] tabular-nums text-accent-warm"
          aria-hidden="true"
        >
          {maxed ? "// limit exceeded" : readout}
        </span>
      )}
    </span>
  );
}
