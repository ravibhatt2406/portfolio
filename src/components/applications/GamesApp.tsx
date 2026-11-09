import { Gamepad2 } from 'lucide-react'
import { SnakeGame } from '../games/SnakeGame'
import { H } from './ui'

export default function GamesApp() {
  return (
    <div className="flex h-full flex-col">
      {/* App Header */}
      <div className="flex items-center justify-between border-b border-white/[0.08] px-6 py-3 bg-white/[0.02]">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/30">
            <Gamepad2 size={15} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <H>Games</H>
              <span className="rounded-full bg-emerald-400/10 px-2 py-0.5 text-[10px] font-mono text-emerald-300 border border-emerald-400/20">
                Snake — Neon Arcade
              </span>
            </div>
          </div>
        </div>
        <span className="text-[11px] font-mono text-white/40 hidden sm:inline">
          RAVI.OS Retro Arcade
        </span>
      </div>

      {/* Game Content Body */}
      <div className="flex-1 overflow-auto">
        <SnakeGame />
      </div>
    </div>
  )
}

