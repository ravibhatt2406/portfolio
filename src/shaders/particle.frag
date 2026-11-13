precision highp float;
uniform float uDim;
varying float vLum;
varying float vDepth;
varying float vType;
varying float vAlpha;
varying float vScan;
varying float vPulse;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float r = length(uv);
  if (r > 0.5) discard;

  // Soft Gaussian core with radiant holographic halo
  float core = smoothstep(0.48, 0.0, r);
  float halo = pow(1.0 - r * 2.0, 1.35);

  // Authoritative holographic color palette from Reference Boards
  // Electric Cyan (#00E5FF)
  vec3 cyan   = vec3(0.000, 0.898, 1.000);
  // Deep Blue (#3B82F6 / #0B84FF)
  vec3 blue   = vec3(0.043, 0.518, 1.000);
  // Violet Accent (#A855F7 / #8A2BE2)
  vec3 violet = vec3(0.541, 0.173, 0.949);
  // Specular Pure White (#F2F4FF)
  vec3 white  = vec3(0.950, 0.980, 1.000);
  // Deep Indigo (#0A1138) for dark facial features (moustache, beard, pupils, brows)
  vec3 indigo = vec3(0.039, 0.067, 0.220);
  // Maroon/Amethyst torso (#6B21A8)
  vec3 shirt  = vec3(0.420, 0.130, 0.650);

  vec3 col;
  float intensity;

  if (vType < 0.18) {
    // 1. Dark facial identity features: pupils, eyelids, eyebrows, moustache, beard
    // Deep indigo base so they stay dark, distinct, and sharply delineated against cyan skin
    col = mix(indigo, blue * 0.70, vLum * 0.75);
    intensity = 0.70 + halo * 0.40 + core * 0.25;
  } else if (vType < 0.45) {
    // 2. Thick swept-up hair coif, curls & back of head
    col = mix(violet, blue, vDepth * 0.75);
    // Cyan texture highlights along hair waves and crests
    col = mix(col, cyan, smoothstep(0.35, 0.90, vLum) * 0.55);
    intensity = 0.85 + halo * 0.60 + core * 0.35;
  } else if (vType < 0.68) {
    // 3. Torso, crew-neck shirt & collar
    col = mix(shirt, violet, vDepth * 0.65);
    intensity = 0.70 + halo * 0.50;
  } else {
    // 4. Facial skin, forehead, cheeks, nose bridge, ears, neck
    // Luminous cyan midtones grading into brilliant cool white highlights
    col = mix(blue, cyan, smoothstep(0.25, 0.60, vLum));
    col = mix(col, white, smoothstep(0.60, 0.92, vLum));
    intensity = 0.95 + halo * 0.75 + core * 0.50;
  }

  // Pure specular catchlights (pupil sparkles, nose tip highlight)
  if (vType > 0.90) {
    col = white;
    intensity = 1.35 + core * 0.85;
  }

  // Sweeping Holographic Scan Beam Effect
  if (vScan > 0.0) {
    col = mix(col, cyan, vScan * 0.85);
    col = mix(col, white, vScan * 0.55 * vLum);
    intensity += vScan * (1.90 + halo * 1.40 + core * 2.20);
  }

  // Periodic Energy Pulse Effect
  if (vPulse > 0.0) {
    col = mix(col, cyan, vPulse * 0.25);
    intensity += vPulse * 0.32;
  }

  // Subtle digital interference scanline
  float scanline = 0.96 + 0.04 * sin(gl_FragCoord.y * 1.25);
  col *= scanline;

  float alpha = (halo * 0.82 + core * 0.18) * vAlpha * uDim;
  gl_FragColor = vec4(col * intensity, alpha);
}
