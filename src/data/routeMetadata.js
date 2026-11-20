import { experiences, misc } from './experiences.js'
import { caseStudies } from './projectDetails.js'

const name = 'Gautham Subramanian'
const defaultImage = '/assets/share/portfolio.png'
export const routeMetadata = {
  '/': { title: `${name} | Mechanical Engineering`, description: 'Mechanical engineering at Ohio State: fatigue testing, Siemens NX rover design, and Arduino hardware prototypes.', image: defaultImage },
  '/drawings': { title: `Drawing Library | ${name}`, description: 'Search Siemens NX and SolidWorks drawings, lock subassemblies, and ParkSense CAD views.', image: '/assets/share/nasa.png' },
  '/misc': { title: `Workshop | ${name}`, description: misc.summary, image: defaultImage },
  '/workshop/air-motor': { title: `ME2900 Air Motor — Machining | ${name}`, description: 'Machined air motor components from Ohio State ME 2900 design–build–test coursework. Annotated photos; assembly pending.', image: '/assets/share/air-motor.jpg' },
  '/print': { title: `Engineering Summary | ${name}`, description: 'One-page contact and project summary: GearLab, NASA L’SPACE, and ParkSense.', image: defaultImage },
  ...Object.fromEntries(experiences.map(project => [project.path, {
    title: `${caseStudies[project.slug].title} | ${name}`,
    description: project.summary,
    image: ['gearlab', 'nasa', 'parksense'].includes(project.slug) ? `/assets/share/${project.slug}.png` : defaultImage,
  }])),
}

export function metadataFor(pathname) {
  return routeMetadata[pathname.replace(/\/$/, '') || '/'] || { title: `Page not found | ${name}`, description: 'Return to the engineering portfolio.', image: defaultImage }
}
