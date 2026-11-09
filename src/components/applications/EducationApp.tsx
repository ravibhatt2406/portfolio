import { GraduationCap } from 'lucide-react'
import { education } from '../../data/achievements'
import { H } from './ui'

export default function EducationApp() {
  return (
    <div className="p-7 space-y-5">
      <div className="flex items-center justify-between">
        <H>Education</H>
        <span className="text-xs text-white/40">Academic Background</span>
      </div>
      <div className="space-y-3.5">
        {education.map((e) => (
          <div
            key={e.title}
            className="flex items-start gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4.5 transition-all hover:border-teal-400/35 hover:bg-white/[0.05]"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400/20 to-cyan-600/20 text-teal-300 ring-1 ring-white/10">
              <GraduationCap size={18} />
            </span>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold text-white text-[15px]">{e.title}</h3>
                <span className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 text-xs font-medium text-cyan-300">
                  {e.detail}
                </span>
              </div>
              {e.org && <p className="text-sm text-white/60 mt-1">{e.org}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
