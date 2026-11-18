"""Reproduce portfolio evidence crops. Requires PyMuPDF and Pillow.

PDF page numbers below are one-based. Crops retain diagram labels and legends;
NASA annotations describe visible geometry and distinguish unpictured hardware.
"""
from pathlib import Path
import pymupdf
from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / 'public' / 'assets'

def render(pdf, page, rect, target):
    doc = pymupdf.open(ASSETS / pdf)
    out = ASSETS / target
    out.parent.mkdir(parents=True, exist_ok=True)
    doc[page - 1].get_pixmap(matrix=pymupdf.Matrix(4, 4), clip=pymupdf.Rect(rect), alpha=False).save(out)

render('Project Presentation-Rotating Beam Fatigue.pdf', 8, (25, 52, 690, 373), 'gearlab/specimen-figure.png')
render('Project Presentation-Rotating Beam Fatigue.pdf', 7, (4, 52, 688, 378), 'gearlab/calibration-figure.png')
render('Project Presentation-Rotating Beam Fatigue.pdf', 17, (198, 55, 686, 379), 'gearlab/sn-figure.png')
render('Reph - Onramp - SU26.pdf', 5, (35, 40, 940, 521), 'onramp/solution-figure.png')

def font(size):
    return ImageFont.truetype('C:/Windows/Fonts/arial.ttf', size)

def annotate(source, rect, target, title, calls):
    crop = Image.open(ASSETS / source).convert('RGB').crop(rect)
    width = max(crop.width, 1050)
    canvas = Image.new('RGB', (width, crop.height + 210), '#0b111c')
    canvas.paste(crop, ((width - crop.width)//2, 0))
    d = ImageDraw.Draw(canvas)
    d.text((24, crop.height + 17), title, font=font(25), fill='#00e5ff')
    for index, (point, label) in enumerate(calls, 1):
        x, y = point
        x += (width - crop.width)//2
        d.ellipse((x-17,y-17,x+17,y+17), fill='#0b111c', outline='#00e5ff', width=3)
        d.text((x-6,y-13), str(index), font=font(22), fill='#ffffff')
        d.text((24, crop.height+57+(index-1)*40), f'{index:02d}  {label}', font=font(21), fill='#ffffff')
    out = ASSETS / target
    out.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(out)

annotate('MCA schematic.png', (90,140,1000,530), 'nasa/suspension-annotated.png',
         'Rocker-bogie | side-view concept sketch', [
             ((265,69),'Rocker pivot and articulated links'),
             ((491,117),'Bogie linkage connects the wheel stations'),
             ((366,253),'Wheel layout; sketch dimensions are concept values')])
annotate('MCA schematic.png', (145,0,855,285), 'nasa/packaging-annotated.png',
         'Sensing and power | upper chassis concept sketch', [
             ((439,163),'Solar-panel envelope above the chassis'),
             ((70,63),'Mast is labelled antenna / camera in this sketch'),
             ((230,210),'LiDAR integration is described in portfolio p. 3; not labelled here')])
annotate('Shovel Arm NX.png', (48,72,1695,890), 'nasa/sampling-annotated.png',
         'Sampling arm | Siemens NX drawing detail (dimensions in mm)', [
             ((1106,238),'Joint diameter: 180 mm'),
             ((1304,146),'Upper link dimension: 1201.1 mm'),
             ((133,702),'End-effector detail; full sheet includes scale and title block')])

def share(source, target, title, subtitle):
    canvas = Image.new('RGB', (1200,630), '#05080f')
    image = Image.open(ASSETS / source).convert('RGB')
    image.thumbnail((1128,440), Image.Resampling.LANCZOS)
    canvas.paste(image, ((1200-image.width)//2, 25+(440-image.height)//2))
    d = ImageDraw.Draw(canvas)
    d.line((36,480,1164,480), fill='#00e5ff', width=2)
    d.text((36,501), title, font=font(37), fill='white')
    d.text((36,559), subtitle, font=font(23), fill='#00e5ff')
    (ASSETS/'share').mkdir(exist_ok=True)
    canvas.save(ASSETS/'share'/target)

share('gearlab/specimen-figure.png', 'gearlab.png', 'GearLab | Rotating beam fatigue', 'Gautham Subramanian | Mechanical Engineering')
share('Shovel Arm NX.png', 'nasa.png', "NASA L'SPACE | Rover concept", 'Sampling-arm drawing | Siemens NX')
share('Parksense stuff/Prototype Circuit.png', 'parksense.png', 'ParkSense | Garage parking assistant', 'Arduino control | Sensing | SolidWorks enclosure')
share('gearlab/specimen-figure.png', 'portfolio.png', 'Gautham Subramanian', 'Mechanical Engineering | The Ohio State University')
print('Rendered 4 PDF crops, 3 NASA annotated views, 4 share previews.')
