# Fonction : pont vers Historivision

## Ce que fait la fonction
- Sur les cartes de monuments, un bouton « Voir en 3D » ouvre une vue 3D dans la carte.
  Monuments prévus (ids des cartes) : `kheops`, `m-muraille`, `m-angkor`, `m-taj`, `fr-versailles`, `a-eiffel`.
  (Le Colisée et le Parthénon n'ont pas de carte propre dans les données : ils n'apparaissent que dans les étapes des récits de civilisation.)
- Le bouton n'apparaît **que si le fichier .glb existe** dans `public/modeles/` (vérification par une requête HEAD, sans téléchargement).
  Aucun modèle n'est fourni : pour l'instant, le bouton est donc invisible partout.
- La vue affiche : l'état (« aujourd'hui » ou « reconstitution »), une description texte visible (alternative textuelle), le crédit et la licence.
- Contrôles : souris/doigt, flèches du clavier sur la vue (focus visible), et 5 boutons (tourner, rapprocher, éloigner, recentrer) annoncés aux lecteurs d'écran.
- Rotation automatique coupée avec `prefers-reduced-motion`.
- Nouvelle page `#/historivision` qui présente le projet (« Bientôt sur place, avec ton téléphone »), sans date promise.

## Pourquoi `<model-viewer>` (nouvelle dépendance)
`@google/model-viewer` (Google, licence Apache 2.0) est l'élément web de référence pour afficher un modèle .glb,
avec des contrôles clavier et un texte alternatif déjà prévus. Le refaire à la main demanderait three.js
et beaucoup de code d'accessibilité. Il est **chargé seulement au premier clic** sur « Voir en 3D »
(fichier séparé d'environ 300 ko compressés) : la page d'accueil n'est pas alourdie. Aucun appel à un service externe.

## Comment tester
1. `npm run dev`, puis ouvrir `#/historivision`.
2. Déposer un fichier .glb libre (par ex. un modèle d'essai) sous `public/modeles/kheops.glb`,
   ouvrir la carte « La pyramide de Khéops » (étage Histoire) : le bouton « Voir en 3D » apparaît.
3. Tester au clavier (Tab jusqu'à la vue, flèches), et avec « réduire les animations » activé.

## Fichiers
- Nouveaux : `src/data/monuments3d.js`, `src/components/Vue3D.jsx`, `src/components/Historivision.jsx`, `public/modeles/LISEZMOI.md`.
- Modifiés (partagés) : `src/App.jsx` (import + route `historivision`, 3 lignes), `src/components/Carte.jsx` (1 ligne), `src/styles.css` et `src/theme.css` (ajouts en fin de fichier), `package.json`.
- `route.js` n'a pas changé : `#/historivision` passe par le mécanisme existant des pages spéciales.

## Limites / à vérifier par Pierre
- Trouver des modèles 3D sous licence libre et remplir crédit + licence dans `monuments3d.js`.
- Si un modèle est une reconstitution, passer `etat` à `'reconstitution'`.
- Relire les textes alternatifs et le texte de la page Historivision.
- Aucun lien vers `#/historivision` n'a été ajouté dans le menu (pour éviter les conflits) : à décider.
