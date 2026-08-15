"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { onEgg } from "@/lib/eggs/eggBus";

const IDLE_MS = 45_000;
const CHECK_INTERVAL_MS = 2_000;
const FLIGHT_MS = 2_100;
const ACTIVITY_EVENTS = ["scroll", "mousemove", "keydown", "touchstart"];

export function Flyby() {
  const reducedMotion = useReducedMotion();
  const [flying, setFlying] = useState(false);
  const firedRef = useRef(false);
  const lastActivityRef = useRef<number | null>(null);

  function launch() {
    if (firedRef.current) return;
    firedRef.current = true;
    setFlying(true);
  }

  // 45s-idle trigger — the one egg allowed to fire unprompted, and only
  // once per session.
  useEffect(() => {
    if (reducedMotion) return;

    lastActivityRef.current = Date.now();

    function markActivity() {
      lastActivityRef.current = Date.now();
    }
    ACTIVITY_EVENTS.forEach((evt) =>
      window.addEventListener(evt, markActivity, { passive: true })
    );

    const interval = setInterval(() => {
      if (firedRef.current) {
        clearInterval(interval);
        return;
      }
      const lastActivity = lastActivityRef.current ?? Date.now();
      if (Date.now() - lastActivity >= IDLE_MS) {
        launch();
      }
    }, CHECK_INTERVAL_MS);

    return () => {
      ACTIVITY_EVENTS.forEach((evt) =>
        window.removeEventListener(evt, markActivity)
      );
      clearInterval(interval);
    };
  }, [reducedMotion]);

  // Terminal (`fly` command) trigger — wired in ahead of the terminal
  // actually existing, since it's just an event dispatch.
  useEffect(() => {
    return onEgg("fly", launch);
  }, []);

  if (reducedMotion || !flying) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-40 overflow-hidden"
      aria-hidden="true"
    >
      <svg
        className="craft-flyby absolute"
        style={{ top: "18%", left: "-60px" }}
        width="46"
        height="20"
        viewBox="0 0 46 20"
        onAnimationEnd={() => setFlying(false)}
      >
        <defs>
          <linearGradient id="flyby-trail" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#e7ebf5" stopOpacity="0" />
            <stop offset="100%" stopColor="#e7ebf5" stopOpacity="0.5" />
          </linearGradient>
        </defs>
        <rect x="0" y="9" width="26" height="1.5" fill="url(#flyby-trail)" />
        <polygon points="26,4 46,10 26,16 31,10" fill="#e7ebf5" opacity="0.85" />
      </svg>
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
          animation: craft-flyby-move ${FLIGHT_MS}ms ease-in-out forwards;
        }
      `}</style>
    </div>
  );
}
