alert("JS IS RUNNING");

import * as THREE from "https://cdn.skypack.dev/three@0.152.2";
import { EffectComposer } from "https://cdn.skypack.dev/three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "https://cdn.skypack.dev/three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "https://cdn.skypack.dev/three/examples/jsm/postprocessing/UnrealBloomPass.js";

const vertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
precision highp float;

varying vec2 vUv;
uniform float uTime;
uniform float uBuildProgress;

float hex(vec2 p) {
  p = abs(p);
  return max(dot(p, normalize(vec2(1.0, 1.732))), p.x);
}

float hexGrid(vec2 uv) {
  uv *= 12.0;
  vec2 r = vec2(1.0, 1.732);
  vec2 h = r * 0.5;

  vec2 a = mod(uv, r) - h;
  vec2 b = mod(uv - h, r) - h;

  vec2 gv = length(a) < length(b) ? a : b;
  return hex(gv);
}

void main() {
  vec2 uv = vUv;
  vec2 centered = uv - 0.5;

  // Diagonal wave (bottom-left → top-right)
  float wave = centered.x + centered.y + 1.0;
  float buildMask = smoothstep(
    uBuildProgress - 0.15,
    uBuildProgress + 0.05,
    wave
  );

  float grid = hexGrid(uv);

  // Layer 1: Primary line with continuous tracing motion
  float trace1 = sin(uTime * 1.5 + grid * 15.0) * 0.02;
  float line1 = smoothstep(0.05, 0.0, abs(grid - 0.5 + trace1));
  float pulse1 = sin(uTime * 3.0 + grid * 20.0) * 0.5 + 0.5;

  // Layer 2: Secondary line (offset distance, independent phase, 60% opacity)
  float trace2 = sin(uTime * 2.2 + grid * 12.0 + 3.14) * 0.015;
  float line2 = smoothstep(0.06, 0.01, abs(grid - 0.48 + trace2));
  float pulse2 = sin(uTime * 2.5 + grid * 18.0 + 1.57) * 0.5 + 0.5;

  vec3 colorA = vec3(0.0, 0.4, 0.6);
  vec3 colorB = vec3(0.2, 1.0, 0.9);

  vec3 color1 = mix(colorA, colorB, pulse1);
  vec3 color2 = mix(colorA, colorB, pulse2 * 0.7);

  float intensity1 = line1 * buildMask;
  float intensity2 = line2 * buildMask * 0.6;

  vec3 finalColor = (color1 * intensity1 * 6.0) + (color2 * intensity2 * 4.0);
  float totalIntensity = max(intensity1, intensity2 * 0.6);

  gl_FragColor = vec4(finalColor, totalIntensity);
}
`;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.z = 6;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor(0xff0000);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);

// Composer (HDR Glow)
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const bloom = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  2.5,   // strength (EXTREME glow)
  0.9,   // radius
  0.1    // threshold
);
composer.addPass(bloom);

// Geometry
const geometry = new THREE.PlaneGeometry(8, 5, 300, 200);

const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    uBuildProgress: { value: 0 }
  },
  transparent: true
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Animation
let start = performance.now();

function animate(t) {
  requestAnimationFrame(animate);

  const time = (t - start) * 0.001;
  material.uniforms.uTime.value = time;

  // ONE-WAY BUILD (0 → 1)
  material.uniforms.uBuildProgress.value = Math.min(time * 0.25, 1);

  composer.render();
}

animate();

// Resize
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
