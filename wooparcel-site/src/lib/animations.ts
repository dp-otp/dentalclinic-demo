import { Variants } from 'framer-motion'

// Easing curves
export const easing = {
  smooth: [0.16, 1, 0.3, 1],
  spring: [0.34, 1.56, 0.64, 1],
}

// Duration constants
export const duration = {
  fast: 0.18,
  normal: 0.28,
  slow: 0.42,
  slower: 0.6,
}

// Fade Up animation
export const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.slow,
      ease: easing.smooth,
    },
  },
}

// Fade In animation
export const fadeIn: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: duration.slow,
      ease: easing.smooth,
    },
  },
}

// Scale In animation
export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.85,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: duration.slower,
      ease: easing.spring,
    },
  },
}

// Slide from left
export const slideInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -60,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: duration.slower,
      ease: easing.smooth,
    },
  },
}

// Slide from right
export const slideInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 60,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: duration.slower,
      ease: easing.smooth,
    },
  },
}

// Stagger container
export const staggerContainer: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

// Stagger item
export const staggerItem: Variants = {
  hidden: {
    opacity: 0,
    y: 60,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: duration.slower,
      ease: easing.smooth,
    },
  },
}

// Card hover animation
export const cardHover = {
  rest: {
    y: 0,
    scale: 1,
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
  },
  hover: {
    y: -8,
    scale: 1.02,
    boxShadow: '0 24px 80px rgba(0, 0, 0, 0.5), 0 0 40px rgba(215, 122, 0, 0.15)',
    transition: {
      duration: duration.slow,
      ease: easing.smooth,
    },
  },
}

// Button hover animation
export const buttonHover = {
  rest: {
    y: 0,
    scale: 1,
  },
  hover: {
    y: -2,
    transition: {
      duration: duration.normal,
      ease: easing.smooth,
    },
  },
  tap: {
    scale: 0.98,
  },
}

// Nav scroll animation
export const navScroll = {
  top: {
    backgroundColor: 'transparent',
    backdropFilter: 'blur(0px)',
    borderBottom: '1px solid transparent',
  },
  scrolled: {
    backgroundColor: 'rgba(11, 12, 14, 0.85)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
  },
}

// Hero sequence timings (in seconds)
export const heroTimeline = {
  parcelEnter: { start: 0, duration: 0.75 },
  parcelHover: { start: 0.75, duration: 1.2 },
  lidOpen: { start: 1.95, duration: 0.4 },
  cameraZoom: { start: 2.35, duration: 0.35 },
  globeAppear: { start: 2.7, duration: 0.5 },
  textReveal: { start: 3.2, duration: 0.8 },
  total: 4.5,
}

// Delayed fade up generator
export function createDelayedFadeUp(delay: number): Variants {
  return {
    hidden: {
      opacity: 0,
      y: 40,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: duration.slow,
        ease: easing.smooth,
        delay,
      },
    },
  }
}
