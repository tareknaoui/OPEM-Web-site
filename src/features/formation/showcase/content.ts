import type { Lang } from '@/i18n/language';

/*
 * Pages des formations inter-entreprises (/formation/fiches-formation/<id>).
 *
 * Modèle unique retenu par OPEM (maquettes du 17 novembre 2026, variante 4 « fond clair, scène
 * bleu nuit ») : chaque formation a la même page ; seuls changent les textes, l'illustration et
 * la référence de son entrée ci-dessous. Les dates viennent de l'agenda
 * (homeContent.trainings.items, même `id`) : une seule source, l'agenda et la page ne peuvent
 * pas se contredire. Sans session programmée, la page affiche « Dates : sur demande ».
 *
 * La page n'affiche ni le tarif ni le programme détaillé : la fiche technique n'est jamais
 * envoyée automatiquement, le service formation examine chaque demande (formulaire du bas de
 * page, serveur : wordpress/opem-forms-api.php, point d'accès « demande-formation »).
 *
 * Textes français définitifs (maquettes d'OPEM). L'arabe est à faire relire.
 * À PRÉCISER par OPEM : la destination du lien « Confier… » de « Plan de formation 2027 »
 * (provisoirement la page « Formation qualifiante ») et de « Cybersécurité opérationnelle »
 * (provisoirement « Conformité et protection des données »).
 *
 * Ajouter une formation : copier une entrée dans FR et AR, avec l'`id` de sa session dans
 * l'agenda ; déposer son illustration (style isométrique, version pour fond bleu nuit) dans
 * art/<id>.svg, avec les classes « a-… » des pièces à animer (voir art.ts) ; indiquer la
 * position du signal ambre sur le point clé de l'illustration (en % de sa largeur et de sa
 * hauteur) ; ajouter l'adresse de la page dans
 * src/config/pages.ts et vite.seo.ts. Les témoignages ne se répètent pas d'une page à l'autre.
 */

const N = ' ';
/** Espace insécable avant « : ; ? ! » (typographie française). */
const fr = (text: string) => text.replace(/ ([:;?!])/g, `${N}$1`);

/** Le service formation : destinataire des demandes, coordonnées affichées. */
export const SHOWCASE_CONTACT = {
  email: 'formations@opem-dz.com',
  phone: { display: '0770 442 645', href: 'tel:+213770442645' },
} as const;

type Link = { label: string; href: string };

export type TrainingShowcase = {
  /** Identifiant de la session dans l'agenda, et fin de l'adresse de la page. */
  id: string;
  reference: string;
  /** Cycle du catalogue (« Cycle Management »). */
  cycle: string;
  title: string;
  /** L'accroche, en ouverture de « Pourquoi cette formation » : la question, puis la réponse (surlignée en vert). */
  hook: { question: string; answer: string };
  /** La promesse, sous le titre. */
  promise: string;
  duration: string;
  seats: number;
  place: string;
  city: string;
  /**
   * L'illustration du haut de page, sur fond bleu nuit : son nom accessible, et le point clé où
   * se pose le signal ambre (en % de sa largeur et de sa hauteur). Avec `image` : une image
   * (public/images/formations/<id>.webp, format 3:2) animée d'un lent travelling, et des
   * paquets qui parcourent ses flux (`flows` : tracés SVG en pixels de l'image). Sans `image` :
   * le dessin vectoriel animé art/*.tsx.
   */
  illustration: {
    alt: string;
    signal: { x: number; y: number };
    image?: { src: string; width: number; height: number };
    flows?: string[];
  };
  /** Pourquoi cette formation : le constat et la réponse, sa singularité, le lien « Confier… ». */
  why: { text: string; edge: string; link: Link };
  /** Vous repartez avec : trois acquis, numérotés. */
  gains: string[];
  /** Pour qui : une phrase. */
  audience: string;
  /** Pourquoi OPEM : trois raisons, une phrase découpée (« ; » puis « . »). */
  reasons: string[];
  /** Témoignages propres à cette formation (un à trois) ; le premier est mis en avant. */
  voices: { quote: string; author: string }[];
};

export type ShowcaseLabels = {
  breadcrumb: { label: string; root: Link; catalogue: Link };
  /** Surtitre : « Formation inter-entreprises · {city} ». */
  format: string;
  actions: { sheet: string; quote: string };
  facts: {
    label: string;
    duration: string;
    dates: string;
    seats: string;
    place: string;
    /** « {n} participants ». */
    seatsValue: string;
    noDate: string;
  };
  /** Les dates : « 06 au 09 déc. 2026 » ({start} sans le mois ni l'année s'ils sont les mêmes). */
  range: string;
  why: string;
  edge: string;
  gains: string;
  audience: string;
  reasons: { title: string; link: Link };
  figures: { label: string; items: { value: string; label: string }[]; link: Link };
  voices: string;
  /** La barre de la session, qui reste à l'écran entre le haut de page et le formulaire. */
  bar: string;
  /** Comment ça se passe : les trois étapes d'une demande, à côté du formulaire. */
  steps: { title: string; items: string[] };
  /** D'autres formations à venir (agenda), au pied de la page. */
  related: { title: string; more: string; all: Link };
  request: {
    title: string;
    intro: string;
    /** « Vous pouvez aussi nous écrire à {email} ou nous appeler au {phone}. » */
    contact: [string, string, string];
    requiredNote: string;
    want: string;
    wantSheet: string;
    wantQuote: string;
    name: string;
    role: string;
    participants: string;
    participantsError: string;
    organisation: string;
    organisationHelp: string;
    email: string;
    phone: string;
    consentTitle: string;
    consent: string;
    consentError: string;
    newsletterTitle: string;
    newsletter: string;
    submit: string;
    legal: [string, string, string];
    thanks: string;
    failure: { unavailable: string; rate: string; tooLarge: string };
  };
  service: string;
  reference: string;
  protection: string;
};

const LABELS_FR: ShowcaseLabels = {
  breadcrumb: {
    label: 'Fil d’Ariane',
    root: { label: 'Formation qualifiante', href: '/formation' },
    catalogue: { label: 'Catalogue et sessions', href: '/formation/catalogue-et-sessions' },
  },
  format: 'Formation inter-entreprises · {city}',
  actions: { sheet: 'Recevoir la fiche technique détaillée', quote: 'Demander un devis' },
  facts: {
    label: 'La session',
    duration: 'Durée',
    dates: 'Dates',
    seats: 'Places',
    place: 'Lieu',
    seatsValue: `{n}${N}participants`,
    noDate: 'Sur demande',
  },
  range: '{start} au {end}',
  why: 'Pourquoi cette formation',
  edge: fr('Sa singularité :'),
  gains: 'Vous repartez avec',
  audience: 'Pour qui',
  reasons: {
    title: 'Pourquoi OPEM',
    link: { label: 'Découvrir le cabinet', href: '/le-cabinet' },
  },
  figures: {
    label: 'OPEM en chiffres',
    items: [
      { value: '+7', label: 'ans d’activité' },
      { value: '+62', label: 'organisations accompagnées' },
      { value: '+170', label: 'formations dispensées' },
      { value: `+1${N}500`, label: 'professionnels formés' },
    ],
    link: { label: 'Voir nos missions et réalisations', href: '/missions' },
  },
  voices: 'Témoignages',
  bar: 'La session',
  steps: {
    title: 'Comment ça se passe',
    items: [
      'Vous envoyez votre demande en deux minutes.',
      'Notre service formation l’examine et vous contacte.',
      'Vous recevez la fiche technique détaillée et, si vous le souhaitez, votre devis.',
    ],
  },
  related: {
    title: 'D’autres formations à venir',
    more: 'Voir la formation',
    all: { label: 'Tout le calendrier', href: '/formation/catalogue-et-sessions' },
  },
  request: {
    title: 'Recevez la fiche technique détaillée',
    intro: fr(
      'Programme complet par module, méthodes pédagogiques, profil du formateur et modalités pratiques : notre service formation examine chaque demande et vous adresse la fiche par e-mail, avec un devis si vous le souhaitez.',
    ),
    contact: ['Vous pouvez aussi nous écrire à ', ' ou nous appeler au ', '.'],
    requiredNote: 'Les champs marqués d’un astérisque sont obligatoires.',
    want: 'Je souhaite recevoir',
    wantSheet: 'la fiche technique détaillée',
    wantQuote: 'un devis',
    name: 'Nom et prénom',
    role: 'Fonction',
    participants: 'Nombre de participants envisagé',
    participantsError: 'Indiquez un nombre de participants, par exemple 3.',
    organisation: 'Organisme',
    organisationHelp: fr('À titre personnel ? Indiquez-le simplement.'),
    email: 'E-mail professionnel',
    phone: 'Téléphone',
    consentTitle: 'Consentement',
    consent:
      'J’accepte que les informations saisies soient utilisées par OPEM pour répondre à ma demande et, le cas échéant, me recontacter à ce sujet. Elles ne sont transmises à aucun tiers et sont conservées trois ans après notre dernier contact.',
    consentError: 'Cochez cette case pour que nous puissions traiter votre demande.',
    newsletterTitle: 'Rester informé',
    newsletter:
      'Je souhaite recevoir les éclairages d’OPEM et l’annonce de ses nouvelles offres et formations.',
    submit: 'Envoyer ma demande',
    legal: [
      `Conformément à la loi n°${N}18-07 du 10 juin 2018 relative à la protection des personnes physiques dans le traitement des données à caractère personnel, modifiée et complétée, vous pouvez accéder à vos données, les rectifier ou vous opposer à leur traitement en écrivant à `,
      'contact@opem-dz.com',
      '.',
    ],
    thanks:
      'Merci, votre demande nous est bien parvenue. Notre service formation l’examine et vous contacte.',
    failure: {
      unavailable: `L’envoi n’a pas abouti. Réessayez dans un instant, ou écrivez-nous à ${SHOWCASE_CONTACT.email}.`,
      rate: `Trop d’envois en peu de temps. Réessayez dans une heure, ou écrivez-nous à ${SHOWCASE_CONTACT.email}.`,
      tooLarge: `L’envoi n’a pas abouti. Écrivez-nous à ${SHOWCASE_CONTACT.email}.`,
    },
  },
  service: fr('Service formation :'),
  reference: `Réf.${N}`,
  protection: fr(
    '© OPEM. Contenu protégé : toute reproduction sans autorisation écrite est interdite.',
  ),
};

const LABELS_AR: ShowcaseLabels = {
  breadcrumb: {
    label: 'مسار التصفح',
    root: { label: 'التكوين التأهيلي', href: '/formation' },
    catalogue: { label: 'الفهرس والدورات', href: '/formation/catalogue-et-sessions' },
  },
  format: 'تكوين بين المؤسسات · {city}',
  actions: { sheet: 'احصلوا على البطاقة التقنية المفصّلة', quote: 'اطلبوا عرض سعر' },
  facts: {
    label: 'الدورة',
    duration: 'المدة',
    dates: 'التواريخ',
    seats: 'المقاعد',
    place: 'المكان',
    seatsValue: '{n} مشاركًا',
    noDate: 'حسب الطلب',
  },
  range: 'من {start} إلى {end}',
  why: 'لماذا هذا التكوين',
  edge: 'ما يميّزه:',
  gains: 'ما تخرجون به',
  audience: 'لمن هذا التكوين',
  reasons: {
    title: 'لماذا OPEM',
    link: { label: 'اكتشفوا المكتب', href: '/le-cabinet' },
  },
  figures: {
    label: 'OPEM في أرقام',
    items: [
      { value: '+7', label: 'سنوات من النشاط' },
      { value: '+62', label: 'مؤسسة مرافَقة' },
      { value: '+170', label: 'دورة تكوينية منجزة' },
      { value: '+1500', label: 'مهني تم تكوينهم' },
    ],
    link: { label: 'اطّلعوا على مهامنا وإنجازاتنا', href: '/missions' },
  },
  voices: 'شهادات',
  bar: 'الدورة',
  steps: {
    title: 'كيف تجري العملية',
    items: [
      'ترسلون طلبكم في دقيقتين.',
      'تدرسه مصلحة التكوين وتتصل بكم.',
      'تتلقون البطاقة التقنية المفصّلة، وعرض السعر إن رغبتم في ذلك.',
    ],
  },
  related: {
    title: 'تكوينات أخرى قادمة',
    more: 'اكتشفوا التكوين',
    all: { label: 'الرزنامة كاملة', href: '/formation/catalogue-et-sessions' },
  },
  request: {
    title: 'احصلوا على البطاقة التقنية المفصّلة',
    intro:
      'البرنامج الكامل حسب الوحدات، والطرق البيداغوجية، وملف المكوّن، والكيفيات العملية: تدرس مصلحة التكوين كل طلب وترسل إليكم البطاقة بالبريد الإلكتروني، مع عرض سعر إن رغبتم في ذلك.',
    contact: ['يمكنكم أيضًا مراسلتنا على ', ' أو الاتصال بنا على ', '.'],
    requiredNote: 'الخانات المشار إليها بنجمة إلزامية.',
    want: 'أرغب في الحصول على',
    wantSheet: 'البطاقة التقنية المفصّلة',
    wantQuote: 'عرض سعر',
    name: 'الاسم واللقب',
    role: 'الوظيفة',
    participants: 'عدد المشاركين المتوقع',
    participantsError: 'أدخلوا عدد المشاركين، مثلًا 3.',
    organisation: 'الهيئة',
    organisationHelp: 'بصفة شخصية؟ يكفي أن تذكروا ذلك.',
    email: 'البريد الإلكتروني المهني',
    phone: 'الهاتف',
    consentTitle: 'الموافقة',
    consent:
      'أوافق على أن تستعمل OPEM المعلومات المدخلة للرد على طلبي، والاتصال بي عند الاقتضاء بشأنه. لا تُنقل هذه المعلومات إلى أي طرف آخر، وتُحفظ ثلاث سنوات بعد آخر اتصال بيننا.',
    consentError: 'ضعوا علامة في هذه الخانة حتى نتمكن من معالجة طلبكم.',
    newsletterTitle: 'البقاء على اطلاع',
    newsletter: 'أرغب في تلقي إضاءات OPEM والإعلان عن عروضها وتكويناتها الجديدة.',
    submit: 'أرسلوا طلبي',
    legal: [
      'طبقًا للقانون رقم 18-07 المؤرخ في 10 يونيو 2018 المتعلق بحماية الأشخاص الطبيعيين في مجال معالجة المعطيات ذات الطابع الشخصي، المعدّل والمتمّم، يمكنكم الاطلاع على معطياتكم أو تصحيحها أو الاعتراض على معالجتها بمراسلة ',
      'contact@opem-dz.com',
      '.',
    ],
    thanks: 'شكرًا، لقد وصلنا طلبكم. تدرسه مصلحة التكوين وتتصل بكم.',
    failure: {
      unavailable: `لم يتم الإرسال. أعيدوا المحاولة بعد لحظة، أو راسلونا على ${SHOWCASE_CONTACT.email}.`,
      rate: `عدد كبير من الإرسالات في وقت قصير. أعيدوا المحاولة بعد ساعة، أو راسلونا على ${SHOWCASE_CONTACT.email}.`,
      tooLarge: `لم يتم الإرسال. راسلونا على ${SHOWCASE_CONTACT.email}.`,
    },
  },
  service: 'مصلحة التكوين:',
  reference: 'المرجع ',
  protection: '© OPEM. محتوى محمي: يُمنع أي نسخ دون إذن كتابي.',
};

/** Les images des formations qui en ont une (le Plan garde provisoirement son dessin animé). */
const IMAGES = {
  'diagnostic-d-organisation': {
    image: { src: '/images/formations/diagnostic-d-organisation.webp', width: 727, height: 484 },
    signal: { x: 78.1, y: 61.6 },
    flows: [
      'M322,238 Q350,214 392,200 Q404,197 416,205 L463,232',
      'M408,342 Q420,320 440,314 L470,304',
      'M146,330 L246,390',
      'M312,412 L345,426 Q366,436 386,430 L432,440',
    ],
  },
  'cybersecurite-operationnelle': {
    image: { src: '/images/formations/cybersecurite-operationnelle.webp', width: 700, height: 467 },
    signal: { x: 66.7, y: 63.8 },
    flows: [
      'M300,232 L362,255 Q372,258 386,252',
      'M305,252 L420,302',
      'M232,342 L205,358 L290,385',
      'M262,398 L345,440 L380,428',
    ],
  },
} satisfies Record<string, Omit<TrainingShowcase['illustration'], 'alt'>>;

/** Témoignage commun aux formations « Diagnostic » et « Cybersécurité » : l'auteur. */
const PARTICIPANT = { fr: 'Participant à une formation OPEM', ar: 'مشارك في تكوين لـ OPEM' };

const FR: TrainingShowcase[] = [
  {
    id: 'diagnostic-d-organisation',
    reference: 'D02-26.INTER.01. V1',
    cycle: 'Cycle Management',
    title: 'Diagnostic d’organisation',
    hook: {
      question: fr(
        'Vos équipes s’épuisent, les décisions traînent, les mêmes problèmes reviennent ?',
      ),
      answer: 'Le blocage est souvent dans l’organisation.',
    },
    promise: 'Repérer les blocages, optimiser les processus.',
    duration: `4${N}jours`,
    seats: 12,
    place: 'École OPEM',
    city: 'Alger',
    illustration: {
      alt: 'Illustration : un organigramme et quatre postes de travail reliés par un flux ; les dossiers s’accumulent à un point de blocage, qu’un consultant examine à la loupe',
      ...IMAGES['diagnostic-d-organisation'],
    },
    why: {
      text: fr(
        'Des responsabilités qui se chevauchent, des décisions qui remontent toujours à la direction, des processus contournés sur le terrain : vous les constatez, mais comment les prouver, puis les corriger ? Cette formation vous donne la méthode, du cadrage à la restitution, appliquée à votre propre organisation.',
      ),
      edge: 'vous apprenez à conduire vous-même un diagnostic interne léger et régulier, et à reconnaître le moment où un regard extérieur apporte le plus, pour commander et exploiter un diagnostic externe.',
      link: {
        label: fr('Confier le diagnostic à nos consultants : accompagnement des organisations'),
        href: '/expertises/accompagnement-des-organisations/diagnostic-d-entreprise',
      },
    },
    gains: [
      'Une méthode complète pour conduire un diagnostic, du cadrage au plan d’action.',
      'Vos processus clés cartographiés et leurs points de blocage localisés.',
      'Une première ébauche de diagnostic de votre structure, prête à présenter à votre direction.',
    ],
    audience:
      'Directeurs, responsables organisation, qualité, ressources humaines et performance, dirigeants de PME.',
    reasons: [
      fr('Une méthode éprouvée en mission de conseil, au cœur des entreprises ;'),
      fr('des cas réels d’entreprises algériennes, publiques et privées ;'),
      'un formateur praticien du diagnostic.',
    ],
    voices: [
      {
        quote: fr(
          'En dix-sept ans de carrière, j’ai assisté à beaucoup de formations génériques qui sont vite oubliées. Avec OPEM, c’est différent : on travaille sur les vrais blocages du terrain et on sort avec des solutions prêtes à l’emploi.',
        ),
        author: PARTICIPANT.fr,
      },
      {
        quote:
          'Je repars avec des outils concrets prêts à être appliqués. Merci à l’équipe OPEM pour son sérieux, ses qualités et ses exigences.',
        author: PARTICIPANT.fr,
      },
      {
        quote:
          'Contenu dense, supports pédagogiques consistants et clairs. OPEM maîtrise son sujet et respecte parfaitement les objectifs annoncés.',
        author: PARTICIPANT.fr,
      },
    ],
  },
  {
    id: 'plan-de-formation-2027',
    reference: 'D04-26.INTER.01. V1',
    cycle: 'Cycle Ingénierie de la formation',
    title: 'Plan de formation 2027',
    hook: {
      question: fr('Votre budget formation travaille-t-il pour l’entreprise ?'),
      answer: 'Un plan bien bâti fait toute la différence.',
    },
    promise: 'Un plan qui sert vraiment l’entreprise.',
    duration: `3${N}jours`,
    seats: 12,
    place: 'École OPEM',
    city: 'Alger',
    illustration: {
      alt: 'Illustration : une équipe gravit les quatre actions du plan 2027 jusqu’au fanion de l’objectif, avec la table des besoins et le budget au pied',
      signal: { x: 81.51, y: 6.14 },
    },
    why: {
      text: 'Chaque année, le budget formation est engagé, les stages s’enchaînent, sans que l’on voie ce qui a concrètement changé. Cette formation vous donne la méthode pour bâtir un plan qui part des priorités de l’entreprise, se chiffre au plus juste et convainc la direction. Chaque dinar engagé devient un choix assumé.',
      edge: 'un fil rouge, le plan 2027 d’une entreprise fictive, construit module après module jusqu’à sa présentation devant une direction simulée. Programmée début décembre, la session vous laisse le temps d’appliquer la démarche avant le lancement de l’exercice.',
      link: {
        label: fr('Confier votre plan de formation à nos consultants : ingénierie de la formation'),
        href: '/formation',
      },
    },
    gains: [
      'Une méthode pour relier chaque formation aux priorités de l’entreprise.',
      fr(
        'Des outils réutilisables chaque année : guide d’entretien, matrice de priorisation, trame de plan chiffré.',
      ),
      'Les clés pour bâtir votre propre plan 2027 et fédérer toutes les parties prenantes.',
    ],
    audience:
      'Responsables formation, directeurs et responsables des ressources humaines, chargés du développement des compétences, dirigeants de PME.',
    reasons: [
      fr(
        'Une pratique du conseil en ingénierie de la formation, en entreprise comme en institution ;',
      ),
      fr(
        'trois jours de pratique : exercices, simulations d’entretien et présentation devant une direction simulée ;',
      ),
      'un formateur chevronné, rompu à l’élaboration de plans de formation en entreprise.',
    ],
    voices: [
      {
        quote: fr(
          `La meilleure preuve de la qualité d’OPEM, ce sont nos salariés qui la donnent : 98${N}% de satisfaction à chaud cette année, et des managers qui nous redemandent déjà de nouvelles sessions.`,
        ),
        author: 'Entreprise cliente d’OPEM',
      },
    ],
  },
  {
    id: 'cybersecurite-operationnelle',
    reference: 'D14-26.INTER.01. V1',
    cycle: 'Cycle Cybersécurité',
    title: 'Cybersécurité opérationnelle',
    hook: {
      question: fr('Votre réseau tiendrait-il face à un rançongiciel dimanche matin ?'),
      answer: 'Cinq jours pour apprendre à le protéger, à détecter l’attaque et à y faire face.',
    },
    promise: 'Protéger, détecter, réagir.',
    duration: `5${N}jours`,
    seats: 12,
    place: 'École OPEM',
    city: 'Alger',
    illustration: {
      alt: 'Illustration : des serveurs protégés par un dôme et un bouclier, des postes de travail en réseau et une salle de supervision où une alerte s’affiche sur un écran',
      ...IMAGES['cybersecurite-operationnelle'],
    },
    why: {
      text: fr(
        'Une attaque ne laisse pas le temps de relire la documentation : chaque geste de défense se pratique ici sur machine, sans risque pour votre système.',
      ),
      edge: 'une gestion de crise simulée en équipe, au plus près d’une attaque réelle.',
      link: {
        label: fr(
          'Confier la sécurité de votre système d’information à nos consultants : cybersécurité',
        ),
        href: '/expertises/accompagnement-des-organisations/conformite-et-protection-des-donnees',
      },
    },
    gains: [
      'Des réglages de sécurité éprouvés sur machine.',
      'Une méthode pour détecter une compromission et y répondre.',
      fr('Des modèles prêts à l’emploi : matrice des risques, fiche d’incident, fiches réflexes.'),
    ],
    audience:
      'Administrateurs systèmes et réseaux, responsables informatiques, techniciens d’exploitation et de support, responsables de la sécurité des systèmes d’information, ingénieurs d’infrastructure.',
    reasons: [
      fr(
        'Des programmes soigneusement construits autour des problèmes concrets vécus par les entreprises ;',
      ),
      fr(
        'un expert de la sécurité des systèmes d’information, certifié ISO/IEC 27001 et rompu au terrain ;',
      ),
      'des postes de travail performants mis à disposition par OPEM, pour pratiquer sans contrainte.',
    ],
    voices: [
      {
        quote: `Formation pratique, très bon formateur, accueil chaleureux, matériel informatique performant. J’ai beaucoup aimé et je recommande à 100${N}%.`,
        author: PARTICIPANT.fr,
      },
      {
        quote: fr(
          'Pédagogie au top, accueil irréprochable et formateurs passionnés. De loin la meilleure formation que j’ai reçue. Merci OPEM !',
        ),
        author: PARTICIPANT.fr,
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
    hook: {
      question: 'فرقكم مُنهَكة، والقرارات تتأخر، والمشاكل نفسها تتكرر؟',
      answer: 'غالبًا ما يكون الانسداد في التنظيم.',
    },
    promise: 'تحديد مواطن الانسداد وتحسين المسارات.',
    duration: '4 أيام',
    seats: 12,
    place: 'مدرسة OPEM',
    city: 'الجزائر العاصمة',
    illustration: {
      alt: 'رسم توضيحي: هيكل تنظيمي وأربعة مراكز عمل يربطها مسار؛ تتراكم الملفات عند نقطة انسداد يفحصها مستشار بالعدسة المكبّرة',
      ...IMAGES['diagnostic-d-organisation'],
    },
    why: {
      text: 'مسؤوليات متداخلة، وقرارات تصعد دائمًا إلى الإدارة، ومسارات يُتحايل عليها في الميدان: تلاحظونها، لكن كيف تُثبتونها ثم تعالجونها؟ يمنحكم هذا التكوين المنهجية، من التأطير إلى عرض النتائج، مطبّقة على مؤسستكم.',
      edge: 'تتعلّمون إجراء تشخيص داخلي خفيف ومنتظم بأنفسكم، وتمييز اللحظة التي تكون فيها النظرة الخارجية أجدى، لطلب تشخيص خارجي والاستفادة منه.',
      link: {
        label: 'أوكلوا التشخيص إلى مستشارينا: مرافقة المؤسسات',
        href: '/expertises/accompagnement-des-organisations/diagnostic-d-entreprise',
      },
    },
    gains: [
      'منهجية متكاملة لإجراء التشخيص، من التأطير إلى خطة العمل.',
      'مساراتكم الرئيسية مرسومة ونقاط انسدادها محدّدة.',
      'مسودة أولى لتشخيص مؤسستكم، جاهزة لعرضها على إدارتكم.',
    ],
    audience:
      'المديرون، ومسؤولو التنظيم والجودة والموارد البشرية والأداء، ومسيّرو المؤسسات الصغيرة والمتوسطة.',
    reasons: [
      'منهجية مجرّبة في مهام الاستشارة، في قلب المؤسسات؛',
      'حالات حقيقية لمؤسسات جزائرية عمومية وخاصة؛',
      'مكوّن ممارس للتشخيص.',
    ],
    voices: [
      {
        quote:
          'خلال سبعة عشر عامًا من مساري المهني، حضرت تكوينات عامة كثيرة سرعان ما تُنسى. مع OPEM الأمر مختلف: نعمل على الانسدادات الحقيقية في الميدان ونخرج بحلول جاهزة للتطبيق.',
        author: PARTICIPANT.ar,
      },
      {
        quote: 'أغادر بأدوات ملموسة جاهزة للتطبيق. شكرًا لفريق OPEM على جدّيته وكفاءته وصرامته.',
        author: PARTICIPANT.ar,
      },
      {
        quote:
          'محتوى غني، ودعائم بيداغوجية متينة وواضحة. OPEM تتقن موضوعها وتحترم الأهداف المعلنة تمامًا.',
        author: PARTICIPANT.ar,
      },
    ],
  },
  {
    id: 'plan-de-formation-2027',
    reference: 'D04-26.INTER.01. V1',
    cycle: 'دورة هندسة التكوين',
    title: 'مخطط التكوين 2027',
    hook: {
      question: 'هل تعمل ميزانية التكوين لصالح مؤسستكم؟',
      answer: 'المخطط المُحكم يصنع الفارق.',
    },
    promise: 'مخطط يخدم المؤسسة حقًّا.',
    duration: '3 أيام',
    seats: 12,
    place: 'مدرسة OPEM',
    city: 'الجزائر العاصمة',
    illustration: {
      alt: 'رسم توضيحي: فريق يصعد الإجراءات الأربعة لمخطط 2027 حتى راية الهدف، وعند القاعدة جدول الاحتياجات والميزانية',
      signal: { x: 81.51, y: 6.14 },
    },
    why: {
      text: 'كل سنة تُصرف ميزانية التكوين وتتوالى الدورات، دون أن نرى ما الذي تغيّر فعلًا. يمنحكم هذا التكوين المنهجية لبناء مخطط ينطلق من أولويات المؤسسة، ويُقدَّر بدقة، ويُقنع الإدارة. فيصبح كل دينار يُصرف خيارًا مدروسًا.',
      edge: 'خيط ناظم: مخطط 2027 لمؤسسة افتراضية، يُبنى وحدة بعد وحدة حتى عرضه أمام إدارة افتراضية. ولأن الدورة مبرمجة مطلع ديسمبر، فهي تترك لكم الوقت لتطبيق المنهجية قبل انطلاق السنة المالية.',
      link: {
        label: 'أوكلوا مخطط التكوين إلى مستشارينا: هندسة التكوين',
        href: '/formation',
      },
    },
    gains: [
      'منهجية لربط كل تكوين بأولويات المؤسسة.',
      'أدوات قابلة لإعادة الاستعمال كل سنة: دليل المقابلة، ومصفوفة ترتيب الأولويات، ونموذج المخطط المقدَّر.',
      'مفاتيح بناء مخططكم لسنة 2027 وحشد جميع الأطراف المعنية.',
    ],
    audience:
      'مسؤولو التكوين، ومديرو ومسؤولو الموارد البشرية، والمكلّفون بتطوير الكفاءات، ومسيّرو المؤسسات الصغيرة والمتوسطة.',
    reasons: [
      'ممارسة للاستشارة في هندسة التكوين، في المؤسسات كما في الهيئات؛',
      'ثلاثة أيام من التطبيق: تمارين، ومحاكاة مقابلات، وعرض أمام إدارة افتراضية؛',
      'مكوّن متمرّس، خبير في إعداد مخططات التكوين في المؤسسات.',
    ],
    voices: [
      {
        quote:
          'أفضل دليل على جودة OPEM يقدّمه موظفونا: 98% من الرضا مباشرة بعد التكوين هذه السنة، ومديرون يطلبون منا دورات جديدة.',
        author: 'مؤسسة من زبائن OPEM',
      },
    ],
  },
  {
    id: 'cybersecurite-operationnelle',
    reference: 'D14-26.INTER.01. V1',
    cycle: 'دورة الأمن السيبراني',
    title: 'الأمن السيبراني العملي',
    hook: {
      question: 'هل تصمد شبكتكم أمام برنامج فدية صباح يوم أحد؟',
      answer: 'خمسة أيام لتتعلّموا حمايتها، ورصد الهجوم، ومواجهته.',
    },
    promise: 'الحماية، والرصد، والتصدّي.',
    duration: '5 أيام',
    seats: 12,
    place: 'مدرسة OPEM',
    city: 'الجزائر العاصمة',
    illustration: {
      alt: 'رسم توضيحي: خوادم تحميها قبة ودرع، ومحطات عمل موصولة بالشبكة، وقاعة مراقبة يظهر فيها إنذار على شاشة',
      ...IMAGES['cybersecurite-operationnelle'],
    },
    why: {
      text: 'الهجوم لا يترك وقتًا لإعادة قراءة الوثائق: كل إجراء دفاعي يُمارَس هنا على الحاسوب، دون أي خطر على نظامكم.',
      edge: 'تسيير أزمة افتراضية ضمن فريق، في ظروف قريبة من هجوم حقيقي.',
      link: {
        label: 'أوكلوا أمن نظام معلوماتكم إلى مستشارينا: الأمن السيبراني',
        href: '/expertises/accompagnement-des-organisations/conformite-et-protection-des-donnees',
      },
    },
    gains: [
      'إعدادات أمنية مجرّبة على الحاسوب.',
      'منهجية لرصد الاختراق والتصدّي له.',
      'نماذج جاهزة للاستعمال: مصفوفة المخاطر، وبطاقة الحادث، وبطاقات ردود الفعل.',
    ],
    audience:
      'مديرو الأنظمة والشبكات، ومسؤولو الإعلام الآلي، وتقنيو الاستغلال والدعم، ومسؤولو أمن أنظمة المعلومات، ومهندسو البنية التحتية.',
    reasons: [
      'برامج مبنية بعناية حول المشاكل الملموسة التي تعيشها المؤسسات؛',
      'خبير في أمن أنظمة المعلومات، حاصل على شهادة ISO/IEC 27001 ومتمرّس في الميدان؛',
      'محطات عمل عالية الأداء توفّرها OPEM، للتطبيق دون قيود.',
    ],
    voices: [
      {
        quote:
          'تكوين تطبيقي، ومكوّن ممتاز، واستقبال حار، وتجهيزات إعلام آلي عالية الأداء. أعجبني كثيرًا وأوصي به بنسبة 100%.',
        author: PARTICIPANT.ar,
      },
      {
        quote:
          'بيداغوجيا في القمة، واستقبال لا تشوبه شائبة، ومكوّنون شغوفون. أفضل تكوين تلقيته على الإطلاق. شكرًا OPEM!',
        author: PARTICIPANT.ar,
      },
    ],
  },
];

export const showcaseLabels: Record<Lang, ShowcaseLabels> = { fr: LABELS_FR, ar: LABELS_AR };
const SHOWCASES: Record<Lang, TrainingShowcase[]> = { fr: FR, ar: AR };

/** La formation d'adresse `id` dans la langue demandée (undefined : pas encore de page). */
export function findShowcase(lang: Lang, id: string | undefined) {
  return SHOWCASES[lang].find((item) => item.id === id);
}

export const SHOWCASE_IDS = FR.map((item) => item.id);
