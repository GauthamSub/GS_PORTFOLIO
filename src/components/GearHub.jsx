import { useState } from 'react'
import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { asset, experiences } from '../data/experiences.js'
import { GEAR, TOOTH, baseR, rootR, tipR, toothAngle } from '../lib/gear.js'

const CYAN = '#00E5FF'
const fade = 'transition-opacity duration-300'
const HUB_R = 80

// Fit each logo so its corners stay inside the hub disc (r 76) and it is no
// wider than 130. `box` matches the drawn image exactly, so the feather mask
// lands on the image edge. Teeth with no logo show their name as hub text.
const LOGOS = experiences
  .filter((item) => item.logo)
  .map((item) => {
    const [w, h] = item.logoSize
    const s = Math.min(76 / Math.hypot(w / 2, h / 2), 130 / w)
    return { ...item, box: { w: +(w * s).toFixed(2), h: +(h * s).toFixed(2) } }
  })

// Fixed scatter of HUD marker dots around the gear: [radius, angle in degrees].
const DOTS = [
  [272, 12], [288, 38], [266, 71], [294, 96], [279, 127], [270, 158], [291, 184],
  [274, 209], [286, 241], [268, 266], [295, 292], [277, 318], [284, 343],
].map(([r, deg]) => {
  const a = (deg * Math.PI) / 180
  return [r * Math.cos(a), r * Math.sin(a)]
})

function Tooth({ item, i, isActive, onActive }) {
  const angle = toothAngle(i)
  // Teeth on the lower half get their text turned so it never reads upside down.
  const flip = angle > 90 && angle < 270
  const twoLine = item.toothLines.length === 2
  const rows = twoLine ? [206, 190] : [197]
  const labelMid = twoLine ? 198 : 197

  return (
    <g transform={`rotate(${angle.toFixed(3)})`}>
      <Link
        to={item.path}
        aria-label={`${item.label}: ${item.role}`}
        className="cursor-pointer outline-none"
        onPointerEnter={() => onActive(item.slug)}
        onPointerLeave={() => onActive(null)}
        onFocus={() => onActive(item.slug)}
        onBlur={() => onActive(null)}
      >
        <motion.g
          initial={false}
          animate={{ scale: isActive ? 1.13 : 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          // Scale from the middle of the tooth base so it grows out of the rim.
          style={{ originX: 0.5, originY: 1 }}
        >
          <path
            d={TOOTH.outline}
            fill="none"
            stroke={CYAN}
            strokeWidth="7"
            filter="url(#tooth-glow)"
            className={fade}
            style={{ opacity: isActive ? 0.95 : 0 }}
          />
          <path d={TOOTH.fill} fill="url(#tooth-idle)" />
          <path
            d={TOOTH.fill}
            fill="url(#tooth-active)"
            className={fade}
            style={{ opacity: isActive ? 1 : 0 }}
          />
          <path
            d={TOOTH.outline}
            fill="none"
            stroke={CYAN}
            strokeLinejoin="round"
            strokeWidth={isActive ? 2.25 : 1.5}
            strokeOpacity={isActive ? 1 : 0.62}
            className="transition-[stroke-opacity,stroke-width] duration-300"
          />
          <text
            y={-229}
            transform={flip ? 'rotate(180 0 -229)' : undefined}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="9"
            letterSpacing="0.12em"
            fill={CYAN}
            fillOpacity={isActive ? 1 : 0.55}
            className="font-mono"
          >
            {item.index}
          </text>
          <g transform={flip ? `rotate(180 0 ${-labelMid})` : undefined}>
            {item.toothLines.map((line, row) => (
              <text
                key={line}
                y={-rows[row]}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="12"
                fontWeight="600"
                letterSpacing="0.04em"
                fill={isActive ? '#FFFFFF' : '#BFEFF7'}
                className="font-mono transition-[fill] duration-300"
              >
                {line}
              </text>
            ))}
          </g>
        </motion.g>
      </Link>
    </g>
  )
}

function GearSvg({ active, onActive }) {
  const activeItem = experiences.find((item) => item.slug === active)
  const hasLogo = Boolean(activeItem?.logo)

  return (
    <svg
      viewBox="-300 -300 600 600"
      role="group"
      aria-label="Gear hub: seven teeth, one per experience"
      className="mx-auto block w-full max-w-[min(40rem,78svh)] select-none"
    >
      <defs>
        <filter id="tooth-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        <linearGradient id="tooth-idle" gradientUnits="userSpaceOnUse" x1="0" y1={-rootR} x2="0" y2={-tipR}>
          <stop offset="0" stopColor="#081421" />
          <stop offset="1" stopColor="#0C2233" />
        </linearGradient>
        <linearGradient id="tooth-active" gradientUnits="userSpaceOnUse" x1="0" y1={-rootR} x2="0" y2={-tipR}>
          <stop offset="0" stopColor="#0A2C3C" />
          <stop offset="1" stopColor="#0B5C70" />
        </linearGradient>
        <radialGradient id="body-fill" gradientUnits="userSpaceOnUse" cx="0" cy="0" r={rootR}>
          <stop offset="0.5" stopColor="#060D18" />
          <stop offset="1" stopColor="#081421" />
        </radialGradient>
        {LOGOS.map(({ slug, box, feather = 3 }) => (
          <g key={slug}>
            <filter id={`feather-blur-${slug}`} filterUnits="userSpaceOnUse" x={-HUB_R} y={-HUB_R} width={HUB_R * 2} height={HUB_R * 2}>
              <feGaussianBlur stdDeviation={feather * 0.8} />
            </filter>
            <mask id={`feather-${slug}`} maskUnits="userSpaceOnUse" x={-HUB_R} y={-HUB_R} width={HUB_R * 2} height={HUB_R * 2}>
              <rect
                x={-box.w / 2 + feather}
                y={-box.h / 2 + feather}
                width={box.w - feather * 2}
                height={box.h - feather * 2}
                fill="#FFFFFF"
                filter={`url(#feather-blur-${slug})`}
              />
            </mask>
          </g>
        ))}
      </defs>

      {/* Radial HUD rings */}
      <g fill="none" stroke={CYAN} pointerEvents="none">
        <circle r="262" strokeOpacity="0.14" />
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 160, ease: 'linear', repeat: Infinity }}
        >
          <circle r="284" strokeOpacity="0.3" strokeWidth="5" strokeDasharray="1.5 13.37" />
        </motion.g>
        <motion.g
          animate={{ rotate: -360 }}
          transition={{ duration: 110, ease: 'linear', repeat: Infinity }}
        >
          <circle r="296" strokeOpacity="0.22" strokeDasharray="120 68 30 92" />
        </motion.g>
        {DOTS.map(([x, y]) => (
          <circle key={`${x}${y}`} cx={x.toFixed(1)} cy={y.toFixed(1)} r="1.6" fill={CYAN} fillOpacity="0.45" stroke="none" />
        ))}
      </g>

      {/* Gear body */}
      <g pointerEvents="none">
        <circle r={rootR} fill="url(#body-fill)" stroke={CYAN} strokeOpacity="0.62" strokeWidth="1.5" />
        <circle r="136" fill="none" stroke={CYAN} strokeOpacity="0.28" />
        {experiences.map((item, i) => {
          const a = ((toothAngle(i) + 180 / GEAR.teeth - 90) * Math.PI) / 180
          return (
            <circle
              key={item.slug}
              cx={(114 * Math.cos(a)).toFixed(2)}
              cy={(114 * Math.sin(a)).toFixed(2)}
              r="9"
              fill="#05080F"
              stroke={CYAN}
              strokeOpacity="0.4"
            />
          )
        })}
        <circle r="92" fill="#05080F" stroke={CYAN} strokeOpacity="0.55" strokeWidth="1.5" />
      </g>

      {/* Teeth */}
      {experiences.map((item, i) => (
        <Tooth key={item.slug} item={item} i={i} isActive={active === item.slug} onActive={onActive} />
      ))}

      {/* Drafting reference: pitch circle, base circle, centerlines */}
      <g fill="none" stroke={CYAN} pointerEvents="none">
        <circle r={GEAR.pitchR} strokeOpacity="0.3" strokeWidth="0.75" strokeDasharray="16 4 2 4" />
        <circle r={baseR} strokeOpacity="0.14" strokeWidth="0.75" strokeDasharray="3 5" />
        <path d="M -258 0 H -100 M 100 0 H 258 M 0 100 V 258" strokeOpacity="0.16" strokeWidth="0.75" strokeDasharray="16 4 2 4" />
      </g>

      {/* Hub: bore and keyway at rest, logo plate when a tooth is active */}
      <g pointerEvents="none">
        <g className={fade} style={{ opacity: activeItem ? 0 : 1 }}>
          <path
            d="M -7 -27.1 V -38 H 7 V -27.1 A 28 28 0 1 1 -7 -27.1 Z"
            fill="#03050A"
            stroke={CYAN}
            strokeOpacity="0.6"
            strokeWidth="1.25"
          />
          <path d="M -6 0 H 6 M 0 -6 V 6" stroke={CYAN} strokeOpacity="0.7" strokeWidth="0.75" />
          <text
            y="60"
            textAnchor="middle"
            fontSize="9.5"
            letterSpacing="0.2em"
            fill={CYAN}
            fillOpacity="0.75"
            className="font-mono"
          >
            SELECT A TOOTH
          </text>
        </g>

        {LOGOS.map((item) => (
          <g key={item.slug} className={fade} style={{ opacity: active === item.slug ? 1 : 0 }}>
            {/* Plate in the logo's own background colour, edges feathered into it */}
            <circle r={HUB_R} fill={item.plate} />
            <image
              href={asset(item.logo)}
              x={-item.box.w / 2}
              y={-item.box.h / 2}
              width={item.box.w}
              height={item.box.h}
              mask={`url(#feather-${item.slug})`}
            />
          </g>
        ))}
        <circle
          r={HUB_R}
          fill="none"
          stroke={CYAN}
          strokeWidth="1.5"
          className={fade}
          style={{ opacity: activeItem ? 0.9 : 0 }}
        />
        <text
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="15"
          fontWeight="600"
          letterSpacing="0.1em"
          fill="#FFFFFF"
          className={`font-mono ${fade}`}
          style={{ opacity: activeItem && !hasLogo ? 1 : 0 }}
        >
          {activeItem && !hasLogo ? activeItem.label.toUpperCase() : ''}
        </text>
      </g>
    </svg>
  )
}

// Gear plus a plain index of the same seven links. The two share hover state,
// and the list keeps every route reachable by touch and keyboard.
export default function GearHub({ children }) {
  const [active, setActive] = useState(null)

  return (
    <div className="grid items-center gap-x-14 gap-y-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:grid-rows-[auto_1fr]">
      <div className="lg:self-end">{children}</div>

      <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
        <GearSvg active={active} onActive={setActive} />
        <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-hud/50">
          Z {GEAR.teeth} · Pressure angle {GEAR.pressureDeg}° · Involute flanks
        </p>
      </div>

      <ol className="border-t border-hud/20 lg:self-start">
        {experiences.map((item) => {
          const isActive = active === item.slug
          return (
            <li key={item.slug}>
              <Link
                to={item.path}
                onPointerEnter={() => setActive(item.slug)}
                onPointerLeave={() => setActive(null)}
                onFocus={() => setActive(item.slug)}
                onBlur={() => setActive(null)}
                className={`grid grid-cols-[2.25rem_1fr_auto] items-baseline gap-x-3 border-b border-hud/20 px-2 py-3 outline-none transition-colors ${
                  isActive ? 'bg-hud/[0.07]' : ''
                }`}
              >
                <span className="font-mono text-xs text-hud/70">{item.index}</span>
                <span>
                  <span className={`block text-[17px] transition-colors ${isActive ? 'text-white' : 'text-readout/90'}`}>
                    {item.label}
                  </span>
                  <span className="mt-0.5 block font-mono text-[11px] leading-relaxed text-readout/50">
                    {item.role} · {item.period}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className={`font-mono text-sm transition-[color,translate] duration-300 ${
                    isActive ? 'translate-x-1 text-hud' : 'text-hud/40'
                  }`}
                >
                  →
                </span>
              </Link>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
