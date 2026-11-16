import { useState } from 'react';
import ImageWiki from './ImageWiki.jsx';
import { texteAge } from '../lib/ages.js';

// Un arbre qu'on déroule : on touche un groupe pour voir ses sous-groupes et ses espèces.
// noeud : { id, nom, texte, depuis?, eteint?, wiki?, enfants? }
export default function ArbreDeroulant({ noeuds, titre, aide, idTitre, ouvertsAuDepart = [] }) {
  const [ouverts, setOuverts] = useState(() => new Set(ouvertsAuDepart));
  const basculer = (id) =>
    setOuverts((o) => {
      const n = new Set(o);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  const tout = (ouvrir) => {
    const ids = [];
    const parcourir = (liste) => liste.forEach((x) => { if (x.enfants) { ids.push(x.id); parcourir(x.enfants); } });
    parcourir(noeuds);
    setOuverts(new Set(ouvrir ? ids : []));
  };

  return (
    <section className="arbre-d" aria-labelledby={idTitre}>
      <div className="arbre-d__tete">
        <h2 id={idTitre} className="arbre-d__titre">{titre}</h2>
        {aide && <p className="arbre-d__aide">{aide}</p>}
        <div className="arbre-d__boutons">
          <button type="button" onClick={() => tout(true)}>Tout ouvrir</button>
          <button type="button" onClick={() => tout(false)}>Tout fermer</button>
        </div>
      </div>
      <Liste noeuds={noeuds} ouverts={ouverts} onBasculer={basculer} niveau={0} />
      <p className="arbre-d__credit">
        Images : Wikipédia et Wikimedia Commons (licences libres) ; chaque grande image renvoie vers sa page.
      </p>
    </section>
  );
}

function Liste({ noeuds, ouverts, onBasculer, niveau }) {
  const feuilles = noeuds.filter((n) => !n.enfants);
  const groupes = noeuds.filter((n) => n.enfants);
  return (
    <div className="arbre-d__niveau" data-niveau={niveau}>
      {groupes.length > 0 && (
        <ul className="arbre-d__groupes">
          {groupes.map((n) => {
            const ouvert = ouverts.has(n.id);
            return (
              <li key={n.id} className={n.eteint ? 'arbre-d__groupe arbre-d__groupe--eteint' : 'arbre-d__groupe'}>
                <button
                  type="button"
                  className="arbre-d__bouton"
                  aria-expanded={ouvert}
                  aria-controls={`contenu-${n.id}`}
                  onClick={() => onBasculer(n.id)}
                >
                  <span className="arbre-d__chevron" aria-hidden="true">{ouvert ? '▾' : '▸'}</span>
                  <ImageWiki titre={n.wiki} alt="" taille="mini" />
                  <span className="arbre-d__textes">
                    <span className="arbre-d__nom">
                      {n.nom}
                      <span className="arbre-d__nombre"> · {compter(n)} {compter(n) > 1 ? 'éléments' : 'élément'}</span>
                    </span>
                    {n.depuis && <span className="arbre-d__depuis">depuis {texteAge(n.depuis)}</span>}
                    <span className="arbre-d__texte">{n.texte}</span>
                  </span>
                </button>
                <div id={`contenu-${n.id}`} className="arbre-d__contenu" hidden={!ouvert}>
                  {ouvert && <Liste noeuds={n.enfants} ouverts={ouverts} onBasculer={onBasculer} niveau={niveau + 1} />}
                </div>
              </li>
            );
          })}
        </ul>
      )}
      {feuilles.length > 0 && (
        <ul className="arbre-d__especes">
          {feuilles.map((n) => (
            <li key={n.id} className={n.eteint ? 'espece-carte espece-carte--eteinte' : 'espece-carte'}>
              <ImageWiki titre={n.wiki} alt={n.nom} taille="moyenne" />
              <p className="espece-carte__nom">
                {n.nom}
                {n.eteint && <span className="espece-carte__eteint"> · disparu</span>}
              </p>
              {n.dates && <p className="espece-carte__dates">{n.dates}</p>}
              <p className="espece-carte__texte">{n.texte}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function compter(n) {
  return n.enfants ? n.enfants.length : 0;
}
