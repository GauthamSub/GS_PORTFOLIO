"""Upright 16:10 display derivatives of the two EchoVision photos.

Requires Pillow. Originals in public/assets/echovision/ stay untouched and
remain the "Open original" targets.
  enclosure.jpg 740x995: rotate 90 deg counter-clockwise (textured print-bed
                face ends up at the bottom) -> 995x740, padded left/right to
                1184x740. Nothing is cropped.
  wiring.jpg    538x892: rotate 90 deg clockwise (poster text reads upright)
                -> 892x538, padded to 896x560. Nothing is cropped.
Annotation coordinates in src/components/EchoVisionPackaging.jsx are the
original pixel coordinates passed through the same rotation and padding.
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
DIR = ROOT / 'public' / 'assets' / 'echovision'
OUT = DIR / 'landscape'
OUT.mkdir(exist_ok=True)
PLATE = (11, 17, 28)  # #0B111C, the inspector frame colour

JOBS = {
    'enclosure': (Image.Transpose.ROTATE_90, (1184, 740)),
    'wiring': (Image.Transpose.ROTATE_270, (896, 560)),
}

for name, (turn, size) in JOBS.items():
    with Image.open(DIR / f'{name}.jpg') as original:
        upright = original.convert('RGB').transpose(turn)
    canvas = Image.new('RGB', size, PLATE)
    offset = ((size[0] - upright.width) // 2, (size[1] - upright.height) // 2)
    canvas.paste(upright, offset)
    canvas.save(OUT / f'{name}.webp', 'WEBP', quality=86, method=6)
    print(name, upright.size, '->', size, 'offset', offset)
