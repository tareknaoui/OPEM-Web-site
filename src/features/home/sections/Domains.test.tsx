import { fireEvent, render, screen, within } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';
import { homeContent } from '../content';
import { Domains } from './Domains';

function renderSection(lang: 'fr' | 'ar' = 'fr') {
  const Page = () => <Domains domains={homeContent[lang].domains} />;
  const router = createMemoryRouter([{ path: '*', Component: Page }]);
  return render(<RouterProvider router={router} />);
}

const panelTitle = () =>
  within(screen.getByRole('tabpanel')).getByRole('heading', { level: 3 }).textContent;

describe('Section « Nos domaines »', () => {
  it('affiche les cinq onglets et un seul domaine à la fois', () => {
    renderSection();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Nos domaines');
    expect(screen.getAllByRole('tab')).toHaveLength(5);
    expect(panelTitle()).toBe('Études stratégiques');
    expect(screen.getByText('1 sur 5')).toBeInTheDocument();

    const panel = within(screen.getByRole('tabpanel'));
    expect(panel.getAllByRole('listitem')).toHaveLength(3);
    expect(panel.getByRole('link', { name: /Découvrir ce domaine/ })).toHaveAttribute(
      'href',
      '/expertises/etudes-strategiques',
    );
    expect(panel.getByRole('link', { name: 'Être rappelé' })).toHaveAttribute('href', '/contact');
  });

  it('change de domaine par onglet, flèches du clavier, boutons et liste déroulante', () => {
    renderSection();
    const tabs = screen.getAllByRole('tab');

    fireEvent.click(tabs[2]!);
    expect(panelTitle()).toBe('Formations qualifiantes');
    expect(tabs[2]).toHaveAttribute('aria-selected', 'true');

    fireEvent.keyDown(tabs[2]!, { key: 'ArrowRight' });
    expect(panelTitle()).toBe('Coaching professionnel');
    expect(tabs[3]).toHaveFocus();

    fireEvent.click(screen.getByRole('button', { name: 'Domaine suivant' }));
    fireEvent.click(screen.getByRole('button', { name: 'Domaine suivant' }));
    // Après le dernier domaine, on revient au premier.
    expect(panelTitle()).toBe('Études stratégiques');
    expect(screen.getByText('1 sur 5')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Choisir un domaine'), { target: { value: '1' } });
    expect(panelTitle()).toBe('Accompagnement des organisations');
    expect(screen.getByText('2 sur 5')).toBeInTheDocument();
  });

  it('n’écrit jamais « DAS »', () => {
    const { container } = renderSection();
    expect(container.textContent).not.toMatch(/\bDAS\b/);
  });
});
