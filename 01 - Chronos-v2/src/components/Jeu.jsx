import { useEffect, useRef, useState } from 'react';
import { QUESTIONS, THEMES } from '../data/questionsJeu.js';
import Collection from './Collection.jsx';
import { signaler } from '../lib/badges.js';

// ---------------------------------------------------------------------------
// LE JEU « Explorateur du temps » : des questions dont les réponses se trouvent sur le site.
// Le panneau s'ouvre en haut à droite et reste ouvert pendant que l'on explore :
// on peut changer de page, chercher, puis revenir répondre.
// Chaque question indique « Où chercher » (un lien vers la bonne page).
// Les réponses données sont gardées dans le navigateur (rien n'est envoyé).
// ---------------------------------------------------------------------------

const PAR_PARTIE = 20;
const PAR_ID_Q = Object.fromEntries(QUESTIONS.map((q) => [q.id, q]));

// Mélange (Fisher-Yates).
function melanger(t) {
  const a = [...t];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Une nouvelle partie : 20 questions tirées au hasard (réparties entre les thèmes si « tout »),
// avec l'ordre des réponses mélangé. On évite les questions des parties précédentes tant qu'il en reste.
function nouvellePartie(theme, dejaVues = []) {
  const vues = new Set(dejaVues);
  const pioche = (liste, n) => {
    const neuves = melanger(liste.filter((q) => !vues.has(q.id)));
    const anciennes = melanger(liste.filter((q) => vues.has(q.id)));
    return [...neuves, ...anciennes].slice(0, n);
  };
  let choisies;
  if (theme === 'tout') {
    const themes = Object.keys(THEMES);
    choisies = [];
    themes.forEach((t, k) => {
      const part = Math.floor(PAR_PARTIE / themes.length) + (k < PAR_PARTIE % themes.length ? 1 : 0);
      choisies.push(...pioche(QUESTIONS.filter((q) => q.theme === t), part));
    });
    choisies = melanger(choisies);
  } else {
    choisies = pioche(QUESTIONS.filter((q) => q.theme === theme), PAR_PARTIE);
  }
  return {
    theme,
    questions: choisies.map((q) => ({ id: q.id, ordre: melanger(q.choix.map((_, k) => k)) })),
    reponses: {},
    index: 0,
    vues: [...new Set([...dejaVues, ...choisies.map((q) => q.id)])].slice(-200),
  };
}

const CLE = 'chronos-jeu-v2';
function lire() {
  try {
    const v = JSON.parse(localStorage.getItem(CLE) || 'null');
    if (v && Array.isArray(v.questions) && v.questions.every((q) => PAR_ID_Q[q.id])) return v;
  } catch {
    /* rien */
  }
  return null; // pas de partie en cours : on choisit un thème
}

function lireVues() {
  try {
    return JSON.parse(localStorage.getItem(`${CLE}-vues`) || '[]');
  } catch {
    return [];
  }
}

export default function Jeu() {
  const [ouvert, setOuvert] = useState(false);
  const [etat, setEtat] = useState(lire); // reponses : { indexQuestion: indexChoix }
  const [choix, setChoix] = useState(null);
  const [onglet, setOnglet] = useState('quiz'); // « quiz » ou « collection » (badges cachés)
  const panneau = useRef(null);
  const bouton = useRef(null);

  useEffect(() => {
    try {
      if (etat) localStorage.setItem(CLE, JSON.stringify(etat));
      else localStorage.removeItem(CLE);
      if (etat?.vues) localStorage.setItem(`${CLE}-vues`, JSON.stringify(etat.vues));
    } catch {
      /* stockage indisponible : le jeu marche quand même */
    }
  }, [etat]);

  useEffect(() => {
    if (!ouvert) return undefined;
    panneau.current?.querySelector('h2')?.focus();
    const echap = (e) => {
      if (e.key === 'Escape') {
        setOuvert(false);
        bouton.current?.focus();
      }
    };
    window.addEventListener('keydown', echap);
    return () => window.removeEventListener('keydown', echap);
  }, [ouvert]);

  const partie = etat;
  const i = partie?.index ?? 0;
  const total = partie?.questions.length ?? PAR_PARTIE;
  const fini = partie && i >= total;
  const courante = partie && !fini ? partie.questions[i] : null;
  const question = courante ? PAR_ID_Q[courante.id] : null;
  // Les réponses affichées dans l'ordre mélangé ; « bonne » = position de la bonne réponse (index 0 d'origine).
  const choixAffiches = courante ? courante.ordre.map((k) => question.choix[k]) : [];
  const bonne = courante ? courante.ordre.indexOf(0) : -1;
  const repondu = courante && partie.reponses[i] !== undefined;
  const score = partie
    ? Object.entries(partie.reponses).filter(([k, v]) => partie.questions[k] && partie.questions[k].ordre[v] === 0).length
    : 0;
  const nbRepondues = partie ? Object.keys(partie.reponses).length : 0;

  // Badges du quiz : on note le score à la fin d'une partie.
  useEffect(() => {
    if (fini) signaler('quiz', String(score));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fini]);

  const commencer = (theme) => {
    setChoix(null);
    setEtat(nouvellePartie(theme, partie?.vues || lireVues()));
  };
  const valider = () => {
    if (choix === null) return;
    setEtat((e) => ({ ...e, reponses: { ...e.reponses, [i]: choix } }));
  };
  const aller = (n) => {
    setChoix(null);
    setEtat((e) => ({ ...e, index: n }));
  };
  const recommencer = () => {
    setChoix(null);
    setEtat(null);
  };

  return (
    <>
      <button
        ref={bouton}
        type="button"
        className="jeu__bouton"
        aria-expanded={ouvert}
        aria-controls="jeu-panneau"
        onClick={() => setOuvert((o) => !o)}
      >
        <span aria-hidden="true">🧭</span> Jeu
        {nbRepondues > 0 && <span className="jeu__badge">{score}/{total}</span>}
      </button>

      {ouvert && (
        <aside id="jeu-panneau" ref={panneau} className="jeu verre" aria-labelledby="jeu-titre">
          <div className="jeu__tete">
            <h2 id="jeu-titre" tabIndex={-1}>Explorateur du temps</h2>
            <button type="button" className="jeu__fermer" onClick={() => { setOuvert(false); bouton.current?.focus(); }} aria-label="Fermer le jeu">
              <span aria-hidden="true">×</span>
            </button>
          </div>

          <div className="jeu__onglets" role="group" aria-label="Partie du jeu">
            <button type="button" className="jeu__onglet" aria-pressed={onglet === 'quiz'} onClick={() => setOnglet('quiz')}>
              Quiz
            </button>
            <button type="button" className="jeu__onglet" aria-pressed={onglet === 'collection'} onClick={() => setOnglet('collection')}>
              <span aria-hidden="true">🏅</span> Ma collection
            </button>
          </div>

          {onglet === 'collection' ? (
            <Collection />
          ) : !partie ? (
            <div className="jeu__accueil">
              <p>
                {PAR_PARTIE} questions tirées au hasard parmi {QUESTIONS.length}. Les réponses sont toutes sur le site :
                explore, cherche, puis reviens répondre !
              </p>
              <p className="jeu__sous-titre">Choisis un thème</p>
              <div className="jeu__themes">
                <button type="button" className="jeu__principal" onClick={() => commencer('tout')}>Un peu de tout</button>
                {Object.entries(THEMES).map(([id, t]) => (
                  <button key={id} type="button" className="jeu__secondaire" onClick={() => commencer(id)}>
                    {t.nom} <span className="jeu__nb">({QUESTIONS.filter((q) => q.theme === id).length})</span>
                  </button>
                ))}
              </div>
            </div>
          ) : fini ? (
            <div className="jeu__fin">
              <p className="jeu__score">{score} / {total}</p>
              <p>
                {score === total
                  ? 'Parfait ! Tu connais Chronos sur le bout des doigts.'
                  : score >= total * 0.75
                    ? 'Excellent explorateur !'
                    : score >= total / 2
                      ? 'Bravo ! Encore une partie pour progresser ?'
                      : 'Bon début ! Explore encore le site et rejoue.'}
              </p>
              <div className="jeu__themes">
                <button type="button" className="jeu__principal" onClick={() => commencer(partie.theme)}>Nouvelle partie</button>
                <button type="button" className="jeu__secondaire" onClick={recommencer}>Changer de thème</button>
              </div>
            </div>
          ) : (
            <>
              <p className="jeu__progres">
                {partie.theme === 'tout' ? 'Un peu de tout' : THEMES[partie.theme].nom} · question {i + 1} sur {total} · score {score}
              </p>
              <div className="jeu__barre" aria-hidden="true"><span style={{ width: `${(i / total) * 100}%` }} /></div>
              <fieldset className="jeu__question">
                <legend>{question.q}</legend>
                {choixAffiches.map((c, k) => {
                  const classe = !repondu ? '' : k === bonne ? ' jeu__choix--bon' : k === partie.reponses[i] ? ' jeu__choix--faux' : '';
                  return (
                    <label key={c} className={`jeu__choix${classe}`}>
                      <input
                        type="radio"
                        name={`jeu-q${i}`}
                        checked={repondu ? partie.reponses[i] === k : choix === k}
                        disabled={repondu}
                        onChange={() => setChoix(k)}
                      />
                      <span>{c}</span>
                      {repondu && k === bonne && <span className="jeu__marque"> ✓ bonne réponse</span>}
                      {repondu && k === partie.reponses[i] && k !== bonne && <span className="jeu__marque"> ✗ ta réponse</span>}
                    </label>
                  );
                })}
              </fieldset>

              <p className="jeu__ou">
                <span aria-hidden="true">🔎</span> Où chercher : <a href={question.ou.lien}>{question.ou.texte}</a>
              </p>

              {repondu && (
                <p className={partie.reponses[i] === bonne ? 'jeu__retour jeu__retour--bon' : 'jeu__retour jeu__retour--faux'} role="status">
                  <strong>{partie.reponses[i] === bonne ? 'Bravo ! ' : 'Pas tout à fait. '}</strong>
                  {question.explication}
                </p>
              )}

              <div className="jeu__actions">
                <button type="button" className="jeu__secondaire" onClick={() => aller(Math.max(0, i - 1))} disabled={i === 0}>
                  ← Précédente
                </button>
                {!repondu ? (
                  <button type="button" className="jeu__principal" onClick={valider} disabled={choix === null}>Valider</button>
                ) : (
                  <button type="button" className="jeu__principal" onClick={() => aller(i + 1)}>
                    {i + 1 === total ? 'Voir mon score' : 'Question suivante →'}
                  </button>
                )}
              </div>
              <p className="jeu__aide">
                Le jeu reste ouvert pendant que tu explores.{' '}
                <button type="button" className="jeu__lien" onClick={recommencer}>Abandonner et changer de thème</button>
              </p>
            </>
          )}
        </aside>
      )}
    </>
  );
}
