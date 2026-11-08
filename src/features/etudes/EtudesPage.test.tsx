import { fireEvent, render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';
import { LanguageSwitcher } from '@/app/layouts/navbar/LanguageSwitcher';
import { LanguageProvider } from '@/i18n/LanguageProvider';
import EtudesPage from './EtudesPage';

function renderPage() {
  const Page = () => (
    <>
      <LanguageSwitcher />
      <EtudesPage />
    </>
  );
  const router = createMemoryRouter([{ path: '*', Component: Page }]);
  return render(
    <LanguageProvider>
      <RouterProvider router={router} />
    </LanguageProvider>,
  );
}

describe('Page « Études stratégiques »', () => {
  it('bloc 01 : surtitre, titre principal unique et texte mot pour mot', () => {
    renderPage();
    expect(screen.getByText('Études stratégiques', { selector: 'p' })).toBeInTheDocument();
    const h1 = screen.getAllByRole('heading', { level: 1 });
    expect(h1).toHaveLength(1);
    expect(h1[0]).toHaveTextContent('Des études pour fonder les décisions qui comptent.');
    expect(
      screen.getByText(
        /^Un engagement d’envergure se prend une fois et se vit longtemps\. Avant de trancher, vous devez savoir, comprendre et anticiper, non pas supposer\. Sources vérifiées, terrain parcouru, calculs ouverts à la relecture\s: chacune de nos études vous offre cette assise\.$/,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('img', {
        name: 'Un nuage de points dispersés se resserre jusqu’à un seul point',
      }),
    ).toBeInTheDocument();
  });

  it('passe en arabe', () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: 'عربي' }));
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'دراسات تؤسس للقرارات المهمة.',
    );
  });
});
