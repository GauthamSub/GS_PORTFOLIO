import { Link } from 'react-router'
import { asset, experiences, misc } from '../data/experiences.js'
import { thumbnail } from '../data/media.js'

// Shared shell for every project subpage (Stark HUD theme), laid out as an
// engineering spec sheet. The 3-bar menu, grid, and corner reticles come from
// RootLayout. This adds, top to bottom:
//   back link → org / title / logo plate → my contribution → result →
//   team scope → primary artifact → facts line → anchor links →
//   page sections (children) → previous / next project footer.
//
//   <ProjectLayout
//     project={experiences.find((p) => p.slug === 'honda')}
//     contribution="What I did." result="What it showed." team="Team scope."
//     anchors={[['artifact', 'Artifact'], ['decisions', 'Decisions']]}
//   >
//     <section id="artifact" className={anchorOffset}>…</section>
//   </ProjectLayout>

// Put this on every anchor target. The menu button and the top band are fixed
// over the first 6rem (7rem on lg), so a target must stop below them.
export const anchorOffset = 'scroll-mt-28 lg:scroll-mt-32'

// Walk order for the footer: the seven teeth, then Miscellaneous, then wrap.
const sequence = [...experiences, misc]

const eyebrow = 'font-mono text-xs uppercase tracking-[0.18em] text-ti-400'
// Hairline grid: 1px gaps over a tinted backing read as 1px rules at any column count.
// Used only for the previous / next links, which are real controls.
const hairlineGrid = 'grid gap-px border border-white/10 bg-white/10'

// Marion's red darkens toward the image edge, so its edge is faded into the plate.
const featherMask = {
  maskImage:
    'linear-gradient(to right, transparent, #000 9%, #000 91%, transparent), linear-gradient(to bottom, transparent, #000 9%, #000 91%, transparent)',
  maskComposite: 'intersect',
}

// Role, tools, domain, timeline: one quiet line of facts under the artifact.
function SpecStrip({ project }) {
  const cells = [
    ['Role', project.specRole || project.role],
    ['Tools', project.tools],
    ['Domain', project.domain],
    ['Timeline', project.period],
  ].filter(([, value]) => value)

  return (
    <dl aria-label="Project facts" className="mt-10 grid grid-cols-2 gap-x-8 gap-y-5 border-t border-white/10 pt-6 lg:grid-cols-4">
      {cells.map(([term, value]) => (
        <div key={term} className="min-w-0">
          <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-ti-400">{term}</dt>
          <dd className="mt-1.5 break-words text-[15px] leading-snug text-ti-100">{value}</dd>
        </div>
      ))}
    </dl>
  )
}

// Proof-first opening: what I did, what it showed, and what was team work.
function Proof({ contribution, result, team }) {
  const rows = [
    ['My contribution', contribution],
    ['Result', result],
    ['Team scope', team],
  ].filter(([, text]) => text)
  if (!rows.length) return null
  return (
    <dl className="mt-8 max-w-[68ch] space-y-5">
      {rows.map(([term, text], i) => (
        <div key={term}>
          <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-ti-400">{term}</dt>
          <dd className={`mt-1.5 leading-relaxed ${i === 0 ? 'text-lg text-white sm:text-xl' : 'text-ti-100'}`}>{text}</dd>
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
      <span className="font-mono text-xs uppercase tracking-[0.16em] text-ti-400">
        {next ? 'Next →' : '← Previous'}
      </span>
      <span className="text-xl font-medium tracking-[-0.01em] text-readout transition-colors group-hover:text-white">
        {project.label}
      </span>
    </Link>
  )
}

export default function ProjectLayout({ project, contribution, result, team, brief, anchors = [], primaryArtifact, indexControls, children }) {
  const position = sequence.findIndex((item) => item.slug === project.slug)
  const previous = sequence[(position - 1 + sequence.length) % sequence.length]
  const next = sequence[(position + 1) % sequence.length]

  return (
    <main className="reading-surface mx-auto min-h-svh max-w-5xl px-6 pb-24 pt-24 text-readout md:px-10 lg:pt-28">
      <title>{`${project.title || project.label} - Gautham Subramanian`}</title>

      <Link to="/#gear-hub" className="group inline-flex min-h-11 items-center gap-2 text-sm text-ti-300 transition-colors hover:text-hud">
        <span aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
        All work
      </Link>

      <header className="mt-6 sm:mt-10">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
          <div className="min-w-0 flex-1 basis-72">
            <p className={eyebrow}>{project.org}</p>
            <h1 className="mt-2 text-3xl font-medium leading-[1.08] tracking-[-0.02em] text-white sm:mt-4 sm:text-5xl">
              <span className="sm:hidden">{project.mobileTitle || project.label}</span>
              <span className="hidden sm:inline">{project.title || project.label}</span>
            </h1>
          </div>
          {project.logo && (
            <div
              style={{ backgroundColor: project.plate }}
              className="hidden h-24 shrink-0 items-center rounded-sm px-6 py-4 sm:flex"
            >
              <img
                src={asset(thumbnail(project.logo))}
                alt={`${project.label} logo`}
                style={project.feather ? featherMask : undefined}
                className="max-h-full max-w-[11rem] object-contain"
              />
            </div>
          )}
        </div>
        {brief && <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-ti-100">{brief}</p>}
        <Proof contribution={contribution} result={result} team={team} />
      </header>

      {indexControls && <div className="mt-8">{indexControls}</div>}
      {primaryArtifact && <div className="mt-10">{primaryArtifact}</div>}
      {project.slug !== 'drawings' && <SpecStrip project={project} />}
      {/* Plain hash links: the browser moves both the scroll position and the
          keyboard starting point to the target. */}
      {anchors.length > 1 && (
        <nav aria-label="On this page" className="mt-6">
          <ul className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
            {anchors.map(([id, label]) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="inline-flex min-h-[44px] items-center text-ti-100 underline decoration-white/25 underline-offset-[5px] transition-colors hover:text-hud hover:decoration-hud"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <div className="mt-12">{children}</div>

      <nav aria-label="More projects" className={`${hairlineGrid} mt-20 sm:grid-cols-2`}>
        <StepLink project={previous} direction="previous" />
        <StepLink project={next} direction="next" />
      </nav>
    </main>
  )
}
