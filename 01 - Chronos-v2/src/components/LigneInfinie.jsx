import { useEffect, useMemo, useRef, useState } from 'react';
import Carte from './Carte.jsx';
import { ETAGES } from '../data/index.js';
import { texteAge } from '../lib/ages.js';

// ---------------------------------------------------------------------------
// « TOUT VOIR » : une seule ligne, du Big Bang (à gauche) à aujourd'hui (à droite).
// L'échelle est logarithmique : chaque graduation vaut 10 fois plus de temps que la suivante.
// Sans cela, toute l'histoire humaine tiendrait dans un pixel.
// Deux curseurs : « Se déplacer » (où l'on regarde) et « Zoom » (de quelle distance).
// Plus on zoome, plus il y a de place : les événements apparaissent du plus important au plus détaillé.
// On peut aussi faire glisser la ligne, et zoomer à la molette.
// ---------------------------------------------------------------------------

const U_MAX = Math.log10(13.8e9 + 1);
const xMonde = (ans) => 1 - Math.log10(Math.max(0, ans) + 1) / U_MAX; // 0 = Big Bang, 1 = aujourd'hui
const ZOOM_MAX = 400;

const BANDES = [
  { id: 'univers', debut: 13.8e9, fin: 4.6e9 },
  { id: 'terre', debut: 4.6e9, fin: 4.0e9 },
  { id: 'vie', debut: 4.0e9, fin: 7e6 },
  { id: 'humains', debut: 7e6, fin: 5300 },
  { id: 'histoire', debut: 5300, fin: 81 },
  { id: 'aujourdhui', debut: 81, fin: 0 },
];

// Importance : 1 = fiches complètes, 2 = événements principaux, 3 = les autres, 4 = animaux.
const importance = (e) => (e.type === 'animal' ? 4 : e.texte ? 1 : e.principal ? 2 : 3);

const H_RANGEE = 48;

export default function LigneInfinie({ parId, carteOuverte, onBasculer, onFermer }) {
  const boite = useRef(null);
  const [largeur, setLargeur] = useState(1200);
  const [hauteur, setHauteur] = useState(600);
  // Autant de rangées d'étiquettes que la hauteur de l'écran le permet.
  const RANGEES = Math.max(3, Math.floor((hauteur - 190) / H_RANGEE));
  const [zoom, setZoom] = useState(1); // 1 = tout voir
  const [centre, setCentre] = useState(0.5); // position du milieu de l'écran, de 0 à 1

  useEffect(() => {
    document.title = 'Tout voir · Chronos';
    const mesurer = () => {
      setLargeur(boite.current?.clientWidth || 1200);
      setHauteur(boite.current?.clientHeight || 600);
    };
    mesurer();
    window.addEventListener('resize', mesurer);
    return () => window.removeEventListener('resize', mesurer);
  }, []);

  // Le centre ne peut pas sortir de la ligne.
  const borner = (c, z) => Math.min(1 - 0.5 / z, Math.max(0.5 / z, c));
  const changerZoom = (z, ancre = 0.5) => {
    const nz = Math.min(ZOOM_MAX, Math.max(1, z));
    // On garde fixe le point sous la souris (ancre = sa place à l'écran, de 0 à 1).
    const xAncre = centre - 0.5 / zoom + ancre / zoom;
    setZoom(nz);
    setCentre(borner(xAncre + 0.5 / nz - ancre / nz, nz));
  };

  const gauche = centre - 0.5 / zoom;
  const versEcran = (xm) => (xm - gauche) * zoom * largeur;

  const evenements = useMemo(
    () =>
      Object.values(parId)
        .filter((e) => e.type !== 'periode' && typeof e.ans === 'number' && e.ans >= 0 && e.titre)
        .map((e) => ({ ...e, xm: xMonde(e.ans), rang: importance(e) }))
        .sort((a, b) => a.rang - b.rang || b.ans - a.ans),
    [parId]
  );

  // Placement des étiquettes, du plus important au plus détaillé, sans chevauchement.
  const places = useMemo(() => {
    const rangees = Array.from({ length: RANGEES }, () => []);
    const res = [];
    for (const e of evenements) {
      const x = versEcran(e.xm);
      if (x < -50 || x > largeur + 50) continue;
      const l = Math.min(260, e.titre.length * 8.2 + 28);
      const x1 = x - 12;
      const x2 = x1 + l;
      const r = rangees.findIndex((ra) => ra.every(([a, b]) => x2 + 8 < a || x1 > b + 8));
      if (r < 0) continue;
      rangees[r].push([x1, x2]);
      res.push({ e, x, r });
      if (res.length > 200) break;
    }
    return res;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [evenements, zoom, centre, largeur, RANGEES]);

  // Les graduations : une par puissance de 10 (1 an, 10 ans, 100 ans…).
  const graduations = [];
  for (let n = 0; n <= 10; n++) {
    const ans = 10 ** n;
    graduations.push({ ans, x: versEcran(xMonde(ans)), nom: n < 6 ? `${ans.toLocaleString('fr-FR')} an${ans > 1 ? 's' : ''}` : texteAge(ans).replace('d’années', '') });
  }

  // Glisser la ligne à la souris ou au doigt.
  const glisse = useRef(null);
  const debut = (ev) => {
    if (ev.target.closest('button')) return;
    glisse.current = { x: ev.clientX, c: centre };
    ev.currentTarget.setPointerCapture?.(ev.pointerId);
  };
  const bouger = (ev) => {
    if (!glisse.current) return;
    const dx = ev.clientX - glisse.current.x;
    setCentre(borner(glisse.current.c - dx / (largeur * zoom), zoom));
  };
  const fin = () => { glisse.current = null; };

  // Molette : zoomer autour de la souris.
  useEffect(() => {
    const el = boite.current;
    if (!el) return undefined;
    const roue = (ev) => {
      ev.preventDefault();
      const r = el.getBoundingClientRect();
      changerZoom(zoom * Math.exp(-ev.deltaY * 0.0015), (ev.clientX - r.left) / r.width);
    };
    el.addEventListener('wheel', roue, { passive: false });
    return () => el.removeEventListener('wheel', roue);
  });

  // Ce que l'on regarde, en mots (pour tous, et pour les lecteurs d'écran).
  const ansDe = (xm) => 10 ** ((1 - xm) * U_MAX) - 1;
  const deAns = ansDe(Math.max(0, gauche));
  const aAns = ansDe(Math.min(1, gauche + 1 / zoom));
  const resume = zoom <= 1.01
    ? 'Toute l’histoire, du Big Bang à aujourd’hui'
    : `De il y a ${texteAge(deAns)} à ${aAns < 1 ? 'aujourd’hui' : `il y a ${texteAge(aAns)}`}`;

  const ouverte = carteOuverte ? parId[carteOuverte] : null;
  const etageCarte = ouverte ? ETAGES.find((x) => x.id === ouverte.etage) : null;
  const zoomLog = Math.log(zoom) / Math.log(ZOOM_MAX); // 0 … 1 pour le curseur

  return (
    <div className="infinie">
      <div className="infinie__tete">
        <div>
          <h1 className="infinie__titre">Tout voir</h1>
          <p className="infinie__resume" aria-live="polite">{resume}</p>
        </div>
        <a className="verre bouton-secondaire infinie__lien" href="#/ensemble/vie">La vie en tableau</a>
      </div>

      <div
        ref={boite}
        className="infinie__scene"
        onPointerDown={debut}
        onPointerMove={bouger}
        onPointerUp={fin}
        onPointerCancel={fin}
      >
        {/* Les six étages, en couleur, sous la ligne */}
        {BANDES.map((b) => {
          const x1 = versEcran(xMonde(b.debut));
          const x2 = versEcran(xMonde(b.fin));
          if (x2 < 0 || x1 > largeur) return null;
          const etage = ETAGES.find((e) => e.id === b.id);
          const g = Math.max(0, x1);
          const w = Math.min(largeur, x2) - g;
          return (
            <div key={b.id} className="infinie__bande" data-etage={b.id} style={{ left: g, width: w }}>
              {w > 70 && <span className="infinie__bande-nom">{etage.nom}</span>}
            </div>
          );
        })}

        {/* Les périodes de chaque étage, quand il y a la place */}
        {ETAGES.flatMap((et) =>
          et.categories
            .filter((c) => c.debut !== undefined && c.theme !== 'christianisme')
            .map((c) => {
              // On coupe la période aux bornes de son étage (sinon les étages se chevauchent).
              const b = BANDES.find((x) => x.id === et.id);
              const x1 = versEcran(xMonde(Math.min(c.debut, b.debut)));
              const x2 = versEcran(xMonde(Math.max(c.fin ?? 0, b.fin)));
              const w = x2 - x1;
              if (w < 90 || x2 < 0 || x1 > largeur) return null;
              const g = Math.max(0, x1);
              return (
                <div key={`${et.id}-${c.id}`} className="infinie__periode" data-etage={et.id} style={{ left: g, width: Math.min(largeur, x2) - g }}>
                  <span>{c.nom}</span>
                </div>
              );
            })
        )}

        <div className="infinie__axe" aria-hidden="true" />

        {graduations.map((g) =>
          g.x >= 0 && g.x <= largeur ? (
            <div key={g.ans} className="infinie__grad" style={{ left: g.x }} aria-hidden="true">
              <span>{g.nom}</span>
            </div>
          ) : null
        )}

        <ol className="infinie__evts" aria-label="Événements visibles">
          {places.map(({ e, x, r }) => (
            <li key={e.id} className="infinie__evt" data-etage={e.etage} style={{ left: x, bottom: `calc(var(--axe) + ${24 + r * H_RANGEE}px)`, '--h': `${24 + r * H_RANGEE}px` }}>
              <button type="button" className={carteOuverte === e.id ? 'infinie__btn infinie__btn--ouvert' : 'infinie__btn'} onClick={() => onBasculer(e.id)}>
                <span className="infinie__nom">{e.titre}</span>
                <span className="infinie__date">{e.dateCourte}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>

      <div className="infinie__curseurs">
        <label className="infinie__curseur">
          <span>Se déplacer</span>
          <span className="infinie__bornes" aria-hidden="true">Big Bang</span>
          <input
            type="range"
            min="0"
            max="1000"
            value={Math.round(centre * 1000)}
            disabled={zoom <= 1.01}
            onChange={(ev) => setCentre(borner(Number(ev.target.value) / 1000, zoom))}
            aria-valuetext={resume}
          />
          <span className="infinie__bornes" aria-hidden="true">Aujourd’hui</span>
        </label>
        <label className="infinie__curseur">
          <span>Zoom</span>
          <span className="infinie__bornes" aria-hidden="true">Tout</span>
          <input
            type="range"
            min="0"
            max="1000"
            value={Math.round(zoomLog * 1000)}
            onChange={(ev) => changerZoom(ZOOM_MAX ** (Number(ev.target.value) / 1000))}
            aria-valuetext={`zoom ×${Math.round(zoom)}`}
          />
          <span className="infinie__bornes" aria-hidden="true">Détails</span>
        </label>
        <p className="infinie__aide">
          Faites glisser la ligne, ou zoomez à la molette. Touchez un événement pour ouvrir sa fiche.
          Échelle « ×10 » : chaque graduation représente 10 fois plus de temps que la suivante.
        </p>
      </div>

      {ouverte && etageCarte && <Carte key={ouverte.id} carte={ouverte} etage={etageCarte} onFermer={onFermer} />}
    </div>
  );
}
