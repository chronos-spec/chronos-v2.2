# Ta vie sur la frise

## Ce que fait la fonction
Le visiteur entre son année (ou sa date exacte) de naissance. La page montre :
- depuis combien de temps il existe dans l'année cosmique (13,8 milliards d'années = 1 an), par ex. « 0,066 seconde » ;
- sa naissance dans l'année cosmique (via `dateCosmique` de `src/lib/calendrier.js`) et dans une « année de l'histoire écrite » (via `dateLoupe`) ;
- « Quand tu es né(e)… » : les 3 événements les plus récents avant sa naissance + des repères célèbres (Lune, tour Eiffel…), avec l'écart en années civiles ;
- « Depuis ta naissance » : 6 événements répartis sur sa vie, avec « l'année de tes N ans » ;
- la part de sa vie dans le temps écoulé depuis l'écriture (date approximative, signalée).
- Bouton « Partager » : Web Share API, sinon copie du lien. Rien n'est envoyé à un serveur, rien n'est enregistré.

Les événements viennent uniquement des données existantes (`PAR_ID`), seulement ceux dont la date courte est une année simple (« 1969 », « novembre 1957 », « 1939 à 1945 ») : les dates « vers… » ou « ~ » sont écartées.

## Tester
- `#/ma-vie` : formulaire vide.
- `#/ma-vie/1997` : année seule (calcul approximatif, signalé).
- `#/ma-vie/1997-12-13` : date exacte (âge révolu affiché).
- `#/ma-vie/2090` : message d'erreur.
- Lien « Ma vie » dans l'en-tête (ordinateur) et « Ta vie sur la frise » dans le menu téléphone.

## Fichiers
- Nouveaux : `src/lib/maVie.js`, `src/components/MaVie.jsx`, `src/components/MaVie.css`.
- Partagés modifiés (petites insertions) : `src/App.jsx` (import paresseux, 'ma-vie' dans les pages spéciales, branche de rendu), `src/components/Entete.jsx` (un lien), `src/components/MenuMobile.jsx` (une ligne dans OUTILS). `route.js` inchangé (#/ma-vie/<date> est lu comme étage + période).

## Limites / à vérifier par Pierre
- Les écarts sont calculés d'année civile à année civile (« N ans avant ton année de naissance ») : exacts, mais ne tiennent pas compte du mois.
- Les dates des événements sont celles des données du site : à vérifier là-bas si besoin.
- Les champs `ans` des données sont figés sur 2026 (écriture : 5 326 ans) ; le pourcentage restera juste à quelques dixièmes près les années suivantes.
- Le titre « Ma vie » dans l'en-tête : libellé à valider.
