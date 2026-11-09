import { useEffect, useRef } from 'react'

/** Normalised pointer position (-1..1) kept in a ref — never triggers React renders. */
export function useMousePosition() {
  const m = useRef({ x: 0, y: 0, active: false })
  useEffect(() => {
    const move = (e: PointerEvent) => {
      m.current.x = (e.clientX / window.innerWidth) * 2 - 1
      m.current.y = -((e.clientY / window.innerHeight) * 2 - 1)
      m.current.active = true
    }
    const leave = () => { m.current.active = false }
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerdown', move, { passive: true })
    document.addEventListener('pointerleave', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerdown', move)
      document.removeEventListener('pointerleave', leave)
    }
  }, [])
  return m
}
