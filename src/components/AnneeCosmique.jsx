import { dateCosmique } from '../lib/calendrier.js';

const MOIS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
const MOIS_LONGS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
const AGE_UNIVERS = 13.8e9;

// L'année cosmique : une seule règle verticale, fixe sur le côté droit, pour tous les étages.
export default function AnneeCosmique({ ans }) {
  const connu = ans !== null && ans !== undefined;
  const fraction = connu ? Math.min(1, Math.max(0, 1 - ans / AGE_UNIVERS)) : 0;
  const date = connu ? dateCosmique(ans) : '1er janvier';

  return (
    <aside className="cosmique" aria-label={`Si l'univers tenait en un an, nous serions le ${date}`}>
      <p className="cosmique__titre" aria-hidden="true">1 an</p>
      <div className="cosmique__regle" aria-hidden="true">
        {MOIS.map((m, i) => (
          <span key={i} className="cosmique__mois" title={MOIS_LONGS[i]}>{m}</span>
        ))}
        <span className="cosmique__curseur" style={{ top: `calc(14px + (100% - 28px) * ${fraction})` }}>
          <span className="cosmique__bulle">{date}</span>
        </span>
      </div>
    </aside>
  );
}
