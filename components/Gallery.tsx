"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/Reveal";
import { fadeMainTo, isUserPaused } from "@/lib/audio/mainTrack";
import { useReducedMotion } from "@/lib/useReducedMotion";

// Track IDs verified individually against Spotify's rendered embed (title +
// artist), not guessed from search titles — several of these have covers or
// alternate versions sitting at the top of search (an orchestral "Brain
// Damage", a Kavinsky/Angèle/Phoenix "Nightcall"), so the originals were
// picked deliberately.
const frames = [
  {
    src: "/frames/cat-balcony.jpg",
    caption: "Paw forward, blue sky",
    title: "Stronger",
    artist: "Kanye West",
    trackId: "0j2T0R9dR9qdJYsB7ciXhf",
  },
  {
    src: "/frames/cat-hallway.jpg",
    caption: "Watching the door",
    title: "Runaway",
    artist: "Kanye West",
    trackId: "3DK6m7It6Pw857FcQftMds",
  },
  {
    src: "/frames/coast-dusk.jpg",
    caption: "Coast road, last light",
    title: "Nightcall",
    artist: "Kavinsky",
    trackId: "0U0ldCRmgCqhVvD6ksG63j",
  },
  {
    src: "/frames/beach-dusk.jpg",
    caption: "The sea, dusk",
    title: "Sea of Dreams",
    artist: "Oberhofer",
    trackId: "1RxdDVp148rnofeCFRqeSG",
  },
  {
    src: "/frames/cat-golden-hour.jpg",
    caption: "Golden hour, unbothered",
    title: "Salvatore",
    artist: "Lana Del Rey",
    trackId: "21qg0IBZf8R12qHd9A3AA4",
  },
  {
    src: "/frames/carport-light.jpg",
    caption: "One light, no reason",
    title: "Brain Damage",
    artist: "Pink Floyd",
    trackId: "05uGBKRCuePsf43Hfm0JwX",
  },
];

type SpotifyController = {
  play: () => void;
  pause: () => void;
  loadUri: (uri: string) => void;
  addListener: (
    event: "playback_update",
    cb: (e: {
      data: {
        isPaused: boolean;
        isBuffering: boolean;
        position: number;
        duration: number;
      };
    }) => void
  ) => void;
};

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (IFrameAPI: {
      createController: (
        element: HTMLElement,
        options: { uri: string; width: string; height: string },
        callback: (controller: SpotifyController) => void
      ) => void;
    }) => void;
  }
}

/** The same original angular craft silhouette the Flyby egg uses — not a
 *  ship from any franchise, just the shape already established on this site. */
function Craft({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      width="46"
      height="20"
      viewBox="0 0 46 20"
      aria-hidden="true"
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      <rect x="0" y="9" width="24" height="1.5" fill="currentColor" opacity="0.35" />
      <polygon points="26,4 46,10 26,16 31,10" fill="currentColor" />
    </svg>
  );
}

export function Gallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<SpotifyController | null>(null);
  const reducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    window.onSpotifyIframeApiReady = (IFrameAPI) => {
      if (!containerRef.current) return;
      IFrameAPI.createController(
        containerRef.current,
        { uri: `spotify:track:${frames[0].trackId}`, width: "1", height: "1" },
        (controller) => {
          controllerRef.current = controller as SpotifyController;
          controller.addListener("playback_update", (e) => {
            // Spotify's embed has no distinct "ended" event — at the end of
            // the 30s preview it freezes with isPaused still false, so the
            // end has to be detected from position vs. duration.
            const ended =
              e.data.duration > 0 && e.data.position >= e.data.duration;
            if (ended) setIsPaused(true);
          });
        }
      );
    };

    const tag = document.createElement("script");
    tag.src = "https://open.spotify.com/embed/iframe-api/v1";
    document.body.appendChild(tag);
  }, []);

  const playIndex = useCallback((index: number) => {
    const controller = controllerRef.current;
    if (!controller) return;
    controller.loadUri(`spotify:track:${frames[index].trackId}`);
    controller.play();
    setIsPaused(false);
    fadeMainTo(0.05, 400);
  }, []);

  const open = useCallback(
    (index: number) => {
      setActiveIndex(index);
      playIndex(index);
    },
    [playIndex]
  );

  const close = useCallback(() => {
    setActiveIndex(null);
    controllerRef.current?.pause();
    setIsPaused(false);
    if (!isUserPaused()) fadeMainTo(1, 700);
  }, []);

  const step = useCallback(
    (delta: number) => {
      setActiveIndex((prev) => {
        if (prev === null) return prev;
        const next = (prev + delta + frames.length) % frames.length;
        playIndex(next);
        return next;
      });
    },
    [playIndex]
  );

  function togglePlay() {
    const controller = controllerRef.current;
    if (!controller) return;
    if (isPaused) {
      controller.play();
      setIsPaused(false);
      fadeMainTo(0.05, 400);
    } else {
      controller.pause();
      setIsPaused(true);
      if (!isUserPaused()) fadeMainTo(1, 700);
    }
  }

  // Keyboard: arrows to surf, Escape to leave.
  useEffect(() => {
    if (activeIndex === null) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, close, step]);

  // Wheel/trackpad surfs between frames instead of scrolling the page
  // behind the overlay. Needs a non-passive listener to be able to
  // preventDefault, which React's onWheel prop can't guarantee.
  useEffect(() => {
    if (activeIndex === null) return;
    let cooling = false;
    function onWheel(e: WheelEvent) {
      e.preventDefault();
      if (cooling) return;
      const delta = e.deltaY !== 0 ? e.deltaY : e.deltaX;
      if (Math.abs(delta) < 8) return;
      cooling = true;
      step(delta > 0 ? 1 : -1);
      window.setTimeout(() => {
        cooling = false;
      }, 420);
    }
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [activeIndex, step]);

  const active = activeIndex === null ? null : frames[activeIndex];

  return (
    <section id="gallery" className="py-16">
      <div
        ref={containerRef}
        className="pointer-events-none fixed -left-[9999px] top-0 h-2 w-2 opacity-0"
        aria-hidden="true"
      />
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <Reveal>
          <p className="mx-auto max-w-xl text-center text-muted">
            Cats, the sea, the sky at odd hours — each with what was playing.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {frames.map((frame, i) => (
            <Reveal key={frame.src} delay={(i % 3) * 80}>
              <button
                type="button"
                onClick={() => open(i)}
                aria-label={`Open ${frame.caption}, plays ${frame.title} by ${frame.artist}`}
                className="group relative flex aspect-[4/5] w-full items-end overflow-hidden rounded-xl border border-border text-left"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={frame.src}
                  alt={frame.caption}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/0 to-black/0" />

                <span className="pointer-events-none absolute right-2 top-2 z-20 flex max-w-[85%] items-center gap-1.5 rounded-full border border-white/20 bg-black/55 px-2.5 py-1 backdrop-blur-md">
                  <span aria-hidden="true" className="text-[10px] leading-none text-white">
                    ♪
                  </span>
                  <span className="truncate font-mono text-[9px] leading-tight text-white/90">
                    {frame.title}
                    <span className="text-white/55"> · {frame.artist}</span>
                  </span>
                </span>

                <p className="relative z-10 w-full p-4 text-xs text-foreground">
                  {frame.caption}
                </p>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {active && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-background/95 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={active.caption}
          onClick={close}
          style={
            reducedMotion
              ? undefined
              : { animation: "story-fade 180ms ease-out" }
          }
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
            aria-label="Previous frame"
            className="absolute left-3 z-10 p-3 text-muted-dim transition-colors hover:text-accent-bright sm:left-8"
          >
            <Craft flip />
          </button>

          <figure
            className="flex max-h-[86vh] max-w-[86vw] flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={active.src}
              alt={active.caption}
              className="max-h-[68vh] max-w-full rounded-xl border border-border-strong object-contain"
            />
            <figcaption className="flex flex-col items-center gap-2 text-center">
              <p className="text-sm text-foreground">{active.caption}</p>
              <button
                type="button"
                onClick={togglePlay}
                aria-label={
                  isPaused
                    ? `Play ${active.title} by ${active.artist}`
                    : `Pause ${active.title} by ${active.artist}`
                }
                className="flex items-center gap-2 rounded-full border border-border-strong bg-surface px-3 py-1.5 transition-colors hover:border-accent"
              >
                <span
                  aria-hidden="true"
                  className={`text-[11px] leading-none text-accent-warm ${
                    !isPaused && !reducedMotion ? "animate-pulse" : ""
                  }`}
                >
                  {isPaused ? "▶" : "❚❚"}
                </span>
                <span className="font-mono text-[10px] text-muted">
                  {active.title}
                  <span className="text-muted-dim"> · {active.artist}</span>
                </span>
              </button>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-dim">
                {activeIndex! + 1} / {frames.length} · scroll or fly to surf ·
                esc to exit
              </p>
            </figcaption>
          </figure>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
            aria-label="Next frame"
            className="absolute right-3 z-10 p-3 text-muted-dim transition-colors hover:text-accent-bright sm:right-8"
          >
            <Craft />
          </button>
        </div>
      )}
    </section>
  );
}
