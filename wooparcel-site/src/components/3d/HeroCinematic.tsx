'use client'

import { Suspense, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
// Removed @react-three/drei to avoid three-mesh-bvh version conflict
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'framer-motion'

// ============================================================================
// TYPES
// ============================================================================

interface HeroCinematicProps {
  onSequenceComplete?: () => void
}

// ============================================================================
// PARCEL COMPONENT
// ============================================================================

function Parcel({ visible }: { visible: boolean }) {
  const meshRef = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    if (!meshRef.current || !visible) return
    // Manual float animation (replaces @react-three/drei Float)
    const t = state.clock.elapsedTime
    meshRef.current.position.y = Math.sin(t * 2) * 0.15
    meshRef.current.rotation.y += delta * 0.15
    meshRef.current.rotation.x = Math.sin(t * 1.5) * 0.05
    meshRef.current.rotation.z = Math.cos(t * 1.2) * 0.03
  })

  if (!visible) return null

  return (
    <group ref={meshRef}>
      {/* Box body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2, 1.5, 1.5]} />
        <meshStandardMaterial
          color="#D77A00"
          roughness={0.4}
          metalness={0.2}
          emissive="#D77A00"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Lid */}
      <mesh position={[0, 0.8, 0]}>
        <boxGeometry args={[2.1, 0.1, 1.6]} />
        <meshStandardMaterial color="#B86A00" roughness={0.4} metalness={0.2} />
      </mesh>

      {/* Tape strip */}
      <mesh position={[0, 0.86, 0]}>
        <boxGeometry args={[0.3, 0.02, 1.6]} />
        <meshStandardMaterial color="#E8943A" roughness={0.6} />
      </mesh>

      {/* Label */}
      <mesh position={[0, 0, 0.76]}>
        <planeGeometry args={[1.2, 0.5]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.9} />
      </mesh>
    </group>
  )
}

// ============================================================================
// GLOBE COMPONENT
// ============================================================================

function Globe({ visible }: { visible: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [scale, setScale] = useState(0)

  useEffect(() => {
    if (visible) {
      const interval = setInterval(() => {
        setScale((s) => Math.min(s + 0.05, 1))
      }, 16)
      return () => clearInterval(interval)
    }
  }, [visible])

  useFrame((state, delta) => {
    if (!meshRef.current) return
    meshRef.current.rotation.y += delta * 0.2
  })

  if (!visible) return null

  return (
    <group scale={scale * 2}>
      {/* Globe sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          color="#4ECDC4"
          transparent
          opacity={0.3}
          roughness={0.1}
          metalness={0.8}
          emissive="#4ECDC4"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Inner sphere */}
      <mesh>
        <sphereGeometry args={[0.95, 32, 32]} />
        <meshStandardMaterial
          color="#0B0C0E"
          roughness={0.5}
          metalness={0.3}
        />
      </mesh>

      {/* Grid lines */}
      <mesh rotation={[0, 0, Math.PI / 4]}>
        <torusGeometry args={[1, 0.01, 16, 100]} />
        <meshStandardMaterial color="#4ECDC4" opacity={0.5} transparent />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1, 0.01, 16, 100]} />
        <meshStandardMaterial color="#4ECDC4" opacity={0.5} transparent />
      </mesh>

      {/* Data points */}
      {[
        [0.8, 0.3, 0.5],
        [-0.6, -0.4, 0.7],
        [-0.5, 0.6, 0.6],
        [0.7, -0.2, 0.6],
        [0.2, 0.8, 0.4],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial
            color="#FFC57A"
            emissive="#D77A00"
            emissiveIntensity={2}
          />
        </mesh>
      ))}
    </group>
  )
}

// ============================================================================
// SCENE
// ============================================================================

function Scene({ onSequenceComplete }: HeroCinematicProps) {
  const [phase, setPhase] = useState(0)
  const { camera } = useThree()

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 2000),
      setTimeout(() => {
        setPhase(3)
        onSequenceComplete?.()
      }, 3500),
    ]
    return () => timers.forEach(clearTimeout)
  }, [onSequenceComplete])

  useFrame((state, delta) => {
    if (phase >= 2) {
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, 5, delta * 2)
    }
  })

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#4ECDC4" />
      <spotLight
        position={[0, 10, 0]}
        angle={0.3}
        penumbra={1}
        intensity={1}
        color="#D77A00"
      />

      {/* Parcel */}
      <Parcel visible={phase < 2} />

      {/* Globe */}
      <Globe visible={phase >= 2} />

      {/* Additional ambient for environment feel */}
      <hemisphereLight args={['#1a1a2e', '#0B0C0E', 0.5]} />

      {/* Effects */}
      <EffectComposer>
        <Bloom luminanceThreshold={0.8} luminanceSmoothing={0.9} intensity={0.5} />
      </EffectComposer>
    </>
  )
}

// ============================================================================
// FALLBACK
// ============================================================================

function Fallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="w-16 h-16 rounded-full border-4 border-[#D77A00]/20 border-t-[#D77A00]"
      />
    </div>
  )
}

// ============================================================================
// CSS FALLBACK (for non-WebGL)
// ============================================================================

function CSSFallback({ onSequenceComplete }: HeroCinematicProps) {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 2000),
      setTimeout(() => {
        setPhase(3)
        onSequenceComplete?.()
      }, 3500),
    ]
    return () => timers.forEach(clearTimeout)
  }, [onSequenceComplete])

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.3, scale: 1.5 }}
        transition={{ duration: 2 }}
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(215, 122, 0, 0.3) 0%, transparent 70%)',
        }}
      />

      <div className="relative w-64 h-64">
        <AnimatePresence mode="wait">
          {phase < 2 ? (
            <motion.div
              key="parcel"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: [0, -15, 0] }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ y: { duration: 3, repeat: Infinity } }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-40 h-32 rounded-xl bg-gradient-to-br from-[#D77A00] to-[#B86A00] shadow-2xl flex items-center justify-center">
                <span className="text-white text-4xl font-bold">W</span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="globe"
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <motion.div
                animate={{ rotateY: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="w-48 h-48 rounded-full border-2 border-[#4ECDC4]/30"
                style={{
                  background: 'radial-gradient(circle at 30% 30%, rgba(78, 205, 196, 0.2) 0%, transparent 70%)',
                  boxShadow: 'inset 0 0 60px rgba(78, 205, 196, 0.2), 0 0 40px rgba(78, 205, 196, 0.2)',
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function HeroCinematic({ onSequenceComplete }: HeroCinematicProps) {
  const [isClient, setIsClient] = useState(false)
  const [hasWebGL, setHasWebGL] = useState(true)

  useEffect(() => {
    setIsClient(true)
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      setHasWebGL(!!gl)
    } catch {
      setHasWebGL(false)
    }
  }, [])

  if (!isClient) return <Fallback />
  if (!hasWebGL) return <CSSFallback onSequenceComplete={onSequenceComplete} />

  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 50 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <Scene onSequenceComplete={onSequenceComplete} />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default HeroCinematic
