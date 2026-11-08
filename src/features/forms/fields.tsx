import { useId, type ReactNode } from 'react';
import { cx } from '@/lib/cx';
import type { Country } from './countries';
import styles from './Forms.module.css';

/*
 * Champs communs aux deux formulaires. Libellé toujours visible au-dessus du champ, astérisque
 * pour les champs obligatoires (aria-required pour les lecteurs d'écran), aide et message
 * d'erreur sous le champ, reliés par aria-describedby. Les saisies ne sont jamais effacées.
 */

type Common = {
  name: string;
  label: ReactNode;
  required?: boolean;
  help?: ReactNode;
  error?: string | undefined;
};

function useIds(name: string) {
  const base = `${useId()}-${name}`;
  return { input: base, help: `${base}-help`, error: `${base}-error` };
}

const describedBy = (ids: ReturnType<typeof useIds>, help: unknown, error: unknown) =>
  [help ? ids.help : null, error ? ids.error : null].filter(Boolean).join(' ') || undefined;

export function Star() {
  return (
    <span className={styles.star} aria-hidden="true">
      *
    </span>
  );
}

function Label({
  htmlFor,
  label,
  required,
}: {
  htmlFor: string;
  label: ReactNode;
  required?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className={styles.label}>
      {label}
      {required && <Star />}
    </label>
  );
}

export function Help({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className={styles.help}>
      {children}
    </p>
  );
}

export function ErrorText({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className={styles.error}>
      {children}
    </p>
  );
}

export function TextField({
  name,
  label,
  required,
  help,
  error,
  value,
  onChange,
  type = 'text',
  autoComplete,
  inputMode,
  maxLength = 120,
}: Common & {
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email';
  autoComplete?: string;
  inputMode?: 'text' | 'email';
  maxLength?: number;
}) {
  const ids = useIds(name);
  return (
    <div className={styles.field}>
      <Label htmlFor={ids.input} label={label} required={required} />
      <input
        id={ids.input}
        name={name}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={styles.input}
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={maxLength}
        dir={type === 'email' ? 'ltr' : undefined}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(ids, help, error)}
        data-field={name}
      />
      {help && <Help id={ids.help}>{help}</Help>}
      {error && <ErrorText id={ids.error}>{error}</ErrorText>}
    </div>
  );
}

export function TextAreaField({
  name,
  label,
  required,
  help,
  error,
  value,
  onChange,
  maxLength,
  counter,
}: Common & {
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
  /** Texte du compteur, ex. « 120 / 1 000 caractères ». */
  counter: (count: number, max: number) => string;
}) {
  const ids = useIds(name);
  const counterId = `${ids.input}-counter`;
  const near = value.length >= maxLength * 0.9;
  return (
    <div className={styles.field}>
      <Label htmlFor={ids.input} label={label} required={required} />
      <textarea
        id={ids.input}
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value.slice(0, maxLength))}
        className={cx(styles.input, styles.textarea)}
        maxLength={maxLength}
        rows={6}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={[describedBy(ids, help, error), counterId].filter(Boolean).join(' ')}
        data-field={name}
      />
      <div className={styles.under}>
        {help && <Help id={ids.help}>{help}</Help>}
        {/* Annoncé seulement à l'approche de la limite, pour ne pas parler à chaque frappe. */}
        <p
          id={counterId}
          className={cx(styles.counter, near && styles.counterNear)}
          aria-live={near ? 'polite' : 'off'}
        >
          {counter(value.length, maxLength)}
        </p>
      </div>
      {error && <ErrorText id={ids.error}>{error}</ErrorText>}
    </div>
  );
}

export type Option = { value: string; label: string };

export function SelectField({
  name,
  label,
  required,
  help,
  error,
  value,
  onChange,
  options,
  placeholder,
  compact,
}: Common & {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder: string;
  compact?: boolean;
}) {
  const ids = useIds(name);
  return (
    <div className={cx(styles.field, compact && styles.fieldCompact)}>
      <Label htmlFor={ids.input} label={label} required={required} />
      <select
        id={ids.input}
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cx(styles.input, styles.select)}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(ids, help, error)}
        data-field={name}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {help && <Help id={ids.help}>{help}</Help>}
      {error && <ErrorText id={ids.error}>{error}</ErrorText>}
    </div>
  );
}

/** Choix unique en boutons radio ; sans réponse par défaut, avec un bouton pour l'effacer. */
export function RadioField({
  name,
  label,
  required,
  error,
  value,
  onChange,
  options,
  clearLabel,
}: Common & {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  clearLabel?: string;
}) {
  const ids = useIds(name);
  return (
    <fieldset
      className={styles.fieldset}
      aria-required={required || undefined}
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? ids.error : undefined}
    >
      <legend className={styles.label}>
        {label}
        {required && <Star />}
      </legend>
      <div className={styles.choices}>
        {options.map((option, index) => (
          <label key={option.value} className={styles.choice}>
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className={styles.radio}
              data-field={index === 0 ? name : undefined}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
      {clearLabel && value && (
        <button type="button" className={styles.clear} onClick={() => onChange('')}>
          {clearLabel}
        </button>
      )}
      {error && <ErrorText id={ids.error}>{error}</ErrorText>}
    </fieldset>
  );
}

/** Une case à cocher seule (consentements) : non cochée par défaut. */
export function CheckboxField({
  name,
  title,
  label,
  required,
  error,
  checked,
  onChange,
}: Common & { title?: string; checked: boolean; onChange: (checked: boolean) => void }) {
  const ids = useIds(name);
  return (
    <div className={styles.field}>
      {/* Le libellé du champ (« Consentement »), au-dessus de la case et de son texte. */}
      {title && (
        <p className={styles.label} aria-hidden="true">
          {title}
          {required && <Star />}
        </p>
      )}
      <label className={styles.consent} htmlFor={ids.input}>
        <input
          id={ids.input}
          type="checkbox"
          name={name}
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className={styles.checkbox}
          aria-required={required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? ids.error : undefined}
          data-field={name}
        />
        <span>
          {title && <span className="sr-only">{`${title}. `}</span>}
          {label}
          {required && !title && <Star />}
        </span>
      </label>
      {error && <ErrorText id={ids.error}>{error}</ErrorText>}
    </div>
  );
}

/** Téléphone : l'indicatif (modifiable, +213 par défaut) puis le numéro. */
export function PhoneField({
  name,
  label,
  required,
  help,
  error,
  value,
  onChange,
  country,
  onCountry,
  countries,
  countryLabel,
}: Common & {
  value: string;
  onChange: (value: string) => void;
  country: string;
  onCountry: (iso: string) => void;
  countries: Country[];
  countryLabel: string;
}) {
  const ids = useIds(name);
  return (
    <div className={styles.field}>
      <Label htmlFor={ids.input} label={label} required={required} />
      <div className={styles.phone} dir="ltr">
        <select
          value={country}
          onChange={(event) => onCountry(event.target.value)}
          className={cx(styles.input, styles.select, styles.dial)}
          aria-label={countryLabel}
          name={`${name}Country`}
        >
          {countries.map((option) => (
            <option key={option.iso} value={option.iso}>
              {option.label}
            </option>
          ))}
        </select>
        <input
          id={ids.input}
          name={name}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={styles.input}
          maxLength={24}
          aria-required={required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(ids, help, error)}
          data-field={name}
        />
      </div>
      {help && <Help id={ids.help}>{help}</Help>}
      {error && <ErrorText id={ids.error}>{error}</ErrorText>}
    </div>
  );
}

/**
 * Piège à robots : un champ que personne ne voit ni n'atteint au clavier. Rempli, l'envoi est
 * ignoré par le serveur, sans test intrusif pour les personnes.
 */
export function Honeypot({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className={styles.trap} aria-hidden="true">
      <label>
        Site web
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </label>
    </div>
  );
}
