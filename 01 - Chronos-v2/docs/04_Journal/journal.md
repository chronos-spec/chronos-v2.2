# Journal de Chronos

## 26 novembre 2026 (soir) — Le tunnel du temps (visites guidées)

**Ce qui a été fait**
- Les visites guidées deviennent un **tunnel du temps** en plein écran : un ciel étoilé qui file vers nous, plus vite quand le saut dans le temps est grand ; chaque étape (image, étage, date, titre) arrive du fond de l'écran, l'ancienne nous dépasse.
- **La ligne du temps avance pour de vrai** en bas : le curseur glisse d'une étape à l'autre (échelle logarithmique), le compteur d'années défile, l'année cosmique suit.
- **Bulle « Pendant ce temps… »** qui apparaît pendant chaque étape (si une coïncidence est justifiée).
- **Carte du monde animée** pour « Le grand voyage de Sapiens » : la route se trace d'Éthiopie au Proche-Orient, en passant par l'Australie, Chauvet et la Béringie (lieux indicatifs, nommés par les fiches).
- **Musique d'ambiance** (celle du site, jouée par le navigateur), coupée au départ.
- **Mini-défi final** : remettre 3 étapes de la visite dans l'ordre. Nouveau badge « Voyageur du tunnel » (49 badges).
- Mosaïque d'images sur la liste des visites.

**Décisions prises**
- Bouton **« Effets doux »** (et automatique si l'appareil demande moins d'animations) : plus de vol ni de flou, les étapes apparaissent simplement. Sous-titres toujours affichés, ← → et Échap au clavier.

**Questions ouvertes**
- Vérifier sur un vrai écran l'effet du tunnel avec les images chargées, et le confort des étoiles en mouvement.

## 26 novembre 2026 — Sept nouvelles fonctions (branche `integration`)

**Ce qui a été fait**
- Analyse des concurrents (ChronoZoom, OneZoom, Histography, Lumni…) et 7 idées pour faire la différence. Chacune a été codée par un agent sur sa propre branche, puis tout a été fusionné dans la branche **`integration`** (`main` n'est pas touché).
- **Ta vie sur la frise** (`#/ma-vie`) : sa vie dans l'année cosmique et dans l'année de l'histoire écrite, les événements autour de sa naissance, bouton Partager.
- **Mode Classe** (`#/classe`) : 3 parcours (6e Histoire, SVT collège, Seconde Histoire), mode tableau numérique, fiches d'activité imprimables avec corrigé.
- **« Pendant ce temps… »** sur les cartes : 2 à 4 événements ou êtres vivants contemporains ailleurs (183 cartes sur 351 l'ont).
- **Jeu « Remets dans l'ordre »** (onglet du panneau Jeu) : 3 niveaux, défi du jour partageable façon Wordle, 3 nouveaux badges (48 au total ; la famille « Quiz » devient « Jeux »).
- **Visites guidées** (`#/visites`) : 3 visites lues par la voix du navigateur, sous-titres toujours affichés.
- **« Comment on le sait ? »** sur les cartes : type de preuve et niveau de certitude (● Établi, ≈ Approximatif, ? Débattu, ◇ Récit) ; page `#/methodes`.
- **Pont Historivision** : bouton « Voir en 3D » (model-viewer, chargé au premier clic) sur 6 monuments, visible seulement quand un modèle .glb est déposé dans `public/modeles/` ; page `#/historivision`.
- Liens ajoutés : Visites et Classe dans l'en-tête ; les 4 nouvelles pages dans le menu téléphone ; Méthodes et Historivision dans le pied de page.

**Décisions prises**
- Pas d'IA dans le site pour l'instant : une clé API serait facturée à chaque question d'un visiteur (crédits de l'API, séparés de l'abonnement Claude).

**Questions ouvertes**
- Tester la branche `integration` dans un navigateur (ordinateur et téléphone, clavier, voix, impression).
- Relire : niveaux de certitude des 20 cartes ; 3 narrations écrites sans texte de fiche (fer rubané, départ d'Afrique, premiers agriculteurs) ; 30 questions du mode Classe ; intitulés des programmes sur eduscol.
- Bestiaire : donner d'office « fossile » et « Approximatif » à tous les animaux ?
- Trouver des modèles 3D libres ; créer une carte Colisée (et Parthénon) pour la 3D.
- Fusionner `integration` dans `main` après validation.

## 21 novembre 2026 — Le jeu devient une chasse aux badges cachés

**Décision**
- Le jeu pousse à explorer le site à la main : **45 badges cachés** partout (récits des civilisations, récit animé, voyage « Tout voir », zoom, arbre du vivant, fiches, spirale, recherche, quiz, secrets).
- Chaque badge a une **devinette** ; un bouton « Révéler » donne la consigne exacte. Un **trophée** par famille complète (6 familles).
- Le panneau Jeu a deux onglets : **Quiz** et **Ma collection**. Une petite annonce « Badge débloqué ! » apparaît en bas de l'écran (lue par les lecteurs d'écran, sans bloquer la navigation).
- Tout reste dans le navigateur (aucun compte, rien d'envoyé).

**Comment c'est fait**
- `src/data/badges.js` : la liste des badges (ajouter un badge = une ligne).
- `src/lib/badges.js` : chaque page envoie un signal (`signaler('espece', 'v-baleine')`…), le fichier décide si un badge est gagné.

**Aussi aujourd'hui**
- « Tout voir » : voyage en bande qui défile sans zoom (écarts selon le temps écoulé, la caméra file dans les vides), formats Rapide 1 min / Normale 3 min 30, vitesse ×1/×2/×4, curseur « Période », événements datés dès la première vue sans chevauchement.
- Page Vie : l'arbre linéaire revient sous l'arbre en bulles.
- Récits des civilisations : voix d'IA enregistrée possible (script `scripts/generer-voix.mjs`, ElevenLabs ou OpenAI, clé à fournir), sinon meilleure voix du navigateur.
- Plan de la vidéo du Récit : `docs/05_Prototype/video-recit.md`.

## 20 novembre 2026 — L'arbre du vivant zoomable (façon OneZoom)

**Ce qui a été fait**
- **Un seul arbre du vivant**, zoomable comme OneZoom : des grands groupes jusqu'à chaque espèce. Il remplace la liste déroulante de la page Vie.
- **Une seule source de données** (`src/data/phylogenie.js`, mise en forme par `src/data/arbreZoom.js`). Elle réunit l'arbre du vivant, les 73 animaux du bestiaire et les 18 espèces humaines, soit 82 groupes et 148 espèces.
- **Corrections pendant la fusion** :
  - 7 « espèces » de l'ancien arbre qui étaient en fait des groupes (Ammonites, Trilobites, Ptérosaures, Ichtyosaures, Sauropodes, Ornithischiens, Théropodes) sont fusionnées avec leur groupe, qui reprend leur image.
  - Les espèces humaines sont rangées dans de nouveaux groupes : Grands singes › Lignée humaine › Australopithèques / Genre Homo.
  - Homo sapiens remplace le doublon « Humain ». Gorille et chimpanzé passent dans les Grands singes.
- **Canvas** (zoom à la molette, au doigt, avec + et − ; déplacement) **doublé d'une liste en arbre** (`role="tree"`, flèches, Entrée). Quand on parcourt la liste, la caméra suit l'élément.
- **Les disparus** sont marqués en ambre ET avec le symbole †.
- **La fiche d'une espèce** a un lien « Voir sur la frise » vers sa période.
- **La recherche** fait voler la caméra jusqu'à l'espèce trouvée.

**Décisions prises**
- **Retour du canvas, uniquement pour l'arbre du vivant façon OneZoom, toujours doublé d'une liste accessible qui lit les mêmes données.**
- **Même jour, après essai** : la forme en branches (longues branches presque vides, arbre qui « disparaissait » au clic) est remplacée par des **cercles imbriqués** : chaque groupe est un cercle qui contient ses sous-groupes et ses espèces ; on plonge en touchant un cercle. Choix de Pierre, plutôt que d'intégrer le vrai OneZoom ou de copier son algorithme.

**Questions ouvertes**
- Juger les cercles imbriqués sur un vrai écran, avec les images chargées.
- Comparer deux espèces (l'ancien bouton « Comparer avec ») : à remettre dans la fiche ?

## 16 novembre 2026 — Pages d'étage, pages de période, lieux et images

**Ce qui a été fait**
- **Année cosmique** : on peut la masquer (elle glisse hors de l’écran ; un onglet « 1 an » la ramène) et faire glisser son point pour voyager dans le temps (la page descend jusqu’à l’étage et l’époque). Au clavier : flèches haut / bas.
- **Zoom de toute la page** (− / + en haut à droite, de 50 % à 125 %, mémorisé).
- **Page d’accueil inchangée**, sauf : un bouton « Explorer l’étage » dans chaque étage, le menu du haut qui ouvre les pages d’étage, et l’arbre humain retiré (il est sur la page Humains).
- **Une page par étage** (`#/vie`) : zoom de la frise (vue d’ensemble, normal, × 2, × 4 ; aussi Ctrl + molette), et le nom de chaque période ouvre sa page.
- **Une page par période** (`#/vie/jurassique`) : sa frise (zoom × 2), « En bref », les groupes du vivant, le bestiaire en grandes fiches avec images, la liste de tous les événements, période précédente / suivante.
- **Vie** : l’arbre du vivant déroulant (bactéries → … → primates), 86 groupes et espèces, avec images.
- **Humains** : les familles humaines en liste déroulante (avec images), puis l’arbre généalogique.
- **Histoire** : choix d’un ou plusieurs **lieux** (Europe et Méditerranée, Proche-Orient, Afrique, Asie, Amériques, Océanie, Grands voyages). Une ligne par lieu, toutes à la même échelle. 57 nouveaux événements dans le monde (Caral, l’Indus, Confucius, Aksoum, Mansa Moussa, Zheng He, les Incas, Magellan, la traite atlantique, Haïti, Meiji…). Ils ne figurent que sur la page Histoire.
- **Images** : prises sur Wikipédia (Wikimedia Commons, licences libres), chargées à l’affichage, avec un lien vers la page d’origine. Tous les titres ont été vérifiés : 173 sur 174 ont une image (Liopleurodon n’en a pas de libre).

**Décisions prises**
- Adresses en `#/…` : rien à régler sur Vercel, et les ancres de l’accueil (`#vie`) continuent de marcher.
- En vue d’ensemble (zoom 50 %), seuls les événements principaux restent ; en zoomant, tout réapparaît.

**Questions ouvertes**
- Relire les 57 événements « monde » et la liste des lieux.
- Images des événements (pas seulement des espèces) ?

## 15 novembre 2026 (très tard) — Bestiaire et version téléphone

**Ce qui a été fait**
- **Bestiaire** (étage Vie) : 73 animaux emblématiques, de l’Ediacarien au Quaternaire (Dickinsonia, trilobites, Dunkleosteus, Meganeura, Dimetrodon, Stégosaure, Tyrannosaure, Titanoboa, Mégalodon, Mammouth…). En vignettes sous le nom de chaque période, une couleur par grand groupe ; chacun s’ouvre en courte fiche (groupe, taille, dates) et la recherche les trouve.
- **Version téléphone** (écran de moins de 700 px) : la ligne devient **verticale**, le temps descend avec le pouce, un événement par ligne. Un bandeau collé en haut suit la lecture (période, date, « si … tenait en un an »). Les ères ont leur bandeau de couleur. Étage Vie : pour chaque période, les groupes qui **apparaissent** ou **disparaissent**, puis ceux « déjà là ».
- Les thèmes (Histoire, Aujourd’hui), la recherche et l’animation marchent aussi en vertical.

**Décisions prises**
- Bestiaire rédigé à la main (6 à 8 animaux par période) plutôt qu’importé automatiquement.
- Téléphone : même site, même adresse, mêmes contenus ; seule la mise en page change.

**Questions ouvertes**
- Images du bestiaire (licences, style commun).
- Relire les dates et tailles des animaux.

## 15 novembre 2026 (tard) — Lignes aérées, thèmes, ères en couleur

**Ce qui a été fait**
- Les périodes s'allongent quand leurs événements sont serrés : **jamais plus de deux étiquettes** l'une sous l'autre.
- Le curseur de la loupe et la ligne « si … tenait en un an » sont collés sous la ligne du temps.
- Aujourd'hui : un menu **« Choisir un thème »** : conquête spatiale, numérique, médecine et santé, énergie et climat, transports, le monde depuis 1945 (37 nouveaux événements).
- Histoire et Aujourd'hui : **une ligne par thème**. Changer de thème efface la ligne (glissement + flou) et fait apparaître la suivante (l'axe se trace, les points arrivent en cascade). Coupé si l'appareil demande moins de mouvement.
- Terre et Vie : une **bande de couleur par grande ère** (Précambrien, Paléozoïque, Mésozoïque, Cénozoïque) et une pastille de couleur par période, aux couleurs officielles de la charte stratigraphique internationale.

**Questions ouvertes**
- Comment ajouter beaucoup plus d'animaux par période ?
- Une version entièrement pensée pour le téléphone.

## 15 novembre 2026 (nuit) — Recherche, vivant et arbre humain

**Ce qui a été fait**
- Le curseur de la loupe passe **sous** la ligne des événements.
- Téléphone : le toucher ouvre enfin le bon événement. Le bouton d'un point cachait son voisin ; seuls le rond et l'étiquette réagissent au doigt, et deux points gardent au moins 48 px d'écart.
- Une **loupe de recherche** en haut à gauche : événements, périodes, groupes du vivant, espèces humaines, étages. Sans accents ni majuscules, au clavier comme au doigt.
- **Toutes les périodes de l'ancienne version** sont là (Cosmique → Univers, Hadéen, Archéen, Protérozoïque, Cambrien à Quaternaire, Préhistoire → Humains, Néolithique, Antiquité → 1945). Chaque nom de période s'ouvre en fiche (« À retenir »).
- **66 événements repris** de l'archive « chronos-final » (titre, date, court résumé). Les doublons des cartes existantes n'ont pas été recopiés. Plusieurs dates fausses de l'ancienne version ont été corrigées (marquées « corrigé » dans `src/data/archives.js`).
- Étage Vie : un bandeau discret **des grands groupes du vivant** au-dessus de la ligne, à l'échelle.
- Étage Humains : **l'arbre des espèces humaines** (18 espèces, de Toumaï à nous), parenté probable ou incertaine, métissages connus grâce à l'ADN.

**Décisions prises**
- Les périodes de Vie et de Terre sont à l'échelle de **toute** la période (bornes officielles), plus seulement de leurs événements.
- L'ambre (`--eteint`) marque les groupes et espèces disparus, comme prévu.
- L'arbre humain a sa propre échelle, resserrée vers le présent (sinon les 300 000 dernières années tiendraient dans un trait).

**Questions ouvertes**
- Rédiger les fiches complètes (image, source) des événements repris.
- Faire relire les dates corrigées et l'arbre humain.

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
