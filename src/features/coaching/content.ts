import type { Lang } from '@/i18n/language';

/*
 * Textes de la page « Coaching professionnel » (/expertises/coaching-professionnel). L'accroche
 * et la promesse reprennent « Nos expertises » ; les cinq accompagnements suivent sa typologie
 * (mêmes intitulés, mêmes ancres que les sous-rubriques du menu). Le reste est proposé par
 * l'agence, à faire valider par OPEM (en particulier le format des séances). L'arabe est à
 * faire relire. Photos : Pexels (licence libre), converties en WebP (public/images/coaching).
 */

const N = ' ';
/** Typographie française : espace insécable avant « : ; ? ! ». */
const fr = (text: string) => text.replace(/ ([:;?!])/g, `${N}$1`);
/** Une parole entre guillemets français, espaces insécables à l'intérieur. */
const said = (text: string) => `«${N}${fr(text)}${N}»`;

type Photo = { src: string; small: string; alt: string };

/** Un accompagnement : l'ancre (identique dans les deux langues), le texte, la photo. */
export type CoachingOffer = {
  id: string;
  title: string;
  audience: string;
  text: string;
  gains: string[];
  photo: Photo;
};

export type CoachingContent = {
  title: string;
  hero: {
    trail: { label: string; href: string };
    eyebrow: string;
    title: string;
    lead: string;
    primary: string;
    secondary: string;
    pillars: string[];
    photo: Photo;
  };
  why: { eyebrow: string; statement: string };
  situations: {
    eyebrow: string;
    title: string;
    more: string;
    items: { quote: string; offer: string }[];
  };
  offers: {
    eyebrow: string;
    title: string;
    audienceLabel: string;
    gainsLabel: string;
    items: CoachingOffer[];
  };
  belief: { quote: string; photo: Photo };
  journey: {
    eyebrow: string;
    title: string;
    steps: { title: string; text: string }[];
  };
  commitments: {
    eyebrow: string;
    title: string;
    items: { title: string; text: string }[];
  };
  faq: { eyebrow: string; title: string; items: { question: string; answer: string }[] };
};

/** Les photos : grande (1600 px) et petite (800 px), au format 3:2. */
const photo = (name: string, alt: string): Photo => ({
  src: `/images/coaching/${name}.webp`,
  small: `/images/coaching/${name}-800.webp`,
  alt,
});

/** Les ancres des accompagnements : celles des sous-rubriques du menu, en français. */
export const OFFER_IDS = [
  'coaching-de-dirigeants',
  'accompagnement-des-prises-de-poste',
  'coaching-de-managers',
  'cohesion-et-dynamique-d-equipe',
  'transitions-de-carriere',
] as const;

/** L'ancre du déroulement, visée par le second bouton du haut de page. */
export const JOURNEY_ID = 'deroulement';

const FR: CoachingContent = {
  title: 'Coaching professionnel',
  hero: {
    trail: { label: 'Nos expertises', href: '/nos-expertises' },
    eyebrow: 'Coaching professionnel',
    title: 'Plus on dirige, moins on est contredit.',
    lead: 'Notre coaching questionne vos certitudes, vous contredit avec égards et vous accompagne jusqu’à l’action, pour que vous préserviez votre lucidité, même sous pression.',
    primary: 'Parlons de votre situation',
    secondary: 'Comment se déroule un coaching',
    pillars: ['Confidentiel', 'Sur mesure', 'Tourné vers l’action'],
    photo: photo(
      'seance',
      'Une séance de coaching : une coach et un cadre échangent, assis face à face dans deux fauteuils',
    ),
  },
  why: {
    eyebrow: 'Pourquoi un coach',
    statement: fr(
      'Plus vos responsabilités grandissent, plus les avis francs se font rares. Chacun mesure ses mots, et l’on vous dit volontiers ce que vous souhaitez entendre. Un coach vous offre ce qui manque alors : un regard extérieur, exigeant et bienveillant, pour voir clair et décider juste.',
    ),
  },
  situations: {
    eyebrow: 'Vous vous reconnaissez ?',
    title: 'Chaque coaching commence par une phrase comme celles-ci.',
    more: 'L’accompagnement qui y répond',
    items: [
      {
        quote: said('Je décide seul, et plus personne n’ose me contredire.'),
        offer: 'coaching-de-dirigeants',
      },
      {
        quote: said('Je prends mes fonctions, et tout le monde attend mes premières décisions.'),
        offer: 'accompagnement-des-prises-de-poste',
      },
      {
        quote: said('J’encadre une équipe, sans jamais avoir appris à manager.'),
        offer: 'coaching-de-managers',
      },
      {
        quote: said('Mon équipe travaille, mais elle ne joue plus ensemble.'),
        offer: 'cohesion-et-dynamique-d-equipe',
      },
      {
        quote: said('Il est temps de changer de cap, mais je ne sais pas encore lequel.'),
        offer: 'transitions-de-carriere',
      },
    ],
  },
  offers: {
    eyebrow: 'Nos accompagnements',
    title: 'Cinq accompagnements, une même exigence.',
    audienceLabel: 'Pour qui',
    gainsLabel: 'Ce qui change',
    items: [
      {
        id: 'coaching-de-dirigeants',
        title: 'Coaching de dirigeants',
        audience: 'Dirigeants, membres de comité de direction.',
        text: 'Diriger, c’est arbitrer sans cesse, souvent seul, toujours sous le regard des autres. Le coaching vous offre un espace rare : un lieu où penser à voix haute, éprouver vos intuitions et préparer vos décisions majeures avec un interlocuteur qui n’a rien à vous vendre et rien à vous demander.',
        gains: [
          'Des décisions mieux préparées, mieux assumées',
          'Une posture affirmée face au conseil, aux équipes et aux partenaires',
          'Du recul pour tenir dans la durée, même sous pression',
        ],
        photo: photo(
          'dirigeant',
          'Un dirigeant, dossier à la main, réfléchit debout devant la baie vitrée de son bureau',
        ),
      },
      {
        id: 'accompagnement-des-prises-de-poste',
        title: 'Accompagnement des prises de poste',
        audience: 'Nouveaux dirigeants, cadres promus, recrutements clés.',
        text: 'Les premiers mois d’une prise de poste pèsent lourd : on y gagne ou on y perd sa légitimité. Nous vous aidons à lire votre nouvel environnement, à fixer vos priorités et à poser les premiers actes qui installent votre autorité.',
        gains: [
          'Un diagnostic lucide de la situation trouvée',
          'Un plan des cent premiers jours, réaliste et partagé',
          'Une légitimité construite plutôt que revendiquée',
        ],
        photo: photo(
          'prise-de-poste',
          'Une cadre marche d’un pas assuré dans une rue du centre-ville, un café à la main',
        ),
      },
      {
        id: 'coaching-de-managers',
        title: 'Coaching de managers',
        audience: 'Managers de proximité, cadres intermédiaires.',
        text: 'On devient souvent manager parce qu’on excellait dans son métier, rarement parce qu’on a appris à encadrer. Le coaching aide vos managers à trouver leur style, à déléguer, à recadrer avec justesse et à faire grandir leurs équipes.',
        gains: [
          'Une délégation assumée, des responsabilités clarifiées',
          'Des entretiens difficiles conduits avec calme et fermeté',
          'Des équipes plus autonomes et plus engagées',
        ],
        photo: photo(
          'managers',
          'Une manager et un cadre échangent autour d’une table de réunion, ordinateurs ouverts',
        ),
      },
      {
        id: 'cohesion-et-dynamique-d-equipe',
        title: 'Cohésion et dynamique d’équipe',
        audience: 'Comités de direction, équipes projet, équipes en tension.',
        text: fr(
          'Une équipe de talents ne fait pas forcément une équipe performante. Nous travaillons avec le collectif sur ce qui le freine : rôles flous, non-dits, tensions, règles du jeu implicites, pour qu’il retrouve un cap commun et une manière de travailler ensemble.',
        ),
        gains: [
          'Des rôles et des règles du jeu clarifiés',
          'Des désaccords exprimés et traités, au lieu d’être subis',
          'Un cap commun, porté par tous',
        ],
        photo: photo(
          'equipe',
          'Une équipe réunie autour d’un tableau blanc : l’un présente, les autres réagissent',
        ),
      },
      {
        id: 'transitions-de-carriere',
        title: 'Transitions de carrière',
        audience: 'Cadres en mobilité, en reconversion ou en fin de mandat.',
        text: 'Une transition se subit ou se choisit. Nous vous aidons à faire le point sur vos compétences, vos aspirations et vos options, puis à bâtir un projet professionnel solide et à le mener à bien.',
        gains: [
          'Un bilan clair de vos atouts et de vos envies',
          'Un projet professionnel réaliste et motivant',
          'Une transition préparée, menée à votre rythme',
        ],
        photo: photo(
          'transition',
          'Un cadre assis dans un fauteuil, seul, regarde par la fenêtre d’un bureau spacieux',
        ),
      },
    ],
  },
  belief: {
    quote:
      'Un coach ne vous donne pas les réponses. Il vous aide à trouver les vôtres, et à les tenir.',
    photo: photo(
      'reunion-vitre',
      'Vue à travers une paroi vitrée : deux personnes en entretien dans une salle de réunion',
    ),
  },
  journey: {
    eyebrow: 'Le déroulement',
    title: 'Un coaching a un début, un cap et une fin.',
    steps: [
      {
        title: 'Premier échange',
        text: 'Un entretien sans engagement pour comprendre votre situation et vérifier que le coaching est la bonne réponse. Si ce n’est pas le cas, nous vous le dirons.',
      },
      {
        title: 'Objectifs',
        text: 'Nous fixons ensemble des objectifs précis et observables. Lorsque votre organisation finance l’accompagnement, ils sont validés avec elle, sans jamais rien dévoiler des séances.',
      },
      {
        title: 'Séances',
        text: 'Des séances régulières, espacées pour vous laisser le temps d’expérimenter entre deux rendez-vous. Chacune se conclut par un engagement concret.',
      },
      {
        title: 'Bilan',
        text: 'Nous mesurons le chemin parcouru au regard des objectifs fixés. Vous repartez avec vos repères, pour poursuivre seul.',
      },
    ],
  },
  commitments: {
    eyebrow: 'Nos engagements',
    title: 'Ce sur quoi vous pouvez compter.',
    items: [
      {
        title: 'Confidentialité',
        text: 'Ce qui se dit en séance reste en séance. Toujours.',
      },
      {
        title: 'Indépendance',
        text: 'Un interlocuteur libre de tout intérêt autre que votre réussite.',
      },
      {
        title: 'Exigence',
        text: 'Nous vous contredisons avec égards, mais nous vous contredisons.',
      },
      {
        title: 'Action',
        text: 'Chaque séance débouche sur un engagement concret, que nous revoyons ensemble à la suivante.',
      },
    ],
  },
  faq: {
    eyebrow: 'Questions fréquentes',
    title: 'Avant de vous lancer.',
    items: [
      {
        question: fr('Le coaching, est-ce pour ceux qui sont en difficulté ?'),
        answer:
          'Non. Le plus souvent, le coaching accompagne des personnes qui veulent aller plus loin, réussir une étape décisive ou garder leur lucidité dans une période exigeante. C’est un levier de performance, pas une thérapie.',
      },
      {
        question: fr('Qu’apprend mon employeur de nos échanges ?'),
        answer: fr(
          'Rien du contenu des séances. Lorsque votre organisation finance le coaching, elle participe à la définition des objectifs et au bilan final ; ce qui se dit en séance reste strictement confidentiel.',
        ),
      },
      {
        question: fr('Combien de temps dure un accompagnement ?'),
        answer: fr(
          'Cela dépend de vos objectifs. Nous en convenons dès le départ : un nombre de séances défini, un bilan à l’échéance. Un coaching a un début et une fin.',
        ),
      },
      {
        question: fr('Quelle différence avec une formation ?'),
        answer: fr(
          'Une formation transmet des savoirs communs à un groupe. Le coaching part de votre situation, de vos enjeux et de votre manière de faire : il est entièrement sur mesure.',
        ),
      },
      {
        question: fr('Comment savoir si le coaching est fait pour moi ?'),
        answer: fr(
          'C’est l’objet du premier échange : sans engagement, il permet de vérifier que le coaching répond à votre besoin. Si une autre réponse convient mieux, une formation ou un accompagnement de votre organisation, nous vous le dirons.',
        ),
      },
    ],
  },
};

const AR: CoachingContent = {
  title: 'الكوتشينغ المهني',
  hero: {
    trail: { label: 'خبراتنا', href: '/nos-expertises' },
    eyebrow: 'الكوتشينغ المهني',
    title: 'كلّما ارتقيتم في القيادة، قلّ من يعارضكم.',
    lead: 'يسائل الكوتشينغ لدينا قناعاتكم، ويعارضكم بلباقة، ويرافقكم حتى التنفيذ، لتحافظوا على وضوح رؤيتكم حتى تحت الضغط.',
    primary: 'لنتحدث عن وضعكم',
    secondary: 'كيف تجري مرافقة الكوتشينغ',
    pillars: ['سرّية تامة', 'على المقاس', 'موجَّه نحو الفعل'],
    photo: photo('seance', 'جلسة كوتشينغ: مدرّبة وإطار يتحاوران جالسين وجهًا لوجه على أريكتين'),
  },
  why: {
    eyebrow: 'لماذا الكوتش',
    statement:
      'كلّما كبرت مسؤولياتكم، ندرت الآراء الصريحة. يزن كلّ واحد كلماته، ويُقال لكم غالبًا ما تودّون سماعه. يمنحكم الكوتش حينها ما ينقصكم: نظرة خارجية، متطلّبة ومتفهّمة، لتروا بوضوح وتقرّروا بصواب.',
  },
  situations: {
    eyebrow: 'هل تجدون أنفسكم هنا؟',
    title: 'كلّ مرافقة تبدأ بجملة كهذه.',
    more: 'المرافقة المناسبة',
    items: [
      { quote: '«أقرّر وحدي، ولم يعد أحد يجرؤ على معارضتي.»', offer: 'coaching-de-dirigeants' },
      {
        quote: '«أتولّى منصبي الجديد، والجميع ينتظر قراراتي الأولى.»',
        offer: 'accompagnement-des-prises-de-poste',
      },
      { quote: '«أقود فريقًا دون أن أتعلّم يومًا فنّ الإدارة.»', offer: 'coaching-de-managers' },
      {
        quote: '«فريقي يعمل، لكنه لم يعد يعمل كفريق.»',
        offer: 'cohesion-et-dynamique-d-equipe',
      },
      {
        quote: '«حان وقت تغيير المسار، لكنني لا أعرف بعدُ أيّ مسار.»',
        offer: 'transitions-de-carriere',
      },
    ],
  },
  offers: {
    eyebrow: 'مرافقاتنا',
    title: 'خمس مرافقات، والتزام واحد بالجودة.',
    audienceLabel: 'لمن',
    gainsLabel: 'ما الذي يتغيّر',
    items: [
      {
        id: 'coaching-de-dirigeants',
        title: 'كوتشينغ المسيّرين',
        audience: 'المسيّرون وأعضاء لجان الإدارة.',
        text: 'أن تقود يعني أن تحسم باستمرار، وحيدًا في الغالب، وتحت أنظار الآخرين دائمًا. يمنحكم الكوتشينغ فضاءً نادرًا: مكانًا تفكّرون فيه بصوت عالٍ، وتختبرون حدسكم، وتحضّرون قراراتكم الكبرى مع محاور لا يبيعكم شيئًا ولا يطلب منكم شيئًا.',
        gains: [
          'قرارات أفضل تحضيرًا وأكثر تحمّلًا للمسؤولية',
          'حضور واثق أمام مجلس الإدارة والفرق والشركاء',
          'مسافة تساعدكم على الصمود في المدى الطويل، حتى تحت الضغط',
        ],
        photo: photo('dirigeant', 'مسيّر يحمل ملفًا ويفكّر واقفًا أمام الواجهة الزجاجية لمكتبه'),
      },
      {
        id: 'accompagnement-des-prises-de-poste',
        title: 'مرافقة تولّي المناصب',
        audience: 'المسيّرون الجدد، والإطارات المرقّاة، والتوظيفات الأساسية.',
        text: 'للأشهر الأولى في منصب جديد وزن كبير: فيها تُكسب الشرعية أو تُفقد. نساعدكم على قراءة محيطكم الجديد، وتحديد أولوياتكم، واتخاذ الخطوات الأولى التي ترسّخ سلطتكم.',
        gains: [
          'تشخيص واضح للوضع القائم',
          'خطة واقعية ومتّفق عليها للأيام المئة الأولى',
          'شرعية تُبنى بدل أن تُطالَب',
        ],
        photo: photo(
          'prise-de-poste',
          'إطار تمشي بخطى واثقة في شارع بوسط المدينة وفي يدها كوب قهوة',
        ),
      },
      {
        id: 'coaching-de-managers',
        title: 'كوتشينغ المديرين',
        audience: 'مديرو الفرق والإطارات الوسيطة.',
        text: 'كثيرًا ما يصبح المرء مديرًا لأنه برع في مهنته، ونادرًا لأنه تعلّم التأطير. يساعد الكوتشينغ مديريكم على إيجاد أسلوبهم، والتفويض، والتصويب بإنصاف، وتنمية فرقهم.',
        gains: [
          'تفويض واثق ومسؤوليات واضحة',
          'مقابلات صعبة تُدار بهدوء وحزم',
          'فرق أكثر استقلالية والتزامًا',
        ],
        photo: photo('managers', 'مديرة وإطار يتحاوران حول طاولة اجتماعات والحواسيب مفتوحة'),
      },
      {
        id: 'cohesion-et-dynamique-d-equipe',
        title: 'تماسك الفريق وديناميكيته',
        audience: 'لجان الإدارة، وفرق المشاريع، والفرق التي تمرّ بتوتّر.',
        text: 'اجتماع الكفاءات لا يصنع بالضرورة فريقًا ناجحًا. نعمل مع الفريق على ما يعيقه: أدوار غامضة، ومسكوت عنه، وتوتّرات، وقواعد عمل ضمنية، ليستعيد وجهة مشتركة وطريقة للعمل معًا.',
        gains: [
          'أدوار وقواعد عمل واضحة',
          'خلافات تُطرح وتُعالج بدل أن تُكبت',
          'وجهة مشتركة يحملها الجميع',
        ],
        photo: photo('equipe', 'فريق مجتمع حول سبورة بيضاء: أحدهم يعرض والآخرون يتفاعلون'),
      },
      {
        id: 'transitions-de-carriere',
        title: 'التحوّلات المهنية',
        audience: 'الإطارات في حالة تنقّل أو إعادة توجيه أو نهاية عهدة.',
        text: 'التحوّل المهني إمّا أن يُفرض عليكم وإمّا أن تختاروه. نساعدكم على تقييم كفاءاتكم وتطلّعاتكم وخياراتكم، ثم على بناء مشروع مهني متين وتحقيقه.',
        gains: [
          'حصيلة واضحة لنقاط قوّتكم ورغباتكم',
          'مشروع مهني واقعي ومحفّز',
          'تحوّل مُحضَّر، يسير بإيقاعكم',
        ],
        photo: photo('transition', 'إطار جالس وحده على أريكة ينظر من نافذة مكتب فسيح'),
      },
    ],
  },
  belief: {
    quote: 'الكوتش لا يعطيكم الأجوبة. بل يساعدكم على إيجاد أجوبتكم، والثبات عليها.',
    photo: photo('reunion-vitre', 'من خلف جدار زجاجي: شخصان في مقابلة داخل قاعة اجتماعات'),
  },
  journey: {
    eyebrow: 'مراحل المرافقة',
    title: 'للكوتشينغ بداية ووجهة ونهاية.',
    steps: [
      {
        title: 'اللقاء الأول',
        text: 'مقابلة دون التزام لفهم وضعكم والتأكّد من أن الكوتشينغ هو الحلّ المناسب. وإن لم يكن كذلك، سنصارحكم بذلك.',
      },
      {
        title: 'الأهداف',
        text: 'نحدّد معًا أهدافًا دقيقة وقابلة للملاحظة. وحين تموّل مؤسستكم المرافقة، تُعتمد الأهداف معها دون الكشف عن أيّ شيء ممّا يدور في الجلسات.',
      },
      {
        title: 'الجلسات',
        text: 'جلسات منتظمة، متباعدة بما يتيح لكم وقت التجربة بين موعد وآخر. وتُختتم كلّ جلسة بالتزام ملموس.',
      },
      {
        title: 'الحصيلة',
        text: 'نقيس الطريق المقطوع في ضوء الأهداف المحدّدة. وتغادرون ومعكم معالمكم لتواصلوا وحدكم.',
      },
    ],
  },
  commitments: {
    eyebrow: 'التزاماتنا',
    title: 'ما يمكنكم الاعتماد عليه.',
    items: [
      { title: 'السرّية', text: 'ما يُقال في الجلسة يبقى في الجلسة. دائمًا.' },
      { title: 'الاستقلالية', text: 'محاور لا مصلحة له سوى نجاحكم.' },
      { title: 'التطلّب', text: 'نعارضكم بلباقة، لكننا نعارضكم.' },
      {
        title: 'الفعل',
        text: 'تُفضي كلّ جلسة إلى التزام ملموس نراجعه معًا في الجلسة التالية.',
      },
    ],
  },
  faq: {
    eyebrow: 'أسئلة شائعة',
    title: 'قبل أن تبدؤوا.',
    items: [
      {
        question: 'هل الكوتشينغ موجَّه لمن يمرّون بصعوبات؟',
        answer:
          'لا. يرافق الكوتشينغ في أغلب الأحيان أشخاصًا يريدون الذهاب أبعد، أو إنجاح مرحلة حاسمة، أو الحفاظ على وضوح رؤيتهم في فترة صعبة. إنه رافعة للأداء، لا علاج نفسي.',
      },
      {
        question: 'ماذا يعرف صاحب العمل عن جلساتنا؟',
        answer:
          'لا شيء من مضمون الجلسات. حين تموّل مؤسستكم الكوتشينغ، تشارك في تحديد الأهداف وفي الحصيلة النهائية؛ أمّا ما يُقال في الجلسات فيبقى سرّيًا تمامًا.',
      },
      {
        question: 'كم تدوم المرافقة؟',
        answer:
          'يتوقّف ذلك على أهدافكم. نتّفق عليه منذ البداية: عدد محدّد من الجلسات وحصيلة عند الأجل. للكوتشينغ بداية ونهاية.',
      },
      {
        question: 'ما الفرق بينه وبين التكوين؟',
        answer:
          'ينقل التكوين معارف مشتركة إلى مجموعة. أمّا الكوتشينغ فينطلق من وضعكم ورهاناتكم وطريقتكم في العمل: إنه مصمَّم على مقاسكم بالكامل.',
      },
      {
        question: 'كيف أعرف إن كان الكوتشينغ يناسبني؟',
        answer:
          'هذا هو هدف اللقاء الأول: دون التزام، يتيح التأكّد من أن الكوتشينغ يلبّي حاجتكم. وإن كان هناك حلّ أنسب، تكوين أو مرافقة لمؤسستكم، سنصارحكم بذلك.',
      },
    ],
  },
};

export const coachingContent: Record<Lang, CoachingContent> = { fr: FR, ar: AR };
