import { useEffect, useState } from 'react';

// Les pages du site, dans l'adresse après « #/ » :
//   (rien)            → la page d'accueil (les six étages à la suite)
//   #/vie             → la page de l'étage Vie
//   #/vie/jurassique  → la page de la période « Jurassique »
//   #/methodes        → « Comment on le sait ? » : les méthodes de datation expliquées
// Les ancres simples (#vie, #titre-accueil) restent sur la page d'accueil.

export function lireRoute(hash = window.location.hash) {
  if (!hash.startsWith('#/')) return { page: 'accueil', ancre: hash.slice(1) || null };
  const [etage, periode] = hash.slice(2).split('/').filter(Boolean).map(decodeURIComponent);
  if (!etage) return { page: 'accueil', ancre: null };
  if (periode) return { page: 'periode', etage, periode };
  return { page: 'etage', etage };
}

export function useRoute() {
  const [route, setRoute] = useState(() => lireRoute());
  useEffect(() => {
    const changer = () => setRoute(lireRoute());
    window.addEventListener('hashchange', changer);
    return () => window.removeEventListener('hashchange', changer);
  }, []);
  return route;
}

export const lienEtage = (idEtage) => `#/${idEtage}`;
export const lienPeriode = (idEtage, idPeriode) => `#/${idEtage}/${idPeriode}`;

export function allerVers(lien) {
  window.location.hash = lien.replace(/^#/, '');
}
