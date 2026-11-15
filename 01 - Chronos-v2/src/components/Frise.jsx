export default function Frise({ etage, categorie, cartes, carteOuverte, onBasculer }) {
  return (
    <ol
      className="frise"
      aria-label={`Événements : ${etage.nom}, ${categorie.nom}`}
      style={{ '--nb': cartes.length }}
    >
      {cartes.map((carte) => {
        const ouverte = carte.id === carteOuverte;
        return (
          <li key={carte.id} className="frise__item">
            <button
              type="button"
              id={`point-${carte.id}`}
              className={ouverte ? 'point point--ouvert' : 'point'}
              aria-expanded={ouverte}
              aria-controls={ouverte ? `carte-${carte.id}` : undefined}
              onClick={() => onBasculer(carte.id)}
            >
              <span className="point__repere" aria-hidden="true">
                {ouverte && (
                  <>
                    <span className="onde onde--1" />
                    <span className="onde onde--2" />
                    <span className="onde onde--3" />
                    <span className="onde onde--4" />
                  </>
                )}
                <span className="point__disque" />
              </span>
              <span className="point__textes">
                <span className="point__titre">{carte.titre}</span>
                <span className="point__date">{carte.dateCourte}</span>
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
