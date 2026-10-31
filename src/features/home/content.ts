import type { Lang } from '@/i18n/language';

/* ==========================================================================
   Contenu de la page d'accueil (français et arabe).
   Un seul fichier à modifier pour changer les textes.

   ⚠ À FAIRE VALIDER PAR OPEM avant la mise en ligne :
   - textes d'accroche et descriptions (propositions) ;
   - CHIFFRES CLÉS : valeurs provisoires (question 12 à la Gérante) ;
   - SECTEURS : liste provisoire ;
   - PROCHAINES FORMATIONS : dates et intitulés provisoires ;
   - AUTODIAGNOSTIC 7S : questions, réponses, niveaux et domaines associés ;
   - traductions arabes (relecture par une personne arabophone).
   Tant que `provisional` vaut true, une mention « à confirmer » s'affiche
   sous la section concernée, pour ne jamais présenter un chiffre inventé comme réel.
   ========================================================================== */

export type NeedIcon =
  'strategy' | 'organization' | 'certification' | 'training' | 'coaching' | 'safety';
export type MarkerIcon = 'domains' | 'sectors' | 'map';
export type AudienceIcon = 'public' | 'company';
export type CommitmentIcon = 'relay' | 'lock' | 'field';
/** Les sept leviers du modèle des 7S (McKinsey), mesurés par l'autodiagnostic de l'accroche. */
export type DiagnosticAxis =
  'strategie' | 'structure' | 'systemes' | 'valeurs' | 'style' | 'personnel' | 'competences';
/** Profils de l'autodiagnostic 7S (règles dans diagnosticScore.ts). */
export type DiagnosticProfile =
  'alignee' | 'fondation' | 'cap' | 'mecanique' | 'talents' | 'mouvement';
/** Questions sur l'organisation, posées avant les 7 leviers. */
export type DiagnosticContextId = 'secteur' | 'effectif' | 'fonction';

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
   * Bandeau « Autodiagnostic 7S » : titre, texte et boutons à gauche ; à droite, à la place de la
   * vidéo, une carte d'invitation (radar des 7S qui respire). « Commencer » ouvre le diagnostic
   * en plein écran : une question par levier du modèle des 7S de McKinsey, le radar se dessine
   * en direct, puis le profil de l'organisation. Calculé dans le navigateur (diagnosticScore.ts),
   * sans IA ni envoi. Réponses rangées de la moins à la plus avancée (0 à 3 points).
   */
  heroDiagnostic: {
    label: string;
    duration: string;
    /** Carte de l'accroche : le diagnostic présenté comme une aide pour s'orienter. */
    intro: { title: string; text: string; start: string };
    /** Description du radar pour les lecteurs d'écran. */
    modelLabel: string;
    /** « Levier {current} sur {total} » */
    progress: string;
    back: string;
    /** Touches affichées devant les réponses (et acceptées au clavier, avec 1 à 4). */
    keys: [string, string, string, string];
    close: string;
    /**
     * Avant les 7 leviers : quelques questions sur l'organisation. Elles nuancent l'analyse
     * (effectif) et sont transmises avec la demande de rappel.
     */
    context: {
      label: string;
      /** « Question {current} sur {total} » (lecteurs d'écran). */
      progress: string;
      questions: {
        id: DiagnosticContextId;
        /** Mot géant de l'écran. */
        label: string;
        text: string;
        choices: { id: string; label: string }[];
      }[];
    };
    /** Une question par levier, dans l'ordre du modèle ; `id` est le levier. */
    questions: { id: DiagnosticAxis; text: string; choices: { id: string; label: string }[] }[];
    /** Nom court (radar), nom complet (listes) et domaine OPEM qui y répond. */
    axes: Record<DiagnosticAxis, { label: string; title: string; domain: Link }>;
    result: {
      label: string;
      profileLabel: string;
      /** Sous le pourcentage global. */
      scoreLabel: string;
      /** Points d'un levier, pour les lecteurs d'écran : « {score} sur 3 ». */
      axisScore: string;
      /** Légende du radar : forme pleine, forme en pointillés. */
      yours: string;
      ideal: string;
      weakTitle: string;
      noWeak: string;
      startTitle: string;
      /** Lien de rappel : les réponses y sont ajoutées en paramètres (pour le futur formulaire). */
      callback: Link;
      restart: string;
    };
    /** Nom et portrait de chaque profil. */
    profiles: Record<DiagnosticProfile, { name: string; text: string }>;
    /**
     * Lecture du résultat, composée selon les réponses : niveau de maturité (par quart du
     * total), équilibre cadre / humain ({hard}, {soft} : pourcentages), point d'appui ({axis})
     * et une phrase selon l'effectif (clé : identifiant de la réponse).
     */
    analysis: {
      title: string;
      /** « Niveau {level} sur 4 » */
      levelLabel: string;
      levels: { name: string; text: string }[];
      hard: { label: string; hint: string };
      soft: { label: string; hint: string };
      balance: { hard: string; soft: string; even: string };
      strength: string;
      noStrength: string;
      sizes: Record<string, string>;
    };
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
   * Section « Ce qui nous distingue », juste sous l'accroche : trois engagements, chacun avec
   * des preuves concrètes et, en bas de carte, ce qu'on trouve souvent ailleurs.
   * Engagements proposés : mention « à confirmer » tant que provisional vaut true.
   */
  commitments: {
    eyebrow: string;
    title: string;
    /** Titre de la version « L'essentiel », sur deux lignes (la seconde en bleu OPEM). */
    heading: [string, string];
    lead: string;
    /** Étiquette au-dessus des preuves concrètes. */
    proofLabel: string;
    /** Étiquette de la comparaison, en bas de carte. */
    elsewhereLabel: string;
    provisional: boolean;
    note: string;
    items: {
      id: string;
      icon: CommitmentIcon;
      title: string;
      text: string;
      proofs: string[];
      elsewhere: string;
      /** Version « L'essentiel » : quelques mots et une phrase. */
      short: { title: string; text: string };
    }[];
  };
  /**
   * Section « Nos domaines », sous « Ce qui nous distingue » : un onglet par domaine, un panneau qui
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
      /**
       * Illustration 16:9 (métaphore du domaine, fond bleu nuit, une pièce ambre), utilisée par
       * la rangée retenue. Une version de 800 px de large existe à côté (« -800.webp »).
       */
      illustration: string;
      /** Vignette carrée tirée de l'illustration (l'objet ambre), pour la version « en coin ». */
      emblem: string;
    }[];
  };
  /**
   * Section « Éclairages et actualités » (sous « Nos domaines ») : cartes à la manière des
   * pages « Insights » des grands cabinets. Contenus d'exemple tant que `provisional` vaut
   * true : à remplacer par les vraies publications d'OPEM (plus tard, depuis WordPress).
   */
  /**
   * Bandeau « Intelligence artificielle appliquée », sous les domaines : titre, texte, bouton,
   * et trois temps (diagnostic, formation, intégration) dans un cadre à filets.
   */
  ai: {
    eyebrow: string;
    title: string;
    text: string;
    cta: Link;
    /**
     * Illustration (une porte ouverte sur l'organisation, l'étoile ambre qui entre), fond bleu
     * nuit ; une version de 700 px de large existe à côté (« -700.webp »).
     */
    illustration: string;
    /** Nom de la liste des trois temps (lecteurs d'écran). */
    stepsLabel: string;
    steps: { label: string; text: string }[];
  };
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
  /** Chiffres clés : sous le titre de l'accroche (et dans la bande KeyFigures, hors accueil). */
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
    /** Version « Prochaines sessions » : nom de la liste (lecteurs d'écran). */
    listLabel: string;
    /**
     * date au format AAAA-MM-JJ ; les sessions passées sont masquées automatiquement.
     * topic : thème affiché en étiquette sur la carte.
     */
    items: {
      id: string;
      date: string;
      topic: string;
      title: string;
      format: string;
      href: string;
    }[];
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
    subtitle: 'OPEM accompagne les organisations, du diagnostic stratégique à la certification.',
    primary: { label: 'Demander un devis', href: '/contact' },
    secondary: { label: 'Voir les formations', href: '/formation' },
  },
  heroCycle: {
    headline: ['Faire progresser', 'votre organisation.'],
    intro:
      'Des décisions éclairées. Des processus structurés. Des exigences maîtrisées. Des compétences développées. Un leadership affirmé. Une communication qui fait la différence.',
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
    headline: ['Ce qui fait exceller', 'votre organisation.'],
    intro:
      'Des décisions éclairées. Des processus structurés. Des exigences maîtrisées. Des compétences développées. Un leadership affirmé. Une communication qui fait la différence.',
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
      'Diagnostic, structuration, formation et certification : OPEM accompagne les organisations avec méthode, à chaque étape de leur progression.',
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
  // Espaces insécables avant « ? » : le point d'interrogation ne passe jamais seul à la ligne.
  heroDiagnostic: {
    label: 'Autodiagnostic 3 minutes chrono',
    duration: '.',
    intro: {
      title: 'Sept leviers font votre performance. Un seul suffit à la freiner.',
      text: '.',
      start: 'Faire le test',
    },
    modelLabel:
      'Le modèle des 7S : stratégie, structure, systèmes, valeurs partagées, style, personnel et compétences.',
    progress: 'Levier {current} sur {total}',
    back: 'Question précédente',
    keys: ['A', 'B', 'C', 'D'],
    close: 'Quitter',
    context: {
      label: 'Votre organisation',
      progress: 'Question {current} sur {total} sur votre organisation',
      questions: [
        {
          id: 'secteur',
          label: 'Secteur',
          text: 'Dans quel secteur évolue votre organisation ?',
          choices: [
            { id: 'btph', label: 'BTPH' },
            { id: 'industrie', label: 'Industrie' },
            { id: 'energie', label: 'Énergie et mines' },
            { id: 'agroalimentaire', label: 'Agroalimentaire' },
            { id: 'sante', label: 'Santé' },
            { id: 'transport', label: 'Transport et logistique' },
            { id: 'services', label: 'Services' },
            { id: 'administration', label: 'Administration publique' },
            { id: 'enseignement', label: 'Enseignement et formation' },
            { id: 'autre', label: 'Autre secteur' },
          ],
        },
        {
          id: 'effectif',
          label: 'Effectif',
          text: 'Combien de personnes compte votre organisation ?',
          choices: [
            { id: 'moins-50', label: 'Moins de 50 personnes' },
            { id: '50-249', label: 'De 50 à 249 personnes' },
            { id: '250-999', label: 'De 250 à 999 personnes' },
            { id: '1000-plus', label: '1 000 personnes et plus' },
          ],
        },
        {
          id: 'fonction',
          label: 'Fonction',
          text: 'Quelle est votre fonction ?',
          choices: [
            { id: 'direction', label: 'Direction générale' },
            { id: 'rh', label: 'Ressources humaines' },
            { id: 'qualite', label: 'Qualité, HSE ou organisation' },
            { id: 'encadrement', label: 'Autre fonction d’encadrement' },
          ],
        },
      ],
    },
    questions: [
      {
        id: 'strategie',
        text: 'Votre stratégie est-elle claire et partagée par tous ?',
        choices: [
          { id: 'implicite', label: 'Elle reste implicite' },
          { id: 'direction', label: 'Claire pour la direction seulement' },
          { id: 'ecrite', label: 'Écrite et diffusée' },
          { id: 'pilotee', label: 'Partagée et suivie avec des indicateurs' },
        ],
      },
      {
        id: 'structure',
        text: 'Chacun sait-il qui décide et qui fait quoi ?',
        choices: [
          { id: 'flou', label: 'Les rôles restent flous' },
          { id: 'organigramme', label: 'Un organigramme existe, peu appliqué' },
          { id: 'definis', label: 'Rôles et responsabilités définis' },
          { id: 'revus', label: 'Définis, et revus quand l’organisation évolue' },
        ],
      },
      {
        id: 'systemes',
        text: 'Vos processus et procédures sont-ils écrits et appliqués ?',
        choices: [
          { id: 'non', label: 'Chacun fait à sa façon' },
          { id: 'en-partie', label: 'En partie' },
          { id: 'essentiel', label: 'Oui, pour l’essentiel' },
          { id: 'ameliores', label: 'Oui, mesurés et améliorés en continu' },
        ],
      },
      {
        id: 'valeurs',
        text: 'Vos équipes partagent-elles les mêmes valeurs et la même vision ?',
        choices: [
          { id: 'rarement', label: 'Rarement' },
          { id: 'certaines', label: 'Certaines équipes seulement' },
          { id: 'ensemble', label: 'Oui, dans l’ensemble' },
          { id: 'decisions', label: 'Oui, elles guident nos décisions' },
        ],
      },
      {
        id: 'style',
        text: 'Comment vos managers dirigent-ils leurs équipes ?',
        choices: [
          { id: 'controle', label: 'Surtout par le contrôle' },
          { id: 'chacun', label: 'Chacun à sa manière' },
          { id: 'ecoute', label: 'Avec écoute et délégation' },
          { id: 'autonomie', label: 'En développant l’autonomie de chacun' },
        ],
      },
      {
        id: 'personnel',
        text: 'Avez-vous les bonnes personnes aux bons postes ?',
        choices: [
          { id: 'souvent-non', label: 'Souvent, non' },
          { id: 'parfois', label: 'Parfois' },
          { id: 'plupart', label: 'Le plus souvent' },
          { id: 'talents', label: 'Oui, avec une gestion des talents suivie' },
        ],
      },
      {
        id: 'competences',
        text: 'Comment développez-vous les compétences de vos équipes ?',
        choices: [
          { id: 'au-cas-par-cas', label: 'Au cas par cas' },
          { id: 'demandes', label: 'Selon les demandes de chacun' },
          { id: 'plan-annuel', label: 'Avec un plan de formation annuel' },
          { id: 'evalue', label: 'Avec un plan relié aux compétences, et évalué' },
        ],
      },
    ],
    axes: {
      strategie: {
        label: 'Stratégie',
        title: 'Stratégie',
        domain: { label: 'Études stratégiques', href: '/expertises/etudes-strategiques' },
      },
      structure: {
        label: 'Structure',
        title: 'Structure et rôles',
        domain: {
          label: 'Accompagnement des organisations',
          href: '/expertises/accompagnement-des-organisations',
        },
      },
      systemes: {
        label: 'Systèmes',
        title: 'Systèmes et processus',
        domain: {
          label: 'Certification, accréditation, labellisation',
          href: '/expertises/certification-et-accreditation',
        },
      },
      valeurs: {
        label: 'Valeurs partagées',
        title: 'Valeurs partagées',
        domain: {
          label: 'Communication d’entreprise',
          href: '/expertises/communication-d-entreprise',
        },
      },
      style: {
        label: 'Style',
        title: 'Style de management',
        domain: { label: 'Coaching professionnel', href: '/expertises/coaching-professionnel' },
      },
      personnel: {
        label: 'Personnel',
        title: 'Personnel',
        domain: {
          label: 'Accompagnement des organisations',
          href: '/expertises/accompagnement-des-organisations',
        },
      },
      competences: {
        label: 'Compétences',
        title: 'Compétences',
        domain: { label: 'Formations qualifiantes', href: '/formation' },
      },
    },
    result: {
      label: 'Votre empreinte 7S',
      profileLabel: 'Votre profil',
      scoreLabel: 'Maturité',
      axisScore: '{score} sur 3',
      yours: 'Votre organisation',
      ideal: 'Organisation alignée',
      weakTitle: 'À renforcer',
      noWeak: 'Aucun levier faible dans vos réponses.',
      startTitle: 'Commencer par',
      callback: { label: 'Être rappelé avec ce résultat', href: '/contact' },
      restart: 'Refaire le diagnostic',
    },
    // Noms et portraits proposés, à faire valider par OPEM.
    profiles: {
      alignee: {
        name: 'L’organisation alignée',
        text: 'Vos 7 leviers tirent dans le même sens.',
      },
      fondation: {
        name: 'L’organisation en fondation',
        text: 'Tout est à construire : le meilleur moment pour bien faire.',
      },
      cap: {
        name: 'Le navire sans cap',
        text: 'Tout tourne bien. Reste à savoir vers où.',
      },
      mecanique: {
        name: 'La belle mécanique',
        text: 'Le cadre est solide. Il manque l’élan humain.',
      },
      talents: {
        name: 'Le talent sans charpente',
        text: 'L’énergie est là. Il manque le cadre.',
      },
      mouvement: {
        name: 'L’organisation en mouvement',
        text: 'Les bases sont là. Quelques réglages, et tout s’accélère.',
      },
    },
    // Lecture proposée, à faire valider par OPEM.
    analysis: {
      title: 'Notre lecture',
      levelLabel: 'Niveau {level} sur 4',
      levels: [
        {
          name: 'Initial',
          text: 'L’organisation tient surtout grâce à l’énergie de quelques personnes. Quelques bases simples auront un effet rapide.',
        },
        {
          name: 'En structuration',
          text: 'Des bases existent, mais elles restent partielles ou peu appliquées : c’est le moment de les consolider.',
        },
        {
          name: 'Maîtrisé',
          text: 'Vos fondamentaux sont en place. L’enjeu est maintenant de les faire vivre au quotidien et de les relier entre eux.',
        },
        {
          name: 'Avancé',
          text: 'Votre organisation est structurée et cohérente. La priorité : entretenir cette avance et préparer la suite.',
        },
      ],
      hard: { label: 'Le cadre', hint: 'Stratégie, structure, systèmes' },
      soft: { label: 'L’humain', hint: 'Valeurs, style, personnel, compétences' },
      balance: {
        hard: 'Le cadre ({hard}) devance l’humain ({soft}) : les règles existent, mais les équipes ne se les sont pas encore appropriées.',
        soft: 'L’humain ({soft}) devance le cadre ({hard}) : l’engagement est là, mais il repose sur les personnes plus que sur l’organisation.',
        even: 'Le cadre ({hard}) et l’humain ({soft}) sont au même niveau : ils progresseront ensemble, sans que l’un freine l’autre.',
      },
      strength: 'Votre point d’appui : {axis}. C’est sur lui que reposera la suite.',
      noStrength:
        'Aucun levier n’est encore solide : mieux vaut avancer pas à pas, un chantier à la fois.',
      sizes: {
        'moins-50':
          'À moins de 50 personnes, tout repose souvent sur la direction : clarifier les rôles et écrire l’essentiel libère du temps pour se développer.',
        '50-249':
          'Entre 50 et 249 personnes, l’informel ne suffit plus : rôles, processus et managers intermédiaires deviennent décisifs.',
        '250-999':
          'Entre 250 et 999 personnes, l’enjeu est la cohérence entre services : une même stratégie, déclinée et suivie partout.',
        '1000-plus':
          'Au-delà de 1 000 personnes, tout se joue dans l’alignement : communication interne, pilotage par indicateurs et développement des managers.',
      },
    },
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
  commitments: {
    eyebrow: 'Ce qui nous distingue',
    title: 'Un cabinet qui rend vos équipes autonomes.',
    heading: ['Notre réussite :', 'des équipes qui gagnent en autonomie.'],
    lead: 'Trois engagements guident chacune de nos missions, du premier échange au dernier livrable.',
    proofLabel: 'Concrètement',
    elsewhereLabel: 'Ailleurs, souvent :',
    provisional: true,
    note: 'Engagements proposés, à confirmer par OPEM.',
    items: [
      {
        id: 'chez-vous',
        icon: 'relay',
        title: 'Vos équipes prennent le relais.',
        text: 'Méthodes, outils et documents vous sont remis, et vos équipes sont formées pour les faire vivre. Mission après mission, votre organisation gagne en autonomie.',
        proofs: [
          'Des livrables remis dans des formats modifiables',
          'Vos équipes formées à les utiliser',
          'Aucun outil propriétaire qui vous lie au cabinet',
        ],
        elsewhere: 'des livrables que seul le consultant sait faire vivre.',
        short: {
          title: 'Vos équipes prennent le relais',
          text: 'Formées et outillées, elles font vivre la démarche.',
        },
      },
      {
        id: 'confidentialite',
        icon: 'lock',
        title: 'Vos données restent confidentielles.',
        text: 'Ce que vous nous confiez sert votre mission, et elle seule. Documents, chiffres et échanges sont protégés, et rien n’est cité sans votre accord écrit.',
        proofs: [
          'Un engagement de confidentialité signé avant tout échange de documents',
          'Un accès limité aux consultants de la mission',
          'Aucune référence citée sans votre accord',
        ],
        elsewhere: 'des informations sensibles qui circulent sans cadre.',
        short: {
          title: 'Vos données protégées',
          text: 'Rien n’est partagé sans votre accord écrit.',
        },
      },
      {
        id: 'terrain',
        icon: 'field',
        title: 'Des spécialistes qui connaissent le terrain.',
        text: 'Nos consultants et formateurs sont des praticiens : ils connaissent les secteurs qu’ils accompagnent, leurs métiers et leurs contraintes réelles.',
        proofs: [
          'Des experts issus de vos secteurs d’activité',
          'Des solutions adaptées à vos contraintes réelles',
          'Un réseau de plus de 165 experts mobilisables',
        ],
        elsewhere: 'des recommandations théoriques, loin de la réalité du terrain.',
        short: {
          title: 'Des spécialistes du terrain',
          text: 'Ils connaissent vos métiers et vos contraintes.',
        },
      },
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
        text: 'Nos études mettent en perspective les évolutions des écosystèmes, les dynamiques des organisations et les opportunités de développement, au service de vos décisions stratégiques.',
        points: [
          'Écosystèmes, secteurs et filières',
          'Études économiques et technologiques',
          'Opportunités et faisabilité des projets',
        ],
        href: '/expertises/etudes-strategiques',
        image: '/images/domaines/etudes-strategiques.jpg',
        illustration: '/images/domaines/illustrations/etudes-strategiques.webp',
        emblem: '/images/domaines/emblemes/etudes-strategiques.webp',
      },
      {
        id: 'accompagnement',
        title: 'Accompagnement des organisations',
        text: 'Nous vous accompagnons, du diagnostic à la mise en œuvre.',
        points: ['Diagnostic', 'Mise en œuvre accompagnée', 'Transfert de compétences'],
        href: '/expertises/accompagnement-des-organisations',
        image: '/images/domaines/accompagnement.jpg?v=2',
        illustration: '/images/domaines/illustrations/accompagnement.webp',
        emblem: '/images/domaines/emblemes/accompagnement.webp',
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
        image: '/images/domaines/formations.jpg?v=2',
        illustration: '/images/domaines/illustrations/formations.webp',
        emblem: '/images/domaines/emblemes/formations.webp',
      },
      {
        id: 'coaching',
        title: 'Coaching professionnel',
        text: 'Un accompagnement individuel ou d’équipe [à confirmer], en toute confidentialité.',
        points: ['Formats [à confirmer]', 'Confidentialité', 'Premier échange discret'],
        href: '/expertises/coaching-professionnel',
        image: '/images/domaines/coaching.jpg',
        illustration: '/images/domaines/illustrations/coaching.webp',
        emblem: '/images/domaines/emblemes/coaching.webp',
      },
      {
        id: 'communication',
        title: 'Communication d’entreprise',
        text: 'Nous construisons votre image et vos messages, en interne comme auprès de vos partenaires.',
        points: ['Image et identité', 'Communication interne', 'Relations institutionnelles'],
        href: '/expertises/communication-d-entreprise',
        image: '/images/domaines/communication.jpg',
        illustration: '/images/domaines/illustrations/communication.webp',
        emblem: '/images/domaines/emblemes/communication.webp',
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
        illustration: '/images/domaines/illustrations/certification.webp',
        emblem: '/images/domaines/emblemes/certification.webp',
      },
    ],
  },
  ai: {
    eyebrow: 'Intelligence artificielle appliquée',
    title: 'L’IA entre dans l’entreprise par la porte de l’organisation.',
    text: 'Avant de parler d’outils, nous regardons comment votre entreprise fonctionne réellement. L’IA n’intervient que là où elle crée de la valeur, avec des données protégées dès le départ.',
    cta: { label: 'Découvrir l’approche', href: '/expertises/intelligence-artificielle' },
    illustration: '/images/ia/porte.webp',
    stepsLabel: 'Notre démarche en trois temps',
    steps: [
      { label: 'Diagnostic', text: 'Repérer où l’IA crée réellement de la valeur' },
      { label: 'Formation', text: 'Exploiter l’IA au quotidien, côté métier' },
      { label: 'Intégration', text: 'Déployer, avec des données sous contrôle' },
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
        image: '/images/domaines/formations.jpg?v=2',
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
    { icon: 'domains', label: '6 domaines d’expertise' },
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
    provisional: false,
    note: 'Chiffres communiqués par OPEM.',
    items: [
      { value: 7, prefix: '+', label: 'ans d’expérience cumulée' },
      { value: 62, prefix: '+', label: 'organisations accompagnées' },
      { value: 1500, prefix: '+', label: 'cadres et agents formés' },
      { value: 165, prefix: '+', label: 'experts mobilisables' },
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
    title: 'Les prochaines sessions',
    listLabel: 'Sessions à venir',
    all: { label: 'Tout le calendrier', href: '/formation' },
    register: 'S’inscrire',
    provisional: true,
    note: '.',
    empty: 'Les prochaines sessions seront annoncées très bientôt.',
    items: [
      {
        id: 'iso-9001',
        topic: 'Qualité',
        date: '2026-11-16',
        title: 'Management de la qualité selon l’ISO 9001',
        format: 'Présentiel · Alger · 3 jours',
        href: '/formation/catalogue-et-sessions',
      },
      {
        id: 'iso-45001',
        topic: 'HSE',
        date: '2026-11-24',
        title: 'Santé et sécurité au travail (ISO 45001)',
        format: 'Présentiel · Alger · 2 jours',
        href: '/formation/catalogue-et-sessions',
      },
      {
        id: 'leadership',
        topic: 'Management',
        date: '2026-12-07',
        title: 'Management d’équipe et leadership',
        format: 'Présentiel · Alger · 2 jours',
        href: '/formation/catalogue-et-sessions',
      },
      {
        id: 'projets-btph',
        topic: 'BTPH',
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
        id: 'etudes',
        domain: 'Études stratégiques',
        icon: 'public',
        quote:
          'Le diagnostic a mis des mots sur ce que nous ressentions. Nous avons pu décider à partir de faits, et non d’impressions.',
        name: '[Nom à confirmer]',
        role: 'Directeur général [à confirmer]',
        organisation: 'Organisme public [à confirmer]',
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
        id: 'coaching',
        domain: 'Coaching',
        icon: 'company',
        quote:
          'Le coaching m’a aidé à prendre du recul. Mon équipe a vu la différence dans ma façon de décider et de déléguer.',
        name: '[Nom à confirmer]',
        role: 'Directrice d’unité [à confirmer]',
        organisation: 'Entreprise industrielle [à confirmer]',
      },
      {
        id: 'communication',
        domain: 'Communication',
        icon: 'public',
        quote:
          'Nos messages partaient dans tous les sens. Aujourd’hui, nos équipes et nos partenaires entendent la même chose, au même moment.',
        name: '[Nom à confirmer]',
        role: 'Responsable de la communication [à confirmer]',
        organisation: 'Établissement public [à confirmer]',
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
    subtitle: 'ترافق OPEM المؤسسات، من التشخيص الاستراتيجي إلى الحصول على الشهادات.',
    primary: { label: 'اطلب عرض سعر', href: '/contact' },
    secondary: { label: 'اكتشف التكوينات', href: '/formation' },
  },
  heroCycle: {
    headline: ['نرتقي', 'بأداء مؤسستكم.'],
    intro: 'الهيكلة، التكوين، الإشهاد: ترافق OPEM المؤسسات، من التشخيص إلى الحصول على الشهادة.',
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
    headline: ['ما يجعل مؤسستكم', 'تتميّز.'],
    intro:
      'قرارات مستنيرة. مسارات منظّمة. متطلبات متحكَّم فيها. كفاءات مطوَّرة. قيادة راسخة. اتصال يصنع الفرق.',
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
      'التشخيص، الهيكلة، التكوين والإشهاد: ترافق OPEM المؤسسات بمنهجية، في كل مرحلة من مراحل تطورها.',
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
  // Mêmes identifiants qu'en français : seuls les libellés changent.
  heroDiagnostic: {
    label: 'تشخيص ذاتي 7S',
    duration: '10 أسئلة · لا يُرسَل شيء',
    intro: {
      title: 'من أين نبدأ؟',
      text: 'قيّموا وضعكم في دقيقتين، ونحن نوجّهكم.',
      start: 'ابدأوا الاختبار',
    },
    modelLabel:
      'نموذج 7S: الاستراتيجية، الهيكل، الأنظمة، القيم المشتركة، الأسلوب، الأفراد والكفاءات.',
    progress: 'الرافعة {current} من {total}',
    back: 'السؤال السابق',
    keys: ['1', '2', '3', '4'],
    close: 'خروج',
    context: {
      label: 'مؤسستكم',
      progress: 'السؤال {current} من {total} حول مؤسستكم',
      questions: [
        {
          id: 'secteur',
          label: 'القطاع',
          text: 'في أي قطاع تنشط مؤسستكم؟',
          choices: [
            { id: 'btph', label: 'البناء والأشغال العمومية والري' },
            { id: 'industrie', label: 'الصناعة' },
            { id: 'energie', label: 'الطاقة والمناجم' },
            { id: 'agroalimentaire', label: 'الصناعات الغذائية' },
            { id: 'sante', label: 'الصحة' },
            { id: 'transport', label: 'النقل واللوجستيك' },
            { id: 'services', label: 'الخدمات' },
            { id: 'administration', label: 'الإدارة العمومية' },
            { id: 'enseignement', label: 'التعليم والتكوين' },
            { id: 'autre', label: 'قطاع آخر' },
          ],
        },
        {
          id: 'effectif',
          label: 'عدد العمال',
          text: 'كم عدد العاملين في مؤسستكم؟',
          choices: [
            { id: 'moins-50', label: 'أقل من 50 عاملًا' },
            { id: '50-249', label: 'من 50 إلى 249 عاملًا' },
            { id: '250-999', label: 'من 250 إلى 999 عاملًا' },
            { id: '1000-plus', label: '1000 عامل فأكثر' },
          ],
        },
        {
          id: 'fonction',
          label: 'الوظيفة',
          text: 'ما هي وظيفتكم؟',
          choices: [
            { id: 'direction', label: 'الإدارة العامة' },
            { id: 'rh', label: 'الموارد البشرية' },
            { id: 'qualite', label: 'الجودة أو الصحة والسلامة أو التنظيم' },
            { id: 'encadrement', label: 'وظيفة تأطير أخرى' },
          ],
        },
      ],
    },
    questions: [
      {
        id: 'strategie',
        text: 'هل استراتيجيتكم واضحة ومشتركة بين الجميع؟',
        choices: [
          { id: 'implicite', label: 'تبقى ضمنية' },
          { id: 'direction', label: 'واضحة للإدارة فقط' },
          { id: 'ecrite', label: 'مكتوبة ومنشورة' },
          { id: 'pilotee', label: 'مشتركة ومتابَعة بمؤشرات' },
        ],
      },
      {
        id: 'structure',
        text: 'هل يعرف كل واحد من يقرّر ومن يفعل ماذا؟',
        choices: [
          { id: 'flou', label: 'الأدوار غير واضحة' },
          { id: 'organigramme', label: 'هيكل تنظيمي موجود، قليل التطبيق' },
          { id: 'definis', label: 'الأدوار والمسؤوليات محدّدة' },
          { id: 'revus', label: 'محدّدة، وتُراجَع مع تطوّر المؤسسة' },
        ],
      },
      {
        id: 'systemes',
        text: 'هل إجراءاتكم ومسارات عملكم مكتوبة ومطبّقة؟',
        choices: [
          { id: 'non', label: 'كلٌّ يعمل على طريقته' },
          { id: 'en-partie', label: 'جزئيًا' },
          { id: 'essentiel', label: 'نعم، في معظمها' },
          { id: 'ameliores', label: 'نعم، تُقاس وتُحسَّن باستمرار' },
        ],
      },
      {
        id: 'valeurs',
        text: 'هل تتقاسم فرقكم القيم نفسها والرؤية نفسها؟',
        choices: [
          { id: 'rarement', label: 'نادرًا' },
          { id: 'certaines', label: 'بعض الفرق فقط' },
          { id: 'ensemble', label: 'نعم، عمومًا' },
          { id: 'decisions', label: 'نعم، وهي توجّه قراراتنا' },
        ],
      },
      {
        id: 'style',
        text: 'كيف يقود مسيّروكم فرقهم؟',
        choices: [
          { id: 'controle', label: 'بالمراقبة أساسًا' },
          { id: 'chacun', label: 'كلٌّ على طريقته' },
          { id: 'ecoute', label: 'بالإصغاء والتفويض' },
          { id: 'autonomie', label: 'بتنمية استقلالية كل فرد' },
        ],
      },
      {
        id: 'personnel',
        text: 'هل لديكم الأشخاص المناسبون في المناصب المناسبة؟',
        choices: [
          { id: 'souvent-non', label: 'غالبًا لا' },
          { id: 'parfois', label: 'أحيانًا' },
          { id: 'plupart', label: 'في أغلب الأحيان' },
          { id: 'talents', label: 'نعم، مع تسيير متابَع للمواهب' },
        ],
      },
      {
        id: 'competences',
        text: 'كيف تطوّرون كفاءات فرقكم؟',
        choices: [
          { id: 'au-cas-par-cas', label: 'حالة بحالة' },
          { id: 'demandes', label: 'حسب طلبات كل شخص' },
          { id: 'plan-annuel', label: 'بمخطط تكوين سنوي' },
          { id: 'evalue', label: 'بمخطط مرتبط بالكفاءات، ومُقيَّم' },
        ],
      },
    ],
    axes: {
      strategie: {
        label: 'الاستراتيجية',
        title: 'الاستراتيجية',
        domain: { label: 'الدراسات الاستراتيجية', href: '/expertises/etudes-strategiques' },
      },
      structure: {
        label: 'الهيكل',
        title: 'الهيكل والأدوار',
        domain: { label: 'مرافقة المؤسسات', href: '/expertises/accompagnement-des-organisations' },
      },
      systemes: {
        label: 'الأنظمة',
        title: 'الأنظمة والإجراءات',
        domain: {
          label: 'الإشهاد، الاعتماد، العلامات',
          href: '/expertises/certification-et-accreditation',
        },
      },
      valeurs: {
        label: 'القيم المشتركة',
        title: 'القيم المشتركة',
        domain: { label: 'اتصال المؤسسة', href: '/expertises/communication-d-entreprise' },
      },
      style: {
        label: 'الأسلوب',
        title: 'أسلوب الإدارة',
        domain: { label: 'الكوتشينغ المهني', href: '/expertises/coaching-professionnel' },
      },
      personnel: {
        label: 'الأفراد',
        title: 'الأفراد',
        domain: { label: 'مرافقة المؤسسات', href: '/expertises/accompagnement-des-organisations' },
      },
      competences: {
        label: 'الكفاءات',
        title: 'الكفاءات',
        domain: { label: 'التكوينات التأهيلية', href: '/formation' },
      },
    },
    result: {
      label: 'بصمة مؤسستكم 7S',
      profileLabel: 'ملفّكم',
      scoreLabel: 'النضج',
      axisScore: '{score} من 3',
      yours: 'مؤسستكم',
      ideal: 'مؤسسة متناسقة',
      weakTitle: 'للتعزيز',
      noWeak: 'لا توجد رافعة ضعيفة في إجاباتكم.',
      startTitle: 'نبدأ بـ',
      callback: { label: 'اطلب مكالمة بخصوص هذه النتيجة', href: '/contact' },
      restart: 'إعادة التشخيص',
    },
    profiles: {
      alignee: {
        name: 'المؤسسة المتناسقة',
        text: 'رافعاتكم السبع تشدّ في الاتجاه نفسه.',
      },
      fondation: {
        name: 'المؤسسة في طور التأسيس',
        text: 'كل شيء للبناء: أفضل لحظة للبناء الصحيح.',
      },
      cap: {
        name: 'سفينة بلا وجهة',
        text: 'كل شيء يعمل جيدًا. يبقى أن تعرفوا إلى أين.',
      },
      mecanique: {
        name: 'آلة متقنة تنتظر روحها',
        text: 'الإطار متين. ينقصه الزخم البشري.',
      },
      talents: {
        name: 'مواهب بلا هيكل',
        text: 'الطاقة موجودة. ينقصها الإطار.',
      },
      mouvement: {
        name: 'مؤسسة في حركة',
        text: 'الأسس موجودة. بعض التعديلات، ويتسارع كل شيء.',
      },
    },
    analysis: {
      title: 'قراءتنا',
      levelLabel: 'المستوى {level} من 4',
      levels: [
        {
          name: 'مبتدئ',
          text: 'تقوم المؤسسة أساسًا على طاقة بعض الأشخاص. بعض الأسس البسيطة سيكون لها أثر سريع.',
        },
        {
          name: 'في طور الهيكلة',
          text: 'توجد أسس، لكنها تبقى جزئية أو قليلة التطبيق: حان وقت ترسيخها.',
        },
        {
          name: 'متحكَّم فيه',
          text: 'أساسياتكم قائمة. التحدي الآن هو تفعيلها يوميًا وربطها ببعضها.',
        },
        {
          name: 'متقدّم',
          text: 'مؤسستكم مهيكلة ومتناسقة. الأولوية: الحفاظ على هذا التقدم والتحضير لما بعده.',
        },
      ],
      hard: { label: 'الإطار', hint: 'الاستراتيجية، الهيكل، الأنظمة' },
      soft: { label: 'العنصر البشري', hint: 'القيم، الأسلوب، الأفراد، الكفاءات' },
      balance: {
        hard: 'الإطار ({hard}) يسبق العنصر البشري ({soft}): القواعد موجودة، لكن الفرق لم تتبنّها بعد.',
        soft: 'العنصر البشري ({soft}) يسبق الإطار ({hard}): الالتزام موجود، لكنه يقوم على الأشخاص أكثر من التنظيم.',
        even: 'الإطار ({hard}) والعنصر البشري ({soft}) في المستوى نفسه: سيتقدمان معًا، دون أن يعيق أحدهما الآخر.',
      },
      strength: 'نقطة ارتكازكم: {axis}. عليها سيُبنى ما بعدها.',
      noStrength: 'لا توجد بعد رافعة متينة: الأفضل التقدم خطوة خطوة، ورشة واحدة في كل مرة.',
      sizes: {
        'moins-50':
          'في مؤسسة يقل عدد عمالها عن 50، يقع كل شيء غالبًا على عاتق الإدارة: توضيح الأدوار وتدوين الأساسيات يحرّر الوقت للتطور.',
        '50-249':
          'بين 50 و249 عاملًا، لم يعد العمل غير الرسمي كافيًا: الأدوار والعمليات والمسيّرون الوسطاء يصبحون حاسمين.',
        '250-999':
          'بين 250 و999 عاملًا، التحدي هو التناسق بين المصالح: استراتيجية واحدة، تُنفَّذ وتُتابَع في كل مكان.',
        '1000-plus':
          'بعد 1000 عامل، يتوقف كل شيء على التناسق: الاتصال الداخلي، والقيادة بالمؤشرات، وتطوير المسيّرين.',
      },
    },
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
  commitments: {
    eyebrow: 'ما يميّزنا',
    title: 'مكتب يجعل فرقكم مستقلّة.',
    heading: ['نجاحنا:', 'فرق تكتسب استقلاليتها.'],
    lead: 'ثلاثة التزامات توجّه كل مهمة من مهامنا، من أول لقاء إلى آخر وثيقة.',
    proofLabel: 'عمليًا',
    elsewhereLabel: 'في أماكن أخرى غالبًا:',
    provisional: true,
    note: 'التزامات مقترحة، في انتظار تأكيد OPEM.',
    items: [
      {
        id: 'chez-vous',
        icon: 'relay',
        title: 'فرقكم تتسلّم المشعل.',
        text: 'نسلّمكم المناهج والأدوات والوثائق، ونكوّن فرقكم على استعمالها. مهمة بعد مهمة، تكتسب مؤسستكم استقلاليتها.',
        proofs: [
          'وثائق مسلَّمة بصيغ قابلة للتعديل',
          'فرقكم مكوَّنة على استعمالها',
          'لا أدوات خاصة تربطكم بالمكتب',
        ],
        elsewhere: 'وثائق لا يعرف تشغيلها إلا المستشار.',
        short: { title: 'فرقكم تتسلّم المشعل', text: 'مكوَّنة ومجهَّزة، تُبقي المقاربة حيّة.' },
      },
      {
        id: 'confidentialite',
        icon: 'lock',
        title: 'معطياتكم تبقى سرّية.',
        text: 'ما تأتمنوننا عليه يخدم مهمتكم وحدها. الوثائق والأرقام والمبادلات محمية، ولا نذكر شيئًا دون موافقتكم الكتابية.',
        proofs: [
          'التزام بالسرّية يُوقَّع قبل أي تبادل للوثائق',
          'اطّلاع مقتصر على مستشاري المهمة',
          'لا نذكر أي مرجع دون موافقتكم',
        ],
        elsewhere: 'معلومات حسّاسة تتداول دون إطار.',
        short: { title: 'معطياتكم محمية', text: 'لا شيء يُشارَك دون موافقتكم الكتابية.' },
      },
      {
        id: 'terrain',
        icon: 'field',
        title: 'متخصصون يعرفون الميدان.',
        text: 'مستشارونا ومكوّنونا ممارسون: يعرفون القطاعات التي يرافقونها، ومهنها وقيودها الفعلية.',
        proofs: [
          'خبراء من قطاعات نشاطكم',
          'حلول مكيّفة مع قيودكم الفعلية',
          'شبكة تضم أكثر من 165 خبيرًا يمكن تجنيدهم',
        ],
        elsewhere: 'توصيات نظرية بعيدة عن واقع الميدان.',
        short: { title: 'متخصصون في الميدان', text: 'يعرفون مهنكم وقيودكم.' },
      },
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
        text: 'تضع دراساتنا في منظور واضح تطوّر المنظومات الاقتصادية، وديناميكيات المؤسسات وفرص التطوير، في خدمة قراراتكم الاستراتيجية.',
        points: [
          'المنظومات الاقتصادية، القطاعات والشُّعب',
          'الدراسات الاقتصادية والتكنولوجية',
          'فرص المشاريع وجدواها',
        ],
        href: '/expertises/etudes-strategiques',
        image: '/images/domaines/etudes-strategiques.jpg',
        illustration: '/images/domaines/illustrations/etudes-strategiques.webp',
        emblem: '/images/domaines/emblemes/etudes-strategiques.webp',
      },
      {
        id: 'accompagnement',
        title: 'مرافقة المؤسسات',
        text: 'نرافقكم من التشخيص إلى التنفيذ.',
        points: ['التشخيص', 'تنفيذ مرافَق', 'نقل الكفاءات'],
        href: '/expertises/accompagnement-des-organisations',
        image: '/images/domaines/accompagnement.jpg?v=2',
        illustration: '/images/domaines/illustrations/accompagnement.webp',
        emblem: '/images/domaines/emblemes/accompagnement.webp',
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
        image: '/images/domaines/formations.jpg?v=2',
        illustration: '/images/domaines/illustrations/formations.webp',
        emblem: '/images/domaines/emblemes/formations.webp',
      },
      {
        id: 'coaching',
        title: 'الكوتشينغ المهني',
        text: 'مرافقة فردية أو جماعية [في انتظار التأكيد]، في سرية تامة.',
        points: ['الصيغ [في انتظار التأكيد]', 'السرية', 'لقاء أول بكل تكتّم'],
        href: '/expertises/coaching-professionnel',
        image: '/images/domaines/coaching.jpg',
        illustration: '/images/domaines/illustrations/coaching.webp',
        emblem: '/images/domaines/emblemes/coaching.webp',
      },
      {
        id: 'communication',
        title: 'اتصال المؤسسة',
        text: 'نبني صورتكم ورسائلكم، داخل المؤسسة ولدى شركائكم.',
        points: ['الصورة والهوية', 'الاتصال الداخلي', 'العلاقات المؤسساتية'],
        href: '/expertises/communication-d-entreprise',
        image: '/images/domaines/communication.jpg',
        illustration: '/images/domaines/illustrations/communication.webp',
        emblem: '/images/domaines/emblemes/communication.webp',
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
        illustration: '/images/domaines/illustrations/certification.webp',
        emblem: '/images/domaines/emblemes/certification.webp',
      },
    ],
  },
  ai: {
    eyebrow: 'الذكاء الاصطناعي التطبيقي',
    title: 'الذكاء الاصطناعي يدخل المؤسسة من باب التنظيم.',
    text: 'قبل الحديث عن الأدوات، ننظر في الطريقة التي تعمل بها مؤسستكم فعلًا. لا يتدخل الذكاء الاصطناعي إلا حيث يخلق قيمة، مع معطيات محمية منذ البداية.',
    cta: { label: 'اكتشفوا مقاربتنا', href: '/expertises/intelligence-artificielle' },
    illustration: '/images/ia/porte.webp',
    stepsLabel: 'مقاربتنا في ثلاث مراحل',
    steps: [
      { label: 'التشخيص', text: 'تحديد المواضع التي يخلق فيها الذكاء الاصطناعي قيمة فعلية' },
      { label: 'التكوين', text: 'استعمال الذكاء الاصطناعي يوميًا، في صميم المهن' },
      { label: 'الإدماج', text: 'النشر، مع معطيات تحت السيطرة' },
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
        image: '/images/domaines/formations.jpg?v=2',
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
    { icon: 'domains', label: '6 مجالات خبرة' },
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
    provisional: false,
    note: 'أرقام قدّمتها OPEM.',
    items: [
      { value: 7, prefix: '+', label: 'سنوات من الخبرة المتراكمة' },
      { value: 62, prefix: '+', label: 'مؤسسة مرافَقة' },
      { value: 1500, prefix: '+', label: 'إطار وعون تم تكوينهم' },
      { value: 165, prefix: '+', label: 'خبيرًا يمكن تجنيدهم' },
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
    title: 'الدورات القادمة',
    listLabel: 'الدورات القادمة',
    all: { label: 'الرزنامة الكاملة', href: '/formation' },
    register: 'التسجيل',
    provisional: true,
    note: 'رزنامة تقديرية، في انتظار تأكيد OPEM.',
    empty: 'سيتم الإعلان عن الدورات القادمة قريبًا.',
    items: [
      {
        id: 'iso-9001',
        topic: 'الجودة',
        date: '2026-11-16',
        title: 'إدارة الجودة وفق ISO 9001',
        format: 'حضوري · الجزائر العاصمة · 3 أيام',
        href: '/formation/catalogue-et-sessions',
      },
      {
        id: 'iso-45001',
        topic: 'الصحة والسلامة والبيئة',
        date: '2026-11-24',
        title: 'الصحة والسلامة المهنية (ISO 45001)',
        format: 'حضوري · الجزائر العاصمة · يومان',
        href: '/formation/catalogue-et-sessions',
      },
      {
        id: 'leadership',
        topic: 'التسيير',
        date: '2026-12-07',
        title: 'تسيير الفرق والقيادة',
        format: 'حضوري · الجزائر العاصمة · يومان',
        href: '/formation/catalogue-et-sessions',
      },
      {
        id: 'projets-btph',
        topic: 'البناء والأشغال العمومية',
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
        id: 'etudes',
        domain: 'الدراسات الاستراتيجية',
        icon: 'public',
        quote:
          'وضع التشخيص كلمات على ما كنا نشعر به. واستطعنا أن نقرّر انطلاقًا من الوقائع لا من الانطباعات.',
        name: '[الاسم في انتظار التأكيد]',
        role: 'المدير العام [في انتظار التأكيد]',
        organisation: 'هيئة عمومية [في انتظار التأكيد]',
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
        id: 'coaching',
        domain: 'الكوتشينغ',
        icon: 'company',
        quote:
          'ساعدني الكوتشينغ على أخذ مسافة. ولاحظ فريقي الفرق في طريقتي في اتخاذ القرار والتفويض.',
        name: '[الاسم في انتظار التأكيد]',
        role: 'مديرة وحدة [في انتظار التأكيد]',
        organisation: 'مؤسسة صناعية [في انتظار التأكيد]',
      },
      {
        id: 'communication',
        domain: 'الاتصال',
        icon: 'public',
        quote: 'كانت رسائلنا مشتّتة. اليوم، تسمع فرقنا وشركاؤنا الرسالة نفسها في الوقت نفسه.',
        name: '[الاسم في انتظار التأكيد]',
        role: 'مسؤول الاتصال [في انتظار التأكيد]',
        organisation: 'مؤسسة عمومية [في انتظار التأكيد]',
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
