import portrait from '../../assets/portrait/portrait.jpg'

/** Fallback when WebGL is unavailable: a blurred, violet-tinted portrait silhouette. */
export function StaticHologram() {
  return (
    <div className="fixed inset-0 z-0 flex items-center justify-center pointer-events-none" aria-hidden>
      <div
        className="h-[70vmin] w-[70vmin] rounded-full opacity-60"
        style={{
          backgroundImage: `url(${portrait})`, backgroundSize: 'cover',
          filter: 'blur(14px) saturate(0.2) brightness(1.1) hue-rotate(220deg) contrast(1.2)',
          mixBlendMode: 'screen',
          maskImage: 'radial-gradient(circle, #000 35%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(circle, #000 35%, transparent 70%)',
        }}
      />
    </div>
  )
}
