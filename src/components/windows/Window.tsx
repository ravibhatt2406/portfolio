import { Suspense, useRef, type PointerEvent as RPE } from 'react'
import { motion } from 'framer-motion'
import { X, Minus, Plus } from 'lucide-react'
import { useDesktop, type AppId } from '../../store/desktopStore'
import { APPS } from '../applications/registry'
import type { Breakpoint } from '../../hooks/useBreakpoint'

export function Window({ id, bp }: { id: AppId; bp: Breakpoint }) {
  const w = useDesktop((s) => s.windows[id])
  const active = useDesktop((s) => s.activeId === id)
  const close = useDesktop((s) => s.close)
  const minimize = useDesktop((s) => s.minimize)
  const toggleMax = useDesktop((s) => s.toggleMax)
  const focus = useDesktop((s) => s.focus)
  const move = useDesktop((s) => s.move)
  const resize = useDesktop((s) => s.resize)

  const { title, Component } = APPS[id]
  const mobile = bp === 'mobile'
  const max = w.maximized || mobile

  const onDown = (e: RPE<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) return
    focus(id)
    if (max) return
    const dx = e.clientX - w.x
    const dy = e.clientY - w.y

    const handlePointerMove = (ev: PointerEvent) => {
      const x = Math.min(window.innerWidth - 80, Math.max(40 - w.w, ev.clientX - dx))
      const y = Math.min(window.innerHeight - 50, Math.max(34, ev.clientY - dy))
      move(id, x, y)
    }

    const handlePointerUp = () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointercancel', handlePointerUp)
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('pointercancel', handlePointerUp)
  }

  const rDown = (e: RPE<HTMLDivElement>) => {
    e.stopPropagation()
    focus(id)
    const startX = e.clientX
    const startY = e.clientY
    const startW = w.w
    const startH = w.h

    const handleResizeMove = (ev: PointerEvent) => {
      resize(
        id,
        Math.max(360, Math.min(window.innerWidth - 40, startW + ev.clientX - startX)),
        Math.max(260, Math.min(window.innerHeight - 90, startH + ev.clientY - startY))
      )
    }

    const handleResizeUp = () => {
      window.removeEventListener('pointermove', handleResizeMove)
      window.removeEventListener('pointerup', handleResizeUp)
      window.removeEventListener('pointercancel', handleResizeUp)
    }

    window.addEventListener('pointermove', handleResizeMove)
    window.addEventListener('pointerup', handleResizeUp)
    window.addEventListener('pointercancel', handleResizeUp)
  }

  const maxLeft = mobile ? 0 : bp === 'tablet' ? 80 : 252
  const style = max
    ? { left: maxLeft, right: mobile ? 0 : 12, top: 36, bottom: mobile ? 82 : 96, zIndex: w.z }
    : { left: w.x, top: w.y, width: w.w, height: w.h, zIndex: w.z }

  return (
    <div className="absolute" style={style} onPointerDown={() => focus(id)}>
      <motion.div
        className={`glass flex h-full w-full flex-col overflow-hidden border border-white/15 transition-all duration-200 ${
          mobile ? 'rounded-t-3xl' : 'rounded-2xl'
        } ${
          active
            ? 'shadow-[0_28px_80px_-15px_rgba(0,0,0,0.85),0_0_30px_-5px_rgba(139,92,246,0.22)] ring-1 ring-white/20'
            : 'shadow-[0_15px_45px_-10px_rgba(0,0,0,0.7)] opacity-95'
        }`}
        style={{
          transformOrigin: '50% 100%',
          background: 'linear-gradient(160deg, rgba(20,15,45,.88), rgba(9,7,24,.82))',
        }}
        initial={{ opacity: 0, scale: 0.88, y: 25 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.72, y: 100, transition: { duration: 0.2 } }}
        transition={{ type: 'spring', stiffness: 340, damping: 28 }}
        role="dialog"
        aria-label={title}
      >
        {mobile && (
          <div
            className="flex justify-center pt-2 pb-0.5 cursor-pointer"
            onClick={() => close(id)}
            title="Tap to close"
          >
            <span className="h-1 w-10 rounded-full bg-white/25 hover:bg-white/40 transition-colors" />
          </div>
        )}

        <div
          className="group relative flex h-11 shrink-0 cursor-default items-center border-b border-white/[0.08] px-4 touch-none select-none"
          onPointerDown={onDown}
          onDoubleClick={() => !mobile && toggleMax(id)}
        >
          <div
            className="relative z-20 flex items-center gap-2"
            onPointerDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close"
              onClick={(e) => {
                e.stopPropagation()
                close(id)
              }}
              onPointerDown={(e) => e.stopPropagation()}
              className="group/btn relative flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#ff5f57] text-black/70 transition-transform hover:scale-110 active:scale-95 cursor-pointer touch-manipulation"
            >
              <X size={9} strokeWidth={3} className="opacity-0 group-hover:opacity-100 group-hover/btn:opacity-100 transition-opacity pointer-events-none" />
              <span className="absolute -inset-2 block sm:hidden" />
            </button>
            <button
              type="button"
              aria-label="Minimize"
              onClick={(e) => {
                e.stopPropagation()
                minimize(id)
              }}
              onPointerDown={(e) => e.stopPropagation()}
              className="group/btn relative flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#febc2e] text-black/70 transition-transform hover:scale-110 active:scale-95 cursor-pointer touch-manipulation"
            >
              <Minus size={9} strokeWidth={3} className="opacity-0 group-hover:opacity-100 group-hover/btn:opacity-100 transition-opacity pointer-events-none" />
              <span className="absolute -inset-2 block sm:hidden" />
            </button>
            <button
              type="button"
              aria-label="Maximize or restore"
              onClick={(e) => {
                e.stopPropagation()
                if (!mobile) toggleMax(id)
              }}
              onPointerDown={(e) => e.stopPropagation()}
              className="group/btn relative flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#28c840] text-black/70 transition-transform hover:scale-110 active:scale-95 cursor-pointer touch-manipulation"
            >
              <Plus size={9} strokeWidth={3} className="opacity-0 group-hover:opacity-100 group-hover/btn:opacity-100 transition-opacity pointer-events-none" />
              <span className="absolute -inset-2 block sm:hidden" />
            </button>
          </div>
          <span className="pointer-events-none absolute inset-x-0 text-center text-[13px] font-medium tracking-wide text-white/80">
            {title}
          </span>
        </div>

        <div className="window-body min-h-0 flex-1 overflow-auto">
          <Suspense fallback={<div className="p-7 text-sm text-white/50">Loading…</div>}>
            <Component />
          </Suspense>
        </div>

        {!max && (
          <div
            onPointerDown={rDown}
            className="absolute bottom-0 right-0 h-5 w-5 cursor-nwse-resize touch-none flex items-end justify-end p-1 opacity-40 hover:opacity-100 transition-opacity"
            aria-label="Resize window"
          >
            <svg width="7" height="7" viewBox="0 0 7 7" className="fill-white/60">
              <path d="M6 1v5H1l5-5z" />
            </svg>
          </div>
        )}
      </motion.div>
    </div>
  )
}
