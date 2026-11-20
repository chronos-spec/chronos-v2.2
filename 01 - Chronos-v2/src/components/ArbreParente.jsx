import { useEffect, useMemo, useRef, useState } from 'react';
import { BESTIAIRE } from '../data/bestiaire.js';
import { WIKI_ANIMAUX } from '../data/wiki.js';
import { GROUPE_PAR_ID, ENFANTS, construireFeuilles, chemin, ancetreCommun } from '../data/phylogenie.js';
import { texteAge } from '../lib/ages.js';
import ImageWiki from './ImageWiki.jsx';

// L'arbre du vivant et l'arbre de parenté, réunis en un seul.
// - Sans espèce choisie : on explore librement (on ouvre les groupes, on touche une espèce).
// - Avec une espèce choisie : son chemin depuis « Le vivant » s'ouvre ; on peut la comparer
//   à une autre espèce ou à un groupe, et voir leur ancêtre commun.

const FEUILLES = construireFeuilles(BESTIAIRE, WIKI_ANIMAUX);
const FEUILLE_PAR_ID = Object.fromEntries(FEUILLES.map((f) => [f.id, f]));
const FEUILLES_PAR_GROUPE = FEUILLES.reduce((acc, f) => {
  (acc[f.groupe] ||= []).push(f);
  return acc;
}, {});

const GROUPES_COMPARABLES = ['dinosaures', 'oiseaux', 'pterosaures', 'mammiferes', 'synapsides', 'archosaures', 'vertebres', 'v-plantes']
  .filter((id) => GROUPE_PAR_ID[id]);
const RACCOURCIS = [
  { valeur: 'g:dinosaures', libelle: 'les dinosaures' },
  { valeur: 'f:v-humain', libelle: 'nous, les humains' },
  { valeur: 'f:v-moineau', libelle: 'un oiseau' },
];
const OUVERTS_DEPART = ['vivant', 'eucaryotes'];

// Où se trouve un élément choisi pour comparer (« g:… » groupe, « f:… » espèce) ?
function placeDe(valeur) {
  if (!valeur) return null;
  const [type, id] = valeur.split(':');
  if (type === 'g') return { groupe: id, nom: GROUPE_PAR_ID[id].nom, estGroupe: true };
  const f = FEUILLE_PAR_ID[id];
  return f ? { groupe: f.groupe, nom: f.nom, feuille: id } : null;
}

// Est-ce une espèce connue de l'arbre ? (sert à la frise pour savoir si elle peut ouvrir l'arbre)
export const estDansArbre = (id) => !!FEUILLE_PAR_ID[id];

export default function ArbreParente({ idFeuille: idControle, onChoisir, onFermer, idTitre = 'titre-parente', groupeVise = null }) {
  // L'espèce choisie : donnée par la page (clic sur la frise) ou choisie dans l'arbre.
  const [idLocal, setIdLocal] = useState(null);
  const idF = idControle !== undefined ? idControle : idLocal;
  const choisir = (id) => (onChoisir ? onChoisir(id) : setIdLocal(id));
  const feuille = idF ? FEUILLE_PAR_ID[idF] : null;
  const groupe = feuille?.groupe;

  const [comparer, setComparer] = useState('');
  const [ouvertsEnPlus, setOuvertsEnPlus] = useState(() => new Set(OUVERTS_DEPART));
  const [fermes, setFermes] = useState(() => new Set());
  const titre = useRef(null);
  const premier = useRef(true);

  // Nouvelle espèce : on efface la comparaison et on amène l'arbre à l'écran.
  useEffect(() => {
    setComparer('');
    setFermes(new Set());
    if (premier.current && !idF) {
      premier.current = false;
      return;
    }
    premier.current = false;
    if (!idF) return;
    const doux = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    titre.current?.scrollIntoView({ behavior: doux ? 'smooth' : 'auto', block: 'start' });
  }, [idF]);

  // Un groupe demandé par la recherche : on ouvre tout son chemin et on l'amène à l'écran.
  useEffect(() => {
    if (!groupeVise) return;
    setFermes(new Set());
    setOuvertsEnPlus((o) => new Set([...o, ...chemin(groupeVise.id)]));
    const t = setTimeout(() => {
      const el = document.getElementById(`groupe-${groupeVise.id}`);
      const doux = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      el?.scrollIntoView({ behavior: doux ? 'smooth' : 'auto', block: 'center' });
      el?.focus({ preventScroll: true });
    }, 150);
    return () => clearTimeout(t);
  }, [groupeVise]);

  const autre = placeDe(comparer);
  const cheminA = useMemo(() => (groupe ? chemin(groupe) : []), [groupe]);
  const cheminB = useMemo(() => (autre ? chemin(autre.groupe) : []), [autre]);
  const commun = groupe && autre ? ancetreCommun(groupe, autre.groupe) : null;
  // Ouverts : les deux chemins et ceux ouverts à la main, sauf ceux refermés à la main.
  const ouverts = useMemo(() => {
    const o = new Set([...cheminA, ...cheminB, ...ouvertsEnPlus]);
    fermes.forEach((id) => o.delete(id));
    return o;
  }, [cheminA, cheminB, ouvertsEnPlus, fermes]);

  const basculer = (id) => {
    if (ouverts.has(id)) {
      setFermes((f) => new Set(f).add(id));
      setOuvertsEnPlus((o) => {
        const n = new Set(o);
        n.delete(id);
        return n;
      });
    } else {
      setFermes((f) => {
        const n = new Set(f);
        n.delete(id);
        return n;
      });
      setOuvertsEnPlus((o) => new Set(o).add(id));
    }
  };
  const toutReplier = () => {
    setOuvertsEnPlus(new Set(OUVERTS_DEPART));
    setFermes(new Set(feuille ? cheminA.filter((id) => !OUVERTS_DEPART.includes(id)) : []));
    setComparer('');
  };

  const ctx = {
    ouverts,
    basculer,
    choisir,
    surCheminA: new Set(cheminA),
    surCheminB: new Set(cheminB),
    commun,
    feuilleA: idF,
    feuilleB: autre?.feuille,
  };

  return (
    <section className="parente" aria-labelledby={idTitre}>
      <div className="parente__tete">
        <div>
          <p className="parente__sur-titre">L’arbre du vivant</p>
          <h2 id={idTitre} ref={titre} tabIndex={-1} className="parente__titre">
            {feuille ? `D’où vient ${feuille.nom} ?` : 'Qui est parent de qui ?'}
          </h2>
          <p className="parente__chemin">
            {feuille
              ? cheminA.map((id, i) => (
                  <span key={id}>
                    {i > 0 && <span aria-hidden="true"> › </span>}
                    {GROUPE_PAR_ID[id].nom}
                  </span>
                ))
              : 'Ouvrez un groupe pour voir ses sous-groupes. Touchez une espèce pour voir d’où elle vient et la comparer à une autre.'}
          </p>
        </div>
        <div className="parente__actions">
          <button type="button" className="parente__petit" onClick={toutReplier}>Tout replier</button>
          {feuille && (
            <button type="button" className="parente__fermer" onClick={() => (onFermer ? onFermer() : choisir(null))} aria-label="Effacer l’espèce choisie">
              <span aria-hidden="true">×</span>
            </button>
          )}
        </div>
      </div>

      {feuille && (
        <div className="parente__fiche">
          <ImageWiki titre={feuille.wiki} alt={feuille.nom} taille="moyenne" />
          <div>
            <p className="parente__fiche-nom">
              {feuille.nom}
              <span className="parente__statut">{feuille.eteint ? ' · disparu' : ' · vivant aujourd’hui'}</span>
            </p>
            <p className="parente__fiche-texte">{feuille.texte}</p>
          </div>
        </div>
      )}

      {feuille && (
        <div className="parente__comparer">
          <label htmlFor={`${idTitre}-choix`}>Comparer avec</label>
          <select id={`${idTitre}-choix`} value={comparer} onChange={(e) => setComparer(e.target.value)}>
            <option value="">— choisir —</option>
            <optgroup label="Grands groupes">
              {GROUPES_COMPARABLES.map((id) => <option key={id} value={`g:${id}`}>{GROUPE_PAR_ID[id].nom}</option>)}
            </optgroup>
            <optgroup label="Espèces d’aujourd’hui">
              {FEUILLES.filter((f) => f.vivant && f.id !== idF).map((f) => <option key={f.id} value={`f:${f.id}`}>{f.nom}</option>)}
            </optgroup>
            <optgroup label="Espèces disparues">
              {FEUILLES.filter((f) => !f.vivant && f.id !== idF).map((f) => <option key={f.id} value={`f:${f.id}`}>{f.nom}</option>)}
            </optgroup>
          </select>
          <span className="parente__raccourcis">
            {RACCOURCIS.filter((r) => r.valeur !== `f:${idF}`).map((r) => (
              <button key={r.valeur} type="button" aria-pressed={comparer === r.valeur} onClick={() => setComparer(comparer === r.valeur ? '' : r.valeur)}>
                {r.libelle}
              </button>
            ))}
          </span>
        </div>
      )}

      {feuille && autre && commun && <Verdict feuille={feuille} groupe={groupe} autre={autre} commun={commun} />}

      <ul className="parente__arbre" role="tree" aria-label="L’arbre du vivant">
        <Noeud id="vivant" ctx={ctx} niveau={1} />
      </ul>

      <p className="parente__legende">
        {feuille && (
          <>
            <span className="parente__marque parente__marque--a" aria-hidden="true" /> {feuille.nom}
            {'   '}
          </>
        )}
        {autre && (
          <>
            <span className="parente__marque parente__marque--b" aria-hidden="true" /> {autre.nom}
            {'   '}
            <span className="parente__marque parente__marque--commun" aria-hidden="true" /> ancêtre commun
            {'   '}
          </>
        )}
        <span aria-hidden="true">✝</span> = groupe entièrement disparu · <span aria-hidden="true">?</span> = place encore débattue · dates : premières traces connues, arrondies.
        {'\n'}Images : Wikipédia et Wikimedia Commons (licences libres).
      </p>
    </section>
  );
}

// La phrase qui répond à la question : « est-il un dinosaure ? quel ancêtre commun ? »
function Verdict({ feuille, groupe, autre, commun }) {
  const g = GROUPE_PAR_ID[commun];
  const dansLeGroupe = autre.estGroupe && chemin(groupe).includes(autre.groupe);
  const nomAutre = autre.estGroupe ? `les ${autre.nom.toLowerCase()}` : autre.nom;
  return (
    <p className="parente__verdict" role="status">
      {autre.estGroupe && (
        <strong>
          {feuille.nom} {dansLeGroupe ? 'fait partie des' : 'ne fait pas partie des'} {autre.nom.toLowerCase()}.{' '}
        </strong>
      )}
      {!dansLeGroupe && (
        <>
          Ancêtre commun avec {nomAutre} : <strong>{g.nom}</strong>
          {g.depuis ? `, il y a environ ${texteAge(g.depuis)}` : ''}.
        </>
      )}
    </p>
  );
}

function Noeud({ id, ctx, niveau }) {
  const g = GROUPE_PAR_ID[id];
  const enfants = ENFANTS[id] || [];
  const feuilles = FEUILLES_PAR_GROUPE[id] || [];
  const ouvert = ctx.ouverts.has(id);
  const nb = enfants.length + feuilles.length;
  const classes = ['parente__noeud'];
  if (g.eteint) classes.push('parente__noeud--eteint');
  if (ctx.surCheminA.has(id)) classes.push('parente__noeud--a');
  if (ctx.surCheminB.has(id)) classes.push('parente__noeud--b');
  if (ctx.commun === id) classes.push('parente__noeud--commun');

  return (
    <li role="treeitem" aria-expanded={nb ? ouvert : undefined} aria-level={niveau} className={classes.join(' ')}>
      <button type="button" id={`groupe-${id}`} className="parente__groupe" onClick={() => nb && ctx.basculer(id)} disabled={!nb}>
        <span className="parente__chevron" aria-hidden="true">{nb ? (ouvert ? '▾' : '▸') : '•'}</span>
        <span className="parente__nom">
          {g.nom}
          {g.eteint && <span className="parente__eteint" title="Groupe disparu"> ✝<span className="sr-only"> disparu</span></span>}
          {g.debat && <span className="parente__debat" title="Place encore débattue"> ?<span className="sr-only"> place débattue</span></span>}
          {ctx.commun === id && <span className="parente__badge">ancêtre commun</span>}
          {!ouvert && nb > 0 && <span className="parente__nombre"> · {nb}</span>}
        </span>
        {g.depuis ? <span className="parente__date">{texteAge(g.depuis)}</span> : <span />}
        <span className="parente__texte">{g.texte}</span>
      </button>
      {ouvert && nb > 0 && (
        <ul role="group">
          {feuilles.length > 0 && (
            <li className="parente__feuilles" role="none">
              {feuilles.map((f) => {
                const c = ['parente__feuille'];
                if (f.eteint) c.push('parente__feuille--eteinte');
                if (f.id === ctx.feuilleA) c.push('parente__feuille--a');
                if (f.id === ctx.feuilleB) c.push('parente__feuille--b');
                return (
                  <button
                    key={f.id}
                    type="button"
                    role="treeitem"
                    aria-level={niveau + 1}
                    aria-current={f.id === ctx.feuilleA ? 'true' : undefined}
                    className={c.join(' ')}
                    onClick={() => ctx.choisir(f.id === ctx.feuilleA ? null : f.id)}
                  >
                    <ImageWiki titre={f.wiki} alt="" taille="mini" />
                    <span>
                      {f.nom}
                      {f.eteint && <span className="parente__croix" aria-hidden="true"> ✝</span>}
                      {f.eteint && <span className="sr-only"> (disparu)</span>}
                    </span>
                  </button>
                );
              })}
            </li>
          )}
          {enfants.map((e) => <Noeud key={e} id={e} ctx={ctx} niveau={niveau + 1} />)}
        </ul>
      )}
    </li>
  );
}
