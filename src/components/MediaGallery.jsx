import { useEffect, useRef, useState } from 'react'
import { asset } from '../data/experiences.js'

// Light matte for white-paper material only (`lightMatte: true` in projectDetails).
const matte = (image) => (image.lightMatte ? { backgroundColor: '#F4F6F8' } : undefined)

// Native <dialog>: the browser handles Esc, focus trapping, and stacking above
// the fixed menu button. Clicking the dark area around the image closes it.
function Lightbox({ image, position, onClose }) {
  const ref = useRef(null)

  useEffect(() => {
    const dialog = ref.current
    if (image && !dialog.open) dialog.showModal()
    if (!image && dialog.open) dialog.close()
  }, [image])

  return (
    <dialog
      ref={ref}
      aria-label={image ? image.alt : undefined}
      onClose={onClose}
      onClick={(event) => event.target === event.currentTarget && onClose()}
      className="lightbox m-0 h-dvh max-h-none w-full max-w-none cursor-zoom-out flex-col items-center justify-center overflow-auto overscroll-contain border-0 bg-obsidian/[0.97] p-4 text-readout backdrop:bg-obsidian open:flex sm:p-10"
    >
      {image && (
        <>
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 cursor-pointer border border-white/15 bg-obsidian px-3 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-readout/80 transition-colors hover:border-hud hover:text-hud"
          >
            Close <span className="text-readout/45">Esc</span>
          </button>
          <figure className="flex max-w-full cursor-default flex-col">
            <img
              src={asset(image.src)}
              alt={image.alt}
              style={matte(image)}
              className="max-h-[calc(100dvh-10rem)] max-w-full border border-white/10 object-contain"
            />
            <figcaption className="mt-4 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 font-mono text-xs text-readout/80">
              <span>{image.caption}</span>
              <span className="flex items-baseline gap-6 text-readout/50">
                {position}
                <a
                  href={asset(image.src)}
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
export default function MediaGallery({ images }) {
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
                  src={asset(image.src)}
                  alt={image.alt}
                  loading="lazy"
                  style={matte(image)}
                  className={`w-full object-contain ${wide ? 'h-72 sm:h-[26rem]' : 'h-64 sm:h-72'}`}
                />
                <span
                  aria-hidden="true"
                  className="absolute right-5 top-5 border border-white/15 bg-obsidian/85 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-readout/85 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
                >
                  Enlarge
                </span>
              </button>
              <figcaption className="border-t border-white/[0.08] px-4 py-3 font-mono text-xs leading-relaxed text-readout/70">
                {image.caption}
              </figcaption>
            </figure>
          )
        })}
      </div>
      <Lightbox image={open} position={open && `${openIndex + 1} / ${images.length}`} onClose={() => setOpenIndex(null)} />
    </>
  )
}
