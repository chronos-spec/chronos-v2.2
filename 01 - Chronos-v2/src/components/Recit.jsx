import { useCallback, useEffect, useRef, useState } from 'react';
import { texteAge } from '../lib/ages.js';

// Le récit : l'histoire de l'univers en une minute environ.
// Une animation dessinée en code (canvas), sans vidéo, avec un sous-titre par scène
// et un compteur du temps. Si l'appareil demande moins de mouvement, on montre
// une image fixe par scène et l'on avance avec « Suivant ».

// Le temps qui défile : (seconde du récit → années avant aujourd'hui). Entre deux repères,
// on passe d'une date à l'autre sur une échelle logarithmique.
const TEMPS = [
  [0, 13.8e9], [5, 13.5e9], [10, 4.6e9], [15, 4.4e9], [20, 3.7e9], [25, 1.0e9],
  [30, 5.4e8], [35, 3.6e8], [41, 6.6e7], [46, 2.6e6], [51, 3.0e5], [56, 5.0e4], [61, 57], [64, 0],
];
const DUREE = 64;

function ansA(t) {
  for (let i = 1; i < TEMPS.length; i++) {
    const [t0, a0] = TEMPS[i - 1];
    const [t1, a1] = TEMPS[i];
    if (t <= t1) {
      const p = (t - t0) / (t1 - t0);
      if (a1 === 0) return a0 * (1 - p);
      return Math.exp(Math.log(a0) + (Math.log(a1) - Math.log(a0)) * p);
    }
  }
  return 0;
}

const SCENES = [
  { debut: 0, fin: 5, texte: 'Il y a 13,8 milliards d’années : le Big Bang. Tout l’univers jaillit d’un point minuscule et brûlant.' },
  { debut: 5, fin: 10, texte: 'Les premières étoiles s’allument. Elles se rassemblent en galaxies, dont la nôtre, la Voie lactée.' },
  { debut: 10, fin: 15, texte: 'Il y a 4,6 milliards d’années, le Soleil s’allume. Autour de lui, la Terre se forme : une boule de lave bombardée de roches.' },
  { debut: 15, fin: 20, texte: 'La Terre refroidit. La vapeur retombe en pluie pendant des millions d’années : les océans naissent. La Terre devient bleue.' },
  { debut: 20, fin: 25, texte: 'Dans l’eau apparaissent les premiers êtres vivants : des microbes, trop petits pour être vus.' },
  { debut: 25, fin: 30, texte: 'Les continents dérivent, très lentement. Ils se rassemblent en un seul, la Pangée, puis se séparent.' },
  { debut: 30, fin: 35, texte: 'La vie explose dans les mers : trilobites, poissons… Puis des animaux sortent de l’eau et marchent sur la terre ferme.' },
  { debut: 35, fin: 41, texte: 'Place aux dinosaures, pendant plus de 160 millions d’années… jusqu’à la chute d’un astéroïde géant.' },
  { debut: 41, fin: 46, texte: 'Les mammifères prennent la place. Viennent les glaciations : des espèces disparaissent, d’autres apparaissent et migrent.' },
  { debut: 46, fin: 51, texte: 'En Afrique, une lignée de grands singes se redresse et marche sur deux jambes. Puis elle apprend à maîtriser le feu.' },
  { debut: 51, fin: 56, texte: 'Homo sapiens, notre espèce, quitte l’Afrique et peuple toute la Terre.' },
  { debut: 56, fin: 61, texte: 'Il invente l’écriture, les villes, les machines… et en 1969, des humains marchent sur la Lune.' },
  { debut: 61, fin: 64, texte: 'Et l’histoire continue. À vous de l’explorer !' },
];

// Deux chiffres significatifs suffisent pour le compteur (629 millions plutôt que 629,69).
const arrondir = (a) => {
  const p = 10 ** Math.max(0, Math.floor(Math.log10(a)) - 2);
  return Math.round(a / p) * p;
};

const sceneA = (t) => SCENES.find((s) => t < s.fin) || SCENES[SCENES.length - 1];

export default function Recit() {
  const toile = useRef(null);
  const [etat, setEtat] = useState('attente'); // attente | lecture | pause | fini
  const [t, setT] = useState(0);
  const tRef = useRef(0);
  const reduit = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    document.title = 'Le récit · Chronos';
  }, []);

  // Dessin d'une image (au temps t), adapté à la taille de l'écran.
  const dessinerA = useCallback((temps) => {
    const c = toile.current;
    if (!c) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = c.clientWidth;
    const h = c.clientHeight;
    if (c.width !== Math.round(w * dpr)) { c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); }
    const ctx = c.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    dessiner(ctx, w, h, temps);
  }, []);

  // La boucle d'animation.
  useEffect(() => {
    if (etat !== 'lecture') return undefined;
    let id;
    let avant = performance.now();
    const image = (maintenant) => {
      const dt = Math.min(0.1, (maintenant - avant) / 1000);
      avant = maintenant;
      tRef.current = Math.min(DUREE, tRef.current + dt);
      dessinerA(tRef.current);
      setT(tRef.current);
      if (tRef.current >= DUREE) setEtat('fini');
      else id = requestAnimationFrame(image);
    };
    id = requestAnimationFrame(image);
    return () => cancelAnimationFrame(id);
  }, [etat, dessinerA]);

  // Image fixe : au départ, en pause, en mode « moins de mouvement », et quand la fenêtre change.
  useEffect(() => {
    if (etat !== 'lecture') dessinerA(tRef.current);
    const r = () => dessinerA(tRef.current);
    window.addEventListener('resize', r);
    return () => window.removeEventListener('resize', r);
  }, [etat, t, dessinerA]);

  const commencer = () => {
    tRef.current = 0;
    setT(0);
    if (reduit) {
      // Moins de mouvement : une image fixe au milieu de la première scène.
      const s = SCENES[0];
      tRef.current = (s.debut + s.fin) / 2;
      setT(tRef.current);
      setEtat('pause');
    } else setEtat('lecture');
  };
  const suivant = () => {
    const i = SCENES.indexOf(sceneA(tRef.current));
    const s = SCENES[Math.min(SCENES.length - 1, i + 1)];
    tRef.current = reduit ? (s.debut + s.fin) / 2 : s.debut;
    setT(tRef.current);
    if (i + 1 >= SCENES.length - 1 && reduit) setEtat('fini');
  };

  const scene = sceneA(t);
  const ans = ansA(t);
  const enCours = etat === 'lecture' || etat === 'pause';

  return (
    <div className="recit">
      <canvas ref={toile} className="recit__toile" aria-hidden="true" />
      <h1 className="sr-only">Le récit : l’histoire de l’univers en une minute</h1>

      {etat === 'attente' && (
        <div className="recit__accueil">
          <p className="recit__sur-titre">Le récit</p>
          <p className="recit__titre">13,8 milliards d’années en une minute</p>
          <button type="button" className="bouton-principal recit__commencer" onClick={commencer}>Commencer</button>
        </div>
      )}

      {etat !== 'attente' && (
        <>
          <p className="recit__compteur" aria-hidden="true">
            {ans > 0.5 ? `il y a ${texteAge(arrondir(ans))}` : 'aujourd’hui'}
          </p>
          <p className="recit__texte verre" aria-live="polite">{scene.texte}</p>
          <div className="recit__progression" aria-hidden="true"><span style={{ width: `${(t / DUREE) * 100}%` }} /></div>
          <div className="recit__boutons">
            {enCours && !reduit && (
              <button type="button" className="verre bouton-secondaire" onClick={() => setEtat(etat === 'lecture' ? 'pause' : 'lecture')}>
                {etat === 'lecture' ? 'Pause' : 'Reprendre'}
              </button>
            )}
            {enCours && (
              <button type="button" className="verre bouton-secondaire" onClick={suivant}>
                {reduit ? 'Suivant' : 'Scène suivante'}
              </button>
            )}
            {etat === 'fini' && (
              <>
                <button type="button" className="bouton-principal" onClick={commencer}>Revoir</button>
                <a className="verre bouton-secondaire recit__lien" href="#/ensemble">Voir la vue d’ensemble</a>
                <a className="verre bouton-secondaire recit__lien" href="#univers">Explorer la frise</a>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Le dessin. Tout est fait de formes simples (cercles, courbes) : léger et net.
   --------------------------------------------------------------------------- */

const lisse = (a, b, x) => {
  const p = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return p * p * (3 - 2 * p);
};
const melange = (c1, c2, p) => c1.map((v, i) => Math.round(v + (c2[i] - v) * p));
const rgb = (c, a = 1) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

// Des étoiles fixes (même tirage à chaque image).
const ETOILES = Array.from({ length: 220 }, (_, i) => {
  const r = (n) => {
    const x = Math.sin(i * 127.1 + n * 311.7) * 43758.5453;
    return x - Math.floor(x);
  };
  return { x: r(1), y: r(2), t: 0.4 + r(3) * 1.4, a: 0.3 + r(4) * 0.7 };
});

function dessiner(ctx, w, h, t) {
  const cx = w / 2;
  const cy = h * 0.44;
  const R = Math.min(w, h) * 0.24; // rayon de la Terre

  // Le fond : noir, puis bleu nuit.
  const fond = ctx.createLinearGradient(0, 0, 0, h);
  fond.addColorStop(0, '#04040a');
  fond.addColorStop(1, '#0b1030');
  ctx.fillStyle = fond;
  ctx.fillRect(0, 0, w, h);

  // Étoiles : elles apparaissent après le Big Bang.
  const vis = lisse(2.5, 6, t);
  ETOILES.forEach((s) => {
    ctx.fillStyle = `rgba(255,255,255,${s.a * vis * (t > 10 ? 0.6 : 1)})`;
    ctx.fillRect(s.x * w, s.y * h, s.t, s.t);
  });

  if (t < 5) bigBang(ctx, w, h, t);
  else if (t < 10.5) galaxies(ctx, w, h, t);

  if (t >= 9.5) {
    const entree = lisse(9.5, 12, t);
    // Le Soleil, à gauche, de plus en plus loin quand on zoome sur la Terre.
    const sx = cx - R * (2.6 - 0.6 * entree) - (t > 46 ? 400 : 0);
    soleil(ctx, sx, cy, R * 0.55 * entree, t);
    terre(ctx, cx, cy, R * entree, t);
  }

  if (t >= 30 && t < 51) vivants(ctx, w, h, t, cx, cy, R);
  if (t >= 37.5 && t < 41) asteroide(ctx, w, h, t, cx, cy, R);
  if (t >= 56) fusee(ctx, w, h, t, cx, cy, R);
}

function bigBang(ctx, w, h, t) {
  const cx = w / 2;
  const cy = h * 0.44;
  // Éclair blanc puis boule de lumière qui grandit.
  const r = Math.max(1, (t / 5) ** 0.6 * Math.hypot(w, h) * 0.6);
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
  const a = 1 - lisse(1.5, 5, t) * 0.85;
  g.addColorStop(0, `rgba(255,255,255,${a})`);
  g.addColorStop(0.25, `rgba(255,214,140,${a * 0.9})`);
  g.addColorStop(0.6, `rgba(167,139,250,${a * 0.5})`);
  g.addColorStop(1, 'rgba(10,10,30,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  // Des particules projetées dans toutes les directions.
  for (let i = 0; i < 160; i++) {
    const ang = i * 2.399;
    const v = 0.3 + ((i * 37) % 100) / 100;
    const d = (t / 5) * v * Math.hypot(w, h) * 0.55;
    ctx.fillStyle = `rgba(255,${200 + (i % 55)},${150 + (i % 100)},${0.9 * (1 - t / 6)})`;
    ctx.beginPath();
    ctx.arc(cx + Math.cos(ang) * d, cy + Math.sin(ang) * d, 1.6, 0, Math.PI * 2);
    ctx.fill();
  }
}

function galaxies(ctx, w, h, t) {
  const p = lisse(5, 7, t) * (1 - lisse(9.5, 10.5, t));
  const liste = [
    [0.22, 0.3, 70, '167,139,250'], [0.75, 0.25, 50, '125,180,255'], [0.62, 0.66, 90, '255,200,150'], [0.3, 0.7, 40, '200,170,255'],
  ];
  liste.forEach(([gx, gy, taille, coul], k) => {
    const x = gx * w;
    const y = gy * h;
    for (let i = 0; i < 260; i++) {
      const bras = i % 2;
      const d = (i / 260) * taille * (0.6 + 0.4 * p);
      const ang = d * 0.09 + bras * Math.PI + t * 0.25 * (k % 2 ? 1 : -1);
      ctx.fillStyle = `rgba(${coul},${p * (1 - d / taille) * 0.9})`;
      ctx.fillRect(x + Math.cos(ang) * d, y + Math.sin(ang) * d * 0.55, 1.6, 1.6);
    }
    const halo = ctx.createRadialGradient(x, y, 0, x, y, taille * 0.4);
    halo.addColorStop(0, `rgba(255,240,220,${0.7 * p})`);
    halo.addColorStop(1, 'rgba(255,240,220,0)');
    ctx.fillStyle = halo;
    ctx.fillRect(x - taille, y - taille, taille * 2, taille * 2);
  });
}

function soleil(ctx, x, y, r, t) {
  if (r < 1) return;
  const g = ctx.createRadialGradient(x, y, 0, x, y, r * 2.4);
  g.addColorStop(0, 'rgba(255,250,220,1)');
  g.addColorStop(0.35, 'rgba(255,200,90,0.95)');
  g.addColorStop(0.5, 'rgba(255,150,50,0.35)');
  g.addColorStop(1, 'rgba(255,120,40,0)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r * 2.4 * (1 + 0.03 * Math.sin(t * 3)), 0, Math.PI * 2);
  ctx.fill();
}

// Les continents : une position « Pangée » (tous réunis) et une position « aujourd'hui ».
// Coordonnées en fractions du rayon de la Terre ; [x, y, rx, ry, rotation].
const CONTINENTS = [
  { p: [-0.18, -0.2, 0.22, 0.16, 0.3], a: [-0.55, -0.35, 0.28, 0.2, 0.4] }, // Amérique du Nord
  { p: [-0.12, 0.12, 0.13, 0.2, 0.2], a: [-0.42, 0.25, 0.14, 0.26, 0.25] }, // Amérique du Sud
  { p: [0.08, 0.05, 0.18, 0.22, 0], a: [0.05, 0.1, 0.18, 0.24, 0] }, // Afrique
  { p: [0.2, -0.25, 0.3, 0.14, -0.1], a: [0.38, -0.42, 0.42, 0.16, -0.05] }, // Eurasie
  { p: [0.25, 0.25, 0.1, 0.08, 0.3], a: [0.62, 0.38, 0.12, 0.09, 0.1] }, // Australie
  { p: [0.12, 0.35, 0.18, 0.08, 0], a: [0.0, 0.82, 0.4, 0.1, 0] }, // Antarctique
];
// Avant la Pangée, les continents étaient plus petits et dispersés (simplifié).
const ANCIENS = [[-0.4, -0.1], [0.3, -0.3], [0.1, 0.35], [-0.2, 0.4], [0.45, 0.1], [-0.5, 0.3]];

function terre(ctx, x, y, r, t) {
  if (r < 1) return;
  // Couleur du globe : lave rouge → roche sombre → océan bleu.
  const lave = [200, 60, 20];
  const roche = [70, 55, 50];
  const ocean = [30, 90, 190];
  const refroidi = lisse(13, 16.5, t);
  const bleu = lisse(16, 19.5, t);
  const base = melange(melange(lave, roche, refroidi), ocean, bleu);

  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.clip();
  const g = ctx.createRadialGradient(x - r * 0.4, y - r * 0.4, r * 0.1, x, y, r);
  g.addColorStop(0, rgb(melange(base, [255, 255, 255], 0.25)));
  g.addColorStop(1, rgb(melange(base, [0, 0, 0], 0.45)));
  ctx.fillStyle = g;
  ctx.fillRect(x - r, y - r, r * 2, r * 2);

  // Lave : des taches qui rougeoient au début.
  const chaud = 1 - refroidi;
  if (chaud > 0.02) {
    for (let i = 0; i < 26; i++) {
      const a = i * 2.4 + t * 0.4;
      const d = ((i * 53) % 90) / 100;
      ctx.fillStyle = `rgba(255,${150 + (i % 80)},40,${0.55 * chaud})`;
      ctx.beginPath();
      ctx.arc(x + Math.cos(a) * d * r, y + Math.sin(a) * d * r, r * 0.06, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Continents : apparaissent avec les océans, puis dérivent (Pangée vers 25-28 s, carte actuelle à 30 s).
  const terres = lisse(17, 20, t);
  if (terres > 0) {
    const reunion = lisse(25, 27.5, t); // les anciens continents se rassemblent
    const separation = lisse(27.5, 30, t); // la Pangée se brise
    CONTINENTS.forEach((c, i) => {
      const ancien = ANCIENS[i];
      let [cxr, cyr, rx, ry, rot] = c.p;
      cxr = ancien[0] + (cxr - ancien[0]) * reunion;
      cyr = ancien[1] + (cyr - ancien[1]) * reunion;
      const k = separation;
      cxr += (c.a[0] - c.p[0]) * k;
      cyr += (c.a[1] - c.p[1]) * k;
      rx += (c.a[2] - c.p[2]) * k;
      ry += (c.a[3] - c.p[3]) * k;
      rot += (c.a[4] - c.p[4]) * k;
      // Désert au début, puis verdissement quand les plantes conquièrent la terre (~31 s).
      const vert = lisse(31, 34, t);
      const glace = i === 5 ? lisse(41, 44, t) : 0;
      const coul = melange(melange([150, 120, 85], [70, 140, 70], vert), [240, 245, 250], glace);
      ctx.fillStyle = rgb(coul, terres);
      ctx.beginPath();
      ctx.ellipse(x + cxr * r, y + cyr * r, rx * r, ry * r, rot, 0, Math.PI * 2);
      ctx.fill();
      // Une petite bosse pour des formes moins régulières.
      ctx.beginPath();
      ctx.ellipse(x + (cxr + rx * 0.5) * r, y + (cyr - ry * 0.4) * r, rx * 0.55 * r, ry * 0.6 * r, rot + 0.6, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  // Microbes : des points verts qui scintillent dans l'océan.
  const microbes = lisse(20, 22, t) * (1 - lisse(29, 31, t));
  if (microbes > 0) {
    for (let i = 0; i < 70; i++) {
      const a = i * 1.7;
      const d = ((i * 71) % 95) / 100;
      ctx.fillStyle = `rgba(120,255,170,${microbes * (0.4 + 0.4 * Math.sin(t * 4 + i))})`;
      ctx.fillRect(x + Math.cos(a) * d * r, y + Math.sin(a) * d * r, 2, 2);
    }
  }

  // Glaciations : les calottes de glace grandissent et reculent.
  const glace = lisse(41, 43, t) * (1 - lisse(48, 51, t) * 0.5);
  if (glace > 0) {
    const pulse = 0.18 + 0.12 * Math.sin((t - 41) * 1.6);
    ctx.fillStyle = `rgba(240,248,255,${0.9 * glace})`;
    ctx.beginPath();
    ctx.ellipse(x, y - r, r * 0.9, r * (0.25 + pulse) * glace, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x, y + r, r * 0.9, r * (0.2 + pulse * 0.6) * glace, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Sapiens peuple la Terre : des points partent d'Afrique, puis les lumières des villes.
  const sapiens = lisse(51, 55.5, t);
  if (sapiens > 0) {
    const afrique = [x + 0.08 * r, y + 0.05 * r];
    const cibles = [[-0.5, -0.35], [-0.42, 0.3], [0.4, -0.45], [0.2, -0.35], [0.62, 0.38], [0.55, -0.2], [-0.6, -0.2], [0.0, -0.4]];
    cibles.forEach(([tx, ty], i) => {
      const p = lisse(i * 0.08, i * 0.08 + 0.5, sapiens);
      const px = afrique[0] + (x + tx * r - afrique[0]) * p;
      const py = afrique[1] + (y + ty * r - afrique[1]) * p;
      ctx.strokeStyle = `rgba(255,220,140,${0.5 * p})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(afrique[0], afrique[1]);
      ctx.lineTo(px, py);
      ctx.stroke();
      ctx.fillStyle = 'rgba(255,230,160,0.95)';
      ctx.beginPath();
      ctx.arc(px, py, 3, 0, Math.PI * 2);
      ctx.fill();
    });
  }
  const villes = lisse(55, 58, t);
  if (villes > 0) {
    // Côté nuit (à droite, loin du Soleil) : des lumières de villes.
    ctx.fillStyle = 'rgba(0,0,30,0.35)';
    ctx.beginPath();
    ctx.arc(x + r * 0.55, y, r, 0, Math.PI * 2);
    ctx.fill();
    for (let i = 0; i < 90; i++) {
      const a = i * 2.17;
      const d = ((i * 61) % 85) / 100;
      ctx.fillStyle = `rgba(255,214,120,${villes * 0.9})`;
      ctx.fillRect(x + Math.abs(Math.cos(a)) * d * r * 0.9, y + Math.sin(a) * d * r * 0.85, 2, 2);
    }
  }
  ctx.restore();

  // Atmosphère : un liseré bleu une fois les océans formés.
  const air = lisse(16, 20, t);
  if (air > 0) {
    ctx.strokeStyle = `rgba(120,180,255,${0.55 * air})`;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(x, y, r + 3, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Bombardement de météorites au début.
  const bombes = 1 - lisse(13, 15, t);
  if (bombes > 0 && t > 10) {
    for (let i = 0; i < 6; i++) {
      const cycle = ((t * 1.3 + i * 0.37) % 1);
      const a = i * 1.1 + 0.6;
      const d = r * (2.2 - cycle * 1.2);
      ctx.strokeStyle = `rgba(255,200,120,${bombes * (1 - cycle)})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(a) * d, y + Math.sin(a) * d);
      ctx.lineTo(x + Math.cos(a) * (d + 30), y + Math.sin(a) * (d + 30));
      ctx.stroke();
    }
  }

  // La Lune, née d'un choc géant, tourne autour de la Terre.
  const lune = lisse(11.5, 13, t);
  if (lune > 0) {
    const a = t * 0.35;
    const lx = x + Math.cos(a) * r * 1.8;
    const ly = y + Math.sin(a) * r * 0.5;
    ctx.fillStyle = `rgba(200,200,210,${lune})`;
    ctx.beginPath();
    ctx.arc(lx, ly, r * 0.18, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Les êtres vivants, en silhouettes, sur un « sol » en bas de l'écran.
function vivants(ctx, w, h, t, cx, cy, R) {
  // Le paysage est placé au-dessus du sous-titre, pour rester bien visible.
  const sol = h * 0.74;
  const bas = h * 0.6;
  const finPaysage = h * 0.78;
  ctx.save();
  // Une bande de paysage : mer à gauche, terre à droite.
  const paysage = lisse(30, 31, t) * (1 - lisse(50, 51, t));
  ctx.globalAlpha = paysage;
  ctx.fillStyle = 'rgba(30,90,190,0.35)';
  ctx.fillRect(0, bas, w * 0.4, finPaysage - bas);
  const glace = lisse(41.5, 43, t) * (1 - lisse(47, 49, t));
  ctx.fillStyle = rgb(melange([60, 110, 60], [225, 235, 245], glace), 0.55);
  ctx.fillRect(w * 0.4, sol, w * 0.6, finPaysage - sol);

  // 30-33 s : trilobites et poissons dans la mer.
  const mer = lisse(30, 31, t) * (1 - lisse(35, 36, t));
  ctx.globalAlpha = paysage * mer;
  for (let i = 0; i < 4; i++) trilobite(ctx, w * (0.06 + i * 0.08), finPaysage - 20 - (i % 2) * 18, 18);
  for (let i = 0; i < 3; i++) poisson(ctx, ((t * 60 + i * 160) % (w * 0.4)), bas + 30 + i * 30, 20);

  // 32-35 s : un tétrapode sort de l'eau.
  const sortie = lisse(32, 35, t);
  if (t < 36) {
    ctx.globalAlpha = paysage * lisse(32, 32.5, t) * (1 - lisse(35, 36, t));
    tetrapode(ctx, w * (0.36 + 0.12 * sortie), sol - 8, 28, t);
  }

  // 35-41 s : dinosaures (un grand herbivore à long cou, un carnivore).
  const dinos = lisse(35, 36, t) * (1 - lisse(38.6, 39.4, t));
  if (dinos > 0) {
    ctx.globalAlpha = paysage * dinos;
    sauropode(ctx, w * 0.5 + (t - 35) * 14, sol, 110);
    theropode(ctx, w * 0.84 - (t - 35) * 12, sol, 50, t);
  }

  // 41-46 s : mammouths qui migrent dans le froid.
  const mammouths = lisse(41.5, 42.5, t) * (1 - lisse(45.5, 46.5, t));
  if (mammouths > 0) {
    ctx.globalAlpha = paysage * mammouths;
    for (let i = 0; i < 3; i++) mammouth(ctx, w * 0.45 + ((t - 41) * 40 + i * 130) % (w * 0.5), sol, 40);
  }

  // 46-51 s : du grand singe à l'humain debout, puis le feu.
  const humains = lisse(46, 47, t) * (1 - lisse(50.3, 51, t));
  if (humains > 0) {
    ctx.globalAlpha = paysage * humains;
    const p = lisse(46.5, 49, t); // de penché (singe) à droit (humain)
    marcheur(ctx, w * 0.5 + (t - 46) * 20, sol, 90, p, t);
    const feu = lisse(48.5, 49.5, t);
    if (feu > 0) flamme(ctx, w * 0.66, sol, 30 * feu, t);
  }
  ctx.restore();
}

function trilobite(ctx, x, y, s) {
  ctx.fillStyle = '#c9b48a';
  ctx.beginPath();
  ctx.ellipse(x, y, s, s * 0.6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#7a6640';
  ctx.lineWidth = 1;
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath();
    ctx.moveTo(x + i * s * 0.3, y - s * 0.55);
    ctx.lineTo(x + i * s * 0.3, y + s * 0.55);
    ctx.stroke();
  }
}
function poisson(ctx, x, y, s) {
  ctx.fillStyle = '#9fd3ff';
  ctx.beginPath();
  ctx.ellipse(x, y, s, s * 0.45, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x - s, y);
  ctx.lineTo(x - s * 1.6, y - s * 0.5);
  ctx.lineTo(x - s * 1.6, y + s * 0.5);
  ctx.fill();
}
function tetrapode(ctx, x, y, s, t) {
  ctx.fillStyle = '#7fae6a';
  ctx.beginPath();
  ctx.ellipse(x, y - s * 0.4, s * 1.4, s * 0.45, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x - s * 1.3, y - s * 0.4);
  ctx.lineTo(x - s * 2.6, y - s * 0.2);
  ctx.lineTo(x - s * 1.3, y - s * 0.1);
  ctx.fill();
  const pas = Math.sin(t * 8) * s * 0.25;
  ctx.strokeStyle = '#7fae6a';
  ctx.lineWidth = 3;
  [[-0.6, pas], [0.6, -pas]].forEach(([dx, p]) => {
    ctx.beginPath();
    ctx.moveTo(x + dx * s, y - s * 0.2);
    ctx.lineTo(x + dx * s + p, y + 2);
    ctx.stroke();
  });
}
function sauropode(ctx, x, y, s) {
  ctx.fillStyle = '#6f8f5a';
  ctx.beginPath();
  ctx.ellipse(x, y - s * 0.55, s * 0.7, s * 0.3, 0, 0, Math.PI * 2);
  ctx.fill();
  // Cou et tête
  ctx.strokeStyle = '#6f8f5a';
  ctx.lineCap = 'round';
  ctx.lineWidth = s * 0.14;
  ctx.beginPath();
  ctx.moveTo(x + s * 0.5, y - s * 0.65);
  ctx.quadraticCurveTo(x + s * 0.9, y - s * 1.1, x + s * 1.0, y - s * 1.45);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(x + s * 1.07, y - s * 1.48, s * 0.12, s * 0.07, 0.3, 0, Math.PI * 2);
  ctx.fill();
  // Queue
  ctx.lineWidth = s * 0.1;
  ctx.beginPath();
  ctx.moveTo(x - s * 0.6, y - s * 0.6);
  ctx.quadraticCurveTo(x - s * 1.1, y - s * 0.55, x - s * 1.5, y - s * 0.35);
  ctx.stroke();
  // Pattes
  ctx.lineWidth = s * 0.13;
  [-0.4, -0.15, 0.25, 0.45].forEach((dx) => {
    ctx.beginPath();
    ctx.moveTo(x + dx * s, y - s * 0.4);
    ctx.lineTo(x + dx * s, y);
    ctx.stroke();
  });
}
function theropode(ctx, x, y, s, t) {
  ctx.fillStyle = '#a0603e';
  ctx.strokeStyle = '#a0603e';
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.ellipse(x, y - s * 1.2, s * 0.7, s * 0.35, -0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(x - s * 0.8, y - s * 1.6, s * 0.4, s * 0.22, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = s * 0.15;
  ctx.beginPath();
  ctx.moveTo(x + s * 0.6, y - s * 1.15);
  ctx.lineTo(x + s * 1.6, y - s * 1.0);
  ctx.stroke();
  const pas = Math.sin(t * 7) * s * 0.3;
  ctx.lineWidth = s * 0.18;
  [pas, -pas].forEach((p) => {
    ctx.beginPath();
    ctx.moveTo(x, y - s * 1.0);
    ctx.lineTo(x + p, y);
    ctx.stroke();
  });
}
function mammouth(ctx, x, y, s) {
  ctx.fillStyle = '#8a5a3a';
  ctx.beginPath();
  ctx.ellipse(x, y - s * 1.0, s * 1.0, s * 0.7, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + s * 0.9, y - s * 1.3, s * 0.45, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(x - s * 0.7, y - s * 0.6, s * 0.3, s * 0.6);
  ctx.fillRect(x + s * 0.4, y - s * 0.6, s * 0.3, s * 0.6);
  ctx.strokeStyle = '#f2ead8';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x + s * 1.2, y - s * 1.0);
  ctx.quadraticCurveTo(x + s * 1.8, y - s * 0.7, x + s * 1.6, y - s * 1.2);
  ctx.stroke();
}
// p = 0 : grand singe penché ; p = 1 : humain bien droit.
function marcheur(ctx, x, y, s, p, t) {
  const pench = (1 - p) * 0.6;
  ctx.strokeStyle = '#e8c468';
  ctx.fillStyle = '#e8c468';
  ctx.lineCap = 'round';
  ctx.lineWidth = s * 0.1;
  const hanche = [x, y - s * 0.5];
  const epaule = [x + Math.sin(pench) * s * 0.45, y - s * 0.5 - Math.cos(pench) * s * 0.45];
  ctx.beginPath();
  ctx.moveTo(...hanche);
  ctx.lineTo(...epaule);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(epaule[0] + Math.sin(pench) * s * 0.14, epaule[1] - Math.cos(pench) * s * 0.14, s * 0.11, 0, Math.PI * 2);
  ctx.fill();
  const pas = Math.sin(t * 6) * s * 0.18;
  [pas, -pas].forEach((d) => {
    ctx.beginPath();
    ctx.moveTo(...hanche);
    ctx.lineTo(x + d, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(...epaule);
    ctx.lineTo(epaule[0] - d * 0.6 + pench * s * 0.3, epaule[1] + s * (0.35 + pench * 0.3));
    ctx.stroke();
  });
}
function flamme(ctx, x, y, s, t) {
  const g = ctx.createRadialGradient(x, y - s * 0.6, 0, x, y - s * 0.6, s * 3);
  g.addColorStop(0, 'rgba(255,200,90,0.5)');
  g.addColorStop(1, 'rgba(255,120,40,0)');
  ctx.fillStyle = g;
  ctx.fillRect(x - s * 3, y - s * 3.6, s * 6, s * 6);
  ctx.fillStyle = '#ffb347';
  ctx.beginPath();
  ctx.moveTo(x - s * 0.5, y);
  ctx.quadraticCurveTo(x - s * 0.4, y - s * (1 + 0.15 * Math.sin(t * 12)), x, y - s * 1.4);
  ctx.quadraticCurveTo(x + s * 0.4, y - s, x + s * 0.5, y);
  ctx.fill();
}

function asteroide(ctx, w, h, t, cx, cy, R) {
  const p = lisse(37.5, 39, t);
  const x = w * 0.95 + (cx + R * 0.3 - w * 0.95) * p;
  const y = h * 0.05 + (cy - R * 0.2 - h * 0.05) * p;
  if (p < 1) {
    ctx.strokeStyle = 'rgba(255,190,120,0.6)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 60, y - 40);
    ctx.stroke();
    ctx.fillStyle = '#9a8070';
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.fill();
  }
  const flash = lisse(38.9, 39.1, t) * (1 - lisse(39.2, 40.8, t));
  if (flash > 0) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, R * 1.5);
    g.addColorStop(0, `rgba(255,240,200,${flash})`);
    g.addColorStop(1, 'rgba(255,120,40,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }
}

function fusee(ctx, w, h, t, cx, cy, R) {
  // La Lune grossit en haut à droite, la fusée part de la Terre et la rejoint.
  const arrivee = lisse(56, 57.5, t);
  const lx = w * 0.82;
  const ly = h * 0.18;
  const lr = R * 0.35 * arrivee;
  ctx.fillStyle = '#d6d6dc';
  ctx.beginPath();
  ctx.arc(lx, ly, lr, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(150,150,160,0.8)';
  [[-0.3, -0.2, 0.18], [0.25, 0.1, 0.12], [-0.1, 0.35, 0.1]].forEach(([dx, dy, rr]) => {
    ctx.beginPath();
    ctx.arc(lx + dx * lr, ly + dy * lr, rr * lr, 0, Math.PI * 2);
    ctx.fill();
  });

  const vol = lisse(57.5, 60.5, t);
  const sx = cx + R * 0.6;
  const sy = cy - R * 0.8;
  const ex = lx - lr * 0.6;
  const ey = ly + lr * 0.7;
  const x = sx + (ex - sx) * vol;
  const y = sy + (ey - sy) * vol - Math.sin(vol * Math.PI) * 80;
  const ang = Math.atan2(ey - sy - Math.cos(vol * Math.PI) * 80 * Math.PI, ex - sx);
  // Traînée
  ctx.strokeStyle = 'rgba(255,220,160,0.35)';
  ctx.setLineDash([4, 8]);
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let k = 0; k <= 20; k++) {
    const v = (vol * k) / 20;
    const px = sx + (ex - sx) * v;
    const py = sy + (ey - sy) * v - Math.sin(v * Math.PI) * 80;
    if (k === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();
  ctx.setLineDash([]);
  if (t < 56.8) return;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(ang + Math.PI / 2);
  ctx.fillStyle = '#f2f2f2';
  ctx.beginPath();
  ctx.moveTo(0, -14);
  ctx.lineTo(5, -4);
  ctx.lineTo(5, 10);
  ctx.lineTo(-5, 10);
  ctx.lineTo(-5, -4);
  ctx.closePath();
  ctx.fill();
  if (vol < 1) {
    ctx.fillStyle = '#ffb347';
    ctx.beginPath();
    ctx.moveTo(-4, 10);
    ctx.lineTo(0, 20 + 4 * Math.sin(t * 30));
    ctx.lineTo(4, 10);
    ctx.fill();
  }
  ctx.restore();
}
