'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Section, SectionHeader } from '@/components/ui/Section'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { fadeUp, slideInLeft, slideInRight } from '@/lib/animations'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

const contactMethods = [
  {
    title: 'Sales',
    description: 'Talk to our team about your shipping needs',
    contact: 'sales@wooparcel.com',
    action: 'Email Sales',
    href: 'mailto:sales@wooparcel.com',
  },
  {
    title: 'Support',
    description: 'Get help with your existing account',
    contact: 'support@wooparcel.com',
    action: 'Email Support',
    href: 'mailto:support@wooparcel.com',
  },
  {
    title: 'WhatsApp',
    description: 'Quick questions? Chat with us',
    contact: '+44 7000 000 000',
    action: 'Open WhatsApp',
    href: 'https://wa.me/447000000000',
  },
]

export function ContactContent() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    shipments: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <>
      {/* Hero */}
      <Section padding="xl" className="pt-32">
        <div className="container-custom">
          <SectionHeader
            badge="Contact Us"
            title="Let's Talk Shipping"
            description="Have questions? We're here to help. Reach out and our team will get back to you within 24 hours."
          />
        </div>
      </Section>

      {/* Contact Form & Info */}
      <Section background="elevated" padding="xl">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Form */}
            <motion.div
              variants={slideInLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <Card hover={false} padding="lg">
                {isSubmitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
                      <svg
                        className="w-8 h-8 text-success"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-text-primary mb-2">Message Sent!</h3>
                    <p className="text-text-secondary">
                      Thanks for reaching out. We&apos;ll get back to you within 24 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-text-primary mb-2"
                        >
                          Your Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl bg-elevated-2 border border-border text-text-primary placeholder-text-muted focus:outline-none focus:border-woop transition-colors"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-text-primary mb-2"
                        >
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl bg-elevated-2 border border-border text-text-primary placeholder-text-muted focus:outline-none focus:border-woop transition-colors"
                          placeholder="john@company.com"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="company"
                          className="block text-sm font-medium text-text-primary mb-2"
                        >
                          Company Name
                        </label>
                        <input
                          type="text"
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl bg-elevated-2 border border-border text-text-primary placeholder-text-muted focus:outline-none focus:border-woop transition-colors"
                          placeholder="Your Company"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="shipments"
                          className="block text-sm font-medium text-text-primary mb-2"
                        >
                          Monthly Shipments
                        </label>
                        <select
                          id="shipments"
                          name="shipments"
                          value={formData.shipments}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl bg-elevated-2 border border-border text-text-primary focus:outline-none focus:border-woop transition-colors"
                        >
                          <option value="">Select range</option>
                          <option value="0-50">0 - 50</option>
                          <option value="50-200">50 - 200</option>
                          <option value="200-1000">200 - 1,000</option>
                          <option value="1000+">1,000+</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-text-primary mb-2"
                      >
                        How can we help? *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-elevated-2 border border-border text-text-primary placeholder-text-muted focus:outline-none focus:border-woop transition-colors resize-none"
                        placeholder="Tell us about your shipping needs..."
                      />
                    </div>

                    <Button type="submit" className="w-full" isLoading={isSubmitting}>
                      Send Message
                    </Button>
                  </form>
                )}
              </Card>
            </motion.div>

            {/* Contact Methods */}
            <motion.div
              variants={slideInRight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-text-primary mb-6">Other Ways to Reach Us</h2>

              {contactMethods.map((method, index) => (
                <Card key={index} hover={false} padding="md">
                  <h3 className="text-lg font-semibold text-text-primary mb-1">{method.title}</h3>
                  <p className="text-text-secondary text-sm mb-3">{method.description}</p>
                  <p className="text-woop font-medium mb-4">{method.contact}</p>
                  <a
                    href={method.href}
                    target={method.href.startsWith('https') ? '_blank' : undefined}
                    rel={method.href.startsWith('https') ? 'noopener noreferrer' : undefined}
                    className="inline-flex items-center text-sm font-medium text-text-primary hover:text-woop transition-colors"
                  >
                    {method.action}
                    <svg
                      className="w-4 h-4 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </a>
                </Card>
              ))}

              {/* Office Info */}
              <Card hover={false} padding="md" className="mt-8">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Our Office</h3>
                <address className="text-text-secondary not-italic text-sm leading-relaxed">
                  WooParcel Ltd
                  <br />
                  123 Logistics Way
                  <br />
                  London, EC1A 1BB
                  <br />
                  United Kingdom
                </address>
              </Card>
            </motion.div>
          </div>
        </div>
      </Section>
    </>
  )
}
