// Événements « légers » : titre et date seulement.
// Leurs fiches complètes (texte, image, source) seront rédigées plus tard.
// ans = années avant aujourd'hui (null pour le récit biblique, qui n'a pas de date historique).
// nature : 'bible' (récit biblique) ou 'histoire' (fait daté par les historiens), pour l'histoire du christianisme.

export const EVENEMENTS = [
  // Univers
  { id: 'noyaux', titre: 'Les premiers noyaux d’atomes', dateCourte: '3 minutes après le Big Bang', ans: 13.8e9 },
  { id: 'acceleration', titre: 'L’expansion accélère', dateCourte: '~5 milliards d’années', ans: 5e9 },

  // Terre
  { id: 'oceans', titre: 'Le plus vieux cristal, les premiers océans', dateCourte: '4,4 milliards d’années', ans: 4.4e9 },
  { id: 'acasta', titre: 'Les plus vieilles roches', dateCourte: '~4 milliards d’années', ans: 4.0e9 },
  { id: 'fer-rubane', titre: 'Les roches de fer rubanées', dateCourte: 'dès ~3,8 milliards d’années', ans: 3.8e9 },
  { id: 'fin-archeen', titre: 'Fin de l’Archéen', dateCourte: '2,5 milliards d’années', ans: 2.5e9 },

  // Vie
  { id: 'noyau-cellule', titre: 'Les premières cellules à noyau', dateCourte: '+ de 1,5 milliard d’années', ans: 1.5e9 },
  { id: 'boule-neige', titre: 'La Terre « boule de neige »', dateCourte: '~720 à 635 millions d’années', ans: 7.2e8 },
  { id: 'ediacara', titre: 'Les êtres d’Ediacara', dateCourte: '~575 millions d’années', ans: 5.75e8 },
  { id: 'plantes', titre: 'Les plantes sur la terre ferme', dateCourte: '~470 millions d’années', ans: 4.7e8 },
  { id: 'tiktaalik', titre: 'Un poisson sort de l’eau', dateCourte: '~375 millions d’années', ans: 3.75e8 },
  { id: 'permien', titre: 'La plus grande extinction', dateCourte: '252 millions d’années', ans: 2.52e8 },
  { id: 'premiers-dinos', titre: 'Les premiers dinosaures', dateCourte: '~230 millions d’années', ans: 2.3e8 },
  { id: 'archaeopteryx', titre: 'Archaeopteryx', dateCourte: '~150 millions d’années', ans: 1.5e8 },
  { id: 'fleurs', titre: 'Les premières fleurs', dateCourte: '~130 millions d’années', ans: 1.3e8 },
  { id: 'primates', titre: 'Un des premiers primates', dateCourte: '~55 millions d’années', ans: 5.5e7 },
  { id: 'antarctique', titre: 'L’Antarctique se couvre de glace', dateCourte: '~34 millions d’années', ans: 3.4e7 },

  // Humains
  { id: 'toumai', titre: 'Toumaï, au Tchad', dateCourte: '~7 millions d’années', ans: 7e6 },
  { id: 'outils', titre: 'Les plus vieux outils en pierre', dateCourte: '3,3 millions d’années', ans: 3.3e6 },
  { id: 'lucy', titre: 'Lucy', dateCourte: '3,2 millions d’années', ans: 3.2e6 },
  { id: 'erectus', titre: 'Homo erectus, le grand marcheur', dateCourte: '~1,9 million d’années', ans: 1.9e6 },
  { id: 'dmanissi', titre: 'Premiers humains hors d’Afrique', dateCourte: '~1,8 million d’années', ans: 1.8e6 },
  { id: 'neandertal', titre: 'La lignée de Néandertal', dateCourte: '~430 000 ans', ans: 430000 },
  { id: 'flores', titre: 'L’« homme de Florès »', dateCourte: '~100 000 à 60 000 ans', ans: 80000 },
  { id: 'denisova', titre: 'Les Dénisoviens', dateCourte: '~50 000 ans (le doigt)', ans: 50000 },
  { id: 'fin-neandertal', titre: 'Néandertal disparaît', dateCourte: '~40 000 ans', ans: 40000 },
  { id: 'afrique', titre: 'Le grand départ d’Afrique', dateCourte: '~60 000 ans', ans: 60000 },
  { id: 'agriculture', titre: 'Les premiers agriculteurs', dateCourte: '~11 500 ans', ans: 11500 },

  // Histoire — grandes périodes
  { id: 'athenes', titre: 'La démocratie à Athènes', dateCourte: '508 av. J.-C.', ans: 2533 },
  { id: 'auguste', titre: 'Auguste, premier empereur romain', dateCourte: '27 av. J.-C.', ans: 2052 },
  { id: 'chute-rome', titre: 'Fin de l’Empire romain d’Occident', dateCourte: '476', ans: 1550 },
  { id: 'charlemagne', titre: 'Charlemagne empereur', dateCourte: '800', ans: 1226 },
  { id: 'peste', titre: 'La peste noire', dateCourte: '1347 à 1352', ans: 679 },
  { id: 'colomb', titre: 'Colomb atteint l’Amérique', dateCourte: '1492', ans: 534 },
  { id: 'galilee', titre: 'Galilée observe le ciel', dateCourte: '1610', ans: 416 },
  { id: 'newton', titre: 'Newton explique la gravitation', dateCourte: '1687', ans: 339 },
  { id: 'revolution', titre: 'La Révolution française', dateCourte: '1789', ans: 237 },
  { id: 'guerre-14', titre: 'La Première Guerre mondiale', dateCourte: '1914 à 1918', ans: 112 },
  { id: 'guerre-39', titre: 'La Seconde Guerre mondiale', dateCourte: '1939 à 1945', ans: 87 },

  // Histoire du christianisme — selon la Bible
  { id: 'creation', titre: 'La Création', dateCourte: 'Genèse 1 et 2', ans: null, nature: 'bible' },
  { id: 'deluge', titre: 'Noé et le Déluge', dateCourte: 'Genèse 6 à 9', ans: null, nature: 'bible' },
  { id: 'abraham', titre: 'Abraham', dateCourte: 'Genèse 12', ans: null, nature: 'bible' },
  { id: 'moise', titre: 'Moïse et la sortie d’Égypte', dateCourte: 'Exode', ans: null, nature: 'bible' },
  { id: 'david', titre: 'Les rois David et Salomon', dateCourte: 'Samuel, Rois', ans: null, nature: 'bible' },

  // Histoire du christianisme — faits historiques
  { id: 'tel-dan', titre: 'La « maison de David » gravée', dateCourte: '~IXe s. av. J.-C.', ans: 2866, nature: 'histoire' },
  { id: 'exil', titre: 'L’exil à Babylone', dateCourte: '587 av. J.-C.', ans: 2612, nature: 'histoire' },
  { id: 'second-temple', titre: 'Le second Temple', dateCourte: '~515 av. J.-C.', ans: 2540, nature: 'histoire' },
  { id: 'temple-detruit', titre: 'Les Romains détruisent le Temple', dateCourte: '70', ans: 1956, nature: 'histoire' },
  { id: 'naissance-jesus', titre: 'Naissance de Jésus', dateCourte: 'vers 6 à 4 av. J.-C.', ans: 2030, nature: 'histoire' },
  { id: 'mort-jesus', titre: 'Mort de Jésus à Jérusalem', dateCourte: 'vers 30', ans: 1996, nature: 'histoire' },
  { id: 'paul', titre: 'Les lettres de Paul', dateCourte: 'vers 50', ans: 1976, nature: 'histoire' },
  { id: 'constantin', titre: 'Constantin autorise le christianisme', dateCourte: '313', ans: 1713, nature: 'histoire' },
  { id: 'nicee', titre: 'Le concile de Nicée', dateCourte: '325', ans: 1701, nature: 'histoire' },
  { id: 'schisme', titre: 'Catholiques et orthodoxes se séparent', dateCourte: '1054', ans: 972, nature: 'histoire' },
  { id: 'reforme', titre: 'Luther et la Réforme', dateCourte: '1517', ans: 509, nature: 'histoire' },
  { id: 'vatican-2', titre: 'Le concile Vatican II', dateCourte: '1962 à 1965', ans: 64, nature: 'histoire' },

  // Aujourd'hui
  { id: 'spoutnik', titre: 'Spoutnik, premier satellite', dateCourte: '1957', ans: 69 },
  { id: 'gagarine', titre: 'Gagarine, premier homme dans l’espace', dateCourte: '1961', ans: 65 },
  { id: 'iss', titre: 'La Station spatiale internationale', dateCourte: '1998', ans: 28 },
  { id: 'onu', titre: 'Naissance de l’ONU', dateCourte: '1945', ans: 81 },
  { id: 'droits', titre: 'Déclaration universelle des droits de l’homme', dateCourte: '1948', ans: 78 },
  { id: 'rome-1957', titre: 'Le traité de Rome', dateCourte: '1957', ans: 69 },
  { id: 'mur', titre: 'La chute du mur de Berlin', dateCourte: '1989', ans: 37 },
  { id: 'adn', titre: 'La double hélice de l’ADN', dateCourte: '1953', ans: 73 },
  { id: 'web', titre: 'Le Web est inventé', dateCourte: '1991', ans: 35 },
  { id: 'genome', titre: 'Le génome humain lu en entier', dateCourte: '2003', ans: 23 },
];
