import { PREUVES, CERTITUDES } from '../data/preuves.js';

// Le volet « Comment on le sait ? » d'une carte.
// Fermé par défaut (découverte progressive) : on l'ouvre au clic, au toucher ou au clavier
// (Entrée / Espace). <details> est un élément HTML natif : rien à programmer pour l'accessibilité.
//   preuve          : { types: [...], certitude } (voir preuveDe dans data/preuves.js)
//   source          : la source de la fiche complète, ou null
//   sourcesPlusHaut : vrai si les sources sont déjà affichées dans le texte de la carte
export default function CommentOnLeSait({ preuve, source, sourcesPlusHaut }) {
  const certitude = preuve.certitude ? CERTITUDES[preuve.certitude] : null;

  return (
    <details className="preuve">
      <summary className="preuve__titre">
        <span>Comment on le sait ?</span>
        {certitude && (
          <span className={`preuve__certitude preuve__certitude--${preuve.certitude}`}>
            <span aria-hidden="true">{certitude.symbole}</span> {certitude.libelle}
          </span>
        )}
      </summary>

      <div className="preuve__contenu">
        {preuve.types.length > 0 && (
          <dl className="preuve__liste">
            {preuve.types.map((t) => (
              <div key={t}>
                <dt>{PREUVES[t].nom}</dt>
                <dd>{PREUVES[t].court}</dd>
              </div>
            ))}
          </dl>
        )}

        {certitude && (
          <p className="preuve__explication">
            <strong>{certitude.libelle} :</strong> {certitude.explication}
          </p>
        )}

        {source ? (
          <p className="carte__source">
            Source :{' '}
            {source.url ? (
              <a href={source.url} target="_blank" rel="noreferrer">
                {source.texte}<span className="sr-only"> (s’ouvre dans un nouvel onglet)</span>
              </a>
            ) : (
              source.texte
            )}
          </p>
        ) : sourcesPlusHaut ? (
          <p className="carte__source">Sources : indiquées plus haut dans la carte.</p>
        ) : null}

        <a className="preuve__lien" href="#/methodes">
          Toutes les méthodes expliquées <span aria-hidden="true">→</span>
        </a>
      </div>
    </details>
  );
}
