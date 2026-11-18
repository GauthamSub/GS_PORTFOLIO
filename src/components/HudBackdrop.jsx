import { motion, useReducedMotion, useTransform } from 'framer-motion'

const corners = [
  'left-2.5 top-2.5 border-l border-t',
  'right-2.5 top-2.5 border-r border-t',
  'left-2.5 bottom-2.5 border-l border-b',
  'right-2.5 bottom-2.5 border-r border-b',
]

// Scroll range of the section-plane wipe, in `hud` units. Home fades the hero
// out before it starts and the hub in after it ends, so text never straddles it.
export const WIPE = [0.3, 0.7]
const pct = (v) => (v * 100).toFixed(2)
// Behind the plane (dark) and ahead of it (light), for a plane at v (0 to 1).
export const behindClip = (v) => `inset(0 ${pct(1 - v)}% 0 0)`
export const aheadClip = (v) => `inset(0 0 0 ${pct(v)}%)`

// The two page surfaces. Fills its parent.
//   light: cool alabaster weave on #FAFBFD
//   dark:  anodized slate (hex weave, sheen, brushed grain) and the technical
//          grid on obsidian
// Between them a vertical CAD section plane sweeps left to right as `hud`
// crosses WIPE: dark behind it, light ahead of it, and a narrow hatched cut
// face on the plane itself. Both surfaces are opaque here, so the colour ramp
// underneath (RootLayout) never shows through mid-wipe.
// Reduced motion: no moving plane. The surfaces crossfade with scroll instead
// (light gone by hud 0.35, dark in from 0.4), the earlier behaviour.
export function SurfaceLayers({ hud }) {
  const still = useReducedMotion()
  const light = useTransform(hud, [0, 0.35], [1, 0])
  const dark = useTransform(hud, [0.4, 1], [0, 1])
  const wipe = useTransform(hud, WIPE, [0, 1])
  const ahead = useTransform(wipe, aheadClip)
  const behind = useTransform(wipe, behindClip)
  const planeX = useTransform(wipe, (v) => `${pct(v)}%`)
  const planeOn = useTransform(wipe, (v) => (v > 0.001 && v < 0.999 ? 1 : 0))

  const slate = (
    <>
      <div className="surface-slate absolute inset-0" />
      <div className="surface-brushed absolute inset-0" />
      <div className="hud-grid absolute inset-0" />
    </>
  )

  if (still) {
    return (
      <>
        <motion.div style={{ opacity: light }} className="surface-vellum absolute inset-0" />
        <motion.div style={{ opacity: dark }} className="absolute inset-0">
          {slate}
        </motion.div>
      </>
    )
  }
  return (
    <>
      <motion.div style={{ clipPath: ahead }} className="surface-vellum absolute inset-0 bg-[#FAFBFD]" />
      <motion.div style={{ clipPath: behind }} className="absolute inset-0 bg-obsidian">
        {slate}
      </motion.div>
      <motion.div style={{ left: planeX, opacity: planeOn }} className="section-plane absolute inset-y-0 w-7 -translate-x-1/2" data-section-plane />
    </>
  )
}

// Viewport-fixed page chrome: surface textures and corner reticles.
// Textures sit behind content; reticles sit above the mobile top band (z-40),
// below the drawer, which comes later in the DOM.
export default function HudBackdrop({ hud }) {
  const opacity = useTransform(hud, [0.4, 1], [0, 1])

  return (
    <>
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
        <SurfaceLayers hud={hud} />
      </div>
      <motion.div aria-hidden="true" style={{ opacity }} className="pointer-events-none fixed inset-0 z-40">
        {corners.map((position) => (
          <span key={position} className={`absolute h-7 w-7 border-hud/70 ${position}`} />
        ))}
      </motion.div>
    </>
  )
}
