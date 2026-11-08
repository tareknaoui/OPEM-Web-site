import type { Lang } from '@/i18n/language';

/**
 * Textes de la page « Le cabinet », reconstruite en neuf blocs (cahier d'OPEM, novembre 2026) :
 * 01 Ouverture · 02 Notre histoire · 03 Notre regard · 04 Travailler avec OPEM · 05 Nos valeurs ·
 * 06 Nos engagements · 07 Notre réseau d'experts · 08 Nos garanties · 09 Deux portes.
 * Les blocs arrivent au fur et à mesure ; les textes repris du site de 2019 sont abandonnés.
 * Textes d'OPEM repris mot pour mot (français) ; arabe traduit, à faire relire.
 */
export type CabinetContent = {
  /**
   * Titre de l'onglet et de Google, mot pour mot, sans le nom du site ajouté à la suite. La
   * description et les réglages des réseaux sociaux sont dans vite.seo.ts (PAGE_META).
   */
  title: string;
  /**
   * 01 Ouverture : la photo (texte alternatif), le titre et le texte d'ouverture du cahier.
   */
  hero: {
    eyebrow: string;
    /** Deux parties : le nom complet et le sigle en bleu OPEM, la suite en bleu nuit. */
    headline: [string, string];
    intro: string;
    alt: string;
    /** Nom de la barre des rubriques (lecteurs d'écran). */
    toc: string;
  };
  /** 02 Notre histoire : surtitre, titre, texte, puis la frise des trois repères. */
  history: {
    eyebrow: string;
    title: string;
    /** Texte alternatif de la frise dessinée. */
    alt: string;
    /**
     * Trois actes, un par repère de la frise (posés chacun au-dessus de son pilier) ; mis bout à
     * bout, le texte d'OPEM mot pour mot. Mots clés : *bleu*, [[vert]] (le vert des cubes neufs).
     */
    text: [string, string, string];
    milestones: { year: string; title: string; text: string }[];
  };
  /** 03 Notre regard : surtitre, titre, puis trois idées numérotées (titre et texte). */
  regard: {
    eyebrow: string;
    title: string;
    ideas: { title: string; text: string }[];
  };
  /**
   * 04 Travailler avec OPEM (ancre #travailler-avec-opem, visée par la FAQ de l'accueil) :
   * quatre temps, chacun avec son verbe, son texte et son engagement (après « Notre engagement : »).
   */
  method: {
    eyebrow: string;
    title: string;
    /** « Notre engagement : », suivi à l'affichage de l'engagement de chaque temps. */
    promiseLabel: string;
    steps: { verb: string; text: string; promise: string }[];
  };
  /** 05 Nos valeurs : surtitre, titre, puis six valeurs (intitulé et phrase). */
  values: {
    eyebrow: string;
    title: string;
    items: { label: string; text: string }[];
  };
  /**
   * 06 Nos engagements : surtitre, titre, puis le paragraphe d'un seul tenant ; les cinq
   * destinataires entre astérisques (*À nos clients,*), mis en valeur à l'affichage.
   */
  pledges: {
    eyebrow: string;
    title: string;
    text: string;
  };
  /**
   * 07 Notre réseau d'experts : surtitre, titre, la constellation (texte alternatif et trois
   * légendes), puis cinq traits (intitulé et phrase).
   */
  network: {
    eyebrow: string;
    title: string;
    alt: string;
    legends: { pool: string; team: string; beyond: string };
    traits: { title: string; text: string }[];
  };
  /**
   * 08 Nos garanties : surtitre, titre, le texte alternatif de la photo, puis six garanties
   * (intitulé et phrase). Le numéro et la date de l'habilitation manquent encore (« … ») :
   * ne pas mettre la page en ligne avant de les avoir. L'agrément environnemental viendra en
   * septième garantie à son renouvellement.
   */
  guarantees: {
    eyebrow: string;
    title: string;
    alt: string;
    items: { title: string; text: string }[];
  };
  /**
   * 09 Deux portes : surtitre, titre, puis deux portes (titre, texte, bouton). La première mène
   * à la demande de rendez-vous (comme le bouton du menu), la seconde à « Rejoindre notre réseau ».
   */
  doors: {
    eyebrow: string;
    title: string;
    client: { title: string; text: string; cta: string };
    expert: { title: string; text: string; cta: string };
  };
};

const fr: CabinetContent = {
  title: 'OPEM, cabinet de consulting et de formation à Alger',
  hero: {
    eyebrow: 'Le cabinet',
    headline: ['Optimum Performance Management (OPEM) :', 'notre nom est notre promesse.'],
    intro:
      'Fondé en 2019, OPEM s’est donné un nom qui oblige. Depuis, chaque mission est conduite à sa hauteur, sans rien y céder. Organisations publiques et privées, programmes de coopération internationale : une même exigence nous anime en conseil comme en formation.',
    alt: 'Un formateur d’OPEM anime une session devant les participants',
    toc: 'Sur cette page',
  },
  history: {
    eyebrow: 'Notre histoire',
    title: 'Ce qui nous a fait naître.',
    alt: 'Frise des étapes d’OPEM : création en 2019, sixième domaine en 2025, intelligence artificielle en 2026',
    text: [
      'À l’origine d’OPEM, une *conviction* : l’Algérie mérite des organisations dignes de son histoire et de ses ambitions.',
      'Le chemin n’a pas toujours été aisé ; rien, pourtant, n’a ébranlé cette conviction. Parti de *cinq domaines*, le cabinet en compte aujourd’hui [[six]], chacun ajouté à la demande de ses clients.',
      'Avec l’[[intelligence artificielle]], il ouvre un nouveau chapitre : préparer les organisations aux enjeux d’une société moderne, en pleine mutation.',
    ],
    milestones: [
      { year: '2019', title: 'Création d’OPEM', text: 'Cinq domaines d’expertise' },
      { year: '2025', title: 'Communication institutionnelle', text: 'Sixième domaine' },
      { year: '2026', title: 'Intelligence artificielle', text: 'Appliquée aux organisations' },
    ],
  },
  regard: {
    eyebrow: 'Notre regard',
    title: 'Ce que le terrain nous apprend.',
    ideas: [
      {
        title: 'La performance des organisations se joue au quotidien.',
        text: 'Elle se perd rarement dans les grandes décisions. Elle s’use dans les petits écarts et s’effrite, jour après jour, sans que personne ne s’en alarme.',
      },
      {
        title: 'Public ou privé, des leviers communs pour exceller.',
        text: 'Compétitivité pour l’entreprise, qualité de service pour l’institution : les finalités diffèrent, les fondamentaux demeurent. C’est ce qui nous permet de servir les deux avec une égale justesse.',
      },
      {
        title: 'L’intelligence artificielle ne corrige rien, elle amplifie.',
        text: 'Posée sur des processus clairs, elle démultiplie leurs effets. Greffée sur un fonctionnement désordonné, elle en accélère les failles, plus vite que personne ne peut les corriger.',
      },
    ],
  },
  method: {
    eyebrow: 'Travailler avec OPEM',
    title: 'Quatre temps, quatre engagements.',
    promiseLabel: 'Notre engagement :',
    steps: [
      {
        verb: 'Écouter',
        text: 'Tout commence par un constat écrit : ce que vous vivez, ce que vous pressentez, et ce que votre demande tait encore.',
        promise: 'comprendre avant de proposer.',
      },
      {
        verb: 'Construire',
        text: 'S’ensuit une proposition chiffrée, où chaque intervenant, chaque étape et chaque échéance s’ordonnent au service de votre enjeu.',
        promise: 'un budget maîtrisé d’emblée.',
      },
      {
        verb: 'Conduire',
        text: 'Chaque spécialiste intervient au moment où votre projet l’exige ; un interlocuteur unique en garantit la cohérence et vous rend compte de chaque avancée.',
        promise: 'rien ne se décide sans vous.',
      },
      {
        verb: 'Mesurer',
        text: 'À la clôture, les résultats se mesurent à l’aune des objectifs fixés ensemble.',
        promise: 'vos indicateurs, jamais les nôtres.',
      },
    ],
  },
  values: {
    eyebrow: 'Nos valeurs',
    title: 'Six valeurs, à l’épreuve des faits.',
    items: [
      {
        label: 'Perfectionnisme et culture de l’excellence',
        text: 'Le diable se cache dans les détails : c’est là que nous l’attendons.',
      },
      {
        label: 'Professionnalisme et pragmatisme',
        text: 'Une recommandation vaut par ce qu’elle change, non par ce qu’elle promet.',
      },
      {
        label: 'Respect et maîtrise des délais',
        text: 'Une échéance annoncée est une parole donnée, et nous tenons parole.',
      },
      {
        label: 'Confidentialité, confiance et honnêteté',
        text: 'Ce que vous nous confiez reste scellé ; ce que nous pensons vous est dit.',
      },
      {
        label: 'Disponibilité et réactivité',
        text: 'Vos questions n’attendent pas : nous répondons au rythme de vos décisions.',
      },
      {
        label: 'Engagement citoyen',
        text: 'Chaque organisation renforcée, c’est un peu du pays qui se construit.',
      },
    ],
  },
  pledges: {
    eyebrow: 'Nos engagements',
    title: 'Ce que nous devons à chacun.',
    text: '*À nos clients,* nous devons des recommandations que nous aurions le courage d’appliquer nous-mêmes. *À ceux que nous formons,* la sûreté du geste face aux difficultés du terrain. *À nos experts,* des missions qui honorent leur talent. *À nos partenaires,* l’usage scrupuleux de chaque ressource confiée. *Et à la société,* un savoir qui rayonne bien au-delà de ceux qui l’ont reçu.',
  },
  network: {
    eyebrow: 'Notre réseau d’experts',
    title: 'Une équipe se compose, elle ne s’improvise pas.',
    alt: 'Constellation d’experts reliés entre eux autour d’une équipe, au-delà des frontières',
    legends: { pool: 'Notre vivier', team: 'Votre équipe', beyond: 'Au-delà des frontières' },
    traits: [
      { title: 'Leur parcours', text: 'Avant de conseiller, ils ont dirigé, audité, construit.' },
      { title: 'Leur sélection', text: 'Choisis un à un, pour ce qu’ils ont accompli.' },
      {
        title: 'Leur pédagogie',
        text: 'Le savoir, l’expérience, et l’art de les transmettre à des adultes en exercice.',
      },
      {
        title: 'Leur mobilisation',
        text: 'Pour chaque mission, une équipe soigneusement taillée pour votre seul enjeu.',
      },
      {
        title: 'Leur portée',
        text: 'Ce qui manque ici, nous allons le chercher au-delà des frontières.',
      },
    ],
  },
  guarantees: {
    eyebrow: 'Nos garanties',
    title: 'Des preuves, plutôt que des promesses.',
    alt: 'Session de formation OPEM',
    items: [
      {
        title: 'Un agrément officiel',
        text: 'Établissement privé de formation professionnelle agréé par le ministère de la Formation et de l’Enseignement professionnels, par décision n° 539 du 24 décembre 2019.',
      },
      {
        // À compléter : numéro et date de l'habilitation (document de la gérante).
        title: 'Une habilitation ministérielle',
        text: 'Cabinet habilité par le ministère de l’Industrie, sous le n° …, du …, pour l’accompagnement à la certification.',
      },
      {
        title: 'Des groupes à taille humaine',
        text: 'De 10 à 15 participants, pour que chacun soit entendu et accompagné.',
      },
      {
        title: 'Une double évaluation',
        text: 'À chaud, au terme de la session ; à froid, quelques mois plus tard, sur le terrain.',
      },
      {
        title: 'Un rapport après chaque session',
        text: 'Déroulement, acquis et axes de progrès vous sont remis par écrit.',
      },
      {
        title: 'Une exigence chiffrée',
        text: 'Sous 4 sur 5 de satisfaction, une action corrective est engagée.',
      },
    ],
  },
  doors: {
    eyebrow: 'Notre porte vous est ouverte',
    title: 'Deux façons d’entrer en relation avec nous.',
    client: {
      title: 'Vous représentez une organisation',
      text: 'Un enjeu, une question, un projet encore en germe : parlons-en, sans engagement.',
      cta: 'Parlons de votre projet',
    },
    expert: {
      title: 'Vous êtes expert',
      text: 'En conseil ou en formation, vous avez exercé et vous savez transmettre ? Votre parcours nous intéresse.',
      cta: 'Rejoindre notre réseau',
    },
  },
};

const ar: CabinetContent = {
  title: 'OPEM، مكتب استشارة وتكوين بالجزائر العاصمة',
  hero: {
    eyebrow: 'المكتب',
    headline: ['Optimum Performance Management (OPEM):', 'اسمنا هو وعدنا.'],
    intro:
      'تأسّس OPEM سنة 2019، واختار لنفسه اسمًا يُلزمه. ومنذ ذلك الحين، تُنجَز كل مهمة على قدر هذا الاسم، دون أي تنازل. مؤسسات عمومية وخاصة، وبرامج تعاون دولي: الصرامة نفسها تحرّكنا في الاستشارة كما في التكوين.',
    alt: 'مكوّن من OPEM ينشّط دورة أمام المشاركين',
    toc: 'في هذه الصفحة',
  },
  history: {
    eyebrow: 'تاريخنا',
    title: 'ما الذي أوجدنا.',
    alt: 'خط زمني لمراحل OPEM: التأسيس سنة 2019، المجال السادس سنة 2025، الذكاء الاصطناعي سنة 2026',
    text: [
      'في أصل OPEM *قناعة*: الجزائر تستحق مؤسسات تليق بتاريخها وطموحاتها.',
      'لم يكن الطريق دائمًا يسيرًا؛ ومع ذلك، لم يزعزع شيء هذه القناعة. انطلق المكتب من *خمسة مجالات*، ويضمّ اليوم [[ستة]]، أُضيف كلٌّ منها بطلب من عملائه.',
      'ومع [[الذكاء الاصطناعي]]، يفتح فصلًا جديدًا: إعداد المؤسسات لرهانات مجتمع حديث في تحوّل عميق.',
    ],
    milestones: [
      { year: '2019', title: 'تأسيس OPEM', text: 'خمسة مجالات خبرة' },
      { year: '2025', title: 'الاتصال المؤسساتي', text: 'المجال السادس' },
      { year: '2026', title: 'الذكاء الاصطناعي', text: 'مطبَّق على المؤسسات' },
    ],
  },
  regard: {
    eyebrow: 'نظرتنا',
    title: 'ما يعلّمنا إيّاه الميدان.',
    ideas: [
      {
        title: 'أداء المؤسسات يُصنع في اليومي.',
        text: 'نادرًا ما يضيع في القرارات الكبرى. إنه يتآكل في الانحرافات الصغيرة ويتفتّت، يومًا بعد يوم، دون أن يثير قلق أحد.',
      },
      {
        title: 'عامّةً كانت أو خاصّة، روافع مشتركة للتميّز.',
        text: 'التنافسية للمؤسسة الاقتصادية، وجودة الخدمة للمؤسسة العمومية: تختلف الغايات وتبقى الأسس ثابتة. وهذا ما يتيح لنا خدمة الطرفين بالدقّة نفسها.',
      },
      {
        title: 'الذكاء الاصطناعي لا يصحّح شيئًا، بل يضخّم.',
        text: 'إذا وُضع على مسارات واضحة، ضاعف آثارها. وإذا أُلحق بتسيير مضطرب، سرّع ثغراته، أسرع مما يستطيع أيّ أحد تداركه.',
      },
    ],
  },
  method: {
    eyebrow: 'العمل مع OPEM',
    title: 'أربع مراحل، أربعة التزامات.',
    promiseLabel: 'التزامنا:',
    steps: [
      {
        verb: 'الإصغاء',
        text: 'يبدأ كل شيء بتشخيص مكتوب: ما تعيشونه، وما تستشعرونه، وما لا يزال طلبكم يسكت عنه.',
        promise: 'أن نفهم قبل أن نقترح.',
      },
      {
        verb: 'البناء',
        text: 'يليه عرض مُقيَّم ماليًّا، تنتظم فيه كل مداخلة وكل مرحلة وكل أجل في خدمة رهانكم.',
        promise: 'ميزانية مضبوطة منذ البداية.',
      },
      {
        verb: 'القيادة',
        text: 'يتدخّل كل مختص في الوقت الذي يقتضيه مشروعكم؛ ومحاور واحد يضمن انسجامه ويُطلعكم على كل تقدّم.',
        promise: 'لا شيء يُقرَّر من دونكم.',
      },
      {
        verb: 'القياس',
        text: 'عند الاختتام، تُقاس النتائج على ضوء الأهداف المحدَّدة معًا.',
        promise: 'مؤشراتكم، لا مؤشراتنا أبدًا.',
      },
    ],
  },
  values: {
    eyebrow: 'قيمنا',
    title: 'ست قيم، على محكّ الوقائع.',
    items: [
      {
        label: 'الإتقان وثقافة التميّز',
        text: 'الشيطان يكمن في التفاصيل: وهناك ننتظره.',
      },
      {
        label: 'الاحترافية والواقعية',
        text: 'تُقاس التوصية بما تغيّره، لا بما تَعِد به.',
      },
      {
        label: 'احترام الآجال والتحكّم فيها',
        text: 'الأجل المُعلَن كلمة معطاة، ونحن نفي بكلمتنا.',
      },
      {
        label: 'السرّية والثقة والنزاهة',
        text: 'ما تأتمنوننا عليه يبقى مختومًا؛ وما نراه نقوله لكم.',
      },
      {
        label: 'التوفّر وسرعة الاستجابة',
        text: 'أسئلتكم لا تنتظر: نجيب بإيقاع قراراتكم.',
      },
      {
        label: 'الالتزام المواطن',
        text: 'كل مؤسسة تتعزّز هي جزء من الوطن يُبنى.',
      },
    ],
  },
  pledges: {
    eyebrow: 'التزاماتنا',
    title: 'ما ندين به لكلّ طرف.',
    text: '*لعملائنا،* ندين بتوصيات نملك الشجاعة لتطبيقها على أنفسنا. *ولمن نكوّنهم،* ثبات اليد أمام صعوبات الميدان. *ولخبرائنا،* مهامّ تليق بموهبتهم. *ولشركائنا،* الاستعمال الدقيق لكلّ مورد يُعهد به إلينا. *وللمجتمع،* معرفة يمتدّ إشعاعها إلى ما هو أبعد بكثير ممّن تلقّوها.',
  },
  network: {
    eyebrow: 'شبكة خبرائنا',
    title: 'الفريق يُشكَّل، ولا يُرتجَل.',
    alt: 'كوكبة من الخبراء المترابطين حول فريق، فيما وراء الحدود',
    legends: { pool: 'رصيد خبرائنا', team: 'فريقكم', beyond: 'ما وراء الحدود' },
    traits: [
      { title: 'مساراتهم', text: 'قبل أن يقدّموا المشورة، أداروا ودقّقوا وبنوا.' },
      { title: 'انتقاؤهم', text: 'اختيروا واحدًا واحدًا، لما أنجزوه.' },
      { title: 'بيداغوجيتهم', text: 'المعرفة والخبرة، وفنّ نقلهما إلى راشدين يزاولون عملهم.' },
      { title: 'تعبئتهم', text: 'لكل مهمة، فريق مُفصَّل بعناية على مقاس رهانكم وحده.' },
      { title: 'امتدادهم', text: 'ما ينقصنا هنا، نبحث عنه فيما وراء الحدود.' },
    ],
  },
  guarantees: {
    eyebrow: 'ضماناتنا',
    title: 'براهين، لا وعود.',
    alt: 'دورة تكوينية لـ OPEM',
    items: [
      {
        title: 'اعتماد رسمي',
        text: 'مؤسسة خاصة للتكوين المهني معتمدة من وزارة التكوين والتعليم المهنيين، بموجب المقرر رقم 539 المؤرخ في 24 ديسمبر 2019.',
      },
      {
        // À compléter : numéro et date de l'habilitation (document de la gérante).
        title: 'تأهيل وزاري',
        text: 'مكتب مؤهَّل من وزارة الصناعة، تحت رقم …، بتاريخ …، لمرافقة المؤسسات نحو الإشهاد.',
      },
      {
        title: 'مجموعات بحجم إنساني',
        text: 'من 10 إلى 15 مشاركًا، حتى يُصغى إلى كل واحد منهم ويُرافَق.',
      },
      {
        title: 'تقييم مزدوج',
        text: 'تقييم فوري في ختام الدورة، وتقييم لاحق بعد بضعة أشهر، في الميدان.',
      },
      {
        title: 'تقرير بعد كل دورة',
        text: 'نسلّمكم كتابيًا سير الدورة والمكتسبات ومحاور التحسين.',
      },
      {
        title: 'صرامة بالأرقام',
        text: 'إذا قلّ الرضا عن 4 من 5، نباشر إجراءً تصحيحيًا.',
      },
    ],
  },
  doors: {
    eyebrow: 'بابنا مفتوح لكم',
    title: 'طريقتان للتواصل معنا.',
    client: {
      title: 'تمثّلون مؤسسة',
      text: 'رهان، سؤال، مشروع لا يزال في بدايته: لنتحدّث عنه، دون أي التزام.',
      cta: 'لنتحدّث عن مشروعكم',
    },
    expert: {
      title: 'أنتم خبير',
      text: 'في الاستشارة أو التكوين، مارستم المهنة وتُحسنون نقل المعرفة؟ مساركم يهمّنا.',
      cta: 'انضمّوا إلى شبكتنا',
    },
  },
};

export const cabinetContent: Record<Lang, CabinetContent> = { fr, ar };
