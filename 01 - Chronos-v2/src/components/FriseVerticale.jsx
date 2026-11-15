import { idPeriode } from '../data/index.js';
import { ERES, COULEUR_PERIODE } from '../data/eres.js';
import { Bestiaire } from './Frise.jsx';

// La ligne du temps du téléphone : le temps descend de haut en bas, on avance avec le pouce.
// Mêmes périodes, mêmes événements que la ligne horizontale ; un événement par ligne.
// Dans une période à l'échelle, l'espace entre deux événements suit (en partie) le temps écoulé.

const HAUTEUR_PAR_EVENEMENT = 110; // hauteur « idéale » d'une période, par événement (px)
const ECART_MIN = 6;
const ECART_MAX = 200;

export default function FriseVerticale({ etage, ligne, carteOuverte, onBasculer, groupes, classe }) {
  let ereAvant = null;
  let n = 0;

  return (
    <div className={`lignev ${classe || ''}`}>
      {ligne.troncons.map((t, i) => {
        const cat = t.categorie;
        const nouvelleEre = cat.ere && cat.ere !== ereAvant ? ERES[cat.ere] : null;
        ereAvant = cat.ere || null;
        const idFiche = idPeriode(cat.id);
        const ouverte = carteOuverte === idFiche;

        // Espaces entre les événements (à l'échelle dans la période, mais bornés).
        const points = [...t.points].sort((a, b) => (t.sansEchelle ? a.x - b.x : b.carte.ans - a.carte.ans));
        const hauteur = Math.max(360, points.length * HAUTEUR_PAR_EVENEMENT);
        const pxParAn = t.sansEchelle ? 0 : hauteur / ((t.debutAns - t.finAns) || 1);
        let precedent = t.debutAns;

        return (
          <div key={cat.id} className="lignev__bloc">
            {i > 0 && (
              <div className="lignev__saut" aria-hidden="true">
                <svg width="28" height="22" viewBox="0 0 40 32"><path d="M10 28 L18 4 M22 28 L30 4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /></svg>
                <span>l’échelle change</span>
              </div>
            )}

            {nouvelleEre && (
              <p className="lignev__ere" style={{ '--ere': nouvelleEre.couleur }}>
                {nouvelleEre.nom} <span className="ere__detail">· {nouvelleEre.detail}</span>
              </p>
            )}

            <div
              className={cat.ere ? 'lignev__troncon lignev__troncon--ere' : 'lignev__troncon'}
              data-troncon={i}
              id={`troncon-${etage.id}-${cat.id}`}
              style={{ '--ere': cat.ere ? ERES[cat.ere].couleur : undefined, '--periode': COULEUR_PERIODE[cat.id] }}
            >
              <button
                type="button"
                id={`point-${idFiche}`}
                className={ouverte ? 'troncon__titre troncon__titre--ouvert lignev__titre' : 'troncon__titre lignev__titre'}
                aria-expanded={ouverte}
                onClick={() => onBasculer(idFiche)}
              >
                {cat.groupe && !cat.ere && <span className="troncon__groupe">{cat.groupe}</span>}
                <span className="troncon__nom">
                  {COULEUR_PERIODE[cat.id] && <span className="troncon__pastille" aria-hidden="true" />}
                  {cat.nom}
                  <span className="troncon__info" aria-hidden="true">i</span>
                </span>
                <span className="troncon__echelle">
                  {t.sansEchelle ? 'récit, sans échelle de temps' : cat.periode || 'à l’échelle'}
                </span>
              </button>

              {groupes && <Vivants groupes={groupes} debut={t.debutAns} fin={t.finAns} />}
              <Bestiaire categorie={cat} carteOuverte={carteOuverte} onBasculer={onBasculer} />

              <ol className="lignev__points" aria-label={`Événements : ${cat.nom}`}>
                {points.map(({ carte }) => {
                  let ecart = ECART_MIN;
                  if (!t.sansEchelle) {
                    ecart = Math.min(ECART_MAX, Math.max(ECART_MIN, (precedent - carte.ans) * pxParAn));
                    precedent = carte.ans;
                  }
                  const ouvert = carte.id === carteOuverte;
                  return (
                    <li key={carte.id} className="lignev__item" style={{ marginTop: ecart, '--i': Math.min(n++, 14) }} data-ans={carte.ans ?? ''}>
                      <button
                        type="button"
                        id={`point-${carte.id}`}
                        className={ouvert ? 'pointv pointv--ouvert' : 'pointv'}
                        aria-expanded={ouvert}
                        aria-controls={ouvert ? `carte-${carte.id}` : undefined}
                        onClick={() => onBasculer(carte.id)}
                      >
                        <span className="pointv__disque" aria-hidden="true" />
                        <span className="pointv__textes">
                          <span className="pointv__titre">{carte.titre}</span>
                          <span className="pointv__date">{carte.dateCourte}</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Étage Vie : ce qui change pendant la période (groupes qui apparaissent ou disparaissent),
// puis, en une ligne discrète, ceux qui sont déjà là.
function Vivants({ groupes, debut, fin }) {
  if (debut === null) return null;
  const vivants = groupes.filter((g) => g.depuis > fin && g.jusqua < debut);
  const nouveaux = vivants.filter((g) => g.depuis <= debut);
  const derniers = vivants.filter((g) => g.jusqua > 0 && g.jusqua >= fin);
  const dejaLa = vivants.filter((g) => !nouveaux.includes(g) && !derniers.includes(g));
  if (!vivants.length) return null;
  return (
    <div className="vivants">
      {(nouveaux.length > 0 || derniers.length > 0) && (
        <ul className="vivants__liste" aria-label="Ce qui change pendant cette période">
          {nouveaux.map((g) => (
            <li key={g.id} className="vivants__groupe vivants__groupe--nouveau">
              {g.nom}<span className="vivants__mention"> · apparaissent</span>
            </li>
          ))}
          {derniers.map((g) => (
            <li key={g.id} className="vivants__groupe vivants__groupe--fin">
              {g.nom}<span className="vivants__mention vivants__mention--fin"> · disparaissent</span>
            </li>
          ))}
        </ul>
      )}
      {dejaLa.length > 0 && (
        <p className="vivants__deja">Déjà là : {dejaLa.map((g) => g.nom.replace(/ \(.*\)/, '').toLowerCase()).join(', ')}.</p>
      )}
    </div>
  );
}
