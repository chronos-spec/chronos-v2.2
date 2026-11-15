// Les fiches des périodes, reprises de l'ancienne version (archives « chronos-final ») et relues.
// Clé = identifiant de la catégorie (etages.js). On ouvre la fiche en touchant le nom de la période sur la ligne.
// « autresNoms » : les noms de l'ancienne version, pour que la recherche les trouve.

export const PERIODES = {
  // Univers (l'ancienne ère « Cosmique »)
  'premiers-instants': {
    autresNoms: ['Cosmique', 'ère cosmique'],
    resume: 'De 13,8 à 4,6 milliards d’années : naissance de l’espace, du temps, des étoiles et des galaxies.',
    points: ['Le Big Bang', 'La lumière se libère', 'Les premiers atomes'],
  },
  'etoiles-galaxies': {
    resume: 'Les premières étoiles s’allument, explosent et sèment les atomes dont nous sommes faits. Les galaxies se forment, dont la nôtre.',
    points: ['Premières étoiles', 'Premières galaxies', 'La Voie lactée', 'L’expansion accélère'],
  },

  // Terre
  hadeen: {
    resume: 'De 4,6 à 4 milliards d’années : la Terre en fusion, bombardée de météorites. La Lune naît d’un choc géant. Aucune vie possible.',
    points: ['Formation de la Terre', 'Le choc qui donne la Lune', 'Les premiers océans'],
  },
  archeen: {
    resume: 'De 4 à 2,5 milliards d’années : premiers continents et premières traces de vie. L’air ne contient pas d’oxygène.',
    points: ['Premiers continents', 'Stromatolites', 'Les plaques se mettent en mouvement'],
  },
  'terre-proterozoique': {
    resume: 'De 2,5 milliards à 539 millions d’années : l’oxygène envahit l’air, la Terre gèle à plusieurs reprises.',
    points: ['La grande oxydation', 'Les glaciations géantes'],
  },
  'terre-phanerozoique': {
    autresNoms: ['Phanérozoïque'],
    resume: 'Depuis 539 millions d’années : les continents dérivent, se soudent en Pangée puis se séparent jusqu’à la carte actuelle.',
    points: ['La Pangée', 'L’ouverture de l’Atlantique', 'La naissance de l’Himalaya'],
  },

  // Vie
  'vie-archeen': {
    resume: 'De 4 à 2,5 milliards d’années : la vie apparaît, sous forme de microbes. Les cyanobactéries commencent à produire de l’oxygène.',
    points: ['Premières traces de vie', 'Stromatolites', 'Cyanobactéries'],
  },
  'vie-proterozoique': {
    autresNoms: ['Protérozoïque'],
    resume: 'De 2,5 milliards à 539 millions d’années : la grande oxydation transforme l’air. Apparaissent les cellules à noyau, la reproduction sexuée, puis les premiers grands êtres vivants.',
    points: ['Grande oxydation', 'Cellules à noyau', 'Reproduction sexuée', 'Faune d’Ediacara'],
  },
  cambrien: {
    autresNoms: ['Paléozoïque', 'ère primaire'],
    resume: 'De 539 à 485 millions d’années : en quelques millions d’années, presque tous les grands types d’animaux apparaissent.',
    points: ['Premiers arthropodes', 'Premiers mollusques', 'Premiers vertébrés'],
  },
  ordovicien: {
    resume: 'De 485 à 444 millions d’années : la vie se diversifie dans les mers. Les premières plantes gagnent la terre. Une glaciation provoque la deuxième plus grande extinction.',
    points: ['Explosion de la vie marine', 'Premières plantes terrestres', 'Extinction de la fin de l’Ordovicien'],
  },
  silurien: {
    resume: 'De 444 à 419 millions d’années : la vie s’installe sur la terre ferme. Premiers poissons à mâchoires, premières plantes à tiges.',
    points: ['Plantes vasculaires', 'Poissons à mâchoires', 'Coraux et récifs'],
  },
  devonien: {
    resume: 'De 419 à 359 millions d’années : « l’âge des poissons ». Les premiers vertébrés à quatre pattes sortent de l’eau. Premières forêts.',
    points: ['Tiktaalik', 'Premiers insectes', 'Premières forêts', 'Extinction du Dévonien'],
  },
  carbonifere: {
    resume: 'De 359 à 299 millions d’années : forêts géantes qui deviendront le charbon, premiers reptiles, insectes géants dans un air très riche en oxygène.',
    points: ['Fougères géantes', 'Premiers reptiles', 'Libellules de 70 cm'],
  },
  permien: {
    resume: 'De 299 à 252 millions d’années : les continents forment la Pangée. Il se termine par la plus grande extinction de l’histoire : plus de 9 espèces marines sur 10 disparaissent.',
    points: ['La Pangée', 'Les ancêtres des mammifères', 'La grande extinction'],
  },
  trias: {
    autresNoms: ['Mésozoïque', 'ère secondaire'],
    resume: 'De 252 à 201 millions d’années : la vie renaît après la grande extinction. Apparaissent les dinosaures et les mammifères.',
    points: ['Premiers dinosaures', 'Premiers mammifères', 'Premiers ptérosaures'],
  },
  jurassique: {
    resume: 'De 201 à 145 millions d’années : l’âge d’or des dinosaures géants. Les premiers oiseaux apparaissent.',
    points: ['Diplodocus', 'Stégosaure', 'Archaeopteryx'],
  },
  cretace: {
    resume: 'De 145 à 66 millions d’années : les fleurs apparaissent, les dinosaures règnent, jusqu’à la chute d’un astéroïde.',
    points: ['Tyrannosaure et tricératops', 'Premières fleurs', 'L’astéroïde de Chicxulub'],
  },
  paleogene: {
    autresNoms: ['Cénozoïque', 'ère tertiaire'],
    resume: 'De 66 à 23 millions d’années : les mammifères se diversifient très vite. Apparaissent primates, baleines et chauves-souris.',
    points: ['Explosion des mammifères', 'Premiers primates', 'L’Antarctique gèle'],
  },
  neogene: {
    resume: 'De 23 à 2,6 millions d’années : les continents prennent leur forme actuelle. Les prairies s’étendent. Apparaissent les grands singes, puis la lignée humaine.',
    points: ['Grands singes', 'Toumaï', 'Australopithèques'],
  },
  quaternaire: {
    resume: 'Depuis 2,6 millions d’années : les glaciations se succèdent. Le genre Homo, puis Homo sapiens, se répand sur toute la Terre.',
    points: ['Glaciations', 'Homo sapiens', 'Mammouths'],
  },

  // Humains (l'ancienne ère « Préhistoire »)
  ancetres: {
    autresNoms: ['Préhistoire'],
    resume: 'De 7 à 2,8 millions d’années : nos ancêtres se mettent debout en Afrique.',
    points: ['Toumaï', 'Les australopithèques', 'Lucy', 'Les premiers outils'],
  },
  neolithique: {
    autresNoms: ['Néolithique'],
    resume: 'De 11 500 à 5 300 ans : on cultive, on élève, on construit les premiers villages, puis les premières villes.',
    points: ['Agriculture', 'Élevage', 'Mégalithes', 'La roue'],
  },

  // Histoire
  antiquite: {
    autresNoms: ['Histoire'],
    resume: 'De l’invention de l’écriture (vers 3300 av. J.-C.) à la fin de l’Empire romain d’Occident (476).',
    points: ['L’écriture', 'Les pyramides', 'La Grèce classique', 'L’Empire romain'],
  },
  'moyen-age': {
    resume: 'De 476 à 1492 : châteaux, cathédrales, croisades et grandes épidémies.',
    points: ['Charlemagne', 'Les croisades', 'La peste noire', 'L’imprimerie'],
  },
  modernes: {
    resume: 'De 1492 à 1789 : grandes découvertes, Renaissance, révolution scientifique.',
    points: ['Colomb', 'La Réforme', 'Galilée et Newton'],
  },
  contemporaine: {
    autresNoms: ['XIXe siècle', 'XXe siècle'],
    resume: 'De 1789 à 1945 : révolutions, industrie, deux guerres mondiales.',
    points: ['La Révolution française', 'Napoléon', 'La révolution industrielle', 'Les deux guerres mondiales'],
  },
};
