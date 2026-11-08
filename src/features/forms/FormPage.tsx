import { useEffect, useRef, type ReactNode } from 'react';
import { env } from '@/lib/env';
import styles from './Forms.module.css';

/**
 * Cadre commun aux deux pages de formulaire : surtitre, titre et introduction ; le formulaire
 * (ou, après l'envoi, le message de confirmation, sur la même page) ; la mention légale sous le
 * formulaire ; à côté, un encart facultatif (ordinateur : à droite ; téléphone : dessous).
 */
export function FormPage({
  eyebrow,
  title,
  intro,
  legal,
  aside,
  thanks,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  legal: string;
  aside?: ReactNode;
  /** Le message de confirmation, une fois la demande envoyée. */
  thanks: string | null;
  children: ReactNode;
}) {
  const thanksRef = useRef<HTMLDivElement>(null);

  // La confirmation prend la place du formulaire : on y amène le lecteur et le clavier.
  useEffect(() => {
    if (!thanks) return;
    thanksRef.current?.focus();
    thanksRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, [thanks]);

  return (
    <div className={`container page ${styles.page}`}>
      <title>{`${title} · ${env.appName}`}</title>
      <header className={styles.head}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.intro}>{intro}</p>
      </header>

      <div className={aside ? styles.layout : styles.layoutSingle}>
        <div className={styles.main}>
          {thanks ? (
            <div ref={thanksRef} className={styles.thanks} role="status" tabIndex={-1}>
              <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
                <path
                  d="M5 12.5l4.5 4.5L19 7.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p>{thanks}</p>
            </div>
          ) : (
            children
          )}
          <p className={styles.legal}>{legal}</p>
        </div>
        {aside && <aside className={styles.aside}>{aside}</aside>}
      </div>
    </div>
  );
}
