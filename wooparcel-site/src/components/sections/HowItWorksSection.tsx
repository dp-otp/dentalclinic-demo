'use client'

import { motion } from 'framer-motion'
import { Section, SectionHeader } from '@/components/ui/Section'
import { staggerContainer, staggerItem, fadeUp } from '@/lib/animations'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

const steps = [
  {
    number: '01',
    title: 'Connect',
    description: 'Link your Shopify, Amazon, or WooCommerce store in one click.',
  },
  {
    number: '02',
    title: 'Configure',
    description: 'Set your preferences — speed vs. cost, notification style, branding.',
  },
  {
    number: '03',
    title: 'Ship',
    description: 'Orders sync automatically. We generate labels and book pickups.',
  },
  {
    number: '04',
    title: 'Track',
    description: 'You and your customers get real-time updates. We handle exceptions.',
  },
]

export function HowItWorksSection() {
  const [ref, isInView] = useScrollAnimation<HTMLDivElement>()

  return (
    <Section background="elevated" padding="xl">
      <div className="container-custom">
        <SectionHeader
          badge="How It Works"
          title="Live in 5 Minutes"
          description="Four simple steps to transform your shipping operations forever."
        />

        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="relative"
        >
          {/* Desktop horizontal timeline */}
          <div className="hidden lg:block">
            {/* Connecting line */}
            <motion.div
              variants={fadeUp}
              className="absolute top-[32px] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-transparent via-woop/30 to-transparent"
            />

            <div className="grid grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  variants={staggerItem}
                  className="text-center relative"
                >
                  {/* Number circle */}
                  <div className="relative z-10 w-16 h-16 mx-auto mb-6 rounded-full border-2 border-woop bg-obsidian flex items-center justify-center">
                    <span className="text-woop font-bold text-lg">{step.number}</span>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-text-primary mb-3">
                    {step.title}
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mobile/Tablet vertical timeline */}
          <div className="lg:hidden relative">
            {/* Vertical line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-woop/30 via-woop/50 to-woop/30" />

            <div className="space-y-12">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  variants={staggerItem}
                  className="relative flex gap-6"
                >
                  {/* Number circle */}
                  <div className="relative z-10 w-16 h-16 rounded-full border-2 border-woop bg-obsidian flex items-center justify-center flex-shrink-0">
                    <span className="text-woop font-bold text-lg">{step.number}</span>
                  </div>

                  {/* Content */}
                  <div className="pt-2">
                    <h3 className="text-xl font-semibold text-text-primary mb-2">
                      {step.title}
                    </h3>
                    <p className="text-text-secondary leading-relaxed">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  )
}
