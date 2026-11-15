// Case study copy and verified media, separate from the compact hub metadata.
//
// images: { src, alt, caption, lightMatte? }
//   Gallery frames are dark by default. Set `lightMatte: true` only for
//   white-paper material (line drawings, wiring diagrams, posters) so the
//   letterbox around it is a light matte instead of obsidian.
//   Leave `images` empty when there are no real project photos: the gallery
//   section is then skipped. Do not put the company logo here.
// documents: [href, label]
export const caseStudies = {
  "honda": {
    "title": "Honda Transmission Manufacturing Plant Co-op",
    "objective": "My Spring 2027 co-op placement is on the High Pressure Die Casting line at Honda's Transmission Manufacturing Plant in Russells Point, Ohio.",
    "methods": [
      [
        "Upcoming placement",
        "The co-op runs from January through May 2027. Specific line assignments and engineering deliverables have not started."
      ],
      [
        "Honda Launchpad Talent Cohort",
        "I currently participate in the Honda Launchpad Talent Cohort at Ohio State."
      ]
    ],
    "outcomes": [
      "The placement is confirmed; production improvements and test results will be documented after the work begins."
    ],
    "images": [],
    "documents": []
  },
  "gearlab": {
    "title": "OSU Gear and Power Transmission Laboratory (GearLab)",
    "objective": "I study gear bending fatigue as an undergraduate research assistant under Dr. Isaac Hong at Ohio State.",
    "methods": [
      [
        "Fatigue testing",
        "I conduct Gear Rotating Bending Fatigue (GRBF) and Single Tooth Bending (STB) tests, control the rigs through LabVIEW, and write repeatable operating procedures."
      ],
      [
        "Specimen inspection",
        "I use contour scanning and microscopy to examine specimen geometry and fatigue damage."
      ],
      [
        "STEP Signature Project",
        "My STEP Signature Project is connected to this laboratory research."
      ]
    ],
    "outcomes": [
      "Preliminary S-N curves relate applied stress to fatigue life in the test data.",
      "The rotating beam fatigue presentation documents the research work."
    ],
    "images": [],
    "documents": [
      [
        "/assets/Project Presentation-Rotating Beam Fatigue.pdf",
        "Rotating beam fatigue presentation"
      ]
    ]
  },
  "nasa": {
    "title": "NASA L'SPACE Mission Concept Academy",
    "objective": "I led mechanical design on a 15-person NASA L'SPACE team for a Martian cave exploration rover concept.",
    "methods": [
      [
        "Chassis and suspension",
        "I modeled the chassis packaging and rocker-bogie suspension in Siemens NX. The layout accounted for wheel travel, terrain clearance, and chassis attitude at a cave entrance."
      ],
      [
        "Power and sensing",
        "I integrated the solar power system and LiDAR mount into the concept assembly, accounting for sensor visibility and mechanical obstructions."
      ],
      [
        "Subterranean mission constraints",
        "The mission concept considered rough terrain, cave access, restricted communication paths, and limited sunlight underground. These constraints shaped mobility and power planning."
      ],
      [
        "Sampling arm",
        "I produced the Siemens NX sampling-arm engineering drawing included below."
      ]
    ],
    "outcomes": [
      "I completed the Mission Concept Academy in December 2025; the certificate is included below.",
      "The final portfolio records the mechanical concept and subsystem work. This was a concept design, with no flight or field validation claimed."
    ],
    "images": [
      {
        "src": "/assets/MCA schematic.png",
        "alt": "Martian cave rover concept sketch, side and top views",
        "caption": "Rover concept • side and top views"
      },
      {
        "src": "/assets/Shovel Arm NX.png",
        "alt": "Siemens NX sampling-arm engineering drawing",
        "caption": "Sampling-arm engineering drawing • Siemens NX",
        "lightMatte": true
      },
      {
        "src": "/assets/MCA cert.png",
        "alt": "NASA L'SPACE Mission Concept Academy certificate",
        "caption": "Mission Concept Academy certificate"
      }
    ],
    "documents": [
      [
        "/assets/Engineering Portfolio - Gautham.pdf#page=3",
        "Mission concept portfolio overview"
      ]
    ]
  },
  "onramp": {
    "title": "99P Labs & Fisher College of Business OnRamp",
    "objective": "I worked on Reph, an automated pickleball referee concept, through the 99P Labs and Fisher College of Business OnRamp program.",
    "methods": [
      [
        "Customer discovery",
        "I interviewed customers and partners about officiating needs and the use of automated refereeing during play."
      ],
      [
        "Concept design and field data",
        "I collected field data and used observations from play to inform the Reph concept."
      ]
    ],
    "outcomes": [
      "The discovery work included 10+ stakeholder interviews.",
      "The summer 2026 OnRamp presentation documents the concept and customer research."
    ],
    "images": [],
    "documents": [
      [
        "/assets/Reph - Onramp - SU26.pdf",
        "Reph OnRamp presentation"
      ]
    ]
  },
  "echovision": {
    "title": "EchoVision",
    "objective": "I designed a driver drowsiness detection prototype with an audible alert and a custom 3D-printed housing.",
    "methods": [
      [
        "Detection and alert hardware",
        "The prototype used an ESP32-CAM and TinyML for drowsiness detection, with a speaker for the alert."
      ],
      [
        "Mechanical packaging",
        "I designed the enclosure around the camera, battery, and speaker, then fabricated the housing with 3D printing."
      ]
    ],
    "outcomes": [
      "The enclosure and wiring photographs document the assembled hardware.",
      "The cockpit image is a packaging reference; it does not show an installed or validated vehicle system."
    ],
    "images": [
      {
        "src": "/assets/echovision/enclosure.jpg",
        "alt": "EchoVision custom enclosure",
        "caption": "Custom driver-safety enclosure"
      },
      {
        "src": "/assets/echovision/wiring.jpg",
        "alt": "EchoVision ESP32-CAM and speaker wiring",
        "caption": "ESP32-CAM and speaker wiring"
      },
      {
        "src": "/assets/echovision/cockpit-reference.jpg",
        "alt": "Honda S2000 cockpit reference",
        "caption": "Cockpit reference • Honda S2000"
      }
    ],
    "documents": [
      [
        "/assets/Engineering Portfolio - Gautham.pdf#page=4",
        "EchoVision portfolio overview"
      ]
    ]
  },
  "marion": {
    "title": "OSU Marion Campus & Early Engineering Projects",
    "objective": "I designed a teaching universal testing machine in SolidWorks at Ohio State Marion, alongside early engineering and payload-modeling work.",
    "methods": [
      [
        "Teaching machine design",
        "I revised the mechanical layout across five design iterations to accommodate three material tests."
      ],
      [
        "Build documentation",
        "I produced engineering drawings, a bill of materials, and assembly plans for the teaching machine."
      ],
      [
        "Buckeye Space Launch Initiative",
        "I modeled payload hardware for the Buckeye Space Launch Initiative."
      ]
    ],
    "outcomes": [
      "The research report captures the teaching machine design and assembly documentation.",
      "The work reached a documented design; no fabricated-machine performance measurements are claimed."
    ],
    "images": [],
    "documents": [
      [
        "/assets/Research Universal Testing Machine-Marion.pdf",
        "Teaching universal testing machine research"
      ]
    ]
  },
  "parksense": {
    "title": "ParkSense: Garage Parking Assistant",
    "objective": "I designed ParkSense as a garage parking assistant with PIN arming, distance feedback, and a servo-operated barrier.",
    "methods": [
      [
        "Sensing and access control",
        "An HC-SR04 ultrasonic rangefinder measured vehicle distance. A 4x4 keypad handled PIN arming, and an SG90 servo operated the barrier."
      ],
      [
        "Driver feedback",
        "A MAX7219 LED matrix displayed parking feedback, with an RGB LED and active buzzer providing visual and audible cues."
      ],
      [
        "Firmware timing",
        "I used non-blocking millis() timing so sensing, feedback, and barrier control could run without delay-based pauses. A 30 ms pulseIn timeout bounded the wait for a missing ultrasonic echo."
      ],
      [
        "Enclosure and fabrication",
        "I designed the custom front-wall enclosure in SolidWorks and fabricated it in PLA with 3D printing. The stop arm was modeled as a separate part."
      ]
    ],
    "outcomes": [
      "The missing-echo timeout fix prevented a prolonged sensor wait from holding up the control loop.",
      "The prototype report and poster document the integrated hardware and enclosure."
    ],
    "images": [
      {
        "src": "/assets/Parksense stuff/Prototype Circuit.png",
        "alt": "Arduino parking-assistant prototype with ultrasonic sensor, keypad, LED matrix, and servo arm",
        "caption": "Circuit prototype"
      },
      {
        "src": "/assets/Parksense stuff/Prototype Circuit schematic.png",
        "alt": "ParkSense wiring diagram",
        "caption": "Wiring diagram",
        "lightMatte": true
      },
      {
        "src": "/assets/Parksense stuff/Prototype housing 1.png",
        "alt": "ParkSense enclosure CAD, view 1",
        "caption": "Enclosure CAD • view 1"
      },
      {
        "src": "/assets/Parksense stuff/Prototype housing 2.png",
        "alt": "ParkSense enclosure CAD, view 2",
        "caption": "Enclosure CAD • view 2"
      },
      {
        "src": "/assets/Parksense stuff/prototype housing 3.png",
        "alt": "ParkSense enclosure CAD, view 3",
        "caption": "Enclosure CAD • view 3"
      },
      {
        "src": "/assets/Parksense stuff/prototype stop arm.png",
        "alt": "ParkSense servo stop-arm CAD",
        "caption": "Stop-arm CAD"
      }
    ],
    "documents": [
      [
        "/assets/Parksense stuff/ME2900 Prototype Report.pdf",
        "ParkSense prototype report"
      ],
      [
        "/assets/Parksense stuff/ME2900 Prototype Poster - Gautham Subramanian.pdf",
        "ParkSense prototype poster"
      ]
    ]
  },
  "misc": {
    "title": "Miscellaneous Projects",
    "objective": "These projects span LEGO robotics, custom printed parts, campus software, and early SolidWorks and Arduino coursework.",
    "methods": [
      [
        "LEGO Mindstorms Mars Rover",
        "I built and programmed a LEGO Mindstorms rover with a custom claw for mission tasks. Arduino distance-sensor LED feedback complemented the rover hardware."
      ],
      [
        "Bambu Lab A1 Mini fabrication",
        "I make custom PLA+ and PETG parts on a Bambu Lab A1 Mini, with material and print settings chosen for each part."
      ],
      [
        "SideQuest",
        "I built SideQuest, a campus exploration web app, for HackOHI/O 2026."
      ],
      [
        "Early SolidWorks and Arduino coursework",
        "My early coursework included SolidWorks assemblies, a deadbolt lock mechanism, engineering drawings, and Arduino sensing exercises."
      ]
    ],
    "outcomes": [
      "The rover poster and lab report preserve the mission work and code documentation.",
      "The lock assembly and deadbolt drawings record the part and assembly documentation from ENGR 1182."
    ],
    "images": [
      {
        "src": "/assets/Mars Rover.png",
        "alt": "Earlier LEGO Mindstorms rover with claw",
        "caption": "Earlier coursework • LEGO Mindstorms rover",
        "lightMatte": true
      },
      {
        "src": "/assets/all finished engineering stuff/gautham sketch cd1.JPEG",
        "alt": "Engineering concept sketch",
        "caption": "ENGR 1182 • concept sketch",
        "lightMatte": true
      }
    ],
    "documents": [
      [
        "/assets/Mars Rover Lab report.pdf",
        "Earlier LEGO rover lab report"
      ],
      [
        "/assets/all finished engineering stuff/G03_Lock_Assembly DRAWING.pdf",
        "Lock assembly drawing"
      ],
      [
        "/assets/all finished engineering stuff/Deadbolt Subassembly DRAWING G09.PDF",
        "Deadbolt subassembly drawing"
      ]
    ]
  }
}
