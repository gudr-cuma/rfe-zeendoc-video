// Rendu MP4 : capture image par image de dist/rfe-zeendoc-video.html?render, puis encodage ffmpeg.
// Options : --timeline-only  --max N (test sur N images)  --workers N  --fps 25
import puppeteer from 'puppeteer';
import fs from 'fs'; import os from 'os'; import path from 'path';
import { execFileSync } from 'child_process'; import { fileURLToPath, pathToFileURL } from 'url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf('--' + k); return i < 0 ? d : args[i + 1]; };
const FPS = +opt('fps', 25), MAX = opt('max', null);
const WORKERS = +opt('workers', Math.max(1, Math.min(4, os.cpus().length - 1)));
const html = path.join(ROOT, 'dist', 'rfe-zeendoc-video.html');
if (!fs.existsSync(html)) { console.error('Page absente : lancer d\'abord « npm run build ».'); process.exit(1); }
// Un navigateur par worker : un onglet ouvert en arrière-plan reste « hidden » et img.decode() n'y aboutit jamais.
const browsers = [];
const launch = async () => { const b = await puppeteer.launch({ headless: true, executablePath: process.env.CHROME_PATH || undefined,
  args: ['--no-sandbox', '--allow-file-access-from-files', ...(process.env.CHROME_ARGS ? process.env.CHROME_ARGS.split(' ') : [])],
  defaultViewport: { width: 1920, height: 1080 } }); browsers.push(b); return b; };
const closeAll = () => Promise.all(browsers.map(b => b.close()));
const url = pathToFileURL(html).href + '?render';
const open = async () => { const b = await launch(); const p = (await b.pages())[0] || await b.newPage(); p.on('pageerror', e => console.error('Erreur page :', e.message));
  await p.goto(url, { waitUntil: 'load' }); await p.evaluate(() => window.__ready); return p; };
const p0 = await open();
fs.writeFileSync(path.join(ROOT, 'dist', 'timeline.json'), JSON.stringify(await p0.evaluate(() => window.__timeline()), null, 1));
console.log('dist/timeline.json écrit');
if (args.includes('--timeline-only')) { await closeAll(); process.exit(0); }
const plan = await p0.evaluate(f => window.__plan(f), FPS);
const frames = MAX ? plan.frames.slice(0, +MAX) : plan.frames;
const dir = path.join(ROOT, 'build', 'frames');
fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
const pages = [p0, ...await Promise.all(Array.from({ length: WORKERS - 1 }, open))];
const name = i => String(i).padStart(6, '0') + '.jpg';
let done = 0; const t0 = Date.now();
await Promise.all(pages.map(async (pg, k) => {
  for (let i = k; i < frames.length; i += pages.length) {
    await pg.evaluate(t => window.__seek(t), frames[i][0] / FPS);
    await pg.screenshot({ path: path.join(dir, name(i)), type: 'jpeg', quality: 93, optimizeForSpeed: true });
    if (++done % 250 === 0) console.log(`${done}/${frames.length} images, ${((Date.now() - t0) / 1000).toFixed(0)} s`);
  } }));
await closeAll();
let list = frames.map(([f, n], i) => `file 'frames/${name(i)}'\nduration ${(n / FPS).toFixed(4)}`).join('\n');
list += `\nfile 'frames/${name(frames.length - 1)}'\n`;
fs.writeFileSync(path.join(ROOT, 'build', 'list.txt'), list);
const out = path.join(ROOT, 'dist', MAX ? 'test-rendu.mp4' : 'rfe-zeendoc-tresoriers.mp4');
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-stats', '-f', 'concat', '-safe', '0', '-i', path.join(ROOT, 'build', 'list.txt'),
  '-fps_mode', 'cfr', '-r', String(FPS), '-c:v', 'libx264', '-preset', 'veryfast', '-tune', 'stillimage', '-crf', '18',
  '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], { stdio: 'inherit' });
console.log(`${path.relative(ROOT, out)} : ${frames.length} images capturées en ${((Date.now() - t0) / 1000).toFixed(0)} s`);
