import { Trophy } from 'lucide-react'
import { achievements } from '../../data/achievements'
import { H } from './ui'

export default function AchievementsApp() {
  return (
    <div className="p-7 space-y-5">
      <div className="flex items-center justify-between">
        <H>Achievements & Honors</H>
        <span className="text-xs text-white/40">Certifications & Hackathons</span>
      </div>
      <div className="space-y-3">
        {achievements.map((a, i) => (
          <div
            key={a}
            className="flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 transition-all hover:border-amber-400/40 hover:bg-white/[0.06]"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400/20 to-orange-500/20 text-amber-300 ring-1 ring-white/10">
              <Trophy size={18} />
            </span>
            <div className="flex-1">
              <p className="font-semibold text-white text-sm">{a}</p>
              <p className="text-[11px] text-white/45 mt-0.5">Verified credential & achievement #{i + 1}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
