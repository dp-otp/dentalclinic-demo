# HERO CINEMATIC — DEEP TECHNICAL SPECIFICATION

---

## THE NARRATIVE IN FRAMES

This is cinema, compressed into 4.5 seconds.

```
═══════════════════════════════════════════════════════════════════════════════

  FRAME 1                    FRAME 2                    FRAME 3
  "The Arrival"              "The Pause"                "The Reveal"

      ╱──╲                       ╱──╲                      ╱    ╲
     ╱    ╲                     ╱    ╲                    │      │
    │ ═══  │ ─────────────►   │ ═══  │ ─────────────►   │  ◯◯  │
     ╲    ╱   (750ms)          ╲    ╱   (1200ms)         ╲    ╱
      ╲──╱                       ╲──╱                       ╲──╱
                                   ↕ breathe

  Parcel flies in             Parcel hovers,            Lid opens,
  from camera depth           subtle breathing          warmth glows
                              motion                    from inside

═══════════════════════════════════════════════════════════════════════════════

  FRAME 4                    FRAME 5
  "The Portal"               "The Interface"

         ╱╲                       ┌─────────────────┐
        ╱  ╲                      │ Ship Smarter.   │
       │ ◉  │ ─────────────►     │ Scale Faster.   │
        ╲  ╱    (350ms)          │                 │
         ╲╱                       │ [Start Free]   │
                                  └─────────────────┘
       ↑
  Camera enters               Globe fades,
  the parcel,                 text reveals
  globe appears

═══════════════════════════════════════════════════════════════════════════════
```

---

## DETAILED TIMELINE

### Master Timeline (4500ms total)

| Time (ms) | Event | Duration | Easing |
|-----------|-------|----------|--------|
| 0 | Sequence begins, parcel offscreen (z: -200) | — | — |
| 0–750 | Parcel enters frame | 750ms | `cubic-bezier(0.16, 0.84, 0.32, 1)` |
| 750–1950 | Parcel hovers, breathing | 1200ms | `sine` wave |
| 1950–2350 | Lid opens | 400ms | `cubic-bezier(0.34, 1.56, 0.64, 1)` |
| 2100 | Interior glow begins (during lid open) | 600ms | `ease-out` |
| 2350–2700 | Camera zooms into parcel | 350ms | `cubic-bezier(0.22, 0.9, 0.29, 1)` |
| 2700 | Globe appears (instant, was hidden) | — | — |
| 2700–3200 | Globe fade-in + rotation begins | 500ms | `ease-out` |
| 3200–3500 | Globe begins fade-out | 300ms | `ease-in` |
| 3200–4200 | Text elements stagger in | 1000ms | `cubic-bezier(0.16, 1, 0.3, 1)` |
| 4200 | Hero fully interactive | — | — |

---

## PARCEL OBJECT SPECIFICATION

### Geometry

```
Type: Beveled Box (rounded edges)
Dimensions: 1.0 × 1.0 × 0.6 (width × depth × height, closed)
Bevel radius: 0.03
Segments: 4 (low for performance)
```

### Material Stack

**Body (Matte Carbon Black):**
```javascript
{
  color: 0x0A0A0A,
  metalness: 0.05,
  roughness: 0.85,
  envMapIntensity: 0.3,
  // Micro-scratch texture via normal map
  normalMap: scratchNormalTexture,
  normalScale: new THREE.Vector2(0.15, 0.15)
}
```

**Embossed Logo (Metallic Gold):**
```javascript
{
  color: 0xD77A00,
  metalness: 0.9,
  roughness: 0.25,
  emissive: 0xD77A00,
  emissiveIntensity: 0.15,
  // Sits 0.005 units above body surface
}
```

**Interior (Warm Glow Surface):**
```javascript
{
  color: 0x1A1A1A,
  emissive: 0xD77A00,
  emissiveIntensity: 0,  // Animated to 0.4 during reveal
  roughness: 0.9
}
```

### Animation Values

**Entry (0–750ms):**
```javascript
position: {
  start: { x: 0, y: 0, z: -8 },
  end: { x: 0, y: 0, z: 0 }
}
rotation: {
  start: { x: deg(-15), y: deg(25), z: deg(5) },
  end: { x: deg(0), y: deg(12), z: deg(0) }
}
scale: {
  start: 0.6,
  end: 1.0
}
```

**Breathing (750–1950ms):**
```javascript
// Continuous sine wave
scale: 1.0 + Math.sin(time * 2) * 0.006  // ±0.6% scale
rotation.y: 12 + Math.sin(time * 1.5) * 2  // ±2° gentle sway
position.y: Math.sin(time * 2) * 0.02  // ±0.02 units vertical bob
```

**Lid Open (1950–2350ms):**
```javascript
// Lid is separate mesh, pivots from back edge
lid.rotation.x: {
  start: 0,
  end: deg(-110)  // Opens past 90° for dramatic effect
}
// Easing includes slight overshoot for satisfying "pop"
```

---

## GLOBE SPECIFICATION

### Geometry Approach

**Type:** Procedural wireframe icosphere
**Why:** Lightweight, scalable, no GLTF dependency

```javascript
// Generate vertices for wireframe globe
const geometry = new THREE.IcosahedronGeometry(1.5, 2);
const wireframe = new THREE.WireframeGeometry(geometry);

// Use LineSegments for clean lines
const globe = new THREE.LineSegments(
  wireframe,
  new THREE.ShaderMaterial({
    // Custom shader for glow effect
    vertexShader: globeVertexShader,
    fragmentShader: globeFragmentShader,
    transparent: true,
    uniforms: {
      uTime: { value: 0 },
      uOpacity: { value: 0 },
      uColorA: { value: new THREE.Color(0xD77A00) },  // Warm orange
      uColorB: { value: new THREE.Color(0x4ECDC4) },  // Cool cyan
    }
  })
);
```

### Shader (Fragment)

```glsl
// globeFragmentShader.glsl
uniform float uTime;
uniform float uOpacity;
uniform vec3 uColorA;
uniform vec3 uColorB;
varying vec3 vPosition;

void main() {
  // Fresnel-like effect based on position
  float fresnel = pow(1.0 - abs(dot(normalize(vPosition), vec3(0.0, 0.0, 1.0))), 1.5);

  // Mix warm and cool based on fresnel
  vec3 color = mix(uColorA, uColorB, fresnel * 0.6);

  // Pulsing glow
  float pulse = 0.8 + sin(uTime * 2.0) * 0.2;

  // Final color with opacity
  gl_FragColor = vec4(color * pulse, uOpacity * (0.7 + fresnel * 0.3));
}
```

### Animation Values

```javascript
// Rotation (continuous after appear)
rotation.y: time * 0.02  // ~1.15 degrees per second

// Fade in (2700–3200ms)
opacity: { start: 0, end: 0.9 }

// Fade out (3200–3500ms)
opacity: { start: 0.9, end: 0 }

// Scale during fade out (subtle shrink)
scale: { start: 1.0, end: 0.85 }
```

---

## CAMERA CHOREOGRAPHY

### Initial Position
```javascript
{
  position: { x: 0, y: 0.2, z: 5 },
  fov: 45,
  lookAt: { x: 0, y: 0, z: 0 }
}
```

### During Parcel Hover (750–1950ms)
```javascript
// Subtle parallax with mouse/touch
const parallaxX = mouseX * 0.3;
const parallaxY = mouseY * 0.15;
camera.position.x = parallaxX;
camera.position.y = 0.2 + parallaxY;
// lookAt remains centered
```

### Zoom Into Parcel (2350–2700ms)
```javascript
{
  position: {
    start: { x: 0, y: 0.2, z: 5 },
    end: { x: 0, y: 0, z: 0.3 }  // Very close, inside the box
  },
  fov: {
    start: 45,
    end: 75  // Wider FOV for "entering" effect
  }
}
// Easing: cubic-bezier(0.22, 0.9, 0.29, 1)
```

### Post-Zoom (2700ms+)
```javascript
// Camera holds, globe is visible
// Slight drift continues with mouse parallax (reduced intensity)
```

---

## LIGHTING SETUP

### Ambient
```javascript
{
  type: 'AmbientLight',
  color: 0x404040,
  intensity: 0.4
}
```

### Key Light (Main)
```javascript
{
  type: 'SpotLight',
  position: { x: 5, y: 5, z: 5 },
  color: 0xFFC57A,  // Warm amber
  intensity: 0.8,
  angle: Math.PI / 6,
  penumbra: 0.5,
  castShadow: false  // Performance
}
```

### Fill Light
```javascript
{
  type: 'PointLight',
  position: { x: -3, y: 2, z: 3 },
  color: 0x4ECDC4,  // Cool cyan
  intensity: 0.3
}
```

### Interior Light (Animated)
```javascript
{
  type: 'PointLight',
  position: { x: 0, y: -0.1, z: 0 },  // Inside parcel
  color: 0xD77A00,
  intensity: 0,  // Animates to 2.0 during lid open
  distance: 2,
  decay: 2
}
```

---

## POST-PROCESSING STACK

### Effect Order (Critical)

1. **Bloom** (selective, luminance-based)
2. **Depth of Field** (subtle, cinematic)
3. **Film Grain** (very subtle, premium texture)
4. **Vignette** (frames the composition)
5. **Tone Mapping** (ACES Filmic)

### Bloom Settings
```javascript
{
  luminanceThreshold: 0.7,
  luminanceSmoothing: 0.3,
  intensity: 0.35,
  radius: 0.85,
  // Only affects emissive materials (logo, interior glow, globe)
}
```

### Depth of Field Settings
```javascript
{
  focusDistance: 0.02,  // Focus on parcel
  focalLength: 0.05,
  bokehScale: 2.5,
  // Creates soft blur on edges, keeps parcel sharp
}
```

### Film Grain Settings
```javascript
{
  opacity: 0.03,  // Very subtle
  luminanceCenter: 0.5,
  animated: true
}
```

### Vignette Settings
```javascript
{
  darkness: 0.45,
  offset: 0.35,
  // Soft falloff, not harsh
}
```

---

## FALLBACK STRATEGY

### Decision Tree

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  User arrives at page                                           │
│           │                                                     │
│           ▼                                                     │
│  ┌─────────────────┐                                           │
│  │ WebGL supported? │                                          │
│  └────────┬────────┘                                           │
│           │                                                     │
│     Yes   │   No                                                │
│     │     └──────────────► Serve MP4/WebM video                │
│     │                                                           │
│     ▼                                                           │
│  ┌─────────────────┐                                           │
│  │ GPU tier check  │                                           │
│  │ (detect-gpu)    │                                           │
│  └────────┬────────┘                                           │
│           │                                                     │
│   Tier 2+ │   Tier 0-1                                         │
│     │     └──────────────► Serve Lottie animation              │
│     │                                                           │
│     ▼                                                           │
│  ┌─────────────────┐                                           │
│  │ Reduced motion? │                                           │
│  └────────┬────────┘                                           │
│           │                                                     │
│    No     │   Yes                                               │
│     │     └──────────────► Static hero image                   │
│     │                                                           │
│     ▼                                                           │
│  Full 3D Experience                                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Video Fallback Specification

**Format:** MP4 (H.264 primary) + WebM (VP9 fallback)
**Resolution:** 1080p (scales down responsively)
**Duration:** 4.5s (matches 3D timeline exactly)
**File Size Target:** <2MB (MP4), <1.5MB (WebM)
**Audio:** None
**Loop:** No (plays once, holds on final frame)

### Lottie Fallback Specification

**Duration:** 4.5s
**Frame Rate:** 30fps
**File Size Target:** <400KB
**Contains:** Simplified 2D parcel animation, no globe
**Holds:** On final frame with static representation

### Static Image Fallback

**Format:** WebP with PNG fallback
**Resolution:** 1440×900 (desktop), 750×1000 (mobile)
**Content:** Final frame of animation — parcel open, warm glow, text visible

---

## MOBILE ADAPTATION

### Performance Budget

| Metric | Target |
|--------|--------|
| JavaScript | <150KB (3D code split) |
| Initial render | <300ms |
| Animation FPS | 60fps (drop to Lottie if <45fps) |
| Memory | <100MB GPU |

### Mobile-Specific Adjustments

```javascript
// Detect mobile
const isMobile = window.innerWidth < 768;

if (isMobile) {
  // Reduce geometry detail
  icosahedronDetail = 1;  // Instead of 2

  // Disable post-processing except vignette
  bloom.enabled = false;
  dof.enabled = false;
  grain.enabled = false;

  // Reduce shadow quality (if any)
  shadowMapSize = 512;  // Instead of 1024

  // Simpler parcel (no normal map)
  parcelMaterial.normalMap = null;

  // Touch parallax instead of mouse
  // Reduced parallax intensity (50% of desktop)
}
```

### Touch Parallax

```javascript
// On mobile, use device orientation OR touch drag
window.addEventListener('deviceorientation', (e) => {
  const x = e.gamma / 45;  // -1 to 1
  const y = e.beta / 45;   // -1 to 1
  parallaxTarget.x = x * 0.15;  // Reduced intensity
  parallaxTarget.y = y * 0.1;
});
```

---

## IMPLEMENTATION IN FRAMER

### Code Component Structure

```
/code-components/
├── HeroCinematic/
│   ├── index.tsx           ← Main component
│   ├── Parcel.tsx          ← Parcel mesh + animations
│   ├── Globe.tsx           ← Globe wireframe + shader
│   ├── shaders/
│   │   ├── globe.vert
│   │   └── globe.frag
│   ├── hooks/
│   │   ├── useTimeline.ts  ← Animation orchestration
│   │   └── useParallax.ts  ← Mouse/touch tracking
│   └── fallbacks/
│       ├── VideoFallback.tsx
│       └── LottieFallback.tsx
```

### Framer Properties (Exposed)

```typescript
interface HeroCinematicProps {
  // Timing
  autoPlay: boolean;         // default: true
  delay: number;             // default: 0ms (wait before starting)

  // Colors
  parcelColor: string;       // default: "#0A0A0A"
  accentColor: string;       // default: "#D77A00"
  globeColorA: string;       // default: "#D77A00"
  globeColorB: string;       // default: "#4ECDC4"

  // Behavior
  enableParallax: boolean;   // default: true
  fallbackMode: "auto" | "video" | "lottie" | "static";

  // Callbacks
  onSequenceStart?: () => void;
  onSequenceEnd?: () => void;
}
```

---

## ASSETS TO CREATE

| Asset | Format | Dimensions | Notes |
|-------|--------|------------|-------|
| `parcel-normal.png` | PNG | 512×512 | Micro-scratch normal map |
| `wooparcel-logo.svg` | SVG | — | Monogram for emboss |
| `hero-fallback.mp4` | MP4 | 1920×1080 | H.264, <2MB |
| `hero-fallback.webm` | WebM | 1920×1080 | VP9, <1.5MB |
| `hero-fallback.json` | Lottie | — | <400KB |
| `hero-static-desktop.webp` | WebP | 1440×900 | Final frame |
| `hero-static-mobile.webp` | WebP | 750×1000 | Final frame, cropped |
| `environment.hdr` | HDR | 512×512 | Minimal HDRI for reflections |

---

## QUALITY CHECKLIST

Before considering this complete:

- [ ] 60fps on M1 MacBook Air (Safari)
- [ ] 60fps on iPhone 13 (Safari)
- [ ] 60fps on Samsung Galaxy S21 (Chrome)
- [ ] 60fps on 2020 Windows laptop (Chrome)
- [ ] Fallback triggers correctly on iPad Mini (older)
- [ ] No visible texture pop-in
- [ ] No frame drops during lid open
- [ ] Camera zoom feels smooth, not jarring
- [ ] Globe appears seamlessly (no flash)
- [ ] Text reveal timing feels natural
- [ ] Parallax response is immediate, not laggy
- [ ] Total JS bundle <200KB gzipped
- [ ] Time to first frame <500ms

---

**Next Document:** `03-services-page.md` — Interactive service grid specification
