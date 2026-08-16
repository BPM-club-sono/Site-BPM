# Site Web BPM - React + TypeScript

Site statique BPM construit avec React, TypeScript et Vite.

## Pré-requis

- Node.js `24.x`
- npm `>=10`

## Installation

```bash
npm install
```

## Commandes

```bash
npm run dev
npm run build
npm run preview
npm run typecheck
npm run lint
npm run test
```

## Docker

Construire l'image :

```bash
docker build -t site-bpm .
```

Lancer en local :

```bash
docker run --rm -p 8080:80 site-bpm
```

## Modifier les informations "hardcodées"

### 1) Modifier l'organigramme (`/equipe`)

Un mandat = un fichier de données. Fichiers concernés :

- `src/features/team/data/teamMembers<annee>.ts` (données des membres d'un mandat, ex. `teamMembers28.ts`)
- `src/features/team/data/teamRosters.ts` (liste ordonnée des mandats affichés en onglets, du plus récent au plus ancien)
- `src/features/team/constants.ts` (taille de canvas si besoin de plus d'espace)

Chaque fichier `teamMembers<annee>.ts` contient un tableau d'objets :

```ts
{
  id: "identifiant-unique",
  name: "Prénom",
  role: "Rôle",
  photo: photoImportee,
  x: 0,
  y: 0
}
```

Règles pratiques :

- `id` doit rester unique **dans le fichier de son mandat** (deux mandats différents peuvent réutiliser le même id).
- `x` / `y` pilotent la position de la carte sur le canvas.
- Pour une nouvelle photo, ajouter le fichier dans `src/assets/pp_team/<annee>/`, importer l'image dans le `teamMembers<annee>.ts` correspondant, puis l'utiliser dans `photo`.
- Le grand nombre affiché sur `/equipe` est le `year` du mandat sélectionné (pas l'effectif) — vient automatiquement de `teamRosters.ts`, rien à mettre à jour manuellement.
- Pour ajouter un nouveau mandat : créer `teamMembers<annee>.ts`, puis l'ajouter en tête de la liste dans `teamRosters.ts` pour qu'il devienne l'onglet par défaut.
- Pas besoin d'ajuster le zoom : au chargement, au changement de mandat et au clic sur `Reset`, la vue se cadre automatiquement sur les cartes du mandat affiché, quelle que soit la taille de l'écran.
- Réglages de ce cadrage dans `src/features/team/constants.ts` : `TEAM_FIT_PADDING` (marge laissée autour des cartes), `TEAM_MIN_SCALE` / `TEAM_MAX_SCALE` (bornes de zoom). Sur un écran étroit, le zoom bute sur `TEAM_MIN_SCALE` et il faut faire glisser pour voir le reste : baisser cette valeur si besoin.
- `TEAM_CANVAS_WIDTH` / `TEAM_CANVAS_HEIGHT` ne servent plus qu'à dimensionner la zone déplaçable, pas le cadrage.

### 2) Modifier les mails de contact (section contact de l'accueil)

Fichier concerné :

- `src/features/home/data/contact.ts`

Champs à modifier :

- `primaryRecipientEmail` : destinataire principal.
- `ccRecipientEmails` : liste des personnes en copie.

Le lien `mailto:` est généré automatiquement via `buildMailtoHref`, donc il ne faut modifier que ces variables.

### 3) Ajouter des événements

Il y a 2 zones indépendantes :

#### A. Carrousel d'images sur l'accueil

Fichier de logique :

- `src/features/home/data/eventSlides.ts`

Action à faire :

- Ajouter vos images dans `src/assets/events/` (`.jpg`, `.jpeg`, `.png`, `.webp`).

Notes :

- Les images sont chargées automatiquement.
- L'ordre d'affichage suit l'ordre alphabétique des noms de fichiers.
- Le texte `alt` est généré depuis le nom du fichier.

#### B. Timeline détaillée sur `/event`

Fichier de logique :

- `src/features/events/EventsPage.tsx`

Action à faire :

1. Créer un dossier dans `src/assets/events_page/` (exemple : `nuit-2026`).
2. Ajouter un `data.json` dans ce dossier.
3. Ajouter les photos de l'événement dans le même dossier.

Format attendu pour `data.json` :

```json
{
  "data": {
    "name": "NOM EVENT",
    "order": 5,
    "when": "Jan 2026",
    "personnes": 1200,
    "where": "Paris",
    "prix": 9000
  },
  "content": ["Point 1", "Point 2", "Point 3"]
}
```

Règles pratiques :

- `order` détermine la position dans la timeline (tri croissant).
- Utiliser un `order` unique par événement.
- Les images supportées : `.jpg`, `.jpeg`, `.png`, `.webp`, `.avif`.
- Le nom du dossier sert de `slug` technique.

### 4) Modifier le matériel (section "Notre Équipement")

Fichier concerné :

- `src/features/home/data/equipmentCards.ts`

Chaque carte suit cette structure :

```ts
{
  id: "identifiant-unique",
  label: "Catégorie",
  title: "Nom affiché",
  image: imageImportee,
  gridColumn: "1 / span 1",
  gridRow: "1"
}
```

Pour ajouter/modifier du matériel :

1. Ajouter l'image dans `src/assets/equipment/` (ou un autre dossier `src/assets/`).
2. Importer l'image dans `equipmentCards.ts`.
3. Ajouter/mettre à jour l'objet correspondant dans `equipmentCards`.

Règles pratiques :

- `id` doit être unique.
- `gridColumn` et `gridRow` contrôlent la position dans la grille.
- Si 2 cartes se superposent visuellement, ajuster `gridColumn` / `gridRow`.

### 5) Modifier les logiciels et partenaires (logos)

Fichier concerné :

- `src/features/home/data/logos.ts`

Deux listes sont affichées sur la home :

- `softwareLogos` : section "Logiciels que nous maîtrisons"
- `trustLogos` : section "Ils nous font confiance"

Chaque entrée suit cette structure :

```ts
{
  image: logoImporte,
  alt: "Texte alternatif",
  primary: "Nom affiché"
}
```

Pour ajouter/modifier un logo :

1. Ajouter l'image dans `src/assets/software/` (logiciels) ou `src/assets/partners/` (partenaires).
2. Importer l'image dans `logos.ts`.
3. Ajouter/mettre à jour l'objet dans `softwareLogos` ou `trustLogos`.

Règles pratiques :

- `alt` doit décrire correctement le logo (accessibilité).
- `primary` est le texte visible dans le bandeau.

### 6) Autres données statiques importantes

- Menu et liens sociaux : `src/shared/config/navigation.ts`

## Structure

```text
src/
  app/
  features/
    events/
    home/
    team/
  shared/
  styles/
```
