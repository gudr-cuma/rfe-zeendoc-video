# Vidéo « Vos factures fournisseur dans Zeendoc »

Vidéo de formation animée pour les **trésoriers de Cuma** : réception des factures fournisseur électroniques dans Zeendoc (ged.cuma.fr), dans le cadre de la réforme de la facturation électronique (RFE). Contenu arrêté à l'état de septembre 2026. Durée actuelle : 15 min 28 s, 32 scènes.

Projet de l'activité salariée (réseau Cuma). Ne jamais utiliser les chartes, modèles ou skills CAP Consulting.

## Règles de contenu (impératives)

- **Tout en français** : narration, textes à l'écran, titres, légendes, dates, libellés, messages des scripts. Aucun texte anglais visible.
- **Rien d'inventé** : chaque information vient des fiches pratiques de `sources/fiches/` (n°01 à 08). La fiche n°09 est écartée, car elle concerne les fédérations et non les trésoriers.
- **Ton** : professionnel, posé, rassurant, factuel. Pas de commentaire superflu ni de pseudo-conseil de méthode.
- Les libellés du logiciel sont reproduits à l'identique, entre « ».
- **Aucune modification de la narration ou des textes à l'écran sans accord explicite de l'utilisateur.**
- La typographie française est automatique : `fr()` dans `src/lib.js` gère les espaces fines insécables, et `engine.js` remplace les apostrophes droites par ’ dans les nœuds texte. Écrire le texte normalement.

## Arborescence

- `sources/fiches/` : les 9 fiches PDF et le logo d'origine (référence du contenu).
- `src/shell.html` : squelette HTML du lecteur, avec des balises `%%…%%` remplacées à la construction.
- `src/styles.css` : charte et mise en page de la scène (1920×1080) et du lecteur.
- `src/lib.js` : icônes et mini-langage de description des scènes.
- `src/scenes.js` : les 32 scènes (visuels et narration). C'est le fichier à modifier pour le contenu.
- `src/engine.js` : ligne de temps, rendu, lecteur avec voix de synthèse.
- `assets/*.png` : captures et logos. Le nom de fichier sert de clé (`A.f06_param`…).
- `scripts/` : construction, rendu MP4 et génération des textes.
- `dist/` : livrables générés.

## Commandes

```
npm install                 # polices + Puppeteer (télécharge Chrome)
npm run build               # dist/rfe-zeendoc-video.html (fichier unique) + dist/rfe-zeendoc/ (dossier à héberger)
npm run texts               # dist/timeline.json, sous-titres .srt, script de narration minuté
npm run render:test         # rendu d'essai sur 60 images -> dist/test-rendu.mp4
npm run render              # rendu complet -> dist/rfe-zeendoc-tresoriers.mp4 (plusieurs minutes) + textes
```

Le rendu nécessite ffmpeg 5.1 ou plus récent (option `-fps_mode`). Options de `scripts/render.mjs` :
- `--workers N` : pages en parallèle ;
- `--max N` : test sur N images ;
- `--fps` : cadence d'images ;
- `--timeline-only` : écrit seulement `dist/timeline.json`.

Variables d'environnement facultatives : `CHROME_PATH`, `CHROME_ARGS`.

Pour prévisualiser : ouvrir `dist/rfe-zeendoc-video.html` dans Chrome ou Edge. Ajouter `?render` à l'adresse affiche la scène seule en 1920×1080. Dans la console, `__seek(t)` positionne la vidéo à t secondes.

## Fonctionnement

### Scènes (`src/scenes.js`)

Chaque scène appartient à l'un de ces types :
- `intro` ;
- `chap`, créé par `chapter(n, titres)`. C'est un carton muet de 3,6 s ;
- `content`, créé par `content({ch, num, title, html, cues, src?})` ;
- `outro`.

`cues` est la liste des paragraphes de narration. Chaque cue est une chaîne, ou `{t, dur}`.

### Mini-langage (`src/lib.js`)

- `R(c, d, x, xd)` : l'élément apparaît au début du cue `c`, décalé de `d` secondes. Il sort au cue `x`, décalé de `xd`.
- `hl(c, x, y, w, h, d, xo, xd)` : cadre orange de surlignage, avec position et taille en % de l'image.
- `shot(clé, largeur, alt, contenuIntérieur, zoom)` : capture encadrée.
- `step(n, titre, texte, c, d, e)` : étape numérotée.
- `data-e="a"` ou `"a-b"` : mise en avant pendant le cue `a`, ou pendant les cues `a` à `b`.
- `data-z='[[cue, délai, échelle, x%, y%]]'` : zoom animé dans une capture.
- Classes `grow`, `pop` et `hl` : elles changent le type d'animation d'apparition.

### Minutage

- Débit estimé : 2,35 mots par seconde (constante `WPS` dans `engine.js`, reprise dans `gen_text.py`).
- Durée d'un cue : nombre de mots / 2,35, plus 0,55 s, au minimum ce qu'exigent les animations du cue.
- Les délais `d` des apparitions sont calés sur la position des mots dans la phrase.
- Toute modification de narration décale donc les délais de la scène : les recalculer.

### Deux modes d'exécution (`src/engine.js`)

- **Mode rendu** (`?render`) :
  - `__timeline()` renvoie la ligne de temps ;
  - `__seek(t)` positionne la vidéo au temps `t` ;
  - `__plan(fps)` liste les images à capturer : les passages animés sont capturés à 25 images par seconde, chaque plan fixe est capturé une seule fois puis tenu.
- **Mode lecteur** :
  - la voix de synthèse du navigateur lit la narration phrase par phrase ;
  - les remplacements de prononciation sont regroupés dans `SAY` ;
  - sans voix française, la vidéo défile avec les sous-titres.

### Charte

- Couleurs (tokens dans `styles.css`) : `--sky` #B0DBE2, `--green` #079959, `--mid` #63B336, `--anis` #9AC035, `--ink` #15291F. `--orange` #F07D00 est réservé aux points d'attention et aux surlignages.
- Polices :
  - Montserrat 700/800 pour les titres ;
  - IBM Plex Sans pour le texte ;
  - IBM Plex Mono uniquement pour les URL, les codes et les montants.
- Mise en page :
  - les écrans de contenu imitent une page de registre comptable : réglure et double marge orange ;
  - les cartons reprennent les collines du logo.

### Captures

- `f02_actions.png` est un recadrage de `f02_facture.png`, de 58 % à 100 % de la largeur.
- Si une capture est remplacée par une version de mêmes proportions, rien d'autre à faire.
- Si les proportions changent, recaler les `hl()` et `data-z` de la scène concernée, puis vérifier visuellement avec `?render` et `__seek`.

## Points ouverts : à faire trancher par l'utilisateur, ne pas décider seul

1. **Émission des factures en 2027.** La fiche 04 indique septembre 2027 pour les Cuma. La fiche 05 dit qu'en 2027 l'obligation ne vise que les ETI et les grandes entreprises, « aucune Cuma ». La vidéo suit la fiche 04. Le bloc « Pour 2027 » de la fiche 05, e-reporting compris, est écarté.
2. **Scène 3.10, bouton « Valider la facture » de l'assistant analytique.** On ne sait pas s'il vaut aussi approbation. Le libellé est repris sans interprétation.
3. **Scène 3.6.** « Payée par l'acheteur » est surligné comme étant le bouton « payé » de la fiche 05.
4. **Scène 3.7.** Le bouton « Ajouter une note » n'a pas été localisé avec certitude sur la capture : tout le bandeau de droite est surligné.
5. **Zeendoc et plateforme agréée.** Zeendoc n'est jamais présenté comme « la plateforme agréée », car les fiches ne l'affirment pas.

## Prochaines étapes prévues (v2)

- **Captures en haute définition.** Remplacer les captures par les PNG fournis par l'utilisateur, sous les mêmes noms que dans `assets/`.
- **Recalage sur un fichier audio de narration.** Ajouter un fichier de minutage (début de chaque cue), qui remplace l'estimation de `buildTL()` dans `engine.js`. Recaler les délais des apparitions en conséquence, puis ajouter la piste audio au MP4 avec ffmpeg.
- **Sous-titres incrustés** (option).
