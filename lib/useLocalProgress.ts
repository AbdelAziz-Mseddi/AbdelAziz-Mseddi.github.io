"use client";

import { useEffect, useState, type RefObject } from "react";
import { useScroll, useSpring, useTransform } from "motion/react";

/**
 * Progress (0-1) of a target element passing through the viewport, driven by
 * the single shared window scroll position instead of a per-instance
 * useScroll({ target }) — the latter re-reads the element's live geometry
 * (getBoundingClientRect) on every scroll tick, which forces layout when
 * interleaved with other components writing styles in the same frame.
 * This measures the element's position once (mount + resize) and does pure
 * arithmetic on every scroll tick after that — no per-frame DOM reads.
 */
export function useLocalProgress(
  ref: RefObject<HTMLElement | null>,
  startFrac = 0.85,
  endFrac = 0.25
) {
  const { scrollY: rawScrollY } = useScroll();
  const scrollY = useSpring(rawScrollY, {
    stiffness: 120,
    damping: 26,
    restDelta: 0.5,
  });
  const [bounds, setBounds] = useState<{ start: number; end: number } | null>(
    null
  );

  useEffect(() => {
    function measure() {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const top = rect.top + window.scrollY;
      const bottom = top + rect.height;
      const vh = window.innerHeight;
      setBounds({ start: top - vh * startFrac, end: bottom - vh * endFrac });
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [ref, startFrac, endFrac]);

  return useTransform(scrollY, (y) => {
    if (!bounds || bounds.end === bounds.start) return 0;
    return Math.min(Math.max((y - bounds.start) / (bounds.end - bounds.start), 0), 1);
  });
}
