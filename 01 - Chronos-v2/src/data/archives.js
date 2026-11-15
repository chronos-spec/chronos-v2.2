// Les événements repris de l'ancienne version (archives « chronos-final »).
// Titre, date et un court résumé. Les fiches complètes (image, source) viendront plus tard.
// Les doublons des cartes déjà rédigées n'ont pas été repris.
// Quelques dates de l'ancienne version ont été corrigées (signalé par « corrigé » en commentaire).
// ans = années avant aujourd'hui (2026).

export const ARCHIVES = [
  // ---------- Univers ----------
  { id: 'a-reionisation', titre: 'Les étoiles éclairent l’univers', dateCourte: '~13 milliards d’années', ans: 13.0e9,
    resume: 'La lumière des premières étoiles et galaxies arrache les électrons du gaz entre les galaxies : le brouillard d’hydrogène se dissipe.' }, // corrigé : ce n'est pas le moment où l'univers devient transparent (380 000 ans)
  { id: 'a-supernovae', titre: 'Les supernovæ sèment les atomes', dateCourte: 'dès les premières étoiles', ans: 13.4e9,
    resume: 'En explosant, les étoiles géantes dispersent le carbone, l’oxygène et le fer qu’elles ont fabriqués. De nouvelles étoiles naissent de ces débris.' },
  { id: 'a-voie-lactee', titre: 'Notre galaxie, la Voie lactée, se forme', dateCourte: '~13 à 10 milliards d’années', ans: 1.2e10,
    resume: 'La Voie lactée grandit peu à peu en avalant du gaz et de plus petites galaxies.' },

  // ---------- Terre ----------
  { id: 'a-bombardement', titre: 'Une pluie de météorites', dateCourte: '~4,1 milliards d’années', ans: 4.1e9,
    resume: 'La jeune Terre et la Lune sont bombardées par des astéroïdes. Les cratères de la Lune en gardent la trace. L’intensité exacte de ce « grand bombardement » est encore discutée.' },
  { id: 'a-continents', titre: 'Les premiers continents', dateCourte: '~3,8 milliards d’années', ans: 3.8e9,
    resume: 'Des morceaux de croûte légère émergent de l’océan mondial : les premiers noyaux de continents.' },
  { id: 'a-tectonique', titre: 'Les plaques se mettent en mouvement', dateCourte: '~3 milliards d’années', ans: 3.0e9,
    resume: 'La surface de la Terre se découpe en plaques qui glissent les unes contre les autres. La date exacte fait encore débat.' },
  { id: 'a-huronienne', titre: 'La première grande glaciation', dateCourte: '~2,4 à 2,1 milliards d’années', ans: 2.4e9,
    resume: 'Juste après l’arrivée de l’oxygène, la Terre se refroidit fortement. Une grande partie de la planète se couvre de glace.' },
  { id: 'a-pangee', titre: 'La Pangée, un seul supercontinent', dateCourte: '~335 millions d’années', ans: 3.35e8,
    resume: 'Tous les continents se soudent en une seule terre géante, entourée d’un unique océan.' }, // corrigé (300 Ma)
  { id: 'a-pangee-fin', titre: 'La Pangée se déchire', dateCourte: '~200 millions d’années', ans: 2.0e8,
    resume: 'Le supercontinent se fend. L’océan Atlantique commence à s’ouvrir : les continents actuels se dessinent.' },
  { id: 'a-himalaya', titre: 'L’Inde percute l’Asie : l’Himalaya', dateCourte: '~50 millions d’années', ans: 5.0e7,
    resume: 'L’Inde, qui remonte vers le nord, heurte l’Asie. Le choc soulève peu à peu la plus haute chaîne de montagnes du monde.' }, // corrigé (65 Ma)

  // ---------- Vie ----------
  { id: 'a-molecules', titre: 'Les premières molécules du vivant', dateCourte: '~3,8 milliards d’années (hypothèse)', ans: 3.8e9,
    resume: 'Des molécules capables de se copier elles-mêmes seraient apparues dans l’océan primitif. C’est une hypothèse : aucune trace directe n’a été trouvée.' },
  { id: 'a-cyanobacteries', titre: 'Les cyanobactéries', dateCourte: '~2,7 milliards d’années', ans: 2.7e9,
    resume: 'Ces bactéries utilisent la lumière du Soleil et rejettent de l’oxygène. Elles vont changer l’air de toute la planète.' },
  { id: 'a-sexe', titre: 'La reproduction sexuée', dateCourte: '~1,2 milliard d’années', ans: 1.2e9,
    resume: 'Deux parents mélangent leurs gènes. Les enfants sont tous différents : l’évolution s’accélère.' },
  { id: 'a-poissons', titre: 'Les premiers poissons', dateCourte: '~520 millions d’années', ans: 5.2e8,
    resume: 'Les premiers vertébrés sont de petits poissons sans mâchoire, dans les mers du Cambrien.' },
  { id: 'a-ext-ordovicien', titre: 'L’extinction de l’Ordovicien', dateCourte: '~445 millions d’années', ans: 4.45e8,
    resume: 'Une glaciation brutale fait disparaître environ 85 % des espèces marines. C’est la deuxième plus grande extinction.' }, // corrigé (430 Ma)
  { id: 'a-machoires', titre: 'Les poissons à mâchoires', dateCourte: '~435 millions d’années', ans: 4.35e8,
    resume: 'Des poissons se dotent de mâchoires : ils peuvent mordre et chasser de plus grosses proies.' },
  { id: 'a-insectes', titre: 'Les premiers insectes', dateCourte: '~400 millions d’années', ans: 4.0e8,
    resume: 'Les insectes apparaissent sur la terre ferme. Ils deviendront le groupe d’animaux le plus varié.' },
  { id: 'a-ext-devonien', titre: 'L’extinction du Dévonien', dateCourte: '~372 millions d’années', ans: 3.72e8,
    resume: 'Les mers perdent une grande partie de leurs espèces, surtout les récifs. La vie sur la terre ferme résiste mieux.' }, // corrigé (360 Ma)
  { id: 'a-forets', titre: 'Les forêts du Carbonifère', dateCourte: '~350 millions d’années', ans: 3.5e8,
    resume: 'D’immenses forêts de fougères géantes couvrent les marais. Leur bois enfoui deviendra le charbon.' },
  { id: 'a-reptiles', titre: 'Les premiers reptiles', dateCourte: '~312 millions d’années', ans: 3.12e8,
    resume: 'Avec l’œuf à coquille, les reptiles n’ont plus besoin de l’eau pour pondre : ils conquièrent les terres.' },
  { id: 'a-mammiferes', titre: 'Les premiers mammifères', dateCourte: '~225 millions d’années', ans: 2.25e8,
    resume: 'De petits animaux à poils, sans doute nocturnes, vivent dans l’ombre des dinosaures.' },
  { id: 'a-ext-trias', titre: 'L’extinction de la fin du Trias', dateCourte: '~201 millions d’années', ans: 2.01e8,
    resume: 'Environ trois espèces sur quatre disparaissent. Les dinosaures en profitent pour dominer.' },
  { id: 'a-grands-singes', titre: 'Les premiers grands singes', dateCourte: '~23 millions d’années', ans: 2.3e7,
    resume: 'Les premiers singes sans queue, ancêtres des gorilles, chimpanzés et humains, vivent en Afrique.' },
  { id: 'a-glaciations', titre: 'Le temps des grandes glaciations', dateCourte: 'depuis 2,6 millions d’années', ans: 2.58e6,
    resume: 'Le climat bascule sans cesse entre périodes glaciaires et périodes plus douces. Mammouths et grands cerfs peuplent l’Europe gelée.' }, // corrigé (5 Ma)

  // ---------- Humains (la Préhistoire) ----------
  { id: 'a-australopitheques', titre: 'Les australopithèques', dateCourte: '~4,2 millions d’années', ans: 4.2e6,
    resume: 'Ces cousins de nos ancêtres marchent debout en Afrique, mais grimpent encore aux arbres. Leur cerveau a la taille de celui d’un chimpanzé.' },
  { id: 'a-habilis', titre: 'Homo habilis, « l’homme habile »', dateCourte: '~2,4 millions d’années', ans: 2.4e6,
    resume: 'Un des premiers humains du genre Homo. On lui a longtemps attribué les premiers outils.' },
  { id: 'a-biface', titre: 'Le biface', dateCourte: '~1,76 million d’années', ans: 1.76e6,
    resume: 'Un outil en pierre taillé sur ses deux faces, symétrique et tranchant. Il sera utilisé pendant plus d’un million d’années.' }, // corrigé (1,5 Ma)
  { id: 'a-parures', titre: 'Les premières parures', dateCourte: '~100 000 ans', ans: 1.0e5,
    resume: 'Des coquillages percés et de l’ocre rouge : on se décore, on se distingue. La pensée symbolique est là.' },
  { id: 'a-australie', titre: 'Les humains atteignent l’Australie', dateCourte: '~50 000 ans', ans: 5.0e4,
    resume: 'Il a fallu traverser la mer en bateau ou en radeau pour y arriver.' },
  { id: 'a-venus', titre: 'La Vénus de Willendorf', dateCourte: '~30 000 ans', ans: 3.0e4,
    resume: 'Une petite statuette de femme en pierre, trouvée en Autriche. Elle montre une pensée et un art déjà riches.' }, // corrigé (20 000 ans)
  { id: 'a-ameriques', titre: 'Les humains arrivent en Amérique', dateCourte: 'il y a au moins 16 000 ans', ans: 1.6e4,
    resume: 'Venus d’Asie par la Béringie, des chasseurs gagnent l’Amérique. Des empreintes de pas pourraient faire remonter cette arrivée à plus de 20 000 ans.' },
  { id: 'a-domestication', titre: 'Les premiers troupeaux', dateCourte: '~10 500 ans', ans: 1.05e4,
    resume: 'Moutons, chèvres, porcs et bœufs sont domestiqués au Proche-Orient. Le chien, lui, accompagnait déjà les chasseurs.' },
  { id: 'a-catal', titre: 'Çatal Höyük, un des premiers gros villages', dateCourte: 'vers 7100 av. J.-C.', ans: 9126,
    resume: 'En Turquie, des milliers de personnes vivent dans des maisons collées les unes aux autres, décorées de peintures.' }, // corrigé (5500 av. J.-C.)
  { id: 'a-megalithes', titre: 'Les mégalithes', dateCourte: 'vers 4800 av. J.-C.', ans: 6826,
    resume: 'Dolmens et menhirs se dressent en Europe de l’Ouest, notamment en Bretagne.' },
  { id: 'a-roue', titre: 'La roue', dateCourte: 'vers 3500 av. J.-C.', ans: 5526,
    resume: 'La roue apparaît en Mésopotamie et en Europe, d’abord pour les chariots et les tours de potier.' }, // corrigé (4500 av. J.-C.)

  // ---------- Histoire ----------
  { id: 'a-egypte', titre: 'L’Égypte unifiée', dateCourte: 'vers 3100 av. J.-C.', ans: 5126,
    resume: 'Le roi Narmer réunit la Haute et la Basse-Égypte en un seul royaume.' },
  { id: 'a-akkad', titre: 'Akkad, le premier empire', dateCourte: 'vers 2330 av. J.-C.', ans: 4356,
    resume: 'Sargon d’Akkad réunit les cités de Mésopotamie sous un seul pouvoir.' },
  { id: 'a-hammurabi', titre: 'Le code de Hammurabi', dateCourte: 'vers 1750 av. J.-C.', ans: 3776,
    resume: 'Le roi de Babylone fait graver près de 300 lois sur une grande stèle de pierre.' }, // corrigé (2100 av. J.-C.)
  { id: 'a-troie', titre: 'La guerre de Troie', dateCourte: 'vers 1200 av. J.-C.', ans: 3226,
    resume: 'Mi-histoire, mi-légende, elle inspire l’Iliade et l’Odyssée d’Homère.' },
  { id: 'a-alphabet', titre: 'L’alphabet phénicien', dateCourte: 'vers 1050 av. J.-C.', ans: 3076,
    resume: 'Une vingtaine de lettres suffisent pour tout écrire. Il est l’ancêtre des alphabets grec et latin.' }, // corrigé (1500 av. J.-C.)
  { id: 'a-rome', titre: 'La fondation de Rome', dateCourte: '753 av. J.-C. (selon la tradition)', ans: 2778,
    resume: 'Selon la légende, Romulus fonde Rome sur le Palatin.' },
  { id: 'a-bouddha', titre: 'Le Bouddha', dateCourte: 'vers le Ve siècle av. J.-C.', ans: 2500,
    resume: 'En Inde, Siddhartha Gautama enseigne une voie pour se libérer de la souffrance : le bouddhisme.' },
  { id: 'a-mediques', titre: 'Les guerres médiques', dateCourte: '490 à 479 av. J.-C.', ans: 2515,
    resume: 'Marathon, les Thermopyles, Salamine : les cités grecques repoussent l’Empire perse.' },
  { id: 'a-alexandre', titre: 'Alexandre le Grand', dateCourte: '336 à 323 av. J.-C.', ans: 2361,
    resume: 'En treize ans, il conquiert un empire de la Grèce jusqu’à l’Inde.' },
  { id: 'a-qin', titre: 'La Chine unifiée', dateCourte: '221 av. J.-C.', ans: 2246,
    resume: 'Qin Shi Huang devient le premier empereur de Chine.' },
  { id: 'a-cesar', titre: 'L’assassinat de Jules César', dateCourte: '44 av. J.-C.', ans: 2069,
    resume: 'Sa mort ouvre une guerre civile qui met fin à la République romaine.' },
  { id: 'a-islam', titre: 'Mahomet et la naissance de l’islam', dateCourte: 'vers 610 à 632', ans: 1416,
    resume: 'En Arabie, Mahomet prêche une nouvelle religion. Un siècle plus tard, l’islam s’étend de l’Espagne à l’Inde.' },
  { id: 'a-croisades', titre: 'Les croisades', dateCourte: '1096 à 1291', ans: 930,
    resume: 'Des chevaliers d’Europe partent conquérir Jérusalem. Guerres, mais aussi échanges entre l’Orient et l’Occident.' },
  { id: 'a-magna-carta', titre: 'La Grande Charte', dateCourte: '1215', ans: 811,
    resume: 'En Angleterre, les barons obligent le roi à respecter des règles : un premier pas vers les libertés.' },
  { id: 'a-constantinople', titre: 'La chute de Constantinople', dateCourte: '1453', ans: 573,
    resume: 'Les Ottomans prennent la ville : c’est la fin de l’Empire byzantin.' },
  { id: 'a-copernic', titre: 'Copernic place le Soleil au centre', dateCourte: '1543', ans: 483,
    resume: 'La Terre tourne autour du Soleil, et non l’inverse.' },
  { id: 'a-industrie', titre: 'La révolution industrielle', dateCourte: 'à partir de 1760 environ', ans: 266,
    resume: 'La machine à vapeur et les usines changent le travail, les transports et les villes.' },
  { id: 'a-usa', titre: 'L’indépendance des États-Unis', dateCourte: '1776', ans: 250,
    resume: 'Les colonies anglaises d’Amérique se déclarent libres et proclament les droits naturels.' }, // corrigé (date de l'ancienne version)
  { id: 'a-napoleon', titre: 'Napoléon empereur', dateCourte: '2 décembre 1804', ans: 222,
    resume: 'Napoléon se fait sacrer empereur des Français à Notre-Dame de Paris.' },
  { id: 'a-waterloo', titre: 'Waterloo', dateCourte: '1815', ans: 211,
    resume: 'La défaite de Napoléon met fin à son empire.' },
  { id: 'a-darwin', titre: 'Darwin et l’évolution', dateCourte: '1859', ans: 167,
    resume: 'Dans « L’Origine des espèces », Darwin explique comment les êtres vivants changent au fil des générations.' },
  { id: 'a-allemagne', titre: 'L’Allemagne unifiée', dateCourte: '1871', ans: 155,
    resume: 'Autour de la Prusse, les États allemands forment un seul empire.' },
  { id: 'a-eiffel', titre: 'La tour Eiffel', dateCourte: '1889', ans: 137,
    resume: 'Construite pour l’Exposition universelle de Paris, elle devient un symbole de la modernité.' },
  { id: 'a-einstein', titre: 'Einstein et la relativité', dateCourte: '1905', ans: 121,
    resume: 'Einstein montre que le temps et l’espace ne sont pas les mêmes pour tous : E = mc².' },
  { id: 'a-russie', titre: 'La révolution russe', dateCourte: '1917', ans: 109,
    resume: 'Les bolcheviks de Lénine prennent le pouvoir. L’URSS naîtra en 1922.' },
  { id: 'a-crise-1929', titre: 'La crise de 1929', dateCourte: '1929', ans: 97,
    resume: 'Le krach de la Bourse de New York entraîne le monde dans une grave crise économique.' },
  { id: 'a-bombe', titre: 'La bombe atomique', dateCourte: 'août 1945', ans: 81,
    resume: 'Hiroshima et Nagasaki sont détruites. L’humanité peut désormais s’autodétruire.' },

  // ---------- Aujourd'hui ----------
  { id: 'a-11-septembre', titre: 'Les attentats du 11 septembre', dateCourte: '2001', ans: 25,
    resume: 'Des avions détournés frappent New York et Washington. Près de 3 000 morts.' },
  { id: 'a-iphone', titre: 'Le smartphone pour tous', dateCourte: '2007', ans: 19,
    resume: 'L’iPhone popularise le téléphone tactile : Internet tient désormais dans la poche.' },
  { id: 'a-covid', titre: 'La pandémie de Covid-19', dateCourte: '2020', ans: 6,
    resume: 'Le monde se confine. Plus de 7 millions de décès sont déclarés à l’OMS, et des vaccins sont créés en un temps record.' }, // corrigé (6 millions)
  { id: 'a-ia', titre: 'L’intelligence artificielle générative', dateCourte: '2022', ans: 4,
    resume: 'Des programmes capables d’écrire et de dessiner deviennent accessibles à tous.' },
];
