/**
 * Hexagon Multi-Layer Line Fragment Shader
 *
 * Features:
 * - HDR color output (for extreme bloom)
 * - Additive blending
 * - Procedural noise intrusion
 */

export const hexFragmentShader = `
    precision highp float;

    // Varyings from vertex shader
    varying vec3 v_color;
    varying float v_opacity;
    varying float v_glow;
    varying float v_lineWidth;

    // Global uniforms
    uniform float u_time;

    // ============================================
    // NOISE FOR TEXTURE
    // ============================================

    float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);

        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));

        return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    // ============================================
    // MAIN
    // ============================================

    void main() {
        // Base color with glow
        vec3 finalColor = v_color;

        // Add slight noise intrusion (animated)
        float time = u_time * 0.001;
        vec2 noiseCoord = gl_FragCoord.xy * 0.02 + time * 0.1;
        float noiseValue = noise(noiseCoord);

        // Noise slightly darkens some areas (organic gaps)
        float noiseMask = 1.0 - noiseValue * 0.12; // 0-12% darkening

        // Apply noise
        finalColor *= noiseMask;

        // HDR output (for bloom post-processing)
        // Colors can exceed 1.0 for extreme bloom
        gl_FragColor = vec4(finalColor, v_opacity);
    }
`;
