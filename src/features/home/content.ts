import type { Lang } from '@/i18n/language';

/* ==========================================================================
   Contenu de la page d'accueil (français et arabe).
   Un seul fichier à modifier pour changer les textes.

   ⚠ À FAIRE VALIDER PAR OPEM avant la mise en ligne :
   - textes d'accroche et descriptions (propositions) ;
   - CHIFFRES CLÉS : valeurs provisoires (question 12 à la Gérante) ;
   - SECTEURS : liste provisoire ;
   - PROCHAINES FORMATIONS : dates et intitulés provisoires ;
   - traductions arabes (relecture par une personne arabophone).
   Tant que `provisional` vaut true, une mention « à confirmer » s'affiche
   sous la section concernée, pour ne jamais présenter un chiffre inventé comme réel.
   ========================================================================== */

export type NeedIcon =
  'strategy' | 'organization' | 'certification' | 'training' | 'coaching' | 'safety';
export type MarkerIcon = 'domains' | 'sectors' | 'map';
export type AudienceIcon = 'public' | 'company';

type Link = { label: string; href: string };

export type HomeContent = {
  title: string;
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    primary: Link;
    secondary: Link;
  };
  /** Bandeau « Cycle OPEM » : grand titre + schéma animé de la démarche en 3 étapes. */
  heroCycle: {
    /** Deux lignes : la seconde est en bleu OPEM. */
    headline: [string, string];
    intro: string;
    /** Nom du groupe d'onglets (lecteurs d'écran). */
    label: string;
    step: string;
    pause: string;
    play: string;
    phases: {
      id: string;
      tab: string;
      caption: string;
      checklist: { title: string; items: { label: string; done: boolean }[] };
      note: { title: string; meta: string; status: string };
    }[];
  };
  /** Bandeau « Vidéo » : texte sur panneau bleu nuit, vidéo à côté, jamais dessous. */
  heroVideo: {
    headline: [string, string];
    intro: string;
    pause: string;
    play: string;
  };
  /** Bandeau « Immersif » (même vidéo) : carte d'orientation « De quoi avez-vous besoin ? ». */
  heroImmersive: {
    question: string;
    choices: Link[];
  };
  /** Bandeau « Éditorial » : grand titre, vidéo en fenêtre avec légende sur bandeau bleu nuit. */
  heroEditorial: {
    kicker: string;
    headline: [string, string];
    intro: string;
    caption: string;
    /** Texte qui tourne autour du badge circulaire (se termine par un séparateur). */
    badge: string;
    pillarsLabel: string;
    pillars: { title: string; text: string; href: string }[];
  };
  /**
   * Bandeau « Autodiagnostic » : une question dès l'accroche et quelques grandes réponses.
   * Les réponses mènent à la suite du diagnostic (page /autodiagnostic), la dernière au catalogue.
   */
  heroDiagnostic: {
    kicker: string;
    headline: string;
    question: string;
    choices: { id: string; icon: NeedIcon; label: string; href: string }[];
    /** Texte alternatif de la photo (à remplacer avec la vraie photo). */
    imageAlt: string;
  };
  /** Bandeau « Trois questions » : le titre remplacé par trois questions, chacune un lien. */
  heroQuestions: {
    questions: Link[];
    line: string;
    cta: Link;
  };
  /** Bandeau « Public / entreprise » : sous le titre, un grand bloc par type de client. */
  heroAudiences: {
    kicker: string;
    /** Deux lignes : la seconde en bleu clair. */
    headline: [string, string];
    intro: string;
    blocks: {
      id: string;
      icon: AudienceIcon;
      title: string;
      /** Les trois sujets du bloc, en étiquettes. */
      tags: string[];
      text: string;
      link: Link;
    }[];
  };
  /**
   * Bandeau « Repères » : sous les boutons, trois faits courts. Valeurs d'exemple tant que
   * provisional vaut true (mention « à confirmer » affichée) : à remplacer par les vrais chiffres.
   */
  heroFacts: {
    /** Liens à côté du bouton principal : le conseil et la formation, à égalité. */
    links: Link[];
    label: string;
    provisional: boolean;
    note: string;
    items: { value: string; label: string }[];
  };
  /**
   * Section « Nos domaines », juste sous l'accroche : un onglet par domaine, un panneau qui
   * en affiche un en entier. Ordre des domaines à confirmer par OPEM. Ne jamais écrire « DAS ».
   */
  domains: {
    title: string;
    /** Liste déroulante qui remplace les onglets sur mobile. */
    selectLabel: string;
    previous: string;
    next: string;
    /** « {current} sur {total} » */
    counter: string;
    discover: string;
    /** Carrousel animé : bouton pause / reprise du défilement. */
    pause: string;
    play: string;
    callback: Link;
    items: {
      id: string;
      title: string;
      text: string;
      points: string[];
      href: string;
      /** Photo 4:3, sans texte dessus (provisoire : à remplacer par une vraie photo). */
      image: string;
    }[];
  };
  /**
   * Section « Éclairages et actualités » (sous « Nos domaines ») : cartes à la manière des
   * pages « Insights » des grands cabinets. Contenus d'exemple tant que `provisional` vaut
   * true : à remplacer par les vraies publications d'OPEM (plus tard, depuis WordPress).
   */
  insights: {
    eyebrow: string;
    title: string;
    lead: string;
    filtersLabel: string;
    filters: { all: string; eclairage: string; actualite: string };
    readMore: string;
    /** Flèches du rail (version « Rail défilant »). */
    previous: string;
    next: string;
    provisional: boolean;
    note: string;
    links: Link[];
    items: {
      id: string;
      kind: 'eclairage' | 'actualite';
      /** Étiquette de la carte : « Article signé », « Session »… */
      label: string;
      title: string;
      excerpt: string;
      author?: string;
      /** AAAA-MM-JJ */
      date: string;
      href: string;
      /** Photo sans texte dessus. */
      image: string;
    }[];
  };
  markers: { icon: MarkerIcon; label: string }[];
  needs: {
    eyebrow: string;
    title: string;
    lead: string;
    more: string;
    items: {
      id: string;
      size: 'large' | 'small';
      icon: NeedIcon;
      title: string;
      text: string;
      href: string;
    }[];
  };
  audiences: {
    eyebrow: string;
    title: string;
    items: { id: string; title: string; text: string; link: Link; image: string }[];
  };
  approach: {
    eyebrow: string;
    title: string;
    lead: string;
    steps: { title: string; text: string }[];
  };
  figures: {
    eyebrow: string;
    title: string;
    provisional: boolean;
    note: string;
    items: { value: number; prefix?: string; label: string }[];
  };
  sectors: {
    eyebrow: string;
    title: string;
    lead: string;
    listLabel: string;
    provisional: boolean;
    note: string;
    items: string[];
  };
  trainings: {
    eyebrow: string;
    title: string;
    all: Link;
    register: string;
    provisional: boolean;
    note: string;
    empty: string;
    /** date au format AAAA-MM-JJ ; les sessions passées sont masquées automatiquement. */
    items: { id: string; date: string; title: string; format: string; href: string }[];
  };
  /**
   * Témoignages (dernière section). Exemples tant que `provisional` vaut true : à remplacer
   * par de vrais témoignages, publiés avec l'accord écrit de leurs auteurs. Pas de photo de
   * personne : un pictogramme indique le type d'organisme.
   */
  testimonials: {
    eyebrow: string;
    title: string;
    lead: string;
    listLabel: string;
    previous: string;
    next: string;
    counter: string;
    provisional: boolean;
    note: string;
    link: Link;
    items: {
      id: string;
      /** Domaine concerné, affiché en étiquette et dans la liste. */
      domain: string;
      icon: AudienceIcon;
      quote: string;
      name: string;
      role: string;
      organisation: string;
    }[];
  };
  /**
   * Questions fréquentes (après les témoignages). Réponses provisoires tant que
   * `provisional` vaut true : aucun délai, tarif ni agrément inventé ([à confirmer]).
   */
  faq: {
    eyebrow: string;
    title: string;
    lead: string;
    asideTitle: string;
    asideText: string;
    contact: Link;
    provisional: boolean;
    note: string;
    items: { id: string; question: string; answer: string }[];
  };
};

const fr: HomeContent = {
  title: 'OPEM — Conseil et formation en Algérie',
  hero: {
    eyebrow: 'Cabinet de conseil et de formation',
    title: 'Structurer, former, certifier : faire progresser votre organisation.',
    subtitle:
      'OPEM accompagne les entreprises et les organismes publics algériens, du diagnostic stratégique à la certification.',
    primary: { label: 'Demander un devis', href: '/contact' },
    secondary: { label: 'Voir les formations', href: '/formation' },
  },
  heroCycle: {
    headline: ['Faire progresser', 'votre organisation.'],
    intro:
      'Structurer, former, certifier : OPEM accompagne les entreprises et les organismes publics algériens, du diagnostic à la certification.',
    label: 'Notre démarche en trois étapes',
    step: 'Étape',
    pause: 'Mettre l’animation en pause',
    play: 'Relancer l’animation',
    phases: [
      {
        id: 'diagnostiquer',
        tab: 'Diagnostiquer',
        caption: 'On mesure avant d’agir',
        checklist: {
          title: 'Diagnostic d’entreprise',
          items: [
            { label: 'Gouvernance', done: true },
            { label: 'Processus clés', done: true },
            { label: 'Compétences', done: false },
          ],
        },
        note: { title: 'Rapport de diagnostic', meta: 'Constats et priorités', status: 'Remis' },
      },
      {
        id: 'structurer',
        tab: 'Structurer et former',
        caption: 'On construit avec vos équipes',
        checklist: {
          title: 'Plan d’actions',
          items: [
            { label: 'Procédures rédigées', done: true },
            { label: 'Indicateurs de pilotage', done: true },
            { label: 'Formation des équipes', done: false },
          ],
        },
        note: {
          title: 'Formation qualifiante',
          meta: 'Management de la qualité',
          status: 'Session planifiée',
        },
      },
      {
        id: 'certifier',
        tab: 'Certifier',
        caption: 'On sécurise la reconnaissance',
        checklist: {
          title: 'Préparation à l’audit',
          items: [
            { label: 'Système documentaire', done: true },
            { label: 'Audit à blanc', done: true },
            { label: 'Revue de direction', done: true },
          ],
        },
        note: { title: 'Certification ISO 9001', meta: 'Organisme accrédité', status: 'Obtenue' },
      },
    ],
  },
  heroVideo: {
    headline: ['Faire progresser', 'votre organisation.'],
    intro:
      'Structurer, former, certifier : OPEM accompagne les entreprises et les organismes publics algériens, du diagnostic à la certification.',
    pause: 'Mettre la vidéo en pause',
    play: 'Relancer la vidéo',
  },
  heroImmersive: {
    question: 'De quoi avez-vous besoin ?',
    choices: [
      { label: 'Études stratégiques', href: '/expertises/etudes-strategiques' },
      { label: 'Formation qualifiante', href: '/formation' },
      { label: 'Certification', href: '/expertises/certification-et-accreditation' },
    ],
  },
  heroEditorial: {
    kicker: 'Cabinet de conseil et de formation · Alger',
    headline: ['Bâtir des organisations', 'qui performent.'],
    intro:
      'Diagnostic, structuration, formation et certification : OPEM accompagne les entreprises et les organismes publics algériens avec méthode, à chaque étape de leur progression.',
    caption: 'Chaque organisation a sa méthode. Nous vous aidons à construire la vôtre.',
    badge: 'Beyond Quality · Conseil · Formation · Certification · ',
    pillarsLabel: 'Nos trois métiers',
    pillars: [
      {
        title: 'Conseil',
        text: 'Études stratégiques, organisation, communication.',
        href: '/expertises',
      },
      {
        title: 'Formation',
        text: 'Des parcours qualifiants, en entreprise ou en session.',
        href: '/formation',
      },
      {
        title: 'Certification',
        text: 'Normes ISO et accréditation, de la préparation à l’audit.',
        href: '/expertises/certification-et-accreditation',
      },
    ],
  },
  heroDiagnostic: {
    kicker: 'Cabinet de conseil et de formation',
    headline: 'Nous rendons votre organisation plus performante.',
    // Espace insécable avant « ? » : le point d'interrogation ne passe jamais seul à la ligne.
    question: 'Quelle est votre priorité cette année ?',
    choices: [
      {
        id: 'former',
        icon: 'coaching',
        label: 'Former mes équipes',
        href: '/autodiagnostic?priorite=former',
      },
      {
        id: 'certifier',
        icon: 'certification',
        label: 'Obtenir une certification',
        href: '/autodiagnostic?priorite=certifier',
      },
      {
        id: 'marche-public',
        icon: 'strategy',
        label: 'Répondre à un marché public',
        href: '/autodiagnostic?priorite=marche-public',
      },
      {
        id: 'organiser',
        icon: 'organization',
        label: 'Mieux organiser mon service',
        href: '/autodiagnostic?priorite=organiser',
      },
      { id: 'formations', icon: 'training', label: 'Nos formations', href: '/formation' },
    ],
    imageAlt: 'Salle de réunion d’un cabinet de conseil',
  },
  heroQuestions: {
    // Espaces insécables avant « ? » : le point d'interrogation ne passe jamais seul à la ligne.
    questions: [
      {
        label: 'Un audit de certification approche ?',
        href: '/expertises/certification-et-accreditation',
      },
      { label: 'Des équipes à former ?', href: '/formation' },
      {
        label: 'Une décision importante à préparer ?',
        href: '/expertises/etudes-strategiques',
      },
    ],
    line: 'OPEM vous accompagne, du diagnostic au résultat.',
    cta: { label: 'Être rappelé', href: '/contact' },
  },
  heroAudiences: {
    kicker: 'Cabinet de conseil et de formation',
    headline: ['Nous rendons votre organisation', 'plus performante.'],
    intro: 'Deux publics, une même exigence de méthode.',
    blocks: [
      {
        id: 'public',
        icon: 'public',
        title: 'Vous êtes un organisme public',
        tags: ['Marchés publics', 'Références publiques', 'Dossier administratif'],
        text: 'Des offres conformes et des références vérifiables pour vos marchés.',
        link: { label: 'Voir nos références', href: '/missions/references-clients' },
      },
      {
        id: 'entreprise',
        icon: 'company',
        title: 'Vous êtes une entreprise',
        tags: ['Diagnostic', 'Formation', 'Certification'],
        text: 'Une démarche claire pour faire progresser votre organisation.',
        link: { label: 'Découvrir nos expertises', href: '/expertises' },
      },
    ],
  },
  heroFacts: {
    links: [
      { label: 'Nos expertises', href: '/expertises' },
      { label: 'Nos formations', href: '/formation' },
    ],
    label: 'OPEM en bref',
    // Valeurs d'exemple (mêmes que les chiffres clés provisoires), à confirmer par OPEM.
    provisional: true,
    note: 'Chiffres provisoires, à confirmer par OPEM.',
    items: [
      { value: '15 ans', label: 'd’expérience' },
      { value: '+120', label: 'organisations accompagnées' },
      { value: '+2 000', label: 'personnes formées' },
    ],
  },
  domains: {
    title: 'Nos domaines',
    selectLabel: 'Choisir un domaine',
    previous: 'Domaine précédent',
    next: 'Domaine suivant',
    counter: '{current} sur {total}',
    discover: 'Découvrir ce domaine',
    pause: 'Mettre le défilement en pause',
    play: 'Relancer le défilement',
    callback: { label: 'Être rappelé', href: '/contact' },
    // Ordre à confirmer par OPEM.
    items: [
      {
        id: 'etudes-strategiques',
        title: 'Études stratégiques',
        text: 'Nous réalisons des études pour éclairer vos décisions.',
        points: ['Un groupe d’experts', 'Des méthodes reconnues', 'Types d’études [à confirmer]'],
        href: '/expertises/etudes-strategiques',
        image: '/images/domaines/etudes-strategiques.jpg',
      },
      {
        id: 'accompagnement',
        title: 'Accompagnement des organisations',
        text: 'Nous vous accompagnons, du diagnostic à la mise en œuvre.',
        points: ['Diagnostic', 'Mise en œuvre accompagnée', 'Transfert de compétences'],
        href: '/expertises/accompagnement-des-organisations',
        image: '/images/domaines/accompagnement.jpg',
      },
      {
        id: 'formations',
        title: 'Formations qualifiantes',
        text: 'Des formations en Management, Qualité, HSE et Techniques de l’ingénieur (BTPH).',
        points: [
          'Intra, inter ou à la carte',
          'E-learning, conférences, séminaires',
          'Une fiche détaillée par formation',
        ],
        href: '/formation',
        image: '/images/domaines/formations.jpg',
      },
      {
        id: 'coaching',
        title: 'Coaching professionnel',
        text: 'Un accompagnement individuel ou d’équipe [à confirmer], en toute confidentialité.',
        points: ['Formats [à confirmer]', 'Confidentialité', 'Premier échange discret'],
        href: '/expertises/coaching-professionnel',
        image: '/images/domaines/coaching.jpg',
      },
      {
        id: 'certification',
        title: 'Certification, accréditation, labellisation',
        text: 'Nous préparons votre organisation à la certification, à l’accréditation et à la labellisation.',
        points: [
          'Référentiels [à confirmer]',
          'Préparation',
          'Accompagnement jusqu’à l’audit [à confirmer]',
        ],
        href: '/expertises/certification-et-accreditation',
        image: '/images/domaines/certification.jpg',
      },
    ],
  },
  insights: {
    eyebrow: 'Éclairages et actualités',
    title: 'Des idées pour décider, des nouvelles du cabinet.',
    lead: 'Nos consultants partagent leurs analyses et répondent à vos questions ; le cabinet raconte ses sessions, ses rencontres et ses engagements.',
    filtersLabel: 'Filtrer les publications',
    filters: { all: 'Tout', eclairage: 'Éclairages', actualite: 'Actualités' },
    readMore: 'Lire l’article',
    previous: 'Publications précédentes',
    next: 'Publications suivantes',
    provisional: true,
    note: 'Publications d’exemple, à remplacer par les articles et actualités d’OPEM.',
    links: [
      { label: 'Tous les éclairages', href: '/eclairages' },
      { label: 'Toutes les actualités', href: '/actualites' },
    ],
    items: [
      {
        id: 'audit-iso',
        kind: 'eclairage',
        label: 'Article signé',
        title: 'Certification ISO : ce que l’audit vérifie vraiment',
        excerpt:
          'Au-delà des documents, l’auditeur regarde comment l’organisation fonctionne au quotidien. Les points qui font la différence le jour J.',
        author: 'Par un consultant OPEM [à confirmer]',
        date: '2026-10-14',
        href: '/eclairages/articles-signes',
        image: '/images/actualites/salle-reunion.jpg',
      },
      {
        id: 'marche-public',
        kind: 'eclairage',
        label: 'Vos questions, nos réponses',
        title: 'Faut-il être certifié pour répondre à un marché public ?',
        excerpt:
          'Ce que demandent les cahiers des charges, et comment s’y préparer sans perdre de temps.',
        date: '2026-10-02',
        href: '/eclairages/articles-signes/vos-questions-nos-reponses',
        image: '/images/actualites/bureau.jpg',
      },
      {
        id: 'ruche',
        kind: 'eclairage',
        label: 'Article signé',
        title: 'Ce que la ruche nous apprend sur l’organisation du travail',
        excerpt:
          'Des rôles clairs, une information qui circule, un objectif commun : une leçon d’organisation venue de la nature.',
        author: 'Par un consultant OPEM [à confirmer]',
        date: '2026-09-18',
        href: '/eclairages/articles-signes',
        image: '/images/actualites/ruche.jpg',
      },
      {
        id: 'session-iso-9001',
        kind: 'actualite',
        label: 'Session',
        title: 'Management de la qualité selon l’ISO 9001 : nouvelle session',
        excerpt:
          'Une formation qualifiante en présentiel à Alger. Dates et inscriptions [à confirmer].',
        date: '2026-10-20',
        href: '/actualites/sessions-et-interventions',
        image: '/images/domaines/formations.jpg',
      },
      {
        id: 'intervention',
        kind: 'actualite',
        label: 'Intervention',
        title: 'OPEM intervient sur la performance des organisations [événement à confirmer]',
        excerpt: 'Retour sur une prise de parole de nos consultants.',
        date: '2026-09-30',
        href: '/actualites/sessions-et-interventions',
        image: '/images/domaines/etudes-strategiques.jpg',
      },
      {
        id: 'convention',
        kind: 'actualite',
        label: 'Convention',
        title: 'Signature d’une convention de partenariat [partenaire à confirmer]',
        excerpt: 'Un nouvel engagement pour accompagner les organisations dans la durée.',
        date: '2026-09-10',
        href: '/actualites/conventions-et-evenements',
        image: '/images/domaines/coaching.jpg',
      },
    ],
  },
  markers: [
    { icon: 'domains', label: '5 domaines d’expertise' },
    { icon: 'sectors', label: 'Public et privé' },
    { icon: 'map', label: 'Partout en Algérie' },
  ],
  needs: {
    eyebrow: 'Nos expertises',
    title: 'Quel est votre besoin ?',
    lead: 'Partez de votre situation : nous vous orientons vers le bon accompagnement.',
    more: 'En savoir plus',
    items: [
      {
        id: 'strategie',
        size: 'large',
        icon: 'strategy',
        title: 'Définir votre stratégie',
        text: 'Diagnostic, études de marché et de faisabilité, plan de développement : des décisions éclairées, chiffrées et partagées.',
        href: '/expertises/etudes-strategiques',
      },
      {
        id: 'certification',
        size: 'small',
        icon: 'certification',
        title: 'Obtenir une certification',
        text: 'ISO, accréditation, label : préparation et accompagnement jusqu’à l’audit.',
        href: '/expertises/certification-et-accreditation',
      },
      {
        id: 'coaching',
        size: 'small',
        icon: 'coaching',
        title: 'Accompagner vos managers',
        text: 'Coaching individuel des dirigeants et des cadres.',
        href: '/expertises/coaching-professionnel',
      },
      {
        id: 'formation',
        size: 'small',
        icon: 'training',
        title: 'Former vos équipes',
        text: 'Management, qualité, HSE, BTPH : des formations qualifiantes, en inter ou en intra-entreprise.',
        href: '/formation',
      },
      {
        id: 'organisation',
        size: 'large',
        icon: 'organization',
        title: 'Structurer votre organisation et piloter la performance',
        text: 'Organigramme, processus, procédures, tableaux de bord : une organisation claire, des résultats mesurables.',
        href: '/expertises/accompagnement-des-organisations',
      },
      {
        id: 'qualite-securite',
        size: 'small',
        icon: 'safety',
        title: 'Maîtriser la qualité et la sécurité',
        text: 'Systèmes qualité, santé et sécurité au travail, environnement.',
        href: '/formation/catalogue-et-sessions',
      },
    ],
  },
  audiences: {
    eyebrow: 'Pour qui',
    title: 'Vous êtes…',
    items: [
      {
        id: 'entreprise',
        title: 'Une entreprise',
        text: 'PME, groupes industriels, entreprises du BTPH : gagnez en organisation, en qualité et en compétences.',
        link: { label: 'Solutions pour les entreprises', href: '/expertises' },
        image: '/images/vous-etes-entreprise.svg',
      },
      {
        id: 'organisme-public',
        title: 'Un organisme public',
        text: 'Administrations et établissements publics : un accompagnement adapté au cadre des marchés publics.',
        link: {
          label: 'Accompagnement des organismes publics',
          href: '/expertises/accompagnement-des-organisations',
        },
        image: '/images/vous-etes-organisme-public.svg',
      },
    ],
  },
  approach: {
    eyebrow: 'Notre approche',
    title: 'Trois temps, du diagnostic aux résultats.',
    lead: 'Chaque mission suit le même fil : comprendre, construire, ancrer.',
    steps: [
      {
        title: 'Comprendre',
        text: 'Entretiens, visites de terrain, analyse des documents : nous établissons avec vous un diagnostic partagé de votre situation et de vos priorités.',
      },
      {
        title: 'Construire',
        text: 'Nous concevons avec vos équipes les solutions, les outils et le plan d’action, adaptés à votre contexte et à vos moyens.',
      },
      {
        title: 'Ancrer',
        text: 'Formation, accompagnement et indicateurs de suivi : les changements tiennent dans la durée, et vos équipes en restent maîtresses.',
      },
    ],
  },
  figures: {
    eyebrow: 'En chiffres',
    title: 'OPEM en quelques chiffres',
    provisional: true,
    note: 'Chiffres provisoires, en attente de validation par OPEM.',
    items: [
      { value: 5, label: 'domaines d’expertise' },
      { value: 15, label: 'années d’expérience' },
      { value: 120, prefix: '+', label: 'organisations accompagnées' },
      { value: 2000, prefix: '+', label: 'personnes formées' },
    ],
  },
  sectors: {
    eyebrow: 'Secteurs',
    title: 'Votre métier, nos méthodes.',
    lead: 'Industrie, services ou administration : nous adaptons nos outils à votre secteur.',
    listLabel: 'Secteurs d’intervention',
    provisional: true,
    note: 'Liste provisoire, à confirmer par OPEM.',
    items: [
      'BTPH',
      'Industrie',
      'Énergie et mines',
      'Agroalimentaire',
      'Santé',
      'Transport et logistique',
      'Services',
      'Administration publique',
      'Enseignement et formation',
    ],
  },
  trainings: {
    eyebrow: 'Agenda',
    title: 'Prochaines formations',
    all: { label: 'Tout le calendrier', href: '/formation' },
    register: 'S’inscrire',
    provisional: true,
    note: 'Calendrier indicatif, à confirmer par OPEM.',
    empty: 'Les prochaines sessions seront annoncées très bientôt.',
    items: [
      {
        id: 'iso-9001',
        date: '2026-11-16',
        title: 'Management de la qualité selon l’ISO 9001',
        format: 'Présentiel · Alger · 3 jours',
        href: '/formation/catalogue-et-sessions',
      },
      {
        id: 'iso-45001',
        date: '2026-11-24',
        title: 'Santé et sécurité au travail (ISO 45001)',
        format: 'Présentiel · Alger · 2 jours',
        href: '/formation/catalogue-et-sessions',
      },
      {
        id: 'leadership',
        date: '2026-12-07',
        title: 'Management d’équipe et leadership',
        format: 'Présentiel · Alger · 2 jours',
        href: '/formation/catalogue-et-sessions',
      },
      {
        id: 'projets-btph',
        date: '2026-12-14',
        title: 'Gestion de projets BTPH',
        format: 'Présentiel · Alger · 4 jours',
        href: '/formation/catalogue-et-sessions',
      },
    ],
  },
  testimonials: {
    eyebrow: 'Témoignages',
    title: 'Ce que retiennent ceux que nous accompagnons.',
    lead: 'Dirigeants, responsables qualité, chefs de service : ils racontent ce qui a changé dans leur organisation.',
    listLabel: 'Choisir un témoignage',
    previous: 'Témoignage précédent',
    next: 'Témoignage suivant',
    counter: 'Témoignage {current} sur {total}',
    provisional: true,
    note: 'Témoignages d’exemple, à remplacer par de vrais témoignages publiés avec l’accord de leurs auteurs.',
    link: { label: 'Voir nos missions et réalisations', href: '/missions' },
    items: [
      {
        id: 'formation',
        domain: 'Formations',
        icon: 'company',
        quote:
          'Les formations partaient de nos propres situations de travail. Dès le lendemain, nos équipes appliquaient ce qu’elles avaient appris.',
        name: '[Nom à confirmer]',
        role: 'Directeur des ressources humaines [à confirmer]',
        organisation: 'Entreprise industrielle [à confirmer]',
      },
      {
        id: 'certification',
        domain: 'Certification',
        icon: 'company',
        quote:
          'OPEM nous a préparés à l’audit pas à pas. Le jour venu, chacun savait ce qu’il avait à montrer, et pourquoi.',
        name: '[Nom à confirmer]',
        role: 'Responsable qualité [à confirmer]',
        organisation: 'Entreprise de services [à confirmer]',
      },
      {
        id: 'accompagnement',
        domain: 'Accompagnement',
        icon: 'public',
        quote:
          'Il fallait organiser notre service sans tout bouleverser. La démarche a été claire, du diagnostic jusqu’au suivi.',
        name: '[Nom à confirmer]',
        role: 'Chef de service [à confirmer]',
        organisation: 'Établissement public [à confirmer]',
      },
      {
        id: 'etudes',
        domain: 'Études stratégiques',
        icon: 'public',
        quote:
          'Le diagnostic a mis des mots sur ce que nous ressentions. Nous avons pu décider à partir de faits, et non d’impressions.',
        name: '[Nom à confirmer]',
        role: 'Directeur général [à confirmer]',
        organisation: 'Organisme public [à confirmer]',
      },
    ],
  },
  faq: {
    eyebrow: 'Questions fréquentes',
    title: 'Tout ce qu’il faut savoir avant de commencer.',
    lead: 'Les réponses aux questions que l’on nous pose le plus souvent.',
    asideTitle: 'Vous ne trouvez pas votre réponse ?',
    asideText: 'Un consultant OPEM vous répond et vous oriente vers le bon accompagnement.',
    contact: { label: 'Poser votre question', href: '/contact' },
    provisional: true,
    note: 'Réponses provisoires, à valider par OPEM.',
    items: [
      {
        id: 'pour-qui',
        question: 'Quels types d’organisations accompagnez-vous ?',
        answer:
          'Les entreprises privées comme les organismes publics, partout en Algérie. Nous adaptons la démarche à la taille de l’organisation, à son secteur et à son point de départ.',
      },
      {
        id: 'premier-contact',
        question: 'Comment se passe une première prise de contact ?',
        answer:
          'Un premier échange, par téléphone ou en rendez-vous, pour comprendre votre besoin. Vous recevez ensuite une proposition adaptée : objectifs, démarche et calendrier. Conditions de ce premier échange [à confirmer].',
      },
      {
        id: 'certification',
        question: 'Pouvez-vous nous accompagner jusqu’à la certification ISO ?',
        answer:
          'Oui : diagnostic, mise en place du système, formation des équipes et préparation à l’audit. La certification elle-même est délivrée par un organisme certificateur indépendant, que vous choisissez.',
      },
      {
        id: 'sur-mesure',
        question: 'Proposez-vous des formations sur mesure, dans nos locaux ?',
        answer:
          'En plus des sessions de notre calendrier, nous pouvons construire une formation à partir de vos situations de travail et l’animer chez vous [modalités à confirmer].',
      },
      {
        id: 'attestation',
        question: 'Les participants reçoivent-ils une attestation ?',
        answer:
          'Chaque participant reçoit une attestation de formation [à confirmer : intitulé, conditions de délivrance et agréments éventuels].',
      },
      {
        id: 'duree',
        question: 'Combien de temps dure un accompagnement ?',
        answer:
          'Cela dépend de votre point de départ, de la taille de l’organisation et de l’objectif visé. La durée est précisée dans notre proposition, après le diagnostic.',
      },
    ],
  },
};

const ar: HomeContent = {
  title: 'OPEM — الاستشارة والتكوين في الجزائر',
  hero: {
    eyebrow: 'مكتب استشارات وتكوين',
    title: 'الهيكلة، التكوين، الإشهاد: نرتقي بمؤسستكم.',
    subtitle:
      'ترافق OPEM المؤسسات والهيئات العمومية الجزائرية، من التشخيص الاستراتيجي إلى الحصول على الشهادات.',
    primary: { label: 'اطلب عرض سعر', href: '/contact' },
    secondary: { label: 'اكتشف التكوينات', href: '/formation' },
  },
  heroCycle: {
    headline: ['نرتقي', 'بأداء مؤسستكم.'],
    intro:
      'الهيكلة، التكوين، الإشهاد: ترافق OPEM المؤسسات والهيئات العمومية الجزائرية، من التشخيص إلى الحصول على الشهادة.',
    label: 'منهجيتنا في ثلاث مراحل',
    step: 'المرحلة',
    pause: 'إيقاف الحركة مؤقتًا',
    play: 'استئناف الحركة',
    phases: [
      {
        id: 'diagnostiquer',
        tab: 'التشخيص',
        caption: 'نقيس قبل أن نتصرف',
        checklist: {
          title: 'تشخيص المؤسسة',
          items: [
            { label: 'الحوكمة', done: true },
            { label: 'العمليات الرئيسية', done: true },
            { label: 'الكفاءات', done: false },
          ],
        },
        note: { title: 'تقرير التشخيص', meta: 'الملاحظات والأولويات', status: 'تم التسليم' },
      },
      {
        id: 'structurer',
        tab: 'الهيكلة والتكوين',
        caption: 'نبني مع فرقكم',
        checklist: {
          title: 'خطة العمل',
          items: [
            { label: 'إعداد الإجراءات', done: true },
            { label: 'مؤشرات القيادة', done: true },
            { label: 'تكوين الفرق', done: false },
          ],
        },
        note: { title: 'التكوين التأهيلي', meta: 'إدارة الجودة', status: 'دورة مبرمجة' },
      },
      {
        id: 'certifier',
        tab: 'الإشهاد',
        caption: 'نضمن الاعتراف بجهودكم',
        checklist: {
          title: 'التحضير للتدقيق',
          items: [
            { label: 'النظام الوثائقي', done: true },
            { label: 'تدقيق تجريبي', done: true },
            { label: 'مراجعة الإدارة', done: true },
          ],
        },
        note: { title: 'شهادة ISO 9001', meta: 'هيئة معتمدة', status: 'تم الحصول عليها' },
      },
    ],
  },
  heroVideo: {
    headline: ['نرتقي', 'بأداء مؤسستكم.'],
    intro:
      'الهيكلة، التكوين، الإشهاد: ترافق OPEM المؤسسات والهيئات العمومية الجزائرية، من التشخيص إلى الحصول على الشهادة.',
    pause: 'إيقاف الفيديو مؤقتًا',
    play: 'استئناف الفيديو',
  },
  heroImmersive: {
    question: 'ما الذي تحتاجونه؟',
    choices: [
      { label: 'الدراسات الاستراتيجية', href: '/expertises/etudes-strategiques' },
      { label: 'التكوين التأهيلي', href: '/formation' },
      { label: 'الإشهاد', href: '/expertises/certification-et-accreditation' },
    ],
  },
  heroEditorial: {
    kicker: 'مكتب استشارات وتكوين · الجزائر العاصمة',
    headline: ['نبني مؤسسات', 'عالية الأداء.'],
    intro:
      'التشخيص، الهيكلة، التكوين والإشهاد: ترافق OPEM المؤسسات والهيئات العمومية الجزائرية بمنهجية، في كل مرحلة من مراحل تطورها.',
    caption: 'لكل مؤسسة منهجها. نساعدكم على بناء منهجكم.',
    // Signature de marque (en latin, comme dans le logo) : l'arabe se lit mal sur un petit cercle.
    badge: 'Beyond Quality · OPEM · Beyond Quality · OPEM · ',
    pillarsLabel: 'مهننا الثلاث',
    pillars: [
      {
        title: 'الاستشارة',
        text: 'الدراسات الاستراتيجية، التنظيم، الاتصال.',
        href: '/expertises',
      },
      {
        title: 'التكوين',
        text: 'مسارات تأهيلية، داخل المؤسسة أو في دورات.',
        href: '/formation',
      },
      {
        title: 'الإشهاد',
        text: 'معايير ISO والاعتماد، من التحضير إلى التدقيق.',
        href: '/expertises/certification-et-accreditation',
      },
    ],
  },
  heroDiagnostic: {
    kicker: 'مكتب استشارات وتكوين',
    headline: 'نجعل مؤسستكم أكثر أداءً.',
    question: 'ما هي أولويتكم هذه السنة؟',
    choices: [
      {
        id: 'former',
        icon: 'coaching',
        label: 'تكوين فرقي',
        href: '/autodiagnostic?priorite=former',
      },
      {
        id: 'certifier',
        icon: 'certification',
        label: 'الحصول على شهادة',
        href: '/autodiagnostic?priorite=certifier',
      },
      {
        id: 'marche-public',
        icon: 'strategy',
        label: 'الاستجابة لصفقة عمومية',
        href: '/autodiagnostic?priorite=marche-public',
      },
      {
        id: 'organiser',
        icon: 'organization',
        label: 'تنظيم مصلحتي بشكل أفضل',
        href: '/autodiagnostic?priorite=organiser',
      },
      { id: 'formations', icon: 'training', label: 'تكويناتنا', href: '/formation' },
    ],
    imageAlt: 'قاعة اجتماعات في مكتب استشارات',
  },
  heroQuestions: {
    questions: [
      { label: 'تدقيق الإشهاد يقترب؟', href: '/expertises/certification-et-accreditation' },
      { label: 'فرق تحتاج إلى تكوين؟', href: '/formation' },
      { label: 'قرار مهم تحضّرون له؟', href: '/expertises/etudes-strategiques' },
    ],
    line: 'ترافقكم OPEM، من التشخيص إلى النتيجة.',
    cta: { label: 'اطلب مكالمة', href: '/contact' },
  },
  heroAudiences: {
    kicker: 'مكتب استشارات وتكوين',
    headline: ['نجعل مؤسستكم', 'أكثر أداءً.'],
    intro: 'فئتان، ونفس الصرامة في المنهجية.',
    blocks: [
      {
        id: 'public',
        icon: 'public',
        title: 'أنتم هيئة عمومية',
        tags: ['الصفقات العمومية', 'المراجع العمومية', 'الملف الإداري'],
        text: 'عروض مطابقة ومراجع موثّقة لصفقاتكم.',
        link: { label: 'اطّلعوا على مراجعنا', href: '/missions/references-clients' },
      },
      {
        id: 'entreprise',
        icon: 'company',
        title: 'أنتم مؤسسة',
        tags: ['التشخيص', 'التكوين', 'الإشهاد'],
        text: 'منهجية واضحة للارتقاء بمؤسستكم.',
        link: { label: 'اكتشفوا خبراتنا', href: '/expertises' },
      },
    ],
  },
  heroFacts: {
    links: [
      { label: 'خبراتنا', href: '/expertises' },
      { label: 'تكويناتنا', href: '/formation' },
    ],
    label: 'OPEM باختصار',
    provisional: true,
    note: 'أرقام مؤقتة في انتظار مصادقة OPEM.',
    items: [
      { value: '15 سنة', label: 'من الخبرة' },
      { value: '+120', label: 'مؤسسة مرافَقة' },
      { value: '+2000', label: 'شخص تم تكوينه' },
    ],
  },
  domains: {
    title: 'مجالاتنا',
    selectLabel: 'اختيار مجال',
    previous: 'المجال السابق',
    next: 'المجال التالي',
    counter: '{current} من {total}',
    discover: 'اكتشفوا هذا المجال',
    pause: 'إيقاف التمرير مؤقتًا',
    play: 'استئناف التمرير',
    callback: { label: 'اطلب مكالمة', href: '/contact' },
    items: [
      {
        id: 'etudes-strategiques',
        title: 'الدراسات الاستراتيجية',
        text: 'ننجز دراسات تنير قراراتكم.',
        points: ['مجموعة من الخبراء', 'مناهج معترف بها', 'أنواع الدراسات [في انتظار التأكيد]'],
        href: '/expertises/etudes-strategiques',
        image: '/images/domaines/etudes-strategiques.jpg',
      },
      {
        id: 'accompagnement',
        title: 'مرافقة المؤسسات',
        text: 'نرافقكم من التشخيص إلى التنفيذ.',
        points: ['التشخيص', 'تنفيذ مرافَق', 'نقل الكفاءات'],
        href: '/expertises/accompagnement-des-organisations',
        image: '/images/domaines/accompagnement.jpg',
      },
      {
        id: 'formations',
        title: 'التكوينات التأهيلية',
        text: 'تكوينات في التسيير، الجودة، الصحة والسلامة والبيئة، وتقنيات المهندس (البناء والأشغال العمومية والري).',
        points: [
          'داخل المؤسسة، مشتركة أو حسب الطلب',
          'تعلّم إلكتروني، محاضرات، ندوات',
          'بطاقة مفصّلة لكل تكوين',
        ],
        href: '/formation',
        image: '/images/domaines/formations.jpg',
      },
      {
        id: 'coaching',
        title: 'الكوتشينغ المهني',
        text: 'مرافقة فردية أو جماعية [في انتظار التأكيد]، في سرية تامة.',
        points: ['الصيغ [في انتظار التأكيد]', 'السرية', 'لقاء أول بكل تكتّم'],
        href: '/expertises/coaching-professionnel',
        image: '/images/domaines/coaching.jpg',
      },
      {
        id: 'certification',
        title: 'الإشهاد، الاعتماد، العلامات',
        text: 'نحضّر مؤسستكم للإشهاد والاعتماد والحصول على العلامات.',
        points: [
          'المرجعيات [في انتظار التأكيد]',
          'التحضير',
          'المرافقة حتى التدقيق [في انتظار التأكيد]',
        ],
        href: '/expertises/certification-et-accreditation',
        image: '/images/domaines/certification.jpg',
      },
    ],
  },
  insights: {
    eyebrow: 'إضاءات وأخبار',
    title: 'أفكار لاتخاذ القرار، وأخبار من المكتب.',
    lead: 'يشارك مستشارونا تحليلاتهم ويجيبون عن أسئلتكم؛ ويروي المكتب دوراته ولقاءاته والتزاماته.',
    filtersLabel: 'تصفية المنشورات',
    filters: { all: 'الكل', eclairage: 'إضاءات', actualite: 'أخبار' },
    readMore: 'اقرأ المقال',
    previous: 'المنشورات السابقة',
    next: 'المنشورات التالية',
    provisional: true,
    note: 'منشورات على سبيل المثال، تُستبدل بمقالات وأخبار OPEM.',
    links: [
      { label: 'كل الإضاءات', href: '/eclairages' },
      { label: 'كل الأخبار', href: '/actualites' },
    ],
    items: [
      {
        id: 'audit-iso',
        kind: 'eclairage',
        label: 'مقال موقّع',
        title: 'شهادة ISO: ما الذي يتحقق منه التدقيق فعلًا',
        excerpt:
          'أبعد من الوثائق، ينظر المدقق إلى طريقة عمل المؤسسة يوميًا. النقاط التي تصنع الفرق يوم التدقيق.',
        author: 'بقلم أحد مستشاري OPEM [في انتظار التأكيد]',
        date: '2026-10-14',
        href: '/eclairages/articles-signes',
        image: '/images/actualites/salle-reunion.jpg',
      },
      {
        id: 'marche-public',
        kind: 'eclairage',
        label: 'أسئلتكم وأجوبتنا',
        title: 'هل يجب الحصول على شهادة للمشاركة في صفقة عمومية؟',
        excerpt: 'ما تطلبه دفاتر الشروط، وكيف تستعدون لها دون إضاعة الوقت.',
        date: '2026-10-02',
        href: '/eclairages/articles-signes/vos-questions-nos-reponses',
        image: '/images/actualites/bureau.jpg',
      },
      {
        id: 'ruche',
        kind: 'eclairage',
        label: 'مقال موقّع',
        title: 'ما تعلّمنا إياه خلية النحل عن تنظيم العمل',
        excerpt: 'أدوار واضحة، معلومة تتداول، وهدف مشترك: درس في التنظيم من الطبيعة.',
        author: 'بقلم أحد مستشاري OPEM [في انتظار التأكيد]',
        date: '2026-09-18',
        href: '/eclairages/articles-signes',
        image: '/images/actualites/ruche.jpg',
      },
      {
        id: 'session-iso-9001',
        kind: 'actualite',
        label: 'دورة',
        title: 'إدارة الجودة وفق ISO 9001: دورة جديدة',
        excerpt: 'تكوين تأهيلي حضوري بالجزائر العاصمة. المواعيد والتسجيل [في انتظار التأكيد].',
        date: '2026-10-20',
        href: '/actualites/sessions-et-interventions',
        image: '/images/domaines/formations.jpg',
      },
      {
        id: 'intervention',
        kind: 'actualite',
        label: 'مداخلة',
        title: 'OPEM تتدخل حول أداء المؤسسات [الحدث في انتظار التأكيد]',
        excerpt: 'عودة على مداخلة لمستشارينا.',
        date: '2026-09-30',
        href: '/actualites/sessions-et-interventions',
        image: '/images/domaines/etudes-strategiques.jpg',
      },
      {
        id: 'convention',
        kind: 'actualite',
        label: 'اتفاقية',
        title: 'توقيع اتفاقية شراكة [الشريك في انتظار التأكيد]',
        excerpt: 'التزام جديد لمرافقة المؤسسات على المدى الطويل.',
        date: '2026-09-10',
        href: '/actualites/conventions-et-evenements',
        image: '/images/domaines/coaching.jpg',
      },
    ],
  },
  markers: [
    { icon: 'domains', label: '5 مجالات خبرة' },
    { icon: 'sectors', label: 'القطاعان العام والخاص' },
    { icon: 'map', label: 'عبر كامل التراب الوطني' },
  ],
  needs: {
    eyebrow: 'خبراتنا',
    title: 'ما هي حاجتكم؟',
    lead: 'انطلقوا من وضعيتكم: نوجهكم نحو المرافقة المناسبة.',
    more: 'اعرف المزيد',
    items: [
      {
        id: 'strategie',
        size: 'large',
        icon: 'strategy',
        title: 'تحديد استراتيجيتكم',
        text: 'التشخيص، دراسات السوق والجدوى، مخطط التطوير: قرارات مدروسة ومرقّمة ومتقاسمة.',
        href: '/expertises/etudes-strategiques',
      },
      {
        id: 'certification',
        size: 'small',
        icon: 'certification',
        title: 'الحصول على شهادة',
        text: 'ISO، الاعتماد، العلامات: تحضير ومرافقة حتى التدقيق.',
        href: '/expertises/certification-et-accreditation',
      },
      {
        id: 'coaching',
        size: 'small',
        icon: 'coaching',
        title: 'مرافقة إطاراتكم',
        text: 'كوتشينغ فردي للمسيرين والإطارات.',
        href: '/expertises/coaching-professionnel',
      },
      {
        id: 'formation',
        size: 'small',
        icon: 'training',
        title: 'تكوين فرقكم',
        text: 'التسيير، الجودة، الصحة والسلامة والبيئة، البناء والأشغال العمومية: تكوينات مؤهِّلة داخل المؤسسة أو خارجها.',
        href: '/formation',
      },
      {
        id: 'organisation',
        size: 'large',
        icon: 'organization',
        title: 'هيكلة مؤسستكم وقيادة الأداء',
        text: 'الهيكل التنظيمي، العمليات، الإجراءات، لوحات القيادة: تنظيم واضح ونتائج قابلة للقياس.',
        href: '/expertises/accompagnement-des-organisations',
      },
      {
        id: 'qualite-securite',
        size: 'small',
        icon: 'safety',
        title: 'التحكم في الجودة والسلامة',
        text: 'أنظمة الجودة، الصحة والسلامة المهنية، البيئة.',
        href: '/formation/catalogue-et-sessions',
      },
    ],
  },
  audiences: {
    eyebrow: 'لمن',
    title: 'أنتم…',
    items: [
      {
        id: 'entreprise',
        title: 'مؤسسة اقتصادية',
        text: 'مؤسسات صغيرة ومتوسطة، مجمعات صناعية، مؤسسات البناء: طوّروا تنظيمكم وجودتكم وكفاءاتكم.',
        link: { label: 'حلول للمؤسسات', href: '/expertises' },
        image: '/images/vous-etes-entreprise.svg',
      },
      {
        id: 'organisme-public',
        title: 'هيئة عمومية',
        text: 'إدارات ومؤسسات عمومية: مرافقة ملائمة لإطار الصفقات العمومية.',
        link: {
          label: 'مرافقة الهيئات العمومية',
          href: '/expertises/accompagnement-des-organisations',
        },
        image: '/images/vous-etes-organisme-public.svg',
      },
    ],
  },
  approach: {
    eyebrow: 'منهجيتنا',
    title: 'ثلاث مراحل، من التشخيص إلى النتائج.',
    lead: 'كل مهمة تتبع نفس المسار: الفهم، البناء، الترسيخ.',
    steps: [
      {
        title: 'الفهم',
        text: 'مقابلات، زيارات ميدانية وتحليل للوثائق: نضع معكم تشخيصًا مشتركًا لوضعيتكم وأولوياتكم.',
      },
      {
        title: 'البناء',
        text: 'نصمم مع فرقكم الحلول والأدوات ومخطط العمل، بما يلائم سياقكم وإمكانياتكم.',
      },
      {
        title: 'الترسيخ',
        text: 'التكوين والمرافقة ومؤشرات المتابعة: تغييرات تدوم، وفرق تتحكم فيها.',
      },
    ],
  },
  figures: {
    eyebrow: 'بالأرقام',
    title: 'OPEM في أرقام',
    provisional: true,
    note: 'أرقام مؤقتة في انتظار مصادقة OPEM.',
    items: [
      { value: 5, label: 'مجالات خبرة' },
      { value: 15, label: 'سنة من الخبرة' },
      { value: 120, prefix: '+', label: 'مؤسسة مرافَقة' },
      { value: 2000, prefix: '+', label: 'شخص تم تكوينه' },
    ],
  },
  sectors: {
    eyebrow: 'القطاعات',
    title: 'نشاطكم، أساليبنا.',
    lead: 'صناعة أو خدمات أو إدارة: نكيّف أدواتنا مع قطاعكم.',
    listLabel: 'قطاعات التدخل',
    provisional: true,
    note: 'قائمة مؤقتة، في انتظار تأكيد OPEM.',
    items: [
      'البناء والأشغال العمومية والري',
      'الصناعة',
      'الطاقة والمناجم',
      'الصناعات الغذائية',
      'الصحة',
      'النقل واللوجستيك',
      'الخدمات',
      'الإدارة العمومية',
      'التعليم والتكوين',
    ],
  },
  trainings: {
    eyebrow: 'الأجندة',
    title: 'التكوينات القادمة',
    all: { label: 'الرزنامة الكاملة', href: '/formation' },
    register: 'التسجيل',
    provisional: true,
    note: 'رزنامة تقديرية، في انتظار تأكيد OPEM.',
    empty: 'سيتم الإعلان عن الدورات القادمة قريبًا.',
    items: [
      {
        id: 'iso-9001',
        date: '2026-11-16',
        title: 'إدارة الجودة وفق ISO 9001',
        format: 'حضوري · الجزائر العاصمة · 3 أيام',
        href: '/formation/catalogue-et-sessions',
      },
      {
        id: 'iso-45001',
        date: '2026-11-24',
        title: 'الصحة والسلامة المهنية (ISO 45001)',
        format: 'حضوري · الجزائر العاصمة · يومان',
        href: '/formation/catalogue-et-sessions',
      },
      {
        id: 'leadership',
        date: '2026-12-07',
        title: 'تسيير الفرق والقيادة',
        format: 'حضوري · الجزائر العاصمة · يومان',
        href: '/formation/catalogue-et-sessions',
      },
      {
        id: 'projets-btph',
        date: '2026-12-14',
        title: 'تسيير مشاريع البناء والأشغال العمومية',
        format: 'حضوري · الجزائر العاصمة · 4 أيام',
        href: '/formation/catalogue-et-sessions',
      },
    ],
  },
  testimonials: {
    eyebrow: 'شهادات',
    title: 'ما يحتفظ به من نرافقهم.',
    lead: 'مديرون ومسؤولو جودة ورؤساء مصالح يروون ما تغيّر في مؤسساتهم.',
    listLabel: 'اختيار شهادة',
    previous: 'الشهادة السابقة',
    next: 'الشهادة التالية',
    counter: 'الشهادة {current} من {total}',
    provisional: true,
    note: 'شهادات على سبيل المثال، تُستبدل بشهادات حقيقية تُنشر بموافقة أصحابها.',
    link: { label: 'اطّلعوا على مهامنا وإنجازاتنا', href: '/missions' },
    items: [
      {
        id: 'formation',
        domain: 'التكوين',
        icon: 'company',
        quote:
          'انطلقت التكوينات من وضعيات عملنا الفعلية. ومنذ اليوم التالي، طبّقت فرقنا ما تعلّمته.',
        name: '[الاسم في انتظار التأكيد]',
        role: 'مدير الموارد البشرية [في انتظار التأكيد]',
        organisation: 'مؤسسة صناعية [في انتظار التأكيد]',
      },
      {
        id: 'certification',
        domain: 'الإشهاد',
        icon: 'company',
        quote:
          'أعدّتنا OPEM للتدقيق خطوة بخطوة. وفي اليوم الموعود، كان كل واحد يعرف ما عليه أن يُظهره ولماذا.',
        name: '[الاسم في انتظار التأكيد]',
        role: 'مسؤول الجودة [في انتظار التأكيد]',
        organisation: 'مؤسسة خدمات [في انتظار التأكيد]',
      },
      {
        id: 'accompagnement',
        domain: 'المرافقة',
        icon: 'public',
        quote:
          'كان علينا تنظيم مصلحتنا دون قلب كل شيء. كانت المقاربة واضحة، من التشخيص إلى المتابعة.',
        name: '[الاسم في انتظار التأكيد]',
        role: 'رئيس مصلحة [في انتظار التأكيد]',
        organisation: 'مؤسسة عمومية [في انتظار التأكيد]',
      },
      {
        id: 'etudes',
        domain: 'الدراسات الاستراتيجية',
        icon: 'public',
        quote:
          'وضع التشخيص كلمات على ما كنا نشعر به. واستطعنا أن نقرّر انطلاقًا من الوقائع لا من الانطباعات.',
        name: '[الاسم في انتظار التأكيد]',
        role: 'المدير العام [في انتظار التأكيد]',
        organisation: 'هيئة عمومية [في انتظار التأكيد]',
      },
    ],
  },
  faq: {
    eyebrow: 'أسئلة شائعة',
    title: 'كل ما يجب معرفته قبل البدء.',
    lead: 'إجابات عن الأسئلة التي تُطرح علينا أكثر من غيرها.',
    asideTitle: 'لم تجدوا إجابتكم؟',
    asideText: 'يجيبكم أحد مستشاري OPEM ويوجّهكم نحو المرافقة المناسبة.',
    contact: { label: 'اطرحوا سؤالكم', href: '/contact' },
    provisional: true,
    note: 'إجابات مؤقتة، في انتظار مصادقة OPEM.',
    items: [
      {
        id: 'pour-qui',
        question: 'ما أنواع المؤسسات التي ترافقونها؟',
        answer:
          'المؤسسات الخاصة والهيئات العمومية على حدّ سواء، في كامل التراب الجزائري. ونكيّف المقاربة مع حجم المؤسسة وقطاعها ونقطة انطلاقها.',
      },
      {
        id: 'premier-contact',
        question: 'كيف يتم أول اتصال؟',
        answer:
          'لقاء أول، عبر الهاتف أو في موعد، لفهم حاجتكم. ثم تتلقون عرضًا مكيّفًا: الأهداف والمقاربة والرزنامة. شروط هذا اللقاء الأول [في انتظار التأكيد].',
      },
      {
        id: 'certification',
        question: 'هل يمكنكم مرافقتنا حتى الحصول على شهادة ISO؟',
        answer:
          'نعم: التشخيص، ووضع النظام، وتكوين الفرق، والتحضير للتدقيق. أما الشهادة نفسها فتمنحها هيئة إشهاد مستقلة تختارونها.',
      },
      {
        id: 'sur-mesure',
        question: 'هل تقترحون تكوينات حسب الطلب في مقرّاتنا؟',
        answer:
          'إضافة إلى دورات رزنامتنا، يمكننا إعداد تكوين انطلاقًا من وضعيات عملكم وتنشيطه لديكم [الكيفيات في انتظار التأكيد].',
      },
      {
        id: 'attestation',
        question: 'هل يتحصّل المشاركون على شهادة؟',
        answer:
          'يتحصّل كل مشارك على شهادة تكوين [في انتظار التأكيد: التسمية وشروط التسليم والاعتمادات المحتملة].',
      },
      {
        id: 'duree',
        question: 'كم تدوم المرافقة؟',
        answer:
          'يتوقف ذلك على نقطة انطلاقكم وحجم المؤسسة والهدف المنشود. وتُحدَّد المدة في عرضنا بعد التشخيص.',
      },
    ],
  },
};

export const homeContent: Record<Lang, HomeContent> = { fr, ar };
