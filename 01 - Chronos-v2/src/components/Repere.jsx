import { dateLoupe } from '../lib/calendrier.js';
import { texteIlYA } from '../lib/echelle.js';

// La loupe de l'étage : un curseur qu'on fait glisser pour voyager dans l'étage.
// Il fait défiler la ligne ; et quand on fait défiler la ligne, il suit.
export default function Repere({ etage, position, fraction, onGlisser }) {
  const loupe = etage.loupe;
  const ilYA = texteIlYA(position.ans);
  const dateDansLoupe = loupe && position.ans !== null ? dateLoupe(position.ans, loupe.depuisAns) : null;
  const idCurseur = `loupe-${etage.id}`;

  // Le curseur est collé sous la ligne ; juste en dessous, l'année-loupe (« si … tenait en un an »).
  return (
    <div className="loupe">
      <label className="sr-only" htmlFor={idCurseur}>
        Voyager dans l'étage
      </label>
      <input
        id={idCurseur}
        className="loupe__curseur"
        type="range"
        min="0"
        max="1000"
        step="1"
        value={Math.round(fraction * 1000)}
        aria-valuetext={`${position.troncon.categorie.nom}, ${ilYA}`}
        onChange={(e) => onGlisser(Number(e.target.value) / 1000)}
      />
      <div className="loupe__textes">
        {dateDansLoupe && (
          <p className="loupe__annee">
            {loupe.libelle.charAt(0).toUpperCase() + loupe.libelle.slice(1)} : <strong>{dateDansLoupe}</strong>
          </p>
        )}
        <p className="loupe__position">
          <span className="loupe__periode">{position.troncon.categorie.nom}</span>
          <span className="loupe__separateur" aria-hidden="true"> · </span>
          <span className="loupe__date">{ilYA}</span>
        </p>
      </div>
    </div>
  );
}
