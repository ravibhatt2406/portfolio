import { useMemo } from 'react'
import { Pin } from 'lucide-react'
import { type StickyNote, COLOR_THEMES, formatTimeAgo } from '../../services/notesService'

interface StickyNoteCardProps {
  note: StickyNote
  index: number
}

// Deterministic subtle rotation based on note ID
function getRotation(id: string, index: number): number {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i)
    hash |= 0
  }
  const rotations = [-2.2, 1.8, -1.2, 2.4, -1.8, 1.2, -0.8, 2.0]
  const idx = Math.abs((hash + index) % rotations.length)
  return rotations[idx]
}

export function StickyNoteCard({ note, index }: StickyNoteCardProps) {
  const theme = COLOR_THEMES[note.color] || COLOR_THEMES.yellow
  const rotation = useMemo(() => getRotation(note.id, index), [note.id, index])

  return (
    <div
      style={{ transform: `rotate(${rotation}deg)` }}
      className={`group relative flex flex-col justify-between rounded-xl p-4 transition-all duration-300 hover:scale-[1.03] hover:rotate-0 hover:z-20 ${theme.bg} ${theme.shadow} border ${theme.border} min-h-[175px] w-full max-w-[270px] select-text`}
    >
      {/* Top Tape Strip */}
      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-14 h-5 rounded-sm bg-white/40 shadow-sm backdrop-blur-[1px] border border-white/30 rotate-[-1deg] pointer-events-none" />

      {/* Pinned Indicator (if pinned) */}
      {note.pinned && (
        <div className="absolute top-2 right-2 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-400/40 px-1.5 py-0.5 rounded shadow-xs">
          <Pin size={10} className="fill-amber-900" />
          <span>Pinned</span>
        </div>
      )}

      {/* Message Text */}
      <div className="pt-2">
        <p
          className={`${theme.text} text-[13px] leading-relaxed font-sans whitespace-pre-wrap break-words selection:bg-black/15`}
        >
          {note.message}
        </p>
      </div>

      {/* Footer: Author and Time */}
      <div className="mt-4 pt-2.5 border-t border-black/[0.08] flex items-center justify-between text-[11px]">
        <span className={`font-semibold ${theme.text} truncate max-w-[150px]`}>
          {note.name || 'Anonymous'}
        </span>
        <span className={`font-mono text-[10px] ${theme.meta} shrink-0`}>
          {formatTimeAgo(note.createdAt)}
        </span>
      </div>

      {/* Realistic Dog-Ear Folded Corner */}
      <div
        className="absolute bottom-0 right-0 w-4 h-4 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <div className="w-full h-full bg-gradient-to-tl from-black/20 via-black/10 to-transparent transform rotate-45 translate-x-2 translate-y-2" />
        <div className="absolute bottom-0 right-0 border-solid border-t-8 border-l-8 border-b-0 border-r-0 border-t-black/15 border-l-black/15 border-transparent" />
      </div>
    </div>
  )
}

