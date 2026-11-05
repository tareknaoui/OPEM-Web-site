import type { Lang } from '@/i18n/language';

/**
 * Textes de la page « Le cabinet », reconstruite en neuf blocs (cahier d'OPEM, novembre 2026) :
 * 01 Ouverture · 02 Notre histoire · 03 Notre regard · 04 Travailler avec OPEM · 05 Nos valeurs ·
 * 06 Nos engagements · 07 Notre réseau d'experts · 08 Nos garanties · 09 Deux portes.
 * Les blocs arrivent au fur et à mesure ; les textes repris du site de 2019 sont abandonnés.
 * Textes d'OPEM repris mot pour mot (français) ; arabe traduit, à faire relire.
 */
export type CabinetContent = {
  title: string;
  /**
   * 01 Ouverture : provisoire (photo, titre et présentation de la version précédente) en
   * attendant le texte du bloc 01.
   */
  hero: {
    eyebrow: string;
    /** Deux parties : la seconde, plus claire, sur sa propre ligne. */
    headline: [string, string];
    intro: string;
    /** Nom de la barre des rubriques (lecteurs d'écran). */
    toc: string;
  };
  /** 02 Notre histoire : surtitre, titre, texte, puis la frise des trois repères. */
  history: {
    eyebrow: string;
    title: string;
    text: string;
    milestones: { year: string; title: string; text: string }[];
  };
};

const fr: CabinetContent = {
  title: 'Le cabinet · OPEM',
  hero: {
    eyebrow: 'Le cabinet',
    headline: ['Conseil, études et formation,', 'au service de votre performance.'],
    intro:
      'Basé à Alger, OPEM (Optimum Performance Management) accompagne les organisations, publiques comme privées, dans un environnement complexe et exigeant. Organisé par domaines d’expertise, il a fait un choix résolument différent de celui des grands cabinets : rester au plus près de chacun de vos enjeux.',
    toc: 'Sur cette page',
  },
  history: {
    eyebrow: 'Notre histoire',
    title: 'Ce qui nous a fait naître.',
    text: 'À l’origine d’OPEM, une conviction : l’Algérie mérite des organisations dignes de son histoire et de ses ambitions. Le chemin n’a pas toujours été aisé ; rien, pourtant, n’a ébranlé cette conviction. Parti de cinq domaines, le cabinet en compte aujourd’hui six, chacun ajouté à la demande de ses clients. Avec l’intelligence artificielle, il ouvre un nouveau chapitre : préparer les organisations aux enjeux d’une société moderne, en pleine mutation.',
    milestones: [
      { year: '2019', title: 'Création d’OPEM', text: 'Cinq domaines d’expertise' },
      { year: '2025', title: 'Communication institutionnelle', text: 'Sixième domaine' },
      { year: '2026', title: 'Intelligence artificielle', text: 'Appliquée aux organisations' },
    ],
  },
};

const ar: CabinetContent = {
  title: 'المكتب · OPEM',
  hero: {
    eyebrow: 'المكتب',
    headline: ['استشارة ودراسات وتكوين،', 'في خدمة أدائكم.'],
    intro:
      'يقع مقرّ OPEM (Optimum Performance Management) في الجزائر العاصمة، وترافق المؤسسات، العمومية والخاصة، في محيط معقّد وصعب. وبتنظيمه حسب مجالات الخبرة، اختار المكتب نهجًا مختلفًا تمامًا عن المكاتب الكبرى: البقاء على مقربة من كل رهان من رهاناتكم.',
    toc: 'في هذه الصفحة',
  },
  history: {
    eyebrow: 'تاريخنا',
    title: 'ما الذي أوجدنا.',
    text: 'في أصل OPEM قناعة: الجزائر تستحق مؤسسات تليق بتاريخها وطموحاتها. لم يكن الطريق دائمًا يسيرًا؛ ومع ذلك، لم يزعزع شيء هذه القناعة. انطلق المكتب من خمسة مجالات، ويضمّ اليوم ستة، أُضيف كلٌّ منها بطلب من عملائه. ومع الذكاء الاصطناعي، يفتح فصلًا جديدًا: إعداد المؤسسات لرهانات مجتمع حديث في تحوّل عميق.',
    milestones: [
      { year: '2019', title: 'تأسيس OPEM', text: 'خمسة مجالات خبرة' },
      { year: '2025', title: 'الاتصال المؤسساتي', text: 'المجال السادس' },
      { year: '2026', title: 'الذكاء الاصطناعي', text: 'مطبَّق على المؤسسات' },
    ],
  },
};

export const cabinetContent: Record<Lang, CabinetContent> = { fr, ar };
