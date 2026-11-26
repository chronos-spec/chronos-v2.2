// ---------------------------------------------------------------------------
// « TA VIE SUR LA FRISE » : tous les calculs, faits dans le navigateur.
// Rien n'est envoyé à un serveur : la date de naissance reste sur l'appareil
// (elle n'apparaît dans l'adresse que si le visiteur la valide lui-même).
// ---------------------------------------------------------------------------
import { PAR_ID } from '../data/index.js';

const AGE_UNIVERS = 13.8e9; // en années (même valeur que l'année cosmique)
const SECONDES_AN = 365 * 86400;
const MS_AN = 365.2425 * 86400 * 1000; // année moyenne du calendrier

// Lit « 1997 » ou « 1997-12-13 » (venu de l'adresse ou du formulaire).
// Renvoie { annee, mois, jour, complete } ou null si la date n'est pas valable.
export function lireNaissance(texte, aujourdhui = new Date()) {
  const m = /^(\d{4})(?:-(\d{2})-(\d{2}))?$/.exec(texte || '');
  if (!m) return null;
  const annee = Number(m[1]);
  if (annee < 1900 || annee > aujourdhui.getFullYear()) return null;
  if (!m[2]) return { annee, complete: false };
  const mois = Number(m[2]);
  const jour = Number(m[3]);
  const d = new Date(annee, mois - 1, jour);
  if (d.getMonth() !== mois - 1 || d.getDate() !== jour || d > aujourdhui) return null;
  return { annee, mois, jour, complete: true };
}

export const texteNaissance = (n) => (n.complete
  ? `${n.annee}-${String(n.mois).padStart(2, '0')}-${String(n.jour).padStart(2, '0')}`
  : String(n.annee));

// Âge en années (avec décimales). Sans jour précis, on prend le milieu de l'année : c'est approximatif.
export function ageEnAnnees(n, aujourdhui = new Date()) {
  const debut = n.complete ? new Date(n.annee, n.mois - 1, n.jour) : new Date(n.annee, 6, 1);
  return Math.max(0, (aujourdhui - debut) / MS_AN);
}

// Âge révolu (le nombre de bougies), seulement si la date est complète.
export function ageRevolu(n, aujourdhui = new Date()) {
  if (!n.complete) return null;
  let a = aujourdhui.getFullYear() - n.annee;
  const anniversairePasse = aujourdhui.getMonth() + 1 > n.mois
    || (aujourdhui.getMonth() + 1 === n.mois && aujourdhui.getDate() >= n.jour);
  if (!anniversairePasse) a -= 1;
  return a;
}

// Combien de secondes de l'année cosmique pour une vie de `ans` années ?
export const secondesCosmiques = (ans) => (ans / AGE_UNIVERS) * SECONDES_AN;

const nombre = (x, chiffres) => x.toLocaleString('fr-FR', { maximumFractionDigits: chiffres });

// « 0,066 seconde » : on garde 2 chiffres significatifs.
export function texteSecondes(s) {
  if (s <= 0) return 'moins d’un millième de seconde';
  const chiffres = Math.max(0, 1 - Math.floor(Math.log10(s)));
  const v = Number(s.toFixed(Math.min(chiffres, 6)));
  return `${nombre(v, 6)} seconde${v >= 2 ? 's' : ''}`;
}

// ---------------------------------------------------------------------------
// Les événements datés à l'année près, tirés des données du site (aucune date ajoutée ici).
// On ne garde que ceux dont la date courte est une année simple (« 1969 », « novembre 1957 »,
// « 2 décembre 1804 ») ou le début d'une période (« 1939 à 1945 ») : pas les « vers » ni les « ~ ».
// ---------------------------------------------------------------------------
const DATE_SIMPLE = /^(?:\d{1,2} )?(?:[a-zéû]+ )?(\d{4})(?: à (\d{4}))?$/;

export const EVENEMENTS_DATES = Object.values(PAR_ID)
  .filter((e) => e.type !== 'animal' && typeof e.dateCourte === 'string' && e.nature !== 'bible')
  .map((e) => {
    const m = DATE_SIMPLE.exec(e.dateCourte.trim());
    if (!m) return null;
    return { id: e.id, titre: e.titre, etage: e.etage, annee: Number(m[1]), periode: Boolean(m[2]), dateCourte: e.dateCourte };
  })
  .filter(Boolean)
  .sort((a, b) => a.annee - b.annee);

// Quelques repères connus de tous, à citer en priorité s'ils sont avant la naissance.
const CELEBRES = ['apollo', 'a-eiffel', 'revolution', 'colomb', 'gagarine', 'mur', 'web', 'guerre-39', 'a-napoleon', 'a-darwin'];

// « Quand tu es né(e), … datait de N ans » : uniquement des différences d'années exactes
// (année de naissance − année de l'événement). Si le jour n'est pas connu, l'écart reste exact en années civiles.
export function avantNaissance(n, combien = 5) {
  const avant = EVENEMENTS_DATES.filter((e) => e.annee < n.annee);
  // 1. les trois plus récents avant la naissance (le monde « juste avant toi »)
  const recents = avant.slice(-3).reverse();
  // 2. puis des repères célèbres, plus anciens
  const deja = new Set(recents.map((e) => e.id));
  const celebres = CELEBRES.map((id) => avant.find((e) => e.id === id))
    .filter((e) => e && !deja.has(e.id));
  return [...recents, ...celebres].slice(0, combien)
    .map((e) => ({ ...e, ecart: n.annee - e.annee }))
    .sort((a, b) => a.ecart - b.ecart);
}

// « Depuis ta naissance » : l'année de l'événement et l'âge atteint cette année-là.
export function depuisNaissance(n, combien = 6) {
  const apres = EVENEMENTS_DATES.filter((e) => e.annee > n.annee);
  if (apres.length <= combien) return apres.map((e) => ({ ...e, age: e.annee - n.annee }));
  // On en prend de façon régulière, pour couvrir toute la vie.
  const pas = (apres.length - 1) / (combien - 1);
  const choisis = [];
  for (let i = 0; i < combien; i += 1) choisis.push(apres[Math.round(i * pas)]);
  return [...new Set(choisis)].map((e) => ({ ...e, age: e.annee - n.annee }));
}

// Une comparaison exacte, calculées à partir des données du site.
export function comparaisons(n, ageAns) {
  const sorties = [];
  // La part de l'histoire écrite (l'écriture : date approximative, « vers … » dans la fiche)
  const ecriture = PAR_ID.ecriture;
  if (ecriture?.ans) {
    const pourcent = (ageAns / ecriture.ans) * 100;
    sorties.push({
      id: 'ecriture',
      texte: `Ta vie représente environ ${nombre(Number(pourcent.toFixed(1)), 1)} % du temps écoulé depuis l'invention de l'écriture (${ecriture.dateCourte}, date approximative).`,
    });
  }
  return sorties;
}
