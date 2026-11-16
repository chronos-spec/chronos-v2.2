import Recherche from './Recherche.jsx';
import ZoomControles from './ZoomControles.jsx';
import { lienEtage } from '../lib/route.js';
import { useZoomPage } from '../lib/zoomPage.js';

export default function Entete({ etages, etageActif, index: indexRecherche, onAller, accueil }) {
  const zoom = useZoomPage();
  const index = etages.findIndex((e) => e.id === etageActif);
  const actuel = etages[index];

  return (
    <header className="entete">
      <div className="entete__gauche">
        <Recherche index={indexRecherche} onAller={onAller} />
        <a className="entete__marque" href="#titre-accueil">Chronos</a>
      </div>

      {/* Ordinateur : les 6 étages, pour sauter de l'un à l'autre */}
      <nav className="entete__nav" aria-label="Étages">
        {etages.map((e) => (
          <a
            key={e.id}
            href={lienEtage(e.id)}
            data-etage={e.id}
            className="entete__lien"
            aria-current={e.id === etageActif ? (accueil ? 'location' : 'page') : undefined}
          >
            {e.nom}
          </a>
        ))}
      </nav>

      <ZoomControles
        classe="entete__zoom"
        libelle="Zoom de la page"
        valeur={`${Math.round(zoom.zoom * 100)} %`}
        onMoins={zoom.moins}
        onPlus={zoom.plus}
        onRemettre={zoom.remettre}
        peutMoins={zoom.zoom > 0.5}
        peutPlus={zoom.zoom < 1.25}
      />

      {/* Téléphone : où suis-je ? */}
      {actuel && (
        <p className="entete__pastille" data-etage={actuel.id}>
          {index + 1}/{etages.length} · {actuel.nom}
        </p>
      )}
    </header>
  );
}
