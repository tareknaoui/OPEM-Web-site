import { company, legalIdentity } from '@/config/company';
import type { Lang } from '@/i18n/language';

/* ==========================================================================
   Textes des pages légales : mentions légales, politique de confidentialité, plan du site.

   Règle : rien n'est inventé. Les engagements sur les données reprennent mot pour mot ce que
   disent déjà les formulaires (durées, destinataires, adresse de contact) et ce que fait
   réellement le site (wordpress/opem-forms-api.php, deploy/). L'identité légale manquante
   (forme juridique, RC, NIF, NIS, capital, hébergeur) se renseigne dans
   src/config/company.ts (`legalIdentity`) ; tant qu'elle vaut `null`, la page affiche
   « à compléter ».

   Si un formulaire change (champ, durée, destinataire), mettre à jour la politique ici.
   Traduction arabe à faire relire, comme le reste du site.
   ========================================================================== */

/** Morceau de texte : texte simple, lien, ou valeur encore inconnue (« à compléter »). */
export type Segment = string | { link: string; label: string } | { pending: true };
export type Rich = string | Segment[];
export type Fact = { label: string; value: Rich };

export type Block =
  | { kind: 'p'; text: Rich }
  | { kind: 'list'; items: Rich[] }
  | { kind: 'facts'; rows: Fact[] }
  | { kind: 'cards'; cards: { title: string; rows: Fact[] }[] };

export type LegalSection = { id: string; title: string; blocks: Block[] };

export type LegalPageContent = {
  /** Titre de l'onglet (identique à PAGE_META dans vite.seo.ts). */
  title: string;
  eyebrow: string;
  heading: string;
  intro: string;
  updated: string;
  sections: LegalSection[];
};

type Shared = {
  /** Affiché à la place d'une valeur qu'OPEM doit encore fournir. */
  pending: string;
  /** Titre du sommaire des pages légales. */
  toc: string;
};

/** Date de la dernière mise à jour des textes : la changer à chaque modification. */
const UPDATED = { fr: 'Mise à jour le 11 novembre 2026', ar: 'آخر تحديث: 11 نوفمبر 2026' };

const NB = ' ';
const PENDING: Segment = { pending: true };
const value = (text: string | null): Rich => text ?? [PENDING];
const mail = (address: string): Segment => ({ link: `mailto:${address}`, label: address });
const host = legalIdentity.host;

export const legalShared: Record<Lang, Shared> = {
  fr: { pending: 'à compléter', toc: 'Sur cette page' },
  ar: { pending: 'قيد الاستكمال', toc: 'في هذه الصفحة' },
};

/* ---------- Mentions légales ---------- */

export const mentionsContent: Record<Lang, LegalPageContent> = {
  fr: {
    title: 'Mentions légales · OPEM',
    eyebrow: 'Informations légales',
    heading: 'Mentions légales',
    intro:
      'Qui édite ce site, qui l’héberge, et à quelles conditions vous pouvez en utiliser le contenu.',
    updated: UPDATED.fr,
    sections: [
      {
        id: 'editeur',
        title: 'Éditeur du site',
        blocks: [
          {
            kind: 'facts',
            rows: [
              { label: 'Raison sociale', value: `${company.shortName} - ${company.fullName}` },
              { label: 'Forme juridique', value: value(legalIdentity.legalForm) },
              { label: 'Capital social', value: value(legalIdentity.capital) },
              { label: 'Siège social', value: company.address.fr },
              { label: 'Registre du commerce', value: value(legalIdentity.rc) },
              { label: 'NIF', value: value(legalIdentity.nif) },
              { label: 'NIS', value: value(legalIdentity.nis) },
              {
                label: 'Téléphone',
                value: [{ link: company.phone.href, label: company.phone.display }],
              },
              { label: 'Courriel', value: [mail(company.email)] },
            ],
          },
          {
            kind: 'p',
            text: `Établissement privé de formation professionnelle agréé par le ministère de la Formation et de l’Enseignement professionnels, par décision n°${NB}${company.approval.number} du ${company.approval.date.fr}.`,
          },
        ],
      },
      {
        id: 'publication',
        title: 'Directrice de la publication',
        blocks: [{ kind: 'p', text: `${company.manager.fr}, gérante d’OPEM.` }],
      },
      {
        id: 'hebergement',
        title: 'Hébergement',
        blocks: [
          {
            kind: 'facts',
            rows: host
              ? [
                  { label: 'Hébergeur', value: host.name },
                  { label: 'Adresse', value: host.address },
                  { label: 'Site', value: [{ link: host.website, label: host.website }] },
                ]
              : [{ label: 'Hébergeur', value: [PENDING] }],
          },
          {
            kind: 'p',
            text: 'Le site et ses formulaires sont servis par un même serveur, uniquement en connexion chiffrée (HTTPS).',
          },
        ],
      },
      {
        id: 'propriete',
        title: 'Propriété intellectuelle',
        blocks: [
          {
            kind: 'p',
            text: `Les textes, le logo OPEM, la signature «${NB}Beyond Quality${NB}», les illustrations et la mise en page de ce site appartiennent à OPEM et sont protégés par l’ordonnance n°${NB}03-05 du 19${NB}juillet 2003 relative aux droits d’auteur et aux droits voisins. Toute reproduction ou réutilisation, même partielle, demande l’accord écrit d’OPEM.`,
          },
          {
            kind: 'p',
            text: 'Certaines photographies proviennent de banques d’images libres de droits (Pexels, Unsplash) et restent soumises à leurs licences. Les logos et marques des clients et partenaires cités appartiennent à leurs titulaires respectifs.',
          },
        ],
      },
      {
        id: 'responsabilite',
        title: 'Contenu et responsabilité',
        blocks: [
          {
            kind: 'p',
            text: 'OPEM veille à l’exactitude des informations publiées sur ce site. Elles restent indicatives et peuvent évoluer sans préavis.',
          },
          {
            kind: 'p',
            text: 'L’autodiagnostic propose une première lecture fondée sur vos seules réponses : il ne remplace ni un audit ni l’avis d’un consultant.',
          },
          {
            kind: 'p',
            text: 'Les liens vers d’autres sites, dont les cartes Google, sont donnés pour votre commodité : OPEM n’est pas responsable de leur contenu.',
          },
        ],
      },
      {
        id: 'donnees',
        title: 'Données personnelles',
        blocks: [
          {
            kind: 'p',
            text: [
              'Ce que nous recueillons par nos formulaires, pourquoi, combien de temps nous le gardons et comment exercer vos droits : tout est expliqué dans notre ',
              { link: '/confidentialite', label: 'politique de confidentialité' },
              '.',
            ],
          },
        ],
      },
      {
        id: 'droit',
        title: 'Droit applicable',
        blocks: [
          { kind: 'p', text: 'Ce site et les présentes mentions relèvent du droit algérien.' },
        ],
      },
    ],
  },
  ar: {
    title: 'الإشعارات القانونية · OPEM',
    eyebrow: 'معلومات قانونية',
    heading: 'الإشعارات القانونية',
    intro: 'من ينشر هذا الموقع، ومن يستضيفه، وبأي شروط يمكنكم استعمال محتواه.',
    updated: UPDATED.ar,
    sections: [
      {
        id: 'editeur',
        title: 'ناشر الموقع',
        blocks: [
          {
            kind: 'facts',
            rows: [
              { label: 'التسمية', value: `${company.shortName} - ${company.fullName}` },
              { label: 'الشكل القانوني', value: value(legalIdentity.legalForm) },
              { label: 'رأس المال الاجتماعي', value: value(legalIdentity.capital) },
              { label: 'المقر الاجتماعي', value: company.address.ar },
              { label: 'رقم السجل التجاري', value: value(legalIdentity.rc) },
              { label: 'رقم التعريف الجبائي', value: value(legalIdentity.nif) },
              { label: 'رقم التعريف الإحصائي', value: value(legalIdentity.nis) },
              {
                label: 'الهاتف',
                value: [{ link: company.phone.href, label: company.phone.display }],
              },
              { label: 'البريد الإلكتروني', value: [mail(company.email)] },
            ],
          },
          {
            kind: 'p',
            text: `مؤسسة خاصة للتكوين المهني معتمدة من وزارة التكوين والتعليم المهنيين، بموجب المقرر رقم ${company.approval.number} المؤرخ في ${company.approval.date.ar}.`,
          },
        ],
      },
      {
        id: 'publication',
        title: 'مديرة النشر',
        blocks: [{ kind: 'p', text: `${company.manager.ar}، مسيّرة OPEM.` }],
      },
      {
        id: 'hebergement',
        title: 'الاستضافة',
        blocks: [
          {
            kind: 'facts',
            rows: host
              ? [
                  { label: 'المستضيف', value: host.name },
                  { label: 'العنوان', value: host.address },
                  { label: 'الموقع', value: [{ link: host.website, label: host.website }] },
                ]
              : [{ label: 'المستضيف', value: [PENDING] }],
          },
          {
            kind: 'p',
            text: 'يُقدَّم الموقع واستماراته من خادم واحد، عبر اتصال مشفّر فقط (HTTPS).',
          },
        ],
      },
      {
        id: 'propriete',
        title: 'الملكية الفكرية',
        blocks: [
          {
            kind: 'p',
            text: 'النصوص وشعار OPEM وتوقيع «Beyond Quality» والرسومات وتصميم هذا الموقع ملك لـ OPEM، وهي محمية بموجب الأمر رقم 03-05 المؤرخ في 19 يوليو 2003 المتعلق بحقوق المؤلف والحقوق المجاورة. كل نسخ أو إعادة استعمال، ولو جزئيًا، يتطلب موافقة كتابية من OPEM.',
          },
          {
            kind: 'p',
            text: 'بعض الصور مأخوذة من بنوك صور حرة الحقوق (Pexels وUnsplash) وتبقى خاضعة لتراخيصها. أما شعارات وعلامات العملاء والشركاء المذكورين فهي ملك لأصحابها.',
          },
        ],
      },
      {
        id: 'responsabilite',
        title: 'المحتوى والمسؤولية',
        blocks: [
          {
            kind: 'p',
            text: 'تحرص OPEM على دقة المعلومات المنشورة في هذا الموقع، وهي تبقى إرشادية وقابلة للتغيير دون إشعار مسبق.',
          },
          {
            kind: 'p',
            text: 'يقدّم التشخيص الذاتي قراءة أولى مبنية على إجاباتكم وحدها، ولا يغني عن تدقيق ولا عن رأي مستشار.',
          },
          {
            kind: 'p',
            text: 'الروابط نحو مواقع أخرى، ومنها خرائط Google، مقدَّمة لتسهيل تصفحكم، وOPEM غير مسؤولة عن محتواها.',
          },
        ],
      },
      {
        id: 'donnees',
        title: 'المعطيات الشخصية',
        blocks: [
          {
            kind: 'p',
            text: [
              'ما نجمعه عبر استماراتنا، ولماذا، وكم من الوقت نحتفظ به، وكيف تمارسون حقوقكم: كل ذلك مشروح في ',
              { link: '/confidentialite', label: 'سياسة الخصوصية' },
              '.',
            ],
          },
        ],
      },
      {
        id: 'droit',
        title: 'القانون المطبَّق',
        blocks: [{ kind: 'p', text: 'يخضع هذا الموقع وهذه الإشعارات للقانون الجزائري.' }],
      },
    ],
  },
};

/* ---------- Politique de confidentialité ---------- */

const GOOGLE_PRIVACY = 'https://policies.google.com/privacy';

export const privacyContent: Record<Lang, LegalPageContent> = {
  fr: {
    title: 'Politique de confidentialité · OPEM',
    eyebrow: 'Informations légales',
    heading: 'Politique de confidentialité',
    intro:
      'OPEM ne demande que ce dont elle a besoin pour vous répondre, ne vend aucune donnée et n’utilise aucun outil publicitaire. Voici, formulaire par formulaire, ce qui est recueilli, pourquoi et pour combien de temps.',
    updated: UPDATED.fr,
    sections: [
      {
        id: 'responsable',
        title: 'Qui est responsable de vos données',
        blocks: [
          {
            kind: 'facts',
            rows: [
              {
                label: 'Responsable du traitement',
                value: `${company.shortName} - ${company.fullName}, ${company.address.fr}`,
              },
              { label: 'Déléguée à la protection des données', value: company.manager.fr },
              { label: 'Pour la joindre', value: [mail(company.privacyEmail)] },
            ],
          },
          {
            kind: 'p',
            text: `Vos données sont traitées conformément à la loi n°${NB}18-07 du 10${NB}juin 2018 relative à la protection des personnes physiques dans le traitement des données à caractère personnel, modifiée et complétée.`,
          },
        ],
      },
      {
        id: 'formulaires',
        title: 'Ce que nous recueillons, et pourquoi',
        blocks: [
          {
            kind: 'p',
            text: 'Rien n’est recueilli tant que vous n’envoyez pas un formulaire. Pendant l’autodiagnostic, vos réponses restent dans votre navigateur : elles ne nous parviennent que si vous demandez votre rapport.',
          },
          {
            kind: 'cards',
            cards: [
              {
                title: 'Demande de rendez-vous',
                rows: [
                  {
                    label: 'Données',
                    value:
                      'Nom, organisation, courriel, téléphone, objet et nature du projet, message, créneaux souhaités.',
                  },
                  {
                    label: 'Pourquoi',
                    value: 'Répondre à votre demande et vous recontacter à ce sujet.',
                  },
                  { label: 'Qui les reçoit', value: 'L’équipe d’OPEM, et personne d’autre.' },
                  { label: 'Combien de temps', value: 'Trois ans après notre dernier contact.' },
                ],
              },
              {
                title: 'Candidature au réseau d’experts',
                rows: [
                  {
                    label: 'Données',
                    value:
                      'Nom, courriel, téléphone, profil (consultant, formateur), domaines, spécialités et secteurs, CV et documents joints.',
                  },
                  {
                    label: 'Pourquoi',
                    value:
                      'Étudier votre candidature et vous proposer des missions qui correspondent à votre profil.',
                  },
                  {
                    label: 'Qui les reçoit',
                    value:
                      'L’équipe d’OPEM et, seulement pour une proposition de mission, le client concerné.',
                  },
                  {
                    label: 'Combien de temps',
                    value:
                      'Cinq ans après notre dernier contact, puis effacement automatique, fichiers compris.',
                  },
                ],
              },
              {
                title: 'Rapport de l’autodiagnostic',
                rows: [
                  {
                    label: 'Données',
                    value:
                      'Vos réponses au questionnaire ; nom, organisation, fonction, courriel, téléphone ; votre accord, ou non, pour un échange avec un consultant.',
                  },
                  {
                    label: 'Pourquoi',
                    value:
                      'Vous envoyer votre rapport et, si vous l’acceptez, organiser un échange avec un consultant.',
                  },
                  {
                    label: 'Qui les reçoit',
                    value: 'L’équipe d’OPEM. Elles ne sont ni vendues ni cédées.',
                  },
                  { label: 'Combien de temps', value: 'Trois ans à compter du dernier contact.' },
                ],
              },
              {
                title: 'Lettre « Rester informé »',
                rows: [
                  {
                    label: 'Données',
                    value:
                      'Courriel, nom s’il nous est connu, langue du site, date de votre accord.',
                  },
                  {
                    label: 'Pourquoi',
                    value:
                      'Vous envoyer les éclairages d’OPEM et l’annonce de ses formations et offres.',
                  },
                  { label: 'Qui les reçoit', value: 'OPEM seulement ; aucun tiers.' },
                  {
                    label: 'Combien de temps',
                    value:
                      'Jusqu’à votre désinscription, possible à tout moment par le lien de chaque envoi. Les dates de votre accord et de votre désinscription sont gardées comme preuve.',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'protection',
        title: 'Comment nous les protégeons',
        blocks: [
          {
            kind: 'list',
            items: [
              'Le site ne s’ouvre qu’en connexion chiffrée (HTTPS).',
              'Les demandes de rendez-vous ne sont pas gardées sur le site : elles sont transmises par courriel à l’équipe d’OPEM.',
              'Les CV et documents des candidats sont rangés hors de l’accès public du site ; seule l’équipe d’OPEM peut les ouvrir.',
              'Les durées de conservation s’appliquent d’elles-mêmes : chaque jour, les candidatures arrivées à échéance sont effacées.',
            ],
          },
        ],
      },
      {
        id: 'navigateur',
        title: 'Cookies et mémoire du navigateur',
        blocks: [
          {
            kind: 'p',
            text: 'Le site d’OPEM ne dépose aucun cookie publicitaire et n’utilise aucun outil de mesure d’audience.',
          },
          {
            kind: 'p',
            text: 'Il garde seulement, dans votre navigateur, la langue que vous avez choisie et, le temps de la visite, une marque technique qui permet de recharger la page après une mise à jour du site. Ces informations ne nous sont pas transmises.',
          },
          {
            kind: 'p',
            text: [
              'La page Contact affiche une carte Google Maps. À son affichage, Google reçoit l’adresse de votre connexion et peut déposer ses propres cookies, selon sa ',
              { link: GOOGLE_PRIVACY, label: 'politique de confidentialité' },
              '.',
            ],
          },
        ],
      },
      {
        id: 'droits',
        title: 'Vos droits',
        blocks: [
          {
            kind: 'p',
            text: [
              'Vous pouvez à tout moment accéder à vos données, les faire rectifier ou supprimer, et vous opposer à leur traitement. Écrivez à ',
              mail(company.privacyEmail),
              ' en précisant le formulaire concerné.',
            ],
          },
          {
            kind: 'p',
            text: 'Pour la lettre « Rester informé », le lien de désinscription présent dans chaque envoi suffit.',
          },
          {
            kind: 'p',
            text: 'Si vous estimez que vos droits ne sont pas respectés, vous pouvez saisir l’Autorité nationale de protection des données à caractère personnel (ANPDP).',
          },
        ],
      },
      {
        id: 'evolution',
        title: 'Évolution de cette politique',
        blocks: [
          {
            kind: 'p',
            text: 'Cette politique suit le fonctionnement du site : elle est mise à jour à chaque nouveau formulaire ou changement de traitement. La date de la dernière mise à jour figure en tête de page.',
          },
        ],
      },
    ],
  },
  ar: {
    title: 'سياسة الخصوصية · OPEM',
    eyebrow: 'معلومات قانونية',
    heading: 'سياسة الخصوصية',
    intro:
      'لا تطلب OPEM إلا ما تحتاجه للرد عليكم، ولا تبيع أي معطيات، ولا تستعمل أي أداة إشهارية. إليكم، استمارةً استمارة، ما يُجمع ولماذا وإلى متى.',
    updated: UPDATED.ar,
    sections: [
      {
        id: 'responsable',
        title: 'المسؤول عن معطياتكم',
        blocks: [
          {
            kind: 'facts',
            rows: [
              {
                label: 'المسؤول عن المعالجة',
                value: `${company.shortName} - ${company.fullName}، ${company.address.ar}`,
              },
              { label: 'مندوبة حماية المعطيات', value: company.manager.ar },
              { label: 'للتواصل معها', value: [mail(company.privacyEmail)] },
            ],
          },
          {
            kind: 'p',
            text: 'تُعالَج معطياتكم طبقًا للقانون رقم 18-07 المؤرخ في 10 يونيو 2018 المتعلق بحماية الأشخاص الطبيعيين في مجال معالجة المعطيات ذات الطابع الشخصي، المعدّل والمتمّم.',
          },
        ],
      },
      {
        id: 'formulaires',
        title: 'ما نجمعه ولماذا',
        blocks: [
          {
            kind: 'p',
            text: 'لا يُجمع أي شيء ما لم ترسلوا استمارة. وأثناء التشخيص الذاتي، تبقى إجاباتكم في متصفحكم ولا تصلنا إلا إذا طلبتم تقريركم.',
          },
          {
            kind: 'cards',
            cards: [
              {
                title: 'طلب موعد',
                rows: [
                  {
                    label: 'المعطيات',
                    value:
                      'الاسم، المؤسسة، البريد الإلكتروني، الهاتف، موضوع المشروع وطبيعته، الرسالة، المواعيد المفضّلة.',
                  },
                  { label: 'لماذا', value: 'للرد على طلبكم وإعادة الاتصال بكم بشأنه.' },
                  { label: 'من يتلقاها', value: 'فريق OPEM، ولا أحد غيره.' },
                  { label: 'إلى متى', value: 'ثلاث سنوات بعد آخر اتصال بيننا.' },
                ],
              },
              {
                title: 'الترشح لشبكة الخبراء',
                rows: [
                  {
                    label: 'المعطيات',
                    value:
                      'الاسم، البريد الإلكتروني، الهاتف، الصفة (مستشار، مكوّن)، المجالات والتخصصات والقطاعات، السيرة الذاتية والوثائق المرفقة.',
                  },
                  {
                    label: 'لماذا',
                    value: 'لدراسة ترشحكم واقتراح مهام تتوافق مع ملفكم.',
                  },
                  {
                    label: 'من يتلقاها',
                    value: 'فريق OPEM، والعميل المعني فقط عند اقتراح مهمة.',
                  },
                  {
                    label: 'إلى متى',
                    value: 'خمس سنوات بعد آخر اتصال بيننا، ثم تُحذف تلقائيًا مع الملفات.',
                  },
                ],
              },
              {
                title: 'تقرير التشخيص الذاتي',
                rows: [
                  {
                    label: 'المعطيات',
                    value:
                      'إجاباتكم على الاستبيان؛ الاسم، المؤسسة، الوظيفة، البريد الإلكتروني، الهاتف؛ موافقتكم أو عدمها على تبادل الرأي مع مستشار.',
                  },
                  {
                    label: 'لماذا',
                    value: 'لإرسال تقريركم، وإن وافقتم، لتنظيم لقاء مع مستشار.',
                  },
                  { label: 'من يتلقاها', value: 'فريق OPEM. لا تُباع ولا يُتنازَل عنها.' },
                  { label: 'إلى متى', value: 'ثلاث سنوات ابتداءً من آخر اتصال.' },
                ],
              },
              {
                title: 'نشرة «ابقوا على اطلاع»',
                rows: [
                  {
                    label: 'المعطيات',
                    value:
                      'البريد الإلكتروني، الاسم إن كان معروفًا لدينا، لغة الموقع، تاريخ موافقتكم.',
                  },
                  {
                    label: 'لماذا',
                    value: 'لإرسال إضاءات OPEM والإعلان عن تكويناتها وعروضها.',
                  },
                  { label: 'من يتلقاها', value: 'OPEM وحدها؛ لا أي طرف ثالث.' },
                  {
                    label: 'إلى متى',
                    value:
                      'إلى حين إلغاء اشتراككم، وهو ممكن في أي وقت عبر الرابط الموجود في كل إرسال. ويُحتفَظ بتاريخ موافقتكم وتاريخ إلغاء الاشتراك كإثبات.',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'protection',
        title: 'كيف نحميها',
        blocks: [
          {
            kind: 'list',
            items: [
              'لا يُفتح الموقع إلا عبر اتصال مشفّر (HTTPS).',
              'لا تُحفظ طلبات المواعيد في الموقع: تُرسَل بالبريد الإلكتروني إلى فريق OPEM.',
              'تُحفظ السير الذاتية ووثائق المترشحين خارج الجزء العمومي من الموقع، ولا يطّلع عليها إلا فريق OPEM.',
              'تُطبَّق مدد الحفظ تلقائيًا: كل يوم، تُحذف الترشحات التي انقضت مدتها.',
            ],
          },
        ],
      },
      {
        id: 'navigateur',
        title: 'ملفات تعريف الارتباط وذاكرة المتصفح',
        blocks: [
          {
            kind: 'p',
            text: 'لا يضع موقع OPEM أي ملف تعريف ارتباط إشهاري ولا يستعمل أي أداة لقياس الزيارات.',
          },
          {
            kind: 'p',
            text: 'يحتفظ فقط، في متصفحكم، باللغة التي اخترتموها، وطوال الزيارة، بعلامة تقنية تسمح بإعادة تحميل الصفحة بعد تحديث الموقع. ولا تُنقل إلينا هذه المعلومات.',
          },
          {
            kind: 'p',
            text: [
              'تعرض صفحة «اتصل بنا» خريطة Google Maps. عند ظهورها، تتلقى Google عنوان اتصالكم وقد تضع ملفات تعريف الارتباط الخاصة بها، وفق ',
              { link: GOOGLE_PRIVACY, label: 'سياسة الخصوصية الخاصة بها' },
              '.',
            ],
          },
        ],
      },
      {
        id: 'droits',
        title: 'حقوقكم',
        blocks: [
          {
            kind: 'p',
            text: [
              'يمكنكم في أي وقت الاطلاع على معطياتكم وطلب تصحيحها أو حذفها والاعتراض على معالجتها. راسلونا على ',
              mail(company.privacyEmail),
              ' مع ذكر الاستمارة المعنية.',
            ],
          },
          {
            kind: 'p',
            text: 'بالنسبة لنشرة «ابقوا على اطلاع»، يكفي رابط إلغاء الاشتراك الموجود في كل إرسال.',
          },
          {
            kind: 'p',
            text: 'إذا رأيتم أن حقوقكم لم تُحترم، يمكنكم إخطار السلطة الوطنية لحماية المعطيات ذات الطابع الشخصي.',
          },
        ],
      },
      {
        id: 'evolution',
        title: 'تطوّر هذه السياسة',
        blocks: [
          {
            kind: 'p',
            text: 'تواكب هذه السياسة سير الموقع: تُحدَّث مع كل استمارة جديدة أو تغيير في المعالجة، ويظهر تاريخ آخر تحديث في أعلى الصفحة.',
          },
        ],
      },
    ],
  },
};

/* ---------- Plan du site ---------- */

export type SitemapContent = {
  title: string;
  eyebrow: string;
  heading: string;
  intro: string;
  /** Colonne des rubriques sans sous-pages (Accueil, Le cabinet…). */
  essentials: string;
  /** Colonne des pages légales. */
  legal: string;
};

export const sitemapContent: Record<Lang, SitemapContent> = {
  fr: {
    title: 'Plan du site · OPEM',
    eyebrow: 'Informations légales',
    heading: 'Plan du site',
    intro: 'Toutes les pages du site, rubrique par rubrique.',
    essentials: 'L’essentiel',
    legal: 'Informations légales',
  },
  ar: {
    title: 'خريطة الموقع · OPEM',
    eyebrow: 'معلومات قانونية',
    heading: 'خريطة الموقع',
    intro: 'كل صفحات الموقع، قسمًا قسمًا.',
    essentials: 'الأساسيات',
    legal: 'معلومات قانونية',
  },
};
