# QA Checklist — Visual Verification Tests

## Purpose

These tests verify that the nanotech diagonal pattern evolves correctly through all phases and meets the production specification requirements.

---

## Test 1: Diagonal Flow Direction

**Objective**: Confirm wave sweeps bottom-left → top-right (35° angle)

**Procedure**:
1. Start animation at t=0.0s
2. Observe which corner has brightest/most visible units
3. Wait until t=6.0s
4. Observe if brightness has progressed diagonally upward

**Pass Criteria**:
- ✅ At t=0.0s, bottom-right corner shows most visible traces (opacity ≥0.05)
- ✅ At t=6.0s, middle diagonal shows brightness increase
- ✅ At t=9.6s, top-left corner reaches peak brightness (opacity ≥0.9)
- ✅ Wave progression is smooth and continuous, not jumpy

**Fail Criteria**:
- ❌ All units animate in sync (no diagonal progression)
- ❌ Wave moves in wrong direction (top-left to bottom-right)
- ❌ Pattern is static or repeating without flow

---

## Test 2: Phase Transitions — Opacity Curves

**Objective**: Verify opacity follows timing_chart.json specifications for each phase

**Procedure**:
1. Capture screenshots at t=0s, 3s, 6s, 7.8s, 9.6s, 11s, 12s
2. Measure opacity of center diagonal unit using eyedropper tool
3. Compare measured opacity to expected values

**Pass Criteria (Center Diagonal Unit)**:

| Time | Expected Opacity | Tolerance | Phase |
|------|------------------|-----------|-------|
| t=0.0s | 0.03-0.06 | ±0.02 | Faint traces |
| t=3.0s | 0.10-0.15 | ±0.03 | Faint traces → stepping-stone |
| t=6.0s | 0.18-0.25 | ±0.05 | Stepping-stone start |
| t=7.8s | 0.85-1.0 | ±0.05 | Peak zone |
| t=9.6s | 0.7-0.9 | ±0.08 | Decay start |
| t=11.0s | 0.15-0.25 | ±0.05 | Die phase |
| t=12.0s | 0.03-0.08 | ±0.02 | Loop reset |

**Fail Criteria**:
- ❌ Opacity is outside tolerance range for any timestamp
- ❌ Opacity jumps suddenly instead of smooth transition
- ❌ Final frame (t=12.0s) does not match first frame (t=0.0s) — visible seam

---

## Test 3: Nano Flip/Merge Transition

**Objective**: Confirm nano flip occurs at 72% (t=8.64s) with correct parameters

**Procedure**:
1. Set playback speed to 0.5× (slow motion)
2. Start at t=8.4s
3. Observe units in peak zone (center diagonal)
4. Watch for rotation and horizontal compression

**Pass Criteria**:
- ✅ Flip begins at t=8.64s (±0.1s)
- ✅ Rotation is visible but subtle (≤18°)
- ✅ Horizontal compression occurs (scaleX ≈0.7 at midpoint)
- ✅ Duration is 0.2-0.4 seconds
- ✅ Merge flash appears (white glow, radius ≈20px, brief)
- ✅ Assembly particles visible (4-8 small dots around merge point)
- ✅ Easing is smooth (cubic-bezier), not linear

**Fail Criteria**:
- ❌ No rotation visible (flip not implemented)
- ❌ Rotation >40° (overbearing effect)
- ❌ Duration >600ms (too slow, breaks flow)
- ❌ Merge flash is blinding (full-screen bloom)
- ❌ No assembly particles visible

---

## Test 4: Bloom Masking & Selectivity

**Objective**: Verify bloom only affects peak-zone units, not full-screen

**Procedure**:
1. Navigate to t=8.0s (peak zone active)
2. Inspect background color (should remain #0B0C0E obsidian)
3. Check if bloom glow extends beyond unit boundaries

**Pass Criteria**:
- ✅ Bloom visible only on units with opacity ≥0.85
- ✅ Bloom radius contained to 6-10px around each unit
- ✅ Background color remains dark (#0B0C0E) — no full-screen bleed
- ✅ Bloom does not obscure unit geometry (octagon shape still visible)
- ✅ Center nodes have visible glow halo

**Fail Criteria**:
- ❌ Entire screen is glowing (full-screen bloom)
- ❌ Bloom radius >15px (too blurry)
- ❌ Background appears lighter than #0B0C0E
- ❌ Bloom is uniform on all units (not selective)

---

## Test 5: Geometry & Non-Wallpaper Validation

**Objective**: Confirm units are squares with cut corners, not hexagons, and pattern is non-repeating

**Procedure**:
1. Pause at t=8.0s (peak brightness for clear visibility)
2. Inspect unit shape at center diagonal
3. Count straight sides and angled cuts
4. Look for repeating patterns or uniform spacing

**Pass Criteria**:
- ✅ Each unit has 4 straight sides + 4 diagonal cuts (octagon)
- ✅ Corner cuts are at 45° angles
- ✅ Units have rotation jitter (not all aligned same way)
- ✅ Position jitter visible (spacing slightly irregular)
- ✅ Pattern feels organic, snakeskin-like, not wallpaper
- ✅ No perfect hexagons or circles

**Fail Criteria**:
- ❌ Units are perfect hexagons (6 sides, no straight edges)
- ❌ All units perfectly aligned (no rotation jitter)
- ❌ Uniform grid spacing (no position jitter)
- ❌ Pattern looks like repeating hex wallpaper
- ❌ Wrong shape entirely (squares, circles, triangles)

---

## Test 6: Color Palette Accuracy

**Objective**: Verify correct colors are used per specification

**Procedure**:
1. Capture screenshot at t=8.0s (peak zone)
2. Use eyedropper/color picker on 3 different units
3. Compare RGB values to specification

**Pass Criteria**:

| Color Name | Hex | RGB | Usage | Tolerance |
|------------|-----|-----|-------|-----------|
| Background | #0B0C0E | (11,12,14) | Canvas | ±2 per channel |
| Primary filament | #D77A00 | (215,122,0) | Main stroke | ±5 per channel |
| Secondary accent | #00E5FF | (0,229,255) | Cyan highlights | ±5 per channel |
| Tertiary accent | #8AFFC1 | (138,255,193) | Green sparks | ±8 per channel |

**Additional checks**:
- ✅ Faint traces phase uses rgba(215,122,0,0.06)
- ✅ White blend appears at peak (core stroke has white tint)
- ✅ No purple, no teal (from previous dental spec)

**Fail Criteria**:
- ❌ Any color is outside tolerance range
- ❌ Wrong color palette used (e.g., teal instead of orange)
- ❌ Colors are washed out or oversaturated

---

## Test 7: Mobile Performance & Fallback

**Objective**: Confirm mobile devices use Lottie fallback and maintain 30fps

**Procedure**:
1. Open on mobile device (or Chrome DevTools mobile emulation)
2. Check which format loaded (Three.js / Lottie / video)
3. Monitor FPS using browser dev tools

**Pass Criteria**:
- ✅ Mobile devices load Lottie or video fallback (not Three.js)
- ✅ FPS ≥30 on mobile (smooth playback)
- ✅ Animation still shows diagonal progression
- ✅ No janky frames or stuttering

**Fail Criteria**:
- ❌ Three.js loads on mobile (performance risk)
- ❌ FPS <20 (choppy playback)
- ❌ Fallback animation is completely different (no diagonal flow)

---

## Test 8: Loop Seamlessness

**Objective**: Verify t=12.0s → t=0.0s transition is invisible

**Procedure**:
1. Watch animation loop 3 full cycles
2. Focus on center diagonal during loop point
3. Look for any flash, jump, or opacity discontinuity

**Pass Criteria**:
- ✅ Loop transition is imperceptible
- ✅ No flash or sudden brightness change at t=12.0s
- ✅ Opacity at t=11.9s ≈ opacity at t=0.1s (smooth fade)
- ✅ Position and rotation do not jump

**Fail Criteria**:
- ❌ Visible seam or flash at loop point
- ❌ Sudden opacity jump (e.g., 0.25 → 0.03 too fast)
- ❌ Units teleport or change position at loop
- ❌ Audio pop/click (if audio present)

---

## Test 9: Noise Intrusion Visibility

**Objective**: Confirm animated noise creates organic gaps in filaments

**Procedure**:
1. Watch animation from t=0s to t=12s
2. Observe if some units have partial transparency/gaps
3. Check if gaps move/animate over time

**Pass Criteria**:
- ✅ Noise creates small gaps in some filaments
- ✅ Gaps are partial (opacity reduced, not fully invisible)
- ✅ Noise pattern animates slowly (speed 0.5-0.7)
- ✅ Noise opacity is subtle (0.02-0.12 range)
- ✅ Noise does NOT obscure entire units

**Fail Criteria**:
- ❌ No noise visible (all filaments solid)
- ❌ Noise is too aggressive (units completely hidden)
- ❌ Noise is static (does not animate)

---

## Test 10: Stepping-Stone Phase Visibility

**Objective**: Verify stepping-stone phase (50-65%) shows distinct features

**Procedure**:
1. Navigate to t=6.5s (middle of stepping-stone phase)
2. Inspect center diagonal units
3. Look for center nodes and particle sparks

**Pass Criteria**:
- ✅ Center nodes visible (small circles, radius 2-3px, opacity 0.3-0.5)
- ✅ Particle sparks present (1-3 per unit, tiny dots)
- ✅ Filaments are more complex than faint traces phase
- ✅ Opacity is in stepping-stone range (0.4-0.6)
- ✅ No bloom yet (bloom starts at 65%)

**Fail Criteria**:
- ❌ No center nodes visible
- ❌ No particle sparks
- ❌ Opacity too high (looks like peak zone already)
- ❌ Bloom is active (should wait until 65%)

---

## Summary: Pass/Fail Criteria

### Automatic Pass

Pattern **passes QA** if ALL 10 tests pass.

### Automatic Fail

Pattern **fails QA** if ANY of the following are true:
- Test 1 fails (no diagonal flow)
- Test 2 fails (opacity curves incorrect)
- Test 3 fails (no nano flip or overbearing effect)
- Test 4 fails (full-screen bloom)
- Test 5 fails (wrong geometry or wallpaper pattern)
- Test 6 fails (wrong colors)
- Test 8 fails (loop seam visible)

### Partial Pass (Requires Fix)

If only Tests 7, 9, or 10 fail:
- Pattern structure is correct but optimization/polish needed
- Fix performance issues or particle visibility
- Re-test after adjustments

---

## Testing Log Template

```
Date: YYYY-MM-DD
Tester: [Name]
Environment: [Desktop/Mobile, Browser, OS]

Test 1 - Diagonal Flow: [ ] PASS [ ] FAIL
Test 2 - Opacity Curves: [ ] PASS [ ] FAIL
Test 3 - Nano Flip: [ ] PASS [ ] FAIL
Test 4 - Bloom Masking: [ ] PASS [ ] FAIL
Test 5 - Geometry: [ ] PASS [ ] FAIL
Test 6 - Color Palette: [ ] PASS [ ] FAIL
Test 7 - Mobile Fallback: [ ] PASS [ ] FAIL
Test 8 - Loop Seamless: [ ] PASS [ ] FAIL
Test 9 - Noise Intrusion: [ ] PASS [ ] FAIL
Test 10 - Stepping-Stone: [ ] PASS [ ] FAIL

Overall Result: [ ] PASS [ ] FAIL [ ] PARTIAL

Notes:
[Any issues or observations]
```

---

**Status**: QA checklist complete with 10 visual tests
**Last updated**: 2026-01-29
