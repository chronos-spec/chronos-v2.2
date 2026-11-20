import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ETAGES, PAR_ID } from './data/index.js';
import Ciel from './components/Ciel.jsx';
import Entete from './components/Entete.jsx';
import Etage from './components/Etage.jsx';
import AnneeCosmique from './components/AnneeCosmique.jsx';
import { construireIndex } from './lib/recherche.js';
import { useRoute, lienEtage, allerVers } from './lib/route.js';
import { xPourAns } from './lib/echelle.js';
import { PageEtage, PagePeriode } from './components/Pages.jsx';
import Spirale from './components/Spirale.jsx';
import VueEnsemble from './components/VueEnsemble.jsx';
import LigneInfinie from './components/LigneInfinie.jsx';
import Recit from './components/Recit.jsx';
import MentionsLegales from './components/MentionsLegales.jsx';
import { demanderArbre } from './lib/arbreCible.js';

// Quel étage pour une époque donnée ? (quand on fait glisser le point de l'année cosmique)
function etagePourAns(ans) {
  if (ans > 4.6e9) return 'univers';
  if (ans > 4.0e9) return 'terre';
  if (ans > 7e6) return 'vie';
  if (ans > 5300) return 'humains';
  if (ans > 81) return 'histoire';
  return 'aujourdhui';
}

export default function App() {
  const route = useRoute();
  const accueil = route.page === 'accueil';
  const [etageVu, setEtageActif] = useState(null); // null = écran d'accueil
  const spirale = route.page === 'etage' && route.etage === 'spirale';
  const [etageSpirale, setEtageSpirale] = useState('univers');
  const pageSpeciale = !accueil && ['ensemble', 'recit', 'mentions-legales'].includes(route.etage);
  const etageActif = accueil ? etageVu : spirale ? etageSpirale : pageSpeciale ? (route.etage === 'ensemble' ? route.periode || null : null) : route.etage;
  const [carteOuverte, setCarteOuverte] = useState(null); // id de la seule carte ouverte
  // Accueil : tout replier pour ne voir que les titres des six étages.
  const [replie, setReplie] = useState(false);

  // Changer de page ferme la carte ; en revenant à l'accueil, on retrouve l'étage d'où l'on vient.
  const carteApresNavigation = useRef(null);
  useEffect(() => {
    setCarteOuverte(carteApresNavigation.current);
    carteApresNavigation.current = null;
    if (accueil) {
      document.title = 'Chronos';
      if (route.ancre) requestAnimationFrame(() => document.getElementById(route.ancre)?.scrollIntoView({ block: 'start' }));
    }
  }, [route.page, route.etage, route.periode, accueil, route.ancre]);

  // Quel étage est à l'écran ? (on observe chaque section)
  useEffect(() => {
    const sections = document.querySelectorAll('[data-section]');
    const observateur = new IntersectionObserver(
      (entrees) => {
        entrees.forEach((e) => {
          if (e.isIntersecting) {
            const id = e.target.getAttribute('data-section');
            setEtageActif(id === 'accueil' ? null : id);
          }
        });
      },
      { rootMargin: '-45% 0px -45% 0px' }
    );
    sections.forEach((s) => observateur.observe(s));
    return () => observateur.disconnect();
  }, [accueil]);

  // Si on change d'étage, la carte d'un autre étage se ferme.
  // (Sauf pendant un saut demandé par la recherche : on traverse alors d'autres étages.)
  const etageVise = useRef(null);
  useEffect(() => {
    if (etageVise.current) {
      if (etageVise.current === etageActif) etageVise.current = null;
      return;
    }
    setCarteOuverte((id) => (id && PAR_ID[id] && PAR_ID[id].etage !== etageActif ? null : id));
  }, [etageActif]);

  // La recherche : on va à l'étage, on fait glisser sa ligne, on ouvre la carte.
  const index = useMemo(() => construireIndex(ETAGES, PAR_ID), []);
  const [cible, setCible] = useState(null);
  const etageActifRef = useRef(etageActif);
  etageActifRef.current = etageActif;
  const routeRef = useRef(route);
  routeRef.current = route;
  const aller = useCallback((r) => {
    const rt = routeRef.current;
    // Une espèce ou un groupe de l'arbre du vivant : on ouvre la page Vie, sur l'arbre.
    if (r.arbre) {
      demanderArbre(r.arbre);
      if (!(rt.page === 'etage' && rt.etage === 'vie')) allerVers(lienEtage('vie'));
      return;
    }
    const fiche = r.carte ? PAR_ID[r.carte] : null;
    const surUnePage = rt.page !== 'accueil';
    // Ce qui n'existe que sur la page d'un étage (Histoire du monde, espèces humaines),
    // ou une recherche faite depuis une page : on va sur la page de l'étage.
    if (surUnePage || (fiche && fiche.surAccueil === false) || r.type === 'Espèce humaine') {
      setCible({ ...r.cible, etage: r.etage, n: Date.now() });
      if (rt.page === 'etage' && rt.etage === r.etage) setCarteOuverte(r.carte || null);
      else {
        carteApresNavigation.current = r.carte || null;
        allerVers(lienEtage(r.etage));
      }
      return;
    }
    if (r.etage !== etageActifRef.current) etageVise.current = r.etage;
    const section = document.getElementById(r.etage);
    const doux = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (r.type === 'Espèce humaine') {
      document.getElementById('arbre-humain')?.scrollIntoView({ behavior: doux ? 'smooth' : 'auto', block: 'start' });
    } else {
      section?.scrollIntoView({ behavior: doux ? 'smooth' : 'auto', block: 'start' });
    }
    setCarteOuverte(r.carte || null);
    setCible({ ...r.cible, etage: r.etage, n: Date.now() });
    // Une carte ouverte reçoit le focus d'elle-même ; sinon on le pose sur le titre de l'étage.
    if (!r.carte && r.type !== 'Espèce humaine') {
      setTimeout(() => document.getElementById(`titre-${r.etage}`)?.focus({ preventScroll: true }), 50);
    }
  }, []);

  // Faire glisser le point de l'année cosmique : on voyage jusqu'à l'époque choisie.
  const voyager = useCallback((ans) => {
    const rt = routeRef.current;
    const idEtage = rt.page === 'accueil' ? etagePourAns(ans) : rt.etage;
    if (rt.page === 'accueil' && idEtage !== etageActifRef.current) {
      etageVise.current = idEtage;
      document.getElementById(idEtage)?.scrollIntoView({ block: 'start' });
    }
    setCible({ type: 'x', ans, x: (ligne) => xPourAns(ligne, ans), etage: idEtage, instant: true, n: Date.now() });
  }, []);

  const fermer = useCallback(() => {
    setCarteOuverte((id) => {
      if (id) {
        // On rend le focus au point qui avait ouvert la carte.
        requestAnimationFrame(() => document.getElementById(`point-${id}`)?.focus());
      }
      return null;
    });
  }, []);

  const basculer = useCallback((id) => {
    setCarteOuverte((actuelle) => (actuelle === id ? null : id));
  }, []);

  // L'époque regardée dans chaque étage (pour l'année cosmique, à droite).
  const [reperes, setReperes] = useState({});
  const noterRepere = useCallback((idEtage, ans) => {
    if (ans === null || ans === undefined) return; // récit biblique : on garde la dernière date
    setReperes((r) => (r[idEtage] === ans ? r : { ...r, [idEtage]: ans }));
  }, []);
  const refermer = useCallback(() => setCarteOuverte(null), []);

  // Échap ferme la carte.
  const fermerRef = useRef(fermer);
  fermerRef.current = fermer;
  useEffect(() => {
    const touche = (e) => {
      if (e.key === 'Escape') fermerRef.current();
    };
    document.addEventListener('keydown', touche);
    return () => document.removeEventListener('keydown', touche);
  }, []);

  // La spirale dit quel étage on regarde (couleur du ciel, année cosmique).
  const suivreSpirale = useCallback((idEtage, ans) => {
    setEtageSpirale((e) => (e === idEtage ? e : idEtage));
    noterRepere(idEtage, ans);
  }, [noterRepere]);

  const communs = { parId: PAR_ID, carteOuverte, basculer, fermer, refermer, noterRepere, cible };

  return (
    <div className="app" data-etage={etageActif || 'univers'}>
      <a className="lien-evitement" href={accueil ? '#univers' : '#contenu'}>{accueil ? 'Aller à la frise' : 'Aller au contenu'}</a>
      <Ciel />
      <Entete etages={ETAGES} etageActif={etageActif} index={index} onAller={aller} accueil={accueil} />

      {accueil ? (
        <main className={replie ? 'accueil-replie' : undefined}>
          <section className="accueil" data-section="accueil" aria-labelledby="titre-accueil">
            <p className="accueil__sur-titre">Une frise de toute l'histoire</p>
            <h1 id="titre-accueil" className="accueil__titre">Chronos</h1>
            <p className="accueil__texte">
              Du Big Bang à aujourd'hui, en six étages.
              <br />
              Une étape à la fois.
            </p>
            <div className="accueil__actions">
              <a className="bouton-principal" href="#univers">Commencer</a>
              <button
                type="button"
                className="verre bouton-secondaire"
                aria-pressed={replie}
                onClick={() => { setReplie((r) => !r); setCarteOuverte(null); }}
              >
                {replie ? 'Tout déplier' : 'Tout replier'}
              </button>
            </div>
          </section>

          {ETAGES.map((etage, i) => (
            <Etage
              key={etage.id}
              etage={etage}
              numero={i + 1}
              total={ETAGES.length}
              suivant={ETAGES[i + 1]}
              parId={PAR_ID}
              carteOuverte={carteOuverte}
              onBasculer={basculer}
              onFermer={fermer}
              onRefermer={refermer}
              onRepere={noterRepere}
              cible={cible}
            />
          ))}
        </main>
      ) : (
        <main id="contenu">
          {route.etage === 'ensemble' && route.page !== 'periode' ? (
            <LigneInfinie parId={PAR_ID} carteOuverte={carteOuverte} onBasculer={basculer} onFermer={fermer} />
          ) : route.etage === 'ensemble' ? (
            <VueEnsemble focus={route.periode} />
          ) : route.etage === 'recit' ? (
            <Recit />
          ) : route.etage === 'mentions-legales' ? (
            <MentionsLegales />
          ) : spirale ? (
            <Spirale
              parId={PAR_ID}
              carteOuverte={carteOuverte}
              onBasculer={basculer}
              onFermer={fermer}
              onEtage={suivreSpirale}
            />
          ) : route.page === 'etage' ? (
            <PageEtage key={route.etage} idEtage={route.etage} communs={communs} />
          ) : (
            <PagePeriode key={`${route.etage}/${route.periode}`} idEtage={route.etage} idPeriode={route.periode} communs={communs} />
          )}
        </main>
      )}

      {/* Pied de page présent partout (sauf sur le récit, plein écran) : mentions obligatoires. */}
      {!(pageSpeciale && route.etage === 'recit') && (
        <footer className="pied">
          <p>Chronos · site personnel et gratuit · images : Wikipédia / Wikimedia Commons (licences libres)</p>
          <a href="#/mentions-legales">Mentions légales, confidentialité et crédits</a>
        </footer>
      )}

      {!pageSpeciale && <AnneeCosmique ans={etageActif ? reperes[etageActif] ?? null : 13.8e9} onGlisser={voyager} />}
    </div>
  );
}
