import { useEffect, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Check, Sparkles, Orbit, Cpu, X } from 'lucide-react'
import { useDesktop, type WallpaperId } from '../../store/desktopStore'

interface WallpaperOption {
  id: WallpaperId
  title: string
  subtitle: string
  description: string
  tag: string
  color: string
  accentBorder: string
  icon: typeof Sparkles
  renderPreview: () => ReactNode
}

export function WallpaperSwitcher() {
  const wallpaper = useDesktop((s) => s.wallpaper)
  const setWallpaper = useDesktop((s) => s.setWallpaper)
  const setWallpaperPickerOpen = useDesktop((s) => s.setWallpaperPickerOpen)

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setWallpaperPickerOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setWallpaperPickerOpen])

  const options: WallpaperOption[] = [
    {
      id: 'planet',
      title: 'Cosmic Planet',
      subtitle: 'Reference Video 1 — Deep Space',
      description: 'Saturnian ringed planet in lower orbit with rising mint plasma flares, billowing purple nebula clouds, and moons.',
      tag: 'Default Wallpaper',
      color: 'from-emerald-500/20 via-purple-600/15 to-transparent',
      accentBorder: 'border-emerald-400/80 shadow-[0_0_20px_rgba(52,211,153,0.35)]',
      icon: Orbit,
      renderPreview: () => (
        <div className="relative h-28 w-full overflow-hidden rounded-lg bg-[#030612] flex items-center justify-center">
          {/* Twinkling star field */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-35" />
          {/* Purple cloud glow */}
          <div className="absolute -bottom-6 -left-6 h-20 w-24 rounded-full bg-purple-600/40 blur-xl" />
          <div className="absolute -bottom-6 -right-6 h-20 w-24 rounded-full bg-purple-700/40 blur-xl" />
          {/* Mint-cyan flame aurora behind planet */}
          <div className="absolute bottom-2 h-14 w-28 bg-gradient-to-t from-emerald-400/60 via-teal-300/40 to-transparent blur-md transform -skew-x-12" />
          {/* Planet body & rings */}
          <div className="relative mt-5 flex items-center justify-center">
            {/* Tilted Ring */}
            <div className="absolute h-4 w-32 -rotate-12 rounded-[100%] border-2 border-emerald-300/70 bg-transparent shadow-[0_0_12px_rgba(52,211,153,0.6)]" />
            {/* Planet Sphere */}
            <div className="relative h-14 w-14 rounded-full bg-gradient-to-b from-slate-900 via-indigo-950 to-black shadow-[inset_0_2px_8px_rgba(52,211,153,0.7),0_0_15px_rgba(0,0,0,0.9)]" />
          </div>
          {/* Orbiting Moon */}
          <div className="absolute top-3 right-5 h-2 w-2 rounded-full bg-cyan-200 shadow-[0_0_8px_#a7f3d0]" />
          <span className="absolute bottom-1.5 right-2 font-mono text-[9px] uppercase tracking-widest text-emerald-300/70">COSMIC RING</span>
        </div>
      ),
    },
    {
      id: 'hologram',
      title: 'Ravi Hologram',
      subtitle: 'Personal Identity 3D Particle Cloud',
      description: 'Face-accurate human particle hologram mapped from portrait contours with interactive cursor repulsion and depth.',
      tag: 'Identity',
      color: 'from-violet-500/20 via-cyan-500/10 to-transparent',
      accentBorder: 'border-violet-400/80 shadow-[0_0_20px_rgba(139,92,246,0.35)]',
      icon: Sparkles,
      renderPreview: () => (
        <div className="relative h-28 w-full overflow-hidden rounded-lg bg-black/70 flex items-center justify-center">
          {/* Subtle particle grid / stars */}
          <div className="absolute inset-0 bg-[radial-gradient(#8b5cf6_1px,transparent_1px)] [background-size:12px_12px] opacity-40" />
          {/* Stylized Face Contour Silhouette */}
          <div className="relative flex flex-col items-center">
            <div className="relative h-16 w-12 rounded-full border-2 border-dashed border-cyan-400/70 flex items-center justify-center shadow-[0_0_15px_rgba(56,189,248,0.5)]">
              {/* Eyes & Nose Bridge Indicators */}
              <div className="absolute top-5 flex w-7 justify-between px-1">
                <span className="h-1 w-1 rounded-full bg-cyan-200 shadow-[0_0_6px_#38bdf8]" />
                <span className="h-1 w-1 rounded-full bg-cyan-200 shadow-[0_0_6px_#38bdf8]" />
              </div>
              <div className="absolute top-7 h-2 w-0.5 bg-violet-300/80" />
              <div className="absolute top-10 h-0.5 w-3 rounded-full bg-cyan-300/80" />
            </div>
            {/* Shoulders */}
            <div className="mt-1 h-3 w-20 rounded-t-full border-t border-cyan-400/40 bg-gradient-to-b from-cyan-500/20 to-transparent" />
          </div>
          <span className="absolute bottom-1.5 right-2 font-mono text-[9px] uppercase tracking-widest text-cyan-300/60">3D HOLOGRAM</span>
        </div>
      ),
    },
    {
      id: 'intelligence',
      title: 'Blue Particle Intelligence',
      subtitle: 'Reference Video 2 — Neural Matrix',
      description: 'Branching luminous electric-blue neural tree with expanding ground energy ripples and 3D rotating cyber-cube morph.',
      tag: 'Neural Tree',
      color: 'from-blue-600/20 via-cyan-500/15 to-transparent',
      accentBorder: 'border-cyan-400/80 shadow-[0_0_20px_rgba(56,189,248,0.35)]',
      icon: Cpu,
      renderPreview: () => (
        <div className="relative h-28 w-full overflow-hidden rounded-lg bg-[#020817] flex items-center justify-center">
          {/* Concentric ground energy rings */}
          <div className="absolute bottom-1 flex items-center justify-center">
            <div className="h-4 w-28 rounded-[100%] border border-cyan-400/40" />
            <div className="absolute h-7 w-36 rounded-[100%] border border-cyan-500/30" />
            <div className="absolute h-10 w-44 rounded-[100%] border border-blue-600/20" />
          </div>
          {/* Glowing Neural Tree Trunk & Branches */}
          <div className="relative flex flex-col items-center mb-3">
            {/* Canopy neural cloud */}
            <div className="flex gap-2 mb-1">
              <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_8px_#38bdf8]" />
              <span className="h-3 w-3 rounded-full bg-white shadow-[0_0_10px_#ffffff]" />
              <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_8px_#38bdf8]" />
            </div>
            {/* Branches */}
            <div className="flex w-14 justify-between">
              <div className="h-5 w-0.5 rotate-45 bg-gradient-to-t from-cyan-400 to-white" />
              <div className="h-6 w-1 bg-cyan-300 shadow-[0_0_8px_#38bdf8]" />
              <div className="h-5 w-0.5 -rotate-45 bg-gradient-to-t from-cyan-400 to-white" />
            </div>
            {/* Trunk */}
            <div className="h-8 w-1.5 rounded-full bg-gradient-to-b from-cyan-300 via-blue-500 to-blue-800 shadow-[0_0_12px_#0284c7]" />
          </div>
          <span className="absolute bottom-1.5 right-2 font-mono text-[9px] uppercase tracking-widest text-cyan-300/70">NEURAL CUBE</span>
        </div>
      ),
    },
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200"
      onClick={() => setWallpaperPickerOpen(false)}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-2xl border border-white/20 bg-slate-950/85 p-6 shadow-[0_25px_65px_rgba(0,0,0,0.85)] backdrop-blur-2xl text-white select-none"
      >
        {/* macOS Window Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setWallpaperPickerOpen(false)}
              className="group flex h-3 w-3 items-center justify-center rounded-full bg-[#ff5f57] border border-[#e0443e]"
              title="Close"
              aria-label="Close"
            >
              <X size={8} className="opacity-0 group-hover:opacity-100 text-black/80 font-bold" />
            </button>
            <div className="h-3 w-3 rounded-full bg-[#febc2e] border border-[#d89e24]" />
            <div className="h-3 w-3 rounded-full bg-[#28c840] border border-[#1aab29]" />
          </div>

          <div className="text-center">
            <h2 className="font-display text-sm font-semibold tracking-wide text-white/90">
              Desktop Wallpaper
            </h2>
            <p className="text-[11px] text-white/45">Choose an animated real-time WebGL environment</p>
          </div>

          <button
            onClick={() => setWallpaperPickerOpen(false)}
            className="rounded-lg p-1 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Wallpaper Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {options.map((opt) => {
            const isActive = wallpaper === opt.id
            const Icon = opt.icon
            return (
              <button
                key={opt.id}
                onClick={() => setWallpaper(opt.id)}
                className={`group relative flex flex-col rounded-xl p-3 text-left transition-all duration-200 ${
                  isActive
                    ? `bg-white/[0.08] ${opt.accentBorder} ring-2 ring-white/30`
                    : 'bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] hover:border-white/25'
                }`}
              >
                {/* Visual Thumbnail */}
                <div className="relative mb-3 w-full">
                  {opt.renderPreview()}

                  {/* Active Badge */}
                  {isActive && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-cyan-500/90 px-2 py-0.5 text-[10px] font-semibold text-black shadow-lg backdrop-blur-md">
                      <Check size={10} strokeWidth={3} />
                      <span>Active</span>
                    </div>
                  )}

                  {/* Category Tag */}
                  <span className="absolute top-2 left-2 rounded-md bg-black/60 px-1.5 py-0.5 text-[9px] font-medium text-white/80 backdrop-blur-sm">
                    {opt.tag}
                  </span>
                </div>

                {/* Card Title & Subtitle */}
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon size={14} className={isActive ? 'text-cyan-300' : 'text-white/60'} />
                  <h3 className="font-semibold text-xs tracking-tight text-white group-hover:text-cyan-200 transition-colors">
                    {opt.title}
                  </h3>
                </div>

                <p className="text-[10px] font-medium text-white/50 mb-2 leading-tight">
                  {opt.subtitle}
                </p>

                <p className="text-[10px] text-white/40 leading-relaxed line-clamp-3">
                  {opt.description}
                </p>

                {/* Bottom select button bar */}
                <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
                  <span className={`text-[10px] font-mono ${isActive ? 'text-cyan-300 font-semibold' : 'text-white/40'}`}>
                    {isActive ? 'CURRENT' : 'CLICK TO APPLY'}
                  </span>
                  <span
                    className={`rounded-md px-2 py-0.5 text-[10px] font-medium transition-colors ${
                      isActive
                        ? 'bg-cyan-400 text-black'
                        : 'bg-white/10 text-white/80 group-hover:bg-white/20'
                    }`}
                  >
                    {isActive ? 'Applied' : 'Select'}
                  </span>
                </div>
              </button>
            )
          })}
        </div>

        {/* Footer Note */}
        <div className="mt-5 flex items-center justify-between pt-3 border-t border-white/10 text-[11px] text-white/45">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live WebGL Shader Simulation &bull; 60 FPS Optimized
          </span>
          <button
            onClick={() => setWallpaperPickerOpen(false)}
            className="rounded-lg bg-white/10 px-3 py-1 font-medium text-white hover:bg-white/20 transition-colors"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  )
}
