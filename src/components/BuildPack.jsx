import { asset } from '../data/experiences.js'
import MediaGallery from './MediaGallery.jsx'

const base = '/assets/Parksense stuff/'
const documents = [
  ['Requirements', 'ME2900 Prototype Proposal.pdf', 'Proposal', 'Parking-assistant objective, proposed components, and intended operation.'],
  ['Requirements', 'Prototype Component Check-off - Gautham Subramanian.pdf', 'Component check-off', 'Component selection and integration checklist.'],
  ['Wiring', 'Prototype Circuit schematic.png', 'Circuit schematic', 'Sensor, keypad, matrix, feedback, and servo connections.'],
  ['Firmware', 'ME2900 Prototype Report.pdf', 'Report & firmware', 'Control logic, millis() scheduling, and the 30 ms missing-echo timeout. The report uses the project name EchoCar.'],
  ['Fabrication', 'ME2900 Prototype Poster - Gautham Subramanian.pdf', 'Prototype poster', 'Integrated prototype overview, published as EchoCar.'],
]

// The ParkSense source documents as one compact list (one link each), then the
// enclosure CAD views. This replaces a separate Documents block on the page.
export default function BuildPack() {
  return <section aria-labelledby="build-pack-heading" className="mt-12 border-t border-white/10 pt-10">
    <h3 id="build-pack-heading" className="text-2xl text-white">Build pack</h3>
    <ul className="mt-5 divide-y divide-white/10 border-y border-white/10">
      {documents.map(([, file, title, caption]) => <li key={file}>
        <a className="group flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-4" href={asset(base + file)} target="_blank" rel="noreferrer">
          <span className="min-w-0">
            <span className="text-white group-hover:text-hud">{title}</span>
            <span className="mt-1 block max-w-[65ch] text-sm leading-relaxed text-ti-300">{caption}</span>
          </span>
          <span className="shrink-0 font-mono text-xs text-hud">Open {file.toLowerCase().endsWith('.pdf') ? 'PDF' : 'image'} ↗</span>
        </a>
      </li>)}
    </ul>
    <h4 className="mb-4 mt-10 text-lg text-white">Enclosure CAD</h4>
    <p className="mb-5 max-w-[65ch] text-sm leading-relaxed text-ti-300">These views show the enclosure and stop-arm design. The tested build used a cardboard housing.</p>
    <MediaGallery images={[
      { src: base + 'Prototype housing 1.png', alt: 'ParkSense enclosure CAD front view', caption: 'Front wall: openings for the sensor, keypad and LED matrix.' },
      { src: base + 'Prototype housing 2.png', alt: 'ParkSense enclosure CAD second view', caption: 'Housing geometry from a second angle.' },
      { src: base + 'prototype housing 3.png', alt: 'ParkSense enclosure CAD third view', caption: 'Component openings from a third angle.' },
      { src: base + 'prototype stop arm.png', alt: 'ParkSense separate servo stop arm render', caption: 'Separate stop arm for the servo barrier.' },
    ]} />
  </section>
}
