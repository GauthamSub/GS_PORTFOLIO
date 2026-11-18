import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { routeMetadata } from '../src/data/routeMetadata.js'

const template = await readFile('dist/index.html', 'utf8')
const host = process.env.VITE_SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '')
const absolute = path => host ? new URL(path, host).href : path
const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
for (const [route, data] of Object.entries(routeMetadata)) {
  const values = { description: data.description, 'og:title': data.title, 'og:description': data.description, 'og:type': 'website', 'og:url': absolute(route), 'og:image': absolute(data.image), 'og:image:width': '1200', 'og:image:height': '630', 'og:image:alt': data.title, 'twitter:card': 'summary_large_image', 'twitter:title': data.title, 'twitter:description': data.description, 'twitter:image': absolute(data.image) }
  const tags = Object.entries(values).map(([key, value]) => `<meta ${key.startsWith('og:') ? 'property' : 'name'}="${key}" content="${escape(value)}" />`).join('\n    ')
  const html = template.replace(/<title>[\s\S]*?<\/title>/, `<title>${escape(data.title)}</title>`).replace(/<meta\s+name="description"[\s\S]*?\/>/, '').replace('</head>', `    ${tags}\n    <link rel="canonical" href="${escape(absolute(route))}" />\n  </head>`)
  const dir = route === '/' ? 'dist' : `dist${route}`
  await mkdir(dir, { recursive: true })
  await writeFile(`${dir}/index.html`, html)
}
console.log(`Generated static share metadata for ${Object.keys(routeMetadata).length} routes.${host ? '' : ' Set VITE_SITE_URL for absolute URLs outside Vercel.'}`)
