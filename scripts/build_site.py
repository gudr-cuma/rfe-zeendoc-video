"""Construit dist/rfe-zeendoc/ : version en dossier à héberger (images, polices, scripts séparés)."""
import json, shutil
from common import ROOT, ASSETS, DIST, SRC, FONTSRC, FONTS, read, check_fonts
check_fonts()
S = DIST / 'rfe-zeendoc'
shutil.rmtree(S, ignore_errors=True)
for d in ['css', 'js', 'img', 'fonts']:
    (S / d).mkdir(parents=True)
assets = {}
for f in sorted(ASSETS.glob('*.png')):
    shutil.copy(f, S / 'img' / f.name); assets[f.stem] = f'img/{f.name}'
fcss = ''
for n, w, p in FONTS:
    fn = p.split('/')[-1] + '.woff2'; shutil.copy(FONTSRC / (p + '.woff2'), S / 'fonts' / fn)
    fcss += f"@font-face{{font-family:'{n}';font-weight:{w};font-style:normal;font-display:block;src:url('../fonts/{fn}') format('woff2')}}\n"
(S / 'css' / 'styles.css').write_text(fcss + read('styles.css'), encoding='utf-8', newline='\n')
(S / 'js' / 'assets.js').write_text('/* Remplacer un fichier du dossier img/ en gardant le même nom suffit. */\nconst A='
                                    + json.dumps(assets, indent=1, ensure_ascii=False) + ';\n', encoding='utf-8', newline='\n')
for n in ['lib.js', 'scenes.js', 'engine.js', 'composer.js']:
    shutil.copy(SRC / n, S / 'js' / n)
(S / 'composer').mkdir()
shutil.copy(SRC / 'composer.html', S / 'composer' / 'index.html')
h = read('shell.html')
h = h.replace('<style>\n%%FONTS%%\n%%CSS%%\n</style>', '<link rel="stylesheet" href="css/styles.css">\n<link rel="icon" href="img/picto.png">')
h = h.replace('%%PICTO%%', 'img/picto.png')
h = h.replace('<script>\nconst A=%%ASSETS%%;\n%%LIB%%\n%%SCENES%%\n%%ENGINE%%\n</script>',
              '<script src="js/assets.js"></script>\n<script src="js/lib.js"></script>\n<script src="js/scenes.js"></script>\n<script src="js/engine.js"></script>')
assert '%%' not in h, 'Balise %% non remplacée dans shell.html'
(S / 'index.html').write_text(h, encoding='utf-8', newline='\n')
shutil.copy(ROOT / 'scripts' / 'LISEZMOI-hebergement.md', S / 'LISEZMOI.md')
print(f'{S.relative_to(ROOT)}/ prêt')
