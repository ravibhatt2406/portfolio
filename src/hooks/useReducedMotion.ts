import { useEffect } from 'react'
import { useDesktop } from '../store/desktopStore'

/** Syncs the OS reduced-motion preference into the store. */
export function useReducedMotionSync() {
  const set = useDesktop((s) => s.setReducedMotion)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const fn = () => set(mq.matches)
    fn()
    mq.addEventListener('change', fn)
    return () => mq.removeEventListener('change', fn)
  }, [set])
}
