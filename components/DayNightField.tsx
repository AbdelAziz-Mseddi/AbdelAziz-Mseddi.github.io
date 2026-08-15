"use client";

import { useMemo } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { SnowField } from "@/components/SnowField";
import { useIsClient, useReducedMotion } from "@/lib/useReducedMotion";

type Star = { x: number; y: number; r: number; delay: number };

function pseudoRandom(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

export function DayNightField() {
  const { scrollYProgress } = useScroll();
  const reducedMotion = useReducedMotion();
  const isClient = useIsClient();

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

  if (reducedMotion) {
    return (
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: "linear-gradient(180deg, #0f0c1a 0%, #0a0f1a 100%)",
        }}
        aria-hidden="true"
      />
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
        className="absolute left-0 top-0 h-3 w-3 will-change-transform"
        style={{ transform: orbTransform }}
      >
        <motion.div
          className="absolute inset-0 rounded-full bg-[#e8623d] will-change-[opacity]"
          style={{
            opacity: warmOrbOpacity,
            filter: "drop-shadow(0 0 50px #e8623d) drop-shadow(0 0 100px #e8623d)",
          }}
        />
        <motion.div
          className="absolute inset-0 rounded-full bg-[#e7ebf5] will-change-[opacity]"
          style={{
            opacity: nightOpacity,
            filter: "drop-shadow(0 0 50px #e7ebf5) drop-shadow(0 0 100px #e7ebf5)",
          }}
        />
      </motion.div>

      <SnowField />
    </div>
  );
}
