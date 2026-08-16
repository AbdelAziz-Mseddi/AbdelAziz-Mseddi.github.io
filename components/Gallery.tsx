"use client";

import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/Reveal";
import { fadeMainTo, isUserPaused } from "@/lib/audio/mainTrack";

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
    src: "/frames/kairouan-mosque.jpg",
    caption: "Kairouan, after dark",
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

export function Gallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<SpotifyController | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);

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
            if (ended) {
              setPlayingId(null);
              if (!isUserPaused()) fadeMainTo(1, 700);
            }
          });
        }
      );
    };

    const tag = document.createElement("script");
    tag.src = "https://open.spotify.com/embed/iframe-api/v1";
    document.body.appendChild(tag);
  }, []);

  function toggleTrack(frame: (typeof frames)[number]) {
    const controller = controllerRef.current;
    if (!controller) return;

    if (playingId === frame.src) {
      controller.pause();
      setPlayingId(null);
      if (!isUserPaused()) fadeMainTo(1, 700);
      return;
    }

    controller.loadUri(`spotify:track:${frame.trackId}`);
    controller.play();
    setPlayingId(frame.src);
    fadeMainTo(0.05, 400);
  }

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
            Cats, the moon, the sky at odd hours — each with what was playing.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {frames.map((frame, i) => {
            const isPlaying = playingId === frame.src;
            return (
              <Reveal key={frame.src} delay={(i % 3) * 80}>
                <div className="group relative flex aspect-[4/5] items-end overflow-hidden rounded-xl border border-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={frame.src}
                    alt={frame.caption}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/0 to-black/0" />

                  <button
                    type="button"
                    onClick={() => toggleTrack(frame)}
                    aria-label={
                      isPlaying
                        ? `Pause ${frame.title} by ${frame.artist}`
                        : `Play ${frame.title} by ${frame.artist} (30s preview)`
                    }
                    className="absolute right-2 top-2 z-20 flex max-w-[85%] items-center gap-1.5 rounded-full border border-white/20 bg-black/55 px-2.5 py-1 text-left backdrop-blur-md transition-colors hover:border-white/50"
                  >
                    <span
                      aria-hidden="true"
                      className={`text-[10px] leading-none text-white ${
                        isPlaying ? "animate-pulse" : ""
                      }`}
                    >
                      {isPlaying ? "❚❚" : "♪"}
                    </span>
                    <span className="truncate font-mono text-[9px] leading-tight text-white/90">
                      {frame.title}
                      <span className="text-white/55"> · {frame.artist}</span>
                    </span>
                  </button>

                  <p className="relative z-10 w-full p-4 text-xs text-foreground">
                    {frame.caption}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
