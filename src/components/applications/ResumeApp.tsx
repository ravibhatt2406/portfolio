import { Download, ExternalLink, FileText, CheckCircle2 } from 'lucide-react'
import { H } from './ui'
import { profile } from '../../data/profile'

const RESUME_URL = '/resume.pdf'

export default function ResumeApp() {
  return (
    <div className="flex h-full flex-col bg-[#0d0b18]">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] px-5 py-3.5 bg-white/[0.02]">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/20 text-violet-300 ring-1 ring-white/10">
            <FileText size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <H>Resume</H>
              <span className="flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                <CheckCircle2 size={10} /> Verified PDF
              </span>
            </div>
            <p className="text-[11px] text-white/50">{profile.name} • {profile.title}</p>
          </div>
        </div>

        {/* Action Buttons: Open in New Tab & Download Resume */}
        <div className="flex items-center gap-2">
          <a
            href={RESUME_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-white/80 transition-colors hover:border-cyan-400/40 hover:bg-white/10 hover:text-white"
            title="Open resume in a new browser tab"
          >
            <ExternalLink size={13} />
            <span>Open in New Tab</span>
          </a>

          <a
            href={RESUME_URL}
            download="Ravi-Bhatt-Resume.pdf"
            className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-1.5 text-xs font-semibold text-white shadow-[0_0_15px_rgba(139,92,246,0.5)] transition-all hover:from-violet-500 hover:to-indigo-500 hover:shadow-[0_0_20px_rgba(139,92,246,0.8)]"
            title="Download PDF to local storage"
          >
            <Download size={13} />
            <span>Download Resume</span>
          </a>
        </div>
      </div>

      {/* Embedded PDF Viewer */}
      <div className="relative flex-1 min-h-[420px] w-full overflow-hidden bg-black/40">
        <iframe
          title="Ravi Bhatt Official Resume PDF"
          src={`${RESUME_URL}#view=FitH`}
          className="h-full w-full border-0 bg-[#161426]"
        />
      </div>

      {/* Footer Info Toolbar */}
      <div className="flex items-center justify-between border-t border-white/[0.08] px-5 py-2.5 bg-white/[0.02] text-[11px] text-white/50">
        <span className="truncate">Source: {profile.name} — B.Tech Artificial Intelligence and Data Science</span>
        <div className="flex items-center gap-3 shrink-0">
          <a
            href={RESUME_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-300 hover:text-cyan-200 transition-colors flex items-center gap-1"
          >
            <span>Full Screen</span>
            <ExternalLink size={11} />
          </a>
        </div>
      </div>
    </div>
  )
}
