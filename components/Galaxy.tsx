"use client";

import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * Andromeda (M31), centred behind the whole site.
 *
 * Source is NASA's GALEX ultraviolet mosaic (PIA04921), public domain. Its
 * natural colouring happens to be the site's own palette already: a warm
 * gold bulge and cool blue arms. Processing was therefore minimal, and
 * mostly about the mosaic's seams, which show as faint circular tiles a few
 * levels above black. Flooring everything below level 34 erases them
 * without touching the galaxy.
 *
 * The rim fade is a CSS mask rather than baked alpha, which keeps the asset
 * a 139 KB JPEG instead of a 448 KB PNG.
 */
export function Galaxy() {
  const reducedMotion = useReducedMotion();

  return (
    <div
      className="pointer-events-none absolute left-1/2 top-1/2"
      aria-hidden="true"
      style={{
        width: "min(96vh, 88vw)",
        aspectRatio: "1 / 1",
        // Centring lives entirely in this transform. Tailwind's
        // -translate-x-1/2 utilities are NOT used here: v4 emits them as the
        // standalone `translate` property, which composes with `transform`
        // instead of being overridden by it, so the shift would land twice.
        transform: "translate(-50%, -50%)",
        backgroundImage: "url(/andromeda.jpg)",
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        opacity: 0.62,
        // Fades the square frame out well before its edge.
        maskImage: "radial-gradient(circle, #000 34%, transparent 66%)",
        WebkitMaskImage: "radial-gradient(circle, #000 34%, transparent 66%)",
        animation: reducedMotion
          ? undefined
          : "galaxy-spin 420s linear infinite",
      }}
    />
  );
}
