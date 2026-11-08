import type { Lang } from '@/i18n/language';

/**
 * Indicatifs proposés (pays ISO et indicatif) : l'Algérie d'abord, proposée par défaut ; puis
 * le Maghreb, le monde arabe, l'Afrique, l'Europe et quelques autres pays, triés par nom dans
 * la langue de la page (noms donnés par le navigateur, Intl.DisplayNames).
 */
const DIAL_CODES: [string, string][] = [
  ['DZ', '+213'],
  ['MA', '+212'],
  ['TN', '+216'],
  ['LY', '+218'],
  ['MR', '+222'],
  ['EG', '+20'],
  ['SA', '+966'],
  ['AE', '+971'],
  ['QA', '+974'],
  ['KW', '+965'],
  ['BH', '+973'],
  ['OM', '+968'],
  ['JO', '+962'],
  ['LB', '+961'],
  ['SY', '+963'],
  ['IQ', '+964'],
  ['PS', '+970'],
  ['ML', '+223'],
  ['NE', '+227'],
  ['TD', '+235'],
  ['SN', '+221'],
  ['CI', '+225'],
  ['CM', '+237'],
  ['NG', '+234'],
  ['ZA', '+27'],
  ['FR', '+33'],
  ['BE', '+32'],
  ['CH', '+41'],
  ['LU', '+352'],
  ['DE', '+49'],
  ['ES', '+34'],
  ['IT', '+39'],
  ['PT', '+351'],
  ['NL', '+31'],
  ['GB', '+44'],
  ['IE', '+353'],
  ['AT', '+43'],
  ['SE', '+46'],
  ['NO', '+47'],
  ['DK', '+45'],
  ['FI', '+358'],
  ['PL', '+48'],
  ['RO', '+40'],
  ['GR', '+30'],
  ['TR', '+90'],
  ['RU', '+7'],
  ['CA', '+1'],
  ['US', '+1'],
  ['BR', '+55'],
  ['CN', '+86'],
  ['IN', '+91'],
  ['JP', '+81'],
  ['KR', '+82'],
];

export const DEFAULT_COUNTRY = 'DZ';

export type Country = { iso: string; dial: string; label: string };

export function countries(lang: Lang): Country[] {
  let names: Intl.DisplayNames | null = null;
  try {
    names = new Intl.DisplayNames([lang], { type: 'region' });
  } catch {
    names = null;
  }
  const list = DIAL_CODES.map(([iso, dial]) => ({
    iso,
    dial,
    label: `${names?.of(iso) ?? iso} (${dial})`,
  }));
  const [first, ...rest] = list;
  rest.sort((a, b) => a.label.localeCompare(b.label, lang));
  return first ? [first, ...rest] : rest;
}

export const dialOf = (iso: string) =>
  DIAL_CODES.find(([code]) => code === iso)?.[1] ?? DIAL_CODES[0]?.[1] ?? '+213';
