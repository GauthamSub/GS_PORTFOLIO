import { Link } from 'react-router'
import { asset, featured, workLinks } from '../data/experiences.js'
import { thumbnail } from '../data/media.js'

// The three lead projects at the top of the dark hub. Every card has the same
// frame: a 4:3 light matte for drawings or a cropped photo, the project name,
// its status, what I did, and one link. Numbers live in the gear telemetry and
// the case study, not here, so adjacent blocks never repeat a stat.
export function FeaturedCards() {
  return (
    <ul aria-label="Featured work" className="grid gap-8 md:grid-cols-3">
      {featured.map((item) => (
        <li key={item.slug} className="min-w-0">
          <Link to={item.path} className="group flex h-full flex-col focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-hud">
            <span className={`block aspect-[4/3] overflow-hidden rounded-sm ring-1 ring-white/10 transition group-hover:ring-hud/60 ${item.light ? 'bg-[#F4F6F8] p-3' : 'bg-panel'}`}>
              <img
                src={asset(thumbnail(item.image))}
                alt={item.alt}
                loading="lazy"
                className={`h-full w-full ${item.light ? 'object-contain' : 'object-cover'}`}
              />
            </span>
            <span className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-xl font-medium tracking-[-0.01em]"><span className="text-titanium">{item.title}</span></span>
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ti-400">{item.status}</span>
            </span>
            <span className="mt-2 text-[15px] leading-relaxed text-ti-100">{item.contribution}</span>
            <span className="mt-auto pt-4 text-sm text-hud underline decoration-hud/30 underline-offset-4 transition-colors group-hover:decoration-hud">
              {workLinks[item.slug]} <span aria-hidden="true">→</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
