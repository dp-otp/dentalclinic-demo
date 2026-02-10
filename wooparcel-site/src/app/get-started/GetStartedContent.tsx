'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Section } from '@/components/ui/Section'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { IconCheck, IconArrowRight } from '@/components/ui/Icons'
import { fadeUp, staggerContainer, staggerItem } from '@/lib/animations'

// Onboarding personas (Adam questionnaire)
const personas = [
  {
    id: 'marcus',
    name: 'Marcus',
    role: 'E-commerce Entrepreneur',
    description: 'Running my own online store, looking to scale',
    avatar: 'M',
  },
  {
    id: 'omar',
    name: 'Omar',
    role: 'Operations Manager',
    description: 'Managing logistics for a growing brand',
    avatar: 'O',
  },
  {
    id: 'rashid',
    name: 'Rashid',
    role: 'Marketplace Seller',
    description: 'Selling on multiple platforms like Amazon, eBay',
    avatar: 'R',
  },
  {
    id: 'layla',
    name: 'Layla',
    role: 'Brand Owner',
    description: 'Building a direct-to-consumer brand',
    avatar: 'L',
  },
  {
    id: 'sophia',
    name: 'Sophia',
    role: 'Agency Partner',
    description: 'Managing shipping for multiple clients',
    avatar: 'S',
  },
  {
    id: 'zara',
    name: 'Zara',
    role: 'Dropshipper',
    description: 'Running a dropshipping business',
    avatar: 'Z',
  },
]

const volumeOptions = [
  { id: '0-50', label: '0 - 50', description: 'Just getting started' },
  { id: '50-200', label: '50 - 200', description: 'Growing steadily' },
  { id: '200-500', label: '200 - 500', description: 'Scaling up' },
  { id: '500-1000', label: '500 - 1,000', description: 'High volume' },
  { id: '1000+', label: '1,000+', description: 'Enterprise level' },
]

const productCategories = [
  { id: 'fashion', label: 'Fashion & Apparel' },
  { id: 'electronics', label: 'Electronics' },
  { id: 'beauty', label: 'Beauty & Cosmetics' },
  { id: 'home', label: 'Home & Garden' },
  { id: 'food', label: 'Food & Beverages' },
  { id: 'health', label: 'Health & Wellness' },
  { id: 'toys', label: 'Toys & Games' },
  { id: 'other', label: 'Other' },
]

const priorities = [
  { id: 'cost', label: 'Lowest shipping costs' },
  { id: 'speed', label: 'Fastest delivery times' },
  { id: 'reliability', label: 'Most reliable carriers' },
  { id: 'tracking', label: 'Best tracking experience' },
  { id: 'global', label: 'International shipping' },
  { id: 'automation', label: 'Maximum automation' },
]

export function GetStartedContent() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({
    persona: '',
    volume: '',
    categories: [] as string[],
    priorities: [] as string[],
    email: '',
  })

  const totalSteps = 5

  const handlePersonaSelect = (personaId: string) => {
    setAnswers({ ...answers, persona: personaId })
    setStep(1)
  }

  const handleVolumeSelect = (volumeId: string) => {
    setAnswers({ ...answers, volume: volumeId })
    setStep(2)
  }

  const handleCategoryToggle = (categoryId: string) => {
    const categories = answers.categories.includes(categoryId)
      ? answers.categories.filter((c) => c !== categoryId)
      : [...answers.categories, categoryId]
    setAnswers({ ...answers, categories })
  }

  const handlePriorityToggle = (priorityId: string) => {
    const priorities = answers.priorities.includes(priorityId)
      ? answers.priorities.filter((p) => p !== priorityId)
      : [...answers.priorities, priorityId]
    setAnswers({ ...answers, priorities })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would create the account
    setStep(5)
  }

  return (
    <Section padding="xl" className="pt-32 min-h-screen">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">
          {/* Progress bar */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-text-muted">
                Step {Math.min(step + 1, totalSteps)} of {totalSteps}
              </span>
              <span className="text-sm text-text-muted">
                {Math.round(((step + 1) / totalSteps) * 100)}%
              </span>
            </div>
            <div className="h-2 bg-elevated-2 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-woop"
                initial={{ width: 0 }}
                animate={{ width: `${((step + 1) / totalSteps) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {/* Step 0: Persona Selection */}
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-10">
                  <h1 className="text-3xl font-bold text-text-primary mb-4">
                    Welcome to WooParcel
                  </h1>
                  <p className="text-text-secondary">
                    Tell us a bit about yourself so we can personalize your experience.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {personas.map((persona) => (
                    <button
                      key={persona.id}
                      onClick={() => handlePersonaSelect(persona.id)}
                      className="text-left p-5 rounded-2xl bg-elevated-1 border border-border hover:border-woop/50 hover:bg-elevated-2 transition-all group"
                    >
                      <div className="w-12 h-12 rounded-full bg-gradient-woop flex items-center justify-center mb-4">
                        <span className="text-white font-bold text-lg">{persona.avatar}</span>
                      </div>
                      <h3 className="font-semibold text-text-primary mb-1 group-hover:text-woop transition-colors">
                        {persona.name}
                      </h3>
                      <p className="text-sm text-woop mb-2">{persona.role}</p>
                      <p className="text-sm text-text-muted">{persona.description}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 1: Volume */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-10">
                  <h1 className="text-3xl font-bold text-text-primary mb-4">
                    How many parcels do you ship monthly?
                  </h1>
                  <p className="text-text-secondary">
                    This helps us recommend the right plan for you.
                  </p>
                </div>

                <div className="space-y-3">
                  {volumeOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleVolumeSelect(option.id)}
                      className="w-full text-left p-5 rounded-2xl bg-elevated-1 border border-border hover:border-woop/50 hover:bg-elevated-2 transition-all flex items-center justify-between group"
                    >
                      <div>
                        <h3 className="font-semibold text-text-primary group-hover:text-woop transition-colors">
                          {option.label} parcels
                        </h3>
                        <p className="text-sm text-text-muted">{option.description}</p>
                      </div>
                      <IconArrowRight
                        size={20}
                        className="text-text-muted group-hover:text-woop transition-colors"
                      />
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setStep(0)}
                  className="mt-6 text-sm text-text-muted hover:text-text-primary transition-colors"
                >
                  ← Back
                </button>
              </motion.div>
            )}

            {/* Step 2: Categories */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-10">
                  <h1 className="text-3xl font-bold text-text-primary mb-4">
                    What do you sell?
                  </h1>
                  <p className="text-text-secondary">
                    Select all that apply. This helps with customs automation.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                  {productCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryToggle(category.id)}
                      className={`p-4 rounded-xl border transition-all text-center ${
                        answers.categories.includes(category.id)
                          ? 'bg-woop/10 border-woop text-woop'
                          : 'bg-elevated-1 border-border text-text-secondary hover:border-woop/50'
                      }`}
                    >
                      <span className="text-sm font-medium">{category.label}</span>
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setStep(1)}
                    className="text-sm text-text-muted hover:text-text-primary transition-colors"
                  >
                    ← Back
                  </button>
                  <Button
                    onClick={() => setStep(3)}
                    disabled={answers.categories.length === 0}
                  >
                    Continue
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Priorities */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-10">
                  <h1 className="text-3xl font-bold text-text-primary mb-4">
                    What matters most to you?
                  </h1>
                  <p className="text-text-secondary">
                    Select your top priorities. We&apos;ll optimize accordingly.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 mb-8">
                  {priorities.map((priority) => (
                    <button
                      key={priority.id}
                      onClick={() => handlePriorityToggle(priority.id)}
                      className={`p-4 rounded-xl border transition-all text-left flex items-center gap-3 ${
                        answers.priorities.includes(priority.id)
                          ? 'bg-woop/10 border-woop'
                          : 'bg-elevated-1 border-border hover:border-woop/50'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded flex items-center justify-center ${
                          answers.priorities.includes(priority.id)
                            ? 'bg-woop'
                            : 'border border-border'
                        }`}
                      >
                        {answers.priorities.includes(priority.id) && (
                          <IconCheck size={14} className="text-white" />
                        )}
                      </div>
                      <span
                        className={`font-medium ${
                          answers.priorities.includes(priority.id)
                            ? 'text-woop'
                            : 'text-text-secondary'
                        }`}
                      >
                        {priority.label}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setStep(2)}
                    className="text-sm text-text-muted hover:text-text-primary transition-colors"
                  >
                    ← Back
                  </button>
                  <Button
                    onClick={() => setStep(4)}
                    disabled={answers.priorities.length === 0}
                  >
                    Continue
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Email */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-10">
                  <h1 className="text-3xl font-bold text-text-primary mb-4">
                    Almost there! Create your account.
                  </h1>
                  <p className="text-text-secondary">
                    Enter your email to get started with WooParcel.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                  <div className="mb-6">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-text-primary mb-2"
                    >
                      Work Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={answers.email}
                      onChange={(e) => setAnswers({ ...answers, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-elevated-1 border border-border text-text-primary placeholder-text-muted focus:outline-none focus:border-woop transition-colors"
                      placeholder="you@company.com"
                    />
                  </div>

                  <Button type="submit" className="w-full mb-6">
                    Create Free Account
                  </Button>

                  <p className="text-xs text-text-muted text-center">
                    By creating an account, you agree to our{' '}
                    <a href="/terms" className="text-woop hover:underline">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" className="text-woop hover:underline">
                      Privacy Policy
                    </a>
                    .
                  </p>
                </form>

                <button
                  onClick={() => setStep(3)}
                  className="mt-6 text-sm text-text-muted hover:text-text-primary transition-colors block mx-auto"
                >
                  ← Back
                </button>
              </motion.div>
            )}

            {/* Step 5: Success */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-8">
                  <IconCheck size={40} className="text-success" />
                </div>
                <h1 className="text-3xl font-bold text-text-primary mb-4">
                  Welcome to WooParcel!
                </h1>
                <p className="text-text-secondary mb-8 max-w-md mx-auto">
                  Your account has been created. Check your email for a verification link, then
                  you&apos;re ready to start shipping smarter.
                </p>
                <Button href="/dashboard">Go to Dashboard</Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Section>
  )
}
