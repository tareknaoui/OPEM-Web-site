import { fireEvent, render, screen, within } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LanguageSwitcher } from '@/app/layouts/navbar/LanguageSwitcher';
import { QUOTE_HREF } from '@/app/layouts/navbar/menu';
import { LanguageProvider } from '@/i18n/LanguageProvider';
import ExpertisesPage from './ExpertisesPage';

function renderPage() {
  const Page = () => (
    <>
      <LanguageSwitcher />
      <ExpertisesPage />
    </>
  );
  const router = createMemoryRouter([{ path: '*', Component: Page }]);
  return render(
    <LanguageProvider>
      <RouterProvider router={router} />
    </LanguageProvider>,
  );
}

const flat = (text: string | null | undefined) => (text ?? '').replace(/\s+/g, ' ').trim();

beforeEach(() => {
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
});

describe('Page « Nos expertises »', () => {
  it('un seul titre principal, puis les blocs en H2', () => {
    renderPage();
    const h1 = screen.getAllByRole('heading', { level: 1 });
    expect(h1).toHaveLength(1);
    expect(flat(h1[0]?.textContent)).toBe(
      'Chaque enjeu, en consulting comme en formation, mérite sa propre réponse.',
    );
    expect(screen.getAllByRole('heading', { level: 2 }).map((h) => flat(h.textContent))).toEqual([
      'Six métiers, une seule exigence',
      'Un client, quatre métiers.',
      'L’IA, là où elle sert vraiment.',
      'Ce qui attend aujourd’hui coûte davantage demain.',
    ]);
  });

  it('bloc 01 : six enjeux qui mènent chacun à la carte de leur domaine', () => {
    renderPage();
    const issues = screen
      .getAllByRole('link')
      .filter((link) => link.getAttribute('href')?.startsWith('#'));
    expect(issues.map((link) => flat(link.textContent))).toEqual([
      '01Une décision à préparer',
      '02Une transformation à conduire',
      '03Des compétences à développer',
      '04Une prise de poste à réussir',
      '05Une certification à obtenir',
      '06Un savoir-faire à faire connaître',
    ]);
    for (const link of issues) {
      const id = link.getAttribute('href')?.slice(1) ?? '';
      expect(document.getElementById(id)).not.toBeNull();
    }
    fireEvent.click(issues[3] as HTMLElement);
    expect(document.activeElement?.id).toBe('coaching-professionnel');
    expect(
      screen.getByText(
        /^Plusieurs se croisent\s\? C’est souvent là que nous sommes le plus utiles\.$/,
      ),
    ).toBeInTheDocument();
  });

  it('bloc 02 : six cartes dans l’ordre, textes et liens', () => {
    renderPage();
    const cards = screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent);
    expect(cards).toEqual([
      'Études stratégiques',
      'Accompagnement des organisations',
      'Formation qualifiante',
      'Coaching professionnel',
      'Certification et accréditation',
      'Communication institutionnelle',
    ]);
    const formation = document.getElementById('formation-qualifiante') as HTMLElement;
    expect(
      within(formation).getByRole('link', { name: /Voir le catalogue et les sessions/ }),
    ).toHaveAttribute('href', '/formation');
    expect(
      within(formation).getAllByText(/Programmes intra-entreprise sur mesure/)[0]?.tagName,
    ).toBe('STRONG');
    const communication = document.getElementById('communication-institutionnelle') as HTMLElement;
    expect(flat(within(communication).getByText(/^Parmi nos références/).textContent)).toBe(
      'Parmi nos références : les catalogues institutionnels de la SAPTA et de la SNTP, entièrement rédigés, conçus et imprimés par nos soins. Notre signature s’y lit.',
    );
  });

  it('bloc 03 : les chiffres en texte réel, aucun lien', () => {
    renderPage();
    const section = screen.getByRole('region', { name: 'Un client, quatre métiers.' });
    expect(within(section).getByText('+30')).toBeInTheDocument();
    expect(within(section).getByText('cycles de formation')).toBeInTheDocument();
    expect(within(section).getByText('+150')).toBeInTheDocument();
    expect(within(section).queryAllByRole('link')).toHaveLength(0);
    expect(
      within(section).getByRole('img', { name: /Plan de tracé de quatre voies/ }),
    ).toBeVisible();
  });

  it('bloc 04 : lien vers l’IA appliquée, étiquette qui commence par le libellé visible', () => {
    renderPage();
    const link = screen.getByRole('link', { name: /^Découvrir l’IA appliquée/ });
    expect(link).toHaveAttribute('href', '/ia-appliquee');
    expect(link.getAttribute('aria-label')).toMatch(
      /^Découvrir l’IA appliquée\s: nos solutions et notre démarche en intelligence artificielle$/,
    );
  });

  it('bloc 05 : le bouton mène à la demande de rendez-vous', () => {
    renderPage();
    expect(screen.getByRole('link', { name: /^Parlons de votre projet/ })).toHaveAttribute(
      'href',
      QUOTE_HREF,
    );
    expect(
      screen.getByText('Échange confidentiel, sans engagement. Un formulaire, quelques lignes.'),
    ).toBeInTheDocument();
  });

  it('passe en arabe', () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: 'عربي' }));
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('لكل رهان');
    expect(document.title).toBe('ست خبرات في الاستشارة والتكوين بالجزائر العاصمة | OPEM');
  });
});
