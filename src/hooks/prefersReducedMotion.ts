/** L'utilisateur a-t-il demandé à réduire les animations (réglage du système) ? */
export function prefersReducedMotion() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}
