"use client";

import { useMemo } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { Galaxy } from "@/components/Galaxy";
import { SnowField } from "@/components/SnowField";
import { useIsClient, useReducedMotion } from "@/lib/useReducedMotion";

type Star = { x: number; y: number; r: number; delay: number };

function pseudoRandom(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

export function DayNightField() {
  const { scrollYProgress: rawProgress } = useScroll();
  const reducedMotion = useReducedMotion();
  const isClient = useIsClient();

  // Fast/bursty wheel scrolling jumps the raw scroll position in big discrete
  // steps between animation frames — following it directly makes the
  // background/orb visibly skip rather than glide. Spring-smoothing the
  // driver value fixes that: the compositor still scrolls the actual page
  // instantly, but everything tied to this smoothed value continuously
  // eases toward the target instead of snapping to it.
  const scrollYProgress = useSpring(rawProgress, {
    stiffness: 120,
    damping: 26,
    restDelta: 0.001,
  });

  const stars = useMemo<Star[]>(() => {
    if (!isClient) return [];
    return Array.from({ length: 90 }, (_, i) => ({
      x: pseudoRandom(i * 1.37 + 0.11) * 100,
      y: pseudoRandom(i * 7.91 + 3.1) * 100,
      r: pseudoRandom(i * 3.53 + 9.7) * 1.4 + 0.3,
      delay: pseudoRandom(i * 5.19 + 1.3) * 4,
    }));
  }, [isClient]);

  // Three static gradient layers, crossfaded via opacity only — opacity is
  // GPU-compositable, so this stays smooth during fast scrolling. Animating
  // the gradient's colors directly (the previous approach) forces a full
  // repaint of the whole viewport on every scroll pixel, which the browser
  // can't keep up with — that's what read as "waits for scroll to stop."
  const duskOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const nightOpacity = useTransform(
    scrollYProgress,
    [0.15, 0.35, 0.65, 0.85],
    [0, 1, 1, 0]
  );
  const dawnOpacity = useTransform(scrollYProgress, [0.7, 1], [0, 1]);

  // Orb position via transform (compositor-only) instead of left/top.
  const orbX = useTransform(scrollYProgress, [0, 1], [8, 88]);
  const orbY = useTransform(scrollYProgress, (p) => {
    const arc = Math.sin(Math.min(Math.max(p, 0), 1) * Math.PI);
    return 82 - arc * 58;
  });
  const orbTransform = useTransform(
    [orbX, orbY],
    ([x, y]: number[]) => `translate3d(${x}vw, ${y}vh, 0)`
  );

  // Warm (ember) orb visible at dusk/dawn, cool (moon) orb visible at night —
  // crossfaded the same way as the sky layers, each a single static color.
  const warmOrbOpacity = useTransform(
    scrollYProgress,
    [0, 0.25, 0.4, 0.6, 0.75, 1],
    [1, 1, 0, 0, 1, 1]
  );

  const starOpacity = nightOpacity;
  // The galaxy belongs to the night only: over the dusk and dawn washes it
  // would be screening light onto an orange sky, which reads wrong.
  const galaxyOpacity = useTransform(nightOpacity, (v) => v * 0.85);

  // Planets sit far back in the scene — tiny scroll-linked drift for depth,
  // opacity tied to the night window like the stars. Saturn's rings are two
  // plain ellipses, not an image asset.
  const saturnDrift = useTransform(scrollYProgress, [0, 1], [0, -3]);
  const planetADrift = useTransform(scrollYProgress, [0, 1], [0, 2]);
  const planetBDrift = useTransform(scrollYProgress, [0, 1], [0, -1.5]);

  if (reducedMotion) {
    return (
      <div className="fixed inset-0 -z-10" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, #0f0c1a 0%, #0a0f1a 100%)",
          }}
        />
        <Galaxy />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <motion.div
        className="absolute inset-0 will-change-[opacity]"
        style={{
          opacity: duskOpacity,
          background: "linear-gradient(180deg, #180d16 0%, #3a1a12 100%)",
        }}
      />
      <motion.div
        className="absolute inset-0 will-change-[opacity]"
        style={{
          opacity: nightOpacity,
          background: "linear-gradient(180deg, #05060c 0%, #0a0f1a 100%)",
        }}
      />
      <motion.div
        className="absolute inset-0 will-change-[opacity]"
        style={{
          opacity: dawnOpacity,
          background: "linear-gradient(180deg, #12101f 0%, #3a2438 100%)",
        }}
      />

      <Galaxy opacity={galaxyOpacity} />


      <motion.div
        className="absolute inset-0 will-change-[opacity]"
        style={{ opacity: starOpacity }}
      >
        {stars.map((s, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: `${s.r}px`,
              height: `${s.r}px`,
              animation: `twinkle 3.5s ease-in-out ${s.delay}s infinite`,
            }}
          />
        ))}
      </motion.div>

      <motion.div
        className="absolute will-change-transform"
        style={{
          opacity: starOpacity,
          top: "14%",
          left: "78%",
          x: saturnDrift,
        }}
        aria-hidden="true"
      >
        <svg width="52" height="52" viewBox="-26 -26 52 52">
          <ellipse
            cx="0"
            cy="0"
            rx="24"
            ry="7"
            fill="none"
            stroke="#d9b98a"
            strokeOpacity="0.55"
            strokeWidth="2"
            transform="rotate(-18)"
          />
          <circle cx="0" cy="0" r="11" fill="#e3c99a" fillOpacity="0.9" />
          <ellipse
            cx="0"
            cy="0"
            rx="24"
            ry="7"
            fill="none"
            stroke="#d9b98a"
            strokeOpacity="0.85"
            strokeWidth="2"
            strokeDasharray="30 200"
            transform="rotate(-18)"
          />
        </svg>
      </motion.div>

      <motion.div
        className="absolute h-2 w-2 rounded-full will-change-transform"
        style={{
          opacity: starOpacity,
          top: "62%",
          left: "10%",
          background: "#8fa3c9",
          x: planetADrift,
        }}
        aria-hidden="true"
      />

      <motion.div
        className="absolute will-change-transform"
        style={{
          opacity: starOpacity,
          top: "30%",
          left: "20%",
          x: planetBDrift,
        }}
        aria-hidden="true"
      >
        {/* Gargantua-style rendering, built from the real optics rather than
            copied imagery: the far side of the accretion disk is gravitationally
            lensed up and over the shadow (that over-the-top arc is the film's
            signature look), a thinner lensed arc passes under, a bright photon
            ring hugs the event horizon, and the disk is brighter on one side
            for relativistic beaming. */}
        <svg
          width="72"
          height="46"
          viewBox="-36 -23 72 46"
          style={{ overflow: "visible" }}
        >
          <defs>
            <linearGradient id="bh-disk" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fff6e0" stopOpacity="0.95" />
              <stop offset="30%" stopColor="#ffcf87" stopOpacity="0.8" />
              <stop offset="65%" stopColor="#ff9a45" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#7a4a2a" stopOpacity="0.14" />
            </linearGradient>
            <radialGradient id="bh-halo">
              <stop offset="0%" stopColor="#ffd08a" stopOpacity="0.30" />
              <stop offset="55%" stopColor="#ff9a45" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#ff9a45" stopOpacity="0" />
            </radialGradient>
            <filter id="bh-soft" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="0.7" />
            </filter>
          </defs>

          <ellipse cx="0" cy="0" rx="34" ry="21" fill="url(#bh-halo)" />

          {/* far side of the disk, lensed up over the top */}
          <path
            d="M -26 1 A 26 17 0 0 1 26 1"
            fill="none"
            stroke="url(#bh-disk)"
            strokeWidth="2.6"
            filter="url(#bh-soft)"
          />

          {/* photon ring + event horizon */}
          <circle cx="0" cy="0" r="7.4" fill="none" stroke="#ffe6b8" strokeWidth="0.7" opacity="0.85" />
          <circle cx="0" cy="0" r="7" fill="#000" />

          {/* near side, passing in front and below the shadow */}
          <path
            d="M -26 0 A 26 5 0 0 0 26 0"
            fill="none"
            stroke="url(#bh-disk)"
            strokeWidth="3"
          />

          {/* thinner lensed arc under the shadow */}
          <path
            d="M -20 -1 A 20 12 0 0 0 20 -1"
            fill="none"
            stroke="url(#bh-disk)"
            strokeWidth="1.4"
            opacity="0.5"
            filter="url(#bh-soft)"
          />
        </svg>
      </motion.div>

      <motion.div
        className="absolute left-0 top-0 h-3 w-3 will-change-transform"
        style={{ transform: orbTransform }}
      >
        <motion.div
          className="absolute inset-0 rounded-full bg-[#e8623d] will-change-[opacity]"
          style={{
            opacity: warmOrbOpacity,
            boxShadow: "0 0 50px 16px #e8623d, 0 0 100px 32px #e8623d66",
          }}
        />
        <motion.div
          className="absolute inset-0 rounded-full bg-[#e7ebf5] will-change-[opacity]"
          style={{
            opacity: nightOpacity,
            boxShadow: "0 0 50px 16px #e7ebf5, 0 0 100px 32px #e7ebf566",
          }}
        />
      </motion.div>

      <SnowField />
    </div>
  );
}
