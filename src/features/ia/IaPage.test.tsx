import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';
import { LanguageProvider } from '@/i18n/LanguageProvider';
import IaPage from './IaPage';

describe('Page « IA appliquée »', () => {
  it('présente l’approche et ses trois temps, puis l’invitation à échanger', () => {
    const router = createMemoryRouter([{ path: '*', Component: IaPage }], {
      initialEntries: ['/ia-appliquee'],
    });
    render(
      <LanguageProvider>
        <RouterProvider router={router} />
      </LanguageProvider>,
    );
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'L’IA entre par la porte de l’organisation.',
    );
    expect(screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual([
      'Diagnostic',
      'Formation',
      'Accompagnement',
    ]);
    expect(screen.getByRole('link', { name: /Parlons de votre projet/ })).toHaveAttribute(
      'href',
      '/contact',
    );
  });
});
