import type { Lang } from '@/i18n/language';

/*
 * Textes de la page « Formation qualifiante » (/formation). Structure posée, contenu en partie
 * PROVISOIRE : l'accroche, le texte, les deux formats et l'agrément reprennent « Nos expertises »
 * (domaine « Formation qualifiante ») ; les sessions, les photos, le chiffre et le témoignage
 * viennent de l'accueil (homeContent : une seule source). Les phrases des deux formats sont à
 * valider par OPEM ; l'arabe est à faire relire.
 */

const N = ' ';
const fr = (text: string) => text.replace(/ ([:;?!])/g, `${N}$1`);

export type TrainingFormat = {
  id: 'intra' | 'inter';
  title: string;
  text: string;
  points: string[];
  image: { small: string; large: string; alt: string };
};

export type FormationContent = {
  title: string;
  header: {
    eyebrow: string;
    title: string;
    lead: string;
    /** L'agrément, en une ligne. */
    approval: string;
    actions: { sessions: string; custom: { label: string; href: string } };
    image: { small: string; large: string; alt: string };
  };
  sessions: {
    eyebrow: string;
    title: string;
    lead: string;
    register: { label: string; href: string };
    /** Mention sous le calendrier tant qu'il n'est pas confirmé. */
    note: string;
  };
  formats: { eyebrow: string; title: string; items: TrainingFormat[] };
  voices: { eyebrow: string; title: string; photosLabel: string };
};

const FR: FormationContent = {
  title: 'Formation qualifiante',
  header: {
    eyebrow: 'Formation qualifiante',
    title: 'Une compétence se construit, puis s’éprouve au travail.',
    lead: 'Nos formations, sur mesure ou en session ouverte, en posent les bases, en guident la pratique et en mesurent les acquis, pour que vous en tiriez un bénéfice durable.',
    approval: fr(
      `Établissement privé de formation professionnelle agréé par le ministère de la Formation et de l’Enseignement professionnels, décision n°${N}539 du 24${N}décembre 2019.`,
    ),
    actions: {
      sessions: 'Voir les prochaines sessions',
      custom: { label: 'Organiser une formation sur mesure', href: '/contact' },
    },
    image: {
      small: '/images/sessions/formateur-btph-700.webp',
      large: '/images/sessions/formateur-btph.webp',
      alt: 'Un formateur d’OPEM debout face aux participants d’une session, dans une salle de formation',
    },
  },
  sessions: {
    eyebrow: 'Agenda',
    title: 'Les prochaines sessions',
    lead: 'Sessions inter-entreprises à Alger : choisissez votre date, nous vous confirmons votre place.',
    register: { label: 'S’inscrire', href: '/contact' },
    note: 'Calendrier provisoire, à confirmer par OPEM.',
  },
  formats: {
    eyebrow: 'Deux façons de vous former',
    title: 'Dans vos locaux ou avec d’autres organisations.',
    items: [
      {
        id: 'intra',
        title: 'Sur mesure, dans vos locaux',
        text: 'Un programme intra-entreprise construit à partir de vos objectifs, de vos métiers et de votre calendrier.',
        points: [
          'Programme adapté à vos équipes',
          'Exemples tirés de votre activité',
          'Acquis mesurés',
        ],
        image: {
          small: '/images/sessions/revue-documents-700.webp',
          large: '/images/sessions/revue-documents.webp',
          alt: 'Des participants travaillent sur des documents autour d’une table, pendant une session OPEM',
        },
      },
      {
        id: 'inter',
        title: 'En session ouverte, à Alger',
        text: 'Des sessions inter-entreprises à dates fixes, pour apprendre avec des professionnels d’autres organisations.',
        points: [
          'Dates publiées à l’avance',
          'Échanges entre organisations',
          'Formateurs praticiens',
        ],
        image: {
          small: '/images/sessions/participants-rang-700.webp',
          large: '/images/sessions/participants-rang.webp',
          alt: 'Des participants à une session OPEM, assis côte à côte autour de tables',
        },
      },
    ],
  },
  voices: {
    eyebrow: 'Ce qu’ils en disent',
    title: 'Une formation se juge à ce qu’elle change.',
    photosLabel: 'Nos sessions en images',
  },
};

const AR: FormationContent = {
  title: 'التكوين التأهيلي',
  header: {
    eyebrow: 'التكوين التأهيلي',
    title: 'الكفاءة تُبنى، ثم تُختبر في العمل.',
    lead: 'تكويناتنا، حسب الطلب أو في دورات مفتوحة، تضع أسسها، وتوجّه ممارستها، وتقيس مكتسباتها، لكي تجنوا منها فائدة دائمة.',
    approval:
      'مؤسسة خاصة للتكوين المهني معتمدة من وزارة التكوين والتعليم المهنيين، بموجب المقرر رقم 539 المؤرخ في 24 ديسمبر 2019.',
    actions: {
      sessions: 'اطّلعوا على الدورات القادمة',
      custom: { label: 'نظّموا تكوينًا حسب الطلب', href: '/contact' },
    },
    image: {
      small: '/images/sessions/formateur-btph-700.webp',
      large: '/images/sessions/formateur-btph.webp',
      alt: 'مكوّن من OPEM واقف أمام المشاركين في دورة، داخل قاعة تكوين',
    },
  },
  sessions: {
    eyebrow: 'الأجندة',
    title: 'الدورات القادمة',
    lead: 'دورات بين المؤسسات في الجزائر العاصمة: اختاروا موعدكم، ونؤكد لكم مقعدكم.',
    register: { label: 'التسجيل', href: '/contact' },
    note: 'رزنامة مؤقتة، تنتظر تأكيد OPEM.',
  },
  formats: {
    eyebrow: 'طريقتان للتكوين',
    title: 'في مقراتكم أو مع مؤسسات أخرى.',
    items: [
      {
        id: 'intra',
        title: 'حسب الطلب، في مقراتكم',
        text: 'برنامج داخل المؤسسة يُبنى انطلاقًا من أهدافكم ومهنكم ورزنامتكم.',
        points: ['برنامج مكيّف مع فرقكم', 'أمثلة مستقاة من نشاطكم', 'مكتسبات مُقاسة'],
        image: {
          small: '/images/sessions/revue-documents-700.webp',
          large: '/images/sessions/revue-documents.webp',
          alt: 'مشاركون يعملون على وثائق حول طاولة خلال دورة لـ OPEM',
        },
      },
      {
        id: 'inter',
        title: 'في دورة مفتوحة، بالجزائر العاصمة',
        text: 'دورات بين المؤسسات في مواعيد ثابتة، للتعلّم مع مهنيين من مؤسسات أخرى.',
        points: ['مواعيد منشورة مسبقًا', 'تبادل بين المؤسسات', 'مكوّنون ممارسون'],
        image: {
          small: '/images/sessions/participants-rang-700.webp',
          large: '/images/sessions/participants-rang.webp',
          alt: 'مشاركون في دورة لـ OPEM جالسون جنبًا إلى جنب حول طاولات',
        },
      },
    ],
  },
  voices: {
    eyebrow: 'ما يقولونه',
    title: 'التكوين يُقاس بما يغيّره.',
    photosLabel: 'دوراتنا بالصور',
  },
};

export const formationContent: Record<Lang, FormationContent> = { fr: FR, ar: AR };
