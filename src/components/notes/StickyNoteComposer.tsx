import { useState, type FormEvent } from 'react'
import { Send, Check, X, Sparkles, Loader2 } from 'lucide-react'
import {
  type NoteColor,
  COLOR_THEMES,
  submitStickyNote,
  type StickyNote,
} from '../../services/notesService'

interface StickyNoteComposerProps {
  onSuccess: (note: StickyNote) => void
  onCancel: () => void
}

const COLORS: NoteColor[] = ['yellow', 'pink', 'blue', 'mint', 'lavender']

export function StickyNoteComposer({ onSuccess, onCancel }: StickyNoteComposerProps) {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [color, setColor] = useState<NoteColor>('yellow')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const maxChars = 180
  const remaining = maxChars - message.length
  const theme = COLOR_THEMES[color]

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const trimmedMsg = message.trim()

    if (!trimmedMsg) {
      setError('Please write a message before posting.')
      return
    }

    if (trimmedMsg.length > maxChars) {
      setError(`Message exceeds ${maxChars} characters.`)
      return
    }

    setError(null)
    setSubmitting(true)

    try {
      const res = await submitStickyNote({
        name: name.trim() || undefined,
        message: trimmedMsg,
        color,
      })

      if (res.success && res.note) {
        onSuccess(res.note)
      } else {
        setError(res.message || 'Failed to post note.')
      }
    } catch {
      setError('An unexpected error occurred while posting your note.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="rounded-2xl border border-white/20 bg-[#16122c]/95 p-5 shadow-2xl backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-amber-300" />
          <h3 className="text-sm font-bold tracking-wide text-white">Write a Note for Ravi</h3>
        </div>
        <button
          onClick={onCancel}
          type="button"
          className="rounded-lg p-1 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
          aria-label="Cancel"
        >
          <X size={16} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        {/* Color Palette Selector */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-white/70">
            Choose paper color:
          </label>
          <div className="flex items-center gap-2.5">
            {COLORS.map((c) => {
              const t = COLOR_THEMES[c]
              const isSelected = color === c
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`relative flex h-8 w-8 items-center justify-center rounded-xl transition-all ${
                    t.bg
                  } ${t.shadow} ${
                    isSelected
                      ? 'scale-110 ring-2 ring-white ring-offset-2 ring-offset-[#16122c]'
                      : 'opacity-70 hover:opacity-100 hover:scale-105'
                  }`}
                  title={t.name}
                >
                  {isSelected && <Check size={14} className="text-stone-900 stroke-[3]" />}
                </button>
              )
            })}
          </div>
        </div>

        {/* Live Note Preview Box */}
        <div
          className={`relative rounded-xl p-3.5 border ${theme.border} ${theme.bg} ${theme.shadow} transition-all`}
        >
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-4 rounded-sm bg-white/40 shadow-xs backdrop-blur-xs border border-white/20" />

          {/* Name input */}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={40}
            placeholder="Your name or handle (optional)"
            className="w-full bg-transparent text-xs font-semibold placeholder:text-stone-500/70 text-stone-900 focus:outline-none border-b border-black/10 pb-1"
          />

          {/* Message textarea */}
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={maxChars}
            rows={3}
            placeholder="Write something nice for Ravi..."
            className="mt-2 w-full resize-none bg-transparent text-[13px] leading-relaxed placeholder:text-stone-500/70 text-stone-900 focus:outline-none"
            autoFocus
          />

          {/* Counter in note */}
          <div className="mt-1 flex justify-end">
            <span
              className={`text-[10px] font-mono ${
                remaining < 15 ? 'text-rose-600 font-bold' : 'text-stone-600'
              }`}
            >
              {remaining} / {maxChars}
            </span>
          </div>
        </div>

        {error && (
          <p className="text-xs text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-lg p-2">
            {error}
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="rounded-xl border border-white/10 px-4 py-2 text-xs font-medium text-white/70 hover:bg-white/5 hover:text-white transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitting || !message.trim()}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-[0_0_20px_rgba(139,92,246,0.5)] transition-all hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_25px_rgba(139,92,246,0.8)] active:scale-95"
          >
            {submitting ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                <span>Posting...</span>
              </>
            ) : (
              <>
                <Send size={13} />
                <span>Post Note</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

