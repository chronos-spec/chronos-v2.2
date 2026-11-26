// Les visites guidées : environ 3 minutes chacune, racontées étape par étape.
// Une étape = une fiche qui existe déjà sur la frise (son identifiant dans PAR_ID)
// + un court texte de narration (lu à voix haute et affiché en sous-titre).
// Les dates citées reprennent exactement celles des fiches (cartes.js, evenements.js, archives.js).
// Visite « Sapiens » : `lieu` place l'étape sur la carte du monde animée (lieu indicatif,
// celui que nomment la fiche ou la narration ; `puis` = un second point pour un trajet).
// Règle : ne rien inventer ici. Un fait nouveau doit d'abord entrer dans une fiche.

export const VISITES = [
  {
    id: 'oxygene',
    titre: 'D’où vient l’oxygène ?',
    accroche: 'Des étoiles aux forêts : l’histoire de l’air que nous respirons.',
    etage: 'vie',
    etapes: [
      { fiche: 'etoiles', narration: 'Notre voyage commence il y a environ 13,6 milliards d’années. Les premières étoiles s’allument. Dans leur cœur brûlant, elles fabriquent des atomes nouveaux, comme le carbone… et l’oxygène.' },
      { fiche: 'a-supernovae', narration: 'Quand les étoiles géantes explosent, elles dispersent cet oxygène dans l’espace. De nouvelles étoiles, et plus tard des planètes, naissent de ces débris.' },
      { fiche: 'terre-forme', narration: 'Il y a 4,54 milliards d’années, la Terre se forme autour du jeune Soleil. L’oxygène est déjà là, mais enfermé dans les roches et dans l’eau. L’air, lui, n’en contient presque pas.' },
      { fiche: 'premiere-vie', narration: 'Il y a environ 3,5 milliards d’années, des microbes construisent des roches en couches au bord de l’eau : les stromatolithes. Ce sont les plus anciennes traces de vie sûres.' },
      { fiche: 'a-cyanobacteries', narration: 'Vers 2,7 milliards d’années, des bactéries très spéciales entrent en scène : les cyanobactéries. Elles utilisent la lumière du Soleil et rejettent de l’oxygène.' },
      { fiche: 'fer-rubane', narration: 'Les roches de fer rubanées, dont les plus vieilles ont environ 3,8 milliards d’années, montrent des bandes colorées. Selon l’explication la plus répandue, une partie de ces bandes garde la trace du fer des océans qui réagissait avec l’oxygène.' },
      { fiche: 'oxygene', narration: 'Il y a environ 2,4 milliards d’années, l’oxygène s’accumule enfin dans l’air et les océans. Sans ces microbes, nous ne pourrions pas respirer.' },
      { fiche: 'a-huronienne', narration: 'Juste après, la Terre se refroidit fortement. Une grande partie de la planète se couvre de glace : c’est la première grande glaciation.' },
      { fiche: 'a-forets', narration: 'Bien plus tard, vers 350 millions d’années, d’immenses forêts de fougères géantes couvrent les marais. Leur bois enfoui deviendra le charbon. Notre air est l’héritage de ces êtres vivants.' },
    ],
  },
  {
    id: 'sapiens',
    titre: 'Le grand voyage de Sapiens',
    accroche: 'De l’Afrique au monde entier : comment notre espèce a peuplé la Terre.',
    etage: 'humains',
    carte: true, // la route se trace sur une carte du monde pendant la visite
    etapes: [
      { lieu: { nom: 'Éthiopie', lon: 40.9, lat: 11.3 }, fiche: 'homo', narration: 'Il y a 2,8 millions d’années, en Éthiopie, vivait l’un des premiers membres de notre genre, Homo. On le connaît grâce à une simple mâchoire. Ces premiers humains marchaient debout.' },
      { fiche: 'feu', narration: 'Maîtriser le feu a tout changé : se chauffer, se protéger des bêtes, cuire les aliments. En Europe, son usage régulier date d’environ 400 000 ans.' },
      { lieu: { nom: 'Maroc (Djebel Irhoud)', lon: -8.9, lat: 31.9 }, fiche: 'sapiens', narration: 'Il y a environ 300 000 ans apparaissent les plus anciens Homo sapiens connus. Leurs fossiles ont été trouvés au Maroc, à Djebel Irhoud. Ils avaient déjà un visage comme le nôtre.' },
      { fiche: 'a-parures', narration: 'Vers 100 000 ans, des coquillages percés et de l’ocre rouge apparaissent. On se décore, on se distingue : la pensée symbolique est là.' },
      { lieu: { nom: 'Corne de l’Afrique (sortie probable)', lon: 43.3, lat: 12.6 }, fiche: 'afrique', narration: 'Vers 60 000 ans, c’est le grand départ. Des groupes de Sapiens quittent l’Afrique et commencent à se répandre sur les autres continents.' },
      { lieu: { nom: 'Australie', lon: 133, lat: -25 }, fiche: 'a-australie', narration: 'Il y a environ 50 000 ans, des humains atteignent l’Australie. Pour y arriver, il a fallu traverser la mer, en bateau ou en radeau.' },
      { lieu: { nom: 'Ardèche, France', lon: 4.4, lat: 44.4 }, fiche: 'chauvet', narration: 'Vers 36 000 ans, en Ardèche, des artistes peignent des lions, des chevaux et des rhinocéros sur les parois de la grotte Chauvet. Ce sont parmi les plus anciennes peintures connues au monde.' },
      { lieu: { nom: 'Béringie, puis Amérique', lon: -168, lat: 65, puis: { lon: -100, lat: 40 } }, fiche: 'a-ameriques', narration: 'Il y a au moins 16 000 ans, des chasseurs venus d’Asie gagnent l’Amérique par la Béringie. Des empreintes de pas pourraient faire remonter cette arrivée à plus de 20 000 ans : la date est encore débattue.' },
      { lieu: { nom: 'Proche-Orient (Croissant fertile)', lon: 40, lat: 36 }, fiche: 'agriculture', narration: 'Vers 11 500 ans, certains groupes commencent à cultiver des plantes et à rester au même endroit. Ce sont les premiers agriculteurs. Le voyage de Sapiens continue… jusqu’à nous.' },
    ],
  },
  {
    id: 'etoiles',
    titre: 'Des étoiles à nous',
    accroche: 'Nous sommes faits de poussières d’étoiles : voici comment.',
    etage: 'univers',
    etapes: [
      { fiche: 'big-bang', narration: 'Il y a 13,8 milliards d’années, tout l’univers était plus petit et plus chaud que tout ce qu’on peut imaginer. Puis il s’est mis à grandir. Il grandit encore aujourd’hui.' },
      { fiche: 'lumiere', narration: '380 000 ans plus tard, l’univers s’est assez refroidi pour que les premiers atomes se forment. La lumière file enfin droit. Nos télescopes la captent encore aujourd’hui.' },
      { fiche: 'etoiles', narration: 'Vers 13,6 milliards d’années, d’énormes nuages de gaz s’effondrent et s’allument : les premières étoiles. Elles fabriquent des atomes plus lourds, comme le carbone et l’oxygène.' },
      { fiche: 'a-supernovae', narration: 'En explosant, les étoiles géantes dispersent le carbone, l’oxygène et le fer qu’elles ont fabriqués. Ce sont les briques de tout ce qui viendra ensuite.' },
      { fiche: 'soleil', narration: 'Il y a 4,57 milliards d’années, un nuage de gaz et de poussière s’effondre et s’allume : notre Soleil est né, à partir de matière déjà passée par d’autres étoiles.' },
      { fiche: 'terre-forme', narration: 'Autour de lui, les poussières se collent en cailloux, puis en planètes. Il y a 4,54 milliards d’années, la Terre se forme.' },
      { fiche: 'premiere-vie', narration: 'Vers 3,5 milliards d’années, la vie laisse ses premières traces sûres. Ses atomes de carbone et d’oxygène ont été forgés dans les étoiles.' },
      { fiche: 'sapiens', narration: 'Il y a environ 300 000 ans apparaît notre espèce, Homo sapiens. Le carbone, l’oxygène et le fer de notre corps ont été fabriqués par des étoiles : nous sommes, nous aussi, faits de poussières d’étoiles.' },
      { fiche: 'webb', narration: 'Depuis 2021, le télescope James Webb observe des galaxies nées peu après le Big Bang. L’histoire fait une boucle : aujourd’hui, nous regardons nos origines.' },
    ],
  },
];

export const VISITE_PAR_ID = Object.fromEntries(VISITES.map((v) => [v.id, v]));
