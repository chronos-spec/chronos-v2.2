// L'arbre des espèces humaines (étage Humains).
// debut / fin = années avant aujourd'hui (fin: 0 = espèce vivante).
// parent = l'espèce dont elle descend probablement ; lien = 'probable' ou 'incertain'.
// Les liens de parenté entre fossiles restent très discutés : l'arbre montre l'hypothèse la plus courante.
// Sources : Smithsonian, Human Origins (humanorigins.si.edu) ; Muséum national d'Histoire naturelle.

export const ESPECES = [
  { id: 'sahelanthropus', nom: 'Sahelanthropus tchadensis', surnom: 'Toumaï', debut: 7.0e6, fin: 6.0e6, parent: null, lieu: 'Tchad',
    texte: 'Un des plus anciens membres connus de la lignée humaine. Seul un crâne et quelques os ont été trouvés : on discute encore s’il marchait debout.' },
  { id: 'orrorin', nom: 'Orrorin tugenensis', surnom: 'l’ancêtre du millénaire', debut: 6.1e6, fin: 5.7e6, parent: 'sahelanthropus', lien: 'incertain', lieu: 'Kenya',
    texte: 'Ses os de cuisse suggèrent qu’il marchait déjà sur deux jambes, tout en grimpant aux arbres.' },
  { id: 'ardipithecus', nom: 'Ardipithecus', surnom: 'Ardi', debut: 5.8e6, fin: 4.4e6, parent: 'orrorin', lien: 'incertain', lieu: 'Éthiopie',
    texte: 'Ardi marchait debout au sol, mais gardait un gros orteil écarté pour s’agripper aux branches.' },
  { id: 'anamensis', nom: 'Australopithecus anamensis', surnom: 'le premier australopithèque', debut: 4.2e6, fin: 3.8e6, parent: 'ardipithecus', lien: 'incertain', lieu: 'Kenya, Éthiopie',
    texte: 'Le plus ancien australopithèque connu. Il est sans doute l’ancêtre de l’espèce de Lucy.' },
  { id: 'afarensis', nom: 'Australopithecus afarensis', surnom: 'l’espèce de Lucy', debut: 3.85e6, fin: 2.95e6, parent: 'anamensis', lien: 'probable', lieu: 'Éthiopie, Tanzanie',
    texte: 'Lucy et les siens marchaient debout, comme le prouvent les empreintes de pas de Laetoli. Leur cerveau restait petit.' },
  { id: 'africanus', nom: 'Australopithecus africanus', surnom: 'l’enfant de Taung', debut: 3.3e6, fin: 2.1e6, parent: 'afarensis', lien: 'incertain', lieu: 'Afrique du Sud',
    texte: 'Le premier australopithèque découvert, en 1924. Un cousin plutôt qu’un ancêtre direct.' },
  { id: 'paranthropus', nom: 'Paranthropus', surnom: 'les « robustes »', debut: 2.7e6, fin: 1.2e6, parent: 'afarensis', lien: 'incertain', lieu: 'Afrique de l’Est et du Sud',
    texte: 'D’énormes mâchoires et de grosses dents pour mâcher des plantes dures. Une branche qui s’est éteinte sans descendants.' },
  { id: 'habilis', nom: 'Homo habilis', surnom: 'l’homme habile', debut: 2.4e6, fin: 1.4e6, parent: 'afarensis', lien: 'incertain', lieu: 'Afrique de l’Est',
    texte: 'Un des premiers membres du genre Homo, au cerveau un peu plus gros. Il taillait des outils en pierre.' },
  { id: 'naledi', nom: 'Homo naledi', surnom: 'l’homme de l’étoile', debut: 3.35e5, fin: 2.36e5, parent: 'habilis', lien: 'incertain', lieu: 'Afrique du Sud',
    texte: 'Un petit cerveau, mais une espèce récente, contemporaine des premiers Homo sapiens. Ses origines restent un mystère.' },
  { id: 'rudolfensis', nom: 'Homo rudolfensis', surnom: 'l’homme du lac Rodolphe', debut: 1.9e6, fin: 1.8e6, parent: 'habilis', lien: 'incertain', lieu: 'Kenya',
    texte: 'Un humain ancien au visage large et plat, contemporain d’Homo habilis. Sa place dans l’arbre est discutée.' },
  { id: 'erectus', nom: 'Homo erectus', surnom: 'l’homme debout', debut: 1.9e6, fin: 1.1e5, parent: 'habilis', lien: 'incertain', lieu: 'Afrique, Asie',
    texte: 'Grand marcheur aux proportions proches des nôtres, il est le premier à quitter l’Afrique. Il a vécu près de deux millions d’années.' },
  { id: 'antecessor', nom: 'Homo antecessor', surnom: 'l’homme pionnier', debut: 1.2e6, fin: 8.0e5, parent: 'erectus', lien: 'incertain', lieu: 'Espagne',
    texte: 'Un des premiers humains d’Europe, retrouvé à Atapuerca.' },
  { id: 'floresiensis', nom: 'Homo floresiensis', surnom: 'l’homme de Florès', debut: 1.0e5, fin: 5.0e4, parent: 'erectus', lien: 'incertain', lieu: 'Indonésie',
    texte: 'Un humain d’un mètre de haut, sur une île d’Indonésie. Sa petite taille vient peut-être de l’isolement sur l’île.' },
  { id: 'luzonensis', nom: 'Homo luzonensis', surnom: 'l’homme de Luçon', debut: 6.7e4, fin: 5.0e4, parent: 'erectus', lien: 'incertain', lieu: 'Philippines',
    texte: 'Une petite espèce découverte en 2019 sur une île des Philippines. On en sait encore très peu.' },
  { id: 'heidelbergensis', nom: 'Homo heidelbergensis', surnom: 'l’homme de Heidelberg', debut: 7.0e5, fin: 2.0e5, parent: 'erectus', lien: 'probable', lieu: 'Afrique, Europe',
    texte: 'Souvent vu comme l’ancêtre commun de Néandertal, des Dénisoviens et de nous. Il chassait de gros animaux avec des lances en bois.' },
  { id: 'neandertal', nom: 'Homo neanderthalensis', surnom: 'Néandertal', debut: 4.0e5, fin: 4.0e4, parent: 'heidelbergensis', lien: 'probable', lieu: 'Europe, Proche-Orient, Asie centrale',
    texte: 'Adapté au froid, il enterrait ses morts et taillait des outils fins. Les humains d’aujourd’hui hors d’Afrique portent environ 2 % de son ADN.' },
  { id: 'denisova', nom: 'Dénisoviens', surnom: 'les cousins de l’Altaï', debut: 3.0e5, fin: 4.0e4, parent: 'heidelbergensis', lien: 'probable', lieu: 'Sibérie, Tibet, Asie de l’Est',
    texte: 'Connus surtout par leur ADN, lu dans un os de doigt. Les peuples de Papouasie en portent encore une part. Dates très incertaines.' },
  { id: 'sapiens', nom: 'Homo sapiens', surnom: 'nous', debut: 3.0e5, fin: 0, parent: 'heidelbergensis', lien: 'probable', lieu: 'Afrique, puis le monde entier',
    texte: 'Notre espèce apparaît en Afrique, puis peuple toute la Terre. Elle a croisé Néandertal et les Dénisoviens, et elle est aujourd’hui la seule espèce humaine.' },
];

// Les rencontres entre espèces (on le sait grâce à l'ADN).
export const METISSAGES = [
  ['sapiens', 'neandertal'],
  ['sapiens', 'denisova'],
  ['neandertal', 'denisova'],
];

// Les grandes familles, pour la liste déroulante de la page Humains.
export const GROUPES_HUMAINS = [
  { id: 'gh-premiers', nom: 'Les premiers hominines', texte: 'Entre 7 et 4,4 millions d’années, en Afrique : les plus anciens membres connus de notre lignée.', especes: ['sahelanthropus', 'orrorin', 'ardipithecus'] },
  { id: 'gh-australopitheques', nom: 'Les australopithèques', texte: 'Ils marchent debout mais gardent un petit cerveau. Lucy en est la plus célèbre.', especes: ['anamensis', 'afarensis', 'africanus'] },
  { id: 'gh-paranthropes', nom: 'Les paranthropes', texte: 'Une branche « robuste », spécialisée dans les plantes dures, éteinte sans descendants.', especes: ['paranthropus'] },
  { id: 'gh-premiers-homo', nom: 'Les premiers Homo', texte: 'Un cerveau un peu plus gros et des outils taillés.', especes: ['habilis', 'rudolfensis', 'naledi'] },
  { id: 'gh-erectus', nom: 'Homo erectus et ses descendants d’Asie et d’Europe', texte: 'Le grand voyageur, sorti d’Afrique, et les espèces nées de lui sur d’autres continents.', especes: ['erectus', 'antecessor', 'floresiensis', 'luzonensis'] },
  { id: 'gh-recents', nom: 'Les humains récents', texte: 'L’ancêtre commun et ses trois branches : Néandertal, les Dénisoviens et nous.', especes: ['heidelbergensis', 'neandertal', 'denisova', 'sapiens'] },
];
