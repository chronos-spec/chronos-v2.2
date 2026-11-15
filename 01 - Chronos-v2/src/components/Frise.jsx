import { forwardRef } from 'react';
import { MESURES } from '../lib/echelle.js';

// La ligne du temps d'un étage : plus large que l'écran, on la fait glisser de côté.
const HAUT = 96; // place au-dessus de la ligne pour le nom des périodes

const Frise = forwardRef(function Frise({ etage, ligne, carteOuverte, onBasculer, onDefiler }, ref) {
  const hauteur = HAUT + 48 + ligne.rangs * MESURES.rang;

  return (
    <div className="ligne" ref={ref} onScroll={onDefiler}>
      <div className="ligne__piste" style={{ width: ligne.largeur, height: hauteur }}>
        {ligne.troncons.map((t, i) => (
          <div key={t.categorie.id} className="troncon" style={{ left: t.x, width: t.largeur }}>
            <div className="troncon__axe" aria-hidden="true" style={{ top: HAUT }} />
            {i > 0 && (
              <svg className="troncon__saut" aria-hidden="true" width="40" height="32" viewBox="0 0 40 32" style={{ top: HAUT - 16 }}>
                <path d="M10 28 L18 4 M22 28 L30 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
            <div className="troncon__titre">
              <span className="troncon__nom">{t.categorie.nom}</span>
              <span className="troncon__echelle">
                {t.sansEchelle ? 'récit, sans échelle de temps' : t.categorie.periode || 'à l’échelle'}
              </span>
            </div>
          </div>
        ))}

        <ol className="ligne__points" aria-label={`Événements de l'étage ${etage.nom}`}>
          {ligne.troncons.flatMap((t) =>
            t.points.map(({ carte, x, rang }) => {
              const ouverte = carte.id === carteOuverte;
              return (
                <li key={carte.id} className="ligne__item" style={{ left: x, top: HAUT }}>
                  <button
                    type="button"
                    id={`point-${carte.id}`}
                    className={ouverte ? 'point point--ouvert' : 'point'}
                    aria-expanded={ouverte}
                    aria-controls={ouverte ? `carte-${carte.id}` : undefined}
                    onClick={() => onBasculer(carte.id)}
                  >
                    <span className="point__repere" aria-hidden="true">
                      {ouverte && (
                        <>
                          <span className="onde onde--1" />
                          <span className="onde onde--2" />
                          <span className="onde onde--3" />
                        </>
                      )}
                      <span className="point__disque" />
                    </span>
                    {rang > 0 && (
                      <span className="point__tige" aria-hidden="true" style={{ height: rang * MESURES.rang }} />
                    )}
                    <span className="point__textes">
                      <span className="point__titre">{carte.titre}</span>
                      <span className="point__date">{carte.dateCourte}</span>
                    </span>
                  </button>
                </li>
              );
            })
          )}
        </ol>
      </div>
    </div>
  );
});

export default Frise;
