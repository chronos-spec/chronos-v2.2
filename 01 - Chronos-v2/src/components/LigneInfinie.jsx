import { useEffect, useMemo, useRef, useState } from 'react';
import Carte from './Carte.jsx';
import { ETAGES } from '../data/index.js';
import { texteAge } from '../lib/ages.js';
import { lienPeriode } from '../lib/route.js';
import { demarrerMusique, pauseMusique, arreterMusique } from '../lib/musique.js';

// ---------------------------------------------------------------------------
// « TOUT VOIR » : une seule ligne, du Big Bang (à gauche) à aujourd'hui (à droite).
// L'échelle est PROPORTIONNELLE : la même distance représente toujours la même durée.
// En première vue, on voit donc la vraie place de chaque étage : l'Univers et la Vie
// occupent presque tout, l'histoire humaine n'est qu'un trait au bord droit.
// Pas d'événement en première vue : seulement les six étages, et quelques grandes périodes.
// En zoomant, les événements apparaissent par vagues : d'abord les fiches complètes,
// puis les événements principaux, puis les détails, puis les animaux.
// Les boutons « Aller à » zooment directement sur un étage (sinon il faudrait zoomer
// des millions de fois pour voir l'Histoire).
// ---------------------------------------------------------------------------

const AGE_UNIVERS = 13.8e9;
const xMonde = (ans) => 1 - Math.max(0, ans) / AGE_UNIVERS; // 0 = Big Bang, 1 = aujourd'hui
const ansDe = (xm) => (1 - xm) * AGE_UNIVERS;
const ZOOM_MAX = AGE_UNIVERS / 20; // au plus près : environ 20 ans à l'écran
const ZOOM_EVENEMENTS = 1.5; // en dessous : première vue, sans aucun événement

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

const H_RANGEE = 56;
const RANGEES_MAX = 3; // jamais plus de trois étiquettes l'une au-dessus de l'autre
const PLACE_PAR_ETIQUETTE = 200; // au plus une étiquette pour 200 px de largeur

// Un pas de graduation « rond » : 1, 2 ou 5 × une puissance de 10.
function pasRond(brut) {
  const p = 10 ** Math.floor(Math.log10(brut));
  const r = brut / p;
  return (r < 1.5 ? 1 : r < 3.5 ? 2 : r < 7.5 ? 5 : 10) * p;
}

const mouvementReduit = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export default function LigneInfinie({ parId, carteOuverte, onBasculer, onFermer }) {
  const boite = useRef(null);
  const [largeur, setLargeur] = useState(1200);
  const [zoom, setZoom] = useState(1); // 1 = tout voir
  const [centre, setCentre] = useState(0.5); // position du milieu de l'écran, de 0 à 1

  useEffect(() => {
    document.title = 'Tout voir · Chronos';
    const mesurer = () => setLargeur(boite.current?.clientWidth || 1200);
    mesurer();
    window.addEventListener('resize', mesurer);
    return () => window.removeEventListener('resize', mesurer);
  }, []);

  // Le centre ne peut pas sortir de la ligne.
  const borner = (c, z) => Math.min(1 - 0.5 / z, Math.max(0.5 / z, c));
  const bornerZoom = (z) => Math.min(ZOOM_MAX, Math.max(1, z));
  const changerZoom = (z, ancre = 0.5) => {
    const nz = bornerZoom(z);
    // On garde fixe le point sous la souris (ancre = sa place à l'écran, de 0 à 1).
    const xAncre = centre - 0.5 / zoom + ancre / zoom;
    setZoom(nz);
    setCentre(borner(xAncre + 0.5 / nz - ancre / nz, nz));
  };

  // Voyage animé vers une vue (zoom en échelle « ×10 » pour que le trajet paraisse régulier).
  const anim = useRef(0);
  const allerVers = (zCible, cCible) => {
    cancelAnimationFrame(anim.current);
    const z1 = bornerZoom(zCible);
    const c1 = borner(cCible, z1);
    if (mouvementReduit()) { setZoom(z1); setCentre(c1); return; }
    const z0 = zoom;
    const c0 = centre;
    const t0 = performance.now();
    const duree = 400;
    const pas = (t) => {
      const k = Math.min(1, (t - t0) / duree);
      const e = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2; // départ et arrivée en douceur
      const z = Math.exp(Math.log(z0) + (Math.log(z1) - Math.log(z0)) * e);
      setZoom(z);
      setCentre(borner(c0 + (c1 - c0) * e, z));
      if (k < 1) anim.current = requestAnimationFrame(pas);
    };
    anim.current = requestAnimationFrame(pas);
  };
  useEffect(() => () => cancelAnimationFrame(anim.current), []);

  // Zoomer pour qu'un étage remplisse l'écran (avec un peu de marge).
  const allerAEtage = (b) => {
    const x1 = xMonde(b.debut);
    const x2 = xMonde(b.fin);
    allerVers(1 / ((x2 - x1) * 1.08), (x1 + x2) / 2);
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

  // ---------- Le VOYAGE (bouton ▶) : la frise défile toute seule, sans s'arrêter ----------
  // Une « tête de lecture » avance d'événement en événement, du Big Bang à aujourd'hui.
  // Chaque passage d'un événement au suivant prend un temps presque constant : là où les événements
  // sont rares (des milliards d'années de vide), la tête de lecture file ; là où ils se pressent, elle ralentit.
  // Le zoom suit la densité : on cadre toujours les quelques événements autour de la tête de lecture,
  // donc on est très zoomé sur le Big Bang, on dézoome dans les grands vides, puis on rezoome sur l'Histoire.
  const etapes = useMemo(() => {
    // Tous les événements (sans les animaux), pour un défilé riche.
    const liste = evenements.filter((e) => e.rang <= 3 && e.ans > 0).sort((a, b) => b.ans - a.ans);
    const res = [];
    liste.forEach((e) => {
      if (!res.length || res[res.length - 1].ans !== e.ans) res.push(e);
    });
    return res;
  }, [evenements]);
  const programme = useMemo(() => {
    // On commence par 4 secondes sur le Big Bang, très zoomé.
    const ages = [AGE_UNIVERS, AGE_UNIVERS, ...etapes.map((e) => e.ans), 1];
    const temps = [0, 4];
    for (let i = 2; i < ages.length; i++) {
      const ecart = Math.min(4, Math.abs(Math.log(ages[i - 1] / ages[i])));
      temps.push(temps[i - 1] + 0.55 + 0.9 * ecart); // ~0,5 s par événement, plus le temps de traverser les grands vides
    }
    // Fenêtre visée à chaque étape : l'écart entre les 3 événements d'avant et les 4 d'après.
    const fenetres = ages.map((_, i) => {
      const avant = ages[Math.max(0, i - 3)];
      const apres = ages[Math.min(ages.length - 1, i + 4)];
      const densite = Math.max(40, (avant - apres) * 1.3);
      // Près du Big Bang, on reste zoomé : la fenêtre grandit avec la distance au début de l'univers.
      const depuisDebut = Math.max(3e8, (AGE_UNIVERS - ages[i]) * 2.5);
      return Math.min(AGE_UNIVERS, densite, depuisDebut);
    });
    return { ages, temps, fenetres, duree: temps[temps.length - 1] };
  }, [etapes]);

  const [voyage, setVoyage] = useState({ actif: false, vitesse: 1, t: 0 });
  const [musique, setMusique] = useState(true);
  const [evtVoyage, setEvtVoyage] = useState(null);
  const voyageRef = useRef(voyage);
  voyageRef.current = voyage;
  const logFenetre = useRef(Math.log(AGE_UNIVERS));
  const TETE = 0.42; // la tête de lecture est à 42 % de la largeur de l'écran

  useEffect(() => {
    if (!voyage.actif) return undefined;
    let id;
    let avant = performance.now();
    const { ages, temps, fenetres, duree } = programme;
    const image = (maintenant) => {
      const dt = Math.min(0.1, (maintenant - avant) / 1000);
      avant = maintenant;
      const v = voyageRef.current;
      const t = Math.min(duree, v.t + dt * v.vitesse);
      let i = 1;
      while (i < temps.length - 1 && temps[i] < t) i++;
      const k = (t - temps[i - 1]) / (temps[i] - temps[i - 1] || 1);
      // Âge sous la tête de lecture (interpolé en échelle « ×10 », donc régulier à l'œil).
      const ans = Math.exp(Math.log(ages[i - 1]) + (Math.log(ages[i]) - Math.log(ages[i - 1])) * k);
      // Fenêtre visée, puis lissée pour que le zoom respire doucement.
      const cible = Math.log(fenetres[i - 1] + (fenetres[i] - fenetres[i - 1]) * k);
      logFenetre.current += (cible - logFenetre.current) * (1 - Math.exp(-dt * v.vitesse * 1.6));
      const z = bornerZoom(AGE_UNIVERS / Math.exp(logFenetre.current));
      setZoom(z);
      setCentre(borner(xMonde(ans) + (0.5 - TETE) / z, z));
      const passe = etapes[Math.max(0, i - 2)];
      setEvtVoyage((e) => (e === passe ? e : passe));
      if (t >= duree) {
        setVoyage((x) => ({ ...x, actif: false, t: 0 }));
        arreterMusique();
        return;
      }
      voyageRef.current = { ...v, t };
      setVoyage((x) => ({ ...x, t }));
      id = requestAnimationFrame(image);
    };
    id = requestAnimationFrame(image);
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voyage.actif, programme]);

  // La musique suit le voyage (lecture, pause, arrêt, bouton musique).
  useEffect(() => {
    if (voyage.actif && musique) demarrerMusique();
    else pauseMusique();
  }, [voyage.actif, musique]);
  useEffect(() => () => arreterMusique(), []);

  const lancerVoyage = () => {
    if (!voyage.actif && voyage.t === 0) logFenetre.current = Math.log(programme.fenetres[0]);
    setVoyage((x) => ({ ...x, actif: !x.actif }));
  };
  const arreterVoyage = () => setVoyage((x) => ({ ...x, actif: false }));

  // Découverte progressive : on n'ajoute un niveau de détail que s'il y a la place pour tout ce niveau.
  const places = useMemo(() => {
    if (zoom < ZOOM_EVENEMENTS) return [];
    const visibles = evenements.filter((e) => {
      const x = versEcran(e.xm);
      return x >= -20 && x <= largeur + 20;
    });
    const budget = Math.max(3, Math.floor(largeur / PLACE_PAR_ETIQUETTE) * 2);
    let niveau = 0;
    for (let n = 1; n <= 4; n++) {
      const compte = visibles.filter((e) => e.rang <= n).length;
      if (compte > budget && niveau > 0) break;
      niveau = n;
    }
    const rangees = Array.from({ length: RANGEES_MAX }, () => []);
    const res = [];
    for (const e of visibles) {
      if (e.rang > niveau) continue;
      const x = versEcran(e.xm);
      const l = Math.min(260, e.titre.length * 8.2 + 28);
      const x1 = x - 12;
      const x2 = x1 + l;
      const r = rangees.findIndex((ra) => ra.every(([a, b]) => x2 + 16 < a || x1 > b + 16));
      if (r < 0) continue; // pas la place : il apparaîtra en zoomant encore
      rangees[r].push([x1, x2]);
      res.push({ e, x, r });
    }
    return res;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [evenements, zoom, centre, largeur]);

  // Les graduations : un pas « rond » adapté à ce que l'on voit (environ 5 à l'écran).
  const deAns = ansDe(Math.max(0, gauche));
  const aAns = ansDe(Math.min(1, gauche + 1 / zoom));
  const pas = pasRond((deAns - aAns) / 5);
  const graduations = [];
  for (let ans = Math.ceil(aAns / pas) * pas; ans <= deAns && graduations.length < 20; ans += pas) {
    const x = versEcran(xMonde(ans));
    graduations.push({ ans, x, nom: ans < 1 ? 'Aujourd’hui' : `−${texteAge(ans)}` });
  }

  // Glisser la ligne à la souris ou au doigt.
  const glisse = useRef(null);
  const debut = (ev) => {
    if (ev.target.closest('button, a')) return;
    cancelAnimationFrame(anim.current);
    arreterVoyage();
    glisse.current = { x: ev.clientX, c: centre };
    ev.currentTarget.setPointerCapture?.(ev.pointerId);
  };
  const bouger = (ev) => {
    if (!glisse.current) return;
    const dx = ev.clientX - glisse.current.x;
    setCentre(borner(glisse.current.c - dx / (largeur * zoom), zoom));
  };
  const fin = () => { glisse.current = null; };

  // Molette : zoomer autour de la souris (assez vite, car le voyage va jusqu'à ×700 millions).
  useEffect(() => {
    const el = boite.current;
    if (!el) return undefined;
    const roue = (ev) => {
      ev.preventDefault();
      cancelAnimationFrame(anim.current);
      arreterVoyage();
      const r = el.getBoundingClientRect();
      changerZoom(zoom * Math.exp(-ev.deltaY * 0.003), (ev.clientX - r.left) / r.width);
    };
    el.addEventListener('wheel', roue, { passive: false });
    return () => el.removeEventListener('wheel', roue);
  });

  // Ce que l'on regarde, en mots (pour tous, et pour les lecteurs d'écran).
  const resume = zoom <= 1.01
    ? 'Toute l’histoire, du Big Bang à aujourd’hui, à l’échelle'
    : `De il y a ${texteAge(deAns)} à ${aAns < 1 ? 'aujourd’hui' : `il y a ${texteAge(aAns)}`}`;
  const indice = zoom < ZOOM_EVENEMENTS
    ? 'Zoomez sur une période, ou choisissez un étage, pour faire apparaître les événements.'
    : places.length === 0 ? 'Aucun événement ici : déplacez-vous ou zoomez ailleurs.' : null;

  const ouverte = carteOuverte ? parId[carteOuverte] : null;
  const etageCarte = ouverte ? ETAGES.find((x) => x.id === ouverte.etage) : null;
  const zoomLog = Math.log(zoom) / Math.log(ZOOM_MAX); // 0 … 1 pour le curseur
  const etageDe = (id) => ETAGES.find((e) => e.id === id);

  return (
    <div className="infinie">
      <div className="infinie__tete">
        <div>
          <h1 className="infinie__titre">Tout voir</h1>
          <p className="infinie__resume" aria-live="polite">{resume}</p>
        </div>
        <a className="verre bouton-secondaire infinie__lien" href="#/ensemble/vie">La vie en tableau</a>
      </div>

      <div className="infinie__voyage" role="group" aria-label="Voyage le long de la frise">
        <button
          type="button"
          className="infinie__play"
          onClick={lancerVoyage}
        >
          {voyage.actif ? '⏸ Pause' : voyage.t > 0 ? '▶ Reprendre le voyage' : '▶ Voyage du Big Bang à aujourd’hui'}
        </button>
        {voyage.t > 0 && (
          <button type="button" className="infinie__arret" onClick={() => { setVoyage((x) => ({ ...x, actif: false, t: 0 })); setEvtVoyage(null); arreterMusique(); allerVers(1, 0.5); }}>
            ⏹ Arrêter
          </button>
        )}
        <label className="infinie__vitesse">
          Vitesse
          <select value={voyage.vitesse} onChange={(e) => setVoyage((x) => ({ ...x, vitesse: Number(e.target.value) }))}>
            <option value={0.5}>Lente (×0,5)</option>
            <option value={1}>Normale</option>
            <option value={2}>Rapide (×2)</option>
            <option value={4}>Très rapide (×4)</option>
          </select>
        </label>
        <button type="button" className="infinie__arret" aria-pressed={musique} onClick={() => setMusique((m) => !m)}>
          {musique ? '🎵 Musique' : '🔇 Sans musique'}
        </button>
        <span className="infinie__duree" aria-hidden="true">
          {(() => {
            const r = Math.ceil((programme.duree - voyage.t) / voyage.vitesse);
            return `${voyage.t > 0 ? 'reste' : 'durée'} ${Math.floor(r / 60)} min ${String(r % 60).padStart(2, '0')} s`;
          })()}
        </span>
        {evtVoyage && (
          <p className="infinie__en-cours" aria-live="polite">
            <span className="infinie__en-cours-date">{evtVoyage.dateCourte}</span> {evtVoyage.titre}
          </p>
        )}
        <div className="infinie__avance" aria-hidden="true"><span style={{ width: `${(voyage.t / programme.duree) * 100}%` }} /></div>
      </div>

      <nav className="infinie__sauts" aria-label="Aller directement à un étage">
        <button type="button" className="verre infinie__saut" onClick={() => allerVers(1, 0.5)}>Tout voir</button>
        {BANDES.map((b) => (
          <button key={b.id} type="button" className="verre infinie__saut" data-etage={b.id} onClick={() => { arreterVoyage(); allerAEtage(b); }}>
            {etageDe(b.id).nom}
          </button>
        ))}
      </nav>

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
          // Un étage trop fin pour être vu garde au moins 3 px : on sait qu'il est là.
          const g = Math.max(0, Math.min(x1, largeur - 3));
          const w = Math.max(3, Math.min(largeur, x2) - g);
          return (
            <div key={b.id} className="infinie__bande" data-etage={b.id} style={{ left: g, width: w }} aria-hidden="true">
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
              if (w < 140 || x2 < 0 || x1 > largeur) return null; // une période n'apparaît que si son nom tient
              const g = Math.max(0, x1);
              return (
                // Un clic sur une période ouvre sa page, dans l'étage correspondant.
                <a key={`${et.id}-${c.id}`} href={lienPeriode(et.id, c.id)} className="infinie__periode" data-etage={et.id} style={{ left: g, width: Math.min(largeur, x2) - g }} title={`Ouvrir la page : ${c.nom}`}>
                  <span>{c.nom}</span>
                </a>
              );
            })
        )}

        <div className="infinie__axe" aria-hidden="true" />
        {voyage.t > 0 && <div className="infinie__tete" style={{ left: `${TETE * 100}%` }} aria-hidden="true" />}

        {indice && <p className="infinie__indice">{indice}</p>}

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
              <button type="button" className={`infinie__btn${carteOuverte === e.id ? ' infinie__btn--ouvert' : ''}${evtVoyage?.id === e.id ? ' infinie__btn--voyage' : ''}`} onClick={() => onBasculer(e.id)}>
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
          L’échelle est réelle : la même distance représente toujours la même durée. Les boutons du haut
          vous emmènent directement à un étage.
        </p>
      </div>

      {ouverte && etageCarte && <Carte key={ouverte.id} carte={ouverte} etage={etageCarte} onFermer={onFermer} />}
    </div>
  );
}
