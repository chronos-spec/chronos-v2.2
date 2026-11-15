import { ETAGES } from './etages.js';
import { CARTES } from './cartes.js';
import { EVENEMENTS } from './evenements.js';

// Rassemble les fiches complètes (cartes.js) et les événements légers (evenements.js),
// et indique pour chacun son étage et sa catégorie.
const SOURCES = new Map([...EVENEMENTS, ...CARTES].map((e) => [e.id, e]));

export const PAR_ID = {};
ETAGES.forEach((etage) => {
  etage.categories.forEach((cat) => {
    cat.evenements.forEach((id) => {
      const e = SOURCES.get(id);
      if (!e) throw new Error(`Événement introuvable : ${id}`);
      PAR_ID[id] = { ...e, etage: etage.id, categorie: cat.id };
    });
  });
});

export { ETAGES };
