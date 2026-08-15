"use client";

import { useEffect, useRef, useState } from "react";

const TRACK_URI = "spotify:track:1yslmgUcM2AOkOPS4sl3QV";

type SpotifyController = {
  play: () => void;
  pause: () => void;
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
            // Spotify's embed doesn't emit a distinct "ended" event — at
            // the end of the (30s preview) track it just freezes with
            // isPaused still false and stops sending updates. Without this
            // check, `playing` gets stuck true forever after the track
            // ends, so clicking the button calls pause() on something
            // that's already silently stopped and nothing happens.
            const ended =
              e.data.duration > 0 && e.data.position >= e.data.duration;
            setPlaying(!e.data.isPaused && !e.data.isBuffering && !ended);
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
    // Optimistic update — playback_update events arrive roughly once a
    // second, which read as laggy if the button waits for confirmation
    // before flipping. The next event corrects this if it's ever wrong.
    if (playing) {
      setPlaying(false);
      controllerRef.current.pause();
    } else {
      setPlaying(true);
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
            : "Play soundtrack — Bohemian Rhapsody, Queen (30s preview)"
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
