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
attribute vec4 aRand;      // x: phase, y: size, z: category/type, w: tone
attribute vec3 aNormal;    // Surface normal for volumetric lighting & facing
attribute float aProtect;  // Facial protection mask (1.0 = protected face, 0.0 = peripheral)

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

  // Gentle vortex swirl during initial assembly
  float sw = (1.0 - p) * 1.6 * (aRand.x - 0.5);
  float c = cos(sw), s = sin(sw);
  pos.xz = mat2(c, -s, s, c) * pos.xz;

  // Spatially coherent breathing: anchored strictly to original positions
  float t = uTime * uMotion;
  float breathe = sin(t * 1.4) * 0.003;
  vec3 breatheVec = vec3(
    pos.x * breathe * 0.5,
    pos.y * breathe * 0.6 + sin(t * 1.4) * 0.002,
    pos.z * breathe * 0.5
  );

  pos += breatheVec * p + vec3(sin(t + aRand.x * 6.28), cos(t + aRand.x * 4.0), 0.0) * (0.02 * (1.0 - p));

  // Dispersion burst on transition
  vec3 dir = normalize(position + vec3(0.0001));
  pos += dir * uBurst * (0.6 + aRand.x * 2.0);

  vec4 wp = modelMatrix * vec4(pos, 1.0);

  // Thin, elegant holographic scan plane in world space (width +-0.016)
  float scanDist = abs(wp.y - uScanY);
  float scanFactor = smoothstep(0.016, 0.0, scanDist) * uScanGlow;

  // Strict Facial Protection against Cursor Distortion:
  // All facial features (eyes, nose, mouth, beard, jaw, forehead) have aProtect = 1.0 => displacement is 0.0!
  // Only outermost peripheral hair tips or outer shoulder edges (aProtect < 1.0) respond with subtle micro-displacement.
  vec2 d = wp.xy - uMouse;
  float dist = length(d);
  float allowMove = 1.0 - aProtect;
  float f = smoothstep(0.32, 0.0, dist) * uRepel * allowMove;
  // Maximum displacement strictly clamped to 0.012 world units (microscopic vibration)
  wp.xy += normalize(d + vec2(0.0001)) * f * 0.012;
  wp.z  += f * 0.006;

  vec4 mv = viewMatrix * wp;
  gl_Position = projectionMatrix * mv;

  // Volumetric view-direction facing factor:
  // Forward-facing particles are fully luminous (1.0).
  // Silhouettes & rims retain brilliant holographic edge glow (~0.65).
  // Backward-facing particles attenuate smoothly so opposite surfaces do not create double-vision ghosts.
  vec3 vNorm = normalize(mat3(modelMatrix) * aNormal);
  vec3 viewDir = normalize(cameraPosition - wp.xyz);
  float ndotv = dot(vNorm, viewDir);
  float facing = smoothstep(-0.25, 0.25, ndotv) * 0.92 + 0.08;

  // Depth normalization for volumetric coloring
  float depthN = clamp((pos.z + 0.45) / 0.95, 0.0, 1.0);

  // Crisp high-definition point sizing (typically 2.4 - 3.4 pixels)
  float sizeBase = (1.40 + aRand.y * 0.40) * (0.90 + depthN * 0.25);
  // Razor-sharp points for facial hair / pupils
  if (aRand.z < 0.18) sizeBase *= 0.85;
  // Bright catchlights
  if (aRand.z > 0.90) sizeBase *= 1.30;
  // Refined scan glint without blowing out
  sizeBase *= (1.0 + scanFactor * 0.30);

  gl_PointSize = uSize * uPixelRatio * sizeBase * (4.2 / -mv.z);

  vLum = aRand.w;
  vDepth = depthN;
  vType = aRand.z;
  vScan = scanFactor;
  vPulse = uPulse;
  // Alpha: base tone + view facing + subtle low-frequency ambient shimmer
  float ambientShimmer = 0.94 + 0.06 * sin(uTime * uMotion * 1.2 + aRand.x * 6.28);
  vAlpha = (0.65 + 0.35 * aRand.w) * facing * ambientShimmer * mix(0.4, 1.0, p);
}
