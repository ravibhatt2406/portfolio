import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useDesktop } from '../../store/desktopStore'

interface Props {
  mouse: React.MutableRefObject<{ x: number; y: number; active: boolean }>
}

/**
 * Wallpaper 2: Cosmic Planet (Reference Video 1)
 * - Deep space background with twinkling diamond cross stars
 * - Dark ringed planet in lower-middle with atmospheric rim glow
 * - Luminous multi-layered concentric planetary rings
 * - Volumetric purple and violet organic billowing nebula clouds
 * - Radiant cyan/mint-green/white energy plasma flames rising behind planet horizon
 * - Orbiting satellites, moons, and spacecraft with subtle parallax
 */
export function CosmicPlanetWallpaper({ mouse }: Props) {
  const { viewport } = useThree()
  const reducedMotion = useDesktop((s) => s.reducedMotion)

  const groupRef = useRef<THREE.Group>(null)
  const planetRef = useRef<THREE.Mesh>(null)
  const ringsRef = useRef<THREE.Group>(null)
  const flamesRef = useRef<THREE.Mesh>(null)
  const cloudsRef = useRef<THREE.Group>(null)
  const satelliteRef = useRef<THREE.Group>(null)
  const moon1Ref = useRef<THREE.Mesh>(null)
  const moon2Ref = useRef<THREE.Mesh>(null)

  // 1. Plasma Flame Shader behind the planet
  const flameMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uColor1: { value: new THREE.Color('#38ef7d') }, // mint green
        uColor2: { value: new THREE.Color('#11998e') }, // emerald / cyan
        uColor3: { value: new THREE.Color('#ffffff') }, // bright white core
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPos;
        void main() {
          vUv = uv;
          vPos = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;
        varying vec2 vUv;
        varying vec3 vPos;

        // Simplex-like noise helper
        float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
        float noise(vec2 p) {
          vec2 i = floor(p); vec2 f = fract(p);
          vec2 u = f*f*(3.0-2.0*f);
          return mix(mix(hash(i + vec2(0.0,0.0)), hash(i + vec2(1.0,0.0)), u.x),
                     mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y);
        }

        void main() {
          vec2 uv = vUv;
          float t = uTime * 0.8;

          // Billowing flame distortion
          float n1 = noise(vec2(uv.x * 6.0, uv.y * 3.0 - t * 1.2));
          float n2 = noise(vec2(uv.x * 12.0 + t * 0.4, uv.y * 6.0 - t * 2.0));
          float flame = n1 * 0.6 + n2 * 0.4;

          // Vertical flame shape tapering off at top
          float shape = smoothstep(0.0, 0.4, uv.y) * smoothstep(1.0, 0.35, uv.y);
          // Horizontal containment behind planet
          float hMask = smoothstep(0.0, 0.25, uv.x) * smoothstep(1.0, 0.75, uv.x);

          float intensity = smoothstep(0.3, 0.75, flame + shape * 0.6) * shape * hMask;

          vec3 col = mix(uColor2, uColor1, intensity);
          col = mix(col, uColor3, pow(intensity, 2.8) * 0.9);

          gl_FragColor = vec4(col * 1.3, intensity * 0.85);
        }
      `,
    })
  }, [])

  // 2. Volumetric Purple Clouds Shader
  const cloudMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
      uniforms: {
        uTime: { value: 0 },
        uBaseColor: { value: new THREE.Color('#4a1575') }, // deep purple
        uHighlight: { value: new THREE.Color('#8b5cf6') }, // violet
        uEdgeColor: { value: new THREE.Color('#a855f7') }, // radiant purple
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uBaseColor;
        uniform vec3 uHighlight;
        uniform vec3 uEdgeColor;
        varying vec2 vUv;

        float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
        float noise(vec2 p) {
          vec2 i = floor(p); vec2 f = fract(p);
          vec2 u = f*f*(3.0-2.0*f);
          return mix(mix(hash(i + vec2(0.0,0.0)), hash(i + vec2(1.0,0.0)), u.x),
                     mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y);
        }

        void main() {
          vec2 uv = vUv;
          float t = uTime * 0.25;

          // Billowing organic cloud FBM
          float n = noise(uv * 3.5 + vec2(t * 0.1, t * 0.05)) * 0.5;
          n += noise(uv * 7.0 - vec2(t * 0.15, t * 0.1)) * 0.3;
          n += noise(uv * 14.0 + vec2(t * 0.2, -t * 0.15)) * 0.2;

          // Soft organic puff shapes
          float alpha = smoothstep(0.35, 0.72, n) * smoothstep(1.0, 0.4, length(uv - 0.5) * 1.8);

          vec3 col = mix(uBaseColor, uHighlight, smoothstep(0.4, 0.65, n));
          col = mix(col, uEdgeColor, smoothstep(0.65, 0.85, n) * 0.7);

          gl_FragColor = vec4(col, alpha * 0.9);
        }
      `,
    })
  }, [])

  // 3. Twinkling Diamond Stars
  const starsData = useMemo(() => {
    const starCount = 350
    const positions = new Float32Array(starCount * 3)
    const sizes = new Float32Array(starCount)
    const phases = new Float32Array(starCount)

    for (let i = 0; i < starCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 18
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12 + 1.5
      positions[i * 3 + 2] = -4 + Math.random() * 2
      sizes[i] = 0.5 + Math.random() * 1.5
      phases[i] = Math.random() * 6.28
    }
    return { positions, sizes, phases, count: starCount }
  }, [])

  const starMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2) },
      },
      vertexShader: `
        uniform float uTime;
        uniform float uPixelRatio;
        attribute float aSize;
        attribute float aPhase;
        varying float vAlpha;
        varying float vType;
        void main() {
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mv;
          float twinkle = 0.6 + 0.4 * sin(uTime * 2.2 + aPhase * 4.0);
          gl_PointSize = aSize * uPixelRatio * twinkle * (22.0 / -mv.z);
          vAlpha = twinkle;
          vType = mod(aPhase * 10.0, 3.0);
        }
      `,
      fragmentShader: `
        varying float vAlpha;
        varying float vType;
        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          float r = length(uv);
          if (r > 0.5) discard;

          // 4-point cross diffraction spikes for prominent stars
          float crossShape = max(
            exp(-abs(uv.x) * 22.0) * exp(-abs(uv.y) * 4.0),
            exp(-abs(uv.y) * 22.0) * exp(-abs(uv.x) * 4.0)
          );
          float glow = pow(1.0 - r * 2.0, 1.5);

          float intensity = glow + (vType > 1.8 ? crossShape * 1.2 : 0.0);
          vec3 starCol = mix(vec3(0.9, 0.95, 1.0), vec3(0.8, 0.7, 1.0), sin(vType) * 0.5 + 0.5);

          gl_FragColor = vec4(starCol * intensity, intensity * vAlpha * 0.95);
        }
      `,
    })
  }, [])

  // 4. Planetary Rings Geometry and Shader
  const ringsData = useMemo(() => {
    const ringParticles = 14000
    const pos = new Float32Array(ringParticles * 3)
    const colors = new Float32Array(ringParticles * 3)
    const sizes = new Float32Array(ringParticles)

    for (let i = 0; i < ringParticles; i++) {
      // Concentric bands from radius 2.2 to 4.8
      const band = Math.random()
      let radius = 2.2 + band * 2.6
      // Rings density gaps
      if (radius > 3.1 && radius < 3.3) radius += 0.2 // Cassini division gap
      if (radius > 4.1 && radius < 4.2) radius += 0.1

      const theta = Math.random() * Math.PI * 2
      pos[i * 3] = radius * Math.cos(theta)
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.04 // razor thin disc
      pos[i * 3 + 2] = radius * Math.sin(theta)

      // Ring colors: luminous silver, violet, cyan, electric blue
      const t = radius / 4.8
      if (t < 0.6) {
        colors[i * 3] = 0.85; colors[i * 3 + 1] = 0.92; colors[i * 3 + 2] = 1.0 // silver cyan
      } else if (t < 0.85) {
        colors[i * 3] = 0.65; colors[i * 3 + 1] = 0.45; colors[i * 3 + 2] = 0.95 // violet
      } else {
        colors[i * 3] = 0.35; colors[i * 3 + 1] = 0.75; colors[i * 3 + 2] = 0.98 // electric cyan
      }

      sizes[i] = 0.8 + Math.random() * 1.6
    }
    return { pos, colors, sizes, count: ringParticles }
  }, [])

  // 5. Stylized Satellite mesh model
  const satelliteMesh = useMemo(() => {
    const satGroup = new THREE.Group()
    // Main body
    const bodyGeo = new THREE.BoxGeometry(0.12, 0.12, 0.18)
    const bodyMat = new THREE.MeshStandardMaterial({ color: '#cccccc', metalness: 0.8, roughness: 0.3 })
    const body = new THREE.Mesh(bodyGeo, bodyMat)
    satGroup.add(body)

    // Left solar panel
    const panelGeo = new THREE.BoxGeometry(0.32, 0.01, 0.12)
    const panelMat = new THREE.MeshBasicMaterial({ color: '#2563eb' }) // deep blue solar cell
    const leftPanel = new THREE.Mesh(panelGeo, panelMat)
    leftPanel.position.set(-0.24, 0, 0)
    satGroup.add(leftPanel)

    // Right solar panel
    const rightPanel = new THREE.Mesh(panelGeo, panelMat)
    rightPanel.position.set(0.24, 0, 0)
    satGroup.add(rightPanel)

    // Dish antenna
    const dishGeo = new THREE.ConeGeometry(0.06, 0.04, 8)
    const dishMat = new THREE.MeshBasicMaterial({ color: '#e2e8f0' })
    const dish = new THREE.Mesh(dishGeo, dishMat)
    dish.rotation.x = Math.PI / 2
    dish.position.set(0, 0.08, 0.09)
    satGroup.add(dish)

    satGroup.scale.setScalar(0.7)
    return satGroup
  }, [])

  // Animation Loop
  useFrame((_, dt) => {
    dt = Math.min(dt, 0.05)
    const time = performance.now() * 0.001
    const motionFactor = reducedMotion ? 0 : 1

    // Update shaders
    flameMaterial.uniforms.uTime.value = time * motionFactor
    cloudMaterial.uniforms.uTime.value = time * motionFactor
    starMaterial.uniforms.uTime.value = time * motionFactor

    // Rings slow rotation
    if (ringsRef.current) {
      ringsRef.current.rotation.y += dt * 0.08 * motionFactor
    }

    // Planet slow axial rotation
    if (planetRef.current) {
      planetRef.current.rotation.y += dt * 0.02 * motionFactor
    }

    // Satellite elliptical orbit
    if (satelliteRef.current) {
      const satAngle = time * 0.35 * motionFactor
      const satR = 3.6
      satelliteRef.current.position.set(
        Math.cos(satAngle) * satR,
        -1.35 + Math.sin(satAngle * 1.4) * 0.45,
        Math.sin(satAngle) * satR * 0.8
      )
      satelliteRef.current.rotation.y = -satAngle + Math.PI / 2
      satelliteRef.current.rotation.z = Math.sin(time) * 0.2
    }

    // Moon 1 orbit (left foreground)
    if (moon1Ref.current) {
      const m1Angle = time * 0.22 * motionFactor + 1.2
      moon1Ref.current.position.set(
        Math.cos(m1Angle) * 2.8 - 0.5,
        -1.3 + Math.sin(m1Angle) * 0.4,
        Math.sin(m1Angle) * 1.5 + 0.8
      )
    }

    // Moon 2 orbit (right background)
    if (moon2Ref.current) {
      const m2Angle = -time * 0.18 * motionFactor + 2.8
      moon2Ref.current.position.set(
        Math.cos(m2Angle) * 3.2 + 0.6,
        -1.1 + Math.sin(m2Angle) * 0.35,
        Math.sin(m2Angle) * 1.2 - 0.5
      )
    }

    // Interactive Camera Parallax & Cursor Tilting
    if (groupRef.current && mouse.current.active && !reducedMotion) {
      const targetRx = -mouse.current.y * 0.12
      const targetRy = mouse.current.x * 0.18
      groupRef.current.rotation.x += (targetRx - groupRef.current.rotation.x) * dt * 2.5
      groupRef.current.rotation.y += (targetRy - groupRef.current.rotation.y) * dt * 2.5
    }
  })

  // Position the planet scene in the lower-middle portion as seen in Reference Video 1
  const planetY = viewport.width < 768 ? -1.8 : -1.45

  return (
    <group ref={groupRef}>
      {/* 1. Ambient Stars Field */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[starsData.positions, 3]} />
          <bufferAttribute attach="attributes-aSize" args={[starsData.sizes, 1]} />
          <bufferAttribute attach="attributes-aPhase" args={[starsData.phases, 1]} />
        </bufferGeometry>
        <primitive object={starMaterial} attach="material" />
      </points>

      {/* 2. Plasma Flame / Aurora behind the planet */}
      <mesh ref={flamesRef} position={[0, planetY + 0.7, -1.8]} material={flameMaterial}>
        <planeGeometry args={[7.2, 4.0, 32, 32]} />
      </mesh>

      {/* 3. The Central Ringed Planet */}
      <group position={[0, planetY, 0]}>
        {/* Dark Planet Sphere with Atmospheric Rim Lighting */}
        <mesh ref={planetRef} position={[0, 0, 0]}>
          <sphereGeometry args={[1.5, 48, 48]} />
          <meshStandardMaterial
            color="#141026"
            roughness={0.75}
            metalness={0.2}
            emissive="#1c133a"
            emissiveIntensity={0.35}
          />
        </mesh>

        {/* Atmospheric Cyan / Violet Glow Ring around Planet */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[1.54, 40, 40]} />
          <meshBasicMaterial
            color="#67e8f9"
            transparent
            opacity={0.18}
            blending={THREE.AdditiveBlending}
            side={THREE.BackSide}
          />
        </mesh>

        {/* Planetary Rings tilted at 28 degrees */}
        <group ref={ringsRef} rotation={[0.48, 0, -0.15]}>
          <points>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[ringsData.pos, 3]} />
              <bufferAttribute attach="attributes-color" args={[ringsData.colors, 3]} />
            </bufferGeometry>
            <pointsMaterial
              size={0.038}
              vertexColors
              transparent
              opacity={0.88}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </points>
        </group>
      </group>

      {/* 4. Volumetric Purple Clouds (Left and Right Bottom Billows) */}
      <group ref={cloudsRef}>
        {/* Left purple cloud formation */}
        <mesh position={[-viewport.width * 0.42, planetY - 0.2, 0.8]} material={cloudMaterial}>
          <planeGeometry args={[4.2, 3.8]} />
        </mesh>
        <mesh position={[-viewport.width * 0.38, planetY + 0.4, 0.5]} material={cloudMaterial}>
          <planeGeometry args={[3.6, 3.2]} />
        </mesh>

        {/* Right purple cloud formation */}
        <mesh position={[viewport.width * 0.42, planetY - 0.2, 0.8]} material={cloudMaterial}>
          <planeGeometry args={[4.2, 3.8]} />
        </mesh>
        <mesh position={[viewport.width * 0.38, planetY + 0.4, 0.5]} material={cloudMaterial}>
          <planeGeometry args={[3.6, 3.2]} />
        </mesh>
      </group>

      {/* 5. Orbiting Celestial Entities */}
      {/* Orbiting Spacecraft */}
      <primitive ref={satelliteRef} object={satelliteMesh} />

      {/* Moon 1 (Dark cratered asteroid/moon) */}
      <mesh ref={moon1Ref}>
        <sphereGeometry args={[0.22, 24, 24]} />
        <meshStandardMaterial color="#332d42" roughness={0.9} />
      </mesh>

      {/* Moon 2 (Smaller distant moon) */}
      <mesh ref={moon2Ref}>
        <sphereGeometry args={[0.15, 20, 20]} />
        <meshStandardMaterial color="#2d2838" roughness={0.9} />
      </mesh>

      {/* Ambient Lighting for the Scene */}
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 5, 3]} intensity={1.2} color="#ffffff" />
      <pointLight position={[0, planetY + 1.2, -1.0]} intensity={2.5} color="#38ef7d" distance={6} />
      <pointLight position={[-3, -1, 2]} intensity={1.5} color="#8b5cf6" distance={8} />
      <pointLight position={[3, -1, 2]} intensity={1.5} color="#8b5cf6" distance={8} />
    </group>
  )
}

