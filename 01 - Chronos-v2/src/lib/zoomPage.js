import { useEffect, useState } from 'react';

// Le zoom de toute la page (pour dézoomer et voir plus de choses à la fois).
export const NIVEAUX_PAGE = [0.5, 0.67, 0.8, 0.9, 1, 1.1, 1.25];

function lire() {
  try {
    const v = Number(localStorage.getItem('chronos-zoom-page'));
    return NIVEAUX_PAGE.includes(v) ? v : 1;
  } catch {
    return 1;
  }
}

export function useZoomPage() {
  const [zoom, setZoom] = useState(lire);
  useEffect(() => {
    document.documentElement.style.zoom = zoom === 1 ? '' : String(zoom);
    try {
      localStorage.setItem('chronos-zoom-page', String(zoom));
    } catch {
      /* stockage indisponible : tant pis */
    }
  }, [zoom]);
  const i = NIVEAUX_PAGE.indexOf(zoom);
  return {
    zoom,
    plus: () => setZoom(NIVEAUX_PAGE[Math.min(NIVEAUX_PAGE.length - 1, i + 1)]),
    moins: () => setZoom(NIVEAUX_PAGE[Math.max(0, i - 1)]),
    remettre: () => setZoom(1),
  };
}
