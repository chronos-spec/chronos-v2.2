import { TEXTES, SOURCES } from '../data/textes.js';
import { WIKI_EVENEMENTS } from '../data/wiki.js';
import ImageWiki from './ImageWiki.jsx';
import { lienPeriode } from '../lib/route.js';
import { useEffect, useRef } from 'react';
import { dateCosmique } from '../lib/calendrier.js';

const ETIQUETTES = { bible: 'Selon la Bible', histoire: 'Fait historique' };

export default function Carte({ carte, etage, onFermer }) {
  const titreRef = useRef(null);
  const complete = Boolean(carte.texte);
  const periode = carte.type === 'periode';
  const cosmique = carte.cosmique || dateCosmique(carte.ans);

  // À l'ouverture, le focus va sur le titre : le lecteur d'écran lit la carte.
  useEffect(() => {
    titreRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <section id={`carte-${carte.id}`} className="carte" aria-labelledby={`titre-carte-${carte.id}`}>
      <span className="carte__poignee" aria-hidden="true" />
      <div className="carte__haut">
        <div>
          <p className="carte__etage">{periode ? `${etage.nom} · Période` : carte.type === 'animal' ? `${etage.nom} · Bestiaire` : etage.nom}</p>
          <h3 id={`titre-carte-${carte.id}`} className="carte__titre" tabIndex={-1} ref={titreRef}>
            {carte.titre}
          </h3>
        </div>
        <button type="button" className="carte__fermer" aria-label="Fermer la carte" onClick={onFermer}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M3 3l12 12M15 3L3 15" />
          </svg>
        </button>
      </div>

      {carte.nature && (
        <p className={`carte__nature carte__nature--${carte.nature}`}>{ETIQUETTES[carte.nature]}</p>
      )}

      <p className="carte__date">{carte.date || carte.dateCourte}</p>

      {complete ? (
        <>
          <ImageWiki titre={WIKI_EVENEMENTS[carte.id]} alt={carte.image?.description || carte.titre} taille="carte" />
          <p className="carte__texte">{carte.texte}</p>
        </>
      ) : carte.type === 'animal' ? (
        <>
          <ImageWiki titre={carte.wiki} alt={carte.titre} taille="carte" />
          <p className="carte__texte">{carte.resume}</p>
          <dl className="carte__fiche">
            <div><dt>Groupe</dt><dd>{carte.groupeNom}</dd></div>
            <div><dt>Taille</dt><dd>{carte.taille}</dd></div>
            <div><dt>Période</dt><dd>{carte.nomPeriode}</dd></div>
          </dl>
          <p className="carte__a-venir">Dates et tailles arrondies, d’après les fossiles connus. Image : reconstitution ou fossile (Wikimedia Commons).</p>
        </>
      ) : periode ? (
        <>
          <ImageWiki titre={WIKI_EVENEMENTS[carte.id]} alt={carte.titre} taille="carte" />
          {carte.resume && <p className="carte__texte">{sansDates(carte.resume)}</p>}
          {carte.points.length > 0 && (
            <>
              <p className="carte__sous-titre">À retenir</p>
              <ul className="carte__points">
                {carte.points.map((p) => <li key={p}>{p}</li>)}
              </ul>
            </>
          )}
          <a className="carte__lien-page" href={lienPeriode(carte.etage, carte.categorie)}>
            Ouvrir la page de la période <span aria-hidden="true">→</span>
          </a>
        </>
      ) : (
        <>
          <ImageWiki titre={WIKI_EVENEMENTS[carte.id]} alt={carte.titre} taille="carte" />
          {carte.resume && <p className="carte__texte">{carte.resume}</p>}
          {TEXTES[carte.id] && (
            <>
              <p className="carte__texte">{TEXTES[carte.id][0]}</p>
              <p className="carte__source">
                Sources :{' '}
                {TEXTES[carte.id][1].map((k, i) => (
                  <span key={k}>
                    {i > 0 && ' ; '}
                    <a href={SOURCES[k].url} target="_blank" rel="noreferrer">
                      {SOURCES[k].nom}<span className="sr-only"> (s’ouvre dans un nouvel onglet)</span>
                    </a>
                  </span>
                ))}
              </p>
            </>
          )}
        </>
      )}

      {cosmique && (
        <p className="carte__repere">
          Si l'univers tenait en un an : <span className="carte__repere-date">{cosmique}</span>
        </p>
      )}

      {complete && (
        <p className="carte__source">
          Source :{' '}
          {carte.source.url ? (
            <a href={carte.source.url} target="_blank" rel="noreferrer">{carte.source.texte}</a>
          ) : (
            carte.source.texte
          )}
        </p>
      )}
    </section>
  );
}

// La date de la période est déjà affichée : on l'enlève du début du résumé.
function sansDates(texte) {
  const t = texte.replace(/^(De|Depuis) [^:]{1,60} : /, '');
  return t.charAt(0).toUpperCase() + t.slice(1);
}
