import type { Lang } from '@/i18n/language';

/*
 * Pages vitrine des formations inter-entreprises (/formation/fiches-formation/<id>).
 *
 * Modèle unique, version 10 « catalogue » retenue par OPEM (encadré « session » fixe à droite,
 * barre d'ancres) : chaque formation a la même page ; seuls changent les textes, la photo et la
 * référence de son entrée ci-dessous. Les dates
 * viennent de l'agenda (homeContent.trainings.items, même `id`) : une seule source, l'agenda
 * et la vitrine ne peuvent pas se contredire. Sans session programmée, la page affiche
 * « Prochaine session : sur demande ».
 *
 * La page n'affiche ni le tarif ni le programme détaillé : ils ne sont envoyés que sur demande.
 *
 * PROVISOIRE, à confirmer par OPEM : les témoignages, l'adresse et le téléphone de contact
 * (CONTACT), la destination du bouton (courriel prérempli), les chiffres clés (ceux de la
 * consigne : ils diffèrent de ceux de l'accueil). L'arabe est à faire relire.
 *
 * Ajouter une formation : copier l'entrée « diagnostic-d-organisation » dans FR et AR, avec
 * l'`id` de sa session dans l'agenda, puis déposer sa photo dans public/images/sessions/
 * (deux tailles : 1 400 et 700 px de large).
 */

const N = ' ';
/** Espace insécable avant « : ; ? ! » (typographie française). */
const fr = (text: string) => text.replace(/ ([:;?!])/g, `${N}$1`);

/** Contact des formations (provisoire : à confirmer par OPEM). */
export const SHOWCASE_CONTACT = {
  email: 'formations@opem-dz.com',
  phone: { display: '0770 442 645', href: 'tel:+213770442645' },
} as const;

/**
 * Pictogrammes disponibles (Phosphor, voir ICONS dans TrainingShowcasePage.tsx). Pour une autre
 * formation, choisir dans cette liste ; en ajouter un = l'importer et l'ajouter à ICONS.
 */
export type ShowcaseIcon =
  | 'collect'
  | 'structure'
  | 'decide'
  | 'present'
  | 'draft'
  | 'toolbox'
  | 'plan'
  | 'compass'
  | 'meal'
  | 'materials'
  | 'test'
  | 'certificate'
  // Fonctions visées (« Pour qui ») et prérequis.
  | 'leader'
  | 'quality'
  | 'people'
  | 'improvement'
  | 'manager'
  | 'company'
  | 'experience'
  | 'confidential'
  // « Pourquoi cette formation » : symptômes constatés, puis les deux volets de la singularité.
  | 'overlap'
  | 'escalate'
  | 'bypass'
  | 'inside'
  | 'outside';

export type TrainingShowcase = {
  /** Identifiant de la session dans l'agenda, et fin de l'adresse de la page. */
  id: string;
  reference: string;
  /** Cycle du catalogue (fil d'Ariane). */
  cycle: string;
  title: string;
  subtitle: string;
  intro: string;
  photo: { small: string; large: string; alt: string };
  practical: {
    /** « Présentiel » (étiquette sous le titre). */
    mode: string;
    /** « 4 jours ». */
    duration: string;
    /** « de 9 h à 16 h ». */
    hours: string;
    seats: number;
    place: string;
    city: string;
  };
  /**
   * Pourquoi cette formation, du problème à la solution : symptoms, ce que le participant
   * constate (2 à 4 cartes) ; answer, ce que la formation apporte ; edge, ce qui la distingue
   * (« Sa singularité », en deux volets reliés).
   */
  why: {
    title: string;
    symptoms: { icon: ShowcaseIcon; text: string }[];
    answer: string;
    edge: { icon: ShowcaseIcon; label: string; text: string }[];
  };
  /** Titre de « Quatre temps forts » (la suite après la virgule change d'une formation à l'autre). */
  stepsTitle: string;
  /** Exactement quatre temps forts, chacun avec son pictogramme. */
  steps: { icon: ShowcaseIcon; title: string; text: string }[];
  /** Ce que vous emportez : une tuile par acquis, avec son pictogramme. */
  gains: { icon: ShowcaseIcon; text: string }[];
  /** roles : les fonctions visées (une carte chacune) ; prerequisites : un point par prérequis. */
  audience: {
    roles: { icon: ShowcaseIcon; label: string }[];
    prerequisites: { icon: ShowcaseIcon; text: string }[];
  };
  /** Ce que la session comprend (un pictogramme par élément), puis qui l'anime. */
  includes: { items: { icon: ShowcaseIcon; text: string }[]; trainer: string };
  /** Le premier est mis en avant ; les deux suivants dessous. */
  voices: { quote: string; author: string }[];
};

export type ShowcaseLabels = {
  breadcrumb: { label: string; root: { label: string; href: string } };
  /** « Formation inter-entreprises · {city} ». */
  format: string;
  facts: {
    label: string;
    dates: string;
    duration: string;
    seats: string;
    place: string;
    /** « {n} participants ». */
    seatsValue: string;
    seatsMore: string;
    noDate: string;
    noDateMore: string;
  };
  /** Les dates de la session : « 6 au 9 décembre » ({start} sans le mois s'il est le même). */
  range: string;
  /** Étiquettes sous le titre : nom de la liste (lecteurs d'écran) et format. */
  tags: { label: string; inter: string };
  /** Encadré « session » (fixe à droite sur ordinateur). */
  card: { next: string; note: string; refMore: string };
  /** Barre d'ancres collée en haut. */
  tabs: {
    label: string;
    why: string;
    steps: string;
    gains: string;
    audience: string;
    voices: string;
  };
  /** Titre (lecteurs d'écran) du bloc « Pour qui » et « La session comprend ». */
  audienceHeading: string;
  why: string;
  steps: { eyebrow: string; note: string };
  gains: { eyebrow: string; title: string };
  audience: string;
  prerequisites: string;
  includes: string;
  trainer: string;
  /** Titre de l'encadré de « Pourquoi cette formation ». */
  edge: string;
  /** Petit titre au-dessus des symptômes constatés. */
  symptoms: string;
  voices: { eyebrow: string; title: string };
  figures: { eyebrow: string; items: { value: string; label: string }[] };
  cta: {
    title: string;
    /** « … Le groupe est limité à {n} participants. » */
    text: string;
    button: string;
    phone: string;
    email: string;
    /** « Référence à rappeler : {ref} ». */
    reminder: string;
    /**
     * Courriel prérempli : objet et corps ({title}, {ref}, {session}) ; {session} reçoit
     * `session` (avec {dates}) quand une session est programmée, rien sinon.
     */
    mail: { subject: string; body: string; session: string };
  };
  reference: string;
  protection: string;
};

const LABELS_FR: ShowcaseLabels = {
  breadcrumb: {
    label: 'Fil d’Ariane',
    root: { label: 'Formation qualifiante', href: '/formation' },
  },
  format: 'Formation inter-entreprises · {city}',
  facts: {
    label: 'Dates, durée, effectif et lieu',
    dates: 'Dates',
    duration: 'Durée',
    seats: 'Effectif',
    place: 'Lieu',
    seatsValue: `{n}${N}participants`,
    seatsMore: 'au plus',
    noDate: 'Sur demande',
    noDateMore: 'prochaine session à venir',
  },
  range: '{start} au {end}',
  tags: { label: 'En bref', inter: 'Inter-entreprises' },
  card: {
    next: 'Prochaine session',
    note: 'Le tarif et le programme détaillé vous sont adressés sur demande.',
    refMore: 'Formation inter-entreprises',
  },
  tabs: {
    label: 'Sur cette page',
    why: 'Pourquoi',
    steps: 'Temps forts',
    gains: 'Ce que vous emportez',
    audience: 'Public et session',
    voices: 'Témoignages',
  },
  audienceHeading: 'Public, prérequis et contenu de la session',
  why: 'Pourquoi cette formation',
  steps: {
    eyebrow: 'Le programme en bref',
    note: 'Le programme détaillé figure dans la fiche technique, adressée sur demande.',
  },
  gains: { eyebrow: 'Ce que vous emportez', title: 'Vous repartez avec du concret' },
  audience: 'Pour qui',
  prerequisites: 'Prérequis',
  includes: 'La session comprend',
  trainer: 'Animation',
  edge: 'Sa singularité',
  symptoms: 'Vous les constatez',
  voices: { eyebrow: 'Ils en parlent', title: 'La parole aux participants' },
  figures: {
    eyebrow: 'OPEM en chiffres',
    items: [
      { value: '+7', label: 'ans d’activité' },
      { value: '+62', label: 'organisations accompagnées' },
      { value: '+170', label: 'formations dispensées' },
      { value: `+1${N}500`, label: 'professionnels formés' },
      { value: '+365', label: 'experts mobilisables' },
    ],
  },
  cta: {
    title: 'Recevez la fiche technique détaillée et votre devis',
    text: `Le programme complet, le tarif et les modalités d’inscription vous sont adressés sur simple demande. Le groupe est limité à {n}${N}participants.`,
    button: 'Demander la fiche technique et un devis',
    phone: fr('Téléphone :'),
    email: fr('Courriel :'),
    reminder: fr('Référence à rappeler : {ref}'),
    mail: {
      subject: fr('Fiche technique et devis : {title} (réf. {ref})'),
      body: fr(
        'Bonjour,\n\nJe souhaite recevoir la fiche technique détaillée et un devis pour la formation « {title} »{session} (réf. {ref}).\n\nOrganisation :\nNombre de participants :\nTéléphone :\n\nMerci.',
      ),
      session: ', session du {dates}',
    },
  },
  reference: 'Réf.',
  protection: fr(
    '© OPEM. Contenu protégé : toute reproduction sans autorisation écrite est interdite.',
  ),
};

const LABELS_AR: ShowcaseLabels = {
  breadcrumb: {
    label: 'مسار التصفح',
    root: { label: 'التكوين التأهيلي', href: '/formation' },
  },
  format: 'تكوين بين المؤسسات · {city}',
  facts: {
    label: 'التواريخ والمدة وعدد المشاركين والمكان',
    dates: 'التواريخ',
    duration: 'المدة',
    seats: 'عدد المشاركين',
    place: 'المكان',
    seatsValue: '{n} مشاركًا',
    seatsMore: 'كحد أقصى',
    noDate: 'حسب الطلب',
    noDateMore: 'الدورة القادمة قريبًا',
  },
  range: 'من {start} إلى {end}',
  tags: { label: 'باختصار', inter: 'بين المؤسسات' },
  card: {
    next: 'الدورة القادمة',
    note: 'يُرسل إليكم السعر والبرنامج المفصّل عند الطلب.',
    refMore: 'تكوين بين المؤسسات',
  },
  tabs: {
    label: 'في هذه الصفحة',
    why: 'لماذا',
    steps: 'المحطات',
    gains: 'ما تخرجون به',
    audience: 'الجمهور والدورة',
    voices: 'شهادات',
  },
  audienceHeading: 'الجمهور والمتطلبات المسبقة ومحتوى الدورة',
  why: 'لماذا هذا التكوين',
  steps: {
    eyebrow: 'البرنامج باختصار',
    note: 'يرد البرنامج المفصّل في البطاقة التقنية، التي تُرسل عند الطلب.',
  },
  gains: { eyebrow: 'ما تخرجون به', title: 'تعودون بنتائج ملموسة' },
  audience: 'لمن هذا التكوين',
  prerequisites: 'المتطلبات المسبقة',
  includes: 'تشمل الدورة',
  trainer: 'التأطير',
  edge: 'ما يميّزه',
  symptoms: 'ما تلاحظونه',
  voices: { eyebrow: 'شهادات', title: 'الكلمة للمشاركين' },
  figures: {
    eyebrow: 'OPEM في أرقام',
    items: [
      { value: '+7', label: 'سنوات من النشاط' },
      { value: '+62', label: 'مؤسسة مرافَقة' },
      { value: '+170', label: 'دورة تكوينية منجزة' },
      { value: '+1500', label: 'مهني تم تكوينهم' },
      { value: '+365', label: 'خبيرًا يمكن تجنيدهم' },
    ],
  },
  cta: {
    title: 'احصلوا على البطاقة التقنية المفصّلة وعرض السعر',
    text: 'يُرسل إليكم البرنامج الكامل والسعر وكيفيات التسجيل بمجرد الطلب. عدد المشاركين محدود بـ {n} مشاركًا.',
    button: 'اطلبوا البطاقة التقنية وعرض السعر',
    phone: 'الهاتف:',
    email: 'البريد الإلكتروني:',
    reminder: 'المرجع الواجب ذكره: {ref}',
    mail: {
      subject: 'البطاقة التقنية وعرض السعر: {title} (المرجع {ref})',
      body: 'السلام عليكم،\n\nأرغب في الحصول على البطاقة التقنية المفصّلة وعرض سعر لتكوين «{title}»{session} (المرجع {ref}).\n\nالمؤسسة:\nعدد المشاركين:\nالهاتف:\n\nشكرًا.',
      session: '، دورة {dates}',
    },
  },
  reference: 'المرجع',
  protection: '© OPEM. محتوى محمي: يُمنع أي استنساخ دون إذن كتابي.',
};

const PHOTO = {
  small: '/images/sessions/revue-documents-700.webp',
  large: '/images/sessions/revue-documents.webp',
};

const FR: TrainingShowcase[] = [
  {
    id: 'diagnostic-d-organisation',
    reference: 'D02-26.INTER.01. V1',
    cycle: 'Cycle Management',
    title: 'Diagnostic d’organisation',
    subtitle: 'Repérer les blocages, optimiser les processus.',
    intro:
      'Quatre jours pour apprendre à conduire le diagnostic de votre propre organisation, du cadrage à la restitution.',
    photo: {
      ...PHOTO,
      alt: 'Des participants travaillent sur des documents autour d’une table, pendant une session OPEM',
    },
    practical: {
      mode: 'Présentiel',
      duration: `4${N}jours`,
      hours: `de 9${N}h à 16${N}h`,
      seats: 12,
      place: 'École OPEM',
      city: 'Alger',
    },
    why: {
      title: fr('Constater un blocage ne suffit pas : il faut le prouver, puis le corriger.'),
      symptoms: [
        { icon: 'overlap', text: 'Des responsabilités qui se chevauchent' },
        { icon: 'escalate', text: 'Des décisions qui remontent toujours à la direction' },
        { icon: 'bypass', text: 'Des processus contournés sur le terrain' },
      ],
      answer:
        'Cette formation vous donne la méthode, du cadrage à la restitution, appliquée à votre propre organisation.',
      edge: [
        {
          icon: 'inside',
          label: 'En interne',
          text: 'Conduire vous-même un diagnostic léger et régulier',
        },
        {
          icon: 'outside',
          label: 'Avec un regard extérieur',
          text: 'Reconnaître le moment où il apporte le plus, pour commander et exploiter un diagnostic externe',
        },
      ],
    },
    stepsTitle: 'Quatre temps forts, de l’analyse à l’action',
    steps: [
      {
        icon: 'collect',
        title: 'Cadrer et collecter',
        text: 'Bâtir un diagnostic sur des faits, non sur des impressions.',
      },
      {
        icon: 'structure',
        title: 'Lire l’organisation',
        text: 'Structure, responsabilités et processus à l’épreuve du réel.',
      },
      {
        icon: 'decide',
        title: 'Comprendre et décider',
        text: 'Causes, priorités et choix entre regard interne et regard externe.',
      },
      {
        icon: 'present',
        title: 'Convaincre et agir',
        text: 'Restitution, plan d’action et mise en pratique dans votre structure.',
      },
    ],
    gains: [
      { icon: 'draft', text: 'Une première ébauche de diagnostic de votre propre structure' },
      { icon: 'toolbox', text: 'Un dossier d’outils directement utilisables à votre retour' },
      { icon: 'plan', text: 'Un plan d’action priorisé, à affiner avec vos équipes' },
      {
        icon: 'compass',
        text: 'Des critères pour choisir entre diagnostic interne et diagnostic externe',
      },
    ],
    audience: {
      roles: [
        { icon: 'leader', label: 'Directeurs' },
        { icon: 'structure', label: 'Responsables organisation' },
        { icon: 'quality', label: 'Qualité' },
        { icon: 'people', label: 'Ressources humaines' },
        { icon: 'improvement', label: 'Amélioration continue' },
        { icon: 'manager', label: 'Chefs de service' },
        { icon: 'company', label: 'Dirigeants de PME' },
      ],
      prerequisites: [
        {
          icon: 'experience',
          text: 'Une première expérience d’encadrement ou de fonction transversale',
        },
        {
          icon: 'confidential',
          text: 'Une situation réelle de votre structure à analyser, traitée dans le respect de la confidentialité',
        },
      ],
    },
    includes: {
      items: [
        { icon: 'meal', text: 'Repas et pauses-café' },
        { icon: 'materials', text: 'Supports et outils remis à chaque participant' },
        { icon: 'test', text: 'Test final des connaissances' },
        { icon: 'certificate', text: 'Attestation de participation' },
      ],
      trainer:
        'Un consultant senior en organisation, praticien du diagnostic dans des entreprises publiques et privées.',
    },
    voices: [
      {
        quote: fr(
          'En dix-sept ans de carrière, j’ai assisté à beaucoup de formations génériques qui sont vite oubliées. Avec OPEM, c’est différent : on travaille sur les vrais blocages du terrain et on sort avec des solutions prêtes à l’emploi.',
        ),
        author: 'Participant à une formation OPEM',
      },
      {
        quote:
          'Je repars avec des outils concrets prêts à être appliqués. Merci à l’équipe OPEM pour son sérieux, ses qualités et ses exigences.',
        author: 'Participant à une formation OPEM',
      },
      {
        quote:
          'Contenu dense, supports pédagogiques consistants et clairs. OPEM maîtrise son sujet et respecte parfaitement les objectifs annoncés.',
        author: 'Participant à une formation OPEM',
      },
    ],
  },
];

const AR: TrainingShowcase[] = [
  {
    id: 'diagnostic-d-organisation',
    reference: 'D02-26.INTER.01. V1',
    cycle: 'دورة التسيير',
    title: 'تشخيص التنظيم',
    subtitle: 'رصد مواطن الانسداد وتحسين العمليات.',
    intro:
      'أربعة أيام لتتعلّموا كيف تُجرون تشخيص تنظيم مؤسستكم بأنفسكم، من التأطير إلى عرض النتائج.',
    photo: {
      ...PHOTO,
      alt: 'مشاركون يعملون على وثائق حول طاولة خلال دورة لـ OPEM',
    },
    practical: {
      mode: 'حضوري',
      duration: '4 أيام',
      hours: 'من 9 سا إلى 16 سا',
      seats: 12,
      place: 'مدرسة OPEM',
      city: 'الجزائر العاصمة',
    },
    why: {
      title: 'ملاحظة الانسداد لا تكفي: يجب إثباته، ثم معالجته.',
      symptoms: [
        { icon: 'overlap', text: 'مسؤوليات متداخلة' },
        { icon: 'escalate', text: 'قرارات تعود دائمًا إلى الإدارة' },
        { icon: 'bypass', text: 'عمليات يُلتفّ عليها في الميدان' },
      ],
      answer: 'يمنحكم هذا التكوين المنهجية، من التأطير إلى عرض النتائج، مطبّقة على تنظيم مؤسستكم.',
      edge: [
        { icon: 'inside', label: 'داخليًا', text: 'تُجرون بأنفسكم تشخيصًا خفيفًا ومنتظمًا' },
        {
          icon: 'outside',
          label: 'بنظرة خارجية',
          text: 'تدركون اللحظة التي تكون فيها أجدى، لطلب تشخيص خارجي والاستفادة منه',
        },
      ],
    },
    stepsTitle: 'أربع محطات، من التحليل إلى العمل',
    steps: [
      {
        icon: 'collect',
        title: 'التأطير وجمع المعطيات',
        text: 'بناء تشخيص على الوقائع، لا على الانطباعات.',
      },
      {
        icon: 'structure',
        title: 'قراءة التنظيم',
        text: 'الهيكل والمسؤوليات والعمليات على محكّ الواقع.',
      },
      {
        icon: 'decide',
        title: 'الفهم واتخاذ القرار',
        text: 'الأسباب والأولويات والاختيار بين النظرة الداخلية والنظرة الخارجية.',
      },
      {
        icon: 'present',
        title: 'الإقناع والتنفيذ',
        text: 'عرض النتائج وخطة العمل والتطبيق داخل مؤسستكم.',
      },
    ],
    gains: [
      { icon: 'draft', text: 'مسودة أولى لتشخيص مؤسستكم' },
      { icon: 'toolbox', text: 'ملف أدوات قابلة للاستعمال مباشرة عند عودتكم' },
      { icon: 'plan', text: 'خطة عمل مرتّبة حسب الأولوية، تُستكمل مع فرقكم' },
      { icon: 'compass', text: 'معايير للاختيار بين التشخيص الداخلي والتشخيص الخارجي' },
    ],
    audience: {
      roles: [
        { icon: 'leader', label: 'المديرون' },
        { icon: 'structure', label: 'مسؤولو التنظيم' },
        { icon: 'quality', label: 'الجودة' },
        { icon: 'people', label: 'الموارد البشرية' },
        { icon: 'improvement', label: 'التحسين المستمر' },
        { icon: 'manager', label: 'رؤساء المصالح' },
        { icon: 'company', label: 'مسيّرو المؤسسات الصغيرة والمتوسطة' },
      ],
      prerequisites: [
        { icon: 'experience', text: 'خبرة أولى في التأطير أو في وظيفة عرضية' },
        {
          icon: 'confidential',
          text: 'وضعية حقيقية من مؤسستكم للتحليل، تُعالج في ظل احترام السرية',
        },
      ],
    },
    includes: {
      items: [
        { icon: 'meal', text: 'الوجبات واستراحات القهوة' },
        { icon: 'materials', text: 'الدعائم والأدوات المسلّمة لكل مشارك' },
        { icon: 'test', text: 'اختبار نهائي للمعارف' },
        { icon: 'certificate', text: 'شهادة مشاركة' },
      ],
      trainer: 'مستشار أول في التنظيم، ممارس للتشخيص في مؤسسات عمومية وخاصة.',
    },
    voices: [
      {
        quote:
          'خلال سبعة عشر عامًا من المسار المهني، حضرت الكثير من التكوينات العامة التي تُنسى بسرعة. مع OPEM الأمر مختلف: نعمل على الانسدادات الحقيقية في الميدان ونخرج بحلول جاهزة للتطبيق.',
        author: 'مشارك في تكوين لـ OPEM',
      },
      {
        quote: 'أعود بأدوات ملموسة جاهزة للتطبيق. شكرًا لفريق OPEM على جدّيته وكفاءته وصرامته.',
        author: 'مشارك في تكوين لـ OPEM',
      },
      {
        quote:
          'محتوى كثيف، ودعائم بيداغوجية متينة وواضحة. OPEM تتقن موضوعها وتحترم الأهداف المعلنة تمامًا.',
        author: 'مشارك في تكوين لـ OPEM',
      },
    ],
  },
];

export const showcaseLabels: Record<Lang, ShowcaseLabels> = { fr: LABELS_FR, ar: LABELS_AR };
const SHOWCASES: Record<Lang, TrainingShowcase[]> = { fr: FR, ar: AR };

/** La vitrine d'une formation, ou `undefined` si elle n'en a pas (encore). */
export function findShowcase(lang: Lang, id: string | undefined) {
  return id ? SHOWCASES[lang].find((item) => item.id === id) : undefined;
}

/** Adresses des vitrines (plan du site, référencement). */
export const SHOWCASE_IDS = FR.map((item) => item.id);
