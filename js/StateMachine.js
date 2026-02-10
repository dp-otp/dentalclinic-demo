/**
 * StateMachine - Animation State Controller
 *
 * States: INTRO → IDLE → OUTRO (bidirectional)
 * - INTRO: Diagonal wave construction (bottom-left → top-right)
 * - IDLE: Continuous multi-frequency breathing + snakeskin flips
 * - OUTRO: Reverse diagonal wave deconstruction (top-right → bottom-left)
 */

export class StateMachine {
    constructor(hexGrid, particleSystem) {
        this.hexGrid = hexGrid;
        this.particleSystem = particleSystem;

        // State
        this.currentState = null;
        this.previousState = null;
        this.stateStartTime = 0;
        this.stateElapsedTime = 0;

        // Wave control
        this.wavePosition = 0; // 0-1 normalized
        this.waveDirection = 1; // 1 = forward (intro), -1 = backward (outro)
        this.waveSpeed = 1.25; // Speed multiplier (intro takes ~0.8s)

        // Progress tracking
        this.progress = 0; // Current state progress (0-1)

        // State durations (seconds)
        this.durations = {
            intro: 0.8,  // Sharp fast intro
            idle: Infinity, // Continuous
            outro: 0.6   // Slightly faster outro
        };

        // Idle breathing parameters (multi-frequency)
        this.idleBreathing = {
            slow: { frequency: 0.2, amplitude: 0.15 },    // ±15% over 5s
            medium: { frequency: 1.5, amplitude: 0.08 },  // ±8% over 0.67s
            fast: { frequency: 8.0, amplitude: 0.02 }     // ±2% over 0.125s
        };

        // Snakeskin flip timer
        this.snakeskinFlipTimer = 0;
        this.snakeskinFlipInterval = 2.0; // Random flips every 2-4s
        this.currentFlippingHexes = new Set();
    }

    /**
     * Transition to new state
     */
    transitionTo(newState) {
        if (this.currentState === newState) return;

        console.log(`[StateMachine] ${this.currentState || 'NULL'} → ${newState}`);

        this.previousState = this.currentState;
        this.currentState = newState;
        this.stateStartTime = 0; // Will be set on first update
        this.stateElapsedTime = 0;
        this.progress = 0;

        // Configure wave direction
        if (newState === 'intro') {
            this.waveDirection = 1;  // Forward
            this.wavePosition = 0;
            this.waveSpeed = 1.25;
        } else if (newState === 'outro') {
            this.waveDirection = -1; // Backward
            this.wavePosition = 1;
            this.waveSpeed = 1.67; // Slightly faster
        } else if (newState === 'idle') {
            this.wavePosition = 0.5; // Neutral
            this.snakeskinFlipTimer = 0;
            this.currentFlippingHexes.clear();
        }

        // Notify systems
        this.onStateEnter(newState);
    }

    /**
     * Handle state entry
     */
    onStateEnter(state) {
        switch (state) {
            case 'intro':
                console.log('[StateMachine] Starting INTRO wave (BL→TR)');
                this.particleSystem.reset();
                break;

            case 'idle':
                console.log('[StateMachine] Entering IDLE breathing state');
                break;

            case 'outro':
                console.log('[StateMachine] Starting OUTRO wave (TR→BL)');
                break;
        }
    }

    /**
     * Update state machine
     */
    update(deltaTime, elapsedTime) {
        if (!this.currentState) return;

        // Initialize start time on first update
        if (this.stateStartTime === 0) {
            this.stateStartTime = elapsedTime;
        }

        this.stateElapsedTime = elapsedTime - this.stateStartTime;

        // Update progress
        const duration = this.durations[this.currentState];
        this.progress = duration === Infinity ? 0 : Math.min(this.stateElapsedTime / duration, 1);

        // State-specific updates
        switch (this.currentState) {
            case 'intro':
                this.updateIntro(deltaTime);
                break;

            case 'idle':
                this.updateIdle(deltaTime, elapsedTime);
                break;

            case 'outro':
                this.updateOutro(deltaTime);
                break;
        }
    }

    /**
     * Update INTRO state
     * Sharp diagonal wave sweeping bottom-left → top-right
     */
    updateIntro(deltaTime) {
        // Wave advances linearly
        this.wavePosition += (deltaTime * this.waveSpeed) / this.durations.intro;

        // Clamp to 0-1
        this.wavePosition = Math.min(this.wavePosition, 1);

        // Auto-transition to IDLE when complete
        if (this.wavePosition >= 1.0 && this.progress >= 1.0) {
            this.transitionTo('idle');
        }

        // Trigger hex construction based on wave position
        this.hexGrid.hexagons.forEach((hex, index) => {
            const hexWaveTrigger = this.calculateHexWaveTrigger(hex, 1);

            if (this.wavePosition >= hexWaveTrigger && this.wavePosition < hexWaveTrigger + 0.05) {
                // Hex enters construction
                hex.state = 'constructing';
                hex.constructionStart = this.stateElapsedTime;

                // Spawn particles
                this.particleSystem.spawnConstructionBurst(hex, index);
            }

            // Update hex construction progress
            if (hex.state === 'constructing') {
                const timeSinceTrigger = this.stateElapsedTime - (hex.constructionStart || 0);
                hex.constructionProgress = Math.min(timeSinceTrigger / 0.3, 1); // 0.3s construction

                if (hex.constructionProgress >= 1.0) {
                    hex.state = 'complete';
                }
            }
        });
    }

    /**
     * Update IDLE state
     * Multi-frequency breathing + snakeskin micro-flips
     */
    updateIdle(deltaTime, elapsedTime) {
        // Multi-frequency breathing (applied in shaders via uniforms)
        // The breathing is handled by the shader, but we track it here for logic

        // Snakeskin flip timer
        this.snakeskinFlipTimer += deltaTime;

        if (this.snakeskinFlipTimer >= this.snakeskinFlipInterval) {
            this.triggerRandomSnakeskinFlips();
            this.snakeskinFlipTimer = 0;
            // Randomize next interval (2-4s)
            this.snakeskinFlipInterval = 2.0 + Math.random() * 2.0;
        }

        // Update currently flipping hexes
        this.currentFlippingHexes.forEach((hexIndex) => {
            const hex = this.hexGrid.hexagons[hexIndex];
            if (hex && hex.flipStartTime) {
                const flipElapsed = elapsedTime - hex.flipStartTime;
                if (flipElapsed >= 0.4) { // 0.4s flip duration
                    this.currentFlippingHexes.delete(hexIndex);
                    hex.flipStartTime = null;
                }
            }
        });
    }

    /**
     * Update OUTRO state
     * Reverse diagonal wave sweeping top-right → bottom-left
     */
    updateOutro(deltaTime) {
        // Wave advances in reverse
        this.wavePosition -= (deltaTime * this.waveSpeed) / this.durations.outro;

        // Clamp to 0-1
        this.wavePosition = Math.max(this.wavePosition, 0);

        // Trigger hex deconstruction based on wave position
        this.hexGrid.hexagons.forEach((hex, index) => {
            const hexWaveTrigger = this.calculateHexWaveTrigger(hex, -1);

            if (this.wavePosition <= hexWaveTrigger && this.wavePosition > hexWaveTrigger - 0.05) {
                // Hex enters deconstruction
                hex.state = 'deconstructing';
                hex.deconstructionStart = this.stateElapsedTime;
            }

            // Update hex deconstruction progress
            if (hex.state === 'deconstructing') {
                const timeSinceTrigger = this.stateElapsedTime - (hex.deconstructionStart || 0);
                hex.deconstructionProgress = Math.min(timeSinceTrigger / 0.3, 1); // 0.3s deconstruction

                if (hex.deconstructionProgress >= 1.0) {
                    hex.state = 'fetus';
                }
            }
        });

        // Note: Outro doesn't auto-transition (stays in outro state until scroll back)
    }

    /**
     * Calculate wave trigger point for a hexagon
     * @param {Object} hex - Hexagon object
     * @param {Number} direction - 1 for forward (intro), -1 for backward (outro)
     * @returns {Number} - Normalized trigger position (0-1)
     */
    calculateHexWaveTrigger(hex, direction) {
        // Diagonal calculation: bottom-left → top-right
        // For intro: bottom-left = 0, top-right = 1
        // For outro: reverse

        const viewportWidth = this.hexGrid.viewportSize.width;
        const viewportHeight = this.hexGrid.viewportSize.height;

        // Convert hex position to viewport coordinates (centered at 0,0)
        const x = hex.x + viewportWidth / 2;
        const y = hex.y + viewportHeight / 2;

        // Diagonal distance from bottom-left corner
        const diagonalLength = Math.sqrt(viewportWidth ** 2 + viewportHeight ** 2);
        const diagonalPosition = ((viewportHeight - y) + x * Math.tan(35 * Math.PI / 180)) / diagonalLength;

        // Normalize to 0-1
        const normalized = Math.max(0, Math.min(1, diagonalPosition));

        // Reverse for outro
        return direction === 1 ? normalized : 1 - normalized;
    }

    /**
     * Trigger random snakeskin flips in idle state
     */
    triggerRandomSnakeskinFlips() {
        // Pick 3-6 random hexagons to flip
        const flipCount = 3 + Math.floor(Math.random() * 4);

        for (let i = 0; i < flipCount; i++) {
            const hexIndex = Math.floor(Math.random() * this.hexGrid.hexagons.length);
            const hex = this.hexGrid.hexagons[hexIndex];

            if (hex && !this.currentFlippingHexes.has(hexIndex)) {
                hex.flipStartTime = this.stateElapsedTime + this.stateStartTime;
                this.currentFlippingHexes.add(hexIndex);
            }
        }

        console.log(`[StateMachine] Snakeskin flip triggered (${flipCount} hexes)`);
    }

    /**
     * Get current state as numeric value for shader
     * 0 = intro, 1 = idle, 2 = outro
     */
    getPhaseValue() {
        switch (this.currentState) {
            case 'intro': return 0;
            case 'idle': return 1;
            case 'outro': return 2;
            default: return 0;
        }
    }

    /**
     * Calculate idle breathing intensity
     * Returns combined multi-frequency value (0-1)
     */
    getIdleBreathingIntensity(elapsedTime) {
        if (this.currentState !== 'idle') return 0;

        const slow = Math.sin(elapsedTime * this.idleBreathing.slow.frequency * Math.PI * 2) *
                     this.idleBreathing.slow.amplitude;

        const medium = Math.sin(elapsedTime * this.idleBreathing.medium.frequency * Math.PI * 2) *
                       this.idleBreathing.medium.amplitude;

        const fast = Math.sin(elapsedTime * this.idleBreathing.fast.frequency * Math.PI * 2) *
                     this.idleBreathing.fast.amplitude;

        // Combine and normalize to 0-1 range
        return 0.5 + slow + medium + fast;
    }
}
