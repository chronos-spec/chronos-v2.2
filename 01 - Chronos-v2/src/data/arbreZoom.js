// L'ARBRE ZOOMABLE (façon OneZoom) : la structure et la mise en place, calculées une seule fois.
// Une seule source de données : phylogenie.js (groupes) + construireFeuilles (espèces de l'arbre du vivant,
// du bestiaire et des espèces humaines). Le canvas ET la liste accessible lisent ce même arbre.
//
// Mise en place en cercles imbriqués (choix de Pierre, 20/11/2026, après un essai en branches peu lisible) :
// chaque groupe est un cercle qui contient ses sous-groupes ; les espèces sont les plus petits cercles.

import { BESTIAIRE } from './bestiaire.js';
import { WIKI_ANIMAUX } from './wiki.js';
import { hierarchy, pack } from 'd3-hierarchy';
import { GROUPES, GROUPE_PAR_ID, ENFANTS, construireFeuilles, chemin } from './phylogenie.js';

const FEUILLES = construireFeuilles(BESTIAIRE, WIKI_ANIMAUX);

// ---- 1. L'arbre : des nœuds { id, nom, type: 'groupe' | 'espece', parent, enfants[] } ----
const NOEUDS = {};
GROUPES.forEach((g) => {
  NOEUDS[g.id] = { ...g, type: 'groupe', enfants: [] };
});
FEUILLES.forEach((f) => {
  NOEUDS[`f:${f.id}`] = { ...f, idFeuille: f.id, id: `f:${f.id}`, type: 'espece', parent: f.groupe, enfants: [] };
});
// Les enfants : d'abord les sous-groupes (dans l'ordre de phylogenie.js), puis les espèces.
GROUPES.forEach((g) => {
  (ENFANTS[g.id] || []).forEach((e) => NOEUDS[g.id].enfants.push(NOEUDS[e]));
});
FEUILLES.forEach((f) => NOEUDS[f.groupe].enfants.push(NOEUDS[`f:${f.id}`]));

export const RACINE = NOEUDS.vivant;
export const NOEUD_PAR_ID = NOEUDS;
export const noeudDeFeuille = (idFeuille) => NOEUDS[`f:${idFeuille}`];

// Nombre d'espèces sous chaque nœud (sert à la taille des branches).
function compter(n) {
  n.nbEspeces = n.type === 'espece' ? 1 : n.enfants.reduce((s, e) => s + compter(e), 0);
  return n.nbEspeces;
}
compter(RACINE);

// Profondeur et parent (objet) pour remonter facilement.
function relier(n, parent, profondeur) {
  n.parentNoeud = parent;
  n.profondeur = profondeur;
  n.enfants.forEach((e) => relier(e, n, profondeur + 1));
}
relier(RACINE, null, 0);

// ---- 2. La mise en place : des cercles imbriqués (« circle packing ») ----
// Chaque groupe est un cercle qui contient ses sous-groupes et ses espèces. On zoome en plongeant
// dans les cercles : pas de grand vide, et chaque niveau remplit l'écran quand on y entre.
const racineD3 = hierarchy(RACINE, (n) => (n.enfants.length ? n.enfants : null))
  .sum((n) => (n.type === 'espece' ? 1 : 0))
  .sort((a, b) => b.value - a.value);
pack().size([1000, 1000]).padding((d) => (d.depth < 3 ? 14 : 6))(racineD3);
racineD3.each((d) => {
  const n = d.data;
  n.x = d.x;
  n.y = d.y;
  n.r = d.r;
  n.boite = { x1: d.x - d.r, x2: d.x + d.r, y1: d.y - d.r, y2: d.y + d.r };
});

// L'ordre « en profondeur » (pour la liste accessible et la recherche).
export const TOUS = [];
(function parcourir(n) {
  TOUS.push(n);
  n.enfants.forEach(parcourir);
})(RACINE);

export const cheminNoeud = (n) => {
  const ch = [];
  for (let x = n; x; x = x.parentNoeud) ch.unshift(x);
  return ch;
};

export { GROUPE_PAR_ID, chemin };
