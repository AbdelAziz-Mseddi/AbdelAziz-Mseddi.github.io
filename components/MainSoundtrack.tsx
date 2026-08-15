"use client";

import { useEffect, useRef } from "react";
import {
  registerAudioElement,
  playMain,
  setMainPlaying,
  isUserPaused,
} from "@/lib/audio/mainTrack";

/**
 * The site's default soundtrack — plays from the start. Browsers block
 * unmuted autoplay before any user gesture, so this attempts play() on
 * mount and again retries on the page's first click/keydown if that
 * first attempt was blocked. Either way, by the time someone reaches for
 * the toggle it should already be going — the toggle's job is to stop it,
 * not start it.
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

    playMain();

    return () => {
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
    };
  }, []);

  useEffect(() => {
    function onFirstInteraction() {
      if (!isUserPaused()) playMain();
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
