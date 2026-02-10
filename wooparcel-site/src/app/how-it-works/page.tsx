import { Metadata } from 'next'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { HowItWorksContent } from './HowItWorksContent'

export const metadata: Metadata = {
  title: 'How It Works',
  description:
    'Learn how WooParcel works. Connect your store, configure preferences, ship smarter, and track everything in one place.',
}

export default function HowItWorksPage() {
  return (
    <>
      <Navigation />
      <main>
        <HowItWorksContent />
      </main>
      <Footer />
    </>
  )
}
