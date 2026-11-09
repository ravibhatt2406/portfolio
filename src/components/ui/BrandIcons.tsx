type P = { size?: number; className?: string }

export const Github = ({ size = 16, className = '' }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65S8.93 17.38 9 18v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
)

export const Linkedin = ({ size = 16, className = '' }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" />
  </svg>
)

export const Leetcode = ({ size = 16, className = '' }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
    <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 4.818 3.654 5.94 5.94 0 0 0 3.328-.718l2.91-2.128a1.378 1.378 0 0 0 .19-1.938 1.378 1.378 0 0 0-1.939-.19l-2.91 2.128a3.176 3.176 0 0 1-1.78.384 3.18 3.18 0 0 1-2.583-1.956 2.97 2.97 0 0 1-.186-.546 2.96 2.96 0 0 1-.033-1.264 2.818 2.818 0 0 1 .647-1.127l3.854-4.126 5.406-5.788A1.378 1.378 0 0 0 13.483 0zm4.512 8.423a1.378 1.378 0 0 0-.974.404L13.1 12.827a1.378 1.378 0 1 0 1.948 1.948l3.921-4.001a1.378 1.378 0 0 0-.974-2.351zm-7.685 4.303a1.378 1.378 0 0 0-1.378 1.378v.015a1.378 1.378 0 1 0 2.756 0v-.015a1.378 1.378 0 0 0-1.378-1.378z" />
  </svg>
)
