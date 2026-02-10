/**
 * ParticleSystem - Energy-Like Particle Simulation
 *
 * Features:
 * - 80-240 particles per hexagon (adaptive based on device)
 * - Physics-based movement (velocity + damping)
 * - Magnetic attraction to hex edges
 * - Construction burst spawning
 * - Continuous respawning in idle state
 */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/+esm';
import { particleVertexShader } from './shaders/particle-vertex.glsl.js';
import { particleFragmentShader } from './shaders/particle-fragment.glsl.js';

export class ParticleSystem {
    constructor(hexCount) {
        this.hexCount = hexCount;
        this.particlesPerHex = this.calculateParticlesPerHex();
        this.totalParticles = hexCount * this.particlesPerHex;

        this.particles = [];
        this.mesh = null;
        this.material = null;
        this.geometry = null;
        this.hexGrid = null;

        // Particle pool
        this.particlePool = [];
        this.activeParticles = new Set();
    }

    /**
     * Calculate particles per hex based on device capabilities
     */
    calculateParticlesPerHex() {
        const width = window.innerWidth;

        if (width < 768) {
            return 80;  // Mobile
        } else if (width < 1200) {
            return 160; // Tablet
        } else {
            return 220; // Desktop
        }
    }

    /**
     * Initialize particle system
     */
    async init(scene, globalUniforms, hexGrid) {
        console.log('[ParticleSystem] Initializing...');

        this.hexGrid = hexGrid;

        // Allocate particle pool
        this.allocateParticlePool();

        // Create geometry
        this.createGeometry();

        // Create material
        this.createMaterial(globalUniforms);

        // Create mesh
        this.mesh = new THREE.Points(this.geometry, this.material);
        scene.add(this.mesh);

        console.log('[ParticleSystem] ✓ Initialized', this.totalParticles, 'particles');
    }

    /**
     * Allocate particle pool
     */
    allocateParticlePool() {
        this.particlePool = [];

        for (let i = 0; i < this.totalParticles; i++) {
            this.particlePool.push({
                position: new THREE.Vector3(0, 0, 0),
                velocity: new THREE.Vector3(0, 0, 0),
                acceleration: new THREE.Vector3(0, 0, 0),
                lifetime: 0,
                maxLifetime: 0.5,
                hexIndex: -1,
                seed: Math.random(),
                active: false
            });
        }
    }

    /**
     * Create particle geometry
     */
    createGeometry() {
        const positions = new Float32Array(this.totalParticles * 3);
        const velocities = new Float32Array(this.totalParticles * 3);
        const seeds = new Float32Array(this.totalParticles);
        const lifetimes = new Float32Array(this.totalParticles);
        const hexIndices = new Float32Array(this.totalParticles);

        // Initialize all particles at origin (invisible)
        for (let i = 0; i < this.totalParticles; i++) {
            positions[i * 3] = 0;
            positions[i * 3 + 1] = 0;
            positions[i * 3 + 2] = 0;

            velocities[i * 3] = 0;
            velocities[i * 3 + 1] = 0;
            velocities[i * 3 + 2] = 0;

            seeds[i] = Math.random();
            lifetimes[i] = 0;
            hexIndices[i] = -1;
        }

        this.geometry = new THREE.BufferGeometry();
        this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        this.geometry.setAttribute('a_velocity', new THREE.BufferAttribute(velocities, 3));
        this.geometry.setAttribute('a_seed', new THREE.BufferAttribute(seeds, 1));
        this.geometry.setAttribute('a_lifetime', new THREE.BufferAttribute(lifetimes, 1));
        this.geometry.setAttribute('a_hexIndex', new THREE.BufferAttribute(hexIndices, 1));

        // Mark as dynamic (will be updated every frame)
        this.geometry.attributes.position.setUsage(THREE.DynamicDrawUsage);
        this.geometry.attributes.a_velocity.setUsage(THREE.DynamicDrawUsage);
        this.geometry.attributes.a_lifetime.setUsage(THREE.DynamicDrawUsage);
    }

    /**
     * Create particle material
     */
    createMaterial(globalUniforms) {
        this.material = new THREE.ShaderMaterial({
            uniforms: {
                ...globalUniforms
            },
            vertexShader: particleVertexShader,
            fragmentShader: particleFragmentShader,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthTest: false,
            depthWrite: false
        });
    }

    /**
     * Spawn construction burst for a hexagon
     */
    spawnConstructionBurst(hex, hexIndex) {
        const burstCount = 30 + Math.floor(Math.random() * 20); // 30-50 particles

        for (let i = 0; i < burstCount; i++) {
            const particle = this.getInactiveParticle();
            if (!particle) break;

            // Random position on hex perimeter
            const angle = Math.random() * Math.PI * 2;
            const radius = 50 + Math.random() * 10;

            particle.position.set(
                hex.x + Math.cos(angle) * radius,
                hex.y + Math.sin(angle) * radius,
                0
            );

            // Velocity tangent to edge + random jitter
            const tangentAngle = angle + Math.PI / 2;
            const speed = 30 + Math.random() * 20; // 30-50 px/s

            particle.velocity.set(
                Math.cos(tangentAngle) * speed + (Math.random() - 0.5) * 20,
                Math.sin(tangentAngle) * speed + (Math.random() - 0.5) * 20,
                0
            );

            particle.acceleration.set(0, 0, 0);
            particle.lifetime = 0;
            particle.maxLifetime = 0.3 + Math.random() * 0.2; // 0.3-0.5s
            particle.hexIndex = hexIndex;
            particle.active = true;

            this.activeParticles.add(particle);
        }
    }

    /**
     * Get inactive particle from pool
     */
    getInactiveParticle() {
        for (let i = 0; i < this.particlePool.length; i++) {
            if (!this.particlePool[i].active) {
                return this.particlePool[i];
            }
        }
        return null; // Pool exhausted
    }

    /**
     * Update particle system
     */
    update(deltaTime, stateMachine) {
        const positionsArray = this.geometry.attributes.position.array;
        const velocitiesArray = this.geometry.attributes.a_velocity.array;
        const lifetimesArray = this.geometry.attributes.a_lifetime.array;

        let particleIndex = 0;

        this.activeParticles.forEach((particle) => {
            if (particleIndex >= this.totalParticles) return;

            // Update lifetime
            particle.lifetime += deltaTime;

            if (particle.lifetime >= particle.maxLifetime) {
                // Particle dies
                particle.active = false;
                this.activeParticles.delete(particle);

                // Respawn in idle state
                if (stateMachine.currentState === 'idle' && particle.hexIndex >= 0) {
                    this.respawnParticle(particle, particle.hexIndex);
                }
            } else {
                // Update physics
                this.updateParticlePhysics(particle, deltaTime);

                // Write to geometry
                positionsArray[particleIndex * 3] = particle.position.x;
                positionsArray[particleIndex * 3 + 1] = particle.position.y;
                positionsArray[particleIndex * 3 + 2] = particle.position.z;

                velocitiesArray[particleIndex * 3] = particle.velocity.x;
                velocitiesArray[particleIndex * 3 + 1] = particle.velocity.y;
                velocitiesArray[particleIndex * 3 + 2] = particle.velocity.z;

                lifetimesArray[particleIndex] = particle.lifetime / particle.maxLifetime;

                particleIndex++;
            }
        });

        // Fill remaining slots with inactive particles (invisible)
        for (let i = particleIndex; i < this.totalParticles; i++) {
            positionsArray[i * 3] = 0;
            positionsArray[i * 3 + 1] = 0;
            positionsArray[i * 3 + 2] = 0;
            lifetimesArray[i] = 1.1; // >1.0 = invisible
        }

        // Mark geometry as needing update
        this.geometry.attributes.position.needsUpdate = true;
        this.geometry.attributes.a_velocity.needsUpdate = true;
        this.geometry.attributes.a_lifetime.needsUpdate = true;
    }

    /**
     * Update particle physics (velocity-based with magnetic attraction)
     */
    updateParticlePhysics(particle, deltaTime) {
        // Get parent hex
        const hex = this.hexGrid.hexagons[particle.hexIndex];
        if (!hex) return;

        // Calculate nearest hex edge (magnetic attraction)
        const dx = particle.position.x - hex.x;
        const dy = particle.position.y - hex.y;
        const angle = Math.atan2(dy, dx);
        const radius = 50;

        const targetX = hex.x + Math.cos(angle) * radius;
        const targetY = hex.y + Math.sin(angle) * radius;

        const toTargetX = targetX - particle.position.x;
        const toTargetY = targetY - particle.position.y;

        // Magnetic force (attraction to edge)
        const attractionStrength = 50.0;
        particle.acceleration.x = toTargetX * attractionStrength * deltaTime;
        particle.acceleration.y = toTargetY * attractionStrength * deltaTime;

        // Update velocity
        particle.velocity.x += particle.acceleration.x * deltaTime;
        particle.velocity.y += particle.acceleration.y * deltaTime;

        // Damping
        particle.velocity.multiplyScalar(0.98);

        // Update position
        particle.position.x += particle.velocity.x * deltaTime;
        particle.position.y += particle.velocity.y * deltaTime;
    }

    /**
     * Respawn particle (for idle state continuous motion)
     */
    respawnParticle(particle, hexIndex) {
        const hex = this.hexGrid.hexagons[hexIndex];
        if (!hex) return;

        // Random position on hex perimeter
        const angle = Math.random() * Math.PI * 2;
        const radius = 50;

        particle.position.set(
            hex.x + Math.cos(angle) * radius,
            hex.y + Math.sin(angle) * radius,
            0
        );

        // Slow orbital velocity
        const orbitalSpeed = 20;
        const tangentAngle = angle + Math.PI / 2;

        particle.velocity.set(
            Math.cos(tangentAngle) * orbitalSpeed,
            Math.sin(tangentAngle) * orbitalSpeed,
            0
        );

        particle.acceleration.set(0, 0, 0);
        particle.lifetime = 0;
        particle.maxLifetime = 2.0 + Math.random() * 2.0; // 2-4s lifetime
        particle.hexIndex = hexIndex;
        particle.active = true;

        this.activeParticles.add(particle);
    }

    /**
     * Reset all particles
     */
    reset() {
        this.activeParticles.clear();
        this.particlePool.forEach(p => {
            p.active = false;
            p.lifetime = 0;
        });
    }

    /**
     * Update capacity (on resize)
     */
    updateCapacity(newHexCount) {
        this.hexCount = newHexCount;
        this.particlesPerHex = this.calculateParticlesPerHex();
        this.totalParticles = newHexCount * this.particlesPerHex;

        console.log('[ParticleSystem] Updated capacity:', this.totalParticles);

        // Reallocate pool
        this.allocateParticlePool();

        // Recreate geometry
        if (this.geometry) this.geometry.dispose();
        this.createGeometry();

        // Update mesh
        if (this.mesh) {
            this.mesh.geometry = this.geometry;
        }
    }

    /**
     * Dispose resources
     */
    dispose() {
        if (this.geometry) this.geometry.dispose();
        if (this.material) this.material.dispose();
    }
}
