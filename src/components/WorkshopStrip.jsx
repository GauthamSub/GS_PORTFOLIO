import { Link } from 'react-router'
import { asset } from '../data/experiences.js'
import { thumbnail } from '../data/media.js'

const builds = [
  { title: 'Deadbolt cutaway', image: '/assets/deadbolt/deadbolt-subassembly.png', alt: 'Dimensioned deadbolt subassembly drawing', decision: 'Review the plate, dial and deadbolt separately; the drawings leave the mating geometry undefined.', path: '/misc#lock', action: 'Inspect the lock' },
  { title: 'LEGO Mars Rover', image: '/assets/Mars Rover.png', alt: 'LEGO Mindstorms rover coursework poster', decision: 'Use a custom claw to handle the rover’s mission tasks.', path: '/misc#lego-rover', action: 'See the rover coursework' },
  { title: 'Standalone drawings', image: '/assets/Shovel Arm NX.png', alt: 'Siemens NX sampling-arm drawing', decision: 'Keep dimensions, detail scales and title-block context available with each drawing.', path: '/drawings', action: 'Browse the drawing library' },
]

export default function WorkshopStrip() {
  return (
    <section id="workshop" aria-labelledby="workshop-strip-heading" className="reading-surface scroll-mt-24 mx-auto max-w-7xl px-6 pb-16 text-readout md:px-10">
      <div className="border-t border-white/10 pt-10">
        <h2 id="workshop-strip-heading" className="text-2xl font-medium text-white">Workshop</h2>
        <p className="mt-2 text-ti-300">Coursework and side builds.</p>
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          {builds.map((build) => <article key={build.path} className="flex min-w-0 flex-col">
            <span className="block aspect-[16/9] rounded-sm bg-[#F4F6F8] p-2.5 ring-1 ring-white/10"><img src={asset(thumbnail(build.image))} alt={build.alt} loading="lazy" width="640" height="360" className="h-full w-full object-contain" /></span>
            <div className="flex flex-1 flex-col pt-5">
              <h3 className="text-base font-medium text-white">{build.title}</h3>
              <p className="mb-4 mt-2 text-sm leading-relaxed text-ti-300">{build.decision}</p>
              <Link to={build.path} className="mt-auto inline-flex min-h-11 items-center text-sm text-hud underline underline-offset-4">{build.action} →</Link>
            </div>
          </article>)}
        </div>
      </div>
    </section>
  )
}
