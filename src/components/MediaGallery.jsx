import { useEffect, useRef, useState } from 'react'
import { asset } from '../data/experiences.js'
import { thumbnail } from '../data/media.js'
import { control } from '../lib/controls.js'

// Light matte for white-paper material only (`lightMatte: true` in projectDetails).
const matte = (image) => (image.lightMatte ? { backgroundColor: '#F4F6F8' } : undefined)

// Native <dialog>: the browser handles Esc, focus trapping, and stacking above
// the fixed menu button. Clicking the dark area around the image closes it.
function Lightbox({ image, position, onClose, onPrevious, onNext, multiple }) {
  const ref = useRef(null)
  const viewport = useRef(null)
  const drag = useRef(null)
  const [zoom, setZoom] = useState(1)
  const [natural, setNatural] = useState([1, 1])
  const [space, setSpace] = useState([1, 1])

  useEffect(() => {
    const dialog = ref.current
    if (image && !dialog.open) dialog.showModal()
    if (!image && dialog.open) dialog.close()
  }, [image])

  useEffect(() => {
    if (!image) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previous }
  }, [Boolean(image)])

  useEffect(() => {
    setZoom(1)
    if (viewport.current) viewport.current.scrollTo(0, 0)
  }, [image?.src])

  useEffect(() => {
    if (!image || !viewport.current) return
    const observer = new ResizeObserver(([entry]) => {
      setSpace([entry.contentRect.width, entry.contentRect.height])
    })
    observer.observe(viewport.current)
    return () => observer.disconnect()
  }, [Boolean(image)])

  const fit = Math.min(space[0] / natural[0], space[1] / natural[1], 1)
  const button = control()

  return (
    <dialog
      ref={ref}
      aria-label={image ? image.alt : undefined}
      onClose={onClose}
      onKeyDown={(event) => {
        if (multiple && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
          event.preventDefault()
          if (event.key === 'ArrowLeft') onPrevious()
          else onNext()
        }
      }}
      onClick={(event) => event.target === event.currentTarget && onClose()}
      className="lightbox m-0 h-dvh max-h-none w-full max-w-none flex-col gap-3 overflow-hidden overscroll-contain border-0 bg-obsidian/[0.97] p-3 text-readout backdrop:bg-obsidian open:flex sm:p-6"
    >
      {image && (
        <>
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-2" aria-label="Image controls">
            <div className="flex flex-wrap items-center gap-2">
              {multiple && <><button type="button" className={button} onClick={onPrevious} aria-label="Previous image">←</button><button type="button" className={button} onClick={onNext} aria-label="Next image">→</button></>}
              <button type="button" className={button} disabled={zoom <= 1} onClick={() => setZoom((value) => Math.max(1, value - 0.5))} aria-label="Zoom out">−</button>
              <button type="button" className={button} disabled={zoom >= 6} onClick={() => setZoom((value) => Math.min(6, value + 0.5))} aria-label="Zoom in">+</button>
              <button type="button" className={button} onClick={() => { setZoom(1); viewport.current?.scrollTo(0, 0) }}>Reset</button>
              <output className="font-mono text-xs" aria-live="polite">{Math.round(zoom * 100)}%</output>
            </div>
            <button type="button" onClick={onClose} className={button}>Close <span className="text-ti-300">Esc</span></button>
          </div>
          <figure className="flex min-h-0 w-full flex-1 flex-col gap-3">
            <div ref={viewport} tabIndex={0} aria-label="Image viewport; scroll to pan when zoomed" className="min-h-0 flex-1 overflow-auto border border-white/10" style={{ cursor: zoom > 1 ? 'grab' : 'default' }}
              onPointerDown={(event) => {
                if (zoom <= 1 || event.pointerType !== 'mouse') return
                drag.current = [event.clientX, event.clientY, event.currentTarget.scrollLeft, event.currentTarget.scrollTop]
                event.currentTarget.setPointerCapture(event.pointerId)
                event.preventDefault()
              }}
              onPointerMove={(event) => {
                if (!drag.current) return
                const [x, y, left, top] = drag.current
                event.currentTarget.scrollTo(left + x - event.clientX, top + y - event.clientY)
              }}
              onPointerUp={() => { drag.current = null }} onPointerCancel={() => { drag.current = null }}
            >
              <div className="grid min-h-full min-w-full place-items-center" style={{ width: Math.round(natural[0] * fit * zoom), height: Math.round(natural[1] * fit * zoom) }}>
                <img src={asset(image.fullSrc || image.src)} alt={image.alt} draggable={false}
                  onLoad={(event) => setNatural([event.currentTarget.naturalWidth, event.currentTarget.naturalHeight])}
                  style={{ ...matte(image), width: Math.round(natural[0] * fit * zoom), height: Math.round(natural[1] * fit * zoom), maxWidth: 'none' }}
                  className="object-contain"
                />
              </div>
            </div>
            <figcaption className="flex shrink-0 flex-wrap items-baseline justify-between gap-x-8 gap-y-2 font-mono text-xs text-ti-300">
              <span>{image.caption}</span>
              <span className="flex items-baseline gap-6 text-ti-300">
                {position}
                <a
                  href={asset(image.originalSrc || image.fullSrc || image.src)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-hud underline decoration-hud/40 underline-offset-4 hover:decoration-hud"
                >
                  Open original ↗
                </a>
              </span>
            </figcaption>
          </figure>
        </>
      )}
    </dialog>
  )
}

// Dark-framed gallery cards. With an odd count the first image runs full width,
// so three images read as one lead plus a pair instead of a grid with a hole.
export default function MediaGallery({ images, compact = false }) {
  const [openIndex, setOpenIndex] = useState(null)
  const lead = images.length % 2 === 1
  const open = openIndex === null ? null : images[openIndex]

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2">
        {images.map((image, i) => {
          const wide = lead && i === 0
          return (
            <figure
              key={image.src}
              className={`group min-w-0 border border-white/[0.08] bg-[#0B111C] transition-colors hover:border-hud/40 ${wide ? 'sm:col-span-2' : ''}`}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(i)}
                aria-label={`Enlarge: ${image.alt}`}
                className="relative block w-full cursor-zoom-in p-3"
              >
                <img
                  src={asset(image.previewSrc || thumbnail(image.src))}
                  alt={image.alt}
                  loading="lazy"
                  style={matte(image)}
                  className={`w-full object-contain ${compact ? 'h-48' : wide ? 'h-72 sm:h-[26rem]' : 'h-64 sm:h-72'}`}
                />
                <span
                  aria-hidden="true"
                  className="absolute right-5 top-5 border border-white/15 bg-obsidian/85 px-2 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-ti-300 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
                >
                  Enlarge
                </span>
              </button>
              <figcaption className="border-t border-white/[0.08] px-4 py-3 text-sm leading-relaxed text-ti-300">
                {image.caption}
              </figcaption>
            </figure>
          )
        })}
      </div>
      <Lightbox image={open} position={open && `${openIndex + 1} / ${images.length}`} onClose={() => setOpenIndex(null)} multiple={images.length > 1}
        onPrevious={() => setOpenIndex((index) => (index - 1 + images.length) % images.length)}
        onNext={() => setOpenIndex((index) => (index + 1) % images.length)} />
    </>
  )
}
