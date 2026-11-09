import { useEffect, useRef, useState } from 'react'
import { Settings, Maximize, Wifi, Sparkles } from 'lucide-react'
import { useDesktop, APP_IDS, type Density, type WallpaperId } from '../../store/desktopStore'
import { APPS } from '../applications/registry'

type Item = { label: string; run: () => void } | 'sep'

function Clock() {
  const [t, setT] = useState(new Date())
  useEffect(() => {
    const i = setInterval(() => setT(new Date()), 1000)
    return () => clearInterval(i)
  }, [])

  return (
    <span className="tabular-nums text-white/85 font-medium text-xs">
      {t.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })}&nbsp;&nbsp;
      {t.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
    </span>
  )
}

export function MenuBar({ compact }: { compact: boolean }) {
  const s = useDesktop()
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fn = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setOpenMenu(null)
        setShowSettings(false)
      }
    }
    window.addEventListener('pointerdown', fn)
    return () => window.removeEventListener('pointerdown', fn)
  }, [])

  const fullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen?.()
    } else {
      document.documentElement.requestFullscreen?.()
    }
  }

  const openWins = APP_IDS.filter((id) => s.windows[id].open)

  const menus: Record<string, Item[]> = {
    File: [
      { label: 'Open Resume', run: () => s.open('resume') },
      { label: 'Open Contact', run: () => s.open('contact') },
      'sep',
      { label: 'Close All Windows', run: s.closeAll },
    ],
    View: [
      { label: 'Change Wallpaper...', run: () => s.setWallpaperPickerOpen(true) },
      'sep',
      { label: 'Toggle Full Screen', run: fullscreen },
      { label: 'Replay Intro', run: s.replayIntro },
    ],
    Window: [
      { label: 'Minimize All', run: s.minimizeAll },
      { label: 'Close All', run: s.closeAll },
      ...(openWins.length
        ? (['sep', ...openWins.map((id) => ({ label: APPS[id].title, run: () => s.open(id) }))] as Item[])
        : []),
    ],
    Terminal: [{ label: 'Open Terminal', run: () => s.open('terminal') }],
    Help: [
      { label: 'About RAVI.OS', run: () => s.open('about') },
      { label: 'Contact Ravi', run: () => s.open('contact') },
    ],
  }

  return (
    <header
      ref={ref}
      aria-label="System Menu Bar"
      className="glass-bar fixed inset-x-0 top-0 z-40 flex h-8 items-center justify-between border-b border-white/[0.08] px-3.5 text-[13px] select-none"
    >
      <div className="flex items-center gap-1.5">
        <span className="mr-2 flex items-center gap-2 font-display text-[13px] font-bold tracking-wide text-white">
          <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-violet-400 to-cyan-300 shadow-[0_0_10px_rgba(139,92,246,.9)]" />
          RAVI.OS
        </span>

        {!compact &&
          Object.entries(menus).map(([name, items]) => (
            <div key={name} className="relative">
              <button
                onClick={() => setOpenMenu(openMenu === name ? null : name)}
                onMouseEnter={() => openMenu && setOpenMenu(name)}
                className={`rounded-md px-2.5 py-0.5 font-medium transition-colors ${
                  openMenu === name ? 'bg-white/15 text-white' : 'text-white/75 hover:bg-white/10 hover:text-white'
                }`}
              >
                {name}
              </button>
              {openMenu === name && (
                <div className="glass absolute left-0 top-7 min-w-[200px] rounded-xl border border-white/15 p-1.5 shadow-[0_15px_35px_rgba(0,0,0,0.7)] backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100">
                  {items.map((it, i) =>
                    it === 'sep' ? (
                      <div key={i} className="my-1 h-px bg-white/10" />
                    ) : (
                      <button
                        key={it.label}
                        onClick={() => {
                          it.run()
                          setOpenMenu(null)
                        }}
                        className="block w-full rounded-lg px-3 py-1.5 text-left text-xs font-medium text-white/85 transition-colors hover:bg-violet-600/60 hover:text-white"
                      >
                        {it.label}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>
          ))}
      </div>

      <div className="relative flex items-center gap-3">
        <button
          onClick={() => s.setWallpaperPickerOpen(true)}
          aria-label="Change Wallpaper"
          title="Change Wallpaper"
          className="flex items-center gap-1 text-white/70 hover:text-white transition-colors"
        >
          <Sparkles size={14} />
          {!compact && <span className="text-[11px] font-medium text-white/70 hover:text-white">Wallpaper</span>}
        </button>
        <Wifi size={14} className="text-white/70" aria-label="Connected" />
        <button
          onClick={fullscreen}
          aria-label="Toggle full screen"
          className="text-white/70 hover:text-white transition-colors"
        >
          <Maximize size={14} />
        </button>
        <button
          onClick={() => setShowSettings(!showSettings)}
          aria-label="Settings"
          className="text-white/70 hover:text-white transition-colors"
        >
          <Settings size={14} />
        </button>
        <Clock />

        {showSettings && (
          <div className="glass absolute right-3 top-9 w-72 rounded-2xl border border-white/15 p-4 text-white/90 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100">
            {/* Wallpaper Section */}
            <div className="mb-4 border-b border-white/10 pb-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-white/50">Wallpaper</p>
                <button
                  onClick={() => {
                    setShowSettings(false)
                    s.setWallpaperPickerOpen(true)
                  }}
                  className="text-[11px] font-medium text-cyan-300 hover:text-cyan-200 transition-colors"
                >
                  Gallery &rarr;
                </button>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'planet', label: 'Cosmic' },
                  { id: 'hologram', label: 'Hologram' },
                  { id: 'intelligence', label: 'Intelligence' },
                ].map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => s.setWallpaper(id as WallpaperId)}
                    className={`rounded-xl py-1.5 text-xs font-medium transition-all ${
                      s.wallpaper === id
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_10px_rgba(56,189,248,0.5)]'
                        : 'bg-white/[0.06] text-white/70 hover:bg-white/12 hover:text-white'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/50">Particle Density</p>
            <div className="mb-4 flex gap-1.5">
              {(['low', 'medium', 'high'] as Density[]).map((d) => (
                <button
                  key={d}
                  onClick={() => s.setDensity(d)}
                  className={`flex-1 rounded-xl py-1.5 text-xs font-semibold capitalize transition-all ${
                    s.density === d
                      ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-[0_0_12px_rgba(139,92,246,0.5)]'
                      : 'bg-white/[0.06] text-white/70 hover:bg-white/12 hover:text-white'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            <label className="flex cursor-pointer items-center justify-between text-xs font-medium text-white/80">
              <span>Reduce Motion</span>
              <input
                type="checkbox"
                checked={s.reducedMotion}
                onChange={(e) => s.setReducedMotion(e.target.checked)}
                className="h-4 w-4 rounded accent-violet-500 cursor-pointer"
              />
            </label>
          </div>
        )}
      </div>
    </header>
  )
}
