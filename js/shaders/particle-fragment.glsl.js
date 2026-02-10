/**
 * Particle Fragment Shader
 *
 * Features:
 * - Circular particle shape with soft falloff
 * - HDR color output for extreme bloom
 */

export const particleFragmentShader = `
    precision highp float;

    // Varyings
    varying vec3 v_color;
    varying float v_opacity;
    varying float v_glow;

    void main() {
        // Circular particle with soft edges
        vec2 center = gl_PointCoord - vec2(0.5);
        float dist = length(center);

        // Discard pixels outside circle
        if (dist > 0.5) discard;

        // Soft falloff from center
        float falloff = 1.0 - (dist * 2.0);
        falloff = pow(falloff, 2.0); // Quadratic falloff

        // Apply glow boost to center
        vec3 finalColor = v_color * (1.0 + falloff * v_glow * 0.1);

        // Alpha with falloff
        float alpha = falloff * v_opacity;

        gl_FragColor = vec4(finalColor, alpha);
    }
`;
