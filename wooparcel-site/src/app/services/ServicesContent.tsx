'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Section, SectionHeader } from '@/components/ui/Section'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import {
  IconRoute,
  IconGlobe,
  IconTruck,
  IconBell,
  IconShield,
  IconChart,
  IconCheck,
  IconX,
} from '@/components/ui/Icons'
import { staggerContainer, staggerItem, fadeUp } from '@/lib/animations'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

const services = [
  {
    id: 'smart-routing',
    icon: IconRoute,
    title: 'Smart Routing',
    tagline: 'AI finds the best carrier every time',
    description:
      'Our AI analyzes every shipment and selects the optimal carrier based on your priorities — whether that\'s cost, speed, reliability, or a balance of all three.',
    benefits: [
      'Compares 15+ carriers in real-time',
      'Saves up to 40% on shipping costs',
      'Auto-selects based on your custom rules',
      'Learns from your shipping patterns',
      'Considers delivery deadlines automatically',
    ],
    color: 'cyan',
  },
  {
    id: 'compliance',
    icon: IconGlobe,
    title: 'Global Compliance',
    tagline: 'Ship anywhere without the paperwork headache',
    description:
      'Automated customs documentation, HS code classification, and duty calculations. We handle the complex regulatory requirements so you can focus on selling.',
    benefits: [
      'Automatic HS code classification',
      'Pre-filled customs declarations',
      'Duty and tax calculations',
      'Dangerous goods documentation',
      'Country-specific compliance checks',
    ],
    color: 'woop',
  },
  {
    id: 'carriers',
    icon: IconTruck,
    title: 'Multi-Carrier Access',
    tagline: 'One integration, 15+ carriers',
    description:
      'Access all major global carriers and local specialists through a single integration. No need to manage multiple accounts or contracts.',
    benefits: [
      'DHL, FedEx, UPS, and more',
      'Local carrier specialists',
      'Negotiated enterprise rates',
      'Single invoice for all carriers',
      'Unified tracking across carriers',
    ],
    color: 'success',
  },
  {
    id: 'tracking',
    icon: IconBell,
    title: 'Real-Time Tracking',
    tagline: 'Keep customers informed, reduce support tickets',
    description:
      'Branded tracking pages with proactive notifications via WhatsApp, SMS, and email. Your customers always know where their order is.',
    benefits: [
      'Branded tracking pages',
      'WhatsApp notifications',
      'SMS and email alerts',
      'Proactive delay notifications',
      'Delivery scheduling options',
    ],
    color: 'info',
  },
  {
    id: 'insurance',
    icon: IconShield,
    title: 'Insurance & Claims',
    tagline: 'Ship with confidence',
    description:
      'Comprehensive shipping insurance with hassle-free claims processing. Protect every shipment and get refunds quickly when things go wrong.',
    benefits: [
      'Coverage up to £10,000 per shipment',
      'Simple one-click claims',
      'Fast claim resolution',
      'Automatic coverage options',
      'Competitive premium rates',
    ],
    color: 'warning',
  },
  {
    id: 'analytics',
    icon: IconChart,
    title: 'Analytics Dashboard',
    tagline: 'Data-driven shipping decisions',
    description:
      'Deep insights into your shipping operations. Track costs, delivery times, carrier performance, and identify optimization opportunities.',
    benefits: [
      'Cost analysis by carrier/route',
      'Delivery performance metrics',
      'Exception tracking',
      'Custom report builder',
      'Export to CSV/PDF',
    ],
    color: 'error',
  },
]

export function ServicesContent() {
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [ref, isInView] = useScrollAnimation<HTMLDivElement>()

  const colorClasses: Record<string, { bg: string; text: string; border: string }> = {
    cyan: { bg: 'bg-cyan/10', text: 'text-cyan', border: 'border-cyan/20' },
    woop: { bg: 'bg-woop/10', text: 'text-woop', border: 'border-woop/20' },
    success: { bg: 'bg-success/10', text: 'text-success', border: 'border-success/20' },
    info: { bg: 'bg-info/10', text: 'text-info', border: 'border-info/20' },
    warning: { bg: 'bg-warning/10', text: 'text-warning', border: 'border-warning/20' },
    error: { bg: 'bg-error/10', text: 'text-error', border: 'border-error/20' },
  }

  return (
    <>
      {/* Hero */}
      <Section padding="xl" className="pt-32">
        <div className="container-custom">
          <SectionHeader
            badge="Our Services"
            title="Everything You Need to Ship & Scale"
            description="One platform. Every carrier. Total control. Discover how WooParcel transforms your shipping operations."
          />
        </div>
      </Section>

      {/* Services Grid */}
      <Section background="elevated" padding="xl">
        <div className="container-custom">
          <motion.div
            ref={ref}
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {services.map((service) => {
              const Icon = service.icon
              const colors = colorClasses[service.color]

              return (
                <motion.div
                  key={service.id}
                  variants={staggerItem}
                  id={service.id}
                >
                  <Card
                    padding="lg"
                    className="h-full cursor-pointer"
                    onClick={() =>
                      setSelectedService(selectedService === service.id ? null : service.id)
                    }
                  >
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${colors.bg} border ${colors.border}`}
                    >
                      <Icon size={28} className={colors.text} />
                    </div>

                    <h3 className="text-xl font-semibold text-text-primary mb-2">
                      {service.title}
                    </h3>
                    <p className={`text-sm mb-4 ${colors.text}`}>{service.tagline}</p>
                    <p className="text-text-secondary text-sm leading-relaxed mb-6">
                      {service.description}
                    </p>

                    <AnimatePresence>
                      {selectedService === service.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-border pt-6"
                        >
                          <p className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">
                            Key Benefits
                          </p>
                          <ul className="space-y-3">
                            {service.benefits.map((benefit, i) => (
                              <li key={i} className="flex items-start gap-3">
                                <IconCheck
                                  size={16}
                                  className={`mt-0.5 flex-shrink-0 ${colors.text}`}
                                />
                                <span className="text-text-primary text-sm">{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-4 w-full"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedService(selectedService === service.id ? null : service.id)
                      }}
                    >
                      {selectedService === service.id ? 'Show Less' : 'Learn More'}
                    </Button>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </Section>

      {/* CTA */}
      <Section padding="xl">
        <div className="container-custom text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-3xl font-bold text-text-primary mb-6">
              Ready to Transform Your Shipping?
            </h2>
            <p className="text-text-secondary mb-8 max-w-2xl mx-auto">
              Get started with WooParcel today and join 2,000+ brands shipping smarter.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" href="/get-started">
                Start Shipping Free
              </Button>
              <Button variant="secondary" size="lg" href="/pricing">
                View Pricing
              </Button>
            </div>
          </motion.div>
        </div>
      </Section>
    </>
  )
}
