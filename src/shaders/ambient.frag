precision highp float;

varying vec3  vColor;
varying float vAlpha;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float r = length(uv);
  if (r > 0.5) discard;

  // Soft atmospheric glow with delicate bright center
  float core = smoothstep(0.40, 0.0, r);
  float halo = pow(1.0 - r * 2.0, 1.4);

  vec3 col = vColor * (0.85 + core * 0.45);
  float alpha = (halo * 0.75 + core * 0.25) * vAlpha;

  gl_FragColor = vec4(col, alpha);
}

