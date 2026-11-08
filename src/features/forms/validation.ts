/*
 * Contrôles des deux formulaires, côté navigateur. Le serveur (wordpress/opem-forms-api.php)
 * refait les mêmes contrôles : ceux-ci ne servent qu'à prévenir la personne tout de suite.
 */

/** Adresse de courriel plausible : une arobase, un domaine avec un point, pas d'espace. */
export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(value.trim()) && value.trim().length <= 254;
}

/** Le numéro sans séparateurs ni zéro initial (l'indicatif est choisi à part). */
export function normalizePhone(value: string): string {
  return value.replace(/[\s.\-()/]/g, '').replace(/^0+/, '');
}

/** Numéro national de 6 à 14 chiffres, une fois les séparateurs retirés. */
export function isPhone(value: string): boolean {
  return /^\d{6,14}$/.test(normalizePhone(value));
}

export const MB = 1024 * 1024;

export type FileRule = {
  /** Extensions acceptées, en minuscules, sans point. */
  extensions: readonly string[];
  maxBytes: number;
};

/** CV : PDF ou Word, 5 Mo au plus (le Word avec macros, .docm, est refusé). */
export const CV_RULE: FileRule = { extensions: ['pdf', 'doc', 'docx'], maxBytes: 5 * MB };

/** Autres documents : PDF, Word, Excel, JPG ou PNG, 10 Mo au plus chacun, cinq au plus. */
export const DOCUMENT_RULE: FileRule = {
  extensions: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png'],
  maxBytes: 10 * MB,
};
export const MAX_DOCUMENTS = 5;

export const extensionOf = (name: string) => name.toLowerCase().split('.').pop() ?? '';

/** Pourquoi un fichier est refusé, ou null s'il convient. */
export function checkFile(file: File, rule: FileRule): 'format' | 'size' | null {
  if (!rule.extensions.includes(extensionOf(file.name))) return 'format';
  if (file.size > rule.maxBytes || file.size === 0) return 'size';
  return null;
}

/** Accept du sélecteur de fichiers, à partir des extensions. */
export const acceptOf = (rule: FileRule) => rule.extensions.map((ext) => `.${ext}`).join(',');
