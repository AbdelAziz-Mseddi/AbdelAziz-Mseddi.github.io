type RouterLike = { push: (href: string) => void };

type StartViewTransition = (callback: () => void) => unknown;

/**
 * Single-take mode's navigation: continuous camera feel instead of a
 * discrete route swap. Prefers the View Transitions API; on browsers
 * without it, falls back to a manual opacity crossfade around the DOM
 * swap rather than a hard cut.
 */
export function navigateWithTransition(
  router: RouterLike,
  href: string,
  reducedMotion: boolean
) {
  if (reducedMotion) {
    router.push(href);
    return;
  }

  const startViewTransition = (
    document as Document & { startViewTransition?: StartViewTransition }
  ).startViewTransition;

  if (startViewTransition) {
    startViewTransition.call(document, () => {
      router.push(href);
    });
    return;
  }

  const body = document.body;
  const prevTransition = body.style.transition;
  body.style.transition = "opacity 160ms ease";
  body.style.opacity = "0";
  window.setTimeout(() => {
    router.push(href);
    window.setTimeout(() => {
      body.style.opacity = "1";
      window.setTimeout(() => {
        body.style.transition = prevTransition;
      }, 200);
    }, 30);
  }, 160);
}
