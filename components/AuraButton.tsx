"use client";

import type { ReactNode } from "react";
import { handleSmoothScroll } from "@/lib/smoothScroll";

const SHARDS = [
  "M2 20 L-6 4",
  "M2 20 L14 2",
  "M50 20 L60 2",
  "M50 20 L44 -6",
  "M26 -2 L20 -14",
  "M26 -2 L34 -14",
];

export function AuraButton({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      onClick={handleSmoothScroll}
      className={`group relative inline-flex ${className}`}
    >
      <svg
        className="pointer-events-none absolute -inset-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        viewBox="-10 -18 72 46"
        fill="none"
        aria-hidden="true"
      >
        {SHARDS.map((d, i) => (
          <path
            key={d}
            d={d}
            stroke="var(--accent-warm)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="24"
            strokeDashoffset="24"
            className="aura-shard"
            style={{ animationDelay: `${i * 70}ms` }}
          />
        ))}
      </svg>
      <span className="relative">{children}</span>
    </a>
  );
}
