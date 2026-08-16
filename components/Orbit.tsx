"use client";

import type { ReactNode } from "react";

/**
 * Classic CSS orbit trick: a pivot div rotates continuously (pure
 * `transform: rotate`, compositor-only — cheap even with many of these
 * running at once), a child anchored to its edge sweeps around with it,
 * and an inner counter-rotation cancels that spin so the content itself
 * stays upright instead of tumbling.
 *
 * The whole thing traces a perfect circle by construction. To get the
 * tilted-ellipse look of a real orbit diagram instead, an outer wrapper
 * squashes that circle vertically (scaleY), and an inner wrapper
 * un-squashes just the rendered content (scaleY the inverse) so the
 * planet/moon itself doesn't come out looking flattened — only its
 * path does. The squash wrapper is explicitly sized and centered the
 * same way the pivot is (not left to an implicit 0-size box with a
 * `center` transform-origin keyword) so its origin point is exact —
 * an ambiguous origin here is what caused orbits to trace off-center
 * from their drawn guide rings.
 */
export function Orbit({
  radius,
  seconds,
  reducedMotion,
  staticAngle = 0,
  paused = false,
  ellipseRatio = 1,
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
  /** ry/rx of the orbit path. 1 = circle, <1 = flattened ellipse. */
  ellipseRatio?: number;
  children: ReactNode;
}) {
  if (reducedMotion) {
    const rad = (staticAngle * Math.PI) / 180;
    const x = Math.cos(rad) * radius;
    const y = Math.sin(rad) * radius * ellipseRatio;
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
      className="pointer-events-none absolute left-1/2 top-1/2"
      style={{
        width: radius * 2,
        height: radius * 2,
        marginLeft: -radius,
        marginTop: -radius,
        transform: `scaleY(${ellipseRatio})`,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 will-change-transform"
        style={{
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
          <div style={{ transform: `scaleY(${1 / ellipseRatio})` }}>
            <div
              className="pointer-events-auto"
              style={{ transform: "translate(-50%, -50%)" }}
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
