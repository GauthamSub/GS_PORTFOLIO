import ProjectLayout from '../components/ProjectLayout.jsx'
import { asset, links } from '../data/experiences.js'
import { thumbnail } from '../data/media.js'
import './PrintSummary.css'

const project = { slug: 'print', label: 'Engineering Portfolio Summary', org: 'Gautham Subramanian', role: 'Mechanical engineering student', tools: 'CAD · testing · embedded systems', domain: 'Automotive · aerospace · robotics', period: '2024 – Present' }
const projects = [
  { title: 'GearLab', role: 'Undergraduate Research Assistant', date: 'Jan 2026 – Present', image: '/assets/gearlab/specimen-figure.png', alt: 'Rotating beam fatigue specimen and bending stress diagram', path: '/project/gearlab', text: 'Run rotating beam and gear bending fatigue tests, write SOPs and build preliminary S-N curves. Check specimens with contour scans and microscopy.', evidence: '14 rotating beam tests · 125.64–565.38 MPa', tools: 'LabVIEW · RBF200 · metrology' },
  { title: 'NASA L’SPACE', role: 'Mechanical Design Lead', date: 'Sep – Dec 2025', image: '/assets/Shovel Arm NX.png', alt: 'NX sampling-arm engineering drawing', path: '/project/nasa', text: 'Led mechanical design on a 15-person Martian cave rover concept team. Modeled rocker-bogie suspension, chassis, solar packaging and the sampling arm.', evidence: 'Mission Concept Academy completed · concept design', tools: 'Siemens NX · JMARS' },
  { title: 'ParkSense', role: 'Mechatronics Designer', date: 'Sep – Oct 2026', image: '/assets/Parksense stuff/Prototype Circuit.png', alt: 'Arduino parking assistant breadboard prototype', path: '/project/parksense', text: 'Built an Arduino parking assistant with PIN arming, ultrasonic sensing, LED feedback and a servo barrier. Designed enclosure and separate servo stop-arm CAD.', evidence: 'Non-blocking timing · 30 ms missing-echo timeout', tools: 'Arduino / C++ · HC-SR04 · SolidWorks' },
]

export default function PrintSummary() {
  return (
    <ProjectLayout project={project}>
      <div className="summary-print-actions mb-7 flex flex-wrap items-center gap-5">
        <button type="button" onClick={() => window.print()} className="min-h-11 border border-hud px-4 font-mono text-sm text-hud hover:bg-hud/10">Print / Save PDF</button>
        <p className="text-sm text-ti-300">One US Letter page. Disable browser headers and footers for a clean sheet.</p>
      </div>
      <article className="print-sheet">
        <header className="print-contact">
          <p className="print-kicker">Mechanical engineering portfolio</p>
          <h2>Gautham Subramanian</h2>
          <p>The Ohio State University · Mechanical Engineering · Robotics minor</p>
          <div className="print-links">
            <a href={links.email}>subramanian.208@osu.edu</a>
            <a href={links.linkedin}>linkedin.com/in/gautham-subramanian1</a>
            <a href={asset(links.resume)}>Resume PDF</a>
          </div>
        </header>
        <p className="print-focus">Mechanical design, fatigue testing and mechatronics for automotive, aerospace and robotics applications.</p>
        {projects.map((item) => (
          <section key={item.path} className="print-project">
            <img src={asset(thumbnail(item.image))} alt={item.alt} />
            <div>
              <h3><a href={item.path}>{item.title}</a></h3>
              <p className="print-role">{item.role} · {item.date}</p>
              <p>{item.text}</p>
              <p className="print-evidence">{item.evidence}</p>
              <p className="print-tools">{item.tools}</p>
              <a className="print-path" href={item.path}>{item.path}</a>
            </div>
          </section>
        ))}
        <footer className="print-footer">Featured engineering work · November 2026 · Drawings, reports and originals are linked in each case study.</footer>
      </article>
    </ProjectLayout>
  )
}
