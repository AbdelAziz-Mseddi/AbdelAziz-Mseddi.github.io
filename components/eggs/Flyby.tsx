"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { onEgg } from "@/lib/eggs/eggBus";

const MIN_INTERVAL_MS = 12_000;
const MAX_INTERVAL_MS = 24_000;
const MAX_CONCURRENT = 3;

// Same colour stages as the charge egg's aura.
const AURA_COLORS = ["#ffffff", "#ffd535", "#ff2b2b", "#3871ff", "#ebe1ff"];

type Flight = {
  id: number;
  top: string;
  duration: number;
  kind: "craft" | "aura";
  color: string;
};

function randomFlight(id: number): Flight {
  const kind = Math.random() < 0.35 ? "aura" : "craft";
  return {
    id,
    top: `${8 + Math.random() * 70}%`,
    // The aura figures cross slowly enough to actually read as a figure;
    // the craft still streaks past.
    duration:
      kind === "aura" ? 4.2 + Math.random() * 1.8 : 1.8 + Math.random() * 0.8,
    kind,
    // Picked once, at spawn — a given figure keeps this colour for its
    // whole crossing.
    color: AURA_COLORS[Math.floor(Math.random() * AURA_COLORS.length)],
  };
}

/**
 * An original single-seat craft: long nose, bubble canopy, swept forward
 * wings, twin engine bells with a hot exhaust bloom. Built in the spirit of
 * the site's jazz-noir/space-western mood, but drawn from scratch — the eggs
 * spec forbids copying any show's actual ship design, so this is a silhouette
 * of the same genre rather than a reproduction of a specific one.
 */
function Craft({ uid }: { uid: number }) {
  // SVG ids are document-global, so every concurrent flight needs its own or
  // the first one to finish takes the shared gradient down with it.
  const trail = `craft-trail-${uid}`;
  const body = `craft-body-${uid}`;

  return (
    <svg width="78" height="30" viewBox="0 0 78 30" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={trail} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffb066" stopOpacity="0" />
          <stop offset="100%" stopColor="#ffb066" stopOpacity="0.75" />
        </linearGradient>
        <linearGradient id={body} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f2f4fa" />
          <stop offset="55%" stopColor="#cfd6e4" />
          <stop offset="100%" stopColor="#8b93a5" />
        </linearGradient>
      </defs>

      {/* exhaust plume */}
      <rect x="0" y="14.2" width="30" height="2" fill={`url(#${trail})`} />
      <ellipse cx="31" cy="15.2" rx="5" ry="2.1" fill="#ffb066" opacity="0.75" />

      {/* swept wings */}
      <polygon points="40,15 50,4 57,5 48,15" fill="#b04a34" />
      <polygon points="40,15 50,26 57,25 48,15" fill="#8e3a28" />

      {/* engine housings */}
      <rect x="31" y="11.6" width="12" height="3" rx="1.4" fill="#9aa2b4" />
      <rect x="31" y="15.6" width="12" height="3" rx="1.4" fill="#7c8496" />

      {/* fuselage + long nose */}
      <path d="M 36 12 L 66 13.4 L 76 15.2 L 66 17 L 36 18 Z" fill={`url(#${body})`} />

      {/* canopy */}
      <path d="M 52 12.4 L 61 13.2 L 61 15 L 52 15.2 Z" fill="#3d566e" opacity="0.95" />

      {/* tail fin */}
      <polygon points="37,12 34,6.5 40,11.4" fill="#b04a34" />
    </svg>
  );
}

/**
 * A figure streaking past inside its own aura — the charge egg's colour
 * stages, airborne. Deliberately an abstract silhouette with a comet trail,
 * not any character: same rule as the craft, reference the technique, don't
 * reproduce the art.
 */
function AuraFlyer({ uid, color }: { uid: number; color: string }) {
  // Keyed by flight id, not by colour: two figures can draw the same colour,
  // and a colour-keyed id would let the first to land strip the other's trail.
  const trail = `aura-trail-${uid}`;

  return (
    <svg width="70" height="26" viewBox="0 0 70 26" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={trail} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={color} stopOpacity="0" />
          <stop offset="70%" stopColor={color} stopOpacity="0.55" />
          <stop offset="100%" stopColor={color} stopOpacity="0.9" />
        </linearGradient>
      </defs>

      {/* comet trail */}
      <path d="M 0 13 Q 26 8.5 48 12 Q 26 17.5 0 13 Z" fill={`url(#${trail})`} />

      {/* aura envelope */}
      <ellipse cx="53" cy="13" rx="11" ry="7" fill={color} opacity="0.28" />
      <ellipse cx="54" cy="13" rx="6.5" ry="4.6" fill={color} opacity="0.5" />

      {/* figure: head, torso, trailing limbs — leaning into the flight */}
      <circle cx="58.4" cy="10.6" r="1.9" fill={color} />
      <path d="M 57.6 12.2 L 55 15.4 L 52.2 14.6 L 55.4 12.6 Z" fill={color} />
      <path d="M 55.2 13.4 L 49.5 16.2" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 56.8 12.2 L 51.8 10.4" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.85" />

      {/* leading spark */}
      <circle cx="62" cy="12.4" r="1.1" fill="#fff" opacity="0.85" />
    </svg>
  );
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
        <div
          key={f.id}
          className="craft-flyby absolute"
          style={{
            top: f.top,
            left: "-90px",
            ["--flyby-duration" as string]: `${f.duration}s`,
          }}
          onAnimationEnd={() => remove(f.id)}
        >
          {f.kind === "craft" ? (
            <Craft uid={f.id} />
          ) : (
            <AuraFlyer uid={f.id} color={f.color} />
          )}
        </div>
      ))}
      <style>{`
        @keyframes craft-flyby-move {
          from { transform: translateX(0); opacity: 0; }
          8% { opacity: 1; }
          92% { opacity: 1; }
          to { transform: translateX(${
            typeof window !== "undefined" ? window.innerWidth + 160 : 1600
          }px); opacity: 0; }
        }
        .craft-flyby {
          animation: craft-flyby-move var(--flyby-duration, 2.1s) ease-in-out forwards;
          will-change: transform;
        }
      `}</style>
    </div>
  );
}
