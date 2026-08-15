"use client";

import { useEffect, useRef, useState } from "react";

const TRACK_URI = "spotify:track:6Bg7MznA9X0dIhlAsLyBYj";

type SpotifyController = {
  play: () => void;
  pause: () => void;
  addListener: (
    event: "playback_update",
    cb: (e: { data: { isPaused: boolean; isBuffering: boolean } }) => void
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

export function SoundtrackToggle() {
  const containerRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<SpotifyController | null>(null);
  const pendingPlayRef = useRef(false);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    window.onSpotifyIframeApiReady = (IFrameAPI) => {
      if (!containerRef.current) return;
      IFrameAPI.createController(
        containerRef.current,
        { uri: TRACK_URI, width: "1", height: "1" },
        (controller) => {
          controllerRef.current = controller;
          setReady(true);
          controller.addListener("playback_update", (e) => {
            setPlaying(!e.data.isPaused && !e.data.isBuffering);
          });
          if (pendingPlayRef.current) {
            pendingPlayRef.current = false;
            controller.play();
          }
        }
      );
    };

    const tag = document.createElement("script");
    tag.src = "https://open.spotify.com/embed/iframe-api/v1";
    document.body.appendChild(tag);
  }, []);

  function toggle() {
    if (!ready || !controllerRef.current) {
      pendingPlayRef.current = true;
      return;
    }
    if (playing) {
      controllerRef.current.pause();
    } else {
      controllerRef.current.play();
    }
  }

  return (
    <>
      <div
        ref={containerRef}
        className="pointer-events-none fixed -left-[9999px] top-0 h-2 w-2 opacity-0"
        aria-hidden="true"
      />
      <button
        onClick={toggle}
        aria-label={playing ? "Pause soundtrack" : "Play soundtrack"}
        aria-pressed={playing}
        title={
          playing
            ? "Pause soundtrack"
            : "Play soundtrack — Ghost Town, Kanye West (30s preview)"
        }
        className="flex h-9 w-9 items-center justify-center rounded-full border border-border-strong text-foreground transition-colors hover:border-accent hover:text-accent-bright"
      >
        {playing ? <PauseIcon /> : <PlayIcon />}
      </button>
    </>
  );
}

function PlayIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M3 1.5v13l11-6.5-11-6.5z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <rect x="3" y="2" width="3.5" height="12" />
      <rect x="9.5" y="2" width="3.5" height="12" />
    </svg>
  );
}
