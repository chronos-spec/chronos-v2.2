import { useEffect, useRef } from 'react';
import { PREUVES, CERTITUDES, ORDRE_METHODES } from '../data/preuves.js';

// ---------------------------------------------------------------------------
// PAGE « COMMENT ON LE SAIT ? » (#/methodes)
// Explique simplement chaque méthode de datation et les niveaux de certitude.
// Tous les textes viennent de data/preuves.js (rien n'est écrit deux fois).
// ---------------------------------------------------------------------------
export default function Methodes() {
  const titre = useRef(null);
  useEffect(() => {
    document.title = 'Comment on le sait ? · Odysseum';
    window.scrollTo(0, 0);
    titre.current?.focus({ preventScroll: true });
  }, []);

  return (
    <article className="legal methodes">
      <h1 ref={titre} tabIndex={-1}>Comment on le sait ?</h1>
      <p>
        Personne n’était là pour voir le Big Bang ou les dinosaures. Pourtant, on connaît leur date.
        Voici les méthodes qu’utilisent les scientifiques et les historiens, expliquées simplement.
      </p>

      <section aria-labelledby="methodes-certitude">
        <h2 id="methodes-certitude">Les niveaux de certitude</h2>
        <p>Sur chaque carte, le volet « Comment on le sait ? » indique à quel point on est sûr :</p>
        <ul className="methodes__certitudes">
          {Object.entries(CERTITUDES).map(([id, c]) => (
            <li key={id}>
              <span className={`preuve__certitude preuve__certitude--${id}`}>
                <span aria-hidden="true">{c.symbole}</span> {c.libelle}
              </span>{' '}
              {c.explication}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="methodes-liste">
        <h2 id="methodes-liste">Les méthodes</h2>
        {ORDRE_METHODES.map((id) => (
          <section key={id} aria-labelledby={`methode-${id}`}>
            <h3 id={`methode-${id}`}>{PREUVES[id].nom}</h3>
            <p>{PREUVES[id].long}</p>
          </section>
        ))}
      </section>

      <p className="legal__retour"><a href="#/">← Revenir à la frise</a></p>
    </article>
  );
}
