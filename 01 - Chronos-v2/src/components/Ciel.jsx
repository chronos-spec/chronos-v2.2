import { useMemo } from 'react';

// Le ciel étoilé : purement décoratif, caché aux lecteurs d'écran.
// Les étoiles sont toujours placées au même endroit (tirage « graine » fixe).
function etoilesFixes(nombre) {
  let graine = 7;
  const hasard = () => {
    graine = (graine * 16807) % 2147483647;
    return graine / 2147483647;
  };
  return Array.from({ length: nombre }, () => ({
    x: hasard() * 100,
    y: hasard() * 100,
    r: 0.6 + hasard() * 1.1,
    o: 0.3 + hasard() * 0.5,
    scintille: hasard() < 0.15,
  }));
}

export default function Ciel() {
  const etoiles = useMemo(() => etoilesFixes(90), []);
  return (
    <div className="ciel" aria-hidden="true">
      <div className="ciel__lueur" />
      <svg className="ciel__etoiles" width="100%" height="100%">
        {etoiles.map((e, i) => (
          <circle
            key={i}
            cx={`${e.x}%`}
            cy={`${e.y}%`}
            r={e.r}
            className={e.scintille ? 'etoile etoile--scintille' : 'etoile'}
            style={{ opacity: e.o, animationDelay: `${(i % 7) * 0.9}s` }}
          />
        ))}
      </svg>
    </div>
  );
}
