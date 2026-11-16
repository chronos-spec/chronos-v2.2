import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Repere, { RepereVertical } from './Repere.jsx';
import FriseVerticale from './FriseVerticale.jsx';
import { useEstMobile } from '../lib/mobile.js';
import Frise from './Frise.jsx';
import Carte from './Carte.jsx';
import ChoixCategorie from './ChoixCategorie.jsx';
import ZoomControles from './ZoomControles.jsx';
import { lienEtage } from '../lib/route.js';
import { GROUPES_VIVANT, RANGS_VIVANT } from '../data/vivant.js';
import { construireLigne, lirePosition, themesDe, xPourAns } from '../lib/echelle.js';

// Zoom des frises (pages d'étage et de période) : en dessous de 1, vue d'ensemble (événements principaux).
const ZOOMS = [0.5, 1, 2, 4];
const NOMS_ZOOM = { 0.5: 'Vue d’ensemble', 1: 'Normal', 2: '× 2', 4: '× 4' };

const mouvementReduit = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// mode « accueil » : l'étage dans la page d'accueil (inchangé).
// mode « page » : la page dédiée à l'étage ou à une période (zoom, voies par lieu, liens vers les périodes).
export default function Etage({
  etage, numero, total, suivant, parId, carteOuverte, onBasculer, onFermer, onRefermer, onRepere, cible,
  mode = 'accueil', outils = null, voies = null, filtre = null, lienPeriode = null, sansMenu = false, titre = null, zoomInitial = 1,
}) {
  const page = mode === 'page';
  const [zoom, setZoom] = useState(zoomInitial);
  // Un étage peut avoir plusieurs thèmes (Histoire, Aujourd'hui) : une seule ligne affichée à la fois.
  const themes = useMemo(() => themesDe(etage), [etage]);
  const [theme, setTheme] = useState(themes[0]);
  const [sortie, setSortie] = useState(false); // la ligne actuelle s'efface
  const themeDe = (idCategorie) => etage.categories.find((c) => c.id === idCategorie)?.theme || 'principal';
  const ligne = useMemo(
    () => construireLigne(etage, parId, theme, { zoom: page ? zoom : 1, filtre }),
    [etage, parId, theme, zoom, page, filtre]
  );
  const conteneur = useRef(null);
  const apresChangement = useRef(null); // ce qu'on fait une fois la nouvelle ligne affichée
  const attente = useRef(0);
  const [etat, setEtat] = useState({ fraction: 0, position: lirePosition(ligne, 0) });

  const ouverte = carteOuverte && parId[carteOuverte]?.etage === etage.id ? parId[carteOuverte] : null;

  const mobile = useEstMobile();
  const section = useRef(null);

  // Téléphone : la page défile verticalement ; on lit la période et la date à hauteur d'œil.
  useEffect(() => {
    if (!mobile) return undefined;
    let attenteV = 0;
    const lire = () => {
      cancelAnimationFrame(attenteV);
      attenteV = requestAnimationFrame(() => {
        const sec = section.current;
        if (!sec) return;
        const r = sec.getBoundingClientRect();
        const oeil = window.innerHeight * 0.45;
        if (r.bottom < 0 || r.top > window.innerHeight) return;
        let idx = 0;
        sec.querySelectorAll('.lignev__troncon').forEach((el) => {
          if (el.getBoundingClientRect().top < oeil) idx = Number(el.dataset.troncon);
        });
        const t = ligneRef.current.troncons[idx];
        if (!t) return;
        let ans = t.sansEchelle ? null : t.debutAns;
        const bloc = sec.querySelector(`.lignev__troncon[data-troncon="${idx}"]`);
        bloc?.querySelectorAll('.lignev__item').forEach((li) => {
          if (li.getBoundingClientRect().top < oeil && li.dataset.ans !== '') ans = Number(li.dataset.ans);
        });
        setEtat((avant) =>
          avant.position.troncon === t && avant.position.ans === ans ? avant : { fraction: 0, position: { troncon: t, ans } }
        );
      });
    };
    lire();
    window.addEventListener('scroll', lire, { passive: true });
    window.addEventListener('resize', lire);
    return () => {
      cancelAnimationFrame(attenteV);
      window.removeEventListener('scroll', lire);
      window.removeEventListener('resize', lire);
    };
  }, [mobile, theme]);

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
  useEffect(() => {
    if (!cible || cible.etage !== etage.id) return;
    if (cible.type === 'espece') return; // géré par la page de l'étage (arbre humain)
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
    if (mobileRef.current) {
      viserVertical(c);
      return;
    }
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
      el.scrollTo({ left: Math.max(0, x - el.clientWidth / 2), behavior: c.instant || mouvementReduit() ? 'auto' : 'smooth' });
    }
  }

  // Téléphone : on fait défiler la page jusqu'à l'élément visé.
  const mobileRef = useRef(mobile);
  mobileRef.current = mobile;
  function defilerVers(el, bloc = 'center', instant = false) {
    el?.scrollIntoView({ block: bloc, behavior: instant || mouvementReduit() ? 'auto' : 'smooth' });
  }
  function trancheDe(ans) {
    const t = ligneRef.current.troncons.find((tr) => !tr.sansEchelle && ans <= tr.debutAns && ans >= tr.finAns);
    return t ? document.getElementById(`troncon-${etage.id}-${t.categorie.id}`) : null;
  }
  function viserVertical(c) {
    if (c.type === 'carte') {
      const fiche = parId[c.id];
      const el = document.getElementById(`point-${c.id}`);
      if (el) defilerVers(el);
      else defilerVers(document.getElementById(`troncon-${etage.id}-${fiche?.categorie}`), 'start');
    } else if (c.ans !== undefined) {
      defilerVers(trancheDe(c.ans), 'start', c.instant);
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
      if (mobileRef.current) {
        defilerVers(document.getElementById(`troncon-${etage.id}-${idCategorie}`), 'start');
        return;
      }
      const t = ligneRef.current.troncons.find((x) => x.categorie.id === idCategorie);
      const el = conteneur.current;
      if (!t || !el) return;
      el.scrollTo({ left: Math.max(0, t.x - 24), behavior: instantane || mouvementReduit() ? 'auto' : 'smooth' });
    };
    const nouveau = themeDe(idCategorie);
    if (nouveau !== theme) changerTheme(nouveau, () => glisserVers(true));
    else glisserVers(false);
  };

  // Zoomer la frise en gardant au centre l'époque regardée.
  const changerZoom = (nouveau) => {
    if (nouveau === zoom) return;
    const ans = etat.position.ans;
    apresZoom.current = ans;
    setZoom(nouveau);
  };
  const apresZoom = useRef(null);
  useEffect(() => {
    const ans = apresZoom.current;
    apresZoom.current = null;
    const el = conteneur.current;
    if (ans === null || ans === undefined || !el) return;
    const x = xPourAns(ligne, ans);
    el.scrollLeft = Math.max(0, x - el.clientWidth / 2);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom]);
  const iZoom = ZOOMS.indexOf(zoom);
  const zoomMoins = () => changerZoom(ZOOMS[Math.max(0, iZoom - 1)]);
  const zoomPlus = () => changerZoom(ZOOMS[Math.min(ZOOMS.length - 1, iZoom + 1)]);
  // Ctrl + molette (ou pincement sur le pavé tactile) zoome la frise.
  const zoomRef = useRef({});
  zoomRef.current = { zoomMoins, zoomPlus };
  useEffect(() => {
    const el = conteneur.current;
    if (!page || !el) return undefined;
    let dernier = 0;
    const roue = (e) => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      const maintenant = Date.now();
      if (maintenant - dernier < 250) return;
      dernier = maintenant;
      if (e.deltaY > 0) zoomRef.current.zoomMoins();
      else zoomRef.current.zoomPlus();
    };
    el.addEventListener('wheel', roue, { passive: false });
    return () => el.removeEventListener('wheel', roue);
  }, [page, theme, mobile]);

  const Titre = page ? 'h1' : 'h2';

  return (
    <section
      ref={section}
      id={etage.id}
      className={ouverte ? 'etage etage--carte' : 'etage'}
      data-etage={etage.id}
      data-section={page ? undefined : etage.id}
      aria-labelledby={`titre-${etage.id}`}
    >
      <div className="etage__principal">
        <div className="etage__tete">
          <div className="etage__intro">
            <p className="etage__numero">{page ? (titre ? titre.surTitre : `Étage ${numero} sur ${total}`) : `Étage ${numero} sur ${total}`}</p>
            <Titre id={`titre-${etage.id}`} className="etage__titre" tabIndex={-1}>{titre ? titre.nom : etage.nom}</Titre>
            <p className="etage__sous-titre">{titre ? titre.sousTitre : etage.sousTitre}</p>
            {!page && (
              <a className="etage__ouvrir" href={lienEtage(etage.id)}>
                Explorer l’étage {etage.nom} <span aria-hidden="true">→</span>
              </a>
            )}
          </div>
          <div className="etage__outils">
            {outils}
            {!sansMenu && <ChoixCategorie etage={etage} valeur={etat.position.troncon.categorie.id} onChanger={allerA} />}
            {page && (
              <ZoomControles
                libelle="Zoom de la frise"
                valeur={NOMS_ZOOM[zoom]}
                onMoins={zoomMoins}
                onPlus={zoomPlus}
                onRemettre={() => changerZoom(1)}
                peutMoins={iZoom > 0}
                peutPlus={iZoom < ZOOMS.length - 1}
              />
            )}
          </div>
        </div>

        {mobile ? (
          <>
            <RepereVertical etage={etage} position={etat.position} />
            <FriseVerticale
              key={theme}
              zoom={page ? zoom : 1}
              voies={voies}
              lienPeriode={lienPeriode}
              classe={sortie ? 'ligne--sortie' : 'ligne--entree'}
              etage={etage}
              ligne={ligne}
              carteOuverte={carteOuverte}
              onBasculer={onBasculer}
              groupes={etage.id === 'vie' ? GROUPES_VIVANT : null}
            />
          </>
        ) : (
          <>
            <Frise
              key={theme}
              voies={voies}
              lienPeriode={lienPeriode}
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
          </>
        )}

        <p className="etage__aide">
          {mobile
            ? 'Touchez un événement pour ouvrir sa carte, ou le nom d’une période pour la découvrir.'
            : page
              ? 'Faites glisser la ligne ou le curseur ; zoomez avec − et + (ou Ctrl + molette). Touchez un point pour ouvrir sa carte, ou le nom d’une période pour ouvrir sa page.'
              : 'Faites glisser la ligne ou le curseur. Touchez un point pour ouvrir sa carte, ou le nom d’une période pour la découvrir.'}
        </p>

        {page ? null : suivant ? (
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
