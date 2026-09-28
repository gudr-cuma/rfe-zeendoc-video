"""Génère les sous-titres (.srt) et le script de narration minuté à partir de dist/timeline.json."""
import json, re
from common import DIST
TL = json.loads((DIST / 'timeline.json').read_text(encoding='utf-8'))
WPS = 2.35  # mots par seconde, identique à engine.js
def fr(s): return re.sub(r' ([:;?!»])', '\u00A0\\1', s).replace('« ', '«\u00A0').replace("'", '\u2019')
def split_s(t): return [x for x in re.split(r'(?<=[.!?…])\s+(?=[A-ZÀÂÇÉÈÊËÎÏÔÛÙÜŸ«0-9])', t) if x]
def words(t): return len(t.split())
def chunks(s, maxc=84):
    if len(s) <= maxc: return [s]
    best = None
    for m in re.finditer(r'[,;:] ', s):
        i = m.end(); score = abs(i - len(s) / 2)
        if i <= maxc + 10 and (best is None or score < best[0]): best = (score, i)
    if best is None: best = (0, s.rfind(' ', 0, maxc) + 1)
    i = best[1]; return chunks(s[:i].strip(), maxc) + chunks(s[i:].strip(), maxc)
def lines2(s, maxl=42):
    if len(s) <= maxl: return s
    mid = len(s) // 2; i = min((m.start() for m in re.finditer(' ', s)), key=lambda k: abs(k - mid))
    return s[:i] + '\n' + s[i + 1:]
def ts(t):
    ms = int(round(t * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000)
    return f'{h:02d}:{m:02d}:{s:02d},{ms:03d}'
def mmss(t): return f'{int(t // 60):02d}:{int(t % 60):02d}'
subs = []
for sc in TL:
    for c in sc['cues']:
        if not c['text']: continue
        t = c['start']
        for s in split_s(c['text']):
            d = words(s) / WPS; parts = chunks(s); tw = sum(words(p) for p in parts)
            for p in parts:
                pd = d * words(p) / tw; subs.append([t, t + max(pd, 1.2), fr(p)]); t += pd
            t += 0.2
for i in range(len(subs) - 1):
    subs[i][1] = min(subs[i][1], subs[i + 1][0] - 0.04)
with open(DIST / 'rfe-zeendoc-tresoriers.srt', 'w', encoding='utf-8', newline='\n') as f:
    for i, (a, b, s) in enumerate(subs, 1): f.write(f'{i}\n{ts(a)} --> {ts(b)}\n{lines2(s)}\n\n')
total = TL[-1]['end']
md = ['# Facturation électronique : vos factures fournisseur dans Zeendoc', '',
      f'Script de narration de la vidéo, pour les trésoriers de Cuma. État en septembre 2026. Durée : {mmss(total)}.', '',
      "## Pour l'enregistrement", '',
      '- Un paragraphe correspond à un passage de la vidéo ; le minutage indique le moment où il commence dans le MP4.',
      '- Les cartons de chapitre sont muets : aucune narration pendant environ 4 secondes.',
      '- Dans la page avec voix de synthèse, ged.cuma.fr, FE, PA-R, AGC et SAS sont lus lettre à lettre, et SIREN comme un mot.', '']
for sc in TL:
    if sc['kind'] == 'chap':
        md += [f"## {sc['title']}", '', f"*{mmss(sc['start'])} : carton de chapitre, sans narration.*", '']; continue
    md += [f"### {sc['num']} {sc['title']}" if sc['num'] else f"## {sc['title']}", '']
    md += [f"**{mmss(c['start'])}** {fr(c['text'])}\n" for c in sc['cues'] if c['text']]
(DIST / 'rfe-zeendoc-script-narration.md').write_text('\n'.join(md), encoding='utf-8', newline='\n')
print(f'{len(subs)} sous-titres, durée {mmss(total)}')
