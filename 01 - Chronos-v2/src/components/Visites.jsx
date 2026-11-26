import { useCallback, useEffect, useRef, useState } from 'react';
import { PAR_ID } from '../data/index.js';
import { VISITES, VISITE_PAR_ID } from '../data/visites.js';
import { lienPeriode } from '../lib/route.js';
import '../visites.css';

// Les visites guidées : environ 3 minutes, étape par étape.
//   #/visites          → la liste des visites
//   #/visites/oxygene  → la visite « D'où vient l'oxygène ? »
// La narration est lue par la voix du navigateur (speechSynthesis : gratuite, sur l'appareil,
// aucune connexion à un service extérieur). Les sous-titres sont toujours affichés.
// Sans voix française disponible, on avance soi-même avec « Suivant ».

const PAUSE_ENTRE_ETAPES = 1500; // petit silence (ms) avant l'étape suivante

// Trouver une voix française sur l'appareil (la liste arrive parfois avec un peu de retard).
function useVoixFrancaise() {
  const [voix, setVoix] = useState(null);
  const [pret, setPret] = useState(false);
  useEffect(() => {
    const synthese = typeof window !== 'undefined' ? window.speechSynthesis : null;
    if (!synthese) { setPret(true); return undefined; }
    const choisir = () => {
      const toutes = synthese.getVoices();
      const fr = toutes.filter((v) => v.lang?.toLowerCase().startsWith('fr'));
      // On préfère une voix de France, et une voix locale (qui marche hors ligne).
      const meilleure = fr.find((v) => v.lang === 'fr-FR' && v.localService)
        || fr.find((v) => v.lang === 'fr-FR') || fr[0] || null;
      setVoix(meilleure);
      if (toutes.length) setPret(true);
    };
    choisir();
    synthese.addEventListener?.('voiceschanged', choisir);
    // Si aucune voix n'arrive au bout de 1,5 s, on considère qu'il n'y en a pas.
    const delai = setTimeout(() => setPret(true), 1500);
    return () => { synthese.removeEventListener?.('voiceschanged', choisir); clearTimeout(delai); };
  }, []);
  return { voix, pret };
}

// ---------- La liste des visites ----------
function ListeVisites() {
  useEffect(() => { document.title = 'Visites guidées · Odysseum'; }, []);
  return (
    <section className="visites" aria-labelledby="titre-visites">
      <h1 id="titre-visites" className="visites__titre">Visites guidées</h1>
      <p className="visites__intro">
        Laissez-vous raconter l’histoire en 3 minutes environ, étape par étape.
        Vous pouvez faire une pause, revenir en arrière ou quitter pour explorer librement.
      </p>
      <ul className="visites__liste">
        {VISITES.map((v) => (
          <li key={v.id} data-etage={v.etage} className="visites__choix">
            <h2 className="visites__nom">{v.titre}</h2>
            <p>{v.accroche}</p>
            <p className="visites__duree">{v.etapes.length} étapes · ~3 min</p>
            <a className="bouton-principal" href={`#/visites/${v.id}`}>
              Commencer<span className="sr-only"> la visite « {v.titre} »</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ---------- Le lecteur d'une visite ----------
function LecteurVisite({ visite }) {
  const { voix, pret } = useVoixFrancaise();
  const [n, setN] = useState(0); // numéro de l'étape (0 = première)
  const [lecture, setLecture] = useState(false); // la voix lit-elle ?
  const [finie, setFinie] = useState(false); // la dernière étape a été lue jusqu'au bout
  const enonce = useRef(null); // on garde l'énoncé en mémoire (sinon Chrome peut l'oublier)
  const minuteur = useRef(null);
  const total = visite.etapes.length;
  const etape = visite.etapes[n];
  const fiche = PAR_ID[etape.fiche] || {};
  const derniere = n === total - 1;
  const avecVoix = !!voix;

  useEffect(() => { document.title = `${visite.titre} · Visite guidée · Odysseum`; }, [visite.titre]);

  // Tout arrêter (voix et minuteur).
  const arreter = useCallback(() => {
    clearTimeout(minuteur.current);
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  }, []);

  // En quittant la page, la voix se tait.
  useEffect(() => arreter, [arreter]);

  // Pendant la lecture : lire l'étape, puis passer à la suivante.
  useEffect(() => {
    if (!lecture || !voix) return undefined;
    arreter();
    const u = new SpeechSynthesisUtterance(etape.narration);
    u.voice = voix;
    u.lang = voix.lang;
    u.rate = 0.9; // un peu plus lent que la normale, pour bien comprendre
    u.onend = () => {
      if (enonce.current !== u) return; // énoncé annulé entre-temps
      if (derniere) { setLecture(false); setFinie(true); return; }
      minuteur.current = setTimeout(() => setN((i) => Math.min(i + 1, total - 1)), PAUSE_ENTRE_ETAPES);
    };
    u.onerror = () => { if (enonce.current === u) setLecture(false); };
    enonce.current = u;
    window.speechSynthesis.speak(u);
    return () => { enonce.current = null; arreter(); };
  }, [lecture, voix, n, etape.narration, derniere, total, arreter]);

  const aller = (i) => { setFinie(false); setN(Math.max(0, Math.min(total - 1, i))); };
  const basculerLecture = () => {
    if (finie) { setFinie(false); setN(0); setLecture(true); return; } // on recommence
    setLecture((l) => !l);
  };

  // Raccourcis clavier : flèches gauche / droite pour changer d'étape.
  useEffect(() => {
    const touche = (e) => {
      if (e.target.closest?.('input, textarea, select, [contenteditable]')) return;
      if (e.key === 'ArrowRight') setFinie(false), setN((i) => Math.min(i + 1, total - 1));
      if (e.key === 'ArrowLeft') setFinie(false), setN((i) => Math.max(i - 1, 0));
    };
    document.addEventListener('keydown', touche);
    return () => document.removeEventListener('keydown', touche);
  }, [total]);

  const lienExplorer = fiche.etage && fiche.categorie ? lienPeriode(fiche.etage, fiche.categorie) : '#/visites';
  const progression = Math.round(((n + 1) / total) * 100);
  const texteFiche = fiche.texte || fiche.resume;

  return (
    <section className="visite" data-etage={fiche.etage || visite.etage} aria-labelledby="titre-visite">
      <header className="visite__entete">
        <p className="visite__sur-titre">Visite guidée</p>
        <h1 id="titre-visite" className="visite__titre">{visite.titre}</h1>
      </header>

      {/* La barre de progression */}
      <div
        className="visite__progression"
        role="progressbar"
        aria-label="Progression de la visite"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={n + 1}
        aria-valuetext={`Étape ${n + 1} sur ${total}`}
      >
        <span style={{ width: `${progression}%` }} />
      </div>
      <p className="visite__compteur">Étape {n + 1} sur {total}</p>

      {/* L'étape : la fiche de la frise et la narration */}
      <article key={n} className="visite__etape">
        <p className="visite__date">{fiche.dateCourte || fiche.date}</p>
        <h2 className="visite__fiche" aria-live="polite">{fiche.titre}</h2>
        {/* Sous-titres : toujours affichés, que la voix lise ou non */}
        <p className="visite__sous-titre">{etape.narration}</p>
        {texteFiche && texteFiche !== etape.narration && (
          <details className="visite__details">
            <summary>Lire la fiche complète</summary>
            <p>{texteFiche}</p>
          </details>
        )}
      </article>

      {pret && !avecVoix && (
        <p className="visite__info" role="status">
          Aucune voix française n’est disponible sur cet appareil : lisez les sous-titres
          et avancez avec « Suivant ».
        </p>
      )}

      {/* Les commandes */}
      <div className="visite__commandes">
        <button type="button" className="verre bouton-secondaire" onClick={() => aller(n - 1)} disabled={n === 0}>
          ← Précédent
        </button>
        {avecVoix && (
          <button type="button" className="bouton-principal" onClick={basculerLecture} aria-pressed={lecture}>
            {lecture ? 'Pause' : finie ? 'Réécouter' : 'Lecture'}
          </button>
        )}
        <button type="button" className="verre bouton-secondaire" onClick={() => aller(n + 1)} disabled={derniere}>
          Suivant →
        </button>
      </div>

      <div className="visite__sorties">
        <a className="verre bouton-secondaire" href={lienExplorer}>
          Quitter et explorer ici<span className="sr-only"> : {fiche.titre}</span>
        </a>
        <a className="visite__lien" href="#/visites">Toutes les visites</a>
      </div>
      <p className="visite__aide">Astuce : les flèches ← et → du clavier changent d’étape.</p>
    </section>
  );
}

export default function Visites({ idVisite }) {
  const visite = idVisite ? VISITE_PAR_ID[idVisite] : null;
  if (idVisite && !visite) {
    return (
      <section className="visites">
        <h1 className="visites__titre">Visite introuvable</h1>
        <a className="bouton-principal" href="#/visites">Voir toutes les visites</a>
      </section>
    );
  }
  return visite ? <LecteurVisite key={visite.id} visite={visite} /> : <ListeVisites />;
}
