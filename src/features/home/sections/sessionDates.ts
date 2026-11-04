import type { HomeContent } from '../content';

type Session = HomeContent['trainings']['items'][number];

const DAY_MS = 24 * 60 * 60 * 1000;

/** « AAAA-MM-JJ » → date locale à minuit. */
function parseDay(value: string) {
  const [year = 0, month = 1, day = 1] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Sessions à venir (aujourd'hui compris), triées par date, avec leur premier et dernier jour et
 * le nombre de jours restants. Les sessions intra-entreprise, réservées au personnel d'un
 * client, n'y figurent jamais.
 */
export function upcomingSessions(items: Session[], today = new Date()) {
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  return items
    .filter((item) => !item.intra)
    .map((item) => {
      const day = parseDay(item.date);
      return {
        ...item,
        day,
        lastDay: parseDay(item.end),
        daysLeft: Math.round((day.getTime() - start) / DAY_MS),
      };
    })
    .filter((item) => item.daysLeft >= 0)
    .sort((a, b) => a.daysLeft - b.daysLeft);
}
