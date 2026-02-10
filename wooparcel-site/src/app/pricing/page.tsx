import { Metadata } from 'next'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { PricingContent } from './PricingContent'

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Simple, transparent pricing for WooParcel. Start free and scale as you grow. No hidden fees, no long-term contracts.',
}

export default function PricingPage() {
  return (
    <>
      <Navigation />
      <main>
        <PricingContent />
      </main>
      <Footer />
    </>
  )
}
