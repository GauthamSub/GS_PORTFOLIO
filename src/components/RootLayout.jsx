import { useLayoutEffect } from 'react'
import { Link, Outlet, ScrollRestoration, useLocation } from 'react-router'
import { MotionConfig, motion, useMotionValue, useTransform } from 'framer-motion'
import NavMenu from './NavMenu.jsx'
import BrandMark from './BrandMark.jsx'
import HudBackdrop, { SurfaceLayers } from './HudBackdrop.jsx'
import RouteMetadata from './RouteMetadata.jsx'

// Every full page load gets the history key "default", so by default all
// loads in a tab share one saved scroll position, and a saved position beats
// the URL hash. Key those entries by path instead, and give a load with a hash
// a key that is never saved before it, so /#gear-hub always lands on the hub.
const LOAD = Date.now().toString(36)
const scrollKey = ({ key, pathname, hash }) =>
  key !== 'default' ? key : hash ? `load-${LOAD}${pathname}${hash}` : `default${pathname}`

// `hud` is the single theme value for the whole site:
// 0 = vellum Regular HUD, 1 = obsidian Stark HUD.
// Home drives it from scroll; every other route sits at 1.
export default function RootLayout() {
  const { pathname } = useLocation()
  const hud = useMotionValue(pathname === '/' ? 0 : 1)
  // Cool-tinted curve: stays light while hero text is visible, drops through
  // the mid-tones fast, and is already near-obsidian when hub text fades in.
  const backgroundColor = useTransform(
    hud,
    [0, 0.3, 0.55, 0.75, 1],
    ['#FAFBFD', '#E9EFF3', '#2A3646', '#0B111C', '#05080F'],
  )

  useLayoutEffect(() => {
    if (pathname !== '/') hud.set(1)
  }, [pathname, hud])

  return (
    <MotionConfig reducedMotion="user">
      <RouteMetadata />
      {/* --scrollbar-gap is set by NavMenu while the drawer locks page scroll. */}
      <motion.div
        style={{ backgroundColor }}
        className="relative isolate min-h-svh pr-[var(--scrollbar-gap,0px)]"
      >
        <HudBackdrop hud={hud} />
        {/* Content scrolls under the fixed menu button at most widths. This band,
            painted in the live page colour, fades text out before it gets there.
            It carries the same surface layers as the backdrop, sized to the
            viewport, so the textures run through it with no seam. */}
        <motion.div
          aria-hidden="true"
          style={{ backgroundColor }}
          className="pointer-events-none fixed inset-x-0 top-0 z-30 h-24 overflow-hidden [mask-image:linear-gradient(to_bottom,#000_70%,transparent)] lg:h-28 lg:[mask-image:linear-gradient(to_bottom,#000_80%,transparent)]"
        >
          <div className="absolute inset-x-0 top-0 h-dvh">
            <SurfaceLayers hud={hud} />
          </div>
        </motion.div>
        {/* GS mark and menu share a 56px height with a 12px gap. */}
        <Link
          to="/"
          aria-label="Gautham Subramanian, home"
          className="fixed left-[84px] top-4 z-40 block h-14 w-14 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hud"
        >
          <BrandMark className="h-full w-full drop-shadow-[0_1px_3px_rgba(5,8,15,0.25)]" />
        </Link>
        <NavMenu hud={hud} />
        <Outlet context={{ hud }} />
      </motion.div>
      <ScrollRestoration getKey={scrollKey} />
    </MotionConfig>
  )
}
