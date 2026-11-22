// ---------------------------------------------------------------------------
// Les ÉPOQUES du planisphère (bêta). Âges en millions d'années (Ma).
// Les côtes anciennes viennent du modèle scientifique de plaques tectoniques
// Merdith et al. 2021 (EarthByte, université de Sydney), calculées par le service GPlates.
// Plus on remonte, plus les contours sont incertains : on le dit au visiteur.
// ---------------------------------------------------------------------------
export const EPOQUES = [
  { ma: 0, nom: 'Aujourd’hui', periode: 'Holocène', texte: 'Sept continents, cinq océans. L’Atlantique s’élargit encore de 2 à 3 cm par an, à la vitesse où poussent nos ongles.' },
  { ma: 20, nom: 'Il y a 20 millions d’années', periode: 'Miocène', texte: 'L’Inde a percuté l’Asie : l’Himalaya s’élève. La Méditerranée communique encore avec l’océan Indien.' },
  { ma: 50, nom: 'Il y a 50 millions d’années', periode: 'Éocène', texte: 'L’Inde, devenue une île, file vers le nord. L’Australie se détache lentement de l’Antarctique.' },
  { ma: 66, nom: 'Il y a 66 millions d’années', periode: 'Fin du Crétacé', texte: 'L’astéroïde frappe le Yucatán. L’Atlantique Sud est encore étroit, l’Inde est en pleine mer.' },
  { ma: 100, nom: 'Il y a 100 millions d’années', periode: 'Crétacé', texte: 'Les mers sont très hautes : une grande voie d’eau coupe l’Amérique du Nord en deux. L’Afrique et l’Amérique du Sud se séparent.' },
  { ma: 150, nom: 'Il y a 150 millions d’années', periode: 'Jurassique', texte: 'La Pangée se fend. L’Atlantique Nord commence à s’ouvrir, entre l’Afrique et l’Amérique du Nord.' },
  { ma: 200, nom: 'Il y a 200 millions d’années', periode: 'Fin du Trias', texte: 'La Pangée, le supercontinent, commence à se déchirer. D’immenses coulées de lave accompagnent une extinction de masse.' },
  { ma: 250, nom: 'Il y a 250 millions d’années', periode: 'Début du Trias', texte: 'Presque toutes les terres forment un seul bloc, la Pangée, entourée d’un océan unique : la Panthalassa.' },
  { ma: 300, nom: 'Il y a 300 millions d’années', periode: 'Carbonifère', texte: 'Le Gondwana, au sud, rejoint les continents du nord : la Pangée se forme. Grandes forêts et calotte de glace au pôle Sud.' },
  { ma: 400, nom: 'Il y a 400 millions d’années', periode: 'Dévonien', texte: 'Le grand Gondwana couvre le pôle Sud. Au nord de l’équateur, la Laurussia réunit l’Amérique du Nord et l’Europe.' },
  { ma: 500, nom: 'Il y a 500 millions d’années', periode: 'Cambrien', texte: 'La vie foisonne dans les mers. Les terres, encore nues, sont dispersées ; le Gondwana s’étend de l’équateur au pôle Sud.' },
  { ma: 600, nom: 'Il y a 600 millions d’années', periode: 'Édiacarien', texte: 'Le supercontinent Rodinia a éclaté. Premiers grands êtres vivants pluricellulaires au fond des mers.' },
  { ma: 750, nom: 'Il y a 750 millions d’années', periode: 'Cryogénien', texte: 'Rodinia se disloque. Bientôt, des glaciations géantes : la Terre « boule de neige ».' },
  { ma: 1000, nom: 'Il y a 1 milliard d’années', periode: 'Protérozoïque', texte: 'Les continents se rassemblent en Rodinia, un supercontinent plus ancien que la Pangée. Aucune plante sur la terre ferme.' },
];

// Adresse du service GPlates (côtes reconstruites, au format GeoJSON).
export const urlCotes = (ma) =>
  `https://gws.gplates.org/reconstruct/coastlines/?time=${ma}&model=MERDITH2021&avoid_map_boundary=true`;
