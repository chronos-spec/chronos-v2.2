// Calcule une date dans une « année-loupe » : si `depuisAns` années tenaient en un an,
// où tomberait un événement vieux de `ans` années ?

const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet',
  'août', 'septembre', 'octobre', 'novembre', 'décembre'];
const JOURS_PAR_MOIS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const SECONDES_AN = 365 * 86400;

// La date dans l'année cosmique (13,8 milliards d'années = 1 an).
export function dateCosmique(ans) {
  if (ans === null || ans === undefined) return null;
  return dateLoupe(ans, 13.8e9);
}

export function dateLoupe(ans, depuisAns) {
  if (ans > depuisAns) return 'avant le 1er janvier';
  const fraction = Math.min(1, Math.max(0, 1 - ans / depuisAns));
  const secondes = fraction * SECONDES_AN;
  const restant = SECONDES_AN - secondes;

  // Les toutes dernières secondes de l'année
  if (restant < 60) {
    const s = Math.max(0, Math.round(restant));
    if (s <= 1) return 'à quelques instants de minuit';
    return `31 décembre, à ${s} secondes de minuit`;
  }

  let jour = Math.floor(secondes / 86400);
  let mois = 0;
  while (jour >= JOURS_PAR_MOIS[mois]) {
    jour -= JOURS_PAR_MOIS[mois];
    mois += 1;
  }
  const texteJour = jour === 0 ? '1er' : String(jour + 1);
  const date = `${texteJour} ${MOIS[mois]}`;

  // Le dernier jour : on donne l'heure
  if (mois === 11 && jour === 30) {
    const dansJour = secondes - 364 * 86400;
    const h = Math.floor(dansJour / 3600);
    const m = Math.floor((dansJour % 3600) / 60);
    return `${date}, ${h} h ${String(m).padStart(2, '0')}`;
  }
  return date;
}
