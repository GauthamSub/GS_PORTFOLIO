import { useState } from 'react'
import { asset } from '../data/experiences.js'
import { parts, viewLabels, views } from '../data/machineShop.js'
import { control } from '../lib/controls.js'
import { Lightbox } from './MediaGallery.jsx'

// One photo, one selected part, one readout. Markers sit on a box with the
// photo's exact aspect ratio, so fractional anchors land on the image itself.
// The selected part survives a view change; each view uses its own anchors.
export default function MachineShopInspector() {
  const [viewId, setViewId] = useState(views[0].id)
  const [partId, setPartId] = useState(parts[0].id)
  const [enlarged, setEnlarged] = useState(false)
  const view = views.find((item) => item.id === viewId)
  const part = parts.find((item) => item.id === partId)
  const [w, h] = view.size

  // Arrow keys step through the part list (Tab, Enter and Space work natively).
  const stepParts = (event) => {
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[event.key]
    const from = Number(event.target.dataset.index)
    if (!step || Number.isNaN(from)) return
    event.preventDefault()
    const next = (from + step + parts.length) % parts.length
    setPartId(parts[next].id)
    event.currentTarget.querySelectorAll('button')[next].focus()
  }

  // Fetch the other view once the lead photo is in, so the toggle swaps instantly.
  const prefetchOther = () => {
    for (const item of views) if (item.id !== viewId) new Image().src = asset(item.inspectorSrc)
  }

  return (
    <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(16rem,1fr)] lg:gap-10" data-air-motor-inspector>
      <figure className="min-w-0">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div role="group" aria-label="Photo view" className="flex flex-wrap gap-2">
            {views.map((item) => (
              <button key={item.id} type="button" aria-pressed={item.id === viewId} onClick={() => setViewId(item.id)} className={control(item.id === viewId)}>
                {viewLabels[item.id]}
              </button>
            ))}
          </div>
          <button type="button" onClick={() => setEnlarged(true)} className="inline-flex min-h-11 items-center text-sm text-hud underline decoration-hud/40 underline-offset-4 hover:decoration-hud">
            Full image
          </button>
        </div>

        <div className="flex items-center justify-center border border-white/10 bg-[#0B111C] p-2 [--frame:62svh] sm:p-3 lg:[--frame:calc(min(74svh,680px)-1.5rem-2px)]">
          <div className="relative" style={{ aspectRatio: `${w} / ${h}`, width: `min(100%, calc(var(--frame) * ${w} / ${h}))` }}>
            <img
              key={view.id}
              src={asset(view.inspectorSrc)}
              alt={view.alt}
              width={w}
              height={h}
              decoding="async"
              onLoad={prefetchOther}
              className="absolute inset-0 h-full w-full"
            />
            {parts.map((item) => {
              const [x, y] = view.anchors[item.id]
              const on = item.id === partId
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={on}
                  aria-label={`Photo marker ${item.number}: ${item.label}`}
                  onClick={() => setPartId(item.id)}
                  style={{ left: `${x * 100}%`, top: `${y * 100}%` }}
                  className="group absolute flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-hud"
                >
                  <span
                    aria-hidden="true"
                    className={`flex size-8 items-center justify-center rounded-full border font-mono text-xs font-semibold shadow-[0_1px_6px_rgba(0,0,0,0.65)] transition-colors ${
                      on ? 'border-white bg-hud text-obsidian' : 'border-white/75 bg-obsidian/85 text-white group-hover:border-hud'
                    }`}
                  >
                    {item.number}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
        <figcaption className="mt-3 text-sm text-ti-300">{view.caption}</figcaption>
      </figure>

      <div className="min-w-0">
        <h3 id="air-motor-parts" className="font-mono text-[11px] uppercase tracking-[0.16em] text-ti-400">Components</h3>
        <ul aria-labelledby="air-motor-parts" onKeyDown={stepParts} className="mt-3 grid grid-cols-2 gap-1.5 lg:grid-cols-1">
          {parts.map((item, i) => {
            const on = item.id === partId
            return (
              <li key={item.id} className="min-w-0">
                <button
                  type="button"
                  data-index={i}
                  aria-pressed={on}
                  onClick={() => setPartId(item.id)}
                  className={`flex min-h-11 w-full items-center gap-3 border px-3 py-2 text-left text-sm leading-snug transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hud sm:text-[15px] ${
                    on ? 'border-hud bg-hud/10 text-white' : 'border-white/10 text-ti-100 hover:border-hud/60'
                  }`}
                >
                  <span className={`font-mono text-xs ${on ? 'text-hud' : 'text-ti-400'}`}>{item.number}</span>
                  {item.label}
                </button>
              </li>
            )
          })}
        </ul>

        <div aria-live="polite" className="mt-6 border-t border-white/10 pt-5">
          <p className="font-mono text-xs text-hud">{part.number}</p>
          <p className="mt-1 text-xl text-white">{part.label}</p>
          <p className="mt-2 text-[15px] leading-relaxed text-ti-300">{part.description}</p>
          <ul aria-label="Visible features" className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 font-mono text-xs text-ti-100">
            {part.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-hud" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-6 border-l border-white/15 pl-3 text-sm leading-relaxed text-ti-400">
          Labels describe visible machined geometry. Functional part names, alloys and per-part machining steps are not confirmed.
        </p>
      </div>

      <Lightbox
        image={enlarged ? view : null}
        position={viewLabels[view.id]}
        onClose={() => setEnlarged(false)}
      />
    </div>
  )
}
