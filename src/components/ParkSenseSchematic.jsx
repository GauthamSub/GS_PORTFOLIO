import { useState } from 'react'
import AnnotatedFigure from './AnnotatedFigure.jsx'

// Wiring diagram beside the built prototype. Picking a component outlines it
// in both. Pin assignments are the ones in the prototype report and its sketch.
// Boxes are [left, top, width, height] in percent of each image.
const parts = [
  {
    id: 'hcsr04',
    label: 'HC-SR04 Sensor',
    pins: 'Trig D2 · Echo D3',
    note: 'Ultrasonic rangefinder. The sketch times the echo with pulseIn() and converts it to centimetres.',
    schematic: [59.3, 19, 20.3, 13.4],
    photo: [44, 79, 17.8, 18],
  },
  {
    id: 'arduino',
    label: 'Arduino Uno',
    pins: 'Sensor input · feedback and barrier outputs',
    note: 'The Arduino reads the ultrasonic echo, polls the keypad, and updates the matrix and servo. The firmware bounds pulseIn() to 30 ms and uses millis() scheduling for feedback.',
    schematic: [27, 19.4, 31, 33],
    photo: [44, 33.5, 19, 28],
  },
  {
    id: 'keypad',
    label: '4×4 Keypad',
    pins: 'D4, D7, D8, D12, D13, A0, A1, A2',
    note: 'PIN entry arms the system. The sketch keeps polling it during buzzer pauses, so key presses are not missed.',
    schematic: [8.6, 26.5, 16.2, 23],
    photo: [79, 31.2, 18.7, 26.6],
  },
  {
    id: 'matrix',
    label: 'MAX7219 Matrix',
    pins: 'A3, A4, A5',
    note: '8×8 LED matrix. It shows a keep-going bar, a warning diamond, or a stop X by distance zone.',
    schematic: [70.5, 56, 16.5, 24],
    photo: [62.4, 55, 12.3, 33],
  },
  {
    id: 'servo',
    label: 'SG90 Servo',
    pins: 'Signal D9',
    note: 'Micro servo at the base of the stop arm. The sketch writes 0°, 45°, or 90° to it.',
    schematic: [36.2, 86.6, 9.6, 11],
    photo: [0.8, 3.4, 17.6, 95.4],
  },
]

const schematic = {
  src: '/assets/Parksense stuff/Prototype Circuit schematic.png',
  alt: 'ParkSense wiring diagram: Arduino Uno, keypad, ultrasonic sensor, LED matrix, buzzer, RGB LED, and servo',
  lightMatte: true,
}
const photo = {
  src: '/assets/Parksense stuff/Prototype Circuit.png',
  alt: 'ParkSense breadboard prototype. Left to right: servo stop arm, buzzer, RGB LED, ultrasonic sensor, LED matrix, keypad',
}

const regionsFor = (view) => parts.map((part) => ({ id: part.id, label: part.label, box: part[view] }))

export default function ParkSenseSchematic() {
  const [selected, setSelected] = useState('hcsr04')
  const part = parts.find((item) => item.id === selected)

  return (
    <div className="min-w-0 border border-hud/25 bg-[#0B111C] p-5 sm:p-6" data-parksense-schematic>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-mono text-sm text-white">Annotated schematic</h3>
        <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-ti-400">
          Diagram to hardware
        </span>
      </div>

      <ol aria-label="Trace the control path" className="mt-5 flex flex-wrap items-center gap-2 font-mono text-xs">
        {['hcsr04', 'arduino', 'matrix', 'servo'].map((id, index) => <li key={id} className="flex items-center gap-2"><span aria-hidden="true" className="text-ti-300">{index ? '→' : '01'}</span><button type="button" onClick={() => setSelected(id)} className="min-h-11 border-b border-hud/40 px-2 text-hud hover:border-hud">{parts.find(item => item.id === id).label}</button></li>)}
      </ol>

      <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Circuit components">
        {parts.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={selected === item.id}
            aria-controls="parksense-part-detail"
            onClick={() => setSelected(item.id)}
            className={`min-h-[44px] cursor-pointer border px-3.5 font-mono text-xs transition-colors hover:border-hud focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-hud ${
              selected === item.id ? 'border-hud bg-hud/10 text-hud' : 'border-hud/25 text-readout'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div
        id="parksense-part-detail"
        aria-live="polite"
        className="mt-5 grid gap-x-8 gap-y-2 border-l-2 border-hud/60 pl-5 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)]"
      >
        <div>
          <p className="text-lg text-white">{part.label}</p>
          <p className="mt-1 font-mono text-xs text-hud">{part.pins}</p>
        </div>
        <p className="max-w-[52ch] text-sm leading-relaxed text-ti-300">{part.note}</p>
      </div>

      <div className="mt-6 grid items-start gap-5 lg:grid-cols-[5fr_7fr]">
        <AnnotatedFigure
          image={photo}
          regions={regionsFor('photo')}
          selected={selected}
          onSelect={setSelected}
          caption="Bench circuit and cardboard stop arm · white frames belong to the original photo"
        />
        <AnnotatedFigure
          image={schematic}
          regions={regionsFor('schematic')}
          selected={selected}
          onSelect={setSelected}
          caption="Wiring diagram"
        />
      </div>
    </div>
  )
}
