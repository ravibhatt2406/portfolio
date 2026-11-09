import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useDesktop } from '../../store/desktopStore'

type TypographyStage = 'opening' | 'ravi' | 'portfolio' | 'landing'

export function IntroOverlay() {
  const setPhase = useDesktop((s) => s.setPhase)
  const reduced = useDesktop((s) => s.reducedMotion)

  const [stage, setStage] = useState<TypographyStage>(reduced ? 'landing' : 'opening')
  const timersRef = useRef<number[]>([])

  useEffect(() => {
    if (reduced) return

    // Clean up any prior timers
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []

    // Phase 11 Timing Timeline (Total ~7.4s):
    // 1. Opening central glow & progressive letter reveal of RAVI: 0.0s - 2.0s
    // 2. RAVI reveal & hold: 2.0s - 4.2s (2.2s hold)
    // 3. RAVI to PORTFOLIO transition & hold: 4.2s - 7.4s (3.2s transition + hold)
    // 4. Smooth transition to existing RAVI.OS landing page: 7.4s onwards
    const t1 = setTimeout(() => setStage('ravi'), 2000)
    const t2 = setTimeout(() => setStage('portfolio'), 4200)
    const t3 = setTimeout(() => setStage('landing'), 7400)

    timersRef.current = [t1, t2, t3]

    return () => {
      timersRef.current.forEach(clearTimeout)
      timersRef.current = []
    }
  }, [reduced])

  // Skip handling:
  // If in typography sequence, skips immediately to the landing page.
  // If already on landing page, enters desktop immediately.
  const handleSkip = () => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
    if (stage !== 'landing') {
      setStage('landing')
    } else {
      enter(true)
    }
  }

  const enter = (fast = false) => {
    setPhase('entering')
    setTimeout(() => setPhase('desktop'), fast || reduced ? 300 : 900)
  }

  // Letters for progressive kinetic reveal
  const raviLetters = ['R', 'A', 'V', 'I']
  const portfolioLetters = ['P', 'O', 'R', 'T', 'F', 'O', 'L', 'I', 'O']

  return (
    <motion.div
      className="fixed inset-0 z-10 select-none touch-none pointer-events-none"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.65 } }}
    >
      {/* Skip button in top-right */}
      <button
        onClick={handleSkip}
        className="pointer-events-auto absolute right-5 top-5 rounded-full border border-white/15 bg-white/[0.03] px-4 py-1.5 text-xs font-medium text-white/65 backdrop-blur-md transition hover:border-white/40 hover:bg-white/[0.08] hover:text-white z-20"
        aria-label="Skip introduction"
      >
        Skip intro
      </button>

      {/* ----------------------------------------------------------- */}
      {/* 1. Opening Visual Effect & Progressive Typography Sequence */}
      {/* ----------------------------------------------------------- */}
      <div className="absolute inset-0 flex items-center justify-center px-6 pointer-events-none overflow-hidden">
        <AnimatePresence mode="wait">
          {/* STAGE 1 & 2: Opening Central Glow + RAVI Progressive Reveal */}
          {(stage === 'opening' || stage === 'ravi') && (
            <motion.div
              key="intro-ravi-group"
              className="relative flex flex-col items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{
                opacity: 0,
                scale: 1.08,
                filter: 'blur(20px)',
                transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
              }}
            >
              {/* Central Glowing Light Reveal Effect */}
              <motion.div
                initial={{ opacity: 0, scale: 0.2 }}
                animate={{
                  opacity: [0, 0.85, 0.55],
                  scale: [0.2, 1.35, 1.05],
                }}
                transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
                className="absolute -inset-24 rounded-full bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.32)_0%,rgba(139,92,246,0.18)_42%,transparent_72%)] blur-3xl pointer-events-none"
              />

              {/* Horizontal Aperture Light Slit */}
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{
                  scaleX: [0, 1.4, 0.7, 0],
                  opacity: [0, 0.95, 0.6, 0],
                }}
                transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                className="absolute h-[2px] w-[560px] max-w-[85vw] bg-gradient-to-r from-transparent via-cyan-200 to-transparent blur-[1px] shadow-[0_0_25px_#38bdf8] pointer-events-none"
              />

              {/* Progressive Letter Reveal of "R A V I" */}
              <div className="relative flex items-center justify-center gap-[0.05em] font-display text-[clamp(4.2rem,14.5vw,11rem)] font-extrabold tracking-tight text-white drop-shadow-[0_10px_50px_rgba(0,0,0,0.95)]">
                {raviLetters.map((char, i) => (
                  <motion.span
                    key={`ravi-${i}`}
                    custom={i}
                    initial={{
                      opacity: 0,
                      y: 35,
                      scale: 0.86,
                      filter: 'blur(22px)',
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      filter: 'blur(0px)',
                    }}
                    transition={{
                      duration: 0.95,
                      delay: 0.35 + i * 0.18,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="inline-block"
                  >
                    {char}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}

          {/* STAGE 3: Smooth Transition into PORTFOLIO */}
          {stage === 'portfolio' && (
            <motion.div
              key="intro-portfolio-group"
              className="relative flex flex-col items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{
                opacity: 0,
                y: -24,
                scale: 1.04,
                filter: 'blur(20px)',
                transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
              }}
            >
              {/* Soft Ambient Core Behind PORTFOLIO */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.5, scale: 1.1 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="absolute -inset-20 rounded-full bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.22)_0%,rgba(139,92,246,0.12)_45%,transparent_70%)] blur-3xl pointer-events-none"
              />

              {/* Kinetic Reveal of PORTFOLIO Letters */}
              <div className="relative flex items-center justify-center font-display text-[clamp(2.4rem,8.4vw,7.6rem)] font-extrabold tracking-tight text-white drop-shadow-[0_10px_50px_rgba(0,0,0,0.95)]">
                {portfolioLetters.map((char, i) => (
                  <motion.span
                    key={`portfolio-${i}`}
                    custom={i}
                    initial={{
                      opacity: 0,
                      scale: 0.88,
                      y: 20,
                      filter: 'blur(18px)',
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      y: 0,
                      filter: 'blur(0px)',
                    }}
                    transition={{
                      duration: 0.85,
                      delay: i * 0.055,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="inline-block"
                  >
                    {char}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ----------------------------------------------------------- */}
      {/* 2. Existing RAVI.OS Landing Page Composition                */}
      {/* Preserved exactly: Hologram, Subtitle, ENTER action, Layout */}
      {/* ----------------------------------------------------------- */}
      <AnimatePresence>
        {stage === 'landing' && (
          <motion.div
            key="landing-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.85, ease: 'easeOut' }}
            className="absolute inset-0 flex flex-col items-center justify-end pb-[9vh] text-center bg-gradient-to-t from-[#04030a]/85 via-[#04030a]/35 to-transparent pointer-events-none"
          >
            <div className="pointer-events-auto max-w-3xl px-6">
              <motion.h1
                className="font-display text-[clamp(2.2rem,6.5vw,5.2rem)] font-extrabold leading-none tracking-tight text-white drop-shadow-[0_4px_35px_rgba(0,0,0,0.9)]"
                initial={{ opacity: 0, filter: 'blur(16px)', y: 16 }}
                animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              >
                HELLO, I’M RAVI.
              </motion.h1>

              <motion.p
                className="mt-3.5 text-[clamp(.75rem,1.4vw,1rem)] font-light tracking-[0.38em] text-cyan-200/90 drop-shadow-[0_2px_20px_rgba(0,0,0,0.9)]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.15 }}
              >
                AI &amp; ML DEVELOPER
              </motion.p>

              <motion.div
                className="mt-8 flex justify-center"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                <button
                  onClick={() => enter()}
                  className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full border border-violet-400/40 bg-gradient-to-r from-violet-600/35 via-indigo-600/35 to-violet-600/35 px-8 py-3.5 text-xs font-bold tracking-[0.25em] text-white shadow-[0_0_35px_-5px_rgba(139,92,246,0.7)] backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-violet-300/80 hover:bg-violet-600/50 hover:shadow-[0_0_55px_-3px_rgba(139,92,246,0.95)] active:scale-95"
                  aria-label="Enter RAVI.OS"
                >
                  <span>ENTER RAVI.OS</span>
                  <ArrowRight size={14} className="text-cyan-300 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
