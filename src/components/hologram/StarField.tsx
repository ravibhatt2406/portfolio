import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/** Distant dust layer — moves at a different rate than the hologram for real parallax. */
export function StarField({ mouse, count = 1400 }: { mouse: React.MutableRefObject<{ x: number; y: number }>; count?: number }) {
  const ref = useRef<THREE.Points>(null)
  const pos = useMemo(() => {
    const a = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      a[i * 3] = (Math.random() - 0.5) * 16
      a[i * 3 + 1] = (Math.random() - 0.5) * 9
      a[i * 3 + 2] = -2 - Math.random() * 5
    }
    return a
  }, [count])
  useFrame((s, dt) => {
    if (!ref.current) return
    const g = ref.current
    g.position.x += (-mouse.current.x * 0.45 - g.position.x) * Math.min(1, dt * 1.5)
    g.position.y += (-mouse.current.y * 0.25 - g.position.y) * Math.min(1, dt * 1.5)
    g.rotation.z = s.clock.elapsedTime * 0.004
  })
  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[pos, 3]} /></bufferGeometry>
      <pointsMaterial size={0.035} color="#8b9cff" transparent opacity={0.5} depthWrite={false} blending={THREE.AdditiveBlending} sizeAttenuation />
    </points>
  )
}
