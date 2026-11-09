import type { MutableRefObject } from 'react'
import { MapPin, Mail } from 'lucide-react'
import { useDesktop } from '../../store/desktopStore'
import { APPS, NAV_ORDER } from '../applications/registry'
import { profile } from '../../data/profile'
import { Github, Linkedin, Leetcode } from '../ui/BrandIcons'
import portrait from '../../assets/portrait/portrait.jpg'

export function Sidebar({
  mouse: _mouse,
  collapsed,
}: {
  mouse: MutableRefObject<{ x: number; y: number; active: boolean }>
  collapsed: boolean
}) {
  const open = useDesktop((s) => s.open)
  const winMap = useDesktop((s) => s.windows)
  const active = useDesktop((s) => s.activeId)

  return (
    <aside
      className={`glass fixed bottom-28 left-3 top-11 z-30 flex flex-col rounded-3xl ${
        collapsed ? 'w-[68px] items-center py-4' : 'w-[236px] p-4'
      } border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]`}
    >
      {/* Real profile photograph replacing previous sidebar hologram */}
      <div
        className={`${
          collapsed ? 'h-12 w-12 rounded-2xl ring-1' : 'mx-auto h-28 w-28 rounded-full ring-2'
        } relative shrink-0 overflow-hidden ring-violet-500/35 border border-white/15 bg-gradient-to-b from-white/[0.08] to-black/40 shadow-[0_0_25px_rgba(139,92,246,0.22)] group`}
      >
        <img
          src={portrait}
          alt={profile.name}
          className="h-full w-full object-cover scale-[1.08] object-center transition-transform duration-300 group-hover:scale-[1.12]"
        />
      </div>
      {!collapsed && (
        <div className="mt-3 text-center">
          <h2 className="font-display text-lg font-bold text-white tracking-wide">{profile.name}</h2>
          <p className="text-xs font-medium text-cyan-200/85">{profile.title}</p>
          <p className="mt-1 flex items-center justify-center gap-1 text-[11px] text-white/50">
            <MapPin size={11} className="text-violet-400" />
            {profile.location}
          </p>

          <div className="mt-2.5 flex items-center justify-center gap-1.5">
            <a
              href={profile.links.github}
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub Profile"
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-white/70 transition-colors hover:border-cyan-400/40 hover:bg-white/10 hover:text-white"
            >
              <Github size={13} />
            </a>
            <a
              href={profile.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              title="LinkedIn Profile"
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-white/70 transition-colors hover:border-cyan-400/40 hover:bg-white/10 hover:text-white"
            >
              <Linkedin size={13} />
            </a>
            <a
              href={profile.links.leetcode}
              target="_blank"
              rel="noopener noreferrer"
              title="LeetCode Profile"
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-white/70 transition-colors hover:border-cyan-400/40 hover:bg-white/10 hover:text-white"
            >
              <Leetcode size={13} />
            </a>
            <a
              href={profile.links.email}
              title="Email Ravi"
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-white/70 transition-colors hover:border-cyan-400/40 hover:bg-white/10 hover:text-white"
            >
              <Mail size={13} />
            </a>
          </div>
        </div>
      )}
      <nav
        className={`mt-3.5 flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto ${
          collapsed ? 'items-center' : ''
        }`}
        aria-label="Applications"
      >
        {NAV_ORDER.map((id) => {
          const { Icon, title } = APPS[id]
          const isOpen = winMap[id].open
          return (
            <button
              key={id}
              onClick={() => open(id)}
              title={title}
              className={`flex items-center gap-3 rounded-xl text-sm font-medium transition ${
                collapsed ? 'h-10 w-10 justify-center' : 'px-3 py-2'
              } ${
                active === id
                  ? 'bg-violet-500/35 text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon size={16} className={active === id ? 'text-cyan-300' : 'text-white/75'} />
              {!collapsed && <span className="flex-1 text-left">{title}</span>}
              {!collapsed && isOpen && (
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_6px_#67e8f9]" />
              )}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
