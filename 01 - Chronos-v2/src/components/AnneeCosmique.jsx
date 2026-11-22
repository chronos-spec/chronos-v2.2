import { useEffect, useRef, useState } from 'react';
import { dateCosmique } from '../lib/calendrier.js';

const MOIS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
const MOIS_LONGS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
const AGE_UNIVERS = 13.8e9;

function lireMasquee() {
  try {
    const garde = localStorage.getItem('chronos-annee-masquee');
    // Sur téléphone, on la range par défaut : elle cacherait le texte (un onglet « 1 an » la ramène).
    if (garde === null) return window.innerWidth < 700;
    return garde === '1';
  } catch {
    return false;
  }
}

// L'année cosmique : une règle verticale fixe sur le côté droit.
// On peut la masquer (elle glisse hors de l'écran) et faire glisser son point pour voyager dans le temps.
export default function AnneeCosmique({ ans, onGlisser }) {
  const connu = ans !== null && ans !== undefined;
  const [masquee, setMasquee] = useState(lireMasquee);
  const [glisse, setGlisse] = useState(null); // fraction pendant qu'on fait glisser le point
  const regle = useRef(null);
  const attente = useRef(0);
  const cote = useRef(null);
  useEffect(() => {
    if (cote.current) cote.current.inert = masquee; // masquée : ni clavier ni lecteur d'écran
  }, [masquee]);

  useEffect(() => {
    try {
      localStorage.setItem('chronos-annee-masquee', masquee ? '1' : '0');
    } catch {
      /* stockage indisponible */
    }
  }, [masquee]);

  const fractionDe = (a) => Math.min(1, Math.max(0, 1 - a / AGE_UNIVERS));
  const fraction = glisse ?? (connu ? fractionDe(ans) : 0);
  const ansAffiche = glisse !== null ? (1 - glisse) * AGE_UNIVERS : connu ? ans : AGE_UNIVERS;
  const date = dateCosmique(Math.max(1, ansAffiche));

  // Faire glisser le point : on voyage jusqu'à l'époque correspondante.
  const envoyer = (f) => {
    setGlisse(f);
    cancelAnimationFrame(attente.current);
    attente.current = requestAnimationFrame(() => onGlisser?.(Math.max(1, (1 - f) * AGE_UNIVERS)));
  };
  const fractionPointeur = (e) => {
    const r = regle.current.getBoundingClientRect();
    return Math.min(1, Math.max(0, (e.clientY - r.top - 14) / (r.height - 28)));
  };
  const appuyer = (e) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    envoyer(fractionPointeur(e));
  };
  const bouger = (e) => {
    if (glisse === null) return;
    envoyer(fractionPointeur(e));
  };
  const lacher = () => setGlisse(null);
  const touche = (e) => {
    const pas = e.shiftKey ? 1 / 12 : 1 / 96;
    let f = fraction;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') f += pas;
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') f -= pas;
    else if (e.key === 'Home') f = 0;
    else if (e.key === 'End') f = 1;
    else return;
    e.preventDefault();
    f = Math.min(1, Math.max(0, f));
    onGlisser?.(Math.max(1, (1 - f) * AGE_UNIVERS));
  };

  return (
    <>
      <aside
        className={masquee ? 'cosmique cosmique--masquee' : 'cosmique'}
        aria-label="L’année cosmique"
        ref={cote}
      >
        <button type="button" className="cosmique__masquer" onClick={() => setMasquee(true)} aria-label="Masquer l’année cosmique">
          <span aria-hidden="true">›</span>
        </button>
        <p className="cosmique__titre" aria-hidden="true">1 an</p>
        <div
          ref={regle}
          className="cosmique__regle"
          onPointerDown={appuyer}
          onPointerMove={bouger}
          onPointerUp={lacher}
          onPointerCancel={lacher}
        >
          {MOIS.map((m, i) => (
            <span key={i} className="cosmique__mois" title={MOIS_LONGS[i]} aria-hidden="true">{m}</span>
          ))}
          <span
            className={glisse !== null ? 'cosmique__curseur cosmique__curseur--glisse' : 'cosmique__curseur'}
            style={{ top: `calc(14px + (100% - 28px) * ${fraction})` }}
            role="slider"
            tabIndex={0}
            aria-orientation="vertical"
            aria-label="Voyager dans le temps (si l’univers tenait en un an)"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(fraction * 100)}
            aria-valuetext={date}
            onKeyDown={touche}
          >
            <span className="cosmique__bulle">{date}</span>
          </span>
        </div>
      </aside>
      {masquee && (
        <button type="button" className="cosmique__montrer" onClick={() => setMasquee(false)}>
          <span aria-hidden="true">‹ </span>1 an<span className="sr-only"> : afficher l’année cosmique</span>
        </button>
      )}
    </>
  );
}
