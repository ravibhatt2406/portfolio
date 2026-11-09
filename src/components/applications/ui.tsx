import type { ReactNode } from 'react'
export const H = ({ children }: { children: ReactNode }) => (
  <h2 className="font-display text-2xl font-semibold tracking-tight text-white">{children}</h2>
)
export const Row = ({ title, sub, meta }: { title: string; sub?: string; meta?: string }) => (
  <li className="flex items-baseline justify-between gap-4 border-b border-white/[0.07] py-3.5 last:border-0">
    <div>
      <p className="font-medium text-white">{title}</p>
      {sub && <p className="mt-0.5 text-sm text-white/55">{sub}</p>}
    </div>
    {meta && <span className="shrink-0 text-sm text-cyan-200/80">{meta}</span>}
  </li>
)
