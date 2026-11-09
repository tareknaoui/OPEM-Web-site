/*
 * Après une mise en ligne, un onglet resté ouvert garde l'ancienne version du site : en changeant
 * de page, il demande un fichier JavaScript (IaPage-<ancienne empreinte>.js) qui n'existe plus.
 * On le reconnaît à son message d'erreur, et on recharge la page demandée, une seule fois : le
 * navigateur prend alors la nouvelle version. Si le rechargement ne suffit pas (vraie panne),
 * la page d'erreur s'affiche normalement.
 */

const KEY = 'opem:stale-chunk-reload';
/** Délai pendant lequel on ne recharge pas une seconde fois (évite toute boucle). */
const GUARD_MS = 10_000;

/** Messages des navigateurs quand un module chargé à la demande est introuvable. */
const PATTERNS = [
  /Failed to fetch dynamically imported module/i, // Chrome, Edge
  /error loading dynamically imported module/i, // Firefox
  /Importing a module script failed/i, // Safari
  /Unable to preload CSS/i, // Vite (feuille de style de la page)
  /'text\/html' is not a valid JavaScript MIME type/i,
];

export function isStaleChunkError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : typeof error === 'string' ? error : '';
  return PATTERNS.some((pattern) => pattern.test(message));
}

/** Peut-on recharger ? Non si on vient déjà de le faire (lecture seule, sans effet). */
export function canReload(now = Date.now()): boolean {
  let last = 0;
  try {
    last = Number(sessionStorage.getItem(KEY)) || 0;
  } catch {
    // Stockage indisponible (navigation privée stricte) : on recharge quand même, une fois.
  }
  return now - last >= GUARD_MS;
}

/** Recharge la page, sauf si on vient déjà de le faire. Renvoie true si le rechargement part. */
export function reloadOnce(now = Date.now()): boolean {
  if (!canReload(now)) return false;
  try {
    sessionStorage.setItem(KEY, String(now));
  } catch {
    // Sans stockage, pas de garde : le délai ne s'applique pas, mais l'erreur reste rare.
  }
  window.location.reload();
  return true;
}
