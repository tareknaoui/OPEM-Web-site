import { Link } from 'react-router';
import { ArrowRightIcon } from '@/components/icons';
import { homeContent } from '@/features/home/content';
import { useLanguage } from '@/i18n/useLanguage';
import { cx } from '@/lib/cx';
import { iaContent } from './content';
import styles from './IaPage.module.css';

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Page « IA appliquée » (/ia-appliquee), vers laquelle mène le bouton « Passer la porte » du
 * bloc IA de l'accueil. En attendant le texte d'OPEM (Notion), elle reprend les textes validés du
 * bloc : titre, présentation et démarche en trois temps, puis un appel à échanger.
 */
export default function IaPage() {
  const { lang } = useLanguage();
  const page = iaContent[lang];
  const { ai } = homeContent[lang];

  return (
    <>
      <title>{page.title}</title>

      <section className={cx(styles.hero, 'on-dark')} aria-labelledby="ia-title">
        <div className={cx('container', styles.heroInner)}>
          <p className={styles.kicker}>{page.eyebrow}</p>
          <h1 id="ia-title" className={styles.headline}>
            {ai.title}
          </h1>
          <p className={styles.intro}>{ai.text}</p>
        </div>
      </section>

      <section className="section" aria-labelledby="ia-steps-title">
        <div className="container">
          <h2 id="ia-steps-title" className="h2">
            {ai.stepsLabel}
          </h2>
          <ol className={styles.steps}>
            {ai.steps.map((step, index) => (
              <li key={step.label} className={styles.step}>
                <span className={styles.number} aria-hidden="true">
                  {pad(index + 1)}
                </span>
                <h3 className={styles.stepTitle}>{step.label}</h3>
                <p className={styles.stepText}>{step.text}</p>
              </li>
            ))}
          </ol>
          <Link to="/contact" className={cx('btn btn-primary', styles.cta)}>
            {page.cta}
            <ArrowRightIcon size={18} className="arrow" />
          </Link>
        </div>
      </section>
    </>
  );
}
