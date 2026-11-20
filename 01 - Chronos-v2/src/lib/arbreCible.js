// Petit relais entre la recherche et l'arbre du vivant (page Vie) :
// la recherche demande « montre cette espèce » ou « ouvre ce groupe » ; la page Vie
// le lit en s'ouvrant (ou tout de suite si elle est déjà ouverte).
let enAttente = null;

export function demanderArbre(demande) {
  enAttente = { ...demande, n: Date.now() };
  window.dispatchEvent(new CustomEvent('chronos-arbre', { detail: enAttente }));
}

export function prendreDemandeArbre() {
  const d = enAttente;
  enAttente = null;
  return d;
}
