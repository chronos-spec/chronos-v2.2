import { useEffect, useMemo, useRef, useState } from 'react';
import { BESTIAIRE } from '../data/bestiaire.js';
import { GROUPES, GROUPE_PAR_ID, ENFANTS, PLACE_ANIMAL, REPERES, chemin, ancetreCommun } from '../data/phylogenie.js';
import { texteAge } from '../lib/ages.js';

// Tous les animaux du bestiaire, à plat, avec leur période.
const ANIMAUX = Object.entries(BESTIAIRE).flatMap(([periode, liste]) => liste.map((a) => ({ ...a, periode })));

// Ce qu'on range sous chaque groupe : animaux du bestiaire, puis repères vivants.
const FEUILLES = {};
ANIMAUX.forEach((a) => {
  const g = PLACE_ANIMAL[a.id];
  if (g) (FEUILLES[g] ||= []).push({ id: a.id, nom: a.nom, eteint: true, texte: a.texte });
});
REPERES.forEach((r) => (FEUILLES[r.place] ||= []).push({ id: r.id, nom: r.nom, vivant: true, texte: r.texte }));

// Ce qu'on peut choisir pour comparer : quelques grands groupes, les repères, puis les animaux.
const GROUPES_COMPARABLES = ['dinosaures', 'oiseaux', 'pterosaures', 'mammiferes', 'synapsides', 'archosaures', 'vertebres'].filter((id) => GROUPE_PAR_ID[id]);
const RACCOURCIS = [
  { valeur: 'g:dinosaures', libelle: 'les dinosaures' },
  { valeur: 'r:humain', libelle: 'nous, les humains' },
  { valeur: 'r:poule', libelle: 'la poule' },
];

// Où se trouve un élément choisi (« g:… » groupe, « r:… » repère, « a:… » animal) ?
function placeDe(valeur) {
  if (!valeur) return null;
  const [type, id] = valeur.split(':');
  if (type === 'g') return { groupe: id, nom: GROUPE_PAR_ID[id].nom, estGroupe: true };
  if (type === 'r') {
    const r = REPERES.find((x) => x.id === id);
    return { groupe: r.place, nom: r.nom, feuille: id };
  }
  const a = ANIMAUX.find((x) => x.id === id);
  return { groupe: PLACE_ANIMAL[id], nom: a.nom, feuille: id };
}

// L'arbre de parenté d'un animal du bestiaire : il se déroule sous la frise.
export default function ArbreParente({ idAnimal: idA, onFermer }) {
  const animal = ANIMAUX.find((a) => a.id === idA);
  const groupe = PLACE_ANIMAL[idA];
  const [comparer, setComparer] = useState('');
  const [ouvertsEnPlus, setOuvertsEnPlus] = useState(() => new Set());
  const titre = useRef(null);

  // Nouvel animal : on repart de zéro et on amène l'arbre à l'écran.
  useEffect(() => {
    setComparer('');
    setOuvertsEnPlus(new Set());
    const doux = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    titre.current?.scrollIntoView({ behavior: doux ? 'smooth' : 'auto', block: 'nearest' });
  }, [idA]);

  const autre = placeDe(comparer);
  const cheminA = useMemo(() => (groupe ? chemin(groupe) : []), [groupe]);
  const cheminB = useMemo(() => (autre ? chemin(autre.groupe) : []), [autre]);
  const commun = autre ? ancetreCommun(groupe, autre.groupe) : null;
  // Les groupes ouverts : les deux chemins, plus ceux que l'on ouvre à la main.
  const ouverts = useMemo(() => new Set([...cheminA, ...cheminB, ...ouvertsEnPlus]), [cheminA, cheminB, ouvertsEnPlus]);

  if (!animal || !groupe) return null;

  const basculer = (id) =>
    setOuvertsEnPlus((o) => {
      const n = new Set(o);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  const ctx = {
    ouverts,
    basculer,
    surCheminA: new Set(cheminA),
    surCheminB: new Set(cheminB),
    commun,
    feuilleA: idA,
    feuilleB: autre?.feuille,
  };

  return (
    <section className="parente" aria-labelledby="titre-parente">
      <div className="parente__tete">
        <div>
          <p className="parente__sur-titre">Arbre de parenté</p>
          <h2 id="titre-parente" ref={titre} tabIndex={-1} className="parente__titre">
            D’où vient {animal.nom} ?
          </h2>
          <p className="parente__chemin">
            {cheminA.map((id, i) => (
              <span key={id}>
                {i > 0 && <span aria-hidden="true"> › </span>}
                {GROUPE_PAR_ID[id].nom}
              </span>
            ))}
          </p>
        </div>
        <button type="button" className="parente__fermer" onClick={onFermer} aria-label="Fermer l’arbre de parenté">
          <span aria-hidden="true">×</span>
        </button>
      </div>

      <div className="parente__comparer">
        <label htmlFor="parente-choix">Comparer avec</label>
        <select id="parente-choix" value={comparer} onChange={(e) => setComparer(e.target.value)}>
          <option value="">— choisir —</option>
          <optgroup label="Grands groupes">
            {GROUPES_COMPARABLES.map((id) => <option key={id} value={`g:${id}`}>{GROUPE_PAR_ID[id].nom}</option>)}
          </optgroup>
          <optgroup label="Animaux d’aujourd’hui">
            {REPERES.map((r) => <option key={r.id} value={`r:${r.id}`}>{r.nom}</option>)}
          </optgroup>
          <optgroup label="Animaux disparus">
            {ANIMAUX.filter((a) => a.id !== idA && PLACE_ANIMAL[a.id]).map((a) => <option key={a.id} value={`a:${a.id}`}>{a.nom}</option>)}
          </optgroup>
        </select>
        <span className="parente__raccourcis">
          {RACCOURCIS.map((r) => (
            <button key={r.valeur} type="button" aria-pressed={comparer === r.valeur} onClick={() => setComparer(comparer === r.valeur ? '' : r.valeur)}>
              {r.libelle}
            </button>
          ))}
        </span>
      </div>

      {autre && commun && <Verdict animal={animal} groupe={groupe} autre={autre} commun={commun} />}

      <ul className="parente__arbre" role="tree" aria-label={`Arbre de parenté de ${animal.nom}`}>
        <Noeud id="animaux" ctx={ctx} niveau={1} />
      </ul>

      <p className="parente__legende">
        <span className="parente__marque parente__marque--a" aria-hidden="true" /> {animal.nom}
        {autre && (
          <>
            {'  '}<span className="parente__marque parente__marque--b" aria-hidden="true" /> {autre.nom}
            {'  '}<span className="parente__marque parente__marque--commun" aria-hidden="true" /> ancêtre commun
          </>
        )}
        {'  '}<span aria-hidden="true">✝</span> = groupe entièrement disparu · <span aria-hidden="true">?</span> = place encore débattue · dates : premières traces connues, arrondies.
      </p>
    </section>
  );
}

// La phrase qui répond à la question : « est-il un dinosaure ? quel ancêtre commun ? »
function Verdict({ animal, groupe, autre, commun }) {
  const g = GROUPE_PAR_ID[commun];
  const dansLeGroupe = autre.estGroupe && chemin(groupe).includes(autre.groupe);
  return (
    <p className="parente__verdict" role="status">
      {autre.estGroupe && (
        <strong>
          {animal.nom} {dansLeGroupe ? 'fait partie des' : 'ne fait pas partie des'} {autre.nom.toLowerCase()}.{' '}
        </strong>
      )}
      {!dansLeGroupe && (
        <>
          Ancêtre commun avec {autre.estGroupe ? `les ${autre.nom.toLowerCase()}` : autre.nom.replace(/^Le |^La |^L’|^Les /, (m) => m.toLowerCase())} :{' '}
          <strong>{g.nom}</strong>, il y a environ {texteAge(g.depuis)}.
        </>
      )}
    </p>
  );
}

function Noeud({ id, ctx, niveau }) {
  const g = GROUPE_PAR_ID[id];
  const enfants = ENFANTS[id] || [];
  const feuilles = FEUILLES[id] || [];
  const ouvert = ctx.ouverts.has(id);
  const nb = enfants.length + feuilles.length;
  const classes = ['parente__noeud'];
  if (g.eteint) classes.push('parente__noeud--eteint');
  if (ctx.surCheminA.has(id)) classes.push('parente__noeud--a');
  if (ctx.surCheminB.has(id)) classes.push('parente__noeud--b');
  if (ctx.commun === id) classes.push('parente__noeud--commun');

  return (
    <li role="treeitem" aria-expanded={nb ? ouvert : undefined} aria-level={niveau} className={classes.join(' ')}>
      <button type="button" className="parente__groupe" onClick={() => nb && ctx.basculer(id)} disabled={!nb}>
        <span className="parente__chevron" aria-hidden="true">{nb ? (ouvert ? '▾' : '▸') : '•'}</span>
        <span className="parente__nom">
          {g.nom}
          {g.eteint && <span className="parente__eteint" title="Groupe disparu"> ✝<span className="sr-only"> disparu</span></span>}
          {g.debat && <span className="parente__debat" title="Place encore débattue"> ?<span className="sr-only"> place débattue</span></span>}
          {ctx.commun === id && <span className="parente__badge">ancêtre commun</span>}
        </span>
        <span className="parente__date">{texteAge(g.depuis)}</span>
        <span className="parente__texte">{g.texte}</span>
      </button>
      {ouvert && nb > 0 && (
        <ul role="group">
          {feuilles.map((f) => {
            const c = ['parente__feuille'];
            if (f.id === ctx.feuilleA) c.push('parente__feuille--a');
            if (f.id === ctx.feuilleB) c.push('parente__feuille--b');
            if (f.vivant) c.push('parente__feuille--vivant');
            return (
              <li key={f.id} role="treeitem" aria-level={niveau + 1} className={c.join(' ')} aria-current={f.id === ctx.feuilleA ? 'true' : undefined}>
                <span className="parente__feuille-nom">{f.nom}</span>
                {f.vivant && <span className="parente__vivant"> · vivant aujourd’hui</span>}
              </li>
            );
          })}
          {enfants.map((e) => <Noeud key={e} id={e} ctx={ctx} niveau={niveau + 1} />)}
        </ul>
      )}
    </li>
  );
}

// (export utile pour d'autres pages plus tard)
export { GROUPES };
