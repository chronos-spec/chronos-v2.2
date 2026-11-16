import { useId } from 'react';
import { LIEUX } from '../data/histoireMonde.js';

// Choisir un ou plusieurs lieux (Histoire) : chacun a sa ligne, à la même échelle.
export default function ChoixLieux({ choisis, onChanger }) {
  const id = useId();
  const basculer = (lieu) => {
    const suivant = choisis.includes(lieu) ? choisis.filter((l) => l !== lieu) : [...choisis, lieu];
    if (suivant.length) onChanger(LIEUX.map((l) => l.id).filter((l) => suivant.includes(l)));
  };
  const resume = choisis.map((c) => LIEUX.find((l) => l.id === c)?.court).join(', ');
  return (
    <details className="lieux">
      <summary className="lieux__resume">
        <span className="lieux__libelle">Lieux : une ligne par lieu</span>
        <span className="lieux__choisis">{resume}</span>
      </summary>
      <fieldset className="lieux__liste">
        <legend className="sr-only">Lieux à afficher (un ou plusieurs)</legend>
        {LIEUX.map((l) => (
          <label key={l.id} className="lieux__choix" htmlFor={`${id}-${l.id}`} style={{ '--lieu': l.couleur }}>
            <input
              id={`${id}-${l.id}`}
              type="checkbox"
              checked={choisis.includes(l.id)}
              onChange={() => basculer(l.id)}
            />
            <span className="lieux__pastille" aria-hidden="true" />
            {l.nom}
          </label>
        ))}
        <div className="lieux__raccourcis">
          <button type="button" onClick={() => onChanger(LIEUX.map((l) => l.id))}>Tout le monde</button>
          <button type="button" onClick={() => onChanger(['europe'])}>Europe seulement</button>
        </div>
      </fieldset>
    </details>
  );
}
