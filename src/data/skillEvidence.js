// Skills-to-project evidence. Every edge cites an artifact or the résumé
// (docs/skills-map-handoff.md, "Verified relationship map" + "Claim limits").
import { links } from './experiences.js'

export const categories = [
  { id: 'cad', label: 'CAD & Mechanical Design' },
  { id: 'test', label: 'Test, DAQ & Simulation' },
  { id: 'embedded', label: 'Embedded & Controls' },
  { id: 'software', label: 'Software & Prototyping' },
]

// `note` marks a tool with no project edge: selecting it explains its context
// and leaves the project rail neutral. `context` is the user-confirmed use.
// EES, MATLAB, Fusion 360 and Java also link the hidden Classwork entry.
export const tools = [
  { id: 'nx', label: 'Siemens NX', category: 'cad', status: 'Currently pursuing Siemens NX certification' },
  { id: 'solidworks', label: 'SolidWorks', category: 'cad' },
  { id: 'fusion', label: 'Fusion 360', category: 'cad', onResume: true, context: 'Used in high school LEGO Mindstorms enclosure projects to design custom 3D-printed mechanical housings.' },
  { id: 'onshape', label: 'Onshape', category: 'cad' },
  { id: 'labview', label: 'LabVIEW', category: 'test' },
  { id: 'matlab', label: 'MATLAB', category: 'test' },
  { id: 'ees', label: 'EES', category: 'test', context: 'Engineering Equation Solver. Used in Thermodynamics (ME 3501) at Ohio State for thermodynamic property evaluation and cycle analysis.' },
  { id: 'arduino', label: 'Arduino IDE', category: 'embedded' },
  { id: 'cpp', label: 'C++', category: 'embedded' },
  { id: 'esp32', label: 'ESP32-CAM', category: 'embedded' },
  { id: 'java', label: 'Java', category: 'software', onResume: true, context: 'Learned in high school through AP Computer Science A, then applied at past HackOHI/O hackathons.' },
  { id: 'react', label: 'React', category: 'software', note: 'site', context: 'Component UI library; this site’s interface.' },
  { id: 'tailwind', label: 'Tailwind CSS', category: 'software', note: 'site', context: 'Utility-first CSS framework; this site’s styling.' },
  { id: 'bambu', label: 'Bambu Studio / 3D Printing', category: 'software' },
]

export const notes = {
  site: { badge: 'This site', text: 'Used to build this portfolio (React, Tailwind CSS, Vite). Not an engineering project, so no project is linked.' },
}
export const resumeHref = links.resume

export const projects = [
  { id: 'gearlab', label: 'GearLab', path: '/project/gearlab' },
  { id: 'nasa', label: 'NASA L’SPACE', path: '/project/nasa' },
  { id: 'parksense', label: 'ParkSense', path: '/project/parksense' },
  { id: 'echovision', label: 'EchoVision', path: '/project/echovision' },
  { id: 'marion', label: 'OSU Marion', path: '/project/marion' },
  { id: 'deadbolt', label: 'Deadbolt lock', meta: 'Coursework', path: '/misc#lock' },
  { id: 'lego-rover', label: 'LEGO Mars Rover', meta: 'Coursework', path: '/misc#lego-rover' },
  // Shown in the rail only while a class-linked tool (or Classwork itself) is in focus.
  { id: 'classwork', label: 'Classwork', reveal: true },
]

// Ordered: the first edge for a tool or project is the default evidence item.
export const evidence = [
  {
    id: 'nx-nasa', tool: 'nx', project: 'nasa', kind: 'Drawing',
    usage: 'Modeled the sampling arm, rocker-bogie suspension, chassis and solar packaging for a 15-person cave rover concept. Mission deliverables and the PDR were team work.',
    preview: '/assets/Shovel Arm NX.png', original: '/assets/Shovel Arm NX.png', originalLabel: 'Open the NX drawing',
    link: '/project/nasa', linkLabel: 'Inspect the rover',
  },
  {
    id: 'sw-parksense', tool: 'solidworks', project: 'parksense', kind: 'CAD view',
    usage: 'Enclosure and separate servo stop-arm CAD for the garage parking assistant. The CAD establishes the enclosure design; the built prototype used a cardboard housing.',
    preview: '/assets/Parksense stuff/Prototype housing 1.png', original: '/assets/Parksense stuff/Prototype housing 1.png', originalLabel: 'Open the enclosure CAD',
    link: '/project/parksense', linkLabel: 'Try the parking simulator',
  },
  {
    id: 'sw-marion', tool: 'solidworks', project: 'marion', kind: 'Résumé scope',
    usage: 'Designed a teaching universal testing machine for 3+ test types. The résumé lists 5+ design iterations, part documentation, BOM and assembly plans; those revision files are not published.',
    original: links.resume, originalLabel: 'Open the résumé',
    link: '/project/marion', linkLabel: 'Read the UTM scope',
  },
  {
    id: 'sw-deadbolt', tool: 'solidworks', project: 'deadbolt', kind: 'Drawing',
    usage: 'Dimensioned front plate, dial and deadbolt subassembly drawings from first-year engineering coursework.',
    preview: '/assets/deadbolt/deadbolt-subassembly.png', original: '/assets/all finished engineering stuff/Deadbolt Subassembly DRAWING_AS_PDF.PDF', originalLabel: 'Open the subassembly drawing (PDF)',
    link: '/misc#lock', linkLabel: 'Inspect the deadbolt',
  },
  {
    id: 'labview-gearlab', tool: 'labview', project: 'gearlab', kind: 'Presentation',
    usage: 'Runs the rotating-beam fatigue rig through LabVIEW with pyrometers and position sensors, across 10+ specimens feeding a preliminary S-N curve. The LabVIEW program itself is not published.',
    preview: '/assets/gearlab/sn-figure.png', original: '/assets/Project Presentation-Rotating Beam Fatigue.pdf', originalLabel: 'Open the fatigue presentation (PDF)',
    link: '/project/gearlab#sn-plot', linkLabel: 'See the fatigue data',
  },
  // MATLAB opens on its course context; the GearLab S-N edge is the second connection.
  {
    id: 'matlab-classwork', tool: 'matlab', project: 'classwork', kind: 'Course',
    usage: 'ME 2850.01 coursework at Ohio State.',
  },
  {
    id: 'matlab-gearlab', tool: 'matlab', project: 'gearlab', kind: 'S-N chart',
    usage: 'Built the preliminary S-N curve in MATLAB from the rotating-beam fatigue (RBF) test data: stress amplitude against cycles to failure, with runouts marked. The MATLAB scripts are not published.',
    preview: '/assets/gearlab/sn-figure.png', original: '/assets/Project Presentation-Rotating Beam Fatigue.pdf', originalLabel: 'Open the fatigue presentation (PDF)',
    link: '/project/gearlab#sn-plot', linkLabel: 'See the S-N data',
  },
  {
    id: 'arduino-parksense', tool: 'arduino', project: 'parksense', kind: 'Schematic',
    usage: 'HC-SR04 ultrasonic sensor, keypad, LED matrix and servo wired to an Arduino and bench-tested. The prototype report documents the build; a standalone firmware file is not published.',
    preview: '/assets/Parksense stuff/Prototype Circuit schematic.png', original: '/assets/Parksense stuff/ME2900 Prototype Report.pdf', originalLabel: 'Open the prototype report (PDF)',
    link: '/project/parksense', linkLabel: 'Try the parking simulator',
  },
  {
    id: 'arduino-rover', tool: 'arduino', project: 'lego-rover', kind: 'Lab report',
    usage: 'Arduino LED feedback triggered by distance sensors on a LEGO Mindstorms rover with a custom claw. Early coursework, separate from the NASA rover concept.',
    preview: '/assets/Mars Rover.png', original: '/assets/Mars Rover Lab report.pdf', originalLabel: 'Open the rover lab report (PDF)',
    link: '/misc#lego-rover', linkLabel: 'See the LEGO rover',
  },
  {
    id: 'cpp-parksense', tool: 'cpp', project: 'parksense', kind: 'Report',
    usage: 'C++ with millis() scheduling and four proximity stages. A bounded pulseIn() wait (30 ms timeout) keeps the keypad live when an echo is missed.',
    preview: '/assets/Parksense stuff/Prototype Circuit.png', original: '/assets/Parksense stuff/ME2900 Prototype Report.pdf', originalLabel: 'Open the prototype report (PDF)',
    link: '/project/parksense#timeout-demo', linkLabel: 'Try the missed-echo demo',
  },
  {
    id: 'esp32-echovision', tool: 'esp32', project: 'echovision', kind: 'Prototype photo',
    usage: 'ESP32-CAM with OV2640 camera, speaker and battery, running TinyML drowsiness detection. Packed into a custom enclosure that holds the camera’s field of view fixed.',
    preview: '/assets/echovision/wiring.jpg', original: '/assets/echovision/wiring.jpg', originalLabel: 'Open the wiring photo',
    link: '/project/echovision', linkLabel: 'Inspect the packaging',
  },
  {
    id: 'onshape-parksense', tool: 'onshape', project: 'parksense', kind: 'Project scope',
    usage: 'Used Onshape for ParkSense CAD work. The Onshape models are not published.',
    link: '/project/parksense', linkLabel: 'Try the parking simulator',
  },
  {
    id: 'onshape-gearlab', tool: 'onshape', project: 'gearlab', kind: 'Project scope',
    usage: 'Used Onshape for CAD work in the gear and power transmission lab. The Onshape models are not published.',
    link: '/project/gearlab', linkLabel: 'See the fatigue data',
  },
  {
    id: 'bambu-echovision', tool: 'bambu', project: 'echovision', kind: 'Prototype photo',
    usage: 'Sliced in Bambu Studio and 3D-printed the custom enclosure that holds the camera, ESP32-CAM, battery and speaker at a fixed field of view.',
    preview: '/assets/echovision/enclosure.jpg', original: '/assets/echovision/enclosure.jpg', originalLabel: 'Open the enclosure photo',
    link: '/project/echovision', linkLabel: 'Inspect the packaging',
  },
  {
    id: 'bambu-parksense', tool: 'bambu', project: 'parksense', kind: 'Project scope',
    usage: 'Sliced and 3D-printed ParkSense prototype parts in Bambu Studio. The tested build in the prototype report used a cardboard housing; print records are not published.',
    link: '/project/parksense', linkLabel: 'Try the parking simulator',
  },
  {
    id: 'bambu-gearlab', tool: 'bambu', project: 'gearlab', kind: 'Project scope',
    usage: 'Sliced and 3D-printed parts for GearLab work in Bambu Studio. Print records are not published.',
    link: '/project/gearlab', linkLabel: 'See the fatigue data',
  },
  // Classwork: course context with no portfolio project. No page to link; the
  // résumé is the source for Fusion 360 and Java.
  {
    id: 'ees-classwork', tool: 'ees', project: 'classwork', kind: 'Course',
    usage: 'Thermodynamics (ME 3501) at Ohio State: thermodynamic property evaluation and cycle analysis.',
  },
  {
    id: 'fusion-classwork', tool: 'fusion', project: 'classwork', kind: 'Prior coursework',
    usage: 'High school LEGO Mindstorms enclosure projects: custom 3D-printed mechanical housings.',
    original: links.resume, originalLabel: 'Listed on the résumé',
  },
  {
    id: 'java-classwork', tool: 'java', project: 'classwork', kind: 'Prior coursework',
    usage: 'AP Computer Science A in high school, then applied at past HackOHI/O hackathons.',
    original: links.resume, originalLabel: 'Listed on the résumé',
  },
]

export const toolById = Object.fromEntries(tools.map((t) => [t.id, t]))
export const projectById = Object.fromEntries(projects.map((p) => [p.id, p]))
