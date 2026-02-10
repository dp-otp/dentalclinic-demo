'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Section, SectionHeader } from '@/components/ui/Section'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { IconCheck } from '@/components/ui/Icons'
import { staggerContainer, staggerItem, fadeUp } from '@/lib/animations'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

const plans = [
  {
    name: 'Starter',
    description: 'Perfect for small businesses just getting started',
    price: { monthly: 0, yearly: 0 },
    priceLabel: 'Free',
    priceNote: 'Up to 50 shipments/month',
    features: [
      'Smart carrier routing',
      'Basic tracking page',
      'Email notifications',
      '3 carrier integrations',
      'Standard support',
    ],
    cta: 'Start Free',
    popular: false,
  },
  {
    name: 'Growth',
    description: 'For growing businesses ready to scale',
    price: { monthly: 49, yearly: 39 },
    priceLabel: null,
    priceNote: 'per month',
    features: [
      'Everything in Starter',
      'Unlimited shipments',
      'Branded tracking pages',
      'WhatsApp notifications',
      'All carrier integrations',
      'Priority support',
      'Analytics dashboard',
      'Customs automation',
    ],
    cta: 'Start Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    description: 'For large operations with custom needs',
    price: { monthly: 0, yearly: 0 },
    priceLabel: 'Custom',
    priceNote: 'Contact for pricing',
    features: [
      'Everything in Growth',
      'Dedicated account manager',
      'Custom integrations',
      'SLA guarantees',
      'Volume discounts',
      'API access',
      'White-label options',
      'Custom reporting',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
]

const faqs = [
  {
    question: 'Is there really a free plan?',
    answer:
      'Yes! Our Starter plan is completely free for up to 50 shipments per month. No credit card required, no hidden fees.',
  },
  {
    question: 'Can I change plans anytime?',
    answer:
      'Absolutely. Upgrade or downgrade at any time. Changes take effect immediately, and we\'ll prorate any payments.',
  },
  {
    question: 'What carriers are included?',
    answer:
      'We integrate with 15+ carriers including DHL, FedEx, UPS, Royal Mail, and various local specialists. The Growth plan includes all carriers.',
  },
  {
    question: 'Do you charge per shipment?',
    answer:
      'No per-shipment fees on our Growth and Enterprise plans. You only pay for your plan subscription plus the actual carrier costs (which we pass through at negotiated rates).',
  },
  {
    question: 'What kind of support do you offer?',
    answer:
      'Starter plan includes email support. Growth plan includes priority email and chat support. Enterprise includes a dedicated account manager and phone support.',
  },
]

export function PricingContent() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [ref, isInView] = useScrollAnimation<HTMLDivElement>()

  return (
    <>
      {/* Hero */}
      <Section padding="xl" className="pt-32">
        <div className="container-custom">
          <SectionHeader
            badge="Pricing"
            title="Simple, Transparent Pricing"
            description="Start free and scale as you grow. No hidden fees, no long-term contracts."
          />

          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                billingCycle === 'monthly'
                  ? 'bg-woop text-white'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                billingCycle === 'yearly'
                  ? 'bg-woop text-white'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Yearly
              <span className="ml-2 text-xs bg-success/20 text-success px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>
      </Section>

      {/* Pricing Cards */}
      <Section background="elevated" padding="lg">
        <div className="container-custom">
          <motion.div
            ref={ref}
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            {plans.map((plan) => (
              <motion.div key={plan.name} variants={staggerItem}>
                <Card
                  hover={false}
                  padding="lg"
                  className={`h-full relative ${
                    plan.popular ? 'border-woop ring-1 ring-woop/20' : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge>Most Popular</Badge>
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-text-primary mb-2">{plan.name}</h3>
                    <p className="text-text-secondary text-sm">{plan.description}</p>
                  </div>

                  <div className="text-center mb-8">
                    {plan.priceLabel ? (
                      <span className="text-4xl font-bold text-text-primary">{plan.priceLabel}</span>
                    ) : (
                      <>
                        <span className="text-4xl font-bold text-text-primary">
                          £{billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly}
                        </span>
                        <span className="text-text-muted">/{billingCycle === 'yearly' ? 'mo' : 'mo'}</span>
                      </>
                    )}
                    <p className="text-text-muted text-sm mt-1">{plan.priceNote}</p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <IconCheck size={18} className="text-woop mt-0.5 flex-shrink-0" />
                        <span className="text-text-secondary text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant={plan.popular ? 'primary' : 'secondary'}
                    className="w-full"
                    href={plan.name === 'Enterprise' ? '/contact' : '/get-started'}
                  >
                    {plan.cta}
                  </Button>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* FAQs */}
      <Section padding="xl">
        <div className="container-custom">
          <SectionHeader
            title="Frequently Asked Questions"
            description="Everything you need to know about our pricing."
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-3xl mx-auto space-y-6"
          >
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                variants={staggerItem}
                className="bg-elevated-1 border border-border rounded-2xl p-6"
              >
                <h3 className="text-lg font-semibold text-text-primary mb-3">{faq.question}</h3>
                <p className="text-text-secondary">{faq.answer}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* CTA */}
      <Section background="elevated" padding="lg">
        <div className="container-custom text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-2xl font-bold text-text-primary mb-4">
              Still have questions?
            </h2>
            <p className="text-text-secondary mb-6">
              Our team is here to help you find the perfect plan.
            </p>
            <Button variant="secondary" href="/contact">
              Talk to Sales
            </Button>
          </motion.div>
        </div>
      </Section>
    </>
  )
}
