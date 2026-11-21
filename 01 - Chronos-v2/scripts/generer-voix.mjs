// ---------------------------------------------------------------------------
// Génère les VOIX D'IA des récits de civilisations (page Histoire, bouton ▶).
// À lancer UNE FOIS sur ton ordinateur (ou à chaque modification des textes) :
//
//   Avec ElevenLabs (meilleure voix française) :
//     ELEVENLABS_API_KEY=ta_clé node scripts/generer-voix.mjs
//     (facultatif : ELEVENLABS_VOICE_ID=identifiant_de_la_voix_choisie)
//
//   Avec OpenAI (moins cher) :
//     OPENAI_API_KEY=ta_clé node scripts/generer-voix.mjs
//
//   Pour une seule civilisation :  node scripts/generer-voix.mjs egypte
//
// Résultat : un fichier MP3 par étape dans public/voix/civ/<civilisation>/<n>.mp3,
// et la liste des civilisations prêtes dans public/voix/civ/manifeste.json.
// Le site lit ces fichiers ; s'ils manquent, il garde la voix du navigateur.
// Les fichiers déjà créés ne sont pas refaits (supprime-les pour les régénérer).
// ---------------------------------------------------------------------------
import { mkdir, writeFile, readFile, access } from 'node:fs/promises';
import { CIVILISATIONS } from '../src/data/civilisations.js';

const DOSSIER = new URL('../public/voix/civ/', import.meta.url);
const cleEleven = process.env.ELEVENLABS_API_KEY;
const cleOpenAI = process.env.OPENAI_API_KEY;
if (!cleEleven && !cleOpenAI) {
  console.error('Il manque une clé : ELEVENLABS_API_KEY ou OPENAI_API_KEY.');
  process.exit(1);
}

// Ton de lecture demandé : un conteur calme et chaleureux, pour tous les âges.
const CONSIGNE =
  'Voix française naturelle de conteur documentaire : chaleureuse, posée, claire, rythme tranquille, ' +
  'prononciation soignée des noms propres et des dates.';

async function parler(texte) {
  if (cleEleven) {
    // Voix par défaut : « George » (narration) ; remplace-la par une voix française de la bibliothèque si tu veux.
    const voix = process.env.ELEVENLABS_VOICE_ID || 'JBFqnCBsd6RMkjVDRZzb';
    const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voix}?output_format=mp3_44100_64`, {
      method: 'POST',
      headers: { 'xi-api-key': cleEleven, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: texte,
        model_id: 'eleven_multilingual_v2',
        language_code: 'fr',
        voice_settings: { stability: 0.55, similarity_boost: 0.75, style: 0.2 },
      }),
    });
    if (!r.ok) throw new Error(`ElevenLabs ${r.status} : ${await r.text()}`);
    return Buffer.from(await r.arrayBuffer());
  }
  const r = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: { Authorization: `Bearer ${cleOpenAI}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'gpt-4o-mini-tts', voice: 'sage', input: texte, instructions: CONSIGNE, response_format: 'mp3' }),
  });
  if (!r.ok) throw new Error(`OpenAI ${r.status} : ${await r.text()}`);
  return Buffer.from(await r.arrayBuffer());
}

const existe = (u) => access(u).then(() => true, () => false);

const seule = process.argv[2];
const liste = CIVILISATIONS.filter((c) => !seule || c.id === seule);
let manifeste = [];
try {
  manifeste = JSON.parse(await readFile(new URL('manifeste.json', DOSSIER), 'utf8'));
} catch { /* première fois */ }

for (const civ of liste) {
  const dossier = new URL(`${civ.id}/`, DOSSIER);
  await mkdir(dossier, { recursive: true });
  process.stdout.write(`${civ.nom} `);
  for (let i = 0; i < civ.recit.length; i++) {
    const fichier = new URL(`${i}.mp3`, dossier);
    if (await existe(fichier)) { process.stdout.write('·'); continue; }
    const [, titre, texte] = civ.recit[i];
    await writeFile(fichier, await parler(`${titre}. ${texte}`));
    process.stdout.write('♪');
  }
  if (!manifeste.includes(civ.id)) manifeste.push(civ.id);
  await writeFile(new URL('manifeste.json', DOSSIER), JSON.stringify(manifeste.sort(), null, 0));
  console.log(' ✓');
}
console.log('Terminé. Lance « npm run build » puis publie : le site utilisera ces voix.');
