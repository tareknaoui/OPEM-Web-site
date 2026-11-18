/** Dates et gabarits des pages formation. */

const N = ' ';

/** Une date AAAA-MM-JJ, lue à midi pour éviter tout décalage de fuseau. */
const parse = (date: string) => new Date(`${date}T12:00:00`);

export const fill = (text: string, values: Record<string, string | number>) =>
  text.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ''));

/**
 * Les dates d'une session, mois abrégé pour tenir sur une ligne : « 06 au 09 déc. 2026 » (le
 * mois et l'année une seule fois s'ils sont les mêmes), « 29 déc. 2026 au 02 janv. 2027 ».
 */
export function sessionDates(start: string, end: string, locale: string, pattern: string) {
  const from = parse(start);
  const to = parse(end);
  const sameYear = from.getFullYear() === to.getFullYear();
  const sameMonth = sameYear && from.getMonth() === to.getMonth();
  const full = new Intl.DateTimeFormat(locale, { day: '2-digit', month: 'short', year: 'numeric' });
  const head = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    ...(sameMonth ? {} : { month: 'short' }),
    ...(sameYear ? {} : { year: 'numeric' }),
  });
  const glue = (text: string) => text.replace(/ /g, N);
  return fill(pattern, { start: glue(head.format(from)), end: glue(full.format(to)) });
}

/**
 * Un élément d'une phrase découpée (« des cas réels… ; »), affiché seul sur une carte :
 * majuscule initiale, sans la ponctuation finale.
 */
export const asCard = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1).replace(/\s*[;.]\s*$/, '');

/**
 * Typographie française d'un texte saisi dans WordPress : espace insécable avant « : ; ? ! »,
 * à l'intérieur des guillemets, et entre un nombre et son unité (« 4 jours »).
 */
export const frenchSpaces = (text: string) =>
  text
    .replace(/ ([:;?!»])/g, `${N}$1`)
    .replace(/« /g, `«${N}`)
    .replace(/(\d) (?=\p{L})/gu, `$1${N}`);
