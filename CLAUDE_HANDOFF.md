# CLAUDE_HANDOFF.md — RAVI.OS

## 1. Project Overview
RAVI.OS is Ravi Bhatt's interactive personal operating system and portfolio:
- **Phase A — Hologram Intro & Typography Sequence**:
  - Step 1: Very large bold centered white typography `RAVI` with smooth cinematic reveal.
  - Step 2: Smooth transformation into very large bold typography `PORTFOLIO` over the assembling facial particle hologram.
  - Step 3: Transition into the existing RAVI.OS landing page (`HELLO, I’M RAVI.`, `AI & ML DEVELOPER`, and glowing `ENTER RAVI.OS` button).
  - Background: Real-time GPU particle hologram synthesized from Ravi's authoritative high-resolution portrait photograph (`media_1793899065610_2395d70e.jpg`).
- **Phase B — macOS-Inspired Cosmic Desktop & 3 Selectable Animated Wallpapers**:
  - **Wallpaper 1: Cosmic Planet** (Default on fresh sessions) — Real-time Three.js scene with Saturn-like ringed planet, luminous concentric rings, mint-green/cyan plasma flares rising behind planet horizon, purple volumetric nebula clouds, and orbiting moons/satellites.
  - **Wallpaper 2: Ravi Hologram** — Face-accurate 3D particle hologram based on portrait with interactive cursor repulsion, 3D anatomical depth, and starfield.
  - **Wallpaper 3: Blue Particle Intelligence** — Luminous electric-blue botanical branching tree (flared roots, trunk, 5 major boughs, canopy) morphing into a 3D rotating geometric cyber cube with glowing 3D "AI" letters inside.
  - **macOS Wallpaper Switcher**: Native macOS glass modal with 3 preview cards in exact order (1. Cosmic Planet, 2. Ravi Hologram, 3. Blue Particle Intelligence), active indicators, and instant switching with localStorage persistence.
  - Full desktop suite: Top menu bar with Wallpaper button, floating profile sidebar with a live 3D mini hologram avatar, floating magnifying dock, and multi-window manager hosting nine apps.
- **Status**: Phase 18 Complete — Updated Resume, Experience Alignment (Open Source Contributor replacing InternPe), Skills & Projects Sync.
  - **Updated Resume PDF**: Sourced and verified Ravi's updated PDF resume (`media_1794236279389_c2bd9a17.pdf`, 78.1 KB), copied to `public/resume.pdf` and bundled into `dist/resume.pdf`. Embedded in `ResumeApp.tsx` with high-fidelity preview, "Download Resume", and "Open in New Tab" actions.
  - **Experience Alignment**:
    - Removed `InternPe`.
    - Added `Open Source Contributor` (Role: `Open Source Contributor`, Type: `Open Source`, Org: `FLN Project & Open Source Community`, Period: `Aug 2026 – Present`) with emerald styling and `GitBranch` icon.
    - Updated `Vicharanashala Lab, IIT Ropar` timeline to `Sep 2026 – Nov 2026` and detailed its contributions (open-source FLN project, ICRISAT dataset EDA & predictive modeling with Linear Regression, Decision Tree, Random Forest, and K-Means clustering).
    - Updated `Titan Auto` to `Freelance Project Developer` with customer analytics, sales reporting, and AI chatbot integration.
    - Synced experience highlight card in `AboutApp.tsx` to reflect `Sep 2026 – Nov 2026` and `Open Source Contributor`.
  - **Skills & Projects Sync**:
    - `skills.ts`: Added `XGBoost`, `SHAP`, `AI Agents`, `C`, `MongoDB`, `Express.js`, `Docker`, and `Feature Engineering` / `Model Evaluation`. Grouped with `Generative & Agentic AI` and `Tools & Visualization`.
    - `projects.ts`: Synchronized `RAG-Based AI Teaching Assistant` and added `Customer Churn Prediction with Explainable ML` with SHAP interpretability.
    - `achievements.ts`: Added `DeepLearning.AI Machine Learning Specialization`.
  - **Zero Regressions**: 3D Wallpapers (Cosmic Planet, Ravi Hologram, Blue Particle Tree), Sticky Notes Wall, Games App (Snake), and profile photo intact. Production build passes cleanly (`npm run build` in 1.34s).

---

## 2. Phase 16 Specific Implementations & Verification

### Real Profile Photograph in Sidebar (`src/components/desktop/Sidebar.tsx`)
- Replaced the small Three.js mini-hologram in the sidebar with Ravi's authentic profile photograph (`src/assets/portrait/portrait.jpg`).
- Styled with circular crop (`rounded-full`), `ring-2 ring-violet-500/35`, subtle border `border-white/15`, and luminous glow `shadow-[0_0_25px_rgba(139,92,246,0.22)]`.
- Preserved facial proportions with `scale-[1.08] object-cover object-center`, removing the outer white border while leaving hair, eyes, nose, beard, chin, and collar unobstructed.
- Responsive: In tablet mode (`collapsed`), scales down to a clean `h-12 w-12 rounded-2xl ring-1` profile icon; in expanded mode, displays as an elegant `h-28 w-28` portrait.
- Preserved the main particle hologram on the landing page, the Ravi Hologram wallpaper (Wallpaper 2), and the particle hologram engine.

### Vicharanashala Lab, IIT Ropar Internship (`src/components/applications/AboutApp.tsx` & `src/data/experience.ts`)
- **Organization**: `Vicharanashala Lab, IIT Ropar`
- **Experience Type**: `Internship`
- **Role**: `MERN Stack & Open Source Intern`
- **Timeline**: `Sep 2026 – Present`
- **Description**: `An internship experience associated with Vicharanashala Lab at the Indian Institute of Technology Ropar, involving exposure to AI and technology learning and project-based development.`
- Integrated into `AboutApp.tsx` with dedicated highlight card, `Briefcase` icon, cyan/sky accents, and natural alignment alongside education and FutureHacks winner cards.
- Centralized in `src/data/experience.ts` and reflected in `ExperienceApp.tsx`.

### Skills Categorization & Four New Skills (`src/data/skills.ts` & `src/components/applications/SkillsApp.tsx`)
- Structured into 5 categories:
  1. **Programming Languages**: Java, Python, JavaScript, TypeScript, SQL, C++
  2. **AI & Machine Learning**: Machine Learning, Deep Learning, Generative AI, Retrieval-Augmented Generation (RAG), **LangChain**, **LangGraph**, TensorFlow
  3. **Data Science & Analytics**: Pandas, NumPy, Matplotlib, Scikit-learn, Power BI, Excel, Jupyter Notebook, Seaborn
  4. **Web Development**: React, Node.js, NestJS, Tailwind CSS, shadcn/ui, HTML, CSS
  5. **Databases & Tools**: **PostgreSQL**, MySQL, **Docker**, Git, GitHub, VS Code
- Newly added skills highlighted with cyan badges and luminous indicator dots.
- Category icons (`Terminal`, `Brain`, `BarChart3`, `Globe`, `Database`) with clean item counts.
- Zero fake proficiency percentages or arbitrary progress bars.

### Official Resume PDF Integration (`src/components/applications/ResumeApp.tsx` & `public/resume.pdf`)
- Sourced authentic resume PDF: `public/resume.pdf` (87,408 bytes), copied from `Ravi_Bhatt_Web_Development_Resume.pdf`.
- Automatically bundled into production distribution: `dist/resume.pdf`.
- Upgraded `ResumeApp.tsx` with:
  - Header toolbar with "Resume", "Verified PDF" badge, and profile metadata.
  - "Open in New Tab" button (`target="_blank" rel="noopener noreferrer"` with `ExternalLink` icon).
  - "Download Resume" button (`download="Ravi-Bhatt-Resume.pdf"` with `Download` icon).
  - Responsive embedded PDF viewer (`<iframe src="/resume.pdf#view=FitH" />`).
  - Footer toolbar with full-screen action.

---

## 3. Phase 15 Specific Implementations & Verification

### Centralized Profile & Social Channels (`src/data/profile.ts`)
- **Name**: `Ravi Bhatt`
- **Title**: `AI & ML Developer`
- **Tagline**: `Building intelligent solutions through AI and software development.`
- **Location**: `Udaipur, Rajasthan, India`
- **Education**: `B.Tech in Artificial Intelligence and Data Science` at `Jaipur Engineering College and Research Centre, Jaipur` (`2025–2029`)
- **Official Email**: `ravibhatt2406@gmail.com`
- **Official Links**:
  - LinkedIn: `https://www.linkedin.com/in/ravi-bhatt-14752037b/`
  - GitHub: `https://github.com/ravibhatt2406`
  - LeetCode: `https://leetcode.com/u/A8b7tkDX5C/`
  - Mailto: `mailto:ravibhatt2406@gmail.com`

### Six Authentic Portfolio Projects (`src/data/projects.ts`)
1. **RR Wedding Filmers**:
   - Category: `Web Development` / `Freelance Development`
   - Description: A deployed wedding-filmmaking website project built with high-performance responsive web architecture, optimized cinematography media showcases, and client inquiry integration.
   - Tech: React, TypeScript, Tailwind CSS, Vite, Framer Motion
   - Image: `src/assets/projects/rr-wedding-filmers.jpg`
   - Live URL: `https://rrweddingfilmerudaipur.vercel.app/`
   - Action Button: `Visit Live Website`
2. **UrbanPlus.AI**:
   - Category: `AI & Machine Learning` / `Hackathon Projects`
   - Award Badge: `1st Place — Advanced Category, FutureHacks` (Gold trophy styling)
   - Description: An AI-powered 15-Minute City Score and Simulator concept using OpenStreetMap data, spatial analytics, and AI-driven urban accessibility recommendations for SIH 2026.
   - Tech: Next.js 14, TypeScript, Tailwind CSS, Claude API, Leaflet, Turf.js, Recharts
   - Live URL: `https://devpost.vercel.app/`
   - Action Button: `Live Demo`
3. **Drishti AI Surveillance**:
   - Category: `AI & Machine Learning`
   - Description: Real-time autonomous border surveillance system leveraging YOLOv8, ByteTrack, and DeepFace for cross-border intrusion detection, thermal tracking, and SIH 2026 Problem Statement ID 26187.
   - Tech: Python, FastAPI, YOLOv8, OpenCV, ByteTrack, DeepFace, WebSockets
   - Image: `src/assets/projects/drishti-surveillance.png`
   - GitHub URL: `https://github.com/ravibhatt2406/AI-Border-Surveillance`
   - Action Button: `View on GitHub`
4. **Supply Chain Data Analyst**:
   - Category: `Data Analytics`
   - Description: End-to-end supply chain analytics pipeline and interactive dashboard analyzing fulfillment delays, inventory turnover, logistics risk factors, and profitability optimization.
   - Tech: Python, Pandas, NumPy, SQLite, Matplotlib, Seaborn, Excel Dashboard
   - GitHub URL: `https://github.com/ravibhatt2406/Supply_Chain_DataAnalysit_project`
   - Action Button: `View on GitHub`
5. **RAG-Based AI**:
   - Category: `Generative AI` / `AI & Machine Learning`
   - Description: High-accuracy Retrieval-Augmented Generation system using multi-lingual dense vector embeddings (bge-m3), cosine semantic similarity, and local LLM reasoning via Ollama.
   - Tech: Python, Ollama (Llama 3.2 / DeepSeek), BGE-M3 Embeddings, Scikit-learn, Vector Similarity
   - GitHub URL: `https://github.com/ravibhatt2406/rag_based_AI`
   - Action Button: `View on GitHub`
6. **Titan Auto**:
   - Category: `Freelance Development` / `Web Development`
   - Description: Modern full-stack automobile dealership and service management dashboard featuring inventory catalogs, scheduled test drives, and responsive vehicle configuration interfaces.
   - Tech: React, TypeScript, Vite, Tailwind CSS, NestJS, PostgreSQL, Prisma ORM
   - GitHub URL: `https://github.com/ravibhatt2406/Automobile_Dahboard`
   - Action Button: `View on GitHub`

### Application Implementations & Upgrades
1. **Projects Application (`src/components/applications/ProjectsApp.tsx`)**:
   - Live category filter pills: `All (6)`, `AI & Machine Learning (1)`, `Generative AI (1)`, `Web Development (1)`, `Data Analytics (1)`, `Hackathon Projects (1)`, `Freelance Development (1)`.
   - Card layout with high-resolution thumbnail images, technology badges, live status tags (`Live in Production`, `Hackathon Winner`, `Open Source`), and verified external action links opening in new tabs (`target="_blank" rel="noopener noreferrer"`).
2. **Contact Application (`src/components/applications/ContactApp.tsx`)**:
   - 2x2 grid of official direct profile cards (Email, LinkedIn, GitHub, LeetCode) with quick connect triggers.
   - 1-click clipboard copy button with visual state feedback (`Copied!`).
   - Validated message form (Name, Email, Message) that generates a prefilled `mailto:` draft addressed to `ravibhatt2406@gmail.com` with clear user feedback.
3. **About Application (`src/components/applications/AboutApp.tsx`)**:
   - Prominent portrait with neon glowing ring, location pin, professional title badge `AI & ML Developer`.
   - Verified education at JECRC Foundation, Jaipur (`2025–2029`).
   - FutureHacks 1st Place Winner award pill.
   - Direct social pill buttons for GitHub, LinkedIn, LeetCode, and Email.
4. **Desktop Sidebar (`src/components/desktop/Sidebar.tsx`)**:
   - Added compact glass icon buttons (GitHub, LinkedIn, LeetCode, Email) directly underneath the location badge in expanded mode.
5. **Brand Icons (`src/components/ui/BrandIcons.tsx`)**:
   - Added authentic SVG icon for LeetCode alongside GitHub and LinkedIn.

---

## 3. Phase 14 Specific Implementations & Verification

### Problem Diagnosis & Fixes
1. **Oversized Screen-Dominating Cube**:
   - *Problem*: `cubeHalf = 0.95` created a massive 1.9-unit structure spanning almost the entire viewport height.
   - *Fix*: Reduced to `cubeHalf = 0.40–0.46` (a ~48% reduction), creating an elegant, sophisticated floating holographic object.
2. **Crude Typography & Serifs**:
   - *Problem*: Oversized letters with horizontal serifs on the 'I' that looked like a plain white font washed out by excessive brightness.
   - *Fix*: Rewrote to clean, modern, bold sans-serif letterforms. Proportional size occupies ~36.5% of front-face width (height $0.34$, width $0.336$). Centered with a distinct $0.090$ spacing gap. Rendered in cyan, electric blue, and crisp white stardust highlights without blinding over-saturation.
3. **Severe Overlap with Hero Text (`I AM RAVI.`)**:
   - *Problem*: Cube was centered at `(0, 0)`, placing its lower-left quadrant directly over `I AM RAVI.` at `bottom-36 left-[300px]`.
   - *Fix*: Re-architected cube positioning via `uCubeCenter` dynamic uniform:
     - Desktop ($\ge 1100$px): `(0.58, 0.35, 0.0)` — leaves `I AM RAVI.` ($x \in [-1.36, 0.10]$) completely clear with $+0.37$ vertical and $+0.08$ horizontal separation.
     - Tablet (768px–1100px): `(0.48, 0.35, 0.0)` — balanced in upper-right away from `left-28` hero text.
     - Mobile ($< 768$px): `(0.0, 0.45, 0.0)` — centered in the upper sky above the centered hero text.
4. **Phantom Cursor Repulsion Deforming Cube**:
   - *Problem*: When mouse was inactive at `(0, 0)`, radial falloff repelled particles within $0.85$ units, bending the left edge of the cube into a loop.
   - *Fix*: Gated cursor repulsion by `treeWeight = (1.0 - uMorph)` and `length(uMouse) > 0.001`, ensuring the cube remains an unyielding, razor-sharp 3D geometric object while the tree canopy retains dynamic elastic interaction.
5. **Authentic 3D Perspective & Realism**:
   - Added a constant $-14^\circ$ ($0.24$ rad) pitch tilt downward to clearly reveal the cube's top face, front face, and sides simultaneously.
   - Added 12 face diagonal cross-lattices, planar face stippling, and internal volumetric mist for rich cyber depth.
   - Concentric ground energy rings position dynamically as a floating cyber pedestal under the cube in Cube state and expand down to floor ground under the tree base.

---

## 3. Phase 13 Specific Implementations & Verification

### Reference Guide Compliance (`media_1793958588005_3d0235e8.jpg`)
1. **Panel 1 — AI Cube (Initial State)**:
   - 3D particle wireframe cube with 12 bounding edges and diagonal cross-lattices.
   - Dedicated 32% of particle budget to **ONLY** the letters `AI` inside, centered and proportional.
   - Letters have volumetric 3D extrusion in Z and rotate synchronously with the cube turntable ($\pm 22^\circ$).
   - Concentric ground energy rings beneath the cube with expanding ripples and radial ticks.
2. **Panel 2 — Transformation (Cube → Tree)**:
   - Coordinated morphological streamline arcs between Cube & Tree.
   - Staggered transformation progress: roots and trunk drop and anchor first, primary boughs unfurl outwards, and canopy blossoms into the dome space.
   - Smooth reverse transformation: canopy draws inward smoothly into the cube lattice, trunk ascends last.
3. **Panel 3 — Tree (Final State)**:
   - **Buttress Roots**: 10 flared root ridges anchoring into ground rings at $y = -1.25$.
   - **Fluted Trunk**: 18 vertical twisted fiber strands ($y \in [-1.08, -0.35]$) with internal spiral twist and fibrous texture. Prevents additive blowout into solid white block.
   - **Primary Boughs & Branches**: 12 primary boughs arching outward ($x$ reaching $\pm 1.45$), dividing into 36 secondary and 72 tertiary branches.
   - **Wide Spreading Foliage Canopy**: Majestic horizontal umbrella dome ($x \in [-1.82, 1.82]$, $y \in [-0.10, 0.92]$, $z \in [-1.30, 1.30]$).
   - **Color Palette & Stardust**:
     - Electric Blue (`#3B82F6`)
     - Royal Violet (`#8B5CF6`)
     - Luminous Cyan (`#22D3EE`)
     - Twinkling White Stardust (`#F2F4FF`) with dynamic sinusoidal sparkle
   - **Interactive Cursor Repulsion**: Canopy particles smoothly repel away from mouse cursor and gently restore.
4. **Cinematic 34.0s Animation Loop**:
   - `0.0s – 8.0s` (8s): Pure Cube state with slow turntable rotation & readable "AI" text.
   - `8.0s – 10.5s` (2.5s): Energy buildup.
   - `10.5s – 17.0s` (6.5s): Smooth Cube-to-Tree transformation.
   - `17.0s – 19.5s` (2.5s): Tree settling.
   - `19.5s – 27.5s` (8.0s): Tree idle state with wind sway, trunk pulses, and stardust twinkle.
   - `27.5s – 34.0s` (6.5s): Smooth Tree-to-Cube transformation back into the cube lattice.

---

## 3. Phase 12 Specific Implementations & Verification

### Problem Diagnosis & Technical Weaknesses in Prior Implementations
1. **Additive Blending Washout**: Prior particle systems used large blurry point discs with additive blending that washed out dark features (pupils, eyelids, brows, mustache, beard) into an undifferentiated bright white blob.
2. **Incoherent Motion Jitter**: In `particle.vert`, an independent per-particle noise term (`0.018 * p` amplitude) scrambled neighboring particles across 0.036 world units every frame, destroying fine anatomical feature cohesion.
3. **Crude Threshold Segmentation & Frame Artifacts**: The circular white avatar ring and studio grey background leaked into the boundary, while hair volume was clipped.
4. **Uniform Random Soup Sampling**: Random Poisson rejection without feature weighting starved the forehead and cheeks while failing to trace anatomical landmark curves.

### Phase 12 High-Fidelity Reconstruction Architecture
- **Authoritative Pre-Segmented Source**:
  - `src/assets/portrait/portrait_clean.png` (1024x1024 RGBA): Cleanly separates Ravi from the neutral studio wall and removes the 491px white circular ring and external black canvas with 100% precision.
  - Preserves exact natural hairline, swept-up curls, ears, neck, collar, and maroon shirt silhouette.
- **CDF (Cumulative Distribution Function) Feature Importance Sampling**:
  - `portraitSampler.ts`:
    - Reads `portrait_clean.png` at `RES = 512`.
    - Sobel 3x3 convolution extracts high-gradient contours of eyelids, pupils, eyebrows, nose wings, lips, mustache, beard, and hair curls.
    - Solid base coverage (`1.0`) guarantees full stipple density across forehead, cheeks, nose, neck, and shoulders without hollow voids.
    - Feature weighting concentrates particles along real curves: `ed * 1.5` + eye landmark falloffs + brow falloffs + mouth falloffs.
    - Binary search on CDF (`O(log N)`) generates 36k–50k particles deterministically with zero wasted rejection cycles.
- **Chromatic Classification & Contrast Preservation**:
  - `aRand.z` encodes anatomical feature categories:
    - `0.08`: Facial hair / dark features (pupils, eyelids, eyebrows, mustache, beard) — rendered in **deep electric blue & indigo** (`#3B82F6` / `#102E65`) with tight core sizing so they remain dark and distinct against the luminous skin!
    - `0.32`: Swept-up hair coif — **cosmic violet & electric blue** with electric cyan highlights along hair crests.
    - `0.58`: Maroon shirt torso — **cosmic amethyst & violet** (`#782E78`).
    - `0.85`: Facial skin & highlights — **luminous cyan midtones** (`#22D3EE`) grading into **brilliant cool white highlights** (`#F2F4FF`) on the nose bridge, forehead, cheekbones, and eye catchlights.
- **Genuine 3D Anatomical Depth**:
  - Ellipsoidal head dome curvature.
  - 3D nose bridge & tip projection (`+0.28`).
  - Orbital eye socket recession (`-0.12`).
  - Forehead curvature (`+0.07`).
  - Lips (`+0.08`) and chin projection (`+0.12`).
  - Neck recession (`-0.22`) behind jawline.
  - Volumetric hair shell (`+0.11`).
  - Shoulder slope (`-0.16` to `-0.30`).
- **Spatially Coherent Motion**:
  - Replaced destructive per-particle noise with continuous spatial head sway (`pos.y * 0.75`), keeping facial landmarks strictly locked in relation to one another.
  - Microscopic stardust drift (`0.0012`) and subtle alpha shimmer (`vAlpha`) provide living holographic realism without tearing the face.
  - Cursor repulsion opens a clean elastic radial lens with smooth return.
- **Framing & Aspect Ratio**:
  - Upper-body framing encompasses the complete hair coif at the top and both shoulders at the bottom with zero clipping.

### Verification Artifacts
- `phase12_intro_settled_hologram.png`: Front view of Ravi's hologram on landing page with complete head, neck, and shoulders.
- `phase12_wallpaper_ravi_hologram.png`: Full desktop wallpaper with Ravi Hologram selected in the macOS desktop environment.
- `phase12_hologram_cursor_repel.png`: Elastic circular cursor repulsion and particle deflection.
- `phase12_desktop_sidebar_mini_hologram.png`: Live mini-hologram inside the profile sidebar.
- `phase12_mobile_layout.png`: Mobile viewport (390x844) with centered bust, responsive typography, and dock.

---

## 2. Phase 11 Specific Implementations & Verification

### Sequence & Timing Corrections
- **Exact Linear One-Way Sequence**: `Opening Visual Effect` → `RAVI` → `PORTFOLIO` → `Existing RAVI.OS Landing Page`.
- **Timing Budget**:
  - `0.0s – 2.0s`: Dark screen with subtle cyan-violet radial glow and horizontal laser light aperture slit. Progressive letter reveal of `R`, `A`, `V`, `I` with staggered blur-to-focus and scale-in.
  - `2.0s – 4.2s`: `RAVI` holds settled in bold white typography for ~2.2s.
  - `4.2s – 5.7s`: Kinetic typography transition into `PORTFOLIO` with letter-by-letter cascade and depth positioning over the assembling particle portrait.
  - `5.7s – 7.4s`: `PORTFOLIO` holds settled for ~1.7s.
  - `7.4s+`: Smooth crossfade into the existing RAVI.OS landing page (`HELLO, I’M RAVI.`, `AI & ML DEVELOPER`, and `ENTER RAVI.OS` glowing pill button).
  - Total duration: ~7.4s (within requested 7–9s budget).
- **Opening Visual Effect**:
  - Recreated the reference video's glowing aperture reveal with a radial blur backdrop and a horizontal laser-line slit (`scaleX` aperture expansion and collapse).
- **Skip Intro Fix**:
  - Clicking "Skip intro" cancels all pending timers and immediately transitions directly to the existing landing page (`HELLO, I’M RAVI.`) so the user can enter the desktop when ready.
- **Visual Artifacts**:
  - `phase11_stage1_opening_glow.png`: Laser aperture slit and initial progressive letter reveal.
  - `phase11_stage2_ravi_hold.png`: Settled bold white `RAVI` typography over stardust field.
  - `phase11_stage3_portfolio_reveal.png`: Morph into `PORTFOLIO` over particle portrait.
  - `phase11_stage4_portfolio_hold.png`: Settled `PORTFOLIO` typography.
  - `phase11_stage5_landing_page.png`: Existing landing page with `AI & ML DEVELOPER` and `ENTER RAVI.OS`.
  - `phase11_stage6_desktop.png`: Desktop transition with Cosmic Planet as default wallpaper.

---

## 2. Phase 10 Specific Implementations & Verification

### Task 1: Default Wallpaper — Cosmic Planet
- `src/store/desktopStore.ts`: `savedWallpaper` defaults to `'planet'` when no saved preference exists in `localStorage`.
- `WallpaperSwitcher.tsx` and `MenuBar.tsx`: Re-ordered wallpaper list to:
  1. Cosmic Planet (marked with Default Wallpaper badge)
  2. Ravi Hologram
  3. Blue Particle Intelligence
- Verified with `phase10_desktop_default_cosmic_planet.png` and `phase10_wallpaper_switcher_modal.png`.

### Task 2: Identity Text Updated to "AI & ML DEVELOPER"
- `src/components/intro/IntroOverlay.tsx`: Displays `"AI & ML DEVELOPER"` subtitle on the landing page.
- `src/components/desktop/Desktop.tsx`: Displays `"AI & ML DEVELOPER"` subtitle in the hero section.
- `src/data/profile.ts`: Updated `profile.title` to `'AI & ML Developer'`.
- Preserved educational text: `src/data/profile.ts` and `src/data/achievements.ts` degree titles (`B.Tech in Artificial Intelligence and Data Science`) remain strictly untouched and verified in `phase10_education_app_verified.png`.

### Task 3: High-Fidelity Facial Reconstruction Hologram
- Replaced source image with authoritative reference photograph (`media_1793899065610_2395d70e.jpg`, 135 KB).
- `portraitSampler.ts`:
  - Accurate circle boundary and HSV background segmentation (separates studio gray wall `S < 34, V > 125` without corrupting avatar border).
  - Preserves exact hairline, textured curly hair volume, ears, jawline, and shoulders.
  - High-contrast feature weighting: eyes, pupils, eyelids, sharp eyebrows, nose bridge/tip, nostrils, mustache, and trimmed beard are clearly preserved and never washed out into a white blob.
  - 3D facial depth: Nose bridge projection (`+0.30`), eye socket depression (`-0.13`), mouth/lip projection (`+0.12`), chin projection (`+0.14`), neck recession (`-0.18`), and hair shell (`+0.10`).
  - Added instant assembly for desktop wallpaper mode so switching to `hologram` on desktop reveals the completed face immediately without delay.
- Verified with `phase10_landing_page.png` and `phase10_wallpaper_ravi_hologram.png`.

### Task 4: Blue Particle Intelligence Improvements
- **Glowing "AI" inside the Cube**:
  - Sculpted letters "A" (with triangular legs and crossbar) and "I" (with column and serifs) inside the wireframe cube.
  - Given dedicated `aIsLetter` attribute with boosted point sizing, intense luminous cyan-white core glow, and forward-oriented turntable 3D rotation (`sin(uTime * 0.5) * 0.45`), keeping "AI" readable and aligned with the cube.
- **Botanical Tree Structure**:
  - Replaced generic shape with realistic botanical tree architecture:
    - Flared buttress root base anchoring into the concentric floor rings
    - Thick vertical trunk with fibrous striations
    - 5 major primary boughs spreading in 3D
    - Secondary and tertiary twigs creating visible branch gaps
    - Lush canopy neural clusters forming an organic spreading crown
- **Curved Transformation**:
  - Quadratic Bézier curved trajectory interpolation sweeps particles along cosmic stardust arcs between the cube with "AI" and the ancient cyber tree.
- Verified with `phase10_wallpaper_intelligence_cube_ai.png` (Tree) and `phase10_cube_ai_readable.png` (Cube with "AI").

---

## 2. Phase 7 Accomplishments & Visual QA

### Particle Hologram Engine (`src/components/hologram/*`, `src/shaders/*`)
- **Silhouette Sampling (`portraitSampler.ts`)**:
  - Upgraded sampler resolution to 256x256 with dual-patch neutral wall calibration.
  - Replaced rough luminance filtering with robust background vignette separation and circular border exclusion.
  - Implemented base silhouette density preservation (`0.65 + 0.35 * lum`) so dark hair, brows, and neck remain richly populated and never starve.
  - Added 3D dome curvature (`mDome * 0.75`) and feature displacement for genuine 3D perspective during rotation.
  - Scaled particle counts: 12k (low), 24k (medium), 36k (high), 4k (mini sidebar).
- **GLSL Shaders (`particle.vert`, `particle.frag`)**:
  - **Vertex Shader**: Smooth non-linear swirl assembly (`uAssemble`), organic idle breathing waves, dispersion burst on transition (`uBurst`), cursor repulsion with smooth radial falloff (`uRepel`), and camera parallax.
  - **Fragment Shader**: Tuned chromatic palette featuring deep cosmic violet (`#9048fa`), vibrant electric blue (`#2e8cff`), radiant neon cyan (`#24e5fa`), and luminous white (`#f8faff`). Point sizing calibrated for high-DPI displays with bright hot cores and soft Gaussian halos.

### Intro Experience (`IntroOverlay.tsx`)
- Sequenced animation: Particle assembly → "HELLO, I’M RAVI." (Syne font) → "AI & DATA SCIENCE DEVELOPER" → "ENTER RAVI.OS" glowing CTA button.
- Backdrop gradient ensures high contrast and legibility over the stardust field.
- "Skip intro" button immediately advances into the desktop.
- Smooth dispersion burst transition into desktop layout.

### Desktop & Window Manager (`Desktop.tsx`, `MenuBar.tsx`, `Sidebar.tsx`, `Dock.tsx`, `Window.tsx`)
- **Top Menu Bar**: Working File, View, Window, Terminal, and Help dropdown menus; fullscreen toggle; Particle Density selector; Reduce Motion toggle; live system clock.
- **Profile Sidebar**: Glass panel housing live mini 3D hologram in a rounded glass container, profile metadata, and application navigation with active cyan indicator dots.
- **Bottom Dock**: macOS magnification spring physics, active and minimized indicator dots, responsive touch scrolling on mobile with hidden scrollbars.
- **Window Manager**:
  - Full window lifecycle: open, close, minimize, maximize, restore, focus, and z-index elevation.
  - Window drag: robust global pointer listeners with bounds protection.
  - Window resize: interactive corner resize grip with tactile icon and minimum dimension enforcement.
  - Window cascade: smart multi-window offset avoiding sidebar overlap.
  - Maximized layout: docks cleanly between sidebar and screen margins on desktop, full-width sheet on mobile.

### Applications & Content
- **About Me**: Verified profile bio, education, location, portrait, GitHub & LinkedIn links.
- **Projects**: Showcase of verified projects (Ecolens AI, UrbanPlus.AI, Plinth, Alumni Management, Car Price Prediction, Automobile Freelance Project) in macOS card styling.
- **Skills**: Categorized technical stack pills (Programming, Frontend, Backend, AI/ML, Data, Tools).
- **Experience**: Timeline cards for verified experiences (IIT Ropar Vicharanashala internship, Freelance automobile project, Open-source contributions).
- **Achievements**: Honor cards for hackathons (Devpost FutureHacks 1st place, FutureHacks Advanced 1st place, SIH 8th rank).
- **Education**: Degree & schooling milestones with grades/percentiles (JECRC Jaipur, Class 12, Class 10, JEE Main).
- **Resume**: Executive credential sheet with verified information; dynamically embeds PDF iframe when `public/resume.pdf` is present.
- **Contact**: Interactive validated contact form with direct mailto generation and LinkedIn/GitHub quick links.
- **Terminal**: Interactive shell with real commands (`whoami`, `projects`, `skills`, `achievements`, `open <app>`, `clear`, `help`).

---

## 3. Technology Stack & Architecture
- **Framework**: React 19 + TypeScript + Vite 8
- **Styling**: Tailwind CSS v4 (@tailwindcss/vite) + custom glassmorphism tokens
- **3D / Particles**: Three.js + @react-three/fiber 9 + custom GLSL vertex/fragment shaders
- **Animation**: Framer Motion
- **State Management**: Zustand
- **Icons**: Lucide React + custom BrandIcons (GitHub, LinkedIn)
- **Bundler Optimization**: Rolldown manual chunking (`three-vendor`, `framer-vendor`, `index`)

---

## 4. Verification & Testing Results

| Test Category | Description | Status |
| :--- | :--- | :--- |
| **Build** | `tsc -b && vite build` clean with zero errors or chunk warnings | PASS |
| **Intro Assembly** | 24k particles assemble from space into recognizable human bust | PASS |
| **Intro Transition** | "ENTER RAVI.OS" dispersion burst shifts particles to desktop right-center | PASS |
| **Hologram Repulsion** | Cursor repels particles within radius and elastically restores | PASS |
| **All 9 Apps** | About, Projects, Skills, Experience, Achievements, Education, Resume, Contact, Terminal open correctly | PASS |
| **Multi-Window** | Multiple windows stay open simultaneously with cascading coordinates | PASS |
| **Window Drag** | Titlebar drag moves window across viewport with pointer capture | PASS |
| **Window Resize** | Corner resize handle resizes window smoothly with min bounds | PASS |
| **Min / Max** | Traffic lights minimize and maximize windows with dock indicators | PASS |
| **Dock Magnification**| Hover spring animation smoothly magnifies icons | PASS |
| **Settings** | Particle density (low/medium/high) and Reduce Motion toggle work | PASS |
| **Mobile (390px)** | Window displays as mobile sheet; dock scrolls cleanly without bar | PASS |
| **Tablet (768px)** | Responsive layout with collapsed rail / clean touch presentation | PASS |
| **Laptop (1024px)** | Collapsed glass sidebar rail with mini hologram | PASS |
| **Desktop (1440px)**| Full desktop OS with expanded sidebar, desktop shortcuts, hero typography | PASS |

---

## 5. How to Run

```bash
# 1. Install dependencies
npm install

# 2. Start local development server (http://localhost:5173 or 5174)
npm run dev

# 3. Production build
npm run build

# 4. Preview production build
npm run preview
```

---

## 6. Optional Future Enhancements (Post-Handoff)
- Drop a customized PDF file into `public/resume.pdf` if Ravi wants the embedded PDF view inside the Resume app.
- Populate `profile.email` in `src/data/profile.ts` with a public contact email address when available.
- Add project thumbnail screenshots in `src/assets/projects/` as they are created.
