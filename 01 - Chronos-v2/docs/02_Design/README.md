# 02 · Design

## L'identité visuelle

- **La frise** : un fond sombre, comme le ciel la nuit. On a l'impression de plonger dedans.
- **Les cartes** : claires, aérées, avec beaucoup d'espace autour du texte.
- **Une couleur forte par étage**, et une seule. Elle sert de repère : on sait où l'on est.
  *Pistes à valider* : Univers violet, Terre orange, Vie vert, Humains ocre, Histoire rouge, Aujourd'hui bleu.
- **Coins arrondis** partout : cartes, boutons, points du fil.
- **Les images** : une vraie photo quand elle existe, une illustration sinon.
  Toutes ont le même cadre arrondi et une légère teinte de la couleur de l'étage, pour que le site reste uni.

## Le style « ciel profond » (adopté le 14/11/2026)

- **Un ciel, pas un aplat** : fond qui va du noir au bleu nuit, quelques étoiles discrètes.
- **Le point actif rayonne** : un halo et des cercles fins, comme des ondes, dans la couleur de l'étage.
- **Panneaux en verre fumé** pour le repère d'échelle, avec une petite règle de 12 mois et un curseur lumineux.
- **La carte ouverte brille doucement** de la couleur de l'étage, sur ses bords.
- Le décor est toujours **caché aux lecteurs d'écran** et ne gêne jamais la lecture.

## La typographie (les polices de caractères)

| Usage | Police | Pourquoi |
|---|---|---|
| Titres | **Fraunces** | Élégante, un peu « livre ancien » |
| Texte | **Inter** | Très lisible sur écran |
| Dates | **JetBrains Mono** | Les chiffres sont bien alignés |

## Les règles d'accessibilité

- **Contraste AA minimum** : le texte se détache assez du fond pour être lu par
  les personnes qui voient mal (c'est une norme internationale, le WCAG).
- **Texte de 18 px minimum** : pas de petits caractères.
- **Zones tactiles de 44 px minimum** : chaque bouton est assez grand pour un doigt.
- **Mouvement désactivable** : si l'appareil demande « moins d'animations »
  (réglage `prefers-reduced-motion`), on coupe les effets.

## La règle d'or des couleurs

**Un seul fichier de couleurs pour tout le projet.**
Toutes les couleurs y sont rangées avec un nom (par exemple `couleur-univers`).
Personne n'écrit une couleur ailleurs. Si on change une couleur, on la change à un seul endroit.
