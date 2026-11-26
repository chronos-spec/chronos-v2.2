# Jeu « Remets dans l'ordre » (branche fonction/jeu-de-la-frise)

## Ce que ça fait
Un nouvel onglet **« Dans l'ordre »** dans le panneau **Jeu** (bouton 🧭 en haut à droite, sur toutes les pages), à côté du Quiz et de « Ma collection ».
- On reçoit des cartes (titre + image Wikipédia, sans date) et on les range du plus ancien (en haut) au plus récent (en bas) avec les boutons ↑ / ↓ de chaque carte : souris, toucher et clavier (Tab puis Entrée). Le lecteur d'écran annonce la nouvelle place.
- « Valider mon ordre » : les vraies dates apparaissent, chaque carte est marquée ✅ bien placée ou ❌ avec sa bonne place (jamais la couleur seule).
- 3 niveaux : Famille (3 cartes au moins 10 fois plus éloignées), Curieux (5 cartes), Expert (7 cartes voisines sur la frise).
- **Défi du jour** : 5 cartes, même tirage pour tout le monde (graine = date locale), un seul essai par jour, résultat partageable en texte (✅❌), copié dans le presse-papier (ou menu de partage sur mobile). Aucun serveur.
- 3 badges ajoutés (famille « Jeux », ex-« Quiz ») : Horloger (1 partie), Chronologiste (Expert 7/7), Rendez-vous quotidien (défi joué 3 jours).

## Tester
`npm run dev`, ouvrir n'importe quelle page (ex. `#/`), bouton **Jeu** → onglet **Dans l'ordre**.

## Fichiers
- Nouveaux : `src/lib/ordre.js` (tirage, graine, correction, texte à partager), `src/components/JeuOrdre.jsx`.
- Modifiés : `src/components/Jeu.jsx` (un onglet), `src/data/badges.js` (3 badges, famille renommée « Jeux »), `src/components/Collection.jsx` (commentaire 45 → 48), `src/theme.css` (variables `--jeu-*`), `src/styles.css` (styles à la fin).
- Aucun changement dans App.jsx, route.js, Entete.jsx.

## Données et limites
- Les cartes viennent des événements existants (`PAR_ID`) qui ont une image dans `WIKI_EVENEMENTS` (≈ 270). Aucune date nouvelle : on affiche `dateCourte`.
- Écartés : récits bibliques, animaux et périodes (longues durées), dates en fourchette (« 1791 à 1804 »). Deux dates approximatives (« ~ », « environ »…) doivent différer d'au moins 30 % pour éviter les ordres discutables.
- Le tirage du jour dépend de la liste d'événements : si on en ajoute, le défi d'un même jour change (sans gravité).
- Pas de glisser-déposer (seulement les boutons), par choix d'accessibilité.
- Le défi « Plus tard » permet de revenir le jouer ; un défi validé ne peut pas être rejoué le même jour (sauf en vidant le navigateur).

## À vérifier par Pierre
- Que les images Wikipédia ne montrent pas la date (ex. une affiche) et correspondent bien aux cartes.
- Le libellé « Dans l'ordre » et le renommage de la famille de badges « Quiz » → « Jeux ».
