import portraitCleanUrl from '../../assets/portrait/portrait_clean.png'

export interface ParticleData {
  target: Float32Array // x,y,z per particle (assembled hologram)
  start: Float32Array  // x,y,z per particle (surrounding space)
  rand: Float32Array   // x: random phase, y: size, z: category/type, w: tone (luminance & contrast)
  protect: Float32Array // 0..1 facial anatomical preservation factor (1.0 = core facial features, 0 = periphery)
  count: number
}

const RES = 512
const cache = new Map<number, Promise<ParticleData>>()

function load(): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const img = new Image()
    img.onload = () => res(img)
    img.onerror = rej
    img.src = portraitCleanUrl
  })
}

/**
 * High-Fidelity Personal 3D Particle Hologram Reconstruction Sampler
 *
 * Primary Authoritative Source: Ravi's high-resolution reference portrait photograph
 * Pre-segmented into `portrait_clean.png` with 100% background and circular border removal.
 *
 * Feature Preservation Architecture:
 * 1. Zero Ring / Zero Background: Alpha channel strictly isolates Ravi's head, neck, and shoulders.
 * 2. Cumulative Distribution Function (CDF) Importance Sampling:
 *    - Particles strictly concentrate along anatomical feature contours:
 *      eyelids, pupils, iris, eyebrows, nose bridge, nostrils, lips, mustache, beard, and hair curls.
 *    - Smooth stipple coverage across cheeks, forehead, neck, and maroon shirt.
 * 3. Chromatic Classification & Contrast Delineation:
 *    - z=0.08: Dark facial hair, eyebrows, pupils, mustache, and beard (deep electric blue/indigo)
 *    - z=0.32: Thick swept-up hair coif (violet & blue with cyan texture accents)
 *    - z=0.58: Maroon shirt torso (cosmic amethyst & violet)
 *    - z=0.85: Facial skin highlights & eye catchlights (luminous cyan & cool white)
 * 4. Genuine 3D Anatomical Depth Mapping:
 *    - Ellipsoidal head dome curvature
 *    - Nose bridge & tip projection (+0.28)
 *    - Orbital eye socket recession (-0.12)
 *    - Mouth & lip projection (+0.08)
 *    - Chin projection (+0.12)
 *    - Neck recessed backward behind jawline (-0.22)
 *    - Volumetric hair shell (+0.12)
 *    - Shoulder contour slope (-0.16 to -0.30)
 */
export function buildParticles(count: number): Promise<ParticleData> {
  const hit = cache.get(count)
  if (hit) return hit

  const p = load().then((img) => {
    const cv = document.createElement('canvas')
    cv.width = cv.height = RES
    const ctx = cv.getContext('2d', { willReadFrequently: true })!
    ctx.drawImage(img, 0, 0, RES, RES)
    const px = ctx.getImageData(0, 0, RES, RES).data
    const N = RES * RES

    const rawLum = new Float32Array(N)
    const isSubject = new Uint8Array(N)
    const rArr = new Float32Array(N)
    const gArr = new Float32Array(N)
    const bArr = new Float32Array(N)

    for (let i = 0; i < N; i++) {
      const a = px[i * 4 + 3]
      if (a < 32) continue
      isSubject[i] = 1

      const r = px[i * 4] / 255
      const g = px[i * 4 + 1] / 255
      const b = px[i * 4 + 2] / 255
      rArr[i] = r
      gArr[i] = g
      bArr[i] = b
      rawLum[i] = 0.299 * r + 0.587 * g + 0.114 * b
    }

    // Sobel gradient magnitude for facial landmark contours (eyes, nose, lips, beard, jaw)
    // Exclude outer alpha cutout boundary to prevent artificial glowing silhouette lines
    const edges = new Float32Array(N)
    let maxEdge = 0.001
    for (let y = 1; y < RES - 1; y++) {
      for (let x = 1; x < RES - 1; x++) {
        const i = y * RES + x
        if (!isSubject[i]) continue

        const up = (y - 1) * RES + x
        const dn = (y + 1) * RES + x
        const lf = y * RES + (x - 1)
        const rt = y * RES + (x + 1)
        if (!isSubject[up] || !isSubject[dn] || !isSubject[lf] || !isSubject[rt]) {
          continue
        }

        const gx =
          -rawLum[(y - 1) * RES + (x - 1)] - 2 * rawLum[y * RES + (x - 1)] - rawLum[(y + 1) * RES + (x - 1)]
          + rawLum[(y - 1) * RES + (x + 1)] + 2 * rawLum[y * RES + (x + 1)] + rawLum[(y + 1) * RES + (x + 1)]
        const gy =
          -rawLum[(y - 1) * RES + (x - 1)] - 2 * rawLum[(y - 1) * RES + x] - rawLum[(y - 1) * RES + (x + 1)]
          + rawLum[(y + 1) * RES + (x - 1)] + 2 * rawLum[(y + 1) * RES + x] + rawLum[(y + 1) * RES + (x + 1)]
        const mag = Math.sqrt(gx * gx + gy * gy)
        edges[i] = mag
        if (mag > maxEdge) maxEdge = mag
      }
    }
    // Normalize edge magnitude
    for (let i = 0; i < N; i++) edges[i] /= maxEdge

    // Build importance sampling weights & CDF table
    // Exact landmark locations in normalized [0, 1] space:
    // Left eye: (0.425, 0.382), Right eye: (0.573, 0.378)
    // Nose bridge: (0.505, 0.440), Mouth: (0.508, 0.530)
    const weights = new Float64Array(N)
    let totalWeight = 0

    for (let y = 0; y < RES; y++) {
      const v = y / RES
      for (let x = 0; x < RES; x++) {
        const i = y * RES + x
        if (!isSubject[i]) continue

        const u = x / RES
        const lum = rawLum[i]
        const ed = edges[i]
        const r = rArr[i]
        const g = gArr[i]
        const b = bArr[i]

        // Eye zone falloffs
        const dEyeL = Math.hypot((u - 0.425) * 1.3, v - 0.382)
        const dEyeR = Math.hypot((u - 0.573) * 1.3, v - 0.378)
        const inEye = dEyeL < 0.052 || dEyeR < 0.052

        // Eyebrows
        const dBrowL = Math.hypot((u - 0.425) * 1.1, (v - 0.350) * 1.8)
        const dBrowR = Math.hypot((u - 0.573) * 1.1, (v - 0.346) * 1.8)
        const inBrow = dBrowL < 0.055 || dBrowR < 0.055

        // Mouth & mustache
        const dMouth = Math.hypot((u - 0.508) * 1.2, (v - 0.535) * 1.6)
        const inMouth = dMouth < 0.060

        // Nose bridge & tip
        const dNose = Math.hypot((u - 0.505) * 2.0, (v - 0.440) * 1.1)
        const inNose = dNose < 0.065

        // Facial hair / brows / beard / mustache (dark facial features)
        const isFaceZone = u > 0.26 && u < 0.74 && v >= 0.20 && v <= 0.72
        const isFacialHair = isFaceZone && lum < 0.28
        // Hair coif
        const isHair = v < 0.36 && lum < 0.28 && (!isFaceZone || v < 0.25)
        // Maroon shirt
        const isShirt = v > 0.74 && r > 0.22 && r > b * 1.3 && g < 0.24

        // Solid base coverage (1.0) ensures the entire face, forehead, cheeks, nose, and body are filled
        let w = 1.0
        // Feature enhancements on actual contours
        w += ed * 1.5
        if (inEye) w += 1.0
        if (inBrow) w += 0.8
        if (inMouth) w += 0.8
        if (inNose) w += 0.6
        if (isHair) w += 0.4
        if (isShirt) w += 0.2

        weights[i] = w
        totalWeight += w
      }
    }

    // Cumulative distribution table
    const cdf = new Float64Array(N)
    let acc = 0
    for (let i = 0; i < N; i++) {
      acc += weights[i]
      cdf[i] = acc
    }

    // Binary search helper on CDF
    function sampleIndex(targetWeight: number): number {
      let low = 0, high = N - 1
      while (low < high) {
        const mid = (low + high) >> 1
        if (cdf[mid] < targetWeight) low = mid + 1
        else high = mid
      }
      return low
    }

    // Allocate particle buffers
    const target = new Float32Array(count * 3)
    const start = new Float32Array(count * 3)
    const rand = new Float32Array(count * 4)
    const protect = new Float32Array(count)

    const S = 2.40 // Aspect-ratio preserving world scale

    for (let n = 0; n < count; n++) {
      const pick = Math.random() * totalWeight
      const idx = sampleIndex(pick)

      const iy = Math.floor(idx / RES)
      const ix = idx % RES

      // Precise sub-pixel stipple: tightly bound so contour lines remain razor-sharp
      const u = (ix + (Math.random() - 0.5) * 0.55) / RES
      const v = (iy + (Math.random() - 0.5) * 0.55) / RES

      const lum = rawLum[idx]
      const ed = edges[idx]
      const r = rArr[idx]
      const g = gArr[idx]
      const b = bArr[idx]

      // 1. World XY coordinates (centered and framed)
      const tx = (u - 0.505) * S
      const ty = (0.50 - v) * S + 0.08

      // 2. Anatomical 3D Depth (tz)
      // Ellipsoidal head dome
      const dxHead = (u - 0.505) / 0.20
      const rDome = Math.max(0, 1.0 - dxHead * dxHead)
      let tz = Math.sqrt(rDome) * 0.28 - 0.14

      // Nose bridge and tip projection (Ravi's straight nose)
      const ndx = Math.abs(u - 0.505)
      if (ndx < 0.052 && v > 0.365 && v < 0.495) {
        const noseVal = (1.0 - ndx / 0.052) * (1.0 - Math.abs(v - 0.445) / 0.08)
        tz += Math.max(0, noseVal) * 0.22
      }

      // Orbital eye socket recession
      const el = Math.hypot((u - 0.425) * 1.3, v - 0.382)
      const er = Math.hypot((u - 0.573) * 1.3, v - 0.378)
      if (el < 0.052) tz -= (1.0 - el / 0.052) * 0.08
      if (er < 0.052) tz -= (1.0 - er / 0.052) * 0.08

      // Forehead curvature
      if (v > 0.23 && v < 0.33 && Math.abs(u - 0.505) < 0.14) {
        tz += 0.05 * (1.0 - Math.pow((u - 0.505) / 0.14, 2))
      }

      // Lips
      const dLip = Math.hypot((u - 0.508) * 1.4, v - 0.530)
      if (dLip < 0.048) tz += (1.0 - dLip / 0.048) * 0.06

      // Chin projection
      const dChin = Math.hypot((u - 0.505) * 1.3, v - 0.615)
      if (dChin < 0.048) tz += (1.0 - dChin / 0.048) * 0.08

      // Neck recessed backward behind jawline (natural human curve)
      if (v > 0.65 && v < 0.77 && Math.abs(u - 0.505) < 0.16) {
        const neckFactor = Math.sin(((v - 0.65) / 0.12) * Math.PI)
        tz -= neckFactor * 0.10
      }

      // Hair volumetric 3D lift (Ravi's swept-up hairstyle)
      if (v < 0.32) {
        tz += (1.0 - v / 0.32) * 0.06 + Math.sin(tx * 14.0 + ty * 12.0) * 0.010
      }

      // Torso & shoulders slope
      if (v >= 0.77) {
        tz = -0.14 - ((v - 0.77) / 0.23) * 0.10
      }

      target[n * 3] = tx
      target[n * 3 + 1] = ty
      target[n * 3 + 2] = tz

      // Ambient start space points (for intro assembly)
      const th = Math.random() * Math.PI * 2
      const ph = Math.acos(2 * Math.random() - 1)
      const rad = 2.8 + Math.random() * 4.2
      start[n * 3] = rad * Math.sin(ph) * Math.cos(th)
      start[n * 3 + 1] = rad * Math.sin(ph) * Math.sin(th) * 0.75
      start[n * 3 + 2] = rad * Math.cos(ph) - 0.8

      // Chromatic category (aRand.z) & Tone (aRand.w)
      // Category codes:
      // 0.08 = Facial hair / pupils / brows / beard / mustache (dark identity contours)
      // 0.32 = Hair coif & waves
      // 0.58 = Maroon shirt
      // 0.85 = Facial skin & eye catchlights
      let category = 0.85
      let tone = 0.50

      const isFaceZone = u > 0.26 && u < 0.74 && v >= 0.20 && v <= 0.72
      const inEye = el < 0.052 || er < 0.052
      const isHair = v < 0.36 && lum < 0.28 && (!isFaceZone || v < 0.25)
      const isShirt = v > 0.74 && r > 0.22 && r > b * 1.3 && g < 0.24
      const isFacialHair = isFaceZone && lum < 0.28

      if (isShirt) {
        category = 0.58
        tone = 0.45 + ed * 0.30
      } else if (isHair) {
        category = 0.32
        tone = 0.32 + ed * 0.50
      } else if (inEye) {
        if (lum < 0.22) {
          // Pupil & iris center: crisp dark feature
          category = 0.08
          tone = 0.18 + lum * 0.30
        } else if (lum > 0.42) {
          // Sclera / eye catchlight: brilliant white
          category = 0.85
          tone = 0.96
        } else {
          // Iris ring
          category = 0.85
          tone = 0.65
        }
      } else if (isFacialHair) {
        // Mustache, beard, eyebrows
        category = 0.08
        tone = 0.22 + lum * 0.35
      } else {
        // Facial skin & highlights
        category = 0.85
        const ndx = Math.abs(u - 0.505)
        const isRidge = ndx < 0.045 && v > 0.36 && v < 0.49
        if (isRidge || lum > 0.58) {
          tone = 0.82 + ed * 0.18
        } else if (lum > 0.38) {
          tone = 0.55 + (lum - 0.38) * 0.85
        } else {
          tone = 0.40 + lum * 0.40
        }
      }

      rand[n * 4] = Math.random() // phase for assembly / shimmer
      // Uniform fine point sizing: completely eliminates random speckled noise!
      rand[n * 4 + 1] = isFacialHair || inEye ? 0.78 : 0.82
      rand[n * 4 + 2] = category
      rand[n * 4 + 3] = Math.min(1.0, Math.max(0.15, tone))

      // Anatomical feature protection factor for Dual Particle System (Phase 21)
      // 1.0 = Strict facial landmark preservation (eyes, nose, mouth, beard, chin, jawline)
      // 0.85 = Neck support
      // 0.0 - 0.5 = Outer hair crest & outer shoulder edges (can carry subtle organic energy waves & soft cursor deflection)
      let prot = 0.0
      const dFaceOval = Math.pow((u - 0.505) / 0.165, 2) + Math.pow((v - 0.44) / 0.22, 2)
      if (inEye || isFacialHair || dFaceOval < 1.0) {
        // Core facial identity: eyes, brows, nose, lips, beard, jawline, chin, cheeks
        prot = 1.0
      } else if (v >= 0.65 && v <= 0.78 && Math.abs(u - 0.505) < 0.16) {
        // Neck column
        prot = 0.85
      } else if (v > 0.78) {
        // Torso / shoulders: fade to 0 towards outer edges
        prot = Math.max(0.0, 0.60 - Math.abs(u - 0.505) * 1.5)
      } else if (v < 0.36) {
        // Hair: inner hair preserved, outer crest and wisps have subtle movement
        prot = Math.max(0.0, 0.80 - (0.34 - v) * 3.5 - Math.abs(u - 0.505) * 2.2)
      }
      protect[n] = Math.min(1.0, Math.max(0.0, prot))
    }

    return { target, start, rand, protect, count }
  })

  cache.set(count, p)
  return p
}

export function particleCount(density: 'low' | 'medium' | 'high', mini = false): number {
  if (mini) return 8000
  const base = { low: 30000, medium: 45000, high: 60000 }[density]
  const w = typeof window !== 'undefined' ? window.innerWidth : 1280
  const cores = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 8 : 8
  let k = w < 768 ? 0.55 : w < 1100 ? 0.80 : 1
  if (cores < 4) k *= 0.70
  return Math.round(base * k)
}
