import type { Lang } from '@/i18n/language';

/*
 * Textes de la page « Études stratégiques ». Le français est repris mot pour mot du cahier des
 * charges ; seules les espaces insécables sont ajoutées (avant « : », « ; », « ? »). Les blocs
 * 03 à 06 viendront au fur et à mesure. L'arabe est à faire relire par OPEM.
 */

const fr = (text: string) => text.replace(/ ([:;?!])/g, ' $1');

/** Une étude : son intitulé, puis sa description (affichés « intitulé : description »). */
export type Study = { label: string; text: string };

/** Une famille d'études (bloc 02) : numéro, titre, phrase d'ouverture, études. */
export type StudyFamily = { number: string; title: string; lead: string; studies: Study[] };

export type EtudesContent = {
  title: string;
  opening: { eyebrow: string; title: string; text: string; alt: string };
  /**
   * Bloc 02 « Votre situation » : quatre familles d'études, chacune présentée comme la maquette
   * C1 (bandeau bleu nuit avec image, puis « Nos domaines d'intervention »).
   */
  situation: {
    eyebrow: string;
    title: string;
    /** Mots courts du bandeau et de la liste : « Famille 01 », « Nos domaines… », « 05 études ». */
    labels: { family: string; domains: string; studies: string };
    families: StudyFamily[];
  };
};

/** Une étude écrite « intitulé : description », comme dans le cahier des charges. */
const study = (line: string): Study => {
  const at = line.indexOf(' : ');
  return { label: line.slice(0, at), text: fr(line.slice(at + 3)) };
};

const FR: EtudesContent = {
  title: 'Études stratégiques',
  opening: {
    eyebrow: 'Études stratégiques',
    title: 'Des études pour fonder les décisions qui comptent.',
    text: fr(
      'Un engagement d’envergure se prend une fois et se vit longtemps. Avant de trancher, vous devez savoir, comprendre et anticiper, non pas supposer. Sources vérifiées, terrain parcouru, calculs ouverts à la relecture : chacune de nos études vous offre cette assise.',
    ),
    alt: 'Un nuage de points dispersés se resserre jusqu’à un seul point',
  },
  situation: {
    eyebrow: 'Votre situation',
    title: fr('Quel enjeu souhaitez-vous éclairer ?'),
    labels: { family: 'Famille', domains: 'Nos domaines d’intervention', studies: 'études' },
    families: [
      {
        number: '01',
        title: 'Investir et développer',
        lead: 'Nous éprouvons la solidité de vos projets avant que vous n’y engagiez vos ressources, pour éclairer vos décisions d’investissement et mieux apprécier leurs perspectives de développement.',
        studies: [
          'Étude de marché : Analyse de la demande, des attentes des clients et de la concurrence ; évaluation du potentiel commercial du projet.',
          'Étude technico-commerciale : Analyse des conditions techniques, logistiques et commerciales nécessaires à la mise sur le marché de vos produits et services.',
          'Étude de localisation et d’implantation : Analyse comparative des sites selon leurs avantages, contraintes et coûts, en vue du choix d’implantation.',
          'Étude de faisabilité technico-économique : Analyse de la viabilité technique et économique, estimation des investissements, évaluation des risques et de la rentabilité prévisionnelle.',
          'Plan d’affaires (business plan) : Structuration du modèle économique, élaboration des prévisions financières et constitution d’un dossier destiné aux acteurs du financement.',
        ].map(study),
      },
      {
        number: '02',
        title: 'S’allier et se positionner',
        lead: 'Nous analysons votre environnement sectoriel et concurrentiel pour éclairer vos choix de positionnement, de partenariat et de croissance.',
        studies: [
          'Analyse sectorielle et de filière : Analyse des facteurs macroéconomiques, des chaînes de valeur, des rapports de force et des perspectives de développement du secteur ou de la filière.',
          'Veille concurrentielle et benchmarking : Suivi des stratégies concurrentes, comparaison des pratiques et performances, détection des signaux faibles et analyse des évolutions du marché.',
          'Diagnostic de positionnement stratégique : Analyse de la position concurrentielle de l’entreprise, évaluation de ses avantages distinctifs et identification des leviers de différenciation et de renforcement.',
          'Étude préalable de partenariat ou de coentreprise : Analyse de la fiabilité du partenaire pressenti, évaluation de la complémentarité des apports et identification des risques du partenariat.',
          'Évaluation d’entreprise : Analyse économique et financière, estimation argumentée de la valeur de l’entreprise et appui aux opérations de fusion, d’acquisition, de cession ou de prise de participation.',
          'Étude d’opportunité et analyse de scénarios : Analyse comparative des options stratégiques, évaluation de leurs avantages, contraintes et risques, et hiérarchisation des scénarios selon leur pertinence au regard de vos objectifs.',
        ].map(study),
      },
      {
        // Aucune référence d'agrément pour l'instant : OPEM les donnera (numéro et date).
        number: '03',
        title: 'Évaluer et préserver',
        lead: 'Nous évaluons les impacts, les risques et les obligations environnementales de vos projets et activités, afin de sécuriser vos autorisations et d’orienter vos décisions d’amélioration, dans le respect des exigences réglementaires nationales.',
        studies: [
          'Études réglementaires et autorisations environnementales : Identification des exigences réglementaires applicables, constitution des dossiers d’autorisation et d’agrément, et accompagnement des démarches auprès des administrations compétentes.',
          'Étude et notice d’impact sur l’environnement : Analyse des effets du projet sur les milieux naturels et humains, définition des mesures d’évitement, de réduction et, le cas échéant, de compensation, avec préparation des dossiers requis.',
          'Étude de dangers : Identification des scénarios d’accident majeur, évaluation de leur probabilité et de leurs conséquences, et définition des mesures de maîtrise des risques, en cohérence avec la réglementation applicable.',
          'Diagnostic et feuille de route d’économie circulaire : Diagnostic des pratiques et des leviers d’économie circulaire sur l’ensemble du cycle de vie, identification des synergies et des possibilités d’optimisation des ressources, et élaboration d’une feuille de route opérationnelle adaptée à vos objectifs.',
          'Audit de conformité environnementale : Évaluation de la conformité de vos pratiques aux exigences réglementaires, identification des écarts et recommandations d’actions correctives.',
          'Étude d’impact socio-économique : Analyse des effets directs et indirects d’un projet sur l’emploi, les revenus, les activités locales et les conditions de vie, avec identification des mesures d’atténuation et de valorisation.',
        ].map(study),
      },
      {
        number: '04',
        title: 'Observer, évaluer et anticiper',
        lead: 'Nous produisons des connaissances fiables et comparables, évaluons vos actions et anticipons les évolutions de votre environnement, afin d’éclairer vos décisions et d’améliorer votre pilotage.',
        studies: [
          'Enquêtes de terrain et sondages : Conception de protocoles d’enquête adaptés, échantillonnage, collecte de données et contrôle de leur qualité, pour produire des résultats fiables et exploitables.',
          'Analyses statistiques des données : Traitements statistiques descriptifs et explicatifs, construction d’indicateurs et modélisation lorsque pertinent, afin d’éclairer des décisions opérationnelles ou stratégiques.',
          'Études de satisfaction et d’image : Mesure des perceptions, des attentes et des niveaux de satisfaction des parties prenantes, analyse des facteurs qui les influencent, et recommandations d’amélioration.',
          'Études des besoins en compétences et ingénierie de formation : Diagnostic des compétences disponibles et requises, analyse des écarts et conception de parcours de formation structurés en cycles progressifs, avec des objectifs pédagogiques alignés sur les besoins identifiés.',
          'Évaluation de projets, de programmes et de politiques publiques : Évaluations ex ante, à mi-parcours, finales et ex post, fondées sur l’analyse de la pertinence, de la cohérence, de l’efficacité, de l’efficience, de l’impact et de la durabilité des interventions.',
          'Études prospectives et analyse des futurs possibles : Identification de tendances et de ruptures, élaboration de scénarios plausibles et analyse de leurs implications, pour éclairer des choix stratégiques à moyen et long terme.',
          'Systèmes d’information économique : Conception de l’architecture de l’information, définition des sources et des indicateurs, développement, déploiement opérationnel et maintenance des solutions de collecte, d’analyse et de pilotage économique.',
        ].map(study),
      },
    ],
  },
};

const AR: EtudesContent = {
  title: 'الدراسات الاستراتيجية',
  opening: {
    eyebrow: 'الدراسات الاستراتيجية',
    title: 'دراسات تؤسس للقرارات المهمة.',
    text: 'التزام بهذا الحجم يُتخذ مرة ويُعاش طويلًا. قبل الحسم، عليكم أن تعرفوا وتفهموا وتستبقوا، لا أن تفترضوا. مصادر موثّقة، ميدان مستكشَف، حسابات مفتوحة للمراجعة: كل دراسة من دراساتنا تمنحكم هذا الأساس.',
    alt: 'سحابة من النقاط المتفرقة تتقارب حتى نقطة واحدة',
  },
  situation: {
    eyebrow: 'وضعيتكم',
    title: 'أيّ رهان تودّون استجلاءه؟',
    labels: { family: 'المجموعة', domains: 'مجالات تدخّلنا', studies: 'دراسات' },
    families: [
      {
        number: '01',
        title: 'الاستثمار والتطوير',
        lead: 'نختبر متانة مشاريعكم قبل أن تُلزموا بها مواردكم، لننير قراراتكم الاستثمارية ونقدّر آفاق تطويرها تقديرًا أدق.',
        studies: [
          {
            label: 'دراسة السوق',
            text: 'تحليل الطلب وتوقعات الزبائن والمنافسة؛ وتقييم الإمكانات التجارية للمشروع.',
          },
          {
            label: 'الدراسة التقنية التجارية',
            text: 'تحليل الشروط التقنية واللوجستية والتجارية اللازمة لطرح منتجاتكم وخدماتكم في السوق.',
          },
          {
            label: 'دراسة الموقع والتوطين',
            text: 'تحليل مقارن للمواقع حسب مزاياها وقيودها وتكاليفها، بغية اختيار موقع التوطين.',
          },
          {
            label: 'دراسة الجدوى التقنية الاقتصادية',
            text: 'تحليل الجدوى التقنية والاقتصادية، وتقدير الاستثمارات، وتقييم المخاطر والمردودية التقديرية.',
          },
          {
            label: 'مخطط الأعمال',
            text: 'هيكلة النموذج الاقتصادي، وإعداد التوقعات المالية، وتكوين ملف موجّه إلى جهات التمويل.',
          },
        ],
      },
      {
        number: '02',
        title: 'التحالف والتموقع',
        lead: 'نحلّل محيطكم القطاعي والتنافسي لننير خياراتكم في التموقع والشراكة والنمو.',
        studies: [
          {
            label: 'التحليل القطاعي وتحليل الشُّعب',
            text: 'تحليل العوامل الاقتصادية الكلية وسلاسل القيمة وموازين القوى وآفاق تطور القطاع أو الشعبة.',
          },
          {
            label: 'اليقظة التنافسية والمقارنة المرجعية',
            text: 'تتبّع استراتيجيات المنافسين، ومقارنة الممارسات والأداء، ورصد الإشارات الضعيفة، وتحليل تطورات السوق.',
          },
          {
            label: 'تشخيص التموقع الاستراتيجي',
            text: 'تحليل الموقع التنافسي للمؤسسة، وتقييم مزاياها المميِّزة، وتحديد روافع التمايز والتعزيز.',
          },
          {
            label: 'الدراسة المسبقة للشراكة أو المشروع المشترك',
            text: 'تحليل موثوقية الشريك المرتقب، وتقييم تكامل المساهمات، وتحديد مخاطر الشراكة.',
          },
          {
            label: 'تقييم المؤسسة',
            text: 'تحليل اقتصادي ومالي، وتقدير معلَّل لقيمة المؤسسة، ودعم عمليات الاندماج أو الاستحواذ أو التنازل أو المساهمة في رأس المال.',
          },
          {
            label: 'دراسة الفرص وتحليل السيناريوهات',
            text: 'تحليل مقارن للخيارات الاستراتيجية، وتقييم مزاياها وقيودها ومخاطرها، وترتيب السيناريوهات حسب ملاءمتها لأهدافكم.',
          },
        ],
      },
      {
        number: '03',
        title: 'التقييم والحفاظ',
        lead: 'نقيّم الآثار والمخاطر والالتزامات البيئية لمشاريعكم وأنشطتكم، لتأمين تراخيصكم وتوجيه قرارات التحسين، في احترام للمتطلبات التنظيمية الوطنية.',
        studies: [
          {
            label: 'الدراسات التنظيمية والتراخيص البيئية',
            text: 'تحديد المتطلبات التنظيمية المطبّقة، وتكوين ملفات الترخيص والاعتماد، ومرافقة الإجراءات لدى الإدارات المختصة.',
          },
          {
            label: 'دراسة وموجز التأثير على البيئة',
            text: 'تحليل آثار المشروع على الأوساط الطبيعية والبشرية، وتحديد تدابير التجنّب والتخفيف، والتعويض عند الاقتضاء، مع إعداد الملفات المطلوبة.',
          },
          {
            label: 'دراسة الأخطار',
            text: 'تحديد سيناريوهات الحوادث الكبرى، وتقييم احتمالها وعواقبها، وتحديد تدابير التحكم في المخاطر، بما ينسجم مع التنظيم المعمول به.',
          },
          {
            label: 'تشخيص الاقتصاد الدائري وخارطة طريقه',
            text: 'تشخيص الممارسات وروافع الاقتصاد الدائري على امتداد دورة الحياة، وتحديد أوجه التآزر وإمكانات ترشيد الموارد، وإعداد خارطة طريق عملية تلائم أهدافكم.',
          },
          {
            label: 'تدقيق المطابقة البيئية',
            text: 'تقييم مطابقة ممارساتكم للمتطلبات التنظيمية، وتحديد الفوارق، وتقديم توصيات بإجراءات تصحيحية.',
          },
          {
            label: 'دراسة الأثر الاجتماعي والاقتصادي',
            text: 'تحليل الآثار المباشرة وغير المباشرة لمشروع ما على التشغيل والمداخيل والأنشطة المحلية وظروف المعيشة، مع تحديد تدابير التخفيف والتثمين.',
          },
        ],
      },
      {
        number: '04',
        title: 'الرصد والتقييم والاستشراف',
        lead: 'ننتج معارف موثوقة وقابلة للمقارنة، ونقيّم أعمالكم، ونستشرف تطورات محيطكم، لننير قراراتكم ونحسّن قيادتكم.',
        studies: [
          {
            label: 'التحقيقات الميدانية وسبر الآراء',
            text: 'تصميم بروتوكولات تحقيق ملائمة، والمعاينة، وجمع البيانات ومراقبة جودتها، لإنتاج نتائج موثوقة وقابلة للاستغلال.',
          },
          {
            label: 'التحليلات الإحصائية للبيانات',
            text: 'معالجات إحصائية وصفية وتفسيرية، وبناء مؤشرات، والنمذجة عند الاقتضاء، لإنارة القرارات العملياتية أو الاستراتيجية.',
          },
          {
            label: 'دراسات الرضا والصورة',
            text: 'قياس تصورات الأطراف المعنية وتوقعاتها ومستويات رضاها، وتحليل العوامل المؤثرة فيها، وتقديم توصيات للتحسين.',
          },
          {
            label: 'دراسات الاحتياجات من الكفاءات وهندسة التكوين',
            text: 'تشخيص الكفاءات المتاحة والمطلوبة، وتحليل الفوارق، وتصميم مسارات تكوينية منظَّمة في دورات متدرّجة، بأهداف بيداغوجية منسجمة مع الاحتياجات المحدَّدة.',
          },
          {
            label: 'تقييم المشاريع والبرامج والسياسات العمومية',
            text: 'تقييمات قبلية ومرحلية ونهائية وبعدية، قائمة على تحليل الملاءمة والانسجام والفعالية والنجاعة والأثر والاستدامة.',
          },
          {
            label: 'الدراسات الاستشرافية وتحليل المستقبلات الممكنة',
            text: 'تحديد الاتجاهات والقطائع، وإعداد سيناريوهات معقولة وتحليل انعكاساتها، لإنارة الخيارات الاستراتيجية على المديين المتوسط والبعيد.',
          },
          {
            label: 'أنظمة المعلومات الاقتصادية',
            text: 'تصميم بنية المعلومات، وتحديد المصادر والمؤشرات، وتطوير حلول الجمع والتحليل والقيادة الاقتصادية ونشرها عمليًا وصيانتها.',
          },
        ],
      },
    ],
  },
};

export const etudesContent: Record<Lang, EtudesContent> = { fr: FR, ar: AR };
