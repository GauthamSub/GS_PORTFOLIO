import { asset } from '../data/experiences.js'
import { thumbnail } from '../data/media.js'

// A photo or diagram with selectable regions.
//
//   image:   { src, alt, lightMatte? }
//   regions: [{ id, label, box?, inferred? }]
//     box is [left, top, width, height] in percent of the image. A region with
//     no box is listed by the caller but has nothing to outline here.
//     `inferred` draws a dashed outline: the part is not visible in the image.
//
// The selected region is outlined and the rest of the image is dimmed. The
// overlay targets are a pointer shortcut only (hidden from assistive tech and
// the tab order); callers render the real, labelled buttons next to the figure.
export default function AnnotatedFigure({ image, regions, selected, onSelect, caption }) {
  return (
    <figure className="min-w-0 border border-white/[0.08] bg-[#0B111C]">
      <div className="p-3">
        <div
          className="relative overflow-hidden"
          style={image.lightMatte ? { backgroundColor: '#F4F6F8' } : undefined}
        >
          <img src={asset(thumbnail(image.src))} alt={image.alt} loading="lazy" className="block h-auto w-full" />
          {regions
            .filter((region) => region.box)
            .map((region) => {
              const [left, top, width, height] = region.box
              const isSelected = region.id === selected
              return (
                <button
                  key={region.id}
                  type="button"
                  tabIndex={-1}
                  aria-hidden="true"
                  data-region={region.id}
                  data-selected={isSelected}
                  onClick={() => onSelect(region.id)}
                  style={{ left: `${left}%`, top: `${top}%`, width: `${width}%`, height: `${height}%` }}
                  className={`absolute cursor-pointer border-2 transition-[border-color,box-shadow] duration-200 ${
                    region.inferred ? 'border-dashed' : ''
                  } ${
                    isSelected
                      ? 'z-10 border-hud shadow-[0_0_0_200vmax_rgb(5_8_15/0.5)]'
                      : 'border-transparent hover:border-hud/60'
                  }`}
                >
                  {isSelected && (
                    // Tag above the box; below it near the top edge; inside it
                    // when the box runs nearly the full height of the image.
                    <span
                      className={`absolute left-[-2px] whitespace-nowrap bg-hud px-1.5 py-0.5 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-obsidian ${
                        top > 14 ? 'bottom-full' : top + height < 86 ? 'top-full' : 'top-[-2px]'
                      }`}
                    >
                      {region.label}
                    </span>
                  )}
                </button>
              )
            })}
        </div>
      </div>
      {caption && (
        <figcaption className="border-t border-white/[0.08] px-4 py-3 text-sm leading-relaxed text-ti-300">
          {caption}
        </figcaption>
      )}
      <a href={asset(image.src)} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center px-4 py-2 text-sm text-hud underline underline-offset-4">Open full-resolution image</a>
    </figure>
  )
}
