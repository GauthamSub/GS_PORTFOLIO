import { useState } from 'react'
import { asset } from '../data/experiences.js'
import { thumbnail } from '../data/media.js'

// ENGR 1182 deadbolt lock: three SolidWorks drawings, opened part by part.
//
// The exploded view is an illustration. Each outline is traced from its own
// drawing's dimensions at one common scale (60 units per inch), but the
// drawings do not define how the parts mate, so the order, spacing, and
// alignment along the axis are not taken from any drawing. The view says so.
const DIR = '/assets/all finished engineering stuff/'
const IN = 60

// Dial end view: Ø1.75 base, Ø1.00 boss, R.35 splined stub (12 teeth drawn).
const SPLINE = Array.from({ length: 24 }, (_, n) => {
  const r = (n % 2 ? 0.27 : 0.35) * IN
  const a = (n * Math.PI) / 12
  return `${(r * Math.cos(a)).toFixed(1)},${(r * Math.sin(a)).toFixed(1)}`
}).join(' ')

const parts = [
  {
    id: 'dial',
    number: 1,
    label: 'G10 Dial',
    title: 'G10 Lock Ergonomics',
    drawn: '11/23/2024',
    pdf: `${DIR}Dial_G10_Lock Drawing.pdf`,
    preview: '/assets/deadbolt/dial-g10.png',
    facts: ['Ø1.75 base flange and Ø1.00 boss', 'Splined stub, R.35', 'Scale 1:1, units IPS, drawing no. G10'],
    // translate() of the part's local origin inside the 632 x 250 frame
    at: [72, 125],
    shape: (
      <>
        <circle r={0.875 * IN} />
        <circle r={0.5 * IN} />
        <polygon points={SPLINE} />
      </>
    ),
    balloon: [0, -72],
  },
  {
    id: 'plate',
    number: 2,
    label: 'G10 Front Plate',
    title: 'G10 Front Plate',
    drawn: '11/23/2024',
    pdf: `${DIR}Front_Plate G10.pdf`,
    preview: '/assets/deadbolt/front-plate-g10.png',
    facts: [
      '4.75 × 3.00 × .25 plate, R.25 corners',
      'Ø.60 bore, R.13 slot, four .25 × .50 cutouts',
      'Four Ø.13 holes on a 4.25 × 2.50 pattern',
    ],
    at: [160, 35],
    shape: (
      <>
        <rect width={4.75 * IN} height={3 * IN} rx={0.25 * IN} />
        {[
          [0.25, 0.25], [4.5, 0.25], [0.25, 2.75], [4.5, 2.75],
        ].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x * IN} cy={y * IN} r={0.065 * IN} />
        ))}
        {[
          [0.12, 0.5], [4.38, 0.5], [0.12, 2], [4.38, 2],
        ].map(([x, y]) => (
          <rect key={`${x}-${y}`} x={x * IN} y={y * IN} width={0.25 * IN} height={0.5 * IN} />
        ))}
        <circle cx={3.09 * IN} cy={1.5 * IN} r={0.3 * IN} />
        <rect x={0.48 * IN} y={1.37 * IN} width={0.75 * IN} height={0.26 * IN} rx={0.13 * IN} />
      </>
    ),
    balloon: [142, -18],
  },
  {
    id: 'deadbolt',
    number: 3,
    label: 'Deadbolt Subassembly',
    title: 'Graphics 5 Deadbolt Subassembly',
    drawn: '9/28/2024',
    pdf: `${DIR}Deadbolt Subassembly DRAWING_AS_PDF.PDF`,
    preview: '/assets/deadbolt/deadbolt-subassembly.png',
    facts: [
      '1.00 × 1.40 block and a .75 wide bolt',
      'Ø.25 cross rod, 2.50 long',
      'Scale 1:1, units inches. Drawn two months before the G10 parts',
    ],
    at: [478, 50],
    shape: (
      <>
        <rect y={0.6 * IN} width={1 * IN} height={1.4 * IN} />
        <rect x={0.5 * IN} y={0.92 * IN} width={1.86 * IN} height={0.75 * IN} />
        <rect x={1.11 * IN} width={0.25 * IN} height={2.5 * IN} />
        <circle cx={0.74 * IN} cy={1.29 * IN} r={0.125 * IN} />
      </>
    ),
    balloon: [71, -33],
  },
]

export default function DeadboltInspector() {
  const [selected, setSelected] = useState('plate')
  const part = parts.find((item) => item.id === selected)

  return (
    <div className="min-w-0 border border-hud/25 bg-[#0B111C] p-5 sm:p-6" data-deadbolt-inspector>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-mono text-sm text-white">Deadbolt lock: assembly inspection</h3>
        <span className="border border-dashed border-amber-300/70 px-2 py-1 font-mono text-[11px] uppercase tracking-[0.15em] text-amber-200">
          Illustrated view
        </span>
      </div>

      <svg
        viewBox="0 0 632 250"
        role="img"
        aria-label="Illustrated exploded view: dial, front plate, and deadbolt subassembly spaced along one axis"
        className="mt-5 w-full border-y border-hud/15"
      >
        {/* Assembly axis: illustrative only */}
        <path d="M 8 125 H 624" stroke="#00e5ff" strokeOpacity="0.3" strokeDasharray="14 4 2 4" />
        {parts.map((item) => {
          const on = item.id === selected
          return (
            <g
              key={item.id}
              transform={`translate(${item.at.join(' ')})`}
              onClick={() => setSelected(item.id)}
              data-part={item.id}
              data-selected={on}
              className="cursor-pointer"
            >
              <g
                fill={on ? '#00e5ff' : '#0B111C'}
                fillOpacity={on ? 0.1 : 1}
                stroke={on ? '#00e5ff' : '#91a8b6'}
                strokeOpacity={on ? 1 : 0.55}
                strokeWidth={on ? 1.75 : 1.1}
                className="transition-[stroke,stroke-opacity,fill-opacity] duration-200"
              >
                {item.shape}
              </g>
              <g transform={`translate(${item.balloon.join(' ')})`}>
                <circle r="13" fill={on ? '#00e5ff' : '#05080f'} stroke="#00e5ff" strokeOpacity={on ? 1 : 0.6} />
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="14"
                  fontWeight="600"
                  fill={on ? '#05080f' : '#00e5ff'}
                  className="font-mono"
                >
                  {item.number}
                </text>
              </g>
            </g>
          )
        })}
      </svg>
      <p className="mt-3 max-w-[78ch] text-sm leading-relaxed text-ti-300">
        Illustration, not a drawing. Each outline is traced from its own drawing's dimensions at
        one scale. The three drawings do not define how the parts mate, so order, spacing, and
        alignment along the axis are illustrative.
      </p>

      <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Lock components">
        {parts.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={selected === item.id}
            aria-controls="deadbolt-part"
            onClick={() => setSelected(item.id)}
            className={`min-h-[44px] cursor-pointer border px-3.5 font-mono text-xs transition-colors hover:border-hud focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-hud ${
              selected === item.id ? 'border-hud bg-hud/10 text-hud' : 'border-hud/25 text-readout'
            }`}
          >
            <span className="mr-2 text-ti-300">{item.number}</span>
            {item.label}
          </button>
        ))}
      </div>

      <div id="deadbolt-part" className="mt-6 grid items-start gap-x-8 gap-y-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <figure className="min-w-0 border border-white/[0.08]">
          <a
            href={asset(part.pdf)}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open the ${part.label} drawing (PDF)`}
            className="block bg-[#F4F6F8]"
          >
            <img
              key={part.id}
              src={asset(thumbnail(part.preview))}
              alt={`SolidWorks drawing: ${part.title}`}
              width="2400"
              height="1855"
              loading="lazy"
              className="block h-auto w-full"
            />
          </a>
          <figcaption className="border-t border-white/[0.08] px-4 py-3 text-sm leading-relaxed text-ti-300">
            Drawing title: {part.title} • dated {part.drawn}
          </figcaption>
        </figure>

        <div className="min-w-0 border-l-2 border-hud/60 pl-5" aria-live="polite">
          <p className="text-xl text-white">{part.label}</p>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-ti-400">From the drawing</p>
          <ul className="mt-3 space-y-3 text-sm leading-relaxed text-ti-300">
            {part.facts.map((fact) => (
              <li key={fact} className="flex gap-3">
                <span aria-hidden="true" className="mt-[0.75em] h-px w-3 shrink-0 bg-hud/70" />
                {fact}
              </li>
            ))}
          </ul>
          <a
            href={asset(part.pdf)}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex min-h-[44px] items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-hud underline decoration-hud/40 underline-offset-[5px] transition-colors hover:decoration-hud"
          >
            Open full-size drawing (PDF) <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </div>
  )
}
