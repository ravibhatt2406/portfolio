import { Briefcase, GitBranch, Code2 } from 'lucide-react'
import { experience } from '../../data/experience'
import { H } from './ui'

function getExpMeta(type?: string) {
  if (type?.toLowerCase().includes('open source')) {
    return {
      Icon: GitBranch,
      gradient: 'from-emerald-500/20 to-teal-700/20',
      iconColor: 'text-emerald-300',
      badgeBg: 'bg-emerald-400/10 text-emerald-300 border-emerald-400/20',
    }
  }
  if (type?.toLowerCase().includes('freelance')) {
    return {
      Icon: Code2,
      gradient: 'from-amber-500/20 to-orange-700/20',
      iconColor: 'text-amber-300',
      badgeBg: 'bg-amber-400/10 text-amber-300 border-amber-400/20',
    }
  }
  return {
    Icon: Briefcase,
    gradient: 'from-sky-500/20 to-blue-700/20',
    iconColor: 'text-sky-300',
    badgeBg: 'bg-sky-400/10 text-sky-300 border-sky-400/20',
  }
}

export default function ExperienceApp() {
  return (
    <div className="p-6 md:p-7 space-y-5 overflow-y-auto max-h-full custom-scrollbar">
      <div className="flex items-center justify-between">
        <H>Experience</H>
        <span className="text-xs text-white/40">Work & Open Source</span>
      </div>
      <div className="space-y-3.5">
        {experience.map((e) => {
          const { Icon, gradient, iconColor, badgeBg } = getExpMeta(e.type)
          return (
            <div
              key={e.title}
              className="flex items-start gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4.5 transition-all hover:border-violet-500/35 hover:bg-white/[0.05]"
            >
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} ${iconColor} ring-1 ring-white/10`}>
                <Icon size={18} />
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-semibold text-white text-[15px]">{e.title}</h3>
                  {e.type && (
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold border ${badgeBg}`}>
                      {e.type}
                    </span>
                  )}
                </div>
                {e.role && <p className="text-sm font-medium text-cyan-200/90 mt-0.5">{e.role}</p>}
                <div className="flex items-center gap-2 text-xs text-white/45 mt-1">
                  {e.org && <span>{e.org}</span>}
                  {e.org && e.period && <span>•</span>}
                  {e.period && <span className="font-mono">{e.period}</span>}
                </div>
                {e.summary && <p className="mt-2 text-xs leading-relaxed text-white/60">{e.summary}</p>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
