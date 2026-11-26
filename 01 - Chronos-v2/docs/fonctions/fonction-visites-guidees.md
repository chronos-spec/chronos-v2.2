# Visites guidées racontées (branche fonction/visites-guidees)

## Ce que fait la fonction
- Page **#/visites** : choisir une des 3 visites.
- Page **#/visites/<id>** (`oxygene`, `sapiens`, `etoiles`) : la visite, étape par étape (9 étapes, environ 2 min 30 à 3 min).
  - Chaque étape montre une fiche qui existe déjà sur la frise (titre, date) et une courte narration en sous-titre (toujours affichée). Le texte complet de la fiche est disponible avec « Lire la fiche complète ».
  - Lecture / Pause, ← Précédent, Suivant →, barre de progression (« Étape n sur 9 »), flèches ← → du clavier.
  - « Quitter et explorer ici » ouvre la page de la période de l'étape en cours sur la frise.
  - Narration lue par la voix du navigateur (speechSynthesis, voix française de l'appareil : gratuite, locale, aucune IA, aucun appel extérieur). Sans voix française : message, bouton Lecture masqué, avance manuelle.
  - prefers-reduced-motion : plus d'animation d'apparition ni de glissement de la barre.
- Le récit d'une minute (#/recit, Recit.jsx) n'est pas modifié.

## Comment tester
`npm run dev`, puis ouvrir `#/visites`. Tester sous Chrome/Edge/Safari (voix différentes selon l'appareil) et sous Firefox Linux (souvent sans voix → mode manuel).

## Fichiers
- Nouveaux : `src/data/visites.js` (le contenu des visites), `src/components/Visites.jsx`, `src/visites.css`.
- Partagé modifié : `src/App.jsx` (1 import, « visites » ajouté aux pages spéciales, 1 branche d'affichage). `route.js` inchangé (#/visites/<id> est lu comme étage + période).

## Limites
- Pas de lien depuis le menu ou l'accueil (à ajouter si Pierre le souhaite, par ex. dans Entete.jsx).
- La pause arrête la phrase ; la reprise relit l'étape depuis son début (la vraie pause de speechSynthesis est peu fiable sur Chrome).
- La durée dépend de la vitesse de la voix de l'appareil.

## À vérifier par Pierre
Les narrations reprennent les dates et faits des fiches existantes. Points à relire :
- « Roches de fer rubanées » : la fiche n'a pas de texte ; la narration présente le lien avec l'oxygène comme « l'explication la plus répandue ».
- « Des étoiles à nous » : la phrase « le carbone, l'oxygène et le fer de notre corps ont été fabriqués par des étoiles » (s'appuie sur la fiche des supernovæ).
- « Le grand départ d'Afrique » et « Les premiers agriculteurs » : fiches sans texte, narrations courtes rédigées à partir du titre et de la date.
