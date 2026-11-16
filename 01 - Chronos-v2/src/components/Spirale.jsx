import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Carte from './Carte.jsx';
import { ETAGES } from '../data/index.js';
import { texteAge } from '../lib/ages.js';

// ---------------------------------------------------------------------------
// LA SPIRALE DU TEMPS (page d'essai : #/spirale)
// Aujourd'hui au centre, le Big Bang au bord. Spirale logarithmique :
// un tour vers l'extérieur = 10 fois plus de temps. Comme chaque tour est aussi
// G fois plus grand à l'écran, zoomer ×G revient exactement à la même image,
// décalée d'un tour : on « plonge » sans fin vers le présent.
// Le dessin (lueurs, flou) est sur un canvas ; les points sont de vrais boutons
// HTML par-dessus, et la liste complète reste accessible au clavier et aux lecteurs d'écran.
// ---------------------------------------------------------------------------

const G = 3; // croissance du rayon à l'écran par tour
const R0 = 1; // rayon (px) du tour « 1 an » quand le zoom vaut 0
const INCLINAISON = 0.7; // effet de plongée : la spirale est vue un peu en biais
const U_MAX = Math.log10(13.8e9); // le Big Bang, en « tours » (1 tour = ×10)

// Les six étages (en années avant aujourd'hui) et leurs couleurs (celles du site).
const BANDES = [
  { id: 'univers', debut: 13.8e9, fin: 4.6e9, rgb: [167, 139, 250] },
  { id: 'terre', debut: 4.6e9, fin: 4.0e9, rgb: [251, 146, 60] },
  { id: 'vie', debut: 4.0e9, fin: 7e6, rgb: [74, 222, 128] },
  { id: 'humains', debut: 7e6, fin: 5300, rgb: [232, 196, 104] },
  { id: 'histoire', debut: 5300, fin: 81, rgb: [248, 113, 113] },
  { id: 'aujourdhui', debut: 81, fin: 0, rgb: [96, 165, 250] },
];
const uDe = (ans) => Math.log10(Math.max(1, ans));
const etageDe = (ans) => (BANDES.find((b) => ans <= b.debut && ans > b.fin) || BANDES[ans > 1e9 ? 0 : 5]).id;

// Couleur continue le long de la spirale, avec un fondu entre deux étages voisins.
const bornesU = BANDES.map((b) => uDe(b.fin));
const hautsU = BANDES.map((b, i) => (i === 0 ? U_MAX : uDe(b.debut)));
const melange = (a, b, t) => a.map((x, k) => Math.round(x + (b[k] - x) * t));
function couleurU(u) {
  let i = BANDES.findIndex((b, k) => u >= (k < BANDES.length - 1 ? bornesU[k] : -1));
  if (i < 0) i = 0;
  const c = BANDES[i].rgb;
  const versRecent = u - (i < BANDES.length - 1 ? bornesU[i] : -1);
  const versAncien = hautsU[i] - u;
  if (BANDES[i + 1] && versRecent < 0.12) return melange(c, BANDES[i + 1].rgb, 0.5 * (1 - versRecent / 0.12));
  if (BANDES[i - 1] && versAncien < 0.12) return melange(c, BANDES[i - 1].rgb, 0.5 * (1 - versAncien / 0.12));
  return c;
}
// Intensité : plus vive au milieu de chaque étage, plus douce aux extrémités (comme la ligne du site).
function intensiteU(u) {
  const i = BANDES.findIndex((b, k) => u >= (k < BANDES.length - 1 ? bornesU[k] : -1));
  const haut = i === 0 ? U_MAX : uDe(BANDES[i].debut);
  const bas = i < BANDES.length - 1 ? bornesU[i] : 0;
  const f = (u - bas) / ((haut - bas) || 1);
  return 0.55 + 0.45 * Math.sin(Math.PI * Math.min(1, Math.max(0, f)));
}

// Événements : niveau 1 = fiches complètes, 2 = principaux, 3 = les autres.
function niveauDe(e) {
  if (e.texte) return 1;
  if (e.principal) return 2;
  return 3;
}

export default function Spirale({ parId, carteOuverte, onBasculer, onFermer, onEtage }) {
  const toile = useRef(null);
  const boite = useRef(null);
  const [vue, setVue] = useState({ L: null }); // L = zoom, en tours
  const [rendu, setRendu] = useState({ points: [], largeur: 0, hauteur: 0, ecran: '', etage: 'univers' });
  const cibleL = useRef(null);
  const Lref = useRef(null);
  const anim = useRef(0);
  const reduit = useRef(false);

  const evenements = useMemo(
    () =>
      Object.values(parId)
        .filter((e) => e.type !== 'periode' && e.type !== 'animal' && typeof e.ans === 'number' && e.ans >= 0)
        .map((e) => ({ ...e, u: uDe(e.ans), niveau: niveauDe(e) }))
        .sort((a, b) => a.niveau - b.niveau || b.ans - a.ans),
    [parId]
  );

  // ---- Géométrie ----
  const mesures = () => {
    const el = boite.current;
    const w = el?.clientWidth || 800;
    const h = el?.clientHeight || 600;
    return { w, h, cx: w / 2, cy: h * 0.5, demi: Math.min(w, h * 1.2) / 2 };
  };
  const vMax = () => Math.log(mesures().demi * 0.95 / R0) / Math.log(G);
  const limites = () => {
    const v = vMax();
    return { min: v - U_MAX - 0.05, max: v - Math.log10(25) }; // tout voir … ~25 dernières années
  };
  // Position à l'écran d'un âge u (en tours) pour un zoom L.
  const projeter = (u, L, m) => {
    const v = u + L;
    const r = R0 * Math.pow(G, v);
    const a = 2 * Math.PI * v - Math.PI / 2;
    return { x: m.cx + r * Math.cos(a), y: m.cy + r * Math.sin(a) * INCLINAISON, r };
  };

  // ---- Dessin ----
  const brouillon = useRef(null);
  const dessiner = useCallback(() => {
    const c = toile.current;
    if (!c || Lref.current === null) return;
    const m = mesures();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    if (c.width !== Math.round(m.w * dpr) || c.height !== Math.round(m.h * dpr)) {
      c.width = Math.round(m.w * dpr);
      c.height = Math.round(m.h * dpr);
    }
    const ctx = c.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, m.w, m.h);
    const L = Lref.current;

    // Étoiles qui défilent vers l'extérieur quand on plonge (parallaxe).
    dessinerEtoiles(ctx, m, L);

    // Échantillons de la spirale visible.
    const vHaut = Math.log(Math.hypot(m.w, m.h) * 0.9 / R0) / Math.log(G);
    const uDebut = Math.max(0, 0.35 - L);
    const uFin = Math.min(U_MAX, vHaut - L);
    const pas = 1 / 180;
    const pts = [];
    for (let u = uFin; u >= uDebut; u -= pas) pts.push({ u, ...projeter(u, L, m) });
    if (pts.length < 2) return;

    // Épaisseur : 7 px près de la caméra, 2 px vers le centre. Bords d'écran : plus flous, plus transparents.
    const epaisseur = (r) => Math.max(1.6, Math.min(7, r / 38));
    const proche = (r) => Math.max(0, Math.min(1, (r - m.demi * 0.85) / (m.demi * 0.5)));

    // 1 et 2 : aura et halo, dessinés en petit puis agrandis (l'agrandissement floute naturellement).
    if (!brouillon.current) brouillon.current = document.createElement('canvas');
    const b = brouillon.current;
    const passes = [
      { echelle: 1 / 8, largeur: 4.2, alpha: 0.32 },
      { echelle: 1 / 3, largeur: 2.2, alpha: 0.45 },
    ];
    passes.forEach((p) => {
      b.width = Math.ceil(m.w * p.echelle);
      b.height = Math.ceil(m.h * p.echelle);
      const bc = b.getContext('2d');
      bc.setTransform(p.echelle, 0, 0, p.echelle, 0, 0);
      bc.lineCap = 'round';
      tracer(bc, pts, (q) => {
        const col = couleurU(q.u);
        const a = p.alpha * intensiteU(q.u) * (1 - 0.5 * proche(q.r));
        return { style: `rgba(${col[0]},${col[1]},${col[2]},${a})`, largeur: epaisseur(q.r) * p.largeur };
      });
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(b, 0, 0, m.w, m.h);
    });

    // 3 : le cœur net, puis le filet de lumière au centre.
    ctx.lineCap = 'round';
    tracer(ctx, pts, (q) => {
      const col = couleurU(q.u);
      const a = (0.35 + 0.65 * intensiteU(q.u)) * (1 - 0.65 * proche(q.r));
      return { style: `rgba(${col[0]},${col[1]},${col[2]},${a})`, largeur: epaisseur(q.r) };
    });
    tracer(ctx, pts, (q) => ({
      style: `rgba(255,255,255,${0.55 * intensiteU(q.u) * (1 - proche(q.r))})`,
      largeur: epaisseur(q.r) / 3,
    }));

    // Repères discrets : la valeur de chaque tour (puissance de 10).
    ctx.font = '13px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    for (let n = Math.ceil(uDebut); n <= Math.floor(uFin); n++) {
      const p = projeter(n, L, m);
      if (p.r < 40 || p.r > m.demi * 1.3) continue;
      const ext = projeter(n + 0.001, L, m);
      const nx = (ext.x - m.cx) / (p.r || 1);
      const ny = (ext.y - m.cy) / (p.r || 1);
      ctx.fillStyle = `rgba(185,190,208,${0.55 * (1 - proche(p.r))})`;
      ctx.fillText(nomPuissance(n), p.x + nx * 26, p.y + ny * 26 + 4);
    }
  }, []);

  // ---- Points et étiquettes (HTML) ----
  const placer = useCallback(() => {
    if (Lref.current === null) return;
    const m = mesures();
    const L = Lref.current;
    const places = [];
    const etiquettes = [];
    const resultat = [];
    const libre = (bx) => etiquettes.every((o) => bx.x2 < o.x1 || bx.x1 > o.x2 || bx.y2 < o.y1 || bx.y1 > o.y2);
    for (const e of evenements) {
      if (resultat.length > 140) break;
      const p = projeter(e.u, L, m);
      if (p.x < -20 || p.y < -20 || p.x > m.w + 20 || p.y > m.h + 20) continue;
      const seuil = e.niveau === 1 ? 26 : e.niveau === 2 ? 80 : 160; // le détail apparaît en zoomant
      if (p.r < seuil && e.ans > 0) continue;
      if (places.some((q) => Math.hypot(q.x - p.x, q.y - p.y) < 22)) continue;
      // un point ne se pose pas sur une étiquette déjà placée
      if (etiquettes.some((o) => p.x > o.x1 - 10 && p.x < o.x2 + 10 && p.y > o.y1 - 10 && p.y < o.y2 + 10)) continue;
      places.push(p);
      // Étiquette horizontale : on essaie quatre positions autour du point.
      const lw = Math.min(220, 14 + e.titre.length * 7.6);
      const lh = 24;
      const essais = [
        { dx: 14, dy: -lh / 2 }, { dx: -14 - lw, dy: -lh / 2 }, { dx: -lw / 2, dy: -lh - 12 }, { dx: -lw / 2, dy: 12 },
      ];
      let pos = null;
      for (const s of essais) {
        const bx = { x1: p.x + s.dx, y1: p.y + s.dy, x2: p.x + s.dx + lw, y2: p.y + s.dy + lh };
        if (bx.x1 < 8 || bx.x2 > m.w - 8 || bx.y1 < 8 || bx.y2 > m.h - 8) continue;
        if (libre(bx) && places.every((q) => q === p || q.x < bx.x1 - 8 || q.x > bx.x2 + 8 || q.y < bx.y1 - 8 || q.y > bx.y2 + 8)) {
          pos = s;
          etiquettes.push(bx);
          break;
        }
      }
      resultat.push({ e, x: p.x, y: p.y, etiquette: pos, etage: etageDe(e.ans), flou: Math.max(0, Math.min(1, (p.r - m.demi * 0.9) / (m.demi * 0.45))) });
    }
    // Ce qu'on voit à l'écran, et l'étage « regardé » (l'anneau à mi-distance).
    const uBord = Math.log(m.demi / R0) / Math.log(G) - L;
    const uMilieu = Math.log((m.demi * 0.5) / R0) / Math.log(G) - L;
    const ansMilieu = Math.pow(10, Math.min(U_MAX, Math.max(0, uMilieu)));
    const etage = etageDe(ansMilieu);
    setRendu({ points: resultat, largeur: m.w, hauteur: m.h, ecran: texteEcran(Math.pow(10, Math.min(U_MAX, uBord))), etage });
    onEtage?.(etage, ansMilieu);
  }, [evenements, onEtage]);

  // Boucle d'animation : on glisse en douceur vers le zoom visé.
  const boucle = useCallback(() => {
    cancelAnimationFrame(anim.current);
    const pas = () => {
      const cible = cibleL.current;
      const L = Lref.current;
      if (cible === null || L === null) return;
      const d = cible - L;
      Lref.current = reduit.current || Math.abs(d) < 0.002 ? cible : L + d * 0.14;
      dessiner();
      placer();
      if (Lref.current !== cible) anim.current = requestAnimationFrame(pas);
      else setVue({ L: cible });
    };
    anim.current = requestAnimationFrame(pas);
  }, [dessiner, placer]);

  const zoomer = useCallback(
    (delta) => {
      const { min, max } = limites();
      const base = cibleL.current ?? Lref.current;
      cibleL.current = Math.min(max, Math.max(min, base + delta));
      boucle();
    },
    [boucle]
  );
  const allerA = useCallback(
    (L) => {
      const { min, max } = limites();
      cibleL.current = Math.min(max, Math.max(min, L));
      boucle();
    },
    [boucle]
  );

  // Démarrage : toute la spirale, puis redessin à chaque changement de taille.
  useEffect(() => {
    reduit.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const { min } = limites();
    Lref.current = min;
    cibleL.current = min;
    dessiner();
    placer();
    setVue({ L: min });
    const obs = new ResizeObserver(() => {
      const lim = limites();
      Lref.current = Math.min(lim.max, Math.max(lim.min, Lref.current));
      cibleL.current = Lref.current;
      dessiner();
      placer();
    });
    obs.observe(boite.current);
    return () => {
      obs.disconnect();
      cancelAnimationFrame(anim.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Molette, pincement, glisser vertical (téléphone), clavier.
  useEffect(() => {
    const el = boite.current;
    let dernier = null;
    const pointeurs = new Map();
    const roue = (e) => {
      e.preventDefault();
      zoomer(-e.deltaY * (e.ctrlKey ? 0.012 : 0.0025));
    };
    const bas = (e) => {
      if (e.target.closest('button')) return;
      pointeurs.set(e.pointerId, { x: e.clientX, y: e.clientY });
      el.setPointerCapture(e.pointerId);
    };
    const bouge = (e) => {
      if (!pointeurs.has(e.pointerId)) return;
      const avant = pointeurs.get(e.pointerId);
      pointeurs.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointeurs.size === 2) {
        const [a, b] = [...pointeurs.values()];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dernier) zoomer(Math.log(dist / dernier) / Math.log(G));
        dernier = dist;
      } else {
        zoomer(-(e.clientY - avant.y) / 160); // glisser vers le haut = plonger
      }
    };
    const haut = (e) => {
      pointeurs.delete(e.pointerId);
      if (pointeurs.size < 2) dernier = null;
    };
    const touche = (e) => {
      if (e.target.closest('input, select, textarea')) return;
      if (e.key === '+' || e.key === '=' || e.key === 'ArrowUp') { e.preventDefault(); zoomer(0.5); }
      if (e.key === '-' || e.key === 'ArrowDown') { e.preventDefault(); zoomer(-0.5); }
    };
    el.addEventListener('wheel', roue, { passive: false });
    el.addEventListener('pointerdown', bas);
    el.addEventListener('pointermove', bouge);
    el.addEventListener('pointerup', haut);
    el.addEventListener('pointercancel', haut);
    el.addEventListener('keydown', touche);
    return () => {
      el.removeEventListener('wheel', roue);
      el.removeEventListener('pointerdown', bas);
      el.removeEventListener('pointermove', bouge);
      el.removeEventListener('pointerup', haut);
      el.removeEventListener('pointercancel', haut);
      el.removeEventListener('keydown', touche);
    };
  }, [zoomer]);

  // Aller à un événement (depuis la liste accessible).
  const viser = (e) => {
    const v = Math.log((mesures().demi * 0.45) / R0) / Math.log(G);
    allerA(v - e.u);
    onBasculer(e.id);
  };

  const ouverte = carteOuverte ? parId[carteOuverte] : null;
  const etageCarte = ouverte ? ETAGES.find((x) => x.id === ouverte.etage) : null;
  const lim = Lref.current !== null ? limites() : null;

  return (
    <div className="spirale">
      <h1 className="sr-only" tabIndex={-1}>La spirale du temps</h1>
      <div className="spirale__scene" ref={boite} tabIndex={0} aria-label="Spirale du temps. Plus et moins, ou flèches haut et bas, pour plonger ou ressortir.">
        <canvas ref={toile} className="spirale__toile" aria-hidden="true" />
        <div className="spirale__points" aria-hidden="true">
          {rendu.points.map(({ e, x, y, etiquette, etage, flou }) => (
            <div key={e.id} className="spirale__point" data-etage={etage} style={{ transform: `translate(${x}px, ${y}px)`, opacity: 1 - flou * 0.6, filter: flou > 0.05 ? `blur(${flou * 2.5}px)` : undefined }}>
              <button
                type="button"
                tabIndex={-1}
                id={`point-${e.id}`}
                className={carteOuverte === e.id ? 'point point--ouvert spirale__bouton' : 'point spirale__bouton'}
                onClick={() => onBasculer(e.id)}
              >
                <span className="point__repere">
                  {carteOuverte === e.id && (
                    <>
                      <span className="onde onde--1" />
                      <span className="onde onde--2" />
                      <span className="onde onde--3" />
                    </>
                  )}
                  <span className="point__disque" />
                </span>
              </button>
              {etiquette && (
                <span className="spirale__etiquette" style={{ left: etiquette.dx, top: etiquette.dy }} onClick={() => onBasculer(e.id)}>
                  <span className="point__titre">{e.titre}</span>
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="spirale__legende verre">
        <p className="spirale__marque">Chronos</p>
        <p className="spirale__regle">Un tour vers l’extérieur = 10 fois plus de temps</p>
        <ul className="spirale__etages">
          {ETAGES.map((x) => (
            <li key={x.id} data-etage={x.id}><span className="spirale__pastille" aria-hidden="true" />{x.nom}</li>
          ))}
        </ul>
      </div>

      <p className="spirale__indicateur verre" aria-live="polite" data-etage={rendu.etage}>
        <span className="spirale__indicateur-etage">{ETAGES.find((x) => x.id === rendu.etage)?.nom}</span>
        <span>À l’écran : {rendu.ecran}</span>
      </p>

      <div className="spirale__boutons">
        <button type="button" className="verre spirale__action" onClick={() => allerA(lim ? lim.max : 0)}>Revenir à aujourd’hui</button>
        <button type="button" className="verre spirale__action" onClick={() => allerA(lim ? lim.min : 0)}>Tout voir</button>
        <div className="zoom" role="group" aria-label="Zoom de la spirale">
          <button type="button" className="zoom__bouton" onClick={() => zoomer(-1)} aria-label="Ressortir d’un tour"><span aria-hidden="true">−</span></button>
          <button type="button" className="zoom__bouton" onClick={() => zoomer(1)} aria-label="Plonger d’un tour"><span aria-hidden="true">+</span></button>
        </div>
      </div>

      {/* La même chose, lisible par tous : la liste des événements. */}
      <details className="spirale__liste verre">
        <summary>Liste des événements</summary>
        <ol>
          {[...evenements].sort((a, b) => b.ans - a.ans).map((e) => (
            <li key={e.id}>
              <button type="button" onClick={() => viser(e)}>
                <span className="spirale__liste-date">{e.dateCourte}</span> {e.titre}
              </button>
            </li>
          ))}
        </ol>
      </details>

      {ouverte && etageCarte && <Carte key={ouverte.id} carte={ouverte} etage={etageCarte} onFermer={onFermer} />}
      <span hidden>{vue.L}</span>
    </div>
  );
}

// Trace une suite de points en petits morceaux (épaisseur et couleur variables).
function tracer(ctx, pts, style) {
  const morceau = 6;
  for (let i = 0; i < pts.length - 1; i += morceau) {
    const fin = Math.min(pts.length - 1, i + morceau);
    const s = style(pts[i]);
    ctx.beginPath();
    ctx.moveTo(pts[i].x, pts[i].y);
    for (let k = i + 1; k <= fin; k++) ctx.lineTo(pts[k].x, pts[k].y);
    ctx.strokeStyle = s.style;
    ctx.lineWidth = s.largeur;
    ctx.stroke();
  }
}

// Étoiles propres à la spirale : elles s'écartent du centre quand on plonge (impression de vitesse).
const ETOILES = Array.from({ length: 140 }, (_, i) => {
  const h = (n) => ((Math.sin(i * 12.9898 + n * 78.233) * 43758.5453) % 1 + 1) % 1;
  return { a: h(1) * Math.PI * 2, d: h(2), r: 0.5 + h(3) * 1.2, o: 0.25 + h(4) * 0.5, couche: h(5) < 0.5 ? 0.35 : 0.7 };
});
function dessinerEtoiles(ctx, m, L) {
  const diag = Math.hypot(m.w, m.h) / 2;
  ETOILES.forEach((s) => {
    const phase = (((s.d + L * s.couche * 0.35) % 1) + 1) % 1; // chaque étoile file vers l'extérieur puis revient au centre
    const dist = Math.pow(phase, 1.6) * diag;
    const x = m.cx + Math.cos(s.a) * dist;
    const y = m.cy + Math.sin(s.a) * dist * INCLINAISON;
    const fondu = Math.min(1, phase * 4) * (1 - Math.max(0, phase - 0.85) / 0.15);
    ctx.fillStyle = `rgba(255,255,255,${s.o * fondu})`;
    ctx.beginPath();
    ctx.arc(x, y, s.r * (0.6 + phase), 0, Math.PI * 2);
    ctx.fill();
  });
}

function nomPuissance(n) {
  const a = Math.pow(10, n);
  if (a < 1e6) return `${a.toLocaleString('fr-FR')} ans`;
  if (a < 1e9) return `${(a / 1e6).toLocaleString('fr-FR')} Ma`;
  return `${(a / 1e9).toLocaleString('fr-FR')} Ga`;
}

function texteEcran(ans) {
  if (ans >= 13.8e9 * 0.9) return 'toute l’histoire de l’univers';
  if (ans < 1e6) return `les ${Math.round(ans).toLocaleString('fr-FR')} dernières années`;
  return `les ${texteAge(ans)}`;
}
