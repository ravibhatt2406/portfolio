precision highp float;
uniform float uDim;
varying float vLum;
varying float vDepth;
varying float vType;
varying float vAlpha;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float r = length(uv);
  if (r > 0.5) discard;

  // Gaussian-like soft glow with crisp hot core
  float core = smoothstep(0.48, 0.0, r);
  float halo = pow(1.0 - r * 2.0, 1.35);

  // Hologram chromatic palette: cyan, electric blue, violet, cool white, deep indigo, amethyst
  vec3 cyan   = vec3(0.140, 0.900, 0.980);
  vec3 blue   = vec3(0.200, 0.540, 1.000);
  vec3 violet = vec3(0.560, 0.300, 0.980);
  vec3 white  = vec3(0.970, 0.980, 1.000);
  vec3 indigo = vec3(0.100, 0.180, 0.650);
  vec3 shirt  = vec3(0.480, 0.180, 0.750);

  vec3 col;
  float intensity;

  if (vType < 0.18) {
    // 1. Dark facial identity features: pupils, eyelids, eyebrows, mustache, beard
    // Deep electric blue & indigo so they remain dark & clearly distinguishable against skin
    col = mix(indigo, blue, vLum * 0.80);
    intensity = 0.75 + halo * 0.45 + core * 0.30;
  } else if (vType < 0.45) {
    // 2. Thick swept-up hair coif & curls
    col = mix(violet, blue, vDepth * 0.75);
    // Cyan texture highlights along hair waves and crests
    col = mix(col, cyan, smoothstep(0.35, 0.90, vLum) * 0.50);
    intensity = 0.85 + halo * 0.60 + core * 0.35;
  } else if (vType < 0.68) {
    // 3. Torso & maroon shirt silhouette
    col = mix(shirt, violet, vDepth * 0.65);
    intensity = 0.70 + halo * 0.50;
  } else {
    // 4. Facial skin, forehead, cheeks, nose bridge, eye catchlights
    // Luminous cyan midtones grading into brilliant cool white highlights
    col = mix(blue, cyan, smoothstep(0.25, 0.60, vLum));
    col = mix(col, white, smoothstep(0.60, 0.92, vLum));
    intensity = 0.95 + halo * 0.75 + core * 0.50;
  }

  float alpha = (halo * 0.82 + core * 0.18) * vAlpha * uDim;
  gl_FragColor = vec4(col * intensity, alpha);
}
