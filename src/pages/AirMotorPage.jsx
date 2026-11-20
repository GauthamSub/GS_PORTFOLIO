import { Link } from 'react-router'
import ProjectLayout, { anchorOffset } from '../components/ProjectLayout.jsx'
import MachineShopInspector from '../components/MachineShopInspector.jsx'
import MediaGallery from '../components/MediaGallery.jsx'
import { airMotor, gallery } from '../data/machineShop.js'

// Workshop subpage, outside the gear-hub sequence. airMotor.video stays null
// until a real assembly / run recording exists; no player renders before then.
export default function AirMotorPage() {
  return (
    <ProjectLayout
      project={airMotor}
      contribution={airMotor.contribution}
      status={airMotor.status}
      back={{ to: '/misc#air-motor', label: 'Workshop' }}
      primaryArtifact={
        <section id="inspector" aria-label="Component inspector" className={anchorOffset}>
          <MachineShopInspector />
        </section>
      }
    >
      <section id="photos" aria-labelledby="air-motor-photos" className={anchorOffset}>
        <h2 id="air-motor-photos" className="text-2xl text-white">More photos</h2>
        <p className="mt-2 max-w-[62ch] text-[15px] leading-relaxed text-ti-300">
          Other faces and layouts of the same four parts. Select a photo for the full-resolution file.
        </p>
        <div className="mt-6">
          <MediaGallery images={gallery} />
        </div>
      </section>

      <p className="mt-14 border-t border-white/10 pt-6 text-[15px] text-ti-300">
        Another ME 2900 project:{' '}
        <Link to="/project/parksense" className="text-hud underline decoration-hud/40 underline-offset-4 hover:decoration-hud">
          ParkSense parking assistant →
        </Link>
      </p>
    </ProjectLayout>
  )
}
