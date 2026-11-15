# Chronos

Toute l'histoire, du Big Bang à aujourd'hui, en six étages. Une étape à la fois.

## Lancer le site sur son ordinateur

```bash
npm install
npm run dev
```

## Mettre en ligne

Le site est déployé par Vercel à chaque envoi (`git push`) sur la branche `main`.
Réglages Vercel : framework **Vite**, commande `npm run build`, dossier `dist`.

## Où est quoi ?

| Dossier ou fichier | Rôle |
|---|---|
| `docs/` | Les fondations du projet : vision, concept, design, contenus, journal |
| `src/data/cartes.js` | Les 20 cartes (copiées de `docs/03_Contenus/cartes.md`) |
| `src/data/etages.js` | Les 6 étages et leur « loupe » |
| `src/theme.css` | **Le seul fichier de couleurs** |
| `src/styles.css` | La mise en page et les effets (toujours coupés si l'appareil demande moins de mouvement) |
| `src/components/` | Les morceaux de l'interface : ciel, en-tête, étage, repère, frise, carte |

## Les règles

- Une chose à la fois : une seule carte ouverte.
- Tout se fait au clavier et avec un lecteur d'écran (Tab, Entrée, Échap).
- Texte de 18 px minimum, zones tactiles de 44 px minimum, contraste AA.
- Aucune couleur en dehors de `src/theme.css`.
- Chaque fait a une source vérifiée.
