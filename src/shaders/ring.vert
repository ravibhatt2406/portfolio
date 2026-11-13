uniform float uTime;
uniform float uSpeed;
uniform float uPhase;

varying vec2 vUv;
varying vec3 vWorldPos;
varying vec3 vNormal;

void main() {
  vUv = uv;
  vec3 pos = position;

  // Subtle harmonic ribbon undulation along the torus tube
  float undulation = sin(uv.x * 20.0 - uTime * uSpeed * 2.5 + uPhase) * 0.004;
  pos += normal * undulation;

  vec4 wp = modelMatrix * vec4(pos, 1.0);
  vWorldPos = wp.xyz;
  vNormal = normalize(mat3(modelMatrix) * normal);

  gl_Position = projectionMatrix * viewMatrix * wp;
}
