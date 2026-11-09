import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { profile } from '../../data/profile'
import { projects } from '../../data/projects'
import { skills } from '../../data/skills'
import { achievements } from '../../data/achievements'
import { useDesktop, APP_IDS, type AppId } from '../../store/desktopStore'

const HELP = [
  'RAVI.OS Interactive Shell v2.4',
  'Available commands:',
  '  whoami       - Display developer summary',
  '  projects     - List portfolio projects',
  '  skills       - Inspect technical capabilities',
  '  achievements - View competitions and hackathons',
  '  open <app>   - Launch an OS application (e.g. open about)',
  '  clear        - Clear console buffer',
  '  help         - Show this guidance',
].join('\n')

export default function TerminalApp() {
  const [lines, setLines] = useState<string[]>([HELP])
  const [val, setVal] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [histIdx, setHistIdx] = useState<number>(-1)
  const end = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    end.current?.scrollIntoView({ block: 'end' })
  }, [lines])

  const run = (raw: string) => {
    const trimmed = raw.trim()
    if (!trimmed) {
      setLines((l) => [...l, `ravi@ravi-os:~$ `])
      return
    }

    setHistory((h) => [...h, trimmed])
    setHistIdx(-1)

    const [cmd, ...rest] = trimmed.split(/\s+/)
    let out: string[] = []

    switch (cmd.toLowerCase()) {
      case 'help':
        out = [HELP]
        break
      case 'whoami':
        out = [
          `${profile.name} — ${profile.title}`,
          `Location: ${profile.location}`,
          `College: ${profile.college} (${profile.period})`,
          `Degree: ${profile.degree}`,
        ]
        break
      case 'projects':
        out = projects.map((p) => `• ${p.name}${p.summary ? ` — ${p.summary}` : ''}`)
        break
      case 'skills':
        out = skills.map((g) => `${g.group.toUpperCase()}: ${g.items.join(', ')}`)
        break
      case 'achievements':
        out = achievements.map((a) => `★ ${a}`)
        break
      case 'clear':
        setLines([])
        return
      case 'open': {
        const id = (rest[0] || '').toLowerCase() as AppId
        if (APP_IDS.includes(id)) {
          useDesktop.getState().open(id)
          out = [`Launching application: [${id}]...`]
        } else {
          out = [`Error: unknown app '${rest[0]}'. Choose from: ${APP_IDS.join(', ')}`]
        }
        break
      }
      default:
        out = [`zsh: command not found: ${cmd}. Type 'help' for available commands.`]
    }

    setLines((l) => [...l, `ravi@ravi-os:~$ ${raw}`, ...out])
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (history.length === 0) return
      const nextIdx = histIdx === -1 ? history.length - 1 : Math.max(0, histIdx - 1)
      setHistIdx(nextIdx)
      setVal(history[nextIdx] || '')
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (histIdx === -1) return
      const nextIdx = histIdx + 1
      if (nextIdx >= history.length) {
        setHistIdx(-1)
        setVal('')
      } else {
        setHistIdx(nextIdx)
        setVal(history[nextIdx] || '')
      }
    }
  }

  return (
    <div
      className="h-full bg-[#0a0718]/90 p-4 font-mono text-[12.5px] leading-relaxed text-emerald-300/90 selection:bg-violet-500/40"
      onClick={() => inputRef.current?.focus()}
    >
      {lines.map((l, i) => (
        <div key={i} className="whitespace-pre-wrap font-mono mb-1">
          {l.startsWith('ravi@ravi-os:~$') ? (
            <span>
              <span className="text-cyan-400 font-semibold">ravi@ravi-os</span>
              <span className="text-white/40">:</span>
              <span className="text-violet-400">~</span>
              <span className="text-white/70">$ </span>
              <span className="text-white font-medium">{l.replace('ravi@ravi-os:~$ ', '')}</span>
            </span>
          ) : (
            <span className={l.startsWith('Error') || l.startsWith('zsh') ? 'text-rose-300' : 'text-emerald-300/90'}>
              {l}
            </span>
          )}
        </div>
      ))}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          run(val)
          setVal('')
        }}
        className="flex items-center gap-1.5 pt-1"
      >
        <span className="text-cyan-400 font-semibold">ravi@ravi-os</span>
        <span className="text-white/40">:</span>
        <span className="text-violet-400">~</span>
        <span className="text-white/70">$</span>
        <input
          ref={inputRef}
          autoFocus
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent text-white font-medium outline-none ml-1 caret-cyan-300"
          spellCheck={false}
          autoComplete="off"
          aria-label="Terminal prompt input"
        />
      </form>
      <div ref={end} />
    </div>
  )
}
