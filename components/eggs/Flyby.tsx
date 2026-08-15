"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { onEgg } from "@/lib/eggs/eggBus";

const MIN_INTERVAL_MS = 12_000;
const MAX_INTERVAL_MS = 24_000;
const MAX_CONCURRENT = 3;

type Flight = {
  id: number;
  top: string;
  duration: number;
};

function randomFlight(id: number): Flight {
  return {
    id,
    top: `${8 + Math.random() * 70}%`,
    duration: 1.8 + Math.random() * 0.8,
  };
}

export function Flyby() {
  const reducedMotion = useReducedMotion();
  const [flights, setFlights] = useState<Flight[]>([]);
  const idRef = useRef(0);

  function spawn() {
    setFlights((prev) => {
      if (prev.length >= MAX_CONCURRENT) return prev;
      idRef.current += 1;
      return [...prev, randomFlight(idRef.current)];
    });
  }

  function remove(id: number) {
    setFlights((prev) => prev.filter((f) => f.id !== id));
  }

  // Recurring ambient traffic — not idle-gated, this one runs continuously
  // for as long as the tab is open, at a randomized cadence.
  useEffect(() => {
    if (reducedMotion) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    function scheduleNext() {
      const delay =
        MIN_INTERVAL_MS + Math.random() * (MAX_INTERVAL_MS - MIN_INTERVAL_MS);
      timer = setTimeout(() => {
        if (cancelled) return;
        spawn();
        scheduleNext();
      }, delay);
    }
    scheduleNext();

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [reducedMotion]);

  // Terminal (`fly` command) trigger — spawns one immediately, on top of
  // the ambient cadence.
  useEffect(() => {
    return onEgg("fly", spawn);
  }, []);

  if (reducedMotion || flights.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-40 overflow-hidden"
      aria-hidden="true"
    >
      {flights.map((f) => (
        <svg
          key={f.id}
          className="craft-flyby absolute"
          style={{ top: f.top, left: "-60px", ["--flyby-duration" as string]: `${f.duration}s` }}
          width="46"
          height="20"
          viewBox="0 0 46 20"
          onAnimationEnd={() => remove(f.id)}
        >
          <defs>
            <linearGradient id={`flyby-trail-${f.id}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#e7ebf5" stopOpacity="0" />
              <stop offset="100%" stopColor="#e7ebf5" stopOpacity="0.5" />
            </linearGradient>
          </defs>
          <rect x="0" y="9" width="26" height="1.5" fill={`url(#flyby-trail-${f.id})`} />
          <polygon points="26,4 46,10 26,16 31,10" fill="#e7ebf5" opacity="0.85" />
        </svg>
      ))}
      <style>{`
        @keyframes craft-flyby-move {
          from { transform: translateX(0); opacity: 0; }
          8% { opacity: 1; }
          92% { opacity: 1; }
          to { transform: translateX(${
            typeof window !== "undefined" ? window.innerWidth + 120 : 1600
          }px); opacity: 0; }
        }
        .craft-flyby {
          animation: craft-flyby-move var(--flyby-duration, 2.1s) ease-in-out forwards;
        }
      `}</style>
    </div>
  );
}
