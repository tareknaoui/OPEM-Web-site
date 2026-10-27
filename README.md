# OPEM — site web (v3)

Site vitrine d'**OPEM — Optimum Performance Management**, cabinet algérien de conseil, de formation et
de certification. Bilingue français / arabe (mise en page en miroir pour l'arabe).

|                |                                                                                                          |
| -------------- | -------------------------------------------------------------------------------------------------------- |
| **Production** | https://sas-fawn-delta.vercel.app/ (Vercel, déployé à chaque push sur `main`)                            |
| **Dépôt**      | https://github.com/tareknaoui/OPEM-Web-site                                                              |
| **Pile**       | React 19 · TypeScript 6 · Vite 8 · React Router 8 · CSS Modules · Vitest · Lenis                         |
| **Node**       | ≥ 20.19 (imposé par `engines` + `engine-strict`)                                                         |
| **État**       | Page d'accueil terminée et validée. Autres pages à construire (voir [Reste à faire](#14-reste-à-faire)). |

## Sommaire

1. [Démarrage rapide](#1-démarrage-rapide)
2. [Commandes](#2-commandes)
3. [Architecture](#3-architecture)
4. [Page d'accueil, section par section](#4-page-daccueil-section-par-section)
5. [En-tête, pied de page et maquettes](#5-en-tête-pied-de-page-et-maquettes)
6. [Charte graphique et règles de contenu](#6-charte-graphique-et-règles-de-contenu)
7. [Langues (FR / AR)](#7-langues-fr--ar)
8. [Animations et défilement](#8-animations-et-défilement)
9. [Médias (vidéo, photos)](#9-médias-vidéo-photos)
10. [Menu WordPress](#10-menu-wordpress)
11. [Déploiement et cache](#11-déploiement-et-cache)
12. [Sécurité](#12-sécurité)
13. [Qualité, tests et conventions](#13-qualité-tests-et-conventions)
14. [Reste à faire](#14-reste-à-faire)
15. [Recettes](#15-recettes)
16. [Historique](#16-historique)

---

## 1. Démarrage rapide

```bash
npm install
cp .env.example .env.local      # Windows : copy .env.example .env.local
npm run dev                     # http://localhost:5173
```

Pour voir le site **exactement comme en production** (build minifié, CSP stricte) :

```bash
npm run build && npm run preview    # http://localhost:4173
```

Variables d'environnement (`.env.local`, jamais commité) :

| Variable          | Rôle                                                                           |
| ----------------- | ------------------------------------------------------------------------------ |
| `VITE_APP_NAME`   | Nom affiché dans les titres de page (`OPEM`)                                   |
| `VITE_API_URL`    | Préfixe des appels HTTP internes (`/api`)                                      |
| `VITE_WP_API_URL` | API REST WordPress pour le menu (`https://site/wp-json`). Vide = menu intégré. |

> Toute variable `VITE_*` est **lisible dans le navigateur** : n'y mettez jamais de secret.

## 2. Commandes

| Commande            | Rôle                                                                  |
| ------------------- | --------------------------------------------------------------------- |
| `npm run dev`       | Serveur de développement, rechargement à chaud, panneau « Maquettes » |
| `npm run build`     | Vérifie les types (`tsc -b`) puis génère le site dans `dist/`         |
| `npm run preview`   | Sert `dist/` en local avec les en-têtes de sécurité de production     |
| `npm test`          | Lance les tests une fois (`npm run test:watch` : en continu)          |
| `npm run typecheck` | Vérifie les types sans générer                                        |
| `npm run lint`      | Analyse le code (qualité, hooks React, règles de sécurité)            |
| `npm run format`    | Formate tout avec Prettier                                            |
| `npm run audit`     | Cherche des failles connues dans les dépendances de production        |

**Avant chaque push** : `npm run lint && npm run typecheck && npm test && npm run build`.

## 3. Architecture

```
src/
├── main.tsx                 point d'entrée (langue appliquée avant l'affichage, CSS global, <App />)
├── app/
│   ├── App.tsx              providers globaux (langue) + routeur
│   ├── router.tsx           routes, chaque page chargée à la demande (lazy)
│   ├── RouteError.tsx       page d'erreur
│   └── layouts/
│       ├── RootLayout.tsx   squelette commun : barre, <main>, pied, défilement fluide, apparitions
│       ├── navbar/          barre de navigation, menus ordinateur / mobile / plein écran, menu.ts
│       ├── footer/          pied de page (colonnes générées depuis le menu) + variante compacte
│       └── variants/        comparateur de maquettes (outil temporaire, voir § 5)
├── features/                une fonctionnalité / page par dossier
│   ├── home/
│   │   ├── HomePage.tsx     assemble les sections dans l'ordre
│   │   ├── content.ts       TOUS les textes de l'accueil, FR et AR, typés
│   │   ├── icons.tsx        pictogrammes propres à l'accueil
│   │   └── sections/        un composant + son .module.css (+ test) par section
│   ├── about/  contact/  not-found/   pages provisoires
├── components/              composants partagés (icons.tsx, ui/Button, ui/CountUp)
├── config/company.ts        coordonnées OPEM (adresse, téléphone, e-mail, carte) : source unique
├── hooks/                   hooks réutilisables (défilement, apparitions, media queries…)
├── i18n/                    langue courante, textes d'interface (strings.ts), bascule FR/AR
├── lib/                     utilitaires sans React : env, client HTTP, client WordPress, cx, mergeRefs
├── styles/global.css        variables de la charte (couleurs, espacements), base, apparitions
└── test/setup.ts            configuration Vitest (jsdom, matchMedia, <dialog>)

public/                      fichiers servis tels quels (logo, images, vidéo, _headers)
wordpress/opem-menu-api.php  plugin qui expose le menu WordPress en JSON
vercel.json                  réécriture SPA, en-têtes de sécurité et de cache (production)
```

### Règles d'organisation

- Tout ce qui concerne une page vit dans `features/<page>/` : composants, styles, tests, textes.
- Une feature n'importe jamais une autre feature. Code partagé → `components/`, `hooks/` ou `lib/`.
- Imports absolus avec l'alias `@/` (`import { cx } from '@/lib/cx'`).
- Styles : un `Composant.module.css` à côté du composant. Les noms de classes **et de keyframes**
  sont locaux au module (une animation partagée doit être redéclarée dans chaque module).
- Les textes ne sont jamais écrits en dur dans les composants : `content.ts` (accueil) ou
  `i18n/strings.ts` (interface commune), toujours en FR **et** AR.

### Flux de données

```
content.ts ──(useLanguage().lang)──> HomePage ──props──> sections/*
menu WordPress ─(lib/wordpress.ts, revalidé)─┐
menu.ts (repli si WordPress absent) ─────────┴─> useMenu ──> Navbar, Footer
config/company.ts ──> Footer, bandeau d'appel, pages contact
layoutVariants.ts ──(URL ?nav=…&hero=…)──> RootLayout / HomePage (maquette affichée)
```

## 4. Page d'accueil, section par section

Ordre d'affichage (`HomePage.tsx`). Clé = entrée correspondante dans `content.ts`.

| #   | Section                  | Composant                     | Clé `content.ts`                 | Comportement                                                                                                                                                   | Sur téléphone                                                       |
| --- | ------------------------ | ----------------------------- | -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| 1   | Accroche « Repères »     | `HeroFacts` + `HeroSideVideo` | `hero`, `heroVideo`, `heroFacts` | Bleu nuit, titre, devis + 2 liens, 3 chiffres repères, vidéo à droite avec bouton pause                                                                        | Vidéo sous les boutons (visible dès le 1er écran), chiffres ensuite |
| 2   | Nos domaines             | `DomainsAuto`                 | `domains`                        | Carte photo + texte, défile seule toutes les 7 s (barre de progression), pause : bouton, clavier, section hors écran. Photos superposées en fondu, préchargées | Onglets réduits à leur numéro                                       |
| 3   | Éclairages et actualités | `Insights`                    | `insights`                       | Filtres Tout / Éclairages / Actualités, une publication à la une, 2 compactes, cartes à image                                                                  | Rangée de cartes qu'on fait glisser (scroll-snap)                   |
| 4   | Témoignages              | `Testimonials`                | `testimonials`                   | Citation sur carte blanche, liste à côté, flèches et compteur, pas de défilement auto                                                                          | Pastilles défilantes                                                |
| 5   | Questions fréquentes     | `Faq`                         | `faq`                            | Accordéon WAI-ARIA (plusieurs ouvertes), encadré d'aide collant à gauche                                                                                       | Encadré d'aide après les questions                                  |

**Contenu provisoire.** Chaque bloc marqué `provisional: true` affiche une mention « à confirmer »
sous la section (composant `ProvisionalNote`). Sont provisoires : les 3 chiffres repères, les 6
publications, les 4 témoignages, les 6 réponses de la FAQ. Passer `provisional` à `false` une fois
les vrais contenus validés par OPEM.

**Sections retirées** à la demande du client, fichiers conservés (une ligne dans `HomePage.tsx`
suffit pour les remettre) : `Needs` (« Quel est votre besoin ? »), `Audiences` (« Vous êtes… »),
`Approach` (« Trois temps »), `KeyFigures`, `Sectors`, `Trainings` (agenda).

## 5. En-tête, pied de page et maquettes

### Barre de navigation (`layouts/navbar/`)

- Fixe, bleu nuit (`--color-nav-bg`), 80 px qui se réduit à 64 px après 8 px de défilement
  (`useScrolled`). La zone réservée sous la barre (`.shell::before` dans `RootLayout.module.css`)
  prend la couleur de la barre : aucune bande blanche pendant la réduction.
- Ordinateur (≥ 1280 px) : libellés courts, sous-menus / méga-menu. En dessous : bouton burger.
- Pas d'entrée « Accueil » sur ordinateur (le logo y mène).

### Pied de page (`layouts/footer/Footer.tsx`)

- Bandeau d'appel bleu OPEM (téléphone + « Être rappelé »), puis corps bleu nuit.
- Colonnes générées depuis le menu (une par rubrique ayant des sous-pages, puis « Découvrir »).
- Téléphone : coordonnées d'abord, rubriques repliées en accordéon (une ouverte à la fois).

### Comparateur de maquettes (`layouts/variants/`) — outil temporaire

Plusieurs versions de chaque bloc ont été présentées au client. Les **versions retenues** sont
celles de `DEFAULTS` dans `layoutVariants.ts` et s'affichent sans paramètre.

| Bloc         | Paramètre    | Retenue          | Autres valeurs                                                                                              |
| ------------ | ------------ | ---------------- | ----------------------------------------------------------------------------------------------------------- |
| Barre        | `nav`        | `editorialenuit` | `nuit`, `blanche`, `editoriale`, `flottante`, `centree`, `pleinecran`, `prestige`                           |
| Accroche     | `hero`       | `reperes`        | `reseau`, `cycle`, `video`, `immersive`, `editorial`, `editorialnuit`, `diagnostic`, `questions`, `publics` |
| Nos domaines | `domaines`   | `anime`          | `onglets`, `carrousel`, `sommaire`                                                                          |
| Éclairages   | `eclairages` | `une`            | `rail`                                                                                                      |
| Pied de page | `footer`     | `nuit`           | `clair`, `compact`                                                                                          |

- En développement, un panneau « Maquettes » s'affiche en bas à gauche.
- En production : ajouter `?maquettes` à l'adresse, ex. `/?maquettes&hero=cycle&domaines=sommaire`.

**À terme**, supprimer `layouts/variants/`, le panneau, et les composants non retenus
(voir [Recettes](#retirer-le-comparateur-de-maquettes)).

## 6. Charte graphique et règles de contenu

Ces règles viennent de la charte V2 d'OPEM et de demandes explicites du client. **Non négociables.**

**Couleurs** — uniquement les 12 couleurs déclarées dans `styles/global.css` (`--opem-*`).

- Pas de dégradé, pas de mode sombre.
- Le **bleu OPEM** ne touche jamais le **bleu nuit** (`#11365B`). Sur bleu nuit : blanc et bleu 30 %.
- Pas de texte vert ou ambre sur fond blanc. Pas d'ambre sur les boutons, les liens ni dans la
  barre / le pied de page (choix du client).
- Barre en bleu nuit : dérogation au « fond blanc » de la charte, demandée par le client.

**Photos et médias**

- **Jamais de texte posé sur une photo ou une vidéo.** Texte à côté, ou sur un bandeau uni.
- Photos libres de droits uniquement ; écrans ou documents lisibles floutés.

**Textes**

- **Ne jamais inventer** de chiffres, de clients, de noms, de délais ou d'agréments : écrire
  `[à confirmer]` et laisser `provisional: true`.
- Ne jamais écrire « DAS ».
- Typographie française : espace insécable (` `) avant `?`, `!`, `:`, `;`.

## 7. Langues (FR / AR)

- La bascule FR / عربي (`i18n/`) change `<html lang dir>` ; toute la page passe en miroir.
- CSS : toujours les propriétés **logiques** (`margin-inline-start`, `padding-inline`,
  `inset-inline-start`…), jamais `left` / `right`. Les flèches se retournent via `--dir`.
- Polices : Poppins (latin) et Cairo (arabe), auto-hébergées via `@fontsource`, importées dans
  `styles/global.css` (aucun appel à Google Fonts : CSP stricte).
- En arabe, pas d'espacement entre lettres (casse la liaison) : voir les règles `:lang(ar)`.
- Les traductions arabes sont **à faire valider** par OPEM.

## 8. Animations et défilement

Tout est désactivé si l'utilisateur a demandé moins d'animations (`prefers-reduced-motion`).

| Mécanisme                        | Où                                        | Utilisation                                                                                                                    |
| -------------------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Défilement fluide (Lenis 1.3.26) | `hooks/useSmoothScroll.ts`                | Molette uniquement. `data-lenis-prevent` / `data-lenis-prevent-horizontal` pour exclure une zone                               |
| Apparitions                      | `hooks/useScrollReveal.ts` + `global.css` | Ajouter `data-reveal`, `data-reveal="title"` (flou → net), `data-reveal="image"` ou `data-reveal-stagger` (enfants en cascade) |
| Zoom au défilement               | `data-scroll-zoom`                        | Vidéo de l'accroche, navigateurs avec `animation-timeline: view()`                                                             |
| Préchargement                    | `hooks/usePreloadImages.ts`               | Décode les photos d'un carrousel avant qu'on y arrive                                                                          |
| Hors écran                       | `hooks/useOffscreen.ts`                   | Pose `data-offscreen` : met en pause les carrousels automatiques                                                               |

Un seul `IntersectionObserver` gère toutes les apparitions ; un `MutationObserver` prend en compte
les éléments ajoutés plus tard (filtres, changement de langue).

## 9. Médias (vidéo, photos)

### Vidéo d'accueil — `public/videos/hero-opem.mp4` (+ `hero-opem.jpg`, première image)

Montage de 12 s, 1,7 Mo, sans son, 1280 × 720, H.264 `+faststart`, en attendant un tournage au
cabinet. 4 plans Pexels de 3,5 s, fondus de 0,6 s :

| Plan            | Vidéo Pexels | Départ | Remarque                            |
| --------------- | ------------ | ------ | ----------------------------------- |
| Conseil         | 7691633      | 27 s   |                                     |
| Chantier (BTPH) | 8964792      | 3 s    |                                     |
| Formation       | 8716582      | 1 s    | Chiffres de l'écran projeté floutés |
| Industrie       | 18101973     | 1 s    |                                     |

Lue sur tous les écrans (image fixe en mouvement réduit). Adresse dans
`features/home/sections/heroMedia.ts`.

### Photos — `public/images/`

- `domaines/` : une photo 4:3 par domaine. `accompagnement.jpg` est un montage en Y de 3 photos
  Pexels (8961027, 2760241, 3183197) ; `formations.jpg` : Pexels 18999540.
- `actualites/` : illustrations des publications d'exemple.
- Toutes provisoires (Pexels / Unsplash, licences gratuites). À vérifier avant mise en ligne
  définitive : un logo de marque (NLMK) est visible sur `certification.jpg`.

### Remplacer un média sous le même nom

Les navigateurs gardent parfois l'ancienne version. Après un remplacement, **augmenter le numéro
`?v=`** dans l'adresse (`heroMedia.ts` pour la vidéo, `content.ts` pour les photos). Voir § 11.

## 10. Menu WordPress

Le menu se gère dans **WordPress > Apparence > Menus**. Le plugin `wordpress/opem-menu-api.php`
l'expose en JSON ; `lib/wordpress.ts` le lit et **revalide** toute la réponse (forme, longueurs,
protocoles des liens).

1. Copier `wordpress/opem-menu-api.php` dans `wp-content/mu-plugins/`.
2. Assigner un menu à « Menu principal (FR) » et un autre à « Menu principal (AR) ».
3. Renseigner `VITE_WP_API_URL=https://site/wp-json` puis relancer.
4. Si WordPress est sur un autre domaine : l'ajouter à `connect-src` dans la CSP (§ 11).

Sans WordPress (ou s'il ne répond pas), le menu intégré `layouts/navbar/menu.ts` s'affiche.

- **Libellé court** dans la barre : Options de l'écran > « Attribut de titre ».
- **Méga-menu** : dès qu'une entrée a une « Description » (Options de l'écran > « Description »).
- Arborescence validée par OPEM : 8 rubriques (Accueil, Le cabinet, Nos expertises, Formation
  qualifiante, Missions et réalisations, Éclairages, Actualités, Contact), avec un 3ᵉ niveau
  affiché en retrait.

## 11. Déploiement et cache

- **Vercel** : chaque push sur `main` déclenche un build (`npm run build`, sortie `dist/`).
- **`vercel.json` est la configuration de production** : réécriture de toutes les routes vers
  `index.html` (SPA), en-têtes de sécurité, cache. Vercel **ignore** `public/_headers` (gardé
  pour Netlify / Cloudflare Pages).
- La CSP existe à **trois endroits à garder synchronisés** : `vercel.json`, `public/_headers`,
  `vite.config.ts` (pour `npm run preview`).

| Fichiers                 | Cache                        | Pourquoi                                                       |
| ------------------------ | ---------------------------- | -------------------------------------------------------------- |
| `/assets/*` (JS, CSS)    | 1 an, `immutable`            | Nom contenant un hash : change à chaque build                  |
| `/images/*`, `/videos/*` | `max-age=0, must-revalidate` | Nom fixe : revérifié à chaque visite (réponse 304 si inchangé) |
| `index.html`             | défaut Vercel (revalidé)     |                                                                |

Les noms de fichiers du build diffèrent entre votre machine et Vercel (le hash des classes CSS
dépend du chemin du projet) : c'est normal, le rendu est identique.

## 12. Sécurité

- **Aucun secret côté client** ; `.env*` ignorés par Git sauf `.env.example`.
- **CSP stricte** : `script-src 'self'`, pas de script ni de style externe, polices auto-hébergées.
  Tout nouveau service externe doit être autorisé explicitement dans la CSP.
- **XSS** : React échappe le texte ; ESLint interdit `dangerouslySetInnerHTML`, `eval`, `javascript:`.
- **Client HTTP** (`lib/http.ts`) : délai maximal, cookies limités au même domaine, URL absolues refusées.
- Autres en-têtes : HSTS, `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`.
- Dépendances en **versions exactes** (`.npmrc` : `save-exact`), `npm run audit` régulièrement.
- Pas de source maps en production ; détail des erreurs affiché seulement en développement.
- **Ne jamais committer** : `.env.local`, le dossier `Downloads/` (documents personnels, signatures),
  les photos d'origine à la racine (`/*.jpg`, `/*.png`). Tous exclus par `.gitignore`.

## 13. Qualité, tests et conventions

- **Tests** (Vitest + Testing Library, jsdom) : à côté du composant (`*.test.tsx`). Ils vérifient
  le comportement visible et l'accessibilité (rôles, `aria-*`), pas le détail du CSS.
  `matchMedia` vaut `false` par défaut dans les tests (= ordinateur, animations autorisées) :
  le simuler avec `vi.spyOn(window, 'matchMedia')` pour tester le mobile.
- **Accessibilité** visée : WCAG 2.2 AA. Motifs WAI-ARIA (onglets, accordéons), boutons pause
  sur tout ce qui bouge seul (2.2.2), contrastes AA, focus visible, lien d'évitement.
- **Format** : Prettier (guillemets simples, 100 colonnes), `.editorconfig` (UTF-8, LF, 2 espaces).
  `.gitattributes` force les fins de ligne LF.
- **Commentaires et commits en français**, comme le reste du code.
- **Commits** : un message qui dit _ce qui change pour le site_, pas le détail technique.

## 14. Reste à faire

**Contenus (à fournir ou valider par OPEM)**

- [ ] Chiffres repères, publications, témoignages (avec accord écrit), réponses de la FAQ.
- [ ] Traductions arabes.
- [ ] Vraies photos (même nom de fichier, 4:3 pour les domaines) et, idéalement, une vidéo
      tournée au cabinet ; licence de `certification.jpg` (logo NLMK).

**Développement**

- [ ] Pages du menu : seules `/`, `/about` et `/contact` existent (et les deux dernières sont
      des ébauches). Toutes les autres routes de `menu.ts` (`/expertises/…`, `/formation/…`,
      `/missions/…`, `/eclairages/…`, `/actualites/…`, `/le-cabinet`, mentions légales…)
      affichent la page 404.
- [ ] Formulaire « Être rappelé » / demande de devis (`/contact`).
- [ ] Brancher publications et actualités sur WordPress (aujourd'hui dans `content.ts`).
- [ ] Retirer le comparateur de maquettes et les variantes non retenues.
- [ ] Passer le dépôt GitHub en privé si le contenu doit rester confidentiel.

## 15. Recettes

### Modifier un texte de l'accueil

`src/features/home/content.ts` : chaque section a son bloc `fr` et `ar`, typé (TypeScript signale
toute clé oubliée dans une des deux langues).

### Changer les coordonnées

`src/config/company.ts` uniquement (adresse FR/AR, téléphone, e-mail, lien de carte).

### Ajouter une page

1. Créer `src/features/<nom>/<Nom>Page.tsx` avec un `export default`.
2. Déclarer la route dans `src/app/router.tsx` :
   ```ts
   { path: 'expertises', lazy: async () => ({ Component: (await import('@/features/expertises/ExpertisesPage')).default }) },
   ```
3. Le lien existe déjà dans le menu (`menu.ts` ou WordPress) : vérifier que le chemin correspond.

### Ajouter une section à l'accueil

1. `sections/MaSection.tsx` + `MaSection.module.css` (+ `MaSection.test.tsx`).
2. Ses textes FR et AR dans `content.ts` (type + deux langues).
3. L'insérer dans `HomePage.tsx` ; ajouter `data-reveal` sur les éléments à faire apparaître.
4. Mettre à jour l'ordre des titres testé dans `HomePage.test.tsx`.

### Remplacer la vidéo d'accueil

1. Remplacer `public/videos/hero-opem.mp4` (≤ 3 Mo, sans son, 1280 × 720, H.264, `+faststart`)
   et `hero-opem.jpg` (sa première image).
2. Augmenter `?v=` dans `HERO_VIDEO_SRC` (`heroMedia.ts`) et dans les tests qui le vérifient.

Avec ffmpeg, pour une vidéo web légère :

```bash
ffmpeg -i source.mp4 -an -vf "scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720" \
  -c:v libx264 -preset slow -crf 26 -pix_fmt yuv420p -movflags +faststart hero-opem.mp4
ffmpeg -i hero-opem.mp4 -frames:v 1 -q:v 3 hero-opem.jpg
```

### Retirer le comparateur de maquettes

1. Dans `RootLayout.tsx` et `HomePage.tsx`, remplacer la lecture de la variante par les
   composants retenus (`editorialenuit`, `HeroFacts`, `DomainsAuto`, `Insights`, pied `nuit`).
2. Supprimer `src/app/layouts/variants/`, les composants non retenus et leurs tests.
3. `npm run build` et `npm test` doivent passer ; vérifier `?maquettes` (sans effet désormais).

## 16. Historique

| Date       | Commit    | Changements                                                                                                    |
| ---------- | --------- | -------------------------------------------------------------------------------------------------------------- |
| 2026-10-26 | `7dbc197` | Site initial : barre, accueil, pied de page, FR/AR, menu WordPress, comparateur de maquettes                   |
| 2026-10-26 | `0b06f7c` | Versions retenues par OPEM par défaut ; configuration Vercel (`vercel.json`)                                   |
| 2026-10-27 | `39ff135` | Vidéo d'accueil (montage Pexels) ; photos Accompagnement (montage en Y) et Formations                          |
| 2026-10-27 | `b567ab0` | Plan formation en vidéo ; fondu des photos de « Nos domaines » ; plus de bande blanche sous la barre           |
| 2026-10-27 | `806ac9f` | Version mobile : vidéo dès le 1ᵉʳ écran, éclairages à faire glisser, pied de page en accordéon, FAQ réordonnée |

Choix structurants pris en cours de route :

- **Retrait de six sections** de l'accueil (besoins, publics, approche, chiffres, secteurs, agenda)
  pour une page plus courte : fichiers conservés.
- **Pas de pause au survol** des carrousels automatiques (la souris qui passait les faisait
  s'arrêter et repartir) ; pause au clavier, au bouton et hors écran à la place.
- **Images superposées en fondu** dans les carrousels plutôt que remplacées : plus de flash blanc
  ni d'ancienne photo visible un instant.
- **Version mobile** calquée sur les usages de McKinsey, Bain et Accenture : un visuel dès le
  premier écran, des cartes qu'on fait glisser, un pied de page court.
