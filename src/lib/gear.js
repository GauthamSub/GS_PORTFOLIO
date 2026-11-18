// Involute spur gear geometry for the hub.
// One tooth is generated upright (centerline on -y, gear center at 0,0) and
// rotated into place, so every tooth shares the same path data.

export const GEAR = {
  teeth: 7,
  pitchR: 200,
  pressureDeg: 25,
  addendum: 45,
  dedendum: 40,
}

const alpha = (GEAR.pressureDeg * Math.PI) / 180

export const baseR = GEAR.pitchR * Math.cos(alpha)
export const tipR = GEAR.pitchR + GEAR.addendum
export const rootR = GEAR.pitchR - GEAR.dedendum

const FILLET = 9 // root fillet radius
const FLANK_STEPS = 10 // involute samples per flank

const inv = (a) => Math.tan(a) - a

// Half the angular tooth thickness at radius r (valid for r >= baseR).
const halfAngle = (r) =>
  Math.PI / (2 * GEAR.teeth) + inv(alpha) - inv(Math.acos(Math.min(1, baseR / r)))

// Polar to SVG: phi measured clockwise from the tooth centerline.
const pt = (r, phi) => [r * Math.sin(phi), -r * Math.cos(phi)]
const f = ([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`

function buildTooth() {
  const psiBase = halfAngle(baseR)
  const filletAngle = FILLET / rootR

  // Right flank, root to tip: radial below the base circle, involute above it.
  const flank = [pt(rootR + FILLET, psiBase)]
  for (let i = 0; i <= FLANK_STEPS; i++) {
    const r = baseR + ((tipR - baseR) * i) / FLANK_STEPS
    flank.push(pt(r, halfAngle(r)))
  }
  const left = flank.map(([x, y]) => [-x, y])
  const right = [...flank].reverse()

  const outline = [
    `M ${f(pt(rootR, -(psiBase + filletAngle)))}`,
    `Q ${f(pt(rootR, -psiBase))} ${f(left[0])}`,
    ...left.slice(1).map((p) => `L ${f(p)}`),
    `A ${tipR} ${tipR} 0 0 1 ${f(right[0])}`,
    ...right.slice(1).map((p) => `L ${f(p)}`),
    `Q ${f(pt(rootR, psiBase))} ${f(pt(rootR, psiBase + filletAngle))}`,
  ].join(' ')

  // Closed fill dips just under the root circle so it hides the body stroke.
  const inner = rootR - 4
  const fill = [
    outline,
    `L ${f(pt(inner, psiBase + filletAngle))}`,
    `A ${inner} ${inner} 0 0 0 ${f(pt(inner, -(psiBase + filletAngle)))}`,
    'Z',
  ].join(' ')

  // Right-hand pieces of the outline, for the inspection overlay.
  const flankPath = `M ${flank.map(f).join(' L ')}`
  const fillet = `M ${f(flank[0])} Q ${f(pt(rootR, psiBase))} ${f(pt(rootR, psiBase + filletAngle))}`

  return { outline, fill, flank: flankPath, fillet }
}

export const TOOTH = buildTooth()
export const toothAngle = (i) => (360 / GEAR.teeth) * i

// Reference points on the right flank of the upright tooth, for the
// inspection callouts. Mirror x for the left flank.
function buildReference() {
  const psiBase = halfAngle(baseR)
  const psiPitch = halfAngle(GEAR.pitchR)
  const pitch = pt(GEAR.pitchR, psiPitch)
  const at = (len, phi) => [pitch[0] + len * Math.sin(phi), pitch[1] - len * Math.cos(phi)]

  // At the pitch point the flank tangent leans off the radial line by exactly
  // the pressure angle, toward the tooth centerline.
  const ARC = 44
  const angleLines = [
    `M ${f(at(-30, psiPitch))} L ${f(at(60, psiPitch))}`,
    `M ${f(at(-30, psiPitch - alpha))} L ${f(at(60, psiPitch - alpha))}`,
  ].join(' ')
  const angleArc = `M ${f(at(ARC, psiPitch))} A ${ARC} ${ARC} 0 0 0 ${f(at(ARC, psiPitch - alpha))}`

  // Midpoint of the quadratic root fillet.
  const a = pt(rootR + FILLET, psiBase)
  const c = pt(rootR, psiBase)
  const b = pt(rootR, psiBase + FILLET / rootR)

  return {
    angleLines,
    angleArc,
    angleAnchor: at(ARC + 5, psiPitch - alpha / 2),
    flank: pt(225, halfAngle(225)),
    fillet: [0.25 * a[0] + 0.5 * c[0] + 0.25 * b[0], 0.25 * a[1] + 0.5 * c[1] + 0.25 * b[1]],
    // On the pitch circle, centered in the gap to the left of the tooth.
    pitchGap: pt(GEAR.pitchR, -Math.PI / GEAR.teeth),
  }
}

export const REF = buildReference()
