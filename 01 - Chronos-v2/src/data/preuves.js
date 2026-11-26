// « Comment on le sait ? » — les types de preuves et les niveaux de certitude.
// Chaque méthode est expliquée UNE seule fois ici. Les cartes n'indiquent que des identifiants :
//   preuve: ['carbone-14', 'archeologie'], certitude: 'etabli'
// Le volet de la carte et la page #/methodes lisent tous les deux ce fichier.

// Les niveaux de certitude : un texte ET un symbole (jamais la seule couleur).
export const CERTITUDES = {
  etabli: {
    libelle: 'Établi',
    symbole: '●',
    explication: 'Plusieurs preuves indépendantes concordent. Les spécialistes sont d’accord.',
  },
  approximatif: {
    libelle: 'Approximatif',
    symbole: '≈',
    explication: 'Le fait est solide, mais la date a une marge d’erreur, ou peut reculer avec de nouvelles découvertes.',
  },
  debattu: {
    libelle: 'Débattu',
    symbole: '?',
    explication: 'Les spécialistes ne sont pas d’accord entre eux. Plusieurs explications restent possibles.',
  },
  recit: {
    libelle: 'Récit, sans date historique',
    symbole: '◇',
    explication: 'C’est un récit transmis par un texte religieux. Il a un sens pour les croyants, mais les historiens ne peuvent pas le dater.',
  },
};

// Les types de preuves. « court » sert dans le volet d'une carte, « long » sur la page #/methodes.
export const PREUVES = {
  'observation-astronomique': {
    nom: 'Observation astronomique',
    court: 'Les télescopes captent une lumière partie il y a très longtemps : regarder loin, c’est regarder dans le passé.',
    long: 'La lumière voyage vite, mais pas instantanément. Celle d’une galaxie lointaine a mis des milliards d’années à nous parvenir : on la voit telle qu’elle était à son départ. En mesurant à quel point cette lumière a été « étirée » vers le rouge par l’expansion de l’univers (on parle de décalage vers le rouge), les astronomes calculent son âge.',
  },
  'datation-radiometrique': {
    nom: 'Datation radiométrique',
    court: 'Certains atomes des roches se transforment lentement, à un rythme connu : c’est une horloge naturelle.',
    long: 'Certains atomes sont instables : l’uranium devient du plomb, le potassium devient de l’argon, à une vitesse parfaitement régulière. En comptant dans une roche les atomes de départ et ceux qu’ils sont devenus, on sait depuis combien de temps l’horloge tourne. Cette méthode date des roches et des météorites vieilles de milliers à milliards d’années.',
  },
  'carbone-14': {
    nom: 'Carbone 14',
    court: 'Tout être vivant contient du carbone 14, qui disparaît peu à peu après sa mort : on mesure ce qu’il en reste.',
    long: 'Les plantes, les animaux et les humains absorbent du carbone 14 tant qu’ils vivent. Après la mort, il disparaît lentement : la moitié en 5 730 ans environ. En mesurant ce qu’il reste dans un os, un charbon de bois ou une graine, on obtient son âge. La méthode marche jusqu’à environ 50 000 ans ; au-delà, il n’en reste presque plus.',
  },
  luminescence: {
    nom: 'Luminescence',
    court: 'Une pierre chauffée « remet son compteur à zéro » ; on mesure ensuite la lumière qu’elle a accumulée depuis.',
    long: 'Les minéraux enregistrent peu à peu l’énergie de la radioactivité naturelle autour d’eux. Quand un silex est chauffé dans un feu (ou un grain de sable exposé au soleil), ce compteur revient à zéro. En laboratoire, on le chauffe à nouveau : il émet une faible lumière, d’autant plus forte qu’il s’est écoulé de temps. On parle de thermoluminescence.',
  },
  fossile: {
    nom: 'Fossile',
    court: 'Des restes ou des traces d’êtres vivants ont été conservés dans la roche ; les couches qui les entourent sont datées.',
    long: 'Un fossile est un reste (os, coquille, dent) ou une trace (empreinte, terrier) d’un être vivant, conservé dans la roche. Le fossile lui-même se date rarement : on date les couches de roche au-dessus et au-dessous, souvent des cendres volcaniques, par datation radiométrique. Plus les couches sont profondes, plus elles sont anciennes.',
  },
  geochimie: {
    nom: 'Traces chimiques dans les roches',
    court: 'La composition chimique des vieilles roches garde la mémoire de l’air et des océans de leur époque.',
    long: 'Certaines roches ne se forment que s’il y a, ou s’il n’y a pas, d’oxygène autour. Par exemple, des roches rouges riches en fer « rouillé » apparaissent quand l’oxygène s’accumule. En étudiant ces indices chimiques couche après couche, et en datant les couches, les géologues reconstituent l’histoire de l’atmosphère.',
  },
  archeologie: {
    nom: 'Archéologie',
    court: 'Des objets, des foyers ou des bâtiments retrouvés lors de fouilles, datés par leur couche et par le carbone 14.',
    long: 'Les archéologues fouillent le sol couche par couche. Ils y trouvent des outils, des restes de repas, des foyers, des murs. L’ordre des couches donne l’ordre des événements, et des méthodes comme le carbone 14 donnent des dates. L’archéologie raconte la vie des gens qui n’ont rien écrit.',
  },
  'texte-ancien': {
    nom: 'Texte ancien',
    court: 'Des écrits de l’époque (inscriptions, chroniques, archives) racontent l’événement ou le mentionnent.',
    long: 'Dès qu’on sait écrire, on laisse des traces : listes de rois, lettres, contrats, chroniques, registres. Les historiens les comparent entre elles et avec l’archéologie pour vérifier ce qu’elles disent. Un texte peut se tromper ou exagérer : on le croise toujours avec d’autres sources.',
  },
  archives: {
    nom: 'Archives et enregistrements',
    court: 'L’événement est récent : il est connu par des documents, des photos, des films et des témoins.',
    long: 'Pour l’histoire récente, les preuves sont nombreuses : journaux, photographies, films, enregistrements, documents officiels, témoins encore vivants. La date est alors connue au jour près, parfois à la seconde près.',
  },
  'recit-religieux': {
    nom: 'Récit religieux',
    court: 'L’événement est raconté par un texte sacré. C’est un récit de foi, pas une preuve historique datée.',
    long: 'La Bible et d’autres textes sacrés racontent des événements qui ont un sens profond pour les croyants. Les historiens les étudient comme des textes : quand et par qui ils ont été écrits. Mais pour certains récits (la Création, le Déluge, Abraham…), aucune trace extérieure ne permet de donner une date. Odysseum les présente avec l’étiquette « Selon la Bible », à côté des faits historiques datés.',
  },
};

// Les méthodes de datation, dans l'ordre de la page #/methodes (du plus lointain au plus proche).
export const ORDRE_METHODES = [
  'observation-astronomique', 'datation-radiometrique', 'geochimie', 'fossile', 'luminescence',
  'carbone-14', 'archeologie', 'texte-ancien', 'archives', 'recit-religieux',
];

// La preuve d'une fiche. Les récits bibliques (nature: 'bible') reçoivent d'office
// le type « récit religieux » et la mention « Récit, sans date historique ».
// Renvoie null si rien n'est renseigné : le volet ne s'affiche alors pas.
export function preuveDe(fiche) {
  if (fiche.nature === 'bible') {
    return { types: ['recit-religieux'], certitude: fiche.certitude || 'recit' };
  }
  const types = (fiche.preuve || []).filter((t) => PREUVES[t]);
  const certitude = CERTITUDES[fiche.certitude] ? fiche.certitude : null;
  if (!types.length && !certitude) return null;
  return { types, certitude };
}
