"use client";

import { useMainPlaying, playMain, pauseMain } from "@/lib/audio/mainTrack";

export function SoundtrackToggle() {
  const playing = useMainPlaying();

  function toggle() {
    if (playing) pauseMain();
    else playMain();
  }

  return (
    <button
      onClick={toggle}
      aria-label={playing ? "Pause soundtrack" : "Play soundtrack"}
      aria-pressed={playing}
      title={
        playing
          ? "Pause soundtrack"
          : "Play soundtrack: Nostalgic Old Piano Song"
      }
      className="flex h-9 w-9 items-center justify-center rounded-full border border-border-strong text-foreground transition-colors hover:border-accent hover:text-accent-bright"
    >
      {playing ? <PauseIcon /> : <PlayIcon />}
    </button>
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
