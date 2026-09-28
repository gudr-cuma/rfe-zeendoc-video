# Vidéo animée : vos factures fournisseur dans Zeendoc

Page web autonome, sans dépendance externe ni service tiers : aucune police, aucun script ni aucune image n'est chargé depuis un autre site.

## Mettre en ligne

Déposer le dossier `rfe-zeendoc` tel quel sur n'importe quel hébergement web (serveur Apache ou Nginx, intranet, WordPress via un dossier du site, etc.). La page s'ouvre par `index.html`. Aucun paramétrage serveur n'est nécessaire.

Pour un test sur votre poste, lancez un petit serveur local dans le dossier (par exemple `python -m http.server`) puis ouvrez `http://localhost:8000` : certains navigateurs bloquent les polices quand on ouvre le fichier par double-clic.

## Contenu du dossier

- `index.html` : la page et le lecteur.
- `css/styles.css` : la mise en forme.
- `js/scenes.js` : les 32 scènes, avec leurs textes à l'écran et la narration.
- `js/engine.js` : l'animation et la lecture par la voix de synthèse.
- `js/assets.js` : la liste des images.
- `img/` : les captures des fiches et les logos.
- `fonts/` : les polices Montserrat et IBM Plex (licence SIL Open Font License).

## Remplacer une capture

Remplacez le fichier dans `img/` en gardant exactement le même nom (par exemple `f06_param.png`). Si les proportions de la nouvelle image changent, les zones surlignées en orange peuvent nécessiter un ajustement dans `js/scenes.js`.

## Voix

La narration est lue par la voix de synthèse du navigateur de chaque visiteur. Edge et Chrome proposent en général les voix françaises les plus naturelles. Sans voix française disponible, la vidéo défile avec les sous-titres.

Réseau Cuma, septembre 2026.
