import { Metadata } from 'next'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { GetStartedContent } from './GetStartedContent'

export const metadata: Metadata = {
  title: 'Get Started',
  description:
    'Start your WooParcel journey. Create your free account and begin shipping smarter in just 5 minutes.',
}

export default function GetStartedPage() {
  return (
    <>
      <Navigation />
      <main>
        <GetStartedContent />
      </main>
      <Footer />
    </>
  )
}
