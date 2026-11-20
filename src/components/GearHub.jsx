import { useRef, useState } from 'react'
import { Link } from 'react-router'
import { AnimatePresence, motion, useInView } from 'framer-motion'
import { asset, experiences, workLinks } from '../data/experiences.js'
import { thumbnail } from '../data/media.js'
import { GEAR, REF, TOOTH, baseR, rootR, tipR, toothAngle } from '../lib/gear.js'

const CYAN = '#00E5FF'

const fade = 'transition-opacity duration-300'
const HUB_R = 80
const SPRING = { type: 'spring', stiffness: 300, damping: 20 }
const HOVER_SCALE = 1.13

// Machined look: the gear is drawn as a face plus a sidewall extruded straight
// down the screen. Inspection tilts the face back by TILT_DEG (an orthographic
// tilt is a vertical squash by cos) and lets more of the sidewall show.
const TILT_DEG = 52
const TILT = Math.cos((TILT_DEG * Math.PI) / 180)
const DEPTH_REST = 7 // sidewall height on screen, face-on
const DEPTH_INSPECT = 27 // sidewall height on screen, tilted
const LAYERS = 6 // stacked silhouettes that make up the sidewall
const SIDEWALL = '#071A27'
const WALL = '#0B2231' // inner wall of the bore and lightening holes
const VOID = '#03050A'

const BORE = 'M -7 -27.1 V -38 H 7 V -27.1 A 28 28 0 1 1 -7 -27.1 Z'
// Lathe-turning rings on the hub boss, between the bore and the boss edge.
const LATHE = Array.from({ length: 13 }, (_, n) => 40 + n * 4)
// One lightening hole in the web between each pair of teeth.
const HOLES = experiences.map((item, i) => {
  const a = ((toothAngle(i) + 180 / GEAR.teeth - 90) * Math.PI) / 180
  return { slug: item.slug, cx: (114 * Math.cos(a)).toFixed(2), cy: (114 * Math.sin(a)).toFixed(2) }
})

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

// Where a point on tooth `i` lands on screen in the inspection view.
// `point` is tooth-local (right flank); `mirror` picks the left flank.
const project = (i, [x, y], mirror = false) => {
  const a = (toothAngle(i) * Math.PI) / 180
  const lx = mirror ? -x : x
  return [lx * Math.cos(a) - y * Math.sin(a), (lx * Math.sin(a) + y * Math.cos(a)) * TILT]
}

// Inspection callouts. `from` is the feature on the tilted gear, `to` is the
// elbow where the leader meets its label; both in SVG units. The label sits on
// a shelf running left or right from the elbow.
const flankEdge = project(3, REF.flank)
const CALLOUTS = [
  { label: 'Pitch Circle', from: project(0, REF.pitchGap), to: [-70, -226], side: 'left' },
  { label: '25° Pressure Angle', from: project(0, REF.angleAnchor), to: [50, -226], side: 'right' },
  { label: 'Root Fillet', from: project(4, REF.fillet, true), to: [-50, 236], side: 'left' },
  // The flank surface is the sidewall below the flank edge, so aim halfway down it.
  { label: 'Tooth Flank', from: [flankEdge[0], flankEdge[1] + DEPTH_INSPECT / 2], to: [90, 236], side: 'right' },
].map((item) => ({
  ...item,
  leader: `M ${item.from.map((n) => n.toFixed(1)).join(' ')} L ${item.to.join(' ')}`,
  // Percent of the square gear frame, for the HTML label.
  style: {
    top: `${((item.to[1] + 300) / 6).toFixed(2)}%`,
    ...(item.side === 'left'
      ? { right: `${((300 - item.to[0]) / 6).toFixed(2)}%` }
      : { left: `${((item.to[0] + 300) / 6).toFixed(2)}%` }),
  },
}))

// Geometry drawn on the gear face for the callouts, keyed by tooth index.
// Drawn inside the tooth so it follows the hover scale.
const INSPECT_MARKS = {
  // Radial line and flank tangent through the pitch point, 25° apart.
  0: (
    <>
      <path d={REF.angleLines} stroke="#FFFFFF" strokeOpacity="0.85" strokeWidth="1" />
      <path d={REF.angleArc} stroke={CYAN} strokeWidth="1.5" />
    </>
  ),
  3: <path d={TOOTH.flank} stroke="#FFFFFF" strokeWidth="2.5" />,
  4: <path d={TOOTH.fillet} transform="scale(-1 1)" stroke="#FFFFFF" strokeWidth="3" />,
}

const shift = (amount) => ({ transform: `translateY(${amount.toFixed(2)}px)` })

// A tooth is a plain link to its case study: click, tap, Enter, middle-click
// and modified clicks all keep the browser's own behaviour.
// isActive: under a mouse pointer or keyboard focus (raised, lit, logo in the hub).
// isCurrent: the tooth the readout is showing, and the gear's single tab stop;
// arrow keys move focus between teeth. Touch never previews, so the first tap
// navigates.
function Tooth({ item, i, isActive, isCurrent, onHover, linkRef, children }) {
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
        ref={linkRef}
        tabIndex={isCurrent ? 0 : -1}
        data-tooth={item.slug}
        className="group cursor-pointer outline-none"
        onPointerEnter={(event) => event.pointerType === 'mouse' && onHover(item.slug)}
        onPointerLeave={(event) => event.pointerType === 'mouse' && onHover(null)}
        onFocus={() => onHover(item.slug)}
        onBlur={() => onHover(null)}
      >
        <motion.g
          initial={false}
          animate={{ scale: isActive ? HOVER_SCALE : 1 }}
          transition={SPRING}
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
          {/* Edge chamfer: a wide stroke clipped to the tooth leaves a 4-unit band inside the outline */}
          <path
            d={TOOTH.outline}
            fill="none"
            stroke="#9FEFFA"
            strokeOpacity="0.1"
            strokeWidth="8"
            clipPath="url(#tooth-clip)"
          />
          <path
            d={TOOTH.outline}
            fill="none"
            stroke={CYAN}
            strokeLinejoin="round"
            strokeWidth={isActive ? 2.25 : isCurrent ? 1.9 : 1.5}
            strokeOpacity={isActive || isCurrent ? 1 : 0.62}
            className="transition-[stroke-opacity,stroke-width] duration-300"
          />
          {/* Keyboard focus ring: a white dashed outline, shown only for :focus-visible */}
          <path
            d={TOOTH.outline}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeDasharray="6 4"
            pointerEvents="none"
            className="opacity-0 group-focus-visible:opacity-100"
          />
          {/* One white run around the outline each time this tooth becomes current */}
          {isCurrent && (
            <path
              className="tooth-glint"
              d={TOOTH.outline}
              pathLength="1"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="3"
              strokeLinecap="round"
              pointerEvents="none"
            />
          )}
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
                fill={isActive ? '#FFFFFF' : 'url(#ti-text)'}
                className="font-mono transition-[fill] duration-300"
              >
                {line}
              </text>
            ))}
          </g>
          {children}
        </motion.g>
      </Link>
    </g>
  )
}

// Sidewall: the gear silhouette repeated down the screen, deepest copy first.
// Each copy's teeth share the face teeth's hover spring, so a raised tooth
// keeps its wall. Only the deepest copy gets a visible edge line.
function Sidewall({ depth, active }) {
  return Array.from({ length: LAYERS }, (_, n) => {
    const layer = LAYERS - n
    const isBack = layer === LAYERS
    return (
      <g
        key={layer}
        className="gear-plane"
        style={shift((depth * layer) / LAYERS)}
        fill={SIDEWALL}
        stroke={isBack ? CYAN : SIDEWALL}
        strokeOpacity={isBack ? 0.32 : 1}
        strokeWidth={isBack ? 1.25 : 3}
        strokeLinejoin="round"
      >
        <circle r={rootR} />
        {experiences.map((item, i) => (
          <g key={item.slug} transform={`rotate(${toothAngle(i).toFixed(3)})`}>
            <motion.g
              initial={false}
              animate={{ scale: active === item.slug ? HOVER_SCALE : 1 }}
              transition={SPRING}
              style={{ originX: 0.5, originY: 1 }}
            >
              <path d={TOOTH.fill} stroke="none" />
              <path d={TOOTH.outline} fill="none" />
            </motion.g>
          </g>
        ))}
      </g>
    )
  })
}

// Outer pointer: a bracket and index mark that swing to the current tooth by the
// shorter way round. `.gear-plane` supplies the centre origin and the easing
// (and drops the easing under reduced motion).
function Reticle({ index }) {
  const turn = useRef(toothAngle(index))
  turn.current += ((((toothAngle(index) - turn.current) % 360) + 540) % 360) - 180

  return (
    <g className="gear-plane" style={{ transform: `rotate(${turn.current.toFixed(3)}deg)` }}>
      <path d="M -52 -263 A 268 268 0 0 1 52 -263 M -52 -263 L -50.4 -255.2 M 52 -263 L 50.4 -255.2" strokeOpacity="0.95" strokeWidth="1.5" />
      <path d="M 0 -258.5 L -6 -267.5 H 6 Z" fill="#FFFFFF" stroke="none" />
    </g>
  )
}

function GearSvg({ active, current, onHover, toothRefs, inspect }) {
  const activeItem = experiences.find((item) => item.slug === active)
  const hasLogo = Boolean(activeItem?.logo)
  // Gear-plane units. The tilt squashes them, so divide to keep screen height.
  const depth = inspect ? DEPTH_INSPECT / TILT : DEPTH_REST
  const reveal = { className: `${fade} ${inspect ? 'delay-500' : ''}`, style: { opacity: inspect ? 1 : 0 } }
  const ringsRef = useRef(null)
  const ringsOnScreen = useInView(ringsRef)

  return (
    <svg
      viewBox="-300 -300 600 600"
      role="group"
      aria-label="Gear hub: seven teeth, one per experience"
      className="block w-full select-none"
    >
      <defs>
        {/* Titanium label fill, per text box: white top to light grey bottom */}
        <linearGradient id="ti-text" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.55" stopColor="#E8EEF5" />
          <stop offset="1" stopColor="#C6D0DB" />
        </linearGradient>
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
        <radialGradient id="hub-fill" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="92">
          <stop offset="0.3" stopColor="#060C16" />
          <stop offset="1" stopColor="#0A1826" />
        </radialGradient>
        {/* Light from the upper left: raised edges catch it there, recessed edges on the far side */}
        <linearGradient id="rim-light" gradientUnits="userSpaceOnUse" x1={-rootR} y1={-rootR} x2={rootR} y2={rootR}>
          <stop offset="0.15" stopColor="#EAFDFF" stopOpacity="0.75" />
          <stop offset="0.5" stopColor="#7FDCEA" stopOpacity="0.16" />
          <stop offset="0.85" stopColor="#7FDCEA" stopOpacity="0.06" />
        </linearGradient>
        <linearGradient id="rim-shade" gradientUnits="userSpaceOnUse" x1={-rootR} y1={-rootR} x2={rootR} y2={rootR}>
          <stop offset="0.2" stopColor="#7FDCEA" stopOpacity="0.04" />
          <stop offset="0.8" stopColor="#CFF8FF" stopOpacity="0.6" />
        </linearGradient>
        {/* Turned faces reflect along one axis: bright at both ends, dull across */}
        <linearGradient id="lathe" gradientUnits="userSpaceOnUse" x1="-64" y1="-64" x2="64" y2="64">
          <stop offset="0" stopColor="#CFF8FF" stopOpacity="0.5" />
          <stop offset="0.5" stopColor="#CFF8FF" stopOpacity="0.05" />
          <stop offset="1" stopColor="#CFF8FF" stopOpacity="0.5" />
        </linearGradient>
        <clipPath id="tooth-clip">
          <path d={TOOTH.fill} />
        </clipPath>
        <clipPath id="bore-clip">
          <path d={BORE} />
        </clipPath>
        <clipPath id="holes-clip">
          {HOLES.map(({ slug, cx, cy }) => (
            <circle key={slug} cx={cx} cy={cy} r="9" />
          ))}
        </clipPath>
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

      {/* Everything in the plane of the gear face. Inspection squashes it about the gear center. */}
      <g className="gear-plane" style={{ transform: `scaleY(${inspect ? TILT.toFixed(4) : 1})` }}>
        {/* Radial HUD rings */}
        <g fill="none" stroke={CYAN} pointerEvents="none">
          <circle r="262" strokeOpacity="0.14" />
          {/* Slow ring spin is CSS (.ring-spin); it stops offscreen and under reduced motion. */}
          <g ref={ringsRef} className={ringsOnScreen ? '' : 'spin-paused'}>
            <g className="ring-spin" style={{ animationDuration: '160s' }}>
              <circle r="284" strokeOpacity="0.3" strokeWidth="5" strokeDasharray="1.5 13.37" />
            </g>
            <g className="ring-spin" style={{ animationDuration: '110s', animationDirection: 'reverse' }}>
              <circle r="296" strokeOpacity="0.22" strokeDasharray="120 68 30 92" />
            </g>
          </g>
          {DOTS.map(([x, y]) => (
            <circle key={`${x}${y}`} cx={x.toFixed(1)} cy={y.toFixed(1)} r="1.6" fill={CYAN} fillOpacity="0.45" stroke="none" />
          ))}
          {current && <Reticle index={experiences.findIndex((item) => item.slug === current)} />}
        </g>

        <g pointerEvents="none">
          <Sidewall depth={depth} active={active} />
        </g>

        {/* Gear body: chamfered rim, recessed web with lightening holes, turned hub boss */}
        <g pointerEvents="none">
          <circle r={rootR} fill="url(#body-fill)" />
          {/* Root chamfer; each tooth base covers it and carries its own band on */}
          <circle r={rootR - 2} fill="none" stroke="#9FEFFA" strokeOpacity="0.1" strokeWidth="4" />
          <circle r={rootR} fill="none" stroke={CYAN} strokeOpacity="0.62" strokeWidth="1.5" />
          <circle r={rootR - 7} fill="none" stroke="url(#rim-light)" strokeWidth="1" />

          <circle r="136" fill="#050B15" stroke={CYAN} strokeOpacity="0.2" />
          <circle r="136" fill="none" stroke="url(#rim-shade)" strokeWidth="1.25" />
          {HOLES.map(({ slug, cx, cy }) => (
            <circle key={slug} cx={cx} cy={cy} r="9" fill={WALL} />
          ))}
          {/* Far opening of each hole, offset by the gear thickness: what is left above it is inner wall */}
          <g clipPath="url(#holes-clip)">
            <g className="gear-plane" style={shift(depth)} fill={VOID}>
              {HOLES.map(({ slug, cx, cy }) => (
                <circle key={slug} cx={cx} cy={cy} r="9" />
              ))}
            </g>
          </g>
          {HOLES.map(({ slug, cx, cy }) => (
            <circle key={slug} cx={cx} cy={cy} r="9" fill="none" stroke={CYAN} strokeOpacity="0.4" />
          ))}

          <circle r="92" fill="url(#hub-fill)" stroke={CYAN} strokeOpacity="0.4" strokeWidth="1.5" />
          {LATHE.map((r) => (
            <circle key={r} r={r} fill="none" stroke="url(#lathe)" strokeWidth="0.6" />
          ))}
          <circle r="92" fill="none" stroke="url(#rim-light)" strokeWidth="1.25" />
        </g>

        {/* Teeth */}
        {experiences.map((item, i) => (
          <Tooth
            key={item.slug}
            item={item}
            i={i}
            isActive={active === item.slug}
            isCurrent={(current ?? experiences[0].slug) === item.slug}
            onHover={onHover}
            linkRef={(node) => {
              toothRefs.current[item.slug] = node
            }}
          >
            {INSPECT_MARKS[i] && (
              <g fill="none" strokeLinecap="round" pointerEvents="none" {...reveal}>
                {INSPECT_MARKS[i]}
              </g>
            )}
          </Tooth>
        ))}

        {/* Drafting reference: pitch circle, base circle, centerlines */}
        <g fill="none" stroke={CYAN} pointerEvents="none">
          <circle
            r={GEAR.pitchR}
            strokeOpacity={inspect ? 0.85 : 0.3}
            strokeWidth={inspect ? 1.25 : 0.75}
            strokeDasharray="16 4 2 4"
            className="transition-[stroke-opacity,stroke-width] duration-500"
          />
          <circle r={baseR} strokeOpacity="0.14" strokeWidth="0.75" strokeDasharray="3 5" />
          <path d="M -258 0 H -100 M 100 0 H 258 M 0 100 V 258" strokeOpacity="0.16" strokeWidth="0.75" strokeDasharray="16 4 2 4" />
        </g>

        {/* Hub: bore and keyway at rest, logo plate when a tooth is active */}
        <g pointerEvents="none">
          <g className={fade} style={{ opacity: activeItem ? 0 : 1 }}>
            <path d={BORE} fill={WALL} />
            <g clipPath="url(#bore-clip)">
              <path d={BORE} fill={VOID} className="gear-plane" style={shift(depth)} />
            </g>
            <path d={BORE} fill="none" stroke={CYAN} strokeOpacity="0.6" strokeWidth="1.25" />
            <path d="M -6 0 H 6 M 0 -6 V 6" stroke={CYAN} strokeOpacity="0.7" strokeWidth="0.75" />
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
            fill="url(#ti-text)"
            className={`font-mono ${fade}`}
            style={{ opacity: activeItem && !hasLogo ? 1 : 0 }}
          >
            {activeItem && !hasLogo ? activeItem.label.toUpperCase() : ''}
          </text>
        </g>
      </g>

      {/* Callout leaders, in screen space so they stay upright while the gear tilts */}
      <g fill="none" stroke={CYAN} pointerEvents="none" {...reveal}>
        {CALLOUTS.map(({ label, leader, from }) => (
          <g key={label}>
            <path d={leader} strokeOpacity="0.7" vectorEffect="non-scaling-stroke" />
            <circle cx={from[0].toFixed(1)} cy={from[1].toFixed(1)} r="3.5" fill="#05080F" strokeWidth="1.25" />
          </g>
        ))}
      </g>
    </svg>
  )
}

// Behind the gear: a wide cyan backlight and caliper-style degree rings. Drawn
// on a frame 1.4x the gear's, in the same units, so r 322 here sits just
// outside the gear's own HUD rings (r 296). The rings tilt with the gear.
const DEGREES = Array.from({ length: 72 }, (_, n) => n * 5)

function GearBackdrop({ inspect }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 -z-10 aspect-square w-[140%] -translate-x-1/2 -translate-y-1/2">
      <div className="surface-hex-rich absolute inset-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(0,229,255,0.08)_0%,transparent_65%)]" />
      <svg
        viewBox="-420 -420 840 840"
        className="absolute inset-0 h-full w-full [mask-image:radial-gradient(circle_closest-side,#000_78%,transparent_97%)]"
      >
        <g
          className="gear-plane"
          style={{ transform: `scaleY(${inspect ? TILT.toFixed(4) : 1})` }}
          fill="none"
          stroke={CYAN}
        >
          <circle r="322" strokeOpacity="0.16" />
          <circle r="352" strokeOpacity="0.09" strokeDasharray="2 7" />
          <circle r="384" strokeOpacity="0.1" />
          {DEGREES.map((deg) => {
            const length = deg % 30 === 0 ? 13 : deg % 15 === 0 ? 8 : 4
            return (
              <path
                key={deg}
                d={`M 0 ${-322} V ${-322 - length}`}
                transform={`rotate(${deg})`}
                strokeOpacity={deg % 30 === 0 ? 0.34 : 0.2}
              />
            )
          })}
          {DEGREES.filter((deg) => deg % 30 === 0).map((deg) => {
            const a = ((deg - 90) * Math.PI) / 180
            return (
              <text
                key={deg}
                x={(368 * Math.cos(a)).toFixed(1)}
                y={(368 * Math.sin(a)).toFixed(1)}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="9"
                letterSpacing="0.1em"
                fill={CYAN}
                fillOpacity="0.3"
                stroke="none"
                className="font-mono"
              >
                {String(deg).padStart(3, '0')}
              </text>
            )
          })}
        </g>
      </svg>
    </div>
  )
}

// Project introduction beside the gear. Fixed height, so moving between teeth
// never shifts the layout. Before any tooth is read it shows the prompt; after
// that it keeps the last tooth read. It only describes: the teeth navigate.
function Readout({ item }) {
  // No artifact image on file (Honda, Marion): show the logo on its own plate.
  const [src, alt, light] = item ? item.preview || [item.logo, `${item.label} logo`] : []

  return (
    <div className="h-[11.5rem] overflow-hidden border border-white/10 bg-panel/95 px-4 py-4 sm:px-5" data-readout={item?.slug ?? 'prompt'}>
      {item ? (
        <div className="grid h-full grid-cols-[5.5rem_minmax(0,1fr)] gap-4 sm:grid-cols-[7rem_minmax(0,1fr)]">
          <img
            key={src}
            src={asset(thumbnail(src))}
            alt={alt}
            style={item.preview ? undefined : { backgroundColor: item.plate }}
            className={`aspect-square w-full border border-white/10 ${
              !item.preview ? 'object-contain p-2' : light ? 'bg-[#F4F6F8] object-contain p-1' : 'object-cover'
            }`}
          />
          <div className="flex min-w-0 flex-col">
            <p className="relative self-start text-xl font-medium tracking-[-0.01em]">
              <span className="text-titanium">{item.label}</span>
              {/* Remounts on every tooth change, so the band sweeps once per change */}
              <span key={item.slug} aria-hidden="true" className="glint">
                {item.label}
              </span>
            </p>
            <p className="mt-1 truncate text-sm text-ti-400">{item.role} · {item.period}</p>
            <p className="mt-2 line-clamp-2 text-[14px] leading-snug text-ti-50">
              <span className="text-ti-400">{item.metricLabel || 'Result'}: </span>
              {item.metric}
            </p>
            <Link
              to={item.path}
              className="mt-auto inline-flex min-h-[44px] items-center gap-2 self-start text-sm text-hud underline decoration-hud/40 underline-offset-[5px] transition-colors hover:decoration-hud lg:min-h-[32px]"
            >
              {workLinks[item.slug]} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex h-full flex-col justify-center">
          <p className="text-xl font-medium text-white">Select a project</p>
          <p className="mt-2 max-w-[44ch] text-[15px] leading-relaxed text-ti-300">
            Seven case studies, one per tooth: co-op, research, coursework and personal builds.
          </p>
        </div>
      )}
    </div>
  )
}

const views = [
  ['gear', 'Gear View'],
  ['list', 'Project List'],
]
const STEP = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }

// Gear, readout, and a plain index of the same seven routes.
//   hover:   tooth under a mouse pointer or keyboard focus
//   reading: last tooth read, so the readout keeps it after the pointer leaves
// On phones a segmented control shows either the gear and readout or the list.
export default function GearHub() {
  const [hover, setHover] = useState(null)
  const [reading, setReading] = useState(null)
  const [view, setView] = useState('gear')
  const [inspect, setInspect] = useState(false)
  const toothRefs = useRef({})

  const current = hover ?? reading
  const item = experiences.find((entry) => entry.slug === current)

  const preview = (slug) => {
    setHover(slug)
    if (slug) setReading(slug)
  }

  // Arrow keys step focus round the teeth; Enter opens the focused tooth.
  const stepTooth = (event) => {
    const step = STEP[event.key]
    if (!step) return
    event.preventDefault()
    const index = Math.max(experiences.findIndex((entry) => entry.slug === current), 0)
    const next = experiences[(index + step + experiences.length) % experiences.length]
    toothRefs.current[next.slug]?.focus()
  }

  const onlyIn = (name) => (view === name ? '' : 'max-md:hidden')

  return (
    <div className="grid items-center gap-x-14 gap-y-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:grid-rows-[auto_1fr]">
      <div role="group" aria-label="Hub view" className="grid grid-cols-2 border border-hud/40 md:hidden">
        {views.map(([name, text]) => (
          <button
            key={name}
            type="button"
            aria-pressed={view === name}
            onClick={() => setView(name)}
            className={`min-h-[44px] cursor-pointer font-mono text-[11px] uppercase tracking-[0.18em] transition-colors ${
              view === name ? 'bg-hud/15 text-white' : 'text-hud'
            }`}
          >
            {text}
          </button>
        ))}
      </div>

      {/* Top-aligned, so the gear never moves under the pointer. */}
      <div className={`relative lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start ${onlyIn('gear')}`}>
        {/* In flow above the gear on small screens; in the empty corner of the gear frame on desktop */}
        <div className="mb-3 flex justify-end lg:absolute lg:right-0 lg:top-0 lg:z-10 lg:mb-0">
          <button
            type="button"
            aria-pressed={inspect}
            onClick={() => setInspect((value) => !value)}
            className={`inline-flex min-h-[44px] cursor-pointer items-center gap-2 border px-3 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hud lg:min-h-[32px] ${
              inspect
                ? 'border-hud/70 bg-hud/10 text-white'
                : 'border-white/15 text-ti-400 hover:border-hud/60 hover:text-ti-100'
            }`}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.25"
              className="h-3.5 w-3.5"
            >
              <circle cx="7" cy="7" r="3.75" />
              <path d="M7 0.5 V3 M7 11 V13.5 M0.5 7 H3 M11 7 H13.5" />
              {inspect && <circle cx="7" cy="7" r="1.5" fill="currentColor" stroke="none" />}
            </svg>
            Inspect Gear
          </button>
        </div>

        <div data-gear-frame onKeyDown={stepTooth} className="relative isolate mx-auto w-full max-w-[min(40rem,78svh)]">
          <GearBackdrop inspect={inspect} />
          <GearSvg active={hover} current={current} onHover={preview} toothRefs={toothRefs} inspect={inspect} />
          <ul
            aria-hidden={!inspect}
            aria-label="Gear features"
            className={`pointer-events-none absolute inset-0 ${fade} ${inspect ? 'opacity-100 delay-500' : 'opacity-0'}`}
          >
            {CALLOUTS.map(({ label, style }) => (
              <li
                key={label}
                style={style}
                className="absolute -translate-y-full whitespace-nowrap border-b border-hud/70 px-1 pb-1 font-mono text-[9.5px] uppercase tracking-[0.08em] text-white sm:text-[11px] sm:tracking-[0.16em]"
              >
                {label}
              </li>
            ))}
          </ul>
        </div>



        <AnimatePresence initial={false}>
          {inspect && (
            <motion.div
              key="inspect-note"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden pb-2"
            >
              <div className="mx-auto mt-6 max-w-[34rem] border-l border-hud/50 pl-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ti-400">
                  Why the root fillet matters
                </p>
                <p className="mt-2 text-[15px] leading-relaxed text-ti-300">
                  A loaded tooth bends like a short cantilever, so tensile stress peaks at the root
                  fillet. A tighter fillet radius raises the stress concentration there, and that is
                  where bending fatigue cracks start. Fillet geometry sets how many cycles a tooth
                  survives.
                </p>
                <Link
                  to="/project/gearlab"
                  className="mt-3 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-hud underline decoration-hud/40 underline-offset-[5px] transition-colors hover:decoration-hud"
                >
                  Fatigue testing at GearLab <span aria-hidden="true">→</span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className={`lg:col-start-1 lg:row-start-1 lg:self-end ${onlyIn('gear')}`}>
        <Readout item={item} />
      </div>

      {/* Opaque plate: the page's hex weave stops behind the list */}
      <ol className={`border-t border-hud/20 bg-obsidian/90 lg:col-start-1 lg:row-start-2 lg:self-start ${onlyIn('list')}`}>
        {experiences.map((item) => {
          const isActive = current === item.slug
          return (
            <li key={item.slug}>
              <Link
                to={item.path}
                onPointerEnter={(event) => event.pointerType === 'mouse' && preview(item.slug)}
                onPointerLeave={(event) => event.pointerType === 'mouse' && setHover(null)}
                onFocus={() => preview(item.slug)}
                onBlur={() => setHover(null)}
                className={`grid grid-cols-[1fr_auto] items-baseline gap-x-3 border-b border-white/10 px-3 py-4 transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-hud ${
                  isActive ? 'bg-hud/[0.07]' : ''
                }`}
              >
                <span>
                  <span className={`block text-[17px] transition-colors ${isActive ? 'text-white' : 'text-ti-50'}`}>
                    {item.label}
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-ti-400">
                    {item.role} · {item.period}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className={`font-mono text-sm transition-[color,translate] duration-300 ${
                    isActive ? 'translate-x-1 text-hud' : 'text-ti-400'
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
