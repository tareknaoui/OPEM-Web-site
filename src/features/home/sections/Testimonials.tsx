import { Link } from 'react-router';
import { ArrowRightIcon } from '@/components/icons';
import type { HomeContent, TestimonialQuote } from '../content';
import { StudiesBand } from './StudiesBand';
import styles from './Testimonials.module.css';

type TestimonialsProps = {
  testimonials: HomeContent['testimonials'];
};

/**
 * Témoignages, en trois bandes : sur blanc, le titre et une étude de cas, racontée une seule fois
 * (l'illustration de la confiance en grand à gauche ; à droite le titre et le bouton, puis une
 * frise verticale, une phrase par étape, le passage clé en gras, la dernière étape en vert) ; sur bleu très clair, les recommandations,
 * chacune avec son illustration (sur le fond de la bande, sans cadre) ;
 * sur bleu nuit, les institutions qui confient leurs études au cabinet. Recommandations anonymes
 * (signées d'une direction, ou du nom et de la fonction de la personne quand elle l'a accepté),
 * sans photo de personne, puis un seul lien vers
 * « Références clients », qui réunit tous les témoignages autorisés.
 */
export function Testimonials({ testimonials }: TestimonialsProps) {
  const { caseStudy, featured, quotes, more, studies } = testimonials;
  // Version « portraits » : les logos des entreprises à la place des illustrations.
  const portraits = testimonials.layout === 'portraits';

  return (
    <section aria-labelledby="testimonials-title">
      <div className={styles.casesBand}>
        <div className="container">
          <div className={styles.wrap}>
            <header className={styles.header}>
              <p className={styles.eyebrow} data-reveal>
                {testimonials.eyebrow}
              </p>
              <h2 id="testimonials-title" className={styles.title} data-reveal="title">
                {testimonials.title}
              </h2>
            </header>

            <article className={styles.caseStudy}>
              <Illustration src={caseStudy.illustration} className={styles.caseImage} />
              <div className={styles.caseHead} data-reveal>
                <p className={styles.eyebrow}>{caseStudy.eyebrow}</p>
                <h3 className={styles.caseTitle}>{caseStudy.title}</h3>
                <Link to={caseStudy.link.href} className={`btn btn-primary ${styles.cta}`}>
                  {caseStudy.link.label}
                  <ArrowRightIcon size={18} className="arrow" />
                </Link>
              </div>

              <ol className={styles.timeline} data-reveal-stagger>
                {caseStudy.steps.map((step) => (
                  <li key={step.id} className={styles.event}>
                    <time className={styles.eventYear} dateTime={step.year}>
                      {step.year}
                    </time>
                    <div className={styles.eventBody}>
                      <h4 className={styles.eventLabel}>{step.label}</h4>
                      <p className={styles.eventText}>
                        <Emphasis text={step.text} part={step.emphasis} />
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </article>
          </div>
        </div>
      </div>

      <div className={styles.quotesBand}>
        <div className="container">
          <div className={styles.wrap}>
            <div
              className={styles.featuredRow}
              data-illustrated={(!portraits && Boolean(featured.illustration)) || undefined}
            >
              {!portraits && featured.illustration && (
                <Illustration src={featured.illustration} className={styles.featuredImage} />
              )}
              <Quote item={featured} featured portraits={portraits} />
            </div>
            <div className={styles.quotes}>
              {quotes.map((item) => (
                <div key={item.id} className={styles.quoteItem}>
                  {!portraits && item.illustration && (
                    <Illustration src={item.illustration} className={styles.quoteImage} />
                  )}
                  <Quote item={item} portraits={portraits} />
                </div>
              ))}
            </div>
            <Link to={more.href} className={styles.more} data-reveal>
              {more.label}
              <ArrowRightIcon size={18} className="arrow" />
            </Link>
          </div>
        </div>
      </div>

      <StudiesBand studies={studies} />
    </section>
  );
}

/**
 * Illustration décorative (le texte voisin dit tout) : fond de la couleur de sa bande, sans
 * cadre ; version de 700 px pour les petits écrans.
 */
function Illustration({ src, className }: { src: string; className?: string }) {
  return (
    <img
      className={className}
      src={src}
      srcSet={`${src.replace(/\.webp$/, '-700.webp')} 700w, ${src} 763w`}
      sizes="(min-width: 64em) 50vw, 90vw"
      alt=""
      width={763}
      height={572}
      loading="lazy"
      decoding="async"
    />
  );
}

/** « Smail Trifi » → « ST ». */
function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toLocaleUpperCase())
    .join('');
}

/** La phrase, avec son passage clé en gras (s'il s'y trouve). */
function Emphasis({ text, part }: { text: string; part: string }) {
  const at = text.indexOf(part);
  if (!part || at < 0) return text;
  return (
    <>
      {text.slice(0, at)}
      <strong>{part}</strong>
      {text.slice(at + part.length)}
    </>
  );
}

function Quote({
  item,
  featured = false,
  portraits = false,
}: {
  item: TestimonialQuote;
  featured?: boolean;
  portraits?: boolean;
}) {
  // Le logo de l'entreprise : version « portraits » seulement. La personne qui signe (nom,
  // fonction) : dans les deux versions, quand elle a accepté d'être nommée.
  const company = portraits ? item.company : undefined;
  const { person } = item;
  return (
    <figure className={featured ? styles.featured : styles.quote} data-reveal>
      {company && (
        <img
          className={styles.companyLogo}
          src={company.logo}
          alt={company.name}
          loading="lazy"
          decoding="async"
        />
      )}
      <p className={styles.quoteLabel}>{item.eyebrow}</p>
      <blockquote className={styles.quoteText}>
        <span className={styles.mark}>{'“'}</span>
        {item.quote}
        <span className={styles.mark}>{'”'}</span>
      </blockquote>
      {person ? (
        <figcaption className={styles.person}>
          {person.photo ? (
            <img
              className={styles.personPhoto}
              src={person.photo}
              alt=""
              width={112}
              height={112}
              loading="lazy"
              decoding="async"
            />
          ) : (
            portraits && (
              // Pas de photo de personne (choix d'OPEM) : ses initiales, en médaillon.
              <span className={styles.personInitials} aria-hidden="true">
                {initials(person.name)}
              </span>
            )
          )}
          <span className={styles.personText}>
            <span className={styles.personName}>{person.name}</span>
            <span className={styles.personRole}>{person.role}</span>
          </span>
        </figcaption>
      ) : (
        <figcaption className={styles.author}>{company ? company.name : item.author}</figcaption>
      )}
    </figure>
  );
}
