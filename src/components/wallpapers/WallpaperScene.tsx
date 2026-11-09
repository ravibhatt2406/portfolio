import { Canvas } from '@react-three/fiber'
import { ParticleHologram } from '../hologram/ParticleHologram'
import { StarField } from '../hologram/StarField'
import { particleCount } from '../hologram/portraitSampler'
import { CosmicPlanetWallpaper } from './CosmicPlanetWallpaper'
import { ParticleIntelligenceWallpaper } from './ParticleIntelligenceWallpaper'
import { useDesktop } from '../../store/desktopStore'
import type { MutableRefObject } from 'react'

type M = MutableRefObject<{ x: number; y: number; active: boolean }>

/**
 * Single full-screen Three.js WebGL canvas powering RAVI.OS.
 * - Intro phase: Renders the assembling personal particle hologram.
 * - Desktop phase: Dynamically renders the selected animated wallpaper:
 *   1. 'hologram'     — Ravi Hologram (accurate face silhouette + starfield)
 *   2. 'planet'       — Cosmic Planet (Saturn-like ringed planet, plasma flames, purple nebula, moons)
 *   3. 'intelligence' — Blue Particle Intelligence (neural branching tree, ground ripples, cyber-cube morph)
 */
export function WallpaperScene({ mouse }: { mouse: M }) {
  const phase = useDesktop((s) => s.phase)
  const wallpaper = useDesktop((s) => s.wallpaper)
  const density = useDesktop((s) => s.density)
  const count = particleCount(density)

  const isIntro = phase === 'intro' || phase === 'entering'
  const showHologram = isIntro || wallpaper === 'hologram'
  const showPlanet = !isIntro && wallpaper === 'planet'
  const showIntelligence = !isIntro && wallpaper === 'intelligence'

  return (
    <Canvas
      className="!fixed inset-0 z-0"
      style={{ pointerEvents: 'none' }}
      dpr={[1, window.innerWidth < 768 ? 1.5 : 1.75]}
      camera={{ position: [0, 0, 4], fov: 40 }}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
    >
      {showHologram && (
        <>
          <StarField mouse={mouse} count={window.innerWidth < 768 ? 700 : 1400} />
          <ParticleHologram count={count} mouse={mouse} />
        </>
      )}

      {showPlanet && <CosmicPlanetWallpaper mouse={mouse} />}

      {showIntelligence && <ParticleIntelligenceWallpaper mouse={mouse} />}
    </Canvas>
  )
}

