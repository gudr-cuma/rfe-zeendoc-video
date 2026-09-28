# Vidéo à la carte : plan de mise en œuvre

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Objectif :** un lien `?s=1.1-1.4,3.2` ouvre le lecteur limité aux scènes choisies, et une page `/composer/` fabrique ces liens.

**Architecture :** la sélection est lue dans l'adresse au démarrage de `engine.js`, qui réduit le tableau `SC` avant de construire le DOM. Tout ce qui découle de `SC` suit ensuite : ligne de temps, menu, repères. Trois fonctions pures, dans `src/lib.js`, sont partagées avec la page de composition : `parseSel`, `compactSel` et `selectScenes`. Les cartons de chapitre et l'ouverture deviennent des fonctions de la sélection, et produisent un HTML identique à l'actuel quand la vidéo est complète.

**Technique :** JavaScript sans module ni dépendance (scripts globaux), Python pour la construction, Puppeteer pour les vérifications, `node:test` pour les tests unitaires.

**Spec :** `docs/superpowers/specs/2026-09-28-video-a-la-carte-design.md`.

**Règles du projet à respecter (CLAUDE.md) :**
- ne modifier aucune narration ni aucun texte à l'écran ;
- écrire tout texte visible en français ;
- sous Windows, éditer les fichiers avec les outils Edit/Write, jamais avec `Get-Content`/`Set-Content` de PowerShell 5.1, qui casse l'UTF-8.

---

## Fichiers

| Fichier | Rôle | Action |
|---|---|---|
| `src/lib.js` | `parseSel`, `compactSel`, `selectScenes` | Modifier (ajout en fin de fichier) |
| `scripts/selection.test.mjs` | tests unitaires de ces trois fonctions | Créer |
| `scripts/check_video.mjs` | vérifications Puppeteer : vidéo complète inchangée, extraits | Créer |
| `src/scenes.js` | `chapter()` expose `card(rangs)`, l'ouverture expose `brief()` | Modifier (lignes 5-13 et 15-25) |
| `src/engine.js` | filtrage de `SC`, `rail()`, menu des chapitres, durée affichée | Modifier |
| `src/shell.html` | `<span id="dur">` autour de la durée annoncée | Modifier (ligne 23) |
| `src/composer.html`, `src/composer.js` | page de composition | Créer |
| `scripts/build_site.py` | copie de la page de composition | Modifier |
| `package.json` | scripts `test` et `check` | Modifier |
| `CLAUDE.md`, `scripts/LISEZMOI-hebergement.md` | documentation | Modifier |

---

### Tâche 1 : relevé de référence de la vidéo complète

On enregistre, avant toute modification, la ligne de temps et le DOM complet de la scène. Les tâches suivantes prouveront ainsi que la vidéo complète n'a pas bougé.

**Fichiers :**
- Créer : `scripts/check_video.mjs`
- Modifier : `package.json`

- [ ] **Étape 1 : écrire le script de vérification**

`scripts/check_video.mjs` :

```js
// Vérifications du lecteur en mode rendu (dist/rfe-zeendoc-video.html?render).
//   --save FICHIER     enregistre la référence de la vidéo complète (ligne de temps + DOM)
//   --compare FICHIER  vérifie que la vidéo complète est identique à la référence
//   --extraits         vérifie le filtrage par ?s=…
import puppeteer from 'puppeteer';
import fs from 'fs'; import path from 'path'; import assert from 'assert/strict';
import { fileURLToPath, pathToFileURL } from 'url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const opt = k => { const i = args.indexOf('--' + k); return i < 0 ? null : args[i + 1] || true; };
const html = path.join(ROOT, 'dist', 'rfe-zeendoc-video.html');
if (!fs.existsSync(html)) { console.error('Page absente : lancer d\'abord « npm run build ».'); process.exit(1); }
const browser = await puppeteer.launch({ headless: true, executablePath: process.env.CHROME_PATH || undefined,
  args: ['--no-sandbox', '--allow-file-access-from-files', ...(process.env.CHROME_ARGS ? process.env.CHROME_ARGS.split(' ') : [])],
  defaultViewport: { width: 1920, height: 1080 } });
const page = (await browser.pages())[0] || await browser.newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message));
const load = async q => {
  await page.goto(pathToFileURL(html).href + '?render' + q, { waitUntil: 'load' });
  await page.evaluate(() => window.__ready);
  return page.evaluate(() => ({ tl: window.__timeline(), dom: document.getElementById('stage').innerHTML }));
};
let ok = true;
const check = (label, fn) => { try { fn(); console.log('OK      ' + label); } catch (e) { ok = false; console.log('ÉCHEC   ' + label + '\n        ' + e.message.split('\n')[0]); } };
try {
  const full = await load('');
  if (opt('save')) {
    fs.mkdirSync(path.dirname(path.resolve(ROOT, opt('save'))), { recursive: true });
    fs.writeFileSync(path.resolve(ROOT, opt('save')), JSON.stringify(full));
    console.log(`Référence écrite : ${opt('save')} (${full.tl.length} scènes, ${full.tl.at(-1).end.toFixed(2)} s)`);
  }
  if (opt('compare')) {
    const ref = JSON.parse(fs.readFileSync(path.resolve(ROOT, opt('compare')), 'utf8'));
    check('ligne de temps de la vidéo complète inchangée', () => assert.deepEqual(full.tl, ref.tl));
    check('DOM de la vidéo complète inchangé', () => assert.equal(full.dom, ref.dom));
  }
  if (opt('extraits')) {
    const f = await load('&s=1.1-1.2,3.5,3.2-3.3');
    const nums = f.tl.map(s => s.kind === 'content' ? s.num : s.kind);
    check('scènes retenues dans l\'ordre de la vidéo', () =>
      assert.deepEqual(nums, ['intro', 'chap', '1.1', '1.2', 'chap', '3.2', '3.3', '3.5', 'outro']));
    check('ouverture réduite à sa première phrase', () => assert.equal(f.tl[0].cues.length, 1));
    const dom = await page.evaluate(() => ({
      chips: document.querySelectorAll('.scene.intro .isum').length,
      cards: [...document.querySelectorAll('.scene.chap')].map(e => [...e.querySelectorAll('.clist li span')].map(x => x.textContent)),
      tabs: [...document.querySelector('.scene.content .tabs').querySelectorAll('b')].map(b => b.textContent),
      delays: [...document.querySelectorAll('.scene.chap')][1].querySelectorAll('.clist li')[2].dataset.d,
    }));
    check('pastilles de l\'ouverture retirées', () => assert.equal(dom.chips, 0));
    check('cartons limités aux scènes retenues', () => assert.deepEqual(dom.cards, [['1.1', '1.2'], ['3.2', '3.3', '3.5']]));
    check('délai recalculé selon le rang filtré', () => assert.equal(+dom.delays, .55 + 2 * .1));
    check('bandeau limité aux chapitres présents', () => assert.deepEqual(dom.tabs, ['1', '3']));
    for (const q of ['&s=', '&s=9.9,abc', '&s=4.9-5.1']) {
      const g = await load(q);
      check(`sélection vide ou inconnue (${q}) : vidéo complète`, () => assert.deepEqual(g.tl, full.tl));
    }
  }
  check('aucune erreur JavaScript dans la page', () => assert.deepEqual(errors, []));
} finally { await browser.close(); }
process.exit(ok ? 0 : 1);
```

- [ ] **Étape 2 : ajouter les scripts npm**

Dans `package.json`, remplacer le bloc `"scripts"` par :

```json
  "scripts": {
    "build": "python scripts/build.py && python scripts/build_site.py",
    "texts": "node scripts/render.mjs --timeline-only && python scripts/gen_text.py",
    "render:test": "node scripts/render.mjs --max 60",
    "render": "node scripts/render.mjs && python scripts/gen_text.py",
    "test": "node --test scripts/selection.test.mjs",
    "check": "node scripts/check_video.mjs --compare build/reference.json --extraits"
  },
```

- [ ] **Étape 3 : construire et enregistrer la référence (code encore inchangé)**

```bash
npm run build
node scripts/check_video.mjs --save build/reference.json --compare build/reference.json
```

Résultat attendu :
- `Référence écrite : build/reference.json (32 scènes, 927.96 s)` ;
- puis trois lignes `OK`.

`build/` est ignoré par git : la référence reste locale.

- [ ] **Étape 4 : commit**

```bash
git add scripts/check_video.mjs package.json
git commit -m "Vérifications du lecteur : référence de la vidéo complète"
```

---

### Tâche 2 : analyse de la sélection (`src/lib.js`)

**Fichiers :**
- Créer : `scripts/selection.test.mjs`
- Modifier : `src/lib.js` (ajout en fin de fichier, après `fr()`)

- [ ] **Étape 1 : écrire les tests**

`scripts/selection.test.mjs` :

```js
// Tests de parseSel, compactSel et selectScenes (src/lib.js), chargés dans un contexte isolé.
import test from 'node:test'; import assert from 'node:assert/strict';
import fs from 'fs'; import vm from 'vm'; import path from 'path'; import { fileURLToPath } from 'url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ctx = vm.createContext({});
vm.runInContext(fs.readFileSync(path.join(ROOT, 'src', 'lib.js'), 'utf8'), ctx);
const { parseSel, compactSel, selectScenes } = ctx;
const plain = v => JSON.parse(JSON.stringify(v)); // objets du contexte vm -> objets ordinaires
const range = (c, n) => Array.from({ length: n }, (_, k) => `${c}.${k + 1}`);
const NUMS = [...range(1, 4), ...range(2, 4), ...range(3, 10), ...range(4, 8)];

test('26 numéros de scène de contenu', () => assert.equal(NUMS.length, 26));
test('plages et scènes isolées', () =>
  assert.deepEqual(plain(parseSel('1.1-1.4,3.2-3.5', NUMS)), ['1.1', '1.2', '1.3', '1.4', '3.2', '3.3', '3.4', '3.5']));
test('ordre de la vidéo, quel que soit l\'ordre du lien', () =>
  assert.deepEqual(plain(parseSel('4.1,1.2', NUMS)), ['1.2', '4.1']));
test('plage inversée lue dans l\'ordre de la vidéo', () =>
  assert.deepEqual(plain(parseSel('1.4-1.2', NUMS)), ['1.2', '1.3', '1.4']));
test('plage à cheval sur deux chapitres', () =>
  assert.deepEqual(plain(parseSel('1.4-2.1', NUMS)), ['1.4', '2.1']));
test('scène 3.10 distincte de 3.1', () =>
  assert.deepEqual(plain(parseSel('3.10', NUMS)), ['3.10']));
test('doublons ignorés', () =>
  assert.deepEqual(plain(parseSel('2.1,2.1,1.1-1.2,1.2', NUMS)), ['1.1', '1.2', '2.1']));
test('éléments inconnus ou mal formés ignorés', () =>
  assert.deepEqual(plain(parseSel(' 9.9, abc,1.1 ,,1.1-9.9,1.10', NUMS)), ['1.1']));
test('rien de reconnu : null (vidéo complète)', () => {
  for (const s of [null, undefined, '', '9.9', 'abc', ',']) assert.equal(parseSel(s, NUMS), null);
});
test('forme compacte : plages à l\'intérieur d\'un chapitre', () =>
  assert.equal(compactSel(['1.1', '1.2', '1.3', '1.4', '2.1', '3.2', '3.3', '3.5'], NUMS), '1.1-1.4,2.1,3.2-3.3,3.5'));
test('forme compacte : ordre et doublons normalisés', () =>
  assert.equal(compactSel(['3.3', '1.1', '3.2', '1.1'], NUMS), '1.1,3.2-3.3'));
test('forme compacte vide', () => assert.equal(compactSel([], NUMS), ''));
test('aller-retour liste -> texte -> liste', () => {
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < 200; i++) {
    const sel = NUMS.filter(() => rnd() < 0.4);
    const back = parseSel(compactSel(sel, NUMS), NUMS);
    assert.deepEqual(plain(back), sel.length ? sel : null);
  }
});
test('selectScenes : ouverture réduite, chapitres vides retirés, cartons refaits', () => {
  const SC = [
    { kind: 'intro', html: 'long', cues: ['a', 'b'], brief: () => ({ html: 'court', cues: ['a'] }) },
    { kind: 'chap', ch: 1, html: 'c1', card: r => 'c1:' + r.join('|') },
    { kind: 'content', ch: 1, num: '1.1' }, { kind: 'content', ch: 1, num: '1.2' },
    { kind: 'chap', ch: 2, html: 'c2', card: r => 'c2:' + r.join('|') },
    { kind: 'content', ch: 2, num: '2.1' },
    { kind: 'outro', html: 'fin' },
  ];
  const out = selectScenes(SC, ['1.2']);
  assert.deepEqual(plain(out.map(s => s.num || s.html)), ['court', 'c1:2', '1.2', 'fin']);
  assert.deepEqual(plain(out[0].cues), ['a']);
  assert.equal(SC[0].html, 'long', 'les objets d\'origine ne sont pas modifiés');
  assert.equal(SC[1].html, 'c1');
});
```

- [ ] **Étape 2 : lancer les tests, qui doivent échouer**

Commande : `npm test`
Résultat attendu : échec, avec `TypeError: parseSel is not a function` ou équivalent.

- [ ] **Étape 3 : implémenter**

Ajouter à la fin de `src/lib.js` :

```js
/* Extrait à la carte : paramètre s="1.1-1.4,3.2" <-> numéros de scène, toujours dans l'ordre de la vidéo.
   nums = numéros des scènes de contenu, dans l'ordre. Rien de reconnu : null (vidéo complète). */
function parseSel(str,nums){
  if(!str)return null;const pos=new Map(nums.map((n,i)=>[n,i])),on=new Set();
  for(const tok of String(str).split(',')){const m=tok.trim().match(/^(\d+\.\d+)(?:-(\d+\.\d+))?$/);if(!m)continue;
    const a=pos.get(m[1]),b=pos.get(m[2]||m[1]);if(a==null||b==null)continue;
    for(let i=Math.min(a,b);i<=Math.max(a,b);i++)on.add(i);}
  return on.size?[...on].sort((x,y)=>x-y).map(i=>nums[i]):null;}
function compactSel(sel,nums){
  const pos=new Map(nums.map((n,i)=>[n,i])),ch=n=>n.split('.')[0];
  const ix=[...new Set(sel)].map(n=>pos.get(n)).filter(i=>i!=null).sort((x,y)=>x-y),out=[];
  for(let k=0;k<ix.length;){let j=k;
    while(j+1<ix.length&&ix[j+1]===ix[j]+1&&ch(nums[ix[j+1]])===ch(nums[ix[k]]))j++;
    out.push(j>k?nums[ix[k]]+'-'+nums[ix[j]]:nums[ix[k]]);k=j+1;}
  return out.join(',');}
/* Scènes jouées pour une sélection : ouverture réduite (brief), cartons refaits (card), chapitres vides retirés.
   Renvoie de nouveaux objets : sc n'est pas modifié. */
function selectScenes(sc,sel){const keep=new Set(sel);
  return sc.flatMap(s=>{
    if(s.kind==='intro')return [Object.assign({},s,s.brief())];
    if(s.kind==='chap'){const ranks=sc.filter(c=>c.kind==='content'&&c.ch===s.ch&&keep.has(c.num)).map(c=>+c.num.split('.')[1]);
      return ranks.length?[Object.assign({},s,{html:s.card(ranks)})]:[];}
    if(s.kind==='content')return keep.has(s.num)?[s]:[];
    return [s];});}
```

- [ ] **Étape 4 : lancer les tests, qui doivent réussir**

Commande : `npm test`
Résultat attendu : `# pass 14`, `# fail 0`.

- [ ] **Étape 5 : commit**

```bash
git add src/lib.js scripts/selection.test.mjs package.json
git commit -m "Analyse du paramètre s : parseSel, compactSel, selectScenes"
```

---

### Tâche 3 : cartons et ouverture paramétrables (`src/scenes.js`)

Le HTML produit pour la vidéo complète doit rester identique au caractère près. Il faut donc garder les mêmes expressions, en particulier `.55+k*.1`, ainsi que le même ordre d'appel de `hills()`.

**Fichiers :**
- Modifier : `src/scenes.js:5-13` (`chapter`) et `src/scenes.js:15-25` (ouverture)

- [ ] **Étape 1 : remplacer `chapter()`**

Remplacer les lignes 5 à 13 par :

```js
function chapter(n,items){
  /* ranks : rangs retenus (1 = n.1). Vidéo complète : tous les rangs. */
  const card=ranks=>`
  <div class="bign"${R(0,0)}>${n}<i></i></div>
  ${hills()}
  <div class="ckick"${R(0,.15)}>Chapitre ${n}</div>
  <h2 class="ctitle"${R(0,.25)}>${CH[n]}</h2>
  <ol class="clist${CH[n].length>14?' long':''}">${ranks.map((r,k)=>`<li${R(0,.55+k*.1)}><span>${n}.${r}</span>${items[r-1]}</li>`).join('')}</ol>`;
  SC.push({kind:'chap',ch:n,title:'Chapitre '+n+' : '+CH[n],html:card(items.map((t,k)=>k+1)),card,
  cues:[{t:'',dur:3.6}]});
}
```

- [ ] **Étape 2 : remplacer l'ouverture**

Remplacer le bloc `SC.push({kind:'intro',…});` (lignes 16 à 25) par le code ci-dessous. Les deux phrases de narration sont recopiées sans aucun changement.

```js
function intro(full){return {kind:'intro',title:'Ouverture',html:`
  ${hills()}
  <img class="ipicto"${R(0,0)} src="${A.picto}" alt="Logo Cuma">
  <div class="ikick"${R(0,.25)}>Facturation électronique</div>
  <h1 class="ititle"${R(0,.4)}>Vos factures fournisseur<br>dans Zeendoc</h1>
  <p class="isub"${R(0,.7)}>Pour les trésoriers de Cuma, état en septembre 2026</p>${full?`
  <div class="isum">${[1,2,3,4].map((n,k)=>`<div class="ichip"${R(1,[1.2,2.1,3.0,4.1][k])}><b>${n}</b>${CH[n]}</div>`).join('')}</div>`:''}`,
  cues:[
  'Depuis le 1er septembre 2026, votre Cuma doit pouvoir recevoir ses factures fournisseur via une plateforme agréée. Dans le réseau Cuma, vous les retrouvez dans Zeendoc.',
  ...(full?["Cette vidéo présente la connexion, le paramétrage, l'usage au quotidien, puis les informations générales à connaître."]:[])]};}
/* extrait à la carte : l'ouverture perd l'annonce des quatre parties (décision du 28 septembre 2026) */
SC.push(Object.assign(intro(true),{brief:()=>intro(false)}));
```

- [ ] **Étape 3 : vérifier que la vidéo complète est inchangée**

```bash
npm run build
node scripts/check_video.mjs --compare build/reference.json
```

Résultat attendu : trois lignes `OK` (ligne de temps, DOM, aucune erreur JavaScript).

Si le DOM diffère, afficher le premier écart :

```bash
node scripts/check_video.mjs --save build/apres.json
node -e "const a=require('./build/reference.json').dom,b=require('./build/apres.json').dom;let i=0;while(i<a.length&&a[i]===b[i])i++;console.log(i,'\nAVANT :',a.slice(i-80,i+120),'\nAPRÈS :',b.slice(i-80,i+120))"
```

Puis corriger jusqu'à obtenir l'égalité stricte. Les causes probables sont un espace ou un saut de ligne dans le gabarit, ou un appel à `hills()` déplacé.

- [ ] **Étape 4 : commit**

```bash
git add src/scenes.js
git commit -m "Cartons de chapitre et ouverture paramétrables par la sélection"
```

---

### Tâche 4 : lecteur filtré (`src/engine.js`, `src/shell.html`)

**Fichiers :**
- Modifier : `src/engine.js` (bloc « build DOM » l. 19-21, navigation l. 165-168, lecteur)
- Modifier : `src/shell.html:23`

- [ ] **Étape 1 : filtrer `SC` avant la construction du DOM**

Dans `src/engine.js`, juste avant la ligne `/* ---------- build DOM ---------- */`, insérer :

```js
/* ---------- extrait à la carte (?s=1.1-1.4,3.2) ---------- */
const SEL=parseSel(new URLSearchParams(location.search).get('s'),SC.filter(s=>s.kind==='content').map(s=>s.num));
if(SEL)SC.splice(0,SC.length,...selectScenes(SC,SEL));
const CHS=[1,2,3,4].filter(n=>SC.some(s=>s.kind==='chap'&&s.ch===n));
```

- [ ] **Étape 2 : bandeau limité aux chapitres présents**

Dans `rail()`, remplacer `${[1,2,3,4].map(n=>` par `${CHS.map(n=>`. Le reste de la ligne est inchangé. En vidéo complète, `CHS` vaut `[1,2,3,4]`.

- [ ] **Étape 3 : menu des chapitres sans groupe vide**

Ligne 167, remplacer :

```js
  [1,2,3,4,0].forEach(g=>{const G=groups[g];const sec=document.createElement('section');
```

par :

```js
  [1,2,3,4,0].forEach(g=>{const G=groups[g];if(!G.items.length)return;const sec=document.createElement('section');
```

- [ ] **Étape 4 : durée annoncée sur l'écran de lancement**

Dans `src/shell.html`, ligne 23, remplacer `Durée : environ 15 minutes.` par `Durée : <span id="dur">environ 15 minutes</span>.`.

Dans `src/engine.js`, juste après la ligne `const P={…};` (déclaration de l'état du lecteur, avant `function caption`), ajouter :

```js
if(SEL){const m=Math.max(1,Math.round(TOTAL/60));$('dur').textContent='environ '+m+' minute'+(m>1?'s':'');}
```

En vidéo complète, le texte d'origine reste affiché tel quel.

- [ ] **Étape 5 : construire et vérifier**

```bash
npm run build
npm test
npm run check
```

Résultat attendu :
- `npm test` : 14 tests réussis ;
- `npm run check` : toutes les lignes `OK`, soit ligne de temps et DOM de la vidéo complète inchangés, 5 contrôles d'extrait, 3 sélections vides ou inconnues, aucune erreur JavaScript.

- [ ] **Étape 6 : contrôle visuel en mode rendu**

Ouvrir `dist/rfe-zeendoc-video.html?render&s=1.1-1.2,3.5,3.2-3.3` dans le navigateur intégré. Dans la console, passer `__seek(t)` aux temps suivants et faire une capture à chaque fois :
- `__seek(2)` : ouverture sans pastilles de chapitre ;
- `__seek(__timeline()[4].start+2.5)` : carton du chapitre 3, qui liste 3.2, 3.3 et 3.5 ;
- `__seek(__timeline()[5].start+3)` : bandeau avec les onglets 1 et 3 seulement, 3 en cours.

- [ ] **Étape 7 : commit**

```bash
git add src/engine.js src/shell.html
git commit -m "Lecteur filtré par le paramètre s"
```

---

### Tâche 5 : page de composition

**Fichiers :**
- Créer : `src/composer.html`, `src/composer.js`
- Modifier : `scripts/build_site.py`

- [ ] **Étape 1 : créer `src/composer.html`**

```html
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Composer un extrait</title>
<link rel="stylesheet" href="../css/styles.css">
<link rel="icon" href="../img/picto.png">
<style>
.cmp{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,380px);gap:22px;align-items:start}
@media (max-width:820px){.cmp{grid-template-columns:1fr}}
.chs{display:grid;gap:12px}
.chb{background:var(--panel);border:1px solid var(--border);border-radius:12px;padding:12px 14px}
.chh{display:flex;align-items:center;gap:12px}
.chh label{display:flex;align-items:center;gap:10px;flex:1;min-width:0;cursor:pointer;font:700 16px Montserrat,system-ui,sans-serif}
.chh .cnt{font:500 13px PlexMono,monospace;color:var(--muted)}
.chh .btn{height:36px;font-size:14px}
.chb ol{list-style:none;margin:10px 0 0;padding:0 0 0 30px;display:grid;gap:2px}
.chb ol[hidden]{display:none}
.chb li label{display:flex;gap:10px;align-items:baseline;padding:5px 6px;border-radius:8px;cursor:pointer;font:400 15px/1.35 Plex,system-ui,sans-serif}
.chb li label:hover{background:var(--bg)}
.chb li .num{font:500 13px PlexMono,monospace;color:var(--muted);min-width:34px}
input[type=checkbox]{width:18px;height:18px;accent-color:var(--accent);flex:none}
.out{background:var(--panel);border:1px solid var(--border);border-radius:12px;padding:16px;display:grid;gap:12px;position:sticky;top:16px}
.out h2{font:700 16px Montserrat,system-ui,sans-serif;margin:0}
.sum{margin:0;font:600 15px Plex,system-ui,sans-serif}
.link{width:100%;box-sizing:border-box;height:44px;border-radius:10px;border:1px solid var(--border);background:var(--bg);color:var(--fg);font:500 13px PlexMono,monospace;padding:0 10px}
.acts{display:flex;flex-wrap:wrap;gap:8px}
.btn:disabled{opacity:.45;cursor:not-allowed}
.empty{margin:0;color:var(--orange);font:600 14px Plex,system-ui,sans-serif}
.empty[hidden]{display:none}
.reprise{display:grid;gap:8px;border-top:1px solid var(--border);padding-top:12px}
.reprise label{font:600 14px Plex,system-ui,sans-serif}
.reprise .row{display:flex;gap:8px}
.reprise .link{flex:1;min-width:0}
.msg{margin:0;font-size:13px;color:var(--muted);min-height:1.2em}
</style>
</head>
<body>
<main class="player">
  <header class="ph">
    <img src="../img/picto.png" alt="">
    <div><h1>Composer un extrait</h1>
    <p>Vos factures fournisseur dans Zeendoc. Cochez les scènes à montrer, puis partagez le lien.</p></div>
  </header>
  <div class="cmp">
    <div class="chs" id="chs"></div>
    <aside class="out" aria-label="Lien de l'extrait">
      <h2>Votre extrait</h2>
      <p class="sum" id="sum" aria-live="polite"></p>
      <input class="link" id="link" readonly aria-label="Lien de l'extrait">
      <p class="empty" id="empty">Cochez au moins une scène</p>
      <div class="acts">
        <button class="btn primary" id="copy">Copier le lien</button>
        <button class="btn" id="open">Ouvrir l'aperçu</button>
        <button class="btn" id="none">Tout décocher</button>
      </div>
      <div class="reprise">
        <label for="paste">Reprendre un lien</label>
        <div class="row"><input class="link" id="paste" placeholder="Coller un lien existant"><button class="btn" id="load">Reprendre</button></div>
        <p class="msg" id="msg" aria-live="polite"></p>
      </div>
    </aside>
  </div>
  <p class="pnote">Les scènes sont toujours jouées dans l'ordre de la vidéo. L'ouverture et la clôture sont toujours incluses. La durée est une estimation.</p>
</main>
<script src="../js/assets.js"></script>
<script src="../js/lib.js"></script>
<script src="../js/scenes.js"></script>
<script src="../js/composer.js"></script>
</body>
</html>
```

- [ ] **Étape 2 : créer `src/composer.js`**

```js
(function(){
/* Mêmes constantes que src/engine.js. Les durées minimales liées aux animations sont ignorées : estimation. */
const WPS=2.35,GAP=0.55,LEAD=0.8,TAIL=0.5;
const $=id=>document.getElementById(id);
const txt=t=>fr(t).replace(/'/g,'’');
const words=t=>{t=(t||'').trim();return t?t.split(/\s+/).length:0;};
const cueEst=c=>{c=typeof c==='string'?{t:c}:c;return Math.max(c.dur!=null?c.dur:words(c.t)/WPS+GAP,1.6);};
const sceneEst=s=>LEAD+s.cues.reduce((a,c)=>a+cueEst(c),0)+(s.tail!=null?s.tail:TAIL);
const CONTENT=SC.filter(s=>s.kind==='content'),NUMS=CONTENT.map(s=>s.num);
const BASE=new URL('../',location.href).href;
const sel=new Set();

/* chapitres et scènes */
const box=$('chs');
[1,2,3,4].forEach(n=>{const sc=CONTENT.filter(s=>s.ch===n);const d=document.createElement('section');d.className='chb';
  d.innerHTML=`<div class="chh"><label><input type="checkbox" data-ch="${n}"><span>${n}. ${txt(CH[n])}</span></label>
    <span class="cnt" data-cnt="${n}"></span>
    <button class="btn" aria-expanded="false" aria-controls="l${n}">Détail</button></div>
    <ol id="l${n}" hidden>${sc.map(s=>`<li><label><input type="checkbox" data-num="${s.num}"><span class="num">${s.num}</span><span>${txt(s.title)}</span></label></li>`).join('')}</ol>`;
  box.appendChild(d);});
box.addEventListener('click',e=>{const b=e.target.closest('button[aria-controls]');if(!b)return;
  const open=b.getAttribute('aria-expanded')!=='true';b.setAttribute('aria-expanded',String(open));$(b.getAttribute('aria-controls')).hidden=!open;});
box.addEventListener('change',e=>{const i=e.target;
  if(i.dataset.num){i.checked?sel.add(i.dataset.num):sel.delete(i.dataset.num);}
  else if(i.dataset.ch){CONTENT.filter(s=>s.ch===+i.dataset.ch).forEach(s=>i.checked?sel.add(s.num):sel.delete(s.num));}
  update();});

/* état, lien, durée */
function current(){return NUMS.filter(n=>sel.has(n));}
function update(){const list=current();
  box.querySelectorAll('input[data-num]').forEach(i=>{i.checked=sel.has(i.dataset.num);});
  [1,2,3,4].forEach(n=>{const all=CONTENT.filter(s=>s.ch===n),k=all.filter(s=>sel.has(s.num)).length;
    const c=box.querySelector(`input[data-ch="${n}"]`);c.checked=k===all.length;c.indeterminate=k>0&&k<all.length;
    box.querySelector(`[data-cnt="${n}"]`).textContent=`${k} / ${all.length}`;});
  const none=!list.length;
  $('link').value=none?'':BASE+'?s='+compactSel(list,NUMS);
  $('copy').disabled=$('open').disabled=none;$('empty').hidden=!none;
  if(none){$('sum').textContent='';return;}
  const t=selectScenes(SC,list).reduce((a,s)=>a+sceneEst(s),0),m=Math.max(1,Math.round(t/60));
  $('sum').textContent=`${list.length} scène${list.length>1?'s':''} retenue${list.length>1?'s':''}, environ ${m} min`;}

/* actions */
$('none').onclick=()=>{sel.clear();$('msg').textContent='';update();};
$('open').onclick=()=>{if($('link').value)window.open($('link').value,'_blank','noopener');};
$('copy').onclick=async()=>{const v=$('link').value;if(!v)return;
  try{await navigator.clipboard.writeText(v);}catch(e){$('link').select();document.execCommand('copy');}
  $('copy').textContent='Lien copié';setTimeout(()=>{$('copy').textContent='Copier le lien';},2000);};
$('load').onclick=()=>{const v=$('paste').value.trim();let s=v;
  try{s=new URL(v).searchParams.get('s')||'';}catch(e){s=v.replace(/^\?s=/,'');}
  const list=parseSel(s,NUMS);
  if(!list){$('msg').textContent='Aucune scène reconnue dans ce lien.';return;}
  sel.clear();list.forEach(n=>sel.add(n));
  $('msg').textContent=`${list.length} scène${list.length>1?'s':''} reprise${list.length>1?'s':''}.`;update();};
$('paste').addEventListener('keydown',e=>{if(e.key==='Enter')$('load').click();});
update();
})();
```

- [ ] **Étape 3 : copier la page à la construction**

Dans `scripts/build_site.py`, remplacer :

```python
for n in ['lib.js', 'scenes.js', 'engine.js']:
    shutil.copy(SRC / n, S / 'js' / n)
```

par :

```python
for n in ['lib.js', 'scenes.js', 'engine.js', 'composer.js']:
    shutil.copy(SRC / n, S / 'js' / n)
(S / 'composer').mkdir()
shutil.copy(SRC / 'composer.html', S / 'composer' / 'index.html')
```

- [ ] **Étape 4 : construire et servir en local**

```bash
npm run build
python -m http.server 8000 -d dist/rfe-zeendoc
```

Le serveur est à lancer en arrière-plan, ou par une configuration `.claude/launch.json` nommée `site`, avec `python` et les arguments `-m http.server 8000 -d dist/rfe-zeendoc`, sur le port 8000.

- [ ] **Étape 5 : vérifier la page de composition dans le navigateur intégré**

Ouvrir `http://localhost:8000/composer/`. Contrôler :

1. **Au chargement** :
   - aucune case cochée ;
   - le lien est vide ;
   - « Copier le lien » et « Ouvrir l'aperçu » sont désactivés ;
   - la mention « Cochez au moins une scène » est visible.
2. **Case du chapitre 1 cochée** :
   - `1.1`, `1.2`, `1.3` et `1.4` sont cochées ;
   - le lien vaut `http://localhost:8000/?s=1.1-1.4` ;
   - le compteur affiche « 4 / 4 ».
3. **Chapitre 3 déplié, 3.2, 3.3 et 3.5 cochées** :
   - la case du chapitre 3 est à l'état intermédiaire ;
   - le lien vaut `…?s=1.1-1.4,3.2-3.3,3.5`.
4. **Tout décocher** : retour à l'état initial.
5. **Reprise** : coller `http://localhost:8000/?s=4.8-4.6,2.1`, puis cliquer sur « Reprendre ». On obtient 2.1, 4.6, 4.7 et 4.8 cochées, le lien `…?s=2.1,4.6-4.8` et le message « 4 scènes reprises. ».
6. **Reprise d'un lien sans scène valide** : coller `abc` ; le message affiché est « Aucune scène reconnue dans ce lien. ».
7. **Aperçu** : « Ouvrir l'aperçu » ouvre le lecteur filtré dans un nouvel onglet, avec la durée annoncée, le menu des chapitres réduit et la barre de progression.
8. **Largeur de 375 px** (préréglage mobile) : pas de défilement horizontal.
9. **Console** : aucune erreur.

- [ ] **Étape 6 : commit**

```bash
git add src/composer.html src/composer.js scripts/build_site.py
git commit -m "Page de composition d'extraits (/composer/)"
```

---

### Tâche 6 : documentation, construction, mise en ligne

**Fichiers :**
- Modifier : `CLAUDE.md`, `scripts/LISEZMOI-hebergement.md`

- [ ] **Étape 1 : compléter `CLAUDE.md`**

Dans la section `## Commandes`, ajouter au bloc de commandes :

```
npm test                    # tests de l'analyse du paramètre s (parseSel, compactSel, selectScenes)
npm run check               # vidéo complète identique à build/reference.json + contrôles des extraits
```

Sous le bloc, ajouter :

```markdown
`build/reference.json` (local, non versionné) est la référence de la vidéo complète : `node scripts/check_video.mjs --save build/reference.json`. La régénérer seulement après une modification volontaire de la vidéo complète.

**Mise en ligne** : Cloudflare Pages publie `dist/rfe-zeendoc` tel qu'il est dans le dépôt GitHub `gudr-cuma/rfe-zeendoc-video` (branche `main`), sans commande de construction. Lancer `npm run build` et committer `dist/` avant chaque push, sinon le site publié ne reflète pas les sources.
```

Dans la section `## Fonctionnement`, ajouter à la fin :

```markdown
### Vidéo à la carte

- `?s=1.1-1.4,3.2` : le lecteur (et le mode rendu) ne joue que ces scènes de contenu, dans l'ordre de la vidéo, avec l'ouverture et la clôture. Paramètre absent, vide ou sans numéro reconnu : vidéo complète.
- Les numéros de scène sont des identifiants de lien : ne pas renuméroter sans table de correspondance.
- `selectScenes()` (`src/lib.js`) : l'ouverture passe par `brief()` (sans la phrase d'annonce des parties ni les pastilles), chaque carton par `card(rangs)`, les chapitres sans scène retenue disparaissent.
- Page de composition : `src/composer.html` et `src/composer.js`, publiée en `dist/rfe-zeendoc/composer/` (version en dossier seulement). Non liée depuis le lecteur, `noindex`.
- Spec : `docs/superpowers/specs/2026-09-28-video-a-la-carte-design.md`.
```

- [ ] **Étape 2 : compléter `scripts/LISEZMOI-hebergement.md`**

Dans `## Contenu du dossier`, ajouter après la ligne `- \`index.html\` : la page et le lecteur.` :

```markdown
- `composer/` : la page de composition d'extraits.
```

Avant `## Remplacer une capture`, ajouter :

```markdown
## Extraits à la carte

La page `composer/` permet de cocher quelques chapitres ou scènes et de copier un lien vers le lecteur limité à cet extrait, par exemple `…/?s=1.1-1.4,3.2`. Le lien contient toute la sélection : rien n'est enregistré sur le serveur. La page de composition n'est pas liée depuis la vidéo ; communiquez son adresse aux seules personnes qui diffusent.
```

- [ ] **Étape 3 : construction finale et vérifications**

```bash
npm run build
npm test
npm run check
npm run render:test
```

Résultat attendu :
- tous les tests réussissent et toutes les lignes affichent `OK` ;
- `dist/test-rendu.mp4` est produit sans erreur.

- [ ] **Étape 4 : commit et push**

```bash
git add CLAUDE.md scripts/LISEZMOI-hebergement.md dist
git commit -m "Vidéo à la carte : documentation et construction"
git push origin main
```

Le push part avec l'identité locale `gudr-cuma` et `credential.username=gudr-cuma`, déjà configurés dans ce dépôt.

- [ ] **Étape 5 : réglages Cloudflare Pages à transmettre à l'utilisateur**

L'utilisateur fait lui-même ces réglages dans son compte :
- Workers & Pages → Créer → Pages → Connecter à Git → dépôt `gudr-cuma/rfe-zeendoc-video` ;
- branche de production : `main` ;
- préréglage de framework : aucun ;
- commande de construction : vide (si le champ est exigé : `exit 0`) ;
- répertoire de sortie : `dist/rfe-zeendoc` ;
- répertoire racine : vide.

Après le premier déploiement, contrôler que `https://<projet>.pages.dev/composer/` produit des liens en `https://<projet>.pages.dev/?s=…`.

- [ ] **Étape 6 : écoute**

À faire par l'utilisateur, dans Edge ou Chrome : ouvrir un extrait et écouter l'ouverture réduite, puis les enchaînements de chapitres.
