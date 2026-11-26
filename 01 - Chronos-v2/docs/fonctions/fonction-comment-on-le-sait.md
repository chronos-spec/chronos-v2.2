# Fonction : « Comment on le sait ? »

## Ce que ça fait
- Sur une carte, un volet repliable **« Comment on le sait ? »** (fermé par défaut) affiche :
  - le niveau de certitude, en texte ET en symbole, visible même volet fermé :
    ● Établi · ≈ Approximatif · ? Débattu · ◇ Récit, sans date historique
    (le bord de la pastille change aussi de forme : plein, pointillé, tirets, double) ;
  - le ou les types de preuve (fossile, datation radiométrique, carbone 14, luminescence, traces chimiques,
    archéologie, texte ancien, archives, observation astronomique, récit religieux) avec une phrase simple ;
  - la source déjà présente (pour les 20 fiches complètes, la source est rangée dans le volet) ;
  - un lien vers la page des méthodes.
- Page **#/methodes** : explique chaque méthode et chaque niveau de certitude.
- Les récits bibliques (`nature: 'bible'`) reçoivent automatiquement « Récit religieux » + « Récit, sans date
  historique », cohérent avec l'étiquette « Selon la Bible ». Rien n'a été modifié dans evenements.js.
- Le volet n'apparaît que si la fiche a une preuve renseignée.

## Tester
- `npm run dev`, ouvrir une carte (ex. Big Bang, Chauvet, La Création dans « Selon la Bible »), ouvrir le volet
  à la souris ou au clavier (Tab puis Entrée).
- Aller sur `#/methodes`.

## Fichiers
- Nouveaux : `src/data/preuves.js` (toutes les explications, une seule fois), `src/components/CommentOnLeSait.jsx`,
  `src/components/Methodes.jsx`.
- Modifiés : `src/components/Carte.jsx`, `src/data/cartes.js` (champs `preuve` et `certitude`),
  `src/App.jsx` (3 lignes : import, liste des pages spéciales, rendu de la page), `src/lib/route.js` (commentaire),
  `src/theme.css` (2 variables), `src/styles.css` (bloc ajouté à la fin).

## Choix faits pour les 20 fiches (à relire par Pierre)
| Fiche | Preuves | Certitude |
|---|---|---|
| Big Bang, Lumière, Galaxies | observation astronomique | Établi |
| Premières étoiles | observation astronomique (+ modèles) | Approximatif (jamais observées directement) |
| Soleil, Terre | datation radiométrique (météorites) | Établi |
| Lune | datation radiométrique | Débattu (l'hypothèse de l'impact géant) |
| Premières traces de vie | fossile, radiométrique | Approximatif |
| Oxygène | traces chimiques, radiométrique | Approximatif |
| Cambrien, Fin des dinosaures | fossile, radiométrique | Établi |
| Genre Homo | fossile, radiométrique | Approximatif (un seul fossile) |
| Feu | archéologie | Débattu |
| Homo sapiens | fossile, luminescence | Approximatif (~315 000 ± 34 000 ans) |
| Chauvet | carbone 14, archéologie | Établi |
| Écriture | archéologie | Approximatif |
| Khéops | texte ancien, archéologie | Approximatif |
| Imprimerie | texte ancien | Établi |
| Apollo 11, Webb | archives | Établi |

Pensez à reporter ces champs dans `docs/03_Contenus/cartes.md` (texte source des cartes) si vous les validez.

## Laissé vide, à compléter par Pierre
Pour ajouter une preuve : dans la fiche, `preuve: ['carbone-14'], certitude: 'etabli'` (identifiants dans preuves.js).
- Les faits historiques du christianisme (`nature: 'histoire'` dans evenements.js : Tel Dan, exil, second Temple,
  naissance et mort de Jésus, Paul, Constantin, Nicée, schisme, Réforme, Vatican II). Attention : la naissance de
  Jésus (« vers 6 à 4 av. J.-C. ») est plutôt « Approximatif » ; Tel Dan = archéologie + texte ancien.
- Les autres événements légers de `evenements.js`, `archives.js`, `aujourdhui.js`, `histoireMonde.js`.
- Les animaux du bestiaire et les fiches de période (dates arrondies d'après les fossiles : on pourrait
  leur donner « fossile » + « Approximatif » d'office, à décider).

## Limites
- Les symboles ◇ ≈ ● dépendent des polices Inter/système (caractères Unicode courants).
- Pas de test automatique ; vérifié par `npm run build`.
