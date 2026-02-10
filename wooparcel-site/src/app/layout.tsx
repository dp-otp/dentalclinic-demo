import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'WooParcel | Ship Smarter. Scale Faster.',
    template: '%s | WooParcel',
  },
  description:
    'The AI-powered logistics brain that finds the cheapest route, handles customs automatically, and keeps your customers updated — so you can focus on selling.',
  keywords: [
    'shipping',
    'logistics',
    'e-commerce',
    'parcel',
    'courier',
    'delivery',
    'customs',
    'international shipping',
    'AI logistics',
  ],
  authors: [{ name: 'WooParcel' }],
  creator: 'WooParcel',
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://wooparcel.com',
    siteName: 'WooParcel',
    title: 'WooParcel | Ship Smarter. Scale Faster.',
    description:
      'The AI-powered logistics brain that finds the cheapest route, handles customs automatically, and keeps your customers updated.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'WooParcel - Ship Smarter. Scale Faster.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WooParcel | Ship Smarter. Scale Faster.',
    description:
      'The AI-powered logistics brain that finds the cheapest route, handles customs automatically, and keeps your customers updated.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-obsidian text-text-primary antialiased">
        {children}
      </body>
    </html>
  )
}
