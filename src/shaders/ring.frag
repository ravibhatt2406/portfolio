precision highp float;

uniform float uTime;
uniform float uSpeed;
uniform float uPhase;
uniform float uDim;
uniform vec3  uBaseColor1; // Cyan #00E5FF
uniform vec3  uBaseColor2; // Blue #0B84FF
uniform vec3  uBaseColor3; // Violet #8A2BE2

varying vec2 vUv;
varying vec3 vWorldPos;
varying vec3 vNormal;

void main() {
  // Cross-sectional tube coordinate (0 at edges, 1 at center spine)
  float tubeProfile = 1.0 - abs(vUv.y - 0.5) * 2.0;
  tubeProfile = clamp(tubeProfile, 0.0, 1.0);

  // Razor-sharp spine vs wide ethereal halo
  float core = pow(tubeProfile, 4.5);
  float mid  = pow(tubeProfile, 2.2);
  float halo = pow(tubeProfile, 1.2);

  // Longitudinal flow coordinates along the ring circumference
  float u = vUv.x;
  float t = uTime * uSpeed + uPhase;

  // Braided multi-frequency plasma filaments
  float f1 = sin(u * 24.0 - t * 3.5);
  float f2 = cos(u * 16.0 - t * 2.2 + 1.2);
  float f3 = sin(u * 38.0 - t * 5.0 + 2.5);
  float strand = 0.70 + 0.20 * f1 + 0.12 * f2 + 0.08 * f3;

  // Traveling plasma pulses / hot spots racing around the ring
  float p1 = pow(max(0.0, sin(u * 6.28318 - t * 1.8)), 8.0) * 1.1;
  float p2 = pow(max(0.0, cos(u * 6.28318 - t * 1.3 + 3.14159)), 8.0) * 0.9;
  float pulse = p1 + p2;

  // Saturated color gradient along the ring: Cyan -> Blue -> Violet -> Cyan
  float colorPhase = sin(u * 6.28318 + t * 0.85);
  vec3 col;
  if (colorPhase < -0.2) {
    float k = smoothstep(-1.0, -0.2, colorPhase);
    col = mix(uBaseColor3, uBaseColor2, k); // Violet (#8A2BE2) -> Blue (#0B84FF)
  } else if (colorPhase < 0.6) {
    float k = smoothstep(-0.2, 0.6, colorPhase);
    col = mix(uBaseColor2, uBaseColor1, k); // Blue (#0B84FF) -> Cyan (#00E5FF)
  } else {
    float k = smoothstep(0.6, 1.0, colorPhase);
    col = mix(uBaseColor1, vec3(0.55, 0.95, 1.0), k * 0.5); // Cyan with subtle bright edge
  }

  // Thin core accent without washing out into solid white
  col += vec3(0.25, 0.45, 0.60) * core;

  // Add saturated pulse glow
  col += mix(uBaseColor1, uBaseColor3, 0.5) * pulse * 0.85;

  // Final intensity and alpha: rich, vibrant, saturated neon glow!
  float intensity = (halo * 0.65 + mid * 0.90 + core * 0.70) * strand + pulse * (halo + core);
  float alpha = (halo * 0.55 + mid * 0.35 + core * 0.25 + pulse * 0.3) * uDim;

  gl_FragColor = vec4(col * intensity, clamp(alpha, 0.0, 1.0));
}
