import type { DiagnosticAxis } from '../content';
import styles from './LeverScenes.module.css';

export type SceneId = DiagnosticAxis | 'organisation';

const SCENES: SceneId[] = [
  'organisation',
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
 * Fond du plein écran de l'autodiagnostic : une illustration par levier (et une pour
 * l'organisation), même bleu nuit que la page, sujet à droite, côté opposé au texte. Elle
 * apparaît en fondu quand ce levier est montré. Décorative, sans aucun texte. `active` à null :
 * aucune illustration (écran de résultat, déjà dense). Toutes sont chargées à l'ouverture, pour
 * que le fondu ne bute jamais sur une image absente. `shifted` : cadrage de l'écran d'accueil.
 */
export function LeverScenes({ active, shifted }: { active: SceneId | null; shifted?: boolean }) {
  return (
    <div className={styles.scenes} data-shifted={shifted || undefined} aria-hidden="true">
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
