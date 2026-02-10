'use client'

import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { fadeUp, staggerContainer } from '@/lib/animations'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  background?: 'obsidian' | 'elevated' | 'gradient'
  padding?: 'sm' | 'md' | 'lg' | 'xl'
  animate?: boolean
}

const backgroundStyles = {
  obsidian: 'bg-obsidian',
  elevated: 'bg-elevated-1',
  gradient: 'bg-gradient-to-b from-obsidian via-elevated-1 to-obsidian',
}

const paddingStyles = {
  sm: 'py-16 lg:py-20',
  md: 'py-20 lg:py-28',
  lg: 'py-24 lg:py-32',
  xl: 'py-32 lg:py-40',
}

export const Section = forwardRef<HTMLElement, SectionProps>(
  ({ className, background = 'obsidian', padding = 'lg', animate = true, children, ...props }, ref) => {
    const [animateRef, isInView] = useScrollAnimation<HTMLElement>()

    if (animate) {
      return (
        <motion.section
          ref={animateRef}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className={cn(backgroundStyles[background], paddingStyles[padding], className)}
          {...(props as any)}
        >
          {children}
        </motion.section>
      )
    }

    return (
      <section
        ref={ref}
        className={cn(backgroundStyles[background], paddingStyles[padding], className)}
        {...props}
      >
        {children}
      </section>
    )
  }
)

Section.displayName = 'Section'

// Section Header Component
interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  badge?: string
  title: string
  description?: string
  align?: 'left' | 'center' | 'right'
}

export function SectionHeader({
  badge,
  title,
  description,
  align = 'center',
  className,
  ...props
}: SectionHeaderProps) {
  const alignStyles = {
    left: 'text-left',
    center: 'text-center mx-auto',
    right: 'text-right ml-auto',
  }

  return (
    <motion.div
      variants={fadeUp}
      className={cn('max-w-3xl mb-12 lg:mb-16', alignStyles[align], className)}
      {...props}
    >
      {badge && (
        <span className="inline-block mb-4 px-4 py-2 rounded-full bg-woop/10 text-woop-light text-xs font-semibold uppercase tracking-wider border border-woop/20">
          {badge}
        </span>
      )}
      <h2 className="text-display-h1 text-text-primary mb-4">{title}</h2>
      {description && <p className="text-body-large text-text-secondary">{description}</p>}
    </motion.div>
  )
}
