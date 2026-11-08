import { useId, type ChangeEvent, type ReactNode } from 'react';
import { CloseIcon } from '@/components/icons';
import { ErrorText, Help, Star } from './fields';
import styles from './Forms.module.css';
import { MB } from './validation';

/**
 * Choix de fichiers : le vrai sélecteur du navigateur (atteignable au clavier), présenté comme
 * un bouton ; la liste des fichiers retenus, chacun avec sa taille et un bouton pour le retirer.
 * Plusieurs fichiers : chaque choix s'ajoute aux précédents, jusqu'à la limite.
 */
export function FileField({
  name,
  label,
  required,
  help,
  error,
  files,
  multiple,
  max = 1,
  accept,
  onAdd,
  onRemove,
  labels,
  lang,
}: {
  name: string;
  label: ReactNode;
  required?: boolean;
  help: ReactNode;
  error: string | undefined;
  files: File[];
  multiple?: boolean;
  max?: number;
  accept: string;
  onAdd: (files: File[]) => void;
  onRemove: (index: number) => void;
  labels: {
    choose: string;
    add: string;
    replace: string;
    remove: (name: string) => string;
    none: string;
  };
  lang: string;
}) {
  const base = `${useId()}-${name}`;
  const ids = {
    input: base,
    label: `${base}-label`,
    button: `${base}-button`,
    help: `${base}-help`,
    error: `${base}-error`,
  };
  const full = multiple ? files.length >= max : false;
  const size = (bytes: number) =>
    `${(bytes / MB).toLocaleString(lang, { maximumFractionDigits: 1, minimumFractionDigits: 1 })} ${lang === 'ar' ? 'م.ب' : 'Mo'}`;

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const chosen = Array.from(event.target.files ?? []);
    event.target.value = ''; // pour pouvoir choisir à nouveau le même fichier
    if (chosen.length > 0) onAdd(chosen);
  };

  return (
    <div className={styles.field}>
      <p id={ids.label} className={styles.label}>
        {label}
        {required && <Star />}
      </p>
      <div className={styles.files} data-invalid={error ? '' : undefined}>
        {files.length > 0 ? (
          <ul className={styles.fileList}>
            {files.map((file, index) => (
              <li key={`${file.name}-${file.size}-${index}`} className={styles.fileItem}>
                <span className={styles.fileName} dir="auto">
                  {file.name}
                </span>
                <span className={styles.fileSize}>{size(file.size)}</span>
                <button
                  type="button"
                  className={styles.fileRemove}
                  onClick={() => onRemove(index)}
                  aria-label={labels.remove(file.name)}
                >
                  <CloseIcon size={16} />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.noFile}>{labels.none}</p>
        )}
        <input
          id={ids.input}
          type="file"
          name={name}
          accept={accept}
          multiple={multiple}
          disabled={full}
          onChange={onChange}
          className={styles.fileInput}
          aria-labelledby={`${ids.label} ${ids.button}`}
          aria-required={required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={[ids.help, error ? ids.error : null].filter(Boolean).join(' ')}
          data-field={name}
        />
        <label id={ids.button} htmlFor={ids.input} className={styles.fileButton}>
          {multiple ? labels.add : files.length > 0 ? labels.replace : labels.choose}
        </label>
      </div>
      <Help id={ids.help}>{help}</Help>
      {error && <ErrorText id={ids.error}>{error}</ErrorText>}
    </div>
  );
}
