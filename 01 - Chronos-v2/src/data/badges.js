// ---------------------------------------------------------------------------
// Les 49 BADGES CACHÉS. Pour en ajouter un : une ligne de plus ici, rien d'autre à toucher
// (sauf s'il faut un nouveau signal dans une page).
//   id      : identifiant unique
//   nom     : le nom du badge
//   icone   : un emoji
//   famille : pour les trophées (tous les badges d'une famille → trophée)
//   indice  : la devinette, montrée tant que le badge n'est pas gagné
//   consigne: la réponse exacte, montrée après « Révéler »
//   test    : la condition, à partir de ce qui a été vu
// Signaux utilisés : recit-civ (civilisation écoutée jusqu'au bout), civ-filtre, recit (récit animé fini),
// voyage (voyage « Tout voir » fini, ex. 'rapide-x4'), zoom-fin, periode, espece, espece-eteinte,
// groupe, comparer, carte, carte-etage, spirale, recherche, page, quiz, jour,
// ordre (« Remets dans l'ordre », ex. 'expert-7-7'), defi (date du défi du jour joué), visite-defi (mini-défi d'une visite guidée, ex. 'sapiens-reussi').
// ---------------------------------------------------------------------------
const vu = (e, t, v) => (e.vus[t] || []).includes(v);
const nb = (e, t) => (e.vus[t] || []).length;
const NB_CIVILISATIONS = 29;

export const FAMILLES = {
  civilisations: { nom: 'Civilisations', trophee: 'Historien du monde', icone: '🏛️' },
  voyages: { nom: 'Voyages dans le temps', trophee: 'Maître du temps', icone: '⏳' },
  vivant: { nom: 'Arbre du vivant', trophee: 'Naturaliste', icone: '🌿' },
  frise: { nom: 'La frise', trophee: 'Explorateur d’Odysseum', icone: '🧭' },
  quiz: { nom: 'Jeux', trophee: 'Esprit vif', icone: '🎓' },
  secrets: { nom: 'Secrets', trophee: 'Fin limier', icone: '🗝️' },
};

const civ = (id, nom, icone, indice, nomCiv) => ({
  id: `civ-${id}`, nom, icone, famille: 'civilisations', indice,
  consigne: `Page Histoire : écoute le récit « ${nomCiv} » jusqu’au bout (bouton ▶ du menu des civilisations).`,
  test: (e) => vu(e, 'recit-civ', id),
});
const espece = (id, nom, icone, indice, nomEspece) => ({
  id: `esp-${id}`, nom, icone, famille: 'vivant', indice,
  consigne: `Page Vie : trouve « ${nomEspece} » dans l’arbre du vivant et ouvre sa fiche.`,
  test: (e) => vu(e, 'espece', id),
});

export const BADGES = [
  // ---------- Civilisations (12) ----------
  civ('incas', 'Gardien des Andes', '🦙', 'Un empire perché dans les montagnes a une histoire à te raconter…', 'Incas'),
  civ('egypte', 'Enfant du Nil', '𓂀', 'Un grand fleuve, des pyramides et des pharaons t’attendent.', 'Égypte ancienne'),
  civ('rome', 'Citoyen romain', '🏛️', 'Tous les chemins mènent à ce récit-là.', 'Rome'),
  civ('chine', 'Lettré de l’Empire du Milieu', '🐉', 'Une Grande Muraille cache une longue histoire.', 'Chine'),
  civ('mali', 'Voyageur de Tombouctou', '🐪', 'Un roi d’Afrique de l’Ouest fut l’homme le plus riche de son temps…', 'Empire du Mali'),
  civ('mayas', 'Astronome maya', '🌞', 'Des pyramides dans la jungle et un calendrier très précis.', 'Mayas'),
  civ('vikings', 'Navigateur viking', '⛵', 'Des drakkars ont traversé l’Atlantique bien avant Colomb.', 'Vikings'),
  civ('aborigenes', 'Rêveur', '🪃', 'La plus longue culture vivante raconte le Temps du Rêve.', 'Aborigènes d’Australie'),
  {
    id: 'civ-5', nom: 'Conteur du monde', icone: '📜', famille: 'civilisations',
    indice: 'Les récits, c’est comme les cerises : on en écoute un, puis cinq.',
    consigne: 'Écoute 5 récits de civilisations jusqu’au bout.',
    test: (e) => nb(e, 'recit-civ') >= 5,
  },
  {
    id: 'civ-15', nom: 'Griot', icone: '🥁', famille: 'civilisations',
    indice: 'En Afrique de l’Ouest, il garde la mémoire de tous les peuples. Quinze récits pour le devenir.',
    consigne: 'Écoute 15 récits de civilisations jusqu’au bout.',
    test: (e) => nb(e, 'recit-civ') >= 15,
  },
  {
    id: 'civ-toutes', nom: 'Mémoire de l’humanité', icone: '🌍', famille: 'civilisations',
    indice: 'Toutes, sans exception. Courage !',
    consigne: `Écoute les ${NB_CIVILISATIONS} récits de civilisations.`,
    test: (e) => nb(e, 'recit-civ') >= NB_CIVILISATIONS,
  },
  {
    id: 'civ-carto', nom: 'Cartographe', icone: '🗺️', famille: 'civilisations',
    indice: 'Le menu de la page Histoire sait n’afficher qu’un seul peuple…',
    consigne: 'Page Histoire : choisis 3 civilisations différentes dans le menu.',
    test: (e) => nb(e, 'civ-filtre') >= 3,
  },

  // ---------- Voyages dans le temps (6) ----------
  {
    id: 'voy-recit', nom: 'Témoin du Big Bang', icone: '💥', famille: 'voyages',
    indice: 'Une minute pour tout raconter. L’as-tu vue jusqu’au bout ?',
    consigne: 'Page Récit : regarde le récit animé jusqu’à la fin.',
    test: (e) => nb(e, 'recit') >= 1,
  },
  {
    id: 'voy-fini', nom: 'Voyageur du temps', icone: '🚀', famille: 'voyages',
    indice: 'Un bouton ▶ t’emmène du Big Bang à aujourd’hui.',
    consigne: 'Tout voir : fais le voyage jusqu’au bout.',
    test: (e) => nb(e, 'voyage') >= 1,
  },
  {
    id: 'voy-deux', nom: 'Aller-retour', icone: '🔁', famille: 'voyages',
    indice: 'Le grand voyage existe en version courte et en version longue.',
    consigne: 'Tout voir : termine le voyage en format Rapide ET en format Normale.',
    test: (e) => (e.vus.voyage || []).some((v) => v.startsWith('rapide')) && (e.vus.voyage || []).some((v) => v.startsWith('normale')),
  },
  {
    id: 'voy-x4', nom: 'Supersonique', icone: '⚡', famille: 'voyages',
    indice: 'Plus vite, toujours plus vite…',
    consigne: 'Tout voir : termine un voyage à la vitesse ×4.',
    test: (e) => (e.vus.voyage || []).some((v) => v.endsWith('x4')),
  },
  {
    id: 'voy-lynx', nom: 'Œil de lynx', icone: '🔍', famille: 'voyages',
    indice: 'Zoome, zoome encore, jusqu’à ce qu’un siècle remplisse l’écran.',
    consigne: 'Tout voir : zoome jusqu’à voir moins de 100 ans à l’écran.',
    test: (e) => nb(e, 'zoom-fin') >= 1,
  },
  {
    id: 'voy-arpenteur', nom: 'Arpenteur', icone: '📏', famille: 'voyages',
    indice: 'En bas de « Tout voir », un curseur saute d’époque en époque.',
    consigne: 'Tout voir : choisis 5 périodes différentes avec le curseur « Période ».',
    test: (e) => nb(e, 'periode') >= 5,
  },

  // ---------- Arbre du vivant (15) ----------
  espece('h-sapiens', 'Miroir, mon beau miroir', '🪞', 'Quelque part dans les bulles, il y a… toi.', 'Homo sapiens'),
  espece('v-ornithorynque', 'Bizarrerie de la nature', '🦆', 'Un bec de canard, une queue de castor, et il pond des œufs !', 'Ornithorynque'),
  espece('tyrannosaurus', 'Roi des lézards tyrans', '🦖', 'Le plus célèbre des carnivores à petits bras.', 'Tyrannosaure'),
  espece('dodo', 'Souvenir du dodo', '🦤', 'Un oiseau qui ne volait pas, disparu à cause des humains.', 'Dodo'),
  espece('v-baleine', 'Le plus grand de tous', '🐋', 'Le plus gros animal ayant jamais vécu nage encore aujourd’hui.', 'Baleine bleue'),
  espece('eudimorphodon', 'Premier envol', '🪽', 'L’un des tout premiers reptiles volants, au Trias.', 'Eudimorphodon'),
  espece('hallucigenia', 'Hallucination', '🌀', 'Si bizarre qu’on l’a d’abord dessiné à l’envers…', 'Hallucigenia'),
  espece('h-neandertal', 'Cousin de Néandertal', '🧔', 'Un cousin disparu dont nous portons encore un peu les gènes.', 'Néandertal'),
  espece('v-stromatolithes', 'Aux origines', '🪨', 'Des pierres construites par des bactéries, il y a plus de 3 milliards d’années.', 'Stromatolithes'),
  {
    id: 'viv-10', nom: 'Naturaliste en herbe', icone: '🌱', famille: 'vivant',
    indice: 'Dix fiches d’espèces, pour commencer.',
    consigne: 'Ouvre la fiche de 10 espèces différentes dans l’arbre du vivant.',
    test: (e) => nb(e, 'espece') >= 10,
  },
  {
    id: 'viv-40', nom: 'Botaniste et zoologue', icone: '🔬', famille: 'vivant',
    indice: 'Quarante espèces, et tu commences à connaître la famille.',
    consigne: 'Ouvre la fiche de 40 espèces différentes.',
    test: (e) => nb(e, 'espece') >= 40,
  },
  {
    id: 'viv-100', nom: 'Darwin en personne', icone: '🐢', famille: 'vivant',
    indice: 'Cent espèces. Un vrai voyage du Beagle !',
    consigne: 'Ouvre la fiche de 100 espèces différentes.',
    test: (e) => nb(e, 'espece') >= 100,
  },
  {
    id: 'viv-eteintes', nom: 'Paléontologue', icone: '🦴', famille: 'vivant',
    indice: 'Le petit signe † cache des créatures disparues…',
    consigne: 'Ouvre la fiche de 10 espèces disparues (marquées †).',
    test: (e) => nb(e, 'espece-eteinte') >= 10,
  },
  {
    id: 'viv-groupes', nom: 'Généalogiste', icone: '🌳', famille: 'vivant',
    indice: 'Plonge dans les bulles : chaque cercle est une famille.',
    consigne: 'Ouvre 15 groupes différents dans l’arbre du vivant (en cliquant sur les cercles).',
    test: (e) => nb(e, 'groupe') >= 15,
  },
  {
    id: 'viv-comparer', nom: 'Air de famille', icone: '👯', famille: 'vivant',
    indice: 'Sous les bulles, l’arbre en liste sait comparer deux espèces.',
    consigne: 'Page Vie, arbre « Qui est parent de qui ? » : utilise « Comparer avec ».',
    test: (e) => nb(e, 'comparer') >= 1,
  },

  // ---------- La frise (7) ----------
  {
    id: 'fri-six', nom: 'Explorateur complet', icone: '🧭', famille: 'frise',
    indice: 'Univers, Terre, Vie, Humains, Histoire, Aujourd’hui : une fiche dans chacun.',
    consigne: 'Ouvre au moins une fiche d’événement dans chacun des 6 étages.',
    test: (e) => nb(e, 'carte-etage') >= 6,
  },
  {
    id: 'fri-25', nom: 'Rat de bibliothèque', icone: '📚', famille: 'frise',
    indice: 'Vingt-cinq fiches lues, ça commence à faire une belle pile.',
    consigne: 'Ouvre 25 fiches d’événements différentes.',
    test: (e) => nb(e, 'carte') >= 25,
  },
  {
    id: 'fri-100', nom: 'Encyclopédiste', icone: '🖋️', famille: 'frise',
    indice: 'Cent fiches ! Diderot serait fier.',
    consigne: 'Ouvre 100 fiches d’événements différentes.',
    test: (e) => nb(e, 'carte') >= 100,
  },
  {
    id: 'fri-spirale', nom: 'Tourbillon', icone: '🌀', famille: 'frise',
    indice: 'Le temps peut aussi s’enrouler sur lui-même…',
    consigne: 'Page Spirale : clique sur un événement de la spirale.',
    test: (e) => nb(e, 'spirale') >= 1,
  },
  {
    id: 'fri-recherche', nom: 'Curieux', icone: '🔎', famille: 'frise',
    indice: 'Une loupe, en haut à gauche, trouve tout.',
    consigne: 'Utilise la recherche et ouvre un résultat.',
    test: (e) => nb(e, 'recherche') >= 1,
  },
  {
    id: 'fri-tableau', nom: 'Vue d’aigle', icone: '🦅', famille: 'frise',
    indice: 'Une page montre tout un étage d’un seul coup d’œil, comme un tableau.',
    consigne: 'Ouvre la page « Vue d’ensemble ».',
    test: (e) => vu(e, 'page', 'vue-ensemble'),
  },
  {
    id: 'fri-tour', nom: 'Grand tour', icone: '🎡', famille: 'frise',
    indice: 'Six étages, six pages à visiter.',
    consigne: 'Visite les pages des 6 étages (Univers, Terre, Vie, Humains, Histoire, Aujourd’hui).',
    test: (e) => ['univers', 'terre', 'vie', 'humains', 'histoire', 'aujourdhui'].every((x) => vu(e, 'page', x)),
  },

  // ---------- Quiz (3) ----------
  {
    id: 'quiz-fini', nom: 'Apprenti', icone: '✏️', famille: 'quiz',
    indice: 'Vingt questions t’attendent derrière le bouton Jeu.',
    consigne: 'Termine une partie du quiz.',
    test: (e) => nb(e, 'quiz') >= 1,
  },
  {
    id: 'quiz-15', nom: 'Savant', icone: '🧠', famille: 'quiz',
    indice: 'Trois quarts de bonnes réponses, au moins.',
    consigne: 'Obtiens au moins 15/20 au quiz.',
    test: (e) => (e.vus.quiz || []).some((s) => Number(s) >= 15),
  },
  {
    id: 'quiz-20', nom: 'Érudit', icone: '🏆', famille: 'quiz',
    indice: 'La perfection existe.',
    consigne: 'Obtiens 20/20 au quiz.',
    test: (e) => (e.vus.quiz || []).some((s) => Number(s) >= 20),
  },

  // ---------- Remets dans l'ordre (3) ----------
  {
    id: 'visite-defi', nom: 'Voyageur du tunnel', icone: '🌌', famille: 'quiz',
    indice: 'Au bout du tunnel du temps, trois étapes attendent d’être rangées.',
    consigne: 'Termine une visite guidée et réussis son mini-défi.',
    test: (e) => (e.vus['visite-defi'] || []).some((v) => v.endsWith('-reussi')),
  },
  {
    id: 'ordre-fini', nom: 'Horloger', icone: '🕰️', famille: 'quiz',
    indice: 'Dans le panneau Jeu, des cartes attendent d’être rangées.',
    consigne: 'Termine une partie de « Remets dans l’ordre ».',
    test: (e) => nb(e, 'ordre') >= 1,
  },
  {
    id: 'ordre-expert', nom: 'Chronologiste', icone: '🧮', famille: 'quiz',
    indice: 'Sept cartes très proches, et pas une seule erreur.',
    consigne: '« Remets dans l’ordre », niveau Expert : place les 7 cartes sans faute.',
    test: (e) => (e.vus.ordre || []).includes('expert-7-7'),
  },
  {
    id: 'ordre-defi', nom: 'Rendez-vous quotidien', icone: '📆', famille: 'quiz',
    indice: 'Chaque jour, un nouveau défi, le même pour tout le monde.',
    consigne: 'Joue le défi du jour 3 jours différents.',
    test: (e) => nb(e, 'defi') >= 3,
  },

  // ---------- Secrets (2) ----------
  {
    id: 'sec-fidele', nom: 'Fidèle', icone: '📅', famille: 'secrets',
    indice: 'Le temps passe… reviens le voir.',
    consigne: 'Reviens sur Odysseum 3 jours différents.',
    test: (e) => nb(e, 'jour') >= 3,
  },
  {
    id: 'sec-legal', nom: 'Lecteur des petites lignes', icone: '🧐', famille: 'secrets',
    indice: 'Personne ne lit jamais cette page… sauf toi ?',
    consigne: 'Ouvre la page des mentions légales (en bas du site).',
    test: (e) => vu(e, 'page', 'mentions-legales'),
  },
];
