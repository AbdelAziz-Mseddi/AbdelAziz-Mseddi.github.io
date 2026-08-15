import { Reveal } from "@/components/Reveal";
import { screen, music } from "@/lib/taste";

export function OffDuty() {
  return (
    <section id="off-duty" className="border-b border-border py-28">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <Reveal>
          <p className="section-num font-mono text-sm text-accent">
            EP. 03
          </p>
          <h2 className="mt-3 font-display text-4xl uppercase text-foreground">
            Off Duty
          </h2>
          <p className="mt-4 max-w-2xl text-muted">
            Movies about people who refuse to be average at what they do,
            and a soundtrack that swings from Queen&apos;s grandeur to
            Rilès&apos;s ambition without ever picking a lane.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-12 sm:grid-cols-2">
          <Reveal delay={80}>
            <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-dim">
              Screen
            </h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {screen.shows.map((s) => (
                <li
                  key={s}
                  className="rounded-full border border-border-strong px-4 py-1.5 text-sm text-foreground"
                >
                  {s}
                </li>
              ))}
            </ul>

            <p className="mt-6 text-sm text-muted-dim">
              Directors: {screen.directors.join(" · ")}
            </p>
            <ul className="mt-3 space-y-1.5 text-sm text-muted">
              {screen.films.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={160}>
            <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-dim">
              Music
            </h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {music.artists.map((a) => (
                <li
                  key={a}
                  className="rounded-full border border-border-strong px-4 py-1.5 text-sm text-foreground"
                >
                  {a}
                </li>
              ))}
            </ul>

            <p className="mt-6 text-sm text-muted-dim">On repeat</p>
            <ul className="mt-3 space-y-1.5 text-sm text-muted">
              {music.songs.map((s) => (
                <li key={s.title}>
                  <span className="text-foreground">{s.title}</span>
                  {" — "}
                  {s.by}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
