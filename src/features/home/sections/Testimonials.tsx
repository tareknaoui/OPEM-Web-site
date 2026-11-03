import { Link } from 'react-router';
import { ArrowRightIcon } from '@/components/icons';
import type { HomeContent, TestimonialQuote } from '../content';
import styles from './Testimonials.module.css';

type TestimonialsProps = {
  testimonials: HomeContent['testimonials'];
};

/**
 * Témoignages, maquette validée par OPEM, en trois bandes : sur blanc, le titre et une étude de
 * cas racontée en une phrase, puis en trois temps tous visibles, reliés par des flèches qui
 * disent le temps écoulé (« Deux ans plus tard ») ; sur bleu très clair, les recommandations ;
 * sur bleu nuit, les institutions qui confient leurs études au cabinet. Recommandations anonymes, sans photo de personne.
 */
export function Testimonials({ testimonials }: TestimonialsProps) {
  const { caseStudy, featured, quotes, studies } = testimonials;

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
              <div className={styles.caseHead} data-reveal>
                <div className={styles.caseHeading}>
                  <p className={styles.eyebrow}>{caseStudy.eyebrow}</p>
                  <h3 className={styles.caseTitle}>{caseStudy.title}</h3>
                  <p className={styles.caseSummary}>{caseStudy.summary}</p>
                </div>
                <Link to={caseStudy.link.href} className={`btn btn-primary ${styles.cta}`}>
                  {caseStudy.link.label}
                  <ArrowRightIcon size={18} className="arrow" />
                </Link>
              </div>

              <ol className={styles.steps} data-reveal-stagger>
                {caseStudy.steps.map((step, index) => {
                  const next = caseStudy.steps[index + 1];
                  return (
                    <li key={step.id} className={styles.step} data-tone={step.tone}>
                      <p className={styles.stepYear}>
                        {step.since && <span className="sr-only">{step.since}, </span>}
                        <time dateTime={step.year}>{step.year}</time>
                      </p>
                      {/* Flèche vers l'étape suivante, avec le temps écoulé (lu dans l'étape suivante). */}
                      {next?.since && (
                        <p className={styles.since} aria-hidden="true">
                          <span className={styles.sinceText}>{next.since}</span>
                          <ArrowRightIcon size={16} className={styles.sinceArrow} />
                        </p>
                      )}
                      <p className={styles.stepLabel}>{step.label}</p>
                      <p className={styles.stepHeadline}>{step.headline}</p>
                      <p className={styles.stepText}>{step.text}</p>
                    </li>
                  );
                })}
              </ol>
            </article>
          </div>
        </div>
      </div>

      <div className={styles.quotesBand}>
        <div className="container">
          <div className={styles.wrap}>
            <Quote item={featured} featured />
            <div className={styles.quotes}>
              {quotes.map((item) => (
                <Quote key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.studiesBand}>
        <div className="container">
          <div className={styles.studies}>
            <div className={styles.studiesIntro} data-reveal>
              <p className={styles.studiesEyebrow}>{studies.eyebrow}</p>
              <h3 className={styles.studiesTitle}>{studies.title}</h3>
              <p className={styles.studiesText}>{studies.text}</p>
              <Link to={studies.cta.href} className={`btn ${styles.studiesCta}`}>
                {studies.cta.label}
                <ArrowRightIcon size={18} className="arrow" />
              </Link>
            </div>

            <ul className={styles.partners} data-reveal>
              <li className={`${styles.partner} ${styles.ministries}`}>
                <p className={styles.ministriesTitle}>{studies.ministries.title}</p>
                <ul className={styles.ministryList}>
                  {studies.ministries.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </li>
              {studies.partners.map((partner) => (
                <li key={partner.title} className={styles.partner}>
                  <p className={styles.partnerTitle}>{partner.title}</p>
                  <p className={styles.partnerText}>{partner.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function Quote({ item, featured = false }: { item: TestimonialQuote; featured?: boolean }) {
  return (
    <figure className={featured ? styles.featured : styles.quote} data-reveal>
      <p className={styles.quoteLabel}>{item.eyebrow}</p>
      <blockquote className={styles.quoteText}>
        <span className={styles.mark}>{'« '}</span>
        {item.quote}
        <span className={styles.mark}>{' »'}</span>
      </blockquote>
      <div className={styles.quoteFoot}>
        <figcaption className={styles.author}>{item.author}</figcaption>
        <Link to={item.link.href} className={styles.quoteLink}>
          {item.link.label}
          <ArrowRightIcon size={16} className="arrow" />
        </Link>
      </div>
    </figure>
  );
}
