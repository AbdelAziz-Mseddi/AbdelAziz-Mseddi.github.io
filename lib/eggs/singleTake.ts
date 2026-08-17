"use client";

import { useSyncExternalStore } from "react";

let enabled = false;
// A take has a start time and a number, because a single take is a
// continuous thing: the clock keeps running across navigations, and cutting
// then rolling again starts take 2.
let startedAt = 0;
let takeNumber = 0;
// Which project the camera is currently on. Only that row carries
// view-transition-names, so a navigation animates two elements instead of
// all twenty-four on the index fighting each other.
let focused: string | null = null;
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

export function setTakeFocus(id: string | null) {
  if (focused === id) return;
  focused = id;
  notify();
}

function getFocusSnapshot() {
  return focused;
}

function getFocusServerSnapshot(): string | null {
  return null;
}

/** The project the take is on, so the index can re-apply names after a back
 *  navigation and the return trip morphs too. */
export function useTakeFocus() {
  return useSyncExternalStore(subscribe, getFocusSnapshot, getFocusServerSnapshot);
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
