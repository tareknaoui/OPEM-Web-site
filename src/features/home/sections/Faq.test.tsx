import { fireEvent, render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';
import { homeContent } from '../content';
import { Faq } from './Faq';

function renderSection() {
  const Page = () => <Faq faq={homeContent.fr.faq} />;
  const router = createMemoryRouter([{ path: '*', Component: Page }]);
  return render(<RouterProvider router={router} />);
}

describe('Section « Questions fréquentes »', () => {
  it('liste les questions, la première ouverte', () => {
    renderSection();
    const questions = screen.getAllByRole('button', { expanded: false });
    expect(questions).toHaveLength(homeContent.fr.faq.items.length - 1);
    expect(
      screen.getByRole('button', { name: 'Quels types d’organisations accompagnez-vous ?' }),
    ).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('region', { name: /Quels types/ })).toHaveTextContent(
      /organismes publics/,
    );
  });

  it('ouvre et ferme une réponse ; fermée, elle est inerte', () => {
    renderSection();
    const question = screen.getByRole('button', { name: /certification ISO/ });
    const answer = document.getElementById(question.getAttribute('aria-controls')!)!;
    expect(answer).toHaveAttribute('inert');
    fireEvent.click(question);
    expect(question).toHaveAttribute('aria-expanded', 'true');
    expect(answer).not.toHaveAttribute('inert');
    fireEvent.click(question);
    expect(question).toHaveAttribute('aria-expanded', 'false');
  });

  it('propose de poser une autre question et signale des réponses provisoires', () => {
    renderSection();
    expect(screen.getByRole('link', { name: /Poser votre question/ })).toHaveAttribute(
      'href',
      '/contact',
    );
    expect(screen.getByText(/Réponses provisoires/)).toBeInTheDocument();
  });
});
