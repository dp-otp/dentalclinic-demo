import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import {
  HeroSection,
  ProblemSolutionSection,
  ValuePillarsSection,
  HowItWorksSection,
  ServicesPreviewSection,
  SocialProofSection,
  CTASection,
} from '@/components/sections'

export default function HomePage() {
  return (
    <>
      <Navigation />
      <main>
        <HeroSection />
        <ProblemSolutionSection />
        <ValuePillarsSection />
        <HowItWorksSection />
        <ServicesPreviewSection />
        <SocialProofSection />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
