import { forwardRef } from 'react';
import { MESURES, xPourAns } from '../lib/echelle.js';
import { idPeriode } from '../data/index.js';

// La ligne du temps d'un étage : plus large que l'écran, on la fait glisser de côté.
const HAUT_TITRES = 96; // place au-dessus de la ligne pour le nom des périodes
const RANG_VIVANT = 15; // hauteur d'une ligne du bandeau du vivant
const TETE_VIVANT = 28; // titre du bandeau

const Frise = forwardRef(function Frise({ etage, ligne, carteOuverte, onBasculer, onDefiler, groupes, rangsGroupes }, ref) {
  const hautBandeau = groupes ? TETE_VIVANT + rangsGroupes * RANG_VIVANT + 16 : 0;
  const HAUT = hautBandeau + HAUT_TITRES;
  const hauteur = HAUT + 48 + ligne.rangs * MESURES.rang;

  return (
    <div className="ligne" ref={ref} onScroll={onDefiler}>
      <div className="ligne__piste" style={{ width: ligne.largeur, height: hauteur }}>
        {groupes && (
          <Bandeau groupes={groupes} ligne={ligne} hauteur={hautBandeau} />
        )}

        {ligne.troncons.map((t, i) => {
          const idFiche = idPeriode(t.categorie.id);
          const ouverte = carteOuverte === idFiche;
          return (
            <div key={t.categorie.id} className="troncon" style={{ left: t.x, width: t.largeur, top: hautBandeau }}>
              <div className="troncon__axe" aria-hidden="true" style={{ top: HAUT_TITRES }} />
              {i > 0 && (
                <svg className="troncon__saut" aria-hidden="true" width="40" height="32" viewBox="0 0 40 32" style={{ top: HAUT_TITRES - 16 }}>
                  <path d="M10 28 L18 4 M22 28 L30 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              )}
              <button
                type="button"
                id={`point-${idFiche}`}
                className={ouverte ? 'troncon__titre troncon__titre--ouvert' : 'troncon__titre'}
                aria-expanded={ouverte}
                onClick={() => onBasculer(idFiche)}
              >
                {t.categorie.groupe && <span className="troncon__groupe">{t.categorie.groupe}</span>}
                <span className="troncon__nom">
                  {t.categorie.nom}
                  <span className="troncon__info" aria-hidden="true">i</span>
                </span>
                <span className="troncon__echelle">
                  {t.sansEchelle ? 'récit, sans échelle de temps' : t.categorie.periode || 'à l’échelle'}
                </span>
              </button>
            </div>
          );
        })}

        <ol className="ligne__points" aria-label={`Événements de l'étage ${etage.nom}`} style={{ top: hautBandeau }}>
          {ligne.troncons.flatMap((t) =>
            t.points.map(({ carte, x, rang }) => {
              const ouverte = carte.id === carteOuverte;
              return (
                <li key={carte.id} className="ligne__item" style={{ left: x, top: HAUT_TITRES }}>
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

// Le bandeau des grands groupes du vivant (étage Vie) : depuis quand chaque groupe existe.
function Bandeau({ groupes, ligne, hauteur }) {
  return (
    <div className="vivant" style={{ height: hauteur }}>
      <p className="vivant__titre" id="titre-vivant">Les grands groupes du vivant</p>
      <ul className="vivant__liste" aria-labelledby="titre-vivant">
        {groupes.map((g) => {
          const x1 = xPourAns(ligne, g.depuis);
          const x2 = g.jusqua ? xPourAns(ligne, g.jusqua) : ligne.largeur - 8;
          const eteint = g.jusqua > 0;
          return (
            <li
              key={g.id}
              className={eteint ? 'vivant__groupe vivant__groupe--eteint' : 'vivant__groupe'}
              style={{ left: x1, width: Math.max(24, x2 - x1), top: TETE_VIVANT + g.rang * RANG_VIVANT }}
            >
              <span className="vivant__barre" aria-hidden="true" />
              <span className="vivant__nom">
                {g.nom}
                <span className="sr-only">
                  {eteint ? `, de ${duree(g.depuis)} à ${duree(g.jusqua)} (disparus)` : `, depuis ${duree(g.depuis)}`}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function duree(ans) {
  if (ans >= 1e9) return `${(ans / 1e9).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} milliard${ans >= 2e9 ? 's' : ''} d’années`;
  return `${Math.round(ans / 1e6).toLocaleString('fr-FR')} millions d’années`;
}

export default Frise;
