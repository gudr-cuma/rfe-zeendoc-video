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
if (opt('compare') && !opt('save') && !fs.existsSync(path.resolve(ROOT, opt('compare')))) {
  console.error(`Référence absente : ${opt('compare')}. La créer depuis une version validée avec « node scripts/check_video.mjs --save ${opt('compare')} ».`); process.exit(1); }
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
    for (const q of ['&s=', '&s=9.9,abc', '&s=4.9-5.1', '&s=1.1-4.8']) {
      const g = await load(q);
      check(`sélection vide, inconnue ou complète (${q}) : vidéo complète`, () => assert.deepEqual(g.tl, full.tl));
    }
  }
  check('aucune erreur JavaScript dans la page', () => assert.deepEqual(errors, []));
} finally { await browser.close(); }
process.exit(ok ? 0 : 1);
