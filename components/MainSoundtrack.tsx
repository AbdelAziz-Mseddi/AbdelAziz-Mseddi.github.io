"use client";

import { useEffect, useRef } from "react";
import {
  registerAudioElement,
  playMain,
  setMainPlaying,
  isEnabled,
} from "@/lib/audio/mainTrack";

/**
 * The site's soundtrack. Strictly opt-in — landing on the page is silent,
 * and nothing plays until the toggle is used. The only thing that starts
 * playback automatically is a stored preference from a previous visit,
 * and even then the browser may hold it until the first gesture, so that
 * case retries once on the page's first click/keydown.
 */
export function MainSoundtrack() {
  const ref = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    registerAudioElement(el);

    function onPlay() {
      setMainPlaying(true);
    }
    function onPause() {
      setMainPlaying(false);
    }
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);

    // Restore a previous visit's choice only — never start unasked.
    if (isEnabled()) playMain(false);

    return () => {
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
    };
  }, []);

  useEffect(() => {
    function onFirstInteraction() {
      if (isEnabled()) playMain(false);
      window.removeEventListener("pointerdown", onFirstInteraction);
      window.removeEventListener("keydown", onFirstInteraction);
    }
    window.addEventListener("pointerdown", onFirstInteraction);
    window.addEventListener("keydown", onFirstInteraction);
    return () => {
      window.removeEventListener("pointerdown", onFirstInteraction);
      window.removeEventListener("keydown", onFirstInteraction);
    };
  }, []);

  return (
    <audio
      ref={ref}
      src="/audio/nostalgic-old-piano-song.mp3"
      loop
      preload="auto"
    />
  );
}
