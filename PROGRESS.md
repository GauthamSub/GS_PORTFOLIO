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
