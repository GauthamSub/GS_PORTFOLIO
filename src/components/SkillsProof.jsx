import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router'
import { motion, useReducedMotion } from 'framer-motion'
import { asset } from '../data/experiences.js'
import { thumbnail } from '../data/media.js'
import { categories, evidence, notes, projectById, projects, resumeHref, toolById, tools } from '../data/skillEvidence.js'
import ToolMark from './ToolMark.jsx'

const NONE = []
const R = 8 // connector corner radius
const same = (a, b) => a?.kind === b?.kind && a?.id === b?.id
const isMouse = (event) => event.pointerType === 'mouse'

// Everything visible derives from one focus: { kind: 'tool' | 'project', id }.
// An unlinked tool lights only itself and leaves the project rail neutral.
function relate(focus) {
  if (!focus) return { items: NONE, tools: null, projects: null }
  const items = evidence.filter((e) => (focus.kind === 'tool' ? e.tool : e.project) === focus.id)
  return {
    items,
    tools: new Set(focus.kind === 'tool' ? [focus.id] : items.map((e) => e.tool)),
    projects: focus.kind === 'tool' && !items.length ? null : new Set(focus.kind === 'project' ? [focus.id] : items.map((e) => e.project)),
  }
}

// Orthogonal traces that stay in clear space: project → gutter column →
// the gap beside the tool's row → down/up into the tile. Never across text or logos.
function trace(box, p, t, xg) {
  const x1 = p.left - box.left, y1 = p.top + p.height / 2 - box.top
  const up = t.top + t.height / 2 - box.top < y1
  const x2 = t.left + t.width / 2 - box.left
  const y2 = (up ? t.bottom : t.top) - box.top
  const yc = y2 + (up ? 14 : -14)
  const r1 = Math.min(R, Math.abs(yc - y1) / 2), s1 = Math.sign(yc - y1) || 1
  const r2 = Math.min(R, Math.abs(y2 - yc) / 2), s2 = Math.sign(y2 - yc) || 1
  return {
    x1, y1, x2, y2,
    d: `M${x1},${y1} H${xg + r1} Q${xg},${y1} ${xg},${y1 + s1 * r1} V${yc - s1 * r1} Q${xg},${yc} ${xg - r1},${yc} H${x2 + r2} Q${x2},${yc} ${x2},${yc + s2 * r2} V${y2}`,
  }
}

function useEdges(mapRef, gridRef, railRef, nodes, items) {
  const [edges, setEdges] = useState(NONE)
  const measure = useCallback(() => {
    const map = mapRef.current
    if (!items.length || !map || getComputedStyle(map.querySelector('[data-edges]')).display === 'none') return setEdges(NONE)
    const box = map.getBoundingClientRect()
    const xg = (gridRef.current.getBoundingClientRect().right + railRef.current.getBoundingClientRect().left) / 2 - box.left
    setEdges(items.flatMap((e) => {
      const t = nodes.current[`tool:${e.tool}`]?.getBoundingClientRect()
      const p = nodes.current[`project:${e.project}`]?.getBoundingClientRect()
      return t && p ? [{ id: e.id, ...trace(box, p, t, xg) }] : []
    }))
  }, [mapRef, gridRef, railRef, nodes, items])

  useLayoutEffect(() => {
    measure()
    if (!mapRef.current) return
    const observer = new ResizeObserver(measure)
    observer.observe(mapRef.current)
    document.fonts?.ready.then(measure)
    return () => observer.disconnect()
  }, [measure, mapRef])
  return edges
}

export default function SkillsProof() {
  const [mode, setMode] = useState('map')
  const [selection, setSelection] = useState(null)
  const [hover, setHover] = useState(null)
  const [evidenceId, setEvidenceId] = useState(null)
  const reduce = useReducedMotion()
  const mapRef = useRef(null)
  const gridRef = useRef(null)
  const railRef = useRef(null)
  const nodes = useRef({})

  // A pinned selection is never replaced by hover, so the pointer can travel to its links.
  const focus = selection || hover
  const previewing = !selection && !!hover
  const { items, tools: litTools, projects: litProjects } = useMemo(() => relate(focus), [focus])
  const active = items.find((e) => e.id === evidenceId) || items[0]
  const edges = useEdges(mapRef, gridRef, railRef, nodes, mode === 'map' ? items : NONE)

  const select = (next) => {
    setEvidenceId(null)
    setHover(null)
    setSelection((current) => (same(current, next) ? null : next))
  }
  const nodeProps = (kind, id) => ({
    ref: (el) => { nodes.current[`${kind}:${id}`] = el },
    type: 'button',
    'aria-pressed': same(selection, { kind, id }),
    onClick: () => select({ kind, id }),
    onPointerEnter: (event) => isMouse(event) && !selection && setHover({ kind, id }),
  })

  const count = selection ? relate(selection).items.length : 0
  const status = !selection ? ''
    : selection.kind === 'tool'
      ? `${toolById[selection.id].label} selected. ${count ? `${count} linked project${count === 1 ? '' : 's'}` : 'Project example not linked'}.`
      : `${projectById[selection.id].label} selected. ${count} linked program${count === 1 ? '' : 's'}.`

  return (
    <section id="skills" aria-labelledby="skills-heading" className="reading-surface scroll-mt-24 mx-auto max-w-7xl px-4 pb-28 text-readout sm:px-6 md:px-10">

      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5 border-t border-white/10 pt-10">
        <div>
          <h2 id="skills-heading" className="text-3xl font-medium sm:text-4xl"><span className="text-titanium">Skills</span></h2>
          <p className="mt-3 text-ti-300">Select a program or project to inspect the work behind it.</p>
        </div>
        <div role="group" aria-label="View" className="inline-flex rounded-md bg-white/[0.04] p-1 text-sm">
          {[['map', 'Connection Map'], ['ledger', 'Evidence Ledger']].map(([id, label]) => (
            <button key={id} type="button" aria-pressed={mode === id} onClick={() => setMode(id)}
              className={`min-h-[44px] rounded px-4 transition-colors focus-visible:outline-hud ${mode === id ? 'bg-white/[0.07] text-white shadow-[inset_0_-2px_0_#00E5FF]' : 'text-ti-300 hover:text-white'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>
      <p aria-live="polite" className="sr-only">{status}</p>

      {mode === 'map' ? (
        <div ref={mapRef} onPointerLeave={() => setHover(null)}
          className="relative mt-10 grid gap-y-8 lg:grid-cols-[minmax(0,1fr)_minmax(56px,6vw)_15rem]">
          <svg data-edges aria-hidden="true" focusable="false" className="pointer-events-none absolute inset-0 hidden h-full w-full overflow-visible lg:block">
            {edges.map((e) => (
              <g key={`${e.id}-${focus?.kind}-${focus?.id}`}>
                <motion.path d={e.d} fill="none" stroke="#00E5FF" strokeWidth="1.25" strokeOpacity="0.75" strokeLinejoin="round"
                  initial={reduce ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, ease: 'easeOut' }} />
                <circle cx={e.x1} cy={e.y1} r="2.5" fill="#00E5FF" />
                <circle cx={e.x2} cy={e.y2} r="2.5" fill="#00E5FF" />
              </g>
            ))}
          </svg>

          {/* Programs: last on phones, left column on desktop */}
          <div ref={gridRef} className="order-3 flex min-w-0 flex-col gap-8 lg:order-none lg:col-start-1 lg:row-start-1">
            {categories.map((cat) => (
              <div key={cat.id} className="grid gap-3 lg:grid-cols-[8.5rem_minmax(0,1fr)] lg:items-center lg:gap-4">
                <h3 className="font-mono text-[11px] uppercase leading-relaxed tracking-[0.16em] text-ti-400">{cat.label}</h3>
                <ul className="grid grid-cols-4 gap-x-1 gap-y-3 lg:grid-cols-5 lg:gap-x-2">
                  {tools.filter((t) => t.category === cat.id).map((t) => {
                    const on = focus?.kind === 'tool' && focus.id === t.id
                    const related = litTools?.has(t.id)
                    const dim = litTools && !related
                    return (
                      <li key={t.id} className="min-w-0">
                        <button {...nodeProps('tool', t.id)} aria-label={t.note ? `${t.label}, ${notes[t.note].badge.toLowerCase()}` : t.label}
                          className="group flex h-full w-full flex-col items-center gap-2 rounded-md px-1 pb-2 pt-3 text-center transition-colors hover:bg-white/[0.04] focus-visible:outline-hud">
                          <ToolMark id={t.id} size={40} className={`transition duration-300 ${dim ? 'opacity-60 saturate-50' : ''}`} />
                          <span className={`text-[13px] leading-snug transition-colors lg:text-sm ${on ? 'text-hud' : related ? 'text-white' : dim ? 'text-ti-300' : 'text-ti-100'}`}>{t.label}</span>
                          <span aria-hidden="true" className={`h-0.5 w-6 rounded-full transition-colors ${same(selection, { kind: 'tool', id: t.id }) ? 'bg-hud' : on ? 'bg-hud/40' : 'bg-transparent'}`} />
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>

          {/* Projects: first on phones, right rail on desktop */}
          <div ref={railRef} className="order-1 min-w-0 lg:order-none lg:col-start-3 lg:row-start-1">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-ti-400 lg:pl-4">Projects</h3>
            <ul className="mt-3 flex flex-wrap gap-2 lg:flex-col lg:gap-1">
              {projects.map((p) => {
                const on = focus?.kind === 'project' && focus.id === p.id
                const related = litProjects?.has(p.id)
                const dim = litProjects && !related
                return (
                  <li key={p.id}>
                    <button {...nodeProps('project', p.id)}
                      className={`relative flex min-h-[44px] w-full items-center gap-2 rounded-md bg-white/[0.04] px-3.5 text-left transition-colors hover:bg-white/[0.07] focus-visible:outline-hud lg:bg-transparent lg:pl-4 lg:hover:bg-white/[0.04] ${on ? 'text-hud' : related ? 'text-white' : dim ? 'text-ti-400' : 'text-ti-100'} ${same(selection, { kind: 'project', id: p.id }) ? 'max-lg:bg-hud/10 max-lg:ring-1 max-lg:ring-hud/60' : ''}`}>
                      <span aria-hidden="true" className={`absolute inset-y-2.5 left-0 hidden w-0.5 rounded-full lg:block ${same(selection, { kind: 'project', id: p.id }) ? 'bg-hud' : on ? 'bg-hud/40' : 'bg-transparent'}`} />
                      <span className="text-[15px]">{p.label}</span>
                      {p.meta && <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ti-400">{p.meta}</span>}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="order-2 min-w-0 lg:order-none lg:col-span-3 lg:row-start-2">
            <EvidencePanel focus={focus} previewing={previewing} items={items} active={active} selection={selection}
              onPick={setEvidenceId} onClear={() => select(selection)} />
          </div>
        </div>
      ) : (
        <Ledger selection={selection} onClear={() => select(selection)} />
      )}
    </section>
  )
}

const linkClass = 'inline-flex min-h-[44px] items-center text-ti-50 underline decoration-ti-400/60 underline-offset-4 hover:decoration-white focus-visible:outline-hud'

function EvidencePanel({ focus, previewing, items, active, selection, onPick, onClear }) {
  const tool = focus?.kind === 'tool' ? toolById[focus.id] : null
  const note = tool?.note && notes[tool.note]
  const [broken, setBroken] = useState(null)

  return (
    <div role="region" aria-labelledby="evidence-heading" className="rounded-md bg-panel ring-1 ring-white/[0.07] lg:min-h-[21rem]">
      <div className="flex min-h-[48px] flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] px-4 font-mono text-[11px] uppercase tracking-[0.16em]">
        <h3 id="evidence-heading" className="text-ti-400">Evidence readout</h3>
        <span className="flex items-center gap-4 text-ti-400">
          {previewing && <span>Preview · click to pin</span>}
          {selection && <button type="button" onClick={onClear} className="min-h-[44px] text-ti-300 underline underline-offset-4 hover:text-white focus-visible:outline-hud">Clear selection</button>}
        </span>
      </div>

      {!focus && <p className="px-4 py-5 text-sm text-ti-300">Nothing selected.</p>}

      {note && (
        <div className="flex flex-wrap items-start gap-4 px-4 py-5">
          <ToolMark id={tool.id} size={44} />
          <div className="min-w-0 flex-1">
            <p className="flex flex-wrap items-center gap-3">
              <span className="text-lg font-medium text-white">{tool.label}</span>
              <span className="rounded-sm bg-white/[0.06] px-2 py-0.5 font-mono text-[11px] uppercase tracking-[0.14em] text-ti-300">{note.badge}</span>
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ti-100">{tool.context}</p>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-ti-300">{note.text}</p>
            {tool.onResume && <a href={asset(resumeHref)} target="_blank" rel="noreferrer" className={`mt-2 text-sm ${linkClass}`}>Listed on the résumé</a>}
          </div>
        </div>
      )}

      {active && (
        <div className="px-4 py-5">
          {items.length > 1 && (
            <div role="group" aria-label="Connections" className="mb-4 flex flex-wrap gap-2">
              {items.map((e) => {
                const name = focus.kind === 'tool' ? projectById[e.project].label : toolById[e.tool].label
                return (
                  <button key={e.id} type="button" aria-pressed={e.id === active.id} onClick={() => onPick(e.id)}
                    className={`inline-flex min-h-[44px] items-center gap-2 rounded-md px-3 text-sm transition-colors focus-visible:outline-hud ${e.id === active.id ? 'bg-hud/10 text-hud ring-1 ring-hud/60' : 'bg-white/[0.04] text-ti-300 hover:text-white'}`}>
                    {focus.kind === 'project' && <ToolMark id={e.tool} size={20} />}
                    {name}
                  </button>
                )
              })}
            </div>
          )}
          <div className="grid gap-5 md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)]">
            {active.preview && broken !== active.preview ? (
              <a href={asset(active.original)} target="_blank" rel="noreferrer" className="block rounded-sm bg-white/95 p-1.5 focus-visible:outline-hud">
                <img src={asset(thumbnail(active.preview))} alt={`${toolById[active.tool].label} evidence for ${projectById[active.project].label}`} loading="lazy" decoding="async"
                  onError={() => setBroken(active.preview)} className="aspect-[4/3] w-full object-contain" />
              </a>
            ) : (
              <div className="hidden aspect-[4/3] place-items-center rounded-sm bg-white/[0.03] font-mono text-[11px] uppercase tracking-[0.14em] text-ti-400 md:grid">No image · {active.kind}</div>
            )}
            <div className="min-w-0">
              <p className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[11px] uppercase tracking-[0.14em] text-ti-400">
                <span>{categories.find((c) => c.id === toolById[active.tool].category).label}</span>
                <span className="rounded-sm bg-white/[0.06] px-2 py-0.5 text-ti-300">{active.kind}</span>
              </p>
              <p className="mt-2 text-lg font-medium text-white">
                {toolById[active.tool].label} <span aria-hidden="true" className="text-ti-400">→</span><span className="sr-only">used on</span> {projectById[active.project].label}
              </p>
              {toolById[active.tool].status && <Status text={toolById[active.tool].status} className="mt-2" />}
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ti-300">{active.usage}</p>
              <div className="mt-3 flex flex-wrap gap-x-6 text-sm">
                <Link to={active.link} className={linkClass}>{active.linkLabel}</Link>
                {active.original && <a href={asset(active.original)} target="_blank" rel="noreferrer" className={linkClass}>{active.originalLabel}</a>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// In-progress status: amber, so it never reads as a selection (cyan) or a finished credential.
function Status({ text, className = '' }) {
  return (
    <span className={`inline-flex w-fit items-center gap-2 rounded-sm bg-amber-300/10 px-2 py-1 text-xs text-amber-100 ${className}`}>
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-amber-300" />{text}
    </span>
  )
}

function Ledger({ selection, onClear }) {
  const rows = selection ? evidence.filter((e) => (selection.kind === 'tool' ? e.tool : e.project) === selection.id) : evidence
  const unlinked = tools.filter((t) => t.note && (!selection || (selection.kind === 'tool' && selection.id === t.id)))
  const filterLabel = selection && (selection.kind === 'tool' ? toolById : projectById)[selection.id].label
  const cols = 'md:grid-cols-[12rem_10rem_8rem_minmax(0,1fr)]'

  return (
    <div className="mt-8">
      {selection && (
        <p className="mb-4 flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-[0.14em] text-ti-400">
          Filtered to <span className="text-hud">{filterLabel}</span>
          <button type="button" onClick={onClear} className="min-h-[44px] text-ti-300 underline underline-offset-4 hover:text-white focus-visible:outline-hud">Show all</button>
        </p>
      )}
      <div className={`hidden gap-4 border-b border-white/10 pb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-ti-400 md:grid ${cols}`}>
        <span>Program</span><span>Where used</span><span>Evidence</span><span>Proof</span>
      </div>
      <ul>
        {rows.map((e) => (
          <li key={e.id} className={`grid gap-x-4 gap-y-1 border-b border-white/[0.06] py-4 md:items-start ${cols}`}>
            <span className="flex flex-col gap-1.5">
              <span className="flex items-center gap-2.5 text-sm text-ti-50"><ToolMark id={e.tool} size={24} />{toolById[e.tool].label}</span>
              {toolById[e.tool].status && <Status text={toolById[e.tool].status} />}
            </span>
            <Link to={e.link} className="inline-flex min-h-[44px] items-center text-sm text-white underline decoration-ti-400/60 underline-offset-4 focus-visible:outline-hud md:min-h-0 md:pt-1">{projectById[e.project].label}</Link>
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ti-300 md:pt-1.5">{e.kind}</span>
            <div className="min-w-0 text-sm leading-relaxed text-ti-300 md:pt-0.5">
              <p>{e.usage}</p>
              {e.original && <a href={asset(e.original)} target="_blank" rel="noreferrer" className={`w-fit md:mt-1 md:min-h-0 ${linkClass}`}>{e.originalLabel}</a>}
            </div>
          </li>
        ))}
        {unlinked.map((t) => (
          <li key={t.id} className={`grid gap-x-4 gap-y-1 border-b border-white/[0.06] py-3 md:items-center ${cols}`}>
            <span className="flex items-center gap-2.5 text-sm text-ti-100"><ToolMark id={t.id} size={24} />{t.label}</span>
            <span className="text-sm text-ti-400">No linked project</span>
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ti-400">{notes[t.note].badge}</span>
            <span className="text-sm text-ti-300">{t.context} {notes[t.note].text}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
