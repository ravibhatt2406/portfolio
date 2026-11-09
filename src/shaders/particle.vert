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
    sin(t * 0.55 + pos.y * 0.75) * 0.006,
    cos(t * 0.45 + pos.x * 0.65) * 0.004,
    sin(t * 0.65 + pos.y * 1.1) * 0.010
  );
  // Microscopic stardust drift (microscopic, never distorts eyes/nose/mouth/beard)
  vec3 micro = vec3(
    sin(t * 1.2 + aRand.x * 6.283),
    cos(t * 1.1 + aRand.x * 4.1),
    sin(t * 1.3 + aRand.x * 5.3)
  ) * 0.0012;

  pos += (sway + micro) * p + vec3(sin(t + aRand.x * 6.28), cos(t + aRand.x * 4.0), 0.0) * (0.04 * (1.0 - p));

  // Dispersion burst on transition
  vec3 dir = normalize(position + vec3(0.0001));
  pos += dir * uBurst * (0.7 + aRand.x * 2.5);

  vec4 wp = modelMatrix * vec4(pos, 1.0);

  // Cursor repulsion (smooth radial falloff + elastic return)
  vec2 d = wp.xy - uMouse;
  float dist = length(d);
  float f = smoothstep(0.85, 0.0, dist) * uRepel;
  wp.xy += normalize(d + vec2(0.0001)) * f * 0.45;
  wp.z  += f * 0.38;

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

  vLum = aRand.w;
  vDepth = depthN;
  vType = aRand.z;
  // Alpha: base luminance + subtle shimmer + assembly blend
  vAlpha = (0.55 + 0.45 * aRand.w) * (0.86 + 0.14 * sin(uTime * uMotion * 1.8 + aRand.x * 12.0)) * mix(0.3, 1.0, p);
}
