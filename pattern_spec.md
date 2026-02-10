# Nanotech Diagonal Pattern — Production Specification

## Concept Summary

**Directional diagonal growth**: An almost-hex, square-with-cut-corners neon grid that evolves from faint traces (bottom-right) → stepping-stone → full peak (70–80%) → decay, including a Tony-Stark-like nano flip/merge at the peak.

---

## Geometry Specifications

### Base Unit: `unit_almost_hex.svg`

- **Shape**: Square with diagonally cut corners (octagon)
- **Dimensions**: 64×64px baseline
- **Corner cut depth**: 14% (9px)
- **Vertices**: 8 points forming 4 straight sides + 4 angled cuts
- **Perimeter**: ≈210px

### Grid Layout

- **Spacing**: Center-to-center = 1.4 × unit width (89.6px)
- **Direction**: Bottom-left → top-right diagonal at 35° angle
- **Coverage**: Middle diagonal band only (30%-70% of canvas)
- **Density gradient**: Varies across diagonal (see phase timing)

### Per-Instance Variation

- **Rotation**: ±6° random jitter
- **Position**: ±4px jitter in X and Y
- **Color mix**: Blend between primary/secondary based on random seed

**Critical**: Pattern must NOT look like repeating hex wallpaper. Organic diagonal snakeskin feel required.

---

## Animation Timeline (12-Second Loop)

### Phase 1: Faint Traces (0-6s | 0-50%)

- **Location**: Bottom-right diagonal starts visible
- **Opacity**: 0.03 → 0.18
- **Stroke width**: 0.8 → 1.2px
- **Features**: Very thin filaments only
- **Bloom**: Disabled
- **Center nodes**: None
- **Particle sparks**: None

### Phase 2: Stepping-Stone (6-7.8s | 50-65%)

- **Opacity**: 0.4 → 0.6
- **Stroke width**: 1.4 → 1.9px
- **Features**: Filaments more complex
- **Bloom**: Disabled
- **Center nodes**: Yes (radius 2-3px, opacity 0.3-0.5)
- **Particle sparks**: Yes (1-3 per unit, radius 1.5px, opacity 0.6-0.8)

### Phase 3: Peak Zone (7.8-9.6s | 65-80%)

- **Opacity**: 0.85 → 1.0
- **Stroke width**: 2.1 → 2.5px
- **Features**: Full neon lines + center nodes
- **Bloom**: Enabled (intensity 0.6-1.0, radius 6-10px)
- **Center nodes**: Yes (radius 4-5px, opacity 0.8-1.0, glow enabled)
- **Particle sparks**: Yes (3-6 per unit, radius 2px, opacity 0.8-1.0)

#### Nano Flip/Merge Transition

- **Trigger**: 72% timeline (8.64s)
- **Duration**: 0.3s
- **Rotation**: Max 18° with cubic-bezier(0.16, 0.84, 0.32, 1) easing
- **Morph**: Vertex blend via `morphto`/`morphfrom` attributes
- **Flash**: Single-frame weld flash (radius 20px, opacity 0.3)
- **Assembly particles**: 4-8 particles, spread radius 18px, lifetime 0.4s

### Phase 4: Decay (9.6-10.8s | 80-90%)

- **Opacity**: 0.9 → 0.5 (easeOut)
- **Stroke width**: 2.1 → 1.6px
- **Features**: Filaments dim, bloom fading
- **Bloom**: Enabled but reduced (intensity 0.3-0.5, radius 3-6px)
- **Center nodes**: Yes (radius 3-4px, opacity 0.4-0.7)
- **Particle sparks**: None

### Phase 5: Die & Loop (10.8-12s | 90-100%)

- **Opacity**: 0.25 → 0.03 (easeOut)
- **Stroke width**: 1.2 → 0.8px
- **Features**: Return to traces
- **Bloom**: Disabled
- **Center nodes**: None
- **Particle sparks**: None
- **Loop**: Seamless return to Phase 1 at t=12.0s

---

## Diagonal Flow Mechanics

### Direction

- **Primary axis**: Bottom-left → top-right at 35° angle
- **Sweep direction**: Ascending (bottom-right earliest, top-left latest)
- **Calculation**: `diag = ((height - y) + x × tan(35°)) / (height + width × tan(35°))`
- **Normalization**: Diagonal position mapped 0.3-0.7 → 0-1 for phase offset

### Phase Offset by Position

Each unit's phase = `(global_loop_progress + normalized_diag) % 1.0`

This creates the diagonal wave where:
- Bottom-right units reach peak first
- Top-left units reach peak last
- Wave continuously sweeps across diagonal

---

## Color Palette

| Element | Hex | RGB | Usage |
|---------|-----|-----|-------|
| Background | `#0B0C0E` | (11, 12, 14) | Obsidian base |
| Primary filament | `#D77A00` | (215, 122, 0) | Royal gold-tinted orange |
| Secondary accent | `#00E5FF` | (0, 229, 255) | Cool cyan |
| Tertiary accent | `#8AFFC1` | (138, 255, 193) | Soft green |
| Minimal traces | `rgba(215, 122, 0, 0.06)` | — | Faint phase color |

### Material Properties

- **Stroke**: No fill, stroke-only rendering
- **Glow**: Gaussian blur (stdDeviation 1.5-4 depending on phase)
- **Bloom**: Selective masking, avoid full-screen bleed
- **White blend**: 70% white mixed into core at peak brightness

---

## Noise & Texture

### Animated Noise Intrusion

- **Type**: Perlin-like turbulence
- **Scale**: 0.15-0.22 (varies by phase)
- **Speed**: 0.5-0.7 (time-based)
- **Opacity**: 0.02-0.12 (partially occludes lines)
- **Behavior**: Noise cuts through filaments creating organic gaps

### Noise Parameters by Phase

| Phase | Scale | Speed | Opacity |
|-------|-------|-------|---------|
| Faint traces | 0.15 | 0.5 | 0.02-0.04 |
| Stepping-stone | 0.18 | 0.6 | 0.04-0.08 |
| Peak zone | 0.22 | 0.7 | 0.08-0.12 |
| Decay | 0.20 | 0.55 | 0.06-0.10 |
| Die & loop | 0.15 | 0.5 | 0.02-0.05 |

---

## Performance Targets

### Desktop

- **FPS**: 60
- **Unit count**: 80-150 instances
- **Bloom**: Enabled (UnrealBloomPass)
- **Resolution**: 1920×1080 or higher
- **Rendering**: Three.js with instanced geometry

### Mobile

- **FPS**: 30
- **Unit count**: 40-80 instances
- **Bloom**: Disabled
- **Fallback mode**: Lottie JSON or MP4/WebM video
- **Resolution**: 1080×1920 (portrait) or 1920×1080 (landscape)

### Fallback Strategy

1. **Primary**: Three.js instanced rendering (desktop)
2. **Secondary**: Lottie JSON loop (mobile, low-power devices)
3. **Tertiary**: MP4/WebM video loop (older browsers)
4. **Quaternary**: Static SVG tile with CSS animation (graceful degradation)

---

## Easing Functions

### Primary Easing

- **Curve**: `cubic-bezier(0.16, 0.84, 0.32, 1)`
- **Usage**: Phase transitions, nano flip rotation, opacity curves

### Spring Damping

- **Value**: 12
- **Usage**: Particle burst animations
- **Formula**: `position += velocity * dt; velocity *= damping ^ dt`

### Time-Based Animation

All animations keyed to elapsed time (seconds), not frame count. Ensures consistent playback across devices.

---

## Deliverables Checklist

- [x] `unit_almost_hex.svg` — Base unit geometry
- [x] `pattern_spec.md` — This document
- [x] `timing_chart.json` — Phase timing data
- [x] `threejs_pseudocode.js` — Implementation code
- [x] `preview_frames/` — SVG snapshots (t=0, 6.0, 7.8, 9.6, 12.0s)
- [ ] `lottie_fallback.json` — Lottie export structure
- [ ] `render_instructions.md` — WebM rendering guide
- [ ] `qa_checklist.md` — Visual QA tests
- [ ] `css_fallback_tile.svg` — Pure-CSS fallback

---

## Rejection Criteria (Auto-Fail)

Pattern will be **rejected** if any of the following are true:

1. ❌ Pattern is a repeating hexagon wallpaper
2. ❌ No diagonal flow visible
3. ❌ No distinct stepping-stone and peak phases
4. ❌ Flip/merge animation absent or overbearing (>40° rotation or >600ms duration)
5. ❌ Bloom is full-screen or blinding
6. ❌ Opacity does not follow specified curves
7. ❌ Wrong color palette used
8. ❌ Animation is frame-based instead of time-based

---

## Technical Notes

### Vertex Morph Implementation

Nano flip/merge uses vertex morphing:
- Each instance has `morphto` and `morphfrom` vec3 attributes
- Shader blends between positions during flip window (0.22s)
- Rotation applied via transformation matrix
- Assembly particles emitted during merge

### Bloom Masking

To avoid full-screen bloom bleed:
- Use selective bloom layers (render targets)
- Only peak-zone units contribute to bloom pass
- Bloom threshold = 0.85 (only brightest elements)
- Bloom radius capped at 10px

### Noise Implementation

Animated noise using shader:
```glsl
float noise = fract(sin(dot(position.xy, vec2(12.9898, 78.233)) + time) * 43758.5453);
opacity *= (1.0 - noise * noiseIntensity);
```

---

## Version History

- **v1.0** (2026-01-29): Initial production specification
- Phase timing finalized
- Nano flip/merge parameters locked
- Color palette confirmed
- Deliverables defined

---

**Status**: Production-ready specification
**Last updated**: 2026-01-29
