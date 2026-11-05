import { render, screen, within } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';
import { homeContent, type HomeContent } from '../content';
import { Testimonials } from './Testimonials';

// Version illustrée par défaut, quel que soit le réglage de content.ts ; la version
// « portraits » a son propre test.
const testimonials: HomeContent['testimonials'] = {
  ...homeContent.fr.testimonials,
  layout: 'illustrations',
};

function renderSection(content = testimonials) {
  const Page = () => <Testimonials testimonials={content} />;
  const router = createMemoryRouter([{ path: '*', Component: Page }]);
  return render(<RouterProvider router={router} />);
}

describe('Section « Témoignages »', () => {
  it('raconte l’étude de cas une seule fois, en frise : une phrase par étape', () => {
    renderSection();
    expect(screen.getByRole('heading', { level: 3, name: /audit approuvé/ })).toBeInTheDocument();
    const steps = within(screen.getAllByRole('list')[0]!).getAllByRole('listitem');
    expect(steps.map((step) => step.textContent?.replace(/\u00a0/g, ' '))).toEqual([
      '2021L’auditUne entreprise publique économique confie à OPEM l’audit organisationnel et fonctionnel de sa structure.',
      '2021Le verdictSon conseil d’administration approuve le rapport à l’unanimité et félicite l’équipe pour son professionnalisme.',
      '2023La confianceDeux ans plus tard, elle confie à OPEM 100 % de son plan de formation annuel.',
    ]);
    // Le passage clé de chaque étape, en gras.
    expect(steps.map((step) => step.querySelector('strong')?.textContent)).toEqual([
      'l’audit organisationnel et fonctionnel',
      'à l’unanimité',
      '100\u00a0%',
    ]);
    expect(screen.queryByText(/établissement public/)).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Lire l’étude de cas/ })).toHaveAttribute(
      'href',
      '/missions/etudes-de-cas/audit-organisationnel-et-plan-de-formation',
    );
  });

  it('affiche les 3 recommandations, la première signée de son auteur, puis un seul lien', () => {
    renderSection();
    expect(screen.getAllByRole('blockquote')).toHaveLength(3);
    // La première : nom et fonction, sans photo ; les deux autres : anonymes.
    expect(
      [...document.querySelectorAll('figcaption')].map((caption) => caption.textContent),
    ).toEqual([
      'Smail TrifiPrésident-directeur général, ALDIPH',
      'Direction d’une entreprise industrielle, 2025',
      'Direction générale d’un office public national, 2024',
    ]);
    expect(document.querySelector('figcaption img')).toBeNull();
    expect(screen.queryByRole('link', { name: /Lire le témoignage/ })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Lire d’autres témoignages/ })).toHaveAttribute(
      'href',
      '/missions/references-clients',
    );
  });

  it('présente les institutions qui confient leurs études', () => {
    renderSection();
    expect(
      screen.getByRole('heading', { level: 3, name: testimonials.studies.title }),
    ).toBeInTheDocument();
    testimonials.studies.ministries.items.forEach((item) =>
      expect(screen.getByText(item)).toBeInTheDocument(),
    );
    // Nombres comptés dans les listes (4 ministères, 5 programmes), sigle du PNUD en grand.
    expect(screen.getByText('Ministères').parentElement).toHaveTextContent('4Ministères');
    expect(screen.getByText('PNUD')).toBeInTheDocument();
    expect(screen.getByText('Économie circulaire')).toBeInTheDocument();
    expect(screen.getByText(/programmes$/)).toHaveTextContent('5 programmes');
    expect(screen.getByRole('link', { name: /Découvrir nos études/ })).toHaveAttribute(
      'href',
      '/expertises/etudes-strategiques',
    );
  });

  it('version « portraits » : le logo de chaque entreprise à la place des illustrations', () => {
    const company = { name: 'Entreprise A', logo: '/images/clients/a.webp' };
    renderSection({
      ...testimonials,
      layout: 'portraits',
      featured: {
        ...testimonials.featured,
        company,
        person: { name: 'Prénom Nom', role: 'Directeur général' },
      },
      quotes: testimonials.quotes.map((quote) => ({
        ...quote,
        company: { name: `Entreprise ${quote.id}`, logo: '/l.webp' },
      })),
    });
    expect(screen.getByRole('img', { name: 'Entreprise A' })).toBeInTheDocument();
    expect(screen.getByText('Prénom Nom')).toBeInTheDocument();
    // Pas de photo : ses initiales en médaillon.
    expect(screen.getByText('PN')).toBeInTheDocument();
    expect(screen.getByText('Directeur général')).toBeInTheDocument();
    // Sans personne : le nom de l'entreprise signe le témoignage.
    expect(
      screen.getByText('Entreprise formation', { selector: 'figcaption' }),
    ).toBeInTheDocument();
    // Les illustrations laissent la place aux logos.
    expect(document.querySelector('img[src$="recommandation.webp"]')).toBeNull();
  });
});
