import type { HomeContent } from '../content';

type Session = HomeContent['trainings']['items'][number];

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Sessions à venir (aujourd'hui compris), triées par date, avec le nombre de jours restants.
 * Les sessions intra-entreprise, réservées au personnel d'un client, n'y figurent jamais.
 */
export function upcomingSessions(items: Session[], today = new Date()) {
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  return items
    .filter((item) => !item.intra)
    .map((item) => {
      const [year = 0, month = 1, day = 1] = item.date.split('-').map(Number);
      const time = new Date(year, month - 1, day).getTime();
      return { ...item, day: new Date(time), daysLeft: Math.round((time - start) / DAY_MS) };
    })
    .filter((item) => item.daysLeft >= 0)
    .sort((a, b) => a.daysLeft - b.daysLeft);
}
