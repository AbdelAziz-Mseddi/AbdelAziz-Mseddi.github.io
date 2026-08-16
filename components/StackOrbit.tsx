"use client";

import { useRef, useState } from "react";
import { motion, useTransform } from "motion/react";
import { useLocalProgress } from "@/lib/useLocalProgress";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { OffDutyTheme } from "@/components/eggs/OffDutyTheme";
import { Orbit } from "@/components/Orbit";
import { STACK_PLANETS, type Planet } from "@/lib/stack";

const MAX_RADIUS = Math.max(...STACK_PLANETS.map((p) => p.orbitRadius));
const MOON_ORBIT_BASE = 16;

function PlanetView({
  planet,
  reducedMotion,
  staticAngle,
}: {
  planet: Planet;
  reducedMotion: boolean;
  staticAngle: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Orbit
      radius={planet.orbitRadius}
      seconds={planet.orbitSeconds}
      reducedMotion={reducedMotion}
      staticAngle={staticAngle}
      paused={hovered}
    >
      <div
        className="group flex flex-col items-center gap-2 p-3"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div
          className="relative"
          style={{ width: planet.size, height: planet.size }}
        >
          <div
            className="absolute inset-0 rounded-full transition-transform group-hover:scale-125"
            style={{
              background: planet.color,
              boxShadow: `0 0 ${planet.size * 1.6}px ${planet.color}66`,
            }}
          />
          {planet.moons.map((moon, i) => (
            <Orbit
              key={moon.name}
              radius={MOON_ORBIT_BASE + i * 5}
              seconds={4 + i * 1.4}
              reducedMotion={reducedMotion}
              staticAngle={(i / planet.moons.length) * 360}
              paused={hovered}
            >
              <div className="group/moon relative p-2">
                <div
                  className="rounded-full bg-white/80"
                  style={{ width: 3, height: 3 }}
                />
                <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-1.5 -translate-x-1/2 whitespace-nowrap rounded border border-border-strong bg-background/90 px-1.5 py-0.5 font-mono text-[9px] text-muted opacity-0 backdrop-blur-sm transition-opacity group-hover/moon:opacity-100">
                  {moon.name}
                </span>
              </div>
            </Orbit>
          ))}
        </div>
        <span className="whitespace-nowrap font-mono text-[10px] uppercase tracking-wider text-muted-dim opacity-70 transition-opacity group-hover:text-accent-bright group-hover:opacity-100">
          {planet.label}
        </span>
      </div>
    </Orbit>
  );
}

export function StackOrbit() {
  const ref = useRef<HTMLDivElement>(null);
  const progress = useLocalProgress(ref, 1, 0);
  const reducedMotion = useReducedMotion();

  const zoom = useTransform(progress, [0, 0.35, 1], [2.4, 1, 1]);
  const scale = reducedMotion ? 1 : zoom;

  const diameter = MAX_RADIUS * 2 + 80;

  return (
    <section
      id="stack"
      ref={ref}
      className="relative flex h-[140vh] items-center justify-center overflow-hidden px-6"
    >
      <OffDutyTheme progress={progress} />

      <div className="pointer-events-none absolute left-6 top-10 sm:left-10">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-dim">
          {"// the stack"}
        </p>
        <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-dim">
          Everything I actually build with, grouped by how it&apos;s used —
          not a list, a system.
        </p>
      </div>

      <div className="scale-[0.4] sm:scale-[0.6] md:scale-[0.8] lg:scale-100">
        <motion.div
          className="relative"
          style={{ width: diameter, height: diameter, scale }}
        >
          {STACK_PLANETS.map((p) => (
            <div
              key={p.id}
              className="pointer-events-none absolute left-1/2 top-1/2 rounded-full border border-border-strong"
              style={{
                width: p.orbitRadius * 2,
                height: p.orbitRadius * 2,
                marginLeft: -p.orbitRadius,
                marginTop: -p.orbitRadius,
                opacity: 0.18,
              }}
              aria-hidden="true"
            />
          ))}

          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: 24,
              height: 24,
              background: "#f5eee0",
              boxShadow: "0 0 40px 12px #f5eee099, 0 0 90px 30px #f5eee033",
            }}
            aria-hidden="true"
          />

          {STACK_PLANETS.map((planet, i) => (
            <PlanetView
              key={planet.id}
              planet={planet}
              reducedMotion={reducedMotion}
              staticAngle={(i / STACK_PLANETS.length) * 360}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
