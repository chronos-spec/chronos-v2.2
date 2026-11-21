import { useEffect, useState } from 'react';
import { ecouterBadges } from '../lib/badges.js';

// ---------------------------------------------------------------------------
// La petite annonce « Badge débloqué ! », en bas de l'écran, 5 secondes.
// Elle ne bloque rien (on continue d'explorer) et elle est lue par les lecteurs d'écran.
// Si plusieurs badges tombent d'un coup, ils passent l'un après l'autre.
// ---------------------------------------------------------------------------
export default function AnnonceBadge() {
  const [file, setFile] = useState([]);
  const actuel = file[0];

  useEffect(() => ecouterBadges((b) => setFile((f) => [...f, b])), []);
  useEffect(() => {
    if (!actuel) return undefined;
    const t = setTimeout(() => setFile((f) => f.slice(1)), 5000);
    return () => clearTimeout(t);
  }, [actuel]);

  return (
    <div className="annonce-badge__zone" role="status" aria-live="polite">
      {actuel && (
        <div key={actuel.id} className="annonce-badge verre">
          <span className="annonce-badge__icone" aria-hidden="true">{actuel.icone}</span>
          <span>
            <span className="annonce-badge__titre">Badge débloqué !</span>
            <span className="annonce-badge__nom">{actuel.nom}</span>
          </span>
          <button type="button" className="annonce-badge__fermer" onClick={() => setFile((f) => f.slice(1))} aria-label="Fermer l’annonce">
            <span aria-hidden="true">×</span>
          </button>
        </div>
      )}
    </div>
  );
}
