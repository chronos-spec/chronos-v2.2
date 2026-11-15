// Les 6 étages de Chronos et leurs catégories.
// « loupe » : la deuxième échelle du repère (« si … tenait en un an »).
// depuisAns = le début de cette année-loupe, en années avant aujourd'hui.
// Chaque catégorie liste ses événements, dans l'ordre (identifiants de cartes.js ou evenements.js).
// « groupe » sert à ranger les catégories dans le menu déroulant.

export const ETAGES = [
  {
    id: 'univers',
    nom: 'Univers',
    sousTitre: 'Du Big Bang aux premières galaxies.',
    loupe: null, // l'étage Univers commence avec l'année cosmique elle-même
    categories: [
      { id: 'premiers-instants', nom: 'Les premiers instants', evenements: ['big-bang', 'noyaux', 'lumiere'] },
      { id: 'etoiles-galaxies', nom: 'Étoiles et galaxies', evenements: ['etoiles', 'galaxies', 'acceleration'] },
    ],
  },
  {
    id: 'terre',
    nom: 'Terre',
    sousTitre: 'La naissance du Soleil, de la Terre et de la Lune.',
    loupe: { libelle: "Si l'histoire de la Terre tenait en un an", depuisAns: 4.57e9 },
    categories: [
      { id: 'hadeen', nom: 'Hadéen', periode: '4,6 à 4 milliards d’années', evenements: ['soleil', 'terre-forme', 'lune', 'oceans'] },
      { id: 'archeen', nom: 'Archéen', periode: '4 à 2,5 milliards d’années', evenements: ['acasta', 'fer-rubane', 'fin-archeen'] },
    ],
  },
  {
    id: 'vie',
    nom: 'Vie',
    sousTitre: 'Des premiers microbes à la fin des dinosaures.',
    loupe: { libelle: "Si l'histoire de la vie tenait en un an", depuisAns: 3.5e9 },
    categories: [
      { id: 'microbes', nom: 'Le temps des microbes', periode: 'Archéen et Protérozoïque', evenements: ['premiere-vie', 'oxygene', 'noyau-cellule', 'boule-neige', 'ediacara'] },
      { id: 'paleozoique', nom: 'Paléozoïque', periode: '539 à 252 millions d’années', evenements: ['cambrien', 'plantes', 'tiktaalik', 'permien'] },
      { id: 'mesozoique', nom: 'Mésozoïque', periode: '252 à 66 millions d’années', evenements: ['premiers-dinos', 'archaeopteryx', 'fleurs', 'dinosaures'] },
      { id: 'cenozoique', nom: 'Cénozoïque', periode: '66 millions d’années à aujourd’hui', evenements: ['primates', 'antarctique'] },
    ],
  },
  {
    id: 'humains',
    nom: 'Humains',
    sousTitre: 'De nos premiers ancêtres aux premiers agriculteurs.',
    loupe: { libelle: 'Si le genre humain tenait en un an', depuisAns: 2.8e6 },
    categories: [
      { id: 'ancetres', nom: 'Nos premiers ancêtres', evenements: ['toumai', 'outils', 'lucy'] },
      { id: 'premiers-homo', nom: 'Les premiers Homo', evenements: ['homo', 'erectus', 'dmanissi', 'feu'] },
      { id: 'cousins', nom: 'Nos cousins disparus', evenements: ['neandertal', 'flores', 'denisova', 'fin-neandertal'] },
      { id: 'sapiens', nom: 'Homo sapiens', evenements: ['sapiens', 'afrique', 'chauvet', 'agriculture'] },
    ],
  },
  {
    id: 'histoire',
    nom: 'Histoire',
    sousTitre: "De l'écriture à 1945.",
    loupe: { libelle: "Si l'Histoire écrite tenait en un an", depuisAns: 5326 },
    categories: [
      { id: 'antiquite', groupe: 'Grandes périodes', nom: 'Antiquité', periode: 'vers 3300 av. J.-C. à 476', evenements: ['ecriture', 'kheops', 'athenes', 'auguste', 'chute-rome'] },
      { id: 'moyen-age', groupe: 'Grandes périodes', nom: 'Moyen Âge', periode: '476 à 1492', evenements: ['charlemagne', 'peste', 'imprimerie'] },
      { id: 'modernes', groupe: 'Grandes périodes', nom: 'Temps modernes', periode: '1492 à 1789', evenements: ['colomb', 'galilee', 'newton'] },
      { id: 'contemporaine', groupe: 'Grandes périodes', nom: 'Époque contemporaine', periode: '1789 à 1945', evenements: ['revolution', 'guerre-14', 'guerre-39'] },
      { id: 'bible', groupe: 'Histoire du christianisme', nom: 'Selon la Bible', periode: 'le récit de l’Ancien Testament', evenements: ['creation', 'deluge', 'abraham', 'moise', 'david'] },
      { id: 'israel', groupe: 'Histoire du christianisme', nom: 'Le peuple d’Israël dans l’histoire', evenements: ['tel-dan', 'exil', 'second-temple', 'temple-detruit'] },
      { id: 'jesus', groupe: 'Histoire du christianisme', nom: 'Jésus et les premiers chrétiens', evenements: ['naissance-jesus', 'mort-jesus', 'paul', 'constantin'] },
      { id: 'eglise', groupe: 'Histoire du christianisme', nom: 'L’Église à travers les siècles', evenements: ['nicee', 'schisme', 'reforme', 'vatican-2'] },
    ],
  },
  {
    id: 'aujourdhui',
    nom: "Aujourd'hui",
    sousTitre: "Depuis 1945, jusqu'à nous.",
    loupe: { libelle: 'Si les années depuis 1900 tenaient en un an', depuisAns: 126 },
    categories: [
      { id: 'espace', nom: 'La conquête de l’espace', evenements: ['spoutnik', 'gagarine', 'apollo', 'iss', 'webb'] },
      { id: 'monde', nom: 'Le monde depuis 1945', evenements: ['onu', 'droits', 'rome-1957', 'mur'] },
      { id: 'sciences', nom: 'Sciences et techniques', evenements: ['adn', 'web', 'genome'] },
    ],
  },
];
