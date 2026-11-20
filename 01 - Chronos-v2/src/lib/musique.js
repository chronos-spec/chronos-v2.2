// Une petite musique d'ambiance, jouée en direct par le navigateur (Web Audio) :
// pas de fichier à télécharger, pas de droits d'auteur. Nappes douces + notes pentatoniques,
// avec un écho. Elle ne démarre qu'après un clic (règle des navigateurs).

let ctx = null;
let maitre = null;
let minuteur = null;
let pas = 0;

const NOTE = (n) => 220 * 2 ** (n / 12); // n demi-tons au-dessus du la 220 Hz
// Suite d'accords (Do maj7, La m7, Fa maj7, Sol 6) et gamme pentatonique de do.
const ACCORDS = [[3, 7, 10, 14], [0, 3, 7, 10], [-4, 0, 3, 7], [-2, 2, 5, 9]];
const PENTA = [3, 5, 7, 10, 12, 15, 17, 19, 22, 24];

function son(freq, debut, duree, volume, type = 'sine') {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.setValueAtTime(0, debut);
  g.gain.linearRampToValueAtTime(volume, debut + Math.min(0.8, duree / 3));
  g.gain.exponentialRampToValueAtTime(0.0001, debut + duree);
  o.connect(g).connect(maitre);
  o.start(debut);
  o.stop(debut + duree + 0.05);
}

function mesure() {
  const t = ctx.currentTime + 0.05;
  const accord = ACCORDS[Math.floor(pas / 8) % ACCORDS.length];
  if (pas % 8 === 0) {
    // Nappe : l'accord tenu 4 secondes, très doux.
    accord.forEach((n) => son(NOTE(n - 12), t, 4.2, 0.05, 'triangle'));
    son(NOTE(accord[0] - 24), t, 4.2, 0.07, 'sine');
  }
  // Notes de « boîte à musique », une sur deux environ.
  if (Math.random() < 0.6) {
    const n = PENTA[Math.floor(Math.random() * PENTA.length)];
    son(NOTE(n), t, 1.6, 0.045, 'sine');
  }
  pas += 1;
}

export function demarrerMusique() {
  if (ctx) {
    ctx.resume();
    return;
  }
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  ctx = new AC();
  maitre = ctx.createGain();
  maitre.gain.value = 0.9;
  // Écho léger
  const echo = ctx.createDelay();
  echo.delayTime.value = 0.38;
  const retour = ctx.createGain();
  retour.gain.value = 0.35;
  const filtre = ctx.createBiquadFilter();
  filtre.type = 'lowpass';
  filtre.frequency.value = 2200;
  maitre.connect(filtre).connect(ctx.destination);
  maitre.connect(echo);
  echo.connect(retour).connect(echo);
  retour.connect(filtre);
  pas = 0;
  mesure();
  minuteur = setInterval(mesure, 500);
}

export function pauseMusique() {
  ctx?.suspend();
}

export function arreterMusique() {
  clearInterval(minuteur);
  minuteur = null;
  if (ctx) {
    const c = ctx;
    maitre.gain.linearRampToValueAtTime(0, c.currentTime + 0.4);
    setTimeout(() => c.close(), 500);
  }
  ctx = null;
}
