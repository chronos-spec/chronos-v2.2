import { useId, useMemo, useRef, useState } from 'react';
import { PAR_ID, ETAGES } from '../data/index.js';
import { BESTIAIRE } from '../data/bestiaire.js';
import { ESPECES } from '../data/especes.js';
import { LIEUX } from '../data/histoireMonde.js';
import { pendantCeTemps } from '../lib/pendantCeTemps.js';
import { lienEtage } from '../lib/route.js';
import { plageAges } from '../lib/ages.js';

const DONNEES = {
  parId: PAR_ID,
  bestiaire: BESTIAIRE,
  especes: ESPECES,
  nomsLieux: Object.fromEntries(LIEUX.map((l) => [l.id, l.court])),
  nomsEtages: Object.fromEntries(ETAGES.map((e) => [e.id, e.nom])),
};

// Le bouton « Pendant ce temps… » d'une carte, et sa petite liste (cachée au départ).
export default function PendantCeTemps({ carte }) {
  const liste = useMemo(() => pendantCeTemps(carte, DONNEES), [carte]);
  const [ouvert, setOuvert] = useState(false);
  const idListe = useId();
  const titreRef = useRef(null);

  if (liste.length === 0) return null; // pas de coïncidence justifiée : pas de bouton

  const basculer = () => {
    setOuvert((o) => !o);
    // En ouvrant, le focus va sur le titre de la liste (le lecteur d'écran l'annonce).
    if (!ouvert) requestAnimationFrame(() => titreRef.current?.focus());
  };

  // Ouvre la carte (ou la page) de l'élément choisi, comme le fait la loupe de recherche.
  const ouvrir = (ev, cle) => {
    ev.preventDefault();
    window.dispatchEvent(new CustomEvent('chronos-ouvrir', { detail: { cle } }));
  };

  return (
    <div className="pendant">
      <button type="button" className="pendant__bouton" aria-expanded={ouvert} aria-controls={idListe} onClick={basculer}>
        Pendant ce temps… <span aria-hidden="true">{ouvert ? '▴' : '▾'}</span>
      </button>
      <div id={idListe} hidden={!ouvert}>
        <p className="pendant__titre" tabIndex={-1} ref={titreRef}>Au même moment, ailleurs :</p>
        <ul className="pendant__liste">
          {liste.map((e) => {
            const etage = e.cle.startsWith('espece-') ? 'humains' : PAR_ID[e.cle]?.etage;
            const date = e.date || (e.debut ? plageAges(e.debut, e.fin) : '');
            return (
              <li key={e.cle}>
                <a className="pendant__lien" href={lienEtage(etage)} onClick={(ev) => ouvrir(ev, e.cle)}>
                  <span className="pendant__nom">{e.titre}</span>
                  <span className="pendant__infos">
                    {date && <span className="pendant__date">{date}</span>}
                    <span>{e.raison}</span>
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
        <p className="pendant__note">Dates arrondies : « au même moment » veut dire à quelques décennies près pour l’Histoire, à quelques millions d’années près pour la Vie.</p>
      </div>
    </div>
  );
}
