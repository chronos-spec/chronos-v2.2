import Recherche from './Recherche.jsx';

export default function Entete({ etages, etageActif, index: indexRecherche, onAller }) {
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
            href={`#${e.id}`}
            data-etage={e.id}
            className="entete__lien"
            aria-current={e.id === etageActif ? 'location' : undefined}
          >
            {e.nom}
          </a>
        ))}
      </nav>

      {/* Téléphone : où suis-je ? */}
      {actuel && (
        <p className="entete__pastille" data-etage={actuel.id}>
          {index + 1}/{etages.length} · {actuel.nom}
        </p>
      )}
    </header>
  );
}
