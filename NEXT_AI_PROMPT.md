# Continuation Prompt — RAVI.OS

You are continuing work on **RAVI.OS**, Ravi Bhatt's interactive personal operating system and portfolio. Read `CLAUDE_HANDOFF.md` first to understand the architecture, completed QA, and test results.

## State of the Project
Phase 19 (Production Deployment Debugging, UI Consistency & Window Controls Fix) is complete:
- **Window Controls (Close & Minimize) Robustness**:
  - `onPointerDown` on the draggable header was intercepting clicks before `onClick` could fire, `(e.target).closest('button')` failed on SVG child elements, and `focus(id)` triggered a mid-pointerdown re-render that caused mobile browsers to discard synthetic click events.
  - Fixed in `src/components/windows/Window.tsx`: added explicit `onPointerDown={(e) => e.stopPropagation()}` on the traffic light button container and individual buttons, added `pointer-events-none` on SVG icons, added invisible touch hit-target expanders (`-inset-2`) for touchscreens, used stable reactive Zustand hook selectors (`useDesktop((s) => s.close)`), and added pull-down bar closing on mobile.
- **Production Deployment & Serverless API (`vercel.json` & `api/notes.ts`)**:
  - Created `vercel.json` with SPA routing rewrites to `/index.html`, `/api/notes` routing, long-term immutable caching for `/assets/`, and proper `application/pdf` MIME headers for `/resume.pdf`.
  - Created Vercel Serverless Function `api/notes.ts` to power `/api/notes` in production.
  - Updated `src/services/notesService.ts` with `SEED_NOTES` fallback and optimistic local caching.
- **Tailwind & CSS Consistency**:
  - Placed `-webkit-backdrop-filter` before `backdrop-filter` in `.glass` and `.glass-bar` for cross-browser blur compatibility on iOS Safari and WebKit.
- **Preserved Core Architecture**:
  - Wallpaper 1 (Default): Cosmic Planet ringed Saturn-style 3D world.
  - Wallpaper 2: Accurate 3D Particle Hologram of Ravi.
  - Wallpaper 3: Blue Particle Intelligence (cyber cube morphing into botanical tree).
  - Sidebar real profile photo, Public Sticky Notes Wall, and Snake Arcade Game.
  - Production build passes cleanly with zero errors (`npm run build` in 1.39s).

## Commands
```bash
npm install
npm run dev        # Starts Vite dev server (e.g. http://localhost:5174/)
npm run build      # Runs tsc -b && vite build
npm run preview    # Previews production bundle
```
