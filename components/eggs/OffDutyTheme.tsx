"use client";

import { useEffect, useRef } from "react";
import type { MotionValue } from "motion/react";
import { fadeMainTo, isUserPaused } from "@/lib/audio/mainTrack";

// The official Mia & Sebastian's Theme, Justin Hurwitz, from La La Land
// (Original Motion Picture Soundtrack), 2016 — verified against the
// album's actual track listing, not guessed. Once triggered, it plays
// through regardless of scroll position — leaving the section doesn't
// cut it off. Anonymous Spotify embeds cap playback at a ~30s preview
// with no volume control exposed by their API, so it hard-stops there;
// the only fade that's actually possible is the main track easing back
// in afterward.
const TRACK_URI = "spotify:track:1Vk4yRsz0iBzDiZEoFMQyv";
const ENTER_THRESHOLD = 0.15;

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

export function OffDutyTheme({ progress }: { progress: MotionValue<number> }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<SpotifyController | null>(null);
  const firedRef = useRef(false);
  const activeRef = useRef(false);
  const restoredRef = useRef(false);

  function restoreMain() {
    if (restoredRef.current) return;
    restoredRef.current = true;
    activeRef.current = false;
    controllerRef.current?.pause();
    fadeMainTo(1, 700);
  }

  useEffect(() => {
    window.onSpotifyIframeApiReady = (IFrameAPI) => {
      if (!containerRef.current) return;
      IFrameAPI.createController(
        containerRef.current,
        { uri: TRACK_URI, width: "1", height: "1" },
        (controller) => {
          controllerRef.current = controller;
          controller.addListener("playback_update", (e) => {
            const ended =
              e.data.duration > 0 && e.data.position >= e.data.duration;
            if (ended && activeRef.current) restoreMain();
          });
        }
      );
    };

    const tag = document.createElement("script");
    tag.src = "https://open.spotify.com/embed/iframe-api/v1";
    document.body.appendChild(tag);
  }, []);

  useEffect(() => {
    return progress.on("change", (v) => {
      if (firedRef.current) return;
      if (v > ENTER_THRESHOLD && !isUserPaused()) {
        firedRef.current = true;
        activeRef.current = true;
        fadeMainTo(0.05, 500);
        window.setTimeout(() => controllerRef.current?.play(), 500);
      }
    });
  }, [progress]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed -left-[9999px] top-0 h-2 w-2 opacity-0"
      aria-hidden="true"
    />
  );
}
