import { CheckIcon } from '@/components/icons';
import { useLanguage } from '@/i18n/useLanguage';
import { cx } from '@/lib/cx';
import { ProvisionalNote } from '@/features/home/sections/SectionHeader';
import { cabinetContent } from './content';
import { Manifesto } from './sections/Manifesto';
import { Method } from './sections/Method';
import styles from './CabinetPage.module.css';

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Page « Le cabinet ». Rien de ce que montre déjà l'accueil (chiffres, domaines), et chaque
 * idée à un seul endroit. Six temps, fonds alternés (le bleu OPEM du pied de page ne touche
 * jamais le bleu nuit) :
 * en-tête bleu nuit (titre, présentation) ;
 * manifeste sur blanc (les mots s'allument au défilement, citation) ;
 * démarche en 3 niveaux sur bleu très clair (titre et compteur fixes, filet qui se remplit) ;
 * six valeurs sur blanc (filets qui se tracent) ; équipe sur bleu très clair ;
 * garanties de la formation sur blanc (agrément en ambre sur bleu nuit, dispositif qualité).
 * Textes : ./content.ts
 */
export default function CabinetPage() {
  const { lang } = useLanguage();
  const content = cabinetContent[lang];
  const { hero, about, method, values, team, pledges } = content;

  return (
    <>
      <title>{content.title}</title>

      {/* ---------- En-tête ---------- */}
      <section className={cx(styles.hero, 'on-dark')} aria-labelledby="cabinet-title">
        <div className={cx('container', styles.heroInner)}>
          <p className={styles.kicker}>{hero.eyebrow}</p>
          <h1 id="cabinet-title" className={styles.headline}>
            {hero.headline[0]} <span className={styles.accent}>{hero.headline[1]}</span>
          </h1>
          <p className={styles.intro}>{hero.intro}</p>
        </div>
      </section>

      <Manifesto about={about} />
      <Method method={method} />

      {/* ---------- Valeurs ---------- */}
      <section className="section" aria-labelledby="values-title">
        <div className="container">
          <div className={styles.head} data-reveal>
            <p className="eyebrow">{values.eyebrow}</p>
            <h2 id="values-title" className="h2">
              {values.title}
            </h2>
            <p className={cx('lead', styles.valuesIntro)}>{values.intro}</p>
          </div>
          <ul className={styles.valueList} data-reveal-stagger>
            {values.items.map((value, index) => (
              <li key={value.title} className={styles.valueItem}>
                <span className={styles.valueNumber} aria-hidden="true">
                  {pad(index + 1)}
                </span>
                <div>
                  <h3 className={styles.valueTitle}>{value.title}</h3>
                  <p className={styles.valueText}>{value.text}</p>
                </div>
              </li>
            ))}
          </ul>
          <ProvisionalNote show={values.provisional}>{values.note}</ProvisionalNote>
        </div>
      </section>

      {/* ---------- Équipe ---------- */}
      <section className={cx('section on-surface', styles.team)} aria-labelledby="team-title">
        <div className="container grid-12">
          <div className={styles.teamHead} data-reveal>
            <p className="eyebrow">{team.eyebrow}</p>
            <h2 id="team-title" className="h2">
              {team.title}
            </h2>
            <p className={cx('lead', styles.teamText)}>{team.text}</p>
          </div>
          <p className={styles.director} data-reveal>
            <span className={styles.directorLabel}>{team.lead.label}</span>
            <span className={styles.directorName}>{team.lead.name}</span>
            <span className={styles.directorRole}>{team.lead.role}</span>
          </p>
        </div>
      </section>

      {/* ---------- Garanties de la formation ---------- */}
      <section className="section" aria-labelledby="pledges-title">
        <div className="container">
          <div className={styles.head} data-reveal>
            <p className="eyebrow">{pledges.eyebrow}</p>
            <h2 id="pledges-title" className="h2">
              {pledges.title}
            </h2>
          </div>
          <div className={styles.pledgeGrid} data-reveal-stagger>
            <div className={cx(styles.approval, 'on-dark')}>
              <span className={styles.approvalLabel}>{pledges.approval.label}</span>
              <span className={styles.approvalNumber}>{pledges.approval.title}</span>
              <p className={styles.approvalText}>{pledges.approval.text}</p>
            </div>
            <div className={styles.quality}>
              <h3 className={styles.qualityTitle}>{pledges.qualityTitle}</h3>
              <ul className={styles.qualityList}>
                {pledges.quality.map((item) => (
                  <li key={item}>
                    <CheckIcon size={20} className={styles.check} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <ProvisionalNote show={pledges.provisional}>{pledges.note}</ProvisionalNote>
        </div>
      </section>
    </>
  );
}
