import { useState } from 'react'

// Product marks from /assets/tool-logos (sources: public/assets/tool-logos/SOURCES.md).
// `scale` is the optical size inside the square box: filled tiles read larger
// than open marks, so they get less of the box.
const logos = {
  fusion: { file: 'fusion.svg', scale: 0.84 },
  labview: { file: 'labview.svg', scale: 0.9 },
  matlab: { file: 'matlab.svg', scale: 0.92 },
  arduino: { file: 'arduino.svg', scale: 1 },
  cpp: { file: 'cplusplus.svg', scale: 0.9 },
  esp32: { file: 'espressif.svg', scale: 0.8 },
  java: { file: 'java.svg', scale: 0.94 },
  react: { file: 'react.svg', scale: 0.96 },
  tailwind: { file: 'tailwindcss.svg', scale: 1 },
  bambu: { file: 'bambu-studio.svg', scale: 0.78 },
}

// No verified artwork in the repo: a plain text wordmark, never a stand-in icon.
const wordmarks = { nx: 'NX', solidworks: 'SOLIDWORKS', onshape: 'Onshape', ees: 'EES' }

export default function ToolMark({ id, size = 40, className = '' }) {
  const [failed, setFailed] = useState(false)
  const logo = logos[id]
  const box = { width: size, height: size }

  if (logo && !failed) {
    const px = Math.round(size * logo.scale)
    return (
      <span aria-hidden="true" style={box} className={`inline-flex shrink-0 items-center justify-center ${className}`}>
        <img src={`/assets/tool-logos/${logo.file}`} alt="" width={px} height={px} loading="lazy" decoding="async" draggable="false"
          onError={() => setFailed(true)} style={{ width: px, height: px }} className="object-contain" />
      </span>
    )
  }
  // Wordmarks only at map size; small chips already show the product name.
  if (size < 32) return null
  const text = wordmarks[id] || id.toUpperCase()
  return (
    <span aria-hidden="true" style={{ height: size, minWidth: size, fontSize: text.length > 4 ? 10.5 : 16 }}
      className={`inline-flex shrink-0 items-center justify-center rounded-md bg-white/[0.07] px-2 font-sans font-bold tracking-[0.05em] text-ti-50 ring-1 ring-white/10 ${className}`}>
      {text}
    </span>
  )
}
