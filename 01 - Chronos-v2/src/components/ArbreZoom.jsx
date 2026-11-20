import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { RACINE, NOEUD_PAR_ID, noeudDeFeuille, TOUS, cheminNoeud } from '../data/arbreZoom.js';
import { ETAGES } from '../data/index.js';
import { imageDe } from '../lib/images.js';
import { lienEtage, lienPeriode } from '../lib/route.js';
import { texteAge } from '../lib/ages.js';
import ImageWiki from './ImageWiki.jsx';

// ---------------------------------------------------------------------------
// L'ARBRE DU VIVANT ZOOMABLE (façon OneZoom)
// Deux vues des MÊMES données (data/arbreZoom.js) :
//  1. un canvas, pour les yeux : zoom continu, des grands groupes jusqu'à chaque espèce.
//     Il est masqué aux lecteurs d'écran (aria-hidden) ;
//  2. une vraie liste en arbre (role="tree"), navigable au clavier. Quand on avance dans la liste,
//     la caméra du canvas suit l'élément choisi.
// Espèces disparues : couleur ambre (--eteint) ET symbole †.
// ---------------------------------------------------------------------------

const mouvementReduit = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const VIE = ETAGES.find((e) => e.id === 'vie');

// « Voir sur la frise » : la période où vit (ou apparaît) l'espèce.
function lienFrise(n) {
  if (n.periode) return { href: lienPeriode('vie', n.periode), texte: 'Voir sa période sur la frise' };
  if (n.humain) return { href: lienEtage('humains'), texte: 'Voir sur la frise des Humains' };
  // Espèce d'aujourd'hui ou groupe : la période où son groupe apparaît.
  let g = n.type === 'groupe' ? n : n.parentNoeud;
  while (g && !g.depuis) g = g.parentNoeud;
  const d = g?.depuis;
  const cat = d && VIE.categories.find((c) => c.debut !== undefined && d <= c.debut && d >= (c.fin ?? 0));
  if (cat) return { href: lienPeriode('vie', cat.id), texte: `Voir sur la frise (${cat.nom})` };
  return { href: lienEtage('vie'), texte: 'Voir sur la frise de la Vie' };
}

// Le cache des images du canvas : chargées seulement quand une pastille devient assez grande.
const IMAGES = new Map(); // titre → { img, pret } | 'attente' | null

export default function ArbreZoom({ cible = null, idFeuille = null, idTitre = 'titre-arbre-zoom' }) {
  const boite = useRef(null);
  const toile = useRef(null);
  const cam = useRef({ x: 0, y: -500, s: 0.5 });
  const limites = useRef({ min: 0.1, max: 10 });
  const taille = useRef({ w: 800, h: 600 });
  const sale = useRef(true);
  const visibles = useRef([]); // pour savoir ce qu'on touche
  const couleurs = useRef({ vie: '74, 222, 128', eteint: '#F59E0B', texte: '#fff' });
  const anim = useRef(0);

  const [selection, setSelection] = useState(null); // id du nœud mis en avant (liste + canvas)
  const [fiche, setFiche] = useState(null); // id de l'espèce ouverte
  const [ouverts, setOuverts] = useState(() => new Set(['vivant', 'eucaryotes']));
  const [focus, setFocus] = useState('vivant');
  const clavier = useRef(false);
  const selectionRef = useRef(selection);
  selectionRef.current = selection;

  const redessiner = useCallback(() => {
    sale.current = true;
  }, []);

  // ---------------- Caméra ----------------
  const borner = (s) => Math.min(limites.current.max, Math.max(limites.current.min, s));
  const cadrer = useCallback((n, instant = false) => {
    const { w, h } = taille.current;
    let b = n.boite;
    // Une espèce : on cadre tout son groupe (elle et ses voisines), jamais une pastille en plein écran.
    if (n.type === 'espece' && n.parentNoeud) b = n.parentNoeud.boite;
    const cible1 = {
      x: (b.x1 + b.x2) / 2,
      y: (b.y1 + b.y2) / 2,
      s: borner(Math.min(w / (b.x2 - b.x1 || 1), h / (b.y2 - b.y1 || 1)) * 0.85),
    };
    cancelAnimationFrame(anim.current);
    if (instant || mouvementReduit()) {
      cam.current = cible1;
      redessiner();
      return;
    }
    const depart = { ...cam.current };
    const t0 = performance.now();
    const duree = 380;
    const pas = (t) => {
      const k = Math.min(1, (t - t0) / duree);
      const e = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2;
      const s = Math.exp(Math.log(depart.s) + (Math.log(cible1.s) - Math.log(depart.s)) * e);
      cam.current = { x: depart.x + (cible1.x - depart.x) * e, y: depart.y + (cible1.y - depart.y) * e, s };
      redessiner();
      if (k < 1) anim.current = requestAnimationFrame(pas);
    };
    anim.current = requestAnimationFrame(pas);
  }, [redessiner]);

  const zoomer = useCallback((facteur, px, py) => {
    const { w, h } = taille.current;
    const c = cam.current;
    const ax = px ?? w / 2;
    const ay = py ?? h / 2;
    // Le point sous la souris reste immobile.
    const wx = c.x + (ax - w / 2) / c.s;
    const wy = c.y + (ay - h / 2) / c.s;
    const s = borner(c.s * facteur);
    cam.current = { x: wx - (ax - w / 2) / s, y: wy - (ay - h / 2) / s, s };
    redessiner();
  }, [redessiner]);

  // ---------------- Taille, couleurs, première vue ----------------
  useEffect(() => {
    const el = toile.current;
    const lireCouleurs = () => {
      const st = getComputedStyle(boite.current);
      couleurs.current = {
        vie: st.getPropertyValue('--etage-rgb').trim() || couleurs.current.vie,
        eteint: st.getPropertyValue('--eteint').trim() || couleurs.current.eteint,
        texte: st.getPropertyValue('--texte').trim() || couleurs.current.texte,
      };
    };
    lireCouleurs();
    const mesurer = () => {
      const r = el.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      taille.current = { w: el.clientWidth, h: el.clientHeight };
      el.width = Math.round(r.width * dpr);
      el.height = Math.round(r.height * dpr);
      const b = RACINE.boite;
      const fit = Math.min(el.clientWidth / (b.x2 - b.x1), el.clientHeight / (b.y2 - b.y1)) * 0.92;
      const plusPetite = Math.min(...TOUS.filter((n) => n.type === 'espece').map((n) => n.r));
      // Zoom maximal : la plus petite pastille fait au plus ~90 px de rayon (au-delà, l'arbre « disparaît »).
      limites.current = { min: fit * 0.6, max: 90 / plusPetite };
      redessiner();
    };
    mesurer();
    cadrer(RACINE, true);
    const obs = new ResizeObserver(mesurer);
    obs.observe(el);
    return () => obs.disconnect();
  }, [cadrer, redessiner]);

  // ---------------- Dessin (seulement si quelque chose a changé) ----------------
  useEffect(() => {
    let id;
    const boucle = () => {
      if (sale.current) {
        sale.current = false;
        dessiner();
      }
      id = requestAnimationFrame(boucle);
    };
    id = requestAnimationFrame(boucle);
    return () => cancelAnimationFrame(id);
  }, []);

  function image(titre) {
    const e = IMAGES.get(titre);
    if (e === undefined) {
      IMAGES.set(titre, 'attente');
      imageDe(titre).then((r) => {
        if (!r) return IMAGES.set(titre, null);
        const img = new Image();
        img.decoding = 'async';
        img.onload = () => {
          IMAGES.set(titre, { img });
          sale.current = true;
        };
        img.onerror = () => IMAGES.set(titre, null);
        img.src = r.src;
      });
      return null;
    }
    return e && e.img ? e.img : null;
  }

  function dessiner() {
    const el = toile.current;
    if (!el) return;
    const ctx = el.getContext('2d');
    const { w, h } = taille.current;
    const dpr = el.width / (w || 1);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    const { x: cx, y: cy, s } = cam.current;
    const vx1 = cx - w / 2 / s;
    const vx2 = cx + w / 2 / s;
    const vy1 = cy - h / 2 / s;
    const vy2 = cy + h / 2 / s;
    const ex = (x) => (x - cx) * s + w / 2;
    const ey = (y) => (y - cy) * s + h / 2;
    const { vie, eteint, texte } = couleurs.current;
    const sel = selectionRef.current;
    const etiquettes = [];
    const vus = [];

    const rec = (n) => {
      const b = n.boite;
      if (b.x2 < vx1 || b.x1 > vx2 || b.y2 < vy1 || b.y1 > vy2) return;
      if ((b.x2 - b.x1 + b.y2 - b.y1) * s < 1.5) return;
      const choisi = n.id === sel;
      // La branche (légèrement courbée)
      // Épaisseur plafonnée à l'écran : en zoomant, une branche ne devient jamais un aplat qui cache tout.
      const largeur = n.type === 'espece'
        ? Math.min(4, Math.max(0.6, n.L * s * 0.02))
        : Math.min(14, Math.max(1, n.L * s * 0.045));
      ctx.strokeStyle = n.eteint ? eteint : `rgba(${vie}, ${choisi ? 1 : 0.75})`;
      ctx.lineWidth = choisi ? largeur + 2 : largeur;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(ex(n.bx), ey(n.by));
      const mx = (n.bx + n.x) / 2 + Math.cos(n.angle + Math.PI / 2) * n.L * 0.06;
      const my = (n.by + n.y) / 2 + Math.sin(n.angle + Math.PI / 2) * n.L * 0.06;
      ctx.quadraticCurveTo(ex(mx), ey(my), ex(n.x), ey(n.y));
      ctx.stroke();

      if (n.type === 'espece') {
        const R = n.r * s;
        if (R < 1) return;
        const X = ex(n.x);
        const Y = ey(n.y);
        ctx.fillStyle = n.eteint ? eteint : `rgb(${vie})`;
        ctx.beginPath();
        ctx.arc(X, Y, R, 0, Math.PI * 2);
        ctx.fill();
        if (R > 14 && n.wiki) {
          const img = image(n.wiki);
          if (img) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(X, Y, R * 0.9, 0, Math.PI * 2);
            ctx.clip();
            const k = Math.max((R * 1.8) / img.width, (R * 1.8) / img.height);
            ctx.drawImage(img, X - (img.width * k) / 2, Y - (img.height * k) / 2, img.width * k, img.height * k);
            ctx.restore();
          }
        }
        if (choisi) {
          ctx.strokeStyle = texte;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(X, Y, R + 4, 0, Math.PI * 2);
          ctx.stroke();
        }
        vus.push({ n, X, Y, R: Math.max(R, 12) });
        if (R > 9) {
          etiquettes.push({ texte: `${n.eteint ? '† ' : ''}${n.nom}`, X, Y: Y + R + 6, taille: Math.min(17, 11 + R / 8), eteint: n.eteint, haut: true });
        }
        return;
      }
      n.enfants.forEach(rec);
      const longueur = n.L * s;
      if (longueur > 70) {
        const X = ex(n.x);
        const Y = ey(n.y);
        etiquettes.push({
          texte: `${n.eteint ? '† ' : ''}${n.nom}`, X, Y: Y - 8, taille: Math.min(22, 12 + longueur / 60), eteint: n.eteint, groupe: true, choisi,
        });
        vus.push({ n, X, Y, R: 16 });
      }
    };
    rec(RACINE);

    // Les noms, par-dessus tout, avec un liseré sombre pour rester lisibles (contraste AA).
    ctx.textAlign = 'center';
    ctx.lineJoin = 'round';
    // On n'écrit un nom que s'il ne chevauche pas un nom déjà écrit (les plus grands d'abord).
    etiquettes.sort((a, b) => (b.choisi - a.choisi) || b.taille - a.taille);
    const poses = [];
    etiquettes.forEach((e) => {
      ctx.font = `${e.groupe ? 600 : 500} ${e.taille}px Inter, sans-serif`;
      const l = ctx.measureText(e.texte).width;
      const r = { x1: e.X - l / 2 - 3, x2: e.X + l / 2 + 3, y1: e.haut ? e.Y : e.Y - e.taille, y2: e.haut ? e.Y + e.taille : e.Y };
      if (poses.some((p) => r.x1 < p.x2 && r.x2 > p.x1 && r.y1 < p.y2 && r.y2 > p.y1)) return;
      poses.push(r);
      ctx.textBaseline = e.haut ? 'top' : 'bottom';
      ctx.lineWidth = 4;
      ctx.strokeStyle = 'rgba(5, 7, 20, 0.85)';
      ctx.strokeText(e.texte, e.X, e.Y);
      ctx.fillStyle = e.eteint ? eteint : texte;
      ctx.fillText(e.texte, e.X, e.Y);
      if (e.choisi) {
        const m = ctx.measureText(e.texte);
        ctx.fillRect(e.X - m.width / 2, e.Y + 2, m.width, 2);
      }
    });
    visibles.current = vus;
  }

  // ---------------- Souris, doigt, molette ----------------
  // Position du pointeur dans le repère du canvas. Le zoom de la page (CSS zoom 67 % sur ordinateur)
  // fausse offsetX : on recalcule à partir du rectangle réel affiché.
  const pos = (e) => {
    const el = toile.current;
    const r = el.getBoundingClientRect();
    const k = el.clientWidth / (r.width || 1);
    return { x: (e.clientX - r.left) * k, y: (e.clientY - r.top) * k };
  };
  const pointeurs = useRef(new Map());
  const geste = useRef(null);
  const toucher = (px, py) => {
    // L'espèce ou le groupe le plus proche sous le doigt.
    let meilleur = null;
    visibles.current.forEach((v) => {
      const d = Math.hypot(v.X - px, v.Y - py);
      if (d <= v.R + 6 && (!meilleur || d < meilleur.d)) meilleur = { ...v, d };
    });
    return meilleur?.n || null;
  };
  const surBas = (e) => {
    toile.current.setPointerCapture(e.pointerId);
    const q = pos(e);
    pointeurs.current.set(e.pointerId, q);
    cancelAnimationFrame(anim.current);
    geste.current = { x: q.x, y: q.y, bouge: 0, ecart: null };
  };
  const surDeplacement = (e) => {
    const p = pointeurs.current.get(e.pointerId);
    if (!p) return;
    const { x: nx, y: ny } = pos(e);
    if (pointeurs.current.size === 2) {
      // Pincement : zoom autour du milieu des deux doigts.
      const [a, b] = [...pointeurs.current.values()];
      const avant = Math.hypot(a.x - b.x, a.y - b.y);
      p.x = nx;
      p.y = ny;
      const [a2, b2] = [...pointeurs.current.values()];
      const apres = Math.hypot(a2.x - b2.x, a2.y - b2.y);
      if (avant > 0) zoomer(apres / avant, (a2.x + b2.x) / 2, (a2.y + b2.y) / 2);
      geste.current.bouge += 10;
      return;
    }
    const c = cam.current;
    cam.current = { ...c, x: c.x - (nx - p.x) / c.s, y: c.y - (ny - p.y) / c.s };
    geste.current.bouge += Math.abs(nx - p.x) + Math.abs(ny - p.y);
    p.x = nx;
    p.y = ny;
    redessiner();
  };
  const surHaut = (e) => {
    pointeurs.current.delete(e.pointerId);
    const g = geste.current;
    if (g && g.bouge < 6 && pointeurs.current.size === 0) {
      const q = pos(e);
      const n = toucher(q.x, q.y);
      // Une espèce : on ouvre sa fiche et on cadre son groupe (on garde ses voisines à l'écran).
      if (n) choisir(n, { ouvrirFiche: n.type === 'espece' });
    }
  };
  useEffect(() => {
    const el = toile.current;
    const roue = (e) => {
      e.preventDefault();
      const q = pos(e);
      const d = e.deltaMode === 1 ? e.deltaY * 30 : e.deltaY; // molette « à crans » ou pavé tactile
      zoomer(Math.exp(-Math.max(-120, Math.min(120, d)) * 0.0025), q.x, q.y);
    };
    el.addEventListener('wheel', roue, { passive: false });
    return () => el.removeEventListener('wheel', roue);
  }, [zoomer]);

  // ---------------- Choisir un élément (depuis le canvas, la liste ou la recherche) ----------------
  const ouvrirChemin = (n) => {
    setOuverts((o) => {
      const s = new Set(o);
      cheminNoeud(n).forEach((x) => x.type === 'groupe' && x !== n && s.add(x.id));
      return s;
    });
  };
  const choisir = (n, { ouvrirFiche = false, voler = true } = {}) => {
    setSelection(n.id);
    setFocus(n.id);
    ouvrirChemin(n);
    if (n.type === 'groupe') setOuverts((o) => new Set(o).add(n.id));
    if (ouvrirFiche) setFiche(n.id);
    if (voler) cadrer(n);
    redessiner();
  };

  // Demandes extérieures : recherche (« baleine »), ou animal ouvert sur la frise.
  useEffect(() => {
    if (!cible) return;
    const n = cible.feuille ? noeudDeFeuille(cible.feuille) : NOEUD_PAR_ID[cible.groupe];
    if (n) choisir(n, { ouvrirFiche: n.type === 'espece' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cible]);
  useEffect(() => {
    if (!idFeuille) return;
    const n = noeudDeFeuille(idFeuille);
    if (n) choisir(n, { ouvrirFiche: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idFeuille]);

  // ---------------- La liste accessible ----------------
  const visiblesListe = useMemo(() => {
    const res = [];
    const rec = (n) => {
      res.push(n);
      if (n.type === 'groupe' && ouverts.has(n.id)) n.enfants.forEach(rec);
    };
    rec(RACINE);
    return res;
  }, [ouverts]);

  useEffect(() => {
    if (!clavier.current) return;
    document.getElementById(`az-${focus}`)?.focus();
  }, [focus, visiblesListe]);

  const surClavierListe = (e) => {
    const i = visiblesListe.findIndex((n) => n.id === focus);
    const n = visiblesListe[i];
    if (!n) return;
    const aller = (m) => {
      if (!m) return;
      clavier.current = true;
      setFocus(m.id);
      setSelection(m.id);
      cadrer(m);
      redessiner();
    };
    const basculer = (id, ouvrir) => setOuverts((o) => {
      const s = new Set(o);
      if (ouvrir) s.add(id);
      else s.delete(id);
      return s;
    });
    switch (e.key) {
      case 'ArrowDown': aller(visiblesListe[i + 1]); break;
      case 'ArrowUp': aller(visiblesListe[i - 1]); break;
      case 'Home': aller(visiblesListe[0]); break;
      case 'End': aller(visiblesListe[visiblesListe.length - 1]); break;
      case 'ArrowRight':
        if (n.type === 'groupe' && !ouverts.has(n.id)) basculer(n.id, true);
        else if (n.type === 'groupe') aller(n.enfants[0]);
        break;
      case 'ArrowLeft':
        if (n.type === 'groupe' && ouverts.has(n.id)) basculer(n.id, false);
        else aller(n.parentNoeud);
        break;
      case 'Enter':
      case ' ':
        if (n.type === 'espece') choisir(n, { ouvrirFiche: true });
        else {
          basculer(n.id, !ouverts.has(n.id));
          choisir(n);
        }
        break;
      default:
        return;
    }
    e.preventDefault();
  };

  // Touches + et − pour zoomer (hors champs de saisie).
  const surClavierBoite = (e) => {
    if (/INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
    if (e.key === '+' || e.key === '=') { zoomer(1.4); e.preventDefault(); }
    if (e.key === '-' || e.key === '_') { zoomer(1 / 1.4); e.preventDefault(); }
  };

  const ouverte = fiche ? NOEUD_PAR_ID[fiche] : null;
  const lien = ouverte ? lienFrise(ouverte) : null;

  return (
    <section className="az" ref={boite} data-etage="vie" aria-labelledby={idTitre} onKeyDown={surClavierBoite}>
      <div className="az__tete">
        <div>
          <p className="az__sur-titre">L’arbre du vivant</p>
          <h2 id={idTitre} className="az__titre">Zoomez dans l’arbre de la vie</h2>
          <p className="az__aide">
            Des grands groupes jusqu’à chaque espèce : zoomez à la molette, en pinçant ou avec + et −, faites glisser pour
            vous déplacer. <span className="az__eteint">† ambre</span> = espèce ou groupe disparu.
          </p>
        </div>
        <div className="az__commandes" role="group" aria-label="Zoom de l’arbre">
          <button type="button" onClick={() => zoomer(1 / 1.6)} aria-label="Dézoomer">−</button>
          <button type="button" onClick={() => { setSelection(null); cadrer(RACINE); }}>Tout l’arbre</button>
          <button type="button" onClick={() => zoomer(1.6)} aria-label="Zoomer">+</button>
        </div>
      </div>

      <div className="az__corps">
        <div className="az__scene">
          <canvas
            ref={toile}
            className="az__toile"
            aria-hidden="true"
            onPointerDown={surBas}
            onPointerMove={surDeplacement}
            onPointerUp={surHaut}
            onPointerCancel={surHaut}
          />
          {ouverte && (
            <div className="az__fiche" role="region" aria-labelledby="az-fiche-nom">
              <button type="button" className="az__fermer" onClick={() => setFiche(null)} aria-label="Fermer la fiche">×</button>
              <ImageWiki titre={ouverte.wiki} alt={ouverte.nom} taille="moyenne" />
              <h3 id="az-fiche-nom" className="az__fiche-nom">
                {ouverte.eteint && <span aria-hidden="true">† </span>}
                {ouverte.nom}
              </h3>
              <p className={`az__statut${ouverte.eteint ? ' az__statut--eteint' : ''}`}>{ouverte.eteint ? '† Disparu' : 'Vivant aujourd’hui'}</p>
              <p className="az__chemin">
                {(() => {
                  // Le chemin complet est long : on garde les 4 derniers groupes.
                  const ch = cheminNoeud(ouverte).slice(1, -1).map((x) => x.nom);
                  return (ch.length > 4 ? ['…', ...ch.slice(-4)] : ch).join(' › ');
                })()}
              </p>
              {ouverte.texte && <p className="az__texte">{ouverte.texte}</p>}
              {ouverte.debut && <p className="az__date">Apparition : il y a {texteAge(ouverte.debut)}</p>}
              <a className="az__frise" href={lien.href}>{lien.texte} →</a>
            </div>
          )}
        </div>

        <div className="az__liste-boite">
          <p className="az__liste-titre" id="az-liste-titre">Liste de l’arbre</p>
          <p className="az__liste-aide">Flèches pour parcourir, → pour ouvrir un groupe, Entrée pour la fiche.</p>
          <ul className="az__liste" role="tree" aria-labelledby="az-liste-titre" onKeyDown={surClavierListe}>
            {visiblesListe.map((n) => {
              const groupe = n.type === 'groupe';
              const ouvert = ouverts.has(n.id);
              return (
                <li
                  key={n.id}
                  id={`az-${n.id}`}
                  role="treeitem"
                  aria-level={n.profondeur + 1}
                  aria-expanded={groupe ? ouvert : undefined}
                  aria-selected={selection === n.id}
                  tabIndex={focus === n.id ? 0 : -1}
                  className={`az__item${groupe ? ' az__item--groupe' : ''}${n.eteint ? ' az__item--eteint' : ''}${selection === n.id ? ' az__item--choisi' : ''}`}
                  style={{ paddingLeft: 8 + Math.min(n.profondeur, 12) * 9 }}
                  onClick={() => {
                    clavier.current = false;
                    // Groupe : un 1er clic l'ouvre et y amène la caméra ; un clic sur le groupe déjà choisi le referme.
                    if (groupe && ouvert && selection === n.id) {
                      setOuverts((o) => { const s = new Set(o); s.delete(n.id); return s; });
                      return;
                    }
                    choisir(n, { ouvrirFiche: !groupe });
                  }}
                >
                  <span aria-hidden="true" className="az__chevron">{groupe ? (ouvert ? '▾' : '▸') : '•'}</span>
                  {n.eteint && <span aria-hidden="true">† </span>}
                  {n.nom}
                  {n.eteint && <span className="sr-only"> (disparu)</span>}
                  {groupe && <span className="az__nb"> · {n.nbEspeces}</span>}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <p className="az__credits">Images : Wikipédia et Wikimedia Commons (licences libres). Dates arrondies ; « ? » : place débattue.</p>
    </section>
  );
}
