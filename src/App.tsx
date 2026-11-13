import { AnimatePresence } from 'framer-motion'
import { useMemo } from 'react'
import { WallpaperScene } from './components/wallpapers/WallpaperScene'
import { StaticHologram } from './components/hologram/StaticHologram'
import { IntroOverlay } from './components/intro/IntroOverlay'
import { Desktop } from './components/desktop/Desktop'
import { useDesktop } from './store/desktopStore'
import { useMousePosition } from './hooks/useMousePosition'
import { useReducedMotionSync } from './hooks/useReducedMotion'
import { useBreakpoint } from './hooks/useBreakpoint'

function hasWebGL() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')) } catch { return false }
}

export default function App() {
  if (typeof window !== 'undefined') (window as any).useDesktop = useDesktop
  const phase = useDesktop((s) => s.phase)
  const mouse = useMousePosition()
  const bp = useBreakpoint()
  const gl = useMemo(hasWebGL, [])
  useReducedMotionSync()

  return (
    <>
      <div className="wallpaper" />
      {gl ? <WallpaperScene mouse={mouse} /> : <StaticHologram />}
      <AnimatePresence>{phase === 'intro' && <IntroOverlay key="intro" />}</AnimatePresence>
      {phase === 'desktop' && <Desktop mouse={mouse} bp={bp} />}
    </>
  )
}
