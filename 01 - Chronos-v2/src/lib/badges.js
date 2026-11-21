// ---------------------------------------------------------------------------
// BADGES CACHÉS : la « boîte aux lettres » du jeu d'exploration.
// Chaque page envoie un signal quand il se passe quelque chose (signaler('espece', 'v-baleine')…).
// On note ce qui a été vu, puis on regarde si un badge vient d'être gagné.
// Tout reste dans le navigateur (localStorage) : aucun compte, rien n'est envoyé.
// ---------------------------------------------------------------------------
import { BADGES } from '../data/badges.js';

const CLE = 'chronos-badges-v1';
const EVENEMENT = 'chronos-badge'; // diffusé quand un badge est gagné (pour la petite annonce)

function lire() {
  try {
    const e = JSON.parse(localStorage.getItem(CLE) || 'null');
    if (e && e.vus && e.gagnes) return e;
  } catch { /* stockage indisponible */ }
  return { vus: {}, gagnes: {} };
}
function ecrire(etat) {
  try { localStorage.setItem(CLE, JSON.stringify(etat)); } catch { /* tant pis */ }
}

// Ce qu'un badge peut demander : « a-t-on vu cette valeur ? », « combien de valeurs différentes ? »
export const aVu = (etat, type, valeur) => (etat.vus[type] || []).includes(valeur);
export const combien = (etat, type) => (etat.vus[type] || []).length;

export function etatBadges() {
  return lire();
}

// Envoie un signal. « valeur » distingue les choses vues (une espèce, une civilisation…).
export function signaler(type, valeur = 'oui') {
  if (typeof window === 'undefined') return;
  const etat = lire();
  const liste = etat.vus[type] || (etat.vus[type] = []);
  const v = String(valeur);
  if (liste.includes(v)) return; // déjà vu : rien de neuf
  liste.push(v);
  const nouveaux = BADGES.filter((b) => !etat.gagnes[b.id] && b.test(etat));
  nouveaux.forEach((b) => { etat.gagnes[b.id] = Date.now(); });
  ecrire(etat);
  nouveaux.forEach((b) => window.dispatchEvent(new CustomEvent(EVENEMENT, { detail: b })));
  if (nouveaux.length) window.dispatchEvent(new CustomEvent(`${EVENEMENT}-maj`));
}

export function ecouterBadges(fn) {
  const h = (e) => fn(e.detail);
  window.addEventListener(EVENEMENT, h);
  return () => window.removeEventListener(EVENEMENT, h);
}
export function ecouterMaj(fn) {
  window.addEventListener(`${EVENEMENT}-maj`, fn);
  return () => window.removeEventListener(`${EVENEMENT}-maj`, fn);
}

export function effacerBadges() {
  try { localStorage.removeItem(CLE); } catch { /* rien */ }
  window.dispatchEvent(new CustomEvent(`${EVENEMENT}-maj`));
}

// Une visite par jour (pour le badge « Fidèle »).
export function noterVisite() {
  signaler('jour', new Date().toISOString().slice(0, 10));
}
