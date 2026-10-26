type RefCallback<T> = (element: T | null) => void | (() => void);

/** Combine plusieurs refs-fonctions (avec leur nettoyage) sur un même élément. */
export function mergeRefs<T>(...refs: RefCallback<T>[]) {
  return (element: T | null) => {
    const cleanups = refs.map((ref) => ref(element));
    return () => cleanups.forEach((cleanup) => cleanup?.());
  };
}
