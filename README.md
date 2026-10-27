# Website v3

React 19 · TypeScript · Vite 8 · React Router 8 · Vitest — site OPEM (FR / AR)

## Démarrer

```bash
npm install
cp .env.example .env.local   # Windows : copy .env.example .env.local
npm run dev                  # http://localhost:5173
```

## Commandes

| Commande          | Rôle                                                       |
| ----------------- | ---------------------------------------------------------- |
| `npm run dev`     | Serveur de développement avec rechargement à chaud         |
| `npm run build`   | Vérifie les types puis génère le site dans `dist/`         |
| `npm run preview` | Sert `dist/` en local, avec la CSP de production           |
| `npm run lint`    | Analyse le code (qualité + règles de sécurité)             |
| `npm run format`  | Formate tout le code avec Prettier                         |
| `npm test`        | Lance les tests une fois (`npm run test:watch` en continu) |
| `npm run audit`   | Cherche des failles connues dans les dépendances           |

## Structure

```
src/
├── app/            Assemblage de l'application
│   ├── App.tsx         providers globaux + routeur
│   ├── router.tsx      liste des routes (pages chargées à la demande)
│   ├── RouteError.tsx  page d'erreur
│   └── layouts/        mises en page communes (en-tête, pied de page)
├── features/       Un dossier par fonctionnalité / page
│   └── home/           HomePage.tsx, son hook, ses tests…
├── components/ui/  Composants génériques réutilisables (Button…)
├── lib/            Utilitaires sans React (env, client HTTP)
├── styles/         CSS global et variables de design
└── test/           Configuration des tests
```

**Règles simples pour rester modulaire**

- Tout ce qui concerne une page ou une fonctionnalité vit dans `features/<nom>/` : composants, hooks, styles, tests.
- Un composant utilisé par plusieurs features monte dans `components/`.
- Une feature n'importe pas une autre feature. Si deux features partagent du code, il monte dans `components/` ou `lib/`.
- Imports absolus avec l'alias `@/` : `import { Button } from '@/components/ui/Button'`.
- Styles : un fichier `Composant.module.css` à côté du composant (classes isolées automatiquement).

**Ajouter une page**

1. Créer `src/features/contact/ContactPage.tsx` avec un `export default`.
2. Ajouter la route dans `src/app/router.tsx` :
   ```ts
   { path: 'contact', lazy: async () => ({ Component: (await import('@/features/contact/ContactPage')).default }) },
   ```
3. Ajouter le lien dans le menu WordPress (voir ci-dessous), ou dans le menu intégré `src/app/layouts/navbar/menu.ts`.

## Barre de navigation et menu WordPress

Le menu se gère dans **WordPress > Apparence > Menus**, comme avec `wp_nav_menu`.
React ne peut pas appeler cette fonction PHP : le plugin `wordpress/opem-menu-api.php`
expose donc le même menu en JSON, et la barre React l'affiche.

1. Copier `wordpress/opem-menu-api.php` dans `wp-content/mu-plugins/` du site WordPress.
2. Dans Apparence > Menus, assigner un menu à « Menu principal (FR) » et un autre à « Menu principal (AR) ».
3. Renseigner `VITE_WP_API_URL=https://votre-site/wp-json` dans `.env.local`, puis relancer.
4. Si WordPress est sur un autre domaine, l'ajouter à `connect-src` dans la CSP (`public/_headers` et `vite.config.ts`).

Sans `VITE_WP_API_URL`, ou si WordPress ne répond pas, le menu intégré (`menu.ts`) s'affiche.
Arborescence validée par OPEM : 8 rubriques (Accueil, Le cabinet, Nos expertises, Formation
qualifiante, Missions et réalisations, Éclairages, Actualités, Contact), leurs sous-pages, et un
troisième niveau affiché en retrait (ex. « Diagnostic d'entreprise » sous « Accompagnement des
organisations »).

Sur ordinateur, la barre n'affiche pas « Accueil » (le logo y mène) et utilise des libellés
courts (« Expertises », « Formation », « Réalisations ») : dans WordPress, Options de l'écran >
cocher « Attribut de titre », puis y saisir le libellé court. Les noms complets restent dans les
sous-menus, le menu mobile et le pied de page. En dessous de 1280 px, le menu passe en burger.

**Méga-menu** : un sous-menu devient un panneau large dès qu'une de ses entrées a une
description. Dans WordPress : Apparence > Menus > Options de l'écran > cocher « Description »,
puis remplir ce champ pour chaque lien.

**Charte** : les douze couleurs de la charte V2 sont dans `src/styles/global.css` (aucune autre).
Pas de dégradé, pas de mode sombre, pas de texte vert ou ambre sur fond blanc,
bleu OPEM jamais collé au bleu nuit. Choix du client : boutons bleu OPEM, pas d'ambre
dans la barre ni dans le pied de page (seuls les grands chiffres clés sont en ambre).

**Langues** : le bouton FR / عربي change `<html lang dir>` ; en arabe, toute la page passe en miroir.
Pour que les mises en page suivent, utiliser les propriétés CSS « logiques »
(`margin-inline-start`, `padding-inline-end`, `inset-inline-start`…) plutôt que `left`/`right`.

**Logo** : `public/logo-opem.svg` est le logo officiel en version blanche à aile verte
(version prévue par la charte sur bleu nuit), vectorisé depuis `OPEM_logo_blanc.pdf`.

## Comparer les maquettes (barre, bandeau d'accueil, pied de page)

Huit barres de navigation, dix bandeaux d'accueil et trois pieds de page sont disponibles.
**Versions retenues par OPEM**, affichées par défaut (sans `?maquettes`) : barre « Éditoriale
bleu nuit », bandeau « Repères », domaines « Carrousel animé », éclairages « À la une », pied de
page « Bleu nuit » (`DEFAULTS` dans `layouts/variants/layoutVariants.ts`).

Bandeaux d'accueil : 1. Réseau 3D (actuel) ; 2. Cycle OPEM — grand titre, puis la démarche
(Diagnostiquer, Structurer et former, Certifier) racontée par un schéma animé dont les étapes
défilent seules, avec bouton pause (`?maquettes&hero=cycle`). Textes dans `content.ts` (`heroCycle`) ; 3. Vidéo ruche — texte sur panneau bleu nuit, vidéo `public/videos/hero-opem.mp4` à côté (jamais
de texte sur l'image), bouton pause (`?maquettes&hero=video`). En mouvement réduit,
seule l'image fixe `hero-opem.jpg` est chargée. Vidéo actuelle (`hero-opem.mp4`, 12 s, 1,7 Mo) : montage
de 4 plans libres de droits Pexels (conseil 7691633, chantier 8964792, formation 8716582 — chiffres de l'écran floutés, industrie
18101973), en attendant un tournage au cabinet. Pour changer de vidéo : remplacer ces deux fichiers
(même nom), idéalement une vidéo de moins de 3 Mo, sans son ; 4. Vidéo immersive — même vidéo dans un grand cadre arrondi, sous un voile bleu nuit uniforme
(texte lisible, contraste AA), titre centré, carte « De quoi avez-vous besoin ? » et pastille des
repères (`?maquettes&hero=immersive`, idéal avec la barre `nav=flottante`). Le voile est une
entorse à la règle « pas de texte sur les photos » : à faire valider par OPEM ; 5. Éditorial cabinet — très grand titre, vidéo dans une fenêtre qui se dévoile, légende sur
bandeau bleu nuit (conforme à la charte), badge circulaire « Beyond Quality », puis les trois
métiers en liens (`?maquettes&hero=editorial`). Textes dans `content.ts` (`heroEditorial`) ; 6. Éditorial bleu nuit — le même en couleurs inversées : fond bleu nuit, textes blancs, légende
sur bandeau blanc, bouton blanc (`?maquettes&hero=editorialnuit`, idéal avec `nav=editorialenuit`) ; 7. Autodiagnostic — sur bleu nuit, titre, la question « Quelle est votre priorité cette année ? » et
cinq grandes réponses ; la vidéo occupe la moitié droite, comme le bandeau 3 ; aucune autre animation
(`?maquettes&hero=diagnostic`). Les quatre premières mènent à `/autodiagnostic?priorite=…` (page à
créer), « Nos formations » au catalogue. Textes dans `content.ts` (`heroDiagnostic`) ; 8. Trois questions — à la place du titre, sur bleu nuit, trois questions empilées en blanc (« Un audit de
certification approche ? », « Des équipes à former ? », « Une décision importante à préparer ? »),
chacune un lien vers son domaine, puis « OPEM vous accompagne, du diagnostic au résultat. » et le
bouton blanc « Être rappelé » ; vidéo sur la moitié droite (`?maquettes&hero=questions`). Textes dans
`content.ts` (`heroQuestions`) ; 9. Public / entreprise — sur bleu nuit, titre puis deux grands blocs côte à côte (fond bleu 10 %,
bordure gris clair) : « Vous êtes un organisme public » et « Vous êtes une entreprise », chacun avec
un pictogramme, ses trois sujets en étiquettes, une phrase et un lien ; vidéo à droite (`?maquettes&hero=publics`). Textes dans
`content.ts` (`heroAudiences`). La vidéo des bandeaux 7 à 10 est le composant `HeroSideVideo` ; 10. Repères — sur bleu nuit, titre, texte, bouton devis et liens « Nos expertises » / « Nos formations », puis une ligne de trois faits séparés par un
trait gris clair ; vidéo à droite (`?maquettes&hero=reperes`). Les valeurs (15 ans, +120 organisations, +2 000 personnes formées) sont
des **exemples** : la mention « Chiffres provisoires, à confirmer par OPEM » s'affiche tant que
`provisional` vaut true dans `content.ts` (`heroFacts`).

| N°  | Barre de navigation                                 | Pied de page                          |
| --- | --------------------------------------------------- | ------------------------------------- |
| 1   | Bleu nuit (actuelle)                                | Bleu nuit (actuel)                    |
| 2   | Blanche, logo couleur                               | Clair (bleu très clair), logo couleur |
| 3   | Éditoriale : blanche, sous-menus pleine largeur     | Compact : une seule bande             |
| 4   | Éditoriale bleu nuit : la même, logo blanc          |                                       |
| 5   | Capsule flottante : barre arrondie détachée         |                                       |
| 6   | Logo centré, menu sur une bande bleu nuit dessous   |                                       |
| 7   | Plein écran : bouton « Menu », grand menu éditorial |                                       |
| 8   | Prestige : la n° 4 avec un méga-menu riche          |                                       |

Méga-menu « prestige » (barre 8) : introduction de la rubrique (champ « Description » de
l'entrée principale dans WordPress), liens numérotés, et un encart « Prendre rendez-vous »
(photo de la ruche, texte sur bandeau bleu nuit), absent de la rubrique Contact.

- En développement (`npm run dev`), un panneau « Maquettes » apparaît en bas à gauche.
- En production, ajouter `?maquettes` à l'adresse, ou un lien direct :
  `/?maquettes&nav=blanche&footer=clair` (valeurs : `nuit`, `blanche`, `flottante`, `centree`, `pleinecran`, `editoriale`, `editorialenuit`, `prestige` / `nuit`, `clair`, `compact` ; `hero=reseau`, `hero=cycle`, `hero=video`, `hero=immersive`, `hero=editorial`, `hero=editorialnuit`, `hero=diagnostic`, `hero=questions`, `hero=publics` ou `hero=reperes`).

Une fois le choix fait : garder la variante retenue comme version par défaut et supprimer
`src/app/layouts/variants/` ainsi que les variantes non retenues.

## Page d'accueil

Tous les textes (français et arabe) sont dans `src/features/home/content.ts`,
une section par composant dans `src/features/home/sections/`.

**Nos domaines** (juste sous l'accroche, `sections/Domains.tsx`) : onglets des cinq domaines (liste
déroulante sur mobile), un panneau par domaine, précédent / suivant, sans défilement automatique.
Textes dans `content.ts` (`domains`) ; ordre des domaines et mentions « [à confirmer] » à valider.
Deux maquettes à comparer (panneau « Maquettes » > Section « Nos domaines », ou `?maquettes&domaines=carrousel`) :

1. Onglets ; 2. Carrousel à panneaux — bandes bleu nuit numérotées, le domaine actif s'ouvre en grand
   panneau blanc (accordéon vertical sur mobile), compteur « 02 / 05 » et barre d'avancement ; 3. Carrousel animé (`domaines=anime`) — fond bleu OPEM, grande carte blanche, défile seul toutes
   les 7 s (barre de progression dans chaque onglet), avec bouton pause, pause au clavier et quand la section n'est pas à l'écran,
   et sans défilement si l'utilisateur a demandé moins d'animations ; 4. Sommaire éditorial (`domaines=sommaire`) —
   bleu nuit, sommaire numéroté dont la ligne active s'ouvre, grande photo à droite qui se dévoile puis zoome,
   défile seul toutes les 8 s avec les mêmes règles de pause.
   Photos provisoires (images des vidéos) dans `public/images/domaines/` : à remplacer par de vraies
   photos 4:3, même nom de fichier, sans texte dessus.

**Éclairages et actualités** (sous « Nos domaines », `sections/Insights.tsx`) : cartes à la manière
des pages « Insights » des grands cabinets — filtres Tout / Éclairages / Actualités, une publication à
la une, deux cartes compactes, puis des cartes à image. Deuxième maquette (`?maquettes&eclairages=rail`,
`sections/InsightsRail.tsx`) : rail défilant sur bleu très clair, cartes blanches (la une compte
double), flèches, barre d'avancement, rail qui court jusqu'au bord de l'écran. Les six publications de `content.ts`
(`insights`) sont des **exemples** (mention affichée tant que `provisional` vaut true) : à remplacer
par les vrais articles, puis à brancher sur WordPress.

**Témoignages** (dernière section de l'accueil, `sections/Testimonials.tsx`) : grande citation sur
carte blanche, liste des témoignages à côté (pastilles sur téléphone), flèches et compteur, sans
défilement automatique. Pas de photo de personne : un pictogramme indique le type d'organisme. Les
quatre témoignages de `content.ts` (`testimonials`) sont des **exemples** (noms et organismes
« [à confirmer] ») : à remplacer par de vrais témoignages, publiés avec l'accord écrit de leurs auteurs.

**Questions fréquentes** (dernière section, `sections/Faq.tsx`) : titre et encadré « Vous ne trouvez
pas votre réponse ? » à gauche (restent visibles au défilement), questions en accordéon à droite ;
sur téléphone, l'encadré passe après les questions.
Les six réponses de `content.ts` (`faq`) sont **provisoires** : aucun délai, tarif ni agrément
inventé (« [à confirmer] ») ; à valider par OPEM.

**Sections retirées de l'accueil** à la demande du client : « Quel est votre besoin ? »,
« Vous êtes… », approche (« Trois temps… »), chiffres clés, secteurs et agenda des prochaines
formations. Leurs fichiers (`sections/Needs`, `Audiences`, `Approach`, `KeyFigures`, `Sectors`,
`Trainings`) et leurs textes restent en place : une ligne dans
`HomePage.tsx` suffit pour remettre une section.

**À valider par OPEM avant la mise en ligne** : tant que `provisional: true`, une mention
« à confirmer » s'affiche sous la section concernée. Les illustrations de « Vous êtes… »
(`public/images/vous-etes-*.svg`) sont à remplacer par de vraies photos, même nom de fichier.

**Pied de page** : une colonne par rubrique ayant des sous-pages, puis « Découvrir », générées à partir
du menu principal (donc modifiables dans WordPress). Sur téléphone, les coordonnées passent avant
le plan du site, dont chaque rubrique se replie en accordéon. Les coordonnées (téléphone, e-mail,
adresse) se modifient à un seul endroit : `src/config/company.ts`.

**Version mobile** (inspirée des sites de McKinsey, Bain et Accenture) : la vidéo d'accueil est lue
aussi sur téléphone, juste sous les boutons (les chiffres repères passent après) ; les éclairages
forment une rangée de cartes qu'on fait glisser ; espacement entre sections un peu réduit.

**Barre bleu nuit** (`--color-nav-bg` dans `global.css`) : dérogation au fond blanc de la charte.
Sur ce fond, liens et focus sont en blanc (le bleu OPEM n'y serait pas lisible).

## Sécurité

- **Pas de secret côté client.** Toute variable `VITE_*` est lisible dans le navigateur. Les clés privées restent sur un serveur.
- **`.env*` ignorés par Git**, sauf `.env.example`.
- **XSS** : React échappe le texte par défaut. ESLint interdit `dangerouslySetInnerHTML`, `eval` et les URL `javascript:`.
- **En-têtes HTTP** : CSP stricte, anti-clickjacking, HSTS… définis dans `public/_headers` (Netlify, Cloudflare Pages) et dans `vite.config.ts` pour `npm run preview`. Les garder synchronisés. Si vous ajoutez un service externe (Google Fonts, API sur un autre domaine…), il faut l'autoriser dans la CSP.
- **Client HTTP** (`src/lib/http.ts`) : délai maximal, cookies limités au même domaine, URL absolues refusées.
- **Erreurs** : le détail technique n'est affiché qu'en développement.
- **Dépendances** : versions exactes (`.npmrc`), lancer `npm run audit` régulièrement.
- **Pas de source maps** en production.

## Performance

- Chaque page est un fichier JS séparé chargé à la visite (code splitting).
- Le build minifie et ajoute un hash aux fichiers : ils peuvent être mis en cache un an (`/assets/*` dans `public/_headers`).

## Défilement et apparitions

- **Défilement fluide** à la molette : [Lenis](https://github.com/darkroomengineering/lenis)
  (`hooks/useSmoothScroll.ts`, ~5 Ko). Le défilement reste celui du navigateur (clavier, barre,
  liens d'ancre, éléments sticky) ; au doigt, rien ne change. Les `<dialog>` (menus) et les zones
  `data-lenis-prevent` / `data-lenis-prevent-horizontal` (rail de cartes) sont laissés au navigateur.
- **Apparitions au défilement** : un seul observateur (`hooks/useScrollReveal.ts`) pose
  `data-visible` sur les éléments marqués ; effets en CSS dans `styles/global.css` :
  `data-reveal` (fondu et montée), `data-reveal="title"` (le titre passe du flou au net),
  `data-reveal="image"` (le cadre se découvre, la photo se pose), `data-reveal-stagger` (les
  enfants montent l'un après l'autre). Pour animer un nouvel élément, il suffit d'ajouter l'attribut.
- **Vidéo du bandeau** : elle s'approche doucement quand on quitte le bandeau (animation liée au
  défilement, `data-scroll-zoom`, navigateurs récents seulement).
- Tout est désactivé si l'utilisateur a demandé moins d'animations (réglage du système).
