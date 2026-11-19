// Génère wordpress/opem-formations-seed.json à partir des formations écrites dans le site
// (src/features/formation/showcase/content.ts) et de leurs sessions dans l'agenda
// (src/features/home/content.ts) : le bouton « Importer les formations du site » du menu
// « Formations » de WordPress les y recopie, une fois, pour pouvoir les corriger là-bas.
// Lancer : node scripts/gen-formations-seed.mjs (Node 23.6 ou plus récent : lit le TypeScript).
import { readFileSync, writeFileSync } from 'node:fs';

const { SHOWCASE_IDS, findShowcase } =
  await import('../src/features/formation/showcase/content.ts');
const home = readFileSync('src/features/home/content.ts', 'utf8');

/** Les sessions de l'agenda, dans l'ordre du fichier (français, puis arabe). */
const sessions = [
  ...home.matchAll(
    /id: '([a-z0-9-]+)',\s*date: '([\d-]+)',\s*end: '([\d-]+)',\s*topic: '([^']*)',\s*title: '[^']*',\s*promise: '[^']*',\s*format: '([^']*)'/g,
  ),
].map(([, id, date, end, topic, format]) => ({ id, date, end, topic, format }));
const session = (id, lang) => sessions.filter((s) => s.id === id)[lang === 'fr' ? 0 : 1];

const NBSP = / /g;
const plain = (text) => text.replace(NBSP, ' ');

const texts = (item, lang) => {
  const agenda = session(item.id, lang);
  return {
    title: plain(item.title),
    promise: plain(item.promise),
    cycle: plain(item.cycle),
    topic: agenda?.topic ?? '',
    duration: plain(item.duration),
    place: item.place,
    city: item.city,
    format: agenda?.format ?? '',
    hook_question: plain(item.hook.question),
    hook_answer: plain(item.hook.answer),
    why_text: plain(item.why.text),
    why_details: plain(item.why.details ?? ''),
    why_edge: plain(item.why.edge),
    link_label: plain(item.why.link?.label ?? ''),
    gains: item.gains.map(plain),
    audience: plain(item.audience),
    reasons: item.reasons.map(plain),
    voices: item.voices.map((v) => ({ quote: plain(v.quote), author: plain(v.author) })),
    alt: plain(item.illustration.alt),
  };
};

const seed = SHOWCASE_IDS.map((id) => {
  const fr = findShowcase('fr', id);
  const ar = findShowcase('ar', id);
  const agenda = session(id, 'fr');
  return {
    slug: id,
    reference: fr.reference,
    start: agenda?.date ?? '',
    end: agenda?.end ?? '',
    seats: fr.seats,
    theme: fr.illustration.art ?? id,
    link_href: fr.why.link?.href ?? '',
    fr: texts(fr, 'fr'),
    ar: texts(ar, 'ar'),
  };
});

writeFileSync('wordpress/opem-formations-seed.json', `${JSON.stringify(seed, null, 2)}\n`);
console.log(`wordpress/opem-formations-seed.json : ${seed.length} formations`);
