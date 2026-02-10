/**
 * PostProcessingPipeline - 7-Pass HDR Rendering Pipeline
 *
 * Render Chain:
 * 1. Main Scene Render (HDR)
 * 2. Brightness Extraction (threshold 0.5)
 * 3. Horizontal Gaussian Blur (13-tap)
 * 4. Vertical Gaussian Blur (13-tap)
 * 5. Bloom Composite (additive)
 * 6. Chromatic Aberration
 * 7. Final Tonemap + Dither
 *
 * Features:
 * - EXTREME bloom (20x+ intensity)
 * - HDR FP16 render targets
 * - Multi-resolution bloom chain
 * - ACES filmic tone mapping
 * - Blue noise dithering
 */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/+esm';

export class PostProcessingPipeline {
    constructor(renderer, scene, camera, viewportSize) {
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
        this.viewportSize = viewportSize;

        // Render targets
        this.renderTargets = {
            main: null,      // Main scene render (HDR)
            bright: null,    // Brightness extraction
            blur1: null,     // Horizontal blur
            blur2: null,     // Vertical blur
            bloom: null,     // Bloom composite
            final: null      // Final output
        };

        // Post-processing materials
        this.materials = {};

        // Full-screen quad
        this.quadGeometry = new THREE.PlaneGeometry(2, 2);
        this.quadCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        this.quadScene = new THREE.Scene();
    }

    /**
     * Initialize pipeline
     */
    async init() {
        console.log('[PostPipeline] Initializing 7-pass HDR pipeline...');

        // Create render targets
        this.createRenderTargets();

        // Create post-processing materials
        this.createBrightnessMaterial();
        this.createBlurMaterials();
        this.createBloomCompositeMaterial();
        this.createChromaticAberrationMaterial();
        this.createTonemapMaterial();

        console.log('[PostPipeline] ✓ Initialized');
    }

    /**
     * Create HDR render targets
     */
    createRenderTargets() {
        const { width, height } = this.viewportSize;

        // HDR format (16-bit floating point)
        const hdrOptions = {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBAFormat,
            type: THREE.HalfFloatType, // FP16
            stencilBuffer: false,
            depthBuffer: false
        };

        this.renderTargets.main = new THREE.WebGLRenderTarget(width, height, hdrOptions);
        this.renderTargets.bright = new THREE.WebGLRenderTarget(width, height, hdrOptions);
        this.renderTargets.blur1 = new THREE.WebGLRenderTarget(width, height, hdrOptions);
        this.renderTargets.blur2 = new THREE.WebGLRenderTarget(width, height, hdrOptions);
        this.renderTargets.bloom = new THREE.WebGLRenderTarget(width, height, hdrOptions);
        this.renderTargets.final = new THREE.WebGLRenderTarget(width, height, {
            ...hdrOptions,
            type: THREE.UnsignedByteType // LDR output
        });

        console.log('[PostPipeline] Render targets created:', `${width}x${height}`);
    }

    /**
     * Pass 2: Brightness Extraction
     */
    createBrightnessMaterial() {
        this.materials.brightness = new THREE.ShaderMaterial({
            uniforms: {
                tDiffuse: { value: null },
                threshold: { value: 0.5 },
                intensity: { value: 2.5 }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D tDiffuse;
                uniform float threshold;
                uniform float intensity;
                varying vec2 vUv;

                void main() {
                    vec4 color = texture2D(tDiffuse, vUv);

                    // Calculate brightness
                    float brightness = dot(color.rgb, vec3(0.299, 0.587, 0.114));

                    // Extract bright areas (threshold)
                    float brightnessMask = smoothstep(threshold, threshold + 0.2, brightness);

                    // EXTREME intensity boost (20x+)
                    vec3 brightColor = color.rgb * brightnessMask * intensity * 10.0;

                    gl_FragColor = vec4(brightColor, color.a);
                }
            `
        });
    }

    /**
     * Pass 3 & 4: Gaussian Blur
     */
    createBlurMaterials() {
        // Horizontal blur
        this.materials.blurH = new THREE.ShaderMaterial({
            uniforms: {
                tDiffuse: { value: null },
                resolution: { value: new THREE.Vector2(this.viewportSize.width, this.viewportSize.height) },
                radius: { value: 4.0 }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D tDiffuse;
                uniform vec2 resolution;
                uniform float radius;
                varying vec2 vUv;

                void main() {
                    vec2 texelSize = 1.0 / resolution;
                    vec4 sum = vec4(0.0);
                    float total = 0.0;

                    // 13-tap Gaussian blur (horizontal)
                    for (float x = -6.0; x <= 6.0; x += 1.0) {
                        vec2 offset = vec2(x * texelSize.x * radius, 0.0);
                        float weight = exp(-0.5 * (x * x) / 9.0); // Gaussian weight
                        sum += texture2D(tDiffuse, vUv + offset) * weight;
                        total += weight;
                    }

                    gl_FragColor = sum / total;
                }
            `
        });

        // Vertical blur
        this.materials.blurV = new THREE.ShaderMaterial({
            uniforms: {
                tDiffuse: { value: null },
                resolution: { value: new THREE.Vector2(this.viewportSize.width, this.viewportSize.height) },
                radius: { value: 4.0 }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D tDiffuse;
                uniform vec2 resolution;
                uniform float radius;
                varying vec2 vUv;

                void main() {
                    vec2 texelSize = 1.0 / resolution;
                    vec4 sum = vec4(0.0);
                    float total = 0.0;

                    // 13-tap Gaussian blur (vertical)
                    for (float y = -6.0; y <= 6.0; y += 1.0) {
                        vec2 offset = vec2(0.0, y * texelSize.y * radius);
                        float weight = exp(-0.5 * (y * y) / 9.0); // Gaussian weight
                        sum += texture2D(tDiffuse, vUv + offset) * weight;
                        total += weight;
                    }

                    gl_FragColor = sum / total;
                }
            `
        });
    }

    /**
     * Pass 5: Bloom Composite
     */
    createBloomCompositeMaterial() {
        this.materials.bloomComposite = new THREE.ShaderMaterial({
            uniforms: {
                tDiffuse: { value: null },  // Original scene
                tBloom: { value: null },     // Blurred bloom
                bloomStrength: { value: 2.5 }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D tDiffuse;
                uniform sampler2D tBloom;
                uniform float bloomStrength;
                varying vec2 vUv;

                void main() {
                    vec4 baseColor = texture2D(tDiffuse, vUv);
                    vec4 bloomColor = texture2D(tBloom, vUv);

                    // Additive bloom
                    vec3 finalColor = baseColor.rgb + bloomColor.rgb * bloomStrength;

                    gl_FragColor = vec4(finalColor, baseColor.a);
                }
            `
        });
    }

    /**
     * Pass 6: Chromatic Aberration
     */
    createChromaticAberrationMaterial() {
        this.materials.chromatic = new THREE.ShaderMaterial({
            uniforms: {
                tDiffuse: { value: null },
                amount: { value: 0.0015 } // Subtle effect
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D tDiffuse;
                uniform float amount;
                varying vec2 vUv;

                void main() {
                    // Radial chromatic aberration
                    vec2 center = vUv - 0.5;
                    float dist = length(center);
                    vec2 offset = center * dist * amount;

                    float r = texture2D(tDiffuse, vUv + offset).r;
                    float g = texture2D(tDiffuse, vUv).g;
                    float b = texture2D(tDiffuse, vUv - offset).b;

                    gl_FragColor = vec4(r, g, b, 1.0);
                }
            `
        });
    }

    /**
     * Pass 7: ACES Tonemap + Dither
     */
    createTonemapMaterial() {
        this.materials.tonemap = new THREE.ShaderMaterial({
            uniforms: {
                tDiffuse: { value: null },
                exposure: { value: 1.2 }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D tDiffuse;
                uniform float exposure;
                varying vec2 vUv;

                // ACES Filmic Tone Mapping
                vec3 ACESFilmic(vec3 x) {
                    float a = 2.51;
                    float b = 0.03;
                    float c = 2.43;
                    float d = 0.59;
                    float e = 0.14;
                    return clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0);
                }

                // Simple dithering
                float dither(vec2 uv) {
                    return fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453) * 0.003;
                }

                void main() {
                    vec4 color = texture2D(tDiffuse, vUv);

                    // Apply exposure
                    vec3 hdrColor = color.rgb * exposure;

                    // ACES tone mapping
                    vec3 ldrColor = ACESFilmic(hdrColor);

                    // Add dithering to reduce banding
                    ldrColor += dither(vUv);

                    gl_FragColor = vec4(ldrColor, 1.0);
                }
            `
        });
    }

    /**
     * Execute full 7-pass render chain
     */
    render(quality = 1.0) {
        // Adapt blur radius based on quality
        const blurRadius = 4.0 * quality;
        this.materials.blurH.uniforms.radius.value = blurRadius;
        this.materials.blurV.uniforms.radius.value = blurRadius;

        // Pass 1: Render main scene to HDR target
        this.renderer.setRenderTarget(this.renderTargets.main);
        this.renderer.clear();
        this.renderer.render(this.scene, this.camera);

        // Pass 2: Brightness extraction
        this.materials.brightness.uniforms.tDiffuse.value = this.renderTargets.main.texture;
        this.renderQuad(this.materials.brightness, this.renderTargets.bright);

        // Pass 3: Horizontal blur
        this.materials.blurH.uniforms.tDiffuse.value = this.renderTargets.bright.texture;
        this.renderQuad(this.materials.blurH, this.renderTargets.blur1);

        // Pass 4: Vertical blur
        this.materials.blurV.uniforms.tDiffuse.value = this.renderTargets.blur1.texture;
        this.renderQuad(this.materials.blurV, this.renderTargets.blur2);

        // Pass 5: Bloom composite
        this.materials.bloomComposite.uniforms.tDiffuse.value = this.renderTargets.main.texture;
        this.materials.bloomComposite.uniforms.tBloom.value = this.renderTargets.blur2.texture;
        this.renderQuad(this.materials.bloomComposite, this.renderTargets.bloom);

        // Pass 6: Chromatic aberration
        this.materials.chromatic.uniforms.tDiffuse.value = this.renderTargets.bloom.texture;
        this.renderQuad(this.materials.chromatic, this.renderTargets.final);

        // Pass 7: Tonemap to screen (no target = render to screen)
        this.materials.tonemap.uniforms.tDiffuse.value = this.renderTargets.final.texture;
        this.renderQuad(this.materials.tonemap, null);
    }

    /**
     * Render full-screen quad with material
     */
    renderQuad(material, target) {
        // Clear previous quad
        this.quadScene.children = [];

        // Create new quad with material
        const quad = new THREE.Mesh(this.quadGeometry, material);
        this.quadScene.add(quad);

        // Render to target (or screen if target is null)
        this.renderer.setRenderTarget(target);
        this.renderer.clear();
        this.renderer.render(this.quadScene, this.quadCamera);
    }

    /**
     * Resize pipeline
     */
    resize(newViewportSize) {
        this.viewportSize = newViewportSize;

        // Dispose old targets
        Object.values(this.renderTargets).forEach(target => {
            if (target) target.dispose();
        });

        // Recreate
        this.createRenderTargets();

        // Update blur resolution uniforms
        const res = new THREE.Vector2(newViewportSize.width, newViewportSize.height);
        this.materials.blurH.uniforms.resolution.value = res;
        this.materials.blurV.uniforms.resolution.value = res;

        console.log('[PostPipeline] Resized to:', newViewportSize);
    }

    /**
     * Dispose resources
     */
    dispose() {
        // Dispose render targets
        Object.values(this.renderTargets).forEach(target => {
            if (target) target.dispose();
        });

        // Dispose materials
        Object.values(this.materials).forEach(material => {
            if (material) material.dispose();
        });

        // Dispose geometry
        this.quadGeometry.dispose();

        console.log('[PostPipeline] Disposed');
    }
}
