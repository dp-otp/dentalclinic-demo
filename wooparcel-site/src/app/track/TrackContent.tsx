'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Section } from '@/components/ui/Section'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { IconPackage, IconTruck, IconCheck } from '@/components/ui/Icons'
import { fadeUp } from '@/lib/animations'

// Mock tracking data for demo
const mockTrackingData = {
  trackingNumber: 'WP123456789GB',
  status: 'in_transit',
  carrier: 'DHL Express',
  origin: 'London, UK',
  destination: 'New York, USA',
  estimatedDelivery: 'Jan 27, 2026',
  events: [
    {
      date: 'Jan 25, 2026',
      time: '14:32',
      status: 'In Transit',
      location: 'New York Airport, USA',
      description: 'Shipment arrived at destination airport. Customs clearance in progress.',
    },
    {
      date: 'Jan 25, 2026',
      time: '08:15',
      status: 'Departed',
      location: 'Heathrow Airport, UK',
      description: 'Shipment departed from origin country.',
    },
    {
      date: 'Jan 24, 2026',
      time: '19:45',
      status: 'In Transit',
      location: 'Heathrow Airport, UK',
      description: 'Shipment processed at UK export facility.',
    },
    {
      date: 'Jan 24, 2026',
      time: '15:20',
      status: 'Picked Up',
      location: 'London, UK',
      description: 'Shipment collected from sender.',
    },
    {
      date: 'Jan 24, 2026',
      time: '09:00',
      status: 'Label Created',
      location: 'Online',
      description: 'Shipping label created. Awaiting pickup.',
    },
  ],
}

export function TrackContent() {
  const [trackingNumber, setTrackingNumber] = useState('')
  const [trackingData, setTrackingData] = useState<typeof mockTrackingData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setTrackingData(null)

    if (!trackingNumber.trim()) {
      setError('Please enter a tracking number')
      return
    }

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // For demo, show mock data for any input
    setTrackingData({ ...mockTrackingData, trackingNumber: trackingNumber.toUpperCase() })
    setIsLoading(false)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'text-success'
      case 'in transit':
      case 'departed':
        return 'text-info'
      case 'picked up':
        return 'text-woop'
      default:
        return 'text-text-muted'
    }
  }

  return (
    <>
      {/* Hero */}
      <Section padding="xl" className="pt-32">
        <div className="container-custom">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="max-w-2xl mx-auto text-center"
          >
            <h1 className="text-4xl font-bold text-text-primary mb-4">Track Your Parcel</h1>
            <p className="text-text-secondary mb-8">
              Enter your tracking number to see real-time updates on your shipment.
            </p>

            <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter tracking number (e.g., WP123456789GB)"
                className="flex-1 px-5 py-4 rounded-xl bg-elevated-1 border border-border text-text-primary placeholder-text-muted focus:outline-none focus:border-woop transition-colors text-center sm:text-left"
              />
              <Button type="submit" isLoading={isLoading}>
                Track
              </Button>
            </form>

            {error && <p className="mt-4 text-error text-sm">{error}</p>}
          </motion.div>
        </div>
      </Section>

      {/* Tracking Results */}
      {trackingData && (
        <Section background="elevated" padding="lg">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto"
            >
              {/* Summary Card */}
              <Card hover={false} padding="lg" className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div>
                    <p className="text-sm text-text-muted mb-1">Tracking Number</p>
                    <p className="text-xl font-bold text-text-primary">
                      {trackingData.trackingNumber}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-text-muted mb-1">Carrier</p>
                      <p className="font-semibold text-text-primary">{trackingData.carrier}</p>
                    </div>
                    <div
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        trackingData.status === 'delivered'
                          ? 'bg-success/10 text-success'
                          : 'bg-info/10 text-info'
                      }`}
                    >
                      {trackingData.status === 'in_transit' ? 'In Transit' : 'Delivered'}
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-6 mt-8 pt-8 border-t border-border">
                  <div>
                    <p className="text-sm text-text-muted mb-1">From</p>
                    <p className="font-medium text-text-primary">{trackingData.origin}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-muted mb-1">To</p>
                    <p className="font-medium text-text-primary">{trackingData.destination}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-muted mb-1">Est. Delivery</p>
                    <p className="font-medium text-woop">{trackingData.estimatedDelivery}</p>
                  </div>
                </div>
              </Card>

              {/* Timeline */}
              <Card hover={false} padding="lg">
                <h2 className="text-xl font-semibold text-text-primary mb-6">Shipment History</h2>

                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

                  <div className="space-y-6">
                    {trackingData.events.map((event, index) => (
                      <div key={index} className="relative flex gap-6 pl-12">
                        {/* Timeline dot */}
                        <div
                          className={`absolute left-2 w-5 h-5 rounded-full border-2 ${
                            index === 0
                              ? 'bg-woop border-woop'
                              : 'bg-elevated-1 border-border'
                          }`}
                        >
                          {index === 0 && (
                            <motion.div
                              className="absolute inset-0 rounded-full bg-woop"
                              animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                              transition={{ repeat: Infinity, duration: 2 }}
                            />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 pb-6">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                            <span className={`font-semibold ${getStatusColor(event.status)}`}>
                              {event.status}
                            </span>
                            <span className="text-sm text-text-muted">
                              {event.date} at {event.time}
                            </span>
                          </div>
                          <p className="text-sm text-text-secondary mb-1">{event.description}</p>
                          <p className="text-xs text-text-muted">{event.location}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </Section>
      )}

      {/* No tracking shown - helpful info */}
      {!trackingData && (
        <Section background="elevated" padding="lg">
          <div className="container-custom">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-xl font-semibold text-text-primary mb-6 text-center">
                Where to find your tracking number
              </h2>

              <div className="grid sm:grid-cols-3 gap-6">
                <Card hover={false} padding="md" className="text-center">
                  <div className="w-12 h-12 rounded-xl bg-woop/10 flex items-center justify-center mx-auto mb-4">
                    <IconPackage size={24} className="text-woop" />
                  </div>
                  <h3 className="font-semibold text-text-primary mb-2">Order Confirmation</h3>
                  <p className="text-sm text-text-secondary">
                    Check the shipping confirmation email from your seller.
                  </p>
                </Card>

                <Card hover={false} padding="md" className="text-center">
                  <div className="w-12 h-12 rounded-xl bg-woop/10 flex items-center justify-center mx-auto mb-4">
                    <IconTruck size={24} className="text-woop" />
                  </div>
                  <h3 className="font-semibold text-text-primary mb-2">SMS/WhatsApp</h3>
                  <p className="text-sm text-text-secondary">
                    We send tracking updates via SMS and WhatsApp.
                  </p>
                </Card>

                <Card hover={false} padding="md" className="text-center">
                  <div className="w-12 h-12 rounded-xl bg-woop/10 flex items-center justify-center mx-auto mb-4">
                    <IconCheck size={24} className="text-woop" />
                  </div>
                  <h3 className="font-semibold text-text-primary mb-2">Dashboard</h3>
                  <p className="text-sm text-text-secondary">
                    Sellers can find tracking in their WooParcel dashboard.
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </Section>
      )}
    </>
  )
}
