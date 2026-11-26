// Les parcours du « Mode Classe » (page #/classe), pour les enseignants.
// Un parcours = une suite ordonnée d'événements DÉJÀ présents sur le site (identifiants de PAR_ID).
// Aucun texte historique n'est recopié ici : titre, date et résumé viennent des fiches du site.
// Les questions de la fiche d'activité ne portent que sur ce qui est écrit sur ces fiches.
//
// ⚠ Intitulés des programmes : à vérifier par Pierre sur eduscol.education.fr
//   (les programmes peuvent avoir changé ; voir docs/fonctions/fonction-mode-classe.md).

export const PARCOURS = [
  {
    id: '6e-humanite',
    niveau: '6e · Histoire',
    titre: 'La longue histoire de l’humanité et des migrations',
    programme: 'Programme d’histoire de 6e, thème 1 (intitulé à vérifier sur eduscol)',
    etage: 'humains',
    duree: 'environ 1 heure',
    intro: 'Des premiers ancêtres en Afrique jusqu’aux premières villes et à l’écriture : comment les humains ont peuplé toute la Terre.',
    etapes: [
      'toumai', 'a-australopitheques', 'lucy', 'outils', 'homo', 'erectus', 'dmanissi', 'feu',
      'sapiens', 'afrique', 'a-australie', 'chauvet', 'a-ameriques',
      'agriculture', 'a-domestication', 'a-catal', 'ecriture', 'kheops',
    ],
    questions: [
      { q: 'Dans quel pays a-t-on trouvé Toumaï ?', etape: 'toumai', r: 'Au Tchad (il y a environ 7 millions d’années).' },
      { q: 'Quel âge ont les plus vieux outils en pierre connus ?', etape: 'outils', r: '3,3 millions d’années.' },
      { q: 'Dans quel pays a-t-on trouvé les plus anciens fossiles de notre espèce, Homo sapiens ?', etape: 'sapiens', r: 'Au Maroc, à Djebel Irhoud.' },
      { q: 'Cite deux choses que la maîtrise du feu a changées.', etape: 'feu', r: 'Se chauffer, se protéger des bêtes, cuire les aliments (deux réponses suffisent).' },
      { q: 'Comment les humains ont-ils pu arriver en Australie ?', etape: 'a-australie', r: 'En traversant la mer en bateau ou en radeau (il y a environ 50 000 ans).' },
      { q: 'D’où venaient les premiers humains arrivés en Amérique, et par où sont-ils passés ?', etape: 'a-ameriques', r: 'D’Asie, par la Béringie, il y a au moins 16 000 ans.' },
      { q: 'Dans quelle région de France se trouve la grotte Chauvet ? Cite deux animaux peints sur ses parois.', etape: 'chauvet', r: 'En Ardèche. Lions, chevaux, rhinocéros (deux suffisent).' },
      { q: 'Quels animaux ont été domestiqués au Proche-Orient au Néolithique ?', etape: 'a-domestication', r: 'Moutons, chèvres, porcs et bœufs (le chien accompagnait déjà les chasseurs).' },
      { q: 'Où est née l’écriture cunéiforme, et sur quoi écrivait-on ?', etape: 'ecriture', r: 'En Mésopotamie (l’actuel Irak), sur des tablettes d’argile.' },
      { q: 'Range dans l’ordre, du plus ancien au plus récent : l’écriture, Lucy, les premiers agriculteurs, les premiers Homo sapiens.', r: 'Lucy (3,2 millions d’années) → premiers Homo sapiens → premiers agriculteurs (~11 500 ans) → l’écriture.' },
    ],
  },
  {
    id: 'svt-evolution',
    niveau: 'Collège (cycle 4) · SVT',
    titre: 'Le vivant et son évolution',
    programme: 'Programme de SVT du cycle 4, partie sur le vivant et son évolution (intitulé à vérifier sur eduscol)',
    etage: 'vie',
    duree: 'environ 1 heure',
    intro: 'Des premiers microbes jusqu’aux primates : comment la vie s’est transformée et diversifiée pendant des milliards d’années.',
    etapes: [
      'premiere-vie', 'a-cyanobacteries', 'oxygene', 'noyau-cellule', 'a-sexe', 'ediacara', 'cambrien',
      'a-poissons', 'plantes', 'a-machoires', 'tiktaalik', 'a-reptiles', 'permien',
      'premiers-dinos', 'a-mammiferes', 'archaeopteryx', 'fleurs', 'dinosaures', 'primates', 'a-darwin',
    ],
    questions: [
      { q: 'Comment s’appellent les plus anciennes traces de vie sûres ? Qui les a construites ?', etape: 'premiere-vie', r: 'Les stromatolithes, des roches en couches construites par des microbes (on en trouve en Australie).' },
      { q: 'Quels êtres vivants ont rempli l’air d’oxygène ? Grâce à quoi ?', etape: 'oxygene', r: 'Les cyanobactéries, grâce à la lumière du Soleil.' },
      { q: 'Pourquoi la reproduction sexuée accélère-t-elle l’évolution ?', etape: 'a-sexe', r: 'Deux parents mélangent leurs gènes : les enfants sont tous différents.' },
      { q: 'Lors de l’explosion cambrienne, cite deux nouveautés qui apparaissent chez les animaux.', etape: 'cambrien', r: 'Des yeux, des carapaces, des pattes (deux suffisent).' },
      { q: 'À quoi ressemblaient les premiers vertébrés ?', etape: 'a-poissons', r: 'À de petits poissons sans mâchoire (vers 520 millions d’années).' },
      { q: 'Quel avantage l’œuf à coquille donne-t-il aux reptiles ?', etape: 'a-reptiles', r: 'Ils n’ont plus besoin de l’eau pour pondre : ils peuvent conquérir les terres.' },
      { q: 'Il y a combien de temps a eu lieu la plus grande extinction ?', etape: 'permien', r: 'Il y a 252 millions d’années (fin du Permien).' },
      { q: 'Qu’est-ce qui a causé la fin des grands dinosaures ? Où ?', etape: 'dinosaures', r: 'Un astéroïde d’environ 10 km, tombé au Mexique, à Chicxulub.' },
      { q: 'Quels animaux actuels sont les descendants des dinosaures ?', etape: 'dinosaures', r: 'Les oiseaux.' },
      { q: 'Quel savant a expliqué l’évolution des êtres vivants ? Dans quel livre et en quelle année ?', etape: 'a-darwin', r: 'Charles Darwin, « L’Origine des espèces », 1859.' },
    ],
  },
  {
    id: 'seconde-mediterranee',
    niveau: 'Lycée (seconde) · Histoire',
    titre: 'Le monde méditerranéen, de l’Antiquité au Moyen Âge',
    programme: 'Programme d’histoire de seconde, thème 1 sur la Méditerranée antique et médiévale (intitulé à vérifier sur eduscol)',
    etage: 'histoire',
    duree: 'environ 1 heure',
    intro: 'Grecs, Romains, Byzantins, Carolingiens et monde musulman : les grandes étapes d’une histoire partagée autour de la Méditerranée.',
    etapes: [
      'a-alphabet', 'a-rome', 'athenes', 'a-mediques', 'a-alexandre', 'a-cesar', 'auguste',
      'constantin', 'chute-rome', 'a-islam', 'charlemagne', 'a-croisades', 'a-constantinople',
    ],
    questions: [
      { q: 'De quels alphabets l’alphabet phénicien est-il l’ancêtre ?', etape: 'a-alphabet', r: 'Des alphabets grec et latin.' },
      { q: 'En quelle année la démocratie naît-elle à Athènes ?', etape: 'athenes', r: 'En 508 av. J.-C.' },
      { q: 'Contre quel empire les cités grecques se battent-elles pendant les guerres médiques ? Cite une bataille.', etape: 'a-mediques', r: 'L’Empire perse. Marathon, les Thermopyles ou Salamine.' },
      { q: 'Jusqu’où s’étend l’empire conquis par Alexandre le Grand ?', etape: 'a-alexandre', r: 'De la Grèce jusqu’à l’Inde, en treize ans.' },
      { q: 'Quelle est la conséquence de l’assassinat de Jules César ?', etape: 'a-cesar', r: 'Une guerre civile qui met fin à la République romaine.' },
      { q: 'Qui est le premier empereur romain, et depuis quelle date ?', etape: 'auguste', r: 'Auguste, en 27 av. J.-C.' },
      { q: 'En quelle année finit l’Empire romain d’Occident ?', etape: 'chute-rome', r: 'En 476.' },
      { q: 'Où naît l’islam ? Jusqu’où s’étend-il un siècle plus tard ?', etape: 'a-islam', r: 'En Arabie (vers 610 à 632). Un siècle plus tard, de l’Espagne à l’Inde.' },
      { q: 'Les croisades n’ont-elles été que des guerres ?', etape: 'a-croisades', r: 'Non : il y a aussi eu des échanges entre l’Orient et l’Occident (1096 à 1291).' },
      { q: 'Que se passe-t-il en 1453 ?', etape: 'a-constantinople', r: 'Les Ottomans prennent Constantinople : c’est la fin de l’Empire byzantin.' },
    ],
  },
];
