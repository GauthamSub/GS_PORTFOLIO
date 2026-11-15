import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router'
import { AnimatePresence, motion, useTransform } from 'framer-motion'
import { asset, experiences, links, misc } from '../data/experiences.js'

const rowClass = ({ isActive }) =>
  `group flex items-baseline gap-4 border-l-2 py-2.5 pl-5 pr-6 transition-colors ${
    isActive
      ? 'border-hud bg-hud/[0.07] text-white'
      : 'border-transparent text-readout/75 hover:border-hud/50 hover:bg-hud/[0.04] hover:text-white'
  }`

const sectionLabel = 'px-6 font-mono text-[11px] uppercase tracking-[0.22em] text-hud/60'

export default function NavMenu({ hud }) {
  const [open, setOpen] = useState(false)
  const buttonRef = useRef(null)
  const panelRef = useRef(null)

  // Button follows the page theme: plain on white, cyan on obsidian.
  // It flips where the page background crosses mid-luminance.
  const flip = [0.4, 0.6]
  const backgroundColor = useTransform(hud, flip, ['#FFFFFF', '#070C16'])
  const color = useTransform(hud, flip, ['#14171C', '#00E5FF'])
  const borderColor = useTransform(hud, flip, ['rgba(20,23,28,0.3)', 'rgba(0,229,255,0.6)'])

  useEffect(() => {
    if (!open) return
    const button = buttonRef.current
    const onKey = (event) => event.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    panelRef.current?.querySelector('a')?.focus()
    return () => {
      window.removeEventListener('keydown', onKey)
      button?.focus()
    }
  }, [open])

  // Any link inside the drawer closes it, including same-page hash links.
  const closeOnLink = (event) => {
    if (event.target.closest('a')) setOpen(false)
  }

  return (
    <>
      <motion.button
        ref={buttonRef}
        type="button"
        aria-label={open ? 'Close navigation' : 'Open navigation'}
        aria-expanded={open}
        aria-controls="site-drawer"
        onClick={() => setOpen((value) => !value)}
        style={{ backgroundColor, color, borderColor }}
        className={`fixed left-4 top-4 z-50 flex h-12 w-12 cursor-pointer flex-col items-center justify-center gap-[5px] rounded-full border shadow-[0_1px_3px_rgba(5,8,15,0.14)] ${
          open ? '!border-hud/60 !bg-panel !text-hud' : ''
        }`}
      >
        <span
          className={`block h-[1.5px] w-[18px] bg-current transition-transform duration-300 ${open ? 'translate-y-[6.5px] rotate-45' : ''}`}
        />
        <span
          className={`block h-[1.5px] w-[18px] bg-current transition-opacity duration-200 ${open ? 'opacity-0' : ''}`}
        />
        <span
          className={`block h-[1.5px] w-[18px] bg-current transition-transform duration-300 ${open ? '-translate-y-[6.5px] -rotate-45' : ''}`}
        />
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="scrim"
              className="fixed inset-0 z-40 bg-obsidian/55"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setOpen(false)}
            />
            <motion.nav
              key="drawer"
              id="site-drawer"
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label="Site navigation"
              onClick={closeOnLink}
              className="fixed inset-y-0 left-0 z-40 flex w-[min(22rem,88vw)] flex-col overflow-y-auto overscroll-contain border-r border-hud/25 bg-panel pb-8 pt-24"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className={sectionLabel}>Experience</p>
              <ul className="mt-3">
                {experiences.map((item) => (
                  <li key={item.slug}>
                    <NavLink to={item.path} className={rowClass}>
                      <span className="font-mono text-xs text-hud/70">{item.index}</span>
                      <span className="text-[17px]">{item.label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>

              <p className={`${sectionLabel} mt-8`}>More</p>
              <ul className="mt-3">
                <li>
                  <NavLink to={misc.path} className={rowClass}>
                    <span className="font-mono text-xs text-hud/70">++</span>
                    <span className="text-[17px]">{misc.label}</span>
                  </NavLink>
                </li>
              </ul>

              <div className="mt-auto px-6 pt-10">
                <Link
                  to="/"
                  className="font-mono text-xs uppercase tracking-[0.18em] text-readout/70 hover:text-hud"
                >
                  ← Home
                </Link>
                <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-t border-hud/20 pt-5 font-mono text-xs uppercase tracking-[0.14em] text-readout/70">
                  <li>
                    <a href={asset(links.resume)} target="_blank" rel="noreferrer" className="hover:text-hud">
                      Resume (PDF)
                    </a>
                  </li>
                  <li>
                    <a href={links.linkedin} target="_blank" rel="noreferrer" className="hover:text-hud">
                      LinkedIn
                    </a>
                  </li>
                  <li>
                    <a href={links.email} className="hover:text-hud">
                      Email
                    </a>
                  </li>
                </ul>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
