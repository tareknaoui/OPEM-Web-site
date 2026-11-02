import { render, screen, within } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';
import { homeContent } from '../content';
import { Insights } from './Insights';

const { insights } = homeContent.fr;

function renderSection() {
  const Page = () => <Insights insights={insights} />;
  const router = createMemoryRouter([{ path: '*', Component: Page }]);
  return render(<RouterProvider router={router} />);
}

describe('Section « Éclairages »', () => {
  it('présente trois éclairages, chacun avec sa date et son lien', () => {
    renderSection();
    const titles = screen.getAllByRole('heading', { level: 3 });
    expect(titles.map((title) => title.textContent)).toEqual(
      insights.articles.map((article) => article.title),
    );
    const read = screen.getAllByRole('link', { name: /^Lire/ });
    expect(read).toHaveLength(4);
    expect(read[0]).toHaveAttribute('href', insights.articles[0]!.href);
    expect(read[0]).toHaveAccessibleDescription(insights.articles[0]!.title);
    expect(screen.getByRole('link', { name: /Tous les éclairages/ })).toHaveAttribute(
      'href',
      '/eclairages',
    );
  });

  it('invite à poser une question et présente les actualités', () => {
    renderSection();
    expect(screen.getByRole('link', { name: /Posez-la-nous/ })).toHaveAttribute('href', '/contact');
    const news = within(screen.getByRole('complementary', { name: 'Actualité' }));
    expect(news.getByText('Nos formations qualifiantes de décembre')).toBeInTheDocument();
    expect(news.getAllByRole('listitem')).toHaveLength(4);
    expect(news.getByRole('link', { name: /Voir le calendrier/ })).toHaveAttribute(
      'href',
      '/formation/catalogue-et-sessions',
    );
    expect(news.getByRole('link', { name: /Toutes les actualités/ })).toHaveAttribute(
      'href',
      '/actualites',
    );
  });
});
