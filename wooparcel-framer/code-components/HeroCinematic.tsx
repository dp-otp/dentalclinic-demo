/**
 * WOOPARCEL HERO CINEMATIC
 *
 * A flagship 3D hero experience with parcel → globe → interface transition.
 *
 * USAGE IN FRAMER:
 * 1. Create new Code Component
 * 2. Paste this entire file
 * 3. Place component in hero section
 * 4. Connect onSequenceEnd to trigger text reveals
 *
 * DEPENDENCIES (install via Framer):
 * - @react-three/fiber
 * - @react-three/drei
 * - @react-three/postprocessing
 * - three
 * - framer-motion
 */

import { addPropertyControls, ControlType } from "framer"
import { useRef, useState, useEffect, Suspense, useMemo } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import {
  Environment,
  Float,
  MeshDistortMaterial,
  useProgress,
  Html
} from "@react-three/drei"
import {
  EffectComposer,
  Bloom,
  Vignette,
  Noise
} from "@react-three/postprocessing"
import * as THREE from "three"
import { motion, AnimatePresence } from "framer-motion"

// ============================================================================
// DESIGN TOKENS (embedded for portability)
// ============================================================================

const TOKENS = {
  colors: {
    obsidian: "#0B0C0E",
    parcel: "#0A0A0A",
    accent: "#D77A00",
    glow: "#FFC57A",
    cyan: "#4ECDC4",
  },
  timing: {
    parcelEnter: 750,
    parcelHover: 1200,
    lidOpen: 400,
    cameraZoom: 350,
    globeFade: 500,
    textReveal: 800,
  },
  easing: {
    smooth: [0.16, 0.84, 0.32, 1],
    spring: [0.34, 1.56, 0.64, 1],
    cinematic: [0.22, 0.9, 0.29, 1],
  },
}

// ============================================================================
// ANIMATION TIMELINE HOOK
// ============================================================================

type Phase = "entering" | "hovering" | "opening" | "zooming" | "globe" | "complete"

function useAnimationTimeline(autoPlay: boolean, delay: number) {
  const [phase, setPhase] = useState<Phase>("entering")
  const [progress, setProgress] = useState(0)
  const startTime = useRef<number | null>(null)

  useEffect(() => {
    if (!autoPlay) return

    const timeout = setTimeout(() => {
      startTime.current = Date.now()

      const animate = () => {
        if (!startTime.current) return
        const elapsed = Date.now() - startTime.current
        setProgress(elapsed)

        // Phase transitions based on timeline
        if (elapsed < TOKENS.timing.parcelEnter) {
          setPhase("entering")
        } else if (elapsed < TOKENS.timing.parcelEnter + TOKENS.timing.parcelHover) {
          setPhase("hovering")
        } else if (elapsed < TOKENS.timing.parcelEnter + TOKENS.timing.parcelHover + TOKENS.timing.lidOpen) {
          setPhase("opening")
        } else if (elapsed < TOKENS.timing.parcelEnter + TOKENS.timing.parcelHover + TOKENS.timing.lidOpen + TOKENS.timing.cameraZoom) {
          setPhase("zooming")
        } else if (elapsed < TOKENS.timing.parcelEnter + TOKENS.timing.parcelHover + TOKENS.timing.lidOpen + TOKENS.timing.cameraZoom + TOKENS.timing.globeFade) {
          setPhase("globe")
        } else {
          setPhase("complete")
          return // Stop animation loop
        }

        requestAnimationFrame(animate)
      }

      requestAnimationFrame(animate)
    }, delay)

    return () => clearTimeout(timeout)
  }, [autoPlay, delay])

  return { phase, progress }
}

// ============================================================================
// PARCEL COMPONENT
// ============================================================================

interface ParcelProps {
  phase: Phase
  progress: number
  accentColor: string
}

function Parcel({ phase, progress, accentColor }: ParcelProps) {
  const bodyRef = useRef<THREE.Mesh>(null)
  const lidRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.PointLight>(null)

  // Animation calculations
  useFrame((state) => {
    if (!bodyRef.current || !lidRef.current) return

    const t = progress / 1000 // Convert to seconds

    // Phase: Entering
    if (phase === "entering") {
      const enterProgress = Math.min(progress / TOKENS.timing.parcelEnter, 1)
      const eased = easeOutExpo(enterProgress)

      // Position: fly in from depth
      bodyRef.current.position.z = THREE.MathUtils.lerp(-8, 0, eased)

      // Rotation: subtle tumble settling
      bodyRef.current.rotation.y = THREE.MathUtils.lerp(0.4, 0.2, eased)
      bodyRef.current.rotation.x = THREE.MathUtils.lerp(-0.2, 0, eased)

      // Scale: grow in
      const scale = THREE.MathUtils.lerp(0.6, 1, eased)
      bodyRef.current.scale.setScalar(scale)
    }

    // Phase: Hovering (breathing)
    if (phase === "hovering") {
      const hoverT = (progress - TOKENS.timing.parcelEnter) / 1000

      // Subtle breathing scale
      const breathe = 1 + Math.sin(hoverT * 2) * 0.006
      bodyRef.current.scale.setScalar(breathe)

      // Gentle sway
      bodyRef.current.rotation.y = 0.2 + Math.sin(hoverT * 1.5) * 0.03
      bodyRef.current.position.y = Math.sin(hoverT * 2) * 0.02
    }

    // Phase: Opening
    if (phase === "opening") {
      const openProgress = (progress - TOKENS.timing.parcelEnter - TOKENS.timing.parcelHover) / TOKENS.timing.lidOpen
      const eased = easeOutBack(Math.min(openProgress, 1))

      // Lid opens
      lidRef.current.rotation.x = THREE.MathUtils.lerp(0, -Math.PI * 0.6, eased)

      // Interior glow intensifies
      if (glowRef.current) {
        glowRef.current.intensity = THREE.MathUtils.lerp(0, 3, eased)
      }
    }

    // Phase: Zooming (camera takes over, parcel holds)
    if (phase === "zooming" || phase === "globe" || phase === "complete") {
      // Fade out parcel
      const fadeProgress = phase === "zooming"
        ? (progress - TOKENS.timing.parcelEnter - TOKENS.timing.parcelHover - TOKENS.timing.lidOpen) / TOKENS.timing.cameraZoom
        : 1

      if (bodyRef.current.material instanceof THREE.MeshStandardMaterial) {
        bodyRef.current.material.opacity = 1 - Math.min(fadeProgress, 1)
      }
    }
  })

  // Easing functions
  function easeOutExpo(t: number): number {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
  }

  function easeOutBack(t: number): number {
    const c1 = 1.70158
    const c3 = c1 + 1
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
  }

  const visible = phase !== "complete"

  return (
    <group visible={visible}>
      {/* Parcel Body */}
      <mesh ref={bodyRef} position={[0, 0, -8]}>
        <boxGeometry args={[1, 0.6, 1, 4, 4, 4]} />
        <meshStandardMaterial
          color={TOKENS.colors.parcel}
          metalness={0.05}
          roughness={0.85}
          transparent
        />
      </mesh>

      {/* Parcel Lid (separate for animation) */}
      <mesh ref={lidRef} position={[0, 0.3, 0]}>
        <boxGeometry args={[1.02, 0.1, 1.02]} />
        <meshStandardMaterial
          color={TOKENS.colors.parcel}
          metalness={0.05}
          roughness={0.85}
        />
      </mesh>

      {/* Embossed Logo on Lid */}
      <mesh position={[0, 0.36, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.3, 0.3]} />
        <meshStandardMaterial
          color={accentColor}
          metalness={0.9}
          roughness={0.25}
          emissive={accentColor}
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Interior Glow Light */}
      <pointLight
        ref={glowRef}
        position={[0, 0, 0]}
        color={accentColor}
        intensity={0}
        distance={2}
        decay={2}
      />
    </group>
  )
}

// ============================================================================
// GLOBE COMPONENT
// ============================================================================

interface GlobeProps {
  phase: Phase
  progress: number
  colorA: string
  colorB: string
}

function Globe({ phase, progress, colorA, colorB }: GlobeProps) {
  const groupRef = useRef<THREE.Group>(null)
  const linesRef = useRef<THREE.LineSegments>(null)

  // Create wireframe geometry
  const wireframe = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1.5, 2)
    return new THREE.WireframeGeometry(geo)
  }, [])

  // Animation
  useFrame((state) => {
    if (!groupRef.current || !linesRef.current) return

    // Only visible during globe phase
    const isVisible = phase === "globe" || phase === "zooming"
    groupRef.current.visible = isVisible

    if (isVisible) {
      // Fade in
      const fadeStart = TOKENS.timing.parcelEnter + TOKENS.timing.parcelHover + TOKENS.timing.lidOpen + TOKENS.timing.cameraZoom
      const fadeProgress = (progress - fadeStart) / TOKENS.timing.globeFade

      if (linesRef.current.material instanceof THREE.LineBasicMaterial) {
        linesRef.current.material.opacity = Math.min(fadeProgress, 0.9)
      }

      // Slow rotation
      groupRef.current.rotation.y += 0.002
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  return (
    <group ref={groupRef} visible={false}>
      <lineSegments ref={linesRef} geometry={wireframe}>
        <lineBasicMaterial
          color={colorA}
          transparent
          opacity={0}
          linewidth={1}
        />
      </lineSegments>

      {/* Secondary lines for depth */}
      <lineSegments geometry={wireframe} scale={0.85}>
        <lineBasicMaterial
          color={colorB}
          transparent
          opacity={0.3}
          linewidth={1}
        />
      </lineSegments>
    </group>
  )
}

// ============================================================================
// CAMERA CONTROLLER
// ============================================================================

interface CameraControllerProps {
  phase: Phase
  progress: number
}

function CameraController({ phase, progress }: CameraControllerProps) {
  const { camera } = useThree()

  useFrame(() => {
    const targetZ = phase === "zooming" || phase === "globe" || phase === "complete"
      ? 0.5
      : 5

    camera.position.z = THREE.MathUtils.lerp(
      camera.position.z,
      targetZ,
      0.05
    )

    // FOV shift for dramatic zoom
    if (camera instanceof THREE.PerspectiveCamera) {
      const targetFov = phase === "zooming" ? 75 : 45
      camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, 0.05)
      camera.updateProjectionMatrix()
    }
  })

  return null
}

// ============================================================================
// LOADING COMPONENT
// ============================================================================

function Loader() {
  const { progress } = useProgress()

  return (
    <Html center>
      <div style={{
        color: TOKENS.colors.glow,
        fontSize: 14,
        fontFamily: "Inter, sans-serif",
        opacity: progress < 100 ? 1 : 0,
        transition: "opacity 0.3s",
      }}>
        {progress.toFixed(0)}%
      </div>
    </Html>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

interface HeroCinematicProps {
  autoPlay?: boolean
  delay?: number
  parcelColor?: string
  accentColor?: string
  globeColorA?: string
  globeColorB?: string
  onSequenceStart?: () => void
  onSequenceEnd?: () => void
  width?: number | string
  height?: number | string
}

export function HeroCinematic({
  autoPlay = true,
  delay = 0,
  parcelColor = TOKENS.colors.parcel,
  accentColor = TOKENS.colors.accent,
  globeColorA = TOKENS.colors.accent,
  globeColorB = TOKENS.colors.cyan,
  onSequenceStart,
  onSequenceEnd,
  width = "100%",
  height = 600,
}: HeroCinematicProps) {
  const { phase, progress } = useAnimationTimeline(autoPlay, delay)
  const hasStarted = useRef(false)
  const hasEnded = useRef(false)

  // Callbacks
  useEffect(() => {
    if (phase !== "entering" && !hasStarted.current) {
      hasStarted.current = true
      onSequenceStart?.()
    }
    if (phase === "complete" && !hasEnded.current) {
      hasEnded.current = true
      onSequenceEnd?.()
    }
  }, [phase, onSequenceStart, onSequenceEnd])

  // Check for WebGL support
  const [hasWebGL, setHasWebGL] = useState(true)
  useEffect(() => {
    try {
      const canvas = document.createElement("canvas")
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
      setHasWebGL(!!gl)
    } catch (e) {
      setHasWebGL(false)
    }
  }, [])

  // Fallback for no WebGL
  if (!hasWebGL) {
    return (
      <div
        style={{
          width,
          height,
          background: TOKENS.colors.obsidian,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <video
          src="/hero-fallback.mp4"
          autoPlay
          muted
          playsInline
          style={{ maxWidth: "100%", maxHeight: "100%" }}
          onEnded={onSequenceEnd}
        />
      </div>
    )
  }

  return (
    <div
      style={{
        width,
        height,
        background: TOKENS.colors.obsidian,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Canvas
        camera={{ position: [0, 0.2, 5], fov: 45 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
      >
        <Suspense fallback={<Loader />}>
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <spotLight
            position={[5, 5, 5]}
            color={TOKENS.colors.glow}
            intensity={0.8}
            angle={Math.PI / 6}
            penumbra={0.5}
          />
          <pointLight
            position={[-3, 2, 3]}
            color={TOKENS.colors.cyan}
            intensity={0.3}
          />

          {/* Scene Objects */}
          <Parcel
            phase={phase}
            progress={progress}
            accentColor={accentColor}
          />
          <Globe
            phase={phase}
            progress={progress}
            colorA={globeColorA}
            colorB={globeColorB}
          />

          {/* Camera */}
          <CameraController phase={phase} progress={progress} />

          {/* Post-processing */}
          <EffectComposer>
            <Bloom
              luminanceThreshold={0.7}
              luminanceSmoothing={0.3}
              intensity={0.35}
            />
            <Noise opacity={0.03} />
            <Vignette darkness={0.45} offset={0.35} />
          </EffectComposer>
        </Suspense>
      </Canvas>

      {/* Gradient overlay for seamless transition to content */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 120,
          background: `linear-gradient(to top, ${TOKENS.colors.obsidian}, transparent)`,
          pointerEvents: "none",
        }}
      />
    </div>
  )
}

// ============================================================================
// FRAMER PROPERTY CONTROLS
// ============================================================================

addPropertyControls(HeroCinematic, {
  autoPlay: {
    type: ControlType.Boolean,
    title: "Auto Play",
    defaultValue: true,
  },
  delay: {
    type: ControlType.Number,
    title: "Delay (ms)",
    defaultValue: 0,
    min: 0,
    max: 5000,
    step: 100,
  },
  accentColor: {
    type: ControlType.Color,
    title: "Accent",
    defaultValue: TOKENS.colors.accent,
  },
  globeColorA: {
    type: ControlType.Color,
    title: "Globe Primary",
    defaultValue: TOKENS.colors.accent,
  },
  globeColorB: {
    type: ControlType.Color,
    title: "Globe Secondary",
    defaultValue: TOKENS.colors.cyan,
  },
  height: {
    type: ControlType.Number,
    title: "Height",
    defaultValue: 600,
    min: 300,
    max: 1000,
  },
})

export default HeroCinematic
