"use client";

import { useCallback, useSyncExternalStore } from "react";

export const KENZ_TOTAL = 6;
const STORAGE_KEY = "kenz-found";
const listeners = new Set<() => void>();

function readFound(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

const EMPTY_SNAPSHOT: string[] = [];
function getServerSnapshot(): string[] {
  return EMPTY_SNAPSHOT;
}

let cachedSnapshot: string[] = EMPTY_SNAPSHOT;
let cachedRaw: string | null | undefined;
function getSnapshot(): string[] {
  const raw =
    typeof window === "undefined"
      ? null
      : window.localStorage.getItem(STORAGE_KEY);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedSnapshot = raw ? readFound() : EMPTY_SNAPSHOT;
  }
  return cachedSnapshot;
}

function persist(next: string[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // storage unavailable — progress just won't persist this session
  }
  listeners.forEach((l) => l());
}

export function useKenzProgress() {
  const found = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const markFound = useCallback((id: string) => {
    const current = readFound();
    if (current.includes(id)) return;
    persist([...current, id]);
  }, []);

  return {
    found,
    foundCount: found.length,
    total: KENZ_TOTAL,
    allFound: found.length >= KENZ_TOTAL,
    markFound,
  };
}
