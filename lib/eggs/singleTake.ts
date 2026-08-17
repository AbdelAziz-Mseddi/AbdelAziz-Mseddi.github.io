"use client";

import { useSyncExternalStore } from "react";

let enabled = false;
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
  notify();
}

export function isSingleTakeEnabled() {
  return enabled;
}

export function useSingleTakeMode() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
