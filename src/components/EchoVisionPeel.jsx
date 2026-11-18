import { useEffect, useId, useState } from 'react'
import { asset } from '../data/experiences.js'
import { thumbnail } from '../data/media.js'
import { control } from '../lib/controls.js'

// Peel-away: one slider lifts an "x-ray" annotation layer over both photos.
//   solid outline  = the part is visible in that photo
//   dashed outline = inferred placement, not visible (labelled as such)
// The enclosure photo shows only the shell, so everything inside it except
// the lens is inferred; the battery has no documented position at all and is
// drawn as a labelled, unplaced volume. The bench photo is outside the
// enclosure, so its outlines are all solid and say nothing about packaging.
// Coordinates are pixels of each original photo.
const CYAN = '#00E5FF'
const AMBER = '#FBBF24'

const FRAMES = [
  {
    id: 'enclosure',
    src: '/assets/echovision/enclosure.jpg',
    alt: 'EchoVision printed enclosure: dark face with a camera aperture, grey shell with grille holes',
    size: [740, 995],
    caption: 'Printed enclosure · shell only',
    parts: [
      { id: 'board', label: 'ESP32-CAM board', visible: false, shape: { rect: [222, 214, 200, 190] }, note: 'Inferred: the camera lens is on this board, so it sits behind the aperture.', anchor: [230, 196] },
      { id: 'camera', label: 'Camera lens', visible: true, shape: { circle: [320, 296, 30] }, note: 'Visible through the aperture in the dark face.', anchor: [360, 262] },
      { id: 'speaker', label: 'Speaker', visible: false, shape: { ellipse: [483, 739, 104, 78] }, note: 'Inferred behind the grille holes; the shell hides it.', anchor: [390, 850] },
      { id: 'battery', label: 'Battery', visible: false, shape: { rect: [432, 338, 210, 126] }, unplaced: true, note: 'Inside the shell per the design brief. Its position is not documented; this box only marks that it is in there.', anchor: [372, 500] },
      { id: 'wiring', label: 'Wiring', visible: false, shape: { lines: [[[402, 404], [455, 668]], [[422, 360], [446, 380]]] }, note: 'Routing inferred. The bench photo shows the real leads, outside the enclosure.', anchor: [430, 590] },
    ],
  },
  {
    id: 'wiring',
    src: '/assets/echovision/wiring.jpg',
    alt: 'EchoVision electronics on a bench: ESP32 board on a terminal breakout, jumper leads, small speaker',
    size: [538, 892],
    caption: 'Bench wiring · outside the enclosure',
    parts: [
      { id: 'board', label: 'ESP32 board', visible: true, shape: { rect: [164, 272, 140, 232] }, note: 'On a screw-terminal breakout.', anchor: [168, 258] },
      { id: 'wiring', label: 'Leads', visible: true, shape: { lines: [[[232, 272], [330, 76]], [[300, 470], [462, 718]]] }, note: 'Jumper leads to the header and to the speaker.', anchor: [330, 120] },
      { id: 'speaker', label: 'Speaker', visible: true, shape: { rect: [428, 705, 105, 174] }, note: 'The alert speaker, on two leads.', anchor: [330, 690] },
    ],
  },
]

// The alert path, in order: what each stage does, from the case study.
const PATH = [
  ['camera', 'Camera', 'frames the driver'],
  ['board', 'ESP32-CAM', 'runs the TinyML drowsiness model'],
  ['speaker', 'Speaker', 'sounds the alert'],
]

function Shape({ part, lit, scale }) {
  const color = lit ? CYAN : part.visible ? '#FFFFFF' : AMBER
  const common = {
    fill: lit ? 'rgb(0 229 255 / 0.18)' : 'none',
    stroke: color,
    strokeWidth: (lit ? 4 : 3) * scale,
    strokeDasharray: part.visible ? undefined : `${12 * scale} ${8 * scale}`,
  }
  const s = part.shape
  if (s.rect) return <rect x={s.rect[0]} y={s.rect[1]} width={s.rect[2]} height={s.rect[3]} {...common} />
  if (s.circle) return <circle cx={s.circle[0]} cy={s.circle[1]} r={s.circle[2]} {...common} />
  if (s.ellipse) return <ellipse cx={s.ellipse[0]} cy={s.ellipse[1]} rx={s.ellipse[2]} ry={s.ellipse[3]} {...common} />
  return s.lines.map(([a, b], i) => <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} {...common} fill="none" />)
}

function Frame({ frame, peel, lit }) {
  const [w, h] = frame.size
  const scale = w / 740
  return (
    <figure className="min-w-0" data-peel-frame={frame.id}>
      <div className="relative overflow-hidden border border-white/10 bg-obsidian" style={{ aspectRatio: `${w} / ${h}` }}>
        <img src={asset(thumbnail(frame.src))} alt={frame.alt} className="absolute inset-0 h-full w-full object-cover" />
        {/* The x-ray layer, cut back to the peel line */}
        <svg
          viewBox={`0 0 ${w} ${h}`}
          aria-hidden="true"
          className="absolute inset-0 h-full w-full motion-safe:transition-[clip-path] motion-safe:duration-300"
          style={{ clipPath: `inset(0 ${100 - peel}% 0 0)` }}
        >
          <rect width={w} height={h} fill="#05080F" fillOpacity="0.62" />
          {frame.parts.map((part) => (
            <g key={part.id} data-part={part.id} data-visible={part.visible} data-lit={lit.includes(part.id)}>
              <Shape part={part} lit={lit.includes(part.id)} scale={scale} />
              <text x={part.anchor[0]} y={part.anchor[1]} fill={lit.includes(part.id) ? CYAN : part.visible ? '#FFFFFF' : AMBER} fontSize={26 * scale} fontWeight="600" className="font-mono" paintOrder="stroke" stroke="#05080F" strokeWidth={6 * scale}>
                {part.label}
                {!part.visible && (part.unplaced ? ' · not placed' : ' · inferred')}
              </text>
            </g>
          ))}
        </svg>
        {/* Peel edge */}
        {peel > 0 && peel < 100 && <span aria-hidden="true" className="absolute inset-y-0 w-0.5 bg-hud shadow-[0_0_10px_rgb(0_229_255/0.8)]" style={{ left: `${peel}%` }} />}
      </div>
      <figcaption className="mt-1.5 font-mono text-[11px] text-ti-300">{frame.caption}</figcaption>
    </figure>
  )
}

export default function EchoVisionPeel() {
  const [peel, setPeel] = useState(0)
  const [step, setStep] = useState(null) // index into PATH, or null
  const [playing, setPlaying] = useState(false)
  const id = useId()

  // Trace the alert path: one stage at a time. Reduced motion: all at once.
  useEffect(() => {
    if (!playing) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setStep(PATH.length - 1)
      setPlaying(false)
      return undefined
    }
    if (step === PATH.length - 1) {
      setPlaying(false)
      return undefined
    }
    const timer = setTimeout(() => setStep((s) => (s === null ? 0 : s + 1)), step === null ? 0 : 900)
    return () => clearTimeout(timer)
  }, [playing, step])

  const trace = () => {
    if (peel < 100) setPeel(100)
    setStep(null)
    setPlaying(true)
  }
  const lit = step === null ? [] : window.matchMedia('(prefers-reduced-motion: reduce)').matches ? PATH.map((p) => p[0]) : PATH.slice(0, step + 1).map((p) => p[0])
  const btn = control()

  return (
    <section className="mb-8 border border-hud/25 bg-[#0B111C] p-4 sm:p-5" aria-labelledby="peel-heading" data-echovision-peel>
      <h3 id="peel-heading" className="text-xl text-white">Peel the shell · alert path</h3>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => setPeel((p) => (p < 50 ? 100 : 0))} className={btn} aria-pressed={peel === 100}>
          {peel < 50 ? 'Peel shell' : 'Close shell'}
        </button>
        <button type="button" onClick={trace} className={btn}>
          Trace alert path
        </button>
        <label htmlFor={id} className="ml-auto font-mono text-[11px] text-ti-300">
          Peel <output htmlFor={id} className="tabular-nums text-white">{peel}%</output>
        </label>
      </div>
      <input id={id} type="range" min="0" max="100" value={peel} onChange={(e) => setPeel(Number(e.target.value))} aria-valuetext={`${peel} percent peeled`} className="mt-1 h-11 w-full cursor-pointer accent-cyan-400 md:h-6" />

      {/* Stacked on phones, so the labels stay readable */}
      <div className="mt-3 grid items-start gap-4 sm:grid-cols-2 sm:gap-5">
        {FRAMES.map((frame) => (
          <Frame key={frame.id} frame={frame} peel={peel} lit={lit} />
        ))}
      </div>

      <ol className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px]" aria-live="polite" data-alert-path>
        {PATH.map(([key, name, does], i) => (
          <li key={key} className={lit.includes(key) ? 'text-hud' : 'text-ti-300'}>
            {i + 1} {name} <span className="text-ti-300">{does}</span>
            {i < PATH.length - 1 && <span className="ml-2 text-ti-400">→</span>}
          </li>
        ))}
      </ol>
      <ul className="mt-3 grid gap-1 text-[12.5px] leading-snug text-ti-300 sm:grid-cols-2">
        {FRAMES[0].parts.map((p) => (
          <li key={p.id}>
            <span className={p.visible ? 'text-white' : 'text-amber-300'}>{p.label}</span> · {p.note}
          </li>
        ))}
      </ul>
      <p className="mt-3 text-sm leading-relaxed text-ti-300">
        Solid outline: visible in the photo. Dashed amber: inferred, not visible. The enclosure and the bench wiring are separate photos; neither shows the assembled interior.
      </p>
    </section>
  )
}
