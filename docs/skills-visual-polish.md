# Skills section visual polish

Design review of the current screenshot and `SkillsProof.jsx`, `ToolMark.jsx`, and `skillEvidence.js`. This is an implementation handoff, not a change to the live component.

## Direction

Keep the obsidian/cyan engineering identity. Borrow the reference's recognizable software marks, open spacing, readable labels, and clear skill-to-project relationships. Replace the wall of boxed controls with a restrained technical index.

## Fix first

1. Replace the original line emblems in `ToolMark.jsx` with authentic product artwork. Its opening comment explicitly says these marks are original, not vendor artwork. Generic cubes, cups, chips, and printer nozzles do not identify the actual software.
2. Remove `opacity-30 grayscale` from whole tool and project contents. Labels should stay readable in every state. Apply subdued treatment to the logo alone, if an appropriate monochrome version exists. Unrelated labels remain roughly slate-300/slate-400; cyan identifies selected relationships.
3. Eliminate most tile chrome. Use compact, transparent icon-and-label buttons with generous gaps. Keep a quiet hover surface, a slim cyan selected underline, and a visible keyboard focus ring. Avoid outlining every tool and project row.
4. Substantially suppress the local background pattern behind the map. Use an opaque or nearly opaque obsidian section surface, or locally fade the pattern until it is barely visible. Do not change the site's other HUD backgrounds.
5. Increase labels from the current 10.5–11px to 13–14px. Use the existing sans-serif for product and project names; reserve monospace for category labels and evidence context. Normalize logo optical size inside a 40px box rather than forcing identical artwork dimensions.
6. Keep evidence close to the interaction. On desktop, use a compact selected-project detail below the rail or immediately below the map. On phones, show projects, selected evidence, then tools. The whole section should not become taller when someone selects a different project.

## Logo asset contract

- Store downloaded, inspected SVG or transparent PNG/WebP files in `public/assets/tool-logos/`. Reference them through `/assets/tool-logos/...`; no runtime remote images or hotlinked favicons.
- Add a small manifest recording product, source URL, local filename, variant, and any required attribution. Use vendor artwork or a reputable upstream project's actual brand asset. Check that each asset is the named product, not its parent company or a similarly named product.
- Prefer a vendor-supplied light/monochrome variant on the dark surface. Otherwise preserve the recognizable original colors. Do not recolor every logo cyan, redraw it, stretch it, or crop a wordmark into a fake symbol.
- For brands that only provide a dark mark, an understated light backing behind that mark is better than an illegible logo. Keep this exception small and consistent.
- Use `object-fit: contain`, explicit dimensions, and individual optical scale overrides. At 100% zoom each logo should be recognizable and each label readable.
- If authentic artwork cannot be sourced, keep a clean text wordmark and record the missing asset. Do not substitute a generic icon and call it the official logo.

### Product-specific mapping

| Current entry | Requested treatment |
| --- | --- |
| Siemens NX | Authentic Siemens NX product mark/app icon; not an invented NX outline. |
| SolidWorks | Authentic SOLIDWORKS product artwork; not a cube. |
| Fusion 360 | Authentic Autodesk Fusion artwork. Keep the displayed product name aligned with the user's actual experience. |
| Onshape | Authentic Onshape artwork; not a circular target. |
| LabVIEW | Authentic LabVIEW artwork; not a custom block diagram. |
| MATLAB | Recognizable MATLAB membrane/app artwork; not a hand-drawn wireframe. |
| EES | Actual Engineering Equation Solver artwork or its text wordmark. Do not substitute a generic graph. |
| Arduino IDE | Authentic Arduino IDE app artwork or a suitable supplied Arduino mark. Keep product text visible. |
| C / C++ | Use C++ artwork and label **C++**, matching the verified ParkSense evidence. Do not imply separate C experience without confirmation. |
| ESP32-CAM | Use genuine board/product imagery or the Espressif brand asset with the explicit **ESP32-CAM** label. A company mark must not be presented as a unique ESP32-CAM product logo. |
| Python | Actual Python artwork; keep its current evidence status. |
| Java | Authentic Java artwork; not a generic coffee cup. |
| React & Tailwind | Two authentic marks next to the existing combined label, or separate entries sharing the portfolio-site context. No invented hybrid logo. |
| Bambu Studio / 3D Print | Actual Bambu Studio app artwork; keep fabrication experience as context rather than a fake software logo. |

Useful vendor references: [MathWorks brand guide](https://www.mathworks.com/brand.html), [Arduino brand assets](https://content.arduino.cc/brand/), [Arduino logo guidance](https://www.arduino.cc/en/trademark/guides/arduino-and-community-logos/). These are starting points for sourcing; this review does not claim that assets have been downloaded or every proposed use is covered by those guides.

## Interaction and evidence cleanup

- Start neutral, with no selected tool/project and no active lines. All names are readable.
- Selecting a linked project emphasizes its genuine tool relationships. Keep only those connector lines visible; route through clear gutters, behind controls, without crossing text or artwork.
- Selecting an unlinked tool such as MATLAB shows its résumé context and a plain `Project example not linked` message. Do not dim every project to near invisibility or make the whole section look disabled.
- Pinned selection remains stable while the pointer travels to the evidence links. Prefer hover styling without replacing pinned evidence; keyboard and touch must expose the same information.
- Remove `1 tool` / `3 tools` labels or rename them to `1 linked tool` / `3 linked tools`. Current counts describe recorded edges, not the total tools used by a project. Do not add connections merely to make counts larger.
- Keep the existing distinction between résumé skills, site tooling, personal fabrication, and published project proof. Python and EES currently have no repository project edge; MATLAB, Java, Fusion 360, and Onshape are résumé-listed. Do not manufacture supporting projects.
- Preserve the evidence ledger, working case-study links, full-original links, and thumbnail-first loading.

## Implementation scope

1. Add verified local logo files and their manifest.
2. Replace the implementation of `ToolMark.jsx` with a small asset-backed component, preserving callers' `className`. It must support the 20px evidence-chip size and the 36–44px map size. Use empty image alt text when adjacent visible product text already names the mark.
3. Update only SkillsProof's map spacing, tool/project surfaces, readable inactive states, type, local backdrop, and relationship line stacking/routing as needed.
4. Update `skillEvidence.js` only for accurate display labels or explicit logo references. Preserve existing evidence claims and source links.
5. Verify at 1440px, 1024px, and 390px, plus keyboard, touch, reduced motion, missing-image handling, and all logo requests. Run `npm run build` through context-mode. Inspect the actual section in a browser.

Do not change Home's hero, GearHub, fatigue rig, CAD scroll transition, navigation, project pages, or site-wide color tokens.

## Paste-ready implementation prompt

Read `AGENTS.md`, `docs/skills-visual-polish.md`, `src/components/SkillsProof.jsx`, `src/components/ToolMark.jsx`, and `src/data/skillEvidence.js`. Implement the visual-polish brief. Source real product marks, save them locally with source metadata, and replace custom emblems. Make the skills map open and compact: quiet surfaces, readable inactive labels, restrained local pattern, optical logo sizing, cyan selection only, and clear connectors. Keep evidence selection stable and do not invent skill-to-project relationships. If a real asset is unavailable, use a clean product wordmark instead of a generic icon. Preserve all unrelated homepage and project components. Run the build via context-mode and browser-check desktop/mobile, keyboard, touch, logo loading, and reduced motion. Report changed files, asset sources, validation, and any unresolved logo.
