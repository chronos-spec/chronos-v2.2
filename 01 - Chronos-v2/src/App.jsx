import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ETAGES, PAR_ID } from './data/index.js';
import Ciel from './components/Ciel.jsx';
import Entete from './components/Entete.jsx';
import Etage from './components/Etage.jsx';
import AnneeCosmique from './components/AnneeCosmique.jsx';
import { construireIndex } from './lib/recherche.js';

export default function App() {
  const [etageActif, setEtageActif] = useState(null); // null = écran d'accueil
  const [carteOuverte, setCarteOuverte] = useState(null); // id de la seule carte ouverte

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
  }, []);

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
  const aller = useCallback((r) => {
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

  return (
    <div className="app" data-etage={etageActif || 'univers'}>
      <a className="lien-evitement" href="#univers">Aller à la frise</a>
      <Ciel />
      <Entete etages={ETAGES} etageActif={etageActif} index={index} onAller={aller} />

      <main>
        <section className="accueil" data-section="accueil" aria-labelledby="titre-accueil">
          <p className="accueil__sur-titre">Une frise de toute l'histoire</p>
          <h1 id="titre-accueil" className="accueil__titre">Chronos</h1>
          <p className="accueil__texte">
            Du Big Bang à aujourd'hui, en six étages.
            <br />
            Une étape à la fois.
          </p>
          <a className="bouton-principal" href="#univers">Commencer</a>
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

      <AnneeCosmique ans={etageActif ? reperes[etageActif] ?? null : 13.8e9} />
    </div>
  );
}
