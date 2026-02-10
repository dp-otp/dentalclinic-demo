/**
 * Particle Vertex Shader
 *
 * Features:
 * - Physics-based particle movement
 * - Lifetime-based opacity
 * - Color variation
 * - Extreme brightness for bloom
 */

export const particleVertexShader = `
    precision highp float;

    // Global uniforms
    uniform float u_time;
    uniform float u_stateMachinePhase;

    // Vertex attributes
    attribute vec3 a_velocity;
    attribute float a_seed;
    attribute float a_lifetime; // 0-1 (0=birth, 1=death)
    attribute float a_hexIndex;

    // Varyings
    varying vec3 v_color;
    varying float v_opacity;
    varying float v_glow;

    void main() {
        float time = u_time * 0.001;

        // Lifetime fade (fade out in last 20%)
        float lifetimeFade = 1.0 - smoothstep(0.8, 1.0, a_lifetime);

        // Color: medical teal to blue-grey gradient
        float colorMix = sin(time * 2.0 + a_seed * 6.28) * 0.5 + 0.5;
        v_color = mix(
            vec3(0.0, 0.53, 0.48),  // Medical teal
            vec3(0.6, 0.7, 0.75),   // Blue-grey
            colorMix
        );

        // Brightness boost for construction particles
        v_color *= 15.0;

        // Opacity based on lifetime and state
        v_opacity = lifetimeFade * 0.8;

        // Glow intensity
        v_glow = lifetimeFade * 15.0;

        // Particle size based on lifetime (grow then shrink) - increased for visibility
        float sizeAnim = smoothstep(0.0, 0.2, a_lifetime) * smoothstep(1.0, 0.8, a_lifetime);
        float pointSize = 3.5 + sizeAnim * 2.5; // 3.5-6px (larger for better visibility)

        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = pointSize;
    }
`;
