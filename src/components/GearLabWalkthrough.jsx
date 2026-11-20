import { useState } from 'react'
import { asset } from '../data/experiences.js'
import MediaGallery from './MediaGallery.jsx'
import SnInspector from './SnInspector.jsx'
import BeamSection from './BeamSection.jsx'

const DECK = '/assets/Project Presentation-Rotating Beam Fatigue.pdf'
const stages = [
  { id: 'geometry', label: 'Specimen Geometry', page: 8, image: '/assets/gearlab/specimen-figure.png', alt: 'Rotating-beam specimen geometry and fully reversed bending stress diagram', text: 'Measure the smallest specimen diameter and use σ = My / I with I = πd⁴ / 64 to convert the applied bending moment to stress. Rotation produces fully reversed loading, R = −1.' },
  { id: 'calibration', label: 'Calibration', page: 7, image: '/assets/gearlab/calibration-figure.png', alt: 'Measured dial setting against cycle rate and fitted calibration curve', text: 'Convert the dial setting to cycle rate using the measured calibration: rate = 95.4 × dial − 219, R² = 0.998. The measured range is 800 to 9300 rpm.' },
  { id: 'testing', label: 'Fatigue Testing', page: 17, text: 'Run the RBF200 at the selected loading condition and record cycles to failure. The chart above separates failures from specimens that reached 10^7 cycles without failure; those runouts are not failure-life measurements.' },
  { id: 'inspection', label: 'Microscopy / Inspection', page: 18, text: 'Inspect the fracture surfaces after testing. The deck compares the two sides of failed specimens and identifies crack initiation and propagation in subsequent fractography slides. Microscopy supports the interpretation of the fatigue results.' },
]

export default function GearLabWalkthrough() {
  const [selected, setSelected] = useState('geometry')
  const stage = stages.find(item => item.id === selected)
  return <div className="min-w-0" data-gearlab-walkthrough>
    {/* #sn-plot: linked from the gear hub and the hero rig */}
    <div id="sn-plot" className="scroll-mt-28 lg:scroll-mt-32">
      <SnInspector />
    </div>
    {/* Conceptual companion to the measured S-N data: what one load cycle is */}
    <BeamSection />
    <section className="mt-8 border border-hud/25 bg-[#0B111C] p-5 sm:p-6" aria-labelledby="lab-sequence-heading">
      <h3 id="lab-sequence-heading" className="text-xl text-white">From specimen to fracture surface</h3>
      <ol className="mt-5 grid gap-2 sm:grid-cols-2" aria-label="Four-step lab sequence">
        {stages.map((item, index) => <li key={item.id}>
          <button type="button" aria-pressed={selected === item.id} aria-controls="gearlab-stage" onClick={() => setSelected(item.id)} className={`flex min-h-11 w-full items-center gap-3 border px-3 py-3 text-left font-mono text-xs hover:border-hud focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-hud ${selected === item.id ? 'border-hud bg-hud/10 text-hud' : 'border-hud/25 text-readout'}`}><span className="text-ti-300">0{index + 1}</span>{item.label}</button>
        </li>)}
      </ol>
      <div id="gearlab-stage" aria-live="polite" className="mt-6">
        <h4 className="text-lg text-white">{stage.label}</h4>
        <p className="mt-3 max-w-[65ch] text-sm leading-relaxed text-ti-300">{stage.text}</p>
        {stage.image && <div className="mt-5"><MediaGallery key={stage.id} images={[{ src: stage.image, alt: stage.alt, caption: `${stage.label} · source deck page ${stage.page}`, lightMatte: true }]} /></div>}
        <a href={`${asset(DECK)}#page=${stage.page}`} target="_blank" rel="noreferrer" className="mt-5 inline-flex min-h-11 items-center text-sm text-hud underline underline-offset-4">Read {stage.label.toLowerCase()} evidence · PDF p. {stage.page} ↗</a>
      </div>
    </section>
  </div>
}
