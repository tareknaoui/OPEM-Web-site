// Comparateur de maquettes (outil temporaire, voir README) : à retirer une fois le choix fait.
import { useLayoutVariants } from '@/app/layouts/variants/layoutVariants';
import { useLanguage } from '@/i18n/useLanguage';
import { homeContent } from './content';
import { AiBand } from './sections/AiBand';
import { Commitments } from './sections/Commitments';
import { CommitmentsEssential } from './sections/CommitmentsEssential';
import { Domains } from './sections/Domains';
import { DomainsAuto } from './sections/DomainsAuto';
import { DomainsEditorial } from './sections/DomainsEditorial';
import { DomainsMosaic } from './sections/DomainsMosaic';
import { DomainsCarousel } from './sections/DomainsCarousel';
import { Faq } from './sections/Faq';
import { Hero } from './sections/Hero';
import { HeroAudiences } from './sections/HeroAudiences';
import { HeroCycle } from './sections/HeroCycle';
import { HeroDiagnostic } from './sections/HeroDiagnostic';
import { HeroEditorial } from './sections/HeroEditorial';
import { HeroFacts } from './sections/HeroFacts';
import { HeroImmersive } from './sections/HeroImmersive';
import { HeroQuestions } from './sections/HeroQuestions';
import { HeroVideo } from './sections/HeroVideo';
import { Insights } from './sections/Insights';
import { InsightsRail } from './sections/InsightsRail';
import { Testimonials } from './sections/Testimonials';
import { UpcomingSessions } from './sections/UpcomingSessions';

/**
 * Page d'accueil OPEM. Ordre des sections : bandeau d'accueil, « Ce qui nous distingue »,
 * « Nos domaines », bandeau IA, prochaines sessions, éclairages et actualités, témoignages, questions fréquentes.
 * Retirées de l'accueil à la demande du client (fichiers conservés dans ./sections pour
 * pouvoir les remettre) : besoins (mosaïque), « Vous êtes… », approche, chiffres clés,
 * secteurs, agenda en liste (Trainings, remplacé par UpcomingSessions).
 * Textes : ./content.ts
 */
export default function HomePage() {
  const { lang } = useLanguage();
  const { hero, commitments, domains, insights } = useLayoutVariants();
  const content = homeContent[lang];

  return (
    <>
      <title>{content.title}</title>
      {hero === 'cycle' ? (
        <HeroCycle hero={content.hero} cycle={content.heroCycle} markers={content.markers} />
      ) : hero === 'reperes' ? (
        <HeroFacts hero={content.hero} video={content.heroVideo} facts={content.heroFacts} />
      ) : hero === 'publics' ? (
        <HeroAudiences audiences={content.heroAudiences} video={content.heroVideo} />
      ) : hero === 'questions' ? (
        <HeroQuestions questions={content.heroQuestions} video={content.heroVideo} />
      ) : hero === 'diagnostic' ? (
        <HeroDiagnostic
          hero={content.hero}
          video={content.heroVideo}
          diagnostic={content.heroDiagnostic}
          figures={content.figures}
        />
      ) : hero === 'editorial' || hero === 'editorialnuit' ? (
        <HeroEditorial
          hero={content.hero}
          video={content.heroVideo}
          editorial={content.heroEditorial}
          tone={hero === 'editorialnuit' ? 'dark' : 'light'}
        />
      ) : hero === 'immersive' ? (
        <HeroImmersive
          hero={content.hero}
          video={content.heroVideo}
          immersive={content.heroImmersive}
          markers={content.markers}
        />
      ) : hero === 'video' ? (
        <HeroVideo hero={content.hero} video={content.heroVideo} markers={content.markers} />
      ) : (
        <Hero hero={content.hero} markers={content.markers} />
      )}
      {commitments === 'cartes' ? (
        <Commitments commitments={content.commitments} />
      ) : (
        <CommitmentsEssential commitments={content.commitments} />
      )}
      {domains === 'rangee' || domains === 'mosaique' || domains === 'coin' ? (
        <DomainsMosaic domains={content.domains} layout={domains} />
      ) : domains === 'sommaire' ? (
        <DomainsEditorial domains={content.domains} />
      ) : domains === 'anime' ? (
        <DomainsAuto domains={content.domains} />
      ) : domains === 'carrousel' ? (
        <DomainsCarousel domains={content.domains} />
      ) : (
        <Domains domains={content.domains} />
      )}
      <AiBand ai={content.ai} />
      <UpcomingSessions trainings={content.trainings} />
      {insights === 'rail' ? (
        <InsightsRail insights={content.insights} />
      ) : (
        <Insights insights={content.insights} />
      )}
      <Testimonials testimonials={content.testimonials} />
      <Faq faq={content.faq} />
    </>
  );
}
