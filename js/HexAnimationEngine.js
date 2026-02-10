/**
 * HexAnimationEngine - Production WebGL Hero Animation
 * Dental Clinic High-Tech Neon Hexagon Grid
 *
 * Architecture:
 * - Fully responsive hexagon grid (40-180 instances)
 * - Multi-layer line animation (3 layers × 6 sides × 30 segments)
 * - Particle system (80-240 particles per hex)
 * - 7-pass post-processing (HDR bloom, chromatic aberration, tonemap)
 * - State machine: Intro → Idle → Outro
 * - Scroll-triggered bidirectional animation
 */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/+esm';
import { HexGrid } from './HexGrid.js';
import { StateMachine } from './StateMachine.js';
import { ParticleSystem } from './ParticleSystem.js';
import { PostProcessingPipeline } from './PostProcessingPipeline.js';

export class HexAnimationEngine {
    constructor(containerElement, options = {}) {
        this.container = containerElement;
        this.options = {
            targetFPS: 60,
            adaptiveQuality: true,
            debugMode: false,
            ...options
        };

        // Core Three.js setup
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.clock = new THREE.Clock();

        // Animation systems
        this.hexGrid = null;
        this.stateMachine = null;
        this.particleSystem = null;
        this.postPipeline = null;

        // Uniforms (shared across all shaders)
        this.globalUniforms = {
            u_time: { value: 0 },
            u_wavePosition: { value: 0 },
            u_stateMachinePhase: { value: 0 }, // 0=intro, 1=idle, 2=outro
            u_introProgress: { value: 0 },
            u_resolution: { value: new THREE.Vector2() },
            u_devicePixelRatio: { value: window.devicePixelRatio }
        };

        // Performance monitoring
        this.performanceMonitor = {
            fps: 60,
            frameCount: 0,
            lastTime: performance.now(),
            quality: 1.0 // 1.0 = max quality, scales down if needed
        };

        // Animation state
        this.isInitialized = false;
        this.isAnimating = false;
        this.scrollObserver = null;
    }

    /**
     * Initialize the entire WebGL system
     */
    async init() {
        console.log('[HexEngine] Initializing WebGL animation system...');

        try {
            // 1. Setup Three.js renderer
            this.setupRenderer();

            // 2. Setup camera
            this.setupCamera();

            // 3. Setup scene
            this.setupScene();

            // 4. Initialize hex grid (responsive)
            this.hexGrid = new HexGrid(this.getViewportSize());
            await this.hexGrid.init(this.scene, this.globalUniforms);

            // 5. Initialize particle system
            this.particleSystem = new ParticleSystem(this.hexGrid.hexagons.length);
            await this.particleSystem.init(this.scene, this.globalUniforms, this.hexGrid);

            // 6. Initialize post-processing pipeline
            this.postPipeline = new PostProcessingPipeline(
                this.renderer,
                this.scene,
                this.camera,
                this.getViewportSize()
            );
            await this.postPipeline.init();

            // 7. Initialize state machine
            this.stateMachine = new StateMachine(this.hexGrid, this.particleSystem);
            this.stateMachine.transitionTo('intro');

            // 8. Setup scroll triggers
            this.setupScrollTriggers();

            // 9. Setup resize handler
            this.setupResizeHandler();

            this.isInitialized = true;
            console.log('[HexEngine] ✓ Initialization complete');

            // Start animation loop
            this.start();

        } catch (error) {
            console.error('[HexEngine] ✗ Initialization failed:', error);
            throw error;
        }
    }

    /**
     * Setup WebGL2 renderer
     */
    setupRenderer() {
        const size = this.getViewportSize();

        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance',
            stencil: false,
            depth: false
        });

        this.renderer.setSize(size.width, size.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // HDR tone mapping for extreme bloom
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 2.5;

        // Append to container
        this.renderer.domElement.style.position = 'absolute';
        this.renderer.domElement.style.top = '0';
        this.renderer.domElement.style.left = '0';
        this.renderer.domElement.style.width = '100%';
        this.renderer.domElement.style.height = '100%';
        this.renderer.domElement.style.pointerEvents = 'none';
        this.renderer.domElement.style.zIndex = '0';

        this.container.appendChild(this.renderer.domElement);

        console.log('[HexEngine] Renderer initialized:', {
            size: `${size.width}x${size.height}`,
            pixelRatio: this.renderer.getPixelRatio(),
            webgl: this.renderer.capabilities.isWebGL2 ? 'WebGL2' : 'WebGL1'
        });
    }

    /**
     * Setup orthographic camera (2D projection)
     */
    setupCamera() {
        const size = this.getViewportSize();
        const aspect = size.width / size.height;
        const frustumSize = size.height;

        this.camera = new THREE.OrthographicCamera(
            frustumSize * aspect / -2,
            frustumSize * aspect / 2,
            frustumSize / 2,
            frustumSize / -2,
            1,
            1000
        );

        this.camera.position.z = 500;
        this.camera.lookAt(0, 0, 0);

        console.log('[HexEngine] Camera initialized (orthographic)');
    }

    /**
     * Setup scene
     */
    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000); // Black background for visibility

        console.log('[HexEngine] Scene initialized');
    }

    /**
     * Get current viewport size
     */
    getViewportSize() {
        return {
            width: this.container.clientWidth,
            height: this.container.clientHeight
        };
    }

    /**
     * Setup scroll-based triggers (bidirectional)
     */
    setupScrollTriggers() {
        const heroSection = this.container.closest('section') || this.container;

        this.scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Scrolled back to hero - replay intro
                    if (this.stateMachine.currentState === 'outro' ||
                        this.stateMachine.currentState === 'idle') {
                        console.log('[HexEngine] Hero visible - replay intro');
                        this.stateMachine.transitionTo('intro');
                    }
                } else {
                    // Scrolled away - trigger outro
                    if (this.stateMachine.currentState !== 'outro') {
                        console.log('[HexEngine] Hero hidden - trigger outro');
                        this.stateMachine.transitionTo('outro');
                    }
                }
            });
        }, {
            threshold: [0, 0.1, 0.5, 0.9, 1.0],
            rootMargin: '0px'
        });

        this.scrollObserver.observe(heroSection);

        console.log('[HexEngine] Scroll triggers initialized');
    }

    /**
     * Setup responsive resize handler
     */
    setupResizeHandler() {
        let resizeTimeout;

        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250); // Debounce
        });

        console.log('[HexEngine] Resize handler initialized');
    }

    /**
     * Handle viewport resize
     */
    handleResize() {
        const size = this.getViewportSize();

        console.log('[HexEngine] Resizing to:', size);

        // Update camera
        const aspect = size.width / size.height;
        const frustumSize = size.height;

        this.camera.left = frustumSize * aspect / -2;
        this.camera.right = frustumSize * aspect / 2;
        this.camera.top = frustumSize / 2;
        this.camera.bottom = frustumSize / -2;
        this.camera.updateProjectionMatrix();

        // Update renderer
        this.renderer.setSize(size.width, size.height);

        // Update global uniforms
        this.globalUniforms.u_resolution.value.set(size.width, size.height);

        // Regenerate hex grid
        this.hexGrid.regenerate(size);

        // Update post-processing pipeline
        this.postPipeline.resize(size);

        // Update particle system capacity
        this.particleSystem.updateCapacity(this.hexGrid.hexagons.length);
    }

    /**
     * Start animation loop
     */
    start() {
        if (this.isAnimating) return;

        this.isAnimating = true;
        console.log('[HexEngine] Animation started');
        this.animate();
    }

    /**
     * Stop animation loop
     */
    stop() {
        this.isAnimating = false;
        console.log('[HexEngine] Animation stopped');
    }

    /**
     * Main animation loop (60fps target)
     */
    animate() {
        if (!this.isAnimating) return;

        requestAnimationFrame(() => this.animate());

        const deltaTime = this.clock.getDelta();
        const elapsedTime = this.clock.getElapsedTime();

        // Update performance monitor
        this.updatePerformanceMonitor();

        // Update global uniforms
        this.globalUniforms.u_time.value = elapsedTime * 1000; // milliseconds

        // Update state machine
        this.stateMachine.update(deltaTime, elapsedTime);

        // Update wave position (from state machine)
        this.globalUniforms.u_wavePosition.value = this.stateMachine.wavePosition;
        this.globalUniforms.u_stateMachinePhase.value = this.stateMachine.getPhaseValue();
        this.globalUniforms.u_introProgress.value = this.stateMachine.progress;

        // Update particle system
        this.particleSystem.update(deltaTime, this.stateMachine);

        // Render with post-processing
        this.postPipeline.render(this.performanceMonitor.quality);
    }

    /**
     * Update performance monitoring and adaptive quality
     */
    updatePerformanceMonitor() {
        this.performanceMonitor.frameCount++;

        const now = performance.now();
        const elapsed = now - this.performanceMonitor.lastTime;

        // Update FPS every second
        if (elapsed >= 1000) {
            this.performanceMonitor.fps = this.performanceMonitor.frameCount;
            this.performanceMonitor.frameCount = 0;
            this.performanceMonitor.lastTime = now;

            // Adaptive quality scaling
            if (this.options.adaptiveQuality) {
                if (this.performanceMonitor.fps < 45) {
                    // Reduce quality
                    this.performanceMonitor.quality = Math.max(0.5, this.performanceMonitor.quality - 0.1);
                    console.warn('[HexEngine] Low FPS detected, reducing quality to:', this.performanceMonitor.quality);
                } else if (this.performanceMonitor.fps > 58 && this.performanceMonitor.quality < 1.0) {
                    // Increase quality
                    this.performanceMonitor.quality = Math.min(1.0, this.performanceMonitor.quality + 0.05);
                    console.log('[HexEngine] Performance restored, increasing quality to:', this.performanceMonitor.quality);
                }
            }

            // Debug output
            if (this.options.debugMode) {
                console.log('[HexEngine] FPS:', this.performanceMonitor.fps, 'Quality:', this.performanceMonitor.quality.toFixed(2));
            }
        }
    }

    /**
     * Cleanup and destroy
     */
    destroy() {
        console.log('[HexEngine] Destroying animation engine...');

        this.stop();

        // Disconnect scroll observer
        if (this.scrollObserver) {
            this.scrollObserver.disconnect();
        }

        // Dispose Three.js resources
        if (this.hexGrid) this.hexGrid.dispose();
        if (this.particleSystem) this.particleSystem.dispose();
        if (this.postPipeline) this.postPipeline.dispose();

        if (this.renderer) {
            this.renderer.dispose();
            this.container.removeChild(this.renderer.domElement);
        }

        console.log('[HexEngine] ✓ Destroyed');
    }
}
