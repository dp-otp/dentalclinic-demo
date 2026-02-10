'use client'

import { motion } from 'framer-motion'
import { Section } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'
import { fadeUp, staggerContainer, staggerItem } from '@/lib/animations'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

export function CTASection() {
  const [ref, isInView] = useScrollAnimation<HTMLDivElement>()

  return (
    <Section padding="xl" className="relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-radial from-woop/10 via-transparent to-transparent opacity-50" />

      <div className="container-custom relative">
        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.h2
            variants={fadeUp}
            className="text-3xl sm:text-4xl lg:text-display-h1 font-bold text-text-primary mb-6"
          >
            Ready to Ship Smarter?
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="text-lg sm:text-xl text-text-secondary mb-10"
          >
            Join 2,000+ brands saving time and money with WooParcel.
            <br className="hidden sm:block" />
            No credit card required. Live in 5 minutes.
          </motion.p>

          <motion.div
            variants={staggerItem}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
          >
            <Button size="lg" href="/get-started">
              Start Shipping Free
            </Button>
            <Button variant="secondary" size="lg" href="/contact">
              Talk to Sales
            </Button>
          </motion.div>

          <motion.p variants={fadeUp} className="text-text-muted text-sm">
            Questions? Chat with us on{' '}
            <a
              href="https://wa.me/447000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="text-success hover:underline"
            >
              WhatsApp
            </a>{' '}
            — we reply in minutes.
          </motion.p>
        </motion.div>
      </div>
    </Section>
  )
}
