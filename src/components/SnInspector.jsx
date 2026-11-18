import { useId, useState } from 'react'
import { asset } from '../data/experiences.js'
import { thumbnail } from '../data/media.js'
import { control } from '../lib/controls.js'

// S–N inspector: the specimen and the chart, linked. Every plotted point is a
// test the rotating-beam deck states in text (stress amplitude, cycles, slide).
// The deck reports 14 tests; the other six appear only as markers on its
// slide 17 chart, so they are not re-plotted here. The source chart is one
// click away in the same frame.
const DECK = '/assets/Project Presentation-Rotating Beam Fatigue.pdf'
export const TESTS = [
  { id: 11, stress: 439.62, cycles: 9500, slide: 21, specimen: 'RBF_B1_S9_M70_70' },
  { id: 4, stress: 251.28, cycles: 17200, slide: 22, specimen: 'RBF_B1_S4_M40_70' },
  { id: 14, stress: 376.92, cycles: 45300, slide: 14 },
  { id: 9, stress: 188.46, cycles: 64700, slide: 23, specimen: 'RBF_B1_S7_M30_70' },
  { id: 13, stress: 314.01, cycles: 264900, slide: 13 },
  { id: 1, stress: 314.01, cycles: 887000, slide: 18, specimen: 'RBF_B1_S1_M50_70' },
  { id: 2, stress: 314.01, cycles: 2664000, slide: 20, specimen: 'RBF_B1_S2_M50_50' },
  // Slide 15 marks this 10,000,000-cycle result with an asterisk: a runout.
  { id: 12, stress: 251.28, cycles: 10000000, slide: 15, runout: true },
]

// Plot frame: log N from 10^3 to 10^8, log σ from 100 to 1000 MPa, as on slide 17.
const X0 = 58
const X1 = 404
const Y0 = 16
const Y1 = 250
const px = (n) => X0 + ((Math.log10(n) - 3) / 5) * (X1 - X0)
const py = (s) => Y1 - (Math.log10(s) - 2) * (Y1 - Y0)
const FIT = (n) => 816.0 * n ** -0.078 // experimental fit, slide 17
const RED = '#F87171'
const CYAN = '#00E5FF'
const INK = '#DCE7EE'
const DIM = '#91A8B6'

const fmt = (n) => n.toLocaleString('en-US')
const pow10 = (e) => `10${'⁰¹²³⁴⁵⁶⁷⁸⁹'[e]}`

// Specimen profile (as the hero rig): Ø44 shanks, Ø34 steps, Ø18 waist. Schematic.
const SPECIMEN =
  'M-150 -22H-66L-60 -17H-52C-30 -17 -22 -9 0 -9C22 -9 30 -17 52 -17H60L66 -22H150V22H66L60 17H52' +
  'C30 17 22 9 0 9C-22 9 -30 17 -52 17H-60L-66 22H-150Z'

function Specimen({ test }) {
  const color = test ? (test.runout ? CYAN : RED) : DIM
  return (
    <svg viewBox="-170 -70 340 140" role="img" aria-label="Specimen profile with the smallest cross-section highlighted, and a magnified view of the waist" className="w-full">
      <defs>
        <clipPath id="sn-lens">
          <circle cx="0" cy="-35" r="30" />
        </clipPath>
        <linearGradient id="sn-al" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5E6873" />
          <stop offset="0.4" stopColor="#C2CAD3" />
          <stop offset="1" stopColor="#4A535D" />
        </linearGradient>
      </defs>
      {/* Specimen sits low; the lens floats clear above its waist */}
      <g transform="translate(0 30)">
      <path d="M-165 0H165" stroke={DIM} strokeOpacity="0.4" strokeDasharray="8 3 2 3" />
      <path d={SPECIMEN} fill="url(#sn-al)" stroke={INK} strokeWidth="1.2" />
      {/* Critical region: the waist, where d is smallest and bending stress highest */}
      <path d="M-22 -10.5C-11 -9 11 -9 22 -10.5V10.5C11 9 -11 9 -22 10.5Z" fill={color} fillOpacity="0.45" stroke={color} strokeWidth="1.5" className="transition-colors" data-waist />
      <path d="M0 -9V9" stroke="#FFFFFF" strokeWidth="1" />
      <text x="0" y="33" textAnchor="middle" fill={INK} fontSize="8" className="font-mono">d min</text>
      </g>
      {/* Inspection lens: the waist at 2.6×, lifted above the specimen */}
      <path d="M0 -4V21" stroke={color} strokeWidth="1" strokeDasharray="2 2" />
      <circle cx="0" cy="-35" r="31" fill="#05080F" stroke={color} strokeWidth="1.5" />
      <g clipPath="url(#sn-lens)">
        <g transform="translate(0 -35) scale(2.6)">
          <path d={SPECIMEN} fill="url(#sn-al)" stroke={INK} strokeWidth="0.5" />
          <path d="M-22 -10.5C-11 -9 11 -9 22 -10.5V10.5C11 9 -11 9 -22 10.5Z" fill={color} fillOpacity="0.35" />
          <path d="M0 -9V9" stroke="#FFFFFF" strokeWidth="0.4" />
          <path d="M-12 -9.3H12M-12 9.3H12" stroke={color} strokeWidth="0.8" />
        </g>
      </g>
      <text x="36" y="-54" fill={RED} fontSize="8" className="font-mono">+σ outer fibre (tension)</text>
      <text x="36" y="-12" fill={CYAN} fontSize="8" className="font-mono">−σ outer fibre (compression)</text>
      <text x="-165" y="-60" fill={DIM} fontSize="7.5" className="font-mono">×2.6 LENS · WAIST</text>
      <text x="165" y="68" textAnchor="end" fill={DIM} fontSize="7.5" className="font-mono">PROFILE AFTER SLIDE 8 · NOT TO SCALE</text>
    </svg>
  )
}

const layers = [
  ['failures', 'Failures'],
  ['runouts', 'Runouts'],
  ['fit', 'Fit'],
]

export default function SnInspector() {
  const [sel, setSel] = useState(13)
  const [show, setShow] = useState({ failures: true, runouts: true, fit: true })
  const [source, setSource] = useState(false)
  const listId = useId()
  const test = TESTS.find((t) => t.id === sel)
  const visible = (t) => (t.runout ? show.runouts : show.failures)
  const fitPath = Array.from({ length: 51 }, (_, k) => {
    const n = 10 ** (3 + k / 10)
    return `${k ? 'L' : 'M'}${px(n).toFixed(1)} ${py(FIT(n)).toFixed(1)}`
  }).join('')

  // Arrow keys move between the visible tests in chart order (by cycles).
  const order = TESTS.filter(visible).sort((a, b) => a.cycles - b.cycles)
  const onKey = (event) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key]
    if (!step || !order.length) return
    event.preventDefault()
    const i = order.findIndex((t) => t.id === sel)
    setSel(order[(i + step + order.length) % order.length].id)
  }

  const btn = control

  return (
    <section className="border border-hud/25 bg-[#0B111C] p-4 sm:p-5" aria-labelledby="sn-heading" data-sn-inspector>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 id="sn-heading" className="text-xl text-white">Specimen and S–N chart, linked</h3>
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ti-400">6061-T6 · R = −1 · 8 of 14 tests tabulated</p>
      </div>

      <div className="mt-4 grid items-start gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        {/* Specimen */}
        <div className="min-w-0">
          <Specimen test={visible(test) ? test : null} />
          <p className="mt-2 text-[13px] leading-relaxed text-ti-300">
            Bending stress peaks at the outer fibres of the smallest diameter: σ = 32M / (πd³) (slide 8). Every point on the chart is that stress amplitude, at the waist.
          </p>
        </div>

        {/* Chart */}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Chart layers">
            {layers.map(([id, text]) => (
              <button key={id} type="button" aria-pressed={show[id]} disabled={source} onClick={() => setShow((s) => ({ ...s, [id]: !s[id] }))} className={`${btn(show[id])} disabled:opacity-40`}>
                {text}
              </button>
            ))}
            <button type="button" aria-pressed={source} onClick={() => setSource((v) => !v)} className={btn(source)}>
              Source chart · slide 17
            </button>
          </div>

          <div className="mt-2 aspect-[42/29] w-full border border-white/10 bg-obsidian">
            {source ? (
              <img src={asset(thumbnail('/assets/gearlab/sn-figure.png'))} alt="Slide 17 S-N chart: experimental failures, runouts at ten million cycles, reference data and the experimental fit" className="h-full w-full bg-[#F4F6F8] object-contain p-1" />
            ) : (
              <svg viewBox="0 0 420 290" role="group" aria-label="S-N chart of the tabulated tests. Use the arrow keys to move between tests." tabIndex={0} onKeyDown={onKey} className="block h-full w-full outline-none focus-visible:ring-2 focus-visible:ring-hud/60" data-sn-chart>
                {/* Axes and grid: fixed, whatever is shown */}
                {[3, 4, 5, 6, 7, 8].map((e) => (
                  <g key={e}>
                    <path d={`M${px(10 ** e)} ${Y0}V${Y1}`} stroke={DIM} strokeOpacity="0.18" />
                    <text x={px(10 ** e)} y={Y1 + 14} textAnchor="middle" fill={DIM} fontSize="10" className="font-mono">{pow10(e)}</text>
                  </g>
                ))}
                {[100, 200, 300, 400, 500, 600, 800, 1000].map((s) => (
                  <g key={s}>
                    <path d={`M${X0} ${py(s)}H${X1}`} stroke={DIM} strokeOpacity={s === 100 || s === 1000 ? 0.3 : 0.12} />
                    <text x={X0 - 6} y={py(s) + 3} textAnchor="end" fill={DIM} fontSize="9" className="font-mono">{s}</text>
                  </g>
                ))}
                <path d={`M${X0} ${Y0}V${Y1}H${X1}`} fill="none" stroke={DIM} strokeOpacity="0.6" />
                <text x={(X0 + X1) / 2} y="284" textAnchor="middle" fill={INK} fontSize="10" className="font-mono">CYCLES TO FAILURE, N</text>
                <text x="12" y={(Y0 + Y1) / 2} textAnchor="middle" fill={INK} fontSize="10" className="font-mono" transform={`rotate(-90 12 ${(Y0 + Y1) / 2})`}>σa, MPa</text>
                <path d={`M${px(1e7)} ${Y0}V${Y1}`} stroke={CYAN} strokeOpacity="0.45" strokeDasharray="3 4" />
                <text x={px(1e7) - 4} y={Y0 + 10} textAnchor="end" fill={CYAN} fillOpacity="0.8" fontSize="9" className="font-mono">RUNOUT 10⁷</text>
                {show.fit && <path d={fitPath} fill="none" stroke={RED} strokeOpacity="0.75" strokeWidth="1.5" />}

                {/* Guides from the selected test to both axes */}
                {visible(test) && (
                  <g data-guides>
                    <path d={`M${X0} ${py(test.stress)}H${px(test.cycles)}V${Y1}`} fill="none" stroke="#FFFFFF" strokeOpacity="0.7" strokeDasharray="4 3" />
                    <rect x={X0 + 2} y={py(test.stress) - 15} width="66" height="13" fill="#05080F" />
                    <text x={X0 + 5} y={py(test.stress) - 5} fill="#FFFFFF" fontSize="9.5" className="font-mono">{test.stress} MPa</text>
                    <rect x={px(test.cycles) - (test.cycles >= 1e7 ? 66 : 4)} y={Y1 - 15} width="64" height="13" fill="#05080F" />
                    <text x={px(test.cycles) + (test.cycles >= 1e7 ? -5 : 0)} y={Y1 - 5} textAnchor={test.cycles >= 1e7 ? 'end' : 'start'} fill="#FFFFFF" fontSize="9.5" className="font-mono">{fmt(test.cycles)}</text>
                  </g>
                )}

                {TESTS.filter(visible).map((t) => {
                  const on = t.id === sel
                  const c = t.runout ? CYAN : RED
                  return (
                    <g key={t.id} onClick={() => setSel(t.id)} className="cursor-pointer" data-test={t.id} data-selected={on}>
                      <circle cx={px(t.cycles)} cy={py(t.stress)} r="11" fill="transparent" />
                      {on && <circle cx={px(t.cycles)} cy={py(t.stress)} r="9" fill="none" stroke="#FFFFFF" strokeWidth="1.2" />}
                      <circle cx={px(t.cycles)} cy={py(t.stress)} r="5" fill={t.runout ? '#05080F' : c} stroke={c} strokeWidth="2" />
                      {t.runout && <path d={`M${px(t.cycles) + 7} ${py(t.stress)}h9m-3 -3l3 3l-3 3`} fill="none" stroke={c} strokeWidth="1.3" />}
                    </g>
                  )
                })}
              </svg>
            )}
          </div>

          {/* The same tests as buttons: the keyboard and screen-reader route */}
          <ul id={listId} className="mt-2 flex flex-wrap gap-1.5" aria-label="Tabulated tests">
            {TESTS.slice().sort((a, b) => a.cycles - b.cycles).map((t) => (
              <li key={t.id}>
                <button
                  type="button"
                  aria-pressed={t.id === sel}
                  disabled={!visible(t)}
                  onClick={() => setSel(t.id)}
                  className={`min-h-[44px] min-w-[44px] cursor-pointer border px-2 font-mono text-[11px] tabular-nums transition-colors focus-visible:outline-2 focus-visible:outline-hud disabled:cursor-not-allowed disabled:opacity-30 md:min-h-[30px] ${
                    t.id === sel ? 'border-white text-white' : t.runout ? 'border-hud/40 text-hud' : 'border-red-400/40 text-red-300'
                  }`}
                >
                  T{t.id}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Readout */}
      <div className="mt-4 grid gap-x-6 gap-y-1 border-t border-hud/15 pt-3 font-mono text-[12px] sm:grid-cols-[auto_1fr]" aria-live="polite" data-sn-readout>
        <p className="text-white">
          Test {test.id}
          {test.specimen && <span className="ml-2 text-ti-300">{test.specimen}</span>}
        </p>
        <p className={test.runout ? 'text-hud' : 'text-red-300'}>
          {test.stress} MPa · {fmt(test.cycles)} cycles · {test.runout ? 'Runout: reached 10⁷ cycles without failure' : 'Failure'}
        </p>
        <p className="text-ti-300 sm:col-span-2">
          {test.runout ? 'Marked with an asterisk on the slide: not a failure-life measurement. ' : ''}Source: deck slide {test.slide}.{' '}
          <a href={`${asset(DECK)}#page=${test.slide}`} target="_blank" rel="noreferrer" className="text-hud underline underline-offset-4">
            Open slide ↗
          </a>
        </p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-ti-300">
        Fit on slide 17: σ = 816.0 · N^−0.078. The deck reports 14 tests from 125.64 to 565.38 MPa; six of them appear only as markers on the source chart, so they are not re-plotted. Reference data from the chart is omitted.
      </p>
    </section>
  )
}
