// ME2900 air motor: the Workshop subpage at /workshop/air-motor.
// Transcribed from docs/me2900-review/asset-manifest.json (reviewed 2026-11-19).
// Part labels name visible geometry only: functional names, alloys,
// dimensions and per-part process sequences are unconfirmed.
// Photos are built by scripts/prepare-machine-shop.py from the original HEICs.

const dir = '/assets/machine-shop-me2900'

export const airMotor = {
  slug: 'air-motor',
  path: '/workshop/air-motor',
  label: 'ME2900 Air Motor',
  title: 'ME2900 Air Motor — Machining',
  mobileTitle: 'ME2900 Air Motor — Machining',
  org: 'Ohio State ME 2900 · Design–Build–Test Fabrication',
  specRole: 'Component fabrication',
  domain: 'Coursework · machining',
  contribution: 'Fabricated these air motor components in the ME 2900 shop using mills, lathes, hand files and CNC equipment.',
  status: 'Components fabricated; assembly and run video pending',
  // Set to { src, poster, captions } once the assembly / run recording exists.
  // Nothing renders while it is null.
  video: null,
}

export const parts = [
  {
    id: 'block',
    number: '01',
    label: 'Engraved rectangular block',
    features: ['Lettering', 'Large reverse-side bore', 'Threaded openings'],
    description: 'Engraved front face, with a large bore visible on the opposite side.',
  },
  {
    id: 'plate',
    number: '02',
    label: 'Square machined plate',
    features: ['Central opening', 'Four-hole pattern', 'Circular recess'],
    description: 'Square component with a central opening, a surrounding four-hole pattern and a circular recess on one face.',
  },
  {
    id: 'cylinder',
    number: '03',
    label: 'Slotted cylindrical part',
    features: ['Cylindrical surface', 'Slot', 'Cross-hole'],
    description: 'Cylindrical outer surface cut through by a slot, with a cross-hole.',
  },
  {
    id: 'link',
    number: '04',
    label: 'Two-hole flat link',
    features: ['End holes', 'Rounded ends', 'Flat edges'],
    description: 'Narrow flat component with a hole at each rounded end.',
  },
]

const photo = (id, size, caption, alt, anchors) => ({
  id,
  size,
  caption,
  alt,
  anchors,
  src: `${dir}/${id}.jpg`,
  inspectorSrc: `${dir}/inspector/${id}.webp`,
  previewSrc: `${dir}/previews/${id}.webp`,
})

const portrait = [3024, 4032]

// Every photo is turned to IMG_8644's orientation (block at the bottom, link
// upright on the right; see scripts/prepare-machine-shop.py). Anchors are
// fractions of that turned, uncropped image: [x, y] from top-left.
// A 90 deg clockwise turn maps (x, y) to (1 - y, x); 180 maps it to (1 - x, 1 - y).
export const views = [
  photo('IMG_8644', portrait, 'Front overview: all four components',
    'Four machined air motor components on a workbench: engraved block, square plate, slotted cylindrical part and two-hole link',
    { block: [0.4, 0.74], plate: [0.39, 0.45], cylinder: [0.49, 0.25], link: [0.7, 0.42] }),
  photo('IMG_8647', portrait, 'Bore-side view: large bore and slotted part',
    'Bore side of the machined block beside the square plate, slotted cylindrical part and two-hole link',
    { block: [0.41, 0.76], plate: [0.41, 0.47], cylinder: [0.45, 0.28], link: [0.65, 0.46] }),
]

export const viewLabels = { IMG_8644: 'Front overview', IMG_8647: 'Bore-side view' }

// Remaining photos, gallery only. Captions describe faces and layouts, not iterations.
export const gallery = [
  photo('IMG_8645', portrait, 'Reverse faces: threaded openings and recessed hole entrances',
    'Reverse faces of the machined components showing the block bore, threaded openings and plate hole entrances'),
  photo('IMG_8643', [2268, 3024], 'Front layout, lower block edge cropped',
    'Front faces of the four machined components, block lettering at the lower edge'),
  photo('IMG_8646', portrait, 'Plain block face and component layout',
    'Plain face of the machined block beside the square plate, slotted part and link'),
  photo('IMG_8648', portrait, 'Overlapping layout near the bore (not an assembled fit)',
    'Machined components overlapping on a workbench, cylindrical part placed near the block bore'),
]
