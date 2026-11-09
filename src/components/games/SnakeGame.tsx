import { useEffect, useRef, useState, useCallback } from 'react'
import { Play, RotateCcw, Trophy, Gamepad2, Sparkles } from 'lucide-react'
import { SnakeHUD } from './SnakeHUD'
import { SnakeControls } from './SnakeControls'
import { useDesktop } from '../../store/desktopStore'

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'
type GameState = 'ready' | 'playing' | 'paused' | 'gameover'

interface Point {
  x: number
  y: number
}

const GRID_SIZE = 20
const INITIAL_SPEED_MS = 125
const MIN_SPEED_MS = 60
const HIGH_SCORE_KEY = 'ravi_os_snake_high_score'

export function SnakeGame() {
  const activeId = useDesktop((s) => s.activeId)
  const isAppActive = activeId === 'games'

  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const [gameState, setGameState] = useState<GameState>('ready')
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)

  // Internal mutable game state refs (avoids stale closures in the loop)
  const snakeRef = useRef<Point[]>([
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ])
  const directionRef = useRef<Direction>('RIGHT')
  const nextDirectionRef = useRef<Direction>('RIGHT')
  const foodRef = useRef<Point>({ x: 15, y: 10 })
  const speedRef = useRef(INITIAL_SPEED_MS)
  const loopTimeoutRef = useRef<number | null>(null)

  // Load high score
  useEffect(() => {
    try {
      const saved = localStorage.getItem(HIGH_SCORE_KEY)
      if (saved) setHighScore(parseInt(saved, 10) || 0)
    } catch {
      // ignore
    }
  }, [])

  // Spawns food on empty grid cell
  const spawnFood = useCallback((): Point => {
    const snake = snakeRef.current
    const occupied = new Set(snake.map((p) => `${p.x},${p.y}`))
    const emptyCells: Point[] = []

    for (let x = 0; x < GRID_SIZE; x++) {
      for (let y = 0; y < GRID_SIZE; y++) {
        if (!occupied.has(`${x},${y}`)) {
          emptyCells.push({ x, y })
        }
      }
    }

    if (emptyCells.length === 0) {
      return { x: 0, y: 0 }
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length)
    return emptyCells[randomIndex]
  }, [])

  // Draw board on canvas
  const drawGame = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const cellW = width / GRID_SIZE
    const cellH = height / GRID_SIZE

    // Background
    ctx.fillStyle = '#0a0914'
    ctx.fillRect(0, 0, width, height)

    // Subtle grid dots / lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)'
    ctx.lineWidth = 1
    for (let x = 0; x <= GRID_SIZE; x++) {
      ctx.beginPath()
      ctx.moveTo(x * cellW, 0)
      ctx.lineTo(x * cellW, height)
      ctx.stroke()
    }
    for (let y = 0; y <= GRID_SIZE; y++) {
      ctx.beginPath()
      ctx.moveTo(0, y * cellH)
      ctx.lineTo(width, y * cellH)
      ctx.stroke()
    }

    // Food (Pulsing glowing orb)
    const food = foodRef.current
    const foodRadius = (cellW / 2) * 0.75
    const foodCenterX = food.x * cellW + cellW / 2
    const foodCenterY = food.y * cellH + cellH / 2

    // Outer Glow
    const gradient = ctx.createRadialGradient(
      foodCenterX,
      foodCenterY,
      foodRadius * 0.3,
      foodCenterX,
      foodCenterY,
      cellW * 1.4
    )
    gradient.addColorStop(0, 'rgba(244, 63, 94, 0.95)')
    gradient.addColorStop(0.5, 'rgba(244, 63, 94, 0.4)')
    gradient.addColorStop(1, 'rgba(244, 63, 94, 0)')

    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(foodCenterX, foodCenterY, cellW * 1.4, 0, Math.PI * 2)
    ctx.fill()

    // Core Food Orb
    ctx.fillStyle = '#ff385c'
    ctx.beginPath()
    ctx.arc(foodCenterX, foodCenterY, foodRadius, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.arc(foodCenterX - foodRadius * 0.3, foodCenterY - foodRadius * 0.3, foodRadius * 0.3, 0, Math.PI * 2)
    ctx.fill()

    // Snake Body
    const snake = snakeRef.current
    snake.forEach((segment, index) => {
      const isHead = index === 0
      const px = segment.x * cellW
      const py = segment.y * cellH
      const inset = 1.5
      const segW = cellW - inset * 2
      const segH = cellH - inset * 2

      if (isHead) {
        // Snake Head: Vibrant cyan with directional eyes
        ctx.fillStyle = '#22d3ee'
        ctx.shadowColor = '#06b6d4'
        ctx.shadowBlur = 12

        // Rounded rect for head
        ctx.beginPath()
        ctx.roundRect(px + inset, py + inset, segW, segH, 5)
        ctx.fill()
        ctx.shadowBlur = 0

        // Eyes
        ctx.fillStyle = '#082f49'
        const eyeRadius = 1.8
        let eye1X = px + cellW * 0.3
        let eye1Y = py + cellH * 0.3
        let eye2X = px + cellW * 0.7
        let eye2Y = py + cellH * 0.3

        if (directionRef.current === 'DOWN') {
          eye1X = px + cellW * 0.3
          eye1Y = py + cellH * 0.7
          eye2X = px + cellW * 0.7
          eye2Y = py + cellH * 0.7
        } else if (directionRef.current === 'LEFT') {
          eye1X = px + cellW * 0.3
          eye1Y = py + cellH * 0.3
          eye2X = px + cellW * 0.3
          eye2Y = py + cellH * 0.7
        } else if (directionRef.current === 'RIGHT') {
          eye1X = px + cellW * 0.7
          eye1Y = py + cellH * 0.3
          eye2X = px + cellW * 0.7
          eye2Y = py + cellH * 0.7
        }

        ctx.beginPath()
        ctx.arc(eye1X, eye1Y, eyeRadius, 0, Math.PI * 2)
        ctx.arc(eye2X, eye2Y, eyeRadius, 0, Math.PI * 2)
        ctx.fill()
      } else {
        // Body segments: Gradient cyan/teal fade toward tail
        const progress = 1 - index / snake.length
        ctx.fillStyle = `rgba(34, 211, 238, ${0.4 + progress * 0.5})`

        ctx.beginPath()
        ctx.roundRect(px + inset, py + inset, segW, segH, 4)
        ctx.fill()
      }
    })
  }, [])

  // Game step logic
  const tick = useCallback(() => {
    directionRef.current = nextDirectionRef.current
    const dir = directionRef.current
    const snake = [...snakeRef.current]
    const head = { ...snake[0] }

    if (dir === 'UP') head.y -= 1
    else if (dir === 'DOWN') head.y += 1
    else if (dir === 'LEFT') head.x -= 1
    else if (dir === 'RIGHT') head.x += 1

    // 1. Wall Collision check
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      setGameState('gameover')
      return
    }

    // 2. Self Collision check
    for (let i = 0; i < snake.length; i++) {
      if (snake[i].x === head.x && snake[i].y === head.y) {
        setGameState('gameover')
        return
      }
    }

    // Move snake
    snake.unshift(head)

    // Check if food eaten
    const food = foodRef.current
    if (head.x === food.x && head.y === food.y) {
      setScore((prev) => {
        const newScore = prev + 10
        setHighScore((curHigh) => {
          if (newScore > curHigh) {
            try {
              localStorage.setItem(HIGH_SCORE_KEY, newScore.toString())
            } catch {
              // ignore
            }
            return newScore
          }
          return curHigh
        })
        return newScore
      })

      // Increase speed slightly
      speedRef.current = Math.max(MIN_SPEED_MS, speedRef.current - 2.5)

      // Spawn next food
      foodRef.current = spawnFood()
    } else {
      // Normal move: pop tail
      snake.pop()
    }

    snakeRef.current = snake
    drawGame()

    // Schedule next tick
    loopTimeoutRef.current = window.setTimeout(tick, speedRef.current)
  }, [drawGame, spawnFood])

  // Start / Restart game
  const startGame = useCallback(() => {
    if (loopTimeoutRef.current) {
      clearTimeout(loopTimeoutRef.current)
    }

    snakeRef.current = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ]
    directionRef.current = 'RIGHT'
    nextDirectionRef.current = 'RIGHT'
    speedRef.current = INITIAL_SPEED_MS
    foodRef.current = spawnFood()

    setScore(0)
    setGameState('playing')
  }, [spawnFood])

  // Pause / Resume toggle
  const togglePause = useCallback(() => {
    setGameState((cur) => {
      if (cur === 'playing') return 'paused'
      if (cur === 'paused') return 'playing'
      return cur
    })
  }, [])

  // Direction handler (prevents 180° immediate reversal)
  const handleDirection = useCallback((dir: Direction) => {
    const cur = directionRef.current
    if (dir === 'UP' && cur !== 'DOWN') nextDirectionRef.current = 'UP'
    else if (dir === 'DOWN' && cur !== 'UP') nextDirectionRef.current = 'DOWN'
    else if (dir === 'LEFT' && cur !== 'RIGHT') nextDirectionRef.current = 'LEFT'
    else if (dir === 'RIGHT' && cur !== 'LEFT') nextDirectionRef.current = 'RIGHT'
  }, [])

  // Run game loop when in playing state
  useEffect(() => {
    if (gameState === 'playing') {
      loopTimeoutRef.current = window.setTimeout(tick, speedRef.current)
    } else if (loopTimeoutRef.current) {
      clearTimeout(loopTimeoutRef.current)
    }

    return () => {
      if (loopTimeoutRef.current) {
        clearTimeout(loopTimeoutRef.current)
      }
    }
  }, [gameState, tick])

  // Initial render of ready canvas
  useEffect(() => {
    drawGame()
  }, [drawGame])

  // Auto-pause when tab is hidden or window is not active
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && gameState === 'playing') {
        setGameState('paused')
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [gameState])

  // Keyboard controls listener (scoped strictly to when games window is active)
  useEffect(() => {
    if (!isAppActive) return

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()

      // Prevent window scrolling on arrow keys or space
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(key)) {
        e.preventDefault()
      }

      if (gameState === 'ready' || gameState === 'gameover') {
        if (key === 'enter' || key === ' ' || key === 'r') {
          startGame()
        }
        return
      }

      if (key === ' ' || key === 'p') {
        togglePause()
        return
      }

      if (key === 'r') {
        startGame()
        return
      }

      if (gameState !== 'playing') return

      if (key === 'arrowup' || key === 'w') handleDirection('UP')
      else if (key === 'arrowdown' || key === 's') handleDirection('DOWN')
      else if (key === 'arrowleft' || key === 'a') handleDirection('LEFT')
      else if (key === 'arrowright' || key === 'd') handleDirection('RIGHT')
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isAppActive, gameState, startGame, togglePause, handleDirection])

  return (
    <div className="flex h-full flex-col p-4 sm:p-6 space-y-4 select-none">
      {/* Top HUD */}
      <SnakeHUD
        score={score}
        highScore={highScore}
        state={gameState}
        onPauseToggle={togglePause}
        onRestart={startGame}
      />

      {/* Main Arcade Board */}
      <div className="relative mx-auto flex aspect-square w-full max-w-[400px] items-center justify-center overflow-hidden rounded-2xl border border-white/15 bg-[#0a0914] shadow-[0_0_35px_rgba(0,0,0,0.85),0_0_20px_rgba(34,211,238,0.12)]">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="h-full w-full object-contain"
        />

        {/* State Overlay: Ready */}
        {gameState === 'ready' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/75 p-6 text-center backdrop-blur-xs">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-400/40 shadow-[0_0_25px_rgba(34,211,238,0.3)] mb-3">
              <Gamepad2 size={28} />
            </div>
            <h2 className="font-display text-xl font-bold tracking-wider text-white">
              SNAKE ARCADE
            </h2>
            <p className="mt-1 text-xs text-white/60">Ready to beat your high score?</p>

            <button
              onClick={startGame}
              className="mt-5 flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-2.5 text-xs font-bold tracking-wider text-white shadow-[0_0_25px_rgba(6,182,212,0.6)] transition-all hover:scale-105 hover:from-cyan-400 hover:to-blue-500 active:scale-95"
            >
              <Play size={14} className="fill-white" />
              <span>START GAME</span>
            </button>

            <span className="mt-3 text-[10px] font-mono text-white/40">
              Press [Space] or [Enter]
            </span>
          </div>
        )}

        {/* State Overlay: Paused */}
        {gameState === 'paused' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/75 p-6 text-center backdrop-blur-xs">
            <h3 className="font-display text-lg font-bold tracking-wider text-amber-300">
              GAME PAUSED
            </h3>
            <p className="mt-1 text-xs text-white/60">Take a breath and continue when ready</p>

            <button
              onClick={togglePause}
              className="mt-4 flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-2 text-xs font-bold text-stone-950 shadow-md hover:bg-amber-400 active:scale-95 transition-all"
            >
              <Play size={14} className="fill-stone-950" />
              <span>RESUME</span>
            </button>

            <span className="mt-3 text-[10px] font-mono text-white/40">
              Press [Space] to resume
            </span>
          </div>
        )}

        {/* State Overlay: Game Over */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 p-6 text-center backdrop-blur-sm animate-in fade-in duration-200">
            <h3 className="font-display text-2xl font-black tracking-wider text-rose-400 drop-shadow-[0_0_15px_rgba(244,63,94,0.6)]">
              GAME OVER
            </h3>

            <div className="mt-3 flex items-center gap-6 text-xs">
              <div>
                <span className="block text-[10px] font-mono uppercase text-white/40">Score</span>
                <span className="font-mono text-lg font-bold text-white">{score}</span>
              </div>
              <div className="h-6 w-[1px] bg-white/15" />
              <div>
                <span className="block text-[10px] font-mono uppercase text-white/40">Best</span>
                <span className="font-mono text-lg font-bold text-amber-400">{highScore}</span>
              </div>
            </div>

            {score >= highScore && score > 0 && (
              <div className="mt-2.5 flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-0.5 text-[10px] font-semibold text-amber-300">
                <Sparkles size={11} />
                <span>New Best Score!</span>
              </div>
            )}

            <button
              onClick={startGame}
              className="mt-5 flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-2.5 text-xs font-bold tracking-wider text-white shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all hover:scale-105 active:scale-95"
            >
              <RotateCcw size={13} />
              <span>PLAY AGAIN</span>
            </button>

            <span className="mt-2.5 text-[10px] font-mono text-white/40">
              Press [Space] or [R] to restart
            </span>
          </div>
        )}
      </div>

      {/* Touch D-Pad for Mobile and Controls Guide for Desktop */}
      <div className="mt-auto">
        <div className="block sm:hidden">
          <SnakeControls
            onDirectionChange={handleDirection}
            disabled={gameState !== 'playing'}
          />
        </div>

        <div className="hidden sm:flex items-center justify-center gap-4 text-[11px] font-mono text-white/40 pt-1">
          <span>[Arrows / WASD] Move</span>
          <span>•</span>
          <span>[Space] Pause</span>
          <span>•</span>
          <span>[R] Restart</span>
        </div>
      </div>
    </div>
  )
}

