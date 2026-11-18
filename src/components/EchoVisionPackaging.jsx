import { useState } from 'react'
import AnnotatedFigure from './AnnotatedFigure.jsx'
import MediaGallery from './MediaGallery.jsx'
import EchoVisionPeel from './EchoVisionPeel.jsx'
import { asset } from '../data/experiences.js'

// One component selection drives both views. Dashed regions describe inferred
// placement; components absent from a photo receive no invented location.
const components = [
  { id: 'camera', label: 'Camera', enclosure: { box: [36, 24, 14.5, 11.5], status: 'Shown', note: 'The lens is visible through the camera aperture in the dark face.' }, wiring: { status: 'Not in photo', note: 'This bench view does not show a separate camera or its lens connection.' } },
  { id: 'battery', label: 'Battery', enclosure: { status: 'Internal placement unverified', note: 'Battery packaging was part of the enclosure design. This exterior photo does not establish its mounting position.' }, wiring: { status: 'Not in photo', note: 'No battery is visible in the bench photo; power routing cannot be traced here.' } },
  { id: 'speaker', label: 'Speaker', enclosure: { box: [50.5, 65.5, 29.5, 17.5], inferred: true, status: 'Inferred', note: 'The grille holes provide the intended speaker outlet. The speaker itself is hidden by the shell.' }, wiring: { box: [79.5, 79, 19.5, 19.5], status: 'Shown', note: 'The alert speaker is visible outside the enclosure, connected by two leads.' } },
  { id: 'board', label: 'ESP32-CAM', enclosure: { status: 'Internal placement unverified', note: 'The controller belongs inside the housing; the exterior photo does not show its support or mounting.' }, wiring: { box: [30.5, 30.5, 26, 26], status: 'Shown: ESP32 board', note: 'An ESP32 board sits on a screw-terminal breakout. The photo records the bench electronics, not an assembled internal layout.' } },
]
const views = [
  { id: 'enclosure', label: 'Enclosure', src: '/assets/echovision/enclosure.jpg', alt: 'EchoVision printed enclosure with camera aperture and speaker grille', caption: 'Printed enclosure · exterior packaging' },
  { id: 'wiring', label: 'Bench wiring', src: '/assets/echovision/wiring.jpg', alt: 'EchoVision ESP32 board and speaker wired on the bench outside the enclosure', caption: 'Bench electronics · outside the enclosure' },
]

export default function EchoVisionPackaging() {
  const [selected, setSelected] = useState('camera')
  const component = components.find(item => item.id === selected)
  return <section className="min-w-0" data-echovision-packaging aria-labelledby="packaging-heading">
    <EchoVisionPeel />
    <h3 id="packaging-heading" className="text-xl text-white">One component, two packaging views</h3>
    <div className="my-5 flex flex-wrap gap-2" role="group" aria-label="Packaging components">
      {components.map(item => <button key={item.id} type="button" aria-pressed={selected === item.id} aria-controls="echovision-part-detail" onClick={() => setSelected(item.id)} className={`min-h-11 border px-4 py-3 font-mono text-xs hover:border-hud focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-hud ${selected === item.id ? 'border-hud bg-hud/10 text-hud' : 'border-hud/25 text-readout'}`}>{item.label}</button>)}
    </div>
    <div id="echovision-part-detail" className="grid items-start gap-5 sm:grid-cols-2" aria-live="polite">
      {views.map(view => <div key={view.id} className="min-w-0">
        <AnnotatedFigure image={{ src: view.src, alt: view.alt }} regions={components.map(item => ({ id: item.id, label: item.label, box: item[view.id].box, inferred: item[view.id].inferred }))} selected={selected} onSelect={setSelected} caption={view.caption} />
        <div className="mt-4 border-l-2 border-hud/60 pl-4">
          <p className="text-lg text-white">{component.label} · {view.label}</p>
          <p className="mt-2 font-mono text-[11px] text-hud">{component[view.id].status}</p>
          <p className="mt-2 text-sm leading-relaxed text-ti-300">{component[view.id].note}</p>
          <a href={asset(view.src)} target="_blank" rel="noreferrer" className="mt-3 inline-flex min-h-11 items-center text-sm text-hud underline underline-offset-4">Open original {view.label.toLowerCase()} photo ↗</a>
        </div>
      </div>)}
    </div>
    <p className="mt-5 text-sm leading-relaxed text-ti-300">Solid outline: visible component. Dashed outline: inferred location. Unpictured components are described without a location box.</p>
    <details className="mt-8 border-t border-hud/25 pt-5">
      <summary className="cursor-pointer py-2 font-mono text-sm text-hud">Cockpit reference · no installed prototype or in-vehicle test</summary>
      <p className="my-4 max-w-[65ch] text-sm leading-relaxed text-ti-300">The Honda S2000 cockpit is a packaging reference. It does not show EchoVision installed.</p>
      <MediaGallery images={[{ src: '/assets/echovision/cockpit-reference.jpg', alt: 'Honda S2000 cockpit used only as a packaging reference', caption: 'Reference photo only · Honda S2000 cockpit' }]} compact />
    </details>
  </section>
}
