// One control style for toggles and buttons on the dark pages: same height,
// border, type and focus ring everywhere. `on` is the pressed / active state.
export const control = (on = false) =>
  `inline-flex min-h-[44px] cursor-pointer items-center border px-3.5 font-mono text-xs transition-colors hover:border-hud focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hud disabled:cursor-not-allowed disabled:opacity-50 md:min-h-[36px] ${
    on ? 'border-hud bg-hud/10 text-hud' : 'border-white/20 text-ti-100'
  }`
