import { asset } from '../data/experiences.js'

const report = '/assets/Research Universal Testing Machine-Marion.pdf'
const tests = [
  ['Tensile', 'Axial pulling between grips; relate applied force to the specimen cross-section.', 2],
  ['Torsional', 'Apply torque about the specimen axis and examine the angle of twist. Gautham and Faiz are named for this research.', 3],
  ['Compressive', 'Compress a specimen between loading surfaces; account for contact friction, barreling, and buckling.', 5],
  ['Flexural', 'Support a beam and apply a three-point or four-point bending load.', 8],
]

export default function MarionIterations() {
  return (
    <div className="border border-hud/25 bg-[#0B111C] p-5 sm:p-8" data-marion-iterations>
      <h3 className="text-2xl font-medium text-white">Teaching universal testing machine</h3>
      <p className="mt-3 font-mono text-sm text-hud">5+ SolidWorks design iterations · 3+ material-test types</p>
      <p className="mt-4 max-w-[65ch] leading-relaxed text-ti-300">I refined an educational testing machine around loading requirements, manufacturability, and lab constraints. The resume records the design scope; the research report covers test principles and early team concepts.</p>

      <section className="mt-8 border-t border-hud/20 pt-6" aria-labelledby="marion-tests-heading">
        <h4 id="marion-tests-heading" className="text-lg font-medium text-white">Test configurations researched</h4>
        <p className="mt-2 text-sm leading-relaxed text-ti-300">The design scope calls for 3+ test types. The team report surveys four; it does not verify a fabricated machine in all four configurations.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {tests.map(([title, text, page]) => <article key={title} className="border-l border-hud/40 pl-4">
            <h5 className="font-mono text-sm text-hud">{title}</h5>
            <p className="mt-2 text-sm leading-relaxed text-ti-300">{text}</p>
            <a className="mt-3 inline-block text-sm text-hud underline underline-offset-4" href={`${asset(report)}#page=${page}`} target="_blank" rel="noreferrer">Research report · p. {page} ↗</a>
          </article>)}
        </div>
      </section>

      <section className="mt-8 border-t border-hud/20 pt-6" aria-labelledby="marion-build-record-heading">
        <h4 id="marion-build-record-heading" className="text-lg font-medium text-white">BOM and assembly documentation</h4>
        <p className="mt-3 max-w-[65ch] text-sm leading-relaxed text-ti-300">The resume records CAD, part documentation, a bill of materials, and prototype assembly plans. Separate BOM and assembly-drawing files are not published here. The report's early team sketches are concept work, with no fabricated-machine performance claimed.</p>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3 text-sm text-hud">
          <a className="underline underline-offset-4" href={asset(report)} target="_blank" rel="noreferrer">Open full research report ↗</a>
          <a className="underline underline-offset-4" href={`${asset(report)}#page=10`} target="_blank" rel="noreferrer">Team concept sketches · pp. 10–14 ↗</a>
        </div>
      </section>
    </div>
  )
}
