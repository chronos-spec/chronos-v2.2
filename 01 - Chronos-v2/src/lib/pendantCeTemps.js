// « Pendant ce temps… » : pour une carte ouverte, trouve 2 à 4 choses qui se passaient
// au même moment AILLEURS (autre continent, autre étage) ou des êtres vivants de cette époque.
// Fonction pure : elle ne lit que ce qu'on lui donne et ne touche à rien.
// Aucune date n'est inventée : on ne compare que les dates déjà présentes dans les données.
// Cas vérifiés à la main : docs/fonctions/fonction-pendant-ce-temps.md

// La fenêtre de temps s'adapte à l'échelle : 3 % de l’ancienneté, et au moins 10 ans.
//   1969 (57 ans)        → ± 10 ans
//   1455 (571 ans)       → ± 17 ans (quelques décennies)
//   66 millions d’années → ± 2 millions d’années
export function fenetre(ans) {
  return Math.max(10, ans * 0.03);
}

// Une carte d'Histoire peut couvrir plusieurs années (« 1939 à 1945 », « 1337–1453 ») :
// on lit ces deux années dans sa date affichée (rien n'est deviné). Sinon : une seule date.
// Renvoie [debut, fin] en années avant 2026, ou null si la date affichée n'est pas un intervalle.
const AUJOURDHUI = 2026;
export function intervalleAffiche(e) {
  const m = /^(\d{3,4})\s*(?:à|–|-)\s*(\d{3,4})$/.exec((e.dateCourte || '').trim());
  if (!m) return null;
  const a = Number(m[1]); const b = Number(m[2]);
  if (b < a || Math.abs(AUJOURDHUI - a - e.ans) > 1) return null; // prudence : doit coller avec « ans »
  return [AUJOURDHUI - a, AUJOURDHUI - b];
}

const MAX = 4;
const MIN = 2;

/**
 * @param carte   la carte ouverte (avec ans, etage, lieux éventuels)
 * @param donnees { parId, bestiaire, especes, nomsLieux, nomsEtages }
 * @returns liste de { cle, titre, date, raison } (cle = clé de la loupe de recherche)
 */
export function pendantCeTemps(carte, { parId, bestiaire = {}, especes = [], nomsLieux = {}, nomsEtages = {} }) {
  if (!carte || carte.type === 'periode' || typeof carte.ans !== 'number') return [];
  const ans = carte.ans;
  // Carte qui couvre une durée : « pendant » = dans cette durée (pas de marge).
  const duree = intervalleAffiche(carte);
  const [debutC, finC] = duree || [ans, ans];
  const tol = duree ? 0 : fenetre(ans);
  // Écart entre l'élément [debut, fin] et la carte [debutC, finC] (0 s'ils se chevauchent).
  const distance = (debut, fin) => (fin > debutC ? fin - debutC : debut < finC ? finC - debut : 0);
  // On dit honnêtement si l'être vivant était là, ou s'il a disparu juste avant / est apparu juste après.
  const raisonVivant = (debut, fin) => (fin > debutC ? 'Disparu peu avant' : debut < finC ? 'Apparu peu après' : 'Vivait à cette époque');
  const lieux = carte.lieux || [];
  const candidats = [];

  // 1. Les événements (accueil et Histoire du monde).
  Object.values(parId).forEach((e) => {
    if (e.id === carte.id || e.type === 'periode' || e.type === 'animal' || typeof e.ans !== 'number') return;
    const [deb, fin] = intervalleAffiche(e) || [e.ans, e.ans];
    const d = distance(deb, fin);
    if (d > tol) return;
    if (e.etage !== carte.etage) {
      candidats.push({ cle: e.id, titre: e.titre, date: e.dateCourte || e.date, d, groupe: `etage-${e.etage}`,
        raison: `Étage ${nomsEtages[e.etage] || e.etage}` });
      return;
    }
    // Même étage : seulement si on sait que c'est sur un autre continent (aucun lieu en commun).
    const autres = e.lieux || [];
    if (!lieux.length || !autres.length || autres.some((l) => lieux.includes(l))) return;
    candidats.push({ cle: e.id, titre: e.titre, date: e.dateCourte || e.date, d, groupe: `lieu-${autres[0]}`,
      raison: `Ailleurs : ${autres.map((l) => nomsLieux[l] || l).join(', ')}` });
  });

  // 2. Les animaux du bestiaire qui vivaient à cette époque (dates d'apparition et de disparition).
  Object.values(parId).forEach((e) => {
    if (e.type !== 'animal' || e.id === carte.id) return;
    const brut = (bestiaire[e.categorie] || []).find((a) => `animal-${a.id}` === e.id);
    if (!brut || typeof brut.debut !== 'number' || typeof brut.fin !== 'number') return;
    const d = distance(brut.debut, brut.fin);
    if (d > tol) return;
    candidats.push({ cle: e.id, titre: e.titre, date: e.dateCourte, d, etendue: brut.debut - brut.fin,
      groupe: 'animal', raison: raisonVivant(brut.debut, brut.fin) });
  });

  // 3. Les espèces humaines (sauf la nôtre, toujours là : ce ne serait pas une coïncidence).
  especes.forEach((s) => {
    if (!s.fin || carte.id === `espece-${s.id}`) return;
    const d = distance(s.debut, s.fin);
    if (d > tol) return;
    candidats.push({ cle: `espece-${s.id}`, titre: s.nom, date: null, debut: s.debut, fin: s.fin, d,
      etendue: s.debut - s.fin, groupe: 'espece', raison: `Espèce humaine : ${raisonVivant(s.debut, s.fin).toLowerCase()}` });
  });

  // Un être vivant présent pendant plus de 10 fois l'âge de la carte ne dit rien de cette date
  // (le dodo, apparu il y a ~1 million d'années, à côté du Bouddha) : on l'écarte.
  const parlants = candidats.filter((c) => !c.etendue || c.etendue <= 10 * ans);
  candidats.length = 0; candidats.push(...parlants);

  // Les plus proches d'abord. Un être vivant qui a duré très longtemps (le dodo, un million d'années)
  // est vrai mais peu parlant pour une date précise : il passe après.
  const note = (c) => c.d / Math.max(tol, 1) + 0.5 * Math.log10(1 + (c.etendue || 0) / Math.max(ans, 1));
  candidats.sort((a, b) => note(a) - note(b) || a.titre.localeCompare(b.titre));

  // On varie : un par continent / étage / sorte d'abord, puis on complète.
  const choisis = [];
  const vus = new Set();
  candidats.forEach((c) => { if (choisis.length < MAX && !vus.has(c.groupe)) { vus.add(c.groupe); choisis.push(c); } });
  candidats.forEach((c) => { if (choisis.length < MAX && !choisis.includes(c)) choisis.push(c); });

  if (choisis.length < MIN) return [];
  return choisis.map(({ cle, titre, date, debut, fin, raison }) => ({ cle, titre, date, debut, fin, raison }));
}
