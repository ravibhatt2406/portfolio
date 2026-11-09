import { AnimatePresence } from 'framer-motion'
import { useDesktop, APP_IDS } from '../../store/desktopStore'
import { Window } from './Window'
import type { Breakpoint } from '../../hooks/useBreakpoint'

/** Renders every open, non-minimised window. State lives in the Zustand store. */
export function WindowManager({ bp }: { bp: Breakpoint }) {
  const visible = useDesktop((s) => APP_IDS.filter((id) => s.windows[id].open && !s.windows[id].minimized).join(','))
  const ids = visible ? (visible.split(',') as typeof APP_IDS) : []
  return (
    <div className="pointer-events-none fixed inset-0 z-20 [&>*]:pointer-events-auto">
      <AnimatePresence>{ids.map((id) => <Window key={id} id={id} bp={bp} />)}</AnimatePresence>
    </div>
  )
}
