// Construit la ligne du temps d'un étage.
// Chaque période (catégorie) est un tronçon À L'ÉCHELLE : dans un tronçon,
// la même distance représente toujours la même durée.
// Entre deux tronçons, un « saut d'échelle » (l'échelle change).
// Le récit biblique n'a pas de date : ses événements sont simplement espacés, sans échelle.

export const MESURES = {
  marge: 100,          // espace au début et à la fin d'un tronçon (px)
  tronconMin: 760,     // largeur minimale d'un tronçon (px)
  parEvenement: 230,   // largeur ajoutée par événement (px)
  saut: 120,           // espace entre deux tronçons (px)
  etiquette: 176,      // largeur d'une étiquette d'événement (px)
  rang: 128,           // hauteur d’un rang d’étiquettes (px)
  ecartMin: 48,        // écart minimal entre deux points, pour le doigt (px)
  rangsMax: 2,         // jamais plus de deux étiquettes l’une sous l’autre
  allongementMax: 4,   // une période peut s’allonger jusqu’à 4 fois pour aérer ses étiquettes
};

// Les thèmes d'un étage, dans l'ordre (une catégorie sans thème appartient au thème « principal »).
export function themesDe(etage) {
  const themes = [];
  etage.categories.forEach((c) => {
    const t = c.theme || 'principal';
    if (!themes.includes(t)) themes.push(t);
  });
  return themes;
}

export function construireLigne(etage, parId, theme = 'principal') {
  const m = MESURES;
  const espace = m.etiquette + 12; // place d'une étiquette sur un même rang
  let x = 0;
  const categories = etage.categories.filter((c) => (c.theme || 'principal') === theme);
  const troncons = categories.map((cat, i) => {
    if (i > 0) x += m.saut;
    const evenements = cat.evenements.map((id) => parId[id]);
    const dates = evenements.map((e) => e.ans).filter((a) => a !== null && a !== undefined);
    const sansEchelle = dates.length < evenements.length || (dates.length === 0 && cat.debut === undefined);
    let largeur = Math.max(m.tronconMin, evenements.length * m.parEvenement);
    let utile = largeur - 2 * m.marge;

    // On allonge la période si ses événements sont trop serrés :
    // un point sur deux doit laisser la place d'une étiquette entière (deux rangs au plus).
    if (!sansEchelle && evenements.length > 2) {
      const debut = cat.debut ?? Math.max(...dates);
      const fin = cat.fin ?? Math.min(...dates);
      const duree = debut - fin || 1;
      const u = dates
        .map((a) => (debut - Math.min(debut, Math.max(fin, a))) / duree)
        .sort((a, b) => a - b);
      let besoin = utile;
      for (let k = 1; k < u.length; k++) {
        const d1 = u[k] - u[k - 1];
        if (d1 > 0) besoin = Math.max(besoin, m.ecartMin / d1);
        if (k >= 2) {
          const d2 = u[k] - u[k - 2];
          if (d2 > 0) besoin = Math.max(besoin, espace / d2);
        }
      }
      utile = Math.min(besoin, utile * m.allongementMax);
      largeur = utile + 2 * m.marge;
    }

    let debutAns = null;
    let finAns = null;
    let pxParAn = null;
    let points;

    if (sansEchelle) {
      points = evenements.map((e, k) => ({
        carte: e,
        x: x + m.marge + (evenements.length === 1 ? utile / 2 : (k * utile) / (evenements.length - 1)),
      }));
    } else {
      // Bornes de la période si on les connaît, sinon celles de ses événements.
      debutAns = cat.debut ?? Math.max(...dates);
      finAns = cat.fin ?? Math.min(...dates);
      const duree = debutAns - finAns || 1;
      pxParAn = utile / duree;
      points = evenements.map((e) => {
        const ans = Math.min(debutAns, Math.max(finAns, e.ans));
        return { carte: e, x: x + m.marge + (debutAns - ans) * pxParAn };
      });
    }

    // S'il reste des points trop serrés, on les décale légèrement vers la droite
    // (l'ordre reste juste) : assez d'écart pour le doigt, et jamais plus de deux rangs d'étiquettes.
    points.sort((a, b) => a.x - b.x);
    for (let k = 1; k < points.length; k++) {
      let min = points[k - 1].x + m.ecartMin;
      if (k >= m.rangsMax) min = Math.max(min, points[k - m.rangsMax].x + espace);
      if (points[k].x < min) points[k].x = min;
    }
    if (points.length) largeur = Math.max(largeur, points[points.length - 1].x - x + m.marge);

    // Les étiquettes trop proches s'empilent sur des rangs différents.
    const finRangs = [];
    points
      .slice()
      .sort((a, b) => a.x - b.x)
      .forEach((p) => {
        let r = finRangs.findIndex((fin) => p.x - fin >= espace);
        if (r === -1) {
          r = finRangs.length;
          finRangs.push(p.x);
        } else {
          finRangs[r] = p.x;
        }
        p.rang = r;
      });

    const troncon = {
      categorie: cat,
      x,
      largeur,
      debutAns,
      finAns,
      pxParAn,
      sansEchelle,
      points,
      rangs: finRangs.length,
    };
    x += largeur;
    return troncon;
  });

  return {
    theme,
    troncons,
    largeur: x,
    rangs: Math.max(1, ...troncons.map((t) => t.rangs)),
  };
}

// Où se trouve une date sur la ligne ? (pour le bandeau du vivant)
// Avant le premier tronçon : 0 ; après le dernier : la fin de la ligne.
export function xPourAns(ligne, ans) {
  const m = MESURES;
  const aEchelle = ligne.troncons.filter((t) => !t.sansEchelle);
  if (aEchelle.length === 0) return 0;
  if (ans >= aEchelle[0].debutAns) return aEchelle[0].x + (ans === aEchelle[0].debutAns ? m.marge : 0);
  for (const t of aEchelle) {
    if (ans <= t.debutAns && ans >= t.finAns) return t.x + m.marge + (t.debutAns - ans) * t.pxParAn;
    if (ans > t.debutAns) return t.x; // dans le saut entre deux tronçons
  }
  return ligne.largeur;
}

// Quelle date se trouve à la position x de la ligne ?
// Renvoie { troncon, ans } ; ans vaut null dans un tronçon sans échelle.
export function lirePosition(ligne, x) {
  const m = MESURES;
  let troncon = ligne.troncons[0];
  for (const t of ligne.troncons) {
    if (x >= t.x - m.saut / 2) troncon = t;
  }
  if (troncon.sansEchelle) return { troncon, ans: null };
  const dedans = Math.min(Math.max(x - troncon.x - m.marge, 0), troncon.largeur - 2 * m.marge);
  return { troncon, ans: Math.max(troncon.finAns, troncon.debutAns - dedans / troncon.pxParAn) };
}

// Écrit une durée « il y a … » lisible.
export function texteIlYA(ans) {
  if (ans === null || ans === undefined) return 'Récit biblique, sans date';
  const nombre = (n, d = 1) => n.toLocaleString('fr-FR', { maximumFractionDigits: d });
  if (ans >= 1e9) return `il y a ${nombre(ans / 1e9)} milliard${ans >= 2e9 ? 's' : ''} d’années`;
  if (ans >= 1e6) return `il y a ${nombre(ans / 1e6)} million${ans >= 2e6 ? 's' : ''} d’années`;
  if (ans >= 10000) return `il y a ${nombre(Math.round(ans / 1000) * 1000, 0)} ans`;
  const annee = 2026 - Math.round(ans);
  return annee <= 0 ? `vers ${nombre(1 - annee, 0)} av. J.-C.` : `vers ${annee}`;
}
