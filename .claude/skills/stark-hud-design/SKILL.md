---
name: stark-hud-design
description: Design system and rules for Gautham Subramanian's Regular HUD to Stark/JARVIS HUD mechanical engineering portfolio.
---
- Persistent Navigation: Keep a fixed circular 3-bar button at top-left (`z-50`) visible on every route, opening a clean drawer listing all 7 experiences plus "Miscellaneous Projects" independently.
- Scroll Theme Transition: Hero ("Regular HUD") uses pure white (`#FFFFFF`) with crisp dark typography, "Gautham Subramanian | Student @ OSU | Major: ME | Minor: Robotics | Focus: Automotive, Aero, Robotics", intro paragraphs on the left, and Scott Lab photo on the right. Scrolling transitions smoothly via gradient into deep obsidian (`#05080F`) Stark/JARVIS HUD with subtle cyan (`#00E5FF`) technical grid lines and corner reticles.
- Interactive Gear Hub: Custom SVG mechanical gear with 7 interactive teeth: **Honda**, **GearLab**, **NASA**, **OnRamp**, **EchoVision**, **Marion Projects**, and **Mars Rover**, plus a central hub. Hovering scales the tooth `1.12x`, adds a cyan JARVIS glow, and reveals the company/project logo from `/assets/`. Clicking navigates to `/project/:slug`.
