# Vidéo à la carte : sélection de scènes par lien partageable

Date : 28 septembre 2026. Statut : conception validée, à planifier.

## Objectif

Permettre à toute personne qui diffuse la vidéo de composer un extrait (quelques chapitres ou quelques scènes), puis de partager un lien qui ouvre le lecteur limité à cet extrait.

Périmètre de cette étape :
- lecteur web avec voix de synthèse uniquement (pas de MP4 à la carte) ;
- lien autoportant : la sélection est écrite dans l'adresse, sans base de données ni compte.

Hors périmètre, pour plus tard :
- liens courts enregistrés (`/v/k3F9x`) avec titre, suivi et administration, qui pourraient vivre dans annuaire_rfe et rediriger vers un lien autoportant ;
- MP4 à la carte, qui n'a de sens qu'avec une piste audio enregistrée (étape v2 du projet).

## Contraintes

- Aucune modification de la narration ni des textes à l'écran : on choisit quelles scènes sont jouées, on ne réécrit rien. Seule exception possible, à trancher : le point ouvert 1 ci-dessous.
- Tout en français, charte du projet (tokens de `styles.css`, Montserrat, IBM Plex).
- La vidéo complète reste inchangée quand aucune sélection n'est donnée, y compris le rendu MP4 et `npm run texts`.

## 1. Format du lien

```
https://<site>/?s=1.1-1.4,3.2-3.5
```

- Paramètre `s` : liste séparée par des virgules d'éléments `a` ou `a-b`, où `a` et `b` sont des numéros de scène de contenu (`1.1` à `4.8`, 26 scènes).
- Une plage `a-b` retient toutes les scènes de contenu situées entre `a` et `b` inclus, dans l'ordre de la vidéo. Une plage inversée (`b` avant `a`) est lue dans l'ordre de la vidéo.
- Les scènes sont toujours jouées dans l'ordre de la vidéo, quel que soit l'ordre dans le lien. Les doublons sont ignorés.
- Un élément inconnu ou mal formé est ignoré. Si aucun élément n'est reconnu, ou si `s` est absent ou vide, la vidéo complète est jouée.
- Les numéros de scène deviennent des identifiants stables. Renuméroter des scènes plus tard ferait pointer les anciens liens ailleurs : à éviter, ou à accompagner d'une table de correspondance.

## 2. Lecteur filtré (ce que voit le destinataire)

Toujours joués : l'ouverture et la clôture.

Pour chaque chapitre :
- si aucune de ses scènes n'est retenue, le chapitre disparaît entièrement : carton, onglet dans le bandeau du haut des écrans de contenu, entrée dans le menu des chapitres ;
- sinon, son carton ne liste que les scènes retenues, avec leur numéro d'origine (par exemple 3.2, 3.3, 3.5) et le libellé actuel du carton. Les délais d'apparition de la liste sont recalculés selon le rang dans la liste filtrée.

Dans le bandeau des écrans de contenu, les onglets restants gardent leur numéro de chapitre d'origine.

La barre de progression, ses repères de chapitre, la durée totale, les sous-titres, la voix et les boutons précédent / suivant suivent la sélection.

Le lecteur filtré n'affiche aucun bouton ni aucune mention de composition.

Le filtrage fonctionne de la même façon :
- dans `dist/rfe-zeendoc/` hébergé ;
- dans la page unique `dist/rfe-zeendoc-video.html` ouverte en local ;
- en mode rendu (`?render&s=…`), ce qui sert aux vérifications visuelles.

### Mise en œuvre prévue

- `src/scenes.js` : `chapter(n, items)` conserve `n` et `items` sur l'objet scène. Le HTML du carton est produit par une fonction qui prend la liste des rangs retenus, au lieu d'être figé à la déclaration. Le rendu de la vidéo complète reste identique.
- `src/engine.js` : au démarrage, avant la construction du DOM, lecture de `s`, calcul des scènes retenues, puis réduction du tableau `SC` (contenu retenu, cartons des chapitres concernés reconstruits, ouverture et clôture). Tout le reste (ligne de temps, menu, repères, bandeau) découle de `SC` et suit sans autre changement, sauf `rail()`, qui n'affiche que les chapitres présents.
- La logique d'analyse du paramètre `s` (texte vers liste de numéros, et liste vers texte compact) est isolée dans une petite fonction partagée par le lecteur et la page de composition, placée dans `src/lib.js`.

## 3. Page de composition (`/composer/`)

Page séparée, réservée aux personnes qui diffusent. Elle n'est pas liée depuis le lecteur.

Contenu :
- les 4 chapitres, repliés, chacun avec une case qui coche ou décoche toutes ses scènes (état intermédiaire si la sélection est partielle) ;
- en dépliant, les scènes du chapitre avec leur numéro et leur titre ;
- le nombre de scènes retenues et la durée estimée, arrondie à la minute (« environ 6 min »), calculée avec les mêmes constantes que le lecteur : par cue, mots ÷ 2,35 + 0,55 s (au moins 1,6 s), plus l'amorce et la fin de chaque scène, 3,6 s par carton de chapitre, ouverture et clôture comprises. Les durées minimales liées aux animations sont ignorées, d'où le mot « environ » ;
- le lien généré, sous forme compacte (plages de scènes consécutives à l'intérieur d'un même chapitre) ;
- les boutons « Copier le lien », « Ouvrir l'aperçu » (nouvel onglet) et « Tout décocher » ;
- un champ « Reprendre un lien » : coller un lien existant recoche sa sélection.

Sans aucune scène cochée, le lien et les boutons « Copier » et « Ouvrir » sont désactivés, avec la mention « Cochez au moins une scène ».

La page lit directement `js/lib.js`, `js/assets.js` et `js/scenes.js` : la liste des scènes ne peut pas se désynchroniser de la vidéo.

Elle porte `<meta name="robots" content="noindex">`. Elle reste accessible à qui connaît l'adresse, ce qui est sans risque : elle ne fait que produire des liens vers une vidéo publique.

Fichiers :
- `src/composer.html` (et son script) ;
- `scripts/build_site.py` la copie en `dist/rfe-zeendoc/composer/index.html`, avec des chemins relatifs `../js/…`, `../css/…` ;
- l'adresse du lecteur dans le lien généré est calculée à partir de l'adresse de la page (`new URL('../', location.href)`), pour fonctionner sur tout domaine, y compris en test local via `python -m http.server`.

La page de composition n'existe que dans la version en dossier (`dist/rfe-zeendoc/`), pas dans la page unique.

## 4. Hébergement

- Nouveau projet Cloudflare Pages, relié au dépôt GitHub `gudr-cuma/rfe-zeendoc-video`, branche `main`.
- Aucune commande de construction. Dossier publié : `dist/rfe-zeendoc`. On évite ainsi d'installer Puppeteer et Python chez Cloudflare.
- Conséquence : lancer `npm run build` avant chaque push, sinon le site publié ne reflète pas les sources. Rappel à ajouter dans `CLAUDE.md`.
- Création du projet Pages et liaison au dépôt : faites par l'utilisateur dans son compte Cloudflare, avec les réglages fournis.
- `dist/rfe-zeendoc/LISEZMOI.md` est aussi servi publiquement : sans conséquence.

## 5. Vérifications

- Vidéo complète : `npm run render:test` et `__timeline()` donnent le même résultat qu'avant (32 scènes, 927,96 s).
- Rendu `?render&s=…` de quelques images : carton de chapitre filtré, bandeau réduit, barre de progression.
- Analyse du paramètre `s` : plages, plages inversées, doublons, valeurs inconnues, paramètre vide, aller-retour liste vers texte vers liste.
- Page de composition : cases de chapitre (tout, rien, partiel), reprise d'un lien, copie, lien calculé en local et sur le domaine hébergé.
- Écoute dans Edge ou Chrome, faite par l'utilisateur.

## Point ouvert à trancher par l'utilisateur

1. **Ouverture d'une vidéo filtrée.** La deuxième phrase de l'ouverture annonce les quatre parties (« Cette vidéo présente la connexion, le paramétrage, l'usage au quotidien, puis les informations générales à connaître. ») et s'accompagne des quatre pastilles de chapitre. Dans un extrait, cette annonce est inexacte. Options :
   - a. garder l'ouverture telle quelle, même si elle annonce des parties absentes ;
   - b. dans une vidéo filtrée seulement, retirer cette phrase et les quatre pastilles : l'ouverture se limite au titre et à la première phrase (recommandé, aucun texte nouveau) ;
   - c. écrire une variante de cette phrase pour les extraits : nouveau texte, donc accord explicite requis sur sa formulation.
