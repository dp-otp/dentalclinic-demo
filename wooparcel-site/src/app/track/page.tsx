import { Metadata } from 'next'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { TrackContent } from './TrackContent'

export const metadata: Metadata = {
  title: 'Track Your Parcel',
  description:
    'Track your WooParcel shipment in real-time. Enter your tracking number to see the latest status.',
}

export default function TrackPage() {
  return (
    <>
      <Navigation />
      <main>
        <TrackContent />
      </main>
      <Footer />
    </>
  )
}
