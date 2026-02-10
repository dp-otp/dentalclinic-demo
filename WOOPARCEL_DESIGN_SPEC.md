# WOOPARCEL — FLAGSHIP DESIGN SPECIFICATION
### The Complete Design Bible for Building a £100,000 Quality Website

---

## BRAND ESSENCE

**Tagline:** Ship Smarter. Scale Faster.

**Voice:** Confident, intelligent, premium. We're the expert friend who makes complex logistics feel effortless.

**Positioning:** AI-powered logistics brain for e-commerce brands who refuse to let shipping slow them down.

---

## COLOR SYSTEM

### Primary Palette

| Name | Hex | Usage |
|------|-----|-------|
| **Obsidian** | `#0B0C0E` | Primary background |
| **Woop Orange** | `#D77A00` | Primary accent, CTAs, highlights |
| **Woop Light** | `#E8943A` | Hover states, gradients |
| **Woop Glow** | `#FFC57A` | Text gradients, glows |
| **Woop Dark** | `#B86A00` | Button shadows, depth |
| **Cyan** | `#4ECDC4` | Secondary accent, data viz |

### Background Layers (Dark Theme Hierarchy)

| Level | Hex | Usage |
|-------|-----|-------|
| Base | `#0B0C0E` | Page background |
| Elevated 1 | `#0F1113` | Cards, containers |
| Elevated 2 | `#14161A` | Nested elements |
| Elevated 3 | `#1A1D22` | Deep nesting, inputs |

### Text Colors

| Name | Hex | Usage |
|------|-----|-------|
| Primary | `#FFFFFF` | Headlines, important text |
| Secondary | `#BFC6CC` | Body text |
| Muted | `#6B7280` | Captions, labels |
| Faint | `#4B5563` | Disabled, hints |

### Semantic Colors

| Name | Hex | Usage |
|------|-----|-------|
| Success | `#10B981` | Positive states, confirmations |
| Error | `#EF4444` | Errors, "old way" comparisons |
| Warning | `#F59E0B` | Alerts, cautions |
| Info | `#3B82F6` | Informational highlights |

---

## TYPOGRAPHY

**Font Family:** Inter (Google Fonts)

### Scale

| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| Display Hero | 72px / 4.5rem | 700 | 1.1 |
| H1 | 56px / 3.5rem | 700 | 1.2 |
| H2 | 40px / 2.5rem | 700 | 1.2 |
| H3 | 28px / 1.75rem | 600 | 1.3 |
| H4 | 22px / 1.375rem | 600 | 1.4 |
| Body Large | 20px / 1.25rem | 400 | 1.6 |
| Body | 16px / 1rem | 400 | 1.5 |
| Small | 14px / 0.875rem | 400 | 1.5 |
| Caption | 12px / 0.75rem | 500 | 1.4 |

### Special Effects

**Text Gradient:**
```css
background: linear-gradient(135deg, #D77A00 0%, #FFC57A 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

---

## MOTION DESIGN

### Easing Curves

| Name | Value | Usage |
|------|-------|-------|
| Smooth | `cubic-bezier(0.16, 1, 0.3, 1)` | General transitions |
| Spring | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Playful interactions |

### Durations

| Name | Value | Usage |
|------|-------|-------|
| Fast | 180ms | Micro-interactions |
| Normal | 280ms | Standard transitions |
| Slow | 420ms | Card hovers, reveals |
| Slower | 600ms | Page transitions |

### Animation Patterns

**Fade Up:** Elements enter from 24px below with opacity 0 → visible position with opacity 1

**Stagger Container:** Children animate in sequence with 80ms delay between each

**Slide In Left/Right:** Elements enter from ±60px offset

**Scale In:** Elements scale from 0.9 → 1 with opacity

---

## COMPONENT SPECIFICATIONS

### Buttons

**Primary Button:**
- Height: 52px
- Padding: 0 32px
- Border Radius: 12px
- Background: Linear gradient (Woop → Woop Dark)
- Shadow: `0 4px 20px rgba(215, 122, 0, 0.3)`
- Hover: Lift 2px, shadow intensifies
- Active: Scale to 0.98

**Secondary Button:**
- Same dimensions
- Background: Transparent
- Border: 1px solid rgba(255, 255, 255, 0.06)
- Hover: Background rgba(255, 255, 255, 0.05), lift 2px

### Cards

- Background: Elevated 1 (`#0F1113`)
- Border: 1px solid rgba(255, 255, 255, 0.06)
- Border Radius: 24px
- Padding: 32px (lg), 24px (md), 16px (sm)
- Hover: Lift 8px, scale 1.02, orange border glow
- Shadow on hover: `0 24px 80px rgba(0, 0, 0, 0.5), 0 0 40px rgba(215, 122, 0, 0.15)`

### Badge

- Padding: 8px 16px
- Border Radius: 100px (pill)
- Font: 12px, 600 weight, uppercase, 0.1em letter-spacing
- Background: rgba(215, 122, 0, 0.1)
- Border: 1px solid rgba(215, 122, 0, 0.2)
- Color: Woop Light

### Glass Effect

```css
background: rgba(15, 17, 19, 0.85);
backdrop-filter: blur(12px);
```

### Glow Effects

**Orange Glow:**
```css
background: radial-gradient(ellipse at center, rgba(215, 122, 0, 0.15) 0%, transparent 70%);
```

**Cyan Glow:**
```css
background: radial-gradient(ellipse at center, rgba(78, 205, 196, 0.15) 0%, transparent 70%);
```

---

## SITE ARCHITECTURE

```
HOME
├── Hero Section (3D animation area + headline)
├── Problem/Solution Comparison
├── Value Pillars (3 cards)
├── How It Works (4 steps)
├── Services Preview
├── Social Proof (testimonial + stats)
└── Final CTA

SERVICES
├── Hero
├── 6 Service Cards (expandable)
└── CTA

PRICING
├── Hero + Billing Toggle
├── 3 Pricing Cards (Starter/Growth/Enterprise)
├── FAQs
└── CTA

ABOUT
├── Hero + Mission
├── Stats Bar
├── Our Story + Timeline
├── Values (4 cards)
└── CTA

CONTACT
├── Form
└── Contact Info

GET STARTED (Onboarding)
├── Multi-step Form
└── Progress Indicator

TRACK
├── Tracking Input
└── Results Display

HOW IT WORKS
├── Detailed Steps
└── Integration Partners
```

---

## PAGE CONTENT

### HOME — HERO

**Badge:** For E-Commerce Brands

**Headline:** Ship Smarter. **Scale Faster.**
(Second part in gradient text)

**Subheadline:** The AI-powered logistics brain that finds the cheapest route, handles customs automatically, and keeps your customers updated — so you can focus on selling.

**Primary CTA:** Start Shipping Free

**Secondary CTA:** Watch Demo

**Trust Line:** ✓ No credit card required · ✓ Live in 5 minutes

**Partner Logos:** Shopify, Amazon, WooCommerce, DHL, FedEx, UPS

---

### HOME — PROBLEM/SOLUTION

**Statement:** Shipping shouldn't be the **hardest part** of your business.
("hardest part" in red/error color)

**The Old Way (Red/Negative):**
- Manually comparing carrier rates for each shipment
- Spending hours on customs paperwork and forms
- Dealing with angry customers about delivery updates
- Juggling multiple courier dashboards and logins

**The WooParcel Way (Orange/Positive):**
- AI automatically selects the cheapest carrier route
- Customs codes and documentation handled instantly
- Real-time WhatsApp & email updates keep customers happy
- One unified dashboard for all carriers and shipments

---

### HOME — VALUE PILLARS

**Section Badge:** Why Choose WooParcel

**Section Title:** Why 2,000+ Brands Choose WooParcel

**Section Subtitle:** Stop wrestling with shipping. Start scaling your business.

**Pillar 1 — Cut Costs by 40%**
Icon: Coin/Money
Color: Woop Orange
Description: We consolidate shipments and force couriers to compete. You always get the lowest rate — automatically.

**Pillar 2 — Go Global, Stress-Free**
Icon: Globe
Color: Cyan
Description: Customs codes, duties, dangerous goods forms — handled. You sell anywhere; we manage the paperwork.

**Pillar 3 — Delight Every Customer**
Icon: Bell/Notification
Color: Success Green
Description: Real-time WhatsApp & email updates. Fewer "where's my order?" tickets. Higher repeat purchase rates.

---

### HOME — HOW IT WORKS

**Section Badge:** How It Works

**Section Title:** Live in 5 Minutes

**Section Subtitle:** Four simple steps to transform your shipping operations forever.

**Step 01 — Connect**
Link your Shopify, Amazon, or WooCommerce store in one click.

**Step 02 — Configure**
Set your preferences — speed vs. cost, notification style, branding.

**Step 03 — Ship**
Orders sync automatically. We generate labels and book pickups.

**Step 04 — Track**
You and your customers get real-time updates. We handle exceptions.

---

### HOME — SOCIAL PROOF

**Testimonial:**
> "WooParcel transformed our shipping operations overnight. We went from spending 20 hours a week on logistics to less than 2. The cost savings alone paid for the platform in the first month."

— **Sarah Chen**, Operations Director, TrendyGoods Co.
Rating: 5 stars

**Stats:**
- 20+ Years Experience
- 2M+ Parcels Shipped
- 190+ Countries Served
- 40% Average Savings

---

### HOME — FINAL CTA

**Headline:** Ready to Transform Your Shipping?

**Body:** Get started with WooParcel today and join 2,000+ brands shipping smarter.

**Primary CTA:** Start Shipping Free

**Secondary CTA:** View Pricing

---

### SERVICES PAGE

**Page Title:** Everything You Need to Ship & Scale

**Subtitle:** One platform. Every carrier. Total control. Discover how WooParcel transforms your shipping operations.

**Service 1 — Smart Routing** (Cyan)
*AI finds the best carrier every time*
Our AI analyzes every shipment and selects the optimal carrier based on your priorities — whether that's cost, speed, reliability, or a balance of all three.

Benefits:
- Compares 15+ carriers in real-time
- Saves up to 40% on shipping costs
- Auto-selects based on your custom rules
- Learns from your shipping patterns
- Considers delivery deadlines automatically

**Service 2 — Global Compliance** (Woop Orange)
*Ship anywhere without the paperwork headache*
Automated customs documentation, HS code classification, and duty calculations. We handle the complex regulatory requirements so you can focus on selling.

Benefits:
- Automatic HS code classification
- Pre-filled customs declarations
- Duty and tax calculations
- Dangerous goods documentation
- Country-specific compliance checks

**Service 3 — Multi-Carrier Access** (Success Green)
*One integration, 15+ carriers*
Access all major global carriers and local specialists through a single integration. No need to manage multiple accounts or contracts.

Benefits:
- DHL, FedEx, UPS, and more
- Local carrier specialists
- Negotiated enterprise rates
- Single invoice for all carriers
- Unified tracking across carriers

**Service 4 — Real-Time Tracking** (Info Blue)
*Keep customers informed, reduce support tickets*
Branded tracking pages with proactive notifications via WhatsApp, SMS, and email. Your customers always know where their order is.

Benefits:
- Branded tracking pages
- WhatsApp notifications
- SMS and email alerts
- Proactive delay notifications
- Delivery scheduling options

**Service 5 — Insurance & Claims** (Warning Yellow)
*Ship with confidence*
Comprehensive shipping insurance with hassle-free claims processing. Protect every shipment and get refunds quickly when things go wrong.

Benefits:
- Coverage up to £10,000 per shipment
- Simple one-click claims
- Fast claim resolution
- Automatic coverage options
- Competitive premium rates

**Service 6 — Analytics Dashboard** (Error Red - for visual variety)
*Data-driven shipping decisions*
Deep insights into your shipping operations. Track costs, delivery times, carrier performance, and identify optimization opportunities.

Benefits:
- Cost analysis by carrier/route
- Delivery performance metrics
- Exception tracking
- Custom report builder
- Export to CSV/PDF

---

### PRICING PAGE

**Page Title:** Simple, Transparent Pricing

**Subtitle:** Start free and scale as you grow. No hidden fees, no long-term contracts.

**Plan 1 — Starter (Free)**
*Perfect for small businesses just getting started*
Price: Free (Up to 50 shipments/month)

Features:
- Smart carrier routing
- Basic tracking page
- Email notifications
- 3 carrier integrations
- Standard support

CTA: Start Free

**Plan 2 — Growth (Most Popular)**
*For growing businesses ready to scale*
Price: £49/month (£39/month billed yearly — Save 20%)

Features:
- Everything in Starter
- Unlimited shipments
- Branded tracking pages
- WhatsApp notifications
- All carrier integrations
- Priority support
- Analytics dashboard
- Customs automation

CTA: Start Trial

**Plan 3 — Enterprise**
*For large operations with custom needs*
Price: Custom

Features:
- Everything in Growth
- Dedicated account manager
- Custom integrations
- SLA guarantees
- Volume discounts
- API access
- White-label options
- Custom reporting

CTA: Contact Sales

**FAQs:**

Q: Is there really a free plan?
A: Yes! Our Starter plan is completely free for up to 50 shipments per month. No credit card required, no hidden fees.

Q: Can I change plans anytime?
A: Absolutely. Upgrade or downgrade at any time. Changes take effect immediately, and we'll prorate any payments.

Q: What carriers are included?
A: We integrate with 15+ carriers including DHL, FedEx, UPS, Royal Mail, and various local specialists. The Growth plan includes all carriers.

Q: Do you charge per shipment?
A: No per-shipment fees on our Growth and Enterprise plans. You only pay for your plan subscription plus the actual carrier costs (which we pass through at negotiated rates).

Q: What kind of support do you offer?
A: Starter plan includes email support. Growth plan includes priority email and chat support. Enterprise includes a dedicated account manager and phone support.

---

### ABOUT PAGE

**Page Title:** On a Mission to Make Shipping **Simple**
("Simple" in gradient text)

**Intro:** We believe shipping should never be the bottleneck for growing businesses. That's why we've built the most intelligent, user-friendly shipping platform for e-commerce brands who want to scale without the logistics headaches.

**Stats:**
- 20+ Years Combined Experience
- 2M+ Parcels Shipped
- 2,000+ Happy Customers
- 190+ Countries Reached

**Our Story:**

WooParcel started in 2019 when our founders — experienced logistics professionals and e-commerce operators — realized that small and medium businesses were being left behind by the shipping industry.

Enterprise companies had dedicated logistics teams and negotiated carrier rates. Growing brands? They were stuck manually comparing carriers, drowning in customs paperwork, and losing customers due to poor delivery communication.

We set out to change that. Today, WooParcel gives every e-commerce brand access to enterprise-level shipping intelligence — at a fraction of the cost.

**Timeline:**
- 2019: Founded — WooParcel was born in London with a mission to simplify e-commerce shipping.
- 2020: First 100 Customers — Reached our first milestone during the e-commerce boom.
- 2021: Global Expansion — Launched coverage in 100+ countries with major carrier partnerships.
- 2022: AI Integration — Introduced AI-powered smart routing and customs automation.
- 2023: 1M Shipments — Crossed 1 million shipments processed through our platform.
- 2024: 2,000+ Brands — Now trusted by over 2,000 e-commerce brands worldwide.

**Our Values:**

1. **Customer First** — Every decision we make starts with one question: How does this help our customers ship better?

2. **Simplicity** — Shipping is complex enough. We obsess over making our platform intuitive and easy to use.

3. **Transparency** — No hidden fees, no surprises. You always know exactly what you're paying for and why.

4. **Innovation** — We continuously invest in AI and automation to give you a competitive edge in logistics.

---

## HERO ANIMATION CONCEPT

### The Vision

A cinematic 3D sequence that tells the WooParcel story without words:

**Phase 1 (0-2s): The Parcel**
A premium cardboard parcel floats center-screen, slowly rotating. It's beautifully lit with subtle orange rim lighting. The parcel gently bobs up and down, breathing life into it.

**Phase 2 (2-3.5s): The Transformation**
The parcel begins to glow from within. Orange energy particles emanate from it. The parcel smoothly morphs/dissolves into...

**Phase 3 (3.5s+): The Globe**
A stylized wireframe globe emerges where the parcel was. It's rendered in cyan with orange data points marking shipping destinations. The globe slowly rotates, showing global connectivity. Subtle particle trails connect the data points, suggesting shipping routes.

**Visual Style:**
- Dark, almost black background with subtle gradient
- Dramatic lighting — single key light creating strong shadows
- Bloom/glow effects on the orange and cyan elements
- Glass/translucent materials
- Floating particles in the background

**Implementation Options:**
1. **Spline** — Design the 3D scene visually, export as embed
2. **Rive** — For more stylized, illustrative approach
3. **Lottie** — If going with a 2D interpretation
4. **Video** — Pre-rendered 3D loop (most polished, least flexible)

---

## RESPONSIVE BREAKPOINTS

| Name | Min Width | Container Padding |
|------|-----------|-------------------|
| Mobile | 0 | 24px |
| Tablet | 768px | 48px |
| Desktop | 1024px | 48px |
| Wide | 1280px | 48px |

**Max Container Width:** 1200px

**Section Padding:**
- Mobile: 80px vertical
- Desktop: 120px vertical

**Navigation Height:** 72px

---

## ACCESSIBILITY REQUIREMENTS

- All interactive elements must have visible focus states (2px orange outline, 2px offset)
- Color contrast ratios must meet WCAG AA (4.5:1 for text)
- Respect `prefers-reduced-motion` — disable animations for users who request it
- All images need alt text
- Form inputs need associated labels
- Skip-to-content link for keyboard users

---

## FINAL NOTES

This specification contains everything needed to build the WooParcel website in Framer, Webflow, or any other tool. The content is complete, the colors are defined, the animations are specified, and the structure is mapped.

**To build in Framer:**
1. Set up color variables matching this spec
2. Create component library (buttons, cards, badges)
3. Build pages following the architecture
4. Add animations using Framer's built-in tools
5. For the hero 3D element, use Spline embed

The code I wrote was the skeleton. This document is the soul.

---

*Document created for WooParcel · Design Specification v1.0*
