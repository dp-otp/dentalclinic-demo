'use client'

import { motion } from 'framer-motion'
import { Section, SectionHeader } from '@/components/ui/Section'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { IconCoin, IconGlobe, IconBell } from '@/components/ui/Icons'
import { staggerContainer, staggerItem } from '@/lib/animations'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

const valuePillars = [
  {
    icon: IconCoin,
    title: 'Cut Costs by 40%',
    description:
      'We consolidate shipments and force couriers to compete. You always get the lowest rate — automatically.',
    color: 'woop',
  },
  {
    icon: IconGlobe,
    title: 'Go Global, Stress-Free',
    description:
      "Customs codes, duties, dangerous goods forms — handled. You sell anywhere; we manage the paperwork.",
    color: 'cyan',
  },
  {
    icon: IconBell,
    title: 'Delight Every Customer',
    description:
      'Real-time WhatsApp & email updates. Fewer "where\'s my order?" tickets. Higher repeat purchase rates.',
    color: 'success',
  },
]

export function ValuePillarsSection() {
  const [ref, isInView] = useScrollAnimation<HTMLDivElement>()

  return (
    <Section padding="xl">
      <div className="container-custom">
        <SectionHeader
          badge="Why Choose WooParcel"
          title="Why 2,000+ Brands Choose WooParcel"
          description="Stop wrestling with shipping. Start scaling your business."
        />

        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid md:grid-cols-3 gap-6 lg:gap-8"
        >
          {valuePillars.map((pillar, index) => {
            const Icon = pillar.icon
            const colorClasses = {
              woop: 'text-woop bg-woop/10 border-woop/20',
              cyan: 'text-cyan bg-cyan/10 border-cyan/20',
              success: 'text-success bg-success/10 border-success/20',
            }

            return (
              <motion.div key={index} variants={staggerItem}>
                <Card padding="lg" className="h-full">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border ${
                      colorClasses[pillar.color as keyof typeof colorClasses]
                    }`}
                  >
                    <Icon size={28} />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-2xl">{pillar.title}</CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      {pillar.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </Section>
  )
}
