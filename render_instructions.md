# Render Instructions — WebM/Lottie/Fallback Generation

## 1. WebM Video Loop (1080p, 12-Second)

### Prerequisites

- Node.js with Three.js installed
- FFmpeg (for video encoding)
- `threejs_pseudocode.js` implementation completed
- GPU with WebGL 2.0 support

### Step 1: Three.js Frame Capture Setup

```javascript
// Add to setupScene() function in threejs_pseudocode.js

import { createCanvas } from 'canvas';
import fs from 'fs';

const captureFrames = true;
const frameDirectory = './frames_webm/';
const fps = 60;
const duration = 12.0;
const totalFrames = fps * duration; // 720 frames

let frameCount = 0;

function captureFrame(renderer) {
  if (!captureFrames || frameCount >= totalFrames) return;

  const canvas = renderer.domElement;
  const dataURL = canvas.toDataURL('image/png');
  const base64Data = dataURL.replace(/^data:image\/png;base64,/, '');

  const filename = `${frameDirectory}frame_${String(frameCount).padStart(5, '0')}.png`;
  fs.writeFileSync(filename, base64Data, 'base64');

  frameCount++;

  if (frameCount >= totalFrames) {
    console.log('Frame capture complete. Run FFmpeg encoding.');
    process.exit(0);
  }
}

// In animation loop:
function animate() {
  // ... existing render code ...

  composer.render();
  captureFrame(renderer);

  if (frameCount < totalFrames) {
    requestAnimationFrame(animate);
  }
}
```

### Step 2: FFmpeg Encoding (WebM VP9)

```bash
# Create frames directory
mkdir frames_webm

# Run Three.js frame capture (headless)
node --experimental-modules render_frames.js

# Encode to WebM with VP9 codec (recommended for web)
ffmpeg -r 60 -i frames_webm/frame_%05d.png \
  -c:v libvpx-vp9 \
  -pix_fmt yuva420p \
  -b:v 2M \
  -crf 30 \
  -row-mt 1 \
  -auto-alt-ref 1 \
  -lag-in-frames 25 \
  -g 240 \
  -metadata:s:v:0 loop=1 \
  -vf "scale=1920:1080:flags=lanczos" \
  nanotech_loop_1080p.webm

# Alternative: H.264 MP4 for broader compatibility
ffmpeg -r 60 -i frames_webm/frame_%05d.png \
  -c:v libx264 \
  -pix_fmt yuv420p \
  -preset slow \
  -crf 22 \
  -movflags +faststart \
  -vf "scale=1920:1080:flags=lanczos" \
  nanotech_loop_1080p.mp4
```

### Step 3: Verify Loop Seamlessness

```bash
# Play loop 3 times to check for seams
ffplay -loop 3 nanotech_loop_1080p.webm

# If seam is visible, adjust timing_chart.json fade-out curve
```

### Recommended Post-Processing Parameters

- **Resolution**: 1920×1080 (Full HD)
- **Codec**: VP9 (WebM) or H.264 (MP4)
- **Bitrate**: 2-3 Mbps (VP9) or 4-6 Mbps (H.264)
- **CRF**: 28-32 (VP9) or 20-24 (H.264)
- **Framerate**: 60fps (desktop) or 30fps (mobile)
- **Color space**: yuva420p (for transparency) or yuv420p
- **Loop metadata**: Set loop=1 in WebM container

---

## 2. Lottie JSON Export (AfterEffects → Bodymovin)

### Prerequisites

- Adobe After Effects CC 2019 or later
- Bodymovin plugin (Lottie export) installed
- `unit_almost_hex.svg` imported as shape layer

### Step 1: After Effects Composition Setup

1. **Create new composition**:
   - Name: `Nanotech_Diagonal_Mobile`
   - Width: 1080px, Height: 1920px (mobile portrait)
   - Duration: 6 seconds (simplified loop)
   - Frame rate: 30fps

2. **Import SVG unit**:
   - File → Import → `unit_almost_hex.svg`
   - Convert to shape layer: Layer → Create → Create Shapes from Vector Layer

3. **Create diagonal grid**:
   - Duplicate shape layer 12-20 times
   - Position along diagonal axis (spacing ≈90px)
   - Apply rotation jitter: -6° to +6° per instance

### Step 2: Animate Phases

**Layer 1 (Bottom-right unit)**:

- **Opacity keyframes**:
  - 0s: 3%
  - 3s: 60% (stepping-stone)
  - 4.8s: 100% (peak)
  - 6s: 3% (loop reset)

- **Stroke width keyframes**:
  - 0s: 1px
  - 3s: 1.6px
  - 4.8s: 2.3px
  - 6s: 1px

- **Effects**:
  - Add Glow effect (Effect → Stylize → Glow)
  - Glow Threshold: 20
  - Glow Radius: Animate 2px → 8px → 2px
  - Glow Intensity: Animate 0.2 → 1.0 → 0.2

**Nano Flip (4.3-4.6s)**:

- **Rotation keyframes**:
  - 4.3s: 0°
  - 4.45s: 18°
  - 4.6s: 0°
  - Easing: Easy Ease In/Out

- **Scale keyframes** (horizontal):
  - 4.3s: 100%
  - 4.45s: 70%
  - 4.6s: 100%

**Layers 2-12**:

- Offset all keyframes by `layer_index × 0.3s`
- Top-left units start animation later

### Step 3: Bodymovin Export

1. **Open Bodymovin panel**:
   - Window → Extensions → Bodymovin

2. **Export settings**:
   - Select composition: `Nanotech_Diagonal_Mobile`
   - Destination: `lottie_fallback.json`
   - Settings:
     - ☑ Glyphs
     - ☑ Hidden layers
     - ☑ Guided layers
     - ☑ Expressions
     - ☐ Extra comps (disable)
     - Compression: High

3. **Render**:
   - Click "Render" button
   - Wait for export completion
   - Verify JSON file size < 500KB

### Step 4: Test Lottie Playback

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.9.6/lottie.min.js"></script>
</head>
<body>
  <div id="lottie-container" style="width: 1080px; height: 1920px;"></div>

  <script>
    const animation = lottie.loadAnimation({
      container: document.getElementById('lottie-container'),
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: 'lottie_fallback.json'
    });
  </script>
</body>
</html>
```

---

## 3. CSS Fallback Tile (Static SVG)

### Purpose

Graceful degradation for browsers that don't support WebGL, Lottie, or video.

### Implementation

See `css_fallback_tile.svg` for static diagonal tile pattern.

**CSS Animation**:

```css
.nanotech-fallback {
  width: 100%;
  height: 100vh;
  background: #0B0C0E url('css_fallback_tile.svg') repeat;
  background-size: 200px 200px;
  animation: diagonal-slide 24s linear infinite;
}

@keyframes diagonal-slide {
  from {
    background-position: 0 0;
  }
  to {
    background-position: 200px 200px;
  }
}
```

This creates a sliding diagonal effect without requiring JavaScript.

---

## 4. Fallback Detection & Loading

### JavaScript Detection Logic

```javascript
// Detect capabilities and load appropriate format
function loadNanotechPattern() {
  const container = document.getElementById('nanotech-container');

  // Test 1: WebGL support (Three.js)
  const canvas = document.createElement('canvas');
  const webglSupported = !!(
    canvas.getContext('webgl') ||
    canvas.getContext('experimental-webgl')
  );

  // Test 2: Performance (FPS estimation)
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  const isLowPower = navigator.hardwareConcurrency < 4;

  if (webglSupported && !isMobile && !isLowPower) {
    // Load Three.js instanced rendering
    loadThreeJSPattern(container);
  } else if ('requestAnimationFrame' in window) {
    // Load Lottie fallback
    loadLottiePattern(container);
  } else {
    // Load video fallback
    loadVideoPattern(container);
  }
}

function loadThreeJSPattern(container) {
  import('./threejs_pseudocode.js').then(module => {
    module.setupScene(container.offsetWidth, container.offsetHeight);
  });
}

function loadLottiePattern(container) {
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.9.6/lottie.min.js';
  script.onload = () => {
    lottie.loadAnimation({
      container,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: 'lottie_fallback.json'
    });
  };
  document.head.appendChild(script);
}

function loadVideoPattern(container) {
  const video = document.createElement('video');
  video.src = 'nanotech_loop_1080p.webm';
  video.loop = true;
  video.autoplay = true;
  video.muted = true;
  video.playsInline = true;
  video.style.width = '100%';
  video.style.height = '100%';
  video.style.objectFit = 'cover';
  container.appendChild(video);
}

// Run on page load
window.addEventListener('DOMContentLoaded', loadNanotechPattern);
```

---

## 5. Optimization Checklist

### Before Rendering

- [ ] Verify `timing_chart.json` phase timings are correct
- [ ] Test Three.js animation in browser (60fps target)
- [ ] Confirm diagonal flow direction (bottom-right → top-left)
- [ ] Check nano flip timing (72% mark, 0.3s duration)
- [ ] Validate color palette (#D77A00, #00E5FF, #8AFFC1)

### After Rendering

- [ ] WebM file size < 5MB for 12-second loop
- [ ] Lottie JSON file size < 500KB
- [ ] Loop is seamless (no visible seam at t=12.0s)
- [ ] Bloom effect is selective, not full-screen
- [ ] Mobile playback is smooth (30fps minimum)
- [ ] Video has correct metadata (`loop=1`)

---

## 6. Troubleshooting

### Issue: Frame capture is slow

**Solution**: Use headless rendering with `node-canvas` or Puppeteer.

```bash
npm install puppeteer
node render_headless.js
```

### Issue: WebM file is too large

**Solution**: Increase CRF value (lower quality) or reduce bitrate.

```bash
ffmpeg -i frames/frame_%05d.png -c:v libvpx-vp9 -crf 35 -b:v 1.5M output.webm
```

### Issue: Lottie animation is choppy

**Solution**: Simplify composition (reduce layer count, disable effects).

- Remove glow effects, use opacity only
- Reduce unit count to 8-12 instances
- Increase keyframe spacing (smoother curves)

### Issue: Loop has visible seam

**Solution**: Adjust fade-out timing in `timing_chart.json`.

- Extend die_and_loop phase duration
- Use easeOut curve for smoother transition
- Match final frame opacity to first frame (0.03)

---

## 7. File Output Summary

| File | Format | Resolution | Duration | Size | Usage |
|------|--------|------------|----------|------|-------|
| `nanotech_loop_1080p.webm` | WebM VP9 | 1920×1080 | 12s | 3-5MB | Desktop primary |
| `nanotech_loop_1080p.mp4` | H.264 MP4 | 1920×1080 | 12s | 6-10MB | Desktop fallback |
| `lottie_fallback.json` | Lottie JSON | 1080×1920 | 6s | <500KB | Mobile primary |
| `css_fallback_tile.svg` | SVG | 200×200 | Static | <50KB | CSS animation |

---

**Status**: Render pipeline documented
**Last updated**: 2026-01-29
