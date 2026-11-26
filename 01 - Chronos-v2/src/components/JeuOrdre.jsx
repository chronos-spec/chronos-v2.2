import { useEffect, useRef, useState } from 'react';
import { PAR_ID } from '../data/index.js';
import { WIKI_EVENEMENTS } from '../data/wiki.js';
import ImageWiki from './ImageWiki.jsx';
import { signaler } from '../lib/badges.js';
import { NIVEAUX, NIVEAU_DEFI, aujourdhui, bonOrdre, corriger, texteAPartager, tirer } from '../lib/ordre.js';

// ---------------------------------------------------------------------------
// LE JEU « Remets dans l'ordre » (onglet du panneau Jeu).
// On reçoit des cartes sans date, on les range du plus ancien au plus récent
// avec les boutons « Plus ancien ↑ » et « Plus récent ↓ » (souris, toucher ou clavier),
// puis on valide : les vraies dates apparaissent.
// Le défi du jour est le même pour tout le monde (tirage fixé par la date).
// La partie en cours et le résultat du défi sont gardés dans le navigateur.
// ---------------------------------------------------------------------------

const CLE = 'chronos-ordre-v1';
const CLE_DEFI = 'chronos-ordre-defi-v1';

function lireJson(cle) {
  try {
    return JSON.parse(localStorage.getItem(cle) || 'null');
  } catch {
    return null;
  }
}
function ecrireJson(cle, v) {
  try {
    if (v) localStorage.setItem(cle, JSON.stringify(v));
    else localStorage.removeItem(cle);
  } catch {
    /* stockage indisponible : le jeu marche quand même */
  }
}
// Une partie sauvegardée n'est reprise que si toutes ses cartes existent encore.
function lirePartie() {
  const p = lireJson(CLE);
  return p && Array.isArray(p.ids) && p.ids.every((id) => PAR_ID[id]) ? p : null;
}

export default function JeuOrdre() {
  const [partie, setPartie] = useState(lirePartie); // { niveau, ids, defi: date|null, resultat: [bool]|null }
  const [annonce, setAnnonce] = useState('');
  const [copie, setCopie] = useState('');
  const date = aujourdhui();
  const defiFait = (() => {
    const d = lireJson(CLE_DEFI);
    return d && d.date === date ? d : null;
  })();
  const boutons = useRef({});
  const aFocus = useRef(null); // le bouton à remettre sous le doigt après un déplacement
  const titre = useRef(null);

  useEffect(() => ecrireJson(CLE, partie), [partie]);
  useEffect(() => {
    if (aFocus.current) {
      boutons.current[aFocus.current]?.focus();
      aFocus.current = null;
    }
  });

  const commencer = (niveau, defi = false) => {
    setCopie('');
    setAnnonce('');
    setPartie({ niveau, ids: tirer(niveau, defi ? date : undefined), defi: defi ? date : null, resultat: null });
    setTimeout(() => titre.current?.focus(), 0);
  };

  // Déplace une carte d'une place (sens = -1 : plus ancien, +1 : plus récent).
  const deplacer = (k, sens) => {
    const j = k + sens;
    if (!partie || j < 0 || j >= partie.ids.length) return;
    const ids = [...partie.ids];
    [ids[k], ids[j]] = [ids[j], ids[k]];
    const id = ids[j];
    // Au bord, le bouton disparaît (désactivé) : on garde alors le focus sur l'autre bouton.
    const bord = j === 0 || j === ids.length - 1;
    aFocus.current = `${id}${bord ? (j === 0 ? '+' : '-') : sens < 0 ? '-' : '+'}`;
    setPartie({ ...partie, ids });
    setAnnonce(`« ${PAR_ID[id].titre} » est maintenant à la place ${j + 1} sur ${ids.length}.`);
  };

  const valider = () => {
    const resultat = corriger(partie.ids);
    const bons = resultat.filter(Boolean).length;
    setPartie({ ...partie, resultat });
    setAnnonce(`${bons} carte${bons > 1 ? 's' : ''} bien placée${bons > 1 ? 's' : ''} sur ${resultat.length}.`);
    // Badges : une valeur par niveau et par score (« expert-7-7 »).
    signaler('ordre', `${partie.niveau}-${bons}-${resultat.length}`);
    if (partie.defi) {
      ecrireJson(CLE_DEFI, { date: partie.defi, ids: partie.ids, resultat });
      signaler('defi', partie.defi);
    }
    setTimeout(() => titre.current?.focus(), 0);
  };

  const partager = async (texte) => {
    try {
      if (navigator.share && window.matchMedia?.('(pointer: coarse)').matches) {
        await navigator.share({ text: texte });
        return;
      }
      await navigator.clipboard.writeText(texte);
      setCopie('Résultat copié ! Colle-le où tu veux.');
    } catch {
      setCopie('Copie impossible ici : sélectionne le texte ci-dessus et copie-le.');
    }
  };

  const adresse = `${window.location.origin}${window.location.pathname}`;

  // ---------- Accueil du jeu ----------
  if (!partie) {
    return (
      <div className="ordre">
        <p>
          Des cartes arrivent sans leur date. Range-les <strong>du plus ancien au plus récent</strong>, puis valide
          pour découvrir les vraies dates.
        </p>
        <h3 className="ordre__titre">Défi du jour</h3>
        {defiFait ? (
          <Partage date={date} resultat={defiFait.resultat} adresse={adresse} onPartager={partager} copie={copie} />
        ) : (
          <>
            <p className="ordre__aide">Le même tirage pour tout le monde aujourd’hui ({NIVEAUX[NIVEAU_DEFI].nb} cartes). Un seul essai !</p>
            <button type="button" className="jeu__principal ordre__large" onClick={() => commencer(NIVEAU_DEFI, true)}>
              <span aria-hidden="true">📅</span> Jouer le défi du jour
            </button>
          </>
        )}
        <h3 className="ordre__titre">Partie libre</h3>
        <div className="jeu__themes">
          {Object.entries(NIVEAUX).map(([id, n]) => (
            <button key={id} type="button" className="jeu__secondaire" onClick={() => commencer(id)}>
              {n.nom} <span className="jeu__nb">({n.aide})</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ---------- Partie en cours ou corrigée ----------
  const { ids, resultat, niveau, defi } = partie;
  const corrige = !!resultat;
  const bons = corrige ? resultat.filter(Boolean).length : 0;
  const juste = bonOrdre(ids);

  return (
    <div className="ordre">
      <h3 className="ordre__titre" ref={titre} tabIndex={-1}>
        {defi ? `Défi du jour · ${defi}` : `Niveau ${NIVEAUX[niveau].nom}`}
        {corrige && ` · ${bons}/${ids.length}`}
      </h3>
      <p className="ordre__aide">
        {corrige
          ? bons === ids.length
            ? 'Parfait ! Tout est à sa place.'
            : 'Voici les vraies dates. Les cartes mal placées sont marquées ❌.'
          : 'En haut le plus ancien, en bas le plus récent.'}
      </p>
      <p className="sr-only" role="status" aria-live="polite">{annonce}</p>

      <ol className="ordre__liste">
        {ids.map((id, k) => {
          const e = PAR_ID[id];
          const etat = corrige ? (resultat[k] ? 'bon' : 'faux') : null;
          return (
            <li key={id} className={`ordre__carte${etat ? ` ordre__carte--${etat}` : ''}`} data-etage={corrige ? e.etage : undefined}>
              <span className="ordre__rang" aria-hidden="true">{k + 1}</span>
              <ImageWiki titre={WIKI_EVENEMENTS[id]} alt="" taille="mini" />
              <span className="ordre__texte">
                <span className="ordre__nom">{e.titre}</span>
                {corrige && (
                  <span className="ordre__date">
                    {e.dateCourte}
                    <span className="ordre__marque">{resultat[k] ? ' ✅ bien placée' : ` ❌ sa place : ${juste.indexOf(id) + 1}`}</span>
                  </span>
                )}
              </span>
              {!corrige && (
                <span className="ordre__fleches">
                  <button
                    type="button"
                    ref={(b) => { boutons.current[`${id}-`] = b; }}
                    className="ordre__fleche"
                    onClick={() => deplacer(k, -1)}
                    disabled={k === 0}
                    aria-label={`Placer « ${e.titre} » plus tôt (place ${k + 1} sur ${ids.length})`}
                  >
                    <span aria-hidden="true">↑</span>
                  </button>
                  <button
                    type="button"
                    ref={(b) => { boutons.current[`${id}+`] = b; }}
                    className="ordre__fleche"
                    onClick={() => deplacer(k, 1)}
                    disabled={k === ids.length - 1}
                    aria-label={`Placer « ${e.titre} » plus tard (place ${k + 1} sur ${ids.length})`}
                  >
                    <span aria-hidden="true">↓</span>
                  </button>
                </span>
              )}
            </li>
          );
        })}
      </ol>
      <p className="jeu__aide">
        Images : Wikipédia (licences libres). Les dates précédées de « ~ » sont approximatives.
      </p>

      {!corrige ? (
        <div className="jeu__actions">
          <button type="button" className="jeu__secondaire" onClick={() => setPartie(null)}>
            {defi ? 'Plus tard' : 'Abandonner'}
          </button>
          <button type="button" className="jeu__principal" onClick={valider}>Valider mon ordre</button>
        </div>
      ) : (
        <>
          {defi && <Partage date={defi} resultat={resultat} adresse={adresse} onPartager={partager} copie={copie} />}
          <div className="jeu__actions">
            <button type="button" className="jeu__secondaire" onClick={() => setPartie(null)}>Retour</button>
            <button type="button" className="jeu__principal" onClick={() => commencer(defi ? NIVEAU_DEFI : niveau)}>
              {defi ? 'Partie libre' : 'Nouvelle partie'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// Le résultat du défi, à partager en texte (✅❌), sans serveur.
function Partage({ date, resultat, adresse, onPartager, copie }) {
  const texte = texteAPartager(date, resultat, adresse);
  return (
    <div className="ordre__partage">
      <pre className="ordre__resultat" aria-label="Résultat à partager">{texte}</pre>
      <button type="button" className="jeu__principal ordre__large" onClick={() => onPartager(texte)}>
        <span aria-hidden="true">📤</span> Partager mon résultat
      </button>
      {copie && <p role="status">{copie}</p>}
      <p className="ordre__aide">Un nouveau défi arrive demain.</p>
    </div>
  );
}
