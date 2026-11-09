import { useEffect, useState } from 'react'
import { Plus, RotateCcw, X, StickyNote as StickyNoteIcon, MessageSquareHeart, CheckCircle2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { StickyNoteCard } from './StickyNoteCard'
import { StickyNoteComposer } from './StickyNoteComposer'
import { getStickyNotes, type StickyNote } from '../../services/notesService'

interface StickyNotesBoardProps {
  onClose: () => void
}

export function StickyNotesBoard({ onClose }: StickyNotesBoardProps) {
  const [notes, setNotes] = useState<StickyNote[]>([])
  const [loading, setLoading] = useState(true)
  const [composerOpen, setComposerOpen] = useState(false)
  const [successBanner, setSuccessBanner] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const loadNotes = async () => {
    setLoading(true)
    try {
      const data = await getStickyNotes()
      setNotes(data)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadNotes()
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    loadNotes()
  }

  const handleNoteSuccess = (newNote: StickyNote) => {
    setNotes((prev) => [newNote, ...prev])
    setComposerOpen(false)
    setSuccessBanner('Your note was posted to the board!')
    setTimeout(() => setSuccessBanner(null), 4000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 320 }}
        className="relative flex h-[90vh] max-h-[760px] w-full max-w-4xl flex-col rounded-3xl border border-white/20 bg-gradient-to-b from-[#1c1638]/95 via-[#120e24]/95 to-[#0b0918]/95 shadow-[0_25px_70px_rgba(0,0,0,0.85)] overflow-hidden"
      >
        {/* Noticeboard Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-6 py-4 bg-white/[0.03]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-400/20 text-amber-300 ring-1 ring-amber-400/30 shadow-[0_0_15px_rgba(251,191,36,0.2)]">
              <StickyNoteIcon size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-base sm:text-lg font-bold text-white tracking-wide">
                  A Little Note for Ravi
                </h2>
                <span className="rounded-full bg-amber-400/10 px-2.5 py-0.5 text-[10px] font-mono text-amber-300 border border-amber-400/20">
                  {notes.length} {notes.length === 1 ? 'Note' : 'Notes'}
                </span>
              </div>
              <p className="text-xs text-white/50">Leave a little thought, message, or encouragement.</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/70 hover:bg-white/10 hover:text-white transition-colors"
              title="Refresh noticeboard"
              aria-label="Refresh notes"
            >
              <RotateCcw size={14} className={refreshing ? 'animate-spin' : ''} />
            </button>

            <button
              onClick={() => setComposerOpen((v) => !v)}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-1.5 text-xs font-semibold text-stone-950 shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all hover:from-amber-400 hover:to-orange-400 active:scale-95"
            >
              <Plus size={14} strokeWidth={2.5} />
              <span>Add Note</span>
            </button>

            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/70 hover:bg-rose-500/20 hover:text-rose-200 transition-colors ml-1"
              aria-label="Close board"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Temporary Success Toast */}
        <AnimatePresence>
          {successBanner && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mx-6 mt-3 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/20 px-3.5 py-2 text-xs font-medium text-emerald-200"
            >
              <CheckCircle2 size={14} />
              <span>{successBanner}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Composer Modal Drawer */}
        <AnimatePresence>
          {composerOpen && (
            <div className="px-6 pt-4 pb-2">
              <StickyNoteComposer
                onSuccess={handleNoteSuccess}
                onCancel={() => setComposerOpen(false)}
              />
            </div>
          )}
        </AnimatePresence>

        {/* Main Noticeboard Board Area */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 [scrollbar-width:thin]">
          {loading ? (
            <div className="flex h-64 flex-col items-center justify-center text-white/40 gap-3">
              <RotateCcw size={22} className="animate-spin text-amber-300" />
              <span className="text-xs">Gathering notes from the wall...</span>
            </div>
          ) : notes.length === 0 ? (
            <div className="flex h-72 flex-col items-center justify-center text-center p-6 rounded-2xl border border-dashed border-white/15 bg-white/[0.02]">
              <MessageSquareHeart size={36} className="text-amber-300/60 mb-2" />
              <h3 className="text-sm font-semibold text-white">The board is waiting for its first note!</h3>
              <p className="mt-1 text-xs text-white/50 max-w-sm">
                Say hello, share a kind word, or give feedback on RAVI.OS. Your note will appear right here.
              </p>
              <button
                onClick={() => setComposerOpen(true)}
                className="mt-4 flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-stone-950 shadow-md hover:bg-amber-400 transition-colors"
              >
                <Plus size={14} />
                <span>Write the First Note</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-7 items-start pb-6">
              {notes.map((note, index) => (
                <StickyNoteCard key={note.id} note={note} index={index} />
              ))}
            </div>
          )}
        </div>

        {/* Bottom Footer Notice */}
        <div className="flex items-center justify-between border-t border-white/10 px-6 py-2.5 bg-black/30 text-[11px] text-white/40">
          <span>Public Community Noticeboard • Moderated for Kindness</span>
          <span className="hidden sm:inline">Click "+ Add Note" to leave your message</span>
        </div>
      </motion.div>
    </div>
  )
}

