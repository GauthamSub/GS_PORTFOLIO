import { useRef, useState } from 'react'
import { Link } from 'react-router'
import { useInView } from 'framer-motion'

// Hero figure: a rotating-beam fatigue rig, drawn after the RBF200 layout in
// the GearLab presentation (spindle, collet and nut, specimen, load bearing).
// Schematic, not to scale. All automatic motion is CSS (see `.rig-*` in
// index.css) and plays in beats: 1 the collets clamp while one specular sweep
// machines the hatched specimen into satin metal, 2 the shaft turns and one
// reflection rolls over it, 3 the stress trace starts drawing. The base styles
// are a finished still of the same rig, so reduced motion needs no extra code.
//
// The degree ring is a jog wheel: drag it, or focus it and use the arrow keys,
// to set the shaft angle by hand. That pauses the loop (`.rig-manual`) and
// drives the same parts from CSS variables, so the witness mark, the
// reflection, the revolution dial, and the trace pen stay in step. Replay
// restarts the whole sequence.

const INK = '#14171C'
const PAPER = '#FAFBFD'
const LASER = '#E0313B'

// Stepped hourglass specimen: Ø44 shanks, a short Ø34 step, Ø18 waist.
const SPECIMEN =
  'M-150 -22H-66L-60 -17H-52C-30 -17 -22 -9 0 -9C22 -9 30 -17 52 -17H60L66 -22H150V22H66L60 17H52' +
  'C30 17 22 9 0 9C-22 9 -30 17 -52 17H-60L-66 22H-150Z'
// Left grip, clamped: bearing block, spindle, knurled collet nut, tapered nose.
// The right grip is the same drawing mirrored.
const BLOCK = 'M-292 -52H-246V52H-292Z'
const SPINDLE = 'M-246 -18H-232V18H-246Z'
const COLLET = 'M-232 -40H-150L-104 -26V26L-150 40H-232Z'
const KNURL = Array.from({ length: 9 }, (_, n) => `M${-224 + n * 8} -40V40`).join('')
const SLITS = 'M-150 -14L-104 -9M-150 14L-104 9M-150 -40V40'

// One generator of the specimen surface: the line a scribe would leave along
// its length. This is the top silhouette. Seen from the side, a generator at
// angle θ from the top sits at y = -r(x)·cos θ, so turning the shaft is a
// vertical scale of this one path by cos θ (see `rig-reflect`).
const GENERATOR = 'M-150 -22H-66L-60 -17H-52C-30 -17 -22 -9 0 -9C22 -9 30 -17 52 -17H60L66 -22H150'
// The witness mark: a short, brighter stretch of that line on the right shank,
// directly above the pen of the stress trace.
const MARK_X = 85
const WITNESS = `M${MARK_X - 13} -22H${MARK_X + 13}`

// Stress trace: bending stress at the witness mark. The pen sits at x = 150 and
// the trace slides left one wavelength (75) per revolution, like a strip chart.
// Top of the shaft is peak tension, so the trace is -26·cos, in phase with the
// mark's height. Drawn a wavelength wide of the window so it loops.
const PEN = 150
const WAVE = Array.from({ length: 61 }, (_, n) => {
  const x = -75 + n * 5
  return `${n ? 'L' : 'M'}${x} ${(-26 * Math.cos((2 * Math.PI * (x - PEN)) / 75)).toFixed(2)}`
}).join('')

// Laser profile scan: the measured radius r(x) is the generator itself, so the
// plot is the same path flipped and scaled under the specimen (r = 0 at y 176).
const PLOT_Y = 176
const PLOT_SCALE = 2.2

const RING_R = 322
const label = { fontSize: 14, letterSpacing: '0.06em', fontWeight: 500, fill: '#475569', className: 'font-mono' }
const degrees = Array.from({ length: 72 }, (_, index) => index * 5)
const beats = ['Clamp & finish', 'Rotate', 'Stress cycle']
const modes = [
  ['cycle', 'Bending Cycle'],
  ['scan', 'Laser Profile Scan'],
]

function Grip() {
  return (
    <>
      <g fill={PAPER} stroke={INK} strokeWidth="1.5" strokeLinejoin="round">
        <path d={BLOCK} />
        <path d={SPINDLE} />
        <path d={COLLET} />
      </g>
      <g className="rig-metal">
        <path d={`${BLOCK}${SPINDLE}${COLLET}`} fill="url(#rig-steel)" />
        <path d={`${BLOCK}${SPINDLE}${COLLET}`} fill="none" stroke={INK} strokeWidth="1.5" strokeLinejoin="round" />
      </g>
      <path d={KNURL} stroke={INK} strokeWidth="0.75" strokeOpacity="0.45" />
      <path d={SLITS} stroke={INK} strokeWidth="1" strokeOpacity="0.7" fill="none" />
      <path d="M-282 -40V40M-256 -40V40" stroke={INK} strokeWidth="0.75" strokeOpacity="0.4" />
    </>
  )
}

const KEY_STEP = { ArrowRight: 5, ArrowUp: 5, ArrowLeft: -5, ArrowDown: -5 }

export default function FatigueRigHero() {
  const [angle, setAngle] = useState(null) // null: automatic loop
  const [mode, setMode] = useState('cycle')
  const [run, setRun] = useState(0) // bumps to replay the sequence
  const svgRef = useRef(null)
  const dragging = useRef(false)
  const figureRef = useRef(null)
  // CSS loops stop while the rig is offscreen (.rig-offscreen in index.css).
  const onScreen = useInView(figureRef)

  const manual = angle !== null
  const a = ((angle ?? 0) * Math.PI) / 180
  const vars = manual
    ? {
        '--rig-cos': Math.cos(a).toFixed(4),
        '--rig-front': angle <= 180 ? 1 : 0,
        '--rig-turn': (angle / 360).toFixed(4),
        '--rig-marks': `${(((angle % 90) / 90) * 22).toFixed(2)}px`,
      }
    : undefined

  // Pointer position to a ring angle: 0° at the top, clockwise.
  const angleAt = (event) => {
    const svg = svgRef.current
    const p = new DOMPoint(event.clientX, event.clientY).matrixTransform(svg.getScreenCTM().inverse())
    return Math.round((Math.atan2(p.x, -p.y) * 180) / Math.PI + 360) % 360
  }
  const ring = {
    onPointerDown: (event) => {
      dragging.current = true
      event.currentTarget.setPointerCapture(event.pointerId)
      setAngle(angleAt(event))
    },
    onPointerMove: (event) => dragging.current && setAngle(angleAt(event)),
    onPointerUp: () => (dragging.current = false),
    onPointerCancel: () => (dragging.current = false),
    onKeyDown: (event) => {
      const step = KEY_STEP[event.key]
      if (step === undefined && event.key !== 'Home') return
      event.preventDefault()
      setAngle((value) => (event.key === 'Home' ? 0 : ((value ?? 60) + step * (event.shiftKey ? 3 : 1) + 360) % 360))
    },
  }

  const replay = () => {
    setAngle(null)
    setRun((n) => n + 1)
  }

  return (
    // `rig` carries the shared timing; `rig-manual` hands the parts to the jog wheel.
    <figure ref={figureRef} className={`rig relative ml-auto w-full max-w-[740px] ${manual ? 'rig-manual' : ''} ${onScreen ? '' : 'rig-offscreen'}`} style={vars} data-rig-mode={mode}>
      {/* Drawing and caption share one box, so the caption sits over the drawing's
          foot and the controls below can never cover the ring. */}
      <div className="relative">
      <svg
        key={run}
        ref={svgRef}
        viewBox="-390 -360 780 720"
        role="img"
        aria-label="Rotating beam fatigue rig: two collets clamp an hourglass specimen that spins under a bending load, with a sine trace of the stress cycle"
        className="block w-full select-none"
      >
        <defs>
          {/* Satin aluminium. Kept matte so the one rolling reflection is the brightest thing on it */}
          <linearGradient id="rig-al" gradientUnits="userSpaceOnUse" x1="0" y1="-22" x2="0" y2="22">
            <stop offset="0" stopColor="#6B7682" />
            <stop offset="0.2" stopColor="#A9B3BE" />
            <stop offset="0.38" stopColor="#C2CAD3" />
            <stop offset="0.62" stopColor="#99A4B0" />
            <stop offset="1" stopColor="#5E6873" />
          </linearGradient>
          <linearGradient id="rig-steel" gradientUnits="userSpaceOnUse" x1="0" y1="-52" x2="0" y2="52">
            <stop offset="0" stopColor="#2B333D" />
            <stop offset="0.26" stopColor="#7C8794" />
            <stop offset="0.4" stopColor="#C3CBD4" />
            <stop offset="0.66" stopColor="#6A7480" />
            <stop offset="1" stopColor="#262D36" />
          </linearGradient>
          {/* Finish sweep: a narrow vertical band of light */}
          <linearGradient id="rig-sheen" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
          {/* Section hatching: 45°, as a cut face on a drawing */}
          <pattern id="rig-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="7" height="7" fill={PAPER} />
            <path d="M0 0V7" stroke={INK} strokeOpacity="0.55" strokeWidth="1" />
          </pattern>
          <clipPath id="rig-window">
            <rect x="0" y="-34" width={PEN} height="68" />
          </clipPath>
          {/* The laser only ever travels the specimen's length */}
          <clipPath id="rig-scan-span">
            <rect x="-151" y="-60" width="302" height="260" />
          </clipPath>
          <clipPath id="rig-specimen">
            <path d={SPECIMEN} />
          </clipPath>
        </defs>

        {/* Degree ring: also the jog wheel. The wide transparent stroke is the grab area. */}
        <g
          data-calibration-ring
          role="slider"
          tabIndex={0}
          aria-label="Shaft angle. Drag the ring or use the arrow keys."
          aria-valuemin={0}
          aria-valuemax={359}
          aria-valuenow={angle ?? undefined}
          aria-valuetext={manual ? `${angle} degrees` : 'Rotating automatically'}
          className="rig-ring cursor-grab outline-none active:cursor-grabbing"
          {...ring}
        >
          <circle r={RING_R} fill="none" stroke="transparent" strokeWidth="44" pointerEvents="stroke" />
          <circle className="rig-ring-line" r={RING_R} fill="none" stroke="rgba(100, 116, 139, 0.30)" strokeWidth=".8" vectorEffect="non-scaling-stroke" />
          {degrees.map((degree) => <path key={degree} d={`M0 -${RING_R}V${-RING_R - (degree % 30 === 0 ? 13 : degree % 15 === 0 ? 8 : 4)}`} transform={`rotate(${degree})`} stroke="rgba(100, 116, 139, 0.30)" strokeWidth={degree % 30 === 0 ? 1 : .75} vectorEffect="non-scaling-stroke" pointerEvents="none" />)}
          {degrees.filter(degree => degree % 30 === 0).map(degree => {
            const angle = (degree - 90) * Math.PI / 180
            return <text key={degree} x={350 * Math.cos(angle)} y={350 * Math.sin(angle)} textAnchor="middle" dominantBaseline="central" fontSize="13" letterSpacing=".08em" fill="#64748B" fillOpacity=".6" className="rig-minor font-mono" pointerEvents="none">{String(degree).padStart(3, '0')}</text>
          })}
          {/* Index: where the witness mark is. Follows the loop, or the jog wheel. */}
          <g className="rig-index" pointerEvents="none">
            <path d={`M0 ${-RING_R + 2}L-7 ${-RING_R + 15}H7Z`} fill={INK} />
            <path d={`M0 ${-RING_R - 2}V${-RING_R - 20}`} stroke={INK} strokeWidth="2" />
          </g>
        </g>

        {/* Specimen: section hatching first; the finish sweep machines it into satin metal */}
        <path d={SPECIMEN} fill="url(#rig-hatch)" stroke={INK} strokeWidth="1.5" strokeLinejoin="round" />
        <g className="rig-finish rig-specimen">
          <path d={SPECIMEN} fill="url(#rig-al)" />
          <g clipPath="url(#rig-specimen)">
            {/* Beat 2: one reflection rolls from the top edge to the bottom edge
                over half a turn, then passes behind for the other half */}
            <g className="rig-reflect" fill="none" strokeLinecap="round">
              <path d={GENERATOR} stroke="#FFFFFF" strokeOpacity="0.45" strokeWidth="11" vectorEffect="non-scaling-stroke" />
              <path d={GENERATOR} stroke="#FFFFFF" strokeWidth="3.5" vectorEffect="non-scaling-stroke" />
              <path d={WITNESS} stroke={INK} strokeOpacity="0.55" strokeWidth="8" vectorEffect="non-scaling-stroke" />
              <path d={WITNESS} stroke="#FFFFFF" strokeWidth="5" vectorEffect="non-scaling-stroke" />
            </g>
          </g>
          <path d={SPECIMEN} fill="none" stroke={INK} strokeWidth="1.5" strokeLinejoin="round" />
        </g>
        {/* The sweep front: a bright band that crosses the specimen once */}
        <g clipPath="url(#rig-specimen)" pointerEvents="none">
          <rect className="rig-sheen" x="-159" y="-30" width="18" height="60" fill="url(#rig-sheen)" />
        </g>

        <g className="rig-grip-l">
          <Grip />
        </g>
        <g className="rig-grip-r">
          <g transform="scale(-1 1)">
            <Grip />
          </g>
          {/* Load arm: the bending load hangs from the free bearing */}
          <path d="M269 52V104M263 96L269 106L275 96" fill="none" stroke={INK} strokeWidth="1.5" />
        </g>

        <path d="M-300 0H300" fill="none" stroke="#94A3B8" strokeOpacity="0.45" strokeWidth="0.75" strokeDasharray="4 4" aria-hidden="true" />
        <g aria-hidden="true">
          <path d="M-190 -44V-74M0 -13V-74M190 -44V-74" fill="none" stroke={INK} strokeWidth=".75" strokeOpacity=".45" />
          <text x="-190" y="-82" textAnchor="middle" {...label} className="rig-minor font-mono">COLLET &amp; NUT</text>
          <text x="0" y="-82" textAnchor="middle" {...label} className="rig-minor font-mono">SPECIMEN · 6061-T6</text>
          <text x="190" y="-82" textAnchor="middle" {...label} className="rig-minor font-mono">LOAD BEARING</text>
          <text x="-269" y="72" textAnchor="middle" {...label} className="rig-minor font-mono">SPINDLE</text>
          <text x="269" y="124" textAnchor="middle" {...label} className="rig-minor font-mono">LOAD</text>
        </g>

        {mode === 'cycle' ? (
          <>
            <svg x="-164" y="100" width="64" height="64" viewBox="-32 -32 64 64" aria-hidden="true" data-revolution-tracker>
              <circle r="24" fill="none" stroke={INK} strokeOpacity=".35" strokeWidth=".8" />
              <g className="rig-revolution">
                <path d="M0 0V-24" stroke={INK} strokeWidth=".8" strokeOpacity=".5" />
                <circle cy="-24" r="3" fill={PAPER} stroke={INK} strokeWidth="1.5" />
              </g>
            </svg>

            {/* Beat 3: stress at the witness mark, fully reversed, one cycle per turn.
                The pen is directly under the mark and moves with it. */}
            <g transform={`translate(${MARK_X - PEN} 132)`} aria-hidden="true">
              <g clipPath="url(#rig-window)">
                <path className="rig-wave" d={WAVE} fill="none" stroke={INK} strokeWidth="1.75" />
                {/* Paper over the part of the chart not yet drawn; it shrinks away from the pen */}
                <rect className="rig-undrawn" x="0" y="-34" width={PEN + 2} height="68" fill={PAPER} />
              </g>
              <path d={`M0 -34V34M0 0H${PEN}`} stroke={INK} strokeWidth="0.75" strokeOpacity="0.5" />
              <g className="rig-pen">
                <path d={`M${PEN} -110V-34`} stroke={INK} strokeWidth="0.75" strokeOpacity="0.45" strokeDasharray="2 4" />
                <circle className="rig-dot" cx={PEN} cy="0" r="4" fill="#FFFFFF" stroke={INK} strokeWidth="2.5" />
              </g>
              <text x="-8" y="-22" textAnchor="end" {...label} className="font-mono rig-stress-label">+σ</text>
              <text x="-8" y="30" textAnchor="end" {...label} className="font-mono rig-stress-label">−σ</text>
              <text x={PEN + 12} y="-10" {...label}>R = -1</text>
              <text x={PEN + 12} y="8" {...label}>1 REV = 1 CYCLE</text>
            </g>
          </>
        ) : (
          <g aria-hidden="true" data-laser-scan>
            {/* Plot: r(x) under the specimen. Laid down first; the paper carried
                by the laser covers what the line has not reached yet. */}
            <path d={`M-150 ${PLOT_Y}H150M-150 ${PLOT_Y - 22 * PLOT_SCALE}H150`} stroke={INK} strokeOpacity="0.2" strokeWidth="0.75" strokeDasharray="3 4" />
            <path d={GENERATOR} transform={`translate(0 ${PLOT_Y}) scale(1 ${PLOT_SCALE})`} fill="none" stroke={INK} strokeWidth="1.75" vectorEffect="non-scaling-stroke" />
            {/* Laser line: crosses the specimen and drops to the plot below. One
                animation moves the line and its paper together, so they cannot drift. */}
            <g clipPath="url(#rig-scan-span)">
            <g className="rig-laser">
              <rect x="-149" y={PLOT_Y - 22 * PLOT_SCALE - 8} width="320" height={22 * PLOT_SCALE + 16} fill={PAPER} />
              <path d={`M-150 -48V${PLOT_Y}`} stroke={LASER} strokeWidth="1" strokeOpacity="0.9" />
              <path d="M-150 -48V48" stroke={LASER} strokeWidth="5" strokeOpacity="0.18" />
              <circle cx="-150" cy="-48" r="3" fill={LASER} />
            </g>
            </g>
            <text x="-158" y={PLOT_Y - 22 * PLOT_SCALE + 4} textAnchor="end" {...label}>Ø44</text>
            <text x="-158" y={PLOT_Y + 4} textAnchor="end" {...label}>r 0</text>
            <text x="0" y={PLOT_Y + 26} textAnchor="middle" {...label} fill={LASER}>CONCEPTUAL MEASUREMENT ILLUSTRATION</text>
            <text x="-158" y={PLOT_Y - 9 * PLOT_SCALE + 4} textAnchor="end" {...label}>Ø18</text>
          </g>
        )}
      </svg>
      <figcaption className="pointer-events-none absolute bottom-[13%] w-full text-center font-mono text-[9px] uppercase tracking-[0.12em] text-slate-600 sm:text-[11px] sm:tracking-[0.16em]">
        <span className={`flex-wrap justify-center gap-x-4 gap-y-1 max-sm:hidden sm:flex ${mode === 'scan' ? 'invisible' : ''}`}>{beats.map((beat, index) => <span key={beat} className={`rig-beat-${index + 1}`}><span className="mr-1.5 text-slate-500">0{index + 1}</span>{beat}</span>)}</span>
        <span className="mt-2 block text-[9px] text-slate-500 sm:text-[10px]">Rotating beam fatigue rig · schematic, not to scale</span>
      </figcaption>
      </div>

      {/* Controls under the drawing: what the rig shows, and the jog wheel state */}
      <div className="mt-1 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-mono text-[12px]">
        <div role="group" aria-label="Rig view" className="flex border border-ink/25">
          {modes.map(([id, text]) => (
            <button
              key={id}
              type="button"
              aria-pressed={mode === id}
              onClick={() => setMode(id)}
              className={`min-h-[44px] cursor-pointer px-3 uppercase tracking-[0.1em] transition-colors md:min-h-[32px] ${mode === id ? 'bg-ink text-white' : 'text-slate-700 hover:text-ink'}`}
            >
              {text}
            </button>
          ))}
        </div>
        <p className="tabular-nums text-slate-600" aria-live="polite">
          {manual ? `θ ${String(angle).padStart(3, '0')}° · paused` : 'Drag the ring to turn'}
        </p>
        {/* Where this stress cycle leads: the measured S–N data */}
        <Link to="/project/gearlab#sn-plot" className="inline-flex min-h-[44px] items-center uppercase tracking-[0.1em] text-slate-700 underline decoration-ink/30 underline-offset-4 hover:text-ink md:min-h-[32px]">
          Stress → S–N data
        </Link>
        <button
          type="button"
          onClick={replay}
          className="min-h-[44px] cursor-pointer uppercase tracking-[0.1em] text-slate-700 underline decoration-ink/30 underline-offset-4 hover:text-ink md:min-h-[32px]"
        >
          Replay
        </button>
      </div>
    </figure>
  )
}
