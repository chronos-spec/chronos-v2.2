// Les grands groupes du vivant, affichés en petit au-dessus de la ligne de l'étage Vie.
// Juste un repère : depuis quand chaque groupe existe (dates approximatives, premières traces connues).
// depuis / jusqua = années avant aujourd'hui (jusqua: 0 = toujours vivant).
// rang = la ligne du bandeau (deux groupes qui ne se chevauchent pas peuvent partager un rang).
// Sources générales : Smithsonian (Deep Time), Muséum national d'Histoire naturelle.

export const GROUPES_VIVANT = [
  { id: 'g-bacteries', nom: 'Bactéries et archées', depuis: 3.5e9, jusqua: 0, rang: 0 },
  { id: 'g-eucaryotes', nom: 'Cellules à noyau (algues, protistes)', depuis: 1.6e9, jusqua: 0, rang: 1 },
  { id: 'g-champignons', nom: 'Champignons', depuis: 1.0e9, jusqua: 0, rang: 2 },
  { id: 'g-animaux', nom: 'Animaux (éponges, méduses, vers…)', depuis: 5.75e8, jusqua: 0, rang: 3 },
  { id: 'g-poissons', nom: 'Poissons', depuis: 5.2e8, jusqua: 0, rang: 4 },
  { id: 'g-plantes', nom: 'Plantes terrestres', depuis: 4.7e8, jusqua: 0, rang: 5 },
  { id: 'g-insectes', nom: 'Insectes', depuis: 4.0e8, jusqua: 0, rang: 6 },
  { id: 'g-amphibiens', nom: 'Amphibiens', depuis: 3.7e8, jusqua: 0, rang: 7 },
  { id: 'g-reptiles', nom: 'Reptiles', depuis: 3.12e8, jusqua: 0, rang: 8 },
  { id: 'g-dinosaures', nom: 'Dinosaures', depuis: 2.3e8, jusqua: 6.6e7, rang: 9 },
  { id: 'g-primates', nom: 'Primates', depuis: 5.5e7, jusqua: 0, rang: 9 },
  { id: 'g-mammiferes', nom: 'Mammifères', depuis: 2.25e8, jusqua: 0, rang: 10 },
  { id: 'g-oiseaux', nom: 'Oiseaux', depuis: 1.5e8, jusqua: 0, rang: 11 },
  { id: 'g-fleurs', nom: 'Plantes à fleurs', depuis: 1.3e8, jusqua: 0, rang: 12 },
];

export const RANGS_VIVANT = Math.max(...GROUPES_VIVANT.map((g) => g.rang)) + 1;
