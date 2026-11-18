import { asset } from '../data/experiences.js'

// Grand Seiko × Stark GS emblem: 3D chiseled indices, watch bezel, cyan reticle.
export const G =
  'M28.19 22.82A10 16 0 1 0 28.66 40L30 41.8V33H22.6L22 33.9H27L27.32 39.3A6.6 14.6 0 1 1 27.01 23.62L29.6 26.4V20.6Z'
export const S =
  'M52.6 17.6L52.8 23.4C51.4 20.2 48.4 17.4 44.4 17.4C40.6 17.4 38.4 19.4 38.4 22.4C38.4 26 42 27.4 46 29.2' +
  'C51.4 31.6 54.4 34.4 54.4 39.2C54.4 44.6 50 48 44.2 48C39.6 48 36.6 46.4 35.2 44.2L34.8 47.8L34.6 40.6' +
  'C36.2 44.4 39.6 46.8 44 46.8C47.8 46.8 49.8 44.8 49.8 41.6C49.8 37.4 46.2 35.8 42 34C37 31.8 34 29.2 34 24.6' +
  'C34 19.6 38.6 16 44.4 16C48.6 16 51.2 16.8 52.6 17.6Z'

export default function BrandMark({ plate = true, className = '', alt = 'GS emblem' }) {
  return (
    <img
      src={asset('/assets/gs-logo.png')}
      alt={alt}
      width="854"
      height="854"
      loading="eager"
      decoding="async"
      className={`block aspect-square select-none rounded-full object-contain ${className}`}
    />
  )
}
