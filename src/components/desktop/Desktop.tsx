import { motion, AnimatePresence } from 'framer-motion'
import type { MutableRefObject } from 'react'
import { FolderKanban, FileText, Mail, Gamepad2 } from 'lucide-react'
import { MenuBar } from './MenuBar'
import { Sidebar } from './Sidebar'
import { Dock } from './Dock'
import { WallpaperSwitcher } from './WallpaperSwitcher'
import { WindowManager } from '../windows/WindowManager'
import { StickyNotesWidget } from '../notes/StickyNotesWidget'
import { useDesktop, type AppId } from '../../store/desktopStore'
import { profile } from '../../data/profile'
import type { Breakpoint } from '../../hooks/useBreakpoint'

const SHORTCUTS: { id: AppId; label: string; Icon: typeof Mail }[] = [
  { id: 'projects', label: 'Projects', Icon: FolderKanban },
  { id: 'resume', label: 'Resume', Icon: FileText },
  { id: 'contact', label: 'Contact', Icon: Mail },
  { id: 'games', label: 'Games', Icon: Gamepad2 },
]

export function Desktop({
  mouse,
  bp,
}: {
  mouse: MutableRefObject<{ x: number; y: number; active: boolean }>
  bp: Breakpoint
}) {
  const open = useDesktop((s) => s.open)
  const wallpaperPickerOpen = useDesktop((s) => s.wallpaperPickerOpen)
  const mobile = bp === 'mobile'

  return (
    <motion.div
      className="fixed inset-0 z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.9 }}
    >
      <MenuBar compact={mobile} />
      {!mobile && <Sidebar mouse={mouse} collapsed={bp === 'tablet'} />}

      {/* hero copy — sits behind windows, never blocks them */}
      <div
        className={`pointer-events-none absolute ${
          mobile
            ? 'inset-x-6 bottom-32 text-center'
            : bp === 'tablet'
            ? 'bottom-36 left-28'
            : 'bottom-36 left-[300px]'
        }`}
      >
        <h1 className="font-display text-[clamp(2.2rem,5.2vw,4.8rem)] font-extrabold leading-[0.95] tracking-tight text-white">
          I AM RAVI.
        </h1>
        <p className="mt-3 text-[clamp(.7rem,1.2vw,.95rem)] font-light tracking-[0.32em] text-cyan-200/80">
          AI &amp; ML DEVELOPER
        </p>
        <p
          className={`mt-3 max-w-sm text-sm leading-relaxed text-white/50 ${
            mobile ? 'mx-auto' : ''
          }`}
        >
          {profile.tagline}
        </p>
      </div>

      {!mobile && (
        <div className="absolute right-5 top-14 flex flex-col gap-4">
          {SHORTCUTS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => open(id)}
              className="flex w-16 flex-col items-center gap-1.5 rounded-xl p-1.5 text-white/75 hover:bg-white/10 hover:text-white"
            >
              <span className="glass flex h-11 w-11 items-center justify-center rounded-2xl">
                <Icon size={20} />
              </span>
              <span className="text-[11px]">{label}</span>
            </button>
          ))}
        </div>
      )}

      <WindowManager bp={bp} />
      <Dock mobile={mobile} />

      {/* Public Sticky Notes Wall floating widget */}
      <StickyNotesWidget />

      {/* Wallpaper Switcher Modal */}
      <AnimatePresence>
        {wallpaperPickerOpen && <WallpaperSwitcher key="wallpaper-picker" />}
      </AnimatePresence>
    </motion.div>
  )
}
