import { fireEvent, render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';
import { homeContent } from '../content';
import { DomainsEditorial } from './DomainsEditorial';

function renderSection() {
  const Page = () => <DomainsEditorial domains={homeContent.fr.domains} />;
  const router = createMemoryRouter([{ path: '*', Component: Page }]);
  return render(<RouterProvider router={router} />);
}

const openTrigger = () => screen.getByRole('button', { expanded: true });

describe('« Nos domaines », sommaire éditorial', () => {
  it('ouvre un seul domaine et passe seul au suivant à la fin du filet', () => {
    const { container } = renderSection();
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(5);
    expect(openTrigger()).toHaveTextContent('Études stratégiques');
    expect(screen.getByRole('link', { name: 'Être rappelé' })).toHaveAttribute('href', '/contact');

    const fill = container.querySelector('[data-active] [aria-hidden="true"] > span')!;
    // jsdom n'a pas AnimationEvent : React écoute alors la version préfixée de l'événement.
    const eventName = 'AnimationEvent' in window ? 'animationend' : 'webkitAnimationEnd';
    fireEvent(fill, new Event(eventName, { bubbles: true }));
    expect(openTrigger()).toHaveTextContent('Accompagnement des organisations');
    expect(screen.getByText('2 sur 5')).toBeInTheDocument();
  });

  it('se met en pause et se pilote au clavier', () => {
    renderSection();
    const pause = screen.getByRole('button', { name: 'Mettre le défilement en pause' });
    fireEvent.click(pause);
    expect(pause).toHaveAccessibleName('Relancer le défilement');

    fireEvent.keyDown(openTrigger(), { key: 'ArrowUp' });
    expect(openTrigger()).toHaveTextContent('Certification');
    expect(openTrigger()).toHaveFocus();
  });
});
