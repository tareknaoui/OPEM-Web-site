import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';
import { LanguageProvider } from '@/i18n/LanguageProvider';
import { homeContent } from '../content';
import { scoreDiagnostic } from './diagnosticScore';
import { HeroDiagnostic } from './HeroDiagnostic';

const { hero, heroVideo, heroDiagnostic, figures } = homeContent.fr;

function renderHero() {
  const Page = () => (
    <HeroDiagnostic hero={hero} video={heroVideo} diagnostic={heroDiagnostic} figures={figures} />
  );
  const router = createMemoryRouter([{ path: '*', Component: Page }]);
  return render(
    <LanguageProvider>
      <RouterProvider router={router} />
    </LanguageProvider>,
  );
}

const answer = (label: RegExp) => fireEvent.click(screen.getByRole('button', { name: label }));
const start = () => answer(/Faire le test/);

/**
 * Ouvre le diagnostic, répond aux questions sur l'organisation, puis aux 7 leviers avec les
 * réponses les plus faibles.
 */
function answerAll() {
  start();
  answer(/^Industrie$/);
  answer(/De 50 à 249 personnes/);
  answer(/Direction générale/);
  answer(/Elle reste implicite/);
  answer(/Les rôles restent flous/);
  answer(/Chacun fait à sa façon/);
  answer(/Rarement/);
  answer(/Surtout par le contrôle/);
  answer(/Souvent, non/);
  answer(/Au cas par cas/);
}

describe('Bandeau « Autodiagnostic 7S »', () => {
  it('présente le métier, puis le diagnostic comme aide pour s’orienter', () => {
    renderHero();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Ce qui fait exceller votre organisation.',
    );
    // Le devis est dans la barre de navigation, pas dans l'accroche.
    expect(screen.queryByRole('link', { name: /Demander un devis/ })).toBeNull();
    // Le métier d'abord : les chiffres clés sous le titre (valeur finale lue d'emblée).
    const keyFigures = within(screen.getByRole('list', { name: 'OPEM en quelques chiffres' }));
    const items = keyFigures.getAllByRole('listitem');
    expect(items).toHaveLength(4);
    expect(items[2]).toHaveTextContent(/\+1\s500.*cadres et agents formés/);
    expect(items[3]).toHaveTextContent(/\+165.*experts mobilisables/);
    expect(document.querySelector('video')).toBeNull();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      /Sept leviers font votre performance/,
    );
    expect(screen.getByRole('figure', { name: /Le modèle des 7S/ })).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('ouvre le plein écran : une question par levier, réponses au clic ou au clavier', async () => {
    renderHero();
    start();
    const dialog = screen.getByRole('dialog', { name: 'Autodiagnostic 3 minutes chrono' });

    // D'abord l'organisation : le secteur (10 réponses, sans touches), puis l'effectif.
    const sector = within(dialog).getByRole('heading', { name: /Dans quel secteur/ });
    await waitFor(() => expect(sector).toHaveFocus());
    const sectors = within(within(dialog).getByRole('list', { name: /Dans quel secteur/ }));
    expect(sectors.getAllByRole('button')).toHaveLength(10);
    expect(sectors.getByRole('button', { name: 'Administration publique' })).toBeInTheDocument();
    answer(/^Industrie$/);
    const size = within(dialog).getByRole('heading', { name: /Combien de personnes/ });
    fireEvent.keyDown(size, { key: 'b' });
    answer(/Direction générale/);

    const question = within(dialog).getByRole('heading', { name: /Votre stratégie/ });
    await waitFor(() => expect(question).toHaveFocus());
    expect(within(dialog).getByText(/Levier 1 sur 7/)).toBeInTheDocument();
    const choices = within(within(dialog).getByRole('list', { name: /Votre stratégie/ }));
    expect(choices.getAllByRole('button').map((button) => button.textContent)).toEqual([
      'AElle reste implicite',
      'BClaire pour la direction seulement',
      'CÉcrite et diffusée',
      'DPartagée et suivie avec des indicateurs',
    ]);

    fireEvent.keyDown(question, { key: 'c' });
    expect(within(dialog).getByRole('heading', { level: 2 })).toHaveTextContent(
      /Chacun sait-il qui décide/,
    );
    answer(/Question précédente/);
    expect(screen.getByRole('button', { name: /Écrite et diffusée/ })).toHaveAttribute(
      'aria-current',
      'true',
    );
  });

  it('dévoile le profil, le score et les domaines, puis se referme', async () => {
    renderHero();
    answerAll();

    const profile = screen.getByRole('heading', { name: 'L’organisation en fondation' });
    await waitFor(() => expect(profile).toHaveFocus());
    const dialog = within(screen.getByRole('dialog'));
    expect(dialog.getByText('Industrie · De 50 à 249 personnes')).toBeInTheDocument();
    expect(within(dialog.getByText('Maturité').parentElement!).getByText(/^0\s%$/)).toBeVisible();
    expect(dialog.getByText(/Niveau 1 sur 4/).parentElement).toHaveTextContent(/Initial$/);
    // Notre lecture : niveau, cadre / humain, point d'appui, effectif.
    const reading = dialog.getByRole('heading', { name: 'Notre lecture' }).nextElementSibling;
    expect(reading).toHaveTextContent(/^L’organisation tient surtout/);
    expect(reading).toHaveTextContent(/Le cadre \(0\s%\) et l’humain \(0\s%\) sont au même niveau/);
    expect(reading).toHaveTextContent(/Aucun levier n’est encore solide/);
    expect(reading).toHaveTextContent(/Entre 50 et 249 personnes, l’informel ne suffit plus/);
    const radar = within(dialog.getByRole('figure', { name: /Le modèle des 7S/ }));
    expect(radar.getByText(/Stratégie – 0 sur 3/)).toBeInTheDocument();
    expect(screen.getByText('Style de management')).toBeInTheDocument();
    // Deux domaines au plus, un seul par domaine.
    expect(dialog.getByRole('link', { name: /Études stratégiques/ })).toHaveAttribute(
      'href',
      '/expertises/etudes-strategiques',
    );
    expect(dialog.getByRole('link', { name: /Accompagnement des organisations/ })).toBeVisible();
    const callback = screen.getByRole('link', { name: /Être rappelé avec ce résultat/ });
    expect(callback.getAttribute('href')).toMatch(
      /^\/contact\?source=autodiagnostic&secteur=industrie&effectif=50-249&fonction=direction&strategie=implicite&.*&profil=fondation&maturite=0$/,
    );

    answer(/Refaire le diagnostic/);
    expect(screen.getByRole('heading', { name: /Votre stratégie/ })).toBeInTheDocument();

    answer(/Quitter/);
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});

describe('Calcul de l’empreinte 7S', () => {
  const best = Object.fromEntries(
    heroDiagnostic.questions.map((question) => [question.id, question.choices.at(-1)?.id ?? '']),
  );

  it('tout au plus haut : organisation alignée, le levier le moins avancé est proposé', () => {
    expect(scoreDiagnostic(heroDiagnostic, best)).toMatchObject({
      percent: 100,
      profile: 'alignee',
      weak: [],
      start: ['strategie'],
      level: 3,
      balance: 'even',
      strongest: 'strategie',
    });
  });

  it('stratégie faible, le reste solide : navire sans cap', () => {
    expect(scoreDiagnostic(heroDiagnostic, { ...best, strategie: 'implicite' })).toMatchObject({
      profile: 'cap',
      weak: ['strategie'],
      start: ['strategie'],
    });
  });

  it('cadre solide, humain en retrait : belle mécanique ; l’inverse : talent sans charpente', () => {
    const frame = { strategie: 'pilotee', structure: 'revus', systemes: 'ameliores' };
    const people = {
      valeurs: 'decisions',
      style: 'autonomie',
      personnel: 'talents',
      competences: 'evalue',
    };
    const low = {
      strategie: 'direction',
      structure: 'organigramme',
      systemes: 'en-partie',
      valeurs: 'certaines',
      style: 'chacun',
      personnel: 'parfois',
      competences: 'demandes',
    };
    expect(scoreDiagnostic(heroDiagnostic, { ...low, ...frame })).toMatchObject({
      profile: 'mecanique',
      hard: 100,
      soft: 33,
      balance: 'hard',
      level: 2,
    });
    expect(scoreDiagnostic(heroDiagnostic, { ...low, ...people })).toMatchObject({
      profile: 'talents',
      balance: 'soft',
      strongest: 'valeurs',
    });
  });

  it('classe les leviers faibles et propose leurs domaines, sans doublon', () => {
    const answers = {
      strategie: 'pilotee',
      structure: 'organigramme',
      systemes: 'essentiel',
      valeurs: 'ensemble',
      style: 'ecoute',
      personnel: 'souvent-non',
      competences: 'plan-annuel',
    };
    expect(scoreDiagnostic(heroDiagnostic, answers)).toMatchObject({
      percent: 57,
      profile: 'mouvement',
      weak: ['personnel', 'structure'],
      start: ['personnel'],
      level: 2,
      strongest: 'strategie',
    });
  });
});
