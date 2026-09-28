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
