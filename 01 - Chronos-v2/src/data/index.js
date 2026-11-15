import { ETAGES } from './etages.js';
import { CARTES } from './cartes.js';
import { EVENEMENTS } from './evenements.js';
import { ARCHIVES } from './archives.js';
import { AUJOURDHUI } from './aujourdhui.js';
import { PERIODES } from './periodes.js';
import { BESTIAIRE, GROUPES_ANIMAUX } from './bestiaire.js';
import { texteAge, plageAges } from '../lib/ages.js';

// Rassemble les fiches complètes (cartes.js), les événements légers (evenements.js)
// et ceux repris de l'ancienne version (archives.js), et indique pour chacun son étage et sa catégorie.
const SOURCES = new Map([...ARCHIVES, ...AUJOURDHUI, ...EVENEMENTS, ...CARTES].map((e) => [e.id, e]));

export const PAR_ID = {};
ETAGES.forEach((etage) => {
  etage.categories.forEach((cat) => {
    cat.evenements.forEach((id) => {
      const e = SOURCES.get(id);
      if (!e) throw new Error(`Événement introuvable : ${id}`);
      if (PAR_ID[id]) throw new Error(`Événement rangé deux fois : ${id}`);
      PAR_ID[id] = { ...e, etage: etage.id, categorie: cat.id };
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

export function idAnimal(idAnimal) {
  return `animal-${idAnimal}`;
}

export function idPeriode(idCategorie) {
  return `periode-${idCategorie}`;
}

export { ETAGES };
