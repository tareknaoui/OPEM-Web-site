import type { Lang } from '@/i18n/language';

/*
 * Textes de la page « Nos expertises » (/nos-expertises). Le français est repris mot pour mot du
 * cahier des charges ; seules les espaces insécables sont ajoutées (avant « : », « ; », « ? »,
 * après « à » dans les enjeux, « le vôtre », « L'IA, là »…). Les mots inscrits dans les visuels
 * des blocs 03 à 05 sont indicatifs. L'arabe est à faire relire par OPEM.
 */

const N = ' ';
/** Typographie française : espace insécable avant les ponctuations hautes. */
const fr = (text: string) => text.replace(/ ([:;?!])/g, `${N}$1`);

export type Domain = {
  id: string;
  title: string;
  text: string;
  /** La ligne de typologie : les deux premiers éléments en relief. */
  typology: { strong: string[]; rest: string[] };
  reference: string;
  link: { label: string; href: string };
  illustration: string;
};

export type ExpertisesContent = {
  title: string;
  /** Titre de l'onglet et de Google, mot pour mot (réglages de vite.seo.ts : PAGE_META). */
  pageTitle: string;
  opening: {
    eyebrow: string;
    title: [string, string];
    issues: string[];
    closing: string;
  };
  domains: { eyebrow: string; title: string; lead: string; items: Domain[] };
  together: {
    eyebrow: string;
    title: string;
    figures: { value: string; label: string }[];
    text: string;
    lanes: string[];
    caption: [string, string];
    alt: string;
  };
  ai: {
    eyebrow: string;
    title: string;
    text: string;
    link: { label: string; ariaLabel: string; href: string };
    verdicts: { word: string; condition: string }[];
    alt: string;
  };
  talk: {
    eyebrow: string;
    title: [string, string];
    text: string;
    button: string;
    note: string;
    marks: { situation: string; step: string; course: string };
    alt: string;
  };
};

const ILLUSTRATIONS = '/images/domaines/illustrations';

/** Identifiants des six cartes du bloc 02 (cibles des enjeux du bloc 01), dans l'ordre. */
export const DOMAIN_IDS = [
  'etudes-strategiques',
  'accompagnement-des-organisations',
  'formation-qualifiante',
  'coaching-professionnel',
  'certification-et-accreditation',
  'communication-institutionnelle',
] as const;

const HREFS = [
  '/expertises/etudes-strategiques',
  '/expertises/accompagnement-des-organisations',
  '/formation',
  '/expertises/coaching-professionnel',
  '/expertises/certification-et-accreditation',
  '/expertises/communication-institutionnelle',
];
const PICTURES = [
  'etudes-strategiques',
  'accompagnement',
  'formations',
  'coaching',
  'certification',
  'communication',
];

type DomainText = Omit<Domain, 'id' | 'illustration' | 'link'> & { linkLabel: string };
const withMeta = (items: DomainText[]): Domain[] =>
  items.map(({ linkLabel, ...item }, index) => ({
    ...item,
    id: DOMAIN_IDS[index] ?? '',
    link: { label: linkLabel, href: HREFS[index] ?? '/' },
    illustration: `${ILLUSTRATIONS}/${PICTURES[index]}`,
  }));

const FR: ExpertisesContent = {
  title: 'Nos expertises',
  pageTitle: 'Six expertises de consulting et de formation à Alger | OPEM',
  opening: {
    eyebrow: 'Nos expertises',
    title: [
      'Chaque enjeu, en consulting comme en formation, mérite sa propre réponse.',
      `Commençons par le${N}vôtre.`,
    ],
    issues: [
      `Une décision à${N}préparer`,
      `Une transformation à${N}conduire`,
      `Des compétences à${N}développer`,
      `Une prise de poste à${N}réussir`,
      `Une certification à${N}obtenir`,
      `Un savoir-faire à${N}faire connaître`,
    ],
    closing: fr('Plusieurs se croisent ? C’est souvent là que nous sommes le plus utiles.'),
  },
  domains: {
    eyebrow: 'Nos expertises',
    title: 'Six métiers, une seule exigence',
    lead: fr(
      'Éclairer vos décisions, transformer votre organisation, transmettre vos compétences, questionner vos certitudes, certifier vos pratiques, valoriser votre image : six enjeux, chacun confié au métier qui s’y consacre.',
    ),
    items: withMeta([
      {
        title: 'Études stratégiques',
        text: fr(
          'Une décision engage l’avenir ; elle mérite mieux qu’une intuition. Nos études en établissent les faits, en chiffrent le coût et en mesurent les chances de réussite, pour que vous décidiez en connaissance de cause.',
        ),
        typology: {
          strong: [
            'Études de marché et d’opportunité',
            'analyses économiques, sectorielles et de filières',
          ],
          rest: [
            'études d’impact',
            'études environnementales',
            'évaluations de projets et de dispositifs.',
          ],
        },
        reference: fr(
          'Parmi nos références : pour la GIZ, au profit du ministère de l’Industrie, une étude sur la mortalité des entreprises, afin de repérer précocement celles en difficulté ; au profit du ministère de la Formation et de l’Enseignement professionnels, un diagnostic des dispositifs de formation à l’entrepreneuriat.',
        ),
        linkLabel: 'Découvrir ce domaine',
      },
      {
        title: 'Accompagnement des organisations',
        text: 'Une organisation se transforme par chantiers successifs. Notre accompagnement les hiérarchise, les conçoit, les déploie et conduit le changement, pour que vous progressiez sans fragiliser l’existant.',
        typology: {
          strong: ['Diagnostic d’entreprise', 'accompagnement du changement'],
          rest: [
            'gouvernance et pilotage',
            'investissements et partenariats',
            'conformité et protection des données.',
          ],
        },
        reference: fr(
          'Parmi nos références : pour une agence publique, la révision de la structure organisationnelle et des postes ; pour une entreprise publique économique, la conception et le déploiement de la gestion prévisionnelle des emplois et des compétences ; pour des entreprises privées, diagnostic, tableaux de bord et automatisation.',
        ),
        linkLabel: 'Découvrir ce domaine',
      },
      {
        title: 'Formation qualifiante',
        text: 'Une compétence se construit, puis s’éprouve au travail. Nos formations, sur mesure ou en session ouverte, en posent les bases, en guident la pratique et en mesurent les acquis, pour que vous en tiriez un bénéfice durable.',
        typology: {
          strong: ['Programmes intra-entreprise sur mesure', 'sessions inter-entreprises'],
          rest: [
            'management et gestion',
            'projets et marchés publics',
            'numérique et intelligence artificielle.',
          ],
        },
        reference: fr(
          `Gage de sérieux : établissement privé de formation professionnelle agréé par le ministère de la Formation et de l’Enseignement professionnels, par décision n°${N}539 du 24${N}décembre 2019.`,
        ),
        linkLabel: 'Voir le catalogue et les sessions',
      },
      {
        title: 'Coaching professionnel',
        text: 'Plus on dirige, moins on est contredit. Notre coaching questionne vos certitudes, vous contredit avec égards et vous accompagne jusqu’à l’action, pour que vous préserviez votre lucidité, même sous pression.',
        typology: {
          strong: ['Coaching de dirigeants', 'accompagnement des prises de poste'],
          rest: [
            'coaching de managers',
            'cohésion et dynamique d’équipe',
            'transitions de carrière.',
          ],
        },
        reference: fr(
          'Un interlocuteur de confiance, libre de tout intérêt autre que votre réussite : exigeant à votre égard, attentif à vos contraintes.',
        ),
        linkLabel: 'Découvrir ce domaine',
      },
      {
        title: 'Certification et accréditation',
        text: fr(
          'Un certificat rassure ; une pratique convainc. Nos experts traduisent la norme en gestes de travail, préparent vos audits et vous mènent jusqu’à la certification, pour que vous méritiez durablement la confiance.',
        ),
        typology: {
          strong: ['Normes ISO', 'préparation aux audits'],
          rest: [
            'levée des non-conformités',
            'marquage CE',
            'certification Halal',
            'référentiel accueil',
            'marquage TEDJ.',
          ],
        },
        reference: fr(
          `Parmi nos références : l’accompagnement d’une entreprise industrielle privée sur son système de management intégré (ISO${N}9001, 14001 et 45001) ; la levée des non-conformités du système d’une entreprise publique.`,
        ),
        linkLabel: 'Découvrir ce domaine',
      },
      {
        title: 'Communication institutionnelle',
        text: 'Soigner son image, c’est respecter ses clients. Nos équipes racontent votre histoire, conçoivent vos supports et les diffusent, pour que vous soyez reconnus à la hauteur de votre travail.',
        typology: {
          strong: ['Catalogues de présentation et de savoir-faire', 'sites web'],
          rest: [
            'contenus vidéo',
            'rédaction',
            'direction artistique',
            'conception graphique',
            'impression.',
          ],
        },
        reference: fr(
          'Parmi nos références : les catalogues institutionnels de la SAPTA et de la SNTP, entièrement rédigés, conçus et imprimés par nos soins. Notre signature s’y lit.',
        ),
        linkLabel: 'Découvrir ce domaine',
      },
    ]),
  },
  together: {
    eyebrow: 'Les métiers se relaient',
    title: 'Un client, quatre métiers.',
    figures: [
      { value: '+30', label: 'cycles de formation' },
      { value: '+150', label: 'apprenants' },
    ],
    text: 'Une entreprise publique économique du BTPH nous a confié la réalisation de ses catalogues institutionnels, la formation de ses équipes et le renforcement de leurs compétences sur son système de management intégré. Cette confiance s’étend aux études organisationnelles et à la mise en place de sa gestion prévisionnelle des emplois et des compétences.',
    lanes: [
      'Accompagnement des organisations',
      'Formation qualifiante',
      'Communication institutionnelle',
      'Certification et accréditation',
    ],
    caption: ['Quatre voies, un même tracé.', 'Elles se poursuivent.'],
    alt: fr(
      'Plan de tracé de quatre voies parallèles portant les quatre métiers d’OPEM : accompagnement des organisations, formation qualifiante, communication institutionnelle, certification et accréditation. Les voies se poursuivent au-delà du cadre.',
    ),
  },
  ai: {
    eyebrow: 'IA appliquée',
    title: `L’IA,${N}là où elle sert vraiment.`,
    text: fr(
      'L’intelligence artificielle ne s’improvise pas : elle ne vaut que par ce qu’elle apporte réellement à votre métier. Bien employée, elle libère le temps de vos équipes, accroît leur productivité, éclaire vos décisions et vous épargne des erreurs coûteuses. Employée sans discernement, ou par simple effet de mode, elle peut tromper, exposer vos données ou installer une dépendance. C’est pourquoi nous examinons avec vous chaque usage, en pesant ses promesses et ses risques. Quand le bénéfice ne justifie pas l’investissement, nous avons la franchise de vous le dire.',
    ),
    link: {
      label: 'Découvrir l’IA appliquée',
      ariaLabel: fr(
        'Découvrir l’IA appliquée : nos solutions et notre démarche en intelligence artificielle',
      ),
      href: '/ia-appliquee',
    },
    verdicts: [
      { word: 'Oui.', condition: 'quand le gain est clair, mesurable et durable' },
      {
        word: 'Pas encore.',
        condition: 'quand vos données ou vos processus doivent d’abord être mis en ordre',
      },
      { word: 'Non.', condition: 'quand le bénéfice ne justifie pas l’investissement' },
    ],
    alt: fr('Trois verdicts possibles d’un examen d’usage : oui, pas encore, non'),
  },
  talk: {
    eyebrow: 'Premier échange',
    title: ['Ce qui attend aujourd’hui', 'coûte davantage demain.'],
    text: fr(
      'Une décision à éclairer, une transformation à conduire, des compétences à faire grandir : souvent, tout se présente à la fois. Exposez-nous votre situation, même inachevée. Nous prenons le temps de la comprendre ; vous repartez avec un cap tracé et un premier pas assuré.',
    ),
    button: 'Parlons de votre projet',
    note: 'Échange confidentiel, sans engagement. Un formulaire, quelques lignes.',
    marks: { situation: 'Votre situation', step: 'Premier pas', course: 'Cap' },
    alt: fr(
      'Un tracé d’abord emmêlé qui se déploie en une ligne droite menant à un point : un cap tracé et un premier pas',
    ),
  },
};

const AR: ExpertisesContent = {
  title: 'خبراتنا',
  pageTitle: 'ست خبرات في الاستشارة والتكوين بالجزائر العاصمة | OPEM',
  opening: {
    eyebrow: 'خبراتنا',
    title: ['لكل رهان، في الاستشارة كما في التكوين، جوابه الخاص.', 'لنبدأ برهانكم.'],
    issues: [
      'قرار يجب التحضير له',
      'تحوّل يجب قيادته',
      'كفاءات يجب تطويرها',
      'منصب جديد يجب النجاح فيه',
      'إشهاد يجب الحصول عليه',
      'مهارة يجب التعريف بها',
    ],
    closing: 'تتقاطع عدة رهانات؟ هنا غالبًا نكون أكثر نفعًا.',
  },
  domains: {
    eyebrow: 'خبراتنا',
    title: 'ست مهن، ومطلب واحد',
    lead: 'إنارة قراراتكم، تحويل مؤسستكم، نقل كفاءاتكم، مساءلة يقينياتكم، إشهاد ممارساتكم، تثمين صورتكم: ستة رهانات، كلٌّ منها موكول إلى المهنة المتفرغة له.',
    items: withMeta([
      {
        title: 'الدراسات الاستراتيجية',
        text: 'القرار يرهن المستقبل؛ وهو يستحق أكثر من حدس. دراساتنا تثبت وقائعه، وتقدّر كلفته، وتقيس حظوظ نجاحه، لكي تقرروا عن بيّنة.',
        typology: {
          strong: ['دراسات السوق والفرص', 'التحليلات الاقتصادية والقطاعية وتحليل الشُّعب'],
          rest: ['دراسات الأثر', 'الدراسات البيئية', 'تقييم المشاريع والأجهزة.'],
        },
        reference:
          'من مراجعنا: لصالح الوكالة الألمانية للتعاون الدولي (GIZ)، ولفائدة وزارة الصناعة، دراسة حول اندثار المؤسسات قصد الكشف المبكر عن المتعثرة منها؛ ولفائدة وزارة التكوين والتعليم المهنيين، تشخيص أجهزة التكوين في المقاولاتية.',
        linkLabel: 'اكتشفوا هذا المجال',
      },
      {
        title: 'مرافقة المؤسسات',
        text: 'تتحول المؤسسة عبر ورشات متتالية. مرافقتنا ترتّبها حسب الأولوية، وتصممها، وتنشرها، وتقود التغيير، لكي تتقدموا دون الإخلال بالقائم.',
        typology: {
          strong: ['تشخيص المؤسسة', 'مرافقة التغيير'],
          rest: ['الحوكمة والقيادة', 'الاستثمارات والشراكات', 'الامتثال وحماية المعطيات.'],
        },
        reference:
          'من مراجعنا: لوكالة عمومية، مراجعة الهيكل التنظيمي والمناصب؛ لمؤسسة عمومية اقتصادية، تصميم ونشر التسيير التقديري للوظائف والكفاءات؛ لمؤسسات خاصة، التشخيص ولوحات القيادة والأتمتة.',
        linkLabel: 'اكتشفوا هذا المجال',
      },
      {
        title: 'التكوين التأهيلي',
        text: 'الكفاءة تُبنى، ثم تُختبر في العمل. تكويناتنا، حسب الطلب أو في دورات مفتوحة، تضع أسسها، وتوجّه ممارستها، وتقيس مكتسباتها، لكي تجنوا منها فائدة دائمة.',
        typology: {
          strong: ['برامج داخل المؤسسة حسب الطلب', 'دورات بين المؤسسات'],
          rest: ['الإدارة والتسيير', 'المشاريع والصفقات العمومية', 'الرقمنة والذكاء الاصطناعي.'],
        },
        reference:
          'ضمان للجدية: مؤسسة خاصة للتكوين المهني معتمدة من وزارة التكوين والتعليم المهنيين، بموجب المقرر رقم 539 المؤرخ في 24 ديسمبر 2019.',
        linkLabel: 'اطّلعوا على الدليل والدورات',
      },
      {
        title: 'الكوتشينغ المهني',
        text: 'كلما ارتفع موقع القيادة، قلّ من يعارضك. كوتشينغنا يُسائل يقينياتكم، ويعارضكم باحترام، ويرافقكم حتى الفعل، لكي تحافظوا على صفاء رؤيتكم، حتى تحت الضغط.',
        typology: {
          strong: ['كوتشينغ المسيّرين', 'مرافقة تولّي المناصب'],
          rest: ['كوتشينغ المديرين', 'تماسك الفرق وديناميكيتها', 'التحولات المهنية.'],
        },
        reference: 'محاور موثوق، متحرر من أي مصلحة غير نجاحكم: صارم معكم، منتبه لقيودكم.',
        linkLabel: 'اكتشفوا هذا المجال',
      },
      {
        title: 'الإشهاد والاعتماد',
        text: 'الشهادة تطمئن؛ والممارسة تقنع. يترجم خبراؤنا المعيار إلى حركات عمل، ويحضّرون تدقيقاتكم، ويقودونكم حتى الإشهاد، لكي تستحقوا الثقة على الدوام.',
        typology: {
          strong: ['معايير ISO', 'التحضير للتدقيقات'],
          rest: ['رفع حالات عدم المطابقة', 'وسم CE', 'إشهاد حلال', 'مرجعية الاستقبال', 'وسم TEDJ.'],
        },
        reference:
          'من مراجعنا: مرافقة مؤسسة صناعية خاصة في نظام إدارتها المدمج (ISO 9001 و14001 و45001)؛ رفع حالات عدم المطابقة في نظام مؤسسة عمومية.',
        linkLabel: 'اكتشفوا هذا المجال',
      },
      {
        title: 'الاتصال المؤسساتي',
        text: 'العناية بالصورة احترامٌ للزبائن. فرقنا تروي قصتكم، وتصمم دعائمكم، وتنشرها، لكي يُعترف بكم على قدر عملكم.',
        typology: {
          strong: ['كتالوجات التقديم والمهارات', 'المواقع الإلكترونية'],
          rest: ['المحتوى المرئي', 'التحرير', 'الإدارة الفنية', 'التصميم الغرافيكي', 'الطباعة.'],
        },
        reference:
          'من مراجعنا: الكتالوجات المؤسساتية لـ SAPTA وSNTP، المحرّرة والمصمّمة والمطبوعة بالكامل من طرفنا. توقيعنا يُقرأ فيها.',
        linkLabel: 'اكتشفوا هذا المجال',
      },
    ]),
  },
  together: {
    eyebrow: 'المهن تتكامل',
    title: 'زبون واحد، أربع مهن.',
    figures: [
      { value: '+30', label: 'دورة تكوينية' },
      { value: '+150', label: 'متكوّنًا' },
    ],
    text: 'عهدت إلينا مؤسسة عمومية اقتصادية في قطاع البناء والأشغال العمومية والري بإنجاز كتالوجاتها المؤسساتية، وتكوين فرقها، وتعزيز كفاءاتهم في نظام إدارتها المدمج. وتمتد هذه الثقة إلى الدراسات التنظيمية وإلى وضع التسيير التقديري للوظائف والكفاءات.',
    lanes: ['مرافقة المؤسسات', 'التكوين التأهيلي', 'الاتصال المؤسساتي', 'الإشهاد والاعتماد'],
    caption: ['أربعة مسارات، خط واحد.', 'وهي تتواصل.'],
    alt: 'مخطط لأربعة مسارات متوازية تحمل مهن OPEM الأربع: مرافقة المؤسسات، التكوين التأهيلي، الاتصال المؤسساتي، الإشهاد والاعتماد. تتواصل المسارات خارج الإطار.',
  },
  ai: {
    eyebrow: 'الذكاء الاصطناعي التطبيقي',
    title: 'الذكاء الاصطناعي، حيث ينفع حقًا.',
    text: 'الذكاء الاصطناعي لا يُرتجل: لا قيمة له إلا بما يضيفه فعلًا إلى مهنتكم. إذا أُحسن استعماله، حرّر وقت فرقكم، ورفع إنتاجيتها، وأنار قراراتكم، وجنّبكم أخطاء مكلفة. وإذا استُعمل دون تبصّر، أو لمجرد مسايرة الموضة، فقد يضلّل، أو يعرّض معطياتكم للخطر، أو يُرسّخ تبعية. لذلك نفحص معكم كل استعمال، موازنين وعوده ومخاطره. وحين لا تبرّر الفائدةُ الاستثمارَ، نتحلى بالصراحة لنقول لكم ذلك.',
    link: {
      label: 'اكتشفوا الذكاء الاصطناعي التطبيقي',
      ariaLabel: 'اكتشفوا الذكاء الاصطناعي التطبيقي: حلولنا ومقاربتنا في الذكاء الاصطناعي',
      href: '/ia-appliquee',
    },
    verdicts: [
      { word: 'نعم.', condition: 'حين يكون المكسب واضحًا وقابلًا للقياس ودائمًا' },
      { word: 'ليس بعد.', condition: 'حين يجب أولًا ترتيب معطياتكم أو عملياتكم' },
      { word: 'لا.', condition: 'حين لا تبرّر الفائدة الاستثمار' },
    ],
    alt: 'ثلاثة أحكام ممكنة لفحص استعمال ما: نعم، ليس بعد، لا',
  },
  talk: {
    eyebrow: 'أول تواصل',
    title: ['ما ينتظر اليوم', 'يكلّف أكثر غدًا.'],
    text: 'قرار يجب إنارته، تحوّل يجب قيادته، كفاءات يجب تنميتها: غالبًا ما يأتي كل شيء دفعة واحدة. اعرضوا علينا وضعيتكم، ولو كانت غير مكتملة. نأخذ الوقت لفهمها؛ وتنصرفون بوجهة مرسومة وخطوة أولى ثابتة.',
    button: 'لنتحدث عن مشروعكم',
    note: 'تواصل سرّي، دون التزام. استمارة، وبضعة أسطر.',
    marks: { situation: 'وضعيتكم', step: 'الخطوة الأولى', course: 'الوجهة' },
    alt: 'مسار متشابك في البداية يتحول إلى خط مستقيم يقود إلى نقطة: وجهة مرسومة وخطوة أولى',
  },
};

export const expertisesContent: Record<Lang, ExpertisesContent> = { fr: FR, ar: AR };
