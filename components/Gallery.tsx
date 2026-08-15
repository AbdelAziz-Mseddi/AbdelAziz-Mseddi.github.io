import { Reveal } from "@/components/Reveal";

const frames = [
  "Winter, blue hour",
  "City lights, long exposure",
  "Empty street, 2am",
  "Snow on glass",
  "Cinema seat, before the trailers",
  "Rooftop, no filter",
];

export function Gallery() {
  return (
    <section id="gallery" className="border-b border-border py-28">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <Reveal>
          <p className="section-num font-mono text-sm text-accent">03</p>
          <h2 className="mt-3 font-display text-3xl italic text-foreground">
            Frames
          </h2>
          <p className="mt-4 max-w-xl text-muted">
            A few shots from the archive — replace this grid with your own
            photography whenever you&apos;re ready.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {frames.map((caption, i) => (
            <Reveal key={caption} delay={(i % 3) * 80}>
              <div
                className="group relative flex aspect-[4/5] items-end overflow-hidden rounded-xl border border-border"
                style={{
                  background:
                    "linear-gradient(155deg, #0d1220 0%, #05070c 60%, #0a1424 100%)",
                }}
              >
                <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <SnowTexture id={`grain-${i}`} />
                </div>
                <p className="relative z-10 w-full bg-gradient-to-t from-black/60 to-transparent p-4 text-xs text-muted">
                  {caption}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function SnowTexture({ id }: { id: string }) {
  return (
    <svg className="h-full w-full" aria-hidden="true">
      <filter id={id}>
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.6"
          numOctaves="2"
          stitchTiles="stitch"
        />
      </filter>
      <rect width="100%" height="100%" filter={`url(#${id})`} opacity="0.12" />
    </svg>
  );
}
