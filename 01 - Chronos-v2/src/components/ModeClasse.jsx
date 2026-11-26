import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { PAR_ID } from '../data/index.js';
import { PARCOURS } from '../data/parcours.js';
import { lienPeriode } from '../lib/route.js';
import '../classe.css';

// ---------- Le « Mode Classe » ----------
// #/classe            → la liste des parcours
// #/classe/<parcours> → un parcours : ses étapes, le mode tableau, les fiches à imprimer
// Rien n'est envoyé à un serveur : le seul réglage gardé (mode tableau) reste dans le navigateur.

const CLE_TABLEAU = 'odysseum-mode-tableau';

// Le lien d'un événement : la page de sa période, là où il est présenté sur le site.
const lienEvenement = (e) => lienPeriode(e.etage, e.categorie);
// Le texte d'un événement : la fiche complète si elle existe, sinon son résumé.
const texteDe = (e) => e.texte || e.resume || null;

function lireTableau() {
  try { return localStorage.getItem(CLE_TABLEAU) === 'oui'; } catch { return false; }
}

export default function ModeClasse({ idParcours }) {
  const parcours = idParcours ? PARCOURS.find((p) => p.id === idParcours) : null;
  const [tableau, setTableau] = useState(lireTableau);
  const [pleinEcran, setPleinEcran] = useState(() => !!document.fullscreenElement);

  // Titre de l'onglet + retour en haut à chaque changement de page.
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    document.title = `${parcours ? parcours.titre : 'Mode Classe'} · Odysseum`;
  }, [parcours]);

  // On retient le choix « tableau numérique » pour la prochaine fois.
  useEffect(() => {
    try { localStorage.setItem(CLE_TABLEAU, tableau ? 'oui' : 'non'); } catch { /* navigation privée */ }
  }, [tableau]);

  // Le plein écran peut être quitté avec Échap : on suit son état réel.
  useEffect(() => {
    const suivre = () => setPleinEcran(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', suivre);
    return () => document.removeEventListener('fullscreenchange', suivre);
  }, []);

  const basculerPleinEcran = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else document.documentElement.requestFullscreen?.().catch(() => {});
  }, []);

  // Activer le tableau = texte agrandi, gros boutons, et plein écran si possible.
  const basculerTableau = useCallback(() => {
    setTableau((t) => {
      const suivant = !t;
      if (suivant && !document.fullscreenElement) document.documentElement.requestFullscreen?.().catch(() => {});
      if (!suivant && document.fullscreenElement) document.exitFullscreen?.();
      return suivant;
    });
  }, []);

  const outils = (
    <div className="classe__outils" role="group" aria-label="Affichage">
      <button type="button" className="classe__bouton" aria-pressed={tableau} onClick={basculerTableau}>
        {tableau ? 'Quitter le mode tableau' : 'Mode tableau numérique'}
      </button>
      {typeof document.documentElement.requestFullscreen === 'function' && (
        <button type="button" className="classe__bouton" aria-pressed={pleinEcran} onClick={basculerPleinEcran}>
          {pleinEcran ? 'Quitter le plein écran' : 'Plein écran'}
        </button>
      )}
    </div>
  );

  return (
    <div className={`page classe${tableau ? ' classe--tableau' : ''}`} data-etage={parcours?.etage || 'humains'}>
      <nav className="fil" aria-label="Fil d’Ariane">
        <ol>
          <li><a href="#titre-accueil">Odysseum</a></li>
          {parcours ? (
            <>
              <li><a href="#/classe">Mode Classe</a></li>
              <li><span aria-current="page">{parcours.titre}</span></li>
            </>
          ) : (
            <li><span aria-current="page">Mode Classe</span></li>
          )}
        </ol>
      </nav>
      {idParcours && !parcours ? (
        <section className="classe__entete">
          <h1 className="classe__titre">Parcours introuvable</h1>
          <p><a className="classe__lien" href="#/classe">Voir tous les parcours</a></p>
        </section>
      ) : parcours ? (
        <Parcours parcours={parcours} tableau={tableau} outils={outils} />
      ) : (
        <Liste outils={outils} />
      )}
    </div>
  );
}

// ---------- La liste des parcours ----------
function Liste({ outils }) {
  return (
    <>
      <header className="classe__entete">
        <p className="classe__sur-titre">Pour les enseignants</p>
        <h1 className="classe__titre">Mode Classe</h1>
        <p className="classe__texte">
          Des parcours prêts à l’emploi, rangés dans l’ordre, pour projeter Odysseum en classe.
          Chaque parcours a sa fiche d’activité à imprimer, avec un corrigé à part.
          Pas de compte, rien à installer.
        </p>
        {outils}
      </header>
      <ul className="classe__liste">
        {PARCOURS.map((p) => (
          <li key={p.id} className="classe__parcours" data-etage={p.etage}>
            <p className="classe__niveau">{p.niveau}</p>
            <h2 className="classe__titre2">
              <a href={`#/classe/${p.id}`}>{p.titre}</a>
            </h2>
            <p className="classe__texte">{p.intro}</p>
            <p className="classe__detail">
              {p.etapes.length} étapes · {p.questions.length} questions · {p.duree}
            </p>
          </li>
        ))}
      </ul>
      <p className="classe__avertissement">
        Les parcours suivent les grands thèmes des programmes scolaires français. Ils ne remplacent pas
        les programmes officiels, à consulter sur le site eduscol.
      </p>
    </>
  );
}

// ---------- Un parcours ----------
function Parcours({ parcours, tableau, outils }) {
  const etapes = parcours.etapes.map((id) => PAR_ID[id]).filter(Boolean);
  const [n, setN] = useState(0); // l'étape montrée en mode tableau
  const [impression, setImpression] = useState(null); // 'fiche' | 'corrige' | null

  // Mode tableau : les flèches du clavier passent d'une étape à l'autre.
  useEffect(() => {
    if (!tableau) return undefined;
    const touche = (e) => {
      if (e.target.closest?.('input, textarea, select')) return;
      if (e.key === 'ArrowRight') setN((i) => Math.min(i + 1, etapes.length - 1));
      if (e.key === 'ArrowLeft') setN((i) => Math.max(i - 1, 0));
    };
    document.addEventListener('keydown', touche);
    return () => document.removeEventListener('keydown', touche);
  }, [tableau, etapes.length]);

  // Imprimer : on affiche la bonne feuille, on lance l'impression, puis on range.
  useEffect(() => {
    if (!impression) return undefined;
    const fin = () => setImpression(null);
    window.addEventListener('afterprint', fin);
    const t = setTimeout(() => window.print(), 50);
    return () => { clearTimeout(t); window.removeEventListener('afterprint', fin); };
  }, [impression]);

  const etape = etapes[n];

  return (
    <>
      <header className="classe__entete">
        <p className="classe__sur-titre">{parcours.niveau}</p>
        <h1 className="classe__titre">{parcours.titre}</h1>
        <p className="classe__texte">{parcours.intro}</p>
        <p className="classe__detail">{parcours.programme}</p>
        {outils}
        <div className="classe__outils" role="group" aria-label="Fiche d’activité">
          <button type="button" className="classe__bouton" onClick={() => setImpression('fiche')}>
            Imprimer la fiche élève
          </button>
          <button type="button" className="classe__bouton" onClick={() => setImpression('corrige')}>
            Imprimer le corrigé
          </button>
        </div>
      </header>

      {tableau && etape ? (
        // Le mode tableau : une étape à la fois, en très grand.
        <section className="classe__projection" aria-labelledby="titre-etape" aria-live="polite">
          <p className="classe__compteur">Étape {n + 1} sur {etapes.length}</p>
          <article className="classe__etape classe__etape--grande" data-etage={etape.etage}>
            <p className="classe__date">{etape.dateCourte || etape.date}</p>
            <h2 id="titre-etape" className="classe__titre2">{etape.titre}</h2>
            {texteDe(etape) && <p className="classe__texte">{texteDe(etape)}</p>}
            <a className="classe__lien" href={lienEvenement(etape)}>Voir sur la frise</a>
          </article>
          <div className="classe__defilement">
            <button type="button" className="classe__bouton classe__bouton--gros" disabled={n === 0} onClick={() => setN(n - 1)}>
              <span aria-hidden="true">←</span> Précédente
            </button>
            <button type="button" className="classe__bouton classe__bouton--gros" disabled={n === etapes.length - 1} onClick={() => setN(n + 1)}>
              Suivante <span aria-hidden="true">→</span>
            </button>
          </div>
          <p className="classe__detail">Astuce : les flèches ← et → du clavier changent aussi d’étape.</p>
        </section>
      ) : (
        <ol className="classe__etapes">
          {etapes.map((e) => (
            <li key={e.id} className="classe__etape" data-etage={e.etage}>
              <p className="classe__date">{e.dateCourte || e.date}</p>
              <h2 className="classe__titre3">{e.titre}</h2>
              {texteDe(e) && <p className="classe__texte">{texteDe(e)}</p>}
              <a className="classe__lien" href={lienEvenement(e)}>
                Voir sur la frise<span className="sr-only"> : {e.titre}</span>
              </a>
            </li>
          ))}
        </ol>
      )}

      <p className="classe__navigation">
        <a className="classe__lien" href="#/classe">← Tous les parcours</a>
      </p>

      {impression && createPortal(<Feuille parcours={parcours} sorte={impression} />, document.body)}
    </>
  );
}

// ---------- La feuille imprimée (fiche élève ou corrigé) ----------
// Elle n'apparaît qu'à l'impression : à l'écran, elle est masquée (voir classe.css).
function Feuille({ parcours, sorte }) {
  const corrige = sorte === 'corrige';
  const adresse = `${window.location.origin}${window.location.pathname}#/classe/${parcours.id}`;
  return (
    <div className="feuille">
      <header className="feuille__tete">
        <p className="feuille__niveau">{parcours.niveau} · Odysseum</p>
        <h1 className="feuille__titre">
          {parcours.titre}
          {corrige && ' — Corrigé'}
        </h1>
        {!corrige && (
          <p className="feuille__eleve">Nom : ____________________ Prénom : ____________________ Classe : ________</p>
        )}
        <p className="feuille__consigne">
          {corrige
            ? 'Réponses attendues. Toutes se trouvent sur les fiches du parcours.'
            : 'Réponds aux questions en t’aidant du site Odysseum. Chaque question indique la fiche où chercher.'}
        </p>
        <p className="feuille__adresse">Le parcours : {adresse}</p>
      </header>
      <ol className="feuille__questions">
        {parcours.questions.map((q, i) => (
          <li key={i} className="feuille__question">
            <p className="feuille__q">{q.q}</p>
            {q.etape && PAR_ID[q.etape] && (
              <p className="feuille__indice">Fiche : « {PAR_ID[q.etape].titre} »</p>
            )}
            {corrige ? <p className="feuille__r">{q.r}</p> : <div className="feuille__lignes" />}
          </li>
        ))}
      </ol>
    </div>
  );
}
