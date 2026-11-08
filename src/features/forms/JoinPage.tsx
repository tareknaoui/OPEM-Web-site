import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { useLanguage } from '@/i18n/useLanguage';
import { formsContent, type FormsContent } from './content';
import { countries, DEFAULT_COUNTRY, dialOf } from './countries';
import {
  CheckboxField,
  ErrorText,
  Honeypot,
  PhoneField,
  RadioField,
  Star,
  TextField,
} from './fields';
import { FileField } from './FileField';
import { focusFirstError } from './focus';
import { FormPage } from './FormPage';
import styles from './Forms.module.css';
import referentiel from './referentiel.json';
import { submitForm } from './submit';
import {
  acceptOf,
  checkFile,
  CV_RULE,
  DOCUMENT_RULE,
  isEmail,
  isPhone,
  MAX_DOCUMENTS,
} from './validation';

/** « Autre domaine » (champ 05) : il ouvre un champ libre et n'a pas de spécialités listées. */
const OTHER_DOMAIN = 'AUTRE';
/** La case « Autre à préciser » d'un domaine, dans la liste des spécialités. */
const otherKey = (domain: string) => `${domain}-AUTRE`;

type Values = {
  name: string;
  email: string;
  country: string;
  phone: string;
  role: string;
  domains: string[];
  domainOther: string;
  /** Identifiants SPE cochés, et les cases « Autre à préciser » (D01-AUTRE…). */
  specialities: string[];
  /** Le texte de chaque « Autre à préciser », par domaine (et pour « Autre domaine »). */
  specialityOther: Record<string, string>;
  consent: boolean;
  presentation: boolean;
  website: string;
};

const EMPTY: Values = {
  name: '',
  email: '',
  country: DEFAULT_COUNTRY,
  phone: '',
  role: '',
  domains: [],
  domainOther: '',
  specialities: [],
  specialityOther: {},
  consent: false,
  presentation: false,
  website: '',
};

type Errors = Record<string, string>;

const DOMAINS = referentiel.domains;

/** Les spécialités retenues : seulement celles des domaines encore cochés. */
function visibleChoices(values: Values) {
  const domains = DOMAINS.filter((domain) => values.domains.includes(domain.id));
  const specialities = domains.flatMap((domain) =>
    domain.specialities.filter((s) => values.specialities.includes(s.id)).map((s) => s.id),
  );
  const others = domains
    .filter((domain) => values.specialities.includes(otherKey(domain.id)))
    .map((domain) => domain.id);
  if (values.domains.includes(OTHER_DOMAIN)) others.push(OTHER_DOMAIN);
  return { specialities, others };
}

function validateJoin(
  values: Values,
  files: { cv: File | null; documents: File[] },
  t: FormsContent,
): Errors {
  const e = t.common.errors;
  const j = t.join;
  const errors: Errors = {};
  if (!values.name.trim()) errors.name = e.required;
  if (!values.email.trim()) errors.email = e.required;
  else if (!isEmail(values.email)) errors.email = e.email;
  if (!values.phone.trim()) errors.phone = e.required;
  else if (!isPhone(values.phone)) errors.phone = e.phone;
  if (!values.role) errors.role = e.choose;
  if (values.domains.length === 0) errors.domains = e.checkOne;
  else {
    if (values.domains.includes(OTHER_DOMAIN) && !values.domainOther.trim()) {
      errors.domainOther = e.other;
    }
    const { specialities, others } = visibleChoices(values);
    if (specialities.length === 0 && others.length === 0) errors.specialities = e.checkOne;
    for (const domain of others) {
      if (!values.specialityOther[domain]?.trim()) errors[`specialityOther-${domain}`] = e.other;
    }
  }
  if (!files.cv) errors.cv = j.fileErrors.cvRequired;
  else {
    const problem = checkFile(files.cv, CV_RULE);
    if (problem) errors.cv = problem === 'format' ? j.fileErrors.cvFormat : j.fileErrors.size;
  }
  if (files.documents.length > MAX_DOCUMENTS) errors.documents = j.fileErrors.tooMany;
  if (!values.consent) errors.consent = j.consentError;
  if (!values.presentation) errors.presentation = j.consentError;
  return errors;
}

function serverMessage(field: string, code: string, t: FormsContent): string {
  const e = t.common.errors;
  const f = t.join.fileErrors;
  if (field === 'consent' || field === 'presentation') return t.join.consentError;
  if (field === 'cv' || field === 'documents') {
    if (code === 'format') return field === 'cv' ? f.cvFormat : f.format;
    if (code === 'size') return f.size;
    if (code === 'count') return f.tooMany;
    return field === 'cv' ? f.cvRequired : f.format;
  }
  if (code === 'email') return e.email;
  if (code === 'phone') return e.phone;
  if (field === 'role') return e.choose;
  if (field === 'domains' || field === 'specialities') return e.checkOne;
  if (field.startsWith('specialityOther') || field === 'domainOther') return e.other;
  return e.required;
}

/**
 * Page « Rejoindre notre réseau d'experts », ouverte par « Rejoindre notre réseau » (bloc 09 de
 * la page « Le cabinet », menu Contact, pied de page). Sept champs et trois cases à cocher. À
 * chaque domaine coché, ses spécialités apparaissent (référentiel OPEM, ./referentiel.json) ;
 * le serveur enregistre l'identifiant SPE de chaque spécialité cochée. La candidature part sur
 * expert@opem-dz.com, CV et documents joints (serveur : wordpress/opem-forms-api.php).
 */
export default function JoinPage() {
  const { lang } = useLanguage();
  const t = formsContent[lang];
  const j = t.join;
  const dialCodes = useMemo(() => countries(lang), [lang]);

  const [values, setValues] = useState<Values>(EMPTY);
  const [cv, setCv] = useState<File | null>(null);
  const [documents, setDocuments] = useState<File[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  /** Refus d'un fichier au moment du choix (format, taille, nombre). */
  const [fileErrors, setFileErrors] = useState<{ cv?: string; documents?: string }>({});
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

  const revalidate = (next: Values, nextCv = cv, nextDocs = documents) => {
    if (tried) setErrors(validateJoin(next, { cv: nextCv, documents: nextDocs }, t));
  };
  const update = <K extends keyof Values>(key: K, value: Values[K]) => {
    const next = { ...values, [key]: value };
    setValues(next);
    revalidate(next);
  };
  const toggle = (key: 'domains' | 'specialities', id: string, on: boolean) =>
    update(key, on ? [...values[key], id] : values[key].filter((item) => item !== id));
  const setOther = (domain: string, text: string) =>
    update('specialityOther', { ...values.specialityOther, [domain]: text });

  const addCv = ([file]: File[]) => {
    if (!file) return;
    const problem = checkFile(file, CV_RULE);
    if (problem) {
      setFileErrors((current) => ({
        ...current,
        cv: problem === 'format' ? j.fileErrors.cvFormat : j.fileErrors.size,
      }));
      return;
    }
    setFileErrors((current) => ({ ...current, cv: undefined }));
    setCv(file);
    revalidate(values, file);
  };
  const addDocuments = (chosen: File[]) => {
    const accepted: File[] = [];
    let problem: string | undefined;
    for (const file of chosen) {
      const reason = checkFile(file, DOCUMENT_RULE);
      if (reason) problem = reason === 'format' ? j.fileErrors.format : j.fileErrors.size;
      else accepted.push(file);
    }
    const room = MAX_DOCUMENTS - documents.length;
    if (accepted.length > room) problem = j.fileErrors.tooMany;
    const next = [...documents, ...accepted.slice(0, Math.max(room, 0))];
    setDocuments(next);
    setFileErrors((current) => ({ ...current, documents: problem }));
    revalidate(values, cv, next);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending) return;
    const found = validateJoin(values, { cv, documents }, t);
    setTried(true);
    setErrors(found);
    setFailure(null);
    if (Object.keys(found).length > 0) {
      focusFirstError(formRef.current, Object.keys(found));
      return;
    }

    const { specialities, others } = visibleChoices(values);
    const data = new FormData();
    data.append('name', values.name.trim());
    data.append('email', values.email.trim());
    data.append('phoneCode', dialOf(values.country));
    data.append('country', values.country);
    data.append('phone', values.phone.trim());
    data.append('role', values.role);
    values.domains.forEach((domain) => data.append('domains[]', domain));
    if (values.domains.includes(OTHER_DOMAIN))
      data.append('domainOther', values.domainOther.trim());
    specialities.forEach((id) => data.append('specialities[]', id));
    others.forEach((domain) =>
      data.append(`specialityOther[${domain}]`, values.specialityOther[domain]?.trim() ?? ''),
    );
    if (cv) data.append('cv', cv);
    documents.forEach((file) => data.append('documents[]', file));
    data.append('consent', values.consent ? '1' : '');
    data.append('presentation', values.presentation ? '1' : '');
    data.append('website', values.website);
    data.append('lang', lang);
    data.append('elapsed', String(Date.now() - startedAt.current));

    setSending(true);
    const result = await submitForm('candidature', data);
    setSending(false);
    if (result.ok) setThanks(j.thanks);
    else if (result.reason === 'invalid' && Object.keys(result.errors).length > 0) {
      const mapped = Object.fromEntries(
        Object.entries(result.errors).map(([field, code]) => [
          field,
          serverMessage(field, code, t),
        ]),
      );
      setErrors(mapped);
      focusFirstError(formRef.current, Object.keys(mapped));
    } else {
      setFailure(j.failure[result.reason === 'invalid' ? 'unavailable' : result.reason]);
    }
  };

  const fileLabels = {
    choose: j.chooseFile,
    add: j.addFiles,
    replace: j.replaceFile,
    remove: j.removeFile,
    none: j.noFile,
  };
  const checkedDomains = DOMAINS.filter((domain) => values.domains.includes(domain.id));
  const otherDomainName = values.domainOther.trim() || j.otherDomain;

  return (
    <FormPage
      eyebrow={t.common.eyebrow}
      title={j.title}
      intro={j.intro}
      legal={t.common.legal}
      thanks={thanks}
    >
      <form ref={formRef} className={styles.form} onSubmit={onSubmit} noValidate>
        <TextField
          name="name"
          label={j.name}
          required
          value={values.name}
          onChange={(v) => update('name', v)}
          autoComplete="name"
          error={errors.name}
        />
        <div className={styles.pair}>
          <TextField
            name="email"
            type="email"
            inputMode="email"
            label={j.email}
            required
            value={values.email}
            onChange={(v) => update('email', v)}
            autoComplete="email"
            maxLength={254}
            error={errors.email}
          />
          <PhoneField
            name="phone"
            label={j.phone}
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

        <RadioField
          name="role"
          label={j.role}
          required
          value={values.role}
          onChange={(v) => update('role', v)}
          options={j.roles}
          error={errors.role}
        />

        {/* 05 Domaines d'expertise : choix multiple, puis « Autre domaine » et son champ libre. */}
        <fieldset
          className={styles.fieldset}
          aria-required="true"
          aria-invalid={errors.domains ? true : undefined}
          aria-describedby={errors.domains ? 'domains-error' : undefined}
        >
          <legend className={styles.label}>
            {j.domains}
            <Star />
          </legend>
          <div className={`${styles.choices} ${styles.grid2}`}>
            {[...DOMAINS, { id: OTHER_DOMAIN, fr: j.otherDomain, ar: j.otherDomain }].map(
              (domain, index) => (
                <label key={domain.id} className={styles.choice}>
                  <input
                    type="checkbox"
                    name="domains[]"
                    value={domain.id}
                    checked={values.domains.includes(domain.id)}
                    onChange={(event) => toggle('domains', domain.id, event.target.checked)}
                    className={styles.checkbox}
                    data-field={index === 0 ? 'domains' : undefined}
                  />
                  <span>{domain[lang]}</span>
                </label>
              ),
            )}
          </div>
          {errors.domains && <ErrorText id="domains-error">{errors.domains}</ErrorText>}
        </fieldset>
        {values.domains.includes(OTHER_DOMAIN) && (
          <TextField
            name="domainOther"
            label={j.otherDomainField}
            required
            value={values.domainOther}
            onChange={(v) => update('domainOther', v)}
            maxLength={200}
            error={errors.domainOther}
          />
        )}

        {/* 06 Vos spécialités : celles des domaines cochés, regroupées par domaine. */}
        <fieldset
          className={styles.fieldset}
          aria-required="true"
          aria-invalid={errors.specialities ? true : undefined}
          aria-describedby={errors.specialities ? 'specialities-error' : undefined}
        >
          <legend className={styles.label}>
            {j.specialities}
            <Star />
          </legend>
          {values.domains.length === 0 ? (
            <p className={styles.empty}>{j.specialitiesEmpty}</p>
          ) : (
            <div className={styles.groups}>
              {checkedDomains.map((domain, groupIndex) => {
                const otherOn = values.specialities.includes(otherKey(domain.id));
                return (
                  <fieldset key={domain.id} className={styles.group}>
                    <legend>{domain[lang]}</legend>
                    <div className={`${styles.choices} ${styles.grid2}`}>
                      {domain.specialities.map((speciality, index) => (
                        <label key={speciality.id} className={styles.choice}>
                          <input
                            type="checkbox"
                            name="specialities[]"
                            value={speciality.id}
                            checked={values.specialities.includes(speciality.id)}
                            onChange={(event) =>
                              toggle('specialities', speciality.id, event.target.checked)
                            }
                            className={styles.checkbox}
                            data-field={
                              groupIndex === 0 && index === 0 ? 'specialities' : undefined
                            }
                          />
                          <span>{speciality[lang]}</span>
                        </label>
                      ))}
                      <label className={styles.choice}>
                        <input
                          type="checkbox"
                          checked={otherOn}
                          onChange={(event) =>
                            toggle('specialities', otherKey(domain.id), event.target.checked)
                          }
                          className={styles.checkbox}
                        />
                        <span>{j.otherSpeciality}</span>
                      </label>
                    </div>
                    {otherOn && (
                      <div className={styles.nested}>
                        <TextField
                          name={`specialityOther-${domain.id}`}
                          label={j.otherSpecialityField(domain[lang])}
                          required
                          value={values.specialityOther[domain.id] ?? ''}
                          onChange={(v) => setOther(domain.id, v)}
                          maxLength={200}
                          error={errors[`specialityOther-${domain.id}`]}
                        />
                      </div>
                    )}
                  </fieldset>
                );
              })}
              {values.domains.includes(OTHER_DOMAIN) && (
                <fieldset className={styles.group}>
                  <legend>{otherDomainName}</legend>
                  <div className={styles.nested}>
                    <TextField
                      name={`specialityOther-${OTHER_DOMAIN}`}
                      label={j.otherSpecialityField(otherDomainName)}
                      required
                      value={values.specialityOther[OTHER_DOMAIN] ?? ''}
                      onChange={(v) => setOther(OTHER_DOMAIN, v)}
                      maxLength={200}
                      error={errors[`specialityOther-${OTHER_DOMAIN}`]}
                    />
                  </div>
                </fieldset>
              )}
            </div>
          )}
          {errors.specialities && (
            <ErrorText id="specialities-error">{errors.specialities}</ErrorText>
          )}
        </fieldset>

        <FileField
          name="cv"
          label={j.cv}
          required
          help={j.cvHelp}
          error={fileErrors.cv ?? errors.cv}
          files={cv ? [cv] : []}
          accept={acceptOf(CV_RULE)}
          onAdd={addCv}
          onRemove={() => {
            setCv(null);
            revalidate(values, null);
          }}
          labels={fileLabels}
          lang={lang}
        />
        <FileField
          name="documents"
          label={j.documents}
          help={j.documentsHelp}
          error={fileErrors.documents ?? errors.documents}
          files={documents}
          multiple
          max={MAX_DOCUMENTS}
          accept={acceptOf(DOCUMENT_RULE)}
          onAdd={addDocuments}
          onRemove={(index) => {
            const next = documents.filter((_, i) => i !== index);
            setDocuments(next);
            setFileErrors((current) => ({ ...current, documents: undefined }));
            revalidate(values, cv, next);
          }}
          labels={fileLabels}
          lang={lang}
        />

        <div className={styles.consents}>
          <CheckboxField
            name="consent"
            title={j.consentTitle}
            label={j.consent}
            required
            checked={values.consent}
            onChange={(v) => update('consent', v)}
            error={errors.consent}
          />
          <CheckboxField
            name="presentation"
            title={j.presentationTitle}
            label={j.presentation}
            required
            checked={values.presentation}
            onChange={(v) => update('presentation', v)}
            error={errors.presentation}
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
          {sending ? t.common.sending : j.submit}
        </button>
      </form>
    </FormPage>
  );
}
