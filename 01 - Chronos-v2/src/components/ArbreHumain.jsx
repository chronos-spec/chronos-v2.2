import { useEffect, useMemo, useRef, useState } from 'react';
import { ESPECES, METISSAGES } from '../data/especes.js';
import { texteAge } from '../lib/ages.js';

// L'arbre généalogique des espèces humaines.
// Le temps va de gauche (7 millions d'années) à droite (aujourd'hui).
// L'échelle est « resserrée » vers le présent : sinon les 300 000 dernières années tiendraient dans un trait.
// (logarithme de l'âge + 120 000 ans : les millions d'années gardent de la place, le présent aussi.)

const PLUS_ANCIEN = 7.5e6;
const DECALAGE = 1.2e5;
const LARGEUR_MIN = 640;
const MARGE_G = 16;
const MARGE_D = 64;
const RANG = 46;
const HAUT_AXE = 34;

const lg = Math.log10;
function fabriquerX(LARGEUR) {
  return (ans) => {
  const a = Math.max(0, Math.min(PLUS_ANCIEN, ans || 0));
  const f = (lg(PLUS_ANCIEN + DECALAGE) - lg(a + DECALAGE)) / (lg(PLUS_ANCIEN + DECALAGE) - lg(DECALAGE));
  return MARGE_G + f * (LARGEUR - MARGE_G - MARGE_D);
  };
}

const GRADUATIONS = [
  [7e6, '7 Ma'], [5e6, '5 Ma'], [3e6, '3 Ma'], [2e6, '2 Ma'], [1e6, '1 Ma'],
  [5e5, '500 000'], [2e5, '200 000'], [5e4, '50 000'],
];


export default function ArbreHumain({ choisie, onChoisir }) {
  // L'arbre prend toute la largeur disponible (au moins 640 px : sinon on le fait glisser).
  const cadre = useRef(null);
  const [LARGEUR, setLargeur] = useState(940);
  useEffect(() => {
    const el = cadre.current;
    if (!el) return;
    const mesurer = () => setLargeur(Math.max(LARGEUR_MIN, Math.floor(el.clientWidth)));
    mesurer();
    const obs = new ResizeObserver(mesurer);
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const xDe = useMemo(() => fabriquerX(LARGEUR), [LARGEUR]);

  // Ordre des rangs : on parcourt l'arbre en profondeur, pour que les enfants suivent leur parent.
  const rangs = useMemo(() => {
    const ordre = [];
    const visiter = (parent) => {
      ESPECES.filter((e) => e.parent === parent).forEach((e) => {
        ordre.push(e);
        visiter(e.id);
      });
    };
    visiter(null);
    return Object.fromEntries(ordre.map((e, i) => [e.id, i]));
  }, []);

  const parId = useMemo(() => Object.fromEntries(ESPECES.map((e) => [e.id, e])), []);
  const especes = useMemo(() => [...ESPECES].sort((a, b) => rangs[a.id] - rangs[b.id]), [rangs]);
  const hauteur = HAUT_AXE + especes.length * RANG + 12;
  const y = (id) => HAUT_AXE + rangs[id] * RANG + 30;
  const actuelle = choisie ? parId[choisie] : null;

  return (
    <section className="arbre" aria-labelledby="titre-arbre" id="arbre-humain">
      <div className="arbre__tete">
        <h3 id="titre-arbre" className="arbre__titre">L’arbre des espèces humaines</h3>
        <p className="arbre__aide">
          Touchez une espèce pour la découvrir. Trait plein : parenté probable. Pointillés : parenté incertaine.
          L’échelle se resserre vers le présent.
        </p>
      </div>

      <div className="arbre__defilement" ref={cadre}>
        <div className="arbre__plan" style={{ width: LARGEUR, height: hauteur }}>
          <svg className="arbre__traits" width={LARGEUR} height={hauteur} aria-hidden="true">
            {GRADUATIONS.map(([ans, txt]) => (
              <g key={ans}>
                <line x1={xDe(ans)} x2={xDe(ans)} y1={HAUT_AXE - 6} y2={hauteur} className="arbre__grille" />
                <text x={xDe(ans)} y={HAUT_AXE - 14} className="arbre__graduation">{txt}</text>
              </g>
            ))}
            <text x={xDe(0)} y={HAUT_AXE - 14} className="arbre__graduation arbre__graduation--fin">Auj.</text>

            {especes.filter((e) => e.parent).map((e) => {
              const p = parId[e.parent];
              const xe = xDe(e.debut);
              const xp = Math.max(xDe(p.debut), Math.min(xDe(p.fin), xe));
              const cls = e.lien === 'probable' ? 'arbre__lien' : 'arbre__lien arbre__lien--incertain';
              return (
                <g key={`l-${e.id}`}>
                  {xe > xDe(p.fin) && (
                    <line x1={xDe(p.fin)} x2={xe} y1={y(p.id)} y2={y(p.id)} className="arbre__lien arbre__lien--incertain" />
                  )}
                  <path d={`M${xp} ${y(p.id)} L${xe} ${y(p.id)} L${xe} ${y(e.id)}`} className={cls} />
                </g>
              );
            })}

            {especes.map((e) => {
              const x1 = xDe(e.debut);
              const x2 = xDe(e.fin);
              const vivante = e.fin === 0;
              return (
                <g key={`b-${e.id}`} className={choisie === e.id ? 'arbre__espece arbre__espece--choisie' : 'arbre__espece'}>
                  <line x1={x1} x2={vivante ? x2 + 20 : x2} y1={y(e.id)} y2={y(e.id)} className="arbre__barre" />
                  {vivante ? (
                    <path d={`M${x2 + 20} ${y(e.id) - 6} L${x2 + 30} ${y(e.id)} L${x2 + 20} ${y(e.id) + 6}`} className="arbre__fleche" />
                  ) : (
                    <>
                      <circle cx={x2} cy={y(e.id)} r="4" className="arbre__fin" />
                      <circle cx={x2} cy={y(e.id)} r="8" className="arbre__fin arbre__fin--halo" />
                    </>
                  )}
                </g>
              );
            })}
          </svg>

          <ol className="arbre__liste">
            {especes.map((e) => {
              const parent = e.parent ? parId[e.parent] : null;
              const x1 = xDe(e.debut);
              // Les étiquettes trop proches du bord droit passent à gauche du trait.
              const aGauche = x1 > LARGEUR - 220;
              return (
                <li key={e.id} style={{ top: y(e.id) - 30, left: aGauche ? undefined : Math.max(0, x1 - 4), right: aGauche ? LARGEUR - xDe(e.fin) - 4 : undefined }}>
                  <button
                    type="button"
                    className={choisie === e.id ? 'espece espece--choisie' : 'espece'}
                    aria-pressed={choisie === e.id}
                    aria-controls="fiche-espece"
                    onClick={() => onChoisir(choisie === e.id ? null : e.id)}
                  >
                    <span className="espece__nom">{e.nom}</span>
                    <span className="sr-only">
                      {`, ${e.surnom}, de ${texteAge(e.debut)} à ${e.fin ? texteAge(e.fin) : 'aujourd’hui'}`}
                      {parent ? `, descend ${e.lien === 'probable' ? 'probablement' : 'peut-être'} de ${parent.nom}` : ''}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      <div className="arbre__fiche" id="fiche-espece" aria-live="polite">
        {actuelle ? (
          <>
            <p className="arbre__fiche-titre">
              <strong>{actuelle.nom}</strong> · {actuelle.surnom}
            </p>
            <p className="arbre__fiche-dates">
              {texteAge(actuelle.debut)} → {actuelle.fin ? texteAge(actuelle.fin) : 'aujourd’hui'} · {actuelle.lieu}
            </p>
            <p className="arbre__fiche-texte">{actuelle.texte}</p>
            {actuelle.parent && (
              <p className="arbre__fiche-parent">
                Descend {actuelle.lien === 'probable' ? 'probablement' : 'peut-être'} de{' '}
                <button type="button" className="arbre__lien-bouton" onClick={() => onChoisir(actuelle.parent)}>
                  {parId[actuelle.parent].nom}
                </button>
              </p>
            )}
            {METISSAGES.some((m) => m.includes(actuelle.id)) && (
              <p className="arbre__fiche-parent">
                A eu des enfants avec :{' '}
                {METISSAGES.filter((m) => m.includes(actuelle.id))
                  .map((m) => parId[m[0] === actuelle.id ? m[1] : m[0]].nom)
                  .join(', ')}
                {' '}(on le sait grâce à l’ADN).
              </p>
            )}
          </>
        ) : (
          <p className="arbre__fiche-vide">
            Aujourd’hui, Homo sapiens est seul. Pendant des millions d’années, plusieurs espèces humaines ont vécu en même temps.
          </p>
        )}
      </div>
      <p className="arbre__source">
        Source : Smithsonian, <a href="https://humanorigins.si.edu/evidence/human-fossils/species" target="_blank" rel="noreferrer">Human Origins</a>.
        Dates arrondies ; la parenté entre fossiles reste discutée.
      </p>
    </section>
  );
}
