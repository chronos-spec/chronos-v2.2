// Prépare la liste de tout ce que la loupe de recherche peut trouver.
import { GROUPES_VIVANT } from '../data/vivant.js';
import { ESPECES } from '../data/especes.js';
import { xPourAns } from './echelle.js';
import { texteAge } from './ages.js';
import { BESTIAIRE } from '../data/bestiaire.js';
import { GROUPES, construireFeuilles, chemin, GROUPE_PAR_ID } from '../data/phylogenie.js';

export function construireIndex(etages, parId) {
  const nomEtage = Object.fromEntries(etages.map((e) => [e.id, e.nom]));
  const index = [];
  const ajouter = (r) => index.push({ ...r, nomEtage: nomEtage[r.etage], ordre: index.length });

  etages.forEach((etage) => {
    ajouter({
      cle: `etage-${etage.id}`, type: 'Étage', etage: etage.id, titre: etage.nom,
      details: etage.sousTitre, motsCles: '', cible: { type: 'x', x: () => 0 },
    });
  });

  Object.values(parId).forEach((f) => {
    if (f.type === 'periode') {
      ajouter({
        cle: f.id, type: 'Période', etage: f.etage, titre: f.titre,
        details: [f.dateCourte, f.groupe].filter(Boolean).join(' · '),
        motsCles: `${f.autresNoms.join(' ')} ${f.resume || ''} ${f.points.join(' ')}`,
        carte: f.id, cible: { type: 'carte', id: f.id },
      });
    } else if (f.type === 'animal') {
      ajouter({
        cle: f.id, type: 'Animal', etage: f.etage, titre: f.titre,
        details: `${f.groupeNom} · ${f.dateCourte}`, motsCles: `${f.resume} ${f.nomPeriode}`,
        carte: f.id, cible: { type: 'carte', id: f.id },
      });
    } else {
      ajouter({
        cle: f.id, type: 'Événement', etage: f.etage, titre: f.titre,
        details: f.dateCourte, motsCles: `${f.resume || ''} ${f.texte || ''}`,
        carte: f.id, cible: { type: 'carte', id: f.id },
      });
    }
  });

  GROUPES_VIVANT.forEach((g) => {
    ajouter({
      cle: g.id, type: 'Groupe du vivant', etage: 'vie', titre: g.nom,
      details: g.jusqua ? `de ${texteAge(g.depuis)} à ${texteAge(g.jusqua)}` : `depuis ${texteAge(g.depuis)}`,
      motsCles: '', cible: { type: 'x', ans: g.depuis, x: (ligne) => xPourAns(ligne, g.depuis) },
    });
  });

  ESPECES.forEach((e) => {
    ajouter({
      cle: `espece-${e.id}`, type: 'Espèce humaine', etage: 'humains', titre: e.nom,
      details: `${e.surnom} · ${texteAge(e.debut)} → ${e.fin ? texteAge(e.fin) : 'aujourd’hui'}`,
      motsCles: `${e.lieu} ${e.texte}`, cible: { type: 'espece', id: e.id },
    });
  });

  // L'arbre du vivant : toutes les espèces d'aujourd'hui (baleine, abeille, chêne…)
  // et tous les groupes (mammifères, dinosaures, ptérosaures…).
  // Les animaux du bestiaire sont déjà dans l'index (type « Animal »).
  const nomsDe = (idGroupe) => chemin(idGroupe).map((g) => GROUPE_PAR_ID[g].nom).join(' ');
  construireFeuilles(BESTIAIRE)
    .filter((f) => f.id.startsWith('v-') || f.id.startsWith('h-'))
    .forEach((f) => {
      ajouter({
        cle: `arbre-${f.id}`, type: 'Espèce', etage: 'vie', titre: f.nom,
        details: `${GROUPE_PAR_ID[f.groupe]?.nom || ''} · arbre du vivant`,
        motsCles: `${f.texte || ''} ${nomsDe(f.groupe)}`,
        arbre: { feuille: f.id },
      });
    });
  GROUPES.forEach((g) => {
    ajouter({
      cle: `groupe-${g.id}`, type: 'Groupe du vivant', etage: 'vie', titre: g.nom,
      details: g.depuis ? `depuis ${texteAge(g.depuis)} · arbre du vivant` : 'arbre du vivant',
      motsCles: g.texte || '',
      arbre: { groupe: g.id },
    });
  });

  return index;
}
