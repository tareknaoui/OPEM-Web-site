import { useEffect } from 'react';

/** Attribut posé sur <html> : lu par Footer.module.css pour masquer le bandeau d'appel. */
export const FOOTER_CTA_ATTRIBUTE = 'data-footer-cta';

/**
 * Masque le bandeau d'appel du pied de page tant que la page qui l'appelle est affichée : une
 * page qui a déjà sa propre demande (vitrine d'une formation) ne propose qu'une action.
 */
export function useHideFooterCta() {
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute(FOOTER_CTA_ATTRIBUTE, 'off');
    return () => root.removeAttribute(FOOTER_CTA_ATTRIBUTE);
  }, []);
}
