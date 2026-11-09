import { Terminal, Brain, Sparkles, Globe, Wrench, type LucideIcon } from 'lucide-react'
import { skills } from '../../data/skills'
import { H } from './ui'

const ICONS: Record<string, LucideIcon> = {
  'Programming Languages': Terminal,
  'AI & Machine Learning': Brain,
  'Generative & Agentic AI': Sparkles,
  'Web & Databases': Globe,
  'Tools & Visualization': Wrench,
}

export default function SkillsApp() {
  return (
    <div className="p-6 md:p-7 space-y-5">
      <div className="flex items-center justify-between">
        <H>Skills & Technologies</H>
        <span className="text-xs font-mono text-cyan-300/80">Verified Stack</span>
      </div>

      <div className="space-y-4">
        {skills.map((g) => {
          const Icon = ICONS[g.group] || Terminal
          return (
            <section key={g.group} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 transition-colors hover:border-violet-500/30">
              <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-violet-300">
                <Icon size={14} className="text-cyan-300" />
                <span>{g.group}</span>
                <span className="ml-auto text-[10px] font-mono text-white/40">
                  {g.items.length} skills
                </span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {g.items.map((s) => {
                  const isNew = ['LangChain', 'LangGraph', 'XGBoost', 'AI Agents', 'Docker', 'PostgreSQL', 'MongoDB'].includes(s)
                  return (
                    <span
                      key={s}
                      className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition-all ${
                        isNew
                          ? 'border-cyan-400/40 bg-cyan-400/10 text-cyan-200 shadow-[0_0_12px_rgba(34,211,238,0.15)] hover:border-cyan-300 hover:bg-cyan-400/20 hover:text-white'
                          : 'border-white/10 bg-white/[0.04] text-white/90 hover:border-violet-400/40 hover:bg-violet-500/15 hover:text-white'
                      }`}
                    >
                      {isNew && <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_6px_#67e8f9]" />}
                      <span>{s}</span>
                    </span>
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
