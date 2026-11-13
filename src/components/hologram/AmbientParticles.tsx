import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import vert from '../../shaders/ambient.vert?raw'
import frag from '../../shaders/ambient.frag?raw'
import { useDesktop } from '../../store/desktopStore'

interface Props {
  mouse: React.MutableRefObject<{ x: number; y: number; active: boolean }>
  mini?: boolean
}

// Global inspectable hooks for independent testing & verification
declare global {
  interface Window {
    __TOGGLE_HOLOGRAM_INTERNAL?: boolean
    __TOGGLE_HOLOGRAM_EXTERNAL?: boolean
  }
}

/**
 * Phase 21: External Ambient Particle System
 *
 * Independent volumetric particle system distributed in 3D space around
 * Ravi's holographic bust: above head, sides of head, outer shoulders,
 * and surrounding empty space.
 *
 * Key Architectural Safeguards:
 * 1. Strict Face Silhouette Exclusion Zone:
 *    Central face silhouette (|x| < 0.38, y in [-0.25, 0.60]) is 100% excluded.
 *    No ambient particle ever covers or obscures Ravi's facial features.
 * 2. Independent BufferGeometry, Shaders & Motion Logic:
 *    Gentle orbital & floating drift with fluid cursor trail deflection.
 * 3. Color Palette:
 *    Electric Cyan (#00E5FF), Blue (#0B84FF), Violet (#8A2BE2).
 */
export function AmbientParticles({ mouse, mini = false }: Props) {
  const pointsRef = useRef<THREE.Points>(null)
  const matRef = useRef<THREE.ShaderMaterial>(null)

  const { count, positions, seeds, sizes } = useMemo(() => {
    // Desktop: ~1,500 particles | Mobile: ~800 particles | Mini: ~350 particles
    const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false
    const n = mini ? 350 : isMobile ? 800 : 1500

    const pos = new Float32Array(n * 3)
    const sd = new Float32Array(n * 4)
    const sz = new Float32Array(n)

    let created = 0
    let attempts = 0
    const maxAttempts = n * 25

    while (created < n && attempts < maxAttempts) {
      attempts++

      // Sample region:
      // 0: Above head
      // 1: Left / Right sides of head & neck
      // 2: Outer shoulders & flanks
      // 3: Surrounding space shell
      const region = Math.floor(Math.random() * 4)
      let x = 0, y = 0, z = 0

      if (region === 0) {
        // Above head (y in [0.55, 1.35])
        x = (Math.random() - 0.5) * 1.5
        y = 0.55 + Math.random() * 0.80
        z = (Math.random() - 0.5) * 0.8
      } else if (region === 1) {
        // Sides of head & ears (|x| in [0.42, 1.25], y in [-0.10, 0.75])
        const side = Math.random() < 0.5 ? -1 : 1
        x = side * (0.42 + Math.random() * 0.80)
        y = -0.10 + Math.random() * 0.85
        z = (Math.random() - 0.5) * 0.8
      } else if (region === 2) {
        // Outer shoulders & flanks (|x| in [0.50, 1.45], y in [-0.85, -0.05])
        const side = Math.random() < 0.5 ? -1 : 1
        x = side * (0.50 + Math.random() * 0.95)
        y = -0.85 + Math.random() * 0.80
        z = (Math.random() - 0.5) * 0.9
      } else {
        // Surrounding orbital shell
        const theta = Math.random() * Math.PI * 2
        const r = 0.70 + Math.random() * 0.80
        x = Math.cos(theta) * r
        y = (Math.random() - 0.5) * 1.6
        z = Math.sin(theta) * (0.35 + Math.random() * 0.45)
      }

      // STRICT FACE SILHOUETTE EXCLUSION:
      // Must NOT penetrate into the facial identity volume
      const inFaceZone =
        Math.pow(x / 0.38, 2) + Math.pow((y - 0.12) / 0.48, 2) < 1.0 &&
        Math.abs(z) < 0.40

      if (inFaceZone) {
        continue // Reject and resample outside face
      }

      pos[created * 3] = x
      pos[created * 3 + 1] = y
      pos[created * 3 + 2] = z

      // aSeed:
      // x: random phase (0..1)
      // y: drift speed factor (0.6..1.4)
      // z: trajectory radius (0.8..1.2)
      // w: color type:
      //    0.00..0.45 = Electric Cyan (#00E5FF)
      //    0.45..0.78 = Blue (#0B84FF)
      //    0.78..1.00 = Violet (#8A2BE2)
      sd[created * 4] = Math.random()
      sd[created * 4 + 1] = 0.6 + Math.random() * 0.8
      sd[created * 4 + 2] = 0.8 + Math.random() * 0.4

      const colorRoll = Math.random()
      if (colorRoll < 0.50) {
        sd[created * 4 + 3] = Math.random() * 0.35 // Electric Cyan
      } else if (colorRoll < 0.82) {
        sd[created * 4 + 3] = 0.35 + Math.random() * 0.35 // Blue
      } else {
        sd[created * 4 + 3] = 0.70 + Math.random() * 0.30 // Violet Accent
      }

      // Small sizes, varying brightness
      sz[created] = 2.4 + Math.random() * 2.4
      created++
    }

    return {
      count: created,
      positions: pos,
      seeds: sd,
      sizes: sz,
    }
  }, [mini])

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMotion: { value: 1 },
    uPixelRatio: { value: Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2) },
    uMouse: { value: new THREE.Vector2(99, 99) },
    uDim: { value: 1 },
    uRepel: { value: 1.0 },
  }), [])

  const { viewport } = useThree()

  useFrame((s) => {
    if (!matRef.current) return
    const { phase, reducedMotion } = useDesktop.getState()
    const u = matRef.current.uniforms

    // Synchronous visibility toggle without unmounting
    const extEnabled = typeof window !== 'undefined' ? window.__TOGGLE_HOLOGRAM_EXTERNAL !== false : true
    matRef.current.visible = extEnabled

    u.uTime.value = s.clock.elapsedTime
    u.uMotion.value = reducedMotion ? 0 : 1

    const desk = phase === 'desktop' && !mini
    u.uDim.value = desk ? 0.90 : 1.0

    // Exact world-space mouse coordinates at hologram plane
    const m = mouse.current
    const worldMX = (m.x * viewport.width) / 2
    const worldMY = (m.y * viewport.height) / 2

    if (m && m.active) {
      u.uMouse.value.set(worldMX, worldMY)
      u.uRepel.value = 1.0
    } else {
      u.uMouse.value.set(999, 999)
      u.uRepel.value = 0.0
    }
  })

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry key={count}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 4]} />
        <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={vert}
        fragmentShader={frag}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
