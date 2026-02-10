'use client'

import { motion } from 'framer-motion'
import { Section } from '@/components/ui/Section'
import { CountUp } from '@/components/ui/CountUp'
import { IconStar } from '@/components/ui/Icons'
import { staggerContainer, staggerItem, fadeUp } from '@/lib/animations'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

const stats = [
  { value: 20, suffix: '+', label: 'Years Experience' },
  { value: 2, suffix: 'M+', label: 'Parcels Shipped' },
  { value: 190, suffix: '+', label: 'Countries Served' },
  { value: 40, suffix: '%', label: 'Average Savings' },
]

const testimonial = {
  quote:
    "WooParcel transformed our shipping operations overnight. We went from spending 20 hours a week on logistics to less than 2. The cost savings alone paid for the platform in the first month.",
  author: 'Sarah Chen',
  title: 'Operations Director',
  company: 'TrendyGoods Co.',
  rating: 5,
}

export function SocialProofSection() {
  const [ref, isInView] = useScrollAnimation<HTMLDivElement>()

  return (
    <Section background="elevated" padding="xl">
      <div className="container-custom">
        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {/* Testimonial */}
          <motion.div variants={fadeUp} className="max-w-4xl mx-auto text-center mb-20">
            {/* Rating */}
            <div className="flex items-center justify-center gap-1 mb-6">
              {[...Array(testimonial.rating)].map((_, i) => (
                <IconStar key={i} size={24} className="text-woop" />
              ))}
            </div>

            {/* Quote */}
            <blockquote className="text-xl sm:text-2xl lg:text-3xl font-medium text-text-primary leading-relaxed mb-8">
              &ldquo;{testimonial.quote}&rdquo;
            </blockquote>

            {/* Attribution */}
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-woop flex items-center justify-center">
                <span className="text-white font-bold">
                  {testimonial.author
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </span>
              </div>
              <div className="text-left">
                <p className="font-semibold text-text-primary">{testimonial.author}</p>
                <p className="text-sm text-text-muted">
                  {testimonial.title}, {testimonial.company}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={staggerItem}
                className="text-center"
              >
                <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary mb-2">
                  <CountUp target={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-text-muted text-sm uppercase tracking-wider">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </Section>
  )
}
