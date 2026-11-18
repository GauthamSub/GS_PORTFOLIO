import { useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router'
import { asset } from '../data/experiences.js'
import { thumbnail } from '../data/media.js'
import { control } from '../lib/controls.js'

// Compact working models shown in the gear-hub readout when a tooth is pinned.
// Each is driven by the visitor (slider, drag, or a button). Only the ParkSense
// trace plays on its own, and under reduced motion it shows its final frame.

const CYAN = '#00E5FF'
const INK = '#DCE7EE'
const DIM = '#91A8B6'
const RED = '#F87171'
const GREEN = '#4ADE80'

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

const panel = 'mt-4 border-t border-hud/20 pt-4'
const tag = 'font-mono text-[11px] uppercase tracking-[0.18em]'
const toggle = control
const deep = 'inline-flex min-h-[44px] items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-hud underline decoration-hud/40 underline-offset-[5px] hover:decoration-hud lg:min-h-[36px]'
// 44 px tall on touch screens, 24 px with a mouse.
const range = 'h-11 lg:h-6 w-full cursor-pointer accent-cyan-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-400'

// Horizontal drag on an SVG, in viewBox units per pixel. Calls onDelta(dx).
function useDrag(onDelta) {
  const last = useRef(null)
  return {
    onPointerDown: (event) => {
      last.current = event.clientX
      event.currentTarget.setPointerCapture(event.pointerId)
    },
    onPointerMove: (event) => {
      if (last.current === null) return
      const svg = event.currentTarget
      const scale = svg.viewBox.baseVal.width / svg.getBoundingClientRect().width
      onDelta((event.clientX - last.current) * scale)
      last.current = event.clientX
    },
    onPointerUp: () => {
      last.current = null
    },
    onPointerCancel: () => {
      last.current = null
    },
  }
}

/* ------------------------------------------------------------------ NASA */

// Rocker-bogie on one side, after the side-view concept sketch: the rocker
// carries the front wheel and, at its rear end, the bogie pivot; the bogie
// carries the middle and rear wheels. Units are centimetres, rover facing
// right. Sketch values: 1.5 m wheelbase, 0.2 m wheels. Link offsets are
// illustrative.
//
// Model: wheel centres follow the terrain (a step under this side only, the far
// side on flat ground); the bogie and rocker are rigid links solved from them
// with small horizontal shifts ignored. The differential sets chassis pitch to
// the mean of the two rocker angles: here half of this side's.
const R = 10 // wheel radius
const STEP_H = 14 // step height, under one wheel diameter
const STEP_X = 260 // step edge, world x
const X = { rear: 0, mid: 55, front: 150 }
const BOGIE_PIVOT = [27.5, 30] // from the rear wheel centre, at rest
const ROCKER = { pivot: [57.5, 22], knee: [122.5, 0], front: [122.5, -30] } // from the bogie pivot, at rest
const TRAVEL = [STEP_X - X.front - 35, STEP_X - X.rear + 30] // rover offset at 0 % and 100 %

const ground = (x) => {
  const u = Math.min(Math.max((x - (STEP_X - R)) / R, 0), 1)
  return (STEP_H * (1 - Math.cos(Math.PI * u))) / 2
}
const rot = ([x, y], a) => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)]
const add = (a, b) => [a[0] + b[0], a[1] + b[1]]

function solve(t) {
  const d = TRAVEL[0] + (TRAVEL[1] - TRAVEL[0]) * t
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

const deg = (a) => (a * 180) / Math.PI

function RockerBogie() {
  const [t, setT] = useState(0.35)
  const [source, setSource] = useState(false)
  const id = useId()
  const s = solve(t)
  const drag = useDrag((dx) => setT((v) => Math.min(Math.max(v + dx / (TRAVEL[1] - TRAVEL[0]), 0), 1)))

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
    <div className={panel} data-pinned-lab="nasa">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className={`${tag} text-ti-400`}>Conceptual motion illustration · derived from PDR concept sketch</p>
        <button type="button" aria-pressed={source} onClick={() => setSource((v) => !v)} className={toggle(source)}>
          View Source Drawing
        </button>
      </div>

      {/* Same frame for both views, so the toggle swaps one for the other in place */}
      <div className="mt-3 aspect-[2/1] w-full border border-white/10 bg-obsidian">
        {source ? (
          <img
            src={asset(thumbnail('/assets/nasa/suspension-annotated.png'))}
            alt="Annotated side-view concept sketch of the rover's rocker-bogie suspension"
            className="h-full w-full bg-[#0B111C] object-contain"
          />
        ) : (
          <svg
            viewBox="-130 -100 260 130"
            role="img"
            aria-label={`Rover ${Math.round(t * 100)} percent across a ${STEP_H} centimetre step. Rocker ${deg(s.rocker).toFixed(1)} degrees, chassis ${deg(s.pitch).toFixed(1)} degrees.`}
            className="h-full w-full cursor-ew-resize touch-none select-none"
            {...drag}
          >
            <path d={`${terrain}V30H-130Z`} fill="#0B2231" stroke={DIM} strokeWidth="0.8" />
            {/* Chassis, rotated by half the rocker angle */}
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
        )}
      </div>

      {!source && (
        <>
          <label htmlFor={id} className="mt-3 flex justify-between font-mono text-[11px] text-ti-300">
            Step traversal <output htmlFor={id} className="tabular-nums text-white">{Math.round(t * 100)} %</output>
          </label>
          <input
            id={id}
            type="range"
            min="0"
            max="100"
            value={Math.round(t * 100)}
            onChange={(event) => setT(Number(event.target.value) / 100)}
            aria-valuetext={`${Math.round(t * 100)} percent across the step`}
            className={range}
          />
          <dl className="mt-2 grid grid-cols-3 gap-2 font-mono text-[11px]" aria-live="polite">
            {[
              ['Lift F/M/R', `${lift(s.front)}/${lift(s.mid)}/${lift(s.rear)} cm`],
              ['Rocker', `${deg(s.rocker).toFixed(1)}°`],
              ['Chassis', `${deg(s.pitch).toFixed(1)}°`],
            ].map(([k, v]) => (
              <div key={k} className="border border-hud/20 px-2 py-1.5">
                <dt className="text-ti-400">{k}</dt>
                <dd className="tabular-nums text-white">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-2 text-[12px] leading-snug text-ti-400">
            The step is under this side only. The differential averages both rockers, so the chassis pitches half as far as the rocker.
          </p>
        </>
      )}
      <Link to="/project/nasa" className={`${deep} mt-1`}>
        Rover subsystems on the NASA page <span aria-hidden="true">→</span>
      </Link>
    </div>
  )
}

/* --------------------------------------------------------------- GearLab */

// Rotating-beam section. The bending moment is fixed in space while the
// specimen turns, so a point on the surface at angle θ from the top sees
// σ = σa·cos θ: peak tension at the top, zero on the neutral axis, peak
// compression at the bottom. One revolution is one fully reversed cycle.
function BeamSection() {
  const [theta, setTheta] = useState(40)
  const [chart, setChart] = useState(false)
  const id = useId()
  const svgRef = useRef(null)
  const dragging = useRef(false)
  const a = (theta * Math.PI) / 180
  const sigma = Math.cos(a)
  const marker = [44 * Math.sin(a), -44 * Math.cos(a)]

  const fromPointer = (event) => {
    const box = svgRef.current.getBoundingClientRect()
    // Section centre sits at viewBox (60, 60) of a 240 x 120 box.
    const x = event.clientX - box.left - (60 / 240) * box.width
    const y = event.clientY - box.top - (60 / 120) * box.height
    setTheta(Math.round(((Math.atan2(x, -y) * 180) / Math.PI + 360) % 360))
  }

  const trace = Array.from({ length: 73 }, (_, n) => `${n ? 'L' : 'M'}${(130 + n * (100 / 72)).toFixed(1)} ${(60 - 34 * Math.cos((n * 5 * Math.PI) / 180)).toFixed(1)}`).join('')
  const state = Math.abs(sigma) < 0.05 ? 'neutral axis' : sigma > 0 ? 'tension' : 'compression'

  return (
    <div className={panel} data-pinned-lab="gearlab">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className={`${tag} text-ti-400`}>Rotating-beam section · R = −1</p>
        <button type="button" aria-pressed={chart} onClick={() => setChart((v) => !v)} className={toggle(chart)}>
          View S–N Plot
        </button>
      </div>

      <div className="mt-3 aspect-[2/1] w-full border border-white/10 bg-obsidian">
        {chart ? (
          <figure className="flex h-full flex-col">
            <img
              src={asset(thumbnail('/assets/gearlab/sn-figure.png'))}
              alt="S-N chart of the rotating beam fatigue tests with failures, runouts at ten million cycles, and the experimental fit"
              className="min-h-0 flex-1 bg-[#F4F6F8] object-contain p-1"
            />
            <figcaption className="px-2 py-1 font-mono text-[11px] text-ti-400">14 rotating-beam tests · runouts at 10⁷ cycles · 6061-T6</figcaption>
          </figure>
        ) : (
          <svg
            ref={svgRef}
            viewBox="0 0 240 120"
            role="img"
            aria-label={`Surface point at ${theta} degrees: ${state}, sigma ${sigma.toFixed(2)} times sigma a.`}
            className="h-full w-full touch-none select-none"
            onPointerDown={(event) => {
              dragging.current = true
              event.currentTarget.setPointerCapture(event.pointerId)
              fromPointer(event)
            }}
            onPointerMove={(event) => dragging.current && fromPointer(event)}
            onPointerUp={() => (dragging.current = false)}
            onPointerCancel={() => (dragging.current = false)}
          >
            <defs>
              <linearGradient id="beam-stress" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor={RED} stopOpacity="0.55" />
                <stop offset="0.5" stopColor={RED} stopOpacity="0" />
                <stop offset="0.5" stopColor={CYAN} stopOpacity="0" />
                <stop offset="1" stopColor={CYAN} stopOpacity="0.55" />
              </linearGradient>
            </defs>
            {/* Section: tension above the neutral axis, compression below */}
            <circle cx="60" cy="60" r="44" fill="url(#beam-stress)" stroke={INK} strokeWidth="1.2" />
            <path d="M8 60H112" stroke={INK} strokeOpacity="0.5" strokeDasharray="6 3 1.5 3" strokeWidth="0.8" />
            <text x="114" y="58" fill={DIM} fontSize="7" className="font-mono">N.A.</text>
            <text x="60" y="10" textAnchor="middle" fill={RED} fontSize="8" className="font-mono">+σ TENSION</text>
            <text x="60" y="116" textAnchor="middle" fill={CYAN} fontSize="8" className="font-mono">−σ COMPRESSION</text>
            {/* Marker and its radius */}
            <path d={`M60 60L${60 + marker[0]} ${60 + marker[1]}`} stroke="#FFFFFF" strokeOpacity="0.5" strokeWidth="0.8" />
            <circle cx={60 + marker[0]} cy={60 + marker[1]} r="5" fill="#FFFFFF" stroke="#05080F" strokeWidth="1.5" className="cursor-grab" />
            {/* Stress at the marker over one revolution */}
            <path d="M130 26V94M130 60H230" stroke={DIM} strokeWidth="0.6" />
            <path d={trace} fill="none" stroke={INK} strokeWidth="1.2" />
            <circle cx={130 + (theta / 360) * 100} cy={60 - 34 * sigma} r="3.5" fill="#FFFFFF" stroke="#05080F" strokeWidth="1" />
            <text x="126" y="29" textAnchor="end" fill={RED} fontSize="8" className="font-mono">+σ</text>
            <text x="126" y="96" textAnchor="end" fill={CYAN} fontSize="8" className="font-mono">−σ</text>
            <text x="230" y="108" textAnchor="end" fill={DIM} fontSize="7" className="font-mono">θ 0° → 360° · ONE CYCLE</text>
          </svg>
        )}
      </div>

      {!chart && (
        <>
          <label htmlFor={id} className="mt-3 flex justify-between font-mono text-[11px] text-ti-300">
            Point angle from top <output htmlFor={id} className="tabular-nums text-white">{theta}°</output>
          </label>
          <input id={id} type="range" min="0" max="359" value={theta} onChange={(event) => setTheta(Number(event.target.value))} aria-valuetext={`${theta} degrees, ${state}`} className={range} />
          <p className="mt-1 font-mono text-[12px] text-white" aria-live="polite" data-beam-sigma={sigma.toFixed(2)}>
            σ / σa = cos θ = <span className="tabular-nums" style={{ color: Math.abs(sigma) < 0.05 ? INK : sigma > 0 ? RED : CYAN }}>{sigma >= 0 ? '+' : '−'}{Math.abs(sigma).toFixed(2)}</span>
            <span className="ml-2 text-ti-400">{state}</span>
          </p>
        </>
      )}
      <Link to="/project/gearlab#sn-plot" className={`${deep} mt-1`}>
        Full S–N plot on the GearLab page <span aria-hidden="true">→</span>
      </Link>
    </div>
  )
}

/* ------------------------------------------------------------- ParkSense */

// One missed echo, two firmware versions, the same keypad press. Times from the
// prototype report: the original sketch froze for a full second (pulseIn's
// default timeout) and the keypad stopped responding; the fix bounds the wait
// at 30 ms, after which loop() polls the keypad again. Simulated, not measured.
const SPAN = 1100 // ms shown
const PRESS = 200 // keypad press arrives
const PLAY = 2.2 // playback slowed by this factor

function EchoSplit() {
  const [clock, setClock] = useState(null) // simulated ms, null before the first run
  const [run, setRun] = useState(0)

  useEffect(() => {
    if (!run) return undefined
    if (reducedMotion()) {
      setClock(SPAN)
      return undefined
    }
    let frame
    const start = performance.now()
    const tick = (now) => {
      // The first frame's timestamp can predate `start`, so clamp at zero.
      const t = Math.min(Math.max((now - start) / PLAY, 0), SPAN)
      setClock(t)
      if (t < SPAN) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [run])

  const t = clock ?? 0
  const x = (ms) => 8 + (ms / SPAN) * 224
  const tracks = [
    { id: 'a', name: 'A · original', note: 'pulseIn(echo, HIGH)', wait: 1000, color: RED },
    { id: 'b', name: 'B · bounded', note: 'pulseIn(echo, HIGH, 30000UL)', wait: 30, color: GREEN },
  ]
  // Track A reads the key only when the loop returns (if the press is still held);
  // track B on the next pass after the press.
  const readAt = { a: 1000, b: PRESS }

  return (
    <div className={panel} data-pinned-lab="parksense">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className={`${tag} text-ti-400`}>Simulated timing trace · one missed echo</p>
        <button type="button" onClick={() => setRun((n) => n + 1)} className={toggle(clock !== null && clock < SPAN)}>
          Miss an Echo
        </button>
      </div>

      <svg viewBox="0 0 240 118" role="img" aria-label="Two timelines after a missed echo. Original firmware blocks for 1000 milliseconds and misses a keypad press at 200 milliseconds. Bounded firmware waits 30 milliseconds and reads the press at 200 milliseconds." className="mt-3 w-full border border-white/10 bg-obsidian">
        {tracks.map((track, i) => {
          const y = 22 + i * 44
          const waitEnd = Math.min(t, track.wait)
          const keyRead = t >= readAt[track.id]
          return (
            <g key={track.id} data-track={track.id}>
              <text x="8" y={y - 9} fill={INK} fontSize="8" className="font-mono">{track.name}</text>
              <text x="232" y={y - 9} textAnchor="end" fill={DIM} fontSize="7" className="font-mono">{track.note}</text>
              <rect x="8" y={y - 4} width="224" height="16" fill="#0B111C" stroke={DIM} strokeOpacity="0.4" strokeWidth="0.5" />
              {/* Blocked span: the loop is stuck in pulseIn */}
              {clock !== null && <rect x="8" y={y - 4} width={x(waitEnd) - 8} height="16" fill={track.color} fillOpacity="0.28" />}
              {/* Loop passes after the wait: ticks every 40 ms */}
              {clock !== null &&
                Array.from({ length: 28 }, (_, n) => track.wait + n * 40)
                  .filter((ms) => ms < t && ms < SPAN)
                  .map((ms) => <path key={ms} d={`M${x(ms)} ${y - 2}V${y + 10}`} stroke={GREEN} strokeOpacity="0.55" strokeWidth="0.8" />)}
              {/* Keypad press */}
              {t >= PRESS && (
                <g>
                  <path d={`M${x(PRESS)} ${y - 6}V${y + 14}`} stroke="#FFFFFF" strokeWidth="1" />
                  <circle cx={x(PRESS)} cy={y + 4} r="3" fill={track.id === 'b' ? '#FFFFFF' : '#05080F'} stroke="#FFFFFF" className={track.id === 'b' && keyRead ? 'key-flash' : undefined} />
                </g>
              )}
              <text x={track.id === 'a' ? 8 : x(track.wait) + 3} y={y + 22} fill={track.color} fontSize="7" className="font-mono">
                {clock === null ? '' : track.id === 'a' ? (t < 1000 ? 'LOOP FROZEN · KEY NOT READ' : 'RETURNS AT ~1,000 MS · SHORT PRESS LOST') : t >= PRESS ? 'ABORT AT 30 MS · KEY READ AT 200 MS' : 'ABORT AT 30 MS · LOOP RUNNING'}
              </text>
            </g>
          )
        })}
        {/* Time axis and playhead */}
        <path d="M8 108H232" stroke={DIM} strokeWidth="0.5" />
        {[0, 200, 400, 600, 800, 1000].map((ms) => (
          <text key={ms} x={x(ms)} y="116" textAnchor="middle" fill={DIM} fontSize="6.5" className="font-mono">{ms}</text>
        ))}
        {clock !== null && <path d={`M${x(t)} 8V108`} stroke={CYAN} strokeWidth="0.8" />}
      </svg>
      <p className="mt-2 text-[12px] leading-snug text-ti-400">
        {clock === null ? 'Press Miss an Echo: the sensor fires into an empty bay and a key is pressed 200 ms later.' : 'Times from the prototype report; the trace is a simulation, played 2.2× slower.'}
      </p>
      <Link to="/project/parksense#timeout-demo" className={`${deep} mt-1`}>
        Full garage simulator <span aria-hidden="true">→</span>
      </Link>
    </div>
  )
}

export const pinnedLabs = { nasa: RockerBogie, gearlab: BeamSection, parksense: EchoSplit }
