# Skills-to-project map implementation plan

> For the implementing agent: execute this brief in small, reviewable steps. This handoff is a design proposal; no application changes are authorized by the handoff itself.

**Goal:** Help a recruiter see which engineering skills Gautham used, where he used them, and which artifact supports the claim.

**Architecture:** Replace the existing `SkillsProof` accordion with a small, data-driven relationship map. Keep the existing homepage section position and component export. Desktop connects grouped skills to a project rail; a shared evidence panel explains the active relationship.

**Tech stack:** Existing React, Tailwind, React Router, `MediaGallery`, and the `thumbnail()` helper. No graph library or new dependency.

**Scope:** `src/components/SkillsProof.jsx` and an optional adjacent data file, `src/data/skillEvidence.js`. This document is the design specification. Preserve the hero, portrait/About placement, GearHub SVG, scroll transition, routing, project pages, and navigation.

## Recommended direction: six improvements

1. **Connect skills to work.** Group skill buttons on the left and place project buttons on the right. Draw only the active relationships, using thin cyan SVG paths in the gap.
2. **Make selection work both ways.** Selecting Siemens NX reveals NASA; selecting ParkSense reveals its CAD, firmware, and circuit relationships. A single selection controls the whole section.
3. **Explain each claim.** Below the map, show one concise usage statement, a thumbnail when available, and separate links to the project and original artifact.
4. **Label evidence strength.** Use plain labels such as `Drawing`, `Report`, `Prototype photo`, or `Resume scope`. A resume claim must not look like a downloadable drawing or source-code archive.
5. **Separate unlinked skills.** EES, Java, and Fusion 360 have no project connections. Selecting one shows its coursework or prior-experience context and leaves the project rail neutral. (Updated 2026-11-17: Onshape and MATLAB are now project-linked.)
6. **Keep mobile direct.** At narrow widths, replace connection lines with selected project chips and the same evidence panel. All information must remain understandable without lines, animation, or hover.

## Layout and visual treatment

- Use the existing obsidian `#05080F` background, cyan `#00E5FF` accents, current titanium/readout text tokens, and existing monospace labels.
- Keep `id="skills-heading"` and the existing section spacing so homepage links and tests remain valid.
- Heading: **Skills in practice**. Supporting copy: **Select a skill or project to inspect the work behind it.**
- Desktop at `lg`: a skill area, a connection gutter, and a narrower project rail. Group skills under `CAD & drawings`, `Test & measurement`, `Embedded & fabrication`, and `Discovery`.
- Make nodes compact bordered buttons with a clear selected state. Avoid glowing panels, percentage meters, star ratings, logo walls, and moving particles.
- The project rail lists GearLab, NASA L’SPACE, ParkSense, EchoVision, OSU Marion, Deadbolt coursework, and Reph. Honda is an incoming placement and has no completed-work proof node.
- Initial state is neutral: no selected skill/project, no expanded preview, and no active edges. The evidence panel contains the short selection instruction.
- The conversation mockup opens with ParkSense selected to demonstrate the interaction. Keep the actual implementation neutral on first load. Its alternate five-group layout separates code/analysis from embedded work; either grouping uses the same evidence model.
- Evidence panel: category label, skill → project title, one usage sentence, one relevant preview, artifact context, and two direct links. If multiple evidence items match, offer compact named buttons with the active item identified.
- Do not autoplay media or embed PDFs. Use lightweight WEBP thumbnails first; full originals open only on request.
- On phones, put the selected evidence immediately after the project chooser, ahead of the full skill list. LEGO Mars Rover can be an eighth project entry once its coursework source is attached; label its early coursework scope accurately.

## Verified relationship map

Every connection needs a supported usage statement. An artifact can support a project's broader scope without proving every detail visible in a thumbnail.

| Skill / practice | Project | Supported usage and available evidence |
|---|---|---|
| Siemens NX | NASA L’SPACE | Sampling-arm engineering drawing; rover subsystem design. `/assets/Shovel Arm NX.png`, `/assets/Engineering Portfolio - Gautham.pdf#page=3`. Readout status: `Currently pursuing Siemens NX certification`. |
| Onshape | ParkSense, GearLab | User-confirmed CAD use (2026-11-17). No Onshape models are published; evidence level `Project scope`. |
| Bambu Studio / 3D Printing | EchoVision, ParkSense, GearLab | User-confirmed slicing and printing (2026-11-17). EchoVision enclosure photo `/assets/echovision/enclosure.jpg`; ParkSense and GearLab print records are not published (`Project scope`). ParkSense's tested build used a cardboard housing. |
| SolidWorks | ParkSense | Enclosure and separate stop-arm CAD views. `/assets/Parksense stuff/Prototype housing 1.png`, `/assets/Parksense stuff/prototype stop arm.png`. |
| SolidWorks | OSU Marion | UTM design, 5+ iterations, CAD/part documentation, BOM and assembly-plan scope are listed in `/assets/Gautham Subramanian-Resume.pdf`. Separate revision CAD, BOM, and assembly drawings are not published. |
| SolidWorks / engineering drawings | Deadbolt coursework | Dimensioned part and subassembly drawings. `/assets/all finished engineering stuff/Deadbolt Subassembly DRAWING_AS_PDF.PDF`, `/assets/all finished engineering stuff/Dial_G10_Lock Drawing.pdf`, `/assets/all finished engineering stuff/Front_Plate G10.pdf`. |
| LabVIEW | GearLab | Fatigue-rig operation and testing workflow. `/assets/Project Presentation-Rotating Beam Fatigue.pdf`; resume supports tool usage. Do not imply a downloadable LabVIEW program. |
| MATLAB | GearLab | User-confirmed 2026-11-17: MATLAB builds the S-N curve from the RBF test data. Preview `/assets/gearlab/sn-figure.png`, original the fatigue presentation PDF. Do not imply published MATLAB scripts. |
| Fatigue testing | GearLab | Rotating-beam results and calibration. `/assets/gearlab/sn-figure.png`, `/assets/gearlab/calibration-figure.png`; full presentation available separately. |
| Metrology / microscopy | GearLab | Specimen inspection and surface/geometry checks. Resume and fatigue presentation support the work; select the matching artifact or use `Resume scope` when no specific image proves the practice. |
| Arduino / C++ | ParkSense | Ultrasonic sensing, control logic, and feedback. `/assets/Parksense stuff/ME2900 Prototype Report.pdf`, `/assets/Parksense stuff/Prototype Circuit schematic.png`. Label the report accurately; a standalone firmware source file is not published. |
| HC-SR04 / sensor integration | ParkSense | Sensor-to-Arduino wiring and bench integration. `/assets/Parksense stuff/Prototype Circuit.png`, `/assets/Parksense stuff/Prototype Circuit schematic.png`. |
| Non-blocking timing | ParkSense | `millis()` scheduling and bounded `pulseIn()` wait for a missing echo; the report documents the 30 ms timeout. `/assets/Parksense stuff/ME2900 Prototype Report.pdf`. |
| ESP32-CAM / sensor integration | EchoVision | Camera, microcontroller, battery, and audio packaging. `/assets/echovision/enclosure.jpg`, `/assets/echovision/wiring.jpg`; `/assets/Engineering Portfolio - Gautham.pdf#page=4`. |
| 3D printing / enclosure design | EchoVision | Custom driver-safety housing. `/assets/echovision/enclosure.jpg`; portfolio/resume document the enclosure work. Do not attribute the build to a particular printer without a record. |
| Customer discovery | Reph / OnRamp | 10+ customer/partner interviews and field observations informed the proposed pickleball concept. `/assets/Reph - Onramp - SU26.pdf`, `/assets/onramp/solution-figure.png`; interview count is resume-supported. |

### Claim limits

- EES, Java, and Fusion 360 have no project edges. User-confirmed context (2026-11-17): EES in Thermodynamics (ME 3501) at Ohio State for property evaluation and cycle analysis; Fusion 360 in high school LEGO Mindstorms enclosure projects for custom 3D-printed housings; Java through AP Computer Science A in high school and at past HackOHI/O hackathons. MATLAB links only to GearLab (S-N curve from RBF data); it also appears in ME 2850.01 coursework, which the map does not show.
- Bambu Studio edges are user-confirmed, not file-backed except the EchoVision enclosure photo. Do not attribute a print to a specific printer model without a record.
- ParkSense's report uses the name EchoCar and describes cardboard housing. CAD screenshots establish enclosure design, not a verified printed enclosure build.
- The NASA concept involved a 15-person team. Individual mechanical design contributions must remain distinct from the team's deliverables and PDR milestone.
- Marion's report surveys test principles and team concepts. It is not a published five-revision change log or a BOM/assembly drawing pack. Do not retain the current misleading “Five-iteration design report” label.
- Keep `GD&T` and `Tolerance Stack-Up` out of the evidence-backed map unless an explicit artifact establishes that work. A dimensioned drawing alone does not establish a tolerance-stack analysis.
- Python is removed from the site (2026-11-17); do not list it. Simulink, FEA, and Git are optional future additions requiring confirmation before publication.

## State and interaction contract

Store one primary selection: `selection = null | { kind: 'skill' | 'project', id: string }`. Keep `selectedEvidenceId` only when the active selection offers multiple evidence items. Derive related skills, related projects, and matching evidence from data; do not store duplicate filtered arrays.

- Skill click: select that skill, emphasize its related projects, and show the first supported evidence item in a deterministic order.
- Project click: select that project, emphasize its related skills, and show its first evidence item.
- Repeating the selected button clears selection. A visible `Clear selection` control does the same.
- Evidence-item buttons change the panel artifact without changing the primary selection.
- Resume-only tools do not create empty graph selections. Their row links directly to the resume and identifies the evidence level.
- Hover can preview a border emphasis, but persistent content changes only after click or keyboard activation. Touch users get identical information.

Use native buttons with `aria-pressed`, grouped under real headings/lists. Keep the evidence panel in normal DOM order with a labeled heading and a short `aria-live="polite"` status message. Do not announce every decorative line change or move focus on every selection.

Render SVG connections as decorative `aria-hidden="true"`, `focusable="false"`, `pointer-events:none`. Derive endpoints from button centers in a `ResizeObserver`/layout effect scoped to this section. Recompute after resizing and font/layout changes. Show only selected edges, with no continuous drawing animation. Under reduced motion, update instantly. Below `lg`, omit SVG and use explicit relationship chips; no horizontal panning canvas.

## File-level implementation sequence

- [ ] Add `src/data/skillEvidence.js` only if it keeps `SkillsProof.jsx` readable. Define skills, projects, and evidence relationships with stable IDs, usage statements, evidence-level labels, case-study paths, and optional preview/original paths. Do not duplicate general project metadata already available in `experiences.js`.
- [ ] Replace the body of `src/components/SkillsProof.jsx` while keeping its default export, section anchor, and existing `Home.jsx` import. Remove the old accordion-specific state and misleading artifact labels.
- [ ] Implement selection and evidence derivation before adding connectors. Verify the interface remains useful with SVG hidden.
- [ ] Add the desktop SVG layer and responsive relationship chips. Keep measurement code local; do not add a graph engine or new package.
- [ ] Reuse `thumbnail(src)` from `src/data/media.js` for previews. Reuse `asset()` for encoded URLs. If `MediaGallery` is used, retain the original as its full-resolution lightbox target. Otherwise provide explicit original-image/PDF links.
- [ ] Use descriptive links: `See the fatigue data`, `Inspect the rover`, `Try the parking simulator`, `Inspect the packaging`, `Read the UTM scope`, `Inspect the deadbolt`, and `See the Reph concept`.
- [ ] Run focused browser acceptance checks, then run `npm run build` through the repo's context-mode verification path, `node scripts/verify-context-build.mjs`. Report the actual result and any existing warning separately.

## Acceptance checks

1. On a fresh load, no selected node or open preview appears. No heavy image or PDF is fetched before it is requested; selection uses a thumbnail first.
2. Siemens NX selects NASA only. ParkSense selects only its supported CAD, Arduino/C++, HC-SR04, and timing relationships. All selection directions produce matching usage copy and valid project/original links.
3. EES, Java, and Fusion 360 show their context and no project edge; MATLAB links GearLab (S-N curve); Onshape links ParkSense and GearLab; Bambu Studio links EchoVision, ParkSense and GearLab; Python appears nowhere. Honda, future skills, fabricated UTM revision decisions, and standalone firmware downloads are absent from evidence claims.
4. At 390×844, the section has no horizontal overflow; project chips and evidence text remain readable; controls are at least 44 px high. At desktop widths, edges align with their nodes after resize and zoom.
5. Tab, Shift+Tab, Enter, and Space reach/operate every node and evidence choice. Selected state is visible without color alone; full originals remain keyboard-accessible. Decorative SVG never enters the accessibility tree.
6. Reduced motion produces no line-drawing animation. Missing preview paths fall back safely; long labels do not overlap; no console/page errors occur. Hero animation, GearHub geometry, and scroll theme behavior remain unchanged.

## Lower-complexity alternative: compact proof ledger

If the map becomes visually dense, keep the same evidence data and replace the graph with grouped rows: `Skill · Where used · Evidence type · Open proof`. A selected project filter narrows the rows, and each row opens the same evidence panel. This preserves bidirectional exploration and clear attribution with less layout measurement. Choose this alternative only if the map cannot remain legible with selected edges alone; do not ship both interfaces as competing modes.

## Paste-ready implementation prompt

> Read `AGENTS.md`, `docs/skills-map-handoff.md`, `src/components/SkillsProof.jsx`, `src/data/experiences.js`, and `src/data/media.js`. Implement the recommended skills-to-project map from this handoff. Restrict live changes to `SkillsProof.jsx` and an optional `src/data/skillEvidence.js`; reuse existing primitives and add no dependencies. Preserve the hero, GearHub SVG, scroll animation/transition, page order, project pages, and navigation. Start with no active selection. Support skill-to-project and project-to-skill selection, a single evidence panel, desktop static SVG connections, and mobile relationship chips. Use thumbnails first and full-resolution files on demand. Follow the evidence table and claim limits exactly: resume-listed tools without project proof get no project edges; no invented UTM revision history, standalone firmware source, Bambu print evidence, or Honda completed results. Verify keyboard, touch, 390×844 mobile, desktop resize, reduced motion, asset links, and console errors. Run `npm run build` via context-mode using `node scripts/verify-context-build.mjs`. Report changed files, verification, and remaining evidence gaps concisely.
