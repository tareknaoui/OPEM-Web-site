import type { Lang } from '@/i18n/language';

/*
 * Textes propres à la page « Éclairages ». Les articles, leurs catégories et les questions
 * fréquentes viennent de la page d'accueil (src/features/home/content.ts, source unique) ; les
 * thèmes reprennent les six domaines de l'accueil, plus l'IA appliquée. Aucun cahier des charges
 * pour cette page : textes proposés, à valider par OPEM ; l'arabe est à faire relire. La case
 * d'inscription reprend mot pour mot le champ 10 du formulaire de rendez-vous.
 */

const NBSP = ' ';

/** Le thème de chaque article de l'accueil (identifiant d'article → domaine). */
export const ARTICLE_THEMES: Record<string, string> = {
  organisation: 'accompagnement',
  formation: 'formations',
  ia: 'ia',
};

export type EclairagesContent = {
  intro: string;
  themesLabel: string;
  allThemes: string;
  ia: string;
  featured: string;
  latest: string;
  count: (n: number) => string;
  readMore: string;
  empty: { title: string; text: string };
  faq: { more: string };
  subscribe: {
    eyebrow: string;
    title: string;
    text: string;
    email: string;
    consent: string;
    submit: string;
    sending: string;
    thanks: string;
    errors: { email: string; required: string; consent: string; failure: string };
    legal: string;
  };
};

const fr: EclairagesContent = {
  intro: 'Analyses, points de vue et réponses de nos consultants, pour chacun de nos domaines.',
  themesLabel: 'Explorer par thème',
  allThemes: 'Tous les thèmes',
  ia: 'IA appliquée',
  featured: 'À la une',
  latest: 'Tous les éclairages',
  count: (n) => (n > 1 ? `${n} éclairages` : `${n} éclairage`),
  readMore: 'Lire l’éclairage',
  empty: {
    title: 'Pas encore d’éclairage sur ce thème.',
    text: 'Nos consultants y travaillent. En attendant, une question sur ce sujet ?',
  },
  faq: { more: 'Voir la réponse' },
  subscribe: {
    eyebrow: 'Restez informé',
    title: 'Recevoir nos éclairages',
    text: 'Nos analyses dès leur parution, et l’annonce de nos nouvelles formations.',
    email: 'Votre adresse de courriel',
    consent:
      'Je souhaite recevoir les éclairages d’OPEM et l’annonce de ses nouvelles formations et offres.',
    submit: 'M’inscrire',
    sending: 'Inscription…',
    thanks: `Merci, votre inscription est enregistrée. Un lien de désinscription figure dans chaque envoi.`,
    errors: {
      email: 'Saisissez une adresse de courriel valide, par exemple nom@domaine.dz.',
      required: 'Saisissez votre adresse de courriel.',
      consent: 'Cochez cette case pour vous inscrire.',
      failure: `L’inscription n’a pas abouti. Réessayez dans un instant, ou écrivez-nous à contact@opem-dz.com.`,
    },
    legal: `Votre adresse sert uniquement à ces envois et n’est transmise à aucun tiers. Conformément à la loi n°${NBSP}18-07, vous pouvez y accéder, la rectifier ou vous opposer à son traitement en écrivant à contact@opem-dz.com.`,
  },
};

const ar: EclairagesContent = {
  intro: 'تحليلات ووجهات نظر وأجوبة مستشارينا، في كل مجال من مجالاتنا.',
  themesLabel: 'تصفّح حسب الموضوع',
  allThemes: 'كل المواضيع',
  ia: 'الذكاء الاصطناعي التطبيقي',
  featured: 'في الواجهة',
  latest: 'كل الإضاءات',
  count: (n) => `${n} ${n > 2 && n < 11 ? 'إضاءات' : 'إضاءة'}`,
  readMore: 'اقرأ الإضاءة',
  empty: {
    title: 'لا توجد إضاءة حول هذا الموضوع بعد.',
    text: 'يعمل مستشارونا عليها. في الانتظار، هل لديكم سؤال حول هذا الموضوع؟',
  },
  faq: { more: 'عرض الجواب' },
  subscribe: {
    eyebrow: 'ابقوا على اطلاع',
    title: 'تلقّوا إضاءاتنا',
    text: 'تحليلاتنا فور صدورها، والإعلان عن تكويناتنا الجديدة.',
    email: 'عنوان بريدكم الإلكتروني',
    consent: 'أرغب في تلقّي إضاءات OPEM والإعلان عن تكويناتها وعروضها الجديدة.',
    submit: 'اشتراك',
    sending: 'جارٍ الاشتراك…',
    thanks: 'شكرًا، تم تسجيل اشتراككم. يتضمن كل إرسال رابطًا لإلغاء الاشتراك.',
    errors: {
      email: 'أدخلوا عنوان بريد إلكتروني صحيحًا، مثل nom@domaine.dz.',
      required: 'أدخلوا عنوان بريدكم الإلكتروني.',
      consent: 'حدّدوا هذه الخانة للاشتراك.',
      failure: 'لم يتم الاشتراك. أعيدوا المحاولة بعد لحظات، أو راسلونا على contact@opem-dz.com.',
    },
    legal:
      'يُستعمل عنوانكم لهذه الإرسالات فقط ولا يُنقل إلى أي طرف ثالث. طبقًا للقانون رقم 18-07، يمكنكم الاطلاع عليه أو تصحيحه أو الاعتراض على معالجته بمراسلتنا على contact@opem-dz.com.',
  },
};

export const eclairagesContent: Record<Lang, EclairagesContent> = { fr, ar };
