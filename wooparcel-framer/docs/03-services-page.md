# SERVICES PAGE — INTERACTIVE GRID SPECIFICATION

---

## THE EXPERIENCE

The Services page is not a catalogue. It is a **discovery journey**.

Each service card is a doorway. The user should feel curious, not overwhelmed. We reveal complexity only when they ask for it.

---

## PAGE STRUCTURE

```
┌─────────────────────────────────────────────────────────────────┐
│  [Fixed Nav]                                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                    HERO SECTION                                 │
│                                                                 │
│         Everything You Need to Ship & Scale                     │
│                                                                 │
│     One platform. Every carrier. Complete control.              │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                  SERVICE GRID (6 Cards)                         │
│                                                                 │
│    ┌─────────┐  ┌─────────┐  ┌─────────┐                       │
│    │         │  │         │  │         │                       │
│    └─────────┘  └─────────┘  └─────────┘                       │
│                                                                 │
│    ┌─────────┐  ┌─────────┐  ┌─────────┐                       │
│    │         │  │         │  │         │                       │
│    └─────────┘  └─────────┘  └─────────┘                       │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                  COMPARISON TABLE                               │
│           (Before WooParcel vs. After)                          │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                  INTEGRATION LOGOS                              │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                  FAQ ACCORDION                                  │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                  FINAL CTA                                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## HERO SECTION

### Content

**Badge:** `OUR SERVICES`

**H1:** `Everything You Need to Ship & Scale`

**Subhead:** `One platform. Every carrier. Complete control. From your first order to your millionth.`

### Dimensions

| Element | Desktop | Mobile |
|---------|---------|--------|
| Section padding | 160px top, 80px bottom | 100px top, 60px bottom |
| H1 | 56px / 1.1 | 32px / 1.15 |
| Subhead | 20px / 1.6, max-width 640px | 16px / 1.5 |
| Badge | 13px uppercase, tracking +0.1em | 12px |

---

## SERVICE CARDS — DETAILED SPECIFICATION

### The Six Services

| ID | Name | Icon | Tagline | Color Accent |
|----|------|------|---------|--------------|
| `smart-routing` | Smart Routing | 🧠 Route | AI finds the best carrier every time | Blue `#4ECDC4` |
| `store-sync` | Store Integration | 🔌 Plug | Connect once, ship forever | Green `#10B981` |
| `customs` | Customs & Compliance | 📋 Document | We handle the paperwork | Purple `#8B5CF6` |
| `recovery` | Failed Delivery Recovery | 🔄 Return | Save every package | Orange `#D77A00` |
| `notifications` | WhatsApp Notifications | 💬 Chat | Updates they actually read | Green `#25D366` |
| `dfy-store` | Done-For-You Store | 🏪 Store | We build, you sell | Pink `#EC4899` |

### Card Layout (Default State)

```
┌────────────────────────────────────────────────────────┐
│                                                        │
│     ┌──────────┐                                      │
│     │   Icon   │    ← 64×64px, gradient bg            │
│     └──────────┘                                      │
│                                                        │
│     Smart Routing                    ← 24px, bold     │
│                                                        │
│     AI picks the fastest or         ← 16px, muted     │
│     cheapest carrier — every                          │
│     single time. Automatically.                       │
│                                                        │
│                                                        │
│     [ Learn More ]                   ← Text button    │
│                                                        │
└────────────────────────────────────────────────────────┘

Desktop: 380px × 340px
Mobile: 100% width × auto
```

### Card Styling

```css
.service-card {
  background: var(--bg-elev-1);  /* #0F1113 */
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 24px;
  padding: 40px 36px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: all 420ms cubic-bezier(0.16, 1, 0.3, 1);
}

/* Gradient border effect */
.service-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 24px;
  padding: 1px;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.08) 0%,
    transparent 40%,
    transparent 60%,
    rgba(255, 255, 255, 0.04) 100%
  );
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask-composite: exclude;
  pointer-events: none;
}

/* Glow orb (hidden by default) */
.service-card::after {
  content: '';
  position: absolute;
  width: 200px;
  height: 200px;
  background: radial-gradient(
    circle,
    var(--card-accent) 0%,
    transparent 70%
  );
  opacity: 0;
  top: -100px;
  right: -100px;
  filter: blur(60px);
  transition: opacity 600ms ease;
  pointer-events: none;
}
```

### Card Hover State (Desktop)

```css
.service-card:hover {
  transform: translateY(-8px) scale(1.02);
  border-color: rgba(255, 255, 255, 0.08);
  box-shadow:
    0 24px 80px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.05);
}

.service-card:hover::after {
  opacity: 0.15;  /* Glow appears */
}

.service-card:hover .card-icon {
  transform: scale(1.1) rotate(-3deg);
}

.service-card:hover .learn-more {
  color: var(--accent-woop);
}

.service-card:hover .learn-more svg {
  transform: translateX(4px);
}
```

### Card Animation (Scroll Reveal)

```javascript
// Framer Motion variants
const cardVariants = {
  hidden: {
    opacity: 0,
    y: 60,
    scale: 0.95,
  },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.1,  // 100ms stagger
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};
```

### Grid Layout

```css
.services-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

/* Tablet */
@media (max-width: 1024px) {
  .services-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
}

/* Mobile */
@media (max-width: 640px) {
  .services-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}
```

---

## SERVICE MODAL — DETAILED SPECIFICATION

### Trigger
Click on any service card opens its detail modal.

### Modal Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                                                         [×]     │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │              VIDEO / ANIMATION PLAYER                   │   │
│  │                    (16:9 ratio)                         │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Smart Routing                                                  │  ← H2
│                                                                 │
│  Our AI analyzes every shipment and selects the optimal         │  ← Body
│  carrier based on your priorities: speed, cost, or              │
│  reliability. No manual comparison needed.                      │
│                                                                 │
│  KEY BENEFITS                                                   │  ← Section
│  ────────────                                                   │
│                                                                 │
│  ✓ Compares 15+ carriers in real-time                          │
│  ✓ Saves average 40% on shipping costs                         │
│  ✓ Auto-selects based on your rules                            │
│  ✓ Falls back to backup carrier if primary fails               │
│                                                                 │
│  ───────────────────────────────────────────────────────────── │
│                                                                 │
│  💡 Complete your shipping setup:                               │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ [ ] Express Handling                        +$1.50/pkg  │   │
│  │     Priority processing, 1-2 days faster               │   │
│  │     ✓ 48% better delivery success on fragile items     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌───────────────────────┐  ┌───────────────────────┐          │
│  │    Get Started Free   │  │   Talk to Sales       │          │
│  └───────────────────────┘  └───────────────────────┘          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

Width: 680px (desktop), 100% (mobile)
Max-height: 90vh (scrollable)
```

### Modal Animation

**Open:**
```javascript
{
  backdrop: {
    opacity: { from: 0, to: 1 },
    duration: 220ms,
  },
  modal: {
    opacity: { from: 0, to: 1 },
    y: { from: 40, to: 0 },
    scale: { from: 0.95, to: 1 },
    duration: 280ms,
    ease: [0.16, 1, 0.3, 1],
  }
}
```

**Close:**
```javascript
{
  modal: {
    opacity: { to: 0 },
    y: { to: 20 },
    scale: { to: 0.98 },
    duration: 180ms,
    ease: [0.4, 0, 1, 1],
  },
  backdrop: {
    opacity: { to: 0 },
    duration: 150ms,
    delay: 80ms,
  }
}
```

### Modal Close Methods
- Click "×" button
- Click backdrop
- Press Escape key
- Swipe down (mobile)

### Video Player Behavior
- Auto-plays (muted) when modal opens
- Loops seamlessly
- No controls visible by default (clean)
- Tap/click to show controls
- Pauses when modal closes

---

## SERVICE CONTENT (Full Specifications)

### 1. Smart Routing

**Modal Video:** 15s loop showing route comparison animation
**Description:**
> Our AI analyzes every shipment and selects the optimal carrier based on your priorities: speed, cost, or reliability. No manual comparison needed. Set your rules once, and we handle every decision.

**Benefits:**
- Compares 15+ carriers in real-time
- Saves average 40% on shipping costs
- Auto-selects based on your custom rules
- Falls back to backup carrier if primary fails
- Carbon-smart routing option

**Add-on:**
> Express Handling (+$1.50/pkg)
> Priority processing, delivered 1-2 days faster.
> ✓ 48% better success rate on fragile items

---

### 2. Store Integration

**Modal Video:** 15s loop showing Shopify connection flow
**Description:**
> Connect your store in 60 seconds. Orders flow in, labels flow out. We support Shopify, WooCommerce, Amazon, Etsy, and custom platforms via API. One connection, forever synced.

**Benefits:**
- 1-click Shopify & WooCommerce install
- Amazon SP-API native integration
- Auto-sync orders every 30 seconds
- Inventory levels pushed back to store
- Multi-store support (unlimited)

**Add-on:**
> Priority Sync (+$9/mo)
> Real-time order sync (5-second intervals)
> ✓ Best for flash sales and high-volume events

---

### 3. Customs & Compliance

**Modal Video:** 15s loop showing form auto-fill
**Description:**
> Selling internationally? We auto-generate HS codes, calculate duties, and complete all customs paperwork. Dangerous goods (batteries, liquids) handled with proper documentation.

**Benefits:**
- Automatic HS code classification
- Duties & taxes pre-calculated at checkout
- Dangerous goods documentation (DGD)
- Commercial invoices auto-generated
- Compliance with EU, US, UAE regulations

**Add-on:**
> Compliance Insurance (+$2.50/shipment)
> Coverage if customs documentation is rejected.
> ✓ 100% refund on duties paid in error

---

### 4. Failed Delivery Recovery

**Modal Video:** 15s loop showing rerouting flow
**Description:**
> When a delivery fails (address wrong, recipient unavailable), we don't return it to you. We reroute it to our nearest warehouse, hold it, and let your customer reschedule. No lost inventory.

**Benefits:**
- Auto-reroute to local fulfillment center
- Customer self-serve rescheduling
- 3-attempt delivery guarantee
- Return-to-sender prevention
- Real-time failure alerts

**Add-on:**
> Extended Hold (+$0.50/day after 7 days)
> Keep packages in warehouse up to 30 days.
> ✓ Perfect for vacationing customers

---

### 5. WhatsApp Notifications

**Modal Video:** 15s loop showing WhatsApp conversation
**Description:**
> Your customers get shipping updates where they actually look — WhatsApp. 90%+ open rates. Branded messages with your logo. Customers can reply to reschedule or ask questions.

**Benefits:**
- 90%+ open rate (vs. 20% email)
- Branded with your logo & colors
- Two-way: customers can reply
- Delivery reminders reduce failed attempts
- Multi-language support

**Add-on:**
> SMS Fallback (+$0.03/message)
> Auto-send SMS if WhatsApp delivery fails.
> ✓ 99.9% deliverability guarantee

---

### 6. Done-For-You Store

**Modal Video:** 15s loop showing store being built
**Description:**
> No website? No problem. We build a complete, branded Shopify store for you. Product pages, payment gateway, shipping integrated — everything. You focus on products; we handle tech.

**Benefits:**
- Full Shopify store setup
- Custom branding & design
- Payment gateway configured
- Shipping already integrated
- Launch in 7-14 days

**Add-on:**
> Monthly Maintenance (+$99/mo)
> We manage updates, backups, and small changes.
> ✓ 24-hour response time on support requests

---

## UPSELL PSYCHOLOGY (Pattern)

The add-on panel uses **completion framing**, not sales pressure:

**Wrong:** "Want to add Express Handling?"
**Right:** "Complete your shipping setup:"

**Wrong:** "Only $1.50 more!"
**Right:** Show price matter-of-factly, focus on benefit metric

**Wrong:** Pre-check the box
**Right:** Visually highlight it, but user must actively choose

The **benefit metric** (e.g., "48% better success rate") provides rational justification for the emotional decision.

---

## COMPARISON TABLE SECTION

### Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│              The WooParcel Difference                           │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │               │   Before        │   With WooParcel        │ │
│  ├───────────────┼─────────────────┼─────────────────────────┤ │
│  │ Carrier       │ 2-3 options     │ 15+ compared instantly  │ │
│  │ Selection     │ manual check    │                         │ │
│  ├───────────────┼─────────────────┼─────────────────────────┤ │
│  │ Customs       │ Hours of        │ Auto-generated in       │ │
│  │ Paperwork     │ form-filling    │ seconds                 │ │
│  ├───────────────┼─────────────────┼─────────────────────────┤ │
│  │ Failed        │ Lost inventory  │ Auto-rerouted and       │ │
│  │ Deliveries    │ returned to you │ recovered               │ │
│  ├───────────────┼─────────────────┼─────────────────────────┤ │
│  │ Customer      │ "Where is my    │ Proactive WhatsApp      │ │
│  │ Updates       │ order?" emails  │ updates, 90% read       │ │
│  └───────────────┴─────────────────┴─────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Animation
- Table rows reveal on scroll (stagger 100ms)
- "Before" column has subtle red tint on hover
- "With WooParcel" column has subtle gold tint on hover

---

## FAQ ACCORDION

### Questions (from original site + expanded)

1. How do I properly package a parcel?
2. What objects and substances are prohibited for transport?
3. What are the weight and dimension limits for shipments?
4. How do I place an order?
5. When and how do I pay?
6. What is the electronic Wallet?
7. What is cash on delivery and how long does it take to be paid?
8. What happens to the parcel if it is not picked up by the recipient?
9. What do I do if I entered the recipient's details incorrectly?
10. What do I do if I didn't include the cash on delivery amount in the order?
11. What do I do if I want to cancel the cash on delivery amount from the order?
12. How do I cancel an order?
13. How long does it take to get my money back after canceling an order?

### Accordion Behavior

- Only one open at a time
- Smooth height animation (300ms)
- Icon rotates 180° when open
- Scroll into view if opened item is below fold

### Accordion Styling

```css
.faq-item {
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.faq-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 0;
  cursor: pointer;
  font-size: 18px;
  font-weight: 500;
  color: var(--text-primary);
}

.faq-question:hover {
  color: var(--accent-woop);
}

.faq-answer {
  color: var(--text-secondary);
  font-size: 16px;
  line-height: 1.6;
  padding-bottom: 24px;
}

.faq-icon {
  transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1);
}

.faq-item.open .faq-icon {
  transform: rotate(180deg);
}
```

---

## RESPONSIVE BEHAVIOR

### Desktop (≥1024px)
- 3-column service grid
- Modal centered, 680px max-width
- Table horizontal

### Tablet (768px – 1023px)
- 2-column service grid
- Modal full-width with side padding
- Table scrollable horizontal

### Mobile (<768px)
- 1-column service grid
- Modal full-screen (sheet style, slides up)
- Table stacked vertically
- FAQ questions slightly smaller text

---

**Next Document:** `04-onboarding-flow.md` — Adam questionnaire rebuild
