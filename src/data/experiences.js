// Single source of truth for the gear teeth, drawer, and project routes.
// Order here is the clockwise tooth order, starting at 12 o'clock.
// Paths are the exact `public/assets/` filenames from PLAN.md; wrap with asset() before use.
//
// Spec strip fields (project page header):
//   role / specRole: ROLE cell. `role` also feeds the hub list subtitle; set
//                    `specRole` when `role` is a project description, not a job title.
//   tools:           TOOLS / CAD cell
//   domain:          DOMAIN cell
//   period:          TIMELINE cell
//
// Telemetry card fields (gear hub, shown for the active tooth):
//   metric: one line, a number or fact from the case study's own documents
//   tool:   the primary tool for that work
//   metricLabel: row label for `metric`. Defaults to "Result"; set "Status" when
//                the line reports a state, not a measured or delivered result.
//   preview: [src, alt, light?] artifact thumbnail. Omit when no artifact image
//            exists; the card then shows the logo and says so.
//
// Logo PNGs have opaque baked-in backgrounds, so the gear hub and the project
// header paint a plate in the same colour behind each one:
//   logoSize: natural pixel size (keeps the fitted box equal to the drawn image)
//   plate:    the logo's own background colour, sampled from its pixels
//   feather:  optional edge fade in SVG units (default 3)
// Entries with `logo: null` show their name as text in the hub and get no
// logo plate on their page.

export const asset = (path) => encodeURI(path)

export const links = {
  resume: '/assets/Gautham Subramanian-Resume.pdf',
  linkedin: 'https://www.linkedin.com/in/gautham-subramanian1/',
  email: 'mailto:subramanian.208@osu.edu',
}

export const workLinks = {
  gearlab: 'See the fatigue data',
  nasa: 'Inspect the rover',
  parksense: 'Try the parking simulator',
  echovision: 'Inspect the packaging',
  marion: 'Review the UTM design',
  onramp: 'See the Reph concept',
  honda: 'View the incoming placement',
}

export const experiences = [
  {
    slug: 'honda',
    status: 'Incoming Spring 2027 co-op · High Pressure Die Casting',
    location: 'Honda Transmission Manufacturing Plant, Russells Point, OH',
    label: 'Honda',
    toothLines: ['HONDA'],
    org: 'American Honda Motor Co. — Transmission Manufacturing Plant',
    role: 'High Pressure Die Casting Co-op (incoming)',
    period: 'Jan – May 2027',
    tools: "HPDC / Manufacturing",
    domain: "Automotive",
    summary:
      'Incoming co-op on the high pressure die casting line at Honda’s Transmission Manufacturing Plant in Russells Point, Ohio.',
    logo: '/assets/Honda Logo.png',
    logoSize: [966, 916],
    plate: '#FFFFFF',
    specRole: "Incoming Co-op",
    metric: 'Placement confirmed · work starts January 2027',
    metricLabel: 'Status',
    tool: 'High pressure die casting',
  },
  {
    slug: 'gearlab',
    label: 'GearLab',
    toothLines: ['GEARLAB'],
    org: 'Gear and Power Transmission Laboratory, Ohio State',
    role: 'Undergraduate Research Assistant',
    period: "Jan 2026 - Present",
    tools: "LabVIEW · RBF200 · Metrology",
    domain: "Tribology & Fatigue",
    summary:
      'Rotating beam and gear bending fatigue testing: running the rigs in LabVIEW, writing SOPs, building preliminary S-N curves, and checking specimens with contour scans and microscopy.',
    logo: '/assets/gearlab logo.png',
    logoSize: [700, 135],
    plate: '#FFFFFF',
    specRole: "Undergrad Research Assistant",
    metric: '14 rotating beam tests · 125.64 to 565.38 MPa',
    preview: ['/assets/gearlab/sn-figure.png', 'S-N chart of rotating beam fatigue tests', true],
    tool: 'RBF200 rotating beam rig',
  },
  {
    slug: 'nasa',
    label: 'NASA',
    toothLines: ['NASA'],
    org: 'NASA L’SPACE Mission Concept Academy',
    role: 'Mechanical Design Lead',
    period: 'Sep 2025 – Dec 2025',
    tools: 'Siemens NX, JMARS',
    domain: 'Aerospace, planetary rover',
    summary:
      'Rover concept for exploring Martian caves. Modeled the rocker-bogie suspension, chassis, solar power system, and LiDAR mount in Siemens NX on a 15-person team.',
    logo: '/assets/NASA logo.png',
    logoSize: [352, 325],
    plate: '#040404',
    metric: '15-person team · rocker-bogie cave rover concept',
    preview: ['/assets/Shovel Arm NX.png', 'Siemens NX sampling-arm engineering drawing', true],
    tool: 'Siemens NX',
  },
  {
    slug: 'onramp',
    label: 'OnRamp',
    toothLines: ['ONRAMP'],
    org: 'Center for Innovation Strategies',
    role: 'Student Innovation Analyst',
    period: "Jun 2026 - Aug 2026",
    tools: "Customer Discovery · Field Data",
    domain: "Product Development",
    summary: "Completed concept design and customer discovery for Reph through 10+ stakeholder interviews and field data collection.",
    logo: '/assets/onramp logo.png',
    logoSize: [631, 289],
    plate: '#E9E7E8',
    specRole: "Student Innovation Analyst",
    metric: '10+ stakeholder interviews',
    preview: ['/assets/onramp/solution-figure.png', 'Reph concept slide from the OnRamp deck', true],
    tool: 'Customer discovery',
  },
  {
    slug: 'echovision',
    label: 'EchoVision',
    toothLines: ['ECHOVISION'],
    org: 'Personal project',
    role: 'Driver drowsiness detection',
    specRole: "Hardware & CAD Lead",
    period: "Feb 2026 - Mar 2026",
    tools: "ESP32-CAM · TinyML · 3D Printing",
    domain: "Driver Safety",
    metric: 'Camera, battery and speaker in one printed housing',
    preview: ['/assets/echovision/enclosure.jpg', 'EchoVision printed enclosure'],
    tool: 'ESP32-CAM',
    summary:
      'ESP32-CAM and TinyML system that detects driver drowsiness and sounds an alert, in a custom enclosure for the camera, battery, and speaker.',
    logo: null,
  },
  {
    slug: 'marion',
    label: 'Marion Projects',
    toothLines: ['MARION', 'PROJECTS'],
    org: 'The Ohio State University at Marion',
    role: 'Undergraduate Researcher',
    period: "Aug 2024 - Jul 2025",
    tools: "SolidWorks · BOM · GD&T",
    domain: "Mechanical Design",
    summary:
      'Designed a teaching universal testing machine in SolidWorks that handles three types of material test. Five design iterations with drawings, bill of materials, and assembly plans.',
    logo: '/assets/osu marion logo.png',
    logoSize: [330, 343],
    plate: '#A80D0F',
    feather: 8, // edges vignette darker than the interior red; fade over that band
    specRole: "Undergrad Researcher",
    metric: '5 design iterations · 3 material tests',
    tool: 'SolidWorks',
  },
  {
    slug: 'parksense',
    label: 'ParkSense',
    toothLines: ['PARKSENSE'],
    org: 'ME 2900 prototype project, Ohio State',
    role: 'Mechatronic Garage Parking Assistant',
    specRole: "Mechatronics Designer",
    period: "Sep 2026 - Oct 2026",
    tools: "Arduino · HC-SR04 · SolidWorks · PLA",
    domain: "Embedded Systems",
    metric: '30 ms pulseIn timeout bounds a missing echo',
    preview: ['/assets/Parksense stuff/Prototype Circuit.png', 'ParkSense breadboard prototype'],
    tool: 'Arduino · HC-SR04',
    summary:
      'Arduino garage parking assistant: an ultrasonic sensor measures the distance to the car and an LED matrix tells the driver when to stop, inside a custom CAD enclosure.',
    logo: null,
  },
].map((item, i) => ({
  ...item,
  index: String(i + 1).padStart(2, '0'),
  path: `/project/${item.slug}`,
}))

export const misc = {
  slug: 'misc',
  label: 'Miscellaneous Projects',
  org: 'Coursework and side builds',
  role: 'Hardware, fabrication & software',
  period: '2024 – Present',
  tools: 'SolidWorks, Bambu Lab A1 Mini',
  domain: 'Coursework & side builds',
  summary:
    'Bambu Lab A1 Mini fabrication, the SideQuest campus exploration app, and earlier rover and CAD coursework.',
  logo: null,
  index: null,
  path: '/misc',
}

// Featured entry points: the three lead cards at the top of the hub.
// `light: true` marks white-paper figures, which get a light matte.
export const featured = [
  {
    slug: 'gearlab',
    title: 'GearLab',
    status: 'Active Research',
    image: '/assets/gearlab/sn-figure.png',
    alt: 'S-N chart distinguishing rotating-beam failures, runouts, and reference data',
    light: true,
    contribution:
      'I run rotating beam and gear bending fatigue tests, write the operating procedures, and build preliminary S-N curves.',
  },
  {
    slug: 'nasa',
    title: 'NASA L’SPACE',
    status: 'Completed PDR',
    image: '/assets/Shovel Arm NX.png',
    alt: 'Siemens NX sampling-arm engineering drawing',
    light: true,
    contribution:
      'I led mechanical design and modeled the rocker-bogie suspension, chassis, and sampling arm in Siemens NX.',
  },
  {
    slug: 'parksense',
    title: 'ParkSense',
    status: 'Completed Prototype',
    image: '/assets/Parksense stuff/Prototype Circuit.png',
    alt: 'ParkSense breadboard prototype with ultrasonic sensor, LED matrix, keypad, and servo arm',
    contribution:
      'I wired the sensor, keypad, LED matrix, and servo, then wrote firmware that keeps the keypad live when an echo is missed.',
  },
].map((item) => ({ ...item, path: `/project/${item.slug}` }))
