"""Construit dist/rfe-zeendoc-video.html : page unique, polices et images incluses."""
import json
from common import ROOT, ASSETS, DIST, FONTSRC, FONTS, read, b64, check_fonts
check_fonts()
fcss = ''.join(f"@font-face{{font-family:'{n}';font-weight:{w};font-style:normal;font-display:block;"
               f"src:url(data:font/woff2;base64,{b64(FONTSRC / (p + '.woff2'))}) format('woff2')}}\n" for n, w, p in FONTS)
assets = {f.stem: 'data:image/png;base64,' + b64(f) for f in sorted(ASSETS.glob('*.png'))}
h = read('shell.html')
for k, v in [('%%FONTS%%', fcss), ('%%CSS%%', read('styles.css')), ('%%PICTO%%', assets['picto']),
             ('%%ASSETS%%', json.dumps(assets)), ('%%LIB%%', read('lib.js')),
             ('%%SCENES%%', read('scenes.js')), ('%%ENGINE%%', read('engine.js'))]:
    h = h.replace(k, v)
DIST.mkdir(exist_ok=True)
out = DIST / 'rfe-zeendoc-video.html'
out.write_text(h, encoding='utf-8')
print(f'{out.relative_to(ROOT)} : {len(h.encode()) / 1e6:.2f} Mo')
