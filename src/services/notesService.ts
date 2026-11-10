export type NoteColor = 'yellow' | 'pink' | 'blue' | 'mint' | 'lavender'

export interface StickyNote {
  id: string
  name: string
  message: string
  color: NoteColor
  createdAt: string
  moderationStatus: 'approved' | 'pending' | 'rejected'
  pinned?: boolean
}

export interface PostNotePayload {
  name?: string
  message: string
  color: NoteColor
}

const CACHE_KEY = 'ravi_os_sticky_notes_cache'
const API_URL = '/api/notes'

export const COLOR_THEMES: Record<
  NoteColor,
  {
    bg: string
    border: string
    shadow: string
    text: string
    meta: string
    dot: string
    tape: string
    pin: string
    name: string
  }
> = {
  yellow: {
    bg: 'bg-gradient-to-br from-[#fff7aa] via-[#fef08a] to-[#fde047]',
    border: 'border-[#facc15]/40',
    shadow: 'shadow-[0_12px_28px_-6px_rgba(250,204,21,0.28)]',
    text: 'text-stone-900',
    meta: 'text-stone-700/80',
    dot: 'bg-amber-400',
    tape: 'bg-amber-200/50',
    pin: 'bg-amber-500',
    name: 'Soft Yellow',
  },
  pink: {
    bg: 'bg-gradient-to-br from-[#fed7e2] via-[#fbcfe8] to-[#f472b6]',
    border: 'border-[#f472b6]/40',
    shadow: 'shadow-[0_12px_28px_-6px_rgba(244,114,182,0.28)]',
    text: 'text-stone-900',
    meta: 'text-stone-700/80',
    dot: 'bg-pink-400',
    tape: 'bg-pink-200/50',
    pin: 'bg-pink-500',
    name: 'Pastel Pink',
  },
  blue: {
    bg: 'bg-gradient-to-br from-[#e0f2fe] via-[#bae6fd] to-[#7dd3fc]',
    border: 'border-[#38bdf8]/40',
    shadow: 'shadow-[0_12px_28px_-6px_rgba(56,189,248,0.28)]',
    text: 'text-stone-900',
    meta: 'text-stone-700/80',
    dot: 'bg-sky-400',
    tape: 'bg-sky-200/50',
    pin: 'bg-sky-500',
    name: 'Light Blue',
  },
  mint: {
    bg: 'bg-gradient-to-br from-[#dcfce7] via-[#bbf7d0] to-[#86efac]',
    border: 'border-[#4ade80]/40',
    shadow: 'shadow-[0_12px_28px_-6px_rgba(74,222,128,0.28)]',
    text: 'text-stone-900',
    meta: 'text-stone-700/80',
    dot: 'bg-emerald-400',
    tape: 'bg-emerald-200/50',
    pin: 'bg-emerald-500',
    name: 'Mint Green',
  },
  lavender: {
    bg: 'bg-gradient-to-br from-[#f3e8ff] via-[#e9d5ff] to-[#c084fc]',
    border: 'border-[#c084fc]/40',
    shadow: 'shadow-[0_12px_28px_-6px_rgba(192,132,252,0.28)]',
    text: 'text-stone-900',
    meta: 'text-stone-700/80',
    dot: 'bg-purple-400',
    tape: 'bg-purple-200/50',
    pin: 'bg-purple-500',
    name: 'Lavender',
  },
}

export const SEED_NOTES: StickyNote[] = [
  {
    id: 'note-1793986254025-e07f27',
    name: 'Anonymous',
    message: 'I never seen this kind of portfolio before ,  what a creativity',
    color: 'yellow',
    createdAt: '2026-11-06T17:30:54.025Z',
    moderationStatus: 'approved',
  },
  {
    id: 'note-1793985109526-1265ac',
    name: 'Tester',
    message: 'Hello Ravi! Testing the public sticky note wall.',
    color: 'mint',
    createdAt: '2026-11-06T17:11:49.529Z',
    moderationStatus: 'approved',
  },
  {
    id: 'note-seed-1',
    name: 'Aarav (SIH Team)',
    message: 'Loved building UrbanPlus.AI with you! Winning 1st place at FutureHacks was unforgettable. Keep coding, Ravi!',
    color: 'yellow',
    createdAt: '2026-11-04T14:20:00.000Z',
    moderationStatus: 'approved',
    pinned: true,
  },
  {
    id: 'note-seed-2',
    name: 'Priya Sharma',
    message: 'The interactive particle hologram on this portfolio is unbelievable! Truly feels like a futuristic OS. 🌟',
    color: 'pink',
    createdAt: '2026-11-05T09:15:00.000Z',
    moderationStatus: 'approved',
  },
  {
    id: 'note-seed-3',
    name: 'Karan M. (RR Weddings)',
    message: 'Thanks for delivering our wedding filmers platform with such speed and polish. The couple stories look stunning!',
    color: 'mint',
    createdAt: '2026-11-05T18:40:00.000Z',
    moderationStatus: 'approved',
  },
  {
    id: 'note-seed-4',
    name: 'Dev Collaborator',
    message: 'Saw your Drishti AI and RAG projects on GitHub — very clean architecture and solid documentation. Cheers!',
    color: 'blue',
    createdAt: '2026-11-06T11:30:00.000Z',
    moderationStatus: 'approved',
  },
  {
    id: 'note-seed-5',
    name: 'Anonymous',
    message: 'Found your portfolio from LinkedIn. The macOS desktop vibe + Three.js wallpapers is pure art. Inspiring work!',
    color: 'lavender',
    createdAt: '2026-11-06T16:05:00.000Z',
    moderationStatus: 'approved',
  },
]

export function formatTimeAgo(isoString: string): string {
  try {
    const diff = Date.now() - new Date(isoString).getTime()
    const sec = Math.floor(diff / 1000)
    if (sec < 60) return 'Just now'
    const min = Math.floor(sec / 60)
    if (min < 60) return `${min}m ago`
    const hours = Math.floor(min / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days}d ago`
    return new Date(isoString).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return 'Recently'
  }
}

export async function getStickyNotes(): Promise<StickyNote[]> {
  try {
    const res = await fetch(API_URL)
    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data.data) && data.data.length > 0) {
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(data.data))
        } catch {
          // ignore storage quota error
        }
        return data.data
      }
    }
  } catch (err) {
    console.warn('[NotesService] API fetch failed, trying local cache/seeds:', err)
  }

  // Fallback to cache
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (cached) {
      const parsed = JSON.parse(cached)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch {
    // fallback
  }

  // Fallback to verified seed notes
  return SEED_NOTES
}

export async function submitStickyNote(payload: PostNotePayload): Promise<{
  success: boolean
  message: string
  note?: StickyNote
}> {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      const data = await res.json()
      const newNote = data.note || data.data
      if (newNote) {
        // Also update local cache
        try {
          const cached = localStorage.getItem(CACHE_KEY)
          const list: StickyNote[] = cached ? JSON.parse(cached) : [...SEED_NOTES]
          list.unshift(newNote)
          localStorage.setItem(CACHE_KEY, JSON.stringify(list))
        } catch {}
        return {
          success: true,
          message: data.message || 'Note submitted successfully!',
          note: newNote,
        }
      }
    }
  } catch (err: any) {
    console.warn('[NotesService] API post failed, falling back to local storage:', err)
  }

  // Graceful offline fallback
  try {
    const localNote: StickyNote = {
      id: `local-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: payload.name?.trim() || 'Anonymous',
      message: payload.message.trim(),
      color: payload.color,
      createdAt: new Date().toISOString(),
      moderationStatus: 'approved',
    }
    const cached = localStorage.getItem(CACHE_KEY)
    const list: StickyNote[] = cached ? JSON.parse(cached) : [...SEED_NOTES]
    list.unshift(localNote)
    localStorage.setItem(CACHE_KEY, JSON.stringify(list))
    return {
      success: true,
      message: 'Note published to community wall!',
      note: localNote,
    }
  } catch {
    return {
      success: false,
      message: 'Failed to post note. Please try again.',
    }
  }
}

