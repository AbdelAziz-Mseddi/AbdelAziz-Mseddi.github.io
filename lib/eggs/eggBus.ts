/**
 * Decoupled trigger bus for easter eggs. Lets a future terminal (egg #5)
 * fire `fly` / `kenz` / etc. without importing the components directly —
 * it just dispatches an event, whichever egg is listening reacts.
 */
export type EggEvent = "fly" | "terminal-open";

export function fireEgg(name: EggEvent) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(`egg:${name}`));
}

export function onEgg(name: EggEvent, handler: () => void) {
  if (typeof window === "undefined") return () => {};
  const listener = () => handler();
  window.addEventListener(`egg:${name}`, listener);
  return () => window.removeEventListener(`egg:${name}`, listener);
}
