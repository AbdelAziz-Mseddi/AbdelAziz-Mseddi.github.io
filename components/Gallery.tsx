import { Reveal } from "@/components/Reveal";

const frames = [
  { src: "/frames/cat-balcony.jpg", caption: "Paw forward, blue sky" },
  { src: "/frames/cat-hallway.jpg", caption: "Watching the door" },
  { src: "/frames/kairouan-mosque.jpg", caption: "Kairouan, after dark" },
  { src: "/frames/alley-sunset.jpg", caption: "Sunset, down the block" },
  { src: "/frames/beach-dusk.jpg", caption: "The sea, dusk" },
  { src: "/frames/cat-golden-hour.jpg", caption: "Golden hour, unbothered" },
  { src: "/frames/moon-clouds.jpg", caption: "Moon, through the clouds" },
  { src: "/frames/carport-light.jpg", caption: "One light, no reason" },
];

export function Gallery() {
  return (
    <section id="gallery" className="py-16">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <Reveal>
          <p className="mx-auto max-w-xl text-center text-muted">
            Cats, the moon, the sky at odd hours.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {frames.map((frame, i) => (
            <Reveal key={frame.src} delay={(i % 3) * 80}>
              <div className="group relative flex aspect-[4/5] items-end overflow-hidden rounded-xl border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={frame.src}
                  alt={frame.caption}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />
                <p className="relative z-10 w-full p-4 text-xs text-foreground">
                  {frame.caption}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
