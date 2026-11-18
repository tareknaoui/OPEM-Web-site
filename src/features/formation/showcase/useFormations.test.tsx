import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LanguageProvider } from '@/i18n/LanguageProvider';
import TrainingShowcasePage from './TrainingShowcasePage';
import { parseFormations } from './wordpress';

vi.mock('@/lib/env', () => ({
  env: { appName: 'OPEM', apiUrl: '/api', wpApiUrl: 'https://wp.example/wp-json', isDev: false },
}));

/** Une formation telle que la renvoie wordpress/opem-formations-api.php. */
const FROM_WORDPRESS = {
  id: 'gestion-de-projet',
  reference: 'D20-26.INTER.01. V1',
  start: '2027-01-10',
  end: '2027-01-12',
  seats: 15,
  theme: 'cybersecurite-operationnelle',
  linkHref: '/expertises/accompagnement-des-organisations',
  title: 'Gestion de projet',
  promise: 'Cadrer, piloter, livrer.',
  cycle: 'Cycle Management',
  topic: 'Management',
  duration: '3 jours',
  place: 'École OPEM',
  city: 'Oran',
  format: 'Présentiel · Oran · 3 jours',
  hookQuestion: 'Vos projets dérapent ?',
  hookAnswer: 'Le cadrage fait la différence.',
  whyText: 'Des délais qui glissent : cette formation vous donne la méthode.',
  whyEdge: 'des outils prêts à l’emploi.',
  linkLabel: 'Confier vos projets à nos consultants',
  gains: ['Une méthode de cadrage.', 'Un tableau de bord.', 'Un plan de communication.'],
  audience: 'Chefs de projet et responsables de service.',
  reasons: ['Une méthode éprouvée ;', 'des cas réels ;', 'un formateur praticien.'],
  voices: [],
  alt: '',
};

function renderPage(id: string) {
  const router = createMemoryRouter(
    [{ path: '/formation/fiches-formation/:id', Component: TrainingShowcasePage }],
    { initialEntries: [`/formation/fiches-formation/${id}`] },
  );
  return render(
    <LanguageProvider>
      <RouterProvider router={router} />
    </LanguageProvider>,
  );
}

describe('Formations saisies dans WordPress', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-11-17T10:00:00'));
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) =>
        url.includes('/opem/v1/formations')
          ? new Response(JSON.stringify([FROM_WORDPRESS]), {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            })
          : new Response('{}', { status: 200 }),
      ),
    );
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('une nouvelle formation a sa page, avec le même modèle et l’illustration choisie', async () => {
    renderPage('gestion-de-projet');
    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent('Gestion de projet');
    expect(screen.getByText('Formation inter-entreprises · Oran')).toBeInTheDocument();
    // Les dates viennent de sa session, ajoutée à l'agenda.
    expect(screen.getAllByText(/10 au 12 janv\. 2027/).length).toBeGreaterThan(0);
    const art = screen.getByRole('img', { name: /Illustration/ });
    expect(art.querySelector('img')).toHaveAttribute(
      'src',
      '/images/formations/cybersecurite-operationnelle.webp',
    );
    // Sans témoignage : pas de section Témoignages.
    expect(screen.queryByRole('heading', { name: 'Témoignages' })).not.toBeInTheDocument();
    // Les autres formations de l'agenda restent proposées en bas de page.
    expect(screen.getByRole('link', { name: /Diagnostic d’organisation/ })).toBeInTheDocument();
  });

  it('écarte les réponses incomplètes ou dangereuses, et corrige la typographie', () => {
    const [ok, ...rest] = parseFormations(
      [
        {
          ...FROM_WORDPRESS,
          linkHref: ['javascript', 'alert(1)'].join(':'),
          start: '2027-13',
          seats: 5000,
        },
        { ...FROM_WORDPRESS, id: '../admin' },
        { ...FROM_WORDPRESS, id: 'sans-texte', whyText: '' },
        'n’importe quoi',
      ],
      'fr',
    );
    expect(rest).toHaveLength(0);
    expect(ok?.showcase.why.link?.href).toBe('/formation');
    expect(ok?.showcase.seats).toBe(12);
    expect(ok?.session).toBeNull();
    expect(ok?.showcase.hook.question).toBe('Vos projets dérapent ?');
    expect(ok?.showcase.duration).toBe('3 jours');
    expect(parseFormations({ not: 'a list' }, 'fr')).toEqual([]);
  });
});
