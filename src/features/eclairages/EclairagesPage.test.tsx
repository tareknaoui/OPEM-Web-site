import { fireEvent, render, screen, within } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LanguageSwitcher } from '@/app/layouts/navbar/LanguageSwitcher';
import { LanguageProvider } from '@/i18n/LanguageProvider';
import EclairagesPage from './EclairagesPage';

vi.mock('@/lib/env', () => ({
  env: { appName: 'OPEM', apiUrl: '/api', wpApiUrl: 'https://wp.example/wp-json', isDev: false },
}));

function renderPage(url = '/eclairages') {
  const Page = () => (
    <>
      <LanguageSwitcher />
      <EclairagesPage />
    </>
  );
  const router = createMemoryRouter([{ path: '*', Component: Page }], { initialEntries: [url] });
  render(
    <LanguageProvider>
      <RouterProvider router={router} />
    </LanguageProvider>,
  );
  return router;
}

let fetchMock: ReturnType<typeof vi.fn>;
beforeEach(() => {
  fetchMock = vi.fn(async () => new Response('{"ok":true}', { status: 200 }));
  vi.stubGlobal('fetch', fetchMock);
});
afterEach(() => vi.unstubAllGlobals());

const featuredTitle = () => screen.getAllByRole('heading', { level: 2 })[0]?.textContent;

describe('Page « Éclairages »', () => {
  it('titre de l’accueil, thèmes de l’accueil, éclairage à la une et grille', () => {
    renderPage();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Des analyses pour décider en connaissance de cause.',
    );
    const themes = screen.getByRole('navigation', { name: 'Explorer par thème' });
    expect(
      within(themes)
        .getAllByRole('button')
        .map((button) => button.firstChild?.textContent),
    ).toEqual([
      'Tous les thèmes',
      'Études stratégiques',
      'Accompagnement des organisations',
      'Formation qualifiante',
      'Coaching professionnel',
      'Certification et accréditation',
      'Communication institutionnelle',
      'IA appliquée',
    ]);
    expect(featuredTitle()).toBe('Les signaux d’une organisation qui s’essouffle');
    expect(
      screen.getByRole('heading', { level: 3, name: /Plan de formation annuel/ }),
    ).toBeVisible();
    expect(screen.getByText('3 éclairages')).toBeInTheDocument();
  });

  it('un thème filtre la page et s’inscrit dans l’adresse', () => {
    const router = renderPage();
    fireEvent.click(screen.getByRole('button', { name: /^IA appliquée/ }));
    expect(router.state.location.search).toBe('?theme=ia');
    expect(featuredTitle()).toMatch(/^Intégrer l’IA\s:\scommencer par l’organisation/);
    expect(screen.queryByRole('heading', { level: 3 })).toBeNull();
    expect(screen.getByRole('button', { name: /^IA appliquée/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('thème sans éclairage : un message, et une porte pour poser sa question', () => {
    renderPage('/eclairages?theme=coaching');
    expect(screen.getByText('Pas encore d’éclairage sur ce thème.')).toBeInTheDocument();
    const [ask] = screen.getAllByRole('link', { name: /Posez-la-nous/ });
    expect(ask).toHaveAttribute('href', '/contact');
  });

  it('trois questions fréquentes de l’accueil', () => {
    renderPage();
    expect(
      screen.getByRole('heading', { name: 'Dix questions, des réponses sans détour.' }),
    ).toBeInTheDocument();
    expect(document.querySelectorAll('details')).toHaveLength(3);
  });

  it('inscription : accord obligatoire, puis envoi à la liste de diffusion', async () => {
    renderPage();
    fireEvent.change(screen.getByLabelText('Votre adresse de courriel'), {
      target: { value: 'lecteur@exemple.dz' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'M’inscrire' }));
    expect(screen.getByText('Cochez cette case pour vous inscrire.')).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();

    fireEvent.click(screen.getByLabelText(/Je souhaite recevoir les éclairages d’OPEM/));
    fireEvent.click(screen.getByRole('button', { name: 'M’inscrire' }));
    expect(await screen.findByText(/Merci, votre inscription est enregistrée/)).toBeInTheDocument();
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('https://wp.example/wp-json/opem/v1/inscription');
    expect((init.body as FormData).get('email')).toBe('lecteur@exemple.dz');
  });

  it('passe en arabe', () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: 'عربي' }));
    expect(screen.getByRole('navigation', { name: 'تصفّح حسب الموضوع' })).toBeInTheDocument();
  });
});
