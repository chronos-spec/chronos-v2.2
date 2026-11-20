// L'ARBRE ZOOMABLE (façon OneZoom) : la structure et la mise en place, calculées une seule fois.
// Une seule source de données : phylogenie.js (groupes) + construireFeuilles (espèces de l'arbre du vivant,
// du bestiaire et des espèces humaines). Le canvas ET la liste accessible lisent ce même arbre.
//
// Mise en place « fractale » : chaque groupe est une branche ; ses enfants partent en éventail
// depuis le bout de la branche, chacun plus court que son parent. Les espèces sont des pastilles rondes.
// Plus un groupe a d'espèces, plus sa branche est longue et large : l'arbre reste lisible à tous les zooms.

import { BESTIAIRE } from './bestiaire.js';
import { WIKI_ANIMAUX } from './wiki.js';
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

// ---- 2. La mise en place (coordonnées du « monde », y vers le bas) ----
// Chaque nœud : base (bx, by) → bout de branche (x, y), longueur L, épaisseur ; espèce : rayon r.
function placer(n, bx, by, angle, L) {
  n.bx = bx;
  n.by = by;
  n.L = L;
  n.x = bx + Math.cos(angle) * L;
  n.y = by + Math.sin(angle) * L;
  n.angle = angle;
  if (n.type === 'espece') {
    n.r = L * 0.32;
    return;
  }
  const k = n.enfants.length;
  const poids = n.enfants.map((e) => e.nbEspeces ** 0.6);
  const total = poids.reduce((a, b) => a + b, 0);
  // Ouverture de l'éventail : plus il y a d'enfants, plus il s'ouvre (jusqu'à ~165°).
  const ouverture = k === 1 ? 0 : Math.min(2.9, 0.8 + 0.35 * k);
  let cumul = 0;
  n.enfants.forEach((e, i) => {
    const part = (cumul + poids[i] / 2) / total;
    const pas = (ouverture * poids[i]) / total; // la part d'angle de cet enfant
    cumul += poids[i];
    const a = angle - ouverture / 2 + ouverture * part;
    // Longueur selon la part d'espèces : les grands groupes ont de longues branches,
    // et toutes les espèces finissent à peu près à la même taille (comme dans OneZoom).
    // Un sous-arbre ne doit pas déborder sur ses voisins : sa taille est limitée par sa part d'éventail.
    let longueur = L * Math.min(0.3 + 0.42 * Math.sqrt(e.nbEspeces / n.nbEspeces), k === 1 ? 1 : 0.8 * pas + 0.06);
    if (e.type === 'espece') longueur = Math.min(longueur, L * 0.34);
    placer(e, n.x, n.y, a, longueur);
    // Une pastille ne déborde pas sur sa voisine.
    if (e.type === 'espece' && k > 1) e.r = Math.min(e.r, longueur * Math.sin(Math.max(pas, 0.05) / 2) * 0.95);
  });
}
placer(RACINE, 0, 0, -Math.PI / 2, 1000);

// Boîte englobante de chaque sous-arbre (pour ne dessiner que ce qui est visible).
function englober(n) {
  const marge = n.type === 'espece' ? n.r * 1.6 : 0;
  let x1 = Math.min(n.bx, n.x - marge);
  let x2 = Math.max(n.bx, n.x + marge);
  let y1 = Math.min(n.by, n.y - marge);
  let y2 = Math.max(n.by, n.y + marge);
  n.enfants.forEach((e) => {
    englober(e);
    x1 = Math.min(x1, e.boite.x1);
    x2 = Math.max(x2, e.boite.x2);
    y1 = Math.min(y1, e.boite.y1);
    y2 = Math.max(y2, e.boite.y2);
  });
  n.boite = { x1, x2, y1, y2 };
}
englober(RACINE);

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
