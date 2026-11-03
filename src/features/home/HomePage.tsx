import { useLanguage } from '@/i18n/useLanguage';
import { homeContent } from './content';
import { AiBand } from './sections/AiBand';
import { ClientLogos } from './sections/ClientLogos';
import { CommitmentsEssential } from './sections/CommitmentsEssential';
import { DomainsMosaic } from './sections/DomainsMosaic';
import { Faq } from './sections/Faq';
import { HeroDiagnostic } from './sections/HeroDiagnostic';
import { Insights } from './sections/Insights';
import { Testimonials } from './sections/Testimonials';
import { UpcomingSessions } from './sections/UpcomingSessions';

/**
 * Page d'accueil OPEM. Ordre des sections : bandeau d'accueil, logos clients, « Ce qui nous distingue »,
 * « Nos domaines », bandeau IA, prochaines sessions, témoignages, éclairages et actualités, questions fréquentes.
 * Retirées de l'accueil à la demande du client (fichiers conservés dans ./sections pour
 * pouvoir les remettre) : besoins (mosaïque), « Vous êtes… », approche, chiffres clés,
 * secteurs, agenda en liste (Trainings, remplacé par UpcomingSessions).
 * Textes : ./content.ts
 */
export default function HomePage() {
  const { lang } = useLanguage();
  const content = homeContent[lang];

  return (
    <>
      <title>{content.title}</title>
      <HeroDiagnostic
        hero={content.hero}
        video={content.heroVideo}
        diagnostic={content.heroDiagnostic}
        figures={content.figures}
      />
      <ClientLogos clients={content.clients} />
      <CommitmentsEssential commitments={content.commitments} />
      <DomainsMosaic domains={content.domains} />
      <AiBand ai={content.ai} />
      <UpcomingSessions trainings={content.trainings} />
      <Testimonials testimonials={content.testimonials} />
      <Insights insights={content.insights} />
      <Faq faq={content.faq} />
    </>
  );
}
