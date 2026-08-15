import type { MouseEvent } from "react";

export function handleSmoothScroll(e: MouseEvent<HTMLAnchorElement>) {
  const href = e.currentTarget.getAttribute("href");
  if (!href || !href.startsWith("#")) return;
  const target = document.querySelector(href);
  if (!target) return;
  e.preventDefault();
  const reduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  target.scrollIntoView({
    behavior: reduced ? "auto" : "smooth",
    block: "start",
  });
}
