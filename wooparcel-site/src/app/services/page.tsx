import { Metadata } from 'next'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { ServicesContent } from './ServicesContent'

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Explore WooParcel services: Smart Routing, Global Compliance, Multi-Carrier Access, Real-Time Tracking, Insurance, and Analytics.',
}

export default function ServicesPage() {
  return (
    <>
      <Navigation />
      <main>
        <ServicesContent />
      </main>
      <Footer />
    </>
  )
}
