import { useState } from 'react'
import MediaGallery from './MediaGallery.jsx'
import RoverPackaging from './RoverPackaging.jsx'
import { asset } from '../data/experiences.js'

const subsystems = [
  { label: 'Rocker-Bogie Suspension', constraint: 'Rough terrain and cave access require wheel travel and terrain clearance while controlling chassis attitude.', decision: 'I modeled the rocker-bogie suspension and chassis packaging in Siemens NX around these mobility constraints.', image: 0, crop: 'suspension', callouts: ['Rocker pivot and articulated links distribute wheel movement.', 'The side sketch locates the bogie linkage and wheel stations.', 'Sketch dimensions describe the concept envelope, not measured rover performance.'] },
  { label: 'Sampling Arm', constraint: 'The cave-exploration concept includes a sampling mechanism that must fit the rover assembly.', decision: 'I produced a Siemens NX engineering drawing of the sampling arm. The drawing records the arm geometry; field validation was outside this concept study.', image: 1, crop: 'sampling', callouts: ['The drawing labels a 180 mm joint diameter.', 'Upper-link dimension: 1201.1 mm; adjacent link: 843.7 mm.', 'The full sheet carries the sampling-system title block and detail scale.'] },
  { label: 'LiDAR & Solar Packaging', constraint: 'Sensor visibility, mechanical obstructions, and limited sunlight underground constrain sensing and power planning.', decision: 'I integrated the LiDAR mount and solar power system into the Siemens NX concept assembly, accounting for sensor visibility and packaging. The source sketch labels the solar panels, antenna, and camera; LiDAR is documented in portfolio page 3 and is not identified in this sketch.', image: 0, crop: 'packaging', callouts: ['The sketch places the solar-panel envelope above the chassis.', 'The mast is explicitly labelled antenna / camera in the original.', 'LiDAR location cannot be verified from this sketch; see portfolio page 3.'] },
]

export default function NasaSubsystems({ images }) {
  const [selected, setSelected] = useState(1)
  const subsystem = subsystems[selected]
  const image = images[subsystem.image]
  const cropPaths = { suspension: '/assets/nasa/suspension-annotated.png', packaging: '/assets/nasa/packaging-annotated.png', sampling: '/assets/nasa/sampling-annotated.png' }
  const crop = { src: cropPaths[subsystem.crop], originalSrc: image.src, alt: `${subsystem.label}: annotated detail from ${image.alt}`, caption: `${subsystem.label} • Concept geometry with technical callouts`, lightMatte: true }
  return (
    <div>
      <RoverPackaging />
      <MediaGallery key={selected} images={[crop]} />
      <p className="mt-5 font-mono text-xs text-hud">PDR milestone reached · Mission Concept Academy completed · Concept study</p>
      <p className="mt-3 max-w-[70ch] text-sm leading-relaxed text-ti-300">I led mechanical design and modeled the sampling arm, suspension, chassis and packaging in Siemens NX. The 15-person team developed the wider mission concept. These drawings record preliminary design work; no built rover or field test is claimed.</p>
      <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Rover subsystems">
        {subsystems.map((item, index) => (
          <button key={item.label} type="button" aria-pressed={selected === index} aria-controls="subsystem-detail" onClick={() => setSelected(index)} className={`border px-3 py-3 text-left font-mono text-xs hover:border-hud focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-hud ${selected === index ? 'border-hud bg-hud/10 text-hud' : 'border-hud/25 text-readout'}`}>{item.label}</button>
        ))}
      </div>
      <div id="subsystem-detail" className="my-5 border-l-2 border-hud/60 pl-5" aria-live="polite">
        <h3 className="text-xl text-white">{subsystem.label}</h3>
        <dl className="mt-4 space-y-4 text-sm leading-relaxed">
          <div><dt className="font-mono text-hud">Mission constraint</dt><dd className="mt-1 text-ti-300">{subsystem.constraint}</dd></div>
          <div><dt className="font-mono text-hud">Siemens NX design decision</dt><dd className="mt-1 text-ti-300">{subsystem.decision}</dd></div>
        </dl>
        <ul className="mt-4 space-y-2 text-sm text-ti-300">{subsystem.callouts.map((text, i) => <li key={text}><span className="font-mono text-hud">{String(i + 1).padStart(2, '0')} </span>{text}</li>)}</ul>
        <a className="mt-4 inline-block text-sm text-hud underline underline-offset-4" href={asset(image.src)} target="_blank" rel="noreferrer">Open full original image</a>
      </div>
      <section aria-labelledby="rover-context-heading" className="mt-8 border-t border-hud/25 pt-6">
        <h3 id="rover-context-heading" className="mb-5 text-xl text-white">Mechanical context views</h3>
        <div className="space-y-5">
          {subsystems.filter(item => item.crop !== subsystem.crop).map(item => <MediaGallery key={item.crop} images={[{ src: cropPaths[item.crop], originalSrc: images[item.image].src, alt: `${item.label}: annotated concept detail`, caption: `${item.label} · ${item.callouts.join(' ')}`, lightMatte: true }]} />)}
        </div>
      </section>
    </div>
  )
}
