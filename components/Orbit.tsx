"use client";

import type { ReactNode } from "react";

/**
 * Classic CSS orbit trick: a pivot div rotates continuously (pure
 * `transform: rotate`, compositor-only — cheap even with many of these
 * running at once), a child anchored to its edge sweeps around with it,
 * and an inner counter-rotation cancels that spin so the content itself
 * stays upright instead of tumbling.
 */
export function Orbit({
  radius,
  seconds,
  reducedMotion,
  staticAngle = 0,
  paused = false,
  children,
}: {
  radius: number;
  seconds: number;
  reducedMotion: boolean;
  staticAngle?: number;
  /** A continuously orbiting target can't actually be hovered — not by a
   * real cursor, not by Playwright's actionability check. Controlled via
   * React state (not a CSS :hover selector) so a planet's own orbit can be
   * paused by hovering content nested inside it, which a pure descendant
   * selector can't reach upward to do. */
  paused?: boolean;
  children: ReactNode;
}) {
  if (reducedMotion) {
    const rad = (staticAngle * Math.PI) / 180;
    const x = Math.cos(rad) * radius;
    const y = Math.sin(rad) * radius;
    return (
      <div
        className="absolute left-1/2 top-1/2"
        style={{ transform: `translate(${x}px, ${y}px) translate(-50%, -50%)` }}
      >
        {children}
      </div>
    );
  }

  const playState = paused ? "paused" : "running";
  // A CSS animation always starts at its 0% keyframe regardless of props —
  // staticAngle alone does nothing here. A negative delay scrubs the
  // animation forward to where it would already be, so orbits actually
  // start spread apart instead of all bunched at the same angle for the
  // first many seconds (which, before this, also caused their hit-areas
  // to overlap and made clicks land on the wrong planet).
  const delay = -(staticAngle / 360) * seconds;

  return (
    <div
      className="pointer-events-none absolute left-1/2 top-1/2 will-change-transform"
      style={{
        width: radius * 2,
        height: radius * 2,
        marginLeft: -radius,
        marginTop: -radius,
        animation: `orbit-spin ${seconds}s linear infinite`,
        animationDelay: `${delay}s`,
        animationPlayState: playState,
      }}
    >
      <div
        className="pointer-events-none absolute left-1/2 top-0 will-change-transform"
        style={{
          animation: `orbit-spin ${seconds}s linear infinite reverse`,
          animationDelay: `${delay}s`,
          animationPlayState: playState,
        }}
      >
        <div
          className="pointer-events-auto"
          style={{ transform: "translate(-50%, -50%)" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
