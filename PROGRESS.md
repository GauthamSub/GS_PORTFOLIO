# Project subpages

Verified 2026-11-15.

- Replaced all eight placeholder routes with ProjectPage using ProjectLayout.
- Retained the persistent circular drawer and verified Return to Gear Hub on every page.
- Header logo plates use each experience's plate color: white, NASA #040404, OnRamp #E9E7E8, Marion #A80D0F.
- Extracted three EchoVision JPEGs and the Martian cave rover sketch from Engineering Portfolio - Gautham.pdf into public/assets/.
- Kept all six ParkSense images and the earlier LEGO rover under /misc; cave rover uses its own concept sketch.
- Playwright checked every route at 1440px and 375px: zero console/page errors, broken decoded images, failed asset responses, or horizontal overflow.
- Verified all return links, drawer navigation to /misc, seven gear hover interactions, and white-to-obsidian home scrolling.
- Production build passes. Vite reports a main bundle slightly above the 500 kB warning threshold.

# Spec-sheet redesign and ParkSense tooth

Verified 2026-11-15 against the production build (28/28 Playwright checks, zero console errors).

- Tooth 7 is now `parksense` (`/project/parksense`, no logo, hub shows `PARKSENSE` text). `/project/mars-rover` no longer exists. PLAN.md section 3 still lists the old route.
- The Mars Rover case study was the same L'SPACE project as NASA. Its unique method notes, the Siemens NX drawing, and the portfolio PDF link moved onto the NASA page.
- ParkSense content moved out of `/misc` into its own case study. The earlier LEGO rover stays under `/misc`.
- `ProjectLayout.jsx`: logo plate sized to the logo, 4-cell spec strip (`specRole || role`, `tools`, `domain`, `period` from `experiences.js`), previous / next footer that walks the seven teeth then `/misc` and wraps.
- `MediaGallery.jsx`: dark cards (`#0B111C`), `lightMatte: true` per image for white-paper material, native `<dialog>` lightbox. Images in `projectDetails.js` are now `{ src, alt, caption, lightMatte? }` objects.
- Gallery and Documents sections render only when they have content. Company logos were removed from the Honda and OnRamp galleries.
- Removed the unused `ProjectPlaceholder.jsx`.
- Open question for Gautham: the Honda page title says "Anna Engine Plant" but its body and the resume say the Transmission Plant in Russells Point.

## Content correction pass, 2026-11-15

- Rewrote all eight case studies in role-appropriate tense, with distinct methodology and outcomes.
- Populated the requested spec strips; OnRamp ends August 2026.
- Confirmed one NASA rover schematic, sampling-arm drawing with lightMatte, certificate, and portfolio PDF.
- ParkSense has all six images and complete sensing, PIN, barrier, feedback, firmware, and PLA enclosure details. Misc retains LEGO rover, fabrication, SideQuest, and coursework.
- Browser checks at desktop/mobile: zero console errors, broken images, failed document links, or horizontal overflow. Old mars-rover URL returns Not Found.
- npm run build executed through local context-mode ctx_execute: exit 0.

# Homepage overhaul: hero, nav button, scroll bridge, machined gear

Verified 2026-11-16 with Playwright on the dev server at 375, 768, 1024, 1280 and 1440 px: zero console errors, zero horizontal overflow.

- Hero: name on its own full-width row, action links above the bio, top-right quick links, scroll cue at the hero bottom.
- Nav button is 72px on `lg+` and 56px below. Drawer traps Tab, locks page scroll, returns focus to the button on close. `--scrollbar-gap` (set by NavMenu, read by RootLayout) stops the page shifting when the scrollbar hides.
- Blend zone is `h-[42vh]` and holds `ScrollBridge.jsx` (sedan, rocket, robot arm). Scroll offsets are now `['start 0.6', 'end 0.35']`; hero fades over hud 0 to 0.4, hub over 0.55 to 0.85.
- Gear: sidewall is six stacked silhouettes offset down the screen. `Inspect Gear` squashes the gear plane by cos 52° and deepens the sidewall. Callout anchors are computed from `REF` in `lib/gear.js`, so they follow any change to the tooth geometry.
- Top band in RootLayout and top padding in ProjectLayout grew to clear the larger button.
- context-mode MCP was not connected this session; `npm run build` ran directly: exit 0.

# Proof-first interactions � 2026-11-16

- Added SkillsProof below Gear Hub: nine expandable tool entries, case-study links, and available artifact links. Bambu fabrication explicitly notes unpublished print records.
- ProjectPage leads with primary artifacts and gallery before objective, methods, and outcomes. GearLab, Marion, and OnRamp show their source PDF first.
- NASA defaults to Siemens NX sampling-arm drawing; three subsystem controls switch constraints, design decisions, and matching artifact.
- ParkSense simulator sits beside prototype photo: 10�150 cm, CLEAR >60, CAUTION 25�60, STOP <25; synchronized 8x8 matrix, RGB, vehicle, and 0/90-degree servo. Reduced-motion support verified.
- Honda header labels incoming Spring 2027 High Pressure Die Casting co-op, Jan�May 2027, Transmission Manufacturing Plant, Russells Point, OH.
- Chrome DevTools verified nine drawers and asset links (HTTP 200), all NASA selectors, six slider boundaries (10/24/25/60/61/150), desktop and 375px mobile layouts, drawer, gear hover/logo reveal, and white-to-obsidian transition. No observed console errors.
- Production build executed using local context-mode MCP ctx_execute: exit 0, zero build errors. Existing >500 kB bundle warning remains.


# Surface textures, Batch 1, signature modules - 2026-11-16

Verified with Playwright on the dev server at 1440x900 and 390x844: zero console errors, zero horizontal overflow, zero broken images on / and all eight case-study routes. `npm run build` exit 0 after each milestone (existing >500 kB chunk warning remains).

- Surfaces live in `index.css` (`surface-vellum`, `surface-slate`, `surface-brushed`) and `SurfaceLayers` in `HudBackdrop.jsx`. The fixed top band in `RootLayout.jsx` renders the same layers at viewport size, so textures run through it with no seam. Light fades out by hud 0.35, dark fades in from 0.4.
- `GearHub.jsx`: `GearBackdrop` (degree rings + backlight, tilts with Inspect Gear), `Telemetry` card (role / metric / tool from `experiences.js`), touch first-tap preview on teeth. The index list still opens routes in one tap.
- `Home.jsx`: hub links are `<Link to="/#gear-hub">`; `smoothOnce` turns on smooth scrolling for that navigation only, never under reduced motion. `useFocusHold` holds a section at full opacity while keyboard focus is inside it. Checked: 40 consecutive Tab stops and Shift+Tab back into the hero all at opacity 1.
- Phones: one contact group (Resume, LinkedIn, Email), featured-work links above the bio, featured cards above the gear.
- `ProjectLayout.jsx` takes `brief` and `anchors`; `anchorOffset` clears the fixed top band. `ProjectPage.jsx` maps slug -> interactive module. Honda has no artifact, trade-off strip, or anchor row yet.
- ParkSense missing-echo copy follows the prototype report and sketch: 10 us trigger, pulseIn(echo, HIGH, 30000UL), returns 0, readDistanceCM() returns DIST_MAX (400 cm), loop continues. RGB / matrix / servo are not simulated in that mode.
- Deadbolt view is labelled as an illustration: the three drawings do not define mating geometry.

Open questions for Gautham:
- ParkSense distance sweep uses CLEAR > 60 / CAUTION 25-60 / STOP < 25 cm with a 0/90 degree arm. The report sketch uses 400 / 140 / 70 cm zones with a 45 degree middle position. The sweep was left as it was.
- ParkSense copy says the enclosure was 3D printed in PLA. The report describes a cardboard enclosure. Which is current?
- The report and poster call the project EchoCar; the site calls it ParkSense.
- Test note: the Playwright MCP window throttles requestAnimationFrame when it is not in front. Call page.bringToFront() before reading scroll-driven styles.


## Batch 2 / 4 delivery — 2026-11-16
- Completed GearLab p8/p7/p17 high-resolution figure crops, Reph p5 attributed concept crop, Marion HTML summary and source links, and three NASA subsystem annotations.
- Added always-visible NX, SolidWorks and Arduino previews inside SkillsProof (used by Home). Shared MediaGallery owns the project dialog: keyboard arrows, visible zoom/reset controls, pan, captions and original links.
- ParkSense build pack groups requirements, wiring, firmware and fabrication artifacts. PDFs open on demand. CAD views do not establish a printed enclosure; the report describes cardboard and uses the name EchoCar.
- Added /drawings (8 artifacts, search and four filters), /misc workshop, and /print summary. Drawing Library and Print summary are in NavMenu.
- Generated four 1200x630 share PNGs from existing figures. npm run build emits static head metadata for all 11 routes; vercel.json maps routes to their metadata HTML and falls back to the SPA. On Vercel the build uses deployment host variables. Set VITE_SITE_URL to a production origin for absolute URLs on other hosts.
- Workshop evidence limits: no dedicated Bambu fabrication record or SideQuest demo/screenshot exists in the repo. Entries state these gaps and identify related/context artifacts. NASA MCA sketch labels antenna/camera, not LiDAR; the annotation points to the portfolio's LiDAR description.
- Verification: context-mode ctx_execute ran npm run build with exit 0 and zero errors. Existing >500 kB bundle warning remains. A transient context-mode internal error cleared on retry.
- Browser verification: all 11 routes at 1440px and 390px; no console/page errors, broken images or horizontal overflow. Drawing filters/search, drawer navigation, Marion no-embed summary, NASA crop switching and originals, GearLab lead and all figure stages passed. Home background transitions from rgb(250,251,253) to rgb(5,8,15); gear hover scales the tooth.
- Lightbox verified at desktop and 375px: arrow navigation, zoom/reset, navigation zoom reset, Escape, focus restoration, original links and inline previews. Exported /print to PDF: exactly one Letter page with three figures.
- Reproduction: scripts/render-evidence.py (PyMuPDF + Pillow), scripts/verify-context-build.mjs (installed context-mode MCP), scripts/audit-assets.mjs. Temporary environments, screenshots, browser checks and exported summary PDF live in ignored .tmp/.

# Completion checks - 2026-11-16

Playwright on the dev server at 1440x900 and 390x844. `npm run build` exit 0 (existing >500 kB chunk warning, now 600 kB).

- Fixed: direct load of `/#gear-hub` landed mid-page in any tab that had already done a full page load. Full loads all share the history key "default", so `<ScrollRestoration>` restored the tab's last saved position and skipped the hash. `RootLayout.jsx` now passes `getKey`: path-scoped keys for full loads, and a per-load key when a hash is present. Verified: reused tab and reload both land on the hub with focus on its heading; in-app Back still restores scroll.
- Passed: View Selected Work (hash, smooth scroll, focus to heading), Back/Forward, 30 Tab + 8 Shift+Tab stops all at opacity 1, reduced motion (instant jump, static bridge, no cue animation).
- Passed at 390: one contact group, featured links above the bio, 3 featured cards above the gear, Inspect Gear 160x44, no text painted over the menu button on any of 11 routes.
- Passed: GearLab p7/p8/p17 crops and PDF anchors; Reph p5 crop; Marion HTML summary (no embedded PDF); NASA 3 annotated crops; ParkSense slider boundaries, missing-echo sequence, 4 schematic highlights, build pack; deadbolt buttons and SVG selection; EchoVision statuses; Drawing Library filters (1/7/2/8) and search; Print Summary is exactly one US Letter page.
- 41 unique asset URLs across 11 routes: all served, none missing. Zero console errors during the runs.

## Targeted homepage fixes — 2026-11-16
- Moved NX, SolidWorks and Arduino artifact previews inside their controlled panels; null initial selection now hides all accordion content.
- Removed heading width cap, enabled one-line desktop heading, removed gear instruction paragraph and changed cue to Scroll down.
- Browser checks passed at 1440/768/390px: collapsed panels, preview toggles, single-line desktop heading, no overflow or page errors. Context-mode build exit 0; existing bundle warning remains.
- Portrait swap pending: no new port pic file found anywhere in workspace, including public/assets and ignored Assets. Requested exact path; existing portrait retained until source is available.

## Portrait swap completed — 2026-11-16
- Copied Assets/new port pic.jpeg into public/assets and replaced the hero image. Preserved natural 1486:1600 framing with object-cover; removed Scott Laboratory caption.
- Desktop/mobile browser checks passed: decoded portrait, source aspect ratio, no horizontal overflow or page errors. Context-mode build exit 0; existing bundle-size warning remains.


## Non-hero structure and proof-first delivery — 2026-11-16
- Moved the portrait and about copy into closing Now & About, after a three-card From the Workshop strip. Contact links place Print-Friendly Summary beside Resume; drawer uses two columns to keep the pair adjacent on phones.
- Preserved Home scroll hooks, motion values, transition offsets and scroll-cue animation byte-for-byte. GearHub changed only its imported work-link labels and generic CTA text; SVG, geometry and motion are unchanged. ScrollBridge and lib/gear.js hashes match the start-of-task baseline.
- ProjectLayout now supports primaryArtifact and indexControls slots. Phone headers show Role, Result / Evidence and Tool; the primary proof comes before the brief, dates and detailed methodology. Desktop retains the full spec strip.
- GearLab leads with the actual S-N chart (14 tests, 125.64–565.38 MPa, failure/runout/reference legend) and four lab steps. NASA leads with sampling-arm annotations, then readable rover context views, individual/team scope and PDR status.
- ParkSense has its 30 ms vs ~1 s echo comparison near the simulator, a Sensor → Arduino → Matrix → Servo trace, paired bench photo/schematic, and separate CAD/cardboard build evidence. EchoVision synchronizes both photos from four component controls; unpictured/internal placements and cockpit-reference status remain explicit.
- Reph connects 10+ stakeholder interviews and field observations to the team concept. Honda is an incoming placement card, with no completed-results or methodology sections.
- Drawing search and category pills sit above the page header on phones. The three lock sheets form an ordered front plate / dial / deadbolt set linked to /misc#lock. Workshop links target the lock inspector, /misc#lego-rover, and /drawings.
- Marion limitation: resume confirms 5+ iterations and 3+ test types. Published report surveys tensile, torsional, compressive and flexural testing. Revision-by-revision decisions and separate BOM/assembly drawing files are absent; the sequence identifies those gaps and links the actual report, sketches and resume. No chronology or missing files were invented.
- Generated 31 WEBP previews: 12,643,700 original bytes → 1,267,900 preview bytes. Originals stay untouched; galleries fetch full resolution when opened. Native annotated figures, featured cards, Workshop, Now & About, drawing index and print summary use previews. Reports open on demand; no inline PDF objects remain.
- Verification: npm run build through installed context-mode ctx_execute, exit 0, zero errors; existing >500 kB warning remains. Sandbox cache cleanup required the already approved verification command outside the sandbox.
- Browser: all 11 routes at 390×844 and 1440×844, zero page/console errors, broken images, inline PDFs or horizontal overflow. Phone figure y positions: GearLab 374, NASA 341, EchoVision 533, Reph 491. All case controls, drawing counts/search, lock/LEGO anchors, contact adjacency and original-image loading passed. 23 unique asset links checked with successful non-HTML responses. Print PDF remains one Letter page with three figures.

# Fatigue rig hero, proof cards, titanium contrast, pinned gear hub - 2026-11-16

Verified with Playwright at 1440x900 and 390x844: zero console errors, zero horizontal overflow. `npm run build` exit 0.

- `FatigueRigHero.jsx`: SVG rotating beam rig (CSS animation only, classes `.rig-*` in index.css; base styles are the finished state, so reduced motion is "no animation"). `CalibrationRing` in the same file holds its place in the viewport while the page scrolls and lands on the gear's r 322 degree ring, then fades. It must render after the hero in the DOM: refs attach in tree order during the layout phase, so an earlier sibling measures before the rig's ref exists.
- Hero copy: statement headline, name in the subline, CTAs Selected Work / Resume (PDF) / Print Summary / Email. The facts list and the phone-only featured link list were removed; LinkedIn stays in the desktop header row.
- Featured cards lead with `proof` (experiences.js) and keep the status line.
- Gear hub: readout opens on GearLab. Hover or focus previews, click or tap pins (click again or Unpin clears), Enter and modified clicks open the case study. The gear is one tab stop; arrow keys step teeth. A reticle on the outer ring points at the current tooth. Phones get a Gear View / Project List switch.
- Teeth no longer navigate on a plain click. Routes are reached from the readout link, the list, the cards, or Enter.
- Honda and Marion have no artifact image, so their readout shows the logo, labelled as a logo.

# Landing: larger name, three-beat rig, synced trace - 2026-11-17

Checked with Playwright at 1440x900, 1024x768, 768x1024, 390x844, 320x568: zero console errors, zero horizontal overflow. `npm run build` exit 0.

- Name is `clamp(2.75rem, 5.2vw, 4.75rem)` on its own full-width row: one line from 768 up (44 / 53 / 75 px at 768 / 1024 / 1440), two lines on phones (40 px under 360 so "Subramanian" fits at 320). 24 px clear of the menu button and crest at every size.
- Sublines: "Mechanical Engineering Student at Ohio State", "Undergraduate Research". Intro and links sit directly under the name; the rig sits low in the right column so its ring clears the name.
- Rig beats (index.css, `--rig-spin`, `--rig-trace`): clamp at 0.2 s, rotation at 1.7 s, trace one full turn later at 4.1 s. The caption names each beat as it starts.
- The reflection is one generator of the specimen surface, scaled by cos(theta) about the shaft axis, hidden for the back half turn. The witness mark on it and the chart pen share that phase: measured equal on the front half. Top of the shaft is drawn as +sigma.
- Reduced motion: a still at 60 degrees past top with the chart full.
- CalibrationRing now hides between the hero and the dark section, so it never sits behind the Now & About text.
- The request text ended partway through section 1, item 3. Later sections were not received.

## Hero centering and portrait scale — 2026-11-17
- Hero name uses 36/48/52px responsive sizes, retains desktop single-line layout, and role reads Undergraduate Research at GearLab. RBF rig centered below compact header; animation and ring tracking unchanged.
- Now & About portrait is 224px mobile / 256px tablet / 288px desktop. Desktop image frame stretches exactly to heading + both paragraphs.
- Browser checks at 1440x900 and 390x844: rig horizontally centered at x720/x195; desktop rig center y448; desktop portrait bottom gap 0px. No page/console errors or horizontal overflow. Screenshots in ignored .tmp/hero-sizing-* and about-sizing-*.
- npm run build via context-mode exit 0, zero errors; existing bundle-size warning remains.

## Clean two-column landing hero — 2026-11-17
- Replaced absolute rig positioning with a balanced 12-column desktop grid inside max-w-6xl and an 82svh hero; mobile stacks naturally. Hero CTA row contains only Selected Work and Résumé; top-right header keeps Print Summary, LinkedIn and Email without a duplicate résumé link.
- Removed the shared outer CalibrationRing and numbered rig captions, extra labels and axis clutter. Preserved machined grips/specimen, one rotating reflection, stress trace +sigma/-sigma, and two understated specimen/load labels.
- Removed light-surface edge ruler pseudo-elements and reduced dot alpha to 0.025 on the existing #FAFBFD background. Single bottom cue reads SCROLL DOWN.
- Verified screenshots at 1440x900, 1024x768 and 390x844: zero column/rig overlap, no horizontal overflow, single-line desktop name, rig remains in its column and within the viewport. Reflection/trace animate; reduced-motion still works. Zero console/page errors.
- npm run build through context-mode passed with zero errors; existing bundle-size warning remains. Cache cleanup required the approved build verification command outside sandbox.

## Light hexagon weave and interrupted-edit check — 2026-11-17
- Inspected current working tree; initial context-mode production build passed. No broken imports or syntax errors surfaced in Home, GearHub or FatigueRigHero. Preserved the existing in-progress gear changes.
- Replaced shared light dots with a transparent 28x48 SVG hexagon/woven tile, slate #94A3B8 hairlines at 8% opacity and a faint white offset edge. Hero and Now & About inherit one viewport-aligned texture; existing scroll opacity removes it before the dark HUD.
- Browser at 1440x900 and 390x844: SVG decodes, About stays #FAFBFD, light texture fades to opacity 0 on the #05080F HUD, Inspect Gear toggles, no console/page errors or horizontal overflow. Screenshots .tmp/weave-hero-* and weave-about-*.
- Final npm run build via context-mode passed: zero errors; existing bundle-size warning remains.

## Precision instrument hero polish — 2026-11-17
- Added light RBF instrument stage with slate border, subtle shadow, 8px corner marks, RBF-200 ROTATING BEAM / R = -1 header, dashed specimen centerline, stronger engineering labels and 1.75px stress trace. Reflection/stress timing preserved.
- Added inline Class of 2028 / 14+ Fatigue Tests / Honda HPDC Co-op 27 credentials. Hero has an 88vh minimum and fills desktop viewport to keep About below the fold and the single scroll cue near the bottom.
- Navigation button and GS medallion now share a 56px size and 12px gap. BrandMark already fills its parent; drawer toggle/focus behavior preserved.
- Browser QA passed at 1440x900, 1024x768 and 390x844: zero overlap/overflow, single-line desktop name, instrument header/marks/trace, no desktop About peek, exact desktop portrait bottom alignment, working drawer, zero console/page errors. Light weave unchanged.
- npm run build through context-mode exit 0, zero errors; existing bundle-size warning remains. Screenshots in ignored .tmp/instrument-stage-*.png.

# Gear bore modes, ParkSense stop-arm views - 2026-11-17

Checked with Playwright at 1440x900 and 390x844: zero console errors, zero horizontal overflow. `npm run build` exit 0.

- GearHub `MODES`: Measure / Model / Build / Discover. On sm and up, a four-quadrant ring on the hub boss round the bore; on phones, a row of four 44 px buttons under the gear. Choosing a mode dims the other teeth, reads the first tooth of the mode, clears any pin, and shows a one-line connection in the readout. Choosing it again clears it. The ring hides while a tooth is hovered or pinned (the logo plate takes the hub) and while Inspect Gear is open.
- Deadbolt is not a tooth, so Model lights NASA and Marion and its line points to the Workshop drawings.
- `StopArmViews.jsx` on /project/parksense, after the annotated schematic: Linework (side view sweep 0/45/90 deg plus face view of the blade, labelled not to scale), Annotated CAD (stop-arm CAD with horn pocket, fastener holes, blade), Working Interpretation (slider; SG90 at 90 deg below 25 cm, 0 deg otherwise). The 0/90 two-state behaviour matches the distance demo on the page, not the 45 deg middle position in the report sketch.

# Bore modes and stop-arm views confirmed; full audit - 2026-11-17

- Confirmed both items from the previous pass were complete. Added: Model mode's readout line links "Deadbolt lock drawings" (/misc#lock), since the deadbolt has no tooth; `/summary` now redirects to `/print`.
- Audit, Playwright on the dev server, 11 routes x 1440x900 / 1024x768 / 390x844 / 320x568 (44 loads): zero console errors, zero 4xx responses, zero broken images, zero horizontal overflow. 58 unique asset URLs (images and PDFs) all served. All internal links resolve to real routes.
- Bore modes at all four widths: ring buttons 83 / 66 px (desktop, 1024), phone row 44 px tall. Each mode lights the right teeth and reads the first of them.
- Stop-arm views at all four widths: three tabs (44 px), CAD callouts select, arm at 0 deg for 26 and 25 cm, 90 deg at 24 cm.
- Drawer: focus moves in on open, Tab and Shift+Tab cycle the 14 drawer links plus the close button, Esc closes and returns focus to the button, page scroll locked. Lightbox (native modal dialog): focus starts inside, page behind is inert, Esc closes and returns focus to the thumbnail. Chrome's native dialog lets Tab pass once through the browser UI, which is outside the page.
- Reduced motion: rig has no animations, glints are display:none, Selected Work jumps instantly and focuses the hub heading, gear plane transitions are 0s, missing-echo demo shows its final state.

## Restored large two-column RBF hero — 2026-11-17
- Widened hero to max-w-7xl with 56px desktop padding. Name is bold 48/60/72px serif, explicitly stacked Gautham / Subramanian. Kept Undergraduate Research at GearLab. Restored Selected Work followed by Résumé (PDF), Print Summary, LinkedIn, Email; removed credential strip. Cue reads ABOUT ME.
- Removed instrument card/header/registration marks. Unboxed rig fills its right column up to 640px, with a local 360-degree ring (72 ticks, twelve numbered 30-degree marks), leaders, spindle/load callouts, stress trace and synchronized circular revolution tracker, plus numbered beat captions. Ring stays inside the rig SVG, avoiding left-column overlap.
- Tracker and trace share 2.4s duration / 4.1s delay; reduced-motion tracker rests at 60 degrees with the other still components. Geometric weave and Now & About unchanged.
- Browser checks at 1440x900 and 390x844: no text/ring overlap or horizontal overflow, two name lines, full restored labels/contact links, tracker marker inside its viewport, zero console/page errors. Desktop ring figure 560px; phone 342px. Screenshots .tmp/restored-hero-* and restored-full-hero-*.
- Context-mode npm run build passed with zero errors; existing bundle-size warning remains.

## Wider 5/7 RBF hero and action hierarchy — 2026-11-17
- Hero max width 1380px, desktop padding 48px, five-column typography/seven-column rig. Rig max width 740px aligned right; reduced SVG margin allows the larger circle and bottom cue to fit the desktop viewport. Two-line name and GearLab role retained; 1024px name uses 52px to fit its narrower column.
- Larger 14-unit slate callouts, crisper 30%-slate ring/ticks with non-scaling strokes, clearer degree numerals. Hover/focus subtly emphasizes specimen outline, stress trace and +sigma/-sigma labels; no persistent extra labels.
- Hero actions now only Selected Work and Résumé (PDF) beside each other. Print Summary, LinkedIn and Email remain in the header.
- Browser checks at 1440x900, 1280x900, 1024x768 and 390x844: zero text/ring overlap or overflow; desktop gap 48px; rig widths 729/671/521px, mobile 342px. Hover and focus highlights passed, zero console/page errors.
- Final context-mode build exit 0, zero errors; existing bundle-size warning remains. Screenshots .tmp/wide-rig-*.png.

# Pinned working models in the gear-hub readout - 2026-11-17

Verified with Playwright at 1440x900 and 390x844 (Gear and List views), keyboard only, and reduced motion. Zero console errors, zero horizontal overflow. `npm run build` exit 0.

- `PinnedLab.jsx`: `pinnedLabs = { nasa, gearlab, parksense }`. Telemetry renders the pinned tooth's model under the summary. Hovering another tooth previews it and makes the model invisible (not unmounted), so the model keeps its state and the card keeps its height. Unpinned teeth that have a model say "Pin this tooth to open its working model".
- NASA: rocker-bogie step climb. Rigid bogie and rocker solved from terrain-following wheel centres; step (14 cm) under this side only, so chassis pitch = half the rocker angle (differential). Slider (0 to 100 %), drag on the drawing, arrow keys. "View Source Drawing" swaps in `nasa/suspension-annotated.png` in the same frame. Labelled as derived from the PDR concept sketch: the source is the hand-drawn MCA side view, not NX CAD.
- GearLab: section with sigma / sigma_a = cos(theta) from the top; drag the marker anywhere on the section or use the slider; trace dot follows. "View S-N Plot" swaps in `gearlab/sn-figure.png`; link to `/project/gearlab#sn-plot` (new anchor on the walkthrough's chart).
- ParkSense: "Miss an Echo" plays two tracks (original pulseIn freezes ~1,000 ms and loses a short key press at 200 ms; bounded 30 ms timeout reads it). Simulated, from report times, played 2.2x slower; reduced motion shows the final frame. Link to `/project/parksense#timeout-demo`, which now opens the simulator in missed-echo mode.
- Gear column is top-aligned (`lg:self-start`): when it was centred against the readout, a changing card height moved the gear out from under the pointer and the hover flickered.
- Space on a focused tooth pins or unpins it (keyboard match for click). Enter still opens the case study.
- Fixed: first animation frame could give a negative clock and an invalid SVG width.

# Rig finish, jog wheel, laser scan, section-plane wipe - 2026-11-17

Verified with Playwright at 1440x900, 1024x768, 390x844, with and without reduced motion: zero console errors, zero horizontal overflow through the whole blend. `npm run build` exit 0.

- Rig finish: the specimen starts as 45 deg section hatching; one narrow light band crosses it (0.45 s to 1.35 s) while the collets seat, and the satin metal is clipped back to the band's centre (`.rig-finish`, `.rig-sheen`). Hero copy has no animations.
- Jog wheel: the degree ring is a focusable slider (role="slider"). Drag or click sets the angle (0 at top, clockwise); arrows step 5 deg, Shift x3, Home = 0. Manual mode (`.rig-manual`) stops the loops and drives reflection, witness mark, revolution dial, ring index, surface marks and trace pen from CSS variables. Measured: mark and pen heights equal at every tested angle; back half hides the mark. Replay remounts the SVG and replays all beats.
- Laser Profile Scan: the plot of r(x) is the specimen generator scaled under it; a paper cover rides on the laser group, so the line and the revealed plot cannot drift (two separate animations drifted by about 7 %). Labelled "Conceptual Measurement Illustration".
- Fixed in passing: the revolution dial rotated about (32,32) of its viewBox instead of its centre, so its dot left the dial; the rig caption overlay swallowed ring clicks across its lower arc.
- Phones: LinkedIn link beside Résumé in the hero (md:hidden; desktop has it in the header row).
- Section-plane wipe (`SurfaceLayers`, `WIPE = [0.3, 0.7]` in hud units): opaque light surface ahead of the plane, obsidian HUD behind, a 28 px hatched cut face with a cyan datum edge. Blend-zone drawing (gear outline + the three bridge icons) is drawn twice, graphite ahead and cyan behind, clipped at the same plane. Hero/About fade out by hud 0.3; hub fades in from 0.7 (HUB_VISIBLE 0.9). Reduced motion: no plane, the earlier crossfade.

## Attribution, Marion removals and front-in ParkSense - 2026-11-17
- OnRamp public organization/brief/objective now use Center for Innovation Strategies and OnRamp Student Innovation Program. Removed earlier public attribution. Confidential engagement remains excluded.
- Removed Marion Design iteration record panel and related unused constant. Preserved documented UTM research modes/report and removed requested launch-initiative/payload-work source copy.
- Audited 37 public PDFs plus public previews. No matching removals or affiliation corrections required in downloads; resume already has Center for Innovation Strategies. Confidential-name checks found zero public text/PDF matches.
- ParkSenseScene uses lightweight orthographic projection of 3D geometric forms rendered as SVG: shaded car, garage floor, wall sensor, headlights/front bumper toward sensor, distance line, servo barrier. This is an illustrative isometric model with fixed viewpoint. No WebGL dependency added.
- Browser checks at 1440/390/320px: nose-first motion, 150/61/60/25/24/10 cm states, barrier thresholds, keyboard, mode switching, reduced motion, no horizontal overflow or console errors. OnRamp/Marion copy checks passed. Build exit 0 with existing bundle-size warning; generated public output has no removed terms.

# ParkSense 3D garage - 2026-11-17

Verified with Playwright at 1440x900, 1024x768, 390x844, with and without reduced motion: zero console errors, zero horizontal overflow. `npm run build` exit 0. `ParkSenseGarage` is its own 22.5 kB chunk, fetched only on /project/parksense.

- `ParkSenseGarage.jsx`: dependency-free 3D-projected SVG. Perspective camera, back-face culling, near-plane clipping, painter's sort in layers (floor, wall, objects, near-side wheels when seen from the side or behind). Car parks nose first: grille and headlights face the wall sensor, headlight pools on the floor, taillights at the rear, painted floor arrow at the entrance, wheels turned by distance. Glass is half transparent so the Driver view sees through the windshield.
- Camera: Driver, Overhead, Sensor (a cutaway from behind the wall; the wall culls from behind), Reset View. Presets never touch distance, zone or arm. Drag to orbit (touch: horizontal drag, page still scrolls vertically), arrow keys on the focused scene, rotate and tilt buttons.
- Thresholds on this page (user-specified 2026-11-17): CLEAR > 120, CAUTION 70-120 (blue), WARNING 20-70 (green, arm 45), STOP < 20 (red, arm 90). The prototype report sketch uses 140 / 70 cm and the poster 120 / 70 cm with 90 deg at 70 cm; not reconciled. StopArmViews uses the same rule (45 from 70 cm, 90 below 20).
- MAX7219 bitmaps are the sketch's iconClear / iconWarn / iconStop, in single-colour red; blank above 120 cm.
- "Why did it stop?" pauses the scene and disables the distance slider; four steps highlight the sensor and dimension line, the threshold chain, the matrix and RGB LED, and the arm.
- In-scene Miss an Echo: 30 ms timeout keeps the keypad live; ~1 s blocking wait drops key presses for the first 1,000 ms. Reading shows unavailable for 1.4 s; outputs hold their last state (not simulated).
- Removed `ParkSenseScene.jsx` (old isometric scene). The step-by-step Miss an Echo mode is kept, and #timeout-demo still opens it.

# GearLab S-N inspector, NASA packaging review, EchoVision peel-away - 2026-11-17

Verified with Playwright at 1440x900 and 390x844, keyboard, and reduced motion: zero console errors, zero failed requests, zero overflow on /, gearlab, nasa, echovision, parksense. `npm run build` exit 0.

- `SnInspector.jsx` (GearLab #sn-plot): re-plots only the 8 tests the deck states in text (T1, T2, T4, T9, T11, T13, T14 failures; T12 runout at 10^7, asterisk on slide 15), with specimen IDs and slide numbers. The deck reports 14 tests; the other six exist only as chart markers and are not re-plotted. Fit from slide 17: sigma = 816.0 N^-0.078. Fixed log axes (10^3-10^8, 100-1000 MPa) whatever is shown; Failures / Runouts / Fit layers; "Source chart - slide 17" swaps in sn-figure.png. Selecting a point draws guides to both axes and colours the specimen waist (red failure, cyan runout); a x2.6 lens shows the waist outer fibres. Arrow keys step points in cycle order; T-buttons mirror the points. Hero rig links here ("Stress → S–N data").
- `RoverPackaging.jsx` (NASA, top of NasaSubsystems): side view traced from the MCA sketch (front left, 1.5 m x 1.8 m envelope; inner proportions approximate), isolate Suspension / Sampling Arm / Chassis / Top-Mounted Equipment / All. Source switch in the same frame: Shovel Arm NX.png for the arm, MCA schematic.png otherwise. Reach: links 1201.1 + 843.7 mm from the NX drawing; mounting point and joint limits not documented, so the envelope is an annulus about the shoulder (357.4-2044.8 mm), with shoulder/elbow sliders. LiDAR deliberately not placed (not in the sketch).
- `EchoVisionPeel.jsx` (EchoVision, top of EchoVisionPackaging): one peel slider over both photos. Enclosure: lens solid (visible); board, speaker, wiring dashed amber (inferred); battery labelled "not placed" (position undocumented). Bench wiring photo: only visible parts, solid. "Trace alert path": camera → ESP32-CAM (TinyML) → speaker. Cockpit photo stays in its reference-only disclosure.


## Weighted CAD section-plane transition — 2026-11-17
- Home transition now uses a 230svh runway with a sticky full-viewport stage (130svh of pinned travel). Cubic-bezier interpolation allocates most travel to the cut, and a damped spring drives one shared HUD/wipe value for the surfaces and artwork. Native wheel/touch scrolling remains unchanged.
- Replaced the sedan with a low Roadster-inspired supercar profile: swept canopy, rear haunch, front splitter, multi-spoke wheels and rear diffuser. Car and rocket have layered vector plumes; ignition uses each icon's measured viewport position relative to the plane. Forward scroll velocity boosts length/intensity; flicker is a function of scroll progress, with no idle loop. Palette is amber/gold ahead of the plane and cyan/white behind it.
- Added native SVG shoulder, elbow, wrist and gripper pivots. Wheel, flame and joint transforms bind directly to MotionValues through SVG attributes: Motion 14 otherwise interpreted SVG pivot strings as CSS and dropped them. Subscriptions clean up on unmount; no per-frame React renders.
- Reduced motion bypasses damping and moving cut copies: extended arm and ignited plumes hold a static composed state. Colour remains readable across the existing reduced-motion light/dark fade.
- Browser verification: 22 sampled normal-motion frames at 1440x900 and 390x844. Sticky stage stays pinned, plane moves monotonically, plume scale/opacity and all joints/jaws change, transformed leaf geometry stays inside SVG bounds, zero overflow or console/page errors. Midpoint and endpoint motion settle when scrolling stops. Both reduced-motion viewport checks show static arm/lit plumes and zero running animations.
- Selected Work still reaches the dark hub and focuses its heading; direct About link remains light. Context-mode production build passes with zero errors; existing >500 kB bundle warning remains.
- QA artifacts in ignored .tmp/: qa-transition-independent.json, qa-transition-independent.mjs, transition-*-mid/end.png, transition-{width}-{progress}.png, qa-transition-links.mjs.

## Skills map: program emblems + connection map - 2026-11-17
- `SkillsProof.jsx` rewritten per docs/skills-map-handoff.md: 14 programs in 4 rows (CAD & Mechanical Design / Test, DAQ & Simulation / Embedded & Controls / Software & Prototyping), each with an original 32px line emblem (`ToolMark.jsx`), project rail on the right, one evidence readout. Data in `src/data/skillEvidence.js` (9 evidence edges).
- One `selection` (click/tap/keyboard, aria-pressed, repeat clears) plus a mouse-only `hover` preview; touch never sets hover. Focused stack lit cyan/satin white, rest `opacity-30 grayscale`. Edges: curved SVG drawn above tiles, entering each tile on the side facing the project; measured from button rects in a ResizeObserver (Δ0 px after 1440→1100 resize); hidden below lg; reduced motion skips the path draw.
- No project edges: MATLAB, Java, Fusion 360, Onshape (`Résumé skill`); Python, EES (`Listed skill`, not on the résumé PDF); React & Tailwind (`This site`); Bambu Studio (`Personal fabrication · records not published`).
- `Connection Map | Evidence Ledger` toggle; ledger filters to the current selection.
- Verified 1440x900 + 390x844 (reduced motion on mobile): touch tap = pinned selection, phone order projects → evidence → programs, keyboard Enter/Space, no overflow, all 14 evidence asset URLs 200, zero console errors. Context-mode build exit 0 (existing >500 kB warning).

## Skills map visual polish - 2026-11-17
- `ToolMark.jsx` is asset-backed: 11 product marks in `public/assets/tool-logos/` (devicon MIT: Fusion, LabVIEW, MATLAB, Arduino, C++, Python, Java, React, Tailwind; simple-icons CC0: Espressif mark under the ESP32-CAM label; BambuStudio repo: app icon). Sources in `tool-logos/SOURCES.md`. Per-logo optical scale in a 40 px box; 20/24 px for chips/ledger.
- Text wordmarks (no verified artwork in repo): Siemens NX, SOLIDWORKS, Onshape, EES. Commons has public-domain SOLIDWORKS and Onshape SVGs; download was blocked this session.
- React and Tailwind CSS are separate entries; `C / C++` → `C++`. Unlinked tools carry a factual `context` line about the software, never a claimed use.
- Borderless logo+label buttons, 13/14 px sans labels; dimming hits logos only (opacity 45, desaturated), labels stay ti-400+. Cyan only on selection, focus, connectors. Tool counts removed. Local masked obsidian surface quiets the hex pattern behind the section only.
- Connectors are orthogonal traces through the gutter and row gaps (0 crossings of labels/logos measured at 1440 and 1024). Unlinked tool keeps the project rail neutral. Pinned selection ignores hover; hover previews only when nothing is pinned.
- Verified 1440/1024/390: zero console errors or failed requests, all logos load, no overflow, tap = pin, ledger toggle round-trip. Context-mode build exit 0 (existing >500 kB warning).

## Skills map tool updates (user-confirmed) - 2026-11-17
- Python removed: data entry, ToolMark logo, `tool-logos/python.svg`, SOURCES row. No "python" in src, public or dist.
- Siemens NX: amber `Currently pursuing Siemens NX certification` status in the readout and ledger (amber, not cyan, so it is never read as a selection or a finished credential).
- New edges (`Project scope` unless noted): Onshape → ParkSense, GearLab; Bambu Studio / 3D Printing → EchoVision (enclosure photo), ParkSense, GearLab. Evidence `original` is now optional; links render only when a file exists.
- Unlinked context: EES (ME 3501), MATLAB (ME 2850.01) = `Coursework`; Fusion 360 (HS LEGO Mindstorms housings), Java (AP CSA, HackOHI/O) = `Prior experience`. Résumé link only for tools on the résumé (MATLAB, Fusion 360, Java). Project rail stays neutral.
- docs/skills-map-handoff.md: relationship table, claim limits and acceptance check updated.
- Verified 1440x900 + 390x844, map and ledger: zero console errors/failed requests, no overflow. Context-mode build exit 0.

## Visual subtraction pass (items 1-15) - 2026-11-17
- Surfaces: dark micro-hex .065 -> .022, light hex .08 -> .05, HUD grid halved, gear-hub hex .16 -> .08. New `.reading-surface` (plain #070B12 plate, feathered edges; token `--color-reading`) on Skills, From the Workshop, and every ProjectLayout page (all project pages, /misc, /drawings).
- Boxes removed from static content: featured cards, workshop strip cards, drawing cards (badges now one `·` line), drawing search wrapper, spec strip hairline grid, trade-off callout (left rule only), PDF artifact box, Honda placement box, project logo plate border. Borders kept on real controls (filters, toggles, simulator/inspector frames, prev/next).
- Text: 78 `text-readout/NN` -> ti-300, 27 cyan label tints `text-hud/NN` -> ti-400 (cyan now selection, links, connectors, data marks). Mono 10-12px notes -> 14px sans; remaining 10px mono callouts -> 11px. Hero caption 7-8px -> 9-11px. Simulator upcoming steps no longer opacity-40. Skills dimmed labels ti-300, dimmed logos opacity-60.
- Decorative numbering removed: "02 — Experience index", project block numbers, anchor-chip numbers, project "01 / 07" counter. Real sequences kept (rig beats, simulator steps, lock sheets "Sheet n of 3").
- Copy: duplicate skills helper paragraph -> "Nothing selected."; gear hint shortened.
- Motion: hero rig CSS loops pause offscreen (`.rig-offscreen`), gear rings moved to CSS `.ring-spin` and pause offscreen / reduced motion, ParkSense garage rAF clock stops offscreen.
- Verified 1440x900 + 390x844 on 10 routes: zero console errors, zero failed requests, zero overflow. Context-mode build exit 0 (existing >500 kB warning).

## Subtraction pass, part 2 (items 16-80) - 2026-11-17
- Home: hero keeps name, two lines, Selected Work + Résumé, rig, one "About" cue. Desktop quick-link header and phone LinkedIn removed (both in the drawer). Rig part names and degree numbers hidden below 640px (`.rig-minor`); beat captions hidden on phones. Transition runway 230svh -> 170svh. Headings: Selected Work, Skills (#skills), Workshop (#workshop), About. Crest watermark and "Experience index" kicker removed; /#skills and /#workshop load dark.
- Featured cards: same 4:3 frame (light matte for drawings, cover for photos), title + status, contribution sentence, one link. `proof` stats dropped so nothing repeats the gear telemetry.
- Case studies: ProjectLayout opens with My contribution -> Result -> Team scope (new `contribution`/`result`/`team` in projectDetails.js), then the artifact, then one facts line (Role/Tools/Domain/Timeline). Unused `brief`, `objective`, mobile spec strip and Honda status box removed. Honda page = incoming Spring 2027 co-op, Jan – May 2027, no artifact.
- ParkSense build pack: one compact list with "Open PDF/image" per row (no badges); duplicate Documents block removed. Document rows say "Open PDF".
- Controls: shared `control()` in src/lib/controls.js for toggles/buttons in ParkSense, PinnedLab, Rover, S-N, EchoVision peel, gallery, drawings filters; sliders share accent + focus ring in CSS. Base focus rule moved into `@layer base` so cyan focus utilities apply.
- Drawing Library: search/filters under the header; cards show Component, Material / Units, Linked project, one "Open original" link; deadbolt set = "Sheet n of 3".
- Workshop: compact rows (one thumbnail, one decision, one link); home strip quieter (smaller type, no image link).
- Drawer: Work, Skills, Drawings, About, Résumé, Contact; Projects sub-list (7 + Workshop, Honda tagged "Incoming 2027"); aria-current active rule; inset cyan focus ring. LinkedIn and Print summary at the foot.
- Gear hub: removed gear-spec line, "02 / 07" counter, list numbers; list links get a focus ring (was outline-none).
- Verified 13 routes (incl. /#skills, /#about) at 1440x900 and 390x844 after lazy-load scroll: zero console errors, zero 4xx/failed requests, zero broken images, zero overflow. Drawer hash links land on #skills and #gear-hub. Context-mode build exit 0 (existing >500 kB warning).

## MATLAB -> GearLab - 2026-11-17
- User-confirmed: MATLAB builds the S-N curve from RBF data. New edge `matlab-gearlab` (S-N chart preview, fatigue presentation PDF, link /project/gearlab#sn-plot). MATLAB no longer a coursework-only tool; handoff doc updated. Verified 1440 + 390: readout, 1 desktop connector, GearLab lists LabVIEW / MATLAB / Onshape / Bambu, zero console errors. Build exit 0.

## ME2900 Air Motor — Machining (Workshop subpage) - 2026-11-19
- Route `/workshop/air-motor` (explicit sibling of `/misc`; not in `experiences`, GearHub untouched). Static share metadata + Vercel rewrite; share card `/assets/share/air-motor.jpg`.
- Assets: `scripts/prepare-machine-shop.py` (Pillow + pillow-heif) decodes the six HEICs, applies EXIF orientation, strips EXIF, keeps ICC → `public/assets/machine-shop-me2900/{IMG_xxxx.jpg full-res, inspector/*.webp 1600px, previews/*.webp 640px}`. HEIC sources untouched.
- `src/data/machineShop.js`: page record (status, contribution, `video: null`), four geometric part labels, two inspector views with manifest anchors, four gallery photos.
- `MachineShopInspector.jsx`: Front overview (IMG_8644) / Bore-side view (IMG_8647) toggle, four 44px native-button markers on an exact-aspect box, 01–04 selector (aria-pressed, arrow keys), one readout, geometry disclaimer, full-image lightbox (exported `Lightbox` from MediaGallery). Selected part persists across views.
- `ProjectLayout`: optional `status` row (amber) and `back` link; prev/next footer only for pages in the walk order.
- Entry points: `/misc` first entry (`#air-motor`); home Workshop strip replaces the Standalone drawings card (still three cards; drawings stay in the drawer).
- Verified 1440x900 + 390x844: markers at manifest anchors on the rendered image (both views), keyboard selection, lightbox open/Esc, gallery 4 cards + lightbox, zero console errors, zero failed/4xx requests, zero overflow, no <video>. Context-mode build exit 0 (existing >500 kB warning).

## Gear navigation, demo relocation, landscape media, Classwork rail - 2026-11-19
- GearHub: teeth are plain `<Link>`s (no preventDefault); touch never previews, so the first tap navigates. Pin state, PINNED/Preview badges, pin hints, "Active tooth telemetry", Measure/Model/Build/Discover modes and homepage-mounted labs removed. Fixed-height (184 px) readout opens on "Select a project", then keeps the last tooth read. Arrow keys + Enter, dashed white :focus-visible tooth ring, Inspect Gear made quiet.
- PinnedLab.jsx deleted. BeamSection.jsx → GearLab (`#section-stress`, after `#sn-plot`, no S-N image). RockerBogie.jsx → NASA RoverPackaging right column when Suspension is isolated (Reach otherwise). Both labelled conceptual, cm/° units, Reset. ParkSense 30 ms simulator unchanged (canonical); EchoSplit dropped as a duplicate.
- EchoVision: EchoVisionPeel.jsx deleted; EchoVisionPackaging is one inspector ("Enclosure & bench electronics"): two upright 16:10 derivatives (`scripts/prepare-echovision-landscape.py`, enclosure 90° CCW, bench 90° CW, padded not cropped), one Camera/Controller/Speaker/Power selector, one panel, Show annotations, Trace alert path. Battery box and inferred wire routes removed; cockpit stays reference-only.
- ME2900: all six photos match IMG_8644 (8646/8647 90° CW, 8648 180°, 8643 background-only 3:4 crop). Manifest anchors/dimensions updated.
- Skills: rail header "Experience"; hidden Classwork entry under LEGO Mars Rover for EES / MATLAB / Fusion 360 / Java (MATLAB defaults to Classwork, GearLab edge kept second).
- Verified 1440x900 + 390x844 (touch): 7/7 teeth first click/tap, Back restores scroll, Ctrl-click new tab, Arrow+Enter; demos + reduced motion; EchoVision frames 1.6 ratio, tags inside image; ME2900 portrait set + marker alignment; Classwork reveal/hide + connector. 12-route sweep: zero console/4xx/overflow/broken images. Context-mode build exit 0.
