// Les civilisations (page Histoire) : un menu pour n'afficher que l'une d'elles sur la ligne,
// et un récit à écouter (bouton ▶) qui résume son histoire en 2 à 3 minutes.
//
// Chaque civilisation : id, nom, region (pour ranger le menu), dates (texte), resume,
// evenements (ids des événements de la ligne Histoire), recit (une dizaine d'étapes).
// Une étape : [date, titre, texte, article Wikipédia pour l'image].
// Dates arrondies, « vers » quand elles sont approximatives. Sources : celles des mentions
// légales (BnF, Louvre, British Museum, UNESCO, Smithsonian, Archives nationales…).

export const REGIONS = [
  { id: 'orient', nom: 'Proche-Orient et Afrique du Nord antiques' },
  { id: 'mediterranee', nom: 'Méditerranée et Europe' },
  { id: 'afrique', nom: 'Afrique' },
  { id: 'asie', nom: 'Asie' },
  { id: 'ameriques', nom: 'Amériques' },
  { id: 'oceanie', nom: 'Océanie' },
];

export const CIVILISATIONS = [
  // ---------------- Proche-Orient et Afrique du Nord antiques ----------------
  {
    id: 'mesopotamie', nom: 'Mésopotamie (Sumer, Akkad, Babylone)', region: 'orient', dates: 'vers 3500 – 539 av. J.-C.',
    resume: 'Entre le Tigre et l’Euphrate naissent les premières villes, l’écriture et les premières lois écrites.',
    evenements: ['ecriture', 'a-akkad', 'a-hammurabi', 'deluge', 'exil', 'm-cyrus', 'a-roue'],
    recit: [
      ['vers 3500 av. J.-C.', 'Le pays entre deux fleuves', 'Mésopotamie veut dire « entre les fleuves » : le Tigre et l’Euphrate, dans l’actuel Irak. Grâce à l’irrigation, les paysans y récoltent beaucoup de grain, et les villages deviennent des villes, comme Uruk.', 'Mésopotamie'],
      ['vers 3300 av. J.-C.', 'L’invention de l’écriture', 'Pour compter les sacs de grain et les moutons, les Sumériens tracent des signes dans l’argile avec un roseau. C’est l’écriture cunéiforme, « en forme de clous ». L’histoire commence !', 'Cunéiforme'],
      ['vers 2600 av. J.-C.', 'Les cités-États de Sumer', 'Ur, Uruk ou Lagash sont des cités indépendantes, chacune avec son roi et son temple en escalier, la ziggourat. On y invente la roue de potier, l’école et les premiers récits, comme l’épopée de Gilgamesh.', 'Ziggourat d\'Ur'],
      ['vers 2330 av. J.-C.', 'Sargon et l’empire d’Akkad', 'Le roi Sargon d’Akkad réunit les cités sous son autorité. C’est souvent considéré comme le premier empire de l’histoire.', 'Empire d\'Akkad'],
      ['vers 1750 av. J.-C.', 'Hammurabi de Babylone', 'Le roi Hammurabi fait graver près de 300 lois sur une grande stèle de pierre, aujourd’hui au Louvre. Babylone devient une ville immense et célèbre.', 'Code de Hammurabi'],
      ['vers 900 – 612 av. J.-C.', 'L’Assyrie', 'Les rois assyriens, depuis Ninive, dominent tout le Proche-Orient grâce à une armée redoutable. Leur bibliothèque, à Ninive, conservait des milliers de tablettes.', 'Empire néo-assyrien'],
      ['587 av. J.-C.', 'Nabuchodonosor II', 'Le roi de Babylone prend Jérusalem et déporte une partie de ses habitants. Babylone est alors l’une des plus belles villes du monde, avec la porte d’Ishtar couverte de briques bleues.', 'Porte d\'Ishtar'],
      ['539 av. J.-C.', 'La fin d’un monde', 'Cyrus le Grand, roi des Perses, entre dans Babylone. La Mésopotamie devient une province de l’Empire perse. Mais son héritage reste : l’écriture, les lois, les heures de 60 minutes…', 'Cylindre de Cyrus'],
    ],
  },
  {
    id: 'egypte', nom: 'Égypte ancienne', region: 'orient', dates: 'vers 3100 – 30 av. J.-C.',
    resume: 'Pendant trois millénaires, les pharaons règnent sur la vallée du Nil : pyramides, hiéroglyphes et momies.',
    evenements: ['a-egypte', 'kheops', 'moise', 'a-alexandre', 'm-koush'],
    recit: [
      ['vers 3100 av. J.-C.', 'Un don du Nil', 'Chaque été, le Nil déborde et laisse une terre noire très fertile. Vers 3100 avant notre ère, le roi Narmer unit la Haute et la Basse-Égypte : c’est le début des pharaons.', 'Palette de Narmer'],
      ['vers 3200 av. J.-C.', 'Les hiéroglyphes', 'Les Égyptiens inventent leur propre écriture, faite de petits dessins : les hiéroglyphes. Les scribes écrivent aussi sur du papyrus, une plante des bords du Nil.', 'Hiéroglyphe'],
      ['vers 2560 av. J.-C.', 'Le temps des pyramides', 'Sous l’Ancien Empire, le pharaon Khéops fait construire la Grande Pyramide de Gizeh : 146 mètres de haut. Elle restera le plus haut monument du monde pendant près de 4 000 ans.', 'Pyramide de Khéops'],
      ['vers 2000 av. J.-C.', 'Le Moyen Empire', 'Après une période de troubles, l’Égypte se réunifie. On creuse des canaux, on écrit des contes et des leçons de sagesse.', 'Moyen Empire'],
      ['vers 1550 – 1070 av. J.-C.', 'Le Nouvel Empire', 'C’est l’âge d’or : la reine Hatchepsout, le jeune Toutânkhamon, et Ramsès II qui règne 66 ans. Les pharaons sont enterrés dans la Vallée des Rois.', 'Ramsès II'],
      ['La vie éternelle', 'Dieux et momies', 'Les Égyptiens croient à une vie après la mort. Ils momifient les corps pour les conserver, et prient de nombreux dieux : Rê le soleil, Osiris, Isis, Anubis à tête de chacal.', 'Momie'],
      ['332 av. J.-C.', 'Alexandre et les Ptolémée', 'Alexandre le Grand conquiert l’Égypte et fonde Alexandrie, avec son phare et sa grande bibliothèque. Ses successeurs, les Ptolémée, régneront trois siècles.', 'Phare d\'Alexandrie'],
      ['30 av. J.-C.', 'Cléopâtre, la dernière reine', 'Vaincue par Octave, la reine Cléopâtre VII se donne la mort. L’Égypte devient romaine. Il faudra attendre 1822 et Champollion pour relire les hiéroglyphes.', 'Pierre de Rosette'],
    ],
  },
  {
    id: 'israel', nom: 'Hébreux et peuple d’Israël', region: 'orient', dates: 'vers 1200 av. J.-C. – 70 apr. J.-C.',
    resume: 'Un petit peuple du Levant dont les textes, rassemblés dans la Bible, ont marqué le judaïsme, le christianisme et l’islam.',
    evenements: ['abraham', 'moise', 'david', 'tel-dan', 'exil', 'second-temple', 'temple-detruit', 'naissance-jesus', 'mort-jesus'],
    recit: [
      ['Selon la Bible', 'Les patriarches', 'La Bible raconte qu’Abraham quitte la Mésopotamie pour le pays de Canaan. Juifs, chrétiens et musulmans le voient comme un ancêtre. Les historiens ne peuvent pas dater sa vie.', 'Abraham'],
      ['Selon la Bible', 'Moïse et l’Exode', 'Le livre de l’Exode raconte la sortie d’Égypte, guidée par Moïse, puis le don de la Loi au mont Sinaï. Aucune trace archéologique directe n’en a été trouvée.', 'Moïse'],
      ['vers 1200 av. J.-C.', 'Un peuple appelé Israël', 'La stèle du pharaon Mérenptah, vers 1208 avant notre ère, mentionne pour la première fois un peuple nommé « Israël », dans les collines du Levant.', 'Stèle de Mérenptah'],
      ['vers 1000 av. J.-C.', 'David et Salomon', 'Selon la Bible, le roi David fait de Jérusalem sa capitale et son fils Salomon y bâtit le Temple. La stèle de Tel Dan mentionne la « maison de David ».', 'Stèle de Tel Dan'],
      ['587 av. J.-C.', 'L’exil à Babylone', 'Nabuchodonosor II détruit Jérusalem et le premier Temple. Une partie du peuple est déportée. C’est en exil que beaucoup de textes bibliques sont mis par écrit.', 'Exil à Babylone'],
      ['515 av. J.-C.', 'Le second Temple', 'Après la victoire de Cyrus, les exilés reviennent et reconstruisent le Temple, plus tard agrandi par le roi Hérode.', 'Second Temple'],
      ['vers 30', 'Jésus de Nazareth', 'Un prédicateur juif de Galilée, Jésus, est crucifié à Jérusalem sous Ponce Pilate. Ses disciples fondent le christianisme.', 'Jésus de Nazareth'],
      ['70', 'La destruction du Temple', 'Après une révolte contre Rome, Jérusalem est prise et le Temple incendié. Le judaïsme continue autour des synagogues et des textes, dans le monde entier.', 'Siège de Jérusalem (70)'],
    ],
  },
  {
    id: 'perse', nom: 'Perse (Empire achéménide)', region: 'orient', dates: '550 – 330 av. J.-C.',
    resume: 'Le plus grand empire de son temps, de l’Égypte à l’Inde, célèbre pour ses routes et sa tolérance.',
    evenements: ['m-cyrus', 'a-mediques', 'a-alexandre', 'exil', 'second-temple'],
    recit: [
      ['550 av. J.-C.', 'Cyrus le Grand', 'Cyrus, roi des Perses, dans l’actuel Iran, bat les Mèdes puis conquiert la Lydie et Babylone. En quelques années, il bâtit un immense empire.', 'Cyrus II'],
      ['539 av. J.-C.', 'Un roi qui laisse rentrer les exilés', 'Le cylindre de Cyrus raconte qu’il permet aux peuples déportés de rentrer chez eux, dont les Juifs exilés à Babylone.', 'Cylindre de Cyrus'],
      ['vers 500 av. J.-C.', 'Darius Ier organise l’empire', 'Darius divise l’empire en provinces, les satrapies, frappe une monnaie d’or et fait construire la Voie royale, longue de 2 500 km, avec des relais de poste.', 'Darius Ier'],
      ['vers 518 av. J.-C.', 'Persépolis', 'Darius fait bâtir Persépolis, une capitale de cérémonie. Ses escaliers montrent les peuples de l’empire apportant leurs cadeaux au roi.', 'Persépolis'],
      ['490 – 480 av. J.-C.', 'Les guerres médiques', 'Les Perses attaquent la Grèce, mais sont battus à Marathon puis à Salamine. Les cités grecques gardent leur liberté.', 'Bataille de Salamine'],
      ['330 av. J.-C.', 'La fin des Achéménides', 'Alexandre le Grand conquiert l’empire ; Persépolis est incendiée. Mais la culture perse continue : la langue persane est encore parlée aujourd’hui en Iran.', 'Alexandre le Grand'],
    ],
  },
  {
    id: 'pheniciens', nom: 'Phéniciens et Carthage', region: 'orient', dates: 'vers 1200 – 146 av. J.-C.',
    resume: 'Des marins et marchands du Liban actuel qui ont inventé l’alphabet et fondé Carthage.',
    evenements: ['a-alphabet', 'm-carthage'],
    recit: [
      ['vers 1200 av. J.-C.', 'Des cités sur la côte', 'Tyr, Sidon et Byblos, au Liban actuel, sont des cités de marins. Elles vendent du bois de cèdre, du verre et une teinture pourpre très chère, tirée de coquillages.', 'Phénicie'],
      ['vers 1050 av. J.-C.', 'L’alphabet', 'Les Phéniciens utilisent seulement 22 signes, un par son. C’est bien plus simple que les hiéroglyphes ! Les Grecs l’adoptent et y ajoutent les voyelles.', 'Alphabet phénicien'],
      ['814 av. J.-C.', 'La fondation de Carthage', 'Selon la légende, la princesse Élissa, ou Didon, fonde Carthage, près de l’actuelle Tunis. La ville devient la plus puissante de la Méditerranée occidentale.', 'Carthage'],
      ['264 – 146 av. J.-C.', 'Les guerres puniques', 'Carthage affronte Rome pendant plus d’un siècle. Le général Hannibal traverse les Alpes avec des éléphants et bat les Romains plusieurs fois.', 'Hannibal Barca'],
      ['146 av. J.-C.', 'La destruction de Carthage', 'Rome finit par l’emporter et détruit la ville. Ses ruines sont aujourd’hui inscrites au patrimoine mondial de l’UNESCO.', 'Site archéologique de Carthage'],
    ],
  },

  // ---------------- Méditerranée et Europe ----------------
  {
    id: 'grece', nom: 'Grèce antique', region: 'mediterranee', dates: 'vers 800 – 146 av. J.-C.',
    resume: 'Des cités indépendantes qui inventent la démocratie, la philosophie, le théâtre et les Jeux olympiques.',
    evenements: ['a-troie', 'athenes', 'a-mediques', 'a-alexandre'],
    recit: [
      ['vers 1200 av. J.-C.', 'Mycènes et la guerre de Troie', 'Les rois de Mycènes vivent dans des palais fortifiés. La guerre de Troie, racontée par Homère dans l’Iliade, garde le souvenir de cette époque.', 'Mycènes'],
      ['776 av. J.-C.', 'Les premiers Jeux olympiques', 'Selon la tradition, les premiers Jeux ont lieu à Olympie en l’honneur de Zeus. Pendant les Jeux, les cités grecques font la trêve.', 'Jeux olympiques antiques'],
      ['vers 750 av. J.-C.', 'Des cités partout', 'Les Grecs vivent dans des cités indépendantes, comme Athènes ou Sparte. Ils fondent des colonies tout autour de la Méditerranée, dont Marseille, vers 600 avant notre ère.', 'Massalia'],
      ['508 av. J.-C.', 'La démocratie à Athènes', 'À Athènes, les citoyens votent eux-mêmes les lois. Mais les femmes, les étrangers et les esclaves n’ont pas ce droit.', 'Démocratie athénienne'],
      ['490 – 480 av. J.-C.', 'Contre les Perses', 'À Marathon puis à Salamine, les Grecs repoussent l’immense Empire perse. Athènes devient la cité la plus puissante.', 'Bataille de Marathon'],
      ['Ve siècle av. J.-C.', 'Le siècle de Périclès', 'Athènes bâtit le Parthénon. Le théâtre, l’histoire et la philosophie fleurissent : Sophocle, Hérodote, Socrate, puis Platon et Aristote.', 'Parthénon'],
      ['336 – 323 av. J.-C.', 'Alexandre le Grand', 'Le roi de Macédoine conquiert un empire jusqu’à l’Inde. La langue et la culture grecques se répandent dans tout l’Orient.', 'Alexandre le Grand'],
      ['146 av. J.-C.', 'Rome prend le relais', 'La Grèce devient romaine. Mais les Romains admirent et copient la culture grecque, qui arrivera ainsi jusqu’à nous.', 'Corinthe'],
    ],
  },
  {
    id: 'rome', nom: 'Rome antique', region: 'mediterranee', dates: '753 av. J.-C. – 476 apr. J.-C. (1453 pour Byzance)',
    resume: 'D’un village du Latium à un empire de 60 millions d’habitants, autour de la Méditerranée.',
    evenements: ['a-rome', 'a-cesar', 'auguste', 'chute-rome', 'fr-alesia', 'naissance-jesus', 'mort-jesus', 'constantin', 'nicee', 'temple-detruit', 'm-carthage'],
    recit: [
      ['753 av. J.-C.', 'Romulus et Remus', 'Selon la légende, Rome est fondée par Romulus, élevé avec son jumeau Remus par une louve. Les archéologues trouvent bien des villages sur le Palatin à cette époque.', 'Louve capitoline'],
      ['509 av. J.-C.', 'La République', 'Les Romains chassent leur dernier roi. Ils sont gouvernés par deux consuls élus chaque année et par le Sénat. SPQR : « le Sénat et le peuple romain ».', 'République romaine'],
      ['264 – 146 av. J.-C.', 'Rome contre Carthage', 'Après trois guerres contre Carthage et son général Hannibal, Rome domine toute la Méditerranée.', 'Guerres puniques'],
      ['52 av. J.-C.', 'César conquiert la Gaule', 'Jules César bat Vercingétorix à Alésia. Devenu tout-puissant, il est assassiné au Sénat en 44 avant notre ère.', 'Jules César'],
      ['27 av. J.-C.', 'Auguste, premier empereur', 'Octave, fils adoptif de César, devient Auguste. Commence la « paix romaine » : routes, aqueducs, villes avec thermes et amphithéâtres.', 'Auguste'],
      ['80', 'Le Colisée', 'L’amphithéâtre flavien, ou Colisée, peut accueillir environ 50 000 spectateurs pour les combats de gladiateurs. En Gaule, on bâtit le pont du Gard et les arènes de Nîmes.', 'Colisée'],
      ['313', 'L’empire devient chrétien', 'L’empereur Constantin autorise le christianisme, qui devient religion officielle en 380. Il fonde Constantinople, nouvelle capitale à l’est.', 'Constantin Ier (empereur romain)'],
      ['476', 'La chute de l’Occident', 'Affaibli, l’Empire d’Occident tombe quand le dernier empereur, Romulus Augustule, est déposé. L’Empire d’Orient, Byzance, durera encore mille ans.', 'Chute de l\'Empire romain d\'Occident'],
      ['L’héritage', 'Rome est partout', 'Le latin a donné le français, l’italien, l’espagnol… Notre droit, notre calendrier et beaucoup de nos villes viennent de Rome.', 'Latin'],
    ],
  },
  {
    id: 'byzance', nom: 'Empire byzantin', region: 'mediterranee', dates: '330 – 1453',
    resume: 'L’Empire romain d’Orient, chrétien et de langue grecque, autour de Constantinople.',
    evenements: ['constantin', 'schisme', 'a-croisades', 'a-constantinople'],
    recit: [
      ['330', 'Constantinople', 'L’empereur Constantin fonde une nouvelle capitale sur le Bosphore, entre l’Europe et l’Asie : Constantinople, l’ancienne Byzance, aujourd’hui Istanbul.', 'Constantinople'],
      ['395', 'Deux empires', 'L’Empire romain est partagé en deux. Quand l’Occident tombe en 476, l’Orient continue : ses habitants s’appellent eux-mêmes « Romains ».', 'Empire byzantin'],
      ['537', 'Justinien et Sainte-Sophie', 'L’empereur Justinien reconquiert l’Italie, rassemble les lois romaines dans un grand code et fait bâtir la basilique Sainte-Sophie, à l’immense coupole.', 'Sainte-Sophie (Istanbul)'],
      ['1054', 'La séparation des Églises', 'L’Église de Constantinople, orthodoxe, et celle de Rome, catholique, se séparent.', 'Schisme de 1054'],
      ['1204', 'Le sac de Constantinople', 'Détournés de leur but, les croisés de la quatrième croisade pillent la ville. L’empire ne s’en remettra jamais vraiment.', 'Sac de Constantinople (1204)'],
      ['1453', 'La chute', 'Le sultan ottoman Mehmed II prend Constantinople après un siège de près de deux mois. Des savants grecs fuient en Italie et nourrissent la Renaissance.', 'Chute de Constantinople'],
    ],
  },
  {
    id: 'france', nom: 'France', region: 'mediterranee', dates: '481 – aujourd’hui',
    resume: 'Des rois francs à la République : dynasties, guerres et révolutions.',
    evenements: ['fr-alesia', 'fr-clovis', 'fr-bapteme', 'fr-poitiers', 'fr-pepin', 'charlemagne', 'fr-verdun', 'fr-capet', 'fr-bouvines', 'fr-saint-louis', 'fr-valois', 'fr-cent-ans', 'fr-jeanne', 'fr-castillon', 'fr-marignan', 'fr-villers', 'fr-religion', 'fr-barthelemy', 'fr-henri4', 'fr-nantes', 'fr-louis14', 'fr-versailles', 'revolution', 'fr-republique', 'a-napoleon', 'a-waterloo', 'fr-restauration', 'fr-1830', 'fr-1848', 'fr-empire2', 'fr-1870', 'a-eiffel', 'fr-ferry', 'fr-1905', 'guerre-14', 'fr-appel', 'fr-liberation', 'guerre-39'],
    recit: [
      ['52 av. J.-C.', 'La Gaule romaine', 'Après Alésia, la Gaule devient romaine pendant cinq siècles. On y parle bientôt latin, ancêtre du français.', 'Siège d\'Alésia'],
      ['481', 'Clovis et les Mérovingiens', 'Clovis, roi des Francs, unit une grande partie de la Gaule et se fait baptiser à Reims. Les Francs donneront leur nom à la France.', 'Clovis Ier'],
      ['800', 'Charlemagne', 'Roi des Francs de la dynastie carolingienne, Charlemagne est couronné empereur à Rome. Après lui, l’empire est partagé : à l’ouest naît la Francie occidentale.', 'Charlemagne'],
      ['987', 'Les Capétiens', 'Hugues Capet est élu roi. Ses descendants, de père en fils puis de branche en branche, régneront jusqu’en 1848. Saint Louis et Philippe Auguste renforcent le royaume.', 'Hugues Capet'],
      ['1337 – 1453', 'La guerre de Cent Ans', 'Rois de France et d’Angleterre se disputent la couronne. Jeanne d’Arc redonne espoir aux Français, qui finissent par l’emporter à Castillon.', 'Jeanne d\'Arc'],
      ['1515', 'La Renaissance', 'François Ier gagne à Marignan, accueille Léonard de Vinci et impose le français dans les actes officiels.', 'François Ier (roi de France)'],
      ['1562 – 1598', 'Les guerres de Religion', 'Catholiques et protestants s’affrontent. Henri IV, premier roi Bourbon, ramène la paix avec l’édit de Nantes.', 'Henri IV (roi de France)'],
      ['1643 – 1715', 'Louis XIV, le Roi-Soleil', 'Le plus long règne de l’histoire de France. Le roi gouverne seul et installe sa cour à Versailles.', 'Louis XIV'],
      ['1789', 'La Révolution', 'Prise de la Bastille, Déclaration des droits de l’homme, fin de la monarchie absolue. La République est proclamée en 1792.', 'Prise de la Bastille'],
      ['1804 – 1815', 'Napoléon', 'Général victorieux devenu empereur, Napoléon crée le Code civil et les lycées, puis est battu à Waterloo.', 'Napoléon Ier'],
      ['1870 – 1914', 'La République s’installe', 'Après la défaite de 1870, la Troisième République fonde l’école gratuite et laïque et sépare les Églises et l’État.', 'Troisième République (France)'],
      ['1914 – 1945', 'Deux guerres mondiales', 'La France paie un lourd tribut en 1914-1918. En 1940, elle est occupée ; de Gaulle lance l’appel du 18 juin. Paris est libéré en 1944.', 'Libération de Paris'],
    ],
  },
  {
    id: 'vikings', nom: 'Vikings (Scandinavie)', region: 'mediterranee', dates: 'vers 793 – 1066',
    resume: 'Marins, marchands et guerriers venus de Scandinavie, de Bagdad jusqu’à l’Amérique.',
    evenements: ['m-vikings'],
    recit: [
      ['793', 'Le raid de Lindisfarne', 'Des guerriers venus de Norvège pillent le monastère de Lindisfarne, en Angleterre. Commence « l’âge des Vikings ».', 'Lindisfarne'],
      ['Les drakkars', 'Des navires extraordinaires', 'Leurs bateaux longs et légers vont en haute mer et remontent les fleuves. Les Vikings sont aussi des paysans et des marchands.', 'Navire viking'],
      ['845 – 911', 'En France', 'Les Vikings remontent la Seine et assiègent Paris. En 911, le roi Charles le Simple donne au chef Rollon une terre qui deviendra la Normandie.', 'Rollon'],
      ['IXe – Xe siècles', 'Vers l’est', 'Par les fleuves de Russie, les Vikings, appelés Varègues, vont commercer jusqu’à Constantinople et Bagdad.', 'Varègues'],
      ['vers 1000', 'L’Amérique avant Colomb', 'Leif Erikson atteint Terre-Neuve. Le site de L’Anse aux Meadows le prouve, presque cinq siècles avant Christophe Colomb.', 'L\'Anse aux Meadows'],
      ['1066', 'La fin d’une époque', 'Les royaumes scandinaves deviennent chrétiens. La même année, Guillaume, duc de Normandie, descendant des Vikings, conquiert l’Angleterre.', 'Tapisserie de Bayeux'],
    ],
  },
  {
    id: 'islam', nom: 'Monde arabo-musulman (califats)', region: 'orient', dates: '622 – 1258',
    resume: 'De l’Arabie à l’Espagne, un empire où les savants font avancer les mathématiques, la médecine et l’astronomie.',
    evenements: ['a-islam', 'm-sagesse', 'fr-poitiers', 'a-croisades', 'm-ibn-battuta'],
    recit: [
      ['vers 610', 'Mahomet', 'À La Mecque, en Arabie, Mahomet dit recevoir la révélation de Dieu. Il fonde l’islam ; ses paroles sont rassemblées dans le Coran.', 'Mahomet'],
      ['622', 'L’Hégire', 'Mahomet part pour Médine. Cette date marque le début du calendrier musulman.', 'Hégire'],
      ['632 – 750', 'Une expansion rapide', 'Les califes, successeurs de Mahomet, conquièrent en un siècle un immense territoire, de l’Espagne à l’Asie centrale.', 'Califat omeyyade'],
      ['762', 'Bagdad', 'Le calife abbasside al-Mansur fonde Bagdad, bientôt l’une des plus grandes villes du monde.', 'Bagdad'],
      ['IXe siècle', 'La maison de la Sagesse', 'Des savants y traduisent les livres grecs, perses et indiens. Al-Khwarizmi écrit sur l’algèbre ; les chiffres « arabes », venus d’Inde, arriveront en Europe par ce monde.', 'Maison de la sagesse'],
      ['Xe siècle', 'Al-Andalus', 'En Espagne, Cordoue est une capitale brillante, avec une grande mosquée et des bibliothèques. Musulmans, juifs et chrétiens s’y côtoient.', 'Mosquée-cathédrale de Cordoue'],
      ['1258', 'La prise de Bagdad', 'Les Mongols détruisent Bagdad. Le califat abbasside prend fin, mais l’islam continue de se répandre, en Afrique comme en Asie.', 'Siège de Bagdad (1258)'],
    ],
  },
  {
    id: 'ottomans', nom: 'Empire ottoman', region: 'orient', dates: 'vers 1299 – 1922',
    resume: 'Un empire turc qui a duré plus de six siècles, de Vienne au golfe Persique.',
    evenements: ['a-constantinople'],
    recit: [
      ['vers 1299', 'Osman', 'Le chef turc Osman fonde un petit État en Anatolie. Ses descendants donneront leur nom à l’empire : les Ottomans.', 'Osman Ier'],
      ['1453', 'Constantinople devient Istanbul', 'Le sultan Mehmed II prend la ville. Sainte-Sophie devient une mosquée. Istanbul sera la capitale pendant près de cinq siècles.', 'Chute de Constantinople'],
      ['1520 – 1566', 'Soliman le Magnifique', 'L’empire est à son apogée, de l’Algérie à l’Irak et jusqu’aux portes de Vienne. L’architecte Sinan construit de magnifiques mosquées.', 'Soliman le Magnifique'],
      ['1683', 'L’échec devant Vienne', 'Le second siège de Vienne échoue. L’empire commence à reculer en Europe.', 'Bataille de Vienne'],
      ['XIXe siècle', 'L’« homme malade de l’Europe »', 'Grèce, Serbie, Égypte… l’empire perd peu à peu ses territoires et tente de se moderniser.', 'Tanzimat'],
      ['1922 – 1923', 'La fin de l’empire', 'Vaincu en 1918, l’empire disparaît. Mustafa Kemal Atatürk fonde la République de Turquie en 1923.', 'Mustafa Kemal Atatürk'],
    ],
  },

  // ---------------- Afrique ----------------
  {
    id: 'koush', nom: 'Royaume de Koush (Nubie)', region: 'afrique', dates: 'vers 2500 av. J.-C. – 350 apr. J.-C.',
    resume: 'Au sud de l’Égypte, au Soudan actuel, un royaume aux centaines de pyramides.',
    evenements: ['m-koush', 'm-aksoum'],
    recit: [
      ['vers 2500 av. J.-C.', 'Kerma', 'Au bord du Nil, au Soudan actuel, la ville de Kerma est la capitale d’un royaume riche en or et en ivoire.', 'Kerma'],
      ['vers 1500 av. J.-C.', 'Sous domination égyptienne', 'Les pharaons du Nouvel Empire conquièrent la Nubie pour son or. Les Nubiens adoptent des dieux et des coutumes égyptiennes.', 'Nubie'],
      ['vers 730 av. J.-C.', 'Les pharaons noirs', 'Le roi Piye de Napata conquiert l’Égypte. Ses successeurs forment la XXVe dynastie et règnent sur l’Égypte pendant près d’un siècle.', 'XXVe dynastie égyptienne'],
      ['vers 300 av. J.-C.', 'Méroé', 'La capitale s’installe à Méroé. On y fond le fer, on y invente une écriture, et on y bâtit plus de 200 pyramides.', 'Pyramides de Méroé'],
      ['vers 350', 'La fin', 'Le royaume s’affaiblit et disparaît, sans doute sous les coups du royaume d’Aksoum, en Éthiopie.', 'Royaume d\'Aksoum'],
    ],
  },
  {
    id: 'mali', nom: 'Empires du Ghana et du Mali', region: 'afrique', dates: 'vers 300 – 1600',
    resume: 'En Afrique de l’Ouest, des empires enrichis par l’or et le commerce à travers le Sahara.',
    evenements: ['m-ghana', 'm-mansa', 'm-ibn-battuta'],
    recit: [
      ['vers 300 – 1076', 'L’empire du Ghana', 'Entre les actuels Mali et Mauritanie (et non au Ghana d’aujourd’hui), l’empire du Ghana contrôle les mines d’or. Les marchands arabes l’appellent le « pays de l’or ».', 'Empire du Ghana'],
      ['Le commerce', 'L’or contre le sel', 'Des caravanes de chameaux traversent le Sahara en plusieurs semaines. Elles échangent l’or du sud contre le sel du désert, aussi précieux.', 'Commerce transsaharien'],
      ['vers 1235', 'Soundiata Keïta', 'Le héros Soundiata Keïta fonde l’empire du Mali. Son histoire est encore chantée aujourd’hui par les griots, conteurs et musiciens.', 'Soundiata Keïta'],
      ['1324', 'Mansa Moussa', 'L’empereur Mansa Moussa fait le pèlerinage à La Mecque avec tant d’or qu’il en fait baisser le prix au Caire. Il est souvent présenté comme l’homme le plus riche de l’histoire.', 'Mansa Moussa'],
      ['XIVe – XVIe siècles', 'Tombouctou', 'Tombouctou devient une ville de savants, avec ses mosquées de terre et des milliers de manuscrits. Elle est inscrite au patrimoine mondial de l’UNESCO.', 'Tombouctou'],
      ['vers 1600', 'Après le Mali', 'L’empire songhaï de Gao prend le relais, puis s’effondre en 1591 face au Maroc. Le pays actuel, le Mali, a pris le nom de l’ancien empire.', 'Empire songhaï'],
    ],
  },
  {
    id: 'aksoum', nom: 'Aksoum et Éthiopie', region: 'afrique', dates: 'vers 100 – aujourd’hui',
    resume: 'L’un des plus anciens États chrétiens du monde, qui a résisté à la colonisation.',
    evenements: ['m-aksoum', 'm-adoua'],
    recit: [
      ['vers 100', 'Le royaume d’Aksoum', 'Au nord de l’Éthiopie, Aksoum commerce avec Rome, l’Arabie et l’Inde. Il frappe sa propre monnaie en or.', 'Royaume d\'Aksoum'],
      ['vers 330', 'Un royaume chrétien', 'Le roi Ezana se convertit au christianisme. L’Éthiopie est l’un des plus anciens pays chrétiens du monde.', 'Ezana'],
      ['Les stèles', 'Des obélisques géants', 'Aksoum a dressé de hautes stèles de pierre, dont l’une mesure plus de 20 mètres. Le site est au patrimoine mondial de l’UNESCO.', 'Stèles d\'Aksoum'],
      ['vers 1200', 'Les églises de Lalibela', 'Le roi Lalibela fait creuser onze églises directement dans la roche. On y prie encore aujourd’hui.', 'Églises creusées dans la roche de Lalibela'],
      ['1896', 'Adoua', 'L’empereur Ménélik II bat l’armée italienne. L’Éthiopie reste indépendante, un symbole pour toute l’Afrique.', 'Bataille d\'Adoua'],
    ],
  },
  {
    id: 'zimbabwe', nom: 'Grand Zimbabwe', region: 'afrique', dates: 'vers 1100 – 1450',
    resume: 'Une ville de pierre en Afrique australe, au cœur du commerce de l’or.',
    evenements: ['m-zimbabwe'],
    recit: [
      ['vers 1100', 'Une ville de pierre', 'Les ancêtres du peuple shona bâtissent une grande ville sur un plateau. Ses murs de granit sont faits de pierres empilées sans mortier.', 'Grand Zimbabwe'],
      ['XIIIe – XIVe siècles', 'L’or et l’océan Indien', 'La ville contrôle le commerce de l’or et de l’ivoire jusqu’à la côte. On y a trouvé des perles de Perse et de la porcelaine de Chine.', 'Grand Zimbabwe'],
      ['vers 1450', 'Le déclin', 'La ville est abandonnée, peut-être à cause de l’épuisement des terres. Le pays a pris son nom, le Zimbabwe, à son indépendance en 1980.', 'Zimbabwe'],
    ],
  },

  // ---------------- Asie ----------------
  {
    id: 'indus', nom: 'Civilisation de l’Indus', region: 'asie', dates: 'vers 2600 – 1900 av. J.-C.',
    resume: 'Des villes très organisées au Pakistan et en Inde actuels, à l’écriture toujours mystérieuse.',
    evenements: ['m-indus'],
    recit: [
      ['vers 2600 av. J.-C.', 'Des villes en damier', 'Mohenjo-daro et Harappa ont des rues droites, des maisons en briques cuites, des puits et des égouts : un urbanisme très en avance.', 'Mohenjo-daro'],
      ['Le commerce', 'Des sceaux et des marchands', 'On a retrouvé des milliers de petits sceaux gravés d’animaux. Les marchands de l’Indus commerçaient jusqu’en Mésopotamie.', 'Sceau de l\'Indus'],
      ['Un mystère', 'Une écriture non déchiffrée', 'Les signes de l’Indus n’ont toujours pas été déchiffrés. On ne connaît ni le nom de ses rois, ni sa langue.', 'Écriture de l\'Indus'],
      ['vers 1900 av. J.-C.', 'Le déclin', 'Les villes sont peu à peu abandonnées, peut-être à cause de changements du climat et du cours des rivières.', 'Harappa'],
    ],
  },
  {
    id: 'chine', nom: 'Chine', region: 'asie', dates: 'vers 1600 av. J.-C. – aujourd’hui',
    resume: 'Plus de 3 000 ans d’histoire continue, d’empereurs en dynasties, jusqu’à la République.',
    evenements: ['m-shang', 'm-confucius', 'a-qin', 'm-muraille', 'm-soie', 'm-papier', 'm-tang', 'm-sutra', 'm-gengis', 'm-marco-polo', 'm-zheng-he', 'm-opium', 'm-chine-1911'],
    recit: [
      ['vers 1250 av. J.-C.', 'Les Shang et l’écriture', 'Sous la dynastie Shang, on écrit sur des os pour interroger les ancêtres. Beaucoup de caractères chinois actuels en descendent.', 'Écriture ossécaille'],
      ['vers 500 av. J.-C.', 'Confucius', 'Le sage Confucius enseigne le respect de la famille et le bon exemple des gouvernants. Ses idées marqueront la Chine pendant plus de 2 000 ans.', 'Confucius'],
      ['221 av. J.-C.', 'Le premier empereur', 'Qin Shi Huang unifie la Chine, l’écriture et les mesures. Son tombeau est gardé par l’armée de terre cuite.', 'Armée de terre cuite'],
      ['IIe siècle av. J.-C.', 'Les Han et la route de la soie', 'La dynastie Han ouvre les routes de la soie vers l’Occident. Vers 105, on y perfectionne le papier.', 'Dynastie Han'],
      ['618 – 907', 'Les Tang', 'Un âge d’or de la poésie et des arts. La capitale, Chang’an, est l’une des plus grandes villes du monde. On imprime des livres dès le IXe siècle.', 'Dynastie Tang'],
      ['XIe siècle', 'Les inventions', 'La Chine connaît la boussole, la poudre et l’imprimerie à caractères mobiles bien avant l’Europe.', 'Quatre grandes inventions'],
      ['1271 – 1368', 'Les Mongols', 'Kubilaï Khan, petit-fils de Gengis Khan, règne sur la Chine. Marco Polo raconte ses merveilles.', 'Kubilai Khan'],
      ['1368 – 1644', 'Les Ming', 'Les Ming reconstruisent la Grande Muraille et bâtissent la Cité interdite. Les flottes de Zheng He vont jusqu’en Afrique.', 'Cité interdite'],
      ['1839 – 1911', 'Crises et révolution', 'Battue lors des guerres de l’opium, la Chine s’affaiblit. En 1911, une révolution renverse le dernier empereur.', 'Révolution chinoise de 1911'],
    ],
  },
  {
    id: 'inde', nom: 'Inde (des Maurya aux Moghols)', region: 'asie', dates: 'vers 500 av. J.-C. – 1857',
    resume: 'Berceau du bouddhisme, de l’hindouisme classique, des chiffres et du zéro.',
    evenements: ['a-bouddha', 'm-ashoka', 'm-gupta', 'm-moghols', 'm-taj', 'm-gama', 'm-gandhi'],
    recit: [
      ['vers 500 av. J.-C.', 'Bouddha', 'Siddhartha Gautama, prince du nord de l’Inde, enseigne une voie pour se libérer de la souffrance : c’est le bouddhisme.', 'Siddhartha Gautama'],
      ['vers 268 av. J.-C.', 'Ashoka', 'L’empereur Ashoka, après une guerre très meurtrière, se tourne vers la non-violence. Ses lions de Sarnath sont aujourd’hui l’emblème de l’Inde.', 'Ashoka'],
      ['320 – 550', 'L’âge d’or des Gupta', 'Les savants indiens utilisent le zéro et les chiffres de 1 à 9, ancêtres des nôtres. L’astronome Aryabhata calcule que la Terre tourne sur elle-même.', 'Empire Gupta'],
      ['1526', 'Les Moghols', 'Babur fonde l’Empire moghol. Akbar gouverne en respectant les différentes religions.', 'Empire moghol'],
      ['1632 – 1653', 'Le Taj Mahal', 'L’empereur Shah Jahan fait bâtir ce tombeau de marbre blanc pour son épouse Mumtaz Mahal.', 'Taj Mahal'],
      ['1858 – 1947', 'Colonie puis indépendance', 'L’Inde passe sous domination britannique. Par la non-violence, Gandhi mène le combat pour l’indépendance, obtenue en 1947.', 'Mohandas Karamchand Gandhi'],
    ],
  },
  {
    id: 'japon', nom: 'Japon', region: 'asie', dates: 'vers 300 – aujourd’hui',
    resume: 'Un archipel d’empereurs, de samouraïs et de shoguns, devenu une grande puissance moderne.',
    evenements: ['m-edo', 'm-meiji', 'a-bombe'],
    recit: [
      ['vers 300 – 700', 'Les premiers empereurs', 'Des chefs de clans s’unissent autour d’une famille impériale, qui règne encore aujourd’hui : c’est la plus ancienne monarchie héréditaire du monde.', 'Empereur du Japon'],
      ['794 – 1185', 'L’époque de Heian', 'À Kyoto, la cour impériale raffine les arts. Une dame de la cour, Murasaki Shikibu, écrit le « Dit du Genji », l’un des premiers romans du monde.', 'Le Dit du Genji'],
      ['1192 – 1868', 'Samouraïs et shoguns', 'Le pouvoir réel passe aux shoguns, chefs militaires, entourés de guerriers, les samouraïs.', 'Samouraï'],
      ['1603', 'L’époque d’Edo', 'Le shogun Tokugawa installe le pouvoir à Edo, l’actuelle Tokyo. Le Japon se ferme presque entièrement aux étrangers pendant deux siècles.', 'Époque d\'Edo'],
      ['1868', 'L’ère Meiji', 'L’empereur reprend le pouvoir. En quelques décennies, le Japon se modernise : trains, usines, écoles, armée.', 'Ère Meiji'],
      ['1945', 'La guerre et la reconstruction', 'Après les bombardements d’Hiroshima et de Nagasaki, le Japon capitule. Il devient ensuite une grande démocratie et une puissance économique.', 'Hiroshima'],
    ],
  },
  {
    id: 'mongols', nom: 'Empire mongol', region: 'asie', dates: '1206 – 1368',
    resume: 'Le plus grand empire continu de l’histoire, de la Corée à l’Europe de l’Est.',
    evenements: ['m-gengis', 'm-marco-polo'],
    recit: [
      ['1206', 'Gengis Khan', 'Temüjin unit les tribus nomades de la steppe et prend le nom de Gengis Khan. Ses cavaliers sont redoutables.', 'Gengis Khan'],
      ['1206 – 1260', 'Des conquêtes immenses', 'Les Mongols conquièrent la Chine du Nord, l’Asie centrale, la Perse et la Russie. Les conquêtes sont très meurtrières.', 'Empire mongol'],
      ['1258', 'Bagdad détruite', 'Les Mongols prennent Bagdad et mettent fin au califat abbasside.', 'Siège de Bagdad (1258)'],
      ['La paix mongole', 'Des routes sûres', 'Une fois l’empire installé, marchands et voyageurs, comme Marco Polo, circulent de l’Europe à la Chine.', 'Marco Polo'],
      ['1368', 'La fin', 'L’empire, partagé entre plusieurs khans, s’affaiblit. En Chine, la dynastie Ming chasse les Mongols.', 'Dynastie Yuan'],
    ],
  },
  {
    id: 'khmers', nom: 'Empire khmer (Angkor)', region: 'asie', dates: '802 – 1431',
    resume: 'Au Cambodge, une immense cité de temples et de bassins.',
    evenements: ['m-angkor'],
    recit: [
      ['802', 'La fondation', 'Le roi Jayavarman II se proclame « roi universel ». C’est le début de l’Empire khmer, au Cambodge actuel.', 'Empire khmer'],
      ['XIIe siècle', 'Angkor Vat', 'Le roi Suryavarman II fait construire Angkor Vat, le plus grand monument religieux du monde, d’abord dédié au dieu hindou Vishnou.', 'Angkor Vat'],
      ['Une ville d’eau', 'Bassins et canaux', 'Un immense réseau de canaux et de réservoirs permet de cultiver le riz. Angkor est l’une des plus grandes villes du monde avant l’ère industrielle.', 'Angkor'],
      ['vers 1200', 'Jayavarman VII et le Bayon', 'Ce roi bouddhiste fait bâtir le Bayon, aux grands visages de pierre souriants.', 'Bayon'],
      ['1431', 'Le déclin', 'Angkor est abandonnée comme capitale. Angkor Vat figure aujourd’hui sur le drapeau du Cambodge.', 'Angkor'],
    ],
  },

  // ---------------- Amériques ----------------
  {
    id: 'caral', nom: 'Caral (Pérou)', region: 'ameriques', dates: 'vers 2600 – 1800 av. J.-C.',
    resume: 'La plus ancienne ville des Amériques, contemporaine des pyramides d’Égypte.',
    evenements: ['m-caral'],
    recit: [
      ['vers 2600 av. J.-C.', 'Une ville très ancienne', 'Dans la vallée de Supe, au Pérou, Caral compte six grandes pyramides et des places circulaires, à l’époque des pyramides d’Égypte.', 'Caral'],
      ['Sans céramique', 'Une civilisation surprenante', 'Ses habitants ne connaissaient ni la poterie ni l’écriture. Ils cultivaient le coton pour les filets de pêche et échangeaient avec la côte.', 'Caral'],
      ['vers 1800 av. J.-C.', 'L’abandon', 'La ville est abandonnée, peut-être après des séismes et des sécheresses. Elle est inscrite au patrimoine mondial de l’UNESCO.', 'Caral'],
    ],
  },
  {
    id: 'mayas', nom: 'Mayas', region: 'ameriques', dates: 'vers 2000 av. J.-C. – 1697',
    resume: 'Au Mexique et en Amérique centrale, des cités de pyramides, une écriture complète et un calendrier très précis.',
    evenements: ['m-olmeques', 'm-maya', 'm-teotihuacan'],
    recit: [
      ['vers 1200 av. J.-C.', 'Les Olmèques avant eux', 'Les Olmèques, célèbres pour leurs têtes de pierre géantes, influencent toute la région, Mayas compris.', 'Olmèques'],
      ['250 – 900', 'L’âge classique', 'De grandes cités comme Tikal, Palenque ou Copán se dressent dans la forêt, avec leurs pyramides et leurs palais.', 'Tikal'],
      ['Des savants', 'Écriture et calendrier', 'Les Mayas ont une écriture complète, utilisent le zéro et calculent très précisément les mouvements du Soleil et de Vénus.', 'Écriture maya'],
      ['vers 900', 'Le déclin des cités du sud', 'Beaucoup de cités sont abandonnées, sans doute à cause de longues sécheresses et de guerres.', 'Effondrement de la civilisation maya classique'],
      ['vers 1000 – 1450', 'Chichén Itzá', 'Au Yucatán, la ville de Chichén Itzá prospère. Sa grande pyramide, le Castillo, compte 365 marches au total.', 'Chichén Itzá'],
      ['1697', 'La conquête espagnole', 'Le dernier royaume maya indépendant tombe face aux Espagnols. Mais plusieurs millions de Mayas vivent toujours et parlent leurs langues.', 'Peuple maya'],
    ],
  },
  {
    id: 'azteques', nom: 'Aztèques (Mexicas)', region: 'ameriques', dates: '1325 – 1521',
    resume: 'Un empire guerrier dont la capitale, Tenochtitlan, était bâtie sur un lac.',
    evenements: ['m-teotihuacan', 'm-tenochtitlan', 'm-cortes', 'colomb'],
    recit: [
      ['1325', 'Un aigle sur un cactus', 'Selon leur légende, les Mexicas fondent leur ville là où ils voient un aigle posé sur un cactus. Cet aigle est sur le drapeau du Mexique.', 'Drapeau du Mexique'],
      ['XVe siècle', 'Tenochtitlan', 'La capitale est bâtie sur une île du lac Texcoco, avec des jardins flottants, les chinampas. Elle compte peut-être 200 000 habitants.', 'Tenochtitlan'],
      ['1428', 'La Triple Alliance', 'Trois cités s’allient et dominent le centre du Mexique. Les peuples vaincus doivent payer un tribut.', 'Triple Alliance (Mexique)'],
      ['Religion', 'Le Templo Mayor', 'Au centre de la ville, le Grand Temple honore le dieu de la pluie et le dieu du soleil et de la guerre, à qui l’on offre des sacrifices.', 'Templo Mayor'],
      ['1519 – 1521', 'La conquête', 'Hernán Cortés arrive avec quelques centaines d’Espagnols, aidés par des peuples ennemis des Aztèques. La variole décime la ville, qui tombe en 1521.', 'Conquête de l\'Empire aztèque'],
      ['Aujourd’hui', 'Mexico', 'La ville de Mexico est construite sur les ruines de Tenochtitlan. Plus d’un million de personnes parlent encore le nahuatl, la langue des Aztèques.', 'Nahuatl'],
    ],
  },
  {
    id: 'incas', nom: 'Incas', region: 'ameriques', dates: 'vers 1200 – 1572',
    resume: 'Le plus grand empire des Amériques, le long de la cordillère des Andes.',
    evenements: ['m-incas', 'm-pizarro'],
    recit: [
      ['vers 1200', 'Cuzco', 'Les Incas s’installent à Cuzco, au Pérou. Leur souverain, l’Inca, est considéré comme le fils du Soleil.', 'Cuzco'],
      ['1438', 'Pachacutec', 'L’Inca Pachacutec agrandit l’empire et fait sans doute bâtir Machu Picchu, au sommet d’une montagne.', 'Machu Picchu'],
      ['XVe siècle', 'Un empire de montagne', 'Du Chili à l’Équateur, l’empire est relié par plus de 30 000 km de routes, avec des ponts suspendus et des messagers à pied.', 'Qhapaq Ñan'],
      ['Sans écriture', 'Les quipus', 'Les Incas n’écrivent pas, mais notent les nombres avec des cordelettes à nœuds, les quipus. Ils cultivent la pomme de terre en terrasses.', 'Quipu'],
      ['1532 – 1572', 'La conquête', 'Francisco Pizarro capture l’Inca Atahualpa. Affaibli par une guerre civile et les épidémies, l’empire s’effondre. Le dernier Inca est exécuté en 1572.', 'Conquête de l\'Empire inca'],
      ['Aujourd’hui', 'Le quechua', 'Plusieurs millions de personnes parlent encore le quechua, la langue des Incas, au Pérou, en Bolivie et en Équateur.', 'Quechua'],
    ],
  },
  {
    id: 'usa', nom: 'États-Unis', region: 'ameriques', dates: '1776 – aujourd’hui',
    resume: 'D’anciennes colonies anglaises devenues la première puissance mondiale.',
    evenements: ['m-cahokia', 'a-usa', 'm-secession', 'a-crise-1929', 'm-lindbergh', 'guerre-39', 'a-bombe'],
    recit: [
      ['vers 1050', 'Avant les Européens', 'De nombreux peuples amérindiens vivent sur ces terres. Cahokia, près du Mississippi, compte peut-être 20 000 habitants vers 1100.', 'Cahokia'],
      ['1607 – 1732', 'Treize colonies', 'Les Anglais fondent des colonies sur la côte atlantique. Les terres des Amérindiens sont prises, et des Africains réduits en esclavage y sont amenés.', 'Treize colonies'],
      ['1776', 'L’indépendance', 'Les colonies déclarent leur indépendance. Avec l’aide de la France, elles gagnent la guerre. George Washington devient le premier président en 1789.', 'Déclaration d\'indépendance des États-Unis'],
      ['XIXe siècle', 'Vers l’Ouest', 'Le pays s’étend jusqu’au Pacifique. Les peuples amérindiens sont chassés de leurs terres et enfermés dans des réserves.', 'Conquête de l\'Ouest'],
      ['1861 – 1865', 'La guerre de Sécession', 'Le Nord bat le Sud esclavagiste. L’esclavage est aboli en 1865 ; le président Lincoln est assassiné la même année.', 'Guerre de Sécession'],
      ['XXe siècle', 'Une superpuissance', 'Après les deux guerres mondiales, les États-Unis deviennent la première puissance. Ils envoient les premiers humains sur la Lune en 1969.', 'Apollo 11'],
    ],
  },

  // ---------------- Océanie ----------------
  {
    id: 'polynesiens', nom: 'Polynésiens et Maoris', region: 'oceanie', dates: 'vers 1500 av. J.-C. – aujourd’hui',
    resume: 'Les plus grands navigateurs de l’Antiquité, qui ont peuplé les îles du Pacifique.',
    evenements: ['m-lapita', 'm-paques', 'm-maoris', 'm-cook'],
    recit: [
      ['vers 1500 av. J.-C.', 'Les Lapita', 'Partis des îles proches de la Nouvelle-Guinée, les Lapita atteignent les Fidji, les Tonga et les Samoa. On les reconnaît à leurs poteries décorées.', 'Culture Lapita'],
      ['La navigation', 'Lire les étoiles et les vagues', 'Sur de grandes pirogues doubles, les navigateurs se guident grâce aux étoiles, aux vents, aux houles et aux oiseaux.', 'Navigation polynésienne'],
      ['vers 1000 – 1250', 'Le grand triangle', 'Ils atteignent Hawaï, l’île de Pâques et la Nouvelle-Zélande : un triangle plus grand que l’Europe, presque entièrement fait d’océan.', 'Triangle polynésien'],
      ['vers 1250 – 1500', 'Les moaï', 'Sur l’île de Pâques, les Rapa Nui sculptent près de 900 grandes statues, les moaï.', 'Moaï'],
      ['vers 1280', 'Les Maoris', 'Les Maoris s’installent en Nouvelle-Zélande, l’une des dernières grandes terres peuplées par les humains.', 'Maoris'],
      ['1769 – 1840', 'L’arrivée des Européens', 'Après les voyages de James Cook, les Européens s’installent. En 1840, le traité de Waitangi est signé entre Britanniques et chefs maoris.', 'Traité de Waitangi'],
    ],
  },
  {
    id: 'aborigenes', nom: 'Aborigènes d’Australie', region: 'oceanie', dates: 'il y a 50 000 ans – aujourd’hui',
    resume: 'L’une des plus anciennes cultures continues du monde.',
    evenements: ['a-australie', 'm-cook', 'm-australie'],
    recit: [
      ['il y a ~50 000 ans', 'Une arrivée par la mer', 'Les ancêtres des Aborigènes arrivent en Australie depuis l’Asie, en traversant la mer : l’un des premiers grands voyages de l’humanité.', 'Aborigènes d\'Australie'],
      ['il y a ~40 000 ans', 'Le lac Mungo', 'Des sépultures d’environ 40 000 ans y ont été trouvées, avec de l’ocre : des rites funéraires très anciens.', 'Lac Mungo'],
      ['Le Temps du rêve', 'Une culture vivante', 'Les récits du « Temps du rêve » racontent la création du monde et relient chaque peuple à sa terre. L’art rupestre aborigène est l’un des plus anciens du monde.', 'Temps du rêve'],
      ['1788', 'La colonisation', 'Les Britanniques s’installent à Sydney. Les maladies, les violences et la perte des terres frappent durement les Aborigènes.', 'Première flotte (Australie)'],
      ['Aujourd’hui', 'La reconnaissance', 'En 2008, le gouvernement australien a présenté des excuses officielles pour les enfants enlevés à leurs familles. Les cultures aborigènes restent bien vivantes.', 'Générations volées'],
    ],
  },
];

export const CIVILISATION_PAR_ID = Object.fromEntries(CIVILISATIONS.map((c) => [c.id, c]));
