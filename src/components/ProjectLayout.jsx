import { Link } from 'react-router'
import { asset, experiences, misc } from '../data/experiences.js'

// Shared shell for every project subpage (Stark HUD theme), laid out as an
// engineering spec sheet. The 3-bar menu, grid, and corner reticles come from
// RootLayout. This adds, top to bottom:
//   return control → org / title / logo plate → 4-cell spec strip →
//   page sections (children) → previous / next project footer.
//
//   <ProjectLayout project={experiences.find((p) => p.slug === 'honda')}>
//     <section>…</section>
//   </ProjectLayout>

// Walk order for the footer: the seven teeth, then Miscellaneous, then wrap.
const sequence = [...experiences, misc]

const eyebrow = 'font-mono text-[11px] uppercase tracking-[0.24em] text-hud/75'
// Hairline grid: 1px gaps over a tinted backing read as 1px rules at any column count.
const hairlineGrid = 'grid gap-px border border-hud/20 bg-hud/20'

// Marion's red darkens toward the image edge, so its edge is faded into the plate.
const featherMask = {
  maskImage:
    'linear-gradient(to right, transparent, #000 9%, #000 91%, transparent), linear-gradient(to bottom, transparent, #000 9%, #000 91%, transparent)',
  maskComposite: 'intersect',
}

function SpecStrip({ project }) {
  const cells = [
    ['Role', project.specRole || project.role],
    ['Tools / CAD', project.tools],
    ['Domain', project.domain],
    ['Timeline', project.period],
  ]

  return (
    <dl className={`${hairlineGrid} mt-10 sm:grid-cols-2 lg:grid-cols-4`}>
      {cells.map(([term, value]) => (
        <div key={term} className="bg-obsidian px-4 py-3.5">
          <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-hud/65">{term}</dt>
          <dd className="mt-1.5 font-mono text-[13px] leading-snug text-readout">{value}</dd>
        </div>
      ))}
    </dl>
  )
}

function StepLink({ project, direction }) {
  const next = direction === 'next'

  return (
    <Link
      to={project.path}
      rel={next ? 'next' : 'prev'}
      className={`group flex flex-col gap-3 bg-obsidian px-5 py-6 transition-colors hover:bg-hud/[0.06] ${next ? 'sm:items-end sm:text-right' : ''}`}
    >
      <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-hud/75">
        {next ? 'Next →' : '← Previous'}
      </span>
      <span className="text-xl font-medium tracking-[-0.01em] text-readout transition-colors group-hover:text-white">
        {project.index && <span className="mr-3 font-mono text-xs text-hud/60">{project.index}</span>}
        {project.label}
      </span>
    </Link>
  )
}

export default function ProjectLayout({ project, children }) {
  const position = sequence.findIndex((item) => item.slug === project.slug)
  const previous = sequence[(position - 1 + sequence.length) % sequence.length]
  const next = sequence[(position + 1) % sequence.length]

  return (
    <main className="mx-auto min-h-svh max-w-5xl px-6 pb-24 pt-24 text-readout md:px-10">
      <title>{`${project.title || project.label} - Gautham Subramanian`}</title>

      <div className="flex items-center justify-between gap-3">
        <Link
          to="/#gear-hub"
          className="group inline-flex items-center gap-3 border border-hud/45 px-4 py-2.5 font-mono text-xs uppercase tracking-[0.1em] text-hud transition-colors hover:border-hud hover:bg-hud/10"
        >
          <span aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-x-1">
            ←
          </span>
          Return to Gear Hub
        </Link>
        {project.index && (
          <p className="font-mono text-xs tracking-[0.18em] text-hud/60">
            {project.index} / {String(experiences.length).padStart(2, '0')}
          </p>
        )}
      </div>

      <header className="mt-14">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-8">
          <div className="min-w-0 flex-1 basis-72">
            <p className={eyebrow}>{project.org}</p>
            <h1 className="mt-4 text-4xl font-medium leading-[1.08] tracking-[-0.02em] text-white sm:text-5xl">
              {project.title || project.label}
            </h1>
          </div>
          {project.logo && (
            <div
              style={{ backgroundColor: project.plate }}
              className="flex h-28 shrink-0 items-center border border-hud/25 px-6 py-4"
            >
              <img
                src={asset(project.logo)}
                alt={`${project.label} logo`}
                style={project.feather ? featherMask : undefined}
                className="max-h-full max-w-[11rem] object-contain"
              />
            </div>
          )}
        </div>
        <SpecStrip project={project} />
      </header>

      <div className="mt-14">{children}</div>

      <nav aria-label="More projects" className={`${hairlineGrid} mt-20 sm:grid-cols-2`}>
        <StepLink project={previous} direction="previous" />
        <StepLink project={next} direction="next" />
      </nav>
    </main>
  )
}
