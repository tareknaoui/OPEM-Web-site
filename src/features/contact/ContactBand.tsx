import { EnvelopeSimpleIcon } from '@phosphor-icons/react/dist/csr/EnvelopeSimple';
import { PhoneIcon } from '@phosphor-icons/react/dist/csr/Phone';
import { useId } from 'react';
import { Link } from 'react-router';
import { QUOTE_HREF } from '@/app/layouts/navbar/menu';
import { ArrowRightIcon } from '@/components/icons';
import { company } from '@/config/company';
import { expertisesContent } from '@/features/expertises/content';
import { useLanguage } from '@/i18n/useLanguage';
import { cx } from '@/lib/cx';
import { contactContent } from './content';
import styles from './ContactBand.module.css';

/**
 * « Premier échange » : le bloc de contact au pied des pages d'expertise. Fond bleu clair (le
 * pied de page, bleu nuit, le suit). À gauche, le texte et le bouton de « Nos expertises »
 * (demande de rendez-vous, comme le bouton du menu) ; à droite, le téléphone et le courriel.
 * Aucun texte nouveau : tout vient de « Nos expertises », de la page Contact et des coordonnées.
 */
export function ContactBand() {
  const { lang } = useLanguage();
  const ids = useId();
  const talk = expertisesContent[lang].talk;
  const details = contactContent[lang].details;

  return (
    <section className={styles.band} aria-labelledby={`${ids}-title`}>
      <div className={cx('container', styles.grid)}>
        <div className={styles.text}>
          <p className={styles.eyebrow}>{talk.eyebrow}</p>
          <h2 id={`${ids}-title`} className={styles.title} data-motion="title">
            <span className={styles.line}>{talk.title[0]}</span>{' '}
            <span className={styles.line}>{talk.title[1]}</span>
          </h2>
          <p className={styles.body}>{talk.text}</p>
          <Link to={QUOTE_HREF} className={styles.button}>
            {talk.button}
            <ArrowRightIcon size={18} className="arrow" />
          </Link>
          <p className={styles.note}>{talk.note}</p>
        </div>

        <div className={styles.card}>
          <p className={styles.cardTitle}>{details.title}</p>
          <ul className={styles.channels}>
            <li>
              <a
                href={company.phone.href}
                className={styles.channel}
                aria-label={details.call(company.phone.display)}
              >
                <span className={styles.icon} aria-hidden="true">
                  <PhoneIcon size={24} weight="duotone" />
                </span>
                <span className={styles.channelText}>
                  <span className={styles.channelLabel}>{details.phone}</span>
                  <span className={styles.channelValue} dir="ltr">
                    {company.phone.display}
                  </span>
                </span>
              </a>
            </li>
            <li>
              <a href={`mailto:${company.email}`} className={styles.channel}>
                <span className={styles.icon} aria-hidden="true">
                  <EnvelopeSimpleIcon size={24} weight="duotone" />
                </span>
                <span className={styles.channelText}>
                  <span className={styles.channelLabel}>{details.email}</span>
                  <span className={styles.channelValue} dir="ltr">
                    {company.email}
                  </span>
                </span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
