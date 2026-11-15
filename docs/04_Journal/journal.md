# Journal de Chronos

## 15 novembre 2026 (soir) — La ligne à l'échelle

**Ce qui a été fait**
- Chaque étage a une seule ligne, plus large que l'écran, avec tous ses événements. On la fait glisser de côté (téléphone et ordinateur).
- Le menu « Aller à une période » emmène à la période choisie.
- La loupe a un curseur : le faire glisser fait défiler la ligne, et la ligne fait bouger le curseur.
- L'année cosmique devient une règle verticale fixe, à droite, commune à tous les étages.

**Décisions prises**
- Échelle proportionnelle **par période** ; un symbole // entre deux périodes ; les événements trop proches s'empilent sur plusieurs rangs.
- Le récit biblique est espacé régulièrement, avec la mention « récit, sans échelle de temps ».
- Sur ordinateur, la carte ouverte prend une colonne à droite.

**Questions ouvertes**
- Rédiger les fiches des nouveaux événements.

## 15 novembre 2026 (fin) — Les catégories dans le site

**Ce qui a été fait**
- Un menu déroulant « Choisir une période » dans chaque étage ; une seule catégorie affichée à la fois.
- 22 catégories, environ 85 événements (titre et date). Les 20 fiches complètes sont rangées dans leur catégorie.
- Histoire du christianisme : étiquettes « Selon la Bible » et « Fait historique » sur les cartes ; le récit biblique n'a pas de date dans le repère.

**Décisions prises**
- Univers et Aujourd'hui ont aussi leurs catégories. Archéen microbien fusionné avec le Protérozoïque. Contemporaine jusqu'en 1945.
- Les sources et les fiches complètes des nouveaux événements viendront plus tard.

**Questions ouvertes**
- Rédiger les fiches des nouveaux événements, catégorie par catégorie.

## 15 novembre 2026 (suite) — Des catégories dans les étages

**Ce qui a été fait**
- Proposition de structure : `03_Contenus/structure-categories.md` (catégories et 3 à 5 événements chacune, avec sources).

**Décisions prises**
- Chaque étage peut avoir des catégories, choisies dans un menu déroulant : une seule affichée à la fois.
- Histoire du christianisme : une rubrique « Selon la Bible » (récit et références) séparée des faits datés par les historiens.
- Le curseur à faire glisser est remis à plus tard.
- On valide d'abord la structure, puis on rédige les cartes, puis on code.

**Questions ouvertes**
- Les 4 questions en bas de `structure-categories.md`.

## 15 novembre 2026 (suite) — Premier prototype

**Ce qui a été fait**
- Code du site en React + Vite : accueil, 6 étages en défilement, frise verticale (téléphone) ou horizontale (ordinateur), une seule carte ouverte, repère double, style « ciel profond ».
- Accessibilité : vrais boutons, Échap ferme la carte et rend le focus, lien d'évitement, animations coupées si l'appareil demande moins de mouvement.
- Toutes les couleurs dans `src/theme.css`.

**Décisions prises**
- Sur téléphone, la carte rappelle la date de l'année cosmique, car elle cache le repère.
- Les points de la frise sont espacés régulièrement (pas à l'échelle) : c'est le repère qui donne l'échelle.

**Questions ouvertes**
- Créer le dépôt GitHub et le relier à Vercel.
- Choisir les vraies images des 20 cartes.

## 15 novembre 2026 — Feu vert pour le code

**Ce qui a été fait**
- Pierre a relu et vérifié les 20 cartes.

**Décisions prises**
- Les 3 cases de la checklist de `05_Prototype` sont cochées : on peut commencer à coder.

**Questions ouvertes**
- Où créer le code (dossier sur le Mac, dépôt GitHub `chronos-spec`) ?

## 14 novembre 2026 (suite) — Les 20 premières cartes

**Ce qui a été fait**
- Rédaction des 20 premières cartes dans `03_Contenus/cartes.md` : 4 Univers, 3 Terre, 4 Vie, 4 Humains, 3 Histoire, 2 Aujourd'hui.
- Chaque carte a sa date, sa place dans le calendrier cosmique, 3 phrases, une idée d'image et une source.

**Décisions prises**
- Les cartes ne sont pas validées tant que le champ « Vérifié le » est vide.
- La carte Big Bang change de 3e phrase pour ne pas répéter « La lumière se libère ».

**Questions ouvertes**
- Relire les 20 cartes, puis vérifier chaque source.
- Choisir les vraies images (licences).

## 14 novembre 2026 — Le style « ciel profond »

**Ce qui a été fait**
- Test de Fable 5.2 sur un seul écran : une variante du téléphone (étage Univers).
- Le même style appliqué à l'écran ordinateur (étage Humains), en ocre.

**Décisions prises**
- **On adopte le style de Fable partout** : ciel étoilé, halo et ondes autour du point actif, repère en verre fumé, carte lumineuse. Pourquoi : plus d'émerveillement, sans rien perdre en lisibilité.
- Les anciens écrans restent sur la maquette pour comparer.

**Questions ouvertes**
- Les animations proposées par Fable (ondes, scintillement, parallaxe) : à trier pour le prototype.

## 11 novembre 2026 (suite) — Comment on change d'étage

**Décisions prises**
- **Défilement continu** : on passe d'un étage à l'autre en faisant glisser la page (doigt, molette, flèches du clavier). C'est le geste le plus naturel sur téléphone.
- Pour rester fidèle à « un étage à la fois », chaque étage occupera tout l'écran et la page s'y « aimantera » en douceur.
- **Repère d'échelle double** : l'année cosmique reste toujours visible en petit (« nous sommes le 31 décembre à 23 h 48 »), et une « loupe » propre à l'étage s'affiche à côté (« si l'histoire humaine tenait en un an… »). Pourquoi : avec une seule année, tout l'étage Histoire tiendrait dans les 15 dernières secondes.
- **Images mixtes, traitement commun** : une vraie photo quand elle existe (galaxies, fossiles, monuments), une illustration sinon (Big Bang, premières cellules, ancêtres). Toutes ont le même cadre arrondi et une légère teinte de la couleur de l'étage. Pourquoi : l'authenticité des vraies images, avec l'unité visuelle du site.

**Questions ouvertes**
- Où vit le projet : dossier sur l'ordinateur, puis dépôt GitHub `chronos-spec` relié à Vercel ?
- Préparer, une fois le projet prêt, une consigne détaillée pour qu'un autre modèle d'IA améliore le visuel.

## 11 novembre 2026 — On repart de zéro

**Ce qui a été fait**
- Création de la nouvelle structure du projet (dossiers 00 à 06).
- Rédaction de la vision, du concept des 6 étages, des règles de design et de contenu.

**Décisions prises**
- **Repartir de zéro.** L'ancienne version de Chronos ne sera plus développée. Trois raisons :
  - *Trop chargée* : trop de points, de couleurs et de panneaux à la fois. On ne savait plus où regarder.
  - *Canvas inaccessible* : la frise était dessinée comme une image (en « canvas »). Un lecteur d'écran ne pouvait rien lire, et le clavier ne servait à rien.
  - *Trop de fonctionnalités en concurrence* : arbre du vivant, calques, IA, visite, annotations, export… Aucune n'était vraiment soignée.
- **Ce qu'on garde** :
  - les inspirations **OneZoom** (le plaisir du zoom) et **ChronoZoom** (des périodes rangées les unes dans les autres) ;
  - la typographie **Fraunces / Inter / JetBrains Mono** ;
  - le **fond sombre** immersif pour la frise.
- Construire en HTML d'abord (lisible par tous), les effets visuels ensuite, toujours désactivables.
- Pas d'IA au cœur du site : contenus écrits et sourcés à l'avance.

**Questions ouvertes**
- Comment passe-t-on d'un étage à l'autre (zoom, ascenseur, défilement) ?
- Quelle forme exacte pour le repère d'échelle ?
- Quel style d'images pour les cartes ?

**Les 3 prochaines étapes**
1. Valider la vision (`00_Vision`).
2. Valider le design : couleurs des étages et maquette d'une carte (`02_Design`).
3. Rédiger et sourcer les 20 premières cartes (`03_Contenus`).
