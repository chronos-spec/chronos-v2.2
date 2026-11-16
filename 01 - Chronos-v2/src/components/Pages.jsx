import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import Etage from './Etage.jsx';
import ChoixLieux from './ChoixLieux.jsx';
import ArbreDeroulant from './ArbreDeroulant.jsx';
import ArbreParente from './ArbreParente.jsx';
import ArbreHumain from './ArbreHumain.jsx';
import ImageWiki from './ImageWiki.jsx';
import { ETAGES, evenementsPage, idAnimal } from '../data/index.js';
import { LIEUX, BORNES_HISTOIRE } from '../data/histoireMonde.js';
import { PERIODES } from '../data/periodes.js';
import { ERES } from '../data/eres.js';
import { BESTIAIRE, GROUPES_ANIMAUX } from '../data/bestiaire.js';
import { GROUPES_VIVANT } from '../data/vivant.js';
import { ESPECES, GROUPES_HUMAINS } from '../data/especes.js';
import { WIKI_ANIMAUX, WIKI_ESPECES } from '../data/wiki.js';
import { lienEtage, lienPeriode } from '../lib/route.js';
import { texteAge, plageAges } from '../lib/ages.js';

// L'étage tel qu'il apparaît sur sa page : l'Histoire y reçoit ses événements « monde »
// et des bornes communes, pour que toutes les lignes de lieux soient à la même échelle.
function versionPage(etage) {
  if (etage.id !== 'histoire') return etage;
  return {
    ...etage,
    categories: etage.categories.map((c) => ({ ...c, evenements: evenementsPage(c), ...(BORNES_HISTOIRE[c.id] || {}) })),
  };
}

// Les lieux choisis (Histoire) : voies et filtre.
function useLieux(cible, parId) {
  // Si la recherche vise un événement d'un autre lieu, on affiche aussi ce lieu.
  const [lieux, setLieux] = useState(() => {
    // Une seule ligne pour tout le monde : au départ, tous les continents sont affichés.
    return LIEUX.map((l) => l.id);
  });
  const voies = useMemo(
    () => LIEUX.filter((l) => lieux.includes(l.id)).map((l) => ({ ...l, filtre: (carte) => carte.lieux?.includes(l.id) })),
    [lieux]
  );
  const filtre = useMemo(() => (e) => !e.lieux || e.lieux.some((l) => lieux.includes(l)), [lieux]);
  return { lieux, setLieux, voies, filtre };
}

function useTitreDocument(titre) {
  // Avant tout le reste : on remonte en haut de la nouvelle page.
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [titre]);
  useEffect(() => {
    document.title = `${titre} · Chronos`;
    requestAnimationFrame(() => document.querySelector('main h1')?.focus({ preventScroll: true }));
    return () => {
      document.title = 'Chronos';
    };
  }, [titre]);
}

function Fil({ elements }) {
  return (
    <nav className="fil" aria-label="Fil d’Ariane">
      <ol>
        {elements.map((e, i) => (
          <li key={i}>{e.lien ? <a href={e.lien}>{e.nom}</a> : <span aria-current="page">{e.nom}</span>}</li>
        ))}
      </ol>
    </nav>
  );
}

// ---------- La page d'un étage ----------
export function PageEtage({ idEtage, communs }) {
  const etageBase = ETAGES.find((e) => e.id === idEtage);
  const etage = useMemo(() => etageBase && versionPage(etageBase), [etageBase]);
  const { lieux, setLieux, voies, filtre } = useLieux(communs.cible, communs.parId);
  // L'arbre du vivant (étage Vie) : l'espèce choisie vient de la frise (animal ouvert) ou de l'arbre.
  const [choixArbre, setChoixArbre] = useState(null);
  const ouvert = communs.carteOuverte?.startsWith('animal-') ? communs.carteOuverte.slice('animal-'.length) : null;
  const idFeuilleArbre = ouvert || choixArbre;
  const choisirDansArbre = (id) => {
    setChoixArbre(id && id.startsWith('v-') ? id : null);
    if (!id || id.startsWith('v-')) {
      if (ouvert) communs.refermer();
    } else if (communs.carteOuverte !== `animal-${id}`) {
      communs.basculer(`animal-${id}`);
    }
  };
  const [especeChoisie, setEspeceChoisie] = useState(null);
  useTitreDocument(etageBase ? etageBase.nom : 'Page introuvable');

  // La recherche peut demander une espèce humaine.
  useEffect(() => {
    if (communs.cible?.type === 'espece' && communs.cible.etage === idEtage) {
      setEspeceChoisie(communs.cible.id);
      setTimeout(() => document.getElementById('arbre-humain')?.scrollIntoView({ block: 'start' }), 60);
    }
  }, [communs.cible, idEtage]);

  if (!etage) return <Introuvable />;
  const i = ETAGES.indexOf(etageBase);
  const histoire = etage.id === 'histoire';

  return (
    <div className="page" data-etage={etage.id}>
      <Fil elements={[{ nom: 'Chronos', lien: `#${etage.id}` }, { nom: etage.nom }]} />
      <Etage
        mode="page"
        arbreSousFrise={etage.id !== 'vie'}
        outils={histoire ? <ChoixLieux choisis={lieux} onChanger={setLieux} /> : null}
        etage={etage}
        numero={i + 1}
        total={ETAGES.length}
        parId={communs.parId}
        carteOuverte={communs.carteOuverte}
        onBasculer={communs.basculer}
        onFermer={communs.fermer}
        onRefermer={communs.refermer}
        onRepere={communs.noterRepere}
        cible={communs.cible}
        voies={null}
        filtre={histoire ? filtre : null}
        lienPeriode={(idCat) => lienPeriode(etage.id, idCat)}
      />

      {etage.id === 'vie' && (
        <div className="page__suite">
          {/* Un seul arbre : l'arbre du vivant, qui sert aussi d'arbre de parenté. */}
          <ArbreParente
            idTitre="titre-arbre-vivant"
            idFeuille={idFeuilleArbre}
            onChoisir={choisirDansArbre}
            onFermer={() => choisirDansArbre(null)}
          />
        </div>
      )}

      {etage.id === 'humains' && (
        <div className="page__suite">
          <ArbreDeroulant
            idTitre="titre-familles-humaines"
            titre="Les familles humaines"
            aide="Touchez une famille pour voir ses espèces."
            noeuds={GROUPES_HUMAINS.map((g) => ({
              id: g.id,
              nom: g.nom,
              texte: g.texte,
              wiki: WIKI_ESPECES[g.especes[0]],
              enfants: g.especes.map((idE) => {
                const e = ESPECES.find((x) => x.id === idE);
                return {
                  id: `e-${e.id}`,
                  nom: `${e.nom} (${e.surnom})`,
                  texte: e.texte,
                  wiki: WIKI_ESPECES[e.id],
                  eteint: e.fin > 0,
                  dates: e.fin ? plageAges(e.debut, e.fin) : `depuis ${texteAge(e.debut)}`,
                };
              }),
            }))}
          />
          <ArbreHumain choisie={especeChoisie} onChoisir={setEspeceChoisie} />
        </div>
      )}

      <NavigationEtages index={i} />
    </div>
  );
}

function NavigationEtages({ index }) {
  const avant = ETAGES[index - 1];
  const apres = ETAGES[index + 1];
  return (
    <nav className="page__navigation" aria-label="Autres étages">
      {avant ? <a href={lienEtage(avant.id)} data-etage={avant.id}><span aria-hidden="true">← </span>{avant.nom}</a> : <span />}
      <a href="#titre-accueil">Retour à l’accueil</a>
      {apres ? <a href={lienEtage(apres.id)} data-etage={apres.id}>{apres.nom}<span aria-hidden="true"> →</span></a> : <span />}
    </nav>
  );
}

// ---------- La page d'une période ----------
export function PagePeriode({ idEtage, idPeriode, communs }) {
  const etageBase = ETAGES.find((e) => e.id === idEtage);
  const etage = useMemo(() => etageBase && versionPage(etageBase), [etageBase]);
  const cat = etage?.categories.find((c) => c.id === idPeriode);
  const etagePeriode = useMemo(() => (etage && cat ? { ...etage, categories: [cat] } : null), [etage, cat]);
  const { lieux, setLieux, voies, filtre } = useLieux(communs.cible, communs.parId);
  useTitreDocument(cat ? cat.nom : 'Page introuvable');
  if (!etagePeriode) return <Introuvable />;

  const fiche = PERIODES[cat.id];
  const ere = cat.ere ? ERES[cat.ere] : null;
  const memeTheme = etage.categories.filter((c) => (c.theme || 'principal') === (cat.theme || 'principal'));
  const k = memeTheme.indexOf(cat);
  const avant = memeTheme[k - 1];
  const apres = memeTheme[k + 1];
  const histoire = etage.id === 'histoire' && cat.theme === 'periodes';
  const animaux = BESTIAIRE[cat.id] || [];
  const evenements = cat.evenements
    .map((id) => communs.parId[id])
    .filter((e) => !histoire || filtre(e))
    .sort((a, b) => (a.ans ?? 0) < (b.ans ?? 0) ? 1 : -1);

  return (
    <div className="page" data-etage={etage.id}>
      <Fil elements={[{ nom: 'Chronos', lien: `#${etage.id}` }, { nom: etage.nom, lien: lienEtage(etage.id) }, { nom: cat.nom }]} />
      {ere && (
        <p className="page__ere" style={{ '--ere': ere.couleur }}>
          {ere.nom} <span className="ere__detail">· {ere.detail}</span>
        </p>
      )}
      <Etage
        mode="page"
        outils={histoire ? <ChoixLieux choisis={lieux} onChanger={setLieux} /> : null}
        sansMenu
        zoomInitial={2}
        titre={{ surTitre: `${etage.nom} · période`, nom: cat.nom, sousTitre: cat.periode || etage.sousTitre }}
        etage={etagePeriode}
        numero={1}
        total={1}
        parId={communs.parId}
        carteOuverte={communs.carteOuverte}
        onBasculer={communs.basculer}
        onFermer={communs.fermer}
        onRefermer={communs.refermer}
        onRepere={communs.noterRepere}
        cible={communs.cible}
        voies={null}
        filtre={histoire ? filtre : null}
      />

      <div className="page__suite">
        {fiche && (
          <section className="periode-fiche" aria-labelledby="titre-fiche-periode">
            <h2 id="titre-fiche-periode" className="page__titre2">En bref</h2>
            {fiche.resume && <p className="periode-fiche__texte">{fiche.resume}</p>}
            {fiche.points?.length > 0 && (
              <ul className="periode-fiche__points">
                {fiche.points.map((p) => <li key={p}>{p}</li>)}
              </ul>
            )}
          </section>
        )}

        {etage.id === 'vie' && <Vivants debut={cat.debut} fin={cat.fin} />}

        {animaux.length > 0 && (
          <section aria-labelledby="titre-bestiaire">
            <h2 id="titre-bestiaire" className="page__titre2">Les animaux du {cat.nom}</h2>
            <ul className="bestiaire-grille">
              {animaux.map((a) => {
                const id = idAnimal(a.id);
                return (
                  <li key={a.id} className="espece-carte">
                    <ImageWiki titre={WIKI_ANIMAUX[a.id]} alt={a.nom} />
                    <p className="espece-carte__nom">{a.nom}</p>
                    <p className="espece-carte__dates">{communs.parId[id]?.dateCourte} · {a.taille}</p>
                    <p className="espece-carte__groupe">{GROUPES_ANIMAUX[a.groupe]}</p>
                    <p className="espece-carte__texte">{a.texte}</p>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        <section aria-labelledby="titre-liste-evenements">
          <h2 id="titre-liste-evenements" className="page__titre2">Tous les événements</h2>
          <ol className="liste-evenements">
            {evenements.map((e) => (
              <li key={e.id}>
                <button type="button" className="liste-evenements__bouton" onClick={() => communs.basculer(e.id)}>
                  <span className="liste-evenements__date">{e.dateCourte}</span>
                  <span className="liste-evenements__titre">{e.titre}</span>
                  {(e.resume || e.texte) && <span className="liste-evenements__resume">{e.resume || e.texte[0]}</span>}
                </button>
              </li>
            ))}
          </ol>
        </section>

        <nav className="page__navigation" aria-label="Autres périodes">
          {avant ? <a href={lienPeriode(etage.id, avant.id)}><span aria-hidden="true">← </span>{avant.nom}</a> : <span />}
          <a href={lienEtage(etage.id)}>Tout l’étage {etage.nom}</a>
          {apres ? <a href={lienPeriode(etage.id, apres.id)}>{apres.nom}<span aria-hidden="true"> →</span></a> : <span />}
        </nav>
      </div>
    </div>
  );
}

function Vivants({ debut, fin }) {
  if (debut === undefined) return null;
  const vivants = GROUPES_VIVANT.filter((g) => g.depuis > fin && g.jusqua < debut);
  const nouveaux = vivants.filter((g) => g.depuis <= debut);
  const derniers = vivants.filter((g) => g.jusqua > 0 && g.jusqua >= fin);
  return (
    <section aria-labelledby="titre-vivants">
      <h2 id="titre-vivants" className="page__titre2">Les grands groupes du vivant</h2>
      <ul className="vivants__liste vivants__liste--page">
        {vivants.map((g) => (
          <li key={g.id} className={nouveaux.includes(g) ? 'vivants__groupe vivants__groupe--nouveau' : derniers.includes(g) ? 'vivants__groupe vivants__groupe--fin' : 'vivants__groupe'}>
            {g.nom}
            {nouveaux.includes(g) && <span className="vivants__mention"> · apparaissent</span>}
            {derniers.includes(g) && <span className="vivants__mention vivants__mention--fin"> · disparaissent</span>}
          </li>
        ))}
      </ul>
    </section>
  );
}

function Introuvable() {
  return (
    <div className="page">
      <h1 className="etage__titre" tabIndex={-1}>Page introuvable</h1>
      <p><a href="#titre-accueil">Revenir à l’accueil</a></p>
    </div>
  );
}
