// L'arbre du vivant (page de l'étage Vie) : les grands groupes, leurs sous-groupes
// et quelques espèces représentatives. On ouvre un groupe pour voir ce qu'il contient.
// depuis = années avant aujourd'hui (premières traces connues, arrondies).
// eteint : groupe ou espèce disparus (marqueur ambre).
// wiki : titre de l'article Wikipédia (en français) d'où vient l'image.
// Sources générales : Muséum national d'Histoire naturelle ; Tree of Life Web Project ; OneZoom.

export const ARBRE_VIVANT = [
  {
    id: 'v-bacteries', nom: 'Bactéries', depuis: 3.5e9, wiki: 'Bacteria',
    texte: 'Des cellules minuscules, sans noyau. Elles sont partout : sol, océans, et notre intestin.',
    enfants: [
      { id: 'v-cyanobacteries', nom: 'Cyanobactéries', wiki: 'Cyanobacteria', texte: 'Elles font la photosynthèse et ont rempli l’air d’oxygène.' },
      { id: 'v-ecoli', nom: 'Escherichia coli', wiki: 'Escherichia coli', texte: 'Une bactérie de notre intestin, très étudiée en laboratoire.' },
      { id: 'v-stromatolithes', nom: 'Stromatolithes', wiki: 'Stromatolithe', texte: 'Des « roches vivantes » bâties par des tapis de bactéries, depuis 3,5 milliards d’années.' },
    ],
  },
  {
    id: 'v-archees', nom: 'Archées', depuis: 3.5e9, wiki: 'Archaea',
    texte: 'Elles ressemblent aux bactéries, mais forment un monde à part. Certaines vivent dans l’eau bouillante ou très salée.',
    enfants: [
      { id: 'v-halobacterium', nom: 'Halobactéries', wiki: 'Halobacterium', texte: 'Elles colorent en rose les marais salants.' },
      { id: 'v-methanogenes', nom: 'Méthanogènes', wiki: 'Methanobrevibacter', texte: 'Elles fabriquent du méthane, par exemple dans l’estomac des vaches.' },
    ],
  },
  {
    id: 'v-protistes', nom: 'Protistes et algues', depuis: 1.6e9, wiki: 'Protiste',
    texte: 'Des êtres à cellules avec noyau, le plus souvent faits d’une seule cellule.',
    enfants: [
      { id: 'v-amibe', nom: 'Amibes', wiki: 'Amibe', texte: 'Une cellule qui change de forme pour avancer et avaler sa nourriture.' },
      { id: 'v-paramecie', nom: 'Paramécies', wiki: 'Paramecium', texte: 'Elles nagent grâce à des milliers de petits cils.' },
      { id: 'v-diatomees', nom: 'Diatomées', wiki: 'Diatomée', texte: 'Des algues dans une coque de verre ; elles produisent une grande part de l’oxygène.' },
      { id: 'v-algues-brunes', nom: 'Algues brunes (varech)', wiki: 'Phaeophyceae', texte: 'Elles forment de grandes forêts sous-marines.' },
    ],
  },
  {
    id: 'v-plantes', nom: 'Plantes', depuis: 4.7e8, wiki: 'Plantae',
    texte: 'Elles fabriquent leur nourriture avec la lumière du Soleil. Elles ont conquis la terre ferme.',
    enfants: [
      { id: 'v-mousses', nom: 'Mousses', depuis: 4.7e8, wiki: 'Bryophyta', texte: 'Sans racines ni vaisseaux, elles aiment l’humidité.' },
      { id: 'v-fougeres', nom: 'Fougères', depuis: 3.6e8, wiki: 'Filicophyta', texte: 'Elles se reproduisent par des spores, sous leurs feuilles.' },
      {
        id: 'v-coniferes', nom: 'Conifères', depuis: 3.0e8, wiki: 'Pinophyta', texte: 'Des arbres à graines nues, souvent en cônes.',
        enfants: [
          { id: 'v-sequoia', nom: 'Séquoia géant', wiki: 'Séquoia géant', texte: 'Parmi les plus grands et les plus vieux êtres vivants.' },
          { id: 'v-ginkgo', nom: 'Ginkgo', wiki: 'Ginkgo biloba', texte: 'Un « fossile vivant » à peine changé depuis les dinosaures.' },
        ],
      },
      {
        id: 'v-fleurs', nom: 'Plantes à fleurs', depuis: 1.3e8, wiki: 'Angiosperme', texte: 'Les plus nombreuses : environ 300 000 espèces.',
        enfants: [
          { id: 'v-graminees', nom: 'Graminées (blé, riz, maïs)', wiki: 'Poaceae', texte: 'Elles nourrissent l’humanité.' },
          { id: 'v-orchidees', nom: 'Orchidées', wiki: 'Orchidaceae', texte: 'Une des plus grandes familles de plantes.' },
          { id: 'v-chene', nom: 'Chêne', wiki: 'Chêne', texte: 'Un arbre de nos forêts qui peut vivre plus de 500 ans.' },
          { id: 'v-rose', nom: 'Rosier', wiki: 'Rosier', texte: 'De la même famille que le pommier et le cerisier.' },
        ],
      },
    ],
  },
  {
    id: 'v-champignons', nom: 'Champignons', depuis: 1.0e9, wiki: 'Fungi',
    texte: 'Ni plantes ni animaux : ils digèrent leur nourriture à l’extérieur d’eux. Ils sont plus proches de nous que des plantes.',
    enfants: [
      { id: 'v-levure', nom: 'Levure de boulanger', wiki: 'Saccharomyces cerevisiae', texte: 'Elle fait lever le pain et fermenter la bière.' },
      { id: 'v-penicillium', nom: 'Moisissures (Penicillium)', wiki: 'Penicillium', texte: 'L’une d’elles a donné la pénicilline.' },
      { id: 'v-cepe', nom: 'Champignons à chapeau', wiki: 'Cèpe de Bordeaux', texte: 'Ce qu’on voit n’est que le fruit : le champignon vit sous terre.' },
      { id: 'v-lichen', nom: 'Lichens', wiki: 'Lichen', texte: 'Une association d’un champignon et d’une algue.' },
    ],
  },
  {
    id: 'v-animaux', nom: 'Animaux', depuis: 5.75e8, wiki: 'Animalia',
    texte: 'Des êtres faits de nombreuses cellules, qui mangent d’autres êtres vivants et, le plus souvent, se déplacent.',
    enfants: [
      { id: 'v-eponges', nom: 'Éponges', depuis: 5.75e8, wiki: 'Porifera', texte: 'Les plus simples des animaux : ni muscles, ni nerfs.' },
      {
        id: 'v-cnidaires', nom: 'Méduses et coraux', depuis: 5.6e8, wiki: 'Cnidaria', texte: 'Des animaux aux cellules urticantes.',
        enfants: [
          { id: 'v-meduse', nom: 'Méduse', wiki: 'Aurelia aurita', texte: 'Elle est faite à 95 % d’eau.' },
          { id: 'v-corail', nom: 'Coraux', wiki: 'Corail', texte: 'Ils bâtissent les récifs, abris d’un quart des espèces marines.' },
        ],
      },
      {
        id: 'v-mollusques', nom: 'Mollusques', depuis: 5.3e8, wiki: 'Mollusca', texte: 'Un corps mou, souvent protégé par une coquille.',
        enfants: [
          { id: 'v-escargot', nom: 'Escargot', wiki: 'Escargot', texte: 'Il transporte sa maison sur son dos.' },
          { id: 'v-pieuvre', nom: 'Pieuvre', wiki: 'Octopoda', texte: 'Huit bras et un cerveau très développé.' },
          { id: 'v-ammonites', nom: 'Ammonites', wiki: 'Ammonoidea', eteint: true, texte: 'Disparues avec les dinosaures.' },
        ],
      },
      {
        id: 'v-arthropodes', nom: 'Arthropodes', depuis: 5.3e8, wiki: 'Arthropoda', texte: 'Des pattes articulées et une carapace : le groupe le plus nombreux.',
        enfants: [
          {
            id: 'v-insectes', nom: 'Insectes', depuis: 4.0e8, wiki: 'Insecta', texte: 'Plus d’un million d’espèces connues.',
            enfants: [
              { id: 'v-abeille', nom: 'Abeille', wiki: 'Abeille', texte: 'Elle pollinise une grande partie de nos cultures.' },
              { id: 'v-fourmi', nom: 'Fourmi', wiki: 'Fourmi', texte: 'Elles vivent en colonies très organisées.' },
              { id: 'v-papillon', nom: 'Papillon', wiki: 'Lepidoptera', texte: 'Chenille, chrysalide, puis papillon.' },
              { id: 'v-scarabee', nom: 'Scarabées', wiki: 'Coleoptera', texte: 'Les coléoptères : près d’une espèce animale sur quatre.' },
            ],
          },
          { id: 'v-araignees', nom: 'Araignées et scorpions', wiki: 'Arachnida', texte: 'Huit pattes.' },
          { id: 'v-crustaces', nom: 'Crustacés', wiki: 'Crustacea', texte: 'Crabes, crevettes, homards…' },
          { id: 'v-trilobites', nom: 'Trilobites', wiki: 'Trilobita', eteint: true, texte: 'Disparus il y a 252 millions d’années.' },
        ],
      },
      {
        id: 'v-echinodermes', nom: 'Étoiles de mer et oursins', depuis: 5.2e8, wiki: 'Echinodermata', texte: 'Un corps souvent en cinq parties.',
        enfants: [
          { id: 'v-etoile-mer', nom: 'Étoile de mer', wiki: 'Asteroidea', texte: 'Un bras coupé peut repousser.' },
          { id: 'v-oursin', nom: 'Oursin', wiki: 'Echinoidea', texte: 'Une boule de piquants qui broute les algues.' },
        ],
      },
      {
        id: 'v-vertebres', nom: 'Vertébrés', depuis: 5.2e8, wiki: 'Vertebrata', texte: 'Des animaux avec une colonne vertébrale… comme nous.',
        enfants: [
          {
            id: 'v-poissons', nom: 'Poissons', depuis: 5.2e8, wiki: 'Poisson', texte: 'Le premier groupe de vertébrés.',
            enfants: [
              { id: 'v-lamproie', nom: 'Lamproie', wiki: 'Petromyzontiformes', texte: 'Un poisson sans mâchoire, comme les tout premiers.' },
              { id: 'v-requin', nom: 'Requin blanc', wiki: 'Grand requin blanc', texte: 'Un squelette en cartilage, pas en os.' },
              { id: 'v-coelacanthe', nom: 'Cœlacanthe', wiki: 'Cœlacanthe', texte: 'On le croyait disparu ; on l’a retrouvé vivant en 1938.' },
              { id: 'v-saumon', nom: 'Saumon', wiki: 'Saumon atlantique', texte: 'Il remonte les rivières où il est né pour pondre.' },
            ],
          },
          {
            id: 'v-amphibiens', nom: 'Amphibiens', depuis: 3.7e8, wiki: 'Amphibia', texte: 'Ils vivent entre l’eau et la terre.',
            enfants: [
              { id: 'v-grenouille', nom: 'Grenouille', wiki: 'Anura', texte: 'Têtard dans l’eau, puis adulte à quatre pattes.' },
              { id: 'v-salamandre', nom: 'Salamandre', wiki: 'Salamandre tachetée', texte: 'Elle respire en partie par la peau.' },
            ],
          },
          {
            id: 'v-reptiles', nom: 'Reptiles', depuis: 3.12e8, wiki: 'Reptilia', texte: 'Une peau à écailles et des œufs à coquille.',
            enfants: [
              { id: 'v-tortues', nom: 'Tortues', wiki: 'Testudines', texte: 'Elles existent depuis plus de 200 millions d’années.' },
              { id: 'v-lezards', nom: 'Lézards et serpents', wiki: 'Squamata', texte: 'Plus de 10 000 espèces.' },
              { id: 'v-crocodiles', nom: 'Crocodiles', wiki: 'Crocodilia', texte: 'Les plus proches cousins vivants des oiseaux.' },
              { id: 'v-pterosaures', nom: 'Ptérosaures', wiki: 'Pterosauria', eteint: true, texte: 'Des reptiles volants, cousins des dinosaures.' },
              { id: 'v-ichtyosaures', nom: 'Ichtyosaures', wiki: 'Ichthyosauria', eteint: true, texte: 'Des reptiles marins en forme de dauphin.' },
            ],
          },
          {
            id: 'v-dinosaures', nom: 'Dinosaures', depuis: 2.3e8, wiki: 'Dinosauria', texte: 'Ils ne sont pas tous éteints : les oiseaux sont des dinosaures !',
            enfants: [
              { id: 'v-sauropodes', nom: 'Sauropodes (Diplodocus…)', wiki: 'Sauropoda', eteint: true, texte: 'Les géants au long cou.' },
              { id: 'v-ornithischiens', nom: 'Tricératops, stégosaure…', wiki: 'Ornithischia', eteint: true, texte: 'Des herbivores à cornes, plaques ou becs.' },
              { id: 'v-theropodes', nom: 'Théropodes (T. rex…)', wiki: 'Theropoda', eteint: true, texte: 'Les carnivores à deux pattes… dont descendent les oiseaux.' },
              {
                id: 'v-oiseaux', nom: 'Oiseaux', depuis: 1.5e8, wiki: 'Aves', texte: 'Les seuls dinosaures encore vivants.',
                enfants: [
                  { id: 'v-moineau', nom: 'Moineau', wiki: 'Moineau domestique', texte: 'Il vit près des humains partout dans le monde.' },
                  { id: 'v-aigle', nom: 'Aigle royal', wiki: 'Aigle royal', texte: 'Un rapace à la vue perçante.' },
                  { id: 'v-manchot', nom: 'Manchot empereur', wiki: 'Manchot empereur', texte: 'Il ne vole pas mais nage très bien.' },
                  { id: 'v-autruche', nom: 'Autruche', wiki: 'Autruche d’Afrique', texte: 'Le plus grand oiseau vivant.' },
                ],
              },
            ],
          },
          {
            id: 'v-mammiferes', nom: 'Mammifères', depuis: 2.25e8, wiki: 'Mammalia', texte: 'Des poils et du lait pour les petits.',
            enfants: [
              { id: 'v-ornithorynque', nom: 'Ornithorynque', wiki: 'Ornithorynque', texte: 'Un mammifère… qui pond des œufs.' },
              { id: 'v-kangourou', nom: 'Kangourou', wiki: 'Kangourou', texte: 'Un marsupial : le petit grandit dans une poche.' },
              { id: 'v-baleine', nom: 'Baleine bleue', wiki: 'Baleine bleue', texte: 'Le plus grand animal ayant jamais existé.' },
              { id: 'v-chauve-souris', nom: 'Chauves-souris', wiki: 'Chiroptera', texte: 'Les seuls mammifères qui volent vraiment.' },
              { id: 'v-rongeurs', nom: 'Rongeurs', wiki: 'Rodentia', texte: 'Près de 4 mammifères sur 10.' },
              { id: 'v-elephant', nom: 'Éléphants et mammouths', wiki: 'Elephantidae', texte: 'Le mammouth laineux était leur cousin.' },
              { id: 'v-felins', nom: 'Lion et autres félins', wiki: 'Felidae', texte: 'Des chasseurs aux griffes rétractiles.' },
              {
                id: 'v-primates', nom: 'Primates', depuis: 5.5e7, wiki: 'Primates', texte: 'Des mains qui saisissent, des yeux vers l’avant.',
                enfants: [
                  { id: 'v-lemurien', nom: 'Lémuriens', wiki: 'Lemuriformes', texte: 'Ils ne vivent qu’à Madagascar.' },
                  { id: 'v-gorille', nom: 'Gorille', wiki: 'Gorille', texte: 'Le plus grand des primates.' },
                  { id: 'v-chimpanze', nom: 'Chimpanzé', wiki: 'Chimpanzé commun', texte: 'Notre plus proche cousin vivant, avec le bonobo.' },
                  { id: 'v-humain', nom: 'Homo sapiens', wiki: 'Homo sapiens', texte: 'Notre espèce. Voir l’étage Humains.' },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];
