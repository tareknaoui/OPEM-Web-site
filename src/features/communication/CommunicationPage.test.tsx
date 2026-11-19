import { fireEvent, render, screen, within } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';
import { LanguageSwitcher } from '@/app/layouts/navbar/LanguageSwitcher';
import { LanguageProvider } from '@/i18n/LanguageProvider';
import CommunicationPage from './CommunicationPage';
import { CRAFT_IDS } from './content';

function renderPage(path = '/expertises/communication-institutionnelle') {
  const Page = () => (
    <>
      <LanguageSwitcher />
      <CommunicationPage />
    </>
  );
  const router = createMemoryRouter(
    [{ path: '/expertises/communication-institutionnelle/*', Component: Page }],
    { initialEntries: [path] },
  );
  return render(
    <LanguageProvider>
      <RouterProvider router={router} />
    </LanguageProvider>,
  );
}

describe('Page « Communication institutionnelle »', () => {
  it('l’accroche en titre, deux actions, des images décrites', () => {
    renderPage();
    expect(screen.getByRole('heading', { level: 1 }).textContent?.replace(/\s/g, ' ')).toBe(
      'Soigner son image, c’est respecter ses clients.',
    );
    expect(screen.getByRole('link', { name: /Parlons de votre image/ })).toHaveAttribute(
      'href',
      '/contact/demande-de-rendez-vous',
    );
    expect(screen.getByRole('link', { name: 'Voir nos réalisations' })).toHaveAttribute(
      'href',
      '#realisations',
    );
    const images = screen.getAllByRole('img').filter((img) => img.tagName === 'IMG');
    expect(images.length).toBeGreaterThanOrEqual(10);
    images.forEach((img) => expect(img.getAttribute('alt')).toBeTruthy());
  });

  it('les sept savoir-faire portent les ancres des sous-rubriques', () => {
    renderPage('/expertises/communication-institutionnelle/sites-web');
    CRAFT_IDS.forEach((id) => expect(document.getElementById(id)).toBeInTheDocument());
    const crafts = screen.getByRole('region', { name: 'Sept savoir-faire, une seule signature.' });
    expect(within(crafts).getAllByRole('heading', { level: 3 })).toHaveLength(7);
    // Les sites web sont montrés par la capture du site d'OPEM.
    expect(document.getElementById('sites-web')?.querySelector('img')).toHaveAttribute(
      'src',
      '/images/actualites/nouveau-site-700.webp',
    );
  });

  it('les réalisations : les logos de la SAPTA et de la SNTP, puis le site d’OPEM', () => {
    renderPage();
    const works = screen.getByRole('region', { name: 'Notre signature s’y lit.' });
    expect(within(works).getByRole('img', { name: 'SAPTA' })).toBeInTheDocument();
    expect(
      within(works).getByRole('img', { name: 'Société Nationale de Travaux Publics (SNTP)' }),
    ).toBeInTheDocument();
    expect(within(works).getByRole('heading', { name: 'Le site d’OPEM' })).toBeInTheDocument();
  });

  it('la méthode, les raisons et les questions fréquentes', () => {
    renderPage();
    const method = screen.getByRole('region', { name: 'Du premier entretien au support livré.' });
    expect(within(method).getAllByRole('listitem')).toHaveLength(5);
    expect(screen.getByRole('heading', { name: 'Bilingue, naturellement' })).toBeInTheDocument();
    expect(screen.getByText(/Rédigez-vous aussi les textes/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^Téléphone 06/ })).toBeInTheDocument();
  });

  it('passe en arabe', () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: 'عربي' }));
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'العناية بالصورة احترامٌ للزبائن.',
    );
  });
});
