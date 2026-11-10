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
export type AudienceIcon = 'public' | 'company';
export type CommitmentIcon = 'tailor' | 'relay' | 'measure';
/** Pictogrammes des partenaires d'études (bande « Études et évaluations »). */
export type StudyIcon = 'globe' | 'cooperation' | 'network';

/** Logo client : `logo` est le nom du fichier dans /images/clients (sans .webp). */
export type ClientLogo = { name: string; logo: string; width: number; height: number };
/** Les sept leviers du modèle des 7S (McKinsey), mesurés par l'autodiagnostic de l'accroche. */
export type DiagnosticAxis =
  'strategie' | 'structure' | 'systemes' | 'valeurs' | 'style' | 'personnel' | 'competences';
/** Profils de l'autodiagnostic 7S (règles dans diagnosticScore.ts). */
export type DiagnosticProfile =
  'alignee' | 'fondation' | 'cap' | 'mecanique' | 'talents' | 'mouvement';
/** Questions sur l'organisation, posées avant les 7 leviers. */
export type DiagnosticContextId = 'statut' | 'secteur' | 'effectif' | 'fonction';

export type Link = { label: string; href: string };

export type FaqTheme = 'perimetre' | 'methode' | 'resultats';

/** Couleur d'un temps de l'étude de cas : filet du haut et, sauf `plain`, grand texte. */
export type TestimonialQuote = {
  id: string;
  eyebrow: string;
  quote: string;
  author: string;
  /**
   * Illustration (fond bleu très clair #E6EDF4, celui de la bande ; format 4:3, 763 × 572) ;
   * une version de 700 px de large existe à côté (« -700.webp »).
   */
  illustration?: string;
  /**
   * `company` : l'entreprise qui témoigne (son logo, affiché dans la version « portraits »,
   * avec son accord écrit). `person` : la personne qui signe, quand elle accepte d'être nommée ;
   * son nom et sa fonction remplacent alors la signature anonyme. Pas de photo de personne
   * (choix d'OPEM) ; jamais de logo deviné.
   */
  company?: { name: string; logo: string };
  person?: { name: string; role: string; photo?: string };
};

export type HomeContent = {
  title: string;
  hero: {
    eyebrow: string;
  };
  /** Bandeau « Vidéo » : texte sur panneau bleu nuit, vidéo à côté, jamais dessous. */
  heroVideo: {
    headline: [string, string];
    intro: string;
    /** Phrase sous le texte, puis le bouton vers les expertises. */
    tagline: string;
    cta: Link;
    pause: string;
    play: string;
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
    /** Carte de l'accroche : le diagnostic présenté comme une aide pour s'orienter. */
    intro: { title: string; start: string };
    /** Écran d'accueil du plein écran, avant la première question. */
    welcome: {
      label: string;
      /** Deux phrases : la seconde en ambre. */
      title: [string, string];
      subtitle: string;
      /** Ce que le test apporte, une ligne chacun. */
      benefits: string[];
      start: string;
      /** Sous la carte des leviers ; `captionHighlight` (un passage de `caption`) en ambre et gras. */
      caption: string;
      captionHighlight: string;
      /** Bouton de fermeture de l'écran d'accueil. */
      close: string;
      pause: string;
      play: string;
    };
    /**
     * Description du radar pour les lecteurs d'écran (lue aussi par les moteurs de recherche) :
     * les sept leviers d'OPEM, sans citer le modèle d'origine.
     */
    modelLabel: string;
    /** Virgule de la langue, avec son espace : « , » ou « ، ». */
    comma: string;
    /** Étiquette de chaque levier : « Étape 2 · Levier {current} sur {total} », puis l'intitulé. */
    progress: string;
    /** Aide commune sous chaque question sur un levier. */
    leverHelp: string;
    /** Retour à la question précédente (absent de la première question). */
    back: string;
    /** Étapes du parcours : votre organisation, sept leviers, votre résultat. */
    steps: [string, string, string];
    /** Écran de fin du questionnaire, avant le résultat. */
    done: { title: string; text: string; cta: string };
    /** Sortie du questionnaire : retour à l'écran d'accueil. */
    close: string;
    /**
     * Avant les 7 leviers : quelques questions sur l'organisation. Elles nuancent l'analyse
     * (effectif) et sont transmises avec la demande de rappel.
     */
    context: {
      label: string;
      /** « Question {current} sur {total} » (lecteurs d'écran). */
      progress: string;
      /** Rappel de la réponse du premier temps : « {question} : {answer} ». */
      recall: string;
      /** Lien du rappel, qui ramène au premier temps. */
      edit: string;
      /** Statuts qui voient la catégorie d'entreprise dans la question sur la taille. */
      companyStatuses: string[];
      questions: {
        id: DiagnosticContextId;
        /** Mot géant de l'écran. */
        label: string;
        text: string;
        /** Aide sous la question. */
        help?: string;
        /**
         * `family` : réponses rangées par famille (secteurs, fonctions), titre de la famille.
         * `companyLabel` : libellé vu par les statuts de `companyStatuses` (taille).
         */
        choices: { id: string; label: string; family?: string; companyLabel?: string }[];
        /**
         * Second temps de la question précédente (le secteur après le statut) : même numéro,
         * rappel de la réponse précédente avec un lien « Modifier ».
         */
        secondStep?: boolean;
      }[];
    };
    /**
     * Une question par levier, dans l'ordre du modèle ; `id` est le levier. `title` : intitulé
     * affiché sur l'écran (à défaut, le nom court du levier). Réponses rangées de la note 0 à 3.
     */
    questions: {
      id: DiagnosticAxis;
      title?: string;
      text: string;
      choices: { id: string; label: string }[];
    }[];
    /**
     * Nom du levier dans les graphiques (`label`, les noms d'OPEM, jamais ceux du modèle
     * d'origine) et intitulé ; domaines OPEM qui y répondent (`domainsFrom2` : à partir de la
     * note 2, à la place de `domains`).
     */
    axes: Record<
      DiagnosticAxis,
      { label: string; title: string; domains: Link[]; domainsFrom2?: Link[] }
    >;
    /**
     * Textes par levier (textes d'OPEM). `findings` (constat) et `actions` (première piste) : un
     * par note, de 0 à 3. `costs` (ce que cela coûte), `soon` (dans les trois mois) et `year`
     * (dans l'année) : notes 0 et 1 ; `soon` et `year` sont réservés au rapport détaillé.
     */
    levers: Record<
      DiagnosticAxis,
      {
        findings?: string[];
        actions?: string[];
        costs: [string, string];
        soon: [string, string];
        year: [string, string];
        indicator: string;
      }
    >;
    /** Écran de résultat, dans l'ordre des blocs. */
    result: {
      label: string;
      profileLabel: string;
      /** Note d'un levier, pour les lecteurs d'écran : « {score} sur 3 ». */
      axisScore: string;
      /**
       * Score total, sous le niveau : « {total} points sur {max} », accordé selon le nombre
       * (règles de pluriel de la langue : `one` en français pour 0 et 1 ; en arabe, `zero`,
       * `one`, `two`, `few` de 3 à 10, `many` de 11 à 99).
       */
      totalScore: Partial<Record<Intl.LDMLPluralRule, string>> & { other: string };
      /** Légende du radar : forme pleine, forme en pointillés. */
      yours: string;
      ideal: string;
      footprintTitle: string;
      /** Titres des deux lectures du score, à côté du radar. */
      levelTitle: string;
      balanceTitle: string;
      strengthsTitle: string;
      noStrength: string;
      weakTitle: string;
      noWeak: string;
      costLabel: string;
      startTitle: string;
      firstAction: string;
      indicatorLabel: string;
      domainLabel: string;
      /** Rappel du rapport détaillé, et lien vers le formulaire. */
      report: { text: string; link: string };
      roleTitle: string;
      moreTitle: string;
      /** Formulaire du rapport détaillé ; `done` : « … adressé à {email}. » */
      form: {
        title: string;
        text: string;
        name: string;
        organisation: string;
        fonction: string;
        email: string;
        phone: string;
        optional: string;
        /** Envoi du rapport (obligatoire), puis échange avec un consultant (facultatif). */
        consents: [string, string];
        info: string;
        submit: string;
        sending: string;
        done: string;
        error: string;
      };
      /** Demande de rendez-vous : les réponses y sont ajoutées en paramètres. */
      consultant: Link;
      /** Encart mis en avant autour du bouton du consultant (textes à faire valider par OPEM). */
      consultantCard: { title: string; text: string };
      /** Efface les réponses et ramène à l'écran d'accueil. */
      retake: string;
      /** Ramène à la première question, réponses conservées. */
      restart: string;
      /** Le résultat en pages : nom de la navigation, nom de chaque page, boutons. */
      pager: { label: string; pages: string[]; previous: string; next: string };
    };
    /** Nom et texte de chaque profil. */
    profiles: Record<DiagnosticProfile, { name: string; text: string }>;
    /** Niveau global (« Niveau {level} sur 4 », lu sur le total), cadre et humain. */
    analysis: {
      levelLabel: string;
      levels: { name: string; text: string }[];
      hard: { label: string; hint: string };
      soft: { label: string; hint: string };
      balance: { hard: string; soft: string; even: string };
    };
    /**
     * Phrases selon le répondant (identifiants des réponses) : taille, statut, famille de
     * secteur (seulement si le levier « Commencer par » est dans `levers`), fonction (bloc
     * « Votre rôle »), et trois phrases sous conditions.
     */
    modulations: {
      sizes: Record<string, string>;
      statuses: { ids: string[]; text: string }[];
      sectors: { ids: string[]; levers: DiagnosticAxis[]; text: string }[];
      roles: { ids: string[]; text: string }[];
      /** Sous la première action, pour ces tailles. */
      smallOrg: { sizes: string[]; text: string };
      /** Sous la première action, pour ces statuts quand le levier prioritaire est l'un de `levers`. */
      publicDelegation: { statuses: string[]; levers: DiagnosticAxis[]; text: string };
      /** Ajoutée au constat de `lever` noté `note`, pour ces secteurs. */
      safety: { lever: DiagnosticAxis; note: number; sectors: string[]; text: string };
    };
  };
  /** Bandeau des logos clients, juste sous l'accroche : la preuve sociale dès le premier écran. */
  clients: { title: string; items: ClientLogo[] };
  /**
   * Section « Ce qui nous distingue » (« Pourquoi choisir OPEM »), juste sous les logos : textes
   * d'OPEM, trois engagements.
   */
  commitments: {
    eyebrow: string;
    /** Titre sur deux lignes (la seconde en bleu OPEM). */
    heading: [string, string];
    items: {
      id: string;
      icon: CommitmentIcon;
      /** Deux lignes : l'amorce (« Notre réussite »), puis l'engagement. */
      title: [string, string];
      text: string;
    }[];
  };
  /**
   * Section « Nos domaines », sous « Ce qui nous distingue » : tous les domaines en rangée.
   * Textes et ordre d'OPEM. Ne jamais écrire « DAS ».
   */
  domains: {
    eyebrow: string;
    title: string;
    discover: string;
    /** Bouton vers la page de toutes les expertises. */
    all: Link;
    items: {
      id: string;
      title: string;
      text: string;
      points: string[];
      /** Remplace « Découvrir ce domaine » sur la carte de ce domaine. */
      discover?: string;
      href: string;
      /**
       * Illustration 16:9 (métaphore du domaine, fond bleu nuit, une pièce ambre). Une version
       * de 800 px de large existe à côté (« -800.webp »).
       */
      illustration: string;
    }[];
  };
  /**
   * Citation du mois, entre les domaines et le bandeau IA : à changer chaque mois (citation, mois,
   * auteur). Jamais de citation attribuée à quelqu'un sans source sûre.
   */
  quoteOfMonth: {
    eyebrow: string;
    /**
     * Les quatre champs remplacés chaque mois depuis WordPress (Réglages > Citation du mois,
     * plugin wordpress/opem-quote-api.php) ; les valeurs ci-dessous servent de repli.
     */
    quote: string;
    author: string;
    /** L'ouvrage (en italique) ou la fonction de l'auteur ; facultative. */
    source?: string;
    /** Commentaire d'OPEM, sous l'auteur ; facultatif. */
    comment?: string;
    /** Petit titre de l'encadré du commentaire (fixe, pas dans WordPress). */
    commentLabel: string;
  };
  /**
   * Bandeau « Intelligence artificielle appliquée », sous les domaines : titre, texte, bouton,
   * et trois temps (diagnostic, formation, intégration) dans un cadre à filets.
   */
  ai: {
    eyebrow: string;
    title: string;
    text: string;
    /**
     * Mots mis en évidence : dans le titre (ambre, écho du nœud ambre de l'illustration) et dans
     * le texte (blanc). Mot absent du texte : rien n'est mis en évidence.
     */
    highlight: { title: string; text: string };
    /** `ariaLabel` : nom du bouton lu par les lecteurs d'écran, à la place du libellé. */
    cta: Link & { ariaLabel: string };
    /**
     * Illustration (une porte ouverte sur un cerveau fait de neurones, d'où partent, à gauche et
     * à droite, des réseaux qui s'étendent en s'éloignant ; un seul nœud ambre, au cœur), format
     * paysage 1024 × 572, fond bleu nuit ; une version de 700 px de large existe à côté
     * (« -700.webp »).
     */
    illustration: string;
    /** Nom de la liste des trois temps (lecteurs d'écran). */
    stepsLabel: string;
    steps: { label: string; text: string }[];
  };
  /**
   * Section « Éclairages » (après les témoignages) : textes d'OPEM. Trois articles, une invitation
   * à poser une question, puis l'encadré « Actualité ».
   */
  insights: {
    eyebrow: string;
    title: string;
    all: Link;
    /** Étiquette de chaque article (« Éclairage »), suivie de sa catégorie. */
    articleLabel: string;
    read: string;
    articles: {
      id: string;
      category: string;
      title: string;
      text: string;
      /** AAAA-MM-JJ */
      date: string;
      dateLabel: string;
      href: string;
      /** Couleur du filet sous la photo. */
      tone: 'blue' | 'green' | 'amber';
      /** Photo 3:2 en tête de carte (décorative) ; une version « -700.webp » existe à côté. */
      image: string;
    }[];
    question: { text: string; link: Link };
    news: {
      label: string;
      all: Link;
      items: {
        id: string;
        /** AAAA-MM ou AAAA-MM-JJ */
        date: string;
        dateLabel: string;
        title: string;
        /** Thèmes affichés en pastilles (formations du mois). */
        tags?: string[];
        link: Link;
      }[];
    };
  };
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
    /** Aucune session programmée : message, puis lien vers le formulaire de contact. */
    empty: { text: string; link: Link };
    /** Version « Prochaines sessions » : nom de la liste (lecteurs d'écran). */
    listLabel: string;
    /** Dates en petit sous le mois : « du {start} au {end} ». */
    range: string;
    /** Badge de la première édition d'une formation chez OPEM. */
    newBadge: string;
    /**
     * Photos réelles de sessions, tirées de l'album OPEM, visages floutés (participants non
     * reconnaissables), dans la dernière case de la grille ; plusieurs photos défilent (fondu,
     * bouton pause). Chacune existe aussi en 700 px de large (« -700.webp »). Liste vide : un
     * emplacement neutre, sans texte.
     */
    photos: { src: string; alt: string }[];
    /** Défilement des photos : boutons pause / reprise, et « Photo {n} sur {total} ». */
    photoControls: { pause: string; play: string; show: string };
    /**
     * Sessions inter-entreprises programmées par OPEM, publiées par périodes de deux mois avec
     * des dates fermes. date / end : premier et dernier jour, au format AAAA-MM-JJ ; les
     * sessions passées sont masquées automatiquement et le bloc montre au plus les cinq plus
     * proches. title : titre court (avant les deux-points) ; promise : la suite. href : fiche
     * de la formation (onglet « Formation qualifiante ») ; « S'inscrire » mène à sa partie
     * « Inscription ». `isNew` : première édition chez OPEM, badge « Nouveau » et carte mise en
     * avant, à retirer pour les sessions suivantes. `intra` : session réservée au personnel
     * d'un client, jamais affichée dans l'agenda.
     */
    items: {
      id: string;
      date: string;
      end: string;
      topic: string;
      title: string;
      promise: string;
      format: string;
      href: string;
      isNew?: boolean;
      intra?: boolean;
    }[];
  };
  /**
   * Témoignages (avant les éclairages) : textes d'OPEM. Une étude de cas en trois temps, des
   * recommandations anonymes, puis les institutions qui confient leurs études au cabinet.
   */
  testimonials: {
    eyebrow: string;
    title: string;
    caseStudy: {
      eyebrow: string;
      title: string;
      link: Link;
      /** Illustration (fond blanc, format 4:3, 763 × 572 ; version « -700.webp » à côté). */
      illustration: string;
      /**
       * Étapes dans l'ordre chronologique, en frise verticale : l'année, le nom de l'étape, puis
       * une phrase complète. `emphasis` : le passage de la phrase mis en valeur (en gras).
       */
      steps: {
        id: string;
        year: string;
        label: string;
        text: string;
        emphasis: string;
      }[];
    };
    /**
     * Présentation des témoignages : « illustrations » (dessins, signatures anonymes) ou
     * « portraits » (logo de chaque entreprise ; nom, fonction et photo de la personne quand
     * elle a donné son accord). Les deux sont prêtes ; « portraits » attend le matériel réel.
     */
    layout: 'illustrations' | 'portraits';
    /** Recommandation mise en avant, sur carte blanche. */
    featured: TestimonialQuote;
    quotes: TestimonialQuote[];
    /** Sous les trois témoignages : vers « Références clients », qui les réunit tous. */
    more: Link;
    studies: {
      eyebrow: string;
      title: string;
      text: string;
      cta: Link;
      /** Grande carte : le nombre de ministères (compté dans la liste) au-dessus du titre. */
      ministries: { title: string; items: string[] };
      /**
       * Cartes des partenaires : pictogramme, titre, puis au choix un sigle en grand (`highlight`),
       * un nombre en grand (celui des `tags`, suivi de `countLabel`) et ses pastilles, ou un texte.
       */
      partners: {
        icon: StudyIcon;
        title: string;
        highlight?: string;
        countLabel?: string;
        tags?: string[];
        text?: string;
      }[];
    };
  };
  /**
   * Questions fréquentes (dernière section) : textes d'OPEM, classés par thème.
   */
  faq: {
    eyebrow: string;
    title: string;
    themesLabel: string;
    themes: { id: 'tout' | FaqTheme; label: string }[];
    footText: string;
    contact: Link;
    /** `link` : passage de la réponse transformé en lien (le texte doit y figurer mot pour mot). */
    items: {
      id: string;
      theme: FaqTheme;
      question: string;
      answer: string;
      link?: { text: string; href: string };
    }[];
  };
};

/**
 * Logos des clients : exactement ceux de « LOGO CLIENTS.docx » fourni par OPEM, ni plus ni moins
 * (la planche du haut, puis les logos posés dessous), dans l’ordre du document ; sauf CESI
 * Algérie, concurrent, retiré de l’image d’Integration où il figurait. Nom, fichier et
 * taille réelle du fichier, pour équilibrer les logos larges et les logos carrés.
 */
const CLIENT_LOGOS: ClientLogo[] = [
  {
    name: 'Programme des Nations unies pour le développement (PNUD)',
    logo: 'pnud',
    width: 242,
    height: 123,
  },
  { name: 'GIZ, coopération allemande', logo: 'giz', width: 151, height: 125 },
  { name: 'Ministère de l’Industrie', logo: 'ministere-industrie', width: 147, height: 132 },
  { name: 'Cowater International', logo: 'cowater', width: 345, height: 81 },
  { name: 'Triangle Génération Humanitaire', logo: 'triangle', width: 125, height: 129 },
  { name: 'Oxfam', logo: 'oxfam', width: 125, height: 138 },
  { name: 'CAARAMA Assurance de personnes', logo: 'caarama', width: 170, height: 116 },
  { name: 'ENAFOR', logo: 'enafor', width: 98, height: 140 },
  { name: 'Mobilis', logo: 'mobilis', width: 291, height: 73 },
  { name: 'COSIDER', logo: 'cosider', width: 266, height: 50 },
  { name: 'ENROS', logo: 'enros', width: 149, height: 95 },
  { name: 'CSEE Alger', logo: 'csee-alger', width: 255, height: 51 },
  { name: 'Polycad', logo: 'polycad', width: 241, height: 82 },
  { name: 'Société Nationale de Travaux Publics (SNTP)', logo: 'sntp', width: 126, height: 166 },
  { name: 'B.E.R.E.G', logo: 'bereg', width: 157, height: 154 },
  { name: 'Altro', logo: 'altro', width: 117, height: 120 },
  { name: 'Matagri', logo: 'matagri', width: 121, height: 155 },
  { name: 'SAETI', logo: 'saeti', width: 123, height: 128 },
  { name: 'BNEDER', logo: 'bneder', width: 126, height: 125 },
  { name: 'Aldiph', logo: 'aldiph', width: 208, height: 111 },
  { name: 'Alfapipe', logo: 'alfapipe', width: 106, height: 129 },
  { name: 'L.T.P. Est', logo: 'ltp-est', width: 79, height: 140 },
  { name: 'EGSA Alger', logo: 'egsa-alger', width: 244, height: 95 },
  { name: 'EGESAPMG', logo: 'egesapmg', width: 103, height: 181 },
  { name: 'Sud Etanche', logo: 'sud-etanche', width: 260, height: 97 },
  { name: 'Meditram', logo: 'meditram', width: 133, height: 135 },
  { name: 'Med Agensea', logo: 'med-agensea', width: 223, height: 106 },
  { name: 'SAPTA', logo: 'sapta', width: 189, height: 112 },
  { name: 'Agrolog', logo: 'agrolog', width: 112, height: 52 },
  { name: 'Algérie Télécom Satellite (ATS)', logo: 'ats', width: 232, height: 144 },
  { name: 'Batmetal', logo: 'batmetal', width: 210, height: 234 },
  {
    name: 'Centre National de l’Ingénierie de la Construction (CNIC)',
    logo: 'cnic',
    width: 234,
    height: 134,
  },
  { name: 'CTTP', logo: 'cttp', width: 238, height: 226 },
  { name: 'Lafarge', logo: 'lafarge', width: 254, height: 90 },
  { name: 'REELEC', logo: 'reelec', width: 208, height: 238 },
  { name: 'Recibat', logo: 'recibat', width: 82, height: 110 },
  { name: 'Office National de l’Assainissement (ONA)', logo: 'ona', width: 150, height: 136 },
  { name: 'Integration', logo: 'integration', width: 116, height: 72 },
  { name: 'UMF', logo: 'umf', width: 232, height: 232 },
  { name: 'ETAC', logo: 'etac', width: 234, height: 58 },
  { name: 'Radio Algérienne', logo: 'radio-algerienne', width: 222, height: 222 },
  { name: 'Frigomedit', logo: 'frigomedit', width: 192, height: 94 },
];

const fr: HomeContent = {
  // Titre de l'onglet et de Google, identique à celui d'index.html. Jamais de tiret long.
  title: 'OPEM, cabinet de conseil et de formation en Algérie',
  hero: {
    eyebrow: 'Cabinet de conseil et de formation',
  },
  heroVideo: {
    headline: ['Ce qui fait exceller', 'votre organisation.'],
    intro:
      'Des décisions éclairées. Des processus structurés. Des exigences maîtrisées. Des compétences développées. Un leadership affirmé. Une communication qui fait la différence.',
    tagline: 'Sept leviers font votre performance. Un seul suffit à la freiner.',
    cta: { label: 'Découvrir nos expertises', href: '/nos-expertises' },
    pause: 'Mettre la vidéo en pause',
    play: 'Relancer la vidéo',
  },
  // Espaces insécables avant « ? » : le point d'interrogation ne passe jamais seul à la ligne.
  heroDiagnostic: {
    label: 'Autodiagnostic 3 minutes chrono',
    intro: {
      title: 'Sept leviers font votre performance. Un seul suffit à la freiner.',
      start: 'Faire le test',
    },
    welcome: {
      label: 'Autodiagnostic',
      title: [
        'Sept leviers font votre performance.',
        'Trois minutes pour savoir lequel la freine.',
      ],
      subtitle: 'Dix questions, un résultat immédiat.',
      benefits: [
        'Le profil de votre organisation, levier par levier.',
        'Vos points d’appui et vos points de fragilité.',
        'Une première piste d’action, adaptée à votre taille et à votre secteur.',
      ],
      start: 'Commencer le test',
      caption: 'Un seul rouage grippé suffit à ralentir toute la mécanique.',
      captionHighlight: 'ralentir toute la mécanique',
      close: 'Fermer',
      pause: 'Arrêter le défilement des illustrations',
      play: 'Reprendre le défilement des illustrations',
    },
    modelLabel:
      'Les sept leviers OPEM : cap et priorités, organisation et rôles, processus et méthodes, culture et valeurs, style de management, équipes et talents, compétences.',
    comma: ', ',
    progress: 'Étape 2 · Levier {current} sur {total}',
    leverHelp: 'Choisissez la situation la plus proche de la vôtre aujourd’hui.',
    back: 'Question précédente',
    steps: ['Votre organisation', 'Sept leviers', 'Votre résultat'],
    done: {
      title: 'Merci, vos dix réponses sont enregistrées.',
      text: 'Votre résultat est prêt.',
      cta: 'Voir mon résultat',
    },
    close: 'Quitter',
    context: {
      label: 'Étape 1 · Votre organisation',
      progress: 'Question {current} sur {total} sur votre organisation',
      recall: '{question} : {answer}',
      edit: 'Modifier',
      companyStatuses: ['epe', 'privee'],
      questions: [
        {
          id: 'statut',
          label: 'Statut',
          text: 'Quel est le statut de votre organisation ?',
          help: 'Retenez le statut inscrit dans ses textes fondateurs.',
          choices: [
            // Ordre d'OPEM, lu ligne par ligne dans la grille de deux colonnes.
            {
              id: 'epa',
              label: 'Établissement public à caractère administratif (EPA)',
            },
            {
              id: 'epic',
              label: 'Établissement public à caractère industriel et commercial (EPIC)',
            },
            { id: 'epe', label: 'Entreprise publique économique (EPE)' },
            { id: 'privee', label: 'Entreprise privée' },
            { id: 'agence', label: 'Agence publique' },
            { id: 'administration', label: 'Administration publique' },
            { id: 'association', label: 'Association' },
            { id: 'internationale', label: 'Organisation internationale' },
          ],
        },
        {
          id: 'secteur',
          secondStep: true,
          label: 'Secteur',
          text: 'Dans quel secteur évolue votre organisation ?',
          help: 'Retenez le secteur de son activité principale.',
          choices: [
            { id: 'industrie', label: 'Industrie', family: 'Industrie et énergie' },
            { id: 'energie', label: 'Énergie et mines', family: 'Industrie et énergie' },
            {
              id: 'agriculture',
              label: 'Agriculture et pêche',
              family: 'Agriculture et agroalimentaire',
            },
            {
              id: 'agroalimentaire',
              label: 'Agroalimentaire',
              family: 'Agriculture et agroalimentaire',
            },
            { id: 'btph', label: 'BTPH', family: 'Construction et infrastructures' },
            { id: 'eau', label: 'Eau et environnement', family: 'Construction et infrastructures' },
            {
              id: 'transport',
              label: 'Transport et logistique',
              family: 'Construction et infrastructures',
            },
            {
              id: 'finance',
              label: 'Banque, assurance et finance',
              family: 'Commerce et services',
            },
            { id: 'commerce', label: 'Commerce et distribution', family: 'Commerce et services' },
            {
              id: 'telecom',
              label: 'Télécommunications et numérique',
              family: 'Commerce et services',
            },
            { id: 'tourisme', label: 'Tourisme et hôtellerie', family: 'Commerce et services' },
            { id: 'services', label: 'Autres services', family: 'Commerce et services' },
            { id: 'sante', label: 'Santé', family: 'Santé et enseignement' },
            {
              id: 'enseignement',
              label: 'Enseignement et formation',
              family: 'Santé et enseignement',
            },
            { id: 'autre', label: 'Autre secteur', family: 'Autre' },
          ],
        },
        {
          id: 'effectif',
          label: 'Taille',
          text: 'Quelle est la taille de votre organisation ?',
          help: 'Indiquez l’effectif total, tous sites confondus.',
          choices: [
            {
              id: '1-9',
              label: 'De 1 à 9 personnes',
              companyLabel: 'Très petite entreprise, de 1 à 9 personnes',
            },
            {
              id: '10-49',
              label: 'De 10 à 49 personnes',
              companyLabel: 'Petite entreprise, de 10 à 49 personnes',
            },
            {
              id: '50-250',
              label: 'De 50 à 250 personnes',
              companyLabel: 'Moyenne entreprise, de 50 à 250 personnes',
            },
            {
              id: 'plus-250',
              label: 'Plus de 250 personnes',
              companyLabel: 'Grande entreprise, plus de 250 personnes',
            },
          ],
        },
        {
          id: 'fonction',
          label: 'Fonction',
          text: 'Quelle est votre fonction ?',
          help: 'Indiquez celle que vous exercez aujourd’hui.',
          choices: [
            { id: 'direction', label: 'Direction générale', family: 'Direction' },
            { id: 'finances', label: 'Finances et gestion', family: 'Fonctions support' },
            { id: 'rh', label: 'Ressources humaines', family: 'Fonctions support' },
            { id: 'juridique', label: 'Juridique', family: 'Fonctions support' },
            { id: 'achats', label: 'Achats et approvisionnement', family: 'Fonctions support' },
            { id: 'si', label: 'Systèmes d’information', family: 'Fonctions support' },
            { id: 'production', label: 'Production', family: 'Opérations' },
            { id: 'maintenance', label: 'Maintenance', family: 'Opérations' },
            { id: 'rd', label: 'Recherche et développement', family: 'Opérations' },
            { id: 'qualite', label: 'Qualité et HSE', family: 'Qualité et méthodes' },
            {
              id: 'organisation',
              label: 'Organisation et méthodes',
              family: 'Qualité et méthodes',
            },
            { id: 'commercial', label: 'Commercial et marketing', family: 'Commercial' },
            { id: 'autre', label: 'Autre fonction', family: 'Autre' },
          ],
        },
      ],
    },
    questions: [
      {
        id: 'strategie',
        title: 'Cap et priorités',
        text: 'Vos équipes savent-elles où va votre organisation dans les trois prochaines années ?',
        choices: [
          {
            id: 'implicite',
            label:
              'Nos orientations se décident au fil des opportunités, sans plan à plusieurs années.',
          },
          {
            id: 'direction',
            label:
              'La direction a une vision à plusieurs années, encore peu partagée avec les équipes.',
          },
          { id: 'ecrite', label: 'Un plan stratégique existe et les cadres le connaissent.' },
          {
            id: 'pilotee',
            label: 'Chacun connaît les objectifs qui le concernent et en suit l’avancement.',
          },
        ],
      },
      {
        id: 'structure',
        title: 'Organisation et rôles',
        text: 'Dans votre organisation, chacun sait-il ce qu’il doit faire et ce qu’il peut décider seul ?',
        choices: [
          {
            id: 'flou',
            label:
              'Les décisions remontent au dirigeant et les rôles ne sont pas définis par écrit.',
          },
          {
            id: 'organigramme',
            label:
              'Chacun connaît sa tâche, mais les rôles se chevauchent d’une personne à l’autre.',
          },
          {
            id: 'definis',
            label:
              'Les rôles sont définis par écrit, dans un organigramme ou des fiches de poste, mais la pratique s’en écarte souvent.',
          },
          {
            id: 'revus',
            label:
              'Les missions et les limites de décision sont définies par écrit, appliquées et mises à jour quand l’organisation change.',
          },
        ],
      },
      {
        id: 'systemes',
        title: 'Processus et méthodes',
        text: 'Vos méthodes de travail sont-elles formalisées par écrit et appliquées par tous ?',
        choices: [
          { id: 'non', label: 'Chacun travaille selon son expérience, sans méthode commune.' },
          {
            id: 'en-partie',
            label: 'Des méthodes communes existent, mais elles se transmettent oralement.',
          },
          {
            id: 'essentiel',
            label: 'Certaines méthodes sont formalisées par écrit, mais restent peu appliquées.',
          },
          {
            id: 'ameliores',
            label:
              'L’essentiel des méthodes est formalisé par écrit, appliqué par tous et amélioré au besoin.',
          },
        ],
      },
      {
        id: 'valeurs',
        title: 'Culture et valeurs',
        text: 'Vos équipes partagent-elles des valeurs communes qui guident vraiment leur façon de travailler ?',
        choices: [
          {
            id: 'rarement',
            label: 'Chacun travaille selon ses propres repères, sans valeurs communes définies.',
          },
          {
            id: 'certaines',
            label:
              'Des valeurs sont affichées, mais restent peu présentes dans le travail quotidien.',
          },
          {
            id: 'ensemble',
            label:
              'Les valeurs sont partagées par les équipes, mais pèsent peu dans les décisions.',
          },
          {
            id: 'decisions',
            label: 'Les valeurs guident les décisions et les comportements au quotidien.',
          },
        ],
      },
      {
        id: 'style',
        title: 'Style de management',
        text: 'Comment ceux qui encadrent dirigent-ils leurs équipes au quotidien ?',
        choices: [
          { id: 'controle', label: 'Ils donnent les consignes et contrôlent leur exécution.' },
          { id: 'chacun', label: 'Ils donnent les consignes et recueillent l’avis des équipes.' },
          {
            id: 'ecoute',
            label: 'Ils écoutent leurs équipes et leur confient certaines décisions.',
          },
          {
            id: 'autonomie',
            label: 'Ils confient largement les décisions et accompagnent chacun vers l’autonomie.',
          },
        ],
      },
      {
        id: 'personnel',
        title: 'Équipes et talents',
        text: 'Comment pourvoyez-vous vos postes, par recrutement ou par affectation ?',
        choices: [
          { id: 'souvent-non', label: 'Selon les personnes disponibles quand le poste se libère.' },
          { id: 'parfois', label: 'Dans l’urgence, avec des critères fixés au cas par cas.' },
          { id: 'plupart', label: 'Selon des critères fixés à l’avance pour chaque poste.' },
          {
            id: 'talents',
            label:
              'Selon des critères fixés à l’avance, avec un repérage et un suivi des talents pour les postes clés.',
          },
        ],
      },
      {
        id: 'competences',
        title: 'Compétences',
        text: 'Comment développez-vous les compétences de vos équipes ?',
        choices: [
          {
            id: 'au-cas-par-cas',
            label: 'Par des formations ponctuelles, quand un besoin urgent apparaît.',
          },
          {
            id: 'demandes',
            label: 'Par des formations accordées selon les demandes des collaborateurs.',
          },
          { id: 'plan-annuel', label: 'Par un plan de formation établi chaque année.' },
          {
            id: 'evalue',
            label:
              'Par un plan de formation relié aux besoins de l’organisation, dont on mesure les effets sur le travail.',
          },
        ],
      },
    ],
    axes: {
      strategie: {
        label: 'Cap et priorités',
        title: 'Cap et priorités',
        domains: [
          {
            label: 'Études stratégiques',
            href: '/expertises/etudes-strategiques',
          },
        ],
      },
      structure: {
        label: 'Organisation et rôles',
        title: 'Organisation et rôles',
        domains: [
          {
            label: 'Accompagnement des organisations',
            href: '/expertises/accompagnement-des-organisations',
          },
        ],
      },
      systemes: {
        label: 'Processus et méthodes',
        title: 'Processus et méthodes',
        domains: [
          {
            label: 'Accompagnement des organisations',
            href: '/expertises/accompagnement-des-organisations',
          },
        ],
        domainsFrom2: [
          {
            label: 'Certification et accréditation',
            href: '/expertises/certification-et-accreditation',
          },
        ],
      },
      valeurs: {
        label: 'Culture et valeurs',
        title: 'Culture et valeurs',
        domains: [
          {
            label: 'Communication institutionnelle',
            href: '/expertises/communication-institutionnelle',
          },
          {
            label: 'Coaching professionnel',
            href: '/expertises/coaching-professionnel',
          },
        ],
      },
      style: {
        label: 'Style de management',
        title: 'Style de management',
        domains: [
          {
            label: 'Coaching professionnel',
            href: '/expertises/coaching-professionnel',
          },
        ],
      },
      personnel: {
        label: 'Équipes et talents',
        title: 'Équipes et talents',
        domains: [
          {
            label: 'Accompagnement des organisations',
            href: '/expertises/accompagnement-des-organisations',
          },
        ],
      },
      competences: {
        label: 'Compétences',
        title: 'Compétences',
        domains: [
          {
            label: 'Formation qualifiante',
            href: '/formation',
          },
        ],
      },
    },
    levers: {
      strategie: {
        findings: [
          'Vos orientations se décident au fil des occasions. L’organisation avance sans savoir si chaque effort la rapproche d’un but commun.',
          'La vision existe, portée par la seule direction. Les équipes avancent sans connaître la destination ; leurs priorités divergent dès que la pression monte.',
          'Le cap est écrit et l’encadrement le connaît. Il reste à le faire descendre jusqu’à ceux qui produisent chaque jour.',
          'Chacun sait à quoi sert son travail et mesure sa contribution. Le cap mobilise, au lieu de dormir dans un document.',
        ],
        actions: [
          'Fixer trois orientations chiffrées à trois ans et les écrire sur une page.',
          'Présenter la vision aux cadres et la traduire avec eux en objectifs annuels.',
          'Décliner le plan en objectifs par équipe, suivis par quelques indicateurs.',
          'Revoir le plan chaque année, à la lumière des résultats et des évolutions de votre environnement.',
        ],
        costs: [
          'Chaque occasion est saisie sans être choisie. L’organisation subit son environnement au lieu de l’anticiper.',
          'Les efforts se dispersent : les mêmes arbitrages reviennent à chaque réunion ; les moyens partent dans des projets sans cohérence d’ensemble.',
        ],
        soon: [
          'Partager ces orientations avec l’encadrement et en tirer les priorités de l’année.',
          'Fixer avec chaque responsable deux ou trois objectifs reliés à cette vision.',
        ],
        year: [
          'Bâtir un plan stratégique à trois ans, décliné en objectifs annuels et suivi par quelques indicateurs.',
          'Formaliser un plan stratégique, présenté à l’ensemble des équipes et revu chaque année.',
        ],
        indicator:
          'Part des objectifs annuels déclinés en objectifs d’équipe, suivie chaque trimestre.',
      },
      structure: {
        findings: [
          'Tout converge vers le dirigeant. Les décisions attendent : l’organisation ne va pas plus vite que l’agenda d’une seule personne.',
          'Chacun connaît sa tâche. Entre les postes, les frontières restent floues, d’où des doublons, des oublis et des tensions.',
          'L’organigramme et les fiches de poste existent. La pratique s’en est éloignée ; les écrits ne décrivent plus le fonctionnement réel.',
          'Missions et délégations sont claires et tenues à jour. L’organisation peut évoluer sans perdre ses repères.',
        ],
        actions: [
          'Écrire les missions de chaque poste et fixer ce que chacun peut décider seul.',
          'Clarifier qui fait quoi sur les activités où les rôles se chevauchent.',
          'Confronter les fiches de poste au travail réel, puis les mettre à jour.',
          'Anticiper les évolutions de structure qu’appellent vos projets de développement.',
        ],
        costs: [
          'La direction s’épuise dans le quotidien. À chaque absence du dirigeant, l’organisation s’arrête.',
          'Certaines tâches sont faites deux fois, d’autres jamais. Les responsabilités se diluent et les tensions s’installent.',
        ],
        soon: [
          'Présenter ces missions et ces délégations aux équipes, puis les faire appliquer.',
          'Formaliser ces clarifications dans des fiches de poste courtes, validées avec les intéressés.',
        ],
        year: [
          'Fixer un circuit de décision connu de tous et le revoir chaque année.',
          'Revoir l’organigramme dans son ensemble et préciser les délégations de chaque niveau.',
        ],
        indicator:
          'Nombre de décisions courantes qui remontent encore à la direction, relevé sur un mois, puis chaque trimestre.',
      },
      systemes: {
        findings: [
          'Chacun travaille selon son expérience. La qualité dépend des personnes ; chaque départ emporte un savoir-faire.',
          'Des méthodes communes existent, transmises de mémoire. Elles s’altèrent à chaque passage de relais.',
          'Une partie des méthodes est écrite et peu suivie. L’écart entre l’écrit et la pratique fragilise l’ensemble.',
          'Vos méthodes sont écrites, appliquées et améliorées. Vous disposez d’une base solide pour une certification.',
        ],
        actions: [
          'Repérer les cinq activités les plus sensibles et formaliser leur méthode par écrit.',
          'Formaliser ces méthodes par écrit, avec ceux qui les appliquent.',
          'Comprendre pourquoi ces méthodes ne sont pas appliquées, puis les simplifier.',
          'Engager une démarche de certification, ou mesurer la performance de vos processus clés.',
        ],
        costs: [
          'La qualité varie d’une personne à l’autre et les mêmes erreurs reviennent. Chaque départ emporte une part du savoir-faire.',
          'Faute d’écrits pour les guider, les nouveaux mettent longtemps à être opérationnels. Chaque mutation fragilise la continuité du travail.',
        ],
        soon: [
          'Faire appliquer ces méthodes et recueillir les difficultés rencontrées sur le terrain.',
          'Former les nouveaux arrivants à partir de ces méthodes écrites.',
        ],
        year: [
          'Étendre la formalisation aux autres activités et organiser leur mise à jour régulière.',
          'Organiser une revue périodique des méthodes, pour les tenir à jour et les améliorer.',
        ],
        indicator:
          'Part des activités sensibles dotées d’une méthode écrite et effectivement appliquée, vérifiée chaque semestre.',
      },
      valeurs: {
        findings: [
          'Chacun suit ses propres repères. Sans valeurs communes, les arbitrages du quotidien varient d’une personne à l’autre.',
          'Des valeurs sont affichées, sans être encore vécues. Les équipes ne s’y reconnaissent pas.',
          'Les valeurs sont partagées et rassemblent les équipes. Elles pèsent encore peu quand il faut décider.',
          'Vos valeurs guident les décisions au quotidien. Elles font la cohésion des équipes et l’attrait de votre organisation.',
        ],
        actions: [
          'Définir avec vos équipes trois ou quatre valeurs qui décrivent votre façon de travailler.',
          'Traduire chaque valeur en comportements concrets, observables au travail.',
          'Faire des valeurs un critère explicite des décisions et de l’évaluation de l’encadrement.',
          'Les faire connaître au-dehors, auprès de vos partenaires et de vos futurs collaborateurs.',
        ],
        costs: [
          'Sans repères communs, chacun arbitre à sa façon : la cohésion reste fragile et les tensions durent.',
          'L’écart entre le discours et la pratique use la confiance des équipes. La parole de la direction perd de son poids.',
        ],
        soon: [
          'Traduire chaque valeur en deux ou trois comportements attendus au travail.',
          'Faire porter ces comportements par l’encadrement, à commencer par la direction.',
        ],
        year: [
          'Intégrer ces valeurs à l’accueil des nouveaux, à l’évaluation et aux décisions de l’encadrement.',
          'Intégrer les valeurs aux critères de recrutement et d’évaluation.',
        ],
        indicator:
          'Adhésion des équipes aux valeurs, mesurée par une courte enquête interne chaque année.',
      },
      style: {
        findings: [
          'L’encadrement repose sur la consigne et le contrôle. Les équipes exécutent et prennent peu d’initiatives.',
          'Les responsables consultent leurs équipes et décident seuls. L’avis recueilli ne pèse pas toujours.',
          'L’écoute et la délégation sont installées. L’autonomie reste limitée à quelques décisions.',
          'Les responsables délèguent largement et font grandir leurs équipes. L’organisation y gagne en réactivité.',
        ],
        actions: [
          'Instaurer, dans chaque équipe, un point régulier où les difficultés du terrain remontent avec des propositions.',
          'Confier aux équipes des décisions précises, dans un cadre clair.',
          'Élargir la délégation et accompagner les responsables dans leur rôle d’entraîneur d’équipe.',
          'Préparer la relève aux postes d’encadrement.',
        ],
        costs: [
          'Les cadres attendent les ordres et les difficultés remontent trop tard. La charge pèse toujours sur les mêmes personnes.',
          'Consultées sans être entendues, les équipes finissent par ne plus rien proposer.',
        ],
        soon: [
          'Confier à chaque responsable des décisions qu’il prendra seul, dans un cadre écrit.',
          'Rendre compte aux équipes des suites données à leurs avis.',
        ],
        year: [
          'Former l’encadrement à associer les équipes aux décisions qui les concernent.',
          'Former l’encadrement à la délégation et au suivi de l’autonomie.',
        ],
        indicator: 'Nombre de propositions venues des équipes et retenues chaque trimestre.',
      },
      personnel: {
        costs: [
          'Des personnes peinent sur des postes qui ne leur conviennent pas. Chaque départ coûte cher à remplacer.',
          'Les choix faits sous pression se corrigent lentement. Faute de perspectives, les meilleurs éléments partent.',
        ],
        soon: [
          'Appliquer ces critères à chaque poste qui se libère, recrutement comme affectation.',
          'Préparer les remplacements prévisibles : départs en retraite, fins de contrat, mutations.',
        ],
        year: [
          'Construire une cartographie des postes et des compétences de l’organisation.',
          'Repérer les personnes à potentiel et préparer leur évolution vers les postes clés.',
        ],
        indicator:
          'Part des postes pourvus selon des critères écrits fixés à l’avance, suivie chaque semestre.',
      },
      competences: {
        findings: [
          'Les formations répondent aux urgences. Les compétences s’acquièrent sous la contrainte, rarement par anticipation.',
          'Les formations suivent les demandes individuelles. Elles profitent aux personnes sans servir forcément l’organisation.',
          'Un plan de formation annuel existe ; ses effets sur le travail restent à mesurer.',
          'Vos formations servent vos besoins et leurs effets sont mesurés. La compétence devient un investissement piloté.',
        ],
        actions: [
          'Recenser les compétences dont vous aurez besoin dans les deux prochaines années.',
          'Relier chaque demande de formation à un besoin du poste ou de l’équipe.',
          'Évaluer quelques formations sur leurs effets concrets, quelques mois après.',
          'Construire des parcours qualifiants pour vos métiers clés.',
        ],
        costs: [
          'Les compétences manquent au moment où on en a besoin ; la formation arrive toujours trop tard.',
          'Le budget de formation se dépense sans servir les priorités. Les compétences clés restent à construire.',
        ],
        soon: [
          'Hiérarchiser ces besoins et construire un premier plan de formation.',
          'Arbitrer les demandes selon les priorités de l’organisation et en tirer un plan annuel.',
        ],
        year: [
          'Évaluer les effets des formations sur le travail, quelques mois après.',
          'Mesurer les effets des principales formations sur le travail.',
        ],
        indicator:
          'Part des formations suivies d’une évaluation de leurs effets sur le travail, trois à six mois après.',
      },
    },
    result: {
      label: 'Votre résultat',
      profileLabel: 'Votre profil',
      axisScore: '{score} sur 3',
      totalScore: { one: '{total} point sur {max}', other: '{total} points sur {max}' },
      yours: 'Votre organisation',
      // Pas « Organisation alignée » : ne pas confondre la forme idéale avec le profil du même nom.
      ideal: 'Niveau maximal',
      footprintTitle: 'Votre empreinte',
      levelTitle: 'Votre niveau global',
      balanceTitle: 'Le cadre et l’humain',
      strengthsTitle: 'Vos points d’appui',
      noStrength:
        'Aucun levier n’est encore solide : mieux vaut avancer pas à pas, un chantier à la fois.',
      weakTitle: 'Vos points de fragilité',
      noWeak: 'Aucun levier faible dans vos réponses : votre priorité est de maintenir ce niveau.',
      costLabel: 'Ce que cela vous coûte',
      startTitle: 'Commencer par',
      firstAction: 'Première action',
      indicatorLabel: 'Indicateur à suivre',
      domainLabel: 'Domaine OPEM concerné',
      report: {
        text: 'Les trois actions datées de chaque levier fragile figurent dans votre rapport détaillé.',
        link: 'Recevoir mon rapport',
      },
      roleTitle: 'Votre rôle',
      moreTitle: 'Pour aller plus loin',
      form: {
        title: 'Recevez votre rapport détaillé',
        text: 'Vos sept leviers analysés un par un ; pour chaque fragilité, trois actions datées et un indicateur à suivre.',
        name: 'Nom et prénom',
        organisation: 'Organisation',
        fonction: 'Fonction',
        email: 'Adresse électronique',
        phone: 'Téléphone',
        optional: 'facultatif',
        consents: [
          'J’accepte qu’OPEM utilise ces informations pour m’adresser mon rapport.',
          'J’accepte qu’un consultant d’OPEM me contacte pour échanger sur ce résultat.',
        ],
        info: 'Vos données servent uniquement à l’envoi de votre rapport et, si vous l’acceptez, à un échange avec un consultant. Elles sont conservées trois ans à compter du dernier contact et ne sont ni vendues ni cédées. Vous pouvez y accéder, les faire rectifier ou supprimer en écrivant à contact@opem-dz.com.',
        submit: 'Recevoir mon rapport',
        sending: 'Envoi en cours…',
        done: 'Merci. Votre rapport détaillé vous sera adressé à {email}.',
        error:
          'L’envoi n’a pas abouti. Réessayez dans un instant, ou écrivez-nous depuis la page Contact.',
      },
      consultant: {
        label: 'Échanger avec un consultant',
        href: '/contact',
      },
      consultantCard: {
        title: 'Votre résultat, commenté par un consultant',
        text: 'Un consultant OPEM reprend avec vous vos points de fragilité et la première action à engager.',
      },
      retake: 'Refaire le test',
      restart: 'Revoir mes réponses',
      pager: {
        label: 'Parties du résultat',
        pages: ['Votre profil', 'Appuis et fragilités', 'Par où commencer', 'Aller plus loin'],
        previous: 'Précédent',
        next: 'Suivant',
      },
    },
    profiles: {
      alignee: {
        name: 'L’organisation alignée',
        text: 'Vos sept leviers tirent dans le même sens. Votre enjeu n’est plus de construire : il est de préserver cette cohérence quand l’organisation grandit ou change.',
      },
      fondation: {
        name: 'L’organisation en fondation',
        text: 'La plupart des leviers restent à construire. L’ordre dans lequel vous les bâtirez comptera davantage que la vitesse.',
      },
      cap: {
        name: 'Le navire sans cap',
        text: 'Votre organisation fonctionne, sans destination partagée. L’énergie est là ; il lui manque une direction qui donnerait à chaque effort toute sa portée.',
      },
      mecanique: {
        name: 'La belle mécanique',
        text: 'Le cap, les rôles et les méthodes sont en place. Il manque l’élan humain qui ferait vivre cette organisation au-delà des règles.',
      },
      talents: {
        name: 'Le talent sans charpente',
        text: 'L’engagement des équipes est réel et repose sur les personnes plus que sur l’organisation. Un cadre plus net protégerait cette énergie et la rendrait durable.',
      },
      mouvement: {
        name: 'L’organisation en mouvement',
        text: 'Les bases sont posées sur l’ensemble des leviers. Quelques réglages ciblés, sur les leviers les plus faibles, suffiront à accélérer.',
      },
    },
    analysis: {
      levelLabel: 'Niveau {level} sur 4',
      levels: [
        {
          name: 'Initial',
          text: 'L’organisation tient surtout grâce à l’énergie de quelques personnes. Quelques bases simples produiront des effets rapides.',
        },
        {
          name: 'En structuration',
          text: 'Des bases existent, encore partielles ou peu appliquées. Le moment est venu de les consolider.',
        },
        {
          name: 'Maîtrisé',
          text: 'Vos fondamentaux sont en place. L’enjeu est désormais de les faire vivre au quotidien et de les relier entre eux.',
        },
        {
          name: 'Avancé',
          text: 'Votre organisation est structurée et cohérente. Votre priorité : entretenir cette avance et préparer les évolutions à venir.',
        },
      ],
      hard: {
        label: 'Le cadre',
        hint: 'Cap, organisation, processus',
      },
      soft: {
        label: 'L’humain',
        hint: 'Culture, management, équipes, compétences',
      },
      balance: {
        hard: 'Les règles existent ; les équipes ne se les sont pas encore appropriées.',
        soft: 'L’engagement repose sur les personnes plus que sur l’organisation.',
        even: 'Le cadre et l’humain avancent au même rythme : ils progresseront ensemble, sans que l’un freine l’autre.',
      },
    },
    modulations: {
      sizes: {
        '1-9':
          'À moins de 10 personnes, tout repose sur la direction : écrire l’essentiel et répartir quelques décisions lui rend du temps pour développer l’activité.',
        '10-49':
          'Entre 10 et 49 personnes, l’informel atteint ses limites : des rôles clairs et des méthodes écrites évitent que la croissance ne tourne au désordre.',
        '50-250':
          'Entre 50 et 250 personnes, tout se joue chez les responsables intermédiaires : ce sont eux qui transmettent le cap et font vivre les méthodes.',
        'plus-250':
          'Au-delà de 250 personnes, l’enjeu est la cohérence entre services et entre sites : un même cap, décliné et suivi partout.',
      },
      statuses: [
        {
          ids: ['epe'],
          text: 'Dans une entreprise publique économique, chaque évolution se discute aussi avec l’actionnaire public et les organes de gestion : un diagnostic chiffré aide à la faire valider.',
        },
        {
          ids: ['epic', 'epa', 'agence', 'administration'],
          text: 'Dans un établissement ou une administration publique, le cadre réglementaire et budgétaire fixe les marges de manœuvre : les progrès les plus rapides viennent souvent de l’organisation interne et des méthodes de travail.',
        },
        {
          ids: ['privee'],
          text: 'Dans une entreprise privée, la décision est proche : un progrès engagé aujourd’hui peut produire ses effets dès les prochains mois.',
        },
        {
          ids: ['internationale'],
          text: 'Dans une organisation internationale, les règles du siège s’imposent : l’enjeu est de les adapter au contexte local sans rien perdre de leur exigence.',
        },
        {
          ids: ['association'],
          text: 'Dans une association, l’engagement des membres est la première ressource : des rôles clairs et quelques méthodes écrites le protègent de l’usure.',
        },
      ],
      sectors: [
        {
          ids: ['industrie', 'energie'],
          levers: ['systemes', 'competences'],
          text: 'Dans l’industrie et l’énergie, la maîtrise des méthodes et des compétences conditionne la sécurité, la qualité et le coût : c’est souvent là que se trouvent les gains les plus mesurables.',
        },
        {
          ids: ['agriculture', 'agroalimentaire'],
          levers: ['systemes'],
          text: 'Dans l’agriculture et l’agroalimentaire, la traçabilité et les exigences sanitaires rendent les méthodes écrites indispensables, sur le marché national comme à l’export.',
        },
        {
          ids: ['btph', 'eau', 'transport'],
          levers: ['structure', 'systemes', 'personnel'],
          text: 'Dans la construction et les infrastructures, chaque projet recompose les équipes : des rôles clairs, des méthodes partagées et des affectations réfléchies évitent de tout réinventer à chaque chantier.',
        },
        {
          ids: ['finance', 'commerce', 'telecom', 'tourisme', 'services'],
          levers: ['style', 'competences'],
          text: 'Dans le commerce et les services, la qualité se joue au contact du client : elle dépend directement de l’encadrement et des compétences des équipes.',
        },
        {
          ids: ['sante', 'enseignement'],
          levers: ['valeurs', 'style', 'competences'],
          text: 'Dans la santé et l’enseignement, la qualité du service repose sur les personnes : culture commune, encadrement et compétences y pèsent plus qu’ailleurs.',
        },
      ],
      roles: [
        {
          ids: ['direction'],
          text: 'En tant que dirigeant, vous êtes le premier levier : le cap et le style que vous donnez se diffusent dans toute l’organisation.',
        },
        {
          ids: ['rh'],
          text: 'Votre fonction porte trois des sept leviers : la culture, les équipes et les compétences. Elle est au cœur des pistes proposées.',
        },
        {
          ids: ['finances', 'juridique', 'achats', 'si'],
          text: 'Votre fonction irrigue tous les services : elle peut porter des méthodes communes et rendre les progrès mesurables.',
        },
        {
          ids: ['production', 'maintenance', 'rd'],
          text: 'Au plus près du travail réel, vous voyez avant d’autres où les rôles et les méthodes font défaut.',
        },
        {
          ids: ['qualite', 'organisation'],
          text: 'Votre fonction a la charge naturelle des méthodes et des processus : elle peut conduire la première piste d’action.',
        },
        {
          ids: ['commercial'],
          text: 'Vous mesurez chaque jour, auprès des clients, l’effet de l’organisation interne : c’est un argument fort pour engager les progrès.',
        },
      ],
      smallOrg: {
        sizes: ['1-9'],
        text: 'Dans une petite organisation, ces actions concernent d’abord la direction et les personnes clés.',
      },
      publicDelegation: {
        statuses: ['epic', 'epa', 'agence', 'administration'],
        levers: ['structure', 'style'],
        text: 'Dans le secteur public, toute délégation s’inscrit dans le cadre réglementaire applicable et se formalise dans les formes requises.',
      },
      safety: {
        lever: 'style',
        note: 0,
        sectors: ['industrie', 'energie', 'btph', 'eau', 'transport'],
        text: 'Sur un chantier ou une ligne de production, la consigne reste indispensable pour la sécurité. L’enjeu est d’associer les équipes à tout ce qui ne relève pas de la sécurité.',
      },
    },
  },
  clients: { title: 'Ils nous font confiance', items: CLIENT_LOGOS },
  commitments: {
    eyebrow: 'Pourquoi choisir OPEM',
    heading: [
      'Comprendre avant d’agir, transmettre avant de partir,',
      'mesurer avant de conclure.',
    ],
    items: [
      {
        id: 'sur-mesure',
        icon: 'tailor',
        title: ['Du sur-mesure', 'jamais du prêt-à-porter'],
        text: 'Une solution qui convient à tout le monde ne convient à personne. Vous connaissez vos difficultés, notre diagnostic en révèle la cause réelle dans votre organisation et vos processus. Nous bâtissons ensemble la réponse qui vous ressemble.',
      },
      {
        id: 'autonomie',
        icon: 'relay',
        title: ['Notre réussite', 'ne plus vous être indispensables'],
        text: 'Procédures écrites, outils de pilotage et formations qualifiantes bâtis sur vos situations de travail : vos équipes se les approprient jusqu’à l’autonomie. Quand nous partons, la performance reste chez vous.',
      },
      {
        id: 'mesure',
        icon: 'measure',
        title: ['Pas de vaines promesses', 'des résultats mesurés'],
        text: 'Dès le lancement, nous fixons avec vous les indicateurs qui comptent pour votre organisation. À la clôture, un bilan chiffré vous permet d’apprécier le retour sur votre investissement. En formation, nos participants nous attribuent déjà une satisfaction moyenne de 4,6 sur 5.',
      },
    ],
  },
  domains: {
    eyebrow: 'Nos expertises',
    title: 'Six domaines, un seul fil conducteur : votre performance.',
    discover: 'Découvrir ce domaine',
    all: { label: 'Toutes nos expertises', href: '/nos-expertises' },
    items: [
      {
        id: 'etudes-strategiques',
        title: 'Études stratégiques',
        text: 'Une mauvaise décision coûte toujours plus cher qu’une bonne étude. Marchés, filières, politiques publiques : nous établissons les faits qui fondent vos décisions.',
        points: [
          'Études de marché et de faisabilité',
          'Études économiques, sectorielles et de filières',
          'Études environnementales et d’impact',
          'Évaluation de projets et de programmes',
        ],
        href: '/expertises/etudes-strategiques',
        illustration: '/images/domaines/illustrations/etudes-strategiques.webp',
      },
      {
        id: 'accompagnement',
        title: 'Accompagnement des organisations',
        text: 'Une organisation désaccordée vous coûte chaque jour, en silence. Notre diagnostic en trouve la cause, notre accompagnement lui rend sa justesse.',
        points: [
          'Diagnostic et transformation organisationnelle',
          'Gouvernance et pilotage de la performance',
          'Projets d’investissement, partenariats et joint-ventures',
          'Conformité réglementaire et protection des données',
        ],
        href: '/expertises/accompagnement-des-organisations',
        illustration: '/images/domaines/illustrations/accompagnement.webp',
      },
      {
        id: 'formations',
        title: 'Formation qualifiante',
        text: 'Nos formateurs n’enseignent pas un métier : ils l’exercent et transmettent à vos équipes ce que seule l’expérience apprend.',
        points: [
          'Ingénierie de formation sur mesure',
          'Management et excellence opérationnelle',
          'Qualité, sécurité et développement durable',
          'Expertises techniques et numériques, tous secteurs',
        ],
        discover: 'Programmer une première session',
        href: '/formation',
        illustration: '/images/domaines/illustrations/formations.webp',
      },
      {
        id: 'coaching',
        title: 'Coaching professionnel',
        text: 'Un bon coach ne donne pas de réponses. Il pose les questions que l’on n’ose pas vous poser, pour que vous décidiez avec assurance.',
        points: [
          'Coaching de dirigeants',
          'Leadership et efficacité managériale',
          'Cohésion et dynamique des équipes',
          'Transitions et prises de poste',
        ],
        href: '/expertises/coaching-professionnel',
        illustration: '/images/domaines/illustrations/coaching.webp',
      },
      {
        id: 'certification',
        title: 'Certification et accréditation',
        text: 'Une certification s’obtient une fois et se mérite chaque jour. Nous ancrons la norme dans vos pratiques, jusqu’à faire de la conformité un réflexe.',
        points: [
          'Normes ISO et référentiel accueil',
          'Marquage CE et marquage TEDJ',
          'Certification Halal des produits et des services',
          'Accréditation des laboratoires et des organismes',
        ],
        href: '/expertises/certification-et-accreditation',
        illustration: '/images/domaines/illustrations/certification.webp',
      },
      {
        id: 'communication',
        title: 'Communication institutionnelle',
        text: 'Votre excellence ne vaut que si elle se sait. Parce que nous comprenons vos métiers, nos supports révèlent votre expertise et vos réalisations avec l’élégance qu’elles méritent.',
        points: [
          'Catalogues de présentation et de savoir-faire',
          'Sites web à votre image',
          'Films et contenus vidéo',
          'Rédaction et direction artistique',
        ],
        href: '/expertises/communication-institutionnelle',
        illustration: '/images/domaines/illustrations/communication.webp',
      },
    ],
  },
  quoteOfMonth: {
    eyebrow: 'La citation du mois',
    quote:
      'L’obstacle à l’action fait avancer l’action. Ce qui barre la route fait faire du chemin.',
    author: 'Marc Aurèle',
    source: 'Pensées',
    comment:
      'Toute difficulté porte en elle sa leçon. Encore faut-il prendre le temps de la discerner : elle n’attend qu’un regard attentif pour devenir un chemin.',
    commentLabel: 'Le regard d’OPEM',
  },
  ai: {
    eyebrow: 'Intelligence artificielle appliquée',
    title: 'L’IA entre par la porte de l’organisation.',
    text: 'Avant de parler d’outils, nous regardons comment votre organisation fonctionne réellement. L’intelligence artificielle n’y entre que là où elle allège ou fiabilise le travail : rapports, procédures, analyse des risques, tableaux de bord. Vos données sensibles restent sous votre contrôle.',
    highlight: { title: 'IA', text: 'intelligence artificielle' },
    cta: {
      label: 'Passer la porte',
      href: '/ia-appliquee',
      ariaLabel: 'Découvrir nos solutions et notre démarche en intelligence artificielle',
    },
    illustration: '/images/ia/porte-reseau.webp',
    stepsLabel: 'Notre démarche en trois temps',
    steps: [
      { label: 'Diagnostic', text: 'Une carte des usages prioritaires, chiffrée' },
      { label: 'Formation', text: 'Des équipes formées au cœur de leur métier' },
      { label: 'Accompagnement', text: 'Un outil maîtrisé, qui libère temps et ressources' },
    ],
  },
  insights: {
    eyebrow: 'Éclairages',
    title: 'Des analyses pour décider en connaissance de cause.',
    all: { label: 'Tous les éclairages', href: '/eclairages' },
    articleLabel: 'Éclairage',
    read: 'Lire',
    articles: [
      {
        id: 'organisation',
        category: 'Organisation',
        title: 'Les signaux d’une organisation qui s’essouffle',
        text: 'Délais qui glissent, décisions qui remontent toujours au sommet : votre organisation s’essouffle sans le dire.',
        date: '2026-11-17',
        dateLabel: '17 nov. 2026',
        href: '/eclairages/signaux-d-une-organisation-qui-s-essouffle',
        tone: 'blue',
        image: '/images/eclairages/organisation.webp',
      },
      {
        id: 'formation',
        category: 'Formation',
        title: 'Plan de formation annuel : un investissement, pas une obligation',
        text: 'Et si votre plan de formation 2027 partait de vos objectifs plutôt que du catalogue de l’an dernier ?',
        date: '2026-11-17',
        dateLabel: '17 nov. 2026',
        href: '/eclairages/plan-de-formation-annuel',
        tone: 'green',
        image: '/images/eclairages/formation.webp',
      },
      {
        id: 'ia',
        category: 'IA et organisation',
        title: 'Intégrer l’IA : commencer par l’organisation, pas par l’outil',
        text: 'Trop de projets d’IA commencent par l’outil. Les meilleurs commencent par une question : que voulez-vous améliorer ?',
        date: '2026-11-17',
        dateLabel: '17 nov. 2026',
        href: '/eclairages/integrer-l-ia',
        tone: 'amber',
        image: '/images/eclairages/ia-organisation.webp',
      },
    ],
    question: {
      text: 'Une question sur ces sujets ?',
      link: { label: 'Posez-la-nous', href: '/contact' },
    },
    news: {
      label: 'Actualité',
      all: { label: 'Toutes les actualités', href: '/actualites' },
      items: [
        {
          id: 'formations-decembre',
          date: '2026-12',
          dateLabel: 'Décembre 2026',
          title: 'Nos formations qualifiantes de décembre',
          tags: [
            'Sécurité informatique',
            'Dialogue social',
            'Management de projet',
            'Réglementation des marchés publics',
            'Rédaction des cahiers des charges',
          ],
          link: {
            label: 'Voir le calendrier et s’inscrire',
            href: '/formation/catalogue-et-sessions',
          },
        },
        {
          id: 'nouveau-site',
          date: '2026-11-17',
          dateLabel: '17 nov. 2026',
          title: 'OPEM met en ligne son nouveau site',
          link: { label: 'Lire', href: '/actualites/nouveau-site' },
        },
      ],
    },
  },
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
        link: { label: 'Solutions pour les entreprises', href: '/nos-expertises' },
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
      { value: 7, prefix: '+', label: 'ans d’activité' },
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
    provisional: false,
    note: '',
    empty: {
      text: 'Le prochain calendrier sera publié très prochainement.',
      link: {
        label: 'Contactez-nous pour organiser une session dans vos locaux.',
        href: '/contact',
      },
    },
    range: 'du {start} au {end}',
    newBadge: 'Nouveau',
    photos: [
      {
        src: '/images/sessions/communication-interpersonnelle.webp',
        alt: 'Une formation OPEM en communication interpersonnelle : la formatrice face aux participants',
      },
      {
        src: '/images/sessions/participants-rang.webp',
        alt: 'Des participants à une session OPEM, assis côte à côte',
      },
      {
        src: '/images/sessions/disposition-en-u.webp',
        alt: 'Une session de formation OPEM : les participants autour de tables en U',
      },
    ],
    photoControls: {
      pause: 'Arrêter le défilement des photos',
      play: 'Reprendre le défilement des photos',
      show: 'Photo {n} sur {total}',
    },
    items: [
      {
        id: 'diagnostic-d-organisation',
        date: '2026-12-06',
        end: '2026-12-09',
        topic: 'Organisation',
        title: 'Diagnostic d’organisation',
        promise: 'Repérer les blocages, optimiser les processus',
        format: 'Présentiel · Alger · 4 jours',
        href: '/formation/fiches-formation/diagnostic-d-organisation',
      },
      {
        id: 'plan-de-formation-2027',
        date: '2026-12-08',
        end: '2026-12-10',
        topic: 'Ingénierie de la formation',
        title: 'Plan de formation 2027',
        promise: 'De l’analyse des besoins au pilotage',
        format: 'Présentiel · Alger · 3 jours',
        href: '/formation/fiches-formation/plan-de-formation-2027',
      },
      {
        id: 'cybersecurite-operationnelle',
        date: '2026-12-13',
        end: '2026-12-17',
        topic: 'Cybersécurité',
        title: 'Cybersécurité opérationnelle',
        promise: 'Protéger, détecter, réagir',
        format: 'Présentiel · Alger · 5 jours',
        href: '/formation/fiches-formation/cybersecurite-operationnelle',
      },
      {
        id: 'iso-9001-2026',
        date: '2026-12-15',
        end: '2026-12-17',
        topic: 'Qualité et systèmes de management',
        title: 'ISO 9001:2026',
        promise: 'Ce qui change vraiment pour votre système qualité',
        format: 'Présentiel · Alger · 3 jours',
        href: '/formation/fiches-formation/iso-9001-2026',
      },
      {
        id: 'chatgpt-et-claude-en-pratique',
        date: '2026-12-20',
        end: '2026-12-24',
        topic: 'Intelligence artificielle',
        title: 'ChatGPT et Claude en pratique',
        promise: 'Travailler mieux, plus vite, dès demain',
        format: 'Présentiel · Alger · 5 jours',
        href: '/formation/fiches-formation/chatgpt-et-claude-en-pratique',
        isNew: true,
      },
    ],
  },
  testimonials: {
    eyebrow: 'Ils nous ont confié leurs projets',
    title: 'Leurs mots, nos meilleures références.',
    layout: 'portraits',
    caseStudy: {
      eyebrow: 'Étude de cas | Accompagnement des organisations',
      title: 'Un audit approuvé à l’unanimité, puis tout le plan de formation confié à OPEM',
      link: {
        label: 'Lire l’étude de cas',
        href: '/missions/etudes-de-cas/audit-organisationnel-et-plan-de-formation',
      },
      illustration: '/images/temoignages/confiance.webp',
      steps: [
        {
          id: 'audit',
          year: '2021',
          label: 'L’audit',
          text: 'Une entreprise publique économique confie à OPEM l’audit organisationnel et fonctionnel de sa structure.',
          emphasis: 'l’audit organisationnel et fonctionnel',
        },
        {
          id: 'verdict',
          year: '2021',
          label: 'Le verdict',
          text: 'Son conseil d’administration approuve le rapport à l’unanimité et félicite l’équipe pour son professionnalisme.',
          emphasis: 'à l’unanimité',
        },
        {
          id: 'confiance',
          year: '2023',
          label: 'La confiance',
          text: 'Deux ans plus tard, elle confie à OPEM 100 % de son plan de formation annuel.',
          emphasis: '100 %',
        },
      ],
    },
    featured: {
      id: 'recommandation',
      eyebrow: 'Recommandation',
      quote:
        'Nous avons particulièrement apprécié la qualité des services d’OPEM, son écoute active et la rigueur d’un partenaire de haut niveau. Je recommande à toute entreprise en quête de performance de solliciter les compétences du cabinet.',
      author: 'Direction générale d’une entreprise publique, 2020',
      illustration: '/images/temoignages/recommandation.webp',
      company: { name: 'ALDIPH', logo: '/images/temoignages/aldiph.webp' },
      person: { name: 'Smail Trifi', role: 'Président-directeur général, ALDIPH' },
    },
    quotes: [
      {
        id: 'certification',
        eyebrow: 'Certification',
        quote:
          'Conduire de front trois normes, ISO 9001, ISO 14001 et ISO 45001, a exigé une méthode rigoureuse. OPEM nous l’a apportée. Notre système de management intégré a été mis en place dans le respect des délais et des exigences de qualité convenus.',
        author: 'Direction d’une entreprise industrielle, 2025',
        illustration: '/images/temoignages/certification.webp',
      },
      {
        id: 'formation',
        eyebrow: 'Formation qualifiante',
        quote:
          'La formation s’est déroulée dans les meilleures conditions, sur les plans logistique et organisationnel comme dans le choix du formateur. Elle a été conduite avec diligence et professionnalisme.',
        author: 'Direction générale d’un office public national, 2024',
      },
    ],
    more: { label: 'Lire d’autres témoignages', href: '/missions/references-clients' },
    studies: {
      eyebrow: 'Études et évaluations',
      title: 'Les institutions nous confient leurs études.',
      text: 'Analyses économiques, diagnostics et évaluations finales de programmes, pour des administrations centrales et des partenaires internationaux.',
      cta: { label: 'Découvrir nos études', href: '/expertises/etudes-strategiques' },
      ministries: {
        title: 'Ministères',
        items: [
          'Ministère de l’Industrie',
          'Ministère de la Culture et des Arts',
          'Ministère de la Formation et de l’Enseignement professionnels',
          'Ministère de l’Intérieur et des Collectivités locales',
        ],
      },
      partners: [
        {
          icon: 'globe',
          title: 'Nations unies',
          highlight: 'PNUD',
          text: 'Programme des Nations unies pour le développement',
        },
        {
          icon: 'cooperation',
          title: 'Coopération allemande',
          highlight: 'GIZ',
          countLabel: 'programmes',
          tags: [
            'PME',
            'Économie circulaire',
            'Entrepreneuriat féminin',
            'Employabilité',
            'Gouvernance locale',
          ],
        },
        {
          icon: 'network',
          title: 'ONG internationales',
          text: 'Études et évaluations finales de projets de développement',
        },
      ],
    },
  },
  faq: {
    eyebrow: 'Questions fréquentes',
    title: 'Dix questions, des réponses sans détour.',
    themesLabel: 'Thèmes',
    themes: [
      { id: 'tout', label: 'Toutes les questions' },
      { id: 'perimetre', label: 'Notre périmètre' },
      { id: 'methode', label: 'Notre façon de travailler' },
      { id: 'resultats', label: 'Résultats et conditions' },
    ],
    footText: 'Votre question n’y figure pas ?',
    contact: { label: 'Posez-la-nous', href: '/contact' },
    items: [
      {
        id: 'secteurs',
        theme: 'perimetre',
        question: 'Quels secteurs et quels types d’organisations accompagnez-vous ?',
        answer:
          'Toute organisation, privée ou publique, dès lors que l’exigence est au rendez-vous. Entreprises, institutions, ministères et programmes internationaux nous confient déjà leurs projets. Notre force tient moins au secteur qu’à notre manière de travailler : comprendre votre métier avant de vous conseiller.',
      },
      {
        id: 'certifications',
        theme: 'perimetre',
        question: 'Délivrez-vous vous-mêmes les certifications ISO, Halal ou TEDJ ?',
        answer:
          'Non, et c’est une garantie pour vous : celui qui vous prépare ne peut pas être celui qui vous évalue. Les certifications sont délivrées par des organismes habilités. Notre rôle consiste à vous y conduire, de la mise en conformité aux audits à blanc, en passant par la documentation et la formation des équipes. Vous abordez ainsi l’audit avec un système qui fonctionne déjà.',
      },
      {
        id: 'ia',
        theme: 'perimetre',
        question:
          'Pouvez-vous nous aider à intégrer l’intelligence artificielle dans notre organisation ?',
        answer:
          'Oui, sans céder à l’effet de mode. L’outil vient toujours après la vraie question : que voulez-vous améliorer ? Nous partons de vos processus pour repérer où l’intelligence artificielle crée une valeur réelle. Nous formons ensuite vos équipes à ses usages et encadrons son intégration, dans le strict respect de vos données.',
      },
      {
        id: 'intervenants',
        theme: 'methode',
        question: 'Comment sélectionnez-vous vos consultants et vos formateurs ?',
        answer:
          'Avec la même exigence que celle de nos clients. Nous nous appuyons sur un large réseau d’experts, tous praticiens de leur métier. Chacun est retenu pour son expérience de terrain, ses références et sa capacité à transmettre. Pour chaque mission, nous réunissons les compétences qui répondent précisément à votre enjeu.',
      },
      {
        id: 'confidentialite',
        theme: 'methode',
        question: 'Comment garantissez-vous la confidentialité de nos informations ?',
        answer:
          'Par principe et par écrit. Vos documents, vos données et ce qui se dit en entretien ne servent qu’à votre mission. Chaque intervenant signe un engagement de confidentialité. Vos informations stratégiques, financières, commerciales et techniques font l’objet d’une protection particulière. Les données personnelles sont traitées dans le strict respect de la loi n° 18-07 modifiée et complétée. Quant à nos missions, nous n’en détaillons jamais le contenu sans l’accord de nos clients.',
      },
      {
        id: 'premiere-collaboration',
        theme: 'methode',
        question: 'Comment se déroule une première collaboration avec OPEM ?',
        answer:
          'En quatre temps : écouter, construire, conduire, mesurer. À chaque étape, un engagement précis vous est garanti ; vous les découvrirez dans notre page Le cabinet.',
        link: { text: 'notre page Le cabinet', href: '/le-cabinet#travailler-avec-opem' },
      },
      {
        id: 'sur-mesure',
        theme: 'methode',
        question: 'Pouvez-vous réellement adapter votre intervention à notre contexte ?',
        answer:
          'Oui, c’est l’essence même de notre démarche. Trois choix sont faits pour vous : la méthode, les contenus et les intervenants. La méthode épouse le fonctionnement réel de votre organisation. Les contenus s’appuient sur vos cas, vos documents et vos situations de travail. Les intervenants sont retenus pour leur connaissance de votre métier. Deux clients du même secteur ne reçoivent jamais la même réponse, car aucune problématique n’en reproduit exactement une autre.',
      },
      {
        id: 'autonomie',
        theme: 'resultats',
        question: 'Nos équipes sauront-elles poursuivre sans vous ?',
        answer:
          'Oui, car leur autonomie se prépare dès le premier jour. Nous ne travaillons pas à la place de vos collaborateurs mais à leurs côtés, des procédures aux outils opérationnels. Une formation ciblée leur en assure la pleine maîtrise, que nous vérifions avant de clore la mission. Notre intervention prend fin, ses effets demeurent.',
      },
      {
        id: 'retour-investissement',
        theme: 'resultats',
        question: 'Comment mesurez-vous le retour sur investissement ?',
        answer:
          'Par des indicateurs fixés avec vous, à la mesure de vos objectifs. Pour chaque mission, ils portent sur ce qui compte pour votre organisation, qu’il s’agisse de coûts, de délais, de qualité ou de conformité. À votre demande, nous établissons aussi la situation initiale, afin de chiffrer précisément l’écart obtenu à la clôture. Nos formations sont évaluées selon les modèles de Kirkpatrick et de Phillips, de la satisfaction des participants jusqu’à l’effet sur leur travail.',
      },
      {
        id: 'delais-couts',
        theme: 'resultats',
        question: 'Quels sont, en moyenne, les délais et le coût d’une intervention ?',
        answer:
          'Une formation dure en général de 3 à 5 jours, un diagnostic de 2 à 6 mois et un accompagnement complet de 3 à 12 mois. Le coût se mesure à l’ampleur de votre besoin. Nous le chiffrons avec précision dans une proposition dédiée. Vous connaissez le calendrier et le budget avant même de vous engager.',
      },
    ],
  },
};

const ar: HomeContent = {
  title: 'OPEM، مكتب استشارات وتكوين في الجزائر',
  hero: {
    eyebrow: 'مكتب استشارات وتكوين',
  },
  heroVideo: {
    headline: ['ما يجعل مؤسستكم', 'تتميّز.'],
    intro:
      'قرارات مستنيرة. مسارات منظّمة. متطلبات متحكَّم فيها. كفاءات مطوَّرة. قيادة راسخة. اتصال يصنع الفرق.',
    tagline: 'سبعة روافع تصنع أداءكم، وواحد منها يكفي لكبحه.',
    cta: { label: 'اكتشفوا خبراتنا', href: '/nos-expertises' },
    pause: 'إيقاف الفيديو مؤقتًا',
    play: 'استئناف الفيديو',
  },
  // Mêmes identifiants qu'en français : seuls les libellés changent.
  heroDiagnostic: {
    label: 'تشخيص ذاتي في 3 دقائق',
    intro: {
      title: 'سبعة روافع تصنع أداءكم، وواحد منها يكفي لكبحه.',
      start: 'ابدأوا الاختبار',
    },
    welcome: {
      label: 'تشخيص ذاتي',
      title: ['سبع روافع تصنع أداءكم.', 'ثلاث دقائق لمعرفة أيّها يكبحه.'],
      subtitle: 'عشرة أسئلة، ونتيجة فورية.',
      benefits: [
        'ملمح مؤسستكم، رافعةً رافعة.',
        'نقاط ارتكازكم ونقاط هشاشتكم.',
        'أوّل مسار عمل، مكيَّف مع حجمكم وقطاعكم.',
      ],
      start: 'ابدأوا الاختبار',
      caption: 'يكفي ترس واحد معطَّل لإبطاء الآلية كلّها.',
      captionHighlight: 'لإبطاء الآلية كلّها',
      close: 'إغلاق',
      pause: 'إيقاف تتابع الرسومات',
      play: 'استئناف تتابع الرسومات',
    },
    modelLabel:
      'روافع OPEM السبعة: التوجّه والأولويات، التنظيم والأدوار، المسارات والطرائق، الثقافة والقيم، أسلوب التسيير، الفرق والمواهب، الكفاءات.',
    comma: '، ',
    progress: 'المرحلة 2 · الرافعة {current} من {total}',
    leverHelp: 'اختاروا الوضعية الأقرب إلى وضعيتكم اليوم.',
    back: 'السؤال السابق',
    steps: ['مؤسستكم', 'سبع روافع', 'نتيجتكم'],
    done: {
      title: 'شكرًا، تم تسجيل إجاباتكم العشر.',
      text: 'نتيجتكم جاهزة.',
      cta: 'عرض نتيجتي',
    },
    close: 'خروج',
    context: {
      label: 'المرحلة 1 · مؤسستكم',
      progress: 'السؤال {current} من {total} حول مؤسستكم',
      recall: '{question}: {answer}',
      edit: 'تعديل',
      companyStatuses: ['epe', 'privee'],
      questions: [
        {
          id: 'statut',
          label: 'الوضع القانوني',
          text: 'ما هو الوضع القانوني لمؤسستكم؟',
          help: 'اعتمدوا الوضع المنصوص عليه في نصوصها التأسيسية.',
          choices: [
            { id: 'epa', label: 'مؤسسة عمومية ذات طابع إداري (EPA)' },
            { id: 'epic', label: 'مؤسسة عمومية ذات طابع صناعي وتجاري (EPIC)' },
            { id: 'epe', label: 'مؤسسة عمومية اقتصادية (EPE)' },
            { id: 'privee', label: 'مؤسسة خاصة' },
            { id: 'agence', label: 'وكالة عمومية' },
            { id: 'administration', label: 'إدارة عمومية' },
            { id: 'association', label: 'جمعية' },
            { id: 'internationale', label: 'منظمة دولية' },
          ],
        },
        {
          id: 'secteur',
          secondStep: true,
          label: 'القطاع',
          text: 'في أي قطاع تنشط مؤسستكم؟',
          help: 'اعتمدوا قطاع نشاطها الرئيسي.',
          choices: [
            { id: 'industrie', label: 'الصناعة', family: 'الصناعة والطاقة' },
            { id: 'energie', label: 'الطاقة والمناجم', family: 'الصناعة والطاقة' },
            {
              id: 'agriculture',
              label: 'الفلاحة والصيد البحري',
              family: 'الفلاحة والصناعات الغذائية',
            },
            {
              id: 'agroalimentaire',
              label: 'الصناعات الغذائية',
              family: 'الفلاحة والصناعات الغذائية',
            },
            {
              id: 'btph',
              label: 'البناء والأشغال العمومية والري',
              family: 'البناء والمنشآت القاعدية',
            },
            { id: 'eau', label: 'المياه والبيئة', family: 'البناء والمنشآت القاعدية' },
            { id: 'transport', label: 'النقل واللوجستيك', family: 'البناء والمنشآت القاعدية' },
            { id: 'finance', label: 'البنوك والتأمين والمالية', family: 'التجارة والخدمات' },
            { id: 'commerce', label: 'التجارة والتوزيع', family: 'التجارة والخدمات' },
            { id: 'telecom', label: 'الاتصالات والرقمنة', family: 'التجارة والخدمات' },
            { id: 'tourisme', label: 'السياحة والفندقة', family: 'التجارة والخدمات' },
            { id: 'services', label: 'خدمات أخرى', family: 'التجارة والخدمات' },
            { id: 'sante', label: 'الصحة', family: 'الصحة والتعليم' },
            { id: 'enseignement', label: 'التعليم والتكوين', family: 'الصحة والتعليم' },
            { id: 'autre', label: 'قطاع آخر', family: 'أخرى' },
          ],
        },
        {
          id: 'effectif',
          label: 'الحجم',
          text: 'ما هو حجم مؤسستكم؟',
          help: 'أشيروا إلى العدد الإجمالي للعاملين، في جميع المواقع.',
          choices: [
            {
              id: '1-9',
              label: 'من 1 إلى 9 أشخاص',
              companyLabel: 'مؤسسة صغيرة جدًا، من 1 إلى 9 أشخاص',
            },
            {
              id: '10-49',
              label: 'من 10 إلى 49 شخصًا',
              companyLabel: 'مؤسسة صغيرة، من 10 إلى 49 شخصًا',
            },
            {
              id: '50-250',
              label: 'من 50 إلى 250 شخصًا',
              companyLabel: 'مؤسسة متوسطة، من 50 إلى 250 شخصًا',
            },
            {
              id: 'plus-250',
              label: 'أكثر من 250 شخصًا',
              companyLabel: 'مؤسسة كبيرة، أكثر من 250 شخصًا',
            },
          ],
        },
        {
          id: 'fonction',
          label: 'الوظيفة',
          text: 'ما هي وظيفتكم؟',
          help: 'أشيروا إلى الوظيفة التي تمارسونها اليوم.',
          choices: [
            { id: 'direction', label: 'الإدارة العامة', family: 'الإدارة' },
            { id: 'finances', label: 'المالية والتسيير', family: 'الوظائف الداعمة' },
            { id: 'rh', label: 'الموارد البشرية', family: 'الوظائف الداعمة' },
            { id: 'juridique', label: 'الشؤون القانونية', family: 'الوظائف الداعمة' },
            { id: 'achats', label: 'المشتريات والتموين', family: 'الوظائف الداعمة' },
            { id: 'si', label: 'أنظمة المعلومات', family: 'الوظائف الداعمة' },
            { id: 'production', label: 'الإنتاج', family: 'العمليات' },
            { id: 'maintenance', label: 'الصيانة', family: 'العمليات' },
            { id: 'rd', label: 'البحث والتطوير', family: 'العمليات' },
            { id: 'qualite', label: 'الجودة والصحة والسلامة والبيئة', family: 'الجودة والطرائق' },
            { id: 'organisation', label: 'التنظيم والطرائق', family: 'الجودة والطرائق' },
            { id: 'commercial', label: 'التجارة والتسويق', family: 'التجاري' },
            { id: 'autre', label: 'وظيفة أخرى', family: 'أخرى' },
          ],
        },
      ],
    },
    questions: [
      {
        id: 'strategie',
        title: 'التوجّه والأولويات',
        text: 'هل تعرف فرقكم إلى أين تتجه مؤسستكم خلال السنوات الثلاث القادمة؟',
        choices: [
          { id: 'implicite', label: 'تُتّخذ توجهاتنا حسب الفرص المتاحة، دون خطة متعددة السنوات.' },
          {
            id: 'direction',
            label: 'لدى الإدارة رؤية لعدة سنوات، لا تزال قليلة المشاركة مع الفرق.',
          },
          { id: 'ecrite', label: 'توجد خطة استراتيجية ويعرفها الإطارات.' },
          { id: 'pilotee', label: 'يعرف كل واحد الأهداف التي تخصّه ويتابع تقدّمها.' },
        ],
      },
      {
        id: 'structure',
        title: 'التنظيم والأدوار',
        text: 'في مؤسستكم، هل يعرف كل واحد ما عليه فعله وما يمكنه أن يقرّره بمفرده؟',
        choices: [
          { id: 'flou', label: 'تصعد القرارات إلى المسيّر، والأدوار غير محدّدة كتابيًا.' },
          { id: 'organigramme', label: 'يعرف كل واحد مهمته، لكن الأدوار تتداخل من شخص لآخر.' },
          {
            id: 'definis',
            label:
              'الأدوار محدّدة كتابيًا، في هيكل تنظيمي أو بطاقات مناصب، لكن الممارسة تبتعد عنها كثيرًا.',
          },
          {
            id: 'revus',
            label: 'المهام وحدود القرار محدّدة كتابيًا، ومطبّقة، وتُحيَّن كلما تغيّر التنظيم.',
          },
        ],
      },
      {
        id: 'systemes',
        title: 'المسارات والطرائق',
        text: 'هل طرائق عملكم مدوّنة كتابيًا ويطبّقها الجميع؟',
        choices: [
          { id: 'non', label: 'يعمل كل واحد حسب خبرته، دون طريقة مشتركة.' },
          { id: 'en-partie', label: 'توجد طرائق مشتركة، لكنها تُنقل شفهيًا.' },
          { id: 'essentiel', label: 'بعض الطرائق مدوّنة كتابيًا، لكنها قليلة التطبيق.' },
          {
            id: 'ameliores',
            label: 'أغلب الطرائق مدوّنة كتابيًا، يطبّقها الجميع وتُحسَّن عند الحاجة.',
          },
        ],
      },
      {
        id: 'valeurs',
        title: 'الثقافة والقيم',
        text: 'هل تتقاسم فرقكم قيمًا مشتركة توجّه فعلًا طريقة عملها؟',
        choices: [
          { id: 'rarement', label: 'يعمل كل واحد حسب مرجعياته الخاصة، دون قيم مشتركة محدّدة.' },
          { id: 'certaines', label: 'القيم معلنة، لكنها قليلة الحضور في العمل اليومي.' },
          { id: 'ensemble', label: 'القيم مشتركة بين الفرق، لكن وزنها في القرارات ضعيف.' },
          { id: 'decisions', label: 'القيم توجّه القرارات والسلوكيات يوميًا.' },
        ],
      },
      {
        id: 'style',
        title: 'أسلوب التسيير',
        text: 'كيف يقود المؤطرون فرقهم يوميًا؟',
        choices: [
          { id: 'controle', label: 'يعطون التعليمات ويراقبون تنفيذها.' },
          { id: 'chacun', label: 'يعطون التعليمات ويستطلعون رأي الفرق.' },
          { id: 'ecoute', label: 'يُصغون إلى فرقهم ويُسندون إليها بعض القرارات.' },
          {
            id: 'autonomie',
            label: 'يُسندون القرارات على نطاق واسع ويرافقون كل واحد نحو الاستقلالية.',
          },
        ],
      },
      {
        id: 'personnel',
        title: 'الفرق والمواهب',
        text: 'كيف تشغلون مناصبكم، بالتوظيف أو بالتعيين؟',
        choices: [
          { id: 'souvent-non', label: 'حسب الأشخاص المتاحين عند شغور المنصب.' },
          { id: 'parfois', label: 'في الاستعجال، بمعايير تُحدَّد حالة بحالة.' },
          { id: 'plupart', label: 'حسب معايير محدّدة مسبقًا لكل منصب.' },
          {
            id: 'talents',
            label: 'حسب معايير محدّدة مسبقًا، مع رصد المواهب ومتابعتها للمناصب الرئيسية.',
          },
        ],
      },
      {
        id: 'competences',
        title: 'الكفاءات',
        text: 'كيف تطوّرون كفاءات فرقكم؟',
        choices: [
          { id: 'au-cas-par-cas', label: 'بتكوينات ظرفية، عند ظهور حاجة مستعجلة.' },
          { id: 'demandes', label: 'بتكوينات تُمنح حسب طلبات المتعاونين.' },
          { id: 'plan-annuel', label: 'بخطة تكوين تُعدّ كل سنة.' },
          { id: 'evalue', label: 'بخطة تكوين مرتبطة باحتياجات المؤسسة، تُقاس آثارها على العمل.' },
        ],
      },
    ],
    axes: {
      strategie: {
        label: 'التوجّه والأولويات',
        title: 'التوجّه والأولويات',
        domains: [
          {
            label: 'الدراسات الاستراتيجية',
            href: '/expertises/etudes-strategiques',
          },
        ],
      },
      structure: {
        label: 'التنظيم والأدوار',
        title: 'التنظيم والأدوار',
        domains: [
          {
            label: 'مرافقة المؤسسات',
            href: '/expertises/accompagnement-des-organisations',
          },
        ],
      },
      systemes: {
        label: 'المسارات والطرائق',
        title: 'المسارات والطرائق',
        domains: [
          {
            label: 'مرافقة المؤسسات',
            href: '/expertises/accompagnement-des-organisations',
          },
        ],
        domainsFrom2: [
          {
            label: 'الإشهاد والاعتماد',
            href: '/expertises/certification-et-accreditation',
          },
        ],
      },
      valeurs: {
        label: 'الثقافة والقيم',
        title: 'الثقافة والقيم',
        domains: [
          {
            label: 'الاتصال المؤسساتي',
            href: '/expertises/communication-institutionnelle',
          },
          {
            label: 'الكوتشينغ المهني',
            href: '/expertises/coaching-professionnel',
          },
        ],
      },
      style: {
        label: 'أسلوب التسيير',
        title: 'أسلوب التسيير',
        domains: [
          {
            label: 'الكوتشينغ المهني',
            href: '/expertises/coaching-professionnel',
          },
        ],
      },
      personnel: {
        label: 'الفرق والمواهب',
        title: 'الفرق والمواهب',
        domains: [
          {
            label: 'مرافقة المؤسسات',
            href: '/expertises/accompagnement-des-organisations',
          },
        ],
      },
      competences: {
        label: 'الكفاءات',
        title: 'الكفاءات',
        domains: [
          {
            label: 'التكوين التأهيلي',
            href: '/formation',
          },
        ],
      },
    },
    levers: {
      strategie: {
        findings: [
          'تُتّخذ توجهاتكم حسب الفرص. تتقدّم المؤسسة دون أن تعرف إن كان كل جهد يقرّبها من هدف مشترك.',
          'الرؤية موجودة، تحملها الإدارة وحدها. تتقدّم الفرق دون معرفة الوجهة؛ وتتباعد أولوياتها كلما اشتدّ الضغط.',
          'التوجّه مكتوب ويعرفه الإطارات. يبقى إيصاله إلى من ينتجون كل يوم.',
          'كل واحد يعرف فائدة عمله ويقيس مساهمته. التوجّه يُحفّز، بدل أن يبقى حبيس وثيقة.',
        ],
        actions: [
          'تحديد ثلاثة توجهات مرقّمة على ثلاث سنوات وكتابتها في صفحة واحدة.',
          'عرض الرؤية على الإطارات وترجمتها معهم إلى أهداف سنوية.',
          'تفصيل الخطة إلى أهداف لكل فريق، تُتابَع ببعض المؤشرات.',
          'مراجعة الخطة كل سنة، على ضوء النتائج وتطورات محيطكم.',
        ],
        costs: [
          'كل فرصة تُغتنم دون أن تُختار. المؤسسة تخضع لمحيطها بدل أن تستبقه.',
          'تتشتّت الجهود: تعود القرارات نفسها في كل اجتماع؛ وتذهب الموارد إلى مشاريع بلا تناسق عام.',
        ],
        soon: [
          'مشاركة هذه التوجهات مع الإطارات واستخلاص أولويات السنة منها.',
          'تحديد هدفين أو ثلاثة مع كل مسؤول، مرتبطة بهذه الرؤية.',
        ],
        year: [
          'بناء خطة استراتيجية على ثلاث سنوات، مفصّلة إلى أهداف سنوية ومتابَعة ببعض المؤشرات.',
          'صياغة خطة استراتيجية، تُعرض على جميع الفرق وتُراجَع كل سنة.',
        ],
        indicator: 'نسبة الأهداف السنوية المفصّلة إلى أهداف فرق، تُتابَع كل ثلاثة أشهر.',
      },
      structure: {
        findings: [
          'كل شيء يتجه نحو المسيّر. القرارات تنتظر: لا تتقدّم المؤسسة أسرع من أجندة شخص واحد.',
          'كل واحد يعرف مهمته. بين المناصب تبقى الحدود ضبابية، ومن ثمّ ازدواجيات ونسيان وتوترات.',
          'الهيكل التنظيمي وبطاقات المناصب موجودة. ابتعدت الممارسة عنها؛ ولم تعد الوثائق تصف السير الفعلي.',
          'المهام والتفويضات واضحة ومحيَّنة. يمكن للمؤسسة أن تتطوّر دون أن تفقد معالمها.',
        ],
        actions: [
          'كتابة مهام كل منصب وتحديد ما يمكن لكل واحد أن يقرّره بمفرده.',
          'توضيح من يفعل ماذا في الأنشطة التي تتداخل فيها الأدوار.',
          'مقارنة بطاقات المناصب بالعمل الفعلي، ثم تحيينها.',
          'استباق تطورات الهيكل التي تستدعيها مشاريع تطويركم.',
        ],
        costs: [
          'تُستنزف الإدارة في اليومي. عند كل غياب للمسيّر، تتوقف المؤسسة.',
          'بعض المهام تُنجَز مرتين، وأخرى لا تُنجَز أبدًا. تتميّع المسؤوليات وتستقرّ التوترات.',
        ],
        soon: [
          'عرض هذه المهام والتفويضات على الفرق، ثم تطبيقها.',
          'صياغة هذه التوضيحات في بطاقات مناصب قصيرة، مصادَق عليها مع المعنيين.',
        ],
        year: [
          'تحديد مسار قرار يعرفه الجميع ومراجعته كل سنة.',
          'مراجعة الهيكل التنظيمي في مجمله وتدقيق تفويضات كل مستوى.',
        ],
        indicator:
          'عدد القرارات الجارية التي لا تزال تصعد إلى الإدارة، يُرصد على شهر، ثم كل ثلاثة أشهر.',
      },
      systemes: {
        findings: [
          'يعمل كل واحد حسب خبرته. الجودة رهينة الأشخاص؛ وكل مغادرة تأخذ معها مهارة.',
          'توجد طرائق مشتركة، تُنقل من الذاكرة. وتتآكل عند كل تسليم.',
          'جزء من الطرائق مكتوب وقليل الاتباع. الفجوة بين المكتوب والممارسة تُضعف المجموع.',
          'طرائقكم مكتوبة ومطبّقة ومحسَّنة. لديكم قاعدة متينة للإشهاد.',
        ],
        actions: [
          'تحديد الأنشطة الخمسة الأكثر حساسية وتدوين طريقتها كتابيًا.',
          'تدوين هذه الطرائق كتابيًا، مع من يطبّقونها.',
          'فهم سبب عدم تطبيق هذه الطرائق، ثم تبسيطها.',
          'الشروع في مسعى إشهاد، أو قياس أداء مساراتكم الرئيسية.',
        ],
        costs: [
          'تتفاوت الجودة من شخص لآخر وتتكرّر الأخطاء نفسها. كل مغادرة تأخذ جزءًا من المهارة.',
          'في غياب وثائق ترشدهم، يحتاج الجدد وقتًا طويلًا ليصبحوا عمليين. وكل نقل يُضعف استمرارية العمل.',
        ],
        soon: [
          'تطبيق هذه الطرائق وجمع الصعوبات المصادَفة في الميدان.',
          'تكوين الوافدين الجدد انطلاقًا من هذه الطرائق المكتوبة.',
        ],
        year: [
          'توسيع التدوين إلى الأنشطة الأخرى وتنظيم تحيينها الدوري.',
          'تنظيم مراجعة دورية للطرائق، لتحيينها وتحسينها.',
        ],
        indicator:
          'نسبة الأنشطة الحساسة التي لها طريقة مكتوبة ومطبّقة فعلًا، يُتحقّق منها كل ستة أشهر.',
      },
      valeurs: {
        findings: [
          'يتبع كل واحد مرجعياته الخاصة. دون قيم مشتركة، تختلف قرارات اليومي من شخص لآخر.',
          'القيم معلنة، دون أن تُعاش بعد. لا تجد الفرق نفسها فيها.',
          'القيم مشتركة وتجمع الفرق. لا يزال وزنها ضعيفًا عند اتخاذ القرار.',
          'قيمكم توجّه القرارات يوميًا. وهي تصنع تماسك الفرق وجاذبية مؤسستكم.',
        ],
        actions: [
          'تحديد ثلاث أو أربع قيم مع فرقكم تصف طريقة عملكم.',
          'ترجمة كل قيمة إلى سلوكيات ملموسة، قابلة للملاحظة في العمل.',
          'جعل القيم معيارًا صريحًا للقرارات ولتقييم الإطارات.',
          'التعريف بها في الخارج، لدى شركائكم ومتعاونيكم المستقبليين.',
        ],
        costs: [
          'دون مرجعيات مشتركة، يقرّر كل واحد على طريقته: يبقى التماسك هشًّا وتطول التوترات.',
          'الفجوة بين الخطاب والممارسة تُنهك ثقة الفرق. وتفقد كلمة الإدارة وزنها.',
        ],
        soon: [
          'ترجمة كل قيمة إلى سلوكين أو ثلاثة منتظرة في العمل.',
          'جعل الإطارات يحملون هذه السلوكيات، بدءًا بالإدارة.',
        ],
        year: [
          'إدماج هذه القيم في استقبال الجدد وفي التقييم وفي قرارات الإطارات.',
          'إدماج القيم في معايير التوظيف والتقييم.',
        ],
        indicator: 'انخراط الفرق في القيم، يُقاس باستبيان داخلي قصير كل سنة.',
      },
      style: {
        findings: [
          'يقوم التأطير على التعليمة والمراقبة. تنفّذ الفرق وتبادر قليلًا.',
          'يستشير المسؤولون فرقهم ويقرّرون وحدهم. لا يكون للرأي المستطلَع دائمًا وزن.',
          'الإصغاء والتفويض قائمان. تبقى الاستقلالية محصورة في بعض القرارات.',
          'يفوّض المسؤولون على نطاق واسع ويُنمّون فرقهم. وتكسب المؤسسة بذلك سرعة في الاستجابة.',
        ],
        actions: [
          'إرساء لقاء منتظم في كل فريق، تصعد فيه صعوبات الميدان مع اقتراحات.',
          'إسناد قرارات محدّدة إلى الفرق، في إطار واضح.',
          'توسيع التفويض ومرافقة المسؤولين في دورهم كمدرّبين لفرقهم.',
          'تحضير الخلافة في مناصب التأطير.',
        ],
        costs: [
          'ينتظر الإطارات الأوامر وتصعد الصعوبات متأخرة جدًا. ويقع العبء دائمًا على الأشخاص أنفسهم.',
          'حين تُستشار الفرق دون أن تُسمَع، تكفّ في النهاية عن الاقتراح.',
        ],
        soon: [
          'إسناد قرارات إلى كل مسؤول يتخذها وحده، في إطار مكتوب.',
          'إطلاع الفرق على ما تمّ بشأن آرائها.',
        ],
        year: [
          'تكوين الإطارات على إشراك الفرق في القرارات التي تعنيها.',
          'تكوين الإطارات على التفويض ومتابعة الاستقلالية.',
        ],
        indicator: 'عدد الاقتراحات الآتية من الفرق والمعتمدة كل ثلاثة أشهر.',
      },
      personnel: {
        costs: [
          'أشخاص يعانون في مناصب لا تناسبهم. وكل مغادرة يكلّف تعويضها غاليًا.',
          'الاختيارات المتخذة تحت الضغط تُصحَّح ببطء. وفي غياب آفاق، يغادر أفضل العناصر.',
        ],
        soon: [
          'تطبيق هذه المعايير على كل منصب يشغر، توظيفًا كان أو تعيينًا.',
          'تحضير التعويضات المتوقعة: الإحالة على التقاعد، نهاية العقود، التنقلات.',
        ],
        year: [
          'بناء خريطة للمناصب والكفاءات في المؤسسة.',
          'رصد الأشخاص ذوي الإمكانات وتحضير تطوّرهم نحو المناصب الرئيسية.',
        ],
        indicator: 'نسبة المناصب المشغولة وفق معايير مكتوبة محدّدة مسبقًا، تُتابَع كل ستة أشهر.',
      },
      competences: {
        findings: [
          'تستجيب التكوينات للحالات المستعجلة. تُكتسب الكفاءات تحت الإكراه، ونادرًا بالاستباق.',
          'تتبع التكوينات الطلبات الفردية. تفيد الأشخاص دون أن تخدم بالضرورة المؤسسة.',
          'توجد خطة تكوين سنوية؛ ولا تزال آثارها على العمل بحاجة إلى قياس.',
          'تكويناتكم تخدم احتياجاتكم وآثارها مقيسة. تصبح الكفاءة استثمارًا مُقادًا.',
        ],
        actions: [
          'جرد الكفاءات التي ستحتاجونها خلال السنتين القادمتين.',
          'ربط كل طلب تكوين باحتياج المنصب أو الفريق.',
          'تقييم بعض التكوينات وفق آثارها الملموسة، بعد بضعة أشهر.',
          'بناء مسارات تأهيلية لمهنكم الرئيسية.',
        ],
        costs: [
          'تنقص الكفاءات في اللحظة التي نحتاجها فيها؛ ويصل التكوين دائمًا متأخرًا.',
          'تُصرف ميزانية التكوين دون أن تخدم الأولويات. وتبقى الكفاءات الرئيسية للبناء.',
        ],
        soon: [
          'ترتيب هذه الاحتياجات حسب الأولوية وبناء أول خطة تكوين.',
          'الفصل في الطلبات حسب أولويات المؤسسة واستخلاص خطة سنوية منها.',
        ],
        year: [
          'تقييم آثار التكوينات على العمل، بعد بضعة أشهر.',
          'قياس آثار أهم التكوينات على العمل.',
        ],
        indicator: 'نسبة التكوينات المتبوعة بتقييم لآثارها على العمل، بعد ثلاثة إلى ستة أشهر.',
      },
    },
    result: {
      label: 'نتيجتكم',
      profileLabel: 'ملفّكم',
      axisScore: '{score} من 3',
      totalScore: {
        zero: '0 نقطة من {max}',
        one: 'نقطة واحدة من {max}',
        two: 'نقطتان من {max}',
        few: '{total} نقاط من {max}',
        many: '{total} نقطة من {max}',
        other: '{total} نقطة من {max}',
      },
      yours: 'مؤسستكم',
      ideal: 'المستوى الأقصى',
      footprintTitle: 'بصمتكم',
      levelTitle: 'مستواكم العام',
      balanceTitle: 'الإطار والجانب الإنساني',
      strengthsTitle: 'نقاط ارتكازكم',
      noStrength: 'لا توجد بعد رافعة متينة: الأفضل التقدم خطوة خطوة، ورشة واحدة في كل مرة.',
      weakTitle: 'نقاط هشاشتكم',
      noWeak: 'لا توجد رافعة ضعيفة في إجاباتكم: أولويتكم هي الحفاظ على هذا المستوى.',
      costLabel: 'ما يكلّفكم ذلك',
      startTitle: 'نبدأ بـ',
      firstAction: 'الإجراء الأول',
      indicatorLabel: 'المؤشر الواجب متابعته',
      domainLabel: 'مجال OPEM المعني',
      report: {
        text: 'الإجراءات الثلاثة المؤرَّخة لكل رافعة هشّة واردة في تقريركم المفصّل.',
        link: 'استلام تقريري',
      },
      roleTitle: 'دوركم',
      moreTitle: 'للمضي أبعد',
      form: {
        title: 'استلموا تقريركم المفصّل',
        text: 'روافعكم السبع محلّلة واحدة واحدة؛ ولكل هشاشة، ثلاثة إجراءات مؤرَّخة ومؤشر للمتابعة.',
        name: 'الاسم واللقب',
        organisation: 'المؤسسة',
        fonction: 'الوظيفة',
        email: 'البريد الإلكتروني',
        phone: 'الهاتف',
        optional: 'اختياري',
        consents: [
          'أوافق على أن تستعمل OPEM هذه المعلومات لإرسال تقريري.',
          'أوافق على أن يتصل بي مستشار من OPEM لتبادل الرأي حول هذه النتيجة.',
        ],
        info: 'لا تُستعمل معطياتكم إلا لإرسال تقريركم، وإن وافقتم، لتبادل الرأي مع مستشار. تُحفظ ثلاث سنوات ابتداءً من آخر اتصال ولا تُباع ولا يُتنازَل عنها. يمكنكم الاطلاع عليها أو تصحيحها أو حذفها بالكتابة إلى contact@opem-dz.com.',
        submit: 'استلام تقريري',
        sending: 'جارٍ الإرسال…',
        done: 'شكرًا. سيُرسَل تقريركم المفصّل إلى {email}.',
        error: 'لم يتمّ الإرسال. أعيدوا المحاولة بعد قليل، أو راسلونا من صفحة الاتصال.',
      },
      consultant: {
        label: 'التحدث مع مستشار',
        href: '/contact',
      },
      consultantCard: {
        title: 'نتيجتكم، يشرحها لكم مستشار',
        text: 'يراجع معكم مستشار من OPEM نقاط الهشاشة لديكم وأوّل إجراء ينبغي اتخاذه.',
      },
      retake: 'إعادة الاختبار',
      restart: 'مراجعة إجاباتي',
      pager: {
        label: 'أقسام النتيجة',
        pages: ['ملفّكم', 'الارتكاز والهشاشة', 'من أين نبدأ', 'للمضي أبعد'],
        previous: 'السابق',
        next: 'التالي',
      },
    },
    profiles: {
      alignee: {
        name: 'المؤسسة المتناسقة',
        text: 'رافعاتكم السبع تشدّ في الاتجاه نفسه. لم يعد تحدّيكم البناء، بل الحفاظ على هذا التناسق حين تكبر المؤسسة أو تتغيّر.',
      },
      fondation: {
        name: 'المؤسسة في طور التأسيس',
        text: 'أغلب الروافع لا تزال للبناء. الترتيب الذي ستبنونها به أهمّ من السرعة.',
      },
      cap: {
        name: 'سفينة بلا وجهة',
        text: 'مؤسستكم تعمل، لكن دون وجهة مشتركة. الطاقة موجودة؛ ينقصها اتجاه يمنح كل جهد مداه الكامل.',
      },
      mecanique: {
        name: 'الآلية المتقنة',
        text: 'التوجّه والأدوار والطرائق قائمة. ينقص الزخم البشري الذي يُحيي هذا التنظيم أبعد من القواعد.',
      },
      talents: {
        name: 'مواهب بلا هيكل',
        text: 'التزام الفرق حقيقي ويقوم على الأشخاص أكثر من التنظيم. إطار أوضح سيحمي هذه الطاقة ويجعلها دائمة.',
      },
      mouvement: {
        name: 'مؤسسة في حركة',
        text: 'الأسس موضوعة على مجمل الروافع. بعض التعديلات المحدّدة، على الروافع الأضعف، تكفي للتسريع.',
      },
    },
    analysis: {
      levelLabel: 'المستوى {level} من 4',
      levels: [
        {
          name: 'مبتدئ',
          text: 'تقوم المؤسسة أساسًا على طاقة بعض الأشخاص. بعض الأسس البسيطة ستُحدث آثارًا سريعة.',
        },
        {
          name: 'في طور الهيكلة',
          text: 'توجد أسس، لا تزال جزئية أو قليلة التطبيق. حان وقت ترسيخها.',
        },
        {
          name: 'متحكَّم فيه',
          text: 'أساسياتكم قائمة. التحدي الآن هو تفعيلها يوميًا وربطها ببعضها.',
        },
        {
          name: 'متقدّم',
          text: 'مؤسستكم مهيكلة ومتناسقة. أولويتكم: الحفاظ على هذا التقدم والتحضير للتطورات القادمة.',
        },
      ],
      hard: {
        label: 'الإطار',
        hint: 'التوجّه، التنظيم، المسارات',
      },
      soft: {
        label: 'العنصر البشري',
        hint: 'الثقافة، التسيير، الفرق، الكفاءات',
      },
      balance: {
        hard: 'القواعد موجودة؛ لكن الفرق لم تتبنّها بعد.',
        soft: 'الالتزام يقوم على الأشخاص أكثر من التنظيم.',
        even: 'الإطار والعنصر البشري يتقدمان بالوتيرة نفسها: سيتقدمان معًا، دون أن يعيق أحدهما الآخر.',
      },
    },
    modulations: {
      sizes: {
        '1-9':
          'في أقل من 10 أشخاص، يقع كل شيء على الإدارة: تدوين الأساسيات وتوزيع بعض القرارات يعيد إليها الوقت لتطوير النشاط.',
        '10-49':
          'بين 10 و49 شخصًا، يبلغ العمل غير الرسمي حدوده: أدوار واضحة وطرائق مكتوبة تجنّب أن يتحوّل النمو إلى فوضى.',
        '50-250':
          'بين 50 و250 شخصًا، يتوقف كل شيء على المسؤولين الوسطاء: هم من ينقلون التوجّه ويُحيون الطرائق.',
        'plus-250':
          'بعد 250 شخصًا، التحدي هو التناسق بين المصالح وبين المواقع: توجّه واحد، مفصَّل ومتابَع في كل مكان.',
      },
      statuses: [
        {
          ids: ['epe'],
          text: 'في مؤسسة عمومية اقتصادية، يُناقَش كل تطوّر أيضًا مع المساهم العمومي وهيئات التسيير: يساعد تشخيص مرقّم على المصادقة عليه.',
        },
        {
          ids: ['epic', 'epa', 'agence', 'administration'],
          text: 'في مؤسسة أو إدارة عمومية، يحدّد الإطار التنظيمي والميزاني هوامش المناورة: غالبًا ما يأتي أسرع تقدّم من التنظيم الداخلي وطرائق العمل.',
        },
        {
          ids: ['privee'],
          text: 'في مؤسسة خاصة، القرار قريب: تقدّم يُشرَع فيه اليوم يمكن أن يُثمر خلال الأشهر القادمة.',
        },
        {
          ids: ['internationale'],
          text: 'في منظمة دولية، تُفرض قواعد المقر: التحدي هو تكييفها مع السياق المحلي دون التفريط في صرامتها.',
        },
        {
          ids: ['association'],
          text: 'في جمعية، التزام الأعضاء هو المورد الأول: أدوار واضحة وبعض الطرائق المكتوبة تحميه من الاستنزاف.',
        },
      ],
      sectors: [
        {
          ids: ['industrie', 'energie'],
          levers: ['systemes', 'competences'],
          text: 'في الصناعة والطاقة، يحدّد التحكم في الطرائق والكفاءات الأمن والجودة والتكلفة: غالبًا ما توجد هناك المكاسب الأكثر قابلية للقياس.',
        },
        {
          ids: ['agriculture', 'agroalimentaire'],
          levers: ['systemes'],
          text: 'في الفلاحة والصناعات الغذائية، تجعل التتبّعية والمتطلبات الصحية الطرائق المكتوبة ضرورية، في السوق الوطنية كما في التصدير.',
        },
        {
          ids: ['btph', 'eau', 'transport'],
          levers: ['structure', 'systemes', 'personnel'],
          text: 'في البناء والمنشآت القاعدية، يعيد كل مشروع تشكيل الفرق: أدوار واضحة وطرائق مشتركة وتعيينات مدروسة تجنّب إعادة اختراع كل شيء في كل ورشة.',
        },
        {
          ids: ['finance', 'commerce', 'telecom', 'tourisme', 'services'],
          levers: ['style', 'competences'],
          text: 'في التجارة والخدمات، تُصنع الجودة عند الاتصال بالزبون: فهي تتوقف مباشرة على التأطير وكفاءات الفرق.',
        },
        {
          ids: ['sante', 'enseignement'],
          levers: ['valeurs', 'style', 'competences'],
          text: 'في الصحة والتعليم، تقوم جودة الخدمة على الأشخاص: الثقافة المشتركة والتأطير والكفاءات أثقل وزنًا فيها من غيرها.',
        },
      ],
      roles: [
        {
          ids: ['direction'],
          text: 'بصفتكم مسيّرًا، أنتم الرافعة الأولى: التوجّه والأسلوب اللذان تعطونهما ينتشران في المؤسسة كلها.',
        },
        {
          ids: ['rh'],
          text: 'وظيفتكم تحمل ثلاث روافع من سبع: الثقافة والفرق والكفاءات. وهي في صميم المسارات المقترحة.',
        },
        {
          ids: ['finances', 'juridique', 'achats', 'si'],
          text: 'وظيفتكم تغذّي كل المصالح: يمكنها أن تحمل طرائق مشتركة وأن تجعل التقدم قابلًا للقياس.',
        },
        {
          ids: ['production', 'maintenance', 'rd'],
          text: 'قريبًا من العمل الفعلي، ترون قبل غيركم أين تنقص الأدوار والطرائق.',
        },
        {
          ids: ['qualite', 'organisation'],
          text: 'وظيفتكم مكلَّفة طبيعيًا بالطرائق والمسارات: يمكنها قيادة أول مسار عمل.',
        },
        {
          ids: ['commercial'],
          text: 'تقيسون كل يوم، لدى الزبائن، أثر التنظيم الداخلي: وهي حجة قوية للشروع في التقدم.',
        },
      ],
      smallOrg: {
        sizes: ['1-9'],
        text: 'في مؤسسة صغيرة، تعني هذه الإجراءات أولًا الإدارة والأشخاص الرئيسيين.',
      },
      publicDelegation: {
        statuses: ['epic', 'epa', 'agence', 'administration'],
        levers: ['structure', 'style'],
        text: 'في القطاع العمومي، يندرج كل تفويض في الإطار التنظيمي المعمول به ويُصاغ وفق الأشكال المطلوبة.',
      },
      safety: {
        lever: 'style',
        note: 0,
        sectors: ['industrie', 'energie', 'btph', 'eau', 'transport'],
        text: 'في ورشة أو خط إنتاج، تبقى التعليمة ضرورية للأمن. التحدي هو إشراك الفرق في كل ما لا يتعلق بالأمن.',
      },
    },
  },
  clients: { title: 'يثقون بنا', items: CLIENT_LOGOS },
  commitments: {
    eyebrow: 'لماذا تختارون OPEM',
    heading: ['أن نفهم قبل أن نتصرّف، وننقل قبل أن نغادر،', 'ونقيس قبل أن نحكم.'],
    items: [
      {
        id: 'sur-mesure',
        icon: 'tailor',
        title: ['على المقاس', 'لا جاهز أبدًا'],
        text: 'الحلّ الذي يناسب الجميع لا يناسب أحدًا. أنتم تعرفون صعوباتكم، وتشخيصنا يكشف سببها الحقيقي في تنظيمكم ومساراتكم. ونبني معًا الاستجابة التي تشبهكم.',
      },
      {
        id: 'autonomie',
        icon: 'relay',
        title: ['نجاحنا', 'ألّا تبقوا في حاجة إلينا'],
        text: 'إجراءات مكتوبة، وأدوات قيادة، وتكوينات تأهيلية مبنية على وضعيات عملكم: تتملّكها فرقكم حتى تبلغ الاستقلالية. وحين نغادر، يبقى الأداء عندكم.',
      },
      {
        id: 'mesure',
        icon: 'measure',
        title: ['لا وعود جوفاء', 'بل نتائج مُقاسة'],
        text: 'منذ الانطلاق، نحدّد معكم المؤشرات المهمّة لمؤسستكم. وعند الاختتام، تتيح لكم حصيلة مرقّمة تقدير العائد على استثماركم. وفي التكوين، يمنحنا المشاركون فعلًا متوسط رضا يبلغ 4,6 من 5.',
      },
    ],
  },
  domains: {
    eyebrow: 'خبراتنا',
    title: 'ستة مجالات، وخيط ناظم واحد: أداؤكم.',
    discover: 'اكتشفوا هذا المجال',
    all: { label: 'كل خبراتنا', href: '/nos-expertises' },
    items: [
      {
        id: 'etudes-strategiques',
        title: 'الدراسات الاستراتيجية',
        text: 'القرار الخاطئ يكلّف دائمًا أكثر من دراسة جيدة. الأسواق، الشُّعب، السياسات العمومية: نُثبت الوقائع التي تقوم عليها قراراتكم.',
        points: [
          'دراسات السوق والجدوى',
          'الدراسات الاقتصادية والقطاعية ودراسات الشُّعب',
          'الدراسات البيئية ودراسات الأثر',
          'تقييم المشاريع والبرامج',
        ],
        href: '/expertises/etudes-strategiques',
        illustration: '/images/domaines/illustrations/etudes-strategiques.webp',
      },
      {
        id: 'accompagnement',
        title: 'مرافقة المؤسسات',
        text: 'التنظيم غير المتناغم يكلّفكم كل يوم، في صمت. يجد تشخيصنا سببه، وتعيد إليه مرافقتنا انسجامه.',
        points: [
          'التشخيص والتحول التنظيمي',
          'الحوكمة وقيادة الأداء',
          'مشاريع الاستثمار والشراكات والمشاريع المشتركة',
          'المطابقة التنظيمية وحماية البيانات',
        ],
        href: '/expertises/accompagnement-des-organisations',
        illustration: '/images/domaines/illustrations/accompagnement.webp',
      },
      {
        id: 'formations',
        title: 'التكوين التأهيلي',
        text: 'مكوّنونا لا يدرّسون مهنة: إنهم يمارسونها، وينقلون إلى فرقكم ما لا تعلّمه إلا التجربة.',
        points: [
          'هندسة التكوين حسب الطلب',
          'التسيير والامتياز العملياتي',
          'الجودة والسلامة والتنمية المستدامة',
          'الخبرات التقنية والرقمية في جميع القطاعات',
        ],
        discover: 'برمجوا دورة أولى',
        href: '/formation',
        illustration: '/images/domaines/illustrations/formations.webp',
      },
      {
        id: 'coaching',
        title: 'الكوتشينغ المهني',
        text: 'الكوتش الجيد لا يقدّم إجابات، بل يطرح الأسئلة التي لا يجرؤ أحد على طرحها عليكم، لتتخذوا قراراتكم بثقة.',
        points: [
          'كوتشينغ المسيّرين',
          'القيادة والفعالية التسييرية',
          'تماسك الفرق وديناميكيتها',
          'التحولات وتولّي المناصب',
        ],
        href: '/expertises/coaching-professionnel',
        illustration: '/images/domaines/illustrations/coaching.webp',
      },
      {
        id: 'certification',
        title: 'الإشهاد والاعتماد',
        text: 'تُنال الشهادة مرة واحدة، وتُستحق كل يوم. نرسّخ المعيار في ممارساتكم، حتى تصبح المطابقة عادة.',
        points: [
          'معايير ISO ومرجع الاستقبال',
          'وسم CE ووسم TEDJ',
          'إشهاد الحلال للمنتجات والخدمات',
          'اعتماد المخابر والهيئات',
        ],
        href: '/expertises/certification-et-accreditation',
        illustration: '/images/domaines/illustrations/certification.webp',
      },
      {
        id: 'communication',
        title: 'الاتصال المؤسساتي',
        text: 'لا قيمة لامتيازكم إلا إذا عُرف. ولأننا نفهم مهنكم، تُبرز دعائمنا خبرتكم وإنجازاتكم بالأناقة التي تستحقها.',
        points: [
          'كتالوجات التعريف والخبرات',
          'مواقع إلكترونية على صورتكم',
          'أفلام ومحتويات فيديو',
          'التحرير والإدارة الفنية',
        ],
        href: '/expertises/communication-institutionnelle',
        illustration: '/images/domaines/illustrations/communication.webp',
      },
    ],
  },
  quoteOfMonth: {
    eyebrow: 'اقتباس الشهر',
    quote: 'ما يعيق الفعل يدفع الفعل إلى الأمام. وما يعترض الطريق يجعلنا نقطع شوطًا.',
    author: 'ماركوس أوريليوس',
    source: 'التأملات',
    comment:
      'كل صعوبة تحمل في طيّاتها درسها. غير أنه لا بد من التمهّل لتبيّنه: فهي لا تنتظر سوى نظرة متأنّية لتصبح طريقًا.',
    commentLabel: 'نظرة OPEM',
  },
  ai: {
    eyebrow: 'الذكاء الاصطناعي التطبيقي',
    title: 'الذكاء الاصطناعي يدخل من باب التنظيم.',
    text: 'قبل الحديث عن الأدوات، ننظر في الطريقة التي تعمل بها مؤسستكم فعلًا. لا يدخلها الذكاء الاصطناعي إلا حيث يخفّف العمل أو يجعله أكثر موثوقية: التقارير، الإجراءات، تحليل المخاطر، لوحات القيادة. وتبقى معطياتكم الحساسة تحت سيطرتكم.',
    highlight: { title: 'الذكاء الاصطناعي', text: 'الذكاء الاصطناعي' },
    cta: {
      label: 'اعبروا الباب',
      href: '/ia-appliquee',
      ariaLabel: 'اكتشفوا حلولنا ومقاربتنا في الذكاء الاصطناعي',
    },
    illustration: '/images/ia/porte-reseau.webp',
    stepsLabel: 'مقاربتنا في ثلاث مراحل',
    steps: [
      { label: 'التشخيص', text: 'خريطة مرقّمة للاستعمالات ذات الأولوية' },
      { label: 'التكوين', text: 'فرق مكوَّنة في صميم مهنها' },
      { label: 'المرافقة', text: 'أداة متحكَّم فيها، تحرّر الوقت والموارد' },
    ],
  },
  insights: {
    eyebrow: 'إضاءات',
    title: 'تحليلات لاتخاذ القرار عن بيّنة.',
    all: { label: 'كل الإضاءات', href: '/eclairages' },
    articleLabel: 'إضاءة',
    read: 'اقرأوا',
    articles: [
      {
        id: 'organisation',
        category: 'التنظيم',
        title: 'مؤشرات مؤسسة تفقد أنفاسها',
        text: 'آجال تنزلق، وقرارات تصعد دائمًا إلى القمة: مؤسستكم تفقد أنفاسها دون أن تقول ذلك.',
        date: '2026-11-17',
        dateLabel: '17 نوفمبر 2026',
        href: '/eclairages/signaux-d-une-organisation-qui-s-essouffle',
        tone: 'blue',
        image: '/images/eclairages/organisation.webp',
      },
      {
        id: 'formation',
        category: 'التكوين',
        title: 'خطة التكوين السنوية: استثمار لا التزام',
        text: 'ماذا لو انطلقت خطة تكوينكم لسنة 2027 من أهدافكم بدل فهرس السنة الماضية؟',
        date: '2026-11-17',
        dateLabel: '17 نوفمبر 2026',
        href: '/eclairages/plan-de-formation-annuel',
        tone: 'green',
        image: '/images/eclairages/formation.webp',
      },
      {
        id: 'ia',
        category: 'الذكاء الاصطناعي والتنظيم',
        title: 'إدماج الذكاء الاصطناعي: البدء بالتنظيم لا بالأداة',
        text: 'كثير من مشاريع الذكاء الاصطناعي تبدأ بالأداة. أفضلها يبدأ بسؤال: ما الذي تريدون تحسينه؟',
        date: '2026-11-17',
        dateLabel: '17 نوفمبر 2026',
        href: '/eclairages/integrer-l-ia',
        tone: 'amber',
        image: '/images/eclairages/ia-organisation.webp',
      },
    ],
    question: { text: 'سؤال حول هذه المواضيع؟', link: { label: 'اطرحوه علينا', href: '/contact' } },
    news: {
      label: 'مستجدات',
      all: { label: 'كل المستجدات', href: '/actualites' },
      items: [
        {
          id: 'formations-decembre',
          date: '2026-12',
          dateLabel: 'ديسمبر 2026',
          title: 'تكويناتنا التأهيلية لشهر ديسمبر',
          tags: [
            'أمن المعلوماتية',
            'الحوار الاجتماعي',
            'إدارة المشاريع',
            'الصفقات العمومية وتحرير دفاتر الشروط',
          ],
          link: {
            label: 'الاطلاع على الرزنامة والتسجيل',
            href: '/formation/catalogue-et-sessions',
          },
        },
        {
          id: 'nouveau-site',
          date: '2026-11-17',
          dateLabel: '17 نوفمبر 2026',
          title: 'OPEM تطلق موقعها الجديد',
          link: { label: 'اقرأوا', href: '/actualites/nouveau-site' },
        },
      ],
    },
  },
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
        link: { label: 'حلول للمؤسسات', href: '/nos-expertises' },
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
    provisional: false,
    note: '',
    empty: {
      text: 'ستُنشر الرزنامة القادمة قريبًا جدًا.',
      link: { label: 'اتصلوا بنا لتنظيم دورة في مقراتكم.', href: '/contact' },
    },
    range: 'من {start} إلى {end}',
    newBadge: 'جديد',
    photos: [
      {
        src: '/images/sessions/communication-interpersonnelle.webp',
        alt: 'تكوين لـ OPEM في التواصل بين الأشخاص: المكوِّنة أمام المشاركين',
      },
      {
        src: '/images/sessions/participants-rang.webp',
        alt: 'مشاركون في دورة لـ OPEM جالسون جنبًا إلى جنب',
      },
      {
        src: '/images/sessions/disposition-en-u.webp',
        alt: 'دورة تكوينية لـ OPEM: المشاركون حول طاولات على شكل حرف U',
      },
    ],
    photoControls: {
      pause: 'إيقاف تمرير الصور',
      play: 'استئناف تمرير الصور',
      show: 'الصورة {n} من {total}',
    },
    items: [
      {
        id: 'diagnostic-d-organisation',
        date: '2026-12-06',
        end: '2026-12-09',
        topic: 'التنظيم',
        title: 'تشخيص التنظيم',
        promise: 'رصد مواطن الانسداد وتحسين العمليات',
        format: 'حضوري · الجزائر العاصمة · 4 أيام',
        href: '/formation/fiches-formation/diagnostic-d-organisation',
      },
      {
        id: 'plan-de-formation-2027',
        date: '2026-12-08',
        end: '2026-12-10',
        topic: 'هندسة التكوين',
        title: 'مخطط التكوين 2027',
        promise: 'من تحليل الاحتياجات إلى القيادة',
        format: 'حضوري · الجزائر العاصمة · 3 أيام',
        href: '/formation/fiches-formation/plan-de-formation-2027',
      },
      {
        id: 'cybersecurite-operationnelle',
        date: '2026-12-13',
        end: '2026-12-17',
        topic: 'الأمن السيبراني',
        title: 'الأمن السيبراني العملياتي',
        promise: 'الحماية، الرصد، الاستجابة',
        format: 'حضوري · الجزائر العاصمة · 5 أيام',
        href: '/formation/fiches-formation/cybersecurite-operationnelle',
      },
      {
        id: 'iso-9001-2026',
        date: '2026-12-15',
        end: '2026-12-17',
        topic: 'الجودة وأنظمة الإدارة',
        title: 'ISO 9001:2026',
        promise: 'ما الذي يتغير فعلًا في نظام الجودة لديكم',
        format: 'حضوري · الجزائر العاصمة · 3 أيام',
        href: '/formation/fiches-formation/iso-9001-2026',
      },
      {
        id: 'chatgpt-et-claude-en-pratique',
        date: '2026-12-20',
        end: '2026-12-24',
        topic: 'الذكاء الاصطناعي',
        title: 'ChatGPT و Claude في الممارسة',
        promise: 'اعملوا أفضل وأسرع، ابتداءً من الغد',
        format: 'حضوري · الجزائر العاصمة · 5 أيام',
        href: '/formation/fiches-formation/chatgpt-et-claude-en-pratique',
        isNew: true,
      },
    ],
  },
  testimonials: {
    eyebrow: 'وضعوا مشاريعهم بين أيدينا',
    title: 'كلماتهم، خير مراجعنا.',
    layout: 'illustrations',
    caseStudy: {
      eyebrow: 'دراسة حالة | مرافقة المؤسسات',
      title: 'تدقيق صودق عليه بالإجماع، ثم خطة التكوين بأكملها أُسندت إلى OPEM',
      link: {
        label: 'اقرأوا دراسة الحالة',
        href: '/missions/etudes-de-cas/audit-organisationnel-et-plan-de-formation',
      },
      illustration: '/images/temoignages/confiance.webp',
      steps: [
        {
          id: 'audit',
          year: '2021',
          label: 'التدقيق',
          text: 'تُسند مؤسسة عمومية اقتصادية إلى OPEM التدقيق التنظيمي والوظيفي لهيكلها.',
          emphasis: 'التدقيق التنظيمي والوظيفي',
        },
        {
          id: 'verdict',
          year: '2021',
          label: 'القرار',
          text: 'يصادق مجلس إدارتها على التقرير بالإجماع، ويهنّئ الفريق على احترافيته.',
          emphasis: 'بالإجماع',
        },
        {
          id: 'confiance',
          year: '2023',
          label: 'الثقة',
          text: 'بعد سنتين، تُسند إلى OPEM خطتها السنوية للتكوين بنسبة 100 %.',
          emphasis: '100 %',
        },
      ],
    },
    featured: {
      id: 'recommandation',
      eyebrow: 'توصية',
      quote:
        'لقد قدّرنا بوجه خاص جودة خدمات OPEM وحسن إصغائها وصرامة شريك رفيع المستوى. وأوصي كل مؤسسة تنشد الأداء بالاستعانة بكفاءات المكتب.',
      author: 'المديرية العامة لمؤسسة عمومية، 2020',
      illustration: '/images/temoignages/recommandation.webp',
      company: { name: 'ALDIPH', logo: '/images/temoignages/aldiph.webp' },
      person: { name: 'Smail Trifi', role: 'الرئيس المدير العام، ALDIPH' },
    },
    quotes: [
      {
        id: 'certification',
        eyebrow: 'الإشهاد',
        quote:
          'إن قيادة ثلاثة معايير في آن واحد، ISO 9001 و ISO 14001 و ISO 45001، تطلّبت منهجية صارمة. وقد وفّرتها لنا OPEM. ووُضع نظام الإدارة المدمج لدينا في احترام للآجال ولمتطلبات الجودة المتفق عليها.',
        author: 'مديرية مؤسسة صناعية، 2025',
        illustration: '/images/temoignages/certification.webp',
      },
      {
        id: 'formation',
        eyebrow: 'التكوين التأهيلي',
        quote:
          'جرى التكوين في أفضل الظروف، من الناحيتين اللوجستية والتنظيمية كما في اختيار المكوّن. وقد أُنجز بعناية واحترافية.',
        author: 'المديرية العامة لديوان عمومي وطني، 2024',
      },
    ],
    more: { label: 'اقرأوا شهادات أخرى', href: '/missions/references-clients' },
    studies: {
      eyebrow: 'الدراسات والتقييمات',
      title: 'المؤسسات تأتمننا على دراساتها.',
      text: 'تحليلات اقتصادية وتشخيصات وتقييمات نهائية للبرامج، لفائدة الإدارات المركزية والشركاء الدوليين.',
      cta: { label: 'اكتشفوا دراساتنا', href: '/expertises/etudes-strategiques' },
      ministries: {
        title: 'الوزارات',
        items: [
          'وزارة الصناعة',
          'وزارة الثقافة والفنون',
          'وزارة التكوين والتعليم المهنيين',
          'وزارة الداخلية والجماعات المحلية',
        ],
      },
      partners: [
        {
          icon: 'globe',
          title: 'الأمم المتحدة',
          highlight: 'PNUD',
          text: 'برنامج الأمم المتحدة الإنمائي',
        },
        {
          icon: 'cooperation',
          title: 'التعاون الألماني',
          countLabel: 'برامج',
          tags: [
            'المؤسسات الصغيرة والمتوسطة',
            'الاقتصاد الدائري',
            'المقاولاتية النسوية',
            'قابلية التشغيل',
            'الحوكمة المحلية',
          ],
        },
        {
          icon: 'network',
          title: 'منظمات غير حكومية دولية',
          text: 'دراسات وتقييمات نهائية لمشاريع تنموية',
        },
      ],
    },
  },
  faq: {
    eyebrow: 'أسئلة شائعة',
    title: 'عشرة أسئلة، وإجابات بلا مواربة.',
    themesLabel: 'المواضيع',
    themes: [
      { id: 'tout', label: 'جميع الأسئلة' },
      { id: 'perimetre', label: 'نطاق عملنا' },
      { id: 'methode', label: 'طريقة عملنا' },
      { id: 'resultats', label: 'النتائج والشروط' },
    ],
    footText: 'لم تجدوا سؤالكم؟',
    contact: { label: 'اطرحوه علينا', href: '/contact' },
    items: [
      {
        id: 'secteurs',
        theme: 'perimetre',
        question: 'ما القطاعات وأنواع المؤسسات التي ترافقونها؟',
        answer:
          'كل مؤسسة، خاصة كانت أو عمومية، متى حضرت الجدية والصرامة. فالمؤسسات والهيئات والوزارات والبرامج الدولية تأتمننا على مشاريعها. وقوّتنا لا تكمن في القطاع بقدر ما تكمن في طريقة عملنا: أن نفهم مهنتكم قبل أن نقدّم لكم المشورة.',
      },
      {
        id: 'certifications',
        theme: 'perimetre',
        question: 'هل تمنحون بأنفسكم شهادات ISO أو حلال أو TEDJ؟',
        answer:
          'لا، وهذا ضمان لكم: فمن يحضّركم لا يمكن أن يكون من يقيّمكم. تُمنح الشهادات من هيئات مؤهَّلة. أما دورنا فهو إيصالكم إليها، من المطابقة إلى التدقيق التجريبي، مرورًا بالتوثيق وتكوين الفرق. وهكذا تقبلون على التدقيق بنظام يعمل فعلًا.',
      },
      {
        id: 'ia',
        theme: 'perimetre',
        question: 'هل يمكنكم مساعدتنا على إدماج الذكاء الاصطناعي في مؤسستنا؟',
        answer:
          'نعم، دون الانسياق وراء الموضة. فالأداة تأتي دائمًا بعد السؤال الحقيقي: ما الذي تريدون تحسينه؟ ننطلق من مساراتكم لتحديد المواضع التي يخلق فيها الذكاء الاصطناعي قيمة حقيقية. ثم نكوّن فرقكم على استعمالاته ونؤطّر إدماجه، في احترام تام لبياناتكم.',
      },
      {
        id: 'intervenants',
        theme: 'methode',
        question: 'كيف تختارون مستشاريكم ومكوّنيكم؟',
        answer:
          'بالصرامة نفسها التي يطلبها عملاؤنا. نعتمد على شبكة واسعة من الخبراء، وكلهم ممارسون لمهنتهم. ويُختار كل واحد منهم لخبرته الميدانية ومراجعه وقدرته على نقل المعرفة. ولكل مهمة، نجمع الكفاءات التي تستجيب بدقة لرهانكم.',
      },
      {
        id: 'confidentialite',
        theme: 'methode',
        question: 'كيف تضمنون سرية معلوماتنا؟',
        answer:
          'مبدأً وكتابةً. فوثائقكم وبياناتكم وما يُقال في المقابلات لا يخدم سوى مهمتكم. ويوقّع كل متدخل تعهدًا بالسرية. وتحظى معلوماتكم الاستراتيجية والمالية والتجارية والتقنية بحماية خاصة. وتُعالَج البيانات الشخصية في احترام تام للقانون رقم 18-07 المعدَّل والمتمَّم. أما مهامنا، فلا نفصّل مضمونها أبدًا دون موافقة عملائنا.',
      },
      {
        id: 'premiere-collaboration',
        theme: 'methode',
        question: 'كيف يجري أول تعاون مع OPEM؟',
        answer:
          'في أربع مراحل: الإصغاء، والبناء، والقيادة، والقياس. وفي كل مرحلة، نضمن لكم التزامًا محدَّدًا؛ ستكتشفونها في صفحتنا «المكتب».',
        link: { text: 'صفحتنا «المكتب»', href: '/le-cabinet#travailler-avec-opem' },
      },
      {
        id: 'sur-mesure',
        theme: 'methode',
        question: 'هل يمكنكم فعلًا تكييف تدخلكم مع سياقنا؟',
        answer:
          'نعم، فهذا جوهر مقاربتنا. تُتخذ ثلاثة خيارات من أجلكم: المنهجية والمضامين والمتدخلون. فالمنهجية تساير السير الفعلي لمؤسستكم. والمضامين تستند إلى حالاتكم ووثائقكم ووضعيات عملكم. والمتدخلون يُختارون لمعرفتهم بمهنتكم. ولا يتلقى عميلان من القطاع نفسه الإجابة ذاتها أبدًا، إذ لا تتكرر أي إشكالية بحذافيرها.',
      },
      {
        id: 'autonomie',
        theme: 'resultats',
        question: 'هل ستتمكن فرقنا من المواصلة دونكم؟',
        answer:
          'نعم، لأن استقلاليتها تُحضَّر منذ اليوم الأول. فنحن لا نعمل مكان متعاونيكم بل إلى جانبهم، من الإجراءات إلى الأدوات العملية. ويضمن لهم تكوين موجَّه التحكم التام فيها، ونتحقق من ذلك قبل اختتام المهمة. ينتهي تدخلنا، وتبقى آثاره.',
      },
      {
        id: 'retour-investissement',
        theme: 'resultats',
        question: 'كيف تقيسون العائد على الاستثمار؟',
        answer:
          'بمؤشرات نحددها معكم، على قدر أهدافكم. ولكل مهمة، تنصبّ على ما يهم مؤسستكم، سواء تعلق الأمر بالتكاليف أو الآجال أو الجودة أو المطابقة. وبطلب منكم، نُعدّ كذلك الوضعية الأولية، لنقدّر بالأرقام وبدقة الفارق المحقَّق عند الاختتام. وتُقيَّم تكويناتنا وفق نموذجي كيركباتريك وفيليبس، من رضا المشاركين إلى الأثر في عملهم.',
      },
      {
        id: 'delais-couts',
        theme: 'resultats',
        question: 'ما هي، في المتوسط، آجال التدخل وتكلفته؟',
        answer:
          'يدوم التكوين عمومًا من 3 إلى 5 أيام، والتشخيص من شهرين إلى 6 أشهر، والمرافقة الكاملة من 3 إلى 12 شهرًا. وتُقاس التكلفة بحجم حاجتكم. ونحددها بدقة في عرض مخصَّص. وهكذا تعرفون الرزنامة والميزانية قبل أن تلتزموا.',
      },
    ],
  },
};

export const homeContent: Record<Lang, HomeContent> = { fr, ar };
