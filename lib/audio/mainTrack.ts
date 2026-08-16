"use client";

import { useSyncExternalStore } from "react";

let audioEl: HTMLAudioElement | null = null;
let playing = false;
let userPaused = false;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

export function registerAudioElement(el: HTMLAudioElement) {
  audioEl = el;
}

export function playMain() {
  userPaused = false;
  audioEl?.play().catch(() => {
    // Autoplay blocked until a real user gesture happens somewhere on the
    // page — the global first-interaction listener in MainSoundtrack
    // retries this.
  });
}

export function pauseMain() {
  userPaused = true;
  audioEl?.pause();
}

export function isUserPaused() {
  return userPaused;
}

export function setMainPlaying(next: boolean) {
  if (playing === next) return;
  playing = next;
  notify();
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot() {
  return playing;
}

function getServerSnapshot() {
  return false;
}

export function useMainPlaying() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Ramps the main track's volume over `ms`, for ducking under the Off Duty theme. */
export function fadeMainTo(targetVolume: number, ms: number) {
  if (!audioEl) return;
  const el = audioEl;
  const start = el.volume;
  const startTime = performance.now();

  function step(now: number) {
    const t = Math.min(1, (now - startTime) / ms);
    const next = start + (targetVolume - start) * t;
    el.volume = Math.min(1, Math.max(0, next));
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
