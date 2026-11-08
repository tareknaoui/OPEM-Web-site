import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { MailIcon } from '@/components/icons';
import { useLanguage } from '@/i18n/useLanguage';
import { formsContent, type FormsContent } from './content';
import { countries, DEFAULT_COUNTRY, dialOf } from './countries';
import {
  CheckboxField,
  Honeypot,
  PhoneField,
  RadioField,
  SelectField,
  TextAreaField,
  TextField,
} from './fields';
import { focusFirstError } from './focus';
import { FormPage } from './FormPage';
import styles from './Forms.module.css';
import { submitForm } from './submit';
import { isEmail, isPhone } from './validation';

/** Votre message : 1 000 caractères au plus, compteur visible. */
const MESSAGE_MAX = 1000;

type Values = {
  name: string;
  organisation: string;
  email: string;
  country: string;
  phone: string;
  subject: string;
  subjectOther: string;
  project: string;
  message: string;
  slot1Day: string;
  slot1Hour: string;
  slot2Day: string;
  slot2Hour: string;
  consent: boolean;
  newsletter: boolean;
  website: string;
};

const EMPTY: Values = {
  name: '',
  organisation: '',
  email: '',
  country: DEFAULT_COUNTRY,
  phone: '',
  subject: '',
  subjectOther: '',
  project: '',
  message: '',
  slot1Day: '',
  slot1Hour: '',
  slot2Day: '',
  slot2Hour: '',
  consent: false,
  newsletter: false,
  website: '',
};

type Errors = Partial<Record<keyof Values, string>>;

/** Les contrôles du formulaire : un message par champ mal rempli. */
function validateAppointment(values: Values, t: FormsContent): Errors {
  const e = t.common.errors;
  const errors: Errors = {};
  if (!values.name.trim()) errors.name = e.required;
  if (!values.email.trim()) errors.email = e.required;
  else if (!isEmail(values.email)) errors.email = e.email;
  if (!values.phone.trim()) errors.phone = e.required;
  else if (!isPhone(values.phone)) errors.phone = e.phone;
  if (!values.subject) errors.subject = e.choose;
  else if (values.subject === 'autre' && !values.subjectOther.trim()) errors.subjectOther = e.other;
  if (!values.message.trim()) errors.message = e.required;
  for (const n of [1, 2] as const) {
    const day = values[`slot${n}Day`];
    const hour = values[`slot${n}Hour`];
    if (day && !hour) errors[`slot${n}Hour`] = e.slotHour;
    if (hour && !day) errors[`slot${n}Day`] = e.slotDay;
  }
  if (!values.consent) errors.consent = t.appointment.consentError;
  return errors;
}

/** Les codes d'erreur renvoyés par le serveur, traduits. */
function serverMessage(field: string, code: string, t: FormsContent): string {
  const e = t.common.errors;
  if (field === 'consent') return t.appointment.consentError;
  if (code === 'email') return e.email;
  if (code === 'phone') return e.phone;
  if (code === 'slot_hour') return e.slotHour;
  if (code === 'slot_day') return e.slotDay;
  if (field === 'subject' || field === 'project') return e.choose;
  if (field === 'subjectOther') return e.other;
  return e.required;
}

/**
 * Page « Demande de rendez-vous », ouverte par « Parlons de votre projet » (menu principal,
 * bloc 09 de la page « Le cabinet »). Huit champs, dont cinq obligatoires, et deux cases à
 * cocher. Chaque demande part sur contact@opem-dz.com, les créneaux choisis en tête du message
 * (serveur : wordpress/opem-forms-api.php). La confirmation s'affiche sur la même page.
 */
export default function AppointmentPage() {
  const { lang } = useLanguage();
  const t = formsContent[lang];
  const a = t.appointment;
  const dialCodes = useMemo(() => countries(lang), [lang]);

  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [tried, setTried] = useState(false);
  const [sending, setSending] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);
  const [thanks, setThanks] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  // Moment où la page s'affiche : un envoi en moins de 3 s trahit un robot (contrôle serveur).
  const startedAt = useRef(0);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const update = <K extends keyof Values>(key: K, value: Values[K]) => {
    const next = { ...values, [key]: value };
    setValues(next);
    // Après une première tentative, les messages suivent la saisie.
    if (tried) setErrors(validateAppointment(next, t));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending) return;
    const found = validateAppointment(values, t);
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
    data.append('phoneCode', dialOf(country));
    data.append('country', country);
    data.append('consent', consent ? '1' : '');
    data.append('newsletter', newsletter ? '1' : '');
    data.append('lang', lang);
    data.append('elapsed', String(Date.now() - startedAt.current));

    setSending(true);
    const result = await submitForm('rendez-vous', data);
    setSending(false);
    if (result.ok) {
      const slot = Boolean(values.slot1Day || values.slot2Day);
      setThanks(slot ? a.thanksSlot : a.thanksNoSlot);
    } else if (result.reason === 'invalid' && Object.keys(result.errors).length > 0) {
      const mapped = Object.fromEntries(
        Object.entries(result.errors).map(([field, code]) => [
          field,
          serverMessage(field, code, t),
        ]),
      );
      setErrors(mapped);
      focusFirstError(formRef.current, Object.keys(mapped));
    } else {
      setFailure(a.failure[result.reason === 'invalid' ? 'unavailable' : result.reason]);
    }
  };

  const [before, email, after] = a.aside;
  const aside = (
    <>
      <span className={styles.asideIcon} aria-hidden="true">
        <MailIcon size={22} />
      </span>
      <p>
        {before}
        <a href={`mailto:${email}`} dir="ltr">
          {email}
        </a>
        {after}
      </p>
    </>
  );

  return (
    <FormPage
      eyebrow={t.common.eyebrow}
      title={a.title}
      intro={a.intro}
      legal={t.common.legal}
      aside={aside}
      thanks={thanks}
    >
      <form ref={formRef} className={styles.form} onSubmit={onSubmit} noValidate>
        <div className={styles.pair}>
          <TextField
            name="name"
            label={a.name}
            required
            value={values.name}
            onChange={(v) => update('name', v)}
            autoComplete="name"
            error={errors.name}
          />
          <TextField
            name="organisation"
            label={a.organisation}
            help={a.organisationHelp}
            value={values.organisation}
            onChange={(v) => update('organisation', v)}
            autoComplete="organization"
            error={errors.organisation}
          />
        </div>
        <div className={styles.pair}>
          <TextField
            name="email"
            type="email"
            inputMode="email"
            label={a.email}
            required
            value={values.email}
            onChange={(v) => update('email', v)}
            autoComplete="email"
            maxLength={254}
            error={errors.email}
          />
          <PhoneField
            name="phone"
            label={a.phone}
            required
            value={values.phone}
            onChange={(v) => update('phone', v)}
            country={values.country}
            onCountry={(v) => update('country', v)}
            countries={dialCodes}
            countryLabel={t.common.countryLabel}
            error={errors.phone}
          />
        </div>

        <SelectField
          name="subject"
          label={a.subject}
          required
          value={values.subject}
          onChange={(v) => update('subject', v)}
          options={a.subjects}
          placeholder={t.common.placeholder}
          error={errors.subject}
        />
        {values.subject === 'autre' && (
          <TextField
            name="subjectOther"
            label={a.subjectOther}
            required
            value={values.subjectOther}
            onChange={(v) => update('subjectOther', v)}
            maxLength={200}
            error={errors.subjectOther}
          />
        )}

        <RadioField
          name="project"
          label={a.project}
          value={values.project}
          onChange={(v) => update('project', v)}
          options={a.projects}
          clearLabel={t.common.clear}
          error={errors.project}
        />

        <TextAreaField
          name="message"
          label={a.message}
          required
          help={a.messageHelp}
          value={values.message}
          onChange={(v) => update('message', v)}
          maxLength={MESSAGE_MAX}
          counter={t.common.counter}
          error={errors.message}
        />

        <fieldset className={styles.fieldset}>
          <legend className={styles.label}>{a.slots}</legend>
          <div className={styles.slots}>
            {([1, 2] as const).map((n) => (
              <fieldset key={n} className={styles.slot}>
                <legend>{a.option(n)}</legend>
                <SelectField
                  name={`slot${n}Day`}
                  label={a.day}
                  value={values[`slot${n}Day`]}
                  onChange={(v) => update(`slot${n}Day`, v)}
                  options={a.days}
                  placeholder={t.common.placeholder}
                  error={errors[`slot${n}Day`]}
                  compact
                />
                <SelectField
                  name={`slot${n}Hour`}
                  label={a.hour}
                  value={values[`slot${n}Hour`]}
                  onChange={(v) => update(`slot${n}Hour`, v)}
                  options={a.hours}
                  placeholder={t.common.placeholder}
                  error={errors[`slot${n}Hour`]}
                  compact
                />
              </fieldset>
            ))}
          </div>
        </fieldset>

        <div className={styles.consents}>
          <CheckboxField
            name="consent"
            title={a.consentTitle}
            label={a.consent}
            required
            checked={values.consent}
            onChange={(v) => update('consent', v)}
            error={errors.consent}
          />
          <CheckboxField
            name="newsletter"
            title={a.newsletterTitle}
            label={a.newsletter}
            checked={values.newsletter}
            onChange={(v) => update('newsletter', v)}
          />
        </div>

        <Honeypot value={values.website} onChange={(v) => update('website', v)} />

        {failure && (
          <p className={styles.failure} role="alert">
            {failure}
          </p>
        )}
        <button
          type="submit"
          className={`btn btn-primary ${styles.submit}`}
          aria-disabled={sending || undefined}
        >
          {sending ? t.common.sending : a.submit}
        </button>
      </form>
    </FormPage>
  );
}
