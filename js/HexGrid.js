/**
 * HexGrid - Responsive Hexagon Grid Generator
 *
 * Generates a dense hexagonal mesh that adapts to viewport size:
 * - Mobile (< 768px): 40-60 hexagons
 * - Tablet (768-1200px): 80-120 hexagons
 * - Desktop (> 1200px): 120-180 hexagons
 *
 * Each hexagon has:
 * - 3 line layers (inner, core, outer)
 * - 6 sides × 30 segments per side = 180 segments per layer
 * - Total: 540 line segments per hexagon
 */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/+esm';
import { hexVertexShader } from './shaders/hex-vertex.glsl.js';
import { hexFragmentShader } from './shaders/hex-fragment.glsl.js';

export class HexGrid {
    constructor(viewportSize) {
        this.viewportSize = viewportSize;
        this.hexagons = [];
        this.linesMesh = null;
        this.material = null;
        this.geometry = null;

        // Hex parameters
        this.hexRadius = this.calculateHexRadius(viewportSize);
        this.spacing = this.hexRadius * 1.73; // Hex grid spacing (sqrt(3))
    }

    /**
     * Calculate hex radius based on viewport size
     */
    calculateHexRadius(size) {
        // Responsive sizing
        if (size.width < 768) {
            return 45; // Mobile: larger hexes, fewer count
        } else if (size.width < 1200) {
            return 50; // Tablet
        } else {
            return 55; // Desktop
        }
    }

    /**
     * Initialize the hex grid
     */
    async init(scene, globalUniforms) {
        console.log('[HexGrid] Generating grid...');

        // Generate hexagon positions
        this.generateHexagons();

        // Create instanced line geometry
        this.createLineGeometry();

        // Create shader material
        this.createMaterial(globalUniforms);

        // Create mesh
        this.linesMesh = new THREE.LineSegments(this.geometry, this.material);
        scene.add(this.linesMesh);

        console.log('[HexGrid] ✓ Generated', this.hexagons.length, 'hexagons');
    }

    /**
     * Generate hexagon positions (responsive grid)
     */
    generateHexagons() {
        this.hexagons = [];

        const w = this.viewportSize.width;
        const h = this.viewportSize.height;

        // Calculate grid dimensions
        const hexWidth = this.spacing;
        const hexHeight = this.hexRadius * 1.5;

        const cols = Math.ceil(w / hexWidth) + 3; // Extra for padding
        const rows = Math.ceil(h / hexHeight) + 3;

        // Generate grid (centered at 0,0)
        for (let row = -1; row < rows; row++) {
            for (let col = -1; col < cols; col++) {
                // Offset every other row (hexagonal grid)
                const xOffset = (row % 2) * (hexWidth / 2);
                const x = col * hexWidth + xOffset - w / 2;
                const y = row * hexHeight - h / 2;

                // Calculate normalized position
                const normX = (x + w / 2) / w;
                const normY = (y + h / 2) / h;

                // Distance from center
                const distFromCenter = Math.sqrt(
                    Math.pow(normX - 0.5, 2) + Math.pow(normY - 0.5, 2)
                );

                // Random seed for variation
                const seed = Math.random();

                // Jitter position slightly
                const jitterX = (Math.random() - 0.5) * 4;
                const jitterY = (Math.random() - 0.5) * 4;

                this.hexagons.push({
                    x: x + jitterX,
                    y: y + jitterY,
                    normX,
                    normY,
                    distFromCenter,
                    seed,
                    rotation: (Math.random() - 0.5) * 6 * (Math.PI / 180), // ±6° jitter
                    state: 'fetus', // Initial state
                    constructionProgress: 0,
                    deconstructionProgress: 0,
                    constructionStart: 0,
                    deconstructionStart: 0,
                    flipStartTime: null
                });
            }
        }
    }

    /**
     * Create multi-layer line geometry (3 layers per hexagon)
     * Uses continuous line strips for clear hexagonal outlines
     */
    createLineGeometry() {
        const positions = [];
        const progresses = [];
        const seeds = [];
        const hexSeeds = [];
        const distFromCenters = [];
        const layers = [];
        const hexCenters = [];
        const segmentIndices = [];

        this.hexagons.forEach((hex, hexIndex) => {
            const LAYERS = 3; // Inner, core, outer

            for (let layer = 0; layer < LAYERS; layer++) {
                const layerOffset = (layer - 1) * 3; // -3, 0, +3 pixels (slightly larger spacing)
                const layerRadius = this.hexRadius + layerOffset;

                // 6 sides of hexagon
                for (let side = 0; side < 6; side++) {
                    const angle1 = (Math.PI / 3) * side;
                    const angle2 = (Math.PI / 3) * (side + 1);

                    // Rotate based on hex.rotation
                    const cos1 = Math.cos(angle1 + hex.rotation);
                    const sin1 = Math.sin(angle1 + hex.rotation);
                    const cos2 = Math.cos(angle2 + hex.rotation);
                    const sin2 = Math.sin(angle2 + hex.rotation);

                    const x1 = hex.x + layerRadius * cos1;
                    const y1 = hex.y + layerRadius * sin1;
                    const x2 = hex.x + layerRadius * cos2;
                    const y2 = hex.y + layerRadius * sin2;

                    // Break side into fewer segments for clearer outlines (12 instead of 30)
                    const SEGMENTS = 12;

                    for (let seg = 0; seg < SEGMENTS; seg++) {
                        const t1 = seg / SEGMENTS;
                        const t2 = (seg + 1) / SEGMENTS;

                        const px1 = x1 + (x2 - x1) * t1;
                        const py1 = y1 + (y2 - y1) * t1;
                        const px2 = x1 + (x2 - x1) * t2;
                        const py2 = y1 + (y2 - y1) * t2;

                        // Add line segment (2 vertices)
                        positions.push(px1, py1, 0, px2, py2, 0);

                        // Progress along entire hexagon perimeter (0-1 around whole shape)
                        const hexProgress1 = (side + t1) / 6.0;
                        const hexProgress2 = (side + t2) / 6.0;
                        progresses.push(hexProgress1, hexProgress2);

                        // Segment-specific seed
                        const segmentSeed = Math.random();
                        seeds.push(segmentSeed, segmentSeed);

                        // Hex-specific seed
                        hexSeeds.push(hex.seed, hex.seed);

                        // Distance from center
                        distFromCenters.push(hex.distFromCenter, hex.distFromCenter);

                        // Layer index (0, 1, 2)
                        layers.push(layer, layer);

                        // Hex center position
                        hexCenters.push(hex.x, hex.y, hex.x, hex.y);

                        // Segment index within entire hexagon (0-71 for 12 segments × 6 sides)
                        const globalSegIdx = side * SEGMENTS + seg;
                        segmentIndices.push(globalSegIdx, globalSegIdx);
                    }
                }
            }
        });

        // Create buffer geometry
        this.geometry = new THREE.BufferGeometry();
        this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        this.geometry.setAttribute('a_progress', new THREE.Float32BufferAttribute(progresses, 1));
        this.geometry.setAttribute('a_seed', new THREE.Float32BufferAttribute(seeds, 1));
        this.geometry.setAttribute('a_hexSeed', new THREE.Float32BufferAttribute(hexSeeds, 1));
        this.geometry.setAttribute('a_distFromCenter', new THREE.Float32BufferAttribute(distFromCenters, 1));
        this.geometry.setAttribute('a_layer', new THREE.Float32BufferAttribute(layers, 1));
        this.geometry.setAttribute('a_hexCenter', new THREE.Float32BufferAttribute(hexCenters, 2));
        this.geometry.setAttribute('a_segmentIndex', new THREE.Float32BufferAttribute(segmentIndices, 1));

        console.log('[HexGrid] Geometry created:', {
            vertices: positions.length / 3,
            segments: positions.length / 6,
            hexagons: this.hexagons.length,
            segmentsPerHexSide: 12
        });
    }

    /**
     * Create shader material
     */
    createMaterial(globalUniforms) {
        this.material = new THREE.ShaderMaterial({
            uniforms: {
                ...globalUniforms,
                u_hexRadius: { value: this.hexRadius }
            },
            vertexShader: hexVertexShader,
            fragmentShader: hexFragmentShader,
            transparent: true,
            blending: THREE.NormalBlending, // Changed from AdditiveBlending for clearer, solid outlines
            depthTest: false,
            depthWrite: false
        });
    }

    /**
     * Regenerate grid (on resize)
     */
    regenerate(newViewportSize) {
        console.log('[HexGrid] Regenerating for new viewport:', newViewportSize);

        this.viewportSize = newViewportSize;
        this.hexRadius = this.calculateHexRadius(newViewportSize);
        this.spacing = this.hexRadius * 1.73;

        // Dispose old geometry
        if (this.geometry) {
            this.geometry.dispose();
        }

        // Regenerate
        this.generateHexagons();
        this.createLineGeometry();

        // Update mesh
        if (this.linesMesh) {
            this.linesMesh.geometry = this.geometry;
        }

        // Update uniform
        this.material.uniforms.u_hexRadius.value = this.hexRadius;
    }

    /**
     * Dispose resources
     */
    dispose() {
        if (this.geometry) this.geometry.dispose();
        if (this.material) this.material.dispose();
    }
}
