import { forwardRef } from 'react';
import { MESURES, xPourAns, rangerPoints } from '../lib/echelle.js';
import { idPeriode, idAnimal } from '../data/index.js';
import { BESTIAIRE } from '../data/bestiaire.js';
import { ERES, COULEUR_PERIODE } from '../data/eres.js';

// La ligne du temps d'un étage : plus large que l'écran, on la fait glisser de côté.
const TITRES = 96; // place au-dessus de la ligne pour le nom des périodes
const BESTIAIRE_H = 80; // place en plus pour les vignettes du bestiaire
const RANG_VIVANT = 15; // hauteur d'une ligne du bandeau du vivant
const TETE_VIVANT = 28; // titre du bandeau
const HAUT_ERES = 44; // bande des grandes ères (Paléozoïque, Mésozoïque…)

const ETIQ_VOIE = 38; // place du nom d'un lieu au-dessus de sa ligne

// voies : plusieurs lignes parallèles à la même échelle (Histoire : une par lieu).
// lienPeriode : si présent, le nom d'une période est un lien vers sa page.
const Frise = forwardRef(function Frise(
  { etage, ligne, carteOuverte, onBasculer, onDefiler, groupes, rangsGroupes, classe, voies, lienPeriode },
  ref
) {
  const hautBandeau = groupes ? TETE_VIVANT + rangsGroupes * RANG_VIVANT + 16 : 0;
  const eres = blocsEres(ligne);
  const HAUT_TITRES = TITRES + (ligne.troncons.some((t) => BESTIAIRE[t.categorie.id]) ? BESTIAIRE_H : 0);
  const hautEres = eres.length ? HAUT_ERES : 0;
  const haut = hautBandeau + hautEres; // où commencent les tronçons
  const tousLesPoints = ligne.troncons.flatMap((t) => t.points);

  // Les voies : une seule (la ligne normale) ou une par lieu, rangées l'une sous l'autre.
  const etiquette = voies ? ETIQ_VOIE : 0;
  let y = HAUT_TITRES;
  const lignes = (voies || [null]).map((v) => {
    const points = v ? tousLesPoints.filter((p) => v.filtre(p.carte)).map((p) => ({ ...p })) : tousLesPoints;
    const rangs = v ? rangerPoints(points) : ligne.rangs;
    const axe = y + etiquette;
    y = axe + 22 + (Math.max(1, rangs) - 1) * MESURES.rang + 122;
    return { voie: v, points, axe };
  });
  const hauteur = haut + y;
  const dejaVu = new Set(); // un même événement peut être dans plusieurs voies
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

        {lignes.map(({ voie, axe }) =>
          voie ? (
            <div key={`nom-${voie.id}`} className="voie" style={{ top: haut + axe - ETIQ_VOIE + 4, width: ligne.largeur, '--lieu': voie.couleur }}>
              <span className="voie__nom">{voie.nom}</span>
            </div>
          ) : null
        )}

        {ligne.troncons.map((t, i) => {
          const idFiche = idPeriode(t.categorie.id);
          const ouverte = carteOuverte === idFiche;
          const lien = lienPeriode ? lienPeriode(t.categorie.id) : null;
          const contenuTitre = (
            <>
              {t.categorie.groupe && !t.categorie.ere && <span className="troncon__groupe">{t.categorie.groupe}</span>}
              <span className="troncon__nom">
                {COULEUR_PERIODE[t.categorie.id] && <span className="troncon__pastille" aria-hidden="true" />}
                {t.categorie.nom}
                <span className="troncon__info" aria-hidden="true">{lien ? '→' : 'i'}</span>
              </span>
              <span className="troncon__echelle">
                {t.sansEchelle ? 'récit, sans échelle de temps' : t.categorie.periode || 'à l’échelle'}
              </span>
            </>
          );
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
              {lignes.map(({ voie, axe }) => (
                <div
                  key={voie ? voie.id : 'axe'}
                  className="troncon__axe"
                  aria-hidden="true"
                  style={{ top: axe, '--lieu': voie ? voie.couleur : undefined }}
                />
              ))}
              {i > 0 && (
                <svg className="troncon__saut" aria-hidden="true" width="40" height="32" viewBox="0 0 40 32" style={{ top: lignes[0].axe - 16 }}>
                  <path d="M10 28 L18 4 M22 28 L30 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              )}
              {lien ? (
                <a id={`point-${idFiche}`} className="troncon__titre troncon__titre--lien" href={lien}>
                  {contenuTitre}
                  <span className="sr-only"> : ouvrir la page de la période</span>
                </a>
              ) : (
                <button
                  type="button"
                  id={`point-${idFiche}`}
                  className={ouverte ? 'troncon__titre troncon__titre--ouvert' : 'troncon__titre'}
                  aria-expanded={ouverte}
                  onClick={() => onBasculer(idFiche)}
                >
                  {contenuTitre}
                </button>
              )}
              <Bestiaire categorie={t.categorie} carteOuverte={carteOuverte} onBasculer={onBasculer} />
            </div>
          );
        })}

        {lignes.map(({ voie, points, axe }) => (
          <ol
            key={voie ? voie.id : 'points'}
            className="ligne__points"
            aria-label={voie ? `Événements : ${voie.nom}` : `Événements de l'étage ${etage.nom}`}
            style={{ top: haut }}
          >
            {points.map(({ carte, x, rang }) => {
              const ouverte = carte.id === carteOuverte;
              const premier = !dejaVu.has(carte.id);
              dejaVu.add(carte.id);
              return (
                <li key={carte.id} className="ligne__item" style={{ left: x, top: axe, '--i': Math.min(n++, 14), '--lieu': voie ? voie.couleur : undefined }}>
                  <button
                    type="button"
                    id={premier ? `point-${carte.id}` : `point-${carte.id}--${voie.id}`}
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
            })}
          </ol>
        ))}
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
