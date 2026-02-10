'use client'

import { motion } from 'framer-motion'
import { Section, SectionHeader } from '@/components/ui/Section'
import { IconCheck, IconX } from '@/components/ui/Icons'
import { fadeUp, slideInLeft, slideInRight, staggerItem } from '@/lib/animations'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

const oldWayItems = [
  'Manually comparing carrier rates for each shipment',
  'Spending hours on customs paperwork and forms',
  'Dealing with angry customers about delivery updates',
  'Juggling multiple courier dashboards and logins',
]

const woopWayItems = [
  'AI automatically selects the cheapest carrier route',
  'Customs codes and documentation handled instantly',
  'Real-time WhatsApp & email updates keep customers happy',
  'One unified dashboard for all carriers and shipments',
]

export function ProblemSolutionSection() {
  const [ref, isInView] = useScrollAnimation<HTMLDivElement>()

  return (
    <Section background="elevated" padding="xl">
      <div className="container-custom">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="max-w-5xl mx-auto"
        >
          {/* Statement */}
          <motion.p
            variants={fadeUp}
            className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-text-primary text-center mb-16 leading-relaxed"
          >
            Shipping shouldn&apos;t be the{' '}
            <span className="text-error">hardest part</span> of your business.
          </motion.p>

          {/* Comparison columns */}
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Old Way */}
            <motion.div
              variants={slideInLeft}
              className="bg-error/5 border border-error/20 rounded-3xl p-8 lg:p-10"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-error/20 flex items-center justify-center">
                  <IconX size={20} className="text-error" />
                </div>
                <h3 className="text-lg font-semibold text-error uppercase tracking-wider">
                  The Old Way
                </h3>
              </div>
              <ul className="space-y-4">
                {oldWayItems.map((item, index) => (
                  <motion.li
                    key={index}
                    variants={staggerItem}
                    className="flex items-start gap-3"
                  >
                    <IconX size={18} className="text-error mt-1 flex-shrink-0" />
                    <span className="text-text-secondary">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* WooParcel Way */}
            <motion.div
              variants={slideInRight}
              className="bg-woop/5 border border-woop/20 rounded-3xl p-8 lg:p-10"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-woop/20 flex items-center justify-center">
                  <IconCheck size={20} className="text-woop" />
                </div>
                <h3 className="text-lg font-semibold text-woop uppercase tracking-wider">
                  The WooParcel Way
                </h3>
              </div>
              <ul className="space-y-4">
                {woopWayItems.map((item, index) => (
                  <motion.li
                    key={index}
                    variants={staggerItem}
                    className="flex items-start gap-3"
                  >
                    <IconCheck size={18} className="text-woop mt-1 flex-shrink-0" />
                    <span className="text-text-primary">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </Section>
  )
}
