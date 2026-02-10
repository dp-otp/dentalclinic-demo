import { Metadata } from 'next'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { ContactContent } from './ContactContent'

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with the WooParcel team. We are here to help with any questions about our shipping platform.',
}

export default function ContactPage() {
  return (
    <>
      <Navigation />
      <main>
        <ContactContent />
      </main>
      <Footer />
    </>
  )
}
