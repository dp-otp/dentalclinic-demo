/**
 * WOOPARCEL SCROLL ANIMATIONS
 *
 * Code overrides for scroll-triggered animations in Framer.
 *
 * USAGE:
 * 1. Import overrides in your Framer page
 * 2. Apply to layers: FadeUp, StaggerCards, CountUp, etc.
 * 3. Customize thresholds as needed
 */

import type { ComponentType } from "react"
import { useRef, useEffect, useState } from "react"
import { motion, useInView, useAnimation, Variants } from "framer-motion"

// ============================================================================
// TOKENS
// ============================================================================

const EASING = {
  smooth: [0.16, 1, 0.3, 1],
  spring: [0.34, 1.56, 0.64, 1],
}

const DURATION = {
  fast: 0.18,
  normal: 0.28,
  slow: 0.42,
  slower: 0.6,
}

// ============================================================================
// FADE UP (Basic reveal)
// ============================================================================

export function FadeUp(Component: ComponentType): ComponentType {
  return function WrappedComponent(props: any) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-20% 0px" })

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{
          duration: DURATION.slow,
          ease: EASING.smooth,
        }}
      >
        <Component {...props} />
      </motion.div>
    )
  }
}

// ============================================================================
// FADE UP DELAYED (For sequential reveals)
// ============================================================================

export function FadeUpDelay1(Component: ComponentType): ComponentType {
  return createDelayedFadeUp(Component, 0.08)
}

export function FadeUpDelay2(Component: ComponentType): ComponentType {
  return createDelayedFadeUp(Component, 0.16)
}

export function FadeUpDelay3(Component: ComponentType): ComponentType {
  return createDelayedFadeUp(Component, 0.24)
}

export function FadeUpDelay4(Component: ComponentType): ComponentType {
  return createDelayedFadeUp(Component, 0.32)
}

function createDelayedFadeUp(Component: ComponentType, delay: number): ComponentType {
  return function WrappedComponent(props: any) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-20% 0px" })

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{
          duration: DURATION.slow,
          ease: EASING.smooth,
          delay: isInView ? delay : 0,
        }}
      >
        <Component {...props} />
      </motion.div>
    )
  }
}

// ============================================================================
// STAGGER CONTAINER (Parent for staggered children)
// ============================================================================

const staggerContainerVariants: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 60, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: DURATION.slower,
      ease: EASING.smooth,
    },
  },
}

export function StaggerContainer(Component: ComponentType): ComponentType {
  return function WrappedComponent(props: any) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-10% 0px" })

    return (
      <motion.div
        ref={ref}
        variants={staggerContainerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <Component {...props} />
      </motion.div>
    )
  }
}

export function StaggerItem(Component: ComponentType): ComponentType {
  return function WrappedComponent(props: any) {
    return (
      <motion.div variants={staggerItemVariants}>
        <Component {...props} />
      </motion.div>
    )
  }
}

// ============================================================================
// CARD HOVER (3D tilt + lift)
// ============================================================================

export function CardHover(Component: ComponentType): ComponentType {
  return function WrappedComponent(props: any) {
    const [isHovered, setIsHovered] = useState(false)

    return (
      <motion.div
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        animate={{
          y: isHovered ? -8 : 0,
          scale: isHovered ? 1.02 : 1,
        }}
        transition={{
          duration: DURATION.slow,
          ease: EASING.smooth,
        }}
        style={{ cursor: "pointer" }}
      >
        <Component {...props} />
      </motion.div>
    )
  }
}

// ============================================================================
// CARD HOVER WITH GLOW
// ============================================================================

export function CardHoverGlow(Component: ComponentType): ComponentType {
  return function WrappedComponent(props: any) {
    const [isHovered, setIsHovered] = useState(false)

    return (
      <motion.div
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        animate={{
          y: isHovered ? -8 : 0,
          scale: isHovered ? 1.02 : 1,
          boxShadow: isHovered
            ? "0 24px 80px rgba(0, 0, 0, 0.5), 0 0 40px rgba(215, 122, 0, 0.15)"
            : "0 8px 24px rgba(0, 0, 0, 0.4)",
        }}
        transition={{
          duration: DURATION.slow,
          ease: EASING.smooth,
        }}
        style={{
          cursor: "pointer",
          borderRadius: 24,
        }}
      >
        <Component {...props} />
      </motion.div>
    )
  }
}

// ============================================================================
// COUNT UP (Animated numbers)
// ============================================================================

interface CountUpProps {
  target: number
  duration?: number
  suffix?: string
  prefix?: string
}

export function createCountUp({ target, duration = 1.2, suffix = "", prefix = "" }: CountUpProps) {
  return function CountUpOverride(Component: ComponentType): ComponentType {
    return function WrappedComponent(props: any) {
      const ref = useRef(null)
      const isInView = useInView(ref, { once: true, margin: "-20% 0px" })
      const [count, setCount] = useState(0)

      useEffect(() => {
        if (!isInView) return

        let startTime: number | null = null
        const animate = (timestamp: number) => {
          if (!startTime) startTime = timestamp
          const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)

          // Ease out
          const eased = 1 - Math.pow(1 - progress, 3)
          setCount(Math.floor(eased * target))

          if (progress < 1) {
            requestAnimationFrame(animate)
          }
        }

        requestAnimationFrame(animate)
      }, [isInView])

      return (
        <span ref={ref}>
          {prefix}{count}{suffix}
        </span>
      )
    }
  }
}

// Pre-configured count ups
export const CountUp20Years = createCountUp({ target: 20, suffix: "+" })
export const CountUp2M = createCountUp({ target: 2, suffix: "M+" })
export const CountUp190 = createCountUp({ target: 190, suffix: "+" })
export const CountUp40Percent = createCountUp({ target: 40, suffix: "%" })

// ============================================================================
// PARALLAX (Subtle scroll-based movement)
// ============================================================================

export function ParallaxSlow(Component: ComponentType): ComponentType {
  return function WrappedComponent(props: any) {
    const ref = useRef<HTMLDivElement>(null)
    const [offset, setOffset] = useState(0)

    useEffect(() => {
      const handleScroll = () => {
        if (!ref.current) return
        const rect = ref.current.getBoundingClientRect()
        const viewportHeight = window.innerHeight
        const elementCenter = rect.top + rect.height / 2
        const viewportCenter = viewportHeight / 2
        const distance = elementCenter - viewportCenter
        setOffset(distance * 0.05) // 5% parallax
      }

      window.addEventListener("scroll", handleScroll, { passive: true })
      handleScroll()
      return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
      <motion.div
        ref={ref}
        style={{ transform: `translateY(${offset}px)` }}
      >
        <Component {...props} />
      </motion.div>
    )
  }
}

// ============================================================================
// LINE DRAW (SVG path animation)
// ============================================================================

export function LineDraw(Component: ComponentType): ComponentType {
  return function WrappedComponent(props: any) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-30% 0px" })

    return (
      <motion.div
        ref={ref}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{
          pathLength: { duration: 1.2, ease: EASING.smooth },
          opacity: { duration: 0.3 },
        }}
      >
        <Component {...props} />
      </motion.div>
    )
  }
}

// ============================================================================
// SCALE IN (Pop effect)
// ============================================================================

export function ScaleIn(Component: ComponentType): ComponentType {
  return function WrappedComponent(props: any) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-20% 0px" })

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
        transition={{
          duration: DURATION.slower,
          ease: EASING.spring,
        }}
      >
        <Component {...props} />
      </motion.div>
    )
  }
}

// ============================================================================
// SLIDE IN FROM LEFT/RIGHT
// ============================================================================

export function SlideInLeft(Component: ComponentType): ComponentType {
  return function WrappedComponent(props: any) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-20% 0px" })

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, x: -60 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -60 }}
        transition={{
          duration: DURATION.slower,
          ease: EASING.smooth,
        }}
      >
        <Component {...props} />
      </motion.div>
    )
  }
}

export function SlideInRight(Component: ComponentType): ComponentType {
  return function WrappedComponent(props: any) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-20% 0px" })

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, x: 60 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 60 }}
        transition={{
          duration: DURATION.slower,
          ease: EASING.smooth,
        }}
      >
        <Component {...props} />
      </motion.div>
    )
  }
}

// ============================================================================
// BUTTON HOVER
// ============================================================================

export function ButtonPrimary(Component: ComponentType): ComponentType {
  return function WrappedComponent(props: any) {
    const [isHovered, setIsHovered] = useState(false)
    const [isPressed, setIsPressed] = useState(false)

    return (
      <motion.div
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onTapStart={() => setIsPressed(true)}
        onTap={() => setIsPressed(false)}
        onTapCancel={() => setIsPressed(false)}
        animate={{
          y: isPressed ? 0 : isHovered ? -2 : 0,
          scale: isPressed ? 0.98 : 1,
          boxShadow: isHovered
            ? "0 8px 32px rgba(215, 122, 0, 0.4)"
            : "0 4px 20px rgba(215, 122, 0, 0.3)",
        }}
        transition={{
          duration: DURATION.normal,
          ease: EASING.smooth,
        }}
        style={{ cursor: "pointer" }}
      >
        <Component {...props} />
      </motion.div>
    )
  }
}

export function ButtonSecondary(Component: ComponentType): ComponentType {
  return function WrappedComponent(props: any) {
    const [isHovered, setIsHovered] = useState(false)

    return (
      <motion.div
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        animate={{
          y: isHovered ? -2 : 0,
          backgroundColor: isHovered ? "rgba(255, 255, 255, 0.05)" : "transparent",
        }}
        transition={{
          duration: DURATION.normal,
          ease: EASING.smooth,
        }}
        style={{ cursor: "pointer" }}
      >
        <Component {...props} />
      </motion.div>
    )
  }
}

// ============================================================================
// NAV SCROLL STATE
// ============================================================================

export function NavScrolled(Component: ComponentType): ComponentType {
  return function WrappedComponent(props: any) {
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
      const handleScroll = () => {
        setScrolled(window.scrollY > 100)
      }

      window.addEventListener("scroll", handleScroll, { passive: true })
      handleScroll()
      return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
      <motion.div
        animate={{
          backgroundColor: scrolled ? "rgba(11, 12, 14, 0.85)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "blur(0px)",
          borderBottom: scrolled ? "1px solid rgba(255, 255, 255, 0.06)" : "1px solid transparent",
        }}
        transition={{
          duration: DURATION.normal,
          ease: EASING.smooth,
        }}
      >
        <Component {...props} />
      </motion.div>
    )
  }
}

// ============================================================================
// ACCORDION
// ============================================================================

export function AccordionTrigger(Component: ComponentType): ComponentType {
  return function WrappedComponent(props: any) {
    const [isOpen, setIsOpen] = useState(false)

    return (
      <motion.div
        onClick={() => setIsOpen(!isOpen)}
        style={{ cursor: "pointer" }}
        whileHover={{ color: "#D77A00" }}
        transition={{ duration: DURATION.fast }}
      >
        <Component {...props} data-open={isOpen} />
      </motion.div>
    )
  }
}

export function AccordionContent(Component: ComponentType): ComponentType {
  return function WrappedComponent(props: any) {
    // This would need to be connected to the trigger state
    // In Framer, use Component States for this

    return (
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{
          height: { duration: DURATION.normal, ease: EASING.smooth },
          opacity: { duration: DURATION.fast },
        }}
        style={{ overflow: "hidden" }}
      >
        <Component {...props} />
      </motion.div>
    )
  }
}

// ============================================================================
// ICON ARROW HOVER
// ============================================================================

export function ArrowHover(Component: ComponentType): ComponentType {
  return function WrappedComponent(props: any) {
    const [isHovered, setIsHovered] = useState(false)

    return (
      <motion.div
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        animate={{ x: isHovered ? 4 : 0 }}
        transition={{
          duration: DURATION.fast,
          ease: EASING.smooth,
        }}
      >
        <Component {...props} />
      </motion.div>
    )
  }
}
