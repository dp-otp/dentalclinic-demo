import { Metadata } from 'next'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { AboutContent } from './AboutContent'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about WooParcel: Our mission, our team, and our commitment to revolutionizing e-commerce shipping.',
}

export default function AboutPage() {
  return (
    <>
      <Navigation />
      <main>
        <AboutContent />
      </main>
      <Footer />
    </>
  )
}
