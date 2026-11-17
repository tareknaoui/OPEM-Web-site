import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LanguageSwitcher } from '@/app/layouts/navbar/LanguageSwitcher';
import { LanguageProvider } from '@/i18n/LanguageProvider';
import { ARTWORK } from './art';
import { showcaseLabels, SHOWCASE_IDS, findShowcase } from './content';
import { sessionDates } from './dates';
import TrainingShowcasePage from './TrainingShowcasePage';

vi.mock('@/lib/env', () => ({
  env: { appName: 'OPEM', apiUrl: '/api', wpApiUrl: 'https://wp.example/wp-json', isDev: false },
}));

function renderPage(id = 'diagnostic-d-organisation') {
  const Page = () => (
    <>
      <LanguageSwitcher />
      <TrainingShowcasePage />
    </>
  );
  const router = createMemoryRouter(
    [{ path: '/formation/fiches-formation/:id', Component: Page }],
    { initialEntries: [`/formation/fiches-formation/${id}`] },
  );
  return render(
    <LanguageProvider>
      <RouterProvider router={router} />
    </LanguageProvider>,
  );
}

let fetchMock: ReturnType<typeof vi.fn>;

describe('Page d’une formation (modèle unique)', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-11-17T10:00:00'));
    fetchMock = vi.fn(async () => new Response('{"ok":true}', { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    // jsdom ne fait pas défiler : le défilement vers le formulaire est neutralisé.
    Element.prototype.scrollIntoView = vi.fn();
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('le haut de page : accroche, titre, promesse, boutons et carte de la session', () => {
    renderPage();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Diagnostic d’organisation',
    );
    expect(screen.getByText('Formation inter-entreprises · Alger')).toBeInTheDocument();
    expect(screen.getByText('Le blocage est souvent dans l’organisation.')).toBeInTheDocument();
    expect(screen.getByText('Repérer les blocages, optimiser les processus.')).toBeInTheDocument();
    const art = screen.getByRole('img', { name: /un consultant examine à la loupe/ });
    expect(art.querySelector('img')).toHaveAttribute(
      'src',
      '/images/formations/diagnostic-d-organisation.webp',
    );
    expect(art.querySelectorAll('circle animateMotion').length).toBe(8);

    const facts = screen.getByText('Durée').closest('dl');
    expect(facts).not.toBeNull();
    const session = within(facts as HTMLElement);
    expect(session.getByText('4 jours')).toBeInTheDocument();
    expect(session.getByText('06 au 09 déc. 2026')).toBeInTheDocument();
    expect(session.getByText('12 participants')).toBeInTheDocument();
    expect(session.getByText('École OPEM, Alger')).toBeInTheDocument();

    for (const name of ['Recevoir la fiche technique détaillée', 'Demander un devis']) {
      expect(screen.getByRole('link', { name })).toHaveAttribute('href', '#demande');
    }
  });

  it('la structure commune : rubriques, fil d’Ariane et liens', () => {
    renderPage();
    expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual([
      'Pourquoi cette formation',
      'Vous repartez avec',
      'Pour qui',
      'Pourquoi OPEM',
      'Témoignages',
      'Recevez la fiche technique détaillée',
      'D’autres formations à venir',
    ]);
    const crumbs = within(screen.getByRole('navigation', { name: 'Fil d’Ariane' }));
    expect(crumbs.getByRole('link', { name: 'Formation qualifiante' })).toHaveAttribute(
      'href',
      '/formation',
    );
    expect(crumbs.getByRole('link', { name: 'Catalogue et sessions' })).toHaveAttribute(
      'href',
      '/formation/catalogue-et-sessions',
    );
    expect(
      screen.getByRole('link', {
        name: /^Confier le diagnostic à nos consultants\s: accompagnement des organisations ›$/,
      }),
    ).toHaveAttribute(
      'href',
      '/expertises/accompagnement-des-organisations/diagnostic-d-entreprise',
    );
    expect(screen.getByRole('link', { name: 'Découvrir le cabinet ›' })).toHaveAttribute(
      'href',
      '/le-cabinet',
    );
    expect(
      screen.getByRole('link', { name: 'Voir nos missions et réalisations ›' }),
    ).toHaveAttribute('href', '/missions');
    expect(screen.getAllByText('D02-26.INTER.01. V1').length).toBeGreaterThanOrEqual(1);
  });

  it('n’affiche ni tarif ni programme détaillé', () => {
    renderPage();
    const text = document.body.textContent ?? '';
    expect(text).not.toMatch(/\bDA\b|dinars? HT|tarif\s*:|prix/i);
    expect(text).not.toMatch(/Module 1|Jour 1/);
  });

  it('chaque formation a sa page, son illustration et ses propres témoignages', () => {
    const quotes = new Set<string>();
    const counts: Record<string, number> = {};
    for (const id of SHOWCASE_IDS) {
      const item = findShowcase('fr', id);
      expect(ARTWORK[id]).toBeDefined();
      counts[id] = item?.voices.length ?? 0;
      for (const voice of item?.voices ?? []) {
        expect(quotes.has(voice.quote)).toBe(false);
        quotes.add(voice.quote);
      }
    }
    expect(counts).toEqual({
      'diagnostic-d-organisation': 3,
      'plan-de-formation-2027': 1,
      'cybersecurite-operationnelle': 2,
    });

    const { unmount } = renderPage('plan-de-formation-2027');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Plan de formation 2027');
    expect(screen.getByText('08 au 10 déc. 2026')).toBeInTheDocument();
    expect(screen.getByText(/98 % de satisfaction à chaud/)).toBeInTheDocument();
    unmount();

    renderPage('cybersecurite-operationnelle');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Cybersécurité opérationnelle',
    );
    expect(screen.getByText('13 au 17 déc. 2026')).toBeInTheDocument();
    expect(screen.getByText(/Pédagogie au top/)).toBeInTheDocument();
  });

  it('les dates : mois abrégé, sur une ligne', () => {
    const range = showcaseLabels.fr.range;
    const plain = (text: string) => text.replace(/\s/g, ' ');
    expect(plain(sessionDates('2026-12-06', '2026-12-09', 'fr-FR', range))).toBe(
      '06 au 09 déc. 2026',
    );
    expect(plain(sessionDates('2026-11-29', '2026-12-02', 'fr-FR', range))).toBe(
      '29 nov. au 02 déc. 2026',
    );
    expect(plain(sessionDates('2026-12-29', '2027-01-02', 'fr-FR', range))).toBe(
      '29 déc. 2026 au 02 janv. 2027',
    );
  });

  it('« Demander un devis » coche la demande de devis dans le formulaire', () => {
    renderPage();
    const quote = screen.getByRole('checkbox', { name: 'un devis' });
    expect(screen.getByRole('checkbox', { name: 'la fiche technique détaillée' })).toBeChecked();
    expect(quote).not.toBeChecked();
    fireEvent.click(screen.getByRole('link', { name: 'Demander un devis' }));
    expect(quote).toBeChecked();
  });

  it('le formulaire : contrôles, envoi au service formation, confirmation', async () => {
    renderPage();
    const submit = screen.getByRole('button', { name: 'Envoyer ma demande' });
    fireEvent.click(screen.getByRole('checkbox', { name: 'la fiche technique détaillée' }));
    fireEvent.click(submit);
    expect(screen.getByText('Cochez au moins une case.')).toBeInTheDocument();
    expect(screen.getAllByText('Ce champ est obligatoire.').length).toBe(6);
    expect(fetchMock).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('checkbox', { name: 'un devis' }));
    const fill = (label: RegExp, value: string) =>
      fireEvent.change(screen.getByLabelText(label), { target: { value } });
    fill(/^Nom et prénom/, 'Amina Benali');
    fill(/^Fonction/, 'Directrice des ressources humaines');
    fill(/^Nombre de participants envisagé/, 'trois');
    fill(/^Organisme/, 'Entreprise exemple');
    fill(/^E-mail professionnel/, 'amina@exemple.dz');
    fill(/^Téléphone/, '0550 12 34 56');
    fireEvent.click(screen.getByRole('checkbox', { name: /^Consentement/ }));
    fireEvent.click(submit);
    expect(
      screen.getByText('Indiquez un nombre de participants, par exemple 3.'),
    ).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();

    fill(/^Nombre de participants envisagé/, '3');
    fireEvent.click(submit);
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('https://wp.example/wp-json/opem/v1/demande-formation');
    const body = init.body as FormData;
    expect(body.get('formation')).toBe('diagnostic-d-organisation');
    expect(body.get('reference')).toBe('D02-26.INTER.01. V1');
    expect(body.get('wantSheet')).toBe('');
    expect(body.get('wantQuote')).toBe('1');
    expect(body.get('participants')).toBe('3');
    expect(body.get('phoneCode')).toBe('+213');
    expect(body.get('consent')).toBe('1');
    expect(body.get('newsletter')).toBe('');
    expect(
      await screen.findByText(
        'Merci, votre demande nous est bien parvenue. Notre service formation l’examine et vous contacte.',
      ),
    ).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Envoyer ma demande' })).toBeNull();
  });

  it('masque le bandeau d’appel du pied de page tant qu’elle est affichée', () => {
    const { unmount } = renderPage();
    expect(document.documentElement).toHaveAttribute('data-footer-cta', 'off');
    unmount();
    expect(document.documentElement).not.toHaveAttribute('data-footer-cta');
  });

  it('une formation sans page : la page « Formation qualifiante »', () => {
    renderPage('iso-9001-2026');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Une compétence se construit, puis s’éprouve au travail.',
    );
  });

  it('passe en arabe', () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: 'عربي' }));
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('تشخيص التنظيم');
    expect(screen.getByRole('button', { name: 'أرسلوا طلبي' })).toBeInTheDocument();
  });
});
