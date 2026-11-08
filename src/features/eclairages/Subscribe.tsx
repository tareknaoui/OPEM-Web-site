import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { submitForm } from '@/features/forms/submit';
import { isEmail } from '@/features/forms/validation';
import { useLanguage } from '@/i18n/useLanguage';
import { cx } from '@/lib/cx';
import type { EclairagesContent } from './content';
import styles from './EclairagesPage.module.css';

/**
 * Bandeau « Recevoir nos éclairages », bleu nuit : l'adresse de courriel et la case d'accord
 * (non cochée par défaut, obligatoire). L'inscription rejoint la liste de diffusion de
 * l'extension WordPress (wordpress/opem-forms-api.php, point d'accès /opem/v1/inscription),
 * avec la date de l'accord. Champ piège et délai minimal contre les robots.
 */
export function Subscribe({ content }: { content: EclairagesContent['subscribe'] }) {
  const { lang } = useLanguage();
  const id = useId();
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [trap, setTrap] = useState('');
  const [errors, setErrors] = useState<{ email?: string; consent?: string }>({});
  const [failure, setFailure] = useState(false);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const startedAt = useRef(0);
  const doneRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);
  useEffect(() => {
    if (done) doneRef.current?.focus();
  }, [done]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending) return;
    const found: typeof errors = {};
    if (!email.trim()) found.email = content.errors.required;
    else if (!isEmail(email)) found.email = content.errors.email;
    if (!consent) found.consent = content.errors.consent;
    setErrors(found);
    setFailure(false);
    if (found.email || found.consent) {
      document.getElementById(found.email ? `${id}-email` : `${id}-consent`)?.focus();
      return;
    }
    const data = new FormData();
    data.append('email', email.trim());
    data.append('consent', '1');
    data.append('website', trap);
    data.append('lang', lang);
    data.append('elapsed', String(Date.now() - startedAt.current));
    setSending(true);
    const result = await submitForm('inscription', data);
    setSending(false);
    if (result.ok) setDone(true);
    else if (result.reason === 'invalid' && result.errors.email) {
      setErrors({ email: content.errors.email });
    } else setFailure(true);
  };

  return (
    <section className={cx(styles.subscribe, 'on-dark')} aria-labelledby={`${id}-title`}>
      <div className={cx('container', styles.subscribeInner)}>
        <div className={styles.subscribeHead}>
          <p className={styles.sectionEyebrow}>{content.eyebrow}</p>
          <h2 id={`${id}-title`} className={styles.sectionTitle}>
            {content.title}
          </h2>
          <p className={styles.subscribeText}>{content.text}</p>
        </div>

        {done ? (
          <p ref={doneRef} className={styles.subscribeDone} role="status" tabIndex={-1}>
            {content.thanks}
          </p>
        ) : (
          <form className={styles.subscribeForm} onSubmit={onSubmit} noValidate>
            <label htmlFor={`${id}-email`} className={styles.subscribeLabel}>
              {content.email}
            </label>
            <div className={styles.subscribeRow}>
              <input
                id={`${id}-email`}
                type="email"
                inputMode="email"
                autoComplete="email"
                dir="ltr"
                maxLength={254}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={styles.subscribeInput}
                aria-required="true"
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={errors.email ? `${id}-email-error` : undefined}
              />
              <button type="submit" className="btn btn-light" aria-disabled={sending || undefined}>
                {sending ? content.sending : content.submit}
              </button>
            </div>
            {errors.email && (
              <p id={`${id}-email-error`} className={styles.subscribeError}>
                {errors.email}
              </p>
            )}
            <label className={styles.subscribeConsent} htmlFor={`${id}-consent`}>
              <input
                id={`${id}-consent`}
                type="checkbox"
                checked={consent}
                onChange={(event) => setConsent(event.target.checked)}
                aria-required="true"
                aria-invalid={errors.consent ? true : undefined}
                aria-describedby={errors.consent ? `${id}-consent-error` : undefined}
              />
              <span>{content.consent}</span>
            </label>
            {errors.consent && (
              <p id={`${id}-consent-error`} className={styles.subscribeError}>
                {errors.consent}
              </p>
            )}
            <div className={styles.trap} aria-hidden="true">
              <label>
                Site web
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={trap}
                  onChange={(event) => setTrap(event.target.value)}
                />
              </label>
            </div>
            {failure && (
              <p className={styles.subscribeError} role="alert">
                {content.errors.failure}
              </p>
            )}
            <p className={styles.subscribeLegal}>{content.legal}</p>
          </form>
        )}
      </div>
    </section>
  );
}
