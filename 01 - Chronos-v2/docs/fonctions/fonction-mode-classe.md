# Mode Classe (branche fonction/mode-classe)

## Ce que fait la fonction
Une page pour les enseignants, sans compte ni serveur :
1. **Parcours** alignés sur les grands thèmes des programmes : chaque parcours est une suite ordonnée d'événements déjà présents sur le site (aucun texte historique recopié : titre, date et résumé viennent des fiches existantes), avec un lien « Voir sur la frise » vers la page de la période (#/etage/periode).
   - 6e Histoire : « La longue histoire de l'humanité et des migrations » (18 étapes, de Toumaï à Khéops).
   - Collège cycle 4, SVT : « Le vivant et son évolution » (20 étapes, des stromatolithes à Darwin).
   - Lycée seconde, Histoire : « Le monde méditerranéen, de l'Antiquité au Moyen Âge » (13 étapes).
2. **Mode tableau numérique** (bouton) : plein écran si le navigateur le permet, en-tête et pied de page masqués, texte en 28 px, boutons de 64 à 80 px, une étape à la fois avec « Précédente / Suivante » et les flèches ← → du clavier. Le choix est retenu dans le navigateur (localStorage).
3. **Fiche d'activité imprimable** par parcours : 10 questions dont les réponses sont écrites sur les fiches du site (chaque question indique la fiche où chercher), lignes pour répondre, nom/prénom/classe. **Le corrigé est un bouton séparé**. À l'impression, seul la feuille sort (noir sur blanc, pas de décor).

## Comment tester
- `npm run dev`, puis ouvrir `#/classe` (liste), `#/classe/6e-humanite`, `#/classe/svt-evolution`, `#/classe/seconde-mediterranee`.
- Cliquer « Mode tableau numérique », naviguer avec ← →, puis « Quitter le mode tableau ».
- « Imprimer la fiche élève » / « Imprimer le corrigé » : vérifier l'aperçu avant impression (ou « Enregistrer en PDF »).
- Une adresse inconnue (`#/classe/xyz`) affiche « Parcours introuvable ».

## Fichiers
- Nouveaux : `src/data/parcours.js` (les parcours et questions), `src/components/ModeClasse.jsx`, `src/classe.css`.
- Partagés modifiés (petit risque de conflit) : `src/App.jsx` (+8 lignes : import paresseux, `'classe'` ajouté à la liste des pages spéciales, une branche d'affichage), `src/theme.css` (+4 variables pour la feuille imprimée : `--papier`, `--encre`, `--encre-douce`, `--trait-papier`).
- `src/lib/route.js` n'a pas changé : `#/classe/<parcours>` est lu comme « étage / période ».

## Limites
- Aucun lien vers la page n'a été ajouté (page d'accueil et en-tête non touchés) : il faudra décider où mettre l'accès (pied de page, menu…).
- Les liens mènent à la page de la période, pas directement à la fiche ouverte (le site n'a pas encore d'adresse par fiche).
- Beaucoup d'événements légers n'ont qu'un titre et une date (pas de texte) : les questions s'appuient donc sur les fiches qui ont un texte ou un résumé.
- Texte imprimé en 12 pt (taille normale sur papier ; la règle des 18 px vaut pour l'écran).
- Le plein écran n'existe pas sur iPhone (Safari) : le bouton est alors masqué, le mode tableau marche quand même.
- Le badge « page visitée » est signalé avec l'identifiant `classe` (comme les autres pages).

## À vérifier par Pierre (sur eduscol.education.fr)
- [ ] Intitulé exact et numéro du thème d'histoire de 6e (« La longue histoire de l'humanité et des migrations ») : les programmes du cycle 3 ont pu être révisés récemment.
- [ ] Intitulé de la partie SVT du cycle 4 sur l'évolution du vivant (le libellé « Le vivant et son évolution » est à confirmer), et s'il vaut mieux viser un niveau précis (5e, 4e ou 3e).
- [ ] Intitulé du thème 1 d'histoire de seconde (Méditerranée antique et médiévale) et s'il est toujours en vigueur.
- [ ] Les textes « programme » de chaque parcours dans `src/data/parcours.js` (champ `programme`) une fois vérifiés.
- [ ] Relire les 30 questions et leurs réponses (même fichier). Seule précision ajoutée hors fiche : le prénom « Charles » de Darwin.
