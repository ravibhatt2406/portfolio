import { profile } from '../../data/profile'
import portrait from '../../assets/portrait/portrait.jpg'
import { Github, Linkedin, Leetcode } from '../ui/BrandIcons'
import { Mail, GraduationCap, MapPin, Award, Briefcase } from 'lucide-react'

export default function AboutApp() {
  return (
    <div className="flex flex-col gap-5 p-5 md:p-6 sm:flex-row">
      <div className="flex flex-col items-center sm:items-start shrink-0">
        <div className="h-28 w-28 shrink-0 overflow-hidden rounded-full ring-2 ring-violet-500/40 shadow-[0_0_25px_rgba(139,92,246,0.25)]">
          <img src={portrait} alt="Ravi Bhatt" className="h-full w-full object-cover scale-[1.08] object-center" />
        </div>
        <div className="mt-2.5 flex items-center gap-1.5 text-xs text-white/50">
          <MapPin size={12} className="text-violet-400" />
          <span>{profile.location}</span>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-baseline gap-2.5">
          <h2 className="font-display text-2xl font-bold tracking-tight text-white">{profile.name}</h2>
          <span className="rounded-full bg-cyan-400/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-300 border border-cyan-400/20">
            {profile.title}
          </span>
        </div>

        <p className="mt-1.5 leading-relaxed text-white/75 text-xs">
          {profile.tagline} Focused on machine learning architectures, computer vision pipelines, full-stack web platforms, and retrieval-augmented generation systems.
        </p>

        {/* Experience Section in About — IIT Ropar & Open Source */}
        <div className="mt-2.5 rounded-xl border border-white/10 bg-white/[0.03] p-2.5 transition-colors hover:border-sky-400/30">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Briefcase size={13} className="text-sky-300" />
              <span className="font-semibold text-white/95">Vicharanashala Lab, IIT Ropar</span>
            </div>
            <span className="rounded-full bg-sky-400/10 px-2 py-0.5 text-[10px] font-semibold text-sky-300 border border-sky-400/20">
              Internship
            </span>
          </div>
          <p className="mt-1 text-[11px] text-white/70 leading-relaxed">
            Contributed to the open-source FLN project, performed predictive modeling and EDA on ICRISAT agricultural data, and built AI/ML & MERN-stack applications.
          </p>
          <div className="mt-1.5 flex items-center justify-between text-[10px] font-mono text-white/45">
            <div className="flex items-center gap-2">
              <span className="text-cyan-300/80">IIT Ropar</span>
              <span>•</span>
              <span>Sep 2026 – Nov 2026</span>
            </div>
            <span className="text-emerald-400/80 font-sans font-medium text-[10px]">Open Source Contributor</span>
          </div>
        </div>

        {/* Education & Achievements Grid */}
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="flex items-start gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-2.5">
            <GraduationCap size={15} className="text-violet-400 mt-0.5 shrink-0" />
            <div>
              <div className="font-semibold text-white/90 text-xs">{profile.degree}</div>
              <div className="text-white/60 text-[11px] leading-snug">{profile.college}</div>
              <div className="text-[10px] font-mono text-cyan-300/80 mt-0.5">{profile.period}</div>
            </div>
          </div>

          <div className="flex items-start gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-2.5">
            <Award size={15} className="text-amber-400 mt-0.5 shrink-0" />
            <div>
              <div className="font-semibold text-white/90 text-xs">FutureHacks Winner</div>
              <div className="text-white/60 text-[11px] leading-snug">1st Place — Advanced Category</div>
              <div className="text-[10px] font-mono text-amber-300/80 mt-0.5">UrbanPlus.AI (SIH & Hackathons)</div>
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <a
            href={profile.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.03] px-3 py-1 text-xs text-white/80 transition-colors hover:border-cyan-400/40 hover:bg-white/10 hover:text-white"
          >
            <Github size={13} /> <span>GitHub</span>
          </a>
          <a
            href={profile.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.03] px-3 py-1 text-xs text-white/80 transition-colors hover:border-cyan-400/40 hover:bg-white/10 hover:text-white"
          >
            <Linkedin size={13} /> <span>LinkedIn</span>
          </a>
          <a
            href={profile.links.leetcode}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.03] px-3 py-1 text-xs text-white/80 transition-colors hover:border-cyan-400/40 hover:bg-white/10 hover:text-white"
          >
            <Leetcode size={13} /> <span>LeetCode</span>
          </a>
          <a
            href={profile.links.email}
            className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.03] px-3 py-1 text-xs text-white/80 transition-colors hover:border-cyan-400/40 hover:bg-white/10 hover:text-white"
          >
            <Mail size={13} /> <span>Email</span>
          </a>
        </div>
      </div>
    </div>
  )
}
