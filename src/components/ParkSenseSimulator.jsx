import { Suspense, lazy, useEffect, useState } from 'react'
import { control } from '../lib/controls.js'

// The 3D garage is its own chunk: only this page downloads it.
const ParkSenseGarage = lazy(() => import('./ParkSenseGarage.jsx'))

const modes = [
  ['distance', '3D garage'],
  ['echo', 'Miss an Echo · step by step'],
]

// Missing-echo sequence, from the prototype report and its sketch:
//   readDistanceCM() fires a 10 µs trigger, then calls
//   pulseIn(echo, HIGH, 30000UL). With no echo that call gives up after
//   30 ms and returns 0, the function returns DIST_MAX (400 cm), and loop()
//   carries on to poll the keypad.
// The 30 ms wait is played back over WAIT_MS of real time; each later step
// then lands STEP_MS apart so the order can be read.
const TIMEOUT = 30 // ms, simulated
const WAIT_MS = 3000
const STEP_MS = 450
const SCALE = WAIT_MS / TIMEOUT
const steps = [
  ['Trigger', '10 µs HIGH on D2. The HC-SR04 emits its ultrasonic burst.'],
  ['Wait', 'pulseIn(echo, HIGH, 30000UL) listens on D3. Nothing comes back.'],
  ['Timeout', 'At 30 ms pulseIn() gives up and returns 0.'],
  ['Return', 'readDistanceCM() returns DIST_MAX, 400 cm: an out-of-range reading.'],
  ['Loop continues', 'loop() moves on and handleKeypad() runs on the next pass. Nothing froze.'],
]
const TOTAL_MS = WAIT_MS + STEP_MS * 3

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

function MissingEcho() {
  // `clock` is real milliseconds into the playback. Reduced motion skips the
  // playback and shows the finished sequence.
  const [clock, setClock] = useState(() => (reducedMotion() ? TOTAL_MS : 0))
  const [run, setRun] = useState(0)

  useEffect(() => {
    if (reducedMotion()) {
      setClock(TOTAL_MS)
      return undefined
    }
    let frame
    const start = performance.now()
    const tick = (now) => {
      const next = Math.min(now - start, TOTAL_MS)
      setClock(next)
      if (next < TOTAL_MS) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [run])

  const elapsed = Math.min(clock / SCALE, TIMEOUT) // simulated ms waited so far
  const timedOut = clock >= WAIT_MS
  // Steps 0 and 1 run during the wait; 2 to 4 land one by one after it.
  const current = !timedOut ? (elapsed < 1 ? 0 : 1) : Math.min(2 + Math.floor((clock - WAIT_MS) / STEP_MS), 4)
  const done = clock >= TOTAL_MS
  const returned = current >= 3
  const waveX = 62 + (elapsed / TIMEOUT) * 276

  return (
    <div className="mt-5 grid gap-x-8 gap-y-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]" data-parksense-echo>
      <div className="min-w-0">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <p className="font-mono text-4xl tabular-nums text-white" data-echo-elapsed>
            {elapsed.toFixed(1)}
            <span className="ml-2 text-sm text-ti-300">/ {TIMEOUT} ms</span>
          </p>
          <span
            className="border px-3 py-1.5 font-mono text-xs tracking-[0.16em]"
            style={timedOut ? { color: '#fbbf24', borderColor: '#fbbf24' } : { color: '#00e5ff', borderColor: '#00e5ff' }}
            data-echo-state
          >
            {timedOut ? 'TIMEOUT' : 'WAITING'}
          </span>
        </div>

        <svg
          viewBox="0 0 370 150"
          role="img"
          aria-label="HC-SR04 sensor emitting an ultrasonic burst into an empty bay. No echo returns."
          className="mt-4 w-full border-y border-hud/15"
        >
          <path d="M20 122H350" stroke="#00e5ff" strokeOpacity=".25" />
          <path d="M36 68V99M43 71V96" stroke="#00e5ff" strokeWidth="4" />
          <text x="18" y="142" fill="#91a8b6" fontSize="10" fontFamily="monospace">HC-SR04</text>
          {/* Outgoing burst: three wavefronts that thin out with distance and stop at the timeout */}
          {!timedOut &&
            [0, 16, 32].map((lag) => {
              const x = waveX - lag
              return x > 56 ? (
                <path
                  key={lag}
                  d={`M${x.toFixed(1)} 62 Q${(x + 13).toFixed(1)} 83 ${x.toFixed(1)} 104`}
                  fill="none"
                  stroke="#00e5ff"
                  strokeWidth="1.5"
                  strokeOpacity={(0.75 - lag / 60) * (1 - (elapsed / TIMEOUT) * 0.65)}
                />
              ) : null
            })}
          <rect x="248" y="52" width="96" height="62" fill="none" stroke="#91a8b6" strokeOpacity=".4" strokeDasharray="4 5" />
          <text x="296" y="80" textAnchor="middle" fill="#91a8b6" fontSize="9" fontFamily="monospace">EMPTY BAY</text>
          <text x="296" y="93" textAnchor="middle" fill="#91a8b6" fillOpacity=".7" fontSize="8" fontFamily="monospace">
            or beyond 400 cm
          </text>
          <text x="150" y="38" textAnchor="middle" fill={timedOut ? '#fbbf24' : '#91a8b6'} fontSize="10" fontFamily="monospace">
            {timedOut ? 'NO ECHO · pulseIn() returned 0' : 'listening for echo on D3'}
          </text>
        </svg>

        {/* Wait bar: 0 to 30 ms */}
        <div className="mt-5">
          <div className="flex justify-between gap-3 font-mono text-xs text-ti-300">
            <span>pulseIn() wait</span>
            <span className="text-ti-400">30 ms timeout</span>
          </div>
          <div className="mt-3 h-2 border border-hud/30 bg-obsidian" aria-hidden="true">
            <div
              className="h-full"
              style={{ width: `${(elapsed / TIMEOUT) * 100}%`, backgroundColor: timedOut ? '#fbbf24' : '#00e5ff' }}
            />
          </div>
          <div className="mt-1.5 flex justify-between font-mono text-[11px] text-ti-300" aria-hidden="true">
            <span>0</span><span>10</span><span>20</span><span>30 ms</span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
          <button
            type="button"
            onClick={() => setRun((value) => value + 1)}
            className="min-h-[44px] cursor-pointer border border-hud/40 px-4 font-mono text-[11px] uppercase tracking-[0.18em] text-hud transition-colors hover:border-hud hover:bg-hud/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-hud"
          >
            Replay sequence
          </button>
          <p className="text-sm leading-relaxed text-ti-300">
            Playback slowed {SCALE}×: 30 ms shown over {WAIT_MS / 1000} s.
            <span className="motion-safe:hidden"> Reduced motion: final state shown.</span>
          </p>
        </div>
      </div>

      <div className="min-w-0 border-t border-hud/15 pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
        <ol className="space-y-3">
          {steps.map(([name, text], i) => {
            const state = i < current || done ? 'done' : i === current ? 'now' : 'next'
            return (
              <li
                key={name}
                data-step={state}
                className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-3"
              >
                <span
                  aria-hidden="true"
                  className={`mt-0.5 flex h-5 w-5 items-center justify-center border font-mono text-[11px] ${
                    state === 'now' ? 'border-hud bg-hud text-obsidian' : state === 'done' ? 'border-hud/50 text-hud' : 'border-white/20 text-ti-400'
                  }`}
                >
                  {i + 1}
                </span>
                <span>
                  <span className="block font-mono text-xs text-white">{name}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-ti-300">{text}</span>
                </span>
              </li>
            )
          })}
        </ol>

        <dl className="mt-5 space-y-2 border-t border-hud/15 pt-4 font-mono text-xs text-ti-300" aria-live="polite">
          <div className="flex justify-between gap-4">
            <dt>Reading returned</dt>
            <dd className="text-right text-white" data-echo-reading>{returned ? 'DIST_MAX · 400 cm' : '—'}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt>Keypad</dt>
            <dd className="text-right text-white">{current >= 4 ? 'polled again' : '—'}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt>RGB · matrix · SG90</dt>
            <dd className="text-right text-ti-300">not simulated here</dd>
          </div>
        </dl>
      </div>

      <p className="border-t border-hud/15 pt-4 text-sm leading-relaxed text-ti-300 lg:col-span-2">
        Simulated sequence; no live hardware connection. Before the timeout was added, the report
        records the Arduino freezing for a full second on every missed echo, which stopped the
        keypad from responding.
      </p>
    </div>
  )
}

// Placeholder while the garage chunk loads: same frame, no motion.
function GarageLoading() {
  return (
    <div className="mt-5 flex aspect-[8/5] w-full items-center justify-center border border-hud/15 bg-[#070e18] font-mono text-[11px] uppercase tracking-[0.16em] text-ti-300">
      Loading garage…
    </div>
  )
}

// Arriving at #timeout-demo (the gear hub links here) opens the missed-echo mode.
export default function ParkSenseSimulator() {
  const [mode, setMode] = useState(() => (window.location.hash === '#timeout-demo' ? 'echo' : 'distance'))

  return (
    <div id="timeout-demo" className="min-w-0 scroll-mt-28 border border-hud/25 bg-[#0B111C] p-5 sm:p-6 lg:scroll-mt-32" data-parksense-simulator>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-mono text-sm text-white">Garage parking simulator</h3>
        <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-ti-400">
          {mode === 'echo' ? 'Simulated sequence' : 'Simulated behavior · conceptual garage geometry'}
        </span>
      </div>

      <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Simulation mode">
        {modes.map(([id, label]) => (
          <button
            key={id}
            type="button"
            aria-pressed={mode === id}
            onClick={() => setMode(id)}
            className={control(mode === id)}
          >
            {label}
          </button>
        ))}
      </div>

      <p className="mt-4 border-l-2 border-hud/60 pl-4 text-sm leading-relaxed text-ti-300"><strong className="font-medium text-white">Miss an Echo: 30 ms timeout vs. ~1 s blocking wait.</strong> A bounded sensor wait lets the control loop return to PIN input. Trigger it inside the garage, or step through the sequence.</p>

      {mode === 'echo' ? (
        <MissingEcho />
      ) : (
        <Suspense fallback={<GarageLoading />}>
          <div className="mt-5">
            <ParkSenseGarage />
          </div>
        </Suspense>
      )}
    </div>
  )
}
