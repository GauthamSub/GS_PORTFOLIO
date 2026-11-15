import { Link } from 'react-router'

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-svh max-w-3xl flex-col justify-center px-6 text-readout md:px-10">
      <title>Not found — Gautham Subramanian</title>
      <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-hud/75">404</p>
      <h1 className="mt-4 text-5xl font-medium tracking-[-0.02em] text-white">No page at this address.</h1>
      <Link
        to="/#gear-hub"
        className="mt-10 inline-flex w-fit items-center gap-3 border border-hud/45 px-4 py-2.5 font-mono text-xs uppercase tracking-[0.18em] text-hud transition-colors hover:border-hud hover:bg-hud/10"
      >
        ← Return to Gear Hub
      </Link>
    </main>
  )
}
