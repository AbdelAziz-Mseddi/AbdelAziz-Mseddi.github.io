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
            "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(157,184,232,0.16), transparent 60%), radial-gradient(ellipse 70% 55% at 100% 100%, rgba(232,98,61,0.14), transparent 65%), radial-gradient(ellipse 50% 40% at 0% 90%, rgba(217,160,102,0.07), transparent 60%)",
        }}
      />
      <SnowField />

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
          Equal parts terminal and watchlist — I ship code and keep a
          running tier list of anime on the side.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href="#work"
            className="ki-glow rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-transform hover:-translate-y-0.5"
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
