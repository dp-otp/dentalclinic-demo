/**
 * Hexagon Multi-Layer Line Vertex Shader
 *
 * Features:
 * - 3 independent line layers per hexagon
 * - Wave-triggered progressive construction
 * - Multiple simultaneous animation techniques:
 *   1. Racing segments (partial loops)
 *   2. Gap travel (barber pole)
 *   3. Broken segments (erosion)
 *   4. Firefly motion (position jitter)
 *   5. Multi-segment trains
 * - Multi-frequency breathing in idle state
 * - Snakeskin micro-flips
 */

export const hexVertexShader = `
    precision highp float;

    // Global uniforms
    uniform float u_time;
    uniform float u_wavePosition;
    uniform float u_stateMachinePhase; // 0=intro, 1=idle, 2=outro
    uniform float u_introProgress;
    uniform vec2 u_resolution;
    uniform float u_hexRadius;

    // Vertex attributes
    attribute float a_progress;        // Progress along side (0-1)
    attribute float a_seed;            // Segment-specific random seed
    attribute float a_hexSeed;         // Hex-specific seed
    attribute float a_distFromCenter;  // Distance from viewport center
    attribute float a_layer;           // Layer index (0, 1, 2)
    attribute vec2 a_hexCenter;        // Hex center position
    attribute float a_segmentIndex;    // Segment index within side (0-29)

    // Varyings to fragment shader
    varying vec3 v_color;
    varying float v_opacity;
    varying float v_glow;
    varying float v_lineWidth;

    // ============================================
    // NOISE FUNCTIONS
    // ============================================

    float hash(float n) {
        return fract(sin(n) * 43758.5453123);
    }

    float hash2(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    float noise(float x) {
        float i = floor(x);
        float f = fract(x);
        f = f * f * (3.0 - 2.0 * f); // Smooth interpolation
        return mix(hash(i), hash(i + 1.0), f);
    }

    // ============================================
    // WAVE TRIGGER CALCULATION
    // ============================================

    float calculateWaveTrigger(vec2 hexCenter) {
        // Diagonal sweep: bottom-left → top-right (35° angle)
        float angle = 35.0 * 3.14159 / 180.0;
        float diagonal = ((u_resolution.y - hexCenter.y - u_resolution.y * 0.5) +
                          (hexCenter.x + u_resolution.x * 0.5) * tan(angle)) /
                         (u_resolution.y + u_resolution.x * tan(angle));
        return clamp(diagonal, 0.0, 1.0);
    }

    // ============================================
    // HEX STATE CALCULATION
    // ============================================

    float getHexState(float waveTrigger) {
        // Calculate relative wave position
        float relativePos = abs(u_wavePosition - waveTrigger);

        // State zones:
        // 0.0-0.35: FETUS (static)
        // 0.35-0.60: TRIGGERED (wave approaching)
        // 0.60-0.70: CONSTRUCTING (active build)
        // 0.70-0.85: COMPLETE (peak)
        // 0.85-1.0: IDLE or OUTRO

        if (u_stateMachinePhase < 0.5) {
            // INTRO mode
            if (u_wavePosition < waveTrigger - 0.05) {
                return 0.0; // FETUS
            } else if (u_wavePosition < waveTrigger) {
                return 1.0; // TRIGGERED
            } else if (u_wavePosition < waveTrigger + 0.1) {
                return 2.0; // CONSTRUCTING
            } else {
                return 3.0; // COMPLETE
            }
        } else if (u_stateMachinePhase > 1.5) {
            // OUTRO mode (reverse)
            if (u_wavePosition > waveTrigger + 0.05) {
                return 3.0; // Still COMPLETE
            } else if (u_wavePosition > waveTrigger) {
                return 4.0; // DECONSTRUCTING
            } else {
                return 0.0; // Back to FETUS
            }
        } else {
            // IDLE mode
            return 3.0; // COMPLETE/IDLE
        }
    }

    // ============================================
    // ANIMATION TECHNIQUES
    // ============================================

    // Technique 1: Racing segments
    float racingSegments(float time, float segmentIdx, float seed) {
        float phase = fract(time * 0.3 + segmentIdx * 0.1 + seed);
        return smoothstep(0.0, 0.15, phase) * smoothstep(1.0, 0.85, phase);
    }

    // Technique 2: Gap travel (barber pole)
    float gapTravel(float time, float progress, float seed) {
        float gapPhase = fract(time * 0.5 + progress + seed * 0.5);
        return step(0.2, abs(gapPhase - 0.5)); // 20% gap width
    }

    // Technique 3: Broken segments (erosion)
    float brokenSegments(float time, float seed) {
        float noiseVal = hash(seed + floor(time * 2.0));
        return step(0.65, noiseVal); // 35% segments broken
    }

    // Technique 4: Firefly motion (returns vec2 offset)
    vec2 fireflyMotion(float time, float seed) {
        return vec2(
            sin(time * 3.0 + seed * 6.28) * 1.5,
            cos(time * 3.0 + seed * 3.14) * 1.5
        );
    }

    // Technique 5: Multi-segment trains
    float segmentTrain(float time, float segmentIdx) {
        float trainIdx = floor(segmentIdx / 5.0);
        float trainPhase = fract(time * 0.4 + trainIdx * 0.2);
        return smoothstep(0.0, 0.1, trainPhase) * smoothstep(1.0, 0.9, trainPhase);
    }

    // ============================================
    // COLOR CALCULATION
    // ============================================

    vec3 calculateColor(float hexState, float time, float seed) {
        // Subtle blue-green/grey medical palette
        vec3 lightGrey = vec3(0.75, 0.77, 0.78);       // #C0C4C7 - subtle grey
        vec3 blueGrey = vec3(0.6, 0.7, 0.75);          // #99B3BF - blue-grey
        vec3 teal = vec3(0.0, 0.53, 0.48);             // #008878 - medical teal
        vec3 lightTeal = vec3(0.4, 0.75, 0.72);        // #66BFB8 - light teal

        // Mix based on state and time
        float colorPhase = sin(time * 0.5 + seed * 6.28) * 0.5 + 0.5;

        vec3 baseColor;
        if (hexState < 0.5) {
            // FETUS: very subtle grey
            baseColor = lightGrey;
        } else if (hexState < 1.5) {
            // TRIGGERED: subtle blue-grey
            baseColor = blueGrey;
        } else if (hexState < 2.5) {
            // CONSTRUCTING: animated teal gradient
            baseColor = mix(blueGrey, teal, colorPhase);
        } else {
            // COMPLETE/IDLE: teal spectrum
            baseColor = mix(teal, lightTeal, colorPhase);
        }

        return baseColor;
    }

    // ============================================
    // MAIN
    // ============================================

    void main() {
        float time = u_time * 0.001; // Convert to seconds

        // Calculate wave trigger for this hex
        float waveTrigger = calculateWaveTrigger(a_hexCenter);

        // Calculate hex state
        float hexState = getHexState(waveTrigger);

        // Base opacity based on state
        float baseOpacity = 0.1;

        if (hexState < 0.5) {
            // FETUS: very faint breathing
            float breathing = sin(time * 0.8 + a_hexSeed * 6.28) * 0.5 + 0.5;
            baseOpacity = 0.08 + breathing * 0.1; // 8-18%

        } else if (hexState < 1.5) {
            // TRIGGERED: sudden spike
            baseOpacity = 0.4;

        } else if (hexState < 2.5) {
            // CONSTRUCTING: rapid ramp-up
            float constructPhase = fract((u_wavePosition - waveTrigger) * 10.0);
            baseOpacity = mix(0.4, 1.0, constructPhase);

        } else if (hexState < 3.5) {
            // COMPLETE/IDLE: full intensity with multi-frequency breathing
            if (u_stateMachinePhase > 0.5 && u_stateMachinePhase < 1.5) {
                // IDLE breathing (multi-frequency)
                float slow = sin(time * 0.2 * 6.28) * 0.15;
                float medium = sin(time * 1.5 * 6.28) * 0.08;
                float fast = sin(time * 8.0 * 6.28) * 0.02;
                baseOpacity = 0.85 + slow + medium + fast;
            } else {
                baseOpacity = 1.0;
            }

        } else {
            // DECONSTRUCTING
            float deconstructPhase = fract((waveTrigger - u_wavePosition) * 10.0);
            baseOpacity = mix(1.0, 0.1, deconstructPhase);
        }

        // Apply animation techniques (state-dependent intensity)
        float animationIntensity = 0.0;

        if (hexState < 2.5) {
            // FETUS, TRIGGERED, CONSTRUCTING: Full animation effects for nanotech assembly
            float racing = racingSegments(time, a_segmentIndex, a_seed);
            float gap = gapTravel(time, a_progress, a_seed);
            float broken = brokenSegments(time, a_seed);
            float train = segmentTrain(time, a_segmentIndex);

            // Multiplicative combination for heavy fragmentation during construction
            animationIntensity = racing * gap * broken * (0.5 + train * 0.5);
            baseOpacity *= max(0.1, animationIntensity);

        } else if (hexState < 3.5) {
            // COMPLETE/IDLE: Much clearer outlines with subtle effects only
            float racing = racingSegments(time, a_segmentIndex, a_seed);
            float gap = gapTravel(time, a_progress, a_seed);

            // Only subtle racing and occasional gaps (80% of segments visible)
            animationIntensity = racing * gap;
            baseOpacity *= max(0.8, animationIntensity); // Keep lines mostly solid

        } else {
            // DECONSTRUCTING: Return to heavy fragmentation
            float racing = racingSegments(time, a_segmentIndex, a_seed);
            float gap = gapTravel(time, a_progress, a_seed);
            float broken = brokenSegments(time, a_seed);

            animationIntensity = racing * gap * broken;
            baseOpacity *= max(0.1, animationIntensity);
        }

        // Firefly motion (position jitter) - reduced in IDLE state
        vec2 fireflyOffset = vec2(0.0);
        if (hexState < 2.5) {
            // CONSTRUCTING: Full firefly motion for nanotech assembly effect
            fireflyOffset = fireflyMotion(time, a_seed);
        } else if (hexState < 3.5) {
            // IDLE: Minimal jitter for subtle organic motion
            fireflyOffset = fireflyMotion(time, a_seed) * 0.15; // 15% of original
        } else {
            // DECONSTRUCTING: Full firefly motion
            fireflyOffset = fireflyMotion(time, a_seed);
        }

        // Layer offset (3 layers) - slightly larger for visibility
        vec2 layerOffset = vec2(
            sin(a_layer * 2.0) * 3.0,
            cos(a_layer * 2.0) * 3.0
        );

        // Final position
        vec3 pos = position;
        pos.xy += fireflyOffset + layerOffset;

        // Glow intensity (extreme in CONSTRUCTING/COMPLETE)
        v_glow = 0.0;
        if (hexState > 1.5 && hexState < 3.5) {
            v_glow = 25.0; // 25x brightness multiplier
        } else if (hexState < 1.5) {
            v_glow = 5.0;
        }

        // Line width based on state (increased for better visibility)
        if (hexState < 0.5) {
            v_lineWidth = 1.0; // Thin but visible
        } else if (hexState < 2.5) {
            v_lineWidth = mix(1.0, 3.0, (hexState - 0.5) / 2.0);
        } else {
            v_lineWidth = 3.0; // Thick, solid outline
        }

        // Calculate color
        v_color = calculateColor(hexState, time, a_hexSeed);

        // Apply extreme brightness boost
        v_color *= (1.0 + v_glow * 0.8);

        // Final opacity
        v_opacity = clamp(baseOpacity, 0.0, 1.0);

        // Transform position
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
`;
