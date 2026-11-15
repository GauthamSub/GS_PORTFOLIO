import { useLayoutEffect } from 'react'
import { Outlet, ScrollRestoration, useLocation } from 'react-router'
import { MotionConfig, motion, useMotionValue, useTransform } from 'framer-motion'
import NavMenu from './NavMenu.jsx'
import HudBackdrop from './HudBackdrop.jsx'

// `hud` is the single theme value for the whole site:
// 0 = white Regular HUD, 1 = obsidian Stark HUD.
// Home drives it from scroll; every other route sits at 1.
export default function RootLayout() {
  const { pathname } = useLocation()
  const hud = useMotionValue(pathname === '/' ? 0 : 1)
  // Cool-tinted curve: stays light while hero text is visible, drops through
  // the mid-tones fast, and is already near-obsidian when hub text fades in.
  const backgroundColor = useTransform(
    hud,
    [0, 0.3, 0.55, 0.75, 1],
    ['#FFFFFF', '#E9EFF3', '#2A3646', '#0B111C', '#05080F'],
  )

  useLayoutEffect(() => {
    if (pathname !== '/') hud.set(1)
  }, [pathname, hud])

  return (
    <MotionConfig reducedMotion="user">
      <motion.div style={{ backgroundColor }} className="relative isolate min-h-svh">
        <HudBackdrop hud={hud} />
        {/* Content scrolls under the fixed menu button at most widths. This band,
            painted in the live page colour, fades text out before it gets there. */}
        <motion.div
          aria-hidden="true"
          style={{ backgroundColor }}
          className="pointer-events-none fixed inset-x-0 top-0 z-30 h-24 [mask-image:linear-gradient(to_bottom,#000_70%,transparent)]"
        />
        <NavMenu hud={hud} />
        <Outlet context={{ hud }} />
      </motion.div>
      <ScrollRestoration />
    </MotionConfig>
  )
}
