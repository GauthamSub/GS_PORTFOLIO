import { useState } from 'react'
import { Link } from 'react-router'
import ProjectLayout from '../components/ProjectLayout.jsx'
import { asset } from '../data/experiences.js'
import { thumbnail } from '../data/media.js'
import { control } from '../lib/controls.js'

const coursework = '/assets/all finished engineering stuff/'
const park = '/assets/Parksense stuff/'
const drawings = [
  { title: 'Sampling system', tool: 'Siemens NX', assembly: true, image: '/assets/Shovel Arm NX.png', original: '/assets/Shovel Arm NX.png', context: 'mm · sheet 1:1 · detail A 1:10', material: 'Material not specified', caption: 'Sampling-arm orthographic and detail views. A4 sheet, revision A; dimensions are in millimeters.', project: 'NASA L’SPACE', path: '/project/nasa' },
  { title: 'Graphics 5 Deadbolt Subassembly', tool: 'SolidWorks', assembly: true, image: '/assets/deadbolt/deadbolt-subassembly.png', original: `${coursework}Deadbolt Subassembly DRAWING_AS_PDF.PDF`, context: 'inches · scale 1:1', material: 'Material not specified', caption: 'Dimensioned deadbolt, block and cross rod with an isometric view. Drawn September 28, 2024.', project: 'ENGR 1182 deadbolt', path: '/misc#lock' },
  { title: 'G10 Lock Ergonomics', tool: 'SolidWorks', image: '/assets/deadbolt/dial-g10.png', original: `${coursework}Dial_G10_Lock Drawing.pdf`, context: 'IPS · scale 1:1', material: 'Material not specified', caption: 'Dial with a splined stub, diameter 1.75 base flange and diameter 1.00 boss. Drawing G10, November 23, 2024.', project: 'ENGR 1182 deadbolt', path: '/misc#lock' },
  { title: 'G10 Front Plate', tool: 'SolidWorks', image: '/assets/deadbolt/front-plate-g10.png', original: `${coursework}Front_Plate G10.pdf`, context: 'IPS · scale 1:1', material: 'Material not specified', caption: '4.75 × 3.00 × .25 plate with bore, slot and mounting holes. Drawing G10, November 23, 2024.', project: 'ENGR 1182 deadbolt', path: '/misc#lock' },
  ...[
    ['Enclosure CAD · view 1', 'Prototype housing 1.png', 'Front-wall enclosure packaging for the ultrasonic sensor, keypad and LED matrix.'],
    ['Enclosure CAD · view 2', 'Prototype housing 2.png', 'Second CAD view of the ParkSense enclosure and component openings.'],
    ['Enclosure CAD · view 3', 'prototype housing 3.png', 'Third CAD view of the custom enclosure.'],
    ['Servo stop arm', 'prototype stop arm.png', 'Separate stop-arm part for the servo-operated parking barrier.'],
  ].map(([title, file, caption]) => ({ title, tool: 'SolidWorks', image: `${park}${file}`, original: `${park}${file}`, context: 'units not stated', material: 'CAD material not specified', caption, project: 'ParkSense', path: '/project/parksense' })),
]

const project = { slug: 'drawings', label: 'Drawing Library', org: 'Engineering documentation', role: 'CAD & drawing index', tools: 'Siemens NX · SolidWorks', domain: 'Parts, assemblies & enclosures', period: '2024 – 2026' }
const filters = ['All', 'CAD / NX', 'SolidWorks', 'Assemblies']
const lockOrder = ['G10 Front Plate', 'G10 Lock Ergonomics', 'Graphics 5 Deadbolt Subassembly']

// One drawing: light-matted preview, name, three facts, one link to the original.
function DrawingCard({ item, order }) {
  const Heading = order ? 'h3' : 'h2'
  const material = item.material.replace(/^(CAD )?material not specified$/i, 'Not specified')
  const facts = [
    ['Component', `${item.assembly ? 'Assembly' : 'Part'} · ${item.tool}`],
    ['Material / Units', `${material} · ${item.context}`],
    ['Linked project', <Link to={item.path} className="underline decoration-white/30 underline-offset-4 hover:text-hud">{item.project}</Link>],
  ]
  return (
    <article className="h-full min-w-0">
      <a href={asset(item.original)} target="_blank" rel="noreferrer" className="block rounded-sm bg-[#F4F6F8] p-3 ring-1 ring-white/10 transition hover:ring-hud/60" aria-label={`Open original: ${item.title}`}>
        <img src={asset(thumbnail(item.image))} alt={item.title} loading="lazy" className="h-56 w-full object-contain" />
      </a>
      <div className="pt-5">
        {order && <p className="mb-1 font-mono text-xs text-ti-400">Sheet {order} of 3</p>}
        <Heading className="text-xl text-white">{item.title}</Heading>
        <p className="mt-2 text-[15px] leading-relaxed text-ti-300">{item.caption}</p>
        <dl className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-[8.5rem_minmax(0,1fr)]">
          {facts.map(([term, value]) => [
            <dt key={term} className="font-mono text-[11px] uppercase tracking-[0.14em] text-ti-400 sm:pt-0.5">{term}</dt>,
            <dd key={`${term}-v`} className="text-ti-100 max-sm:mb-2">{value}</dd>,
          ])}
        </dl>
        <a href={asset(item.original)} target="_blank" rel="noreferrer" className="mt-4 inline-flex min-h-11 items-center text-sm text-hud underline underline-offset-4">Open original {item.original.toLowerCase().endsWith('.pdf') ? 'PDF' : 'image'} ↗</a>
      </div>
    </article>
  )
}

export default function DrawingLibrary() {
  const [filter, setFilter] = useState('All')
  const [query, setQuery] = useState('')
  const visible = drawings.filter((item) => (filter === 'All' || (filter === 'Assemblies' ? item.assembly : item.tool === (filter === 'CAD / NX' ? 'Siemens NX' : filter))) && `${item.title} ${item.tool} ${item.caption} ${item.context} ${item.material} ${item.project}`.toLowerCase().includes(query.trim().toLowerCase()))
  const lockSet = lockOrder.map((title) => visible.find((item) => item.title === title)).filter(Boolean)
  const controls = (
    <section aria-label="Drawing search and filters">
      <label htmlFor="drawing-search" className="block text-sm text-ti-300">Search drawings and captions</label>
      <input id="drawing-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try sampling, deadbolt, enclosure…" className="mt-3 min-h-12 w-full border border-white/20 bg-obsidian px-4 text-readout focus:border-hud focus:outline-2 focus:outline-hud" />
      <div role="group" aria-label="Filter drawings" className="mt-4 flex flex-wrap gap-2">
        {filters.map((name) => <button key={name} type="button" aria-pressed={filter === name} onClick={() => setFilter(name)} className={control(filter === name)}>{name}</button>)}
      </div>
      <p className="mt-4 font-mono text-xs text-ti-400" role="status">{visible.length} of {drawings.length} drawings</p>
    </section>
  )

  return (
    <ProjectLayout project={project} indexControls={controls} brief="Dimensioned drawings and CAD views from rover concept work, lock coursework and ParkSense fabrication.">
      <section aria-label="Drawing index">
        <div className="grid gap-x-8 gap-y-12 md:grid-cols-2">
          {visible.filter((item) => !lockOrder.includes(item.title)).map((item) => <DrawingCard key={item.title} item={item} />)}
        </div>
        {lockSet.length > 0 && <section className="mt-14 border-t border-white/10 pt-10" aria-labelledby="lock-drawing-set">
          <div className="mb-6 flex flex-wrap items-baseline justify-between gap-4">
            <div><h2 id="lock-drawing-set" className="text-2xl text-white">Deadbolt drawing set</h2><p className="mt-2 max-w-[65ch] text-[15px] leading-relaxed text-ti-300">Three ENGR 1182 sheets: front plate, dial, then the deadbolt subassembly. They do not define the full mating geometry.</p></div>
            <Link to="/misc#lock" className="text-sm text-hud underline underline-offset-4">Open the deadbolt inspector →</Link>
          </div>
          <ol className="grid gap-x-8 gap-y-12 md:grid-cols-2">{lockSet.map((item) => <li key={item.title}><DrawingCard item={item} order={lockOrder.indexOf(item.title) + 1} /></li>)}</ol>
        </section>}
        {visible.length === 0 && <p className="py-6 text-ti-100">No matching drawings. Try another caption or select All.</p>}
        <p className="mt-12 max-w-[70ch] text-sm leading-relaxed text-ti-400">Drawing scales refer to the original sheets. Screen previews are resized. CAD screenshots have no title block; use their case study for fabrication context.</p>
      </section>
    </ProjectLayout>
  )
}
