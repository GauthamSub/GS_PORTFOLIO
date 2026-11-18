import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { control } from '../lib/controls.js'

// ParkSense in a conceptual garage, drawn as a 3D-projected SVG: perspective
// camera, painter's sort, back-face culling and near-plane clipping. No 3D
// library; this file is loaded lazily from the ParkSense page only.
//
// World units are centimetres. x runs from the front wall (x = 0) back along
// the bay, y across it, z up. The car parks forward, nose first: its front
// bumper sits x = d from the wall, where d is the sensor reading.
//
// Behaviour follows the prototype sketch (zones by if / else on the reading,
// MAX7219 icons iconClear / iconWarn / iconStop, SG90 at 0 / 45 / 90°, RGB LED,
// buzzer). The thresholds are the ones this page uses (see ZONES). Geometry is
// illustrative, not measured.

const W = 640
const H = 400
const FOCAL = 560
const NEAR = 8

/* -------------------------------------------------------------- vectors */
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const norm = (a) => {
  const l = Math.hypot(a[0], a[1], a[2]) || 1
  return [a[0] / l, a[1] / l, a[2] / l]
}

/* --------------------------------------------------------------- zones */
// MAX7219 bitmaps from the prototype sketch.
const ICON = {
  clear: ['00000000', '00000000', '00000000', '11111111', '11111111', '00000000', '00000000', '00000000'],
  warn: ['00011000', '00111100', '01111110', '11111111', '11111111', '01111110', '00111100', '00011000'],
  stop: ['10000001', '01000010', '00100100', '00011000', '00011000', '00100100', '01000010', '10000001'],
}
export const ZONES = {
  clear: { label: 'CLEAR', test: 'd > 120', color: '#91A8B6', rgb: null, rgbName: 'off', icon: null, iconName: 'clearDisplay()', angle: 0, buzzer: 'off', say: 'Bay clear: keep driving' },
  blue: { label: 'CAUTION', test: '70 < d ≤ 120', color: '#60A5FA', rgb: '#3B82F6', rgbName: 'blue', icon: ICON.clear, iconName: 'iconClear (keep going)', angle: 0, buzzer: 'off', say: 'Keep going' },
  green: { label: 'WARNING', test: '20 ≤ d ≤ 70', color: '#4ADE80', rgb: '#22C55E', rgbName: 'green', icon: ICON.warn, iconName: 'iconWarn (diamond)', angle: 45, buzzer: 'beeping', say: 'Almost there: slow down' },
  red: { label: 'STOP', test: 'd < 20', color: '#F87171', rgb: '#EF4444', rgbName: 'red', icon: ICON.stop, iconName: 'iconStop (X)', angle: 90, buzzer: 'solid tone', say: 'Stop: barrier down' },
}
export const zoneOf = (d) => (d > 120 ? 'clear' : d > 70 ? 'blue' : d >= 20 ? 'green' : 'red')
const ORDER = ['clear', 'blue', 'green', 'red']

/* -------------------------------------------------------------- camera */
const PRESETS = {
  default: () => ({ target: [230, 0, 60], yaw: -0.85, pitch: 0.42, dist: 900 }),
  driver: (d) => fromPos([d + 150, -30, 152], [0, 0, 124]),
  overhead: () => ({ target: [250, 0, 0], yaw: 0, pitch: 1.33, dist: 860 }),
  // The sensor's eye: from behind the wall, which culls away (cutaway view)
  sensor: (d) => fromPos([-250, 45, 92], [d + 40, 0, 52]),
}
function fromPos(pos, target) {
  const v = sub(pos, target)
  const dist = Math.hypot(...v)
  return { target, dist, pitch: Math.asin(v[2] / dist), yaw: Math.atan2(v[1], v[0]) }
}
function basis({ target, yaw, pitch, dist }) {
  const cp = Math.cos(pitch)
  const pos = [target[0] + dist * cp * Math.cos(yaw), target[1] + dist * cp * Math.sin(yaw), target[2] + dist * Math.sin(pitch)]
  const f = norm(sub(target, pos))
  const r = norm(cross(f, [0, 0, 1]))
  const u = cross(r, f)
  return { pos, f, r, u }
}

/* ---------------------------------------------------------------- model */
// A face: { pts, fill, stroke?, n? (outward normal, enables culling), tag?,
// decor? (polygons / lines drawn right after it), layer (0 floor, 1 wall,
// 2 sorted objects) }.
function box([x0, y0, z0], [x1, y1, z1], style) {
  const P = (x, y, z) => [x, y, z]
  return [
    { pts: [P(x1, y0, z0), P(x1, y1, z0), P(x1, y1, z1), P(x1, y0, z1)], n: [1, 0, 0] },
    { pts: [P(x0, y0, z0), P(x0, y0, z1), P(x0, y1, z1), P(x0, y1, z0)], n: [-1, 0, 0] },
    { pts: [P(x0, y1, z0), P(x0, y1, z1), P(x1, y1, z1), P(x1, y1, z0)], n: [0, 1, 0] },
    { pts: [P(x0, y0, z0), P(x1, y0, z0), P(x1, y0, z1), P(x0, y0, z1)], n: [0, -1, 0] },
    { pts: [P(x0, y0, z1), P(x1, y0, z1), P(x1, y1, z1), P(x0, y1, z1)], n: [0, 0, 1] },
  ].map((face) => ({ ...face, layer: 2, ...style }))
}

// Profile in the (x, z) plane, extruded across y = ±half.
function prism(profile, half, styleFor) {
  const cx = profile.reduce((s, p) => s + p[0], 0) / profile.length
  const cz = profile.reduce((s, p) => s + p[1], 0) / profile.length
  const faces = [
    { pts: profile.map(([x, z]) => [x, half, z]), n: [0, 1, 0], ...styleFor('side', 1) },
    { pts: profile.map(([x, z]) => [x, -half, z]), n: [0, -1, 0], ...styleFor('side', -1) },
  ]
  profile.forEach((a, i) => {
    const b = profile[(i + 1) % profile.length]
    let n = [b[1] - a[1], 0, -(b[0] - a[0])]
    const mid = [(a[0] + b[0]) / 2 - cx, (a[1] + b[1]) / 2 - cz]
    if (n[0] * mid[0] + n[2] * mid[1] < 0) n = [-n[0], 0, -n[2]]
    faces.push({ pts: [[a[0], -half, a[1]], [b[0], -half, b[1]], [b[0], half, b[1]], [a[0], half, a[1]]], n: norm(n), ...styleFor(i) })
  })
  return faces.map((face) => ({ layer: 2, ...face }))
}

const CAR_LEN = 450
const HALF = 88
const WHEEL_R = 33
// Side profile, front bumper at x = 0: bumper, hood, windshield, roof, rear window, boot, tail.
const PROFILE = [[0, 24], [0, 72], [18, 84], [100, 92], [160, 138], [322, 141], [402, 98], [450, 90], [450, 24]]
const GLASS = { 3: 'windshield', 5: 'rear-window' }

function carFaces(d) {
  const at = (pts) => pts.map(([x, y, z]) => [d + x, y, z])
  const faces = prism(PROFILE.map(([x, z]) => [d + x, z]), HALF, (edge, side) => {
    if (edge === 'side') {
      const s = side * (HALF + 0.6)
      return {
        fill: '#7E95A6',
        stroke: '#C9D6DF',
        decor: [
          // Side glass, one door line
          { pts: at([[112, s, 97], [163, s, 132], [316, s, 135], [390, s, 101]]), fill: '#1C3142', opacity: 0.8, stroke: '#9FB4C3' },
          { line: at([[232, s, 40], [232, s, 128]]), stroke: '#4D6476' },
        ],
      }
    }
    if (GLASS[edge]) return { fill: '#5E8FA8', opacity: 0.5, stroke: '#B6D8E6', tag: GLASS[edge] }
    if (edge === 0) {
      // Front face: grille between two headlights, facing the wall
      const x = -0.6
      return {
        fill: '#B9C7D1',
        stroke: '#E1E9EE',
        tag: 'front',
        decor: [
          { pts: at([[x, -36, 34], [x, 36, 34], [x, 36, 57], [x, -36, 57]]), fill: '#121C27', stroke: '#516678' },
          ...[40, 45, 50].map((z) => ({ line: at([[x, -34, z], [x, 34, z]]), stroke: '#3A4D5E' })),
          ...[-1, 1].map((s) => ({ pts: at([[x, s * 52, 54], [x, s * 80, 54], [x, s * 80, 67], [x, s * 52, 67]]), fill: '#FFF7D6', stroke: '#FFFFFF', glow: true })),
        ],
      }
    }
    if (edge === PROFILE.length - 2) {
      // Rear face: taillights
      const x = CAR_LEN + 0.6
      return {
        fill: '#93A8B7',
        stroke: '#C9D6DF',
        decor: [-1, 1].map((s) => ({ pts: at([[x, s * 58, 62], [x, s * 84, 62], [x, s * 84, 79], [x, s * 58, 79]]), fill: '#E5484D', stroke: '#FF9AA0' })),
      }
    }
    if (edge === PROFILE.length - 1) return { fill: '#1A2430' } // underside
    return { fill: '#A7B8C4', stroke: '#DCE5EA' }
  })
  return faces
}

function wheelFaces(cx, side, spin) {
  const n = 14
  const y0 = side * 70
  const y1 = side * 93
  const ring = (y) => Array.from({ length: n }, (_, k) => {
    const a = (k / n) * Math.PI * 2
    return [cx + WHEEL_R * Math.cos(a), y, WHEEL_R + WHEEL_R * Math.sin(a)]
  })
  const outer = ring(y1)
  const inner = ring(y0)
  const faces = [
    {
      pts: outer,
      n: [0, side, 0],
      fill: '#0A1018',
      stroke: '#5F7383',
      // Hub and three spokes, turned by the distance travelled
      decor: [
        ...[0, 1, 2].map((k) => {
          const a = spin + (k * Math.PI * 2) / 3
          return { line: [[cx, y1 + side * 0.4, WHEEL_R], [cx + 22 * Math.cos(a), y1 + side * 0.4, WHEEL_R + 22 * Math.sin(a)]], stroke: '#B8C6D1', width: 2.2 }
        }),
        { pts: Array.from({ length: 8 }, (_, k) => [cx + 7 * Math.cos((k * Math.PI) / 4), y1 + side * 0.5, WHEEL_R + 7 * Math.sin((k * Math.PI) / 4)]), fill: '#C9D6DF' },
      ],
    },
  ]
  for (let k = 0; k < n; k++) {
    const a = ((k + 0.5) / n) * Math.PI * 2
    faces.push({ pts: [inner[k], inner[(k + 1) % n], outer[(k + 1) % n], outer[k]], n: [Math.cos(a), 0, Math.sin(a)], fill: '#121A23', stroke: '#2B3A47' })
  }
  return faces.map((face) => ({ layer: 2, wheelSide: side, ...face }))
}

function armFaces(angle) {
  // SG90 on a post beside the bay, close to the wall. 0°: arm up; 90°: across the bay.
  const pivot = [4, -120, 52]
  const a = (angle * Math.PI) / 180
  const dir = [0, Math.sin(a), Math.cos(a)]
  const perp = [0, Math.cos(a), -Math.sin(a)]
  const L = 100
  const corner = (along, across, x) => [x, pivot[1] + dir[1] * along + perp[1] * across, pivot[2] + dir[2] * along + perp[2] * across]
  const faceAt = (x, nx) => ({ pts: [corner(-6, -3.5, x), corner(L, -3.5, x), corner(L, 3.5, x), corner(-6, 3.5, x)], n: [nx, 0, 0] })
  const stripes = Array.from({ length: 5 }, (_, k) => ({ pts: [corner(10 + k * 18, -3.5, 7.4), corner(19 + k * 18, -3.5, 7.4), corner(19 + k * 18, 3.5, 7.4), corner(10 + k * 18, 3.5, 7.4)], fill: '#E5484D' }))
  return [
    ...box([0, -128, 0], [8, -112, 46], { fill: '#1F3445', stroke: '#5E7A8E', tag: 'arm' }),
    ...box([-1, -129, 46], [9, -111, 58], { fill: '#1A4A66', stroke: '#6FD3E8', tag: 'arm' }),
    { ...faceAt(7.2, 1), fill: '#E6EDF2', stroke: '#FFFFFF', tag: 'arm', decor: stripes, layer: 2 },
    { ...faceAt(0.8, -1), fill: '#C7D2DA', stroke: '#FFFFFF', tag: 'arm', layer: 2 },
    { pts: [corner(L, -3.5, 0.8), corner(L, 3.5, 0.8), corner(L, 3.5, 7.2), corner(L, -3.5, 7.2)], n: dir, fill: '#E6EDF2', tag: 'arm', layer: 2 },
  ]
}

function sceneFaces(d, zone) {
  const z = ZONES[zone]
  const faces = []
  // Floor, bay lines, shadow (layer 0); wall and what is mounted on it (layer 1)
  faces.push({ pts: [[0, -165, 0], [640, -165, 0], [640, 165, 0], [0, 165, 0]], fill: '#0D1824', stroke: '#22394A', layer: 0 })
  ;[-112, 112].forEach((y) => faces.push({ pts: [[24, y - 3, 0.2], [600, y - 3, 0.2], [600, y + 3, 0.2], [24, y + 3, 0.2]], fill: '#C8D2DA', layer: 0 }))
  faces.push({ pts: [[24, -112, 0.2], [24, 112, 0.2], [30, 112, 0.2], [30, -112, 0.2]], fill: '#C8D2DA', layer: 0 })
  faces.push({ pts: [[d - 6, -96, 0.4], [d + CAR_LEN + 8, -96, 0.4], [d + CAR_LEN + 8, 96, 0.4], [d - 6, 96, 0.4]], fill: '#000000', opacity: 0.45, layer: 0 })
  // Painted floor arrow at the bay entrance, pointing at the wall: park nose in
  faces.push({ pts: [[520, -22, 0.3], [575, -22, 0.3], [575, -40, 0.3], [620, 0, 0.3], [575, 40, 0.3], [575, 22, 0.3], [520, 22, 0.3]].map(([x, y, zz]) => [1140 - x, y, zz]), fill: '#C8D2DA', opacity: 0.55, layer: 0 })
  // Headlight pools on the floor between the bumper and the wall
  ;[-1, 1].forEach((s) => faces.push({ pts: [[d, s * 52, 0.5], [d, s * 80, 0.5], [Math.max(d - 70, 0), s * 96, 0.5], [Math.max(d - 70, 0), s * 36, 0.5]], fill: '#FFF2B8', opacity: 0.16, layer: 0 }))
  // Wall and wall-front items face +x only, so from behind they cull away
  faces.push({ pts: [[0, -165, 0], [0, 165, 0], [0, 165, 240], [0, -165, 240]], n: [1, 0, 0], fill: '#172636', stroke: '#2C465A', layer: 1 })
  // HC-SR04 at bumper height, centred on the bay
  faces.push(...box([0, -12, 47], [4, 12, 63], { fill: '#1C5B78', stroke: '#7FE3F2', tag: 'sensor', layer: 1 }))
  ;[-6, 6].forEach((y) => faces.push({ pts: Array.from({ length: 10 }, (_, k) => [4.3, y + 4.2 * Math.cos((k * Math.PI) / 5), 55 + 4.2 * Math.sin((k * Math.PI) / 5)]), n: [1, 0, 0], fill: '#0A1620', stroke: '#C8F4FB', tag: 'sensor', layer: 1 }))
  // MAX7219 at the driver's eye line, with the RGB LED beside it
  faces.push({ pts: [[0.6, -21, 114], [0.6, 21, 114], [0.6, 21, 156], [0.6, -21, 156]], n: [1, 0, 0], fill: '#05080F', stroke: '#5E7A8E', tag: 'matrix', layer: 1 })
  if (z.icon) {
    z.icon.forEach((row, r) =>
      [...row].forEach((bit, c) => {
        const y = -17 + c * 4.5
        const zz = 151 - r * 4.5
        faces.push({ pts: [[1, y, zz], [1, y + 3.3, zz], [1, y + 3.3, zz - 3.3], [1, y, zz - 3.3]], n: [1, 0, 0], fill: bit === '1' ? '#FF5A4F' : '#2A1416', glow: bit === '1', tag: 'matrix', layer: 1 })
      }),
    )
  }
  faces.push({ pts: [[1, 27, 128], [1, 35, 128], [1, 35, 136], [1, 27, 136]], n: [1, 0, 0], fill: z.rgb ?? '#2A3846', stroke: '#9FB4C3', glow: Boolean(z.rgb), tag: 'matrix', layer: 1 })
  // Objects, depth-sorted
  faces.push(...carFaces(d))
  ;[-1, 1].forEach((side) => [d + 80, d + 370].forEach((cx) => faces.push(...wheelFaces(cx, side, -d / WHEEL_R))))
  faces.push(...armFaces(z.angle))
  return faces
}

/* ------------------------------------------------------------- render */
function project(cam, p) {
  const v = sub(p, cam.pos)
  return [dot(v, cam.r), dot(v, cam.u), dot(v, cam.f)]
}
function clipNear(poly) {
  const out = []
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i]
    const b = poly[(i + 1) % poly.length]
    if (a[2] >= NEAR) out.push(a)
    if (a[2] >= NEAR !== b[2] >= NEAR) {
      const t = (NEAR - a[2]) / (b[2] - a[2])
      out.push([a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1]), NEAR])
    }
  }
  return out
}
const toScreen = ([x, y, z]) => [W / 2 + (FOCAL * x) / z, H / 2 - (FOCAL * y) / z]
const ptsAttr = (pts) => pts.map((p) => toScreen(p).map((n) => n.toFixed(1)).join(',')).join(' ')
function screenPoint(cam, p) {
  const c = project(cam, p)
  return c[2] < NEAR ? null : toScreen(c)
}

function drawFace(cam, face, key, highlight) {
  const cps = clipNear(face.pts.map((p) => project(cam, p)))
  if (cps.length < 3) return null
  const lit = highlight && face.tag && highlight.includes(face.tag)
  const decor = (face.decor || []).map((item, i) => {
    if (item.line) {
      const l = clipNear(item.line.map((p) => project(cam, p)))
      if (l.length < 2) return null
      const [a, b] = [toScreen(l[0]), toScreen(l[1])]
      return <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={item.stroke} strokeWidth={item.width ?? 1} />
    }
    const p = clipNear(item.pts.map((q) => project(cam, q)))
    return p.length < 3 ? null : <polygon key={i} points={ptsAttr(p)} fill={item.fill} fillOpacity={item.opacity ?? 1} stroke={item.stroke ?? 'none'} strokeWidth="0.8" filter={item.glow ? 'url(#garage-glow)' : undefined} />
  })
  return (
    <g key={key}>
      <polygon
        points={ptsAttr(cps)}
        fill={face.fill}
        fillOpacity={face.opacity ?? 1}
        stroke={lit ? '#00E5FF' : face.stroke ?? 'none'}
        strokeWidth={lit ? 2.4 : 0.8}
        strokeLinejoin="round"
        filter={face.glow ? 'url(#garage-glow)' : lit ? 'url(#garage-lit)' : undefined}
      />
      {decor}
    </g>
  )
}

function Scene({ cam, d, zone, pulse, echoLost, highlight }) {
  const faces = useMemo(() => sceneFaces(d, zone), [d, zone])
  const order = useMemo(() => {
    const visible = faces.filter((face) => !face.n || dot(face.n, sub(cam.pos, face.pts[0])) > 0)
    const depth = (face) => face.pts.reduce((s, p) => s + dot(sub(p, cam.pos), cam.f), 0) / face.pts.length
    // Seen from the side or behind (camera past the front axle, outside the
    // wheel track), the near wheels stand clear of the body, so nothing on the
    // car can cover them: draw them last. A centroid sort would put the front
    // wheel behind the long side panel. From the front, sort them normally so
    // the bumper still hides them.
    const near = Math.abs(cam.pos[1]) > 93 && cam.pos[0] > d + 80 ? Math.sign(cam.pos[1]) : 0
    const layerOf = (face) => (near && face.wheelSide === near ? 3 : face.layer)
    return [0, 1, 2, 3].flatMap((layer) => {
      const list = visible.filter((face) => layerOf(face) === layer)
      return layer >= 2 ? list.map((face) => [depth(face), face]).sort((a, b) => b[0] - a[0]).map(([, face]) => face) : list
    })
  }, [faces, cam, d])

  // Measurement line, sensor face to front bumper, at sensor height.
  const s0 = screenPoint(cam, [4, 0, 55])
  const s1 = screenPoint(cam, [d, 0, 55])
  const mid = screenPoint(cam, [(4 + d) / 2, 0, 72])
  const tick = (x) => [screenPoint(cam, [x, 0, 45]), screenPoint(cam, [x, 0, 65])]
  const lit = (tag) => highlight?.includes(tag)

  // Ultrasonic burst: a ring travelling out to the bumper and an echo coming
  // back. Out: pulse 0 to 0.5; back: 0.5 to 1. A lost echo never comes back.
  let ring = null
  if (pulse !== null) {
    const back = pulse > 0.5
    if (!(back && echoLost)) {
      const s = back ? 1 - (pulse - 0.5) * 2 : pulse * 2
      const x = 4 + (Math.max(d, 10) - 4) * (echoLost ? Math.min(pulse * 2, 1) * 1.6 : s)
      const r = 5 + 26 * (back ? 1 - s : s)
      const pts = Array.from({ length: 18 }, (_, k) => {
        const a = (k / 18) * Math.PI * 2
        return project(cam, [x, r * Math.cos(a), 55 + r * Math.sin(a)])
      })
      if (pts.every((p) => p[2] >= NEAR)) {
        ring = <polygon points={ptsAttr(pts)} fill="none" stroke={back ? '#7FE3F2' : '#00E5FF'} strokeWidth="1.4" strokeOpacity={echoLost ? 0.6 * (1 - pulse) : 0.85} strokeDasharray={back ? '4 4' : undefined} />
      }
    }
  }

  return (
    <>
      {order.map((face, i) => drawFace(cam, face, i, highlight))}
      {ring}
      {s0 && s1 && (
        <g data-dimension>
          <line x1={s0[0]} y1={s0[1]} x2={s1[0]} y2={s1[1]} stroke={echoLost ? '#FBBF24' : lit('dimension') ? '#00E5FF' : ZONES[zone].color} strokeWidth={lit('dimension') ? 2.4 : 1.6} strokeDasharray="6 4" />
          {[tick(4), tick(d)].map(([a, b], i) => a && b && <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#DCE7EE" strokeWidth="1.2" />)}
          {mid && (
            <text x={mid[0]} y={mid[1]} textAnchor="middle" fill={echoLost ? '#FBBF24' : '#FFFFFF'} fontSize="13" fontWeight="600" className="font-mono" paintOrder="stroke" stroke="#05080F" strokeWidth="3">
              {echoLost ? 'NO ECHO' : `${d} cm`}
            </text>
          )}
        </g>
      )}
      <Label cam={cam} at={[0, 0, 36]} text="HC-SR04" lit={lit('sensor')} />
      <Label cam={cam} at={[0, 0, 170]} text="MAX7219 · RGB" lit={lit('matrix')} />
      <Label cam={cam} at={[4, -120, 168]} text="SG90 ARM" lit={lit('arm')} />
      <Label cam={cam} at={[d + 40, 0, 118]} text="FRONT" />
    </>
  )
}

function Label({ cam, at, text, lit }) {
  const p = screenPoint(cam, at)
  if (!p || p[0] < 0 || p[0] > W || p[1] < 10 || p[1] > H) return null
  return (
    <text x={p[0]} y={p[1]} textAnchor="middle" fill={lit ? '#00E5FF' : '#C0D1DD'} fontSize="11" letterSpacing="0.08em" className="font-mono" paintOrder="stroke" stroke="#05080F" strokeWidth="3">
      {text}
    </text>
  )
}

/* ------------------------------------------------------------- inspector */
const STEPS = ['Distance Reading', 'Threshold Comparison', 'LED Pattern', 'Servo Command']
const STEP_TAGS = [['sensor', 'dimension'], [], ['matrix'], ['arm']]

function Inspector({ step, d, zone }) {
  const z = ZONES[zone]
  // Round trip at 0.034 cm/µs: the sketch's conversion, run backwards.
  const micros = Math.round((2 * d) / 0.034)
  const body = [
    <>
      <code className="text-white">pulseIn(echo, HIGH, 30000UL)</code> returns about <b className="text-white">{micros.toLocaleString()} µs</b>; <code className="text-white">× 0.034 / 2</code> gives <b className="text-white">{d} cm</b>.
    </>,
    <ul className="space-y-1 font-mono text-[12px]">
      {ORDER.map((key) => (
        <li key={key} className={key === zone ? 'text-white' : 'text-ti-300'}>
          {key === zone ? '▸' : ' '} {ZONES[key].test} → {ZONES[key].label}
        </li>
      ))}
    </ul>,
    <>
      Matrix shows <b className="text-white">{z.iconName}</b>; RGB LED <b className="text-white">{z.rgbName}</b>; buzzer <b className="text-white">{z.buzzer}</b>.
    </>,
    <>
      <code className="text-white">stopArmServo.write({z.angle})</code>: the arm {z.angle === 0 ? 'stays up' : z.angle === 45 ? 'drops halfway' : 'drops across the bay'}.
    </>,
  ][step]
  return (
    <div className="border border-hud/30 bg-obsidian/70 p-3" aria-live="polite" data-inspector-step={step}>
      <ol className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.12em]">
        {STEPS.map((name, i) => (
          <li key={name} className={i === step ? 'text-hud' : 'text-ti-300'}>
            {i + 1} {name}
            {i < STEPS.length - 1 && <span className="ml-3 text-ti-400">→</span>}
          </li>
        ))}
      </ol>
      <div className="mt-2 text-[13px] leading-relaxed text-ti-300">{body}</div>
    </div>
  )
}

/* ------------------------------------------------------------- keypad */
const KEYS = ['1', '2', '3', 'A', '4', '5', '6', 'B', '7', '8', '9', 'C', '*', '0', '#', 'D']
const BLOCK_MS = 1000 // original sketch: pulseIn's default wait, the report's "full second"
const HOLD_MS = 1400 // how long a missed reading is shown

/* ------------------------------------------------------------- component */
const btn = control

export default function ParkSenseGarage() {
  const reduce = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])
  const [d, setD] = useState(140)
  const [view, setView] = useState(PRESETS.default())
  const [preset, setPreset] = useState('default')
  const [inspect, setInspect] = useState(false)
  const [step, setStep] = useState(0)
  const [pulse, setPulse] = useState(reduce ? null : 0)
  const [firmware, setFirmware] = useState('timeout')
  const [echo, setEcho] = useState(null) // { start, firmware }
  const [now, setNow] = useState(() => performance.now())
  const [pin, setPin] = useState('')
  const [keyLog, setKeyLog] = useState(null) // { key, ok, at }
  const sliderId = useId()
  const drag = useRef(null)
  const tween = useRef(0)
  const root = useRef(null)
  const onScreen = useInView(root)

  const zone = zoneOf(d)
  const z = ZONES[zone]
  const cam = useMemo(() => basis(view), [view])
  const paused = inspect || !onScreen
  const echoActive = echo && now - echo.start < HOLD_MS
  const blocked = echo && echo.firmware === 'blocking' && now - echo.start < BLOCK_MS

  // One clock for the ultrasonic pulse and the echo timers. Paused while inspecting or offscreen.
  useEffect(() => {
    if (paused) return undefined
    let frame
    const start = performance.now()
    const tick = (t) => {
      setNow(t)
      if (!reduce) setPulse(((t - start) / 1400) % 1)
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [paused, reduce])

  // Camera: presets tween (instantly under reduced motion); drag and keys orbit.
  const goTo = (name) => {
    const next = PRESETS[name](d)
    setPreset(name)
    cancelAnimationFrame(tween.current)
    if (reduce) {
      setView(next)
      return
    }
    const from = view
    const dy = ((((next.yaw - from.yaw) % (2 * Math.PI)) + 3 * Math.PI) % (2 * Math.PI)) - Math.PI
    const t0 = performance.now()
    const step = (t) => {
      const k = Math.min((t - t0) / 450, 1)
      const e = 1 - (1 - k) ** 3
      const mix = (a, b) => a + (b - a) * e
      setView({ target: from.target.map((v, i) => mix(v, next.target[i])), yaw: from.yaw + dy * e, pitch: mix(from.pitch, next.pitch), dist: mix(from.dist, next.dist) })
      if (k < 1) tween.current = requestAnimationFrame(step)
    }
    tween.current = requestAnimationFrame(step)
  }
  const orbit = (dYaw, dPitch) => {
    cancelAnimationFrame(tween.current)
    setPreset(null)
    setView((v) => ({ ...v, yaw: v.yaw + dYaw, pitch: Math.min(Math.max(v.pitch + dPitch, 0.06), 1.45) }))
  }
  const pointer = {
    onPointerDown: (e) => {
      drag.current = [e.clientX, e.clientY]
      // Capture can fail if the pointer is already gone; the drag still works without it.
      try {
        e.currentTarget.setPointerCapture(e.pointerId)
      } catch {
        /* no live pointer */
      }
    },
    onPointerMove: (e) => {
      if (!drag.current) return
      const [x, y] = drag.current
      drag.current = [e.clientX, e.clientY]
      orbit(-(e.clientX - x) * 0.008, e.pointerType === 'touch' ? 0 : (e.clientY - y) * 0.006)
    },
    onPointerUp: () => (drag.current = null),
    onPointerCancel: () => (drag.current = null),
    onKeyDown: (e) => {
      const keys = { ArrowLeft: [0.17, 0], ArrowRight: [-0.17, 0], ArrowUp: [0, 0.09], ArrowDown: [0, -0.09] }
      if (!keys[e.key]) return
      e.preventDefault()
      orbit(...keys[e.key])
    },
  }

  const missEcho = () => setEcho({ start: performance.now(), firmware })
  const press = (key) => {
    const t = performance.now()
    const ok = !(echo && echo.firmware === 'blocking' && t - echo.start < BLOCK_MS)
    setKeyLog({ key, ok, at: t })
    if (!ok) return
    if (key === '*') setPin('')
    else if (key !== '#') setPin((p) => (p + key).slice(-4))
  }

  const highlight = inspect ? STEP_TAGS[step] : null
  const reading = echoActive ? 'unavailable' : `${d} cm`

  return (
    <div ref={root} data-garage data-zone={zone} data-arm-angle={z.angle} data-camera={preset ?? 'custom'} data-reading={reading}>
      <div className="flex flex-wrap items-end justify-between gap-3" aria-live="polite" aria-atomic="true">
        <p className="font-mono text-4xl tabular-nums text-white">
          {echoActive ? <span className="text-amber-300">— —</span> : <output htmlFor={sliderId}>{d}</output>}
          <span className="ml-2 text-sm text-ti-300">{echoActive ? 'no echo' : 'cm'}</span>
        </p>
        <span className="border px-3 py-1.5 font-mono text-xs tracking-[0.16em]" style={{ color: z.color, borderColor: z.color }} data-parksense-state>
          {z.label}
        </span>
      </div>

      <div className="relative mt-3">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          tabIndex={0}
          aria-label={`Garage, front-in parking: the car's headlights and grille face the wall sensor. Distance ${reading}. ${z.label}. Barrier ${z.angle} degrees. Drag or use arrow keys to rotate the view.`}
          className="block w-full cursor-grab touch-pan-y select-none rounded-sm border border-hud/15 bg-[#070e18] outline-none focus-visible:border-hud active:cursor-grabbing"
          {...pointer}
        >
          <defs>
            <filter id="garage-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.6" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="garage-lit" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#00E5FF" floodOpacity="0.8" />
            </filter>
          </defs>
          <Scene cam={cam} d={d} zone={zone} pulse={paused ? null : pulse} echoLost={Boolean(echoActive)} highlight={highlight} />
          <text x="12" y={H - 12} fill="#91A8B6" fontSize="10" letterSpacing="0.08em" className="font-mono">SIMULATED BEHAVIOR · CONCEPTUAL GARAGE GEOMETRY</text>
          {inspect && <text x={W - 12} y="20" textAnchor="end" fill="#00E5FF" fontSize="11" letterSpacing="0.1em" className="font-mono">PAUSED · INSPECTING</text>}
        </svg>
      </div>

      {/* Camera */}
      <div className="mt-3 flex flex-wrap items-center gap-2" role="group" aria-label="Camera">
        {[
          ['driver', 'Driver'],
          ['overhead', 'Overhead'],
          ['sensor', 'Sensor'],
        ].map(([name, text]) => (
          <button key={name} type="button" aria-pressed={preset === name} onClick={() => goTo(name)} className={btn(preset === name)}>
            {text}
          </button>
        ))}
        <button type="button" onClick={() => goTo('default')} className={btn(false)}>
          Reset View
        </button>
        <span className="flex gap-1" aria-label="Rotate view">
          {[
            ['◀', 'Rotate left', [0.26, 0]],
            ['▶', 'Rotate right', [-0.26, 0]],
            ['▲', 'Tilt up', [0, 0.12]],
            ['▼', 'Tilt down', [0, -0.12]],
          ].map(([icon, name, delta]) => (
            <button key={name} type="button" aria-label={name} onClick={() => orbit(...delta)} className={`${btn(false)} min-w-[44px] md:min-w-[34px]`}>
              {icon}
            </button>
          ))}
        </span>
      </div>

      {/* Distance */}
      <div className="mt-4">
        <label htmlFor={sliderId} className="flex justify-between gap-3 font-mono text-xs text-ti-300">
          Front bumper to sensor <span className="text-ti-400">Decrease to pull in</span>
        </label>
        <input
          id={sliderId}
          type="range"
          min="10"
          max="150"
          step="1"
          value={d}
          disabled={inspect}
          onChange={(e) => setD(Number(e.target.value))}
          aria-valuetext={`${d} centimeters, ${z.label}`}
          className="mt-3 h-11 w-full cursor-pointer accent-cyan-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-400 disabled:cursor-not-allowed disabled:opacity-40 md:h-6"
        />
        <div className="flex justify-between font-mono text-[11px] text-ti-300">
          <span>10 cm</span>
          <span>{z.say}</span>
          <span>150 cm</span>
        </div>
      </div>

      {/* Outputs */}
      <dl className="mt-4 grid grid-cols-2 gap-2 font-mono text-[11px] sm:grid-cols-4">
        {[
          ['RGB LED', z.rgbName, z.rgb ?? '#64748B'],
          ['Matrix', z.icon ? z.iconName.split(' ')[0] : 'blank', '#FF5A4F'],
          ['SG90', `${z.angle}°`, '#DCE7EE'],
          ['Buzzer', z.buzzer, '#DCE7EE'],
        ].map(([k, v, c]) => (
          <div key={k} className="border border-hud/20 px-2 py-1.5">
            <dt className="text-ti-400">{k}</dt>
            <dd className="text-white">
              <span aria-hidden="true" className="mr-1.5 inline-block h-2 w-2 rounded-full align-middle" style={{ backgroundColor: c }} />
              {v}
            </dd>
          </div>
        ))}
      </dl>

      {/* Why did it stop? */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button type="button" aria-pressed={inspect} onClick={() => { setInspect((v) => !v); setStep(0) }} className={btn(inspect)}>
          Why did it stop?
        </button>
        {inspect && (
          <>
            <button type="button" onClick={() => setStep((s) => Math.max(s - 1, 0))} disabled={step === 0} className={`${btn(false)} disabled:opacity-40`}>
              ← Back
            </button>
            <button type="button" onClick={() => setStep((s) => Math.min(s + 1, 3))} disabled={step === 3} className={`${btn(false)} disabled:opacity-40`}>
              Next →
            </button>
          </>
        )}
      </div>
      {inspect && (
        <div className="mt-2">
          <Inspector step={step} d={d} zone={zone} />
        </div>
      )}

      {/* Miss an Echo, with the keypad */}
      <div className="mt-5 grid gap-4 border-t border-hud/15 pt-4 sm:grid-cols-[minmax(0,1fr)_auto]">
        <div className="min-w-0">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ti-400">Miss an Echo · in the garage</p>
          <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Firmware">
            {[
              ['timeout', '30 ms timeout'],
              ['blocking', '~1 s blocking wait'],
            ].map(([id, text]) => (
              <button key={id} type="button" aria-pressed={firmware === id} onClick={() => setFirmware(id)} className={btn(firmware === id)}>
                {text}
              </button>
            ))}
            <button type="button" onClick={missEcho} disabled={inspect} className={`${btn(false)} border-amber-300/60 text-amber-200 disabled:opacity-40`}>
              Miss an Echo
            </button>
          </div>
          <p className="mt-2 text-[13px] leading-relaxed text-ti-300" aria-live="polite" data-echo-status>
            {!echoActive
              ? 'Fire one ping with no echo, then press keys on the keypad.'
              : echo.firmware === 'blocking'
                ? blocked
                  ? `pulseIn() is still waiting (${Math.round(now - echo.start)} ms of ~1,000). loop() is stuck: key presses are lost.`
                  : 'pulseIn() gave up after ~1,000 ms. The reading was unavailable for the whole wait.'
                : 'pulseIn() returned 0 after 30 ms. The reading is unavailable, but loop() keeps running and the keypad answers.'}
          </p>
          <p className="mt-1 font-mono text-[11px] text-ti-300">Simulated timing. Outputs hold their last state for this illustration.</p>
        </div>

        <div>
          <p className="flex items-center justify-between font-mono text-[11px] text-ti-300">
            <span>PIN</span>
            <span className="tabular-nums text-white" data-pin>{pin.padEnd(4, '·')}</span>
          </p>
          <div className="mt-1 grid grid-cols-4 gap-1" role="group" aria-label="4 by 4 keypad">
            {KEYS.map((key) => {
              const flash = keyLog && keyLog.key === key && now - keyLog.at < 400
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => press(key)}
                  className={`h-11 w-11 cursor-pointer border font-mono text-sm transition-colors focus-visible:outline-2 focus-visible:outline-hud md:h-9 md:w-9 ${
                    flash ? (keyLog.ok ? 'border-green-400 bg-green-400/20 text-white' : 'border-red-400 bg-red-400/20 text-red-200') : 'border-hud/30 text-readout hover:border-hud'
                  }`}
                >
                  {key}
                </button>
              )
            })}
          </div>
          <p className="mt-1 h-4 font-mono text-[11px]" aria-live="polite" data-key-status>
            {keyLog && now - keyLog.at < 1500 && (keyLog.ok ? <span className="text-green-300">Key {keyLog.key} read</span> : <span className="text-red-300">Key {keyLog.key} lost · loop blocked</span>)}
          </p>
        </div>
      </div>

      <p className="mt-4 border-t border-hud/15 pt-3 text-sm leading-relaxed text-ti-300">
        Thresholds used on this page: CLEAR &gt; 120 cm · CAUTION 70–120 cm · WARNING 20–70 cm (arm 45°) · STOP &lt; 20 cm (arm 90°). Matrix icons from the prototype sketch. Garage geometry is illustrative; no live hardware connection.
      </p>
    </div>
  )
}
