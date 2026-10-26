import { Link } from 'react-router';
import { ArrowRightIcon } from '@/components/icons';
import { cx } from '@/lib/cx';
import type { HomeContent } from '../content';
import { HeroSideVideo } from './HeroSideVideo';
import styles from './HeroQuestions.module.css';

type HeroQuestionsProps = {
  questions: HomeContent['heroQuestions'];
  video: HomeContent['heroVideo'];
};

/**
 * Bandeau « Trois questions » : à la place du titre, trois questions courtes empilées
 * (Poppins, blanc sur bleu nuit), chacune un lien vers le domaine concerné. Puis une
 * ligne et le bouton « Être rappelé ». La vidéo d'accueil occupe la moitié droite.
 */
export function HeroQuestions({ questions, video }: HeroQuestionsProps) {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.text}>
        {/* Les trois questions forment le titre de la page. */}
        <h1 id="hero-title" className={styles.questions}>
          {questions.questions.map((question) => (
            <Link key={question.href} to={question.href} className={styles.question}>
              <span className={styles.questionLabel}>{question.label}</span>
              <ArrowRightIcon size={28} className={cx('arrow', styles.questionArrow)} />
            </Link>
          ))}
        </h1>

        <p className={styles.line}>{questions.line}</p>
        <Link to={questions.cta.href} className={cx('btn btn-light', styles.cta)}>
          {questions.cta.label}
          <ArrowRightIcon size={18} className="arrow" />
        </Link>
      </div>

      <HeroSideVideo video={video} className={styles.media} />
    </section>
  );
}
