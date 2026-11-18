import { readdir, readFile, writeFile } from 'node:fs/promises'
import { basename } from 'node:path'
import { routeMetadata } from '../src/data/routeMetadata.js'

async function files(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  return (await Promise.all(entries.map(entry => entry.isDirectory() ? files(`${dir}/${entry.name}`) : `${dir}/${entry.name}`))).flat()
}
const source = (await Promise.all((await files('src')).filter(path => /\.(jsx?|css)$/.test(path)).map(path => readFile(path, 'utf8')))).join('\n') + JSON.stringify(routeMetadata)
// Includes filenames concatenated to directory constants in the drawing/build
// indexes. PLAN and extraction scripts do not count as publication links.
const unlinked = (await files('public/assets')).filter(path => !source.includes(basename(path))).sort()
const header = '\n\n## Unlinked asset publication review — 2026-11-16\n'
const report = `${header}\nConservative source-reference audit of src/ and route share metadata. Filename references include directory concatenation. No files deleted or automatically linked. Review ownership and publication scope manually.\n\n${unlinked.length} files without a publication reference:\n\n${unlinked.map(path => `- \`/${path.replace(/^public\//, '')}\``).join('\n')}\n`
const plan = await readFile('PLAN.md')
const marker = plan.indexOf(Buffer.from(header))
await writeFile('PLAN.md', Buffer.concat([marker < 0 ? plan : plan.subarray(0, marker), Buffer.from(report)]))
console.log(`${unlinked.length} unlinked assets recorded in PLAN.md; no assets changed.`)
