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
  // 0 at new moon, 1 at full — drives how hard the halo burns.
  const illumination = (1 - Math.cos(fraction * 2 * Math.PI)) / 2;

  const litColor = warm ? "#e8a355" : "#e7ebf5";
  const darkColor = warm ? "#2a1c10" : "#12141c";

  return (
    <div
      className="pointer-events-none fixed left-4 top-20 z-30 flex items-center gap-2 opacity-90"
      title={name}
      aria-hidden="true"
    >
      <div className="relative">
        {/* Soft halo behind the disc — sized off the lit fraction so a thin
            crescent glows faintly and a full moon glows hard. */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: SIZE * 3.4,
            height: SIZE * 3.4,
            background: `radial-gradient(circle, ${litColor}40 0%, ${litColor}18 38%, transparent 70%)`,
            opacity: 0.35 + illumination * 0.65,
          }}
        />
        <svg
          width={SIZE}
          height={SIZE}
          viewBox={`${-R} ${-R} ${SIZE} ${SIZE}`}
          className="relative"
          style={{
            filter: `drop-shadow(0 0 ${3 + illumination * 5}px ${litColor}cc) drop-shadow(0 0 ${
              8 + illumination * 12
            }px ${litColor}66)`,
          }}
        >
          <circle cx="0" cy="0" r={R} fill={darkColor} />
          <path d={moonPath(fraction)} fill={litColor} />
        </svg>
      </div>
    </div>
  );
}
