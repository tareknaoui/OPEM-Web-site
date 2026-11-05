import { fireEvent, render, screen, within } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';
import { homeContent } from '../content';
import { Faq } from './Faq';

const { faq } = homeContent.fr;

function renderSection() {
  const Page = () => <Faq faq={faq} />;
  const router = createMemoryRouter([{ path: '*', Component: Page }]);
  return render(<RouterProvider router={router} />);
}

// Testing Library compare un texte aux espaces normalisés : même chose pour les insécables.
const answer = (index: number) => faq.items[index]!.answer.replace(/\s+/g, ' ');

const questionButtons = () =>
  within(screen.getByRole('region', { name: faq.title }))
    .getAllByRole('button')
    .filter((button) => button.hasAttribute('aria-controls'));

describe('Section « Questions fréquentes »', () => {
  it('liste les 10 questions, la première choisie et sa réponse affichée', () => {
    renderSection();
    const questions = questionButtons();
    expect(questions).toHaveLength(10);
    expect(questions[0]).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      faq.items[0]!.question.replace(/\s+/g, ' '),
    );
    expect(screen.getByText(answer(0))).toBeInTheDocument();
  });

  it('affiche une seule réponse : celle de la question choisie', () => {
    renderSection();
    const question = screen.getByRole('button', { name: /Nos équipes sauront-elles/ });
    fireEvent.click(question);
    expect(question).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText(answer(7))).toBeInTheDocument();
    expect(screen.queryByText(answer(0))).not.toBeInTheDocument();
  });

  it('filtre par thème, garde la numérotation et affiche la première question du thème', () => {
    renderSection();
    fireEvent.click(screen.getByRole('button', { name: 'Résultats et conditions' }));
    const questions = questionButtons();
    expect(questions).toHaveLength(3);
    expect(questions[0]).toHaveTextContent(/^08/);
    expect(questions[0]).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText(answer(7))).toBeInTheDocument();
  });

  it('question 6 : renvoie à la page Le cabinet ; question 10 : sans délai de remise', () => {
    renderSection();
    fireEvent.click(screen.getByRole('button', { name: /première collaboration/ }));
    expect(screen.getByRole('link', { name: 'notre page Le cabinet' })).toHaveAttribute(
      'href',
      '/le-cabinet#travailler-avec-opem',
    );
    fireEvent.click(screen.getByRole('button', { name: /délais et le coût/ }));
    expect(screen.getByText(answer(9))).toHaveTextContent('dans une proposition dédiée.');
    expect(screen.queryByText(/3 jours qui suivent/)).not.toBeInTheDocument();
  });

  it('propose de poser une autre question', () => {
    renderSection();
    expect(screen.getByRole('link', { name: /Posez-la-nous/ })).toHaveAttribute('href', '/contact');
  });
});
