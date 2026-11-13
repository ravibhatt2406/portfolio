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
  float halo = pow(1.0 - r * 2.0, 1.30);

  // Authoritative Color Palette
  // Electric Cyan (#00E5FF) - Dominant
  vec3 cyan   = vec3(0.000, 0.900, 1.000);
  // Deep Blue (#0B84FF) - Dominant
  vec3 blue   = vec3(0.043, 0.518, 1.000);
  // Violet Accent (#8A2BE2) - Subtle Secondary Accent
  vec3 violet = vec3(0.541, 0.173, 0.886);
  // Specular White (#FFFFFF) - Catchlights & Nose Tip Crest
  vec3 white  = vec3(0.980, 1.000, 1.000);
  // Deep Indigo (#0A1138) - Dark facial contours (moustache, beard, eyebrows, pupils)
  vec3 indigo = vec3(0.039, 0.067, 0.220);
  // Torso Amethyst / Deep Blue (#3B1D6E / #1E3A8A)
  vec3 shirt  = vec3(0.350, 0.150, 0.700);

  vec3 col;
  float intensity;

  if (vType < 0.18) {
    // 1. Dark facial identity features: pupils, eyelids, eyebrows, moustache, beard
    // Deep indigo base so they stay dark, distinct, and sharply delineated against cyan skin
    col = mix(indigo, blue * 0.70, vLum * 0.75);
    intensity = 0.85 + halo * 0.40 + core * 0.25;
  } else if (vType < 0.45) {
    // 2. Thick swept-up hair coif, curls & back of head
    col = mix(violet, blue, vDepth * 0.75);
    // Cyan texture highlights along hair waves and crests
    col = mix(col, cyan, smoothstep(0.35, 0.90, vLum) * 0.55);
    intensity = 0.95 + halo * 0.65 + core * 0.35;
  } else if (vType < 0.68) {
    // 3. Torso, crew-neck shirt & collar
    col = mix(shirt, blue, vDepth * 0.70);
    // Collar and shoulder edge illumination
    col = mix(col, cyan, smoothstep(0.55, 0.90, vLum) * 0.65);
    intensity = 1.05 + halo * 0.70 + core * 0.35;
  } else {
    // 4. Facial skin, forehead, cheeks, nose bridge, ears, neck
    // Luminous cyan midtones grading into brilliant cool white highlights
    col = mix(blue, cyan, smoothstep(0.20, 0.60, vLum));
    col = mix(col, white, smoothstep(0.65, 0.95, vLum) * 0.70);
    intensity = 1.15 + halo * 0.80 + core * 0.55;
  }

  // Pure specular catchlights (pupil sparkles, nose tip highlight)
  if (vType > 0.90) {
    col = white;
    intensity = 1.60 + core * 0.80;
  }

  // Refined Thin Cyan Scanning Plane (Soft glow, NO white blowout!)
  if (vScan > 0.0) {
    col = mix(col, cyan, vScan * 0.70);
    intensity += vScan * 0.50;
  }

  // Periodic Breathing Energy Pulse
  if (vPulse > 0.0) {
    col = mix(col, cyan, vPulse * 0.25);
    intensity += vPulse * 0.30;
  }

  // Subtle digital interference scanline
  float scanline = 0.97 + 0.03 * sin(gl_FragCoord.y * 1.35);
  col *= scanline;

  float alpha = (halo * 0.82 + core * 0.18) * vAlpha * uDim;
  gl_FragColor = vec4(col * intensity, alpha);
}
