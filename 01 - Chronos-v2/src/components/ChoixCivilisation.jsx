import { useId, useState } from 'react';
import { CIVILISATIONS, CIVILISATION_PAR_ID, REGIONS } from '../data/civilisations.js';
import RecitCivilisation from './RecitCivilisation.jsx';

// Page Histoire : choisir une civilisation. La ligne n'affiche alors que ses événements,
// et le bouton ▶ lance un récit de 2 à 3 minutes sur son histoire.
export default function ChoixCivilisation({ choisie, onChanger }) {
  const id = useId();
  const [lecture, setLecture] = useState(false);
  const civ = choisie ? CIVILISATION_PAR_ID[choisie] : null;

  return (
    <div className="civ">
      <label className="civ__libelle" htmlFor={`${id}-civ`}>Civilisation</label>
      <select id={`${id}-civ`} className="civ__menu" value={choisie || ''} onChange={(e) => onChanger(e.target.value || null)}>
        <option value="">Toutes les civilisations</option>
        {REGIONS.map((r) => (
          <optgroup key={r.id} label={r.nom}>
            {CIVILISATIONS.filter((c) => c.region === r.id).map((c) => (
              <option key={c.id} value={c.id}>{c.nom}</option>
            ))}
          </optgroup>
        ))}
      </select>

      {civ && (
        <div className="civ__fiche" role="region" aria-label={`Civilisation : ${civ.nom}`}>
          <div className="civ__texte">
            <p className="civ__nom">{civ.nom}</p>
            <p className="civ__dates">{civ.dates}</p>
            <p className="civ__resume">{civ.resume}</p>
          </div>
          <div className="civ__boutons">
            <button type="button" className="civ__play" onClick={() => setLecture(true)}>
              <span aria-hidden="true">▶</span> Écouter son histoire
              <span className="civ__duree"> (~{Math.max(1, Math.round((civ.recit.length * 14) / 60))} min)</span>
            </button>
            <button type="button" className="civ__retour" onClick={() => onChanger(null)}>Toutes les civilisations</button>
          </div>
        </div>
      )}

      {lecture && civ && <RecitCivilisation civ={civ} onFermer={() => setLecture(false)} />}
    </div>
  );
}
