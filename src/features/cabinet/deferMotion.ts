import { ScrollTrigger } from 'gsap/ScrollTrigger';

/*
 * Mise en place différée des animations de la page « Le cabinet ».
 *
 * Préparer une animation GSAP (découper un titre, figer une section, lire les positions) oblige
 * le navigateur à recalculer la mise en page ; fait d'un coup pour toute la page, cela la
 * figeait plusieurs secondes sur téléphone. Chaque bloc confie donc sa préparation à
 * deferMotion : elle n'a lieu qu'à l'approche de l'écran (une hauteur d'écran avant), et
 * toujours dans l'ordre de la page : quand un bloc arrive, tous ceux qui le précèdent sont
 * préparés d'abord. Ainsi les sections figées (pin) sont créées de haut en bas, comme
 * ScrollTrigger l'attend, et rien ne s'insère au-dessus de ce que l'on regarde.
 *
 * Saut direct vers une rubrique (sommaire, adresse avec ancre) : motionUpTo(cible) prépare tout
 * ce qui précède avant de descendre, pour arriver au bon endroit.
 */

type Cleanup = void | (() => void);
type Entry = { element: Element; setup: () => Cleanup; cleanup: Cleanup; done: boolean };

const entries = new Set<Entry>();
let observer: IntersectionObserver | null = null;

/** a avant b dans la page (un parent passe avant ses enfants). */
const before = (a: Element, b: Element) =>
  a === b || Boolean(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);

function run(entry: Entry) {
  entry.done = true;
  observer?.unobserve(entry.element);
  entry.cleanup = entry.setup();
}

/** Prépare, dans l'ordre de la page, tous les blocs en attente jusqu'à `target` compris. */
export function motionUpTo(target: Element) {
  const pending = [...entries]
    .filter((entry) => !entry.done)
    .sort((a, b) => (before(a.element, b.element) ? -1 : 1));
  for (const entry of pending) {
    if (!before(entry.element, target) && !entry.element.contains(target)) break;
    run(entry);
  }
}

/** Prépare tout ce qui reste, puis recalcule les positions : avant un saut vers une rubrique. */
export function motionUpToAndRefresh(target: Element) {
  const pending = [...entries].some((entry) => !entry.done);
  motionUpTo(target);
  if (pending) ScrollTrigger.refresh();
}

function watch(): IntersectionObserver {
  observer ??= new IntersectionObserver(
    (seen) =>
      seen.forEach((entry) => {
        if (entry.isIntersecting) motionUpTo(entry.target);
      }),
    { rootMargin: '0px 0px 100% 0px' },
  );
  return observer;
}

/**
 * Confie la préparation d'une animation : `setup` s'exécute à l'approche de `element` (ou
 * avant, si un bloc plus bas est atteint d'abord) ; la fonction renvoyée défait tout (à
 * renvoyer depuis useEffect).
 */
export function deferMotion(element: Element, setup: () => Cleanup): () => void {
  const entry: Entry = { element, setup, cleanup: undefined, done: false };
  // Sans IntersectionObserver (tests, très vieux navigateurs) : tout de suite.
  if (typeof IntersectionObserver === 'undefined') {
    run(entry);
    return () => {
      if (typeof entry.cleanup === 'function') entry.cleanup();
    };
  }
  entries.add(entry);
  watch().observe(element);
  return () => {
    entries.delete(entry);
    observer?.unobserve(element);
    if (entry.done && typeof entry.cleanup === 'function') entry.cleanup();
    if (entries.size === 0) {
      observer?.disconnect();
      observer = null;
    }
  };
}
