# ME2900 Air Motor — machining portfolio handoff

Prepared 2026-11-19. Read alongside `docs/me2900-review/asset-manifest.json` and the interactive annotated review in `docs/me2900-review/index.html`.

## Recommendation

Create **ME2900 Air Motor — Machining** as a dedicated Workshop detail page at `/workshop/air-motor`, reached through one compact entry in `/misc`. Keep the existing seven-tooth GearHub intact. The page should emphasize fabricated hardware and machining experience, with an annotated component inspector as its lead artifact.

Current status: **Components fabricated; assembly and run video pending.** The user confirmed these are their air motor components and that they will add a video after assembly. Do not describe the motor as assembled, operational, tested, or performance-validated yet.

This is a substantive manufacturing entry, but it does not need another homepage section, gear tooth, animated transition, or top-level navigation destination. Optional homepage placement: replace the existing standalone-drawings Workshop card with this entry, maintaining three cards. Drawings already has navigation access. Preserve the other two Workshop cards.

Keep ParkSense separate: it is another ME2900 project, not proof that these metal components belong to its enclosure.

## What was inspected

Six original files in `Assets/Machine Shop ME2900 stuff/`. All are HEIC, approximately 1.8–2.2 MB each. They show four distinct visible component forms, photographed from different faces and arrangements. The circular feature within the square plate should not be counted as a fifth component without confirmation that it is a separate insert.

All six were decoded and visually reviewed. Browser-friendly review JPEGs and small WEBP previews live under `docs/me2900-review/images/`; these are review assets, not files published by the website. The application and `public/` were not changed for this handoff.

| Source | Orientation after EXIF | What it contributes | Publication treatment |
| --- | --- | --- | --- |
| `IMG_8643.HEIC` | 4032 × 3024 landscape | Front lettering, cylindrical surface, square plate and flat link; lower engraved block edge is cropped | Alternate view only; do not lead with a cropped part |
| `IMG_8644.HEIC` | 3024 × 4032 portrait | Cleanest complete front overview of all four parts; lettering readable | Lead image / front inspector view |
| `IMG_8645.HEIC` | 3024 × 4032 portrait | Large block bore, visibly threaded openings, opposite square-plate face and slot | Reverse detail view |
| `IMG_8646.HEIC` | 4032 × 3024 landscape | Plain block face, square-plate annular feature, cylindrical slot and two-hole link | Reserve image; include in full lightbox but omit from initial thumbnail row |
| `IMG_8647.HEIC` | 4032 × 3024 landscape | Large bore in block, square plate, slotted part and link laid out with little overlap | Secondary image / bore-side inspector view |
| `IMG_8648.HEIC` | 3024 × 4032 portrait | Overlapping layout with cylindrical part visually aligned with the large bore | Optional close-up; this arrangement does not establish an assembled or fitted state |

The lead photo's engraved `2026` is visible. Do not infer a semester or exact completion date from it.

## Evidence and course context

**User confirmed:** this is their air motor component set; they used mills, lathes, files, and CNC in the class; assembly video is planned.

**Photographs establish:** finished metal component geometry, engraved lettering with color fill, cylindrical surfaces, hole patterns, visible threads, a slot, circular recess/bore features, and surface marks. They do not document machine setups, setup ownership, measurement results, tolerances achieved, or an operating motor.

**Official course context:** Ohio State lists MECHENG 2900 as *Introduction to Design in Mechanical Engineering*, 3 credits, covering a structured design/build/test sequence and fabrication of apparatus across mechanical engineering. Source: https://mae.osu.edu/courses, MECHENG 2900 entry, accessed 2026-11-19.

A public term-specific syllabus was not located. Do not present a generic machining-topic list as that syllabus or as the user's completed lab record. The catalog supports course context; user confirmation supports the stated tool experience. Do not add welding, casting, grinding, laser cutting, CAM programming, or metrology tool proficiency just because these are common in a machine shop.

## Component labels and readout copy

These are descriptive labels suitable for publication now. Functional names such as cylinder body, cylinder head, piston/clevis, or connecting rod remain candidates until the user or course drawing confirms them. Air motor identity is confirmed; the job of every individual part is not.

| Inspector ID | Display name | Features to label | Safe description |
| --- | --- | --- | --- |
| `block` / 1 | Engraved rectangular block | Lettered front face; large reverse-side bore; visible threaded openings; other small holes; machined faces | “Machined air motor component with a personalized engraved face and a large bore visible on the opposite side.” |
| `plate` / 2 | Square machined plate | Central opening; four-hole pattern; circular recess/annular feature on one face; recessed hole entrances on the other | “Square air motor component showing the central opening, surrounding hole pattern, and face-specific recesses.” |
| `cylinder` / 3 | Slotted cylindrical part | Cylindrical outside surface; slot/paired flats; cross-hole | “Air motor component combining cylindrical and slotted geometry.” |
| `link` / 4 | Two-hole flat link | Two end holes; rounded ends; long flat edges | “Narrow machined air motor component with a hole at each rounded end.” |

Do not identify brass or aluminum alloys from the photographs. Color and appearance are insufficient. Do not claim the block is a base plate: its depth and reverse-side bore warrant a neutral label until its function is established. Do not label every widened hole entrance a countersink/counterbore without the drawing or close inspection. Do not label a specific hole as an air inlet/exhaust, bearing seat, or pivot until confirmed.

The supplied manifest contains normalized `(x, y)` anchors for all four components in all six photographs. Coordinates are fractions of the **EXIF-oriented, uncropped full image**, with top-left `(0,0)` and bottom-right `(1,1)`. Numbered markers correspond to the table above. Check final placement at the selected production resolution; adjust when applying any crop or rotation.

## Page content and hierarchy

1. Title: **ME2900 Air Motor — Machining**.
2. Context line: **Ohio State · MECHENG 2900 · Coursework**.
3. Contribution: “Fabricated air motor components using mills, lathes, hand files, and CNC equipment.” This is based on the user's confirmation, not proof that every operation was used on each part.
4. Status: **Components fabricated; assembly and run video pending**.
5. Lead inspector: front overview with four small numbered markers, the component selector, and one selected-part readout. Default to the full front view with no expanded detail panel, or the block selected with one short paragraph; avoid an empty frame.
6. Short methods section: four simple rows for milling, turning, hand finishing, and CNC. Identify this as coursework experience. Photo features illustrate geometry; do not pretend they reveal the exact process plan.
7. Evidence gallery: front overview, bore-side view, reverse details initially; the other three available through the full gallery. Captions distinguish faces and arrangements, not “iterations.”
8. Related work: one quiet link to ParkSense, labeled another ME2900 project. No duplicate project pitch.

No invented outcome metrics. A concrete current result is the photographed component set. Do not fabricate dimensional compliance, rpm, torque, efficiency, operating pressure, fit quality, cycle time, grades, or number of setups.

## Inspector behavior

- Exactly one photo, selected component, and selected readout at a time.
- Desktop: large photograph on the left, four component buttons and concise readout on the right. Retain the full photo aspect ratio and use `object-contain`. Four small numbered markers are enough; keep full text outside the photograph.
- Mobile: photo, wrapping component selector, readout. Keep marker targets about 44px. The number maps to the visible component list, so color is not the only cue.
- View buttons: Front overview, Bore-side view, Reverse details. “More photos” can expose the remaining views without building another filter system.
- Keep selected part stable when switching photos. Use that photo's own normalized anchor map. Switching to a close-up must not retain coordinates from another view.
- Markers are native buttons with accessible names; component buttons use `aria-pressed`. Tab/Enter/Space work. Do not make the entire photo clickable behind the markers.
- No hover-only labels. A pinned component stays selected while the pointer moves to links.
- When selecting a component, optionally show a restrained outline/crop for that real component. Avoid a fabricated 3D model, X-ray, simulated internal airflow, or exploded assembly without an actual drawing/model.
- Optional feature mode: show only the selected part's 2–4 feature labels, not every feature on all components at once. Use externally placed callouts or an ordered feature list if photo space is tight.
- Full-image lightbox: reuse existing gallery behavior, previous/next, Escape, visible zoom controls, captions, and original-image link. Separate part selection from photo navigation.
- Reduced motion: no autonomous motion; state changes are immediate or short color transitions. No glowing or pulsing markers.

The included `docs/me2900-review/index.html` demonstrates the actual marker/part/photo mapping. It is a review tool, not code to embed wholesale in the React site.

Review validation: Playwright/Chrome checked all six views at 1440px, 1024px, 390px, and 320px. Four marker target boxes remain separate in every view; no horizontal overflow or broken images. Component selection, persistence across photo changes, and keyboard activation pass with no page/request errors. This validates the standalone review only; the production route has not been implemented or built in this task.

## Visual direction

Reuse the current subtraction-pass design: plain reading surface, quiet obsidian, titanium text, cyan on selection. Preserve the real warm workbench and metallic surfaces in the photographs. These are the focal point; do not add a heavy hex pattern behind them.

Use existing Geist text, Source Serif display where appropriate, and JetBrains Mono only for short technical labels. Product copy stays readable at 14–16px. No tiny telemetry dashboards, ornamental calibration rings, schematic backgrounds, neon borders around every image, fake machine brand logos, or giant toolbox icon grid.

## Asset preparation and publication

1. Preserve original HEIC files under `Assets/Machine Shop ME2900 stuff/`. Do not move or delete them.
2. Convert with an actual HEIC decoder, applying EXIF orientation. Do not rename `.HEIC` to `.jpg`.
3. Production location: `public/assets/machine-shop-me2900/`, referenced as `/assets/machine-shop-me2900/...`.
4. Generate three levels: ~400–640px WEBP card thumbnails; ~1400–1800px WEBP inspector images; full-resolution oriented JPEG originals opened only on demand. Preserve original aspect ratios and geometry. Avoid enlarging a derivative and calling it original resolution.
5. Remove location/device EXIF metadata from published derivatives. Preserve a private source mapping. No AI reconstruction or replacement of the user's actual parts.
6. Add production preview mappings to `src/data/media.js` or the machine-shop data module as appropriate. Avoid making unrelated galleries load the full originals.
7. Do not preload six full images. Load the active inspector view, small thumbnails, and at most the next intended view if justified. Reserve dimensions to prevent layout jumps.
8. Gallery can retain all six photos, but the first page view should show one hero and three small view choices.
9. Review assets under `docs/me2900-review/images/` are 1400px JPEGs and 400px WEBPs for review; they are not full-resolution production originals. The manifest records both source dimensions and proposed public names.

## Future assembly video

Define an optional video record in the data model, initially `null`. Render **no player, empty video box, broken source, or fake play button** while absent. The status sentence is enough.

When an actual recording arrives: add a compact `Assembly & run` section below the inspector, a real poster frame, native controls, `preload="none"`, `playsInline`, no autoplay, and captions/transcript describing what happens. Identify assembly footage versus powered operation accurately. Change status to assembled/tested only when the supplied evidence supports it. A video alone does not establish a measured rpm, pressure, torque, or endurance result.

## Repository implementation map

- New `src/data/machineShop.js`: title, course, status, contribution, confirmed process list, four component records, photos/anchors, optional video. Transcribe and adapt `asset-manifest.json`; do not parse docs dynamically in production.
- New `src/components/MachineShopInspector.jsx`: small controlled component with selectedPhotoId/selectedPartId; responsive photo markers and readout. No graph, 3D, or image-editing dependency is necessary.
- New `src/pages/AirMotorPage.jsx`: use `ProjectLayout.jsx`, existing reading surface and back-to-Workshop link. Inspect current layout API; standalone Workshop subpages need their own correct back/next behavior rather than accidentally inheriting an unrelated experience.
- `src/main.jsx`: add the explicit `/workshop/air-motor` route as a sibling of `/misc`. Do not add an entry to `experiences` just to generate a route: that array drives the GearHub teeth and other project iteration.
- `src/pages/WorkshopIndex.jsx`: add one compact entry with a real front overview thumbnail and `Inspect the machined parts` link. Existing deadbolt/rover entries stay distinct.
- `src/components/WorkshopStrip.jsx`: optional replacement of the standalone-drawings card, keeping three cards. No new homepage section. This can be phase two if avoiding unrelated changes.
- `src/data/routeMetadata.js`: add title/description and an appropriate real-image share preview for the new route. Reuse existing SPA rewrite behavior; verify direct-route reload on preview deployment.
- `src/data/skillEvidence.js`: optional one `Machining & CNC` practice entry, grouped under fabrication, linking to the air motor page with front photo proof and four confirmed process names. Use a descriptive practice icon, not a fake software brand logo. Do not expand a gear tooth or invent software associations.
- Update `PLAN.md`/`PROGRESS.md` only after implementation and verification. This handoff does not mark that work complete.

Example metadata description: “Machined air motor components from Ohio State MECHENG 2900: milling, turning, hand finishing, and CNC coursework. Annotated photos; assembly pending.”

## Acceptance checks for the implementing agent

- All four components have names, feature descriptions, photo anchors and a stable selected state. All six photos are reachable; default presentation stays curated.
- Pin positions line up on the exact image rectangle at 1440×900, 1024×768 and 390×844. Do not measure a letterboxed wrapper instead of the rendered image.
- Native keyboard controls, readable focus rings, no hover-only information, no mobile horizontal overflow or clipped part names.
- Missing-image handling is clear; every published image request returns successfully. Check that links use public filenames, not Windows/source paths.
- No HEIC is used directly as an `<img>` source. Full-resolution originals are deferred until requested.
- Status, filenames, captions, materials and metrics contain no unsupported claims. Unknown material is omitted or “Not specified.”
- No gear geometry, existing experience count, hero animation, or unrelated navigation behavior changed.
- Run `npm run build` through context-mode; inspect the route and Workshop link in Playwright/Chrome. Check console/network errors, reduced motion, back navigation, full-image lightbox and direct-route refresh.
- No deployment or Git push is performed merely because this handoff mentions publication. Complete a reviewable local change first.

## Prompt for Gemini: design direction

Design a restrained photo-first Workshop detail page for Gautham Subramanian's mechanical engineering portfolio. Project: “ME2900 Air Motor — Machining.” Status: “Components fabricated; assembly and run video pending.” Use the six actual photos and the four-component manifest in `docs/me2900-review/asset-manifest.json`. Read `docs/me2900-machine-shop-handoff.md` first. Match the existing obsidian/titanium/cyan identity and the site's recent clutter reduction.

Produce desktop and phone layouts for one annotated photo inspector, four component selectors, one concise readout, three view choices, and a short fabrication-methods section. Default image is IMG_8644; alternate bore-side view is IMG_8647. Show numbered markers for engraved rectangular block, square machined plate, slotted cylindrical part, and two-hole flat link. Functional names/materials remain unconfirmed. Keep labels outside the image; preserve the photographed geometry and aspect ratios. Do not generate substitute parts, fake dimensions, an exploded assembly, air-flow animation, performance figures, or a video player before a recording exists. Use one compact Workshop index entry; no additional gear tooth, homepage section, or top-level navigation. Return spacing/type/color decisions, mobile ordering, selection states, and an annotated wireframe that Opus can implement with existing components.

## Prompt for Opus: implementation

Implement the reviewed air-motor Workshop page using `docs/me2900-machine-shop-handoff.md`, `docs/me2900-review/asset-manifest.json`, and the six original HEIC photos in `Assets/Machine Shop ME2900 stuff/`. Inspect AGENTS.md, PLAN.md, PROGRESS.md, ProjectLayout.jsx, WorkshopIndex.jsx, WorkshopStrip.jsx, main.jsx, media.js, routeMetadata.js, and skillEvidence.js first. Preserve the existing hero, GearHub and its seven experiences, scroll transition, and unrelated pages.

Create `/workshop/air-motor` with the shared ProjectLayout shell, an accessible four-part / six-view photo inspector, a short user-confirmed process list, and accurate pending-assembly status. Add one Workshop entry. Keep the first presentation to one photograph and three view choices; make the other views available through the gallery. Use the supplied normalized anchors on the actual uncropped, oriented image; preserve selected part when switching photos. Prepare browser-compatible thumbnail/inspector/full-resolution files under public/assets/machine-shop-me2900 without deleting source HEICs. Reuse existing lightbox, controls, typography, and quiet reading surfaces. Add route metadata. Keep video data null and omit the player until a real recording arrives. Add one fabrication skill connection only if it fits the existing data model cleanly; do not invent software/tool/material/performance claims. Current names are geometric descriptions, not verified functional identities. Build through context-mode, browser-check desktop and mobile, and report changed files, evidence limits, validation results, and any remaining confirmation needed. Do not push or deploy.
