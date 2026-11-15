// Les 6 étages de Chronos et leurs catégories.
// « loupe » : la deuxième échelle du repère (« si … tenait en un an »).
// depuisAns = le début de cette année-loupe, en années avant aujourd'hui.
// Chaque catégorie liste ses événements, dans l'ordre (identifiants de cartes.js ou evenements.js).
// « groupe » sert à ranger les catégories dans le menu déroulant.
// « debut » / « fin » (années avant aujourd'hui) : les bornes de la période. Quand elles existent,
// le tronçon est à l'échelle de toute la période (et pas seulement de ses événements).
// « theme » : les catégories d'un même thème forment une seule ligne. Changer de thème
// remplace la ligne par une autre (Histoire : grandes périodes / christianisme ; Aujourd'hui : un thème par ligne).
// « ere » : la grande ère géologique (couleurs dans eres.js).

export const ETAGES = [
  {
    id: 'univers',
    nom: 'Univers',
    sousTitre: 'Du Big Bang aux premières galaxies.',
    loupe: null, // l'étage Univers commence avec l'année cosmique elle-même
    categories: [
      { id: 'premiers-instants', nom: 'Les premiers instants', evenements: ['big-bang', 'noyaux', 'lumiere'] },
      { id: 'etoiles-galaxies', nom: 'Étoiles et galaxies', evenements: ['etoiles', 'a-supernovae', 'galaxies', 'a-voie-lactee', 'a-reionisation', 'acceleration'] },
    ],
  },
  {
    id: 'terre',
    nom: 'Terre',
    sousTitre: 'La naissance du Soleil, de la Terre et de la Lune.',
    loupe: { libelle: "Si l'histoire de la Terre tenait en un an", depuisAns: 4.57e9 },
    categories: [
      { id: 'hadeen', ere: 'precambrien', groupe: 'Précambrien', nom: 'Hadéen', periode: '4,6 à 4 milliards d’années', debut: 4.6e9, fin: 4.0e9, evenements: ['soleil', 'terre-forme', 'lune', 'oceans', 'a-bombardement'] },
      { id: 'archeen', ere: 'precambrien', groupe: 'Précambrien', nom: 'Archéen', periode: '4 à 2,5 milliards d’années', debut: 4.0e9, fin: 2.5e9, evenements: ['acasta', 'a-continents', 'fer-rubane', 'a-tectonique', 'fin-archeen'] },
      { id: 'terre-proterozoique', ere: 'precambrien', groupe: 'Précambrien', nom: 'Protérozoïque', periode: '2,5 milliards à 539 millions d’années', debut: 2.5e9, fin: 5.39e8, evenements: ['a-huronienne'] },
      { id: 'terre-phanerozoique', ere: 'phanerozoique', nom: 'Les continents dérivent', periode: 'Phanérozoïque : depuis 539 millions d’années', debut: 5.39e8, fin: 0, evenements: ['a-pangee', 'a-pangee-fin', 'a-himalaya'] },
    ],
  },
  {
    id: 'vie',
    nom: 'Vie',
    sousTitre: 'Des premiers microbes aux premiers grands singes.',
    loupe: { libelle: "Si l'histoire de la vie tenait en un an", depuisAns: 3.5e9 },
    categories: [
      { id: 'vie-archeen', ere: 'precambrien', groupe: 'Précambrien', nom: 'Archéen', periode: '4 à 2,5 milliards d’années', debut: 4.0e9, fin: 2.5e9, evenements: ['a-molecules', 'premiere-vie', 'a-cyanobacteries'] },
      { id: 'vie-proterozoique', ere: 'precambrien', groupe: 'Précambrien', nom: 'Protérozoïque', periode: '2,5 milliards à 539 millions d’années', debut: 2.5e9, fin: 5.39e8, evenements: ['oxygene', 'noyau-cellule', 'a-sexe', 'boule-neige', 'ediacara'] },
      { id: 'cambrien', ere: 'paleozoique', groupe: 'Paléozoïque (ère primaire)', nom: 'Cambrien', periode: '539 à 485 millions d’années', debut: 5.39e8, fin: 4.854e8, evenements: ['cambrien', 'a-poissons'] },
      { id: 'ordovicien', ere: 'paleozoique', groupe: 'Paléozoïque (ère primaire)', nom: 'Ordovicien', periode: '485 à 444 millions d’années', debut: 4.854e8, fin: 4.438e8, evenements: ['plantes', 'a-ext-ordovicien'] },
      { id: 'silurien', ere: 'paleozoique', groupe: 'Paléozoïque (ère primaire)', nom: 'Silurien', periode: '444 à 419 millions d’années', debut: 4.438e8, fin: 4.192e8, evenements: ['a-machoires'] },
      { id: 'devonien', ere: 'paleozoique', groupe: 'Paléozoïque (ère primaire)', nom: 'Dévonien', periode: '419 à 359 millions d’années', debut: 4.192e8, fin: 3.589e8, evenements: ['a-insectes', 'tiktaalik', 'a-ext-devonien'] },
      { id: 'carbonifere', ere: 'paleozoique', groupe: 'Paléozoïque (ère primaire)', nom: 'Carbonifère', periode: '359 à 299 millions d’années', debut: 3.589e8, fin: 2.989e8, evenements: ['a-forets', 'a-reptiles'] },
      { id: 'permien', ere: 'paleozoique', groupe: 'Paléozoïque (ère primaire)', nom: 'Permien', periode: '299 à 252 millions d’années', debut: 2.989e8, fin: 2.519e8, evenements: ['permien'] },
      { id: 'trias', ere: 'mesozoique', groupe: 'Mésozoïque (ère secondaire)', nom: 'Trias', periode: '252 à 201 millions d’années', debut: 2.519e8, fin: 2.014e8, evenements: ['premiers-dinos', 'a-mammiferes', 'a-ext-trias'] },
      { id: 'jurassique', ere: 'mesozoique', groupe: 'Mésozoïque (ère secondaire)', nom: 'Jurassique', periode: '201 à 145 millions d’années', debut: 2.014e8, fin: 1.45e8, evenements: ['archaeopteryx'] },
      { id: 'cretace', ere: 'mesozoique', groupe: 'Mésozoïque (ère secondaire)', nom: 'Crétacé', periode: '145 à 66 millions d’années', debut: 1.45e8, fin: 6.6e7, evenements: ['fleurs', 'dinosaures'] },
      { id: 'paleogene', ere: 'cenozoique', groupe: 'Cénozoïque (ère tertiaire et quaternaire)', nom: 'Paléogène', periode: '66 à 23 millions d’années', debut: 6.6e7, fin: 2.303e7, evenements: ['primates', 'antarctique'] },
      { id: 'neogene', ere: 'cenozoique', groupe: 'Cénozoïque (ère tertiaire et quaternaire)', nom: 'Néogène', periode: '23 à 2,6 millions d’années', debut: 2.303e7, fin: 2.58e6, evenements: ['a-grands-singes'] },
      { id: 'quaternaire', ere: 'cenozoique', groupe: 'Cénozoïque (ère tertiaire et quaternaire)', nom: 'Quaternaire', periode: 'depuis 2,6 millions d’années', debut: 2.58e6, fin: 0, evenements: ['a-glaciations'] },
    ],
  },
  {
    id: 'humains',
    nom: 'Humains',
    sousTitre: 'La Préhistoire : de nos premiers ancêtres aux premiers villages.',
    loupe: { libelle: 'Si le genre humain tenait en un an', depuisAns: 2.8e6 },
    categories: [
      { id: 'ancetres', nom: 'Nos premiers ancêtres', evenements: ['toumai', 'a-australopitheques', 'outils', 'lucy'] },
      { id: 'premiers-homo', nom: 'Les premiers Homo', evenements: ['homo', 'a-habilis', 'erectus', 'a-biface', 'dmanissi', 'feu'] },
      { id: 'cousins', nom: 'Nos cousins disparus', evenements: ['neandertal', 'flores', 'denisova', 'fin-neandertal'] },
      { id: 'sapiens', nom: 'Homo sapiens', evenements: ['sapiens', 'a-parures', 'afrique', 'a-australie', 'chauvet', 'a-venus', 'a-ameriques'] },
      { id: 'neolithique', nom: 'Le Néolithique', periode: '11 500 à 5 300 ans', evenements: ['agriculture', 'a-domestication', 'a-catal', 'a-megalithes', 'a-roue'] },
    ],
  },
  {
    id: 'histoire',
    nom: 'Histoire',
    sousTitre: "De l'écriture à 1945.",
    loupe: { libelle: "Si l'Histoire écrite tenait en un an", depuisAns: 5326 },
    categories: [
      { id: 'antiquite', theme: 'periodes', groupe: 'Grandes périodes', nom: 'Antiquité', periode: 'vers 3300 av. J.-C. à 476', evenements: ['ecriture', 'a-egypte', 'kheops', 'a-akkad', 'a-hammurabi', 'a-troie', 'a-alphabet', 'a-rome', 'athenes', 'a-mediques', 'a-bouddha', 'a-alexandre', 'a-qin', 'a-cesar', 'auguste', 'chute-rome'] },
      { id: 'moyen-age', theme: 'periodes', groupe: 'Grandes périodes', nom: 'Moyen Âge', periode: '476 à 1492', evenements: ['a-islam', 'charlemagne', 'a-croisades', 'a-magna-carta', 'peste', 'imprimerie', 'a-constantinople'] },
      { id: 'modernes', theme: 'periodes', groupe: 'Grandes périodes', nom: 'Temps modernes', periode: '1492 à 1789', evenements: ['colomb', 'a-copernic', 'galilee', 'newton', 'a-industrie', 'a-usa'] },
      { id: 'contemporaine', theme: 'periodes', groupe: 'Grandes périodes', nom: 'Époque contemporaine', periode: '1789 à 1945', evenements: ['revolution', 'a-napoleon', 'a-waterloo', 'a-darwin', 'a-allemagne', 'a-eiffel', 'a-einstein', 'guerre-14', 'a-russie', 'a-crise-1929', 'guerre-39', 'a-bombe'] },
      { id: 'bible', theme: 'christianisme', groupe: 'Histoire du christianisme', nom: 'Selon la Bible', periode: 'le récit de l’Ancien Testament', evenements: ['creation', 'deluge', 'abraham', 'moise', 'david'] },
      { id: 'israel', theme: 'christianisme', groupe: 'Histoire du christianisme', nom: 'Le peuple d’Israël dans l’histoire', evenements: ['tel-dan', 'exil', 'second-temple', 'temple-detruit'] },
      { id: 'jesus', theme: 'christianisme', groupe: 'Histoire du christianisme', nom: 'Jésus et les premiers chrétiens', evenements: ['naissance-jesus', 'mort-jesus', 'paul', 'constantin'] },
      { id: 'eglise', theme: 'christianisme', groupe: 'Histoire du christianisme', nom: 'L’Église à travers les siècles', evenements: ['nicee', 'schisme', 'reforme', 'vatican-2'] },
    ],
  },
  {
    id: 'aujourdhui',
    nom: "Aujourd'hui",
    sousTitre: "Depuis 1945, jusqu'à nous.",
    libelleChoix: 'Choisir un thème',
    loupe: { libelle: 'Si les années depuis 1900 tenaient en un an', depuisAns: 126 },
    categories: [
      { id: 'espace', theme: 'espace', nom: 'La conquête spatiale', periode: 'depuis 1957', evenements: ['spoutnik', 't-laika', 'gagarine', 't-terechkova', 'apollo', 't-voyager', 't-hubble', 'iss', 't-curiosity', 't-falcon', 'webb', 't-artemis'] },
      { id: 'numerique', theme: 'numerique', nom: 'Le numérique', periode: 'depuis 1946', evenements: ['t-eniac', 't-transistor', 't-puce', 't-arpanet', 't-microprocesseur', 't-pc', 'web', 't-google', 't-wikipedia', 't-reseaux', 'a-iphone', 'a-ia'] },
      { id: 'sante', theme: 'sante', nom: 'Médecine et santé', periode: 'depuis 1953', evenements: ['adn', 't-polio', 't-pilule', 't-greffe', 't-scanner', 't-fiv', 't-variole', 't-vih', 'genome', 't-crispr', 't-arnm'] },
      { id: 'energie', theme: 'energie', nom: 'Énergie et climat', periode: 'depuis 1954', evenements: ['t-nucleaire', 't-petrole', 't-tchernobyl', 't-giec', 't-kyoto', 't-fukushima', 't-paris'] },
      { id: 'transports', theme: 'transports', nom: 'Les transports', periode: 'depuis 1958', evenements: ['t-boeing707', 't-shinkansen', 't-concorde', 't-boeing747', 't-tgv', 't-tunnel'] },
      { id: 'monde', theme: 'monde', nom: 'Le monde depuis 1945', periode: 'depuis 1945', evenements: ['onu', 'droits', 'rome-1957', 'mur', 'a-11-septembre', 'a-covid'] },
    ],
  },
];
