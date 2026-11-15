import { useState } from 'react';
import Repere from './Repere.jsx';
import Frise from './Frise.jsx';
import Carte from './Carte.jsx';
import ChoixCategorie from './ChoixCategorie.jsx';

export default function Etage({ etage, numero, total, suivant, parId, carteOuverte, onBasculer, onFermer, onRefermer }) {
  const [categorieId, setCategorieId] = useState(etage.categories[0].id);
  const categorie = etage.categories.find((c) => c.id === categorieId);
  const cartes = categorie.evenements.map((id) => parId[id]);
  const ouverte = cartes.find((c) => c.id === carteOuverte) || null;
  const reference = ouverte || cartes[0];

  const changerCategorie = (id) => {
    setCategorieId(id);
    onRefermer(); // une chose à la fois : la carte ouverte se ferme
  };

  return (
    <section
      id={etage.id}
      className="etage"
      data-etage={etage.id}
      data-section={etage.id}
      aria-labelledby={`titre-${etage.id}`}
    >
      <div className="etage__principal">
        <div className="etage__intro">
          <p className="etage__numero">Étage {numero} sur {total}</p>
          <h2 id={`titre-${etage.id}`} className="etage__titre">{etage.nom}</h2>
          <p className="etage__sous-titre">{etage.sousTitre}</p>
        </div>

        {etage.categories.length > 1 && (
          <ChoixCategorie etage={etage} valeur={categorieId} onChanger={changerCategorie} />
        )}

        <Repere etage={etage} carte={reference} />

        <Frise
          etage={etage}
          categorie={categorie}
          cartes={cartes}
          carteOuverte={carteOuverte}
          onBasculer={onBasculer}
        />

        {suivant ? (
          <a className="etage__suivant" href={`#${suivant.id}`} data-etage={suivant.id}>
            Étage suivant : <span className="etage__suivant-nom">{suivant.nom}</span>
            <span aria-hidden="true"> ↓</span>
          </a>
        ) : (
          <a className="etage__suivant" href="#titre-accueil">
            Fin du voyage. Revenir au début <span aria-hidden="true">↑</span>
          </a>
        )}
      </div>

      <div className="etage__cote">
        {ouverte ? (
          <Carte key={ouverte.id} carte={ouverte} etage={etage} onFermer={onFermer} />
        ) : (
          <p className="etage__invitation">
            Choisissez un événement sur le fil pour ouvrir sa carte.
          </p>
        )}
      </div>
    </section>
  );
}
