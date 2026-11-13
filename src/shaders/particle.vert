uniform float uTime;
uniform float uAssemble;   // 0..1 intro assembly
uniform float uBurst;      // 0..1 dispersion pulse on transition
uniform float uMotion;     // 0 = reduced motion
uniform float uSize;
uniform float uPixelRatio;
uniform vec2  uMouse;      // world-space xy at hologram plane
uniform float uRepel;
attribute vec3 aStart;
attribute vec4 aRand;      // x random, y size, z category/type, w luminance/contrast
attribute float aProtect;  // 1.0 = face core (eyes, nose, mouth, beard), 0.0 = periphery
varying float vLum;
varying float vDepth;
varying float vType;
varying float vAlpha;

void main() {
  // Smooth non-linear assembly with per-particle jitter
  float p = clamp(uAssemble * 1.4 - aRand.x * 0.4, 0.0, 1.0);
  p = p * p * (3.0 - 2.0 * p);
  vec3 pos = mix(aStart, position, p);

  // Gentle vortex swirl while travelling inward during intro assembly
  float sw = (1.0 - p) * 1.8 * (aRand.x - 0.5);
  float c = cos(sw), s = sin(sw);
  pos.xz = mat2(c, -s, s, c) * pos.xz;

  // Organic, spatially coherent idle breathing motion (preserves anatomical facial landmarks)
  float t = uTime * uMotion;
  // Continuous wave across the bust so neighboring particles move together
  vec3 sway = vec3(
    sin(t * 0.55 + pos.y * 0.75) * 0.005,
    cos(t * 0.45 + pos.x * 0.65) * 0.003,
    sin(t * 0.65 + pos.y * 1.1) * 0.008
  );

  // Flowing living energy projection (Phase 21: Internal Hologram Particle Movement)
  // Cohesive surface harmonic wave that oscillates around original target positions
  float flowPhase = t * 1.5 + pos.y * 3.8 + pos.x * 2.2;
  vec3 flow = vec3(
    sin(flowPhase) * 0.004,
    cos(flowPhase * 0.9 + pos.z * 2.5) * 0.003,
    sin(flowPhase * 1.1 + pos.x * 1.8) * 0.005
  );

  // Microscopic stardust drift (microscopic, never distorts eyes/nose/mouth/beard)
  vec3 micro = vec3(
    sin(t * 1.2 + aRand.x * 6.283),
    cos(t * 1.1 + aRand.x * 4.1),
    sin(t * 1.3 + aRand.x * 5.3)
  ) * 0.0010;

  // Modulate flow by anatomical protection factor:
  // Face core (aProtect = 1.0): subtle micro-oscillation (0.18 scale -> amplitude <= 0.001), 100% facial stability
  // Outer hair tips and shoulders (aProtect = 0.0): visible flowing energy wave
  float motionIntensity = mix(1.0, 0.18, aProtect);
  pos += (sway + flow * motionIntensity + micro * (1.0 - aProtect * 0.85)) * p +
         vec3(sin(t + aRand.x * 6.28), cos(t + aRand.x * 4.0), 0.0) * (0.04 * (1.0 - p));

  // Dispersion burst on transition
  vec3 dir = normalize(position + vec3(0.0001));
  pos += dir * uBurst * (0.7 + aRand.x * 2.5);

  vec4 wp = modelMatrix * vec4(pos, 1.0);

  // Controlled micro-cursor interaction (Phase 21):
  // Face core particles: zero or microscopic movement (<= 0.002 displacement)
  // Hair tips / outer shoulders: subtle gentle deflection (<= 0.015 displacement)
  // Completely eliminates tearing, holes, or explosive scattering
  vec2 d = wp.xy - uMouse;
  float dist = length(d);
  float repelFactor = smoothstep(0.80, 0.0, dist) * uRepel;
  float maxDisp = mix(0.015, 0.002, aProtect);
  vec2 cursorDisp = normalize(d + vec2(0.0001)) * repelFactor * maxDisp;
  wp.xy += cursorDisp;

  vec4 mv = viewMatrix * wp;
  gl_Position = projectionMatrix * mv;

  // Depth normalization for volumetric coloring
  float depthN = clamp((pos.z + 0.35) / 0.85, 0.0, 1.0);

  // High-definition point sizing: crisp fine points so facial features don't blur into solid blobs
  float sizeBase = (1.08 + aRand.y * 0.68) * (0.85 + depthN * 0.35);
  // Refine point size for facial hair / pupils to keep them razor-sharp
  if (aRand.z < 0.18) sizeBase *= 0.88;
  // Slight boost for sparkling catchlights and nose bridge highlights
  if (aRand.w > 0.80 && aRand.z > 0.68) sizeBase *= 1.18;

  gl_PointSize = uSize * uPixelRatio * sizeBase * (4.2 / -mv.z);

  // Slight variations in particle brightness for flowing energy appearance
  float shimmer = 0.94 + 0.06 * sin(t * 2.0 + aRand.x * 6.28 + pos.y * 4.0);
  vLum = aRand.w * shimmer;
  vDepth = depthN;
  vType = aRand.z;
  // Alpha: base luminance + subtle shimmer + assembly blend
  vAlpha = (0.55 + 0.45 * aRand.w) * (0.86 + 0.14 * sin(t * 1.8 + aRand.x * 12.0)) * mix(0.3, 1.0, p);
}
