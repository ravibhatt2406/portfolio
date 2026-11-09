# Continuation Prompt — RAVI.OS

You are continuing work on **RAVI.OS**, Ravi Bhatt's interactive personal operating system and portfolio. Read `CLAUDE_HANDOFF.md` first to understand the architecture, completed QA, and test results.

## State of the Project
Phase 18 (Updated Resume, Experience Alignment with Open Source Contributor, Skills & Projects Sync) is complete:
- **Updated Resume PDF**:
  - Replaced `public/resume.pdf` with the updated PDF resume (`media_1794236279389_c2bd9a17.pdf`, 78.1 KB).
  - Bundled cleanly in `dist/resume.pdf` with responsive preview, download, and external tab controls in `ResumeApp.tsx`.
- **Experience Alignment**:
  - Removed `InternPe`.
  - Added `Open Source Contributor` (`FLN Project & Open Source Community`, `Aug 2026 – Present`) with emerald badge and `GitBranch` icon.
  - Updated `Vicharanashala Lab, IIT Ropar` timeline to `Sep 2026 – Nov 2026` with FLN project contribution, ICRISAT dataset EDA and ML modeling (Linear Regression, Decision Tree, Random Forest), and K-Means clustering.
  - Updated `Titan Auto` to `Freelance Project Developer` with customer analytics, sales reporting, and AI chatbot integration.
  - Updated `AboutApp.tsx` experience card to match `Sep 2026 – Nov 2026` and `Open Source Contributor`.
- **Skills & Projects Sync**:
  - `skills.ts`: Added `XGBoost`, `AI Agents`, `C`, `MongoDB`, `Express.js`, `Docker`, `Feature Engineering`, and `Model Evaluation` organized into 5 clean categories.
  - `projects.ts`: Updated `RAG-Based AI Teaching Assistant` and added `Customer Churn Prediction with Explainable ML` with SHAP interpretability.
  - `achievements.ts`: Added `DeepLearning.AI Machine Learning Specialization`.
- **Preserved Core Architecture**:
  - Wallpaper 1 (Default): Cosmic Planet ringed Saturn-style 3D world.
  - Wallpaper 2: Accurate 3D Particle Hologram of Ravi.
  - Wallpaper 3: Blue Particle Intelligence (cyber cube morphing into botanical tree).
  - Sidebar real profile photo, Public Sticky Notes Wall, and Snake Arcade Game.
  - Production build passes cleanly with zero errors (`npm run build` in 1.34s).

## Commands
```bash
npm install
npm run dev        # Starts Vite dev server (e.g. http://localhost:5174/)
npm run build      # Runs tsc -b && vite build
npm run preview    # Previews production bundle
```
