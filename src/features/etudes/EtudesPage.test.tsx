import { fireEvent, render, screen, within } from '@testing-library/react';
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

  it('bloc 02 : surtitre, titre H2, quatre familles en H3, études « intitulé : description », sans lien', () => {
    renderPage();
    const section = screen.getByRole('region', { name: 'Quel enjeu souhaitez-vous éclairer ?' });
    expect(within(section).getByText('Votre situation')).toBeInTheDocument();
    expect(
      within(section)
        .getAllByRole('heading', { level: 3, hidden: true })
        .map((h) => h.textContent),
    ).toEqual([
      'Investir et développer',
      'S’allier et se positionner',
      'Évaluer et préserver',
      'Observer, évaluer et anticiper',
    ]);
    // 5 + 6 + 6 + 7 études, aucun lien ; images décoratives seulement (cachées aux lecteurs d'écran).
    const studies = section.querySelectorAll('[role="tabpanel"] ol > li');
    expect(studies).toHaveLength(24);
    // Espaces insécables avant « : » et « ; » : jamais en début de ligne.
    expect(studies[0]?.textContent).toBe(
      'Étude de marché : Analyse de la demande, des attentes des clients et de la concurrence ; évaluation du potentiel commercial du projet.',
    );
    expect(within(section).queryAllByRole('link')).toHaveLength(0);
    expect(within(section).queryAllByRole('img')).toHaveLength(0);
  });

  it('bloc 02 : un onglet par famille, une seule famille affichée, clavier compris', () => {
    renderPage();
    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(4);
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Investir et développer');

    fireEvent.click(tabs[2]!);
    expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Évaluer et préserver');

    fireEvent.keyDown(tabs[2]!, { key: 'ArrowRight' });
    expect(tabs[3]).toHaveAttribute('aria-selected', 'true');
    expect(tabs[3]).toHaveFocus();
    fireEvent.keyDown(tabs[3]!, { key: 'Home' });
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Investir et développer');
  });

  it('passe en arabe', () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: 'عربي' }));
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'دراسات تؤسس للقرارات المهمة.',
    );
  });
});
