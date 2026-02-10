/**
 * Three.js Pseudo-Code: Nanotech Diagonal Pattern
 * Instanced geometry + vertex morph shader for nano flip/merge
 */

import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

// ============================================
// 1. GEOMETRY: Square with Diagonally Cut Corners
// ============================================

function createUnitGeometry() {
  // Octagon: 8 vertices forming square with cut corners
  const vertices = new Float32Array([
    // Corner cut positions (14% = 9px of 64px)
    9, 0, 0,    // Top-left start
    55, 0, 0,   // Top-right start
    64, 9, 0,   // Top-right corner cut
    64, 55, 0,  // Bottom-right start
    55, 64, 0,  // Bottom-right corner cut
    9, 64, 0,   // Bottom-left start
    0, 55, 0,   // Bottom-left corner cut
    0, 9, 0     // Top-left corner cut
  ]);

  // Create line loop (closed path)
  const indices = new Uint16Array([
    0, 1, 2, 3, 4, 5, 6, 7, 0  // Close the loop
  ]);

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  geometry.setIndex(new THREE.BufferAttribute(indices, 1));

  // Center geometry at origin
  geometry.translate(-32, -32, 0);

  return geometry;
}

// ============================================
// 2. INSTANCING MATRIX: Diagonal Grid Layout
// ============================================

function generateDiagonalGrid(canvasWidth, canvasHeight, unitWidth = 64) {
  const instances = [];
  const spacing = unitWidth * 1.4; // Center-to-center spacing
  const angle = 35 * (Math.PI / 180); // 35° diagonal

  // Grid bounds
  const cols = Math.ceil(canvasWidth / spacing) + 4;
  const rows = Math.ceil(canvasHeight / spacing) + 4;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // Base position
      const x = c * spacing;
      const y = r * spacing;

      // Calculate diagonal position (0 to 1, bottom-left → top-right)
      // For 35° angle: diag = ((height - y) + x * tan(35°)) / (height + width * tan(35°))
      const tan35 = Math.tan(angle);
      const diag = ((canvasHeight - y) + x * tan35) / (canvasHeight + canvasWidth * tan35);

      // Only render middle diagonal band (30%-70%)
      if (diag < 0.3 || diag > 0.7) continue;

      // Per-instance randomness
      const randomSeed = (r * cols + c) * 0.1;
      const rotationJitter = (Math.sin(randomSeed * 123.456) - 0.5) * 12 * (Math.PI / 180); // ±6°
      const posJitterX = (Math.sin(randomSeed * 78.912) - 0.5) * 8; // ±4px
      const posJitterY = (Math.cos(randomSeed * 45.678) - 0.5) * 8; // ±4px

      instances.push({
        position: new THREE.Vector3(x + posJitterX, y + posJitterY, 0),
        rotation: rotationJitter,
        diag, // Diagonal position (0.3 to 0.7)
        randomSeed,
        row: r,
        col: c
      });
    }
  }

  return instances;
}

// ============================================
// 3. INSTANCED MESH WITH CUSTOM ATTRIBUTES
// ============================================

function createInstancedMesh(instances) {
  const geometry = createUnitGeometry();
  const material = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      loopDuration: { value: 12.0 },
      primaryColor: { value: new THREE.Color(0xD77A00) },
      secondaryColor: { value: new THREE.Color(0x00E5FF) },
      tertiaryColor: { value: new THREE.Color(0x8AFFC1) }
    },
    vertexShader: VERTEX_SHADER,
    fragmentShader: FRAGMENT_SHADER,
    transparent: true,
    side: THREE.DoubleSide
  });

  const mesh = new THREE.InstancedMesh(geometry, material, instances.length);

  // Set instance matrices
  const matrix = new THREE.Matrix4();
  const quaternion = new THREE.Quaternion();
  const scale = new THREE.Vector3(1, 1, 1);

  // Custom attributes for morph and phase
  const diagValues = new Float32Array(instances.length);
  const randomSeeds = new Float32Array(instances.length);
  const morphToPositions = new Float32Array(instances.length * 3);
  const morphFromPositions = new Float32Array(instances.length * 3);

  instances.forEach((inst, i) => {
    // Set transformation matrix
    quaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), inst.rotation);
    matrix.compose(inst.position, quaternion, scale);
    mesh.setMatrixAt(i, matrix);

    // Set custom attributes
    diagValues[i] = inst.diag;
    randomSeeds[i] = inst.randomSeed;

    // Morph targets (for nano flip/merge)
    morphToPositions[i * 3] = inst.position.x;
    morphToPositions[i * 3 + 1] = inst.position.y;
    morphToPositions[i * 3 + 2] = inst.position.z;

    morphFromPositions[i * 3] = inst.position.x;
    morphFromPositions[i * 3 + 1] = inst.position.y;
    morphFromPositions[i * 3 + 2] = inst.position.z;
  });

  geometry.setAttribute('diag', new THREE.InstancedBufferAttribute(diagValues, 1));
  geometry.setAttribute('randomSeed', new THREE.InstancedBufferAttribute(randomSeeds, 1));
  geometry.setAttribute('morphto', new THREE.InstancedBufferAttribute(morphToPositions, 3));
  geometry.setAttribute('morphfrom', new THREE.InstancedBufferAttribute(morphFromPositions, 3));

  mesh.instanceMatrix.needsUpdate = true;

  return mesh;
}

// ============================================
// 4. VERTEX SHADER: Phase Calculation + Morph
// ============================================

const VERTEX_SHADER = `
uniform float time;
uniform float loopDuration;

attribute float diag;
attribute float randomSeed;
attribute vec3 morphto;
attribute vec3 morphfrom;

varying float vPhase;
varying float vOpacity;
varying float vBloom;
varying vec3 vColor;

// Phase calculation based on timing_chart.json
float getPhase(float t, float diagPos) {
  // Normalize time to 0-1
  float loopProgress = mod(t / loopDuration, 1.0);

  // Diagonal offset: normalize diag from 0.3-0.7 to 0-1
  float normalizedDiag = (diagPos - 0.3) / 0.4;

  // Cell's animation position relative to sweeping wave
  float cellPhase = mod(loopProgress + normalizedDiag, 1.0);

  return cellPhase;
}

// Opacity curve based on phase
float getOpacity(float phase) {
  if (phase < 0.5) {
    // 0-50%: Faint traces (0.03 → 0.18)
    return 0.03 + (phase / 0.5) * 0.15;
  } else if (phase < 0.65) {
    // 50-65%: Stepping-stone (0.4 → 0.6)
    float localProgress = (phase - 0.5) / 0.15;
    return 0.4 + localProgress * 0.2;
  } else if (phase < 0.8) {
    // 65-80%: Peak zone (0.85 → 1.0)
    float localProgress = (phase - 0.65) / 0.15;
    return 0.85 + localProgress * 0.15;
  } else if (phase < 0.9) {
    // 80-90%: Decay (0.9 → 0.5)
    float localProgress = (phase - 0.8) / 0.1;
    return 0.9 - localProgress * 0.4;
  } else {
    // 90-100%: Die (0.25 → 0.03)
    float localProgress = (phase - 0.9) / 0.1;
    return 0.25 - localProgress * 0.22;
  }
}

// Nano flip/merge transformation
mat4 getNanoFlipTransform(float phase) {
  // Trigger at 72% (8.64s) for 0.3s duration
  float flipStart = 0.72;
  float flipEnd = 0.745; // 72% + (0.3s / 12s)

  if (phase >= flipStart && phase <= flipEnd) {
    float flipProgress = (phase - flipStart) / (flipEnd - flipStart);

    // Rotation: 0 → 18° → 0°
    float rotation = sin(flipProgress * 3.14159) * 18.0 * (3.14159 / 180.0);
    float cosR = cos(rotation);
    float sinR = sin(rotation);

    // Horizontal compression: 1.0 → 0.7 → 1.0
    float scaleX = 1.0 - sin(flipProgress * 3.14159) * 0.3;

    return mat4(
      cosR * scaleX, sinR, 0.0, 0.0,
      -sinR, cosR, 0.0, 0.0,
      0.0, 0.0, 1.0, 0.0,
      0.0, 0.0, 0.0, 1.0
    );
  }

  return mat4(1.0); // Identity matrix
}

void main() {
  // Calculate phase
  vPhase = getPhase(time, diag);
  vOpacity = getOpacity(vPhase);

  // Bloom intensity (only in peak zone)
  vBloom = (vPhase >= 0.65 && vPhase <= 0.8) ? 1.0 : 0.0;

  // Apply nano flip transformation
  mat4 flipTransform = getNanoFlipTransform(vPhase);
  vec4 transformedPosition = flipTransform * vec4(position, 1.0);

  // Vertex morph blend (if needed for merge)
  float morphBlend = 0.0;
  if (vPhase >= 0.72 && vPhase <= 0.745) {
    morphBlend = sin((vPhase - 0.72) / 0.025 * 3.14159) * 0.5;
  }
  vec3 morphedPos = mix(transformedPosition.xyz, morphto, morphBlend);

  // Final position
  vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(morphedPos, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  // Color variation
  vColor = mix(vec3(0.84, 0.48, 0.0), vec3(0.0, 0.9, 1.0), randomSeed);
}
`;

// ============================================
// 5. FRAGMENT SHADER: Color + Glow
// ============================================

const FRAGMENT_SHADER = `
uniform vec3 primaryColor;
uniform vec3 secondaryColor;
uniform vec3 tertiaryColor;

varying float vPhase;
varying float vOpacity;
varying float vBloom;
varying vec3 vColor;

void main() {
  // Base color blend
  vec3 color = mix(primaryColor, secondaryColor, vColor.b);

  // Add bloom glow in peak zone
  if (vBloom > 0.5) {
    color = mix(color, vec3(1.0), vBloom * 0.3);
  }

  // Apply opacity
  gl_FragColor = vec4(color, vOpacity);
}
`;

// ============================================
// 6. ANIMATION LOOP + POST-PROCESSING
// ============================================

function setupScene(canvasWidth, canvasHeight) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0B0C0E);

  const camera = new THREE.OrthographicCamera(
    0, canvasWidth,
    canvasHeight, 0,
    -1000, 1000
  );
  camera.position.z = 100;

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(canvasWidth, canvasHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Generate instances
  const instances = generateDiagonalGrid(canvasWidth, canvasHeight);
  const mesh = createInstancedMesh(instances);
  scene.add(mesh);

  // Post-processing: Selective bloom
  const composer = new EffectComposer(renderer);
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(canvasWidth, canvasHeight),
    0.6,  // Bloom intensity
    0.4,  // Bloom radius
    0.85  // Bloom threshold
  );
  composer.addPass(bloomPass);

  // Animation loop
  const startTime = Date.now();
  function animate() {
    requestAnimationFrame(animate);

    const elapsed = (Date.now() - startTime) / 1000;
    mesh.material.uniforms.time.value = elapsed;

    composer.render();
  }

  animate();

  return { scene, camera, renderer, mesh };
}

// ============================================
// 7. INSTANCING RULES (SIMPLIFIED)
// ============================================

/**
 * INSTANCING RULES:
 *
 * 1. Grid generation: Iterate rows/cols with spacing = unitWidth * 1.4
 * 2. Diagonal calculation: diag = ((height - y) + x * tan(35°)) / (height + width * tan(35°))
 * 3. Filter: Only render if 0.3 ≤ diag ≤ 0.7
 * 4. Randomness: rotation = sin(seed * 123.456) * 12° (±6°)
 * 5. Position jitter: ±4px in X and Y using different seeds
 * 6. Phase offset: Each instance's timeline offset = normalized diag position (0-1)
 * 7. Morph attributes: Store original + target positions for nano flip blend
 *
 * PERFORMANCE:
 * - Desktop: 80-150 instances, bloom enabled
 * - Mobile: 40-80 instances, bloom disabled, consider Lottie fallback
 */

export { createUnitGeometry, generateDiagonalGrid, createInstancedMesh, setupScene };
