import { createElement, useId, useLayoutEffect, useRef } from 'react'
import { useTransform } from 'framer-motion'

const clamp = value => Math.max(0, Math.min(1, Number(value)))
const line = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, vectorEffect: 'non-scaling-stroke' }

// Motion treats `transform` as CSS, which cannot express SVG pivot syntax.
// Bind these attributes natively to keep every local mechanical pivot exact.
function ScrollTransform({ as = 'g', value, opacity, ...props }) {
  const ref = useRef(null)
  useLayoutEffect(() => {
    const bind = (motionValue, attribute) => {
      if (!motionValue) return () => {}
      const apply = next => ref.current?.setAttribute(attribute, String(next))
      apply(motionValue.get())
      return motionValue.on('change', apply)
    }
    const stopTransform = bind(value, 'transform')
    const stopOpacity = bind(opacity, 'opacity')
    return () => { stopTransform(); stopOpacity() }
  }, [value, opacity])
  return createElement(as, { ...props, ref, transform: value.get(), opacity: opacity?.get() })
}

function Wheel({ x, progress, still }) {
  const turn = useTransform(progress, value => `rotate(${still ? 25 : clamp(value) * 420} 0 0)`)
  return <g transform={`translate(${x} 88)`}>
    <circle r="10" {...line} />
    <circle r="7" {...line} strokeWidth=".8" />
    <ScrollTransform value={turn}>
      {Array.from({ length: 5 }, (_, index) => <path key={index} d="M0 -2L-1 -6L1 -7L2 -2" transform={`rotate(${index * 72})`} {...line} strokeWidth=".65" />)}
    </ScrollTransform>
    <circle r="1.5" fill="currentColor" stroke="none" />
  </g>
}

function Roadster({ progress, fire, still, id }) {
  const flame = useTransform([progress, fire], ([position, power]) => {
    const p = still ? 1 : clamp(position), f = still ? .8 : clamp(power)
    const ripple = still ? 0 : Math.sin(p * 98) * .055 * f
    return `scale(${(.25 + f * .75 + ripple).toFixed(4)} ${( .65 + f * .35 - ripple).toFixed(4)})`
  })
  const visible = useTransform(fire, value => still ? .9 : clamp(value))
  return <>
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="-35" y2="0" gradientUnits="userSpaceOnUse">
        <stop stopColor="var(--plume-core, #fff3d6)" />
        <stop offset=".4" stopColor="var(--plume-mid, #e9b654)" />
        <stop offset="1" stopColor="var(--plume-edge, #b7791f)" stopOpacity="0" />
      </linearGradient>
    </defs>
    <g transform="translate(42 78)">
      <ScrollTransform value={flame} opacity={visible} data-plume="automotive">
        <path d="M0 -4C-8 -8 -17 -4 -27 -7L-34 -3L-26 0L-36 5C-21 4 -11 10 0 4Z" fill={`url(#${id})`} stroke="none" />
        <path d="M0 -2C-9 -4 -17 -1 -27 1C-15 1 -8 5 0 2Z" fill="var(--plume-mid, #e9b654)" fillOpacity=".8" stroke="none" />
        <path d="M0 -1.3L-17 0L-7 2L0 1.3Z" fill="var(--plume-core, #fff3d6)" stroke="none" />
      </ScrollTransform>
    </g>
    <g {...line} strokeLinejoin="round" strokeLinecap="round">
      {/* Rear-left diffuser, low rear haunch, swept canopy and a pointed nose. */}
      <path d="M38 83L40 69Q45 63 62 65L77 55Q87 48 100 51L121 64C143 65 157 71 165 78L172 80L169 86H157C156 73 137 73 135 88H72C70 74 51 74 49 88L39 86Z" />
      <path d="M67 66L80 57Q88 52 98 54L115 65Z M101 56L105 65 M119 68L153 74L162 78 M78 69L127 70L121 80H78Z" strokeWidth=".8" />
      <path d="M43 69L54 69L50 73H42 M158 76L168 79 M160 87L173 86 M41 84L36 85L43 88 M74 87H133 M46 79H41 M44 76H39" />
      <path d="M84 72H94 M124 65L132 61L142 62 M51 66Q62 60 72 64" strokeWidth=".8" />
      <Wheel x={60} progress={progress} still={still} />
      <Wheel x={146} progress={progress} still={still} />
    </g>
  </>
}

function Rocket({ progress, fire, still, id }) {
  const flame = useTransform([progress, fire], ([position, power]) => {
    const p = still ? 1 : clamp(position), f = still ? .8 : clamp(power)
    const ripple = still ? 0 : Math.sin(p * 112 + 1.4) * .045 * f
    return `scale(${(.65 + f * .35 - ripple).toFixed(4)} ${(.22 + f * .78 + ripple).toFixed(4)})`
  })
  const visible = useTransform(fire, value => still ? .9 : clamp(value))
  return <>
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="0" y2="55" gradientUnits="userSpaceOnUse">
        <stop stopColor="var(--plume-core, #fff3d6)" />
        <stop offset=".38" stopColor="var(--plume-mid, #e9b654)" />
        <stop offset="1" stopColor="var(--plume-edge, #b7791f)" stopOpacity="0" />
      </linearGradient>
    </defs>
    <g transform="translate(90 88)">
      <ScrollTransform value={flame} opacity={visible} data-plume="aerospace">
        <path d="M-9 0C-16 18 -6 26 -11 38L0 56L11 38C6 24 16 16 9 0Z" fill={`url(#${id})`} stroke="none" />
        <path d="M-6 0C-9 12 -3 20 -5 31L0 45L5 31C3 20 9 12 6 0Z" fill="var(--plume-mid, #e9b654)" fillOpacity=".82" stroke="none" />
        <path d="M-3 0C-5 11 -1 14 0 26C1 14 5 11 3 0Z" fill="var(--plume-core, #fff3d6)" stroke="none" />
      </ScrollTransform>
    </g>
    <g {...line} strokeLinecap="round" strokeLinejoin="round">
      <path d="M90 12C77 26 73 43 74 63V80H106V63C107 43 103 26 90 12Z" />
      <path d="M78 32Q90 28 102 32 M75 70H105 M74 59L59 81V96L74 81 M106 59L121 81V96L106 81 M82 80L80 88H100L98 80" />
      <circle cx="90" cy="45" r="7" />
      <circle cx="90" cy="45" r="4.4" strokeWidth=".7" />
      <path d="M90 58V71 M85 85H95" strokeWidth=".8" />
    </g>
  </>
}

function RobotArm({ progress, still }) {
  const shoulder = useTransform(progress, value => `rotate(${-28 + (still ? 1 : clamp(value)) * 66} 0 0)`)
  const elbow = useTransform(progress, value => `rotate(${85 - (still ? 1 : clamp(value)) * 140} 0 0)`)
  const wrist = useTransform(progress, value => `rotate(${-45 + (still ? 1 : clamp(value)) * 100} 0 0)`)
  const upperJaw = useTransform(progress, value => `translate(0 ${-2 - (still ? 1 : clamp(value)) * 6})`)
  const lowerJaw = useTransform(progress, value => `translate(0 ${2 + (still ? 1 : clamp(value)) * 6})`)
  return <g {...line} strokeLinecap="round" strokeLinejoin="round">
    <path d="M30 136H70 M35 136L40 125H60L65 136 M43 125V120H57V125" />
    <g transform="translate(50 120)">
      <ScrollTransform value={shoulder} data-joint="shoulder" data-arm-joint="shoulder">
        <path d="M-5 -7L-4 -39H4L5 -7 M-2 -12V-34" />
        <circle r="7" />
        <circle r="2" />
        <g transform="translate(0 -45)">
          <ScrollTransform value={elbow} data-joint="elbow" data-arm-joint="elbow">
            <path d="M6 -4H38V4H6 M12 0H33" />
            <circle r="6" />
            <circle r="1.8" />
            <g transform="translate(45 0)">
              <ScrollTransform value={wrist} data-joint="wrist" data-arm-joint="wrist">
                <circle r="5" />
                <path d="M5 -2H15V2H5 M15 -5V5" />
                <g data-joint="gripper" data-arm-joint="gripper">
                  <ScrollTransform as="path" value={upperJaw} d="M15 -1H26V3" />
                  <ScrollTransform as="path" value={lowerJaw} d="M15 1H26V-3" />
                </g>
              </ScrollTransform>
            </g>
          </ScrollTransform>
        </g>
      </ScrollTransform>
    </g>
  </g>
}

// Every frame comes from scroll values supplied by ScrollBridge. There are no
// time-based plume loops, so reduced motion and an idle scroll remain still.
export default function BridgeArtwork({ kind, progress, fire, still }) {
  const id = `bridge-plume-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  return <svg viewBox="0 0 180 160" fill="none" stroke="currentColor" className="block h-auto w-full overflow-visible" aria-hidden="true" data-artwork={kind} data-kind={kind}>
    {kind === 'automotive' ? <Roadster progress={progress} fire={fire} still={still} id={id} /> : kind === 'aerospace' ? <Rocket progress={progress} fire={fire} still={still} id={id} /> : <RobotArm progress={progress} still={still} />}
  </svg>
}
