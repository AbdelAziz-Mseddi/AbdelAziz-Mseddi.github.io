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

const SWIPE_THRESHOLD_PX = 45;

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

/** Film perforations running along the strip. */
function Perforations() {
  return (
    <div
      aria-hidden="true"
      className="h-2.5 w-full shrink-0"
      style={{
        backgroundImage:
          "repeating-linear-gradient(90deg, rgba(231,235,245,0.16) 0 11px, transparent 11px 30px)",
      }}
    />
  );
}

export function Gallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<SpotifyController | null>(null);
  const reducedMotion = useReducedMotion();

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  // Assigned in effects (never during render) so the Spotify listener, which
  // is registered once, can always reach the current handlers.
  const advanceRef = useRef<(delta: number) => void>(() => {});
  const isOpenRef = useRef(false);

  useEffect(() => {
    isOpenRef.current = activeIndex !== null;
  }, [activeIndex]);

  useEffect(() => {
    window.onSpotifyIframeApiReady = (IFrameAPI) => {
      if (!containerRef.current) return;
      IFrameAPI.createController(
        containerRef.current,
        { uri: `spotify:track:${frames[0].trackId}`, width: "1", height: "1" },
        (controller) => {
          controllerRef.current = controller as SpotifyController;
          controller.addListener("playback_update", (e) => {
            const { position, duration } = e.data;
            if (duration > 0) setProgress(Math.min(1, position / duration));
            // Spotify's embed has no distinct "ended" event — at the end of
            // the preview it freezes with isPaused still false, so the end
            // has to be inferred from position vs. duration.
            const ended = duration > 0 && position >= duration;
            if (ended) {
              if (isOpenRef.current) advanceRef.current(1);
              else setIsPaused(true);
            }
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
    setProgress(0);
    fadeMainTo(0.05, 400);
  }, []);

  const open = useCallback(
    (index: number) => {
      setDirection(1);
      setActiveIndex(index);
      playIndex(index);
    },
    [playIndex]
  );

  const close = useCallback(() => {
    setActiveIndex(null);
    controllerRef.current?.pause();
    setIsPaused(false);
    setProgress(0);
    if (!isUserPaused()) fadeMainTo(1, 700);
  }, []);

  const step = useCallback(
    (delta: number) => {
      setDirection(delta >= 0 ? 1 : -1);
      setActiveIndex((prev) => {
        if (prev === null) return prev;
        const next = (prev + delta + frames.length) % frames.length;
        playIndex(next);
        return next;
      });
    },
    [playIndex]
  );

  useEffect(() => {
    advanceRef.current = step;
  }, [step]);

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

  function scrollStrip(delta: number) {
    const strip = stripRef.current;
    if (!strip) return;
    strip.scrollBy({
      left: delta * strip.clientWidth * 0.6,
      behavior: reducedMotion ? "auto" : "smooth",
    });
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

  // Wheel/trackpad surfs between frames instead of scrolling the page behind
  // the overlay. Needs a non-passive listener to preventDefault, which
  // React's onWheel prop can't guarantee.
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
      }, 460);
    }
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [activeIndex, step]);

  // Touch: swipe horizontally (or vertically, matching the film's own
  // direction of travel) to surf.
  useEffect(() => {
    if (activeIndex === null) return;
    let startX = 0;
    let startY = 0;

    function onTouchStart(e: TouchEvent) {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }
    function onTouchEnd(e: TouchEvent) {
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      const horizontal = Math.abs(dx) > Math.abs(dy);
      const travel = horizontal ? dx : dy;
      if (Math.abs(travel) < SWIPE_THRESHOLD_PX) return;
      step(travel < 0 ? 1 : -1);
    }

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
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
      </div>

      <div className="relative mt-12">
        <Perforations />

        <div
          ref={stripRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-[12vw] py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {frames.map((frame, i) => (
            <button
              key={frame.src}
              type="button"
              onClick={() => open(i)}
              aria-label={`Open ${frame.caption}, plays ${frame.title} by ${frame.artist}`}
              className="film-frame group relative flex aspect-[4/5] w-[62vw] shrink-0 snap-center items-end overflow-hidden rounded-xl border border-border text-left will-change-transform sm:w-[38vw] lg:w-[24vw]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={frame.src}
                alt={frame.caption}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
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
          ))}
        </div>

        <Perforations />

        {/* Deliberately not hijacking vertical wheel into horizontal scroll —
            the eggs spec bans scroll-jacking, so mouse users get explicit
            controls instead of a strip that traps the page. */}
        <button
          type="button"
          onClick={() => scrollStrip(-1)}
          aria-label="Scroll frames left"
          className="absolute left-2 top-1/2 -translate-y-1/2 p-2 text-muted-dim transition-colors hover:text-accent-bright sm:left-4"
        >
          <Craft flip />
        </button>
        <button
          type="button"
          onClick={() => scrollStrip(1)}
          aria-label="Scroll frames right"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-muted-dim transition-colors hover:text-accent-bright sm:right-4"
        >
          <Craft />
        </button>
      </div>

      {active && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-background/95 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={active.caption}
          onClick={close}
          style={reducedMotion ? undefined : { animation: "story-fade 180ms ease-out" }}
        >
          {/* Preview progress — makes the story framing literal and shows
              when it'll hand off to the next frame. */}
          <div className="absolute inset-x-0 top-0 h-0.5 bg-border">
            <div
              className="h-full bg-accent-warm"
              style={{
                width: `${progress * 100}%`,
                transition: reducedMotion ? "none" : "width 240ms linear",
              }}
              aria-hidden="true"
            />
          </div>

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
            <div
              key={active.src}
              className="overflow-hidden rounded-xl border border-border-strong"
              style={
                reducedMotion
                  ? undefined
                  : {
                      animation: `${
                        direction === 1 ? "gate-advance-fwd" : "gate-advance-back"
                      } 520ms cubic-bezier(0.2, 0.9, 0.25, 1) both`,
                    }
              }
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={active.src}
                alt={active.caption}
                className="max-h-[64vh] max-w-full object-contain will-change-transform"
                style={
                  reducedMotion
                    ? undefined
                    : { animation: "ken-burns 19s ease-in-out infinite alternate" }
                }
              />
            </div>

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
                  className="text-[11px] leading-none text-accent-warm"
                >
                  {isPaused ? "▶" : "❚❚"}
                </span>
                <span className="font-mono text-[10px] text-muted">
                  {active.title}
                  <span className="text-muted-dim"> · {active.artist}</span>
                </span>
              </button>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-dim">
                {(activeIndex ?? 0) + 1} / {frames.length} · scroll, swipe or fly
                · esc to exit
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
