import { useState } from 'react';
import {
  domainsVariants,
  footerVariants,
  heroVariants,
  insightsVariants,
  navbarVariants,
  setLayoutVariant,
  useLayoutVariants,
  type LayoutVariants,
} from './layoutVariants';
import styles from './VariantSwitcher.module.css';

type Option = { readonly id: string; readonly label: string; readonly description: string };

const GROUPS: { part: keyof LayoutVariants; legend: string; options: readonly Option[] }[] = [
  { part: 'navbar', legend: 'Barre de navigation', options: navbarVariants },
  { part: 'hero', legend: 'Bandeau d’accueil', options: heroVariants },
  { part: 'domains', legend: 'Section « Nos domaines »', options: domainsVariants },
  { part: 'insights', legend: 'Section « Éclairages et actualités »', options: insightsVariants },
  { part: 'footer', legend: 'Pied de page', options: footerVariants },
];

/**
 * Panneau flottant de comparaison des maquettes (outil de présentation, pas une
 * fonctionnalité du site). Le choix est appliqué en direct et mémorisé dans le navigateur.
 */
export function VariantSwitcher() {
  const variants = useLayoutVariants();
  const [open, setOpen] = useState(true);

  return (
    <aside
      className={styles.switcher}
      aria-label="Comparer les maquettes"
      lang="fr"
      dir="ltr"
      data-lenis-prevent
    >
      <button
        type="button"
        className={styles.toggle}
        aria-expanded={open}
        aria-controls="variant-panel"
        onClick={() => setOpen(!open)}
      >
        Maquettes
        <span className={styles.summary}>
          Barre {indexOf(navbarVariants, variants.navbar)} · Accueil{' '}
          {indexOf(heroVariants, variants.hero)} · Domaines{' '}
          {indexOf(domainsVariants, variants.domains)} · Éclairages{' '}
          {indexOf(insightsVariants, variants.insights)} · Pied{' '}
          {indexOf(footerVariants, variants.footer)}
        </span>
      </button>

      <div id="variant-panel" className={styles.panel} hidden={!open}>
        {GROUPS.map(({ part, legend, options }) => (
          <fieldset key={part} className={styles.group}>
            <legend>{legend}</legend>
            {options.map((option, index) => (
              <label key={option.id} className={styles.option}>
                <input
                  type="radio"
                  name={`variant-${part}`}
                  checked={variants[part] === option.id}
                  onChange={() => setLayoutVariant(part, option.id as LayoutVariants[typeof part])}
                />
                <span className={styles.optionText}>
                  <span className={styles.optionLabel}>
                    {index + 1}. {option.label}
                  </span>
                  <span className={styles.optionHint}>{option.description}</span>
                </span>
              </label>
            ))}
          </fieldset>
        ))}
      </div>
    </aside>
  );
}

function indexOf(options: readonly { id: string }[], id: string) {
  return options.findIndex((option) => option.id === id) + 1;
}
