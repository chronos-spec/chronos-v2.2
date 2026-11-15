# 06 · Archives

Les leçons de l'ancienne version de Chronos (Chronos IA, `chronos-spec/chronos`).
On ne jette pas l'expérience : on la range ici.

## Ce qui a marché

- Le **fond sombre** : on se sentait vraiment « dans » le temps.
- Les **polices** Fraunces, Inter et JetBrains Mono : élégantes et lisibles.
- L'**esprit OneZoom / ChronoZoom** : zoomer pour découvrir, c'est un plaisir.
- Les **coins arrondis** et les couleurs franches, quand il n'y en avait pas trop.

## Ce qui n'a pas marché

- **Trop de choses à l'écran** : points, calques, panneaux, barre d'outils… on s'y perdait.
- **Le canvas** : une frise dessinée comme une image est invisible pour un lecteur d'écran.
  Rajouter l'accessibilité après coup est très difficile.
- **Pas pensé pour le téléphone** : le toucher est arrivé trop tard.
- **L'IA au cœur** : textes impossibles à vérifier un par un, et dépendance à un service payant.

## Les bugs techniques à ne pas reproduire

- **Couleurs éparpillées** dans plusieurs fichiers, avec des valeurs différentes → un seul fichier de couleurs.
- **Écouteurs de clic « périmés »** (stale closures) : les clics cessaient de marcher sans erreur visible.
- **Code modifié par des scripts de remplacement** (`sed`) : textes mal fermés, balises en double.
- **Même nom exporté par deux fichiers** (`THEMES`) : la construction du site plantait.
- **Code React (JSX) dans des fichiers `.js`** : utiliser `.jsx`.
- **Envoi de fichiers .zip sur GitHub** : dossiers imbriqués, Vercel ne trouvait plus le site → toujours passer par git.
