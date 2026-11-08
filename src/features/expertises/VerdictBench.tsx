import { ChartLineUpIcon } from '@phosphor-icons/react/dist/csr/ChartLineUp';
import { ChatCircleDotsIcon } from '@phosphor-icons/react/dist/csr/ChatCircleDots';
import { CheckCircleIcon } from '@phosphor-icons/react/dist/csr/CheckCircle';
import { FilesIcon } from '@phosphor-icons/react/dist/csr/Files';
import { HourglassMediumIcon } from '@phosphor-icons/react/dist/csr/HourglassMedium';
import { XCircleIcon } from '@phosphor-icons/react/dist/csr/XCircle';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';
import { motionAllowed } from '@/features/cabinet/useCabinetMotion';
import styles from './VerdictBench.module.css';

/** Un usage examiné par ligne (sans intitulé : l'icône suffit), puis la marque de son verdict. */
const USAGES = [ChatCircleDotsIcon, FilesIcon, ChartLineUpIcon];
const MARKS = [CheckCircleIcon, HourglassMediumIcon, XCircleIcon];

/**
 * Bloc 04, « IA appliquée » : le banc d'essai. Sur un panneau bleu nuit, trois usages de l'IA
 * avancent chacun sur sa ligne jusqu'au faisceau ambre de l'examen ; en le franchissant, ils
 * prennent la couleur de leur verdict, qui s'inscrit de l'autre côté : « Oui. » (vert),
 * « Pas encore. » (ambre), « Non. » (bleu clair), avec sa condition. La tête du faisceau suit
 * l'usage examiné. L'examen se joue une fois, à l'arrivée du panneau ; sans script ou en
 * mouvement réduit, les trois verdicts sont posés d'emblée.
 */
export function VerdictBench({
  verdicts,
  alt,
  rtl,
}: {
  verdicts: { word: string; condition: string }[];
  alt: string;
  rtl: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bench = ref.current;
    if (!bench || !motionAllowed()) return;
    gsap.registerPlugin(ScrollTrigger);
    const rows = Array.from(bench.querySelectorAll<HTMLElement>('[data-row]'));
    const head = bench.querySelector<HTMLElement>('[data-head]');
    const side = rtl ? -1 : 1;
    // Le milieu d'une ligne, dans le repère du faisceau (qui commence sous la marge du panneau).
    const center = (row: HTMLElement) =>
      row.offsetTop + row.offsetHeight / 2 - (head?.parentElement?.offsetTop ?? 0);
    // En attendant l'examen : aucun usage n'a encore franchi le faisceau.
    bench.setAttribute('data-live', '');
    rows.forEach((row) => row.removeAttribute('data-passed'));

    const context = gsap.context(() => {
      const timeline = gsap.timeline({ paused: true });
      const first = rows[0];
      if (head && first) gsap.set(head, { top: () => center(first) });
      rows.forEach((row, index) => {
        const lane = row.querySelector<HTMLElement>('[data-lane]');
        const card = row.querySelector<HTMLElement>('[data-card]');
        const result = row.querySelector<HTMLElement>('[data-result]');
        const mark = row.querySelector<HTMLElement>('[data-mark]');
        if (!lane || !card || !result) return;
        // Le chemin de l'usage : du bord du panneau jusqu'au faisceau.
        const travel = () => -side * (lane.clientWidth - card.offsetWidth);
        const at = index * 1.5;
        timeline
          .to(head, { top: () => center(row), duration: 0.5, ease: 'power2.inOut' }, at)
          .from(card, { x: travel, duration: 1.1, ease: 'power3.inOut' }, at)
          .call(() => row.setAttribute('data-passed', ''), undefined, at + 1)
          .from(
            result,
            {
              clipPath: rtl ? 'inset(0% 0% 0% 100%)' : 'inset(0% 100% 0% 0%)',
              duration: 0.7,
              ease: 'power2.out',
            },
            at + 1,
          )
          .from(mark, { scale: 0, rotate: -45, duration: 0.6, ease: 'back.out(2.5)' }, at + 1.1);
      });
      ScrollTrigger.create({
        trigger: bench,
        start: 'top 70%',
        once: true,
        onEnter: () => timeline.play(),
      });
    }, bench);

    return () => {
      context.revert();
      bench.removeAttribute('data-live');
      rows.forEach((row) => row.setAttribute('data-passed', ''));
    };
  }, [rtl]);

  return (
    <div ref={ref} className={styles.bench} role="img" aria-label={alt}>
      {/* Le faisceau de l'examen et sa tête, qui suit l'usage examiné. */}
      <span className={styles.beam} aria-hidden="true">
        <span className={styles.head} data-head />
      </span>
      {verdicts.map((verdict, index) => {
        const Usage = USAGES[index];
        const Mark = MARKS[index];
        return (
          <div
            key={verdict.word}
            className={styles.row}
            data-row
            data-verdict={index}
            data-passed=""
          >
            <span className={styles.lane} data-lane aria-hidden="true">
              <span className={styles.card} data-card>
                {Usage && <Usage size={26} weight="duotone" />}
              </span>
            </span>
            <p className={styles.result} data-result>
              <span className={styles.mark} data-mark aria-hidden="true">
                {Mark && <Mark size={28} weight="fill" />}
              </span>
              <span className={styles.word}>{verdict.word}</span>
              <span className={styles.condition}>{verdict.condition}</span>
            </p>
          </div>
        );
      })}
    </div>
  );
}
