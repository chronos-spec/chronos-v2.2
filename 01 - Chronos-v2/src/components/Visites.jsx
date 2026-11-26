import { useEffect } from 'react';
import { VISITES, VISITE_PAR_ID } from '../data/visites.js';
import { WIKI_EVENEMENTS } from '../data/wiki.js';
import ImageWiki from './ImageWiki.jsx';
import VisiteTunnel from './VisiteTunnel.jsx';
import '../visites.css';

// Les visites guidées : environ 3 minutes, étape par étape, dans le « tunnel du temps » (VisiteTunnel.jsx).
//   #/visites          → la liste des visites
//   #/visites/oxygene  → la visite « D'où vient l'oxygène ? »
// La narration est lue par la voix du navigateur (speechSynthesis : gratuite, sur l'appareil,
// aucune connexion à un service extérieur). Les sous-titres sont toujours affichés.
// Sans voix française disponible, on avance soi-même avec « Suivant ».

// ---------- La liste des visites ----------
function ListeVisites() {
  useEffect(() => { document.title = 'Visites guidées · Odysseum'; }, []);
  return (
    <section className="visites" aria-labelledby="titre-visites">
      <h1 id="titre-visites" className="visites__titre">Visites guidées</h1>
      <p className="visites__intro">
        Laissez-vous raconter l’histoire en 3 minutes environ, étape par étape.
        Vous pouvez faire une pause, revenir en arrière ou quitter pour explorer librement.
      </p>
      <ul className="visites__liste">
        {VISITES.map((v) => (
          <li key={v.id} data-etage={v.etage} className="visites__choix">
            <div className="visites__mosaique" aria-hidden="true">
              {v.etapes.slice(0, 4).map((e) => (
                <ImageWiki key={e.fiche} titre={WIKI_EVENEMENTS[e.fiche]} alt="" taille="mini" />
              ))}
            </div>
            <h2 className="visites__nom">{v.titre}</h2>
            <p>{v.accroche}</p>
            <p className="visites__duree">{v.etapes.length} étapes · ~3 min · mini-défi à la fin{v.carte ? ' · carte du monde' : ''}</p>
            <a className="bouton-principal" href={`#/visites/${v.id}`}>
              Commencer<span className="sr-only"> la visite « {v.titre} »</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function Visites({ idVisite }) {
  const visite = idVisite ? VISITE_PAR_ID[idVisite] : null;
  if (idVisite && !visite) {
    return (
      <section className="visites">
        <h1 className="visites__titre">Visite introuvable</h1>
        <a className="bouton-principal" href="#/visites">Voir toutes les visites</a>
      </section>
    );
  }
  return visite ? <VisiteTunnel key={visite.id} visite={visite} /> : <ListeVisites />;
}
