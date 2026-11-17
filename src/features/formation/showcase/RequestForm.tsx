import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { formsContent } from '@/features/forms/content';
import { countries, DEFAULT_COUNTRY, dialOf } from '@/features/forms/countries';
import {
  CheckboxField,
  ErrorText,
  Honeypot,
  PhoneField,
  Star,
  TextField,
} from '@/features/forms/fields';
import { focusFirstError } from '@/features/forms/focus';
import formStyles from '@/features/forms/Forms.module.css';
import { submitForm } from '@/features/forms/submit';
import { isEmail, isPhone } from '@/features/forms/validation';
import { useLanguage } from '@/i18n/useLanguage';
import { cx } from '@/lib/cx';
import { showcaseLabels, type TrainingShowcase } from './content';
import styles from './TrainingShowcasePage.module.css';

/** Ce que la personne souhaite recevoir (au moins un choix). */
export type Wants = { sheet: boolean; quote: boolean };

type Values = {
  name: string;
  role: string;
  participants: string;
  organisation: string;
  email: string;
  country: string;
  phone: string;
  consent: boolean;
  newsletter: boolean;
  website: string;
};

const EMPTY: Values = {
  name: '',
  role: '',
  participants: '',
  organisation: '',
  email: '',
  country: DEFAULT_COUNTRY,
  phone: '',
  consent: false,
  newsletter: false,
  website: '',
};

type Field = keyof Values | 'wants';
type Errors = Partial<Record<Field, string>>;

/** Un nombre de participants : un entier de 1 à 999. */
const isCount = (value: string) => /^\d{1,3}$/.test(value.trim()) && Number(value) > 0;

/**
 * Le formulaire de demande d'une page formation : 01 Je souhaite recevoir (la fiche technique
 * détaillée, un devis : au moins un), 02 à 07 les coordonnées, toutes obligatoires, 08 le
 * consentement (obligatoire), 09 Rester informé (facultatif). La demande part sur
 * formations@opem-dz.com (wordpress/opem-forms-api.php, « demande-formation ») ; la fiche n'est
 * jamais envoyée automatiquement. La confirmation remplace le formulaire.
 */
export function RequestForm({
  item,
  dates,
  wants,
  onWants,
}: {
  item: TrainingShowcase;
  dates: string | null;
  wants: Wants;
  onWants: (wants: Wants) => void;
}) {
  const { lang } = useLanguage();
  const t = showcaseLabels[lang].request;
  const common = formsContent[lang].common;
  const dialCodes = useMemo(() => countries(lang), [lang]);

  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [tried, setTried] = useState(false);
  const [sending, setSending] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const thanksRef = useRef<HTMLParagraphElement>(null);
  // Moment où la page s'affiche : un envoi en moins de 3 s trahit un robot (contrôle serveur).
  const startedAt = useRef(0);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);
  useEffect(() => {
    if (sent) thanksRef.current?.focus();
  }, [sent]);

  const validate = (next: Values, nextWants: Wants): Errors => {
    const e = common.errors;
    const found: Errors = {};
    if (!nextWants.sheet && !nextWants.quote) found.wants = e.checkOne;
    if (!next.name.trim()) found.name = e.required;
    if (!next.role.trim()) found.role = e.required;
    if (!next.participants.trim()) found.participants = e.required;
    else if (!isCount(next.participants)) found.participants = t.participantsError;
    if (!next.organisation.trim()) found.organisation = e.required;
    if (!next.email.trim()) found.email = e.required;
    else if (!isEmail(next.email)) found.email = e.email;
    if (!next.phone.trim()) found.phone = e.required;
    else if (!isPhone(next.phone)) found.phone = e.phone;
    if (!next.consent) found.consent = t.consentError;
    return found;
  };

  const update = <K extends keyof Values>(key: K, value: Values[K]) => {
    const next = { ...values, [key]: value };
    setValues(next);
    // Après une première tentative, les messages suivent la saisie.
    if (tried) setErrors(validate(next, wants));
  };

  const toggle = (want: keyof Wants, checked: boolean) => {
    const next = { ...wants, [want]: checked };
    onWants(next);
    if (tried) setErrors(validate(values, next));
  };

  const serverMessage = (field: string, code: string) => {
    const e = common.errors;
    if (field === 'consent') return t.consentError;
    if (field === 'wants') return e.checkOne;
    if (field === 'participants' && code !== 'required') return t.participantsError;
    if (code === 'email') return e.email;
    if (code === 'phone') return e.phone;
    return e.required;
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending) return;
    const found = validate(values, wants);
    setTried(true);
    setErrors(found);
    setFailure(null);
    if (Object.keys(found).length > 0) {
      focusFirstError(formRef.current, Object.keys(found));
      return;
    }

    const data = new FormData();
    const { country, consent, newsletter, ...fields } = values;
    for (const [key, value] of Object.entries(fields)) data.append(key, value.trim());
    data.append('wantSheet', wants.sheet ? '1' : '');
    data.append('wantQuote', wants.quote ? '1' : '');
    data.append('formation', item.id);
    data.append('title', item.title);
    data.append('reference', item.reference);
    data.append('dates', dates ?? '');
    data.append('phoneCode', dialOf(country));
    data.append('country', country);
    data.append('consent', consent ? '1' : '');
    data.append('newsletter', newsletter ? '1' : '');
    data.append('lang', lang);
    data.append('elapsed', String(Date.now() - startedAt.current));

    setSending(true);
    const result = await submitForm('demande-formation', data);
    setSending(false);
    if (result.ok) {
      setSent(true);
    } else if (result.reason === 'invalid' && Object.keys(result.errors).length > 0) {
      const mapped = Object.fromEntries(
        Object.entries(result.errors).map(([field, code]) => [field, serverMessage(field, code)]),
      );
      setErrors(mapped);
      focusFirstError(formRef.current, Object.keys(mapped));
    } else {
      setFailure(t.failure[result.reason === 'invalid' ? 'unavailable' : result.reason]);
    }
  };

  if (sent) {
    return (
      <div className={styles.formCard}>
        <p ref={thanksRef} className={styles.thanks} role="status" tabIndex={-1}>
          {t.thanks}
        </p>
      </div>
    );
  }

  return (
    <div className={styles.formCard}>
      <form ref={formRef} className={formStyles.form} onSubmit={onSubmit} noValidate>
        <p className={styles.requiredNote}>{t.requiredNote}</p>

        {/* 01 Je souhaite recevoir : au moins un choix. */}
        <fieldset
          className={formStyles.fieldset}
          aria-required="true"
          aria-invalid={errors.wants ? true : undefined}
          aria-describedby={errors.wants ? 'wants-error' : undefined}
        >
          <legend className={formStyles.label}>
            {t.want}
            <Star />
          </legend>
          <div className={cx(formStyles.choices, styles.wants)}>
            {(
              [
                ['sheet', t.wantSheet],
                ['quote', t.wantQuote],
              ] as const
            ).map(([want, label], index) => (
              <label key={want} className={formStyles.choice}>
                <input
                  type="checkbox"
                  name={want === 'sheet' ? 'wantSheet' : 'wantQuote'}
                  checked={wants[want]}
                  onChange={(event) => toggle(want, event.target.checked)}
                  className={formStyles.checkbox}
                  data-field={index === 0 ? 'wants' : undefined}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
          {errors.wants && <ErrorText id="wants-error">{errors.wants}</ErrorText>}
        </fieldset>

        <div className={formStyles.pair}>
          <TextField
            name="name"
            label={t.name}
            required
            value={values.name}
            onChange={(v) => update('name', v)}
            autoComplete="name"
            error={errors.name}
          />
          <TextField
            name="role"
            label={t.role}
            required
            value={values.role}
            onChange={(v) => update('role', v)}
            autoComplete="organization-title"
            error={errors.role}
          />
        </div>
        <div className={formStyles.pair}>
          <TextField
            name="participants"
            label={t.participants}
            required
            value={values.participants}
            onChange={(v) => update('participants', v)}
            inputMode="numeric"
            maxLength={3}
            error={errors.participants}
          />
          <TextField
            name="organisation"
            label={t.organisation}
            required
            help={t.organisationHelp}
            value={values.organisation}
            onChange={(v) => update('organisation', v)}
            autoComplete="organization"
            error={errors.organisation}
          />
        </div>
        <div className={formStyles.pair}>
          <TextField
            name="email"
            type="email"
            inputMode="email"
            label={t.email}
            required
            value={values.email}
            onChange={(v) => update('email', v)}
            autoComplete="email"
            maxLength={254}
            error={errors.email}
          />
          <PhoneField
            name="phone"
            label={t.phone}
            required
            value={values.phone}
            onChange={(v) => update('phone', v)}
            country={values.country}
            onCountry={(v) => update('country', v)}
            countries={dialCodes}
            countryLabel={common.countryLabel}
            error={errors.phone}
          />
        </div>

        <div className={formStyles.consents}>
          <CheckboxField
            name="consent"
            title={t.consentTitle}
            label={t.consent}
            required
            checked={values.consent}
            onChange={(v) => update('consent', v)}
            error={errors.consent}
          />
          <CheckboxField
            name="newsletter"
            title={t.newsletterTitle}
            label={t.newsletter}
            checked={values.newsletter}
            onChange={(v) => update('newsletter', v)}
          />
        </div>

        <Honeypot value={values.website} onChange={(v) => update('website', v)} />

        {failure && (
          <p className={formStyles.failure} role="alert">
            {failure}
          </p>
        )}
        <button
          type="submit"
          className={cx('btn btn-primary', formStyles.submit)}
          aria-disabled={sending || undefined}
        >
          {sending ? common.sending : t.submit}
        </button>
        <p className={styles.legal}>
          {t.legal[0]}
          <a href={`mailto:${t.legal[1]}`} dir="ltr">
            {t.legal[1]}
          </a>
          {t.legal[2]}
        </p>
      </form>
    </div>
  );
}
