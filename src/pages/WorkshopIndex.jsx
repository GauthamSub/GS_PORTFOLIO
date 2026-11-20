import { Link } from 'react-router'
import ProjectLayout from '../components/ProjectLayout.jsx'
import DeadboltInspector from '../components/DeadboltInspector.jsx'
import { asset, misc } from '../data/experiences.js'
import { thumbnail } from '../data/media.js'

// Compact entries: one artifact, one engineering decision, one link.
const entries = [
  {
    id: 'air-motor',
    title: 'ME2900 Air Motor — Machining', scope: 'ME 2900 · Fabrication',
    decision: 'Four air motor components machined in the ME 2900 shop, annotated by their visible geometry; assembly pending.',
    image: '/assets/machine-shop-me2900/previews/IMG_8644.webp', alt: 'Machined air motor components: engraved block, square plate, slotted part and link',
    position: '50% 55%',
    path: '/workshop/air-motor', linkLabel: 'Inspect the machined parts',
  },
  {
    id: 'lego-rover',
    title: 'LEGO Mindstorms Mars Rover', scope: 'Coursework · robotics',
    decision: 'A custom claw handles the mission tasks; Arduino distance sensors drive LED feedback. Separate from the NASA L’SPACE rover.',
    image: '/assets/Mars Rover.png', alt: 'LEGO Mindstorms rover coursework poster', light: true,
    href: '/assets/Mars Rover Lab report.pdf', linkLabel: 'Open the lab report (PDF)',
  },
  {
    title: '3D-printed enclosure', scope: 'Personal fabrication',
    decision: 'Printed the EchoVision housing so the camera, board, battery and speaker hold one fixed field of view.',
    image: '/assets/echovision/enclosure.jpg', alt: 'EchoVision printed enclosure',
    path: '/project/echovision', linkLabel: 'See the EchoVision packaging',
  },
  {
    title: 'Deadbolt lock drawings', scope: 'ENGR 1182 · SolidWorks',
    decision: 'Drew the plate, dial and deadbolt as separate dimensioned sheets; the set does not define the full mating geometry.',
    image: '/assets/deadbolt/deadbolt-subassembly.png', alt: 'Deadbolt subassembly drawing', light: true,
    path: '/drawings', linkLabel: 'Open the drawing set',
  },
  {
    title: 'SideQuest', scope: 'HackOHI/O 2026 · software',
    decision: 'Campus exploration web app built for HackOHI/O 2026. No demo or source is published here.',
  },
]

function Entry({ entry }) {
  const link = entry.href
    ? <a href={asset(entry.href)} target="_blank" rel="noreferrer" className="text-sm text-hud underline underline-offset-4">{entry.linkLabel} ↗</a>
    : entry.path && <Link to={entry.path} className="text-sm text-hud underline underline-offset-4">{entry.linkLabel} →</Link>
  return (
    <article id={entry.id} className="grid min-w-0 scroll-mt-28 grid-cols-[6.5rem_minmax(0,1fr)] gap-5 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-6">
      {entry.image
        ? <span className={`block aspect-[4/3] overflow-hidden rounded-sm ring-1 ring-white/10 ${entry.light ? 'bg-[#F4F6F8] p-1.5' : ''}`}><img src={asset(thumbnail(entry.image))} alt={entry.alt} loading="lazy" style={entry.position ? { objectPosition: entry.position } : undefined} className={`h-full w-full ${entry.light ? 'object-contain' : 'object-cover'}`} /></span>
        : <span aria-hidden="true" />}
      <div className="min-w-0">
        <h2 className="text-lg text-white">{entry.title} <span className="ml-2 font-mono text-[11px] uppercase tracking-[0.14em] text-ti-400">{entry.scope}</span></h2>
        <p className="mt-2 max-w-[62ch] text-[15px] leading-relaxed text-ti-300">{entry.decision}</p>
        {link && <p className="mt-3">{link}</p>}
      </div>
    </article>
  )
}

export default function WorkshopIndex() {
  return (
    <ProjectLayout project={{ ...misc, title: 'Workshop' }} brief="Coursework and side builds in robotics, printed hardware and campus software." anchors={[["builds", "Builds"], ["lock", "Deadbolt inspection"]]}>
      <section id="builds" className="scroll-mt-32" aria-label="Workshop build index">
        <div className="space-y-10">
          {entries.map((entry) => <Entry key={entry.title} entry={entry} />)}
        </div>
      </section>
      <section id="lock" className="mt-14 scroll-mt-32 border-t border-white/10 pt-10" aria-labelledby="workshop-lock-title">
        <h2 id="workshop-lock-title" className="mb-6 text-2xl text-white">Deadbolt drawing inspection</h2>
        <DeadboltInspector />
      </section>
    </ProjectLayout>
  )
}
