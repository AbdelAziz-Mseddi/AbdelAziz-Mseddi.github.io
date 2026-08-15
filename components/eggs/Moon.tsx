"use client";

import { useIsClient } from "@/lib/useReducedMotion";
import { getMoonPhase, isRamadan } from "@/lib/eggs/moon";

const SIZE = 18;
const R = SIZE / 2;

function moonPath(fraction: number): string {
  // fraction: 0 = new, 0.5 = full. rx is the terminator ellipse's horizontal
  // radius; its sign relative to sweep1 traces crescent vs. gibbous.
  // Sweep-flag rule verified empirically (pixel-area measurement against
  // the standard illumination formula), not derived by eye — SVG arc sweep
  // direction is easy to get backwards otherwise.
  const theta = fraction * 2 * Math.PI;
  const cosTheta = Math.cos(theta);
  const rx = Math.abs(cosTheta) * R;
  const sweep1 = fraction < 0.5 ? 1 : 0;
  const sweep2 = cosTheta < 0 ? sweep1 : 1 - sweep1;
  return `M 0 ${-R} A ${R} ${R} 0 0 ${sweep1} 0 ${R} A ${rx} ${R} 0 0 ${sweep2} 0 ${-R} Z`;
}

export function Moon() {
  const isClient = useIsClient();
  if (!isClient) return null;

  const now = new Date();
  const { fraction, name } = getMoonPhase(now);
  const warm = isRamadan(now);

  const litColor = warm ? "#e8a355" : "#e7ebf5";
  const darkColor = warm ? "#2a1c10" : "#12141c";

  return (
    <div
      className="pointer-events-none fixed left-4 top-20 z-30 flex items-center gap-2 opacity-70"
      title={name}
      aria-hidden="true"
    >
      <svg width={SIZE} height={SIZE} viewBox={`${-R} ${-R} ${SIZE} ${SIZE}`}>
        <circle cx="0" cy="0" r={R} fill={darkColor} />
        <path d={moonPath(fraction)} fill={litColor} />
      </svg>
    </div>
  );
}
