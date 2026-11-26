import { useEffect, useRef, useState } from 'react';
import { MONUMENTS_3D, ETATS_3D, modeleDisponible } from '../data/monuments3d.js';

// ---------------------------------------------------------------------------
// « Voir en 3D » : un bouton sur la carte d'un monument, qui ouvre une vue 3D dans la page.
// La vue utilise <model-viewer> (Google, licence Apache 2.0), chargé SEULEMENT au premier clic :
// les visiteurs qui n'ouvrent pas la 3D ne téléchargent rien de plus.
// Le bouton n'apparaît que si le fichier du modèle existe dans public/modeles/.
// ---------------------------------------------------------------------------

let chargement = null;
const chargerModelViewer = () => (chargement ||= import('@google/model-viewer'));

const PAS_ANGLE = 30; // degrés par appui sur « Tourner »

export default function Vue3D({ idCarte, titre }) {
  const monument = MONUMENTS_3D[idCarte];
  const [dispo, setDispo] = useState(false);
  const [ouvert, setOuvert] = useState(false);
  const [pret, setPret] = useState(false);
  const [erreur, setErreur] = useState(false);

  useEffect(() => {
    let actif = true;
    if (monument) modeleDisponible(idCarte).then((ok) => actif && setDispo(ok));
    return () => { actif = false; };
  }, [idCarte, monument]);

  if (!monument || !dispo) return null;

  const ouvrir = () => {
    setOuvert(true);
    chargerModelViewer().then(() => setPret(true)).catch(() => setErreur(true));
  };

  return (
    <div className="vue3d">
      <button type="button" className="vue3d__bouton" aria-expanded={ouvert} onClick={() => (ouvert ? setOuvert(false) : ouvrir())}>
        {ouvert ? 'Fermer la vue 3D' : 'Voir en 3D'}
      </button>
      {ouvert && (
        <div className="vue3d__panneau">
          {erreur ? (
            <p className="vue3d__etat" role="alert">La vue 3D n’a pas pu se charger. La description ci-dessous reste disponible.</p>
          ) : !pret ? (
            <p className="vue3d__etat" role="status">Chargement de la vue 3D…</p>
          ) : (
            <Visionneuse monument={monument} titre={titre} />
          )}
          <p className="vue3d__etiquette">{ETATS_3D[monument.etat] || monument.etat}</p>
          {/* L'alternative textuelle, lisible par tous (et pas seulement par les lecteurs d'écran). */}
          <p className="vue3d__description"><span className="sr-only">Description du modèle : </span>{monument.alt}</p>
          <p className="vue3d__credit">Modèle 3D : {monument.credit} · Licence : {monument.licence}</p>
        </div>
      )}
    </div>
  );
}

function Visionneuse({ monument, titre }) {
  const ref = useRef(null);
  const [annonce, setAnnonce] = useState('');

  // On pose les attributs à la main : React 18 gère mal les attributs booléens des éléments web.
  useEffect(() => {
    const mv = ref.current;
    if (!mv) return;
    mv.setAttribute('src', monument.modele);
    mv.setAttribute('alt', monument.alt);
    mv.setAttribute('camera-controls', ''); // souris, doigt et flèches du clavier
    mv.setAttribute('touch-action', 'pan-y'); // on peut toujours faire défiler la page au doigt
    mv.setAttribute('interaction-prompt', 'none');
    mv.setAttribute('loading', 'eager');
    // Rotation automatique seulement si l'appareil ne demande pas moins d'animations.
    const calme = window.matchMedia('(prefers-reduced-motion: reduce)');
    const regler = () => {
      if (calme.matches) mv.removeAttribute('auto-rotate');
      else mv.setAttribute('auto-rotate', '');
    };
    regler();
    calme.addEventListener('change', regler);
    return () => calme.removeEventListener('change', regler);
  }, [monument]);

  // Boutons de contrôle (en plus des flèches du clavier) : grandes zones, utilisables partout.
  const tourner = (degres) => {
    const mv = ref.current;
    if (!mv?.getCameraOrbit) return;
    const o = mv.getCameraOrbit();
    mv.removeAttribute('auto-rotate');
    mv.cameraOrbit = `${o.theta + (degres * Math.PI) / 180}rad ${o.phi}rad ${o.radius}m`;
    setAnnonce(degres < 0 ? 'Tourné vers la gauche' : 'Tourné vers la droite');
  };
  const zoomer = (facteur) => {
    const mv = ref.current;
    if (!mv?.getCameraOrbit) return;
    const o = mv.getCameraOrbit();
    mv.cameraOrbit = `${o.theta}rad ${o.phi}rad ${o.radius * facteur}m`;
    setAnnonce(facteur < 1 ? 'Rapproché' : 'Éloigné');
  };
  const recentrer = () => {
    const mv = ref.current;
    if (!mv) return;
    mv.cameraOrbit = 'auto auto auto';
    setAnnonce('Vue recentrée');
  };

  return (
    <>
      <p id="vue3d-aide" className="vue3d__aide">
        Fais glisser pour tourner, pince pour zoomer. Au clavier : place-toi sur la vue, puis utilise les flèches.
      </p>
      <model-viewer ref={ref} class="vue3d__scene" aria-describedby="vue3d-aide" title={`Vue 3D : ${titre}`} />
      <div className="vue3d__controles" role="group" aria-label="Contrôles de la vue 3D">
        <button type="button" onClick={() => tourner(-PAS_ANGLE)}>Tourner à gauche</button>
        <button type="button" onClick={() => tourner(PAS_ANGLE)}>Tourner à droite</button>
        <button type="button" onClick={() => zoomer(0.8)}>Rapprocher</button>
        <button type="button" onClick={() => zoomer(1.25)}>Éloigner</button>
        <button type="button" onClick={recentrer}>Recentrer</button>
      </div>
      <p className="sr-only" aria-live="polite">{annonce}</p>
    </>
  );
}
