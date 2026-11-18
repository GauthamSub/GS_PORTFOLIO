import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { AnimatePresence, motion, useTransform } from 'framer-motion'
import { asset, experiences, links, misc } from '../data/experiences.js'

// Active row: cyan rule, white text. Keyboard focus: a visible cyan ring inset in the row.
const row = (active, size = 'text-lg') =>
  `flex min-h-[44px] items-center border-l-2 pl-5 pr-6 transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-hud ${size} ${
    active ? 'border-hud bg-hud/[0.07] text-white' : 'border-transparent text-ti-100 hover:border-white/30 hover:text-white'
  }`
const rowClass = ({ isActive }) => row(isActive)
const projectClass = ({ isActive }) => row(isActive, 'text-[15px]')

const sectionLabel = 'px-6 font-mono text-[11px] uppercase tracking-[0.16em] text-ti-400'

// Home sections, by hash. Résumé and Contact are external.
const primary = [
  ['Work', '#gear-hub'],
  ['Skills', '#skills'],
  ['Drawings', '/drawings'],
  ['About', '#about'],
]

// Menu bars stay centered in the shared 56px navigation and emblem height.
const bar = 'block h-[1.5px] w-[21px] bg-current'

export default function NavMenu({ hud }) {
  const [open, setOpen] = useState(false)
  const buttonRef = useRef(null)
  const panelRef = useRef(null)
  const { pathname, hash } = useLocation()

  // Button follows the page theme: plain on white, cyan on obsidian.
  // It flips where the page background crosses mid-luminance.
  const flip = [0.4, 0.6]
  const backgroundColor = useTransform(hud, flip, ['#FFFFFF', '#070C16'])
  const color = useTransform(hud, flip, ['#14171C', '#00E5FF'])
  const borderColor = useTransform(hud, flip, ['rgba(20,23,28,0.3)', 'rgba(0,229,255,0.6)'])

  // While open: trap Tab inside the drawer, lock page scroll, close on Esc.
  // On close, focus goes back to the 3-bar button.
  useEffect(() => {
    if (!open) return
    const button = buttonRef.current
    const panel = panelRef.current
    const root = document.documentElement

    // The button doubles as the drawer's close control, so it is in the cycle.
    const stops = () => [button, ...panel.querySelectorAll('a[href], button:not([disabled])')]

    const onKey = (event) => {
      if (event.key === 'Escape') {
        setOpen(false)
        return
      }
      if (event.key !== 'Tab') return
      const items = stops()
      const first = items[0]
      const last = items[items.length - 1]
      const current = document.activeElement
      if (!items.includes(current)) {
        event.preventDefault()
        ;(event.shiftKey ? last : first).focus()
      } else if (event.shiftKey && current === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && current === last) {
        event.preventDefault()
        first.focus()
      }
    }

    // Hiding the scrollbar widens the page; RootLayout pads by the same amount
    // so nothing shifts sideways.
    const scrollbar = window.innerWidth - root.clientWidth
    root.style.setProperty('--scrollbar-gap', `${scrollbar}px`)
    document.body.style.overflow = 'hidden'

    window.addEventListener('keydown', onKey)
    panel.querySelector('a')?.focus()
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      root.style.removeProperty('--scrollbar-gap')
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
        className={`fixed left-4 top-4 z-50 flex h-14 w-14 cursor-pointer flex-col items-center justify-center gap-[6px] rounded-full border shadow-[0_1px_3px_rgba(5,8,15,0.14)] ${
          open ? '!border-hud/60 !bg-panel !text-hud' : ''
        }`}
      >
        {/* Outer bars travel one bar height plus one gap to cross at the middle bar. */}
        <span
          className={`${bar} transition-transform duration-300 ${open ? 'translate-y-[7.5px] rotate-45' : ''}`}
        />
        <span className={`${bar} transition-opacity duration-200 ${open ? 'opacity-0' : ''}`} />
        <span
          className={`${bar} transition-transform duration-300 ${open ? '-translate-y-[7.5px] -rotate-45' : ''}`}
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
              className="fixed inset-y-0 left-0 z-40 flex w-[min(22rem,88vw)] flex-col overflow-y-auto overscroll-contain border-r border-white/10 bg-panel pb-8 pt-24 lg:pt-28"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
            >
              <ul>
                {primary.map(([label, to]) => {
                  const page = to.startsWith('/')
                  const active = page ? pathname === to : pathname === '/' && hash === to
                  return (
                    <li key={label}>
                      <Link to={page ? to : `/${to}`} aria-current={active ? 'page' : undefined} className={row(active)}>{label}</Link>
                    </li>
                  )
                })}
                <li>
                  <a href={asset(links.resume)} target="_blank" rel="noreferrer" className={row(false)}>
                    Résumé <span className="ml-2 font-mono text-xs text-ti-400">PDF ↗</span>
                  </a>
                </li>
                <li><a href={links.email} className={row(false)}>Contact</a></li>
              </ul>

              <p className={`${sectionLabel} mt-8`}>Projects</p>
              <ul className="mt-2">
                {[...experiences, { ...misc, label: 'Workshop' }].map((item) => (
                  <li key={item.slug}>
                    <NavLink to={item.path} end className={projectClass}>
                      {item.label}
                      {item.slug === 'honda' && <span className="ml-2 font-mono text-[11px] uppercase tracking-[0.12em] text-ti-400">Incoming 2027</span>}
                    </NavLink>
                  </li>
                ))}
              </ul>

              <ul className="mt-auto flex gap-6 px-6 pt-10 text-sm text-ti-300">
                <li><a href={links.linkedin} target="_blank" rel="noreferrer" className="inline-flex min-h-[44px] items-center hover:text-hud focus-visible:outline-2 focus-visible:outline-hud">LinkedIn</a></li>
                <li><NavLink to="/print" className="inline-flex min-h-[44px] items-center hover:text-hud focus-visible:outline-2 focus-visible:outline-hud">Print summary</NavLink></li>
              </ul>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
