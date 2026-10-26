import type { Lang } from '@/i18n/language';
import type { MenuItem } from '@/lib/wordpress';

export type { MenuItem };

/** Arborescence validée par OPEM : 8 entrées (la charte en prévoyait 6). */
export const MAX_TOP_LEVEL_ITEMS = 8;

/** Cible des boutons « Demander un devis » et « Être rappelé ». */
export const QUOTE_HREF = '/contact';
export const CALLBACK_HREF = '/contact';

/** Encart « Prendre rendez-vous » du méga-menu « prestige ». */
export const APPOINTMENT_HREF = '/contact/demande-de-rendez-vous';

/** Doit correspondre au point de rupture desktop de Navbar.module.css. */
export const DESKTOP_QUERY = '(min-width: 80em)';

type Text = Record<Lang, string>;

type Entry = {
  id: string;
  href?: string;
  label: Text;
  /** Libellé court pour la barre desktop, si le libellé complet est long. */
  shortLabel?: Text;
  description?: Text;
  children?: Entry[];
};

// Menu intégré : utilisé tant que WordPress n'est pas branché (VITE_WP_API_URL),
// ou si l'API WordPress ne répond pas. Arborescence validée par OPEM ;
// descriptions et traductions arabes à faire valider.
const entries: Entry[] = [
  { id: 'accueil', href: '/', label: { fr: 'Accueil', ar: 'الرئيسية' } },
  { id: 'le-cabinet', href: '/le-cabinet', label: { fr: 'Le cabinet', ar: 'المكتب' } },
  {
    id: 'expertises',
    href: '/expertises',
    label: { fr: 'Nos expertises', ar: 'خبراتنا' },
    shortLabel: { fr: 'Expertises', ar: 'خبراتنا' },
    description: {
      fr: 'Du diagnostic à la certification, des missions menées avec méthode.',
      ar: 'من التشخيص إلى الإشهاد، مهام ننجزها بمنهجية.',
    },
    children: [
      {
        id: 'etudes-strategiques',
        href: '/expertises/etudes-strategiques',
        label: { fr: 'Études stratégiques', ar: 'الدراسات الاستراتيجية' },
        description: {
          fr: 'Diagnostic, plans de développement et études de faisabilité.',
          ar: 'التشخيص، مخططات التطوير ودراسات الجدوى.',
        },
      },
      {
        id: 'accompagnement-des-organisations',
        href: '/expertises/accompagnement-des-organisations',
        label: { fr: 'Accompagnement des organisations', ar: 'مرافقة المؤسسات' },
        description: {
          fr: 'Structurer, réorganiser et piloter la performance.',
          ar: 'الهيكلة، إعادة التنظيم وقيادة الأداء.',
        },
        children: [
          {
            id: 'diagnostic-d-entreprise',
            href: '/expertises/accompagnement-des-organisations/diagnostic-d-entreprise',
            label: { fr: 'Diagnostic d’entreprise', ar: 'تشخيص المؤسسة' },
          },
        ],
      },
      {
        id: 'coaching-professionnel',
        href: '/expertises/coaching-professionnel',
        label: { fr: 'Coaching professionnel', ar: 'الكوتشينغ المهني' },
        description: {
          fr: 'Accompagnement individuel des dirigeants et des managers.',
          ar: 'مرافقة فردية للمسيرين والإطارات.',
        },
      },
      {
        id: 'communication-d-entreprise',
        href: '/expertises/communication-d-entreprise',
        label: { fr: 'Communication d’entreprise', ar: 'اتصال المؤسسة' },
        description: {
          fr: 'Image, communication interne et relations institutionnelles.',
          ar: 'الصورة، الاتصال الداخلي والعلاقات المؤسساتية.',
        },
      },
      {
        id: 'certification-et-accreditation',
        href: '/expertises/certification-et-accreditation',
        label: { fr: 'Certification et accréditation', ar: 'الإشهاد والاعتماد' },
        description: {
          fr: 'Préparer et obtenir une norme ISO ou une accréditation.',
          ar: 'التحضير للحصول على شهادة ISO أو اعتماد.',
        },
      },
    ],
  },
  {
    id: 'formation',
    href: '/formation',
    label: { fr: 'Formation qualifiante', ar: 'التكوين التأهيلي' },
    shortLabel: { fr: 'Formation', ar: 'التكوين' },
    description: {
      fr: 'Des formations qualifiantes, en entreprise ou en session.',
      ar: 'تكوينات تأهيلية، داخل المؤسسة أو في دورات.',
    },
    children: [
      {
        id: 'catalogue-et-sessions',
        href: '/formation/catalogue-et-sessions',
        label: { fr: 'Catalogue et sessions', ar: 'الدليل والدورات' },
        description: {
          fr: 'Toutes nos formations et les prochaines dates.',
          ar: 'جميع تكويناتنا والمواعيد القادمة.',
        },
      },
      {
        id: 'fiches-formation',
        href: '/formation/fiches-formation',
        label: { fr: 'Fiches formation', ar: 'بطاقات التكوين' },
        description: {
          fr: 'Programme, objectifs et public de chaque formation.',
          ar: 'البرنامج والأهداف والفئة المعنية بكل تكوين.',
        },
      },
    ],
  },
  {
    id: 'missions',
    href: '/missions',
    label: { fr: 'Missions et réalisations', ar: 'المهام والإنجازات' },
    shortLabel: { fr: 'Réalisations', ar: 'الإنجازات' },
    description: {
      fr: 'Ce que nous avons accompli, avec l’accord de nos clients.',
      ar: 'ما أنجزناه، بموافقة عملائنا.',
    },
    children: [
      {
        id: 'etudes-de-cas',
        href: '/missions/etudes-de-cas',
        label: { fr: 'Études de cas autorisées', ar: 'دراسات حالة مرخّص بها' },
        description: {
          fr: 'Des missions présentées avec l’accord de nos clients.',
          ar: 'مهام نعرضها بموافقة عملائنا.',
        },
      },
      {
        id: 'references-clients',
        href: '/missions/references-clients',
        label: { fr: 'Références clients', ar: 'مراجع العملاء' },
        description: {
          fr: 'Les organisations qui nous font confiance.',
          ar: 'المؤسسات التي تضع ثقتها فينا.',
        },
      },
    ],
  },
  {
    id: 'eclairages',
    href: '/eclairages',
    label: { fr: 'Éclairages', ar: 'إضاءات' },
    description: {
      fr: 'Analyses, points de vue et réponses de nos consultants.',
      ar: 'تحليلات ووجهات نظر وأجوبة مستشارينا.',
    },
    children: [
      {
        id: 'articles-signes',
        href: '/eclairages/articles-signes',
        label: { fr: 'Articles signés', ar: 'مقالات موقّعة' },
        description: {
          fr: 'Analyses et points de vue de nos consultants.',
          ar: 'تحليلات ووجهات نظر مستشارينا.',
        },
        children: [
          {
            id: 'questions-reponses',
            href: '/eclairages/articles-signes/vos-questions-nos-reponses',
            label: { fr: 'Vos questions et nos réponses', ar: 'أسئلتكم وأجوبتنا' },
          },
        ],
      },
    ],
  },
  {
    id: 'actualites',
    href: '/actualites',
    label: { fr: 'Actualités', ar: 'الأخبار' },
    description: {
      fr: 'La vie du cabinet : sessions, interventions et partenariats.',
      ar: 'حياة المكتب: دورات، مداخلات وشراكات.',
    },
    children: [
      {
        id: 'sessions-et-interventions',
        href: '/actualites/sessions-et-interventions',
        label: { fr: 'Sessions et interventions', ar: 'الدورات والمداخلات' },
        description: {
          fr: 'Nos formations récentes et nos prises de parole.',
          ar: 'تكويناتنا الأخيرة ومداخلاتنا.',
        },
      },
      {
        id: 'conventions-et-evenements',
        href: '/actualites/conventions-et-evenements',
        label: { fr: 'Conventions et événements', ar: 'الاتفاقيات والفعاليات' },
        description: {
          fr: 'Partenariats signés, salons et rencontres.',
          ar: 'الشراكات الموقّعة، المعارض واللقاءات.',
        },
      },
    ],
  },
  {
    id: 'contact',
    href: '/contact',
    label: { fr: 'Contact', ar: 'اتصل بنا' },
    description: {
      fr: 'Un rendez-vous, une candidature : écrivez-nous.',
      ar: 'موعد أو ترشح: راسلونا.',
    },
    children: [
      {
        id: 'demande-de-rendez-vous',
        href: '/contact/demande-de-rendez-vous',
        label: { fr: 'Demande de rendez-vous', ar: 'طلب موعد' },
        description: {
          fr: 'Échanger avec un consultant OPEM.',
          ar: 'تحدثوا مع أحد مستشاري OPEM.',
        },
      },
      {
        id: 'rejoindre-notre-reseau',
        href: '/contact/rejoindre-notre-reseau',
        label: { fr: 'Rejoindre notre réseau', ar: 'انضموا إلى شبكتنا' },
        description: {
          fr: 'Consultants et formateurs : proposez votre candidature.',
          ar: 'مستشارون ومكوّنون: قدّموا ترشحكم.',
        },
      },
    ],
  },
];

function localize(entry: Entry, lang: Lang): MenuItem {
  return {
    id: entry.id,
    label: entry.label[lang],
    shortLabel: entry.shortLabel?.[lang],
    href: entry.href,
    description: entry.description?.[lang],
    children: (entry.children ?? []).map((child) => localize(child, lang)),
  };
}

/** Une entrée est active si elle-même ou l'un de ses sous-liens correspond à la page. */
export function isItemActive(item: MenuItem, pathname: string): boolean {
  if (item.href === '/') return pathname === '/';
  if (item.href?.startsWith('/')) {
    if (pathname === item.href || pathname.startsWith(`${item.href}/`)) return true;
  }
  return item.children.some((child) => isItemActive(child, pathname));
}

/** Libellé affiché dans la barre desktop : le court s'il existe, sinon le complet. */
export function barLabel(item: MenuItem) {
  return item.shortLabel ?? item.label;
}

/** L'accueil n'apparaît pas dans la barre desktop : le logo y mène déjà. */
export function isHomeItem(item: MenuItem) {
  return item.href === '/';
}

/** Méga-menu : dès qu'un sous-lien a une description. */
export function isMegaMenu(item: MenuItem) {
  return item.children.some((child) => child.description);
}

export const fallbackMenus: Record<Lang, MenuItem[]> = {
  fr: entries.map((entry) => localize(entry, 'fr')),
  ar: entries.map((entry) => localize(entry, 'ar')),
};
