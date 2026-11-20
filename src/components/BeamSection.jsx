import { useId, useRef, useState } from 'react'
import { control } from '../lib/controls.js'

// Rotating-beam section, a conceptual explainer for the S-N data above it.
// The bending moment is fixed in space while the specimen turns, so a point on
// the surface at angle θ from the top sees σ = σa·cos θ: peak tension at the
// top, zero on the neutral axis, peak compression at the bottom. One revolution
// is one fully reversed cycle (R = −1). Visitor-driven only: nothing animates.

const INK = '#DCE7EE'
const DIM = '#91A8B6'
const RED = '#F87171'
const CYAN = '#00E5FF'
const START = 40

export default function BeamSection() {
  const [theta, setTheta] = useState(START)
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
    <section id="section-stress" aria-labelledby="section-stress-heading" className="mt-8 scroll-mt-28 border border-hud/25 bg-[#0B111C] p-5 sm:p-6 lg:scroll-mt-32" data-beam-section>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 id="section-stress-heading" className="text-xl text-white">Why one revolution is one cycle</h3>
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-amber-200">Conceptual model · not test data</p>
      </div>
      <p className="mt-2 max-w-[65ch] text-sm leading-relaxed text-ti-300">
        The bending moment stays fixed while the specimen turns, so each surface point swings from tension to compression once per turn. Drag the point or use the slider.
      </p>

      <div className="mt-4 aspect-[2/1] w-full border border-white/10 bg-obsidian">
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
      </div>

      <div className="mt-3 flex items-end gap-3">
        <div className="min-w-0 flex-1">
          <label htmlFor={id} className="flex justify-between font-mono text-[11px] text-ti-300">
            Surface point angle from top (°) <output htmlFor={id} className="tabular-nums text-white">{theta}°</output>
          </label>
          <input id={id} type="range" min="0" max="359" value={theta} onChange={(event) => setTheta(Number(event.target.value))} aria-valuetext={`${theta} degrees, ${state}`} className="h-11 w-full cursor-pointer accent-cyan-400 md:h-6" />
        </div>
        <button type="button" onClick={() => setTheta(START)} disabled={theta === START} className={control()}>Reset</button>
      </div>
      <p className="mt-1 font-mono text-[12px] text-white" aria-live="polite" data-beam-sigma={sigma.toFixed(2)}>
        σ / σa = cos θ = <span className="tabular-nums" style={{ color: Math.abs(sigma) < 0.05 ? INK : sigma > 0 ? RED : CYAN }}>{sigma >= 0 ? '+' : '−'}{Math.abs(sigma).toFixed(2)}</span>
        <span className="ml-2 text-ti-400">{state}</span>
      </p>
    </section>
  )
}
