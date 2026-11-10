import type { DOMAIN_IDS } from '@/features/expertises/content';
import type { Lang } from '@/i18n/language';

/*
 * Textes de la page « Missions et réalisations » (/missions). Structure posée, contenu
 * PROVISOIRE : OPEM le remplacera. Les cas reprennent des faits déjà publiés ailleurs sur le site
 * (références des six domaines de « Nos expertises », étude de cas et témoignages de l'accueil) :
 * rien n'est inventé, mais les intitulés et résumés sont à valider. L'arabe est à faire relire.
 * Les chiffres clés, l'étude de cas détaillée, les logos et les témoignages viennent de
 * homeContent (une seule source).
 */

const N = ' ';
const fr = (text: string) => text.replace(/ ([:;?!])/g, `${N}$1`);

export type DomainId = (typeof DOMAIN_IDS)[number];

/** Type de client, pour le second filtre. */
export type ClientKind = 'public' | 'prive' | 'international';

/** Une photo : la petite version (cartes) et, si elle existe, la grande (carte à la une). */
export type MissionImage = { small: string; large?: string; alt: string };

/** Une mission présentée (avec l'accord du client) : ses domaines, son titre, son client. */
export type MissionCase = {
  id: string;
  domains: DomainId[];
  kind: ClientKind;
  image: MissionImage;
  title: string;
  /** Le client, tel qu'il accepte d'être désigné (souvent anonyme). */
  client: string;
  /** Année ou période ; absente si elle n'est pas confirmée. */
  year?: string;
  text: string;
};

export type MissionsContent = {
  title: string;
  /** En-tête : surtitre, titre (H1), une phrase. */
  header: { eyebrow: string; title: string; lead: string };
  cases: {
    /** Barre des filtres (deux listes déroulantes), nombre de résultats, réinitialisation. */
    filters: {
      label: string;
      domain: string;
      allDomains: string;
      kind: string;
      allKinds: string;
      kinds: Record<ClientKind, string>;
      reset: string;
      count: (n: number) => string;
    };
    more: string;
    empty: string;
    /** Mention sous la liste tant que le contenu n'est pas validé. */
    note: string;
    items: MissionCase[];
  };
};

const FR: MissionsContent = {
  title: 'Missions et réalisations',
  header: {
    eyebrow: 'Missions et réalisations',
    title: 'Études de cas',
    lead: fr(
      'Des missions menées avec méthode, présentées avec l’accord de nos clients : souvent anonymes, toujours vérifiables.',
    ),
  },
  cases: {
    filters: {
      label: 'Filtrer les études de cas',
      domain: 'Domaine',
      allDomains: 'Tous les domaines',
      kind: 'Type de client',
      allKinds: 'Tous les clients',
      kinds: {
        public: 'Organisations publiques',
        prive: 'Entreprises privées',
        international: 'Partenaires internationaux',
      },
      reset: 'Réinitialiser',
      count: (n) => (n > 1 ? `${n} études de cas` : `${n} étude de cas`),
    },
    more: 'Afficher plus',
    empty: 'Aucune étude de cas ne correspond à ces filtres pour le moment.',
    note: 'Contenu provisoire, à valider par OPEM.',
    items: [
      {
        id: 'audit-et-plan-de-formation',
        kind: 'public',
        image: {
          small: '/images/sessions/salle-conference-700.webp',
          large: '/images/sessions/salle-conference.webp',
          alt: 'Session de travail OPEM : les participants autour d’une grande table de réunion, l’animateur debout devant l’écran',
        },
        domains: ['accompagnement-des-organisations', 'formation-qualifiante'],
        title: 'Un audit approuvé à l’unanimité, puis tout le plan de formation confié à OPEM',
        client: 'Entreprise publique économique',
        year: '2021–2023',
        text: fr(
          'L’audit organisationnel et fonctionnel de sa structure, approuvé à l’unanimité par son conseil d’administration ; deux ans plus tard, 100 % de son plan de formation annuel.',
        ),
      },
      {
        id: 'un-client-quatre-metiers',
        kind: 'public',
        image: {
          small: '/images/sessions/formateur-btph-700.webp',
          large: '/images/sessions/formateur-btph.webp',
          alt: 'Un formateur d’OPEM debout face aux participants d’une session, dans une salle de formation',
        },
        domains: [
          'accompagnement-des-organisations',
          'formation-qualifiante',
          'communication-institutionnelle',
          'certification-et-accreditation',
        ],
        title: 'Un client, quatre métiers',
        client: 'Entreprise publique économique du BTPH',
        text: fr(
          'Ses catalogues institutionnels, la formation de ses équipes et le renforcement de leurs compétences sur son système de management intégré, puis des études organisationnelles et sa gestion prévisionnelle des emplois et des compétences.',
        ),
      },
      {
        id: 'mortalite-des-entreprises',
        kind: 'international',
        image: {
          small: '/images/domaines/etudes-strategiques-700.webp',
          large: '/images/domaines/etudes-strategiques.webp',
          alt: 'Deux consultants échangent devant un tableau blanc couvert de notes',
        },
        domains: ['etudes-strategiques'],
        title: 'Repérer tôt les entreprises en difficulté',
        client: 'GIZ, au profit du ministère de l’Industrie',
        text: 'Une étude sur la mortalité des entreprises, afin de repérer précocement celles en difficulté.',
      },
      {
        id: 'formation-a-l-entrepreneuriat',
        kind: 'international',
        image: {
          small: '/images/sessions/disposition-en-u-700.webp',
          large: '/images/sessions/disposition-en-u.webp',
          alt: 'Une session en disposition en U : les participants face à l’animateur, au fond de la salle',
        },
        domains: ['etudes-strategiques'],
        title: 'Les dispositifs de formation à l’entrepreneuriat, au crible',
        client: 'GIZ, au profit du ministère de la Formation et de l’Enseignement professionnels',
        text: 'Un diagnostic des dispositifs de formation à l’entrepreneuriat.',
      },
      {
        id: 'structure-organisationnelle',
        kind: 'public',
        image: {
          small: '/images/expertises/relais-accompagnement-700.webp',
          large: '/images/expertises/relais-accompagnement.webp',
          alt: 'Un atelier : une équipe organise des notes adhésives sur une paroi vitrée',
        },
        domains: ['accompagnement-des-organisations'],
        title: 'Une structure et des postes revus',
        client: 'Agence publique',
        text: 'La révision de la structure organisationnelle et des postes.',
      },
      {
        id: 'systeme-de-management-integre',
        kind: 'prive',
        image: {
          small: '/images/expertises/relais-certification-700.webp',
          large: '/images/expertises/relais-certification.webp',
          alt: 'Une ingénieure en casque de chantier consulte une liste de contrôle sur un site industriel',
        },
        domains: ['certification-et-accreditation'],
        title: 'Trois normes conduites de front',
        client: 'Entreprise industrielle privée',
        year: '2025',
        text: fr(
          'Son système de management intégré (ISO 9001, 14001 et 45001), mis en place dans le respect des délais et des exigences de qualité convenus.',
        ),
      },
      {
        id: 'catalogues-institutionnels',
        kind: 'public',
        image: {
          small: '/images/expertises/relais-communication-700.webp',
          large: '/images/expertises/relais-communication.webp',
          alt: 'Deux personnes feuillettent un catalogue imprimé, à côté d’un ordinateur portable et d’un nuancier',
        },
        domains: ['communication-institutionnelle'],
        title: 'Des catalogues institutionnels signés OPEM',
        client: 'SAPTA et SNTP',
        text: 'Leurs catalogues institutionnels, entièrement rédigés, conçus et imprimés par nos soins.',
      },
      {
        id: 'formation-office-public',
        kind: 'public',
        image: {
          small: '/images/sessions/communication-interpersonnelle-700.webp',
          large: '/images/sessions/communication-interpersonnelle.webp',
          alt: 'Une session de formation : les participants assis face à l’écran, la formatrice debout',
        },
        domains: ['formation-qualifiante'],
        title: 'Une formation conduite avec diligence',
        client: 'Office public national',
        year: '2024',
        text: fr(
          'Une formation menée dans les meilleures conditions, sur les plans logistique et organisationnel comme dans le choix du formateur.',
        ),
      },
    ],
  },
};

const AR: MissionsContent = {
  title: 'المهام والإنجازات',
  header: {
    eyebrow: 'المهام والإنجازات',
    title: 'دراسات الحالة',
    lead: 'مهام نُنجزها بمنهجية، ونعرضها بموافقة عملائنا: غالبًا دون ذكر أسمائهم، وقابلة للتحقق دائمًا.',
  },
  cases: {
    filters: {
      label: 'تصفية دراسات الحالة',
      domain: 'المجال',
      allDomains: 'كل المجالات',
      kind: 'نوع العميل',
      allKinds: 'كل العملاء',
      kinds: {
        public: 'مؤسسات عمومية',
        prive: 'مؤسسات خاصة',
        international: 'شركاء دوليون',
      },
      reset: 'إعادة الضبط',
      count: (n) => `${n} ${n > 2 && n < 11 ? 'دراسات حالة' : 'دراسة حالة'}`,
    },
    more: 'عرض المزيد',
    empty: 'لا توجد دراسة حالة تطابق هذه المعايير حاليًا.',
    note: 'محتوى مؤقت، ينتظر مصادقة OPEM.',
    items: [
      {
        id: 'audit-et-plan-de-formation',
        kind: 'public',
        image: {
          small: '/images/sessions/salle-conference-700.webp',
          large: '/images/sessions/salle-conference.webp',
          alt: 'جلسة عمل لـ OPEM: المشاركون حول طاولة اجتماعات كبيرة، والمنشّط واقف أمام الشاشة',
        },
        domains: ['accompagnement-des-organisations', 'formation-qualifiante'],
        title: 'تدقيق صودق عليه بالإجماع، ثم خطة التكوين بأكملها أُسندت إلى OPEM',
        client: 'مؤسسة عمومية اقتصادية',
        year: '2021–2023',
        text: 'التدقيق التنظيمي والوظيفي لهيكلها، وقد صادق عليه مجلس إدارتها بالإجماع؛ وبعد سنتين، خطتها السنوية للتكوين بنسبة 100 %.',
      },
      {
        id: 'un-client-quatre-metiers',
        kind: 'public',
        image: {
          small: '/images/sessions/formateur-btph-700.webp',
          large: '/images/sessions/formateur-btph.webp',
          alt: 'مكوّن من OPEM واقف أمام المشاركين في دورة، داخل قاعة تكوين',
        },
        domains: [
          'accompagnement-des-organisations',
          'formation-qualifiante',
          'communication-institutionnelle',
          'certification-et-accreditation',
        ],
        title: 'عميل واحد، أربع مهن',
        client: 'مؤسسة عمومية اقتصادية في قطاع البناء والأشغال العمومية والري',
        text: 'دلائلها المؤسساتية، وتكوين فرقها وتعزيز كفاءاتهم في نظام إدارتها المدمج، ثم دراسات تنظيمية وتسييرها التقديري للوظائف والكفاءات.',
      },
      {
        id: 'mortalite-des-entreprises',
        kind: 'international',
        image: {
          small: '/images/domaines/etudes-strategiques-700.webp',
          large: '/images/domaines/etudes-strategiques.webp',
          alt: 'مستشاران يتحاوران أمام سبورة بيضاء مليئة بالملاحظات',
        },
        domains: ['etudes-strategiques'],
        title: 'الكشف المبكر عن المؤسسات المتعثرة',
        client: 'الوكالة الألمانية للتعاون الدولي (GIZ)، لفائدة وزارة الصناعة',
        text: 'دراسة حول اندثار المؤسسات قصد الكشف المبكر عن المتعثرة منها.',
      },
      {
        id: 'formation-a-l-entrepreneuriat',
        kind: 'international',
        image: {
          small: '/images/sessions/disposition-en-u-700.webp',
          large: '/images/sessions/disposition-en-u.webp',
          alt: 'دورة بترتيب على شكل U: المشاركون في مواجهة المنشّط في عمق القاعة',
        },
        domains: ['etudes-strategiques'],
        title: 'أجهزة التكوين في المقاولاتية تحت المجهر',
        client: 'الوكالة الألمانية للتعاون الدولي (GIZ)، لفائدة وزارة التكوين والتعليم المهنيين',
        text: 'تشخيص أجهزة التكوين في المقاولاتية.',
      },
      {
        id: 'structure-organisationnelle',
        kind: 'public',
        image: {
          small: '/images/expertises/relais-accompagnement-700.webp',
          large: '/images/expertises/relais-accompagnement.webp',
          alt: 'ورشة عمل: فريق يرتّب ملاحظات لاصقة على جدار زجاجي',
        },
        domains: ['accompagnement-des-organisations'],
        title: 'هيكل ومناصب أُعيد النظر فيها',
        client: 'وكالة عمومية',
        text: 'مراجعة الهيكل التنظيمي والمناصب.',
      },
      {
        id: 'systeme-de-management-integre',
        kind: 'prive',
        image: {
          small: '/images/expertises/relais-certification-700.webp',
          large: '/images/expertises/relais-certification.webp',
          alt: 'مهندسة بخوذة ورشة تراجع قائمة تدقيق في موقع صناعي',
        },
        domains: ['certification-et-accreditation'],
        title: 'ثلاث مواصفات في آن واحد',
        client: 'مؤسسة صناعية خاصة',
        year: '2025',
        text: 'نظام إدارتها المدمج (ISO 9001 و14001 و45001)، أُرسي في احترام للآجال ولمتطلبات الجودة المتفق عليها.',
      },
      {
        id: 'catalogues-institutionnels',
        kind: 'public',
        image: {
          small: '/images/expertises/relais-communication-700.webp',
          large: '/images/expertises/relais-communication.webp',
          alt: 'شخصان يتصفّحان دليلًا مطبوعًا بجانب حاسوب محمول ولوحة ألوان',
        },
        domains: ['communication-institutionnelle'],
        title: 'دلائل مؤسساتية بتوقيع OPEM',
        client: 'SAPTA وSNTP',
        text: 'دلائلهما المؤسساتية، حرّرناها وصمّمناها وطبعناها بالكامل.',
      },
      {
        id: 'formation-office-public',
        kind: 'public',
        image: {
          small: '/images/sessions/communication-interpersonnelle-700.webp',
          large: '/images/sessions/communication-interpersonnelle.webp',
          alt: 'دورة تكوينية: المشاركون جالسون أمام الشاشة، والمكوّنة واقفة',
        },
        domains: ['formation-qualifiante'],
        title: 'تكوين أُنجز بعناية',
        client: 'ديوان عمومي وطني',
        year: '2024',
        text: 'تكوين جرى في أفضل الظروف، من الناحيتين اللوجستية والتنظيمية كما في اختيار المكوّن.',
      },
    ],
  },
};

export const missionsContent: Record<Lang, MissionsContent> = { fr: FR, ar: AR };
