import { asset } from '../data/experiences.js'
import { thumbnail } from '../data/media.js'

export default function NowAbout() {
  return (
    <section id="about" aria-labelledby="about-heading" className="mx-auto max-w-7xl scroll-mt-28 px-6 pb-10 text-ink md:px-10 md:pb-14">
      <div className="grid items-stretch gap-6 border-t border-ink/20 pt-7 md:grid-cols-[16rem_minmax(0,1fr)] md:gap-9 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-12">
        <a href={asset('/assets/new port pic.jpeg')} target="_blank" rel="noreferrer" aria-label="Open Gautham's portrait" className="block w-56 border border-ink/20 bg-white p-2 md:relative md:w-64 lg:w-72">
          <img src={asset(thumbnail('/assets/new port pic.jpeg'))} alt="Gautham Subramanian wearing a suit outdoors" width="1486" height="1600" loading="lazy" className="aspect-[743/800] w-full object-cover object-[center_45%] md:absolute md:inset-2 md:h-[calc(100%-1rem)] md:w-[calc(100%-1rem)] md:aspect-auto" />
        </a>
        <div className="max-w-[64ch]">
          <h2 id="about-heading" tabIndex={-1} className="focus:outline-none font-serif text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">About</h2>
          <p className="mt-3 leading-relaxed text-ink/80">At the Gear and Power Transmission Laboratory (GearLab), I run gear bending fatigue tests, perform fractography, and operate metrology equipment. My summer research internship focused on rotating-beam fatigue testing, S–N curves, and test procedures. I graduate in December 2028.</p>
          <p className="mt-3 leading-relaxed text-ink/80">From January to May 2027, I’ll work as a High Pressure Die Casting co-op at Honda’s Transmission Manufacturing Plant in Russells Point, Ohio. Earlier work includes a SolidWorks teaching universal testing machine at Ohio State Marion and Siemens NX rover mechanisms for NASA L’SPACE.</p>
        </div>
      </div>
    </section>
  )
}
