import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'framer-motion'
import { useDesktop, type AppId } from '../../store/desktopStore'
import { APPS, NAV_ORDER } from '../applications/registry'

const DOCK: AppId[] = [...NAV_ORDER, 'terminal']

function clickApp(id: AppId) {
  const { windows, activeId, open, minimize } = useDesktop.getState()
  const w = windows[id]
  if (w.open && !w.minimized && activeId === id) minimize(id)
  else open(id)
}

function DockIcon({ id, mouseX }: { id: AppId; mouseX: MotionValue<number> }) {
  const ref = useRef<HTMLButtonElement>(null)
  const w = useDesktop((s) => s.windows[id])
  const { Icon, gradient, title } = APPS[id]
  const dist = useTransform(mouseX, (v) => {
    const r = ref.current?.getBoundingClientRect()
    return r ? v - (r.left + r.width / 2) : 999
  })
  const size = useSpring(useTransform(dist, [-140, 0, 140], [50, 78, 50]), { mass: 0.1, stiffness: 200, damping: 15 })

  return (
    <div className="group relative flex flex-col items-center">
      <span className="pointer-events-none absolute -top-10 whitespace-nowrap rounded-lg border border-white/10 bg-black/80 px-2.5 py-1 text-xs font-medium text-white opacity-0 shadow-lg backdrop-blur-md transition-all duration-200 group-hover:opacity-100 group-hover:-translate-y-1">
        {title}
      </span>
      <motion.button
        ref={ref}
        onClick={() => clickApp(id)}
        aria-label={title}
        style={{ width: size, height: size }}
        className={`flex items-center justify-center rounded-[22%] bg-gradient-to-br ${gradient} shadow-lg shadow-black/50 ring-1 ring-white/25 transition-shadow hover:shadow-cyan-500/20`}
        whileTap={{ scale: 0.88 }}
      >
        <Icon className="h-1/2 w-1/2 text-white drop-shadow" />
      </motion.button>
      <span
        className={`mt-1.5 h-1.5 w-1.5 rounded-full transition-all duration-300 ${
          w.open
            ? w.minimized
              ? 'bg-white/40'
              : 'bg-cyan-300 shadow-[0_0_8px_#67e8f9]'
            : 'bg-transparent'
        }`}
      />
    </div>
  )
}

export function Dock({ mobile }: { mobile: boolean }) {
  const mouseX = useMotionValue(Infinity)
  const winMap = useDesktop((s) => s.windows)

  if (mobile) {
    return (
      <nav
        aria-label="Application Dock"
        className="glass fixed inset-x-2 bottom-2 z-40 flex gap-3.5 overflow-x-auto rounded-3xl px-3.5 py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden border border-white/15 shadow-[0_15px_35px_rgba(0,0,0,0.6)]"
        style={{ paddingBottom: 'max(.65rem, env(safe-area-inset-bottom))' }}
      >
        {DOCK.map((id) => {
          const { Icon, gradient, title } = APPS[id]
          const isOpen = winMap[id].open
          return (
            <button
              key={id}
              onClick={() => clickApp(id)}
              aria-label={title}
              className="flex shrink-0 flex-col items-center gap-1 active:scale-95 transition-transform"
            >
              <span className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} ring-1 ring-white/25 shadow-md shadow-black/40`}>
                <Icon size={22} className="text-white drop-shadow" />
              </span>
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isOpen
                    ? winMap[id].minimized
                      ? 'bg-white/40'
                      : 'bg-cyan-300 shadow-[0_0_6px_#67e8f9]'
                    : 'bg-transparent'
                }`}
              />
            </button>
          )
        })}
      </nav>
    )
  }

  return (
    <nav aria-label="Application Dock" className="fixed inset-x-0 bottom-3 z-40 flex justify-center pointer-events-none">
      <div
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="glass pointer-events-auto flex h-[76px] items-end gap-3 rounded-[28px] border border-white/15 px-3.5 pb-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_25px_rgba(139,92,246,0.15)]"
      >
        {DOCK.map((id) => <DockIcon key={id} id={id} mouseX={mouseX} />)}
      </div>
    </nav>
  )
}
