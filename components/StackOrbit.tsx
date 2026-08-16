"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useTransform } from "motion/react";
import { useLocalProgress } from "@/lib/useLocalProgress";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { OffDutyTheme } from "@/components/eggs/OffDutyTheme";
import { Orbit } from "@/components/Orbit";
import { STACK_PLANETS, type Planet } from "@/lib/stack";

const MAX_RADIUS = Math.max(...STACK_PLANETS.map((p) => p.orbitRadius));
const MOON_ORBIT_BASE = 16;
const FOCUS_SCALE = 2.6;

// Cycled per moon index so labels on the same planet don't all stack on
// the same side — four directions cuts collision odds roughly in half
// again versus a simple above/below alternation.
const LABEL_POSITIONS = [
  "left-1/2 top-full mt-1 -translate-x-1/2",
  "left-1/2 bottom-full mb-1 -translate-x-1/2",
  "right-full top-1/2 mr-1 -translate-y-1/2",
  "left-full top-1/2 ml-1 -translate-y-1/2",
];

function PlanetView({
  planet,
  reducedMotion,
  staticAngle,
  focused,
  dimmed,
  onToggleFocus,
}: {
  planet: Planet;
  reducedMotion: boolean;
  staticAngle: number;
  focused: boolean;
  dimmed: boolean;
  onToggleFocus: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  // Focus enlarges and labels a planet's moons, but doesn't stop them —
  // the system stays alive. Only an explicit hover (reading one specific
  // moon's name) freezes motion, and only briefly.
  const frozen = hovered;

  return (
    <Orbit
      radius={planet.orbitRadius}
      seconds={planet.orbitSeconds}
      reducedMotion={reducedMotion}
      staticAngle={staticAngle}
      paused={frozen}
    >
      <div
        className="group flex cursor-pointer flex-col items-center gap-2 p-3 transition-opacity"
        style={{ opacity: dimmed ? 0.25 : 1, zIndex: focused ? 20 : undefined }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={onToggleFocus}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggleFocus();
          }
        }}
      >
        <div
          className="relative transition-transform duration-500 ease-out"
          style={{
            width: planet.size,
            height: planet.size,
            transform: `scale(${focused ? FOCUS_SCALE : 1})`,
          }}
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
              radius={MOON_ORBIT_BASE + i * 9}
              seconds={4 + i * 1.4}
              reducedMotion={reducedMotion}
              staticAngle={(i / planet.moons.length) * 360}
              paused={frozen}
            >
              <div className="group/moon relative p-2">
                <div
                  className="rounded-full bg-white/80"
                  style={{ width: 3, height: 3 }}
                />
                <span
                  className={`pointer-events-none absolute z-10 whitespace-nowrap rounded border border-border-strong bg-background/90 px-1 py-px font-mono text-[7px] leading-tight text-muted backdrop-blur-sm transition-opacity group-hover/moon:opacity-100 ${LABEL_POSITIONS[i % LABEL_POSITIONS.length]}`}
                  style={{ opacity: focused ? 1 : 0 }}
                >
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
  const [focusedId, setFocusedId] = useState<string | null>(null);

  const zoom = useTransform(progress, [0, 0.4, 1], [2.2, 1.3, 1.3]);
  const scale = reducedMotion ? 1 : zoom;

  const diameter = MAX_RADIUS * 2 + 80;

  useEffect(() => {
    if (!focusedId) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setFocusedId(null);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [focusedId]);

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
          not a list, a system. Click a planet to look closer.
        </p>
      </div>

      <div
        className="pointer-events-none absolute inset-0"
        onClick={() => setFocusedId(null)}
        style={{ pointerEvents: focusedId ? "auto" : "none" }}
        aria-hidden="true"
      />

      <div className="pointer-events-none scale-[0.4] sm:scale-[0.6] md:scale-[0.8] lg:scale-100">
        <motion.div
          className="pointer-events-none relative"
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
              focused={focusedId === planet.id}
              dimmed={focusedId !== null && focusedId !== planet.id}
              onToggleFocus={() =>
                setFocusedId((prev) => (prev === planet.id ? null : planet.id))
              }
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
