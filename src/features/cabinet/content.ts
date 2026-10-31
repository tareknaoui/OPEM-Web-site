import type { Lang } from '@/i18n/language';

/**
 * Textes de la page « Le cabinet ». Source : la page « À propos » du site de 2019
 * (présentation, démarche en 3 niveaux, 6 valeurs, équipe) et son catalogue de formation
 * (agrément, dispositif qualité), réécrits court. Règle : rien de ce que dit déjà l'accueil
 * (chiffres, domaines, titre sur l'excellence), et rien qui se répète d'une section à l'autre.
 * provisional : contenu à faire valider par OPEM (une mention discrète s'affiche).
 */
export type CabinetContent = {
  title: string;
  hero: {
    eyebrow: string;
    /** Deux parties : la seconde, plus claire, sur sa propre ligne. */
    headline: [string, string];
    intro: string;
  };
  /** Manifeste : le grand texte dont les mots s'allument au défilement. */
  about: {
    title: string;
    statement: string;
    quote: string;
  };
  method: {
    eyebrow: string;
    title: string;
    steps: { title: string; text: string }[];
  };
  values: {
    eyebrow: string;
    title: string;
    provisional: boolean;
    note: string;
    items: { title: string; text: string }[];
  };
  team: {
    eyebrow: string;
    title: string;
    text: string;
    /** La direction : étiquette, nom, fonction. */
    lead: { label: string; name: string; role: string };
  };
  pledges: {
    eyebrow: string;
    title: string;
    approval: { label: string; title: string; text: string };
    qualityTitle: string;
    quality: string[];
    provisional: boolean;
    note: string;
  };
};

const fr: CabinetContent = {
  title: 'Le cabinet · OPEM',
  hero: {
    eyebrow: 'Le cabinet',
    headline: ['Conseil, études et formation,', 'au service de votre performance.'],
    intro:
      'Basé à Alger, OPEM (Optimum Performance Management) accompagne les organisations, publiques comme privées, dans un environnement complexe et exigeant.',
  },
  about: {
    title: 'Qui nous sommes',
    statement:
      'Chaque organisation a son secteur, ses contraintes et son histoire. Nous commençons par les comprendre, avec vous. Puis nous construisons avec vos équipes, pas à leur place.',
    quote: 'L’excellence est une démarche de progrès continu, et non le fruit du hasard.',
  },
  method: {
    eyebrow: 'Notre démarche',
    title: 'Trois niveaux, de l’expertise à la mise en œuvre.',
    steps: [
      {
        title: 'Réunir les bons experts',
        text: 'Nous constituons un groupe de travail avec des experts de confiance, dont les compétences complètent celles de vos équipes.',
      },
      {
        title: 'Animer jusqu’à la décision',
        text: 'Avec des méthodes et des outils structurés, nous facilitons la prise de décision dans des délais serrés.',
      },
      {
        title: 'Accompagner la mise en œuvre',
        text: 'Nous restons à vos côtés pour transformer la stratégie retenue en résultats, et la faire adopter par vos équipes.',
      },
    ],
  },
  values: {
    eyebrow: 'Nos valeurs',
    title: 'Six valeurs qui guident chaque mission.',
    provisional: true,
    note: 'Valeurs du cabinet ; textes d’explication proposés, à valider par OPEM.',
    items: [
      {
        title: 'Perfectionnisme et culture de l’excellence',
        text: 'Chaque livrable est relu, vérifié et pensé pour servir.',
      },
      {
        title: 'Professionnalisme et pragmatisme',
        text: 'Des solutions applicables, à la mesure de vos moyens.',
      },
      {
        title: 'Respect et maîtrise des délais',
        text: 'Un calendrier annoncé est un calendrier tenu.',
      },
      {
        title: 'Confidentialité, confiance et honnêteté',
        text: 'Vos informations restent chez vous ; nos avis restent francs.',
      },
      {
        title: 'Disponibilité et réactivité',
        text: 'Un interlocuteur joignable, des réponses rapides.',
      },
      {
        title: 'Engagement citoyen',
        text: 'Contribuer, à notre échelle, au développement du pays.',
      },
    ],
  },
  team: {
    eyebrow: 'Notre équipe',
    title: 'Une direction engagée, un réseau au-delà de nos frontières.',
    text: 'Autour de la direction, des consultants et des formateurs issus des secteurs qu’ils accompagnent, et un réseau international pour les compétences rares.',
    lead: { label: 'Direction', name: 'Houda Bourahla', role: 'Gérante du cabinet' },
  },
  pledges: {
    eyebrow: 'Nos garanties',
    title: 'Une formation agréée et suivie de près.',
    approval: {
      label: 'Agrément',
      title: 'N° 539',
      text: 'Agrément de la Direction de la formation professionnelle de la wilaya d’Alger.',
    },
    qualityTitle: 'À chaque session de formation',
    quality: [
      'Des groupes de 10 à 15 participants',
      'Une évaluation à chaud, puis à froid',
      'Une action corrective sous 4 sur 5',
      'Un rapport remis après chaque session',
    ],
    provisional: true,
    note: 'Informations du catalogue 2021, à confirmer par OPEM.',
  },
};

const ar: CabinetContent = {
  title: 'المكتب · OPEM',
  hero: {
    eyebrow: 'المكتب',
    headline: ['استشارة ودراسات وتكوين،', 'في خدمة أدائكم.'],
    intro:
      'يقع مقرّ OPEM (Optimum Performance Management) في الجزائر العاصمة، وترافق المؤسسات، العمومية والخاصة، في محيط معقّد وصعب.',
  },
  about: {
    title: 'من نحن',
    statement:
      'لكل مؤسسة قطاعها وقيودها وتاريخها. نبدأ بفهمها، معكم. ثم نبني مع فرقكم، لا بدلًا منها.',
    quote: 'التميّز مسار تحسّن مستمر، وليس وليد الصدفة.',
  },
  method: {
    eyebrow: 'منهجيتنا',
    title: 'ثلاثة مستويات، من الخبرة إلى التنفيذ.',
    steps: [
      {
        title: 'جمع الخبراء المناسبين',
        text: 'نشكّل فريق عمل من خبراء موثوقين، تكمّل كفاءاتهم كفاءات فرقكم.',
      },
      {
        title: 'التنشيط حتى اتخاذ القرار',
        text: 'بمناهج وأدوات منظّمة، نسهّل اتخاذ القرار في آجال قصيرة.',
      },
      {
        title: 'مرافقة التنفيذ',
        text: 'نبقى إلى جانبكم لتحويل الاستراتيجية المعتمدة إلى نتائج، وجعل فرقكم تتبنّاها.',
      },
    ],
  },
  values: {
    eyebrow: 'قيمنا',
    title: 'ست قيم توجّه كل مهمة.',
    provisional: true,
    note: 'قيم المكتب؛ نصوص الشرح مقترحة، في انتظار مصادقة OPEM.',
    items: [
      {
        title: 'الإتقان وثقافة التميّز',
        text: 'كل عمل نسلّمه مراجَع ومدقَّق ومصمَّم ليكون نافعًا.',
      },
      {
        title: 'الاحترافية والواقعية',
        text: 'حلول قابلة للتطبيق، على قدر إمكانياتكم.',
      },
      {
        title: 'احترام الآجال والتحكّم فيها',
        text: 'الرزنامة المعلنة رزنامة محترمة.',
      },
      {
        title: 'السرية والثقة والنزاهة',
        text: 'معلوماتكم تبقى عندكم، وآراؤنا تبقى صريحة.',
      },
      {
        title: 'التوفّر وسرعة الاستجابة',
        text: 'محاور يمكن الوصول إليه، وردود سريعة.',
      },
      {
        title: 'الالتزام المواطن',
        text: 'المساهمة، على قدرنا، في تنمية البلاد.',
      },
    ],
  },
  team: {
    eyebrow: 'فريقنا',
    title: 'إدارة ملتزمة، وشبكة تتجاوز حدودنا.',
    text: 'حول الإدارة، مستشارون ومكوّنون من القطاعات التي يرافقونها، وشبكة دولية للكفاءات النادرة.',
    lead: { label: 'الإدارة', name: 'هدى بورحلة', role: 'مسيّرة المكتب' },
  },
  pledges: {
    eyebrow: 'ضماناتنا',
    title: 'تكوين معتمد ومتابَع عن قرب.',
    approval: {
      label: 'الاعتماد',
      title: 'رقم 539',
      text: 'اعتماد مديرية التكوين المهني لولاية الجزائر.',
    },
    qualityTitle: 'في كل دورة تكوينية',
    quality: [
      'أفواج من 10 إلى 15 مشاركًا',
      'تقييم فوري، ثم تقييم لاحق',
      'إجراء تصحيحي تحت 4 من 5',
      'تقرير يُسلَّم بعد كل دورة',
    ],
    provisional: true,
    note: 'معلومات من كتالوج 2021، في انتظار تأكيد OPEM.',
  },
};

export const cabinetContent: Record<Lang, CabinetContent> = { fr, ar };
