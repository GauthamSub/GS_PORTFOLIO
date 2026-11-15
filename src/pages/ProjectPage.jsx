import ProjectLayout from '../components/ProjectLayout.jsx'
import MediaGallery from '../components/MediaGallery.jsx'
import { asset } from '../data/experiences.js'
import { caseStudies } from '../data/projectDetails.js'

// One spec-sheet row: mono label in the left rail, content on the right.
function Block({ number, label, children }) {
  const id = `${label.toLowerCase().replace(/\W+/g, '-')}-heading`

  return (
    <section
      aria-labelledby={id}
      className="grid gap-x-10 gap-y-5 border-t border-hud/20 py-10 first:border-t-0 first:pt-0 md:grid-cols-[11rem_minmax(0,1fr)]"
    >
      <h2 id={id} className="font-mono text-[11px] uppercase leading-relaxed tracking-[0.22em] text-hud/75">
        <span className="mr-3 text-readout/40">{number}</span>
        {label}
      </h2>
      <div className="min-w-0">{children}</div>
    </section>
  )
}

export default function ProjectPage({ project }) {
  const details = caseStudies[project.slug]
  const hasDocuments = details.documents.length > 0

  // Media and Documents only exist when there is something real to show.
  const blocks = [
    {
      label: 'Engineering objective',
      body: <p className="max-w-[58ch] text-xl leading-relaxed text-white/90">{details.objective}</p>,
    },
    {
      label: 'Methodology',
      body: (
        <div className="divide-y divide-white/[0.07]">
          {details.methods.map(([title, text]) => (
            <div key={title} className="py-6 first:pt-0 last:pb-0">
              <h3 className="text-lg font-medium text-white">{title}</h3>
              <p className="mt-2 max-w-[65ch] leading-relaxed text-readout/80">{text}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      label: 'Key outcomes',
      body: (
        <ul className="max-w-[65ch] space-y-3.5 leading-relaxed text-readout/90">
          {details.outcomes.map((outcome) => (
            <li key={outcome} className="flex gap-4">
              <span aria-hidden="true" className="mt-[0.8em] h-px w-4 shrink-0 bg-hud/70" />
              {outcome}
            </li>
          ))}
        </ul>
      ),
    },
    details.images.length > 0 && {
      label: 'Media gallery',
      body: <MediaGallery images={details.images} />,
    },
    (hasDocuments || details.mediaNote) && {
      label: 'Documents',
      body: (
        <>
          {details.mediaNote && (
            <p className="mb-6 max-w-[65ch] leading-relaxed text-readout/75">{details.mediaNote}</p>
          )}
          {hasDocuments && (
            <ul className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
              {details.documents.map(([href, label]) => (
                <li key={href}>
                  <a
                    href={asset(href)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between gap-5 py-4 text-readout transition-colors hover:text-hud"
                  >
                    <span>{label}</span>
                    <span className="shrink-0 font-mono text-xs text-hud">PDF ↗</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </>
      ),
    },
  ].filter(Boolean)

  return (
    <ProjectLayout project={{ ...project, title: details.title }}>
      {blocks.map((block, i) => (
        <Block key={block.label} number={String(i + 1).padStart(2, '0')} label={block.label}>
          {block.body}
        </Block>
      ))}
    </ProjectLayout>
  )
}
