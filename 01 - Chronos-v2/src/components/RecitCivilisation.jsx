import { useCallback, useEffect, useRef, useState } from 'react';
import ImageWiki from './ImageWiki.jsx';

// Le récit d'une civilisation : un diaporama qui avance tout seul (2 à 3 minutes),
// lu à voix haute par le navigateur si le son est activé (synthèse vocale, sans rien envoyer).
// Pause, étape précédente / suivante, son on/off, fermeture avec Échap.

const voixDispo = typeof window !== 'undefined' && 'speechSynthesis' in window;

// Durée d'une étape sans voix : environ 4 s + le temps de lecture du texte.
const dureeLecture = (texte) => 4000 + texte.split(/\s+/).length * 280;

function voixFrancaise() {
  const voix = window.speechSynthesis.getVoices();
  return voix.find((v) => v.lang === 'fr-FR' && /Google|Amélie|Thomas|Audrey|Marie/i.test(v.name))
    || voix.find((v) => v.lang?.startsWith('fr'));
}

export default function RecitCivilisation({ civ, onFermer }) {
  const boite = useRef(null);
  const [etape, setEtape] = useState(0);
  const [enPause, setEnPause] = useState(false);
  const [son, setSon] = useState(voixDispo);
  const etapes = civ.recit;
  const fini = etape >= etapes.length;
  const [date, titre, texte, wiki] = fini ? ['', 'Fin', '', null] : etapes[etape];

  const suivante = useCallback(() => setEtape((e) => Math.min(etapes.length, e + 1)), [etapes.length]);

  // Ouverture : la boîte de dialogue prend le focus ; à la fermeture on coupe la voix.
  useEffect(() => {
    const d = boite.current;
    d?.showModal();
    return () => {
      if (voixDispo) window.speechSynthesis.cancel();
    };
  }, []);

  // Avancer : à la fin de la voix, ou après un temps de lecture.
  useEffect(() => {
    if (fini || enPause) return undefined;
    if (son && voixDispo) {
      const synth = window.speechSynthesis;
      synth.cancel();
      const u = new SpeechSynthesisUtterance(`${titre}. ${texte}`);
      u.lang = 'fr-FR';
      u.rate = 0.98;
      const v = voixFrancaise();
      if (v) u.voice = v;
      let fait = false;
      u.onend = () => {
        if (!fait) {
          fait = true;
          setTimeout(suivante, 900);
        }
      };
      synth.speak(u);
      // Filet de sécurité si le navigateur ne signale pas la fin de la voix.
      const secours = setTimeout(() => {
        if (!fait) {
          fait = true;
          suivante();
        }
      }, dureeLecture(texte) * 2);
      return () => {
        fait = true;
        clearTimeout(secours);
        synth.cancel();
      };
    }
    const t = setTimeout(suivante, dureeLecture(texte));
    return () => clearTimeout(t);
  }, [etape, enPause, son, fini, titre, texte, suivante]);

  const fermer = () => {
    if (voixDispo) window.speechSynthesis.cancel();
    boite.current?.close();
    onFermer();
  };

  return (
    <dialog ref={boite} className="recit-civ" aria-labelledby="recit-civ-titre" onCancel={(e) => { e.preventDefault(); fermer(); }}>
      <div className="recit-civ__tete">
        <p className="recit-civ__civ" id="recit-civ-titre">{civ.nom} <span>· {civ.dates}</span></p>
        <button type="button" className="recit-civ__fermer" onClick={fermer} aria-label="Fermer le récit">
          <span aria-hidden="true">×</span>
        </button>
      </div>

      {!fini ? (
        <div className="recit-civ__etape" key={etape}>
          <ImageWiki titre={wiki} alt={titre} taille="carte" />
          <div className="recit-civ__texte">
            <p className="recit-civ__date">{date}</p>
            <h2 className="recit-civ__titre">{titre}</h2>
            <p aria-live="polite">{texte}</p>
          </div>
        </div>
      ) : (
        <div className="recit-civ__fin">
          <p className="recit-civ__titre">Fin du récit</p>
          <p>Les événements de cette civilisation sont affichés sur la ligne : touchez-en un pour lire sa fiche.</p>
        </div>
      )}

      <div className="recit-civ__progression" aria-hidden="true">
        {etapes.map((_, k) => (
          <span key={k} className={k < etape ? 'fait' : k === etape ? 'actuel' : ''} />
        ))}
      </div>

      <div className="recit-civ__commandes">
        <button type="button" onClick={() => setEtape((e) => Math.max(0, e - 1))} disabled={etape === 0}>← Précédent</button>
        {!fini ? (
          <button type="button" className="recit-civ__principal" onClick={() => setEnPause((p) => !p)}>
            {enPause ? '▶ Reprendre' : '⏸ Pause'}
          </button>
        ) : (
          <button type="button" className="recit-civ__principal" onClick={() => { setEtape(0); setEnPause(false); }}>↺ Revoir</button>
        )}
        <button type="button" onClick={suivante} disabled={fini}>Suivant →</button>
        {voixDispo && (
          <button type="button" aria-pressed={son} onClick={() => setSon((s) => !s)}>
            {son ? '🔊 Voix' : '🔇 Sans voix'}
          </button>
        )}
      </div>
      <p className="recit-civ__aide">
        Étape {Math.min(etape + 1, etapes.length)} sur {etapes.length}. La voix est celle de votre navigateur. Images : Wikimedia Commons.
      </p>
    </dialog>
  );
}
