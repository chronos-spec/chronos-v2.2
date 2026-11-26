# Fonction « Pendant ce temps… » (branche fonction/pendant-ce-temps)

## Ce que ça fait
Sur une carte ouverte (événement, animal du bestiaire), un bouton « Pendant ce temps… » déplie
2 à 4 choses contemporaines **ailleurs** :
- un événement d'un **autre continent** (lieux de `histoireMonde.js`, sans lieu en commun avec la carte) ;
- un événement d'un **autre étage** (ex. Histoire ↔ Aujourd'hui) ;
- un **animal du bestiaire** ou une **espèce humaine** (sauf *Homo sapiens*, toujours là) dont les dates
  d'apparition et de disparition encadrent la date. S'il a disparu juste avant ou est apparu juste après,
  c'est écrit (« Disparu peu avant », « Apparu peu après »).

Chaque élément est un lien : il ouvre sa carte (ou la page de l'étage) par le même chemin que la loupe de recherche.
Pas assez de coïncidences justifiées (moins de 2) → pas de bouton. Les cartes de période n'ont pas de bouton.

## Règles (src/lib/pendantCeTemps.js, fonction pure)
- Fenêtre = 3 % de l'ancienneté, au moins 10 ans : 1969 → ±10 ans ; 1455 → ±17 ans ; 2560 av. J.-C. → ±138 ans ;
  66 Ma → ±2 Ma ; 539 Ma → ±16 Ma.
- Si la carte affiche un intervalle d'années (« 1939 à 1945 », « 1337–1453 »), il faut **chevaucher** cet intervalle (pas de marge).
  Ces deux années sont lues dans la date affichée, jamais devinées.
- Un être vivant présent plus de 10 fois l'âge de la carte est écarté (ex. le dodo, ~1 Ma, à côté du Bouddha : vrai mais sans intérêt).
- Tri : les plus proches d'abord ; variété (un par continent / étage / sorte) avant de compléter.

## Cas vérifiés à la main (sortie réelle de la fonction, données du 26/11/2026)
| Carte | Résultat | Vérification |
|---|---|---|
| Révolution française (1789, Europe) | Colonisation de l'Australie (1788, Océanie) ; Révolution haïtienne (1791–1804) | 1 an et 2 ans d'écart, autres continents |
| Pyramide de Khéops (v. 2560 av. J.-C., Afrique) | Caral (v. 2600 av. J.-C., Amériques) ; villes de l'Indus (v. 2600 av. J.-C., Asie) | ~40 ans, dates approximatives (« vers ») |
| L'imprimerie (v. 1455) | Île de Pâques (1250–1500) ; Grand Zimbabwe (1100–1450) ; Empire inca (1438) | chevauchement ou < 17 ans |
| Le Bouddha (Ve s. av. J.-C., Asie) | Guerres médiques (490–479 av. J.-C.) ; démocratie à Athènes (508 av. J.-C.) | même siècle ; date du Bouddha débattue |
| La guerre de Cent Ans (1337–1453) | Incas (1438), Grand Zimbabwe, Zheng He (1405–1433), île de Pâques | tous dans l'intervalle |
| Fin des dinosaures (66 Ma) | Quetzalcoatlus, Tricératops, Tyrannosaure (68–66 Ma), Mosasaure (82–66 Ma) | tous vivants jusqu'à 66 Ma |
| Explosion cambrienne (~539 Ma) | Charnia, Kimberella, Dickinsonia : « Disparu peu avant » | fin à 545–550 Ma, donc avant : c'est dit |
| Premiers Homo sapiens (300 000 ans) | Homo naledi, Dénisoviens, ours des cavernes, rhinocéros laineux | intervalles qui contiennent 300 000 ans |
| Un homme sur la Lune (1969) | (pas de bouton) | rien dans ±10 ans ailleurs : on n'invente pas |
| Seconde Guerre mondiale (1939–1945) | (pas de bouton) | seule l'ONU (1945) est dans l'intervalle → moins de 2 |

183 cartes sur 351 (hors périodes) ont un bouton.

## Tester
`npm run dev`, puis page d'accueil ou `#/histoire` : ouvrir « La Révolution française » ou « La fin des dinosaures »,
cliquer « Pendant ce temps… », puis un lien. Au clavier : Tab jusqu'au bouton, Entrée ; le focus va sur « Au même moment, ailleurs : ».

## Fichiers
- Nouveaux : `src/lib/pendantCeTemps.js`, `src/components/PendantCeTemps.jsx`, ce document.
- Modifiés : `src/components/Carte.jsx` (1 import + 1 ligne), `src/styles.css` (bloc ajouté à la fin),
  `src/App.jsx` (**partagé** : un petit `useEffect` qui écoute l'événement `chronos-ouvrir` et réutilise la recherche).

## Limites / à vérifier par Pierre
- Les intervalles « av. J.-C. » (ex. « 336 à 323 av. J.-C. ») ne sont pas lus comme intervalles : on prend la date de début.
- Les dates d'apparition du bestiaire sont arrondies (ex. dodo apparu « il y a ~1 million d'années », Néandertal) : à relire.
- Sur la page d'accueil, une carte d'un événement « Histoire du monde » ouvre la page Histoire (comme la recherche).
