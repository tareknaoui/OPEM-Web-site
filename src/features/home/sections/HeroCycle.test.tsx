import { fireEvent, render, screen, within } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';
import { homeContent } from '../content';
import { HeroCycle } from './HeroCycle';

function renderHero() {
  const { hero, heroCycle, markers } = homeContent.fr;
  const Page = () => <HeroCycle hero={hero} cycle={heroCycle} markers={markers} />;
  const router = createMemoryRouter([{ path: '*', Component: Page }]);
  return render(<RouterProvider router={router} />);
}

describe('Bandeau « Cycle OPEM »', () => {
  it('affiche le grand titre et les actions', () => {
    renderHero();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Faire progresser votre organisation.',
    );
    expect(screen.getByRole('link', { name: /Demander un devis/ })).toHaveAttribute(
      'href',
      '/contact',
    );
  });

  it('change d’étape au clic et au clavier (onglets accessibles)', () => {
    renderHero();
    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(3);
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Diagnostic d’entreprise');

    fireEvent.click(tabs[2]!);
    expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Certification ISO 9001');

    fireEvent.keyDown(tabs[2]!, { key: 'ArrowRight' });
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    expect(tabs[0]).toHaveFocus();
  });

  it('passe à l’étape suivante à la fin de la barre de progression', () => {
    renderHero();
    const [first, second] = screen.getAllByRole('tab');
    const progress = first!.querySelector('[aria-hidden] > span')!;
    // jsdom n'a pas AnimationEvent : React écoute alors la version préfixée de l'événement.
    const eventName = 'AnimationEvent' in window ? 'animationend' : 'webkitAnimationEnd';
    fireEvent(progress, new Event(eventName, { bubbles: true }));
    expect(second).toHaveAttribute('aria-selected', 'true');
  });

  it('propose un bouton pour mettre l’animation en pause', () => {
    renderHero();
    const button = screen.getByRole('button', { name: 'Mettre l’animation en pause' });
    fireEvent.click(button);
    expect(button).toHaveAccessibleName('Relancer l’animation');
    expect(within(screen.getByRole('tablist')).getAllByRole('tab')).toHaveLength(3);
  });
});
