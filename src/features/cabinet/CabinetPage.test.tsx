import { fireEvent, render, screen, within } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';
import { LanguageSwitcher } from '@/app/layouts/navbar/LanguageSwitcher';
import { QUOTE_HREF } from '@/app/layouts/navbar/menu';
import { LanguageProvider } from '@/i18n/LanguageProvider';
import CabinetPage from './CabinetPage';

function renderCabinet() {
  const Page = () => (
    <>
      <LanguageSwitcher />
      <CabinetPage />
    </>
  );
  const router = createMemoryRouter([{ path: '*', Component: Page }]);
  return render(
    <LanguageProvider>
      <RouterProvider router={router} />
    </LanguageProvider>,
  );
}

describe('Page « Le cabinet »', () => {
  it('ouvre sur la photo et le titre, puis « Notre histoire »', () => {
    renderCabinet();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Conseil, études et formation, au service de votre performance.',
    );
    expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual([
      'Ce qui nous a fait naître.',
      'Ce que le terrain nous apprend.',
      'Quatre temps, quatre engagements.',
      'Six valeurs, à l’épreuve des faits.',
      'Ce que nous devons à chacun.',
      'Une équipe se compose, elle ne s’improvise pas.',
      'Des preuves, plutôt que des promesses.',
      'Deux façons d’entrer en relation avec nous.',
    ]);
  });

  it('bloc 02 : textes mot pour mot et frise des trois repères', () => {
    renderCabinet();
    expect(screen.getByText('Notre histoire', { selector: 'p' })).toBeInTheDocument();
    // Le texte, en trois actes, se lit d'un seul tenant (mot pour mot).
    const story = screen.getByText(
      (_, node) => node?.tagName === 'P' && /^À l’origine/.test(node.textContent ?? ''),
    );
    expect(story.textContent).toMatch(
      /^À l’origine d’OPEM, une conviction\s: l’Algérie mérite .+ ses ambitions\. Le chemin .+ de ses clients\. Avec l’intelligence artificielle, il ouvre .+ en pleine mutation\.$/,
    );
    expect(
      screen
        .getAllByRole('listitem')
        .filter((item) => item.querySelector('time'))
        .map((item) => item.textContent),
    ).toEqual([
      '2019Création d’OPEMCinq domaines d’expertise',
      '2025Communication institutionnelleSixième domaine',
      '2026Intelligence artificielleAppliquée aux organisations',
    ]);
  });

  it('la barre des rubriques mène aux blocs construits', () => {
    renderCabinet();
    const nav = screen.getByRole('navigation', { name: 'Sur cette page' });
    expect(within(nav).getByRole('link', { name: 'Notre histoire' })).toHaveAttribute(
      'href',
      '#notre-histoire',
    );
    expect(within(nav).getByRole('link', { name: 'Notre regard' })).toHaveAttribute(
      'href',
      '#notre-regard',
    );
    expect(within(nav).getByRole('link', { name: 'Travailler avec OPEM' })).toHaveAttribute(
      'href',
      '#travailler-avec-opem',
    );
    expect(within(nav).getByRole('link', { name: 'Nos valeurs' })).toHaveAttribute(
      'href',
      '#nos-valeurs',
    );
    expect(within(nav).getByRole('link', { name: 'Nos engagements' })).toHaveAttribute(
      'href',
      '#nos-engagements',
    );
    expect(within(nav).getByRole('link', { name: 'Notre réseau d’experts' })).toHaveAttribute(
      'href',
      '#notre-reseau',
    );
    expect(within(nav).getByRole('link', { name: 'Nos garanties' })).toHaveAttribute(
      'href',
      '#nos-garanties',
    );
    expect(within(nav).getByRole('link', { name: 'Notre porte vous est ouverte' })).toHaveAttribute(
      'href',
      '#deux-portes',
    );
  });

  it('bloc 09 : deux portes, deux boutons vers leurs pages', () => {
    renderCabinet();
    const section = screen.getByRole('region', {
      name: 'Deux façons d’entrer en relation avec nous.',
    });
    expect(
      within(section)
        .getAllByRole('heading', { level: 3 })
        .map((h) => h.textContent),
    ).toEqual(['Vous représentez une organisation', 'Vous êtes expert']);
    expect(within(section).getByText(/^Un enjeu, une question/)).toHaveTextContent(
      /projet encore en germe\s: parlons-en, sans engagement\.$/,
    );
    const project = within(section).getByRole('link', { name: 'Parlons de votre projet' });
    expect(project).toHaveAttribute('href', QUOTE_HREF);
    expect(project).toHaveClass('btn-primary');
    const join = within(section).getByRole('link', { name: 'Rejoindre notre réseau' });
    expect(join).toHaveAttribute('href', '/contact/rejoindre-notre-reseau');
    expect(join).toHaveClass('btn-secondary');
  });

  it('bloc 07 : la constellation (texte alternatif) et les cinq traits', () => {
    renderCabinet();
    const section = screen.getByRole('region', {
      name: 'Une équipe se compose, elle ne s’improvise pas.',
    });
    expect(
      within(section).getByRole('img', {
        name: 'Le vivier d’experts, l’équipe composée pour une mission et l’expert recherché au-delà des frontières',
      }),
    ).toBeInTheDocument();
    expect(
      within(section)
        .getAllByRole('heading', { level: 3 })
        .map((h) => `${h.textContent} ${h.nextElementSibling?.textContent}`),
    ).toEqual([
      'Leur parcours Avant de conseiller, ils ont dirigé, audité, construit.',
      'Leur sélection Choisis un à un, pour ce qu’ils ont accompli.',
      'Leur pédagogie Le savoir, l’expérience, et l’art de les transmettre à des adultes en exercice.',
      'Leur mobilisation Pour chaque mission, une équipe soigneusement taillée pour votre seul enjeu.',
      'Leur portée Ce qui manque ici, nous allons le chercher au-delà des frontières.',
    ]);
  });

  it('bloc 06 : le paragraphe d’un seul tenant, les cinq destinataires mis en valeur', () => {
    renderCabinet();
    const section = screen.getByRole('region', { name: 'Ce que nous devons à chacun.' });
    const paragraph = within(section).getByText(/nous devons des recommandations/);
    expect(paragraph.textContent).toBe(
      'À nos clients, nous devons des recommandations que nous aurions le courage d’appliquer nous-mêmes. À ceux que nous formons, la sûreté du geste face aux difficultés du terrain. À nos experts, des missions qui honorent leur talent. À nos partenaires, l’usage scrupuleux de chaque ressource confiée. Et à la société, un savoir qui rayonne bien au-delà de ceux qui l’ont reçu.',
    );
    expect(Array.from(paragraph.querySelectorAll('strong'), (el) => el.textContent)).toEqual([
      'À nos clients,',
      'À ceux que nous formons,',
      'À nos experts,',
      'À nos partenaires,',
      'Et à la société,',
    ]);
  });

  it('bloc 05 : six valeurs dans l’ordre, phrases mot pour mot', () => {
    renderCabinet();
    const section = screen.getByRole('region', { name: 'Six valeurs, à l’épreuve des faits.' });
    const items = within(section).getAllByRole('listitem');
    expect(
      items.map((item) => within(item).getByRole('heading', { level: 3 }).textContent),
    ).toEqual([
      'Perfectionnisme et culture de l’excellence',
      'Professionnalisme et pragmatisme',
      'Respect et maîtrise des délais',
      'Confidentialité, confiance et honnêteté',
      'Disponibilité et réactivité',
      'Engagement citoyen',
    ]);
    expect(items[0]).toHaveTextContent(
      'Le diable se cache dans les détails : c’est là que nous l’attendons.',
      { normalizeWhitespace: true },
    );
    expect(items[5]).toHaveTextContent(
      'Chaque organisation renforcée, c’est un peu du pays qui se construit.',
    );
  });

  it('bloc 04 : l’ancre de la FAQ, quatre temps et leurs engagements', () => {
    renderCabinet();
    expect(document.getElementById('travailler-avec-opem')).toHaveTextContent(
      'Quatre temps, quatre engagements.',
    );
    const section = screen.getByRole('region', { name: 'Quatre temps, quatre engagements.' });
    expect(
      within(section)
        .getAllByRole('heading', { level: 3 })
        .map((h) => h.textContent),
    ).toEqual(['Écouter', 'Construire', 'Conduire', 'Mesurer']);
    expect(
      within(section)
        .getAllByText(/^Notre engagement/)
        .map((label) => label.parentElement?.textContent),
    ).toEqual([
      'Notre engagement : comprendre avant de proposer.',
      'Notre engagement : un budget maîtrisé d’emblée.',
      'Notre engagement : rien ne se décide sans vous.',
      'Notre engagement : vos indicateurs, jamais les nôtres.',
    ]);
  });

  it('bloc 03 : trois idées numérotées, textes mot pour mot', () => {
    renderCabinet();
    const section = screen.getByRole('region', { name: 'Ce que le terrain nous apprend.' });
    expect(
      within(section)
        .getAllByRole('heading', { level: 3 })
        .map((h) => h.textContent),
    ).toEqual([
      'La performance des organisations se joue au quotidien.',
      'Public ou privé, des leviers communs pour exceller.',
      'L’intelligence artificielle ne corrige rien, elle amplifie.',
    ]);
    expect(within(section).getByText(/^Compétitivité pour l’entreprise/)).toHaveTextContent(
      /institution\s: les finalités diffèrent, les fondamentaux demeurent\./,
    );
  });

  it('bloc 08 : la photo de session et six garanties mot pour mot, dans l’ordre', () => {
    renderCabinet();
    const section = screen.getByRole('region', { name: 'Des preuves, plutôt que des promesses.' });
    expect(within(section).getByText('Nos garanties', { selector: 'p' })).toBeInTheDocument();
    expect(within(section).getByRole('img', { name: 'Session de formation OPEM' })).toBeVisible();
    const items = within(section).getAllByRole('listitem');
    expect(
      items.map((item) => within(item).getByRole('heading', { level: 3 }).textContent),
    ).toEqual([
      'Un agrément officiel',
      'Une habilitation ministérielle',
      'Des groupes à taille humaine',
      'Une double évaluation',
      'Un rapport après chaque session',
      'Une exigence chiffrée',
    ]);
    expect(items.map((item) => item.querySelector('p')?.textContent)).toEqual([
      'Établissement privé de formation professionnelle agréé par le ministère de la Formation et de l’Enseignement professionnels, par décision n° 539 du 24 décembre 2019.',
      'Cabinet habilité par le ministère de l’Industrie, sous le n° …, du …, pour l’accompagnement à la certification.',
      'De 10 à 15 participants, pour que chacun soit entendu et accompagné.',
      'À chaud, au terme de la session ; à froid, quelques mois plus tard, sur le terrain.',
      'Déroulement, acquis et axes de progrès vous sont remis par écrit.',
      'Sous 4 sur 5 de satisfaction, une action corrective est engagée.',
    ]);
  });

  it('passe en arabe', () => {
    renderCabinet();
    fireEvent.click(screen.getByRole('button', { name: 'عربي' }));
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('في خدمة أدائكم.');
    expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual([
      'ما الذي أوجدنا.',
      'ما يعلّمنا إيّاه الميدان.',
      'أربع مراحل، أربعة التزامات.',
      'ست قيم، على محكّ الوقائع.',
      'ما ندين به لكلّ طرف.',
      'الفريق يُشكَّل، ولا يُرتجَل.',
      'براهين، لا وعود.',
      'طريقتان للتواصل معنا.',
    ]);
  });
});
