import { useEffect, useState } from 'react';
import { BADGES, FAMILLES } from '../data/badges.js';
import { etatBadges, ecouterMaj, effacerBadges } from '../lib/badges.js';

// ---------------------------------------------------------------------------
// « Ma collection » (dans le panneau Jeu) : les 49 badges cachés.
// Gagnés : en couleur, avec leur nom. Pas encore : grisés, avec une devinette,
// et un bouton « Révéler » pour lire la consigne exacte.
// Un trophée par famille quand tous ses badges sont gagnés.
// ---------------------------------------------------------------------------
export default function Collection() {
  const [etat, setEtat] = useState(etatBadges);
  const [reveles, setReveles] = useState(() => new Set());
  useEffect(() => ecouterMaj(() => setEtat(etatBadges())), []);

  const gagnes = BADGES.filter((b) => etat.gagnes[b.id]).length;
  const reveler = (id) => setReveles((r) => new Set(r).add(id));

  return (
    <div className="collection">
      <p className="collection__resume">
        <strong>{gagnes} / {BADGES.length}</strong> badges trouvés. Ils sont cachés partout dans le site :
        explore, écoute, zoome, fouille l’arbre du vivant…
      </p>
      <div className="jeu__barre" aria-hidden="true"><span style={{ width: `${(gagnes / BADGES.length) * 100}%` }} /></div>

      {Object.entries(FAMILLES).map(([id, f]) => {
        const liste = BADGES.filter((b) => b.famille === id);
        const ok = liste.filter((b) => etat.gagnes[b.id]).length;
        const trophee = ok === liste.length;
        return (
          <section key={id} className="collection__famille" aria-labelledby={`fam-${id}`}>
            <h3 id={`fam-${id}`} className="collection__titre">
              <span aria-hidden="true">{f.icone}</span> {f.nom} <span className="collection__compte">{ok}/{liste.length}</span>
            </h3>
            {trophee && (
              <p className="collection__trophee">
                <span aria-hidden="true">🏆</span> Trophée : {f.trophee}
              </p>
            )}
            <ul className="collection__liste">
              {liste.map((b) => {
                const gagne = Boolean(etat.gagnes[b.id]);
                return (
                  <li key={b.id} className={`collection__badge${gagne ? ' collection__badge--gagne' : ''}`}>
                    <span className="collection__icone" aria-hidden="true">{gagne ? b.icone : '?'}</span>
                    <span className="collection__texte">
                      <span className="collection__nom">{gagne ? b.nom : 'Badge caché'}</span>
                      {gagne ? (
                        <span className="collection__detail">✓ {b.consigne}</span>
                      ) : reveles.has(b.id) ? (
                        <span className="collection__detail">{b.consigne}</span>
                      ) : (
                        <span className="collection__detail">
                          <em>{b.indice}</em>{' '}
                          <button type="button" className="jeu__lien" onClick={() => reveler(b.id)}>
                            Révéler<span className="sr-only"> la consigne</span>
                          </button>
                        </span>
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
      {gagnes > 0 && (
        <p className="jeu__aide">
          <button
            type="button"
            className="jeu__lien"
            onClick={() => { if (window.confirm('Effacer tous tes badges ?')) effacerBadges(); }}
          >
            Recommencer la collection à zéro
          </button>
        </p>
      )}
    </div>
  );
}
