import { fireEvent, render, screen, within } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';
import { LanguageSwitcher } from '@/app/layouts/navbar/LanguageSwitcher';
import { LanguageProvider } from '@/i18n/LanguageProvider';
import CoachingPage from './CoachingPage';
import { OFFER_IDS } from './content';

function renderPage(path = '/expertises/coaching-professionnel') {
  const Page = () => (
    <>
      <LanguageSwitcher />
      <CoachingPage />
    </>
  );
  const router = createMemoryRouter(
    [{ path: '/expertises/coaching-professionnel/*', Component: Page }],
    { initialEntries: [path] },
  );
  return render(
    <LanguageProvider>
      <RouterProvider router={router} />
    </LanguageProvider>,
  );
}

describe('Page « Coaching professionnel »', () => {
  it('l’accroche en titre, deux actions, des photos décrites', () => {
    renderPage();
    expect(screen.getByRole('heading', { level: 1 }).textContent?.replace(/\s/g, ' ')).toBe(
      'Plus on dirige, moins on est contredit.',
    );
    // Rendez-vous en haut de page, puis au pied (« Premier échange »).
    const talk = screen.getByRole('link', { name: /Parlons de votre situation/ });
    expect(talk).toHaveAttribute('href', '/contact/demande-de-rendez-vous');
    expect(screen.getByRole('link', { name: 'Comment se déroule un coaching' })).toHaveAttribute(
      'href',
      '#deroulement',
    );
    const photos = screen.getAllByRole('img').filter((img) => img.tagName === 'IMG');
    expect(photos.length).toBeGreaterThanOrEqual(7);
    photos.forEach((img) => expect(img.getAttribute('alt')).toBeTruthy());
  });

  it('cinq paroles, chacune reliée à l’accompagnement qui y répond', () => {
    renderPage();
    const situations = screen.getByRole('region', {
      name: 'Chaque coaching commence par une phrase comme celles-ci.',
    });
    const links = within(situations).getAllByRole('link');
    expect(links.map((link) => link.getAttribute('href'))).toEqual(OFFER_IDS.map((id) => `#${id}`));
  });

  it('les cinq accompagnements portent les ancres des sous-rubriques', () => {
    renderPage('/expertises/coaching-professionnel/coaching-de-managers');
    OFFER_IDS.forEach((id) => expect(document.getElementById(id)).toBeInTheDocument());
    expect(document.getElementById('coaching-de-managers')).toHaveTextContent(
      'Coaching de managers',
    );
    const offers = screen.getByRole('region', { name: 'Cinq accompagnements, une même exigence.' });
    expect(within(offers).getAllByRole('heading', { level: 3 })).toHaveLength(5);
  });

  it('le déroulement, les engagements et les questions fréquentes', () => {
    renderPage();
    const journey = screen.getByRole('region', {
      name: 'Un coaching a un début, un cap et une fin.',
    });
    expect(within(journey).getAllByRole('listitem')).toHaveLength(4);
    expect(screen.getByRole('heading', { name: 'Confidentialité' })).toBeInTheDocument();
    expect(screen.getByText(/Qu’apprend mon employeur/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^Téléphone 06/ })).toBeInTheDocument();
  });

  it('passe en arabe', () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: 'عربي' }));
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'كلّما ارتقيتم في القيادة، قلّ من يعارضكم.',
    );
  });
});
