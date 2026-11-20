import { useEffect, useState } from 'react'
import MediaGallery from './MediaGallery.jsx'
import { asset } from '../data/experiences.js'
import { control } from '../lib/controls.js'

// One inspector for the enclosure and the bench electronics. Both photos are
// upright 16:10 derivatives (scripts/prepare-echovision-landscape.py): rotated,
// then padded, never cropped. Shape coordinates are pixels of those
// derivatives: the original photo coordinates passed through the same rotation
// and padding. Only features visible in a photo get a shape; hidden parts are
// described in text with no position.
const VIEWS = [
  {
    id: 'enclosure',
    label: 'Enclosure',
    src: '/assets/echovision/landscape/enclosure.webp',
    original: '/assets/echovision/enclosure.jpg',
    size: [1184, 740],
    alt: 'EchoVision printed enclosure: dark front band with the camera aperture, grey shell with speaker grille holes',
    caption: 'Printed enclosure, exterior only',
  },
  {
    id: 'wiring',
    label: 'Bench',
    src: '/assets/echovision/landscape/wiring.webp',
    original: '/assets/echovision/wiring.jpg',
    size: [896, 560],
    alt: 'EchoVision electronics on a bench: ESP32 board on a screw-terminal breakout, jumper leads and a small speaker',
    caption: 'Bench electronics, outside the enclosure',
  },
]

const COMPONENTS = [
  {
    id: 'camera',
    label: 'Camera',
    role: 'Frames the driver.',
    enclosure: { shape: { circle: [390, 420, 30] }, tag: 'Camera lens', status: 'Visible', note: 'The lens shows through the aperture in the dark front band.' },
    wiring: { status: 'Not in photo', note: 'The bench photo does not show a separate camera.' },
  },
  {
    id: 'board',
    label: 'Controller',
    role: 'Runs the TinyML drowsiness model.',
    enclosure: { status: 'Not visible', note: 'Housed inside the shell; this exterior photo does not show its mounting.' },
    wiring: { shape: { rect: [390, 175, 232, 140] }, tag: 'ESP32 board', status: 'Visible', note: 'An ESP32 board on a screw-terminal breakout, wired outside the enclosure.' },
  },
  {
    id: 'speaker',
    label: 'Speaker',
    role: 'Sounds the alert.',
    enclosure: { shape: { ellipse: [833, 257, 78, 104] }, tag: 'Speaker grille', status: 'Grille visible', note: 'The grille holes are the speaker outlet; the speaker itself is hidden by the shell.' },
    wiring: { shape: { rect: [15, 439, 174, 105] }, tag: 'Speaker', status: 'Visible', note: 'The alert speaker, on two leads.' },
  },
  {
    id: 'power',
    label: 'Power',
    role: 'Battery supply inside the housing.',
    enclosure: { status: 'Not visible', note: 'Battery packaging was part of the design; this photo does not show where it sits.' },
    wiring: { status: 'Not in photo', note: 'No battery is visible, so power routing cannot be traced here.' },
  },
]

// The alert path, in order. A functional explanation, not a photographed installation.
const PATH = ['camera', 'board', 'speaker']
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Bounding box of a shape, in derivative pixels: [left, top, right, bottom].
function bounds({ circle, ellipse, rect }) {
  if (circle) return [circle[0] - circle[2], circle[1] - circle[2], circle[0] + circle[2], circle[1] + circle[2]]
  if (ellipse) return [ellipse[0] - ellipse[2], ellipse[1] - ellipse[3], ellipse[0] + ellipse[2], ellipse[1] + ellipse[3]]
  return [rect[0], rect[1], rect[0] + rect[2], rect[1] + rect[3]]
}

function Frame({ view, selected, lit, annotate, onSelect }) {
  const [w, h] = view.size
  const marked = COMPONENTS.filter((item) => item[view.id].shape)

  return (
    <figure className="min-w-0" data-echo-frame={view.id}>
      {/* 16:10 box with the 16:10 derivative: image, shapes and labels share one coordinate system */}
      <div className="relative aspect-[16/10] overflow-hidden border border-white/10 bg-[#0B111C]">
        <img src={asset(view.src)} alt={view.alt} width={w} height={h} loading="lazy" className="absolute inset-0 h-full w-full object-contain" />
        {annotate && (
          <>
            <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid meet" aria-hidden="true" className="absolute inset-0 h-full w-full">
              {marked.map((item) => {
                const on = item.id === selected || lit.includes(item.id)
                const { circle, ellipse, rect } = item[view.id].shape
                const common = {
                  fill: on ? 'rgb(0 229 255 / 0.14)' : 'transparent',
                  stroke: on ? '#00E5FF' : '#FFFFFF',
                  strokeOpacity: on ? 1 : 0.7,
                  strokeWidth: on ? 2.5 : 1.5,
                  vectorEffect: 'non-scaling-stroke',
                  className: 'cursor-pointer',
                  onClick: () => onSelect(item.id),
                  'data-shape': item.id,
                }
                if (circle) return <circle key={item.id} cx={circle[0]} cy={circle[1]} r={circle[2]} {...common} />
                if (ellipse) return <ellipse key={item.id} cx={ellipse[0]} cy={ellipse[1]} rx={ellipse[2]} ry={ellipse[3]} {...common} />
                return <rect key={item.id} x={rect[0]} y={rect[1]} width={rect[2]} height={rect[3]} {...common} />
              })}
            </svg>
            {/* Upright HTML tags, anchored to each shape's box in the same derivative pixels */}
            {marked.map((item) => {
              const [left, top, , bottom] = bounds(item[view.id].shape)
              const on = item.id === selected || lit.includes(item.id)
              const above = top / h > 0.12
              return (
                <span
                  key={item.id}
                  aria-hidden="true"
                  style={{ left: `${(left / w) * 100}%`, top: `${((above ? top : bottom) / h) * 100}%` }}
                  className={`pointer-events-none absolute whitespace-nowrap px-1.5 py-0.5 font-mono text-[11px] font-medium ${above ? '-translate-y-full' : ''} ${
                    on ? 'bg-hud text-obsidian' : 'bg-obsidian/85 text-white'
                  }`}
                >
                  {item[view.id].tag}
                </span>
              )
            })}
          </>
        )}
      </div>
      <figcaption className="mt-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-sm text-ti-300">
        <span>{view.caption}</span>
        <a href={asset(view.original)} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center text-hud underline decoration-hud/40 underline-offset-4 hover:decoration-hud md:min-h-0">
          Open original ↗
        </a>
      </figcaption>
    </figure>
  )
}

export default function EchoVisionPackaging() {
  const [selected, setSelected] = useState('camera')
  const [viewId, setViewId] = useState('enclosure') // phones and tablets: one photo at a time
  const [annotate, setAnnotate] = useState(true)
  const [step, setStep] = useState(null) // alert-path trace: index into PATH, or null
  const component = COMPONENTS.find((item) => item.id === selected)

  // Trace the alert path one stage at a time; reduced motion shows it all at once.
  useEffect(() => {
    if (step === null || step >= PATH.length - 1) return undefined
    const timer = setTimeout(() => setStep((s) => s + 1), 900)
    return () => clearTimeout(timer)
  }, [step])

  const trace = () => {
    setAnnotate(true)
    setStep(reducedMotion() ? PATH.length - 1 : 0)
  }
  const lit = step === null ? [] : PATH.slice(0, step + 1)
  const choose = (id) => {
    setStep(null)
    setSelected(id)
  }

  return (
    <section className="min-w-0" data-echovision-packaging aria-labelledby="packaging-heading">
      <div className="border border-hud/25 bg-[#0B111C] p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 id="packaging-heading" className="text-xl text-white">Enclosure &amp; bench electronics</h3>
          <div className="flex flex-wrap gap-2">
            <button type="button" aria-pressed={annotate} onClick={() => setAnnotate((v) => !v)} className={control(annotate)}>
              Show annotations
            </button>
            <button type="button" onClick={trace} className={control(step !== null)}>
              Trace alert path
            </button>
          </div>
        </div>

        <div role="group" aria-label="Photo" className="mt-4 grid grid-cols-2 gap-2 lg:hidden">
          {VIEWS.map((view) => (
            <button key={view.id} type="button" aria-pressed={viewId === view.id} onClick={() => setViewId(view.id)} className={`${control(viewId === view.id)} justify-center`}>
              {view.label}
            </button>
          ))}
        </div>

        <div className="mt-4 grid gap-5 lg:grid-cols-2">
          {VIEWS.map((view) => (
            <div key={view.id} className={view.id === viewId ? '' : 'max-lg:hidden'}>
              <Frame view={view} selected={selected} lit={lit} annotate={annotate} onSelect={choose} />
            </div>
          ))}
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)]">
          <div role="group" aria-label="Component" className="grid grid-cols-2 gap-2 self-start md:grid-cols-1">
            {COMPONENTS.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={selected === item.id}
                aria-controls="echovision-part-detail"
                onClick={() => choose(item.id)}
                className={`${control(selected === item.id || lit.includes(item.id))} justify-start`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div id="echovision-part-detail" aria-live="polite" className="min-w-0 border-l-2 border-hud/60 pl-4">
            <p className="text-lg text-white">{component.label}</p>
            <p className="mt-1 text-[15px] text-ti-100">{component.role}</p>
            <dl className="mt-3 space-y-2 text-sm leading-relaxed">
              {VIEWS.map((view) => (
                <div key={view.id}>
                  <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-ti-400">
                    {view.label} · <span className={component[view.id].shape ? 'text-hud' : 'text-amber-200'}>{component[view.id].status}</span>
                  </dt>
                  <dd className="mt-0.5 text-ti-300">{component[view.id].note}</dd>
                </div>
              ))}
            </dl>
            {step !== null && (
              <p className="mt-3 font-mono text-[11px] text-ti-300" data-alert-path>
                Alert path: {PATH.map((id, i) => (
                  <span key={id} className={lit.includes(id) ? 'text-hud' : ''}>
                    {i > 0 && ' → '}{COMPONENTS.find((c) => c.id === id).label}
                  </span>
                ))}. Functional order, not a photographed installation.
              </p>
            )}
          </div>
        </div>

        <p className="mt-5 text-sm leading-relaxed text-ti-400">
          Outlines mark only what each photo shows. Neither photo shows the assembled interior.
        </p>
      </div>

      <details className="mt-8 border-t border-hud/25 pt-5">
        <summary className="cursor-pointer py-2 font-mono text-sm text-hud">Cockpit reference · no installed prototype or in-vehicle test</summary>
        <p className="my-4 max-w-[65ch] text-sm leading-relaxed text-ti-300">The Honda S2000 cockpit is a packaging reference. It does not show EchoVision installed.</p>
        <MediaGallery images={[{ src: '/assets/echovision/cockpit-reference.jpg', alt: 'Honda S2000 cockpit used only as a packaging reference', caption: 'Reference photo only · Honda S2000 cockpit' }]} compact />
      </details>
    </section>
  )
}
