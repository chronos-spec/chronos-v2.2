import { useEffect, useMemo, useRef, useState } from 'react';
import { signaler } from '../lib/badges.js';

// La loupe de recherche (en haut à gauche) : trouver un événement, une période, un groupe du vivant,
// une espèce humaine ou un étage. Une vraie boîte de dialogue : Échap la ferme, le focus revient à la loupe.

const sansAccents = (t) =>
  (t || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[’']/g, ' ')
    .toLowerCase();

export default function Recherche({ index, onAller }) {
  const dialogue = useRef(null);
  const champ = useRef(null);
  const [texte, setTexte] = useState('');

  const ouvrir = () => {
    setTexte('');
    dialogue.current?.showModal();
    requestAnimationFrame(() => champ.current?.focus());
  };
  const fermer = () => dialogue.current?.close();

  // Un clic en dehors de la boîte la ferme.
  useEffect(() => {
    const d = dialogue.current;
    const clic = (e) => {
      if (e.target === d) d.close();
    };
    d?.addEventListener('click', clic);
    return () => d?.removeEventListener('click', clic);
  }, []);

  const resultats = useMemo(() => {
    const mots = sansAccents(texte).split(/\s+/).filter(Boolean);
    if (mots.length === 0) return [];
    return index
      .map((r) => {
        const titre = sansAccents(r.titre);
        const tout = sansAccents(`${r.titre} ${r.details} ${r.motsCles}`);
        if (!mots.every((m) => tout.includes(m))) return null;
        // Le titre qui commence par la recherche passe en premier.
        const score = (titre.startsWith(mots[0]) ? 0 : titre.includes(mots[0]) ? 1 : 2) + r.ordre / 1000;
        return { ...r, score };
      })
      .filter(Boolean)
      .sort((a, b) => a.score - b.score)
      .slice(0, 40);
  }, [texte, index]);

  const choisir = (r) => {
    fermer();
    signaler('recherche', r.id || 'oui'); // badge « Curieux »
    onAller(r);
  };

  const touche = (e) => {
    if (e.key === 'Enter' && resultats[0]) {
      e.preventDefault();
      choisir(resultats[0]);
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      dialogue.current?.querySelector('.resultat')?.focus();
    }
  };

  // Flèches haut / bas dans la liste des résultats.
  const toucheListe = (e) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    e.preventDefault();
    const boutons = [...dialogue.current.querySelectorAll('.resultat')];
    const i = boutons.indexOf(document.activeElement);
    if (e.key === 'ArrowUp' && i <= 0) champ.current?.focus();
    else boutons[Math.min(boutons.length - 1, Math.max(0, i + (e.key === 'ArrowDown' ? 1 : -1)))]?.focus();
  };

  return (
    <>
      <button type="button" className="loupe-recherche" onClick={ouvrir} aria-haspopup="dialog">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="M15.5 15.5L21 21" />
        </svg>
        <span className="sr-only">Rechercher</span>
      </button>

      <dialog ref={dialogue} className="recherche" aria-labelledby="titre-recherche">
        <div className="recherche__boite">
          <div className="recherche__haut">
            <h2 id="titre-recherche" className="sr-only">Rechercher dans Odysseum</h2>
            <label className="recherche__champ">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                <circle cx="10.5" cy="10.5" r="6.5" />
                <path d="M15.5 15.5L21 21" />
              </svg>
              <span className="sr-only">Rechercher un événement, une période, une espèce</span>
              <input
                ref={champ}
                type="search"
                value={texte}
                onChange={(e) => setTexte(e.target.value)}
                onKeyDown={touche}
                placeholder="Dinosaures, Moyen Âge, Lucy…"
                autoComplete="off"
                enterKeyHint="search"
                aria-controls="resultats-recherche"
              />
            </label>
            <button type="button" className="recherche__fermer" onClick={fermer}>Fermer</button>
          </div>

          <p className="sr-only" aria-live="polite">
            {texte ? `${resultats.length} résultat${resultats.length > 1 ? 's' : ''}` : ''}
          </p>

          {texte && resultats.length === 0 && (
            <p className="recherche__vide">Aucun résultat. Essayez un autre mot.</p>
          )}
          {!texte && (
            <p className="recherche__vide">
              Cherchez un événement, une période (Jurassique, Antiquité…), un groupe d’êtres vivants ou une espèce humaine.
            </p>
          )}

          <ul id="resultats-recherche" className="recherche__liste" onKeyDown={toucheListe}>
            {resultats.map((r) => (
              <li key={r.cle}>
                <button type="button" className="resultat" data-etage={r.etage} onClick={() => choisir(r)}>
                  <span className="resultat__type">{r.type} · {r.nomEtage}</span>
                  <span className="resultat__titre">{r.titre}</span>
                  {r.details && <span className="resultat__details">{r.details}</span>}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </dialog>
    </>
  );
}
