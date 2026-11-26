import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { lienEtage } from '../lib/route.js';

// ---------------------------------------------------------------------------
// MENU TÉLÉPHONE (écrans de moins de 960 px, où la barre des étages n'a pas la place).
// Un bouton « Menu » ouvre un panneau plein écran : les 6 étages, puis les outils
// (Tout voir, Vue d'ensemble, Récit, Planisphère, Spirale).
// Clavier : Échap ferme et rend le focus au bouton. Un lien choisi ferme le menu.
// ---------------------------------------------------------------------------
const OUTILS = [
  { lien: '#/ensemble', nom: 'Tout voir', detail: 'Toute l’histoire sur une seule ligne' },
  { lien: '#/ensemble/vie', nom: 'Vue d’ensemble', detail: 'Un étage d’un coup d’œil' },
  { lien: '#/recit', nom: 'Récit', detail: 'L’histoire du monde en une minute' },
  { lien: '#/carte', nom: 'Planisphère', detail: 'Les continents à travers le temps (bêta)' },
  { lien: '#/ma-vie', nom: 'Ta vie sur la frise', detail: 'Ta vie dans l’année cosmique' },
  { lien: '#/spirale', nom: 'Spirale', detail: 'Le temps enroulé (essai)' },
];

export default function MenuMobile({ etages, etageActif }) {
  const [ouvert, setOuvert] = useState(false);
  const bouton = useRef(null);
  const panneau = useRef(null);

  useEffect(() => {
    if (!ouvert) return undefined;
    panneau.current?.querySelector('a')?.focus();
    const touche = (e) => {
      if (e.key === 'Escape') { setOuvert(false); bouton.current?.focus(); }
    };
    const fermer = () => setOuvert(false);
    document.addEventListener('keydown', touche);
    window.addEventListener('hashchange', fermer);
    document.body.style.overflow = 'hidden'; // la page ne défile pas derrière le menu
    return () => {
      document.removeEventListener('keydown', touche);
      window.removeEventListener('hashchange', fermer);
      document.body.style.overflow = '';
    };
  }, [ouvert]);

  return (
    <>
      <button
        ref={bouton}
        type="button"
        className="menu-mobile__bouton"
        aria-expanded={ouvert}
        aria-controls="menu-mobile"
        onClick={() => setOuvert((o) => !o)}
      >
        <span className="menu-mobile__icone" aria-hidden="true"><span /><span /><span /></span>
        Menu
      </button>
      {/* Le panneau est rendu directement dans <body> : l'en-tête (verre flouté) l'enfermerait sinon. */}
      {ouvert && createPortal(
        <nav id="menu-mobile" ref={panneau} className="menu-mobile" aria-label="Menu principal">
          <p className="menu-mobile__titre">Les étages</p>
          <ul className="menu-mobile__etages">
            {etages.map((e, k) => (
              <li key={e.id}>
                <a href={lienEtage(e.id)} data-etage={e.id} aria-current={e.id === etageActif ? 'page' : undefined} onClick={() => setOuvert(false)}>
                  <span className="menu-mobile__num" aria-hidden="true">{k + 1}</span>
                  {e.nom}
                </a>
              </li>
            ))}
          </ul>
          <p className="menu-mobile__titre">Explorer autrement</p>
          <ul className="menu-mobile__outils">
            {OUTILS.map((o) => (
              <li key={o.lien}>
                <a href={o.lien} onClick={() => setOuvert(false)}>
                  <span className="menu-mobile__nom">{o.nom}</span>
                  <span className="menu-mobile__detail">{o.detail}</span>
                </a>
              </li>
            ))}
          </ul>
          <button type="button" className="menu-mobile__fermer" onClick={() => { setOuvert(false); bouton.current?.focus(); }}>
            Fermer le menu
          </button>
        </nav>,
        document.body,
      )}
    </>
  );
}
