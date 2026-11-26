import { useEffect, useRef } from 'react';
import { MONUMENTS_3D } from '../data/monuments3d.js';
import { PAR_ID } from '../data/index.js';

// ---------------------------------------------------------------------------
// PAGE HISTORIVISION (#/historivision)
// Présente le futur projet de Pierre : voir les monuments tels qu'ils étaient,
// sur place, avec son téléphone (réalité augmentée). Aucune date n'est promise.
// ---------------------------------------------------------------------------

export default function Historivision() {
  const titre = useRef(null);
  useEffect(() => {
    document.title = 'Historivision · Odysseum';
    window.scrollTo(0, 0);
    titre.current?.focus({ preventScroll: true });
  }, []);

  // Les monuments déjà prévus (ceux qui ont une carte dans la frise).
  const monuments = Object.keys(MONUMENTS_3D).filter((id) => PAR_ID[id]);

  return (
    <article className="legal historivision" aria-labelledby="titre-historivision">
      <h1 id="titre-historivision" ref={titre} tabIndex={-1}>Historivision</h1>
      <p className="historivision__accroche">Bientôt sur place, avec ton téléphone.</p>

      <h2>L’idée</h2>
      <p>
        Devant une pyramide, un temple ou un château, tu lèves ton téléphone.
        À l’écran, le monument apparaît tel qu’il était autrefois : ses couleurs, ses parties disparues,
        les gens qui l’entouraient.
      </p>
      <p>
        C’est ce qu’on appelle la <strong>réalité augmentée</strong> : l’image de la caméra,
        à laquelle on ajoute des éléments en 3D.
      </p>

      <h2>Où en est le projet ?</h2>
      <p>
        Historivision est un projet en préparation. Il n’a pas encore de date de sortie.
        En attendant, certaines cartes de la frise ont un bouton « Voir en 3D » pour faire
        tourner un monument directement dans la page.
      </p>

      <h2>Les monuments prévus</h2>
      <ul className="historivision__liste">
        {monuments.map((id) => <li key={id}>{PAR_ID[id].titre}</li>)}
      </ul>
      <p>
        Les reconstitutions seront toujours signalées comme telles : elles reposent sur ce que
        savent les historiens et les archéologues, et certains détails restent débattus.
      </p>

      <p className="legal__retour"><a href="#">Revenir à la frise</a></p>
    </article>
  );
}
