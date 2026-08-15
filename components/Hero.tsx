import { SnowField } from "@/components/SnowField";

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-screen items-center overflow-hidden border-b border-border"
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(157,184,232,0.14), transparent 60%), radial-gradient(ellipse 60% 50% at 90% 100%, rgba(217,160,102,0.08), transparent 60%)",
        }}
      />
      <SnowField />

      <div className="relative mx-auto w-full max-w-6xl px-6 pt-24 sm:px-10">
        <p className="mb-6 text-xs uppercase tracking-[0.3em] text-muted-dim">
          Tunisia · currently up past midnight
        </p>
        <h1 className="font-display text-balance text-5xl italic leading-[1.05] text-foreground sm:text-7xl">
          Abdelaziz Mseddi
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted sm:text-xl">
          Software engineering student and AI engineer. I build things at
          night, in winter, with a film playing quietly in another tab.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href="#work"
            className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-transform hover:-translate-y-0.5"
          >
            See my work
          </a>
          <a
            href="#contact"
            className="rounded-full border border-border-strong px-6 py-3 text-sm text-foreground transition-colors hover:border-accent hover:text-accent-bright"
          >
            Get in touch
          </a>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
