import { useId, useState } from 'react'
import { asset } from '../data/experiences.js'
import { thumbnail } from '../data/media.js'
import { control } from '../lib/controls.js'
import RockerBogie from './RockerBogie.jsx'

// Rover packaging review. A simplified side view traced from the PDR side-view
// sketch (front to the left, as drawn there): 1.5 m long, 1.8 m to the top of
// the antenna. Proportions inside that envelope are approximate. Each
// subsystem can be isolated, and the frame switches to the source drawing.
// Units: centimetres; y is drawn upward from the ground at y = 200.
const G = 200
const up = (z) => G - z
const CYAN = '#00E5FF'
const GHOST = '#3B5163'
const INK = '#DCE7EE'

const SKETCH = { src: '/assets/MCA schematic.png', alt: 'PDR concept sketch of the rover, side and top views, with dimensions' }
const NX = { src: '/assets/Shovel Arm NX.png', alt: 'Siemens NX drawing of the sampling system, two links with joint diameters and a scoop detail' }

const SUBSYSTEMS = [
  {
    id: 'suspension',
    label: 'Suspension',
    source: SKETCH,
    facts: ['Rocker-bogie, three wheels per side.', 'Rocker pivot on the body; bogie pivot at the rear carries the middle and rear wheels, as the side view shows.'],
  },
  {
    id: 'arm',
    label: 'Sampling Arm',
    source: NX,
    facts: ['Labelled "extendable scoop" in the sketch.', 'NX drawing: links of 1201.1 mm and 843.7 mm, joints Ø180 and Ø120, scoop 112.2 × 98 mm (detail A, 1:10).'],
  },
  {
    id: 'chassis',
    label: 'Chassis',
    source: SKETCH,
    facts: ['Carries the rocker pivot and the top-mounted equipment.', 'Sketch envelope: 1.5 m long, 1.8 m to the top of the antenna.'],
  },
  {
    id: 'top',
    label: 'Top-Mounted Equipment',
    source: SKETCH,
    facts: ['Solar panels, camera and high-gain antenna, as labelled in the sketch.', 'LiDAR is part of the concept (portfolio page 3) but is not drawn in this sketch, so it is not placed here.'],
  },
]

function Part({ id, active, children }) {
  const on = active === 'all' || active === id
  return (
    <g
      data-subsystem={id}
      data-active={on}
      fill={on ? (active === id ? 'rgb(0 229 255 / 0.14)' : '#0F1E2B') : 'none'}
      stroke={on ? (active === id ? CYAN : INK) : GHOST}
      strokeOpacity={on ? 1 : 0.45}
      strokeWidth={active === id ? 1.6 : 1.1}
      strokeLinejoin="round"
      className="transition-[stroke,stroke-opacity,fill] duration-300"
    >
      {children}
    </g>
  )
}

function Diagram({ active }) {
  const wheel = (x) => <circle key={x} cx={x} cy={up(14)} r="14" />
  return (
    <svg viewBox="-40 0 210 222" role="img" aria-label="Simplified rover side view with the selected subsystem highlighted" className="h-full w-full">
      <path d={`M-38 ${G}H168`} stroke={INK} strokeOpacity="0.35" />
      <Part id="chassis" active={active}>
        <path d={`M0 ${up(52)}H135V${up(76)}H0Z`} />
        <path d={`M62 ${up(76)}V${up(84)}H78V${up(76)}`} />
      </Part>
      <Part id="suspension" active={active}>
        {[14, 88, 136].map(wheel)}
        {/* Rocker: front leg, pivot on the body, rear end at the bogie pivot */}
        <path d={`M14 ${up(14)}V${up(48)}L70 ${up(64)}L112 ${up(46)}`} fill="none" strokeWidth="3" />
        {/* Bogie: diagonal to the middle wheel, leg to the rear wheel */}
        <path d={`M88 ${up(14)}L112 ${up(46)}H136V${up(14)}`} fill="none" strokeWidth="3" />
        <circle cx="70" cy={up(64)} r="3.5" />
        <circle cx="112" cy={up(46)} r="3.5" />
      </Part>
      <Part id="top" active={active}>
        <path d={`M78 ${up(77)}L128 ${up(77)}L128 ${up(84)}L82 ${up(80)}Z`} />
        <path d={`M14 ${up(76)}V${up(165)}`} fill="none" strokeWidth="2.5" />
        <path d={`M8 ${up(148)}H22V${up(156)}H8Z`} />
        <path d={`M3 ${up(172)}Q14 ${up(160)} 25 ${up(172)}`} fill="none" strokeWidth="2" />
        <path d={`M14 ${up(165)}V${up(180)}`} fill="none" />
      </Part>
      <Part id="arm" active={active}>
        <path d={`M0 ${up(68)}L-16 ${up(80)}L-24 ${up(34)}`} fill="none" strokeWidth="3" />
        <circle cx="-16" cy={up(80)} r="3" />
        <path d={`M-30 ${up(34)}H-18L-21 ${up(22)}H-30Z`} />
      </Part>
      {/* Sketch dimensions */}
      <g stroke="#91A8B6" fill="#91A8B6" fontSize="7.5" className="font-mono">
        <path d={`M0 ${G + 8}H150M0 ${G + 5}V${G + 11}M150 ${G + 5}V${G + 11}`} fill="none" strokeWidth="0.75" />
        <text x="75" y={G + 15} textAnchor="middle" stroke="none">1.5 m</text>
        <path d={`M160 ${up(0)}V${up(180)}M157 ${up(0)}H163M157 ${up(180)}H163`} fill="none" strokeWidth="0.75" />
        <text x="166" y={up(90)} stroke="none" transform={`rotate(-90 166 ${up(90)})`} textAnchor="middle">1.8 m</text>
      </g>
      <text x="-38" y="9" fill="#91A8B6" fontSize="6" letterSpacing="0.06em" className="font-mono">CONCEPTUAL · FRONT LEFT, AS IN THE SKETCH</text>
    </svg>
  )
}

// Planar reach of the two-link arm, in mm. Links from the NX drawing; the
// shoulder mounting point and joint limits are not documented, so the
// envelope is drawn about the shoulder with free rotation in one plane.
const L1 = 1201.1
const L2 = 843.7
const S = 0.068 // svg units per mm

function Reach() {
  const [shoulder, setShoulder] = useState(35)
  const [elbow, setElbow] = useState(-80)
  const reset = () => { setShoulder(35); setElbow(-80) }
  const ids = [useId(), useId()]
  const a1 = (shoulder * Math.PI) / 180
  const a2 = a1 + (elbow * Math.PI) / 180
  const e = [L1 * Math.cos(a1), L1 * Math.sin(a1)]
  const t = [e[0] + L2 * Math.cos(a2), e[1] + L2 * Math.sin(a2)]
  const P = ([x, y]) => `${(x * S).toFixed(1)} ${(-y * S).toFixed(1)}`
  const reach = Math.hypot(...t)

  return (
    <div className="min-w-0" data-reach>
      <svg viewBox="-150 -150 300 300" role="img" aria-label={`Planar reach envelope from ${(L1 - L2).toFixed(1)} to ${(L1 + L2).toFixed(1)} millimetres. Tool tip ${Math.round(reach)} millimetres from the shoulder.`} className="mx-auto block w-full max-w-[22rem]">
        <path fillRule="evenodd" d={`M${(L1 + L2) * S} 0A${(L1 + L2) * S} ${(L1 + L2) * S} 0 1 0 ${-(L1 + L2) * S} 0A${(L1 + L2) * S} ${(L1 + L2) * S} 0 1 0 ${(L1 + L2) * S} 0ZM${(L1 - L2) * S} 0A${(L1 - L2) * S} ${(L1 - L2) * S} 0 1 1 ${-(L1 - L2) * S} 0A${(L1 - L2) * S} ${(L1 - L2) * S} 0 1 1 ${(L1 - L2) * S} 0Z`} fill="rgb(0 229 255 / 0.08)" stroke={CYAN} strokeOpacity="0.5" strokeDasharray="4 3" />
        <path d={`M-145 0H145M0 -145V145`} stroke="#91A8B6" strokeOpacity="0.25" />
        <path d={`M0 0L${P(e)}L${P(t)}`} fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <circle r={(180 / 2) * S * 1.6} cx={e[0] * S} cy={-e[1] * S} fill="#0B111C" stroke={CYAN} strokeWidth="1.5" />
        <circle r={(120 / 2) * S * 1.6} fill="#0B111C" stroke={CYAN} strokeWidth="1.5" />
        <circle cx={t[0] * S} cy={-t[1] * S} r="3" fill="#F87171" />
        <g fill="#91A8B6" fontSize="8" className="font-mono">
          <text x="4" y="-4">SHOULDER Ø120</text>
          <text x={e[0] * S + 8} y={-e[1] * S - 6}>ELBOW Ø180</text>
          <text x={(L1 + L2) * S * 0.71 + 2} y={-(L1 + L2) * S * 0.71 - 2}>{(L1 + L2).toFixed(1)} mm</text>
          <text x="4" y={-(L1 - L2) * S - 3}>{(L1 - L2).toFixed(1)}</text>
        </g>
      </svg>
      {[
        [ids[0], 'Shoulder', shoulder, setShoulder, -180, 180],
        [ids[1], 'Elbow', elbow, setElbow, -180, 180],
      ].map(([id, name, value, set, min, max]) => (
        <div key={name} className="mt-2">
          <label htmlFor={id} className="flex justify-between font-mono text-[11px] text-ti-300">
            {name} angle (°) <output htmlFor={id} className="tabular-nums text-white">{value}°</output>
          </label>
          <input id={id} type="range" min={min} max={max} value={value} onChange={(ev) => set(Number(ev.target.value))} className="h-11 w-full cursor-pointer accent-cyan-400 md:h-6" />
        </div>
      ))}
      <div className="mt-2 flex justify-end">
        <button type="button" onClick={reset} disabled={shoulder === 35 && elbow === -80} className={control()}>Reset</button>
      </div>
      <p className="mt-2 font-mono text-[11px] text-white" aria-live="polite" data-reach-tip>
        Tool tip: {Math.round(t[0])}, {Math.round(t[1])} mm · {Math.round(reach)} mm from the shoulder
      </p>
      <p className="mt-1 text-sm leading-relaxed text-ti-300">
        Links of {L1} mm and {L2} mm from the NX drawing. The drawings do not give the shoulder's mounting point or the joint limits, so the envelope assumes free rotation in one plane about the shoulder: an annulus from {(L1 - L2).toFixed(1)} to {(L1 + L2).toFixed(1)} mm.
      </p>
    </div>
  )
}

export default function RoverPackaging() {
  const [active, setActive] = useState('all')
  const [source, setSource] = useState(false)
  const item = SUBSYSTEMS.find((s) => s.id === active)
  const shown = item?.source ?? SKETCH
  const btn = control

  return (
    <section className="mb-8 border border-hud/25 bg-[#0B111C] p-4 sm:p-5" aria-labelledby="packaging-review-heading" data-rover-packaging>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 id="packaging-review-heading" className="text-xl text-white">Subsystem packaging review</h3>
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ti-400">Conceptual Geometry · Derived from PDR Drawings</p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Isolate subsystem">
        <button type="button" aria-pressed={active === 'all'} onClick={() => setActive('all')} className={btn(active === 'all')}>
          All
        </button>
        {SUBSYSTEMS.map((s) => (
          <button key={s.id} type="button" aria-pressed={active === s.id} onClick={() => setActive(s.id)} className={btn(active === s.id)}>
            {s.label}
          </button>
        ))}
        <button type="button" aria-pressed={source} onClick={() => setSource((v) => !v)} className={`${btn(source)} sm:ml-auto`}>
          {source ? 'Show conceptual view' : 'Show source drawing'}
        </button>
      </div>

      <div className="mt-4 grid items-start gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="min-w-0">
          {/* One frame for both, so the switch keeps the same size and place */}
          <div className="aspect-[210/222] w-full border border-white/10 bg-obsidian" data-frame={source ? 'source' : 'conceptual'}>
            {source ? (
              <img src={asset(thumbnail(shown.src))} alt={shown.alt} className="h-full w-full bg-[#F4F6F8] object-contain p-1" />
            ) : (
              <Diagram active={active} />
            )}
          </div>
          <p className="mt-2 font-mono text-[11px] text-ti-300">
            {source ? `Source: ${shown === NX ? 'Siemens NX sampling-system drawing' : 'PDR side and top view sketch'}.` : 'Simplified from the side-view sketch. Proportions inside the 1.5 × 1.8 m envelope are approximate.'}{' '}
            <a href={asset(shown.src)} target="_blank" rel="noreferrer" className="text-hud underline underline-offset-4">
              Open original ↗
            </a>
          </p>
          <div className="mt-3 border-l-2 border-hud/60 pl-4" aria-live="polite">
            <p className="text-white">{item ? item.label : 'Whole rover'}</p>
            <ul className="mt-1 space-y-1 text-[13px] leading-relaxed text-ti-300">
              {(item ? item.facts : ['Select a subsystem to isolate it; the others drop to outline.']).map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
        </div>
        {/* One linkage model at a time: the suspension step climb when Suspension
            is isolated, otherwise the sampling-arm reach. */}
        <div className="min-w-0">
          {active === 'suspension' ? (
            <>
              <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.14em] text-ti-400">Suspension · step climb <span className="text-amber-200">· conceptual model</span></p>
              <RockerBogie />
            </>
          ) : (
            <>
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ti-400">Sampling arm · planar reach <span className="text-amber-200">· conceptual model</span></p>
              <Reach />
            </>
          )}
        </div>
      </div>
    </section>
  )
}
