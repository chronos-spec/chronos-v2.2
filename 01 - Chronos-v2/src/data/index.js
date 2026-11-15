import { ETAGES } from './etages.js';
import { CARTES } from './cartes.js';
import { EVENEMENTS } from './evenements.js';
import { ARCHIVES } from './archives.js';
import { PERIODES } from './periodes.js';

// Rassemble les fiches complètes (cartes.js), les événements légers (evenements.js)
// et ceux repris de l'ancienne version (archives.js), et indique pour chacun son étage et sa catégorie.
const SOURCES = new Map([...ARCHIVES, ...EVENEMENTS, ...CARTES].map((e) => [e.id, e]));

export const PAR_ID = {};
ETAGES.forEach((etage) => {
  etage.categories.forEach((cat) => {
    cat.evenements.forEach((id) => {
      const e = SOURCES.get(id);
      if (!e) throw new Error(`Événement introuvable : ${id}`);
      if (PAR_ID[id]) throw new Error(`Événement rangé deux fois : ${id}`);
      PAR_ID[id] = { ...e, etage: etage.id, categorie: cat.id };
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

export function idPeriode(idCategorie) {
  return `periode-${idCategorie}`;
}

export { ETAGES };
