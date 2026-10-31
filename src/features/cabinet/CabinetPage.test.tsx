import { fireEvent, render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';
import { LanguageSwitcher } from '@/app/layouts/navbar/LanguageSwitcher';
import { LanguageProvider } from '@/i18n/LanguageProvider';
import CabinetPage from './CabinetPage';

function renderCabinet() {
  const Page = () => (
    <>
      <LanguageSwitcher />
      <CabinetPage />
    </>
  );
  const router = createMemoryRouter([{ path: '*', Component: Page }]);
  return render(
    <LanguageProvider>
      <RouterProvider router={router} />
    </LanguageProvider>,
  );
}

describe('Page « Le cabinet »', () => {
  it('présente le cabinet, sa démarche, ses valeurs, son équipe et ses garanties', () => {
    renderCabinet();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Conseil, études et formation, au service de votre performance.',
    );
    const titles = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    expect(titles).toEqual([
      'Qui nous sommes',
      'Trois niveaux, de l’expertise à la mise en œuvre.',
      'Six valeurs qui guident chaque mission.',
      'Une direction engagée, un réseau au-delà de nos frontières.',
      'Une formation agréée et suivie de près.',
    ]);
    expect(screen.getByText('Animer jusqu’à la décision')).toBeInTheDocument();
    expect(screen.getByText('Houda Bourahla')).toBeInTheDocument();
  });

  it('ne répète pas l’accueil : ni chiffres ni liste des domaines', () => {
    renderCabinet();
    expect(screen.queryByRole('list', { name: 'OPEM en quelques chiffres' })).toBeNull();
    expect(screen.queryByRole('link', { name: 'Études stratégiques' })).toBeNull();
  });

  it('garde le manifeste entier pour les lecteurs d’écran', () => {
    renderCabinet();
    // Manifeste découpé mot à mot : le paragraphe garde sa phrase entière.
    const statement = screen.getByText(
      (_, element) => element?.tagName === 'P' && /^Chaque organisation/.test(element.textContent),
    );
    expect(statement).toHaveTextContent(/construisons avec vos équipes, pas à leur place\.$/);
  });

  it('signale les contenus à faire valider par OPEM', () => {
    renderCabinet();
    expect(screen.getByText(/textes d’explication proposés, à valider/)).toBeInTheDocument();
    expect(screen.getByText(/Informations du catalogue 2021/)).toBeInTheDocument();
  });

  it('passe en arabe', () => {
    renderCabinet();
    fireEvent.click(screen.getByRole('button', { name: 'العربية' }));
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('في خدمة أدائكم.');
  });
});
