import type { DiagnosticAxis } from '../content';
import styles from './LeverScenes.module.css';

export type SceneId = DiagnosticAxis | 'organisation' | 'secteur' | 'taille' | 'fonction' | 'fin';

const SCENES: SceneId[] = [
  'organisation',
  'secteur',
  'taille',
  'fonction',
  'fin',
  'strategie',
  'structure',
  'systemes',
  'valeurs',
  'style',
  'personnel',
  'competences',
];

const BASE = '/images/diagnostic';

/**
 * Fond du plein écran de l'autodiagnostic : une illustration par levier, une pour le secteur
 * d'activité, une pour la taille, une pour la fonction, une pour le statut et une pour la fin du
 * questionnaire. Même bleu nuit que la page, sujet à droite, côté opposé au texte. Elle apparaît
 * en fondu quand son écran est montré. Décorative, sans aucun texte. `active` à null : aucune
 * illustration (écran de résultat, déjà dense). Toutes sont chargées à l'ouverture, pour que le
 * fondu ne bute jamais sur une image absente.
 */
export function LeverScenes({ active }: { active: SceneId | null }) {
  return (
    <div className={styles.scenes} aria-hidden="true">
      {SCENES.map((id) => (
        <img
          key={id}
          className={styles.scene}
          data-active={id === active || undefined}
          src={`${BASE}/${id}.webp`}
          srcSet={`${BASE}/${id}-1100.webp 1100w, ${BASE}/${id}.webp 1920w`}
          sizes="100vw"
          alt=""
          width={1920}
          height={1080}
          decoding="async"
        />
      ))}
    </div>
  );
}
