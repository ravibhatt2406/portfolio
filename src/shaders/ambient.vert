uniform float uTime;
uniform float uMotion;     // 0 = reduced motion
uniform float uPixelRatio;
uniform vec2  uMouse;      // world-space xy at hologram plane
uniform float uDim;
uniform float uRepel;      // cursor repulsion strength

attribute vec4 aSeed;      // x: phase, y: speed factor, z: trajectory radius, w: color type (0=cyan, 0.5=blue, 1=violet)
attribute float aSize;

varying vec3  vColor;
varying float vAlpha;

void main() {
  float t = uTime * uMotion;
  vec3 pos = position;

  // 1. Orbital & Curved Drifting Motion around the Hologram (Phase 21)
  // Particles drift in gentle 3D helical / curved trajectories
  float speed = 0.20 * aSeed.y;
  float angle = t * speed + aSeed.x * 6.28318;
  
  // Radial organic breathing
  float radiusFactor = 1.0 + sin(t * 0.45 * aSeed.y + aSeed.x * 4.0) * 0.08;
  
  // Helical / orbital displacement in xz plane
  float rXZ = length(pos.xz) * radiusFactor;
  float currentTheta = atan(pos.z, pos.x) + sin(t * 0.25 * aSeed.y + aSeed.x * 3.14) * 0.15;
  pos.x = cos(currentTheta) * rXZ;
  pos.z = sin(currentTheta) * rXZ;

  // Gentle vertical floating oscillation
  pos.y += sin(t * 0.50 * aSeed.y + aSeed.x * 6.28318) * 0.05 +
           cos(t * 0.35 + aSeed.x * 2.0) * 0.03;

  vec4 wp = modelMatrix * vec4(pos, 1.0);

  // 2. Independent Cursor Interaction for External Particles
  // Ambient particles respond fluidly with soft deflection and flowing trail
  vec2 d = wp.xy - uMouse;
  float dist = length(d);
  float repelFactor = smoothstep(0.85, 0.0, dist) * uRepel;
  // External particles have a noticeable, soft fluid deflection (up to 0.080)
  vec2 cursorDisp = normalize(d + vec2(0.0001)) * repelFactor * 0.080;
  wp.xy += cursorDisp;

  vec4 mv = viewMatrix * wp;
  gl_Position = projectionMatrix * mv;

  // Point size: small, delicate ambient sparkles with depth scaling
  float pSize = aSize * (1.0 + 0.3 * sin(t * 1.5 * aSeed.y + aSeed.x * 8.0));
  gl_PointSize = pSize * uPixelRatio * (3.8 / -mv.z);

  // 3. Chromatic Palette: Electric Cyan (#00E5FF), Blue (#0B84FF), Violet (#8A2BE2)
  vec3 cyan   = vec3(0.000, 0.898, 1.000); // #00E5FF
  vec3 blue   = vec3(0.043, 0.518, 1.000); // #0B84FF
  vec3 violet = vec3(0.541, 0.173, 0.886); // #8A2BE2

  vec3 col;
  if (aSeed.w < 0.35) {
    col = cyan;
  } else if (aSeed.w < 0.70) {
    col = mix(cyan, blue, (aSeed.w - 0.35) / 0.35);
  } else {
    col = mix(blue, violet, (aSeed.w - 0.70) / 0.30);
  }
  vColor = col;

  // Shimmering alpha with gentle breathing
  float shimmer = 0.60 + 0.40 * sin(t * 1.8 * aSeed.y + aSeed.x * 12.0);
  vAlpha = shimmer * uDim;
}

