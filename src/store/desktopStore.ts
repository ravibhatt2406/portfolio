import { create } from 'zustand'

export type AppId =
  | 'about' | 'projects' | 'skills' | 'experience'
  | 'achievements' | 'education' | 'resume' | 'contact' | 'games' | 'terminal'

export type Phase = 'intro' | 'entering' | 'desktop'
export type Density = 'low' | 'medium' | 'high'
export type WallpaperId = 'planet' | 'hologram' | 'intelligence'

export interface WinState {
  open: boolean
  minimized: boolean
  maximized: boolean
  x: number; y: number; w: number; h: number
  z: number
}

interface DesktopState {
  phase: Phase
  windows: Record<AppId, WinState>
  zTop: number
  activeId: AppId | null
  density: Density
  reducedMotion: boolean
  wallpaper: WallpaperId
  wallpaperPickerOpen: boolean
  setPhase: (p: Phase) => void
  replayIntro: () => void
  open: (id: AppId) => void
  close: (id: AppId) => void
  closeAll: () => void
  minimize: (id: AppId) => void
  minimizeAll: () => void
  toggleMax: (id: AppId) => void
  focus: (id: AppId) => void
  move: (id: AppId, x: number, y: number) => void
  resize: (id: AppId, w: number, h: number) => void
  setDensity: (d: Density) => void
  setReducedMotion: (v: boolean) => void
  setWallpaper: (w: WallpaperId) => void
  setWallpaperPickerOpen: (open: boolean) => void
}

export const APP_IDS: AppId[] = [
  'about', 'projects', 'skills', 'experience', 'achievements', 'education', 'resume', 'contact', 'games', 'terminal',
]

const SIZES: Record<AppId, [number, number]> = {
  about: [600, 540], projects: [680, 500], skills: [640, 520], experience: [600, 520],
  achievements: [540, 400], education: [560, 440], resume: [640, 580], contact: [560, 520],
  games: [560, 620], terminal: [600, 400],
}

const blank = (id: AppId, i: number): WinState => ({
  open: false, minimized: false, maximized: false,
  x: 0, y: 0, w: SIZES[id][0], h: SIZES[id][1], z: i,
})

const initial = (): Record<AppId, WinState> =>
  Object.fromEntries(APP_IDS.map((id, i) => [id, blank(id, i)])) as Record<AppId, WinState>

const prefersReduced =
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

const savedWallpaper =
  typeof window !== 'undefined'
    ? ((localStorage.getItem('ravi_os_wallpaper') as WallpaperId) || 'planet')
    : 'planet'

export const useDesktop = create<DesktopState>((set, get) => ({
  phase: 'intro',
  windows: initial(),
  zTop: 20,
  activeId: null,
  density: 'medium',
  reducedMotion: !!prefersReduced,
  wallpaper: savedWallpaper,
  wallpaperPickerOpen: false,

  setPhase: (phase) => set({ phase }),
  replayIntro: () => set({ phase: 'intro', windows: initial(), activeId: null }),

  open: (id) => {
    const { windows, zTop } = get()
    const w = windows[id]
    const z = zTop + 1
    let { x, y } = w
    if (!w.open) {
      const n = Object.values(windows).filter((v) => v.open).length
      const vw = typeof window !== 'undefined' ? window.innerWidth : 1280
      const vh = typeof window !== 'undefined' ? window.innerHeight : 800
      const workLeft = vw < 768 ? 0 : vw < 1100 ? 84 : 260
      const workWidth = vw - workLeft - 80
      const baseLeft = workLeft + Math.max(16, Math.round((workWidth - w.w) / 2))
      const baseTop = Math.max(46, Math.round((vh - w.h) / 2 - 40))
      const step = (n % 6) * 30
      x = Math.min(vw - w.w - 16, Math.max(workLeft + 16, baseLeft + step))
      y = Math.min(vh - w.h - 96, Math.max(44, baseTop + step))
    }
    set({
      zTop: z, activeId: id,
      windows: { ...windows, [id]: { ...w, open: true, minimized: false, x, y, z } },
    })
  },
  close: (id) => set((s) => ({
    windows: { ...s.windows, [id]: { ...s.windows[id], open: false, minimized: false, maximized: false } },
    activeId: s.activeId === id ? null : s.activeId,
  })),
  closeAll: () => set({ windows: initial(), activeId: null }),
  minimize: (id) => set((s) => ({
    windows: { ...s.windows, [id]: { ...s.windows[id], minimized: true } },
    activeId: s.activeId === id ? null : s.activeId,
  })),
  minimizeAll: () => set((s) => ({
    windows: Object.fromEntries(
      Object.entries(s.windows).map(([k, v]) => [k, v.open ? { ...v, minimized: true } : v]),
    ) as Record<AppId, WinState>,
    activeId: null,
  })),
  toggleMax: (id) => set((s) => ({
    windows: { ...s.windows, [id]: { ...s.windows[id], maximized: !s.windows[id].maximized } },
  })),
  focus: (id) => {
    const { zTop, windows, activeId } = get()
    if (activeId === id && windows[id].z === zTop) return
    set({ zTop: zTop + 1, activeId: id, windows: { ...windows, [id]: { ...windows[id], z: zTop + 1 } } })
  },
  move: (id, x, y) => set((s) => ({ windows: { ...s.windows, [id]: { ...s.windows[id], x, y } } })),
  resize: (id, w, h) => set((s) => ({ windows: { ...s.windows, [id]: { ...s.windows[id], w, h } } })),
  setDensity: (density) => set({ density }),
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
  setWallpaper: (wallpaper) => {
    try {
      localStorage.setItem('ravi_os_wallpaper', wallpaper)
    } catch {}
    set({ wallpaper })
  },
  setWallpaperPickerOpen: (wallpaperPickerOpen) => set({ wallpaperPickerOpen }),
}))
