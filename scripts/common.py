"""Chemins et polices partagés par les scripts de construction."""
from pathlib import Path
import base64
ROOT = Path(__file__).resolve().parent.parent
SRC, ASSETS, DIST = ROOT / 'src', ROOT / 'assets', ROOT / 'dist'
FONTSRC = ROOT / 'node_modules' / '@fontsource'
FONTS = [  # (famille CSS, graisse, fichier fontsource)
    ('Montserrat', 700, 'montserrat/files/montserrat-latin-700-normal'),
    ('Montserrat', 800, 'montserrat/files/montserrat-latin-800-normal'),
    ('Plex', 400, 'ibm-plex-sans/files/ibm-plex-sans-latin-400-normal'),
    ('Plex', 500, 'ibm-plex-sans/files/ibm-plex-sans-latin-500-normal'),
    ('Plex', 600, 'ibm-plex-sans/files/ibm-plex-sans-latin-600-normal'),
    ('Plex', 700, 'ibm-plex-sans/files/ibm-plex-sans-latin-700-normal'),
    ('PlexMono', 500, 'ibm-plex-mono/files/ibm-plex-mono-latin-500-normal'),
    ('PlexMono', 600, 'ibm-plex-mono/files/ibm-plex-mono-latin-600-normal'),
]
def read(name): return (SRC / name).read_text(encoding='utf-8')
def b64(p): return base64.b64encode(Path(p).read_bytes()).decode()
def check_fonts():
    if not FONTSRC.exists():
        raise SystemExit('Polices absentes : lancer « npm install » à la racine du projet.')
