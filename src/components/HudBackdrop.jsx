import { motion, useTransform } from 'framer-motion'

const corners = [
  'left-2.5 top-2.5 border-l border-t',
  'right-2.5 top-2.5 border-r border-t',
  'left-2.5 bottom-2.5 border-l border-b',
  'right-2.5 bottom-2.5 border-r border-b',
]

// Viewport-fixed Stark HUD chrome: technical grid and corner reticles.
// Fades in only over the dark half of the blend, so no cyan shows on light grey.
// Grid sits behind content; reticles sit above the mobile top band (z-40),
// below the drawer, which comes later in the DOM.
export default function HudBackdrop({ hud }) {
  const opacity = useTransform(hud, [0.4, 1], [0, 1])

  return (
    <>
      <motion.div
        aria-hidden="true"
        style={{ opacity }}
        className="hud-grid pointer-events-none fixed inset-0 -z-10"
      />
      <motion.div aria-hidden="true" style={{ opacity }} className="pointer-events-none fixed inset-0 z-40">
        {corners.map((position) => (
          <span key={position} className={`absolute h-7 w-7 border-hud/70 ${position}`} />
        ))}
      </motion.div>
    </>
  )
}
