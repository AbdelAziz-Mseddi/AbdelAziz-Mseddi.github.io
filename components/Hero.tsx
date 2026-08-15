"use client";

import { AuraButton } from "@/components/AuraButton";
import { handleSmoothScroll } from "@/lib/smoothScroll";

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-screen items-center overflow-hidden"
    >
      <div className="relative mx-auto w-full max-w-6xl px-6 pt-24 sm:px-10">
        <p className="mb-6 font-mono text-xs uppercase tracking-[0.3em] text-muted-dim">
          {"// Tunisia — session started past midnight"}
        </p>
        <h1 className="font-display text-balance text-6xl uppercase leading-[0.9] text-foreground sm:text-8xl">
          Abdelaziz
          <br />
          <span className="text-accent-bright">Mseddi</span>
        </h1>
        <p className="mt-8 max-w-xl text-lg text-muted sm:text-xl">
          Software engineering student, AI engineer, certified night owl.
          I ship code the way I watch the sky — paying attention to what
          most people scroll past.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <AuraButton
            href="#work"
            className="ki-glow rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-transform hover:-translate-y-0.5"
          >
            See my work
          </AuraButton>
          <a
            href="#contact"
            onClick={handleSmoothScroll}
            className="rounded-full border border-border-strong px-6 py-3 text-sm text-foreground transition-colors hover:border-accent hover:text-accent-bright"
          >
            Get in touch
          </a>
        </div>
      </div>
    </section>
  );
}
