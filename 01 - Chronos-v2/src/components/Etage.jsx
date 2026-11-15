import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Repere from './Repere.jsx';
import Frise from './Frise.jsx';
import Carte from './Carte.jsx';
import ChoixCategorie from './ChoixCategorie.jsx';
import ArbreHumain from './ArbreHumain.jsx';
import { GROUPES_VIVANT, RANGS_VIVANT } from '../data/vivant.js';
import { construireLigne, lirePosition, themesDe } from '../lib/echelle.js';

const mouvementReduit = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function Etage({ etage, numero, total, suivant, parId, carteOuverte, onBasculer, onFermer, onRefermer, onRepere, cible }) {
  // Un étage peut avoir plusieurs thèmes (Histoire, Aujourd'hui) : une seule ligne affichée à la fois.
  const themes = useMemo(() => themesDe(etage), [etage]);
  const [theme, setTheme] = useState(themes[0]);
  const [sortie, setSortie] = useState(false); // la ligne actuelle s'efface
  const themeDe = (idCategorie) => etage.categories.find((c) => c.id === idCategorie)?.theme || 'principal';
  const ligne = useMemo(() => construireLigne(etage, parId, theme), [etage, parId, theme]);
  const conteneur = useRef(null);
  const apresChangement = useRef(null); // ce qu'on fait une fois la nouvelle ligne affichée
  const attente = useRef(0);
  const [etat, setEtat] = useState({ fraction: 0, position: lirePosition(ligne, 0) });

  const ouverte = carteOuverte && parId[carteOuverte]?.etage === etage.id ? parId[carteOuverte] : null;

  // Quand la ligne défile, on met à jour la loupe et la période affichée.
  const mesurer = useCallback(() => {
    cancelAnimationFrame(attente.current);
    attente.current = requestAnimationFrame(() => {
      const el = conteneur.current;
      if (!el) return;
      const max = Math.max(1, el.scrollWidth - el.clientWidth);
      const centre = el.scrollLeft + el.clientWidth / 2;
      setEtat({ fraction: el.scrollLeft / max, position: lirePosition(ligne, centre) });
    });
  }, [ligne]);

  useEffect(() => {
    mesurer();
    window.addEventListener('resize', mesurer);
    return () => window.removeEventListener('resize', mesurer);
  }, [mesurer]);

  // On prévient l'année cosmique (à droite) de l'époque regardée.
  const ansRegarde = ouverte ? ouverte.ans : etat.position.ans;
  useEffect(() => {
    onRepere(etage.id, ansRegarde);
  }, [etage.id, ansRegarde, onRepere]);

  // Le curseur de la loupe fait défiler la ligne.
  const glisser = (fraction) => {
    const el = conteneur.current;
    if (!el) return;
    el.scrollLeft = fraction * (el.scrollWidth - el.clientWidth);
  };

  // La recherche demande d'aller à un endroit précis de cet étage.
  const [especeChoisie, setEspeceChoisie] = useState(null);
  useEffect(() => {
    if (!cible || cible.etage !== etage.id) return;
    if (cible.type === 'espece') {
      setEspeceChoisie(cible.id);
      return;
    }
    if (cible.type === 'carte') {
      const fiche = parId[cible.id];
      if (fiche && themeDe(fiche.categorie) !== theme) {
        changerTheme(themeDe(fiche.categorie), () => viser(cible));
        return;
      }
    }
    viser(cible);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cible]);

  // Fait glisser la ligne jusqu'à la cible (carte ou position).
  function viser(c) {
    const el = conteneur.current;
    if (!el) return;
    let x = null;
    if (c.type === 'carte') {
      const fiche = parId[c.id];
      const t = ligneRef.current.troncons.find((tr) => tr.categorie.id === fiche?.categorie);
      const p = t?.points.find((pt) => pt.carte.id === c.id);
      x = p ? p.x : t ? t.x + 200 : null;
    } else if (c.type === 'x') {
      x = c.x(ligneRef.current);
    }
    if (x !== null) {
      el.scrollTo({ left: Math.max(0, x - el.clientWidth / 2), behavior: mouvementReduit() ? 'auto' : 'smooth' });
    }
  }

  // Changer de thème : la ligne s'efface, puis la suivante apparaît.
  const ligneRef = useRef(ligne);
  ligneRef.current = ligne;
  const minuterie = useRef(0);
  function changerTheme(nouveau, ensuite) {
    clearTimeout(minuterie.current);
    if (nouveau === theme) {
      ensuite?.();
      return;
    }
    const basculer = () => {
      apresChangement.current = ensuite || null;
      setTheme(nouveau);
      setSortie(false);
    };
    if (mouvementReduit()) basculer();
    else {
      setSortie(true);
      minuterie.current = setTimeout(basculer, 320);
    }
  }
  useEffect(() => () => clearTimeout(minuterie.current), []);

  // Une fois la nouvelle ligne affichée, on va où on voulait aller.
  useEffect(() => {
    const suite = apresChangement.current;
    apresChangement.current = null;
    if (suite) requestAnimationFrame(suite);
  }, [theme]);

  // Le menu déroulant emmène directement à la période ou au thème choisi.
  const allerA = (idCategorie) => {
    onRefermer();
    const glisserVers = (instantane) => {
      const t = ligneRef.current.troncons.find((x) => x.categorie.id === idCategorie);
      const el = conteneur.current;
      if (!t || !el) return;
      el.scrollTo({ left: Math.max(0, t.x - 24), behavior: instantane || mouvementReduit() ? 'auto' : 'smooth' });
    };
    const nouveau = themeDe(idCategorie);
    if (nouveau !== theme) changerTheme(nouveau, () => glisserVers(true));
    else glisserVers(false);
  };

  return (
    <section
      id={etage.id}
      className={ouverte ? 'etage etage--carte' : 'etage'}
      data-etage={etage.id}
      data-section={etage.id}
      aria-labelledby={`titre-${etage.id}`}
    >
      <div className="etage__principal">
        <div className="etage__tete">
          <div className="etage__intro">
            <p className="etage__numero">Étage {numero} sur {total}</p>
            <h2 id={`titre-${etage.id}`} className="etage__titre" tabIndex={-1}>{etage.nom}</h2>
            <p className="etage__sous-titre">{etage.sousTitre}</p>
          </div>
          <ChoixCategorie etage={etage} valeur={etat.position.troncon.categorie.id} onChanger={allerA} />
        </div>

        <Frise
          key={theme}
          classe={sortie ? 'ligne--sortie' : 'ligne--entree'}
          ref={conteneur}
          etage={etage}
          ligne={ligne}
          carteOuverte={carteOuverte}
          onBasculer={onBasculer}
          onDefiler={mesurer}
          groupes={etage.id === 'vie' ? GROUPES_VIVANT : null}
          rangsGroupes={RANGS_VIVANT}
        />

        <Repere etage={etage} position={etat.position} fraction={etat.fraction} onGlisser={glisser} />

        <p className="etage__aide">
          Faites glisser la ligne ou le curseur. Touchez un point pour ouvrir sa carte,
          ou le nom d’une période pour la découvrir.
        </p>

        {etage.id === 'humains' && <ArbreHumain choisie={especeChoisie} onChoisir={setEspeceChoisie} />}

        {suivant ? (
          <a className="etage__suivant" href={`#${suivant.id}`} data-etage={suivant.id}>
            Étage suivant : <span className="etage__suivant-nom">{suivant.nom}</span>
            <span aria-hidden="true"> ↓</span>
          </a>
        ) : (
          <a className="etage__suivant" href="#titre-accueil">
            Fin du voyage. Revenir au début <span aria-hidden="true">↑</span>
          </a>
        )}
      </div>

      {ouverte && <Carte key={ouverte.id} carte={ouverte} etage={etage} onFermer={onFermer} />}
    </section>
  );
}
