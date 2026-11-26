import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { geoEqualEarth, geoPath, geoInterpolate } from 'd3-geo';
import { feature } from 'topojson-client';
import terresActuelles from 'world-atlas/land-110m.json';
import { PAR_ID, ETAGES } from '../data/index.js';
import { WIKI_EVENEMENTS } from '../data/wiki.js';
import { BESTIAIRE } from '../data/bestiaire.js';
import { ESPECES } from '../data/especes.js';
import { LIEUX } from '../data/histoireMonde.js';
import { pendantCeTemps } from '../lib/pendantCeTemps.js';
import { dateCosmique } from '../lib/calendrier.js';
import { texteAge } from '../lib/ages.js';
import { lienPeriode } from '../lib/route.js';
import { signaler } from '../lib/badges.js';
import { demarrerMusique, arreterMusique } from '../lib/musique.js';
import ImageWiki from './ImageWiki.jsx';
import '../visites-tunnel.css';

// ---------------------------------------------------------------------------
// LE TUNNEL DU TEMPS : la visite guidée en plein écran.
// - Le décor : un ciel étoilé qui file vers nous. Entre deux étapes, on « accélère »
//   d'autant plus que le saut dans le temps est grand (échelle logarithmique).
// - Chaque étape arrive du fond de l'écran (image + titre + date), l'ancienne nous dépasse.
// - En bas, la ligne du temps avance pour de vrai et le compteur d'années défile.
// - En plus : bulle « Pendant ce temps… », carte du monde (visite Sapiens), musique douce
//   (coupée au départ), et un mini-défi à la fin.
// Accessibilité : sous-titres toujours affichés, tout se commande au clavier, et le mode
// « Effets doux » (automatique si l'appareil demande moins d'animations) coupe le mouvement.
// Le décor (étoiles, carte, frise) est caché aux lecteurs d'écran : le texte dit tout.
// ---------------------------------------------------------------------------

const PAUSE_ENTRE_ETAPES = 1500;
const DUREE_SAUT = 1600; // durée (ms) du voyage d'une étape à l'autre
const NOMS_ETAGES = Object.fromEntries(ETAGES.map((e) => [e.id, e.nom]));
const DONNEES_PCT = {
  parId: PAR_ID,
  bestiaire: BESTIAIRE,
  especes: ESPECES,
  nomsLieux: Object.fromEntries(LIEUX.map((l) => [l.id, l.court])),
  nomsEtages: NOMS_ETAGES,
};
const log = (ans) => Math.log10(Math.max(ans, 1));

// L'appareil demande-t-il moins d'animations ?
function useMoinsDeMouvement() {
  const [moins, setMoins] = useState(() => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false);
  useEffect(() => {
    const m = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!m) return undefined;
    const suivre = () => setMoins(m.matches);
    m.addEventListener?.('change', suivre);
    return () => m.removeEventListener?.('change', suivre);
  }, []);
  return moins;
}

// Trouver une voix française sur l'appareil (la liste arrive parfois avec un peu de retard).
export function useVoixFrancaise() {
  const [voix, setVoix] = useState(null);
  const [pret, setPret] = useState(false);
  useEffect(() => {
    const synthese = window.speechSynthesis;
    if (!synthese) { setPret(true); return undefined; }
    const choisir = () => {
      const toutes = synthese.getVoices();
      const fr = toutes.filter((v) => v.lang?.toLowerCase().startsWith('fr'));
      setVoix(fr.find((v) => v.lang === 'fr-FR' && v.localService) || fr.find((v) => v.lang === 'fr-FR') || fr[0] || null);
      if (toutes.length) setPret(true);
    };
    choisir();
    synthese.addEventListener?.('voiceschanged', choisir);
    const delai = setTimeout(() => setPret(true), 1500);
    return () => { synthese.removeEventListener?.('voiceschanged', choisir); clearTimeout(delai); };
  }, []);
  return { voix, pret };
}

// ---------- Le ciel étoilé qui file (canvas décoratif) ----------
// `elan` : une référence vers la vitesse voulue (1 = croisière, jusqu'à ~25 pendant un saut).
function Etoiles({ elan, couleur, calme }) {
  const toile = useRef(null);
  useEffect(() => {
    const c = toile.current;
    const ctx = c.getContext('2d');
    let largeur = 0; let hauteur = 0; let raf = 0;
    const N = 420;
    const etoiles = Array.from({ length: N }, () => ({ x: Math.random() * 2 - 1, y: Math.random() * 2 - 1, z: Math.random() }));
    let vitesse = 1;
    const taille = () => {
      const r = window.devicePixelRatio || 1;
      largeur = c.clientWidth; hauteur = c.clientHeight;
      c.width = largeur * r; c.height = hauteur * r;
      ctx.setTransform(r, 0, 0, r, 0, 0);
    };
    taille();
    window.addEventListener('resize', taille);
    let avant = performance.now();
    const image = (t) => {
      const dt = Math.min(50, t - avant) / 1000; avant = t;
      const cible = calme ? 0 : elan.current;
      vitesse += (cible - vitesse) * Math.min(1, dt * 3); // on accélère et ralentit en douceur
      ctx.clearRect(0, 0, largeur, hauteur);
      const cx = largeur / 2; const cy = hauteur / 2; const echelle = Math.max(largeur, hauteur) * 0.6;
      ctx.lineCap = 'round';
      etoiles.forEach((s) => {
        const zAvant = s.z;
        s.z -= dt * 0.06 * vitesse;
        if (s.z <= 0.02) { s.x = Math.random() * 2 - 1; s.y = Math.random() * 2 - 1; s.z = 1; return; }
        const px = cx + (s.x / s.z) * echelle * 0.5; const py = cy + (s.y / s.z) * echelle * 0.5;
        const qx = cx + (s.x / zAvant) * echelle * 0.5; const qy = cy + (s.y / zAvant) * echelle * 0.5;
        const eclat = Math.min(1, (1 - s.z) * 1.4);
        ctx.strokeStyle = `rgba(${couleur}, ${0.25 + eclat * 0.75})`;
        ctx.lineWidth = Math.max(0.6, (1 - s.z) * 2.6);
        ctx.beginPath();
        ctx.moveTo(qx, qy);
        // Les traînées s'allongent avec la vitesse (effet « saut dans l'hyperespace »).
        ctx.lineTo(px + (px - qx) * Math.min(vitesse, 12) * 0.2, py + (py - qy) * Math.min(vitesse, 12) * 0.2);
        ctx.stroke();
      });
      raf = requestAnimationFrame(image);
    };
    raf = requestAnimationFrame(image);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', taille); };
  }, [elan, couleur, calme]);
  return <canvas ref={toile} className="tunnel__etoiles" aria-hidden="true" />;
}

// ---------- La ligne du temps qui avance + le compteur d'années ----------
function FriseQuiAvance({ etapes, n, calme }) {
  const ans = etapes.map((e) => PAR_ID[e.fiche]?.ans ?? 0);
  const plusVieux = Math.max(...ans); const plusRecent = Math.min(...ans);
  // Position sur la ligne : 0 = le plus ancien, 1 = le plus récent (échelle logarithmique).
  const position = (a) => (log(plusVieux) === log(plusRecent) ? 0.5 : (log(plusVieux) - log(a)) / (log(plusVieux) - log(plusRecent)));
  const [affiche, setAffiche] = useState(ans[n]);
  const depart = useRef(ans[n]);

  // Le compteur glisse d'une date à l'autre (sur une échelle logarithmique).
  useEffect(() => {
    const de = depart.current; const vers = ans[n];
    if (calme || de === vers) { setAffiche(vers); depart.current = vers; return undefined; }
    const debut = performance.now(); let raf = 0;
    const pas = (t) => {
      const k = Math.min(1, (t - debut) / DUREE_SAUT);
      const doux = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2;
      const l = log(de) + (log(vers) - log(de)) * doux;
      const valeur = 10 ** l;
      setAffiche(valeur); depart.current = valeur;
      if (k < 1) raf = requestAnimationFrame(pas);
    };
    raf = requestAnimationFrame(pas);
    return () => cancelAnimationFrame(raf);
  }, [n, calme]); // eslint-disable-line react-hooks/exhaustive-deps

  const arrondi = (a) => texteAge(a < 10 ? Math.round(a) : a >= 1e6 ? Number(a.toPrecision(3)) : Math.round(a / 100) * 100 || Math.round(a));
  const cosmique = dateCosmique(affiche);
  return (
    <div className="tunnel__frise" aria-hidden="true">
      <div className="tunnel__compteur">
        <span className="tunnel__compteur-ans">{affiche < 10 ? 'aujourd’hui' : `il y a ${arrondi(affiche)}`}</span>
        {cosmique && <span className="tunnel__compteur-cosmique">Année cosmique : {cosmique}</span>}
      </div>
      <div className="tunnel__axe">
        <span className="tunnel__axe-plein" style={{ width: `${position(affiche) * 100}%` }} />
        {etapes.map((e, i) => (
          <span
            key={i}
            className={`tunnel__repere${i === n ? ' tunnel__repere--actif' : i < n ? ' tunnel__repere--vu' : ''}`}
            data-etage={PAR_ID[e.fiche]?.etage}
            style={{ left: `${position(ans[i]) * 100}%` }}
          />
        ))}
        <span className="tunnel__curseur" style={{ left: `${position(affiche) * 100}%` }} />
      </div>
      <div className="tunnel__bornes">
        <span>{texteAge(plusVieux)}</span>
        <span>{plusRecent < 10 ? 'aujourd’hui' : texteAge(plusRecent)}</span>
      </div>
    </div>
  );
}

// ---------- La carte du monde : la route se trace étape après étape ----------
const LARG = 480; const HAUT = 250;
const PROJ = geoEqualEarth().fitExtent([[4, 4], [LARG - 4, HAUT - 4]], { type: 'Sphere' });
const CHEMIN = geoPath(PROJ);
const TERRES = CHEMIN(feature(terresActuelles, terresActuelles.objects.land));
const SPHERE = CHEMIN({ type: 'Sphere' });

function CarteRoute({ etapes, n, calme }) {
  // Les lieux et les trajets de chaque étape. Chaque déplacement a son propre point de départ
  // (on ne relie pas bêtement les étapes entre elles : l'Amérique n'est pas peuplée depuis l'Australie).
  const points = useMemo(() => etapes.flatMap((e, i) => (e.lieu ? [{ i, nom: e.lieu.nom, coord: [e.lieu.lon, e.lieu.lat] }] : [])), [etapes]);
  const troncons = useMemo(() => etapes.flatMap((e, i) => {
    if (!e.lieu?.trajet) return [];
    const suite = [...e.lieu.trajet, [e.lieu.lon, e.lieu.lat]];
    // Un seul tracé par déplacement, qui suit la courbe la plus courte sur le globe entre chaque point.
    const coords = suite.slice(1).flatMap((c, k) => {
      const interp = geoInterpolate(suite[k], c);
      return Array.from({ length: 16 }, (_, j) => interp(j / 15));
    });
    return [{ i, d: CHEMIN({ type: 'LineString', coordinates: coords }) }];
  }), [etapes]);
  const actuel = [...points].reverse().find((p) => p.i <= n);
  return (
    <figure className="tunnel__carte">
      <svg viewBox={`0 0 ${LARG} ${HAUT}`} aria-hidden="true">
        <path d={SPHERE} className="tunnel__carte-mer" />
        <path d={TERRES} className="tunnel__carte-terre" />
        {troncons.map((t, k) => (
          <path key={k} d={t.d} pathLength="1"
            className={`tunnel__carte-route${t.i <= n ? ' tunnel__carte-route--tracee' : ''}${calme ? ' tunnel__carte-route--calme' : ''}`} />
        ))}
        {points.filter((p) => p.i <= n).map((p, k) => {
          const [x, y] = PROJ(p.coord);
          const ici = actuel && p === actuel;
          return <circle key={k} cx={x} cy={y} r={ici ? 7 : 4} className={ici ? 'tunnel__carte-ici' : 'tunnel__carte-point'} />;
        })}
      </svg>
      <figcaption>{actuel ? `Lieu : ${actuel.nom}` : 'La route de Sapiens va se tracer ici.'}<span className="tunnel__carte-note"> (lieu indicatif)</span></figcaption>
    </figure>
  );
}

// ---------- La bulle « Pendant ce temps… » ----------
function Bulle({ fiche, delai }) {
  const [visible, setVisible] = useState(false);
  const element = useMemo(() => pendantCeTemps(fiche, DONNEES_PCT)[0] || null, [fiche]);
  useEffect(() => {
    setVisible(false);
    if (!element) return undefined;
    const t = setTimeout(() => setVisible(true), delai);
    return () => clearTimeout(t);
  }, [element, delai]);
  if (!element || !visible) return null;
  return (
    <aside className="tunnel__bulle" aria-label="Pendant ce temps">
      <p className="tunnel__bulle-titre"><span aria-hidden="true">✨ </span>Pendant ce temps…</p>
      <p className="tunnel__bulle-nom">{element.titre}</p>
      <p className="tunnel__bulle-info">{[element.date, element.raison].filter(Boolean).join(' · ')}</p>
    </aside>
  );
}

// ---------- Le mini-défi : remettre 3 étapes dans l'ordre ----------
function melanger(t) {
  const a = [...t];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
function tirerDefi(visite) {
  // 3 étapes aux dates bien distinctes, pour que l'ordre ne soit jamais discutable.
  for (let essai = 0; essai < 50; essai++) {
    const ids = melanger([...new Set(visite.etapes.map((e) => e.fiche))]).slice(0, 3);
    const a = ids.map((id) => PAR_ID[id].ans).sort((x, y) => y - x);
    if (a[0] > a[1] * 1.3 && a[1] > a[2] * 1.3) {
      const ordre = melanger(ids);
      if (ordre.join() !== [...ids].sort((x, y) => PAR_ID[y].ans - PAR_ID[x].ans).join()) return ordre;
    }
  }
  return melanger(visite.etapes.map((e) => e.fiche)).slice(0, 3);
}

function Defi({ visite, onRejouer }) {
  const [ids, setIds] = useState(() => tirerDefi(visite));
  const [corrige, setCorrige] = useState(false);
  const [annonce, setAnnonce] = useState('');
  const boutons = useRef({});
  const titre = useRef(null);
  useEffect(() => { titre.current?.focus(); }, []);
  const bon = [...ids].sort((a, b) => PAR_ID[b].ans - PAR_ID[a].ans);
  const reussi = ids.every((id, k) => id === bon[k]);

  const deplacer = (k, sens) => {
    const j = k + sens;
    if (j < 0 || j >= ids.length) return;
    const t = [...ids]; [t[k], t[j]] = [t[j], t[k]];
    setIds(t);
    setAnnonce(`« ${PAR_ID[t[j]].titre} » est maintenant en position ${j + 1}.`);
    requestAnimationFrame(() => boutons.current[`${t[j]}-${sens}`]?.focus());
  };
  const valider = () => {
    setCorrige(true);
    signaler('visite-defi', reussi ? `${visite.id}-reussi` : `${visite.id}-essai`);
  };

  return (
    <section className="tunnel__defi" aria-labelledby="titre-defi">
      <h2 id="titre-defi" ref={titre} tabIndex={-1} className="tunnel__defi-titre">Mini-défi : remets ces 3 étapes dans l’ordre</h2>
      <p className="tunnel__defi-consigne">Du plus ancien (en haut) au plus récent (en bas).</p>
      <ol className="tunnel__defi-liste">
        {ids.map((id, k) => {
          const f = PAR_ID[id];
          const place = bon.indexOf(id);
          return (
            <li key={id} className="tunnel__defi-carte" data-etage={f.etage}>
              <ImageWiki titre={WIKI_EVENEMENTS[id]} alt="" taille="mini" />
              <span className="tunnel__defi-nom">
                {f.titre}
                {corrige && (
                  <span className="tunnel__defi-verdict">
                    {place === k ? '✅ Bien placé' : `❌ Sa place : ${place + 1}`} · {f.dateCourte || f.date}
                  </span>
                )}
              </span>
              {!corrige && (
                <span className="tunnel__defi-fleches">
                  <button type="button" ref={(b) => { boutons.current[`${id}--1`] = b; }} onClick={() => deplacer(k, -1)} disabled={k === 0}
                    aria-label={`Monter « ${f.titre} »`}>↑</button>
                  <button type="button" ref={(b) => { boutons.current[`${id}-1`] = b; }} onClick={() => deplacer(k, 1)} disabled={k === ids.length - 1}
                    aria-label={`Descendre « ${f.titre} »`}>↓</button>
                </span>
              )}
            </li>
          );
        })}
      </ol>
      <p className="sr-only" aria-live="polite">{annonce}</p>
      {corrige ? (
        <div className="tunnel__defi-fin" role="status">
          <p className="tunnel__defi-resultat">{reussi ? '🏆 Bravo, tout est dans l’ordre !' : 'Presque ! Regarde les dates, puis réessaie.'}</p>
          <div className="tunnel__commandes">
            <button type="button" className="bouton-principal" onClick={() => { setIds(tirerDefi(visite)); setCorrige(false); setAnnonce(''); }}>Nouveau défi</button>
            <button type="button" className="verre bouton-secondaire" onClick={onRejouer}>Revoir la visite</button>
            <a className="verre bouton-secondaire" href="#/visites">Toutes les visites</a>
          </div>
        </div>
      ) : (
        <button type="button" className="bouton-principal" onClick={valider}>Valider mon ordre</button>
      )}
    </section>
  );
}

// ---------- Le lecteur en tunnel ----------
export default function VisiteTunnel({ visite }) {
  const { voix, pret } = useVoixFrancaise();
  const moinsDeMouvement = useMoinsDeMouvement();
  const [doux, setDoux] = useState(() => {
    try { return localStorage.getItem('odysseum-visite-doux') === 'oui'; } catch { return false; }
  });
  const calme = moinsDeMouvement || doux;
  const [n, setN] = useState(0);
  const [precedent, setPrecedent] = useState(null); // l'étape qui nous dépasse pendant le saut
  const [lecture, setLecture] = useState(false);
  const [defi, setDefi] = useState(false);
  const [son, setSon] = useState(false);
  const [pleinEcran, setPleinEcran] = useState(false);
  const enonce = useRef(null);
  const minuteur = useRef(null);
  const elan = useRef(1);
  const racine = useRef(null);
  const total = visite.etapes.length;
  const etape = visite.etapes[n];
  const fiche = PAR_ID[etape.fiche] || {};
  const derniere = n === total - 1;
  const etage = fiche.etage || visite.etage;

  useEffect(() => { document.title = `${visite.titre} · Visite guidée · Odysseum`; }, [visite.titre]);
  useEffect(() => { try { localStorage.setItem('odysseum-visite-doux', doux ? 'oui' : 'non'); } catch { /* */ } }, [doux]);

  // La couleur des étoiles suit l'étage (lue dans theme.css, jamais écrite ici).
  const [couleur, setCouleur] = useState('255, 255, 255');
  useEffect(() => {
    const v = racine.current && getComputedStyle(racine.current).getPropertyValue('--etage-rgb').trim();
    if (v) setCouleur(v);
  }, [etage]);

  const arreterVoix = useCallback(() => {
    clearTimeout(minuteur.current);
    window.speechSynthesis?.cancel();
  }, []);
  useEffect(() => () => { arreterVoix(); arreterMusique(); }, [arreterVoix]);

  // Changer d'étape : on « saute » dans le temps (plus le saut est grand, plus ça file).
  const nActuel = useRef(0);
  nActuel.current = n;
  const aller = useCallback((i) => {
    const ancien = nActuel.current;
    const suivant = Math.max(0, Math.min(total - 1, i));
    if (suivant === ancien) return;
    const a = PAR_ID[visite.etapes[ancien].fiche]?.ans ?? 1;
    const b = PAR_ID[visite.etapes[suivant].fiche]?.ans ?? 1;
    elan.current = 4 + Math.min(20, Math.abs(log(a) - log(b)) * 6);
    setTimeout(() => { elan.current = 1; }, DUREE_SAUT * 0.7);
    setPrecedent(ancien);
    setTimeout(() => setPrecedent(null), 900);
    setN(suivant);
  }, [total, visite.etapes]);

  // La voix lit l'étape, puis on passe à la suivante ; après la dernière, le mini-défi.
  useEffect(() => {
    if (!lecture || !voix || defi) return undefined;
    arreterVoix();
    const u = new SpeechSynthesisUtterance(etape.narration);
    u.voice = voix; u.lang = voix.lang; u.rate = 0.9;
    u.onend = () => {
      if (enonce.current !== u) return;
      if (derniere) { setLecture(false); minuteur.current = setTimeout(() => setDefi(true), PAUSE_ENTRE_ETAPES); return; }
      minuteur.current = setTimeout(() => aller(n + 1), PAUSE_ENTRE_ETAPES);
    };
    u.onerror = () => { if (enonce.current === u) setLecture(false); };
    enonce.current = u;
    // On laisse le temps au saut de se faire avant de parler.
    minuteur.current = setTimeout(() => window.speechSynthesis.speak(u), n === 0 ? 300 : 700);
    return () => { enonce.current = null; arreterVoix(); };
  }, [lecture, voix, n, etape.narration, derniere, aller, arreterVoix, defi]);

  // La musique : coupée au départ, on l'allume d'un clic (règle des navigateurs).
  const basculerSon = () => {
    if (son) arreterMusique(); else demarrerMusique();
    setSon(!son);
  };
  const basculerPleinEcran = () => {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else racine.current?.requestFullscreen?.().catch(() => {});
  };
  useEffect(() => {
    const suivre = () => setPleinEcran(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', suivre);
    return () => document.removeEventListener('fullscreenchange', suivre);
  }, []);

  // Clavier : ← → changent d'étape, Échap quitte (sauf si l'on est en plein écran : Échap en sort d'abord).
  useEffect(() => {
    const touche = (e) => {
      if (e.target.closest?.('input, textarea, select, [contenteditable]') || defi) return;
      if (e.key === 'ArrowRight') aller(n + 1);
      if (e.key === 'ArrowLeft') aller(n - 1);
      if (e.key === 'Escape' && !document.fullscreenElement) window.location.hash = '#/visites';
    };
    document.addEventListener('keydown', touche);
    return () => document.removeEventListener('keydown', touche);
  }, [aller, n, defi]);

  const rejouer = () => { setDefi(false); setPrecedent(null); setN(0); setLecture(!!voix); };
  const lienExplorer = fiche.etage && fiche.categorie ? lienPeriode(fiche.etage, fiche.categorie) : '#/visites';
  const fichePrec = precedent !== null ? PAR_ID[visite.etapes[precedent].fiche] : null;

  return (
    <section ref={racine} className={`tunnel${calme ? ' tunnel--calme' : ''}`} data-etage={etage} aria-labelledby="titre-visite">
      <div className="tunnel__fond" aria-hidden="true" />
      <Etoiles elan={elan} couleur={couleur} calme={calme} />

      <header className="tunnel__entete">
        <a className="tunnel__retour" href="#/visites">← Toutes les visites</a>
        <h1 id="titre-visite" className="tunnel__titre">{visite.titre}</h1>
        <div className="tunnel__reglages" role="group" aria-label="Réglages de la visite">
          <button type="button" className="tunnel__reglage" aria-pressed={son} onClick={basculerSon}>
            <span aria-hidden="true">{son ? '🔊' : '🔇'} </span>Musique
          </button>
          {!moinsDeMouvement && (
            <button type="button" className="tunnel__reglage" aria-pressed={doux} onClick={() => setDoux(!doux)}>
              <span aria-hidden="true">🌙 </span>Effets doux
            </button>
          )}
          {typeof document.documentElement.requestFullscreen === 'function' && (
            <button type="button" className="tunnel__reglage" aria-pressed={pleinEcran} onClick={basculerPleinEcran}>
              <span aria-hidden="true">⛶ </span>Plein écran
            </button>
          )}
        </div>
      </header>

      {defi ? (
        <Defi visite={visite} onRejouer={rejouer} />
      ) : (
        <>
          <div className="tunnel__scene">
            {/* L'étape qui nous dépasse (décor) */}
            {fichePrec && !calme && (
              <div key={`p-${precedent}`} className="tunnel__panneau tunnel__panneau--part" aria-hidden="true" data-etage={fichePrec.etage}>
                <ImageWiki titre={WIKI_EVENEMENTS[fichePrec.id]} alt="" taille="carte" />
              </div>
            )}
            {/* L'étape en cours, qui arrive du fond */}
            <article key={n} className="tunnel__panneau tunnel__panneau--arrive" data-etage={fiche.etage}>
              <ImageWiki titre={WIKI_EVENEMENTS[fiche.id]} alt={fiche.image?.description || fiche.titre} taille="carte" />
              <div className="tunnel__panneau-texte">
                <p className="tunnel__etiquettes">
                  <span className="tunnel__etage">{NOMS_ETAGES[fiche.etage]}</span>
                  <span className="tunnel__date">{fiche.dateCourte || fiche.date}</span>
                </p>
                <h2 className="tunnel__fiche" aria-live="polite">{fiche.titre}</h2>
              </div>
            </article>
            <Bulle fiche={fiche} delai={calme ? 400 : 2600} />
          </div>

          {/* Sous-titres : toujours affichés, que la voix lise ou non */}
          <p className="tunnel__sous-titre">{etape.narration}</p>

          {visite.carte && <CarteRoute etapes={visite.etapes} n={n} calme={calme} />}
          <FriseQuiAvance etapes={visite.etapes} n={n} calme={calme} />
          <p className="sr-only" aria-live="polite">Étape {n + 1} sur {total}, {fiche.dateCourte || fiche.date}.</p>

          {pret && !voix && (
            <p className="tunnel__info" role="status">
              Aucune voix française n’est disponible sur cet appareil : lisez les sous-titres et avancez avec « Suivant ».
            </p>
          )}

          <div className="tunnel__commandes">
            <button type="button" className="verre bouton-secondaire" onClick={() => aller(n - 1)} disabled={n === 0}>← Précédent</button>
            {voix && (
              <button type="button" className="bouton-principal" onClick={() => setLecture((l) => !l)} aria-pressed={lecture}>
                {lecture ? 'Pause' : 'Lecture'}
              </button>
            )}
            {derniere ? (
              <button type="button" className="verre bouton-secondaire" onClick={() => { setLecture(false); arreterVoix(); setDefi(true); }}>Mini-défi →</button>
            ) : (
              <button type="button" className="verre bouton-secondaire" onClick={() => aller(n + 1)}>Suivant →</button>
            )}
            <a className="verre bouton-secondaire" href={lienExplorer}>
              Quitter et explorer ici<span className="sr-only"> : {fiche.titre}</span>
            </a>
          </div>
          <p className="tunnel__aide">Clavier : ← → pour changer d’étape, Échap pour quitter.</p>
        </>
      )}
    </section>
  );
}
