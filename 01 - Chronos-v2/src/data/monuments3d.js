// ---------------------------------------------------------------------------
// MONUMENTS EN 3D : le pont vers Historivision
// Pour chaque monument (repéré par l'id de sa carte dans les données du site),
// on indique où se trouve son modèle 3D, son texte alternatif et son crédit.
//
// Les modèles (fichiers .glb) se rangent dans public/modeles/.
// Aucun modèle n'est fourni pour l'instant : tant que le fichier n'existe pas,
// le bouton « Voir en 3D » ne s'affiche pas sur la carte (vérification automatique).
//
// Pour ajouter un modèle :
//   1. déposer le fichier dans public/modeles/ avec le nom indiqué ci-dessous ;
//   2. remplir « credit » et « licence » (auteur, site d'origine, licence libre : CC BY, CC0…) ;
//   3. vérifier « etat » : 'aujourdhui' (le monument tel qu'on le voit) ou
//      'reconstitution' (tel qu'il était autrefois, d'après les historiens).
// ---------------------------------------------------------------------------

export const ETATS_3D = {
  aujourdhui: 'Le monument aujourd’hui',
  reconstitution: 'Reconstitution : le monument tel qu’il était autrefois (hypothèse des historiens)',
};

const A_COMPLETER = 'À compléter quand le modèle sera ajouté';

export const MONUMENTS_3D = {
  kheops: {
    modele: '/modeles/kheops.glb',
    alt: 'Modèle 3D de la pyramide de Khéops, à Gizeh (Égypte) : une pyramide à base carrée en blocs de calcaire.',
    credit: A_COMPLETER,
    licence: A_COMPLETER,
    etat: 'aujourdhui',
  },
  'm-muraille': {
    modele: '/modeles/grande-muraille.glb',
    alt: 'Modèle 3D d’une portion de la Grande Muraille de Chine : un long mur crénelé avec une tour de guet.',
    credit: A_COMPLETER,
    licence: A_COMPLETER,
    etat: 'aujourdhui',
  },
  'm-angkor': {
    modele: '/modeles/angkor-vat.glb',
    alt: 'Modèle 3D du temple d’Angkor Vat (Cambodge) : cinq tours en forme de bouton de lotus entourées de galeries.',
    credit: A_COMPLETER,
    licence: A_COMPLETER,
    etat: 'aujourdhui',
  },
  'm-taj': {
    modele: '/modeles/taj-mahal.glb',
    alt: 'Modèle 3D du Taj Mahal (Inde) : un mausolée de marbre blanc surmonté d’un grand dôme et entouré de quatre minarets.',
    credit: A_COMPLETER,
    licence: A_COMPLETER,
    etat: 'aujourdhui',
  },
  'fr-versailles': {
    modele: '/modeles/versailles.glb',
    alt: 'Modèle 3D du château de Versailles : un long palais classique autour d’une cour d’honneur.',
    credit: A_COMPLETER,
    licence: A_COMPLETER,
    etat: 'aujourdhui',
  },
  'a-eiffel': {
    modele: '/modeles/tour-eiffel.glb',
    alt: 'Modèle 3D de la tour Eiffel, à Paris : une tour en treillis de fer posée sur quatre piliers.',
    credit: A_COMPLETER,
    licence: A_COMPLETER,
    etat: 'aujourdhui',
  },
};

// Le fichier du modèle existe-t-il vraiment ? (on demande seulement l'en-tête, sans le télécharger)
// Le serveur renvoie la page du site (HTML) pour un fichier absent : on l'écarte aussi.
const dejaVerifie = new Map();
export function modeleDisponible(id) {
  const m = MONUMENTS_3D[id];
  if (!m) return Promise.resolve(false);
  if (!dejaVerifie.has(id)) {
    const url = import.meta.env.BASE_URL.replace(/\/$/, '') + m.modele;
    dejaVerifie.set(id, fetch(url, { method: 'HEAD' })
      .then((r) => r.ok && !(r.headers.get('content-type') || '').includes('text/html'))
      .catch(() => false));
  }
  return dejaVerifie.get(id);
}
