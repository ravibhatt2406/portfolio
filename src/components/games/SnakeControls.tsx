import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react'

interface SnakeControlsProps {
  onDirectionChange: (dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => void
  disabled?: boolean
}

export function SnakeControls({ onDirectionChange, disabled }: SnakeControlsProps) {
  const trigger = (dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => (e: React.SyntheticEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) {
      onDirectionChange(dir)
    }
  }

  const btnStyle =
    'flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/[0.06] text-white active:scale-95 active:bg-cyan-500/20 active:border-cyan-400 touch-none select-none shadow-md transition-all'

  return (
    <div className="flex flex-col items-center gap-1.5 pt-2 select-none touch-none">
      <button
        type="button"
        onPointerDown={trigger('UP')}
        aria-label="Up"
        className={btnStyle}
      >
        <ArrowUp size={20} />
      </button>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onPointerDown={trigger('LEFT')}
          aria-label="Left"
          className={btnStyle}
        >
          <ArrowLeft size={20} />
        </button>

        <div className="h-5 w-5 rounded-full border border-white/10 bg-white/[0.02]" />

        <button
          type="button"
          onPointerDown={trigger('RIGHT')}
          aria-label="Right"
          className={btnStyle}
        >
          <ArrowRight size={20} />
        </button>
      </div>

      <button
        type="button"
        onPointerDown={trigger('DOWN')}
        aria-label="Down"
        className={btnStyle}
      >
        <ArrowDown size={20} />
      </button>
    </div>
  )
}

