// L'arbre de parenté des animaux du bestiaire.
// Chaque groupe a un parent : on remonte ainsi d'une espèce jusqu'aux premiers animaux,
// et l'on trouve l'ancêtre commun de deux espèces (le premier groupe qu'elles partagent).
//
// depuis : premières traces connues du groupe, en années avant aujourd'hui (ordres de grandeur).
// eteint : groupe entièrement disparu (marqueur ✝).
// debat : la place de ce groupe dans l'arbre est encore discutée par les chercheurs.
// Sources : Tree of Life Web Project ; Muséum national d'Histoire naturelle ;
// Lecointre & Le Guyader, « Classification phylogénétique du vivant » (4e éd., 2016) ;
// Brusatte, « The Rise and Fall of the Dinosaurs » (2018) pour les archosaures.

export const GROUPES = [
  { id: 'animaux', nom: 'Animaux', depuis: 6.0e8, texte: 'Des êtres faits de nombreuses cellules, qui se nourrissent d’autres êtres vivants.' },

  { id: 'ediacara', parent: 'animaux', nom: 'Faune d’Édiacara', depuis: 5.75e8, eteint: true, debat: true,
    texte: 'Les premiers grands animaux, aux formes étranges. On ne sait pas encore bien où les placer.' },

  { id: 'bilateriens', parent: 'animaux', nom: 'Bilatériens', depuis: 5.55e8,
    texte: 'Les animaux avec un côté gauche et un côté droit, un avant et un arrière.' },

  { id: 'protostomiens', parent: 'bilateriens', nom: 'Protostomiens', depuis: 5.5e8,
    texte: 'Une des deux grandes branches : insectes, crustacés, mollusques, vers…' },
  { id: 'ecdysozoaires', parent: 'protostomiens', nom: 'Ecdysozoaires', depuis: 5.4e8,
    texte: 'Les animaux qui grandissent en changeant de peau (la mue).' },
  { id: 'lobopodiens', parent: 'ecdysozoaires', nom: 'Lobopodiens', depuis: 5.2e8, eteint: true,
    texte: 'Des « vers à pattes », lointains cousins des arthropodes.' },
  { id: 'arthropodes-souche', parent: 'ecdysozoaires', nom: 'Premiers cousins des arthropodes', depuis: 5.2e8, eteint: true,
    texte: 'Des animaux du Cambrien proches des arthropodes, mais sans leurs pattes articulées complètes.' },
  { id: 'arthropodes', parent: 'ecdysozoaires', nom: 'Arthropodes', depuis: 5.21e8,
    texte: 'Une carapace et des pattes articulées : insectes, araignées, crustacés…' },
  { id: 'trilobites', parent: 'arthropodes', nom: 'Trilobites', depuis: 5.21e8, eteint: true,
    texte: 'Des arthropodes marins à carapace en trois lobes. Disparus il y a 252 millions d’années.' },
  { id: 'chelicerates', parent: 'arthropodes', nom: 'Chélicérates', depuis: 5.0e8,
    texte: 'Les arthropodes à pinces près de la bouche : araignées, scorpions, limules.' },
  { id: 'euripterides', parent: 'chelicerates', nom: 'Euryptérides (scorpions de mer)', depuis: 4.67e8, eteint: true,
    texte: 'De grands chasseurs aquatiques. Certains dépassaient 2 mètres.' },
  { id: 'scorpions', parent: 'chelicerates', nom: 'Scorpions', depuis: 4.35e8,
    texte: 'Parmi les premiers animaux à vivre sur la terre ferme.' },
  { id: 'mandibulates', parent: 'arthropodes', nom: 'Mandibulates', depuis: 5.0e8,
    texte: 'Les arthropodes à mâchoires : mille-pattes, crustacés, insectes.' },
  { id: 'myriapodes', parent: 'mandibulates', nom: 'Myriapodes (mille-pattes)', depuis: 4.25e8,
    texte: 'Des arthropodes au corps long et aux très nombreuses pattes.' },
  { id: 'insectes', parent: 'mandibulates', nom: 'Insectes', depuis: 4.0e8,
    texte: 'Six pattes, et souvent des ailes. Les premiers animaux à voler.' },

  { id: 'mollusques', parent: 'protostomiens', nom: 'Mollusques', depuis: 5.3e8,
    texte: 'Un corps mou, souvent protégé par une coquille : escargots, huîtres, pieuvres.' },
  { id: 'cephalopodes', parent: 'mollusques', nom: 'Céphalopodes', depuis: 5.0e8,
    texte: 'Les mollusques à tentacules : pieuvres, calmars, nautiles.' },
  { id: 'ammonoides', parent: 'cephalopodes', nom: 'Ammonites', depuis: 4.0e8, eteint: true,
    texte: 'Des céphalopodes à coquille enroulée, disparus avec les dinosaures.' },

  { id: 'deuterostomiens', parent: 'bilateriens', nom: 'Deutérostomiens', depuis: 5.4e8,
    texte: 'L’autre grande branche : étoiles de mer, oursins… et nous.' },
  { id: 'cordes', parent: 'deuterostomiens', nom: 'Cordés', depuis: 5.3e8,
    texte: 'Les animaux avec une corde dans le dos, l’ébauche d’une colonne vertébrale.' },
  { id: 'vertebres', parent: 'cordes', nom: 'Vertébrés', depuis: 5.18e8,
    texte: 'Les animaux avec un squelette interne et un crâne.' },
  { id: 'agnathes', parent: 'vertebres', nom: 'Poissons sans mâchoires', depuis: 5.18e8, debat: true,
    texte: 'Les premiers poissons, sans mâchoires. Aujourd’hui, il en reste les lamproies.' },
  { id: 'gnathostomes', parent: 'vertebres', nom: 'Vertébrés à mâchoires', depuis: 4.4e8,
    texte: 'L’invention de la mâchoire a fait d’eux de grands chasseurs.' },
  { id: 'placodermes', parent: 'gnathostomes', nom: 'Placodermes', depuis: 4.3e8, eteint: true, debat: true,
    texte: 'Des poissons cuirassés de plaques d’os. Disparus il y a 359 millions d’années.' },
  { id: 'chondrichtyens', parent: 'gnathostomes', nom: 'Requins et raies', depuis: 4.4e8,
    texte: 'Des poissons au squelette de cartilage.' },
  { id: 'osteichtyens', parent: 'gnathostomes', nom: 'Poissons osseux', depuis: 4.25e8,
    texte: 'Un squelette d’os. Ce groupe comprend la plupart des poissons… et nous.' },
  { id: 'sarcopterygiens', parent: 'osteichtyens', nom: 'Poissons à nageoires charnues', depuis: 4.2e8,
    texte: 'Leurs nageoires ont des os, comme nos bras. Le cœlacanthe en fait partie.' },
  { id: 'tetrapodes', parent: 'sarcopterygiens', nom: 'Tétrapodes (animaux à quatre membres)', depuis: 3.75e8,
    texte: 'Les vertébrés à quatre pattes, sortis de l’eau.' },
  { id: 'tetrapodes-souche', parent: 'tetrapodes', nom: 'Premiers tétrapodes', depuis: 3.75e8, eteint: true,
    texte: 'Mi-poissons, mi-amphibiens, ils vivaient encore surtout dans l’eau.' },
  { id: 'amniotes', parent: 'tetrapodes', nom: 'Amniotes', depuis: 3.18e8,
    texte: 'Leurs œufs ont une coquille ou une enveloppe : ils peuvent pondre loin de l’eau.' },

  // La lignée des mammifères
  { id: 'synapsides', parent: 'amniotes', nom: 'Synapsides', depuis: 3.12e8,
    texte: 'La lignée qui mène aux mammifères. Ce ne sont pas des dinosaures !' },
  { id: 'pelycosaures', parent: 'synapsides', nom: 'Premiers synapsides (« pélycosaures »)', depuis: 3.1e8, eteint: true,
    texte: 'Souvent avec une voile sur le dos. Disparus avant les dinosaures.' },
  { id: 'therapsides', parent: 'synapsides', nom: 'Thérapsides', depuis: 2.75e8,
    texte: 'Des synapsides aux pattes plus droites, de plus en plus proches des mammifères.' },
  { id: 'gorgonopsiens', parent: 'therapsides', nom: 'Gorgonopsiens', depuis: 2.65e8, eteint: true,
    texte: 'Des chasseurs à dents de sabre, disparus il y a 252 millions d’années.' },
  { id: 'dicynodontes', parent: 'therapsides', nom: 'Dicynodontes', depuis: 2.7e8, eteint: true,
    texte: 'Des herbivores à bec et à deux défenses.' },
  { id: 'cynodontes', parent: 'therapsides', nom: 'Cynodontes', depuis: 2.6e8,
    texte: 'Les plus proches cousins des mammifères ; certains avaient sans doute des poils.' },
  { id: 'mammaliaformes', parent: 'cynodontes', nom: 'Mammaliaformes', depuis: 2.25e8,
    texte: 'Les mammifères et leurs tout premiers parents, petits et nocturnes.' },
  { id: 'mammiferes', parent: 'mammaliaformes', nom: 'Mammifères', depuis: 1.8e8,
    texte: 'Des poils, et du lait pour nourrir les petits.' },
  { id: 'placentaires', parent: 'mammiferes', nom: 'Placentaires et leurs ancêtres', depuis: 1.6e8,
    texte: 'Le bébé grandit longtemps dans le ventre de sa mère, nourri par le placenta.' },
  { id: 'xenarthres', parent: 'placentaires', nom: 'Xénarthres', depuis: 6.0e7,
    texte: 'Paresseux, tatous, fourmiliers.' },
  { id: 'proboscidiens', parent: 'placentaires', nom: 'Proboscidiens (éléphants)', depuis: 6.0e7,
    texte: 'Les animaux à trompe.' },
  { id: 'primates', parent: 'placentaires', nom: 'Primates', depuis: 5.6e7,
    texte: 'Lémuriens, singes, grands singes… et les humains.' },
  { id: 'carnivores', parent: 'placentaires', nom: 'Carnivores', depuis: 5.5e7,
    texte: 'Félins, chiens, ours, phoques…' },
  { id: 'perissodactyles', parent: 'placentaires', nom: 'Périssodactyles', depuis: 5.6e7,
    texte: 'Les sabots en nombre impair : chevaux, rhinocéros, tapirs.' },
  { id: 'cetartiodactyles', parent: 'placentaires', nom: 'Cétartiodactyles', depuis: 5.5e7,
    texte: 'Cerfs, vaches, hippopotames… et les baleines, qui sont leurs cousines !' },
  { id: 'cetaces', parent: 'cetartiodactyles', nom: 'Cétacés (baleines, dauphins)', depuis: 5.0e7,
    texte: 'Des mammifères à quatre pattes retournés à la mer.' },

  // La lignée des reptiles et des oiseaux
  { id: 'sauropsides', parent: 'amniotes', nom: 'Sauropsides (reptiles et oiseaux)', depuis: 3.18e8,
    texte: 'La lignée des reptiles, qui comprend aussi les oiseaux.' },
  { id: 'parareptiles', parent: 'sauropsides', nom: 'Parareptiles', depuis: 3.05e8, eteint: true, debat: true,
    texte: 'Des reptiles anciens, souvent trapus et cuirassés.' },
  { id: 'diapsides', parent: 'sauropsides', nom: 'Diapsides', depuis: 3.0e8,
    texte: 'Deux ouvertures de chaque côté du crâne : lézards, serpents, crocodiles, oiseaux.' },
  { id: 'ichthyosaures', parent: 'diapsides', nom: 'Ichthyosaures', depuis: 2.48e8, eteint: true, debat: true,
    texte: 'Des reptiles marins en forme de dauphin. Ce ne sont pas des dinosaures.' },
  { id: 'plesiosaures', parent: 'diapsides', nom: 'Plésiosaures', depuis: 2.03e8, eteint: true, debat: true,
    texte: 'Des reptiles marins à quatre nageoires. Ce ne sont pas des dinosaures.' },
  { id: 'squamates', parent: 'diapsides', nom: 'Squamates (lézards et serpents)', depuis: 2.4e8,
    texte: 'Les reptiles à écailles qui muent.' },
  { id: 'mosasaures', parent: 'squamates', nom: 'Mosasaures', depuis: 9.8e7, eteint: true,
    texte: 'Des lézards géants retournés à la mer, cousins des varans.' },
  { id: 'serpents', parent: 'squamates', nom: 'Serpents', depuis: 1.4e8,
    texte: 'Des lézards qui ont perdu leurs pattes.' },
  { id: 'archosaures', parent: 'diapsides', nom: 'Archosaures', depuis: 2.5e8,
    texte: 'Les « reptiles dominants » : crocodiles d’un côté, ptérosaures, dinosaures et oiseaux de l’autre.' },
  { id: 'pseudosuchiens', parent: 'archosaures', nom: 'Lignée des crocodiles', depuis: 2.45e8,
    texte: 'Les crocodiles et leurs nombreux cousins disparus.' },
  { id: 'avemetatarsaliens', parent: 'archosaures', nom: 'Lignée des oiseaux (Avémétatarsaliens)', depuis: 2.45e8,
    texte: 'L’ancêtre commun des ptérosaures et des dinosaures (et donc des oiseaux).' },
  { id: 'pterosaures', parent: 'avemetatarsaliens', nom: 'Ptérosaures', depuis: 2.28e8, eteint: true,
    texte: 'Les premiers vertébrés à voler. Cousins des dinosaures, mais pas des dinosaures.' },
  { id: 'dinosaures', parent: 'avemetatarsaliens', nom: 'Dinosaures', depuis: 2.33e8,
    texte: 'Des reptiles aux pattes bien droites sous le corps. Les oiseaux en sont les derniers survivants.' },
  { id: 'ornithischiens', parent: 'dinosaures', nom: 'Ornithischiens', depuis: 2.0e8, eteint: true,
    texte: 'Des dinosaures herbivores à bec : tricératops, stégosaures, iguanodons…' },
  { id: 'saurischiens', parent: 'dinosaures', nom: 'Saurischiens', depuis: 2.31e8,
    texte: 'Les grands herbivores à long cou et les théropodes.' },
  { id: 'sauropodomorphes', parent: 'saurischiens', nom: 'Sauropodomorphes', depuis: 2.31e8, eteint: true,
    texte: 'Les herbivores à long cou, dont les plus grands animaux terrestres.' },
  { id: 'theropodes', parent: 'saurischiens', nom: 'Théropodes', depuis: 2.31e8,
    texte: 'Les dinosaures bipèdes, souvent carnivores. Les oiseaux en descendent.' },
  { id: 'oiseaux', parent: 'theropodes', nom: 'Oiseaux', depuis: 1.5e8,
    texte: 'Des dinosaures à plumes qui volent (le plus souvent).' },
];

// La place de chaque animal du bestiaire (id du bestiaire → groupe le plus précis).
export const PLACE_ANIMAL = {
  dickinsonia: 'ediacara', charnia: 'ediacara', kimberella: 'ediacara',
  hallucigenia: 'lobopodiens',
  anomalocaris: 'arthropodes-souche', opabinia: 'arthropodes-souche',
  trilobite: 'trilobites', isotelus: 'trilobites',
  pentecopterus: 'euripterides', pterygotus: 'euripterides', eurypterus: 'euripterides', jaekelopterus: 'euripterides',
  pulmonoscorpius: 'scorpions',
  arthropleura: 'myriapodes', meganeura: 'insectes',
  cameroceras: 'cephalopodes', ammonites: 'ammonoides',
  pikaia: 'cordes',
  haikouichthys: 'agnathes', arandaspis: 'agnathes', birkenia: 'agnathes',
  dunkleosteus: 'placodermes', entelognathus: 'placodermes',
  cladoselache: 'chondrichtyens', akmonistion: 'chondrichtyens', helicoprion: 'chondrichtyens', megalodon: 'chondrichtyens',
  acanthostega: 'tetrapodes-souche', ichthyostega: 'tetrapodes-souche',
  dimetrodon: 'pelycosaures', edaphosaurus: 'pelycosaures',
  inostrancevia: 'gorgonopsiens', lystrosaurus: 'dicynodontes',
  morganucodon: 'mammaliaformes',
  juramaia: 'placentaires',
  megatherium: 'xenarthres',
  deinotherium: 'proboscidiens', platybelodon: 'proboscidiens', mammouth: 'proboscidiens',
  smilodon: 'carnivores', 'ours-cavernes': 'carnivores',
  eohippus: 'perissodactyles', hipparion: 'perissodactyles', paraceratherium: 'perissodactyles', 'rhinoceros-laineux': 'perissodactyles',
  megaloceros: 'cetartiodactyles',
  pakicetus: 'cetaces', basilosaurus: 'cetaces', livyatan: 'cetaces',
  hylonomus: 'sauropsides',
  scutosaurus: 'parareptiles',
  shonisaurus: 'ichthyosaures', liopleurodon: 'plesiosaures',
  mosasaurus: 'mosasaures', titanoboa: 'serpents',
  eudimorphodon: 'pterosaures', quetzalcoatlus: 'pterosaures',
  stegosaurus: 'ornithischiens', triceratops: 'ornithischiens', iguanodon: 'ornithischiens',
  plateosaurus: 'sauropodomorphes', brachiosaurus: 'sauropodomorphes', diplodocus: 'sauropodomorphes', argentinosaurus: 'sauropodomorphes',
  eoraptor: 'saurischiens',
  coelophysis: 'theropodes', allosaurus: 'theropodes', spinosaurus: 'theropodes', tyrannosaurus: 'theropodes', velociraptor: 'theropodes',
  gastornis: 'oiseaux', phorusrhacos: 'oiseaux', dodo: 'oiseaux',
};

// Des repères vivants pour comparer (on ne les trouve pas dans le bestiaire).
export const REPERES = [
  { id: 'humain', nom: 'Nous, les humains', place: 'primates', texte: 'Homo sapiens, un primate apparu il y a environ 300 000 ans.' },
  { id: 'poule', nom: 'La poule', place: 'oiseaux', texte: 'Un oiseau, donc un dinosaure théropode vivant.' },
  { id: 'crocodile', nom: 'Le crocodile', place: 'pseudosuchiens', texte: 'Le plus proche parent vivant des oiseaux, avec eux dans les archosaures.' },
  { id: 'lezard', nom: 'Le lézard', place: 'squamates', texte: 'Un squamate, comme les serpents.' },
  { id: 'requin-blanc', nom: 'Le requin blanc', place: 'chondrichtyens', texte: 'Un poisson au squelette de cartilage.' },
  { id: 'araignee', nom: 'L’araignée', place: 'chelicerates', texte: 'Une cousine des scorpions.' },
];

export const GROUPE_PAR_ID = Object.fromEntries(GROUPES.map((g) => [g.id, g]));

// Les enfants de chaque groupe (pour dessiner l'arbre).
export const ENFANTS = GROUPES.reduce((acc, g) => {
  if (g.parent) (acc[g.parent] ||= []).push(g.id);
  return acc;
}, {});

// Le chemin de la racine (Animaux) jusqu'au groupe donné.
export function chemin(idGroupe) {
  const ch = [];
  for (let g = GROUPE_PAR_ID[idGroupe]; g; g = GROUPE_PAR_ID[g.parent]) ch.unshift(g.id);
  return ch;
}

// L'ancêtre commun : le dernier groupe partagé par les deux chemins.
export function ancetreCommun(groupeA, groupeB) {
  const a = chemin(groupeA);
  const b = new Set(chemin(groupeB));
  let commun = null;
  a.forEach((id) => { if (b.has(id)) commun = id; });
  return commun;
}
