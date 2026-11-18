import { useId, useState } from 'react'
import AnnotatedFigure from './AnnotatedFigure.jsx'
import { control } from '../lib/controls.js'

// One object, three views: the ParkSense stop arm as linework, as CAD, and
// working. The linework is a kinematic sketch, not a dimensioned drawing: the
// blade's proportions are traced from the CAD view and nothing is to scale.
// Servo positions (0°, 45°, 90°) are the ones the prototype sketch writes. The
// arm thresholds (45° from 70 cm, 90° below 20 cm) are the garage simulator's on this page.

const INK = '#DCE7EE'
const HUD = '#00E5FF'
const PIVOT = [70, 150]
const STOP_CM = 20
const HALF_CM = 70
// Same rule as the garage simulator above.
const armAngle = (d) => (d < STOP_CM ? 90 : d <= HALF_CM ? 45 : 0)

const tabs = [
  ['line', 'Linework'],
  ['cad', 'Annotated CAD'],
  ['live', 'Working Interpretation'],
]

// Boxes are [left, top, width, height] in percent of the CAD image.
const cad = { src: '/assets/Parksense stuff/prototype stop arm.png', alt: 'ParkSense stop-arm CAD: a flat blade with a teardrop pocket and two holes at one end' }
const features = [
  {
    id: 'pocket',
    label: 'Horn pocket',
    box: [11.5, 18.5, 18.5, 19],
    note: 'A teardrop recess at the pivot end, the shape of a single-arm servo horn. Seated in it, the arm turns with the horn and cannot spin on it.',
  },
  {
    id: 'holes',
    label: 'Fastener holes',
    box: [19, 25.5, 8.5, 10],
    note: 'Two holes inside the pocket, in line with it, for fixing the arm to the horn.',
  },
  {
    id: 'blade',
    label: 'Blade',
    box: [30, 33, 65, 60],
    note: 'A flat bar, modeled as its own part, separate from the enclosure. It is the only part the driver sees move.',
  },
]

// Arm in its 0° position: straight up from the pivot. Drawn once, rotated.
function Arm({ angle, ghost }) {
  return (
    <g
      style={{ transform: `rotate(${angle}deg)`, transformOrigin: `${PIVOT[0]}px ${PIVOT[1]}px` }}
      className={ghost ? undefined : 'motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-in-out'}
      fill={ghost ? 'none' : '#0B2231'}
      stroke={ghost ? INK : HUD}
      strokeOpacity={ghost ? 0.4 : 1}
      strokeDasharray={ghost ? '4 4' : undefined}
      strokeWidth="1.5"
    >
      <path d={`M${PIVOT[0] - 8} ${PIVOT[1] + 10}V${PIVOT[1] - 128}H${PIVOT[0] + 8}V${PIVOT[1] + 10}Z`} />
    </g>
  )
}

// Side view: SG90 body, horn pivot, arm, and the 90° sweep.
function Profile({ angle, ghosts = [] }) {
  const [px, py] = PIVOT
  return (
    <>
      <path d="M20 190H250" stroke={INK} strokeOpacity="0.3" />
      <path d={`M${px} ${py - 128}A128 128 0 0 1 ${px + 128} ${py}`} fill="none" stroke={INK} strokeOpacity="0.3" strokeDasharray="2 5" />
      {ghosts.map((deg) => (
        <Arm key={deg} angle={deg} ghost />
      ))}
      <Arm angle={angle} />
      <rect x={px - 22} y={py - 4} width="44" height="44" fill="#070C16" stroke={INK} strokeOpacity="0.8" strokeWidth="1.5" />
      <circle cx={px} cy={py} r="5" fill="#070C16" stroke={HUD} strokeWidth="1.5" />
      <g fill={INK} fillOpacity="0.7" fontSize="10" fontFamily="monospace">
        <text x={px} y={py + 56} textAnchor="middle">SG90</text>
        <text x={px + 12} y={py - 132}>0°</text>
        <text x={px + 100} y={py - 92}>45°</text>
        <text x={px + 134} y={py + 4}>90°</text>
      </g>
    </>
  )
}

function Linework() {
  return (
    <svg viewBox="0 0 460 220" role="img" aria-label="Stop arm linework: side view with the arm at 0, 45 and 90 degrees, and a face view of the blade" className="w-full border-y border-hud/15">
      <Profile angle={0} ghosts={[45, 90]} />
      {/* Face view of the blade: bar, teardrop horn pocket, two holes */}
      <g transform="translate(262 78)" fill="none" stroke={INK} strokeWidth="1.5">
        <rect width="180" height="30" />
        <path d="M22 5A10 10 0 0 0 22 25L52 19A4 4 0 0 0 52 11Z" strokeOpacity="0.8" />
        <circle cx="26" cy="15" r="2" />
        <circle cx="40" cy="15" r="2" />
        <path d="M-10 15H190" strokeWidth="0.75" strokeOpacity="0.35" strokeDasharray="12 3 2 3" />
      </g>
      <g fill={INK} fillOpacity="0.7" fontSize="10" fontFamily="monospace">
        <text x="262" y="64">FACE VIEW · BLADE</text>
        <text x="262" y="128">HORN POCKET · 2 HOLES</text>
        <text x="150" y="208">SIDE VIEW · SWEEP 0° TO 90°</text>
      </g>
    </svg>
  )
}

function Working() {
  const [distance, setDistance] = useState(60)
  const sliderId = useId()
  const angle = armAngle(distance)
  const stop = angle === 90
  // 10 to 150 cm maps to x 218 to 430: clear of the lowered arm, which ends at x 198.
  const carX = 218 + ((distance - 10) / 140) * 212

  return (
    <div data-stoparm-live>
      <svg viewBox="0 0 460 220" role="img" aria-label={`Vehicle at ${distance} centimeters. Servo at ${angle} degrees.`} className="w-full border-y border-hud/15">
        <Profile angle={angle} />
        <g style={{ transform: `translateX(${carX}px)` }} className="motion-safe:transition-transform motion-safe:duration-150">
          <path d="M0 150L8 132H34L42 150H52V176H0Z" fill="#142936" stroke={stop ? '#f87171' : angle ? '#4ade80' : '#60a5fa'} strokeWidth="1.5" />
          <circle cx="12" cy="178" r="7" fill="#05080f" stroke="#91a8b6" />
          <circle cx="40" cy="178" r="7" fill="#05080f" stroke="#91a8b6" />
        </g>
      </svg>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-3" aria-live="polite" aria-atomic="true">
        <p className="font-mono text-3xl tabular-nums text-white">
          <output htmlFor={sliderId}>{distance}</output>
          <span className="ml-2 text-sm text-ti-300">cm</span>
        </p>
        <p className="font-mono text-xs" style={{ color: stop ? '#f87171' : angle ? '#4ade80' : '#60a5fa' }} data-stoparm-angle={angle}>
          SG90 · {angle}° {stop ? 'lowered' : angle ? 'halfway' : 'retracted'}
        </p>
      </div>
      <label htmlFor={sliderId} className="mt-4 flex justify-between gap-3 font-mono text-xs text-ti-300">
        Vehicle distance <span className="text-ti-400">45° at {HALF_CM} cm · 90° below {STOP_CM} cm</span>
      </label>
      <input
        id={sliderId}
        type="range"
        min="10"
        max="150"
        step="1"
        value={distance}
        onChange={(event) => setDistance(Number(event.target.value))}
        aria-valuetext={`${distance} centimeters, arm ${angle} degrees`}
        className="mt-3 h-6 w-full cursor-pointer accent-cyan-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-400"
      />
    </div>
  )
}

const notes = {
  line: 'Kinematic sketch, not to scale. The blade outline is traced from the CAD view; no dimension is taken from a drawing.',
  live: `Simulation. The arm drops to 45° from ${HALF_CM} cm and to 90° below ${STOP_CM} cm, the thresholds of the garage simulator above.`,
}

export default function StopArmViews() {
  const [tab, setTab] = useState('line')
  const [feature, setFeature] = useState('pocket')
  const selected = features.find((item) => item.id === feature)

  return (
    <div className="min-w-0 border border-hud/25 bg-[#0B111C] p-5 sm:p-6" data-stoparm-views>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-mono text-sm text-white">Stop arm: one object, three views</h3>
        <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-ti-400">SG90 barrier arm</span>
      </div>

      <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="View of the stop arm">
        {tabs.map(([id, text], i) => (
          <button
            key={id}
            type="button"
            aria-pressed={tab === id}
            onClick={() => setTab(id)}
            className={control(tab === id)}
          >
            <span className="mr-2 text-ti-300">0{i + 1}</span>
            {text}
          </button>
        ))}
      </div>

      <div className="mt-5">
        {tab === 'line' && <Linework />}
        {tab === 'live' && <Working />}
        {tab === 'cad' && (
          <div className="grid items-start gap-x-8 gap-y-5 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
            <AnnotatedFigure
              image={cad}
              regions={features}
              selected={feature}
              onSelect={setFeature}
              caption="Stop-arm CAD • SolidWorks view"
            />
            <div className="min-w-0">
              <div className="flex flex-wrap gap-2" role="group" aria-label="Stop arm features">
                {features.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={feature === item.id}
                    onClick={() => setFeature(item.id)}
                    className={`min-h-[44px] cursor-pointer border px-3.5 font-mono text-xs transition-colors hover:border-hud focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-hud ${
                      feature === item.id ? 'border-hud bg-hud/10 text-hud' : 'border-hud/25 text-readout'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <div aria-live="polite" className="mt-5 border-l-2 border-hud/60 pl-5">
                <p className="text-lg text-white">{selected.label}</p>
                <p className="mt-2 max-w-[46ch] text-sm leading-relaxed text-ti-300">{selected.note}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {notes[tab] && (
        <p className="mt-4 text-sm leading-relaxed text-ti-300">{notes[tab]}</p>
      )}
    </div>
  )
}
