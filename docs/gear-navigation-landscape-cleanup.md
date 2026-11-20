# Gear navigation, project interactions, and landscape media

Review date: 2026-11-19. Based on the two supplied screenshots and current source inspection. This is a Gemini/Opus handoff; no live component or image edits were made.

## Decisions

1. A tooth is a project link. A normal click, tap, or Enter opens its case study immediately.
2. The homepage gear previews project identity only. Project experiments and simulations live on their project pages.
3. EchoVision has one coherent inspector, with properly oriented landscape photographs, rather than two stacked inspectors repeating the same media.
4. Preserve the seven-tooth mechanical geometry, existing project routes, verified content, original photographs and current design language.

## Why the gear currently behaves this way

`GearHub.jsx` renders each Tooth as a React Router Link to `item.path`. That part is already correct. The Link calls `onPress`, and GearHub's `press` handler deliberately calls `event.preventDefault()` for an ordinary primary-pointer activation, sets `pinned`, and updates `reading`. Keyboard Enter and modified clicks bypass that interception and navigate normally.

`Telemetry` then obtains `pinnedLabs[pinned]` and mounts it beneath the summary. The registry in `PinnedLab.jsx` contains NASA's RockerBogie, GearLab's BeamSection, and ParkSense's EchoSplit. This is an inline panel expansion, not a modal. Removing a dialog style or changing a z-index will not fix the interaction.

Implementation requirements:

- Stop intercepting tooth Link activation. Remove the pin-specific click callback from the Tooth/GearSvg call chain if it becomes unused. Do not replace the Link with a div or a button calling window.location.
- Remove pin/unpin behavior, `pinned` state, pin hints, pin badges, unpin actions, and homepage model mounting. Trace `active`, `current`, `reading`, modes, and roving keyboard focus before simplifying dependent expressions.
- Keep a small hover/focus identity preview if useful: name, project logo, one contribution sentence. It must not resize the layout, start a project simulation, require a second click, or obstruct navigation.
- Preserve arrow-key stepping around the seven teeth and a visible focus indication. Enter opens the project. Remove Space-to-pin behavior; do not hijack ordinary link keyboard behavior unless a clearly documented accessible alternative is required.
- Keep native modified-click/new-tab behavior and real hrefs. Touch taps must navigate on the first tap; hover must not become a required first step.
- The text list and gear must use the same route targets. Prefer one clear hint, “Select a project,” over device-specific instructions explaining a nonstandard interaction.
- Keep Inspect Gear independent if retained. It must never intercept a tooth's navigation or become mandatory to reach a project. Reducing this optional feature's visual weight is preferable to expanding it.
- Default project navigation should open the case-study beginning. Keep intentional deep links from explicit “View S–N plot”/“Try timeout demo” actions separate.
- Returning to the homepage should restore a reasonable gear-section position. Test history/back behavior before adding custom scroll storage; avoid duplicate scroll restoration systems.

## Relocate useful experiments without duplicating them

| Homepage model | Existing destination content | Recommended action |
| --- | --- | --- |
| `BeamSection` | `/project/gearlab` → GearLabWalkthrough → SnInspector | Extract/export it into a small project-owned component and add once near the fatigue explanation. Keep SnInspector as the primary data evidence; give the section model its own meaningful anchor. |
| `RockerBogie` | `/project/nasa` → NasaSubsystems → RoverPackaging | Compare functionality with the existing rover review. Keep one canonical suspension interaction; merge useful articulation into it or place the small model in a secondary Suspension section. Do not append another redundant full inspector. |
| `EchoSplit` | `/project/parksense#timeout-demo` already opens the missed-echo mode in ParkSenseSimulator | Retain the existing canonical timeout demonstration. Port only genuinely missing behavior; do not add a second contradictory timing simulator. |

Once equivalent functionality is safely available on the destinations, remove the `pinnedLabs` import from GearHub. Delete/restructure the registry only after checking all references. Do not discard the only copy of a useful working model accidentally. Lazy-load substantial project experiments at the project route/module boundary where the current app architecture permits it. Do not create home imports of project simulators merely for a thumbnail.

## EchoVision diagnosis

`EchoVisionPeel.jsx` defines source coordinate systems of 740×995 for enclosure and 538×892 for wiring. `Frame` uses those portrait ratios for the displayed boxes and `object-cover` on the photo. That produces the tall media shown in the screenshot.

`EchoVisionPackaging.jsx` first mounts EchoVisionPeel, then renders “One component, two packaging views” with another pair of AnnotatedFigures showing the same photographs. This duplication adds more controls, captions, legends, and repeated uncertainty notes.

Both original JPEGs were inspected. They are portrait files with scene orientation that warrants an explicit upright review, especially the sideways bench/poster. Changing only a wrapper aspect ratio or adding `object-cover` can crop the real speaker, leads, enclosure edge, or label targets. Do not force landscape by stretching the photos.

### Landscape implementation

- Make browser-friendly landscape display derivatives from the original photographs. Determine the correct 90-degree orientation for each image individually by the enclosure/scene and readable poster text; do not assume both need the same direction.
- Preserve originals. Do not rotate only the CSS image while leaving overlay coordinates untouched.
- Use two matching **16:10 landscape frames**, with the real image and annotations contained together. Use `object-contain` / SVG `preserveAspectRatio="xMidYMid meet"` where showing the whole evidence is necessary. Quiet letterboxing is acceptable. A carefully checked 4:3 alternative also works; tall portrait boxes do not.
- On desktop, show two equal-width frames side by side only when the photo details remain readable. Otherwise use a photo-view toggle and one larger landscape stage.
- On mobile, stack the landscape frames, or show one selected photo; preserve their landscape ratio rather than reverting to tall portrait panels.
- If retaining portrait content inside a landscape frame temporarily, label it as containment rather than pretending the source has become landscape. Proper orientation and landscape derivatives are the intended final treatment.
- Maintain full-resolution originals and direct open-original links. Inspectors use lightweight derivatives. Update media.js preview mappings as necessary.

### Annotation math

Old overlays cannot be reused unchanged on a rotated or cropped derivative. For an original W×H image and pixel position `(x,y)`:

- Clockwise 90°: new dimensions H×W; position `(H−y, x)`.
- Counterclockwise 90°: new dimensions H×W; position `(y, W−x)`.
- Clockwise axis-aligned rectangle `(x,y,w,h)` becomes `(H−y−h, x, h, w)`.
- Counterclockwise rectangle becomes `(y, W−x−w, h, w)`.
- Apply the same transform to polygon vertices, line points, shape centers, and text anchors. Swap ellipse radii where appropriate. Keep text upright in the output coordinate system.
- For normalized points, clockwise is `(1−y, x)` and counterclockwise is `(y, 1−x)`. Percentage rectangles need their dimensions transformed as well.
- A crop requires subtracting its origin and scaling against the retained crop width/height before positioning. A contained photo requires offsets for any letterboxing. Anchor to the actual rendered image rectangle, not an outer panel with unused margins.

An alternative is a unified transformed image-and-shape group inside SVG, with the new landscape viewBox, and text labels rendered upright separately. Do not mix a centered HTML crop with an independently stretched SVG.

### One inspector, honest labels

Use the heading “Enclosure & bench electronics.” One component selector (Camera / Controller / Speaker / Power), one active component, and one concise explanation. Keep an optional user-triggered “Trace alert path” interaction. The alert path is a functional explanation, not evidence of a photographed internal installation.

The exterior photograph does not document the hidden battery, controller mounting, or internal wire route. Remove the arbitrary battery position box and inferred wire-route animation from the photo. Describe undocumented components in text without coordinates. Keep visible bench components labeled as visible. Do not call the peel effect a physical shell removal or an X-ray; rename it “Show annotations” if retained. A component whose identity is not readable in the bench image should retain the cautious source-backed description rather than gaining an assumed ESP32-CAM label.

Keep the cockpit photo behind its reference disclosure. It must continue to be labeled reference-only, not a tested vehicle installation.

## Prioritized improvement backlog

Choose a few changes per pass. This list is not an instruction to rebuild every surface or reapply fixes already implemented.

### Navigation and homepage

1. First-click tooth navigation.
2. First-tap tooth navigation.
3. Consistent Enter behavior with pointer activation.
4. Native new-tab behavior on gear links.
5. Remove pin/unpin controls and instructions.
6. Remove homepage-mounted project demos.
7. Remove “Active tooth telemetry” framing.
8. Replace the large telemetry card with a short, stable identity preview or the existing compact project list.
9. Keep the same routes in the gear and list.
10. Keep arrow-key gear navigation and visible focus.
11. Make decorative overlays pointer-transparent.
12. Ensure tooth outlines/hit regions stay usable while raised.
13. Keep project names readable while inactive.
14. Shorten the gear helper text to one line.
15. Make Inspect Gear a quiet secondary action.
16. Consider removing Measure/Model/Build/Discover filtering if reviewers still cannot tell which controls navigate.
17. Avoid a completed-work implication for incoming Honda in the Build mode.
18. Reduce the background directly around gear labels and project text.
19. Reduce competing ring/tick detail before reducing the actual gear's legibility.
20. Avoid repeating the same project pitch in featured cards, telemetry, and the list.

### Project experiences

21. Put useful engineering interactions on their project routes.
22. Choose one lead interaction per project.
23. Put the best actual artifact near the opening.
24. Separate measured data, simulations, and explanatory diagrams visibly.
25. Move optional advanced controls below the basic explanation.
26. Use a clear reset where users change multiple parameters.
27. Avoid continuously running animations when nothing is selected.
28. Pause expensive animation offscreen.
29. Respect reduced motion with a useful static state.
30. Load project demos only where needed.
31. Keep direct deep links to named experiments.
32. Preserve the S–N evidence while adding the section-stress explanation.
33. Consolidate NASA's overlapping suspension controls.
34. Keep one ParkSense timeout demonstration.
35. Explain what one slider changes immediately beside it.
36. Keep units and meaningful ranges visible.
37. Avoid displaying rounded toy geometry as an exact CAD reconstruction.
38. Replace long introductions with contribution, result, and evidence.
39. Use concise decisions/trade-offs rather than long tool inventories.
40. Keep supporting PDFs behind explicit document links.

### EchoVision and media

41. Orient the two EchoVision scenes intentionally.
42. Create real landscape display derivatives.
43. Match visible frame ratios.
44. Avoid image stretching.
45. Preserve the speaker and wire endpoints when framing.
46. Recalculate all transformed annotation geometry.
47. Keep annotation text upright.
48. Use one shared image/annotation coordinate system.
49. Consolidate the two repeated EchoVision inspectors.
50. Rename Peel Shell to Show Annotations if no real interior is exposed.
51. Remove the invented battery placement box.
52. Remove guessed internal wiring routes.
53. Show one component's explanation at a time.
54. Keep visible-versus-inferred context beside the selected component.
55. Move secondary evidence notes into a concise expandable details area.
56. Keep original-image links next to captions.
57. Stack landscape media on phones instead of creating two narrow portrait columns.
58. Keep gallery cards compact; use the lightbox for detailed inspection.
59. Use consistent contain/cover rules by media type, not globally.
60. Prevent duplicate images from reappearing in supporting galleries accidentally.

### Typography, presentation, and publication review

61. Use readable sans-serif body copy; reserve monospace for technical annotations.
62. Reduce the density of tracked uppercase labels.
63. Keep captions to one useful sentence.
64. Replace large static bordered panels with quieter spacing.
65. Keep borders on controls that need them.
66. Limit cyan to actions, selection, focus, and meaningful data.
67. Keep inactive text readable without washing out the entire component.
68. Keep one spacing rhythm across photo, controls, caption, and explanation.
69. Put controls in predictable positions across projects.
70. Make all essential controls usable without hovering.
71. Keep touch targets separated at phone widths.
72. Make cursor/link behavior match the action performed.
73. Avoid adding more homepage sections for the air motor.
74. Keep the air motor's assembly/video-pending status until new evidence arrives.
75. Use lightweight previews and on-demand originals.
76. Reserve image dimensions to avoid page jumps.
77. Check every project route by direct load and refresh.
78. Check browser Back restores a sensible reading position.
79. Check console, failed assets, keyboard, reduced motion, and overflow after changes.
80. Compare before/after screenshots at desktop and mobile; keep changes that make the work easier to read.

## Implementation order

**Pass 1:** Tooth navigation, removal of homepage model mounting, compact preview/list, matching mouse/touch/keyboard behavior. Verify before proceeding.

**Pass 2:** Relocate or merge the three existing mini-demos into their correct project experiences. Eliminate duplicates.

**Pass 3:** Correct EchoVision orientation, landscape derivatives, overlay math and duplicated inspectors. Keep evidence honest.

**Pass 4:** Apply remaining visual subtraction only where still necessary. Do not expand this into another full redesign.

## Gemini prompt

Read `docs/gear-navigation-landscape-cleanup.md`, then inspect `src/components/GearHub.jsx`, `src/components/PinnedLab.jsx`, `src/components/EchoVisionPeel.jsx`, `src/components/EchoVisionPackaging.jsx`, `src/components/AnnotatedFigure.jsx`, `src/components/GearLabWalkthrough.jsx`, `src/components/NasaSubsystems.jsx`, `src/components/ParkSenseSimulator.jsx`, `src/pages/ProjectPage.jsx`, and `src/data/media.js`.

Implement these specific UX changes while preserving the current obsidian/titanium/cyan identity:

1. Gear teeth open their existing project routes on the first click/tap/Enter. Stop ordinary Link activation from being prevented. Remove pin state, pin/unpin UI, pin hints, and embedded project simulations from the homepage. Keep the real gear geometry, company-logo hover/focus, native new-tab behavior, keyboard access, and a short stable project preview or list. Do not make users click once to select and again to navigate.
2. Place the useful stress/suspension/timeout interactions on their relevant project pages. Check existing SnInspector, RoverPackaging and ParkSense timeout functionality before moving code; merge overlaps instead of making duplicate simulators. Project animations run only when relevant and respect reduced motion. Preserve existing hero/transition behavior unless explicitly changed in a later task.
3. EchoVision must use upright landscape photo presentations in equal 16:10 frames. Inspect both originals and generate correctly oriented derivatives; never stretch or blindly crop the portrait files. Recompute every relevant point, rectangle, line and label after rotation/cropping. Keep image and annotation geometry aligned. Keep full originals available on demand.
4. Consolidate EchoVision's repeated peel and packaging inspectors into one clear component review. Show one selected component's notes. Keep real visible features labeled; remove undocumented battery-position and wire-route boxes. An annotation wipe must not pretend to reveal the real interior. Keep the cockpit image reference-only.
5. Use the backlog as a review checklist, not a mandate for 80 unrelated edits. Prioritize navigation, relocation, landscape media, and removal of repeated controls/text. Do not change verified project claims, gear tooth count, routes, original assets, or air-motor pending status.

Run `npm run build` through context-mode. Browser-check 1440×900, 1024×768, and 390×844. Test all seven tooth links by pointer and keyboard, mobile first-tap navigation, modified click/new tab, browser Back, no homepage model mounting, correct relocated demos, equal landscape frames, overlay alignment, lightbox, reduced motion, console/network errors and horizontal overflow. Report actual changed files and verification. Do not push or deploy.
