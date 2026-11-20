import { useId, useRef, useState } from 'react'
import { control } from '../lib/controls.js'

// Rocker-bogie on one side, after the PDR side-view concept sketch: the rocker
// carries the front wheel and, at its rear end, the bogie pivot; the bogie
// carries the middle and rear wheels. Units are centimetres, rover facing
// right. Sketch values: 1.5 m wheelbase, 0.2 m wheels. Link offsets are
// illustrative, so this is a conceptual motion model, not the NX geometry.
//
// Wheel centres follow the terrain (a step under this side only, the far side
// on flat ground); the bogie and rocker are rigid links solved from them with
// small horizontal shifts ignored. The differential sets chassis pitch to the
// mean of the two rocker angles: here half of this side's. Visitor-driven only.

const INK = '#DCE7EE'
const DIM = '#91A8B6'
const CYAN = '#00E5FF'
const R = 10 // wheel radius
const STEP_H = 14 // step height, under one wheel diameter
const STEP_X = 260 // step edge, world x
const X = { rear: 0, mid: 55, front: 150 }
const BOGIE_PIVOT = [27.5, 30] // from the rear wheel centre, at rest
const ROCKER = { pivot: [57.5, 22], knee: [122.5, 0], front: [122.5, -30] } // from the bogie pivot, at rest
// Slider: front-wheel centre relative to the step edge, in cm.
const RANGE = [-35, 180]
const START = 40

const ground = (x) => {
  const u = Math.min(Math.max((x - (STEP_X - R)) / R, 0), 1)
  return (STEP_H * (1 - Math.cos(Math.PI * u))) / 2
}
const rot = ([x, y], a) => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)]
const add = (a, b) => [a[0] + b[0], a[1] + b[1]]
const deg = (a) => (a * 180) / Math.PI
const clamp = (v) => Math.min(Math.max(v, RANGE[0]), RANGE[1])

function solve(position) {
  const d = STEP_X + position - X.front
  const wheel = (x) => [d + x, R + ground(d + x)]
  const rear = wheel(X.rear)
  const mid = wheel(X.mid)
  const front = wheel(X.front)
  const bogie = Math.atan2(mid[1] - rear[1], X.mid - X.rear)
  const bp = add(rear, rot(BOGIE_PIVOT, bogie))
  const rest = Math.atan2(ROCKER.front[1], ROCKER.front[0])
  const rocker = Math.atan2(front[1] - bp[1], front[0] - bp[0]) - rest
  const at = (p) => add(bp, rot(p, rocker))
  return { d, rear, mid, front, bp, bogie, rocker, pivot: at(ROCKER.pivot), knee: at(ROCKER.knee), pitch: rocker / 2 }
}

export default function RockerBogie() {
  const [position, setPosition] = useState(START)
  const id = useId()
  const last = useRef(null)
  const s = solve(position)

  // Horizontal drag drives the rover, in viewBox units (cm) per pixel.
  const drag = {
    onPointerDown: (event) => {
      last.current = event.clientX
      event.currentTarget.setPointerCapture(event.pointerId)
    },
    onPointerMove: (event) => {
      if (last.current === null) return
      const svg = event.currentTarget
      const scale = svg.viewBox.baseVal.width / svg.getBoundingClientRect().width
      const dx = (event.clientX - last.current) * scale
      last.current = event.clientX
      setPosition((v) => clamp(Math.round(v + dx)))
    },
    onPointerUp: () => (last.current = null),
    onPointerCancel: () => (last.current = null),
  }

  // World to screen: y up becomes y down; the camera follows the rover.
  const cx = s.d + 75
  const P = ([x, y]) => `${(x - cx).toFixed(1)} ${(-y).toFixed(1)}`
  const chassis = [[-80, -10], [75, -10], [75, 26], [-80, 26]].map((p) => P(add(s.pivot, rot(p, s.pitch))))
  const terrain = Array.from({ length: 61 }, (_, n) => {
    const x = cx - 130 + n * (260 / 60)
    return `${n ? 'L' : 'M'}${P([x, ground(x)])}`
  }).join('')
  const lift = (w) => (w[1] - R).toFixed(0)

  return (
    <div className="min-w-0" data-rocker-bogie>
      <div className="aspect-[2/1] w-full border border-white/10 bg-obsidian">
        <svg
          viewBox="-130 -100 260 130"
          role="img"
          aria-label={`Front wheel ${position} centimetres past a ${STEP_H} centimetre step edge. Rocker ${deg(s.rocker).toFixed(1)} degrees, chassis ${deg(s.pitch).toFixed(1)} degrees.`}
          className="h-full w-full cursor-ew-resize touch-none select-none"
          {...drag}
        >
          <path d={`${terrain}V30H-130Z`} fill="#0B2231" stroke={DIM} strokeWidth="0.8" />
          <polygon points={chassis.join(' ')} fill="#0B111C" stroke={INK} strokeOpacity="0.7" strokeWidth="1" />
          {/* Bogie: pivot to middle wheel (diagonal link), pivot to rear wheel (leg) */}
          <path d={`M${P(s.bp)}L${P(s.mid)}M${P(s.bp)}L${P(add(s.rear, rot([0, 22], s.bogie)))}L${P(s.rear)}`} stroke={CYAN} strokeWidth="2.4" fill="none" strokeLinejoin="round" />
          {/* Rocker: bogie pivot to chassis pivot to knee, then the front leg */}
          <path d={`M${P(s.bp)}L${P(s.pivot)}L${P(s.knee)}L${P(s.front)}`} stroke="#FFFFFF" strokeWidth="2.4" fill="none" strokeLinejoin="round" />
          {[s.rear, s.mid, s.front].map((w, i) => (
            <g key={i}>
              <circle cx={w[0] - cx} cy={-w[1]} r={R} fill="#070C16" stroke={INK} strokeWidth="1.2" />
              <circle cx={w[0] - cx} cy={-w[1]} r="2.2" fill={INK} />
            </g>
          ))}
          {[s.pivot, s.bp].map((p, i) => (
            <circle key={i} cx={p[0] - cx} cy={-p[1]} r="3" fill="#070C16" stroke={CYAN} strokeWidth="1.4" />
          ))}
          <text x="-124" y="24" fill={DIM} fontSize="8" className="font-mono">STEP {STEP_H} CM · DRAG TO DRIVE</text>
        </svg>
      </div>

      <div className="mt-3 flex items-end gap-3">
        <div className="min-w-0 flex-1">
          <label htmlFor={id} className="flex justify-between font-mono text-[11px] text-ti-300">
            Front wheel past step edge (cm) <output htmlFor={id} className="tabular-nums text-white">{position} cm</output>
          </label>
          <input
            id={id}
            type="range"
            min={RANGE[0]}
            max={RANGE[1]}
            value={position}
            onChange={(event) => setPosition(Number(event.target.value))}
            aria-valuetext={`${position} centimetres past the step edge`}
            className="h-11 w-full cursor-pointer accent-cyan-400 md:h-6"
          />
        </div>
        <button type="button" onClick={() => setPosition(START)} disabled={position === START} className={control()}>Reset</button>
      </div>
      <dl className="mt-2 grid grid-cols-3 gap-2 font-mono text-[11px]" aria-live="polite">
        {[
          ['Lift F/M/R', `${lift(s.front)}/${lift(s.mid)}/${lift(s.rear)} cm`],
          ['Rocker', `${deg(s.rocker).toFixed(1)}°`],
          ['Chassis', `${deg(s.pitch).toFixed(1)}°`],
        ].map(([k, v]) => (
          <div key={k} className="border border-white/10 px-2 py-1.5">
            <dt className="text-ti-400">{k}</dt>
            <dd className="tabular-nums text-white">{v}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-2 text-sm leading-relaxed text-ti-300">
        The step is under this side only. The differential averages both rockers, so the chassis pitches half as far as the rocker. Link offsets are illustrative.
      </p>
    </div>
  )
}
