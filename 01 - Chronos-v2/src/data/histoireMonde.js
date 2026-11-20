// L'Histoire, lieu par lieu (page de l'étage Histoire uniquement : la page d'accueil ne change pas).
// On choisit un ou plusieurs lieux : chacun a sa propre ligne, à la même échelle,
// pour comparer ce qui se passe au même moment ailleurs dans le monde.
// annee : négative avant J.-C. (ans = années avant 2026). La catégorie (Antiquité…) se déduit de l'année.
// Sources générales : Encyclopædia Universalis ; Larousse ; UNESCO (Histoire générale de l'Afrique) ;
// Smithsonian. Dates arrondies quand les historiens hésitent.

export const LIEUX = [
  { id: 'europe', nom: 'Europe et Méditerranée', court: 'Europe', couleur: '#7FB3FF' },
  { id: 'orient', nom: 'Proche et Moyen-Orient', court: 'Orient', couleur: '#F2B66D' },
  { id: 'afrique', nom: 'Afrique', court: 'Afrique', couleur: '#E9876B' },
  { id: 'asie', nom: 'Asie (Inde, Chine, Japon…)', court: 'Asie', couleur: '#E86A9E' },
  { id: 'ameriques', nom: 'Amériques', court: 'Amériques', couleur: '#6FD3A6' },
  { id: 'oceanie', nom: 'Océanie et Pacifique', court: 'Océanie', couleur: '#62C6E8' },
  { id: 'voyages', nom: 'Grands voyages et rencontres', court: 'Voyages', couleur: '#C9A8FF' },
];

// Les bornes des grandes périodes (pour mettre toutes les lignes à la même échelle).
export const BORNES_HISTOIRE = {
  antiquite: { debut: 5326, fin: 1550 }, // vers 3300 av. J.-C. → 476
  'moyen-age': { debut: 1550, fin: 534 }, // 476 → 1492
  modernes: { debut: 534, fin: 237 }, // 1492 → 1789
  contemporaine: { debut: 237, fin: 81 }, // 1789 → 1945
};

// Le lieu des événements déjà présents sur la page d'accueil.
export const LIEUX_DE = {
  ecriture: ['orient'], 'a-egypte': ['afrique', 'orient'], kheops: ['afrique'], 'a-akkad': ['orient'],
  'a-hammurabi': ['orient'], 'a-troie': ['europe'], 'a-alphabet': ['orient', 'europe'], 'a-rome': ['europe'],
  athenes: ['europe'], 'a-mediques': ['europe', 'orient'], 'a-bouddha': ['asie'], 'a-alexandre': ['europe', 'orient', 'voyages'],
  'a-qin': ['asie'], 'a-cesar': ['europe'], auguste: ['europe'], 'chute-rome': ['europe'],
  'a-islam': ['orient'], charlemagne: ['europe'], 'a-croisades': ['europe', 'orient'], 'a-magna-carta': ['europe'],
  peste: ['europe', 'orient', 'asie'], imprimerie: ['europe'], 'a-constantinople': ['europe', 'orient'],
  colomb: ['voyages', 'ameriques', 'europe'], 'a-copernic': ['europe'], galilee: ['europe'], newton: ['europe'],
  'a-industrie': ['europe'], 'a-usa': ['ameriques'],
  revolution: ['europe'], 'a-napoleon': ['europe'], 'a-waterloo': ['europe'], 'a-darwin': ['europe', 'voyages'],
  'a-allemagne': ['europe'], 'a-eiffel': ['europe'], 'a-einstein': ['europe'], 'guerre-14': ['europe', 'orient', 'afrique'],
  'a-russie': ['europe', 'asie'], 'a-crise-1929': ['ameriques', 'europe'], 'guerre-39': ['europe', 'asie', 'afrique', 'ameriques', 'oceanie'],
  'a-bombe': ['asie'],
};

const E = (id, annee, lieux, titre, resume, dateCourte) => ({
  id, annee, lieux, titre, resume, ans: 2026 - annee,
  dateCourte: dateCourte || (annee < 0 ? `vers ${-annee} av. J.-C.` : `${annee}`),
});

export const MONDE = [
  // ---------- France : dynasties, rois, guerres (lieu « Europe » ; civilisation « France ») ----------
  // Sources : Larousse ; Encyclopædia Universalis ; Archives nationales ; « Histoire de France » (Belin, dir. J. Cornette).
  E('fr-alesia', -52, ['europe'], 'Alésia', 'Vercingétorix, chef gaulois, se rend à Jules César. La Gaule devient romaine pour cinq siècles.', '52 av. J.-C.'),
  E('fr-clovis', 481, ['europe'], 'Clovis, roi des Francs', 'Début de la dynastie des Mérovingiens (481–751). Clovis unit une grande partie de la Gaule.', '481'),
  E('fr-bapteme', 498, ['europe'], 'Le baptême de Clovis', 'À Reims, Clovis se fait baptiser : les rois francs seront chrétiens.', 'vers 496–508 (date débattue)'),
  E('fr-poitiers', 732, ['europe'], 'La bataille de Poitiers', 'Charles Martel arrête une armée venue d’Al-Andalus (l’Espagne musulmane).', '732'),
  E('fr-pepin', 751, ['europe'], 'Pépin le Bref, roi', 'Début de la dynastie des Carolingiens (751–987), celle de Charlemagne.', '751'),
  E('fr-verdun', 843, ['europe'], 'Le traité de Verdun', 'Les petits-fils de Charlemagne se partagent l’empire. La partie ouest, la Francie occidentale, deviendra la France.', '843'),
  E('fr-capet', 987, ['europe'], 'Hugues Capet, roi', 'Début de la dynastie des Capétiens. Ses descendants régneront, de branche en branche, jusqu’en 1848.', '987'),
  E('fr-bouvines', 1214, ['europe'], 'La bataille de Bouvines', 'Philippe Auguste bat l’empereur germanique et ses alliés. Le pouvoir du roi de France s’affirme.', '1214'),
  E('fr-saint-louis', 1226, ['europe'], 'Saint Louis', 'Louis IX règne de 1226 à 1270. Roi justicier et croisé, il est déclaré saint en 1297.', '1226'),
  E('fr-valois', 1328, ['europe'], 'Les Valois', 'Philippe VI, premier roi de la branche des Valois (1328–1589).', '1328'),
  E('fr-cent-ans', 1337, ['europe'], 'La guerre de Cent Ans', 'Rois de France et d’Angleterre se disputent la couronne de France. Elle dure en fait 116 ans (1337–1453), avec des trêves.', '1337–1453'),
  E('fr-jeanne', 1429, ['europe'], 'Jeanne d’Arc', 'Elle aide à libérer Orléans assiégée et fait sacrer Charles VII à Reims. Brûlée à Rouen en 1431.', '1429'),
  E('fr-castillon', 1453, ['europe'], 'Castillon : fin de la guerre de Cent Ans', 'Les Anglais perdent la Guyenne. Il ne leur reste en France que Calais.', '1453'),
  E('fr-marignan', 1515, ['europe'], 'Marignan', 'François Ier, roi de la Renaissance, remporte une victoire en Italie. Il fera venir Léonard de Vinci en France.', '1515'),
  E('fr-villers', 1539, ['europe'], 'L’ordonnance de Villers-Cotterêts', 'Les actes officiels doivent être rédigés en français, et non plus en latin.', '1539'),
  E('fr-religion', 1562, ['europe'], 'Les guerres de Religion', 'Catholiques et protestants s’affrontent pendant plus de trente ans (1562–1598).', '1562–1598'),
  E('fr-barthelemy', 1572, ['europe'], 'La Saint-Barthélemy', 'À Paris, puis en province, des milliers de protestants sont massacrés.', '1572'),
  E('fr-henri4', 1589, ['europe'], 'Henri IV, premier Bourbon', 'Début de la dynastie des Bourbons. Protestant, il se convertit au catholicisme pour régner.', '1589'),
  E('fr-nantes', 1598, ['europe'], 'L’édit de Nantes', 'Henri IV accorde aux protestants la liberté de culte, avec des limites. Fin des guerres de Religion.', '1598'),
  E('fr-louis14', 1643, ['europe'], 'Louis XIV, le Roi-Soleil', 'Roi à 4 ans, il règne 72 ans (1643–1715), le plus long règne de l’histoire de France.', '1643'),
  E('fr-versailles', 1682, ['europe'], 'La cour à Versailles', 'Louis XIV installe la cour et le gouvernement au château de Versailles.', '1682'),
  E('fr-republique', 1792, ['europe'], 'La Première République', 'La royauté est abolie. Louis XVI est exécuté en janvier 1793.', '1792'),
  E('fr-restauration', 1815, ['europe'], 'La Restauration', 'Après Napoléon, les Bourbons reviennent sur le trône avec Louis XVIII.', '1815'),
  E('fr-1830', 1830, ['europe'], 'Les Trois Glorieuses', 'Trois jours de révolution à Paris. Louis-Philippe devient « roi des Français ».', '1830'),
  E('fr-1848', 1848, ['europe'], 'La Deuxième République', 'Fin de la monarchie. Vote pour tous les hommes et abolition de l’esclavage dans les colonies.', '1848'),
  E('fr-empire2', 1852, ['europe'], 'Le Second Empire', 'Louis-Napoléon Bonaparte, neveu de Napoléon, devient l’empereur Napoléon III.', '1852'),
  E('fr-1870', 1870, ['europe'], 'La guerre de 1870 et la République', 'Battue par la Prusse, la France perd l’Alsace et une partie de la Lorraine. La Troisième République est proclamée.', '1870'),
  E('fr-ferry', 1882, ['europe'], 'L’école de Jules Ferry', 'L’école primaire devient gratuite (1881), puis obligatoire et laïque (1882).', '1881–1882'),
  E('fr-1905', 1905, ['europe'], 'La séparation des Églises et de l’État', 'La République ne reconnaît ni ne finance aucun culte : c’est la laïcité.', '1905'),
  E('fr-appel', 1940, ['europe'], 'L’appel du 18 juin', 'Depuis Londres, le général de Gaulle appelle les Français à continuer le combat.', '1940'),
  E('fr-liberation', 1944, ['europe'], 'La libération de Paris', 'Le 25 août 1944, Paris est libérée par la Résistance, les Alliés et la 2e division blindée.', '1944'),

  // ---------- Antiquité ----------
  E('m-caral', -2600, ['ameriques'], 'Caral, la plus vieille ville des Amériques', 'Au Pérou, des pyramides et des places sont bâties à la même époque que celles d’Égypte.'),
  E('m-indus', -2600, ['asie'], 'Les villes de l’Indus', 'Mohenjo-daro et Harappa : des villes en briques, avec rues droites et égouts, au Pakistan actuel.'),
  E('m-shang', -1250, ['asie'], 'Les premiers écrits chinois', 'Sous la dynastie Shang, on grave des questions aux ancêtres sur des os et des carapaces de tortue.'),
  E('m-olmeques', -1200, ['ameriques'], 'Les Olmèques', 'Au Mexique, la première grande civilisation d’Amérique centrale sculpte des têtes géantes en pierre.'),
  E('m-lapita', -1500, ['oceanie', 'voyages'], 'Les navigateurs du Pacifique', 'Partis d’Asie du Sud-Est, des marins en pirogue commencent à peupler les îles du Pacifique.'),
  E('m-carthage', -814, ['afrique', 'europe'], 'La fondation de Carthage', 'Des Phéniciens fondent Carthage, en Tunisie actuelle, future rivale de Rome.', '814 av. J.-C. (selon la tradition)'),
  E('m-koush', -730, ['afrique'], 'Les pharaons noirs de Koush', 'Les rois de Koush, au Soudan actuel, conquièrent l’Égypte et règnent sur elle près d’un siècle.'),
  E('m-cyrus', -550, ['orient'], 'Cyrus et l’Empire perse', 'Cyrus le Grand fonde un empire immense, de l’Égée à l’Indus.', '550 av. J.-C.'),
  E('m-confucius', -500, ['asie'], 'Confucius', 'En Chine, un sage enseigne le respect, l’étude et le bon gouvernement. Sa pensée marque l’Asie pour 2 500 ans.', 'vers 500 av. J.-C.'),
  E('m-ashoka', -268, ['asie'], 'L’empereur Ashoka', 'En Inde, après une guerre sanglante, il se convertit au bouddhisme et fait graver des lois de paix.', '268 av. J.-C.'),
  E('m-muraille', -214, ['asie'], 'La Grande Muraille', 'Le premier empereur relie d’anciens murs pour protéger la Chine des peuples du Nord.', '214 av. J.-C.'),
  E('m-soie', -138, ['asie', 'voyages'], 'La route de la soie', 'L’envoyé chinois Zhang Qian part vers l’ouest : des routes commerciales relient bientôt la Chine à Rome.', '138 av. J.-C.'),
  E('m-teotihuacan', 100, ['ameriques'], 'Teotihuacan, la cité des dieux', 'Près de Mexico, une immense ville se construit autour des pyramides du Soleil et de la Lune.', 'vers 100'),
  E('m-papier', 105, ['asie'], 'Le papier', 'En Chine, Cai Lun perfectionne la fabrication du papier, bien moins cher que la soie.', '105'),
  E('m-aksoum', 330, ['afrique'], 'Le royaume d’Aksoum devient chrétien', 'En Éthiopie, ce puissant royaume commerçant adopte le christianisme.', 'vers 330'),
  E('m-maya', 250, ['ameriques'], 'L’âge d’or des Mayas', 'Cités de pierre, écriture, astronomie et calendrier très précis en Amérique centrale.', '250 à 900'),
  E('m-gupta', 320, ['asie'], 'L’Empire Gupta', 'L’« âge d’or » de l’Inde : mathématiques, astronomie, littérature.', '320'),

  // ---------- Moyen Âge ----------
  E('m-tang', 618, ['asie'], 'La dynastie Tang', 'La Chine connaît une grande époque de poésie, d’arts et d’échanges.', '618'),
  E('m-ghana', 800, ['afrique'], 'L’Empire du Ghana, pays de l’or', 'En Afrique de l’Ouest, un empire s’enrichit du commerce de l’or à travers le Sahara.', 'vers 800'),
  E('m-sagesse', 830, ['orient'], 'La Maison de la sagesse à Bagdad', 'Des savants traduisent et prolongent les textes grecs, perses et indiens : algèbre, médecine, astronomie.', 'vers 830'),
  E('m-sutra', 868, ['asie'], 'Le plus ancien livre imprimé daté', 'Le Sutra du Diamant, imprimé en Chine avec des planches de bois.', '868'),
  E('m-vikings', 1000, ['voyages', 'ameriques', 'europe'], 'Les Vikings en Amérique', 'Leif Erikson atteint Terre-Neuve, près de cinq siècles avant Colomb.', 'vers 1000'),
  E('m-cahokia', 1050, ['ameriques'], 'Cahokia', 'Près du Mississippi, une grande ville aux tertres de terre compte des milliers d’habitants.', 'vers 1050'),
  E('m-zimbabwe', 1100, ['afrique'], 'Le Grand Zimbabwe', 'Une ville de pierre aux murs immenses, au cœur d’un royaume commerçant d’Afrique australe.', '1100 à 1450'),
  E('m-angkor', 1150, ['asie'], 'Angkor Vat', 'Au Cambodge, l’Empire khmer bâtit le plus grand temple du monde.', 'vers 1150'),
  E('m-gengis', 1206, ['asie', 'voyages'], 'Gengis Khan', 'Il unit les Mongols et lance le plus grand empire d’un seul tenant de l’histoire.', '1206'),
  E('m-paques', 1250, ['oceanie'], 'Les statues de l’île de Pâques', 'Les Rapa Nui sculptent et dressent des centaines de moaï.', '1250 à 1500'),
  E('m-maoris', 1280, ['oceanie', 'voyages'], 'Les Maoris en Nouvelle-Zélande', 'Venus de Polynésie en pirogue, ils sont les premiers humains à s’y installer.', 'vers 1280'),
  E('m-marco-polo', 1271, ['voyages', 'asie', 'europe'], 'Marco Polo en Chine', 'Le marchand vénitien voyage jusqu’à la cour de Kubilai Khan et raconte ce qu’il a vu.', '1271 à 1295'),
  E('m-mansa', 1324, ['afrique'], 'Le pèlerinage de Mansa Moussa', 'L’empereur du Mali traverse l’Égypte vers La Mecque avec tant d’or que son prix s’effondre au Caire.', '1324'),
  E('m-tenochtitlan', 1325, ['ameriques'], 'La fondation de Tenochtitlan', 'Les Aztèques bâtissent leur capitale sur un lac : l’actuelle Mexico.', '1325'),
  E('m-ibn-battuta', 1325, ['voyages', 'afrique', 'orient', 'asie'], 'Les voyages d’Ibn Battuta', 'Parti du Maroc, il parcourt près de 120 000 km, de l’Afrique à la Chine.', '1325 à 1354'),
  E('m-zheng-he', 1405, ['voyages', 'asie', 'afrique'], 'Les flottes de Zheng He', 'L’amiral chinois mène d’immenses flottes jusqu’en Inde, en Arabie et sur les côtes d’Afrique.', '1405 à 1433'),
  E('m-incas', 1438, ['ameriques'], 'L’Empire inca', 'Pachacutec fait de Cuzco la capitale d’un empire qui s’étend le long des Andes.', '1438'),
  E('m-dias', 1488, ['voyages', 'afrique'], 'Le cap de Bonne-Espérance', 'Bartolomeu Dias contourne le sud de l’Afrique : la route maritime vers l’Inde s’ouvre.', '1488'),

  // ---------- Temps modernes ----------
  E('m-gama', 1498, ['voyages', 'asie'], 'Vasco de Gama en Inde', 'Le navigateur portugais atteint l’Inde par la mer en contournant l’Afrique.', '1498'),
  E('m-magellan', 1519, ['voyages'], 'Le premier tour du monde', 'L’expédition de Magellan fait le tour de la Terre en trois ans. Magellan meurt en route.', '1519 à 1522'),
  E('m-cortes', 1521, ['ameriques'], 'La chute des Aztèques', 'Hernán Cortés et ses alliés prennent Tenochtitlan. Les maladies venues d’Europe déciment les populations.', '1521'),
  E('m-traite', 1526, ['afrique', 'ameriques', 'voyages'], 'La traite atlantique', 'Plus de 12 millions d’Africains sont déportés vers les Amériques et réduits en esclavage, jusqu’au XIXe siècle.', 'à partir de 1526'),
  E('m-moghols', 1526, ['asie'], 'L’Empire moghol', 'Babur fonde en Inde un empire qui bâtira plus tard le Taj Mahal.', '1526'),
  E('m-pizarro', 1532, ['ameriques'], 'La conquête de l’Empire inca', 'Francisco Pizarro capture l’empereur Atahualpa.', '1532'),
  E('m-edo', 1603, ['asie'], 'Le Japon d’Edo', 'Les shoguns Tokugawa apportent deux siècles et demi de paix au Japon, fermé au monde.', '1603'),
  E('m-taj', 1632, ['asie'], 'Le Taj Mahal', 'L’empereur Shah Jahan fait bâtir ce tombeau de marbre blanc pour son épouse.', '1632'),
  E('m-cook', 1770, ['voyages', 'oceanie'], 'James Cook en Australie', 'Le navigateur anglais longe la côte est de l’Australie.', '1770'),
  E('m-australie', 1788, ['oceanie'], 'La colonisation de l’Australie', 'Une flotte anglaise débarque des bagnards à Sydney. Les Aborigènes, présents depuis plus de 50 000 ans, sont dépossédés.', '1788'),

  // ---------- Époque contemporaine ----------
  E('m-haiti', 1791, ['ameriques', 'afrique'], 'La révolution haïtienne', 'Les esclaves de Saint-Domingue se soulèvent. En 1804, Haïti devient la première république noire.', '1791 à 1804'),
  E('m-bolivar', 1810, ['ameriques'], 'Les indépendances d’Amérique latine', 'Avec Simón Bolívar et d’autres, les colonies espagnoles deviennent indépendantes.', '1810 à 1825'),
  E('m-opium', 1839, ['asie', 'europe'], 'La guerre de l’opium', 'Le Royaume-Uni impose à la Chine le commerce de l’opium.', '1839'),
  E('m-secession', 1861, ['ameriques'], 'La guerre de Sécession', 'Le Nord et le Sud des États-Unis s’affrontent. L’esclavage est aboli en 1865.', '1861 à 1865'),
  E('m-meiji', 1868, ['asie'], 'L’ère Meiji', 'Le Japon s’ouvre et se modernise à toute vitesse.', '1868'),
  E('m-suez', 1869, ['afrique', 'orient', 'voyages'], 'Le canal de Suez', 'Il relie la Méditerranée à la mer Rouge : plus besoin de contourner l’Afrique.', '1869'),
  E('m-berlin', 1884, ['afrique', 'europe'], 'Le partage de l’Afrique', 'À la conférence de Berlin, les pays européens se partagent l’Afrique sans les Africains.', '1884 à 1885'),
  E('m-adoua', 1896, ['afrique'], 'La victoire d’Adoua', 'L’Éthiopie bat l’armée italienne et reste indépendante.', '1896'),
  E('m-chine-1911', 1911, ['asie'], 'La fin de l’Empire chinois', 'Une révolution renverse le dernier empereur : la Chine devient une république.', '1911'),
  E('m-amundsen', 1911, ['voyages'], 'Le pôle Sud', 'Roald Amundsen et son équipe sont les premiers à l’atteindre.', '1911'),
  E('m-lindbergh', 1927, ['voyages', 'ameriques', 'europe'], 'La traversée de Lindbergh', 'Premier vol en solitaire sans escale entre New York et Paris.', '1927'),
  E('m-gandhi', 1930, ['asie'], 'La marche du sel', 'Gandhi conduit une marche non violente contre l’impôt britannique sur le sel.', '1930'),
];

// Dans quelle grande période tombe une année ?
export function categorieDe(annee) {
  if (annee < 476) return 'antiquite';
  if (annee < 1492) return 'moyen-age';
  if (annee < 1789) return 'modernes';
  return 'contemporaine';
}
