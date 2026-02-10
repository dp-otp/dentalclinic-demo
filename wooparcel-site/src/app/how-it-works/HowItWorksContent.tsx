'use client'

import { motion } from 'framer-motion'
import { Section, SectionHeader } from '@/components/ui/Section'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { IconCheck } from '@/components/ui/Icons'
import { staggerContainer, staggerItem, fadeUp, slideInLeft, slideInRight } from '@/lib/animations'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

const steps = [
  {
    number: '01',
    title: 'Connect Your Store',
    description:
      'Link your e-commerce platform in one click. We integrate with Shopify, WooCommerce, Amazon, eBay, and 50+ other platforms.',
    features: [
      'One-click integration',
      'Automatic order sync',
      'Real-time inventory updates',
      'Multi-store support',
    ],
  },
  {
    number: '02',
    title: 'Configure Your Preferences',
    description:
      'Set up your shipping rules, notification preferences, and branding. Our AI learns from your choices to optimize every shipment.',
    features: [
      'Custom shipping rules',
      'Branded tracking pages',
      'Notification templates',
      'Carrier preferences',
    ],
  },
  {
    number: '03',
    title: 'Ship Automatically',
    description:
      'Orders flow in automatically. We select the best carrier, generate labels, and book pickups — all without manual intervention.',
    features: [
      'AI carrier selection',
      'Automatic label generation',
      'Scheduled pickups',
      'Customs documentation',
    ],
  },
  {
    number: '04',
    title: 'Track & Delight',
    description:
      'You and your customers get real-time updates. We handle exceptions proactively so you can focus on growing your business.',
    features: [
      'Real-time tracking',
      'Proactive notifications',
      'Exception handling',
      'Customer satisfaction',
    ],
  },
]

const integrations = [
  { name: 'Shopify', category: 'E-commerce' },
  { name: 'WooCommerce', category: 'E-commerce' },
  { name: 'Amazon', category: 'Marketplace' },
  { name: 'eBay', category: 'Marketplace' },
  { name: 'BigCommerce', category: 'E-commerce' },
  { name: 'Magento', category: 'E-commerce' },
  { name: 'Etsy', category: 'Marketplace' },
  { name: 'Squarespace', category: 'E-commerce' },
]

export function HowItWorksContent() {
  const [ref, isInView] = useScrollAnimation<HTMLDivElement>()

  return (
    <>
      {/* Hero */}
      <Section padding="xl" className="pt-32">
        <div className="container-custom">
          <SectionHeader
            badge="How It Works"
            title="From Order to Delivery in 4 Simple Steps"
            description="WooParcel automates your entire shipping workflow. Connect once, ship forever."
          />
        </div>
      </Section>

      {/* Steps */}
      <Section background="elevated" padding="xl">
        <div className="container-custom">
          <motion.div
            ref={ref}
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="space-y-24"
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={index % 2 === 0 ? slideInLeft : slideInRight}
                className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-woop/10 border border-woop/20 flex items-center justify-center">
                      <span className="text-woop font-bold text-2xl">{step.number}</span>
                    </div>
                    <h2 className="text-3xl font-bold text-text-primary">{step.title}</h2>
                  </div>

                  <p className="text-text-secondary text-lg mb-8 leading-relaxed">
                    {step.description}
                  </p>

                  <ul className="space-y-4">
                    {step.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <IconCheck size={20} className="text-woop flex-shrink-0" />
                        <span className="text-text-primary">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                  <Card
                    hover={false}
                    padding="lg"
                    className="aspect-video flex items-center justify-center bg-elevated-2"
                  >
                    <div className="text-center">
                      <div className="w-24 h-24 rounded-3xl bg-gradient-woop flex items-center justify-center mx-auto mb-4">
                        <span className="text-white font-bold text-4xl">{step.number}</span>
                      </div>
                      <p className="text-text-muted text-sm">Interactive demo coming soon</p>
                    </div>
                  </Card>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* Integrations */}
      <Section padding="xl">
        <div className="container-custom">
          <SectionHeader
            title="Connects With Your Favorite Platforms"
            description="One-click integrations with 50+ e-commerce platforms and marketplaces."
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4"
          >
            {integrations.map((integration, index) => (
              <motion.div key={index} variants={staggerItem}>
                <Card hover={false} padding="md" className="text-center">
                  <div className="w-12 h-12 rounded-xl bg-elevated-2 flex items-center justify-center mx-auto mb-3">
                    <span className="text-text-muted font-bold text-lg">
                      {integration.name[0]}
                    </span>
                  </div>
                  <h3 className="font-semibold text-text-primary">{integration.name}</h3>
                  <p className="text-xs text-text-muted">{integration.category}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center text-text-muted mt-8"
          >
            And 40+ more platforms...{' '}
            <a href="/integrations" className="text-woop hover:underline">
              View all integrations
            </a>
          </motion.p>
        </div>
      </Section>

      {/* CTA */}
      <Section background="elevated" padding="xl">
        <div className="container-custom text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-text-primary mb-4">Ready to Get Started?</h2>
            <p className="text-text-secondary mb-8 max-w-2xl mx-auto">
              Join 2,000+ brands shipping smarter with WooParcel. Set up takes just 5 minutes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" href="/get-started">
                Start Shipping Free
              </Button>
              <Button variant="secondary" size="lg" href="/demo">
                Watch Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </Section>
    </>
  )
}
