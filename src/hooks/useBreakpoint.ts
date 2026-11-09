import { useEffect, useState } from 'react'
export type Breakpoint = 'mobile' | 'tablet' | 'desktop'
const get = (): Breakpoint => (window.innerWidth < 768 ? 'mobile' : window.innerWidth < 1100 ? 'tablet' : 'desktop')
export function useBreakpoint(): Breakpoint {
  const [b, setB] = useState<Breakpoint>(get)
  useEffect(() => {
    const fn = () => setB(get())
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])
  return b
}
