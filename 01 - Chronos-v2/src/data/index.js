import { ETAGES } from './etages.js';
import { CARTES } from './cartes.js';
import { EVENEMENTS } from './evenements.js';
import { ARCHIVES } from './archives.js';
import { AUJOURDHUI } from './aujourdhui.js';
import { PERIODES } from './periodes.js';
import { BESTIAIRE, GROUPES_ANIMAUX } from './bestiaire.js';
import { texteAge, plageAges } from '../lib/ages.js';
import { MONDE, LIEUX_DE, categorieDe } from './histoireMonde.js';
import { WIKI_ANIMAUX } from './wiki.js';

// Rassemble les fiches complètes (cartes.js), les événements légers (evenements.js)
// et ceux repris de l'ancienne version (archives.js), et indique pour chacun son étage et sa catégorie.
const PRINCIPAUX = new Set([...CARTES, ...EVENEMENTS].map((e) => e.id));
const SOURCES = new Map([...ARCHIVES, ...AUJOURDHUI, ...EVENEMENTS, ...CARTES].map((e) => [e.id, e]));

export const PAR_ID = {};
ETAGES.forEach((etage) => {
  etage.categories.forEach((cat) => {
    cat.evenements.forEach((id) => {
      const e = SOURCES.get(id);
      if (!e) throw new Error(`Événement introuvable : ${id}`);
      if (PAR_ID[id]) throw new Error(`Événement rangé deux fois : ${id}`);
      PAR_ID[id] = {
        ...e,
        etage: etage.id,
        categorie: cat.id,
        principal: PRINCIPAUX.has(id), // fiche complète ou événement de base : visible en vue d'ensemble
        surAccueil: true,
        lieux: LIEUX_DE[id] || null,
      };
    });

    // Les animaux emblématiques de la période (bestiaire).
    (BESTIAIRE[cat.id] || []).forEach((a) => {
      const id = idAnimal(a.id);
      PAR_ID[id] = {
        id,
        type: 'animal',
        titre: a.nom,
        dateCourte: a.quand || (a.debut === a.fin ? `il y a ${texteAge(a.debut)}` : plageAges(a.debut, a.fin)),
        ans: a.debut,
        resume: a.texte,
        taille: a.taille,
        groupeNom: GROUPES_ANIMAUX[a.groupe],
        groupeAnimal: a.groupe,
        wiki: WIKI_ANIMAUX[a.id],
        surAccueil: true,
        nomPeriode: cat.nom,
        etage: etage.id,
        categorie: cat.id,
      };
    });

    // La fiche de la période elle-même (on l'ouvre en touchant son nom sur la ligne).
    const p = PERIODES[cat.id];
    PAR_ID[idPeriode(cat.id)] = {
      id: idPeriode(cat.id),
      type: 'periode',
      titre: cat.nom,
      dateCourte: cat.periode || '',
      date: cat.periode || '',
      ans: cat.debut ?? null,
      resume: p?.resume ?? null,
      points: p?.points ?? [],
      autresNoms: p?.autresNoms ?? [],
      groupe: cat.groupe ?? null,
      etage: etage.id,
      categorie: cat.id,
    };
  });
});

// L'Histoire lieu par lieu : ces événements n'apparaissent que sur la page de l'étage Histoire.
MONDE.forEach((e) => {
  PAR_ID[e.id] = { ...e, etage: 'histoire', categorie: categorieDe(e.annee), principal: false, surAccueil: false };
});

// Les événements d'une catégorie sur la page de l'étage (accueil + événements « monde » de l'Histoire).
export function evenementsPage(cat) {
  const base = cat.evenements;
  const monde = MONDE.filter((e) => categorieDe(e.annee) === cat.id).map((e) => e.id);
  return [...base, ...monde];
}

export function idAnimal(idAnimal) {
  return `animal-${idAnimal}`;
}

export function idPeriode(idCategorie) {
  return `periode-${idCategorie}`;
}

export { ETAGES };
