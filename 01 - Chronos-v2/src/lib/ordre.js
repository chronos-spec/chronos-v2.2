// ---------------------------------------------------------------------------
// « REMETS DANS L'ORDRE » : la logique du jeu (sans affichage).
// On tire des événements de la frise (ceux qui ont une image Wikipédia et une date),
// le joueur les range du plus ancien au plus récent, puis on corrige.
// Le « défi du jour » utilise une graine tirée de la date : tout le monde a le même tirage,
// sans serveur.
// ---------------------------------------------------------------------------
import { PAR_ID } from '../data/index.js';
import { WIKI_EVENEMENTS } from '../data/wiki.js';

// Les trois niveaux. « ecart » = écart minimal entre deux cartes, en « crans » de 10
// (1 = au moins 10 fois plus ancien ; 0,25 = environ 1,8 fois plus ancien).
export const NIVEAUX = {
  famille: { nom: 'Famille', nb: 3, ecart: 1, aide: '3 cartes très éloignées dans le temps' },
  curieux: { nom: 'Curieux', nb: 5, ecart: 0.25, aide: '5 cartes' },
  expert: { nom: 'Expert', nb: 7, ecart: null, aide: '7 cartes proches dans le temps' },
};
export const NIVEAU_DEFI = 'curieux';

// La pioche : événements de la frise avec une image et une date (pas les récits bibliques,
// pas les animaux ni les périodes, qui couvrent de longues durées).
// Triée par identifiant pour que le tirage du jour soit le même pour tout le monde.
export const PIOCHE = Object.values(PAR_ID)
  .filter((e) => !e.type && WIKI_EVENEMENTS[e.id] && typeof e.ans === 'number' && e.ans > 0 && e.nature !== 'bible')
  // On écarte les dates en fourchette (« 1791 à 1804 ») : leur place dans l'ordre serait discutable.
  .filter((e) => !/ à /.test(e.dateCourte || ''))
  .sort((a, b) => (a.id < b.id ? -1 : 1));

// Deux dates assez différentes pour qu'il n'y ait pas de doute sur l'ordre.
// Si l'une est approximative (« ~ », « environ »…), on exige un écart plus grand.
const approx = (e) => /~|environ|vers|au moins|\+ de|dès/.test(e.dateCourte || '');
const distinctes = (x, y) => {
  const [g, p] = x.ans > y.ans ? [x.ans, y.ans] : [y.ans, x.ans];
  const marge = approx(x) || approx(y) ? 1.3 : 1.05;
  return g - p >= 3 && g / p >= marge;
};

// Générateur de hasard « avec graine » (mulberry32) : même graine → même suite de nombres.
function hasard(graine) {
  let h = 1779033703 ^ graine.length;
  for (let i = 0; i < graine.length; i++) {
    h = Math.imul(h ^ graine.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function melanger(t, alea) {
  const a = [...t];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(alea() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// La date du jour (heure locale), ex. « 2026-11-26 ».
export function aujourdhui(d = new Date()) {
  const z = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
}

// Tire les cartes d'une partie. Renvoie leurs identifiants, dans un ordre mélangé
// (jamais déjà dans le bon ordre).
export function tirer(niveau, graine = String(Math.random())) {
  const { nb, ecart } = NIVEAUX[niveau];
  const alea = hasard(`${graine}-${niveau}`);
  let choisies = [];
  for (let essai = 0; essai < 50 && choisies.length < nb; essai++) {
    choisies = [];
    if (ecart === null) {
      // Expert : des cartes voisines sur la frise, à partir d'un point de départ au hasard.
      const triees = [...PIOCHE].sort((a, b) => b.ans - a.ans);
      const i = Math.floor(alea() * triees.length);
      for (let k = 0; k < triees.length && choisies.length < nb; k++) {
        const e = triees[(i + k) % triees.length];
        if (choisies.every((c) => distinctes(c, e))) choisies.push(e);
      }
      // Trop près de la fin de la frise : on recommence ailleurs.
      if (choisies.length && Math.max(...choisies.map((c) => c.ans)) / Math.min(...choisies.map((c) => c.ans)) > 1e4) choisies = [];
    } else {
      for (const e of melanger(PIOCHE, alea)) {
        const l = Math.log10(e.ans);
        if (choisies.every((c) => Math.abs(Math.log10(c.ans) - l) >= ecart && distinctes(c, e))) choisies.push(e);
        if (choisies.length === nb) break;
      }
    }
  }
  let ordre = melanger(choisies.map((c) => c.id), alea);
  if (estDansLOrdre(ordre)) ordre = [...ordre.slice(1), ordre[0]]; // éviter une partie déjà résolue
  return ordre;
}

// Le bon ordre : du plus ancien (le plus d'années) au plus récent.
export const bonOrdre = (ids) => [...ids].sort((a, b) => PAR_ID[b].ans - PAR_ID[a].ans);
export const estDansLOrdre = (ids) => bonOrdre(ids).every((id, k) => ids[k] === id);

// Correction : pour chaque place, la carte posée est-elle la bonne ?
export function corriger(ids) {
  const juste = bonOrdre(ids);
  return ids.map((id, k) => id === juste[k]);
}

// Le texte à partager, façon Wordle.
export function texteAPartager(date, resultat, adresse) {
  const bons = resultat.filter(Boolean).length;
  return `Odysseum · Défi du jour ${date}\nRemets dans l’ordre : ${bons}/${resultat.length}\n${resultat.map((b) => (b ? '✅' : '❌')).join('')}\n${adresse}`;
}
