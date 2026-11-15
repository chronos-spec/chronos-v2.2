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
  rang: 132,           // hauteur d’un rang d’étiquettes (px)
};

export function construireLigne(etage, parId) {
  const m = MESURES;
  let x = 0;
  const troncons = etage.categories.map((cat, i) => {
    if (i > 0) x += m.saut;
    const evenements = cat.evenements.map((id) => parId[id]);
    const dates = evenements.map((e) => e.ans).filter((a) => a !== null && a !== undefined);
    const sansEchelle = dates.length < evenements.length;
    const largeur = Math.max(m.tronconMin, evenements.length * m.parEvenement);
    const utile = largeur - 2 * m.marge;

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
      debutAns = Math.max(...dates);
      finAns = Math.min(...dates);
      const duree = debutAns - finAns || 1;
      pxParAn = utile / duree;
      points = evenements.map((e) => ({ carte: e, x: x + m.marge + (debutAns - e.ans) * pxParAn }));
    }

    // Les étiquettes trop proches s'empilent sur des rangs différents.
    const finRangs = [];
    points
      .slice()
      .sort((a, b) => a.x - b.x)
      .forEach((p) => {
        let r = finRangs.findIndex((fin) => p.x - fin >= m.etiquette + 12);
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
    troncons,
    largeur: x,
    rangs: Math.max(...troncons.map((t) => t.rangs)),
  };
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
  return { troncon, ans: troncon.debutAns - dedans / troncon.pxParAn };
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
