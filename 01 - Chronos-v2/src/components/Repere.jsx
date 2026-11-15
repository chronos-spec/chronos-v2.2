import { dateCosmique, dateLoupe } from '../lib/calendrier.js';

const AGE_UNIVERS = 13.8e9;

// Petite règle de 12 mois avec un curseur lumineux (décorative).
function Regle({ fraction, variante }) {
  return (
    <span className={`regle regle--${variante}`} aria-hidden="true">
      <span className="regle__trait" />
      <span className="regle__mois" />
      {fraction !== null && <span className="regle__curseur" style={{ left: `${fraction * 100}%` }} />}
    </span>
  );
}

export default function Repere({ etage, carte }) {
  const sansDate = carte.ans === null || carte.ans === undefined;
  const loupe = etage.loupe;

  // Le récit biblique n'a pas de date historique : on le dit simplement.
  if (sansDate) {
    return (
      <div className="repere repere--sans-date" role="group" aria-label="Repère d'échelle">
        <div className="repere__bloc">
          <span className="repere__libelle">Récit biblique</span>
          <span className="repere__date">Pas de date historique</span>
        </div>
      </div>
    );
  }

  const cosmique = carte.cosmique || dateCosmique(carte.ans);

  return (
    <div className="repere" role="group" aria-label="Repère d'échelle">
      <div className="repere__bloc">
        <span className="repere__libelle">Si l'univers tenait en un an</span>
        <span className="repere__date">{cosmique}</span>
        <Regle fraction={1 - carte.ans / AGE_UNIVERS} variante="cosmique" />
      </div>

      {loupe && (
        <div className="repere__bloc repere__bloc--loupe">
          <span className="repere__libelle">Loupe · {loupe.libelle.charAt(0).toLowerCase() + loupe.libelle.slice(1)}</span>
          <span className="repere__date">{dateLoupe(carte.ans, loupe.depuisAns)}</span>
          <Regle fraction={Math.max(0, 1 - carte.ans / loupe.depuisAns)} variante="loupe" />
        </div>
      )}
    </div>
  );
}
