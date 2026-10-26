import { fireEvent, render, screen, within } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';
import { LanguageProvider } from '@/i18n/LanguageProvider';
import { MAX_TOP_LEVEL_ITEMS } from './menu';
import { Navbar } from './Navbar';

function renderNavbar(path = '/') {
  const router = createMemoryRouter([{ path: '*', Component: Navbar }], {
    initialEntries: [path],
  });
  return render(
    <LanguageProvider>
      <RouterProvider router={router} />
    </LanguageProvider>,
  );
}

const desktopNav = (name = 'Navigation principale') =>
  screen.getAllByRole('navigation', { name })[0]!;

describe('Navbar', () => {
  it('affiche les rubriques dans la barre, sauf « Accueil » (le logo y mène)', () => {
    renderNavbar();
    const topLevel = within(desktopNav())
      .getAllByRole('listitem')
      .filter((li) => li.parentElement?.parentElement?.tagName === 'NAV');
    expect(topLevel).toHaveLength(MAX_TOP_LEVEL_ITEMS - 1);
    expect(within(desktopNav()).queryByRole('link', { name: 'Accueil' })).not.toBeInTheDocument();
  });

  it('garde « Accueil » et les libellés complets dans le menu mobile', () => {
    const { container } = renderNavbar();
    const dialog = container.querySelector('dialog')!;
    fireEvent.click(screen.getByRole('button', { name: 'Ouvrir le menu' }));
    expect(within(dialog).getByRole('link', { name: 'Accueil' })).toHaveAttribute('href', '/');
    expect(within(dialog).getByRole('link', { name: 'Nos expertises' })).toBeInTheDocument();
  });

  it('marque la rubrique de la page courante comme active, avec son libellé court', () => {
    renderNavbar('/formation/catalogue-et-sessions');
    const link = within(desktopNav()).getByRole('link', { name: 'Formation' });
    expect(link).toHaveAttribute('aria-current', 'page');
    expect(link).toHaveAttribute('href', '/formation');
  });

  it('affiche les sous-pages de troisième niveau sous leur parent', () => {
    renderNavbar();
    expect(
      within(desktopNav()).getByRole('link', { name: 'Diagnostic d’entreprise' }),
    ).toHaveAttribute(
      'href',
      '/expertises/accompagnement-des-organisations/diagnostic-d-entreprise',
    );
    expect(
      within(desktopNav()).getByRole('link', { name: 'Vos questions et nos réponses' }),
    ).toHaveAttribute('href', '/eclairages/articles-signes/vos-questions-nos-reponses');
  });

  it('ouvre un sous-menu au clavier et le referme avec Échap', () => {
    renderNavbar();
    const toggle = within(desktopNav()).getByRole('button', {
      name: 'Afficher le sous-menu Nos expertises',
    });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');

    fireEvent.keyDown(toggle, { key: 'Escape' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(toggle).toHaveFocus();
  });

  it('ouvre le panneau mobile avec le burger', () => {
    const { container } = renderNavbar();
    const burger = screen.getByRole('button', { name: 'Ouvrir le menu' });
    const dialog = container.querySelector('dialog')!;
    expect(dialog.open).toBe(false);

    fireEvent.click(burger);
    expect(dialog.open).toBe(true);
    expect(burger).toHaveAttribute('aria-expanded', 'true');
    expect(within(dialog).getByRole('link', { name: 'Demander un devis' })).toBeInTheDocument();

    fireEvent.click(within(dialog).getByRole('button', { name: 'Fermer le menu' }));
    expect(dialog.open).toBe(false);
    expect(burger).toHaveAttribute('aria-expanded', 'false');
  });

  it('passe en arabe, de droite à gauche', () => {
    renderNavbar();
    fireEvent.click(screen.getAllByRole('button', { name: 'العربية' })[0]!);

    expect(document.documentElement.dir).toBe('rtl');
    expect(document.documentElement.lang).toBe('ar');
    const nav = desktopNav('التنقل الرئيسي');
    expect(within(nav).getByRole('link', { name: 'خبراتنا' })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'العربية' })[0]).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });
});
