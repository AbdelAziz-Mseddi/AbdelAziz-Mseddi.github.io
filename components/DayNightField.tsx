"use client";

import { useMemo } from "react";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "motion/react";
import { SnowField } from "@/components/SnowField";
import { useIsClient, useReducedMotion } from "@/lib/useReducedMotion";

const PROGRESS_STOPS = [0, 0.18, 0.42, 0.58, 0.82, 1];

const SKY_TOP = [
  "#180d16", // dusk — plum
  "#0f0c1a", // dusk deepening
  "#05060c", // full night
  "#05060c", // full night (hold)
  "#0a0e1e", // pre-dawn
  "#12101f", // dawn — soft indigo
];

const SKY_BOTTOM = [
  "#3a1a12", // dusk — ember horizon
  "#241220", // dusk fading
  "#0a0f1a", // night horizon
  "#0a0f1a", // night horizon (hold)
  "#171a2c", // pre-dawn horizon
  "#3a2438", // dawn — rose horizon
];

const ORB_COLOR = [
  "#e8623d", // setting sun — ember
  "#d9a066", // low warm glow
  "#e7ebf5", // moon — pale
  "#e7ebf5", // moon (hold)
  "#d9a3a0", // pre-dawn blush
  "#e8623d", // rising sun — ember
];

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

  const skyTop = useTransform(scrollYProgress, PROGRESS_STOPS, SKY_TOP);
  const skyBottom = useTransform(
    scrollYProgress,
    PROGRESS_STOPS,
    SKY_BOTTOM
  );
  const background = useMotionTemplate`linear-gradient(180deg, ${skyTop} 0%, ${skyBottom} 100%)`;

  const orbColor = useTransform(scrollYProgress, PROGRESS_STOPS, ORB_COLOR);
  const orbGlow = useMotionTemplate`drop-shadow(0 0 50px ${orbColor}) drop-shadow(0 0 100px ${orbColor})`;
  const orbLeft = useTransform(scrollYProgress, [0, 1], ["8%", "88%"]);
  const orbTop = useTransform(scrollYProgress, (p) => {
    const arc = Math.sin(Math.min(Math.max(p, 0), 1) * Math.PI);
    return `${82 - arc * 58}%`;
  });

  const starOpacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.42, 0.62, 0.75, 1],
    [0, 0, 1, 1, 0, 0]
  );

  if (reducedMotion) {
    return (
      <div
        className="fixed inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg, #0f0c1a 0%, #0a0f1a 100%)",
        }}
        aria-hidden="true"
      />
    );
  }

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <motion.div className="absolute inset-0" style={{ background }} />

      <motion.div
        className="absolute inset-0"
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
        className="absolute h-3 w-3 rounded-full"
        style={{
          left: orbLeft,
          top: orbTop,
          backgroundColor: orbColor,
          filter: orbGlow,
        }}
      />

      <SnowField />
    </div>
  );
}
