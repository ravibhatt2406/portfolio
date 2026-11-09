import { Canvas } from '@react-three/fiber'
import { ParticleHologram } from './ParticleHologram'
import { StarField } from './StarField'
import { particleCount } from './portraitSampler'
import { useDesktop } from '../../store/desktopStore'
import type { MutableRefObject } from 'react'

type M = MutableRefObject<{ x: number; y: number; active: boolean }>

/** The single full-screen canvas that lives behind both intro and desktop. */
export function HologramScene({ mouse }: { mouse: M }) {
  const density = useDesktop((s) => s.density)
  const count = particleCount(density)
  return (
    <Canvas
      className="!fixed inset-0 z-0"
      style={{ pointerEvents: 'none' }}
      dpr={[1, window.innerWidth < 768 ? 1.5 : 1.75]}
      camera={{ position: [0, 0, 4], fov: 40 }}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
    >
      <StarField mouse={mouse} count={window.innerWidth < 768 ? 700 : 1400} />
      <ParticleHologram count={count} mouse={mouse} />
    </Canvas>
  )
}

/** Small live hologram for the profile sidebar. */
export function MiniHologram({ mouse }: { mouse: M }) {
  return (
    <Canvas
      style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 3.6], fov: 38 }}
      gl={{ antialias: false, alpha: true }}
    >
      <ParticleHologram count={particleCount('medium', true)} mouse={mouse} mini />
    </Canvas>
  )
}
