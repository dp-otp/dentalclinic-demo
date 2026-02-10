# FRAMER BUILD GUIDE — STEP-BY-STEP IMPLEMENTATION

---

## OVERVIEW

This guide walks you through building the complete WooParcel website in Framer, section by section. Follow the order exactly for best results.

**Estimated Build Time:** 3-4 days for a skilled Framer user
**Complexity:** Advanced (Code Components + Code Overrides)

---

## PHASE 1: PROJECT SETUP

### 1.1 Create New Framer Project

1. Open Framer
2. New Project → Desktop (1440px width)
3. Name: "WooParcel Flagship"
4. Enable: Code Components, CMS

### 1.2 Install Dependencies

In Framer's package.json (via Code Editor):

```json
{
  "dependencies": {
    "@react-three/fiber": "^8.15.0",
    "@react-three/drei": "^9.88.0",
    "@react-three/postprocessing": "^2.15.0",
    "three": "^0.158.0",
    "framer-motion": "^10.16.0"
  }
}
```

### 1.3 Set Up Design Tokens

1. Go to **Assets** panel
2. Create **Color Styles:**

| Name | Value | Use |
|------|-------|-----|
| `bg/obsidian` | `#0B0C0E` | Page backgrounds |
| `bg/elevated-1` | `#0F1113` | Cards, nav |
| `bg/elevated-2` | `#14161A` | Nested elements |
| `accent/woop` | `#D77A00` | Primary accent |
| `accent/glow` | `#FFC57A` | Highlights |
| `accent/cyan` | `#4ECDC4` | Secondary accent |
| `text/primary` | `#FFFFFF` | Headlines |
| `text/secondary` | `#BFC6CC` | Body |
| `text/muted` | `#6B7280` | Captions |
| `border/default` | `rgba(255,255,255,0.06)` | Card borders |
| `semantic/success` | `#10B981` | Confirmations |
| `semantic/error` | `#EF4444` | Errors |

3. Create **Text Styles:**

| Name | Font | Size | Weight | Line Height |
|------|------|------|--------|-------------|
| `display/hero` | Inter | 64px | 700 | 1.1 |
| `display/h1` | Inter | 48px | 700 | 1.15 |
| `display/h2` | Inter | 36px | 600 | 1.2 |
| `display/h3` | Inter | 24px | 600 | 1.3 |
| `body/large` | Inter | 20px | 400 | 1.6 |
| `body/default` | Inter | 16px | 400 | 1.5 |
| `body/small` | Inter | 14px | 400 | 1.5 |
| `label/default` | Inter | 13px | 600 | 1 |
| `label/badge` | Inter | 12px | 600 | 1 |

---

## PHASE 2: CODE COMPONENTS

### 2.1 Add Hero Cinematic

1. Go to **Assets** → **Code** → **New Code File**
2. Name: `HeroCinematic`
3. Copy entire contents of `/code-components/HeroCinematic.tsx`
4. Save

**Testing:**
- Drag `HeroCinematic` onto canvas
- Should see 3D parcel animation
- If errors, check dependencies installed

### 2.2 Add Service Modal

1. **Assets** → **Code** → **New Code File**
2. Name: `ServiceModal`
3. Copy contents of `/code-components/ServiceModal.tsx`
4. Save

### 2.3 Add Scroll Overrides

1. **Assets** → **Code** → **New Override File**
2. Name: `ScrollAnimations`
3. Copy contents of `/code-overrides/scrollAnimations.tsx`
4. Save

---

## PHASE 3: PAGE STRUCTURE

### 3.1 Create Pages

Create these pages in Framer:

| Page | Route | Purpose |
|------|-------|---------|
| Home | `/` | Main landing |
| Services | `/services` | Service grid |
| Pricing | `/pricing` | Plan comparison |
| How It Works | `/how-it-works` | Process flow |
| About | `/about` | Company story |
| Contact | `/contact` | Contact form |
| Track | `/track` | Parcel tracking |

### 3.2 Create Master Components

Create these as **Components** for reuse:

1. **Navigation**
   - Logo (left)
   - Links (center): Home, Services, Pricing, About
   - CTA Button (right): "Start Free"
   - Apply `NavScrolled` override

2. **Footer**
   - 4-column layout
   - Logo + description
   - Link columns
   - Social icons
   - Legal text

3. **Section Wrapper**
   - Max-width: 1200px
   - Padding: 120px top/bottom (desktop), 80px (mobile)
   - Background: `bg/obsidian`

4. **Button Primary**
   - Height: 52px
   - Border radius: 12px
   - Background: gradient from `accent/woop` to `#B86A00`
   - Apply `ButtonPrimary` override

5. **Button Secondary**
   - Height: 52px
   - Border radius: 12px
   - Border: 1px `border/default`
   - Background: transparent
   - Apply `ButtonSecondary` override

6. **Service Card**
   - Width: 380px (auto-resize for grid)
   - Background: `bg/elevated-1`
   - Border: 1px `border/default`
   - Border radius: 24px
   - Padding: 40px
   - Apply `CardHoverGlow` override

7. **Value Pillar Card**
   - Similar to Service Card
   - Apply `StaggerItem` override

---

## PHASE 4: HOME PAGE BUILD

### 4.1 Hero Section

**Layer Structure:**
```
[Hero Section] (Frame, 100vh height, bg/obsidian)
├── [Navigation] (Component, fixed position)
├── [3D Canvas Container] (Frame, 600×600px, centered)
│   └── [HeroCinematic] (Code Component)
├── [Badge] (Text, "FOR E-COMMERCE BRANDS")
├── [Headline] (Text, "Ship Smarter. Scale Faster.")
├── [Subhead] (Text)
├── [CTA Row] (Stack, horizontal, gap 16px)
│   ├── [Button Primary]
│   └── [Button Secondary]
├── [Trust Line] (Text)
└── [Logo Strip] (Stack, horizontal)
```

**Text Content:**

Badge:
```
FOR E-COMMERCE BRANDS
```

Headline (apply `display/hero` style):
```
Ship Smarter. Scale Faster.
```

Subhead (apply `body/large` style):
```
The AI-powered logistics brain that finds the cheapest route, handles customs automatically, and keeps your customers updated — so you can focus on selling.
```

Trust Line:
```
✓ No credit card required  ·  ✓ Live in 5 minutes
```

**Animation Setup:**

1. Select Badge → Apply `FadeUpDelay1` override
2. Select Headline → Apply `FadeUpDelay2` override
3. Select Subhead → Apply `FadeUpDelay3` override
4. Select CTA Row → Apply `FadeUpDelay4` override

**Connect Hero Cinematic:**

In HeroCinematic properties:
- Set `onSequenceEnd` to trigger text reveal (use Framer interactions)

### 4.2 Problem/Solution Section

**Layer Structure:**
```
[Problem/Solution Section]
├── [Statement] (Text, centered)
│   "Shipping shouldn't be the hardest part of your business."
├── [Columns Container] (Stack, horizontal, gap 80px)
│   ├── [Old Way Column]
│   │   ├── [Header] "THE OLD WAY"
│   │   └── [List Items] (4 items with ✗ icons)
│   └── [WooParcel Way Column]
│       ├── [Header] "THE WOOPARCEL WAY"
│       └── [List Items] (4 items with ✓ icons)
```

**Styling:**

Old Way Column:
- Background: `rgba(239, 68, 68, 0.06)`
- Border radius: 20px
- Padding: 32px

WooParcel Way Column:
- Background: `rgba(215, 122, 0, 0.06)`
- Border radius: 20px
- Padding: 32px

**Animation:**
- Apply `FadeUp` to Statement
- Apply `SlideInLeft` to Old Way Column
- Apply `SlideInRight` to WooParcel Way Column

### 4.3 Value Pillars Section

**Layer Structure:**
```
[Value Pillars Section]
├── [Section Header]
│   └── "Why 2,000+ Brands Choose WooParcel"
├── [Cards Grid] (Apply StaggerContainer override)
│   ├── [Value Card 1] (Apply StaggerItem)
│   ├── [Value Card 2] (Apply StaggerItem)
│   └── [Value Card 3] (Apply StaggerItem)
```

**Card Content:**

Card 1:
- Icon: Coin/savings icon
- Headline: "Cut Costs by 40%"
- Body: "We consolidate shipments and force couriers to compete. You always get the lowest rate — automatically."

Card 2:
- Icon: Globe icon
- Headline: "Go Global, Stress-Free"
- Body: "Customs codes, duties, dangerous goods forms — handled. You sell anywhere; we manage the paperwork."

Card 3:
- Icon: Phone/notification icon
- Headline: "Delight Every Customer"
- Body: "Real-time WhatsApp & email updates. Fewer "where's my order?" tickets. Higher repeat purchase rates."

### 4.4 How It Works Section

**Layer Structure:**
```
[How It Works Section]
├── [Section Header] "Live in 5 Minutes"
├── [Steps Container] (Stack, horizontal)
│   ├── [Step 1] + [Line] + [Step 2] + [Line] + [Step 3] + [Line] + [Step 4]
```

**Step Template:**
```
[Step]
├── [Number Circle] (64×64, border: accent/woop)
├── [Title] (bold)
└── [Description] (muted)
```

**Content:**

| Step | Title | Description |
|------|-------|-------------|
| 01 | Connect | Link your Shopify, Amazon, or WooCommerce store in one click. |
| 02 | Configure | Set your preferences — speed vs. cost, notification style, branding. |
| 03 | Ship | Orders sync automatically. We generate labels and book pickups. |
| 04 | Track | You and your customers get real-time updates. We handle exceptions. |

**Animation:**
- Apply `LineDraw` override to connecting lines
- Apply staggered `FadeUp` to each step

### 4.5 Services Preview Section

**Layer Structure:**
```
[Services Preview Section]
├── [Section Header]
│   ├── "Everything You Need to Ship & Scale"
│   └── "One platform. Every carrier. Total control."
├── [Services Grid] (3-column)
│   ├── [Service Card 1-6]
└── [View All Button]
```

Use Service Card component × 6 with CardHoverGlow override.

### 4.6 Social Proof Section

**Layer Structure:**
```
[Social Proof Section]
├── [Testimonial]
│   ├── [Quote Text]
│   └── [Attribution]
├── [Stats Row]
│   ├── [Stat: 20+ Years]
│   ├── [Stat: 2M+ Parcels]
│   ├── [Stat: 190+ Countries]
│   └── [Stat: 40% Savings]
└── [Logo Strip]
```

**Stats Animation:**
- Apply `CountUp20Years` override to "20"
- Apply `CountUp2M` override to "2"
- Apply `CountUp190` override to "190"
- Apply `CountUp40Percent` override to "40"

### 4.7 Final CTA Section

**Layer Structure:**
```
[Final CTA Section]
├── [Background] (Gradient mesh or solid bg/elevated-1)
├── [Headline] "Ready to Ship Smarter?"
├── [Subhead] "Join 2,000+ brands saving time and money."
├── [CTA Button]
└── [WhatsApp Line]
```

---

## PHASE 5: RESPONSIVE DESIGN

### 5.1 Breakpoint Setup

In Framer, set breakpoints:

| Breakpoint | Width |
|------------|-------|
| Desktop | 1440px |
| Laptop | 1024px |
| Tablet | 768px |
| Mobile | 375px |

### 5.2 Mobile Adjustments

For each section at Mobile breakpoint:

**Hero:**
- 3D Canvas: 280px height (or swap for video fallback)
- Headline: 36px
- Subhead: 16px
- CTAs: Stack vertical, full width
- Hide logo strip or reduce to 3 logos

**Value Pillars:**
- Single column grid
- Cards full width

**How It Works:**
- Vertical stack
- Line on left side

**Services Grid:**
- Single column

**Footer:**
- Accordion for link columns
- Stack everything vertically

---

## PHASE 6: INTERACTIONS & ANIMATIONS

### 6.1 Page Transitions

In Framer Site Settings → Transitions:
- Type: Fade
- Duration: 0.3s
- Ease: `cubic-bezier(0.16, 1, 0.3, 1)`

### 6.2 Scroll-Triggered Animations

Apply overrides from `ScrollAnimations.tsx`:

| Override | Use For |
|----------|---------|
| `FadeUp` | Any element that should rise + fade |
| `FadeUpDelay1-4` | Sequential reveals |
| `StaggerContainer` | Parent of staggered children |
| `StaggerItem` | Children that animate in sequence |
| `CardHover` | Basic lift effect |
| `CardHoverGlow` | Lift + accent glow |
| `ScaleIn` | Pop effect (icons, images) |
| `SlideInLeft` | Elements from left |
| `SlideInRight` | Elements from right |
| `ParallaxSlow` | Subtle scroll parallax |

### 6.3 Hover States

For each interactive element:

**Cards:**
- Hover: Y -8px, scale 1.02, border glow
- Transition: 420ms, ease-out-expo

**Buttons:**
- Hover: Y -2px, shadow increase
- Active: Scale 0.98

**Links:**
- Hover: Color change to `accent/woop`
- Underline slides in from left

**Service Cards:**
- On click: Open ServiceModal component

---

## PHASE 7: CMS SETUP

### 7.1 Create Collections

**Services Collection:**
| Field | Type |
|-------|------|
| `name` | Text |
| `slug` | Slug |
| `tagline` | Text |
| `description` | Rich Text |
| `icon` | Image |
| `accentColor` | Color |
| `videoUrl` | Link |
| `benefits` | Multi-line Text |
| `addonName` | Text |
| `addonPrice` | Text |
| `addonDescription` | Text |
| `addonBenefit` | Text |

**Testimonials Collection:**
| Field | Type |
|-------|------|
| `quote` | Rich Text |
| `authorName` | Text |
| `authorTitle` | Text |
| `authorCompany` | Text |
| `authorImage` | Image |

**FAQs Collection:**
| Field | Type |
|-------|------|
| `question` | Text |
| `answer` | Rich Text |
| `category` | Text |
| `order` | Number |

### 7.2 Connect to Components

For each dynamic component:

1. Select component
2. Click "Connect to CMS"
3. Map fields to component props

---

## PHASE 8: FINAL POLISH

### 8.1 Performance Checklist

- [ ] Compress all images (WebP format)
- [ ] Lazy load images below fold
- [ ] Code-split heavy components
- [ ] Test on slow 3G throttling
- [ ] Verify 60fps on animations
- [ ] Check mobile performance

### 8.2 Accessibility Checklist

- [ ] All images have alt text
- [ ] Color contrast passes WCAG AA
- [ ] Focus states visible on all interactive elements
- [ ] Skip link present
- [ ] Form labels associated
- [ ] Reduced motion respected

### 8.3 QA Checklist

- [ ] Test all links
- [ ] Test all buttons
- [ ] Test all form submissions
- [ ] Test on Chrome, Safari, Firefox
- [ ] Test on iOS Safari, Android Chrome
- [ ] Test on iPad
- [ ] Verify favicon displays
- [ ] Verify OG images render on social shares
- [ ] Test 404 page

---

## PHASE 9: PUBLISH

### 9.1 Domain Setup

1. Go to Site Settings → Domain
2. Add custom domain: `wooparcel.com`
3. Configure DNS as instructed

### 9.2 SEO Settings

For each page, set:
- Title (unique, <60 chars)
- Description (unique, <160 chars)
- OG Image (1200×630px)
- Canonical URL

### 9.3 Analytics

1. Site Settings → Integrations
2. Add Google Analytics 4 ID
3. Add any other tracking (Plausible, Vercel Analytics)

### 9.4 Publish

1. Review all pages one final time
2. Click "Publish"
3. Test live site immediately

---

## TROUBLESHOOTING

### 3D Component Not Loading

**Cause:** Three.js dependencies not installed or WebGL not supported

**Fix:**
1. Check package.json has all @react-three packages
2. Test in Chrome (most reliable WebGL support)
3. Verify fallback video is in place

### Scroll Animations Not Working

**Cause:** Override not applied or intersection observer not triggering

**Fix:**
1. Ensure override is applied to correct layer
2. Check layer is not inside another animated container
3. Adjust `margin` parameter in `useInView` hook

### Performance Issues on Mobile

**Cause:** Too many concurrent animations or heavy assets

**Fix:**
1. Disable 3D component on mobile (show video fallback)
2. Reduce number of scroll animations
3. Compress images further
4. Use `prefers-reduced-motion` to disable animations

---

**Build complete. Ship it.**
