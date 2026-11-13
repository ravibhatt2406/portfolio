uniform float uTime;
uniform float uAssemble;   // 0..1 intro assembly
uniform float uBurst;      // 0..1 dispersion pulse on transition
uniform float uMotion;     // 0 = reduced motion
uniform float uSize;
uniform float uPixelRatio;
uniform vec2  uMouse;      // world-space xy at hologram plane
uniform float uRepel;
uniform float uScanY;      // Sweeping scan beam Y position
uniform float uScanGlow;   // Intensity of scan beam (0..1)
uniform float uPulse;      // Soft periodic breathing energy pulse (0..1)

attribute vec3 aStart;
attribute vec4 aRand;      // x random, y size, z category/type, w luminance/contrast
attribute vec3 aNormal;    // Surface normal for volumetric orientation

varying float vLum;
varying float vDepth;
varying float vType;
varying float vAlpha;
varying float vScan;
varying float vPulse;

void main() {
  // Smooth non-linear assembly with per-particle jitter
  float p = clamp(uAssemble * 1.4 - aRand.x * 0.4, 0.0, 1.0);
  p = p * p * (3.0 - 2.0 * p);
  vec3 pos = mix(aStart, position, p);

  // Gentle vortex swirl while travelling inward during intro assembly
  float sw = (1.0 - p) * 1.8 * (aRand.x - 0.5);
  float c = cos(sw), s = sin(sw);
  pos.xz = mat2(c, -s, s, c) * pos.xz;

  // Lifelike organic breathing & subtle harmonic sway
  float t = uTime * uMotion;
  float breathe = sin(t * 1.6) * 0.006;
  vec3 breatheVec = vec3(
    pos.x * breathe + sin(t * 0.55 + pos.y * 0.75) * 0.005,
    pos.y * breathe * 0.7 + cos(t * 0.45 + pos.x * 0.65) * 0.004,
    pos.z * breathe + sin(t * 0.65 + pos.y * 1.10) * 0.008
  );

  // Microscopic stardust drift (microscopic, never distorts facial landmarks)
  vec3 micro = vec3(
    sin(t * 1.2 + aRand.x * 6.283),
    cos(t * 1.1 + aRand.x * 4.100),
    sin(t * 1.3 + aRand.x * 5.300)
  ) * 0.0010;

  pos += (breatheVec + micro) * p + vec3(sin(t + aRand.x * 6.28), cos(t + aRand.x * 4.0), 0.0) * (0.04 * (1.0 - p));

  // Dispersion burst on transition
  vec3 dir = normalize(position + vec3(0.0001));
  pos += dir * uBurst * (0.7 + aRand.x * 2.5);

  vec4 wp = modelMatrix * vec4(pos, 1.0);

  // Sweeping holographic scan line calculation in world space
  float scanDist = abs(wp.y - uScanY);
  float scanFactor = smoothstep(0.09, 0.0, scanDist) * uScanGlow;

  // Cursor repulsion (smooth radial falloff + elastic return)
  vec2 d = wp.xy - uMouse;
  float dist = length(d);
  float f = smoothstep(0.85, 0.0, dist) * uRepel;
  wp.xy += normalize(d + vec2(0.0001)) * f * 0.45;
  wp.z  += f * 0.38;

  vec4 mv = viewMatrix * wp;
  gl_Position = projectionMatrix * mv;

  // Volumetric view-direction facing factor (Three.js cameraPosition)
  vec3 vNorm = normalize(mat3(modelMatrix) * aNormal);
  vec3 viewDir = normalize(cameraPosition - wp.xyz);
  float ndotv = dot(vNorm, viewDir);
  float facing = clamp(ndotv * 0.70 + 0.50, 0.12, 1.0);

  // Depth normalization for volumetric coloring
  float depthN = clamp((pos.z + 0.45) / 0.95, 0.0, 1.0);

  // High-definition point sizing
  float sizeBase = (1.08 + aRand.y * 0.68) * (0.85 + depthN * 0.35);
  // Razor-sharp points for facial hair / pupils
  if (aRand.z < 0.18) sizeBase *= 0.86;
  // Sparkling catchlights and nose bridge highlights
  if (aRand.w > 0.80 && aRand.z > 0.68) sizeBase *= 1.18;
  // Boost point size when swept by holographic scan beam
  sizeBase *= (1.0 + scanFactor * 1.5);

  gl_PointSize = uSize * uPixelRatio * sizeBase * (4.2 / -mv.z);

  vLum = aRand.w;
  vDepth = depthN;
  vType = aRand.z;
  vScan = scanFactor;
  vPulse = uPulse;
  // Alpha: base luminance + subtle shimmer + assembly blend + volumetric facing
  vAlpha = (0.55 + 0.45 * aRand.w) * facing * (0.86 + 0.14 * sin(uTime * uMotion * 1.8 + aRand.x * 12.0)) * mix(0.3, 1.0, p);
}
