import { useState } from 'react'
import {
  ExternalLink,
  Trophy,
  Sparkles,
  Globe,
  Brain,
  Cpu,
  BarChart3,
  Flame,
  Briefcase,
  Layers,
} from 'lucide-react'
import { Github } from '../ui/BrandIcons'
import { projects, PROJECT_CATEGORIES, type ProjectCategory } from '../../data/projects'
import { H } from './ui'

function getCategoryIcon(cat: ProjectCategory) {
  switch (cat) {
    case 'AI & Machine Learning':
      return <Brain size={14} className="text-cyan-300" />
    case 'Generative AI':
      return <Sparkles size={14} className="text-violet-300" />
    case 'Web Development':
      return <Globe size={14} className="text-blue-300" />
    case 'Data Analytics':
      return <BarChart3 size={14} className="text-emerald-300" />
    case 'Hackathon Projects':
      return <Flame size={14} className="text-amber-300" />
    case 'Freelance Development':
      return <Briefcase size={14} className="text-purple-300" />
    default:
      return <Layers size={14} className="text-cyan-300" />
  }
}

export default function ProjectsApp() {
  const [selectedCategory, setSelectedCategory] = useState<'All' | ProjectCategory>('All')

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter((p) => p.category === selectedCategory)

  return (
    <div className="p-6 md:p-7 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.08] pb-4">
        <div>
          <H>Featured Projects</H>
          <p className="mt-1 text-xs text-white/50">
            Real production systems, AI/ML platforms, hackathon winners, and client deliverables.
          </p>
        </div>
        <span className="text-xs font-medium text-cyan-300/80 self-start sm:self-auto bg-cyan-950/40 border border-cyan-500/20 px-2.5 py-1 rounded-full">
          {projects.length} Verified Projects
        </span>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {PROJECT_CATEGORIES.map((cat) => {
          const active = selectedCategory === cat
          const count = cat === 'All' ? projects.length : projects.filter((p) => p.category === cat).length
          if (count === 0 && cat !== 'All') return null

          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                active
                  ? 'bg-gradient-to-r from-violet-600/80 to-indigo-600/80 text-white shadow-[0_0_15px_rgba(139,92,246,0.4)] border border-violet-400/40'
                  : 'bg-white/[0.03] text-white/65 hover:bg-white/[0.08] hover:text-white border border-white/[0.06]'
              }`}
            >
              {cat !== 'All' && getCategoryIcon(cat as ProjectCategory)}
              <span>{cat}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${active ? 'bg-white/20 text-white' : 'bg-white/[0.05] text-white/40'}`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Projects Grid */}
      <div className="grid gap-4.5 sm:grid-cols-1 md:grid-cols-2">
        {filteredProjects.map((p) => (
          <div
            key={p.id}
            className="group flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4.5 transition-all duration-300 hover:border-violet-500/40 hover:bg-white/[0.06] hover:shadow-[0_12px_35px_rgba(0,0,0,0.5)]"
          >
            <div>
              {/* Preview Header: Real Asset or Category Abstract */}
              {p.image ? (
                <div className="relative mb-3.5 h-36 w-full overflow-hidden rounded-xl border border-white/10 bg-black/40">
                  <img
                    src={p.image}
                    alt={`${p.title} Preview`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 rounded-md bg-black/60 backdrop-blur-md px-2 py-0.5 text-[11px] font-medium text-cyan-200 border border-white/10">
                      {getCategoryIcon(p.category)}
                      {p.category}
                    </span>
                    {p.status && (
                      <span className="rounded-md bg-emerald-500/20 backdrop-blur-md px-2 py-0.5 text-[10px] font-semibold text-emerald-300 border border-emerald-500/30">
                        {p.status}
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="relative mb-3.5 flex h-24 w-full flex-col justify-between rounded-xl border border-white/[0.08] bg-gradient-to-br from-violet-950/40 via-slate-900/40 to-cyan-950/30 p-3">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 rounded-md bg-white/[0.05] px-2 py-0.5 text-[11px] font-medium text-cyan-200 border border-white/10">
                      {getCategoryIcon(p.category)}
                      {p.category}
                    </span>
                    {p.status && (
                      <span className="rounded-md bg-white/[0.06] px-2 py-0.5 text-[10px] font-medium text-white/70 border border-white/10">
                        {p.status}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-xs text-white/40">
                    <span>Verified Project Artifact</span>
                    <span className="font-mono text-[10px] text-cyan-300/60">{p.id}</span>
                  </div>
                </div>
              )}

              {/* Award / Achievement Badge */}
              {p.achievement && (
                <div className="mb-2.5 flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs text-amber-200 font-medium shadow-[0_0_15px_rgba(245,158,11,0.15)]">
                  <Trophy size={14} className="text-amber-400 shrink-0" />
                  <span className="truncate">{p.achievement}</span>
                </div>
              )}

              {/* Project Title */}
              <h3 className="font-display text-lg font-bold text-white tracking-tight group-hover:text-cyan-200 transition-colors">
                {p.title}
              </h3>

              {/* Description */}
              <p className="mt-2 text-xs leading-relaxed text-white/70">
                {p.description}
              </p>

              {/* Technology Badges */}
              <div className="mt-3.5 flex flex-wrap gap-1.5">
                {p.technologies.map((t) => (
                  <span
                    key={t}
                    className="rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 text-[11px] font-medium text-cyan-200/90"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons (Live Demo / GitHub) */}
            <div className="mt-4.5 pt-3.5 border-t border-white/[0.06] flex flex-wrap items-center gap-2">
              {p.liveUrl && (
                <a
                  href={p.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/40 px-3.5 py-2 text-xs font-semibold text-cyan-200 transition-all hover:bg-cyan-500/30 hover:text-white hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] active:scale-95"
                >
                  <ExternalLink size={13} />
                  <span>{p.liveButtonLabel || 'Live Demo'}</span>
                </a>
              )}

              {p.githubUrl && (
                <a
                  href={p.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.04] px-3.5 py-2 text-xs font-semibold text-white/85 transition-all hover:border-white/30 hover:bg-white/[0.1] hover:text-white active:scale-95"
                >
                  <Github size={14} />
                  <span>{p.githubButtonLabel || 'View on GitHub'}</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
