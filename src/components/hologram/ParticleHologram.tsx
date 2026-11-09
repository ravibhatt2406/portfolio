import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import vert from '../../shaders/particle.vert?raw'
import frag from '../../shaders/particle.frag?raw'
import { buildParticles, type ParticleData } from './portraitSampler'
import { useDesktop } from '../../store/desktopStore'

interface Props {
  count: number
  mouse: React.MutableRefObject<{ x: number; y: number; active: boolean }>
  mini?: boolean
}

/** One GPU particle system, reused by the intro, the desktop and (mini) the sidebar. */
export function ParticleHologram({ count, mouse, mini = false }: Props) {
  const [data, setData] = useState<ParticleData | null>(null)
  const group = useRef<THREE.Group>(null)
  const mat = useRef<THREE.ShaderMaterial>(null)
  const state = useRef({
    assemble: mini || (typeof window !== 'undefined' && useDesktop.getState().phase === 'desktop') ? 1 : 0,
    burst: 0, rx: 0, ry: 0, vx: 0, vy: 0, px: 0, py: 0, sc: 1, mx: 0, my: 0, dim: 1
  })
  const { viewport } = useThree()

  useEffect(() => {
    let live = true
    buildParticles(count).then((d) => live && setData(d))
    return () => { live = false }
  }, [count])

  const uniforms = useMemo(() => ({
    uTime: { value: 0 }, uAssemble: { value: mini ? 1 : 0 }, uBurst: { value: 0 },
    uMotion: { value: 1 }, uSize: { value: mini ? 1.35 : 1.15 },
    uPixelRatio: { value: Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2) },
    uMouse: { value: new THREE.Vector2(99, 99) }, uRepel: { value: mini ? 0 : 1 }, uDim: { value: 1 },
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

    // intro assembly (skipped for reduced motion / mini / when already on desktop)
    const instantAssemble = reducedMotion || mini || phase === 'desktop'
    st.assemble = instantAssemble ? 1 : Math.min(1, st.assemble + dt / 3.6)
    u.uAssemble.value = st.assemble

    // dispersion pulse while entering, re-forming on the desktop
    const burstTarget = phase === 'entering' ? 1 : 0
    st.burst += (burstTarget - st.burst) * Math.min(1, dt * (burstTarget ? 3.2 : 2.2))
    u.uBurst.value = reducedMotion ? 0 : st.burst

    // layout per phase
    const desk = phase === 'desktop' && !mini
    const tx = mini ? 0 : desk ? (narrow ? 0 : viewport.width * 0.17) : 0
    const ty = mini ? 0 : desk ? (narrow ? 0.36 : -0.04) : 0.05
    const tsc = mini ? 1 : desk ? (narrow ? 0.65 : 0.88) : narrow ? 0.85 : 1.02
    st.px += (tx - st.px) * Math.min(1, dt * 2.5)
    st.py += (ty - st.py) * Math.min(1, dt * 2.5)
    st.sc += (tsc - st.sc) * Math.min(1, dt * 2.5)
    st.dim += ((desk ? 0.92 : 1) - st.dim) * Math.min(1, dt * 2)
    u.uDim.value = st.dim
    group.current.position.set(st.px, st.py, 0)
    group.current.scale.setScalar(st.sc)

    // cursor → rotation with inertia (spring + damping)
    const m = mouse.current
    const rotY = m.x * 0.55, rotX = -m.y * 0.22
    st.vy += (rotY - st.ry) * 14 * dt; st.vy *= 0.86
    st.vx += (rotX - st.rx) * 14 * dt; st.vx *= 0.86
    st.ry += st.vy * dt * 6; st.rx += st.vx * dt * 6
    group.current.rotation.set(reducedMotion ? 0 : st.rx, reducedMotion ? 0 : st.ry, 0)

    // cursor → repulsion point in world space
    if (!mini && m.active && !reducedMotion) {
      st.mx += (m.x * viewport.width * 0.5 - st.mx) * Math.min(1, dt * 12)
      st.my += (m.y * viewport.height * 0.5 - st.my) * Math.min(1, dt * 12)
      u.uMouse.value.set(st.mx, st.my)
    } else u.uMouse.value.set(99, 99)

    // camera parallax
    if (!mini) {
      const cam = s.camera
      cam.position.x += ((reducedMotion ? 0 : m.x * 0.35) - cam.position.x) * Math.min(1, dt * 2)
      cam.position.y += ((reducedMotion ? 0 : m.y * 0.2) - cam.position.y) * Math.min(1, dt * 2)
      cam.lookAt(0, 0, 0)
    }
  })

  if (!data) return null
  return (
    <group ref={group}>
      <points frustumCulled={false}>
        <bufferGeometry key={data.count}>
          <bufferAttribute attach="attributes-position" args={[data.target, 3]} />
          <bufferAttribute attach="attributes-aStart" args={[data.start, 3]} />
          <bufferAttribute attach="attributes-aRand" args={[data.rand, 4]} />
        </bufferGeometry>
        <shaderMaterial
          ref={mat} uniforms={uniforms} vertexShader={vert} fragmentShader={frag}
          transparent depthWrite={false} blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  )
}
