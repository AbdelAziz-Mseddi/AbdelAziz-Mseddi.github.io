"use client";

import { useRef } from "react";
import { motion, useTransform } from "motion/react";
import { useLocalProgress } from "@/lib/useLocalProgress";

export function ChapterTitle({
  kicker,
  title,
}: {
  kicker: string;
  title: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const progress = useLocalProgress(ref, 0.85, 0.25);

  const opacity = useTransform(progress, [0, 0.35, 0.75, 1], [0, 1, 1, 0]);
  const scale = useTransform(
    progress,
    [0, 0.35, 0.75, 1],
    [0.92, 1, 1, 0.96]
  );

  return (
    <div
      ref={ref}
      className="relative flex h-[70vh] items-center justify-center px-6 text-center"
    >
      <motion.div
        style={{ opacity, scale }}
        className="will-change-transform"
      >
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
