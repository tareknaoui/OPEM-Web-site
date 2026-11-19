import type { Lang } from '@/i18n/language';

/*
 * Textes de la page « Communication institutionnelle » (/expertises/communication-
 * institutionnelle). L'accroche, la promesse, les sept savoir-faire et la référence (catalogues
 * de la SAPTA et de la SNTP) reprennent « Nos expertises » ; la conviction reprend la carte de
 * l'accueil ; le site d'OPEM « conçu par nos équipes » reprend « Actualités ». Le reste est
 * proposé par l'agence, à faire valider par OPEM (en particulier les engagements « bilingue » et
 * « impression suivie jusqu'à la livraison »). L'arabe est à faire relire. Photos : Pexels
 * (licence libre) et photos du site, en WebP (public/images/communication).
 */

const N = ' ';
/** Typographie française : espace insécable avant « : ; ? ! ». */
const fr = (text: string) => text.replace(/ ([:;?!])/g, `${N}$1`);

export type Photo = { src: string; small: string; alt: string; width?: number };

/** Un savoir-faire : l'ancre (celle de la sous-rubrique du menu), le texte, la photo. */
export type Craft = { id: string; title: string; text: string; photo?: Photo; screen?: boolean };

export type Work = {
  title: string;
  text: string;
  crafts: string[];
  /** Les logos des clients (public/images/clients), ou la capture d'écran du site. */
  logos?: { name: string; src: string; width: number; height: number }[];
  screen?: Photo;
};

export type CommunicationContent = {
  title: string;
  hero: {
    trail: { label: string; href: string };
    eyebrow: string;
    title: string;
    lead: string;
    primary: string;
    secondary: string;
    signature: string;
    photo: Photo;
  };
  ticker: string[];
  manifesto: { eyebrow: string; text: string };
  crafts: { eyebrow: string; title: string; items: Craft[] };
  works: { eyebrow: string; title: string; craftsLabel: string; items: Work[] };
  belief: { quote: string; text: string; photo: Photo };
  method: { eyebrow: string; title: string; steps: { title: string; text: string }[] };
  reasons: { eyebrow: string; title: string; items: { title: string; text: string }[] };
  faq: { eyebrow: string; title: string; items: { question: string; answer: string }[] };
};

const photo = (name: string, alt: string, width = 1600): Photo => ({
  src: `/images/communication/${name}.webp`,
  small: `/images/communication/${name}-800.webp`,
  alt,
  width,
});

/** La capture du site d'OPEM (« Actualités »), en deux tailles (700 et 1200 px, 16:10). */
const site = (alt: string): Photo => ({
  src: '/images/actualites/nouveau-site.webp',
  small: '/images/actualites/nouveau-site-700.webp',
  alt,
  width: 1200,
});

const LOGOS = [
  { name: 'SAPTA', src: '/images/clients/sapta.webp', width: 189, height: 112 },
  {
    name: 'Société Nationale de Travaux Publics (SNTP)',
    src: '/images/clients/sntp.webp',
    width: 126,
    height: 166,
  },
];

/** Les ancres des savoir-faire : celles des sous-rubriques du menu, en français. */
export const CRAFT_IDS = [
  'catalogues-de-presentation-et-de-savoir-faire',
  'sites-web',
  'contenus-video',
  'redaction',
  'direction-artistique',
  'conception-graphique',
  'impression',
] as const;

/** L'ancre des réalisations, visée par le second bouton du haut de page. */
export const WORKS_ID = 'realisations';

const FR: CommunicationContent = {
  title: 'Communication institutionnelle',
  hero: {
    trail: { label: 'Nos expertises', href: '/nos-expertises' },
    eyebrow: 'Communication institutionnelle',
    title: 'Soigner son image, c’est respecter ses clients.',
    lead: 'Nos équipes racontent votre histoire, conçoivent vos supports et les diffusent, pour que vous soyez reconnus à la hauteur de votre travail.',
    primary: 'Parlons de votre image',
    secondary: 'Voir nos réalisations',
    signature: 'Du premier mot à l’objet imprimé, une seule équipe.',
    photo: photo(
      'revue-maquettes',
      'Deux créatives passent en revue des maquettes imprimées et des nuanciers étalés sur une table',
    ),
  },
  ticker: [
    'Catalogues',
    'Sites web',
    'Vidéo',
    'Rédaction',
    'Direction artistique',
    'Conception graphique',
    'Impression',
  ],
  manifesto: {
    eyebrow: 'Notre conviction',
    text: 'Votre excellence ne vaut que si elle se sait. Parce que nous comprenons vos métiers, nos supports révèlent votre expertise et vos réalisations avec l’élégance qu’elles méritent.',
  },
  crafts: {
    eyebrow: 'Ce que nous créons',
    title: 'Sept savoir-faire, une seule signature.',
    items: [
      {
        id: 'catalogues-de-presentation-et-de-savoir-faire',
        title: 'Catalogues de présentation et de savoir-faire',
        text: fr(
          'Le document que vos clients gardent sur leur bureau : votre histoire, vos métiers et vos références, mis en pages et imprimés avec soin.',
        ),
        photo: photo(
          'catalogues',
          'Deux personnes feuillettent un catalogue imprimé, à côté d’un ordinateur portable et d’un nuancier',
          1200,
        ),
      },
      {
        id: 'sites-web',
        title: 'Sites web',
        text: 'Un site à votre image, clair, rapide et bilingue, pensé d’abord pour ceux qui le consultent.',
        screen: true,
      },
      {
        id: 'contenus-video',
        title: 'Contenus vidéo',
        text: fr(
          'Films institutionnels, témoignages, visites de vos sites : l’image animée au service de votre message.',
        ),
        photo: photo(
          'video',
          'Un caméraman filme une dirigeante en entretien dans un bureau, l’écran de contrôle au premier plan',
        ),
      },
      {
        id: 'redaction',
        title: 'Rédaction',
        text: 'Des textes justes, qui disent précisément ce que vous faites et pourquoi l’on peut vous faire confiance.',
        photo: photo('redaction', 'Une main rédige des notes au stylo dans un carnet à spirale'),
      },
      {
        id: 'direction-artistique',
        title: 'Direction artistique',
        text: 'Une ligne visuelle cohérente, du logo à chaque support, pour que l’on vous reconnaisse au premier regard.',
        photo: photo(
          'direction-artistique',
          'Une planche de tendances : palette de couleurs, cartes et échantillons disposés sur une table',
        ),
      },
      {
        id: 'conception-graphique',
        title: 'Conception graphique',
        text: fr('Mises en page, infographies, illustrations : la forme qui rend le fond lisible.'),
        photo: photo(
          'conception-graphique',
          'Un graphiste compose une mise en page sur un grand écran, dans un studio lumineux',
        ),
      },
      {
        id: 'impression',
        title: 'Impression',
        text: 'Le choix du papier et des finitions, le suivi de la fabrication, jusqu’à la livraison.',
        photo: photo('impression', 'Un imprimeur règle les rouleaux encrés d’une presse'),
      },
    ],
  },
  works: {
    eyebrow: 'Nos réalisations',
    title: 'Notre signature s’y lit.',
    craftsLabel: 'Savoir-faire mobilisés',
    items: [
      {
        title: 'Les catalogues institutionnels de la SAPTA et de la SNTP',
        text: 'Entièrement rédigés, conçus et imprimés par nos soins : deux entreprises de référence présentent leurs métiers et leurs réalisations dans un document à leur hauteur.',
        crafts: ['Rédaction', 'Conception graphique', 'Impression'],
        logos: LOGOS,
      },
      {
        title: 'Le site d’OPEM',
        text: 'Le site que vous parcourez en ce moment a été conçu par nos équipes, en français et en arabe.',
        crafts: ['Rédaction', 'Direction artistique', 'Site web'],
        screen: site('La page d’accueil du site d’OPEM, conçu par nos équipes'),
      },
    ],
  },
  belief: {
    quote: 'Nous comprenons vos métiers avant de les raconter.',
    text: 'Cabinet de conseil avant d’être agence, OPEM connaît de l’intérieur les organisations qu’elle accompagne. Nos supports parlent votre langue, et celle de vos clients.',
    photo: photo(
      'atelier',
      'Vue d’en haut : une équipe travaille autour d’une grande table couverte de documents et de nuanciers',
    ),
  },
  method: {
    eyebrow: 'Notre méthode',
    title: 'Du premier entretien au support livré.',
    steps: [
      {
        title: 'Comprendre',
        text: fr(
          'Nous rencontrons vos équipes et lisons vos documents : on ne raconte bien que ce que l’on a compris.',
        ),
      },
      {
        title: 'Écrire',
        text: fr(
          'Le message d’abord : ce que vous voulez que l’on retienne de vous, dit simplement.',
        ),
      },
      {
        title: 'Concevoir',
        text: 'Direction artistique, mise en page, maquettes : des propositions que nous affinons avec vous.',
      },
      {
        title: 'Produire',
        text: 'Impression, tournage, mise en ligne : nous suivons la fabrication jusqu’au moindre détail.',
      },
      {
        title: 'Diffuser',
        text: 'Vos supports rejoignent leur public : clients, partenaires, institutions, salons.',
      },
    ],
  },
  reasons: {
    eyebrow: 'Pourquoi nous',
    title: 'Ce qui fait la différence.',
    items: [
      {
        title: 'Un regard de consultant',
        text: fr(
          'Nous comprenons vos métiers et vos enjeux : vos supports disent l’essentiel, sans jargon ni approximation.',
        ),
      },
      {
        title: 'Une seule équipe, du texte à l’impression',
        text: fr(
          'Un interlocuteur unique pour la rédaction, la création et la fabrication : moins de délais, rien ne se perd en route.',
        ),
      },
      {
        title: 'Bilingue, naturellement',
        text: 'Le français et l’arabe, rédigés avec le même soin, plutôt que traduits mot à mot.',
      },
    ],
  },
  faq: {
    eyebrow: 'Questions fréquentes',
    title: 'Avant de commencer.',
    items: [
      {
        question: fr('Pouvez-vous partir de notre charte graphique ?'),
        answer: fr(
          'Oui. Nous la respectons et la faisons vivre ; si elle gagne à être modernisée, nous vous le proposons, sans jamais l’imposer.',
        ),
      },
      {
        question: fr('Rédigez-vous aussi les textes ?'),
        answer:
          'Oui, et c’est là que tout commence. Nous recueillons l’information auprès de vos équipes et rédigeons des textes que vous validez avant toute mise en page.',
      },
      {
        question: fr('Prenez-vous en charge l’impression ?'),
        answer:
          'Oui. Nous vous conseillons sur le papier et les finitions, suivons la fabrication et contrôlons le résultat avant la livraison.',
      },
      {
        question: fr('Concevez-vous des supports en arabe ?'),
        answer:
          'Oui. Vos supports peuvent être conçus en français, en arabe ou dans les deux langues, chacune rédigée avec le même soin.',
      },
      {
        question: fr('Combien de temps faut-il pour un catalogue ?'),
        answer:
          'Tout dépend du volume et de l’information disponible. Nous fixons ensemble un calendrier dès le départ, étapes de validation comprises.',
      },
    ],
  },
};

const AR: CommunicationContent = {
  title: 'الاتصال المؤسساتي',
  hero: {
    trail: { label: 'خبراتنا', href: '/nos-expertises' },
    eyebrow: 'الاتصال المؤسساتي',
    title: 'العناية بالصورة احترامٌ للزبائن.',
    lead: 'فرقنا تروي قصتكم، وتصمم دعائمكم، وتنشرها، لكي يُعترف بكم على قدر عملكم.',
    primary: 'لنتحدث عن صورتكم',
    secondary: 'اطّلعوا على إنجازاتنا',
    signature: 'من الكلمة الأولى إلى الدعامة المطبوعة، فريق واحد.',
    photo: photo('revue-maquettes', 'مصمّمتان تراجعان نماذج مطبوعة ولوحات ألوان مبسوطة على طاولة'),
  },
  ticker: [
    'الكتالوجات',
    'المواقع الإلكترونية',
    'الفيديو',
    'التحرير',
    'الإدارة الفنية',
    'التصميم الغرافيكي',
    'الطباعة',
  ],
  manifesto: {
    eyebrow: 'قناعتنا',
    text: 'لا قيمة لامتيازكم إلا إذا عُرف. ولأننا نفهم مهنكم، تُبرز دعائمنا خبرتكم وإنجازاتكم بالأناقة التي تستحقها.',
  },
  crafts: {
    eyebrow: 'ما نصنعه',
    title: 'سبع مهارات، وتوقيع واحد.',
    items: [
      {
        id: 'catalogues-de-presentation-et-de-savoir-faire',
        title: 'كتالوجات التعريف والخبرات',
        text: 'الوثيقة التي يحتفظ بها زبائنكم على مكاتبهم: قصتكم ومهنكم ومراجعكم، مُخرجة ومطبوعة بعناية.',
        photo: photo(
          'catalogues',
          'شخصان يتصفّحان دليلًا مطبوعًا بجانب حاسوب محمول ولوحة ألوان',
          1200,
        ),
      },
      {
        id: 'sites-web',
        title: 'المواقع الإلكترونية',
        text: 'موقع على صورتكم، واضح وسريع وثنائي اللغة، مصمَّم أولًا لمن يتصفّحه.',
        screen: true,
      },
      {
        id: 'contenus-video',
        title: 'محتويات الفيديو',
        text: 'أفلام مؤسساتية، وشهادات، وزيارات لمواقعكم: الصورة المتحركة في خدمة رسالتكم.',
        photo: photo(
          'video',
          'مصوّر يصوّر مسيّرة أثناء مقابلة في مكتب، وشاشة المراقبة في المقدّمة',
        ),
      },
      {
        id: 'redaction',
        title: 'التحرير',
        text: 'نصوص دقيقة تقول بالضبط ما تقومون به، ولماذا يمكن الوثوق بكم.',
        photo: photo('redaction', 'يد تدوّن ملاحظات بالقلم في دفتر حلزوني'),
      },
      {
        id: 'direction-artistique',
        title: 'الإدارة الفنية',
        text: 'هوية بصرية متناسقة، من الشعار إلى كلّ دعامة، ليتعرّف عليكم الناس من النظرة الأولى.',
        photo: photo('direction-artistique', 'لوحة إلهام: ألوان وبطاقات وعيّنات مرتّبة على طاولة'),
      },
      {
        id: 'conception-graphique',
        title: 'التصميم الغرافيكي',
        text: 'الإخراج، والرسوم البيانية، والرسوم التوضيحية: الشكل الذي يجعل المضمون مقروءًا.',
        photo: photo(
          'conception-graphique',
          'مصمّم غرافيكي يُعدّ إخراجًا على شاشة كبيرة في استوديو مضيء',
        ),
      },
      {
        id: 'impression',
        title: 'الطباعة',
        text: 'اختيار الورق واللمسات النهائية، ومتابعة التصنيع حتى التسليم.',
        photo: photo('impression', 'طبّاع يضبط أسطوانات الحبر في آلة طباعة'),
      },
    ],
  },
  works: {
    eyebrow: 'إنجازاتنا',
    title: 'توقيعنا يُقرأ فيها.',
    craftsLabel: 'المهارات المسخّرة',
    items: [
      {
        title: 'الكتالوجات المؤسساتية لـ SAPTA وSNTP',
        text: 'حُرّرت وصُمّمت وطُبعت بالكامل على أيدينا: مؤسستان مرجعيتان تقدّمان مهنهما وإنجازاتهما في وثيقة ترقى إلى مستواهما.',
        crafts: ['التحرير', 'التصميم الغرافيكي', 'الطباعة'],
        logos: LOGOS,
      },
      {
        title: 'موقع OPEM',
        text: 'الموقع الذي تتصفّحونه الآن صمّمته فرقنا، بالفرنسية والعربية.',
        crafts: ['التحرير', 'الإدارة الفنية', 'الموقع الإلكتروني'],
        screen: site('الصفحة الرئيسية لموقع OPEM، من تصميم فرقنا'),
      },
    ],
  },
  belief: {
    quote: 'نفهم مهنكم قبل أن نرويها.',
    text: 'مكتب استشارات قبل أن يكون وكالة، تعرف OPEM من الداخل المؤسسات التي ترافقها. دعائمنا تتحدث لغتكم، ولغة زبائنكم.',
    photo: photo('atelier', 'من الأعلى: فريق يعمل حول طاولة كبيرة مغطّاة بالوثائق ولوحات الألوان'),
  },
  method: {
    eyebrow: 'منهجيتنا',
    title: 'من المقابلة الأولى إلى الدعامة المسلَّمة.',
    steps: [
      {
        title: 'الفهم',
        text: 'نلتقي فرقكم ونقرأ وثائقكم: لا نروي جيّدًا إلا ما فهمناه.',
      },
      { title: 'الكتابة', text: 'الرسالة أولًا: ما تريدون أن يُحفظ عنكم، مقولًا ببساطة.' },
      {
        title: 'التصميم',
        text: 'الإدارة الفنية، والإخراج، والنماذج: مقترحات نصقلها معكم.',
      },
      {
        title: 'الإنتاج',
        text: 'الطباعة، والتصوير، والنشر على الإنترنت: نتابع التصنيع حتى أدقّ التفاصيل.',
      },
      {
        title: 'النشر',
        text: 'تصل دعائمكم إلى جمهورها: الزبائن، والشركاء، والمؤسسات، والمعارض.',
      },
    ],
  },
  reasons: {
    eyebrow: 'لماذا نحن',
    title: 'ما يصنع الفرق.',
    items: [
      {
        title: 'نظرة المستشار',
        text: 'نفهم مهنكم ورهاناتكم: تقول دعائمكم الجوهري، دون مصطلحات غامضة ولا تقريب.',
      },
      {
        title: 'فريق واحد، من النص إلى الطباعة',
        text: 'محاور واحد للتحرير والإبداع والتصنيع: آجال أقصر، ولا شيء يضيع في الطريق.',
      },
      {
        title: 'ثنائية اللغة، بطبيعة الحال',
        text: 'الفرنسية والعربية، تُحرَّران بالعناية نفسها، بدل الترجمة الحرفية.',
      },
    ],
  },
  faq: {
    eyebrow: 'أسئلة شائعة',
    title: 'قبل أن نبدأ.',
    items: [
      {
        question: 'هل يمكنكم الانطلاق من ميثاقنا البصري؟',
        answer: 'نعم. نحترمه ونُحييه؛ وإن كان يستحق التحديث، نقترح ذلك عليكم دون أن نفرضه أبدًا.',
      },
      {
        question: 'هل تحرّرون النصوص أيضًا؟',
        answer:
          'نعم، ومن هنا يبدأ كلّ شيء. نجمع المعلومات من فرقكم ونحرّر نصوصًا تصادقون عليها قبل أيّ إخراج.',
      },
      {
        question: 'هل تتكفّلون بالطباعة؟',
        answer:
          'نعم. ننصحكم في اختيار الورق واللمسات النهائية، ونتابع التصنيع، ونراقب النتيجة قبل التسليم.',
      },
      {
        question: 'هل تصمّمون دعائم بالعربية؟',
        answer:
          'نعم. يمكن تصميم دعائمكم بالفرنسية أو بالعربية أو باللغتين، وتُحرَّر كلّ لغة بالعناية نفسها.',
      },
      {
        question: 'كم من الوقت يلزم لإنجاز كتالوج؟',
        answer:
          'يتوقّف ذلك على الحجم وعلى المعلومات المتوفّرة. نحدّد معًا رزنامة منذ البداية، بما فيها مراحل المصادقة.',
      },
    ],
  },
};

export const communicationContent: Record<Lang, CommunicationContent> = { fr: FR, ar: AR };
