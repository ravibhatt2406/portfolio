import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import vert from '../../shaders/particle.vert?raw'
import frag from '../../shaders/particle.frag?raw'
import { buildParticles, type ParticleData } from './portraitSampler'
import { AmbientParticles } from './AmbientParticles'
import { EnergyRings } from './EnergyRings'
import { useDesktop } from '../../store/desktopStore'

interface Props {
  count: number
  mouse: React.MutableRefObject<{ x: number; y: number; active: boolean }>
  mini?: boolean
}

// Global inspectable hook for visual angle testing & verification
declare global {
  interface Window {
    __SET_HOLOGRAM_ANGLE?: (deg: number | null) => void
    __HOLOGRAM_LOCKED_ANGLE?: number | null
  }
}

/** One GPU particle system, reused by the intro, the desktop and (mini) the sidebar. */
export function ParticleHologram({ count, mouse, mini = false }: Props) {
  const [data, setData] = useState<ParticleData | null>(null)
  const group = useRef<THREE.Group>(null)
  const mat = useRef<THREE.ShaderMaterial>(null)
  const state = useRef({
    assemble: mini || (typeof window !== 'undefined' && useDesktop.getState().phase === 'desktop') ? 1 : 0,
    burst: 0, rx: 0, ry: 0, vx: 0, vy: 0, px: 0, py: 0, sc: 1, mx: 0, my: 0, dim: 1, repel: 0
  })
  const { viewport } = useThree()

  useEffect(() => {
    let live = true
    buildParticles(count).then((d) => live && setData(d))
    return () => { live = false }
  }, [count])

  // Hook for testing
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.__SET_HOLOGRAM_ANGLE = (deg: number | null) => {
        window.__HOLOGRAM_LOCKED_ANGLE = deg
      }
    }
  }, [])

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uAssemble: { value: mini ? 1 : 0 },
    uBurst: { value: 0 },
    uMotion: { value: 1 },
    uSize: { value: mini ? 1.40 : 1.35 },
    uPixelRatio: { value: Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2) },
    uMouse: { value: new THREE.Vector2(99, 99) },
    // Phase 21: Controlled micro-cursor interaction (protects facial core, deflects outer periphery)
    uRepel: { value: 0 },
    uDim: { value: 1 },
  }), [mini])

  useFrame((s, dt) => {
    if (!data || !mat.current || !group.current) return
    dt = Math.min(dt, 0.05)
    const st = state.current
    const { phase, reducedMotion } = useDesktop.getState()
    const u = mat.current.uniforms
    const narrow = viewport.width < viewport.height * 0.9

    u.uTime.value = s.clock.elapsedTime
    u.uMotion.value = reducedMotion ? 0 : 1

    // Intro assembly
    const instantAssemble = reducedMotion || mini || phase === 'desktop'
    st.assemble = instantAssemble ? 1 : Math.min(1, st.assemble + dt / 3.6)
    u.uAssemble.value = st.assemble

    // Dispersion pulse while entering, re-forming on the desktop
    const burstTarget = phase === 'entering' ? 1 : 0
    st.burst += (burstTarget - st.burst) * Math.min(1, dt * (burstTarget ? 3.2 : 2.2))
    u.uBurst.value = reducedMotion ? 0 : st.burst

    // Layout per phase: prominent, balanced, non-overlapping composition (Phase 4.E & Phase 5)
    const desk = phase === 'desktop' && !mini
    const tx = mini ? 0 : desk ? (narrow ? 0 : viewport.width * 0.20) : 0
    const ty = mini ? 0 : desk ? (narrow ? 0.35 : -0.02) : 0.02
    const tsc = mini ? 1 : desk ? (narrow ? 0.75 : 1.05) : narrow ? 0.88 : 1.12
    st.px += (tx - st.px) * Math.min(1, dt * 2.5)
    st.py += (ty - st.py) * Math.min(1, dt * 2.5)
    st.sc += (tsc - st.sc) * Math.min(1, dt * 2.5)
    st.dim += ((desk ? 0.92 : 1) - st.dim) * Math.min(1, dt * 2)
    u.uDim.value = st.dim
    group.current.position.set(st.px, st.py, 0)
    group.current.scale.setScalar(st.sc)

    // Subtle 3D rotation: slow gentle sway + mouse parallax, clamped strictly to safe angle range
    const m = mouse.current
    const lockedAngle = typeof window !== 'undefined' ? window.__HOLOGRAM_LOCKED_ANGLE : null

    let targetRotY: number
    let targetRotX: number

    if (lockedAngle !== null && lockedAngle !== undefined) {
      targetRotY = (lockedAngle * Math.PI) / 180
      targetRotX = 0
    } else {
      // Gentle idle sway (±4.5°) + subtle mouse parallax (±8°)
      const idleSway = mini || reducedMotion ? 0 : Math.sin(s.clock.elapsedTime * 0.35) * 0.08
      const mouseRotY = reducedMotion ? 0 : m.x * 0.16
      const mouseRotX = reducedMotion ? 0 : -m.y * 0.08
      // Strict clamping to safe ±12.5° range: prevents any broken or untextured profile views!
      targetRotY = Math.max(-0.22, Math.min(0.22, idleSway + mouseRotY))
      targetRotX = Math.max(-0.12, Math.min(0.12, mouseRotX))
    }

    st.vy += (targetRotY - st.ry) * 12 * dt
    st.vy *= 0.86
    st.vx += (targetRotX - st.rx) * 12 * dt
    st.vx *= 0.86
    st.ry += st.vy * dt * 6
    st.rx += st.vx * dt * 6
    group.current.rotation.set(reducedMotion ? 0 : st.rx, reducedMotion ? 0 : st.ry, 0)

    // Camera parallax (subtle)
    if (!mini) {
      const cam = s.camera
      const targetCamX = reducedMotion || lockedAngle !== null ? 0 : m.x * 0.18
      const targetCamY = reducedMotion || lockedAngle !== null ? 0 : m.y * 0.10
      cam.position.x += (targetCamX - cam.position.x) * Math.min(1, dt * 2)
      cam.position.y += (targetCamY - cam.position.y) * Math.min(1, dt * 2)
      cam.lookAt(0, 0, 0)
    }

    // Visibility inspection toggle for preview captures
    const showInt = typeof window !== 'undefined' ? window.__TOGGLE_HOLOGRAM_INTERNAL !== false : true
    mat.current.visible = showInt

    // Exact world-space mouse coordinates at hologram plane
    const worldMX = (m.x * viewport.width) / 2
    const worldMY = (m.y * viewport.height) / 2

    // Smooth cursor ripple activation & natural spring recovery
    if (m && m.active) {
      u.uMouse.value.set(worldMX, worldMY)
      st.repel += (1.0 - st.repel) * Math.min(1, dt * 10)
    } else {
      st.repel += (0.0 - st.repel) * Math.min(1, dt * 6)
      if (st.repel < 0.001) {
        u.uMouse.value.set(999, 999)
      }
    }
    u.uRepel.value = st.repel
  })

  if (!data) return null
  return (
    <group ref={group}>
      <points frustumCulled={false}>
        <bufferGeometry key={data.count}>
          <bufferAttribute attach="attributes-position" args={[data.target, 3]} />
          <bufferAttribute attach="attributes-aStart" args={[data.start, 3]} />
          <bufferAttribute attach="attributes-aRand" args={[data.rand, 4]} />
          <bufferAttribute attach="attributes-aProtect" args={[data.protect, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={mat} uniforms={uniforms} vertexShader={vert} fragmentShader={frag}
          transparent depthWrite={false} blending={THREE.AdditiveBlending}
        />
      </points>
      <AmbientParticles mouse={mouse} mini={mini} />
      {!mini && <EnergyRings />}
    </group>
  )
}
