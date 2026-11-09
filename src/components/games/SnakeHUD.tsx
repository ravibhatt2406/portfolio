import { Trophy, Flame, Play, Pause, RotateCcw } from 'lucide-react'

interface SnakeHUDProps {
  score: number
  highScore: number
  state: 'ready' | 'playing' | 'paused' | 'gameover'
  onPauseToggle: () => void
  onRestart: () => void
}

export function SnakeHUD({
  score,
  highScore,
  state,
  onPauseToggle,
  onRestart,
}: SnakeHUDProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2.5 shadow-inner">
      {/* Score and High Score */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-mono uppercase tracking-wider text-white/50">Score</span>
          <span className="font-mono text-lg font-bold text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
            {score}
          </span>
        </div>

        <div className="h-4 w-[1px] bg-white/15" />

        <div className="flex items-center gap-1.5">
          <Trophy size={14} className="text-amber-400" />
          <span className="text-[11px] font-mono uppercase tracking-wider text-white/50">Best</span>
          <span className="font-mono text-sm font-semibold text-amber-300">
            {highScore}
          </span>
        </div>
      </div>

      {/* Status & Control Actions */}
      <div className="flex items-center gap-2">
        {state === 'playing' && (
          <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-mono font-medium text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <Flame size={11} /> LIVE
          </span>
        )}

        {state === 'paused' && (
          <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-mono text-amber-300">
            PAUSED
          </span>
        )}

        {(state === 'playing' || state === 'paused') && (
          <button
            onClick={onPauseToggle}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] text-white/70 hover:bg-white/10 hover:text-white transition-colors"
            title={state === 'playing' ? 'Pause Game [Space]' : 'Resume Game [Space]'}
            aria-label={state === 'playing' ? 'Pause game' : 'Resume game'}
          >
            {state === 'playing' ? <Pause size={13} /> : <Play size={13} />}
          </button>
        )}

        {(state === 'playing' || state === 'paused' || state === 'gameover') && (
          <button
            onClick={onRestart}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] text-white/70 hover:bg-white/10 hover:text-white transition-colors"
            title="Restart Game [R]"
            aria-label="Restart game"
          >
            <RotateCcw size={13} />
          </button>
        )}
      </div>
    </div>
  )
}

