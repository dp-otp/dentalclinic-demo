# HOME PAGE — FRAME-BY-FRAME BUILD SPECIFICATION

---

## OVERVIEW

| Property | Value |
|----------|-------|
| Page ID | `home` |
| Route | `/` |
| Estimated scroll depth | 6500px (desktop), 8200px (mobile) |
| Sections | 9 |
| Code Components Required | 4 |
| Scroll Animations | 23 |

---

## SECTION 0: PRELOADER (Optional, Premium Touch)

### Purpose
A 1.5-2s branded moment while hero assets load. Creates anticipation.

### Visual Spec

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                                                                 │
│                                                                 │
│                         ┌─────────┐                             │
│                         │   W     │   ← WooParcel "W" monogram  │
│                         └─────────┘     draws on (SVG stroke)   │
│                                                                 │
│                         ───────────     ← Progress line below   │
│                                                                 │
│                                                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

Background: var(--bg-obsidian) #0B0C0E
```

### Animation Timeline

| Time | Event |
|------|-------|
| 0ms | Screen appears solid obsidian |
| 100ms | "W" monogram begins SVG stroke draw |
| 800ms | Stroke complete, monogram solid |
| 800-1400ms | Progress line fills left to right |
| 1400ms | Assets loaded signal received |
| 1400-1800ms | Entire preloader fades out + scales up slightly (105%) |
| 1800ms | Hero section visible, cinematic begins |

### Framer Implementation

- Create as **Overlay** component, not page section
- Use `useEffect` to track asset loading
- Animate with Framer Motion variants
- **Mobile:** Same sequence, assets load faster, may skip if <500ms

### Fallback
If assets load in <400ms, skip preloader entirely. Jarring short preloaders are worse than none.

---

## SECTION 1: HERO — THE CINEMATIC MOMENT

### Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│  [Nav - Fixed, Initially Transparent]                           │
│                                                                 │
│                                                                 │
│                     ┌───────────────────┐                       │
│                     │                   │                       │
│                     │   3D CANVAS       │   ← 60% viewport      │
│                     │   (Parcel/Globe)  │                       │
│                     │                   │                       │
│                     └───────────────────┘                       │
│                                                                 │
│              FOR E-COMMERCE BRANDS                              │  ← Badge
│                                                                 │
│         Ship Smarter. Scale Faster.                             │  ← H1
│                                                                 │
│    The AI-powered logistics brain that finds                    │  ← Subhead
│    the cheapest route, handles customs...                       │
│                                                                 │
│    [ Start Shipping Free ]    [ Watch Demo ]                    │  ← CTAs
│                                                                 │
│    ✓ No credit card  ·  ✓ Live in 5 minutes                     │  ← Trust
│                                                                 │
│    ─────────────────────────────────────────                    │
│    [Shopify] [Amazon] [WooCommerce] [DHL] [Aramex]              │  ← Logos
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

Background: Radial gradient from center
  - Center: #0F1113
  - Edges: #0B0C0E
  - Subtle noise overlay at 3% opacity
```

### Desktop Dimensions

| Element | Size | Position |
|---------|------|----------|
| Nav height | 72px | Fixed top |
| Hero section | 100vh min | — |
| 3D Canvas | 600×600px | Centered, top 15% of section |
| Badge | 14px uppercase | 48px below canvas |
| H1 | 64px / 1.1 line-height | 16px below badge |
| Subhead | 20px / 1.6 | 24px below H1, max-width 580px |
| CTA row | — | 40px below subhead |
| Primary CTA | 56px height, 200px min-width | — |
| Secondary CTA | 56px height, ghost style | 16px gap from primary |
| Trust line | 14px, muted color | 20px below CTAs |
| Logo strip | 32px height logos | 48px below trust, 60% opacity |

### Mobile Dimensions (375px base)

| Element | Size | Position |
|---------|------|----------|
| Nav height | 64px | Fixed top |
| Hero section | auto (content-driven) | — |
| 3D Canvas / Video | 100% width, 280px height | Full bleed |
| Badge | 12px uppercase | 32px below canvas |
| H1 | 36px / 1.15 | 12px below badge |
| Subhead | 16px / 1.5 | 16px below H1, full width |
| CTA stack | — | 32px below subhead |
| Primary CTA | 52px height, full width | — |
| Secondary CTA | 52px height, full width | 12px below primary |
| Trust line | 13px | 16px below CTAs |
| Logo strip | 24px height logos | 32px below trust |

### Text Content

**Badge:**
```
FOR E-COMMERCE BRANDS
```

**H1:**
```
Ship Smarter. Scale Faster.
```

**Subhead:**
```
The AI-powered logistics brain that finds the cheapest route, handles customs automatically, and keeps your customers updated — so you can focus on selling.
```

**Primary CTA:**
```
Start Shipping Free
```

**Secondary CTA:**
```
Watch Demo
```

**Trust Line:**
```
✓ No credit card required  ·  ✓ Live in 5 minutes
```

### Animation Sequence (After Cinematic)

| Time | Element | Animation |
|------|---------|-----------|
| 0ms | Badge | Fade in + rise 20px, 400ms, ease-out |
| 80ms | H1 | Fade in + rise 30px, 500ms, ease-out |
| 180ms | Subhead | Fade in + rise 20px, 450ms, ease-out |
| 320ms | CTA row | Fade in + rise 20px, 400ms, ease-out |
| 480ms | Trust line | Fade in, 350ms |
| 640ms | Logo strip | Fade in + slight rise, 400ms |

**Easing:** `cubic-bezier(0.16, 1, 0.3, 1)` on all

### Interaction States

**Primary CTA:**
```css
/* Default */
background: linear-gradient(135deg, #D77A00 0%, #B86A00 100%);
color: #FFFFFF;
border-radius: 12px;
box-shadow: 0 4px 20px rgba(215, 122, 0, 0.3);

/* Hover */
background: linear-gradient(135deg, #E8943A 0%, #D77A00 100%);
box-shadow: 0 8px 32px rgba(215, 122, 0, 0.4);
transform: translateY(-2px);
transition: all 280ms cubic-bezier(0.16, 1, 0.3, 1);

/* Active */
transform: translateY(0);
box-shadow: 0 2px 12px rgba(215, 122, 0, 0.3);
```

**Secondary CTA:**
```css
/* Default */
background: transparent;
color: #FFFFFF;
border: 1px solid rgba(255, 255, 255, 0.2);
border-radius: 12px;

/* Hover */
background: rgba(255, 255, 255, 0.05);
border-color: rgba(255, 255, 255, 0.3);
transform: translateY(-2px);
```

---

## SECTION 2: THE PROBLEM/SOLUTION SPLIT

### Purpose
Acknowledge the user's pain, then pivot to resolution. This creates emotional resonance.

### Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│    "Shipping shouldn't be the hardest                           │
│     part of your business."                                     │  ← Statement
│                                                                 │
│    ─────────────────────────────────────────                    │
│                                                                 │
│    THE OLD WAY                    THE WOOPARCEL WAY             │
│    ───────────                    ─────────────────             │
│                                                                 │
│    ✗ Chasing couriers            ✓ One dashboard                │
│    ✗ Guessing costs              ✓ Auto best-price              │
│    ✗ Customs confusion           ✓ Paperwork handled            │
│    ✗ "Where is it?"              ✓ Real-time tracking           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

Desktop: Two-column, equal width
Mobile: Stacked, "Old Way" first
```

### Dimensions

| Element | Desktop | Mobile |
|---------|---------|--------|
| Section padding | 120px top/bottom | 80px |
| Statement | 40px, centered, max-width 800px | 28px |
| Column gap | 80px | 48px (stacked) |
| List item spacing | 24px | 20px |
| Icon size | 24px | 20px |

### Animation

- Statement fades in first (scroll trigger at 20% visible)
- Left column items stagger in (120ms delay each)
- Right column items stagger in (120ms delay, starts after left column)
- Subtle line draws between columns on desktop

### Visual Treatment

**Old Way Column:**
- Background: `rgba(239, 68, 68, 0.08)` (very subtle red tint)
- Icons: Red "✗" marks
- Text: `var(--text-secondary)`

**WooParcel Way Column:**
- Background: `rgba(215, 122, 0, 0.08)` (very subtle gold tint)
- Icons: Gold "✓" marks
- Text: `var(--text-primary)`

---

## SECTION 3: VALUE PILLARS (Three Cards)

### Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│              Why 2,000+ Brands Choose WooParcel                 │  ← Section head
│                                                                 │
│    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐       │
│    │    💰       │    │    🌍       │    │    📲       │       │
│    │             │    │             │    │             │       │
│    │  Cut Costs  │    │  Go Global  │    │  Delight    │       │
│    │  by 40%     │    │  Stress-Free│    │  Customers  │       │
│    │             │    │             │    │             │       │
│    │  Body text  │    │  Body text  │    │  Body text  │       │
│    │  here...    │    │  here...    │    │  here...    │       │
│    │             │    │             │    │             │       │
│    └─────────────┘    └─────────────┘    └─────────────┘       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

Desktop: 3-column grid, equal width
Mobile: Single column, stacked
```

### Card Content

**Card 1: Cut Costs by 40%**
```
Icon: Custom "savings" icon (coin + down arrow)
Headline: Cut Costs by 40%
Body: We consolidate shipments and force couriers to compete. You always get the lowest rate — automatically.
```

**Card 2: Go Global, Stress-Free**
```
Icon: Custom "globe" icon (simplified world)
Headline: Go Global, Stress-Free
Body: Customs codes, duties, dangerous goods forms — handled. You sell anywhere; we manage the paperwork.
```

**Card 3: Delight Every Customer**
```
Icon: Custom "notification" icon (phone + heart)
Headline: Delight Every Customer
Body: Real-time WhatsApp & email updates. Fewer "where's my order?" tickets. Higher repeat purchase rates.
```

### Card Styling

```css
.value-card {
  background: var(--bg-elev-1);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  padding: 48px 40px;

  /* Subtle gradient on border for depth */
  position: relative;
}

.value-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 20px;
  padding: 1px;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0) 50%,
    rgba(255, 255, 255, 0.05) 100%
  );
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  pointer-events: none;
}
```

### Hover State (Desktop)

```css
.value-card:hover {
  transform: translateY(-8px);
  border-color: rgba(215, 122, 0, 0.2);
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.4),
    0 0 40px rgba(215, 122, 0, 0.1);
  transition: all 420ms cubic-bezier(0.16, 1, 0.3, 1);
}

.value-card:hover .card-icon {
  transform: scale(1.1);
  filter: drop-shadow(0 0 20px rgba(215, 122, 0, 0.4));
}
```

### Scroll Animation

- Cards enter with stagger (150ms between each)
- Start state: `opacity: 0, y: 60px`
- End state: `opacity: 1, y: 0`
- Duration: 600ms
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)`
- Trigger: When section is 30% in viewport

---

## SECTION 4: HOW IT WORKS (4-Step Flow)

### Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                  Live in 5 Minutes                              │  ← Section head
│                                                                 │
│    ┌─────┐         ┌─────┐         ┌─────┐         ┌─────┐     │
│    │  1  │─────────│  2  │─────────│  3  │─────────│  4  │     │
│    └─────┘         └─────┘         └─────┘         └─────┘     │
│   Connect        Configure          Ship           Track       │
│                                                                 │
│   Link your       Set your        Orders sync      You and     │
│   store in        preferences     automatically    customers   │
│   one click                                        get updates │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

Desktop: Horizontal flow with connecting lines
Mobile: Vertical stack with connecting line on left
```

### Step Content

| Step | Number | Title | Description |
|------|--------|-------|-------------|
| 1 | 01 | Connect | Link your Shopify, Amazon, or WooCommerce store in one click. |
| 2 | 02 | Configure | Set your preferences — speed vs. cost, notification style, branding. |
| 3 | 03 | Ship | Orders sync automatically. We generate labels and book pickups. |
| 4 | 04 | Track | You and your customers get real-time updates. We handle exceptions. |

### Animation Sequence (Scroll-Triggered)

1. Connecting line draws from left to right (1200ms total)
2. As line reaches each number, that step fades in (stagger with line)
3. Numbers have subtle pulse when active
4. On mobile: line draws top to bottom

### Visual Treatment

```css
.step-number {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--bg-elev-2);
  border: 2px solid var(--accent-woop);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 600;
  color: var(--accent-woop);
}

.connecting-line {
  height: 2px;
  background: linear-gradient(
    90deg,
    var(--accent-woop) 0%,
    rgba(215, 122, 0, 0.3) 100%
  );
}
```

---

## SECTION 5: SERVICES PREVIEW GRID

### Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│         Everything You Need to Ship & Scale                     │
│         One platform. Every carrier. Total control.             │
│                                                                 │
│    ┌───────────────┐    ┌───────────────┐    ┌───────────────┐ │
│    │ Smart Routing │    │ Store Sync    │    │ Customs       │ │
│    └───────────────┘    └───────────────┘    └───────────────┘ │
│                                                                 │
│    ┌───────────────┐    ┌───────────────┐    ┌───────────────┐ │
│    │ Recovery      │    │ WhatsApp      │    │ Done-For-You  │ │
│    └───────────────┘    └───────────────┘    └───────────────┘ │
│                                                                 │
│                    [ View All Services → ]                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

Desktop: 3-column grid
Tablet: 2-column grid
Mobile: Single column
```

### Service Cards (Compact Version)

| Service | Icon | One-liner |
|---------|------|-----------|
| Smart Routing | Route icon | AI picks the fastest or cheapest carrier automatically |
| Store Integration | Plug icon | 1-click sync with Shopify, Amazon, Woo |
| Customs & Compliance | Document icon | HS codes and duties handled for you |
| Failed Delivery Recovery | Return icon | Undelivered? We reroute to save inventory |
| WhatsApp Notifications | Chat icon | 90%+ open rate on branded updates |
| Done-For-You Store | Store icon | No website? We build and launch it |

### Card Interaction

- Hover: Lift + border glow + icon shifts right slightly
- Click: Opens modal (covered in Services Page doc)
- Mobile: Tap reveals expanded description below card

---

## SECTION 6: SOCIAL PROOF / TRUST

### Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│    "WooParcel cut our shipping costs by 37% in the first        │
│     month. The customs automation alone saved us 10 hours       │
│     a week."                                                    │
│                                                                 │
│                            — Fatima R., Founder at Luma Beauty  │
│                              Dubai, UAE                         │
│                                                                 │
│    ─────────────────────────────────────────────────────────    │
│                                                                 │
│      20+            2M+            190+           40%           │
│     Years         Parcels       Countries        Avg.           │
│    Experience     Shipped       Covered         Savings         │
│                                                                 │
│    ─────────────────────────────────────────────────────────    │
│                                                                 │
│    [Shopify] [Amazon] [DHL] [Aramex] [FedEx] [Emirates Post]    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Testimonial Carousel (Optional)

If multiple testimonials:
- Auto-rotate every 6s
- Manual dots for navigation
- Crossfade transition (400ms)
- Pause on hover

### Stats Animation

- Numbers count up from 0 when section enters viewport
- Duration: 1200ms
- Easing: ease-out
- Stagger: 100ms between each stat

---

## SECTION 7: ABOUT / STORY SNIPPET

### Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│    Built by Logistics Veterans                                  │
│                                                                 │
│    ┌─────────────────────────────────────────────────────────┐ │
│    │                                                         │ │
│    │  We've spent 20 years moving real trucks and real       │ │
│    │  ships with the Axion Gate Group. We've felt the        │ │
│    │  pain of lost packages, angry customers, and            │ │
│    │  customs nightmares.                                    │ │
│    │                                                         │ │
│    │  WooParcel is everything we wish existed when           │ │
│    │  we started.                                            │ │
│    │                                                         │ │
│    │  [ Read Our Story → ]                                   │ │
│    │                                                         │ │
│    └─────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Visual Treatment

- Subtle background image (abstract, muted) or solid with texture
- Quote-style typography for the main text
- Link arrow animates right on hover

---

## SECTION 8: FINAL CTA BLOCK

### Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│  ░░░░░░░░░░░░                                    ░░░░░░░░░░░░░ │
│  ░░░░░░░░░░░░   Ready to Ship Smarter?          ░░░░░░░░░░░░░ │
│  ░░░░░░░░░░░░                                    ░░░░░░░░░░░░░ │
│  ░░░░░░░░░░░░   Join 2,000+ brands saving       ░░░░░░░░░░░░░ │
│  ░░░░░░░░░░░░   time and money.                 ░░░░░░░░░░░░░ │
│  ░░░░░░░░░░░░                                    ░░░░░░░░░░░░░ │
│  ░░░░░░░░░░░░   [ Start Free — No Card ]        ░░░░░░░░░░░░░ │
│  ░░░░░░░░░░░░                                    ░░░░░░░░░░░░░ │
│  ░░░░░░░░░░░░   or WhatsApp: +971 567 444 429   ░░░░░░░░░░░░░ │
│  ░░░░░░░░░░░░                                    ░░░░░░░░░░░░░ │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
└─────────────────────────────────────────────────────────────────┘

Background: Animated gradient mesh (very subtle movement)
  - Base: var(--bg-obsidian)
  - Gradient orbs: var(--accent-woop) at 5% opacity, moving slowly
```

### Animation

- Gradient orbs drift slowly (0.5px/frame)
- Text reveals on scroll with standard stagger
- CTA button has subtle pulse animation when idle (every 4s)

---

## SECTION 9: FOOTER

### Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  [WooParcel Logo]                                               │
│                                                                 │
│  ────────────────────────────────────────────────────────────── │
│                                                                 │
│  PRODUCT          COMPANY         RESOURCES       LEGAL         │
│  Services         About           Blog            Terms         │
│  Pricing          Careers         Help Center     Privacy       │
│  Integrations     Contact         API Docs        Cookies       │
│  Track Parcel     Press           Status                        │
│                                                                 │
│  ────────────────────────────────────────────────────────────── │
│                                                                 │
│  © 2025 WooParcel Technology Limited                            │
│  Floor 3, International Financial Centre, Dubai UAE             │
│  Licence No. CL11862                                            │
│                                                                 │
│  [Twitter] [LinkedIn] [Instagram] [WhatsApp]                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Mobile Footer
- Accordion sections (tap to expand)
- Social icons always visible
- Legal links at bottom

---

## NAV BAR SPECIFICATION

### States

| State | Background | Shadow |
|-------|------------|--------|
| Top (hero visible) | `transparent` | none |
| Scrolled (>100px) | `rgba(11, 12, 14, 0.85)` | `0 1px 0 rgba(255,255,255,0.06)` |
| Scrolled + blur | `backdrop-filter: blur(12px)` | — |

### Structure

```
┌─────────────────────────────────────────────────────────────────┐
│  [Logo]          Home  Services  Pricing  About    [Start Free] │
└─────────────────────────────────────────────────────────────────┘

Mobile:
┌─────────────────────────────────────────────────────────────────┐
│  [Logo]                                           [☰ Menu]      │
└─────────────────────────────────────────────────────────────────┘
```

### Mobile Menu

- Slides in from right (full height)
- Background: `var(--bg-elev-1)`
- Links stack vertically, large tap targets (56px height)
- Close button top right
- CTA at bottom of menu

---

## RESPONSIVE BREAKPOINTS

| Breakpoint | Width | Layout Changes |
|------------|-------|----------------|
| Desktop XL | ≥1440px | Max-width container 1200px |
| Desktop | ≥1024px | Default desktop layout |
| Tablet | ≥768px | 2-column grids, reduced spacing |
| Mobile | <768px | Single column, stacked, full-width CTAs |
| Mobile S | <375px | Tighter typography, smaller spacing |

---

**Next Document:** `02-hero-cinematic.md` — 3D sequence deep dive
