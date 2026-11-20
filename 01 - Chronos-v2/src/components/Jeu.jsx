import { useEffect, useRef, useState } from 'react';

// ---------------------------------------------------------------------------
// LE JEU « Explorateur du temps » : des questions dont les réponses se trouvent sur le site.
// Le panneau s'ouvre en haut à droite et reste ouvert pendant que l'on explore :
// on peut changer de page, chercher, puis revenir répondre.
// Chaque question indique « Où chercher » (un lien vers la bonne page).
// Les réponses données sont gardées dans le navigateur (rien n'est envoyé).
// ---------------------------------------------------------------------------

const QUESTIONS = [
  {
    q: 'Le Big Bang, c’était il y a combien de temps ?',
    choix: ['4,6 milliards d’années', '13,8 milliards d’années', '100 milliards d’années', '6 000 ans'],
    bonne: 1,
    ou: { texte: 'Étage Univers', lien: '#univers' },
    explication: 'Le Big Bang date d’environ 13,8 milliards d’années. 4,6 milliards, c’est l’âge du Soleil et de la Terre.',
  },
  {
    q: 'Avec « Tout voir », à la vraie échelle : quel étage prend le plus de place sur la ligne ?',
    choix: ['La Vie', 'Les Humains', 'L’Univers (avant la Terre)', 'L’Histoire'],
    bonne: 2,
    ou: { texte: 'Tout voir', lien: '#/ensemble' },
    explication: 'Avant la naissance de la Terre, l’univers a déjà 9 milliards d’années : c’est les deux tiers de la ligne. Toute l’Histoire écrite n’est qu’un trait au bord droit.',
  },
  {
    q: 'Si toute l’histoire de l’univers tenait en une année, en quel mois apparaîtraient les dinosaures ?',
    choix: ['Juin', 'Septembre', 'Novembre', 'Décembre'],
    bonne: 3,
    ou: { texte: 'L’année cosmique (à droite de l’écran), étage Vie', lien: '#vie' },
    explication: 'Les premiers dinosaures arrivent vers le 25 décembre ! Les humains, eux, apparaissent le 31 décembre au soir.',
  },
  {
    q: 'À l’aide de l’arbre du vivant (page Vie), dis à quel groupe appartiennent les oiseaux.',
    choix: ['Aux reptiles marins', 'Aux dinosaures (les théropodes)', 'Aux mammifères', 'Aux amphibiens'],
    bonne: 1,
    ou: { texte: 'Page Vie › l’arbre du vivant', lien: '#/vie' },
    explication: 'Les oiseaux sont des dinosaures théropodes, les derniers survivants des dinosaures, comme le montre Archaeopteryx.',
  },
  {
    q: 'Et quels sont les plus proches cousins vivants des oiseaux ?',
    choix: ['Les lézards', 'Les crocodiles', 'Les tortues', 'Les chauves-souris'],
    bonne: 1,
    ou: { texte: 'Arbre du vivant : touche « Moineau », puis compare avec le crocodile', lien: '#/vie' },
    explication: 'Oiseaux et crocodiles font partie du même grand groupe : les archosaures. Les lézards et les serpents sont plus éloignés.',
  },
  {
    q: 'L’Eudimorphodon, un reptile volant du Trias, est-il un dinosaure ?',
    choix: ['Oui, c’est un dinosaure volant', 'Non, c’est un ptérosaure, cousin des dinosaures', 'Non, c’est un oiseau', 'Non, c’est une chauve-souris géante'],
    bonne: 1,
    ou: { texte: 'Page Vie, période du Trias : clique sur l’animal', lien: '#/vie/trias' },
    explication: 'Les ptérosaures ne sont pas des dinosaures, mais leurs cousins : ils partagent un ancêtre commun (la « lignée des oiseaux »).',
  },
  {
    q: 'Les baleines sont des mammifères. Quels sont leurs proches cousins sur la terre ferme ?',
    choix: ['Les phoques', 'Les hippopotames et les cerfs', 'Les éléphants', 'Les chevaux'],
    bonne: 1,
    ou: { texte: 'Arbre du vivant : Cétartiodactyles', lien: '#/vie' },
    explication: 'Les baleines descendent de mammifères à quatre pattes. Elles font partie des cétartiodactyles, avec les hippopotames, les cerfs et les vaches.',
  },
  {
    q: 'Quelle a été la plus grande extinction de l’histoire de la vie ?',
    choix: ['Celle des dinosaures (66 millions d’années)', 'Celle de la fin du Permien (252 millions d’années)', 'Celle de l’Ordovicien', 'Celle des mammouths'],
    bonne: 1,
    ou: { texte: 'Étage Vie, période du Permien', lien: '#/vie/permien' },
    explication: 'Il y a 252 millions d’années, environ 90 % des espèces marines disparaissent : c’est la plus grande crise de la vie.',
  },
  {
    q: 'Toumaï, l’un des plus anciens membres de notre lignée, vivait il y a environ 7 millions d’années. C’est combien de fois plus ancien que les premiers Homo sapiens ?',
    choix: ['2 fois', '12 fois', '23 fois', '85 fois', '100 fois'],
    bonne: 2,
    ou: { texte: 'Étage Humains', lien: '#humains' },
    explication: 'Les premiers Homo sapiens (Djebel Irhoud, Maroc) ont environ 300 000 ans. 7 000 000 ÷ 300 000 ≈ 23.',
  },
  {
    q: 'Pendant combien de temps Homo sapiens et Néandertal ont-ils vécu sur Terre en même temps ?',
    choix: ['Environ 2 600 ans', 'Environ 26 000 ans', 'Environ 260 000 ans', 'Environ 2,6 millions d’années'],
    bonne: 2,
    ou: { texte: 'Étage Humains : premiers Homo sapiens et disparition de Néandertal', lien: '#/humains' },
    explication: 'Sapiens apparaît il y a environ 300 000 ans, Néandertal disparaît il y a environ 40 000 ans : 260 000 ans de vie commune sur la planète. Mais en Europe, ils ne se sont côtoyés que quelques milliers d’années.',
  },
  {
    q: 'Quelle part d’ADN de Néandertal portent les humains d’aujourd’hui (hors d’Afrique) ?',
    choix: ['0,5 %', '2 %', '5 %', '10 %'],
    bonne: 1,
    ou: { texte: 'Étage Humains, fiche « Néandertal disparaît »', lien: '#/humains' },
    explication: 'Environ 2 % : Sapiens et Néandertal ont eu des enfants ensemble lors de leurs rencontres.',
  },
  {
    q: 'Quel âge a Lucy, la célèbre australopithèque découverte en Éthiopie ?',
    choix: ['32 000 ans', '320 000 ans', '3,2 millions d’années', '32 millions d’années'],
    bonne: 2,
    ou: { texte: 'Étage Humains', lien: '#humains' },
    explication: 'Lucy a vécu il y a 3,2 millions d’années. Elle a été découverte en 1974.',
  },
  {
    q: 'Les peintures de la grotte Chauvet, en Ardèche, ont environ…',
    choix: ['3 600 ans', '12 000 ans', '36 000 ans', '360 000 ans'],
    bonne: 2,
    ou: { texte: 'Étage Humains, période Homo sapiens', lien: '#/humains' },
    explication: 'Environ 36 000 ans : des lions, des rhinocéros et des mammouths peints par nos ancêtres sapiens.',
  },
  {
    q: 'Quelle dynastie de rois de France commence avec Hugues Capet en 987 ?',
    choix: ['Les Mérovingiens', 'Les Carolingiens', 'Les Capétiens', 'Les Bourbons'],
    bonne: 2,
    ou: { texte: 'Page Histoire, lieu « France »', lien: '#/histoire' },
    explication: 'Les Capétiens. Leurs branches (Valois, Bourbons, Orléans) régneront jusqu’en 1848.',
  },
  {
    q: 'Combien de temps a vraiment duré la guerre de Cent Ans ?',
    choix: ['100 ans', '116 ans', '87 ans', '150 ans'],
    bonne: 1,
    ou: { texte: 'Page Histoire, lieu « France »', lien: '#/histoire' },
    explication: '116 ans, de 1337 à 1453, avec de longues trêves.',
  },
  {
    q: 'Quel roi a régné le plus longtemps sur la France ?',
    choix: ['Charlemagne', 'Saint Louis', 'Louis XIV', 'Napoléon'],
    bonne: 2,
    ou: { texte: 'Page Histoire, lieu « France »', lien: '#/histoire' },
    explication: 'Louis XIV, roi à 4 ans, a régné 72 ans (1643-1715).',
  },
  {
    q: 'Quand Christophe Colomb atteint l’Amérique, en 1492, quelle grande ville existe déjà sur un lac au Mexique ?',
    choix: ['Teotihuacan', 'Tenochtitlan, la capitale aztèque', 'Cuzco', 'Caral'],
    bonne: 1,
    ou: { texte: 'Page Histoire, lieu « Amériques »', lien: '#/histoire' },
    explication: 'Tenochtitlan, fondée en 1325, compte peut-être 200 000 habitants : plus que les plus grandes villes d’Europe.',
  },
  {
    q: 'Où le Web a-t-il été inventé ?',
    choix: ['Dans la Silicon Valley', 'Au CERN, près de Genève', 'Chez IBM', 'Au Japon'],
    bonne: 1,
    ou: { texte: 'Étage Aujourd’hui, le numérique', lien: '#/aujourdhui' },
    explication: 'Au CERN, par Tim Berners-Lee, en 1989-1991. La technologie a été offerte gratuitement au monde.',
  },
  {
    q: 'En quelle année un humain est-il allé dans l’espace pour la première fois ?',
    choix: ['1957', '1961', '1969', '1981'],
    bonne: 1,
    ou: { texte: 'Étage Aujourd’hui, la conquête spatiale', lien: '#/aujourdhui' },
    explication: 'Youri Gagarine, le 12 avril 1961. 1957, c’est Spoutnik (sans humain) ; 1969, les premiers pas sur la Lune.',
  },
  {
    q: 'Quel laboratoire a identifié le virus du sida (VIH) en 1983 ?',
    choix: ['L’Institut Pasteur, à Paris', 'Le CERN', 'La NASA', 'L’Institut Curie'],
    bonne: 0,
    ou: { texte: 'Étage Aujourd’hui, médecine et santé', lien: '#/aujourdhui' },
    explication: 'Françoise Barré-Sinoussi et Luc Montagnier, à l’Institut Pasteur. Ils ont reçu le prix Nobel de médecine en 2008.',
  },
];

const CLE = 'chronos-jeu-v1';
function lire() {
  try {
    const v = JSON.parse(localStorage.getItem(CLE) || '{}');
    return { reponses: v.reponses || {}, index: v.index || 0 };
  } catch {
    return { reponses: {}, index: 0 };
  }
}

export default function Jeu() {
  const [ouvert, setOuvert] = useState(false);
  const [etat, setEtat] = useState(lire); // reponses : { indexQuestion: indexChoix }
  const [choix, setChoix] = useState(null);
  const panneau = useRef(null);
  const bouton = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem(CLE, JSON.stringify(etat));
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

  const i = etat.index;
  const fini = i >= QUESTIONS.length;
  const question = QUESTIONS[i];
  const repondu = !fini && etat.reponses[i] !== undefined;
  const score = Object.entries(etat.reponses).filter(([k, v]) => QUESTIONS[k]?.bonne === v).length;
  const nbRepondues = Object.keys(etat.reponses).length;

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
    setEtat({ reponses: {}, index: 0 });
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
        {nbRepondues > 0 && <span className="jeu__badge">{score}/{QUESTIONS.length}</span>}
      </button>

      {ouvert && (
        <aside id="jeu-panneau" ref={panneau} className="jeu verre" aria-labelledby="jeu-titre">
          <div className="jeu__tete">
            <h2 id="jeu-titre" tabIndex={-1}>Explorateur du temps</h2>
            <button type="button" className="jeu__fermer" onClick={() => { setOuvert(false); bouton.current?.focus(); }} aria-label="Fermer le jeu">
              <span aria-hidden="true">×</span>
            </button>
          </div>

          {fini ? (
            <div className="jeu__fin">
              <p className="jeu__score">{score} / {QUESTIONS.length}</p>
              <p>
                {score === QUESTIONS.length
                  ? 'Parfait ! Tu connais Chronos sur le bout des doigts.'
                  : score >= QUESTIONS.length / 2
                    ? 'Bravo, bel explorateur ! Retente les questions ratées pour tout trouver.'
                    : 'Bon début ! Explore encore le site et recommence.'}
              </p>
              <button type="button" className="jeu__principal" onClick={recommencer}>Recommencer</button>
            </div>
          ) : (
            <>
              <p className="jeu__progres">
                Question {i + 1} sur {QUESTIONS.length} · score {score}
              </p>
              <div className="jeu__barre" aria-hidden="true"><span style={{ width: `${(i / QUESTIONS.length) * 100}%` }} /></div>
              <fieldset className="jeu__question">
                <legend>{question.q}</legend>
                {question.choix.map((c, k) => {
                  const classe = !repondu ? '' : k === question.bonne ? ' jeu__choix--bon' : k === etat.reponses[i] ? ' jeu__choix--faux' : '';
                  return (
                    <label key={c} className={`jeu__choix${classe}`}>
                      <input
                        type="radio"
                        name={`jeu-q${i}`}
                        checked={repondu ? etat.reponses[i] === k : choix === k}
                        disabled={repondu}
                        onChange={() => setChoix(k)}
                      />
                      <span>{c}</span>
                      {repondu && k === question.bonne && <span className="jeu__marque"> ✓ bonne réponse</span>}
                      {repondu && k === etat.reponses[i] && k !== question.bonne && <span className="jeu__marque"> ✗ ta réponse</span>}
                    </label>
                  );
                })}
              </fieldset>

              <p className="jeu__ou">
                <span aria-hidden="true">🔎</span> Où chercher : <a href={question.ou.lien}>{question.ou.texte}</a>
              </p>

              {repondu && (
                <p className={etat.reponses[i] === question.bonne ? 'jeu__retour jeu__retour--bon' : 'jeu__retour jeu__retour--faux'} role="status">
                  <strong>{etat.reponses[i] === question.bonne ? 'Bravo ! ' : 'Pas tout à fait. '}</strong>
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
                    {i + 1 === QUESTIONS.length ? 'Voir mon score' : 'Question suivante →'}
                  </button>
                )}
              </div>
              <p className="jeu__aide">Le jeu reste ouvert pendant que tu explores : change de page, cherche, puis reviens répondre.</p>
            </>
          )}
        </aside>
      )}
    </>
  );
}
