import { lazy, type ComponentType, type LazyExoticComponent } from 'react'
import {
  User,
  FolderKanban,
  Cpu,
  Briefcase,
  Trophy,
  GraduationCap,
  FileText,
  Mail,
  Gamepad2,
  Terminal,
  type LucideIcon,
} from 'lucide-react'
import type { AppId } from '../../store/desktopStore'

export interface AppDef {
  title: string
  Icon: LucideIcon
  gradient: string
  Component: LazyExoticComponent<ComponentType>
}

export const APPS: Record<AppId, AppDef> = {
  about: { title: 'About Me', Icon: User, gradient: 'from-violet-500 to-indigo-600', Component: lazy(() => import('./AboutApp')) },
  projects: { title: 'Projects', Icon: FolderKanban, gradient: 'from-blue-500 to-cyan-400', Component: lazy(() => import('./ProjectsApp')) },
  skills: { title: 'Skills', Icon: Cpu, gradient: 'from-fuchsia-500 to-violet-600', Component: lazy(() => import('./SkillsApp')) },
  experience: { title: 'Experience', Icon: Briefcase, gradient: 'from-sky-500 to-blue-700', Component: lazy(() => import('./ExperienceApp')) },
  achievements: { title: 'Achievements', Icon: Trophy, gradient: 'from-amber-400 to-orange-500', Component: lazy(() => import('./AchievementsApp')) },
  education: { title: 'Education', Icon: GraduationCap, gradient: 'from-teal-400 to-cyan-600', Component: lazy(() => import('./EducationApp')) },
  resume: { title: 'Resume', Icon: FileText, gradient: 'from-slate-400 to-slate-600', Component: lazy(() => import('./ResumeApp')) },
  contact: { title: 'Contact', Icon: Mail, gradient: 'from-pink-500 to-rose-600', Component: lazy(() => import('./ContactApp')) },
  games: { title: 'Games', Icon: Gamepad2, gradient: 'from-emerald-500 to-teal-700', Component: lazy(() => import('./GamesApp')) },
  terminal: { title: 'Terminal', Icon: Terminal, gradient: 'from-zinc-700 to-zinc-900', Component: lazy(() => import('./TerminalApp')) },
}

/** Order used by the sidebar and the dock (terminal is dock/menu only). */
export const NAV_ORDER: AppId[] = [
  'about',
  'projects',
  'skills',
  'experience',
  'achievements',
  'education',
  'resume',
  'contact',
  'games',
]
