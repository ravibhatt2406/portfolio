import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Send, CheckCircle2, Mail, Copy, Check, ExternalLink } from 'lucide-react'
import { Github, Linkedin, Leetcode } from '../ui/BrandIcons'
import { profile } from '../../data/profile'
import { H } from './ui'

const field =
  'w-full rounded-xl border border-white/12 bg-white/[0.04] px-3.5 py-2 text-xs text-white placeholder:text-white/30 focus:border-violet-400 focus:bg-white/[0.07] focus:outline-none transition-all'

export default function ContactApp() {
  const [v, setV] = useState({ name: '', email: '', message: '' })
  const [err, setErr] = useState<Partial<typeof v>>({})
  const [sent, setSent] = useState(false)
  const [copied, setCopied] = useState(false)

  const on = (k: keyof typeof v) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setV({ ...v, [k]: e.target.value })

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch {
      // fallback
      const textArea = document.createElement('textarea')
      textArea.value = profile.email
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    }
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const n: Partial<typeof v> = {}
    if (v.name.trim().length < 2) n.name = 'Please enter your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) n.email = 'Please enter a valid email address.'
    if (v.message.trim().length < 10) n.message = 'Please write at least 10 characters.'
    setErr(n)
    if (Object.keys(n).length) return

    if (profile.email) {
      const subject = encodeURIComponent(`Portfolio Inquiry from ${v.name.trim()}`)
      const body = encodeURIComponent(
        `${v.message.trim()}\n\n---\nFrom: ${v.name.trim()}\nReply-To: ${v.email.trim()}`
      )
      window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
    }
    setSent(true)
  }

  const contactCards = [
    {
      title: 'Email',
      value: profile.email,
      href: profile.links.email,
      icon: Mail,
      action: 'email',
      badge: 'Direct Mail',
    },
    {
      title: 'LinkedIn',
      value: 'ravi-bhatt-14752037b',
      href: profile.links.linkedin,
      icon: Linkedin,
      badge: 'Professional',
    },
    {
      title: 'GitHub',
      value: 'ravibhatt2406',
      href: profile.links.github,
      icon: Github,
      badge: 'Code Repos',
    },
    {
      title: 'LeetCode',
      value: 'A8b7tkDX5C',
      href: profile.links.leetcode,
      icon: Leetcode,
      badge: 'Algorithms',
    },
  ]

  return (
    <div className="p-5 md:p-6 space-y-4">
      {/* Header */}
      <div>
        <H>Get in Touch</H>
        <p className="mt-1 text-xs text-white/60 leading-relaxed max-w-xl">
          Interested in collaborating on AI/ML solutions, web architecture, or research projects?
          Reach out directly via official channels or prepare an email inquiry below.
        </p>
      </div>

      {/* Official Direct Profiles 2x2 Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {contactCards.map((c) => {
          const Icon = c.icon
          return (
            <div
              key={c.title}
              className="group relative flex flex-col justify-between rounded-xl border border-white/10 bg-white/[0.03] p-3 transition-all duration-200 hover:border-cyan-400/40 hover:bg-white/[0.06] hover:shadow-[0_0_15px_rgba(34,211,238,0.1)]"
            >
              <div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-medium text-white">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-cyan-400/10 text-cyan-300 group-hover:bg-cyan-400/20 group-hover:text-cyan-200 transition-colors">
                      <Icon size={13} />
                    </div>
                    <span className="text-xs font-semibold">{c.title}</span>
                  </div>
                  <span className="text-[9px] font-mono uppercase tracking-wider text-white/40">
                    {c.badge}
                  </span>
                </div>
                <div className="mt-1.5 text-[11px] font-mono text-white/70 truncate">
                  {c.value}
                </div>
              </div>

              <div className="mt-2.5 flex items-center gap-1.5 pt-2 border-t border-white/5">
                <a
                  href={c.href}
                  target={c.href.startsWith('mailto:') ? '_self' : '_blank'}
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] py-1 px-2 text-[11px] font-medium text-white/80 transition-colors hover:border-cyan-400/40 hover:bg-white/10 hover:text-white"
                >
                  <span>Connect</span>
                  <ExternalLink size={10} className="opacity-70" />
                </a>

                {c.action === 'email' && (
                  <button
                    onClick={copyEmail}
                    type="button"
                    title="Copy email to clipboard"
                    className="flex items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] py-1 px-2 text-white/80 transition-colors hover:border-cyan-400/40 hover:bg-white/10 hover:text-white"
                  >
                    {copied ? (
                      <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                        <Check size={11} /> Copied
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] text-white/70">
                        <Copy size={11} /> Copy
                      </span>
                    )}
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Form / Prepared State */}
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
            Direct Message Form
          </h3>
          <button
            onClick={copyEmail}
            type="button"
            className="flex items-center gap-1 text-[10px] font-mono text-white/60 hover:text-cyan-300 transition-colors"
          >
            {copied ? (
              <>
                <Check size={11} className="text-emerald-400" />
                <span className="text-emerald-400">Copied to clipboard</span>
              </>
            ) : (
              <>
                <Copy size={11} />
                <span>Copy email: {profile.email}</span>
              </>
            )}
          </button>
        </div>

        {sent ? (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs leading-relaxed text-emerald-100">
            <div className="flex items-center gap-2 font-semibold text-emerald-300">
              <CheckCircle2 size={16} />
              <span>Message Draft Prepared</span>
            </div>
            <p className="mt-1.5 text-[11px] text-white/80">
              Your default email client has been opened with your inquiry addressed to{' '}
              <strong className="text-white font-mono">{profile.email}</strong>.
            </p>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => {
                  setSent(false)
                  setV({ name: '', email: '', message: '' })
                }}
                className="rounded-lg border border-white/20 bg-white/[0.06] px-3 py-1.5 text-xs font-medium text-white hover:bg-white/10"
              >
                Send Another Note
              </button>
              <button
                onClick={copyEmail}
                className="rounded-lg border border-emerald-500/30 bg-emerald-500/20 px-3 py-1.5 text-xs font-medium text-emerald-200 hover:bg-emerald-500/30"
              >
                {copied ? 'Copied!' : 'Copy Ravi\'s Email'}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-[11px] font-medium text-white/60">Your Name</label>
                <input
                  className={field}
                  placeholder="e.g. Alex Chen"
                  value={v.name}
                  onChange={on('name')}
                  aria-invalid={!!err.name}
                />
                {err.name && <p className="mt-0.5 text-[10px] text-rose-300">{err.name}</p>}
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-medium text-white/60">Email Address</label>
                <input
                  className={field}
                  placeholder="e.g. alex@example.com"
                  type="email"
                  value={v.email}
                  onChange={on('email')}
                  aria-invalid={!!err.email}
                />
                {err.email && <p className="mt-0.5 text-[10px] text-rose-300">{err.email}</p>}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-medium text-white/60">Message</label>
              <textarea
                className={field + ' min-h-[85px] resize-none'}
                placeholder="What project, idea, or opportunity would you like to collaborate on?"
                value={v.message}
                onChange={on('message')}
                aria-invalid={!!err.message}
              />
              {err.message && <p className="mt-0.5 text-[10px] text-rose-300">{err.message}</p>}
            </div>

            <div className="flex items-center justify-between pt-0.5">
              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2 text-xs font-semibold tracking-wider text-white shadow-[0_0_20px_rgba(139,92,246,0.5)] transition-all hover:from-violet-500 hover:to-indigo-500 hover:shadow-[0_0_25px_rgba(139,92,246,0.8)] active:scale-95"
              >
                <Send size={12} />
                <span>SEND MESSAGE</span>
              </button>
              <span className="text-[10px] text-white/40 hidden sm:inline">
                Opens prefilled draft to {profile.email}
              </span>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
