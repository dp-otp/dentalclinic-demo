'use client'

import { motion } from 'framer-motion'
import { Section, SectionHeader } from '@/components/ui/Section'
import { Card } from '@/components/ui/Card'
import { CountUp } from '@/components/ui/CountUp'
import { staggerContainer, staggerItem, fadeUp, slideInLeft, slideInRight } from '@/lib/animations'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

const stats = [
  { value: 20, suffix: '+', label: 'Years Combined Experience' },
  { value: 2, suffix: 'M+', label: 'Parcels Shipped' },
  { value: 2000, suffix: '+', label: 'Happy Customers' },
  { value: 190, suffix: '+', label: 'Countries Reached' },
]

const values = [
  {
    title: 'Customer First',
    description:
      'Every decision we make starts with one question: How does this help our customers ship better?',
  },
  {
    title: 'Simplicity',
    description:
      'Shipping is complex enough. We obsess over making our platform intuitive and easy to use.',
  },
  {
    title: 'Transparency',
    description:
      'No hidden fees, no surprises. You always know exactly what you\'re paying for and why.',
  },
  {
    title: 'Innovation',
    description:
      'We continuously invest in AI and automation to give you a competitive edge in logistics.',
  },
]

const milestones = [
  { year: '2019', title: 'Founded', description: 'WooParcel was born in London with a mission to simplify e-commerce shipping.' },
  { year: '2020', title: 'First 100 Customers', description: 'Reached our first milestone during the e-commerce boom.' },
  { year: '2021', title: 'Global Expansion', description: 'Launched coverage in 100+ countries with major carrier partnerships.' },
  { year: '2022', title: 'AI Integration', description: 'Introduced AI-powered smart routing and customs automation.' },
  { year: '2023', title: '1M Shipments', description: 'Crossed 1 million shipments processed through our platform.' },
  { year: '2024', title: '2,000+ Brands', description: 'Now trusted by over 2,000 e-commerce brands worldwide.' },
]

export function AboutContent() {
  const [ref, isInView] = useScrollAnimation<HTMLDivElement>()

  return (
    <>
      {/* Hero */}
      <Section padding="xl" className="pt-32">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div variants={fadeUp} initial="hidden" animate="visible">
              <span className="inline-block mb-4 px-4 py-2 rounded-full bg-woop/10 text-woop-light text-xs font-semibold uppercase tracking-wider border border-woop/20">
                About WooParcel
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-display-h1 font-bold text-text-primary mb-6">
                On a Mission to Make Shipping{' '}
                <span className="text-gradient">Simple</span>
              </h1>
              <p className="text-lg text-text-secondary leading-relaxed">
                We believe shipping should never be the bottleneck for growing businesses.
                That&apos;s why we&apos;ve built the most intelligent, user-friendly shipping
                platform for e-commerce brands who want to scale without the logistics headaches.
              </p>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* Stats */}
      <Section background="elevated" padding="lg">
        <div className="container-custom">
          <motion.div
            ref={ref}
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div key={index} variants={staggerItem} className="text-center">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mb-2">
                  <CountUp target={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-text-muted text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* Story */}
      <Section padding="xl">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div variants={slideInLeft} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h2 className="text-3xl lg:text-4xl font-bold text-text-primary mb-6">Our Story</h2>
              <div className="space-y-4 text-text-secondary">
                <p>
                  WooParcel started in 2019 when our founders — experienced logistics professionals and
                  e-commerce operators — realized that small and medium businesses were being left behind
                  by the shipping industry.
                </p>
                <p>
                  Enterprise companies had dedicated logistics teams and negotiated carrier rates.
                  Growing brands? They were stuck manually comparing carriers, drowning in customs
                  paperwork, and losing customers due to poor delivery communication.
                </p>
                <p>
                  We set out to change that. Today, WooParcel gives every e-commerce brand access to
                  enterprise-level shipping intelligence — at a fraction of the cost.
                </p>
              </div>
            </motion.div>

            <motion.div
              variants={slideInRight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-elevated-1 rounded-3xl p-8 border border-border"
            >
              <h3 className="text-xl font-semibold text-text-primary mb-6">Our Timeline</h3>
              <div className="space-y-6">
                {milestones.map((milestone, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-16 flex-shrink-0">
                      <span className="text-woop font-bold">{milestone.year}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-text-primary">{milestone.title}</h4>
                      <p className="text-text-secondary text-sm">{milestone.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* Values */}
      <Section background="elevated" padding="xl">
        <div className="container-custom">
          <SectionHeader
            title="Our Values"
            description="The principles that guide everything we do."
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {values.map((value, index) => (
              <motion.div key={index} variants={staggerItem}>
                <Card hover={false} padding="lg" className="h-full">
                  <div className="w-10 h-10 rounded-xl bg-woop/10 flex items-center justify-center mb-4">
                    <span className="text-woop font-bold text-lg">{index + 1}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">{value.title}</h3>
                  <p className="text-text-secondary text-sm">{value.description}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* CTA */}
      <Section padding="xl">
        <div className="container-custom text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-3xl font-bold text-text-primary mb-4">
              Ready to Join 2,000+ Happy Brands?
            </h2>
            <p className="text-text-secondary mb-8 max-w-2xl mx-auto">
              Start shipping smarter today with WooParcel. Free to try, no commitment.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="/get-started" className="btn btn-primary">
                Start Shipping Free
              </a>
              <a href="/contact" className="btn btn-secondary">
                Contact Us
              </a>
            </div>
          </motion.div>
        </div>
      </Section>
    </>
  )
}
