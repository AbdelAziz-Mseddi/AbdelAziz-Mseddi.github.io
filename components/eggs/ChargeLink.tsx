"use client";

import {
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
} from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

const CHARGE_MS = 1300;
const MAX_READOUT = 9001; // it's always over 9000, quietly
const OVER_NINE_THOUSAND_HOLD_MS = 550;

// Aura color progression as charge climbs: white -> yellow -> red -> blue,
// settling on a pale violet-white for the final stretch. Reference to the
// technique (color-staged power-up), not any copied asset.
const AURA_STOPS: [number, [number, number, number]][] = [
  [0, [255, 255, 255]],
  [0.25, [255, 213, 53]],
  [0.5, [255, 43, 43]],
  [0.75, [56, 113, 255]],
  [1, [235, 225, 255]],
];

function toHex(n: number): string {
  return Math.round(n).toString(16).padStart(2, "0");
}

// Returns hex (not rgb()) so callers can append a two-digit alpha suffix
// directly, matching the #rrggbbaa convention already used elsewhere in
// this codebase (e.g. the day/night orb's box-shadow).
function auraColor(charge: number): string {
  const c = Math.min(1, Math.max(0, charge));
  for (let i = 0; i < AURA_STOPS.length - 1; i++) {
    const [p0, c0] = AURA_STOPS[i];
    const [p1, c1] = AURA_STOPS[i + 1];
    if (c >= p0 && c <= p1) {
      const t = p1 === p0 ? 0 : (c - p0) / (p1 - p0);
      const r = c0[0] + (c1[0] - c0[0]) * t;
      const g = c0[1] + (c1[1] - c0[1]) * t;
      const b = c0[2] + (c1[2] - c0[2]) * t;
      return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }
  }
  const [r, g, b] = AURA_STOPS[AURA_STOPS.length - 1][1];
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

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
  const [showOverNine, setShowOverNine] = useState(false);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const directionRef = useRef<1 | -1>(1);
  const maxedAtRef = useRef<number | null>(null);

  function step(timestamp: number) {
    if (startRef.current === null) startRef.current = timestamp;
    const elapsed = timestamp - startRef.current;
    const delta = (elapsed / CHARGE_MS) * directionRef.current;

    setCharge((prev) => {
      const next = Math.min(1, Math.max(0, prev + delta));
      if (next >= 1) {
        setMaxed(true);
        if (maxedAtRef.current === null) maxedAtRef.current = timestamp;
      } else {
        setMaxed(false);
        maxedAtRef.current = null;
      }
      return next;
    });

    setShowOverNine(
      maxedAtRef.current !== null &&
        timestamp - maxedAtRef.current < OVER_NINE_THOUSAND_HOLD_MS
    );

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
  const color = auraColor(charge);
  const shimmer = maxed && !reducedMotion;

  let anchorStyle: CSSProperties | undefined;
  if (shimmer) {
    anchorStyle = { animation: "aura-shimmer 1.1s ease-in-out infinite" };
  } else if (charge > 0) {
    anchorStyle = {
      textShadow: `0 0 ${charge * 18}px ${color}, 0 0 ${charge * 34}px ${color}66`,
    };
  }

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
        style={anchorStyle}
      >
        {children}
      </a>
      {charge > 0.02 && (
        <span
          className="pointer-events-none absolute left-0 top-full mt-1 font-mono text-[10px] tabular-nums text-accent-warm"
          aria-hidden="true"
        >
          {maxed ? (showOverNine ? "IT'S OVER 9000" : "// limit exceeded") : readout}
        </span>
      )}
    </span>
  );
}
