"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "soundtrack-enabled";

let audioEl: HTMLAudioElement | null = null;
let playing = false;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

/**
 * The soundtrack is opt-in: nothing plays until someone hits the toggle.
 * The choice is remembered so it carries across page loads — turning it on
 * once shouldn't mean turning it on again on every project page.
 */
export function isEnabled() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(STORAGE_KEY) === "1";
}

function setEnabled(next: boolean) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
}

export function registerAudioElement(el: HTMLAudioElement) {
  audioEl = el;
}

/**
 * Starts playback and remembers the choice. `remember: false` is for the
 * restore-on-load path, which is acting on a stored preference rather than
 * recording a new one.
 */
export function playMain(remember = true) {
  if (remember) setEnabled(true);
  audioEl?.play().catch(() => {
    // Autoplay blocked until a real user gesture. Only relevant when
    // restoring a stored preference — a click on the toggle is itself the
    // gesture, so that path never lands here.
  });
}

export function pauseMain() {
  setEnabled(false);
  audioEl?.pause();
}

/** True when the soundtrack is off — whether never started or turned off. */
export function isUserPaused() {
  return !isEnabled();
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
