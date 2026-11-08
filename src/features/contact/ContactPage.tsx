import { CalendarCheckIcon } from '@phosphor-icons/react/dist/csr/CalendarCheck';
import { EnvelopeSimpleIcon } from '@phosphor-icons/react/dist/csr/EnvelopeSimple';
import { IdentificationBadgeIcon } from '@phosphor-icons/react/dist/csr/IdentificationBadge';
import { MapPinIcon } from '@phosphor-icons/react/dist/csr/MapPin';
import { PhoneIcon } from '@phosphor-icons/react/dist/csr/Phone';
import { Link } from 'react-router';
import { JOIN_HREF, QUOTE_HREF } from '@/app/layouts/navbar/menu';
import { ArrowRightIcon } from '@/components/icons';
import { company, MAPS_QUERY } from '@/config/company';
import { useLanguage } from '@/i18n/useLanguage';
import { cx } from '@/lib/cx';
import { env } from '@/lib/env';
import styles from './ContactPage.module.css';
import { contactContent } from './content';

/** Carte Google Maps intégrée (sans clé), sur l'adresse officielle ; chargée à l'approche. */
const mapEmbed = (lang: string) =>
  `https://www.google.com/maps?q=${encodeURIComponent(MAPS_QUERY)}&z=16&hl=${lang}&output=embed`;
const directions = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(MAPS_QUERY)}`;

/**
 * Page « Contact » : titre et introduction ; les deux formulaires (demande de rendez-vous,
 * candidature) en deux portes ; puis les coordonnées sur un panneau bleu nuit à côté de la
 * carte (Google Maps). Ordinateur : panneau à gauche, carte à droite ; téléphone : l'un sous
 * l'autre. Coordonnées : src/config/company.ts, comme le pied de page.
 */
export default function ContactPage() {
  const { lang } = useLanguage();
  const t = contactContent[lang];
  const address = company.address[lang];

  const doors = [
    {
      key: 'appointment',
      door: t.doors.appointment,
      href: QUOTE_HREF,
      Icon: CalendarCheckIcon,
      primary: true,
    },
    {
      key: 'join',
      door: t.doors.join,
      href: JOIN_HREF,
      Icon: IdentificationBadgeIcon,
      primary: false,
    },
  ];

  return (
    <div className={`container page ${styles.page}`}>
      <title>{`${t.title} · ${env.appName}`}</title>
      <header className={styles.head}>
        <p className={styles.eyebrow}>{t.eyebrow}</p>
        <h1 className={styles.title}>{t.title}</h1>
        <p className={styles.intro}>{t.intro}</p>
      </header>

      <section aria-labelledby="contact-forms" className={styles.doorsSection}>
        <h2 id="contact-forms" className="sr-only">
          {t.doorsTitle}
        </h2>
        <ul className={styles.doors}>
          {doors.map(({ key, door, href, Icon, primary }) => (
            <li key={key} className={styles.door}>
              <span className={styles.doorIcon} aria-hidden="true">
                <Icon size={28} weight="duotone" />
              </span>
              <h3 className={styles.doorTitle}>{door.title}</h3>
              <p className={styles.doorText}>{door.text}</p>
              <Link
                to={href}
                className={cx('btn', primary ? 'btn-primary' : 'btn-secondary', styles.cta)}
              >
                {door.cta}
                <ArrowRightIcon size={18} className="arrow" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="contact-details" className={styles.where}>
        <div className={cx(styles.details, 'on-dark')}>
          <h2 id="contact-details" className={styles.detailsTitle}>
            {t.details.title}
          </h2>
          <dl className={styles.list}>
            <div className={styles.item}>
              <dt>
                <PhoneIcon size={22} weight="duotone" aria-hidden="true" />
                {t.details.phone}
              </dt>
              <dd>
                <a
                  href={company.phone.href}
                  dir="ltr"
                  aria-label={t.details.call(company.phone.display)}
                >
                  {company.phone.display}
                </a>
              </dd>
            </div>
            <div className={styles.item}>
              <dt>
                <EnvelopeSimpleIcon size={22} weight="duotone" aria-hidden="true" />
                {t.details.email}
              </dt>
              <dd>
                <a href={`mailto:${company.email}`} dir="ltr">
                  {company.email}
                </a>
              </dd>
            </div>
            <div className={styles.item}>
              <dt>
                <MapPinIcon size={22} weight="duotone" aria-hidden="true" />
                {t.details.address}
              </dt>
              <dd>
                <address>{address}</address>
                <a
                  href={directions}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.directions}
                >
                  {t.details.directions}
                  <span className="sr-only"> {t.details.newTab}</span>
                  <ArrowRightIcon size={16} className="arrow" />
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <figure className={styles.map}>
          <iframe
            src={mapEmbed(lang)}
            title={t.mapTitle(address)}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </figure>
      </section>
    </div>
  );
}
