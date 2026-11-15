import { forwardRef } from 'react';
import { MESURES, xPourAns } from '../lib/echelle.js';
import { idPeriode, idAnimal } from '../data/index.js';
import { BESTIAIRE } from '../data/bestiaire.js';
import { ERES, COULEUR_PERIODE } from '../data/eres.js';

// La ligne du temps d'un étage : plus large que l'écran, on la fait glisser de côté.
const TITRES = 96; // place au-dessus de la ligne pour le nom des périodes
const BESTIAIRE_H = 80; // place en plus pour les vignettes du bestiaire
const RANG_VIVANT = 15; // hauteur d'une ligne du bandeau du vivant
const TETE_VIVANT = 28; // titre du bandeau
const HAUT_ERES = 44; // bande des grandes ères (Paléozoïque, Mésozoïque…)

const Frise = forwardRef(function Frise({ etage, ligne, carteOuverte, onBasculer, onDefiler, groupes, rangsGroupes, classe }, ref) {
  const hautBandeau = groupes ? TETE_VIVANT + rangsGroupes * RANG_VIVANT + 16 : 0;
  const eres = blocsEres(ligne);
  const HAUT_TITRES = TITRES + (ligne.troncons.some((t) => BESTIAIRE[t.categorie.id]) ? BESTIAIRE_H : 0);
  const hautEres = eres.length ? HAUT_ERES : 0;
  const haut = hautBandeau + hautEres; // où commencent les tronçons
  // Sous la ligne : le rond, puis au plus deux rangs d'étiquettes.
  const hauteur = haut + HAUT_TITRES + 22 + (ligne.rangs - 1) * MESURES.rang + 122;
  let n = 0; // pour l'apparition en cascade des points

  return (
    <div className={`ligne ${classe || ''}`} ref={ref} onScroll={onDefiler}>
      <div className="ligne__piste" style={{ width: ligne.largeur, height: hauteur }}>
        {groupes && (
          <Bandeau groupes={groupes} ligne={ligne} hauteur={hautBandeau} />
        )}

        {eres.map((b) => (
          <div
            key={`${b.ere}-${b.x}`}
            className="ere"
            style={{ left: b.x, width: b.largeur, top: hautBandeau, '--ere': ERES[b.ere].couleur }}
          >
            <span className="ere__nom">
              {ERES[b.ere].nom}
              <span className="ere__detail"> · {ERES[b.ere].detail}</span>
            </span>
          </div>
        ))}

        {ligne.troncons.map((t, i) => {
          const idFiche = idPeriode(t.categorie.id);
          const ouverte = carteOuverte === idFiche;
          return (
            <div
              key={t.categorie.id}
              className={t.categorie.ere ? 'troncon troncon--ere' : 'troncon'}
              style={{
                left: t.x,
                width: t.largeur,
                top: haut,
                '--ere': t.categorie.ere ? ERES[t.categorie.ere].couleur : undefined,
                '--periode': COULEUR_PERIODE[t.categorie.id],
              }}
            >
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
                {t.categorie.groupe && !t.categorie.ere && <span className="troncon__groupe">{t.categorie.groupe}</span>}
                <span className="troncon__nom">
                  {COULEUR_PERIODE[t.categorie.id] && <span className="troncon__pastille" aria-hidden="true" />}
                  {t.categorie.nom}
                  <span className="troncon__info" aria-hidden="true">i</span>
                </span>
                <span className="troncon__echelle">
                  {t.sansEchelle ? 'récit, sans échelle de temps' : t.categorie.periode || 'à l’échelle'}
                </span>
              </button>
              <Bestiaire categorie={t.categorie} carteOuverte={carteOuverte} onBasculer={onBasculer} />
            </div>
          );
        })}

        <ol className="ligne__points" aria-label={`Événements de l'étage ${etage.nom}`} style={{ top: haut }}>
          {ligne.troncons.flatMap((t) =>
            t.points.map(({ carte, x, rang }) => {
              const ouverte = carte.id === carteOuverte;
              return (
                <li key={carte.id} className="ligne__item" style={{ left: x, top: HAUT_TITRES, '--i': Math.min(n++, 14) }}>
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

// Les animaux emblématiques de la période, en petites vignettes.
export function Bestiaire({ categorie, carteOuverte, onBasculer }) {
  const animaux = BESTIAIRE[categorie.id];
  if (!animaux) return null;
  return (
    <ul className="bestiaire" aria-label={`Animaux du ${categorie.nom}`}>
      {animaux.map((a) => {
        const id = idAnimal(a.id);
        const ouvert = carteOuverte === id;
        return (
          <li key={a.id}>
            <button
              type="button"
              id={`point-${id}`}
              className={ouvert ? 'animal animal--ouvert' : 'animal'}
              data-groupe={a.groupe}
              aria-expanded={ouvert}
              onClick={() => onBasculer(id)}
            >
              <span className="animal__pastille" aria-hidden="true" />
              {a.nom}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

// Les tronçons qui se suivent dans la même ère forment un seul bloc coloré.
function blocsEres(ligne) {
  const blocs = [];
  ligne.troncons.forEach((t) => {
    const ere = t.categorie.ere;
    if (!ere) return;
    const dernier = blocs[blocs.length - 1];
    if (dernier && dernier.ere === ere) dernier.largeur = t.x + t.largeur - dernier.x;
    else blocs.push({ ere, x: t.x, largeur: t.largeur });
  });
  return blocs;
}

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
