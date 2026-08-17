"use client";

import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * A barred spiral galaxy, drawn rather than photographed. Every NASA image
 * of "the Milky Way" is either a labelled science diagram or a saturated
 * composite that fights this site's two-hue palette, so this is built from
 * the site's own tokens instead: a warm core at --accent-warm fading out
 * through --accent to nothing at the rim.
 *
 * Arms are logarithmic spirals (r = a·e^(bθ)), the same curve real spiral
 * galaxies follow, blurred heavily so they read as light rather than as
 * strokes.
 */

const ARMS = 4;
const TURNS = 0.85;
const INNER_R = 42;
const OUTER_R = 300;
const STEPS = 64;

function spiralArm(phase: number): string {
  const pts: string[] = [];
  for (let i = 0; i <= STEPS; i++) {
    const t = i / STEPS;
    const theta = phase + t * TURNS * Math.PI * 2;
    // Logarithmic growth, so the arm opens out the way a real one does
    // instead of coiling at a constant rate.
    const r = INNER_R * Math.pow(OUTER_R / INNER_R, t);
    pts.push(`${(Math.cos(theta) * r).toFixed(1)} ${(Math.sin(theta) * r).toFixed(1)}`);
  }
  return `M ${pts.join(" L ")}`;
}

const ARM_PATHS = Array.from({ length: ARMS }, (_, i) =>
  spiralArm((i / ARMS) * Math.PI * 2)
);

export function Galaxy() {
  const reducedMotion = useReducedMotion();

  return (
    <div
      className="pointer-events-none absolute left-1/2 top-1/2"
      aria-hidden="true"
      style={{
        width: "min(74vh, 68vw)",
        aspectRatio: "1 / 1",
        // Tilted a little off face-on, so it sits in the scene rather than
        // reading as a flat logo.
        // Centring lives entirely in this transform. Tailwind's
        // -translate-x-1/2 utilities are NOT used here: v4 emits them as the
        // standalone `translate` property, which composes with `transform`
        // instead of being overridden by it, and the shift lands twice.
        // Flattened rather than rotated in 3D: same tilted look, no
        // perspective context needed, and it stays compositor-cheap.
        transform: "translate(-50%, -50%) scaleY(0.62) rotate(-12deg)",
        maskImage: "radial-gradient(circle, #000 52%, transparent 84%)",
        WebkitMaskImage: "radial-gradient(circle, #000 52%, transparent 84%)",
        opacity: 0.46,
      }}
    >
      <svg
        viewBox="-340 -340 680 680"
        className="h-full w-full"
        style={{
          animation: reducedMotion ? undefined : "galaxy-spin 320s linear infinite",
        }}
      >
        <defs>
          <radialGradient id="galaxy-core">
            <stop offset="0%" stopColor="#fff4d6" stopOpacity="0.95" />
            <stop offset="22%" stopColor="#f5dcae" stopOpacity="0.7" />
            <stop offset="48%" stopColor="#d9a066" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#d9a066" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="galaxy-disc">
            <stop offset="0%" stopColor="#c3d6fb" stopOpacity="0.42" />
            <stop offset="45%" stopColor="#9db8e8" stopOpacity="0.24" />
            <stop offset="78%" stopColor="#6b7594" stopOpacity="0.11" />
            <stop offset="100%" stopColor="#6b7594" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="galaxy-arm" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f5dcae" stopOpacity="0.80" />
            <stop offset="40%" stopColor="#c3d6fb" stopOpacity="0.52" />
            <stop offset="100%" stopColor="#9db8e8" stopOpacity="0" />
          </linearGradient>

          {/* Heavy blur is what turns four strokes into a galaxy. */}
          <filter id="galaxy-blur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="13" />
          </filter>
          <filter id="galaxy-dust" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>

        {/* faint outer disc */}
        <circle cx="0" cy="0" r="330" fill="url(#galaxy-disc)" />

        {/* arms, twice: a wide diffuse pass and a tighter brighter one */}
        <g filter="url(#galaxy-blur)">
          {ARM_PATHS.map((d, i) => (
            <path
              key={`wide-${i}`}
              d={d}
              fill="none"
              stroke="url(#galaxy-arm)"
              strokeWidth="52"
              strokeLinecap="round"
            />
          ))}
        </g>
        <g filter="url(#galaxy-dust)" opacity="0.8">
          {ARM_PATHS.map((d, i) => (
            <path
              key={`tight-${i}`}
              d={d}
              fill="none"
              stroke="url(#galaxy-arm)"
              strokeWidth="9"
              strokeLinecap="round"
            />
          ))}
        </g>

        {/* central bulge */}
        <ellipse
          cx="0"
          cy="0"
          rx="120"
          ry="120"
          fill="url(#galaxy-core)"
          filter="url(#galaxy-dust)"
        />
      </svg>
    </div>
  );
}
