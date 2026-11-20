"""Publish the ME2900 air motor photos from the original HEIC files.

Requires Pillow and pillow-heif. Sources in `Assets/Machine Shop ME2900 stuff/`
stay untouched. For each photo this writes, EXIF-oriented and with no EXIF
(location/device) metadata, keeping the colour profile:
  public/assets/machine-shop-me2900/IMG_xxxx.jpg            full resolution, opened on demand
  public/assets/machine-shop-me2900/inspector/IMG_xxxx.webp 1600 px long edge
  public/assets/machine-shop-me2900/previews/IMG_xxxx.webp  640 px long edge
plus the 1200x630 route share card public/assets/share/air-motor.jpg.

After EXIF orientation each photo is turned to match IMG_8644: engraved block
at the bottom, two-hole link upright on the right. IMG_8643 and IMG_8645
already match; IMG_8646 and IMG_8647 turn 90 deg clockwise; IMG_8648 turns 180.
IMG_8643 is upright but landscape: a 3:4 crop of background only (all four
parts sit between x 0.17 and 0.61) makes it portrait like the rest.
"""
from pathlib import Path
from PIL import Image, ImageOps
import pillow_heif

pillow_heif.register_heif_opener()

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'Assets' / 'Machine Shop ME2900 stuff'
OUT = ROOT / 'public' / 'assets' / 'machine-shop-me2900'
SIZES = {'inspector': 1600, 'previews': 640}
CROP = {'IMG_8643': 0.11}  # left edge, fraction of width; keeps a 3:4 portrait window
TURN = {'IMG_8646': Image.Transpose.ROTATE_270, 'IMG_8647': Image.Transpose.ROTATE_270, 'IMG_8648': Image.Transpose.ROTATE_180}

for folder in SIZES:
    (OUT / folder).mkdir(parents=True, exist_ok=True)

for heic in sorted(SOURCE.glob('*.HEIC')):
    with Image.open(heic) as original:
        icc = original.info.get('icc_profile')
        oriented = ImageOps.exif_transpose(original).convert('RGB')
    profile = {'icc_profile': icc} if icc else {}
    if heic.stem == 'IMG_8647':  # the landscape bore-side layout crops cleanly to the 1200x630 share card
        share = ImageOps.fit(oriented, (1200, 630), Image.Resampling.LANCZOS, centering=(0.5, 0.55))
        share.save(ROOT / 'public' / 'assets' / 'share' / 'air-motor.jpg', 'JPEG', quality=84, optimize=True, **profile)
    image = oriented.transpose(TURN[heic.stem]) if heic.stem in TURN else oriented
    if heic.stem in CROP:
        left = round(CROP[heic.stem] * image.width)
        image = image.crop((left, 0, left + round(image.height * 3 / 4), image.height))
    image.save(OUT / f'{heic.stem}.jpg', 'JPEG', quality=86, optimize=True, progressive=True, **profile)
    for folder, edge in SIZES.items():
        small = image.copy()
        small.thumbnail((edge, edge), Image.Resampling.LANCZOS)
        small.save(OUT / folder / f'{heic.stem}.webp', 'WEBP', quality=80, method=6, **profile)
    print(heic.stem, image.size)
