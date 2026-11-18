import ProjectLayout, { anchorOffset } from '../components/ProjectLayout.jsx'
import MediaGallery from '../components/MediaGallery.jsx'
import ParkSenseSimulator from '../components/ParkSenseSimulator.jsx'
import ParkSenseSchematic from '../components/ParkSenseSchematic.jsx'
import NasaSubsystems from '../components/NasaSubsystems.jsx'
import GearLabWalkthrough from '../components/GearLabWalkthrough.jsx'
import EchoVisionPackaging from '../components/EchoVisionPackaging.jsx'
import DeadboltInspector from '../components/DeadboltInspector.jsx'
import BuildPack from '../components/BuildPack.jsx'
import StopArmViews from '../components/StopArmViews.jsx'
import MarionIterations from '../components/MarionIterations.jsx'
import { asset } from '../data/experiences.js'
import { caseStudies } from '../data/projectDetails.js'

// Proof-first order, top to bottom:
//   contribution → result → team scope (ProjectLayout) → #artifact →
//   trade-off / failure-mode strip → #decisions (methodology, outcomes) →
//   supporting media → #documents

// Interactive primary artifacts, by slug. `shown` is how many of the case
// study's images the module already displays; the supporting gallery skips them.
const modules = {
  // Simulator, then the wiring diagram matched to the prototype photo.
  parksense: {
    shown: 2,
    render: () => (
      <div className="space-y-6">
        <ParkSenseSimulator />
        <ParkSenseSchematic />
        <StopArmViews />
        <BuildPack />
      </div>
    ),
  },
  gearlab: { shown: 0, render: () => <GearLabWalkthrough /> },
  echovision: { shown: 3, render: () => <EchoVisionPackaging /> },
  // /misc leads with the deadbolt lock drawings; its two images stay in the gallery.
  misc: { shown: 0, render: () => <DeadboltInspector /> },
  // The NASA gallery repeats the module's images on purpose: the certificate
  // and both drawings stay browsable at full size.
  nasa: { shown: 0, render: (details) => <NasaSubsystems images={details.images} /> },
}

// One spec-sheet row: mono label in the left rail, content on the right.
// `wide` stacks the label above the content, which then gets the full page width.
function Block({ id, label, wide, children }) {
  const headingId = `${label.toLowerCase().replace(/\W+/g, '-')}-heading`

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={`grid gap-x-10 gap-y-5 border-t border-white/10 py-12 first:border-t-0 first:pt-0 ${wide ? '' : 'md:grid-cols-[11rem_minmax(0,1fr)]'} ${id ? anchorOffset : ''}`}
    >
      <h2 id={headingId} className="font-mono text-xs uppercase leading-relaxed tracking-[0.16em] text-ti-400">
        {label}
      </h2>
      <div className="min-w-0">{children}</div>
    </section>
  )
}

// Compact callout under the artifact: the trade-off made, or the failure found.
function TradeOff({ tradeoff: [kind, title, text] }) {
  return (
    <aside
      aria-label={kind}
      className="mb-10 grid gap-x-10 gap-y-2 border-l-2 border-white/20 pl-4 md:grid-cols-[calc(11rem-1rem-2px)_minmax(0,1fr)]"
    >
      <p className="font-mono text-xs uppercase leading-relaxed tracking-[0.16em] text-ti-400">{kind}</p>
      <p className="max-w-[65ch] leading-relaxed text-ti-100">
        <strong className="font-medium text-white">{title}.</strong> {text}
      </p>
    </aside>
  )
}

function PdfArtifact({ document: [href, label] }) {
  return (
    <div>
      <h3 className="text-xl text-white">{label}</h3>
      <a href={asset(href)} target="_blank" rel="noreferrer" className="mt-4 inline-block text-hud underline underline-offset-4">
        Open engineering document (PDF)
      </a>
    </div>
  )
}

export default function ProjectPage({ project }) {
  const details = caseStudies[project.slug]
  const module = modules[project.slug]
  const hasDocuments = details.documents.length > 0
  const gallery = project.slug === 'parksense' ? [] : details.images.slice(module ? module.shown : 1)

  const proof = { contribution: details.contribution, result: details.result, team: details.team }
  if (project.slug === 'honda') return <ProjectLayout project={{ ...project, title: 'Incoming Spring 2027 Co-op', mobileTitle: 'Incoming Spring 2027 Co-op' }} {...proof} />

  const artifact = project.slug === 'marion' ? (
    <MarionIterations />
  ) : project.slug === 'onramp' ? (
    <div>
      <h3 className="text-xl text-white">10+ stakeholder interviews → Reph concept</h3>
      <p className="my-4 text-sm leading-relaxed text-hud">Customer / partner interviews → field observations → proposed pickleball platform</p>
      <MediaGallery images={[details.images[0]]} />
      <ol className="my-5 grid gap-4 text-sm leading-relaxed sm:grid-cols-3">
        <li><strong className="text-hud">Listen.</strong> Interviews with customers and partners examined officiating needs and automated refereeing during play.</li>
        <li><strong className="text-hud">Observe.</strong> Field observations informed the concept; court discovery, matchmaking, and line disputes appear in the team deck.</li>
        <li><strong className="text-hud">Propose.</strong> Reph combines smartphone ball tracking, court maps, coaching, and stored clips. This is a team proposal, not validated referee hardware.</li>
      </ol>
    </div>
  ) : module ? (
    module.render(details)
  ) : details.images.length > 0 ? (
    <MediaGallery images={[details.images[0]]} />
  ) : hasDocuments ? (
    <PdfArtifact document={details.documents[0]} />
  ) : null

  // Media and Documents only exist when there is something real to show.
  const blocks = [
    {
      id: 'decisions',
      label: 'Methodology',
      body: (
        <div className="divide-y divide-white/[0.07]">
          {details.methods.map(([title, text]) => (
            <div key={title} className="py-6 first:pt-0 last:pb-0">
              <h3 className="text-lg font-medium text-white">{title}</h3>
              <p className="mt-2 max-w-[65ch] leading-relaxed text-ti-300">{text}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      label: 'Key outcomes',
      body: (
        <ul className="max-w-[65ch] space-y-3.5 leading-relaxed text-ti-300">
          {details.outcomes.map((outcome) => (
            <li key={outcome} className="flex gap-4">
              <span aria-hidden="true" className="mt-[0.8em] h-px w-4 shrink-0 bg-hud/70" />
              {outcome}
            </li>
          ))}
        </ul>
      ),
    },
    gallery.length > 0 && {
      label: 'Supporting media',
      body: <MediaGallery images={gallery} />,
    },
    (hasDocuments || details.mediaNote) && {
      id: 'documents',
      label: 'Documents',
      body: (
        <>
          {details.mediaNote && (
            <p className="mb-6 max-w-[65ch] leading-relaxed text-ti-300">{details.mediaNote}</p>
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
                    <span className="shrink-0 font-mono text-xs text-hud">Open PDF ↗</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </>
      ),
    },
  ].filter(Boolean)

  const anchorLabels = { artifact: 'Artifact', decisions: 'Method', documents: 'Documents' }
  const anchors = [...(artifact ? [['artifact', 'Artifact']] : []), ...blocks.filter((block) => block.id).map((block) => [block.id, anchorLabels[block.id]])]

  return (
    <ProjectLayout project={{ ...project, title: details.title }} {...proof} anchors={anchors}
      primaryArtifact={artifact && <section id="artifact" aria-label="Primary engineering artifact" className={anchorOffset}>{artifact}</section>}>
      {details.tradeoff && <TradeOff tradeoff={details.tradeoff} />}
      {blocks.flatMap((block) => [
        <Block key={block.label} id={block.id} label={block.label} wide={block.wide}>
          {block.body}
        </Block>,
        block.after && <TradeOff key="tradeoff" tradeoff={block.after} />,
      ])}
    </ProjectLayout>
  )
}
