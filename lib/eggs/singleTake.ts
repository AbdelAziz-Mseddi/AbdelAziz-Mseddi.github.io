"use client";

import { useSyncExternalStore } from "react";

let enabled = false;
// A take has a start time and a number, because a single take is a
// continuous thing: the clock keeps running across navigations, and cutting
// then rolling again starts take 2.
let startedAt = 0;
let takeNumber = 0;
const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot() {
  return enabled;
}

function getServerSnapshot() {
  return false;
}

function notify() {
  listeners.forEach((l) => l());
}

export function setSingleTake(next: boolean) {
  if (enabled === next) return;
  enabled = next;
  if (next) {
    takeNumber += 1;
    startedAt = Date.now();
  }
  notify();
}

/** Milliseconds the current take has been rolling, and which take it is. */
export function getTake() {
  return { startedAt, takeNumber };
}

export function isSingleTakeEnabled() {
  return enabled;
}

export function useSingleTakeMode() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
