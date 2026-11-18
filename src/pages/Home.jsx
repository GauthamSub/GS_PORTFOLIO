import { useEffect, useLayoutEffect, useRef } from 'react'
import { Link, useLocation, useOutletContext } from 'react-router'
import { cubicBezier, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import GearHub from '../components/GearHub.jsx'
import ScrollBridge from '../components/ScrollBridge.jsx'
import SkillsProof from '../components/SkillsProof.jsx'
import NowAbout from '../components/NowAbout.jsx'
import WorkshopStrip from '../components/WorkshopStrip.jsx'
import { FeaturedCards } from '../components/FeaturedWork.jsx'
import FatigueRigHero from '../components/FatigueRigHero.jsx'
import { WIPE, aheadClip, behindClip } from '../components/HudBackdrop.jsx'
import { GEAR, TOOTH, rootR, toothAngle } from '../lib/gear.js'
import { asset, links } from '../data/experiences.js'

const HUB = '/#gear-hub'
// Hash targets that sit in the dark section: arriving there starts dark.
const DARK_TARGETS = ['#gear-hub', '#skills', '#workshop']
// Hub text is fully faded in from this `hud` value up (see hubOpacity).
const HUB_VISIBLE = 0.9

// Links to the hub are real navigations to /#gear-hub, so the address can be
// shared and Back returns to the hero. The router scrolls to the hash target
// with a plain scrollIntoView(), which follows the root's CSS scroll-behavior.
// This turns smooth scrolling on for that one navigation, and leaves it off
// when the visitor asked for reduced motion.
// The blend zone's drawing: the seven-tooth gear in outline with its pitch
// circle and a degree ring. Drawn in currentColor.
function GearOutline() {
  return (
    <svg viewBox="-300 -300 600 600" aria-hidden="true" className="absolute left-1/2 top-1/2 h-[118%] -translate-x-1/2 -translate-y-1/2" fill="none" stroke="currentColor">
      <g strokeOpacity="0.32" strokeWidth="1.25" vectorEffect="non-scaling-stroke">
        <circle r={rootR} vectorEffect="non-scaling-stroke" />
        {Array.from({ length: GEAR.teeth }, (_, i) => (
          <path key={i} d={TOOTH.outline} transform={`rotate(${toothAngle(i)})`} vectorEffect="non-scaling-stroke" />
        ))}
        <circle r="92" vectorEffect="non-scaling-stroke" />
      </g>
      <circle r={GEAR.pitchR} strokeOpacity="0.22" strokeDasharray="16 4 2 4" vectorEffect="non-scaling-stroke" />
      <circle r="284" strokeOpacity="0.22" vectorEffect="non-scaling-stroke" />
      {Array.from({ length: 36 }, (_, n) => (
        <path key={n} d={`M0 -284V${n % 3 ? -276 : -268}`} transform={`rotate(${n * 10})`} strokeOpacity="0.3" vectorEffect="non-scaling-stroke" />
      ))}
    </svg>
  )
}

// Blend zone contents, drawn twice and clipped at the section plane (the plane
// itself and the page surfaces are in HudBackdrop): graphite outlines ahead of
// the plane, cyan behind it. Reduced motion: one copy, colour switched by scroll.
function SectionCut({ hud }) {
  const still = useReducedMotion()
  const wipe = useTransform(hud, WIPE, [0, 1])
  const ahead = useTransform(wipe, aheadClip)
  const behind = useTransform(wipe, behindClip)

  if (still) return <ScrollBridge progress={wipe} />
  return [
    ['#14171C', ahead],
    ['#00E5FF', behind],
  ].map(([tone, clip]) => (
    <motion.div key={tone} style={{ clipPath: clip, color: tone }} className="absolute inset-0 flex items-center justify-center overflow-hidden px-6">
      <GearOutline />
      <ScrollBridge progress={wipe} tone={tone} />
    </motion.div>
  ))
}

const smoothOnce = () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const root = document.documentElement
  const reset = () => {
    root.style.scrollBehavior = ''
    window.removeEventListener('scrollend', reset)
    clearTimeout(timer)
  }
  root.style.scrollBehavior = 'smooth'
  window.addEventListener('scrollend', reset)
  const timer = setTimeout(reset, 1500)
}

// Keyboard focus must never land on faded-out content. While focus is inside
// a section, its scroll fade is held at full opacity. If the section was
// mid-fade when focus arrived, the focused control is also brought to
// mid-screen, where the page colour is the one that section was drawn for.
function useFocusHold(fade) {
  const held = useMotionValue(0)
  const opacity = useTransform([fade, held], ([value, hold]) => (hold ? 1 : value))
  const handlers = {
    onFocus: (event) => {
      if (!event.target.matches(':focus-visible')) return
      held.set(1)
      if (fade.get() < 1) event.target.scrollIntoView({ block: 'center', behavior: 'instant' })
    },
    onBlur: (event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) held.set(0)
    },
  }
  return [opacity, handlers]
}

export default function Home() {
  const { hud } = useOutletContext()
  const { hash, key } = useLocation()
  const blendRef = useRef(null)
  const hubHeadingRef = useRef(null)
  const still = useReducedMotion()

  // Pin the viewport for 130vh of scrolling; most of this distance belongs to
  // the section cut, with short end ranges for surrounding content fades.
  const { scrollYProgress } = useScroll({
    target: blendRef,
    offset: ['start start', 'end end'],
  })
  const easedProgress = useTransform(scrollYProgress, [0, 0.12, 0.88, 1], [0, WIPE[0], WIPE[1], 1], { ease: cubicBezier(0.35, 0, 0.65, 1) })
  const dampedProgress = useSpring(easedProgress, { stiffness: 85, damping: 24, mass: 0.8, restDelta: 0.0001 })
  const weightedProgress = useTransform(dampedProgress, value => Math.min(1, Math.max(0, value)))
  const transitionProgress = still ? easedProgress : weightedProgress

  // Arriving at /#gear-hub lands in the dark section, so start dark there.
  useLayoutEffect(() => {
    hud.set(DARK_TARGETS.includes(hash) ? 1 : 0)
    // Mount only: after this, scroll owns the value.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useMotionValueEvent(transitionProgress, 'change', (value) => hud.set(value))

  // Every arrival at /#gear-hub (link, direct load, Back or Forward) hands
  // keyboard focus to the hub heading. During a smooth scroll the hub is still
  // transparent, so wait for it to fade in; give up after 2s if it never does.
  useEffect(() => {
    if (hash === '#about') {
      document.getElementById('about-heading')?.focus({ preventScroll: true })
      return undefined
    }
    if (hash !== '#gear-hub') return undefined
    const focus = () => hubHeadingRef.current?.focus({ preventScroll: true })
    if (hud.get() >= HUB_VISIBLE) {
      focus()
      return undefined
    }
    const stop = hud.on('change', (value) => {
      if (value < HUB_VISIBLE) return
      cancel()
      focus()
    })
    const timer = setTimeout(stop, 2000)
    const cancel = () => {
      stop()
      clearTimeout(timer)
    }
    return cancel
  }, [hash, key, hud])

  // Text never straddles the section plane: the hero is gone by 0.3, when the
  // plane starts across (WIPE in HudBackdrop), and the hub starts at 0.7, when
  // it has finished. The blend-zone drawing stays on screen across the gap.
  const heroFade = useTransform(hud, [0, WIPE[0]], [1, 0])
  const hubFade = useTransform(hud, [WIPE[1], HUB_VISIBLE], [0, 1])
  const [heroOpacity, heroFocus] = useFocusHold(heroFade)
  const [hubOpacity, hubFocus] = useFocusHold(hubFade)
  // A faded-out hero stays in the tab order (focus brings it back), but it
  // must not catch clicks meant for whatever shows through it.
  const heroPointer = useTransform(heroOpacity, (value) => (value > 0 ? 'auto' : 'none'))

  return (
    <main className="relative overflow-x-clip">
      <title>Gautham Subramanian — Mechanical Engineering</title>

      {/* Regular HUD: introduction and specimen occupy separate columns. */}
      <motion.section
        style={{ opacity: heroOpacity, pointerEvents: heroPointer }}
        {...heroFocus}
        aria-label="Introduction"
        className="mx-auto flex min-h-[88vh] max-w-[1380px] flex-col px-6 pb-8 pt-24 text-ink lg:min-h-svh lg:px-12 lg:pt-28"
      >
        <div className="grid flex-1 grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-5" data-hero-copy>
            <h1 className="font-serif text-5xl font-bold leading-[1.03] tracking-tight sm:text-6xl lg:text-[3.25rem] xl:text-[4.5rem]">
              <span className="block">Gautham</span><span className="block">Subramanian</span>
            </h1>
            <div className="mt-5 space-y-2 leading-snug">
              <p className="text-lg font-medium text-slate-900 sm:text-xl">Mechanical Engineering Student at Ohio State</p>
              <p className="text-base text-slate-500 sm:text-lg">Undergraduate Research at GearLab</p>
            </div>

            <ul className="mt-6 flex flex-wrap items-center gap-6 text-[15px] font-medium">
              <li>
                <Link
                  to={HUB}
                  onClick={smoothOnce}
                  className="inline-flex min-h-[44px] items-center gap-2.5 bg-ink px-4 py-2.5 text-white transition-colors hover:bg-ink/85"
                >
                  Selected Work <span aria-hidden="true">↓</span>
                </Link>
              </li>
              <li><a href={asset(links.resume)} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center underline decoration-ink/30 underline-offset-[5px] hover:decoration-ink">Résumé (PDF)</a></li>
            </ul>
          </div>

          <div className="min-w-0 lg:col-span-7" data-hero-rig>
            <FatigueRigHero />
          </div>
        </div>

        {/* One scroll cue, below both columns. */}
        <Link
          to="/#about"
          onClick={smoothOnce}
          className="mx-auto flex flex-col items-center gap-2.5 pt-6 font-mono text-xs uppercase tracking-[0.16em] text-slate-700 transition-colors hover:text-ink"
        >
          About
          <svg
            aria-hidden="true"
            viewBox="0 0 16 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-4"
          >
            <path d="M8 2 V21 M2 15 L8 21 L14 15" />
          </svg>
        </Link>
      </motion.section>

      <motion.div style={{ opacity: heroOpacity, pointerEvents: heroPointer }} {...heroFocus}>
        <NowAbout />
      </motion.div>

      {/* Blend zone: the section plane crosses from vellum to obsidian while this
          crosses the viewport */}
      <div
        ref={blendRef}
        aria-hidden="true"
        data-transition-runway
        className="relative min-h-[170svh]"
      >
        <div data-transition-stage className="sticky top-0 flex h-svh items-center justify-center">
          <SectionCut hud={hud} />
        </div>
      </div>

      {/* Stark HUD: featured work, then the gear hub */}
      <motion.section
        id="gear-hub"
        aria-labelledby="gear-hub-heading"
        style={{ opacity: hubOpacity }}
        {...hubFocus}
        className="relative mx-auto min-h-svh max-w-7xl scroll-mt-6 px-6 pb-28 pt-24 md:px-10"
      >
        <h2
          id="gear-hub-heading"
          ref={hubHeadingRef}
          tabIndex={-1}
          className="text-4xl font-medium leading-[1.08] tracking-[-0.02em] focus:outline-none sm:text-5xl md:whitespace-nowrap"
        >
          <span className="text-titanium">Selected Work</span>
        </h2>

        <div className="mt-8">
          <FeaturedCards />
        </div>

        <div className="mt-12 lg:mt-14">
          <GearHub />
        </div>
      </motion.section>
      <SkillsProof />
      <WorkshopStrip />

    </main>
  )
}
