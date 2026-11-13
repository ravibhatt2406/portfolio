import portraitCleanUrl from '../../assets/portrait/portrait_clean.png'

export interface ParticleData {
  target: Float32Array  // x,y,z per particle (assembled hologram)
  start: Float32Array   // x,y,z per particle (ambient dispersed space)
  rand: Float32Array    // x: random phase, y: size, z: category/type, w: tone (luminance & contrast)
  normal: Float32Array  // nx, ny, nz for volumetric view-angle occlusion & lighting
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
 * High-Fidelity Continuous Volumetric 3D Particle Hologram
 *
 * Source of Truth: Ravi Bhatt's authoritative reference photograph (`portrait_clean.png`).
 *
 * Mathematically Closed Cranial Volume:
 * - Center: (xc = 0, yc = 0.35, zc = -0.16)
 * - Radii: Rx = 0.46, Ry = 0.65, Rzf = 0.38 (front), Rzb = 0.40 (back)
 * - Seamless 360° curvature: zero gaps, zero flat planes, zero artificial boundary spikes.
 * - 5 Required Verification Angles:
 *   1. 0° Front View
 *   2. 25° Quarter View
 *   3. 55° Three-Quarter View
 *   4. 90° Side View (full anatomical side profile: straight nasal bridge, lips, chin, deep skull)
 *   5. 180° Back View (dense, solid dark hair curls covering the posterior skull dome, nape, and back)
 */
export function buildParticles(totalCount: number): Promise<ParticleData> {
  const hit = cache.get(totalCount)
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

    // Sobel gradient magnitude for facial landmark contours
    const edges = new Float32Array(N)
    let maxEdge = 0.001
    for (let y = 1; y < RES - 1; y++) {
      for (let x = 1; x < RES - 1; x++) {
        const i = y * RES + x
        if (!isSubject[i]) continue
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
    for (let i = 0; i < N; i++) edges[i] /= maxEdge

    // Importance sampling weights for the front photo face
    const weights = new Float64Array(N)
    let totalWeight = 0

    for (let y = 0; y < RES; y++) {
      const v = y / RES
      for (let x = 0; x < RES; x++) {
        const i = y * RES + x
        if (!isSubject[i]) continue

        const u = x / RES
        const ed = edges[i]
        const lum = rawLum[i]

        // Eye zone falloffs
        const dEyeL = Math.hypot((u - 0.425) * 1.3, v - 0.382)
        const dEyeR = Math.hypot((u - 0.573) * 1.3, v - 0.378)
        const inEye = dEyeL < 0.052 || dEyeR < 0.052

        // Eyebrows
        const dBrowL = Math.hypot((u - 0.425) * 1.1, (v - 0.350) * 1.8)
        const dBrowR = Math.hypot((u - 0.573) * 1.1, (v - 0.346) * 1.8)
        const inBrow = dBrowL < 0.055 || dBrowR < 0.055

        // Mouth & moustache
        const dMouth = Math.hypot((u - 0.508) * 1.2, (v - 0.535) * 1.6)
        const inMouth = dMouth < 0.060

        // Nose bridge & tip
        const dNose = Math.hypot((u - 0.505) * 2.0, (v - 0.440) * 1.1)
        const inNose = dNose < 0.065

        // Facial hair / beard
        const isFaceZone = u > 0.26 && u < 0.74 && v >= 0.20 && v <= 0.72
        const isFacialHair = isFaceZone && lum < 0.28
        const isHair = v < 0.36 && lum < 0.28 && (!isFaceZone || v < 0.25)
        const isShirt = v > 0.74 && rArr[i] > 0.22 && rArr[i] > bArr[i] * 1.3 && gArr[i] < 0.24

        let w = 1.0
        w += ed * 1.8
        if (inEye) w += 1.6
        if (inBrow) w += 1.2
        if (inMouth) w += 1.2
        if (inNose) w += 1.0
        if (isFacialHair) w += 1.0
        if (isHair) w += 0.5
        if (isShirt) w += 0.2

        weights[i] = w
        totalWeight += w
      }
    }

    const cdf = new Float64Array(N)
    let acc = 0
    for (let i = 0; i < N; i++) {
      acc += weights[i]
      cdf[i] = acc
    }

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
    const target = new Float32Array(totalCount * 3)
    const start = new Float32Array(totalCount * 3)
    const rand = new Float32Array(totalCount * 4)
    const normal = new Float32Array(totalCount * 3)

    const S = 2.40 // World scale

    // Anatomical cranial ellipsoid parameters
    const zc = -0.16
    const yc = 0.35
    const Rx = 0.46
    const Ry = 0.72 // Extends to y = 1.07 to encompass full swept hair coif
    const Rzf = 0.38
    const Rzb = 0.40

    // Balanced distribution quotas:
    // 1. Front Facial Mask & Photo Landmarks: 48%
    // 2. Volumetric Interior Stipple (Solid Head Fill): 16%
    // 3. Volumetric Posterior Cranium & Back of Head (180°): 26%
    // 4. Posterior Neck & Upper Back Shoulders: 10%
    const countFace = Math.floor(totalCount * 0.48)
    const countVolume = Math.floor(totalCount * 0.16)
    const countBack = Math.floor(totalCount * 0.26)

    let pIdx = 0

    function setStartPoint(idx: number) {
      const th = Math.random() * Math.PI * 2
      const ph = Math.acos(2 * Math.random() - 1)
      const rad = 2.8 + Math.random() * 4.2
      start[idx * 3] = rad * Math.sin(ph) * Math.cos(th)
      start[idx * 3 + 1] = rad * Math.sin(ph) * Math.sin(th) * 0.75
      start[idx * 3 + 2] = rad * Math.cos(ph) - 0.8
    }

    function setNormal(idx: number, nx: number, ny: number, nz: number) {
      const len = Math.hypot(nx, ny, nz) || 1
      normal[idx * 3] = nx / len
      normal[idx * 3 + 1] = ny / len
      normal[idx * 3 + 2] = nz / len
    }

    // ==========================================
    // 1. FRONT FACIAL MASK (Source of Truth Photo)
    // ==========================================
    for (let n = 0; n < countFace; n++) {
      const pick = Math.random() * totalWeight
      const idx = sampleIndex(pick)
      const iy = Math.floor(idx / RES)
      const ix = idx % RES

      const u = (ix + (Math.random() - 0.5) * 0.85) / RES
      const v = (iy + (Math.random() - 0.5) * 0.85) / RES

      const lum = rawLum[idx]
      const ed = edges[idx]
      const r = rArr[idx]
      const g = gArr[idx]
      const b = bArr[idx]

      const tx = (u - 0.5) * S
      const ty = (0.5 - v) * S + 0.08

      // Ellipsoidal base depth: for any (tx, ty), calculate available frontal dome
      const dy = (ty - yc) / Ry
      const dx = tx / Rx
      const rxy2 = dx * dx + dy * dy
      const deltaZ = rxy2 < 1.0 ? Math.sqrt(1.0 - rxy2) : 0.0

      // Base frontal depth curves smoothly from zc at silhouette forward to zc + Rzf at center
      let tz = zc + Rzf * deltaZ

      // Facial feature refinements
      const ndx = Math.abs(u - 0.505)
      let isNoseTip = false
      // Nose bridge and tip projection
      if (ndx < 0.052 && v > 0.360 && v < 0.495) {
        const bridgeT = 1.0 - ndx / 0.052
        const profileT = 1.0 - Math.abs(v - 0.445) / 0.085
        tz += Math.max(0, bridgeT * profileT) * 0.16
        if (ndx < 0.020 && Math.abs(v - 0.445) < 0.025) isNoseTip = true
      }
      // Nostril flare
      if (ndx >= 0.025 && ndx <= 0.055 && v >= 0.450 && v <= 0.480) {
        tz += 0.05 * (1.0 - Math.abs(ndx - 0.040) / 0.015)
      }

      // Orbital eye sockets
      const el = Math.hypot((u - 0.425) * 1.3, v - 0.382)
      const er = Math.hypot((u - 0.573) * 1.3, v - 0.378)
      if (el < 0.052) {
        tz -= (1.0 - el / 0.052) * 0.08
        if (el < 0.022) tz += 0.025
      }
      if (er < 0.052) {
        tz -= (1.0 - er / 0.052) * 0.08
        if (er < 0.022) tz += 0.025
      }

      // Brow ridge
      const bl = Math.hypot((u - 0.425) * 1.1, (v - 0.350) * 1.8)
      const br = Math.hypot((u - 0.573) * 1.1, (v - 0.346) * 1.8)
      if (bl < 0.050 || br < 0.050) tz += 0.04

      // Forehead curvature
      if (v > 0.23 && v < 0.34 && Math.abs(u - 0.505) < 0.15) {
        tz += 0.05 * (1.0 - Math.pow((u - 0.505) / 0.15, 2))
      }

      // Lips
      const dLip = Math.hypot((u - 0.508) * 1.4, v - 0.530)
      if (dLip < 0.050) tz += (1.0 - dLip / 0.050) * 0.08

      // Chin projection & beard fullness
      const dChin = Math.hypot((u - 0.505) * 1.3, v - 0.615)
      if (dChin < 0.055) tz += (1.0 - dChin / 0.055) * 0.10

      // Neck recessed behind jawline
      if (v > 0.65 && v < 0.77) {
        const neckFactor = Math.sin(((v - 0.65) / 0.12) * Math.PI)
        tz -= neckFactor * 0.12
      }

      // Torso / shirt drape
      if (v >= 0.77) {
        tz = -0.16 - ((v - 0.77) / 0.23) * 0.10
      }

      target[pIdx * 3] = tx
      target[pIdx * 3 + 1] = ty
      target[pIdx * 3 + 2] = tz

      setStartPoint(pIdx)
      setNormal(pIdx, dx * 0.45, dy * 0.35, Math.max(0.2, deltaZ))

      // Chromatic category & tone
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
          category = 0.08
          tone = 0.18 + lum * 0.30
        } else if (lum > 0.42) {
          category = 0.95
          tone = 0.98
        } else {
          category = 0.85
          tone = 0.65
        }
      } else if (isFacialHair) {
        category = 0.08
        tone = 0.20 + lum * 0.35
      } else {
        category = 0.85
        const isRidge = ndx < 0.045 && v > 0.36 && v < 0.49
        if (isNoseTip || isRidge || lum > 0.58) {
          tone = 0.88 + ed * 0.12
          if (isNoseTip) category = 0.95
        } else if (lum > 0.38) {
          tone = 0.55 + (lum - 0.38) * 0.85
        } else {
          tone = 0.40 + lum * 0.40
        }
      }

      rand[pIdx * 4] = Math.random()
      rand[pIdx * 4 + 1] = 0.75 + Math.random() * 0.50
      rand[pIdx * 4 + 2] = category
      rand[pIdx * 4 + 3] = Math.min(1.0, Math.max(0.15, tone))
      pIdx++
    }

    // ==========================================
    // 2. VOLUMETRIC INTERIOR CRANIAL STIPPLE (Solid 3D Fill)
    // ==========================================
    for (let n = 0; n < countVolume; n++) {
      const y = -0.15 + Math.random() * 1.05
      const dy = (y - yc) / Ry
      const rem = Math.max(0, 1.0 - dy * dy)
      const w = Rx * Math.sqrt(rem)
      const maxDzF = Rzf * Math.sqrt(rem)
      const maxDzB = Rzb * Math.sqrt(rem)

      const r = Math.sqrt(Math.random())
      const th = Math.random() * Math.PI * 2

      const vx = w * r * Math.sin(th)
      const vz = zc + (r * Math.cos(th)) * (Math.cos(th) > 0 ? maxDzF : maxDzB)

      target[pIdx * 3] = vx
      target[pIdx * 3 + 1] = y
      target[pIdx * 3 + 2] = vz

      setStartPoint(pIdx)
      setNormal(pIdx, Math.sin(th) * 0.6, dy * 0.2, Math.cos(th) * 0.6)

      const isTopHair = y > 0.52
      rand[pIdx * 4] = Math.random()
      rand[pIdx * 4 + 1] = 0.65 + Math.random() * 0.35
      rand[pIdx * 4 + 2] = isTopHair ? 0.32 : 0.85
      rand[pIdx * 4 + 3] = 0.30 + Math.random() * 0.30
      pIdx++
    }

    // ==========================================
    // 3. POSTERIOR CRANIUM & BACK OF HEAD (180° View)
    // ==========================================
    for (let n = 0; n < countBack; n++) {
      const y = -0.12 + Math.random() * 1.06
      const dy = (y - yc) / Ry
      const rem = Math.max(0, 1.0 - dy * dy)
      const w = Rx * Math.sqrt(rem)
      const maxDzB = Rzb * Math.sqrt(rem)

      // Symmetrical posterior arc: th in [0, PI]
      const th = Math.random() * Math.PI
      const cx = w * Math.cos(th)
      let cz = zc - maxDzB * Math.sin(th)

      // Natural wavy hair texture
      const wave = Math.sin(cx * 15.0 + y * 13.0) * 0.015 + Math.cos(cz * 14.0) * 0.010
      cz += wave

      target[pIdx * 3] = cx
      target[pIdx * 3 + 1] = y
      target[pIdx * 3 + 2] = cz

      setStartPoint(pIdx)
      // Normal points backward (-Z) and symmetrically outward
      setNormal(pIdx, Math.cos(th) * 0.6, dy * 0.3, -Math.sin(th) * 0.85)

      rand[pIdx * 4] = Math.random()
      rand[pIdx * 4 + 1] = 0.85 + Math.random() * 0.45
      rand[pIdx * 4 + 2] = y < 0.04 ? 0.85 : 0.32
      rand[pIdx * 4 + 3] = y < 0.04 ? 0.45 : (0.26 + Math.random() * 0.38)
      pIdx++
    }

    // ==========================================
    // 4. POSTERIOR NECK & UPPER BACK SHOULDERS
    // ==========================================
    while (pIdx < totalCount) {
      const isNeck = Math.random() < 0.45
      if (isNeck) {
        // Natural flaring posterior & lateral neck connecting jaw corners to trapezius
        const th = Math.random() * Math.PI
        const nyFrac = Math.random() // 0 (collar) to 1 (jaw)
        const ny = -0.54 + nyFrac * 0.32
        // Flare radius: wider at collar, tapering smoothly to jaw
        const rx = 0.22 + (1.0 - nyFrac) * 0.07
        const rz = 0.17 + (1.0 - nyFrac) * 0.06
        // Soft organic stipple
        const stipple = 0.85 + Math.random() * 0.15
        const nx = rx * stipple * Math.cos(th)
        const nz = zc - rz * stipple * Math.sin(th)

        target[pIdx * 3] = nx
        target[pIdx * 3 + 1] = ny
        target[pIdx * 3 + 2] = nz

        setStartPoint(pIdx)
        setNormal(pIdx, Math.cos(th) * 0.5, 0.1, -Math.sin(th) * 0.85)

        rand[pIdx * 4] = Math.random()
        rand[pIdx * 4 + 1] = 0.75 + Math.random() * 0.40
        rand[pIdx * 4 + 2] = 0.85 // Skin
        rand[pIdx * 4 + 3] = 0.38 + Math.random() * 0.20
      } else {
        // Back shoulders & shirt collar
        const side = Math.random() < 0.5 ? -1 : 1
        const spread = Math.random()
        const bx = side * (0.22 + spread * 0.60)
        const by = -0.48 - spread * 0.38 + (Math.random() - 0.5) * 0.04
        const bz = -0.22 - Math.random() * 0.18

        target[pIdx * 3] = bx
        target[pIdx * 3 + 1] = by
        target[pIdx * 3 + 2] = bz

        setStartPoint(pIdx)
        setNormal(pIdx, side * 0.3, -0.2, -0.90)

        rand[pIdx * 4] = Math.random()
        rand[pIdx * 4 + 1] = 0.85 + Math.random() * 0.45
        rand[pIdx * 4 + 2] = 0.58 // Shirt
        rand[pIdx * 4 + 3] = 0.42 + Math.random() * 0.30
      }
      pIdx++
    }

    return { target, start, rand, normal, count: totalCount }
  })

  cache.set(totalCount, p)
  return p
}

export function particleCount(density: 'low' | 'medium' | 'high', mini = false): number {
  if (mini) return 10000
  const base = { low: 36000, medium: 56000, high: 80000 }[density]
  const w = typeof window !== 'undefined' ? window.innerWidth : 1280
  const cores = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 8 : 8
  let k = w < 768 ? 0.60 : w < 1100 ? 0.82 : 1
  if (cores < 4) k *= 0.70
  return Math.round(base * k)
}
