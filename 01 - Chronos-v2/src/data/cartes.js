// Les 20 cartes de Chronos — vérifiées le 15/11/2026.
// Texte source : docs/03_Contenus/cartes.md (toute modification se fait là d'abord).
// ans = années avant aujourd'hui (sert à calculer la loupe du repère).

export const CARTES = [
  // 1 · Univers
  {
    id: 'big-bang', etage: 'univers', titre: 'Le Big Bang',
    date: "il y a 13,8 milliards d'années", dateCourte: '13,8 milliards d’années',
    ans: 13.8e9, cosmique: '1er janvier, 0 h 00',
    texte: "Tout l'univers était plus petit et plus chaud que tout ce qu'on peut imaginer. Puis il s'est mis à grandir, et il grandit encore aujourd'hui. Que s'est-il passé avant ? Personne ne le sait encore.",
    image: { type: 'illustration', description: "L'univers qui s'étend" },
    preuve: ['observation-astronomique'], certitude: 'etabli', // « Comment on le sait ? » (voir preuves.js)
    source: { texte: 'Planck Collaboration, Astronomy & Astrophysics 641, A6, 2020', url: 'https://doi.org/10.1051/0004-6361/201833910' },
  },
  {
    id: 'lumiere', etage: 'univers', titre: 'La lumière se libère',
    date: '380 000 ans après le Big Bang', dateCourte: '380 000 ans après',
    ans: 13.8e9 - 380000, cosmique: '1er janvier, 0 h 14',
    texte: "Au début, l'univers était une soupe si chaude que la lumière ne pouvait pas avancer. Après 380 000 ans, il s'est assez refroidi pour que les premiers atomes se forment et que la lumière file enfin droit. Cette lumière très affaiblie, on la capte encore aujourd'hui avec nos télescopes.",
    image: { type: 'photo', description: 'Carte du rayonnement fossile (ESA / Planck)' },
    preuve: ['observation-astronomique'], certitude: 'etabli', // « Comment on le sait ? » (voir preuves.js)
    source: { texte: 'Planck Collaboration, Astronomy & Astrophysics 641, A6, 2020', url: 'https://doi.org/10.1051/0004-6361/201833910' },
  },
  {
    id: 'etoiles', etage: 'univers', titre: 'Les premières étoiles',
    date: "il y a environ 13,6 milliards d'années", dateCourte: '~13,6 milliards d’années',
    ans: 13.6e9, cosmique: 'vers le 6 janvier',
    texte: "Pendant des millions d'années, l'univers est resté dans le noir. Puis d'énormes nuages de gaz se sont effondrés et se sont allumés : les premières étoiles. Elles ont fabriqué les premiers atomes plus lourds, comme le carbone et l'oxygène.",
    image: { type: 'illustration', description: 'Premières étoiles dans un ciel de gaz' },
    preuve: ['observation-astronomique'], certitude: 'approximatif', // « Comment on le sait ? » (voir preuves.js)
    source: { texte: 'V. Bromm et N. Yoshida, Annual Review of Astronomy and Astrophysics 49, 2011' },
  },
  {
    id: 'galaxies', etage: 'univers', titre: 'Les premières galaxies',
    date: "il y a plus de 13,5 milliards d'années", dateCourte: '+ de 13,5 milliards d’années',
    ans: 13.5e9, cosmique: 'vers le 8 janvier',
    texte: "Les étoiles se sont regroupées par milliards pour former des galaxies. En 2024, le télescope James Webb a observé une galaxie qui existait seulement 300 millions d'années environ après le Big Bang. Notre galaxie, la Voie lactée, compte plus de 100 milliards d'étoiles.",
    image: { type: 'photo', description: 'Champ profond du télescope James Webb (NASA / ESA / CSA)' },
    preuve: ['observation-astronomique'], certitude: 'etabli', // « Comment on le sait ? » (voir preuves.js)
    source: { texte: 'S. Carniani et al., Nature, 2024' },
  },

  // 2 · Terre
  {
    id: 'soleil', etage: 'terre', titre: "Le Soleil s'allume",
    date: "il y a environ 4,57 milliards d'années", dateCourte: '4,57 milliards d’années',
    ans: 4.57e9, cosmique: 'vers le 2 septembre',
    texte: "Un immense nuage de gaz et de poussière s'est effondré sur lui-même. Au centre, la matière s'est tassée et chauffée jusqu'à s'allumer : notre Soleil était né. À lui seul, il contient plus de 99 % de la matière du système solaire.",
    image: { type: 'illustration', description: 'Jeune Soleil entouré d’un disque de poussière' },
    preuve: ['datation-radiometrique'], certitude: 'etabli', // « Comment on le sait ? » (voir preuves.js)
    source: { texte: 'J. Connelly et al., Science 338, 2012' },
  },
  {
    id: 'terre-forme', etage: 'terre', titre: 'La Terre se forme',
    date: "il y a environ 4,54 milliards d'années", dateCourte: '4,54 milliards d’années',
    ans: 4.54e9, cosmique: 'vers le 2 septembre',
    texte: "Autour du jeune Soleil, des poussières se sont collées pour former des cailloux, puis des planètes. La jeune Terre était une boule de roche brûlante, bombardée de météorites. On connaît son âge grâce aux plus vieilles météorites, nées en même temps qu'elle.",
    image: { type: 'illustration', description: 'Terre en fusion' },
    preuve: ['datation-radiometrique'], certitude: 'etabli', // « Comment on le sait ? » (voir preuves.js)
    source: { texte: 'G. B. Dalrymple, Geological Society, Special Publications 190, 2001' },
  },
  {
    id: 'lune', etage: 'terre', titre: "La Lune naît d'un choc",
    date: "il y a environ 4,5 milliards d'années", dateCourte: '~4,5 milliards d’années',
    ans: 4.5e9, cosmique: 'vers le 3 septembre',
    texte: "Peu après sa naissance, la Terre aurait été percutée par une planète de la taille de Mars. Les débris projetés dans l'espace se seraient rassemblés pour former la Lune. C'est l'explication la plus admise, mais les scientifiques en débattent encore.",
    image: { type: 'illustration', description: 'Collision géante' },
    preuve: ['datation-radiometrique'], certitude: 'debattu', // « Comment on le sait ? » (voir preuves.js)
    source: { texte: 'R. Canup et E. Asphaug, Nature 412, 2001' },
  },

  // 3 · Vie
  {
    id: 'premiere-vie', etage: 'vie', titre: 'Les premières traces de vie',
    date: "il y a environ 3,5 milliards d'années (peut-être plus tôt)", dateCourte: '~3,5 milliards d’années',
    ans: 3.5e9, cosmique: 'vers le 30 septembre',
    texte: "Les plus anciennes traces de vie sûres sont des roches en couches, construites par des microbes au bord de l'eau. On les appelle des stromatolithes, et on en trouve en Australie. Il en existe encore aujourd'hui, toujours vivants !",
    image: { type: 'photo', description: 'Stromatolithes de Shark Bay, Australie' },
    preuve: ['fossile', 'datation-radiometrique'], certitude: 'approximatif', // « Comment on le sait ? » (voir preuves.js)
    source: { texte: 'A. Allwood et al., Nature 441, 2006' },
  },
  {
    id: 'oxygene', etage: 'vie', titre: "L'oxygène arrive",
    date: "il y a environ 2,4 milliards d'années", dateCourte: '~2,4 milliards d’années',
    ans: 2.4e9, cosmique: 'vers le 29 octobre',
    texte: "Des microbes appelés cyanobactéries ont appris à utiliser la lumière du Soleil, comme les plantes aujourd'hui. Ils ont rejeté de l'oxygène, qui s'est accumulé peu à peu dans l'air et les océans. Sans eux, nous ne pourrions pas respirer.",
    image: { type: 'photo', description: 'Cyanobactéries au microscope' },
    preuve: ['geochimie', 'datation-radiometrique'], certitude: 'approximatif', // « Comment on le sait ? » (voir preuves.js)
    source: { texte: 'T. Lyons, C. Reinhard et N. Planavsky, Nature 506, 2014' },
  },
  {
    id: 'cambrien', etage: 'vie', titre: "L'explosion cambrienne",
    date: "il y a environ 539 millions d'années", dateCourte: '~539 millions d’années',
    ans: 539e6, cosmique: '17 décembre',
    texte: "En quelques dizaines de millions d'années, les océans se remplissent d'animaux de toutes les formes. Apparaissent des yeux, des carapaces, des pattes… La plupart des grands groupes d'animaux actuels datent de cette époque.",
    image: { type: 'photo', description: 'Trilobite fossile' },
    preuve: ['fossile', 'datation-radiometrique'], certitude: 'etabli', // « Comment on le sait ? » (voir preuves.js)
    source: { texte: 'Commission internationale de stratigraphie, Charte chronostratigraphique internationale' },
  },
  {
    id: 'dinosaures', etage: 'vie', titre: 'La fin des dinosaures',
    date: "il y a 66 millions d'années", dateCourte: '66 millions d’années',
    ans: 66e6, cosmique: '30 décembre, vers 6 h',
    texte: "Un astéroïde d'environ 10 km de large s'écrase au Mexique, à Chicxulub. Le ciel s'assombrit et environ trois quarts des espèces disparaissent, dont les grands dinosaures. Mais pas tous : les oiseaux sont leurs descendants !",
    image: { type: 'illustration', description: "Impact de l'astéroïde" },
    preuve: ['datation-radiometrique', 'fossile'], certitude: 'etabli', // « Comment on le sait ? » (voir preuves.js)
    source: { texte: 'P. Schulte et al., Science 327, 2010' },
  },

  // 4 · Humains
  {
    id: 'homo', etage: 'humains', titre: 'Le genre Homo',
    date: "il y a environ 2,8 millions d'années", dateCourte: '2,8 millions d’années',
    ans: 2.8e6, cosmique: '31 décembre, 22 h 13',
    texte: "Une mâchoire trouvée en Éthiopie, à Ledi-Geraru, est le plus ancien fossile connu de notre genre, Homo. Ces premiers humains vivaient en Afrique et marchaient debout. Ils ne nous ressemblaient pas encore tout à fait.",
    image: { type: 'photo', description: 'Mâchoire LD 350-1' },
    preuve: ['fossile', 'datation-radiometrique'], certitude: 'approximatif', // « Comment on le sait ? » (voir preuves.js)
    source: { texte: 'B. Villmoare et al., Science 347, 2015' },
  },
  {
    id: 'feu', etage: 'humains', titre: 'Le feu maîtrisé',
    date: 'il y a au moins 400 000 ans (peut-être 1 million)', dateCourte: '400 000 ans au moins',
    ans: 400000, cosmique: '31 décembre, 23 h 45',
    texte: "Maîtriser le feu a tout changé : se chauffer, se protéger des bêtes, cuire les aliments. Des traces de feu vieilles d'environ un million d'années ont été trouvées dans une grotte d'Afrique du Sud. En Europe, son usage régulier date d'environ 400 000 ans.",
    image: { type: 'illustration', description: 'Foyer préhistorique' },
    preuve: ['archeologie'], certitude: 'debattu', // « Comment on le sait ? » (voir preuves.js)
    source: { texte: 'F. Berna et al., PNAS 109, 2012 ; W. Roebroeks et P. Villa, PNAS 108, 2011' },
  },
  {
    id: 'sapiens', etage: 'humains', titre: 'Les premiers Homo sapiens',
    date: 'il y a environ 300 000 ans', dateCourte: '300 000 ans',
    ans: 300000, cosmique: '31 décembre, 23 h 48',
    texte: "Les plus anciens fossiles de notre espèce ont été trouvés au Maroc, à Djebel Irhoud. Ces humains avaient déjà un visage comme le nôtre. Toute l'histoire humaine tient dans les 12 dernières minutes de l'année cosmique.",
    image: { type: 'photo', description: 'Site de Djebel Irhoud ou moulage de crâne' },
    preuve: ['fossile', 'luminescence'], certitude: 'approximatif', // « Comment on le sait ? » (voir preuves.js)
    source: { texte: 'J.-J. Hublin et al., Nature 546, 2017', url: 'https://www.nature.com/articles/nature22336' },
  },
  {
    id: 'chauvet', etage: 'humains', titre: 'La grotte Chauvet',
    date: 'il y a environ 36 000 ans', dateCourte: '~36 000 ans',
    ans: 36000, cosmique: '31 décembre, 23 h 58 min 38 s',
    texte: "En Ardèche, des artistes ont peint des lions, des chevaux et des rhinocéros sur les parois d'une grotte. Ce sont parmi les plus anciennes peintures connues au monde. La grotte est fermée pour la protéger, mais on peut visiter sa copie fidèle.",
    image: { type: 'photo', description: 'Panneau des chevaux' },
    preuve: ['carbone-14', 'archeologie'], certitude: 'etabli', // « Comment on le sait ? » (voir preuves.js)
    source: { texte: 'A. Quiles et al., PNAS 113, 2016' },
  },

  // 5 · Histoire
  {
    id: 'ecriture', etage: 'histoire', titre: "L'écriture",
    date: 'vers 3300 avant J.-C. (il y a environ 5 300 ans)', dateCourte: 'vers 3300 av. J.-C.',
    ans: 5326, cosmique: '31 décembre, 23 h 59 min 48 s',
    texte: "En Mésopotamie, l'actuel Irak, on note des comptes sur des tablettes d'argile. Les signes, tracés avec un roseau, ont la forme de petits clous : c'est l'écriture cunéiforme. Avec elle, on peut enfin laisser des traces pour le futur.",
    image: { type: 'photo', description: 'Tablette cunéiforme' },
    preuve: ['archeologie'], certitude: 'approximatif', // « Comment on le sait ? » (voir preuves.js)
    source: { texte: "J.-J. Glassner, Écrire à Sumer. L'invention du cunéiforme, Seuil, 2000" },
  },
  {
    id: 'kheops', etage: 'histoire', titre: 'La pyramide de Khéops',
    date: 'vers 2560 avant J.-C.', dateCourte: 'vers 2560 av. J.-C.',
    ans: 4586, cosmique: '31 décembre, 23 h 59 min 50 s',
    texte: "Le pharaon Khéops fait construire la plus grande pyramide d'Égypte, à Gizeh. Elle est restée le plus haut monument humain pendant près de 3 800 ans. Cléopâtre a vécu plus près de nous que de la construction de cette pyramide !",
    image: { type: 'photo', description: 'Pyramides de Gizeh' },
    preuve: ['texte-ancien', 'archeologie'], certitude: 'approximatif', // « Comment on le sait ? » (voir preuves.js)
    source: { texte: 'M. Lehner et Z. Hawass, Giza and the Pyramids, Thames & Hudson, 2017' },
  },
  {
    id: 'imprimerie', etage: 'histoire', titre: "L'imprimerie",
    date: 'vers 1455', dateCourte: 'vers 1455',
    ans: 571, cosmique: 'à 1,3 seconde de minuit',
    texte: "À Mayence, en Allemagne, Gutenberg imprime des livres avec des lettres en métal que l'on peut déplacer. Les livres, autrefois copiés à la main, se fabriquent bien plus vite et le savoir se répand dans toute l'Europe. En Chine et en Corée, des caractères mobiles existaient déjà depuis des siècles.",
    image: { type: 'photo', description: 'Page de la Bible de Gutenberg' },
    preuve: ['texte-ancien'], certitude: 'etabli', // « Comment on le sait ? » (voir preuves.js)
    source: { texte: "L. Febvre et H.-J. Martin, L'Apparition du livre, Albin Michel, 1958" },
  },

  // 6 · Aujourd'hui
  {
    id: 'apollo', etage: 'aujourdhui', titre: 'Un homme sur la Lune',
    date: '21 juillet 1969 (heure française)', dateCourte: '1969',
    ans: 57, cosmique: 'à un dixième de seconde de minuit',
    texte: "L'astronaute américain Neil Armstrong pose le pied sur la Lune. Des centaines de millions de personnes regardent l'événement à la télévision. Ses traces de pas y sont toujours : sur la Lune, il n'y a pas de vent pour les effacer.",
    image: { type: 'photo', description: 'Buzz Aldrin sur la Lune (NASA)' },
    preuve: ['archives'], certitude: 'etabli', // « Comment on le sait ? » (voir preuves.js)
    source: { texte: 'NASA, « Apollo 11 Mission Overview »' },
  },
  {
    id: 'webb', etage: 'aujourdhui', titre: 'Le télescope James Webb',
    date: 'lancé le 25 décembre 2021', dateCourte: '2021',
    ans: 5, cosmique: 'à un centième de seconde de minuit',
    texte: "Le plus grand télescope jamais envoyé dans l'espace observe le ciel à 1,5 million de kilomètres de la Terre. Il voit des galaxies nées peu après le Big Bang. L'histoire d’Odysseum fait une boucle : aujourd'hui, nous regardons nos origines.",
    image: { type: 'photo', description: 'Le télescope ou sa première image (NASA / ESA / CSA)' },
    preuve: ['archives'], certitude: 'etabli', // « Comment on le sait ? » (voir preuves.js)
    source: { texte: 'NASA et ESA, « James Webb Space Telescope »' },
  },
];
