"use client";

import { useRef } from "react";
import { motion, useTransform } from "motion/react";
import { useLocalProgress } from "@/lib/useLocalProgress";
import { Glyph } from "@/components/eggs/Glyph";

export function OffDuty() {
  const ref = useRef<HTMLDivElement>(null);
  const progress = useLocalProgress(ref, 1, 0);

  const opacity = useTransform(progress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const y = useTransform(progress, [0, 0.5, 1], [40, 0, -40]);

  return (
    <section
      id="off-duty"
      ref={ref}
      className="relative flex h-[90vh] items-center justify-end px-6 sm:px-16"
    >
      <motion.div
        style={{ opacity, y }}
        className="max-w-sm text-right will-change-transform"
      >
        <p className="font-display text-3xl uppercase leading-tight text-foreground sm:text-4xl">
          Some nights it&apos;s code.
          <br />
          Some nights it&apos;s just the sky.
        </p>
        <p className="mt-6 text-sm leading-relaxed text-muted-dim">
          Whatever&apos;s loud enough to sit with me until 3am —
          that&apos;s the rest of the story. Not a list. Just company.
          <Glyph id="off-duty" className="ml-2 align-middle" />
        </p>
      </motion.div>
    </section>
  );
}
