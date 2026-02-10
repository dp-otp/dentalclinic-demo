'use client'

import { useCountUp } from '@/hooks/useScrollAnimation'
import { cn } from '@/lib/utils'

interface CountUpProps {
  target: number
  duration?: number
  suffix?: string
  prefix?: string
  className?: string
}

export function CountUp({
  target,
  duration = 1.2,
  suffix = '',
  prefix = '',
  className,
}: CountUpProps) {
  const { ref, count } = useCountUp(target, duration)

  return (
    <span ref={ref} className={cn(className)}>
      {prefix}
      {count}
      {suffix}
    </span>
  )
}
