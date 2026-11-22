import { useEffect, useMemo, useState } from 'react';
import { geoArea, geoEqualEarth, geoGraticule10, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import terresActuelles from 'world-atlas/land-110m.json';
import { EPOQUES, urlCotes } from '../data/epoquesCarte.js';

// ---------------------------------------------------------------------------
// PLANISPHÈRE (bêta) : la Terre à différentes époques.
// - Aujourd'hui : carte du monde intégrée au site (Natural Earth, domaine public).
// - Avant : les côtes reconstruites par le modèle de plaques Merdith et al. 2021,
//   demandées au service scientifique GPlates, puis gardées en mémoire du navigateur.
// Dessin en SVG (net à tous les zooms), projection « Equal Earth » (surfaces justes).
// Le curseur choisit l'époque ; flèches du clavier aussi. Une description texte
// accompagne toujours la carte (le dessin lui-même est décoratif pour les lecteurs d'écran).
// ---------------------------------------------------------------------------
const L = 960;
const H = 470;
const projection = geoEqualEarth().fitExtent([[8, 8], [L - 8, H - 8]], { type: 'Sphere' });
const chemin = geoPath(projection);
const SPHERE = chemin({ type: 'Sphere' });
const GRILLE = chemin(geoGraticule10());
const ACTUELLES = feature(terresActuelles, terresActuelles.objects.land);

// Les fichiers géographiques ne tracent pas tous leurs contours dans le même sens.
// Le dessin, lui, a besoin d'un sens précis : sinon il colorie la mer à la place des terres.
// On retourne donc tout contour qui « englobe » plus de la moitié du globe.
function remettreDansLeBonSens(g) {
  const corriger = (geom) => {
    if (!geom) return geom;
    if (geom.type === 'Polygon') {
      return geoArea(geom) > 2 * Math.PI ? { ...geom, coordinates: geom.coordinates.map((a) => [...a].reverse()) } : geom;
    }
    if (geom.type === 'MultiPolygon') {
      return {
        ...geom,
        coordinates: geom.coordinates.map((poly) => corriger({ type: 'Polygon', coordinates: poly }).coordinates),
      };
    }
    return geom;
  };
  if (g.type === 'FeatureCollection') return { ...g, features: g.features.map((f) => ({ ...f, geometry: corriger(f.geometry) })) };
  return g;
}

// Mémoire des cartes déjà téléchargées (pour cette visite, et entre les visites).
const cache = new Map();
const CLE = (ma) => `odysseum-carte-${ma}`;
async function chargerCotes(ma) {
  if (ma === 0) return ACTUELLES;
  if (cache.has(ma)) return cache.get(ma);
  try {
    const garde = localStorage.getItem(CLE(ma));
    if (garde) { const g = remettreDansLeBonSens(JSON.parse(garde)); cache.set(ma, g); return g; }
  } catch { /* stockage indisponible */ }
  const r = await fetch(urlCotes(ma));
  if (!r.ok) throw new Error(`Service GPlates : ${r.status}`);
  const g = remettreDansLeBonSens(await r.json());
  cache.set(ma, g);
  try { localStorage.setItem(CLE(ma), JSON.stringify(g)); } catch { /* trop gros : tant pis */ }
  return g;
}

export default function Planisphere() {
  const [i, setI] = useState(0);
  const [cotes, setCotes] = useState({ 0: ACTUELLES });
  const [etat, setEtat] = useState('pret'); // 'pret' | 'charge' | 'erreur'
  const epoque = EPOQUES[i];

  useEffect(() => {
    document.title = 'Planisphère · Odysseum';
  }, []);

  useEffect(() => {
    let vivant = true;
    if (cotes[epoque.ma]) { setEtat('pret'); return undefined; }
    setEtat('charge');
    chargerCotes(epoque.ma)
      .then((g) => { if (vivant) { setCotes((c) => ({ ...c, [epoque.ma]: g })); setEtat('pret'); } })
      .catch(() => vivant && setEtat('erreur'));
    // On prépare aussi l'époque suivante, pour que le curseur soit fluide.
    const suivante = EPOQUES[i + 1];
    if (suivante) chargerCotes(suivante.ma).then((g) => vivant && setCotes((c) => ({ ...c, [suivante.ma]: g }))).catch(() => {});
    return () => { vivant = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i]);

  const terres = useMemo(() => {
    const g = cotes[epoque.ma];
    return g ? chemin(g) : null;
  }, [cotes, epoque.ma]);

  return (
    <main id="contenu" className="planisphere" tabIndex={-1}>
      <header className="planisphere__tete">
        <p className="planisphere__beta">Bêta</p>
        <h1>Le planisphère qui remonte le temps</h1>
        <p className="planisphere__intro">
          Les continents bougent de quelques centimètres par an. En des millions d’années, cela redessine toute la Terre.
          Choisis une époque pour voir où étaient les terres et les océans.
        </p>
      </header>

      <figure className="planisphere__carte" aria-labelledby="planisphere-legende">
        <svg viewBox={`0 0 ${L} ${H}`} role="img" aria-label={`Carte du monde : ${epoque.nom}. ${epoque.texte}`}>
          <defs>
            <radialGradient id="pl-ocean" cx="50%" cy="45%" r="65%">
              <stop offset="0%" stopColor="var(--carte-ocean-clair)" />
              <stop offset="100%" stopColor="var(--carte-ocean)" />
            </radialGradient>
            <linearGradient id="pl-terre" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--carte-terre-claire)" />
              <stop offset="100%" stopColor="var(--carte-terre)" />
            </linearGradient>
            <filter id="pl-ombre" x="-5%" y="-5%" width="110%" height="110%">
              <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" style={{ floodColor: 'var(--ombre-profonde)' }} />
            </filter>
          </defs>
          <path d={SPHERE} fill="url(#pl-ocean)" />
          <path d={GRILLE} className="planisphere__grille" />
          {terres && (
            <path
              key={epoque.ma}
              d={terres}
              fill="url(#pl-terre)"
              className="planisphere__terres"
              filter="url(#pl-ombre)"
            />
          )}
          <path d={SPHERE} className="planisphere__bord" />
        </svg>
        {etat === 'charge' && <p className="planisphere__etat" role="status">Calcul de la carte de cette époque…</p>}
        {etat === 'erreur' && (
          <p className="planisphere__etat planisphere__etat--erreur" role="status">
            La carte de cette époque n’a pas pu être chargée (service scientifique indisponible). Réessaie dans un instant.
          </p>
        )}
        <figcaption id="planisphere-legende" className="planisphere__legende">
          <span className="planisphere__date">{epoque.nom}</span>
          <span className="planisphere__periode">{epoque.periode}</span>
          <span className="planisphere__texte">{epoque.texte}</span>
        </figcaption>
      </figure>

      <label className="planisphere__curseur">
        <span>Époque</span>
        <span aria-hidden="true">Aujourd’hui</span>
        <input
          type="range"
          min="0"
          max={EPOQUES.length - 1}
          step="1"
          value={i}
          onChange={(e) => setI(Number(e.target.value))}
          aria-valuetext={`${epoque.nom}, ${epoque.periode}`}
        />
        <span aria-hidden="true">1 milliard d’années</span>
      </label>
      <ol className="planisphere__reperes">
        {EPOQUES.map((e, k) => (
          <li key={e.ma}>
            <button type="button" aria-pressed={k === i} onClick={() => setI(k)}>
              {e.ma === 0 ? 'Auj.' : `${e.ma} Ma`}
            </button>
          </li>
        ))}
      </ol>

      <p className="planisphere__note">
        « Ma » veut dire « millions d’années ». Les côtes anciennes sont des reconstitutions scientifiques :
        elles sont assez sûres pour les 200 derniers millions d’années, et de plus en plus approximatives au-delà.
        Source : modèle de plaques tectoniques Merdith et al. (2021), service GPlates (EarthByte, université de Sydney) ;
        carte actuelle : Natural Earth.
      </p>
    </main>
  );
}
