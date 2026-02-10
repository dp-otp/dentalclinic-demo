'use client'

import { forwardRef } from 'react'
import Link from 'next/link'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'
import { buttonHover } from '@/lib/animations'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'size'> {
  variant?: ButtonVariant
  size?: ButtonSize
  href?: string
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-woop text-text-primary shadow-button hover:shadow-button-hover',
  secondary:
    'bg-elevated-2 text-text-primary border border-border hover:bg-elevated-3',
  ghost: 'bg-transparent text-text-secondary hover:text-text-primary hover:bg-white/5',
  outline:
    'bg-transparent text-text-primary border border-border hover:border-woop/50 hover:bg-woop/5',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-10 px-4 text-sm',
  md: 'h-12 px-6 text-base',
  lg: 'h-14 px-8 text-lg',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      href,
      isLoading,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = cn(
      'inline-flex items-center justify-center gap-2 rounded-xl font-semibold',
      'transition-all duration-normal ease-smooth',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-woop focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
      variantStyles[variant],
      sizeStyles[size],
      className
    )

    const content = (
      <>
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!isLoading && leftIcon}
        {children}
        {rightIcon}
      </>
    )

    if (href) {
      return (
        <Link href={href} className={baseStyles}>
          {content}
        </Link>
      )
    }

    return (
      <motion.button
        ref={ref}
        className={baseStyles}
        disabled={disabled || isLoading}
        variants={buttonHover}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
        {...props}
      >
        {content}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'
