import { useState, useEffect } from 'react'
import { StickyNote as StickyNoteIcon, Sparkles } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { StickyNotesBoard } from './StickyNotesBoard'
import { getStickyNotes } from '../../services/notesService'

export function StickyNotesWidget() {
  const [open, setOpen] = useState(false)
  const [noteCount, setNoteCount] = useState(0)

  useEffect(() => {
    getStickyNotes().then((data) => setNoteCount(data.length))
  }, [open])

  return (
    <>
      {/* Floating Note Entry Button in Bottom-Right Corner */}
      <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-30 select-none">
        <div className="group relative">
          {/* Tooltip on hover */}
          <span className="pointer-events-none absolute -top-9 right-0 whitespace-nowrap rounded-lg border border-white/10 bg-black/85 px-2.5 py-1 text-[11px] font-medium text-white opacity-0 shadow-lg backdrop-blur-md transition-all duration-200 group-hover:opacity-100 group-hover:-translate-y-1">
            Leave a little note
          </span>

          {/* Realistic Miniature Sticky Note Button */}
          <motion.button
            onClick={() => setOpen(true)}
            aria-label="A Little Note for Ravi"
            whileHover={{ scale: 1.08, rotate: 0 }}
            whileTap={{ scale: 0.94 }}
            animate={{
              y: [0, -3, 0],
            }}
            transition={{
              y: {
                duration: 3.5,
                repeat: Infinity,
                ease: 'easeInOut',
              },
            }}
            className="relative flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-to-br from-[#fff7aa] via-[#fef08a] to-[#fde047] text-stone-900 shadow-[0_10px_25px_-5px_rgba(250,204,21,0.5),0_0_20px_rgba(250,204,21,0.25)] border border-[#facc15]/50 rotate-[-4deg] transition-shadow hover:shadow-[0_15px_30px_-5px_rgba(250,204,21,0.7)]"
          >
            {/* Top Tape Accent */}
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-7 h-2.5 rounded-xs bg-white/50 border border-white/30 backdrop-blur-xs" />

            {/* Note Icon */}
            <StickyNoteIcon size={22} className="stroke-[2.2] text-stone-900" />

            {/* Sparkle badge */}
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-white shadow-xs">
              <Sparkles size={10} className="fill-white" />
            </span>

            {/* Note Count Badge */}
            {noteCount > 0 && (
              <span className="absolute -bottom-1 -left-1 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-stone-900 px-1 text-[9px] font-bold font-mono text-amber-300 ring-1 ring-white/20">
                {noteCount}
              </span>
            )}

            {/* Realistic Dog-Ear Corner */}
            <div
              className="absolute bottom-0 right-0 w-3 h-3 overflow-hidden pointer-events-none"
              aria-hidden="true"
            >
              <div className="absolute bottom-0 right-0 border-solid border-t-6 border-l-6 border-b-0 border-r-0 border-t-stone-800/20 border-l-stone-800/20 border-transparent" />
            </div>
          </motion.button>
        </div>
      </div>

      {/* Noticeboard Modal Dialog */}
      <AnimatePresence>
        {open && <StickyNotesBoard onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  )
}

