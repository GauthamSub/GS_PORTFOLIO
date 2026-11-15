import { useLayoutEffect, useRef } from 'react'
import { useLocation, useOutletContext } from 'react-router'
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion'
import GearHub from '../components/GearHub.jsx'
import { asset, links } from '../data/experiences.js'

const facts = [
  ['Major:', 'Mechanical Engineering'],
  ['Minor:', 'Robotics & Autonomous Systems'],
  ['Focus:', 'Automotive, Aerospace, Robotics'],
]

const actions = [
  { label: 'Resume (PDF)', href: asset(links.resume), external: true },
  { label: 'LinkedIn', href: links.linkedin, external: true },
  { label: 'Email', href: links.email },
]

export default function Home() {
  const { hud } = useOutletContext()
  const { hash } = useLocation()
  const blendRef = useRef(null)

  // Progress runs 0 → 1 while the blend zone crosses the viewport.
  const { scrollYProgress } = useScroll({
    target: blendRef,
    offset: ['start 0.75', 'end 0.6'],
  })

  // Arriving at /#gear-hub lands in the dark section, so start dark there.
  useLayoutEffect(() => {
    hud.set(hash ? 1 : 0)
    // Mount only: after this, scroll owns the value.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useMotionValueEvent(scrollYProgress, 'change', (value) => hud.set(value))

  // Text never sits on the mid-tones: the hero is gone by 0.3 (bg still light),
  // and the hub starts at 0.6 (bg already dark). See the ramp in RootLayout.
  const heroOpacity = useTransform(hud, [0, 0.3], [1, 0])
  const hubOpacity = useTransform(hud, [0.6, 0.95], [0, 1])
  const probeOpacity = useTransform(hud, [0.45, 0.7], [0, 1])

  return (
    <main>
      <title>Gautham Subramanian — Mechanical Engineering</title>

      {/* Regular HUD: plain white, editorial */}
      <motion.section
        style={{ opacity: heroOpacity }}
        className="mx-auto grid min-h-svh max-w-6xl items-center gap-x-14 gap-y-14 px-6 pb-20 pt-28 text-ink md:px-10 lg:grid-cols-[minmax(0,1fr)_23rem] xl:grid-cols-[minmax(0,1fr)_27rem] xl:gap-x-20"
      >
        <div>
          <h1 className="font-serif text-[2.6rem] font-semibold leading-[1.05] tracking-[-0.015em] sm:text-6xl">
            Gautham Subramanian
          </h1>
          <p className="mt-4 text-lg text-ink/70">Student @ OSU</p>

          <dl className="mt-9 max-w-xl divide-y divide-ink/10 border-y border-ink/20 text-[15px]">
            {facts.map(([term, value]) => (
              <div key={term} className="grid grid-cols-[4.5rem_1fr] gap-4 py-2.5">
                <dt className="text-ink/55">{term}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-9 max-w-[62ch] space-y-4 font-serif text-[1.075rem] leading-[1.7] text-ink/85">
            <p>
              I’m a mechanical engineering student at Ohio State, graduating in December 2028.
              Outside of class, I work as an undergraduate researcher at OSU’s Gear and Power
              Transmission Laboratory (GearLab), where I run gear rotating bending fatigue tests,
              perform fractography, and operate metrology equipment. This past summer, I also
              completed a full-time research internship at GearLab focused on rotating beam fatigue
              testing, developing S-N curves, and refining test procedures.
            </p>
            <p>
              Previously, I designed a universal testing machine in SolidWorks at the Marion campus
              and modeled Martian cave-exploration rover mechanisms in Siemens NX for NASA’s
              L’SPACE Mission Concept Academy. In January 2027, I’ll be joining Honda’s
              Transmission Manufacturing Plant in Russells Point, Ohio, as a High Pressure Die
              Casting co-op.
            </p>
          </div>

          <ul className="mt-9 flex flex-wrap gap-x-9 gap-y-3 text-[15px] font-medium">
            {actions.map((action) => (
              <li key={action.label}>
                <a
                  href={action.href}
                  {...(action.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                  className="underline decoration-ink/30 underline-offset-[5px] transition-colors hover:decoration-ink"
                >
                  {action.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* 20rem below lg; fills its grid column on desktop (23rem lg, 27rem xl) */}
        <figure className="w-full max-w-[20rem] justify-self-center lg:max-w-none lg:justify-self-end">
          <div className="border border-ink/85 bg-white p-2.5">
            <img
              src={asset('/assets/scottlab pic.png')}
              alt="Gautham Subramanian outside Scott Laboratory at Ohio State"
              width="322"
              height="379"
              className="block h-auto w-full border border-ink/25"
            />
          </div>
          <figcaption className="mt-3 text-[13px] text-ink/60">
            Scott Laboratory, The Ohio State University
          </figcaption>
        </figure>
      </motion.section>

      {/* Blend zone: background runs white to obsidian while this crosses the viewport */}
      <div ref={blendRef} aria-hidden="true" className="relative h-[55vh]">
        <motion.span
          style={{ scaleY: scrollYProgress, opacity: probeOpacity }}
          className="absolute left-1/2 top-0 h-full w-px origin-top bg-hud"
        />
      </div>

      {/* Stark HUD: gear hub */}
      <motion.section
        id="gear-hub"
        style={{ opacity: hubOpacity }}
        className="mx-auto flex min-h-svh max-w-7xl scroll-mt-6 flex-col justify-center px-6 pb-28 pt-24 md:px-10"
      >
        <GearHub>
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-hud/75">
            02 — Experience index
          </p>
          <h2 className="mt-4 max-w-[18ch] text-4xl font-medium leading-[1.08] tracking-[-0.02em] text-white sm:text-5xl">
            Seven teeth. Each one opens a job, a lab, or a build.
          </h2>
          <p className="mt-5 max-w-[44ch] text-[17px] leading-relaxed text-readout/70">
            Pick a tooth on the gear, or use the list.
          </p>
        </GearHub>
      </motion.section>
    </main>
  )
}
