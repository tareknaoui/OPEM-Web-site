import type { Lang } from '@/i18n/language';

/**
 * Textes de la page « Le cabinet ». Source : la page « À propos » du site de 2019
 * (hbourahla.wixsite.com/website-8/a-propos : présentation, vision, positionnement, démarche
 * en 3 niveaux, 6 valeurs, équipe) et son catalogue de formation
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
    /** Le cap fixé à la création du cabinet, tenu depuis. */
    vision: { title: string; text: string };
    quote: string;
  };
  method: {
    eyebrow: string;
    title: string;
    steps: { title: string; text: string }[];
    /** Sous les trois niveaux : formation ciblée et coaching de proximité. */
    note: string;
  };
  values: {
    eyebrow: string;
    title: string;
    intro: string;
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
      'Basé à Alger, OPEM (Optimum Performance Management) accompagne les organisations, publiques comme privées, dans un environnement complexe et exigeant. Organisé par domaines d’expertise, il a fait un choix résolument différent de celui des grands cabinets : rester au plus près de chacun de vos enjeux.',
  },
  about: {
    title: 'Qui nous sommes',
    statement:
      'Chaque organisation a son secteur, ses contraintes et son histoire. Nous commençons par les comprendre, avec vous. Puis nous construisons avec vos équipes, pas à leur place.',
    vision: {
      title: 'Notre vision',
      text: 'À sa création, OPEM s’est fixé un cap : contribuer à une Algérie meilleure, qui sait mobiliser les compétences nombreuses et variées de ses femmes et de ses hommes. Les crises traversées depuis n’ont pas changé ce cap. Le cabinet a choisi la persévérance et la ténacité, pour rester au service des organisations et leur apporter une forte valeur ajoutée.',
    },
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
    note: 'À chaque niveau, des formations ciblées et un coaching de proximité font progresser vos collaborateurs, renforcent l’engagement de chacun et la cohésion de l’ensemble.',
  },
  values: {
    eyebrow: 'Nos valeurs',
    title: 'Six valeurs qui guident chaque mission.',
    intro:
      'Ce ne sont pas de vains mots, mais des principes que nous appliquons rigoureusement : ils donnent sa crédibilité à la signature OPEM et guident chacun de nous au quotidien.',
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
    text: 'Ce qui nous rassemble : la rigueur, et le client au centre de chaque décision. Autour de la direction, des professionnels aux compétences confirmées, dont certains ont occupé de hautes fonctions de direction, et des consultants et experts choisis pour chaque type de mission. Quand votre projet demande une compétence rare, introuvable localement, nous la cherchons dans notre vivier de consultants internationaux.',
    lead: { label: 'Direction', name: 'Houda Bourahla', role: 'Directrice générale' },
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
      'يقع مقرّ OPEM (Optimum Performance Management) في الجزائر العاصمة، وترافق المؤسسات، العمومية والخاصة، في محيط معقّد وصعب. وبتنظيمه حسب مجالات الخبرة، اختار المكتب نهجًا مختلفًا تمامًا عن المكاتب الكبرى: البقاء على مقربة من كل رهان من رهاناتكم.',
  },
  about: {
    title: 'من نحن',
    statement:
      'لكل مؤسسة قطاعها وقيودها وتاريخها. نبدأ بفهمها، معكم. ثم نبني مع فرقكم، لا بدلًا منها.',
    vision: {
      title: 'رؤيتنا',
      text: 'منذ تأسيسها، حدّدت OPEM لنفسها وجهة: المساهمة في جزائر أفضل، تعرف كيف تستثمر الكفاءات الكثيرة والمتنوعة لنسائها ورجالها. ولم تغيّر الأزمات التي مرّت بها البلاد منذ ذلك الحين هذه الوجهة. فقد اختار المكتب المثابرة والعزيمة، ليبقى في خدمة المؤسسات ويقدّم لها قيمة مضافة عالية.',
    },
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
    note: 'في كل مستوى، تكوينات موجّهة ومرافقة عن قرب ترفع مستوى معاونيكم، وتعزّز التزام كل فرد وتماسك المجموعة.',
  },
  values: {
    eyebrow: 'قيمنا',
    title: 'ست قيم توجّه كل مهمة.',
    intro:
      'ليست كلمات جوفاء، بل مبادئ نطبّقها بصرامة: تمنح توقيع OPEM مصداقيته، وتوجّه كل واحد منا في عمله اليومي.',
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
    text: 'ما يجمعنا: الصرامة، ووضع العميل في صميم كل قرار. حول الإدارة، مهنيون ذوو كفاءات مؤكدة، شغل بعضهم مناصب إدارية عليا، ومستشارون وخبراء يُختارون لكل نوع من المهام. وحين يتطلب مشروعكم كفاءة نادرة غير متوفرة محليًا، نبحث عنها في شبكتنا من المستشارين الدوليين.',
    lead: { label: 'الإدارة', name: 'هدى بورحلة', role: 'المديرة العامة' },
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
