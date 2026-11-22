import Recherche from './Recherche.jsx';
import ZoomControles from './ZoomControles.jsx';
import Jeu from './Jeu.jsx';
import MenuMobile from './MenuMobile.jsx';
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
        <a className="entete__marque" href="#titre-accueil">Odysseum</a>
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
        {/* Voir toute la frise d'un coup, puis zoomer niveau par niveau. */}
        <a href="#/ensemble" className="entete__lien entete__lien--outil" aria-current={!accueil && window.location.hash === '#/ensemble' ? 'page' : undefined}>
          Tout voir
        </a>
        <a href="#/ensemble/vie" className="entete__lien entete__lien--outil" aria-current={!accueil && window.location.hash === '#/ensemble/vie' ? 'page' : undefined}>
          Vue d’ensemble
        </a>
        <a href="#/recit" className="entete__lien entete__lien--outil" aria-current={!accueil && window.location.hash === '#/recit' ? 'page' : undefined}>
          Récit
        </a>
        <a href="#/carte" className="entete__lien entete__lien--outil" aria-current={!accueil && window.location.hash === '#/carte' ? 'page' : undefined}>
          Planisphère <span className="entete__essai">bêta</span>
        </a>
        <a href="#/spirale" className="entete__lien entete__lien--spirale" aria-current={!accueil && window.location.hash === '#/spirale' ? 'page' : undefined}>
          Spirale <span className="entete__essai">essai</span>
        </a>
      </nav>

      <MenuMobile etages={etages} etageActif={etageActif} />
      <Jeu />

      <ZoomControles
        classe="entete__zoom"
        libelle="Zoom de la page"
        valeur={`${Math.round(zoom.zoom * 100)} %`}
        onMoins={zoom.moins}
        onPlus={zoom.plus}
        onRemettre={zoom.remettre}
        peutMoins={zoom.zoom > zoom.min}
        peutPlus={zoom.zoom < zoom.max}
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
