import { useLayoutEffect, useRef } from 'react'
import { motion, useMotionValue, useMotionValueEvent, useReducedMotion, useSpring, useTransform, useVelocity } from 'framer-motion'
import BridgeArtwork from './TransitionArtwork.jsx'

const icons = [['automotive', 'Automotive'], ['aerospace', 'Aerospace'], ['robotics', 'Robotics']]
const clamp = value => Math.max(0, Math.min(1, value))
const smooth = value => { const t = clamp(value); return t * t * (3 - 2 * t) }

function BridgeIcon({ kind, label, progress, forward, direction, still, index }) {
  const ref = useRef(null)
  const center = useMotionValue((index + 0.5) / 3)
  const halfWidth = useMotionValue(0.08)
  useLayoutEffect(() => {
    const measure = () => {
      const icon = ref.current.querySelector('svg').getBoundingClientRect()
      center.set((icon.left + icon.width / 2) / window.innerWidth)
      halfWidth.set(icon.width / (2 * window.innerWidth))
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(ref.current)
    window.addEventListener('resize', measure)
    return () => { observer.disconnect(); window.removeEventListener('resize', measure) }
  }, [center, halfWidth])
  // Crossings use the same viewport coordinates as the section plane.
  // Velocity adds a brief thrust boost. Flicker advances only with the wipe.
  const fire = useTransform([progress, forward, direction, center, halfWidth], ([p, boost, travel, x, radius]) => {
    if (still) return 0.8
    const crossing = smooth((p - x + radius) / (radius * 2))
    const flicker = 1 + Math.sin(p * 95) * 0.08 * boost
    return clamp(crossing * travel * (0.32 + 0.68 * boost) * flicker)
  })
  return <li ref={ref} className="flex min-w-0 flex-col items-center gap-2 sm:gap-5" data-transition-icon={kind}>
    <div className="w-full max-w-[180px]"><BridgeArtwork kind={kind} progress={progress} fire={fire} still={still} /></div>
    <span className="font-mono text-[9px] uppercase tracking-[0.14em] sm:text-[11px] sm:tracking-[0.24em]">{label}</span>
  </li>
}

// Matching clipped copies share one wipe value; palette alone changes from
// graphite/amber to cyan/white behind the plane. Reduced motion holds a pose.
export default function ScrollBridge({ progress, tone }) {
  const still = useReducedMotion()
  const composedProgress = useTransform(progress, value => still ? 1 : value)
  const velocity = useVelocity(progress)
  const boost = useTransform(velocity, value => clamp(value * 2))
  const forward = useSpring(boost, { stiffness: 150, damping: 28, restDelta: 0.001 })
  const direction = useMotionValue(1)
  useMotionValueEvent(progress, 'change', value => {
    const previous = progress.getPrevious() ?? value
    if (Math.abs(value - previous) > 0.00001) direction.set(value >= previous ? 1 : 0)
  })
  const isDark = value => tone ? tone === '#00E5FF' : value >= 0.5
  const color = useTransform(progress, value => tone || (isDark(value) ? '#00E5FF' : '#14171C'))
  const core = useTransform(progress, value => isDark(value) ? '#F0FFFF' : '#FFF5D6')
  const mid = useTransform(progress, value => isDark(value) ? '#67E8F9' : '#F4BF63')
  const edge = useTransform(progress, value => isDark(value) ? '#089EC0' : '#C98528')
  return <motion.div data-scroll-bridge data-tone={tone || 'adaptive'} style={{ color, '--plume-core': core, '--plume-mid': mid, '--plume-edge': edge, '--bridge-progress': composedProgress }} className="relative w-full max-w-5xl">
    <ul className="grid grid-cols-3 gap-2 sm:gap-10">
      {icons.map(([kind, label], index) => <BridgeIcon key={kind} kind={kind} label={label} progress={composedProgress} forward={forward} direction={direction} still={still} index={index} />)}
    </ul>
    <motion.span style={{ scaleX: composedProgress }} className="mt-6 block h-px origin-left bg-current opacity-25 sm:mt-8" />
  </motion.div>
}
