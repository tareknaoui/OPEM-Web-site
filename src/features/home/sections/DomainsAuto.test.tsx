import { fireEvent, render, screen, within } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';
import { homeContent } from '../content';
import { DomainsAuto } from './DomainsAuto';

function renderSection() {
  const Page = () => <DomainsAuto domains={homeContent.fr.domains} />;
  const router = createMemoryRouter([{ path: '*', Component: Page }]);
  return render(<RouterProvider router={router} />);
}

const panelTitle = () =>
  within(screen.getByRole('tabpanel')).getByRole('heading', { level: 3 }).textContent;

describe('« Nos domaines », carrousel animé', () => {
  it('passe seul au domaine suivant à la fin de la barre de progression', () => {
    renderSection();
    expect(panelTitle()).toBe('Études stratégiques');
    const fill = screen.getAllByRole('tab')[0]!.querySelector('[aria-hidden] > span')!;
    // jsdom n'a pas AnimationEvent : React écoute alors la version préfixée de l'événement.
    const eventName = 'AnimationEvent' in window ? 'animationend' : 'webkitAnimationEnd';
    fireEvent(fill, new Event(eventName, { bubbles: true }));
    expect(panelTitle()).toBe('Accompagnement des organisations');
  });

  it('se met en pause et se pilote au clavier', () => {
    renderSection();
    const pause = screen.getByRole('button', { name: 'Mettre le défilement en pause' });
    fireEvent.click(pause);
    expect(pause).toHaveAccessibleName('Relancer le défilement');

    const tabs = screen.getAllByRole('tab');
    fireEvent.keyDown(tabs[0]!, { key: 'End' });
    expect(panelTitle()).toBe('Certification, accréditation, labellisation');
    expect(tabs[4]).toHaveFocus();

    fireEvent.click(screen.getByRole('button', { name: 'Domaine suivant' }));
    expect(panelTitle()).toBe('Études stratégiques');
  });
});
