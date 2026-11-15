import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Repere from './Repere.jsx';
import Frise from './Frise.jsx';
import Carte from './Carte.jsx';
import ChoixCategorie from './ChoixCategorie.jsx';
import { construireLigne, lirePosition } from '../lib/echelle.js';

const mouvementReduit = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function Etage({ etage, numero, total, suivant, parId, carteOuverte, onBasculer, onFermer, onRefermer, onRepere }) {
  const ligne = useMemo(() => construireLigne(etage, parId), [etage, parId]);
  const conteneur = useRef(null);
  const attente = useRef(0);
  const [etat, setEtat] = useState({ fraction: 0, position: lirePosition(ligne, 0) });

  const ouverte = carteOuverte && parId[carteOuverte]?.etage === etage.id ? parId[carteOuverte] : null;

  // Quand la ligne défile, on met à jour la loupe et la période affichée.
  const mesurer = useCallback(() => {
    cancelAnimationFrame(attente.current);
    attente.current = requestAnimationFrame(() => {
      const el = conteneur.current;
      if (!el) return;
      const max = Math.max(1, el.scrollWidth - el.clientWidth);
      const centre = el.scrollLeft + el.clientWidth / 2;
      setEtat({ fraction: el.scrollLeft / max, position: lirePosition(ligne, centre) });
    });
  }, [ligne]);

  useEffect(() => {
    mesurer();
    window.addEventListener('resize', mesurer);
    return () => window.removeEventListener('resize', mesurer);
  }, [mesurer]);

  // On prévient l'année cosmique (à droite) de l'époque regardée.
  const ansRegarde = ouverte ? ouverte.ans : etat.position.ans;
  useEffect(() => {
    onRepere(etage.id, ansRegarde);
  }, [etage.id, ansRegarde, onRepere]);

  // Le curseur de la loupe fait défiler la ligne.
  const glisser = (fraction) => {
    const el = conteneur.current;
    if (!el) return;
    el.scrollLeft = fraction * (el.scrollWidth - el.clientWidth);
  };

  // Le menu déroulant emmène directement à la période choisie.
  const allerA = (idCategorie) => {
    const t = ligne.troncons.find((x) => x.categorie.id === idCategorie);
    const el = conteneur.current;
    if (!t || !el) return;
    onRefermer();
    el.scrollTo({ left: Math.max(0, t.x - 24), behavior: mouvementReduit() ? 'auto' : 'smooth' });
  };

  return (
    <section
      id={etage.id}
      className={ouverte ? 'etage etage--carte' : 'etage'}
      data-etage={etage.id}
      data-section={etage.id}
      aria-labelledby={`titre-${etage.id}`}
    >
      <div className="etage__principal">
        <div className="etage__tete">
          <div className="etage__intro">
            <p className="etage__numero">Étage {numero} sur {total}</p>
            <h2 id={`titre-${etage.id}`} className="etage__titre">{etage.nom}</h2>
            <p className="etage__sous-titre">{etage.sousTitre}</p>
          </div>
          <ChoixCategorie etage={etage} valeur={etat.position.troncon.categorie.id} onChanger={allerA} />
        </div>

        <Repere etage={etage} position={etat.position} fraction={etat.fraction} onGlisser={glisser} />

        <Frise
          ref={conteneur}
          etage={etage}
          ligne={ligne}
          carteOuverte={carteOuverte}
          onBasculer={onBasculer}
          onDefiler={mesurer}
        />

        <p className="etage__aide">
          Faites glisser la ligne ou le curseur. Touchez un point pour ouvrir sa carte.
        </p>

        {suivant ? (
          <a className="etage__suivant" href={`#${suivant.id}`} data-etage={suivant.id}>
            Étage suivant : <span className="etage__suivant-nom">{suivant.nom}</span>
            <span aria-hidden="true"> ↓</span>
          </a>
        ) : (
          <a className="etage__suivant" href="#titre-accueil">
            Fin du voyage. Revenir au début <span aria-hidden="true">↑</span>
          </a>
        )}
      </div>

      {ouverte && <Carte key={ouverte.id} carte={ouverte} etage={etage} onFermer={onFermer} />}
    </section>
  );
}
