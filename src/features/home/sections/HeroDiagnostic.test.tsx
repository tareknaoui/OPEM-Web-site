import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { LanguageProvider } from '@/i18n/LanguageProvider';
import { homeContent, type DiagnosticAxis } from '../content';
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
const begin = () => answer(/Commencer le test/);
/** Clique la dernière réponse (note la plus haute) de la question affichée. */
const answerLast = () => {
  const dialog = within(screen.getByRole('dialog'));
  const question = dialog.getByRole('heading', { level: 2 }).textContent ?? '';
  const choices = dialog.getByRole('list', { name: question });
  fireEvent.click(within(choices).getAllByRole('button').at(-1)!);
};

/**
 * Ouvre le diagnostic, répond aux questions sur l'organisation, puis aux 7 leviers avec les
 * réponses les plus faibles, et passe l'écran de fin.
 */
function answerAll() {
  start();
  begin();
  answer(/Entreprise privée/);
  answer(/^Industrie$/);
  answer(/Moyenne entreprise, de 50 à 250 personnes/);
  answer(/Direction générale/);
  answer(/au fil des opportunités/);
  answer(/Les décisions remontent au dirigeant/);
  answer(/Chacun travaille selon son expérience/);
  answer(/selon ses propres repères/);
  answer(/contrôlent leur exécution/);
  answer(/Selon les personnes disponibles/);
  answer(/Par des formations ponctuelles/);
  answer(/Voir mon résultat/);
}

describe('Bandeau « Autodiagnostic 7S »', () => {
  afterEach(() => vi.restoreAllMocks());

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

    // L'écran d'accueil d'abord : le clavier n'y répond à aucune question.
    const welcome = within(dialog).getByRole('heading', { name: /Sept leviers font/ });
    await waitFor(() => expect(welcome).toHaveFocus());
    expect(welcome).toHaveTextContent(/Trois minutes pour savoir lequel la freine\./);
    expect(within(dialog).getByText('Dix questions, un résultat immédiat.')).toBeInTheDocument();
    expect(within(dialog).getAllByRole('listitem')).toHaveLength(3);
    const highlight = within(dialog).getByText('ralentir toute la mécanique');
    expect(highlight.tagName).toBe('STRONG');
    expect(highlight.parentElement).toHaveTextContent(
      'Un seul rouage grippé suffit à ralentir toute la mécanique.',
    );
    expect(within(dialog).getByText('Carte de votre organisation').parentElement).toHaveTextContent(
      '0 / 7',
    );
    fireEvent.keyDown(welcome, { key: 'a' });
    expect(welcome).toBeInTheDocument();

    // La carte : passer sur un levier le montre, le bouton arrête et reprend la ronde.
    const structure = within(dialog).getByText('Structure').closest('g')!;
    fireEvent.mouseEnter(structure);
    expect(within(dialog).getByText('Organisation et rôles')).toBeInTheDocument();
    answer(/Arrêter le défilement/);
    answer(/Reprendre le défilement/);
    begin();

    // Puis l'organisation. Question 1 en deux temps : le statut…
    const status = within(dialog).getByRole('heading', { name: /Quel est le statut/ });
    await waitFor(() => expect(status).toHaveFocus());
    expect(within(dialog).getByText(/Question 1 sur 3 sur votre organisation/)).toBeInTheDocument();
    // En haut : les trois étapes et « Question 1 sur 10 » ; pas de retour sur la 1re question.
    expect(within(dialog).getByText('Votre organisation')).toHaveAttribute('aria-current', 'step');
    expect(within(dialog).getByText('Question 1 sur 10')).toBeInTheDocument();
    expect(within(dialog).queryByRole('button', { name: /Question précédente/ })).toBeNull();
    expect(within(dialog).getByText('Choisissez la forme qui la décrit le mieux.')).toBeVisible();
    const statuses = within(within(dialog).getByRole('list', { name: /Quel est le statut/ }));
    expect(statuses.getAllByRole('button')).toHaveLength(7);
    answer(/Entreprise privée/);

    // … puis le secteur (15 réponses par famille), avec le rappel du statut et « Modifier ».
    const sector = within(dialog).getByRole('heading', { name: /Dans quel secteur/ });
    await waitFor(() => expect(sector).toHaveFocus());
    expect(within(dialog).getByText(/Question 1 sur 3 sur votre organisation/)).toBeInTheDocument();
    expect(within(dialog).getByText(/^Statut\s: Entreprise privée$/)).toBeInTheDocument();
    answer(/^Modifier$/);
    expect(screen.getByRole('button', { name: /Entreprise privée/ })).toHaveAttribute(
      'aria-current',
      'true',
    );
    answer(/Entreprise publique économique/);
    expect(
      within(dialog).getByText(/^Statut\s: Entreprise publique économique \(EPE\)$/),
    ).toBeInTheDocument();
    const families = within(dialog).getAllByRole('list', { name: /Dans quel secteur/ });
    expect(families).toHaveLength(6);
    expect(families.flatMap((list) => within(list).getAllByRole('button'))).toHaveLength(15);
    expect(
      within(dialog).getByRole('list', { name: /Dans quel secteur.*Commerce et services/ }),
    ).toHaveTextContent(/Banque, assurance et finance/);
    answer(/^Industrie$/);
    expect(within(dialog).getByText(/Question 2 sur 3 sur votre organisation/)).toBeInTheDocument();
    // Question 2 : la taille. Pour une EPE, la catégorie d'entreprise s'affiche.
    const size = within(dialog).getByRole('heading', { name: /Quelle est la taille/ });
    expect(within(dialog).getByText('Effectif total, tous sites confondus.')).toBeVisible();
    expect(
      within(within(dialog).getByRole('list', { name: /Quelle est la taille/ }))
        .getAllByRole('button')
        .map((button) => button.textContent),
    ).toEqual([
      'ATrès petite entreprise, de 1 à 9 personnes',
      'BPetite entreprise, de 10 à 49 personnes',
      'CMoyenne entreprise, de 50 à 250 personnes',
      'DGrande entreprise, plus de 250 personnes',
    ]);
    fireEvent.keyDown(size, { key: 'b' });

    // Question 3 : la fonction, 13 réponses.
    expect(within(dialog).getByText('Celle que vous exercez aujourd’hui.')).toBeVisible();
    const functions = within(
      within(dialog).getByRole('list', { name: /Quelle est votre fonction/ }),
    );
    expect(functions.getAllByRole('button')).toHaveLength(13);
    expect(functions.getByRole('button', { name: 'Systèmes d’information' })).toBeInTheDocument();
    answer(/Direction générale/);

    // Étape 2 : les leviers. « Étape 2 · Levier 1 sur 7 », intitulé, aide commune.
    const question = within(dialog).getByRole('heading', { name: /Vos équipes savent-elles/ });
    await waitFor(() => expect(question).toHaveFocus());
    expect(within(dialog).getByText('Sept leviers')).toHaveAttribute('aria-current', 'step');
    expect(within(dialog).getByText('Question 4 sur 10')).toBeInTheDocument();
    expect(
      within(dialog).getByText(/Étape 2 · Levier 1 sur 7 – Cap et priorités/),
    ).toBeInTheDocument();
    expect(
      within(dialog).getByText('Choisissez la situation la plus proche de la vôtre aujourd’hui.'),
    ).toBeVisible();
    const choices = within(within(dialog).getByRole('list', { name: /Vos équipes savent-elles/ }));
    expect(choices.getAllByRole('button').map((button) => button.textContent)).toEqual([
      'ANos orientations se décident au fil des opportunités, sans plan à plusieurs années.',
      'BLa direction a une vision à plusieurs années, encore peu partagée avec les équipes.',
      'CUn plan stratégique existe et les cadres le connaissent.',
      'DChacun connaît les objectifs qui le concernent et en suit l’avancement.',
    ]);

    fireEvent.keyDown(question, { key: 'c' });
    expect(within(dialog).getByRole('heading', { level: 2 })).toHaveTextContent(
      /chacun sait-il ce qu’il doit faire/,
    );
    expect(
      within(dialog).getByText(/Étape 2 · Levier 2 sur 7 – Organisation et rôles/),
    ).toBeInTheDocument();
    answer(/Question précédente/);
    expect(screen.getByRole('button', { name: /Un plan stratégique existe/ })).toHaveAttribute(
      'aria-current',
      'true',
    );

    // « Quitter » ramène à l'écran d'accueil ; « Fermer » y ferme le plein écran.
    answer(/^Quitter/);
    expect(within(dialog).getByRole('heading', { level: 2 })).toHaveTextContent(
      /Sept leviers font/,
    );
    answer(/^Fermer/);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('termine le questionnaire par un écran de fin, puis le résultat', async () => {
    renderHero();
    start();
    begin();
    answer(/Entreprise privée/);
    answer(/^Industrie$/);
    answer(/Moyenne entreprise/);
    answer(/Direction générale/);
    for (let index = 0; index < 7; index += 1) answerLast();

    const done = screen.getByRole('heading', {
      name: 'Merci, vos dix réponses sont enregistrées.',
    });
    await waitFor(() => expect(done).toHaveFocus());
    expect(screen.getByText('Votre résultat est prêt.')).toBeInTheDocument();
    expect(screen.getByText('Questionnaire terminé')).toBeInTheDocument();
    expect(screen.getByText('Votre résultat')).toHaveAttribute('aria-current', 'step');
    answer(/Question précédente/);
    expect(within(screen.getByRole('dialog')).getByRole('heading', { level: 2 })).toHaveTextContent(
      /compétences/,
    );
    answerLast();
    answer(/Voir mon résultat/);
    expect(screen.getByRole('heading', { name: 'L’organisation alignée' })).toBeInTheDocument();
  });

  it('affiche le résultat dans l’ordre : profil, empreinte, appuis, fragilités, commencer par, rôle', async () => {
    renderHero();
    answerAll();

    // 1. Votre profil (toutes les réponses à 0 : en fondation).
    const profile = screen.getByRole('heading', { name: 'L’organisation en fondation' });
    await waitFor(() => expect(profile).toHaveFocus());
    const dialog = within(screen.getByRole('dialog'));
    expect(
      dialog.getByText('Entreprise privée · Industrie · Moyenne entreprise, de 50 à 250 personnes'),
    ).toBeInTheDocument();
    expect(dialog.getByText(/La plupart des leviers restent à construire/)).toBeInTheDocument();
    const titles = dialog.getAllByRole('heading', { level: 3 }).map((h) => h.textContent);
    expect(titles).toEqual([
      'Votre empreinte',
      'Vos points d’appui',
      'Vos points de fragilité',
      'Commencer par',
      'Votre rôle',
      'Pour aller plus loin',
    ]);

    // 2. Votre empreinte : radar, niveau global, cadre et humain.
    expect(
      within(dialog.getByRole('figure', { name: /Le modèle des 7S/ })).getByText(
        /Stratégie – 0 sur 3/,
      ),
    ).toBeInTheDocument();
    expect(dialog.getByText(/Niveau 1 sur 4/).parentElement).toHaveTextContent(/Initial$/);
    expect(dialog.getByText(/Le cadre et l’humain avancent au même rythme/)).toBeInTheDocument();

    // 3. Aucun point d'appui ; 4. deux fragilités, avec leur constat et leur coût.
    expect(dialog.getByText(/Aucun levier n’est encore solide/)).toBeInTheDocument();
    const weak = dialog.getByRole('heading', { name: 'Vos points de fragilité' }).parentElement!;
    expect(
      within(weak)
        .getAllByRole('heading', { level: 4 })
        .map((h) => h.textContent),
    ).toEqual(['Cap et priorités', 'Organisation et rôles']);
    expect(
      within(weak).getByText(/Vos orientations se décident au fil des occasions/),
    ).toBeVisible();
    expect(within(weak).getByText(/Chaque occasion est saisie sans être choisie/)).toBeVisible();

    // 5. Commencer par : le cap, sa première action, l'indicateur, les phrases de taille et de
    // statut (pas de phrase de secteur : l'industrie ne porte pas sur le cap), le domaine.
    const startBlock = dialog.getByRole('heading', { name: 'Commencer par' }).closest('section')!;
    const block = within(startBlock as HTMLElement);
    expect(block.getByText('Cap et priorités')).toBeInTheDocument();
    expect(block.getByText(/Fixer trois orientations chiffrées à trois ans/)).toBeInTheDocument();
    expect(block.getByText(/Part des objectifs annuels déclinés/)).toBeInTheDocument();
    expect(
      block.getByText(/tout se joue chez les responsables intermédiaires/),
    ).toBeInTheDocument();
    expect(
      block.getByText(/Dans une entreprise privée, la décision est proche/),
    ).toBeInTheDocument();
    expect(block.queryByText(/Dans l’industrie et l’énergie/)).toBeNull();
    expect(block.getByRole('link', { name: /Études stratégiques/ })).toHaveAttribute(
      'href',
      '/expertises/etudes-strategiques',
    );
    expect(block.getByRole('link', { name: /Recevoir mon rapport/ })).toBeInTheDocument();

    // 6. Votre rôle : la phrase de la direction générale.
    expect(dialog.getByText(/En tant que dirigeant, vous êtes le premier levier/)).toBeVisible();

    // 7. Pour aller plus loin : consultant (réponses en paramètres), formulaire pré-rempli.
    expect(
      dialog.getByRole('link', { name: /Échanger avec un consultant/ }).getAttribute('href'),
    ).toMatch(
      /^\/contact\?source=autodiagnostic&statut=privee&secteur=industrie&effectif=50-250&fonction=direction&strategie=implicite&.*&profil=fondation&maturite=0$/,
    );
    expect(dialog.getByRole('textbox', { name: 'Fonction' })).toHaveValue('Direction générale');

    // « Revoir mes réponses » : première question, réponses conservées.
    answer(/Revoir mes réponses/);
    expect(screen.getByRole('heading', { name: /Quel est le statut/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Entreprise privée/ })).toHaveAttribute(
      'aria-current',
      'true',
    );

    answer(/^Quitter/);
    answer(/^Fermer/);
    expect(screen.queryByRole('dialog')).toBeNull();

    // Rouvert, il repart de l'écran d'accueil.
    start();
    expect(
      within(screen.getByRole('dialog')).getByText('Carte de votre organisation'),
    ).toBeVisible();
  });

  it('« Refaire le test » efface les réponses et ramène à l’accueil', () => {
    renderHero();
    answerAll();
    answer(/Refaire le test/);
    const dialog = within(screen.getByRole('dialog'));
    expect(dialog.getByRole('heading', { level: 2 })).toHaveTextContent(/Sept leviers font/);
    begin();
    expect(screen.getByRole('button', { name: /Entreprise privée/ })).not.toHaveAttribute(
      'aria-current',
    );
  });

  it('envoie la demande de rapport, et ne confirme qu’après la réponse du serveur', async () => {
    renderHero();
    answerAll();
    const dialog = within(screen.getByRole('dialog'));
    const fill = () => {
      fireEvent.change(dialog.getByRole('textbox', { name: 'Nom et prénom' }), {
        target: { value: 'Amina Benali' },
      });
      fireEvent.change(dialog.getByRole('textbox', { name: 'Organisation' }), {
        target: { value: 'Entreprise X' },
      });
      fireEvent.change(dialog.getByRole('textbox', { name: 'Adresse électronique' }), {
        target: { value: 'amina@example.com' },
      });
      fireEvent.click(dialog.getByRole('checkbox', { name: /m’adresser mon rapport/ }));
    };
    const submit = () =>
      fireEvent.submit(
        dialog.getByRole('button', { name: 'Recevoir mon rapport' }).closest('form')!,
      );

    // Échec du serveur : un message d'erreur, aucune confirmation.
    const failing = vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('réseau'));
    fill();
    submit();
    expect(await dialog.findByRole('alert')).toHaveTextContent(/L’envoi n’a pas abouti/);
    expect(dialog.queryByText(/vous sera adressé/)).toBeNull();

    // Réponse JSON du serveur : la confirmation, avec l'adresse saisie.
    failing.mockResolvedValueOnce(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    submit();
    expect(await dialog.findByRole('status')).toHaveTextContent(
      /Merci\. Votre rapport détaillé vous sera adressé à amina@example\.com\./,
    );
    const [url, init] = failing.mock.calls.at(-1)!;
    expect(url).toBe('/api/rapport');
    expect(JSON.parse(String(init?.body))).toMatchObject({
      contact: { name: 'Amina Benali', fonction: 'Direction générale', consultant: false },
      context: { statut: 'privee' },
      profile: 'fondation',
    });
  });

  it('ne montre que l’effectif aux statuts autres que l’EPE et l’entreprise privée', () => {
    renderHero();
    start();
    begin();
    answer(/^Association$/);
    answer(/^Santé$/);
    expect(
      within(screen.getByRole('list', { name: /Quelle est la taille/ }))
        .getAllByRole('button')
        .map((button) => button.textContent),
    ).toEqual([
      'ADe 1 à 9 personnes',
      'BDe 10 à 49 personnes',
      'CDe 50 à 250 personnes',
      'DPlus de 250 personnes',
    ]);
  });
});

describe('Calcul du résultat (règles d’OPEM)', () => {
  /** Réponses données par note : levier → 0 à 3. */
  const withScores = (notes: Partial<Record<DiagnosticAxis, number>>) =>
    Object.fromEntries(
      heroDiagnostic.questions.map((question) => [
        question.id,
        question.choices[notes[question.id] ?? 0]?.id ?? '',
      ]),
    );
  const all = (note: number) =>
    withScores(Object.fromEntries(heroDiagnostic.questions.map(({ id }) => [id, note])));

  it('tout à 3 : organisation alignée, niveau avancé, deux points d’appui', () => {
    expect(scoreDiagnostic(heroDiagnostic, all(3))).toMatchObject({
      total: 21,
      percent: 100,
      profile: 'alignee',
      level: 3,
      strengths: ['strategie', 'structure'],
      weak: [],
      start: 'strategie',
    });
  });

  it('tout à 0 : en fondation, aucun point d’appui, fragilités selon la priorité', () => {
    expect(scoreDiagnostic(heroDiagnostic, all(0))).toMatchObject({
      total: 0,
      profile: 'fondation',
      level: 0,
      strengths: [],
      weak: ['strategie', 'structure'],
      start: 'strategie',
    });
  });

  it('cap à 0 ou 1, le reste solide : navire sans cap', () => {
    const notes = withScores({
      strategie: 1,
      structure: 2,
      systemes: 2,
      valeurs: 2,
      style: 2,
      personnel: 1,
      competences: 2,
    });
    expect(scoreDiagnostic(heroDiagnostic, notes)).toMatchObject({
      profile: 'cap',
      weak: ['strategie', 'personnel'],
      start: 'strategie',
    });
  });

  it('cadre devant l’humain : belle mécanique ; l’inverse : talent sans charpente', () => {
    const frame = withScores({ strategie: 3, structure: 3, systemes: 3, valeurs: 1 });
    expect(scoreDiagnostic(heroDiagnostic, frame)).toMatchObject({
      profile: 'mecanique',
      hard: 100,
      balance: 'hard',
      strengths: ['strategie', 'structure'],
      // Égalité à 0 : compétences, style, équipes, puis culture.
      weak: ['competences', 'style'],
      start: 'competences',
    });
    const people = withScores({
      strategie: 2,
      structure: 0,
      systemes: 1,
      valeurs: 3,
      style: 3,
      personnel: 3,
      competences: 3,
    });
    expect(scoreDiagnostic(heroDiagnostic, people)).toMatchObject({
      profile: 'talents',
      balance: 'soft',
      strengths: ['valeurs', 'style'],
      weak: ['structure', 'systemes'],
    });
  });

  it('moyenne d’au moins 1,5 sans autre règle : en mouvement ; sans fragilité, le plus faible', () => {
    expect(scoreDiagnostic(heroDiagnostic, all(2))).toMatchObject({
      total: 14,
      profile: 'mouvement',
      level: 2,
      strengths: ['strategie', 'structure'],
      weak: [],
      start: 'strategie',
    });
  });

  it('un seul levier noté 3 : complété par le premier noté 2, dans l’ordre des leviers', () => {
    const notes = withScores({ strategie: 1, structure: 2, valeurs: 3, style: 2 });
    expect(scoreDiagnostic(heroDiagnostic, notes).strengths).toEqual(['structure', 'valeurs']);
  });

  it('niveau global lu sur le total', () => {
    const level = (total: number) => {
      const notes: Partial<Record<DiagnosticAxis, number>> = {};
      let left = total;
      for (const { id } of heroDiagnostic.questions) {
        notes[id] = Math.min(3, left);
        left -= notes[id];
      }
      return scoreDiagnostic(heroDiagnostic, withScores(notes)).level;
    };
    expect([0, 5, 6, 10, 11, 16, 17, 21].map(level)).toEqual([0, 0, 1, 1, 2, 2, 3, 3]);
  });
});
