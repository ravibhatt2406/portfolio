import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useDesktop } from '../../store/desktopStore'

interface Props {
  mouse: React.MutableRefObject<{ x: number; y: number; active: boolean }>
}

/**
 * Wallpaper 3: Blue Particle Intelligence (Reference Video 2 & Phase 13 Spec)
 *
 * 1. Reference Particle Tree:
 *    - Flared buttress root base anchoring to the floor at y = -1.25
 *    - Thick luminous central trunk (y: -1.08 to -0.42) with internal twisted fiber strands
 *    - 10 primary boughs radiating outward with wide horizontal reach (x spanning ±1.35)
 *    - Secondary and tertiary branches arching gracefully inside the canopy
 *    - Wide, rounded dome umbrella canopy (x spanning ±1.75, y: 0.05 to 0.95)
 *    - Overlapping organic foliage clusters with electric blue, cyan, and violet particles and sparkling star nodes
 *
 * 2. Cosmic Cube with ONLY "AI" Letters:
 *    - 3D particle wireframe cube with face cross-lattices
 *    - Centered, proportional "AI" text formed of dense luminous cyan & white particles
 *    - 3D extrusion in Z, rotating synchronously with the cube
 *
 * 3. Cinematic Slow-Paced Animation Loop (34s Total Cycle):
 *    - 0.0s – 8.0s (8s): Pure Cube state with slow turntable rotation & readable "AI" text
 *    - 8.0s – 10.5s (2.5s): Energy Buildup & pulse intensification
 *    - 10.5s – 17.0s (6.5s): Smooth Cube-to-Tree transformation (roots & trunk form first, canopy unfurls)
 *    - 17.0s – 19.5s (2.5s): Tree Settling
 *    - 19.5s – 27.5s (8.0s): Tree Idle State (organic wind sway, trunk energy pulses, stardust twinkle)
 *    - 27.5s – 34.0s (6.5s): Smooth Tree-to-Cube transformation back into the cube lattice
 *
 * 4. Concentric Ground Energy Rings:
 *    - 6 concentric blue & cyan luminous rings beneath the tree roots with outward expanding energy ripples
 */
export function ParticleIntelligenceWallpaper({ mouse }: Props) {
  const { viewport } = useThree()
  const reducedMotion = useDesktop((s) => s.reducedMotion)
  const density = useDesktop((s) => s.density)

  const groupRef = useRef<THREE.Group>(null)
  const treeParticlesRef = useRef<THREE.Points>(null)
  const ringsRef = useRef<THREE.Mesh>(null)
  const sparksRef = useRef<THREE.Points>(null)
  const localTimeRef = useRef(0)

  const PARTICLE_COUNT = useMemo(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) return 18000
    if (density === 'low') return 22000
    if (density === 'medium') return 32000
    return 40000
  }, [density])

  // ==========================================
  // 1. Generate Tree & Cube Morph Geometry
  // ==========================================
  const { positionsTree, positionsCube, randoms, branchData, isLetterData, sizes } = useMemo(() => {
    const pTree = new Float32Array(PARTICLE_COUNT * 3)
    const pCube = new Float32Array(PARTICLE_COUNT * 3)
    const rnd = new Float32Array(PARTICLE_COUNT * 3)
    const branch = new Float32Array(PARTICLE_COUNT)
    const isLetter = new Float32Array(PARTICLE_COUNT)
    const sz = new Float32Array(PARTICLE_COUNT)

    // ------------------------------------------
    // A. Generate Compact 3D Holographic Cube & "AI" Typography (Phase 14 Spec)
    // ------------------------------------------
    // - Reduced overall visual size by ~45-50% (cubeHalf: 0.46 vs 0.95)
    // - Modern bold sans-serif "AI" typography (occupying 35-45% of cube face width, centered, clear spacing, NO serifs)
    // - 12 Bounding edges, 12 face diagonal lattices, planar face particles, and internal volumetric depth
    const cubeHalf = 0.46

    // 12 Bounding Edges
    const edges: [THREE.Vector3, THREE.Vector3][] = [
      // Bottom 4 edges
      [new THREE.Vector3(-cubeHalf, -cubeHalf, -cubeHalf), new THREE.Vector3(cubeHalf, -cubeHalf, -cubeHalf)],
      [new THREE.Vector3(cubeHalf, -cubeHalf, -cubeHalf), new THREE.Vector3(cubeHalf, -cubeHalf, cubeHalf)],
      [new THREE.Vector3(cubeHalf, -cubeHalf, cubeHalf), new THREE.Vector3(-cubeHalf, -cubeHalf, cubeHalf)],
      [new THREE.Vector3(-cubeHalf, -cubeHalf, cubeHalf), new THREE.Vector3(-cubeHalf, -cubeHalf, -cubeHalf)],
      // Top 4 edges
      [new THREE.Vector3(-cubeHalf, cubeHalf, -cubeHalf), new THREE.Vector3(cubeHalf, cubeHalf, -cubeHalf)],
      [new THREE.Vector3(cubeHalf, cubeHalf, -cubeHalf), new THREE.Vector3(cubeHalf, cubeHalf, cubeHalf)],
      [new THREE.Vector3(cubeHalf, cubeHalf, cubeHalf), new THREE.Vector3(-cubeHalf, cubeHalf, cubeHalf)],
      [new THREE.Vector3(-cubeHalf, cubeHalf, cubeHalf), new THREE.Vector3(-cubeHalf, cubeHalf, -cubeHalf)],
      // 4 Vertical corner pillars
      [new THREE.Vector3(-cubeHalf, -cubeHalf, -cubeHalf), new THREE.Vector3(-cubeHalf, cubeHalf, -cubeHalf)],
      [new THREE.Vector3(cubeHalf, -cubeHalf, -cubeHalf), new THREE.Vector3(cubeHalf, cubeHalf, -cubeHalf)],
      [new THREE.Vector3(cubeHalf, -cubeHalf, cubeHalf), new THREE.Vector3(cubeHalf, cubeHalf, cubeHalf)],
      [new THREE.Vector3(-cubeHalf, -cubeHalf, cubeHalf), new THREE.Vector3(-cubeHalf, cubeHalf, cubeHalf)],
    ]

    // 12 Face Diagonal Lattices (2 per face for hi-tech matrix structure)
    const faceDiagonals: [THREE.Vector3, THREE.Vector3][] = [
      // Front (z = +h)
      [new THREE.Vector3(-cubeHalf, -cubeHalf, cubeHalf), new THREE.Vector3(cubeHalf, cubeHalf, cubeHalf)],
      [new THREE.Vector3(-cubeHalf, cubeHalf, cubeHalf), new THREE.Vector3(cubeHalf, -cubeHalf, cubeHalf)],
      // Back (z = -h)
      [new THREE.Vector3(-cubeHalf, -cubeHalf, -cubeHalf), new THREE.Vector3(cubeHalf, cubeHalf, -cubeHalf)],
      [new THREE.Vector3(-cubeHalf, cubeHalf, -cubeHalf), new THREE.Vector3(cubeHalf, -cubeHalf, -cubeHalf)],
      // Right (x = +h)
      [new THREE.Vector3(cubeHalf, -cubeHalf, -cubeHalf), new THREE.Vector3(cubeHalf, cubeHalf, cubeHalf)],
      [new THREE.Vector3(cubeHalf, -cubeHalf, cubeHalf), new THREE.Vector3(cubeHalf, -cubeHalf, -cubeHalf)],
      // Left (x = -h)
      [new THREE.Vector3(-cubeHalf, -cubeHalf, -cubeHalf), new THREE.Vector3(-cubeHalf, cubeHalf, cubeHalf)],
      [new THREE.Vector3(-cubeHalf, -cubeHalf, cubeHalf), new THREE.Vector3(-cubeHalf, -cubeHalf, -cubeHalf)],
      // Top (y = +h)
      [new THREE.Vector3(-cubeHalf, cubeHalf, -cubeHalf), new THREE.Vector3(cubeHalf, cubeHalf, cubeHalf)],
      [new THREE.Vector3(-cubeHalf, cubeHalf, cubeHalf), new THREE.Vector3(cubeHalf, cubeHalf, -cubeHalf)],
      // Bottom (y = -h)
      [new THREE.Vector3(-cubeHalf, -cubeHalf, -cubeHalf), new THREE.Vector3(cubeHalf, -cubeHalf, cubeHalf)],
      [new THREE.Vector3(-cubeHalf, -cubeHalf, cubeHalf), new THREE.Vector3(cubeHalf, -cubeHalf, -cubeHalf)],
    ]

    // 1. Refined Modern Sans-Serif "AI" Typography (14% particle budget)
    // - Clean bold sans-serif letterforms
    // - Width = 0.336 (36.5% of cube face 0.92), Height = 0.34 (-0.17 to +0.17)
    // - Centered inside the cube with clear 0.090 gap between 'A' and 'I'
    const aiCount = Math.floor(PARTICLE_COUNT * 0.14)
    const aCount = Math.floor(aiCount * 0.55)

    for (let i = 0; i < aiCount; i++) {
      const i3 = i * 3
      isLetter[i] = 1.0 // Marker for AI letter shader highlights
      sz[i] = 1.05 + Math.random() * 0.35

      if (i < aCount) {
        // Modern Sans-Serif 'A': apex (-0.075, 0.17), left leg (-0.175, -0.17), right leg (0.025, -0.17), bar y = -0.04
        const roll = Math.random()
        const t = Math.random()
        const thickX = (Math.random() - 0.5) * 0.022
        const thickY = (Math.random() - 0.5) * 0.022
        const z = (Math.random() - 0.5) * 0.06 // volumetric depth

        if (roll < 0.44) {
          // Left diagonal leg
          pCube[i3] = -0.175 + t * 0.10 + thickX
          pCube[i3 + 1] = -0.17 + t * 0.34 + thickY
          pCube[i3 + 2] = z
        } else if (roll < 0.88) {
          // Right diagonal leg
          pCube[i3] = -0.075 + t * 0.10 + thickX
          pCube[i3 + 1] = 0.17 - t * 0.34 + thickY
          pCube[i3 + 2] = z
        } else {
          // Horizontal crossbar (clean sans-serif, no serifs)
          pCube[i3] = -0.145 + t * 0.14 + thickX
          pCube[i3 + 1] = -0.04 + thickY
          pCube[i3 + 2] = z
        }
      } else {
        // Modern Sans-Serif 'I': stem center +0.138, width 0.045, height 0.34 (-0.17 to +0.17)
        // Clean vertical column with NO top or bottom serifs!
        const t = Math.random()
        pCube[i3] = 0.138 + (Math.random() - 0.5) * 0.045
        pCube[i3 + 1] = -0.17 + t * 0.34 + (Math.random() - 0.5) * 0.015
        pCube[i3 + 2] = (Math.random() - 0.5) * 0.06
      }
    }

    // 2. 12 Bounding Edges (30% particles)
    const nEdges = Math.floor(PARTICLE_COUNT * 0.30)
    for (let i = aiCount; i < aiCount + nEdges; i++) {
      const i3 = i * 3
      isLetter[i] = 0.0
      sz[i] = 0.90 + Math.random() * 0.30

      const edgeIdx = Math.floor(Math.random() * edges.length)
      const edge = edges[edgeIdx]
      const t = Math.random()
      const jitter = (Math.random() - 0.5) * 0.008
      pCube[i3] = THREE.MathUtils.lerp(edge[0].x, edge[1].x, t) + jitter
      pCube[i3 + 1] = THREE.MathUtils.lerp(edge[0].y, edge[1].y, t) + jitter
      pCube[i3 + 2] = THREE.MathUtils.lerp(edge[0].z, edge[1].z, t) + jitter
    }

    // 3. Face Diagonal Lattices (25% particles)
    const nDiagonals = Math.floor(PARTICLE_COUNT * 0.25)
    for (let i = aiCount + nEdges; i < aiCount + nEdges + nDiagonals; i++) {
      const i3 = i * 3
      isLetter[i] = 0.0
      sz[i] = 0.75 + Math.random() * 0.25

      const diagIdx = Math.floor(Math.random() * faceDiagonals.length)
      const diag = faceDiagonals[diagIdx]
      const t = Math.random()
      const jitter = (Math.random() - 0.5) * 0.010
      pCube[i3] = THREE.MathUtils.lerp(diag[0].x, diag[1].x, t) + jitter
      pCube[i3 + 1] = THREE.MathUtils.lerp(diag[0].y, diag[1].y, t) + jitter
      pCube[i3 + 2] = THREE.MathUtils.lerp(diag[0].z, diag[1].z, t) + jitter
    }

    // 4. Face Planes & Internal Volumetric Cyber Depth (Remaining 31% particles)
    for (let i = aiCount + nEdges + nDiagonals; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3
      isLetter[i] = 0.0
      sz[i] = 0.65 + Math.random() * 0.25

      if (Math.random() < 0.60) {
        // Planar face stippling across the 6 faces to catch light in 3D
        const face = Math.floor(Math.random() * 6)
        const u = (Math.random() - 0.5) * 2.0 * cubeHalf * 0.98
        const v = (Math.random() - 0.5) * 2.0 * cubeHalf * 0.98
        if (face === 0) {
          pCube[i3] = u; pCube[i3 + 1] = v; pCube[i3 + 2] = cubeHalf
        } else if (face === 1) {
          pCube[i3] = u; pCube[i3 + 1] = v; pCube[i3 + 2] = -cubeHalf
        } else if (face === 2) {
          pCube[i3] = cubeHalf; pCube[i3 + 1] = u; pCube[i3 + 2] = v
        } else if (face === 3) {
          pCube[i3] = -cubeHalf; pCube[i3 + 1] = u; pCube[i3 + 2] = v
        } else if (face === 4) {
          pCube[i3] = u; pCube[i3 + 1] = cubeHalf; pCube[i3 + 2] = v
        } else {
          pCube[i3] = u; pCube[i3 + 1] = -cubeHalf; pCube[i3 + 2] = v
        }
      } else {
        // Interior volumetric cyber mist
        pCube[i3] = (Math.random() - 0.5) * cubeHalf * 1.6
        pCube[i3 + 1] = (Math.random() - 0.5) * cubeHalf * 1.6
        pCube[i3 + 2] = (Math.random() - 0.5) * cubeHalf * 1.6
      }
    }

    // ------------------------------------------
    // B. Generate Reference Botanical Particle Tree
    // ------------------------------------------
    // Panel 3 Spec:
    // - Buttress roots: flared base anchoring into ground rings at y = -1.25
    // - Trunk: vertical fluted luminous strands (y: -1.08 to -0.35)
    // - Boughs & Branches: 12 primary boughs arching outward (x up to ±1.5)
    // - Canopy: majestic, wide horizontal umbrella dome (x: ±1.85, y: -0.10 to 0.95)

    // 1. Flared Buttress Roots (6% particles, y: -1.25 to -1.05)
    const nRoots = Math.floor(PARTICLE_COUNT * 0.06)
    for (let i = 0; i < nRoots; i++) {
      const i3 = i * 3
      rnd[i3] = Math.random()
      rnd[i3 + 1] = Math.random()
      rnd[i3 + 2] = Math.random()

      const t = Math.random()
      const y = -1.25 + t * 0.22
      // Exponential flare at base reaching out to ground rings
      const flare = Math.pow(1.0 - t, 2.4) * 0.58 + 0.16
      const numRidges = 10
      const ridgeIdx = Math.floor(Math.random() * numRidges)
      const ridgeAngle = ridgeIdx * (Math.PI * 2 / numRidges) + (Math.random() - 0.5) * 0.20
      const r = flare + (Math.random() - 0.5) * 0.03
      pTree[i3] = r * Math.cos(ridgeAngle)
      pTree[i3 + 1] = y
      pTree[i3 + 2] = r * Math.sin(ridgeAngle)
      branch[i] = 0.0 // root level
    }

    // 2. Luminous Fluted Trunk with Twisted Fiber Strands (10% particles, y: -1.08 to -0.35)
    const nTrunk = Math.floor(PARTICLE_COUNT * 0.10)
    const numStrands = 18
    for (let i = nRoots; i < nRoots + nTrunk; i++) {
      const i3 = i * 3
      rnd[i3] = Math.random()
      rnd[i3 + 1] = Math.random()
      rnd[i3 + 2] = Math.random()

      const t = Math.random()
      const y = -1.08 + t * 0.73 // y from -1.08 up to -0.35
      // Trunk tapers slightly from 0.18 at bottom to 0.13 before bifurcating to 0.22 at the junction
      const trunkProfile = 0.17 * (1.0 - 0.35 * Math.sin(t * Math.PI)) + (t > 0.75 ? (t - 0.75) * 0.28 : 0.0)
      
      const strandIdx = Math.floor(Math.random() * numStrands)
      const baseTheta = strandIdx * (Math.PI * 2 / numStrands)
      // Gentle spiral twist along height
      const twistTheta = baseTheta + y * 0.55
      // Strand radius with small displacement for fibrous texture
      const strandR = trunkProfile * (0.82 + 0.18 * Math.cos(baseTheta * 2.0))
      const jitter = (Math.random() - 0.5) * 0.025
      
      pTree[i3] = (strandR + jitter) * Math.cos(twistTheta)
      pTree[i3 + 1] = y + (Math.random() - 0.5) * 0.015
      pTree[i3 + 2] = (strandR + jitter) * Math.sin(twistTheta)
      branch[i] = 0.08 + t * 0.18 // trunk level
    }

    // 3. Wide Spreading Primary Boughs & Secondary Branches (24% particles)
    type Bough = { start: THREE.Vector3; ctrl: THREE.Vector3; end: THREE.Vector3; r: number; lvl: number }
    const boughs: Bough[] = [
      // Left wide-spreading boughs (reaching x: -1.15 to -1.45)
      { start: new THREE.Vector3(0.0, -0.35, 0.0), ctrl: new THREE.Vector3(-0.55, -0.18, 0.08), end: new THREE.Vector3(-1.40, -0.02, 0.10), r: 0.075, lvl: 0.32 },
      { start: new THREE.Vector3(0.0, -0.35, 0.0), ctrl: new THREE.Vector3(-0.50, -0.10, -0.28), end: new THREE.Vector3(-1.35, 0.12, -0.32), r: 0.070, lvl: 0.32 },
      { start: new THREE.Vector3(0.0, -0.35, 0.0), ctrl: new THREE.Vector3(-0.45, -0.12, 0.32), end: new THREE.Vector3(-1.20, 0.08, 0.42), r: 0.070, lvl: 0.32 },
      { start: new THREE.Vector3(0.0, -0.32, 0.0), ctrl: new THREE.Vector3(-0.35, 0.02, -0.10), end: new THREE.Vector3(-0.85, 0.28, -0.15), r: 0.065, lvl: 0.35 },

      // Right wide-spreading boughs (reaching x: +1.15 to +1.45)
      { start: new THREE.Vector3(0.0, -0.35, 0.0), ctrl: new THREE.Vector3(0.55, -0.18, -0.08), end: new THREE.Vector3(1.40, -0.02, -0.10), r: 0.075, lvl: 0.32 },
      { start: new THREE.Vector3(0.0, -0.35, 0.0), ctrl: new THREE.Vector3(0.50, -0.10, 0.28), end: new THREE.Vector3(1.35, 0.12, 0.32), r: 0.070, lvl: 0.32 },
      { start: new THREE.Vector3(0.0, -0.35, 0.0), ctrl: new THREE.Vector3(0.45, -0.12, -0.32), end: new THREE.Vector3(1.20, 0.08, -0.42), r: 0.070, lvl: 0.32 },
      { start: new THREE.Vector3(0.0, -0.32, 0.0), ctrl: new THREE.Vector3(0.35, 0.02, 0.10), end: new THREE.Vector3(0.85, 0.28, 0.15), r: 0.065, lvl: 0.35 },

      // Front & back spreading boughs
      { start: new THREE.Vector3(0.0, -0.34, 0.0), ctrl: new THREE.Vector3(0.12, -0.08, 0.50), end: new THREE.Vector3(0.28, 0.15, 1.05), r: 0.068, lvl: 0.32 },
      { start: new THREE.Vector3(0.0, -0.34, 0.0), ctrl: new THREE.Vector3(-0.12, -0.08, -0.50), end: new THREE.Vector3(-0.28, 0.15, -1.05), r: 0.068, lvl: 0.32 },

      // Central crown ascending boughs
      { start: new THREE.Vector3(0.0, -0.30, 0.0), ctrl: new THREE.Vector3(-0.18, 0.12, 0.10), end: new THREE.Vector3(-0.35, 0.48, 0.12), r: 0.065, lvl: 0.38 },
      { start: new THREE.Vector3(0.0, -0.30, 0.0), ctrl: new THREE.Vector3(0.18, 0.12, -0.10), end: new THREE.Vector3(0.35, 0.48, -0.12), r: 0.065, lvl: 0.38 },
    ]

    const allBranchSegments: Bough[] = []
    const branchEndpoints: THREE.Vector3[] = []

    for (const b of boughs) {
      allBranchSegments.push(b)
      branchEndpoints.push(b.end.clone())

      const dir = new THREE.Vector3().subVectors(b.end, b.ctrl).normalize()
      // 3 secondary branches per main bough
      for (let k = 0; k < 3; k++) {
        const spreadAngle = (k - 1.0) * 0.52 + (Math.random() - 0.5) * 0.15
        const cosA = Math.cos(spreadAngle)
        const sinA = Math.sin(spreadAngle)
        const forkEnd = b.end.clone().add(new THREE.Vector3(
          (dir.x * cosA - dir.z * sinA) * 0.38,
          0.08 + Math.random() * 0.14,
          (dir.x * sinA + dir.z * cosA) * 0.38
        ))
        const forkCtrl = b.end.clone().add(forkEnd).multiplyScalar(0.5).add(new THREE.Vector3(0, 0.03, 0))
        allBranchSegments.push({ start: b.end.clone(), ctrl: forkCtrl, end: forkEnd, r: b.r * 0.60, lvl: 0.55 })
        branchEndpoints.push(forkEnd.clone())

        // 2 tertiary twigs per secondary branch
        for (let tw = 0; tw < 2; tw++) {
          const twigEnd = forkEnd.clone().add(new THREE.Vector3(
            (Math.random() - 0.5) * 0.28,
            0.06 + Math.random() * 0.10,
            (Math.random() - 0.5) * 0.28
          ))
          const twigCtrl = forkEnd.clone().add(twigEnd).multiplyScalar(0.5).add(new THREE.Vector3(0, 0.02, 0))
          allBranchSegments.push({ start: forkEnd.clone(), ctrl: twigCtrl, end: twigEnd, r: b.r * 0.38, lvl: 0.72 })
          branchEndpoints.push(twigEnd.clone())
        }
      }
    }

    const nBranches = Math.floor(PARTICLE_COUNT * 0.24)
    for (let i = nRoots + nTrunk; i < nRoots + nTrunk + nBranches; i++) {
      const i3 = i * 3
      rnd[i3] = Math.random()
      rnd[i3 + 1] = Math.random()
      rnd[i3 + 2] = Math.random()

      const seg = allBranchSegments[Math.floor(Math.random() * allBranchSegments.length)]
      const t = Math.random()
      const p0 = seg.start
      const p1 = seg.ctrl
      const p2 = seg.end
      const bx = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x
      const by = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y
      const bz = (1 - t) * (1 - t) * p0.z + 2 * (1 - t) * t * p1.z + t * t * p2.z

      const th = Math.random() * Math.PI * 2
      const rDisp = Math.sqrt(Math.random()) * seg.r * (1.0 - t * 0.30)
      pTree[i3] = bx + rDisp * Math.cos(th)
      pTree[i3 + 1] = by + rDisp * Math.sin(th) * 0.75
      pTree[i3 + 2] = bz + rDisp * Math.sin(th)
      branch[i] = seg.lvl + t * 0.14
    }

    // 4. Dense Luminous Horizontal Umbrella Foliage Dome (60% particles)
    // Matches Panel 3: Broad, full, continuous crown (x: ±1.85, y: -0.10 to 0.95, z: ±1.35)
    for (let i = nRoots + nTrunk + nBranches; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3
      rnd[i3] = Math.random()
      rnd[i3 + 1] = Math.random()
      rnd[i3 + 2] = Math.random()

      // 75% Distributed in continuous broad umbrella dome volume
      // 25% Clustered along branch endpoints to weave canopy with skeleton
      if (Math.random() < 0.75) {
        // Continuous umbrella dome with rounded top and soft drooping sides
        const u = Math.random()
        const radXZ = Math.pow(u, 0.48) // higher density toward outer rim for lush silhouette
        const th = Math.random() * 2.0 * Math.PI
        const x = radXZ * 1.82 * Math.cos(th)
        const z = radXZ * 1.30 * Math.sin(th)

        const normDist = Math.sqrt(Math.pow(x / 1.82, 2) + Math.pow(z / 1.30, 2))
        // Smooth parabola dome height profile:
        // Peak at center: y = 0.92, tapering to y = 0.15 at rim
        const yTop = 0.92 - 0.75 * Math.pow(normDist, 1.7)
        // Bottom boundary curves gently:
        const yBot = -0.05 - 0.15 * Math.pow(normDist, 1.3)
        const v = Math.random()
        const y = yBot + v * (yTop - yBot)

        // Micro organic clustering noise
        const noise = Math.sin(x * 3.5 + y * 2.5) * Math.cos(z * 3.5) * 0.05
        pTree[i3] = x + noise
        pTree[i3 + 1] = y + noise * 0.5
        pTree[i3 + 2] = z + noise
      } else {
        // Clustered around branch endpoints
        const pt = branchEndpoints[Math.floor(Math.random() * branchEndpoints.length)]
        const u = Math.random()
        const phi = Math.acos(2.0 * Math.random() - 1.0)
        const th = Math.random() * 2.0 * Math.PI
        const rCluster = Math.pow(u, 0.60) * 0.38
        pTree[i3] = pt.x + rCluster * Math.sin(phi) * Math.cos(th) * 1.35
        pTree[i3 + 1] = pt.y + rCluster * Math.cos(phi) * 0.85
        pTree[i3 + 2] = pt.z + rCluster * Math.sin(phi) * Math.sin(th) * 1.25
      }
      branch[i] = 0.85 + Math.random() * 0.15 // canopy level
    }

    return {
      positionsTree: pTree,
      positionsCube: pCube,
      randoms: rnd,
      branchData: branch,
      isLetterData: isLetter,
      sizes: sz,
    }
  }, [PARTICLE_COUNT])

  // ==========================================
  // 2. Tree & Cube Morph Shader Material
  // ==========================================
  const treeMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uMorph: { value: 1.0 }, // 1.0 = Cube, 0.0 = Tree
        uMouse: { value: new THREE.Vector2(0, 0) },
        uPixelRatio: { value: Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2) },
        uCubeCenter: { value: new THREE.Vector3(0.38, 0.32, 0.0) },
      },
      vertexShader: `
        uniform float uTime;
        uniform float uMorph;
        uniform vec2 uMouse;
        uniform float uPixelRatio;
        uniform vec3 uCubeCenter;

        attribute vec3 aCubePos;
        attribute vec3 aRandom;
        attribute float aBranch;
        attribute float aIsLetter;
        attribute float aSize;

        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          // Staggered transformation progress based on tree branch level:
          // When morphing to tree (uMorph -> 0.0): roots & trunk form first, then boughs reach out, and canopy blossoms!
          // When morphing to cube (uMorph -> 1.0): canopy draws inward first, trunk ascends last!
          float stagger = (1.0 - aBranch) * 0.30 + aRandom.x * 0.10;
          float p = clamp((uMorph - stagger * 0.32) / 0.75, 0.0, 1.0);
          p = smoothstep(0.0, 1.0, p);

          // 1. Local 3D Turntable Rotation for Cube state (Pitch + Yaw for authentic isometric 3D perspective)
          // Pitch tilt: -14 degrees downward so top face and depth are clearly visible
          float pitch = -0.24 * uMorph;
          float cosP = cos(pitch);
          float sinP = sin(pitch);
          // Yaw turntable rotation: slow sinusoidal sway within ±20 degrees
          float yaw = sin(uTime * 0.30) * 0.35 * uMorph;
          float cosY = cos(yaw);
          float sinY = sin(yaw);

          // Rotate local aCubePos around its own center:
          vec3 rPos = vec3(
            cosY * aCubePos.x + sinY * aCubePos.z,
            aCubePos.y,
            -sinY * aCubePos.x + cosY * aCubePos.z
          );
          vec3 localCubeRotated = vec3(
            rPos.x,
            cosP * rPos.y - sinP * rPos.z,
            sinP * rPos.y + cosP * rPos.z
          );

          // World position of the compact 3D holographic cube:
          vec3 cubeTargetPos = localCubeRotated + uCubeCenter;

          // 2. Coordinated Morphological Streamline Arcs between Cube & Tree
          float morphArc = sin(p * 3.14159);
          vec3 midArc = mix(position, cubeTargetPos, 0.5);
          // Trunk & roots drop cleanly down, canopy blossoms upward and outwards
          if (aBranch < 0.28) {
            midArc.y += morphArc * 0.15;
            midArc.xz += normalize(position.xz + vec2(0.001)) * 0.08 * morphArc;
          } else {
            midArc.y += morphArc * 0.35 * (aBranch - 0.2);
            midArc.xz += normalize(position.xz + vec2(0.001)) * 0.25 * morphArc;
          }

          vec3 basePos = (1.0 - p) * (1.0 - p) * position + 2.0 * (1.0 - p) * p * midArc + p * p * cubeTargetPos;

          // Gentle ambient wave breathing across the tree canopy
          float treeWeight = 1.0 - uMorph;
          float wind = sin(uTime * 0.85 + basePos.x * 1.2 + basePos.z * 0.9) * 0.015 * smoothstep(0.0, 1.0, basePos.y + 0.3) * treeWeight;
          vec3 finalPos = basePos + vec3(wind * 0.8, sin(uTime * 0.65 + basePos.x * 0.8) * 0.008 * treeWeight, wind * 0.4);

          // Interactive cursor repulsion (smooth radial falloff on tree canopy only)
          if (treeWeight > 0.05 && length(uMouse) > 0.001) {
            vec2 mouseWorld = uMouse * vec2(2.5, 1.8);
            vec2 diff = finalPos.xy - mouseWorld;
            float dist = length(diff);
            if (dist < 0.85 && dist > 0.001) {
              float force = (1.0 - dist / 0.85) * 0.16 * treeWeight;
              finalPos.xy += normalize(diff) * force;
            }
          }

          vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
          gl_Position = projectionMatrix * mvPosition;

          // Energy pulse climbing from roots through trunk into branches and foliage
          float energyWave = sin(uTime * 2.0 - aBranch * 5.5 + aRandom.x * 1.2);
          float isPulsing = smoothstep(0.72, 1.0, energyWave) * treeWeight;

          // Palette: Cyan (#22D3EE), Electric Blue (#3B82F6), Violet (#8B5CF6), Cool White (#F2F4FF)
          vec3 cCyan   = vec3(0.133, 0.827, 0.933);
          vec3 cBlue   = vec3(0.231, 0.510, 0.965);
          vec3 cViolet = vec3(0.545, 0.361, 0.965);
          vec3 cWhite  = vec3(0.970, 0.980, 1.000);

          vec3 col;
          float pSize = aSize * 10.0;
          float baseAlpha = 0.65;

          // Tree coloring (Reference Panel 3):
          if (aBranch < 0.28) {
            // Trunk & roots: Rich luminous cyan and electric blue strands!
            col = mix(cBlue, cCyan, 0.72 + 0.28 * sin(aRandom.z * 6.28));
            col = mix(col, cWhite, 0.35 * isPulsing); // Luminous pulse highlight
            pSize = aSize * (7.5 + isPulsing * 3.5); // Sized so strands do not blow out to white solid
            baseAlpha = 0.48 + 0.35 * isPulsing;
          } else if (aBranch < 0.82) {
            // Boughs & branches: Luminous cyan electric pathways through foliage
            col = mix(cBlue, cCyan, 0.82 + 0.18 * isPulsing);
            col = mix(col, cWhite, 0.25 * isPulsing);
            pSize = aSize * (8.5 + isPulsing * 4.0);
            baseAlpha = 0.58;
          } else {
            // Canopy foliage: Cosmic blend of Electric Blue, Royal Violet, and Cyan with White Stardust
            if (aRandom.x > 0.92) {
              // Sparkling white stardust nodes with dynamic twinkle
              float twinkle = 0.55 + 0.45 * sin(uTime * 3.5 + aRandom.y * 25.0);
              col = mix(cCyan, cWhite, twinkle);
              pSize = aSize * (12.0 + twinkle * 6.0);
              baseAlpha = 0.95;
            } else if (aRandom.x > 0.72) {
              // Radiant cyan highlights
              col = mix(cBlue, cCyan, 0.75 + 0.25 * isPulsing);
              pSize = aSize * (10.0 + aRandom.y * 4.0);
              baseAlpha = 0.68;
            } else if (aRandom.x > 0.38) {
              // Deep royal violet
              col = mix(cBlue, cViolet, 0.82);
              pSize = aSize * (11.0 + aRandom.y * 5.0);
              baseAlpha = 0.62;
            } else {
              // Pure electric blue
              col = cBlue;
              pSize = aSize * (11.0 + aRandom.y * 5.0);
              baseAlpha = 0.62;
            }
          }

          // Cube state coloring (Phase 14 Specification):
          if (uMorph > 0.05) {
            // Holographic edges and face lattices: cyan and electric blue
            vec3 cCubeEdge = mix(cBlue, cCyan, 0.70 + 0.30 * sin(uTime * 1.5 + aRandom.z * 3.0));
            col = mix(col, cCubeEdge, uMorph);
            pSize = aSize * (7.5 + 2.0 * sin(uTime * 2.0 + aRandom.x * 6.28));
            baseAlpha = mix(baseAlpha, 0.82, uMorph);

            // Modern Sans-serif AI letters: clean luminous cyan & white particles, controlled non-oversized glow
            if (aIsLetter > 0.5) {
              vec3 cAiLuminous = mix(cCyan, cWhite, 0.28 + 0.14 * sin(uTime * 2.2 + aRandom.y * 5.0));
              col = mix(col, cAiLuminous, uMorph);
              pSize = aSize * 8.5; // Controlled, crisp, distinct
              baseAlpha = mix(baseAlpha, 0.98, uMorph);
            }
          }

          vColor = col;
          gl_PointSize = pSize * (uPixelRatio / -mvPosition.z);
          vAlpha = baseAlpha * (0.85 + aRandom.z * 0.15);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          vec2 coord = gl_PointCoord - vec2(0.5);
          float d = length(coord);
          if (d > 0.5) discard;

          // Gaussian-like soft glow with crisp hot core
          float intensity = smoothstep(0.5, 0.06, d);
          float core = smoothstep(0.14, 0.0, d) * 0.45;

          vec3 finalColor = vColor * intensity + vec3(core * 0.35);
          gl_FragColor = vec4(finalColor, vAlpha * intensity);
        }
      `,
    })
  }, [])

  // ==========================================
  // 3. Ground Concentric Energy Rings Shader
  // ==========================================
  const groundRingsMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: { value: 0 },
        uMorph: { value: 1.0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uMorph;
        varying vec2 vUv;

        void main() {
          vec2 center = vUv - vec2(0.5);
          float dist = length(center) * 2.0;
          if (dist > 1.0) discard;

          // 6 Concentric circular energy rings
          float rings = 0.0;
          float ringRadii[6];
          ringRadii[0] = 0.12;
          ringRadii[1] = 0.24;
          ringRadii[2] = 0.40;
          ringRadii[3] = 0.58;
          ringRadii[4] = 0.78;
          ringRadii[5] = 0.95;

          for (int i = 0; i < 6; i++) {
            float rDist = abs(dist - ringRadii[i]);
            rings += smoothstep(0.022, 0.001, rDist) * (1.0 - float(i) * 0.12);
          }

          // Outward expanding energy ripples
          float ripples = 0.0;
          for (int i = 0; i < 3; i++) {
            float phase = mod(uTime * 0.22 + float(i) * 0.333, 1.0);
            float ripDist = abs(dist - phase);
            ripples += smoothstep(0.045, 0.0, ripDist) * (1.0 - phase);
          }

          // Radial cyber tick marks
          float angle = atan(center.y, center.x);
          float ticks = sin(angle * 32.0) * 0.5 + 0.5;
          ticks = step(0.65, ticks) * smoothstep(0.02, 0.0, abs(dist - 0.58)) * 0.35;

          // Central energy pool connection beneath the trunk/roots
          float centerPool = smoothstep(0.20, 0.0, dist) * 0.75;

          float totalIntensity = (rings * 0.85 + ripples * 0.75 + ticks + centerPool) * (1.0 - dist * 0.65);

          vec3 cCyan = vec3(0.133, 0.827, 0.933);
          vec3 cBlue = vec3(0.231, 0.510, 0.965);
          vec3 col = mix(cBlue, cCyan, ripples * 0.7 + centerPool * 0.3);

          float alpha = totalIntensity * 0.85;
          gl_FragColor = vec4(col, alpha);
        }
      `,
    })
  }, [])

  // ==========================================
  // 4. Ambient Rising Sparks
  // ==========================================
  const { sparkGeom, sparkMat } = useMemo(() => {
    const count = 450
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 4.2
      pos[i * 3 + 1] = -1.35 + Math.random() * 3.0
      pos[i * 3 + 2] = (Math.random() - 0.5) * 3.2
    }
    const geom = new THREE.BufferGeometry()
    geom.setAttribute('position', new THREE.BufferAttribute(pos, 3))

    const mat = new THREE.PointsMaterial({
      size: 0.04,
      color: new THREE.Color('#22d3ee'),
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    return { sparkGeom: geom, sparkMat: mat }
  }, [])

  // ==========================================
  // 5. Cinematic Slow-Paced Animation Loop
  // ==========================================
  useFrame((state, delta) => {
    localTimeRef.current += Math.min(delta, 0.05)
    const t = localTimeRef.current

    // Cinematic 34.0s Total Cycle (Phase 13 Timings):
    // 0.0s – 8.0s (8s): Pure Cube state with slow turntable rotation & readable "AI" text
    // 8.0s – 10.5s (2.5s): Energy buildup
    // 10.5s – 17.0s (6.5s): Smooth Cube-to-Tree transformation
    // 17.0s – 19.5s (2.5s): Tree settling
    // 19.5s – 27.5s (8.0s): Tree idle state
    // 27.5s – 34.0s (6.5s): Smooth Tree-to-Cube transformation
    let morphVal = 1.0 // Defaults to Cube
    if (!reducedMotion) {
      const cycle = t % 34.0
      if (cycle < 8.0) {
        morphVal = 1.0 // Pure Cube
      } else if (cycle < 10.5) {
        morphVal = 1.0 // Energy buildup before detach
      } else if (cycle < 17.0) {
        // Cube -> Tree
        const prog = (cycle - 10.5) / 6.5
        morphVal = 1.0 - THREE.MathUtils.smoothstep(prog, 0, 1)
      } else if (cycle < 27.5) {
        morphVal = 0.0 // Pure Tree (settling + continuous idle)
      } else {
        // Tree -> Cube
        const prog = (cycle - 27.5) / 6.5
        morphVal = THREE.MathUtils.smoothstep(prog, 0, 1)
      }
    } else {
      morphVal = 0.0 // In reduced motion, stay steady on majestic Tree
    }

    if (treeMaterial) {
      treeMaterial.uniforms.uTime.value = t
      treeMaterial.uniforms.uMorph.value = morphVal
      treeMaterial.uniforms.uMouse.value.set(
        mouse.current.active ? mouse.current.x : 0,
        mouse.current.active ? mouse.current.y : 0
      )

      // Responsive positioning of the 3D cube away from hero text ("I AM RAVI.")
      const vw = viewport.width
      let targetCenterX = 0.38
      let targetCenterY = 0.32
      let targetCubeH = 0.46

      if (vw < 2.2) {
        // Mobile (< 768px): hero text is centered at bottom; cube floats in open upper-half
        targetCenterX = 0.0
        targetCenterY = 0.45
        targetCubeH = 0.34
      } else if (vw < 3.6) {
        // Tablet (768px - 1100px): hero text is bottom-left; cube floats in upper right-center
        targetCenterX = 0.48
        targetCenterY = 0.35
        targetCubeH = 0.38
      } else {
        // Desktop (>= 1100px): hero text is bottom-left (left-[300px]); cube floats in upper right-center
        targetCenterX = 0.58
        targetCenterY = 0.35
        targetCubeH = 0.40
      }

      if (treeMaterial.uniforms.uCubeCenter) {
        treeMaterial.uniforms.uCubeCenter.value.set(targetCenterX, targetCenterY, 0.0)
      }

      // Ground concentric energy rings: smoothly position as holographic pedestal under cube,
      // and transition down to floor ground under the tree base during morph!
      if (ringsRef.current) {
        const ringX = THREE.MathUtils.lerp(0.0, targetCenterX, morphVal)
        const ringY = THREE.MathUtils.lerp(-1.25, targetCenterY - targetCubeH - 0.14, morphVal)
        const ringScale = THREE.MathUtils.lerp(1.0, 0.34, morphVal)
        ringsRef.current.position.set(ringX, ringY, 0)
        ringsRef.current.scale.set(ringScale, ringScale, 1.0)
      }
    }

    if (groundRingsMaterial) {
      groundRingsMaterial.uniforms.uTime.value = t
      groundRingsMaterial.uniforms.uMorph.value = morphVal
    }

    // Parallax group tilting
    if (groupRef.current) {
      const targetRotX = mouse.current.active ? -mouse.current.y * 0.12 : 0
      const targetRotY = mouse.current.active ? mouse.current.x * 0.20 : 0
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.05)
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.05)
    }

    // Rising sparks
    if (sparksRef.current) {
      const posAttr = sparksRef.current.geometry.attributes.position as THREE.BufferAttribute
      const arr = posAttr.array as Float32Array
      for (let i = 0; i < arr.length; i += 3) {
        arr[i + 1] += delta * 0.18
        if (arr[i + 1] > 1.8) {
          arr[i + 1] = -1.25
          arr[i] = (Math.random() - 0.5) * 4.0
          arr[i + 2] = (Math.random() - 0.5) * 3.2
        }
      }
      posAttr.needsUpdate = true
    }
  })

  return (
    <group ref={groupRef} position={[0, -0.05, 0]}>
      {/* 1. Main Neural Tree & Morphing Cyber-Cube with internal AI text */}
      <points ref={treeParticlesRef} material={treeMaterial}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positionsTree, 3]}
          />
          <bufferAttribute
            attach="attributes-aCubePos"
            args={[positionsCube, 3]}
          />
          <bufferAttribute
            attach="attributes-aRandom"
            args={[randoms, 3]}
          />
          <bufferAttribute
            attach="attributes-aBranch"
            args={[branchData, 1]}
          />
          <bufferAttribute
            attach="attributes-aIsLetter"
            args={[isLetterData, 1]}
          />
          <bufferAttribute
            attach="attributes-aSize"
            args={[sizes, 1]}
          />
        </bufferGeometry>
      </points>

      {/* 2. Concentric Expanding Ground Energy Rings */}
      <mesh
        ref={ringsRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1.25, 0]}
        material={groundRingsMaterial}
      >
        <planeGeometry args={[4.4, 4.4]} />
      </mesh>

      {/* 3. Ambient Floating Sparks */}
      <points
        ref={sparksRef}
        geometry={sparkGeom}
        material={sparkMat}
      />
    </group>
  )
}
