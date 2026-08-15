"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

export function ChapterTitle({
  kicker,
  title,
}: {
  kicker: string;
  title: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.25"],
  });

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.35, 0.75, 1],
    [0, 1, 1, 0]
  );
  const scale = useTransform(
    scrollYProgress,
    [0, 0.35, 0.75, 1],
    [0.92, 1, 1, 0.96]
  );
  const blur = useTransform(
    scrollYProgress,
    [0, 0.35, 0.75, 1],
    [10, 0, 0, 8]
  );
  const filter = useTransform(blur, (b) => `blur(${b}px)`);

  return (
    <div
      ref={ref}
      className="relative flex h-[70vh] items-center justify-center px-6 text-center"
    >
      <motion.div style={{ opacity, scale, filter }}>
        <p className="font-mono text-xs uppercase tracking-[0.4em] text-muted-dim">
          {kicker}
        </p>
        <h2 className="mt-4 font-display text-balance text-5xl uppercase leading-none text-foreground sm:text-7xl">
          {title}
        </h2>
      </motion.div>
    </div>
  );
}
