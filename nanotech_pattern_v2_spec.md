# Nanotech Diagonal Grid Animation — Production Specification v2.0

**Concept:** A diagonal snakeskin-like grid of chamfered squares flows from bottom-left to top-right, evolving through fetal traces → stepping stone → peak nano-merge → decay, with two weaving streams that flip-merge into a Tony Stark nano-suit formation at the climax.

---

## 1. VISUAL STYLE & PALETTE

### Color Tokens
```css
:root {
  /* Core */
  --bg-obsidian: #0B0C0E;
  --neon-gold: #FF8A00;
  --neon-cyan: #00E5FF;
  --neon-mint: #8AFFC1;

  /* Opacity Variants */
  --trace-faint: rgba(255, 138, 0, 0.03);
  --trace-low: rgba(255, 138, 0, 0.06);
  --trace-mid: rgba(255, 138, 0, 0.18);
  --filament-stepping: rgba(255, 138, 0, 0.5);
  --filament-peak: rgba(255, 138, 0, 0.92);

  /* Stream Colors */
  --stream-a: #00E5FF;  /* cyan - leads */
  --stream-b: #FF8A00;  /* gold - follows */

  /* Grain */
  --grain-opacity: 0.035;
}
```

### Material Properties
| Property | Value |
|----------|-------|
| Edge reflectivity | 0.15 (subtle metallic sheen) |
| Interior surface | Matte, roughness 0.85 |
| Bloom threshold | 0.72 |
| Bloom intensity | 0.35 |
| Bloom radius | 0.4 |

---

## 2. GEOMETRY SPECIFICATION

### Unit Shape: Chamfered Square (Almost-Hexagon)
```
        ┌────────┐
       /          \
      │            │
      │            │
       \          /
        └────────┘
```

**SVG Base Unit (64×64 viewBox):**
```svg
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="metallic-edge" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF8A00" stop-opacity="0.9"/>
      <stop offset="50%" stop-color="#FFAA44" stop-opacity="1"/>
      <stop offset="100%" stop-color="#FF8A00" stop-opacity="0.9"/>
    </linearGradient>
  </defs>
  <path
    d="M 16 2 L 48 2 L 62 16 L 62 48 L 48 62 L 16 62 L 2 48 L 2 16 Z"
    fill="none"
    stroke="url(#metallic-edge)"
    stroke-width="1.5"
  />
  <!-- Inner filament -->
  <path
    d="M 20 8 L 44 8 L 56 20 L 56 44 L 44 56 L 20 56 L 8 44 L 8 20 Z"
    fill="none"
    stroke="#FF8A00"
    stroke-width="0.5"
    stroke-opacity="0.4"
  />
  <!-- Center micro-node -->
  <circle cx="32" cy="32" r="2" fill="#FF8A00" fill-opacity="0.6"/>
</svg>
```

### Grid Parameters
| Parameter | Value |
|-----------|-------|
| Unit size | 64px × 64px |
| Grid spacing | 89.6px (1.4× unit width) |
| Diagonal angle | 35° from horizontal |
| Grid rows | ceil(viewportHeight / 89.6) + 4 |
| Grid columns | ceil(viewportWidth / 89.6) + 4 |
| Per-instance offset | ±0.02 position, ±3° rotation (Perlin-seeded) |

### Normal Map Specification
- Format: RGB tangent-space normal map
- Resolution: 256×256px per unit
- Bevel depth: 4px equivalent
- Edge highlight angle: 45° top-left light source

---

## 3. ANIMATION TIMELINE (12.0s Loop)

### Master Timeline
```
TIME (s)    PERCENT    STAGE                    KEY EVENTS
─────────────────────────────────────────────────────────────────────
0.00        0%         Loop Start               Faint traces only
0.00-6.00   0-50%      GROWTH PHASE             Traces → 30% structure
6.00        50%        Growth Complete          Filaments at 0.18 opacity
6.00-7.80   50-65%     STEPPING STONE           Definition increases
7.80        65%        Stepping Complete        Micro-particles begin
7.80-9.60   65-80%     PEAK / NANO-MERGE        Full formation + flip
8.70        72.5%      NANO-FLIP APEX           Stream merge executes
9.60        80%        Peak Complete            Begin decay
9.60-10.80  80-90%     DECAY PHASE              Graceful dim-down
10.80-12.00 90-100%    DIE & LOOP               Crossfade to traces
12.00       100%       Loop Reset               Seamless transition
```

### Opacity Ramp Functions

**Growth Phase (0-50%):**
```javascript
function growthOpacity(t, localPhase) {
  const p = t / 6.0; // 0 to 1 over 6 seconds
  const base = 0.03 + (0.15 * Math.pow(p, 2)); // cubic ramp
  const noise = perlin(localPhase * 0.1 + t * 0.5) * 0.03;
  return Math.min(0.18, base + noise);
}
```

**Stepping Stone (50-65%):**
```javascript
function steppingOpacity(t, localPhase) {
  const p = (t - 6.0) / 1.8; // 0 to 1 over 1.8 seconds
  const base = 0.18 + (0.32 * easeOutCubic(p));
  return Math.min(0.5, base);
}
```

**Peak (65-80%):**
```javascript
function peakOpacity(t, localPhase) {
  const p = (t - 7.8) / 1.8;
  const base = 0.5 + (0.42 * easeOutCubic(p));
  const bloom = localPhase > 0.7 ? 0.08 : 0;
  return Math.min(1.0, base + bloom);
}
```

**Decay (80-100%):**
```javascript
function decayOpacity(t, localPhase) {
  const p = (t - 9.6) / 2.4;
  const base = 0.92 * (1 - easeInCubic(p));
  return Math.max(0.03, base);
}
```

---

## 4. DUAL STREAM SYSTEM

### Stream Configuration
| Stream | Color | Speed Multiplier | Phase Offset | Role |
|--------|-------|------------------|--------------|------|
| A (Lead) | #00E5FF (cyan) | 1.15× | 0° | Pioneer stream |
| B (Follow) | #FF8A00 (gold) | 1.00× | 18° lag | Main formation |

### Stream Weave Algorithm
```javascript
function calculateStreamPhase(unitX, unitY, time, streamId) {
  const diagonalPos = unitX * Math.cos(35 * DEG2RAD) + unitY * Math.sin(35 * DEG2RAD);
  const speedMult = streamId === 'A' ? 1.15 : 1.0;
  const phaseOffset = streamId === 'A' ? 0 : Math.PI * 0.1; // 18° in radians

  const waveFreq = 0.08;
  const weaveAmp = 0.12;
  const weave = Math.sin(diagonalPos * waveFreq + time * 2.0 + phaseOffset) * weaveAmp;

  const basePhase = (diagonalPos * 0.02 - time * speedMult * 0.15) % 1.0;
  return (basePhase + weave + 1.0) % 1.0;
}
```

### Stream Blend in Peak Zone
```javascript
function blendStreams(phaseA, phaseB, peakFactor) {
  // peakFactor: 0 outside peak, 1 at apex
  const blendWeight = smoothstep(0.65, 0.75, peakFactor);
  return {
    opacity: lerp(phaseA.opacity, (phaseA.opacity + phaseB.opacity) * 0.6, blendWeight),
    color: lerpColor(phaseA.color, phaseB.color, blendWeight * 0.5),
    rotation: lerp(0, phaseA.flipAngle, blendWeight)
  };
}
```

---

## 5. NANO-FLIP / MERGE TRANSITION

### Timing Parameters
| Parameter | Value |
|-----------|-------|
| Merge zone start | 7.8s (65%) |
| Flip apex | 8.7s (72.5%) |
| Merge zone end | 9.6s (80%) |
| Core flip duration | 280ms |
| Flip easing | cubic-bezier(0.16, 0.84, 0.32, 1) |
| Max rotation angle | 18° |
| Particle burst duration | 350ms |
| Particle spring damping | 12 |

### Flip Mechanics
```javascript
function nanoFlip(unit, globalTime, mergeProgress) {
  // mergeProgress: 0 at 7.8s, 1 at 9.6s
  const flipWindow = smoothstep(0.4, 0.6, mergeProgress); // peaks at 72.5%
  const flipAngle = flipWindow * 18 * DEG2RAD;

  // Axis: unit's local Y axis (vertical flip)
  const flipMatrix = rotateY(flipAngle);

  // Interlock offset: units shift toward neighbors
  const interlockOffset = flipWindow * 4; // px
  const neighborDir = unit.isStreamA ? 1 : -1;

  return {
    transform: flipMatrix,
    translateX: interlockOffset * neighborDir * Math.cos(35 * DEG2RAD),
    translateY: interlockOffset * neighborDir * Math.sin(35 * DEG2RAD),
    morphWeight: flipWindow // for vertex blending
  };
}
```

### Particle Assembly Burst
```javascript
const particleConfig = {
  count: 24, // per merge event
  shapes: ['triangle', 'line', 'dot'],
  shapeWeights: [0.4, 0.4, 0.2],
  sizeRange: [1, 3], // px
  velocityInward: 40, // px/s toward merge center
  lifetime: 350, // ms
  springDamping: 12,
  springStiffness: 180,
  flashBrightness: 1.4, // single frame
  flashSaturation: 0.7 // desaturate flash
};
```

### Dome/Curved Surface Effect
```javascript
// Normal map distortion at merge apex
function getMergeNormalOffset(uv, mergeProgress) {
  const domeStrength = smoothstep(0.5, 0.7, mergeProgress) * (1 - smoothstep(0.7, 0.9, mergeProgress));
  const centerDist = length(uv - vec2(0.5));
  const domeHeight = (1 - centerDist * 2) * domeStrength * 0.15;

  return vec3(
    -dFdx(domeHeight) * 2.0,
    -dFdy(domeHeight) * 2.0,
    1.0
  ).normalize();
}
```

---

## 6. NOISE TEXTURE INTRUSION

### Noise Parameters
```javascript
const noiseConfig = {
  type: 'turbulence', // Perlin turbulence
  octaves: 3,
  frequency: 0.004, // world-space
  lacunarity: 2.1,
  persistence: 0.45,
  animationSpeed: 0.08, // very slow drift
  opacityRange: [0.02, 0.12],
  occlusionBlend: 'multiply',
  sparsity: 0.7 // 70% of noise field is transparent
};
```

### Implementation
```glsl
float getNoiseIntrusion(vec2 worldPos, float time) {
  vec2 noiseUV = worldPos * 0.004 + vec2(time * 0.08, time * 0.05);
  float noise = turbulence(noiseUV, 3, 2.1, 0.45);

  // Sparsify
  noise = smoothstep(0.3, 0.7, noise);

  // Map to opacity range
  return mix(0.02, 0.12, noise);
}
```

---

## 7. EASING TOKENS

```css
:root {
  /* Primary animation easing */
  --ease-smooth: cubic-bezier(0.16, 0.84, 0.32, 1);

  /* Growth/fade */
  --ease-in-cubic: cubic-bezier(0.32, 0, 0.67, 0);
  --ease-out-cubic: cubic-bezier(0.33, 1, 0.68, 1);
  --ease-in-out-cubic: cubic-bezier(0.65, 0, 0.35, 1);

  /* Spring approximation */
  --ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.1);

  /* Nano-flip */
  --ease-flip: cubic-bezier(0.16, 0.84, 0.32, 1);
}
```

### JavaScript Easing Functions
```javascript
const easing = {
  smooth: (t) => {
    const c = 0.16, d = 0.84, e = 0.32, f = 1;
    return cubicBezier(c, d, e, f, t);
  },

  inCubic: (t) => t * t * t,

  outCubic: (t) => 1 - Math.pow(1 - t, 3),

  inOutCubic: (t) => t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2,

  spring: (t, damping = 12) => {
    const omega = 2 * Math.PI;
    return 1 - Math.exp(-damping * t) * Math.cos(omega * t);
  }
};
```

---

## 8. MOTION TOKENS

```javascript
const motion = {
  // Durations (ms)
  duration: {
    trace: 6000,        // growth phase
    stepping: 1800,     // stepping stone
    peak: 1800,         // peak formation
    decay: 1200,        // fade begin
    dieout: 1200,       // final fade
    flipCore: 280,      // nano-flip rotation
    flipEaseIn: 200,    // flip anticipation
    flipEaseOut: 300,   // flip settle
    particleBurst: 350, // assembly particles
    loop: 12000         // total
  },

  // Bloom
  bloom: {
    threshold: 0.72,
    intensity: 0.35,
    radius: 0.4,
    peakBoost: 0.18 // +18% brightness in peak zone
  },

  // Rotation limits
  rotation: {
    maxFlip: 18,      // degrees
    instanceJitter: 3 // degrees per-unit variation
  }
};
```

---

## 9. THREE.JS / REACT-THREE-FIBER IMPLEMENTATION

### Core Setup
```jsx
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom, Noise } from '@react-three/postprocessing';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

// Shader for chamfered square
const gridShader = {
  vertexShader: `
    attribute float instancePhase;
    attribute float instanceStream;
    attribute vec3 instanceOffset;
    attribute float instanceRotation;

    uniform float uTime;
    uniform float uLoopDuration;

    varying float vPhase;
    varying float vStream;
    varying vec2 vUv;
    varying float vOpacity;

    ${/* Include easing functions */}

    void main() {
      vUv = uv;
      vPhase = instancePhase;
      vStream = instanceStream;

      // Calculate diagonal position
      float diagPos = instanceOffset.x * cos(radians(35.0)) +
                      instanceOffset.y * sin(radians(35.0));

      // Calculate local phase based on time and position
      float globalPhase = mod(uTime / uLoopDuration, 1.0);
      float localPhase = mod(diagPos * 0.02 - globalPhase + instancePhase, 1.0);

      // Calculate opacity based on stage
      vOpacity = calculateOpacity(localPhase, globalPhase);

      // Apply flip in peak zone
      float flipAngle = calculateFlip(localPhase, globalPhase);
      mat3 flipMatrix = rotateY(flipAngle);

      vec3 pos = flipMatrix * position;
      pos += instanceOffset;

      // Apply per-instance jitter
      pos.xy += vec2(
        sin(instancePhase * 6.28) * 1.5,
        cos(instancePhase * 6.28) * 1.5
      );

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,

  fragmentShader: `
    uniform float uTime;
    uniform vec3 uColorGold;
    uniform vec3 uColorCyan;
    uniform sampler2D uNormalMap;
    uniform sampler2D uNoiseMap;

    varying float vPhase;
    varying float vStream;
    varying vec2 vUv;
    varying float vOpacity;

    void main() {
      // Get base color from stream
      vec3 baseColor = mix(uColorGold, uColorCyan, vStream);

      // Apply normal map for metallic sheen
      vec3 normal = texture2D(uNormalMap, vUv).rgb * 2.0 - 1.0;
      float sheen = dot(normal, normalize(vec3(0.5, 0.5, 1.0))) * 0.15;

      // Noise intrusion
      float noise = texture2D(uNoiseMap, vUv * 0.1 + uTime * 0.01).r;
      noise = smoothstep(0.3, 0.7, noise) * 0.1;

      vec3 finalColor = baseColor + sheen;
      float finalAlpha = vOpacity * (1.0 - noise);

      gl_FragColor = vec4(finalColor, finalAlpha);
    }
  `
};
```

### React Component
```jsx
function NanotechGrid({ duration = 12 }) {
  const meshRef = useRef();
  const materialRef = useRef();

  // Generate instanced geometry
  const { geometry, instanceCount } = useMemo(() => {
    const cols = Math.ceil(window.innerWidth / 89.6) + 4;
    const rows = Math.ceil(window.innerHeight / 89.6) + 4;
    const count = cols * rows;

    // Chamfered square geometry
    const shape = new THREE.Shape();
    const s = 32; // half-size
    const c = 10; // chamfer
    shape.moveTo(-s + c, -s);
    shape.lineTo(s - c, -s);
    shape.lineTo(s, -s + c);
    shape.lineTo(s, s - c);
    shape.lineTo(s - c, s);
    shape.lineTo(-s + c, s);
    shape.lineTo(-s, s - c);
    shape.lineTo(-s, -s + c);
    shape.closePath();

    const geo = new THREE.ShapeGeometry(shape);
    const instancedGeo = new THREE.InstancedBufferGeometry();
    instancedGeo.copy(geo);

    // Instance attributes
    const offsets = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    const streams = new Float32Array(count);
    const rotations = new Float32Array(count);

    let i = 0;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        // Diagonal offset
        const x = col * 89.6 - window.innerWidth / 2;
        const y = row * 89.6 - window.innerHeight / 2;

        offsets[i * 3] = x;
        offsets[i * 3 + 1] = y;
        offsets[i * 3 + 2] = 0;

        // Phase based on diagonal position
        phases[i] = ((col + row) / (cols + rows)) + Math.random() * 0.02;

        // Alternate streams in checkerboard
        streams[i] = (col + row) % 2;

        // Random rotation jitter
        rotations[i] = (Math.random() - 0.5) * 6 * Math.PI / 180;

        i++;
      }
    }

    instancedGeo.setAttribute('instanceOffset',
      new THREE.InstancedBufferAttribute(offsets, 3));
    instancedGeo.setAttribute('instancePhase',
      new THREE.InstancedBufferAttribute(phases, 1));
    instancedGeo.setAttribute('instanceStream',
      new THREE.InstancedBufferAttribute(streams, 1));
    instancedGeo.setAttribute('instanceRotation',
      new THREE.InstancedBufferAttribute(rotations, 1));

    return { geometry: instancedGeo, instanceCount: count };
  }, []);

  // Animation loop
  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.elapsedTime % duration;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[geometry, null, instanceCount]}>
      <shaderMaterial
        ref={materialRef}
        attach="material"
        args={[gridShader]}
        uniforms={{
          uTime: { value: 0 },
          uLoopDuration: { value: duration },
          uColorGold: { value: new THREE.Color('#FF8A00') },
          uColorCyan: { value: new THREE.Color('#00E5FF') },
          uNormalMap: { value: null },
          uNoiseMap: { value: null }
        }}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </instancedMesh>
  );
}
```

### Full Scene with Post-Processing
```jsx
export default function NanotechBackground() {
  return (
    <Canvas
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 500], fov: 60 }}
      style={{ background: '#0B0C0E' }}
    >
      <NanotechGrid duration={12} />

      <EffectComposer>
        <Bloom
          intensity={0.35}
          luminanceThreshold={0.72}
          luminanceSmoothing={0.4}
          radius={0.4}
        />
        <Noise opacity={0.035} />
      </EffectComposer>
    </Canvas>
  );
}
```

---

## 10. AFTER EFFECTS / LOTTIE FALLBACK

### AE Project Structure
```
Composition: "Nanotech_Master" (1920×1080, 12s, 30fps)
├── Layer: "Grid_Base" (Shape Layer)
│   └── Repeater with diagonal offset
├── Layer: "Stream_A_Cyan" (Pre-comp)
│   └── Masked region with traveling matte
├── Layer: "Stream_B_Gold" (Pre-comp)
│   └── Masked region with traveling matte
├── Layer: "Nano_Flip_Zone" (Pre-comp)
│   └── 3D rotation animation (faked with scale/skew)
├── Layer: "Particles" (Shape Layer)
│   └── Particle emitter pre-comp
├── Layer: "Noise_Overlay" (Fractal Noise)
└── Layer: "Grain" (Add Grain effect)

Adjustment Layers:
├── "Bloom_Glow" - CC Radial Fast Blur + Blend Mode: Add
└── "Color_Grade" - Curves adjustment
```

### Bodymovin Export Steps
1. **Simplify for Lottie:**
   - Remove Fractal Noise (not supported) — use PNG sequence overlay
   - Convert 3D rotations to 2D skew transforms
   - Flatten particle layer to shape paths
   - Reduce grid density to 60% for performance

2. **Export Settings:**
   ```json
   {
     "version": "5.9.0",
     "exportMode": "standard",
     "compression": "gzip",
     "includeHiddenLayers": false,
     "originalAssets": false,
     "exportExpressions": true,
     "segmentedExport": false
   }
   ```

3. **Optimization:**
   - Target file size: < 800KB
   - Merge redundant shapes
   - Use shape morph instead of opacity keyframes where possible
   - Export at 30fps, let Lottie interpolate

### Lottie Fallback Limitations
| Feature | Full Version | Lottie Fallback |
|---------|--------------|-----------------|
| Loop duration | 12s | 6s (simplified) |
| Grid density | 100% | 60% |
| Nano-flip | 3D rotation | 2D skew fake |
| Particles | Dynamic burst | Static morph |
| Noise | Real-time | PNG overlay |
| Bloom | Selective | Global glow layer |

---

## 11. EXPORT ASSETS CHECKLIST

### Video Exports
| Asset | Resolution | Duration | Format | Codec | Notes |
|-------|------------|----------|--------|-------|-------|
| `nanotech_4k.webm` | 3840×2160 | 12s | WebM | VP9 | Primary, CRF 24 |
| `nanotech_1080.webm` | 1920×1080 | 12s | WebM | VP9 | Desktop fallback |
| `nanotech_1080.mp4` | 1920×1080 | 8s | MP4 | H.264 | Mobile, CRF 20 |
| `nanotech_alpha.webm` | 1920×1080 | 12s | WebM | VP9 | Alpha channel for overlay |

### Vector/Interactive Exports
| Asset | Format | Size | Notes |
|-------|--------|------|-------|
| `nanotech_fallback.json` | Lottie | <800KB | 6s simplified loop |
| `unit_chamfered.svg` | SVG | 2KB | Base unit shape |
| `unit_normal.png` | PNG | 64KB | 256×256 normal map |
| `noise_tile.png` | PNG | 128KB | 512×512 seamless |
| `sprite_sheet.png` | PNG | 1.2MB | 4×3 grid, 12 frames |

### Development Assets
| Asset | Format | Notes |
|-------|--------|-------|
| `tokens.json` | JSON | All color/motion tokens |
| `easing.js` | JS | Easing function library |
| `NanotechGrid.tsx` | TSX | React Three Fiber component |
| `nanotech.frag` | GLSL | Fragment shader |
| `nanotech.vert` | GLSL | Vertex shader |

---

## 12. CSS FALLBACK (Static Tile)

```css
.nanotech-bg {
  background-color: #0B0C0E;
  background-image:
    url('sprite_sheet.png'),
    linear-gradient(35deg,
      rgba(255, 138, 0, 0.03) 0%,
      transparent 40%,
      rgba(0, 229, 255, 0.02) 60%,
      transparent 100%
    );
  background-size: 400% 400%, cover;
  animation: nanotech-shift 12s linear infinite;
}

@keyframes nanotech-shift {
  0% { background-position: 0% 0%, center; }
  100% { background-position: 100% 100%, center; }
}

/* Reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  .nanotech-bg {
    animation: none;
    background-image: url('unit_chamfered.svg');
    background-size: 90px 90px;
    background-position: center;
  }
}
```

---

## 13. PREVIEW CHECKLIST

### Visual QA
- [ ] **Traces visible at 0s** — Faint gold filaments at 0.03 opacity
- [ ] **Growth smooth 0-6s** — No popping, cubic easing evident
- [ ] **Stepping stone at 6s** — Filaments at 0.18, defined but not bright
- [ ] **Particles appear 7.8s** — Subtle micro-sparks around units
- [ ] **Peak pop at 8.7s** — +18% brightness, bloom active, lines crisp
- [ ] **Nano-flip smooth** — No judder, 18° max, 280ms duration
- [ ] **Stream merge visible** — Cyan and gold interlock, flash subtle
- [ ] **Dome curvature** — Normal map shows subtle surface curve
- [ ] **Decay graceful 9.6-10.8s** — Bloom reduces, particles fade
- [ ] **Loop seamless** — No visible cut at 12s

### Technical QA
- [ ] **60fps desktop** — No frame drops on mid-range GPU
- [ ] **30fps mobile** — Smooth on 2-year-old flagship
- [ ] **Memory stable** — No growth over 10 loops
- [ ] **Bloom contained** — No bleed outside peak zone
- [ ] **Tiling invisible** — Per-instance offset prevents pattern repeat
- [ ] **Grain subtle** — Visible only on close inspection
- [ ] **Diagonal correct** — 35° angle consistent across viewport
- [ ] **Responsive** — Grid recalculates on resize

### Export QA
- [ ] **WebM loops** — Clean splice point at 12s
- [ ] **Lottie < 800KB** — Compressed JSON size
- [ ] **Alpha channel** — Transparent areas render correctly
- [ ] **Color accuracy** — #FF8A00 matches spec
- [ ] **No banding** — Gradients smooth in 8-bit exports

---

## 14. PERFORMANCE TARGETS

| Metric | Desktop | Mobile |
|--------|---------|--------|
| Target FPS | 60 | 30 |
| Max draw calls | 1 (instanced) | 1 |
| Max triangles | 50K | 20K |
| GPU memory | <128MB | <64MB |
| CPU (JS) | <5% | <10% |
| Lottie file | N/A | <800KB |
| First paint | <100ms | <200ms |

---

*Specification complete. All parameters production-ready. No clarifying questions required.*
