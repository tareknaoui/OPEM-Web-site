import type { Lang } from '@/i18n/language';

/*
 * Textes de la page « Certification et accréditation » (/expertises/certification-et-
 * accreditation). L'accroche, la promesse et les deux références reprennent « Nos expertises » ;
 * la réponse sur l'impartialité reprend la FAQ de l'accueil. Les référentiels suivent la
 * typologie d'OPEM (normes ISO, marquage CE, Halal, référentiel accueil, TEDJ, accréditation des
 * laboratoires et des organismes) ; leurs descriptions s'appuient sur les sources officielles
 * (IANOR : marque TEDJ, label accueil « Fi Khidmatikoum », Halal selon la NA 6184 ; ALGERAC
 * pour l'accréditation). Le reste est proposé par l'agence, à faire valider par OPEM. L'arabe
 * est à faire relire. Photos : Pexels (licence libre), en WebP (public/images/certification).
 *
 * Les badges (CertBadge) sont dessinés pour le site : ce ne sont pas les logos officiels
 * (marques déposées d'ISO, de l'IANOR…), qu'un cabinet de conseil ne peut pas afficher comme
 * les siens. Seul le marquage CE, symbole réglementaire public, est reproduit.
 */

const N = ' ';
/** Typographie française : espace insécable avant « : ; ? ! ». */
const fr = (text: string) => text.replace(/ ([:;?!])/g, `${N}$1`);

type Photo = { src: string; small: string; alt: string };

/** Le badge d'un référentiel : sa forme, puis ce qu'il affiche. */
export type Badge =
  | { kind: 'iso'; code: string; tone: 'night' | 'blue' | 'green' }
  | { kind: 'ce' }
  | { kind: 'tedj' }
  | { kind: 'halal' }
  | { kind: 'accueil' };

export type Certification = {
  name: string;
  /** Ce que le référentiel atteste. */
  scope: string;
  /** À qui il s'adresse. */
  audience: string;
  badge: Badge;
};

export type CertificationFamily = {
  id: string;
  title: string;
  lead: string;
  photo: Photo;
  items: Certification[];
};

export type CertificationContent = {
  title: string;
  hero: {
    trail: { label: string; href: string };
    eyebrow: string;
    title: string;
    lead: string;
    primary: string;
    secondary: string;
    photo: Photo;
  };
  /** Le bandeau des badges, qui défile sous le haut de page. */
  ribbonLabel: string;
  catalogue: {
    eyebrow: string;
    title: string;
    lead: string;
    audienceLabel: string;
    note: string;
    families: CertificationFamily[];
  };
  impartiality: { quote: string; text: string; photo: Photo };
  path: {
    eyebrow: string;
    title: string;
    steps: { title: string; text: string }[];
    training: { label: string; title: string; href: string };
  };
  references: {
    eyebrow: string;
    title: string;
    items: { title: string; client: string; year?: string; text: string; norms: string[] }[];
  };
  faq: { eyebrow: string; title: string; items: { question: string; answer: string }[] };
};

const photo = (name: string, alt: string): Photo => ({
  src: `/images/certification/${name}.webp`,
  small: `/images/certification/${name}-800.webp`,
  alt,
});

/** Les ancres de la page : le catalogue (second bouton du haut de page) et ses familles. */
export const CATALOGUE_ID = 'certifications';
export const FAMILY_IDS = ['systemes-de-management', 'produits-et-services', 'accreditation'];

const ISO_9001: Badge = { kind: 'iso', code: '9001', tone: 'night' };
const ISO_14001: Badge = { kind: 'iso', code: '14001', tone: 'green' };
const ISO_45001: Badge = { kind: 'iso', code: '45001', tone: 'blue' };
const ISO_17025: Badge = { kind: 'iso', code: '17025', tone: 'night' };
const ISO_17020: Badge = { kind: 'iso', code: '17020', tone: 'blue' };

/** Les badges du bandeau, dans l'ordre du catalogue. */
export const RIBBON: Badge[] = [
  ISO_9001,
  ISO_14001,
  ISO_45001,
  { kind: 'ce' },
  { kind: 'tedj' },
  { kind: 'halal' },
  { kind: 'accueil' },
  ISO_17025,
  ISO_17020,
];

const FR: CertificationContent = {
  title: 'Certification et accréditation',
  hero: {
    trail: { label: 'Nos expertises', href: '/nos-expertises' },
    eyebrow: 'Certification et accréditation',
    title: fr('Un certificat rassure ; une pratique convainc.'),
    lead: 'Nos experts traduisent la norme en gestes de travail, préparent vos audits et vous mènent jusqu’à la certification, pour que vous méritiez durablement la confiance.',
    primary: 'Préparer votre certification',
    secondary: 'Voir les certifications',
    photo: photo(
      'inspection',
      'Un inspecteur en casque et gilet de sécurité remplit sa liste de contrôle sur un site industriel',
    ),
  },
  ribbonLabel: 'Les référentiels que nous préparons',
  catalogue: {
    eyebrow: 'Les certifications que nous préparons',
    title: 'Dix référentiels, un même chemin vers la confiance.',
    lead: 'Normes internationales, marques nationales, labels de service, accréditations : quel que soit le référentiel, nous vous y conduisons, de la première analyse au certificat.',
    audienceLabel: 'Pour qui',
    note: 'Les certificats sont délivrés par des organismes habilités. Les badges ci-dessus illustrent les référentiels ; les marques officielles appartiennent à leurs titulaires.',
    families: [
      {
        id: 'systemes-de-management',
        title: 'Systèmes de management',
        lead: 'Des normes internationales pour organiser, piloter et améliorer votre activité. Elles se combinent en un seul système de management intégré.',
        photo: photo(
          'systemes-de-management',
          'Une ingénieure en casque consulte sa tablette dans un grand atelier industriel',
        ),
        items: [
          {
            name: 'ISO 9001',
            scope:
              'Management de la qualité : maîtriser vos processus et la satisfaction de vos clients.',
            audience: 'Toute organisation, quels que soient sa taille et son secteur.',
            badge: ISO_9001,
          },
          {
            name: 'ISO 14001',
            scope:
              'Management environnemental : maîtriser vos impacts et respecter vos obligations.',
            audience: 'Industrie, BTP, énergie, services.',
            badge: ISO_14001,
          },
          {
            name: 'ISO 45001',
            scope:
              'Santé et sécurité au travail : prévenir les accidents et les maladies professionnelles.',
            audience: 'Toute organisation dont les équipes sont exposées à des risques.',
            badge: ISO_45001,
          },
        ].map((item) => ({ ...item, scope: fr(item.scope) })),
      },
      {
        id: 'produits-et-services',
        title: 'Produits et services',
        lead: 'Des marques et des labels qui attestent la conformité de vos produits et la qualité de vos services, en Algérie comme à l’export.',
        photo: photo(
          'produits',
          'Dans un atelier agroalimentaire, une opératrice en charlotte, tablier et gants contrôle la production',
        ),
        items: [
          {
            name: 'Marquage CE',
            scope:
              'La conformité aux exigences européennes, condition d’accès au marché de l’Union européenne.',
            audience: 'Fabricants et exportateurs de produits industriels.',
            badge: { kind: 'ce' },
          },
          {
            name: 'Marque TEDJ',
            scope:
              'La marque nationale de conformité des produits aux normes algériennes, délivrée par l’IANOR.',
            audience: 'Fabricants de produits destinés au marché algérien.',
            badge: { kind: 'tedj' },
          },
          {
            name: 'Certification Halal',
            scope: `La conformité à la norme algérienne NA${N}6184, attestée par l’IANOR.`,
            audience: 'Industrie agroalimentaire et services associés.',
            badge: { kind: 'halal' },
          },
          {
            name: `Label accueil «${N}Fi${N}Khidmatikoum${N}»`,
            scope:
              'La qualité de l’accueil dans les services publics, selon le référentiel de l’IANOR.',
            audience: 'Administrations et établissements publics.',
            badge: { kind: 'accueil' },
          },
        ],
      },
      {
        id: 'accreditation',
        title: 'Accréditation',
        lead: 'L’accréditation reconnaît la compétence technique d’un laboratoire ou d’un organisme d’évaluation. En Algérie, elle est délivrée par ALGERAC.',
        photo: photo(
          'laboratoire',
          'Une technicienne de laboratoire, en blouse, charlotte et gants, prépare des échantillons',
        ),
        items: [
          {
            name: 'ISO/IEC 17025',
            scope: 'La compétence des laboratoires d’essais et d’étalonnage.',
            audience: 'Laboratoires publics et privés.',
            badge: ISO_17025,
          },
          {
            name: 'ISO/IEC 17020',
            scope: 'La compétence des organismes d’inspection.',
            audience: 'Organismes de contrôle et d’inspection.',
            badge: ISO_17020,
          },
        ],
      },
    ],
  },
  impartiality: {
    quote: 'Celui qui vous prépare ne peut pas être celui qui vous évalue.',
    text: 'Les certifications sont délivrées par des organismes habilités. Notre rôle consiste à vous y conduire, de la mise en conformité aux audits à blanc. Vous abordez ainsi l’audit avec un système qui fonctionne déjà.',
    photo: photo(
      'revue-documents',
      'Autour d’une table, des mains passent en revue des documents et des tableaux de résultats',
    ),
  },
  path: {
    eyebrow: 'Notre démarche',
    title: 'Six étapes, de l’écart constaté au certificat obtenu.',
    steps: [
      {
        title: 'Diagnostic',
        text: 'Nous mesurons l’écart entre vos pratiques et les exigences du référentiel, point par point.',
      },
      {
        title: 'Plan d’action',
        text: 'Nous hiérarchisons les chantiers et fixons avec vous un calendrier réaliste jusqu’à l’audit.',
      },
      {
        title: 'Mise en conformité',
        text: fr(
          'Processus, documentation, enregistrements : nous bâtissons avec vos équipes un système simple, fidèle à votre réalité.',
        ),
      },
      {
        title: 'Formation des équipes',
        text: fr(
          'Chacun comprend ce que la norme attend de lui, et pourquoi : la conformité devient un réflexe.',
        ),
      },
      {
        title: 'Audit à blanc',
        text: 'Un audit dans les conditions réelles, pour corriger avant que l’auditeur ne constate.',
      },
      {
        title: 'Certification et suivi',
        text: 'Nous vous accompagnons pendant l’audit, levons les éventuelles non-conformités et préparons les audits de suivi.',
      },
    ],
    training: {
      label: 'Former vos équipes à la nouvelle version',
      title: 'Formation ISO 9001:2026',
      href: '/formation/fiches-formation/iso-9001-2026',
    },
  },
  references: {
    eyebrow: 'Références',
    title: 'Ils nous ont confié leur certification.',
    items: [
      {
        title: 'Trois normes conduites de front',
        client: 'Entreprise industrielle privée',
        year: '2025',
        text: 'Son système de management intégré, mis en place dans le respect des délais et des exigences de qualité convenus.',
        norms: ['ISO 9001', 'ISO 14001', 'ISO 45001'],
      },
      {
        title: 'Des non-conformités levées',
        client: 'Entreprise publique',
        text: 'La levée des non-conformités de son système de management, pour aborder sereinement l’audit suivant.',
        norms: ['Levée des non-conformités'],
      },
    ],
  },
  faq: {
    eyebrow: 'Questions fréquentes',
    title: 'Avant de vous engager.',
    items: [
      {
        question: fr('Délivrez-vous vous-mêmes les certifications ISO, Halal ou TEDJ ?'),
        answer: fr(
          'Non, et c’est une garantie pour vous : celui qui vous prépare ne peut pas être celui qui vous évalue. Les certifications sont délivrées par des organismes habilités. Notre rôle consiste à vous y conduire, de la mise en conformité aux audits à blanc, en passant par la documentation et la formation des équipes. Vous abordez ainsi l’audit avec un système qui fonctionne déjà.',
        ),
      },
      {
        question: fr('Combien de temps faut-il pour être certifié ?'),
        answer:
          'Tout dépend de votre point de départ, de la taille de votre organisation et du référentiel visé. Le diagnostic initial permet de fixer un calendrier réaliste, que nous tenons ensemble.',
      },
      {
        question: fr('Faut-il produire beaucoup de documents ?'),
        answer: fr(
          'Le strict nécessaire. Une documentation utile décrit ce que vous faites réellement : elle sert vos équipes avant de servir l’auditeur.',
        ),
      },
      {
        question: fr('Que se passe-t-il après la certification ?'),
        answer:
          'Un certificat ISO est valable trois ans, avec un audit de surveillance chaque année. Nous pouvons vous accompagner dans la durée, pour que votre système reste vivant et que chaque audit se passe sans surprise.',
      },
      {
        question: fr('Intervenez-vous sur un système déjà certifié ?'),
        answer:
          'Oui. Levée des non-conformités, préparation d’un renouvellement, passage à une nouvelle version de la norme : nous reprenons votre système là où il en est.',
      },
    ],
  },
};

const AR: CertificationContent = {
  title: 'الإشهاد والاعتماد',
  hero: {
    trail: { label: 'خبراتنا', href: '/nos-expertises' },
    eyebrow: 'الإشهاد والاعتماد',
    title: 'الشهادة تطمئن؛ والممارسة تقنع.',
    lead: 'يترجم خبراؤنا المواصفة إلى ممارسات عمل، ويحضّرون عمليات التدقيق، ويرافقونكم حتى الحصول على الشهادة، لتستحقوا الثقة على الدوام.',
    primary: 'حضّروا شهادتكم',
    secondary: 'اطّلعوا على الشهادات',
    photo: photo('inspection', 'مفتّش بخوذة وسترة أمان يملأ قائمة التدقيق في موقع صناعي'),
  },
  ribbonLabel: 'المرجعيات التي نحضّر لها',
  catalogue: {
    eyebrow: 'الشهادات التي نحضّر لها',
    title: 'عشر مرجعيات، وطريق واحد نحو الثقة.',
    lead: 'مواصفات دولية، وعلامات وطنية، وعلامات جودة للخدمات، واعتمادات: مهما كانت المرجعية، نرافقكم إليها من التحليل الأول حتى الشهادة.',
    audienceLabel: 'لمن',
    note: 'تمنح الشهادات هيئات مؤهّلة. توضّح الشارات أعلاه المرجعيات؛ أمّا العلامات الرسمية فهي ملك لأصحابها.',
    families: [
      {
        id: 'systemes-de-management',
        title: 'أنظمة الإدارة',
        lead: 'مواصفات دولية لتنظيم نشاطكم وقيادته وتحسينه. وتجتمع في نظام إدارة مدمج واحد.',
        photo: photo(
          'systemes-de-management',
          'مهندسة بخوذة تراجع لوحتها الرقمية في ورشة صناعية كبيرة',
        ),
        items: [
          {
            name: 'ISO 9001',
            scope: 'إدارة الجودة: التحكّم في عملياتكم وفي رضا زبائنكم.',
            audience: 'كلّ مؤسسة، مهما كان حجمها وقطاعها.',
            badge: ISO_9001,
          },
          {
            name: 'ISO 14001',
            scope: 'الإدارة البيئية: التحكّم في آثاركم واحترام التزاماتكم.',
            audience: 'الصناعة، والبناء والأشغال العمومية، والطاقة، والخدمات.',
            badge: ISO_14001,
          },
          {
            name: 'ISO 45001',
            scope: 'الصحة والسلامة المهنية: الوقاية من حوادث العمل والأمراض المهنية.',
            audience: 'كلّ مؤسسة تتعرّض فرقها للمخاطر.',
            badge: ISO_45001,
          },
        ],
      },
      {
        id: 'produits-et-services',
        title: 'المنتجات والخدمات',
        lead: 'علامات وشارات تشهد بمطابقة منتجاتكم وجودة خدماتكم، في الجزائر كما في التصدير.',
        photo: photo(
          'produits',
          'في ورشة للصناعات الغذائية، عاملة بغطاء رأس ومئزر وقفازات تراقب الإنتاج',
        ),
        items: [
          {
            name: 'علامة CE',
            scope: 'المطابقة للمتطلبات الأوروبية، شرط النفاذ إلى سوق الاتحاد الأوروبي.',
            audience: 'مصنّعو المنتجات الصناعية ومصدّروها.',
            badge: { kind: 'ce' },
          },
          {
            name: 'علامة تاج (TEDJ)',
            scope:
              'العلامة الوطنية لمطابقة المنتجات للمواصفات الجزائرية، يمنحها المعهد الجزائري للتقييس.',
            audience: 'مصنّعو المنتجات الموجّهة إلى السوق الجزائرية.',
            badge: { kind: 'tedj' },
          },
          {
            name: 'شهادة حلال',
            scope: 'المطابقة للمواصفة الجزائرية NA 6184، يشهد بها المعهد الجزائري للتقييس.',
            audience: 'الصناعات الغذائية والخدمات المرتبطة بها.',
            badge: { kind: 'halal' },
          },
          {
            name: 'علامة الاستقبال «في خدمتكم»',
            scope: 'جودة الاستقبال في المرافق العمومية، وفق مرجعية المعهد الجزائري للتقييس.',
            audience: 'الإدارات والمؤسسات العمومية.',
            badge: { kind: 'accueil' },
          },
        ],
      },
      {
        id: 'accreditation',
        title: 'الاعتماد',
        lead: 'يعترف الاعتماد بالكفاءة التقنية لمخبر أو لهيئة تقييم. وفي الجزائر، تمنحه الهيئة الجزائرية للاعتماد (ALGERAC).',
        photo: photo('laboratoire', 'تقنية مخبر بمئزر وغطاء رأس وقفازات تحضّر عيّنات'),
        items: [
          {
            name: 'ISO/IEC 17025',
            scope: 'كفاءة مخابر التجارب والمعايرة.',
            audience: 'المخابر العمومية والخاصة.',
            badge: ISO_17025,
          },
          {
            name: 'ISO/IEC 17020',
            scope: 'كفاءة هيئات التفتيش.',
            audience: 'هيئات المراقبة والتفتيش.',
            badge: ISO_17020,
          },
        ],
      },
    ],
  },
  impartiality: {
    quote: 'من يحضّركم لا يمكن أن يكون من يقيّمكم.',
    text: 'تمنح الشهادات هيئات مؤهّلة. ودورنا أن نقودكم إليها، من المطابقة إلى التدقيق التجريبي. فتخوضون التدقيق بنظام يعمل فعلًا.',
    photo: photo('revue-documents', 'حول طاولة، أيادٍ تراجع وثائق وجداول نتائج'),
  },
  path: {
    eyebrow: 'منهجيتنا',
    title: 'ستّ مراحل، من الفجوة المرصودة إلى الشهادة المحصّلة.',
    steps: [
      { title: 'التشخيص', text: 'نقيس الفجوة بين ممارساتكم ومتطلبات المرجعية، نقطة بنقطة.' },
      {
        title: 'خطة العمل',
        text: 'نرتّب الورشات حسب الأولوية ونحدّد معكم رزنامة واقعية حتى التدقيق.',
      },
      {
        title: 'المطابقة',
        text: 'العمليات، والتوثيق، والسجلات: نبني مع فرقكم نظامًا بسيطًا، وفيًّا لواقعكم.',
      },
      {
        title: 'تكوين الفرق',
        text: 'يفهم كلّ واحد ما تنتظره منه المواصفة، ولماذا: فتصبح المطابقة عادة.',
      },
      {
        title: 'التدقيق التجريبي',
        text: 'تدقيق في الظروف الحقيقية، للتصحيح قبل أن يلاحظ المدقّق.',
      },
      {
        title: 'الإشهاد والمتابعة',
        text: 'نرافقكم أثناء التدقيق، ونرفع حالات عدم المطابقة المحتملة، ونحضّر تدقيقات المتابعة.',
      },
    ],
    training: {
      label: 'كوّنوا فرقكم على النسخة الجديدة',
      title: 'تكوين ISO 9001:2026',
      href: '/formation/fiches-formation/iso-9001-2026',
    },
  },
  references: {
    eyebrow: 'مراجع',
    title: 'أوكلوا إلينا إشهادهم.',
    items: [
      {
        title: 'ثلاث مواصفات في آن واحد',
        client: 'مؤسسة صناعية خاصة',
        year: '2025',
        text: 'نظام إدارتها المدمج، أُرسي في احترام للآجال ولمتطلبات الجودة المتفق عليها.',
        norms: ['ISO 9001', 'ISO 14001', 'ISO 45001'],
      },
      {
        title: 'حالات عدم مطابقة مرفوعة',
        client: 'مؤسسة عمومية',
        text: 'رفع حالات عدم المطابقة في نظام إدارتها، لخوض التدقيق الموالي بطمأنينة.',
        norms: ['رفع حالات عدم المطابقة'],
      },
    ],
  },
  faq: {
    eyebrow: 'أسئلة شائعة',
    title: 'قبل أن تلتزموا.',
    items: [
      {
        question: 'هل تمنحون بأنفسكم شهادات ISO أو حلال أو تاج؟',
        answer:
          'لا، وهذا ضمان لكم: من يحضّركم لا يمكن أن يكون من يقيّمكم. تمنح الشهادات هيئات مؤهّلة. ودورنا أن نقودكم إليها، من المطابقة إلى التدقيق التجريبي، مرورًا بالتوثيق وتكوين الفرق. فتخوضون التدقيق بنظام يعمل فعلًا.',
      },
      {
        question: 'كم من الوقت يلزم للحصول على الشهادة؟',
        answer:
          'يتوقّف ذلك على نقطة انطلاقكم، وحجم مؤسستكم، والمرجعية المستهدفة. ويتيح التشخيص الأوّلي تحديد رزنامة واقعية نلتزم بها معًا.',
      },
      {
        question: 'هل يجب إعداد وثائق كثيرة؟',
        answer:
          'الضروري فقط. التوثيق المفيد يصف ما تقومون به فعلًا: يخدم فرقكم قبل أن يخدم المدقّق.',
      },
      {
        question: 'ماذا يحدث بعد الحصول على الشهادة؟',
        answer:
          'شهادة ISO صالحة لثلاث سنوات، مع تدقيق مراقبة كلّ سنة. ويمكننا مرافقتكم على المدى الطويل، ليبقى نظامكم حيًّا ويمرّ كلّ تدقيق دون مفاجآت.',
      },
      {
        question: 'هل تتدخّلون في نظام حاصل على الشهادة؟',
        answer:
          'نعم. رفع حالات عدم المطابقة، والتحضير للتجديد، والانتقال إلى نسخة جديدة من المواصفة: نستأنف العمل على نظامكم حيث وصل.',
      },
    ],
  },
};

export const certificationContent: Record<Lang, CertificationContent> = { fr: FR, ar: AR };
