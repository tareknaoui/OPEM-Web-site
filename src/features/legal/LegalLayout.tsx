import { Fragment, type MouseEvent, type ReactNode } from 'react';
import { Link } from 'react-router';
import { scrollToElement } from '@/hooks/useSmoothScroll';
import { useLanguage } from '@/i18n/useLanguage';
import { cx } from '@/lib/cx';
import { legalShared, type Block, type LegalPageContent, type Rich } from './content';
import styles from './Legal.module.css';

/** En-tête bleu nuit commun aux pages légales (comme « IA appliquée » et « Le cabinet »). */
export function LegalHero(props: {
  eyebrow: string;
  heading: string;
  intro: string;
  updated?: string;
}) {
  return (
    <section className={cx(styles.hero, 'on-dark')} aria-labelledby="legal-title">
      <div className={cx('container', styles.heroInner)}>
        <p className={styles.kicker}>{props.eyebrow}</p>
        <h1 id="legal-title" className={styles.headline}>
          {props.heading}
        </h1>
        <p className={styles.intro}>{props.intro}</p>
        {props.updated && <p className={styles.updated}>{props.updated}</p>}
      </div>
    </section>
  );
}

/** Texte, liens (internes, courriel, téléphone, externes) et valeurs encore à compléter. */
export function RichText({ text }: { text: Rich }) {
  const { lang } = useLanguage();
  if (typeof text === 'string') return text;
  return text.map((segment, index) => {
    if (typeof segment === 'string') return <Fragment key={index}>{segment}</Fragment>;
    if ('pending' in segment) {
      return (
        <span key={index} className={styles.pending}>
          {legalShared[lang].pending}
        </span>
      );
    }
    if (segment.link.startsWith('/')) {
      return (
        <Link key={index} to={segment.link}>
          {segment.label}
        </Link>
      );
    }
    const external = segment.link.startsWith('http');
    return (
      <a
        key={index}
        href={segment.link}
        dir={
          segment.link.startsWith('mailto:') || segment.link.startsWith('tel:') ? 'ltr' : undefined
        }
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {segment.label}
      </a>
    );
  });
}

function Facts({ rows }: { rows: { label: string; value: Rich }[] }) {
  return (
    <dl className={styles.facts}>
      {rows.map((row) => (
        <div key={row.label} className={styles.fact}>
          <dt>{row.label}</dt>
          <dd>
            <RichText text={row.value} />
          </dd>
        </div>
      ))}
    </dl>
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.kind) {
    case 'p':
      return (
        <p className={styles.paragraph}>
          <RichText text={block.text} />
        </p>
      );
    case 'list':
      return (
        <ul className={styles.list}>
          {block.items.map((item, index) => (
            <li key={index}>
              <RichText text={item} />
            </li>
          ))}
        </ul>
      );
    case 'facts':
      return <Facts rows={block.rows} />;
    case 'cards':
      return (
        <div className={styles.cards}>
          {block.cards.map((card) => (
            <article key={card.title} className={styles.card}>
              <h3 className={styles.cardTitle}>{card.title}</h3>
              <Facts rows={card.rows} />
            </article>
          ))}
        </div>
      );
  }
}

/**
 * Page légale complète : en-tête, puis sommaire (collant sur grand écran) et sections
 * numérotées. Le sommaire descend en douceur jusqu'à la section, sous la barre de menu.
 */
export function LegalDocument({ content }: { content: LegalPageContent }) {
  const { lang } = useLanguage();

  const jump = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    scrollToElement(target);
    history.replaceState(history.state, '', `#${id}`);
  };

  return (
    <>
      <title>{content.title}</title>
      <LegalHero
        eyebrow={content.eyebrow}
        heading={content.heading}
        intro={content.intro}
        updated={content.updated}
      />
      <div className={cx('container', styles.body)}>
        <nav className={styles.toc} aria-labelledby="legal-toc">
          <p id="legal-toc" className={styles.tocTitle}>
            {legalShared[lang].toc}
          </p>
          <ol className={styles.tocList}>
            {content.sections.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`} onClick={(event) => jump(event, section.id)}>
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className={styles.sections}>
          {content.sections.map((section, index) => (
            <section
              key={section.id}
              id={section.id}
              className={styles.section}
              aria-labelledby={`${section.id}-title`}
            >
              <h2 id={`${section.id}-title`} className={styles.sectionTitle}>
                <span className={styles.number} aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {section.title}
              </h2>
              {section.blocks.map((block, blockIndex) => (
                <BlockView key={blockIndex} block={block} />
              ))}
            </section>
          ))}
        </div>
      </div>
    </>
  );
}

/** Conteneur du corps de page, pour les pages légales sans sommaire (plan du site). */
export function LegalBody({ children }: { children: ReactNode }) {
  return <div className={cx('container', styles.plainBody)}>{children}</div>;
}
