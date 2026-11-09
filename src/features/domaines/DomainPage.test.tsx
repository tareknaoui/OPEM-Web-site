import { fireEvent, render, screen, within } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';
import { LanguageSwitcher } from '@/app/layouts/navbar/LanguageSwitcher';
import { LanguageProvider } from '@/i18n/LanguageProvider';
import DomainPage from './DomainPage';

function renderPage(path: string) {
  const Page = () => (
    <>
      <LanguageSwitcher />
      <DomainPage />
    </>
  );
  const router = createMemoryRouter([{ path: '/expertises/:domain/*', Component: Page }], {
    initialEntries: [path],
  });
  return render(
    <LanguageProvider>
      <RouterProvider router={router} />
    </LanguageProvider>,
  );
}

describe('Pages des domaines d’expertise', () => {
  it.each([
    [
      'accompagnement-des-organisations',
      'Une organisation se transforme par chantiers successifs.',
    ],
    ['coaching-professionnel', 'Plus on dirige, moins on est contredit.'],
    ['communication-institutionnelle', 'Soigner son image, c’est respecter ses clients.'],
    ['certification-et-accreditation', 'Un certificat rassure ; une pratique convainc.'],
  ])('%s : l’accroche en titre, les prestations, la démarche, une photo décrite', (id, title) => {
    renderPage(`/expertises/${id}`);
    expect(screen.getByRole('heading', { level: 1 }).textContent?.replace(/\s/g, ' ')).toBe(title);
    const services = screen.getByRole('region', { name: 'Nos prestations' });
    expect(within(services).getAllByRole('listitem').length).toBeGreaterThanOrEqual(4);
    expect(
      screen.getByRole('heading', { name: 'Quatre temps, quatre engagements.' }),
    ).toBeInTheDocument();
    screen.getAllByRole('img').forEach((img) => expect(img.getAttribute('alt')).toBeTruthy());
    // Pour nous contacter : en haut de page, puis le bloc « Premier échange » au pied.
    const quotes = screen.getAllByRole('link', { name: /Parlons de votre projet/ });
    expect(quotes).toHaveLength(2);
    quotes.forEach((link) =>
      expect(link).toHaveAttribute('href', '/contact/demande-de-rendez-vous'),
    );
    expect(screen.getByRole('link', { name: /Appeler le/ })).toBeInTheDocument();
  });

  it('accompagnement : ses missions et l’ancre de la sous-rubrique « Diagnostic d’entreprise »', () => {
    renderPage('/expertises/accompagnement-des-organisations/diagnostic-d-entreprise');
    expect(document.getElementById('diagnostic-d-entreprise')).toHaveTextContent(
      'Diagnostic d’entreprise',
    );
    const references = screen.getByRole('region', { name: 'Ils nous ont fait confiance.' });
    expect(within(references).getAllByRole('heading', { level: 3 }).length).toBeGreaterThan(0);
    expect(
      within(references).getByRole('link', { name: 'Toutes nos études de cas' }),
    ).toHaveAttribute('href', '/missions');
  });

  it('coaching : sans mission publiée, l’engagement seul', () => {
    renderPage('/expertises/coaching-professionnel');
    expect(screen.queryByRole('link', { name: 'Voir nos études de cas' })).not.toBeInTheDocument();
    expect(screen.getByText(/Un interlocuteur de confiance/)).toBeInTheDocument();
  });

  it('un domaine inconnu affiche « page introuvable »', () => {
    renderPage('/expertises/inconnu');
    expect(screen.queryByRole('region', { name: 'Nos prestations' })).not.toBeInTheDocument();
  });

  it('passe en arabe', () => {
    renderPage('/expertises/certification-et-accreditation');
    fireEvent.click(screen.getByRole('button', { name: 'عربي' }));
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'الشهادة تطمئن؛ والممارسة تقنع.',
    );
  });
});
