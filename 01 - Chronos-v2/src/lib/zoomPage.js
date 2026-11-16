import { useEffect, useState } from 'react';

// Le zoom de toute la page (pour dézoomer et voir plus de choses à la fois).
// Sur grand écran, la « taille normale » (100 %) correspond en réalité à 67 % du navigateur :
// c'est la taille jugée idéale sur ordinateur. Les niveaux affichés sont donc relatifs à cette base.
export const NIVEAUX_PAGE = [0.75, 0.9, 1, 1.1, 1.25, 1.5, 1.75];

const BASE_ORDI = 0.67;
const LARGEUR_ORDI = 1100; // en dessous (tablette, téléphone) : pas de réduction

function base() {
  return window.innerWidth >= LARGEUR_ORDI ? BASE_ORDI : 1;
}

function lire() {
  try {
    const v = Number(localStorage.getItem('chronos-zoom-page-v2'));
    return NIVEAUX_PAGE.includes(v) ? v : 1;
  } catch {
    return 1;
  }
}

export function useZoomPage() {
  const [zoom, setZoom] = useState(lire);
  const [b, setB] = useState(base);

  // Si la fenêtre change de taille (ordinateur ↔ tablette), on recalcule la base.
  useEffect(() => {
    const changer = () => setB(base());
    window.addEventListener('resize', changer);
    return () => window.removeEventListener('resize', changer);
  }, []);

  useEffect(() => {
    const reel = +(zoom * b).toFixed(3);
    const html = document.documentElement;
    html.style.zoom = reel === 1 ? '' : String(reel);
    // --zp : sert au CSS à corriger les hauteurs « 100vh » (sinon la page ne remplit pas l'écran).
    html.style.setProperty('--zp', String(reel));
    try {
      localStorage.setItem('chronos-zoom-page-v2', String(zoom));
    } catch {
      /* stockage indisponible : tant pis */
    }
  }, [zoom, b]);

  const i = NIVEAUX_PAGE.indexOf(zoom);
  return {
    zoom,
    min: NIVEAUX_PAGE[0],
    max: NIVEAUX_PAGE[NIVEAUX_PAGE.length - 1],
    plus: () => setZoom(NIVEAUX_PAGE[Math.min(NIVEAUX_PAGE.length - 1, i + 1)]),
    moins: () => setZoom(NIVEAUX_PAGE[Math.max(0, i - 1)]),
    remettre: () => setZoom(1),
  };
}
