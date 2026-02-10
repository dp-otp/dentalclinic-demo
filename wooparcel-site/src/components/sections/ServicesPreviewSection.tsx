'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Section, SectionHeader } from '@/components/ui/Section'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import {
  IconRoute,
  IconGlobe,
  IconTruck,
  IconBell,
  IconShield,
  IconChart,
  IconArrowRight,
} from '@/components/ui/Icons'
import { staggerContainer, staggerItem } from '@/lib/animations'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

const services = [
  {
    icon: IconRoute,
    title: 'Smart Routing',
    description: 'AI selects the best carrier for each shipment based on cost, speed, and reliability.',
    color: 'cyan',
    href: '/services#smart-routing',
  },
  {
    icon: IconGlobe,
    title: 'Global Compliance',
    description: 'Automated customs documentation, HS codes, and duty calculations for 190+ countries.',
    color: 'woop',
    href: '/services#compliance',
  },
  {
    icon: IconTruck,
    title: 'Multi-Carrier',
    description: 'Access 15+ carriers including DHL, FedEx, UPS, and local specialists.',
    color: 'success',
    href: '/services#carriers',
  },
  {
    icon: IconBell,
    title: 'Real-Time Tracking',
    description: 'Branded tracking pages with WhatsApp, SMS, and email notifications.',
    color: 'info',
    href: '/services#tracking',
  },
  {
    icon: IconShield,
    title: 'Insurance & Claims',
    description: 'Comprehensive shipping insurance with hassle-free claims processing.',
    color: 'warning',
    href: '/services#insurance',
  },
  {
    icon: IconChart,
    title: 'Analytics Dashboard',
    description: 'Deep insights into shipping costs, delivery times, and carrier performance.',
    color: 'error',
    href: '/services#analytics',
  },
]

export function ServicesPreviewSection() {
  const [ref, isInView] = useScrollAnimation<HTMLDivElement>()

  return (
    <Section padding="xl">
      <div className="container-custom">
        <SectionHeader
          badge="Our Services"
          title="Everything You Need to Ship & Scale"
          description="One platform. Every carrier. Total control."
        />

        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {services.map((service, index) => {
            const Icon = service.icon
            const colorClasses: Record<string, string> = {
              cyan: 'text-cyan bg-cyan/10 group-hover:bg-cyan/20',
              woop: 'text-woop bg-woop/10 group-hover:bg-woop/20',
              success: 'text-success bg-success/10 group-hover:bg-success/20',
              info: 'text-info bg-info/10 group-hover:bg-info/20',
              warning: 'text-warning bg-warning/10 group-hover:bg-warning/20',
              error: 'text-error bg-error/10 group-hover:bg-error/20',
            }

            return (
              <motion.div key={index} variants={staggerItem}>
                <Link href={service.href} className="block group h-full">
                  <Card padding="lg" className="h-full">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-colors duration-normal ${colorClasses[service.color]}`}
                    >
                      <Icon size={24} />
                    </div>
                    <CardHeader className="mb-0">
                      <CardTitle className="flex items-center gap-2">
                        {service.title}
                        <IconArrowRight
                          size={16}
                          className="text-text-muted opacity-0 -translate-x-2 transition-all duration-normal group-hover:opacity-100 group-hover:translate-x-0"
                        />
                      </CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>

        <motion.div variants={staggerItem} className="text-center">
          <Button variant="secondary" size="lg" href="/services">
            View All Services
          </Button>
        </motion.div>
      </div>
    </Section>
  )
}
