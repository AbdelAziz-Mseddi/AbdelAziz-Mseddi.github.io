"use client";

import { motion, type MotionValue } from "motion/react";

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
 * Composited with `screen` so the image's black drops out entirely and only
 * its light reaches the page: drawn normally, a pure-black frame over a
 * #05070c background reads as a dark disc with a visible edge. That also
 * lets the rim fade be a CSS mask rather than baked alpha, keeping the asset
 * a 139 KB JPEG instead of a 448 KB PNG.
 */
/**
 * `opacity` is applied to this element directly rather than to a wrapper.
 * A wrapper carrying opacity would form a stacking context, and the screen
 * blend below would then composite against that group instead of against
 * the page, which is exactly the dark-disc problem this is avoiding.
 */
export function Galaxy({ opacity }: { opacity?: MotionValue<number> }) {
  return (
    <motion.div
      className="pointer-events-none absolute"
      aria-hidden="true"
      style={{
        // Sits low and to the right, large enough that the arms run off the
        // bottom edge rather than ending inside the frame.
        left: "70%",
        top: "86%",
        width: "min(94vh, 74vw)",
        aspectRatio: "1 / 1",
        // Centring lives entirely in this transform. Tailwind's
        // -translate-x-1/2 utilities are NOT used here: v4 emits them as the
        // standalone `translate` property, which composes with `transform`
        // instead of being overridden by it, so the shift would land twice.
        // scaleX(-1) mirrors the source so the arms sweep up to the
        // right rather than to the left.
        transform: "translate(-50%, -50%) scaleX(-1)",
        backgroundImage: "url(/andromeda.jpg)",
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        opacity: opacity ?? 0.85,
        // The image's black is #000 while the page sits at #05070c, so drawn
        // normally it reads as a dark hole punched in the background with a
        // halo at its edge. `screen` makes black contribute nothing at all,
        // so only the galaxy's light lands on the page and there is no edge
        // to see.
        mixBlendMode: "screen",
        // Still masked, so the square frame's corners never clip in.
        maskImage: "radial-gradient(circle, #000 46%, transparent 78%)",
        WebkitMaskImage: "radial-gradient(circle, #000 46%, transparent 78%)",
      }}
    />
  );
}
