import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import ringVert from '../../shaders/ring.vert?raw'
import ringFrag from '../../shaders/ring.frag?raw'
import { useDesktop } from '../../store/desktopStore'

interface SingleRingProps {
  radius: number
  tubeRadius: number
  speed: number
  phase: number
}

function PlasmaRingMesh({ radius, tubeRadius, speed, phase }: SingleRingProps) {
  const coreMat = useRef<THREE.ShaderMaterial>(null)
  const haloMat = useRef<THREE.ShaderMaterial>(null)

  // Saturated color palette matching reference board:
  // Cyan (#00E5FF), Electric Blue (#0B84FF), Violet (#8A2BE2)
  const cyan = useMemo(() => new THREE.Color(0.00, 0.90, 1.00), [])
  const blue = useMemo(() => new THREE.Color(0.04, 0.52, 1.00), [])
  const violet = useMemo(() => new THREE.Color(0.54, 0.17, 0.89), [])

  const coreUniforms = useMemo(() => ({
    uTime: { value: 0 },
    uSpeed: { value: speed },
    uPhase: { value: phase },
    uDim: { value: 1.0 },
    uBaseColor1: { value: cyan },
    uBaseColor2: { value: blue },
    uBaseColor3: { value: violet },
  }), [speed, phase, cyan, blue, violet])

  const haloUniforms = useMemo(() => ({
    uTime: { value: 0 },
    uSpeed: { value: speed },
    uPhase: { value: phase },
    uDim: { value: 0.50 },
    uBaseColor1: { value: cyan },
    uBaseColor2: { value: blue },
    uBaseColor3: { value: violet },
  }), [speed, phase, cyan, blue, violet])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const { phase: deskPhase, reducedMotion } = useDesktop.getState()
    const desk = deskPhase === 'desktop'
    const dim = desk ? 0.92 : 1.0

    if (coreMat.current) {
      coreMat.current.uniforms.uTime.value = reducedMotion ? 0 : t
      coreMat.current.uniforms.uDim.value = dim
    }
    if (haloMat.current) {
      haloMat.current.uniforms.uTime.value = reducedMotion ? 0 : t
      haloMat.current.uniforms.uDim.value = dim * 0.45
    }
  })

  return (
    <group>
      {/* 1. Luminous Core Energy Ribbon */}
      <mesh>
        <torusGeometry args={[radius, tubeRadius, 24, 180]} />
        <shaderMaterial
          ref={coreMat}
          uniforms={coreUniforms}
          vertexShader={ringVert}
          fragmentShader={ringFrag}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 2. Soft Glowing Atmospheric Halo */}
      <mesh>
        <torusGeometry args={[radius, tubeRadius * 2.2, 16, 120]} />
        <shaderMaterial
          ref={haloMat}
          uniforms={haloUniforms}
          vertexShader={ringVert}
          fragmentShader={ringFrag}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}

/**
 * Phase 22: Three Large Energy Rings (Atomic-Style Spherical Cage)
 *
 * Exactly 3 large energy rings around Ravi's hologram:
 * 1. Ring 1: Horizontal ring encircling the chest / collarbone level.
 * 2. Ring 2: Diagonal vertical ring 1 (tilted up-right and down-left).
 * 3. Ring 3: Diagonal vertical ring 2 crossing Ring 2 (tilted up-left and down-right).
 *
 * Together they form the iconic atomic-style orbital cage surrounding the hologram bust.
 *
 * Key Architectural Guarantees:
 * - Flowing Cyan, Electric Blue, and Violet energy continuously along all 3 rings.
 * - 100% Cursor Independence: Rings never react to cursor movements.
 */
export function EnergyRings() {
  const radius = 1.25
  const tube = 0.012

  return (
    <group name="energy-rings-cage">
      {/* Ring 1: Horizontal Ring encircling chest/neck level */}
      <group position={[0, -0.15, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <PlasmaRingMesh
          radius={radius}
          tubeRadius={tube}
          speed={1.0}
          phase={0.0}
        />
      </group>

      {/* Ring 2: Diagonal Vertical Ring 1 (tilted up-right, down-left) */}
      <group position={[0, 0.04, 0]} rotation={[0, Math.PI * 0.22, Math.PI * 0.26]}>
        <PlasmaRingMesh
          radius={radius}
          tubeRadius={tube}
          speed={1.12}
          phase={1.8}
        />
      </group>

      {/* Ring 3: Diagonal Vertical Ring 2 (crossing Ring 2 symmetrically: up-left, down-right) */}
      <group position={[0, 0.04, 0]} rotation={[0, -Math.PI * 0.22, -Math.PI * 0.26]}>
        <PlasmaRingMesh
          radius={radius}
          tubeRadius={tube}
          speed={1.06}
          phase={3.6}
        />
      </group>
    </group>
  )
}
