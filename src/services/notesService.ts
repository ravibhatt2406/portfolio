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
      if (Array.isArray(data.data)) {
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(data.data))
        } catch {
          // ignore storage quota error
        }
        return data.data
      }
    }
  } catch (err) {
    console.warn('[NotesService] API fetch failed, trying local cache:', err)
  }

  // Fallback to cache
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (cached) {
      return JSON.parse(cached)
    }
  } catch {
    // fallback
  }

  return []
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

    const data = await res.json()

    if (!res.ok) {
      return {
        success: false,
        message: data.error || 'Failed to submit note. Please try again.',
      }
    }

    return {
      success: true,
      message: data.message || 'Note submitted successfully!',
      note: data.data,
    }
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Network error while submitting note.',
    }
  }
}

