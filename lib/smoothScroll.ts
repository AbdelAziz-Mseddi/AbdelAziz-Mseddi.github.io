import type { MouseEvent } from "react";

export function handleSmoothScroll(e: MouseEvent<HTMLAnchorElement>) {
  const href = e.currentTarget.getAttribute("href");
  if (!href) return;
  // Accept both "#work" and "/#work": the latter lets the same nav link work
  // from a sub-page (/archive, /work/…), where it should navigate home to the
  // section rather than scroll a section that isn't on the page.
  const hashIndex = href.indexOf("#");
  if (hashIndex === -1) return;
  const hash = href.slice(hashIndex);
  const target = document.querySelector(hash);
  // Not on this page → let the browser navigate to "/#section" normally.
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
