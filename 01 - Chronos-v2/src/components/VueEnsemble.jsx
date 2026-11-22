import { useEffect, useRef } from 'react';
import { ETAGES, PAR_ID } from '../data/index.js';
import { BESTIAIRE } from '../data/bestiaire.js';
import { ERES, COULEUR_PERIODE } from '../data/eres.js';
import { lienEtage, lienPeriode, allerVers } from '../lib/route.js';
import { texteAge, plageAges } from '../lib/ages.js';

// La vue d'ensemble, qui se zoome par niveaux :
//   niveau 1 « Tout »  : les six étages, chacun avec ses grandes périodes (noms seulement) ;
//   niveau 2 (un étage) : ses périodes en tableau, du plus récent en haut au plus ancien en bas,
//                         avec dates, ères, animaux et événements marquants ;
//   niveau 3 (100 %)    : la page actuelle de la période (ou de l'étage).
// On zoome en touchant un bloc, avec les boutons − / +, ou avec Ctrl + molette.

// Bornes de chaque étage, en années avant aujourd'hui (ordres de grandeur).
const BORNES = {
  univers: [13.8e9, 4.6e9],
  terre: [4.6e9, 0],
  vie: [4.0e9, 7e6],
  humains: [7e6, 5300],
  histoire: [5300, 81],
  aujourdhui: [81, 0],
};

// Les périodes à montrer pour un étage (Histoire : les grandes périodes seulement ;
// Aujourd'hui : un thème par ligne).
function periodesDe(etage) {
  const cats = etage.id === 'histoire' ? etage.categories.filter((c) => c.theme === 'periodes') : etage.categories;
  return cats;
}

const titreEvt = (id) => PAR_ID[id]?.titre;

export default function VueEnsemble({ focus }) {
  // focus : null (tout) ou l'id d'un étage. Il vit dans l'adresse (#/ensemble ou #/ensemble/vie).
  const etage = focus ? ETAGES.find((e) => e.id === focus) : null;
  const titre = useRef(null);

  useEffect(() => {
    document.title = etage ? `Vue d’ensemble · ${etage.nom} · Odysseum` : 'Vue d’ensemble · Odysseum';
    titre.current?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }, [etage]);

  const dezoomer = () => {
    if (etage) allerVers('#/ensemble');
  };
  const zoomer = () => {
    if (!etage) allerVers('#/ensemble/vie');
    else allerVers(lienEtage(etage.id));
  };

  // Ctrl + molette (ou pincement sur pavé tactile) : changer de niveau.
  const dernier = useRef(0);
  useEffect(() => {
    const roue = (e) => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      const t = Date.now();
      if (t - dernier.current < 500) return;
      dernier.current = t;
      if (e.deltaY > 0) dezoomer();
      else zoomer();
    };
    window.addEventListener('wheel', roue, { passive: false });
    return () => window.removeEventListener('wheel', roue);
  });

  return (
    <div className="ensemble" data-etage={etage?.id || 'univers'}>
      <div className="ensemble__barre">
        <nav className="fil" aria-label="Niveau de zoom">
          <a href="#/ensemble" aria-current={!etage ? 'page' : undefined}>Toute l’histoire</a>
          {etage && (
            <>
              <span aria-hidden="true"> › </span>
              <span aria-current="page">{etage.nom}</span>
            </>
          )}
        </nav>
        <div className="zoom" role="group" aria-label="Niveau de zoom">
          <button type="button" className="zoom__bouton" onClick={dezoomer} disabled={!etage} aria-label="Dézoomer : voir toute l’histoire">
            <span aria-hidden="true">−</span>
          </button>
          <span className="zoom__valeur" aria-hidden="true">{etage ? 'Niveau 2 / 3' : 'Niveau 1 / 3'}</span>
          <button type="button" className="zoom__bouton" onClick={zoomer} aria-label={etage ? `Zoomer : ouvrir la page ${etage.nom}` : 'Zoomer : la vie en détail'}>
            <span aria-hidden="true">+</span>
          </button>
        </div>
      </div>

      <h1 ref={titre} tabIndex={-1} className="ensemble__titre">
        {etage ? `${etage.nom} : vue d’ensemble` : 'Toute l’histoire, d’un seul regard'}
      </h1>
      <p className="ensemble__aide">
        {etage
          ? 'Du plus récent (en haut) au plus ancien (en bas), comme les couches du sol. Touchez une période pour ouvrir sa page.'
          : 'Six étages, du Big Bang (en bas) à aujourd’hui (en haut). Touchez un étage pour voir ses périodes en détail.'}
      </p>

      {etage ? <Detail etage={etage} /> : <Tout />}
    </div>
  );
}

// Niveau 1 : les six étages empilés, le plus récent en haut.
function Tout() {
  const etages = [...ETAGES].reverse();
  return (
    <ol className="ensemble__pile">
      {etages.map((e) => {
        const [debut, fin] = BORNES[e.id];
        const periodes = periodesDe(e);
        return (
          <li key={e.id} className="ensemble__etage" data-etage={e.id}>
            <a className="ensemble__etage-lien" href={`#/ensemble/${e.id}`} aria-label={`${e.nom}, ${plageAges(debut, fin) || ''}. Zoomer sur cet étage`}>
              <span className="ensemble__etage-nom">{e.nom}</span>
              <span className="ensemble__etage-dates">{fin ? plageAges(debut, fin) : `depuis ${texteAge(debut)}`}</span>
              <span className="ensemble__etage-sous">{e.sousTitre}</span>
            </a>
            <ol className="ensemble__bandes" aria-label={`Périodes de l’étage ${e.nom}`}>
              {[...periodes].reverse().map((c) => (
                <li
                  key={c.id}
                  className="ensemble__bande"
                  style={{ flexGrow: poids(c, periodes), '--periode': COULEUR_PERIODE[c.id] || undefined }}
                >
                  <a href={lienPeriode(e.id, c.id)} title={c.periode || c.nom}>{c.nom}</a>
                </li>
              ))}
            </ol>
          </li>
        );
      })}
    </ol>
  );
}

// La largeur d'une période dans sa bande : proportionnelle à sa durée (adoucie), sinon égale.
function poids(c, toutes) {
  if (c.debut === undefined) return 1;
  const max = Math.max(...toutes.map((x) => (x.debut !== undefined ? x.debut - x.fin : 0)));
  return 1.3 + 2.4 * Math.sqrt((c.debut - c.fin) / max);
}

// Niveau 2 : les périodes d'un étage en tableau (inspiré de l'échelle des temps géologiques).
function Detail({ etage }) {
  const periodes = [...periodesDe(etage)].reverse(); // le plus récent en haut
  const avecEres = periodes.some((c) => c.ere);

  // Les ères : on regroupe les périodes qui se suivent dans la même ère (colonne de gauche).
  const blocs = [];
  periodes.forEach((c) => {
    const der = blocs[blocs.length - 1];
    if (der && der.ere === c.ere) der.periodes.push(c);
    else blocs.push({ ere: c.ere, periodes: [c] });
  });

  return (
    <div className="ensemble__tableau" role="table" aria-label={`Les périodes de l’étage ${etage.nom}, du plus récent au plus ancien`}>
      <div className="ensemble__entete" role="row">
        {avecEres && <span role="columnheader">Ère</span>}
        <span role="columnheader">Période</span>
        <span role="columnheader">Quand</span>
        <span role="columnheader">{etage.id === 'vie' ? 'Animaux emblématiques' : 'À retenir'}</span>
      </div>
      {blocs.map((b, i) => (
        <div key={`${b.ere}-${i}`} className="ensemble__bloc" style={{ '--ere': b.ere ? ERES[b.ere].couleur : undefined }}>
          {avecEres && (
            <div className="ensemble__ere" role="rowheader">
              {b.ere ? ERES[b.ere].nom : ''}
              {b.ere && <span className="ensemble__ere-detail">{ERES[b.ere].detail}</span>}
            </div>
          )}
          <div className="ensemble__lignes">
            {b.periodes.map((c) => {
              const animaux = (BESTIAIRE[c.id] || []).slice(0, 4).map((a) => a.nom);
              const evts = c.evenements.map(titreEvt).filter(Boolean).slice(0, 3);
              return (
                <a key={c.id} role="row" className="ensemble__ligne" href={lienPeriode(etage.id, c.id)} style={{ '--periode': COULEUR_PERIODE[c.id] || undefined, minHeight: hauteur(c, periodes) }}>
                  <span role="cell" className="ensemble__periode">{c.nom}</span>
                  <span role="cell" className="ensemble__quand">{c.debut !== undefined ? (c.fin ? plageAges(c.debut, c.fin) : `depuis ${texteAge(c.debut)}`) : c.periode || ''}</span>
                  <span role="cell" className="ensemble__retenir">
                    {(animaux.length ? animaux : evts).join(' · ')}
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// Hauteur d'une ligne : plus la période est longue, plus elle est haute (adouci, minimum 64 px).
function hauteur(c, toutes) {
  if (c.debut === undefined) return 72;
  const max = Math.max(...toutes.map((x) => (x.debut !== undefined ? x.debut - x.fin : 0)));
  return Math.round(64 + 120 * Math.sqrt((c.debut - c.fin) / max));
}
