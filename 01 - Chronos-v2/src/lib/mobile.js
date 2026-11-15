import { useEffect, useState } from 'react';

// Vrai sur un écran de téléphone (moins de 700 px de large) : on affiche alors la ligne verticale.
const REQUETE = '(max-width: 699px)';

export function useEstMobile() {
  const [mobile, setMobile] = useState(() => typeof window !== 'undefined' && window.matchMedia(REQUETE).matches);
  useEffect(() => {
    const mq = window.matchMedia(REQUETE);
    const changer = () => setMobile(mq.matches);
    mq.addEventListener('change', changer);
    return () => mq.removeEventListener('change', changer);
  }, []);
  return mobile;
}
