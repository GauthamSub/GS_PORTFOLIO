import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { metadataFor } from '../data/routeMetadata.js'

// Reuse the build-time head nodes so client navigation never leaves stale share tags.
export default function RouteMetadata() {
  const { pathname } = useLocation()
  useEffect(() => {
    const data = metadataFor(pathname)
    document.title = data.title
    const origin = import.meta.env.VITE_SITE_URL || window.location.origin
    const values = {
      description: data.description, 'og:title': data.title, 'og:description': data.description,
      'og:type': 'website', 'og:image': new URL(data.image, origin).href,
      'og:image:width': '1200', 'og:image:height': '630', 'og:image:alt': data.title,
      'og:url': new URL(pathname, origin).href, 'twitter:card': 'summary_large_image',
      'twitter:title': data.title, 'twitter:description': data.description,
      'twitter:image': new URL(data.image, origin).href,
    }
    for (const [key, content] of Object.entries(values)) {
      const attr = key.startsWith('og:') ? 'property' : 'name'
      let node = document.head.querySelector(`meta[${attr}="${key}"]`)
      if (!node) { node = document.createElement('meta'); node.setAttribute(attr, key); document.head.append(node) }
      node.content = content
    }
    let canonical = document.head.querySelector('link[rel="canonical"]')
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.append(canonical) }
    canonical.href = new URL(pathname, origin).href
  }, [pathname])
  return null
}
