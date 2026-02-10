'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { fadeUp, createDelayedFadeUp, easing, duration } from '@/lib/animations'

// Dynamically import the 3D component to avoid SSR issues
const HeroCinematic = dynamic(
  () => import('@/components/3d/HeroCinematic').then((mod) => mod.HeroCinematic),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full border-4 border-woop/20 border-t-woop animate-spin" />
      </div>
    ),
  }
)

const partnerLogos = [
  { name: 'Shopify', logo: 'Shopify' },
  { name: 'Amazon', logo: 'Amazon' },
  { name: 'WooCommerce', logo: 'WooCommerce' },
  { name: 'DHL', logo: 'DHL' },
  { name: 'FedEx', logo: 'FedEx' },
  { name: 'UPS', logo: 'UPS' },
]

export function HeroSection() {
  const [sequenceComplete, setSequenceComplete] = useState(false)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    // Show content with a slight delay for dramatic effect
    const timer = setTimeout(() => setShowContent(true), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-obsidian">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-hero opacity-60" />

      {/* 3D Canvas */}
      <div className="absolute inset-0 z-0">
        <HeroCinematic onSequenceComplete={() => setSequenceComplete(true)} />
      </div>

      {/* Content */}
      <div className="container-custom relative z-10 pt-24 pb-16 lg:pt-32 lg:pb-24">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatePresence>
            {showContent && (
              <>
                {/* Badge */}
                <motion.div
                  variants={createDelayedFadeUp(0.1)}
                  initial="hidden"
                  animate="visible"
                  className="mb-6"
                >
                  <Badge>For E-Commerce Brands</Badge>
                </motion.div>

                {/* Headline */}
                <motion.h1
                  variants={createDelayedFadeUp(0.2)}
                  initial="hidden"
                  animate="visible"
                  className="text-4xl sm:text-5xl lg:text-display-hero font-bold text-text-primary mb-6"
                >
                  Ship Smarter.{' '}
                  <span className="text-gradient">Scale Faster.</span>
                </motion.h1>

                {/* Subheadline */}
                <motion.p
                  variants={createDelayedFadeUp(0.3)}
                  initial="hidden"
                  animate="visible"
                  className="text-lg sm:text-xl lg:text-body-large text-text-secondary max-w-2xl mx-auto mb-8"
                >
                  The AI-powered logistics brain that finds the cheapest route, handles customs
                  automatically, and keeps your customers updated — so you can focus on selling.
                </motion.p>

                {/* CTAs */}
                <motion.div
                  variants={createDelayedFadeUp(0.4)}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
                >
                  <Button size="lg" href="/get-started">
                    Start Shipping Free
                  </Button>
                  <Button variant="secondary" size="lg" href="/demo">
                    Watch Demo
                  </Button>
                </motion.div>

                {/* Trust line */}
                <motion.p
                  variants={createDelayedFadeUp(0.5)}
                  initial="hidden"
                  animate="visible"
                  className="text-sm text-text-muted mb-12"
                >
                  <span className="inline-flex items-center gap-1">
                    <span className="text-success">✓</span> No credit card required
                  </span>
                  <span className="mx-3">·</span>
                  <span className="inline-flex items-center gap-1">
                    <span className="text-success">✓</span> Live in 5 minutes
                  </span>
                </motion.p>

                {/* Partner logos */}
                <motion.div
                  variants={createDelayedFadeUp(0.6)}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-wrap items-center justify-center gap-8 opacity-50"
                >
                  {partnerLogos.map((partner) => (
                    <span
                      key={partner.name}
                      className="text-text-muted text-sm font-medium tracking-wider"
                    >
                      {partner.logo}
                    </span>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          className="w-6 h-10 rounded-full border-2 border-text-muted/30 flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ height: ['20%', '40%', '20%'] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            className="w-1 bg-text-muted/50 rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
