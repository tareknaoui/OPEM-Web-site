import type { Lang } from '@/i18n/language';

/*
 * Textes des deux formulaires. Le français est repris mot pour mot du cahier des charges
 * (titres, introductions, libellés, choix, aides, consentements, mentions, boutons, messages
 * de confirmation, messages d'erreur des fichiers) ; les autres messages d'erreur et les
 * textes d'interface sont à valider. L'arabe est à faire relire par OPEM.
 * Les valeurs (clés) des choix ne changent pas d'une langue à l'autre : le serveur les reçoit
 * et écrit le message à OPEM en français.
 */

const nb = ' ';

type Choice = { value: string; label: string };

export type FormsContent = {
  common: {
    eyebrow: string;
    placeholder: string;
    countryLabel: string;
    clear: string;
    sending: string;
    counter: (count: number, max: number) => string;
    errors: {
      required: string;
      choose: string;
      checkOne: string;
      email: string;
      phone: string;
      other: string;
      slotHour: string;
      slotDay: string;
    };
    legal: string;
  };
  appointment: {
    title: string;
    intro: string;
    name: string;
    organisation: string;
    organisationHelp: string;
    email: string;
    phone: string;
    subject: string;
    subjects: Choice[];
    subjectOther: string;
    project: string;
    projects: Choice[];
    message: string;
    messageHelp: string;
    slots: string;
    option: (n: number) => string;
    day: string;
    hour: string;
    days: Choice[];
    hours: Choice[];
    consentTitle: string;
    consent: string;
    consentError: string;
    newsletterTitle: string;
    newsletter: string;
    aside: [string, string, string];
    submit: string;
    thanksSlot: string;
    thanksNoSlot: string;
    failure: { unavailable: string; rate: string; tooLarge: string };
  };
  join: {
    title: string;
    intro: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    roles: Choice[];
    domains: string;
    otherDomain: string;
    otherDomainField: string;
    specialities: string;
    specialitiesEmpty: string;
    otherSpeciality: string;
    otherSpecialityField: (domain: string) => string;
    cv: string;
    cvHelp: string;
    documents: string;
    documentsHelp: string;
    chooseFile: string;
    addFiles: string;
    replaceFile: string;
    removeFile: (name: string) => string;
    noFile: string;
    fileErrors: {
      cvFormat: string;
      format: string;
      size: string;
      cvRequired: string;
      tooMany: string;
    };
    consentTitle: string;
    consent: string;
    consentError: string;
    presentationTitle: string;
    presentation: string;
    submit: string;
    thanks: string;
    failure: { unavailable: string; rate: string; tooLarge: string };
  };
};

const fr: FormsContent = {
  common: {
    eyebrow: 'Contact',
    placeholder: 'Choisir…',
    countryLabel: 'Indicatif du pays',
    clear: 'Effacer la réponse',
    sending: 'Envoi en cours…',
    counter: (count, max) =>
      `${count.toLocaleString('fr-FR')} / ${max.toLocaleString('fr-FR')} caractères`,
    errors: {
      required: 'Ce champ est obligatoire.',
      choose: 'Choisissez une réponse.',
      checkOne: 'Cochez au moins une case.',
      email: `Saisissez une adresse de courriel valide, par exemple nom@domaine.dz.`,
      phone: 'Saisissez un numéro de téléphone valide.',
      other: 'Précisez votre réponse.',
      slotHour: 'Choisissez aussi une heure.',
      slotDay: 'Choisissez aussi un jour.',
    },
    legal: `Conformément à la loi n°${nb}18-07 du 10${nb}juin 2018 relative à la protection des personnes physiques dans le traitement des données à caractère personnel, modifiée et complétée, vous pouvez accéder à vos données, les rectifier ou vous opposer à leur traitement en écrivant à contact@opem-dz.com. Déléguée à la protection des données étant Mme Houda BOURAHLA.`,
  },
  appointment: {
    title: 'Parlons de votre projet',
    intro:
      'Quelques lignes suffisent pour engager l’échange. Les champs marqués d’un astérisque sont obligatoires.',
    name: 'Nom et prénom',
    organisation: 'Organisation',
    organisationHelp: 'Laissez vide si vous portez un projet à titre personnel.',
    email: 'Courriel',
    phone: 'Téléphone',
    subject: 'Objet de votre demande',
    subjects: [
      { value: 'etudes', label: 'Études stratégiques' },
      { value: 'accompagnement', label: 'Accompagnement des organisations' },
      { value: 'formation', label: 'Formation qualifiante' },
      { value: 'coaching', label: 'Coaching professionnel' },
      { value: 'certification', label: 'Certification et accréditation' },
      { value: 'communication', label: 'Communication institutionnelle' },
      { value: 'ia', label: 'IA appliquée' },
      { value: 'autre', label: 'Autre demande (à préciser)' },
    ],
    subjectOther: 'Précisez votre demande',
    project: 'Votre projet concerne',
    projects: [
      { value: 'creation', label: 'La création d’une entreprise' },
      { value: 'developpement', label: 'Le développement d’une entreprise' },
    ],
    message: 'Votre message',
    messageHelp: 'Votre enjeu, en quelques lignes',
    slots: 'Vos disponibilités pour un entretien téléphonique',
    option: (n) => `Option ${n}`,
    day: 'Jour',
    hour: 'Heure',
    days: [
      { value: 'dimanche', label: 'Dimanche' },
      { value: 'lundi', label: 'Lundi' },
      { value: 'mardi', label: 'Mardi' },
      { value: 'mercredi', label: 'Mercredi' },
      { value: 'jeudi', label: 'Jeudi' },
    ],
    hours: ['9', '10', '11', '14', '15', '16'].map((h) => ({ value: h, label: `${h}${nb}h` })),
    consentTitle: 'Consentement',
    consent:
      'J’accepte que les informations saisies soient utilisées par OPEM pour répondre à ma demande et, le cas échéant, me recontacter à ce sujet. Elles ne sont transmises à aucun tiers et sont conservées trois ans après notre dernier contact.',
    consentError: 'Cochez cette case pour envoyer votre demande.',
    newsletterTitle: 'Rester informé',
    newsletter:
      'Je souhaite recevoir les éclairages d’OPEM et l’annonce de ses nouvelles formations et offres.',
    aside: ['Vous pouvez aussi nous écrire à ', 'contact@opem-dz.com', '.'],
    submit: 'Envoyer ma demande',
    thanksSlot:
      'Merci, votre demande nous est bien parvenue. Nous vous contactons pour confirmer l’un des créneaux proposés.',
    thanksNoSlot:
      'Merci, votre demande nous est bien parvenue. Nous vous contactons pour convenir d’un premier échange.',
    failure: {
      unavailable: `L’envoi n’a pas abouti. Réessayez dans un instant, ou écrivez-nous à contact@opem-dz.com.`,
      rate: `Trop d’envois en peu de temps. Réessayez dans une heure, ou écrivez-nous à contact@opem-dz.com.`,
      tooLarge: `L’envoi est trop lourd. Raccourcissez votre message, ou écrivez-nous à contact@opem-dz.com.`,
    },
  },
  join: {
    title: 'Rejoindre notre réseau d’experts',
    intro: `Consultant, formateur, ou les deux${nb}: présentez-nous votre parcours. Chaque candidature est étudiée avec attention.`,
    name: 'Nom et prénom',
    email: 'Courriel',
    phone: 'Téléphone',
    role: 'Vous intervenez comme',
    roles: [
      { value: 'consultant', label: 'Consultant' },
      { value: 'formateur', label: 'Formateur' },
      { value: 'consultant-formateur', label: 'Consultant et formateur' },
    ],
    domains: 'Domaines d’expertise',
    otherDomain: 'Autre domaine',
    otherDomainField: 'Précisez le domaine',
    specialities: 'Vos spécialités',
    specialitiesEmpty: `Cochez d’abord vos domaines d’expertise${nb}: leurs spécialités s’afficheront ici.`,
    otherSpeciality: 'Autre à préciser',
    otherSpecialityField: (domain) => `Précisez votre spécialité (${domain})`,
    cv: 'Curriculum vitæ',
    cvHelp: 'PDF ou Word, 5 Mo au plus',
    documents: 'Autres documents',
    documentsHelp: `Diplômes, attestations, catalogue de formation… PDF, Word, Excel, JPG ou PNG${nb}; 10${nb}Mo au plus par fichier, cinq fichiers au plus`,
    chooseFile: 'Choisir un fichier',
    addFiles: 'Ajouter des fichiers',
    replaceFile: 'Remplacer le fichier',
    removeFile: (name) => `Retirer ${name}`,
    noFile: 'Aucun fichier choisi',
    fileErrors: {
      cvFormat: 'Ce format n’est pas accepté. Envoyez un fichier PDF ou Word.',
      format:
        'Ce format n’est pas accepté. Envoyez un fichier PDF, Word, Excel, JPG ou PNG. Pour une photo prise sur iPhone, enregistrez-la d’abord en JPG.',
      size: 'Ce fichier dépasse la taille autorisée.',
      cvRequired: 'Joignez votre CV.',
      tooMany: 'Cinq fichiers au plus.',
    },
    consentTitle: 'Consentement',
    consent:
      'J’accepte que les informations et le CV transmis soient utilisés par OPEM pour étudier ma candidature et me proposer des missions correspondant à mon profil. Ils ne sont communiqués qu’aux clients concernés par une proposition de mission et sont conservés cinq ans après notre dernier contact.',
    consentError: 'Cochez cette case pour envoyer votre candidature.',
    presentationTitle: 'Présentation aux clients',
    presentation:
      'J’accepte qu’OPEM présente mon profil et mon CV à ses clients dans le cadre d’une proposition de mission.',
    submit: 'Envoyer ma candidature',
    thanks:
      'Merci, votre candidature est bien enregistrée. Nous reviendrons vers vous dès qu’une mission correspondra à votre profil.',
    failure: {
      unavailable: `L’envoi n’a pas abouti. Réessayez dans un instant, ou écrivez-nous à expert@opem-dz.com.`,
      rate: `Trop d’envois en peu de temps. Réessayez dans une heure, ou écrivez-nous à expert@opem-dz.com.`,
      tooLarge: `Vos fichiers sont trop lourds pour être envoyés ensemble. Retirez-en un, ou écrivez-nous à expert@opem-dz.com.`,
    },
  },
};

const ar: FormsContent = {
  common: {
    eyebrow: 'اتصل بنا',
    placeholder: 'اختر…',
    countryLabel: 'رمز الدولة',
    clear: 'مسح الإجابة',
    sending: 'جارٍ الإرسال…',
    counter: (count, max) => `${count} / ${max} حرف`,
    errors: {
      required: 'هذا الحقل إلزامي.',
      choose: 'اختر إجابة.',
      checkOne: 'حدّد خانة واحدة على الأقل.',
      email: 'أدخل عنوان بريد إلكتروني صحيحًا، مثل nom@domaine.dz.',
      phone: 'أدخل رقم هاتف صحيحًا.',
      other: 'وضّح إجابتك.',
      slotHour: 'اختر الساعة أيضًا.',
      slotDay: 'اختر اليوم أيضًا.',
    },
    legal:
      'طبقًا للقانون رقم 18-07 المؤرخ في 10 يونيو 2018 المتعلق بحماية الأشخاص الطبيعيين في مجال معالجة المعطيات ذات الطابع الشخصي، المعدّل والمتمّم، يمكنكم الاطلاع على معطياتكم أو تصحيحها أو الاعتراض على معالجتها بمراسلتنا على contact@opem-dz.com. مندوبة حماية المعطيات: السيدة هدى بورحلة.',
  },
  appointment: {
    title: 'لنتحدث عن مشروعكم',
    intro: 'تكفي بضعة أسطر لبدء الحوار. الحقول المميّزة بنجمة إلزامية.',
    name: 'الاسم واللقب',
    organisation: 'المؤسسة',
    organisationHelp: 'اتركوا الحقل فارغًا إذا كنتم تحملون مشروعًا بصفة شخصية.',
    email: 'البريد الإلكتروني',
    phone: 'الهاتف',
    subject: 'موضوع طلبكم',
    subjects: [
      { value: 'etudes', label: 'الدراسات الاستراتيجية' },
      { value: 'accompagnement', label: 'مرافقة المؤسسات' },
      { value: 'formation', label: 'التكوين التأهيلي' },
      { value: 'coaching', label: 'الكوتشينغ المهني' },
      { value: 'certification', label: 'الإشهاد والاعتماد' },
      { value: 'communication', label: 'الاتصال المؤسساتي' },
      { value: 'ia', label: 'الذكاء الاصطناعي التطبيقي' },
      { value: 'autre', label: 'طلب آخر (يُرجى التوضيح)' },
    ],
    subjectOther: 'وضّحوا طلبكم',
    project: 'يتعلق مشروعكم بـ',
    projects: [
      { value: 'creation', label: 'إنشاء مؤسسة' },
      { value: 'developpement', label: 'تطوير مؤسسة' },
    ],
    message: 'رسالتكم',
    messageHelp: 'رهانكم، في بضعة أسطر',
    slots: 'أوقات تفرّغكم لمكالمة هاتفية',
    option: (n) => `الخيار ${n}`,
    day: 'اليوم',
    hour: 'الساعة',
    days: [
      { value: 'dimanche', label: 'الأحد' },
      { value: 'lundi', label: 'الاثنين' },
      { value: 'mardi', label: 'الثلاثاء' },
      { value: 'mercredi', label: 'الأربعاء' },
      { value: 'jeudi', label: 'الخميس' },
    ],
    hours: ['9', '10', '11', '14', '15', '16'].map((h) => ({ value: h, label: `${h}:00` })),
    consentTitle: 'الموافقة',
    consent:
      'أوافق على أن تستعمل OPEM المعلومات المُدخلة للرد على طلبي، وعند الاقتضاء إعادة الاتصال بي بشأنه. لا تُنقل هذه المعلومات إلى أي طرف ثالث، وتُحفظ ثلاث سنوات بعد آخر تواصل بيننا.',
    consentError: 'حدّدوا هذه الخانة لإرسال طلبكم.',
    newsletterTitle: 'البقاء على اطلاع',
    newsletter: 'أرغب في تلقّي إضاءات OPEM والإعلان عن تكويناتها وعروضها الجديدة.',
    aside: ['يمكنكم أيضًا مراسلتنا على ', 'contact@opem-dz.com', '.'],
    submit: 'أرسل طلبي',
    thanksSlot: 'شكرًا، لقد وصلنا طلبكم. سنتصل بكم لتأكيد أحد المواعيد المقترحة.',
    thanksNoSlot: 'شكرًا، لقد وصلنا طلبكم. سنتصل بكم للاتفاق على أول لقاء.',
    failure: {
      unavailable: 'لم يتم الإرسال. أعيدوا المحاولة بعد لحظات، أو راسلونا على contact@opem-dz.com.',
      rate: 'عدد كبير من الإرسالات في وقت قصير. أعيدوا المحاولة بعد ساعة، أو راسلونا على contact@opem-dz.com.',
      tooLarge: 'الإرسال ثقيل جدًا. اختصروا رسالتكم، أو راسلونا على contact@opem-dz.com.',
    },
  },
  join: {
    title: 'انضموا إلى شبكة خبرائنا',
    intro: 'مستشار أو مكوّن أو كلاهما: عرّفونا بمساركم. ندرس كل ترشح بعناية.',
    name: 'الاسم واللقب',
    email: 'البريد الإلكتروني',
    phone: 'الهاتف',
    role: 'تتدخلون بصفة',
    roles: [
      { value: 'consultant', label: 'مستشار' },
      { value: 'formateur', label: 'مكوّن' },
      { value: 'consultant-formateur', label: 'مستشار ومكوّن' },
    ],
    domains: 'مجالات الخبرة',
    otherDomain: 'مجال آخر',
    otherDomainField: 'وضّحوا المجال',
    specialities: 'تخصصاتكم',
    specialitiesEmpty: 'حدّدوا أولًا مجالات خبرتكم: ستظهر تخصصاتها هنا.',
    otherSpeciality: 'تخصص آخر يُرجى توضيحه',
    otherSpecialityField: (domain) => `وضّحوا تخصصكم (${domain})`,
    cv: 'السيرة الذاتية',
    cvHelp: 'PDF أو Word، 5 ميغابايت على الأكثر',
    documents: 'وثائق أخرى',
    documentsHelp:
      'شهادات، إفادات، دليل التكوينات… PDF أو Word أو Excel أو JPG أو PNG؛ 10 ميغابايت على الأكثر لكل ملف، وخمسة ملفات على الأكثر',
    chooseFile: 'اختر ملفًا',
    addFiles: 'أضف ملفات',
    replaceFile: 'استبدل الملف',
    removeFile: (name) => `احذف ${name}`,
    noFile: 'لم يتم اختيار أي ملف',
    fileErrors: {
      cvFormat: 'هذه الصيغة غير مقبولة. أرسلوا ملف PDF أو Word.',
      format:
        'هذه الصيغة غير مقبولة. أرسلوا ملف PDF أو Word أو Excel أو JPG أو PNG. للصور الملتقطة بهاتف iPhone، احفظوها أولًا بصيغة JPG.',
      size: 'هذا الملف يتجاوز الحجم المسموح به.',
      cvRequired: 'أرفقوا سيرتكم الذاتية.',
      tooMany: 'خمسة ملفات على الأكثر.',
    },
    consentTitle: 'الموافقة',
    consent:
      'أوافق على أن تستعمل OPEM المعلومات والسيرة الذاتية المرسلة لدراسة ترشحي واقتراح مهام تناسب ملفي. لا تُبلَّغ إلا للزبائن المعنيين باقتراح مهمة، وتُحفظ خمس سنوات بعد آخر تواصل بيننا.',
    consentError: 'حدّدوا هذه الخانة لإرسال ترشحكم.',
    presentationTitle: 'التقديم للزبائن',
    presentation: 'أوافق على أن تقدّم OPEM ملفي وسيرتي الذاتية لزبائنها في إطار اقتراح مهمة.',
    submit: 'أرسل ترشحي',
    thanks: 'شكرًا، لقد سُجّل ترشحكم. سنعود إليكم حالما تتوفر مهمة تناسب ملفكم.',
    failure: {
      unavailable: 'لم يتم الإرسال. أعيدوا المحاولة بعد لحظات، أو راسلونا على expert@opem-dz.com.',
      rate: 'عدد كبير من الإرسالات في وقت قصير. أعيدوا المحاولة بعد ساعة، أو راسلونا على expert@opem-dz.com.',
      tooLarge:
        'ملفاتكم ثقيلة جدًا لإرسالها معًا. احذفوا أحدها، أو راسلونا على expert@opem-dz.com.',
    },
  },
};

export const formsContent: Record<Lang, FormsContent> = { fr, ar };
